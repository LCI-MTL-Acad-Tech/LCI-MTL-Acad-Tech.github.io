"use strict";

let orgData       = null;
let expandedLogId = null;
let pendingDelete = null;

// ── Init ──────────────────────────────────────────────────────
document.addEventListener("DOMContentLoaded", () => {
  initPage();
  applyLanguage(getCurrentLang());
  orgData = loadData();
  if (!orgData?.profile?.full_name) {
    document.getElementById("org-no-data").classList.remove("hidden");
    return;
  }
  document.getElementById("org-main").classList.remove("hidden");
  renderSubtitle();
  renderOrgTable();
});

function renderSubtitle() {
  const el = document.getElementById("org-subtitle");
  if (!el || !orgData) return;
  const isFr = getCurrentLang() === "fr-CA";
  const n = orgData.logs?.length || 0;
  el.textContent = isFr
    ? `${orgData.profile.full_name} · ${n} ${n !== 1 ? "journaux" : "journal"}`
    : `${orgData.profile.full_name} · ${n} log${n !== 1 ? "s" : ""}`;
}

// ── Duplicate detection ───────────────────────────────────────
// Returns a Map: log_id → "snapshot" | "same-day"
// "snapshot"  = two entries with the same log_id (old export merged in twice)
// "same-day"  = two entries with same date but different log_id (student made two logs)
function buildDupMap(logs) {
  const byId   = {};  // log_id → count
  const byDate = {};  // date   → Set of log_ids

  logs.forEach(l => {
    byId[l.log_id] = (byId[l.log_id] || 0) + 1;
    if (!byDate[l.date]) byDate[l.date] = new Set();
    byDate[l.date].add(l.log_id);
  });

  const result = new Map(); // log_id → dup type
  logs.forEach(l => {
    if (byId[l.log_id] > 1) {
      result.set(l.log_id, "snapshot");
    } else if (byDate[l.date].size > 1) {
      result.set(l.log_id, "same-day");
    }
  });
  return result;
}

// ── Hours display helper ──────────────────────────────────────
// Returns { display, warning } where:
//   display = "Xh" based on total (clock) time if available, else task time
//   warning = true if unaccounted time > 50% of total
function logHoursInfo(log) {
  const total = log.day_duration_minutes || 0;
  const tasks = log.task_total_minutes   || 0;
  if (total > 0) {
    const grayzone = Math.max(0, total - tasks);
    return {
      display: (total / 60).toFixed(1) + "h",
      warning: grayzone > total / 2,
      grayzone,
      total,
      tasks,
    };
  }
  // No clock time — fall back to task sum
  return {
    display: tasks ? (tasks / 60).toFixed(1) + "h" : "—",
    warning: false,
    grayzone: 0,
    total: 0,
    tasks,
  };
}

// ── Table rendering ───────────────────────────────────────────
function renderOrgTable() {
  const tbody     = document.getElementById("org-tbody");
  const emptyEl   = document.getElementById("org-empty");
  const dupBanner = document.getElementById("org-dup-banner");
  if (!tbody || !orgData) return;

  const isFr     = getCurrentLang() === "fr-CA";
  const query    = (document.getElementById("org-search")?.value || "").toLowerCase().trim();
  const dupsOnly = document.getElementById("org-show-dups")?.checked || false;

  const logs  = [...(orgData.logs || [])].sort((a, b) => b.date.localeCompare(a.date));
  const dupMap = buildDupMap(logs);
  const hasDups = dupMap.size > 0;
  dupBanner.classList.toggle("hidden", !hasDups);

  // Update banner text with dup type breakdown
  if (hasDups) {
    const snapshots = [...dupMap.values()].filter(t => t === "snapshot").length;
    const sameDays  = [...dupMap.values()].filter(t => t === "same-day").length;
    const parts = [];
    if (snapshots) parts.push(isFr ? `${snapshots} instantané${snapshots>1?"s":""}` : `${snapshots} snapshot${snapshots>1?"s":""}`);
    if (sameDays)  parts.push(isFr ? `${sameDays} même date`                          : `${sameDays} same-date`);
    const bannerSpan = dupBanner.querySelector("span[data-i18n]");
    if (bannerSpan) bannerSpan.textContent = parts.join(", ");
  }

  const filtered = logs.filter(log => {
    if (dupsOnly && !dupMap.has(log.log_id)) return false;
    if (query) {
      const inDate  = log.date.includes(query);
      const inTasks = (log.tasks || []).some(t => (t.description || "").toLowerCase().includes(query));
      const inWin   = (log.win || "").toLowerCase().includes(query);
      if (!inDate && !inTasks && !inWin) return false;
    }
    return true;
  });

  if (!filtered.length) {
    tbody.innerHTML = "";
    emptyEl.classList.remove("hidden");
    return;
  }
  emptyEl.classList.add("hidden");

  const rows = [];
  filtered.forEach(log => {
    const dupType   = dupMap.get(log.log_id);
    const isExpanded = log.log_id === expandedLogId;
    const hrsInfo   = logHoursInfo(log);
    const hrsCell   = hrsInfo.warning
      ? `<span style="color:var(--warning,#b87800)" title="${isFr
          ? `${(hrsInfo.grayzone/60).toFixed(1)}h non documentées sur ${(hrsInfo.total/60).toFixed(1)}h`
          : `${(hrsInfo.grayzone/60).toFixed(1)}h undocumented out of ${(hrsInfo.total/60).toFixed(1)}h`}"
        >⚠ ${hrsInfo.display}</span>`
      : hrsInfo.display;
    const created   = formatTimestamp(log.created_at, isFr);
    const saved     = formatTimestamp(log.saved_at, isFr);
    const taskCount = (log.tasks || []).length;

    const badges = [];
    if (dupType === "snapshot") {
      badges.push(`<span class="badge-dup" title="${isFr
        ? "Même identifiant chargé deux fois — conserver la version la plus récente"
        : "Same log ID loaded twice — keep the most recent revision"}">${isFr ? "⚠ instantané" : "⚠ snapshot"}</span>`);
    } else if (dupType === "same-day") {
      badges.push(`<span class="badge-dup" title="${isFr
        ? "Deux journaux distincts pour la même date — vérifier lequel est le bon"
        : "Two separate logs for the same date — check which one is correct"}">${isFr ? "⚠ même date" : "⚠ same date"}</span>`);
    }
    if (log.future_filing) badges.push(`<span class="badge-future">${isFr ? "futur" : "future"}</span>`);
    if (log.late_filing)   badges.push(`<span class="badge-late">${isFr ? "tardif" : "late"}</span>`);
    if (!dupType && !log.future_filing && !log.late_filing) badges.push(`<span class="badge-ok">✓</span>`);

    rows.push(`
      <tr class="org-row${isExpanded ? " is-expanded" : ""}"
          onclick="toggleExpand('${log.log_id}')" data-log-id="${log.log_id}">
        <td><strong>${log.date}</strong></td>
        <td style="font-size:1.2rem;color:var(--text-muted)">${created}</td>
        <td style="font-size:1.2rem;color:var(--text-muted)">${saved}</td>
        <td style="color:var(--text-muted)">${taskCount}</td>
        <td>${hrsCell}</td>
        <td>${badges.join(" ")}</td>
        <td>
          <button class="btn btn--ghost btn--sm" style="color:var(--danger);padding:2px 8px"
            onclick="event.stopPropagation();promptDelete('${log.log_id}')"
            title="${isFr ? "Supprimer" : "Delete"}">✕</button>
        </td>
      </tr>`);

    if (isExpanded) {
      rows.push(`
        <tr class="org-detail">
          <td colspan="7">
            <div class="org-detail-inner" id="detail-${log.log_id}">
              ${renderDetailPanel(log, isFr)}
            </div>
          </td>
        </tr>`);
    }
  });

  tbody.innerHTML = rows.join("");
}

// ── Detail panel ──────────────────────────────────────────────
function renderDetailPanel(log, isFr) {

  // Task rows — each task's duration is editable
  const hrsInfo        = logHoursInfo(log);
  const totalMins      = (log.tasks || []).reduce((s, t) => s + (parseInt(t.duration_minutes) || 0), 0);
  const totalHrsDisplay = totalMins ? (totalMins / 60).toFixed(2) + "h" : "0h";
  const clockLabel     = hrsInfo.total > 0
    ? (isFr
        ? `Total horloge : ${hrsInfo.display}${hrsInfo.warning ? " ⚠" : ""}`
        : `Clock total: ${hrsInfo.display}${hrsInfo.warning ? " ⚠" : ""}`)
    : (isFr ? "Total tâches :" : "Task total:");

  const taskRows = (log.tasks || []).length
    ? (log.tasks || []).map((t, i) => {
        const taskHrs = t.duration_minutes
          ? (parseInt(t.duration_minutes) / 60).toFixed(2)
          : "0";
        return `
        <div style="display:flex;gap:var(--sp-2);align-items:center;
                    margin-bottom:var(--sp-2);flex-wrap:wrap" data-task-index="${i}">
          <span style="font-size:1.2rem;color:var(--text-muted);min-width:1.8rem">${i+1}.</span>
          <div style="flex:1;min-width:14rem;font-size:1.35rem">${escHtml(t.description || "—")}</div>
          <div style="display:flex;align-items:center;gap:var(--sp-1);flex-shrink:0">
            <input type="number" min="0" max="24" step="0.25"
              class="org-date-input task-hrs-input"
              style="width:6rem;text-align:right"
              value="${taskHrs}"
              data-log-id="${log.log_id}" data-task-idx="${i}"
              oninput="updateTaskHours('${log.log_id}',${i},this.value)"
              title="${isFr ? "Heures (ex. 1.5)" : "Hours (e.g. 1.5)"}">
            <span style="font-size:1.3rem;color:var(--text-muted)">h</span>
          </div>
        </div>`;
      }).join("")
    : `<div style="color:var(--text-muted);font-size:1.3rem">${isFr ? "Aucune tâche" : "No tasks"}</div>`;

  return `
    <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(24rem,1fr));gap:var(--sp-5)">

      <!-- ── Primary editable fields ── -->
      <div>
        <div class="org-section-label">${isFr ? "Corrections importantes" : "Key corrections"}</div>

        <div class="org-field">
          <label>${isFr ? "Date du journal" : "Log date"}</label>
          <input type="date" class="org-date-input" value="${log.date}"
            onchange="changeDate('${log.log_id}',this.value)">
          <span style="font-size:1.2rem;color:var(--text-muted)">
            ${isFr ? "Créé" : "Created"}: ${formatTimestamp(log.created_at, isFr)}
            &nbsp;·&nbsp;
            ${isFr ? "Modifié" : "Saved"}: ${formatTimestamp(log.saved_at, isFr)}
          </span>
        </div>

        <div class="org-field">
          <label style="display:flex;justify-content:space-between;align-items:baseline;flex-wrap:wrap;gap:var(--sp-2)">
            <span>${isFr ? "Durée par tâche (heures)" : "Task duration (hours)"}</span>
            <span style="display:flex;gap:var(--sp-3);align-items:baseline">
              ${hrsInfo.total > 0 ? `<span style="font-size:1.2rem;color:var(--text-muted)">${clockLabel}</span>` : ""}
              <span id="total-hrs-${log.log_id}"
                style="font-size:1.3rem;color:var(--accent);font-weight:600">
                ${isFr ? "Tâches" : "Tasks"} = ${totalHrsDisplay}
              </span>
            </span>
          </label>
          ${hrsInfo.warning ? `
          <div style="background:rgba(184,120,23,.1);border:1.5px solid #b87800;border-radius:var(--r-md);
                      padding:var(--sp-2) var(--sp-3);font-size:1.3rem;color:#8a5c00;margin-bottom:var(--sp-2)">
            ⚠ ${isFr
              ? `${(hrsInfo.grayzone/60).toFixed(1)}h non documentées sur ${hrsInfo.display} total — plus de la moitié de la journée n'est pas couverte par des tâches.`
              : `${(hrsInfo.grayzone/60).toFixed(1)}h undocumented out of ${hrsInfo.display} total — more than half the day isn't covered by tasks.`}
          </div>` : ""}
          ${taskRows}
          <div style="font-size:1.2rem;color:var(--text-muted);margin-top:var(--sp-1)">
            ${isFr
              ? "Modifie les durées ici si tu as fait une faute de frappe. Le total se met à jour en temps réel."
              : "Edit durations here if you made a typo. The total updates in real time."}
          </div>
        </div>
      </div>

      <!-- ── Reflections ── -->
      <div>
        <div class="org-section-label">${isFr ? "Réflexions" : "Reflections"}</div>
        <div class="org-field">
          <label>${isFr ? "Victoire du jour" : "Win of the day"}</label>
          <textarea rows="2" onchange="updateField('${log.log_id}','win',this.value)">${escHtml(log.win || "")}</textarea>
        </div>
        <div class="org-field">
          <label>${isFr ? "Obstacle" : "Obstacle"}</label>
          <textarea rows="2" onchange="updateField('${log.log_id}','obstacle',this.value)">${escHtml(log.obstacle || "")}</textarea>
        </div>
        <div class="org-field">
          <label>${isFr ? "Plan pour demain" : "Plan for tomorrow"}</label>
          <textarea rows="2" onchange="updateField('${log.log_id}','plan_tomorrow',this.value)">${escHtml(log.plan_tomorrow || "")}</textarea>
        </div>
      </div>

    </div>

    <div style="display:flex;gap:var(--sp-3);margin-top:var(--sp-4);flex-wrap:wrap;align-items:center">
      <button class="btn btn--primary btn--sm" onclick="saveLogEdits('${log.log_id}')"
        >${isFr ? "Enregistrer les modifications" : "Save changes"}</button>
      <button class="btn btn--ghost btn--sm" onclick="exportSingleLog('${log.log_id}')"
        >${isFr ? "Exporter ce journal (JSON)" : "Export this log (JSON)"}</button>
      <a href="log.html" class="btn btn--ghost btn--sm"
        onclick="navigateToLog('${log.log_id}')"
        >${isFr ? "Modifier dans le journal →" : "Edit in daily log →"}</a>
      <button class="btn btn--ghost btn--sm" onclick="toggleExpand('${log.log_id}')"
        style="margin-left:auto"
        >${isFr ? "Replier ▲" : "Collapse ▲"}</button>
    </div>`;
}

// ── Expand / collapse ─────────────────────────────────────────
function toggleExpand(logId) {
  expandedLogId = expandedLogId === logId ? null : logId;
  renderOrgTable();
  if (expandedLogId) {
    setTimeout(() => {
      document.getElementById("detail-" + logId)
        ?.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }, 60);
  }
}

// ── Edit helpers ──────────────────────────────────────────────
function getLog(logId) {
  return orgData.logs.find(l => l.log_id === logId);
}

function changeDate(logId, newDate) {
  if (!newDate) return;
  const log = getLog(logId);
  if (!log) return;
  const isFr = getCurrentLang() === "fr-CA";
  const existing = orgData.logs.find(l => l.date === newDate && l.log_id !== logId);
  if (existing) {
    if (!confirm(isFr
      ? `Un journal pour ${newDate} existe déjà. Continuer quand même ?`
      : `A log for ${newDate} already exists. Continue anyway?`)) return;
  }
  log.date          = newDate;
  log.late_filing   = newDate < localDateISO();
  log.future_filing = newDate > localDateISO();
  saveOrgData(isFr ? `Date changée → ${newDate}` : `Date changed → ${newDate}`);
}

function updateTaskHours(logId, taskIdx, value) {
  const log = getLog(logId);
  if (!log?.tasks?.[taskIdx]) return;
  const hrs = parseFloat(value) || 0;
  log.tasks[taskIdx].duration_minutes = Math.round(hrs * 60);

  // Recompute task_total_minutes live
  const total = log.tasks.reduce((s, t) => s + (parseInt(t.duration_minutes) || 0), 0);
  log.task_total_minutes = total;

  // Update the total display without full re-render
  const totalEl = document.getElementById("total-hrs-" + logId);
  const isFr2 = getCurrentLang() === "fr-CA";
  if (totalEl) totalEl.textContent = (isFr2 ? "Tâches" : "Tasks") + " = " + (total ? (total/60).toFixed(2) + "h" : "0h");
}

function updateField(logId, field, value) {
  const log = getLog(logId);
  if (log) log[field] = value;
}

function saveLogEdits(logId) {
  const isFr = getCurrentLang() === "fr-CA";
  const panel = document.getElementById("detail-" + logId);
  if (panel) {
    const log = getLog(logId);
    if (log) {
      // Flush textarea values
      ["win", "obstacle", "plan_tomorrow"].forEach(field => {
        const ta = panel.querySelector(`textarea[onchange*="'${field}'"]`);
        if (ta) log[field] = ta.value;
      });
      // Recompute total from current task inputs (catches any unfired oninput)
      const taskInputs = panel.querySelectorAll(".task-hrs-input");
      let total = 0;
      taskInputs.forEach(inp => {
        const idx = parseInt(inp.dataset.taskIdx);
        if (!isNaN(idx) && log.tasks?.[idx]) {
          const hrs = parseFloat(inp.value) || 0;
          log.tasks[idx].duration_minutes = Math.round(hrs * 60);
          total += log.tasks[idx].duration_minutes;
        }
      });
      if (taskInputs.length) log.task_total_minutes = total;
    }
  }
  saveOrgData(isFr ? "Modifications enregistrées." : "Changes saved.");
}

function saveOrgData(statusMsg) {
  saveData(orgData);
  renderSubtitle();
  renderOrgTable();
  const flash = document.createElement("div");
  flash.style.cssText = "position:fixed;bottom:var(--sp-6);right:var(--sp-6);" +
    "background:var(--bg-card);border:1.5px solid var(--success);" +
    "border-radius:var(--r-lg);padding:var(--sp-3) var(--sp-5);" +
    "font-size:1.4rem;color:var(--success);z-index:9000;box-shadow:var(--shadow-md)";
  flash.textContent = "✓ " + statusMsg;
  document.body.appendChild(flash);
  setTimeout(() => flash.remove(), 2500);
}

// ── Delete ────────────────────────────────────────────────────
function promptDelete(logId) {
  const log = getLog(logId);
  if (!log) return;
  const isFr = getCurrentLang() === "fr-CA";
  pendingDelete = logId;
  const desc = document.getElementById("org-delete-desc");
  const hrsForDelete = logHoursInfo(log);
  if (desc) desc.textContent = isFr
    ? `Journal du ${log.date} · ${(log.tasks||[]).length} tâche(s) · ${hrsForDelete.display}`
    : `Log for ${log.date} · ${(log.tasks||[]).length} task(s) · ${hrsForDelete.display}`;
  document.getElementById("org-delete-modal").classList.remove("hidden");
}

function closeDeleteModal() {
  pendingDelete = null;
  document.getElementById("org-delete-modal").classList.add("hidden");
}

function confirmDelete() {
  if (!pendingDelete) return;
  orgData.logs = orgData.logs.filter(l => l.log_id !== pendingDelete);
  if (expandedLogId === pendingDelete) expandedLogId = null;
  closeDeleteModal();
  const isFr = getCurrentLang() === "fr-CA";
  saveOrgData(isFr ? "Journal supprimé." : "Log deleted.");
}

// ── Navigate to log page ──────────────────────────────────────
function navigateToLog(logId) {
  sessionStorage.setItem("org_jump_log_id", logId);
}

// ── Export ────────────────────────────────────────────────────
function exportAllJSON() {
  if (!orgData) return;
  const slug = orgData.profile?.student_id || slugify(orgData.profile?.full_name || "stage");
  downloadJSON(orgData, `${slug}_export_complet_${localDateISO()}.json`);
}

function exportSingleLog(logId) {
  const log = getLog(logId);
  if (!log || !orgData) return;
  const payload = {
    ...orgData,
    logs: [log],
    meta: { ...orgData.meta, exported_at: new Date().toISOString() },
  };
  const slug = orgData.profile?.student_id || slugify(orgData.profile?.full_name || "stage");
  downloadJSON(payload, `${slug}_${log.date}.json`);
}

// ── Helpers ───────────────────────────────────────────────────
function formatTimestamp(iso, isFr) {
  if (!iso) return "—";
  try {
    const d    = new Date(iso);
    const date = localDateISO(d);
    const time = d.toLocaleTimeString(isFr ? "fr-CA" : "en-CA",
      { hour: "2-digit", minute: "2-digit" });
    return `${date} ${time}`;
  } catch { return iso?.slice(0, 16) || "—"; }
}
