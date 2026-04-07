// ============================================================
// app.js — Shared logic: storage, UUID, data model, merge
// ============================================================

// ── Settings (edit these variables to change defaults) ───────
const SETTINGS = {
  GRAYZONE_THRESHOLD_PCT: 20,      // % of day that triggers undocumented prompt
  IDLE_REMINDER_MINUTES: 120,       // minutes before idle save reminder
  SCHEMA_VERSION: "1.1",
};

// ── Default activity types ───────────────────────────────────
const DEFAULT_ACTIVITY_TYPES = [
  // Work-type categories — cross-disciplinary
  { type_id: "sys-programming",   label_key: "activity.programming",   color: "#00587c", system: true },
  { type_id: "sys-design",        label_key: "activity.design",        color: "#d485fa", system: true },
  { type_id: "sys-research",      label_key: "activity.research",      color: "#8fb9a2", system: true },
  { type_id: "sys-planning",      label_key: "activity.planning",      color: "#cc9f11", system: true },
  { type_id: "sys-data-analysis", label_key: "activity.data_analysis", color: "#337996", system: true },
  { type_id: "sys-debugging",     label_key: "activity.debugging",     color: "#eb2d37", system: true },
  { type_id: "sys-production",    label_key: "activity.production",    color: "#9569b9", system: true },
  { type_id: "sys-testing",       label_key: "activity.testing",       color: "#5b8000", system: true },
  { type_id: "sys-documentation", label_key: "activity.documentation", color: "#784619", system: true },
  { type_id: "sys-client-work",   label_key: "activity.client_work",   color: "#fe6c06", system: true },
  // Non-work categories
  { type_id: "sys-meeting",       label_key: "activity.meeting",       color: "#685ef7", system: true },
  { type_id: "sys-training",      label_key: "activity.training",      color: "#3d4c11", system: true },
  { type_id: "sys-admin",         label_key: "activity.admin",         color: "#63625d", system: true },
  { type_id: "sys-break",         label_key: "activity.break",         color: "#cdc19e", system: true },
  { type_id: "sys-gray",          label_key: "activity.other",         color: "#576266", system: true },
];

// LCI palette options for user-defined activity types
const LCI_PALETTE = [
  { hex: "#00587c", name: "Bleu LCI" },
  { hex: "#eb2d37", name: "Rouge LCI" },
  { hex: "#685ef7", name: "Cobalt" },
  { hex: "#cc9f11", name: "Or" },
  { hex: "#5b8000", name: "Chlorophylle" },
  { hex: "#d485fa", name: "Lilas" },
  { hex: "#fe6c06", name: "Orange" },
  { hex: "#9cf6d4", name: "Aqua" },
  { hex: "#f2f537", name: "Canari" },
  { hex: "#cdc19e", name: "Taupe" },
  { hex: "#07181e", name: "Charcoal" },
  { hex: "#f8f5e9", name: "Crème" },
];

// ── UUID generator ───────────────────────────────────────────
function generateUUID() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, c => {
    const r = (Math.random() * 16) | 0;
    return (c === "x" ? r : (r & 0x3) | 0x8).toString(16);
  });
}

// ── localStorage keys ────────────────────────────────────────
const LS = {
  CACHE:       "internship_cache",    // profile, known people/tools
  DATA:        "internship_data",     // current internship JSON
  REPORT_DATA: "internship_report",   // merged report data (survives page nav)
  SETTINGS:    "internship_settings", // user-overridden settings
  THEME:       "internship_theme",
  LANG:        "lang",
};

// ── Storage helpers ──────────────────────────────────────────
function loadData() {
  try {
    const raw = localStorage.getItem(LS.DATA);
    if (!raw) return null;
    const data = JSON.parse(raw);
    migrateData(data);
    return data;
  } catch { return null; }
}

// ── Data migration ────────────────────────────────────────────
// Upgrades localStorage data from older schema versions in-place.
function migrateData(data) {
  if (!data) return;

  // v1 → v2: sys-work renamed to sys-programming; activity.undocumented → activity.other
  const typeRemap = {
    "sys-work": "sys-programming",
  };
  const labelRemap = {
    "activity.work":         "activity.programming",
    "activity.undocumented": "activity.other",
  };

  // Remap activity_types array
  if (data.activity_types) {
    data.activity_types = data.activity_types.map(at => {
      if (typeRemap[at.type_id]) {
        at.type_id = typeRemap[at.type_id];
      }
      if (labelRemap[at.label_key]) {
        at.label_key = labelRemap[at.label_key];
      }
      // Remove obsolete sys-gray label (renamed to sys-other)
      if (at.type_id === "sys-gray") {
        at.label_key = "activity.other";
      }
      return at;
    });
    // Deduplicate by type_id (migration may create dupes)
    const seen = new Set();
    data.activity_types = data.activity_types.filter(at => {
      if (seen.has(at.type_id)) return false;
      seen.add(at.type_id);
      return true;
    });
  }

  // Remap task activity_type_ids
  if (data.logs) {
    data.logs.forEach(log => {
      (log.tasks || []).forEach(task => {
        if (typeRemap[task.activity_type_id]) {
          task.activity_type_id = typeRemap[task.activity_type_id];
        }
      });
    });
  }
}

function loadReportData() {
  try {
    const raw = localStorage.getItem(LS.REPORT_DATA);
    return raw ? JSON.parse(raw) : null;
  } catch { return null; }
}

function saveReportData(data) {
  try {
    localStorage.setItem(LS.REPORT_DATA, JSON.stringify(data));
  } catch (e) {
    // localStorage may be full — silently ignore, data still in memory
    console.warn("Could not persist report data:", e);
  }
}

function clearReportData() {
  localStorage.removeItem(LS.REPORT_DATA);
}

function saveData(data) {
  data.meta.last_modified = new Date().toISOString();
  localStorage.setItem(LS.DATA, JSON.stringify(data));
}

function loadCache() {
  try {
    const raw = localStorage.getItem(LS.CACHE);
    return raw ? JSON.parse(raw) : { known_people: [], known_tools: [], known_orgs: [], known_roles: [], known_tool_categories: [] };
  } catch { return { known_people: [], known_tools: [], known_orgs: [], known_roles: [], known_tool_categories: [] }; }
}

function saveCache(cache) {
  localStorage.setItem(LS.CACHE, JSON.stringify(cache));
}

function updateCache(data) {
  const cache = loadCache();
  // Extract known people names
  if (data.people) {
    data.people.forEach(p => {
      if (p.name && !cache.known_people.includes(p.name)) cache.known_people.push(p.name);
      if (p.role_type && !cache.known_roles.includes(p.role_type)) cache.known_roles.push(p.role_type);
      if (p.organization && !cache.known_orgs.includes(p.organization)) cache.known_orgs.push(p.organization);
    });
  }
  if (data.tools) {
    data.tools.forEach(tool => {
      if (tool.name && !cache.known_tools.includes(tool.name)) cache.known_tools.push(tool.name);
      if (tool.category && !cache.known_tool_categories.includes(tool.category)) cache.known_tool_categories.push(tool.category);
    });
  }
  saveCache(cache);
}

// ── New internship data structure ────────────────────────────
function createNewInternship(profile, pathway, context) {
  const studentUUID = profile.student_id || generateUUID();
  return {
    meta: {
      schema_version: SETTINGS.SCHEMA_VERSION,
      student_uuid: studentUUID,
      created_at: new Date().toISOString(),
      last_modified: new Date().toISOString(),
      language: getCurrentLang(),
      settings_snapshot: {
        grayzone_threshold_pct: SETTINGS.GRAYZONE_THRESHOLD_PCT,
        defaults_modified: false,
      }
    },
    profile,
    pathway,
    context,
    people: [],
    projects: [],
    activity_types: DEFAULT_ACTIVITY_TYPES.map(at => ({ ...at })),
    tools: [],
    todos: [],
    logs: [],
    reflection: null,
  };
}

// ── Daily log helpers ────────────────────────────────────────
function getTodayLogId(data) {
  const today = new Date().toISOString().slice(0, 10);
  return data.logs.find(l => l.date === today) || null;
}

function createNewLog(date) {
  const now = new Date();
  return {
    log_id: generateUUID(),
    date: date || now.toISOString().slice(0, 10),
    revision: 0,
    saved_at: now.toISOString(),
    late_filing: false,
    time_start: now.toISOString(),
    time_end: null,
    day_duration_minutes: 0,
    modality_onsite: false,
    modality_remote: false,
    tasks: [],
    task_total_minutes: 0,
    grayzone_minutes: 0,
    grayzone_description: "",
    grayzone_prompted: false,
    morning_energy: null,
    obstacle: "",
    obstacle_response: "",
    win: "",
    plan_tomorrow: "",
    weekly_wrap: null,
    project_status_updates: [],
    day_rating: 3,
    closing_word: "",
    todos_completed_today: [],
  };
}

function createNewTask() {
  return {
    task_id: generateUUID(),
    description: "",
    duration_minutes: 0,
    activity_type_id: null,
    project_id: null,
    tool_ids: [],
    person_ids: [],
    topic: "",
    learning: "",
    lesson_tags: [],
    training_subtype: null,
  };
}

function calcLogMinutes(log) {
  log.task_total_minutes = log.tasks.reduce((sum, t) => sum + (parseInt(t.duration_minutes) || 0), 0);
  if (log.time_start && log.time_end) {
    const start = new Date(log.time_start);
    const end = new Date(log.time_end);
    log.day_duration_minutes = Math.round((end - start) / 60000);
  }
  log.grayzone_minutes = Math.max(0, log.day_duration_minutes - log.task_total_minutes);
  return log;
}

function greyzoneExceeded(log) {
  if (!log.day_duration_minutes) return false;
  const pct = (log.grayzone_minutes / log.day_duration_minutes) * 100;
  return pct > SETTINGS.GRAYZONE_THRESHOLD_PCT;
}

// ── JSON export ──────────────────────────────────────────────
function exportLogJSON(data, log) {
  // Bump revision
  log.revision = (log.revision || 0) + 1;
  log.saved_at = new Date().toISOString();

  // Upsert log in data
  const idx = data.logs.findIndex(l => l.log_id === log.log_id);
  if (idx >= 0) data.logs[idx] = log;
  else data.logs.push(log);

  saveData(data);
  updateCache(data);

  const filename = `${data.profile.student_id || "stage"}_${log.date}_r${log.revision}.json`;
  downloadJSON(data, filename);
}

function downloadJSON(obj, filename) {
  const blob = new Blob([JSON.stringify(obj, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

// ── Merge logic ──────────────────────────────────────────────
function mergeInternshipFiles(files) {
  const result = { valid: false, data: null, warnings: [], errors: [], conflicts: [] };

  if (!files.length) {
    result.errors.push("error.no_files");
    return result;
  }

  // Separate reflection-only files from full internship files
  const reflectionFiles = files.filter(f => f.meta?.type === "reflection");
  const mainFiles = files.filter(f => f.meta?.type !== "reflection");

  // If only reflection files were uploaded, nothing to merge against
  if (!mainFiles.length && reflectionFiles.length) {
    result.errors.push("error.no_files");
    return result;
  }

  // Check all main files share the same student_uuid
  const uuids = [...new Set(mainFiles.map(f => f.meta?.student_uuid))];
  if (uuids.length > 1) {
    result.errors.push("error.merge_uuid");
    return result;
  }
  // Reflection files must also match
  const reflUuids = reflectionFiles.map(f => f.meta?.student_uuid).filter(Boolean);
  if (reflUuids.length && !reflUuids.every(u => u === uuids[0])) {
    result.errors.push("error.merge_uuid");
    return result;
  }

  // Use latest main file as base
  mainFiles.sort((a, b) => new Date(b.meta.last_modified) - new Date(a.meta.last_modified));
  const base = JSON.parse(JSON.stringify(mainFiles[0]));

  // Absorb most recent reflection file (if any) — skip asking again
  if (reflectionFiles.length) {
    reflectionFiles.sort((a, b) => new Date(b.meta.saved_at) - new Date(a.meta.saved_at));
    base.reflection = reflectionFiles[0].reflection;
    result.warnings.push({ type: "reflection_preloaded", date: reflectionFiles[0].meta.saved_at });
  }

  // Merge logs from all files
  const logMap = new Map();
  for (const file of [...mainFiles, ...reflectionFiles]) {
    for (const log of (file.logs || [])) {
      const existing = logMap.get(log.log_id);
      if (!existing) {
        logMap.set(log.log_id, log);
      } else {
        if (log.revision > existing.revision) {
          logMap.set(log.log_id, log);
        } else if (log.revision === existing.revision) {
          // Same revision, different content → conflict
          if (JSON.stringify(log) !== JSON.stringify(existing)) {
            result.conflicts.push({ log_id: log.log_id, a: existing, b: log });
          }
        }
      }
    }
  }

  // Merge people, projects, tools, todos, activity_types by id
  const mergeById = (arr1, arr2, idKey) => {
    const map = new Map(arr1.map(x => [x[idKey], x]));
    for (const item of arr2) {
      if (!map.has(item[idKey])) map.set(item[idKey], item);
    }
    return [...map.values()];
  };

  base.people        = mergeById(base.people || [], mainFiles.flatMap(f => f.people || []), "person_id");
  base.projects      = mergeById(base.projects || [], mainFiles.flatMap(f => f.projects || []), "project_id");
  base.tools         = mergeById(base.tools || [], mainFiles.flatMap(f => f.tools || []), "tool_id");
  base.todos         = mergeById(base.todos || [], mainFiles.flatMap(f => f.todos || []), "todo_id");
  base.activity_types = mergeById(base.activity_types || [], mainFiles.flatMap(f => f.activity_types || []), "type_id");

  // Validate time integrity
  for (const [, log] of logMap) {
    if (!log.late_filing && log.time_start && log.saved_at) {
      const span = (new Date(log.saved_at) - new Date(log.time_start)) / 60000;
      if (span < log.task_total_minutes * 0.8) {
        result.warnings.push({ type: "time_integrity", log_id: log.log_id, date: log.date });
      }
    }
  }

  base.logs = [...logMap.values()].sort((a, b) => a.date.localeCompare(b.date));
  result.valid = true;
  result.data = base;
  return result;
}

// ── People / Project / Tool helpers ─────────────────────────
function addPerson(data, person) {
  person.person_id = person.person_id || generateUUID();
  person.added_date = new Date().toISOString().slice(0, 10);
  data.people.push(person);
  saveData(data);
  return person;
}

function addProject(data, project) {
  project.project_id = project.project_id || generateUUID();
  project.added_date = new Date().toISOString().slice(0, 10);
  project.status = project.status || "active";
  data.projects.push(project);
  saveData(data);
  return project;
}

function addTool(data, tool) {
  tool.tool_id = tool.tool_id || generateUUID();
  tool.added_date = new Date().toISOString().slice(0, 10);
  data.tools.push(tool);
  saveData(data);
  return tool;
}

function addActivityType(data, type) {
  type.type_id = type.type_id || generateUUID();
  type.system = false;
  type.added_date = new Date().toISOString().slice(0, 10);
  data.activity_types.push(type);
  saveData(data);
  return type;
}

function getActivityTypeLabel(data, typeId) {
  if (!typeId) return "";
  const found = data.activity_types.find(a => a.type_id === typeId);
  if (!found) return typeId;
  return found.label_key ? t(found.label_key) : found.label;
}

function getActivityTypeColor(data, typeId) {
  if (!typeId) return "#9ca3a5";
  const found = data.activity_types.find(a => a.type_id === typeId);
  return found?.color || "#9ca3a5";
}

// ── Theme ────────────────────────────────────────────────────
function applyTheme(theme, persist = false) {
  document.documentElement.setAttribute("data-theme", theme);
  // Only persist if called from user action (persist=true) or already stored
  if (persist || localStorage.getItem(LS.THEME)) {
    localStorage.setItem(LS.THEME, theme);
  }
  updateThemeButton();
}

function toggleTheme() {
  const current = document.documentElement.getAttribute("data-theme") || "light";
  applyTheme(current === "light" ? "dark" : "light", true); // true = persist
}

// SVG icons for theme toggle
const ICON_MOON = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 12.79A9 9 0 1 1 11.21 3a7 7 0 0 0 9.79 9.79z"/></svg>`;
const ICON_SUN  = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>`;

function updateThemeButton() {
  const theme = document.documentElement.getAttribute("data-theme") || "light";
  const isDark = theme === "dark";
  document.querySelectorAll(".theme-toggle-btn").forEach(btn => {
    btn.innerHTML = isDark ? ICON_SUN : ICON_MOON;
    btn.setAttribute("aria-label", t(isDark ? "nav.toggle_light" : "nav.toggle_dark"));
    btn.title = t(isDark ? "nav.toggle_light" : "nav.toggle_dark");
    // Remove data-i18n since content is now SVG, not text
    btn.removeAttribute("data-i18n");
  });
}

// ── Autocomplete helper ──────────────────────────────────────
function setupAutocomplete(input, suggestions) {
  if (!suggestions.length) return;
  const list = document.createElement("datalist");
  list.id = "ac_" + Math.random().toString(36).slice(2);
  suggestions.forEach(s => {
    const opt = document.createElement("option");
    opt.value = s;
    list.appendChild(opt);
  });
  document.body.appendChild(list);
  input.setAttribute("list", list.id);
}

// ── HTML escape utility ──────────────────────────────────────
function escHtml(str) {
  if (!str) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

// ── Init on every page ───────────────────────────────────────
function detectBrowserTheme() {
  // Only called when no stored preference exists
  if (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) {
    return "dark";
  }
  return "light";
}

function detectBrowserLang() {
  // Only called when no stored preference exists
  const nav = navigator.language || navigator.languages?.[0] || "fr-CA";
  // French variants → fr-CA, everything else → en-CA
  return nav.toLowerCase().startsWith("fr") ? "fr-CA" : "en-CA";
}

function initPage() {
  // Theme: stored preference first, then browser default
  const storedTheme = localStorage.getItem(LS.THEME);
  applyTheme(storedTheme || detectBrowserTheme());

  // Lang: stored preference first, then browser default
  const storedLang = localStorage.getItem(LS.LANG);
  // persist=false on auto-detect so we don't lock in browser default
  applyLanguage(storedLang || detectBrowserLang(), !!storedLang);

  // Wire up toggle buttons
  document.querySelectorAll(".theme-toggle-btn").forEach(btn => {
    btn.addEventListener("click", toggleTheme);
  });
  document.querySelectorAll(".lang-toggle-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const target = btn.getAttribute("data-lang-target") || (getCurrentLang() === "fr-CA" ? "en-CA" : "fr-CA");
      // Persist explicitly — user override
      localStorage.setItem(LS.LANG, target);
      applyLanguage(target);
    });
  });

  // Listen for OS theme changes (only if no stored preference)
  window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", e => {
    if (!localStorage.getItem(LS.THEME)) {
      applyTheme(e.matches ? "dark" : "light");
      updateThemeButton();
    }
  });
}

// ── Reset / start over ────────────────────────────────────────
function clearAllData(keepPrefs = true) {
  const theme = localStorage.getItem(LS.THEME);
  const lang  = localStorage.getItem(LS.LANG);

  // Clear all internship keys
  Object.values(LS).forEach(key => localStorage.removeItem(key));
  clearReportData();

  // Restore preferences if requested
  if (keepPrefs) {
    if (theme) localStorage.setItem(LS.THEME, theme);
    if (lang)  localStorage.setItem(LS.LANG,  lang);
  }
}

// ── Reset modal ───────────────────────────────────────────────
function openResetModal() {
  const modal = document.getElementById("reset-modal");
  if (!modal) return;
  // Clear input each time it opens
  const input = document.getElementById("reset-confirm-input");
  if (input) input.value = "";
  const btn = document.getElementById("reset-confirm-btn");
  if (btn) btn.disabled = true;
  modal.classList.remove("hidden");
  // Focus the input after a brief delay so the transition settles
  setTimeout(() => input?.focus(), 80);
  applyLanguage(getCurrentLang());
}

function closeResetModal(event) {
  // Close if clicking the overlay itself, not the modal box
  if (event && event.target !== document.getElementById("reset-modal")) return;
  document.getElementById("reset-modal")?.classList.add("hidden");
}

function checkResetConfirm(value) {
  const lang = getCurrentLang();
  // Accept either language's confirmation word
  const required = lang === "fr-CA" ? "RECOMMENCER" : "RESET";
  const btn = document.getElementById("reset-confirm-btn");
  if (btn) btn.disabled = value.trim().toUpperCase() !== required;
}

function executeReset() {
  const keepPrefs = document.getElementById("reset-keep-prefs")?.checked !== false;
  clearAllData(keepPrefs);
  document.getElementById("reset-modal")?.classList.add("hidden");
  // Redirect to index to start fresh
  window.location.href = "index.html";
}

// ── Making-of footer toggle ───────────────────────────────────
function toggleMakingOf(btn) {
  const body = btn.nextElementSibling;
  const open = btn.getAttribute("aria-expanded") === "true";
  btn.setAttribute("aria-expanded", String(!open));
  if (open) {
    // Animate close
    body.style.maxHeight = body.scrollHeight + "px";
    requestAnimationFrame(() => {
      body.style.maxHeight = "0";
      body.addEventListener("transitionend", () => {
        body.hidden = true;
        body.style.maxHeight = "";
      }, { once: true });
    });
  } else {
    body.hidden = false;
    body.style.maxHeight = "0";
    requestAnimationFrame(() => {
      body.style.maxHeight = body.scrollHeight + "px";
      body.addEventListener("transitionend", () => {
        body.style.maxHeight = "";
      }, { once: true });
    });
  }
}
