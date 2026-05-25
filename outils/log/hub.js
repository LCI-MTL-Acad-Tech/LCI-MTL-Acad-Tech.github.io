// ── Hub admin dashboard ───────────────────────────────────────
// No backend · no persistence · no cookies
// All state lives in memory and is gone on refresh.

let students = [];        // all built rows
let hubMilestones = {};   // { [project_id]: { exported_at, project } } — loaded from uploaded milestone files
// Pairs dismissed as "not the same person" — key is "uuidA|uuidB" (sorted)
const dismissedDupPairs = new Set(
  JSON.parse(sessionStorage.getItem("hub_dismissed_dups") || "[]")
);
let filtered  = [];       // after filters
let sortCol   = "track_pct";
let sortDir   = 1;
let hubView   = "students"; // "students" | "course" | "competency"

// Program palette — consistent colour per program code
const PROG_COLORS = {};
const PALETTE = ["#00587c","#9b3fd4","#c24800","#2e8a5e","#4a38d4",
                 "#c41a23","#9a6c00","#1e6e8e","#7341a0","#3e6b00"];
let palIdx = 0;
function programColor(prog) {
  const key = prog?.slice(0,6) || "?";
  if (!PROG_COLORS[key]) PROG_COLORS[key] = PALETTE[palIdx++ % PALETTE.length];
  return PROG_COLORS[key];
}

// ── Init ──────────────────────────────────────────────────────
// Active quick-filter values (program / teacher buttons)
let activeProgram   = "";
let activeTeacher   = "";
let activeIntegrity = false; // filter: show only students with integrity issues

document.addEventListener("DOMContentLoaded", () => {
  // Only run hub-specific init when on the actual hub page
  if (!document.getElementById("hub-drop-inline")) return;

  initPage();
  setupHubDrop();

  // Re-render all JS-generated content when language changes
  const langObserver = new MutationObserver(() => {
    if (students.length) {
      populateFilterOptions();
      renderStats();
      renderHoursChart();
      renderProgramPie();
      renderCurrentView();
    }
  });
  langObserver.observe(document.documentElement, { attributes: true, attributeFilter: ["lang"] });

  // Re-render hours chart when the card resizes (responsive bar widths)
  const chartWrap = document.querySelector(".bar-chart-wrap");
  if (chartWrap && window.ResizeObserver) {
    let resizeTimer;
    new ResizeObserver(() => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => { if (students.length) renderHoursChart(); }, 60);
    }).observe(chartWrap);
  }
});

function setupHubDrop() {
  // Prevent the browser from navigating away if files are dropped
  // anywhere on the page (not just the drop zone)
  document.addEventListener("dragover",  e => e.preventDefault());
  document.addEventListener("drop",      e => e.preventDefault());

  // Wire the drop zone properly via addEventListener
  // (more reliable than inline handlers across all browsers)
  const zone = document.getElementById("hub-drop-inline");
  if (!zone) return;

  zone.addEventListener("dragover", e => {
    e.preventDefault();
    e.stopPropagation();
    zone.style.borderColor = "var(--accent)";
    zone.style.background  = "var(--bg-subtle)";
  });
  zone.addEventListener("dragleave", e => {
    e.preventDefault();
    zone.style.borderColor = "";
    zone.style.background  = "";
  });
  zone.addEventListener("drop", e => {
    e.preventDefault();
    e.stopPropagation();
    zone.style.borderColor = "";
    zone.style.background  = "";
    loadFiles(e.dataTransfer.files);
  });
}

// ── File type detection ───────────────────────────────────────
// Returns: "daily" | "weekly" | "full" | "reflection" | "config" | "unknown"
function detectFileType(d) {
  const type = d.meta?.type;
  if (type === "config")     return "config";
  if (type === "reflection") return "reflection";
  if (type === "weekly")     return "weekly";
  if (type === "full")       return "full";
  if (type === "milestones") return "milestones";
  if (!d.profile?.full_name) return "unknown";
  if (d.reflection && !d.logs?.length) return "reflection";
  if (d.logs?.length > 1)   return "weekly"; // merged multi-day
  if (d.logs?.length === 1) return "daily";
  return "unknown";
}

// ── File loading ──────────────────────────────────────────────
function loadFiles(fileList) {
  const files = Array.from(fileList).filter(f => f.name.endsWith(".json"));
  if (!files.length) return;

  const readers = files.map(f => new Promise(res => {
    const r = new FileReader();
    r.onload = e => {
      try { res({ data: JSON.parse(e.target.result), name: f.name }); }
      catch (err) {
        console.error(`[LCI Hub] Failed to parse JSON: "${f.name}"`, err);
        res(null);
      }
    };
    r.readAsText(f);
  }));

  Promise.all(readers).then(parsed => {
    const enriched = parsed
      .filter(p => {
        if (!p?.data) {
          console.error(`[LCI Hub] File skipped — could not be read (null result).`);
          return false;
        }
        return true;
      })
      .map(p => {
        const type = detectFileType(p.data);
        console.info(`[LCI Hub] "${p.name}" → detected type: ${type}`);
        return { ...p, type };
      });

    // Separate config files from log/report files
    const configFiles    = enriched.filter(p => p.type === "config");
    const milestoneFiles = enriched.filter(p => p.type === "milestones");

    // Merge milestone files into the hub milestone store
    if (milestoneFiles.length) {
      milestoneFiles.forEach(p => {
        (p.data.projects || []).forEach(project => {
          if (!project?.id) return;
          hubMilestones[project.id] = { exported_at: p.data.meta?.exported_at, project };
        });
        console.info(`[LCI Hub] Loaded milestones from "${p.name}" (${(p.data.projects||[]).length} project(s))`);
      });
    }

    const valid = enriched.filter(p => {
      if (p.type === "unknown") {
        console.warn(`[LCI Hub] "${p.name}" → type "unknown": no profile.full_name and no recognized meta.type.`, {
          meta: p.data.meta,
          has_full_name: !!p.data.profile?.full_name,
          has_logs: !!(p.data.logs?.length),
        });
        return false;
      }
      if (p.type === "config")     return false; // handled separately
      if (p.type === "milestones") return false; // handled above
      if (!p.data.profile?.full_name) {
        console.warn(`[LCI Hub] "${p.name}" → skipped: missing profile.full_name.`, p.data.profile);
        return false;
      }
      return true;
    });

    // Build config context map: uuid → context
    const configByUUID = {};
    configFiles.forEach(({ data: d, name }) => {
      const uid = d.meta?.student_uuid || d.profile?.student_id;
      if (uid && d.context) {
        configByUUID[uid] = d.context;
        console.info(`[LCI Hub] Config "${name}" → mapped to UUID ${uid}`);
      } else {
        console.warn(`[LCI Hub] Config "${name}" → skipped: missing student UUID or context.`, {
          uuid: d.meta?.student_uuid,
          student_id: d.profile?.student_id,
          has_context: !!d.context,
        });
      }
    });

    if (!valid.length && !configFiles.length) {
      setStatus("Aucun fichier valide trouvé.", "error"); return;
    }
    if (!valid.length && configFiles.length) {
      // Only configs uploaded — update existing rows OR create new stub rows
      configFiles.forEach(({ data: cfg, name }) => {
        const uid = cfg.meta?.student_uuid || cfg.profile?.student_id;
        if (!uid) {
          console.warn(`[LCI Hub] Config "${name}" → cannot create student row: no UUID.`);
          return;
        }
        const existing = students.findIndex(s => s.uuid === uid);

        if (existing >= 0) {
          // Update existing row context
          const prevCounts = students[existing].file_type_counts || {};
          const ctx = cfg.context || {};
          const mergedData = {
            ...students[existing].raw,
            context: {
              ...students[existing].raw.context,
              start_date:          ctx.start_date          || students[existing].raw.context?.start_date,
              scheduled_end_date:  ctx.scheduled_end_date  || students[existing].raw.context?.scheduled_end_date,
              planned_absences:    ctx.planned_absences    ?? students[existing].raw.context?.planned_absences    ?? [],
              work_days:           ctx.work_days           ?? students[existing].raw.context?.work_days           ?? [1,2,3,4,5],
              work_hours:          ctx.work_hours          ?? students[existing].raw.context?.work_hours,
              work_hours_by_day:   ctx.work_hours_by_day   ?? students[existing].raw.context?.work_hours_by_day   ?? {},
              work_hours_date_overrides: ctx.work_hours_date_overrides ?? students[existing].raw.context?.work_hours_date_overrides ?? {},
              calendar_week_start: ctx.calendar_week_start ?? students[existing].raw.context?.calendar_week_start ?? 1,
            },
          };
          students[existing] = buildRow(mergedData);
          students[existing].file_type_counts = { ...prevCounts, config: (prevCounts.config || 0) + 1 };
          console.info(`[LCI Hub] Config "${name}" → updated existing row for ${cfg.profile?.full_name || uid}`);

        } else {
          // No matching row — bootstrap a stub from this config (zero logs)
          if (!cfg.profile?.full_name) {
            console.warn(`[LCI Hub] Config "${name}" → cannot create student row: missing profile.full_name.`);
            return;
          }
          const stub = {
            meta:           { ...cfg.meta, student_uuid: uid },
            profile:        cfg.profile  || {},
            pathway:        cfg.pathway  || "company",
            context:        cfg.context  || {},
            people:         cfg.people   || [],
            projects:       cfg.projects || [],
            activity_types: cfg.activity_types || [],
            tools:          cfg.tools    || [],
            logs:           [],
            reflection:     null,
            todos:          [],
          };
          const row = buildRow(stub);
          row.file_type_counts = { daily: 0, weekly: 0, full: 0, reflection: 0, config: 1 };
          students.push(row);
          console.info(`[LCI Hub] Config "${name}" → created stub row for ${cfg.profile.full_name} (no logs yet)`);
        }
      });

      const nC = configFiles.length;
      const nS = students.length;
      setStatus(`${nC} fichier${nC > 1 ? "s" : ""} de configuration — ${nS} étudiant·e${nS > 1 ? "·s" : ""} au total.`);
      document.getElementById("btn-csv").style.display   = "";
      document.getElementById("btn-clear").style.display = "";
      document.getElementById("hub-dashboard").style.display = "block";
      document.getElementById("hub-upload-strip")?.classList.add("hub-upload-strip--loaded");
      populateFilterOptions();
      applyFilters();
      return;
    }

    // ── Content-based deduplication ───────────────────────────
    // Windows adds (1), (2) etc. when re-downloading a file. We deduplicate by
    // content: within the same UUID, if one file's log_ids are a subset of
    // another's (and the other is newer by meta.last_modified), discard the older.
    const deduped = (() => {
      // Derive a stable group key for a parsed file.
      // Priority: meta.student_uuid → student_id from profile → student ID parsed
      // from filename (pattern: {digits}_{date}... or {digits}_weekly_...) → filename.
      function groupKey(p) {
        const raw = p.data.meta?.student_uuid || p.data.profile?.student_id;
        if (raw) return normId(raw) || raw;
        // Try to extract leading digits from filename (e.g. "202411884_2026-05-22_r1.json")
        const m = p.name.match(/^(\d{5,10})[_\-]/);
        if (m) return normId(m[1]) || m[1];
        return p.name;
      }

      const byUID = {};
      valid.forEach(p => {
        const uid = groupKey(p);
        (byUID[uid] = byUID[uid] || []).push(p);
      });

      const result = [];
      Object.entries(byUID).forEach(([uid, group]) => {
        if (group.length === 1) { result.push(group[0]); return; }

        // Sort newest-first by last_modified
        group.sort((a, b) => {
          const ta = a.data.meta?.last_modified || a.data.meta?.exported_at || "";
          const tb = b.data.meta?.last_modified || b.data.meta?.exported_at || "";
          return tb.localeCompare(ta);
        });

        const logIdSets = group.map(p => {
          const ids = (p.data.logs || []).map(l => l.log_id).sort().join(",");
          return ids;
        });
        const keep = new Set(group.map((_, i) => i));
        for (let i = 0; i < group.length; i++) {
          if (!keep.has(i)) continue;
          for (let j = i + 1; j < group.length; j++) {
            if (!keep.has(j)) continue;
            // Only drop j if it has IDENTICAL log_ids to i (true Windows duplicate)
            // i is newer (sorted newest-first), so j is the redundant copy
            if (logIdSets[i] === logIdSets[j]) {
              console.info(`[LCI Hub] Deduped "${group[j].name}" — identical log_ids to "${group[i].name}" (Windows duplicate)`);
              keep.delete(j);
            }
          }
        }
        keep.forEach(i => result.push(group[i]));
      });
      return result;
    })();

    const dedupedCount = valid.length - deduped.length;
    if (dedupedCount > 0) {
      console.info(`[LCI Hub] Removed ${dedupedCount} duplicate snapshot file(s) based on content.`);
    }

    // Group log files by UUID
    const byUUID     = {};
    const typesByUUID = {};

    deduped.forEach(({ data: d, type, name }) => {
      const rawUid = d.meta?.student_uuid || d.profile?.student_id;
      let uid;
      if (rawUid) {
        uid = /^\d{7,9}$/.test(rawUid) ? normId(rawUid) : rawUid;
      } else {
        // Fall back to student ID parsed from filename
        const m = name.match(/^(\d{5,10})[_\-]/);
        uid = m ? normId(m[1]) : name;
      }
      (byUUID[uid] = byUUID[uid] || []).push(d);
      const c = (typesByUUID[uid] = typesByUUID[uid] || { daily:0, weekly:0, full:0, reflection:0, config:0 });
      if (type in c) c[type]++;
    });

    // Count config files per UUID
    configFiles.forEach(({ data: d }) => {
      const uid = d.meta?.student_uuid || d.profile?.student_id;
      if (!uid) return;
      const c = (typesByUUID[uid] = typesByUUID[uid] || { daily:0, weekly:0, full:0, reflection:0, config:0 });
      c.config++;
    });

    const newRows = Object.entries(byUUID).map(([uid, grp]) => {
      let base;
      if (grp.length === 1) {
        base = grp[0];
      } else {
        let merged;
        try {
          merged = mergeInternshipFiles(grp);
        } catch (e) {
          console.error(`[LCI Hub] mergeInternshipFiles threw for UUID ${uid} — using first file as fallback.`, e);
          merged = { valid: false, errors: [e.message], warnings: [], data: grp[0] };
        }
        if (merged.valid) {
          base = merged.data;
        } else {
          console.error(`[LCI Hub] Merge failed for UUID ${uid} (${grp.length} files) — using first file as fallback.`,
            { errors: merged.errors, warnings: merged.warnings });
          base = grp[0];
        }
      }

      // If a config file was uploaded for this student, overlay its context fields
      // (planned_absences, work_days, work_hours take priority over what's in log files)
      if (configByUUID[uid]) {
        base = {
          ...base,
          context: {
            ...base.context,
            planned_absences:    configByUUID[uid].planned_absences    ?? base.context?.planned_absences    ?? [],
            work_days:           configByUUID[uid].work_days           ?? base.context?.work_days           ?? [1,2,3,4,5],
            work_hours:          configByUUID[uid].work_hours          ?? base.context?.work_hours,
            work_hours_by_day:   configByUUID[uid].work_hours_by_day   ?? base.context?.work_hours_by_day   ?? {},
            work_hours_date_overrides: configByUUID[uid].work_hours_date_overrides ?? base.context?.work_hours_date_overrides ?? {},
            calendar_week_start: configByUUID[uid].calendar_week_start ?? base.context?.calendar_week_start ?? 1,
          },
        };
      }

      const row = buildRow(base);
      row.file_type_counts = typesByUUID[uid] || { daily:0, weekly:0, full:0, reflection:0, config:0 };
      return row;
    });

    // Deduplicate / update by UUID — merge file type counts on re-upload
    newRows.forEach(r => {
      const existing = students.findIndex(s => s.uuid === r.uuid);
      if (existing >= 0) {
        const prev = students[existing].file_type_counts || { daily:0, weekly:0, full:0, reflection:0, config:0 };
        r.file_type_counts = {
          daily:      prev.daily      + r.file_type_counts.daily,
          weekly:     prev.weekly     + r.file_type_counts.weekly,
          full:       prev.full       + r.file_type_counts.full,
          reflection: prev.reflection + r.file_type_counts.reflection,
          config:     prev.config     + r.file_type_counts.config,
        };
        students[existing] = r;
      } else {
        students.push(r);
      }
    });

    // Stub rows for config-only students not covered by any log file
    configFiles.forEach(({ data: cfg, name }) => {
      const uid = cfg.meta?.student_uuid || cfg.profile?.student_id;
      if (!uid || !cfg.profile?.full_name) return;
      const alreadyIn = students.some(s => s.uuid === uid);
      if (!alreadyIn) {
        const stub = {
          meta:           { ...cfg.meta, student_uuid: uid },
          profile:        cfg.profile  || {},
          pathway:        cfg.pathway  || "company",
          context:        cfg.context  || {},
          people:         cfg.people   || [],
          projects:       cfg.projects || [],
          activity_types: cfg.activity_types || [],
          tools:          cfg.tools    || [],
          logs:           [],
          reflection:     null,
          todos:          [],
        };
        const row = buildRow(stub);
        row.file_type_counts = { daily: 0, weekly: 0, full: 0, reflection: 0, config: 1 };
        students.push(row);
        console.info(`[LCI Hub] Config "${name}" → stub row for ${cfg.profile.full_name} (no logs yet)`);
      }
    });

    const nS = students.length;
    const nF = valid.length;
    const nC = configFiles.length;
    const nUnknown = enriched.filter(p => p.type === "unknown").length;
    const nFailed  = parsed.filter(p => !p?.data).length;

    console.group(`[LCI Hub] Load complete — ${nF} file(s) → ${nS} student(s)`);
    console.info("Students loaded:", students.map(s => ({
      name: s.name,
      uuid: s.uuid,
      logs: s.log_count,
      file_types: s.file_type_counts,
    })));
    if (nC)       console.info(`Config files applied: ${nC}`);
    if (nUnknown) {
      const unknownNames = enriched.filter(p => p.type === "unknown").map(p => p.name);
      console.warn(`[LCI Hub] ${nUnknown} file(s) of unknown type skipped:`, unknownNames);
    }
    if (nFailed)  console.error(`Files that failed to parse: ${nFailed}`);
    console.groupEnd();

    let statusMsg = `${nS} étudiant·e${nS > 1 ? "·s" : ""} chargé·e${nS > 1 ? "·s" : ""} — ${nF} fichier${nF > 1 ? "s" : ""} traité${nF > 1 ? "s" : ""}`;
    if (nC > 0) statusMsg += ` + ${nC} config`;
    setStatus(statusMsg + ".");

    document.getElementById("btn-csv").style.display   = "";
    document.getElementById("btn-clear").style.display = "";
    document.getElementById("hub-dashboard").style.display = "block";
    document.getElementById("hub-upload-strip")?.classList.add("hub-upload-strip--loaded");

    populateFilterOptions();
    applyFilters();
  });
}

function clearAll() {
  students = []; filtered = [];
  document.getElementById("hub-dashboard").style.display = "none";
  document.getElementById("btn-csv").style.display = "none";
  document.getElementById("btn-clear").style.display = "none";
  document.getElementById("hub-upload-strip")?.classList.remove("hub-upload-strip--loaded");
  setStatus("Dépose les JSON des étudiant·e·s ici — journaux, bilans et fichiers de configuration.");
}

function setStatus(msg) {
  const el = document.getElementById("hub-status-text");
  if (el) el.textContent = msg;
}

// ── Work-day helpers (hub-side) ───────────────────────────────
// Count expected working days in [fromDate, toDate] inclusive,
// respecting work_days schedule and excluding planned_absences.
// Count expected working days in [fromISO, toISO] inclusive,
// respecting work_days schedule and excluding planned_absences.
// Optimized: full weeks (Mon→Sun or configured boundaries) are counted
// in bulk; only the partial weeks at each end are iterated day-by-day.
function countWorkDays(fromISO, toISO, workDays, absenceDates) {
  if (!fromISO || !toISO || fromISO > toISO) return 0;

  const absent    = new Set(absenceDates || []);
  const workSet   = new Set(workDays || [1,2,3,4,5]);
  const daysPerWk = workSet.size; // how many days/week are work days

  let from = new Date(fromISO + "T12:00:00");
  const to = new Date(toISO   + "T12:00:00");
  let count = 0;

  // Advance to the next Monday (start of a full ISO week boundary)
  while (from <= to && from.getDay() !== 1) {
    if (workSet.has(from.getDay()) && !absent.has(from.toISOString().slice(0,10)))
      count++;
    from.setDate(from.getDate() + 1);
  }

  // Count full weeks in bulk, then subtract absences that fall within them
  if (from <= to) {
    const msLeft      = to - from + 86400000; // inclusive
    const fullWeeks   = Math.floor(msLeft / (7 * 86400000));
    const fullWeekEnd = new Date(from.getTime() + fullWeeks * 7 * 86400000 - 86400000);

    if (fullWeeks > 0) {
      count += fullWeeks * daysPerWk;
      // Subtract planned absences that fall within the full-weeks block
      absent.forEach(iso => {
        const ad = new Date(iso + "T12:00:00");
        if (ad >= from && ad <= fullWeekEnd && workSet.has(ad.getDay())) count--;
      });
      from = new Date(fullWeekEnd.getTime() + 86400000);
    }
  }

  // Remaining partial week — day-by-day
  while (from <= to) {
    if (workSet.has(from.getDay()) && !absent.has(from.toISOString().slice(0,10)))
      count++;
    from.setDate(from.getDate() + 1);
  }

  return Math.max(count, 0);
}

// Count expected working days that have no log and are not planned absences,
// from the day after lastLogDate up to and including today.
function countWorkingDaysAbsent(lastLogISO, todayISO, workDays, absenceDates) {
  if (!lastLogISO) return null;
  const d = new Date(lastLogISO + "T12:00:00");
  d.setDate(d.getDate() + 1); // start the day after last log
  const from = d.toISOString().slice(0, 10);
  if (from > todayISO) return 0;
  return countWorkDays(from, todayISO, workDays, absenceDates);
}

// ── Build row data from one student JSON ──────────────────────
function buildRow(data) {
  const logs  = (data.logs || []).sort((a, b) => a.date.localeCompare(b.date));
  const today = new Date().toISOString().slice(0, 10);
  const ctx   = data.context || {};

  const startDate      = ctx.start_date;
  const endDate        = ctx.scheduled_end_date;
  const workDays       = ctx.work_days   || [1,2,3,4,5];
  const workHours      = ctx.work_hours  || { h: 7, m: 30 };
  const absenceDates   = (ctx.planned_absences || []).map(a => a.date);
  const totalTarget    = parseFloat(ctx.total_hours_target) || null;

  // Real work-days elapsed: start → yesterday (today not yet finished)
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayISO    = yesterday.toISOString().slice(0, 10);
  const workDaysElapsed = startDate
    ? countWorkDays(startDate, yesterdayISO, workDays, absenceDates)
    : 0;

  // Sum expected minutes day-by-day, respecting per-day schedule when set.
  function sumExpectedMinutes(from, to) {
    if (!from || !to) return 0;
    const dateOverrides = ctx.work_hours_date_overrides || {};
    let mins = 0;
    let cur = new Date(from + "T12:00:00");
    const end = new Date(to + "T12:00:00");
    while (cur <= end) {
      const ds  = cur.toISOString().slice(0, 10);
      const dow = cur.getDay();
      if (workDays.includes(dow) && !absenceDates.includes(ds)) {
        const override = dateOverrides[ds];
        mins += override ? workHoursToMinutes(override) : getWorkMinutesForDay(ctx, dow);
      }
      cur.setDate(cur.getDate() + 1);
    }
    return mins;
  }

  // Expected hours so far
  const expectedHours = totalTarget
    ? (() => {
        const totalMins   = sumExpectedMinutes(startDate, endDate);
        const elapsedMins = sumExpectedMinutes(startDate, yesterdayISO);
        return totalMins > 0
          ? +(totalTarget * (elapsedMins / totalMins)).toFixed(1)
          : 0;
      })()
    : +(sumExpectedMinutes(startDate, yesterdayISO) / 60).toFixed(1);

  const actualHours = +(logs.reduce((s, l) =>
    s + (l.task_total_minutes || l.day_duration_minutes || 0), 0) / 60).toFixed(1);

  const futureHours = +(logs.filter(l => l.future_filing).reduce((s, l) =>
    s + (l.task_total_minutes || l.day_duration_minutes || 0), 0) / 60).toFixed(1);

  const trackPct  = expectedHours > 0 ? Math.round((actualHours / expectedHours) * 100) : null;
  const trackBand = trackPct === null ? "none"
    : trackPct >= 90 ? "green"
    : trackPct >= 70 ? "amber"
    : "red";

  // This week
  const weekStart = getWeekStartISO(today);
  const weekHours = +(logs
    .filter(l => getWeekStartISO(l.date) === weekStart)
    .reduce((s, l) => s + (l.task_total_minutes || l.day_duration_minutes || 0), 0) / 60).toFixed(1);

  // AWOL: working days absent = expected work days since last log with no log and no planned absence
  const lastLog    = logs[logs.length - 1]?.date || null;
  const workingDaysAbsent = countWorkingDaysAbsent(lastLog, today, workDays, absenceDates);

  // Keep calendar days_since for display only (date label)
  const daysSince  = lastLog
    ? Math.floor((new Date(today) - new Date(lastLog)) / 86400000)
    : null;

  const ratings   = logs.filter(l => l.day_rating).map(l => l.day_rating);
  const avgRating = ratings.length
    ? +(ratings.reduce((a, b) => a + b) / ratings.length).toFixed(1) : null;

  const actTotals = {};
  logs.forEach(l => (l.tasks || []).forEach(t => {
    const tid = t.activity_type_id || "sys-gray";
    actTotals[tid] = (actTotals[tid] || 0) + (t.duration_minutes || 0);
  }));

  const lastWithObstacle = [...logs].reverse().find(l => l.obstacle);
  const lastWithPlan     = [...logs].reverse().find(l => l.plan_tomorrow);
  const lastWrap         = [...logs].reverse().find(l => l.weekly_wrap?.highlight);

  // ── Competency coverage ───────────────────────────────────────
  let competency_coverage = [];
  const courseCode  = ctx.internship_course_code || "generic";
  const programCode = data.profile?.program || "";
  if (typeof getStudentCompetencies === "function") {
    const comps = getStudentCompetencies(courseCode, programCode);

    const toWeekKey = dateStr => {
      const d = new Date(dateStr + "T12:00:00");
      const day = d.getDay() || 7;
      d.setDate(d.getDate() - day + 1);
      return d.toISOString().slice(0, 10);
    };

    competency_coverage = comps.map(comp => {
      const allWeeks = new Set(logs.map(l => toWeekKey(l.date)));
      let totalEngagement = 0, weeklyCount = 0, dailyCount = 0;

      allWeeks.forEach(wk => {
        const weekLogs  = logs.filter(l => toWeekKey(l.date) === wk);
        const dailyDays = weekLogs.filter(l => l.competency_notes?.[comp.code]);
        const d         = dailyDays.length;
        const hasWeekly = weekLogs.some(l => l.weekly_wrap?.competency_notes?.[comp.code]);
        if (hasWeekly) weeklyCount++;
        dailyCount += d;
        totalEngagement += d > 0 ? d : (hasWeekly ? 1 : 0);
      });

      const elapsedWeeks = allWeeks.size;
      const pct = elapsedWeeks > 0
        ? Math.min(100, Math.round((totalEngagement / elapsedWeeks) * 100))
        : 0;

      return { code: comp.code, title: comp.title, weekly_count: weeklyCount,
               daily_count: dailyCount, elapsed_weeks: elapsedWeeks,
               total_engagement: totalEngagement, pct };
    });
  }

  // ── Outcome coverage (learning_refs on tasks) ─────────────────
  let outcome_coverage = [];
  if (typeof getStudentOutcomes === "function") {
    const outcomes = getStudentOutcomes(programCode);
    // Count how many tasks reference each outcome across all logs
    const refCounts = {};
    logs.forEach(log => {
      (log.tasks || []).forEach(task => {
        (task.learning_refs || []).forEach(ref => {
          if (ref.type === "outcome") {
            refCounts[ref.id] = (refCounts[ref.id] || 0) + 1;
          }
        });
      });
    });
    outcome_coverage = outcomes.map(o => ({
      id:    o.id,
      fr:    o.fr,
      en:    o.en,
      count: refCounts[o.id] || 0,
    }));
  }

  // ── Filing integrity analysis ─────────────────────────────────
  // Detects patterns suggesting logs were not written in real time.
  const integrity = (function() {
    if (!logs.length) return { ok: true, future_count: 0, late_count: 0 };

    const futureFiled = logs.filter(l => l.future_filing);
    const lateFiled   = logs.filter(l => l.late_filing);

    // Clustering: are created_at timestamps bunched in a suspiciously short window?
    const createdDates = logs
      .map(l => l.created_at || l.saved_at)
      .filter(Boolean)
      .map(ts => ts.slice(0, 10))
      .sort();

    let clusterFlag = false, clusterDetail = "";
    if (createdDates.length >= 5 && startDate && endDate) {
      const internSpan = Math.max(1,
        (new Date(endDate) - new Date(startDate)) / 86400000);
      const createdSpan = Math.max(0,
        (new Date(createdDates[createdDates.length - 1]) - new Date(createdDates[0])) / 86400000);
      if (createdSpan / internSpan < CLUSTER_THRESHOLD_PCT) {
        clusterFlag   = true;
        clusterDetail = `${Math.round(createdSpan)}j span / ${Math.round(internSpan)}j stage`;
      }
    }

    // Export lag: file last_modified vs last log date
    const lastModified = data.meta?.last_modified;
    const lastLogDate  = logs[logs.length - 1]?.date;
    let lagFlag = false, lagDays = 0;
    if (lastModified && lastLogDate) {
      lagDays = Math.round(
        (new Date(lastModified.slice(0, 10)) - new Date(lastLogDate)) / 86400000);
      if (lagDays > LAG_THRESHOLD_DAYS) lagFlag = true;
    }

    return {
      ok:             futureFiled.length === 0 && !clusterFlag && !lagFlag,
      future_count:   futureFiled.length,
      future_dates:   futureFiled.map(l => l.date),
      late_count:     lateFiled.length,
      cluster_flag:   clusterFlag,
      cluster_detail: clusterDetail,
      lag_flag:       lagFlag,
      lag_days:       lagDays,
    };
  })();

  return {
    uuid:               data.meta?.student_uuid || data.profile?.student_id,
    name:               data.profile?.full_name || "—",
    student_id:         data.profile?.student_id || "—",
    email:              data.profile?.email || "",
    program:            data.profile?.program || "—",
    teacher:            data.profile?.supervising_professor || "—",
    cohort:             data.profile?.cohort || "—",
    pathway:            data.pathway || "—",
    course_code:        courseCode,
    days_logged:        logs.length,
    work_days_elapsed:  workDaysElapsed,
    expected_hours:     expectedHours,
    actual_hours:       actualHours,
    future_hours:       futureHours,
    track_pct:          trackPct,
    track_band:         trackBand,
    week_hours:         weekHours,
    last_log:           lastLog,
    days_since:         daysSince,
    working_days_absent: workingDaysAbsent,
    avg_rating:         avgRating,
    has_reflection:     !!(data.reflection && Object.keys(data.reflection).length > 0),
    act_totals:         actTotals,
    mood_points:        logs.map(l => l.day_rating).filter(Boolean),
    last_obstacle:      lastWithObstacle ? { date: lastWithObstacle.date, text: lastWithObstacle.obstacle, response: lastWithObstacle.obstacle_response } : null,
    last_plan:          lastWithPlan     ? { date: lastWithPlan.date, text: lastWithPlan.plan_tomorrow } : null,
    last_wrap:          lastWrap         ? { date: lastWrap.date, wrap: lastWrap.weekly_wrap }           : null,
    total_target:       totalTarget,
    competency_coverage,
    outcome_coverage,
    integrity,
    raw:                data,
  };
}

function getWeekStartISO(dateStr) {
  const d = new Date(dateStr + "T12:00:00");
  const day = d.getDay() || 7;
  d.setDate(d.getDate() - day + 1);
  return d.toISOString().slice(0, 10);
}

// ── Filters ───────────────────────────────────────────────────
function populateFilterOptions() {
  const programs = [...new Set(students.map(s => s.program))].sort();
  const teachers = [...new Set(students.map(s => s.teacher))].sort();
  const courses  = [...new Set(students.map(s => s.course_code).filter(Boolean))].sort();

  const progSel = document.getElementById("filter-program");
  const cur = progSel.value;
  progSel.innerHTML = '<option value="">Tous les programmes</option>' +
    programs.map(p => `<option value="${escHtml(p)}" ${p===cur?"selected":""}>${escHtml(p)}</option>`).join("");

  const teachSel = document.getElementById("filter-teacher");
  const curT = teachSel.value;
  teachSel.innerHTML = '<option value="">Tous les superviseur·e·s</option>' +
    teachers.map(t => `<option value="${escHtml(t)}" ${t===curT?"selected":""}>${escHtml(t)}</option>`).join("");

  const courseSel = document.getElementById("filter-course");
  if (courseSel) {
    const curC = courseSel.value;
    courseSel.innerHTML = '<option value="">Tous les cours</option>' +
      courses.map(c => {
        const label = (typeof getCourseLabel === "function")
          ? getCourseLabel(c, getCurrentLang()) : c;
        return `<option value="${escHtml(c)}" ${c===curC?"selected":""}>${escHtml(label)}</option>`;
      }).join("");
  }
}

function applyFilters() {
  const prog    = document.getElementById("filter-program").value;
  const teacher = document.getElementById("filter-teacher").value;
  const pathway = document.getElementById("filter-pathway").value;
  const track   = document.getElementById("filter-track").value;
  const course  = document.getElementById("filter-course")?.value || "";
  const search  = document.getElementById("filter-search").value.toLowerCase().trim();

  // Keep quick-filter state in sync with dropdowns
  activeProgram = prog;
  activeTeacher = teacher;

  filtered = students.filter(s => {
    if (prog    && s.program !== prog)          return false;
    if (teacher && s.teacher !== teacher)       return false;
    if (pathway && s.pathway !== pathway)       return false;
    if (track   && s.track_band !== track)      return false;
    if (course  && s.course_code !== course)    return false;
    if (activeIntegrity && s.integrity?.ok !== false) return false;
    if (search  && !s.name.toLowerCase().includes(search)
                && !s.student_id.toLowerCase().includes(search)) return false;
    return true;
  });

  filtered.sort((a, b) => {
    let va = a[sortCol], vb = b[sortCol];
    if (va == null) va = sortDir > 0 ? Infinity : -Infinity;
    if (vb == null) vb = sortDir > 0 ? Infinity : -Infinity;
    if (typeof va === "string") return va.localeCompare(vb) * sortDir;
    return (va - vb) * sortDir;
  });

  document.getElementById("filter-count").textContent =
    `${filtered.length} / ${students.length} étudiant·e·s`;

  renderStats();
  renderDupStudentBanner();
  renderAWOL();
  renderHoursChart();
  renderProgramPie();
  renderCurrentView();
}

function clearFilters() {
  activeProgram = ""; activeTeacher = ""; activeIntegrity = false;
  ["filter-program","filter-teacher","filter-pathway","filter-track","filter-course"].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.value = "";
  });
  document.getElementById("filter-search").value = "";
  applyFilters();
}

function sortBy(col) {
  sortDir = sortCol === col ? sortDir * -1 : 1;
  sortCol = col;
  applyFilters();
}

// ── View mode ─────────────────────────────────────────────────
function setHubView(view) {
  hubView = view;
  // Update toggle button states
  document.querySelectorAll(".hub-view-btn").forEach(b => {
    b.classList.toggle("active", b.dataset.view === view);
  });
  renderCurrentView();
}

function renderCurrentView() {
  const tableWrap  = document.getElementById("hub-table-section");
  const compWrap   = document.getElementById("hub-comp-section");
  const courseWrap = document.getElementById("hub-course-section");
  const calWrap    = document.getElementById("hub-cal-section");

  const mgWrap    = document.getElementById("hub-monthgrid-section");
  if (tableWrap)  tableWrap.style.display  = hubView === "students"   ? "" : "none";
  if (compWrap)   compWrap.style.display   = hubView === "competency" ? "" : "none";
  if (courseWrap) courseWrap.style.display = hubView === "course"     ? "" : "none";
  if (calWrap)    calWrap.style.display    = hubView === "calendar"   ? "" : "none";
  if (mgWrap)     mgWrap.style.display     = hubView === "monthgrid"  ? "" : "none";

  if (hubView === "students")   renderTable();
  if (hubView === "competency") renderCompetencyView();
  if (hubView === "course")     renderCourseView();
  if (hubView === "calendar")   renderCalendarView();
  if (hubView === "monthgrid")  renderMonthGridView();
}

// ── Stat tiles ────────────────────────────────────────────────
// ── Probable duplicate student detection ──────────────────────

// Normalise a string for fuzzy comparison: lowercase, strip accents + punctuation,
// collapse whitespace.
function normStr(s) {
  return (s || "")
    .toLowerCase()
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9 ]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

// Levenshtein distance (capped at maxDist for performance).
function levenshtein(a, b, maxDist = 3) {
  if (Math.abs(a.length - b.length) > maxDist) return maxDist + 1;
  const m = a.length, n = b.length;
  let prev = Array.from({ length: n + 1 }, (_, i) => i);
  for (let i = 1; i <= m; i++) {
    const curr = [i];
    for (let j = 1; j <= n; j++) {
      curr[j] = a[i-1] === b[j-1]
        ? prev[j-1]
        : 1 + Math.min(prev[j-1], prev[j], curr[j-1]);
    }
    prev = curr;
  }
  return prev[n];
}

// Normalise a student ID to digits only, and strip a leading "20" prefix so
// that "2012345" and "12345" compare equal.
function normId(id) {
  let digits = (id || "").replace(/\D/g, "");
  // Strip leading "20" only when it would leave a plausible 5-7 digit ID,
  // i.e. the total length is 7-9 digits (20 + 5-7 core digits).
  if (digits.startsWith("20") && digits.length >= 7 && digits.length <= 9) {
    digits = digits.slice(2);
  }
  return digits;
}

// Find pairs of student rows that are likely the same person.
// Returns array of { a, b, reason } where a/b are row indices in `students`.
// Return sorted word-set of a normalised name string for order-independent comparison.
function nameWords(normName) {
  return normName.split(' ').filter(Boolean).sort();
}
// True if arrays contain the same elements.
function arraysEqual(a, b) {
  return a.length === b.length && a.every((v, i) => v === b[i]);
}
// True if a is a non-empty proper subset of b.
function isSubset(a, b) {
  if (!a.length || !b.length || a.length >= b.length) return false;
  return a.every(w => b.includes(w));
}

function findProbableDuplicates() {
  const pairs = [];
  for (let i = 0; i < students.length; i++) {
    for (let j = i + 1; j < students.length; j++) {
      const si = students[i], sj = students[j];
      const ni = normStr(si.name), nj = normStr(sj.name);
      const wi = nameWords(ni), wj = nameWords(nj);
      const ii = normId(si.raw?.profile?.student_id);
      const ij = normId(sj.raw?.profile?.student_id);
      const idsMatch       = !!(ii && ij && ii === ij);
      const namesExact     = !!(ni && nj && ni === nj);
      const namesReordered = !!(ni && nj && wi.length > 0 && wj.length > 0 && arraysEqual(wi, wj) && !namesExact);
      const namesSubset    = !!(ni && nj && (isSubset(wi, wj) || isSubset(wj, wi)));

      // AUTO-MERGE: IDs match + names same words in any order, or one name is subset of the other
      if (idsMatch && (namesReordered || namesSubset)) {
        pairs.push({ i, j, reason: "auto_name_order", autoMerge: true }); continue;
      }

      // FLAG for review: IDs match but names not clearly related
      if (idsMatch) {
        pairs.push({ i, j, reason: "same_id", autoMerge: false }); continue;
      }

      // FLAG for review: names identical but IDs differ
      if (namesExact) {
        pairs.push({ i, j, reason: "same_name_diff_id", autoMerge: false }); continue;
      }

      // All other combinations (similar names + different IDs, ID typo + different names) — ignored
    }
  }
  return pairs;
}

function dupPairKey(uuidA, uuidB) {
  return [uuidA, uuidB].sort().join("|");
}

function dismissDupPair(uuidA, uuidB) {
  dismissedDupPairs.add(dupPairKey(uuidA, uuidB));
  sessionStorage.setItem("hub_dismissed_dups", JSON.stringify([...dismissedDupPairs]));
  renderDupStudentBanner();
}

function renderDupStudentBanner() {
  const banner = document.getElementById("hub-dup-student-banner");
  if (!banner) return;
  const isFr = getCurrentLang() === "fr-CA";
  const allPairs = findProbableDuplicates();

  // Auto-merge silently before rendering
  const autoMergePairs = allPairs.filter(p => p.autoMerge);
  if (autoMergePairs.length) {
    autoMergePairs.forEach(({ i, j }) => {
      const si = students[i], sj = students[j];
      if (!si || !sj) return;
      const [base, donor] = si.log_count >= sj.log_count ? [si, sj] : [sj, si];
      const logMap = new Map();
      [...(base.raw.logs || []), ...(donor.raw.logs || [])].forEach(l => {
        const ex = logMap.get(l.log_id);
        if (!ex || l.revision > ex.revision) logMap.set(l.log_id, l);
      });
      base.raw.logs = [...logMap.values()].sort((a, b) => a.date.localeCompare(b.date));
      const rebuilt = buildRow(base.raw);
      students = students.filter(s => s.uuid !== base.uuid && s.uuid !== donor.uuid);
      students.push(rebuilt);
      console.info(`[LCI Hub] Auto-merged "${donor.name}" into "${base.name}" (same ID, name reorder/subset)`);
    });
    applyFilters(); // will re-run renderDupStudentBanner with fresh pairs
    return;
  }

  const pairs = allPairs.filter(p => !p.autoMerge
    && !dismissedDupPairs.has(dupPairKey(students[p.i]?.uuid, students[p.j]?.uuid))
  );
  if (!pairs.length) { banner.style.display = "none"; return; }

  const rows = pairs.map(({ i, j, reason }) => {
    const si = students[i], sj = students[j];
    const reasonLabel = {
      same_id:           isFr ? "Même numéro étudiant·e, noms différents"  : "Same student ID, different names",
      same_name_diff_id: isFr ? "Nom identique, numéros différents"        : "Identical name, different student IDs",
    }[reason] || reason;

    return `
      <div style="display:flex;align-items:center;justify-content:space-between;
                  flex-wrap:wrap;gap:var(--sp-3);padding:var(--sp-3) 0;
                  border-bottom:1px solid rgba(184,120,23,.2)">
        <div style="font-size:1.3rem">
          <strong>${escHtml(si.name)}</strong>
          <span style="color:var(--text-muted);margin:0 var(--sp-2)">↔</span>
          <strong>${escHtml(sj.name)}</strong>
          <span style="font-size:1.2rem;color:var(--text-muted);margin-left:var(--sp-3)">${reasonLabel}</span>
          <div style="font-size:1.1rem;color:var(--text-subtle);margin-top:2px">
            ID: ${escHtml(si.raw?.profile?.student_id || "—")} / ${escHtml(sj.raw?.profile?.student_id || "—")}
            · ${isFr ? "Journaux" : "Logs"}: ${si.log_count} / ${sj.log_count}
          </div>
        </div>
        <div style="display:flex;gap:var(--sp-2);flex-wrap:wrap">
          <button class="btn btn--ghost btn--sm"
            onclick="mergeStudents('${si.uuid}','${sj.uuid}')"
            style="color:var(--accent)">
            ${isFr ? "⇌ Fusionner" : "⇌ Merge"}
          </button>
          <button class="btn btn--ghost btn--sm"
            onclick="dismissDupPair('${si.uuid}','${sj.uuid}')"
            style="color:var(--text-muted)">
            ${isFr ? "✗ Pas la même personne" : "✗ Not the same person"}
          </button>
        </div>
      </div>`;
  }).join("");

  banner.style.display = "";
  banner.innerHTML = `
    <div style="background:rgba(184,120,23,.1);border:1.5px solid #b87800;
                border-radius:var(--r-xl);padding:var(--sp-4) var(--sp-5)">
      <div style="display:flex;align-items:center;gap:var(--sp-3);margin-bottom:var(--sp-3)">
        <span style="font-size:1.8rem">⚠</span>
        <div style="font-size:1.5rem;font-weight:600;color:#8a5c00">
          ${isFr
            ? `${pairs.length} doublon${pairs.length > 1 ? "s" : ""} probable${pairs.length > 1 ? "s" : ""} détecté${pairs.length > 1 ? "s" : ""}`
            : `${pairs.length} probable duplicate${pairs.length > 1 ? "s" : ""} detected`}
        </div>
      </div>
      <p style="font-size:1.3rem;color:#8a5c00;margin-bottom:var(--sp-3)">
        ${isFr
          ? "Ces paires d'étudiant·e·s semblent être la même personne. Vérifie et fusionne si c'est le cas — les journaux seront combinés et la ligne en double supprimée."
          : "These student pairs appear to be the same person. Verify and merge if so — logs will be combined and the duplicate row removed."}
      </p>
      ${rows}
    </div>`;
}

function mergeStudents(uuidA, uuidB) {
  const isFr = getCurrentLang() === "fr-CA";
  const si = students.find(s => s.uuid === uuidA);
  const sj = students.find(s => s.uuid === uuidB);
  if (!si || !sj) return;

  // Confirm
  const msg = isFr
    ? `Fusionner "${si.name}" et "${sj.name}" ?\n\nTous les journaux seront combinés sous le premier profil (${si.log_count} + ${sj.log_count} journaux). Cette opération ne peut pas être annulée dans cette session.`
    : `Merge "${si.name}" and "${sj.name}"?\n\nAll logs will be combined under the first profile (${si.log_count} + ${sj.log_count} logs). This cannot be undone in this session.`;
  if (!confirm(msg)) return;

  // Pick the row with more logs as the base; the other donates its logs
  const [base, donor] = si.log_count >= sj.log_count ? [si, sj] : [sj, si];

  // Merge donor logs into base (deduplicate by log_id, revision wins)
  const logMap = new Map();
  [...(base.raw.logs || []), ...(donor.raw.logs || [])].forEach(l => {
    const existing = logMap.get(l.log_id);
    if (!existing || l.revision > existing.revision) logMap.set(l.log_id, l);
  });
  base.raw.logs = [...logMap.values()].sort((a, b) => a.date.localeCompare(b.date));

  // Rebuild base row with merged logs
  const rebuilt = buildRow(base.raw);
  rebuilt.file_type_counts = {
    daily:      (base.file_type_counts?.daily      || 0) + (donor.file_type_counts?.daily      || 0),
    weekly:     (base.file_type_counts?.weekly     || 0) + (donor.file_type_counts?.weekly     || 0),
    full:       (base.file_type_counts?.full       || 0) + (donor.file_type_counts?.full       || 0),
    reflection: (base.file_type_counts?.reflection || 0) + (donor.file_type_counts?.reflection || 0),
    config:     (base.file_type_counts?.config     || 0) + (donor.file_type_counts?.config     || 0),
  };

  // Remove both, re-insert merged
  students = students.filter(s => s.uuid !== base.uuid && s.uuid !== donor.uuid);
  students.push(rebuilt);

  console.info(`[LCI Hub] Merged "${donor.name}" (${donor.uuid}) into "${base.name}" (${base.uuid}) — ${base.raw.logs.length} logs total`);

  applyFilters();
  renderDupStudentBanner();
}

function renderStats() {
  const f = filtered;
  const total      = f.length;
  const onTrack    = f.filter(s => s.track_band === "green").length;
  const behind     = f.filter(s => s.track_band === "red").length;
  const avgH       = total ? (f.reduce((s, r) => s + r.actual_hours, 0) / total).toFixed(1) : "—";
  const reflCount  = f.filter(s => s.has_reflection).length;
  const programs   = new Set(f.map(s => s.program?.slice(0,6))).size;

  document.getElementById("hub-stats").innerHTML = [
    { val: total,                     label: "Étudiant·e·s",    color: "var(--accent)" },
    { val: onTrack + " / " + total,   label: "Dans les temps",  color: "#3a6e00" },
    { val: behind  + " / " + total,   label: "En retard",       color: "#a00" },
    { val: avgH + " h",               label: "Moy. heures",     color: "var(--accent)" },
    { val: reflCount + " / " + total, label: "Réflexions",      color: "var(--accent)" },
    { val: programs,                  label: "Programmes",       color: "var(--accent)" },
  ].map(s => `
    <div class="hub-stat">
      <div class="hub-stat-val" style="color:${s.color}">${s.val}</div>
      <div class="hub-stat-label">${s.label}</div>
    </div>`).join("");

  renderQuickFilters();
}

// ── Quick-filter buttons (program + teacher) ──────────────────
function renderQuickFilters() {
  renderQuickFilterGroup("hub-qf-programs", "program",  activeProgram);
  renderQuickFilterGroup("hub-qf-teachers", "teacher",  activeTeacher);
  renderIntegrityFilter();
}

function renderIntegrityFilter() {
  const el = document.getElementById("hub-qf-integrity");
  if (!el) return;
  const count = students.filter(s => s.integrity?.ok === false).length;
  if (!count) { el.innerHTML = ""; return; }
  const lang = getCurrentLang();
  const label = lang === "fr-CA"
    ? `⚠ Intégrité (${count})`
    : `⚠ Integrity (${count})`;
  el.innerHTML = `<button
    onclick="toggleIntegrityFilter()"
    style="padding:var(--sp-1) var(--sp-3);border-radius:var(--r-pill);font-size:1.2rem;
           font-family:inherit;cursor:pointer;
           border:1.5px solid ${activeIntegrity ? 'var(--danger)' : 'var(--border)'};
           background:${activeIntegrity ? 'var(--danger)' : 'var(--bg-card)'};
           color:${activeIntegrity ? 'white' : 'var(--danger)'};
           font-weight:${activeIntegrity ? '600' : '400'};transition:all var(--dur-fast)">
    ${label}
  </button>`;
}

function toggleIntegrityFilter() {
  activeIntegrity = !activeIntegrity;
  applyFilters();
}

function renderQuickFilterGroup(containerId, field, activeVal) {
  const el = document.getElementById(containerId);
  if (!el) return;
  const vals = [...new Set(students.map(s => s[field]))].filter(Boolean).sort();
  if (!vals.length) { el.innerHTML = ""; return; }

  el.innerHTML = vals.map(v => {
    const count   = students.filter(s => s[field] === v).length;
    const isActive = v === activeVal;
    const short   = field === "program" ? v : v.split(" ")[0] + (v.split(" ").length > 1 ? " " + v.split(" ")[1] : "");
    return `<button
      onclick="toggleQuickFilter('${field}','${escHtml(v)}')"
      title="${escHtml(v)}"
      style="padding:var(--sp-1) var(--sp-3);border-radius:var(--r-pill);font-size:1.2rem;
             font-family:inherit;cursor:pointer;border:1.5px solid ${isActive ? 'var(--accent)' : 'var(--border)'};
             background:${isActive ? 'var(--accent)' : 'var(--bg-card)'};
             color:${isActive ? 'var(--comp-toggle-text,#fff)' : 'var(--text-muted)'};
             font-weight:${isActive ? '600' : '400'};transition:all var(--dur-fast)">
      ${escHtml(short)} <span style="font-size:1.1rem;opacity:.7">${count}</span>
    </button>`;
  }).join("");
}

function toggleQuickFilter(field, val) {
  if (field === "program") {
    activeProgram = activeProgram === val ? "" : val;
    document.getElementById("filter-program").value = activeProgram;
  } else if (field === "teacher") {
    activeTeacher = activeTeacher === val ? "" : val;
    document.getElementById("filter-teacher").value = activeTeacher;
  }
  applyFilters();
}

// ── AWOL alerts ──────────────────────────────────────────────
// AWOL thresholds in WORKING days (not calendar days):
// 2+ working days absent without a log → MIA
// 4+ working days absent              → AWOL
const AWOL_WORK_DAYS = 4;
const MIA_WORK_DAYS  = 2;
const LAG_THRESHOLD_DAYS    = 7;    // integrity: days between last log and file export
const CLUSTER_THRESHOLD_PCT = 0.20; // integrity: created_at span / internship span

function getAWOLStudents() {
  return filtered.filter(s =>
    s.working_days_absent !== null && s.working_days_absent >= MIA_WORK_DAYS
  ).sort((a, b) => b.working_days_absent - a.working_days_absent);
}

function renderAWOL() {
  const awol = getAWOLStudents();
  const section = document.getElementById("awol-section");
  if (!awol.length) { section.style.display = "none"; return; }
  section.style.display = "block";

  const lang = getCurrentLang();
  const isFr = lang === "fr-CA";

  document.getElementById("awol-title").textContent = awol.length === 1
    ? (isFr ? "1 étudiant·e absent·e sans journal (jours ouvrables)" : "1 student absent without a log (working days)")
    : (isFr ? `${awol.length} étudiant·e·s absent·e·s sans journal (jours ouvrables)` : `${awol.length} students absent without a log (working days)`);

  document.getElementById("awol-subtitle").textContent =
    isFr ? "Jours = jours ouvrables prévus sans entrée de journal (congés planifiés exclus)."
          : "Days = scheduled working days with no log entry (planned absences excluded).";

  document.getElementById("awol-list").innerHTML = awol.map(s => {
    const wda = s.working_days_absent;
    const severity = wda >= AWOL_WORK_DAYS ? "var(--danger)"
      : wda >= 3                           ? "var(--warning)"
      : "var(--text-muted)";
    const badge = wda >= AWOL_WORK_DAYS
      ? "⛔ AWOL"
      : wda >= 3 ? "⚠ " + (isFr ? "En retard" : "Late")
      :            "⚠ MIA";

    // Show planned absences count if any — explains why fewer calendar days flagged
    const absenceCtx  = s.raw?.context?.planned_absences;
    const absenceNote = absenceCtx?.length
      ? `<span style="font-size:1.1rem;color:var(--text-subtle)">
           (${absenceCtx.length} ${isFr ? "congé·s planifié·s" : "planned absence·s"})
         </span>` : "";

    const lastPlan = s.last_plan
      ? `<span style="font-size:1.2rem;color:var(--text-subtle)"> · ${isFr ? "Planifié" : "Planned"} : ${escHtml(s.last_plan.text.slice(0, 60))}${s.last_plan.text.length > 60 ? "…" : ""}</span>`
      : "";

    return `
      <div style="display:flex;align-items:center;gap:var(--sp-4);
                  padding:var(--sp-3) 0;border-bottom:1px solid rgba(255,107,112,.2)">
        <span style="color:${severity};font-weight:700;width:6rem;flex-shrink:0">${badge}</span>
        <div style="flex:1;min-width:0">
          <button onclick="openStudentPanel('${escHtml(s.uuid)}')"
            style="background:none;border:none;cursor:pointer;font:inherit;font-size:1.4rem;
                   font-weight:600;padding:0;color:var(--accent);text-decoration:underline;
                   text-underline-offset:3px;text-align:left">
            ${escHtml(s.name)}
          </button>
          <span style="color:var(--text-subtle);font-size:1.3rem"> · ${escHtml(s.program)}</span>
          ${absenceNote}${lastPlan}
        </div>
        <div style="text-align:right;flex-shrink:0">
          <div style="color:${severity};font-weight:700;font-size:1.5rem">
            ${wda} ${isFr ? "j. ouv." : "work day·s"}
          </div>
          <div style="color:var(--text-subtle);font-size:1.2rem">
            ${isFr ? "dernier" : "last"}: ${s.last_log || (isFr ? "jamais" : "never")}
          </div>
        </div>
        ${s.email ? `<a href="mailto:${escHtml(s.email)}" class="btn btn--ghost btn--sm" style="flex-shrink:0">✉</a>` : ""}
      </div>`;
  }).join("");
}

function copyAWOLEmails() {
  const emails = getAWOLStudents().map(s => s.email).filter(Boolean).join("; ");
  if (!emails) return;
  navigator.clipboard.writeText(emails).then(() => {
    const btn = document.getElementById("btn-copy-emails");
    const orig = btn.textContent;
    btn.textContent = "✓ Copié!";
    setTimeout(() => { btn.textContent = orig; }, 2500);
  });
}

function openMailto() {
  const emails = getAWOLStudents().map(s => s.email).filter(Boolean).join(";");
  if (!emails) return;
  window.open(`mailto:${emails}?subject=${encodeURIComponent("Suivi de stage — journal non soumis")}`);
}

// ── Hours bar chart ───────────────────────────────────────────
function renderHoursChart() {
  const el = document.getElementById("hours-chart");
  if (!filtered.length) { el.innerHTML = ""; return; }

  // Sort worst → best (lowest ratio of actual/expected first)
  const sorted = [...filtered].sort((a, b) => {
    const ra = a.expected_hours > 0 ? a.actual_hours / a.expected_hours : 0;
    const rb = b.expected_hours > 0 ? b.actual_hours / b.expected_hours : 0;
    return ra - rb;
  });

  const isDark   = document.documentElement.getAttribute("data-theme") === "dark";
  const barColors  = { green: "#3a6e00", amber: "#9a6c00", red: "#a00",    none: "var(--accent)" };
  const darkColors = { green: "#8ab840", amber: "#e6b830", red: "#ff6b70", none: "var(--accent)" };
  const cols = isDark ? darkColors : barColors;

  const maxH = Math.max(...sorted.map(s => Math.max(s.actual_hours, s.expected_hours, 1)));

  // Dynamic bar sizing: fill the container width
  // We read the wrap width after a short timeout if needed, but use offsetWidth now
  const wrapEl  = el.parentElement;
  const wrapW   = wrapEl ? (wrapEl.offsetWidth || 600) : 600;
  const n       = sorted.length;
  const minGap  = 2;
  const barW    = Math.max(4, Math.floor((wrapW - minGap * (n - 1)) / n));
  const gap     = Math.max(1, Math.floor((wrapW - barW * n) / Math.max(n - 1, 1)));
  const showInitials = barW >= 14;   // only show label if bar is wide enough

  const chartH  = 220; // px — matches .bar-chart-bars height via CSS

  el.style.gap = gap + "px";

  el.innerHTML = sorted.map((s, idx) => {
    const actualH  = Math.max(s.actual_hours, 0.1);
    const expectH  = Math.max(s.expected_hours, 0.1);
    const actualPx = Math.max(Math.round((actualH / maxH) * chartH), 4);
    const expectPx = Math.max(Math.round((expectH / maxH) * chartH), 4);
    const color    = cols[s.track_band] || cols.none;
    const initials = s.name.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase();
    const tip      = `${escHtml(s.name)}: ${s.actual_hours}h / ${s.expected_hours}h attendues`;

    // Hatched overlay for future-filed hours
    const futureH  = Math.min(s.future_hours || 0, s.actual_hours);
    const futurePx = futureH > 0 ? Math.max(Math.round((futureH / maxH) * chartH), 2) : 0;
    const futureOverlay = futurePx > 0
      ? `<div style="position:absolute;bottom:0;left:0;right:0;height:${futurePx}px;
                     background:repeating-linear-gradient(
                       45deg,
                       rgba(255,255,255,.25) 0px, rgba(255,255,255,.25) 3px,
                       transparent 3px, transparent 6px
                     );border-radius:0 0 3px 3px;z-index:3"
              title="${futureH}h future-filed"></div>`
      : "";

    return `
      <div title="${tip}"
        onclick="openStudentPanel('${escHtml(s.uuid)}')"
        style="flex:0 0 ${barW}px;width:${barW}px;position:relative;display:flex;
               flex-direction:column;align-items:center;cursor:pointer">
        <div style="font-size:1rem;color:var(--text-subtle);margin-bottom:2px;
                    white-space:nowrap;overflow:hidden;width:100%;text-align:center">
          ${barW >= 24 ? s.actual_hours + "h" : ""}
        </div>
        <div style="display:flex;flex-direction:column;align-items:center;width:100%;
                    justify-content:flex-end;height:${chartH}px;position:relative">
          <div style="position:absolute;bottom:${expectPx}px;left:0;right:0;
                      border-top:2px dashed rgba(100,100,100,.4);z-index:1"></div>
          <div style="width:100%;background:${color};height:${actualPx}px;
                      border-radius:3px 3px 0 0;position:relative;z-index:2;
                      transition:filter var(--dur-fast)"
               onmouseover="this.style.filter='brightness(1.2)'"
               onmouseout="this.style.filter=''">
            ${futureOverlay}
          </div>
        </div>
        ${showInitials ? `<div style="font-size:${barW >= 20 ? 1 : 0.85}rem;color:var(--text-subtle);
                    margin-top:3px;width:100%;overflow:hidden;text-overflow:ellipsis;
                    text-align:center;white-space:nowrap">${initials}</div>` : ""}
      </div>`;
  }).join("");
}

// ── Program pie ───────────────────────────────────────────────
function renderProgramPie() {
  const el = document.getElementById("program-chart");
  const counts = {};
  filtered.forEach(s => {
    const key = s.program || "—";
    counts[key] = (counts[key] || 0) + 1;
  });
  const slices = Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .map(([prog, count]) => ({
      label:    prog,
      value:    count,
      color:    programColor(prog),
      sublabel: count + " étudiant" + (count > 1 ? "·e·s" : "·e"),
    }));
  buildPieChart(el, slices);
}

// ── Table ─────────────────────────────────────────────────────
const COLS = [
  { key: "name",            label: "Nom" },
  { key: "student_id",      label: "ID" },
  { key: "program",         label: "Programme" },
  { key: "teacher",         label: "Superviseur·e" },
  { key: "pathway",         label: "Type" },
  { key: "days_logged",     label: "Jours" },
  { key: "expected_hours",  label: "Heures att." },
  { key: "actual_hours",    label: "Heures réelles" },
  { key: "track_pct",       label: "Progression" },
  { key: "week_hours",      label: "Sem. courante" },
  { key: "last_log",        label: "Dernier journal" },
  { key: "avg_rating",      label: "Note moy." },
  { key: "has_reflection",  label: "Réflexion" },
];

function renderTable() {
  const arrow = col => col === sortCol ? (sortDir > 0 ? " ↑" : " ↓") : "";

  // Header
  document.getElementById("hub-thead").innerHTML =
    `<tr>${COLS.map(c =>
      `<th onclick="sortBy('${c.key}')">${c.label}${arrow(c.key)}</th>`
    ).join("")}<th>Humeur</th></tr>`;

  const empty = document.getElementById("hub-empty");
  const tbody = document.getElementById("hub-tbody");

  if (!filtered.length) {
    tbody.innerHTML = "";
    empty.style.display = "block";
    return;
  }
  empty.style.display = "none";

  tbody.innerHTML = filtered.map((s, i) => {
    const lang = getCurrentLang();
    // Track pill
    const pillClass = { green:"track-green", amber:"track-amber", red:"track-red", none:"track-none" }[s.track_band];
    const pillLabel = s.track_pct !== null
      ? s.track_pct + "%"
      : "—";
    const trackHint = s.track_pct !== null
      ? `${s.actual_hours}h / ${s.expected_hours}h att.`
      : "Pas de date de début définie";

    // Last log freshness — use working_days_absent for colour, days_since for label
    const logColor = s.working_days_absent === null ? "var(--text-subtle)"
      : s.working_days_absent === 0 ? "var(--success)"
      : s.working_days_absent < MIA_WORK_DAYS ? "var(--warning)"
      : "var(--danger)";
    const logCell = s.last_log
      ? `<span style="color:${logColor};font-weight:500">${s.last_log}</span>
         <span style="font-size:1.1rem;color:var(--text-subtle)"> (${s.working_days_absent ?? "—"} j.ouv.)</span>`
      : "—";

    const pathwayTag = s.pathway === "hub"
      ? `<span class="tag" style="background:var(--accent);color:white;font-size:1.1rem">Hub</span>`
      : `<span class="tag" style="font-size:1.1rem">Entreprise</span>`;

    const reflCell = s.has_reflection
      ? `<span style="color:var(--success);font-weight:600">✓</span>`
      : `<span style="color:var(--text-subtle)">—</span>`;

    const sparkline = moodSparkline(s.mood_points);

    // Integrity badge — shown when any fabrication signal is detected
    const integ = s.integrity || {};
    const integBadge = !integ.ok
      ? `<span title="${buildIntegrityTitle(s, lang)}"
              style="display:inline-block;margin-left:var(--sp-2);font-size:1.1rem;
                     background:var(--danger);color:white;border-radius:var(--r-pill);
                     padding:0.1rem 0.5rem;vertical-align:middle;cursor:help">⚠ ${
                       lang === 'fr-CA' ? 'intégrité' : 'integrity'
                     }</span>`
      : "";

    return `
      <tr class="data-row" onclick="toggleDetail(${i})">
        <td><strong>${escHtml(s.name)}</strong>${integBadge}</td>
        <td style="color:var(--text-subtle);font-size:1.2rem">${escHtml(s.student_id)}</td>
        <td style="max-width:20rem;overflow:hidden;text-overflow:ellipsis">
          <button onclick="event.stopPropagation();filterByProgram('${escHtml(s.program)}')"
            title="${escHtml(s.program)}"
            style="background:none;border:none;cursor:pointer;font:inherit;font-size:inherit;
                   padding:0;color:var(--accent);text-decoration:underline;
                   text-underline-offset:3px;text-align:left">
            ${escHtml(s.program)}
          </button>
        </td>
        <td>
          <button onclick="event.stopPropagation();filterByTeacher('${escHtml(s.teacher)}')"
            style="background:none;border:none;cursor:pointer;font:inherit;font-size:inherit;
                   padding:0;color:var(--accent);text-decoration:underline;
                   text-underline-offset:3px;text-align:left">
            ${escHtml(s.teacher)}
          </button>
        </td>
        <td>${pathwayTag}</td>
        <td style="text-align:center">${s.days_logged}</td>
        <td style="text-align:right;color:var(--text-muted)">${s.expected_hours}h</td>
        <td style="text-align:right;font-weight:600">${s.actual_hours}h</td>
        <td style="text-align:center">
          <span class="track-pill ${pillClass}" title="${trackHint}">${pillLabel}</span>
        </td>
        <td style="text-align:right">${s.week_hours}h</td>
        <td>${logCell}</td>
        <td style="text-align:center">${s.avg_rating !== null ? s.avg_rating + " ★" : "—"}</td>
        <td style="text-align:center">${reflCell}</td>
        <td>${sparkline}</td>
      </tr>
      <tr class="detail-row" id="detail-${i}" style="display:none;background:var(--bg-subtle)">
        <td colspan="${COLS.length + 1}" style="padding:var(--sp-4) var(--sp-6)">
          ${buildDetailHTML(s)}
        </td>
      </tr>`;
  }).join("");
}

// ── Navigation helpers ────────────────────────────────────────
// Switch to student table view and open that student's detail row.
function openStudentPanel(uuid) {
  setHubView("students");
  // Wait for renderTable to run, then find and open the row
  requestAnimationFrame(() => {
    const idx = filtered.findIndex(s => s.uuid === uuid);
    if (idx >= 0) {
      const row = document.getElementById(`detail-${idx}`);
      if (row) {
        row.style.display = "";
        row.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }
  });
}

// Filter to a single program and switch to student view
function filterByProgram(prog) {
  activeProgram = prog;
  document.getElementById("filter-program").value = prog;
  setHubView("students");
  applyFilters();
}

// Filter to a single teacher and switch to student view
function filterByTeacher(teacher) {
  activeTeacher = teacher;
  document.getElementById("filter-teacher").value = teacher;
  setHubView("students");
  applyFilters();
}

// Filter to a single course and switch to course view
function filterByCourse(courseCode) {
  const sel = document.getElementById("filter-course");
  if (sel) sel.value = courseCode;
  setHubView("course");
  applyFilters();
}

// ── Competency view ───────────────────────────────────────────
// Groups all visible students by course, then by competency.
// Each competency block is collapsible.
// Shows OK/total count (OK = pct >= 40).
// Student names are colour-coded by AWOL status with explicit legend.
function renderCompetencyView() {
  const container = document.getElementById("hub-comp-section");
  if (!container) return;
  if (!filtered.length) { container.innerHTML = ""; return; }

  const lang = getCurrentLang();

  // AWOL legend — explain the colour coding once at the top
  const legend = `
    <div style="display:flex;gap:var(--sp-4);flex-wrap:wrap;align-items:center;
                font-size:1.2rem;margin-bottom:var(--sp-4);padding:var(--sp-3) var(--sp-4);
                background:var(--bg-subtle);border-radius:var(--r-md)">
      <span style="font-weight:600">${lang === "fr-CA" ? "Couleur du nom :" : "Name colour:"}</span>
      <span>
        <span style="display:inline-block;width:1rem;height:1rem;border-radius:50%;
                     background:var(--text);margin-right:4px;vertical-align:middle"></span>
        ${lang === "fr-CA" ? "À jour (journal récent)" : "Up to date (recent log)"}
      </span>
      <span>
        <span style="display:inline-block;width:1rem;height:1rem;border-radius:50%;
                     background:var(--warning);margin-right:4px;vertical-align:middle"></span>
        ${lang === "fr-CA" ? "3–6 jours sans journal" : "3–6 days without a log"}
      </span>
      <span>
        <span style="display:inline-block;width:1rem;height:1rem;border-radius:50%;
                     background:var(--danger);margin-right:4px;vertical-align:middle"></span>
        ${lang === "fr-CA" ? "7+ jours sans journal (AWOL)" : "7+ days without a log (AWOL)"}
      </span>
      <span style="color:var(--text-subtle)">
        ${lang === "fr-CA" ? "Barre : % engagement compétence" : "Bar: competency engagement %"}
        · ${lang === "fr-CA" ? "Seuil OK : ≥40%" : "OK threshold: ≥40%"}
      </span>
    </div>`;

  // Group by course
  const byCourse = {};
  filtered.forEach(s => {
    const cc = s.course_code || "generic";
    (byCourse[cc] = byCourse[cc] || []).push(s);
  });

  const sections = Object.entries(byCourse).map(([cc, cohort]) => {
    const courseLabel = (typeof getCourseLabel === "function") ? getCourseLabel(cc, lang) : cc;

    // Build competency map
    const compMap = {};
    cohort.forEach(s => {
      (s.competency_coverage || []).forEach(c => {
        if (!compMap[c.code]) compMap[c.code] = { title: c.title, rows: [] };
        compMap[c.code].rows.push({ s, c });
      });
    });

    if (!Object.keys(compMap).length) {
      return `<div class="chart-wrap mb-4">
        <div class="section-title mb-3">
          <button onclick="filterByCourse('${escHtml(cc)}')"
            style="background:none;border:none;cursor:pointer;font:inherit;
                   font-size:inherit;color:var(--accent);text-decoration:underline;
                   text-underline-offset:3px;padding:0">
            ${escHtml(courseLabel)}
          </button>
        </div>
        <p class="text-muted" style="font-size:1.3rem">
          ${lang === "fr-CA" ? "Aucune donnée de compétence." : "No competency data."}
        </p>
      </div>`;
    }

    const uid_course = cc.replace(/[^a-z0-9]/gi,"_");

    const compBlocks = Object.entries(compMap).map(([code, { title, rows }]) => {
      const titleStr  = title[lang] || title["fr-CA"];
      const total     = rows.length;
      const okCount   = rows.filter(({ c }) => c.pct >= 40).length;
      const allOk     = okCount === total;
      const noneOk    = okCount === 0;
      const countColor = allOk ? "var(--success)" : noneOk ? "var(--danger)" : "var(--warning)";
      const blockId   = `comp-block-${uid_course}-${code}`;

      const studentRows = rows.map(({ s, c }) => {
        const pct          = c.pct;
        const barColor     = pct >= 75 ? "var(--success)"
          : pct >= 40 ? "var(--comp-amber-bar,#b38a00)" : "var(--danger)";
        const pctTextColor = pct >= 75 ? "var(--success)"
          : pct >= 40 ? "var(--text)"
          : "var(--comp-danger-text,#d41f29)";
        const nameColor    = s.working_days_absent >= AWOL_WORK_DAYS ? "color:var(--danger);font-weight:600"
          : s.working_days_absent >= MIA_WORK_DAYS ? "color:var(--warning);font-weight:500" : "";

        return `
          <div style="display:flex;align-items:center;gap:var(--sp-3);
                      padding:var(--sp-2) 0;border-bottom:1px solid var(--border)">
            <div style="flex:1;min-width:0">
              <button onclick="openStudentPanel('${escHtml(s.uuid)}')"
                style="background:none;border:none;cursor:pointer;font:inherit;
                       font-size:1.3rem;padding:0;text-align:left;${nameColor}
                       text-decoration:underline;text-underline-offset:3px;
                       color:${s.working_days_absent >= AWOL_WORK_DAYS ? 'var(--danger)' : s.working_days_absent >= MIA_WORK_DAYS ? 'var(--warning)' : 'var(--accent)'}">
                ${escHtml(s.name)}
              </button>
              <span style="font-size:1.1rem;color:var(--text-subtle);margin-left:var(--sp-2)">${escHtml(s.student_id)}</span>
            </div>
            <div style="display:flex;align-items:center;gap:var(--sp-3);flex-shrink:0">
              <span style="font-size:1.2rem;color:var(--text-muted);white-space:nowrap">
                ${c.weekly_count}W + ${c.daily_count}J
              </span>
              <div style="width:8rem;height:6px;background:var(--bg-subtle);
                          border-radius:3px;overflow:hidden">
                <div style="height:100%;width:${pct}%;background:${barColor};border-radius:3px"></div>
              </div>
              <span style="font-size:1.2rem;font-weight:600;color:${pctTextColor};
                           min-width:3rem;text-align:right">${pct}%</span>
            </div>
          </div>`;
      }).join("");

      return `
        <div style="margin-bottom:var(--sp-4);border:1px solid var(--border);
                    border-radius:var(--r-md);overflow:hidden">
          <!-- Competency header — clickable to collapse -->
          <button onclick="toggleCompBlock('${blockId}')"
            style="width:100%;display:flex;align-items:center;gap:var(--sp-3);
                   padding:var(--sp-3) var(--sp-4);background:var(--bg-subtle);
                   border:none;cursor:pointer;font:inherit;text-align:left">
            <span style="font-size:1.3rem;font-weight:700">${escHtml(code)}</span>
            <span style="font-size:1.3rem;font-weight:400;color:var(--text-muted);flex:1">
              ${escHtml(titleStr)}
            </span>
            <!-- OK/total count badge -->
            <span style="font-size:1.2rem;font-weight:700;color:${countColor};
                         background:${countColor}22;border:1px solid ${countColor};
                         border-radius:var(--r-pill);padding:1px 8px;flex-shrink:0">
              ${okCount}/${total} OK
            </span>
            <span class="comp-block-chevron" id="${blockId}-chevron"
              style="font-size:1.4rem;color:var(--text-subtle);transition:transform .2s;
                     flex-shrink:0">▾</span>
          </button>
          <!-- Collapsible body -->
          <div id="${blockId}" style="padding:0 var(--sp-4) var(--sp-2)">
            ${studentRows}
          </div>
        </div>`;
    }).join("");

    return `
      <div class="chart-wrap mb-4">
        <div class="section-title mb-4">
          <button onclick="filterByCourse('${escHtml(cc)}')"
            style="background:none;border:none;cursor:pointer;font:inherit;
                   font-size:inherit;color:var(--accent);text-decoration:underline;
                   text-underline-offset:3px;padding:0">
            ${escHtml(courseLabel)}
          </button>
        </div>
        ${compBlocks}
      </div>`;
  }).join("");

  container.innerHTML = legend + (sections || `<p class="text-muted">Aucun étudiant·e visible.</p>`);
}

function toggleCompBlock(id) {
  const body     = document.getElementById(id);
  const chevron  = document.getElementById(id + "-chevron");
  if (!body) return;
  const hidden = body.style.display === "none";
  body.style.display    = hidden ? "" : "none";
  if (chevron) chevron.style.transform = hidden ? "" : "rotate(-90deg)";
}

// ── Course view ───────────────────────────────────────────────
// Groups students by course. Within each course, shows each
// student's competency coverage as a compact row of colour pills.
function renderCourseView() {
  const container = document.getElementById("hub-course-section");
  if (!container) return;
  if (!filtered.length) { container.innerHTML = ""; return; }

  const lang = getCurrentLang();

  const byCourse = {};
  filtered.forEach(s => {
    const cc = s.course_code || "generic";
    (byCourse[cc] = byCourse[cc] || []).push(s);
  });

  const sections = Object.entries(byCourse).map(([cc, cohort]) => {
    const courseLabel = (typeof getCourseLabel === "function")
      ? getCourseLabel(cc, lang) : cc;

    // Competency codes for this course (from first student who has coverage)
    const compCodes = cohort.find(s => s.competency_coverage?.length)
      ?.competency_coverage.map(c => c.code) || [];

    // Header row
    const header = `
      <div style="display:grid;grid-template-columns:18rem repeat(${compCodes.length},minmax(6rem,1fr));
                  gap:var(--sp-2);padding:var(--sp-2) 0;border-bottom:2px solid var(--border);
                  font-size:1.1rem;font-weight:700;text-transform:uppercase;
                  letter-spacing:.05em;color:var(--text-subtle)">
        <div>${lang === "fr-CA" ? "Étudiant·e" : "Student"}</div>
        ${compCodes.map(c => `<div style="text-align:center">${escHtml(c)}</div>`).join("")}
      </div>`;

    const rows = cohort.map(s => {
      const awolStyle = s.working_days_absent >= AWOL_WORK_DAYS ? "color:var(--danger);font-weight:600"
        : s.working_days_absent >= MIA_WORK_DAYS ? "color:var(--warning)" : "";

      const pills = compCodes.map(code => {
        const cov = s.competency_coverage?.find(c => c.code === code);
        if (!cov) return `<div style="text-align:center;color:var(--text-subtle)">—</div>`;
        const pct = cov.pct;
        const bg      = pct >= 75 ? "var(--success)"
          : pct >= 40 ? "var(--comp-amber-bar,#b38a00)" : "var(--danger)";
        // Use CSS tokens for pill text — theme-aware contrast
        const textCol = pct >= 75 ? "var(--comp-success-pill,#fff)"
          : pct >= 40 ? "var(--comp-amber-text,#2a2200)"
          : "var(--comp-danger-pill,#1a0000)";
        const tip = `${cov.weekly_count}W + ${cov.daily_count}J (engagement: ${cov.total_engagement})`;
        return `
          <div style="text-align:center" title="${escHtml(tip)}">
            <span style="display:inline-block;padding:2px 6px;border-radius:var(--r-sm);
                         background:${bg};color:${textCol};font-size:1.1rem;font-weight:700">
              ${pct}%
            </span>
          </div>`;
      }).join("");

      return `
      <div style="display:grid;grid-template-columns:18rem repeat(${compCodes.length},minmax(6rem,1fr));
                  gap:var(--sp-2);padding:var(--sp-2) 0;
                  border-bottom:1px solid var(--border);align-items:center">
          <div>
            <button onclick="openStudentPanel('${escHtml(s.uuid)}')"
              style="background:none;border:none;cursor:pointer;font:inherit;
                     font-size:1.3rem;padding:0;text-align:left;
                     color:${s.working_days_absent >= AWOL_WORK_DAYS ? 'var(--danger)' : s.working_days_absent >= MIA_WORK_DAYS ? 'var(--warning)' : 'var(--accent)'};
                     text-decoration:underline;text-underline-offset:3px">
              ${escHtml(s.name)}
            </button>
            <div style="font-size:1.1rem;color:var(--text-subtle)">${escHtml(s.student_id)}</div>
          </div>
          ${pills}
        </div>`;
    }).join("");

    const legend = compCodes.length ? `
      <div style="margin-top:var(--sp-3);font-size:1.1rem;color:var(--text-subtle)">
        W = ${lang === "fr-CA" ? "réflexions hebdomadaires" : "weekly reflections"} ·
        J = ${lang === "fr-CA" ? "observations quotidiennes" : "daily observations"} ·
        % = score d'engagement (J > W si J > 0 cette semaine)
      </div>` : "";

    return `
      <div class="chart-wrap mb-4">
        <div class="section-title mb-3">
          <button onclick="filterByCourse('${escHtml(cc)}')"
            style="background:none;border:none;cursor:pointer;font:inherit;
                   font-size:inherit;color:var(--accent);text-decoration:underline;
                   text-underline-offset:3px;padding:0">
            ${escHtml(courseLabel)}
          </button>
        </div>
        ${compCodes.length
          ? `<div class="hub-comp-grid-scroll">${header + rows + legend}</div>`
          : `<p class="text-muted" style="font-size:1.3rem">Aucune donnée de compétence.</p>`}
      </div>`;
  }).join("");

  container.innerHTML = sections || `<p class="text-muted">Aucun étudiant·e visible.</p>`;
}

function toggleDetail(i) {
  const row = document.getElementById(`detail-${i}`);
  if (!row) return;
  row.style.display = row.style.display === "none" ? "" : "none";
}

function buildDetailHTML(s) {
  const lang = getCurrentLang();

  const acts = Object.entries(s.act_totals)
    .sort((a, b) => b[1] - a[1])
    .map(([tid, mins]) => {
      const label = getActivityTypeLabel(s.raw, tid);
      const color = getActivityTypeColor(s.raw, tid);
      const pct = s.actual_hours > 0
        ? Math.round((mins / 60 / s.actual_hours) * 100) : 0;
      return `
        <div style="display:flex;align-items:center;gap:var(--sp-3);margin-bottom:var(--sp-2)">
          <div style="width:1rem;height:1rem;border-radius:3px;background:${color};flex-shrink:0"></div>
          <div style="flex:1;font-size:1.3rem">${escHtml(label)}</div>
          <div style="font-size:1.3rem;color:var(--text-muted)">${formatDuration(mins)}</div>
          <div style="width:3rem;text-align:right;font-size:1.2rem;color:var(--text-subtle)">${pct}%</div>
        </div>`;
    }).join("");

  const ctx = s.raw.context || {};
  const courseLabel = (typeof getCourseLabel === "function" && s.course_code)
    ? getCourseLabel(s.course_code, lang) : (s.course_code || "—");

  // File type counts badge row
  // border and bg-tint use the accent colour; count and label use --text for contrast safety
  const ftc = s.file_type_counts || {};
  const fileTypeBadges = [
    { key: "config",     label: "Config",     color: "var(--text-subtle)" },
    { key: "daily",      label: "Quotidien",  color: "var(--accent)" },
    { key: "weekly",     label: "Hebdo",      color: "var(--success)" },
    { key: "full",       label: "Complet",    color: "#7341a0" },
    { key: "reflection", label: "Réflexion",  color: "var(--comp-amber-bar,#b38a00)" },
  ].filter(b => ftc[b.key] > 0).map(b =>
    `<span style="display:inline-flex;align-items:center;gap:4px;padding:2px 8px;
                  border-radius:var(--r-sm);background:${b.color}2e;
                  border:1px solid ${b.color};font-size:1.1rem">
       <span style="color:var(--text);font-weight:700">${ftc[b.key]}</span>
       <span style="color:var(--text-muted)">${b.label}</span>
     </span>`
  ).join(" ");

  // Work hours display
  const wh    = ctx.work_hours;
  const byDay = ctx.work_hours_by_day;
  const hasVariableSchedule = byDay && Object.keys(byDay).length > 0;
  const whStr = hasVariableSchedule
    ? "Horaire variable"
    : (wh ? `${wh.h}h${String(wh.m).padStart(2,"0")}` : null);

  // Planned absences summary
  const absCount = (ctx.planned_absences || []).length;
  const absStr   = absCount > 0 ? `${absCount} congé${absCount > 1 ? "s" : ""} planifié${absCount > 1 ? "s" : ""}` : null;

  const info = [
    ctx.start_date         && `Début : ${ctx.start_date}`,
    ctx.scheduled_end_date && `Fin prévue : ${ctx.scheduled_end_date}`,
    whStr                  && `${whStr} / jour`,
    absStr,
    s.raw.pathway === "hub" && s.raw.projects?.length &&
      `Projets : ${s.raw.projects.map(p => p.project_name).join(", ")}`,
  ].filter(Boolean).map(t => `<div style="font-size:1.3rem;margin-bottom:var(--sp-1)">${t}</div>`).join("");

  // Competency mini-section
  const compRows = (s.competency_coverage || []).map(c => {
    const pct          = c.pct;
    const barColor     = pct >= 75 ? "var(--success)"
      : pct >= 40 ? "var(--comp-amber-bar,#b38a00)" : "var(--danger)";
    const pctTextColor = pct >= 75 ? "var(--success)"
      : pct >= 40 ? "var(--text)"
      : "var(--comp-danger-text,#d41f29)";
    const titleStr     = c.title[lang] || c.title["fr-CA"];
    return `
      <div style="margin-bottom:var(--sp-3)">
        <div style="display:flex;justify-content:space-between;align-items:baseline;
                    margin-bottom:3px">
          <span style="font-size:1.2rem">
            <strong>${escHtml(c.code)}</strong>
            <span style="color:var(--text-muted)"> ${escHtml(titleStr)}</span>
          </span>
          <span style="font-size:1.2rem;color:var(--text-subtle);flex-shrink:0;margin-left:var(--sp-3)">
            ${c.weekly_count}W + ${c.daily_count}J → <strong style="color:${pctTextColor}">${pct}%</strong>
          </span>
        </div>
        <div style="height:5px;background:var(--bg-subtle);border-radius:3px;overflow:hidden">
          <div style="height:100%;width:${pct}%;background:${barColor};border-radius:3px"></div>
        </div>
      </div>`;
  }).join("");

  const compSection = compRows ? `
    <div style="margin-top:var(--sp-4);padding-top:var(--sp-3);border-top:1px solid var(--border)">
      <div style="font-size:1.1rem;font-weight:700;text-transform:uppercase;
                  letter-spacing:0.08em;color:var(--text-subtle);margin-bottom:var(--sp-3)">
        Cours : ${escHtml(courseLabel)}
      </div>
      ${compRows}
    </div>` : "";

  // Outcome mini-section
  const outcomeRows = (s.outcome_coverage || []).filter(o => o.count > 0).map(o => {
    const label = o[lang === "fr-CA" ? "fr" : "en"] || o.fr;
    return `
      <div style="display:flex;align-items:baseline;gap:var(--sp-3);
                  margin-bottom:var(--sp-2);font-size:1.2rem">
        <span style="color:var(--color-chlorophyll-500);font-weight:700;
                     flex-shrink:0">${escHtml(o.id)}</span>
        <span style="color:var(--text-muted);flex:1">${escHtml(label.slice(0, 60))}${label.length > 60 ? "…" : ""}</span>
        <span style="color:var(--text-subtle);flex-shrink:0">${o.count}×</span>
      </div>`;
  }).join("");

  const outcomeSection = outcomeRows ? `
    <div style="margin-top:var(--sp-4);padding-top:var(--sp-3);border-top:1px solid var(--border)">
      <div style="font-size:1.1rem;font-weight:700;text-transform:uppercase;
                  letter-spacing:0.08em;color:var(--text-subtle);margin-bottom:var(--sp-3)">
        📌 ${lang === "fr-CA" ? "Résultats d'apprentissage associés" : "Associated learning outcomes"}
      </div>
      ${outcomeRows}
    </div>` : "";

  return `
    <div style="margin-bottom:var(--sp-3);display:flex;gap:var(--sp-2);flex-wrap:wrap;align-items:center">
      <span style="font-size:1.2rem;color:var(--text-subtle)">${lang === "fr-CA" ? "Fichiers chargés :" : "Loaded files:"}</span>
      ${fileTypeBadges || '<span style="font-size:1.2rem;color:var(--text-subtle)">—</span>'}
      <button class="btn btn--ghost btn--sm" style="margin-left:var(--sp-2);font-size:1.2rem"
        onclick="openFileListModal('${escHtml(s.uuid)}')"
        >${lang === "fr-CA" ? "📋 Voir les journaux" : "📋 View logs"}</button>
    </div>
    ${buildIntegritySection(s, lang)}
    <div style="display:grid;grid-template-columns:1fr 1fr 22rem;gap:var(--sp-6)">
      <div>
        <div style="font-size:1.1rem;font-weight:700;text-transform:uppercase;
                    letter-spacing:0.08em;color:var(--text-subtle);margin-bottom:var(--sp-3)">
          Activités
        </div>
        ${acts || "<span style='color:var(--text-subtle)'>—</span>"}
        ${compSection}
        ${outcomeSection}
      </div>
      <div>
        <div style="font-size:1.1rem;font-weight:700;text-transform:uppercase;
                    letter-spacing:0.08em;color:var(--text-subtle);margin-bottom:var(--sp-3)">
          Contexte
        </div>
        ${info || "—"}
      </div>
      <div>
        <div style="font-size:1.1rem;font-weight:700;text-transform:uppercase;
                    letter-spacing:0.08em;color:var(--text-subtle);margin-bottom:var(--sp-3)">
          Humeur (${s.mood_points.length} jours)
        </div>
        ${moodSparklineLarge(s.mood_points)}
        ${s.last_obstacle ? `
          <div style="margin-top:var(--sp-4);padding:var(--sp-3);background:rgba(255,107,112,.08);
                      border-radius:var(--r-md);border-left:3px solid var(--danger)">
            <div style="font-size:1.1rem;font-weight:700;color:var(--danger);margin-bottom:var(--sp-1)">
              Dernier obstacle signalé (${s.last_obstacle.date})
            </div>
            <div style="font-size:1.3rem">${escHtml(s.last_obstacle.text)}</div>
            ${s.last_obstacle.response ? `<div style="font-size:1.2rem;color:var(--text-subtle);margin-top:var(--sp-1)">→ ${escHtml(s.last_obstacle.response)}</div>` : ""}
          </div>` : ""}
        ${s.last_plan ? `
          <div style="margin-top:var(--sp-3);font-size:1.3rem;color:var(--text-muted)">
            <strong>Planifié :</strong> ${escHtml(s.last_plan.text)}
            <span style="font-size:1.1rem;color:var(--text-subtle)"> (${s.last_plan.date})</span>
          </div>` : ""}
        ${s.last_wrap ? `
          <div style="margin-top:var(--sp-3);padding:var(--sp-3);background:var(--bg-subtle);
                      border-radius:var(--r-md)">
            <div style="font-size:1.1rem;font-weight:700;color:var(--text-subtle);margin-bottom:var(--sp-1)">
              Dernier bilan hebdo (${s.last_wrap.date})
            </div>
            ${s.last_wrap.wrap.highlight ? `<div style="font-size:1.3rem">🌟 ${escHtml(s.last_wrap.wrap.highlight)}</div>` : ""}
            ${s.last_wrap.wrap.change    ? `<div style="font-size:1.2rem;color:var(--text-muted)">→ ${escHtml(s.last_wrap.wrap.change)}</div>` : ""}
          </div>` : ""}
      </div>
    </div>`;
}

// ── Integrity helpers ─────────────────────────────────────────
function buildIntegrityTitle(s, lang) {
  const isFr = lang === "fr-CA";
  const integ = s.integrity || {};
  const parts = [];
  if (integ.future_count > 0)
    parts.push(isFr
      ? `${integ.future_count} journal(aux) daté(s) dans le futur`
      : `${integ.future_count} log(s) dated in the future`);
  if (integ.cluster_flag)
    parts.push(isFr
      ? `Journaux créés sur une période comprimée (${integ.cluster_detail})`
      : `Logs created in a compressed window (${integ.cluster_detail})`);
  if (integ.lag_flag)
    parts.push(isFr
      ? `Fichier exporté ${integ.lag_days} jours après le dernier journal`
      : `File exported ${integ.lag_days} days after the last log`);
  return parts.join(" · ");
}

function buildIntegritySection(s, lang) {
  const isFr = lang === "fr-CA";
  const integ = s.integrity || {};
  if (integ.ok) return "";

  const rows = [];

  if (integ.future_count > 0) {
    rows.push(`
      <div style="display:flex;gap:var(--sp-3);align-items:baseline;margin-bottom:var(--sp-2)">
        <span style="color:var(--danger);font-size:1.3rem">⚠</span>
        <div>
          <div style="font-size:1.3rem;font-weight:600;color:var(--danger)">
            ${isFr
              ? `${integ.future_count} journal(aux) à date future`
              : `${integ.future_count} future-dated log(s)`}
          </div>
          <div style="font-size:1.15rem;color:var(--text-muted)">
            ${integ.future_dates?.join(", ") || ""}
          </div>
        </div>
      </div>`);
  }

  if (integ.late_count > 0) {
    rows.push(`
      <div style="display:flex;gap:var(--sp-3);align-items:baseline;margin-bottom:var(--sp-2)">
        <span style="color:var(--warning);font-size:1.3rem">◔</span>
        <div style="font-size:1.3rem;color:var(--text-muted)">
          ${isFr
            ? `${integ.late_count} journal(aux) en saisie tardive`
            : `${integ.late_count} late-filed log(s)`}
        </div>
      </div>`);
  }

  if (integ.cluster_flag) {
    rows.push(`
      <div style="display:flex;gap:var(--sp-3);align-items:baseline;margin-bottom:var(--sp-2)">
        <span style="color:var(--danger);font-size:1.3rem">⚠</span>
        <div>
          <div style="font-size:1.3rem;font-weight:600;color:var(--danger)">
            ${isFr ? "Journaux créés sur une fenêtre comprimée" : "Logs created in a compressed window"}
          </div>
          <div style="font-size:1.15rem;color:var(--text-muted)">${integ.cluster_detail}</div>
        </div>
      </div>`);
  }

  if (integ.lag_flag) {
    rows.push(`
      <div style="display:flex;gap:var(--sp-3);align-items:baseline;margin-bottom:var(--sp-2)">
        <span style="color:var(--warning);font-size:1.3rem">⚠</span>
        <div style="font-size:1.3rem;color:var(--text-muted)">
          ${isFr
            ? `Fichier exporté ${integ.lag_days} jours après le dernier journal`
            : `File exported ${integ.lag_days} days after the last log`}
        </div>
      </div>`);
  }

  return `
    <div style="margin-top:var(--sp-4);padding-top:var(--sp-3);border-top:1px solid var(--border)">
      <div style="font-size:1.1rem;font-weight:700;text-transform:uppercase;
                  letter-spacing:0.08em;color:var(--danger);margin-bottom:var(--sp-3)">
        ${isFr ? "⚠ Signaux d'intégrité" : "⚠ Integrity signals"}
      </div>
      ${rows.join("")}
    </div>`;
}

// ── Sparklines ────────────────────────────────────────────────
function moodSparkline(points) {
  if (!points.length) return "—";
  const W = 80, H = 24, pad = 2;
  const xs = points.map((_, i) => pad + (i / Math.max(points.length - 1, 1)) * (W - pad * 2));
  const ys = points.map(p => H - pad - ((p - 1) / 4) * (H - pad * 2));
  const pts = xs.map((x, i) => `${x.toFixed(1)},${ys[i].toFixed(1)}`).join(" ");
  return `<svg viewBox="0 0 ${W} ${H}" width="${W}" height="${H}">
    <polyline points="${pts}" fill="none" stroke="var(--accent)" stroke-width="1.5"
      stroke-linejoin="round" stroke-linecap="round"/>
  </svg>`;
}

function moodSparklineLarge(points) {
  if (!points.length) return "<span style='color:var(--text-subtle)'>—</span>";
  const W = 240, H = 60, pad = 4;
  const xs = points.map((_, i) => pad + (i / Math.max(points.length - 1, 1)) * (W - pad * 2));
  const ys = points.map(p => H - pad - ((p - 1) / 4) * (H - pad * 2));
  const pts = xs.map((x, i) => `${x.toFixed(1)},${ys[i].toFixed(1)}`).join(" ");
  const areaPath = `M${xs[0].toFixed(1)},${H} ${xs.map((x,i) =>
    `L${x.toFixed(1)},${ys[i].toFixed(1)}`).join(" ")} L${xs[xs.length-1].toFixed(1)},${H} Z`;
  const dots = points.map((p, i) => {
    const col = p >= 4 ? "var(--success)" : p <= 2 ? "var(--danger)" : "var(--accent)";
    return `<circle cx="${xs[i].toFixed(1)}" cy="${ys[i].toFixed(1)}" r="3"
      fill="${col}" stroke="var(--bg-subtle)" stroke-width="1.5"/>`;
  }).join("");

  // Y axis labels
  const yLabels = [[1,"1"],[3,"3"],[5,"5"]].map(([v, label]) => {
    const y = H - pad - ((v-1)/4)*(H-pad*2);
    return `<text x="0" y="${y.toFixed(1)}" dominant-baseline="middle"
      font-size="8" fill="var(--text-subtle)">${label}</text>
      <line x1="${pad}" y1="${y.toFixed(1)}" x2="${W}" y2="${y.toFixed(1)}"
        stroke="var(--border)" stroke-width="0.5" stroke-dasharray="2,2"/>`;
  }).join("");

  return `<svg viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" overflow="visible">
    ${yLabels}
    <defs><linearGradient id="sg" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="var(--accent)" stop-opacity=".15"/>
      <stop offset="100%" stop-color="var(--accent)" stop-opacity=".02"/>
    </linearGradient></defs>
    <path d="${areaPath}" fill="url(#sg)"/>
    <polyline points="${pts}" fill="none" stroke="var(--accent)" stroke-width="2"
      stroke-linejoin="round" stroke-linecap="round"/>
    ${dots}
  </svg>`;
}

// ── File list modal ────────────────────────────────────────────
let _fileModalUUID = null;

function openFileListModal(uuid) {
  const s    = students.find(r => r.uuid === uuid);
  if (!s) return;
  _fileModalUUID = uuid;

  const lang = getCurrentLang();
  const isFr = lang === "fr-CA";
  const logs = (s.raw.logs || []).slice().sort((a, b) => b.date.localeCompare(a.date));

  document.getElementById("hub-file-modal-title").textContent =
    `${escHtml(s.name)} — ${isFr ? "Journaux" : "Logs"} (${logs.length})`;

  const exportBtn = document.getElementById("hub-file-modal-export");
  if (exportBtn) {
    exportBtn.style.display = "";
    exportBtn.textContent = isFr ? "⬇ Exporter JSON complet" : "⬇ Export full JSON";
  }

  if (!logs.length) {
    document.getElementById("hub-file-modal-body").innerHTML =
      `<p style="color:var(--text-muted);font-size:1.4rem">
        ${isFr ? "Aucun journal chargé pour cet·te étudiant·e." : "No logs loaded for this student."}
      </p>`;
    document.getElementById("hub-file-modal").classList.remove("hidden");
    return;
  }

  // Build table
  const rows = logs.map(log => {
    const hrs     = log.task_total_minutes   ? (log.task_total_minutes / 60).toFixed(1) + "h"   : "";
    const total   = log.day_duration_minutes ? (log.day_duration_minutes / 60).toFixed(1) + "h" : "";
    const created = log.created_at ? log.created_at.slice(0, 16).replace("T", " ") : "—";
    const saved   = log.saved_at   ? log.saved_at.slice(0, 16).replace("T", " ")   : "—";
    const taskCount = (log.tasks || []).length;

    const flags = [];
    if (log.future_filing) flags.push(`<span style="color:#1a5cb5;font-size:1.2rem">${isFr ? "futur" : "future"}</span>`);
    if (log.late_filing)   flags.push(`<span style="color:#b85000;font-size:1.2rem">${isFr ? "tardif" : "late"}</span>`);
    if (log.revision > 0)  flags.push(`<span style="color:var(--text-subtle);font-size:1.2rem">r${log.revision}</span>`);

    // Task summary on hover via title
    const taskSummary = (log.tasks || [])
      .slice(0, 5).map(t => t.description).filter(Boolean).join(" · ");
    const moreCount = taskCount > 5 ? ` +${taskCount - 5}` : "";

    return `
      <tr style="border-bottom:1px solid var(--border)">
        <td style="padding:var(--sp-2) var(--sp-3);font-weight:600;white-space:nowrap">${log.date}</td>
        <td style="padding:var(--sp-2) var(--sp-3);font-size:1.2rem;color:var(--text-muted);white-space:nowrap">${created}</td>
        <td style="padding:var(--sp-2) var(--sp-3);font-size:1.2rem;color:var(--text-muted);white-space:nowrap">${saved}</td>
        <td style="padding:var(--sp-2) var(--sp-3);font-size:1.3rem" title="${escHtml(taskSummary + moreCount)}">${taskCount} ${isFr ? "tâche" : "task"}${taskCount !== 1 ? "s" : ""}</td>
        <td style="padding:var(--sp-2) var(--sp-3);font-size:1.3rem">${total || hrs}${total && hrs && total !== hrs ? ` <span style="font-size:1.1rem;color:var(--text-subtle)">(${hrs} tâches)</span>` : ""}</td>
        <td style="padding:var(--sp-2) var(--sp-3)">${flags.join(" ")}</td>
        <td style="padding:var(--sp-2) var(--sp-3)">
          <button class="btn btn--ghost btn--sm" style="font-size:1.2rem;padding:2px 8px"
            onclick="exportSingleLogJSON('${uuid}','${log.log_id}')"
            title="${isFr ? "Exporter ce journal" : "Export this log"}">⬇</button>
        </td>
      </tr>`;
  }).join("");

  document.getElementById("hub-file-modal-body").innerHTML = `
    <table style="width:100%;border-collapse:collapse;font-size:1.35rem">
      <thead>
        <tr style="background:var(--bg-subtle);font-size:1.1rem;text-transform:uppercase;
                   letter-spacing:.06em;color:var(--text-subtle)">
          <th style="padding:var(--sp-2) var(--sp-3);text-align:left;white-space:nowrap">${isFr ? "Date" : "Date"}</th>
          <th style="padding:var(--sp-2) var(--sp-3);text-align:left;white-space:nowrap">${isFr ? "Créé le" : "Created"}</th>
          <th style="padding:var(--sp-2) var(--sp-3);text-align:left;white-space:nowrap">${isFr ? "Modifié le" : "Modified"}</th>
          <th style="padding:var(--sp-2) var(--sp-3);text-align:left">${isFr ? "Tâches" : "Tasks"}</th>
          <th style="padding:var(--sp-2) var(--sp-3);text-align:left">${isFr ? "Heures" : "Hours"}</th>
          <th style="padding:var(--sp-2) var(--sp-3);text-align:left">${isFr ? "Drapeaux" : "Flags"}</th>
          <th></th>
        </tr>
      </thead>
      <tbody>${rows}</tbody>
    </table>`;

  document.getElementById("hub-file-modal").classList.remove("hidden");
}

function closeFileListModal() {
  _fileModalUUID = null;
  document.getElementById("hub-file-modal").classList.add("hidden");
}

function exportStudentJSON() {
  const s = students.find(r => r.uuid === _fileModalUUID);
  if (!s) return;
  const slug = s.raw.profile?.student_id || slugify(s.name) || "student";
  downloadJSON(s.raw, `${slug}_export_complet_${localDateISO()}.json`);
}

function exportSingleLogJSON(uuid, logId) {
  const s = students.find(r => r.uuid === uuid);
  if (!s) return;
  const log = (s.raw.logs || []).find(l => l.log_id === logId);
  if (!log) return;
  const payload = { ...s.raw, logs: [log],
    meta: { ...s.raw.meta, exported_at: new Date().toISOString() } };
  const slug = s.raw.profile?.student_id || slugify(s.name) || "student";
  downloadJSON(payload, `${slug}_${log.date}.json`);
}

// ── CSV export ────────────────────────────────────────────────
function exportCSV() {
  const headers = ["Nom","ID","Programme","Superviseur·e","Cohorte","Type",
    "Jours_journalisés","Heures_attendues","Heures_réelles","Progression_%",
    "Heures_semaine","Dernier_journal","Jours_sans_log","Note_moy","Réflexion"];
  const rows = students.map(s => [
    s.name, s.student_id, s.program, s.teacher, s.cohort, s.pathway,
    s.days_logged, s.expected_hours, s.actual_hours,
    s.track_pct ?? "", s.week_hours,
    s.last_log || "", s.days_since ?? "",
    s.avg_rating ?? "", s.has_reflection ? "oui" : "non",
  ].map(v => `"${String(v).replace(/"/g,'""')}"`));

  const csv = [headers, ...rows].map(r => r.join(",")).join("\n");
  const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `hub_stage_${new Date().toISOString().slice(0,10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

// ── Hub monthly grid view ─────────────────────────────────────
// Regular week-grid calendar (Mon→Sun rows), covering the cohort date range.
// Each cell shows: attendance heat (green intensity), onsite/remote bar, milestones.
function renderMonthGridView() {
  const container = document.getElementById("hub-monthgrid-section");
  if (!container) return;
  const isFr   = getCurrentLang() === "fr-CA";
  const cohort  = filtered;

  if (!cohort.length) {
    container.innerHTML = `<p class="text-muted" style="padding:var(--sp-6)">
      ${isFr ? "Aucun étudiant·e visible." : "No students visible."}</p>`;
    return;
  }

  // ── Date range ─────────────────────────────────────────────
  const today      = localDateISO();
  const sixMonthsAgo    = localDateISO(new Date(new Date().setMonth(new Date().getMonth() - 6)));
  const sixMonthsAhead  = localDateISO(new Date(new Date().setMonth(new Date().getMonth() + 6)));

  function inSafetyWindow(iso) {
    return iso && iso.match(/^\d{4}-\d{2}-\d{2}$/) && iso >= sixMonthsAgo && iso <= sixMonthsAhead;
  }

  const allStarts = cohort.map(s => s.raw.context?.start_date).filter(inSafetyWindow).sort();
  const allEnds   = cohort.map(s => s.raw.context?.scheduled_end_date).filter(inSafetyWindow).sort();

  const rangeStart = allStarts[0]                || today;
  const rangeEnd   = allEnds.length ? allEnds[allEnds.length - 1] : (allStarts[allStarts.length - 1] || today);
  console.group("[LCI Hub] Vue mensuelle — date range sources");
  console.info(`Safety window: ${sixMonthsAgo} → ${sixMonthsAhead}`);
  let anomalies = 0;
  cohort.forEach(s => {
    const ctx  = s.raw.context || {};
    const rawStart = ctx.start_date;
    const rawEnd   = ctx.scheduled_end_date;
    const startOk  = inSafetyWindow(rawStart);
    const endOk    = inSafetyWindow(rawEnd);
    if (!startOk || !endOk) {
      anomalies++;
      console.warn(`  ${s.name}`,
        !startOk ? `start_date: ${rawStart || "MISSING"} ⚠ IGNORED` : "",
        !endOk   ? `scheduled_end_date: ${rawEnd || "MISSING"} ⚠ IGNORED` : ""
      );
    }
  });
  if (!anomalies) console.info("  All dates within window — no anomalies.");
  console.info(`→ rangeStart: ${rangeStart}  rangeEnd: ${rangeEnd}`,
    `(${Math.round((new Date(rangeEnd) - new Date(rangeStart)) / 86400000)} days)`);
  console.groupEnd();

  function addDays(iso, n) {
    const d = new Date(iso + "T12:00:00"); d.setDate(d.getDate() + n);
    return d.toISOString().slice(0, 10);
  }
  function dowOf(iso) { return new Date(iso + "T12:00:00").getDay(); }
  function dayNumOf(iso) { return new Date(iso + "T12:00:00").getDate(); }

  // Expand grid to full Mon–Sun weeks
  let gridStart = rangeStart;
  while (dowOf(gridStart) !== 1) gridStart = addDays(gridStart, -1);
  let gridEnd = rangeEnd;
  while (dowOf(gridEnd) !== 0) gridEnd = addDays(gridEnd, 1);

  const allDays = [];
  let cur = gridStart;
  while (cur <= gridEnd) { allDays.push(cur); cur = addDays(cur, 1); }

  // ── Per-day helpers ────────────────────────────────────────
  function isWorkDay(s, d) {
    const ctx = s.raw.context || {};
    const wd  = ctx.work_days || [1,2,3,4,5];
    const abs = (ctx.planned_absences || []).map(a => a.date);
    const dow = dowOf(d);
    if (!wd.includes(dow)) return false;
    if (abs.includes(d)) return false;
    if (ctx.start_date && d < ctx.start_date) return false;
    if (ctx.scheduled_end_date && d > ctx.scheduled_end_date) return false;
    return true;
  }

  const logMap = {};
  cohort.forEach(s => { logMap[s.uuid] = {}; (s.raw.logs || []).forEach(l => { logMap[s.uuid][l.date] = l; }); });

  const planMap = {};
  cohort.forEach(s => { planMap[s.uuid] = {}; (s.raw.context?.planned_modalities || []).forEach(m => { planMap[s.uuid][m.date] = m.modality; }); });

  const milestonesByDate = {};
  try {
    Object.values(Object.keys(hubMilestones).length ? hubMilestones : loadMilestones()).forEach(({ project }) => {
      const emoji = project.emoji || "\uD83D\uDEA9";
      (project.milestones || []).forEach(m => {
        if (!m.date) return;
        if (!milestonesByDate[m.date]) milestonesByDate[m.date] = [];
        milestonesByDate[m.date].push({ emoji, title: m.title, projectName: project.name });
      });
    });
  } catch (e) {}

  function getStats(d) {
    const working   = cohort.filter(s => isWorkDay(s, d));
    const n         = working.length;
    const submitted = working.filter(s => logMap[s.uuid]?.[d]).length;
    const onsite    = working.filter(s => planMap[s.uuid]?.[d] === "onsite").length;
    const remote    = working.filter(s => planMap[s.uuid]?.[d] === "remote").length;
    const hybrid    = working.filter(s => planMap[s.uuid]?.[d] === "hybrid").length;
    return { n, submitted, onsite, remote, hybrid };
  }

  // ── Cell renderer ──────────────────────────────────────────
  function renderCell(d) {
    const inRange = d >= rangeStart && d <= rangeEnd;
    const isToday = d === today;
    const isPast  = d < today;
    const isWE    = dowOf(d) === 0 || dowOf(d) === 6;
    const ms      = milestonesByDate[d] || [];
    const st      = getStats(d);
    const dn      = dayNumOf(d);

    let bgStyle;
    if (!inRange) {
      bgStyle = "background:var(--bg-subtle);";
    } else if (st.n === 0) {
      bgStyle = isWE ? "background:var(--bg-subtle);" : "background:var(--bg-card);";
    } else {
      const ratio = isPast ? st.submitted / st.n : 0;
      const alpha = isPast ? (0.1 + ratio * 0.5) : 0.08;
      bgStyle = `background:rgba(91,128,0,${alpha.toFixed(2)});`;
    }

    const borderStyle = isToday ? "outline:2px solid var(--accent);outline-offset:-2px;" : "";

    const barHTML = (st.onsite + st.remote + st.hybrid > 0 && inRange) ? (() => {
      const pOn  = Math.round(st.onsite  / st.n * 100);
      const pRem = Math.round(st.remote  / st.n * 100);
      const pHyb = Math.round(st.hybrid  / st.n * 100);
      return `<div style="position:absolute;bottom:0;left:0;width:100%;height:4px;display:flex;overflow:hidden">
        <div style="width:${pOn}%;background:#3B6D11"></div>
        <div style="width:${pRem}%;background:#185FA5"></div>
        <div style="width:${pHyb}%;background:#BA7517"></div>
      </div>`;
    })() : "";

    const msEmojis = ms.map(m => m.emoji).join("");
    const msTip    = ms.map(m => `${m.emoji} ${m.title} — ${m.projectName}`).join("\n");
    const msHTML   = ms.length ? `<div style="font-size:1.1rem;line-height:1.2;letter-spacing:-1px">${msEmojis}</div>` : "";

    const statsHTML = inRange && st.n > 0
      ? `<div style="font-size:1.1rem;color:var(--text-muted);margin-top:2px">
           ${isPast ? `${st.submitted}/${st.n}` : `${st.n}`}
         </div>`
      : "";

    const monthAbbr = new Date(d + "T12:00:00").toLocaleDateString(
      isFr ? "fr-CA" : "en-CA", { month: "short" });

    const dateLabel = `<span style="font-size:1.3rem;font-weight:${isToday ? 700 : isWE ? 400 : 500};
                      color:${isToday ? "var(--accent)" : isWE ? "var(--text-muted)" : "var(--text)"}">${dn}</span>`;

    const tip = [
      new Date(d + "T12:00:00").toLocaleDateString(isFr ? "fr-CA" : "en-CA", { day:"numeric", month:"long", year:"numeric" }),
      inRange && st.n > 0 ? `${isFr ? "En stage" : "Interning"}: ${st.n}` : "",
      isPast && inRange && st.n > 0 ? `${isFr ? "Soumis" : "Submitted"}: ${st.submitted}` : "",
      st.onsite ? `${isFr ? "Présentiel" : "Onsite"}: ${st.onsite}` : "",
      st.remote ? `${isFr ? "Télétravail" : "Remote"}: ${st.remote}` : "",
      st.hybrid ? `${isFr ? "Mixte" : "Hybrid"}: ${st.hybrid}` : "",
      msTip,
    ].filter(Boolean).join("\n");

    return `
      <td title="${escHtml(tip)}" style="width:14.28%;vertical-align:top;padding:0">
        <div style="min-height:7rem;padding:var(--sp-2);border:0.5px solid var(--border);
                    margin:-0.5px 0 0 -0.5px;position:relative;${bgStyle}${borderStyle}">
          <div style="display:flex;justify-content:space-between;align-items:flex-start">
            ${dateLabel}${msHTML}
          </div>
          ${statsHTML}
          ${barHTML}
          <div style="position:absolute;bottom:var(--sp-1);right:var(--sp-2);
                      font-size:1rem;color:var(--text-subtle);font-weight:400;
                      ${dn === 1 ? "color:var(--accent);font-weight:600;" : ""}">
            ${monthAbbr}
          </div>
        </div>
      </td>`;
  }

  // ── Assemble ───────────────────────────────────────────────
  const DOW_FR = ["Lun","Mar","Mer","Jeu","Ven","Sam","Dim"];
  const DOW_EN = ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];
  const dowLabels = isFr ? DOW_FR : DOW_EN;

  const weeks = [];
  for (let i = 0; i < allDays.length; i += 7) weeks.push(allDays.slice(i, i+7));

  const gridHTML = weeks.map(week =>
    `<tr>${week.map(d => renderCell(d)).join("")}</tr>`
  ).join("");

  container.innerHTML = `
    <div style="display:flex;flex-wrap:wrap;gap:var(--sp-3) var(--sp-5);
                margin-bottom:var(--sp-4);font-size:1.2rem;align-items:center">
      <div style="display:flex;align-items:center;gap:var(--sp-2)">
        <div style="width:2.8rem;height:1.4rem;background:linear-gradient(to right,rgba(91,128,0,0.08),rgba(91,128,0,0.55));border-radius:3px"></div>
        ${isFr ? "Intensité = taux de soumission" : "Intensity = submission rate"}
      </div>
      <div style="display:flex;align-items:center;gap:var(--sp-2)">
        <div style="width:2.4rem;height:4px;display:flex;border-radius:2px;overflow:hidden">
          <div style="flex:1;background:#3B6D11"></div>
          <div style="flex:1;background:#185FA5"></div>
          <div style="flex:1;background:#BA7517"></div>
        </div>
        ${isFr ? "Présentiel / télétravail / mixte" : "Onsite / remote / hybrid"}
      </div>
      <div style="display:flex;align-items:center;gap:var(--sp-2)">
        <span style="font-weight:600;color:var(--text-muted)">2/5</span>
        ${isFr ? "Soumis / en stage" : "Submitted / interning"}
      </div>
      <div style="display:flex;align-items:center;gap:var(--sp-2)">
        <span>🚩</span>${isFr ? "Jalons de projet" : "Project milestones"}
      </div>
    </div>
    <div style="overflow-x:auto">
      <table style="width:100%;border-collapse:collapse;table-layout:fixed">
        <thead>
          <tr>${dowLabels.map(l =>
            `<th style="text-align:center;font-size:1.2rem;font-weight:600;
                        color:var(--text-subtle);padding:var(--sp-2) 0">${l}</th>`
          ).join("")}</tr>
        </thead>
        <tbody>${gridHTML}</tbody>
      </table>
    </div>`;
}

// ── Hub calendar view ─────────────────────────────────────────
// Shows a date grid: rows = students, columns = working days.
// Cells show submission status and modality for each day.
// Column headers show cohort-level stats: planned / submitted / onsite.

function renderCalendarView() {
  const container = document.getElementById("hub-cal-section");
  if (!container) return;
  const isFr = getCurrentLang() === "fr-CA";

  const cohort = filtered;
  if (!cohort.length) {
    container.innerHTML = `<p class="text-muted" style="padding:var(--sp-6)">
      ${isFr ? "Aucun étudiant·e visible." : "No students visible."}</p>`;
    return;
  }

  // ── Determine date range ──────────────────────────────────
  // Use the intersection of all students' internship periods if they overlap,
  // otherwise fall back to the union clamped to a reasonable window.
  const today = localDateISO();
  const _sixAgo   = localDateISO(new Date(new Date().setMonth(new Date().getMonth() - 6)));
  const _sixAhead = localDateISO(new Date(new Date().setMonth(new Date().getMonth() + 6)));
  const _safe = iso => iso && iso.match(/^\d{4}-\d{2}-\d{2}$/) && iso >= _sixAgo && iso <= _sixAhead;

  const allStarts = cohort.map(s => s.raw.context?.start_date).filter(_safe).sort();
  const allEnds   = cohort.map(s => s.raw.context?.scheduled_end_date).filter(_safe).sort();

  // Default to today ± 30 days if no dates defined
  const rangeStart = allStarts[0]             || today;
  const rangeEnd   = allEnds[allEnds.length - 1] || today;

  // Build list of all calendar days in range
  const allDays = [];
  let cur = new Date(rangeStart + "T12:00:00");
  const end = new Date(rangeEnd  + "T12:00:00");
  while (cur <= end) {
    allDays.push(cur.toISOString().slice(0, 10));
    cur.setDate(cur.getDate() + 1);
  }

  // Limit to 90 days to keep the table readable; add a notice if truncated
  const MAX_DAYS = 90;
  const truncated = allDays.length > MAX_DAYS;
  const days = allDays.slice(0, MAX_DAYS);

  // ── Build per-student log maps ────────────────────────────
  // logMap[uuid][date] = { submitted, onsite, remote, late, future }
  const logMap = {};
  cohort.forEach(s => {
    const uid = s.uuid;
    logMap[uid] = {};
    (s.raw.logs || []).forEach(l => {
      logMap[uid][l.date] = {
        submitted:    true,
        onsite:       !!l.modality_onsite,
        remote:       !!l.modality_remote,
        late_filing:  !!l.late_filing,
        future_filing:!!l.future_filing,
      };
    });
  });

  // ── Per-day cohort stats ──────────────────────────────────
  // For each day: how many students planned to work, submitted, were onsite
  function isWorkDay(s, dateStr) {
    const dow = new Date(dateStr + "T12:00:00").getDay(); // 0=Sun
    const workDays = s.raw.context?.work_days || [1,2,3,4,5];
    if (!workDays.includes(dow)) return false;
    const start = s.raw.context?.start_date;
    const end   = s.raw.context?.scheduled_end_date;
    if (start && dateStr < start) return false;
    if (end   && dateStr > end)   return false;
    const absences = s.raw.context?.planned_absences || [];
    if (absences.includes(dateStr)) return false;
    return true;
  }

  // Build planned-modality lookup per student
  const planMap = {};
  cohort.forEach(s => {
    planMap[s.uuid] = {};
    (s.raw.context?.planned_modalities || []).forEach(m => {
      planMap[s.uuid][m.date] = m.modality; // "onsite"|"remote"|"hybrid"
    });
  });

  const dayStats = days.map(d => {
    const planned        = cohort.filter(s => isWorkDay(s, d)).length;
    const submitted      = cohort.filter(s => logMap[s.uuid]?.[d]?.submitted).length;
    const onsite         = cohort.filter(s => logMap[s.uuid]?.[d]?.onsite).length;
    const planOnsite     = cohort.filter(s => isWorkDay(s,d) && planMap[s.uuid]?.[d] === "onsite").length;
    const planRemote     = cohort.filter(s => isWorkDay(s,d) && planMap[s.uuid]?.[d] === "remote").length;
    const planHybrid     = cohort.filter(s => isWorkDay(s,d) && planMap[s.uuid]?.[d] === "hybrid").length;
    return { date: d, planned, submitted, onsite, planOnsite, planRemote, planHybrid };
  });

  // ── Colour helpers ────────────────────────────────────────
  // Cells encode BOTH planned modality (dot) AND reality (fill).
  // Top half of cell = plan indicator; fill colour = actual submission.
  function cellStyle(s, d) {
    const entry = logMap[s.uuid]?.[d];
    const plan  = planMap[s.uuid]?.[d];

    if (!isWorkDay(s, d)) return "background:var(--bg-subtle);";

    // Base fill from reality
    let fill;
    if (!entry) {
      fill = "background:var(--bg-card);border:1.5px solid var(--border);";
    } else if (entry.future_filing) {
      fill = "background:rgba(255,107,112,.18);border:1.5px solid var(--danger);";
    } else if (entry.onsite) {
      fill = "background:var(--accent);opacity:.85;";
    } else if (entry.remote) {
      fill = "background:var(--color-blue-400,#5ba8c4);opacity:.85;";
    } else {
      fill = "background:var(--text-subtle);opacity:.5;";
    }

    // Plan dot overlay via border-top colour
    if (plan && !entry) {
      const planColour = plan === "onsite"  ? "var(--accent)"
                       : plan === "remote"  ? "var(--color-blue-400,#5ba8c4)"
                       : "var(--color-charcoal-300,#9ca3a5)";
      fill += `border-top:3px solid ${planColour};`;
    }
    return fill;
  }

  function cellTitle(s, d) {
    const entry = logMap[s.uuid]?.[d];
    const plan  = planMap[s.uuid]?.[d];
    if (!isWorkDay(s, d)) return isFr ? "Hors horaire" : "Not a work day";
    const planStr = plan
      ? (isFr ? `Prévu : ${plan}` : `Planned: ${plan}`)
      : (isFr ? "Modalité non précisée" : "Modality not set");
    if (!entry) return `${d} — ${planStr} · ${isFr ? "pas de journal" : "no log"}`;
    const flags = [
      entry.onsite        ? (isFr ? "présentiel"     : "onsite")  : "",
      entry.remote        ? (isFr ? "télétravail"     : "remote")  : "",
      entry.late_filing   ? (isFr ? "saisie tardive"  : "late")    : "",
      entry.future_filing ? (isFr ? "saisie future"   : "future")  : "",
    ].filter(Boolean).join(", ");
    return `${d} — ${isFr ? "Réel" : "Actual"}: ${flags || (isFr ? "soumis" : "submitted")} · ${planStr}`;
  }

  // ── Stat bar gradient (submitted / planned) ───────────────
  function statBar(submitted, planned, onsite) {
    if (!planned) return "";
    const pctSub    = Math.round((submitted / planned) * 100);
    const pctOnsite = planned ? Math.round((onsite / planned) * 100) : 0;
    const colour = pctSub >= 90 ? "var(--success,#2a6e00)"
                 : pctSub >= 60 ? "var(--warning,#c47a3a)"
                 : "var(--danger)";
    return `
      <div style="height:4px;background:var(--border);border-radius:2px;margin-top:2px">
        <div style="height:100%;width:${pctSub}%;background:${colour};border-radius:2px;
                    position:relative">
          <div style="position:absolute;top:0;left:0;height:100%;width:${pctOnsite}%;
                      background:var(--accent);opacity:.7;border-radius:2px"></div>
        </div>
      </div>`;
  }

  // ── Month header spans ────────────────────────────────────
  // Group consecutive days by month for the top header row
  const monthGroups = [];
  let lastMonth = null, span = 0;
  days.forEach((d, i) => {
    const m = d.slice(0, 7);
    if (m !== lastMonth) {
      if (lastMonth) monthGroups.push({ label: lastMonth, span });
      lastMonth = m; span = 1;
    } else { span++; }
    if (i === days.length - 1) monthGroups.push({ label: lastMonth, span });
  });

  function monthLabel(ym) {
    const [y, m] = ym.split("-");
    return new Date(+y, +m - 1, 1).toLocaleDateString(
      isFr ? "fr-CA" : "en-CA", { month: "long", year: "numeric" });
  }

  // ── Cell size — shrink when many days ────────────────────
  const cellW = days.length > 60 ? 14 : days.length > 30 ? 18 : 24;

  // ── Load milestones ───────────────────────────────────────
  // Build a lookup: date → array of { emoji, title, projectName }
  const milestonesByDate = {};
  try {
    const ms = Object.keys(hubMilestones).length ? hubMilestones : loadMilestones(); // prefer uploaded milestone files
    Object.values(ms).forEach(({ project }) => {
      const emoji = project.emoji || "🚩";
      (project.milestones || []).forEach(m => {
        if (!m.date) return;
        if (!milestonesByDate[m.date]) milestonesByDate[m.date] = [];
        milestonesByDate[m.date].push({ emoji, title: m.title, projectName: project.name });
      });
    });
  } catch (e) { /* milestones not available */ }

  // ── Build HTML ────────────────────────────────────────────
  const CELL = (bg, title, content = "") =>
    `<td title="${escHtml(title)}" style="width:${cellW}px;min-width:${cellW}px;
      height:${cellW}px;padding:0;${bg}border-radius:3px;text-align:center;
      font-size:${cellW > 16 ? "10px" : "8px"};line-height:${cellW}px;overflow:hidden">${content}</td>`;

  const thead_month = `<tr>
    <th style="min-width:14rem;text-align:left;position:sticky;left:0;
               background:var(--bg-card);z-index:2;font-weight:600">
      ${isFr ? "Étudiant·e" : "Student"}
    </th>
    ${monthGroups.map(g =>
      `<th colspan="${g.span}" style="text-align:left;font-size:1rem;
        padding-bottom:0;white-space:nowrap;font-weight:600;color:var(--accent)">
        ${monthLabel(g.label)}
      </th>`
    ).join("")}
  </tr>`;

  // Milestone row — one emoji per day that has milestone(s)
  const hasMilestones = Object.keys(milestonesByDate).length > 0;
  const thead_milestones = hasMilestones ? `<tr>
    <td style="position:sticky;left:0;background:var(--bg-card);z-index:2;
               font-size:1.1rem;color:var(--text-subtle);padding:0 var(--sp-2);
               white-space:nowrap">${isFr ? "Jalons" : "Milestones"}</td>
    ${days.map(d => {
      const ms = milestonesByDate[d];
      if (!ms?.length) return `<td style="width:${cellW}px;min-width:${cellW}px;height:${cellW}px;padding:0"></td>`;
      const tip = ms.map(m => `${m.emoji} ${m.title} — ${m.projectName}`).join("\n");
      const display = ms.length === 1 ? ms[0].emoji : ms.map(m => m.emoji).join("");
      return `<td title="${escHtml(tip)}" style="width:${cellW}px;min-width:${cellW}px;
        height:${cellW}px;padding:0;text-align:center;font-size:${cellW > 16 ? "12px" : "9px"};
        line-height:${cellW}px">${display}</td>`;
    }).join("")}
  </tr>` : "";

  const thead_days = `<tr>
    <th style="position:sticky;left:0;background:var(--bg-card);z-index:2"></th>
    ${days.map((d, i) => {
      const dt = new Date(d + "T12:00:00");
      const dow = dt.getDay();
      const isWE = dow === 0 || dow === 6;
      const dayNum = dt.getDate();
      const dayLetter = dt.toLocaleDateString(isFr ? "fr-CA" : "en-CA",
        { weekday:"narrow" });
      const stat = dayStats[i];
      return `<th title="${d}" style="width:${cellW}px;min-width:${cellW}px;padding:1px 0;
               vertical-align:bottom;font-weight:${isWE ? 400 : 600};
               color:${isWE ? "var(--text-subtle)" : "var(--text)"}">
        <div style="writing-mode:vertical-rl;transform:rotate(180deg);
                    font-size:0.95rem;line-height:1;margin-bottom:2px">
          ${dayLetter}${dayNum}
        </div>
        ${stat.planned > 0 ? `
          <div style="font-size:0.9rem;color:var(--text-subtle);text-align:center">
            ${stat.submitted}/${stat.planned}
          </div>
          ${statBar(stat.submitted, stat.planned, stat.onsite)}
          <div style="font-size:0.8rem;color:var(--text-subtle);text-align:center;margin-top:1px"
               title="${isFr ? 'Prévu : présentiel / télétravail' : 'Planned: onsite / remote'}">
            ${stat.planOnsite ? '●'.repeat(Math.min(stat.planOnsite,3)) : ''}${stat.planRemote ? '<span style="color:var(--color-blue-400,#5ba8c4)">' + '●'.repeat(Math.min(stat.planRemote,3)) + '</span>' : ''}
          </div>` : ""}
      </th>`;
    }).join("")}
  </tr>`;

  // Global summary row — heat-map fill by # students working + stacked modality bar
  const thead_summary = `<tr style="background:var(--bg-subtle)">
    <td style="position:sticky;left:0;background:var(--bg-subtle);z-index:2;
               font-size:1.1rem;font-weight:600;color:var(--text-subtle);
               padding:0 var(--sp-2);white-space:nowrap">
      ${isFr ? "Cohort" : "Cohort"}
    </td>
    ${days.map((d, i) => {
      const stat = dayStats[i];
      if (!stat.planned) {
        return `<td style="width:${cellW}px;min-width:${cellW}px;height:${cellW}px;
          padding:0;background:var(--bg-subtle)"></td>`;
      }
      const ratio = stat.planned > 0 ? stat.submitted / stat.planned : 0;
      // Heat: green shades by attendance density
      const alpha = 0.12 + ratio * 0.55;
      const bg = `rgba(91,128,0,${alpha.toFixed(2)})`;
      // Modality split: stacked mini-bar inside the cell
      const totalPlan = stat.planOnsite + stat.planRemote + stat.planHybrid;
      const pctOn  = totalPlan ? Math.round(stat.planOnsite  / stat.planned * 100) : 0;
      const pctRem = totalPlan ? Math.round(stat.planRemote  / stat.planned * 100) : 0;
      const tip = [
        `${d}`,
        `${isFr ? "Travaillent" : "Working"}: ${stat.planned}`,
        `${isFr ? "Soumis" : "Submitted"}: ${stat.submitted}`,
        stat.planOnsite  ? `${isFr ? "Présentiel" : "Onsite"}: ${stat.planOnsite}`  : "",
        stat.planRemote  ? `${isFr ? "Télétravail" : "Remote"}: ${stat.planRemote}` : "",
        stat.planHybrid  ? `${isFr ? "Mixte"       : "Hybrid"}: ${stat.planHybrid}` : "",
      ].filter(Boolean).join("\n");
      return `<td title="${escHtml(tip)}" style="width:${cellW}px;min-width:${cellW}px;
        height:${cellW}px;padding:0;background:${bg};border-radius:3px;
        position:relative;overflow:hidden">
        ${totalPlan ? `
          <div style="position:absolute;bottom:0;left:0;width:100%;height:3px;display:flex">
            <div style="width:${pctOn}%;background:#3B6D11;height:100%"></div>
            <div style="width:${pctRem}%;background:#185FA5;height:100%"></div>
          </div>` : ""}
      </td>`;
    }).join("")}
  </tr>`;

  const tbody = cohort.map(s => {
    const cells = days.map(d => CELL(cellStyle(s, d), cellTitle(s, d))).join("");
    // Submitted count for this student
    const submCount = days.filter(d => logMap[s.uuid]?.[d]?.submitted).length;
    const workCount = days.filter(d => isWorkDay(s, d)).length;
    return `<tr>
      <td style="position:sticky;left:0;background:var(--bg-card);z-index:1;
                 white-space:nowrap;padding:2px var(--sp-3) 2px 0;font-size:1.2rem"
          onclick="openStudentPanel('${escHtml(s.uuid)}')" style="cursor:pointer">
        <strong>${escHtml(s.name)}</strong>
        <span style="color:var(--text-subtle);font-size:1rem;margin-left:var(--sp-2)">
          ${submCount}/${workCount}
        </span>
      </td>
      ${cells}
    </tr>`;
  }).join("");

  // ── Legend ────────────────────────────────────────────────
  const legendItems = [
    { bg: "background:var(--accent)",                   label: isFr ? "Réel : présentiel" : "Actual: onsite" },
    { bg: "background:var(--color-blue-400,#5ba8c4)",   label: isFr ? "Réel : télétravail" : "Actual: remote" },
    { bg: "background:var(--text-subtle);opacity:.5",   label: isFr ? "Soumis (modalité inconnue)" : "Submitted (no modality)" },
    { bg: "background:rgba(255,107,112,.25);border:1.5px solid var(--danger)", label: isFr ? "Date future" : "Future-filed" },
    { bg: "background:var(--bg-card);border:1.5px solid var(--border);border-top:3px solid var(--accent)", label: isFr ? "Prévu : présentiel (non soumis)" : "Planned: onsite (no log yet)" },
    { bg: "background:var(--bg-card);border:1.5px solid var(--border);border-top:3px solid var(--color-blue-400,#5ba8c4)", label: isFr ? "Prévu : télétravail (non soumis)" : "Planned: remote (no log yet)" },
    { bg: "background:var(--bg-subtle)",                label: isFr ? "Hors horaire" : "Not scheduled" },
    { bg: "background:rgba(91,128,0,0.55)",             label: isFr ? "Ligne cohort — vert foncé = tous présents" : "Cohort row — dark green = full attendance" },
    { custom: `<div style="height:14px;width:24px;background:rgba(91,128,0,0.3);border-radius:2px;position:relative"><div style="position:absolute;bottom:0;left:0;width:100%;height:3px;display:flex"><div style="width:50%;background:#3B6D11"></div><div style="width:30%;background:#185FA5"></div></div></div>`, label: isFr ? "Barre du bas : vert=présentiel, bleu=télétravail" : "Bottom bar: green=onsite, blue=remote" },
    { custom: `<span style="font-size:14px">🚩</span>`, label: isFr ? "Jalon de projet" : "Project milestone" },
  ];
  const legend = `
    <div style="display:flex;flex-wrap:wrap;gap:var(--sp-3) var(--sp-5);
                margin-bottom:var(--sp-4);align-items:center">
      ${legendItems.map(item =>
        `<div style="display:flex;align-items:center;gap:var(--sp-2);font-size:1.2rem">
          ${item.custom
            ? item.custom
            : `<div style="width:1.4rem;height:1.4rem;border-radius:3px;flex-shrink:0;${item.bg}"></div>`}
          ${escHtml(item.label)}
        </div>`
      ).join("")}
    </div>`;

  // ── Onsite summary bar ────────────────────────────────────
  // Total onsite today (or last available day)
  const availableToday = dayStats.find(d => d.date === today) || dayStats[dayStats.length - 1];
  const onsiteSummary = availableToday ? `
    <div style="display:flex;gap:var(--sp-6);flex-wrap:wrap;margin-bottom:var(--sp-5)">
      <div>
        <div style="font-size:2.4rem;font-weight:500;color:var(--accent)">
          ${availableToday.onsite}
        </div>
        <div style="font-size:1.2rem;color:var(--text-subtle)">
          ${isFr ? "En présentiel aujourd'hui" : "Onsite today"}
        </div>
      </div>
      <div>
        <div style="font-size:2.4rem;font-weight:500">
          ${availableToday.submitted}/${availableToday.planned}
        </div>
        <div style="font-size:1.2rem;color:var(--text-subtle)">
          ${isFr ? "Journaux soumis / attendus" : "Logs submitted / expected"}
        </div>
      </div>
    </div>` : "";

  const truncNotice = truncated ? `
    <p style="font-size:1.2rem;color:var(--text-subtle);margin-bottom:var(--sp-3)">
      ⚠ ${isFr
        ? `Affichage limité aux ${MAX_DAYS} premiers jours.`
        : `Display limited to the first ${MAX_DAYS} days.`}
    </p>` : "";

  container.innerHTML = `
    <div style="padding:var(--sp-2) 0">
      ${onsiteSummary}
      ${legend}
      ${truncNotice}
      <div style="overflow-x:auto;-webkit-overflow-scrolling:touch">
        <table style="border-collapse:separate;border-spacing:2px;table-layout:fixed">
          <thead>${thead_month}${thead_milestones}${thead_days}${thead_summary}</thead>
          <tbody>${tbody}</tbody>
        </table>
      </div>
    </div>`;
}
