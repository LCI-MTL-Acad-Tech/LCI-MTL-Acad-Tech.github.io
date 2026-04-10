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

// ── Init ──────────────────────────────────────────────────────
document.addEventListener("DOMContentLoaded", () => {
  initPage(); // calls applyLanguage internally; MutationObserver re-renders on change

  calData      = loadData();
  calDownloads = getDownloads();

  if (calData && calData.context?.start_date) {
    showCalendar();
  } else {
    document.getElementById("cal-no-data").classList.remove("hidden");
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

// ── File upload fallback ──────────────────────────────────────
function loadCalFile(file) {
  if (!file) return;
  const r = new FileReader();
  r.onload = e => {
    try {
      const d = JSON.parse(e.target.result);
      if (!d.context?.start_date) {
        alert("Fichier non reconnu — assure-toi d'utiliser un fichier JSON de stage valide.");
        return;
      }
      calData = d;
      showCalendar();
    } catch { alert("Erreur de lecture du fichier JSON."); }
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
}

function renderGrid() {
  const ctx  = calData.context;
  const lang = getCurrentLang();
  const logs = calData.logs || [];

  const startDate  = parseDate(ctx.start_date);
  const endDate    = parseDate(ctx.scheduled_end_date);
  const today      = isoDate(new Date());
  const workDays   = ctx.work_days   || [1,2,3,4,5];
  const weekStart  = ctx.calendar_week_start ?? 1;
  const wrapDay    = ctx.week_end_day ?? 5;
  const absences   = (ctx.planned_absences || []).map(a => a.date);

  // Build set of dates with logs
  const logDates = new Set(logs.map(l => l.date));

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
      if (hasWeekly)          badges.push(`<span class="cal-badge" title="${t("cal.legend_weekly")}">⭐</span>`);
      if (isFutureWrapDay)    badges.push(`<span class="cal-badge" title="${t("cal.legend_weekly_due")}" style="opacity:.5">☆</span>`);
      if (hasFinal)           badges.push(`<span class="cal-badge" title="${t("cal.legend_final")}">🏅</span>`);

      // Absence note
      const absObj = isAbs ? (ctx.planned_absences || []).find(a => a.date === ds) : null;
      const absNote = absObj?.reason
        ? `<div class="cal-absence-chip" title="${escHtml(absObj.reason)}">✗ ${escHtml(absObj.reason)}</div>`
        : isAbs ? `<div class="cal-absence-chip">✗</div>` : "";

      const clickable = isIntern && isWork && !outside;
      const onclick   = (isIntern && (isWork || isAbs))
        ? `onclick="openAbsenceModal('${ds}', ${isAbs})"` : "";

      rowHTML += `
        <div class="${cellClass}" ${onclick}>
          <div class="cal-day-num">${cur.getDate()}</div>
          ${badges.length ? `<div class="cal-badges">${badges.join("")}</div>` : ""}
          ${absNote}
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

  const workHours  = ctx.work_hours || { h: 7, m: 30 };
  const perDayMins = workHoursToMinutes(workHours);
  const target     = parseFloat(ctx.total_hours_target) || null;
  const workDays   = ctx.work_days   || [1,2,3,4,5];
  const absences   = (ctx.planned_absences || []).map(a => a.date);
  const today      = isoDate(new Date());

  // Logged so far
  const loggedMins = logs.reduce((s, l) =>
    s + (l.task_total_minutes || l.day_duration_minutes || 0), 0);

  // Remaining planned working days (from tomorrow to end, inclusive)
  const endDate = parseDate(ctx.scheduled_end_date);
  let   cur     = parseDate(today);
  cur = addDays(cur, 1); // start from tomorrow
  let   plannedDays = 0;
  while (cur <= endDate) {
    const ds  = isoDate(cur);
    const dow = cur.getDay();
    if (workDays.includes(dow) && !absences.includes(ds)) plannedDays++;
    cur = addDays(cur, 1);
  }

  const plannedMins = plannedDays * perDayMins;
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

  const perDayStr = workHoursToString(workHours);

  document.getElementById("cal-hours-panel").innerHTML = `
    <div class="hours-row">
      <span class="hours-row-label">${t("cal.hours_done")}</span>
      <span class="hours-row-val">${loggedStr}</span>
    </div>
    <div class="hours-row">
      <span class="hours-row-label">${t("cal.hours_planned")}</span>
      <span class="hours-row-val">${plannedStr}
        <span style="font-size:1.1rem;color:var(--text-subtle);font-weight:400">
          (${plannedDays} × ${perDayStr})
        </span>
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
    { badge: "⭐", key: "cal.legend_weekly" },
    { badge: "☆",  key: "cal.legend_weekly_due" },
    { badge: "🏅", key: "cal.legend_final" },
  ];

  el.innerHTML = items.map(item => {
    const left = item.badge
      ? `<span style="font-size:1.4rem;width:2rem;text-align:center">${item.badge}</span>`
      : `<div class="cal-legend-swatch" style="${item.swatch}"></div>`;
    return `
      <div class="cal-legend-item">
        ${left}
        <span>${t(item.key)}</span>
      </div>`;
  }).join("");
}

// ── Absence modal ─────────────────────────────────────────────
function openAbsenceModal(date, isCurrentlyAbsent) {
  pendingAbsenceDate = date;
  const lang = getCurrentLang();
  const d    = parseDate(date);

  document.getElementById("absence-modal-title").textContent =
    formatShortDate(d, lang);
  document.getElementById("absence-reason-input").value =
    isCurrentlyAbsent
      ? ((calData.context.planned_absences || []).find(a => a.date === date)?.reason || "")
      : "";

  const removeBtn = document.getElementById("absence-remove-btn");
  removeBtn.style.display = isCurrentlyAbsent ? "" : "none";

  document.getElementById("absence-modal").classList.remove("hidden");
  setTimeout(() => document.getElementById("absence-reason-input").focus(), 80);
}

function closeAbsenceModal(e) {
  if (e && e.target !== document.getElementById("absence-modal")) return;
  document.getElementById("absence-modal").classList.add("hidden");
  pendingAbsenceDate = null;
}

function confirmAbsence() {
  if (!pendingAbsenceDate) return;
  const reason = document.getElementById("absence-reason-input").value.trim();
  const ctx    = calData.context;

  // Remove existing entry for this date if any
  ctx.planned_absences = (ctx.planned_absences || []).filter(a => a.date !== pendingAbsenceDate);
  // Add new entry
  ctx.planned_absences.push({ date: pendingAbsenceDate, reason });
  ctx.planned_absences.sort((a,b) => a.date.localeCompare(b.date));

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
  const ctx = calData.context;
  ctx.planned_absences = (ctx.planned_absences || []).filter(a => a.date !== date);
  persistAndRefresh();
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
