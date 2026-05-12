"use strict";

// ── State ─────────────────────────────────────────────────────
let teacherName    = "";   // normalised for matching
let teacherNameRaw = "";   // display form
let teacherStudents = [];  // all loaded rows (same shape as hub buildRow output)
let teacherFiltered = [];  // rows currently visible
let manuallyShown   = new Set(); // UUIDs explicitly unhidden by the teacher

const LS_TEACHER = "internship_teacher_view";

// ── Init ──────────────────────────────────────────────────────
document.addEventListener("DOMContentLoaded", () => {
  initPage();
  applyLanguage(getCurrentLang());

  // Restore saved teacher state
  try {
    const saved = JSON.parse(localStorage.getItem(LS_TEACHER) || "null");
    if (saved?.name_raw) {
      teacherNameRaw = saved.name_raw;
      teacherName    = normalise(saved.name_raw);
      manuallyShown  = new Set(saved.manually_shown || []);
      showDashboard();
      // Restore students if any were saved
      if (saved.students?.length) {
        teacherStudents = saved.students;
        renderTeacherDashboard();
      }
    }
  } catch { /* fresh start */ }

  // Drag-and-drop on the whole page
  document.addEventListener("dragover",  e => e.preventDefault());
  document.addEventListener("drop", e => {
    e.preventDefault();
    if (e.target.closest("#teacher-drop-inline") || !teacherNameRaw) return;
    loadTeacherFiles(e.dataTransfer.files);
  });
});

// ── Name normalisation ────────────────────────────────────────
function normalise(s) {
  return (s || "")
    .toLowerCase()
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .trim();
}

// ── Identity screen ───────────────────────────────────────────
function confirmTeacherName() {
  const input = document.getElementById("teacher-name-input");
  const val = input?.value.trim();
  if (!val) { input?.focus(); return; }
  teacherNameRaw = val;
  teacherName    = normalise(val);
  persistTeacherState();
  showDashboard();
}

function changeTeacherName() {
  document.getElementById("teacher-identity-screen").style.display = "";
  document.getElementById("teacher-dashboard-wrap").style.display  = "none";
  const input = document.getElementById("teacher-name-input");
  if (input) { input.value = teacherNameRaw; input.focus(); }
}

function showDashboard() {
  document.getElementById("teacher-identity-screen").style.display = "none";
  document.getElementById("teacher-dashboard-wrap").style.display  = "";
  const greeting = document.getElementById("teacher-greeting");
  if (greeting) greeting.textContent = teacherNameRaw;
}

// ── File loading ──────────────────────────────────────────────
function loadTeacherFiles(fileList) {
  const files = Array.from(fileList).filter(f => f.name.endsWith(".json"));
  if (!files.length) return;

  const readers = files.map(f => new Promise(res => {
    const r = new FileReader();
    r.onload = e => {
      try { res({ data: JSON.parse(e.target.result), name: f.name }); }
      catch (err) {
        console.error(`[LCI Teacher] Failed to parse JSON: "${f.name}"`, err);
        res(null);
      }
    };
    r.readAsText(f);
  }));

  Promise.all(readers).then(parsed => {
    let loaded = 0, skipped = 0;

    parsed.forEach(p => {
      if (!p?.data) { skipped++; return; }

      const d    = p.data;
      const type = detectFileType(d);
      console.info(`[LCI Teacher] "${p.name}" → type: ${type}`);

      if (type === "config") {
        // Config-only: create or update stub row
        const uid = d.meta?.student_uuid || d.profile?.student_id;
        if (!uid || !d.profile?.full_name) {
          console.warn(`[LCI Teacher] Config "${p.name}" skipped — missing UUID or full_name.`);
          skipped++; return;
        }
        const existing = teacherStudents.findIndex(s => s.uuid === uid);
        if (existing >= 0) {
          // Overlay context onto existing row
          const stub = { ...teacherStudents[existing].raw, context: { ...teacherStudents[existing].raw?.context, ...d.context } };
          teacherStudents[existing] = buildRow(stub);
        } else {
          const stub = { meta: { ...d.meta, student_uuid: uid }, profile: d.profile, pathway: d.pathway || "company", context: d.context || {}, people: d.people || [], projects: d.projects || [], activity_types: d.activity_types || [], tools: d.tools || [], logs: [], reflection: null, todos: [] };
          teacherStudents.push(buildRow(stub));
        }
        loaded++; return;
      }

      if (type === "unknown" || !d.profile?.full_name) {
        console.warn(`[LCI Teacher] "${p.name}" skipped — unknown type or missing full_name.`);
        skipped++; return;
      }

      // Log / weekly / full file — merge with existing if same UUID
      const uid = d.meta?.student_uuid || d.profile?.student_id || Math.random().toString(36).slice(2);
      const existing = teacherStudents.findIndex(s => s.uuid === uid);
      if (existing >= 0) {
        const merged = mergeInternshipFiles([teacherStudents[existing].raw || teacherStudents[existing], d]);
        if (merged.valid) {
          teacherStudents[existing] = buildRow(merged.data);
        } else {
          console.warn(`[LCI Teacher] Merge failed for UUID ${uid} — keeping existing.`, merged.errors);
        }
      } else {
        teacherStudents.push(buildRow(d));
      }
      loaded++;
    });

    console.group(`[LCI Teacher] Load complete — ${loaded} file(s) accepted, ${skipped} skipped`);
    console.info("Students:", teacherStudents.map(s => ({
      name: s.name, uuid: s.uuid, professor: s.raw?.profile?.supervising_professor || s.supervising_professor,
    })));
    console.groupEnd();

    setTeacherStatus(`${teacherStudents.length} étudiant·e${teacherStudents.length > 1 ? "·s" : ""} chargé·e${teacherStudents.length > 1 ? "·s" : ""}.`);
    document.getElementById("btn-teacher-export").style.display = "";
    document.getElementById("btn-teacher-clear").style.display  = "";
    document.getElementById("teacher-dashboard").style.display  = "block";
    document.getElementById("teacher-upload-strip").classList.add("hub-upload-strip--loaded");

    persistTeacherState();
    renderTeacherDashboard();
  });
}

// ── Match logic ───────────────────────────────────────────────
// Returns "matched" | "blank" | "unmatched"
// Matching rules (all comparisons on normalised strings):
//   - exact match always counts
//   - if teacherName is ≥ 4 chars: the stored field contains teacherName, OR teacherName contains the stored field (≥4 chars)
function matchStatus(row) {
  const rawProf = (row.raw?.profile?.supervising_professor || row.supervising_professor || "").trim();
  if (!rawProf) return "blank";

  const normProf    = normalise(rawProf);
  const normTeacher = teacherName;

  // Exact match
  if (normProf === normTeacher) return "matched";

  // Partial match — only when the query side is at least 4 chars
  if (normTeacher.length >= 4) {
    // Teacher name appears in stored field  ("Marie" inside "Marie Tremblay")
    if (normProf.includes(normTeacher))    return "matched";
    // Stored field appears in teacher name ("Tremblay" inside "Marie Tremblay")
    if (normTeacher.includes(normProf) && normProf.length >= 4) return "matched";
  }

  return "unmatched";
}

// ── Render ────────────────────────────────────────────────────
function renderTeacherDashboard() {
  applyTeacherFilters();
  renderTeacherAWOL();
}

function applyTeacherFilters() {
  const query      = normalise(document.getElementById("teacher-search")?.value || "");
  const showHidden = document.getElementById("teacher-show-hidden")?.checked || false;

  teacherFiltered = teacherStudents.filter(row => {
    const status = matchStatus(row);
    // Unmatched students are hidden unless manually shown or show-hidden is checked
    if (status === "unmatched" && !manuallyShown.has(row.uuid) && !showHidden) return false;
    // Name search
    if (query && !normalise(row.name).includes(query)) return false;
    return true;
  });

  renderTeacherTable();
}

function renderTeacherTable() {
  const tbody = document.getElementById("teacher-tbody");
  const empty = document.getElementById("teacher-empty");
  if (!tbody) return;

  if (!teacherFiltered.length) {
    tbody.innerHTML = "";
    if (empty) empty.style.display = "";
    return;
  }
  if (empty) empty.style.display = "none";

  const lang = getCurrentLang();
  const isFr = lang === "fr-CA";

  tbody.innerHTML = teacherFiltered.map(row => {
    const status = matchStatus(row);
    const rawProf = (row.raw?.profile?.supervising_professor || row.supervising_professor || "").trim();

    // Status badge
    let statusBadge, statusHint;
    if (status === "matched") {
      statusBadge = `<span class="vis-matched" title="${isFr ? "Correspond à ton nom" : "Matches your name"}">✓ ${isFr ? "Assigné·e" : "Assigned"}</span>`;
      statusHint  = "";
    } else if (status === "blank") {
      statusBadge = `<span class="vis-blank" title="${isFr ? "Aucun·e enseignant·e renseigné·e" : "No teacher set"}">⚠ ${isFr ? "Sans enseignant·e" : "No teacher"}</span>`;
      statusHint  = `<div style="font-size:1.1rem;color:var(--text-muted);margin-top:2px">${isFr ? "Demander à l'étudiant·e de renseigner son·sa superviseur·e pédagogique." : "Ask the student to fill in their supervising teacher."}</div>`;
    } else {
      statusBadge = `<span class="vis-hidden" title="${isFr ? "Assigné·e à un·e autre enseignant·e" : "Assigned to another teacher"}">✗ ${escHtml(rawProf) || (isFr ? "Autre" : "Other")}</span>`;
      statusHint  = `<div style="font-size:1.1rem;color:var(--danger);margin-top:2px">${isFr ? "Nom enseignant·e différent — demander à l'étudiant·e de corriger." : "Teacher name doesn't match — ask the student to correct it."}</div>`;
    }

    // Unhide button for unmatched students that are visible (via show-hidden or manually shown)
    const isManuallyShown = manuallyShown.has(row.uuid);
    const unhideBtn = (status === "unmatched")
      ? `<button class="btn btn--ghost btn--sm" style="font-size:1.1rem;margin-top:4px"
           onclick="toggleManuallyShown('${row.uuid}',${!isManuallyShown})">${
           isManuallyShown
             ? (isFr ? "Masquer" : "Hide")
             : (isFr ? "Afficher" : "Show")
         }</button>`
      : "";

    const trackClass = { green:"track-green", amber:"track-amber", red:"track-red", none:"track-none" }[row.track_band] || "track-none";
    const trackLabel = row.track_pct !== null ? `${row.track_pct}%` : "—";
    const lastLog    = row.last_log || "—";
    const hours      = `${row.actual_hours}h / ${row.expected_hours ?? "?"}h`;

    return `<tr class="data-row" data-uuid="${row.uuid}">
      <td><strong>${escHtml(row.name)}</strong></td>
      <td>${escHtml(row.program || "—")}</td>
      <td>${hours}</td>
      <td><span class="track-pill ${trackClass}">${trackLabel}</span></td>
      <td>${lastLog}</td>
      <td style="font-size:1.2rem;color:var(--text-muted)">${escHtml(rawProf) || "—"}</td>
      <td>
        ${statusBadge}
        ${statusHint}
        ${unhideBtn}
      </td>
    </tr>`;
  }).join("");
}

function toggleManuallyShown(uuid, show) {
  if (show) manuallyShown.add(uuid);
  else      manuallyShown.delete(uuid);
  persistTeacherState();
  applyTeacherFilters();
}

function renderTeacherAWOL() {
  const section = document.getElementById("teacher-awol-section");
  const list    = document.getElementById("teacher-awol-list");
  const subtitle = document.getElementById("teacher-awol-subtitle");
  if (!section || !list) return;

  const lang = getCurrentLang();
  const isFr = lang === "fr-CA";
  const today = new Date().toISOString().slice(0, 10);

  // AWOL = matched or blank students with ≥ 3 working days absent
  const awol = teacherStudents
    .filter(row => matchStatus(row) !== "unmatched" || manuallyShown.has(row.uuid))
    .filter(row => (row.working_days_absent || 0) >= 3);

  if (!awol.length) { section.style.display = "none"; return; }
  section.style.display = "";
  if (subtitle) subtitle.textContent = isFr
    ? `${awol.length} étudiant·e${awol.length > 1 ? "·s" : ""} sans journal depuis ≥ 3 jours ouvrables`
    : `${awol.length} student${awol.length > 1 ? "s" : ""} with no log for ≥ 3 working days`;

  list.innerHTML = awol.map(row => `
    <div style="display:flex;align-items:center;justify-content:space-between;
                flex-wrap:wrap;gap:var(--sp-2);padding:var(--sp-2) 0;
                border-bottom:1px solid rgba(255,107,112,.2)">
      <div>
        <strong>${escHtml(row.name)}</strong>
        <span style="font-size:1.2rem;color:var(--text-muted);margin-left:var(--sp-2)">${row.program || ""}</span>
      </div>
      <div style="font-size:1.3rem;color:var(--danger)">
        ${isFr ? `${row.working_days_absent} j. ouvr. sans nouvelles` : `${row.working_days_absent} working days absent`}
      </div>
    </div>`).join("");
}

// ── Status helper ─────────────────────────────────────────────
function setTeacherStatus(msg, type) {
  const el = document.getElementById("teacher-status-text");
  if (el) el.textContent = msg;
}

// ── Persistence ───────────────────────────────────────────────
function persistTeacherState() {
  try {
    localStorage.setItem(LS_TEACHER, JSON.stringify({
      name_raw:       teacherNameRaw,
      manually_shown: [...manuallyShown],
      students:       teacherStudents,
      saved_at:       new Date().toISOString(),
    }));
  } catch (e) {
    console.warn("[LCI Teacher] Could not persist state:", e);
  }
}

// ── Export ────────────────────────────────────────────────────
function exportTeacherView() {
  const lang = getCurrentLang();
  const isFr = lang === "fr-CA";
  const payload = {
    meta: {
      type:        "teacher_view",
      teacher:     teacherNameRaw,
      exported_at: new Date().toISOString(),
    },
    visible_students: teacherFiltered.map(row => ({
      uuid:          row.uuid,
      name:          row.name,
      program:       row.program,
      match_status:  matchStatus(row),
      actual_hours:  row.actual_hours,
      expected_hours: row.expected_hours,
      track_pct:     row.track_pct,
      last_log:      row.last_log,
    })),
  };
  const slug = normalise(teacherNameRaw).replace(/\s+/g, "_");
  downloadJSON(payload, `vue_enseignant_${slug}_${new Date().toISOString().slice(0,10)}.json`);
}

// ── Clear ─────────────────────────────────────────────────────
function clearTeacherData() {
  const lang = getCurrentLang();
  const msg  = lang === "fr-CA" ? "Vider les données chargées ?" : "Clear all loaded data?";
  if (!confirm(msg)) return;
  teacherStudents = [];
  teacherFiltered = [];
  document.getElementById("teacher-tbody").innerHTML         = "";
  document.getElementById("teacher-dashboard").style.display = "none";
  document.getElementById("teacher-awol-section").style.display = "none";
  document.getElementById("btn-teacher-export").style.display = "none";
  document.getElementById("btn-teacher-clear").style.display  = "none";
  document.getElementById("teacher-upload-strip").classList.remove("hub-upload-strip--loaded");
  setTeacherStatus("");
  persistTeacherState();
}
