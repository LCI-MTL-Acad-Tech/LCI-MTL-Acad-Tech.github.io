// ============================================================
// calendar.js — Internship wall calendar
// Reads from localStorage (same origin) or a JSON file upload.
// Writes planned_absences back to localStorage via saveData().
// Download history is tracked in LS.DOWNLOADS (separate key,
// survives resets) via stampDownload() in app.js.
// ============================================================

let calData      = null; // loaded internship data
let calDownloads = {};   // { "YYYY-MM-DD": ["d"|"w"|"f"] }
let pendingAbsenceDate = null; // date being edited in the modal
let calMilestones    = {};    // { [project_id]: { exported_at, exported_by, file_title, project } }
let hiddenProjects   = new Set(); // project_ids hidden via sidebar checkboxes

// ── Init ──────────────────────────────────────────────────────
document.addEventListener("DOMContentLoaded", () => {
  initPage(); // calls applyLanguage internally; MutationObserver re-renders on change
  initFileSidebar();

  calData       = loadData();
  calDownloads  = getDownloads();
  calMilestones = loadMilestones();

  if (calData && calData.context?.start_date) {
    showCalendar();
  } else {
    document.getElementById("cal-no-data").classList.remove("hidden");
    sidebarOpenForData();
  }

  // Re-render when language OR theme changes (both update html attributes)
  new MutationObserver(() => {
    if (calData) renderAll();
  }).observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["lang", "data-theme"],
  });

  // Drop zone on no-data screen
  const noData = document.getElementById("cal-no-data");
  if (noData) {
    noData.addEventListener("dragover", e => { e.preventDefault(); });
    noData.addEventListener("drop",     e => {
      e.preventDefault();
      const f = e.dataTransfer.files[0];
      if (f) loadCalFile(f);
    });
  }
});

function showCalendar() {
  document.getElementById("cal-no-data").classList.add("hidden");
  document.getElementById("cal-main").classList.remove("hidden");
  renderAll();
}

function _showCalFileHint(mode) {
  document.getElementById("cal-file-hint")?.remove();
  const lang = getCurrentLang();
  const isFr = lang === "fr-CA";
  const msg = mode === "merged"
    ? (isFr ? "✓ Données fusionnées avec celles déjà enregistrées. Tes modifications du calendrier sont préservées."
             : "✓ Data merged with existing records. Your calendar edits are preserved.")
    : (isFr ? "✓ Fichier chargé et enregistré. Les modifications que tu feras ici seront conservées."
             : "✓ File loaded and saved. Any changes you make here will be kept.");
  const div = document.createElement("div");
  div.id = "cal-file-hint";
  div.style.cssText = "margin-bottom:var(--sp-3);font-size:1.3rem;color:var(--success);";
  div.textContent = msg;
  const grid = document.getElementById("cal-main");
  if (grid) grid.prepend(div);
  setTimeout(() => div.remove(), 6000);
}

// ── File upload fallback ──────────────────────────────────────
function loadCalFile(file) {
  if (!file) return;
  const r = new FileReader();
  r.onload = e => {
    try {
      const d = JSON.parse(e.target.result);

      // Run migration first — recovers missing blocks, remaps old fields
      migrateData(d);

      // Must at minimum have a context block to be useful
      if (!d.context) {
        console.error("[LCI Calendar] File rejected — no 'context' block after migration.", d);
        const lang = getCurrentLang();
        alert(lang === "fr-CA"
          ? "Fichier non reconnu. Utilise un fichier JSON de journal de stage ou de configuration."
          : "File not recognized. Use an internship log or configuration JSON file.");
        return;
      }

      const existing  = loadData();
      const fileUUID  = d.meta?.student_uuid;
      const existUUID = existing?.meta?.student_uuid;
      const sameStudent = existing && fileUUID && fileUUID === existUUID;

      let toSave;

      if (sameStudent) {
        // Same student — merge carefully:
        // - Logs: union by log_id (existing logs kept, new ones from file added)
        // - Context: existing wins for calendar-specific edits (absences, modality,
        //   date overrides), file wins for profile data (dates, schedule)
        const existingLogIds = new Set((existing.logs || []).map(l => l.log_id));
        const newLogs = (d.logs || []).filter(l => !existingLogIds.has(l.log_id));
        const mergedContext = {
          ...d.context,                    // file: dates, schedule, course
          // existing wins for calendar-only fields the student may have edited in-browser
          planned_absences:         existing.context?.planned_absences         ?? d.context.planned_absences,
          planned_modalities:       existing.context?.planned_modalities       ?? d.context.planned_modalities,
          work_hours_date_overrides: existing.context?.work_hours_date_overrides ?? d.context.work_hours_date_overrides,
        };
        toSave = {
          ...existing,
          context: mergedContext,
          logs: [...(existing.logs || []), ...newLogs],
        };
        console.info(`[LCI Calendar] Same student — merged ${newLogs.length} new log(s), kept existing calendar edits.`);
      } else {
        // Different student or no existing data — use file as-is
        toSave = d;
        if (existing?.meta?.student_uuid) {
          console.warn("[LCI Calendar] UUID mismatch — overwriting existing data with file.", { existing: existUUID, file: fileUUID });
        }
      }

      // Persist so modal saves survive reload
      if (toSave.profile?.full_name || toSave.meta?.student_uuid) {
        saveData(toSave);
        console.info("[LCI Calendar] Saved to localStorage.");
      }

      calData      = loadData() || toSave;
      calDownloads = getDownloads();

      // Brief success hint at the top of the page
      _showCalFileHint(sameStudent ? "merged" : "loaded");

      showCalendar();

    } catch (err) {
      console.error("[LCI Calendar] Failed to read JSON file:", err);
      const lang = getCurrentLang();
      alert(lang === "fr-CA"
        ? "Erreur de lecture du fichier JSON. Vérifie qu'il s'agit d'un fichier valide."
        : "Error reading the JSON file. Make sure it is a valid file.");
    }
  };
  r.readAsText(file);
}

// ── Date helpers ──────────────────────────────────────────────
function isoDate(d) { return d.toISOString().slice(0, 10); }

function addDays(d, n) {
  const r = new Date(d);
  r.setDate(r.getDate() + n);
  return r;
}

// Returns JS Date from YYYY-MM-DD string at noon (avoids DST issues)
function parseDate(s) { return new Date(s + "T12:00:00"); }

// Short weekday label for header (Mon, Tue…)
function shortDay(dow, lang) {
  const FR = ["Dim","Lun","Mar","Mer","Jeu","Ven","Sam"];
  const EN = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
  return (lang === "fr-CA" ? FR : EN)[dow];
}

// Abbreviated month label for cell bottom-right
function shortMonth(date, lang) {
  const FR = ["jan","fév","mar","avr","mai","jun","jul","aoû","sep","oct","nov","déc"];
  const EN = ["jan","feb","mar","apr","may","jun","jul","aug","sep","oct","nov","dec"];
  return (lang === "fr-CA" ? FR : EN)[date.getMonth()];
}

// Formatted date for display: "mer. 9 avr."
function formatShortDate(d, lang) {
  try {
    return d.toLocaleDateString(lang === "fr-CA" ? "fr-CA" : "en-CA",
      { weekday: "short", day: "numeric", month: "short" });
  } catch { return isoDate(d); }
}

// ── Core calendar render ──────────────────────────────────────
function renderAll() {
  renderGrid();
  renderHoursPanel();
  renderAbsencesList();
  renderLegend();
  populateDateInputs();
  renderMilestonesPanel();
}

// Populate the sidebar date inputs from calData, or leave blank if missing.
// Highlights the dates card if either date is absent.
function populateDateInputs() {
  const ctx = calData?.context || {};
  const si = document.getElementById("cal-start-date-input");
  const ei = document.getElementById("cal-end-date-input");
  if (si) si.value = ctx.start_date || "";
  if (ei) ei.value = ctx.scheduled_end_date || "";

  // Highlight the dates card if something is missing
  const datesCard = document.getElementById("cal-dates-card");
  if (datesCard) {
    const missing = !ctx.start_date || !ctx.scheduled_end_date;
    datesCard.classList.toggle("card--accent", missing);
  }
}

// Called when either date input changes — save and re-render.
function onCalDateChange() {
  const si = document.getElementById("cal-start-date-input");
  const ei = document.getElementById("cal-end-date-input");
  if (!calData) return;
  if (si) calData.context.start_date         = si.value || null;
  if (ei) calData.context.scheduled_end_date = ei.value || null;
  persistAndRefresh();
}

function renderGrid() {
  const ctx  = calData.context;
  const lang = getCurrentLang();
  const logs = calData.logs || [];

  // Guard: both dates required — show a hint if end date is missing
  if (!ctx.start_date || !ctx.scheduled_end_date) {
    const missingStart = !ctx.start_date;
    const targetId     = missingStart ? "cal-start-date-input" : "cal-end-date-input";
    const lang         = getCurrentLang();
    const isFr         = lang === "fr-CA";
    const label        = missingStart
      ? (isFr ? "date de début" : "start date")
      : (isFr ? "date de fin"   : "end date");
    document.getElementById("cal-grid").innerHTML =
      `<p style="color:var(--text-muted);padding:var(--sp-4);font-size:1.3rem">
        ${isFr
          ? `La <strong>${label}</strong> est nécessaire. Renseigne-la dans le panneau à droite.`
          : `The <strong>${label}</strong> is required. Fill it in the panel on the right.`}
      </p>`;
    // Highlight the relevant date input
    setTimeout(() => {
      const el = document.getElementById(targetId);
      if (!el) return;
      el.focus();
      el.style.outline = "2px solid var(--accent)";
      el.style.outlineOffset = "2px";
      setTimeout(() => { el.style.outline = ""; el.style.outlineOffset = ""; }, 2000);
    }, 100);
    return;
  }

  const startDate  = parseDate(ctx.start_date);
  const endDate    = parseDate(ctx.scheduled_end_date);
  const today      = getEffectiveToday(calData); // respects future-dated data
  const workDays   = ctx.work_days   || [1,2,3,4,5];
  const weekStart  = ctx.calendar_week_start ?? 1;
  const wrapDay    = ctx.week_end_day ?? 5;
  const absences   = (ctx.planned_absences || []).map(a => a.date);

  // Build set of dates with logs
  const logDates      = new Set(logs.map(l => l.date));
  const futureFiled   = new Set(logs.filter(l => l.future_filing).map(l => l.date));

  // Build the grid: find first day of the calendar display
  // (earliest weekStart day on or before startDate)
  let gridStart = new Date(startDate);
  while (gridStart.getDay() !== weekStart) {
    gridStart = addDays(gridStart, -1);
  }
  // Last day: latest weekStart-1 on or after endDate
  let gridEnd = new Date(endDate);
  const endTarget = weekStart === 0 ? 6 : weekStart - 1;
  while (gridEnd.getDay() !== endTarget) {
    gridEnd = addDays(gridEnd, 1);
  }

  // Day-of-week order for header (7 columns)
  const dowOrder = [];
  for (let i = 0; i < 7; i++) dowOrder.push((weekStart + i) % 7);

  // Build modality lookup: { "YYYY-MM-DD": "onsite"|"remote"|"hybrid" }
  const modalityMap = {};
  (ctx.planned_modalities || []).forEach(m => { modalityMap[m.date] = m.modality; });

  // Header
  const gridCols = `repeat(7, 1fr)`;
  const headerHTML = `
    <div class="cal-header-row" style="grid-template-columns:${gridCols}">
      ${dowOrder.map(d => `<div class="cal-header-cell">${shortDay(d, lang)}</div>`).join("")}
    </div>`;

  // Weeks
  let weeksHTML = "";
  let cur = new Date(gridStart);

  while (cur <= gridEnd) {
    let rowHTML = `<div class="cal-week-row" style="grid-template-columns:${gridCols}">`;

    for (let col = 0; col < 7; col++) {
      const ds       = isoDate(cur);
      const isIntern = ds >= ctx.start_date && ds <= ctx.scheduled_end_date;
      const dow      = cur.getDay();
      const isWork   = workDays.includes(dow);
      const isAbs    = absences.includes(ds);
      const isToday  = ds === today;
      const isPast   = ds < today;

      let cellClass = "cal-day";
      if (!isIntern)       cellClass += " cal-day--outside";
      else if (isAbs)      cellClass += " cal-day--absence";
      else if (!isWork)    cellClass += " cal-day--nonwork";
      else if (isPast)     cellClass += " cal-day--work cal-day--past-work";
      else                 cellClass += " cal-day--work";
      if (isToday)         cellClass += " cal-day--today";

      // Badges
      const dl = calDownloads[ds] || [];
      const hasLog    = logDates.has(ds);
      const hasDaily  = dl.includes("d");
      const hasWeekly = dl.includes("w");
      const hasFinal  = dl.includes("f");
      const hasConfig = dl.includes("c");
      // Hollow star: future wrap days (not yet downloaded)
      const isFutureWrapDay = ds > today && dow === wrapDay && isIntern && isWork;
      // Past wrap day missed (no weekly download, no log with weekly_wrap)
      const hasMissedWrap = ds <= today && dow === wrapDay && !hasWeekly && isIntern;

      const badges = [];
      if (hasConfig)          badges.push(`<span class="cal-badge" title="${t("cal.legend_config")}">⚙️</span>`);
      if (hasLog || hasDaily) badges.push(`<span class="cal-badge" title="${t("cal.legend_daily")}">✓</span>`);
      if (futureFiled.has(ds))badges.push(`<span class="cal-badge" title="${t("cal.legend_future_filed") || 'Future filing'}" style="color:var(--danger)">⚠</span>`);
      if (hasWeekly)          badges.push(`<span class="cal-badge" title="${t("cal.legend_weekly")}">⭐</span>`);
      if (isFutureWrapDay)    badges.push(`<span class="cal-badge" title="${t("cal.legend_weekly_due")}" style="opacity:.5">☆</span>`);
      if (hasFinal)           badges.push(`<span class="cal-badge" title="${t("cal.legend_final")}">🏅</span>`);

      // Milestone flags for this date (visible projects only)
      Object.values(calMilestones).forEach(({ project }) => {
        if (hiddenProjects.has(project.id)) return;
        const emoji = project.emoji || "🚩";
        project.milestones
          .filter(m => m.date === ds)
          .forEach(m => {
            badges.push(`<span class="cal-badge cal-milestone-flag"
              title="${escHtml(project.name + ': ' + m.title)}"
              style="cursor:pointer"
              onclick="event.stopPropagation();showMilestonePopup('${escHtml(project.id)}','${escHtml(m.id)}')">${emoji}</span>`);
          });
      });

      // Absence note
      const absObj = isAbs ? (ctx.planned_absences || []).find(a => a.date === ds) : null;
      const absNote = absObj?.reason
        ? `<div class="cal-absence-chip" title="${escHtml(absObj.reason)}">✗ ${escHtml(absObj.reason)}</div>`
        : isAbs ? `<div class="cal-absence-chip">✗</div>` : "";

      const plannedMod = !isAbs ? modalityMap[ds] : null;
      const modIndicator = (() => {
        if (isAbs) {
          return `<div class="cal-absence-x" title="${t('cal.legend_absence')}"></div>`;
        }
        if (!plannedMod) return "";
        const title = t("cal.legend_plan_" + plannedMod);
        if (plannedMod === "onsite") {
          // Green filled rectangle
          return `<svg class="cal-mod-indicator" viewBox="0 0 22 22" aria-label="${title}">
            <rect x="4" y="4" width="14" height="9" rx="2" fill="#3B6D11"/>
          </svg>`;
        }
        if (plannedMod === "remote") {
          // Blue triangle — right-angle at top-right corner
          return `<svg class="cal-mod-indicator" viewBox="0 0 22 22" aria-label="${title}">
            <polygon points="5,4 18,4 18,17" fill="#185FA5"/>
          </svg>`;
        }
        if (plannedMod === "hybrid") {
          // Amber/yellow rectangle
          return `<svg class="cal-mod-indicator" viewBox="0 0 22 22" aria-label="${title}">
            <rect x="4" y="4" width="14" height="9" rx="2" fill="#BA7517"/>
          </svg>`;
        }
        return "";
      })();
      const onclick = (isIntern && (isWork || isAbs))
        ? `onclick="openDayModal('${ds}', ${isAbs}, '${ds}')"` : "";

      rowHTML += `
        <div class="${cellClass}" ${onclick}>
          ${modIndicator}
          <div class="cal-day-num">${cur.getDate()}</div>
          ${badges.length ? `<div class="cal-badges">${badges.join("")}</div>` : ""}
          ${absNote}
          <span class="cal-month-label">${shortMonth(cur, lang)}</span>
        </div>`;

      cur = addDays(cur, 1);
    }

    rowHTML += "</div>";
    weeksHTML += rowHTML;
  }

  document.getElementById("cal-grid").innerHTML = headerHTML + weeksHTML;
}

// ── Hours math panel ──────────────────────────────────────────
function renderHoursPanel() {
  const ctx  = calData.context;
  const logs = calData.logs || [];
  const lang = getCurrentLang();

  // Guard: can't compute hours without an end date
  if (!ctx.scheduled_end_date) {
    document.getElementById("cal-hours-panel").innerHTML = "";
    return;
  }

  const target     = parseFloat(ctx.total_hours_target) || null;
  const workDays   = ctx.work_days   || [1,2,3,4,5];
  const absences   = (ctx.planned_absences || []).map(a => a.date);
  const today      = getEffectiveToday(calData); // respects future-dated data

  // Logged so far
  const loggedMins = logs.reduce((s, l) =>
    s + (l.task_total_minutes || l.day_duration_minutes || 0), 0);

  // Remaining planned minutes (from tomorrow to end), respecting per-day schedule
  const endDate = parseDate(ctx.scheduled_end_date);
  const dateOverrides = ctx.work_hours_date_overrides || {};
  let   cur     = parseDate(today);
  cur = addDays(cur, 1); // start from tomorrow
  let   plannedMins = 0;
  while (cur <= endDate) {
    const ds  = isoDate(cur);
    const dow = cur.getDay();
    if (workDays.includes(dow) && !absences.includes(ds)) {
      const override = dateOverrides[ds];
      plannedMins += override ? workHoursToMinutes(override) : getWorkMinutesForDay(ctx, dow);
    }
    cur = addDays(cur, 1);
  }
  const totalPlanned = loggedMins + plannedMins;

  // Margin vs target
  const marginMins = target !== null
    ? totalPlanned - (target * 60)
    : null;

  function fmtH(mins) {
    const h = Math.floor(Math.abs(mins) / 60);
    const m = Math.abs(mins) % 60;
    return `${h}h${String(m).padStart(2,"0")}`;
  }

  const loggedStr   = fmtH(loggedMins);
  const plannedStr  = fmtH(plannedMins);
  const targetStr   = target !== null ? `${target}h` : "—";
  const totalStr    = fmtH(totalPlanned);

  let marginHTML = "";
  if (marginMins !== null) {
    const ahead = marginMins >= 0;
    const cls   = ahead ? "hours-margin-ahead" : "hours-margin-behind";
    const lbl   = ahead ? t("cal.margin_ahead") : t("cal.margin_behind");
    const sign  = ahead ? "+" : "−";
    marginHTML = `
      <div class="hours-row">
        <span class="hours-row-label">${t("cal.margin")}</span>
        <span class="hours-row-val ${cls}">${sign}${fmtH(marginMins)} (${lbl})</span>
      </div>`;
  }

  const perDayStr = workHoursToString(ctx.work_hours);
  const hasVariableSchedule = ctx.work_hours_by_day && Object.keys(ctx.work_hours_by_day).length > 0;

  document.getElementById("cal-hours-panel").innerHTML = `
    <div class="hours-row">
      <span class="hours-row-label">${t("cal.hours_done")}</span>
      <span class="hours-row-val">${loggedStr}</span>
    </div>
    <div class="hours-row">
      <span class="hours-row-label">${t("cal.hours_planned")}</span>
      <span class="hours-row-val">${plannedStr}
        ${!hasVariableSchedule ? `<span style="font-size:1.1rem;color:var(--text-subtle);font-weight:400">(${perDayStr}/jr)</span>` : ""}
      </span>
    </div>
    <div class="hours-row">
      <span class="hours-row-label">${lang === "fr-CA" ? "Total projeté" : "Projected total"}</span>
      <span class="hours-row-val">${totalStr}</span>
    </div>
    <div class="hours-row">
      <span class="hours-row-label">${t("cal.hours_target")}</span>
      <span class="hours-row-val">${targetStr}</span>
    </div>
    ${marginHTML}`;
}

// ── Absences list ─────────────────────────────────────────────
function renderAbsencesList() {
  const ctx  = calData.context;
  const lang = getCurrentLang();
  const abs  = (ctx.planned_absences || []).slice().sort((a,b) => a.date.localeCompare(b.date));
  const el   = document.getElementById("cal-absences-list");

  if (!abs.length) {
    el.innerHTML = `<p class="text-muted" style="font-size:1.3rem">—</p>`;
    return;
  }

  el.innerHTML = abs.map(a => {
    const d = parseDate(a.date);
    return `
      <div class="absence-item">
        <div class="absence-date">${formatShortDate(d, lang)}</div>
        <div class="absence-reason">${a.reason ? escHtml(a.reason) : "—"}</div>
        <button class="btn btn--icon btn--sm" onclick="removeAbsenceByDate('${a.date}')"
          title="${lang === "fr-CA" ? "Retirer" : "Remove"}">✕</button>
      </div>`;
  }).join("");
}

// ── Legend ────────────────────────────────────────────────────
function renderLegend() {
  const el = document.getElementById("cal-legend");
  const items = [
    { swatch: "background:var(--bg-card);border:1px solid var(--border)",
      key: "cal.legend_work" },
    { swatch: "background:var(--bg-subtle)",
      key: "cal.legend_nonwork" },
    { swatch: "background:repeating-linear-gradient(135deg,var(--bg-subtle),var(--bg-subtle) 4px,var(--bg-card) 4px,var(--bg-card) 10px)",
      key: "cal.legend_absence" },
    { swatch: "background:var(--bg-card);outline:2.5px solid var(--accent);outline-offset:-2px;border-radius:3px",
      key: "cal.legend_today" },
    { badge: "⚙️", key: "cal.legend_config" },
    { badge: "✓",  key: "cal.legend_daily" },
    { badge: `<span style="color:var(--danger)">⚠</span>`, key: "cal.legend_future_filed" },
    { badge: "⭐", key: "cal.legend_weekly" },
    { badge: "☆",  key: "cal.legend_weekly_due" },
    { badge: "🏅", key: "cal.legend_final" },
    { svg: `<svg width="18" height="12" viewBox="0 0 18 12" aria-hidden="true"><rect x="0" y="0" width="14" height="9" rx="2" fill="#3B6D11"/></svg>`, key: "cal.legend_plan_onsite" },
    { svg: `<svg width="18" height="14" viewBox="0 0 18 14" aria-hidden="true"><polygon points="0,0 14,0 14,14" fill="#185FA5"/></svg>`, key: "cal.legend_plan_remote" },
    { svg: `<svg width="18" height="12" viewBox="0 0 18 12" aria-hidden="true"><rect x="0" y="0" width="14" height="9" rx="2" fill="#BA7517"/></svg>`, key: "cal.legend_plan_hybrid" },
    { svg: `<svg width="18" height="14" viewBox="0 0 18 14" aria-hidden="true"><line x1="1" y1="1" x2="13" y2="13" stroke="#A32D2D" stroke-width="2.5" stroke-linecap="round"/><line x1="13" y1="1" x2="1" y2="13" stroke="#A32D2D" stroke-width="2.5" stroke-linecap="round"/></svg>`, key: "cal.legend_absent_mark" },
  ];

  el.innerHTML = items.map(item => {
    const left = item.badge
      ? `<span style="font-size:1.4rem;width:2rem;text-align:center">${item.badge}</span>`
      : item.svg
      ? `<span style="width:2rem;display:inline-flex;align-items:center">${item.svg}</span>`
      : `<div class="cal-legend-swatch" style="${item.swatch}"></div>`;
    return `
      <div class="cal-legend-item">
        ${left}
        <span>${t(item.key)}</span>
      </div>`;
  }).join("");
}

// ── Day plan modal ────────────────────────────────────────────
// Unified modal for planning a work day: modality (onsite/remote/hybrid)
// and absence marking with optional reason.
function openDayModal(date, isCurrentlyAbsent) {
  pendingAbsenceDate = date;
  const lang = getCurrentLang();
  const d    = parseDate(date);
  const ctx  = calData.context;
  const dow  = d.getDay();

  document.getElementById("absence-modal-title").textContent =
    formatShortDate(d, lang);

  // Restore existing state
  const absObj = (ctx.planned_absences  || []).find(a => a.date === date);
  const modObj = (ctx.planned_modalities|| []).find(m => m.date === date);

  document.getElementById("absence-reason-input").value =
    absObj?.reason || "";

  // Per-day hours override: show current scheduled minutes for this DOW
  const byDay   = ctx.work_hours_by_day || {};
  const dateOverride = ctx.work_hours_date_overrides?.[date];
  const wh = dateOverride ?? byDay[dow] ?? ctx.work_hours ?? { h: 7, m: 30 };
  const hoursEl = document.getElementById("day-modal-hours-h");
  const minsEl  = document.getElementById("day-modal-hours-m");
  if (hoursEl) hoursEl.value = wh.h ?? 7;
  if (minsEl)  minsEl.value  = wh.m ?? 30;

  // Show/hide the two panels
  const modPanel = document.getElementById("day-modal-modality");
  const absPanel = document.getElementById("day-modal-absence");
  if (isCurrentlyAbsent) {
    modPanel.style.display = "none";
    absPanel.style.display = "";
  } else {
    modPanel.style.display = "";
    absPanel.style.display = "none";
  }

  // Set active modality button
  ["onsite","remote","hybrid"].forEach(m => {
    const btn = document.getElementById("mod-btn-" + m);
    if (btn) btn.classList.toggle("selected", modObj?.modality === m);
  });

  document.getElementById("absence-remove-btn").style.display =
    isCurrentlyAbsent ? "" : "none";
  document.getElementById("day-modal-mark-absent-btn").style.display =
    isCurrentlyAbsent ? "none" : "";

  document.getElementById("absence-modal").classList.remove("hidden");
}

// Legacy alias (called from some paths)
function openAbsenceModal(date, isCurrentlyAbsent) {
  openDayModal(date, isCurrentlyAbsent);
}

function selectModality(mod) {
  ["onsite","remote","hybrid"].forEach(m => {
    const btn = document.getElementById("mod-btn-" + m);
    if (btn) btn.classList.toggle("selected", m === mod);
  });
}

function markAbsentFromModal() {
  // Switch modal to absence mode
  document.getElementById("day-modal-modality").style.display = "none";
  document.getElementById("day-modal-absence").style.display  = "";
  document.getElementById("day-modal-mark-absent-btn").style.display = "none";
  document.getElementById("absence-remove-btn").style.display = "";
  setTimeout(() => document.getElementById("absence-reason-input").focus(), 80);
}

function closeAbsenceModal(e) {
  if (e && e.target !== document.getElementById("absence-modal")) return;
  document.getElementById("absence-modal").classList.add("hidden");
  pendingAbsenceDate = null;
}

function confirmAbsence() {
  if (!pendingAbsenceDate) return;
  const ctx  = calData.context;
  const date = pendingAbsenceDate;

  // Determine which panel is active
  const absPanel = document.getElementById("day-modal-absence");
  const isAbsMode = absPanel.style.display !== "none";

  // Clear both planned entries for this date
  ctx.planned_absences   = (ctx.planned_absences   || []).filter(a => a.date !== date);
  ctx.planned_modalities = (ctx.planned_modalities || []).filter(m => m.date !== date);

  if (isAbsMode) {
    // Save absence
    const reason = document.getElementById("absence-reason-input").value.trim();
    ctx.planned_absences.push({ date, reason });
    ctx.planned_absences.sort((a,b) => a.date.localeCompare(b.date));
  } else {
    // Save hours override for this specific date
    const hoursEl = document.getElementById("day-modal-hours-h");
    const minsEl  = document.getElementById("day-modal-hours-m");
    if (hoursEl && minsEl) {
      const h = parseInt(hoursEl.value) || 0;
      const m = parseInt(minsEl.value)  || 0;
      if (!ctx.work_hours_date_overrides) ctx.work_hours_date_overrides = {};
      // If values match the effective DOW default, remove the override (keep it clean)
      const dow = parseDate(date).getDay();
      const def = (ctx.work_hours_by_day || {})[dow] ?? ctx.work_hours ?? { h: 7, m: 30 };
      if (h === (def.h ?? 7) && m === (def.m ?? 30)) {
        delete ctx.work_hours_date_overrides[date];
      } else {
        ctx.work_hours_date_overrides[date] = { h, m };
      }
    }

    // Save modality
    const selected = ["onsite","remote","hybrid"].find(m => {
      const btn = document.getElementById("mod-btn-" + m);
      return btn?.classList.contains("selected");
    });
    if (selected) {
      ctx.planned_modalities.push({ date, modality: selected });
      ctx.planned_modalities.sort((a,b) => a.date.localeCompare(b.date));
    }
  }

  persistAndRefresh();
  document.getElementById("absence-modal").classList.add("hidden");
  pendingAbsenceDate = null;
}

function removeAbsence() {
  if (!pendingAbsenceDate) return;
  removeAbsenceByDate(pendingAbsenceDate);
  document.getElementById("absence-modal").classList.add("hidden");
  pendingAbsenceDate = null;
}

function removeAbsenceByDate(date) {
  calData.context.planned_modalities =
    (calData.context.planned_modalities || []).filter(m => m.date !== date);
  const ctx = calData.context;
  ctx.planned_absences = (ctx.planned_absences || []).filter(a => a.date !== date);
  persistAndRefresh();
}

// ── Milestones ────────────────────────────────────────────────

// ── Milestone editor ──────────────────────────────────────────
let _editingProjectId = null; // null = new project

function openMilestoneEditor(projectId) {
  _editingProjectId = projectId || null;
  const editor = document.getElementById("cal-milestone-editor");
  const panel  = document.getElementById("cal-milestones-panel");
  const btn    = document.getElementById("cal-milestone-define-btn");
  if (!editor || !panel) return;

  // Pre-fill if editing existing project
  const existing = projectId ? calMilestones[projectId] : null;
  const proj = existing?.project;
  document.getElementById("ms-project-name").value  = proj?.name  || "";
  document.getElementById("ms-project-emoji").value = proj?.emoji || "";

  // Render milestone rows
  const rows = document.getElementById("ms-rows");
  rows.innerHTML = "";
  const milestones = proj?.milestones?.length ? proj.milestones : [{ id: generateUUID(), date: "", title: "" }];
  milestones.forEach(m => _appendMilestoneRow(m.date, m.title, m.id));

  editor.style.display = "";
  panel.style.display  = "none";
  if (btn) btn.style.display = "none";
}

function closeMilestoneEditor() {
  const editor = document.getElementById("cal-milestone-editor");
  const panel  = document.getElementById("cal-milestones-panel");
  const btn    = document.getElementById("cal-milestone-define-btn");
  if (editor) editor.style.display = "none";
  if (panel)  panel.style.display  = "";
  if (btn)    btn.style.display    = "";
  _editingProjectId = null;
}

function addMilestoneRow() {
  _appendMilestoneRow("", "", generateUUID());
}

function _appendMilestoneRow(date, title, id) {
  const rows = document.getElementById("ms-rows");
  const lang = getCurrentLang();
  const isFr = lang === "fr-CA";
  const div = document.createElement("div");
  div.className = "repeatable-block";
  div.dataset.msId = id;
  div.style.padding = "var(--sp-3)";
  div.innerHTML = `
    <button class="repeatable-block-remove btn btn--icon btn--sm"
      onclick="this.closest('.repeatable-block').remove()"
      title="${isFr ? 'Supprimer' : 'Remove'}">✕</button>
    <div style="display:flex;gap:var(--sp-2);flex-wrap:wrap;align-items:flex-end">
      <div class="form-group" style="margin:0;flex:0 0 auto">
        <label style="font-size:1.2rem;color:var(--text-muted)">${isFr ? "Date" : "Date"}</label>
        <input type="date" class="ms-date" value="${date}" style="margin-top:var(--sp-1)">
      </div>
      <div class="form-group" style="margin:0;flex:1;min-width:10rem">
        <label style="font-size:1.2rem;color:var(--text-muted)">${isFr ? "Titre" : "Title"}</label>
        <input type="text" class="ms-title" value="${title}" style="margin-top:var(--sp-1);width:100%">
      </div>
    </div>`;
  rows.appendChild(div);
}

function saveMilestoneEditor() {
  const lang = getCurrentLang();
  const isFr = lang === "fr-CA";

  const name  = document.getElementById("ms-project-name").value.trim();
  const emoji = document.getElementById("ms-project-emoji").value.trim() || "🚩";

  if (!name) {
    document.getElementById("ms-project-name").focus();
    return;
  }

  // Collect milestone rows — skip empty ones
  const milestones = [];
  document.querySelectorAll("#ms-rows .repeatable-block").forEach(row => {
    const date  = row.querySelector(".ms-date")?.value  || "";
    const title = row.querySelector(".ms-title")?.value.trim() || "";
    if (date || title) {
      milestones.push({ id: row.dataset.msId || generateUUID(), date, title });
    }
  });

  if (!milestones.length) {
    alert(isFr ? "Ajoute au moins un jalon." : "Add at least one milestone.");
    return;
  }

  const projectId = _editingProjectId || ("proj-" + generateUUID().slice(0, 8));
  const now = new Date().toISOString();
  const studentEmail = loadData()?.profile?.email || "";

  calMilestones[projectId] = {
    exported_at: now,
    exported_by: studentEmail,
    file_title:  "",
    project: { id: projectId, name, emoji, milestones },
  };
  saveMilestones(calMilestones);
  closeMilestoneEditor();
  renderGrid();
  renderMilestonesPanel();
}

// Render the milestones sidebar card: project checkboxes + export button.
function renderMilestonesPanel() {
  const container = document.getElementById("cal-milestones-panel");
  if (!container) return;
  const lang = getCurrentLang();
  const isFr = lang === "fr-CA";
  const entries = Object.values(calMilestones);

  if (!entries.length) {
    container.innerHTML = `<p style="font-size:1.3rem;color:var(--text-muted)">—</p>`;
    return;
  }

  const rows = entries.map(({ exported_by, file_title, project }) => {
    const pid     = project.id;
    const checked = !hiddenProjects.has(pid) ? "checked" : "";
    const emoji   = project.emoji || "🚩";
    const count   = project.milestones?.length || 0;
    const byLine  = exported_by
      ? `<div style="font-size:1.1rem;color:var(--text-muted);margin-left:2.2rem">${escHtml(exported_by)}</div>`
      : "";
    return `
      <div style="display:flex;align-items:center;gap:var(--sp-2);margin-bottom:var(--sp-1)">
        <label style="display:flex;align-items:center;gap:var(--sp-2);cursor:pointer;font-size:1.3rem;flex:1;min-width:0">
          <input type="checkbox" ${checked} onchange="toggleMilestoneProject('${pid}',this.checked)">
          <span style="font-size:1.5rem;line-height:1">${emoji}</span>
          <span style="flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${escHtml(project.name)}</span>
          <span style="color:var(--text-muted);font-size:1.2rem;flex-shrink:0">${count}</span>
        </label>
        <button class="btn btn--ghost btn--sm" style="flex-shrink:0;padding:2px 6px"
          onclick="openMilestoneEditor('${pid}')" title="${isFr ? 'Modifier' : 'Edit'}">✎</button>
      </div>
      ${byLine}`;
  }).join("");

  container.innerHTML = rows + `
    <div style="display:flex;gap:var(--sp-2);flex-wrap:wrap;margin-top:var(--sp-3)">
      <button class="btn btn--ghost btn--sm" onclick="exportMilestones()"
        data-i18n="cal.milestones_export">${isFr ? "Exporter" : "Export"}</button>
      <button class="btn btn--ghost btn--sm" style="color:var(--danger)" onclick="clearMilestones()"
        data-i18n="cal.milestones_clear">${isFr ? "Effacer tout" : "Clear all"}</button>
    </div>`;
}

function toggleMilestoneProject(pid, visible) {
  if (visible) hiddenProjects.delete(pid);
  else         hiddenProjects.add(pid);
  renderGrid(); // only re-render grid, not panel (avoids checkbox flicker)
}

// Show a popup with milestone details — dismisses on outside click.
function showMilestonePopup(projectId, milestoneId) {
  document.getElementById("cal-milestone-popup")?.remove();
  const entry = calMilestones[projectId];
  if (!entry) return;
  const m = entry.project.milestones?.find(x => x.id === milestoneId);
  if (!m) return;
  const emoji = entry.project.emoji || "🚩";

  const popup = document.createElement("div");
  popup.id = "cal-milestone-popup";
  popup.style.cssText = `position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);
    z-index:8000;background:var(--bg-card);border:1px solid var(--border);
    border-radius:var(--r-lg);padding:var(--sp-4);max-width:36rem;width:90%;
    box-shadow:0 8px 32px rgba(0,0,0,.25)`;
  popup.innerHTML = `
    <div style="display:flex;align-items:flex-start;gap:var(--sp-3)">
      <span style="font-size:2.2rem;flex-shrink:0;line-height:1">${emoji}</span>
      <div style="flex:1;min-width:0">
        <div style="font-weight:600;font-size:1.5rem;margin-bottom:var(--sp-1)">${escHtml(m.title)}</div>
        <div style="font-size:1.3rem;color:var(--text-muted);margin-bottom:var(--sp-1)">${escHtml(entry.project.name)}</div>
        <div style="font-size:1.2rem;color:var(--text-muted)">${m.date}</div>
        ${m.description ? `<div style="font-size:1.3rem;margin-top:var(--sp-2)">${escHtml(m.description)}</div>` : ""}
        ${entry.exported_by ? `<div style="font-size:1.1rem;color:var(--text-muted);margin-top:var(--sp-2)">@ ${escHtml(entry.exported_by)}</div>` : ""}
      </div>
      <button onclick="document.getElementById('cal-milestone-popup')?.remove()"
        style="background:none;border:none;cursor:pointer;font-size:1.8rem;color:var(--text-muted);padding:0;line-height:1;flex-shrink:0">×</button>
    </div>`;

  document.body.appendChild(popup);
  setTimeout(() => {
    document.addEventListener("click", function dismiss(e) {
      if (!popup.contains(e.target)) {
        popup.remove();
        document.removeEventListener("click", dismiss);
      }
    });
  }, 0);
}

// Export all loaded milestone projects as a single JSON file.
function exportMilestones() {
  const lang = getCurrentLang();
  const isFr = lang === "fr-CA";
  const payload = {
    meta: {
      type: "milestones",
      exported_at: new Date().toISOString(),
    },
    projects: Object.values(calMilestones).map(e => e.project),
  };
  downloadJSON(payload, `${isFr ? "jalons" : "milestones"}_${new Date().toISOString().slice(0,10)}.json`);
}

// Remove all milestone projects from localStorage and re-render.
function clearMilestones() {
  const lang = getCurrentLang();
  if (!confirm(lang === "fr-CA" ? "Supprimer tous les jalons ?" : "Delete all milestones?")) return;
  calMilestones = {};
  hiddenProjects.clear();
  saveMilestones({});
  renderGrid();
  renderMilestonesPanel();
}

// ── Persist & refresh ─────────────────────────────────────────
function persistAndRefresh() {
  // Only save back to localStorage if the data came from there
  const existing = loadData();
  const canPersist = existing && existing.meta?.student_uuid === calData.meta?.student_uuid;

  if (canPersist) {
    saveData(calData);
    // Remove any stale file-upload warning
    document.getElementById("cal-no-persist-warn")?.remove();
  } else {
    // Data came from a file upload — changes exist in memory but won't survive reload.
    // Show a persistent warning if not already shown.
    if (!document.getElementById("cal-no-persist-warn")) {
      const lang = getCurrentLang();
      const warn = document.createElement("div");
      warn.id = "cal-no-persist-warn";
      warn.className = "alert alert--warning";
      warn.style.cssText = "margin-bottom:var(--sp-4)";
      warn.innerHTML = lang === "fr-CA"
        ? "⚠ Les absences que tu ajoutes ici ne seront <strong>pas sauvegardées</strong> — les données viennent d'un fichier importé. Pour les conserver, exporte et réimporte ton fichier de configuration depuis la page de configuration."
        : "⚠ Absences you add here will <strong>not be saved</strong> — data was loaded from an uploaded file. To keep them, export and re-import your config file from the setup page.";
      document.querySelector(".cal-layout")?.before(warn);
    }
  }

  calDownloads = getDownloads();
  renderAll();
  // Prompt re-export config since absences changed (isUpdate=true)
  setTimeout(() => showUploadReminder("c", true), 400);
}

// ── Sidebar hook ─────────────────────────────────────────────
function onSidebarLoad() {
  calData       = loadData();
  calDownloads  = getDownloads();
  calMilestones = loadMilestones();
  if (calData?.context?.start_date) {
    showCalendar();
  } else {
    renderMilestonesPanel(); // still render milestone panel even without student data
  }
}
