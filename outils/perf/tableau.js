/* ---------------------------------------------------------------------
   Taxonomy (must match the teacher-facing tool)
--------------------------------------------------------------------- */
const CATEGORY_LABELS = {
  formation_individuelle:"Formation individuelle (courte durée)",
  perfectionnement_individuel:"Perfectionnement individuel (scolarité créditée)",
  recyclage:"Recyclage", autre:"Autre"
};
const FORMAT_LABELS = {
  seminaire:"Séminaire", colloque:"Colloque", congres:"Congrès", conference:"Conférence",
  stage:"Stage en milieu industriel", cours_non_credite:"Cours non crédité", cours_credite:"Cours crédité",
  atelier:"Atelier", mentorat:"Mentorat / formation entre pairs", autre:"Autre"
};
const RD_LABELS = {
  a:"a) Matériel didactique, plans de cours communs", b:"b) Intervention sur les programmes",
  c:"c) Activités promotionnelles", d:"d) Plan de réussite", e:"e) Participation à un comité",
  f:"f) Assistance professionnelle", g:"g) Perfectionnement pédagogique", h:"h) Perfectionnement disciplinaire"
};
const RD_STATUS_LABELS = { en_attente:"En attente", approuvee:"Approuvée", refusee:"Refusée" };
const STATUS_LABELS = { planned:"Planifiée", in_progress:"En cours", completed:"Complétée", not_pursued:"Non réalisée" };
const PLAN_STATUS_LABELS = { expired:"Expiré", soon:"Bientôt à réviser", ok:"À jour", unknown:"Date manquante" };
const REVIEW_STATUS_LABELS = { new:"Nouveau — non revu", updated:"Mis à jour depuis la revue", reviewed:"Revu" };

const DEFAULT_AXES_CONFIG = {
  schemaVersion:"1.0", scaleMin:1, scaleMax:5,
  axes:[
    {id:"clarte", label:"Clarté des explications", description:"La capacité à expliquer les concepts de façon claire et compréhensible."},
    {id:"organisation", label:"Organisation du cours", description:"La structure, la planification et la cohérence du déroulement du cours."},
    {id:"engagement", label:"Engagement des étudiants", description:"La capacité à susciter l'intérêt et la participation active des étudiants."},
    {id:"retroaction", label:"Rétroaction et évaluation", description:"La qualité, la clarté et l'utilité de la rétroaction donnée aux étudiants."},
    {id:"disponibilite", label:"Disponibilité et soutien", description:"L'accessibilité et le soutien offerts aux étudiants en dehors des cours."},
    {id:"gestion", label:"Gestion de classe", description:"La capacité à maintenir un environnement d'apprentissage respectueux et productif."},
    {id:"numerique", label:"Utilisation du numérique", description:"L'intégration pertinente des technologies éducatives dans l'enseignement."}
  ]
};
let AXES_CONFIG = JSON.parse(JSON.stringify(DEFAULT_AXES_CONFIG));
let axesSource = "defaut";

/* ---------------------------------------------------------------------
   State
--------------------------------------------------------------------- */
let plans = []; // { _filename, ...planJson }
let reviewerNotes = {}; // key -> { reviewed:bool, reviewedAt:iso, lastSeenUpdatedAt:iso, notes:string }
let sortKey = "teacherName";
let sortDir = 1;

function addYears(dateObj, n){ const d=new Date(dateObj.getTime()); d.setFullYear(d.getFullYear()+n); return d; }
function fmtShort(d){ if(!d || isNaN(d)) return "—"; return d.toLocaleDateString("fr-CA", {year:"numeric", month:"short", day:"numeric"}); }
function fmtDateTime(iso){ if(!iso) return "—"; const d=new Date(iso); if(isNaN(d)) return "—"; return d.toLocaleString("fr-CA", {year:"numeric",month:"short",day:"numeric",hour:"2-digit",minute:"2-digit"}); }

/* ---------------------------------------------------------------------
   Loading teacher plan files
--------------------------------------------------------------------- */
function loadFiles(fileList){
  Array.from(fileList).forEach(file=>{
    if(!file.name.toLowerCase().endsWith(".json")) return;
    const reader = new FileReader();
    reader.onload = () => {
      try{
        const data = JSON.parse(reader.result);
        if(!data.schemaVersion) throw new Error("format non reconnu");
        data._filename = file.name;
        const dupeIdx = plans.findIndex(p => p._filename === file.name);
        if(dupeIdx !== -1) plans[dupeIdx] = data; else plans.push(data);
        renderAll();
      }catch(e){ console.warn("Fichier ignoré:", file.name, e.message); }
    };
    reader.readAsText(file);
  });
}

document.getElementById("btnLoadTrigger").addEventListener("click", ()=>document.getElementById("fileImport").click());
document.getElementById("fileImport").addEventListener("change", e=>{ loadFiles(e.target.files); e.target.value=""; });
document.getElementById("btnClear").addEventListener("click", ()=>{
  if(confirm("Retirer tous les plans chargés de cette session ? (vos notes privées ne sont pas affectées)")){ plans=[]; renderAll(); }
});

const dz = document.getElementById("dropzone");
["dragenter","dragover"].forEach(ev=>dz.addEventListener(ev, e=>{ e.preventDefault(); dz.classList.add("drag"); }));
["dragleave","drop"].forEach(ev=>dz.addEventListener(ev, e=>{ e.preventDefault(); dz.classList.remove("drag"); }));
dz.addEventListener("drop", e=>{ if(e.dataTransfer.files.length) loadFiles(e.dataTransfer.files); });

/* ---------------------------------------------------------------------
   Reviewer notes: private, persisted only via explicit JSON export/import.
   Each teacher/plan can accumulate multiple dated review entries.
--------------------------------------------------------------------- */
function reviewKeyFor(p){
  if(p.meta.employeeNumber) return "emp:" + String(p.meta.employeeNumber).trim();
  return (p.meta.teacherName||"").trim().toLowerCase() + "|" + (p.meta.createdAt||"");
}
function ensureReviewEntry(key){
  if(!reviewerNotes[key]) reviewerNotes[key] = { reviews:[], lastSeenUpdatedAt:"", privateNotes:"" };
  if(!Array.isArray(reviewerNotes[key].reviews)) reviewerNotes[key].reviews = [];
  return reviewerNotes[key];
}
function getReviewInfo(p){
  const key = reviewKeyFor(p);
  const entry = reviewerNotes[key];
  if(!entry || !entry.reviews || entry.reviews.length===0) return { status:"new", entry:entry||null, key };
  if(entry.lastSeenUpdatedAt && p.meta.updatedAt && p.meta.updatedAt > entry.lastSeenUpdatedAt) return { status:"updated", entry, key };
  return { status:"reviewed", entry, key };
}

document.getElementById("btnNotesImportTrigger").addEventListener("click", ()=>document.getElementById("notesImport").click());
document.getElementById("notesImport").addEventListener("change", e=>{
  const file = e.target.files[0];
  if(!file){ return; }
  const reader = new FileReader();
  reader.onload = () => {
    try{
      const data = JSON.parse(reader.result);
      if(data.type !== "notes-revision-perfectionnement" || typeof data.notes !== "object") throw new Error("format non reconnu");
      reviewerNotes = Object.assign({}, reviewerNotes, data.notes);
      renderAll();
      alert("Notes chargées.");
    }catch(err){ alert("Impossible de lire ce fichier comme des notes valides.\\n" + err.message); }
  };
  reader.readAsText(file);
  e.target.value = "";
});
document.getElementById("btnNotesExport").addEventListener("click", ()=>{
  const payload = { schemaVersion:"1.0", type:"notes-revision-perfectionnement", exportedAt:new Date().toISOString(), notes:reviewerNotes };
  const blob = new Blob([JSON.stringify(payload, null, 2)], {type:"application/json"});
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url; a.download = `notes-revision-perfectionnement_${new Date().toISOString().slice(0,10)}.json`;
  document.body.appendChild(a); a.click(); document.body.removeChild(a);
  URL.revokeObjectURL(url);
});

/* ---------------------------------------------------------------------
   Axes config loading (external, editable JSON; falls back to default)
--------------------------------------------------------------------- */
async function tryAutoLoadAxes(){
  try{
    const res = await fetch("axes.json", {cache:"no-store"});
    if(!res.ok) throw new Error("introuvable");
    const data = await res.json();
    if(!Array.isArray(data.axes) || data.axes.length===0) throw new Error("format invalide");
    AXES_CONFIG = data; axesSource = "auto";
  }catch(e){ axesSource = "defaut"; }
  updateAxesSourceNote();
  if(document.getElementById("tab-radar").style.display !== "none") renderRadarTab();
}
function updateAxesSourceNote(){
  const el = document.getElementById("axesSourceNote");
  if(!el) return;
  const labels = { auto:"Axes chargés automatiquement depuis axes.json.",
                    defaut:"Fichier non chargé automatiquement — axes par défaut utilisés.",
                    manuel:"Axes chargés manuellement." };
  el.textContent = labels[axesSource] || "";
}
document.getElementById("btnAxesLoadTrigger").addEventListener("click", ()=>document.getElementById("axesFileImport").click());
document.getElementById("axesFileImport").addEventListener("change", e=>{
  const file = e.target.files[0];
  if(!file) return;
  const reader = new FileReader();
  reader.onload = () => {
    try{
      const data = JSON.parse(reader.result);
      if(!Array.isArray(data.axes) || data.axes.length===0) throw new Error("format invalide");
      AXES_CONFIG = data; axesSource = "manuel";
      updateAxesSourceNote(); renderRadarTab();
    }catch(err){ alert("Impossible de lire ce fichier comme une configuration d'axes valide.\\n" + err.message); }
  };
  reader.readAsText(file);
  e.target.value = "";
});

/* ---------------------------------------------------------------------
   Tabs
--------------------------------------------------------------------- */
document.querySelectorAll(".tab-btn").forEach(btn=>{
  btn.addEventListener("click", ()=>{
    document.querySelectorAll(".tab-btn").forEach(b=>b.classList.remove("active"));
    btn.classList.add("active");
    document.getElementById("tab-list").style.display = btn.dataset.tab==="list" ? "block":"none";
    document.getElementById("tab-radar").style.display = btn.dataset.tab==="radar" ? "block":"none";
    document.getElementById("tab-stats").style.display = btn.dataset.tab==="stats" ? "block":"none";
    if(btn.dataset.tab==="stats") renderStats();
    if(btn.dataset.tab==="radar") renderRadarTab();
  });
});

function switchTab(name){
  document.querySelector(`.tab-btn[data-tab="${name}"]`).click();
}

/* ---------------------------------------------------------------------
   Plan status (expiry) + filters
--------------------------------------------------------------------- */
function thresholdDays(){ return Number(document.getElementById("thresholdDays").value) || 60; }

function getPlanStatus(p){
  if(!p.meta.planEndDate) return "unknown";
  const end = new Date(p.meta.planEndDate+"T00:00:00");
  const days = Math.floor((end - new Date())/86400000);
  if(days < 0) return "expired";
  if(days <= thresholdDays()) return "soon";
  return "ok";
}

function renderTableAndRadar(){ renderTable(); if(document.getElementById("tab-radar").style.display !== "none") renderRadarTab(); }
document.getElementById("searchBox").addEventListener("input", renderTableAndRadar);
document.getElementById("filterPlanStatus").addEventListener("change", renderTableAndRadar);
document.getElementById("filterReviewStatus").addEventListener("change", renderTableAndRadar);
document.getElementById("thresholdDays").addEventListener("input", renderTableAndRadar);
document.querySelectorAll("#planTable th").forEach(th=>{
  th.addEventListener("click", ()=>{
    const key = th.dataset.key;
    if(sortKey===key) sortDir *= -1; else { sortKey = key; sortDir = 1; }
    renderTable();
  });
});

function setPillFilter(kind, value){
  if(kind==="plan") document.getElementById("filterPlanStatus").value = value;
  if(kind==="review") document.getElementById("filterReviewStatus").value = value;
  renderTable();
}

/* ---------------------------------------------------------------------
   List / search / sort
--------------------------------------------------------------------- */
function planRowData(p){
  const rdCount = (p.activities||[]).filter(a=>a.proposedRD).length;
  const planStatus = getPlanStatus(p);
  const reviewInfo = getReviewInfo(p);
  return {
    teacherName: p.meta.teacherName || "(sans nom)",
    email: p.meta.email || "",
    employeeNumber: p.meta.employeeNumber || "",
    createdAt: p.meta.createdAt ? new Date(p.meta.createdAt) : null,
    planEndDate: p.meta.planEndDate ? new Date(p.meta.planEndDate+"T00:00:00") : null,
    planStatus, reviewStatus: reviewInfo.status,
    activityCount: (p.activities||[]).length,
    rdCount,
    sabbatical: !!(p.sabbatical && p.sabbatical.description && p.sabbatical.description.trim()),
  };
}

function searchableText(p){
  const parts = [p.meta.teacherName, p.meta.email, p.meta.employeeNumber, p.budgetPlanning && p.budgetPlanning.notes,
    p.sabbatical && p.sabbatical.description];
  (p.studentFeedbackHistory||[]).forEach(e=>parts.push(e.text));
  (p.activities||[]).forEach(a=>{ parts.push(a.title, a.notes, a.session); });
  (p.domainSkills||[]).forEach(sk=>{ parts.push(sk.name, sk.plan, sk.when, sk.newCoursesDetails); });
  return parts.filter(Boolean).join(" ").toLowerCase();
}

function badgeForPlanStatus(s){
  const cls = s==="expired"?"danger":s==="soon"?"warn":s==="unknown"?"muted":"";
  return `<span class="badge ${cls}">${PLAN_STATUS_LABELS[s]}</span>`;
}
function badgeForReviewStatus(s){
  const cls = s==="reviewed"?"":s==="updated"?"warn":"danger";
  return `<span class="badge ${cls}">${REVIEW_STATUS_LABELS[s]}</span>`;
}

function renderSummaryStrip(){
  const rows = plans.map(p => planRowData(p));
  const counts = { expired:0, soon:0, notReviewed:0 };
  rows.forEach(r=>{
    if(r.planStatus==="expired") counts.expired++;
    if(r.planStatus==="soon") counts.soon++;
    if(r.reviewStatus==="new" || r.reviewStatus==="updated") counts.notReviewed++;
  });
  const strip = document.getElementById("summaryStrip");
  strip.innerHTML = `
    <div class="summary-chip danger" id="chipExpired"><b>${counts.expired}</b>Plans expirés</div>
    <div class="summary-chip warn" id="chipSoon"><b>${counts.soon}</b>Bientôt à réviser</div>
    <div class="summary-chip" id="chipUnreviewed"><b>${counts.notReviewed}</b>Non revus (nouveaux ou mis à jour)</div>
    <div class="summary-chip" id="chipAll"><b>${plans.length}</b>Total des plans chargés</div>
  `;
  document.getElementById("chipExpired").addEventListener("click", ()=>setPillFilter("plan","expired"));
  document.getElementById("chipSoon").addEventListener("click", ()=>setPillFilter("plan","soon"));
  document.getElementById("chipUnreviewed").addEventListener("click", ()=>setPillFilter("review","new"));
  document.getElementById("chipAll").addEventListener("click", ()=>{ setPillFilter("plan","all"); setPillFilter("review","all"); });
}

function getFilteredPlans(){
  const q = document.getElementById("searchBox").value.trim().toLowerCase();
  const planFilter = document.getElementById("filterPlanStatus").value;
  const reviewFilter = document.getElementById("filterReviewStatus").value;
  let rows = plans.map(p => ({p, row: planRowData(p), text: searchableText(p)}));
  if(q) rows = rows.filter(r => r.text.includes(q));
  if(planFilter !== "all") rows = rows.filter(r => r.row.planStatus === planFilter);
  if(reviewFilter !== "all") rows = rows.filter(r => r.row.reviewStatus === reviewFilter);
  return rows;
}

function renderTable(){
  renderSummaryStrip();
  let rows = getFilteredPlans();

  rows.sort((a,b)=>{
    let va = a.row[sortKey], vb = b.row[sortKey];
    if(va instanceof Date || vb instanceof Date){ va = va?va.getTime():0; vb = vb?vb.getTime():0; }
    if(typeof va === "string") va = va.toLowerCase();
    if(typeof vb === "string") vb = vb.toLowerCase();
    if(va < vb) return -1*sortDir; if(va > vb) return 1*sortDir; return 0;
  });

  document.querySelectorAll("#planTable th").forEach(th=>th.classList.toggle("sorted", th.dataset.key===sortKey));

  const tbody = document.getElementById("planRows");
  tbody.innerHTML = "";
  if(rows.length===0){
    tbody.innerHTML = `<tr><td colspan="10" class="empty-note">Aucun plan chargé, ou aucun résultat pour ces filtres.</td></tr>`;
    return;
  }
  rows.forEach(({p,row})=>{
    const tr = document.createElement("tr");
    tr.className = "rowlink";
    tr.innerHTML = `
      <td>${escapeHtml(row.teacherName)}</td>
      <td>${escapeHtml(row.email)}</td>
      <td>${escapeHtml(row.employeeNumber)}</td>
      <td>${fmtShort(row.createdAt)}</td>
      <td>${fmtShort(row.planEndDate)}</td>
      <td>${badgeForPlanStatus(row.planStatus)}</td>
      <td>${badgeForReviewStatus(row.reviewStatus)}</td>
      <td>${row.activityCount}</td>
      <td>${row.rdCount>0 ? `<span class="badge warn">${row.rdCount}</span>` : "0"}</td>
      <td>${row.sabbatical ? `<span class="badge">Oui</span>` : "—"}</td>
    `;
    tr.addEventListener("click", ()=>openDetail(p));
    tbody.appendChild(tr);
  });
}

/* ---------------------------------------------------------------------
   Detail panel
--------------------------------------------------------------------- */
function openDetail(p){
  const c = document.getElementById("detailContent");
  const domainLabel = id => {
    const ax = AXES_CONFIG.axes.find(x=>x.id===id);
    return ax ? ax.label : id;
  };
  const reviewInfo = getReviewInfo(p);
  const key = reviewInfo.key;
  const entry = ensureReviewEntry(key); // safe to create now; only persisted if exported

  let html = `<h3>${escapeHtml(p.meta.teacherName || "(sans nom)")}</h3>`;
  html += `<div style="margin-bottom:12px;">${badgeForPlanStatus(getPlanStatus(p))} ${badgeForReviewStatus(reviewInfo.status)}</div>`;
  html += `<div class="kv"><b>Courriel institutionnel</b><span>${escapeHtml(p.meta.email||"—")}</span></div>`;
  html += `<div class="kv"><b>N° employé</b><span>${escapeHtml(p.meta.employeeNumber||"—")}</span></div>`;
  html += `<div class="kv"><b>Créé le</b><span>${fmtDateTime(p.meta.createdAt)}</span></div>`;
  html += `<div class="kv"><b>Fin visée</b><span>${p.meta.planEndDate||"—"}</span></div>`;
  html += `<div class="kv"><b>Dernière modif.</b><span>${fmtDateTime(p.meta.updatedAt)}</span></div>`;

  // --- private review box: dated review log + ongoing private notes ---
  html += `<div class="review-box">
    <label style="font-size:12px;color:var(--muted);font-weight:600;">Historique des revues avec cette personne</label>
    <div id="rv-history" style="margin:6px 0 10px;">${renderReviewHistory(entry)}</div>
    <div class="row" style="align-items:flex-end;">
      <div style="flex:1;">
        <label style="font-size:11.5px;color:var(--muted);">Date de la revue</label>
        <input type="date" id="rv-new-date" value="${new Date().toISOString().slice(0,10)}" style="width:100%;padding:6px 8px;border:1px solid var(--border);border-radius:6px;">
      </div>
    </div>
    <label style="font-size:11.5px;color:var(--muted);margin-top:8px;display:block;">Note sur cette revue (optionnel)</label>
    <textarea id="rv-new-note" style="min-height:50px;" placeholder="Ex. ce qui a été discuté..."></textarea>
    <button class="small" id="btnAddReview" style="margin-top:8px;">+ Enregistrer cette revue</button>

    <div style="border-top:1px solid var(--border); margin-top:14px; padding-top:10px;">
      <label style="font-size:12px;color:var(--muted);font-weight:600;">Notes privées générales (non partagées avec la personne enseignante)</label>
      <textarea id="rv-notes" placeholder="Ex. points à surveiller au fil du temps...">${escapeHtml(entry.privateNotes||"")}</textarea>
    </div>
    <div class="private-note">Ces notes restent uniquement dans votre session, à moins que vous ne les exportiez via « Exporter mes notes ».</div>
  </div>`;

  if((p.studentFeedbackHistory||[]).length){
    html += `<div class="detail-section"><h4>Appréciation étudiante — historique</h4>`;
    [...p.studentFeedbackHistory].reverse().forEach(e=>{
      html += `<div style="margin-bottom:8px;"><div style="font-size:11.5px;color:var(--muted);">${fmtDateTime(e.addedAt)}</div><p style="font-size:13px;margin:2px 0 0;white-space:pre-wrap;">${escapeHtml(e.text)}</p></div>`;
    });
    html += `</div>`;
  }

  if((p.domainSkills||[]).length){
    const SKILL_KIND_LABELS = { nouvelle:"Nouvelle compétence", maintien:"Maintien / actualisation" };
    html += `<div class="detail-section"><h4>Compétences disciplinaires (${p.domainSkills.length})</h4>`;
    p.domainSkills.forEach(sk=>{
      html += `<div style="margin-bottom:10px;padding-bottom:8px;border-bottom:1px dashed var(--border);">
        <b>${escapeHtml(sk.name||"(sans nom)")}</b> <span class="tag">${SKILL_KIND_LABELS[sk.kind]||sk.kind}</span>
        ${sk.newCourses ? `<span class="tag badge">Nouveaux cours envisagés${sk.newCoursesDetails ? " — "+escapeHtml(sk.newCoursesDetails) : ""}</span>` : ""}
        ${sk.when ? `<div style="font-size:12.5px;color:var(--muted);margin-top:2px;">Quand : ${escapeHtml(sk.when)}</div>` : ""}
        ${sk.plan ? `<div style="font-size:12.5px;color:var(--muted);margin-top:2px;">Comment : ${escapeHtml(sk.plan)}</div>` : ""}
      </div>`;
    });
    html += `</div>`;
  }

  html += `<div class="detail-section"><h4>Activités (${(p.activities||[]).length})</h4>`;
  (p.activities||[]).forEach(a=>{
    let rdTag = "";
    if(a.proposedRD){
      const stLabel = RD_STATUS_LABELS[a.rdApprovalStatus||"en_attente"];
      const stCls = a.rdApprovalStatus==="approuvee" ? "" : a.rdApprovalStatus==="refusee" ? "danger" : "warn";
      rdTag = `<span class="tag badge ${stCls}" style="display:inline;">R&D — ${stLabel}${a.rdApprovedBy?" ("+escapeHtml(a.rdApprovedBy)+(a.rdApprovalDate?", "+a.rdApprovalDate:"")+")":""}</span>`;
    }
    html += `<div style="margin-bottom:10px;padding-bottom:8px;border-bottom:1px dashed var(--border);">
      <b>${escapeHtml(a.title||"(sans titre)")}</b> ${rdTag}<br>
      <span style="font-size:12.5px;color:var(--muted);">${CATEGORY_LABELS[a.category]||a.category} · ${FORMAT_LABELS[a.format]||a.format} · ${STATUS_LABELS[a.status]||a.status}${a.session?" · "+escapeHtml(a.session):""}${a.estimatedCost?" · "+Number(a.estimatedCost).toLocaleString("fr-CA")+" $":""}</span>
      ${(a.domains||[]).length ? `<div>${a.domains.map(id=>`<span class="tag">${escapeHtml(domainLabel(id))}</span>`).join("")}</div>` : ""}
    </div>`;
  });
  if((p.activities||[]).length===0) html += `<p class="empty-note">Aucune activité.</p>`;
  html += `</div>`;

  if(p.sabbatical && p.sabbatical.description && p.sabbatical.description.trim()){
    html += `<div class="detail-section"><h4>Congé sans solde envisagé</h4>
      <p style="font-size:13px;white-space:pre-wrap;">${escapeHtml(p.sabbatical.description)}</p>
    </div>`;
  }

  if(p.budgetPlanning && p.budgetPlanning.notes){
    html += `<div class="detail-section"><h4>Notes de planification budgétaire</h4><p style="font-size:13px;">${escapeHtml(p.budgetPlanning.notes)}</p></div>`;
  }

  const hasRadar = p.qualityRadar && Array.isArray(p.qualityRadar.entries) && p.qualityRadar.entries.some(e=>e.current!==null && e.current!==undefined);
  if(hasRadar){
    html += `<button class="small" id="btnGoToRadar" style="margin-top:4px;">Voir le radar qualité de cette personne</button>`;
  }

  c.innerHTML = html;
  document.getElementById("detailPanel").classList.add("open");
  document.getElementById("overlay").classList.add("show");

  if(hasRadar){
    document.getElementById("btnGoToRadar").addEventListener("click", ()=>{
      closeDetail();
      switchTab("radar");
      setTimeout(()=>{
        const sel = document.getElementById("radarTeacherSelect");
        if(Array.from(sel.options).some(o=>o.value===(p.meta.teacherName||""))){
          sel.value = p.meta.teacherName||""; renderRadarTab();
        }
      }, 0);
    });
  }

  // bind review controls
  document.getElementById("btnAddReview").addEventListener("click", ()=>{
    const dateVal = document.getElementById("rv-new-date").value;
    if(!dateVal) return;
    const noteVal = document.getElementById("rv-new-note").value;
    const ent = ensureReviewEntry(key);
    ent.reviews.push({ date: dateVal, note: noteVal, enteredAt: new Date().toISOString() });
    ent.lastSeenUpdatedAt = p.meta.updatedAt || new Date().toISOString();
    renderTable();
    openDetail(p); // refresh panel to show the updated history/badges
  });
  document.getElementById("rv-notes").addEventListener("input", e=>{
    ensureReviewEntry(key).privateNotes = e.target.value;
  });
}

function renderReviewHistory(entry){
  if(!entry.reviews || entry.reviews.length===0) return `<div class="empty-note" style="padding:4px 0;">Aucune revue enregistrée.</div>`;
  return [...entry.reviews].sort((a,b)=> a.date < b.date ? 1 : -1).map(r=>
    `<div style="font-size:13px;margin-bottom:6px;"><b>${r.date}</b>${r.note ? " — "+escapeHtml(r.note) : ""}</div>`
  ).join("");
}

document.getElementById("btnCloseDetail").addEventListener("click", closeDetail);
document.getElementById("overlay").addEventListener("click", closeDetail);
function closeDetail(){ document.getElementById("detailPanel").classList.remove("open"); document.getElementById("overlay").classList.remove("show"); }

/* ---------------------------------------------------------------------
   Radar qualité — cohort percentile bands + individual overlay
--------------------------------------------------------------------- */
function percentile(sortedArr, p){
  if(sortedArr.length===0) return null;
  if(sortedArr.length===1) return sortedArr[0];
  const idx = (sortedArr.length-1)*p;
  const lo = Math.floor(idx), hi = Math.ceil(idx);
  if(lo===hi) return sortedArr[lo];
  return sortedArr[lo] + (sortedArr[hi]-sortedArr[lo])*(idx-lo);
}

function radarPoint(cx, cy, R, angle, value, scaleMin, scaleMax){
  const frac = scaleMax>scaleMin ? Math.max(0, Math.min(1, (value-scaleMin)/(scaleMax-scaleMin))) : 0;
  const r = frac * R;
  return { x: cx + r*Math.cos(angle), y: cy + r*Math.sin(angle) };
}
function ptsStr(pts){ return pts.map(p=>p.x.toFixed(1)+","+p.y.toFixed(1)).join(" "); }

let _measureCtx = null;
function textWidth(str, fontPx){
  if(!_measureCtx){ _measureCtx = document.createElement("canvas").getContext("2d"); }
  _measureCtx.font = fontPx + "px Segoe UI, -apple-system, system-ui, sans-serif";
  return _measureCtx.measureText(str).width;
}

function maxRadiusForLabel(cx, cy, angle, w, h, gap, size){
  const cosA = Math.cos(angle), sinA = Math.sin(angle);
  const anchor = cosA > 0.3 ? "start" : cosA < -0.3 ? "end" : "middle";
  let lo = 0, hi = size;
  for(let iter=0; iter<25; iter++){
    const mid = (lo+hi)/2;
    const px = cx + (mid+gap)*cosA;
    const py = cy + (mid+gap)*sinA;
    let left, right;
    if(anchor==="start"){ left=px; right=px+w; }
    else if(anchor==="end"){ left=px-w; right=px; }
    else { left=px-w/2; right=px+w/2; }
    const top = py - h/2, bottom = py + h/2;
    const fits = left>=0 && right<=size && top>=0 && bottom<=size;
    if(fits){ lo = mid; } else { hi = mid; }
  }
  return lo;
}

function buildRadarSVG(axesList, scaleMin, scaleMax, bands, lines, opts){
  opts = opts || {};
  const size = opts.size || 560;
  const cx = size/2, cy = size/2;
  const n = axesList.length;
  if(n < 3) return `<text x="20" y="30" font-size="13" fill="#5B6472">Au moins 3 axes sont requis.</text>`;
  const angleFor = i => -Math.PI/2 + i*(2*Math.PI/n);
  const fontSize = 11.5;
  const labelGap = 20;

  let R = opts.radius;
  if(R === undefined){
    R = size/2;
    axesList.forEach((ax,i)=>{
      const angle = angleFor(i);
      const w = textWidth(ax.label||"", fontSize);
      const h = fontSize * 1.3;
      R = Math.min(R, maxRadiusForLabel(cx, cy, angle, w, h, labelGap, size));
    });
    R = Math.max(R, size*0.08);
  }

  const els = [];

  bands.forEach(band=>{
    const pts = axesList.map((ax,i)=>{
      const v = band.values[i]; const val = (v===null||v===undefined) ? scaleMin : v;
      return radarPoint(cx,cy,R,angleFor(i),val,scaleMin,scaleMax);
    });
    els.push(`<polygon points="${ptsStr(pts)}" fill="${band.fill}" stroke="${band.stroke||band.fill}" stroke-width="1"/>`);
  });

  lines.forEach(line=>{
    const pts = axesList.map((ax,i)=>{
      const v = line.values[i]; const val = (v===null||v===undefined) ? scaleMin : v;
      return radarPoint(cx,cy,R,angleFor(i),val,scaleMin,scaleMax);
    });
    const dash = line.dash ? `stroke-dasharray="${line.dash}"` : "";
    els.push(`<polygon points="${ptsStr(pts)}" fill="none" stroke="${line.stroke}" stroke-width="${line.width||4}" ${dash}/>`);
    pts.forEach(p=>{ els.push(`<circle cx="${p.x.toFixed(1)}" cy="${p.y.toFixed(1)}" r="4" fill="${line.pointFill||line.stroke}" stroke="${line.stroke}" stroke-width="1.5"/>`); });
  });

  const ringCount = 4;
  for(let ring=1; ring<=ringCount; ring++){
    const val = scaleMin + (scaleMax-scaleMin)*(ring/ringCount);
    const pts = axesList.map((ax,i)=>radarPoint(cx,cy,R,angleFor(i),val,scaleMin,scaleMax));
    els.push(`<polygon points="${ptsStr(pts)}" fill="none" stroke="rgba(20,20,20,0.55)" stroke-width="1.75"/>`);
  }
  for(let i=0;i<n;i++){
    const p = radarPoint(cx,cy,R,angleFor(i),scaleMax,scaleMin,scaleMax);
    els.push(`<line x1="${cx}" y1="${cy}" x2="${p.x.toFixed(1)}" y2="${p.y.toFixed(1)}" stroke="rgba(20,20,20,0.55)" stroke-width="1.75"/>`);
  }

  axesList.forEach((ax,i)=>{
    const angle = angleFor(i);
    const p = radarPoint(cx,cy,R+labelGap,angle,scaleMax,scaleMin,scaleMax);
    const cosA = Math.cos(angle);
    const anchor = cosA > 0.3 ? "start" : cosA < -0.3 ? "end" : "middle";
    els.push(`<text x="${p.x.toFixed(1)}" y="${p.y.toFixed(1)}" font-size="${fontSize}" fill="#3a3a38" text-anchor="${anchor}" dominant-baseline="middle">${escapeHtml(ax.label)}</text>`);
  });

  return `<g>${els.join("")}</g>`;
}

document.getElementById("radarMinN").addEventListener("input", renderRadarTab);
document.getElementById("radarTeacherSelect").addEventListener("change", renderRadarTab);

function renderRadarTab(){
  const svg = document.getElementById("radarChartSvg");
  const guard = document.getElementById("radarGuardMessage");
  const axes = AXES_CONFIG.axes;
  const smin = AXES_CONFIG.scaleMin, smax = AXES_CONFIG.scaleMax;
  const filtered = getFilteredPlans().map(r=>r.p);
  const withRadar = filtered.filter(p => p.qualityRadar && Array.isArray(p.qualityRadar.entries) && p.qualityRadar.entries.some(e=>e.current!==null && e.current!==undefined));

  const select = document.getElementById("radarTeacherSelect");
  const prevSelection = select.value;
  select.innerHTML = `<option value="">Aucun</option>` + withRadar.map(p=>`<option value="${escapeHtml(p.meta.teacherName||"")}">${escapeHtml(p.meta.teacherName||"(sans nom)")}</option>`).join("");
  if(withRadar.some(p=>p.meta.teacherName===prevSelection)) select.value = prevSelection;

  const minN = Number(document.getElementById("radarMinN").value) || 1;
  if(withRadar.length < minN){
    guard.style.display = "block";
    guard.textContent = `Pas assez de plans avec auto-position pour préserver l'anonymat (minimum ${minN}; ${withRadar.length} disponible${withRadar.length===1?"":"s"} selon le filtre courant).`;
    svg.innerHTML = "";
    document.getElementById("radarLegend").innerHTML = "";
    document.getElementById("radarTeacherNotes").innerHTML = "";
    return;
  }
  guard.style.display = "none";

  const perAxisValues = axes.map(ax=>{
    const vals = withRadar.map(p=>{
      const en = p.qualityRadar.entries.find(e=>e.axisId===ax.id);
      return (en && en.current!==null && en.current!==undefined) ? Number(en.current) : null;
    }).filter(v=>v!==null).sort((a,b)=>a-b);
    return vals;
  });

  const bandDefs = [
    {key:"max", p:1.0, fill:"#3B8C22", stroke:"#2E6D1A"},
    {key:"q3", p:0.75, fill:"#97C459", stroke:"#7CA845"},
    {key:"median", p:0.5, fill:"#F4C430", stroke:"#D9AC1E"},
    {key:"q1", p:0.25, fill:"#EF9F27", stroke:"#D6871A"},
    {key:"min", p:0.0, fill:"#E24B4A", stroke:"#C93534"},
  ];
  const bands = bandDefs.map(bd=>({
    fill:bd.fill, stroke:bd.stroke,
    values: perAxisValues.map(vals => vals.length ? percentile(vals, bd.p) : null)
  }));

  const lines = [];
  const selectedName = select.value;
  let selectedPlan = null;
  if(selectedName){
    selectedPlan = withRadar.find(p=>p.meta.teacherName===selectedName);
    if(selectedPlan){
      const curVals = axes.map(ax=>{ const en = selectedPlan.qualityRadar.entries.find(e=>e.axisId===ax.id); return en && en.current!==null && en.current!==undefined ? Number(en.current) : null; });
      const goalVals = axes.map(ax=>{ const en = selectedPlan.qualityRadar.entries.find(e=>e.axisId===ax.id); return en && en.goal!==null && en.goal!==undefined ? Number(en.goal) : null; });
      lines.push({ values:curVals, stroke:"#14181F", width:4 });
      lines.push({ values:goalVals, stroke:"#14181F", width:4, dash:"6,4", pointFill:"#FAF9F6" });
    }
  }

  svg.innerHTML = buildRadarSVG(axes, smin, smax, bands, lines, {size:560});

  document.getElementById("radarLegend").innerHTML = `
    <span><i style="background:#E24B4A;"></i>Minimum</span>
    <span><i style="background:#EF9F27;"></i>Q1</span>
    <span><i style="background:#F4C430;"></i>Médiane</span>
    <span><i style="background:#97C459;"></i>Q3</span>
    <span><i style="background:#3B8C22;"></i>Maximum</span>
    ${selectedPlan ? `<span><svg width="18" height="10"><line x1="0" y1="5" x2="18" y2="5" stroke="#14181F" stroke-width="3"/></svg>Position actuelle</span>
    <span><svg width="18" height="10"><line x1="0" y1="5" x2="18" y2="5" stroke="#14181F" stroke-width="3" stroke-dasharray="4,3"/></svg>Objectif</span>` : ""}
  `;

  const notesEl = document.getElementById("radarTeacherNotes");
  if(!selectedPlan){ notesEl.innerHTML = ""; return; }
  let notesHtml = `<h3 style="font-size:14px; margin:0 0 10px;">Notes écrites — ${escapeHtml(selectedPlan.meta.teacherName||"")}</h3>`;
  let any = false;
  axes.forEach(ax=>{
    const en = selectedPlan.qualityRadar.entries.find(e=>e.axisId===ax.id);
    if(!en || (!en.noteCurrent && !en.noteGoal)) return;
    any = true;
    notesHtml += `<div style="margin-bottom:10px;"><b style="font-size:13px;">${escapeHtml(ax.label)}</b>`;
    if(en.noteCurrent) notesHtml += `<div style="font-size:12.5px;color:var(--muted);">État actuel : ${escapeHtml(en.noteCurrent)}</div>`;
    if(en.noteGoal) notesHtml += `<div style="font-size:12.5px;color:var(--muted);">Amélioration prévue : ${escapeHtml(en.noteGoal)}</div>`;
    notesHtml += `</div>`;
  });
  if(selectedPlan.qualityRadar.targetDate) notesHtml += `<div style="font-size:12.5px;color:var(--muted);margin-top:6px;">Échéance visée : ${selectedPlan.qualityRadar.targetDate}</div>`;
  notesEl.innerHTML = any || selectedPlan.qualityRadar.targetDate ? notesHtml : "";
}


function renderBarChart(containerId, countsMap, labelMap, opts={}){
  const el = document.getElementById(containerId);
  const entries = Object.entries(countsMap).sort((a,b)=>b[1]-a[1]);
  if(entries.length===0){ el.innerHTML = `<div class="empty-note">Aucune donnée.</div>`; return; }
  const max = entries[0][1];
  el.innerHTML = entries.map(([k,v])=>{
    const label = (labelMap && labelMap[k]) || k;
    const pct = Math.round((v/max)*100);
    return `<div class="bar-row ${opts.warn?'warn':''}">
      <div>${escapeHtml(label)}</div>
      <div class="track"><div class="fill" style="width:${pct}%"></div></div>
      <div class="count">${v}</div>
    </div>`;
  }).join("");
}

function renderStats(){
  const categoryCounts = {}, formatCounts = {}, rdCounts = {};
  let rdApproved = 0, rdTotal = 0, sabbaticalCount = 0;
  const sabbaticalEntries = [];
  const skillEntries = [];

  plans.forEach(p=>{
    (p.activities||[]).forEach(a=>{
      if(a.category) categoryCounts[a.category] = (categoryCounts[a.category]||0)+1;
      if(a.format) formatCounts[a.format] = (formatCounts[a.format]||0)+1;
      if(a.proposedRD){
        rdTotal++;
        if(a.rdApprovalStatus === "approuvee") rdApproved++;
        if(a.rdCategory) rdCounts[a.rdCategory] = (rdCounts[a.rdCategory]||0)+1;
      }
    });
    if(p.sabbatical && p.sabbatical.description && p.sabbatical.description.trim()){
      sabbaticalCount++;
      sabbaticalEntries.push({name:p.meta.teacherName||"(sans nom)", description:p.sabbatical.description});
    }
    (p.domainSkills||[]).forEach(sk=>{
      if(!sk.name) return;
      skillEntries.push({
        name:p.meta.teacherName||"(sans nom)",
        skill:sk.name,
        kind: sk.kind==="maintien" ? "Maintien / actualisation" : "Nouvelle compétence",
        when: sk.when||"—",
        newCourses: sk.newCourses ? "Oui" : "—"
      });
    });
  });

  document.getElementById("summaryCards").innerHTML = `
    <div class="summary-card"><div class="num">${plans.length}</div><div class="lbl">Plans chargés</div></div>
    <div class="summary-card"><div class="num">${plans.reduce((s,p)=>s+(p.activities||[]).length,0)}</div><div class="lbl">Activités planifiées</div></div>
    <div class="summary-card"><div class="num">${rdTotal}</div><div class="lbl">Activités proposées en R&D (${rdApproved} approuvées)</div></div>
    <div class="summary-card"><div class="num">${sabbaticalCount}</div><div class="lbl">Congés sans solde envisagés</div></div>
  `;

  renderBarChart("chartCategory", categoryCounts, CATEGORY_LABELS);
  renderBarChart("chartFormat", formatCounts, FORMAT_LABELS);
  renderBarChart("chartRD", rdCounts, RD_LABELS, {warn:true});

  const skillList = document.getElementById("skillList");
  if(skillList){
    if(skillEntries.length===0){ skillList.innerHTML = `<div class="empty-note">Aucune compétence disciplinaire signalée.</div>`; }
    else{
      skillList.innerHTML = "<table class='data'><thead><tr><th>Personne</th><th>Compétence</th><th>Type</th><th>Quand</th><th>Nouveaux cours</th></tr></thead><tbody>" +
        skillEntries.map(e=>`<tr><td>${escapeHtml(e.name)}</td><td>${escapeHtml(e.skill)}</td><td>${escapeHtml(e.kind)}</td><td>${escapeHtml(e.when)}</td><td>${escapeHtml(e.newCourses)}</td></tr>`).join("") +
        "</tbody></table>";
    }
  }

  const leaveList = document.getElementById("leaveList");
  if(sabbaticalEntries.length===0){ leaveList.innerHTML = `<div class="empty-note">Aucun congé envisagé signalé.</div>`; }
  else{
    leaveList.innerHTML = "<table class='data'><thead><tr><th>Personne</th><th>Description</th></tr></thead><tbody>" +
      sabbaticalEntries.map(e=>`<tr><td>${escapeHtml(e.name)}</td><td>${escapeHtml(e.description)}</td></tr>`).join("") +
      "</tbody></table>";
  }
}

document.getElementById("btnExportCsv").addEventListener("click", ()=>{
  const lines = [["categorie","cle","valeur"].join(",")];
  function dump(map, cat){ Object.entries(map).forEach(([k,v])=>lines.push([cat, csvEsc(k), v].join(","))); }
  const categoryCounts={}, formatCounts={}, rdCounts={};
  plans.forEach(p=>{
    (p.activities||[]).forEach(a=>{
      if(a.category) categoryCounts[a.category]=(categoryCounts[a.category]||0)+1;
      if(a.format) formatCounts[a.format]=(formatCounts[a.format]||0)+1;
      if(a.proposedRD && a.rdCategory) rdCounts[a.rdCategory]=(rdCounts[a.rdCategory]||0)+1;
    });
  });
  dump(categoryCounts,"categorie_activite");
  dump(formatCounts,"format_activite");
  dump(rdCounts,"categorie_rd");
  const blob = new Blob([lines.join("\n")], {type:"text/csv"});
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url; a.download = `statistiques_perfectionnement_${new Date().toISOString().slice(0,10)}.csv`;
  document.body.appendChild(a); a.click(); document.body.removeChild(a);
  URL.revokeObjectURL(url);
});

function csvEsc(s){ s=String(s); return /[",\n]/.test(s) ? '"'+s.replace(/"/g,'""')+'"' : s; }
function escapeHtml(s){ return (s||"").toString().replace(/[&<>"']/g, c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c])); }

function renderAll(){
  renderTable();
  if(document.getElementById("tab-stats").style.display!=="none") renderStats();
  if(document.getElementById("tab-radar").style.display!=="none") renderRadarTab();
}
renderAll();
tryAutoLoadAxes();
