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
}

// ── Onboarding ───────────────────────────────────────────────
function toggleOnboardCheck(checkbox) {
  const cta = document.getElementById("onboard-cta");
  const row = document.getElementById("onboard-check-row");
  if (checkbox.checked) {
    cta.disabled = false;
    row.classList.add("checked");
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
  const data = loadData();

  if (data && data.profile) {
    setVal("profile-name", data.profile.full_name);
    setVal("profile-student-id", data.profile.student_id);
    setVal("profile-email", data.profile.email);
    setVal("profile-program", data.profile.program);
    setVal("profile-cohort", data.profile.cohort);
    setVal("profile-professor", data.profile.supervising_professor);
  }

  // Autocomplete suggestions
  if (cache.known_orgs.length) {
    setupAutocomplete(document.getElementById("ctx-org-name"), cache.known_orgs);
  }
}

function setVal(id, val) {
  const el = document.getElementById(id);
  if (el && val) el.value = val;
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
  const name = document.getElementById("profile-name").value.trim();
  const studentId = document.getElementById("profile-student-id").value.trim();
  const email = document.getElementById("profile-email").value.trim();

  if (!name) { showFieldError("profile-name"); return; }
  if (!studentId) { showFieldError("profile-student-id"); return; }

  setupData.profile = {
    full_name: name,
    student_id: studentId,
    email,
    program: document.getElementById("profile-program").value.trim(),
    cohort: document.getElementById("profile-cohort").value.trim(),
    supervising_professor: document.getElementById("profile-professor").value.trim(),
  };

  // Show correct context fields
  const companyFields = document.getElementById("ctx-company-fields");
  const hubFields = document.getElementById("ctx-hub-fields");
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
  const id = generateUUID();
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
    project_id: b.dataset.id,
    project_name: b.querySelector(".proj-name")?.value.trim() || "",
    client_name: b.querySelector(".proj-client")?.value.trim() || "",
    brief_summary: b.querySelector(".proj-brief")?.value.trim() || "",
    project_start_date: b.querySelector(".proj-start")?.value || null,
    student_joined_date: b.querySelector(".proj-joined")?.value || new Date().toISOString().slice(0, 10),
    student_left_date: null,
    project_end_date: null,
    initial_impression: b.querySelector(".proj-impression")?.value.trim() || "",
    anticipated_challenges: b.querySelector(".proj-challenges")?.value.trim() || "",
    status: "active",
    client_person_id: null,
    added_date: new Date().toISOString().slice(0, 10),
  }));
}

// ── Save context ──────────────────────────────────────────────
function saveContextAndNext() {
  const startDate = document.getElementById("ctx-start-date").value;
  const endDate = document.getElementById("ctx-end-date").value;

  setupData.context = {
    start_date: startDate,
    scheduled_end_date: endDate,
    skills_to_develop: [],
    apprehensions: "",
    personal_success_definition: "",
  };

  if (currentPathway === "company") {
    setupData.context.company = {
      organization_name: document.getElementById("ctx-org-name").value.trim(),
      industry: document.getElementById("ctx-industry").value.trim(),
      city: document.getElementById("ctx-city").value.trim(),
      country: document.getElementById("ctx-country").value.trim(),
    };
    setupData.context.supervisor_name = document.getElementById("ctx-sup-name").value.trim();
    setupData.context.supervisor_role = document.getElementById("ctx-sup-role").value.trim();
  } else {
    setupData.context.faculty_supervisor = document.getElementById("ctx-fac-supervisor").value.trim();
    setupData.projects = collectProjects();
  }

  goToScreen("screen-expectations");
  renderSteps("setup-steps-3", 2);
}

// ── Skills and tools tags ────────────────────────────────────
function addSkillTag() {
  const input = document.getElementById("skill-input");
  const val = input.value.trim();
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
  const val = input.value.trim();
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
  const val = input.value.trim();
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
  ["skill-input", "tool-known-input", "tool-learn-input"].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.addEventListener("keydown", e => {
      if (e.key === "Enter") { e.preventDefault(); el.nextElementSibling?.click(); }
    });
  });
});

// ── Finish setup ─────────────────────────────────────────────
function finishSetup() {
  setupData.context.skills_to_develop = [...setupData.skills];
  setupData.context.apprehensions = document.getElementById("ctx-apprehensions").value.trim();
  setupData.context.personal_success_definition = document.getElementById("ctx-success").value.trim();
  setupData.context.tools_known_at_start = [...setupData.toolsKnown];
  setupData.context.tools_to_learn = [...setupData.toolsToLearn];

  const data = createNewInternship(setupData.profile, currentPathway, setupData.context);

  // Add projects (hub)
  if (currentPathway === "hub" && setupData.projects) {
    data.projects = setupData.projects;
  }

  // Add supervisor as first person (company)
  if (currentPathway === "company" && setupData.context.supervisor_name) {
    addPerson(data, {
      name: setupData.context.supervisor_name,
      role_type: t("drawer.projects_status_active") === "Active" ? "Workplace supervisor" : "Superviseur·e",
      organization: setupData.context.company?.organization_name || "",
      notes: setupData.context.supervisor_role || "",
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

  goToScreen("screen-done");
}

// ── Error helpers ─────────────────────────────────────────────
function showFieldError(id) {
  const el = document.getElementById(id);
  if (!el) return;
  el.style.borderColor = "var(--danger)";
  el.focus();
  setTimeout(() => el.style.borderColor = "", 2000);
}

// ── Init ──────────────────────────────────────────────────────
document.addEventListener("DOMContentLoaded", () => {
  initPage();

  const data = loadData();
  if (data && data.profile?.full_name) {
    document.getElementById("welcome-options-new").classList.add("hidden");
    const cont = document.getElementById("welcome-options-continue");
    cont.classList.remove("hidden");
    const lang = getCurrentLang();
    document.getElementById("welcome-continue-name").textContent =
      lang === "fr-CA"
        ? `${data.profile.full_name} — ${data.pathway === "hub" ? "Hub d'innovation" : data.context?.company?.organization_name || "Stage"}`
        : `${data.profile.full_name} — ${data.pathway === "hub" ? "Innovation hub" : data.context?.company?.organization_name || "Internship"}`;
  }
});
