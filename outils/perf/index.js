/* ---------------------------------------------------------------------
   Constants & taxonomy
--------------------------------------------------------------------- */
const SCHEMA_VERSION = "2.0";

/* ---------------------------------------------------------------------
   i18n: language dictionary + apply/toggle logic
--------------------------------------------------------------------- */
let currentLang = "fr";

const TRANSLATIONS = {
  fr: {
    docTitle:"Plan personnel de perfectionnement",
    appSubtitle:"Outil de planification — perfectionnement et développement professionnel",
    btnNew:"Nouveau plan", btnImportPlan:"Charger un plan (JSON)", btnExportPlan:"Exporter en JSON",
    themeDark:"Mode sombre", themeLight:"Mode clair",
    tocSectionsTitle:"Sections", tocIdent:"Identification", tocTimeline:"Échéancier", tocSelfPos:"Auto-positionnement",
    tocAppr:"Appréciation étudiante", tocSkills:"Compétences disciplinaires", tocActivities:"Activités de perfectionnement",
    tocBudget:"Budget de perfectionnement", tocLeave:"Congé sans solde",
    portraitTitle:"Votre portrait de perfectionnement",
    portraitTeaserHint:"Une fois vos axes de qualité d'enseignement remplis, votre portrait apparaîtra ici : qui vous êtes aujourd'hui, et vers quoi vous évoluez. Votre radar est visible en tout temps dans la barre latérale, à gauche.",
    btnGoToAxes:"Remplir mes axes de qualité", portraitSubtitle:"Portrait de perfectionnement",
    labelToday:"Aujourd'hui", labelEvolving:"Vers quoi vous évoluez",
    h2Ident:"1. Identification",
    identHint:"Renseignements de base vous concernant, en tant que personne enseignante. La création et les modifications sont horodatées automatiquement.",
    labelName:"Votre nom", phName:"Prénom Nom",
    labelEmail:"Courriel institutionnel", labelEmployee:"Numéro d'employé", phEmployee:"Ex. 012345",
    labelCreated:"Créé le", labelUpdated:"Dernière modification", labelEndDate:"Date de fin visée du plan",
    endDateHint:"Par défaut, deux ans après la création. Vous pouvez la raccourcir; à chaque modification, vous pouvez la prolonger jusqu'à deux ans à partir d'aujourd'hui.",
    h2Timeline:"2. Échéancier",
    timelineHint:"Calculé à partir de la date de création et de la date de fin visée. Vous montre ce qui est prévu à la convention collective, s'il y a lieu — pas des obligations ajoutées par cet outil.",
    legendCycle:"Cycle du plan", legendApprReceived:"Appréciation étudiante reçue", legendBudgetReminders:"Rappels annuels — budget individuel",
    legendMilestonePlanned:"Jalon planifié", legendMilestoneDone:"Jalon complété",
    h3Milestones:"Jalons du plan",
    milestonesHint:"Ajoutez les formations que vous prévoyez suivre, les sondages que vous prévoyez mener, ou tout autre jalon — ils apparaîtront sur l'échéancier ci-dessus. Modifiez, supprimez ou marquez-les comme complétés au fil du temps.",
    btnAddMilestone:"+ Ajouter un jalon", emptyNoteMilestone:"Aucun jalon ajouté pour le moment.",
    labelMilestoneTitle:"Titre du jalon", phMilestoneTitle:"Ex. Compléter la formation en pédagogie numérique",
    labelMilestoneType:"Type", labelMilestoneDate:"Date visée", labelMilestoneCompleted:"Complété",
    milestone_formation:"Formation", milestone_sondage:"Sondage", milestone_autre:"Autre",
    h2SelfPos:"3. Auto-positionnement — axes de qualité d'enseignement",
    targetDateLabel:"Échéance visée pour l'atteinte de ces objectifs (optionnel)",
    legendCurrent:"Position actuelle", legendGoal:"Objectif",
    btnZoomRadar:"Agrandir le radar", radarZoomTitle:"Votre radar — vue agrandie",
    radarZoomHint:"Faites glisser un point pour ajuster votre position actuelle ou votre objectif directement sur le graphique — les curseurs se mettent à jour en même temps.",
    radarSidebarHint:"Votre radar se met à jour en direct dans la barre latérale, à gauche.",
    h3Appr:"Appréciation étudiante",
    apprHint:"Un champ libre, optionnel, pour y déposer et résumer une appréciation étudiante formelle lorsque vous la recevez. Chaque entrée est conservée — rien n'est remplacé, l'historique s'accumule au fil des cycles.",
    apprPlaceholder:"Ex. résumé, tendances observées, extraits pertinents...",
    btnAddAppr:"+ Ajouter à l'historique", btnClose:"Fermer ✕",
    h3Survey:"Sondage étudiant",
    surveyHint:"Générez un sondage bilingue (français/anglais) à importer dans Microsoft Forms, puis importez les résultats pour les comparer à votre auto-positionnement.",
    btnGenDocx:"Générer le sondage (Word, bilingue)", btnImportResults:"Importer les résultats (Excel)",
    btnShowInstructions:"Comment importer ce sondage ?",
    instrTitle:"Comment importer et configurer ce sondage",
    instrStep1:"Cliquez sur « Générer le sondage » pour télécharger le fichier Word.",
    instrStep2:"Rendez-vous sur <strong>forms.office.com</strong>.",
    instrStep3:"Cliquez sur <strong>« Importation rapide »</strong> — pas sur « Nouveau formulaire » ni « Nouveau questionnaire ».",
    instrStep4:"Sélectionnez le fichier Word que vous venez de télécharger.",
    instrStep5:"Dans la fenêtre « Importer mon fichier en tant que », choisissez impérativement <strong>« Formulaire »</strong> — pas « Questionnaire ». Le mode Questionnaire active la notation automatique, ce qui n'a pas de sens pour un sondage de rétroaction.",
    instrStep6:"Une fois l'importation terminée, cliquez sur « Vérifier » et confirmez que chaque question a bien été reconnue comme un choix unique (et non comme du texte libre).",
    instrStep7:"<strong>Anonymat :</strong> ouvrez les paramètres du formulaire (icône « ... » ou « Paramètres ») et désactivez l'option qui enregistre le nom des répondants (habituellement « Enregistrer le nom »).",
    instrStep8:"Publiez le formulaire et partagez le lien avec vos étudiants.",
    instrStep9:"Une fois les réponses recueillies, exportez-les vers Excel depuis Microsoft Forms, puis revenez ici et cliquez sur « Importer les résultats (Excel) ».",
    instrWhyNote:"Ces réglages (Formulaire plutôt que Questionnaire, anonymat désactivé) ne sont pas inclus dans le fichier Word lui-même — s'ils l'étaient, ils apparaîtraient comme du contenu dans le sondage que vos étudiants verraient, et vous risqueriez d'oublier de les retirer avant de publier.",
    h2Skills:"4. Compétences disciplinaires",
    skillsHint:"Propre à votre discipline ou champ d'expertise — distinct des axes généraux de qualité d'enseignement ci-dessus. Ajoutez une carte par compétence : une nouvelle à développer, ou une expertise existante à maintenir ou actualiser.",
    btnAddSkill:"+ Ajouter une compétence",
    h2Activities:"5. Activités de perfectionnement",
    activitiesHint:"Ce plan est une proposition. Les approbations correspondantes (budget, R&D, reconnaissance) doivent être obtenues séparément, par les voies et processus institutionnels établis à cette fin. Ajoutez une carte par activité prévue ou réalisée — les listes déroulantes permettent l'analyse statistique par le responsable de programmes.",
    rdTitle:"Reconnaissance en R&D",
    rdWarnText:"Ce plan n'accorde aucune approbation. Une activité cochée « proposée en R&D » n'est reconnue comme telle qu'après approbation écrite préalable de la Direction des études — une fois obtenue, indiquez qui l'a approuvée et à quelle date. Si elle est refusée, révisez le plan en conséquence.",
    btnAddActivity:"+ Ajouter une activité",
    h2Budget:"6. Planification du budget de perfectionnement",
    budgetHint:"Planification seulement — le traitement financier réel (approbation, remboursement) est géré séparément, selon la convention collective ou les politiques internes en vigueur (selon le cas). Ce tableau reprend le coût estimé des activités ci-dessus, regroupé par année académique puisqu'il est appelé à s'accumuler d'année en année.",
    thYear:"Année académique", thActivity:"Activité", thCategory:"Catégorie", thCost:"Coût estimé (CAD)",
    totalLabel:"Total estimé (toutes années)",
    budgetReminder:"Rappel : consultez la convention collective ou les politiques internes en vigueur (selon le cas) pour le montant exact et les modalités du budget individuel de perfectionnement (généralement non cumulatif et non transférable d'une année à l'autre).",
    budgetNotesLabel:"Notes de planification (optionnel)", budgetNotesPlaceholder:"Ex. priorisation si le budget ne couvre pas toutes les activités...",
    h2Leave:"7. Congé sans solde (perfectionnement ou affaires professionnelles)",
    leaveHint:"Champ optionnel. Décrivez votre projet si vous envisagez un tel congé, et le moment où vous souhaiteriez le prendre — ceci n'est pas une demande formelle.",
    sabDescLabel:"Description (optionnel)", sabPlaceholder:"Ex. projet envisagé, moment souhaité, durée approximative...",
    leaveInfoText:"Consultez la convention collective ou les politiques internes en vigueur (selon le cas) pour les critères d'admissibilité, les modalités, les délais de demande et de prolongation, ainsi que les effets sur l'ancienneté et l'affichage du poste. Cette section n'enclenche aucune démarche formelle.",
    footerText:"Plan personnel de perfectionnement — outil de planification interne. Ne remplace aucune disposition de la convention collective ou des politiques internes en vigueur (selon le cas).",
    aiAttribTitle:"Comment cet outil a été créé",
    aiAttribP1:"Cet outil a été construit par une collaboration itérative entre Elisa Schaeffer, Doyenne de la Technologie et du Design au Collège LaSalle Montréal, et Claude (Anthropic), un assistant IA. Le contenu pédagogique, la structure, les fonctionnalités, les priorités et les choix éditoriaux ont été définis, questionnés et affinés par Elisa à chaque étape. Claude a généré le code, proposé des formulations et signalé les incohérences — mais chaque décision substantielle a été prise par un être humain.",
    aiAttribP2:"Ce n'est pas du contenu IA généré en une seule fois. C'est le résultat d'un dialogue de révision prolongé : chaque session a été lue, critiquée et corrigée. L'outil évolue.",
    aiAttribP3Strong:"Utilisation réfléchie de l'IA",
    aiAttribP3Rest:"L'IA générative est un outil de travail, non un substitut au jugement professionnel. Ce projet illustre une approche où l'humain reste l'auteur·rice : l'IA amplifie la capacité de production, mais la responsabilité éditoriale, pédagogique et éthique reste entièrement humaine. Dernière mise à jour : juillet 2026.",

    // dynamic content
    emptyNoteAxis:"Aucune entrée pour le moment.",
    labelDomainCurrent:"Position actuelle", labelDomainGoal:"Objectif",
    ideasBtn:"Idées et pistes", ideasBtnHide:"Masquer les idées", ideasBoxTitle:"Pistes et bonnes pratiques (pas seulement numériques)",
    labelNoteCurrent:"Notes — état actuel (optionnel)", labelNoteGoal:"Notes — amélioration prévue (optionnel)",
    phNoteCurrent:"Ex. ce qui explique cette position...", phNoteGoal:"Ex. moyens envisagés pour progresser...",
    emptyNoteAppr:"Aucune entrée pour le moment.",
    surveyImportedStatus:"{N} réponse{S} importée{S} — {M} axe{MS} sur {T} reconnu{MS} dans le fichier.",
    legendMin:"Minimum", legendQ1:"Q1", legendMedian:"Médiane", legendQ3:"Q3", legendMax:"Maximum (réponses étudiantes)", legendSelfEval:"Votre auto-positionnement",
    emptyNoteSkill:"Aucune compétence ajoutée pour le moment.",
    labelSkillName:"Compétence ou expertise", phSkillName:"Ex. Analyse de données avec Python",
    labelSkillType:"Type", labelSkillHow:"Comment (moyen envisagé)", phSkillHow:"Ex. autoformation, mentorat, cours crédité...",
    labelSkillWhen:"Quand", phSkillWhen:"Ex. Session Hiver 2027",
    labelSkillNewCourses:"Souhaite enseigner de nouveaux cours une fois cette compétence acquise",
    labelSkillNewCoursesDetails:"Lesquels (optionnel)", phSkillNewCoursesDetails:"Ex. cours d'introduction à la science des données",
    btnRemove:"Retirer",
    emptyNoteActivity:"Aucune activité ajoutée pour le moment.",
    labelActivityTitle:"Titre de l'activité", phActivityTitle:"Ex. Colloque en pédagogie collégiale",
    labelCategory:"Catégorie", labelFormat:"Format", labelStatus:"Statut",
    labelAcademicYear:"Année académique", phAcademicYear:"Ex. 2026-2027",
    labelSession:"Session / période visée", phSession:"Ex. Session Automne 2026",
    labelCost:"Coût estimé (CAD)", labelProposedRD:"Proposée en R&D",
    labelDomains:"Domaine(s) visé(s)",
    labelRdCategory:"Catégorie R&D", labelRdStatus:"État de l'approbation", labelRdDate:"Date de la décision",
    labelRdBy:"Décidée par (nom et fonction, Direction des études)", phRdBy:"Ex. Jordan Léveillé, directeur des études",
    labelNotes:"Notes (optionnel)",
    rdMsgPending:"Rappel Cette activité n'est pas encore reconnue en R&D. Elle ne compte comme telle qu'une fois l'approbation écrite obtenue de la Direction des études — indiquez alors qui a approuvé et à quelle date.",
    rdMsgApproved:"Approuvée{BY}{DATE}. Conservez la confirmation écrite pour vos dossiers.",
    rdMsgRefused:"Refusée{BY}{DATE}. Cette activité ne compte pas comme temps de R&D. Révisez ce plan en conséquence — retirez la désignation R&D ou ajustez l'activité pour qu'il reflète la réalité.",
    emptyNoteBudget:"Aucune activité à afficher.",
    subtotalLabel:"Sous-total — {Y}",
    yearUnspecified:"Année non précisée",
    plusOneYear:"an", plusYears:"ans",
    portraitStrongOne:"Votre force la plus marquée est {A}.",
    portraitStrongTwo:"Vos forces les plus marquées sont {A} et {B}.",
    portraitGrowLine:"Votre plus grand pas prévu se situe en {A}, de {C} à {G}.",
    portraitNoGrow:"Aucun objectif de progression n'est encore défini au-delà de votre position actuelle.",
    portraitGrowingPill:"{N} {AXIS} en croissance", portraitStablePill:"{N} {AXIS} stable{S}",
    portraitFooterFilled:"D'après {F} axe{FS} sur {T} rempli{FS} jusqu'à présent.",
    portraitFooterTarget:"Échéance visée : {D}.",
    portraitNoName:"Portrait sans nom",
    confirmNewPlan:"Créer un nouveau plan vide ? Les données non exportées seront perdues.",
    errImportPlan:"Impossible de lire ce fichier comme un plan valide.",
    errAxesConfig:"Impossible de lire ce fichier comme une configuration d'axes valide.",
    errSurveyDocx:"Impossible de générer le sondage.",
    errSurveyExcel:"Impossible de lire ce fichier comme des résultats de sondage valides.",
    axesAutoNote:"", axesDefaultNote:"Axes par défaut utilisés (fichier de configuration non disponible).",
    planEstablished:"Plan établi", planEndVisee:"Fin visée du plan",
    reviewDueMonospace:"Relevé budget (15 nov.)", reviewDueMonospace2:"Relevé budget (15 mai)",

    cat_formation_individuelle:"Formation individuelle (courte durée)",
    cat_perfectionnement_individuel:"Perfectionnement individuel (scolarité créditée)",
    cat_recyclage:"Recyclage", cat_autre:"Autre",
    fmt_seminaire:"Séminaire", fmt_seminaire_d:"Rencontre de petit groupe, participative, pour approfondir un sujet précis avec échanges actifs entre les participants.",
    fmt_colloque_congres:"Colloque ou congrès", fmt_colloque_congres_d:"Événement scientifique ou professionnel réunissant plusieurs intervenants autour d'un thème — petite échelle (colloque) ou grande échelle, souvent annuelle et sur plusieurs jours (congrès).",
    fmt_conference:"Conférence", fmt_conference_d:"Exposé ou présentation ponctuelle, généralement par une seule personne, sur un sujet précis.",
    fmt_stage:"Stage en milieu industriel", fmt_stage_d:"Période d'immersion pratique en entreprise ou en milieu professionnel.",
    fmt_cours_non_credite:"Cours non crédité", fmt_cours_non_credite_d:"Cours suivi sans obtention de crédits académiques.",
    fmt_cours_credite:"Cours crédité", fmt_cours_credite_d:"Cours suivi avec obtention de crédits académiques (scolarité créditée).",
    fmt_atelier:"Atelier", fmt_atelier_d:"Activité pratique et interactive, en petit groupe, axée sur le développement d'habiletés concrètes.",
    fmt_mentorat:"Mentorat / formation entre pairs", fmt_mentorat_d:"Accompagnement individualisé par ou avec une personne collègue d'expérience.",
    fmt_autre:"Autre", fmt_autre_d:"Format qui ne correspond à aucune des catégories ci-dessus — précisez dans les notes.",
    rdcat_a:"a) Matériel didactique, plans de cours communs", rdcat_b:"b) Intervention sur les programmes",
    rdcat_c:"c) Activités promotionnelles", rdcat_d:"d) Plan de réussite", rdcat_e:"e) Participation à un comité",
    rdcat_f:"f) Assistance professionnelle (mentorat, formation entre pairs)", rdcat_g:"g) Perfectionnement pédagogique (stages, colloques, ateliers)",
    rdcat_h:"h) Séance de perfectionnement disciplinaire (personne chargée de cours)",
    rdstatus_en_attente:"En attente d'approbation", rdstatus_approuvee:"Approuvée", rdstatus_refusee:"Refusée",
    status_planned:"Planifiée", status_in_progress:"En cours", status_completed:"Complétée", status_not_pursued:"Non réalisée",
    skillkind_nouvelle:"Nouvelle compétence à développer", skillkind_maintien:"Expertise existante à maintenir ou actualiser",
  },
  en: {
    docTitle:"Personal Professional Development Plan",
    appSubtitle:"Planning tool — professional development",
    btnNew:"New plan", btnImportPlan:"Load a plan (JSON)", btnExportPlan:"Export as JSON",
    themeDark:"Dark mode", themeLight:"Light mode",
    tocSectionsTitle:"Sections", tocIdent:"Identification", tocTimeline:"Timeline", tocSelfPos:"Self-positioning",
    tocAppr:"Student feedback", tocSkills:"Subject-matter skills", tocActivities:"Professional development activities",
    tocBudget:"Professional development budget", tocLeave:"Unpaid leave",
    portraitTitle:"Your professional development portrait",
    portraitTeaserHint:"Once your quality-of-instruction axes are filled in, your portrait will appear here: who you are today, and where you're heading. Your radar is visible at all times in the sidebar, on the left.",
    btnGoToAxes:"Fill in my quality axes", portraitSubtitle:"Professional development portrait",
    labelToday:"Today", labelEvolving:"Where you're heading",
    h2Ident:"1. Identification",
    identHint:"Basic information about you as a teacher. Creation and edits are timestamped automatically.",
    labelName:"Your name", phName:"First Last",
    labelEmail:"Institutional email", labelEmployee:"Employee number", phEmployee:"E.g. 012345",
    labelCreated:"Created on", labelUpdated:"Last modified", labelEndDate:"Target end date of the plan",
    endDateHint:"Defaults to two years after creation. You may shorten it; with each edit, you may extend it up to two years from today.",
    h2Timeline:"2. Timeline",
    timelineHint:"Computed from the creation date and the target end date. Shows what's provided for under the collective agreement, if applicable — not obligations added by this tool.",
    legendCycle:"Plan cycle", legendApprReceived:"Student feedback received", legendBudgetReminders:"Annual reminders — individual budget",
    legendMilestonePlanned:"Planned milestone", legendMilestoneDone:"Completed milestone",
    h3Milestones:"Plan milestones",
    milestonesHint:"Add trainings you plan to complete, surveys you plan to conduct, or any other milestone — they'll appear on the timeline above. Edit, delete, or mark them complete as time goes on.",
    btnAddMilestone:"+ Add a milestone", emptyNoteMilestone:"No milestone added yet.",
    labelMilestoneTitle:"Milestone title", phMilestoneTitle:"E.g. Complete the digital pedagogy training",
    labelMilestoneType:"Type", labelMilestoneDate:"Target date", labelMilestoneCompleted:"Completed",
    milestone_formation:"Training", milestone_sondage:"Survey", milestone_autre:"Other",
    h2SelfPos:"3. Self-positioning — quality of instruction axes",
    targetDateLabel:"Target date for reaching these goals (optional)",
    legendCurrent:"Current position", legendGoal:"Goal",
    btnZoomRadar:"Enlarge the radar", radarZoomTitle:"Your radar — enlarged view",
    radarZoomHint:"Drag a point to adjust your current position or your goal directly on the chart — the sliders update at the same time.",
    radarSidebarHint:"Your radar updates live in the sidebar, on the left.",
    h3Appr:"Student feedback",
    apprHint:"A free, optional field to log and summarize formal student feedback whenever you receive it. Each entry is kept — nothing is replaced, the history accumulates across cycles.",
    apprPlaceholder:"E.g. summary, trends observed, relevant excerpts...",
    btnAddAppr:"+ Add to history", btnClose:"Close ✕",
    h3Survey:"Student survey",
    surveyHint:"Generate a bilingual (French/English) survey to import into Microsoft Forms, then import the results to compare against your self-assessment.",
    btnGenDocx:"Generate the survey (Word, bilingual)", btnImportResults:"Import results (Excel)",
    btnShowInstructions:"How do I import this survey?",
    instrTitle:"How to import and configure this survey",
    instrStep1:"Click \"Generate the survey\" to download the Word file.",
    instrStep2:"Go to <strong>forms.office.com</strong>.",
    instrStep3:"Click <strong>\"Quick Import\"</strong> — not \"New Form\" or \"New Quiz\".",
    instrStep4:"Select the Word file you just downloaded.",
    instrStep5:"In the \"Import my file as\" window, you must choose <strong>\"Form\"</strong> — not \"Quiz\". Quiz mode turns on automatic grading, which doesn't make sense for a feedback survey.",
    instrStep6:"Once the import finishes, click \"Review\" and confirm every question was recognized as single-choice (not as free text).",
    instrStep7:"<strong>Anonymity:</strong> open the form settings (the \"...\" icon or \"Settings\") and turn off the option that records respondent names (usually \"Record name\").",
    instrStep8:"Publish the form and share the link with your students.",
    instrStep9:"Once responses are in, export them to Excel from Microsoft Forms, then come back here and click \"Import results (Excel)\".",
    instrWhyNote:"These settings (Form rather than Quiz, anonymity turned off) aren't included in the Word file itself — if they were, they'd show up as content in the survey your students see, and you could easily forget to remove them before publishing.",
    h2Skills:"4. Subject-matter skills",
    skillsHint:"Specific to your discipline or area of expertise — distinct from the general quality-of-instruction axes above. Add one card per skill: a new one to develop, or existing expertise to maintain or update.",
    btnAddSkill:"+ Add a skill",
    h2Activities:"5. Professional development activities",
    activitiesHint:"This plan is a proposal. Corresponding approvals (budget, R&D, recognition) must be obtained separately, through the institutional channels and processes established for that purpose. Add one card per planned or completed activity — the dropdowns enable statistical analysis by the program coordinator.",
    rdTitle:"R&D recognition",
    rdWarnText:"This plan grants no approval. An activity checked \"proposed as R&D\" is only recognized as such after prior written approval from the Direction of Studies — once obtained, indicate who approved it and on what date. If refused, revise the plan accordingly.",
    btnAddActivity:"+ Add an activity",
    h2Budget:"6. Professional development budget planning",
    budgetHint:"Planning only — the actual financial process (approval, reimbursement) is handled separately, per the collective agreement or internal policies in effect (as applicable). This table simply reflects the estimated cost of the activities above, grouped by academic year since it's meant to accumulate year over year.",
    thYear:"Academic year", thActivity:"Activity", thCategory:"Category", thCost:"Estimated cost (CAD)",
    totalLabel:"Estimated total (all years)",
    budgetReminder:"Reminder: check the collective agreement or internal policies in effect (as applicable) for the exact amount and terms of the individual professional development budget (generally non-cumulative and non-transferable from year to year).",
    budgetNotesLabel:"Planning notes (optional)", budgetNotesPlaceholder:"E.g. prioritization if the budget doesn't cover all activities...",
    h2Leave:"7. Unpaid leave (professional development or professional business)",
    leaveHint:"Optional field. Describe your project if you're considering such a leave, and when you'd like to take it — this is not a formal request.",
    sabDescLabel:"Description (optional)", sabPlaceholder:"E.g. planned project, desired timing, approximate duration...",
    leaveInfoText:"Check the collective agreement or internal policies in effect (as applicable) for eligibility criteria, terms, request and extension deadlines, and the effects on seniority and position posting. This section does not trigger any formal process.",
    footerText:"Personal professional development plan — internal planning tool. Does not replace any provision of the collective agreement or internal policies in effect (as applicable).",
    aiAttribTitle:"How this tool was made",
    aiAttribP1:"This tool was built through an iterative collaboration between Elisa Schaeffer, Dean of Technology and Design at Collège LaSalle Montréal, and Claude (Anthropic), an AI assistant. The pedagogical content, structure, features, priorities, and editorial choices were defined, questioned, and refined by Elisa at every step. Claude generated the code, proposed wording, and flagged inconsistencies — but every substantive decision was made by a human.",
    aiAttribP2:"This is not one-shot AI-generated content. It is the result of an extended review dialogue: each session was read, critiqued, and corrected. The tool continues to evolve.",
    aiAttribP3Strong:"Thoughtful use of AI",
    aiAttribP3Rest:"Generative AI is a working tool, not a substitute for professional judgment. This project illustrates an approach where the human remains the author: AI amplifies production capacity, but editorial, pedagogical, and ethical responsibility remains entirely human. Last updated: July 2026.",

    emptyNoteAxis:"No entry yet.",
    labelDomainCurrent:"Current position", labelDomainGoal:"Goal",
    ideasBtn:"Ideas and pointers", ideasBtnHide:"Hide ideas", ideasBoxTitle:"Pointers and good practices (not just digital)",
    labelNoteCurrent:"Notes — current state (optional)", labelNoteGoal:"Notes — planned improvement (optional)",
    phNoteCurrent:"E.g. what explains this position...", phNoteGoal:"E.g. means envisioned to progress...",
    emptyNoteAppr:"No entry yet.",
    surveyImportedStatus:"{N} response{S} imported — {M} axis{MS} out of {T} recognized in the file.",
    legendMin:"Minimum", legendQ1:"Q1", legendMedian:"Median", legendQ3:"Q3", legendMax:"Maximum (student responses)", legendSelfEval:"Your self-assessment",
    emptyNoteSkill:"No skill added yet.",
    labelSkillName:"Skill or expertise", phSkillName:"E.g. Data analysis with Python",
    labelSkillType:"Type", labelSkillHow:"How (envisioned method)", phSkillHow:"E.g. self-study, mentoring, credited course...",
    labelSkillWhen:"When", phSkillWhen:"E.g. Winter 2027 session",
    labelSkillNewCourses:"Would like to teach new courses once this skill is acquired",
    labelSkillNewCoursesDetails:"Which ones (optional)", phSkillNewCoursesDetails:"E.g. introductory data science course",
    btnRemove:"Remove",
    emptyNoteActivity:"No activity added yet.",
    labelActivityTitle:"Activity title", phActivityTitle:"E.g. Conference on college pedagogy",
    labelCategory:"Category", labelFormat:"Format", labelStatus:"Status",
    labelAcademicYear:"Academic year", phAcademicYear:"E.g. 2026-2027",
    labelSession:"Session / target period", phSession:"E.g. Fall 2026 session",
    labelCost:"Estimated cost (CAD)", labelProposedRD:"Proposed as R&D",
    labelDomains:"Target domain(s)",
    labelRdCategory:"R&D category", labelRdStatus:"Approval status", labelRdDate:"Decision date",
    labelRdBy:"Decided by (name and role, Direction of Studies)", phRdBy:"E.g. Jordan Léveillé, director of studies",
    labelNotes:"Notes (optional)",
    rdMsgPending:"Reminder: this activity is not yet recognized as R&D. It only counts as such once written approval is obtained from the Direction of Studies — then indicate who approved it and on what date.",
    rdMsgApproved:"Approved{BY}{DATE}. Keep the written confirmation for your records.",
    rdMsgRefused:"Refused{BY}{DATE}. This activity does not count as R&D time. Revise this plan accordingly — remove the R&D designation or adjust the activity to reflect reality.",
    emptyNoteBudget:"No activity to display.",
    subtotalLabel:"Subtotal — {Y}",
    yearUnspecified:"Year not specified",
    plusOneYear:"yr", plusYears:"yrs",
    portraitStrongOne:"Your strongest area right now is {A}.",
    portraitStrongTwo:"Your strongest areas right now are {A} and {B}.",
    portraitGrowLine:"Your biggest planned step is in {A}, from {C} to {G}.",
    portraitNoGrow:"No growth goal is set yet beyond your current position.",
    portraitGrowingPill:"{N} {AXIS} growing", portraitStablePill:"{N} {AXIS} stable",
    portraitFooterFilled:"Based on {F} out of {T} axes filled in so far.",
    portraitFooterTarget:"Target date: {D}.",
    portraitNoName:"Untitled portrait",
    confirmNewPlan:"Create a new, empty plan? Unexported data will be lost.",
    errImportPlan:"Could not read this file as a valid plan.",
    errAxesConfig:"Could not read this file as a valid axes configuration.",
    errSurveyDocx:"Could not generate the survey.",
    errSurveyExcel:"Could not read this file as valid survey results.",
    axesAutoNote:"", axesDefaultNote:"Default axes in use (configuration file unavailable).",
    planEstablished:"Plan established", planEndVisee:"Plan target end",
    reviewDueMonospace:"Budget statement (Nov. 15)", reviewDueMonospace2:"Budget statement (May 15)",

    cat_formation_individuelle:"Individual training (short-term)",
    cat_perfectionnement_individuel:"Individual professional development (credited schooling)",
    cat_recyclage:"Retraining", cat_autre:"Other",
    fmt_seminaire:"Seminar", fmt_seminaire_d:"Small-group, participatory gathering to explore a specific topic in depth with active exchange among participants.",
    fmt_colloque_congres:"Colloquium or conference", fmt_colloque_congres_d:"Scientific or professional event bringing together several speakers around a theme — small scale (colloquium) or large scale, often annual and multi-day (conference/congress).",
    fmt_conference:"Talk", fmt_conference_d:"A one-off talk or presentation, generally by a single person, on a specific topic.",
    fmt_stage:"Industry placement", fmt_stage_d:"A period of hands-on immersion in a company or professional setting.",
    fmt_cours_non_credite:"Non-credited course", fmt_cours_non_credite_d:"A course taken without earning academic credits.",
    fmt_cours_credite:"Credited course", fmt_cours_credite_d:"A course taken while earning academic credits (credited schooling).",
    fmt_atelier:"Workshop", fmt_atelier_d:"A practical, interactive, small-group activity focused on developing concrete skills.",
    fmt_mentorat:"Mentoring / peer training", fmt_mentorat_d:"Individualized support by or with an experienced colleague.",
    fmt_autre:"Other", fmt_autre_d:"A format that doesn't fit any of the categories above — specify in the notes.",
    rdcat_a:"a) Teaching materials, shared course plans", rdcat_b:"b) Program-level work",
    rdcat_c:"c) Promotional activities", rdcat_d:"d) Student success plan", rdcat_e:"e) Committee participation",
    rdcat_f:"f) Professional assistance (mentoring, peer training)", rdcat_g:"g) Pedagogical development (placements, colloquia, workshops)",
    rdcat_h:"h) Disciplinary development session (part-time instructor)",
    rdstatus_en_attente:"Awaiting approval", rdstatus_approuvee:"Approved", rdstatus_refusee:"Refused",
    status_planned:"Planned", status_in_progress:"In progress", status_completed:"Completed", status_not_pursued:"Not pursued",
    skillkind_nouvelle:"New skill to develop", skillkind_maintien:"Existing expertise to maintain or update",
  }
};

function t(key){
  const dict = TRANSLATIONS[currentLang] || TRANSLATIONS.fr;
  return (key in dict) ? dict[key] : ((key in TRANSLATIONS.fr) ? TRANSLATIONS.fr[key] : key);
}

function applyStaticI18n(){
  document.querySelectorAll("[data-i18n]").forEach(el=>{ el.textContent = t(el.getAttribute("data-i18n")); });
  document.querySelectorAll("[data-i18n-html]").forEach(el=>{ el.innerHTML = t(el.getAttribute("data-i18n-html")); });
  document.querySelectorAll("[data-i18n-placeholder]").forEach(el=>{ el.placeholder = t(el.getAttribute("data-i18n-placeholder")); });
  document.querySelectorAll("[data-i18n-title]").forEach(el=>{ el.title = t(el.getAttribute("data-i18n-title")); });
  document.documentElement.lang = currentLang;
}

function applyLanguage(lang){
  currentLang = lang;
  localStorage.setItem("plan-perfectionnement-lang", lang);
  applyStaticI18n();
  document.getElementById("btnLangFr").classList.toggle("active", lang==="fr");
  document.getElementById("btnLangEn").classList.toggle("active", lang==="en");
  updateThemeButton();
  fullRender();
}
document.getElementById("btnLangFr").addEventListener("click", ()=>applyLanguage("fr"));
document.getElementById("btnLangEn").addEventListener("click", ()=>applyLanguage("en"));

const CATEGORY_OPTIONS = [
  {v:"formation_individuelle", k:"cat_formation_individuelle"},
  {v:"perfectionnement_individuel", k:"cat_perfectionnement_individuel"},
  {v:"recyclage", k:"cat_recyclage"},
  {v:"autre", k:"cat_autre"},
];

const FORMAT_OPTIONS = [
  {v:"seminaire", k:"fmt_seminaire", dk:"fmt_seminaire_d"},
  {v:"colloque_congres", k:"fmt_colloque_congres", dk:"fmt_colloque_congres_d"},
  {v:"conference", k:"fmt_conference", dk:"fmt_conference_d"},
  {v:"stage", k:"fmt_stage", dk:"fmt_stage_d"},
  {v:"cours_non_credite", k:"fmt_cours_non_credite", dk:"fmt_cours_non_credite_d"},
  {v:"cours_credite", k:"fmt_cours_credite", dk:"fmt_cours_credite_d"},
  {v:"atelier", k:"fmt_atelier", dk:"fmt_atelier_d"},
  {v:"mentorat", k:"fmt_mentorat", dk:"fmt_mentorat_d"},
  {v:"autre", k:"fmt_autre", dk:"fmt_autre_d"},
];

const RD_CATEGORY_OPTIONS = [
  {v:"a", k:"rdcat_a"}, {v:"b", k:"rdcat_b"}, {v:"c", k:"rdcat_c"}, {v:"d", k:"rdcat_d"},
  {v:"e", k:"rdcat_e"}, {v:"f", k:"rdcat_f"}, {v:"g", k:"rdcat_g"}, {v:"h", k:"rdcat_h"},
];

const RD_STATUS_OPTIONS = [
  {v:"en_attente", k:"rdstatus_en_attente"}, {v:"approuvee", k:"rdstatus_approuvee"}, {v:"refusee", k:"rdstatus_refusee"},
];

const STATUS_OPTIONS = [
  {v:"planned", k:"status_planned"}, {v:"in_progress", k:"status_in_progress"},
  {v:"completed", k:"status_completed"}, {v:"not_pursued", k:"status_not_pursued"},
];

function optLabel(opt){ return t(opt.k); }
function optDesc(opt){ return opt.dk ? t(opt.dk) : ""; }
function optByValue(list, v){ return list.find(o=>o.v===v); }

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
    {id:"clarte", label:"Clarté des explications", labelEn:"Clarity of explanations", icon:"💡", description:"La capacité à expliquer les concepts de façon claire et compréhensible.", descriptionEn:"The ability to explain concepts clearly and understandably.",
     ideas:["Utiliser des exemples concrets et des analogies tirées du quotidien","Varier les supports : tableau, schémas dessinés à la main, objets manipulables","Résumer les points clés oralement et par écrit à la fin de chaque section"],
     ideasEn:["Use concrete examples and everyday analogies","Vary the media used: whiteboard, hand-drawn diagrams, manipulable objects","Summarize key points both orally and in writing at the end of each section"]},
    {id:"organisation", label:"Organisation du cours", labelEn:"Course organization", icon:"🗂", description:"La structure, la planification et la cohérence du déroulement du cours.", descriptionEn:"The structure, planning, and coherence of how the course unfolds.",
     ideas:["Distribuer un plan de cours papier annoté au fil des séances","Utiliser des fiches ou un cahier de suivi pour structurer chaque séance","Prévoir des repères visuels affichés en classe (échéanciers, étapes du cours)"],
     ideasEn:["Hand out an annotated paper course outline as sessions progress","Use index cards or a tracking notebook to structure each session","Provide visual landmarks posted in class (timelines, course stages)"]},
    {id:"engagement", label:"Engagement des étudiants", labelEn:"Student engagement", icon:"🎯", description:"La capacité à susciter l'intérêt et la participation active des étudiants.", descriptionEn:"The ability to spark students' interest and active participation.",
     ideas:["Jeux de rôle, mises en situation ou études de cas sur papier","Discussions en petits groupes avec du matériel physique (cartes, jetons, tableaux blancs)","Projets pratiques utilisant du matériel réel du domaine étudié"],
     ideasEn:["Role-play, simulations, or paper-based case studies","Small-group discussions using physical materials (cards, tokens, whiteboards)","Practical projects using real materials from the field of study"]},
    {id:"retroaction", label:"Rétroaction et évaluation", labelEn:"Feedback and assessment", icon:"💬", description:"La qualité, la clarté et l'utilité de la rétroaction donnée aux étudiants.", descriptionEn:"The quality, clarity, and usefulness of feedback given to students.",
     ideas:["Rétroaction manuscrite personnalisée directement sur les copies","Grilles d'évaluation critériées partagées à l'avance, sur papier ou à l'écran","Courtes rencontres individuelles pour discuter des travaux"],
     ideasEn:["Personalized handwritten feedback directly on assignments","Criteria-based grading rubrics shared in advance, on paper or on screen","Short one-on-one meetings to discuss assignments"]},
    {id:"disponibilite", label:"Disponibilité et soutien", labelEn:"Availability and support", icon:"🤝", description:"L'accessibilité et le soutien offerts aux étudiants en dehors des cours.", descriptionEn:"Accessibility and support offered to students outside of class.",
     ideas:["Heures de bureau fixes, en personne ou par téléphone","Bibliothèque de ressources papier en libre accès (guides, exemples annotés)","Groupes d'entraide entre étudiants avec du matériel partagé"],
     ideasEn:["Fixed office hours, in person or by phone","A freely accessible library of paper resources (guides, annotated examples)","Peer support groups among students with shared materials"]},
    {id:"gestion", label:"Gestion de classe", labelEn:"Classroom management", icon:"🧭", description:"La capacité à maintenir un environnement d'apprentissage respectueux et productif.", descriptionEn:"The ability to maintain a respectful, productive learning environment.",
     ideas:["Supports physiques pour structurer les transitions (minuteries, signaux visuels)","Aménagement de l'espace (îlots, cercles de discussion)","Routines claires affichées en classe"],
     ideasEn:["Physical aids to structure transitions (timers, visual signals)","Room layout (islands, discussion circles)","Clear routines posted in the classroom"]},
    {id:"numerique", label:"Diversité des outils et du matériel pédagogique", labelEn:"Diversity of tools and materials", icon:"🧰", description:"Le recours à des outils et supports variés — numériques, imprimés, manipulables ou autres — choisis selon le besoin pédagogique plutôt que par défaut.", descriptionEn:"The use of varied tools and materials — digital, printed, hands-on, or otherwise — chosen based on pedagogical need rather than by default.",
     ideas:["Combiner plusieurs supports pour un même contenu (ex. démonstration physique + fiche papier + vidéo courte)","Maquettes, manipulables, matériel de laboratoire ou instruments propres à la discipline","Choisir l'outil — numérique ou non — en fonction du besoin pédagogique, pas de la nouveauté"],
     ideasEn:["Combine several media for the same content (e.g. physical demo + paper handout + short video)","Models, manipulables, lab equipment, or instruments specific to the discipline","Choose the tool — digital or not — based on pedagogical need, not novelty"]}
  ]
};
let AXES_CONFIG = JSON.parse(JSON.stringify(DEFAULT_AXES_CONFIG));
let axesSource = "defaut";

function isDarkTheme(){ return document.documentElement.getAttribute("data-theme") === "dark"; }
function themeC(light, dark){ return isDarkTheme() ? dark : light; }

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
  reRenderThemedVisuals();
});
function reRenderThemedVisuals(){
  renderSidebarRadar();
  renderRadarZoom();
  renderPortrait();
  renderSurveyComparative();
  renderTimeline();
  renderQualityRadar();
}

function axisWord(count){
  if(currentLang==="en") return count===1 ? "axis" : "axes";
  return count===1 ? "axe" : "axes";
}
function axLabel(ax){ return currentLang==="en" && ax.labelEn ? ax.labelEn : ax.label; }function axDesc(ax){ return currentLang==="en" && ax.descriptionEn ? ax.descriptionEn : (ax.description||""); }
function axIdeas(ax){ return currentLang==="en" && Array.isArray(ax.ideasEn) && ax.ideasEn.length ? ax.ideasEn : (ax.ideas||[]); }

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
  el.style.background = `linear-gradient(to right, ${color} 0%, ${color} ${pct}%, ${themeC("#E3E1D8","#3A3D42")} ${pct}%, ${themeC("#E3E1D8","#3A3D42")} 100%)`;
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
    milestones: [],
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
  return d.toLocaleDateString(currentLang==="en"?"en-CA":"fr-CA", {year:"numeric", month:"short", day:"numeric"});
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
    wrap.innerHTML = `<div class="empty-note">${t("emptyNoteAppr")}</div>`;
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
    "This survey is anonymous. Please answer honestly — your responses will help guide this teacher's professional development.",
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
  generateSurveyDocx()
    .then(()=>openImportInstructions())
    .catch(err=>alert(t("errSurveyDocx") + "\n" + err.message));
});

function openImportInstructions(){
  document.getElementById("importInstructionsOverlay").classList.add("show");
  document.getElementById("importInstructionsModal").classList.add("open");
}
function closeImportInstructions(){
  document.getElementById("importInstructionsOverlay").classList.remove("show");
  document.getElementById("importInstructionsModal").classList.remove("open");
}
document.getElementById("btnShowImportInstructions").addEventListener("click", openImportInstructions);
document.getElementById("btnCloseImportInstructions").addEventListener("click", closeImportInstructions);
document.getElementById("importInstructionsOverlay").addEventListener("click", closeImportInstructions);

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
      statusEl.textContent = t("surveyImportedStatus")
        .replace("{N}", result.responseCount)
        .replace(/{S}/g, result.responseCount===1 ? "" : "s")
        .replace("{M}", result.matchedAxes)
        .replace(/{MS}/g, result.matchedAxes===1 ? "" : "s")
        .replace("{T}", result.totalAxes);
      renderSurveyComparative();
    }catch(err){
      alert(t("errSurveyExcel") + "\n" + err.message);
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
  const lines = [{ values:selfVals, stroke:themeC("#14181F","#ECECE7"), width:4 }];

  const svg = document.getElementById("surveyRadarSvg");
  svg.innerHTML = buildRadarSVG(axes, smin, smax, bands, lines, {size:560});

  document.getElementById("surveyRadarLegend").innerHTML = `
    <span><i style="background:#E24B4A;"></i>${t("legendMin")}</span>
    <span><i style="background:#EF9F27;"></i>${t("legendQ1")}</span>
    <span><i style="background:#F4C430;"></i>${t("legendMedian")}</span>
    <span><i style="background:#97C459;"></i>${t("legendQ3")}</span>
    <span><i style="background:#3B8C22;"></i>${t("legendMax")}</span>
    <span><svg width="18" height="10"><line x1="0" y1="5" x2="18" y2="5" stroke="${themeC('#14181F','#ECECE7')}" stroke-width="3"/></svg>${t("legendSelfEval")}</span>
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
  const labels = { auto:t("axesAutoNote"), defaut:t("axesDefaultNote") };
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

function computeRadarGeometry(axesList, size, opts){
  opts = opts || {};
  const cx = size/2, cy = size/2;
  const n = axesList.length;
  const angleFor = i => -Math.PI/2 + i*(2*Math.PI/n);
  const fontSize = opts.showLabels === false ? 11 : 17;
  const labelGap = 16;
  const markerFor = (ax,i) => `${i+1} ${ax.icon||""}`.trim();

  let R = opts.radius;
  if(R === undefined){
    R = size/2;
    if(opts.showLabels !== false){
      axesList.forEach((ax,i)=>{
        const angle = angleFor(i);
        const w = textWidth(markerFor(ax,i), fontSize);
        const h = fontSize * 1.3;
        R = Math.min(R, maxRadiusForLabel(cx, cy, angle, w, h, labelGap, size));
      });
    }
    R = Math.max(R, size*0.08);
  }
  return { cx, cy, R, angleFor, fontSize, labelGap, markerFor };
}

function buildRadarSVG(axesList, scaleMin, scaleMax, bands, lines, opts){
  opts = opts || {};
  const size = opts.size || 460;
  const n = axesList.length;
  if(n < 3){ return `<text x="20" y="30" font-size="13" fill="${themeC('#5B6472','#9CA1A8')}">Au moins 3 axes sont requis.</text>`; }
  const { cx, cy, R, angleFor, fontSize, labelGap, markerFor } = computeRadarGeometry(axesList, size, opts);

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
      if(opts.interactive && line.role){
        pts.forEach((p,i)=>{
          els.push(`<circle class="drag-handle" data-axis-idx="${i}" data-role="${line.role}" cx="${p.x.toFixed(1)}" cy="${p.y.toFixed(1)}" r="15" fill="transparent" stroke="none"/>`);
          els.push(`<circle class="drag-handle" data-axis-idx="${i}" data-role="${line.role}" cx="${p.x.toFixed(1)}" cy="${p.y.toFixed(1)}" r="7" fill="${line.pointFill||line.stroke}" stroke="${themeC('#fff','#15171A')}" stroke-width="2"/>`);
        });
      } else {
        pts.forEach(p=>{ els.push(`<circle cx="${p.x.toFixed(1)}" cy="${p.y.toFixed(1)}" r="3.5" fill="${line.pointFill||line.stroke}" stroke="${line.stroke}" stroke-width="1.5"/>`); });
      }
    }
  });

  // grid drawn on top of the filled bands (and lines), as requested
  const ringCount = 4;
  for(let ring=1; ring<=ringCount; ring++){
    const val = scaleMin + (scaleMax-scaleMin)*(ring/ringCount);
    const pts = axesList.map((ax,i)=>radarPoint(cx,cy,R,angleFor(i),val,scaleMin,scaleMax));
    els.push(`<polygon points="${ptsStr(pts)}" fill="none" stroke="${themeC('rgba(20,20,20,0.35)','rgba(255,255,255,0.35)')}" stroke-width="1.5"/>`);
  }
  for(let i=0;i<n;i++){
    const p = radarPoint(cx,cy,R,angleFor(i),scaleMax,scaleMin,scaleMax);
    els.push(`<line x1="${cx}" y1="${cy}" x2="${p.x.toFixed(1)}" y2="${p.y.toFixed(1)}" stroke="${themeC('rgba(20,20,20,0.35)','rgba(255,255,255,0.35)')}" stroke-width="1.5"/>`);
  }

  // axis markers (number + icon), topmost — full label available via native hover tooltip
  if(opts.showLabels !== false){
    axesList.forEach((ax,i)=>{
      const angle = angleFor(i);
      const p = radarPoint(cx,cy,R+labelGap,angle,scaleMax,scaleMin,scaleMax);
      const cosA = Math.cos(angle);
      const anchor = cosA > 0.3 ? "start" : cosA < -0.3 ? "end" : "middle";
      els.push(`<g style="cursor:help;"><title>${escapeHtml(axLabel(ax))}</title><text x="${p.x.toFixed(1)}" y="${p.y.toFixed(1)}" font-size="${fontSize}" fill="${themeC('#3a3a38','#ECECE7')}" text-anchor="${anchor}" dominant-baseline="middle">${escapeHtml(markerFor(ax,i))}</text></g>`);
    });
  }

  return `<g>${els.join("")}</g>`;
}

function renderSidebarRadar(){
  const svg = document.getElementById("sidebarRadarSvg");
  if(!svg) return;
  const axes = AXES_CONFIG.axes;
  const smin = AXES_CONFIG.scaleMin, smax = AXES_CONFIG.scaleMax;
  if(!hasAnyRadarData()){
    const midVals = axes.map(()=> (smin+smax)/2 );
    const lines = [{ values:midVals, stroke:themeC("rgba(27,36,48,0.28)","rgba(236,236,231,0.3)"), width:2, dash:"4,4", points:false }];
    svg.innerHTML = buildRadarSVG(axes, smin, smax, [], lines, {size:400, showLabels:false});
    return;
  }
  const currentVals = axes.map(ax=>{ const en = state.qualityRadar.entries.find(e=>e.axisId===ax.id); return en && en.current!==null && en.current!==undefined ? Number(en.current) : null; });
  const goalVals = axes.map(ax=>{ const en = state.qualityRadar.entries.find(e=>e.axisId===ax.id); return en && en.goal!==null && en.goal!==undefined ? Number(en.goal) : null; });
  const lines = [
    { values:currentVals, stroke:themeC("#2F6F6B","#4FB3AC"), width:3, fill:themeC("#2F6F6B","#4FB3AC"), fillOpacity:0.18, pointFill:themeC("#2F6F6B","#4FB3AC") },
    { values:goalVals, stroke:themeC("#1B2430","#ECECE7"), width:3, dash:"6,4", pointFill:themeC("#FAF9F6","#1F2226") }
  ];
  svg.innerHTML = buildRadarSVG(axes, smin, smax, [], lines, {size:400});
}

/* ---------------------------------------------------------------------
   Landing portrait: teaser placeholder vs. live auto-generated portrait
--------------------------------------------------------------------- */
function hasAnyRadarData(){
  return state.qualityRadar.entries.some(e=>e.current!==null && e.current!==undefined);
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
    strongLine = t("portraitStrongTwo").replace("{A}", axLabel(top.ax).toLowerCase()).replace("{B}", axLabel(second.ax).toLowerCase());
  } else {
    strongLine = t("portraitStrongOne").replace("{A}", axLabel(top.ax).toLowerCase());
  }

  const withGap = withCurrent.filter(e=>e.goal!==null && e.goal>e.current)
    .map(e=>({...e, gap:e.goal-e.current}))
    .sort((a,b)=>b.gap-a.gap);
  const growingCount = withGap.length;
  const stableCount = withCurrent.filter(e=>e.goal!==null && e.goal===e.current).length;

  let growLine;
  if(withGap.length>0){
    const g = withGap[0];
    growLine = t("portraitGrowLine").replace("{A}", axLabel(g.ax).toLowerCase()).replace("{C}", g.current).replace("{G}", g.goal);
  } else {
    growLine = t("portraitNoGrow");
  }

  return { strongLine, growLine, growingCount, stableCount, filledCount, totalCount };
}

function renderPortrait(){
  const hasData = hasAnyRadarData();
  document.getElementById("portraitTeaser").style.display = hasData ? "none" : "block";
  document.getElementById("portraitCard").style.display = hasData ? "block" : "none";
  if(!hasData){ return; }

  const narrative = computeNarrative();
  const name = state.meta.teacherName || "";
  const initials = name.trim().split(/\s+/).map(w=>w[0]).slice(0,2).join("").toUpperCase() || "—";
  document.getElementById("portraitAvatar").textContent = initials;
  document.getElementById("portraitName").textContent = name || t("portraitNoName");
  document.getElementById("portraitStrongLine").textContent = narrative.strongLine;
  document.getElementById("portraitGrowLine").textContent = narrative.growLine;
  document.getElementById("portraitGrowingPill").textContent = t("portraitGrowingPill").replace("{N}", narrative.growingCount).replace("{AXIS}", axisWord(narrative.growingCount)).replace(/{S}/g, narrative.growingCount===1?"":"s");
  document.getElementById("portraitStablePill").textContent = t("portraitStablePill").replace("{N}", narrative.stableCount).replace("{AXIS}", axisWord(narrative.stableCount)).replace(/{S}/g, narrative.stableCount===1?"":"s");

  const notes = [];
  if(narrative.filledCount < narrative.totalCount) notes.push(t("portraitFooterFilled").replace(/{F}/g, narrative.filledCount).replace(/{FS}/g, narrative.filledCount===1?"":"s").replace("{T}", narrative.totalCount));
  if(state.qualityRadar.targetDate) notes.push(t("portraitFooterTarget").replace("{D}", state.qualityRadar.targetDate));
  document.getElementById("portraitFooterNote").textContent = notes.join(" ");
}

document.getElementById("btnGoToAxes").addEventListener("click", ()=>{
  document.getElementById("axes-anchor").scrollIntoView({behavior:"smooth", block:"start"});
});

/* ---------------------------------------------------------------------
   Shared axis-value setter: used by both the sliders and the draggable
   points on the zoomed radar, so both stay in sync no matter which one
   the person actually touches.
--------------------------------------------------------------------- */
function setAxisValueFromInteraction(axisIndex, role, rawValue){
  const ax = AXES_CONFIG.axes[axisIndex];
  if(!ax) return;
  const entry = state.qualityRadar.entries.find(e=>e.axisId===ax.id);
  if(!entry) return;
  const smin = AXES_CONFIG.scaleMin, smax = AXES_CONFIG.scaleMax;
  let v = Math.round(rawValue*10)/10;
  v = Math.max(smin, Math.min(smax, v));

  if(role === "current"){
    entry.current = v;
    if(entry.goal === null || entry.goal < entry.current) entry.goal = entry.current;
  } else {
    if(entry.current !== null && v < entry.current) v = entry.current;
    entry.goal = v;
  }

  const card = document.querySelectorAll("#axesRows .activity-card")[axisIndex];
  if(card){
    const curSlider = card.querySelector(".rv-current");
    const goalSlider = card.querySelector(".rv-goal");
    if(curSlider && Number(curSlider.value) !== entry.current){
      curSlider.value = entry.current;
      card.querySelector(".rv-cur-out").textContent = scaleLabelFor(entry.current);
      applySliderColor(curSlider, entry.current, smin, smax);
    }
    if(goalSlider && Number(goalSlider.value) !== entry.goal){
      goalSlider.value = entry.goal;
      card.querySelector(".rv-goal-out").textContent = scaleLabelFor(entry.goal);
      applySliderColor(goalSlider, entry.goal, smin, smax);
    }
  }

  touch();
  renderSidebarRadar();
  renderRadarZoom();
  renderPortrait();
  renderSurveyComparative();
}

function renderRadarZoom(){
  const svg = document.getElementById("radarZoomSvg");
  const modal = document.getElementById("radarZoomModal");
  if(!svg || !modal || !modal.classList.contains("open")) return;
  const axes = AXES_CONFIG.axes;
  const smin = AXES_CONFIG.scaleMin, smax = AXES_CONFIG.scaleMax;
  const currentVals = axes.map(ax=>{ const en = state.qualityRadar.entries.find(e=>e.axisId===ax.id); return en && en.current!==null && en.current!==undefined ? Number(en.current) : null; });
  const goalVals = axes.map(ax=>{ const en = state.qualityRadar.entries.find(e=>e.axisId===ax.id); return en && en.goal!==null && en.goal!==undefined ? Number(en.goal) : null; });
  const lines = [
    { values:currentVals, role:"current", stroke:themeC("#2F6F6B","#4FB3AC"), width:3, fill:themeC("#2F6F6B","#4FB3AC"), fillOpacity:0.18, pointFill:themeC("#2F6F6B","#4FB3AC") },
    { values:goalVals, role:"goal", stroke:themeC("#1B2430","#ECECE7"), width:3, dash:"6,4", pointFill:themeC("#FAF9F6","#1F2226") }
  ];
  svg.innerHTML = buildRadarSVG(axes, smin, smax, [], lines, {size:640, interactive:true});
}

document.getElementById("btnZoomRadar").addEventListener("click", ()=>{
  document.getElementById("radarZoomOverlay").classList.add("show");
  document.getElementById("radarZoomModal").classList.add("open");
  renderRadarZoom();
});
function closeRadarZoom(){
  document.getElementById("radarZoomOverlay").classList.remove("show");
  document.getElementById("radarZoomModal").classList.remove("open");
}
document.getElementById("btnCloseRadarZoom").addEventListener("click", closeRadarZoom);
document.getElementById("radarZoomOverlay").addEventListener("click", closeRadarZoom);

// Drag interaction on the zoomed radar: project the pointer onto the axis's
// own spoke direction so dragging feels like sliding along that axis, then
// route through the same setter the sliders use, rAF-throttled for smoothness.
(function initRadarDrag(){
  const svg = document.getElementById("radarZoomSvg");
  let dragging = null; // { axisIndex, role }
  let pendingUpdate = null;
  let rafScheduled = false;

  function svgUserPoint(clientX, clientY){
    const pt = svg.createSVGPoint();
    pt.x = clientX; pt.y = clientY;
    const ctm = svg.getScreenCTM();
    if(!ctm) return {x:0,y:0};
    const p = pt.matrixTransform(ctm.inverse());
    return {x:p.x, y:p.y};
  }

  function flushPending(){
    rafScheduled = false;
    if(!pendingUpdate) return;
    const { axisIndex, role, value } = pendingUpdate;
    pendingUpdate = null;
    setAxisValueFromInteraction(axisIndex, role, value);
  }

  svg.addEventListener("pointerdown", e=>{
    const handle = e.target.closest(".drag-handle");
    if(!handle) return;
    dragging = { axisIndex: Number(handle.getAttribute("data-axis-idx")), role: handle.getAttribute("data-role") };
    e.preventDefault();
  });

  window.addEventListener("pointermove", e=>{
    if(!dragging) return;
    const axes = AXES_CONFIG.axes;
    const smin = AXES_CONFIG.scaleMin, smax = AXES_CONFIG.scaleMax;
    const size = 640;
    const geo = computeRadarGeometry(axes, size, {});
    const angle = geo.angleFor(dragging.axisIndex);
    const p = svgUserPoint(e.clientX, e.clientY);
    const dx = p.x - geo.cx, dy = p.y - geo.cy;
    let r = dx*Math.cos(angle) + dy*Math.sin(angle);
    r = Math.max(0, Math.min(geo.R, r));
    const frac = geo.R>0 ? r/geo.R : 0;
    const value = smin + frac*(smax-smin);
    pendingUpdate = { axisIndex: dragging.axisIndex, role: dragging.role, value };
    if(!rafScheduled){ rafScheduled = true; requestAnimationFrame(flushPending); }
  });

  window.addEventListener("pointerup", ()=>{ dragging = null; });
  window.addEventListener("pointercancel", ()=>{ dragging = null; });
})();

function renderQualityRadar(){
  const wrap = document.getElementById("axesRows");
  wrap.innerHTML = "";
  const smin = AXES_CONFIG.scaleMin, smax = AXES_CONFIG.scaleMax;
  document.getElementById("radar-target-date").value = state.qualityRadar.targetDate || "";
  AXES_CONFIG.axes.forEach((ax,i)=>{
    const entry = state.qualityRadar.entries.find(e=>e.axisId===ax.id);
    const card = document.createElement("div");
    card.className = "activity-card";
    card.innerHTML = `
      <div style="display:flex; align-items:flex-start; justify-content:space-between; gap:10px;">
        <div>
          <div style="font-weight:600; font-size:13.5px;">${i+1}. ${ax.icon||""} ${escapeHtml(axLabel(ax))}</div>
          <div style="font-size:12px; color:var(--muted); margin-bottom:6px;">${escapeHtml(axDesc(ax))}</div>
        </div>
        ${(axIdeas(ax).length) ? `<button type="button" class="small ax-ideas-toggle" style="white-space:nowrap;">${t("ideasBtn")}</button>` : ""}
      </div>
      ${(axIdeas(ax).length) ? `
      <div class="ax-ideas-panel info-box" style="display:none; margin-bottom:10px;">
        <strong>${t("ideasBoxTitle")}</strong>
        <ul style="margin:6px 0 0; padding-left:18px;">
          ${axIdeas(ax).map(i=>`<li style="margin-bottom:3px;">${escapeHtml(i)}</li>`).join("")}
        </ul>
      </div>` : ""}
      <div class="field tight">
        <label>${t("legendCurrent")} : <span class="rv-cur-out">${entry.current!==null?scaleLabelFor(entry.current):"—"}</span></label>
        <input type="range" class="rv-slider rv-current" min="${smin}" max="${smax}" step="0.1" value="${entry.current ?? smin}">
      </div>
      <div class="field tight" style="margin-top:14px;">
        <label>${t("legendGoal")} : <span class="rv-goal-out">${entry.goal!==null?scaleLabelFor(entry.goal):"—"}</span></label>
        <input type="range" class="rv-slider rv-goal" min="${smin}" max="${smax}" step="0.1" value="${entry.goal ?? smin}">
      </div>
      <div class="grid2" style="margin-top:14px;">
        <div class="field tight">
          <label>${t("labelNoteCurrent")}</label>
          <textarea class="rv-note-current" style="min-height:44px;" placeholder="${escapeAttr(t("phNoteCurrent"))}">${escapeHtml(entry.noteCurrent)}</textarea>
        </div>
        <div class="field tight">
          <label>${t("labelNoteGoal")}</label>
          <textarea class="rv-note-goal" style="min-height:44px;" placeholder="${escapeAttr(t("phNoteGoal"))}">${escapeHtml(entry.noteGoal)}</textarea>
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
        ideasBtn.textContent = open ? t("ideasBtn") : t("ideasBtnHide");
      });
    }

    const curSlider = card.querySelector(".rv-current");
    const goalSlider = card.querySelector(".rv-goal");
    applySliderColor(curSlider, entry.current ?? smin, smin, smax);
    applySliderColor(goalSlider, entry.goal ?? smin, smin, smax);

    curSlider.addEventListener("input", e=>{
      setAxisValueFromInteraction(i, "current", Number(e.target.value));
    });
    goalSlider.addEventListener("input", e=>{
      setAxisValueFromInteraction(i, "goal", Number(e.target.value));
    });
    card.querySelector(".rv-note-current").addEventListener("input", e=>{ entry.noteCurrent = e.target.value; touch(); });
    card.querySelector(".rv-note-goal").addEventListener("input", e=>{ entry.noteGoal = e.target.value; touch(); });
  });
  renderSidebarRadar();
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
   Rendering: Timeline milestones (jalons)
--------------------------------------------------------------------- */
const MILESTONE_TYPE_OPTIONS = [
  {v:"formation", k:"milestone_formation"},
  {v:"sondage", k:"milestone_sondage"},
  {v:"autre", k:"milestone_autre"},
];

function renderMilestones(){
  const list = document.getElementById("milestonesList");
  list.innerHTML = "";
  if(state.milestones.length===0){
    list.innerHTML = `<div class="empty-note">${t("emptyNoteMilestone")}</div>`;
  }
  const sorted = [...state.milestones].sort((a,b)=>(a.targetDate||"").localeCompare(b.targetDate||""));
  sorted.forEach(m=>{
    const idx = state.milestones.indexOf(m);
    const card = document.createElement("div");
    card.className = "activity-card";
    card.style.opacity = m.completed ? "0.7" : "1";
    card.innerHTML = `
      <div class="row-top">
        <div class="field tight" style="flex:1;">
          <label>${t("labelMilestoneTitle")}</label>
          <input type="text" class="ms-title" data-idx="${idx}" value="${escapeAttr(m.title)}" placeholder="${escapeAttr(t("phMilestoneTitle"))}" style="${m.completed?'text-decoration:line-through;':''}">
        </div>
        <button class="small danger-outline ms-remove" data-idx="${idx}" style="margin-top:18px;">${t("btnRemove")}</button>
      </div>
      <div class="grid3" style="margin-top:12px;">
        <div class="field tight">
          <label>${t("labelMilestoneType")}</label>
          <select class="ms-type" data-idx="${idx}">
            ${MILESTONE_TYPE_OPTIONS.map(o=>`<option value="${o.v}" ${m.type===o.v?"selected":""}>${optLabel(o)}</option>`).join("")}
          </select>
        </div>
        <div class="field tight">
          <label>${t("labelMilestoneDate")}</label>
          <input type="date" class="ms-date" data-idx="${idx}" value="${escapeAttr(m.targetDate)}">
        </div>
        <div class="field tight" style="display:flex; align-items:flex-end;">
          <label class="chip" style="width:fit-content; margin:0;">
            <input type="checkbox" class="ms-completed" data-idx="${idx}" ${m.completed?"checked":""}> ${t("labelMilestoneCompleted")}
          </label>
        </div>
      </div>
      <div class="field tight" style="margin-top:10px;">
        <label>${t("labelNotes")}</label>
        <textarea class="ms-notes" data-idx="${idx}" style="min-height:44px;">${escapeHtml(m.notes)}</textarea>
      </div>
    `;
    list.appendChild(card);

    card.querySelector(".ms-title").addEventListener("input", e=>{ state.milestones[idx].title = e.target.value; touch(); renderTimeline(); });
    card.querySelector(".ms-type").addEventListener("change", e=>{ state.milestones[idx].type = e.target.value; touch(); renderTimeline(); });
    card.querySelector(".ms-date").addEventListener("input", e=>{ state.milestones[idx].targetDate = e.target.value; touch(); renderTimeline(); renderMilestones(); });
    card.querySelector(".ms-completed").addEventListener("change", e=>{
      state.milestones[idx].completed = e.target.checked;
      state.milestones[idx].completedAt = e.target.checked ? new Date().toISOString() : null;
      touch(); renderMilestones(); renderTimeline();
    });
    card.querySelector(".ms-notes").addEventListener("input", e=>{ state.milestones[idx].notes = e.target.value; touch(); });
    card.querySelector(".ms-remove").addEventListener("click", ()=>{
      state.milestones.splice(idx,1); touch(); renderMilestones(); renderTimeline();
    });
  });
}

document.getElementById("btnAddMilestone").addEventListener("click", ()=>{
  state.milestones.push({
    id: uid("ms"), title:"", type:"formation", targetDate: toISODate(new Date()), completed:false, completedAt:null, notes:""
  });
  touch(); renderMilestones(); renderTimeline();
});

/* ---------------------------------------------------------------------
   Rendering: Domain-specific skills
--------------------------------------------------------------------- */
const SKILL_KIND_OPTIONS = [
  {v:"nouvelle", k:"skillkind_nouvelle"},
  {v:"maintien", k:"skillkind_maintien"},
];

function renderDomainSkills(){
  const list = document.getElementById("domainSkillsList");
  list.innerHTML = "";
  if(state.domainSkills.length===0){
    list.innerHTML = `<div class="empty-note">${t("emptyNoteSkill")}</div>`;
  }
  state.domainSkills.forEach((sk, idx)=>{
    const card = document.createElement("div");
    card.className = "activity-card";
    card.innerHTML = `
      <div class="row-top">
        <div class="field tight" style="flex:1;">
          <label>${t("labelSkillName")}</label>
          <input type="text" class="sk-name" data-idx="${idx}" value="${escapeAttr(sk.name)}" placeholder="${escapeAttr(t("phSkillName"))}">
        </div>
        <button class="small danger-outline sk-remove" data-idx="${idx}" style="margin-top:18px;">${t("btnRemove")}</button>
      </div>
      <div class="field tight" style="margin-top:10px;">
        <label>${t("labelSkillType")}</label>
        <select class="sk-kind" data-idx="${idx}">
          ${SKILL_KIND_OPTIONS.map(o=>`<option value="${o.v}" ${sk.kind===o.v?"selected":""}>${optLabel(o)}</option>`).join("")}
        </select>
      </div>
      <div class="grid2" style="margin-top:10px;">
        <div class="field tight">
          <label>${t("labelSkillHow")}</label>
          <textarea class="sk-plan" style="min-height:44px;" placeholder="${escapeAttr(t("phSkillHow"))}">${escapeHtml(sk.plan)}</textarea>
        </div>
        <div class="field tight">
          <label>${t("labelSkillWhen")}</label>
          <input type="text" class="sk-when" data-idx="${idx}" value="${escapeAttr(sk.when)}" placeholder="${escapeAttr(t("phSkillWhen"))}">
        </div>
      </div>
      <div class="field tight" style="margin-top:10px;">
        <label class="chip" style="width:fit-content;">
          <input type="checkbox" class="sk-newcourses" data-idx="${idx}" ${sk.newCourses?"checked":""}> ${t("labelSkillNewCourses")}
        </label>
      </div>
      <div class="field tight sk-newcourses-details" data-idx="${idx}" style="margin-top:10px; display:${sk.newCourses?"block":"none"};">
        <label>${t("labelSkillNewCoursesDetails")}</label>
        <input type="text" class="sk-newcourses-text" data-idx="${idx}" value="${escapeAttr(sk.newCoursesDetails)}" placeholder="${escapeAttr(t("phSkillNewCoursesDetails"))}">
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
    list.innerHTML = `<div class="empty-note">${t("emptyNoteActivity")}</div>`;
  }
  state.activities.forEach((a, idx)=>{
    const card = document.createElement("div");
    card.className = "activity-card";
    card.innerHTML = `
      <div class="row-top">
        <div class="field tight" style="flex:1;">
          <label>${t("labelActivityTitle")}</label>
          <input type="text" class="a-title" data-idx="${idx}" value="${escapeAttr(a.title)}" placeholder="${escapeAttr(t("phActivityTitle"))}">
        </div>
        <button class="small danger-outline a-remove" data-idx="${idx}" style="margin-top:18px;">${t("btnRemove")}</button>
      </div>
      <div class="grid3" style="margin-top:12px;">
        <div class="field tight">
          <label>${t("labelCategory")}</label>
          <select class="a-category" data-idx="${idx}">
            ${CATEGORY_OPTIONS.map(o=>`<option value="${o.v}" ${a.category===o.v?"selected":""}>${optLabel(o)}</option>`).join("")}
          </select>
        </div>
        <div class="field tight">
          <label>${t("labelFormat")}</label>
          <select class="a-format" data-idx="${idx}">
            ${FORMAT_OPTIONS.map(o=>`<option value="${o.v}" title="${escapeAttr(optDesc(o))}" ${a.format===o.v?"selected":""}>${optLabel(o)}</option>`).join("")}
          </select>
        </div>
        <div class="field tight">
          <label>${t("labelStatus")}</label>
          <select class="a-status" data-idx="${idx}">
            ${STATUS_OPTIONS.map(o=>`<option value="${o.v}" ${a.status===o.v?"selected":""}>${optLabel(o)}</option>`).join("")}
          </select>
        </div>
      </div>
      <div class="a-format-help" style="font-size:11.5px;color:var(--muted);margin-top:-4px;margin-bottom:2px;">${escapeHtml(optDesc(optByValue(FORMAT_OPTIONS, a.format)||{}))}</div>
      <div class="grid3" style="margin-top:12px;">
        <div class="field tight">
          <label>${t("labelAcademicYear")}</label>
          <input type="text" class="a-year" data-idx="${idx}" value="${escapeAttr(a.academicYear)}" placeholder="${escapeAttr(t("phAcademicYear"))}">
        </div>
        <div class="field tight">
          <label>${t("labelSession")}</label>
          <input type="text" class="a-session" data-idx="${idx}" value="${escapeAttr(a.session)}" placeholder="${escapeAttr(t("phSession"))}">
        </div>
        <div class="field tight">
          <label>${t("labelCost")}</label>
          <input type="number" min="0" step="1" class="a-cost" data-idx="${idx}" value="${a.estimatedCost ?? ""}">
        </div>
      </div>
      <div class="grid3" style="margin-top:12px;">
        <div class="field tight">
          <label class="chip" style="width:fit-content;">
            <input type="checkbox" class="a-rd" data-idx="${idx}" ${a.proposedRD?"checked":""}> ${t("labelProposedRD")}
          </label>
        </div>
      </div>
      <div class="field" style="margin-top:12px;">
        <label>${t("labelDomains")}</label>
        <div class="chip-group a-domains" data-idx="${idx}"></div>
      </div>
      <div class="a-rd-block" data-idx="${idx}" style="display:${a.proposedRD?"block":"none"};">
        <div class="grid3" style="margin-top:8px;">
          <div class="field tight">
            <label>${t("labelRdCategory")}</label>
            <select class="a-rdcat" data-idx="${idx}">
              <option value="">— </option>
              ${RD_CATEGORY_OPTIONS.map(o=>`<option value="${o.v}" ${a.rdCategory===o.v?"selected":""}>${optLabel(o)}</option>`).join("")}
            </select>
          </div>
          <div class="field tight">
            <label>${t("labelRdStatus")}</label>
            <select class="a-rdstatus" data-idx="${idx}">
              ${RD_STATUS_OPTIONS.map(o=>`<option value="${o.v}" ${(a.rdApprovalStatus||"en_attente")===o.v?"selected":""}>${optLabel(o)}</option>`).join("")}
            </select>
          </div>
          <div class="field tight">
            <label>${t("labelRdDate")}</label>
            <input type="date" class="a-rddate" data-idx="${idx}" value="${escapeAttr(a.rdApprovalDate)}">
          </div>
        </div>
        <div class="field tight" style="margin-top:10px;">
          <label>${t("labelRdBy")}</label>
          <input type="text" class="a-rdby" data-idx="${idx}" value="${escapeAttr(a.rdApprovedBy)}" placeholder="${escapeAttr(t("phRdBy"))}">
        </div>
        <div class="rd-message" data-idx="${idx}">${rdMessageHtml(a)}</div>
      </div>
      <div class="field" style="margin-top:12px;">
        <label>${t("labelNotes")}</label>
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
    if(helpEl) helpEl.textContent = opt ? optDesc(opt) : "";
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
  const byPart = a.rdApprovedBy ? (currentLang==="en" ? " by "+escapeHtml(a.rdApprovedBy) : " par "+escapeHtml(a.rdApprovedBy)) : "";
  const datePart = a.rdApprovalDate ? (currentLang==="en" ? " on "+a.rdApprovalDate : ", le "+a.rdApprovalDate) : "";
  if(status === "approuvee"){
    const msg = t("rdMsgApproved").replace("{BY}", byPart).replace("{DATE}", datePart);
    return `<div class="info-box"><strong>${optLabel(optByValue(RD_STATUS_OPTIONS,"approuvee"))}</strong> ${msg}</div>`;
  }
  if(status === "refusee"){
    const msg = t("rdMsgRefused").replace("{BY}", byPart).replace("{DATE}", datePart);
    return `<div class="warn-box"><strong>${optLabel(optByValue(RD_STATUS_OPTIONS,"refusee"))}</strong> ${msg}</div>`;
  }
  return `<div class="warn-box">${t("rdMsgPending")}</div>`;
}

/* ---------------------------------------------------------------------
   Rendering: Budget
--------------------------------------------------------------------- */
function renderBudget(){
  const rows = document.getElementById("budgetRows");
  rows.innerHTML = "";
  const catLabel = v => { const o = optByValue(CATEGORY_OPTIONS, v); return o ? optLabel(o) : v; };

  if(state.activities.length===0){
    rows.innerHTML = `<tr><td colspan="4" class="empty-note">${t("emptyNoteBudget")}</td></tr>`;
    document.getElementById("budgetTotal").textContent = "0 $";
    return;
  }

  // group by academic year, preserving first-seen order; blanks grouped last
  const UNSPEC = "\u0000unspecified";
  const groups = [];
  const groupIndex = {};
  state.activities.forEach(a=>{
    const yr = (a.academicYear||"").trim() || UNSPEC;
    if(!(yr in groupIndex)){ groupIndex[yr] = groups.length; groups.push({year:yr, items:[], subtotal:0}); }
    const g = groups[groupIndex[yr]];
    const cost = a.estimatedCost || 0;
    g.items.push(a);
    g.subtotal += cost;
  });
  groups.sort((a,b)=>{
    if(a.year===UNSPEC) return 1;
    if(b.year===UNSPEC) return -1;
    return a.year.localeCompare(b.year);
  });

  let grandTotal = 0;
  groups.forEach(g=>{
    const yearDisplay = g.year===UNSPEC ? t("yearUnspecified") : g.year;
    g.items.forEach((a,i)=>{
      const cost = a.estimatedCost || 0;
      const tr = document.createElement("tr");
      tr.innerHTML = `<td>${i===0 ? escapeHtml(yearDisplay) : ""}</td><td>${escapeHtml(a.title || "—")}</td><td>${escapeHtml(catLabel(a.category))}</td><td style="text-align:right;">${cost ? cost.toLocaleString("fr-CA") + " $" : "—"}</td>`;
      rows.appendChild(tr);
    });
    const subtr = document.createElement("tr");
    subtr.innerHTML = `<td colspan="3" style="font-weight:600;border-top:1px solid var(--border);">${escapeHtml(t("subtotalLabel").replace("{Y}", yearDisplay))}</td><td style="text-align:right;font-weight:600;border-top:1px solid var(--border);">${g.subtotal.toLocaleString("fr-CA")} $</td>`;
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
  return d.toLocaleDateString(currentLang==="en"?"en-CA":"fr-CA", {year:"numeric", month:"short", day:"numeric"});
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
  els.push(`<line x1="${marginX}" y1="90" x2="${W-marginX}" y2="90" stroke="${themeC('#D8DCE1','#34383D')}" stroke-width="2"/>`);

  // year ticks
  for(let y=0;y<=totalYears;y++){
    const d = addYears(start, y);
    if(d>span) break;
    const x = xFor(d);
    els.push(`<line x1="${x}" y1="82" x2="${x}" y2="98" stroke="${themeC('#B9BEC6','#4A4E54')}" stroke-width="1"/>`);
    els.push(`<text x="${x}" y="112" font-size="10.5" fill="${themeC('#8A8F98','#9CA1A8')}" text-anchor="middle" font-family="Consolas,monospace">+${y} ${y>1?t("plusYears"):t("plusOneYear")}</text>`);
  }

  // annual recurring reminders (Nov 15 balance stmt, May 15 balance stmt)
  const recurring = [
    {month:10, day:15, label:t("reviewDueMonospace")},
    {month:4, day:15, label:t("reviewDueMonospace2")},
  ];
  for(let y=start.getFullYear(); y<=span.getFullYear()+1; y++){
    recurring.forEach(r=>{
      const d = annualDateInYear(y, r.month, r.day);
      if(d>=start && d<=span){
        const x = xFor(d);
        els.push(`<circle cx="${x}" cy="90" r="4" fill="${themeC('#8A8F98','#9CA1A8')}"/>`);
        els.push(`<text x="${x}" y="72" font-size="9.5" fill="${themeC('#5B6472','#9CA1A8')}" text-anchor="middle">${fmtShort(d)}</text>`);
      }
    });
  }

  // plan established
  els.push(markerAt(xFor(start), t("planEstablished"), fmtShort(start), themeC("#2F6F6B","#4FB3AC"), true));

  // plan end / review due
  els.push(markerAt(xFor(end), t("planEndVisee"), fmtShort(end), themeC("#2F6F6B","#4FB3AC"), false));

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

  // jalons du plan (formations, sondages, etc. ajoutés par la personne enseignante)
  const milestonesInRange = state.milestones
    .filter(m=>m.targetDate)
    .map(m=>({m, d:new Date(m.targetDate+"T00:00:00")}))
    .filter(({d})=>d>=start && d<=span)
    .sort((a,b)=>a.d-b.d);
  milestonesInRange.forEach(({m,d}, i)=>{
    const x = xFor(d);
    const color = m.completed ? "#3B8C22" : "#7B5EA7";
    const yBand = 130 + (i%2)*22;
    const label = (m.title || t("labelMilestoneTitle")) + (m.completed ? " \u2713" : "");
    els.push(`<line x1="${x}" y1="90" x2="${x}" y2="${yBand-8}" stroke="${color}" stroke-width="1.25" stroke-dasharray="2,2"/>`);
    els.push(`<circle cx="${x}" cy="90" r="4" fill="${color}"/>`);
    els.push(`<text x="${x}" y="${yBand}" font-size="9" fill="${color}" text-anchor="middle">${escapeHtml(label)}</text>`);
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
    <text x="${x}" y="${ty + (above?14:14)}" font-size="9.5" fill="${themeC('#5B6472','#9CA1A8')}" text-anchor="middle" font-family="Consolas,monospace">${dateLabel}</text>
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
  renderMilestones();
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
      if(!Array.isArray(state.milestones)) state.milestones = [];
      state.milestones.forEach(m=>{
        if(m.type === undefined) m.type = "formation";
        if(m.completed === undefined) m.completed = false;
        if(m.completedAt === undefined) m.completedAt = null;
        if(m.notes === undefined) m.notes = "";
      });
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
      alert(t("errImportPlan") + "\n" + err.message);
    }
  };
  reader.readAsText(file);
  e.target.value = "";
});

document.getElementById("btnNew").addEventListener("click", ()=>{
  if(confirm(t("confirmNewPlan"))){
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
initTheme();
currentLang = localStorage.getItem("plan-perfectionnement-lang") || "fr";
applyStaticI18n();
document.getElementById("btnLangFr").classList.toggle("active", currentLang==="fr");
document.getElementById("btnLangEn").classList.toggle("active", currentLang==="en");
fullRender();
renderPortrait();
tryAutoLoadAxes();
