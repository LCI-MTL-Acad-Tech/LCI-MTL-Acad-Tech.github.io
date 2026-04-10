// ── Weekly report ─────────────────────────────────────────────
// Accepts any number of JSON files. All completed weeks render
// as collapsible accordion sections, most recent open by default.

let weeklyData = null;

document.addEventListener("DOMContentLoaded", () => {
  initPage();
  setupWeeklyDropZone();

  // Restore from main data (single-file students)
  const existing = loadData();
  if (existing?.profile?.full_name) {
    weeklyData = existing;
  }

  // Override with persisted merged session if fresher (multi-file students)
  const saved = loadReportData();
  if (saved?.profile?.full_name &&
      saved.logs?.length >= (weeklyData?.logs?.length ?? 0)) {
    weeklyData = saved;
  }

  if (weeklyData?.profile?.full_name) {
    renderAllWeeks();
    showReport();
  }

  applyLanguage(getCurrentLang());
});

// ── Drop zone ─────────────────────────────────────────────────
function setupWeeklyDropZone() {
  // Document-level: prevent browser navigating away on mis-aimed drops
  document.addEventListener("dragover", e => e.preventDefault());
  document.addEventListener("drop",     e => e.preventDefault());

  const zone = document.getElementById("upload-zone");
  if (!zone) return;
  zone.addEventListener("dragover", e => {
    e.preventDefault(); e.stopPropagation();
    zone.classList.add("drag-over");
  });
  zone.addEventListener("dragleave", () => zone.classList.remove("drag-over"));
  zone.addEventListener("drop", e => {
    e.preventDefault(); e.stopPropagation();
    zone.classList.remove("drag-over");
    handleWeeklyFiles(e.dataTransfer.files);
  });
}

function handleWeeklyFiles(fileList) {
  const files = Array.from(fileList).filter(f => f.name.endsWith(".json"));
  if (!files.length) return;

  Promise.all(files.map(f => new Promise(res => {
    const r = new FileReader();
    r.onload = e => { try { res(JSON.parse(e.target.result)); } catch { res(null); } };
    r.readAsText(f);
  }))).then(parsed => {
    const valid = parsed.filter(Boolean);
    if (!valid.length) {
      showUploadError(t("error.no_files")); return;
    }
    const result = mergeInternshipFiles(valid);
    if (!result.valid) {
      showUploadError(t("error.no_files")); return;
    }
    weeklyData = result.data;
    saveReportData(weeklyData); // persist so tab navigation doesn't lose the merge
    renderAllWeeks();
    showReport();
  });
}

function showUploadError(msg) {
  const el = document.getElementById("upload-status");
  if (el) el.innerHTML = `<div class="alert alert--error mt-4">${msg}</div>`;
}

function showReport() {
  document.getElementById("phase-upload").classList.add("hidden");
  document.getElementById("phase-report").classList.remove("hidden");
}

function resetWeekly() {
  weeklyData = null;
  clearReportData(); // clear persisted session
  document.getElementById("weekly-accordion").innerHTML = "";
  document.getElementById("phase-upload").classList.remove("hidden");
  document.getElementById("phase-report").classList.add("hidden");
  document.getElementById("upload-status").innerHTML = "";
}

// Downloads the current merged weekly data as a JSON file.
// This file can be re-uploaded to weekly.html later, or submitted to the hub.
function downloadWeeklyJSON() {
  if (!weeklyData) return;
  const p    = weeklyData.profile;
  const slug = (p?.full_name || "etudiant").toLowerCase()
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, "_").replace(/[^a-z0-9_]/g, "");
  const date  = new Date().toISOString().slice(0, 10);
  const fname = `${p?.student_id || slug}_weekly_${date}.json`;

  // Stamp type so hub.js detectFileType() classifies this correctly
  const payload = JSON.parse(JSON.stringify(weeklyData));
  payload.meta.type          = "weekly";
  payload.meta.last_modified = new Date().toISOString();

  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement("a");
  a.href     = url;
  a.download = fname;
  a.click();
  URL.revokeObjectURL(url);
  stampDownload("w"); // record weekly download for calendar view
  // Show upload reminder (respects snooze)
  setTimeout(() => showUploadReminder("w"), 400);
}

// ── Week helpers ──────────────────────────────────────────────
function getWeekKey(dateStr) {
  const d = new Date(dateStr + "T12:00:00");
  const day = d.getDay() || 7;
  d.setDate(d.getDate() - day + 1);
  return d.toISOString().slice(0, 10);
}

function getWeekEnd(weekStart) {
  // Return the configured week_end_day date for this week
  const weekEndDow = parseInt(weeklyData?.context?.week_end_day ?? 5);
  const d = new Date(weekStart + "T12:00:00"); // Monday
  const offset = weekEndDow === 0 ? 6 : weekEndDow - 1;
  d.setDate(d.getDate() + offset);
  return d.toISOString().slice(0, 10);
}

function isWeekComplete(weekStart) {
  const today = new Date().toISOString().slice(0, 10);
  const weekEnd = getWeekEnd(weekStart);
  return weekEnd < today;
}

// ── Render all weeks ──────────────────────────────────────────
function renderAllWeeks() {
  if (!weeklyData?.logs?.length) return;

  // Student label
  const p = weeklyData.profile;
  const label = document.getElementById("student-label");
  if (label) label.textContent =
    [p?.full_name, p?.program, p?.cohort].filter(Boolean).join(" · ");

  // Group logs by week
  const weekMap = {};
  weeklyData.logs.forEach(l => {
    const wk = getWeekKey(l.date);
    (weekMap[wk] = weekMap[wk] || []).push(l);
  });

  // Sort weeks newest first
  const weeks = Object.keys(weekMap).sort().reverse();

  // Separate completed from current/future
  const completed = weeks.filter(w => isWeekComplete(w));
  const current   = weeks.filter(w => !isWeekComplete(w));

  const accordion = document.getElementById("weekly-accordion");
  accordion.innerHTML = "";

  // Current/in-progress week — collapsible, open by default, marked as current
  if (current.length) {
    current.forEach(w => {
      accordion.appendChild(buildWeekSection(w, weekMap[w], true, true, true));
    });
  }

  // Completed weeks (collapsible)
  if (completed.length) {
    if (current.length) {
      const divider = document.createElement("div");
      divider.style.cssText =
        "font-size:1.2rem;font-weight:700;text-transform:uppercase;" +
        "letter-spacing:0.08em;color:var(--text-subtle);margin:var(--sp-6) 0 var(--sp-3)";
      divider.textContent = t("weekly.completed_weeks") || "Semaines complétées";
      accordion.appendChild(divider);
    }
    completed.forEach((w, i) => {
      // Most recent completed week open by default
      accordion.appendChild(buildWeekSection(w, weekMap[w], i === 0, true, false));
    });
  }

  if (!weeks.length) {
    accordion.innerHTML =
      `<p class="text-muted">${t("weekly.no_logs")}</p>`;
  }
}

// ── Build one week section ────────────────────────────────────
function buildWeekSection(weekStart, logs, defaultOpen, collapsible, isCurrent = false) {
  logs = [...logs].sort((a, b) => a.date.localeCompare(b.date));

  const weekEnd   = getWeekEnd(weekStart);
  const totalMins = logs.reduce((s, l) =>
    s + (l.task_total_minutes || l.day_duration_minutes || 0), 0);
  const avgRating = logs.filter(l => l.day_rating).length
    ? (logs.reduce((s, l) => s + (l.day_rating || 0), 0) /
       logs.filter(l => l.day_rating).length).toFixed(1)
    : "—";
  const hasWrap = logs.some(l =>
    l.weekly_wrap?.highlight || l.weekly_wrap?.learning || l.weekly_wrap?.change);

  const section = document.createElement("div");
  section.className = "weekly-section";
  section.style.cssText =
    "background:var(--bg-card);border-radius:var(--r-xl);" +
    "box-shadow:var(--shadow-sm);margin-bottom:var(--sp-4);overflow:hidden;" +
    (isCurrent ? "border-left:3px solid var(--accent)" : "");

  // Header — always collapsible now; cursor only when collapsible
  const header = document.createElement("div");
  header.style.cssText =
    "display:flex;align-items:center;gap:var(--sp-4);padding:var(--sp-4) var(--sp-5);" +
    "cursor:pointer;user-select:none;";
  header.setAttribute("role", "button");
  header.setAttribute("aria-expanded", defaultOpen ? "true" : "false");

  const weekLabel = `${t("weekly.week_label")} ${formatDate(weekStart + "T12:00:00")}`;
  const daysLabel = `${logs.length} ${logs.length > 1 ? (t("weekly.days") || "jours") : (t("weekly.day") || "jour")}`;
  const wrapBadge = hasWrap
    ? `<span style="font-size:1.1rem;background:var(--success);color:white;
                   border-radius:var(--r-pill);padding:0.1rem 0.6rem">✓ bilan</span>`
    : "";
  const currentBadge = isCurrent
    ? `<span style="font-size:1.1rem;background:var(--accent);color:white;
                   border-radius:var(--r-pill);padding:0.1rem 0.6rem"
        data-i18n="weekly.current_week">${t("weekly.current_week") || "en cours"}</span>`
    : "";

  header.innerHTML = `
    <div style="flex:1;min-width:0">
      <div style="font-size:1.6rem;font-weight:600">${weekLabel}</div>
      <div style="font-size:1.3rem;color:var(--text-subtle);margin-top:2px;
                  display:flex;flex-wrap:wrap;align-items:center;gap:var(--sp-2)">
        ${daysLabel} · ${formatDuration(totalMins)} · ${avgRating}/5
        ${wrapBadge}${currentBadge}
      </div>
    </div>
    <button class="btn btn--ghost btn--sm no-print"
      onclick="event.stopPropagation();openWeekPrint('${weekStart}')"
      title="${t('weekly.open_print') || 'Ouvrir pour impression'}"
      style="flex-shrink:0;font-size:1.3rem">🖨</button>
    <span class="weekly-chevron" style="font-size:1.6rem;color:var(--text-subtle);
      transition:transform var(--dur-mod);transform:rotate(${defaultOpen ? "90deg" : "0deg"})"
      aria-hidden="true">›</span>`;

  // Body
  const body = document.createElement("div");
  body.style.cssText =
    "padding:0 var(--sp-5) var(--sp-5);" +
    (!defaultOpen ? "display:none" : "");

  body.appendChild(buildWeekBody(logs, weekStart));

  header.addEventListener("click", () => {
    const open = body.style.display !== "none";
    body.style.display = open ? "none" : "";
    header.setAttribute("aria-expanded", open ? "false" : "true");
    const chevron = header.querySelector(".weekly-chevron");
    if (chevron) chevron.style.transform = open ? "rotate(0deg)" : "rotate(90deg)";
  });

  section.appendChild(header);
  section.appendChild(body);
  return section;
}

// ── Build week body (stats + charts + narrative) ──────────────
function buildWeekBody(logs, weekStart) {
  const frag = document.createDocumentFragment();

  // Stat row
  const totalMins = logs.reduce((s, l) =>
    s + (l.task_total_minutes || l.day_duration_minutes || 0), 0);
  const ratings = logs.filter(l => l.day_rating);
  const avgRating = ratings.length
    ? (ratings.reduce((s, l) => s + l.day_rating, 0) / ratings.length).toFixed(1) : "—";

  const statRow = document.createElement("div");
  statRow.style.cssText =
    "display:flex;gap:var(--sp-4);margin-bottom:var(--sp-5);" +
    "background:var(--bg-subtle);border-radius:var(--r-lg);padding:var(--sp-4)";
  statRow.innerHTML = [
    { val: formatDuration(totalMins), label: t("weekly.hours") },
    { val: logs.length,              label: t("weekly.days")  },
    { val: avgRating + " / 5",       label: t("weekly.avg_rating") },
  ].map(s => `
    <div style="flex:1;text-align:center">
      <div style="font-size:2.4rem;font-weight:700;color:var(--accent);
                  letter-spacing:-0.04em;line-height:1">${escHtml(String(s.val))}</div>
      <div style="font-size:1.2rem;color:var(--text-subtle);margin-top:var(--sp-1)">${escHtml(s.label)}</div>
    </div>`).join("");
  frag.appendChild(statRow);

  // Two-column: day bars + activity pie
  const topGrid = document.createElement("div");
  topGrid.style.cssText =
    "display:grid;grid-template-columns:1fr 1fr;gap:var(--sp-4);margin-bottom:var(--sp-4)";

  // Day bars
  const daysCard = document.createElement("div");
  daysCard.style.cssText = "background:var(--bg-subtle);border-radius:var(--r-lg);padding:var(--sp-4)";
  const dayTitle = document.createElement("div");
  dayTitle.className = "section-title";
  dayTitle.setAttribute("data-i18n", "weekly.section_days");
  dayTitle.textContent = t("weekly.section_days") || "Jours";
  daysCard.appendChild(dayTitle);

  const daysContainer = document.createElement("div");
  daysContainer.style.cssText = "display:flex;gap:var(--sp-2);align-items:flex-end;margin-top:var(--sp-3)";
  renderDayBarsInto(logs, daysContainer);
  daysCard.appendChild(daysContainer);
  topGrid.appendChild(daysCard);

  // Activity pie
  const actCard = document.createElement("div");
  actCard.style.cssText = "background:var(--bg-subtle);border-radius:var(--r-lg);padding:var(--sp-4)";
  const actTitle = document.createElement("div");
  actTitle.className = "section-title";
  actTitle.setAttribute("data-i18n", "weekly.section_activity");
  actTitle.textContent = t("weekly.section_activity") || "Activités";
  actCard.appendChild(actTitle);
  const actPie = document.createElement("div");
  buildActivityPie(logs, actPie);
  actCard.appendChild(actPie);
  topGrid.appendChild(actCard);

  frag.appendChild(topGrid);

  // Mood
  const moodCard = buildNarrativeCard("weekly.section_mood", buildMoodHTML(logs));
  if (moodCard) frag.appendChild(moodCard);

  // Wins
  const winsHTML = buildWinsHTML(logs);
  if (winsHTML) frag.appendChild(buildNarrativeCard("weekly.section_wins", winsHTML));

  // Obstacle
  const obsHTML = buildObstacleHTML(logs);
  if (obsHTML) frag.appendChild(buildNarrativeCard("weekly.section_obstacle", obsHTML));

  // Weekly wrap
  const wrapHTML = buildWrapHTML(logs);
  frag.appendChild(buildNarrativeCard("weekly.section_wrap", wrapHTML));

  // Project status (hub)
  const projHTML = buildProjectsHTML(logs);
  if (projHTML) frag.appendChild(buildNarrativeCard("weekly.section_projects", projHTML));

  return frag;
}

function buildNarrativeCard(titleKey, innerHTML) {
  const card = document.createElement("div");
  card.style.cssText =
    "background:var(--bg-subtle);border-radius:var(--r-lg);" +
    "padding:var(--sp-4);margin-bottom:var(--sp-4)";
  const title = document.createElement("div");
  title.className = "section-title";
  title.setAttribute("data-i18n", titleKey);
  title.textContent = t(titleKey) || titleKey;
  card.appendChild(title);
  const body = document.createElement("div");
  body.style.marginTop = "var(--sp-3)";
  body.innerHTML = innerHTML;
  card.appendChild(body);
  return card;
}

// ── Day bar rendering ─────────────────────────────────────────
function renderDayBarsInto(logs, container) {
  const maxMins = Math.max(
    ...logs.map(l => l.task_total_minutes || l.day_duration_minutes || 0), 1);
  const PX_PER_MIN = 1/5;
  const targetH = Math.max(Math.round(maxMins * PX_PER_MIN), 80);
  // Don't set a height on the container — let each column's inner wrapper do it
  // so there's no dead space above the bars.
  container.style.height = "";

  const actOrder = {};
  (weeklyData.activity_types || []).forEach((at, i) => { actOrder[at.type_id] = i; });

  container.innerHTML = logs.map(log => {
    const mins = log.task_total_minutes || log.day_duration_minutes || 0;
    const colH = mins ? Math.max(Math.round((mins / maxMins) * targetH), 2) : 2;
    const rating = log.day_rating || 3;
    const ratingColor = rating >= 4 ? "var(--color-chlorophyll-500)"
      : rating <= 2 ? "var(--danger)" : "var(--color-blue-400)";

    const byType = {};
    (log.tasks || []).forEach(task => {
      const tid = task.activity_type_id || "sys-gray";
      byType[tid] = (byType[tid] || 0) + (task.duration_minutes || 0);
    });

    const segments = Object.entries(byType)
      .sort(([a], [b]) => (actOrder[a] ?? 999) - (actOrder[b] ?? 999))
      .map(([tid, m]) => {
        const color = getActivityTypeColor(weeklyData, tid);
        const segH = Math.max(Math.round((m / mins) * colH), 1);
        return `<div style="height:${segH}px;background:${color};flex-shrink:0"></div>`;
      }).join("");

    return `
      <div style="flex:1;min-width:0;display:flex;flex-direction:column;align-items:center">
        <div style="height:${targetH}px;width:100%;display:flex;flex-direction:column;
                    justify-content:flex-end;align-items:center">
          <div style="height:${colH}px;width:80%;display:flex;flex-direction:column-reverse;
                      border-radius:3px 3px 0 0;overflow:hidden">${segments}</div>
        </div>
        <div style="width:0.8rem;height:0.8rem;border-radius:50%;
                    background:${ratingColor};margin:var(--sp-1) auto 0"
          title="${rating}/5"></div>
        <div style="font-size:1rem;color:var(--text-subtle);text-align:center;
                    margin-top:2px">${log.date.slice(5)}</div>
      </div>`;
  }).join("");
}
  }).join("");
}

// ── Activity pie ──────────────────────────────────────────────
function buildActivityPie(logs, container) {
  const totals = {};
  logs.forEach(l => (l.tasks || []).forEach(task => {
    const tid = task.activity_type_id || "sys-gray";
    totals[tid] = (totals[tid] || 0) + (task.duration_minutes || 0);
  }));
  const slices = Object.entries(totals)
    .sort((a, b) => b[1] - a[1])
    .map(([tid, mins]) => ({
      label:    getActivityTypeLabel(weeklyData, tid),
      value:    mins,
      color:    getActivityTypeColor(weeklyData, tid),
      sublabel: formatDuration(mins),
    }));
  buildPieChart(container, slices);
}

// ── Narrative sections ────────────────────────────────────────
function buildMoodHTML(logs) {
  return logs.map(log => {
    const eod = log.day_rating || 0;
    const am  = log.morning_energy || 0;
    const eodPct = (eod / 5) * 100;
    const amPct  = (am  / 5) * 100;
    const eodColor = eod >= 4 ? "var(--color-chlorophyll-500)"
      : eod <= 2 ? "var(--danger)" : "var(--color-blue-400)";
    const amColor = am >= 4 ? "var(--color-gold-500)"
      : am <= 2 ? "var(--danger)" : "var(--color-charcoal-200)";
    return `
      <div style="margin-bottom:var(--sp-3)">
        <div style="font-size:1.2rem;color:var(--text-subtle);margin-bottom:var(--sp-1)">
          ${log.date.slice(5)}</div>
        ${am ? `<div style="display:flex;align-items:center;gap:var(--sp-3);font-size:1.3rem">
          <div style="width:11rem;font-size:1.2rem;color:var(--text-subtle)">${t("weekly.morning")}</div>
          <div style="flex:1;height:0.8rem;background:var(--bg-card);border-radius:var(--r-pill);overflow:hidden">
            <div style="width:${amPct}%;height:100%;background:${amColor}"></div></div>
          <div style="width:3rem;text-align:right;font-size:1.2rem">${am}/5</div></div>` : ""}
        ${eod ? `<div style="display:flex;align-items:center;gap:var(--sp-3);margin-top:var(--sp-1)">
          <div style="width:11rem;font-size:1.2rem;color:var(--text-subtle)">${t("weekly.evening")}</div>
          <div style="flex:1;height:0.8rem;background:var(--bg-card);border-radius:var(--r-pill);overflow:hidden">
            <div style="width:${eodPct}%;height:100%;background:${eodColor}"></div></div>
          <div style="width:3rem;text-align:right;font-size:1.2rem">${eod}/5</div></div>` : ""}
      </div>`;
  }).join("");
}

function buildWinsHTML(logs) {
  const wins = logs.filter(l => l.win).map(l => ({ date: l.date.slice(5), win: l.win }));
  if (!wins.length) return "";
  return wins.map(w =>
    `<div style="padding:var(--sp-2) 0;border-bottom:1px solid var(--border);font-size:1.4rem">
      <span style="color:var(--text-subtle);font-size:1.2rem;margin-right:var(--sp-2)">${w.date}</span>
      ${escHtml(w.win)}</div>`).join("");
}

function buildObstacleHTML(logs) {
  const obs = logs.filter(l => l.obstacle);
  if (!obs.length) return "";
  return obs.map(l => `
    <div style="margin-bottom:var(--sp-4)">
      <div style="font-size:1.2rem;color:var(--text-subtle);margin-bottom:var(--sp-1)">
        ${l.date.slice(5)}</div>
      <div style="font-size:1.4rem">${escHtml(l.obstacle)}</div>
      ${l.obstacle_response
        ? `<div style="font-size:1.3rem;color:var(--text-muted);margin-top:var(--sp-1)">
            → ${escHtml(l.obstacle_response)}</div>` : ""}
    </div>`).join("");
}

function buildWrapHTML(logs) {
  const wrap = logs.find(l =>
    l.weekly_wrap?.highlight || l.weekly_wrap?.learning ||
    l.weekly_wrap?.change    || l.weekly_wrap?.teacher_note ||
    l.weekly_wrap?.competency_notes)?.weekly_wrap;
  if (!wrap) return `<p class="text-muted">${t("weekly.no_wrap")}</p>`;

  const lang = getCurrentLang();
  const tcf  = weeklyData?.context?.teacher_custom_field;

  // Competency notes section — rendered if present
  let compHTML = "";
  if (wrap.competency_notes && typeof getStudentCompetencies === "function") {
    const courseCode  = weeklyData?.context?.internship_course_code || "generic";
    const programCode = weeklyData?.profile?.program || "";
    const comps       = getStudentCompetencies(courseCode, programCode);
    const notesWithData = comps.filter(c => wrap.competency_notes[c.code]);
    if (notesWithData.length) {
      compHTML = `<div style="margin-top:var(--sp-4);padding:var(--sp-3);
        background:rgba(var(--accent-rgb),.05);border-radius:var(--r-md);
        border-left:3px solid var(--accent)">
        <div style="font-size:1.2rem;font-weight:600;text-transform:uppercase;
          letter-spacing:0.05em;color:var(--text-subtle);margin-bottom:var(--sp-3)">
          ${lang === "fr-CA" ? "Réflexion sur les compétences" : "Competency reflection"}
        </div>
        ${notesWithData.map(c => `
          <div style="margin-bottom:var(--sp-4)">
            <div style="font-size:1.2rem;font-weight:600;color:var(--text-muted);margin-bottom:var(--sp-1)">
              ${escHtml(c.code)} — ${escHtml(c.title[lang] || c.title["fr-CA"])}
            </div>
            <div style="font-size:1.4rem">${escHtml(wrap.competency_notes[c.code])}</div>
          </div>`).join("")}
      </div>`;
    }
  }

  return [
    wrap.highlight && { label: t("dashboard.weekly_highlight"), text: wrap.highlight },
    wrap.learning  && { label: t("dashboard.weekly_learning"),  text: wrap.learning  },
    wrap.change    && { label: t("dashboard.weekly_change"),    text: wrap.change    },
    (wrap.teacher_note && tcf?.label)
                   && { label: tcf.label, text: wrap.teacher_note, highlight: true },
  ].filter(Boolean).map(item => `
    <div style="margin-bottom:var(--sp-4)${item.highlight
      ? ";padding:var(--sp-3);background:rgba(var(--accent-rgb),.07);border-radius:var(--r-md);border-left:3px solid var(--accent)" : ""}">
      <div style="font-size:1.2rem;font-weight:600;text-transform:uppercase;
                  letter-spacing:0.05em;color:var(--text-subtle);margin-bottom:var(--sp-1)">
        ${escHtml(item.label)}</div>
      <div style="font-size:1.4rem">${escHtml(item.text)}</div>
    </div>`).join("") + compHTML;
}

function buildProjectsHTML(logs) {
  if (weeklyData.pathway !== "hub") return "";
  const statusMap = {};
  logs.forEach(l => (l.project_status_updates || []).forEach(u => {
    if (u.notes || u.status !== "active") statusMap[u.project_id] = u;
  }));
  if (!Object.keys(statusMap).length) return "";
  return Object.entries(statusMap).map(([pid, u]) => {
    const proj = weeklyData.projects?.find(p => p.project_id === pid);
    return `<div style="padding:var(--sp-3) 0;border-bottom:1px solid var(--border)">
      <div style="font-weight:500;margin-bottom:var(--sp-1)">${escHtml(proj?.project_name || pid)}</div>
      ${u.notes ? `<div style="font-size:1.4rem;color:var(--text-muted)">${escHtml(u.notes)}</div>` : ""}
    </div>`;
  }).join("");
}

// ── Single-week print view ─────────────────────────────────────
function openWeekPrint(weekStart) {
  if (!weeklyData) return;
  const logs = weeklyData.logs
    .filter(l => getWeekKey(l.date) === weekStart)
    .sort((a, b) => a.date.localeCompare(b.date));
  if (!logs.length) return;

  const p     = weeklyData.profile;
  const tcf   = weeklyData.context?.teacher_custom_field;
  const lang  = getCurrentLang();

  const totalMins = logs.reduce((s, l) =>
    s + (l.task_total_minutes || l.day_duration_minutes || 0), 0);
  const ratings = logs.filter(l => l.day_rating);
  const avgR = ratings.length
    ? (ratings.reduce((s, l) => s + l.day_rating, 0) / ratings.length).toFixed(1) : "—";

  const wrap = logs.find(l =>
    l.weekly_wrap?.highlight || l.weekly_wrap?.learning ||
    l.weekly_wrap?.change    || l.weekly_wrap?.teacher_note ||
    l.weekly_wrap?.competency_notes)?.weekly_wrap;

  const wins = logs.filter(l => l.win)
    .map(l => `<li><span style="color:#666;font-size:11px">${l.date.slice(5)} </span>${escHtml(l.win)}</li>`)
    .join("");

  const obstacles = logs.filter(l => l.obstacle).map(l => `
    <div style="margin-bottom:8px">
      <span style="color:#666;font-size:11px">${l.date.slice(5)} </span>
      <strong>${escHtml(l.obstacle)}</strong>
      ${l.obstacle_response ? `<div style="color:#555;margin-top:2px">→ ${escHtml(l.obstacle_response)}</div>` : ""}
    </div>`).join("");

  // Activity totals
  const actTotals = {};
  logs.forEach(l => (l.tasks || []).forEach(t => {
    const tid = t.activity_type_id || "sys-gray";
    actTotals[tid] = (actTotals[tid] || 0) + (t.duration_minutes || 0);
  }));
  const actRows = Object.entries(actTotals)
    .sort((a, b) => b[1] - a[1])
    .map(([tid, mins]) => {
      const label = getActivityTypeLabel(weeklyData, tid);
      const color = weeklyData.activity_types?.find(a => a.type_id === tid)?.color || "#888";
      const pct   = Math.round((mins / totalMins) * 100);
      return `<div style="display:flex;align-items:center;gap:8px;margin-bottom:4px">
        <div style="width:10px;height:10px;border-radius:2px;background:${color};flex-shrink:0"></div>
        <div style="flex:1;font-size:12px">${escHtml(label)}</div>
        <div style="font-size:12px;color:#555">${formatDuration(mins)}</div>
        <div style="width:3em;text-align:right;font-size:11px;color:#888">${pct}%</div>
      </div>`;
    }).join("");

  // Day column for activity bar
  const actOrder = {};
  (weeklyData.activity_types || []).forEach((at, i) => { actOrder[at.type_id] = i; });
  const maxMins = Math.max(...logs.map(l => l.task_total_minutes || l.day_duration_minutes || 0), 1);
  const BAR_H = 120;
  const dayCols = logs.map(log => {
    const mins = log.task_total_minutes || log.day_duration_minutes || 0;
    const colH = Math.max(Math.round((mins / maxMins) * BAR_H), 2);
    const byType = {};
    (log.tasks || []).forEach(t => {
      const tid = t.activity_type_id || "sys-gray";
      byType[tid] = (byType[tid] || 0) + (t.duration_minutes || 0);
    });
    const segs = Object.entries(byType)
      .sort(([a],[b]) => (actOrder[a]??999)-(actOrder[b]??999))
      .map(([tid, m]) => {
        const color = weeklyData.activity_types?.find(a => a.type_id === tid)?.color || "#888";
        const h = Math.max(Math.round((m / mins) * colH), 1);
        return `<div style="height:${h}px;background:${color};flex-shrink:0"></div>`;
      }).join("");
    const r = log.day_rating || 3;
    const rc = r >= 4 ? "#3a6e00" : r <= 2 ? "#a00" : "#1e6e8e";
    return `<div style="display:flex;flex-direction:column;align-items:center;flex:1">
      <div style="width:80%;height:${colH}px;display:flex;flex-direction:column-reverse;
                  border-radius:2px 2px 0 0;overflow:hidden">${segs}</div>
      <div style="width:8px;height:8px;border-radius:50%;background:${rc};margin:3px auto 1px"></div>
      <div style="font-size:9px;color:#666">${log.date.slice(5)}</div>
    </div>`;
  }).join("");

  const weekLabel = lang === "fr-CA"
    ? `Bilan de la semaine du ${weekStart}`
    : `Weekly report — week of ${weekStart}`;
  const studentLine = [p?.full_name, p?.student_id, p?.program, p?.cohort]
    .filter(Boolean).join("  ·  ");
  const teacherLine = p?.supervising_professor
    ? `${lang === "fr-CA" ? "Superviseur·e pédagogique" : "Supervising teacher"}: ${p.supervising_professor}`
    : "";

  // Teacher custom field section
  const teacherSection = (tcf?.label && wrap?.teacher_note) ? `
    <div style="margin-top:16px;padding:12px;border:1.5px solid #4a38d4;border-radius:6px;
                background:#f5f4ff">
      <div style="font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.06em;
                  color:#4a38d4;margin-bottom:4px">${escHtml(tcf.label)}</div>
      <div style="font-size:13px;white-space:pre-wrap">${escHtml(wrap.teacher_note)}</div>
    </div>` : "";

  // Competency reflection section for print
  let compPrintSection = "";
  if (wrap?.competency_notes && typeof getStudentCompetencies === "function") {
    const courseCode  = weeklyData?.context?.internship_course_code || "generic";
    const programCode = weeklyData?.profile?.program || "";
    const comps       = getStudentCompetencies(courseCode, programCode);
    const notesWithData = comps.filter(c => wrap.competency_notes[c.code]);
    if (notesWithData.length) {
      const lbl = lang === "fr-CA" ? "Réflexion sur les compétences" : "Competency reflection";
      compPrintSection = `
    <div style="margin-top:14px;padding:12px;border:1.5px solid #00587c;border-radius:6px;
                background:#f0f8fc">
      <div style="font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.06em;
                  color:#00587c;margin-bottom:8px">${lbl}</div>
      ${notesWithData.map(c => `
        <div style="margin-bottom:10px">
          <div style="font-size:10px;font-weight:600;color:#555;margin-bottom:2px">
            ${escHtml(c.code)} — ${escHtml(c.title[lang] || c.title["fr-CA"])}
          </div>
          <div style="font-size:13px;white-space:pre-wrap">${escHtml(wrap.competency_notes[c.code])}</div>
        </div>`).join("")}
    </div>`;
    }
  }

  const html = `<!DOCTYPE html>
<html lang="${lang}">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${weekLabel}</title>
<style>
  * { box-sizing:border-box; margin:0; padding:0; }
  body { font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;
         font-size:13px; color:#111; background:#fff; padding:24px; max-width:900px; margin:0 auto; }
  h1 { font-size:20px; font-weight:700; margin-bottom:4px; }
  h2 { font-size:13px; font-weight:600; text-transform:uppercase; letter-spacing:.07em;
       color:#555; margin:16px 0 6px; border-bottom:1px solid #e5e7eb; padding-bottom:4px; }
  .meta { font-size:12px; color:#555; margin-bottom:16px; }
  .stat-row { display:flex; gap:12px; margin-bottom:16px; }
  .stat { flex:1; text-align:center; padding:10px; background:#f7f8fa;
          border-radius:6px; }
  .stat-val { font-size:22px; font-weight:700; color:#00587c; letter-spacing:-.03em; }
  .stat-lbl { font-size:10px; color:#777; text-transform:uppercase; letter-spacing:.06em; margin-top:2px; }
  .grid2 { display:grid; grid-template-columns:1fr 1fr; gap:12px; margin-bottom:12px; }
  .card { background:#f7f8fa; border-radius:6px; padding:12px; }
  .print-btn { display:block; margin:0 auto 20px; padding:10px 28px;
               background:#00587c; color:white; border:none; border-radius:6px;
               font-size:14px; font-weight:600; cursor:pointer; }
  .print-btn:hover { background:#004a6a; }
  @media print {
    .print-btn { display:none !important; }
    @page { size:A4 landscape; margin:1.5cm; }
  }
  li { margin-bottom:4px; margin-left:16px; font-size:12px; }
  .wrap-item { margin-bottom:10px; }
  .wrap-lbl { font-size:10px; font-weight:700; text-transform:uppercase;
              letter-spacing:.06em; color:#777; margin-bottom:2px; }
  .wrap-val { font-size:13px; white-space:pre-wrap; }
</style>
</head>
<body>
<button class="print-btn" onclick="window.print()">
  ${lang === "fr-CA" ? "🖨 Imprimer / Enregistrer en PDF" : "🖨 Print / Save as PDF"}
</button>

<h1>${weekLabel}</h1>
<div class="meta">${escHtml(studentLine)}</div>
${teacherLine ? `<div class="meta">${escHtml(teacherLine)}</div>` : ""}

<div class="stat-row">
  <div class="stat">
    <div class="stat-val">${formatDuration(totalMins)}</div>
    <div class="stat-lbl">${lang === "fr-CA" ? "Heures" : "Hours"}</div>
  </div>
  <div class="stat">
    <div class="stat-val">${logs.length}</div>
    <div class="stat-lbl">${lang === "fr-CA" ? "Jours" : "Days"}</div>
  </div>
  <div class="stat">
    <div class="stat-val">${avgR} / 5</div>
    <div class="stat-lbl">${lang === "fr-CA" ? "Note moy." : "Avg rating"}</div>
  </div>
</div>

<div class="grid2">
  <div class="card">
    <h2>${lang === "fr-CA" ? "Jours" : "Days"}</h2>
    <div style="display:flex;gap:4px;align-items:flex-end;height:${BAR_H + 20}px;margin-top:8px">
      ${dayCols}
    </div>
  </div>
  <div class="card">
    <h2>${lang === "fr-CA" ? "Activités" : "Activities"}</h2>
    ${actRows}
  </div>
</div>

${wins ? `<div class="card" style="margin-bottom:12px">
  <h2>${lang === "fr-CA" ? "Victoires" : "Wins"}</h2>
  <ul>${wins}</ul>
</div>` : ""}

${obstacles ? `<div class="card" style="margin-bottom:12px">
  <h2>${lang === "fr-CA" ? "Obstacle" : "Obstacle"}</h2>
  ${obstacles}
</div>` : ""}

${wrap ? `<div class="card" style="margin-bottom:12px">
  <h2>${lang === "fr-CA" ? "Bilan" : "Weekly wrap-up"}</h2>
  ${wrap.highlight ? `<div class="wrap-item"><div class="wrap-lbl">${lang==="fr-CA"?"Point fort":"Highlight"}</div><div class="wrap-val">${escHtml(wrap.highlight)}</div></div>` : ""}
  ${wrap.learning  ? `<div class="wrap-item"><div class="wrap-lbl">${lang==="fr-CA"?"Apprentissage":"Learning"}</div><div class="wrap-val">${escHtml(wrap.learning)}</div></div>` : ""}
  ${wrap.change    ? `<div class="wrap-item"><div class="wrap-lbl">${lang==="fr-CA"?"À changer":"Change"}</div><div class="wrap-val">${escHtml(wrap.change)}</div></div>` : ""}
  ${teacherSection}
  ${compPrintSection}
</div>` : ""}

</body></html>`;

  const win = window.open("", "_blank");
  if (!win) return;
  win.document.write(html);
  win.document.close();
}
