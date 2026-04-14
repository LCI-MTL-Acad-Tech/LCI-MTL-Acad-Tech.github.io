// ============================================================
// log.js — Daily log logic
// ============================================================

let logData = null;       // full internship data
let currentLog = null;    // today's log object
let idleTimer = null;
let lastDownloaded = false;

// ── Init ──────────────────────────────────────────────────────
document.addEventListener("DOMContentLoaded", () => {
  initPage();
  initFileSidebar();

  // Wire static form link to use the deployment-configurable meta tag URL
  const formLink = document.getElementById("log-form-link");
  if (formLink) {
    const metaUrl = document.querySelector('meta[name="upload-form-url"]')?.content;
    if (metaUrl) formLink.href = metaUrl;
  }

  logData = loadData();
  // Config imported from another computer — show a brief confirmation
  if (sessionStorage.getItem("config_imported")) {
    sessionStorage.removeItem("config_imported");
    const banner = document.createElement("div");
    banner.className = "alert alert--success";
    banner.style.cssText = "margin-bottom:var(--sp-4)";
    banner.textContent = getCurrentLang() === "fr-CA"
      ? "✓ Configuration importée avec succès. Tes journaux précédents sont conservés."
      : "✓ Configuration imported successfully. Your previous logs are preserved.";
    document.querySelector(".main-content")?.prepend(banner);
    setTimeout(() => banner.remove(), 5000);
  }

  if (!logData || !logData.profile?.full_name) {
    document.getElementById("no-data-warning").classList.remove("hidden");
    applyLanguage(getCurrentLang());
    sidebarOpenForData();
    return;
  }

  document.getElementById("log-main").classList.remove("hidden");

  // Load or create today's log
  const today = new Date().toISOString().slice(0, 10);
  currentLog = getTodayLogId(logData);
  if (!currentLog) {
    currentLog = createNewLog(today);
    logData.logs.push(currentLog);
    saveData(logData);
  }

  renderAll();
  renderDrawerToggles();
  initMobile();
  buildColorPicker();
  setupIdleTimer();

  // Show download reminder after 5 minutes
  setTimeout(() => {
    if (!lastDownloaded) showDownloadBanner();
  }, 5 * 60 * 1000);

  // Warn on tab close
  window.addEventListener("beforeunload", e => {
    if (!lastDownloaded) {
      e.preventDefault();
      e.returnValue = "";
    }
  });

  applyLanguage(getCurrentLang());
  checkAutoTour();
});

// ── Render everything ─────────────────────────────────────────
function renderAll() {
  renderHeader();
  renderTasks();
  renderAllTodoLists();
  renderRating();
  renderDrawers();
  updateTimings();
  if (logData.pathway === "hub") {
    document.getElementById("projects-sidebar").style.display = "block";
    renderProjectsSidebar();
  }
  restoreFields();
}

function renderHeader() {
  const lang = getCurrentLang();
  const dateStr = formatDate(currentLog.date + "T12:00:00");
  document.getElementById("log-date-display").textContent = dateStr;
  document.getElementById("late-filing").checked = currentLog.late_filing || false;

  if (currentLog.time_start) {
    document.getElementById("log-time-start").value = currentLog.time_start.slice(11, 16);
  }
  if (currentLog.time_end) {
    document.getElementById("log-time-end").value = currentLog.time_end.slice(11, 16);
  }
  document.getElementById("log-onsite").checked = currentLog.modality_onsite || false;
  document.getElementById("log-remote").checked = currentLog.modality_remote || false;
  // Restore late-filing date picker state
  if (currentLog.late_filing) {
    toggleLateFiling(true);
  }
  renderMorningEnergy();
}

function renderMorningEnergy() {
  const container = document.getElementById("morning-energy-btns");
  if (!container) return;
  container.innerHTML = [1,2,3,4,5].map(n =>
    `<button class="rating-btn ${currentLog.morning_energy === n ? "active" : ""}"
      onclick="setMorningEnergy(${n})">${n} <span style="font-size:1.1rem">${t("log.rating_" + n)}</span></button>`
  ).join("");
}

function setMorningEnergy(n) {
  currentLog.morning_energy = n;
  updateLog();
  renderMorningEnergy();
}

function restoreFields() {
  document.getElementById("log-obstacle").value = currentLog.obstacle || "";
  document.getElementById("log-obstacle-response").value = currentLog.obstacle_response || "";
  document.getElementById("log-win").value = currentLog.win || "";
  document.getElementById("log-closing").value = currentLog.closing_word || "";
  document.getElementById("log-plan-tomorrow").value = currentLog.plan_tomorrow || "";

  // Morning energy is rendered in renderHeader via renderMorningEnergy()

  // Restore weekly wrap if present
  if (currentLog.weekly_wrap) {
    document.getElementById("log-weekly-highlight").value = currentLog.weekly_wrap.highlight || "";
    document.getElementById("log-weekly-learning").value  = currentLog.weekly_wrap.learning  || "";
    document.getElementById("log-weekly-change").value    = currentLog.weekly_wrap.change    || "";
    const _ta = document.getElementById("log-weekly-teacher-note");
    if (_ta) _ta.value = currentLog.weekly_wrap.teacher_note || "";
    // Competency notes are restored inside renderCompetencyFields() called by checkWeeklyWrap()
  }

  // Show tomorrow reminder if previous log had a plan
  showTomorrowReminder();

  // Show weekly wrap if this is the week-end day
  checkWeeklyWrap();

  // Show end-of-internship or weekly report reminders
  checkEndReminders();
  document.getElementById("grayzone-desc").value = currentLog.grayzone_description || "";

  if (currentLog.obstacle) {
    document.getElementById("obstacle-response-group").style.display = "block";
  }

  document.getElementById("log-obstacle").addEventListener("input", function() {
    document.getElementById("obstacle-response-group").style.display = this.value ? "block" : "none";
    updateLog();
  });
}

// ── Tasks ─────────────────────────────────────────────────────
function renderTasks() {
  const list = document.getElementById("tasks-list");
  list.innerHTML = "";
  (currentLog.tasks || []).forEach((task, idx) => renderTaskBlock(task, idx));
  if (!currentLog.tasks?.length) {
    list.innerHTML = `<p class="text-muted" style="font-size:1.4rem; text-align:center; padding:var(--sp-4) 0">—</p>`;
  }
}

function renderTaskBlock(task, idx) {
  const list = document.getElementById("tasks-list");
  const block = document.createElement("div");
  block.className = "task-block";
  block.id = `task-${task.task_id}`;
  block.dataset.taskId = task.task_id;

  const typeColor = getActivityTypeColor(logData, task.activity_type_id);
  const isTraining = task.activity_type_id === "sys-training" || task.training_subtype;
  const isMeeting = task.activity_type_id === "sys-meeting";

  block.innerHTML = `
    <div class="task-block-header">
      <div class="task-color-bar" style="background:${typeColor}"></div>
      <div style="flex:1">
        <div class="form-row" style="margin-bottom:var(--sp-2)">
          <div class="form-group" style="margin:0;grid-column:1/-1">
            <input type="text" value="${escHtml(task.description)}"
              placeholder="${t('log.task_description')}"
              oninput="updateTaskField('${task.task_id}','description',this.value)"
              style="font-weight:500;">
          </div>
        </div>
        <div class="form-row">
          <div class="form-group" style="margin:0">
            <label data-i18n="log.task_type"></label>
            ${renderActivityTypeSelect(task)}
          </div>
          <div class="form-group" style="margin:0">
            <label data-i18n="log.task_duration"></label>
            <div class="duration-inputs">
              <input type="number" min="0" max="99" class="duration-h"
                placeholder="0" style="width:5.6rem;text-align:center"
                value="${Math.floor((task.duration_minutes||0)/60) || ''}"
                oninput="updateDuration('${task.task_id}',this,'h')">
              <span class="input-unit">h</span>
              <input type="number" min="0" max="59" class="duration-m"
                placeholder="0" style="width:5.6rem;text-align:center"
                value="${(task.duration_minutes||0)%60 || ''}"
                oninput="updateDuration('${task.task_id}',this,'m')">
              <span class="input-unit">min</span>
            </div>
          </div>
        </div>
        ${logData.pathway === "hub" ? renderProjectSelect(task) : ""}
        ${isTraining ? renderTrainingFields(task) : ""}
        ${(isTraining || isMeeting) ? renderTopicLearning(task) : ""}
        <div class="task-tags" id="task-tags-${task.task_id}"></div>
        <div class="task-assign-btns">
          <button class="task-assign-btn" onclick="openDrawerForTask(event,'drawer-people','${task.task_id}')" data-i18n="drawer.people_title"></button>
          <button class="task-assign-btn" onclick="openDrawerForTask(event,'drawer-tools','${task.task_id}')" data-i18n="drawer.tools_title"></button>
          ${logData.pathway === "hub" ? `<button class="task-assign-btn" onclick="openDrawerForTask(event,'drawer-projects','${task.task_id}')" data-i18n="drawer.projects_title"></button>` : ""}
          <button class="task-assign-btn" onclick="openDrawerForTask(event,'drawer-types','${task.task_id}')" data-i18n="drawer.types_title"></button>
          ${_getTagPool().length > 0 ? `<button class="task-assign-btn" onclick="openDrawerForTask(event,'drawer-tags','${task.task_id}')" data-i18n="drawer.tags_title"></button>` : ""}
        </div>
      </div>
      <button class="btn btn--icon btn--sm task-remove" onclick="removeTask('${task.task_id}')" title="${t('action.delete')}">✕</button>
    </div>
  `;

  // Drop target
  block.addEventListener("dragover", e => { e.preventDefault(); block.classList.add("drag-over"); });
  block.addEventListener("dragleave", () => block.classList.remove("drag-over"));
  block.addEventListener("drop", e => {
    e.preventDefault();
    block.classList.remove("drag-over");
    const type = e.dataTransfer.getData("type");
    const id = e.dataTransfer.getData("id");
    if (type === "person") addPersonToTask(task.task_id, id);
    else if (type === "tool") addToolToTask(task.task_id, id);
    else if (type === "project") addProjectToTask(task.task_id, id);
    else if (type === "activity_type") setActivityType(task.task_id, id);
    else if (type === "learning_ref") addLearningRef(task.task_id, id);
  });

  list.appendChild(block);
  renderTaskTags(task);
  applyLanguage(getCurrentLang());
}

function renderActivityTypeSelect(task) {
  const opts = (logData.activity_types || []).map(at => {
    const label = at.label_key ? t(at.label_key) : at.label;
    const sel = task.activity_type_id === at.type_id ? "selected" : "";
    return `<option value="${at.type_id}" ${sel}>${label}</option>`;
  }).join("");
  return `<select onchange="setActivityType('${task.task_id}',this.value)">
    <option value="">—</option>${opts}</select>`;
}

function renderProjectSelect(task) {
  if (!logData.projects?.length) return "";
  const opts = logData.projects.filter(p => p.status !== "cancelled").map(p => {
    const sel = task.project_id === p.project_id ? "selected" : "";
    return `<option value="${p.project_id}" ${sel}>${escHtml(p.project_name)}</option>`;
  }).join("");
  return `<div class="form-group" style="margin:var(--sp-2) 0 0 0">
    <label data-i18n="log.task_project"></label>
    <select onchange="updateTaskField('${task.task_id}','project_id',this.value)">
      <option value="">—</option>${opts}
    </select>
  </div>`;
}

function renderTrainingFields(task) {
  const subtypes = ["reading","video","coaching","workshop","course","other"];
  const opts = subtypes.map(s => {
    const sel = task.training_subtype === s ? "selected" : "";
    return `<option value="${s}" ${sel} data-i18n="log.training_${s}"></option>`;
  }).join("");
  return `<div class="form-group" style="margin:var(--sp-2) 0 0 0">
    <label data-i18n="log.training_subtype"></label>
    <select onchange="updateTaskField('${task.task_id}','training_subtype',this.value)">${opts}</select>
  </div>`;
}

function renderTopicLearning(task) {
  return `
    <div class="form-group" style="margin:var(--sp-2) 0 0 0">
      <label data-i18n="log.task_topic"></label>
      <input type="text" value="${escHtml(task.topic || "")}"
        oninput="updateTaskField('${task.task_id}','topic',this.value)">
    </div>
    <div class="form-group" style="margin:var(--sp-2) 0 0 0">
      <label data-i18n="log.task_learning"></label>
      <textarea rows="2" oninput="updateTaskField('${task.task_id}','learning',this.value)">${escHtml(task.learning || "")}</textarea>
    </div>
  `;
}

function renderTaskTags(task) {
  const container = document.getElementById(`task-tags-${task.task_id}`);
  if (!container) return;
  const tags = [];

  if (task.person_ids?.length) {
    task.person_ids.forEach(pid => {
      const p = logData.people.find(x => x.person_id === pid);
      if (p) tags.push(`<span class="tag" style="background:var(--color-cobalt-500);color:white;">👤 ${escHtml(p.name)}<button class="tag-remove" onclick="removePersonFromTask('${task.task_id}','${pid}')">✕</button></span>`);
    });
  }
  if (task.tool_ids?.length) {
    task.tool_ids.forEach(tid => {
      const tool = logData.tools.find(x => x.tool_id === tid);
      if (tool) tags.push(`<span class="tag" style="background:var(--color-gold-500);color:white;">🔧 ${escHtml(tool.name)}<button class="tag-remove" onclick="removeToolFromTask('${task.task_id}','${tid}')">✕</button></span>`);
    });
  }
  if (task.project_id) {
    const proj = logData.projects?.find(x => x.project_id === task.project_id);
    if (proj) tags.push(`<span class="tag" style="background:var(--color-chlorophyll-500);color:white;">📁 ${escHtml(proj.project_name)}<button class="tag-remove" onclick="updateTaskField('${task.task_id}','project_id','');renderTaskTags(logData.tasks?.find(t=>t.task_id==='${task.task_id}')||currentLog.tasks.find(t=>t.task_id==='${task.task_id}'))">✕</button></span>`);
  }
  if (task.learning_refs?.length) {
    const lang = getCurrentLang();
    const pool = _getTagPool();
    task.learning_refs.forEach(ref => {
      const item = pool.find(x => x.id === ref.id);
      if (!item) return;
      const label = item.label[lang] || item.label["fr-CA"];
      const color = ref.type === "competency"
        ? "var(--accent)"
        : "var(--color-chlorophyll-500)";
      const icon = ref.type === "competency" ? "🎓" : "📌";
      tags.push(`<span class="tag" style="background:${color}20;border:1px solid ${color};color:var(--text)">`
        + `${icon} <span style="font-weight:500;color:${color}">${escHtml(ref.id)}</span> `
        + `<span style="font-size:1.1rem">${escHtml(label.slice(0, 45))}${label.length > 45 ? "…" : ""}</span>`
        + `<button class="tag-remove" onclick="removeLearningRef('${task.task_id}','${ref.id}')">✕</button></span>`);
    });
  }
  if (task.lesson_tags?.length) {
    task.lesson_tags.forEach((tag, i) => {
      tags.push(`<span class="tag">💡 ${escHtml(tag)}<button class="tag-remove" onclick="removeLessonTag('${task.task_id}',${i})">✕</button></span>`);
    });
  }

  container.innerHTML = tags.join("");
}

function addTask() {
  const task = createNewTask();
  currentLog.tasks.push(task);
  updateLog();
  renderTasks();
}

function updateDuration(taskId, input, unit) {
  const task = currentLog.tasks.find(t => t.task_id === taskId);
  if (!task) return;
  const block = document.getElementById(`task-${taskId}`);
  if (!block) return;
  const hEl = block.querySelector(".duration-h");
  const mEl = block.querySelector(".duration-m");
  const h = parseInt(hEl?.value) || 0;
  const m = parseInt(mEl?.value) || 0;
  // Clamp minutes to 0–59
  if (unit === "m" && m > 59) { input.value = 59; }
  const total = h * 60 + Math.min(m, 59);
  task.duration_minutes = total;
  updateTimings();
  updateLog();
}

function removeTask(taskId) {
  currentLog.tasks = currentLog.tasks.filter(t => t.task_id !== taskId);
  updateLog();
  renderTasks();
}

function updateTaskField(taskId, field, value) {
  const task = currentLog.tasks.find(t => t.task_id === taskId);
  if (!task) return;
  task[field] = value;
  if (field === "activity_type_id") {
    const el = document.getElementById(`task-${taskId}`);
    if (el) {
      el.querySelector(".task-color-bar").style.background = getActivityTypeColor(logData, value);
    }
  }
  updateLog();
}

function setActivityType(taskId, typeId) {
  updateTaskField(taskId, "activity_type_id", typeId);
  // Re-render block to show/hide training fields
  const task = currentLog.tasks.find(t => t.task_id === taskId);
  if (task) {
    const el = document.getElementById(`task-${taskId}`);
    if (el) el.remove();
    const idx = currentLog.tasks.findIndex(t => t.task_id === taskId);
    renderTaskBlock(task, idx);
  }
}

function addPersonToTask(taskId, personId) {
  const task = currentLog.tasks.find(t => t.task_id === taskId);
  if (!task) return;
  if (!task.person_ids.includes(personId)) {
    task.person_ids.push(personId);
    updateLog();
    renderTaskTags(task);
  }
}

function removePersonFromTask(taskId, personId) {
  const task = currentLog.tasks.find(t => t.task_id === taskId);
  if (!task) return;
  task.person_ids = task.person_ids.filter(x => x !== personId);
  updateLog();
  renderTaskTags(task);
}

function addToolToTask(taskId, toolId) {
  const task = currentLog.tasks.find(t => t.task_id === taskId);
  if (!task) return;
  if (!task.tool_ids.includes(toolId)) {
    task.tool_ids.push(toolId);
    updateLog();
    renderTaskTags(task);
  }
}

function removeToolFromTask(taskId, toolId) {
  const task = currentLog.tasks.find(t => t.task_id === taskId);
  if (!task) return;
  task.tool_ids = task.tool_ids.filter(x => x !== toolId);
  updateLog();
  renderTaskTags(task);
}

function addProjectToTask(taskId, projectId) {
  updateTaskField(taskId, "project_id", projectId);
}

function addLessonTag(taskId) {
  const input = document.getElementById(`lesson-tag-input-${taskId}`);
  if (!input) return;
  const val = input.value.trim();
  if (!val) return;
  const task = currentLog.tasks.find(t => t.task_id === taskId);
  if (!task) return;
  task.lesson_tags = task.lesson_tags || [];
  task.lesson_tags.push(val);
  input.value = "";
  updateLog();
  renderTaskTags(task);
}

function removeLessonTag(taskId, idx) {
  const task = currentLog.tasks.find(t => t.task_id === taskId);
  if (!task) return;
  task.lesson_tags.splice(idx, 1);
  updateLog();
  renderTaskTags(task);
}

// ── Late filing date selector ────────────────────────────────
function toggleLateFiling(checked) {
  currentLog.late_filing = checked;
  const heading = document.getElementById("log-date-display");
  const pickerWrap = document.getElementById("log-date-picker-wrap");
  const picker = document.getElementById("log-date-picker");

  if (checked) {
    heading.style.display = "none";
    pickerWrap.style.display = "flex";
    // Pre-fill with current log date
    picker.value = currentLog.date;
    picker.max = new Date().toISOString().slice(0, 10); // can't file late for the future
  } else {
    heading.style.display = "";
    pickerWrap.style.display = "none";
    // Restore to today's date
    const today = new Date().toISOString().slice(0, 10);
    currentLog.date = today;
    document.getElementById("log-date-display").textContent =
      formatDate(today + "T12:00:00");
  }
  updateLog();
}

function updateLogDate(newDate) {
  if (!newDate) return;
  currentLog.date = newDate;
  // Update time fields to match the new date
  if (currentLog.time_start) {
    currentLog.time_start = newDate + "T" + currentLog.time_start.slice(11);
  }
  if (currentLog.time_end) {
    currentLog.time_end = newDate + "T" + currentLog.time_end.slice(11);
  }
  updateLog();
}

// ── Timings ───────────────────────────────────────────────────
function updateTimings() {
  const startVal = document.getElementById("log-time-start").value;
  const endVal = document.getElementById("log-time-end").value;
  const today = new Date().toISOString().slice(0, 10);

  if (startVal) currentLog.time_start = `${today}T${startVal}:00`;
  if (endVal) currentLog.time_end = `${today}T${endVal}:00`;

  calcLogMinutes(currentLog);
  updateStats();
  checkGrayzone();
  updateLog();
}

function updateStats() {
  const h = Math.floor(currentLog.task_total_minutes / 60);
  const m = currentLog.task_total_minutes % 60;
  document.getElementById("stat-hours").textContent = formatDuration(currentLog.task_total_minutes);
  document.getElementById("stat-tasks").textContent = currentLog.tasks?.length || 0;

  if (currentLog.day_duration_minutes > 0) {
    const pct = Math.round((currentLog.grayzone_minutes / currentLog.day_duration_minutes) * 100);
    document.getElementById("stat-gray").textContent = pct + "%";
    renderTimeBar();
  } else {
    document.getElementById("stat-gray").textContent = "—";
  }
}

function renderTimeBar() {
  const bar = document.getElementById("time-bar");
  if (!currentLog.day_duration_minutes) { bar.innerHTML = ""; return; }

  const total = currentLog.day_duration_minutes;
  const segments = buildTimeBarSegments();
  bar.innerHTML = segments.map(s =>
    `<div class="time-bar-fill" style="width:${(s.minutes/total)*100}%;background:${s.color}" title="${s.label}"></div>`
  ).join("");
}

function buildTimeBarSegments() {
  const byType = {};
  (currentLog.tasks || []).forEach(task => {
    const typeId = task.activity_type_id || "sys-gray";
    const color = getActivityTypeColor(logData, typeId);
    if (!byType[typeId]) byType[typeId] = { minutes: 0, color };
    byType[typeId].minutes += task.duration_minutes || 0;
  });

  const segments = Object.values(byType);
  if (currentLog.grayzone_minutes > 0) {
    segments.push({ minutes: currentLog.grayzone_minutes, color: getActivityTypeColor(logData, "sys-gray"), label: t("log.grayzone_label") });
  }
  return segments;
}

function checkGrayzone() {
  const warning = document.getElementById("grayzone-warning");
  const pctEl = document.getElementById("grayzone-pct");
  if (greyzoneExceeded(currentLog)) {
    const pct = Math.round((currentLog.grayzone_minutes / currentLog.day_duration_minutes) * 100);
    pctEl.textContent = pct + "%";
    warning.classList.remove("hidden");
    currentLog.grayzone_prompted = true;
  } else {
    warning.classList.add("hidden");
  }
}

// ── Rating ────────────────────────────────────────────────────
function renderRating() {
  const container = document.getElementById("rating-btns");
  container.innerHTML = [1,2,3,4,5].map(n =>
    `<button class="rating-btn ${currentLog.day_rating === n ? "active" : ""}"
      onclick="setRating(${n})">${n} <span style="font-size:1.1rem">${t("log.rating_" + n)}</span></button>`
  ).join("");
}

function setRating(n) {
  currentLog.day_rating = n;
  updateLog();
  renderRating();
}

// ── To-dos ────────────────────────────────────────────────────
function renderTodos() {
  const list = document.getElementById("todos-list");
  const empty = document.getElementById("todos-empty");
  const todos = logData.todos || [];

  if (!todos.length) {
    list.innerHTML = "";
    empty.style.display = "block";
    return;
  }
  empty.style.display = "none";

  list.innerHTML = todos.map(todo => `
    <div class="todo-item ${todo.completed ? "done" : ""}">
      <div class="todo-check ${todo.completed ? "checked" : ""}" onclick="toggleTodo('${todo.todo_id}')">
        ${todo.completed ? "✓" : ""}
      </div>
      <div style="flex:1">
        <div class="todo-text">${escHtml(todo.description)}</div>
        ${todo.due_date ? `<div class="todo-meta">📅 ${formatDate(todo.due_date + "T12:00:00")}</div>` : ""}
        ${todo.project_id ? `<div class="todo-meta">${getTodoProjectName(todo.project_id)}</div>` : ""}
      </div>
      <button class="btn btn--icon btn--sm" onclick="removeTodo('${todo.todo_id}')">✕</button>
    </div>
  `).join("");
}

function getTodoProjectName(projectId) {
  const p = logData.projects?.find(x => x.project_id === projectId);
  return p ? `📁 ${p.project_name}` : "";
}

function renderAllTodoLists() {
  renderTodos();
  renderTodosInto("todos-list-inline", "todos-empty-inline");
  renderTodosInto("todos-list-eod", "todos-empty-eod");
}

function renderTodosInto(listId, emptyId) {
  const list = document.getElementById(listId);
  const empty = document.getElementById(emptyId);
  if (!list) return;
  const todos = logData.todos || [];
  if (!todos.length) {
    list.innerHTML = "";
    if (empty) empty.style.display = "block";
    return;
  }
  if (empty) empty.style.display = "none";
  list.innerHTML = todos.map(todo => `
    <div class="todo-item ${todo.completed ? "done" : ""}">
      <div class="todo-check ${todo.completed ? "checked" : ""}" onclick="toggleTodo('${todo.todo_id}')">
        ${todo.completed ? "✓" : ""}
      </div>
      <div style="flex:1">
        <div class="todo-text">${escHtml(todo.description)}</div>
        ${todo.due_date ? `<div class="todo-meta">📅 ${formatDate(todo.due_date + "T12:00:00")}</div>` : ""}
      </div>
      <button class="btn btn--icon btn--sm" onclick="removeTodo('${todo.todo_id}')">✕</button>
    </div>
  `).join("");
}

function toggleTodosPanel(btn) {
  const body = document.getElementById("morning-todos-body");
  const item = btn.closest(".card");
  if (body.style.display === "none" || body.style.display === "") {
    body.style.display = "block";
    btn.querySelector(".accordion-arrow").style.transform = "rotate(180deg)";
  } else {
    body.style.display = "none";
    btn.querySelector(".accordion-arrow").style.transform = "";
  }
}

function addTodo() {
  const desc = prompt(t("log.todo_description"));
  if (!desc?.trim()) return;
  const todo = {
    todo_id: generateUUID(),
    description: desc.trim(),
    project_id: null,
    created_date: new Date().toISOString().slice(0, 10),
    due_date: null,
    completed: false,
    completed_date: null,
    log_id_completed: null,
  };
  logData.todos.push(todo);
  saveData(logData);
  renderAllTodoLists();
}

function toggleTodo(todoId) {
  const todo = logData.todos.find(x => x.todo_id === todoId);
  if (!todo) return;
  todo.completed = !todo.completed;
  if (todo.completed) {
    todo.completed_date = new Date().toISOString().slice(0, 10);
    todo.log_id_completed = currentLog.log_id;
    if (!currentLog.todos_completed_today.includes(todoId)) {
      currentLog.todos_completed_today.push(todoId);
    }
  } else {
    todo.completed_date = null;
    todo.log_id_completed = null;
    currentLog.todos_completed_today = currentLog.todos_completed_today.filter(x => x !== todoId);
  }
  saveData(logData);
  renderAllTodoLists();
}

function removeTodo(todoId) {
  logData.todos = logData.todos.filter(x => x.todo_id !== todoId);
  saveData(logData);
  renderAllTodoLists();
}

// ── Projects sidebar ──────────────────────────────────────────
function renderProjectsSidebar() {
  const list = document.getElementById("projects-sidebar-list");
  const projects = logData.projects?.filter(p => p.status === "active") || [];
  list.innerHTML = projects.map(p => `
    <div class="drawer-item" style="margin-bottom:var(--sp-2);cursor:default">
      <div style="flex:1">
        <div class="drawer-item-label">${escHtml(p.project_name)}</div>
        <div class="drawer-item-sub">${escHtml(p.client_name || "")}</div>
      </div>
      <span class="tag" style="background:var(--color-chlorophyll-500);color:white;font-size:1rem">${t("drawer.projects_status_active")}</span>
    </div>
  `).join("") || `<p class="text-muted" style="font-size:1.3rem">—</p>`;
}

// ── Drawers ───────────────────────────────────────────────────
function renderDrawers() {
  renderPeopleDrawer();
  renderToolsDrawer();
  renderTypesDrawer();
  if (logData.pathway === "hub") renderProjectsDrawer();
  renderTagsDrawer();
}

function renderDrawerToggles() {
  const container = document.getElementById("drawer-toggle-btns");
  const drawers = [
    { id: "drawer-people", key: "drawer.people_title" },
    { id: "drawer-tools", key: "drawer.tools_title" },
    { id: "drawer-types", key: "drawer.types_title" },
  ];
  if (logData.pathway === "hub") {
    drawers.push({ id: "drawer-projects", key: "drawer.projects_title" });
  }
  // Tags drawer: only show if this program/course has competencies or outcomes
  const tagPool = _getTagPool();
  if (tagPool.length > 0) {
    drawers.push({ id: "drawer-tags", key: "drawer.tags_title" });
    const mobileBtn = document.getElementById("mobile-tags-btn");
    if (mobileBtn) mobileBtn.style.display = "";
  }
  container.innerHTML = drawers.map(d =>
    `<button class="drawer-toggle" onclick="openDrawer('${d.id}')" data-i18n="${d.key}"></button>`
  ).join("");
  applyLanguage(getCurrentLang());
}

function openDrawer(id) {
  closeAllDrawers();
  renderDrawers();
  document.getElementById(id)?.classList.add("open");
  document.getElementById("drawer-overlay")?.classList.add("visible");
}

function closeAllDrawers() {
  document.querySelectorAll(".drawer-panel").forEach(d => d.classList.remove("open"));
  document.getElementById("drawer-overlay")?.classList.remove("visible");
}

function renderPeopleDrawer() {
  const list = document.getElementById("people-drawer-list");
  const people = logData.people || [];
  list.innerHTML = people.map(p => `
    <div class="drawer-item" draggable="true"
      data-assign-type="person" data-assign-id="${p.person_id}"
      ondragstart="startDrag(event,'person','${p.person_id}')">
      <div class="drawer-item-dot" style="background:var(--color-cobalt-500)"></div>
      <div>
        <div class="drawer-item-label">${escHtml(p.name)}</div>
        <div class="drawer-item-sub">${escHtml(p.role_type || "")}${p.organization ? " · " + escHtml(p.organization) : ""}</div>
      </div>
    </div>
  `).join("") || `<p class="text-muted" style="font-size:1.3rem">—</p>`;
}

function renderToolsDrawer() {
  const list = document.getElementById("tools-drawer-list");
  const tools = logData.tools || [];
  list.innerHTML = tools.map(tool => `
    <div class="drawer-item" draggable="true"
      data-assign-type="tool" data-assign-id="${tool.tool_id}"
      ondragstart="startDrag(event,'tool','${tool.tool_id}')">
      <div class="drawer-item-dot" style="background:var(--color-gold-500)"></div>
      <div>
        <div class="drawer-item-label">${escHtml(tool.name)}</div>
        <div class="drawer-item-sub">${escHtml(tool.category || "")}</div>
      </div>
    </div>
  `).join("") || `<p class="text-muted" style="font-size:1.3rem">—</p>`;
}

function renderTypesDrawer() {
  const list = document.getElementById("types-drawer-list");
  const types = logData.activity_types || [];
  list.innerHTML = types.map(at => {
    const label = at.label_key ? t(at.label_key) : at.label;
    return `
      <div class="drawer-item" draggable="true"
        data-assign-type="activity_type" data-assign-id="${at.type_id}"
        ondragstart="startDrag(event,'activity_type','${at.type_id}')">
        <div class="drawer-item-dot" style="background:${getActivityTypeColor(logData, at.type_id)}"></div>
        <div>
          <div class="drawer-item-label">${escHtml(label)}</div>
          ${at.system ? `<div class="drawer-item-sub" data-i18n="drawer.types_system"></div>` : ""}
        </div>
      </div>
    `;
  }).join("");
  applyLanguage(getCurrentLang());
}

function renderProjectsDrawer() {
  const body = document.getElementById("projects-drawer-body");
  if (!body) return;
  const projects = logData.projects || [];
  const statuses = ["active","completed","paused","cancelled"];
  body.innerHTML = projects.map(p => {
    const statusOpts = statuses.map(s =>
      `<option value="${s}" ${p.status === s ? "selected" : ""} data-i18n="drawer.projects_status_${s}"></option>`
    ).join("");
    return `
      <div class="drawer-item" style="flex-direction:column;align-items:flex-start;gap:var(--sp-2)"
        data-assign-type="project" data-assign-id="${p.project_id}">
        <div class="drawer-item-label">${escHtml(p.project_name)}</div>
        <div class="drawer-item-sub">${escHtml(p.client_name || "")}</div>
        <div class="flex gap-2 items-center" style="width:100%">
          <select style="flex:1;font-size:1.3rem" onchange="updateProjectStatus('${p.project_id}',this.value)">${statusOpts}</select>
        </div>
      </div>
    `;
  }).join("") || `<p class="text-muted" style="font-size:1.3rem;padding:var(--sp-4)">—</p>`;
  applyLanguage(getCurrentLang());
}

function updateProjectStatus(projectId, status) {
  const project = logData.projects.find(p => p.project_id === projectId);
  if (!project) return;
  project.status = status;
  if (status === "completed" || status === "cancelled") {
    project.project_end_date = new Date().toISOString().slice(0, 10);
  }
  saveData(logData);
  renderProjectsSidebar();
}

// ── Drag and drop ─────────────────────────────────────────────
function startDrag(event, type, id) {
  event.dataTransfer.setData("type", type);
  event.dataTransfer.setData("id", id);
}

// For mobile: open a drawer and wire its items to a specific task
let _pendingTaskId = null;
function openDrawerForTask(event, drawerId, taskId) {
  event.stopPropagation();
  _pendingTaskId = taskId;
  openDrawer(drawerId);
  // After drawer opens, clicking a drawer item assigns it to the pending task
  setTimeout(() => {
    document.querySelectorAll(`#${drawerId} .drawer-item`).forEach(item => {
      item.style.cursor = "pointer";
      item._taskHandler = function() {
        const type = item.dataset.assignType;
        const id   = item.dataset.assignId;
        if (!type || !id || !_pendingTaskId) return;
        if (type === "person")        addPersonToTask(_pendingTaskId, id);
        else if (type === "tool")     addToolToTask(_pendingTaskId, id);
        else if (type === "project")  addProjectToTask(_pendingTaskId, id);
        else if (type === "activity_type") setActivityType(_pendingTaskId, id);
        else if (type === "learning_ref")  addLearningRef(_pendingTaskId, id);
        _pendingTaskId = null;
        closeAllDrawers();
      };
      item.addEventListener("click", item._taskHandler);
    });
  }, 80);
}

// ── Add forms in drawers ──────────────────────────────────────
function showAddPersonForm() { document.getElementById("add-person-form").classList.remove("hidden"); }
function hideAddPersonForm() { document.getElementById("add-person-form").classList.add("hidden"); }

function saveNewPerson() {
  const name = document.getElementById("new-person-name").value.trim();
  if (!name) return;
  const cache = loadCache();
  const person = addPerson(logData, {
    name,
    role_type: document.getElementById("new-person-role").value.trim(),
    organization: document.getElementById("new-person-org").value.trim(),
    notes: "",
  });
  updateCache(logData);
  hideAddPersonForm();
  document.getElementById("new-person-name").value = "";
  document.getElementById("new-person-role").value = "";
  document.getElementById("new-person-org").value = "";
  renderPeopleDrawer();
}

function showAddToolForm() { document.getElementById("add-tool-form").classList.remove("hidden"); }
function hideAddToolForm() { document.getElementById("add-tool-form").classList.add("hidden"); }

function saveNewTool() {
  const name = document.getElementById("new-tool-name").value.trim();
  if (!name) return;
  addTool(logData, {
    name,
    category: document.getElementById("new-tool-cat").value.trim(),
  });
  updateCache(logData);
  hideAddToolForm();
  document.getElementById("new-tool-name").value = "";
  document.getElementById("new-tool-cat").value = "";
  renderToolsDrawer();
}

function showAddTypeForm() { document.getElementById("add-type-form").classList.remove("hidden"); }
function hideAddTypeForm() { document.getElementById("add-type-form").classList.add("hidden"); }

function buildColorPicker() {
  const picker = document.getElementById("type-color-picker");
  if (!picker) return;
  picker.innerHTML = LCI_PALETTE.map(c =>
    `<div class="color-swatch ${c.hex === "#00587c" ? "selected" : ""}"
      style="background:${c.hex}" title="${c.name}"
      onclick="selectColor('${c.hex}', this)"></div>`
  ).join("");
}

function selectColor(hex, el) {
  document.querySelectorAll(".color-swatch").forEach(s => s.classList.remove("selected"));
  el.classList.add("selected");
  document.getElementById("new-type-color").value = hex;
}

function saveNewType() {
  const label = document.getElementById("new-type-label").value.trim();
  const color = document.getElementById("new-type-color").value;
  if (!label) return;
  addActivityType(logData, { label, color });
  hideAddTypeForm();
  document.getElementById("new-type-label").value = "";
  renderTypesDrawer();
}

function showAddProjectForm() { document.getElementById("add-project-form").classList.remove("hidden"); }
function hideAddProjectForm() { document.getElementById("add-project-form").classList.add("hidden"); }

function saveNewProject() {
  const name = document.getElementById("new-proj-name").value.trim();
  if (!name) return;
  addProject(logData, {
    project_name: name,
    client_name: document.getElementById("new-proj-client").value.trim(),
    student_joined_date: document.getElementById("new-proj-joined").value || new Date().toISOString().slice(0, 10),
    project_start_date: null,
    client_person_id: null,
  });
  hideAddProjectForm();
  document.getElementById("new-proj-name").value = "";
  renderProjectsDrawer();
  renderProjectsSidebar();
}

// ── Update log state ──────────────────────────────────────────
function updateLog() {
  currentLog.late_filing = document.getElementById("late-filing")?.checked || false;
  // date may have been updated by updateLogDate() — no DOM read needed
  currentLog.modality_onsite = document.getElementById("log-onsite")?.checked || false;
  currentLog.modality_remote = document.getElementById("log-remote")?.checked || false;
  currentLog.project_status_updates = collectProjectStatusUpdates();
  currentLog.obstacle = document.getElementById("log-obstacle")?.value.trim() || "";
  currentLog.obstacle_response = document.getElementById("log-obstacle-response")?.value.trim() || "";
  currentLog.win = document.getElementById("log-win")?.value.trim() || "";
  currentLog.plan_tomorrow = document.getElementById("log-plan-tomorrow")?.value.trim() || "";
  currentLog.closing_word = document.getElementById("log-closing")?.value.trim() || "";
  // Safety reads — these are normally set by dedicated handlers,
  // but updateLog catches any state they may have missed
  if (currentLog.morning_energy == null) {
    // left as null — renderMorningEnergy handles it
  }
  // day_rating and weekly_wrap are always set by their own handlers; no DOM read needed here
  currentLog.grayzone_description = document.getElementById("grayzone-desc")?.value.trim() || "";

  // Upsert in data
  const idx = logData.logs.findIndex(l => l.log_id === currentLog.log_id);
  if (idx >= 0) logData.logs[idx] = currentLog;
  else logData.logs.push(currentLog);

  saveData(logData);
  lastDownloaded = false;
  showDownloadBanner();
  updateFooterStatus();
  resetIdleTimer();
}

// ── Download ──────────────────────────────────────────────────
function saveAndDownload() {
  updateLog();
  exportLogJSON(logData, currentLog);
  stampDownload("d"); // record daily download for calendar view
  lastDownloaded = true;
  hideDownloadBanner();
  updateFooterStatus(true);
  // Show upload reminder (respects snooze)
  setTimeout(() => showUploadReminder("d"), 400);
  // Update FAB state
  const fab = document.getElementById("fab-download");
  if (fab) {
    fab.classList.add("downloaded");
    const lang = getCurrentLang();
    fab.innerHTML = `✓ ${lang === "fr-CA" ? "Téléchargé" : "Downloaded"}`;
    setTimeout(() => {
      fab.classList.remove("downloaded");
      fab.innerHTML = `⬇ <span>${t("log.download_cta")}</span>`;
    }, 3000);
  }
}

function showDownloadBanner() {
  document.getElementById("download-banner").classList.remove("hidden");
}

function hideDownloadBanner() {
  const banner = document.getElementById("download-banner");
  banner.classList.add("hidden");
  banner.classList.add("downloaded");
}

function updateFooterStatus(saved = false) {
  const el = document.getElementById("footer-save-status");
  if (!el) return;
  const lang = getCurrentLang();
  const now = new Date().toLocaleTimeString(lang, { timeStyle: "short" });
  if (saved) {
    el.textContent = lang === "fr-CA" ? `Téléchargé à ${now}` : `Downloaded at ${now}`;
    el.style.color = "var(--success)";
  } else {
    // Show brief "saving…" flash then settle on "autosaved"
    el.textContent = lang === "fr-CA" ? "Enregistrement…" : "Saving…";
    el.style.color = "var(--text-subtle)";
    setTimeout(() => {
      if (!lastDownloaded) {
        el.textContent = lang === "fr-CA"
          ? `✓ Sauvegardé automatiquement à ${now}`
          : `✓ Auto-saved at ${now}`;
        el.style.color = "var(--success)";
      }
    }, 400);
  }
}

// ── Idle timer ────────────────────────────────────────────────
function setupIdleTimer() {
  resetIdleTimer();
}

function resetIdleTimer() {
  if (idleTimer) clearTimeout(idleTimer);
  document.getElementById("idle-banner")?.classList.add("hidden");
  idleTimer = setTimeout(() => {
    if (!lastDownloaded) {
      document.getElementById("idle-banner")?.classList.remove("hidden");
    }
  }, SETTINGS.IDLE_REMINDER_MINUTES * 60 * 1000);
}

// escHtml is defined in app.js

// ── Tomorrow reminder ────────────────────────────────────────
function showTomorrowReminder() {
  const banner = document.getElementById("tomorrow-reminder");
  const textEl = document.getElementById("tomorrow-reminder-text");
  if (!banner || !textEl) return;

  // Find the most recent previous log that has a plan_tomorrow
  const today = currentLog.date;
  const prevLogs = (logData.logs || [])
    .filter(l => l.date < today && l.plan_tomorrow)
    .sort((a, b) => b.date.localeCompare(a.date));

  if (prevLogs.length && prevLogs[0].plan_tomorrow) {
    textEl.textContent = prevLogs[0].plan_tomorrow;
    banner.classList.remove("hidden");
  } else {
    banner.classList.add("hidden");
  }
}

// ── Weekly wrap-up ────────────────────────────────────────────
function getWeekEndDay() {
  // Reads from saved data; falls back to 5 (Friday) if not set
  return parseInt(logData?.context?.week_end_day ?? 5);
}

// Returns competencies for the current student, or [] if courses.js not loaded
// or no course code is set.
function _getCurrentCompetencies() {
  if (typeof getStudentCompetencies !== "function") return [];
  const courseCode  = logData?.context?.internship_course_code || "generic";
  const programCode = logData?.profile?.program || "";
  return getStudentCompetencies(courseCode, programCode);
}

// Renders the competency reflection textareas inside a given container element.
// mode: "daily" (optional, collapsible) | "weekly" (mandatory, always visible)
// Saved notes are read from currentLog.weekly_wrap.competency_notes (keyed by
// competency code) for weekly, and from currentLog.competency_notes for daily.
function renderCompetencyFields(container, mode) {
  const competencies = _getCurrentCompetencies();
  if (!competencies.length) {
    container.innerHTML = "";
    container.style.display = "none";
    return;
  }
  container.style.display = "";

  const lang     = getCurrentLang();
  const isWeekly = mode === "weekly";
  const savedNotes = isWeekly
    ? (currentLog.weekly_wrap?.competency_notes || {})
    : (currentLog.competency_notes             || {});

  const hintKey = isWeekly ? "log.competency_weekly_hint" : "log.competency_daily_hint";

  container.innerHTML = `
    <div class="section-title" style="margin-top:var(--sp-5)">${t("log.competency_section")}</div>
    <p class="form-hint" style="margin-bottom:var(--sp-4)">${t(hintKey)}</p>
    ${competencies.map(comp => `
      <div class="form-group" style="margin-bottom:var(--sp-5)">
        <label style="font-weight:600">
          ${escHtml(comp.code)}
          <span style="font-weight:400;color:var(--text-muted)"> — ${escHtml(comp.title[lang] || comp.title["fr-CA"])}</span>
        </label>
        <textarea
          class="competency-note-ta"
          data-comp-code="${escHtml(comp.code)}"
          data-mode="${mode}"
          rows="3"
          ${isWeekly ? "required" : ""}
          oninput="${isWeekly ? "updateWeeklyWrap()" : "updateDailyCompetencyNotes()"}"
          placeholder="${isWeekly ? escHtml(t("log.competency_weekly_hint")) : escHtml(t("log.competency_daily_hint"))}"
        >${escHtml(savedNotes[comp.code] || "")}</textarea>
      </div>
    `).join("")}
  `;
}

function checkWeeklyWrap() {
  const card = document.getElementById("weekly-wrap-card");
  if (!card) return;
  const d = new Date(currentLog.date + "T12:00:00");
  const dow = d.getDay();
  const weekEndDay = getWeekEndDay();

  if (dow === weekEndDay || currentLog.weekly_wrap) {
    card.style.display = "block";

    // Teacher custom field
    const tcf   = logData?.context?.teacher_custom_field;
    const tfDiv = document.getElementById("weekly-teacher-field");
    if (tfDiv && tcf?.label) {
      tfDiv.classList.remove("hidden");
      const lbl = document.getElementById("weekly-teacher-label");
      if (lbl) lbl.textContent = tcf.label;
      const ta = document.getElementById("log-weekly-teacher-note");
      if (ta) {
        ta.placeholder = tcf.placeholder || "";
        ta.value = currentLog.weekly_wrap?.teacher_note || "";
      }
    }

    // Competency reflection (mandatory on wrap day)
    const compContainer = document.getElementById("weekly-competency-fields");
    if (compContainer) renderCompetencyFields(compContainer, "weekly");

  } else {
    card.style.display = "none";
  }

  // Daily competency section (optional, always visible when course has competencies)
  const dailyContainer = document.getElementById("daily-competency-fields");
  if (dailyContainer) renderCompetencyFields(dailyContainer, "daily");
}

// Collects all competency note textareas for a given mode and returns
// an object keyed by competency code, e.g. { "00SE": "...", "00SH": "..." }
function _collectCompetencyNotes(mode) {
  const notes = {};
  document.querySelectorAll(`.competency-note-ta[data-mode="${mode}"]`).forEach(ta => {
    const code = ta.dataset.compCode;
    const val  = ta.value.trim();
    if (code && val) notes[code] = val;
  });
  return notes;
}

function updateWeeklyWrap() {
  const highlight    = document.getElementById("log-weekly-highlight")?.value.trim()    || "";
  const learning     = document.getElementById("log-weekly-learning")?.value.trim()     || "";
  const change       = document.getElementById("log-weekly-change")?.value.trim()       || "";
  const teacher_note = document.getElementById("log-weekly-teacher-note")?.value.trim() || "";
  const competency_notes = _collectCompetencyNotes("weekly");

  if (highlight || learning || change || teacher_note || Object.keys(competency_notes).length) {
    currentLog.weekly_wrap = { highlight, learning, change, teacher_note, competency_notes };
  } else {
    currentLog.weekly_wrap = null;
  }
  updateLog();
}

// Saves daily (optional) competency notes directly onto the log object.
function updateDailyCompetencyNotes() {
  const notes = _collectCompetencyNotes("daily");
  currentLog.competency_notes = Object.keys(notes).length ? notes : undefined;
  updateLog();
}

// ── Project status updates ───────────────────────────────────
function renderProjectStatusCard() {
  const card = document.getElementById("project-status-card");
  const list = document.getElementById("project-status-list");
  if (!card || !list) return;

  const activeProjects = (logData.projects || []).filter(p => p.status === "active");
  if (!activeProjects.length) { card.classList.add("hidden"); return; }

  card.classList.remove("hidden");
  const saved = currentLog.project_status_updates || [];

  list.innerHTML = activeProjects.map(proj => {
    const existing = saved.find(u => u.project_id === proj.project_id) || {};
    const statusOpts = ["active","completed","paused","cancelled"].map(s =>
      `<option value="${s}" ${(existing.status || proj.status) === s ? "selected" : ""}
        data-i18n="drawer.projects_status_${s}"></option>`
    ).join("");
    return `
      <div class="repeatable-block" style="margin-bottom:var(--sp-3)" data-proj-id="${proj.project_id}">
        <div style="font-weight:500;margin-bottom:var(--sp-3)">${escHtml(proj.project_name)}
          ${proj.client_name ? `<span class="text-muted" style="font-weight:400"> · ${escHtml(proj.client_name)}</span>` : ""}
        </div>
        <div class="form-row">
          <div class="form-group" style="margin:0">
            <label data-i18n="log.project_status_label"></label>
            <select class="proj-status-select" onchange="updateProjectStatusFromLog('${proj.project_id}', this.value)">
              ${statusOpts}
            </select>
          </div>
        </div>
        <div class="form-group" style="margin-top:var(--sp-3);margin-bottom:0">
          <label data-i18n="log.project_status_notes"></label>
          <textarea rows="2" class="proj-status-notes"
            oninput="updateProjectStatusNotes('${proj.project_id}', this.value)"
            >${escHtml(existing.notes || "")}</textarea>
        </div>
      </div>
    `;
  }).join("");
  applyLanguage(getCurrentLang());
}

function updateProjectStatusFromLog(projectId, status) {
  if (!currentLog.project_status_updates) currentLog.project_status_updates = [];
  let entry = currentLog.project_status_updates.find(u => u.project_id === projectId);
  if (!entry) {
    entry = { project_id: projectId, status, notes: "" };
    currentLog.project_status_updates.push(entry);
  } else {
    entry.status = status;
  }
  // Also update the project itself
  const proj = logData.projects.find(p => p.project_id === projectId);
  if (proj) proj.status = status;
  updateLog();
}

function updateProjectStatusNotes(projectId, notes) {
  if (!currentLog.project_status_updates) currentLog.project_status_updates = [];
  let entry = currentLog.project_status_updates.find(u => u.project_id === projectId);
  if (!entry) {
    entry = { project_id: projectId, status: "active", notes };
    currentLog.project_status_updates.push(entry);
  } else {
    entry.notes = notes;
  }
  updateLog();
}

function collectProjectStatusUpdates() {
  const blocks = document.querySelectorAll("#project-status-list [data-proj-id]");
  return Array.from(blocks).map(b => ({
    project_id: b.dataset.projId,
    status: b.querySelector(".proj-status-select")?.value || "active",
    notes: b.querySelector(".proj-status-notes")?.value?.trim() || "",
  }));
}

// ── End-of-internship and weekly report reminders ────────────
function checkEndReminders() {
  const today = currentLog.date;

  // End-of-internship banner
  const endBanner = document.getElementById("end-of-internship-banner");
  if (endBanner) {
    const endDate = logData?.context?.scheduled_end_date;
    if (endDate && today >= endDate) {
      endBanner.classList.remove("hidden");
    } else {
      endBanner.classList.add("hidden");
    }
  }

  // Weekly report reminder (shown on week-end day)
  const weeklyReminder = document.getElementById("weekly-report-reminder");
  if (weeklyReminder) {
    const d = new Date(today + "T12:00:00");
    const dow = d.getDay();
    const weekEndDay = getWeekEndDay();
    if (dow === weekEndDay) {
      weeklyReminder.classList.remove("hidden");
    } else {
      weeklyReminder.classList.add("hidden");
    }
  }
}

// ── Mobile enhancements ───────────────────────────────────────
function initMobile() {
  // Show mobile drawer bar (CSS controls visibility via media query)
  const bar = document.getElementById("mobile-drawer-bar");
  if (bar) bar.style.removeProperty("display");

  // Show hub projects button if needed
  if (logData && logData.pathway === "hub") {
    const projBtn = document.getElementById("mobile-projects-btn");
    if (projBtn) projBtn.style.removeProperty("display");
  }
}



// ── Intro tour ────────────────────────────────────────────────
const TOUR_STEPS = [
  { icon: "📋", title: "tour.step1.title", text: "tour.step1.text", target: null },
  { icon: "⚡", title: "tour.step2.title", text: "tour.step2.text", target: "morning-energy-group" },
  { icon: "✅", title: "tour.step3.title", text: "tour.step3.text", target: "morning-todos-card" },
  { icon: "➕", title: "tour.step4.title", text: "tour.step4.text", target: "tasks-list" },
  { icon: "🗂",  title: "tour.step5.title", text: "tour.step5.text", target: "drawer-toggle-btns", targetMobile: "mobile-drawer-bar" },
  { icon: "🌟", title: "tour.step6.title", text: "tour.step6.text", target: "log-win" },
  { icon: "⬇",  title: "tour.step7.title", text: "tour.step7.text", target: "fab-download" },
];

let _tourStep = 0;

function startTour(autoStart = true) {
  _tourStep = 0;
  document.getElementById("tour-overlay")?.classList.remove("hidden");
  renderTourStep();
  // Mark as seen so it doesn't auto-show again
  if (autoStart) localStorage.setItem("internship_tour_seen", "1");
}

function endTour() {
  document.getElementById("tour-overlay")?.classList.add("hidden");
  clearTourHighlight();
  localStorage.setItem("internship_tour_seen", "1");
  document.getElementById("help-btn")?.classList.remove("hidden");
}

function tourStep(dir) {
  // Check for finish BEFORE clamping — if on last step and going forward, end tour
  if (dir > 0 && _tourStep === TOUR_STEPS.length - 1) {
    endTour();
    return;
  }
  _tourStep = Math.max(0, Math.min(TOUR_STEPS.length - 1, _tourStep + dir));
  renderTourStep();
}

function renderTourStep() {
  const step = TOUR_STEPS[_tourStep];
  const total = TOUR_STEPS.length;
  const isLast = _tourStep === total - 1;

  document.getElementById("tour-icon").textContent  = step.icon;
  document.getElementById("tour-title").textContent = t(step.title);
  document.getElementById("tour-text").textContent  = t(step.text);
  document.getElementById("tour-skip-btn").textContent = t("tour.skip");
  document.getElementById("tour-prev-btn").textContent = t("tour.prev");
  document.getElementById("tour-next-btn").textContent = isLast ? t("tour.finish") : t("tour.next");
  document.getElementById("tour-prev-btn").style.visibility = _tourStep === 0 ? "hidden" : "visible";

  // Progress dots
  const prog = document.getElementById("tour-progress");
  prog.innerHTML = TOUR_STEPS.map((_, i) =>
    `<div class="tour-dot ${i === _tourStep ? "active" : i < _tourStep ? "done" : ""}"></div>`
  ).join("");

  // Highlight target element — use mobile target on small screens
  const isMobile = window.innerWidth <= 768;
  const targetId = (isMobile && step.targetMobile) ? step.targetMobile : step.target;
  if (targetId) {
    highlightElement(targetId);
    const el = document.getElementById(targetId);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
  } else {
    clearTourHighlight();
  }
}

function highlightElement(targetId) {
  const target = document.getElementById(targetId);
  const highlight = document.getElementById("tour-highlight");
  if (!target || !highlight) return;

  const rect = target.getBoundingClientRect();
  const pad = 8;
  highlight.style.cssText = `
    top: ${rect.top + window.scrollY - pad}px;
    left: ${rect.left + window.scrollX - pad}px;
    width: ${rect.width + pad * 2}px;
    height: ${rect.height + pad * 2}px;
  `;
  highlight.classList.remove("hidden");
}

function clearTourHighlight() {
  document.getElementById("tour-highlight")?.classList.add("hidden");
}

function checkAutoTour() {
  const seen = localStorage.getItem("internship_tour_seen");
  const hasData = logData && logData.profile?.full_name;
  if (!seen && hasData) {
    // Small delay so page renders first
    setTimeout(() => startTour(true), 600);
  } else if (seen) {
    document.getElementById("help-btn")?.classList.remove("hidden");
  }
}

// ── Sidebar hook ─────────────────────────────────────────────
function onSidebarLoad() {
  _invalidateTagPool(); // new data may mean different program/course → rebuild pool
  logData = loadData();
  if (!logData?.profile?.full_name) return;

  document.getElementById("no-data-warning")?.classList.add("hidden");
  document.getElementById("log-main")?.classList.remove("hidden");

  // Find or create today's log entry
  const today = new Date().toISOString().slice(0, 10);
  currentLog = getTodayLogId(logData);
  if (!currentLog) {
    currentLog = createNewLog(today);
    logData.logs.push(currentLog);
    saveData(logData);
  }

  renderAll();
  renderDrawerToggles?.();
  checkWeeklyWrap?.();
  applyLanguage(getCurrentLang());
}

// ── Competencies & learning outcomes drawer ───────────────────

let _tagPoolCache = null;

function _getTagPool() {
  if (_tagPoolCache) return _tagPoolCache;
  if (typeof getStudentTagPool !== "function") return [];
  const courseCode  = logData?.context?.internship_course_code || "generic";
  const programCode = logData?.profile?.program || "";
  _tagPoolCache = getStudentTagPool(courseCode, programCode, getCurrentLang());
  return _tagPoolCache;
}

function _invalidateTagPool() { _tagPoolCache = null; }

function renderTagsDrawer(filter = "") {
  const list = document.getElementById("tags-drawer-list");
  if (!list) return;

  const lang = getCurrentLang();
  const isFr = lang === "fr-CA";
  const pool = _getTagPool();

  if (!pool.length) {
    list.innerHTML = `<p class="text-muted" style="font-size:1.3rem">${
      isFr ? "Aucune compétence ou résultat d'apprentissage défini pour ce programme."
            : "No competencies or learning outcomes defined for this program."
    }</p>`;
    return;
  }

  const q = filter.toLowerCase().trim();

  const matches = pool.filter(item => {
    if (!q) return true;
    const label = item.label[lang] || item.label["fr-CA"];
    return item.id.toLowerCase().includes(q) || label.toLowerCase().includes(q);
  });

  if (!matches.length) {
    list.innerHTML = `<p class="text-muted" style="font-size:1.3rem" data-i18n="drawer.tags_empty">${t("drawer.tags_empty")}</p>`;
    return;
  }

  const competencies = matches.filter(x => x.type === "competency");
  const outcomes     = matches.filter(x => x.type === "outcome");

  let html = "";

  if (competencies.length) {
    html += `<div style="font-size:1.1rem;font-weight:700;text-transform:uppercase;
                         letter-spacing:.06em;color:var(--text-subtle);
                         margin-bottom:var(--sp-2)">${t("drawer.tags_competency")}</div>`;
    html += competencies.map(item => _tagDrawerItem(item, lang, "var(--accent)")).join("");
  }
  if (outcomes.length) {
    html += `<div style="font-size:1.1rem;font-weight:700;text-transform:uppercase;
                         letter-spacing:.06em;color:var(--text-subtle);
                         margin:var(--sp-4) 0 var(--sp-2)">${t("drawer.tags_outcome")}</div>`;
    html += outcomes.map(item => _tagDrawerItem(item, lang, "var(--color-chlorophyll-500)")).join("");
  }

  list.innerHTML = html;
}

function _tagDrawerItem(item, lang, color) {
  const label = item.label[lang] || item.label["fr-CA"];
  const icon  = item.type === "competency" ? "🎓" : "📌";
  return `
    <div class="drawer-item" draggable="true"
      data-assign-type="learning_ref" data-assign-id="${escHtml(item.id)}"
      ondragstart="startDrag(event,'learning_ref','${escHtml(item.id)}')"
      style="cursor:pointer">
      <div class="drawer-item-dot" style="background:${color}"></div>
      <div style="min-width:0">
        <div class="drawer-item-label" style="color:${color};font-size:1.2rem;
             font-weight:700;margin-bottom:2px">${escHtml(item.id)}</div>
        <div class="drawer-item-sub" style="font-size:1.2rem;line-height:1.4;
             white-space:normal">${escHtml(label)}</div>
      </div>
    </div>`;
}

function filterTagsDrawer(query) {
  renderTagsDrawer(query);
}

function addLearningRef(taskId, refId) {
  const task = currentLog.tasks.find(t => t.task_id === taskId);
  if (!task) return;
  if (!task.learning_refs) task.learning_refs = [];
  // Determine type from pool
  const pool = _getTagPool();
  const item = pool.find(x => x.id === refId);
  if (!item) return;
  // Don't add duplicates
  if (task.learning_refs.some(r => r.id === refId)) return;
  task.learning_refs.push({ type: item.type, id: refId });
  updateLog();
  renderTaskTags(task);
}

function removeLearningRef(taskId, refId) {
  const task = currentLog.tasks.find(t => t.task_id === taskId);
  if (!task) return;
  task.learning_refs = (task.learning_refs || []).filter(r => r.id !== refId);
  updateLog();
  renderTaskTags(task);
}
