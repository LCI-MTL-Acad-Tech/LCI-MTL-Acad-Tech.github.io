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
  {v:"seminaire", l:"Séminaire", d:"Rencontre de petit groupe, participative, pour approfondir un sujet précis avec échanges actifs entre les participants."},
  {v:"colloque_congres", l:"Colloque ou congrès", d:"Événement scientifique ou professionnel réunissant plusieurs intervenants autour d'un thème — petite échelle (colloque) ou grande échelle, souvent annuelle et sur plusieurs jours (congrès)."},
  {v:"conference", l:"Conférence", d:"Exposé ou présentation ponctuelle, généralement par une seule personne, sur un sujet précis."},
  {v:"stage", l:"Stage en milieu industriel", d:"Période d'immersion pratique en entreprise ou en milieu professionnel."},
  {v:"cours_non_credite", l:"Cours non crédité", d:"Cours suivi sans obtention de crédits académiques."},
  {v:"cours_credite", l:"Cours crédité", d:"Cours suivi avec obtention de crédits académiques (scolarité créditée)."},
  {v:"atelier", l:"Atelier", d:"Activité pratique et interactive, en petit groupe, axée sur le développement d'habiletés concrètes."},
  {v:"mentorat", l:"Mentorat / formation entre pairs", d:"Accompagnement individualisé par ou avec une personne collègue d'expérience."},
  {v:"autre", l:"Autre", d:"Format qui ne correspond à aucune des catégories ci-dessus — précisez dans les notes."},
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
  schemaVersion:"1.0", scaleMin:1, scaleMax:7,
  scaleLabels:["Très faible","Faible","Limité","Correct","Confortable","Confiant","Maîtrisé"],
  surveyScaleLabels:["Très faible","Faible","Passable","Correct","Bon","Très bon","Excellent"],
  surveyScaleLabelsEn:["Very poor","Poor","Fair","Correct","Good","Very good","Excellent"],
  axes:[
    {id:"clarte", label:"Clarté des explications", labelEn:"Clarity of explanations", description:"La capacité à expliquer les concepts de façon claire et compréhensible.",
     ideas:["Utiliser des exemples concrets et des analogies tirées du quotidien","Varier les supports : tableau, schémas dessinés à la main, objets manipulables","Résumer les points clés oralement et par écrit à la fin de chaque section"]},
    {id:"organisation", label:"Organisation du cours", labelEn:"Course organization", description:"La structure, la planification et la cohérence du déroulement du cours.",
     ideas:["Distribuer un plan de cours papier annoté au fil des séances","Utiliser des fiches ou un cahier de suivi pour structurer chaque séance","Prévoir des repères visuels affichés en classe (échéanciers, étapes du cours)"]},
    {id:"engagement", label:"Engagement des étudiants", labelEn:"Student engagement", description:"La capacité à susciter l'intérêt et la participation active des étudiants.",
     ideas:["Jeux de rôle, mises en situation ou études de cas sur papier","Discussions en petits groupes avec du matériel physique (cartes, jetons, tableaux blancs)","Projets pratiques utilisant du matériel réel du domaine étudié"]},
    {id:"retroaction", label:"Rétroaction et évaluation", labelEn:"Feedback and assessment", description:"La qualité, la clarté et l'utilité de la rétroaction donnée aux étudiants.",
     ideas:["Rétroaction manuscrite personnalisée directement sur les copies","Grilles d'évaluation critériées partagées à l'avance, sur papier ou à l'écran","Courtes rencontres individuelles pour discuter des travaux"]},
    {id:"disponibilite", label:"Disponibilité et soutien", labelEn:"Availability and support", description:"L'accessibilité et le soutien offerts aux étudiants en dehors des cours.",
     ideas:["Heures de bureau fixes, en personne ou par téléphone","Bibliothèque de ressources papier en libre accès (guides, exemples annotés)","Groupes d'entraide entre étudiants avec du matériel partagé"]},
    {id:"gestion", label:"Gestion de classe", labelEn:"Classroom management", description:"La capacité à maintenir un environnement d'apprentissage respectueux et productif.",
     ideas:["Supports physiques pour structurer les transitions (minuteries, signaux visuels)","Aménagement de l'espace (îlots, cercles de discussion)","Routines claires affichées en classe"]},
    {id:"numerique", label:"Diversité des outils et du matériel pédagogique", labelEn:"Diversity of tools and materials", description:"Le recours à des outils et supports variés — numériques, imprimés, manipulables ou autres — choisis selon le besoin pédagogique plutôt que par défaut.",
     ideas:["Combiner plusieurs supports pour un même contenu (ex. démonstration physique + fiche papier + vidéo courte)","Maquettes, manipulables, matériel de laboratoire ou instruments propres à la discipline","Choisir l'outil — numérique ou non — en fonction du besoin pédagogique, pas de la nouveauté"]}
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

function sliderColorForValue(value, min, max){
  const t = max>min ? Math.max(0, Math.min(1, (value-min)/(max-min))) : 0;
  const hue = Math.round(t*120); // 0 = red, 120 = green
  return `hsl(${hue}, 72%, 40%)`;
}
function applySliderColor(el, value, min, max){
  const t = max>min ? Math.max(0, Math.min(1, (value-min)/(max-min))) : 0;
  const color = sliderColorForValue(value, min, max);
  const pct = t*100;
  el.style.setProperty("--slider-color", color);
  el.style.background = `linear-gradient(to right, ${color} 0%, ${color} ${pct}%, #E3E1D8 ${pct}%, #E3E1D8 100%)`;
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
    studentSurveyResponses:{ importedAt:"", fileName:"", perAxis:{} },
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
   Student survey: bilingual Word generator, Excel results parser,
   and a comparative radar (student-response quartiles vs. self-eval)
--------------------------------------------------------------------- */
function percentile(sortedArr, p){
  if(sortedArr.length===0) return null;
  if(sortedArr.length===1) return sortedArr[0];
  const idx = (sortedArr.length-1)*p;
  const lo = Math.floor(idx), hi = Math.ceil(idx);
  if(lo===hi) return sortedArr[lo];
  return sortedArr[lo] + (sortedArr[hi]-sortedArr[lo])*(idx-lo);
}

function docxParagraph(text, opts){
  opts = opts || {};
  const runProps = [];
  if(opts.bold) runProps.push("<w:b/>");
  if(opts.size) runProps.push(`<w:sz w:val="${opts.size}"/><w:szCs w:val="${opts.size}"/>`);
  const rPr = runProps.length ? `<w:rPr>${runProps.join("")}</w:rPr>` : "";
  const escaped = escapeHtml(text).replace(/\n/g,"</w:t></w:r><w:r><w:br/><w:t xml:space=\"preserve\">");
  return `<w:p>${opts.spacingAfter!==undefined?`<w:pPr><w:spacing w:after="${opts.spacingAfter}"/></w:pPr>`:""}<w:r>${rPr}<w:t xml:space="preserve">${escaped}</w:t></w:r></w:p>`;
}

async function generateSurveyDocx(){
  const axes = AXES_CONFIG.axes;
  const surveyFr = AXES_CONFIG.surveyScaleLabels || AXES_CONFIG.scaleLabels;
  const surveyEn = AXES_CONFIG.surveyScaleLabelsEn || surveyFr;
  const teacherName = state.meta.teacherName || "";
  const letters = "abcdefghijklmnopqrstuvwxyz";

  const paras = [];
  paras.push(docxParagraph(
    `Sondage étudiant${teacherName ? " — " + teacherName : ""} / Student Survey${teacherName ? " — " + teacherName : ""}`,
    {bold:true, size:32, spacingAfter:200}
  ));
  paras.push(docxParagraph(
    "Ce sondage est anonyme. Merci de répondre honnêtement — vos réponses aideront à orienter le perfectionnement professionnel de la personne enseignante.\n" +
    "This survey is anonymous. Please answer honestly — your responses will help guide this teacher's professional development.\n\n" +
    "Note pour la personne enseignante : une fois ce sondage créé dans Microsoft Forms, ouvrez les paramètres du formulaire et désactivez l'enregistrement du nom des répondants pour garantir l'anonymat.\n" +
    "Note for the teacher: once this survey is created in Microsoft Forms, open the form settings and turn off respondent name collection to ensure anonymity.",
    {spacingAfter:300}
  ));

  axes.forEach((ax, i)=>{
    const label = `${ax.label} / ${ax.labelEn || ax.label}`;
    paras.push(docxParagraph(`${i+1}. ${label}`, {bold:true, spacingAfter:80}));
    surveyFr.forEach((lvl, j)=>{
      const en = surveyEn[j] || lvl;
      paras.push(docxParagraph(`${letters[j]}. ${lvl} / ${en}`, {spacingAfter: j===surveyFr.length-1 ? 240 : 40}));
    });
  });

  const contentTypes = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
  <Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
  <Default Extension="xml" ContentType="application/xml"/>
  <Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/>
</Types>`;

  const rootRels = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/>
</Relationships>`;

  const documentXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
  <w:body>
    ${paras.join("\n    ")}
    <w:sectPr/>
  </w:body>
</w:document>`;

  const zip = new JSZip();
  zip.file("[Content_Types].xml", contentTypes);
  zip.folder("_rels").file(".rels", rootRels);
  zip.folder("word").file("document.xml", documentXml);

  const blob = await zip.generateAsync({type:"blob", mimeType:"application/vnd.openxmlformats-officedocument.wordprocessingml.document"});
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  const namePart = (teacherName || "sondage").trim().replace(/[^a-z0-9\-_]+/gi,"_");
  a.href = url; a.download = `sondage-etudiant_${namePart}.docx`;
  document.body.appendChild(a); a.click(); document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

document.getElementById("btnGenSurveyDocx").addEventListener("click", ()=>{
  generateSurveyDocx().catch(err=>alert("Impossible de générer le sondage.\n" + err.message));
});

function normalizeForMatch(s){
  return (s||"").toString().toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"").trim();
}

function parseSurveyWorkbook(workbook){
  const sheetName = workbook.SheetNames[0];
  const sheet = workbook.Sheets[sheetName];
  const rows = XLSX.utils.sheet_to_json(sheet, {header:1, defval:""});
  if(rows.length < 2) throw new Error("Le fichier ne contient pas de données de réponses.");
  const headers = rows[0].map(h => String(h||""));
  const headersNorm = headers.map(normalizeForMatch);

  const axes = AXES_CONFIG.axes;
  const surveyFr = AXES_CONFIG.surveyScaleLabels || AXES_CONFIG.scaleLabels;
  const surveyEn = AXES_CONFIG.surveyScaleLabelsEn || surveyFr;

  const perAxis = {};
  const colForAxis = {};
  axes.forEach(ax=>{
    const key = normalizeForMatch(ax.label);
    const idx = headersNorm.findIndex(h => h.includes(key));
    if(idx !== -1) colForAxis[ax.id] = idx;
    perAxis[ax.id] = [];
  });

  const smin = AXES_CONFIG.scaleMin;

  function matchLevel(cellValue){
    const raw = normalizeForMatch(cellValue);
    if(!raw) return -1;
    // try each half of a "FR / EN" style answer as an exact match first
    const parts = raw.split("/").map(p=>p.trim()).filter(Boolean);
    for(const part of parts){
      let idx = surveyFr.findIndex(l => normalizeForMatch(l)===part);
      if(idx!==-1) return idx;
      idx = surveyEn.findIndex(l => normalizeForMatch(l)===part);
      if(idx!==-1) return idx;
    }
    // exact match on the whole cell (covers single-language answers)
    let idx = surveyFr.findIndex(l => normalizeForMatch(l)===raw);
    if(idx!==-1) return idx;
    idx = surveyEn.findIndex(l => normalizeForMatch(l)===raw);
    if(idx!==-1) return idx;
    // last resort: substring match, but prefer the LONGEST matching label to
    // avoid a short label (e.g. "Bon") falsely matching inside a longer one
    // (e.g. "Très bon").
    let best = -1, bestLen = -1;
    [surveyFr, surveyEn].forEach(list=>{
      list.forEach((l,i)=>{
        const ln = normalizeForMatch(l);
        if(ln && raw.includes(ln) && ln.length > bestLen){ best = i; bestLen = ln.length; }
      });
    });
    return best;
  }

  for(let r=1; r<rows.length; r++){
    const row = rows[r];
    axes.forEach(ax=>{
      const col = colForAxis[ax.id];
      if(col===undefined) return;
      const level = matchLevel(row[col]);
      if(level!==-1) perAxis[ax.id].push(smin + level);
    });
  }

  const matchedAxes = Object.keys(colForAxis).length;
  const responseCount = rows.length - 1;
  return { perAxis, matchedAxes, totalAxes: axes.length, responseCount };
}

document.getElementById("btnImportSurveyTrigger").addEventListener("click", ()=>document.getElementById("surveyExcelImport").click());
document.getElementById("surveyExcelImport").addEventListener("change", (e)=>{
  const file = e.target.files[0];
  if(!file) return;
  const reader = new FileReader();
  reader.onload = () => {
    try{
      const data = new Uint8Array(reader.result);
      const workbook = XLSX.read(data, {type:"array"});
      const result = parseSurveyWorkbook(workbook);
      state.studentSurveyResponses = { importedAt:new Date().toISOString(), fileName:file.name, perAxis:result.perAxis };
      touch();
      const statusEl = document.getElementById("surveyImportStatus");
      statusEl.textContent = `${result.responseCount} réponse${result.responseCount===1?"":"s"} importée${result.responseCount===1?"":"s"} — ${result.matchedAxes} axe${result.matchedAxes===1?"":"s"} sur ${result.totalAxes} reconnu${result.matchedAxes===1?"":"s"} dans le fichier.`;
      renderSurveyComparative();
    }catch(err){
      alert("Impossible de lire ce fichier comme des résultats de sondage valides.\n" + err.message);
    }
  };
  reader.readAsArrayBuffer(file);
  e.target.value = "";
});

function renderSurveyComparative(){
  const wrap = document.getElementById("surveyComparativeWrap");
  const perAxis = (state.studentSurveyResponses && state.studentSurveyResponses.perAxis) || {};
  const hasAny = Object.values(perAxis).some(arr => Array.isArray(arr) && arr.length>0);
  if(!hasAny){ wrap.style.display = "none"; return; }
  wrap.style.display = "block";

  const axes = AXES_CONFIG.axes;
  const smin = AXES_CONFIG.scaleMin, smax = AXES_CONFIG.scaleMax;

  const bandDefs = [
    {p:1.0, fill:"#3B8C22", stroke:"#2E6D1A"},
    {p:0.75, fill:"#97C459", stroke:"#7CA845"},
    {p:0.5, fill:"#F4C430", stroke:"#D9AC1E"},
    {p:0.25, fill:"#EF9F27", stroke:"#D6871A"},
    {p:0.0, fill:"#E24B4A", stroke:"#C93534"},
  ];
  const bands = bandDefs.map(bd=>({
    fill:bd.fill, stroke:bd.stroke,
    values: axes.map(ax=>{
      const vals = (perAxis[ax.id]||[]).slice().sort((a,b)=>a-b);
      return vals.length ? percentile(vals, bd.p) : null;
    })
  }));

  const selfVals = axes.map(ax=>{
    const entry = state.qualityRadar.entries.find(e=>e.axisId===ax.id);
    return entry && entry.current!==null && entry.current!==undefined ? Number(entry.current) : null;
  });
  const lines = [{ values:selfVals, stroke:"#14181F", width:4 }];

  const svg = document.getElementById("surveyRadarSvg");
  svg.innerHTML = buildRadarSVG(axes, smin, smax, bands, lines, {size:560});

  document.getElementById("surveyRadarLegend").innerHTML = `
    <span><i style="background:#E24B4A;"></i>Minimum</span>
    <span><i style="background:#EF9F27;"></i>Q1</span>
    <span><i style="background:#F4C430;"></i>Médiane</span>
    <span><i style="background:#97C459;"></i>Q3</span>
    <span><i style="background:#3B8C22;"></i>Maximum (réponses étudiantes)</span>
    <span><svg width="18" height="10"><line x1="0" y1="5" x2="18" y2="5" stroke="#14181F" stroke-width="3"/></svg>Votre auto-positionnement</span>
  `;
}

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
      <div style="display:flex; align-items:flex-start; justify-content:space-between; gap:10px;">
        <div>
          <div style="font-weight:600; font-size:13.5px;">${escapeHtml(ax.label)}</div>
          <div style="font-size:12px; color:var(--muted); margin-bottom:6px;">${escapeHtml(ax.description||"")}</div>
        </div>
        ${(ax.ideas && ax.ideas.length) ? `<button type="button" class="small ax-ideas-toggle" style="white-space:nowrap;">Idées et pistes</button>` : ""}
      </div>
      ${(ax.ideas && ax.ideas.length) ? `
      <div class="ax-ideas-panel info-box" style="display:none; margin-bottom:10px;">
        <strong>Pistes et bonnes pratiques (pas seulement numériques)</strong>
        <ul style="margin:6px 0 0; padding-left:18px;">
          ${ax.ideas.map(i=>`<li style="margin-bottom:3px;">${escapeHtml(i)}</li>`).join("")}
        </ul>
      </div>` : ""}
      <div class="field tight">
        <label>Position actuelle : <span class="rv-cur-out">${entry.current!==null?scaleLabelFor(entry.current):"—"}</span></label>
        <input type="range" class="rv-slider rv-current" min="${smin}" max="${smax}" step="1" value="${entry.current ?? smin}">
      </div>
      <div class="field tight" style="margin-top:14px;">
        <label>Objectif : <span class="rv-goal-out">${entry.goal!==null?scaleLabelFor(entry.goal):"—"}</span></label>
        <input type="range" class="rv-slider rv-goal" min="${smin}" max="${smax}" step="1" value="${entry.goal ?? smin}">
      </div>
      <div class="grid2" style="margin-top:14px;">
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

    const ideasBtn = card.querySelector(".ax-ideas-toggle");
    if(ideasBtn){
      ideasBtn.addEventListener("click", ()=>{
        const panel = card.querySelector(".ax-ideas-panel");
        const open = panel.style.display !== "none";
        panel.style.display = open ? "none" : "block";
        ideasBtn.textContent = open ? "Idées et pistes" : "Masquer les idées";
      });
    }

    const curSlider = card.querySelector(".rv-current");
    const goalSlider = card.querySelector(".rv-goal");
    applySliderColor(curSlider, entry.current ?? smin, smin, smax);
    applySliderColor(goalSlider, entry.goal ?? smin, smin, smax);

    curSlider.addEventListener("input", e=>{
      entry.current = Number(e.target.value);
      card.querySelector(".rv-cur-out").textContent = scaleLabelFor(entry.current);
      applySliderColor(curSlider, entry.current, smin, smax);
      // l'objectif ne peut pas être inférieur à la position actuelle
      if(entry.goal === null || entry.goal < entry.current){
        entry.goal = entry.current;
        goalSlider.value = entry.goal;
        card.querySelector(".rv-goal-out").textContent = scaleLabelFor(entry.goal);
        applySliderColor(goalSlider, entry.goal, smin, smax);
      }
      touch(); renderRadarPreview(); renderPortrait(); renderSurveyComparative();
    });
    goalSlider.addEventListener("input", e=>{
      let v = Number(e.target.value);
      if(entry.current !== null && v < entry.current){ v = entry.current; e.target.value = v; }
      entry.goal = v;
      card.querySelector(".rv-goal-out").textContent = scaleLabelFor(entry.goal);
      applySliderColor(goalSlider, entry.goal, smin, smax);
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
            ${FORMAT_OPTIONS.map(o=>`<option value="${o.v}" title="${escapeAttr(o.d||"")}" ${a.format===o.v?"selected":""}>${o.l}</option>`).join("")}
          </select>
        </div>
        <div class="field tight">
          <label>Statut</label>
          <select class="a-status" data-idx="${idx}">
            ${STATUS_OPTIONS.map(o=>`<option value="${o.v}" ${a.status===o.v?"selected":""}>${o.l}</option>`).join("")}
          </select>
        </div>
      </div>
      <div class="a-format-help" style="font-size:11.5px;color:var(--muted);margin-top:-4px;margin-bottom:2px;">${escapeHtml((FORMAT_OPTIONS.find(o=>o.v===a.format)||{}).d||"")}</div>
      <div class="grid3" style="margin-top:12px;">
        <div class="field tight">
          <label>Année académique</label>
          <input type="text" class="a-year" data-idx="${idx}" value="${escapeAttr(a.academicYear)}" placeholder="Ex. 2026-2027">
        </div>
        <div class="field tight">
          <label>Session / période visée</label>
          <input type="text" class="a-session" data-idx="${idx}" value="${escapeAttr(a.session)}" placeholder="Ex. Session Automne 2026">
        </div>
        <div class="field tight">
          <label>Coût estimé (CAD)</label>
          <input type="number" min="0" step="1" class="a-cost" data-idx="${idx}" value="${a.estimatedCost ?? ""}">
        </div>
      </div>
      <div class="grid3" style="margin-top:12px;">
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
  list.querySelectorAll(".a-format").forEach(el=>el.addEventListener("change", e=>{
    const idx = e.target.dataset.idx;
    state.activities[idx].format = e.target.value; touch();
    const opt = FORMAT_OPTIONS.find(o=>o.v===e.target.value);
    const helpEl = e.target.closest(".activity-card").querySelector(".a-format-help");
    if(helpEl) helpEl.textContent = (opt && opt.d) || "";
  }));
  list.querySelectorAll(".a-status").forEach(el=>el.addEventListener("change", e=>{ state.activities[e.target.dataset.idx].status = e.target.value; touch(); }));
  list.querySelectorAll(".a-year").forEach(el=>el.addEventListener("input", e=>{ state.activities[e.target.dataset.idx].academicYear = e.target.value; touch(); renderBudget(); }));
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

function defaultAcademicYear(){
  const d = new Date();
  const y = d.getFullYear();
  return d.getMonth() >= 7 ? `${y}-${y+1}` : `${y-1}-${y}`;
}

document.getElementById("btnAddActivity").addEventListener("click", ()=>{
  state.activities.push({
    id:uid("act"), title:"", category:"formation_individuelle", domains:[], format:"atelier",
    session:"", startDate:"", endDate:"", academicYear:defaultAcademicYear(), estimatedCost:null, proposedRD:false, rdCategory:"",
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
  const catLabel = v => (CATEGORY_OPTIONS.find(o=>o.v===v)||{}).l || v;

  if(state.activities.length===0){
    rows.innerHTML = `<tr><td colspan="4" class="empty-note">Aucune activité à afficher.</td></tr>`;
    document.getElementById("budgetTotal").textContent = "0 $";
    return;
  }

  // group by academic year, preserving first-seen order; blanks grouped last
  const groups = [];
  const groupIndex = {};
  state.activities.forEach(a=>{
    const yr = (a.academicYear||"").trim() || "Année non précisée";
    if(!(yr in groupIndex)){ groupIndex[yr] = groups.length; groups.push({year:yr, items:[], subtotal:0}); }
    const g = groups[groupIndex[yr]];
    const cost = a.estimatedCost || 0;
    g.items.push(a);
    g.subtotal += cost;
  });
  groups.sort((a,b)=>{
    if(a.year==="Année non précisée") return 1;
    if(b.year==="Année non précisée") return -1;
    return a.year.localeCompare(b.year);
  });

  let grandTotal = 0;
  groups.forEach(g=>{
    g.items.forEach((a,i)=>{
      const cost = a.estimatedCost || 0;
      const tr = document.createElement("tr");
      tr.innerHTML = `<td>${i===0 ? escapeHtml(g.year) : ""}</td><td>${escapeHtml(a.title || "(sans titre)")}</td><td>${escapeHtml(catLabel(a.category))}</td><td style="text-align:right;">${cost ? cost.toLocaleString("fr-CA") + " $" : "—"}</td>`;
      rows.appendChild(tr);
    });
    const subtr = document.createElement("tr");
    subtr.innerHTML = `<td colspan="3" style="font-weight:600;border-top:1px solid var(--border);">Sous-total — ${escapeHtml(g.year)}</td><td style="text-align:right;font-weight:600;border-top:1px solid var(--border);">${g.subtotal.toLocaleString("fr-CA")} $</td>`;
    rows.appendChild(subtr);
    grandTotal += g.subtotal;
  });

  document.getElementById("budgetTotal").textContent = grandTotal.toLocaleString("fr-CA") + " $";
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
  renderSurveyComparative();
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
      if(!state.studentSurveyResponses || typeof state.studentSurveyResponses !== "object") state.studentSurveyResponses = { importedAt:"", fileName:"", perAxis:{} };
      if(!state.studentSurveyResponses.perAxis || typeof state.studentSurveyResponses.perAxis !== "object") state.studentSurveyResponses.perAxis = {};
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
        if(a.academicYear === undefined) a.academicYear = "";
        if(a.format === "colloque" || a.format === "congres") a.format = "colloque_congres";
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
