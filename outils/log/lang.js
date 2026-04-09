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
    "nav.calendar":           "Calendrier",
    "nav.weekly":             "Bilan hebdo",
    "nav.report":             "Suivi de progression",
    "nav.toggle_dark":        "Mode sombre",
    "nav.reset":              "Recommencer",
    "nav.toggle_light":       "Mode clair",

    // ── Global actions ───────────────────────────────────────
    "action.save":            "Enregistrer",
    "action.download":        "Télécharger le journal",
    "action.add":             "Ajouter",
    "action.delete":          "Supprimer",
    "action.cancel":          "Annuler",
    "action.confirm":         "Confirmer",
    "action.next":            "Suivant",
    "action.back":            "Retour",
    "action.open_log":        "Ouvrir le journal du jour",
    "action.new_todo":        "Nouvelle tâche",

    // ── Global field labels ──────────────────────────────────
    "field.name":             "Nom complet",
    "field.student_id":       "Numéro d'étudiant·e",
    "field.email":            "Courriel institutionnel",
    "field.program_placeholder": "ex. : 420.BX Programmation de jeux vidéo",
    "field.program":          "Programme d'études",
    "field.cohort":           "Cohorte / Semestre",
    "field.cohort_placeholder": "ex. : Hiver 2026",
    "field.teacher":          "Enseignant·e responsable",
    "field.start_date":       "Date de début",
    "field.end_date":         "Date de fin prévue",
    "field.required":         "Champ obligatoire",
    "field.hours_per_day":    "Heures de travail prévues par jour",
    "field.total_hours_target":      "Total d'heures à compléter (optionnel)",
    "field.total_hours_target_hint": "Si défini, le suivi de progression se base sur ce total plutôt que sur le rythme quotidien.",
    "field.hours_per_day_hint":"Utilisé pour calculer si tu es en avance ou en retard sur le nombre d'heures attendu.",
    "field.week_end_day":     "Dernier jour de ta semaine de travail",
    "field.week_end_day_hint":"Ce jour déclenchera le rappel de bilan hebdomadaire et le rapport hebdomadaire.",
    "field.day_mon":          "Lundi",
    "field.day_tue":          "Mardi",
    "field.day_wed":          "Mercredi",
    "field.day_thu":          "Jeudi",
    "field.day_fri":          "Vendredi",
    "field.day_sat":          "Samedi",
    "field.day_sun":          "Dimanche",

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
    "welcome.export_config":      "Exporter la configuration",
    "welcome.import_config":      "Changer d'ordinateur",
    "welcome.import_config_hint": "Tu as déjà un fichier de config d'un autre ordinateur ? Importe-le ici.",
    "welcome.cta_weekly":     "Bilan de la semaine",
    "welcome.cta_report":     "Voir mon suivi de progression",

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
    "setup.situation_before_company":    "Quelle était la situation dans l'organisation avant ton arrivée? Quel problème ou quelle opportunité ce stage vient-il adresser?",

    // Setup — Course selector
    "setup.course_code":      "Cours de stage",
    "setup.course_code_hint": "Le cours associé à ton stage détermine les compétences que tu devras développer et documenter.",

    // Setup — Schedule / work hours
    "setup.schedule_title":         "Horaire de travail",
    "setup.work_days":              "Jours de travail",
    "setup.work_hours":             "Heures par jour",
    "setup.work_hours_hint":        "Utilisé pour calculer les heures attendues chaque jour de travail.",
    "setup.calendar_week_start":    "Début de semaine (calendrier)",
    "setup.calendar_week_start_hint": "Détermine comment les rangées du calendrier sont découpées. N'affecte pas le jour de bilan hebdomadaire.",

    // Calendar page
    "cal.title":              "Calendrier de stage",
    "cal.hours_done":         "Heures réalisées",
    "cal.hours_planned":      "Heures prévues (jours restants)",
    "cal.hours_target":       "Objectif total",
    "cal.margin":             "Marge",
    "cal.margin_ahead":       "En avance",
    "cal.margin_behind":      "En retard",
    "cal.absences_title":     "Absences planifiées",
    "cal.absence_add":        "Ajouter une absence",
    "cal.absence_reason":     "Raison (optionnel)",
    "cal.absence_remove":     "Retirer",
    "cal.legend_work":        "Jour de travail",
    "cal.legend_nonwork":     "Congé / weekend",
    "cal.legend_absence":     "Absence planifiée",
    "cal.legend_today":       "Aujourd'hui",
    "cal.legend_daily":       "Journal téléchargé",
    "cal.legend_weekly":      "Bilan hebdo téléchargé",
    "cal.legend_weekly_due":  "Bilan hebdo à faire",
    "cal.legend_final":       "Rapport final téléchargé",
    "cal.no_data":            "Aucune donnée de stage trouvée. Téléverse ton fichier JSON ou configure ton stage d'abord.",
    "cal.upload_cta":         "Charger un fichier JSON",
    "cal.week_start_label":   "Début de semaine",
    "cal.settings_title":     "Paramètres du calendrier",
    "cal.click_to_toggle":    "Clique sur un jour pour marquer une absence ou retirer le marquage.",
    "cal.absence_note_placeholder": "Ex. : Congé férié, examen, rendez-vous…",

    // Setup — Project JSON import (hub pathway only)
    "setup.import_projects_title":       "Importer des projets (JSON)",
    "setup.import_projects_hint":        "Si ton superviseur·e t'a fourni un fichier JSON de projets au format lci-stage-projects-v1, colle son contenu ici pour préremplir ta liste de projets.",
    "setup.import_projects_placeholder": "{ \"schema\": \"lci-stage-projects-v1\", \"projects\": [ … ] }",
    "setup.import_projects_cta":         "Importer",
    "setup.import_projects_empty":       "Le champ est vide.",
    "setup.import_projects_invalid_json":"JSON invalide — vérifie la syntaxe.",
    "setup.import_projects_wrong_schema":"Format non reconnu. Utilise le schéma lci-stage-projects-v1.",
    "setup.import_projects_empty_list":  "Aucun projet valide trouvé dans le JSON.",

    // Setup — Hub pathway
    "setup.add_project":      "Ajouter un projet",
    "setup.project_name":     "Nom du projet",
    "setup.client_name":      "Nom du client",
    "setup.brief":            "Résumé du mandat",
    "setup.project_start":    "Date de début du projet",
    "setup.student_joined":   "Date à laquelle tu t'es joint·e au projet",
    "setup.project_initial_impression": "Quelle est ton impression initiale de ce projet — portée, complexité, inconnues?",
    "setup.project_challenges":         "Quels défis anticipes-tu?",
    "setup.situation_before":            "Quelle était la situation avant ton arrivée? Quel problème ou quelle opportunité ce stage vient-il adresser?",

    // ── Daily Log ────────────────────────────────────────────
    "log.time_start":         "Heure de début",
    "log.time_end":           "Heure de fin",
    "log.day_duration":       "Durée totale",
    "log.day_modality":       "Modalité",
    "log.day_type_onsite":    "En présentiel",
    "log.day_type_remote":    "À distance",
    "log.late_filing":        "Journal en retard — je rédige ce journal après la journée concernée",

    "log.section_tasks":      "Tâches de la journée",
    "log.add_task":           "Ajouter une tâche",
    "log.task_description":   "Description de la tâche",
    "log.task_duration":      "Durée",
    "log.task_type":          "Type d'activité",
    "log.task_project":       "Pour quel projet?",
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

    "log.grayzone_info":      "Il reste du temps non comptabilisé dans tes tâches.",
    "log.grayzone_prompt":    "Comment as-tu passé ce temps? (transitions, déplacements, temps informel…)",
    "log.grayzone_label":     "Temps non documenté",

    "log.section_reflection": "Bilan de la journée",
    "log.obstacle":           "As-tu rencontré un problème ou un obstacle aujourd'hui?",
    "log.obstacle_response":  "Comment l'as-tu géré, ou comment prévois-tu le gérer?",
    "log.win":                "Quelle est ta plus belle victoire, ton apprentissage ou ta fierté d'aujourd'hui?",
    "log.section_project_status": "État des projets actifs",
    "log.project_status_prompt":  "Fais un point rapide sur chaque projet en cours.",
    "log.project_status_label":   "État",
    "log.project_status_notes":   "Notes",
        "log.morning_energy":     "Avec quelle énergie arrives-tu ce matin? (motivation, forme)",
    "log.morning_energy_hint": "Cette note apparaît sur la courbe d'humeur avec ton bilan de fin de journée.",
    "log.day_rating":         "Comment évalues-tu cette journée?",
    "log.rating_1":           "Difficile",
    "log.rating_2":           "Lente",
    "log.rating_3":           "Correcte",
    "log.rating_4":           "Bonne",
    "log.rating_5":           "Excellente",
    "log.closing_word":       "Un mot ou une courte phrase pour décrire comment tu repars aujourd'hui",
    "log.plan_tomorrow":      "Qu'est-ce que tu prévois faire demain?",
    "log.plan_tomorrow_hint": "Ces notes apparaîtront comme rappel à l'ouverture du prochain journal.",
    "log.tomorrow_reminder":  "Hier tu prévoyais :",
    "log.section_weekly":     "Bilan de la semaine",
    "log.weekly_highlight":   "Quelle a été la meilleure chose de cette semaine?",
    "log.weekly_learning":    "Qu'est-ce que tu garderais comme bonne pratique pour la semaine prochaine?",
    "log.weekly_change":      "Qu'est-ce que tu ferais différemment la semaine prochaine?",
    "log.weekly_prompt":      "C'est la fin de ta semaine de travail. Prends deux minutes pour faire un bilan.",

    // Competency reflection — daily (optional) and weekly (mandatory)
    "log.competency_section":        "Réflexion sur les compétences",
    "log.competency_daily_hint":     "Optionnel — note ce que tu as observé aujourd'hui en lien avec cette compétence.",
    "log.competency_weekly_hint":    "Obligatoire — décris comment tu as développé cette compétence cette semaine.",
    "log.competency_weekly_missing": "Veuillez remplir la réflexion pour chaque compétence avant de terminer.",

    "log.section_todos":      "Liste de tâches",
    "log.todos_morning_prompt": "Quelles sont tes priorités pour aujourd'hui?",
    "log.todos_eod_prompt":     "Y a-t-il des tâches à ajouter avant de terminer?",
    "log.todo_description":   "Tâche à faire",

    "log.download_reminder":  "N'oublie pas de télécharger ton journal avant de fermer cet onglet.",
    "log.download_cta":       "Télécharger le journal du jour",
    "log.upload_form_title":  "Envoie ton journal à ton superviseur·e",
    "log.end_of_internship_title": "Ton stage se termine aujourd'hui! 🎓",
    "log.end_of_internship_hint":  "C'est le moment de générer ton rapport de progression final. Téléverse d'abord ton journal, puis ouvre le suivi de progression.",
    "log.end_of_internship_cta":   "Ouvrir le suivi de progression →",
    "log.weekly_report_reminder_title": "Fin de ta semaine de travail",
    "log.weekly_report_reminder_hint":  "Pense à générer et imprimer ton bilan hebdomadaire — ton·ta superviseur·e pédagogique pourrait te le demander.",
    "log.weekly_report_reminder_cta":   "Générer le bilan hebdomadaire →",
    "log.weekly_report_print_hint":     "Génère le bilan, puis utilise le bouton Imprimer / PDF pour en conserver une copie.",
    "log.upload_form_hint":   "Après avoir téléchargé ton fichier, téléverse-le aussi via le formulaire ci-dessous. Garde aussi le fichier dans ton dossier personnel — tu en auras besoin pour le suivi de progression.",
    "log.upload_form_cta":    "Ouvrir le formulaire de dépôt →",
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
    "activity.programming":   "Programmation",
    "activity.design":         "Design",
    "activity.research":       "Recherche",
    "activity.planning":       "Planification",
    "activity.data_analysis":  "Analyse de données",
    "activity.debugging":      "Débogage",
    "activity.production":     "Production",
    "activity.testing":        "Tests",
    "activity.documentation":  "Documentation",
    "activity.client_work":    "Travail client",
    "activity.meeting":       "Réunion",
    "activity.training":      "Formation",
    "activity.admin":         "Administratif",
    "activity.break":         "Pause",
    "activity.other":          "Autre / Non spécifié",

    // ── Report / Final ───────────────────────────────────────
    "report.upload_title":    "Téléverser tes journaux",
    "report.upload_instructions": "Sélectionne tous les fichiers JSON de ton dossier de stage. L'application les fusionnera automatiquement.",
    "report.clear_cache":     "Effacer la session en cache",
    "report.upload_cta":      "Choisir les fichiers",
    "report.upload_drop":     "Ou glisse les fichiers ici",
    "report.validation_ok":   "Fichiers validés",
    "report.validation_warning_time": "Certains journaux semblent avoir été créés en moins de temps que les heures déclarées.",
    "report.validation_conflict":     "Deux versions du même journal ont été trouvées. Laquelle garder?",
    "report.keep_newer":      "Garder la plus récente",
    "report.keep_older":      "Garder la plus ancienne",
    "report.download_reflection": "Télécharger mes réponses (JSON)",
    "report.download_full_json":  "Télécharger le journal complet (JSON)",
    "report.edit_reflection":     "Modifier mes réponses",
    "report.reflection_saved":    "Réponses sauvegardées — tu peux les réimporter lors d'une prochaine session.",

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
    "report.suggestions_school":       "Suggestions pour la formation",
    "report.suggestions_school_q":     "Qu'est-ce que ce stage révèle sur des lacunes dans ta formation? Quels cours, outils, méthodes ou expériences auraient pu mieux te préparer?",

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
    "dashboard.section_competencies": "Suivi des compétences",
    "dashboard.total_days":         "Jours travaillés",
    "dashboard.total_hours":        "Heures documentées",
    "dashboard.avg_rating":         "Évaluation moyenne",
    "dashboard.top_activity":       "Activité principale",
    "dashboard.settings_note":      "Ce rapport a été généré avec des paramètres différents des valeurs par défaut.",
    "dashboard.section_mood":       "Humeur et énergie",
    "dashboard.mood_timeline":      "Courbe d'humeur au fil du stage",
    "dashboard.section_weekly":     "Bilans hebdomadaires",
    "dashboard.weekly_highlight":   "Meilleure chose de la semaine",
    "dashboard.weekly_learning":    "Bonne pratique à conserver",
    "dashboard.weekly_change":      "À faire différemment",
    "dashboard.hide_appreciation":  "Masquer les appréciations",
    "dashboard.show_appreciation":  "Afficher les appréciations",
    "dashboard.print_report":       "Version imprimable",
    "dashboard.section_modality":   "Modalité de présence",
    "dashboard.modality_onsite":    "Jours en présentiel",
    "dashboard.modality_remote":    "Jours à distance",
    "dashboard.modality_both":      "Jours hybrides",
    "dashboard.modality_unspecified": "Non précisé",

    // Hub view modes and competency labels
    "hub.view_students":     "Par étudiant·e",
    "hub.view_course":       "Par cours",
    "hub.view_competency":   "Par compétence",
    "hub.comp_coverage_label": "Réflexions hebdo / semaines écoulées",
    "hub.comp_daily_label":  "Observations quotidiennes",
    "hub.no_course":         "(Aucun cours enregistré)",
    "hub.filter_course":     "Cours",

    // ── Validation & Errors ──────────────────────────────────
    "error.merge_uuid":       "Impossible de fusionner : les fichiers proviennent de comptes différents.",
    "error.config_not_log":    "Ce fichier est une configuration, pas un journal. Utilise 'Changer d'ordinateur' sur la page de configuration.",
    "error.no_files":         "Aucun fichier sélectionné.",

    // ── Reset dialogue
    "reset.title":            "Effacer toutes les données?",
    "reset.warning":          "Cette action est irréversible. Toutes les données de ta configuration et tes journaux en cours dans ce navigateur seront effacées.",
    "reset.download_first":   "Tu devrais d'abord télécharger tes journaux si tu ne l'as pas encore fait.",
    "reset.confirm_label":    "Pour confirmer, écris RECOMMENCER dans le champ ci-dessous :",
    "reset.cta":              "Effacer définitivement",
    "reset.cancel":           "Annuler",
    "reset.keep_prefs":       "Conserver mes préférences de langue et de thème",


    // ── Intro tour ───────────────────────────────────────────────
    "tour.skip":          "Passer",
    "tour.prev":          "Précédent",
    "tour.next":          "Suivant",
    "tour.finish":        "Commencer !",
    "tour.step1.title":   "Bienvenue dans ton journal",
    "tour.step1.text":    "Ce journal est ton espace quotidien. Tu y documentes ta journée, tes tâches, tes apprentissages et ton humeur. Tout est sauvegardé automatiquement.",
    "tour.step2.title":   "Commence par ton énergie du matin",
    "tour.step2.text":    "Avant de commencer, évalue ton énergie d'arrivée. Cette note apparaîtra sur ta courbe d'humeur dans le rapport final.",
    "tour.step3.title":   "Tes priorités du jour",
    "tour.step3.text":    "Consulte ta liste de tâches en haut — ce sont les choses que tu avais prévues hier ou ajoutées précédemment. Tu peux en ajouter de nouvelles.",
    "tour.step4.title":   "Documente tes tâches",
    "tour.step4.text":    "Ajoute une tâche pour chaque activité de ta journée. Précise le type, la durée, les outils et les personnes impliquées en glissant depuis les tiroirs, ou en cliquant les boutons + sous chaque tâche.",
    "tour.step5.title":   "Tiroirs : personnes, outils, types",
    "tour.step5.text":    "Les boutons à droite (ou en bas de chaque tâche sur mobile) ouvrent des tiroirs. Définis d'abord tes collaborateurs, outils et types d'activité — tu pourras ensuite les glisser sur tes tâches.",
    "tour.step6.title":   "Bilan de fin de journée",
    "tour.step6.text":    "En bas du journal : un obstacle rencontré, ta victoire du jour, une évaluation et un mot pour résumer ta journée. Et ce que tu prévois pour demain.",
    "tour.step7.title":   "Télécharge ton journal",
    "tour.step7.text":    "Avant de fermer l'onglet, télécharge ton journal en JSON. Crée un dossier sur ton ordinateur et conserve tous tes fichiers. Tu en auras besoin pour générer le rapport final.",

    // ── Weekly report page ───────────────────────────────────────
    "weekly.title":          "Bilan hebdomadaire",
    "weekly.upload_prompt":  "Téléverse ton fichier journal pour générer le bilan de la semaine.",
    "weekly.week_select":    "Sélectionne la semaine",
    "weekly.week_label":     "Semaine du",
    "weekly.no_logs":        "Aucun journal trouvé pour cette semaine.",
    "weekly.hours":          "Heures documentées",
    "weekly.day":            "Jour",
    "weekly.days":           "Jours",
    "weekly.completed_weeks": "Semaines complétées",
    "weekly.open_print":      "Ouvrir pour impression",
    "weekly.avg_rating":     "Note moyenne",
    "weekly.section_days":   "Jours de la semaine",
    "weekly.section_activity": "Répartition des activités",
    "weekly.section_mood":   "Humeur",
    "weekly.section_wins":   "Victoires",
    "weekly.section_obstacle": "Obstacle",
    "weekly.section_wrap":   "Bilan",
    "weekly.section_projects": "État des projets",
    "weekly.no_wrap":        "(Aucun bilan hebdomadaire rempli pour cette semaine.)",
    "weekly.print":          "Imprimer / PDF",
    "weekly.download_json":  "Télécharger JSON",
    "weekly.morning":        "Énergie matinale",
    "weekly.evening":        "Bilan de journée",

    // ── Making-of footer ────────────────────────────────────
    "making.label":    "Comment cet outil a été créé",
    "making.p1":       "Cet outil a été construit par une collaboration itérative entre Elisa Schaeffer, Doyenne de la Technologie et du Design au Collège LaSalle Montréal, et Claude (Anthropic), un assistant IA. Le contenu pédagogique, la structure, les fonctionnalités, les priorités et les choix éditoriaux ont été définis, questionnés et affinés par Elisa à chaque étape. Claude a généré le code, proposé des formulations et signalé les incohérences — mais chaque décision substantielle a été prise par un être humain.",
    "making.p2":       "Ce n'est pas du contenu IA généré en une seule fois. C'est le résultat d'un dialogue de révision prolongé : chaque session a été lue, critiquée et corrigée. L'outil évolue.",
    "making.p3":       "Utilisation réfléchie de l'IA — L'IA générative est un outil de travail, non un substitut au jugement professionnel. Ce projet illustre une approche où l'humain reste l'auteur·rice : l'IA amplifie la capacité de production, mais la responsabilité éditoriale, pédagogique et éthique reste entièrement humaine.",
    "making.updated":  "Dernière mise à jour : avril 2026.",
  },

  "en-CA": {

    // ── Global / Navigation ──────────────────────────────────
    "nav.setup":              "Setup",
    "nav.log":                "Daily Log",
    "nav.calendar":           "Calendar",
    "nav.weekly":             "Weekly report",
    "nav.report":             "Progress tracker",
    "nav.toggle_dark":        "Dark mode",
    "nav.reset":              "Start over",
    "nav.toggle_light":       "Light mode",

    // ── Global actions ───────────────────────────────────────
    "action.save":            "Save",
    "action.download":        "Download log",
    "action.add":             "Add",
    "action.delete":          "Delete",
    "action.cancel":          "Cancel",
    "action.confirm":         "Confirm",
    "action.next":            "Next",
    "action.back":            "Back",
    "action.open_log":        "Open today's log",
    "action.new_todo":        "New task",

    // ── Global field labels ──────────────────────────────────
    "field.name":             "Full name",
    "field.student_id":       "Student number",
    "field.email":            "Institutional email",
    "field.program_placeholder": "e.g.: 420.BX Video Game Programming",
    "field.program":          "Program of study",
    "field.cohort":           "Cohort / Semester",
    "field.cohort_placeholder": "e.g.: Winter 2026",
    "field.teacher":          "Responsible teacher",
    "field.start_date":       "Start date",
    "field.end_date":         "Scheduled end date",
    "field.required":         "Required field",
    "field.hours_per_day":    "Expected working hours per day",
    "field.total_hours_target":      "Total hours to complete (optional)",
    "field.total_hours_target_hint": "If set, progress tracking is based on this total rather than the daily pace.",
    "field.hours_per_day_hint":"Used to calculate whether you are ahead or behind the expected hour count.",
    "field.week_end_day":     "Last day of your work week",
    "field.week_end_day_hint":"This day triggers the weekly wrap-up reminder and the weekly report reminder.",
    "field.day_mon":          "Monday",
    "field.day_tue":          "Tuesday",
    "field.day_wed":          "Wednesday",
    "field.day_thu":          "Thursday",
    "field.day_fri":          "Friday",
    "field.day_sat":          "Saturday",
    "field.day_sun":          "Sunday",

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
    "welcome.export_config":      "Export configuration",
    "welcome.import_config":      "Switch computer",
    "welcome.import_config_hint": "Already have a config file from another computer? Import it here.",
    "welcome.cta_weekly":     "Weekly report",
    "welcome.cta_report":     "Open my progress tracker",

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
    "setup.section_profile":  "Your profile",
    "setup.section_internship":"Your internship",
    "setup.section_expectations": "Your expectations",

    // Setup — Course selector
    "setup.course_code":      "Internship course",
    "setup.course_code_hint": "The course associated with your internship determines the competencies you will need to develop and document.",

    // Setup — Schedule / work hours
    "setup.schedule_title":         "Work schedule",
    "setup.work_days":              "Working days",
    "setup.work_hours":             "Hours per day",
    "setup.work_hours_hint":        "Used to calculate expected hours for each working day.",
    "setup.calendar_week_start":    "Calendar week start",
    "setup.calendar_week_start_hint": "Controls how rows are split in the calendar view. Does not affect the weekly wrap-up day.",

    // Calendar page
    "cal.title":              "Internship calendar",
    "cal.hours_done":         "Hours logged",
    "cal.hours_planned":      "Planned hours (remaining days)",
    "cal.hours_target":       "Total target",
    "cal.margin":             "Margin",
    "cal.margin_ahead":       "Ahead",
    "cal.margin_behind":      "Behind",
    "cal.absences_title":     "Planned absences",
    "cal.absence_add":        "Add absence",
    "cal.absence_reason":     "Reason (optional)",
    "cal.absence_remove":     "Remove",
    "cal.legend_work":        "Working day",
    "cal.legend_nonwork":     "Day off / weekend",
    "cal.legend_absence":     "Planned absence",
    "cal.legend_today":       "Today",
    "cal.legend_daily":       "Daily log downloaded",
    "cal.legend_weekly":      "Weekly report downloaded",
    "cal.legend_weekly_due":  "Weekly report due",
    "cal.legend_final":       "Final report downloaded",
    "cal.no_data":            "No internship data found. Upload your JSON file or complete setup first.",
    "cal.upload_cta":         "Load a JSON file",
    "cal.week_start_label":   "Week starts on",
    "cal.settings_title":     "Calendar settings",
    "cal.click_to_toggle":    "Click a day to mark or unmark a planned absence.",
    "cal.absence_note_placeholder": "e.g. Public holiday, exam, appointment…",

    // Setup — Project JSON import (hub pathway only)
    "setup.import_projects_title":       "Import projects (JSON)",
    "setup.import_projects_hint":        "If your supervisor provided a project JSON file in lci-stage-projects-v1 format, paste its contents here to pre-fill your project list.",
    "setup.import_projects_placeholder": "{ \"schema\": \"lci-stage-projects-v1\", \"projects\": [ … ] }",
    "setup.import_projects_cta":         "Import",
    "setup.import_projects_empty":       "The field is empty.",
    "setup.import_projects_invalid_json":"Invalid JSON — check the syntax.",
    "setup.import_projects_wrong_schema":"Unrecognized format. Use the lci-stage-projects-v1 schema.",
    "setup.import_projects_empty_list":  "No valid projects found in the JSON.",

    "setup.teacher_field_title":       "Champ demandé par ton·ta superviseur·e pédagogique",
    "setup.teacher_field_hint":        "Si ton·ta superviseur·e pédagogique demande un champ spécifique dans ton bilan hebdomadaire, définis-le ici. Il apparaîtra dans la carte de bilan du journal.",
    "setup.teacher_field_label":       "Intitulé du champ",
    "setup.teacher_field_placeholder": "Texte indicatif (optionnel)",
    "setup.teacher_field_label_placeholder":       "ex. : Compétences démontrées cette semaine",
    "setup.teacher_field_placeholder_placeholder": "ex. : Décris en 2-3 phrases…",
    // ── Weekly report page ───────────────────────────────────────
    "weekly.title":          "Weekly report",
    "weekly.upload_prompt":  "Upload your log file to generate the weekly report.",
    "weekly.week_select":    "Select week",
    "weekly.week_label":     "Week of",
    "weekly.no_logs":        "No logs found for this week.",
    "weekly.hours":          "Hours logged",
    "weekly.day":            "Day",
    "weekly.days":           "Days",
    "weekly.completed_weeks": "Completed weeks",
    "weekly.open_print":      "Open for printing",
    "weekly.avg_rating":     "Average rating",
    "weekly.section_days":   "Days of the week",
    "weekly.section_activity": "Activity breakdown",
    "weekly.section_mood":   "Mood",
    "weekly.section_wins":   "Wins",
    "weekly.section_obstacle": "Obstacle",
    "weekly.section_wrap":   "Weekly wrap-up",
    "weekly.section_projects": "Project status",
    "weekly.no_wrap":        "(No weekly wrap-up filled in for this week.)",
    "weekly.print":          "Print / PDF",
    "weekly.download_json":  "Download JSON",
    "weekly.morning":        "Morning energy",
    "weekly.evening":        "End-of-day rating",

    // ── Making-of footer ─────────────────────────────────────────
    "making.label":   "How this tool was made",
    "making.p1":      "This internship journal was designed and built at Collège LaSalle Montréal as an open educational tool.",
    "making.p2":      "It runs entirely in your browser. No data is sent anywhere. Everything stays on your device.",
    "making.p3":      "Built with Claude (Anthropic) · Collège LaSalle Montréal",
    "making.updated": "April 2026",

    // ── Dashboard ────────────────────────────────────────────────
    "dashboard.weekly_highlight":     "Highlight",
    "dashboard.weekly_learning":      "Learning",
    "dashboard.weekly_change":        "Change",
    "dashboard.settings_note":        "This report was generated with non-default settings.",
    "dashboard.print_report":         "Print / Save PDF",
    "dashboard.section_competencies": "Competency tracking",

    // Hub view modes
    "hub.view_students":       "By student",
    "hub.view_course":         "By course",
    "hub.view_competency":     "By competency",
    "hub.comp_coverage_label": "Weekly reflections / weeks elapsed",
    "hub.comp_daily_label":    "Daily observations",
    "hub.no_course":           "(No course on file)",
    "hub.filter_course":       "Course",

    // ── Report page ──────────────────────────────────────────────
    "report.upload_title":        "Progress tracker",
    "report.upload_instructions": "Upload all your daily JSON files to generate your progress report.",
    "report.upload_cta":          "Choose files",
    "report.upload_drop":         "or drag and drop here",
    "report.upload_btn":          "Choose files",
    "report.clear_cache":         "Clear cached session",
    "report.download_reflection": "Download my answers (JSON)",
    "report.download_full_json":  "Download full journal (JSON)",
    "report.edit_reflection":     "Edit my answers",
    "report.reflection_saved":    "Answers saved — you can re-import them in a future session.",
    "report.section_reflection":  "Final reflection",
    "report.collab_note":         "This field is private. It will appear in your report but will not be shared automatically.",
    "report.project_final_impression": "Final impression of this project",
    "report.competencies_helpful_q": "Which competencies from your program were most useful?",
    "report.competencies_improve_q": "Which competencies do you wish had been stronger?",
    "report.project_collab_reflection": "How did collaboration on this project go?",
    "report.proficiency_none":        "None",
    "report.proficiency_beginner":    "Beginner",
    "report.proficiency_intermediate":"Intermediate",
    "report.proficiency_advanced":    "Advanced",

    // ── Actions ──────────────────────────────────────────────────
    "action.next":      "Next",
    "action.back":      "Back",
    "action.confirm":   "Finish setup",
    "action.add":       "Add",
    "action.download":  "Download",
    "action.open_log":  "Open today's log",

    // ── Errors ───────────────────────────────────────────────────
    "error.no_files":         "No valid files found. Make sure you are uploading internship JSON files.",
    "error.merge_uuid":       "These files belong to different students. Upload files for one student at a time.",
    "error.config_not_log":   "This file is a configuration, not a log. Use \'Switch computer\' on the setup page.",
    "error.not_config":       "This file is not a valid configuration file.",

    // ── Reset modal ──────────────────────────────────────────────
    "reset.title":         "Start over",
    "reset.warning":       "This will permanently delete all your internship data from this browser.",
    "reset.download_first":"Make sure you have downloaded your log files first.",
    "reset.confirm_label": "Type RESET to confirm",
    "reset.keep_prefs":    "Keep my language and theme preferences",
    "reset.cancel":        "Cancel",
    "reset.cta":           "Delete everything and start over",

    // ── Setup — Teacher field ─────────────────────────────────────
    "setup.teacher_field_title":       "Field requested by your supervising teacher",
    "setup.teacher_field_hint":        "If your supervising teacher requires a specific field in your weekly report, define it here. It will appear in the weekly wrap card in your log.",
    "setup.teacher_field_label":       "Field label",
    "setup.teacher_field_placeholder": "Placeholder text (optional)",
    "setup.teacher_field_label_placeholder":       "e.g. Competencies demonstrated this week",
    "setup.teacher_field_placeholder_placeholder": "e.g. Describe in 2-3 sentences…",

    // ── Field labels ─────────────────────────────────────────────

  }  // end en-CA
};   // end LANG

// ── Translation lookup ────────────────────────────────────────
function t(key) {
  const lang = getCurrentLang();
  const val = LANG[lang]?.[key] ?? LANG["fr-CA"]?.[key];
  return val !== undefined ? val : key;
}

function getCurrentLang() {
  return localStorage.getItem("lang") || "fr-CA";
}

function applyLanguage(lang, persist = true) {
  if (persist) localStorage.setItem("lang", lang);

  document.querySelectorAll("[data-i18n]").forEach(el => {
    const key = el.getAttribute("data-i18n");
    const val = t(key);
    if (val && val !== key) {
      el.textContent = val;
    }
  });
  document.querySelectorAll("[data-i18n-placeholder]").forEach(el => {
    el.placeholder = t(el.getAttribute("data-i18n-placeholder"));
  });
  // Update lang toggle buttons — support both single-cycle and dual FR/EN pattern
  document.querySelectorAll(".lang-toggle-btn").forEach(btn => {
    const target = btn.getAttribute("data-lang-target");
    if (target) {
      // Dedicated button (data-lang-target="fr-CA" or "en-CA"):
      // highlight the active one, keep labels as-is
      btn.style.opacity     = target === lang ? "0.4" : "1";
      btn.style.fontWeight  = target === lang ? "400" : "600";
      btn.style.pointerEvents = target === lang ? "none" : "";
    } else {
      // Legacy single-cycle button: update label to show what clicking will switch TO
      btn.textContent = lang === "fr-CA" ? "EN" : "FR";
    }
  });
  document.documentElement.lang = lang === "fr-CA" ? "fr" : "en";
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
  if (!minutes) return "0 min";
  const h = Math.floor(minutes / 60);
  const m = Math.round(minutes % 60);
  const lang = getCurrentLang();
  if (h === 0) return lang === "fr-CA" ? `${m} min` : `${m} min`;
  if (m === 0) return lang === "fr-CA" ? `${h} h` : `${h} h`;
  return lang === "fr-CA" ? `${h} h ${m} min` : `${h} h ${m} min`;
}
