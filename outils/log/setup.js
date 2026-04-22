// ============================================================
// setup.js — Setup flow logic
// ============================================================

let currentPathway = null;
let setupData = { profile: {}, context: {}, skills: [], toolsKnown: [], toolsToLearn: [] };
let projectBlocks = [];

// ── Screen navigation ────────────────────────────────────────
function goToScreen(id) {
  document.querySelectorAll('[id^="screen-"]').forEach(s => s.classList.add("hidden"));
  const target = document.getElementById(id);
  if (target) {
    target.classList.remove("hidden");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
  // Re-apply language on every screen transition so data-i18n elements
  // are populated even if the initial applyLanguage ran while they were hidden.
  if (typeof applyLanguage === "function") applyLanguage(getCurrentLang(), false);
}

// ── Onboarding ───────────────────────────────────────────────
function toggleOnboardCheck(checkbox) {
  const cta  = document.getElementById("onboard-cta");
  const row  = document.getElementById("onboard-check-row");
  const hint = document.getElementById("onboard-check-hint");
  if (checkbox.checked) {
    cta.disabled = false;
    row.classList.add("checked");
    if (hint) hint.style.display = "none";
  } else {
    cta.disabled = true;
    row.classList.remove("checked");
  }
}

// ── Pathway selection ────────────────────────────────────────
function selectPathway(pathway) {
  currentPathway = pathway;
  document.querySelectorAll(".pathway-card").forEach(c => c.classList.remove("selected"));
  event.currentTarget.classList.add("selected");
  setTimeout(() => {
    prefillFromCache();
    goToScreen("screen-profile");
    renderSteps("setup-steps", 0);
  }, 180);
}

// ── Prefill from cache ───────────────────────────────────────
function prefillFromCache() {
  const cache = loadCache();
  const data  = loadData();

  if (data && data.profile) {
    setVal("profile-name", data.profile.full_name);
    setVal("profile-student-id", data.profile.student_id);
    setVal("profile-email", data.profile.email);
    setVal("profile-cohort", data.profile.cohort);
    setVal("profile-professor", data.profile.supervising_professor);
    if (data.profile.program) {
      const programSel = document.getElementById("profile-program-select");
      if (programSel) { programSel.value = data.profile.program; onProgramChange(); }
    }
    if (data.context?.internship_course_code) {
      const courseSel = document.getElementById("ctx-course-select");
      if (courseSel) courseSel.value = data.context.internship_course_code;
    }
  }

  if (data && data.context) {
    const ctx = data.context;
    // Work hours
    if (ctx.work_hours) {
      setVal("ctx-work-hours-h", ctx.work_hours.h);
      setVal("ctx-work-hours-m", ctx.work_hours.m);
    }
    // Start time and lunch break
    if (ctx.work_start_time) setVal("ctx-start-time", ctx.work_start_time);
    if (ctx.lunch_minutes != null) setVal("ctx-lunch-minutes", ctx.lunch_minutes);
    // Work days — check the right checkboxes
    if (ctx.work_days) {
      document.querySelectorAll(".ctx-work-day").forEach(cb => {
        cb.checked = ctx.work_days.includes(parseInt(cb.value));
      });
    }
    // Wrap-up day and calendar week start
    if (ctx.week_end_day !== undefined) setVal("ctx-week-end-day", ctx.week_end_day);
    if (ctx.calendar_week_start !== undefined) setVal("ctx-cal-week-start", ctx.calendar_week_start);
  }

  if (cache.known_orgs?.length) {
    setupAutocomplete(document.getElementById("ctx-org-name"), cache.known_orgs);
  }
}

function setVal(id, val) {
  const el = document.getElementById(id);
  if (el && val) el.value = val;
}

// ── Program dropdown ─────────────────────────────────────────
// Builds the program <select> from PROGRAMS (courses.js).
// Called once on DOMContentLoaded.
function buildProgramDropdown() {
  const sel = document.getElementById("profile-program-select");
  if (!sel) return;
  const lang = getCurrentLang();

  sel.innerHTML = `<option value="">${lang === "fr-CA" ? "— Choisir un programme —" : "— Select a program —"}</option>`;

  // getSelectablePrograms() filters out hidden placeholder programs (e.g. 420.B0)
  const programs = typeof getSelectablePrograms === "function" ? getSelectablePrograms() : PROGRAMS;
  // Sort alphabetically by display label in current language
  const sorted = [...programs].sort((a, b) =>
    getProgramLabel(a.code, lang).localeCompare(getProgramLabel(b.code, lang), lang)
  );
  sorted.forEach(p => {
    const opt = document.createElement("option");
    opt.value = p.code;
    opt.textContent = getProgramLabel(p.code, lang);
    sel.appendChild(opt);
  });

  // "Other" option
  const other = document.createElement("option");
  other.value = "other";
  other.textContent = lang === "fr-CA" ? "Autre / Other" : "Other / Autre";
  sel.appendChild(other);
}

// Called when the program dropdown changes.
// Updates the course dropdown to show only courses for that program.
function onProgramChange() {
  const programSel = document.getElementById("profile-program-select");
  const courseRow  = document.getElementById("ctx-course-row");
  const courseSel  = document.getElementById("ctx-course-select");
  if (!programSel || !courseRow || !courseSel) return;

  const programCode = programSel.value;
  const lang = getCurrentLang();

  if (!programCode) {
    courseRow.classList.add("hidden");
    courseSel.innerHTML = "";
    return;
  }

  // Build course options for this program
  const courseCodes = programCode === "other"
    ? ["generic"]
    : getCoursesForProgram(programCode);  // always ends with "generic"

  courseSel.innerHTML = "";

  courseCodes.forEach(code => {
    const opt = document.createElement("option");
    opt.value = code;
    opt.textContent = getCourseLabel(code, lang);
    courseSel.appendChild(opt);
  });

  // Auto-select if only one real course (plus generic fallback)
  if (courseCodes.length === 2 && courseCodes[0] !== "generic") {
    courseSel.value = courseCodes[0];
  } else if (courseCodes.length === 1) {
    courseSel.value = courseCodes[0];
  }

  courseRow.classList.remove("hidden");
}

// ── Step indicator ───────────────────────────────────────────
function renderSteps(containerId, activeIdx) {
  const labels = [
    t("setup.section_profile"),
    t("setup.section_internship"),
    t("setup.section_expectations"),
  ];
  const container = document.getElementById(containerId);
  if (!container) return;
  container.innerHTML = labels.map((label, i) => `
    <div class="step ${i < activeIdx ? "done" : i === activeIdx ? "active" : ""}">
      <div class="step-dot">${i < activeIdx ? "✓" : i + 1}</div>
      <div class="step-label">${label}</div>
      ${i < labels.length - 1 ? '<div class="step-line"></div>' : ""}
    </div>
  `).join("");
}

// ── Save profile ─────────────────────────────────────────────
function saveProfileAndNext() {
  const name      = document.getElementById("profile-name").value.trim();
  const studentId = document.getElementById("profile-student-id").value.trim();
  const email     = document.getElementById("profile-email").value.trim();
  const programSel = document.getElementById("profile-program-select");
  const programCode = programSel ? programSel.value : "";

  if (!name)        { showFieldError("profile-name", "error.field_required"); return; }
  if (!studentId)   { showFieldError("profile-student-id", "error.field_required"); return; }
  // Student ID: warn if it contains letters (most IDs are numeric)
  if (!/^\d+$/.test(studentId)) {
    showFieldError("profile-student-id", "error.student_id_numeric");
    return;
  }
  if (!programCode) { showFieldError("profile-program-select", "error.program_required"); return; }

  setupData.profile = {
    full_name:             name,
    student_id:            studentId,
    email,
    program:               programCode,          // controlled code, e.g. "420.BR" or "other"
    cohort:                document.getElementById("profile-cohort").value.trim(),
    supervising_professor: document.getElementById("profile-professor").value.trim(),
  };

  // Resolve course code: read the course dropdown (already filtered to this program)
  const courseSel = document.getElementById("ctx-course-select");
  setupData._selectedCourseCode = (courseSel && courseSel.value) ? courseSel.value : "generic";

  // Show correct context fields
  const companyFields = document.getElementById("ctx-company-fields");
  const hubFields     = document.getElementById("ctx-hub-fields");
  if (currentPathway === "hub") {
    companyFields.classList.add("hidden");
    hubFields.classList.remove("hidden");
  } else {
    companyFields.classList.remove("hidden");
    hubFields.classList.add("hidden");
  }

  goToScreen("screen-context");
  renderSteps("setup-steps-2", 1);
}

// ── Project blocks (hub pathway) ─────────────────────────────
function addProjectBlock(existing = null) {
  const id   = generateUUID();
  const list = document.getElementById("ctx-projects-list");
  const block = document.createElement("div");
  block.className = "repeatable-block";
  block.dataset.id = id;

  const p = existing || {};
  block.innerHTML = `
    <button class="btn btn--icon btn--sm repeatable-block-remove" onclick="removeProjectBlock('${id}')" title="${t('action.delete')}">✕</button>
    <div class="form-row">
      <div class="form-group">
        <label data-i18n="setup.project_name"></label>
        <input type="text" class="proj-name" value="${p.project_name || ""}">
      </div>
      <div class="form-group">
        <label data-i18n="setup.client_name"></label>
        <input type="text" class="proj-client" value="${p.client_name || ""}">
      </div>
    </div>
    <div class="form-row">
      <div class="form-group">
        <label data-i18n="setup.project_start"></label>
        <input type="date" class="proj-start" value="${p.project_start_date || ""}">
      </div>
      <div class="form-group">
        <label data-i18n="setup.student_joined"></label>
        <input type="date" class="proj-joined" value="${p.student_joined_date || new Date().toISOString().slice(0, 10)}">
      </div>
    </div>
    <div class="form-group">
      <label data-i18n="setup.brief"></label>
      <textarea class="proj-brief" rows="2">${p.brief_summary || ""}</textarea>
    </div>
    <div class="form-group">
      <label data-i18n="setup.project_initial_impression"></label>
      <textarea class="proj-impression" rows="2">${p.initial_impression || ""}</textarea>
    </div>
    <div class="form-group">
      <label data-i18n="setup.project_challenges"></label>
      <textarea class="proj-challenges" rows="2">${p.anticipated_challenges || ""}</textarea>
    </div>
  `;
  list.appendChild(block);
  applyLanguage(getCurrentLang());
  projectBlocks.push(id);
}

function removeProjectBlock(id) {
  const el = document.querySelector(`[data-id="${id}"]`);
  if (el) el.remove();
  projectBlocks = projectBlocks.filter(x => x !== id);
}

function collectProjects() {
  const blocks = document.querySelectorAll("#ctx-projects-list .repeatable-block");
  return Array.from(blocks).map(b => ({
    project_id:          b.dataset.id,
    project_name:        b.querySelector(".proj-name")?.value.trim()        || "",
    client_name:         b.querySelector(".proj-client")?.value.trim()      || "",
    brief_summary:       b.querySelector(".proj-brief")?.value.trim()       || "",
    project_start_date:  b.querySelector(".proj-start")?.value              || null,
    student_joined_date: b.querySelector(".proj-joined")?.value             || new Date().toISOString().slice(0, 10),
    student_left_date:   null,
    project_end_date:    null,
    initial_impression:  b.querySelector(".proj-impression")?.value.trim()  || "",
    anticipated_challenges: b.querySelector(".proj-challenges")?.value.trim() || "",
    situation_before:    b.querySelector(".proj-situation-before")?.value.trim() || "",
    status:              "active",
    client_person_id:    null,
    added_date:          new Date().toISOString().slice(0, 10),
  }));
}

// ── Save context ──────────────────────────────────────────────
function saveContextAndNext() {
  const startDate = document.getElementById("ctx-start-date").value;
  const endDate   = document.getElementById("ctx-end-date").value;

  // Work hours: read H and M as separate integers
  const workH = parseInt(document.getElementById("ctx-work-hours-h").value) || 7;
  const workM = parseInt(document.getElementById("ctx-work-hours-m").value) || 30;

  // Start time and lunch break
  const startTime   = document.getElementById("ctx-start-time").value || "08:30";
  const lunchMins   = parseInt(document.getElementById("ctx-lunch-minutes").value) || 60;

  // Work days: collect checked checkboxes
  const workDays = [];
  document.querySelectorAll(".ctx-work-day:checked").forEach(cb => {
    workDays.push(parseInt(cb.value));
  });

  setupData.context = {
    start_date:           startDate,
    scheduled_end_date:   endDate,
    week_end_day:         parseInt(document.getElementById("ctx-week-end-day").value ?? "5"),
    calendar_week_start:  parseInt(document.getElementById("ctx-cal-week-start").value ?? "1"),
    work_days:            workDays.length ? workDays : [1,2,3,4,5],
    work_hours:           { h: workH, m: workM },
    work_start_time:      startTime,
    lunch_minutes:        lunchMins,
    total_hours_target:   parseFloat(document.getElementById("ctx-total-hours").value) || null,
    planned_absences:     [],
    skills_to_develop:    [],
    apprehensions:        "",
    personal_success_definition: "",
    // Course code resolved in saveProfileAndNext
    internship_course_code: setupData._selectedCourseCode || "generic",
  };

  if (currentPathway === "company") {
    setupData.context.company = {
      organization_name: document.getElementById("ctx-org-name").value.trim(),
      industry:          document.getElementById("ctx-industry").value.trim(),
      city:              document.getElementById("ctx-city").value.trim(),
      country:           document.getElementById("ctx-country").value.trim(),
    };
    setupData.context.supervisor_name    = document.getElementById("ctx-sup-name").value.trim();
    setupData.context.supervisor_role    = document.getElementById("ctx-sup-role").value.trim();
    setupData.context.situation_before   = document.getElementById("ctx-situation-before").value.trim();
  } else {
    setupData.context.faculty_supervisor = setupData.profile.supervising_professor || "";
    setupData.projects = collectProjects();
  }

  goToScreen("screen-expectations");
  renderSteps("setup-steps-3", 2);
}

// ── Skills and tools tags ────────────────────────────────────
function addSkillTag() {
  const input = document.getElementById("skill-input");
  const val   = input.value.trim();
  if (!val) return;
  setupData.skills.push(val);
  renderTags("skills-tags", setupData.skills, "removeSkill");
  input.value = "";
  input.focus();
}

function removeSkill(idx) {
  setupData.skills.splice(idx, 1);
  renderTags("skills-tags", setupData.skills, "removeSkill");
}

function addToolKnown() {
  const input = document.getElementById("tool-known-input");
  const val   = input.value.trim();
  if (!val) return;
  setupData.toolsKnown.push(val);
  renderTags("tools-known-tags", setupData.toolsKnown, "removeToolKnown");
  input.value = "";
  input.focus();
}

function removeToolKnown(idx) {
  setupData.toolsKnown.splice(idx, 1);
  renderTags("tools-known-tags", setupData.toolsKnown, "removeToolKnown");
}

function addToolToLearn() {
  const input = document.getElementById("tool-learn-input");
  const val   = input.value.trim();
  if (!val) return;
  setupData.toolsToLearn.push(val);
  renderTags("tools-learn-tags", setupData.toolsToLearn, "removeToolToLearn");
  input.value = "";
  input.focus();
}

function removeToolToLearn(idx) {
  setupData.toolsToLearn.splice(idx, 1);
  renderTags("tools-learn-tags", setupData.toolsToLearn, "removeToolToLearn");
}

function renderTags(containerId, arr, removeFn) {
  const el = document.getElementById(containerId);
  if (!el) return;
  el.innerHTML = arr.map((item, i) => `
    <span class="tag">
      ${item}
      <button class="tag-remove" onclick="${removeFn}(${i})">✕</button>
    </span>
  `).join("");
}

// Enter key support for tag inputs
document.addEventListener("DOMContentLoaded", () => {
  [
    ["skill-input",      null],
    ["tool-known-input", null],
    ["tool-learn-input", null],
  ].forEach(([id]) => {
    const el = document.getElementById(id);
    if (el) el.addEventListener("keydown", e => {
      if (e.key === "Enter") { e.preventDefault(); el.nextElementSibling?.click(); }
    });
  });
});

// ── Finish setup ─────────────────────────────────────────────
function finishSetup() {
  setupData.context.skills_to_develop          = [...setupData.skills];
  setupData.context.apprehensions              = document.getElementById("ctx-apprehensions").value.trim();
  setupData.context.personal_success_definition = document.getElementById("ctx-success").value.trim();
  setupData.context.tools_known_at_start       = [...setupData.toolsKnown];
  setupData.context.tools_to_learn             = [...setupData.toolsToLearn];

  // Teacher custom weekly field
  const teacherLabel = document.getElementById("ctx-teacher-field-label")?.value.trim();
  const teacherPH    = document.getElementById("ctx-teacher-field-placeholder")?.value.trim();
  if (teacherLabel) {
    setupData.context.teacher_custom_field = {
      label:       teacherLabel,
      placeholder: teacherPH || "",
    };
  } else {
    setupData.context.teacher_custom_field = null;
  }

  const data = createNewInternship(setupData.profile, currentPathway, setupData.context);

  // Add projects (hub)
  if (currentPathway === "hub" && setupData.projects) {
    data.projects = setupData.projects;
  }

  // Add supervisor as first person (company)
  if (currentPathway === "company" && setupData.context.supervisor_name) {
    addPerson(data, {
      name:         setupData.context.supervisor_name,
      role_type:    getCurrentLang() === "fr-CA" ? "Superviseur·e" : "Workplace supervisor",
      organization: setupData.context.company?.organization_name || "",
      notes:        setupData.context.supervisor_role || "",
    });
  }

  // Pre-populate tools from setup
  setupData.toolsKnown.concat(setupData.toolsToLearn).forEach(name => {
    if (!data.tools.find(x => x.name === name)) {
      addTool(data, { name, category: "" });
    }
  });

  saveData(data);
  updateCache(data);

  const lang = getCurrentLang();
  document.getElementById("done-title").textContent =
    lang === "fr-CA" ? "Configuration complète ✓" : "Setup complete ✓";
  document.getElementById("done-msg").textContent =
    lang === "fr-CA"
      ? `Bonjour, ${setupData.profile.full_name}. Tout est prêt.`
      : `Welcome, ${setupData.profile.full_name}. Everything is set up.`;

  // Wire form link to deployment-configurable meta tag URL
  const formLink = document.getElementById("done-form-link");
  if (formLink) {
    const metaUrl = document.querySelector('meta[name="upload-form-url"]')?.content;
    if (metaUrl) formLink.href = metaUrl;
  }

  goToScreen("screen-done");
}

// ── Project JSON import (hub pathway) ────────────────────────
// Accepts a JSON blob in the lci-stage-projects-v1 schema.
// Converts each project + its tasks into project blocks and
// optionally pre-populates todos from task descriptions.
//
// Expected schema:
// {
//   "schema": "lci-stage-projects-v1",
//   "projects": [
//     {
//       "project_name": string,           // required
//       "client_name": string,            // optional
//       "brief_summary": string,          // optional
//       "situation_before": string,       // optional
//       "initial_impression": string,     // optional
//       "anticipated_challenges": string, // optional
//       "tasks": [                        // optional
//         {
//           "description": string,        // required
//           "activity_type": string,      // optional — maps to sys-{type}
//           "estimated_hours": number     // optional, informational
//         }
//       ]
//     }
//   ]
// }
//
// activity_type values: programming, design, research, planning,
// data-analysis, debugging, production, testing, documentation,
// client-work, meeting, training, admin
function importProjectJSON() {
  const textarea = document.getElementById("ctx-project-json");
  const status   = document.getElementById("ctx-project-import-status");
  if (!textarea || !status) return;

  const raw = textarea.value.trim();
  if (!raw) {
    status.style.color = "var(--danger)";
    status.textContent = t("setup.import_projects_empty");
    return;
  }

  let parsed;
  try {
    parsed = JSON.parse(raw);
  } catch (e) {
    status.style.color = "var(--danger)";
    status.textContent = t("setup.import_projects_invalid_json");
    return;
  }

  if (parsed.schema !== "lci-stage-projects-v1" || !Array.isArray(parsed.projects)) {
    status.style.color = "var(--danger)";
    status.textContent = t("setup.import_projects_wrong_schema");
    return;
  }

  const projects = parsed.projects.filter(p => p.project_name?.trim());
  if (!projects.length) {
    status.style.color = "var(--danger)";
    status.textContent = t("setup.import_projects_empty_list");
    return;
  }

  // Build project blocks from imported data
  projects.forEach(p => {
    // Build a tasks summary for brief_summary if none provided
    let brief = p.brief_summary || "";
    if (!brief && p.tasks?.length) {
      brief = p.tasks.map(t =>
        `${t.description}${t.estimated_hours ? ` (${t.estimated_hours}h)` : ""}`
      ).join(" · ");
    }

    addProjectBlock({
      project_name:            p.project_name.trim(),
      client_name:             p.client_name?.trim()             || "",
      brief_summary:           brief,
      situation_before:        p.situation_before?.trim()        || "",
      initial_impression:      p.initial_impression?.trim()      || "",
      anticipated_challenges:  p.anticipated_challenges?.trim()  || "",
    });
  });

  // Clear the textarea and show success
  textarea.value = "";
  status.style.color = "var(--success)";
  const lang = getCurrentLang();
  status.textContent = lang === "fr-CA"
    ? `✓ ${projects.length} projet${projects.length > 1 ? "s" : ""} importé${projects.length > 1 ? "s" : ""}.`
    : `✓ ${projects.length} project${projects.length > 1 ? "s" : ""} imported.`;
  setTimeout(() => { status.textContent = ""; }, 4000);
}
function showFieldError(id, msgKey) {
  const el = document.getElementById(id);
  if (!el) return;
  el.style.borderColor = "var(--danger)";
  el.focus();
  // Show an inline error message below the field
  const errId = id + "-error";
  let errEl = document.getElementById(errId);
  if (!errEl) {
    errEl = document.createElement("div");
    errEl.id = errId;
    errEl.style.cssText = "color:var(--danger);font-size:1.2rem;margin-top:var(--sp-1)";
    el.parentNode.insertBefore(errEl, el.nextSibling);
  }
  errEl.textContent = t(msgKey || "error.field_required");
  setTimeout(() => {
    el.style.borderColor = "";
    if (errEl) errEl.textContent = "";
  }, 3500);
}

// ── Init ──────────────────────────────────────────────────────
document.addEventListener("DOMContentLoaded", () => {
  initPage();
  buildProgramDropdown();

  const data = loadData();
  if (data && data.profile?.full_name) {
    document.getElementById("welcome-options-new").classList.add("hidden");
    const cont = document.getElementById("welcome-options-continue");
    cont.classList.remove("hidden");
    document.getElementById("reset-link-row")?.classList.remove("hidden");
    document.getElementById("export-config-row")?.classList.remove("hidden");
    const lang = getCurrentLang();
    document.getElementById("welcome-continue-name").textContent =
      lang === "fr-CA"
        ? `${data.profile.full_name} — ${data.pathway === "hub" ? "Hub d'innovation" : data.context?.company?.organization_name || "Stage"}`
        : `${data.profile.full_name} — ${data.pathway === "hub" ? "Innovation hub" : data.context?.company?.organization_name || "Internship"}`;
  }
});
