// ============================================================
// app.js — Shared logic: storage, UUID, data model, merge
// ============================================================

// ── Settings (edit these variables to change defaults) ───────
const SETTINGS = {
  GRAYZONE_THRESHOLD_PCT: 20,      // % of day that triggers undocumented prompt
  IDLE_REMINDER_MINUTES: 120,       // minutes before idle save reminder
  SCHEMA_VERSION: "1.4",
};

// ── Default activity types ───────────────────────────────────
const DEFAULT_ACTIVITY_TYPES = [
  // Work-type categories — cross-disciplinary
  // Colors pass WCAG 3:1 on white (light mode) and have dark-mode variants in CSS
  { type_id: "sys-programming",   label_key: "activity.programming",   color: "#00587c", system: true },
  { type_id: "sys-design",        label_key: "activity.design",        color: "#9b3fd4", system: true },
  { type_id: "sys-research",      label_key: "activity.research",      color: "#2e8a5e", system: true },
  { type_id: "sys-planning",      label_key: "activity.planning",      color: "#9a6c00", system: true },
  { type_id: "sys-data-analysis", label_key: "activity.data_analysis", color: "#1e6e8e", system: true },
  { type_id: "sys-debugging",     label_key: "activity.debugging",     color: "#c41a23", system: true },
  { type_id: "sys-production",    label_key: "activity.production",    color: "#7341a0", system: true },
  { type_id: "sys-testing",       label_key: "activity.testing",       color: "#3e6b00", system: true },
  { type_id: "sys-documentation", label_key: "activity.documentation", color: "#784619", system: true },
  { type_id: "sys-client-work",   label_key: "activity.client_work",   color: "#c24800", system: true },
  // Non-work categories
  { type_id: "sys-meeting",       label_key: "activity.meeting",       color: "#4a38d4", system: true },
  { type_id: "sys-training",      label_key: "activity.training",      color: "#2e4a00", system: true },
  { type_id: "sys-admin",         label_key: "activity.admin",         color: "#3a3f42", system: true },
  { type_id: "sys-break",         label_key: "activity.break",         color: "#8a7a5a", system: true },
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
  CACHE:         "internship_cache",    // profile, known people/tools
  DATA:          "internship_data",     // current internship JSON
  REPORT_DATA:   "internship_report",   // merged report data (survives page nav)
  SETTINGS:      "internship_settings", // user-overridden settings
  THEME:         "internship_theme",
  LANG:          "lang",
  DOWNLOADS:     "internship_downloads",      // { "YYYY-MM-DD": ["c"|"d"|"w"|"f"] } — survives reset
  UPLOAD_REMIND: "internship_upload_remind",  // { "c"|"d"|"w"|"f": "YYYY-MM-DD"|"always"|null }
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

  // v1.2 → v1.3: add internship_course_code if missing (default: "generic")
  if (data.context && data.context.internship_course_code === undefined) {
    data.context.internship_course_code = "generic";
  }

  // v1.3 → v1.4: work schedule fields
  if (data.context) {
    // hours_per_day (float) → work_hours { h, m }
    if (data.context.work_hours === undefined) {
      const hpd = parseFloat(data.context.hours_per_day) || 7;
      data.context.work_hours = {
        h: Math.floor(hpd),
        m: Math.round((hpd % 1) * 60),
      };
      // Keep hours_per_day for backward compat with hub.js calculations
      // but derive it from work_hours going forward
    }
    if (data.context.work_days === undefined) {
      data.context.work_days = [1, 2, 3, 4, 5]; // Mon–Fri
    }
    if (data.context.planned_absences === undefined) {
      data.context.planned_absences = [];
    }
    if (data.context.calendar_week_start === undefined) {
      data.context.calendar_week_start = 1; // Monday
    }
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

  const nameSlug = (data.profile.student_id || slugify(data.profile.full_name) || "stage");
  const filename = `${nameSlug}_${log.date}_r${log.revision}.json`;
  downloadJSON(data, filename);
}

// ── Config export / import (for switching computers) ─────────
function exportConfig() {
  const data = loadData();
  if (!data?.profile?.full_name) return;

  const config = {
    meta: {
      type:             "config",
      schema_version:   data.meta?.schema_version || "1.2",
      student_uuid:     data.meta?.student_uuid,
      exported_at:      new Date().toISOString(),
    },
    profile:        data.profile,
    pathway:        data.pathway,
    context:        data.context,
    people:         data.people        || [],
    projects:       data.projects      || [],
    activity_types: data.activity_types|| [],
    tools:          data.tools         || [],
  };

  const slug = slugify(data.profile.full_name);
  const lang = getCurrentLang();
  const suffix = lang === "fr-CA" ? "config_journal-de-stage" : "config_internship-log";
  downloadJSON(config, `${slug}_${suffix}.json`);
  stampDownload("c"); // record config export for calendar and reminder tracking
}

function importConfig(file) {
  if (!file) return;
  const reader = new FileReader();
  reader.onload = e => {
    try {
      const cfg = JSON.parse(e.target.result);
      if (cfg.meta?.type !== "config" && !cfg.profile?.full_name) {
        alert(t("error.not_config") || "Fichier de configuration non valide.");
        return;
      }
      // Load existing data (if any) and overlay config fields
      const existing = loadData() || {};
      const merged = {
        ...existing,
        meta: {
          ...existing.meta,
          student_uuid:   cfg.meta?.student_uuid || existing.meta?.student_uuid,
          schema_version: cfg.meta?.schema_version || "1.2",
          last_modified:  new Date().toISOString(),
        },
        profile:        cfg.profile,
        pathway:        cfg.pathway        || existing.pathway,
        context:        cfg.context        || existing.context,
        people:         cfg.people         || existing.people         || [],
        projects:       cfg.projects       || existing.projects       || [],
        activity_types: cfg.activity_types || existing.activity_types || [],
        tools:          cfg.tools          || existing.tools          || [],
        logs:           existing.logs      || [],  // keep existing logs
        reflection:     existing.reflection|| null,
        todos:          existing.todos     || [],
      };
      saveData(merged);
      updateCache(merged);
      // Signal success and redirect to log
      sessionStorage.setItem("config_imported", "1");
      window.location.href = "log.html";
    } catch {
      alert(t("error.not_config") || "Erreur lors de la lecture du fichier.");
    }
  };
  reader.readAsText(file);
}


// ── SVG Pie chart helper (shared) ───────────────────────────
function buildPieChart(container, slices) {
  // slices: [{label, value, color}]
  if (!container) return;
  const total = slices.reduce((s, x) => s + x.value, 0);
  if (!total) { container.innerHTML = `<p class="text-muted">—</p>`; return; }

  const R = 120, cx = 160, cy = 160;
  let angle = -Math.PI / 2; // start at top
  const paths = [];

  slices.forEach(slice => {
    if (!slice.value) return;
    const sweep = (slice.value / total) * 2 * Math.PI;
    const x1 = cx + R * Math.cos(angle);
    const y1 = cy + R * Math.sin(angle);
    const x2 = cx + R * Math.cos(angle + sweep);
    const y2 = cy + R * Math.sin(angle + sweep);
    const large = sweep > Math.PI ? 1 : 0;
    // Label position
    const midAngle = angle + sweep / 2;
    const lr = R * 0.65;
    const lx = cx + lr * Math.cos(midAngle);
    const ly = cy + lr * Math.sin(midAngle);
    const pct = Math.round((slice.value / total) * 100);

    paths.push(`
      <path d="M${cx},${cy} L${x1.toFixed(2)},${y1.toFixed(2)}
               A${R},${R} 0 ${large},1 ${x2.toFixed(2)},${y2.toFixed(2)} Z"
            fill="${slice.color}" stroke="var(--bg-card)" stroke-width="2">
        <title>${escHtml(slice.label)}: ${pct}%</title>
      </path>
      ${pct >= 5 ? `<text x="${lx.toFixed(2)}" y="${ly.toFixed(2)}"
        text-anchor="middle" dominant-baseline="middle"
        font-size="13" font-weight="500" fill="${bestTextColor(slice.color)}"
        style="pointer-events:none">${pct}%</text>` : ''}
    `);
    angle += sweep;
  });

  const legendItems = slices.filter(s => s.value > 0).map(s => {
    const pct = Math.round((s.value / total) * 100);
    return `<div class="legend-item">
      <div class="legend-swatch" style="background:${s.color}"></div>
      <span>${escHtml(s.label)}</span>
      <span style="margin-left:auto;color:var(--text-muted);font-size:1.2rem">${s.sublabel || ''} · ${pct}%</span>
    </div>`;
  }).join("");

  container.innerHTML = `
    <div style="display:flex;align-items:flex-start;gap:var(--sp-8);flex-wrap:wrap">
      <svg viewBox="0 0 320 320" width="240" height="240" style="flex-shrink:0;overflow:visible">
        ${paths.join("")}
      </svg>
      <div class="timeline-legend" style="flex:1;min-width:18rem;align-content:start;margin-top:var(--sp-3)">
        ${legendItems}
      </div>
    </div>
  `;
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

// ── Download history ─────────────────────────────────────────
// Stored in LS.DOWNLOADS: { "YYYY-MM-DD": ["d"|"w"|"f"] }
// Survives data resets (not cleared by executeReset).
// "d" = daily log, "w" = weekly report, "f" = final/full report

function getDownloads() {
  try {
    const raw = localStorage.getItem(LS.DOWNLOADS);
    return raw ? JSON.parse(raw) : {};
  } catch { return {}; }
}

function saveDownloads(obj) {
  try { localStorage.setItem(LS.DOWNLOADS, JSON.stringify(obj)); } catch {}
}

// Stamps a download event for today's date.
// type: "d" | "w" | "f"
function stampDownload(type) {
  const today = new Date().toISOString().slice(0, 10);
  const dl = getDownloads();
  if (!dl[today]) dl[today] = [];
  if (!dl[today].includes(type)) dl[today].push(type);
  saveDownloads(dl);
}

// ── Work hours helpers ────────────────────────────────────────
// work_hours is stored as { h: 7, m: 30 }.
// Returns total minutes.
function workHoursToMinutes(wh) {
  if (!wh) return 450; // 7h30 default
  return (wh.h || 0) * 60 + (wh.m || 0);
}

// Returns a display string like "7h30" or "8h00".
function workHoursToString(wh) {
  if (!wh) return "7h30";
  const h = wh.h || 0;
  const m = wh.m || 0;
  return `${h}h${String(m).padStart(2, "0")}`;
}

// Returns decimal hours for backward compatibility with hub.js expected_hours math.
function workHoursToDecimal(wh) {
  return workHoursToMinutes(wh) / 60;
}

// ── Merge logic ──────────────────────────────────────────────
function mergeInternshipFiles(files) {
  const result = { valid: false, data: null, warnings: [], errors: [], conflicts: [] };

  if (!files.length) {
    result.errors.push("error.no_files");
    return result;
  }

  // Separate by file type
  const reflectionFiles = files.filter(f => f.meta?.type === "reflection");
  const configFiles     = files.filter(f => f.meta?.type === "config");
  const mainFiles       = files.filter(f => !f.meta?.type || f.meta.type === "internship");

  if (configFiles.length && !mainFiles.length) {
    result.errors.push("error.config_not_log");
    return result;
  }

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
  const base = found?.color || "#9ca3a5";
  // In dark mode, check for a CSS variable override (--act-<name>)
  // These are defined in style.css under [data-theme="dark"] for legibility
  const cssVar = typeId.replace("sys-", "--act-");
  const cssVal = getComputedStyle(document.documentElement).getPropertyValue(cssVar).trim();
  return cssVal || base;
}

// Return black or white depending on which has better contrast against the bg
function bestTextColor(hexBg) {
  try {
    const h = hexBg.replace(/[^0-9a-fA-F]/g, "").slice(0, 6);
    if (h.length < 6) return "#ffffff";
    const r = parseInt(h.slice(0,2),16)/255;
    const g = parseInt(h.slice(2,4),16)/255;
    const b = parseInt(h.slice(4,6),16)/255;
    const f = x => x <= 0.04045 ? x/12.92 : Math.pow((x+0.055)/1.055, 2.4);
    const L = 0.2126*f(r) + 0.7152*f(g) + 0.0722*f(b);
    return L > 0.179 ? "#07181e" : "#ffffff";
  } catch { return "#ffffff"; }
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
function slugify(str) {
  return (str || "").toLowerCase()
    .normalize("NFD").replace(/[̀-ͯ]/g, "")  // strip accents
    .replace(/[^a-z0-9]+/g, "_").replace(/^_|_$/g, "")
    .slice(0, 24) || "stage";
}

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

  // Clear all internship keys (explicit list covers any cached older versions)
  Object.values(LS).forEach(key => localStorage.removeItem(key));
  // Belt-and-suspenders: remove by hardcoded name in case LS object was cached
  ["internship_data","internship_cache","internship_report",
   "internship_settings","internship_tour_seen"].forEach(k => localStorage.removeItem(k));

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
  // Flag so any page can detect we just reset (sessionStorage survives redirect within tab)
  sessionStorage.setItem("just_reset", "1");
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

// ── Upload reminder system ────────────────────────────────────
// Tracks when the student last dismissed the upload reminder per file type.
// Format: { "c": "YYYY-MM-DD" | "always" | null, "d": ..., "w": ..., "f": ... }
// "always"    → remind every time (user opted in)
// "YYYY-MM-DD" → snoozed until 30 days after that date
// null / absent → never dismissed → always show


function getUploadReminders() {
  try {
    const raw = localStorage.getItem(LS.UPLOAD_REMIND);
    return raw ? JSON.parse(raw) : {};
  } catch { return {}; }
}

function saveUploadReminders(obj) {
  try { localStorage.setItem(LS.UPLOAD_REMIND, JSON.stringify(obj)); } catch {}
}

// Returns true if the upload reminder for this type should be shown.
// type: "c" | "d" | "w" | "f"
function shouldShowUploadReminder(type) {
  const reminders = getUploadReminders();
  const val = reminders[type];

  if (val === "always") return true;   // user explicitly wants it every time

  // Suppress if already shown this session for this type (unless always-mode).
  // We track this in sessionStorage to avoid spamming across multiple downloads
  // in the same browser session.
  const sessionKey = `remind_shown_${type}`;
  if (sessionStorage.getItem(sessionKey)) return false;

  if (!val) return true;               // never dismissed before

  // Snoozed: check if 30-day window has passed
  const snoozedOn = new Date(val);
  const daysSince = (Date.now() - snoozedOn) / 86400000;
  return daysSince >= 30;
}

// Snooze the reminder for 30 days.
function snoozeUploadReminder(type) {
  const r = getUploadReminders();
  r[type] = new Date().toISOString().slice(0, 10);
  saveUploadReminders(r);
}

// Set reminder to fire every time.
function alwaysRemindUpload(type) {
  const r = getUploadReminders();
  r[type] = "always";
  saveUploadReminders(r);
}

// ── Upload reminder modal ─────────────────────────────────────
// Shows a dismissible card prompting the student to upload a file
// to the supervisor's form. Respects snooze/always preferences.
//
// type:     "c" | "d" | "w" | "f"
// isUpdate: true if this is a re-upload prompt (absences changed etc.)
//
// The form URL is read from a <meta name="upload-form-url"> tag so
// it can be configured per deployment without touching JS.

const UPLOAD_FORM_URL = "https://forms.cloud.microsoft/r/LE4Dc2gZaE";

function getUploadFormUrl() {
  const meta = document.querySelector('meta[name="upload-form-url"]');
  return meta?.content || UPLOAD_FORM_URL;
}

function showUploadReminder(type, isUpdate = false) {
  if (!shouldShowUploadReminder(type)) return;

  // Mark as shown this session (suppresses repeat toasts unless always-mode)
  sessionStorage.setItem(`remind_shown_${type}`, "1");

  // Remove any existing reminder
  document.getElementById("upload-reminder-overlay")?.remove();

  const lang = getCurrentLang();
  const isFr = lang === "fr-CA";

  const titles = {
    c: t("remind.config_title"),
    d: t("remind.daily_title"),
    w: t("remind.weekly_title"),
    f: t("remind.final_title"),
  };
  const hints = {
    c: isUpdate ? t("remind.config_hint_update") : t("remind.config_hint"),
    d: t("remind.daily_hint"),
    w: t("remind.weekly_hint"),
    f: t("remind.final_hint"),
  };
  const icons = { c: "⚙️", d: "📄", w: "📅", f: "🏅" };

  const title   = titles[type] || "";
  const hint    = hints[type]  || "";
  const icon    = icons[type]  || "📤";
  const formUrl = getUploadFormUrl();

  // For config update: add an export button first
  const exportBtn = (type === "c" && isUpdate) ? `
    <button class="btn btn--secondary"
      onclick="exportConfig();document.getElementById('upload-reminder-overlay').remove()"
      style="margin-bottom:var(--sp-3)">
      ${t("remind.config_export_btn")}
    </button>` : "";

  const html = `
    <div id="upload-reminder-overlay"
      style="position:fixed;bottom:var(--sp-5);right:var(--sp-5);z-index:9000;
             max-width:44rem;width:calc(100% - var(--sp-10))">
      <div style="background:var(--bg-card);border-radius:var(--r-xl);
                  box-shadow:var(--shadow-xl);border:1.5px solid var(--accent);
                  padding:var(--sp-5);display:flex;gap:var(--sp-4)">
        <span style="font-size:2.8rem;flex-shrink:0;line-height:1">${icon}</span>
        <div style="flex:1;min-width:0">
          <div style="font-size:1.5rem;font-weight:700;margin-bottom:var(--sp-2)">${title}</div>
          <p style="font-size:1.3rem;color:var(--text-muted);margin-bottom:var(--sp-4)">${hint}</p>
          ${exportBtn}
          <div style="display:flex;flex-wrap:wrap;gap:var(--sp-3)">
            <a href="${formUrl}" target="_blank" rel="noopener"
               class="btn btn--primary btn--sm"
               onclick="snoozeUploadReminder('${type}')"
            >${t("remind.form_btn")}</a>
            <button class="btn btn--ghost btn--sm"
              onclick="snoozeUploadReminder('${type}');
                       document.getElementById('upload-reminder-overlay').remove()">
              ${t("remind.snooze")}
            </button>
            <button class="btn btn--ghost btn--sm"
              style="color:var(--text-subtle)"
              onclick="alwaysRemindUpload('${type}');
                       document.getElementById('upload-reminder-overlay').remove()">
              ${t("remind.always")}
            </button>
            <button class="btn btn--ghost btn--sm"
              style="margin-left:auto;color:var(--text-subtle)"
              onclick="document.getElementById('upload-reminder-overlay').remove()">
              ${t("remind.dismiss")}
            </button>
          </div>
        </div>
      </div>
    </div>`;

  document.body.insertAdjacentHTML("beforeend", html);

  // Auto-dismiss after 90 seconds
  setTimeout(() => {
    document.getElementById("upload-reminder-overlay")?.remove();
  }, 90000);
}

// ── Global file sidebar ───────────────────────────────────────
// A collapsible right-side panel available on all student pages.
// Drop any internship JSON (daily, weekly, config, full) here;
// the sidebar detects the type, merges it into localStorage,
// then calls the page-specific refresh hook onSidebarLoad().

function initFileSidebar() {
  const sidebar = document.getElementById("file-sidebar");
  if (!sidebar) return;

  const tab      = sidebar.querySelector(".file-sidebar__tab");
  const dropzone = sidebar.querySelector(".file-sidebar__dropzone");
  const input    = sidebar.querySelector(".file-sidebar__input");

  // Toggle open/closed
  tab.addEventListener("click", () => {
    sidebar.classList.toggle("is-open");
  });

  // Drop zone interaction
  dropzone.addEventListener("click", () => input.click());

  dropzone.addEventListener("dragover", e => {
    e.preventDefault();
    dropzone.classList.add("drag-over");
  });
  dropzone.addEventListener("dragleave", () => {
    dropzone.classList.remove("drag-over");
  });
  dropzone.addEventListener("drop", e => {
    e.preventDefault();
    dropzone.classList.remove("drag-over");
    sidebarLoadFiles(e.dataTransfer.files);
  });

  input.addEventListener("change", () => {
    if (input.files.length) sidebarLoadFiles(input.files);
    input.value = "";
  });

  // Also intercept page-level drops so students can drop anywhere
  document.addEventListener("dragover",  e => e.preventDefault());
  document.addEventListener("drop", e => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    if (files.length) {
      sidebar.classList.add("is-open");
      sidebarLoadFiles(files);
    }
  });

  // Populate student info on load
  _sidebarRefreshWho();
}

function _sidebarRefreshWho() {
  const el = document.getElementById("sidebar-who");
  if (!el) return;
  const d = loadData();
  if (!d?.profile?.full_name) {
    el.textContent = "";
    el.style.display = "none";
    return;
  }
  const lang = getCurrentLang();
  const isFr = lang === "fr-CA";
  const ctx   = d.context || {};
  el.style.display = "";
  el.innerHTML = `
    <div style="font-weight:600">${escHtml(d.profile.full_name)}</div>
    <div style="font-size:1.1rem;color:var(--text-subtle)">
      ${ctx.start_date || ""}${ctx.scheduled_end_date ? " → " + ctx.scheduled_end_date : ""}
    </div>
    <div style="font-size:1.1rem;color:var(--text-subtle)">
      ${(d.logs||[]).length} ${isFr ? "journaux" : "logs"}
      · ${isFr ? "dernier" : "last"}: ${(d.logs||[]).slice(-1)[0]?.date || "—"}
    </div>`;
}

function _sidebarSetStatus(msg, type = "info") {
  const el = document.getElementById("sidebar-status");
  if (!el) return;
  el.className = `file-sidebar__status status-${type}`;
  el.innerHTML = msg;
}

function sidebarLoadFiles(fileList) {
  const files = Array.from(fileList).filter(f => f.name.endsWith(".json"));
  if (!files.length) {
    _sidebarSetStatus(t("error.no_files") || "Aucun fichier JSON trouvé.", "err");
    return;
  }

  _sidebarSetStatus("⏳ " + (getCurrentLang() === "fr-CA" ? "Chargement…" : "Loading…"), "info");

  const readers = files.map(f => new Promise(res => {
    const r = new FileReader();
    r.onload = e => {
      try { res({ name: f.name, data: JSON.parse(e.target.result) }); }
      catch { res(null); }
    };
    r.readAsText(f);
  }));

  Promise.all(readers).then(parsed => {
    const valid = parsed.filter(p => p?.data);
    if (!valid.length) {
      _sidebarSetStatus(t("error.no_files") || "Fichiers non reconnus.", "err");
      return;
    }

    const isFr  = getCurrentLang() === "fr-CA";
    const counts = { config: 0, log: 0, merged: 0, error: 0 };

    // Separate config files from log files
    const configs  = valid.filter(p => p.data.meta?.type === "config");
    const logFiles = valid.filter(p => p.data.meta?.type !== "config");

    // ── Process log/full files ────────────────────────────────
    if (logFiles.length) {
      const existing = loadData();

      if (logFiles.length === 1 && !existing) {
        // First load — no existing data — just save directly
        const d = logFiles[0].data;
        if (d.context?.start_date && d.profile?.full_name) {
          saveData(d);
          updateCache(d);
          counts.log++;
        } else {
          counts.error++;
        }
      } else if (logFiles.length >= 1 && existing) {
        // Merge incoming logs into existing data
        const allData = [existing, ...logFiles.map(p => p.data)];
        const merged  = mergeInternshipFiles(allData);
        if (merged.valid) {
          saveData(merged.data);
          updateCache(merged.data);
          counts.merged = logFiles.length;
        } else {
          counts.error++;
        }
      } else if (logFiles.length > 1 && !existing) {
        // Multiple files, no existing — merge them together
        const merged = mergeInternshipFiles(logFiles.map(p => p.data));
        if (merged.valid) {
          saveData(merged.data);
          updateCache(merged.data);
          counts.merged = logFiles.length;
        } else {
          counts.error++;
        }
      }
    }

    // ── Process config files ──────────────────────────────────
    configs.forEach(({ data: cfg }) => {
      if (!cfg.context?.start_date) { counts.error++; return; }

      const existing = loadData();
      if (existing) {
        // Overlay config context fields onto existing data
        const merged = {
          ...existing,
          meta: {
            ...existing.meta,
            student_uuid:   cfg.meta?.student_uuid || existing.meta?.student_uuid,
            schema_version: cfg.meta?.schema_version || existing.meta?.schema_version,
            last_modified:  new Date().toISOString(),
          },
          profile:        cfg.profile        || existing.profile,
          pathway:        cfg.pathway        || existing.pathway,
          context: {
            ...existing.context,
            planned_absences:    cfg.context.planned_absences    ?? existing.context?.planned_absences    ?? [],
            work_days:           cfg.context.work_days           ?? existing.context?.work_days           ?? [1,2,3,4,5],
            work_hours:          cfg.context.work_hours          ?? existing.context?.work_hours,
            calendar_week_start: cfg.context.calendar_week_start ?? existing.context?.calendar_week_start ?? 1,
            // Overlay non-schedule fields too
            total_hours_target:  cfg.context.total_hours_target  ?? existing.context?.total_hours_target,
            internship_course_code: cfg.context.internship_course_code || existing.context?.internship_course_code,
          },
          people:         cfg.people         || existing.people         || [],
          projects:       cfg.projects       || existing.projects       || [],
          activity_types: cfg.activity_types || existing.activity_types || [],
          tools:          cfg.tools          || existing.tools          || [],
          logs:           existing.logs      || [],
          reflection:     existing.reflection || null,
          todos:          existing.todos     || [],
        };
        saveData(merged);
        updateCache(merged);
      } else {
        // No existing data — bootstrap from config (no logs yet)
        const bootstrap = {
          meta: {
            schema_version: cfg.meta?.schema_version || "1.4",
            student_uuid:   cfg.meta?.student_uuid   || generateUUID(),
            created_at:     new Date().toISOString(),
            last_modified:  new Date().toISOString(),
            app_version:    "1.0.0",
          },
          profile:        cfg.profile || {},
          pathway:        cfg.pathway || "company",
          context:        cfg.context || {},
          people:         cfg.people         || [],
          projects:       cfg.projects       || [],
          activity_types: cfg.activity_types || [],
          tools:          cfg.tools          || [],
          todos:          [],
          logs:           [],
          reflection:     null,
        };
        saveData(bootstrap);
        updateCache(bootstrap);
      }
      counts.config++;
    });

    // ── Summary status ────────────────────────────────────────
    const parts = [];
    const total = counts.log + counts.merged + counts.config;
    if (counts.log || counts.merged) {
      const n = counts.log + counts.merged;
      parts.push(`${n} ${isFr ? (n > 1 ? "journaux" : "journal") : (n > 1 ? "logs" : "log")}`);
    }
    if (counts.config) {
      parts.push(`${counts.config} config`);
    }
    if (counts.error) {
      parts.push(`⚠ ${counts.error} ${isFr ? "erreur(s)" : "error(s)"}`);
    }

    const statusType = counts.error && !total ? "err" : total ? "ok" : "err";
    const verb = isFr ? "chargé·s" : "loaded";
    _sidebarSetStatus(
      parts.length ? `✓ ${parts.join(" + ")} ${verb}.` : (isFr ? "Aucun fichier valide." : "No valid files."),
      statusType
    );

    _sidebarRefreshWho();

    // ── Notify page ───────────────────────────────────────────
    if (typeof onSidebarLoad === "function") {
      onSidebarLoad();
    }
  });
}
