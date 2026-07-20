/* ---------------------------------------------------------------------
   i18n: language dictionary + apply/toggle logic
--------------------------------------------------------------------- */
let currentLang = "fr";

const TRANSLATIONS = {
  fr: {
    docTitle:"Tableau de bord de perfectionnement professionnel",
    appSubtitle:"Vue de la personne responsable de programmes académiques",
    themeDark:"Mode sombre", themeLight:"Mode clair",
    btnLoadPlans:"Charger des plans (JSON)", btnClearPlans:"Vider les plans",
    btnLoadNotes:"Charger mes notes", btnExportNotes:"Exporter mes notes",
    btnOpenDrawer:"Import / Export", drawerTitle:"Import / Export",
    drawerHint:"Rien n'est envoyé en ligne — tout reste dans cette session de navigateur, sauf ce que vous exportez vous-même.",
    drawerSectionPlans:"Plans des personnes enseignantes", drawerSectionNotes:"Mes notes de revue", drawerSectionAxes:"Axes de qualité (configuration)",
    tabList:"Liste des plans", tabRadar:"Radar qualité", tabStats:"Statistiques",
    h2PlansLoaded:"Plans chargés",
    listHint:"Chargez les fichiers JSON exportés par les personnes enseignantes. Rien n'est envoyé en ligne — tout reste dans cette session de navigateur, sauf ce que vous exportez vous-même.",
    dropzoneText:"Glissez-déposez des fichiers .json ici, ou utilisez « Charger des plans » ci-dessus.",
    searchPlaceholder:"Rechercher par nom, courriel, numéro d'employé, titre d'activité, note...",
    filterPlanAll:"Statut du plan — tous", statusExpired:"Expiré", statusSoon:"Bientôt à réviser", statusOk:"À jour", statusUnknown:"Date manquante",
    filterReviewAll:"Statut de revue — tous", reviewNew:"Nouveau — non revu", reviewUpdated:"Mis à jour depuis la revue", reviewReviewed:"Revu",
    thresholdLabel:"Seuil « bientôt »", thresholdSuffix:"jours",
    thName:"Nom", thEmail:"Courriel institutionnel", thEmployee:"N° employé", thCreated:"Créé le", thEndDate:"Fin visée",
    thPlanStatus:"Statut du plan", thReviewStatus:"Statut de revue", thActivities:"Activités", thRdCount:"R&D proposées", thSabbatical:"Sabbatique",
    h2Radar:"Radar qualité d'enseignement",
    radarHint:"Les bandes montrent la répartition (minimum, quartiles, maximum) des positions actuelles auto-évaluées, pour les plans correspondant au filtre courant. Un enseignant peut être superposé en ligne, par-dessus les bandes.",
    overlayLabel:"Superposer un enseignant", overlayNone:"Aucun",
    minGroupLabel:"Taille minimale du groupe pour afficher",
    h2Stats:"Analyse des besoins de formation et perfectionnement",
    statsHint:"Agrégation de tous les plans actuellement chargés dans cette session.",
    h3ChartCategory:"Catégorie d'activité", h3ChartFormat:"Format d'activité", h3ChartRD:"Catégorie R&D proposée",
    h3Skills:"Compétences disciplinaires signalées", h3Sabbaticals:"Sabbatiques envisagées",
    btnExportCsv:"Exporter les statistiques (CSV)", btnClose:"Fermer ✕",
    emptyNoRows:"Aucun plan chargé, ou aucun résultat pour ces filtres.",
    chipExpired:"Plans expirés", chipSoon:"Bientôt à réviser", chipUnreviewed:"Non revus (nouveaux ou mis à jour)", chipAll:"Total des plans chargés",
    confirmClearPlans:"Retirer tous les plans chargés de cette session ? (vos notes privées ne sont pas affectées)",
    confirmClearNotes:"Retirer tous les plans chargés de cette session ?",
    noDataEmpty:"Aucune donnée.",
    noneNoted:"Aucun congé envisagé signalé.", noSkillsNoted:"Aucune compétence disciplinaire signalée.",
    colPerson:"Personne", colDescription:"Description", colSkill:"Compétence", colType:"Type", colWhen:"Quand", colNewCourses:"Nouveaux cours",
    plansLoadedCard:"Plans chargés", activitiesPlannedCard:"Activités planifiées", rdActivitiesCard:"Activités proposées en R&D",
    rdApprovedSuffix:"approuvées", sabbaticalsCard:"Congés sans solde envisagés",
    detailNoAppr:"", noActivities:"Aucune activité.",
    kvEmail:"Courriel institutionnel", kvEmployee:"N° employé", kvCreated:"Créé le", kvEndDate:"Fin visée", kvLastMod:"Dernière modif.",
    sectionApprHistory:"Appréciation étudiante — historique", sectionActivities:"Activités", sectionSabbatical:"Congé sans solde envisagé",
    sectionBudgetNotes:"Notes de planification budgétaire", sectionSkills:"Compétences disciplinaires",
    btnGoToRadarLabel:"Voir le radar qualité de cette personne",
    reviewHistoryTitle:"Historique des revues avec cette personne", reviewNoneYet:"Aucune revue enregistrée.",
    reviewDateLabel:"Date de la revue", reviewNoteLabel:"Note sur cette revue (optionnel)", btnAddReview:"+ Enregistrer cette revue",
    privateNotesTitle:"Notes privées générales (non partagées avec la personne enseignante)",
    privateNotesHint:"Ces notes restent uniquement dans votre session, à moins que vous ne les exportiez via « Exporter mes notes ».",
    legendMin:"Minimum", legendQ1:"Q1", legendMedian:"Médiane", legendQ3:"Q3", legendMax:"Maximum", legendCurrent:"Position actuelle", legendGoal:"Objectif",
    axesAutoNote:"Axes chargés automatiquement depuis axes.json.", axesDefaultNote:"Axes par défaut utilisés (fichier de configuration non disponible).",
    errPlanRead:"", notesLoadedAlert:"Notes chargées.", errNotesRead:"Impossible de lire ce fichier comme des notes valides.",
    guardMessage:"Pas assez de plans avec auto-position pour préserver l'anonymat (minimum {N}; {C} disponible{CS} selon le filtre courant).",
    aiAttribTitle:"Comment cet outil a été créé",
    aiAttribP1:"Cet outil a été construit par une collaboration itérative entre Elisa Schaeffer, Doyenne de la Technologie et du Design au Collège LaSalle Montréal, et Claude (Anthropic), un assistant IA. Le contenu pédagogique, la structure, les fonctionnalités, les priorités et les choix éditoriaux ont été définis, questionnés et affinés par Elisa à chaque étape. Claude a généré le code, proposé des formulations et signalé les incohérences — mais chaque décision substantielle a été prise par un être humain.",
    aiAttribP2:"Ce n'est pas du contenu IA généré en une seule fois. C'est le résultat d'un dialogue de révision prolongé : chaque session a été lue, critiquée et corrigée. L'outil évolue.",
    aiAttribP3Strong:"Utilisation réfléchie de l'IA",
    aiAttribP3Rest:"L'IA générative est un outil de travail, non un substitut au jugement professionnel. Ce projet illustre une approche où l'humain reste l'auteur·rice : l'IA amplifie la capacité de production, mais la responsabilité éditoriale, pédagogique et éthique reste entièrement humaine. Dernière mise à jour : juillet 2026.",
  },
  en: {
    docTitle:"Professional Development Dashboard",
    appSubtitle:"Program coordinator view",
    themeDark:"Dark mode", themeLight:"Light mode",
    btnLoadPlans:"Load plans (JSON)", btnClearPlans:"Clear plans",
    btnLoadNotes:"Load my notes", btnExportNotes:"Export my notes",
    btnOpenDrawer:"Import / Export", drawerTitle:"Import / Export",
    drawerHint:"Nothing is sent online — everything stays in this browser session, except what you export yourself.",
    drawerSectionPlans:"Teacher plans", drawerSectionNotes:"My review notes", drawerSectionAxes:"Quality axes (configuration)",
    tabList:"Plan list", tabRadar:"Quality radar", tabStats:"Statistics",
    h2PlansLoaded:"Plans loaded",
    listHint:"Load the JSON files exported by teachers. Nothing is sent online — everything stays in this browser session, except what you export yourself.",
    dropzoneText:"Drag and drop .json files here, or use \"Load plans\" above.",
    searchPlaceholder:"Search by name, email, employee number, activity title, note...",
    filterPlanAll:"Plan status — all", statusExpired:"Expired", statusSoon:"Due soon", statusOk:"Up to date", statusUnknown:"Missing date",
    filterReviewAll:"Review status — all", reviewNew:"New — not reviewed", reviewUpdated:"Updated since review", reviewReviewed:"Reviewed",
    thresholdLabel:"\"Due soon\" threshold", thresholdSuffix:"days",
    thName:"Name", thEmail:"Institutional email", thEmployee:"Employee #", thCreated:"Created on", thEndDate:"Target end",
    thPlanStatus:"Plan status", thReviewStatus:"Review status", thActivities:"Activities", thRdCount:"R&D proposed", thSabbatical:"Sabbatical",
    h2Radar:"Quality of instruction radar",
    radarHint:"The bands show the spread (minimum, quartiles, maximum) of self-assessed current positions, for plans matching the current filter. One teacher can be overlaid as a line on top of the bands.",
    overlayLabel:"Overlay a teacher", overlayNone:"None",
    minGroupLabel:"Minimum group size to display",
    h2Stats:"Analysis of training and development needs",
    statsHint:"Aggregation of all plans currently loaded in this session.",
    h3ChartCategory:"Activity category", h3ChartFormat:"Activity format", h3ChartRD:"Proposed R&D category",
    h3Skills:"Reported subject-matter skills", h3Sabbaticals:"Sabbaticals under consideration",
    btnExportCsv:"Export statistics (CSV)", btnClose:"Close ✕",
    emptyNoRows:"No plans loaded, or no results for these filters.",
    chipExpired:"Expired plans", chipSoon:"Due soon", chipUnreviewed:"Not reviewed (new or updated)", chipAll:"Total plans loaded",
    confirmClearPlans:"Remove all plans loaded in this session? (your private notes are not affected)",
    confirmClearNotes:"Remove all plans loaded in this session?",
    noDataEmpty:"No data.",
    noneNoted:"No leave under consideration reported.", noSkillsNoted:"No subject-matter skill reported.",
    colPerson:"Person", colDescription:"Description", colSkill:"Skill", colType:"Type", colWhen:"When", colNewCourses:"New courses",
    plansLoadedCard:"Plans loaded", activitiesPlannedCard:"Activities planned", rdActivitiesCard:"Activities proposed as R&D",
    rdApprovedSuffix:"approved", sabbaticalsCard:"Unpaid leaves under consideration",
    detailNoAppr:"", noActivities:"No activities.",
    kvEmail:"Institutional email", kvEmployee:"Employee #", kvCreated:"Created on", kvEndDate:"Target end", kvLastMod:"Last modified",
    sectionApprHistory:"Student feedback — history", sectionActivities:"Activities", sectionSabbatical:"Unpaid leave under consideration",
    sectionBudgetNotes:"Budget planning notes", sectionSkills:"Subject-matter skills",
    btnGoToRadarLabel:"View this person's quality radar",
    reviewHistoryTitle:"Review history with this person", reviewNoneYet:"No review recorded yet.",
    reviewDateLabel:"Review date", reviewNoteLabel:"Note on this review (optional)", btnAddReview:"+ Save this review",
    privateNotesTitle:"General private notes (not shared with the teacher)",
    privateNotesHint:"These notes remain only in your session unless you export them via \"Export my notes\".",
    legendMin:"Minimum", legendQ1:"Q1", legendMedian:"Median", legendQ3:"Q3", legendMax:"Maximum", legendCurrent:"Current position", legendGoal:"Goal",
    axesAutoNote:"Axes loaded automatically from axes.json.", axesDefaultNote:"Default axes in use (configuration file unavailable).",
    errPlanRead:"", notesLoadedAlert:"Notes loaded.", errNotesRead:"Could not read this file as valid notes.",
    guardMessage:"Not enough plans with self-positioning data to preserve anonymity (minimum {N}; {C} available under the current filter).",
    aiAttribTitle:"How this tool was made",
    aiAttribP1:"This tool was built through an iterative collaboration between Elisa Schaeffer, Dean of Technology and Design at Collège LaSalle Montréal, and Claude (Anthropic), an AI assistant. The pedagogical content, structure, features, priorities, and editorial choices were defined, questioned, and refined by Elisa at every step. Claude generated the code, proposed wording, and flagged inconsistencies — but every substantive decision was made by a human.",
    aiAttribP2:"This is not one-shot AI-generated content. It is the result of an extended review dialogue: each session was read, critiqued, and corrected. The tool continues to evolve.",
    aiAttribP3Strong:"Thoughtful use of AI",
    aiAttribP3Rest:"Generative AI is a working tool, not a substitute for professional judgment. This project illustrates an approach where the human remains the author: AI amplifies production capacity, but editorial, pedagogical, and ethical responsibility remains entirely human. Last updated: July 2026.",
  }
};

function t(key){
  const dict = TRANSLATIONS[currentLang] || TRANSLATIONS.fr;
  return (key in dict) ? dict[key] : ((key in TRANSLATIONS.fr) ? TRANSLATIONS.fr[key] : key);
}

function applyStaticI18n(){
  document.querySelectorAll("[data-i18n]").forEach(el=>{ el.textContent = t(el.getAttribute("data-i18n")); });
  document.querySelectorAll("[data-i18n-placeholder]").forEach(el=>{ el.placeholder = t(el.getAttribute("data-i18n-placeholder")); });
  document.documentElement.lang = currentLang;
}

function isDarkTheme(){ return document.documentElement.getAttribute("data-theme") === "dark"; }
function themeC(light, dark){ return isDarkTheme() ? dark : light; }
function axLabel(ax){ return currentLang==="en" && ax.labelEn ? ax.labelEn : ax.label; }

function initTheme(){
  const saved = localStorage.getItem("plan-perfectionnement-theme");
  const theme = saved || (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
  document.documentElement.setAttribute("data-theme", theme);
  updateThemeButton();
}
function updateThemeButton(){
  const btn = document.getElementById("btnThemeToggle");
  if(!btn) return;
  btn.textContent = isDarkTheme() ? t("themeLight") : t("themeDark");
}
document.getElementById("btnThemeToggle").addEventListener("click", ()=>{
  const next = isDarkTheme() ? "light" : "dark";
  document.documentElement.setAttribute("data-theme", next);
  localStorage.setItem("plan-perfectionnement-theme", next);
  updateThemeButton();
  renderAll();
});

function applyLanguage(lang){
  currentLang = lang;
  localStorage.setItem("plan-perfectionnement-lang", lang);
  applyStaticI18n();
  document.getElementById("btnLangFr").classList.toggle("active", lang==="fr");
  document.getElementById("btnLangEn").classList.toggle("active", lang==="en");
  updateThemeButton();
  renderAll();
}
document.getElementById("btnLangFr").addEventListener("click", ()=>applyLanguage("fr"));
document.getElementById("btnLangEn").addEventListener("click", ()=>applyLanguage("en"));

/* ---------------------------------------------------------------------
   Taxonomy (must match the teacher-facing tool)
--------------------------------------------------------------------- */
function CATEGORY_LABELS(){ return currentLang==="en" ? {
  formation_individuelle:"Individual training (short-term)",
  perfectionnement_individuel:"Individual professional development (credited schooling)",
  recyclage:"Retraining", autre:"Other"
} : {
  formation_individuelle:"Formation individuelle (courte durée)",
  perfectionnement_individuel:"Perfectionnement individuel (scolarité créditée)",
  recyclage:"Recyclage", autre:"Autre"
}; }
function FORMAT_LABELS(){ return currentLang==="en" ? {
  seminaire:"Seminar", colloque:"Colloquium or conference", congres:"Colloquium or conference", colloque_congres:"Colloquium or conference", conference:"Talk",
  stage:"Industry placement", cours_non_credite:"Non-credited course", cours_credite:"Credited course",
  atelier:"Workshop", mentorat:"Mentoring / peer training", autre:"Other"
} : {
  seminaire:"Séminaire", colloque:"Colloque ou congrès", congres:"Colloque ou congrès", colloque_congres:"Colloque ou congrès", conference:"Conférence",
  stage:"Stage en milieu industriel", cours_non_credite:"Cours non crédité", cours_credite:"Cours crédité",
  atelier:"Atelier", mentorat:"Mentorat / formation entre pairs", autre:"Autre"
}; }
function RD_LABELS(){ return currentLang==="en" ? {
  a:"a) Teaching materials, shared course plans", b:"b) Program-level work",
  c:"c) Promotional activities", d:"d) Student success plan", e:"e) Committee participation",
  f:"f) Professional assistance", g:"g) Pedagogical development", h:"h) Disciplinary development"
} : {
  a:"a) Matériel didactique, plans de cours communs", b:"b) Intervention sur les programmes",
  c:"c) Activités promotionnelles", d:"d) Plan de réussite", e:"e) Participation à un comité",
  f:"f) Assistance professionnelle", g:"g) Perfectionnement pédagogique", h:"h) Perfectionnement disciplinaire"
}; }
function RD_STATUS_LABELS(){ return currentLang==="en" ? { en_attente:"Pending", approuvee:"Approved", refusee:"Refused" } : { en_attente:"En attente", approuvee:"Approuvée", refusee:"Refusée" }; }
function STATUS_LABELS(){ return currentLang==="en" ? { planned:"Planned", in_progress:"In progress", completed:"Completed", not_pursued:"Not pursued" } : { planned:"Planifiée", in_progress:"En cours", completed:"Complétée", not_pursued:"Non réalisée" }; }
function PLAN_STATUS_LABELS(){ return currentLang==="en" ? { expired:"Expired", soon:"Due soon", ok:"Up to date", unknown:"Missing date" } : { expired:"Expiré", soon:"Bientôt à réviser", ok:"À jour", unknown:"Date manquante" }; }
function REVIEW_STATUS_LABELS(){ return currentLang==="en" ? { new:"New — not reviewed", updated:"Updated since review", reviewed:"Reviewed" } : { new:"Nouveau — non revu", updated:"Mis à jour depuis la revue", reviewed:"Revu" }; }

const DEFAULT_AXES_CONFIG = {
  schemaVersion:"1.0", scaleMin:1, scaleMax:7,
  scaleLabels:["Très faible","Faible","Limité","Correct","Confortable","Confiant","Maîtrisé"],
  axes:[
    {id:"clarte", label:"Clarté des explications", labelEn:"Clarity of explanations", icon:"\u{1F4A1}", description:"La capacité à expliquer les concepts de façon claire et compréhensible."},
    {id:"organisation", label:"Organisation du cours", labelEn:"Course organization", icon:"\u{1F5C2}", description:"La structure, la planification et la cohérence du déroulement du cours."},
    {id:"engagement", label:"Engagement des étudiants", labelEn:"Student engagement", icon:"\u{1F3AF}", description:"La capacité à susciter l'intérêt et la participation active des étudiants."},
    {id:"retroaction", label:"Rétroaction et évaluation", labelEn:"Feedback and assessment", icon:"\u{1F4AC}", description:"La qualité, la clarté et l'utilité de la rétroaction donnée aux étudiants."},
    {id:"disponibilite", label:"Disponibilité et soutien", labelEn:"Availability and support", icon:"\u{1F91D}", description:"L'accessibilité et le soutien offerts aux étudiants en dehors des cours."},
    {id:"gestion", label:"Gestion de classe", labelEn:"Classroom management", icon:"\u{1F9ED}", description:"La capacité à maintenir un environnement d'apprentissage respectueux et productif."},
    {id:"numerique", label:"Diversité des outils et du matériel pédagogique", labelEn:"Diversity of tools and materials", icon:"\u{1F9F0}", description:"Le recours à des outils et supports variés — numériques, imprimés, manipulables ou autres — choisis selon le besoin pédagogique plutôt que par défaut."}
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
function fmtShort(d){ if(!d || isNaN(d)) return "—"; return d.toLocaleDateString(currentLang==="en"?"en-CA":"fr-CA", {year:"numeric", month:"short", day:"numeric"}); }
function fmtDateTime(iso){ if(!iso) return "—"; const d=new Date(iso); if(isNaN(d)) return "—"; return d.toLocaleString(currentLang==="en"?"en-CA":"fr-CA", {year:"numeric",month:"short",day:"numeric",hour:"2-digit",minute:"2-digit"}); }

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
  if(confirm(t("confirmClearPlans"))){ plans=[]; renderAll(); }
});

function openIoDrawer(){
  document.getElementById("drawerOverlay").classList.add("show");
  document.getElementById("ioDrawer").classList.add("open");
}
function closeIoDrawer(){
  document.getElementById("drawerOverlay").classList.remove("show");
  document.getElementById("ioDrawer").classList.remove("open");
}
document.getElementById("btnOpenDrawer").addEventListener("click", openIoDrawer);
document.getElementById("btnCloseDrawer").addEventListener("click", closeIoDrawer);
document.getElementById("drawerOverlay").addEventListener("click", closeIoDrawer);

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
      alert(t("notesLoadedAlert"));
    }catch(err){ alert(t("errNotesRead") + "\n" + err.message); }
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
  const labels = { auto:t("axesAutoNote"), defaut:t("axesDefaultNote") };
  el.textContent = labels[axesSource] || "";
}

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
    teacherName: p.meta.teacherName || "—",
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
  return `<span class="badge ${cls}">${PLAN_STATUS_LABELS()[s]}</span>`;
}
function badgeForReviewStatus(s){
  const cls = s==="reviewed"?"":s==="updated"?"warn":"danger";
  return `<span class="badge ${cls}">${REVIEW_STATUS_LABELS()[s]}</span>`;
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
    <div class="summary-chip danger" id="chipExpired"><b>${counts.expired}</b>${t("chipExpired")}</div>
    <div class="summary-chip warn" id="chipSoon"><b>${counts.soon}</b>${t("chipSoon")}</div>
    <div class="summary-chip" id="chipUnreviewed"><b>${counts.notReviewed}</b>${t("chipUnreviewed")}</div>
    <div class="summary-chip" id="chipAll"><b>${plans.length}</b>${t("chipAll")}</div>
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
    tbody.innerHTML = `<tr><td colspan="10" class="empty-note">${t("emptyNoRows")}</td></tr>`;
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
      <td>${row.sabbatical ? `<span class="badge">${currentLang==="en"?"Yes":"Oui"}</span>` : "—"}</td>
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
    return ax ? axLabel(ax) : id;
  };
  const reviewInfo = getReviewInfo(p);
  const key = reviewInfo.key;
  const entry = ensureReviewEntry(key); // safe to create now; only persisted if exported

  let html = `<h3>${escapeHtml(p.meta.teacherName || "—")}</h3>`;
  html += `<div style="margin-bottom:12px;">${badgeForPlanStatus(getPlanStatus(p))} ${badgeForReviewStatus(reviewInfo.status)}</div>`;
  html += `<div class="kv"><b>${t("kvEmail")}</b><span>${escapeHtml(p.meta.email||"—")}</span></div>`;
  html += `<div class="kv"><b>${t("kvEmployee")}</b><span>${escapeHtml(p.meta.employeeNumber||"—")}</span></div>`;
  html += `<div class="kv"><b>${t("kvCreated")}</b><span>${fmtDateTime(p.meta.createdAt)}</span></div>`;
  html += `<div class="kv"><b>${t("kvEndDate")}</b><span>${p.meta.planEndDate||"—"}</span></div>`;
  html += `<div class="kv"><b>${t("kvLastMod")}</b><span>${fmtDateTime(p.meta.updatedAt)}</span></div>`;

  // --- private review box: dated review log + ongoing private notes ---
  html += `<div class="review-box">
    <label style="font-size:12px;color:var(--muted);font-weight:600;">${t("reviewHistoryTitle")}</label>
    <div id="rv-history" style="margin:6px 0 10px;">${renderReviewHistory(entry)}</div>
    <div class="row" style="align-items:flex-end;">
      <div style="flex:1;">
        <label style="font-size:11.5px;color:var(--muted);">${t("reviewDateLabel")}</label>
        <input type="date" id="rv-new-date" value="${new Date().toISOString().slice(0,10)}" style="width:100%;padding:6px 8px;border:1px solid var(--border);border-radius:6px;">
      </div>
    </div>
    <label style="font-size:11.5px;color:var(--muted);margin-top:8px;display:block;">${t("reviewNoteLabel")}</label>
    <textarea id="rv-new-note" style="min-height:50px;"></textarea>
    <button class="small" id="btnAddReview" style="margin-top:8px;">${t("btnAddReview")}</button>

    <div style="border-top:1px solid var(--border); margin-top:14px; padding-top:10px;">
      <label style="font-size:12px;color:var(--muted);font-weight:600;">${t("privateNotesTitle")}</label>
      <textarea id="rv-notes">${escapeHtml(entry.privateNotes||"")}</textarea>
    </div>
    <div class="private-note">${t("privateNotesHint")}</div>
  </div>`;

  if((p.studentFeedbackHistory||[]).length){
    html += `<div class="detail-section"><h4>${t("sectionApprHistory")}</h4>`;
    [...p.studentFeedbackHistory].reverse().forEach(e=>{
      html += `<div style="margin-bottom:8px;"><div style="font-size:11.5px;color:var(--muted);">${fmtDateTime(e.addedAt)}</div><p style="font-size:13px;margin:2px 0 0;white-space:pre-wrap;">${escapeHtml(e.text)}</p></div>`;
    });
    html += `</div>`;
  }

  if((p.domainSkills||[]).length){
    const SKILL_KIND_LABELS = currentLang==="en" ? { nouvelle:"New skill", maintien:"Maintain / update" } : { nouvelle:"Nouvelle compétence", maintien:"Maintien / actualisation" };
    html += `<div class="detail-section"><h4>${t("sectionSkills")} (${p.domainSkills.length})</h4>`;
    p.domainSkills.forEach(sk=>{
      html += `<div style="margin-bottom:10px;padding-bottom:8px;border-bottom:1px dashed var(--border);">
        <b>${escapeHtml(sk.name||"—")}</b> <span class="tag">${SKILL_KIND_LABELS[sk.kind]||sk.kind}</span>
        ${sk.newCourses ? `<span class="tag badge">${t("colNewCourses")}${sk.newCoursesDetails ? " — "+escapeHtml(sk.newCoursesDetails) : ""}</span>` : ""}
        ${sk.when ? `<div style="font-size:12.5px;color:var(--muted);margin-top:2px;">${t("colWhen")} : ${escapeHtml(sk.when)}</div>` : ""}
        ${sk.plan ? `<div style="font-size:12.5px;color:var(--muted);margin-top:2px;">${currentLang==="en"?"How":"Comment"} : ${escapeHtml(sk.plan)}</div>` : ""}
      </div>`;
    });
    html += `</div>`;
  }

  html += `<div class="detail-section"><h4>${t("sectionActivities")} (${(p.activities||[]).length})</h4>`;
  (p.activities||[]).forEach(a=>{
    let rdTag = "";
    if(a.proposedRD){
      const stLabel = RD_STATUS_LABELS()[a.rdApprovalStatus||"en_attente"];
      const stCls = a.rdApprovalStatus==="approuvee" ? "" : a.rdApprovalStatus==="refusee" ? "danger" : "warn";
      rdTag = `<span class="tag badge ${stCls}" style="display:inline;">R&D — ${stLabel}${a.rdApprovedBy?" ("+escapeHtml(a.rdApprovedBy)+(a.rdApprovalDate?", "+a.rdApprovalDate:"")+")":""}</span>`;
    }
    html += `<div style="margin-bottom:10px;padding-bottom:8px;border-bottom:1px dashed var(--border);">
      <b>${escapeHtml(a.title||"—")}</b> ${rdTag}<br>
      <span style="font-size:12.5px;color:var(--muted);">${CATEGORY_LABELS()[a.category]||a.category} · ${FORMAT_LABELS()[a.format]||a.format} · ${STATUS_LABELS()[a.status]||a.status}${a.session?" · "+escapeHtml(a.session):""}${a.estimatedCost?" · "+Number(a.estimatedCost).toLocaleString("fr-CA")+" $":""}</span>
      ${(a.domains||[]).length ? `<div>${a.domains.map(id=>`<span class="tag">${escapeHtml(domainLabel(id))}</span>`).join("")}</div>` : ""}
    </div>`;
  });
  if((p.activities||[]).length===0) html += `<p class="empty-note">${t("noActivities")}</p>`;
  html += `</div>`;

  if(p.sabbatical && p.sabbatical.description && p.sabbatical.description.trim()){
    html += `<div class="detail-section"><h4>${t("sectionSabbatical")}</h4>
      <p style="font-size:13px;white-space:pre-wrap;">${escapeHtml(p.sabbatical.description)}</p>
    </div>`;
  }

  if(p.budgetPlanning && p.budgetPlanning.notes){
    html += `<div class="detail-section"><h4>${t("sectionBudgetNotes")}</h4><p style="font-size:13px;">${escapeHtml(p.budgetPlanning.notes)}</p></div>`;
  }

  const hasRadar = p.qualityRadar && Array.isArray(p.qualityRadar.entries) && p.qualityRadar.entries.some(e=>e.current!==null && e.current!==undefined);
  if(hasRadar){
    html += `<button class="small" id="btnGoToRadar" style="margin-top:4px;">${t("btnGoToRadarLabel")}</button>`;
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
  const fontSize = 17;
  const labelGap = 16;
  const markerFor = (ax,i) => `${i+1} ${ax.icon||""}`.trim();

  let R = opts.radius;
  if(R === undefined){
    R = size/2;
    axesList.forEach((ax,i)=>{
      const angle = angleFor(i);
      const w = textWidth(markerFor(ax,i), fontSize);
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
    els.push(`<polygon points="${ptsStr(pts)}" fill="none" stroke="${themeC('rgba(20,20,20,0.55)','rgba(255,255,255,0.5)')}" stroke-width="1.75"/>`);
  }
  for(let i=0;i<n;i++){
    const p = radarPoint(cx,cy,R,angleFor(i),scaleMax,scaleMin,scaleMax);
    els.push(`<line x1="${cx}" y1="${cy}" x2="${p.x.toFixed(1)}" y2="${p.y.toFixed(1)}" stroke="${themeC('rgba(20,20,20,0.55)','rgba(255,255,255,0.5)')}" stroke-width="1.75"/>`);
  }

  axesList.forEach((ax,i)=>{
    const angle = angleFor(i);
    const p = radarPoint(cx,cy,R+labelGap,angle,scaleMax,scaleMin,scaleMax);
    const cosA = Math.cos(angle);
    const anchor = cosA > 0.3 ? "start" : cosA < -0.3 ? "end" : "middle";
    els.push(`<g style="cursor:help;"><title>${escapeHtml(axLabel(ax))}</title><text x="${p.x.toFixed(1)}" y="${p.y.toFixed(1)}" font-size="${fontSize}" fill="${themeC('#3a3a38','#ECECE7')}" text-anchor="${anchor}" dominant-baseline="middle">${escapeHtml(markerFor(ax,i))}</text></g>`);
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
  select.innerHTML = `<option value="">${t("overlayNone")}</option>` + withRadar.map(p=>`<option value="${escapeHtml(p.meta.teacherName||"")}">${escapeHtml(p.meta.teacherName||"—")}</option>`).join("");
  if(withRadar.some(p=>p.meta.teacherName===prevSelection)) select.value = prevSelection;

  const minN = Number(document.getElementById("radarMinN").value) || 1;
  if(withRadar.length < minN){
    guard.style.display = "block";
    guard.textContent = t("guardMessage").replace("{N}", minN).replace("{C}", withRadar.length).replace("{CS}", withRadar.length===1?"":"s");
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
      lines.push({ values:curVals, stroke:themeC("#14181F","#ECECE7"), width:4 });
      lines.push({ values:goalVals, stroke:themeC("#14181F","#ECECE7"), width:4, dash:"6,4", pointFill:themeC("#FAF9F6","#1F2226") });
    }
  }

  svg.innerHTML = buildRadarSVG(axes, smin, smax, bands, lines, {size:560});

  document.getElementById("radarLegend").innerHTML = `
    <span><i style="background:#E24B4A;"></i>${t("legendMin")}</span>
    <span><i style="background:#EF9F27;"></i>${t("legendQ1")}</span>
    <span><i style="background:#F4C430;"></i>${t("legendMedian")}</span>
    <span><i style="background:#97C459;"></i>${t("legendQ3")}</span>
    <span><i style="background:#3B8C22;"></i>${t("legendMax")}</span>
    ${selectedPlan ? `<span><svg width="18" height="10"><line x1="0" y1="5" x2="18" y2="5" stroke="${themeC('#14181F','#ECECE7')}" stroke-width="3"/></svg>${t("legendCurrent")}</span>
    <span><svg width="18" height="10"><line x1="0" y1="5" x2="18" y2="5" stroke="${themeC('#14181F','#ECECE7')}" stroke-width="3" stroke-dasharray="4,3"/></svg>${t("legendGoal")}</span>` : ""}
  `;

  document.getElementById("radarAxisKey").innerHTML = axes.map((ax,i)=>
    `<span>${i+1} ${ax.icon||""} ${escapeHtml(axLabel(ax))}</span>`
  ).join("");

  const notesEl = document.getElementById("radarTeacherNotes");
  if(!selectedPlan){ notesEl.innerHTML = ""; return; }
  let notesHtml = `<h3 style="font-size:14px; margin:0 0 10px;">${currentLang==="en"?"Written notes":"Notes écrites"} — ${escapeHtml(selectedPlan.meta.teacherName||"")}</h3>`;
  let any = false;
  axes.forEach(ax=>{
    const en = selectedPlan.qualityRadar.entries.find(e=>e.axisId===ax.id);
    if(!en || (!en.noteCurrent && !en.noteGoal)) return;
    any = true;
    notesHtml += `<div style="margin-bottom:10px;"><b style="font-size:13px;">${escapeHtml(axLabel(ax))}</b>`;
    if(en.noteCurrent) notesHtml += `<div style="font-size:12.5px;color:var(--muted);">${currentLang==="en"?"Current state":"État actuel"} : ${escapeHtml(en.noteCurrent)}</div>`;
    if(en.noteGoal) notesHtml += `<div style="font-size:12.5px;color:var(--muted);">${currentLang==="en"?"Planned improvement":"Amélioration prévue"} : ${escapeHtml(en.noteGoal)}</div>`;
    notesHtml += `</div>`;
  });
  if(selectedPlan.qualityRadar.targetDate) notesHtml += `<div style="font-size:12.5px;color:var(--muted);margin-top:6px;">${currentLang==="en"?"Target date":"Échéance visée"} : ${selectedPlan.qualityRadar.targetDate}</div>`;
  notesEl.innerHTML = any || selectedPlan.qualityRadar.targetDate ? notesHtml : "";
}


function renderBarChart(containerId, countsMap, labelMap, opts={}){
  const el = document.getElementById(containerId);
  const entries = Object.entries(countsMap).sort((a,b)=>b[1]-a[1]);
  if(entries.length===0){ el.innerHTML = `<div class="empty-note">${t("noDataEmpty")}</div>`; return; }
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
      sabbaticalEntries.push({name:p.meta.teacherName||"—", description:p.sabbatical.description});
    }
    (p.domainSkills||[]).forEach(sk=>{
      if(!sk.name) return;
      const kindLabels = currentLang==="en" ? { maintien:"Maintain / update", nouvelle:"New skill" } : { maintien:"Maintien / actualisation", nouvelle:"Nouvelle compétence" };
      skillEntries.push({
        name:p.meta.teacherName||"—",
        skill:sk.name,
        kind: kindLabels[sk.kind] || kindLabels.nouvelle,
        when: sk.when||"—",
        newCourses: sk.newCourses ? (currentLang==="en"?"Yes":"Oui") : "—"
      });
    });
  });

  document.getElementById("summaryCards").innerHTML = `
    <div class="summary-card"><div class="num">${plans.length}</div><div class="lbl">${t("plansLoadedCard")}</div></div>
    <div class="summary-card"><div class="num">${plans.reduce((s,p)=>s+(p.activities||[]).length,0)}</div><div class="lbl">${t("activitiesPlannedCard")}</div></div>
    <div class="summary-card"><div class="num">${rdTotal}</div><div class="lbl">${t("rdActivitiesCard")} (${rdApproved} ${t("rdApprovedSuffix")})</div></div>
    <div class="summary-card"><div class="num">${sabbaticalCount}</div><div class="lbl">${t("sabbaticalsCard")}</div></div>
  `;

  renderBarChart("chartCategory", categoryCounts, CATEGORY_LABELS());
  renderBarChart("chartFormat", formatCounts, FORMAT_LABELS());
  renderBarChart("chartRD", rdCounts, RD_LABELS(), {warn:true});

  const skillList = document.getElementById("skillList");
  if(skillList){
    if(skillEntries.length===0){ skillList.innerHTML = `<div class="empty-note">${t("noSkillsNoted")}</div>`; }
    else{
      skillList.innerHTML = `<table class='data'><thead><tr><th>${t("colPerson")}</th><th>${t("colSkill")}</th><th>${t("colType")}</th><th>${t("colWhen")}</th><th>${t("colNewCourses")}</th></tr></thead><tbody>` +
        skillEntries.map(e=>`<tr><td>${escapeHtml(e.name)}</td><td>${escapeHtml(e.skill)}</td><td>${escapeHtml(e.kind)}</td><td>${escapeHtml(e.when)}</td><td>${escapeHtml(e.newCourses)}</td></tr>`).join("") +
        "</tbody></table>";
    }
  }

  const leaveList = document.getElementById("leaveList");
  if(sabbaticalEntries.length===0){ leaveList.innerHTML = `<div class="empty-note">${t("noneNoted")}</div>`; }
  else{
    leaveList.innerHTML = `<table class='data'><thead><tr><th>${t("colPerson")}</th><th>${t("colDescription")}</th></tr></thead><tbody>` +
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
initTheme();
currentLang = localStorage.getItem("plan-perfectionnement-lang") || "fr";
applyStaticI18n();
document.getElementById("btnLangFr").classList.toggle("active", currentLang==="fr");
document.getElementById("btnLangEn").classList.toggle("active", currentLang==="en");
renderAll();
tryAutoLoadAxes();
