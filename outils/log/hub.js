// ── Hub admin dashboard ───────────────────────────────────────
// No backend, no persistence, no cookies.
// All data lives in memory and is gone on refresh.

let students = []; // array of parsed internship JSONs
let sortCol = "name";
let sortDir = 1;

document.addEventListener("DOMContentLoaded", () => {
  initPage();
  setupDropZone();
  applyLanguage(getCurrentLang());
});

function setupDropZone() {
  const zone = document.getElementById("hub-drop-zone");
  if (!zone) return;
  zone.addEventListener("dragover", e => { e.preventDefault(); zone.classList.add("drag-over"); });
  zone.addEventListener("dragleave", () => zone.classList.remove("drag-over"));
  zone.addEventListener("drop", e => {
    e.preventDefault(); zone.classList.remove("drag-over");
    loadFiles(e.dataTransfer.files);
  });
}

function loadFiles(fileList) {
  const files = Array.from(fileList).filter(f => f.name.endsWith(".json"));
  if (!files.length) return;

  const readers = files.map(f => new Promise(res => {
    const r = new FileReader();
    r.onload = e => {
      try { res(JSON.parse(e.target.result)); }
      catch { res(null); }
    };
    r.readAsText(f);
  }));

  Promise.all(readers).then(parsed => {
    const valid = parsed.filter(d => d?.profile?.full_name);
    if (!valid.length) {
      showStatus("Aucun fichier valide / No valid files.", "error");
      return;
    }
    // Merge multiple files per student (same uuid → merge)
    const byUUID = {};
    valid.forEach(d => {
      const uid = d.meta?.student_uuid || d.profile?.student_id || Math.random();
      if (!byUUID[uid]) { byUUID[uid] = []; }
      byUUID[uid].push(d);
    });

    const newStudents = Object.values(byUUID).map(files => {
      if (files.length === 1) return buildStudentRow(files[0]);
      const result = mergeInternshipFiles(files);
      return result.valid ? buildStudentRow(result.data) : buildStudentRow(files[0]);
    });

    students = [...students, ...newStudents].filter((s, i, arr) =>
      arr.findIndex(x => x.uuid === s.uuid) === i
    );

    showStatus(`${students.length} étudiant·e·s chargé·e·s / ${students.length} students loaded.`, "success");
    renderTable();
    document.getElementById("phase-upload").classList.add("hidden");
    document.getElementById("phase-dashboard").classList.remove("hidden");
  });
}

function buildStudentRow(data) {
  const logs = (data.logs || []).sort((a, b) => a.date.localeCompare(b.date));
  const totalMins = logs.reduce((s, l) => s + (l.task_total_minutes || l.day_duration_minutes || 0), 0);
  const today = new Date().toISOString().slice(0, 10);

  // Days elapsed since internship start
  const startDate = data.context?.start_date || logs[0]?.date;
  const daysElapsed = startDate
    ? Math.max(Math.floor((new Date(today) - new Date(startDate)) / 86400000), 0)
    : 0;
  // Workdays elapsed (rough: 5/7 of calendar days)
  const workdaysElapsed = Math.round(daysElapsed * 5 / 7);

  // Hours this week
  const weekStart = getWeekStartISO(today);
  const weekMins = logs
    .filter(l => getWeekStartISO(l.date) === weekStart)
    .reduce((s, l) => s + (l.task_total_minutes || l.day_duration_minutes || 0), 0);

  const lastLog = logs[logs.length - 1]?.date || null;
  const daysSinceLog = lastLog
    ? Math.floor((new Date(today) - new Date(lastLog)) / 86400000)
    : null;

  const ratings = logs.filter(l => l.day_rating).map(l => l.day_rating);
  const avgRating = ratings.length ? (ratings.reduce((a, b) => a + b) / ratings.length) : null;

  const hasReflection = !!(data.reflection && Object.keys(data.reflection).length > 0);

  // Activity totals for sparkline
  const actTotals = {};
  logs.forEach(l => (l.tasks || []).forEach(t => {
    const tid = t.activity_type_id || "sys-gray";
    actTotals[tid] = (actTotals[tid] || 0) + (t.duration_minutes || 0);
  }));

  // Mood sparkline data
  const moodPoints = logs.map(l => l.day_rating || null).filter(Boolean);

  return {
    uuid:         data.meta?.student_uuid,
    name:         data.profile?.full_name || "—",
    student_id:   data.profile?.student_id || "—",
    program:      data.profile?.program || "—",
    cohort:       data.profile?.cohort || "—",
    pathway:      data.pathway || "—",
    days_logged:  logs.length,
    workdays_elapsed: workdaysElapsed,
    completion_pct: workdaysElapsed > 0 ? Math.min(100, Math.round((logs.length / workdaysElapsed) * 100)) : 0,
    total_mins:   totalMins,
    week_mins:    weekMins,
    last_log:     lastLog,
    days_since:   daysSinceLog,
    avg_rating:   avgRating,
    has_reflection: hasReflection,
    act_totals:   actTotals,
    mood_points:  moodPoints,
    raw:          data,
  };
}

function getWeekStartISO(dateStr) {
  const d = new Date(dateStr + "T12:00:00");
  const day = d.getDay() || 7;
  d.setDate(d.getDate() - day + 1);
  return d.toISOString().slice(0, 10);
}

// ── Table rendering ───────────────────────────────────────────
function sortBy(col) {
  if (sortCol === col) sortDir *= -1;
  else { sortCol = col; sortDir = 1; }
  renderTable();
}

function renderTable() {
  const sorted = [...students].sort((a, b) => {
    let va = a[sortCol], vb = b[sortCol];
    if (va == null) va = sortDir > 0 ? Infinity : -Infinity;
    if (vb == null) vb = sortDir > 0 ? Infinity : -Infinity;
    if (typeof va === "string") return va.localeCompare(vb) * sortDir;
    return (va - vb) * sortDir;
  });

  const arrow = col => col === sortCol ? (sortDir > 0 ? " ↑" : " ↓") : "";

  const cols = [
    { key: "name",           label: "Nom / Name" },
    { key: "program",        label: "Programme" },
    { key: "pathway",        label: "Type" },
    { key: "days_logged",    label: "Jours / Days" },
    { key: "completion_pct", label: "Complété / Done" },
    { key: "total_mins",     label: "Heures / Hours" },
    { key: "week_mins",      label: "Cette sem. / This wk" },
    { key: "last_log",       label: "Dernier journal / Last log" },
    { key: "avg_rating",     label: "Note moy. / Avg ★" },
    { key: "has_reflection", label: "Réflexion / Reflection" },
  ];

  const thead = `<tr>${cols.map(c =>
    `<th onclick="sortBy('${c.key}')" style="cursor:pointer;white-space:nowrap">
      ${c.label}${arrow(c.key)}
    </th>`
  ).join("")}<th>Humeur / Mood</th></tr>`;

  const tbody = sorted.map((s, i) => {
    const hoursTotal = formatDuration(s.total_mins);
    const hoursWeek  = formatDuration(s.week_mins);
    const compPct    = s.completion_pct + "%";
    const compColor  = s.completion_pct >= 80 ? "var(--success)" : s.completion_pct >= 50 ? "var(--warning)" : "var(--danger)";

    // Last log freshness
    let lastLogCell = "—";
    if (s.last_log) {
      const ds = s.days_since;
      const color = ds === 0 ? "var(--success)" : ds <= 2 ? "var(--success)" : ds <= 6 ? "var(--warning)" : "var(--danger)";
      lastLogCell = `<span style="color:${color};font-weight:500">${s.last_log}</span>
        <span style="font-size:1.1rem;color:var(--text-subtle)"> (J-${ds})</span>`;
    }

    const rating = s.avg_rating ? s.avg_rating.toFixed(1) : "—";
    const refl   = s.has_reflection ? "✓" : "—";

    const sparkline = moodSparkline(s.mood_points);
    const pathwayTag = s.pathway === "hub"
      ? `<span class="tag" style="background:var(--accent);color:white;font-size:1.1rem">Hub</span>`
      : `<span class="tag" style="font-size:1.1rem">Entreprise</span>`;

    return `<tr onclick="toggleDetail(${i})" style="cursor:pointer">
      <td><strong>${escHtml(s.name)}</strong><br>
          <span style="font-size:1.2rem;color:var(--text-subtle)">${escHtml(s.student_id)}</span></td>
      <td>${escHtml(s.program)}<br>
          <span style="font-size:1.2rem;color:var(--text-subtle)">${escHtml(s.cohort)}</span></td>
      <td>${pathwayTag}</td>
      <td style="text-align:center">${s.days_logged}</td>
      <td style="text-align:center;color:${compColor};font-weight:500">${compPct}</td>
      <td style="text-align:right;font-weight:500">${hoursTotal}</td>
      <td style="text-align:right">${hoursWeek}</td>
      <td>${lastLogCell}</td>
      <td style="text-align:center">${rating}</td>
      <td style="text-align:center;color:${s.has_reflection ? "var(--success)" : "var(--text-subtle)"}">${refl}</td>
      <td>${sparkline}</td>
    </tr>
    <tr id="detail-${i}" class="hidden" style="background:var(--bg-subtle)">
      <td colspan="11" style="padding:var(--sp-4) var(--sp-6)">
        ${buildDetailHTML(s)}
      </td>
    </tr>`;
  }).join("");

  document.getElementById("hub-table").innerHTML =
    `<thead>${thead}</thead><tbody>${tbody}</tbody>`;
  document.getElementById("student-count").textContent =
    `${students.length} étudiant·e${students.length > 1 ? "·s" : ""} / student${students.length > 1 ? "s" : ""}`;
}

function moodSparkline(points) {
  if (!points.length) return "—";
  const W = 80, H = 24, pad = 2;
  const xs = points.map((_, i) => pad + (i / Math.max(points.length - 1, 1)) * (W - pad * 2));
  const ys = points.map(p => H - pad - ((p - 1) / 4) * (H - pad * 2));
  const pts = points.map((p, i) => `${xs[i].toFixed(1)},${ys[i].toFixed(1)}`).join(" ");
  return `<svg viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" style="display:block">
    <polyline points="${pts}" fill="none" stroke="var(--accent)" stroke-width="1.5"
      stroke-linejoin="round" stroke-linecap="round"/>
  </svg>`;
}

function toggleDetail(i) {
  const row = document.getElementById(`detail-${i}`);
  row.classList.toggle("hidden");
}

function buildDetailHTML(s) {
  const acts = Object.entries(s.act_totals)
    .sort((a, b) => b[1] - a[1])
    .map(([tid, mins]) => {
      const label = getActivityTypeLabel(s.raw, tid);
      const color = getActivityTypeColor(s.raw, tid);
      const pct = Math.round((mins / s.total_mins) * 100);
      return `<div style="display:flex;align-items:center;gap:var(--sp-3);margin-bottom:var(--sp-2)">
        <div style="width:1rem;height:1rem;border-radius:3px;background:${color};flex-shrink:0"></div>
        <div style="flex:1;font-size:1.3rem">${escHtml(label)}</div>
        <div style="font-size:1.3rem;color:var(--text-muted)">${formatDuration(mins)}</div>
        <div style="font-size:1.2rem;color:var(--text-subtle);width:3rem;text-align:right">${pct}%</div>
      </div>`;
    }).join("");

  const projects = (s.raw.projects || []).map(p =>
    `<div style="margin-bottom:var(--sp-1)">
      <span style="font-weight:500">${escHtml(p.project_name)}</span>
      ${p.client_name ? `<span style="color:var(--text-subtle);font-size:1.2rem"> · ${escHtml(p.client_name)}</span>` : ""}
      <span class="tag" style="margin-left:var(--sp-2);font-size:1.1rem">${escHtml(p.status || "active")}</span>
    </div>`).join("") || "—";

  return `<div style="display:grid;grid-template-columns:1fr 1fr;gap:var(--sp-6)">
    <div>
      <div style="font-size:1.2rem;font-weight:600;text-transform:uppercase;letter-spacing:0.08em;color:var(--text-subtle);margin-bottom:var(--sp-3)">
        Activités / Activities
      </div>
      ${acts || "—"}
    </div>
    <div>
      <div style="font-size:1.2rem;font-weight:600;text-transform:uppercase;letter-spacing:0.08em;color:var(--text-subtle);margin-bottom:var(--sp-3)">
        Projets / Projects
      </div>
      ${projects}
    </div>
  </div>`;
}

// ── CSV export ────────────────────────────────────────────────
function exportCSV() {
  const headers = ["Nom","ID","Programme","Cohorte","Type","Jours","Jours_ouvrés","Complété_%","Heures_total","Heures_semaine","Dernier_journal","Jours_sans_log","Note_moy","Réflexion"];
  const rows = students.map(s => [
    s.name, s.student_id, s.program, s.cohort, s.pathway,
    s.days_logged, s.workdays_elapsed, s.completion_pct,
    (s.total_mins / 60).toFixed(1), (s.week_mins / 60).toFixed(1),
    s.last_log || "", s.days_since ?? "",
    s.avg_rating ? s.avg_rating.toFixed(1) : "",
    s.has_reflection ? "oui" : "non",
  ].map(v => `"${String(v).replace(/"/g, '""')}"`));

  const csv = [headers, ...rows].map(r => r.join(",")).join("\n");
  const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `hub_stage_${new Date().toISOString().slice(0,10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

function loadMore() {
  document.getElementById("file-input-more").click();
}

function showStatus(msg, type = "info") {
  const el = document.getElementById("hub-status");
  if (!el) return;
  el.innerHTML = `<div class="alert alert--${type === "error" ? "error" : "success"}">${msg}</div>`;
  setTimeout(() => { el.innerHTML = ""; }, 4000);
}
