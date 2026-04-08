// ── Weekly report logic ───────────────────────────────────────
let weeklyData = null;

document.addEventListener("DOMContentLoaded", () => {
  initPage();

  // Try to pre-load current session data
  const existing = loadData();
  if (existing?.profile?.full_name) {
    weeklyData = existing;
    buildWeekSelector();
    goWeeklyPhase("phase-report");
  }

  setupWeeklyDropZone();
  applyLanguage(getCurrentLang());
});

function setupWeeklyDropZone() {
  const zone = document.getElementById("upload-zone");
  if (!zone) return;
  zone.addEventListener("dragover", e => { e.preventDefault(); zone.classList.add("drag-over"); });
  zone.addEventListener("dragleave", () => zone.classList.remove("drag-over"));
  zone.addEventListener("drop", e => {
    e.preventDefault(); zone.classList.remove("drag-over");
    handleWeeklyFiles(e.dataTransfer.files);
  });
}

function handleWeeklyFiles(fileList) {
  const files = Array.from(fileList).filter(f => f.name.endsWith(".json"));
  if (!files.length) return;

  // Merge all uploaded files (same logic as report page)
  const readers = files.map(f => new Promise((res, rej) => {
    const r = new FileReader();
    r.onload = e => { try { res(JSON.parse(e.target.result)); } catch { rej(); } };
    r.readAsText(f);
  }));

  Promise.all(readers).then(parsed => {
    const result = mergeInternshipFiles(parsed.filter(Boolean));
    if (!result.valid) {
      document.getElementById("upload-status").innerHTML =
        `<div class="alert alert--error mt-4">${t("error.no_files")}</div>`;
      return;
    }
    weeklyData = result.data;
    buildWeekSelector();
    goWeeklyPhase("phase-report");
  }).catch(() => {
    document.getElementById("upload-status").innerHTML =
      `<div class="alert alert--error mt-4">${t("error.no_files")}</div>`;
  });
}

function goWeeklyPhase(id) {
  document.querySelectorAll("#phase-upload, #phase-report").forEach(el => {
    el.classList.toggle("hidden", el.id !== id);
  });
}

function resetWeekly() {
  goWeeklyPhase("phase-upload");
}

// ── Week selector ─────────────────────────────────────────────
function getWeekKey(dateStr) {
  // ISO week start (Monday)
  const d = new Date(dateStr + "T12:00:00");
  const day = d.getDay() || 7;
  d.setDate(d.getDate() - day + 1);
  return d.toISOString().slice(0, 10);
}

function buildWeekSelector() {
  if (!weeklyData?.logs?.length) return;

  // Student label
  const p = weeklyData.profile;
  document.getElementById("student-label").textContent =
    [p?.full_name, p?.program, p?.cohort].filter(Boolean).join(" · ");

  // Collect unique weeks
  const weeks = [...new Set(weeklyData.logs.map(l => getWeekKey(l.date)))].sort().reverse();
  const sel = document.getElementById("week-select");
  sel.innerHTML = weeks.map(w => {
    const label = t("weekly.week_label") + " " + formatDate(w + "T12:00:00");
    return `<option value="${w}">${label}</option>`;
  }).join("");

  // Default: most recent week that has at least one log
  sel.value = weeks[0];
  renderWeek(weeks[0]);
}

// ── Render a week ─────────────────────────────────────────────
function renderWeek(weekStart) {
  if (!weeklyData) return;
  const logs = weeklyData.logs
    .filter(l => getWeekKey(l.date) === weekStart)
    .sort((a, b) => a.date.localeCompare(b.date));

  if (!logs.length) {
    document.getElementById("week-stats").innerHTML =
      `<p class="text-muted">${t("weekly.no_logs")}</p>`;
    return;
  }

  renderWeekStats(logs);
  renderWeekDays(logs);
  renderWeekActivity(logs);
  renderWeekMood(logs);
  renderWeekWins(logs);
  renderWeekObstacle(logs);
  renderWeekWrap(logs);
  renderWeekProjects(logs);
}

function renderWeekStats(logs) {
  const totalMins = logs.reduce((s, l) => s + (l.task_total_minutes || l.day_duration_minutes || 0), 0);
  const avgRating = logs.filter(l => l.day_rating).length
    ? (logs.reduce((s, l) => s + (l.day_rating || 0), 0) / logs.filter(l => l.day_rating).length).toFixed(1)
    : "—";

  document.getElementById("week-stats").innerHTML = [
    { val: formatDuration(totalMins), label: t("weekly.hours") },
    { val: logs.length, label: t("weekly.days") },
    { val: avgRating + " / 5", label: t("weekly.avg_rating") },
  ].map(s => `
    <div class="week-stat">
      <div class="week-stat-val">${escHtml(String(s.val))}</div>
      <div class="week-stat-label">${escHtml(s.label)}</div>
    </div>
  `).join("");
}

function renderWeekDays(logs) {
  const container = document.getElementById("week-days");
  const maxMins = Math.max(...logs.map(l => l.task_total_minutes || l.day_duration_minutes || 0), 1);
  // Stable segment order: follow the activity_types array index
  const actOrder = {};
  (weeklyData.activity_types || []).forEach((at, i) => { actOrder[at.type_id] = i; });
  const PX_PER_MIN = 1/5;
  const targetH = Math.max(Math.round(maxMins * PX_PER_MIN), 120);
  container.style.height = targetH + "px";

  container.innerHTML = logs.map(log => {
    const mins = log.task_total_minutes || log.day_duration_minutes || 0;
    const h = Math.max(Math.round((mins / maxMins) * (targetH - 8)), 2);
    const rating = log.day_rating || 3;
    const ratingColor = rating >= 4 ? "var(--color-chlorophyll-500)"
      : rating <= 2 ? "var(--danger)" : "var(--color-blue-400)";

    // Stack segments by activity type
    const byType = {};
    (log.tasks || []).forEach(t => {
      const tid = t.activity_type_id || "sys-gray";
      byType[tid] = (byType[tid] || 0) + (t.duration_minutes || 0);
    });
    const segments = Object.entries(byType)
      .sort(([a], [b]) => (actOrder[a] ?? 999) - (actOrder[b] ?? 999))
      .map(([tid, m]) => {
      const color = getActivityTypeColor(weeklyData, tid);
      return `<div style="flex:${m};background:${color};min-height:2px"></div>`;
    }).join("");

    const dateShort = log.date.slice(5); // MM-DD
    return `
      <div class="day-col">
        <div class="day-bar-wrap" style="height:${h}px;flex-direction:column-reverse;display:flex">
          ${segments}
        </div>
        <div class="day-rating-dot" style="background:${ratingColor}" title="${rating}/5"></div>
        <div class="day-header">${dateShort}</div>
      </div>`;
  }).join("");
}

function renderWeekActivity(logs) {
  const totals = {};
  logs.forEach(l => (l.tasks || []).forEach(task => {
    const tid = task.activity_type_id || "sys-gray";
    totals[tid] = (totals[tid] || 0) + (task.duration_minutes || 0);
  }));

  const slices = Object.entries(totals)
    .sort((a, b) => b[1] - a[1])
    .map(([tid, mins]) => ({
      label: getActivityTypeLabel(weeklyData, tid),
      value: mins,
      color: getActivityTypeColor(weeklyData, tid),
      sublabel: formatDuration(mins),
    }));

  buildPieChart(document.getElementById("week-activity"), slices);
}

function renderWeekMood(logs) {
  const container = document.getElementById("week-mood");
  container.innerHTML = logs.map(log => {
    const eod = log.day_rating || 0;
    const am  = log.morning_energy || 0;
    const dateShort = log.date.slice(5);
    const eodPct = (eod / 5) * 100;
    const amPct  = (am  / 5) * 100;
    const eodColor = eod >= 4 ? "var(--color-chlorophyll-500)" : eod <= 2 ? "var(--danger)" : "var(--color-blue-400)";
    const amColor  = am  >= 4 ? "var(--color-gold-500)"        : am  <= 2 ? "var(--danger)" : "var(--color-charcoal-200)";
    return `
      <div style="margin-bottom:var(--sp-3)">
        <div style="font-size:1.2rem;color:var(--text-subtle);margin-bottom:var(--sp-1)">${dateShort}</div>
        ${am ? `<div class="mood-row">
          <div style="width:11rem;font-size:1.2rem;color:var(--text-subtle)">${t("weekly.morning")}</div>
          <div class="mood-bar-track"><div class="mood-bar-fill" style="width:${amPct}%;background:${amColor}"></div></div>
          <div style="width:3rem;text-align:right;font-size:1.2rem">${am}/5</div>
        </div>` : ""}
        ${eod ? `<div class="mood-row" style="margin-top:var(--sp-1)">
          <div style="width:11rem;font-size:1.2rem;color:var(--text-subtle)">${t("weekly.evening")}</div>
          <div class="mood-bar-track"><div class="mood-bar-fill" style="width:${eodPct}%;background:${eodColor}"></div></div>
          <div style="width:3rem;text-align:right;font-size:1.2rem">${eod}/5</div>
        </div>` : ""}
      </div>`;
  }).join("");
}

function renderWeekWins(logs) {
  const wins = logs.filter(l => l.win).map(l => ({ date: l.date.slice(5), win: l.win }));
  document.getElementById("week-wins").innerHTML = wins.length
    ? wins.map(w => `<div class="win-item"><span style="color:var(--text-subtle);font-size:1.2rem;margin-right:var(--sp-2)">${w.date}</span>${escHtml(w.win)}</div>`).join("")
    : `<p class="text-muted">—</p>`;
}

function renderWeekObstacle(logs) {
  const card = document.getElementById("week-obstacle-card");
  const obstacles = logs.filter(l => l.obstacle).map(l => ({
    date: l.date.slice(5),
    obstacle: l.obstacle,
    response: l.obstacle_response,
  }));
  if (!obstacles.length) { card.classList.add("hidden"); return; }
  card.classList.remove("hidden");
  document.getElementById("week-obstacle").innerHTML = obstacles.map(o => `
    <div style="margin-bottom:var(--sp-4)">
      <div style="font-size:1.2rem;color:var(--text-subtle);margin-bottom:var(--sp-1)">${o.date}</div>
      <div style="font-size:1.4rem">${escHtml(o.obstacle)}</div>
      ${o.response ? `<div style="font-size:1.3rem;color:var(--text-muted);margin-top:var(--sp-1)">→ ${escHtml(o.response)}</div>` : ""}
    </div>`).join("");
}

function renderWeekWrap(logs) {
  const wrap = logs.find(l => l.weekly_wrap && (l.weekly_wrap.highlight || l.weekly_wrap.learning || l.weekly_wrap.change))?.weekly_wrap;
  const container = document.getElementById("week-wrap");
  if (!wrap) {
    container.innerHTML = `<p class="text-muted">${t("weekly.no_wrap")}</p>`;
    return;
  }
  container.innerHTML = [
    wrap.highlight && { label: t("dashboard.weekly_highlight"), text: wrap.highlight },
    wrap.learning  && { label: t("dashboard.weekly_learning"),  text: wrap.learning },
    wrap.change    && { label: t("dashboard.weekly_change"),     text: wrap.change },
  ].filter(Boolean).map(item => `
    <div style="margin-bottom:var(--sp-4)">
      <div style="font-size:1.2rem;font-weight:600;text-transform:uppercase;letter-spacing:0.05em;color:var(--text-subtle);margin-bottom:var(--sp-1)">${escHtml(item.label)}</div>
      <div style="font-size:1.4rem">${escHtml(item.text)}</div>
    </div>`).join("");
}

function renderWeekProjects(logs) {
  const card = document.getElementById("week-projects-card");
  if (weeklyData.pathway !== "hub") { card.classList.add("hidden"); return; }

  // Collect latest project status update per project this week
  const statusMap = {};
  logs.forEach(l => (l.project_status_updates || []).forEach(u => {
    if (u.notes || u.status !== "active") statusMap[u.project_id] = u;
  }));

  if (!Object.keys(statusMap).length) { card.classList.add("hidden"); return; }
  card.classList.remove("hidden");

  document.getElementById("week-projects").innerHTML =
    Object.entries(statusMap).map(([pid, u]) => {
      const proj = weeklyData.projects?.find(p => p.project_id === pid);
      return `<div class="project-status-row">
        <div style="font-weight:500;margin-bottom:var(--sp-1)">${escHtml(proj?.project_name || pid)}</div>
        ${u.notes ? `<div style="font-size:1.4rem;color:var(--text-muted)">${escHtml(u.notes)}</div>` : ""}
      </div>`;
    }).join("");
}
