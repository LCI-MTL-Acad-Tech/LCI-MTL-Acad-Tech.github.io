// ============================================================
// lang.js — All UI strings for the Internship Tracker
// Edit strings here. Never touch HTML for text changes.
// Keys follow the pattern: page.element or page.section.element
// ============================================================

const LANG = {
  "fr-CA": {

    // ── Global / Navigation ──────────────────────────────────
    "nav.setup":              "Configuration",
    "nav.log":                "Journal",
    "nav.report":             "Rapport",
    "nav.toggle_dark":        "Mode sombre",
    "nav.toggle_light":       "Mode clair",
    "nav.lang":               "EN",

    // ── Global actions ───────────────────────────────────────
    "action.save":            "Enregistrer",
    "action.download":        "Télécharger le journal",
    "action.add":             "Ajouter",
    "action.delete":          "Supprimer",
    "action.edit":            "Modifier",
    "action.cancel":          "Annuler",
    "action.confirm":         "Confirmer",
    "action.next":            "Suivant",
    "action.back":            "Retour",
    "action.close":           "Fermer",
    "action.open_log":        "Ouvrir le journal du jour",
    "action.new_todo":        "Nouvelle tâche",
    "action.complete":        "Marquer comme fait",
    "action.reopen":          "Rouvrir",

    // ── Global field labels ──────────────────────────────────
    "field.name":             "Nom complet",
    "field.student_id":       "Numéro d'étudiant·e",
    "field.email":            "Courriel institutionnel",
    "field.program":          "Programme d'études",
    "field.cohort":           "Cohorte / Semestre",
    "field.professor":        "Professeur·e superviseur·e",
    "field.date":             "Date",
    "field.start_date":       "Date de début",
    "field.end_date":         "Date de fin prévue",
    "field.notes":            "Notes",
    "field.description":      "Description",
    "field.optional":         "(facultatif)",

    // ── Welcome / Landing ────────────────────────────────────
    "welcome.title":          "Journal de stage",
    "welcome.subtitle":       "Documente ton parcours. Explore tes apprentissages.",
    "welcome.pathway_prompt": "Quel type de stage effectues-tu?",
    "welcome.pathway_company":"Stage en entreprise",
    "welcome.pathway_hub":    "Projets au hub d'innovation",
    "welcome.pathway_company_desc": "Tu travailles au sein d'une organisation externe pour une période définie.",
    "welcome.pathway_hub_desc":     "Tu réalises un ou plusieurs projets clients au hub d'innovation du collège, possiblement en équipe.",
    "welcome.cta_new":        "Commencer la configuration",
    "welcome.cta_continue":   "Continuer mon journal",
    "welcome.cta_report":     "Générer mon rapport final",

    // ── Onboarding / Instructions ────────────────────────────
    "onboard.title":          "Avant de commencer — lis ceci attentivement",
    "onboard.p1":             "Cette application fonctionne entièrement dans ton navigateur. Aucune donnée n'est envoyée à un serveur. Si tu fermes l'onglet sans télécharger ton journal, les données de la journée sont perdues.",
    "onboard.p2":             "Chaque jour, tu devras télécharger ton journal en format JSON. Crée un dossier sur ton ordinateur — par exemple « stage-2025 » — et enregistre-y tous tes fichiers journaliers. Garde ce dossier précieusement jusqu'à la fin du stage.",
    "onboard.p3":             "À la fin du stage, tu reviendras ici pour téléverser tous ces fichiers d'un coup et générer ton rapport final.",
    "onboard.p4":             "Nomme tes fichiers de façon cohérente. L'application génère automatiquement un nom de fichier pour toi.",
    "onboard.p5":             "Si tu oublies de faire ton journal un jour, tu peux le rédiger le lendemain en cochant « Journal en retard ».",
    "onboard.checklist":      "J'ai compris : je dois télécharger mon journal chaque jour et conserver tous mes fichiers JSON dans un même dossier.",
    "onboard.cta":            "C'est compris — commencer",

    // ── Setup — Profile ──────────────────────────────────────
    "setup.title":            "Configuration du stage",
    "setup.section_profile":  "Ton profil",
    "setup.section_internship":"Ton stage",
    "setup.section_expectations": "Tes attentes",
    "setup.section_tools":    "Outils et compétences",

    "setup.skills_to_develop":"Quelles compétences souhaites-tu développer pendant ce stage? (2 ou 3)",
    "setup.skills_placeholder":"Ex. : gestion de projet, conception UX, communication client…",
    "setup.apprehensions":    "Y a-t-il quelque chose qui t'inquiète à l'approche de ce stage?",
    "setup.success":          "À quoi ressemble le succès pour toi, personnellement, à la fin de ce stage?",
    "setup.tools_known":      "Quels outils maîtrises-tu déjà en entrant dans ce stage?",
    "setup.tools_to_learn":   "Quels outils prévois-tu apprendre ou améliorer?",

    // Setup — Company pathway
    "setup.org_name":         "Nom de l'organisation",
    "setup.industry":         "Secteur d'activité",
    "setup.city":             "Ville",
    "setup.country":          "Pays",
    "setup.supervisor_name":  "Nom du·de la superviseur·e en milieu de travail",
    "setup.supervisor_role":  "Rôle du·de la superviseur·e",

    // Setup — Hub pathway
    "setup.faculty_supervisor": "Professeur·e superviseur·e",
    "setup.add_project":      "Ajouter un projet",
    "setup.project_name":     "Nom du projet",
    "setup.client_name":      "Nom du client",
    "setup.brief":            "Résumé du mandat",
    "setup.project_start":    "Date de début du projet",
    "setup.student_joined":   "Date à laquelle tu t'es joint·e au projet",
    "setup.project_initial_impression": "Quelle est ton impression initiale de ce projet — portée, complexité, inconnues?",
    "setup.project_challenges":         "Quels défis anticipes-tu?",

    // ── Daily Log ────────────────────────────────────────────
    "log.title":              "Journal du jour",
    "log.date_label":         "Date",
    "log.time_start":         "Heure de début",
    "log.time_end":           "Heure de fin",
    "log.day_duration":       "Durée totale",
    "log.day_type":           "Type de journée",
    "log.day_type_full":      "Journée complète",
    "log.day_type_partial":   "Journée partielle",
    "log.day_type_remote":    "Télétravail",
    "log.day_type_hybrid":    "Hybride",
    "log.late_filing":        "Journal en retard — je rédige ce journal après la journée concernée",

    "log.section_tasks":      "Tâches de la journée",
    "log.add_task":           "Ajouter une tâche",
    "log.task_description":   "Description de la tâche",
    "log.task_duration":      "Durée (minutes)",
    "log.task_type":          "Type d'activité",
    "log.task_project":       "Pour quel projet?",
    "log.task_tools":         "Outils utilisés",
    "log.task_people":        "Avec qui?",
    "log.task_topic":         "Sujet / thème",
    "log.task_learning":      "Qu'as-tu appris ou retenu?",
    "log.task_lesson_tags":   "Étiquettes d'apprentissage",
    "log.task_tags_placeholder": "Ex. : communication, gestion du temps…",
    "log.training_subtype":   "Type de formation",
    "log.training_reading":   "Lecture",
    "log.training_video":     "Vidéo",
    "log.training_coaching":  "Coaching",
    "log.training_workshop":  "Atelier",
    "log.training_course":    "Cours",
    "log.training_other":     "Autre",

    "log.section_grayzone":   "Temps non documenté",
    "log.grayzone_info":      "Il reste du temps non comptabilisé dans tes tâches.",
    "log.grayzone_prompt":    "Comment as-tu passé ce temps? (transitions, déplacements, temps informel…)",
    "log.grayzone_label":     "Temps non documenté",

    "log.section_reflection": "Bilan de la journée",
    "log.obstacle":           "As-tu rencontré un problème ou un obstacle aujourd'hui?",
    "log.obstacle_response":  "Comment l'as-tu géré, ou comment prévois-tu le gérer?",
    "log.day_rating":         "Comment évalues-tu cette journée?",
    "log.rating_1":           "Difficile",
    "log.rating_2":           "Lente",
    "log.rating_3":           "Correcte",
    "log.rating_4":           "Bonne",
    "log.rating_5":           "Excellente",
    "log.closing_word":       "Un mot ou une courte phrase pour décrire comment tu repars aujourd'hui",

    "log.section_todos":      "Liste de tâches",
    "log.todo_description":   "Tâche à faire",
    "log.todo_due":           "Échéance (facultatif)",
    "log.todo_project":       "Projet associé",

    "log.download_reminder":  "N'oublie pas de télécharger ton journal avant de fermer cet onglet.",
    "log.download_cta":       "Télécharger le journal du jour",
    "log.idle_reminder":      "Tu as le journal ouvert depuis un moment. Pense à sauvegarder une copie.",
    "log.summary_hours":      "Heures documentées",
    "log.summary_tasks":      "Tâches",
    "log.summary_grayzone":   "Temps non documenté",

    // ── Drawers ──────────────────────────────────────────────
    "drawer.people_title":    "Personnes",
    "drawer.people_add":      "Ajouter une personne",
    "drawer.people_name":     "Nom",
    "drawer.people_role":     "Rôle",
    "drawer.people_role_placeholder": "Ex. : superviseur·e, client·e, collègue, coach…",
    "drawer.people_org":      "Organisation",
    "drawer.people_drag":     "Glisse une personne sur une tâche pour l'y associer",

    "drawer.projects_title":  "Projets",
    "drawer.projects_add":    "Ajouter un projet",
    "drawer.projects_status_active":    "En cours",
    "drawer.projects_status_completed": "Terminé",
    "drawer.projects_status_paused":    "En pause",
    "drawer.projects_status_cancelled": "Annulé",

    "drawer.types_title":     "Types d'activité",
    "drawer.types_add":       "Ajouter un type",
    "drawer.types_label":     "Étiquette",
    "drawer.types_color":     "Couleur",
    "drawer.types_system":    "Système (non modifiable)",

    "drawer.tools_title":     "Outils",
    "drawer.tools_add":       "Ajouter un outil",
    "drawer.tools_name":      "Nom de l'outil",
    "drawer.tools_category":  "Catégorie",
    "drawer.tools_category_placeholder": "Ex. : Design, Développement, Communication…",

    // ── Default activity types ───────────────────────────────
    "activity.work":          "Travail",
    "activity.meeting":       "Réunion",
    "activity.training":      "Formation",
    "activity.admin":         "Administratif",
    "activity.break":         "Pause",
    "activity.undocumented":  "Non documenté",

    // ── Report / Final ───────────────────────────────────────
    "report.title":           "Rapport de stage",
    "report.upload_title":    "Téléverser tes journaux",
    "report.upload_instructions": "Sélectionne tous les fichiers JSON de ton dossier de stage. L'application les fusionnera automatiquement.",
    "report.upload_cta":      "Choisir les fichiers",
    "report.upload_drop":     "Ou glisse les fichiers ici",
    "report.validation_ok":   "Fichiers validés",
    "report.validation_error_uuid": "Ces fichiers ne proviennent pas du même étudiant·e.",
    "report.validation_warning_time": "Certains journaux semblent avoir été créés en moins de temps que les heures déclarées.",
    "report.validation_conflict":     "Deux versions du même journal ont été trouvées. Laquelle garder?",
    "report.keep_newer":      "Garder la plus récente",
    "report.keep_older":      "Garder la plus ancienne",

    "report.section_reflection": "Réflexion finale",
    "report.reality_vs_expectation": "En quelques phrases, décris ce que ce stage a vraiment été — maintenant que tu l'as vécu — comparé à ce que tu anticipais au départ.",
    "report.significant_work":   "Quels ont été les deux ou trois travaux ou moments les plus significatifs? Pourquoi?",
    "report.proud_moment":       "Décris un moment dont tu es fier·ère.",
    "report.failure_moment":     "Décris un moment où quelque chose n'a pas fonctionné comme prévu.",
    "report.failure_lesson":     "Qu'en as-tu appris?",
    "report.env_lesson":         "Qu'as-tu appris sur le milieu professionnel que tes cours n'avaient pas pleinement préparé?",
    "report.supervisor_rel":     "Comment s'est passée ta relation avec ton·ta superviseur·e et tes collègues?",
    "report.advice":             "Quel conseil donnerais-tu à un·e étudiant·e qui commence ce même stage?",
    "report.would_do_differently": "Si tu pouvais recommencer, qu'est-ce que tu ferais différemment?",
    "report.comments":           "Commentaires supplémentaires",

    "report.tools_reflection_title":   "Bilan des outils",
    "report.tools_proficiency_start":  "Niveau au début",
    "report.tools_proficiency_end":    "Niveau à la fin",
    "report.tools_notes":              "Observations",
    "report.proficiency_none":         "Aucun",
    "report.proficiency_beginner":     "Débutant·e",
    "report.proficiency_intermediate": "Intermédiaire",
    "report.proficiency_advanced":     "Avancé·e",

    "report.collab_title":      "Appréciation des collaborateur·rices",
    "report.collab_note":       "Ce champ est privé. Il apparaîtra dans ton rapport mais ne sera pas partagé automatiquement.",
    "report.collab_placeholder":"Ce que tu as apprécié, appris ou retenu de cette personne…",

    "report.competencies_title":    "Bilan des compétences",
    "report.competencies_helpful":  "Compétences utiles",
    "report.competencies_helpful_q":"Quelles compétences issues de ta formation se sont avérées réellement utiles? Dans quel contexte?",
    "report.competencies_gaps":     "Lacunes identifiées",
    "report.competencies_gaps_q":   "Où t'es-tu senti·e insuffisamment préparé·e? Comment cela s'est-il manifesté?",
    "report.competencies_improve":  "Ce que tu aurais pu faire autrement",
    "report.competencies_improve_q":"Si tu pouvais revenir en arrière — avant ou pendant le stage — que ferais-tu différemment pour mieux te préparer?",
    "report.competency_field":      "Compétence",
    "report.competency_context":    "Cours ou contexte",
    "report.competency_how":        "Comment elle a aidé",
    "report.gap_how":               "Comment cela s'est manifesté",
    "report.gap_impact":            "Impact sur ton travail",
    "report.improve_what":          "Quoi",
    "report.improve_when_before":   "Avant le stage",
    "report.improve_when_during":   "Pendant le stage",
    "report.improve_how":           "Comment",

    "report.future_title":          "Et maintenant?",
    "report.future_direction":      "Comment ce stage influence-t-il ta direction — dans tes études, ta carrière, ou les deux?",
    "report.future_next_steps":     "Quelles sont tes prochaines étapes concrètes?",
    "report.future_skills":         "Quelles compétences ou domaines veux-tu approfondir à la suite de cette expérience?",

    "report.project_outcomes_title":   "Bilan des projets",
    "report.project_delivered":        "Projet livré",
    "report.project_client_feedback":  "Résumé des retours du client",
    "report.project_contribution":     "Ta contribution personnelle",
    "report.project_collab_reflection":"Réflexion sur la collaboration",
    "report.project_final_impression": "Impression finale sur ce projet",
    "report.project_appreciation":     "Ce que tu as apprécié de ce projet ou de son équipe",

    // ── Dashboard ────────────────────────────────────────────
    "dashboard.title":              "Tableau de bord",
    "dashboard.section_timeline":   "Chronologie",
    "dashboard.section_breakdown":  "Répartition du temps",
    "dashboard.section_tools":      "Outils utilisés",
    "dashboard.section_lessons":    "Apprentissages",
    "dashboard.section_reflection": "Réflexion",
    "dashboard.total_days":         "Jours travaillés",
    "dashboard.total_hours":        "Heures documentées",
    "dashboard.avg_rating":         "Évaluation moyenne",
    "dashboard.top_activity":       "Activité principale",
    "dashboard.settings_note":      "Ce rapport a été généré avec des paramètres différents des valeurs par défaut.",
    "dashboard.grayzone_evolution": "Évolution du temps non documenté",
    "dashboard.hide_appreciation":  "Masquer les appréciations",
    "dashboard.show_appreciation":  "Afficher les appréciations",

    // ── Validation & Errors ──────────────────────────────────
    "error.required":         "Ce champ est obligatoire.",
    "error.email":            "Adresse courriel invalide.",
    "error.date":             "Date invalide.",
    "error.time_order":       "L'heure de fin doit être après l'heure de début.",
    "error.grayzone":         "Il reste {pct}% de temps non documenté ({min} min). Décris comment tu l'as passé.",
    "error.merge_uuid":       "Impossible de fusionner : les fichiers proviennent de comptes différents.",
    "error.no_files":         "Aucun fichier sélectionné.",

    // ── Making-of footer ────────────────────────────────────
    "making.label":    "Comment cet outil a été créé",
    "making.title":    "Comment cet outil a été fait",
    "making.p1":       "Cet outil a été construit par une collaboration itérative entre Elisa Schaeffer, Doyenne de la Technologie et du Design au Collège LaSalle Montréal, et Claude (Anthropic), un assistant IA. Le contenu pédagogique, la structure, les fonctionnalités, les priorités et les choix éditoriaux ont été définis, questionnés et affinés par Elisa à chaque étape. Claude a généré le code, proposé des formulations et signalé les incohérences — mais chaque décision substantielle a été prise par un être humain.",
    "making.p2":       "Ce n'est pas du contenu IA généré en une seule fois. C'est le résultat d'un dialogue de révision prolongé : chaque session a été lue, critiquée et corrigée. L'outil évolue.",
    "making.p3":       "Utilisation réfléchie de l'IA — L'IA générative est un outil de travail, non un substitut au jugement professionnel. Ce projet illustre une approche où l'humain reste l'auteur·rice : l'IA amplifie la capacité de production, mais la responsabilité éditoriale, pédagogique et éthique reste entièrement humaine.",
    "making.updated":  "Dernière mise à jour : avril 2026.",
  },

  "en-CA": {

    // ── Global / Navigation ──────────────────────────────────
    "nav.setup":              "Setup",
    "nav.log":                "Daily Log",
    "nav.report":             "Report",
    "nav.toggle_dark":        "Dark mode",
    "nav.toggle_light":       "Light mode",
    "nav.lang":               "FR",

    // ── Global actions ───────────────────────────────────────
    "action.save":            "Save",
    "action.download":        "Download log",
    "action.add":             "Add",
    "action.delete":          "Delete",
    "action.edit":            "Edit",
    "action.cancel":          "Cancel",
    "action.confirm":         "Confirm",
    "action.next":            "Next",
    "action.back":            "Back",
    "action.close":           "Close",
    "action.open_log":        "Open today's log",
    "action.new_todo":        "New task",
    "action.complete":        "Mark as done",
    "action.reopen":          "Reopen",

    // ── Global field labels ──────────────────────────────────
    "field.name":             "Full name",
    "field.student_id":       "Student number",
    "field.email":            "Institutional email",
    "field.program":          "Program of study",
    "field.cohort":           "Cohort / Semester",
    "field.professor":        "Supervising professor",
    "field.date":             "Date",
    "field.start_date":       "Start date",
    "field.end_date":         "Scheduled end date",
    "field.notes":            "Notes",
    "field.description":      "Description",
    "field.optional":         "(optional)",

    // ── Welcome / Landing ────────────────────────────────────
    "welcome.title":          "Internship Journal",
    "welcome.subtitle":       "Document your journey. Explore your learning.",
    "welcome.pathway_prompt": "What type of internship are you doing?",
    "welcome.pathway_company":"Company internship",
    "welcome.pathway_hub":    "Innovation hub projects",
    "welcome.pathway_company_desc": "You are working within an external organization for a defined period.",
    "welcome.pathway_hub_desc":     "You are carrying out one or more client projects at the college's innovation hub, possibly as part of a team.",
    "welcome.cta_new":        "Start setup",
    "welcome.cta_continue":   "Continue my journal",
    "welcome.cta_report":     "Generate my final report",

    // ── Onboarding / Instructions ────────────────────────────
    "onboard.title":          "Before you begin — please read this carefully",
    "onboard.p1":             "This app runs entirely in your browser. No data is sent to any server. If you close this tab without downloading your log, that day's data is gone.",
    "onboard.p2":             "Every day, you need to download your log as a JSON file. Create a folder on your computer — for example, \"internship-2025\" — and save all your daily files there. Keep that folder safe until the end of your internship.",
    "onboard.p3":             "At the end of your internship, you will come back here, upload all those files at once, and generate your final report.",
    "onboard.p4":             "The app automatically generates a consistent filename for you each day.",
    "onboard.p5":             "If you forget to log a day, you can write it up the next day by checking \"Late filing\".",
    "onboard.checklist":      "I understand: I must download my log every day and keep all my JSON files in one folder.",
    "onboard.cta":            "Got it — let's begin",

    // ── Setup — Profile ──────────────────────────────────────
    "setup.title":            "Internship Setup",
    "setup.section_profile":  "Your profile",
    "setup.section_internship":"Your internship",
    "setup.section_expectations": "Your expectations",
    "setup.section_tools":    "Tools and skills",

    "setup.skills_to_develop":"Which skills do you most want to develop during this internship? (2 or 3)",
    "setup.skills_placeholder":"E.g.: project management, UX design, client communication…",
    "setup.apprehensions":    "Is there anything you're apprehensive about going into this internship?",
    "setup.success":          "What does success look like for you, personally, by the end of this internship?",
    "setup.tools_known":      "Which tools do you already know coming into this internship?",
    "setup.tools_to_learn":   "Which tools do you expect to learn or improve on?",

    // Setup — Company pathway
    "setup.org_name":         "Organization name",
    "setup.industry":         "Industry / sector",
    "setup.city":             "City",
    "setup.country":          "Country",
    "setup.supervisor_name":  "Workplace supervisor's name",
    "setup.supervisor_role":  "Supervisor's role",

    // Setup — Hub pathway
    "setup.faculty_supervisor": "Faculty supervisor",
    "setup.add_project":      "Add a project",
    "setup.project_name":     "Project name",
    "setup.client_name":      "Client name",
    "setup.brief":            "Project brief summary",
    "setup.project_start":    "Project start date",
    "setup.student_joined":   "Date you joined the project",
    "setup.project_initial_impression": "What is your initial read on this project — scope, complexity, unknowns?",
    "setup.project_challenges":         "What challenges do you anticipate?",

    // ── Daily Log ────────────────────────────────────────────
    "log.title":              "Today's Log",
    "log.date_label":         "Date",
    "log.time_start":         "Start time",
    "log.time_end":           "End time",
    "log.day_duration":       "Total duration",
    "log.day_type":           "Day type",
    "log.day_type_full":      "Full day",
    "log.day_type_partial":   "Partial day",
    "log.day_type_remote":    "Remote",
    "log.day_type_hybrid":    "Hybrid",
    "log.late_filing":        "Late filing — I'm writing this log after the fact",

    "log.section_tasks":      "Tasks",
    "log.add_task":           "Add a task",
    "log.task_description":   "Task description",
    "log.task_duration":      "Duration (minutes)",
    "log.task_type":          "Activity type",
    "log.task_project":       "Which project?",
    "log.task_tools":         "Tools used",
    "log.task_people":        "Who was involved?",
    "log.task_topic":         "Topic / subject",
    "log.task_learning":      "What did you learn or take away?",
    "log.task_lesson_tags":   "Learning tags",
    "log.task_tags_placeholder": "E.g.: communication, time management…",
    "log.training_subtype":   "Training type",
    "log.training_reading":   "Reading",
    "log.training_video":     "Video",
    "log.training_coaching":  "Coaching",
    "log.training_workshop":  "Workshop",
    "log.training_course":    "Course",
    "log.training_other":     "Other",

    "log.section_grayzone":   "Undocumented time",
    "log.grayzone_info":      "Some time in your day is not accounted for in your tasks.",
    "log.grayzone_prompt":    "How did you spend this time? (transitions, commuting, informal moments…)",
    "log.grayzone_label":     "Undocumented",

    "log.section_reflection": "End-of-day reflection",
    "log.obstacle":           "Did you encounter a problem or obstacle today?",
    "log.obstacle_response":  "How did you handle it, or how do you plan to?",
    "log.day_rating":         "How would you rate today?",
    "log.rating_1":           "Rough",
    "log.rating_2":           "Slow",
    "log.rating_3":           "Okay",
    "log.rating_4":           "Good",
    "log.rating_5":           "Excellent",
    "log.closing_word":       "One word or short phrase to describe how you're leaving today",

    "log.section_todos":      "To-do list",
    "log.todo_description":   "Task to do",
    "log.todo_due":           "Due date (optional)",
    "log.todo_project":       "Related project",

    "log.download_reminder":  "Remember to download your log before closing this tab.",
    "log.download_cta":       "Download today's log",
    "log.idle_reminder":      "You've had the log open for a while. Consider saving a backup.",
    "log.summary_hours":      "Documented hours",
    "log.summary_tasks":      "Tasks",
    "log.summary_grayzone":   "Undocumented time",

    // ── Drawers ──────────────────────────────────────────────
    "drawer.people_title":    "People",
    "drawer.people_add":      "Add a person",
    "drawer.people_name":     "Name",
    "drawer.people_role":     "Role",
    "drawer.people_role_placeholder": "E.g.: supervisor, client, colleague, coach…",
    "drawer.people_org":      "Organization",
    "drawer.people_drag":     "Drag a person onto a task to associate them",

    "drawer.projects_title":  "Projects",
    "drawer.projects_add":    "Add a project",
    "drawer.projects_status_active":    "Active",
    "drawer.projects_status_completed": "Completed",
    "drawer.projects_status_paused":    "Paused",
    "drawer.projects_status_cancelled": "Cancelled",

    "drawer.types_title":     "Activity types",
    "drawer.types_add":       "Add a type",
    "drawer.types_label":     "Label",
    "drawer.types_color":     "Colour",
    "drawer.types_system":    "System (not editable)",

    "drawer.tools_title":     "Tools",
    "drawer.tools_add":       "Add a tool",
    "drawer.tools_name":      "Tool name",
    "drawer.tools_category":  "Category",
    "drawer.tools_category_placeholder": "E.g.: Design, Development, Communication…",

    // ── Default activity types ───────────────────────────────
    "activity.work":          "Work",
    "activity.meeting":       "Meeting",
    "activity.training":      "Training",
    "activity.admin":         "Administrative",
    "activity.break":         "Break",
    "activity.undocumented":  "Undocumented",

    // ── Report / Final ───────────────────────────────────────
    "report.title":           "Internship Report",
    "report.upload_title":    "Upload your logs",
    "report.upload_instructions": "Select all the JSON files from your internship folder. The app will merge them automatically.",
    "report.upload_cta":      "Choose files",
    "report.upload_drop":     "Or drag files here",
    "report.validation_ok":   "Files validated",
    "report.validation_error_uuid": "These files do not belong to the same student.",
    "report.validation_warning_time": "Some logs appear to have been created in less time than the declared hours.",
    "report.validation_conflict":     "Two versions of the same log were found. Which one should be kept?",
    "report.keep_newer":      "Keep the newer one",
    "report.keep_older":      "Keep the older one",

    "report.section_reflection":     "Final reflection",
    "report.reality_vs_expectation": "In a few sentences, describe what this internship was actually about — now that you've lived it — compared to what you expected at the start.",
    "report.significant_work":       "What were the two or three most significant things you worked on? Why?",
    "report.proud_moment":           "Describe a moment you're genuinely proud of.",
    "report.failure_moment":         "Describe a moment where something went wrong or didn't go as planned.",
    "report.failure_lesson":         "What did you learn from it?",
    "report.env_lesson":             "What did you learn about working in a professional environment that school hadn't fully prepared you for?",
    "report.supervisor_rel":         "How was your relationship with your supervisor and colleagues?",
    "report.advice":                 "What advice would you give a student starting this same internship?",
    "report.would_do_differently":   "If you could do it again, what would you do differently?",
    "report.comments":               "Additional comments",

    "report.tools_reflection_title":   "Tools reflection",
    "report.tools_proficiency_start":  "Level at start",
    "report.tools_proficiency_end":    "Level at end",
    "report.tools_notes":              "Notes",
    "report.proficiency_none":         "None",
    "report.proficiency_beginner":     "Beginner",
    "report.proficiency_intermediate": "Intermediate",
    "report.proficiency_advanced":     "Advanced",

    "report.collab_title":      "Collaborator appreciation",
    "report.collab_note":       "This is private. It will appear in your report but will not be shared automatically.",
    "report.collab_placeholder":"What you appreciated, learned from, or took away from this person…",

    "report.competencies_title":    "Competency reflection",
    "report.competencies_helpful":  "Helpful skills",
    "report.competencies_helpful_q":"Which skills or knowledge from your coursework turned out to be genuinely useful? In what context?",
    "report.competencies_gaps":     "Gaps identified",
    "report.competencies_gaps_q":   "Where did you feel underprepared? What did that look like in practice?",
    "report.competencies_improve":  "What you could have done differently",
    "report.competencies_improve_q":"If you could go back — either before or during the internship — what would you do differently to better prepare yourself?",
    "report.competency_field":      "Competency",
    "report.competency_context":    "Course or context",
    "report.competency_how":        "How it helped",
    "report.gap_how":               "How it manifested",
    "report.gap_impact":            "Impact on your work",
    "report.improve_what":          "What",
    "report.improve_when_before":   "Before the internship",
    "report.improve_when_during":   "During the internship",
    "report.improve_how":           "How",

    "report.future_title":          "What's next?",
    "report.future_direction":      "How does this internship shape your direction — in your studies, your career, or both?",
    "report.future_next_steps":     "What are your concrete next steps?",
    "report.future_skills":         "Which skills or areas do you want to develop further based on this experience?",

    "report.project_outcomes_title":   "Project outcomes",
    "report.project_delivered":        "Project delivered",
    "report.project_client_feedback":  "Summary of client feedback",
    "report.project_contribution":     "Your personal contribution",
    "report.project_collab_reflection":"Reflection on collaboration",
    "report.project_final_impression": "Final impression of this project",
    "report.project_appreciation":     "What you appreciated about this project or its team",

    // ── Dashboard ────────────────────────────────────────────
    "dashboard.title":              "Dashboard",
    "dashboard.section_timeline":   "Timeline",
    "dashboard.section_breakdown":  "Time breakdown",
    "dashboard.section_tools":      "Tools used",
    "dashboard.section_lessons":    "Learning",
    "dashboard.section_reflection": "Reflection",
    "dashboard.total_days":         "Days worked",
    "dashboard.total_hours":        "Documented hours",
    "dashboard.avg_rating":         "Average rating",
    "dashboard.top_activity":       "Top activity",
    "dashboard.settings_note":      "This report was generated with settings that differ from the defaults.",
    "dashboard.grayzone_evolution": "Undocumented time over the internship",
    "dashboard.hide_appreciation":  "Hide appreciations",
    "dashboard.show_appreciation":  "Show appreciations",

    // ── Validation & Errors ──────────────────────────────────
    "error.required":         "This field is required.",
    "error.email":            "Invalid email address.",
    "error.date":             "Invalid date.",
    "error.time_order":       "End time must be after start time.",
    "error.grayzone":         "{pct}% of your day is undocumented ({min} min). Please describe how you spent it.",
    "error.merge_uuid":       "Cannot merge: these files belong to different students.",
    "error.no_files":         "No files selected.",

    // ── Making-of footer ────────────────────────────────────
    "making.label":    "How this tool was made",
    "making.title":    "How this tool was made",
    "making.p1":       "This tool was built through iterative collaboration between Elisa Schaeffer, Dean of Technology and Design at Collège LaSalle Montréal, and Claude (Anthropic), an AI assistant. The pedagogical content, structure, features, priorities, and editorial choices were defined, questioned, and refined by Elisa at every step. Claude generated the code, proposed phrasings, and flagged inconsistencies — but every substantive decision was made by a human.",
    "making.p2":       "This is not one-shot AI content. It is the result of a prolonged review dialogue: every session was read, critiqued, and corrected. The tool evolves.",
    "making.p3":       "Thoughtful AI use — Generative AI is a work tool, not a substitute for professional judgment. This project illustrates an approach where the human remains the author: AI amplifies production capacity, but editorial, pedagogical, and ethical responsibility remains entirely human.",
    "making.updated":  "Last updated: April 2026.",
  }
};

// ── i18n engine ──────────────────────────────────────────────

function t(key, replacements = {}) {
  const lang = localStorage.getItem("lang") || "fr-CA";
  let str = LANG[lang]?.[key] ?? LANG["fr-CA"]?.[key] ?? key;
  for (const [k, v] of Object.entries(replacements)) {
    str = str.replace(`{${k}}`, v);
  }
  return str;
}

function applyLanguage(lang) {
  localStorage.setItem("lang", lang);
  document.querySelectorAll("[data-i18n]").forEach(el => {
    const key = el.getAttribute("data-i18n");
    const attr = el.getAttribute("data-i18n-attr");
    const val = t(key);
    if (attr) {
      el.setAttribute(attr, val);
    } else {
      el.textContent = val;
    }
  });
  document.querySelectorAll("[data-i18n-placeholder]").forEach(el => {
    el.placeholder = t(el.getAttribute("data-i18n-placeholder"));
  });
  // Update lang toggle button
  document.querySelectorAll(".lang-toggle-btn").forEach(btn => {
    btn.textContent = t("nav.lang");
    btn.setAttribute("data-lang-target", lang === "fr-CA" ? "en-CA" : "fr-CA");
  });
  document.documentElement.lang = lang === "fr-CA" ? "fr" : "en";
}

function getCurrentLang() {
  return localStorage.getItem("lang") || "fr-CA";
}

function formatDate(isoString) {
  const lang = getCurrentLang();
  return new Intl.DateTimeFormat(lang, { dateStyle: "long" }).format(new Date(isoString));
}

function formatTime(isoString) {
  const lang = getCurrentLang();
  return new Intl.DateTimeFormat(lang, { timeStyle: "short" }).format(new Date(isoString));
}

function formatDuration(minutes) {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  const lang = getCurrentLang();
  if (lang === "fr-CA") {
    return h > 0 ? `${h}h${m > 0 ? String(m).padStart(2,"0") : ""}` : `${m} min`;
  }
  return h > 0 ? `${h}h ${m > 0 ? m + "m" : ""}`.trim() : `${m}m`;
}
