// ── Hub admin dashboard ───────────────────────────────────────
// No backend · no persistence · no cookies
// All state lives in memory and is gone on refresh.

let students = [];        // all built rows
let filtered  = [];       // after filters
let sortCol   = "track_pct";
let sortDir   = 1;

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
document.addEventListener("DOMContentLoaded", () => {
  initPage();
  applyLanguage(getCurrentLang());
  setupHubDrop();
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

// ── File loading ──────────────────────────────────────────────
function loadFiles(fileList) {
  const files = Array.from(fileList).filter(f => f.name.endsWith(".json"));
  if (!files.length) return;

  const readers = files.map(f => new Promise(res => {
    const r = new FileReader();
    r.onload = e => { try { res(JSON.parse(e.target.result)); } catch { res(null); } };
    r.readAsText(f);
  }));

  Promise.all(readers).then(parsed => {
    const valid = parsed.filter(d => d?.profile?.full_name);
    if (!valid.length) {
      setStatus("Aucun fichier valide.", "error"); return;
    }
    // Group by UUID, merge multi-file students
    const byUUID = {};
    valid.forEach(d => {
      const uid = d.meta?.student_uuid || d.profile?.student_id || Math.random().toString();
      (byUUID[uid] = byUUID[uid] || []).push(d);
    });

    const newRows = Object.values(byUUID).map(grp => {
      if (grp.length === 1) return buildRow(grp[0]);
      const merged = mergeInternshipFiles(grp);
      return buildRow(merged.valid ? merged.data : grp[0]);
    });

    // Deduplicate by UUID
    newRows.forEach(r => {
      const existing = students.findIndex(s => s.uuid === r.uuid);
      if (existing >= 0) students[existing] = r;
      else students.push(r);
    });

    setStatus(`${students.length} étudiant·e${students.length > 1 ? "·s" : ""} chargé·e${students.length > 1 ? "·s" : ""}.`);
    document.getElementById("btn-csv").style.display = "";
    document.getElementById("btn-clear").style.display = "";
    document.getElementById("hub-dashboard").style.display = "block";

    populateFilterOptions();
    applyFilters();
  });
}

function clearAll() {
  students = []; filtered = [];
  document.getElementById("hub-dashboard").style.display = "none";
  document.getElementById("btn-csv").style.display = "none";
  document.getElementById("btn-clear").style.display = "none";
  setStatus("Aucun fichier chargé — dépose les JSON ici.");
}

function setStatus(msg) {
  const el = document.getElementById("hub-status-text");
  if (el) el.textContent = msg;
}

// ── Build row data from one student JSON ──────────────────────
function buildRow(data) {
  const logs  = (data.logs || []).sort((a, b) => a.date.localeCompare(b.date));
  const today = new Date().toISOString().slice(0, 10);
  const ctx   = data.context || {};
  const startDate   = ctx.start_date;
  const hoursPerDay = parseFloat(ctx.hours_per_day) || 7;

  // Days elapsed since start (work days only, rough 5/7)
  const calDays = startDate
    ? Math.max(Math.floor((new Date(today) - new Date(startDate)) / 86400000), 0)
    : 0;
  const workDaysElapsed = Math.round(calDays * 5 / 7);
  // Use fixed total target if set, otherwise estimate from daily pace
  const totalTarget    = parseFloat(ctx.total_hours_target) || null;
  const expectedHours  = totalTarget
    ? +(totalTarget * (calDays / Math.max(
        Math.floor((new Date(ctx.scheduled_end_date || "2099-01-01") - new Date(startDate || "2099-01-01")) / 86400000),
        1))).toFixed(1)
    : +(workDaysElapsed * hoursPerDay).toFixed(1);
  const actualHours     = +(logs.reduce((s, l) =>
    s + (l.task_total_minutes || l.day_duration_minutes || 0), 0) / 60).toFixed(1);

  const trackPct = expectedHours > 0 ? Math.round((actualHours / expectedHours) * 100) : null;
  const trackBand = trackPct === null ? "none"
    : trackPct >= 90 ? "green"
    : trackPct >= 70 ? "amber"
    : "red";

  // This week
  const weekStart = getWeekStartISO(today);
  const weekHours = +(logs
    .filter(l => getWeekStartISO(l.date) === weekStart)
    .reduce((s, l) => s + (l.task_total_minutes || l.day_duration_minutes || 0), 0) / 60).toFixed(1);

  const lastLog = logs[logs.length - 1]?.date || null;
  const daysSince = lastLog
    ? Math.floor((new Date(today) - new Date(lastLog)) / 86400000)
    : null;

  const ratings = logs.filter(l => l.day_rating).map(l => l.day_rating);
  const avgRating = ratings.length
    ? +(ratings.reduce((a, b) => a + b) / ratings.length).toFixed(1) : null;

  const actTotals = {};
  logs.forEach(l => (l.tasks || []).forEach(t => {
    const tid = t.activity_type_id || "sys-gray";
    actTotals[tid] = (actTotals[tid] || 0) + (t.duration_minutes || 0);
  }));

  // Enrich with last obstacle, plan_tomorrow, weekly wrap for hub display
  const lastWithObstacle = [...logs].reverse().find(l => l.obstacle);
  const lastWithPlan     = [...logs].reverse().find(l => l.plan_tomorrow);
  const lastWrap         = [...logs].reverse().find(l => l.weekly_wrap?.highlight);

  return {
    uuid:            data.meta?.student_uuid || data.profile?.student_id,
    name:            data.profile?.full_name || "—",
    student_id:      data.profile?.student_id || "—",
    email:           data.profile?.email || "",
    program:         data.profile?.program || "—",
    teacher:         data.profile?.supervising_professor || "—",
    cohort:          data.profile?.cohort || "—",
    pathway:         data.pathway || "—",
    days_logged:     logs.length,
    work_days_elapsed: workDaysElapsed,
    expected_hours:  expectedHours,
    actual_hours:    actualHours,
    track_pct:       trackPct,
    track_band:      trackBand,
    week_hours:      weekHours,
    last_log:        lastLog,
    days_since:      daysSince,
    avg_rating:      avgRating,
    has_reflection:  !!(data.reflection && Object.keys(data.reflection).length > 0),
    act_totals:      actTotals,
    mood_points:     logs.map(l => l.day_rating).filter(Boolean),
    last_obstacle:   lastWithObstacle ? { date: lastWithObstacle.date, text: lastWithObstacle.obstacle, response: lastWithObstacle.obstacle_response } : null,
    last_plan:       lastWithPlan     ? { date: lastWithPlan.date,     text: lastWithPlan.plan_tomorrow } : null,
    last_wrap:       lastWrap         ? { date: lastWrap.date,         wrap: lastWrap.weekly_wrap }       : null,
    total_target:    parseFloat(ctx.total_hours_target) || null,
    raw:             data,
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

  const progSel = document.getElementById("filter-program");
  const cur = progSel.value;
  progSel.innerHTML = '<option value="">Tous les programmes</option>' +
    programs.map(p => `<option value="${escHtml(p)}" ${p===cur?"selected":""}>${escHtml(p)}</option>`).join("");

  const teachSel = document.getElementById("filter-teacher");
  const curT = teachSel.value;
  teachSel.innerHTML = '<option value="">Tous les superviseur·e·s</option>' +
    teachers.map(t => `<option value="${escHtml(t)}" ${t===curT?"selected":""}>${escHtml(t)}</option>`).join("");
}

function applyFilters() {
  const prog    = document.getElementById("filter-program").value;
  const teacher = document.getElementById("filter-teacher").value;
  const pathway = document.getElementById("filter-pathway").value;
  const track   = document.getElementById("filter-track").value;
  const search  = document.getElementById("filter-search").value.toLowerCase().trim();

  filtered = students.filter(s => {
    if (prog    && s.program !== prog)     return false;
    if (teacher && s.teacher !== teacher)  return false;
    if (pathway && s.pathway !== pathway)  return false;
    if (track   && s.track_band !== track) return false;
    if (search  && !s.name.toLowerCase().includes(search)
                && !s.student_id.toLowerCase().includes(search)) return false;
    return true;
  });

  // Sort
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
  renderAWOL();
  renderHoursChart();
  renderProgramPie();
  renderTable();
}

function clearFilters() {
  ["filter-program","filter-teacher","filter-pathway","filter-track"].forEach(id => {
    document.getElementById(id).value = "";
  });
  document.getElementById("filter-search").value = "";
  applyFilters();
}

function sortBy(col) {
  sortDir = sortCol === col ? sortDir * -1 : 1;
  sortCol = col;
  applyFilters();
}

// ── Stat tiles ────────────────────────────────────────────────
function renderStats() {
  const f = filtered;
  const total = f.length;
  const onTrack = f.filter(s => s.track_band === "green").length;
  const behind  = f.filter(s => s.track_band === "red").length;
  const avgH    = total ? (f.reduce((s, r) => s + r.actual_hours, 0) / total).toFixed(1) : "—";
  const reflCount = f.filter(s => s.has_reflection).length;

  const programs = new Set(f.map(s => s.program?.slice(0,6))).size;

  document.getElementById("hub-stats").innerHTML = [
    { val: total,                      label: "Étudiant·e·s", color: "var(--accent)" },
    { val: onTrack + " / " + total,    label: "Dans les temps", color: "#3a6e00" },
    { val: behind + " / " + total,     label: "En retard",     color: "#a00" },
    { val: avgH + " h",                label: "Moy. heures",   color: "var(--accent)" },
    { val: reflCount + " / " + total,  label: "Réflexions",    color: "var(--accent)" },
    { val: programs,                   label: "Programmes",    color: "var(--accent)" },
  ].map(s => `
    <div class="hub-stat">
      <div class="hub-stat-val" style="color:${s.color}">${s.val}</div>
      <div class="hub-stat-label">${s.label}</div>
    </div>`).join("");
}

// ── AWOL alerts ──────────────────────────────────────────────
const AWOL_DAYS = 3; // flag after this many days without a log

function getAWOLStudents() {
  return filtered.filter(s => s.days_since !== null && s.days_since >= AWOL_DAYS)
    .sort((a, b) => b.days_since - a.days_since);
}

function renderAWOL() {
  const awol = getAWOLStudents();
  const section = document.getElementById("awol-section");
  if (!awol.length) { section.style.display = "none"; return; }
  section.style.display = "block";

  document.getElementById("awol-title").textContent =
    awol.length === 1
      ? "1 étudiant·e sans journal depuis 3 jours ou plus"
      : `${awol.length} étudiant·e·s sans journal depuis 3 jours ou plus`;

  document.getElementById("awol-subtitle").textContent =
    "Adresses e-mail disponibles pour un suivi rapide.";

  document.getElementById("awol-list").innerHTML = awol.map(s => {
    const severity = s.days_since >= 7 ? "var(--danger)"
      : s.days_since >= 5 ? "var(--warning)"
      : "var(--text-muted)";
    const badge = s.days_since >= 7 ? "⛔ AWOL"
      : s.days_since >= 5 ? "⚠ En retard"
      : "⚠ MIA";
    const lastPlan = s.last_plan
      ? `<span style="font-size:1.2rem;color:var(--text-subtle)"> · Planifié : ${escHtml(s.last_plan.text.slice(0,60))}${s.last_plan.text.length > 60 ? "…" : ""}</span>`
      : "";
    return `
      <div style="display:flex;align-items:center;gap:var(--sp-4);
                  padding:var(--sp-3) 0;border-bottom:1px solid rgba(255,107,112,.2)">
        <span style="color:${severity};font-weight:700;width:6rem;flex-shrink:0">${badge}</span>
        <div style="flex:1">
          <span style="font-weight:600">${escHtml(s.name)}</span>
          <span style="color:var(--text-subtle);font-size:1.3rem"> · ${escHtml(s.program?.slice(0,20))}…</span>
          ${lastPlan}
        </div>
        <span style="color:${severity};font-weight:700;font-size:1.5rem;flex-shrink:0">J-${s.days_since}</span>
        <span style="color:var(--text-subtle);font-size:1.3rem;flex-shrink:0">
          ${s.last_log || "jamais"}
        </span>
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

  const maxH = Math.max(...filtered.map(s => Math.max(s.actual_hours, s.expected_hours, 1)));
  const barColors = { green: "#3a6e00", amber: "#9a6c00", red: "#a00", none: "var(--accent)" };
  const darkColors = { green: "#8ab840", amber: "#e6b830", red: "#ff6b70", none: "var(--accent)" };

  const isDark = document.documentElement.getAttribute("data-theme") === "dark";
  const cols = isDark ? darkColors : barColors;

  el.innerHTML = filtered.map(s => {
    const actualH  = Math.max(s.actual_hours, 0.1);
    const expectH  = Math.max(s.expected_hours, 0.1);
    const actualPx = Math.max(Math.round((actualH / maxH) * 220), 4);
    const expectPx = Math.max(Math.round((expectH / maxH) * 220), 4);
    const color    = cols[s.track_band] || cols.none;
    const initials = s.name.split(" ").map(w => w[0]).join("").slice(0,2).toUpperCase();

    return `
      <div title="${escHtml(s.name)}: ${s.actual_hours}h / ${s.expected_hours}h attendues"
        style="flex:1;min-width:1.6rem;max-width:4rem;position:relative;display:flex;
               flex-direction:column;align-items:center;cursor:default">
        <div style="font-size:1rem;color:var(--text-subtle);margin-bottom:2px">${s.actual_hours}h</div>
        <div style="display:flex;flex-direction:column;align-items:center;width:100%;
                    justify-content:flex-end;height:220px;position:relative">
          <!-- Expected line -->
          <div style="position:absolute;bottom:${expectPx}px;left:0;right:0;
                      border-top:2px dashed rgba(100,100,100,.4);z-index:1"></div>
          <!-- Actual bar -->
          <div style="width:80%;background:${color};height:${actualPx}px;
                      border-radius:3px 3px 0 0;position:relative;z-index:2"></div>
        </div>
        <div style="font-size:0.9rem;color:var(--text-subtle);margin-top:3px;
                    max-width:3.6rem;overflow:hidden;text-overflow:ellipsis;
                    text-align:center">${initials}</div>
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
    // Track pill
    const pillClass = { green:"track-green", amber:"track-amber", red:"track-red", none:"track-none" }[s.track_band];
    const pillLabel = s.track_pct !== null
      ? s.track_pct + "%"
      : "—";
    const trackHint = s.track_pct !== null
      ? `${s.actual_hours}h / ${s.expected_hours}h att.`
      : "Pas de date de début définie";

    // Last log freshness
    const logColor = s.days_since === null ? "var(--text-subtle)"
      : s.days_since <= 2 ? "var(--success)"
      : s.days_since <= 6 ? "var(--warning)"
      : "var(--danger)";
    const logCell = s.last_log
      ? `<span style="color:${logColor};font-weight:500">${s.last_log}</span>
         <span style="font-size:1.1rem;color:var(--text-subtle)"> J-${s.days_since}</span>`
      : "—";

    const pathwayTag = s.pathway === "hub"
      ? `<span class="tag" style="background:var(--accent);color:white;font-size:1.1rem">Hub</span>`
      : `<span class="tag" style="font-size:1.1rem">Entreprise</span>`;

    const reflCell = s.has_reflection
      ? `<span style="color:var(--success);font-weight:600">✓</span>`
      : `<span style="color:var(--text-subtle)">—</span>`;

    const sparkline = moodSparkline(s.mood_points);

    return `
      <tr class="data-row" onclick="toggleDetail(${i})">
        <td><strong>${escHtml(s.name)}</strong></td>
        <td style="color:var(--text-subtle);font-size:1.2rem">${escHtml(s.student_id)}</td>
        <td style="max-width:20rem;overflow:hidden;text-overflow:ellipsis"
          title="${escHtml(s.program)}">${escHtml(s.program)}</td>
        <td>${escHtml(s.teacher)}</td>
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

function toggleDetail(i) {
  const row = document.getElementById(`detail-${i}`);
  if (!row) return;
  row.style.display = row.style.display === "none" ? "" : "none";
}

function buildDetailHTML(s) {
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
  const info = [
    ctx.start_date         && `Début : ${ctx.start_date}`,
    ctx.scheduled_end_date && `Fin prévue : ${ctx.scheduled_end_date}`,
    ctx.hours_per_day      && `${ctx.hours_per_day}h / jour prévues`,
    s.raw.pathway === "hub" && s.raw.projects?.length &&
      `Projets : ${s.raw.projects.map(p => p.project_name).join(", ")}`,
  ].filter(Boolean).map(t => `<div style="font-size:1.3rem;margin-bottom:var(--sp-1)">${t}</div>`).join("");

  return `
    <div style="display:grid;grid-template-columns:1fr 1fr 22rem;gap:var(--sp-6)">
      <div>
        <div style="font-size:1.1rem;font-weight:700;text-transform:uppercase;
                    letter-spacing:0.08em;color:var(--text-subtle);margin-bottom:var(--sp-3)">
          Activités
        </div>
        ${acts || "<span style='color:var(--text-subtle)'>—</span>"}
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
