/* ---------------------------------------------------------------------
   Constants & taxonomy
--------------------------------------------------------------------- */
const SCHEMA_VERSION = "2.0";

const CATEGORY_OPTIONS = [
  {v:"formation_individuelle", l:"Formation individuelle (courte durée)"},
  {v:"perfectionnement_individuel", l:"Perfectionnement individuel (scolarité créditée)"},
  {v:"recyclage", l:"Recyclage"},
  {v:"autre", l:"Autre"},
];

const FORMAT_OPTIONS = [
  {v:"seminaire", l:"Séminaire"},
  {v:"colloque", l:"Colloque"},
  {v:"congres", l:"Congrès"},
  {v:"conference", l:"Conférence"},
  {v:"stage", l:"Stage en milieu industriel"},
  {v:"cours_non_credite", l:"Cours non crédité"},
  {v:"cours_credite", l:"Cours crédité"},
  {v:"atelier", l:"Atelier"},
  {v:"mentorat", l:"Mentorat / formation entre pairs"},
  {v:"autre", l:"Autre"},
];

const RD_CATEGORY_OPTIONS = [
  {v:"a", l:"a) Matériel didactique, plans de cours communs"},
  {v:"b", l:"b) Intervention sur les programmes"},
  {v:"c", l:"c) Activités promotionnelles"},
  {v:"d", l:"d) Plan de réussite"},
  {v:"e", l:"e) Participation à un comité"},
  {v:"f", l:"f) Assistance professionnelle (mentorat, formation entre pairs)"},
  {v:"g", l:"g) Perfectionnement pédagogique (stages, colloques, ateliers)"},
  {v:"h", l:"h) Séance de perfectionnement disciplinaire (personne chargée de cours)"},
];

const RD_STATUS_OPTIONS = [
  {v:"en_attente", l:"En attente d'approbation"},
  {v:"approuvee", l:"Approuvée"},
  {v:"refusee", l:"Refusée"},
];

const STATUS_OPTIONS = [
  {v:"planned", l:"Planifiée"},
  {v:"in_progress", l:"En cours"},
  {v:"completed", l:"Complétée"},
  {v:"not_pursued", l:"Non réalisée"},
];

/* ---------------------------------------------------------------------
   Quality-of-instruction axes: loaded from an external, editable JSON
   file (axes.json), co-hosted alongside this tool.
   Falls back to this built-in default if the fetch fails for any reason.
--------------------------------------------------------------------- */
const DEFAULT_AXES_CONFIG = {
  schemaVersion:"1.0", scaleMin:1, scaleMax:5,
  scaleLabels:["Faible","Fragile","Correct","Bon","Excellent"],
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

function scaleLabelFor(value){
  const labels = AXES_CONFIG.scaleLabels;
  if(!Array.isArray(labels) || labels.length===0) return String(value);
  const idx = Math.round(value) - AXES_CONFIG.scaleMin;
  return labels[Math.max(0, Math.min(labels.length-1, idx))] || String(value);
}

/* ---------------------------------------------------------------------
   State
--------------------------------------------------------------------- */
function toISODate(d){ return d.toISOString().slice(0,10); }

function blankState(){
  const now = new Date();
  return {
    schemaVersion: SCHEMA_VERSION,
    meta:{ teacherName:"", email:"", employeeNumber:"",
           createdAt:now.toISOString(), updatedAt:now.toISOString(),
           planEndDate: toISODate(addYears(now,2)) },
    qualityRadar:{ targetDate:"", axesSnapshot:[], entries:[] },
    studentFeedbackHistory: [],
    domainSkills: [],
    activities: [],
    budgetPlanning:{ notes:"" },
    // schema note: activity R&D approval fields are rdApprovalStatus ("en_attente"|"approuvee"|"refusee"),
    // rdApprovedBy (free text: name/role at Direction des études), rdApprovalDate (date the decision was made).
    sabbatical:{ description:"" }
  };
}

let state = blankState();

function uid(prefix){ return prefix + "-" + Math.random().toString(36).slice(2,9); }
function touch(){ state.meta.updatedAt = new Date().toISOString(); }

/* ---------------------------------------------------------------------
   Rendering: Meta
--------------------------------------------------------------------- */
function bindMeta(){
  const map = [["m-name","teacherName"],["m-email","email"],["m-employee","employeeNumber"]];
  map.forEach(([elId,key])=>{
    document.getElementById(elId).value = state.meta[key] || "";
    document.getElementById(elId).addEventListener("input", e=>{
      state.meta[key] = e.target.value; touch(); renderTimeline(); renderPortrait();
    });
  });
  document.getElementById("m-created-display").textContent = fmtDateTimeShort(state.meta.createdAt);
  document.getElementById("m-updated-display").textContent = fmtDateTimeShort(state.meta.updatedAt);
  refreshPlanEndDateBounds();
}

function fmtDateTimeShort(iso){
  if(!iso) return "—";
  const d = new Date(iso);
  if(isNaN(d)) return "—";
  return d.toLocaleDateString("fr-CA", {year:"numeric", month:"short", day:"numeric"});
}

function refreshPlanEndDateBounds(){
  const input = document.getElementById("m-end-date");
  const created = state.meta.createdAt ? new Date(state.meta.createdAt) : new Date();
  const maxDate = addYears(new Date(), 2);
  input.min = toISODate(created);
  input.max = toISODate(maxDate);
  input.value = state.meta.planEndDate || toISODate(addYears(created,2));
}

document.getElementById("m-end-date").addEventListener("change", e=>{
  const input = e.target;
  let val = input.value;
  if(val < input.min) val = input.min;
  if(val > input.max) val = input.max;
  input.value = val;
  state.meta.planEndDate = val;
  touch(); renderTimeline();
});

/* ---------------------------------------------------------------------
   Appréciation étudiante — versioned, append-only history
--------------------------------------------------------------------- */
function renderAppreciationHistory(){
  const wrap = document.getElementById("apprHistory");
  wrap.innerHTML = "";
  if(state.studentFeedbackHistory.length===0){
    wrap.innerHTML = `<div class="empty-note">Aucune entrée pour le moment.</div>`;
    return;
  }
  [...state.studentFeedbackHistory].reverse().forEach(entry=>{
    const div = document.createElement("div");
    div.className = "activity-card";
    div.innerHTML = `
      <div style="font-size:11.5px; color:var(--muted); margin-bottom:6px;">${fmtDateTimeShort(entry.addedAt)}</div>
      <div style="font-size:13.5px; white-space:pre-wrap;">${escapeHtml(entry.text)}</div>
    `;
    wrap.appendChild(div);
  });
}

document.getElementById("btnAddApprEntry").addEventListener("click", ()=>{
  const ta = document.getElementById("appr-new-entry");
  const text = ta.value.trim();
  if(!text) return;
  state.studentFeedbackHistory.push({ id:uid("appr"), addedAt:new Date().toISOString(), text });
  ta.value = "";
  touch();
  renderAppreciationHistory();
  renderTimeline();
});

/* ---------------------------------------------------------------------
   Axes config loading: fetched from the co-hosted JSON file. No manual
   override here — the axes are centrally maintained alongside the tool.
--------------------------------------------------------------------- */
async function tryAutoLoadAxes(){
  try{
    const res = await fetch("axes.json", {cache:"no-store"});
    if(!res.ok) throw new Error("introuvable");
    const data = await res.json();
    if(!Array.isArray(data.axes) || data.axes.length===0) throw new Error("format invalide");
    AXES_CONFIG = data; axesSource = "auto";
  }catch(e){ axesSource = "defaut"; }
  reconcileRadarEntries(); updateAxesSourceNote(); renderQualityRadar();
}
function updateAxesSourceNote(){
  const el = document.getElementById("axesSourceNote");
  if(!el) return;
  const labels = { auto:"", defaut:"Axes par défaut utilisés (fichier de configuration non disponible)." };
  el.textContent = labels[axesSource] || "";
}

function reconcileRadarEntries(){
  const existing = state.qualityRadar.entries;
  AXES_CONFIG.axes.forEach(ax=>{
    if(!existing.find(en=>en.axisId===ax.id)){
      existing.push({axisId:ax.id, current:null, goal:null, noteCurrent:"", noteGoal:""});
    }
  });
}

/* ---------------------------------------------------------------------
   Generic radar SVG renderer (no external chart library)
--------------------------------------------------------------------- */
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
  const size = opts.size || 460;
  const cx = size/2, cy = size/2;
  const n = axesList.length;
  if(n < 3){ return `<text x="20" y="30" font-size="13" fill="#5B6472">Au moins 3 axes sont requis.</text>`; }
  const angleFor = i => -Math.PI/2 + i*(2*Math.PI/n);
  const fontSize = 11;
  const labelGap = 18;

  // Compute a radius that leaves enough room for every axis label, measured
  // for real (via canvas text metrics), so long labels never get clipped.
  let R = opts.radius;
  if(R === undefined){
    R = size/2; // upper bound before shrinking for labels
    if(opts.showLabels !== false){
      axesList.forEach((ax,i)=>{
        const angle = angleFor(i);
        const w = textWidth(ax.label||"", fontSize);
        const h = fontSize * 1.3;
        R = Math.min(R, maxRadiusForLabel(cx, cy, angle, w, h, labelGap, size));
      });
    }
    R = Math.max(R, size*0.08);
  }

  const els = [];

  bands.forEach(band=>{
    const pts = axesList.map((ax,i)=>{
      const v = band.values[i]; const val = (v===null||v===undefined) ? scaleMin : v;
      return radarPoint(cx,cy,R,angleFor(i),val,scaleMin,scaleMax);
    });
    els.push(`<polygon points="${ptsStr(pts)}" fill="${band.fill}" stroke="${band.stroke||band.fill}" stroke-width="1" fill-opacity="${band.opacity!==undefined?band.opacity:1}"/>`);
  });

  lines.forEach(line=>{
    const pts = axesList.map((ax,i)=>{
      const v = line.values[i]; const val = (v===null||v===undefined) ? scaleMin : v;
      return radarPoint(cx,cy,R,angleFor(i),val,scaleMin,scaleMax);
    });
    if(line.fill){
      els.push(`<polygon points="${ptsStr(pts)}" fill="${line.fill}" fill-opacity="${line.fillOpacity!==undefined?line.fillOpacity:0.25}" stroke="none"/>`);
    }
    const dash = line.dash ? `stroke-dasharray="${line.dash}"` : "";
    els.push(`<polygon points="${ptsStr(pts)}" fill="none" stroke="${line.stroke}" stroke-width="${line.width||3}" ${dash}/>`);
    if(line.points!==false){
      pts.forEach(p=>{ els.push(`<circle cx="${p.x.toFixed(1)}" cy="${p.y.toFixed(1)}" r="3.5" fill="${line.pointFill||line.stroke}" stroke="${line.stroke}" stroke-width="1.5"/>`); });
    }
  });

  // grid drawn on top of the filled bands (and lines), as requested
  const ringCount = 4;
  for(let ring=1; ring<=ringCount; ring++){
    const val = scaleMin + (scaleMax-scaleMin)*(ring/ringCount);
    const pts = axesList.map((ax,i)=>radarPoint(cx,cy,R,angleFor(i),val,scaleMin,scaleMax));
    els.push(`<polygon points="${ptsStr(pts)}" fill="none" stroke="rgba(20,20,20,0.35)" stroke-width="1.5"/>`);
  }
  for(let i=0;i<n;i++){
    const p = radarPoint(cx,cy,R,angleFor(i),scaleMax,scaleMin,scaleMax);
    els.push(`<line x1="${cx}" y1="${cy}" x2="${p.x.toFixed(1)}" y2="${p.y.toFixed(1)}" stroke="rgba(20,20,20,0.35)" stroke-width="1.5"/>`);
  }

  // axis labels, topmost
  if(opts.showLabels !== false){
    axesList.forEach((ax,i)=>{
      const angle = angleFor(i);
      const p = radarPoint(cx,cy,R+labelGap,angle,scaleMax,scaleMin,scaleMax);
      const cosA = Math.cos(angle);
      const anchor = cosA > 0.3 ? "start" : cosA < -0.3 ? "end" : "middle";
      els.push(`<text x="${p.x.toFixed(1)}" y="${p.y.toFixed(1)}" font-size="${fontSize}" fill="#3a3a38" text-anchor="${anchor}" dominant-baseline="middle">${escapeHtml(ax.label)}</text>`);
    });
  }

  return `<g>${els.join("")}</g>`;
}

function renderRadarPreview(){
  const svg = document.getElementById("radarPreviewSvg");
  if(!svg) return;
  const axes = AXES_CONFIG.axes;
  const smin = AXES_CONFIG.scaleMin, smax = AXES_CONFIG.scaleMax;
  const currentVals = axes.map(ax=>{ const en = state.qualityRadar.entries.find(e=>e.axisId===ax.id); return en && en.current!==null && en.current!==undefined ? Number(en.current) : null; });
  const goalVals = axes.map(ax=>{ const en = state.qualityRadar.entries.find(e=>e.axisId===ax.id); return en && en.goal!==null && en.goal!==undefined ? Number(en.goal) : null; });
  const lines = [
    { values:currentVals, stroke:"#2F6F6B", width:3, fill:"#2F6F6B", fillOpacity:0.18, pointFill:"#2F6F6B" },
    { values:goalVals, stroke:"#1B2430", width:3, dash:"6,4", pointFill:"#FAF9F6" }
  ];
  svg.innerHTML = buildRadarSVG(axes, smin, smax, [], lines, {size:460});
}

/* ---------------------------------------------------------------------
   Landing portrait: teaser placeholder vs. live auto-generated portrait
--------------------------------------------------------------------- */
function hasAnyRadarData(){
  return state.qualityRadar.entries.some(e=>e.current!==null && e.current!==undefined);
}

function renderTeaserGhost(){
  const svg = document.getElementById("teaserSvg");
  if(!svg) return;
  const axes = AXES_CONFIG.axes;
  const n = axes.length;
  const midVals = axes.map(()=> (AXES_CONFIG.scaleMin+AXES_CONFIG.scaleMax)/2 );
  const lines = [{ values:midVals, stroke:"rgba(27,36,48,0.28)", width:2, dash:"4,4", points:false }];
  svg.innerHTML = buildRadarSVG(axes, AXES_CONFIG.scaleMin, AXES_CONFIG.scaleMax, [], lines, {size:200, radius:70, showLabels:false});
}

function computeNarrative(){
  const axes = AXES_CONFIG.axes;
  const withCurrent = axes.map(ax=>{
    const en = state.qualityRadar.entries.find(e=>e.axisId===ax.id);
    return { ax, current: en && en.current!==null && en.current!==undefined ? Number(en.current) : null,
             goal: en && en.goal!==null && en.goal!==undefined ? Number(en.goal) : null };
  }).filter(e=>e.current!==null);

  if(withCurrent.length===0) return null;

  const filledCount = withCurrent.length;
  const totalCount = axes.length;

  const sortedByCurrent = [...withCurrent].sort((a,b)=>b.current-a.current);
  const top = sortedByCurrent[0];
  const second = sortedByCurrent[1];
  let strongLine;
  if(second && (top.current - second.current) <= 0.5){
    strongLine = `Vos forces les plus marquées sont ${top.ax.label.toLowerCase()} et ${second.ax.label.toLowerCase()}.`;
  } else {
    strongLine = `Votre force la plus marquée est ${top.ax.label.toLowerCase()}.`;
  }

  const withGap = withCurrent.filter(e=>e.goal!==null && e.goal>e.current)
    .map(e=>({...e, gap:e.goal-e.current}))
    .sort((a,b)=>b.gap-a.gap);
  const growingCount = withGap.length;
  const stableCount = withCurrent.filter(e=>e.goal!==null && e.goal===e.current).length;

  let growLine;
  if(withGap.length>0){
    const g = withGap[0];
    growLine = `Votre plus grand pas prévu se situe en ${g.ax.label.toLowerCase()}, de ${g.current} à ${g.goal}.`;
  } else {
    growLine = "Aucun objectif de progression n'est encore défini au-delà de votre position actuelle.";
  }

  return { strongLine, growLine, growingCount, stableCount, filledCount, totalCount };
}

function renderPortrait(){
  const hasData = hasAnyRadarData();
  document.getElementById("portraitTeaser").style.display = hasData ? "none" : "block";
  document.getElementById("portraitCard").style.display = hasData ? "block" : "none";
  if(!hasData){ renderTeaserGhost(); return; }

  const narrative = computeNarrative();
  const name = state.meta.teacherName || "";
  const initials = name.trim().split(/\s+/).map(w=>w[0]).slice(0,2).join("").toUpperCase() || "—";
  document.getElementById("portraitAvatar").textContent = initials;
  document.getElementById("portraitName").textContent = name || "Portrait sans nom";
  document.getElementById("portraitStrongLine").textContent = narrative.strongLine;
  document.getElementById("portraitGrowLine").textContent = narrative.growLine;
  document.getElementById("portraitGrowingPill").textContent = `${narrative.growingCount} axe${narrative.growingCount===1?"":"s"} en croissance`;
  document.getElementById("portraitStablePill").textContent = `${narrative.stableCount} axe${narrative.stableCount===1?"":"s"} stable${narrative.stableCount===1?"":"s"}`;

  const notes = [];
  if(narrative.filledCount < narrative.totalCount) notes.push(`D'après ${narrative.filledCount} axe${narrative.filledCount===1?"":"s"} sur ${narrative.totalCount} rempli${narrative.filledCount===1?"":"s"} jusqu'à présent.`);
  if(state.qualityRadar.targetDate) notes.push(`Échéance visée : ${state.qualityRadar.targetDate}.`);
  document.getElementById("portraitFooterNote").textContent = notes.join(" ");

  const svg = document.getElementById("portraitRadarSvg");
  const axes = AXES_CONFIG.axes;
  const smin = AXES_CONFIG.scaleMin, smax = AXES_CONFIG.scaleMax;
  const currentVals = axes.map(ax=>{ const en = state.qualityRadar.entries.find(e=>e.axisId===ax.id); return en && en.current!==null && en.current!==undefined ? Number(en.current) : null; });
  const goalVals = axes.map(ax=>{ const en = state.qualityRadar.entries.find(e=>e.axisId===ax.id); return en && en.goal!==null && en.goal!==undefined ? Number(en.goal) : null; });
  const lines = [
    { values:currentVals, stroke:"#2F6F6B", width:3, fill:"#2F6F6B", fillOpacity:0.18, pointFill:"#2F6F6B" },
    { values:goalVals, stroke:"#1B2430", width:3, dash:"6,4", pointFill:"#FAF9F6" }
  ];
  svg.innerHTML = buildRadarSVG(axes, smin, smax, [], lines, {size:400});
}

document.getElementById("btnGoToAxes").addEventListener("click", ()=>{
  document.getElementById("axes-anchor").scrollIntoView({behavior:"smooth", block:"start"});
});

function renderQualityRadar(){
  const wrap = document.getElementById("axesRows");
  wrap.innerHTML = "";
  const smin = AXES_CONFIG.scaleMin, smax = AXES_CONFIG.scaleMax;
  document.getElementById("radar-target-date").value = state.qualityRadar.targetDate || "";
  AXES_CONFIG.axes.forEach(ax=>{
    const entry = state.qualityRadar.entries.find(e=>e.axisId===ax.id);
    const card = document.createElement("div");
    card.className = "activity-card";
    card.innerHTML = `
      <div style="font-weight:600; font-size:13.5px;">${escapeHtml(ax.label)}</div>
      <div style="font-size:12px; color:var(--muted); margin-bottom:10px;">${escapeHtml(ax.description||"")}</div>
      <div class="grid2">
        <div class="field tight">
          <label>Position actuelle: <span class="rv-cur-out">${entry.current!==null?scaleLabelFor(entry.current):"—"}</span></label>
          <input type="range" class="rv-current" min="${smin}" max="${smax}" step="1" value="${entry.current ?? smin}">
        </div>
        <div class="field tight">
          <label>Objectif: <span class="rv-goal-out">${entry.goal!==null?scaleLabelFor(entry.goal):"—"}</span></label>
          <input type="range" class="rv-goal" min="${smin}" max="${smax}" step="1" value="${entry.goal ?? smin}">
        </div>
      </div>
      <div class="grid2" style="margin-top:10px;">
        <div class="field tight">
          <label>Notes — état actuel (optionnel)</label>
          <textarea class="rv-note-current" style="min-height:44px;" placeholder="Ex. ce qui explique cette position...">${escapeHtml(entry.noteCurrent)}</textarea>
        </div>
        <div class="field tight">
          <label>Notes — amélioration prévue (optionnel)</label>
          <textarea class="rv-note-goal" style="min-height:44px;" placeholder="Ex. moyens envisagés pour progresser...">${escapeHtml(entry.noteGoal)}</textarea>
        </div>
      </div>
    `;
    wrap.appendChild(card);

    card.querySelector(".rv-current").addEventListener("input", e=>{
      entry.current = Number(e.target.value);
      card.querySelector(".rv-cur-out").textContent = scaleLabelFor(entry.current);
      touch(); renderRadarPreview(); renderPortrait();
    });
    card.querySelector(".rv-goal").addEventListener("input", e=>{
      entry.goal = Number(e.target.value);
      card.querySelector(".rv-goal-out").textContent = scaleLabelFor(entry.goal);
      touch(); renderRadarPreview(); renderPortrait();
    });
    card.querySelector(".rv-note-current").addEventListener("input", e=>{ entry.noteCurrent = e.target.value; touch(); });
    card.querySelector(".rv-note-goal").addEventListener("input", e=>{ entry.noteGoal = e.target.value; touch(); });
  });
  renderRadarPreview();
  renderPortrait();
}
document.getElementById("radar-target-date").addEventListener("input", e=>{ state.qualityRadar.targetDate = e.target.value; touch(); renderPortrait(); });

function allDomains(){ return AXES_CONFIG.axes; }
function toggleInArray(arr, val, on){
  const i = arr.indexOf(val);
  if(on && i===-1) arr.push(val);
  if(!on && i!==-1) arr.splice(i,1);
}

/* ---------------------------------------------------------------------
   Rendering: Domain-specific skills
--------------------------------------------------------------------- */
const SKILL_KIND_OPTIONS = [
  {v:"nouvelle", l:"Nouvelle compétence à développer"},
  {v:"maintien", l:"Expertise existante à maintenir ou actualiser"},
];

function renderDomainSkills(){
  const list = document.getElementById("domainSkillsList");
  list.innerHTML = "";
  if(state.domainSkills.length===0){
    list.innerHTML = `<div class="empty-note">Aucune compétence ajoutée pour le moment.</div>`;
  }
  state.domainSkills.forEach((sk, idx)=>{
    const card = document.createElement("div");
    card.className = "activity-card";
    card.innerHTML = `
      <div class="row-top">
        <div class="field tight" style="flex:1;">
          <label>Compétence ou expertise</label>
          <input type="text" class="sk-name" data-idx="${idx}" value="${escapeAttr(sk.name)}" placeholder="Ex. Analyse de données avec Python">
        </div>
        <button class="small danger-outline sk-remove" data-idx="${idx}" style="margin-top:18px;">Retirer</button>
      </div>
      <div class="field tight" style="margin-top:10px;">
        <label>Type</label>
        <select class="sk-kind" data-idx="${idx}">
          ${SKILL_KIND_OPTIONS.map(o=>`<option value="${o.v}" ${sk.kind===o.v?"selected":""}>${o.l}</option>`).join("")}
        </select>
      </div>
      <div class="grid2" style="margin-top:10px;">
        <div class="field tight">
          <label>Comment (moyen envisagé)</label>
          <textarea class="sk-plan" style="min-height:44px;" placeholder="Ex. autoformation, mentorat, cours crédité...">${escapeHtml(sk.plan)}</textarea>
        </div>
        <div class="field tight">
          <label>Quand</label>
          <input type="text" class="sk-when" data-idx="${idx}" value="${escapeAttr(sk.when)}" placeholder="Ex. Session Hiver 2027">
        </div>
      </div>
      <div class="field tight" style="margin-top:10px;">
        <label class="chip" style="width:fit-content;">
          <input type="checkbox" class="sk-newcourses" data-idx="${idx}" ${sk.newCourses?"checked":""}> Souhaite enseigner de nouveaux cours une fois cette compétence acquise
        </label>
      </div>
      <div class="field tight sk-newcourses-details" data-idx="${idx}" style="margin-top:10px; display:${sk.newCourses?"block":"none"};">
        <label>Lesquels (optionnel)</label>
        <input type="text" class="sk-newcourses-text" data-idx="${idx}" value="${escapeAttr(sk.newCoursesDetails)}" placeholder="Ex. cours d'introduction à la science des données">
      </div>
    `;
    list.appendChild(card);

    card.querySelector(".sk-name").addEventListener("input", e=>{ sk.name = e.target.value; touch(); });
    card.querySelector(".sk-kind").addEventListener("change", e=>{ sk.kind = e.target.value; touch(); });
    card.querySelector(".sk-plan").addEventListener("input", e=>{ sk.plan = e.target.value; touch(); });
    card.querySelector(".sk-when").addEventListener("input", e=>{ sk.when = e.target.value; touch(); });
    card.querySelector(".sk-newcourses").addEventListener("change", e=>{
      sk.newCourses = e.target.checked; touch();
      card.querySelector(".sk-newcourses-details").style.display = e.target.checked ? "block":"none";
    });
    card.querySelector(".sk-newcourses-text").addEventListener("input", e=>{ sk.newCoursesDetails = e.target.value; touch(); });
    card.querySelector(".sk-remove").addEventListener("click", ()=>{
      state.domainSkills.splice(idx,1); touch(); renderDomainSkills();
    });
  });
}

document.getElementById("btnAddDomainSkill").addEventListener("click", ()=>{
  state.domainSkills.push({
    id: uid("skill"), kind:"nouvelle", name:"", plan:"", when:"", newCourses:false, newCoursesDetails:""
  });
  touch(); renderDomainSkills();
});

/* ---------------------------------------------------------------------
   Rendering: Activities
--------------------------------------------------------------------- */
function renderActivities(){
  const list = document.getElementById("activitiesList");
  list.innerHTML = "";
  if(state.activities.length===0){
    list.innerHTML = `<div class="empty-note">Aucune activité ajoutée pour le moment.</div>`;
  }
  state.activities.forEach((a, idx)=>{
    const card = document.createElement("div");
    card.className = "activity-card";
    card.innerHTML = `
      <div class="row-top">
        <div class="field tight" style="flex:1;">
          <label>Titre de l'activité</label>
          <input type="text" class="a-title" data-idx="${idx}" value="${escapeAttr(a.title)}" placeholder="Ex. Colloque en pédagogie collégiale">
        </div>
        <button class="small danger-outline a-remove" data-idx="${idx}" style="margin-top:18px;">Retirer</button>
      </div>
      <div class="grid3" style="margin-top:12px;">
        <div class="field tight">
          <label>Catégorie</label>
          <select class="a-category" data-idx="${idx}">
            ${CATEGORY_OPTIONS.map(o=>`<option value="${o.v}" ${a.category===o.v?"selected":""}>${o.l}</option>`).join("")}
          </select>
        </div>
        <div class="field tight">
          <label>Format</label>
          <select class="a-format" data-idx="${idx}">
            ${FORMAT_OPTIONS.map(o=>`<option value="${o.v}" ${a.format===o.v?"selected":""}>${o.l}</option>`).join("")}
          </select>
        </div>
        <div class="field tight">
          <label>Statut</label>
          <select class="a-status" data-idx="${idx}">
            ${STATUS_OPTIONS.map(o=>`<option value="${o.v}" ${a.status===o.v?"selected":""}>${o.l}</option>`).join("")}
          </select>
        </div>
      </div>
      <div class="grid3" style="margin-top:12px;">
        <div class="field tight">
          <label>Session / période visée</label>
          <input type="text" class="a-session" data-idx="${idx}" value="${escapeAttr(a.session)}" placeholder="Ex. Session Automne 2026">
        </div>
        <div class="field tight">
          <label>Coût estimé (CAD)</label>
          <input type="number" min="0" step="1" class="a-cost" data-idx="${idx}" value="${a.estimatedCost ?? ""}">
        </div>
        <div class="field tight">
          <label class="chip" style="width:fit-content;">
            <input type="checkbox" class="a-rd" data-idx="${idx}" ${a.proposedRD?"checked":""}> Proposée en R&D
          </label>
        </div>
      </div>
      <div class="field" style="margin-top:12px;">
        <label>Domaine(s) visé(s)</label>
        <div class="chip-group a-domains" data-idx="${idx}"></div>
      </div>
      <div class="a-rd-block" data-idx="${idx}" style="display:${a.proposedRD?"block":"none"};">
        <div class="grid3" style="margin-top:8px;">
          <div class="field tight">
            <label>Catégorie R&D</label>
            <select class="a-rdcat" data-idx="${idx}">
              <option value="">— à sélectionner —</option>
              ${RD_CATEGORY_OPTIONS.map(o=>`<option value="${o.v}" ${a.rdCategory===o.v?"selected":""}>${o.l}</option>`).join("")}
            </select>
          </div>
          <div class="field tight">
            <label>État de l'approbation</label>
            <select class="a-rdstatus" data-idx="${idx}">
              ${RD_STATUS_OPTIONS.map(o=>`<option value="${o.v}" ${(a.rdApprovalStatus||"en_attente")===o.v?"selected":""}>${o.l}</option>`).join("")}
            </select>
          </div>
          <div class="field tight">
            <label>Date de la décision</label>
            <input type="date" class="a-rddate" data-idx="${idx}" value="${escapeAttr(a.rdApprovalDate)}">
          </div>
        </div>
        <div class="field tight" style="margin-top:10px;">
          <label>Décidée par (nom et fonction, Direction des études)</label>
          <input type="text" class="a-rdby" data-idx="${idx}" value="${escapeAttr(a.rdApprovedBy)}" placeholder="Ex. Jordan Léveillé, directeur des études">
        </div>
        <div class="rd-message" data-idx="${idx}">${rdMessageHtml(a)}</div>
      </div>
      <div class="field" style="margin-top:12px;">
        <label>Notes (optionnel)</label>
        <textarea class="a-notes" data-idx="${idx}">${escapeHtml(a.notes)}</textarea>
      </div>
    `;
    list.appendChild(card);

    // domain chips for this activity
    const domainContainer = card.querySelector(".a-domains");
    allDomains().forEach(d=>{
      if(!d.label) return;
      const active = a.domains.includes(d.id);
      const chip = document.createElement("label");
      chip.className = "chip" + (active?" active":"");
      chip.innerHTML = `<input type="checkbox" ${active?"checked":""}> ${escapeHtml(d.label)}`;
      chip.querySelector("input").addEventListener("change", e=>{
        toggleInArray(a.domains, d.id, e.target.checked);
        chip.classList.toggle("active", e.target.checked);
        touch();
      });
      domainContainer.appendChild(chip);
    });
  });

  // bind field events
  list.querySelectorAll(".a-title").forEach(el=>el.addEventListener("input", e=>{ state.activities[e.target.dataset.idx].title = e.target.value; touch(); renderBudget(); }));
  list.querySelectorAll(".a-category").forEach(el=>el.addEventListener("change", e=>{ state.activities[e.target.dataset.idx].category = e.target.value; touch(); renderBudget(); }));
  list.querySelectorAll(".a-format").forEach(el=>el.addEventListener("change", e=>{ state.activities[e.target.dataset.idx].format = e.target.value; touch(); }));
  list.querySelectorAll(".a-status").forEach(el=>el.addEventListener("change", e=>{ state.activities[e.target.dataset.idx].status = e.target.value; touch(); }));
  list.querySelectorAll(".a-session").forEach(el=>el.addEventListener("input", e=>{ state.activities[e.target.dataset.idx].session = e.target.value; touch(); }));
  list.querySelectorAll(".a-cost").forEach(el=>el.addEventListener("input", e=>{
    state.activities[e.target.dataset.idx].estimatedCost = e.target.value===""?null:Number(e.target.value); touch(); renderBudget();
  }));
  list.querySelectorAll(".a-rd").forEach(el=>el.addEventListener("change", e=>{
    const idx = e.target.dataset.idx;
    state.activities[idx].proposedRD = e.target.checked; touch();
    list.querySelector(`.a-rd-block[data-idx="${idx}"]`).style.display = e.target.checked ? "block":"none";
  }));
  list.querySelectorAll(".a-rdcat").forEach(el=>el.addEventListener("change", e=>{ state.activities[e.target.dataset.idx].rdCategory = e.target.value; touch(); }));
  list.querySelectorAll(".a-rdstatus").forEach(el=>el.addEventListener("change", e=>{
    const idx = e.target.dataset.idx;
    state.activities[idx].rdApprovalStatus = e.target.value; touch();
    list.querySelector(`.rd-message[data-idx="${idx}"]`).innerHTML = rdMessageHtml(state.activities[idx]);
  }));
  list.querySelectorAll(".a-rdby").forEach(el=>el.addEventListener("input", e=>{
    const idx = e.target.dataset.idx;
    state.activities[idx].rdApprovedBy = e.target.value; touch();
    list.querySelector(`.rd-message[data-idx="${idx}"]`).innerHTML = rdMessageHtml(state.activities[idx]);
  }));
  list.querySelectorAll(".a-rddate").forEach(el=>el.addEventListener("input", e=>{
    const idx = e.target.dataset.idx;
    state.activities[idx].rdApprovalDate = e.target.value; touch();
    list.querySelector(`.rd-message[data-idx="${idx}"]`).innerHTML = rdMessageHtml(state.activities[idx]);
  }));
  list.querySelectorAll(".a-notes").forEach(el=>el.addEventListener("input", e=>{ state.activities[e.target.dataset.idx].notes = e.target.value; touch(); }));
  list.querySelectorAll(".a-remove").forEach(el=>el.addEventListener("click", e=>{
    state.activities.splice(e.target.dataset.idx,1); touch(); renderActivities(); renderBudget();
  }));
}

document.getElementById("btnAddActivity").addEventListener("click", ()=>{
  state.activities.push({
    id:uid("act"), title:"", category:"formation_individuelle", domains:[], format:"atelier",
    session:"", startDate:"", endDate:"", estimatedCost:null, proposedRD:false, rdCategory:"",
    rdApprovalStatus:"en_attente", rdApprovedBy:"", rdApprovalDate:"", status:"planned", notes:""
  });
  touch(); renderActivities(); renderBudget();
});

function rdMessageHtml(a){
  const status = a.rdApprovalStatus || "en_attente";
  if(status === "approuvee"){
    return `<div class="info-box"><strong>Approuvée</strong>${a.rdApprovedBy?" par "+escapeHtml(a.rdApprovedBy):""}${a.rdApprovalDate?", le "+a.rdApprovalDate:""}. Conservez la confirmation écrite pour vos dossiers.</div>`;
  }
  if(status === "refusee"){
    return `<div class="warn-box"><strong>Refusée</strong>${a.rdApprovedBy?" par "+escapeHtml(a.rdApprovedBy):""}${a.rdApprovalDate?", le "+a.rdApprovalDate:""}. Cette activité ne compte pas comme temps de R&D. Révisez ce plan en conséquence — retirez la désignation R&D ou ajustez l'activité pour qu'il reflète la réalité.</div>`;
  }
  return `<div class="warn-box"><strong>Rappel</strong> Cette activité n'est pas encore reconnue en R&D. Elle ne compte comme telle qu'une fois l'approbation écrite obtenue de la Direction des études — indiquez alors qui a approuvé et à quelle date.</div>`;
}

/* ---------------------------------------------------------------------
   Rendering: Budget
--------------------------------------------------------------------- */
function renderBudget(){
  const rows = document.getElementById("budgetRows");
  rows.innerHTML = "";
  let total = 0;
  const catLabel = v => (CATEGORY_OPTIONS.find(o=>o.v===v)||{}).l || v;
  state.activities.forEach(a=>{
    const cost = a.estimatedCost || 0;
    total += cost;
    const tr = document.createElement("tr");
    tr.innerHTML = `<td>${escapeHtml(a.title || "(sans titre)")}</td><td>${escapeHtml(catLabel(a.category))}</td><td style="text-align:right;">${cost ? cost.toLocaleString("fr-CA") + " $" : "—"}</td>`;
    rows.appendChild(tr);
  });
  if(state.activities.length===0){
    rows.innerHTML = `<tr><td colspan="3" class="empty-note">Aucune activité à afficher.</td></tr>`;
  }
  document.getElementById("budgetTotal").textContent = total.toLocaleString("fr-CA") + " $";
}

document.getElementById("budget-notes").addEventListener("input", e=>{ state.budgetPlanning.notes = e.target.value; touch(); });

/* ---------------------------------------------------------------------
   Timeline
--------------------------------------------------------------------- */
function addYears(dateObj, n){
  const d = new Date(dateObj.getTime());
  d.setFullYear(d.getFullYear()+n);
  return d;
}
function fmtShort(d){
  return d.toLocaleDateString("fr-CA", {year:"numeric", month:"short", day:"numeric"});
}
function annualDateInYear(year, month, day){ return new Date(year, month, day); }

function renderTimeline(){
  const svg = document.getElementById("timelineSvg");
  svg.innerHTML = "";
  const W = 900, H = 190, marginX = 40;
  const start = new Date(state.meta.createdAt);
  const end = state.meta.planEndDate ? new Date(state.meta.planEndDate+"T00:00:00") : addYears(start,2);
  const spanPadDays = 30;
  const span = new Date(Math.max(end.getTime(), addYears(start,1).getTime()) + spanPadDays*86400000);

  const totalMs = span - start;
  const xFor = (d) => marginX + ((d-start)/totalMs) * (W - marginX*2);
  const totalYears = Math.max(1, Math.ceil(totalMs / (365.25*86400000)));

  const els = [];
  // axis
  els.push(`<line x1="${marginX}" y1="90" x2="${W-marginX}" y2="90" stroke="#D8DCE1" stroke-width="2"/>`);

  // year ticks
  for(let y=0;y<=totalYears;y++){
    const d = addYears(start, y);
    if(d>span) break;
    const x = xFor(d);
    els.push(`<line x1="${x}" y1="82" x2="${x}" y2="98" stroke="#B9BEC6" stroke-width="1"/>`);
    els.push(`<text x="${x}" y="112" font-size="10.5" fill="#8A8F98" text-anchor="middle" font-family="Consolas,monospace">+${y} an${y>1?"s":""}</text>`);
  }

  // annual recurring reminders (Nov 15 balance stmt, May 15 balance stmt)
  const recurring = [
    {month:10, day:15, label:"Relevé budget (15 nov.)"},
    {month:4, day:15, label:"Relevé budget (15 mai)"},
  ];
  for(let y=start.getFullYear(); y<=span.getFullYear()+1; y++){
    recurring.forEach(r=>{
      const d = annualDateInYear(y, r.month, r.day);
      if(d>=start && d<=span){
        const x = xFor(d);
        els.push(`<circle cx="${x}" cy="90" r="4" fill="#8A8F98"/>`);
        els.push(`<text x="${x}" y="72" font-size="9.5" fill="#5B6472" text-anchor="middle">${fmtShort(d)}</text>`);
      }
    });
  }

  // plan established
  els.push(markerAt(xFor(start), "Plan établi", fmtShort(start), "#2F6F6B", true));

  // plan end / review due
  els.push(markerAt(xFor(end), "Fin visée du plan", fmtShort(end), "#2F6F6B", false));

  // appréciation étudiante reçue : on ne peut ni prévoir ni garantir quand elle
  // survient, donc on trace uniquement les entrées réellement reçues à ce jour.
  state.studentFeedbackHistory.forEach(entry=>{
    const d = new Date(entry.addedAt);
    if(d>=start && d<=span){
      const x = xFor(d);
      els.push(`<circle cx="${x}" cy="90" r="4.5" fill="#A6673A"/>`);
      els.push(`<text x="${x}" y="72" font-size="9.5" fill="#A6673A" text-anchor="middle">${fmtShort(d)}</text>`);
    }
  });

  svg.setAttribute("viewBox", `0 0 ${W} ${H}`);
  svg.innerHTML = els.join("");
}

function markerAt(x, title, dateLabel, color, above){
  const y1 = above ? 150 : 40;
  const ty = above ? 168 : 22;
  return `
    <line x1="${x}" y1="90" x2="${x}" y2="${y1}" stroke="${color}" stroke-width="1.5" stroke-dasharray="3,2"/>
    <circle cx="${x}" cy="90" r="5" fill="${color}"/>
    <text x="${x}" y="${ty}" font-size="11" fill="${color}" text-anchor="middle" font-weight="600">${title}</text>
    <text x="${x}" y="${ty + (above?14:14)}" font-size="9.5" fill="#5B6472" text-anchor="middle" font-family="Consolas,monospace">${dateLabel}</text>
  `;
}

/* ---------------------------------------------------------------------
   Import / Export
--------------------------------------------------------------------- */
function fullRender(){
  bindMeta();
  document.getElementById("budget-notes").value = state.budgetPlanning.notes || "";
  document.getElementById("sabbatical-description").value = state.sabbatical.description || "";
  document.getElementById("radar-target-date").value = state.qualityRadar.targetDate || "";
  reconcileRadarEntries();
  updateAxesSourceNote();
  renderQualityRadar();
  renderAppreciationHistory();
  renderDomainSkills();
  renderActivities();
  renderBudget();
  renderTimeline();
}

document.getElementById("sabbatical-description").addEventListener("input", e=>{ state.sabbatical.description = e.target.value; touch(); });

document.getElementById("btnExport").addEventListener("click", ()=>{
  touch();
  state.qualityRadar.axesSnapshot = AXES_CONFIG.axes.map(a=>({id:a.id, label:a.label, description:a.description||""}));
  const blob = new Blob([JSON.stringify(state, null, 2)], {type:"application/json"});
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  const namePart = (state.meta.teacherName || "plan").trim().replace(/[^a-z0-9\-_]+/gi,"_");
  const datePart = new Date().toISOString().slice(0,10);
  a.href = url; a.download = `plan-perfectionnement_${namePart}_${datePart}.json`;
  document.body.appendChild(a); a.click(); document.body.removeChild(a);
  URL.revokeObjectURL(url);
});

document.getElementById("btnImportTrigger").addEventListener("click", ()=>{
  document.getElementById("fileImport").click();
});
document.getElementById("fileImport").addEventListener("change", (e)=>{
  const file = e.target.files[0];
  if(!file) return;
  const reader = new FileReader();
  reader.onload = () => {
    try{
      const loaded = JSON.parse(reader.result);
      if(!loaded.schemaVersion){ throw new Error("Fichier non reconnu."); }
      // fill missing fields defensively
      const blank = blankState();
      state = Object.assign(blank, loaded);
      state.meta = Object.assign(blank.meta, loaded.meta || {});
      state.budgetPlanning = Object.assign(blank.budgetPlanning, loaded.budgetPlanning || {});
      state.sabbatical = Object.assign(blank.sabbatical, loaded.sabbatical || {});
      state.qualityRadar = Object.assign(blank.qualityRadar, loaded.qualityRadar || {});
      if(!Array.isArray(state.qualityRadar.entries)) state.qualityRadar.entries = [];
      if(!Array.isArray(state.qualityRadar.axesSnapshot)) state.qualityRadar.axesSnapshot = [];
      if(!Array.isArray(state.studentFeedbackHistory)) state.studentFeedbackHistory = [];
      if(!Array.isArray(state.domainSkills)) state.domainSkills = [];
      state.domainSkills.forEach(sk=>{
        if(sk.kind === undefined) sk.kind = "nouvelle";
        if(sk.plan === undefined) sk.plan = "";
        if(sk.when === undefined) sk.when = "";
        if(sk.newCourses === undefined) sk.newCourses = false;
        if(sk.newCoursesDetails === undefined) sk.newCoursesDetails = "";
      });
      if(!Array.isArray(state.activities)) state.activities = [];
      state.activities.forEach(a=>{
        if(a.rdApprovalStatus === undefined) a.rdApprovalStatus = a.rdApprovalObtained ? "approuvee" : "en_attente";
        if(a.rdApprovedBy === undefined) a.rdApprovedBy = "";
        if(a.rdApprovalDate === undefined) a.rdApprovalDate = "";
        delete a.rdApprovalObtained;
      });
      fullRender();
      renderPortrait();
    }catch(err){
      alert("Impossible de lire ce fichier comme un plan valide.\n" + err.message);
    }
  };
  reader.readAsText(file);
  e.target.value = "";
});

document.getElementById("btnNew").addEventListener("click", ()=>{
  if(confirm("Créer un nouveau plan vide ? Les données non exportées seront perdues.")){
    state = blankState();
    fullRender();
    renderPortrait();
  }
});

/* ---------------------------------------------------------------------
   Utils
--------------------------------------------------------------------- */
function escapeHtml(s){ return (s||"").replace(/[&<>"']/g, c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c])); }
function escapeAttr(s){ return escapeHtml(s); }

/* Init */
fullRender();
renderPortrait();
tryAutoLoadAxes();
