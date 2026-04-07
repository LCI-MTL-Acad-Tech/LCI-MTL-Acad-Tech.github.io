// ============================================================
// report.js — Report page: upload, merge, reflection, dashboard
// ============================================================

let mergedData = null;
let uploadedFiles = [];

// ── Init ──────────────────────────────────────────────────────
document.addEventListener("DOMContentLoaded", () => {
  initPage();
  setupDropZone();

  // Pre-load current session data if available
  const existing = loadData();
  if (existing && existing.profile?.full_name) {
    uploadedFiles = [existing];
    renderFileList([{ name: "session_actuelle.json", ok: true }]);
    document.getElementById("proceed-btn").classList.remove("hidden");
    mergedData = existing;
  }

  applyLanguage(getCurrentLang());
});

// ── Phase navigation ──────────────────────────────────────────
function goToPhase(id) {
  document.querySelectorAll('[id^="phase-"]').forEach(p => p.classList.add("hidden"));
  document.getElementById(id)?.classList.remove("hidden");
  window.scrollTo({ top: 0, behavior: "smooth" });
}

// ── File upload / drop zone ───────────────────────────────────
function setupDropZone() {
  const zone = document.getElementById("upload-zone");
  if (!zone) return;
  zone.addEventListener("dragover", e => { e.preventDefault(); zone.classList.add("drag-active"); });
  zone.addEventListener("dragleave", () => zone.classList.remove("drag-active"));
  zone.addEventListener("drop", e => {
    e.preventDefault();
    zone.classList.remove("drag-active");
    handleFiles(e.dataTransfer.files);
  });
}

function handleFiles(fileList) {
  const files = Array.from(fileList).filter(f => f.name.endsWith(".json"));
  if (!files.length) return;

  const fileInfos = [];
  const parsed = [];
  let loaded = 0;

  files.forEach(file => {
    const reader = new FileReader();
    reader.onload = e => {
      try {
        const data = JSON.parse(e.target.result);
        parsed.push(data);
        fileInfos.push({ name: file.name, ok: true });
      } catch {
        fileInfos.push({ name: file.name, ok: false, error: "JSON invalide / Invalid JSON" });
      }
      loaded++;
      if (loaded === files.length) {
        // Combine with any existing session data
        const all = [...parsed];
        const existing = loadData();
        if (existing && !all.find(f => f.meta?.student_uuid === existing.meta?.student_uuid)) {
          // Only add if same student — checked in merge
        }
        uploadedFiles = all;
        renderFileList(fileInfos);
        validateAndMerge(all);
      }
    };
    reader.readAsText(file);
  });
}

function renderFileList(fileInfos) {
  const list = document.getElementById("upload-files-list");
  list.classList.remove("hidden");
  list.innerHTML = fileInfos.map(f => `
    <div class="upload-file-item">
      <span class="upload-file-status">${f.ok ? "✓" : "✕"}</span>
      <span style="flex:1">${escHtml(f.name)}</span>
      ${f.error ? `<span class="text-muted" style="font-size:1.2rem">${f.error}</span>` : ""}
    </div>
  `).join("");
}

function validateAndMerge(files) {
  const errEl = document.getElementById("upload-errors");
  const conflictEl = document.getElementById("upload-conflicts");
  errEl.classList.add("hidden");
  errEl.innerHTML = "";
  conflictEl.classList.add("hidden");
  conflictEl.innerHTML = "";

  const result = mergeInternshipFiles(files);

  if (result.errors.length) {
    errEl.classList.remove("hidden");
    errEl.innerHTML = result.errors.map(e =>
      `<div class="alert alert--error" style="margin-top:var(--sp-3)">${t(e)}</div>`
    ).join("");
    return;
  }

  if (result.warnings.length) {
    errEl.classList.remove("hidden");
    errEl.innerHTML = result.warnings.map(w =>
      `<div class="alert alert--warning" style="margin-top:var(--sp-3)">${t("report.validation_warning_time")} (${w.date})</div>`
    ).join("");
  }

  if (result.conflicts.length) {
    conflictEl.classList.remove("hidden");
    conflictEl.innerHTML = result.conflicts.map(c => `
      <div class="alert alert--warning" style="margin-top:var(--sp-3)">
        <div>${t("report.validation_conflict")} — ${c.log_id}</div>
        <div class="flex gap-2 mt-2">
          <button class="btn btn--secondary btn--sm" onclick="resolveConflict('${c.log_id}','a')" data-i18n="report.keep_newer"></button>
          <button class="btn btn--ghost btn--sm" onclick="resolveConflict('${c.log_id}','b')" data-i18n="report.keep_older"></button>
        </div>
      </div>
    `).join("");
    applyLanguage(getCurrentLang());
  }

  mergedData = result.data;

  // Success message
  const okDiv = document.createElement("div");
  okDiv.className = "alert alert--success";
  okDiv.style.marginTop = "var(--sp-3)";
  const logCount = mergedData.logs.length;
  const lang = getCurrentLang();
  okDiv.textContent = t("report.validation_ok") + ` — ${logCount} ${lang === "fr-CA" ? "journaux fusionnés" : "logs merged"}`;
  document.getElementById("upload-files-list").after(okDiv);

  document.getElementById("proceed-btn").classList.remove("hidden");
}

function resolveConflict(logId, keep) {
  // UI-only: just dismiss. Merge already kept highest revision.
  document.getElementById("upload-conflicts").classList.add("hidden");
}

// ── Reflection phase ──────────────────────────────────────────
function proceedToReflection() {
  if (!mergedData) return;
  goToPhase("phase-reflection");
  populateReflectionForms();
}

function populateReflectionForms() {
  const r = mergedData.reflection || {};

  setField("r-reality",        r.internship_reality_vs_expectation);
  setField("r-significant",    Array.isArray(r.significant_work) ? r.significant_work.join("\n") : r.significant_work);
  setField("r-proud",          r.proud_moment);
  setField("r-failure",        r.failure_moment);
  setField("r-failure-lesson", r.failure_lesson);
  setField("r-env",            r.professional_environment_lesson);
  setField("r-supervisor",     r.supervisor_relationship);
  setField("r-advice",         r.advice_to_next_student);
  setField("r-different",      r.would_do_differently);
  setField("r-comments",       r.additional_comments);
  setField("r-future-direction", r.future_plans?.career_direction_impact);
  setField("r-future-steps",     r.future_plans?.next_steps);
  setField("r-future-skills",
    Array.isArray(r.future_plans?.skills_to_pursue)
      ? r.future_plans.skills_to_pursue.join(", ")
      : r.future_plans?.skills_to_pursue
  );
  setField("r-actual-end", r.actual_end_date);
  if (r.total_weeks) document.getElementById("r-weeks").value = r.total_weeks;

  renderToolsReflection(r.tools_reflection || []);
  renderCollabAppreciation(r.collaborator_appreciation || []);

  if (mergedData.pathway === "hub" && mergedData.projects?.length) {
    document.getElementById("project-outcomes-card").classList.remove("hidden");
    renderProjectOutcomes(r.project_outcomes || []);
  }
}

function setField(id, val) {
  const el = document.getElementById(id);
  if (el && val != null && val !== "") el.value = val;
}

function renderToolsReflection(existing) {
  const list = document.getElementById("tools-reflection-list");
  const tools = mergedData.tools || [];
  if (!tools.length) {
    list.innerHTML = `<p class="text-muted" style="font-size:1.4rem">—</p>`;
    return;
  }
  const profLevels = ["none", "beginner", "intermediate", "advanced"];

  list.innerHTML = tools.map(tool => {
    const ex = existing.find(x => x.tool_id === tool.tool_id) || {};
    const startOpts = profLevels.map(l =>
      `<option value="${l}" ${ex.proficiency_start === l ? "selected" : ""} data-i18n="report.proficiency_${l}"></option>`
    ).join("");
    const endOpts = profLevels.map(l =>
      `<option value="${l}" ${ex.proficiency_end === l ? "selected" : ""} data-i18n="report.proficiency_${l}"></option>`
    ).join("");

    return `
      <div class="repeatable-block" style="margin-bottom:var(--sp-3)">
        <div style="font-size:1.6rem;font-weight:500;margin-bottom:var(--sp-3)">${escHtml(tool.name)}
          ${tool.category ? `<span class="text-muted" style="font-weight:400;font-size:1.3rem"> · ${escHtml(tool.category)}</span>` : ""}
        </div>
        <div class="form-row">
          <div class="form-group" style="margin:0">
            <label data-i18n="report.tools_proficiency_start"></label>
            <select data-tool="${tool.tool_id}" data-field="proficiency_start">${startOpts}</select>
          </div>
          <div class="form-group" style="margin:0">
            <label data-i18n="report.tools_proficiency_end"></label>
            <select data-tool="${tool.tool_id}" data-field="proficiency_end">${endOpts}</select>
          </div>
        </div>
        <div class="form-group" style="margin-top:var(--sp-3);margin-bottom:0">
          <label data-i18n="report.tools_notes"></label>
          <textarea rows="2" data-tool="${tool.tool_id}" data-field="notes">${escHtml(ex.notes || "")}</textarea>
        </div>
      </div>
    `;
  }).join("");
  applyLanguage(getCurrentLang());
}

function renderCollabAppreciation(existing) {
  const list = document.getElementById("collab-appreciation-list");
  const people = mergedData.people || [];
  if (!people.length) {
    list.innerHTML = `<p class="text-muted" style="font-size:1.4rem">—</p>`;
    return;
  }
  list.innerHTML = people.map(p => {
    const ex = existing.find(x => x.person_id === p.person_id) || {};
    return `
      <div class="form-group">
        <label>
          ${escHtml(p.name)}
          ${p.role_type ? `<span class="text-muted" style="font-weight:400"> · ${escHtml(p.role_type)}</span>` : ""}
        </label>
        <textarea rows="2" data-person="${p.person_id}"
          data-i18n-placeholder="report.collab_placeholder"
          placeholder="">${escHtml(ex.appreciation || "")}</textarea>
      </div>
    `;
  }).join("");
  applyLanguage(getCurrentLang());
}

function renderProjectOutcomes(existing) {
  const list = document.getElementById("project-outcomes-list");
  list.innerHTML = (mergedData.projects || []).map(p => {
    const ex = existing.find(x => x.project_id === p.project_id) || {};
    return `
      <div class="project-outcome-card">
        <h5 style="margin-bottom:var(--sp-4)">${escHtml(p.project_name)}
          <span class="text-muted" style="font-weight:400;font-size:1.4rem">${p.client_name ? " · " + escHtml(p.client_name) : ""}</span>
        </h5>
        <div class="form-group">
          <label style="display:flex;align-items:center;gap:var(--sp-2);cursor:pointer">
            <input type="checkbox" data-proj="${p.project_id}" data-field="delivered" ${ex.delivered ? "checked" : ""}>
            <span data-i18n="report.project_delivered"></span>
          </label>
        </div>
        <div class="form-group">
          <label data-i18n="report.project_final_impression"></label>
          <textarea rows="2" data-proj="${p.project_id}" data-field="final_impression">${escHtml(ex.final_impression || "")}</textarea>
        </div>
        <div class="form-group">
          <label data-i18n="report.project_client_feedback"></label>
          <textarea rows="2" data-proj="${p.project_id}" data-field="client_feedback_summary">${escHtml(ex.client_feedback_summary || "")}</textarea>
        </div>
        <div class="form-group">
          <label data-i18n="report.project_contribution"></label>
          <textarea rows="2" data-proj="${p.project_id}" data-field="personal_contribution">${escHtml(ex.personal_contribution || "")}</textarea>
        </div>
        <div class="form-group">
          <label data-i18n="report.project_collab_reflection"></label>
          <textarea rows="2" data-proj="${p.project_id}" data-field="collaboration_reflection">${escHtml(ex.collaboration_reflection || "")}</textarea>
        </div>
        <div class="form-group">
          <label data-i18n="report.project_appreciation"></label>
          <textarea rows="2" data-proj="${p.project_id}" data-field="appreciation_notes">${escHtml(ex.appreciation_notes || "")}</textarea>
        </div>
      </div>
    `;
  }).join("");
  applyLanguage(getCurrentLang());
}

// ── Competency blocks ─────────────────────────────────────────
function addCompetencyBlock(type) {
  const listId = `competencies-${type}-list`;
  const list = document.getElementById(listId);
  const id = generateUUID();
  const block = document.createElement("div");
  block.className = "repeatable-block";
  block.dataset.id = id;

  let fields = "";
  if (type === "helpful") {
    fields = `
      <div class="form-group">
        <label data-i18n="report.competency_field"></label>
        <input type="text" class="comp-field">
      </div>
      <div class="form-group">
        <label data-i18n="report.competency_context"></label>
        <input type="text" class="comp-context">
      </div>
      <div class="form-group">
        <label data-i18n="report.competency_how"></label>
        <textarea rows="2" class="comp-how"></textarea>
      </div>
    `;
  } else if (type === "gaps") {
    fields = `
      <div class="form-group">
        <label data-i18n="report.competency_field"></label>
        <input type="text" class="comp-field">
      </div>
      <div class="form-group">
        <label data-i18n="report.gap_how"></label>
        <textarea rows="2" class="comp-how"></textarea>
      </div>
      <div class="form-group">
        <label data-i18n="report.gap_impact"></label>
        <textarea rows="2" class="comp-impact"></textarea>
      </div>
    `;
  } else {
    fields = `
      <div class="form-group">
        <label data-i18n="report.improve_what"></label>
        <input type="text" class="comp-what">
      </div>
      <div class="form-group">
        <label data-i18n="report.improve_how"></label>
        <textarea rows="2" class="comp-how"></textarea>
      </div>
      <div class="form-group">
        <div class="flex gap-6">
          <label style="cursor:pointer;display:flex;align-items:center;gap:var(--sp-2)">
            <input type="radio" name="when-${id}" value="before" checked>
            <span data-i18n="report.improve_when_before"></span>
          </label>
          <label style="cursor:pointer;display:flex;align-items:center;gap:var(--sp-2)">
            <input type="radio" name="when-${id}" value="during">
            <span data-i18n="report.improve_when_during"></span>
          </label>
        </div>
      </div>
    `;
  }

  block.innerHTML = `
    <button class="btn btn--icon btn--sm repeatable-block-remove"
      onclick="this.closest('.repeatable-block').remove()" title="${t('action.delete')}">✕</button>
    ${fields}
  `;
  list.appendChild(block);
  applyLanguage(getCurrentLang());
}

function toggleAccordion(btn) {
  const item = btn.closest(".accordion-item");
  item.classList.toggle("open");
}

// ── Collect reflection data ───────────────────────────────────
function collectReflection() {
  return {
    actual_end_date:                    document.getElementById("r-actual-end")?.value || null,
    total_weeks:                        parseInt(document.getElementById("r-weeks")?.value) || 0,
    internship_reality_vs_expectation:  getField("r-reality"),
    significant_work:                   getField("r-significant").split("\n").filter(Boolean),
    proud_moment:                       getField("r-proud"),
    failure_moment:                     getField("r-failure"),
    failure_lesson:                     getField("r-failure-lesson"),
    professional_environment_lesson:    getField("r-env"),
    supervisor_relationship:            getField("r-supervisor"),
    advice_to_next_student:             getField("r-advice"),
    would_do_differently:               getField("r-different"),
    additional_comments:                getField("r-comments"),
    tools_reflection:                   collectToolsReflectionData(),
    collaborator_appreciation:          collectCollabData(),
    competencies:                       collectCompetencies(),
    project_outcomes:                   collectProjectOutcomesData(),
    future_plans: {
      career_direction_impact: getField("r-future-direction"),
      next_steps:              getField("r-future-steps"),
      skills_to_pursue:        getField("r-future-skills").split(",").map(s => s.trim()).filter(Boolean),
    },
  };
}

function getField(id) {
  return document.getElementById(id)?.value?.trim() || "";
}

function collectToolsReflectionData() {
  return (mergedData.tools || []).map(tool => ({
    tool_id:            tool.tool_id,
    proficiency_start:  document.querySelector(`[data-tool="${tool.tool_id}"][data-field="proficiency_start"]`)?.value || "none",
    proficiency_end:    document.querySelector(`[data-tool="${tool.tool_id}"][data-field="proficiency_end"]`)?.value || "none",
    notes:              document.querySelector(`[data-tool="${tool.tool_id}"][data-field="notes"]`)?.value?.trim() || "",
  }));
}

function collectCollabData() {
  return (mergedData.people || [])
    .map(p => ({
      person_id:    p.person_id,
      appreciation: document.querySelector(`[data-person="${p.person_id}"]`)?.value?.trim() || "",
    }))
    .filter(x => x.appreciation);
}

function collectProjectOutcomesData() {
  return (mergedData.projects || []).map(p => ({
    project_id:              p.project_id,
    delivered:               document.querySelector(`[data-proj="${p.project_id}"][data-field="delivered"]`)?.checked || false,
    final_impression:        document.querySelector(`[data-proj="${p.project_id}"][data-field="final_impression"]`)?.value?.trim() || "",
    client_feedback_summary: document.querySelector(`[data-proj="${p.project_id}"][data-field="client_feedback_summary"]`)?.value?.trim() || "",
    personal_contribution:   document.querySelector(`[data-proj="${p.project_id}"][data-field="personal_contribution"]`)?.value?.trim() || "",
    collaboration_reflection:document.querySelector(`[data-proj="${p.project_id}"][data-field="collaboration_reflection"]`)?.value?.trim() || "",
    appreciation_notes:      document.querySelector(`[data-proj="${p.project_id}"][data-field="appreciation_notes"]`)?.value?.trim() || "",
  }));
}

function collectCompetencies() {
  const helpful = Array.from(document.querySelectorAll("#competencies-helpful-list .repeatable-block")).map(b => ({
    competency:       b.querySelector(".comp-field")?.value?.trim() || "",
    course_or_context:b.querySelector(".comp-context")?.value?.trim() || "",
    how_it_helped:    b.querySelector(".comp-how")?.value?.trim() || "",
  })).filter(x => x.competency);

  const gaps = Array.from(document.querySelectorAll("#competencies-gaps-list .repeatable-block")).map(b => ({
    competency:       b.querySelector(".comp-field")?.value?.trim() || "",
    how_it_manifested:b.querySelector(".comp-how")?.value?.trim() || "",
    impact:           b.querySelector(".comp-impact")?.value?.trim() || "",
  })).filter(x => x.competency);

  const improvements = Array.from(document.querySelectorAll("#competencies-improve-list .repeatable-block")).map(b => ({
    what: b.querySelector(".comp-what")?.value?.trim() || "",
    when: b.querySelector(`input[type="radio"]:checked`)?.value || "before",
    how:  b.querySelector(".comp-how")?.value?.trim() || "",
  })).filter(x => x.what);

  return { helpful, gaps, improvements };
}

// ── Generate dashboard ────────────────────────────────────────
function generateDashboard() {
  mergedData.reflection = collectReflection();

  // Flag settings deviation
  const snap = mergedData.meta?.settings_snapshot || {};
  if (snap.grayzone_threshold_pct !== undefined &&
      snap.grayzone_threshold_pct !== SETTINGS.GRAYZONE_THRESHOLD_PCT) {
    mergedData.meta.settings_snapshot.defaults_modified = true;
  }

  goToPhase("phase-dashboard");
  buildDashboard();
}

// ── Dashboard ─────────────────────────────────────────────────
function buildDashboard() {
  const data = mergedData;
  const logs = data.logs || [];

  buildStatGrid(logs, data);
  buildNav();
  buildTimeline(logs, data);
  buildBreakdown(logs, data);
  buildModality(logs);
  buildToolsChart(logs, data);
  buildLessonsCloud(logs);
  buildReflectionSection(data);

  // Name
  const nameEl = document.getElementById("dashboard-name");
  if (nameEl) nameEl.textContent = data.profile?.full_name || t("dashboard.title");

  // Settings note
  if (data.meta?.settings_snapshot?.defaults_modified) {
    const note = document.createElement("div");
    note.className = "alert alert--warning mb-4";
    note.textContent = t("dashboard.settings_note") +
      ` (grayzone threshold: ${data.meta.settings_snapshot.grayzone_threshold_pct}%)`;
    document.getElementById("stat-grid").after(note);
  }
}

function buildStatGrid(logs, data) {
  const totalDays = logs.length;
  const totalMinutes = logs.reduce((s, l) => s + (l.task_total_minutes || 0), 0);
  const avgRating = logs.length
    ? (logs.reduce((s, l) => s + (l.day_rating || 3), 0) / logs.length).toFixed(1)
    : "—";

  // Top activity by time
  const actMins = {};
  logs.forEach(l => (l.tasks || []).forEach(task => {
    const key = task.activity_type_id || "sys-gray";
    actMins[key] = (actMins[key] || 0) + (task.duration_minutes || 0);
  }));
  const topId = Object.entries(actMins).sort((a, b) => b[1] - a[1])[0]?.[0];
  const topLabel = topId ? getActivityTypeLabel(data, topId) : "—";

  document.getElementById("stat-grid").innerHTML = [
    { val: totalDays,               label: t("dashboard.total_days") },
    { val: formatDuration(totalMinutes), label: t("dashboard.total_hours") },
    { val: avgRating + " / 5",      label: t("dashboard.avg_rating") },
    { val: topLabel,                label: t("dashboard.top_activity") },
  ].map(s => `
    <div class="stat-tile">
      <div class="stat-val">${escHtml(String(s.val))}</div>
      <div class="stat-label">${escHtml(s.label)}</div>
    </div>
  `).join("");
}

function buildNav() {
  const sections = [
    { id: "section-timeline",   key: "dashboard.section_timeline" },
    { id: "section-breakdown",  key: "dashboard.section_breakdown" },
    { id: "section-modality",   key: "dashboard.section_modality" },
    { id: "section-tools",      key: "dashboard.section_tools" },
    { id: "section-lessons",    key: "dashboard.section_lessons" },
    { id: "section-reflection", key: "dashboard.section_reflection" },
  ];
  const nav = document.getElementById("report-nav");
  nav.innerHTML = sections.map((s, i) =>
    `<button class="report-nav-btn ${i === 0 ? "active" : ""}"
      onclick="switchSection('${s.id}', this)" data-i18n="${s.key}"></button>`
  ).join("");
  applyLanguage(getCurrentLang());
}

function switchSection(sectionId, btn) {
  document.querySelectorAll(".report-section").forEach(s => s.classList.remove("active"));
  document.querySelectorAll(".report-nav-btn").forEach(b => b.classList.remove("active"));
  document.getElementById(sectionId)?.classList.add("active");
  btn.classList.add("active");
}

// ── Timeline chart ────────────────────────────────────────────
function buildTimeline(logs, data) {
  const chart   = document.getElementById("timeline-chart");
  const legend  = document.getElementById("timeline-legend");
  const gzChart = document.getElementById("grayzone-chart");

  if (!logs.length) {
    chart.innerHTML = `<p class="text-muted" style="padding:var(--sp-4)">—</p>`;
    return;
  }

  const maxMinutes = Math.max(
    ...logs.map(l => l.day_duration_minutes || l.task_total_minutes || 0), 1
  );

  // Build activity lookup
  const actMap = {};
  (data.activity_types || []).forEach(at => {
    actMap[at.type_id] = {
      color: at.color,
      label: at.label_key ? t(at.label_key) : at.label,
    };
  });

  // Main timeline
  chart.innerHTML = logs.map(log => {
    const dayTotal = log.day_duration_minutes || log.task_total_minutes || 0;
    const colHeightPct = dayTotal ? Math.max((dayTotal / maxMinutes) * 100, 2) : 2;

    // Group minutes by activity type
    const byType = {};
    (log.tasks || []).forEach(task => {
      const tid = task.activity_type_id || "sys-gray";
      byType[tid] = (byType[tid] || 0) + (task.duration_minutes || 0);
    });
    if ((log.grayzone_minutes || 0) > 0) {
      byType["sys-gray"] = (byType["sys-gray"] || 0) + log.grayzone_minutes;
    }

    const segments = Object.entries(byType).map(([tid, mins]) => {
      const color = actMap[tid]?.color || "#9ca3a5";
      const segPct = dayTotal ? (mins / dayTotal) * 100 : 0;
      return `<div class="timeline-segment"
        style="flex:${segPct};background:${color};min-height:2px"
        title="${actMap[tid]?.label || tid}: ${mins}min"></div>`;
    }).join("");

    // Use day rating as opacity signal
    const opacity = 0.35 + ((log.day_rating || 3) / 5) * 0.65;

    return `
      <div style="display:flex;flex-direction:column;align-items:center;flex:1;min-width:1.4rem;max-width:3.2rem;">
        <div class="timeline-col" style="height:${colHeightPct}%;opacity:${opacity}">
          ${segments}
        </div>
        <div class="timeline-date">${log.date.slice(5)}</div>
      </div>
    `;
  }).join("");

  // Legend — only types actually used
  const usedIds = new Set();
  logs.forEach(l => {
    (l.tasks || []).forEach(t => usedIds.add(t.activity_type_id || "sys-gray"));
    if ((l.grayzone_minutes || 0) > 0) usedIds.add("sys-gray");
  });
  legend.innerHTML = [...usedIds].map(tid => {
    const at = actMap[tid];
    if (!at) return "";
    return `<div class="legend-item">
      <div class="legend-swatch" style="background:${at.color}"></div>
      <span>${escHtml(at.label)}</span>
    </div>`;
  }).join("");

  // Grayzone evolution chart
  const maxGzPct = 100;
  gzChart.innerHTML = logs.map(log => {
    const pct = log.day_duration_minutes
      ? Math.min(Math.round(((log.grayzone_minutes || 0) / log.day_duration_minutes) * 100), 100)
      : 0;
    const over = pct > SETTINGS.GRAYZONE_THRESHOLD_PCT;
    const color = over ? "var(--danger)" : "var(--color-chlorophyll-500)";
    return `
      <div style="display:flex;flex-direction:column;align-items:center;flex:1;min-width:1.4rem;max-width:3.2rem;">
        <div style="width:100%;flex:1;display:flex;align-items:flex-end;">
          <div style="width:100%;height:${pct}%;background:${color};
            border-radius:2px 2px 0 0;min-height:${pct > 0 ? 2 : 0}px;
            transition:height var(--dur-slow)" title="${pct}%"></div>
        </div>
        <div class="timeline-date">${log.date.slice(5)}</div>
      </div>
    `;
  }).join("");
}

// ── Breakdown chart ───────────────────────────────────────────
function buildBreakdown(logs, data) {
  const container = document.getElementById("breakdown-chart");
  const totals = {};
  let grandTotal = 0;

  logs.forEach(l => {
    (l.tasks || []).forEach(task => {
      const tid = task.activity_type_id || "sys-gray";
      totals[tid] = (totals[tid] || 0) + (task.duration_minutes || 0);
      grandTotal += (task.duration_minutes || 0);
    });
  });

  if (!grandTotal) { container.innerHTML = `<p class="text-muted">—</p>`; return; }

  container.innerHTML = Object.entries(totals)
    .sort((a, b) => b[1] - a[1])
    .map(([tid, mins]) => {
      const at = data.activity_types?.find(x => x.type_id === tid);
      const label = at ? (at.label_key ? t(at.label_key) : at.label) : tid;
      const color = at?.color || "#9ca3a5";
      const pct = Math.round((mins / grandTotal) * 100);
      return `
        <div class="tool-bar" style="margin-bottom:var(--sp-3)">
          <div style="width:16rem;font-size:1.4rem;font-weight:500;flex-shrink:0">${escHtml(label)}</div>
          <div class="tool-bar-track">
            <div class="tool-bar-fill" style="width:${pct}%;background:${color}"></div>
          </div>
          <div style="width:10rem;text-align:right;font-size:1.3rem;color:var(--text-muted);flex-shrink:0">
            ${formatDuration(mins)} · ${pct}%
          </div>
        </div>
      `;
    }).join("");
}

// ── Tools chart ───────────────────────────────────────────────
function buildToolsChart(logs, data) {
  const container = document.getElementById("tools-chart");
  const toolMins = {};

  logs.forEach(l => {
    (l.tasks || []).forEach(task => {
      (task.tool_ids || []).forEach(tid => {
        toolMins[tid] = (toolMins[tid] || 0) + (task.duration_minutes || 0);
      });
    });
  });

  const entries = Object.entries(toolMins).sort((a, b) => b[1] - a[1]);
  if (!entries.length) { container.innerHTML = `<p class="text-muted">—</p>`; return; }

  const maxMins = entries[0][1] || 1;
  const reflection = data.reflection?.tools_reflection || [];
  const profLabels = {
    none:         "—",
    beginner:     t("report.proficiency_beginner"),
    intermediate: t("report.proficiency_intermediate"),
    advanced:     t("report.proficiency_advanced"),
  };

  container.innerHTML = entries.map(([tid, mins]) => {
    const tool = data.tools?.find(x => x.tool_id === tid);
    if (!tool) return "";
    const r = reflection.find(x => x.tool_id === tid) || {};
    const pct = Math.round((mins / maxMins) * 100);
    const progression = (r.proficiency_start && r.proficiency_end)
      ? `${profLabels[r.proficiency_start] || "—"} → ${profLabels[r.proficiency_end] || "—"}`
      : "";

    return `
      <div style="margin-bottom:var(--sp-5)">
        <div class="flex items-center justify-between mb-2">
          <div>
            <span style="font-size:1.5rem;font-weight:500">${escHtml(tool.name)}</span>
            ${tool.category ? `<span class="text-muted" style="font-size:1.3rem"> · ${escHtml(tool.category)}</span>` : ""}
          </div>
          <div style="text-align:right">
            <div style="font-size:1.4rem;color:var(--text-muted)">${formatDuration(mins)}</div>
            ${progression ? `<div style="font-size:1.2rem;color:var(--accent)">${escHtml(progression)}</div>` : ""}
          </div>
        </div>
        <div class="tool-bar-track">
          <div class="tool-bar-fill" style="width:${pct}%;background:var(--accent)"></div>
        </div>
        ${r.notes ? `<div style="font-size:1.3rem;color:var(--text-muted);margin-top:var(--sp-1)">${escHtml(r.notes)}</div>` : ""}
      </div>
    `;
  }).join("");
}

// ── Lessons cloud ─────────────────────────────────────────────
function buildLessonsCloud(logs) {
  const container = document.getElementById("lessons-cloud");
  const tagCount = {};

  logs.forEach(l => {
    (l.tasks || []).forEach(task => {
      // Lesson tags
      (task.lesson_tags || []).forEach(tag => {
        const key = tag.toLowerCase().trim();
        tagCount[key] = (tagCount[key] || 0) + 1;
      });
      // Also include any written learnings as presence signal
      if (task.learning?.trim()) {
        tagCount["✍ " + (task.learning.trim().slice(0, 40))] = 1;
      }
    });
  });

  const entries = Object.entries(tagCount).sort((a, b) => b[1] - a[1]);
  if (!entries.length) { container.innerHTML = `<p class="text-muted">—</p>`; return; }

  const maxCount = entries[0][1] || 1;
  const sizes = [1.2, 1.4, 1.6, 2, 2.4, 2.8];

  container.innerHTML = entries.slice(0, 60).map(([tag, count]) => {
    const sizeIdx = Math.min(Math.floor((count / maxCount) * (sizes.length - 1)), sizes.length - 1);
    const size = sizes[sizeIdx];
    const opacity = 0.5 + (count / maxCount) * 0.5;
    return `<span class="word-item" style="font-size:${size}rem;opacity:${opacity}">${escHtml(tag)}</span>`;
  }).join("");
}

// ── Reflection section ────────────────────────────────────────
function buildReflectionSection(data) {
  const r = data.reflection;
  if (!r) return;
  const container = document.getElementById("reflection-content");
  const lang = getCurrentLang();

  let html = "";

  const block = (labelKey, value) => {
    if (!value || (Array.isArray(value) && !value.length)) return "";
    const text = Array.isArray(value) ? value.map((v, i) => `${i + 1}. ${v}`).join("\n") : value;
    return `<div class="reflection-block">
      <div class="reflection-label">${t(labelKey)}</div>
      <div class="reflection-text">${escHtml(text)}</div>
    </div>`;
  };

  html += block("report.reality_vs_expectation",    r.internship_reality_vs_expectation);
  html += block("report.significant_work",           r.significant_work);
  html += block("report.proud_moment",               r.proud_moment);
  html += block("report.failure_moment",             r.failure_moment);
  html += block("report.failure_lesson",             r.failure_lesson);
  html += block("report.env_lesson",                 r.professional_environment_lesson);
  html += block("report.supervisor_rel",             r.supervisor_relationship);
  html += block("report.advice",                     r.advice_to_next_student);
  html += block("report.would_do_differently",       r.would_do_differently);

  // Competencies
  if (r.competencies) {
    const c = r.competencies;
    if (c.helpful?.length) {
      html += `<div class="reflection-block">
        <div class="reflection-label">${t("report.competencies_helpful")}</div>
        ${c.helpful.map(x => `
          <div class="competency-item">
            <div style="font-weight:500">${escHtml(x.competency)}</div>
            ${x.course_or_context ? `<div class="text-muted" style="font-size:1.3rem">${escHtml(x.course_or_context)}</div>` : ""}
            ${x.how_it_helped ? `<div style="font-size:1.4rem;margin-top:var(--sp-1)">${escHtml(x.how_it_helped)}</div>` : ""}
          </div>
        `).join("")}
      </div>`;
    }
    if (c.gaps?.length) {
      html += `<div class="reflection-block">
        <div class="reflection-label">${t("report.competencies_gaps")}</div>
        ${c.gaps.map(x => `
          <div class="competency-item">
            <div style="font-weight:500">${escHtml(x.competency)}</div>
            ${x.how_it_manifested ? `<div style="font-size:1.4rem;margin-top:var(--sp-1)">${escHtml(x.how_it_manifested)}</div>` : ""}
            ${x.impact ? `<div class="text-muted" style="font-size:1.3rem">${escHtml(x.impact)}</div>` : ""}
          </div>
        `).join("")}
      </div>`;
    }
    if (c.improvements?.length) {
      html += `<div class="reflection-block">
        <div class="reflection-label">${t("report.competencies_improve")}</div>
        ${c.improvements.map(x => `
          <div class="competency-item">
            <div style="font-weight:500">${escHtml(x.what)}
              <span class="tag" style="margin-left:var(--sp-2);font-size:1.1rem">
                ${x.when === "before" ? t("report.improve_when_before") : t("report.improve_when_during")}
              </span>
            </div>
            ${x.how ? `<div style="font-size:1.4rem;margin-top:var(--sp-1)">${escHtml(x.how)}</div>` : ""}
          </div>
        `).join("")}
      </div>`;
    }
  }

  // Future
  if (r.future_plans) {
    const f = r.future_plans;
    html += block("report.future_direction",  f.career_direction_impact);
    html += block("report.future_next_steps", f.next_steps);
    if (f.skills_to_pursue?.length) {
      html += block("report.future_skills", f.skills_to_pursue.join(", "));
    }
  }

  // Collaborator appreciation (toggle)
  if (r.collaborator_appreciation?.length) {
    const shown = { value: false };
    html += `<div class="reflection-block" id="collab-section">
      <div class="reflection-label">${t("report.collab_title")}</div>
      <button class="btn btn--ghost btn--sm mb-4" onclick="toggleCollab()" id="collab-toggle"
        data-i18n="dashboard.show_appreciation"></button>
      <div id="collab-content" style="display:none">
        ${r.collaborator_appreciation.map(a => {
          const person = data.people?.find(x => x.person_id === a.person_id);
          return `<div class="competency-item">
            <div style="font-weight:500">${escHtml(person?.name || a.person_id)}</div>
            <div style="font-size:1.4rem;margin-top:var(--sp-1)">${escHtml(a.appreciation)}</div>
          </div>`;
        }).join("")}
      </div>
    </div>`;
  }

  // Project outcomes
  if (r.project_outcomes?.length) {
    html += `<div class="reflection-block">
      <div class="reflection-label">${t("report.project_outcomes_title")}</div>
      ${r.project_outcomes.map(po => {
        const proj = data.projects?.find(x => x.project_id === po.project_id);
        return `<div class="project-outcome-card">
          <h5 style="margin-bottom:var(--sp-3)">${escHtml(proj?.project_name || po.project_id)}
            ${po.delivered ? ` <span class="tag" style="background:var(--success);color:white">✓</span>` : ""}
          </h5>
          ${po.final_impression       ? `<div class="reflection-text mb-4">${escHtml(po.final_impression)}</div>` : ""}
          ${po.personal_contribution  ? `<div class="reflection-text mb-4">${escHtml(po.personal_contribution)}</div>` : ""}
          ${po.collaboration_reflection ? `<div class="reflection-text">${escHtml(po.collaboration_reflection)}</div>` : ""}
        </div>`;
      }).join("")}
    </div>`;
  }

  if (r.additional_comments) html += block("report.comments", r.additional_comments);

  container.innerHTML = html || `<p class="text-muted">—</p>`;
  applyLanguage(getCurrentLang());
}

function toggleCollab() {
  const content = document.getElementById("collab-content");
  const btn = document.getElementById("collab-toggle");
  const hidden = content.style.display === "none";
  content.style.display = hidden ? "block" : "none";
  btn.setAttribute("data-i18n", hidden ? "dashboard.hide_appreciation" : "dashboard.show_appreciation");
  btn.textContent = t(hidden ? "dashboard.hide_appreciation" : "dashboard.show_appreciation");
}

// ── Utility ───────────────────────────────────────────────────
function escHtml(str) {
  if (!str) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

// ── Modality breakdown ────────────────────────────────────────
function buildModality(logs) {
  const container = document.getElementById("modality-chart");
  if (!container) return;

  let onsite = 0, remote = 0, both = 0, unspecified = 0;
  logs.forEach(l => {
    const o = l.modality_onsite || false;
    const r = l.modality_remote || false;
    if (o && r)      both++;
    else if (o)      onsite++;
    else if (r)      remote++;
    else             unspecified++;
  });

  const total = logs.length || 1;
  const bars = [
    { key: "dashboard.modality_onsite",      val: onsite,      color: "var(--color-blue-500)" },
    { key: "dashboard.modality_remote",      val: remote,      color: "var(--color-cobalt-500)" },
    { key: "dashboard.modality_both",        val: both,        color: "var(--color-chlorophyll-500)" },
    { key: "dashboard.modality_unspecified", val: unspecified, color: "var(--color-charcoal-200)" },
  ];

  container.innerHTML = bars.map(b => {
    const pct = Math.round((b.val / total) * 100);
    return `
      <div class="tool-bar" style="margin-bottom:var(--sp-4)">
        <div style="width:18rem;font-size:1.4rem;font-weight:500;flex-shrink:0">${t(b.key)}</div>
        <div class="tool-bar-track">
          <div class="tool-bar-fill" style="width:${pct}%;background:${b.color}"></div>
        </div>
        <div style="width:8rem;text-align:right;font-size:1.3rem;color:var(--text-muted);flex-shrink:0">
          ${b.val} j · ${pct}%
        </div>
      </div>
    `;
  }).join("");

  // Dot-per-day calendar strip
  const calEl = document.getElementById("modality-calendar");
  if (!calEl) return;
  calEl.innerHTML = logs.map(l => {
    const o = l.modality_onsite || false;
    const r = l.modality_remote || false;
    let color = "var(--color-charcoal-100)";
    let title = t("dashboard.modality_unspecified");
    if (o && r)  { color = "var(--color-chlorophyll-500)"; title = t("dashboard.modality_both"); }
    else if (o)  { color = "var(--color-blue-500)";        title = t("dashboard.modality_onsite"); }
    else if (r)  { color = "var(--color-cobalt-500)";      title = t("dashboard.modality_remote"); }
    return `<div title="${l.date} — ${title}"
      style="width:1.4rem;height:1.4rem;border-radius:3px;background:${color};flex-shrink:0"></div>`;
  }).join("");
}
