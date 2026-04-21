// ═══════════════════════════════════════════════════════
// i18n
// ═══════════════════════════════════════════════════════
const T = {
  fr: {
    helpTitle: "Comment utiliser ce calculateur",
    helpStep1: "Ce calculateur est associé au formulaire d'éco-conception. Les étudiant·e·s et les membres du jury y soumettent leurs réponses en ligne.",
    helpFormLink: "Accéder au formulaire →",
    helpStep2: "Une personne disposant d'un accès collaborateur au formulaire doit ouvrir Microsoft Forms, aller dans l'onglet Réponses, puis cliquer sur Ouvrir dans Excel pour télécharger le fichier .xlsx.",
    helpStep3: "Importez ce fichier Excel ici. Le calculateur attribue les scores automatiquement — aucune donnée n'est envoyée à un serveur.",
    uploadTitle: "Importer les réponses",
    uploadSub: "Glissez-déposez le fichier Excel exporté depuis Microsoft Forms, ou cliquez pour parcourir.",
    uploadBtn: "Choisir un fichier .xlsx",
    uploadNote: "eco-conception_*.xlsx",
    submissions: "Soumissions",
    avgTotal: "Score moyen",
    passCount: "Certifié·e·s",
    failCount: "Non certifié·e·s",
    pendingJury: "En attente du jury",
    filterAll: "Tous les profils",
    filterPass: "Certifié·e·s (≥ 85)",
    filterFail: "Non certifié·e·s (< 72)",
    filterPending: "En attente du jury",
    colName: "Étudiant·e",
    colProfile: "Profil",
    colTotal: "Total",
    colSections: "Sections",
    colJury: "Jury",
    colDate: "Date",
    sortBy: "Trier par :",
    backBtn: "← Retour au tableau de bord",
    totalScore: "Score total",
    certified: "CERTIFIÉ·E",
    notCertified: "NON CERTIFIÉ·E",
    pendingLabel: "EN ATTENTE",
    sectionConceptualization: "Conceptualisation",
    sectionFabrics: "Tissus & matériaux",
    sectionProduction: "Production & assemblage",
    sectionCare: "Entretien & fin de vie",
    maxPts: "pts max",
    juryPending: "Score du jury manquant",
    juryLabel: "Score du jury (0–15) :",
    override20: "Vêtement entièrement en récupération — section cotée à 20 pts.",
    override15: "Construction sans déchet — remplace les autres items de gaspillage.",
    overrideNoTrim: "Aucune garniture — remplace les autres items de garniture.",
    overrideNoTransfo: "Aucune transformation — remplace les autres items de transformation.",
    garmentCat: "Catégorie",
    intendedUse: "Usage",
    profile: "Profil",
    submittedOn: "Soumis le",
    avgsTitle: "Moyennes par section",
    noSubmissions: "Aucune soumission ne correspond aux filtres.",
    studentNumber: "N° étudiant·e",
  },
  en: {
    helpTitle: "How to use this calculator",
    helpStep1: "This calculator is linked to the eco-conception form. Students and jury members submit their responses online.",
    helpFormLink: "Open the form →",
    helpStep2: "Someone with collaborator access to the form must open Microsoft Forms, go to the Responses tab, click <strong>Open in Excel</strong>, then in the panel that appears choose <strong>Download a copy</strong>. Do not use the file directly from Excel online.",
    helpStep3: "Import that Excel file here. The calculator scores submissions automatically — no data is sent to any server.",
    uploadTitle: "Import responses",
    uploadSub: "Drag and drop the Excel file exported from Microsoft Forms, or click to browse.",
    uploadBtn: "Choose .xlsx file",
    uploadNote: "eco-conception_*.xlsx",
    submissions: "Submissions",
    avgTotal: "Average score",
    passCount: "Certified",
    failCount: "Not certified",
    pendingJury: "Awaiting jury",
    filterAll: "All profiles",
    filterPass: "Certified (≥ 85)",
    filterFail: "Not certified (< 72)",
    filterPending: "Awaiting jury",
    colName: "Student",
    colProfile: "Profile",
    colTotal: "Total",
    colSections: "Sections",
    colJury: "Jury",
    colDate: "Date",
    sortBy: "Sort by:",
    backBtn: "← Back to dashboard",
    totalScore: "Total score",
    certified: "CERTIFIED",
    notCertified: "NOT CERTIFIED",
    pendingLabel: "PENDING",
    sectionConceptualization: "Conceptualization",
    sectionFabrics: "Fabrics & materials",
    sectionProduction: "Production & assembly",
    sectionCare: "Care & end of use",
    maxPts: "pts max",
    juryPending: "Jury score missing",
    juryLabel: "Jury score (0–15):",
    override20: "Garment designed entirely from upcycled materials — section scored at 20 pts.",
    override15: "Zero-waste construction — overrides other waste items.",
    overrideNoTrim: "No trim selected — overrides other trim items.",
    overrideNoTransfo: "No embellishments — overrides other transformation items.",
    garmentCat: "Category",
    intendedUse: "Intended use",
    profile: "Profile",
    submittedOn: "Submitted",
    avgsTitle: "Section averages",
    noSubmissions: "No submissions match the current filters.",
    studentNumber: "Student no.",
  }
};

let lang = 'fr';
function t(k) { return T[lang][k] || T.fr[k] || k; }
function setLang(l) {
  lang = l;
  document.getElementById('btnFR').classList.toggle('active', l==='fr');
  document.getElementById('btnEN').classList.toggle('active', l==='en');
  document.documentElement.lang = l;
  updateImgDrawerLabels();
  renderAll();
}

// ═══════════════════════════════════════════════════════
// THEME
// ═══════════════════════════════════════════════════════
let dark = window.matchMedia('(prefers-color-scheme: dark)').matches;

// ── Cookie helpers ──────────────────────────────────────────────
function setCookie(name, value, days) {
  const d = new Date(); d.setTime(d.getTime() + days*24*60*60*1000);
  document.cookie = name + '=' + encodeURIComponent(value) + ';expires=' + d.toUTCString() + ';path=/;SameSite=Lax';
}
function getCookie(name) {
  const v = document.cookie.split('; ').find(r => r.startsWith(name + '='));
  return v ? decodeURIComponent(v.split('=')[1]) : null;
}

// ── Report mode state ────────────────────────────────────────────
let reportMode = getCookie('ecoscale_reportMode') || 'report'; // 'list' | 'report'
let reportNoImages = getCookie('ecoscale_noImages') === '1';

function setReportNoImages(val) {
  reportNoImages = val;
  setCookie('ecoscale_noImages', val ? '1' : '0', 365);
  renderDashboard();
}

function setReportMode(mode) {
  reportMode = mode;
  setCookie('ecoscale_reportMode', mode, 365);
  renderDashboard();
}

// ── Sort order cookie ─────────────────────────────────────────────
function saveReportSortCookie() {
  const sel = document.getElementById('reportSortKey');
  if (sel) setCookie('ecoscale_sortKey', sel.value, 365);
}
function getReportSortCookie() {
  return getCookie('ecoscale_sortKey') || 'total_desc';
}

window.addEventListener('beforeunload', e => {
  if (juryDirty) {
    e.preventDefault();
    e.returnValue = '';
  }
});
function applyTheme() {
  document.documentElement.setAttribute('data-theme', dark ? 'dark' : 'light');
  document.getElementById('themeBtn').textContent = dark ? '☀️' : '🌙';
}
function toggleTheme() { dark = !dark; applyTheme(); }
applyTheme();

// ═══════════════════════════════════════════════════════
// FILE HANDLING
// ═══════════════════════════════════════════════════════
function triggerUpload() { document.getElementById('fileInput').click(); }

function handleDragOver(e) { e.preventDefault(); document.getElementById('dropZone').classList.add('drag-over'); }
function handleDragLeave(e) { document.getElementById('dropZone').classList.remove('drag-over'); }
function handleDrop(e) {
  e.preventDefault();
  document.getElementById('dropZone').classList.remove('drag-over');
  handleFiles([...e.dataTransfer.files]);
}
function handleFile(e) { handleFiles([...e.target.files]); }
function handleFileInputChange(e) { handleFiles([...e.target.files]); }

function handleFiles(files) {
  const xlsx = files.find(f => f.name.match(/\.xlsx?$/i));
  const json = files.find(f => f.name.match(/\.json$/i));
  if (xlsx) processFile(xlsx, json);
  else if (json && allSubmissions.length) applyJuryJSON(json);
  else if (json) { pendingJuryFile = json; }
}
let pendingJuryFile = null;

let allSubmissions = [];

function processFile(file, juryFile) {
  if (juryFile) pendingJuryFile = juryFile;
  const reader = new FileReader();
  reader.onload = function(e) {
    const wb = XLSX.read(e.target.result, {type:'array'});
    const ws = wb.Sheets[wb.SheetNames[0]];
    const rows = XLSX.utils.sheet_to_json(ws, {header:1});
    if (rows.length < 2) return;
    const headers = rows[0];
    const dataRows = rows.slice(1).filter(r => r.some(c => c !== undefined && c !== ''));
    const TEST_IDS = new Set(['123456789987654321', '987654321123456789']);
    allSubmissions = dataRows
      .map(row => parseRow(headers, row))
      .filter(s => !TEST_IDS.has(String(s.studentNo).trim()));
    // Apply jury JSON if one was dropped alongside excel
    if (pendingJuryFile) { applyJuryJSON(pendingJuryFile); pendingJuryFile = null; }
    // Offer to restore autosaved jury data
    else { tryRestoreJuryAutosave(); }
    showDashboard();
  };
  reader.readAsArrayBuffer(file);
}

// ═══════════════════════════════════════════════════════
// COLUMN MAPPING (positional, anchored to col index 6)
// ═══════════════════════════════════════════════════════
// Columns 0-5: system (ID, start, end, email, name, last modified)
// Column 6 onwards: Q1..Q60 + student number at Q3 (index 8)
const COL = {
  role: 6,             // Q1
  studentName: 7,      // Q2
  studentNo: 8,        // Q3
  profile: 9,          // Q4
  garmentCat: 10,      // Q5
  intendedUse: 11,     // Q6
  useDesc: 12,         // Q7
  upcycledDesign: 13,  // Q8
  intentionalDesign: 14, // Q9
  localSourcing: 15,   // Q10
  digitalProto: 16,    // Q11
  lowWasteCutting: 17, // Q12
  lowImpactProcess: 18,// Q13
  materialSelection: 19,// Q14
  multiMaterial: 20,   // Q15
  part1: 21, part2: 22, part3: 23, part4: 24, part5: 25,
  mainFabricOrigin: 26,
  mainFabricSupplier: 27,
  mainFabricComp: 28,
  stretchContent: 29,
  liningOrigin: 30,
  liningComp: 31,
  combo1: 32, combo2: 33, combo3: 34,
  trimChoices: 35,
  transformationChoices: 36,
  interfacingMethod: 37,
  fusingJustification: 38,
  fabricCertification: 39,
  liningSupplier: 40,
  fabricPhotoPlan: 41, // now a file upload — exports as filename/URL
  durableConstruction: 42,
  wasteStrategy: 43,
  wasteDescription: 44,
  strategicPattern: 45,
  fabricQuantity: 46,
  seamTypes: 47,
  threadWeight: 48,
  threadComp: 49,
  seamJustification: 50,
  garmentPhoto: 51,
  // patternPhoto removed from form — col 52 no longer exists
  reflection: 52,      // shifted back by 1
  easilyMended: 53,    // shifted back by 1
  easilyAltered: 54,
  structurallySolid: 55,
  materialsLastLong: 56,
  accessibleCare: 57,
  compostable: 58,
  easyDisassemble: 59,
  selfAssessment: 60,
  additionalComments: 61,
  // madeFromExisting: removed from form
};

function cell(row, key) {
  const idx = COL[key];
  if (idx === undefined) return '';
  const v = row[idx];
  if (v === undefined || v === null) return '';
  return String(v).trim();
}

function isYes(v) {
  const s = String(v||'').toLowerCase();
  return s.includes('oui') || s.includes('yes');
}

function hasOption(v, keyword) {
  return String(v||'').toLowerCase().includes(keyword.toLowerCase());
}

// Multi-select: split on semicolons
function options(v) {
  return String(v||'').split(';').map(s=>s.trim()).filter(Boolean);
}

// ═══════════════════════════════════════════════════════
// SCORING ENGINE
// ═══════════════════════════════════════════════════════
function parseRow(headers, row) {
  const r = row; // raw row array
  const get = key => cell(r, key);

  const isJury = hasOption(get('role'), 'jury');

  // ── SECTION 1: Conceptualization (max 20) ──
  let s1 = 0, s1Override = false;
  const upcycled = isYes(get('upcycledDesign'));
  if (upcycled) {
    s1 = 20; s1Override = true;
  } else {
    if (isYes(get('intentionalDesign')))  s1 += 5;
    if (isYes(get('localSourcing')))       s1 += 5;
    if (isYes(get('digitalProto')))        s1 += 5;
    if (isYes(get('lowWasteCutting')))     s1 += 5;
    if (isYes(get('lowImpactProcess')))    s1 += 5;
    if (isYes(get('materialSelection')))   s1 += 3;
    // construction research column missing in this form version — skip
    s1 = Math.min(s1, 20);
  }

  // ── SECTION 2: Fabrics & materials (max 40) ──
  // Origin
  let s2Origin = 0;
  const origin = get('mainFabricOrigin');
  if (hasOption(origin,'Récupé') || hasOption(origin,'Upcycl')) s2Origin = 20;
  else if (hasOption(origin,'technique') || hasOption(origin,'Technical')) s2Origin = 10;
  else if (hasOption(origin,'Deadstock') || hasOption(origin,'deadstock')) s2Origin = 5;

  // Composition
  let s2Comp = 0;
  const comp = get('mainFabricComp');
  if (hasOption(comp,'biologique') || hasOption(comp,'organic')) s2Comp = 10;
  else if (hasOption(comp,'conventionnelles / Natural') || hasOption(comp,'Natural conventional')) s2Comp = 7;
  else if (hasOption(comp,'MMCF') || hasOption(comp,'cellulosic') || hasOption(comp,'lyocell') || hasOption(comp,'Tencel')) s2Comp = 5;
  else if (hasOption(comp,'Nouvelles') || hasOption(comp,'New synthetic') || hasOption(comp,'recyclé') || hasOption(comp,'recycled polyester')) s2Comp = 3;
  else if (hasOption(comp,'Mixtes') || hasOption(comp,'Mixed')) s2Comp = -5;
  // stretch penalty
  if (isYes(get('stretchContent'))) s2Comp -= 3;

  // Trim
  let s2Trim = 0, s2TrimOverride = false;
  const trimRaw = get('trimChoices');
  const trimOpts = options(trimRaw);
  const noTrim = trimOpts.some(o => hasOption(o,'Aucune') || hasOption(o,'No trim'));
  if (noTrim) { s2Trim = 10; s2TrimOverride = true; }
  else {
    trimOpts.forEach(o => {
      if (hasOption(o,'Compatible')) s2Trim += 5;
      else if (hasOption(o,'Minimale') || hasOption(o,'Minimal trim')) s2Trim += 5;
      else if (hasOption(o,'recyclée') || hasOption(o,'Recycled') || hasOption(o,'Upcycled trim') || hasOption(o,'récupé')) s2Trim += 5;
      else if (hasOption(o,'Deadstock trim') || hasOption(o,'deadstock')) s2Trim += 3;
      else if (hasOption(o,'amovible') || hasOption(o,'Removable')) s2Trim += 3;
      else if (hasOption(o,'toxique') || hasOption(o,'Toxic')) s2Trim -= 5;
      else if (hasOption(o,'retirer') || hasOption(o,'Hard to remove') || hasOption(o,'rivet') || hasOption(o,'illet') || hasOption(o,'snap')) s2Trim -= 5;
      else if (hasOption(o,'dégradable') || hasOption(o,'Degradable') || hasOption(o,'Velcro') || hasOption(o,'élastique')) s2Trim -= 5;
    });
  }

  // Transformation
  let s2Transfo = 0, s2TransfoOverride = false;
  const transfoRaw = get('transformationChoices');
  const transfoOpts = options(transfoRaw);
  const noTransfo = transfoOpts.some(o => hasOption(o,'Aucune') || hasOption(o,'No transformation') || hasOption(o,'No embellishment'));
  if (noTransfo) { s2Transfo = 10; s2TransfoOverride = true; }
  else {
    transfoOpts.forEach(o => {
      if (hasOption(o,'artisanaux') || hasOption(o,'DIY')) s2Transfo += 5;
      else if (hasOption(o,'naturelles') || hasOption(o,'Natural dyes')) s2Transfo += 5;
      else if (hasOption(o,'Non teint') || hasOption(o,'Undyed') || hasOption(o,'minimal transformation') || hasOption(o,'transformation minimale')) s2Transfo += 7;
      else if (hasOption(o,'Finition') || hasOption(o,'Finish') || hasOption(o,'perm-press') || hasOption(o,'waxed') || hasOption(o,'flocking')) s2Transfo -= 5;
      else if (hasOption(o,'série') || hasOption(o,'Mass-produced') || hasOption(o,'paillettes') || hasOption(o,'sequins')) s2Transfo -= 5;
      else if (hasOption(o,'combinant') || hasOption(o,'combining')) s2Transfo -= 5;
    });
  }

  // Interfacing
  let s2Interface = 0;
  const iface = get('interfacingMethod');
  const fusingJust = get('fusingJustification');
  const hasFusingJust = fusingJust && fusingJust.length > 3;
  if (hasOption(iface,'Aucun') || hasOption(iface,'None required')) s2Interface = 10;
  else if (hasOption(iface,'minimal') && (hasOption(iface,'col') || hasOption(iface,'collar'))) s2Interface = 5;
  else if ((hasOption(iface,'cousu') || hasOption(iface,'Sewn-in')) && (hasOption(iface,'même') || hasOption(iface,'same'))) s2Interface = 7;
  else if ((hasOption(iface,'cousu') || hasOption(iface,'Sewn-in')) && (hasOption(iface,'différente') || hasOption(iface,'different'))) s2Interface = 5;
  else if (hasOption(iface,'naturelle') || hasOption(iface,'natural fibre fus')) s2Interface = -3;
  else if (hasOption(iface,'entier') || hasOption(iface,'Entire fabric')) s2Interface = -5;
  else if (hasOption(iface,'synthétique') || hasOption(iface,'synthetic fibre fus')) s2Interface = hasFusingJust ? -3 : -10;
  else if (hasOption(iface,'contrecollé') || hasOption(iface,'laminé') || hasOption(iface,'Bonded') || hasOption(iface,'laminated')) s2Interface = hasFusingJust ? -3 : -10;

  const s2 = s2Origin + s2Comp + s2Trim + s2Transfo + s2Interface;

  // ── SECTION 3: Production (max 30) ──
  let s3 = 0, s3WasteOverride = false;
  if (isYes(get('durableConstruction'))) s3 += 5;

  const waste = get('wasteStrategy');
  if (hasOption(waste,'zéro déchet') || hasOption(waste,'zero-waste') || hasOption(waste,'fully-fashion') || hasOption(waste,'fully fashion') || hasOption(waste,'Aucun déchet')) {
    s3 += 15; s3WasteOverride = true;
  } else if (hasOption(waste,'récupération') || hasOption(waste,'upcycling') || hasOption(waste,'Minimal waste')) {
    if (upcycled) s3 += 10; // only if S1 upcycled
  } else if (hasOption(waste,'gérés') || hasOption(waste,'managed') || hasOption(waste,'Waste managed') || hasOption(waste,'Déchets gérés')) {
    s3 += 10;
  }

  if (isYes(get('strategicPattern'))) s3 += 5;

  

  // ── SECTION 4: Care (raw sum, display capped at 10) ──
  let s4raw = 0;
  if (isYes(get('easilyMended')))       s4raw += 3;
  if (isYes(get('structurallySolid')))  s4raw += 3;
  if (isYes(get('materialsLastLong')))  s4raw += 5;
  if (isYes(get('accessibleCare')))     s4raw += 3;
  if (isYes(get('easilyAltered')))      s4raw += 5;
  if (isYes(get('compostable')))        s4raw += 10;
  if (isYes(get('easyDisassemble')))    s4raw += 7;
  // madeFromExisting removed from form
  const s4 = Math.min(s4raw, 10);

  const total = s1 + s2 + s3 + s4;

  return {
    raw: r,
    isJury,
    studentName: get('studentName') || 'Unknown',
    studentNo: get('studentNo'),
    profile: get('profile'),
    garmentCat: get('garmentCat'),
    intendedUse: get('intendedUse'),
    useDesc: get('useDesc'),
    submittedAt: r[1] ? String(r[1]).substring(0,16) : '',
    s1, s1Override,
    s2, s2Origin, s2Comp, s2Trim, s2TrimOverride, s2Transfo, s2TransfoOverride, s2Interface,
    s3, s3_base: s3, s3WasteOverride, crochetVert: 'pending',
    s4, s4raw,
    total,
    passed: total >= passThreshold,
    upcycled,
    // raw answers for display
    intentionalDesign: isYes(get('intentionalDesign')),
    intentionalDesc: cell(r,'intentionalDesign'), // no separate desc col in this form
    localSourcing: isYes(get('localSourcing')),
    digitalProto: isYes(get('digitalProto')),
    lowWasteCutting: isYes(get('lowWasteCutting')),
    lowImpactProcess: isYes(get('lowImpactProcess')),
    materialSelection: isYes(get('materialSelection')),
    multiMaterial: get('multiMaterial'),
    parts: [get('part1'),get('part2'),get('part3'),get('part4'),get('part5')].filter(Boolean),
    mainFabricOrigin: get('mainFabricOrigin'),
    mainFabricSupplier: get('mainFabricSupplier'),
    mainFabricComp: get('mainFabricComp'),
    stretchContent: isYes(get('stretchContent')),
    liningOrigin: get('liningOrigin'),
    liningComp: get('liningComp'),
    combos: [get('combo1'),get('combo2'),get('combo3')].filter(Boolean),
    trimRaw, transfoRaw,
    interfacingMethod: get('interfacingMethod'),
    fusingJustification: get('fusingJustification'),
    fabricCertification: get('fabricCertification'),
    durableConstruction: isYes(get('durableConstruction')),
    wasteStrategy: get('wasteStrategy'),
    wasteDescription: get('wasteDescription'),
    strategicPattern: isYes(get('strategicPattern')),
    fabricQuantity: get('fabricQuantity'),
    seamTypes: get('seamTypes'),
    threadWeight: get('threadWeight'),
    threadComp: get('threadComp'),
    seamJustification: get('seamJustification'),
    reflection: get('reflection'),
    easilyMended: isYes(get('easilyMended')),
    easilyAltered: isYes(get('easilyAltered')),
    structurallySolid: isYes(get('structurallySolid')),
    materialsLastLong: isYes(get('materialsLastLong')),
    accessibleCare: isYes(get('accessibleCare')),
    compostable: isYes(get('compostable')),
    easyDisassemble: isYes(get('easyDisassemble')),
    // madeFromExisting: removed from form
    selfAssessment: isYes(get('selfAssessment')),
    additionalComments: cell(r,'additionalComments'),
    garmentPhoto: get('garmentPhoto'),
    fabricPhotoPlan: get('fabricPhotoPlan'),
  };
}

// ═══════════════════════════════════════════════════════
// STATE
// ═══════════════════════════════════════════════════════
let currentView = 'dashboard';
// Per-question image stores: filename (normalized) -> data URL
const imageStores = { q1: {}, q2: {}, q3: {} };
// Unified resolver — checks all stores
const imageStore = new Proxy({}, {
  get(_, key) {
    return imageStores.q1[key] || imageStores.q2[key] || imageStores.q3[key];
  },
  set(_, key, val) {
    // not used directly — use imageStores.qN
    return true;
  }
});
function imageStoreHas(key) {
  return !!(imageStores.q1[key] || imageStores.q2[key] || imageStores.q3[key]);
}

let printOpts = {
  showStudentList: true,
  studentListPosition: 'end',   // 'start' | 'end'
  showBreakdown: true,
}; // 'dashboard' | 'scoresheet'
let currentSubmissionIdx = -1;
let filterProfile = 'all';
let filterStatus = 'all';
let sortKey = 'total';
let sortDir = -1;
let juryScores = {};       // studentNo (or name) -> score
let juryLocked = false;    // true when loaded from JSON
let passThreshold = 72;    // configurable pass/fail threshold
let juryDirty = false;     // unsaved changes
const JURY_LS_KEY = 'ecoscale_jury_autosave';

function renderAll() {
  if (currentView === 'dashboard') renderDashboard();
  else if (currentView === 'scoresheet') renderScoresheet(currentSubmissionIdx);
}

// ═══════════════════════════════════════════════════════
// DASHBOARD VIEW
// ═══════════════════════════════════════════════════════
function showDashboard() {
  document.getElementById('uploadZone').style.display = 'none';
  document.getElementById('dashboard').style.display = 'block';
  document.getElementById('uploadBtn').style.display = 'flex';
  currentView = 'dashboard';
  renderDashboard();
  updateJuryBar();
}

function renderDashboard() {
  const students = allSubmissions.filter(s => !s.isJury);
  // Apply crochetVert decisions from juryScores store
  students.forEach(s => {
    const key = juryKey(s);
    if (juryScores[key]) s.crochetVert = juryScores[key];
  });
  const avgs = sectionAverages(students);

  // Apply jury scores (key-based)
  students.forEach((s,i) => {
    const key = juryKey(s);
    if (juryScores[key] !== undefined) {
      const v = juryScores[key];
          s.total = s.s1 + s.s2 + s.s3 + s.s4;
      s.passed = s.total >= passThreshold;
    }
  });

  // Filter
  let filtered = students.filter(s => {
    if (filterProfile !== 'all' && !s.profile.includes(filterProfile)) return false;
    if (filterStatus === 'pass' && !s.passed) return false;
    if (filterStatus === 'fail' && (s.passed || s.crochetVert==='pending')) return false;
    if (filterStatus === 'pending' && s.crochetVert !== 'pending') return false;
    return true;
  });

  // Sort
  filtered.sort((a,b) => {
    let va, vb;
    if (sortKey==='name') { va=a.studentName; vb=b.studentName; return sortDir*va.localeCompare(vb); }
    if (sortKey==='total') { va=a.total; vb=b.total; }
    else if (sortKey==='s1') { va=a.s1; vb=b.s1; }
    else if (sortKey==='s2') { va=a.s2; vb=b.s2; }
    else if (sortKey==='s3') { va=a.s3; vb=b.s3; }
    else if (sortKey==='s4') { va=a.s4; vb=b.s4; }
    else if (sortKey==='date') { va=a.submittedAt; vb=b.submittedAt; return sortDir*va.localeCompare(vb); }
    return sortDir*(va-vb);
  });

  const passCount = students.filter(s=>s.crochetVert==='granted').length;
  const failCount = students.filter(s=>s.crochetVert==='refused').length;
  const pendingCount = students.filter(s=>s.crochetVert==='pending').length;
  const avgTotal = students.length ? Math.round(students.reduce((a,s)=>a+s.total,0)/students.length) : 0;

  const profiles = [...new Set(students.map(s=>s.profile).filter(Boolean))];

  const html = `
  <div class="summary-bar">
    <div class="stat-card">
      <div class="stat-label">${t('submissions')}</div>
      <div class="stat-value">${students.length}</div>
    </div>
    <div class="stat-card">
      <div class="stat-label">${t('avgTotal')}</div>
      <div class="stat-value">${avgTotal}<span style="font-size:16px;color:var(--text3)">/85</span></div>
    </div>
    <div class="stat-card" style="border-left:3px solid var(--pass)">
      <div class="stat-label">✓ ${lang==='fr'?'Crochet vert accordé':'Crochet vert granted'}</div>
      <div class="stat-value pass">${passCount}</div>
      <div class="stat-sub">${students.length>0?Math.round(passCount/students.length*100):0}%</div>
    </div>
    <div class="stat-card" style="border-left:3px solid var(--fail)">
      <div class="stat-label">✗ ${lang==='fr'?'Crochet vert refusé':'Crochet vert refused'}</div>
      <div class="stat-value fail">${failCount}</div>
      <div class="stat-sub">${students.length>0?Math.round(failCount/students.length*100):0}%</div>
    </div>
    <div class="stat-card" style="border-left:3px solid var(--pending)">
      <div class="stat-label">◔ ${lang==='fr'?'En attente':'Pending'}</div>
      <div class="stat-value pending">${pendingCount}</div>
      <div class="stat-sub">${students.length>0?Math.round(pendingCount/students.length*100):0}%</div>
    </div>
  </div>

  <div class="section-bars">
    <div class="section-bars-title">${t('avgsTitle')}</div>
    ${sectionBarRow(t('sectionConceptualization'), avgs.s1, 20)}
    ${sectionBarRow(t('sectionFabrics'), avgs.s2, 40)}
    ${sectionBarRow(t('sectionProduction'), avgs.s3, 25)}
    ${sectionBarRow(t('sectionCare'), avgs.s4, 10)}
  </div>

  <div class="filters">
    <span class="filter-label">${t('sortBy')}</span>
    <select class="filter-select" onchange="setSort(this.value)">
      <option value="total" ${sortKey==='total'?'selected':''}>Score total</option>
      <option value="name" ${sortKey==='name'?'selected':''}>Nom</option>
      <option value="s1" ${sortKey==='s1'?'selected':''}>S1</option>
      <option value="s2" ${sortKey==='s2'?'selected':''}>S2</option>
      <option value="s3" ${sortKey==='s3'?'selected':''}>S3</option>
      <option value="s4" ${sortKey==='s4'?'selected':''}>S4</option>
      <option value="date" ${sortKey==='date'?'selected':''}>Date</option>
    </select>
    <select class="filter-select" onchange="setFilterStatus(this.value)">
      <option value="all">${t('filterAll').replace('profils','statuts').replace('profiles','statuses')}</option>
      <option value="pass">${lang==='fr'?'Certifié·e·s (≥ '+passThreshold+')':'Certified (≥ '+passThreshold+')'}</option>
      <option value="fail">${lang==='fr'?'Non certifié·e·s (< '+passThreshold+')':'Not certified (< '+passThreshold+')'}</option>
      <option value="pending">${t('filterPending')}</option>
    </select>
    ${profiles.length > 1 ? `<select class="filter-select" onchange="setFilterProfile(this.value)">
      <option value="all">${t('filterAll')}</option>
      ${profiles.map(p=>`<option value="${p}" ${filterProfile===p?'selected':''}>${p}</option>`).join('')}
    </select>` : ''}
  </div>
  <div class="print-options-bar">
    <span class="print-options-label">🖨 ${lang==='fr'?'Rapport PDF':'PDF report'}</span>
    <div class="print-toggle-group" style="border-left:none;padding-left:0">
      <span class="print-toggle-label">${lang==='fr'?'Seuil de réussite :':'Pass threshold:'}</span>
      <input type="number" min="0" max="200" step="1" value="${passThreshold}"
        style="width:52px;background:var(--surface);border:1px solid var(--border);border-radius:6px;padding:3px 7px;font-family:var(--font-display);font-size:13px;color:var(--text);text-align:center;"
        onchange="setPassThreshold(parseInt(this.value)||72)"
        title="${lang==='fr'?'Score minimum pour obtenir le crochet vert':'Minimum score to be granted the crochet vert'}">
      <span style="font-size:11px;color:var(--text3);font-family:var(--font-display)">/85</span>
    </div>

    <div class="print-toggle-group">
      <label class="toggle-switch">
        <input type="checkbox" ${printOpts.showStudentList?'checked':''} onchange="printOpts.showStudentList=this.checked">
        <span class="toggle-slider"></span>
      </label>
      <span class="print-toggle-label">${lang==='fr'?'Liste des étudiant·e·s':'Student list'}</span>
      <div class="print-position-toggle" style="${printOpts.showStudentList?'':'opacity:0.4;pointer-events:none'}">
        <button class="${printOpts.studentListPosition==='start'?'active':''}" onclick="printOpts.studentListPosition='start';renderDashboard()">${lang==='fr'?'Début':'Start'}</button>
        <button class="${printOpts.studentListPosition==='end'?'active':''}" onclick="printOpts.studentListPosition='end';renderDashboard()">${lang==='fr'?'Fin':'End'}</button>
      </div>
    </div>

    <div class="print-toggle-group">
      <label class="toggle-switch">
        <input type="checkbox" ${printOpts.showBreakdown?'checked':''} onchange="printOpts.showBreakdown=this.checked">
        <span class="toggle-slider"></span>
      </label>
      <span class="print-toggle-label">${lang==='fr'?'Détail des scores':'Score breakdown'}</span>
    </div>

    <div style="flex:1"></div>
    ${(() => {
      const fr = lang === 'fr';
      const tip = fr
        ? 'Dans OneDrive, accédez au dossier du formulaire → téléchargez et décompressez le dossier de la question correspondante.'
        : 'In OneDrive, go to the form folder → download and unzip the folder for the corresponding question.';
      function qBtn(qKey, label) {
        const store = imageStores[qKey];
        // count unique files (stored under up to 2 keys each)
        const keys = Object.keys(store);
        const uniqueCount = Math.ceil(keys.length / 2);
        const color = uniqueCount > 0 ? 'var(--pass)' : 'var(--text2)';
        const badge = uniqueCount > 0 ? ` <span style="color:var(--pass);font-family:var(--font-display);font-size:11px">✓ ${uniqueCount}</span>` : '';
        return `<span style="display:inline-flex;align-items:center;gap:4px;margin-right:6px">
          <button class="btn-print" onclick="document.getElementById('imgFileInput${qKey.toUpperCase()}').click()" style="color:${color}" title="${tip}">📷 ${label}</button>${badge}<span style="cursor:help;font-size:11px;color:var(--text3);padding:1px 5px;border:1px solid var(--border);border-radius:4px;line-height:1.6" title="${tip}">?</span>
        </span>`;
      }
      const pendingUrls = (() => {
        if (!allSubmissions.length) return 0;
        const students = allSubmissions.filter(s => !s.isJury);
        let pending = 0;
        students.forEach(s => {
          [s.garmentPhoto, s.fabricPhotoPlan].forEach(field => {
            if (!field) return;
            String(field).split(';').map(u => u.trim()).filter(Boolean).forEach(u => {
              if (!resolveImage(u)) pending++; // PDFs without PNG conversion also count as pending
            });
          });
        });
        return pending;
      })();
      const pendingBadge = pendingUrls > 0
        ? `<span style="font-size:11px;color:var(--pending);font-family:var(--font-display);margin-left:4px" title="${fr?'Images encore en attente de chargement depuis une URL':'Images still loading from a URL'}">⚠ ${pendingUrls} URL${pendingUrls>1?(fr?'s en attente':' pending'):(fr?' en attente':' pending')}</span>`
        : (allSubmissions.length && (Object.keys(imageStores.q1).length + Object.keys(imageStores.q2).length + Object.keys(imageStores.q3).length) > 0
            ? `<span style="font-size:11px;color:var(--pass);font-family:var(--font-display);margin-left:4px">✓ ${fr?'toutes les images chargées':'all images loaded'}</span>`
            : '');
      return qBtn('q1','Q1') + qBtn('q2','Q2') + qBtn('q3','Q3') + pendingBadge;
    })()}
    <div class="print-toggle-group" style="border-left:1px solid var(--border);padding-left:10px">
      <span class="print-toggle-label" style="white-space:nowrap">${lang==='fr'?'Trier le rapport :':'Report order:'}</span>
      <select class="filter-select" id="reportSortKey" style="font-size:11px;padding:4px 8px"
        onchange="saveReportSortCookie()">
        ${['total_desc','total_asc','studentNo_asc','studentNo_desc','name_asc','name_desc'].map(v => {
          const labels = {
            total_desc: lang==='fr'?'Score ↓':'Score ↓',
            total_asc:  lang==='fr'?'Score ↑':'Score ↑',
            studentNo_asc:  lang==='fr'?'N° étudiant·e ↑':'Student ID ↑',
            studentNo_desc: lang==='fr'?'N° étudiant·e ↓':'Student ID ↓',
            name_asc:  lang==='fr'?'Nom A→Z':'Name A→Z',
            name_desc: lang==='fr'?'Nom Z→A':'Name Z→A',
          };
          const saved = getReportSortCookie();
          return '<option value="'+v+'"'+(saved===v?' selected':'')+'>'+labels[v]+'</option>';
        }).join('')}
      </select>
    </div>
    <div class="print-toggle-group">
      <label class="toggle-switch">
        <input type="checkbox" ${reportNoImages?'checked':''} onchange="setReportNoImages(this.checked)">
        <span class="toggle-slider"></span>
      </label>
      <span class="print-toggle-label">${lang==='fr'?'Sans images':'No images'}</span>
    </div>
    <div class="lang-toggle" style="margin-right:4px">
      <button class="${reportMode==='list'?'active':''}" onclick="setReportMode('list')">${lang==='fr'?'📋 Liste':'📋 List'}</button>
      <button class="${reportMode==='report'?'active':''}" onclick="setReportMode('report')">${lang==='fr'?'📄 Rapport':'📄 Report'}</button>
    </div>
    <button class="btn-print" onclick="downloadHTMLReport()">
      ${lang==='fr'?(reportMode==='list'?'Générer la liste':'Générer le rapport'):(reportMode==='list'?'Generate list':'Generate report')}
    </button>
  </div>

  <div class="table-wrap">
    <table class="submissions-table">
      <thead>
        <tr>
          <th class="sortable" onclick="setSort('name')">${t('colName')} ${sortIcon('name')}</th>
          <th>${t('colProfile')}</th>
          <th class="sortable" onclick="setSort('s1')">S1 ${sortIcon('s1')}</th>
          <th class="sortable" onclick="setSort('s2')">S2 ${sortIcon('s2')}</th>
          <th class="sortable" onclick="setSort('s3')">S3 ${sortIcon('s3')}</th>
          <th class="sortable" onclick="setSort('s4')">S4 ${sortIcon('s4')}</th>
          <th class="sortable" onclick="setSort('total')">${t('colTotal')} ${sortIcon('total')}</th>
        </tr>
      </thead>
      <tbody>
        ${filtered.length === 0 ? `<tr><td colspan="7" class="empty-state">${t('noSubmissions')}</td></tr>` :
          filtered.map(s => {
            const idx = students.indexOf(s);
            const statusClass = s.crochetVert==='granted' ? 'pass' : s.crochetVert==='refused' ? 'fail' : s.passed ? 'pass' : 'fail';
            return `<tr onclick="openScoresheet(${idx})">
              <td><strong>${esc(s.studentName)}</strong>${s.crochetVert==='pending'?`<span class="badge-jury">${t('juryPending').split(' ')[0]}</span>`:''}</td>
              <td style="color:var(--text3);font-size:12px">${esc(s.profile)}</td>
              <td style="font-family:var(--font-display)">${s.s1}<span style="color:var(--text3)">/20</span></td>
              <td style="font-family:var(--font-display)">${s.s2}<span style="color:var(--text3)">/40</span></td>
              <td style="font-family:var(--font-display)">${s.s3}<span style="color:var(--text3)">/30</span></td>
              <td style="font-family:var(--font-display)">${s.s4}<span style="color:var(--text3)">/10</span></td>
              <td><span class="score-pill ${statusClass}">${s.total}/85</span></td>
            </tr>`;
          }).join('')}
      </tbody>
    </table>
  </div>`;

  document.getElementById('dashboard').innerHTML = html;
}

function sectionBarRow(label, avg, max) {
  const pct = max > 0 ? Math.max(0, Math.min(100, (avg/max)*100)) : 0;
  return `<div class="section-bar-row">
    <div class="section-bar-label">${label}</div>
    <div class="section-bar-track"><div class="section-bar-fill" style="width:${pct}%"></div></div>
    <div class="section-bar-num">${avg.toFixed(1)} / ${max}</div>
  </div>`;
}

function sectionAverages(students) {
  if (!students.length) return {s1:0,s2:0,s3:0,s4:0};
  const sum = students.reduce((a,s)=>({s1:a.s1+s.s1,s2:a.s2+s.s2,s3:a.s3+s.s3,s4:a.s4+s.s4}),{s1:0,s2:0,s3:0,s4:0});
  const n = students.length;
  return {s1:sum.s1/n, s2:sum.s2/n, s3:sum.s3/n, s4:sum.s4/n};
}

function sortIcon(key) {
  if (sortKey !== key) return '<span class="sort-icon">↕</span>';
  return `<span class="sort-icon">${sortDir===1?'↑':'↓'}</span>`;
}

function setSort(key) {
  if (sortKey === key) sortDir *= -1;
  else { sortKey = key; sortDir = -1; }
  renderDashboard();
}
function setFilterStatus(v) { filterStatus = v; renderDashboard(); }
function setFilterProfile(v) { filterProfile = v; renderDashboard(); }

// ═══════════════════════════════════════════════════════
// SCORE SHEET VIEW
// ═══════════════════════════════════════════════════════
function openScoresheet(idx) {
  currentView = 'scoresheet';
  currentSubmissionIdx = idx;
  renderScoresheet(idx);
}

function renderScoresheet(idx) {
  const students = allSubmissions.filter(s => !s.isJury);
  const s = students[idx];
  if (!s) return;

  const statusClass = s.crochetVert==='granted' ? 'pass' : s.crochetVert==='refused' ? 'fail' : s.passed ? 'pass' : 'fail';
  const statusLabel = s.juryPending ? t('pendingLabel') : s.passed ? t('certified') : t('notCertified');

  const html = `
  <div class="scoresheet">
    <button class="back-btn" onclick="backToDashboard()">${t('backBtn')}</button>

    <div class="sheet-header">
      <div class="sheet-student-info">
        <div class="sheet-name">${esc(s.studentName)}</div>
        <div class="sheet-meta">
          <strong>${t('studentNumber')}:</strong> ${esc(s.studentNo)}<br>
          <strong>${t('profile')}:</strong> ${esc(s.profile)}<br>
          <strong>${t('garmentCat')}:</strong> ${esc(s.garmentCat)}<br>
          <strong>${t('intendedUse')}:</strong> ${esc(s.intendedUse)}<br>
          <strong>${t('submittedOn')}:</strong> ${esc(s.submittedAt)}
        </div>
        ${s.useDesc ? `<div style="margin-top:10px;font-size:12px;color:var(--text3);line-height:1.5;font-style:italic">"${esc(s.useDesc)}"</div>` : ''}
      </div>
      <div class="sheet-total">
        <div class="sheet-total-num" style="color:var(--${statusClass})">${s.total}</div>
        <div class="sheet-total-label">/ 85 pts</div>
        <div class="sheet-total-status ${statusClass}">${statusLabel}</div>
      <div style="margin-top:10px;display:flex;gap:6px;flex-direction:column;align-items:center">
        <div style="font-size:11px;color:var(--text3);font-family:var(--font-display);text-transform:uppercase;letter-spacing:0.5px">${lang==='fr'?'Crochet vert':'Crochet vert'}</div>
        <div style="display:flex;gap:6px">
          ${juryLocked
            ? `<span style="font-size:13px;font-weight:600;color:${s.crochetVert==='granted'?'var(--pass)':s.crochetVert==='refused'?'var(--fail)':'var(--pending)'}">${s.crochetVert==='granted'?'✓ '+(lang==='fr'?'Accordé':'Granted'):s.crochetVert==='refused'?'✗ '+(lang==='fr'?'Refusé':'Refused'):'◔ '+(lang==='fr'?'En attente':'Pending')}</span>`
            : `<button onclick="setJuryScore(${idx},'granted')" style="padding:3px 10px;border-radius:5px;font-size:11px;font-weight:600;cursor:pointer;background:${s.crochetVert==='granted'?'var(--pass)':'transparent'};color:${s.crochetVert==='granted'?'white':'var(--pass)'};border:1.5px solid var(--pass)" onclick="event.stopPropagation()">✓ ${lang==='fr'?'Accorder':'Grant'}</button>
               <button onclick="setJuryScore(${idx},'refused')" style="padding:3px 10px;border-radius:5px;font-size:11px;font-weight:600;cursor:pointer;background:${s.crochetVert==='refused'?'var(--fail)':'transparent'};color:${s.crochetVert==='refused'?'white':'var(--fail)'};border:1.5px solid var(--fail)" onclick="event.stopPropagation()">✗ ${lang==='fr'?'Refuser':'Refuse'}</button>`
          }
        </div>
      </div>
      </div>
    </div>

    <div class="score-sections">
      ${renderS1(s)}
      ${renderS2(s)}
      ${renderS3(s, idx)}
      ${renderS4(s)}
    </div>
  </div>`;

  document.getElementById('dashboard').innerHTML = html;
}

function renderS1(s) {
  const pct = (s.s1/20)*100;
  return sectionBlock('S1', t('sectionConceptualization'), s.s1, 20, pct, `s1-body`, `
    ${s.s1Override ? `<div class="override-notice">✦ ${t('override20')}</div>` : ''}
    <div class="section-score-bar">
      <div class="section-score-bar-track"><div class="section-score-bar-fill" style="width:${pct}%"></div></div>
      <div class="section-score-bar-label">${s.s1} / 20 ${t('maxPts')}</div>
    </div>
    ${crit(s.upcycled, lang==='fr'?'Vêtement entièrement conçu à partir de récupération':'Designed entirely from upcycled garments', s.upcycled?'+20':'0')}
    ${!s.s1Override ? `
      ${crit(s.intentionalDesign, lang==='fr'?'Conception intentionnelle (modularité, intemporel, matériaux innovants)':'Intentional design approach', s.intentionalDesign?'+5':'0')}
      ${crit(s.localSourcing, lang==='fr'?'Approvisionnement local':'Local sourcing', s.localSourcing?'+5':'0')}
      ${crit(s.digitalProto, lang==='fr'?'Prototypage numérique / patrons existants':'Digital prototyping or existing patterns', s.digitalProto?'+5':'0')}
      ${crit(s.lowWasteCutting, lang==='fr'?'Coupe zéro déchet':'Low-waste cutting', s.lowWasteCutting?'+5':'0')}
      ${crit(s.lowImpactProcess, lang==='fr'?'Procédés à faible impact (teintures, finitions)':'Low-impact transformation processes', s.lowImpactProcess?'+5':'0')}
      ${crit(s.materialSelection, lang==='fr'?'Sélection appropriée des matériaux et garnitures':'Appropriate material and trim selection', s.materialSelection?'+3':'0')}
    ` : ''}
    ${s.parts.length ? `<div class="qualitative-block"><div class="qualitative-label">${lang==='fr'?'Matériaux par partie':'Materials by part'}</div><div class="qualitative-value">${s.parts.map((p,i)=>`${lang==='fr'?'Partie':'Part'} ${i+1}: ${esc(p)}`).join(' · ')}</div></div>` : ''}
  `);
}


// ── Trim & transformation full option renderers ──────────────────────────────
const TRIM_OPTIONS = [
  { kw: ['Aucune','No trim'],                                            pts: '+10', fr: 'Aucune garniture de couture',                                   en: 'No trim' },
  { kw: ['Compatible'],                                                  pts: '+5',  fr: 'Compatible avec ou fait du tissu principal',                    en: 'Compatible with or made from main fabric' },
  { kw: ['Minimale','Minimal trim'],                                     pts: '+5',  fr: 'Garniture minimale',                                            en: 'Minimal trim' },
  { kw: ['recyclée','Recycled','upcycled trim','récupé'],               pts: '+5',  fr: 'Garniture recyclée ou récupérée',                               en: 'Recycled or upcycled trim' },
  { kw: ['Deadstock trim','deadstock'],                                  pts: '+3',  fr: 'Garniture deadstock',                                           en: 'Deadstock trim' },
  { kw: ['amovible','Removable'],                                        pts: '+3',  fr: 'Garniture amovible (recyclage ou réutilisation)',                en: 'Removable trim (for recycling or repurposing)' },
  { kw: ['toxique','Toxic','colle'],                                     pts: '−5',  fr: 'Application toxique (ex. colle)',                               en: 'Toxic application (e.g. glue)' },
  { kw: ['retirer','Hard to remove','rivet','illet','snap'],             pts: '−5',  fr: 'Difficile à retirer (rivets, illets, boutons-pression)',         en: 'Hard to remove (rivets, eyelets, snap buttons)' },
  { kw: ['dégradable','Degradable','Velcro','élastique'],               pts: '−5',  fr: 'Garniture dégradable (élastique, Velcro)',                       en: 'Degradable trim (elastic, Velcro)' },
];

const TRANSFO_OPTIONS = [
  { kw: ['Aucune','No transformation','No embellishment'],               pts: '+10', fr: 'Aucune transformation',                                         en: 'No embellishments' },
  { kw: ['artisanaux','DIY'],                                            pts: '+5',  fr: 'Embellissements artisanaux',                                    en: 'DIY embellishments' },
  { kw: ['naturelles','Natural dyes'],                                   pts: '+5',  fr: 'Teintures naturelles',                                          en: 'Natural dyes' },
  { kw: ['Non teint','Undyed','minimal transformation','transformation minimale'], pts: '+7', fr: 'Non teint ou transformation minimale',              en: 'Undyed or minimal transformation' },
  { kw: ['Finition','Finish','perm-press','waxed','flocking'],           pts: '−5',  fr: 'Finition (perm-press, ciré, flocage)',                          en: 'Finish (perm-press, waxed, flocking)' },
  { kw: ['série','Mass-produced','paillettes','sequins'],                pts: '−5',  fr: 'Embellissements produits en série (ex. paillettes)',             en: 'Mass-produced embellishments (e.g. sequins)' },
  { kw: ['combinant','combining'],                                       pts: '−5',  fr: 'Transformation textile combinant différentes fibres/matériaux',   en: 'Textile transformation combining fibres or materials' },
];

function optionSelected(raw, kws) {
  const r = String(raw||'').toLowerCase();
  return kws.some(k => r.includes(k.toLowerCase()));
}

function renderTrimOptions(s, selectedOpts) {
  if (s.s2TrimOverride) {
    // Only show "no trim" as selected, rest as not applicable
    return TRIM_OPTIONS.map(o => {
      const sel = o.kw.some(k => ['Aucune','No trim'].includes(k));
      return scoredOption(sel, lang==='fr' ? o.fr : o.en, o.pts);
    }).join('');
  }
  return TRIM_OPTIONS.map(o => {
    const sel = optionSelected(s.trimRaw, o.kw);
    return scoredOption(sel, lang==='fr' ? o.fr : o.en, o.pts);
  }).join('');
}

function renderTransfoOptions(s, selectedOpts) {
  if (s.s2TransfoOverride) {
    return TRANSFO_OPTIONS.map(o => {
      const sel = o.kw.some(k => ['Aucune','No transformation','No embellishment'].includes(k));
      return scoredOption(sel, lang==='fr' ? o.fr : o.en, o.pts);
    }).join('');
  }
  return TRANSFO_OPTIONS.map(o => {
    const sel = optionSelected(s.transfoRaw, o.kw);
    return scoredOption(sel, lang==='fr' ? o.fr : o.en, o.pts);
  }).join('');
}

function renderS2(s) {
  const pct = Math.max(0,(s.s2/40))*100;
  const trimOpts = options(s.trimRaw);
  const transfoOpts = options(s.transfoRaw);
  return sectionBlock('S2', t('sectionFabrics'), s.s2, 40, pct, `s2-body`, `
    <div class="section-score-bar">
      <div class="section-score-bar-track"><div class="section-score-bar-fill" style="width:${Math.min(100,pct)}%"></div></div>
      <div class="section-score-bar-label">${s.s2} / 40 ${t('maxPts')}</div>
    </div>

    <div style="font-size:11px;font-family:var(--font-display);color:var(--text3);text-transform:uppercase;letter-spacing:0.8px;margin:12px 0 6px">${lang==='fr'?'Origine':'Origin'} (${pts(s.s2Origin)})</div>
    <div class="criterion-row">
      <div class="criterion-check yes">→</div>
      <div class="criterion-text">${esc(s.mainFabricOrigin)}${s.mainFabricSupplier?` — ${esc(s.mainFabricSupplier)}`:''}${s.fabricCertification?` [${esc(s.fabricCertification)}]`:''}</div>
      <div class="criterion-pts ${s.s2Origin>0?'pos':s.s2Origin<0?'neg':'zero'}">${pts(s.s2Origin)}</div>
    </div>

    <div style="font-size:11px;font-family:var(--font-display);color:var(--text3);text-transform:uppercase;letter-spacing:0.8px;margin:12px 0 6px">${lang==='fr'?'Composition':'Composition'} (${pts(s.s2Comp)})</div>
    <div class="criterion-row">
      <div class="criterion-check yes">→</div>
      <div class="criterion-text">${esc(s.mainFabricComp)}${s.stretchContent?` + ${lang==='fr'?'élastique':'stretch'} (−3)`:''}</div>
      <div class="criterion-pts ${s.s2Comp>0?'pos':s.s2Comp<0?'neg':'zero'}">${pts(s.s2Comp)}</div>
    </div>

    <div style="font-size:11px;font-family:var(--font-display);color:var(--text3);text-transform:uppercase;letter-spacing:0.8px;margin:12px 0 6px">${lang==='fr'?'Garnitures':'Trim'} (${pts(s.s2Trim)})</div>
    ${s.s2TrimOverride ? `<div class="override-notice" style="font-size:12px">✦ ${t('overrideNoTrim')}</div>` : ''}
    ${renderTrimOptions(s, trimOpts)}

    <div style="font-size:11px;font-family:var(--font-display);color:var(--text3);text-transform:uppercase;letter-spacing:0.8px;margin:12px 0 6px">${lang==='fr'?'Transformations':'Transformation'} (${pts(s.s2Transfo)})</div>
    ${s.s2TransfoOverride ? `<div class="override-notice" style="font-size:12px">✦ ${t('overrideNoTransfo')}</div>` : ''}
    ${renderTransfoOptions(s, transfoOpts)}

    <div style="font-size:11px;font-family:var(--font-display);color:var(--text3);text-transform:uppercase;letter-spacing:0.8px;margin:12px 0 6px">${lang==='fr'?'Entoilage':'Interfacing'} (${pts(s.s2Interface)})</div>
    <div class="criterion-row">
      <div class="criterion-check yes">→</div>
      <div class="criterion-text">${esc(s.interfacingMethod)}</div>
      <div class="criterion-pts ${s.s2Interface>0?'pos':s.s2Interface<0?'neg':'zero'}">${pts(s.s2Interface)}</div>
    </div>
    ${s.fusingJustification ? `<div class="qualitative-block"><div class="qualitative-label">${lang==='fr'?'Justification':'Justification'}</div><div class="qualitative-value">${esc(s.fusingJustification)}</div></div>` : ''}

    ${s.liningOrigin ? `<div style="margin-top:12px;font-size:12px;color:var(--text3)">${lang==='fr'?'Doublure':'Lining'}: ${esc(s.liningOrigin)} · ${esc(s.liningComp)}${s.liningSupplier?` · ${esc(s.liningSupplier)}`:''}</div>` : ''}
    ${s.combos.length ? `<div style="font-size:12px;color:var(--text3);margin-top:4px">${lang==='fr'?'Tissus compl.':'Combo fabrics'}: ${s.combos.map(esc).join(', ')}</div>` : ''}
    ${s.fabricPhotoPlan ? `<div style="font-size:12px;color:var(--text3);margin-top:4px">${lang==='fr'?'Plan tissu':'Fabric plan'}: ${s.fabricPhotoPlan.startsWith('http') ? `<a href="${esc(s.fabricPhotoPlan)}" style="color:var(--accent)" target="_blank">${lang==='fr'?'Voir le fichier':'View file'}</a>` : `<span style="color:var(--text2)">${esc(s.fabricPhotoPlan)}</span>`}</div>` : ''}
  `);
}

function renderS3(s, idx) {
  const pct = (s.s3/30)*100;
  return sectionBlock('S3', t('sectionProduction'), s.s3, 25, pct, `s3-body`, `
    <div class="section-score-bar">
      <div class="section-score-bar-track"><div class="section-score-bar-fill" style="width:${Math.min(100,pct)}%"></div></div>
      <div class="section-score-bar-label">${s.s3} / 25 ${t('maxPts')}</div>
    </div>
    ${crit(s.durableConstruction, lang==='fr'?'Construction solide et durable':'Durable construction', s.durableConstruction?'+5':'0')}
    <div class="criterion-row">
      <div class="criterion-check yes">→</div>
      <div class="criterion-text">${esc(s.wasteStrategy)}</div>
      <div class="criterion-pts ${s.s3WasteOverride?'pos':wasteScore(s)>0?'pos':'zero'}">${s.s3WasteOverride?'+15':wasteScore(s)>0?'+'+wasteScore(s):'0'}</div>
    </div>
    ${s.wasteDescription?`<div class="qualitative-block"><div class="qualitative-label">${lang==='fr'?'Gestion des déchets':'Waste management'}</div><div class="qualitative-value">${esc(s.wasteDescription)}</div></div>`:''}
    ${s.s3WasteOverride?`<div class="override-notice" style="font-size:12px">✦ ${t('override15')}</div>`:''}
    ${crit(s.strategicPattern, lang==='fr'?'Placement stratégique du patron':'Strategic pattern placement', s.strategicPattern?'+5':'0')}
    ${s.fabricQuantity?`<div style="font-size:12px;color:var(--text3);margin:4px 0 0 30px">${lang==='fr'?'Tissu utilisé':'Fabric used'}: ${esc(s.fabricQuantity)}</div>`:''}

    ${s.seamTypes?`<div class="qualitative-block" style="margin-top:8px"><div class="qualitative-label">${lang==='fr'?'Types de coutures':'Seam types'}</div><div class="qualitative-value">${esc(s.seamTypes)}</div></div>`:''}
    ${s.threadWeight?`<div style="font-size:12px;color:var(--text3);margin-top:6px">TEX: ${esc(s.threadWeight)} · ${lang==='fr'?'Fil':'Thread'}: ${esc(s.threadComp)}</div>`:''}
    ${s.seamJustification?`<div class="qualitative-block" style="margin-top:6px"><div class="qualitative-label">${lang==='fr'?'Justification coutures':'Seam justification'}</div><div class="qualitative-value">${esc(s.seamJustification)}</div></div>`:''}
    ${s.reflection?`<div class="qualitative-block" style="margin-top:6px"><div class="qualitative-label">${lang==='fr'?'Réflexion':'Reflection'}</div><div class="qualitative-value">${esc(s.reflection)}</div></div>`:''}
    ${s.garmentPhoto?`<div style="font-size:12px;color:var(--text3);margin-top:6px">${lang==='fr'?'Photo':'Photo'}: <a href="${esc(s.garmentPhoto)}" style="color:var(--accent)" target="_blank">${lang==='fr'?'Voir le lien':'View link'}</a></div>`:''}
  `);
}

function renderS4(s) {
  const pct = (s.s4/10)*100;
  return sectionBlock('S4', t('sectionCare'), s.s4, 10, pct, `s4-body`, `
    <div class="section-score-bar">
      <div class="section-score-bar-track"><div class="section-score-bar-fill" style="width:${pct}%"></div></div>
      <div class="section-score-bar-label">${s.s4} / 10 ${t('maxPts')}${s.s4raw>s.s4?` (${lang==='fr'?'brut':'raw'}: ${s.s4raw})`:''}
      </div>
    </div>
    ${crit(s.easilyMended, lang==='fr'?'Facilement réparable':'Easily mended', s.easilyMended?'+3':'0')}
    ${crit(s.structurallySolid, lang==='fr'?'Solidité structurelle':'Structurally solid', s.structurallySolid?'+3':'0')}
    ${crit(s.materialsLastLong, lang==='fr'?'Matériaux durables dans le temps':'Materials built to last', s.materialsLastLong?'+5':'0')}
    ${crit(s.accessibleCare, lang==='fr'?'Entretien accessible (pas de nettoyage à sec)':'Accessible care (no dry-cleaning)', s.accessibleCare?'+3':'0')}
    ${crit(s.easilyAltered, lang==='fr'?'Facilement modifiable pour prolonger la durée de vie':'Easily altered to extend lifespan', s.easilyAltered?'+5':'0')}
    ${crit(s.compostable, lang==='fr'?'Compostable ou biodégradable':'Compostable or biodegradable', s.compostable?'+10':'0')}
    ${crit(s.easyDisassemble, lang==='fr'?'Facile à démonter (recyclage, transformation)':'Easy to disassemble for recycling', s.easyDisassemble?'+7':'0')}

    ${s.selfAssessment!==undefined?`<div style="margin-top:12px;font-size:12px;color:var(--text3)">${lang==='fr'?'Auto-évaluation éco-conception':'Self-assessed eco-design'}: <strong style="color:${s.selfAssessment?'var(--pass)':'var(--fail)'}">${s.selfAssessment?(lang==='fr'?'Oui':'Yes'):(lang==='fr'?'Non':'No')}</strong></div>`:''}
    ${s.additionalComments?`<div class="qualitative-block" style="margin-top:8px"><div class="qualitative-label">${lang==='fr'?'Commentaires':'Comments'}</div><div class="qualitative-value">${esc(s.additionalComments)}</div></div>`:''}
  `);
}

function sectionBlock(code, title, score, max, pct, bodyId, bodyHtml) {
  return `<div class="score-section">
    <div class="score-section-header" onclick="toggleSection('${bodyId}')">
      <span class="section-code">${code}</span>
      <span class="section-title">${title}</span>
      <div class="section-score-display">
        <span class="section-score-pts">${score}</span>
        <span class="section-score-max">/${max}</span>
      </div>
      <span class="section-expand" id="${bodyId}-arrow">▼</span>
    </div>
    <div class="score-section-body open" id="${bodyId}">${bodyHtml}</div>
  </div>`;
}

function toggleSection(id) {
  const body = document.getElementById(id);
  const arrow = document.getElementById(id+'-arrow');
  if (!body) return;
  const open = body.classList.toggle('open');
  if (arrow) arrow.classList.toggle('open', open);
}

function crit(val, label, ptsVal) {
  const isPos = String(ptsVal).startsWith('+') && ptsVal !== '+0' && String(ptsVal) !== '0';
  const isNeg = String(ptsVal).startsWith('-');
  const cls = val ? 'yes' : 'no';
  const icon = val ? '✓' : '○';
  const ptsClass = val ? (isPos ? 'pos' : isNeg ? 'neg' : 'zero') : (isNeg ? 'neg-missed' : 'zero');
  return `<div class="criterion-row${val ? '' : ' crit-missed'}">
    <div class="criterion-check ${cls}">${icon}</div>
    <div class="criterion-text">${label}</div>
    <div class="criterion-pts ${ptsClass}">${ptsVal}</div>
  </div>`;
}

function scoredOption(selected, label, ptsVal) {
  const isPos = String(ptsVal).startsWith('+') && ptsVal !== '+0';
  const isNeg = String(ptsVal).startsWith('-');
  const cls = selected ? 'yes' : 'no';
  const icon = selected ? '✓' : '○';
  const ptsClass = selected ? (isPos ? 'pos' : isNeg ? 'neg' : 'zero') : (isNeg ? 'neg-missed' : 'zero');
  return `<div class="criterion-row${selected ? '' : ' crit-missed'}">
    <div class="criterion-check ${cls}">${icon}</div>
    <div class="criterion-text">${label}</div>
    <div class="criterion-pts ${ptsClass}">${ptsVal}</div>
  </div>`;
}

function pts(n) { return n > 0 ? `+${n}` : String(n); }

function wasteScore(s) {
  const w = s.wasteStrategy || '';
  if (s.s3WasteOverride) return 15;
  if (hasOption(w,'gérés') || hasOption(w,'managed')) return 10;
  if ((hasOption(w,'récupération') || hasOption(w,'upcycling') || hasOption(w,'Minimal waste')) && s.upcycled) return 10;
  return 0; // 'Déchets non gérés', 'Waste not managed', bare 'Déchets' — all score 0
}
function esc(s) { return String(s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }

function setJuryScoreByKey(key, val) {
  setCrochetVert(key, val); // routes to crochetVert system
}

function setCrochetVert(key, decision) {
  if (juryLocked) return;
  const fr = lang === 'fr';
  const students = allSubmissions.filter(s => !s.isJury);
  const s = students.find(s => juryKey(s) === key);
  if (!s) return;
  if (decision === 'granted' && s.total < passThreshold) {
    const msg = fr
      ? `Ce·tte étudiant·e a un score de ${s.total}/85, en dessous du seuil de ${passThreshold}. Confirmer l'attribution du crochet vert quand même ?`
      : `This student has a score of ${s.total}/85, below the threshold of ${passThreshold}. Confirm granting the crochet vert anyway?`;
    if (!confirm(msg)) return;
  }
  if (decision === 'refused' && s.total >= passThreshold) {
    const msg = fr
      ? `Ce·tte étudiant·e a un score de ${s.total}/85, au-dessus du seuil de ${passThreshold}. Confirmer le refus du crochet vert quand même ?`
      : `This student has a score of ${s.total}/85, above the threshold of ${passThreshold}. Confirm refusing the crochet vert anyway?`;
    if (!confirm(msg)) return;
  }
  juryScores[key] = decision;
  s.crochetVert = decision;
  markJuryDirty();
  if (document.getElementById('reportView').style.display !== 'none') {
    openReportView();
  } else {
    renderAll();
  }
}

function juryKey(s) {
  return (s.studentNo && s.studentNo !== 'nan' && s.studentNo !== '') ? s.studentNo : s.studentName;
}

function setJuryScore(idx, val) {
  const students = allSubmissions.filter(s=>!s.isJury);
  const s = students[idx];
  if (s) setCrochetVert(juryKey(s), val);
}

function markJuryDirty() {
  juryDirty = true;
  autoSaveJury();
  updateJuryBar();
}

function juryFormFingerprint() {
  // Use first student name+no as a stable fingerprint for this Excel
  const first = allSubmissions.find(s => !s.isJury);
  if (!first) return 'unknown';
  return (first.studentNo || '') + '_' + (first.studentName || '');
}

function autoSaveJury() {
  try {
    const payload = buildJuryPayload();
    payload.formFingerprint = juryFormFingerprint();
    localStorage.setItem(JURY_LS_KEY, JSON.stringify(payload));
  } catch(e) {}
}

function buildJuryPayload() {
  const students = allSubmissions.filter(s => !s.isJury);
  const scores = {};
  students.forEach(s => {
    const key = juryKey(s);
    if (s.crochetVert && s.crochetVert !== 'pending') {
      scores[key] = { crochetVert: s.crochetVert, name: s.studentName };
    }
  });
  return { savedAt: new Date().toISOString(), scores };
}

function saveJuryJSON() {
  const payload = buildJuryPayload();
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'ecoscale-jury-' + new Date().toISOString().slice(0,10) + '.json';
  a.click();
  URL.revokeObjectURL(url);
  juryDirty = false;
  updateJuryBar();
}

function applyJuryJSON(fileOrObj, lock=true) {
  function apply(data) {
    const students = allSubmissions.filter(s => !s.isJury);
    const scores = data.scores || data;
    students.forEach((s, idx) => {
      const key = juryKey(s);
      const entry = scores[key] || scores[s.studentName] || scores[s.studentNo];
      if (!entry) return;
      const cv = entry.crochetVert || 'pending';
      juryScores[key] = cv;
      s.crochetVert = cv;
          s.total = s.s1 + s.s2 + s.s3 + s.s4;
      s.passed = s.total >= passThreshold;
    });
    juryLocked = lock;
    juryDirty = false;
    updateJuryBar();
    renderAll();
    // If report view is open, rebuild it so inputs are populated
    if (document.getElementById('reportView').style.display !== 'none') {
      openReportView();
    }
  }
  if (fileOrObj instanceof File) {
    const reader = new FileReader();
    reader.onload = e => { try { apply(JSON.parse(e.target.result)); } catch(err) { alert('Invalid jury JSON file.'); } };
    reader.readAsText(fileOrObj);
  } else {
    apply(fileOrObj);
  }
}

function tryRestoreJuryAutosave() {
  try {
    const saved = localStorage.getItem(JURY_LS_KEY);
    if (!saved) return;
    const data = JSON.parse(saved);
    if (!data || !data.scores) return;
    // Check fingerprint matches current form
    if (data.formFingerprint && data.formFingerprint !== juryFormFingerprint()) return;
    const savedAt = data.savedAt ? new Date(data.savedAt).toLocaleString() : '?';
    const fr = lang === 'fr';
    const msg = fr
      ? `Des scores du jury ont été sauvegardés automatiquement le ${savedAt}. Voulez-vous les restaurer ?`
      : `Jury scores were auto-saved on ${savedAt}. Would you like to restore them?`;
    if (confirm(msg)) applyJuryJSON(data, false);
  } catch(e) {}
}

function setPassThreshold(val) {
  passThreshold = Math.max(0, Math.min(200, val || 72));
  // Recompute passed for all students
  allSubmissions.filter(s => !s.isJury).forEach(s => {
    s.passed = s.total >= passThreshold;
  });
  renderAll();
  updateJuryBar();
}

function unlockJury() {
  juryLocked = false;
  updateJuryBar();
  renderAll();
}

function resetJuryScores() {
  const fr = lang === 'fr';
  const msg = fr
    ? 'Êtes-vous sûr·e de vouloir réinitialiser tous les scores du jury ? Cette action est irréversible.'
    : 'Are you sure you want to reset all jury scores? This cannot be undone.';
  if (!confirm(msg)) return;
  juryScores = {};
  juryDirty = false;
  try { localStorage.removeItem(JURY_LS_KEY); } catch(e) {}
  allSubmissions.filter(s => !s.isJury).forEach(s => {
    s.crochetVert = 'pending';
    delete juryScores[juryKey(s)];
  });
  updateJuryBar();
  renderAll();
}

function updateJuryBar() {
  const bar = document.getElementById('juryBar');
  if (bar) bar.remove();
  if (!allSubmissions.length) return;
  const fr = lang === 'fr';
  const newBar = document.createElement('div');
  newBar.id = 'juryBar';
  newBar.style.cssText = 'position:sticky;top:60px;z-index:90;background:' +
    (juryLocked ? 'rgba(27,139,90,0.92)' : 'rgba(196,122,0,0.92)') +
    ';backdrop-filter:blur(8px);padding:7px 20px;display:flex;align-items:center;gap:12px;flex-wrap:wrap;';
  const pendingCount = allSubmissions.filter(s=>!s.isJury&&s.crochetVert==='pending').length;
  if (juryLocked) {
    newBar.innerHTML = `<span style="font-size:12px;color:white;flex:1">🔒 ${fr?'Scores du jury chargés et verrouillés':'Jury scores loaded and locked'}</span>
      <button onclick="unlockJury()" style="background:rgba(255,255,255,0.2);border:1px solid rgba(255,255,255,0.3);color:white;border-radius:6px;padding:4px 12px;font-size:12px;cursor:pointer">${fr?'Ajuster les scores du jury':'Adjust jury scores'}</button>`;
  } else {
    newBar.innerHTML = `<span style="font-size:12px;color:white;flex:1">🎯 ${fr?'Mode saisie jury':'Jury entry mode'}${pendingCount>0?' — '+pendingCount+' '+(fr?'manquant(s)':'pending'):' ✓'}</span>
      ${juryDirty ? `<span style="font-size:11px;color:rgba(255,255,255,0.8)">${fr?'● Modifications non sauvegardées':'● Unsaved changes'}</span>` : '<span style="font-size:11px;color:rgba(255,255,255,0.8)">✓ '+(fr?'Sauvegardé':'Saved')+'</span>'}
      <button onclick="saveJuryJSON()" style="background:white;color:#7A4800;border:none;border-radius:6px;padding:4px 12px;font-size:12px;font-weight:600;cursor:pointer">${fr?'💾 Sauvegarder JSON':'💾 Save JSON'}</button>`;
  }
  // Insert after header
  const header = document.querySelector('header');
  if (header) header.insertAdjacentElement('afterend', newBar);
}

function backToDashboard() {
  currentView = 'dashboard';
  renderDashboard();
  window.scrollTo(0,0);
}

// Update i18n on static elements
function updateStaticI18n() {
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    const val = T[lang][key];
    if (!val) return;
    // help steps contain <strong> and <a> — use innerHTML carefully
    if (key.startsWith('helpStep')) {
      const link = el.querySelector('.help-link');
      el.childNodes.forEach(n => { if (n.nodeType === 3) n.textContent = val + ' '; });
      if (link) {
        const linkKey = 'helpFormLink';
        link.textContent = T[lang][linkKey] || link.textContent;
      }
    } else {
      el.textContent = val;
    }
  });
}

// Override renderAll to also update static
const _renderAll = renderAll;
window.renderAll = function() {
  updateStaticI18n();
  _renderAll();
};

// hasOption needed in render context
function hasOption(v, kw) { return String(v||'').toLowerCase().includes(kw.toLowerCase()); }
// ═══════════════════════════════════════════════════════
// PRINT VIEW
// ═══════════════════════════════════════════════════════
function toggleImgDrawer() {
  const body = document.getElementById('imgDrawerBody');
  body.style.display = body.style.display === 'none' ? 'block' : 'none';
}

function updateImgDrawerLabels() {
  const fr = lang === 'fr';
  const title = document.getElementById('imgDrawerTitle');
  const toggle = document.getElementById('imgDrawerToggle');
  const label = document.getElementById('imgDropLabel');
  if (title) title.textContent = '📷 ' + (fr ? 'Photos des vêtements' : 'Garment photos');
  if (toggle) toggle.textContent = fr ? 'Afficher / Masquer' : 'Show / Hide';
  if (label) label.innerHTML = fr
    ? '<strong>Glissez les photos ici</strong> ou cliquez pour parcourir.<br>Téléchargez tous les fichiers image soumis via le formulaire et déposez-les ici — le calculateur les associe automatiquement par nom de fichier.'
    : '<strong>Drop photos here</strong> or click to browse.<br>Download all image files submitted via the form and drop them here — the calculator matches them automatically by filename.';
  updateImgStats();
}

function updateImgStats() {
  const students = allSubmissions.filter(s => !s.isJury);

  // Build missing list and also log which store just got updated
  const missing = [];
  students.forEach(s => {
    [s.garmentPhoto, s.fabricPhotoPlan].forEach(field => {
      if (!field) return;
      String(field).split(';').map(u => u.trim()).filter(Boolean).forEach(u => {
        if (!resolveImage(u)) {
          const fname = normalizeKey(u.split('/').pop().split('?')[0]);
          missing.push(fname);
        }
      });
    });
  });

  // Per-folder summary
  ['q1','q2','q3'].forEach(qKey => {
    const s = countStoreStats(qKey);
    if (s.matched === 0) return;
    const folder = qKey.toUpperCase();
    if (s.matched >= s.total) {
      console.log('EcoScale ' + folder + ' — all matched ✓ (' + s.matched + '/' + s.total + ')');
    } else {
      console.log('EcoScale ' + folder + ' — ' + s.matched + '/' + s.total + ' matched');
    }
  });

  if (missing.length) {
    console.group('EcoScale — missing images (' + missing.length + ')');
    missing.forEach(f => console.log(f));
    console.groupEnd();
  } else {
    const totalLoaded = Object.keys(imageStores.q1).length + Object.keys(imageStores.q2).length + Object.keys(imageStores.q3).length;
    if (totalLoaded > 0) console.log('EcoScale — all images matched ✓');
  }

  renderAll();
}

function imgDragOver(e) {
  e.preventDefault();
  document.getElementById('imgDropZone').classList.add('drag-over');
}
function imgDragLeave(e) {
  document.getElementById('imgDropZone').classList.remove('drag-over');
}
function imgDrop(e) {
  e.preventDefault();
  document.getElementById('imgDropZone').classList.remove('drag-over');
  const files = [...e.dataTransfer.items]
    .filter(i => i.kind === 'file')
    .map(i => i.getAsFile())
    .filter(f => f && f.type.startsWith('image/'));
  handleImgFiles(files);
}

function normalizeKey(str) {
  let decoded = str;
  try { decoded = decodeURIComponent(str); } catch(e) {}
  if (decoded.includes('%')) {
    try { decoded = decodeURIComponent(decoded); } catch(e) {}
  }
  // Keep only a-z, 0-9, dot — strip everything else
  // Both URL and file.name go through same stripping, encoding-agnostic
  let result = '';
  for (let i = 0; i < decoded.length; i++) {
    const c = decoded.charCodeAt(i);
    if ((c >= 48 && c <= 57) || (c >= 65 && c <= 90) || (c >= 97 && c <= 122) || c === 46) {
      result += decoded[i];
    }
  }
  return result.toLowerCase();
}

function handleImgFiles(files) { handleImgFilesQ(files, 'q1'); }

function handleImgFilesQ(files, qKey) {
  const store = imageStores[qKey];
  const arr = [...files].filter(f => f.type.startsWith('image/') || f.type === 'application/pdf' || f.name.toLowerCase().endsWith('.pdf'));
  if (!arr.length) return;
  let loaded = 0;
  arr.forEach(file => {
    const reader = new FileReader();
    reader.onload = e => {
      const key = normalizeKey(file.name);
      // Warn on collision (two different files with same alphanumeric key)
      if (store[key] && store[key] !== e.target.result) {
        console.warn('EcoScale — filename collision:', file.name, '→', key);
      }
      store[key] = e.target.result;
      // Stem-only key: for PDF→PNG same-stem conversion
      const stemKey = key.replace(/[^a-z0-9]/g, '') === key
        ? key.replace(/[.][^.]+$/, '')   // already clean, just strip extension
        : key.replace(/[.][^.]+$/, '');  // strip extension
      if (stemKey && stemKey !== key) store[stemKey] = e.target.result;
      // ImageMagick multi-page: strip trailing digit suffix
      const magickStem = stemKey.replace(/0$|1$|2$|3$|4$|5$|6$|7$|8$|9$/, '').replace(/0$|1$|2$|3$|4$|5$|6$|7$|8$|9$/, '');
      if (magickStem && magickStem !== stemKey) store[magickStem] = e.target.result;
      loaded++;
      if (loaded === arr.length) { updateImgStats(); renderAll(); }
    };
    reader.readAsDataURL(file);
  });
}

function filenameFromUrl(url) {
  const keys = [];
  String(url || '').split(';').forEach(u => {
    try {
      const key = normalizeKey(u.trim().split('/').pop().split('?')[0]);
      if (!key) return;
      keys.push(key);
      // stem without extension (for PDF→PNG matching)
      const stem = key.replace(/[.][^.]+$/, '');
      if (stem && stem !== key) keys.push(stem);
      // strip trailing digits (ImageMagick page suffix: -0, -1 become just digits after our strip)
      const noDigitEnd = stem.replace(/\d+$/, '');
      if (noDigitEnd && noDigitEnd !== stem) keys.push(noDigitEnd);
    } catch(e) {}
  });
  return [...new Set(keys)];
}

function resolveImage(url) {
  const names = filenameFromUrl(url);
  let pdfResult = null;
  for (const name of names) {
    const dataUrl = imageStores.q1[name] || imageStores.q2[name] || imageStores.q3[name];
    if (dataUrl) {
      // Prefer image over PDF — if this is a PDF data URL, keep looking for a better match
      if (dataUrl.startsWith('data:application/pdf') || dataUrl.startsWith('data:application/octet')) {
        if (!pdfResult) pdfResult = { dataUrl, name };
      } else {
        return { dataUrl, name }; // image found — return immediately
      }
    }
  }
  return pdfResult; // fall back to PDF only if no image found
}

// Returns ALL matched images for a URL — handles multi-page PDFs converted to PNG
// ImageMagick produces stem-0.png, stem-1.png, stem-2.png ...
function resolveAllImages(url) {
  const primary = resolveImage(url);
  if (!primary) return [];

  // Check if primary was matched via a stem (no extension or with -N suffix stripped)
  // If so, look for stem-0, stem-1, stem-2... until we hit a gap
  const stem = primary.name.replace(/\.[^.]+$/, '').replace(/-\d+$/, '');
  const results = [primary];

  // Collect all stem-N.* keys from all stores
  const allKeys = [
    ...Object.keys(imageStores.q1),
    ...Object.keys(imageStores.q2),
    ...Object.keys(imageStores.q3),
  ];
  // Find keys that match stem-N pattern (ImageMagick pages)
  const pageKeys = allKeys
    .filter(k => {
      const kStem = k.replace(/\.[^.]+$/, '').replace(/-\d+$/, '');
      return kStem === stem && k !== primary.name;
    })
    .sort((a, b) => {
      // Sort by page number
      const na = parseInt((a.match(/-(\d+)\.[^.]+$/) || [])[1] ?? 0);
      const nb = parseInt((b.match(/-(\d+)\.[^.]+$/) || [])[1] ?? 0);
      return na - nb;
    });

  // Deduplicate by stem (same filename = same image regardless of store or compression)
  const seenStems = new Set([stem]);
  const seenDataUrls = new Set([primary.dataUrl]);
  for (const k of pageKeys) {
    const kStem = k.replace(/\.[^.]+$/, '').replace(/-\d+$/, '');
    if (seenStems.has(kStem)) continue;
    const dataUrl = imageStores.q1[k] || imageStores.q2[k] || imageStores.q3[k];
    if (dataUrl && !seenDataUrls.has(dataUrl)) {
      seenStems.add(kStem);
      seenDataUrls.add(dataUrl);
      results.push({ dataUrl, name: k });
    }
  }
  return results;
}

function countImageStats() {
  const students = allSubmissions.filter(s => !s.isJury);
  let totalUrls = 0, matched = 0;
  students.forEach(s => {
    [s.garmentPhoto, s.fabricPhotoPlan].forEach(field => {
      if (!field) return;
      String(field).split(';').map(u => u.trim()).filter(Boolean).forEach(u => {
        totalUrls++;
        if (resolveImage(u)) matched++;
      });
    });
  });
  return { totalUrls, matched, missing: totalUrls - matched };
}

function countStoreStats(qKey) {
  const store = imageStores[qKey];
  // Count unique files loaded — track by stem to handle multiple keys per file
  const seenStems = new Set();
  Object.keys(store).forEach(k => {
    // Normalise to stem to deduplicate (decoded key, raw key, stem key all map to same file)
    const stem = k.replace(/\.[^.]+$/, '').replace(/-\d+$/, '');
    seenStems.add(stem || k);
  });
  const loaded = seenStems.size;
  // Count how many submission URLs this store resolves
  const students = allSubmissions.filter(s => !s.isJury);
  let matched = 0;
  const seen = new Set();
  students.forEach(s => {
    [s.garmentPhoto, s.fabricPhotoPlan].forEach(field => {
      if (!field) return;
      String(field).split(';').map(u => u.trim()).filter(Boolean).forEach(u => {
        if (seen.has(u)) return;
        const names = filenameFromUrl(u);
        if (names.some(n => store[n])) { matched++; seen.add(u); }
      });
    });
  });
  // total = all unique submission image URLs
  const allUrls = new Set();
  students.forEach(s => {
    [s.garmentPhoto, s.fabricPhotoPlan].forEach(field => {
      if (!field) return;
      String(field).split(';').map(u => u.trim()).filter(Boolean).forEach(u => allUrls.add(u));
    });
  });
  return { loaded, matched, total: allUrls.size };
}

function countMissingImages() {
  return countImageStats().missing;
}


const PRINT_STYLES = `<style>
:root {
  --blue:       #00587C;
  --blue-dim:   #004561;
  --blue-glow:  rgba(0,88,124,0.18);
  --green:      #1B8B5A;
  --green-dim:  #166f47;
  --amber:      #C47A00;
  --red:        #C0392B;
  --pass:       #1B8B5A;
  --fail:       #C0392B;
  --pending:    #C47A00;

  /* Light mode */
  --bg:         #F5F3EE;
  --bg2:        #EDEAE3;
  --bg3:        #E3DFD6;
  --surface:    #FFFFFF;
  --surface2:   #F9F8F5;
  --border:     rgba(0,0,0,0.10);
  --border2:    rgba(0,0,0,0.06);
  --text:       #0F1A20;
  --text2:      #3D4F58;
  --text3:      #6B7E88;
  --accent:     var(--blue);
  --accent-fg:  #FFFFFF;

  --radius:     10px;
  --radius-lg:  16px;
  --shadow:     0 2px 12px rgba(0,0,0,0.08), 0 1px 3px rgba(0,0,0,0.06);
  --shadow-lg:  0 8px 32px rgba(0,0,0,0.12), 0 2px 8px rgba(0,0,0,0.08);

  --font-display: 'DM Mono', monospace;
  --font-body:    'DM Sans', system-ui, sans-serif;

  --transition: 0.18s cubic-bezier(0.4,0,0.2,1);
}

[data-theme="dark"] {
  --bg:         #0A1419;
  --bg2:        #0F1E25;
  --bg3:        #162530;
  --surface:    #162530;
  --surface2:   #1C2F3C;
  --border:     rgba(255,255,255,0.09);
  --border2:    rgba(255,255,255,0.05);
  --text:       #EAF0F3;
  --text2:      #A8BFC8;
  --text3:      #6A8A98;
  --accent:     #3AABCF;
  --accent-fg:  #0A1419;
  --blue:       #3AABCF;
  --blue-glow:  rgba(58,171,207,0.15);
  --green:      #2ECC8A;
  --amber:      #F0A830;
  --red:        #E05C4A;
  --pass:       #2ECC8A;
  --fail:       #E05C4A;
  --pending:    #F0A830;
}

/* ── RESET ── */
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
html { font-size: 16px; }
body {
  font-family: var(--font-body);
  background: var(--bg);
  color: var(--text);
  min-height: 100vh;
  transition: background var(--transition), color var(--transition);
  -webkit-font-smoothing: antialiased;
}

/* ── PROGRESS OVERLAY ── */
.progress-overlay {
  position: fixed; inset: 0; z-index: 500;
  background: rgba(0,0,0,0.55);
  backdrop-filter: blur(4px);
  display: flex; align-items: center; justify-content: center;
  animation: fadeIn 0.15s ease;
}
.progress-card {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  padding: 28px 32px;
  min-width: 320px; max-width: 420px; width: 90%;
  box-shadow: var(--shadow-lg);
  text-align: center;
}
.progress-title {
  font-size: 15px; font-weight: 600; color: var(--text);
  margin-bottom: 6px;
}
.progress-sub {
  font-size: 12px; color: var(--text3);
  margin-bottom: 20px; line-height: 1.5;
}
.progress-track {
  height: 8px; background: var(--bg2);
  border-radius: 4px; overflow: hidden;
  margin-bottom: 10px;
}
.progress-fill {
  height: 100%; border-radius: 4px;
  background: var(--accent);
  transition: width 0.2s ease;
  width: 0%;
}
.progress-pct {
  font-family: var(--font-display);
  font-size: 13px; color: var(--text3);
}

/* ── PRINT OPTIONS ── */
/* ── PRINT OPTIONS ── */
/* ── PRINT OPTIONS ── */
.print-options-bar {
  display: flex; align-items: center; gap: 8px; flex-wrap: wrap;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 10px 14px;
  margin-bottom: 16px;
  box-shadow: var(--shadow);
}
.print-options-label {
  font-family: var(--font-display);
  font-size: 10px; font-weight: 500;
  color: var(--text3);
  text-transform: uppercase; letter-spacing: 0.8px;
  white-space: nowrap; margin-right: 4px;
}
.print-toggle-group {
  display: flex; align-items: center; gap: 6px;
  padding: 0 10px;
  border-left: 1px solid var(--border);
}
.print-toggle-group:first-of-type { border-left: none; padding-left: 0; }
.print-toggle-label {
  font-size: 12px; color: var(--text2); white-space: nowrap;
}
.toggle-switch {
  position: relative; width: 32px; height: 18px; flex-shrink: 0;
}
.toggle-switch input { opacity: 0; width: 0; height: 0; }
.toggle-slider {
  position: absolute; inset: 0; cursor: pointer;
  background: var(--bg3); border-radius: 18px;
  transition: background var(--transition);
}
.toggle-slider::before {
  content: ''; position: absolute;
  width: 12px; height: 12px; border-radius: 50%;
  background: white; left: 3px; top: 3px;
  transition: transform var(--transition);
  box-shadow: 0 1px 3px rgba(0,0,0,0.2);
}
.toggle-switch input:checked + .toggle-slider { background: var(--accent); }
.toggle-switch input:checked + .toggle-slider::before { transform: translateX(14px); }

.print-position-toggle {
  display: flex;
  border: 1px solid var(--border);
  border-radius: 6px; overflow: hidden;
}
.print-position-toggle button {
  padding: 4px 10px; background: transparent; border: none;
  font-size: 11px; font-family: var(--font-display);
  color: var(--text3); cursor: pointer;
  transition: all var(--transition);
}
.print-position-toggle button.active {
  background: var(--accent); color: var(--accent-fg);
}

/* ── PRINT ── */
.btn-print {
  display: inline-flex; align-items: center; gap: 8px;
  background: var(--surface); border: 1px solid var(--border);
  border-radius: var(--radius); padding: 7px 14px;
  font-size: 13px; color: var(--text2); font-family: var(--font-body);
  cursor: pointer; transition: all var(--transition);
}
.btn-print:hover { background: var(--bg2); color: var(--text); }

@media print {
  @page { margin: 16mm 14mm; size: A4; }
  * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }

  header, .filters, .summary-bar, .section-bars,
  .table-wrap, .back-btn, .btn-print, .btn-icon,
  .lang-toggle, .header-controls, .upload-zone,
  .jury-input-block, .help-block,
  .print-instruction-bar { display: none !important; }

  body { background: white !important; color: #0F1A20 !important; }
  main { padding: 0 !important; max-width: 100% !important; }

  .print-view { display: block !important; }
  .print-card { page-break-after: always; }
  .print-card:last-child { page-break-after: avoid; }

  .print-score-section { page-break-inside: avoid; }
  .score-section-body { display: block !important; }

  a { color: #00587C !important; }
}

.print-view { display: none; }

.print-card {
  background: white;
  padding: 32px 28px;
  font-family: 'DM Sans', system-ui, sans-serif;
}
.print-card-header {
  display: flex; justify-content: space-between; align-items: flex-start;
  border-bottom: 3px solid #00587C;
  padding-bottom: 16px; margin-bottom: 20px;
}
.print-student-name {
  font-size: 22px; font-weight: 700; color: #0F1A20;
  letter-spacing: -0.5px;
}
.print-student-meta {
  font-size: 12px; color: #5A6470; margin-top: 4px; line-height: 1.7;
}
.print-total-block { text-align: right; }
.print-total-num {
  font-family: 'DM Mono', monospace;
  font-size: 48px; font-weight: 500; line-height: 1;
  letter-spacing: -2px;
}
.print-total-num.pass { color: #1B8B5A; }
.print-total-num.fail { color: #C0392B; }
.print-total-num.pending { color: #C47A00; }
.print-total-label { font-size: 11px; color: #5A6470; font-family: 'DM Mono', monospace; }
.print-status-badge {
  display: inline-block; font-family: 'DM Mono', monospace;
  font-size: 10px; font-weight: 500; letter-spacing: 0.5px;
  padding: 3px 10px; border-radius: 20px; margin-top: 6px;
}
.print-status-badge.pass { background: rgba(27,139,90,0.1); color: #1B8B5A; }
.print-status-badge.fail { background: rgba(192,57,43,0.1); color: #C0392B; }
.print-status-badge.pending { background: rgba(196,122,0,0.1); color: #C47A00; }

.print-sections {
  display: grid; grid-template-columns: 1fr 1fr;
  gap: 12px; margin-bottom: 20px;
}
.print-section-block {
  background: #F5F3EE; border-radius: 8px; padding: 12px 14px;
}
.print-section-code {
  font-family: 'DM Mono', monospace; font-size: 10px;
  font-weight: 500; color: white; background: #00587C;
  padding: 2px 7px; border-radius: 4px; display: inline-block;
  margin-bottom: 6px; letter-spacing: 0.5px;
}
.print-section-title { font-size: 12px; color: #3D4F58; margin-bottom: 8px; }
.print-section-score {
  font-family: 'DM Mono', monospace;
  font-size: 22px; font-weight: 500; color: #0F1A20;
  letter-spacing: -0.5px;
}
.print-section-max { font-size: 11px; color: #6B7E88; }
.print-section-bar-track {
  height: 5px; background: #E3DFD6; border-radius: 3px;
  margin-top: 8px; overflow: hidden;
}
.print-section-bar-fill { height: 100%; border-radius: 3px; background: #00587C; }

.print-photo-block {
  border: 1px solid #E3DFD6; border-radius: 8px;
  padding: 12px 16px; margin-bottom: 20px;
  background: #F5F3EE;
}
.print-photo-label {
  font-family: 'DM Mono', monospace; font-size: 10px;
  color: #6B7E88; text-transform: uppercase; letter-spacing: 0.8px;
  margin-bottom: 6px;
}
.print-photo-link { font-size: 12px; color: #00587C; word-break: break-all; }
.print-login-note {
  font-size: 11px; color: #C47A00; margin-top: 6px;
  font-style: italic;
}

.print-divider {
  border: none; border-top: 2px solid #00587C;
  margin: 40px 0 32px;
}
.print-breakdown-title {
  font-family: 'DM Mono', monospace; font-size: 13px; font-weight: 500;
  color: #00587C; text-transform: uppercase; letter-spacing: 0.8px;
  margin-bottom: 4px;
}
.print-breakdown-sub {
  font-size: 12px; color: #6B7E88; margin-bottom: 24px;
}
.print-score-section {
  margin-bottom: 20px; page-break-inside: avoid;
}
.print-score-section-header {
  display: flex; align-items: center; gap: 10px;
  background: #F2F4F5; border-radius: 6px;
  padding: 8px 12px; margin-bottom: 8px;
}
.print-criterion-row {
  display: flex; align-items: flex-start; gap: 10px;
  padding: 5px 0; border-bottom: 1px solid #F2F4F5;
  font-size: 11px;
}
.print-criterion-row:last-child { border-bottom: none; }
.print-criterion-check {
  width: 16px; height: 16px; border-radius: 3px;
  display: flex; align-items: center; justify-content: center;
  font-size: 9px; flex-shrink: 0; margin-top: 1px;
}
.print-criterion-check.yes { background: rgba(27,139,90,0.12); color: #1B8B5A; }
.print-criterion-check.no  { background: #F2F4F5; color: #6B7E88; }
.print-criterion-text { flex: 1; color: #3D4F58; line-height: 1.4; }
.print-criterion-pts { font-family: 'DM Mono', monospace; font-size: 11px; flex-shrink: 0; }
.print-criterion-pts.pos { color: #1B8B5A; font-weight: 500; }
.print-criterion-pts.neg { color: #C0392B; font-weight: 500; }
.print-criterion-pts.zero { color: #6B7E88; }
.print-qual-block {
  background: #F5F3EE; border-radius: 6px;
  padding: 8px 10px; margin: 6px 0 6px 26px;
  font-size: 11px; color: #5A6470; font-style: italic; line-height: 1.5;
}

.print-student-separator {
  border: none; border-top: 1px dashed #D8DDE2;
  margin: 32px 0;
}

/* instruction bar */
.print-instruction-bar {
  position: sticky; top: 0; z-index: 200;
  background: #00587C;
  box-shadow: 0 2px 12px rgba(0,0,0,0.2);
}
.print-instruction-content {
  max-width: 1280px; margin: 0 auto;
  padding: 12px 20px;
  display: flex; align-items: center; justify-content: space-between;
  gap: 16px; flex-wrap: wrap;
}
.print-instruction-steps {
  display: flex; align-items: center; gap: 10px;
  flex-wrap: wrap; flex: 1;
}
.print-instruction-title {
  font-family: 'DM Mono', monospace;
  font-size: 11px; font-weight: 500;
  color: rgba(255,255,255,0.7);
  text-transform: uppercase; letter-spacing: 0.8px;
  white-space: nowrap;
}
.print-instruction-sep { color: rgba(255,255,255,0.3); font-size: 14px; }
.print-instruction-step {
  font-size: 12px; color: rgba(255,255,255,0.9);
  display: flex; align-items: center; gap: 6px;
}
.print-step-num {
  width: 18px; height: 18px; border-radius: 50%;
  background: rgba(255,255,255,0.2);
  display: inline-flex; align-items: center; justify-content: center;
  font-family: 'DM Mono', monospace; font-size: 10px; font-weight: 500;
  color: white; flex-shrink: 0;
}
.print-kbd {
  display: inline-block;
  background: rgba(255,255,255,0.15);
  border: 1px solid rgba(255,255,255,0.25);
  border-radius: 4px; padding: 1px 6px;
  font-family: 'DM Mono', monospace; font-size: 11px; color: white;
}
.print-kbd-mac {
  display: inline-block;
  background: rgba(255,255,255,0.15);
  border: 1px solid rgba(255,255,255,0.25);
  border-radius: 4px; padding: 1px 6px;
  font-family: 'DM Mono', monospace; font-size: 11px; color: white;
}
.print-instruction-actions {
  display: flex; align-items: center; gap: 8px; flex-shrink: 0;
}
.print-now-btn {
  background: white; color: #00587C;
  border: none; border-radius: 8px;
  padding: 7px 14px; font-size: 13px; font-weight: 600;
  font-family: 'DM Sans', sans-serif;
  cursor: pointer; transition: opacity 0.15s;
  white-space: nowrap;
}
.print-now-btn:hover { opacity: 0.88; }
.print-back-btn {
  background: rgba(255,255,255,0.12);
  color: rgba(255,255,255,0.9);
  border: 1px solid rgba(255,255,255,0.25);
  border-radius: 8px; padding: 7px 14px;
  font-size: 13px; font-family: 'DM Sans', sans-serif;
  cursor: pointer; transition: background 0.15s;
  white-space: nowrap;
}
.print-back-btn:hover { background: rgba(255,255,255,0.2); }

.print-instruction-top {
  display: flex; align-items: center; justify-content: space-between;
  flex-wrap: wrap; gap: 12px;
  padding: 12px 20px; max-width: 1280px; margin: 0 auto;
  border-bottom: 1px solid rgba(255,255,255,0.12);
}
.print-instruction-headline { display: flex; flex-direction: column; gap: 2px; }
.print-instruction-title {
  font-size: 14px; font-weight: 600; color: white;
  font-family: 'DM Sans', sans-serif;
}
.print-instruction-hint {
  font-size: 11px; color: rgba(255,255,255,0.6);
  font-family: 'DM Mono', monospace;
}
.print-instruction-body {
  max-width: 1280px; margin: 0 auto;
  padding: 10px 20px 14px;
  display: flex; align-items: flex-start; gap: 16px; flex-wrap: wrap;
}
.browser-tabs {
  display: flex; gap: 6px; flex-shrink: 0; flex-wrap: wrap; padding-top: 2px;
}
.browser-tab {
  background: rgba(255,255,255,0.1);
  border: 1px solid rgba(255,255,255,0.2);
  border-radius: 6px; padding: 5px 12px;
  font-size: 12px; color: rgba(255,255,255,0.75);
  font-family: 'DM Sans', sans-serif;
  cursor: pointer; transition: all 0.15s; white-space: nowrap;
}
.browser-tab.active, .browser-tab:hover {
  background: white; color: #00587C; border-color: white; font-weight: 500;
}
.browser-panels { flex: 1; min-width: 200px; }
.browser-panel { display: none; }
.browser-panel.active { display: block; }
.browser-steps {
  margin: 0; padding: 0 0 0 18px; list-style: decimal;
}
.browser-steps li {
  font-size: 12px; color: rgba(255,255,255,0.88);
  line-height: 1.5; margin-bottom: 3px;
}
.browser-steps li strong { color: white; }
.browser-steps li:last-child { margin-bottom: 0; }

@media (max-width: 680px) {
  .print-instruction-top { padding: 10px 14px; }
  .print-instruction-body { padding: 8px 14px 12px; flex-direction: column; gap: 10px; }
  .browser-tabs { gap: 4px; }
  .browser-tab { padding: 4px 9px; font-size: 11px; }
}

@media (max-width: 680px) {
  .print-instruction-steps { gap: 6px; }
  .print-instruction-sep { display: none; }
  .print-kbd-mac { display: none; }
}
</style>`;

async function downloadHTMLReport() {
  openReportView();
}

async function openReportView() {
  const students = allSubmissions.filter(s => !s.isJury);
  if (!students.length) return;

  const sortKey = document.getElementById('reportSortKey')?.value || getReportSortCookie();
  const noImages = reportNoImages || reportMode === 'list';
  const isList = reportMode === 'list';
  const sorted = [...students].sort((a,b) => {
    const [key, dir] = sortKey.split('_');
    const mul = dir === 'asc' ? 1 : -1;
    if (key === 'total') return mul * (a.total - b.total);
    if (key === 'studentNo') {
      const na = String(a.studentNo||''), nb = String(b.studentNo||'');
      return mul * na.localeCompare(nb, undefined, {numeric:true});
    }
    if (key === 'name') return mul * a.studentName.localeCompare(b.studentName);
    return 0;
  });
  const fr = lang === 'fr';

  // Show report container, hide dashboard
  const reportDiv = document.getElementById('reportView');
  const dashDiv   = document.getElementById('dashboard');
  dashDiv.style.display = 'none';
  document.getElementById('imgDrawer') && (document.getElementById('imgDrawer').style.display = 'none');
  reportDiv.style.display = 'block';
  document.getElementById('uploadBtn').style.display = 'none';
  window.scrollTo(0, 0);

  // Show progress overlay — created here so both list and report modes can use it
  const overlay = document.createElement('div');
  overlay.className = 'progress-overlay';
  overlay.innerHTML = `<div class="progress-card">
    <div class="progress-title">${fr ? 'Génération du rapport…' : 'Building report…'}</div>
    <div class="progress-sub" id="progSub">${fr ? 'Préparation…' : 'Preparing…'}</div>
    <div class="progress-track"><div class="progress-fill" id="progFill"></div></div>
    <div class="progress-pct" id="progPct">0%</div>
  </div>`;
  document.body.appendChild(overlay);
  await new Promise(r => setTimeout(r, 30));

  // ── List mode: render compact ordering doc ──────────────────────
  if (isList) {
    const sortLabels = {
      total_desc: fr?'Score décroissant':'Descending score',
      total_asc:  fr?'Score croissant':'Ascending score',
      studentNo_asc:  fr?'N° étudiant·e croissant':'Student ID ascending',
      studentNo_desc: fr?'N° étudiant·e décroissant':'Student ID descending',
      name_asc:  fr?'Nom A→Z':'Name A→Z',
      name_desc: fr?'Nom Z→A':'Name Z→A',
    };
    const sortLabel = sortLabels[sortKey] || sortKey;

    reportDiv.innerHTML = `<div class="report-topbar" id="reportTopbar">
      <span class="report-topbar-title">📋 ${fr?'Liste de présentation':'Presentation list'}</span>
      <div class="report-topbar-actions">
        <button class="report-hide-bar-btn" onclick="toggleReportTopbar()">${fr?'Masquer pour impression':'Hide for printing'}</button>
        <button class="report-hide-bar-btn" onclick="window.print()">🖨 ${fr?'Imprimer':'Print'}</button>
        <button class="report-back-btn" onclick="closeReportView()">← ${fr?'Retour':'Back'}</button>
      </div>
    </div>
    <div class="report-body" id="reportBody"></div>`;

    const body = document.getElementById('reportBody');
    const header = document.createElement('div');
    header.innerHTML = `<div style="font-family:'DM Mono',monospace;font-size:11px;color:#6B7E88;text-transform:uppercase;letter-spacing:0.8px;margin-bottom:6px">Éco-conception 2026</div>
      <div style="font-size:22px;font-weight:700;color:#0F1A20;letter-spacing:-0.5px;margin-bottom:4px">${fr?'Ordre de présentation':'Presentation order'}</div>
      <div style="font-size:13px;color:#6B7E88;margin-bottom:4px">${fr?'Critère de tri':'Sort criteria'}: <strong style="color:#3D4F58">${sortLabel}</strong></div>
      <div style="font-size:12px;color:#9AABB5;margin-bottom:24px">${new Date().toLocaleDateString(fr?'fr-CA':'en-CA',{year:'numeric',month:'long',day:'numeric'})}</div>
      <table style="width:100%;border-collapse:collapse;font-size:13px">
        <thead><tr style="border-bottom:2px solid #00587C">
          <th style="padding:7px 10px 8px 0;text-align:left;font-family:'DM Mono',monospace;font-size:10px;color:#6B7E88;font-weight:500;text-transform:uppercase;letter-spacing:0.8px;width:36px">#</th>
          <th style="padding:7px 10px 8px;text-align:left;font-family:'DM Mono',monospace;font-size:10px;color:#6B7E88;font-weight:500;text-transform:uppercase;letter-spacing:0.8px">${fr?'Étudiant·e':'Student'}</th>
          <th style="padding:7px 10px 8px;text-align:left;font-family:'DM Mono',monospace;font-size:10px;color:#6B7E88;font-weight:500;text-transform:uppercase;letter-spacing:0.8px">${fr?'N°':'ID'}</th>
          <th style="padding:7px 10px 8px;text-align:left;font-family:'DM Mono',monospace;font-size:10px;color:#6B7E88;font-weight:500;text-transform:uppercase;letter-spacing:0.8px">${fr?'Profil':'Profile'}</th>
          <th style="padding:7px 10px 8px;text-align:left;font-family:'DM Mono',monospace;font-size:10px;color:#6B7E88;font-weight:500;text-transform:uppercase;letter-spacing:0.8px">${fr?'Catégorie':'Category'}</th>
          <th style="padding:7px 10px 8px;text-align:right;font-family:'DM Mono',monospace;font-size:10px;color:#6B7E88;font-weight:500;text-transform:uppercase;letter-spacing:0.8px">${fr?'Score':'Score'}</th>
          <th style="padding:7px 0 8px 10px;text-align:center;font-family:'DM Mono',monospace;font-size:10px;color:#6B7E88;font-weight:500;text-transform:uppercase;letter-spacing:0.8px">${fr?'Verdict':'Verdict'}</th>
        </tr></thead>
        <tbody id="listBody"></tbody>
      </table>`;
    body.appendChild(header);

    overlay.remove();

    const tbody = document.getElementById('listBody');
    sorted.forEach((s, i) => {
      const tr = document.createElement('tr');
      const cvColor = s.crochetVert==='granted'?'#1B8B5A':s.crochetVert==='refused'?'#C0392B':'#C47A00';
      const cvLabel = s.crochetVert==='granted'?'✓':s.crochetVert==='refused'?'✗':'◔';
      tr.style.cssText = 'border-bottom:1px solid #F2F4F5;background:'+(i%2===0?'#FAFAF8':'white');
      tr.innerHTML = `
        <td style="padding:9px 10px 9px 0;font-family:'DM Mono',monospace;font-size:12px;color:#9AABB5;font-weight:500">${i+1}</td>
        <td style="padding:9px 10px;font-weight:600;color:#0F1A20">${esc(s.studentName)}</td>
        <td style="padding:9px 10px;font-family:'DM Mono',monospace;font-size:11px;color:#6B7E88">${esc(s.studentNo||'—')}</td>
        <td style="padding:9px 10px;font-size:12px;color:#5A6470">${esc(s.profile)}</td>
        <td style="padding:9px 10px;font-size:12px;color:#5A6470">${esc(s.garmentCat)}</td>
        <td style="padding:9px 0 9px 10px;text-align:right;font-family:'DM Mono',monospace;font-size:13px;font-weight:500;color:#0F1A20">${s.total}</td>
        <td style="padding:9px 0 9px 10px;text-align:center;font-size:15px;color:${cvColor}" title="${s.crochetVert}">${cvLabel}</td>`;
      tbody.appendChild(tr);
    });
    return; // done — skip full report build
  }

  // ── Full report mode ──────────────────────────────────────────────
  // Topbar
  reportDiv.innerHTML = `<div class="report-topbar" id="reportTopbar">
    <span class="report-topbar-title">📄 ${fr ? 'Rapport Éco-conception' : 'Eco-conception Report'}</span>
    <div class="report-topbar-actions">
      <button class="report-hide-bar-btn" onclick="toggleReportTopbar()">${fr ? 'Masquer pour impression' : 'Hide for printing'}</button>
      <button class="report-hide-bar-btn" onclick="window.print()">🖨 ${fr ? "Imprimer / PDF" : "Print / PDF"}</button>
      <button class="report-back-btn" onclick="closeReportView()">← ${fr ? 'Retour' : 'Back'}</button>
    </div>
  </div>
  <div class="report-body" id="reportBody"><div style="text-align:center;padding:40px;color:var(--text3);font-size:14px">${fr ? 'Génération en cours…' : 'Building report…'}</div></div>`;



  function setProgress(pct, label) {
    const fill = document.getElementById('progFill');
    const pctEl = document.getElementById('progPct');
    const sub = document.getElementById('progSub');
    if (fill) fill.style.width = pct + '%';
    if (pctEl) pctEl.textContent = Math.round(pct) + '%';
    if (sub && label) sub.textContent = label;
  }

  await new Promise(r => setTimeout(r, 30));

  const reportBody = document.getElementById('reportBody');
  reportBody.innerHTML = '';

  const total = sorted.length;

  // ── TOC ──
  if (printOpts.showStudentList && printOpts.studentListPosition === 'start') {
    setProgress(2, fr ? 'Table des matières…' : 'Table of contents…');
    await new Promise(r => setTimeout(r, 0));
    const tocEl = document.createElement('div');
    tocEl.innerHTML = buildTocHtml(sorted, fr);
    reportBody.appendChild(tocEl);
  }

  // ── Cards ──
  for (let i = 0; i < total; i++) {
    const s = sorted[i];
    setProgress(5 + (i / total) * 65, (fr ? 'Vêtement ' : 'Garment ') + (i+1) + ' / ' + total + ' — ' + esc(s.studentName));
    await new Promise(r => setTimeout(r, 0));
    const cardEl = document.createElement('div');
    cardEl.innerHTML = buildStudentCard(s, i, fr, noImages, isList);
    reportBody.appendChild(cardEl);
    if (i < total - 1) {
      const sep = document.createElement('hr');
      sep.style.cssText = 'border:none;border-top:2px solid var(--border);margin:8px 0;';
      reportBody.appendChild(sep);
    }
  }

  // ── Breakdown ──
  if (printOpts.showBreakdown) {
    setProgress(72, fr ? 'Détail des scores…' : 'Score breakdown…');
    await new Promise(r => setTimeout(r, 0));
    const bkHeader = document.createElement('div');
    bkHeader.innerHTML = `<hr class="print-divider"><div class="print-card"><div class="print-breakdown-title">${fr?'Détail des scores':'Score breakdown'}</div><div class="print-breakdown-sub">${fr?'Détail critère par critère pour chaque soumission.':'Criterion-by-criterion detail for each submission.'}</div>`;
    reportBody.appendChild(bkHeader);
    for (let i = 0; i < sorted.length; i++) {
      const s = sorted[i];
      setProgress(72 + (i / sorted.length) * 23, (fr ? 'Détail ' : 'Breakdown ') + (i+1) + '/' + sorted.length);
      await new Promise(r => setTimeout(r, 0));
      const bkEl = document.createElement('div');
      bkEl.innerHTML = `<div class="print-score-section">
        <div class="print-score-section-header">
          <span class="print-section-code" style="background:#00587C">S1–S4</span>
          <span style="font-size:14px;font-weight:600;color:#0F1A20;flex:1">${esc(s.studentName)}</span>
          <span style="font-family:'DM Mono',monospace;font-size:16px;font-weight:500">${s.total}/85</span>
        </div>
        ${buildBreakdownS1(s,fr)}${buildBreakdownS2(s,fr)}${buildBreakdownS3(s,fr)}${buildBreakdownS4(s,fr)}
        ${i < sorted.length-1 ? '<hr class="print-student-separator">' : '</div>'}
      </div>`;
      reportBody.appendChild(bkEl);
    }
    const bkClose = document.createElement('div');
    bkClose.innerHTML = '</div>';
    reportBody.appendChild(bkClose);
  }

  // ── TOC at end ──
  if (printOpts.showStudentList && printOpts.studentListPosition === 'end') {
    setProgress(97, fr ? 'Table des matières…' : 'Table of contents…');
    await new Promise(r => setTimeout(r, 0));
    const tocEl = document.createElement('div');
    tocEl.innerHTML = buildTocHtml(sorted, fr);
    reportBody.appendChild(tocEl);
  }

  setProgress(100, fr ? 'Terminé' : 'Done');
  await new Promise(r => setTimeout(r, 80));
  overlay.remove();
}

function buildTocHtml(sorted, fr) {
  return `<div class="print-card print-toc-card">
    <div style="border-bottom:3px solid #00587C;padding-bottom:14px;margin-bottom:20px">
      <div style="font-family:'DM Mono',monospace;font-size:11px;color:#6B7E88;text-transform:uppercase;letter-spacing:0.8px;margin-bottom:4px">Éco-conception</div>
      <div style="font-size:20px;font-weight:700;color:#0F1A20;letter-spacing:-0.5px">${fr?'Rapport des scores':'Score report'}</div>
      <div style="font-size:12px;color:#6B7E88;margin-top:4px">${new Date().toLocaleDateString(fr?'fr-CA':'en-CA',{year:'numeric',month:'long',day:'numeric'})}</div>
    </div>
    <table style="width:100%;border-collapse:collapse;font-size:13px">
      <thead><tr style="border-bottom:2px solid #E3DFD6">
        <th style="text-align:left;padding:6px 10px 8px 0;font-family:'DM Mono',monospace;font-size:10px;color:#6B7E88;font-weight:500;text-transform:uppercase;letter-spacing:0.8px">${fr?'Étudiant·e':'Student'}</th>
        <th style="text-align:left;padding:6px 10px 8px;font-family:'DM Mono',monospace;font-size:10px;color:#6B7E88;font-weight:500;text-transform:uppercase">${fr?'Profil':'Profile'}</th>
        <th style="text-align:center;padding:6px 10px 8px;font-family:'DM Mono',monospace;font-size:10px;color:#6B7E88;font-weight:500">S1</th>
        <th style="text-align:center;padding:6px 10px 8px;font-family:'DM Mono',monospace;font-size:10px;color:#6B7E88;font-weight:500">S2</th>
        <th style="text-align:center;padding:6px 10px 8px;font-family:'DM Mono',monospace;font-size:10px;color:#6B7E88;font-weight:500">S3</th>
        <th style="text-align:center;padding:6px 10px 8px;font-family:'DM Mono',monospace;font-size:10px;color:#6B7E88;font-weight:500">S4</th>
        <th style="text-align:right;padding:6px 0 8px 10px;font-family:'DM Mono',monospace;font-size:10px;color:#6B7E88;font-weight:500;text-transform:uppercase">${fr?'Total':'Total'}</th>
        <th style="text-align:right;padding:6px 0 8px 10px;font-family:'DM Mono',monospace;font-size:10px;color:#6B7E88;font-weight:500;text-transform:uppercase">${fr?'Statut':'Status'}</th>
      </tr></thead>
      <tbody>
        ${sorted.map((s,i) => {
          const sc = s.juryPending?'#C47A00':s.passed?'#1B8B5A':'#C0392B';
          const sl = s.juryPending?t('pendingLabel'):s.passed?t('certified'):t('notCertified');
          return `<tr style="border-bottom:1px solid #F2F4F5;background:${i%2===0?'#FAFAF8':'white'}">
            <td style="padding:8px 10px 8px 0;font-weight:600;color:#0F1A20">${esc(s.studentName)}</td>
            <td style="padding:8px 10px;color:#5A6470;font-size:12px">${esc(s.profile)}</td>
            <td style="padding:8px 10px;text-align:center;font-family:'DM Mono',monospace;font-size:12px">${s.s1}</td>
            <td style="padding:8px 10px;text-align:center;font-family:'DM Mono',monospace;font-size:12px">${s.s2}</td>
            <td style="padding:8px 10px;text-align:center;font-family:'DM Mono',monospace;font-size:12px">${s.s3}</td>
            <td style="padding:8px 10px;text-align:center;font-family:'DM Mono',monospace;font-size:12px">${s.s4}</td>
            <td style="padding:8px 0 8px 10px;text-align:right;font-family:'DM Mono',monospace;font-size:14px;font-weight:500;color:${sc}">${s.total}</td>
            <td style="padding:8px 0 8px 10px;text-align:right;font-size:11px;color:${sc};font-family:'DM Mono',monospace">${sl}</td>
          </tr>`;
        }).join('')}
      </tbody>
    </table>
  </div>`;
}

function buildStudentCard(s, i, fr, noImages, isList) {
  const statusClass = s.crochetVert==='granted' ? 'pass' : s.crochetVert==='refused' ? 'fail' : s.passed ? 'pass' : 'fail';
  const statusLabel = s.juryPending ? t('pendingLabel') : s.passed ? t('certified') : t('notCertified');
  const sections = [
    {code:'S1',title:t('sectionConceptualization'),score:s.s1,max:20},
    {code:'S2',title:t('sectionFabrics'),score:s.s2,max:40},
    {code:'S3',title:t('sectionProduction'),score:s.s3,max:25},
    {code:'S4',title:t('sectionCare'),score:s.s4,max:10},
  ];
  const sectionBlocks = sections.map(sec => {
    const pct = Math.max(0,Math.min(100,(sec.score/sec.max)*100));
    return `<div class="print-section-block">
      <div class="print-section-code">${sec.code}</div>
      <div class="print-section-title">${sec.title}</div>
      <div><span class="print-section-score">${sec.score}</span><span class="print-section-max"> / ${sec.max} pts</span></div>
      <div class="print-section-bar-track"><div class="print-section-bar-fill" style="width:${pct}%"></div></div>
    </div>`;
  }).join('');

  function imgBlock(url, label) {
    if (!url) return '';
    return String(url).split(';').map(u => {
      u = u.trim(); if (!u) return '';
      const isPdf = u.toLowerCase().endsWith('.pdf');
      const allResolved = resolveAllImages(u);
      if (allResolved.length > 0) {
        // Show all pages; first one uses the label, extra pages labelled (2), (3)...
        return allResolved.map((resolved, pi) => {
          const pageLabel = allResolved.length > 1 ? label + ' (' + (pi+1) + '/' + allResolved.length + ')' : label;
          const isPagePdf = resolved.dataUrl.startsWith('data:application/pdf');
          if (isPagePdf) {
            return `<div class="print-photo-block"><div class="print-photo-label">${pageLabel}</div>
              <div style="padding:10px 14px;background:#FFF3DC;border:1px solid rgba(196,122,0,0.3);border-radius:6px;font-size:12px;color:#7A4800">📄 ${fr?'Ce fichier est un PDF et ne peut pas être affiché dans le rapport.':'This file is a PDF and cannot be displayed in the report.'}</div></div>`;
          }
          return `<div class="print-photo-block"><div class="print-photo-label">${pageLabel}</div>
            <img src="${resolved.dataUrl}" style="max-width:800px;max-height:600px;object-fit:contain;border-radius:6px;display:block;margin:8px 0"></div>`;
        }).join('');
      } else if (isPdf) {
        return `<div class="print-photo-block"><div class="print-photo-label">${label}</div>
          <div style="padding:10px 14px;background:#FFF3DC;border:1px solid rgba(196,122,0,0.3);border-radius:6px;font-size:12px;color:#7A4800">📄 ${fr?'Ce fichier est un PDF et ne peut pas être affiché dans le rapport.':'This file is a PDF and cannot be displayed in the report.'}</div></div>`;
      } else {
        return `<div class="print-photo-block"><div class="print-photo-label">${label}</div>
          <div style="padding:10px 14px;background:var(--bg2);border:1px solid var(--border);border-radius:6px;font-size:12px;color:var(--text3);line-height:1.7">
            ⚠ ${fr?'Image non chargée localement.':'Image not loaded locally.'}
            <a href="${esc(u)}" target="_blank" rel="noopener"
               style="color:var(--accent);margin-left:6px;font-weight:500;white-space:nowrap">
              ${fr?'Ouvrir dans OneDrive →':'Open in OneDrive →'}
            </a>
          </div></div>`;
      }
    }).join('');
  }

  const juryInputHtml = ''; // jury seam score removed

  return `<div class="print-card">
    <div class="print-card-header">
      <div>
        <div class="print-student-name">${esc(s.studentName)}</div>
        <div class="print-student-meta">
          ${fr?'N° étudiant·e':'Student no.'}: ${esc(s.studentNo||'—')} &nbsp;·&nbsp;
          ${fr?'Profil':'Profile'}: ${esc(s.profile)} &nbsp;·&nbsp;
          ${fr?'Catégorie':'Category'}: ${esc(s.garmentCat)}<br>
          ${fr?'Usage':'Intended use'}: ${esc(s.intendedUse)} &nbsp;·&nbsp;
          ${fr?'Soumis le':'Submitted'}: ${esc(s.submittedAt)}
        </div>
      </div>
      <div class="print-total-block">
        <div class="print-total-num ${statusClass}">${s.total}</div>
        <div class="print-total-label">/ 85 pts</div>
        <div class="print-status-badge ${statusClass}">${statusLabel}</div>
      </div>
    </div>
    <div class="print-sections">${sectionBlocks}</div>
    ${isList ? '' : `<div style="margin:10px 0;padding:10px 14px;border-radius:8px;border:2px solid ${
      s.crochetVert==='granted' ? 'rgba(27,139,90,0.4)' :
      s.crochetVert==='refused' ? 'rgba(192,57,43,0.4)' : 'rgba(196,122,0,0.3)'
    };background:${
      s.crochetVert==='granted' ? 'rgba(27,139,90,0.07)' :
      s.crochetVert==='refused' ? 'rgba(192,57,43,0.07)' : 'rgba(196,122,0,0.05)'
    };display:flex;align-items:center;gap:12px;flex-wrap:wrap">
      <span style="font-size:13px;font-weight:600;color:${
        s.crochetVert==='granted' ? '#1B8B5A' :
        s.crochetVert==='refused' ? '#C0392B' : '#C47A00'
      }">
        ${s.crochetVert==='granted' ? '✓ '+(fr?'Crochet vert accordé':'Crochet vert granted') :
          s.crochetVert==='refused' ? '✗ '+(fr?'Crochet vert refusé':'Crochet vert refused') :
          '◔ '+(fr?'En attente du jury':'Pending jury decision')}
      </span>
      ${juryLocked ? '' : `
        <button onclick="setCrochetVert('${esc(juryKey(s))}','granted')" style="
          padding:4px 12px;border-radius:6px;font-size:12px;font-weight:600;cursor:pointer;
          background:${s.crochetVert==='granted'?'#1B8B5A':'transparent'};
          color:${s.crochetVert==='granted'?'white':'#1B8B5A'};
          border:1.5px solid #1B8B5A;
        " onclick="event.stopPropagation()">✓ ${fr?'Accorder':'Grant'}</button>
        <button onclick="setCrochetVert('${esc(juryKey(s))}','refused')" style="
          padding:4px 12px;border-radius:6px;font-size:12px;font-weight:600;cursor:pointer;
          background:${s.crochetVert==='refused'?'#C0392B':'transparent'};
          color:${s.crochetVert==='refused'?'white':'#C0392B'};
          border:1.5px solid #C0392B;
        " onclick="event.stopPropagation()">✗ ${fr?'Refuser':'Refuse'}</button>
      `}
    </div>`}
    ${isList ? '' : imgBlock(s.garmentPhoto, fr?'Photo du vêtement':'Garment photo')}
    ${isList ? '' : imgBlock(s.fabricPhotoPlan, fr?'Plan de placement du tissu':'Fabric placement plan')}
  </div>`;
}

function toggleReportTopbar() {
  const bar = document.getElementById('reportTopbar');
  if (!bar) return;
  const fr = lang === 'fr';
  let pill = document.getElementById('reportRestorePill');
  if (bar.style.display === 'none') {
    bar.style.display = '';
    if (pill) pill.remove();
  } else {
    bar.style.display = 'none';
    if (!pill) {
      pill = document.createElement('div');
      pill.id = 'reportRestorePill';
      pill.title = fr ? 'Afficher la barre' : 'Show toolbar';
      pill.onclick = toggleReportTopbar;
      pill.textContent = fr ? '▲ afficher' : '▲ show';
      pill.style.cssText = 'position:fixed;top:0;left:50%;transform:translateX(-50%);z-index:200;background:var(--blue,#00587C);color:white;font-size:10px;font-family:monospace;padding:2px 12px;border-radius:0 0 8px 8px;cursor:pointer;opacity:0.7;transition:opacity 0.15s;letter-spacing:0.5px;';
      pill.onmouseenter = () => pill.style.opacity = '1';
      pill.onmouseleave = () => pill.style.opacity = '0.7';
      document.body.appendChild(pill);
    }
  }
}

function closeReportView() {
  const pill = document.getElementById('reportRestorePill');
  if (pill) pill.remove();
  document.getElementById('reportView').style.display = 'none';
  document.getElementById('dashboard').style.display = 'block';
  document.getElementById('uploadBtn').style.display = 'flex';
  window.scrollTo(0, 0);
}


function openPrintView() {
  const students = allSubmissions.filter(s => !s.isJury);
  if (!students.length) return;

  const sorted = [...students].sort((a,b) => b.total - a.total);
  const fr = lang === 'fr';

  const browsers = fr ? [
    { name: 'Chrome / Edge', icon: '🟢', steps: ['Cliquez sur le bouton <strong>🖨 Imprimer</strong> ci-dessous, ou appuyez sur <span class="print-kbd">Ctrl+P</span> <span class="print-kbd-mac">⌘P</span>', 'Dans le panneau qui s\'ouvre, trouvez <strong>Destination</strong> ou <strong>Imprimante</strong>', 'Cliquez sur la liste déroulante et choisissez <strong>Enregistrer au format PDF</strong>', 'Cliquez sur <strong>Enregistrer</strong> et choisissez l\'emplacement'] },
    { name: 'Firefox', icon: '🟠', steps: ['Cliquez sur le bouton <strong>🖨 Imprimer</strong> ci-dessous, ou appuyez sur <span class="print-kbd">Ctrl+P</span> <span class="print-kbd-mac">⌘P</span>', 'Dans la fenêtre d\'impression, cliquez sur <strong>Enregistrer au format PDF</strong> dans la liste des imprimantes à droite', 'Cliquez sur <strong>Enregistrer</strong>'] },
    { name: 'Safari (Mac)', icon: '🔵', steps: ['Appuyez sur <span class="print-kbd-mac">⌘P</span>', 'En bas à gauche de la fenêtre, cliquez sur le menu déroulant <strong>PDF</strong>', 'Choisissez <strong>Enregistrer au format PDF…</strong>', 'Donnez un nom au fichier et cliquez sur <strong>Enregistrer</strong>'] },
  ] : [
    { name: 'Chrome / Edge', icon: '🟢', steps: ['Click the <strong>🖨 Print</strong> button below, or press <span class="print-kbd">Ctrl+P</span> <span class="print-kbd-mac">⌘P</span>', 'In the panel that opens, find <strong>Destination</strong> or <strong>Printer</strong>', 'Click the dropdown and choose <strong>Save as PDF</strong>', 'Click <strong>Save</strong> and choose where to save the file'] },
    { name: 'Firefox', icon: '🟠', steps: ['Click the <strong>🖨 Print</strong> button below, or press <span class="print-kbd">Ctrl+P</span> <span class="print-kbd-mac">⌘P</span>', 'In the print window, click <strong>Save to PDF</strong> in the printer list on the right', 'Click <strong>Save</strong>'] },
    { name: 'Safari (Mac)', icon: '🔵', steps: ['Press <span class="print-kbd-mac">⌘P</span>', 'At the bottom left of the print window, click the <strong>PDF</strong> dropdown', 'Choose <strong>Save as PDF…</strong>', 'Name the file and click <strong>Save</strong>'] },
  ];

  const browserTabsHtml = browsers.map((b,i) =>
    `<button class="browser-tab ${i===0?'active':''}" onclick="document.querySelectorAll('.browser-tab').forEach((t,j)=>t.classList.toggle('active',j===${i}));document.querySelectorAll('.browser-panel').forEach((p,j)=>p.classList.toggle('active',j===${i}))">${b.icon} ${b.name}</button>`
  ).join('');

  const browserPanelsHtml = browsers.map((b,i) =>
    `<div class="browser-panel ${i===0?'active':''}">${'<ol class="browser-steps">' + b.steps.map(s=>`<li>${s}</li>`).join('') + '</ol>'}</div>`
  ).join('');

  const instructionBarHtml = `<div class="print-instruction-bar" id="printInstructionBar">
    <div class="print-instruction-top">
      <div class="print-instruction-headline">
        <span class="print-instruction-title">${fr ? '💾 Comment enregistrer en PDF' : '💾 How to save as PDF'}</span>
        <span class="print-instruction-hint">${fr ? 'Choisissez votre navigateur ci-dessous' : 'Select your browser below'}</span>
      </div>
      <div class="print-instruction-actions">
        <button class="print-now-btn" onclick="window.print()">🖨 ${fr ? "Ouvrir l'impression" : 'Open print dialog'}</button>
        <button class="print-back-btn" onclick="window.close()">← ${fr ? 'Fermer' : 'Close'}</button>
      </div>
    </div>
    <div class="print-instruction-body">
      <div class="browser-tabs">${browserTabsHtml}</div>
      <div class="browser-panels">${browserPanelsHtml}</div>
    </div>
  </div>`;

  const bodyHtml = instructionBarHtml + buildPrintView(sorted);

  // Open a new window with self-contained HTML — avoids Edge zero-byte PDF bug
  const printWin = window.open('', '_blank', 'width=1100,height=800');
  if (!printWin) {
    alert(fr
      ? 'Le navigateur a bloqué l\'ouverture de la fenêtre. Autorisez les popups pour ce site.'
      : 'The browser blocked the popup. Please allow popups for this page.');
    return;
  }

  printWin.document.write(`<!DOCTYPE html>
<html lang="${lang}">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${fr ? 'Rapport Éco-conception' : 'Eco-conception Report'}</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=DM+Mono:wght@300;400;500&family=DM+Sans:wght@300;400;500;600;700&display=swap">
${PRINT_STYLES}
</head>
<body>
${bodyHtml}
</body>
</html>`);
  printWin.document.close();
}

function closePrintView() {
  document.getElementById('printView').style.display = 'none';
  document.getElementById('dashboard').style.display = 'block';
  document.getElementById('uploadBtn').style.display = 'flex';
  window.scrollTo(0, 0);
  updateJuryBar();
}

function switchBrowserTab(idx) {
  document.querySelectorAll('.browser-tab').forEach((t,i) => t.classList.toggle('active', i===idx));
  document.querySelectorAll('.browser-panel').forEach((p,i) => p.classList.toggle('active', i===idx));
}

function buildPrintView(students) {
  const fr = lang === 'fr';

  // ── Summary cards (one per student) ──
  const cards = students.map((s, i) => {
    const statusClass = s.crochetVert==='granted' ? 'pass' : s.crochetVert==='refused' ? 'fail' : s.passed ? 'pass' : 'fail';
    const statusLabel = s.juryPending ? t('pendingLabel') : s.passed ? t('certified') : t('notCertified');
    const sections = [
      { code:'S1', title: t('sectionConceptualization'), score: s.s1, max: 20 },
      { code:'S2', title: t('sectionFabrics'),           score: s.s2, max: 40 },
      { code:'S3', title: t('sectionProduction'),        score: s.s3, max: 25 },
      { code:'S4', title: t('sectionCare'),              score: s.s4, max: 10 },
    ];

    const sectionBlocks = sections.map(sec => {
      const pct = Math.max(0, Math.min(100, (sec.score / sec.max) * 100));
      return `<div class="print-section-block">
        <div class="print-section-code">${sec.code}</div>
        <div class="print-section-title">${sec.title}</div>
        <div>
          <span class="print-section-score">${sec.score}</span>
          <span class="print-section-max"> / ${sec.max} pts</span>
        </div>
        <div class="print-section-bar-track">
          <div class="print-section-bar-fill" style="width:${pct}%"></div>
        </div>
      </div>`;
    }).join('');

    function makeImgBlock(url, label, idx, suffix) {
      if (!url) return '';
      // Handle multiple URLs (semicolon-separated)
      const urls = String(url).split(';').map(u => u.trim()).filter(Boolean);
      return urls.map((u, ui) => {
        const resolved = resolveImage(u);
        const src = resolved ? resolved.dataUrl : u;
        const isLocal = !!resolved;
        const imgId = 'photo-' + idx + suffix + ui;
        const fbId  = 'pfallback-' + idx + suffix + ui;
        if (isLocal) {
          const isPdf = src.startsWith('data:application/pdf') || u.toLowerCase().endsWith('.pdf');
          return `<div class="print-photo-block">
            <div class="print-photo-label">${label}${urls.length > 1 ? ' (' + (ui+1) + '/' + urls.length + ')' : ''}</div>
            ${isPdf
              ? `<div style="margin:8px 0;padding:10px 14px;background:rgba(196,122,0,0.08);border:1px solid rgba(196,122,0,0.25);border-radius:6px;font-size:13px;color:var(--amber)">📄 ${fr ? 'Ce fichier est un PDF et ne peut pas être affiché dans le rapport. Ouvrez le lien pour le consulter.' : 'This file is a PDF and cannot be displayed in the report. Open the link to view it.'} <a href="${esc(u)}" target="_blank" style="color:var(--accent);margin-left:6px">${fr?'Ouvrir →':'Open →'}</a></div>`
              : `<img src="${src}" alt="" style="max-width:800px;max-height:600px;object-fit:contain;border-radius:6px;display:block;margin:8px 0">`}
          </div>`;
        } else {
          // Remote URL — try to load, fallback if blocked
          return `<div class="print-photo-block">
            <div class="print-photo-label">${label}${urls.length > 1 ? ' (' + (ui+1) + '/' + urls.length + ')' : ''}</div>
            <img id="${imgId}" src="${esc(u)}" alt=""
                 style="max-width:800px;max-height:600px;object-fit:contain;border-radius:6px;display:block;margin:8px 0"
                 onerror="this.style.display='none';document.getElementById('${fbId}').style.display='block'"
                 onload="document.getElementById('${fbId}').style.display='none'">
            <div id="${fbId}" style="display:none">
              ${u.toLowerCase().endsWith('.pdf')
              ? `<div style="padding:10px 14px;background:rgba(196,122,0,0.08);border:1px solid rgba(196,122,0,0.25);border-radius:6px;font-size:13px;color:var(--amber)">📄 ${fr ? 'Ce fichier est un PDF et ne peut pas être affiché dans le rapport.' : 'This file is a PDF and cannot be displayed in the report.'}</div>`
              : `<div style="padding:10px 14px;background:var(--bg2);border:1px solid var(--border);border-radius:6px;font-size:12px;color:var(--text3)">
                   ⚠ ${fr?'Image non chargée localement.':'Image not loaded locally.'}
                   <a href="${esc(u)}" target="_blank" rel="noopener" style="color:var(--accent);margin-left:6px;font-weight:500">${fr?'Ouvrir dans OneDrive →':'Open in OneDrive →'}</a>
                 </div>`}
            </div>
          </div>`;
        }
      }).join('');
    }
    const photoBlock = (s.garmentPhoto || s.fabricPhotoPlan) ? (
      makeImgBlock(s.garmentPhoto,    fr ? 'Photo du vêtement'            : 'Garment photo',       i, 'g') +
      makeImgBlock(s.fabricPhotoPlan, fr ? 'Plan de placement du tissu'   : 'Fabric placement plan', i, 'f')
    ) : '';

    return `<div class="print-card">
      <div class="print-card-header">
        <div>
          <div class="print-student-name">${esc(s.studentName)}</div>
          <div class="print-student-meta">
            ${fr ? 'N° étudiant·e' : 'Student no.'}: ${esc(s.studentNo || '—')} &nbsp;·&nbsp;
            ${fr ? 'Profil' : 'Profile'}: ${esc(s.profile)} &nbsp;·&nbsp;
            ${fr ? 'Catégorie' : 'Category'}: ${esc(s.garmentCat)}<br>
            ${fr ? 'Usage' : 'Intended use'}: ${esc(s.intendedUse)} &nbsp;·&nbsp;
            ${fr ? 'Soumis le' : 'Submitted'}: ${esc(s.submittedAt)}
          </div>
        </div>
        <div class="print-total-block">
          <div class="print-total-num ${statusClass}">${s.total}</div>
          <div class="print-total-label">/ 85 pts</div>
          <div class="print-status-badge ${statusClass}">${statusLabel}</div>
        </div>
      </div>
      <div class="print-sections">${sectionBlocks}</div>
      ${photoBlock}
    </div>`;
  }).join('');

  // ── Breakdown section (all students, appended after cards) ──
  const breakdowns = students.map((s, i) => {
    return `<div class="print-score-section">
      <div class="print-score-section-header">
        <span class="print-section-code" style="background:#00587C">S1–S4</span>
        <span style="font-size:14px;font-weight:600;color:#0F1A20;flex:1">${esc(s.studentName)}</span>
        <span style="font-family:'DM Mono',monospace;font-size:16px;font-weight:500">${s.total}/85</span>
      </div>
      ${buildBreakdownS1(s, fr)}
      ${buildBreakdownS2(s, fr)}
      ${buildBreakdownS3(s, fr)}
      ${buildBreakdownS4(s, fr)}
      ${i < students.length - 1 ? '<hr class="print-student-separator">' : ''}
    </div>`;
  }).join('');

  // ── Table of contents ──
  const toc = `<div class="print-card print-toc-card">
    <div style="border-bottom:3px solid #00587C;padding-bottom:14px;margin-bottom:20px">
      <div style="font-family:'DM Mono',monospace;font-size:11px;color:#6B7E88;text-transform:uppercase;letter-spacing:0.8px;margin-bottom:4px">Éco-conception</div>
      <div style="font-size:20px;font-weight:700;color:#0F1A20;letter-spacing:-0.5px">${fr?'Rapport des scores':'Score report'}</div>
      <div style="font-size:12px;color:#6B7E88;margin-top:4px">${new Date().toLocaleDateString(fr?'fr-CA':'en-CA',{year:'numeric',month:'long',day:'numeric'})}</div>
    </div>
    <div style="font-family:'DM Mono',monospace;font-size:10px;color:#6B7E88;text-transform:uppercase;letter-spacing:0.8px;margin-bottom:14px">${fr?'Soumissions — du meilleur au moins bon score':'Submissions — highest to lowest score'}</div>
    <table style="width:100%;border-collapse:collapse;font-size:13px">
      <thead>
        <tr style="border-bottom:2px solid #E3DFD6">
          <th style="text-align:left;padding:6px 10px 8px 0;font-family:'DM Mono',monospace;font-size:10px;color:#6B7E88;font-weight:500;text-transform:uppercase;letter-spacing:0.8px">${fr?'Étudiant·e':'Student'}</th>
          <th style="text-align:left;padding:6px 10px 8px;font-family:'DM Mono',monospace;font-size:10px;color:#6B7E88;font-weight:500;text-transform:uppercase;letter-spacing:0.8px">${fr?'Profil':'Profile'}</th>
          <th style="text-align:center;padding:6px 10px 8px;font-family:'DM Mono',monospace;font-size:10px;color:#6B7E88;font-weight:500;text-transform:uppercase;letter-spacing:0.8px">S1</th>
          <th style="text-align:center;padding:6px 10px 8px;font-family:'DM Mono',monospace;font-size:10px;color:#6B7E88;font-weight:500;text-transform:uppercase;letter-spacing:0.8px">S2</th>
          <th style="text-align:center;padding:6px 10px 8px;font-family:'DM Mono',monospace;font-size:10px;color:#6B7E88;font-weight:500;text-transform:uppercase;letter-spacing:0.8px">S3</th>
          <th style="text-align:center;padding:6px 10px 8px;font-family:'DM Mono',monospace;font-size:10px;color:#6B7E88;font-weight:500;text-transform:uppercase;letter-spacing:0.8px">S4</th>
          <th style="text-align:right;padding:6px 0 8px 10px;font-family:'DM Mono',monospace;font-size:10px;color:#6B7E88;font-weight:500;text-transform:uppercase;letter-spacing:0.8px">${fr?'Total':'Total'}</th>
          <th style="text-align:right;padding:6px 0 8px 10px;font-family:'DM Mono',monospace;font-size:10px;color:#6B7E88;font-weight:500;text-transform:uppercase;letter-spacing:0.8px">${fr?'Statut':'Status'}</th>
        </tr>
      </thead>
      <tbody>
        ${students.map((s,i) => {
          const statusColor = s.juryPending ? '#C47A00' : s.passed ? '#1B8B5A' : '#C0392B';
          const statusLabel = s.juryPending ? t('pendingLabel') : s.passed ? t('certified') : t('notCertified');
          const rowBg = i % 2 === 0 ? '#FAFAF8' : 'white';
          return `<tr style="border-bottom:1px solid #F2F4F5;background:${rowBg}">
            <td style="padding:8px 10px 8px 0;font-weight:600;color:#0F1A20">${esc(s.studentName)}</td>
            <td style="padding:8px 10px;color:#5A6470;font-size:12px">${esc(s.profile)}</td>
            <td style="padding:8px 10px;text-align:center;font-family:'DM Mono',monospace;font-size:12px">${s.s1}</td>
            <td style="padding:8px 10px;text-align:center;font-family:'DM Mono',monospace;font-size:12px">${s.s2}</td>
            <td style="padding:8px 10px;text-align:center;font-family:'DM Mono',monospace;font-size:12px">${s.s3}</td>
            <td style="padding:8px 10px;text-align:center;font-family:'DM Mono',monospace;font-size:12px">${s.s4}</td>
            <td style="padding:8px 0 8px 10px;text-align:right;font-family:'DM Mono',monospace;font-size:14px;font-weight:500;color:${statusColor}">${s.total}</td>
            <td style="padding:8px 0 8px 10px;text-align:right;font-size:11px;color:${statusColor};font-family:'DM Mono',monospace">${statusLabel}</td>
          </tr>`;
        }).join('')}
      </tbody>
    </table>
  </div>`;

  const tocHtml = printOpts.showStudentList ? toc : '';
  const breakdownHtml = printOpts.showBreakdown ? `
    <hr class="print-divider">
    <div class="print-card">
      <div class="print-breakdown-title">${fr ? 'Détail des scores' : 'Score breakdown'}</div>
      <div class="print-breakdown-sub">${fr
        ? 'Détail critère par critère pour chaque soumission, dans le même ordre que ci-dessus.'
        : 'Criterion-by-criterion detail for each submission, in the same order as above.'}</div>
      ${breakdowns}
    </div>` : '';

  if (printOpts.studentListPosition === 'start') {
    return tocHtml + cards + breakdownHtml;
  } else {
    return cards + breakdownHtml + tocHtml;
  }
}

function printCritRow(val, label, ptsVal) {
  const isPos = String(ptsVal).startsWith('+') && ptsVal !== '+0';
  const isNeg = String(ptsVal).startsWith('-');
  const cls = val ? 'yes' : 'no';
  const icon = val ? '✓' : '○';
  const ptsClass = val ? (isPos ? 'pos' : isNeg ? 'neg' : 'zero') : (isNeg ? 'zero' : 'zero');
  const opacity = val ? '' : 'opacity:0.4;';
  return `<div class="print-criterion-row" style="${opacity}">
    <div class="print-criterion-check ${cls}">${icon}</div>
    <div class="print-criterion-text">${label}</div>
    <div class="print-criterion-pts ${ptsClass}">${ptsVal}</div>
  </div>`;
}

function printSectionHeader(code, title, score, max) {
  const pct = Math.max(0, Math.min(100, (score / max) * 100));
  return `<div class="print-score-section-header" style="margin-top:12px">
    <span class="print-section-code">${code}</span>
    <span style="font-size:12px;font-weight:600;color:#0F1A20;flex:1">${title}</span>
    <span style="font-family:'DM Mono',monospace;font-size:14px">${score}/${max}</span>
  </div>`;
}

function printQual(label, value) {
  if (!value) return '';
  return `<div class="print-qual-block"><strong>${label}:</strong> ${esc(value)}</div>`;
}

function buildBreakdownS1(s, fr) {
  const rows = [
    printCritRow(s.upcycled, fr?'Vêtement entièrement conçu à partir de récupération':'Designed entirely from upcycled garments', s.upcycled?'+20':'0'),
  ];
  if (!s.s1Override) {
    rows.push(
      printCritRow(s.intentionalDesign, fr?'Conception intentionnelle':'Intentional design approach', s.intentionalDesign?'+5':'0'),
      printCritRow(s.localSourcing, fr?'Approvisionnement local':'Local sourcing', s.localSourcing?'+5':'0'),
      printCritRow(s.digitalProto, fr?'Prototypage numérique / patrons existants':'Digital prototyping or existing patterns', s.digitalProto?'+5':'0'),
      printCritRow(s.lowWasteCutting, fr?'Coupe zéro déchet':'Low-waste cutting', s.lowWasteCutting?'+5':'0'),
      printCritRow(s.lowImpactProcess, fr?'Procédés à faible impact':'Low-impact transformation processes', s.lowImpactProcess?'+5':'0'),
      printCritRow(s.materialSelection, fr?'Sélection appropriée des matériaux et garnitures':'Appropriate material and trim selection', s.materialSelection?'+3':'0'),
    );
  }
  return printSectionHeader('S1', t('sectionConceptualization'), s.s1, 20) + rows.join('') +
    (s.parts.length ? printQual(fr?'Matériaux par partie':'Materials by part', s.parts.map((p,i)=>`${fr?'Partie':'Part'} ${i+1}: ${p}`).join(' · ')) : '');
}

function buildBreakdownS2(s, fr) {
  const trimOpts = options(s.trimRaw);
  const transfoOpts = options(s.transfoRaw);

  const originRow = `<div class="print-criterion-row">
    <div class="print-criterion-check yes">→</div>
    <div class="print-criterion-text">${fr?'Origine':'Origin'}: ${esc(s.mainFabricOrigin)}${s.mainFabricSupplier?' — '+esc(s.mainFabricSupplier):''}</div>
    <div class="print-criterion-pts ${s.s2Origin>0?'pos':s.s2Origin<0?'neg':'zero'}">${pts(s.s2Origin)}</div>
  </div>`;

  const compRow = `<div class="print-criterion-row">
    <div class="print-criterion-check yes">→</div>
    <div class="print-criterion-text">${fr?'Composition':'Composition'}: ${esc(s.mainFabricComp)}${s.stretchContent?' + '+(fr?'élastique':'stretch')+' (−3)':''}</div>
    <div class="print-criterion-pts ${s.s2Comp>0?'pos':s.s2Comp<0?'neg':'zero'}">${pts(s.s2Comp)}</div>
  </div>`;

  const trimRows = TRIM_OPTIONS.map(o => {
    const sel = optionSelected(s.trimRaw, o.kw);
    const isPos = o.pts.startsWith('+'); const isNeg = o.pts.startsWith('−') || o.pts.startsWith('-');
    return `<div class="print-criterion-row" style="${sel?'':'opacity:0.4;'}">
      <div class="print-criterion-check ${sel?'yes':'no'}">${sel?'✓':'○'}</div>
      <div class="print-criterion-text">${fr?o.fr:o.en}</div>
      <div class="print-criterion-pts ${sel?(isPos?'pos':isNeg?'neg':'zero'):'zero'}">${o.pts}</div>
    </div>`;
  }).join('');

  const transfoRows = TRANSFO_OPTIONS.map(o => {
    const sel = optionSelected(s.transfoRaw, o.kw);
    const isPos = o.pts.startsWith('+'); const isNeg = o.pts.startsWith('−') || o.pts.startsWith('-');
    return `<div class="print-criterion-row" style="${sel?'':'opacity:0.4;'}">
      <div class="print-criterion-check ${sel?'yes':'no'}">${sel?'✓':'○'}</div>
      <div class="print-criterion-text">${fr?o.fr:o.en}</div>
      <div class="print-criterion-pts ${sel?(isPos?'pos':isNeg?'neg':'zero'):'zero'}">${o.pts}</div>
    </div>`;
  }).join('');

  const ifaceRow = `<div class="print-criterion-row">
    <div class="print-criterion-check yes">→</div>
    <div class="print-criterion-text">${fr?'Entoilage':'Interfacing'}: ${esc(s.interfacingMethod)}</div>
    <div class="print-criterion-pts ${s.s2Interface>0?'pos':s.s2Interface<0?'neg':'zero'}">${pts(s.s2Interface)}</div>
  </div>`;

  return printSectionHeader('S2', t('sectionFabrics'), s.s2, 40)
    + originRow + compRow
    + `<div style="font-size:10px;color:#6B7E88;font-family:'DM Mono',monospace;text-transform:uppercase;letter-spacing:0.8px;padding:6px 0 3px 26px">${fr?'Garnitures':'Trim'} (${pts(s.s2Trim)})</div>`
    + trimRows
    + `<div style="font-size:10px;color:#6B7E88;font-family:'DM Mono',monospace;text-transform:uppercase;letter-spacing:0.8px;padding:6px 0 3px 26px">${fr?'Transformations':'Transformation'} (${pts(s.s2Transfo)})</div>`
    + transfoRows
    + ifaceRow
    + (s.fusingJustification ? printQual(fr?'Justification entoilage':'Fusing justification', s.fusingJustification) : '');
}

function buildBreakdownS3(s, fr) {
  const ws = wasteScore(s);
  return printSectionHeader('S3', t('sectionProduction'), s.s3, 30)
    + printCritRow(s.durableConstruction, fr?'Construction solide et durable':'Durable construction', s.durableConstruction?'+5':'0')
    + `<div class="print-criterion-row">
        <div class="print-criterion-check yes">→</div>
        <div class="print-criterion-text">${fr?'Stratégie déchets':'Waste strategy'}: ${esc(s.wasteStrategy)}</div>
        <div class="print-criterion-pts ${ws>0?'pos':'zero'}">${ws>0?'+'+ws:'0'}</div>
       </div>`
    + (s.wasteDescription ? printQual(fr?'Description':'Description', s.wasteDescription) : '')
    + printCritRow(s.strategicPattern, fr?'Placement stratégique du patron':'Strategic pattern placement', s.strategicPattern?'+5':'0')
    + (s.fabricQuantity ? printQual(fr?'Tissu utilisé':'Fabric used', s.fabricQuantity) : '')

    + `<div class="print-criterion-row">
        <div class="print-criterion-check ${s.crochetVert==='granted'?'yes':s.crochetVert==='refused'?'no':'na'}">${s.crochetVert==='granted'?'✓':s.crochetVert==='refused'?'✗':'◔'}</div>
        <div class="print-criterion-text">${fr?'Crochet vert':'Crochet vert'}: ${s.crochetVert==='granted'?(fr?'Accordé':'Granted'):s.crochetVert==='refused'?(fr?'Refusé':'Refused'):(fr?'En attente':'Pending')}</div>
        <div class="print-criterion-pts zero"></div>
       </div>`
    + (s.seamTypes ? printQual(fr?'Types de coutures':'Seam types', s.seamTypes) : '')
    + (s.seamJustification ? printQual(fr?'Justification coutures':'Seam justification', s.seamJustification) : '')
    + (s.reflection ? printQual(fr?'Réflexion':'Reflection', s.reflection) : '');
}

function buildBreakdownS4(s, fr) {
  return printSectionHeader('S4', t('sectionCare'), s.s4, 10)
    + (s.s4raw > s.s4 ? `<div style="font-size:10px;color:#C47A00;padding:3px 0 3px 26px">${fr?`Score brut : ${s.s4raw} — plafonné à 10`:`Raw score: ${s.s4raw} — capped at 10`}</div>` : '')
    + printCritRow(s.easilyMended, fr?'Facilement réparable':'Easily mended', s.easilyMended?'+3':'0')
    + printCritRow(s.structurallySolid, fr?'Solidité structurelle':'Structurally solid', s.structurallySolid?'+3':'0')
    + printCritRow(s.materialsLastLong, fr?'Matériaux durables dans le temps':'Materials built to last', s.materialsLastLong?'+5':'0')
    + printCritRow(s.accessibleCare, fr?'Entretien accessible':'Accessible care (no dry-cleaning)', s.accessibleCare?'+3':'0')
    + printCritRow(s.easilyAltered, fr?'Facilement modifiable':'Easily altered to extend lifespan', s.easilyAltered?'+5':'0')
    + printCritRow(s.compostable, fr?'Compostable ou biodégradable':'Compostable or biodegradable', s.compostable?'+10':'0')
    + printCritRow(s.easyDisassemble, fr?'Facile à démonter':'Easy to disassemble for recycling', s.easyDisassemble?'+7':'0')
    + (s.additionalComments ? printQual(fr?'Commentaires':'Comments', s.additionalComments) : '');
}


