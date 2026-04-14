// ============================================================
// courses.js — Static competency data for the internship journal
// ============================================================
// No imports. Load as a plain <script> tag before app.js.
//
// HOW TO ADD A NEW PROGRAM
// ------------------------
// 1. Add an entry to the PROGRAMS array below.
//    - code:     official MEES program code (e.g. "420.BR")
//    - name:     bilingual display name
// 2. Add the corresponding course entry to COURSES (see below).
//
// HOW TO ADD A NEW COURSE
// -----------------------
// 1. Add a key to COURSES using the official course number (e.g. "420-SG6-AS").
// 2. Fill in title (bilingual), programs (array of program codes),
//    hours (corporate hours, not total), and competencies (array).
// 3. Each competency has:
//    - code:     ministerial competency code (e.g. "00SE")
//    - title:    bilingual object
//    - elements: array of element objects (see structure below)
// 4. Each element has:
//    - id:       "{competency_code}-{element_number}" (e.g. "00SE-1")
//    - title:    bilingual object
//    - criteria: array of { id, text } objects
//      - criterion id: "{element_id}.{criterion_number}" (e.g. "00SE-1.1")
//
// HOW TO ADD A NEW COMPETENCY TO AN EXISTING COURSE
// --------------------------------------------------
// Add a new object to the course's competencies array following
// the same structure. If the competency text is identical to one
// in another course, extract it to SHARED_COMPETENCIES and
// reference it with a spread: { ...SHARED_COMPETENCIES["00SE"], ... }
//
// SHARED COMPETENCIES
// -------------------
// 00SE and 00SH appear with identical element/criteria text across
// 420-JST-AS, 420-EP6-AS, and 420-SG6-AS. They are defined once
// here and referenced by spread in each course.
// If a shared competency ever diverges for a specific course,
// copy it inline and override — do not modify the shared definition.
// ============================================================


// ── Shared competency definitions ───────────────────────────────────────────
// Add new shared competencies here when the same text appears in 3+ courses.

const SHARED_COMPETENCIES = {

  "00SE": {
    code: "00SE",
    title: {
      "fr-CA": "Interagir dans un contexte professionnel",
      "en-CA": "Interact in a professional setting"
    },
    elements: [
      {
        id: "00SE-1",
        title: {
          "fr-CA": "Établir des relations professionnelles avec les utilisateurs et les clients",
          "en-CA": "Establish professional relationships with users and clients"
        },
        criteria: [
          { id: "00SE-1.1", text: { "fr-CA": "Attitudes et comportements démontrant la capacité d'écoute", "en-CA": "Attitudes and behaviors that demonstrate the ability to listen" } },
          { id: "00SE-1.2", text: { "fr-CA": "Adaptation du niveau de langage à la situation", "en-CA": "Adaptation of the level of language to the situation" } },
          { id: "00SE-1.3", text: { "fr-CA": "Respect des règles de politesse et de courtoisie", "en-CA": "Observance of rules of politeness and common courtesy" } },
          { id: "00SE-1.4", text: { "fr-CA": "Respect de l'approche client", "en-CA": "Observance of the client-based approach" } }
        ]
      },
      {
        id: "00SE-2",
        title: {
          "fr-CA": "Travailler au sein d'une équipe multidisciplinaire",
          "en-CA": "Work within a multidisciplinary team"
        },
        criteria: [
          { id: "00SE-2.1", text: { "fr-CA": "Attitudes et comportements démontrant le respect, l'ouverture d'esprit et un esprit de collaboration", "en-CA": "Attitudes and behaviors that demonstrate respect, openness and a collaborative spirit" } },
          { id: "00SE-2.2", text: { "fr-CA": "Communication efficace avec tous les membres de l'équipe", "en-CA": "Effective communication with all team members" } },
          { id: "00SE-2.3", text: { "fr-CA": "Bonne exécution des tâches assignées", "en-CA": "Proper performance of assigned tasks" } },
          { id: "00SE-2.4", text: { "fr-CA": "Respect des règles pour un fonctionnement optimal de l'équipe", "en-CA": "Compliance with rules for optimal team function" } },
          { id: "00SE-2.5", text: { "fr-CA": "Respect de la culture d'entreprise", "en-CA": "Respect for the corporate culture" } },
          { id: "00SE-2.6", text: { "fr-CA": "Respect des normes, méthodes et meilleures pratiques en programmation applicative et en gestion de réseaux", "en-CA": "Compliance with application programming and network management standards, methods and best practices" } },
          { id: "00SE-2.7", text: { "fr-CA": "Respect des limites du champ d'intervention professionnelle et de l'expertise des membres de l'équipe dans d'autres métiers", "en-CA": "Observance of the limits of the scope of professional intervention and respect for the expertise of team members in other occupations" } },
          { id: "00SE-2.8", text: { "fr-CA": "Respect des délais", "en-CA": "Adherence to deadlines" } }
        ]
      },
      {
        id: "00SE-3",
        title: {
          "fr-CA": "Se familiariser avec les obligations légales et les règles d'éthique professionnelle",
          "en-CA": "Become familiar with the legal obligations and rules of professional ethics"
        },
        criteria: [
          { id: "00SE-3.1", text: { "fr-CA": "Inventaire précis des principales infractions et actes criminels en technologies de l'information", "en-CA": "Accurate listing of the main offences and criminal acts in information technology" } },
          { id: "00SE-3.2", text: { "fr-CA": "Inventaire précis des principales violations des droits de propriété intellectuelle en technologies de l'information", "en-CA": "Accurate listing of the main breaches of intellectual property rights in information technology" } },
          { id: "00SE-3.3", text: { "fr-CA": "Évaluation juste des conséquences des infractions, actes criminels et violations de la propriété intellectuelle", "en-CA": "Accurate assessment of the consequences of offences, criminal acts and breaches of intellectual property" } },
          { id: "00SE-3.4", text: { "fr-CA": "Détermination des mesures appropriées à la situation", "en-CA": "Determination of the measures appropriate to the situation" } },
          { id: "00SE-3.5", text: { "fr-CA": "Respect des lois, des codes d'éthique et des politiques d'entreprise", "en-CA": "Compliance with laws, codes of ethics and corporate policies" } }
        ]
      }
    ]
  },

  "00SH": {
    code: "00SH",
    title: {
      "fr-CA": "S'adapter à des technologies informatiques",
      "en-CA": "Adapt to information technologies"
    },
    elements: [
      {
        id: "00SH-1",
        title: {
          "fr-CA": "Assurer une veille technologique",
          "en-CA": "Monitor technological developments"
        },
        criteria: [
          { id: "00SH-1.1", text: { "fr-CA": "Recherche efficace de sources d'information", "en-CA": "Effective search for information sources" } },
          { id: "00SH-1.2", text: { "fr-CA": "Utilisation appropriée des outils de veille", "en-CA": "Appropriate use of monitoring tools" } },
          { id: "00SH-1.3", text: { "fr-CA": "Analyse juste des informations recueillies", "en-CA": "Accurate analysis of the information collected" } },
          { id: "00SH-1.4", text: { "fr-CA": "Identification précise des technologies à tester", "en-CA": "Accurate identification of the technologies to test" } }
        ]
      },
      {
        id: "00SH-2",
        title: {
          "fr-CA": "Tester des technologies logicielles et matérielles",
          "en-CA": "Test software and hardware technology"
        },
        criteria: [
          { id: "00SH-2.1", text: { "fr-CA": "Branchement approprié du matériel informatique et des périphériques nécessaires", "en-CA": "Proper connection of computer equipment and the necessary peripheral devices" } },
          { id: "00SH-2.2", text: { "fr-CA": "Installation correcte des applications ou outils de programmation nécessaires", "en-CA": "Proper installation of the necessary programming applications or tools" } },
          { id: "00SH-2.3", text: { "fr-CA": "Test adéquat de la technologie", "en-CA": "Adequate testing of the technology" } },
          { id: "00SH-2.4", text: { "fr-CA": "Attitudes et comportements démontrant l'autonomie et l'ouverture d'esprit", "en-CA": "Attitudes and behaviours that demonstrate self-reliance and open-mindedness" } }
        ]
      },
      {
        id: "00SH-3",
        title: {
          "fr-CA": "Rédiger des avis technologiques",
          "en-CA": "Draw up technological opinions"
        },
        criteria: [
          { id: "00SH-3.1", text: { "fr-CA": "Participation active aux discussions", "en-CA": "Active participation in discussions" } },
          { id: "00SH-3.2", text: { "fr-CA": "Justification satisfaisante du potentiel de la technologie", "en-CA": "Satisfactory justification of the technology's potential" } }
        ]
      }
    ]
  },

  // ── 00Q1 — Installation et gestion d'ordinateurs ─────────────────────────
  "00Q1": {
    code: "00Q1",
    title: {
      "fr-CA": "Effectuer l'installation et la gestion d'ordinateurs",
      "en-CA": "Install and manage computers"
    },
    elements: [
      {
        id: "00Q1-1",
        title: { "fr-CA": "Installer et configurer des postes de travail", "en-CA": "Install and configure workstations" },
        criteria: [
          { id: "00Q1-1.1", text: { "fr-CA": "Installation correcte des composants matériels et logiciels", "en-CA": "Correct installation of hardware and software components" } },
          { id: "00Q1-1.2", text: { "fr-CA": "Configuration adéquate des paramètres système", "en-CA": "Adequate configuration of system parameters" } },
          { id: "00Q1-1.3", text: { "fr-CA": "Vérification du bon fonctionnement des systèmes installés", "en-CA": "Verification of proper operation of installed systems" } }
        ]
      },
      {
        id: "00Q1-2",
        title: { "fr-CA": "Assurer la gestion et la maintenance des ordinateurs", "en-CA": "Ensure computer management and maintenance" },
        criteria: [
          { id: "00Q1-2.1", text: { "fr-CA": "Application rigoureuse des procédures de maintenance préventive", "en-CA": "Rigorous application of preventive maintenance procedures" } },
          { id: "00Q1-2.2", text: { "fr-CA": "Mise à jour régulière des systèmes d'exploitation et des logiciels", "en-CA": "Regular updating of operating systems and software" } },
          { id: "00Q1-2.3", text: { "fr-CA": "Documentation précise des interventions effectuées", "en-CA": "Accurate documentation of work performed" } }
        ]
      }
    ]
  },

  // ── 00Q2 — Langages de programmation ─────────────────────────────────────
  "00Q2": {
    code: "00Q2",
    title: {
      "fr-CA": "Utiliser des langages de programmation",
      "en-CA": "Use programming languages"
    },
    elements: [
      {
        id: "00Q2-1",
        title: { "fr-CA": "Analyser les besoins et concevoir des solutions", "en-CA": "Analyze requirements and design solutions" },
        criteria: [
          { id: "00Q2-1.1", text: { "fr-CA": "Analyse rigoureuse des besoins fonctionnels", "en-CA": "Rigorous analysis of functional requirements" } },
          { id: "00Q2-1.2", text: { "fr-CA": "Conception adéquate de l'algorithme ou de la solution", "en-CA": "Adequate design of the algorithm or solution" } }
        ]
      },
      {
        id: "00Q2-2",
        title: { "fr-CA": "Coder et tester des programmes", "en-CA": "Code and test programs" },
        criteria: [
          { id: "00Q2-2.1", text: { "fr-CA": "Application correcte des règles de codage et des bonnes pratiques", "en-CA": "Correct application of coding rules and best practices" } },
          { id: "00Q2-2.2", text: { "fr-CA": "Tests appropriés assurant la qualité du code produit", "en-CA": "Appropriate testing ensuring the quality of the produced code" } },
          { id: "00Q2-2.3", text: { "fr-CA": "Documentation claire du code", "en-CA": "Clear documentation of the code" } }
        ]
      }
    ]
  },

  // ── 00Q8 — Sécurité de l'information ─────────────────────────────────────
  "00Q8": {
    code: "00Q8",
    title: {
      "fr-CA": "Effectuer des opérations de prévention en matière de sécurité de l'information",
      "en-CA": "Carry out prevention operations with regard to information security"
    },
    elements: [
      {
        id: "00Q8-1",
        title: { "fr-CA": "Évaluer les risques liés à la sécurité de l'information", "en-CA": "Assess information security risks" },
        criteria: [
          { id: "00Q8-1.1", text: { "fr-CA": "Identification précise des vulnérabilités et des menaces", "en-CA": "Accurate identification of vulnerabilities and threats" } },
          { id: "00Q8-1.2", text: { "fr-CA": "Évaluation juste du niveau de risque pour l'organisation", "en-CA": "Accurate assessment of the level of risk to the organization" } }
        ]
      },
      {
        id: "00Q8-2",
        title: { "fr-CA": "Appliquer des mesures de prévention", "en-CA": "Apply preventive measures" },
        criteria: [
          { id: "00Q8-2.1", text: { "fr-CA": "Mise en place correcte des mesures de sécurité appropriées", "en-CA": "Correct implementation of appropriate security measures" } },
          { id: "00Q8-2.2", text: { "fr-CA": "Respect des politiques et des normes de sécurité en vigueur", "en-CA": "Compliance with applicable security policies and standards" } },
          { id: "00Q8-2.3", text: { "fr-CA": "Sensibilisation adéquate des utilisatrices et utilisateurs aux bonnes pratiques", "en-CA": "Adequate awareness of best practices among users" } }
        ]
      }
    ]
  },

  // ── 00SF — Évaluation de composants logiciels et matériels ───────────────
  "00SF": {
    code: "00SF",
    title: {
      "fr-CA": "Évaluer des composants logiciels et matériels",
      "en-CA": "Evaluate software and hardware components"
    },
    elements: [
      {
        id: "00SF-1",
        title: { "fr-CA": "Analyser les besoins en composants", "en-CA": "Analyze component requirements" },
        criteria: [
          { id: "00SF-1.1", text: { "fr-CA": "Collecte rigoureuse des besoins fonctionnels et techniques", "en-CA": "Rigorous collection of functional and technical requirements" } },
          { id: "00SF-1.2", text: { "fr-CA": "Comparaison pertinente des options disponibles", "en-CA": "Relevant comparison of available options" } }
        ]
      },
      {
        id: "00SF-2",
        title: { "fr-CA": "Formuler des recommandations", "en-CA": "Make recommendations" },
        criteria: [
          { id: "00SF-2.1", text: { "fr-CA": "Recommandation justifiée et adaptée au contexte organisationnel", "en-CA": "Justified recommendation adapted to the organizational context" } },
          { id: "00SF-2.2", text: { "fr-CA": "Communication claire des avantages et des limites des solutions proposées", "en-CA": "Clear communication of the advantages and limitations of the proposed solutions" } }
        ]
      }
    ]
  },

  // ── 00SG — Soutien informatique aux utilisateurs ─────────────────────────
  "00SG": {
    code: "00SG",
    title: {
      "fr-CA": "Fournir du soutien informatique aux utilisatrices et utilisateurs",
      "en-CA": "Provide users with technical support"
    },
    elements: [
      {
        id: "00SG-1",
        title: { "fr-CA": "Diagnostiquer les problèmes techniques", "en-CA": "Diagnose technical problems" },
        criteria: [
          { id: "00SG-1.1", text: { "fr-CA": "Collecte appropriée des informations sur le problème signalé", "en-CA": "Appropriate collection of information on the reported problem" } },
          { id: "00SG-1.2", text: { "fr-CA": "Identification correcte de la cause du problème", "en-CA": "Correct identification of the cause of the problem" } }
        ]
      },
      {
        id: "00SG-2",
        title: { "fr-CA": "Résoudre les problèmes et accompagner les utilisateurs", "en-CA": "Resolve problems and support users" },
        criteria: [
          { id: "00SG-2.1", text: { "fr-CA": "Application efficace de la solution retenue", "en-CA": "Effective application of the chosen solution" } },
          { id: "00SG-2.2", text: { "fr-CA": "Communication claire et adaptée au niveau technique de l'utilisateur", "en-CA": "Clear communication adapted to the user's technical level" } },
          { id: "00SG-2.3", text: { "fr-CA": "Vérification de la satisfaction de l'utilisateur après l'intervention", "en-CA": "Verification of user satisfaction after the intervention" } }
        ]
      }
    ]
  }

};


// ── Program list ─────────────────────────────────────────────────────────────
// Used to populate the program dropdown in the setup wizard.
// Add new programs here in alphabetical order by code.
// "Other" is appended automatically by the UI — do not add it here.
//
// Structure:
//   code:  official MEES program code
//   name:  { "fr-CA": ..., "en-CA": ... }

const PROGRAMS = [
  // ── Computer science (DEC) ────────────────────────────────────────────
  { code: "420.BP", name: { "fr-CA": "Techniques de l'informatique — Programmation",            "en-CA": "Computer Science Technology — Programming" } },
  { code: "420.BR", name: { "fr-CA": "Techniques de l'informatique — Réseaux",                  "en-CA": "Computer Science Technology — Network Management and Security" } },
  { code: "420.BX", name: { "fr-CA": "Techniques de l'informatique — Jeux vidéo",               "en-CA": "Computer Science Technology — Video Game Technology" } },
  // ── Programmer-analyst (AEC) ──────────────────────────────────────────
  { code: "LEA.3Q", name: { "fr-CA": "Programmeur-analyste en technologies de l'information",   "en-CA": "Information Technology Programmer-Analyst" } },
  { code: "LEA.99", name: { "fr-CA": "Gestion de réseaux et sécurité (AEC)",                     "en-CA": "Network Management and Security (AEC)" } },
  // ── AI & ML (AEC) ─────────────────────────────────────────────────────
  { code: "LEA.DQ", name: { "fr-CA": "Intelligence artificielle et apprentissage machine",       "en-CA": "Artificial Intelligence and Machine Learning" } },
  // ── Accounting ────────────────────────────────────────────────────────
  { code: "410.B0", name: { "fr-CA": "Techniques de comptabilité et de gestion",                 "en-CA": "Accounting and Management Technology" } },
  { code: "LCA.71", name: { "fr-CA": "Comptabilité (AEC)",                                       "en-CA": "Accounting (AEC)" } },
  // ── Business management ───────────────────────────────────────────────
  { code: "410.D0", name: { "fr-CA": "Gestion de commerces",                                     "en-CA": "Business Management" } },
  { code: "LCA.70", name: { "fr-CA": "Gestion de commerces (AEC)",                               "en-CA": "Business Management (AEC)" } },
  { code: "410.X0", name: { "fr-CA": "Gestion de commerces — Industries créatives",              "en-CA": "Business Management — Creative Industries" } },
  // ── Hospitality ───────────────────────────────────────────────────────
  { code: "430.A0", name: { "fr-CA": "Gestion d'un établissement de restauration",               "en-CA": "Food Service Management" } },
  { code: "430.B0", name: { "fr-CA": "Gestion hôtelière",                                        "en-CA": "Hotel Management" } },
  { code: "LJA.17", name: { "fr-CA": "Gestion hôtelière (AEC)",                                  "en-CA": "Hotel Management (AEC)" } },
  // ── Interior design ───────────────────────────────────────────────────
  { code: "570.E0", name: { "fr-CA": "Design d'intérieur",                                       "en-CA": "Interior Design" } },
  { code: "NTA.21", name: { "fr-CA": "Design d'intérieur (AEC)",                                 "en-CA": "Interior Design (AEC)" } },
  // ── Fashion (DEC) ─────────────────────────────────────────────────────
  { code: "571.A0", name: { "fr-CA": "Design de la mode",                                        "en-CA": "Fashion Design" } },
  { code: "571.C0", name: { "fr-CA": "Commercialisation de la mode",                             "en-CA": "Fashion Marketing" } },
  // ── Fashion (AEC) ─────────────────────────────────────────────────────
  { code: "NTC.0Q", name: { "fr-CA": "Design de la mode (AEC)",                                  "en-CA": "Fashion Design (AEC)" } },
  { code: "NTC.1W", name: { "fr-CA": "Commercialisation de la mode (AEC)",                       "en-CA": "Fashion Marketing (AEC)" } },
  // ── Logistics ─────────────────────────────────────────────────────────
  { code: "410.G0", name: { "fr-CA": "Techniques de la logistique du transport (DEC)",           "en-CA": "Transportation Logistics Technology (DEC)" } },
  { code: "LCA.5G", name: { "fr-CA": "Techniques de la logistique du transport (AEC)",           "en-CA": "Transportation Logistics Technology (AEC)" } },
  // ── Social media strategy (AEC) ───────────────────────────────────────
  { code: "NWY.1X", name: { "fr-CA": "Stratégie sur les réseaux sociaux (AEC)",             "en-CA": "Social Media Strategy (AEC)" } },
];


// ── Course list ──────────────────────────────────────────────────────────────
// Keys are official course numbers.
// "generic" is the fallback for "Autre / Other".
//
// Structure per course:
//   title:        { "fr-CA": ..., "en-CA": ... }
//   programs:     string[]  — program codes this course applies to
//   hours:        number    — corporate internship hours (not total course hours)
//   competencies: array     — see SHARED_COMPETENCIES for reusable definitions

const COURSES = {

  // ── 420.BR — Network Management and Security ───────────────────────────────
  "420-SG6-AS": {
    title: {
      "fr-CA": "Intégration en entreprise : Gestion de réseaux et sécurité",
      "en-CA": "Workplace Integration: Network Management and Security"
    },
    programs: ["420.BR", "LEA.99"],
    hours: 240,
    competencies: [
      { ...SHARED_COMPETENCIES["00SE"] },
      { ...SHARED_COMPETENCIES["00SH"] }
    ]
  },

  // ── 420.BX — Video Game Technology ────────────────────────────────────────
  // Source: FR course outline only. EN titles translated.
  "420-JST-AS": {
    title: {
      "fr-CA": "Intégration en entreprise : Programmation en jeux vidéo",
      "en-CA": "Workplace Integration: Video Game Programming"
    },
    programs: ["420.BX"],
    hours: 480,
    competencies: [
      // TODO: Add competencies 0000, 00Q1(1-4), 00Q2(1-4), 00Q4(1-5),
      //       00Q5(1-5), 00Q6(1-7), 00Q7(1-5), 00Q8(1-3), 00SF(1-3)
      //       once FR course outline criteria text is available.
      { ...SHARED_COMPETENCIES["00SE"] },
      { ...SHARED_COMPETENCIES["00SH"] }
    ]
  },

  // ── 420.BP — Programming ──────────────────────────────────────────────────
  // Source: FR+EN course outlines received.
  "420-EP6-AS": {
    title: {
      "fr-CA": "Intégration en entreprise : Programmation",
      "en-CA": "Workplace Integration: Programming"
    },
    programs: ["420.BP"],
    hours: 240,
    competencies: [
      // TODO: Add competencies 00Q1(3-4), 00Q2(3-4), 00Q8(1,3), 00SF(2-3), 00SG(3-4)
      //       once criteria text is confirmed from course outline.
      { ...SHARED_COMPETENCIES["00SE"] },
      { ...SHARED_COMPETENCIES["00SH"] }
    ]
  },

  // ── LEA.DQ — AI & ML ──────────────────────────────────────────────────────
  // Source: EN v1.10 (2025). FR titles translated.
  "420-A24-AS": {
    title: {
      "fr-CA": "Stage en intelligence artificielle et apprentissage machine",
      "en-CA": "Internship in Artificial Intelligence and Machine Learning"
    },
    programs: ["LEA.DQ"],
    hours: 330,
    competencies: [
      {
        code: "KP46",
        title: {
          "fr-CA": "Analyser des données",
          "en-CA": "Analyze data"
        },
        elements: [
          {
            id: "KP46-1",
            title: { "fr-CA": "Préparer les données", "en-CA": "Prepare data" },
            criteria: [
              { id: "KP46-1.1", text: { "fr-CA": "Collecte appropriée des données pertinentes", "en-CA": "Appropriate collection of relevant data" } },
              { id: "KP46-1.2", text: { "fr-CA": "Nettoyage et prétraitement corrects des données", "en-CA": "Correct cleaning and preprocessing of data" } },
              { id: "KP46-1.3", text: { "fr-CA": "Transformation adéquate des données pour l'analyse", "en-CA": "Adequate transformation of data for analysis" } }
            ]
          },
          {
            id: "KP46-2",
            title: { "fr-CA": "Analyser les données", "en-CA": "Analyze data" },
            criteria: [
              { id: "KP46-2.1", text: { "fr-CA": "Application correcte des méthodes d'analyse statistique", "en-CA": "Correct application of statistical analysis methods" } },
              { id: "KP46-2.2", text: { "fr-CA": "Interprétation juste des résultats d'analyse", "en-CA": "Accurate interpretation of analysis results" } },
              { id: "KP46-2.3", text: { "fr-CA": "Documentation claire des conclusions", "en-CA": "Clear documentation of findings" } }
            ]
          }
        ]
      },
      {
        code: "KP49",
        title: {
          "fr-CA": "Concevoir des modèles d'apprentissage automatique",
          "en-CA": "Design machine learning models"
        },
        elements: [
          {
            id: "KP49-1",
            title: { "fr-CA": "Sélectionner les algorithmes appropriés", "en-CA": "Select appropriate algorithms" },
            criteria: [
              { id: "KP49-1.1", text: { "fr-CA": "Évaluation juste des besoins du problème", "en-CA": "Accurate assessment of problem requirements" } },
              { id: "KP49-1.2", text: { "fr-CA": "Sélection justifiée des algorithmes d'apprentissage automatique", "en-CA": "Justified selection of machine learning algorithms" } }
            ]
          },
          {
            id: "KP49-2",
            title: { "fr-CA": "Entraîner et évaluer les modèles", "en-CA": "Train and evaluate models" },
            criteria: [
              { id: "KP49-2.1", text: { "fr-CA": "Configuration correcte des paramètres d'entraînement", "en-CA": "Correct configuration of training parameters" } },
              { id: "KP49-2.2", text: { "fr-CA": "Évaluation rigoureuse des performances du modèle", "en-CA": "Rigorous evaluation of model performance" } },
              { id: "KP49-2.3", text: { "fr-CA": "Ajustements appropriés pour améliorer les performances", "en-CA": "Appropriate adjustments to improve performance" } }
            ]
          }
        ]
      },
      {
        code: "KP50",
        title: {
          "fr-CA": "Déployer des solutions d'intelligence artificielle",
          "en-CA": "Deploy artificial intelligence solutions"
        },
        elements: [
          {
            id: "KP50-1",
            title: { "fr-CA": "Préparer le déploiement", "en-CA": "Prepare deployment" },
            criteria: [
              { id: "KP50-1.1", text: { "fr-CA": "Préparation adéquate de l'environnement de déploiement", "en-CA": "Adequate preparation of deployment environment" } },
              { id: "KP50-1.2", text: { "fr-CA": "Documentation complète de la solution", "en-CA": "Complete documentation of the solution" } }
            ]
          },
          {
            id: "KP50-2",
            title: { "fr-CA": "Déployer et surveiller la solution", "en-CA": "Deploy and monitor the solution" },
            criteria: [
              { id: "KP50-2.1", text: { "fr-CA": "Déploiement correct de la solution en production", "en-CA": "Correct deployment of solution to production" } },
              { id: "KP50-2.2", text: { "fr-CA": "Mise en place efficace du suivi des performances", "en-CA": "Effective performance monitoring setup" } },
              { id: "KP50-2.3", text: { "fr-CA": "Réponse appropriée aux incidents de production", "en-CA": "Appropriate response to production incidents" } }
            ]
          }
        ]
      },
      {
        code: "KP57",
        title: {
          "fr-CA": "Assurer la qualité des solutions d'IA",
          "en-CA": "Ensure quality of AI solutions"
        },
        elements: [
          {
            id: "KP57-1",
            title: { "fr-CA": "Tester les solutions", "en-CA": "Test solutions" },
            criteria: [
              { id: "KP57-1.1", text: { "fr-CA": "Conception adéquate des plans de test", "en-CA": "Adequate design of test plans" } },
              { id: "KP57-1.2", text: { "fr-CA": "Exécution rigoureuse des tests", "en-CA": "Rigorous execution of tests" } },
              { id: "KP57-1.3", text: { "fr-CA": "Documentation précise des résultats de test", "en-CA": "Accurate documentation of test results" } }
            ]
          }
        ]
      },
      {
        code: "KP58",
        title: {
          "fr-CA": "Gérer des projets en intelligence artificielle",
          "en-CA": "Manage artificial intelligence projects"
        },
        elements: [
          {
            id: "KP58-1",
            title: { "fr-CA": "Planifier le projet", "en-CA": "Plan the project" },
            criteria: [
              { id: "KP58-1.1", text: { "fr-CA": "Définition claire des objectifs et livrables", "en-CA": "Clear definition of objectives and deliverables" } },
              { id: "KP58-1.2", text: { "fr-CA": "Planification réaliste des ressources et des échéanciers", "en-CA": "Realistic planning of resources and timelines" } }
            ]
          },
          {
            id: "KP58-2",
            title: { "fr-CA": "Suivre et contrôler le projet", "en-CA": "Monitor and control the project" },
            criteria: [
              { id: "KP58-2.1", text: { "fr-CA": "Suivi régulier de l'avancement du projet", "en-CA": "Regular monitoring of project progress" } },
              { id: "KP58-2.2", text: { "fr-CA": "Gestion efficace des risques et des imprévus", "en-CA": "Effective management of risks and unexpected events" } }
            ]
          }
        ]
      },
      {
        code: "KP60",
        title: {
          "fr-CA": "Communiquer sur les solutions d'IA",
          "en-CA": "Communicate about AI solutions"
        },
        elements: [
          {
            id: "KP60-1",
            title: { "fr-CA": "Rédiger de la documentation technique", "en-CA": "Write technical documentation" },
            criteria: [
              { id: "KP60-1.1", text: { "fr-CA": "Clarté et précision de la documentation technique", "en-CA": "Clarity and accuracy of technical documentation" } },
              { id: "KP60-1.2", text: { "fr-CA": "Adaptation du niveau de détail au public cible", "en-CA": "Appropriate level of detail for target audience" } }
            ]
          },
          {
            id: "KP60-2",
            title: { "fr-CA": "Présenter les solutions", "en-CA": "Present solutions" },
            criteria: [
              { id: "KP60-2.1", text: { "fr-CA": "Présentation claire et structurée des résultats", "en-CA": "Clear and structured presentation of results" } },
              { id: "KP60-2.2", text: { "fr-CA": "Réponses pertinentes aux questions des parties prenantes", "en-CA": "Relevant responses to stakeholder questions" } }
            ]
          }
        ]
      },
      {
        code: "KP61",
        title: {
          "fr-CA": "Respecter les considérations éthiques en IA",
          "en-CA": "Respect ethical considerations in AI"
        },
        elements: [
          {
            id: "KP61-1",
            title: { "fr-CA": "Identifier les enjeux éthiques", "en-CA": "Identify ethical issues" },
            criteria: [
              { id: "KP61-1.1", text: { "fr-CA": "Identification précise des biais potentiels dans les données et modèles", "en-CA": "Accurate identification of potential biases in data and models" } },
              { id: "KP61-1.2", text: { "fr-CA": "Évaluation des impacts sociaux et éthiques de la solution", "en-CA": "Assessment of social and ethical impacts of the solution" } }
            ]
          },
          {
            id: "KP61-2",
            title: { "fr-CA": "Appliquer des pratiques éthiques", "en-CA": "Apply ethical practices" },
            criteria: [
              { id: "KP61-2.1", text: { "fr-CA": "Intégration des principes d'équité et de transparence dans les solutions", "en-CA": "Integration of fairness and transparency principles in solutions" } },
              { id: "KP61-2.2", text: { "fr-CA": "Respect des cadres réglementaires applicables", "en-CA": "Compliance with applicable regulatory frameworks" } }
            ]
          }
        ]
      }
    ]
  },

  // ── 410.B0 / LCA.71 — Accounting ──────────────────────────────────────────
  // Source: FR+EN course outlines. EN used as authoritative (FR had copy-paste errors).
  "410-BU7-AS": {
    title: {
      "fr-CA": "Stage en comptabilité",
      "en-CA": "Internship in Accounting"
    },
    programs: ["410.B0", "LCA.71"],
    hours: 90,
    competencies: [
      {
        code: "01HY",
        title: {
          "fr-CA": "Assurer son intégration au marché du travail",
          "en-CA": "Participate in integration into the job market"
        },
        elements: [
          {
            id: "01HY-1",
            title: { "fr-CA": "Analyser le marché du travail", "en-CA": "Analyze the job market" },
            criteria: [
              { id: "01HY-1.1", text: { "fr-CA": "Identification juste des secteurs d'activité liés à la comptabilité", "en-CA": "Accurate identification of accounting-related sectors" } },
              { id: "01HY-1.2", text: { "fr-CA": "Analyse pertinente des tendances du marché de l'emploi", "en-CA": "Relevant analysis of employment market trends" } }
            ]
          },
          {
            id: "01HY-2",
            title: { "fr-CA": "Préparer sa recherche d'emploi", "en-CA": "Prepare for job search" },
            criteria: [
              { id: "01HY-2.1", text: { "fr-CA": "Rédaction soignée du curriculum vitae", "en-CA": "Careful preparation of the curriculum vitae" } },
              { id: "01HY-2.2", text: { "fr-CA": "Rédaction appropriée de la lettre de présentation", "en-CA": "Appropriate writing of the cover letter" } }
            ]
          },
          {
            id: "01HY-3",
            title: { "fr-CA": "Se préparer à l'entrevue", "en-CA": "Prepare for the interview" },
            criteria: [
              { id: "01HY-3.1", text: { "fr-CA": "Préparation adéquate aux questions d'entrevue courantes", "en-CA": "Adequate preparation for common interview questions" } },
              { id: "01HY-3.2", text: { "fr-CA": "Présentation personnelle appropriée au contexte professionnel", "en-CA": "Personal presentation appropriate to a professional context" } }
            ]
          },
          {
            id: "01HY-4",
            title: { "fr-CA": "S'intégrer en milieu de travail", "en-CA": "Integrate into the workplace" },
            criteria: [
              { id: "01HY-4.1", text: { "fr-CA": "Adaptation rapide aux normes et à la culture de l'entreprise", "en-CA": "Quick adaptation to company norms and culture" } },
              { id: "01HY-4.2", text: { "fr-CA": "Établissement de relations professionnelles positives", "en-CA": "Establishment of positive professional relationships" } }
            ]
          },
          {
            id: "01HY-5",
            title: { "fr-CA": "Évaluer son intégration", "en-CA": "Evaluate integration" },
            criteria: [
              { id: "01HY-5.1", text: { "fr-CA": "Autoévaluation honnête de sa performance en stage", "en-CA": "Honest self-assessment of internship performance" } },
              { id: "01HY-5.2", text: { "fr-CA": "Identification pertinente des axes d'amélioration", "en-CA": "Relevant identification of areas for improvement" } }
            ]
          }
        ]
      }
    ]
  },

  // ── 410.D0 / LCA.70 — Business Management ─────────────────────────────────
  // Source: Official course outline (confirmed at programme office).
  // Competency 01UG, 120h in-company (pondération 1-7-3).
  "410-DZ4-AS": {
    title: {
      "fr-CA": "Stage en gestion commerciale",
      "en-CA": "Internship in Commercial Management"
    },
    programs: ["410.D0", "LCA.70", "410.X0"],
    hours: 120,
    competencies: [
      {
        code: "01UG",
        title: {
          "fr-CA": "Assurer son intégration au marché de travail",
          "en-CA": "Participate in integration into the job market"
        },
        elements: [
          {
            id: "01UG-1",
            title: { "fr-CA": "S'intégrer en milieu de travail", "en-CA": "Integrate into the workplace" },
            criteria: [
              { id: "01UG-1.1", text: { "fr-CA": "Respect des politiques, règlements et procédures de l'entreprise", "en-CA": "Compliance with company policies, rules and procedures" } },
              { id: "01UG-1.2", text: { "fr-CA": "Adaptation rapide à la culture organisationnelle", "en-CA": "Rapid adaptation to the organizational culture" } },
              { id: "01UG-1.3", text: { "fr-CA": "Établissement de relations professionnelles constructives", "en-CA": "Establishment of constructive professional relationships" } }
            ]
          },
          {
            id: "01UG-2",
            title: { "fr-CA": "Exercer les activités liées au poste", "en-CA": "Carry out position-related activities" },
            criteria: [
              { id: "01UG-2.1", text: { "fr-CA": "Exécution adéquate des tâches confiées selon les standards de qualité attendus", "en-CA": "Adequate completion of assigned tasks according to expected quality standards" } },
              { id: "01UG-2.2", text: { "fr-CA": "Gestion efficace des priorités et du temps de travail", "en-CA": "Effective management of priorities and working time" } },
              { id: "01UG-2.3", text: { "fr-CA": "Résolution autonome des problèmes courants liés au poste", "en-CA": "Autonomous resolution of common position-related problems" } },
              { id: "01UG-2.4", text: { "fr-CA": "Prise d'initiative appropriée dans l'exercice des fonctions", "en-CA": "Appropriate initiative in carrying out duties" } }
            ]
          },
          {
            id: "01UG-3",
            title: { "fr-CA": "Analyser son expérience de travail", "en-CA": "Analyze the work experience" },
            criteria: [
              { id: "01UG-3.1", text: { "fr-CA": "Identification des compétences développées et des lacunes à combler", "en-CA": "Identification of developed competencies and gaps to address" } },
              { id: "01UG-3.2", text: { "fr-CA": "Évaluation honnête de sa contribution à l'organisation", "en-CA": "Honest assessment of contribution to the organization" } },
              { id: "01UG-3.3", text: { "fr-CA": "Formulation d'objectifs de développement professionnel pertinents", "en-CA": "Formulation of relevant professional development objectives" } }
            ]
          }
        ]
      }
    ]
  },

  // ── 430.A0  // ── 430.A0 — Food Service Management ──────────────────────────────────────
  // ── 430.B0 — Hotel Management ─────────────────────────────────────────────
  // Source: FR v1.10 (2024) + EN v1.9 (2018). One course, two programs,
  // each with its own competency. Students see only the one matching their program.
  "430-HRS-AS": {
    title: {
      "fr-CA": "Stage",
      "en-CA": "Internship"
    },
    programs: ["430.A0", "430.B0", "LJA.17"],
    hours: 240,
    competencies: [
      {
        code: "047Y",
        // Only shown to students in program 430.A0
        programs: ["430.A0"],
        title: {
          "fr-CA": "Assurer l'interface entre les activités des départements",
          "en-CA": "Act as an interface between departments"
        },
        elements: [
          {
            id: "047Y-1",
            title: { "fr-CA": "Participer à des réunions de gestion", "en-CA": "Participate in management meetings" },
            criteria: [
              { id: "047Y-1.1", text: { "fr-CA": "Préparation appropriée en fonction de l'ordre du jour", "en-CA": "Appropriate preparation based on the agenda" } },
              { id: "047Y-1.2", text: { "fr-CA": "Participation active aux discussions", "en-CA": "Active participation in discussions" } },
              { id: "047Y-1.3", text: { "fr-CA": "Prise de notes rigoureuse", "en-CA": "Rigorous note-taking" } },
              { id: "047Y-1.4", text: { "fr-CA": "Suivi approprié des décisions prises", "en-CA": "Appropriate follow-up on decisions made" } }
            ]
          },
          {
            id: "047Y-2",
            title: { "fr-CA": "Coordonner les activités interdépartementales", "en-CA": "Coordinate interdepartmental activities" },
            criteria: [
              { id: "047Y-2.1", text: { "fr-CA": "Communication claire des besoins entre les départements", "en-CA": "Clear communication of needs between departments" } },
              { id: "047Y-2.2", text: { "fr-CA": "Résolution efficace des conflits opérationnels", "en-CA": "Effective resolution of operational conflicts" } },
              { id: "047Y-2.3", text: { "fr-CA": "Respect des procédures établies", "en-CA": "Compliance with established procedures" } }
            ]
          },
          {
            id: "047Y-3",
            title: { "fr-CA": "Assurer le suivi des opérations", "en-CA": "Follow up on operations" },
            criteria: [
              { id: "047Y-3.1", text: { "fr-CA": "Vérification régulière de l'avancement des opérations", "en-CA": "Regular verification of operations progress" } },
              { id: "047Y-3.2", text: { "fr-CA": "Identification rapide des écarts par rapport aux standards", "en-CA": "Quick identification of deviations from standards" } },
              { id: "047Y-3.3", text: { "fr-CA": "Mise en place de mesures correctives appropriées", "en-CA": "Implementation of appropriate corrective measures" } }
            ]
          }
        ]
      },
      {
        code: "048P",
        // Only shown to students in program 430.B0
        programs: ["430.B0"],
        title: {
          "fr-CA": "Gérer les opérations d'un département",
          "en-CA": "Manage departmental operations"
        },
        elements: [
          {
            id: "048P-1",
            title: { "fr-CA": "Planifier les opérations du département", "en-CA": "Plan departmental operations" },
            criteria: [
              { id: "048P-1.1", text: { "fr-CA": "Planification adéquate des ressources humaines et matérielles", "en-CA": "Adequate planning of human and material resources" } },
              { id: "048P-1.2", text: { "fr-CA": "Respect des contraintes budgétaires", "en-CA": "Compliance with budget constraints" } },
              { id: "048P-1.3", text: { "fr-CA": "Établissement d'un calendrier opérationnel réaliste", "en-CA": "Establishment of a realistic operational schedule" } }
            ]
          },
          {
            id: "048P-2",
            title: { "fr-CA": "Superviser le personnel", "en-CA": "Supervise staff" },
            criteria: [
              { id: "048P-2.1", text: { "fr-CA": "Attribution claire des tâches au personnel", "en-CA": "Clear assignment of tasks to staff" } },
              { id: "048P-2.2", text: { "fr-CA": "Suivi régulier du rendement des employés", "en-CA": "Regular monitoring of employee performance" } },
              { id: "048P-2.3", text: { "fr-CA": "Rétroaction constructive et opportune", "en-CA": "Constructive and timely feedback" } }
            ]
          },
          {
            id: "048P-3",
            title: { "fr-CA": "Contrôler la qualité des services", "en-CA": "Control service quality" },
            criteria: [
              { id: "048P-3.1", text: { "fr-CA": "Vérification systématique du respect des standards de qualité", "en-CA": "Systematic verification of quality standard compliance" } },
              { id: "048P-3.2", text: { "fr-CA": "Traitement professionnel des plaintes clients", "en-CA": "Professional handling of customer complaints" } },
              { id: "048P-3.3", text: { "fr-CA": "Mise en œuvre de mesures d'amélioration continue", "en-CA": "Implementation of continuous improvement measures" } }
            ]
          }
        ]
      }
    ]
  },

  // ── 570.E0 / NTA.21 — Interior Design ────────────────────────────────────
  // Source: FR course outline only. EN titles translated.
  "570-ST1-AS": {
    title: {
      "fr-CA": "Stage en design d'intérieur",
      "en-CA": "Internship in Interior Design"
    },
    programs: ["570.E0", "NTA.21"],
    hours: 60,
    competencies: [
      {
        code: "022A",
        title: {
          "fr-CA": "Analyser la fonction des composantes d'un espace",
          "en-CA": "Analyze the function of space components"
        },
        elements: [
          {
            id: "022A-1",
            title: { "fr-CA": "Analyser les besoins du client", "en-CA": "Analyze client needs" },
            criteria: [
              { id: "022A-1.1", text: { "fr-CA": "Collecte complète des informations sur les besoins fonctionnels", "en-CA": "Complete collection of information on functional needs" } },
              { id: "022A-1.2", text: { "fr-CA": "Analyse juste des contraintes spatiales", "en-CA": "Accurate analysis of spatial constraints" } }
            ]
          },
          {
            id: "022A-2",
            title: { "fr-CA": "Évaluer l'espace existant", "en-CA": "Evaluate the existing space" },
            criteria: [
              { id: "022A-2.1", text: { "fr-CA": "Relevé précis des dimensions et caractéristiques de l'espace", "en-CA": "Accurate survey of space dimensions and characteristics" } },
              { id: "022A-2.2", text: { "fr-CA": "Identification pertinente des contraintes architecturales", "en-CA": "Relevant identification of architectural constraints" } }
            ]
          },
          {
            id: "022A-3",
            title: { "fr-CA": "Documenter l'analyse", "en-CA": "Document the analysis" },
            criteria: [
              { id: "022A-3.1", text: { "fr-CA": "Rédaction claire du rapport d'analyse", "en-CA": "Clear writing of the analysis report" } },
              { id: "022A-3.2", text: { "fr-CA": "Présentation structurée des conclusions", "en-CA": "Structured presentation of findings" } }
            ]
          }
        ]
      },
      {
        code: "022G",
        title: {
          "fr-CA": "Concevoir un aménagement intérieur",
          "en-CA": "Design an interior layout"
        },
        elements: [
          {
            id: "022G-1",
            title: { "fr-CA": "Élaborer des concepts de design", "en-CA": "Develop design concepts" },
            criteria: [
              { id: "022G-1.1", text: { "fr-CA": "Cohérence du concept avec les besoins identifiés", "en-CA": "Consistency of concept with identified needs" } },
              { id: "022G-1.2", text: { "fr-CA": "Originalité et pertinence des solutions proposées", "en-CA": "Originality and relevance of proposed solutions" } }
            ]
          },
          {
            id: "022G-2",
            title: { "fr-CA": "Produire les documents de conception", "en-CA": "Produce design documents" },
            criteria: [
              { id: "022G-2.1", text: { "fr-CA": "Précision technique des plans et dessins", "en-CA": "Technical accuracy of plans and drawings" } },
              { id: "022G-2.2", text: { "fr-CA": "Respect des normes de représentation graphique", "en-CA": "Compliance with graphic representation standards" } }
            ]
          },
          {
            id: "022G-3",
            title: { "fr-CA": "Présenter le projet au client", "en-CA": "Present the project to the client" },
            criteria: [
              { id: "022G-3.1", text: { "fr-CA": "Clarté de la présentation du concept", "en-CA": "Clarity of concept presentation" } },
              { id: "022G-3.2", text: { "fr-CA": "Justification convaincante des choix de design", "en-CA": "Convincing justification of design choices" } }
            ]
          }
        ]
      }
    ]
  },

  // ── LCA.5G — Transportation Logistics ─────────────────────────────────────
  // Source: FR course outline only. EN titles translated.
  "410-L15-AS": {
    title: {
      "fr-CA": "Stage en logistique du transport",
      "en-CA": "Internship in Transportation Logistics"
    },
    programs: ["LCA.5G", "410.G0"],
    hours: 120,
    competencies: [
      {
        code: "00N2",
        title: {
          "fr-CA": "Établir des relations professionnelles",
          "en-CA": "Establish professional relationships"
        },
        elements: [
          {
            id: "00N2-1",
            title: { "fr-CA": "Communiquer en milieu de travail", "en-CA": "Communicate in the workplace" },
            criteria: [
              { id: "00N2-1.1", text: { "fr-CA": "Utilisation appropriée des modes de communication professionnelle", "en-CA": "Appropriate use of professional communication modes" } },
              { id: "00N2-1.2", text: { "fr-CA": "Clarté et précision des messages transmis", "en-CA": "Clarity and accuracy of transmitted messages" } },
              { id: "00N2-1.3", text: { "fr-CA": "Écoute active et reformulation efficace", "en-CA": "Active listening and effective reformulation" } }
            ]
          },
          {
            id: "00N2-2",
            title: { "fr-CA": "Travailler en équipe", "en-CA": "Work as part of a team" },
            criteria: [
              { id: "00N2-2.1", text: { "fr-CA": "Contribution active au travail d'équipe", "en-CA": "Active contribution to team work" } },
              { id: "00N2-2.2", text: { "fr-CA": "Respect des rôles et responsabilités de chacun", "en-CA": "Respect for each person's roles and responsibilities" } },
              { id: "00N2-2.3", text: { "fr-CA": "Gestion constructive des désaccords", "en-CA": "Constructive management of disagreements" } }
            ]
          },
          {
            id: "00N2-3",
            title: { "fr-CA": "Développer son réseau professionnel", "en-CA": "Develop professional network" },
            criteria: [
              { id: "00N2-3.1", text: { "fr-CA": "Identification des contacts professionnels pertinents", "en-CA": "Identification of relevant professional contacts" } },
              { id: "00N2-3.2", text: { "fr-CA": "Entretien proactif des relations professionnelles", "en-CA": "Proactive maintenance of professional relationships" } }
            ]
          }
        ]
      }
    ]
  },

  // ── NWY.1X — Stratégie sur les réseaux sociaux ───────────────────────────
  // Source: course outline verified Apr 2026.
  // Competencies: KR41, KR46, KR49, KR48 (in outline order).
  "589-N19-AS": {
    title: {
      "fr-CA": "Stage",
      "en-CA": "Internship"
    },
    programs: ["NWY.1X"],
    hours: 390,
    competencies: [
      {
        code: "KR41",
        title: {
          "fr-CA": "Concevoir et publier du contenu",
          "en-CA": "Design and publish content"
        },
        elements: [
          {
            id: "KR41-1",
            title: { "fr-CA": "Effectuer une veille des médias numériques", "en-CA": "Monitor digital media" },
            criteria: [
              { id: "KR41-1.1", text: { "fr-CA": "Identification pertinente des plateformes et tendances émergentes", "en-CA": "Relevant identification of emerging platforms and trends" } },
              { id: "KR41-1.2", text: { "fr-CA": "Analyse rigoureuse des données d'audience", "en-CA": "Rigorous analysis of audience data" } }
            ]
          },
          {
            id: "KR41-2",
            title: { "fr-CA": "Produire des rapports d'analyse", "en-CA": "Produce analysis reports" },
            criteria: [
              { id: "KR41-2.1", text: { "fr-CA": "Présentation claire et structurée des résultats", "en-CA": "Clear and structured presentation of results" } },
              { id: "KR41-2.2", text: { "fr-CA": "Formulation de recommandations stratégiques pertinentes", "en-CA": "Formulation of relevant strategic recommendations" } }
            ]
          }
        ]
      },
      {
        code: "KR46",
        title: {
          "fr-CA": "Gérer un projet en communication Web",
          "en-CA": "Manage a Web communication project"
        },
        elements: [
          {
            id: "KR46-1",
            title: { "fr-CA": "Définir la stratégie de contenu", "en-CA": "Define the content strategy" },
            criteria: [
              { id: "KR46-1.1", text: { "fr-CA": "Définition précise des objectifs de communication", "en-CA": "Precise definition of communication objectives" } },
              { id: "KR46-1.2", text: { "fr-CA": "Identification juste des publics cibles et de leurs besoins", "en-CA": "Accurate identification of target audiences and their needs" } }
            ]
          },
          {
            id: "KR46-3",
            title: { "fr-CA": "Évaluer les résultats de la stratégie", "en-CA": "Evaluate strategy results" },
            criteria: [
              { id: "KR46-3.1", text: { "fr-CA": "Mesure rigoureuse de la performance du contenu", "en-CA": "Rigorous measurement of content performance" } },
              { id: "KR46-3.2", text: { "fr-CA": "Ajustements appropriés basés sur les données", "en-CA": "Appropriate data-driven adjustments" } }
            ]
          }
        ]
      },
      {
        code: "KR49",
        title: {
          "fr-CA": "Analyser les indicateurs de performance",
          "en-CA": "Analyze performance indicators"
        },
        elements: [
          {
            id: "KR49-2",
            title: { "fr-CA": "Créer du contenu multimédia", "en-CA": "Create multimedia content" },
            criteria: [
              { id: "KR49-2.1", text: { "fr-CA": "Qualité technique satisfaisante des productions", "en-CA": "Satisfactory technical quality of productions" } },
              { id: "KR49-2.2", text: { "fr-CA": "Cohérence avec l'identité visuelle de la marque", "en-CA": "Consistency with brand visual identity" } }
            ]
          },
          {
            id: "KR49-3",
            title: { "fr-CA": "Optimiser le contenu pour les plateformes", "en-CA": "Optimize content for platforms" },
            criteria: [
              { id: "KR49-3.1", text: { "fr-CA": "Adaptation correcte des formats selon la plateforme", "en-CA": "Correct format adaptation by platform" } },
              { id: "KR49-3.2", text: { "fr-CA": "Application des meilleures pratiques SEO et de référencement", "en-CA": "Application of SEO and referencing best practices" } }
            ]
          },
          {
            id: "KR49-6",
            title: { "fr-CA": "Évaluer la performance du contenu", "en-CA": "Evaluate content performance" },
            criteria: [
              { id: "KR49-6.1", text: { "fr-CA": "Suivi régulier des indicateurs de performance clés", "en-CA": "Regular monitoring of key performance indicators" } },
              { id: "KR49-6.2", text: { "fr-CA": "Utilisation des données pour optimiser les stratégies futures", "en-CA": "Use of data to optimize future strategies" } }
            ]
          }
        ]
      },
      {
        code: "KR48",
        title: {
          "fr-CA": "Entretenir des liens avec la communauté",
          "en-CA": "Maintain community relationships"
        },
        elements: [
          {
            id: "KR48-1",
            title: { "fr-CA": "Animer la communauté", "en-CA": "Engage the community" },
            criteria: [
              { id: "KR48-1.1", text: { "fr-CA": "Création de contenu engageant et adapté à la communauté", "en-CA": "Creation of engaging content adapted to the community" } },
              { id: "KR48-1.2", text: { "fr-CA": "Interaction professionnelle et bienveillante avec les membres", "en-CA": "Professional and supportive interaction with members" } }
            ]
          },
          {
            id: "KR48-2",
            title: { "fr-CA": "Gérer les situations difficiles", "en-CA": "Manage difficult situations" },
            criteria: [
              { id: "KR48-2.1", text: { "fr-CA": "Gestion calme et professionnelle des commentaires négatifs", "en-CA": "Calm and professional handling of negative comments" } },
              { id: "KR48-2.2", text: { "fr-CA": "Application des politiques de modération de façon cohérente", "en-CA": "Consistent application of moderation policies" } }
            ]
          }
        ]
      }
    ]
  },

  // ── Generic fallback (Autre / Other) ──────────────────────────────────────
  // Used when student's program is not in the list, or student selects "Other".
  // Competencies are real ministerial codes that are cross-cutting and
  // program-neutral. Drawn from competencies shared across multiple programs.
  "generic": {
    title: {
      "fr-CA": "Générique (Autre programme)",
      "en-CA": "Generic (Other program)"
    },
    programs: [],   // intentionally empty — matched only via "Other" selection
    hours: null,
    competencies: [
      {
        // 00SE elements 1–3: professional interaction (from IT courses)
        ...SHARED_COMPETENCIES["00SE"]
      },
      {
        // 00SH elements 1–3: adapt to technology (from IT courses)
        // Kept for generic use as "adapt to new tools/context" — reasonable
        // for any tech-adjacent internship.
        ...SHARED_COMPETENCIES["00SH"]
      },
      {
        // 00N2 elements 1–3: professional relationships (from logistics)
        code: "00N2",
        title: {
          "fr-CA": "Établir des relations professionnelles",
          "en-CA": "Establish professional relationships"
        },
        elements: [
          {
            id: "00N2-1",
            title: { "fr-CA": "Communiquer en milieu de travail", "en-CA": "Communicate in the workplace" },
            criteria: [
              { id: "00N2-1.1", text: { "fr-CA": "Utilisation appropriée des modes de communication professionnelle", "en-CA": "Appropriate use of professional communication modes" } },
              { id: "00N2-1.2", text: { "fr-CA": "Clarté et précision des messages transmis", "en-CA": "Clarity and accuracy of transmitted messages" } },
              { id: "00N2-1.3", text: { "fr-CA": "Écoute active et reformulation efficace", "en-CA": "Active listening and effective reformulation" } }
            ]
          },
          {
            id: "00N2-2",
            title: { "fr-CA": "Travailler en équipe", "en-CA": "Work as part of a team" },
            criteria: [
              { id: "00N2-2.1", text: { "fr-CA": "Contribution active au travail d'équipe", "en-CA": "Active contribution to team work" } },
              { id: "00N2-2.2", text: { "fr-CA": "Respect des rôles et responsabilités de chacun", "en-CA": "Respect for each person's roles and responsibilities" } },
              { id: "00N2-2.3", text: { "fr-CA": "Gestion constructive des désaccords", "en-CA": "Constructive management of disagreements" } }
            ]
          },
          {
            id: "00N2-3",
            title: { "fr-CA": "Développer son réseau professionnel", "en-CA": "Develop professional network" },
            criteria: [
              { id: "00N2-3.1", text: { "fr-CA": "Identification des contacts professionnels pertinents", "en-CA": "Identification of relevant professional contacts" } },
              { id: "00N2-3.2", text: { "fr-CA": "Entretien proactif des relations professionnelles", "en-CA": "Proactive maintenance of professional relationships" } }
            ]
          }
        ]
      },
      {
        // 01HY elements 1, 3, 5: job market integration (from accounting)
        // Career-facing elements only; excludes criteria-corrupted FR elements.
        code: "01HY",
        title: {
          "fr-CA": "Assurer son intégration au marché du travail",
          "en-CA": "Participate in integration into the job market"
        },
        elements: [
          {
            id: "01HY-1",
            title: { "fr-CA": "Analyser le marché du travail", "en-CA": "Analyze the job market" },
            criteria: [
              { id: "01HY-1.1", text: { "fr-CA": "Identification juste des secteurs d'activité liés à sa formation", "en-CA": "Accurate identification of sectors related to one's training" } },
              { id: "01HY-1.2", text: { "fr-CA": "Analyse pertinente des tendances du marché de l'emploi", "en-CA": "Relevant analysis of employment market trends" } }
            ]
          },
          {
            id: "01HY-3",
            title: { "fr-CA": "Se préparer à l'entrevue", "en-CA": "Prepare for the interview" },
            criteria: [
              { id: "01HY-3.1", text: { "fr-CA": "Préparation adéquate aux questions d'entrevue courantes", "en-CA": "Adequate preparation for common interview questions" } },
              { id: "01HY-3.2", text: { "fr-CA": "Présentation personnelle appropriée au contexte professionnel", "en-CA": "Personal presentation appropriate to a professional context" } }
            ]
          },
          {
            id: "01HY-5",
            title: { "fr-CA": "Évaluer son intégration", "en-CA": "Evaluate integration" },
            criteria: [
              { id: "01HY-5.1", text: { "fr-CA": "Autoévaluation honnête de sa performance en stage", "en-CA": "Honest self-assessment of internship performance" } },
              { id: "01HY-5.2", text: { "fr-CA": "Identification pertinente des axes d'amélioration", "en-CA": "Relevant identification of areas for improvement" } }
            ]
          }
        ]
      }
    ]
  },

  // ── LEA.3Q — Programmeur-analyste en technologies de l'information ─────────
  // Source: FR + EN course outlines received. 255h, pondération 1-16-2.
  // 00SE and 00SH are shared with 420.BP/BR/BX.
  // 00Q1, 00Q2, 00Q8, 00SF, 00SG added to SHARED_COMPETENCIES above.
  "420-SG4-AS": {
    title: {
      "fr-CA": "Stage en technologies de l'information",
      "en-CA": "Internship in Information Technology"
    },
    programs: ["LEA.3Q"],
    hours: 255,
    competencies: [
      { ...SHARED_COMPETENCIES["00Q1"] },
      { ...SHARED_COMPETENCIES["00Q2"] },
      { ...SHARED_COMPETENCIES["00Q8"] },
      { ...SHARED_COMPETENCIES["00SE"] },
      { ...SHARED_COMPETENCIES["00SF"] },
      { ...SHARED_COMPETENCIES["00SG"] },
      { ...SHARED_COMPETENCIES["00SH"] },
    ]
  },

  // ── 571.A0 / NTC.0Q — Design de la mode ───────────────────────────────────
  // Source: FR + EN course outlines received. 120h, pondération 1-7-2.
  "571-KY7-AS": {
    title: {
      "fr-CA": "Intégration design de mode (stage)",
      "en-CA": "Fashion Design Integration (Internship)"
    },
    programs: ["571.A0", "NTC.0Q"],
    hours: 120,
    competencies: [
      {
        code: "00TW",
        title: {
          "fr-CA": "Élaborer des projets de collection pour des marchés visés",
          "en-CA": "Develop collection projects for target markets"
        },
        elements: [
          {
            id: "00TW-1",
            title: {
              "fr-CA": "Analyser les marchés cibles et les tendances",
              "en-CA": "Analyze target markets and trends"
            },
            criteria: [
              { id: "00TW-1.1", text: { "fr-CA": "Identification précise des caractéristiques des marchés visés", "en-CA": "Accurate identification of target market characteristics" } },
              { id: "00TW-1.2", text: { "fr-CA": "Analyse pertinente des tendances de la mode et du contexte commercial", "en-CA": "Relevant analysis of fashion trends and commercial context" } }
            ]
          },
          {
            id: "00TW-2",
            title: {
              "fr-CA": "Concevoir et développer la collection",
              "en-CA": "Design and develop the collection"
            },
            criteria: [
              { id: "00TW-2.1", text: { "fr-CA": "Cohérence de la collection avec l'identité de la marque et le marché cible", "en-CA": "Coherence of the collection with the brand identity and target market" } },
              { id: "00TW-2.2", text: { "fr-CA": "Application rigoureuse des techniques de design de mode", "en-CA": "Rigorous application of fashion design techniques" } },
              { id: "00TW-2.3", text: { "fr-CA": "Respect des contraintes de production et de budget", "en-CA": "Compliance with production and budget constraints" } }
            ]
          },
          {
            id: "00TW-3",
            title: {
              "fr-CA": "Présenter et défendre les projets de collection",
              "en-CA": "Present and defend collection projects"
            },
            criteria: [
              { id: "00TW-3.1", text: { "fr-CA": "Présentation claire et professionnelle de la collection", "en-CA": "Clear and professional presentation of the collection" } },
              { id: "00TW-3.2", text: { "fr-CA": "Argumentation convaincante des choix créatifs et commerciaux", "en-CA": "Convincing argumentation of creative and commercial choices" } }
            ]
          }
        ]
      }
    ]
  },

  // ── 571.C0 / NTC.1W — Commercialisation de la mode ────────────────────────
  // Source: FR + EN course outlines received. 120h, pondération 1-7-1.
  "571-KQ9-AS": {
    title: {
      "fr-CA": "Stage en commercialisation de la mode",
      "en-CA": "Internship in Fashion Marketing"
    },
    programs: ["571.C0", "NTC.1W"],
    hours: 120,
    competencies: [
      {
        code: "00X1",
        title: {
          "fr-CA": "Relier les activités de commercialisation au fonctionnement d'une entreprise de mode",
          "en-CA": "Link marketing activities to the operations of a fashion business"
        },
        elements: [
          {
            id: "00X1-1",
            title: {
              "fr-CA": "Analyser le fonctionnement de l'entreprise de mode",
              "en-CA": "Analyze the operations of the fashion business"
            },
            criteria: [
              { id: "00X1-1.1", text: { "fr-CA": "Compréhension juste de la structure organisationnelle et des processus internes", "en-CA": "Accurate understanding of the organizational structure and internal processes" } },
              { id: "00X1-1.2", text: { "fr-CA": "Identification précise des liens entre les différentes fonctions de l'entreprise", "en-CA": "Accurate identification of links between the various business functions" } }
            ]
          },
          {
            id: "00X1-2",
            title: {
              "fr-CA": "Relier les activités de commercialisation aux opérations de l'entreprise",
              "en-CA": "Link marketing activities to business operations"
            },
            criteria: [
              { id: "00X1-2.1", text: { "fr-CA": "Intégration cohérente des activités de commercialisation dans les opérations globales de l'entreprise", "en-CA": "Coherent integration of marketing activities into the overall operations of the business" } },
              { id: "00X1-2.2", text: { "fr-CA": "Application appropriée des stratégies de commercialisation adaptées au contexte de la mode", "en-CA": "Appropriate application of marketing strategies adapted to the fashion context" } },
              { id: "00X1-2.3", text: { "fr-CA": "Évaluation rigoureuse des résultats des actions de commercialisation", "en-CA": "Rigorous evaluation of the results of marketing actions" } }
            ]
          }
        ]
      }
    ]
  }

};


// ── Helper functions ─────────────────────────────────────────────────────────

/**
 * Returns the course object for a given course code.
 * Falls back to "generic" if the code is not found.
 * @param {string} courseCode
 * @returns {object}
 */
function getCourseData(courseCode) {
  return COURSES[courseCode] || COURSES["generic"];
}

/**
 * Returns the competencies visible to a student given their course code
 * and program code. For courses where competencies have a `programs` filter
 * (e.g. 430-HRS-AS), only matching competencies are returned.
 * @param {string} courseCode
 * @param {string} programCode
 * @returns {Array}
 */
function getStudentCompetencies(courseCode, programCode) {
  const course = getCourseData(courseCode);
  return course.competencies.filter(comp => {
    // If the competency has its own program filter, apply it.
    // Otherwise it applies to all programs in the course.
    if (comp.programs && comp.programs.length > 0) {
      return comp.programs.includes(programCode);
    }
    return true;
  });
}

/**
 * Returns the list of course codes available for a given program code,
 * always including "generic" as the last option.
 * @param {string} programCode
 * @returns {string[]}
 */
function getCoursesForProgram(programCode) {
  const matches = Object.keys(COURSES).filter(code => {
    if (code === "generic") return false;
    return COURSES[code].programs.includes(programCode);
  });
  return [...matches, "generic"];
}

/**
 * Returns only selectable (non-hidden) programs for student-facing UI.
 */
function getSelectablePrograms() {
  return PROGRAMS.filter(p => !p.hidden);
}

/**
 * Returns a display label for a course in the given language.
 * Format: "420-SG6-AS — Workplace Integration: Network Management and Security"
 * @param {string} courseCode
 * @param {string} lang  "fr-CA" | "en-CA"
 * @returns {string}
 */
function getCourseLabel(courseCode, lang) {
  if (courseCode === "generic") {
    return lang === "fr-CA" ? "Autre / Other" : "Other / Autre";
  }
  const course = COURSES[courseCode];
  if (!course) return courseCode;
  const title = course.title[lang] || course.title["fr-CA"];
  return `${courseCode} — ${title}`;
}

// ── Program learning outcomes ──────────────────────────────────────────────────
// Source: LCI Education website (collegelasalle.lcieducation.com), fetched Apr 2026.
// IDs are stable and program-scoped (LO-{PROGRAM}-{NNN}).
// redundant_with: outcome substantially covered by a ministry competency —
//   hidden in the student UI in favour of the competency.
const PROGRAM_OUTCOMES = {
  "420.BP": [
    { id: "LO-420BP-001", fr: "Maîtrise des langages de programmation pour des solutions logicielles évolutives", en: "Mastery of programming languages for scalable software solutions" },
    { id: "LO-420BP-002", fr: "Résolution de problèmes complexes et conception de solutions algorithmiques", en: "Complex problem solving and algorithmic solution design" },
    { id: "LO-420BP-003", fr: "Application de méthodologies rigoureuses pour le développement de logiciels fiables", en: "Application of rigorous methodologies for reliable software development" },
    { id: "LO-420BP-004", fr: "Tests, débogage et assurance de la performance des systèmes", en: "Testing, debugging and system performance assurance" },
    { id: "LO-420BP-005", fr: "Gestion de projets informatiques", en: "IT project management" },
    { id: "LO-420BP-006", fr: "Analyse orientée objet pour la conception et l'intégration d'applications industrielles", en: "Object-oriented analysis for the design and integration of industrial applications" },
  ],
  "420.BR": [
    { id: "LO-420BR-001", fr: "Conception, mise en œuvre et dépannage d'infrastructures réseau physiques et infonuagiques", en: "Design, implementation and troubleshooting of physical and cloud network infrastructures" },
    { id: "LO-420BR-002", fr: "Cybersécurité : protection des systèmes réseau contre les menaces", en: "Cybersecurity: protecting network systems against threats" },
    { id: "LO-420BR-003", fr: "Surveillance réseau, optimisation des performances et planification de capacité", en: "Network monitoring, performance optimization and capacity planning" },
    { id: "LO-420BR-004", fr: "Évaluation des risques, planification de reprise après sinistre et réponse aux incidents", en: "Risk assessment, disaster recovery planning and incident response" },
    { id: "LO-420BR-005", fr: "Certifications CISCO et LPIC", en: "CISCO and LPIC certifications" },
    { id: "LO-420BR-006", fr: "Administration de systèmes Linux et gestion d'applications réseau", en: "Linux system administration and network application management" },
  ],
  "420.BX": [
    { id: "LO-420BX-001", fr: "Programmation de moteurs de jeux en Java, C++ et autres langages", en: "Game engine programming in Java, C++ and other languages" },
    { id: "LO-420BX-002", fr: "Conception et implémentation de mécaniques et de mondes de jeux vidéo", en: "Design and implementation of video game mechanics and worlds" },
    { id: "LO-420BX-003", fr: "Résolution de problèmes techniques pour assurer la fluidité du gameplay", en: "Technical problem solving to ensure smooth gameplay" },
    { id: "LO-420BX-004", fr: "Tests de jeux et assurance qualité : identification et correction d'erreurs", en: "Game testing and quality assurance: identifying and fixing errors" },
    { id: "LO-420BX-005", fr: "Développement pour jeux AAA, équipes indépendantes et applications", en: "Development for AAA games, independent teams and applications" },
    { id: "LO-420BX-006", fr: "Collaboration avec des studios de jeux de premier plan", en: "Collaboration with leading game studios", redundant_with: "00SE" },
  ],
  "LEA.3Q": [
    { id: "LO-LEA3Q-001", fr: "Identification, collecte et analyse des besoins de traitement de l'information", en: "Identification, collection and analysis of information processing needs" },
    { id: "LO-LEA3Q-002", fr: "Modélisation des données et des processus avec logiciels de quatrième génération", en: "Data and process modelling with fourth-generation software" },
    { id: "LO-LEA3Q-003", fr: "Gestion et configuration d'applications réseau", en: "Network application management and configuration" },
    { id: "LO-LEA3Q-004", fr: "Maîtrise linguistique pour solutions logicielles évolutives", en: "Language mastery for scalable software solutions" },
    { id: "LO-LEA3Q-005", fr: "Résolution de problèmes complexes et solutions algorithmiques", en: "Complex problem solving and algorithmic solutions" },
    { id: "LO-LEA3Q-006", fr: "Tests, débogage et assurance de la performance du système", en: "Testing, debugging and system performance assurance" },
  ],
  "LEA.99": [
    { id: "LO-LEA99-001", fr: "Installation et administration de réseaux informatiques", en: "Installation and administration of computer networks" },
    { id: "LO-LEA99-002", fr: "Sécurisation des systèmes et gestion des accès", en: "System security and access management" },
    { id: "LO-LEA99-003", fr: "Surveillance et maintenance de l'infrastructure réseau", en: "Network infrastructure monitoring and maintenance" },
    { id: "LO-LEA99-004", fr: "Support technique et dépannage réseau", en: "Technical support and network troubleshooting" },
  ],
  "LEA.DQ": [
    { id: "LO-LEADQ-001", fr: "Application des concepts mathématiques pour créer des modèles et solutions en informatique", en: "Application of mathematical concepts to create IT models and solutions" },
    { id: "LO-LEADQ-002", fr: "Préparation et exploration de données, choix des algorithmes appropriés", en: "Data preparation and exploration, selection of appropriate algorithms" },
    { id: "LO-LEADQ-003", fr: "Intégration interdisciplinaire pour générer des résultats décisionnels à valeur ajoutée", en: "Interdisciplinary integration to generate value-added decision-making results" },
    { id: "LO-LEADQ-004", fr: "Apprentissage automatique : fonctionnement et application pratique", en: "Machine learning: functioning and practical application" },
    { id: "LO-LEADQ-005", fr: "Applications en FinTech, jeux vidéo et cybersécurité", en: "Applications in FinTech, video games and cybersecurity" },
    { id: "LO-LEADQ-006", fr: "Analyse de données et intelligence d'affaires", en: "Data analysis and business intelligence" },
  ],
  "570.E0": [
    { id: "LO-570E0-001", fr: "Création d'espaces intérieurs fonctionnels et esthétiquement plaisants", en: "Creation of functional and aesthetically pleasing interior spaces" },
    { id: "LO-570E0-002", fr: "Amélioration de l'ambiance et de l'atmosphère des environnements intérieurs", en: "Enhancement of the ambiance and atmosphere of interior environments" },
    { id: "LO-570E0-003", fr: "Connaissance des codes du bâtiment, réglementations et pratiques durables", en: "Knowledge of building codes, regulations and sustainable practices" },
    { id: "LO-570E0-004", fr: "Conception d'espaces sécuritaires et conformes aux normes", en: "Design of safe, standards-compliant spaces" },
    { id: "LO-570E0-005", fr: "Présentation de concepts de design aux clients", en: "Presentation of design concepts to clients", redundant_with: "022G" },
    { id: "LO-570E0-006", fr: "Collaboration avec clients, entrepreneurs et collègues", en: "Collaboration with clients, contractors and colleagues" },
  ],
  "NTA.21": [
    { id: "LO-NTA21-001", fr: "Création d'espaces intérieurs fonctionnels et esthétiquement plaisants pour contextes résidentiels, commerciaux et institutionnels", en: "Creation of functional and aesthetically pleasing interior spaces for residential, commercial and institutional contexts" },
    { id: "LO-NTA21-002", fr: "Maîtrise des logiciels professionnels de design d'intérieur", en: "Mastery of professional interior design software" },
    { id: "LO-NTA21-003", fr: "Application des codes du bâtiment et des réglementations", en: "Application of building codes and regulations" },
    { id: "LO-NTA21-004", fr: "Conception durable et respectueuse de l'environnement", en: "Sustainable and environmentally responsible design" },
    { id: "LO-NTA21-005", fr: "Présentation de concepts aux clients", en: "Presentation of concepts to clients", redundant_with: "022G" },
    { id: "LO-NTA21-006", fr: "Coordination avec entrepreneurs et fournisseurs", en: "Coordination with contractors and suppliers" },
  ],
  "571.A0": [
    { id: "LO-571A0-001", fr: "Conception de collections de vêtements originaux, du concept à la fabrication", en: "Design of original clothing collections, from concept to production" },
    { id: "LO-571A0-002", fr: "Maîtrise des techniques de patronage, coupe et assemblage", en: "Mastery of pattern-making, cutting and assembly techniques" },
    { id: "LO-571A0-003", fr: "Recherche et analyse des tendances de l'industrie de la mode", en: "Research and analysis of fashion industry trends", redundant_with: "00TW" },
    { id: "LO-571A0-004", fr: "Développement de stratégies créatives et de présentation de collections", en: "Development of creative strategies and collection presentations", redundant_with: "00TW" },
    { id: "LO-571A0-005", fr: "Connaissance des matériaux textiles et des procédés de fabrication", en: "Knowledge of textile materials and manufacturing processes" },
    { id: "LO-571A0-006", fr: "Compétences en dessin de mode et illustration", en: "Fashion drawing and illustration skills" },
  ],
  "NTC.0Q": [
    { id: "LO-NTC0Q-001", fr: "Conception de collections de vêtements et accessoires originaux", en: "Design of original clothing and accessories collections" },
    { id: "LO-NTC0Q-002", fr: "Maîtrise des techniques de production : patronage, prototypage, coupe", en: "Mastery of production techniques: pattern-making, prototyping, cutting" },
    { id: "LO-NTC0Q-003", fr: "Développement de stratégies marketing pour les créations", en: "Development of marketing strategies for creative work" },
    { id: "LO-NTC0Q-004", fr: "Analyse de marché et positionnement de la marque", en: "Market analysis and brand positioning" },
    { id: "LO-NTC0Q-005", fr: "Maîtrise du design numérique pour la mode", en: "Mastery of digital design for fashion" },
  ],
  "571.C0": [
    { id: "LO-571C0-001", fr: "Développement et mise en œuvre de stratégies marketing pour la mode", en: "Development and implementation of fashion marketing strategies", redundant_with: "00X1" },
    { id: "LO-571C0-002", fr: "Gestion commerciale et développement des ventes dans l'industrie de la mode", en: "Commercial management and sales development in the fashion industry" },
    { id: "LO-571C0-003", fr: "Analyse des tendances et positionnement de produits", en: "Trend analysis and product positioning" },
    { id: "LO-571C0-004", fr: "Organisation d'événements mode et expériences clientèle", en: "Organisation of fashion events and customer experiences" },
    { id: "LO-571C0-005", fr: "Gestion de la chaîne d'approvisionnement dans la mode", en: "Fashion supply chain management" },
    { id: "LO-571C0-006", fr: "Commerce électronique et marketing numérique appliqués à la mode", en: "E-commerce and digital marketing applied to fashion", redundant_with: "00X1" },
  ],
  "NTC.1W": [
    { id: "LO-NTC1W-001", fr: "Développement de stratégies marketing et commerciales pour la mode", en: "Development of marketing and commercial strategies for fashion" },
    { id: "LO-NTC1W-002", fr: "Entrepreneuriat et développement de marque dans l'industrie de la mode", en: "Entrepreneurship and brand development in the fashion industry" },
    { id: "LO-NTC1W-003", fr: "Gestion de produits et commerce électronique", en: "Product management and e-commerce" },
    { id: "LO-NTC1W-004", fr: "Marketing numérique appliqué à la mode", en: "Digital marketing applied to fashion" },
    { id: "LO-NTC1W-005", fr: "Gestion des relations clients et développement des ventes", en: "Customer relationship management and sales development" },
  ],
  "410.G0": [
    { id: "LO-410G0-001", fr: "Planification et coordination des opérations de transport et de logistique", en: "Planning and coordination of transport and logistics operations" },
    { id: "LO-410G0-002", fr: "Gestion des stocks, des entrepôts et de la chaîne d'approvisionnement", en: "Inventory, warehouse and supply chain management" },
    { id: "LO-410G0-003", fr: "Optimisation des flux de marchandises et réduction des coûts", en: "Optimization of goods flow and cost reduction" },
    { id: "LO-410G0-004", fr: "Utilisation des systèmes d'information logistique", en: "Use of logistics information systems" },
    { id: "LO-410G0-005", fr: "Connaissance des réglementations du transport national et international", en: "Knowledge of national and international transport regulations" },
    { id: "LO-410G0-006", fr: "Gestion des relations avec les fournisseurs et les transporteurs", en: "Management of relationships with suppliers and carriers" },
  ],
  "LCA.5G": [
    { id: "LO-LCA5G-001", fr: "Coordination des opérations de transport et de distribution", en: "Coordination of transport and distribution operations" },
    { id: "LO-LCA5G-002", fr: "Gestion des stocks et de la chaîne d'approvisionnement", en: "Inventory and supply chain management" },
    { id: "LO-LCA5G-003", fr: "Optimisation logistique et réduction des délais", en: "Logistics optimization and lead time reduction" },
    { id: "LO-LCA5G-004", fr: "Utilisation des outils de gestion logistique", en: "Use of logistics management tools" },
    { id: "LO-LCA5G-005", fr: "Application des réglementations du transport", en: "Application of transport regulations" },
  ],
  "410.B0": [
    { id: "LO-410B0-001", fr: "Tenue de livres et comptabilité générale", en: "Bookkeeping and general accounting" },
    { id: "LO-410B0-002", fr: "Préparation des états financiers", en: "Preparation of financial statements" },
    { id: "LO-410B0-003", fr: "Gestion de la paie et des comptes clients et fournisseurs", en: "Payroll and accounts receivable/payable management" },
    { id: "LO-410B0-004", fr: "Application des normes comptables et fiscales québécoises", en: "Application of Quebec accounting and tax standards" },
    { id: "LO-410B0-005", fr: "Utilisation des logiciels comptables professionnels", en: "Use of professional accounting software" },
    { id: "LO-410B0-006", fr: "Analyse financière et production de rapports", en: "Financial analysis and reporting" },
  ],
  "LCA.71": [
    { id: "LO-LCA71-001", fr: "Tenue de livres et comptabilité générale", en: "Bookkeeping and general accounting" },
    { id: "LO-LCA71-002", fr: "Préparation des états financiers", en: "Preparation of financial statements" },
    { id: "LO-LCA71-003", fr: "Gestion de la paie, comptes clients et fournisseurs", en: "Payroll, accounts receivable and payable management" },
    { id: "LO-LCA71-004", fr: "Application des normes comptables et fiscales", en: "Application of accounting and tax standards" },
    { id: "LO-LCA71-005", fr: "Utilisation des logiciels comptables", en: "Use of accounting software" },
    { id: "LO-LCA71-006", fr: "Production de rapports financiers", en: "Production of financial reports" },
  ],
  "410.D0": [
    { id: "LO-410D0-001", fr: "Gestion des opérations commerciales et des ventes", en: "Commercial operations and sales management" },
    { id: "LO-410D0-002", fr: "Marketing et développement de la clientèle", en: "Marketing and customer development" },
    { id: "LO-410D0-003", fr: "Gestion des ressources humaines dans un contexte commercial", en: "Human resources management in a commercial context" },
    { id: "LO-410D0-004", fr: "Analyse financière et gestion budgétaire", en: "Financial analysis and budget management" },
    { id: "LO-410D0-005", fr: "Gestion des stocks et approvisionnement", en: "Inventory and procurement management" },
    { id: "LO-410D0-006", fr: "Service à la clientèle et développement des affaires", en: "Customer service and business development" },
  ],
  "LCA.70": [
    { id: "LO-LCA70-001", fr: "Gestion des opérations commerciales", en: "Commercial operations management" },
    { id: "LO-LCA70-002", fr: "Développement des ventes et marketing", en: "Sales development and marketing" },
    { id: "LO-LCA70-003", fr: "Gestion des responsabilités d'affaires et opérations commerciales", en: "Business responsibilities and commercial operations management" },
    { id: "LO-LCA70-004", fr: "Commerce électronique et stratégie numérique", en: "E-commerce and digital strategy" },
    { id: "LO-LCA70-005", fr: "Gestion budgétaire et analyse financière de base", en: "Budget management and basic financial analysis" },
  ],
  "410.X0": [
    { id: "LO-410X0-001", fr: "Gestion de projets créatifs et alignement des objectifs commerciaux avec les objectifs artistiques", en: "Creative project management and alignment of commercial with artistic objectives" },
    { id: "LO-410X0-002", fr: "Stratégies marketing propres aux industries créatives : promotion et développement de marque", en: "Marketing strategies specific to creative industries: promotion and brand development" },
    { id: "LO-410X0-003", fr: "Analyse des budgets, optimisation des ressources dans des contextes créatifs", en: "Budget analysis and resource optimization in creative contexts" },
    { id: "LO-410X0-004", fr: "Direction d'équipes créatives pluridisciplinaires", en: "Leadership of multidisciplinary creative teams" },
    { id: "LO-410X0-005", fr: "Connaissance des secteurs créatifs : design, jeux vidéo, multimédia, mode, médias, publicité", en: "Knowledge of creative sectors: design, video games, multimedia, fashion, media, advertising" },
    { id: "LO-410X0-006", fr: "Production et valorisation de contenus créatifs", en: "Production and development of creative content" },
  ],
  "430.A0": [
    { id: "LO-430A0-001", fr: "Gestion des opérations hôtelières et des normes de service", en: "Management of hotel operations and service standards" },
    { id: "LO-430A0-002", fr: "Leadership et gestion d'équipes dans l'industrie de l'hospitalité", en: "Leadership and team management in the hospitality industry" },
    { id: "LO-430A0-003", fr: "Gestion des revenus hôteliers, analyse financière et budgétisation", en: "Hotel revenue management, financial analysis and budgeting" },
    { id: "LO-430A0-004", fr: "Connaissance des tendances locales et mondiales de l'hospitalité", en: "Knowledge of local and global hospitality trends" },
    { id: "LO-430A0-005", fr: "Expérience pratique par des stages rémunérés", en: "Practical experience through paid internships" },
    { id: "LO-430A0-006", fr: "Gestion de la relation client et standards d'hospitalité de premier ordre", en: "Client relationship management and first-class hospitality standards" },
  ],
  "LJA.17": [
    { id: "LO-LJA17-001", fr: "Gestion des opérations hôtelières et standards de service", en: "Management of hotel operations and service standards" },
    { id: "LO-LJA17-002", fr: "Leadership et motivation des équipes hôtelières", en: "Leadership and motivation of hotel teams" },
    { id: "LO-LJA17-003", fr: "Gestion des revenus, analyse financière et budgétisation", en: "Revenue management, financial analysis and budgeting" },
    { id: "LO-LJA17-004", fr: "Connaissance des contextes local et mondial de l'hospitalité", en: "Knowledge of local and global hospitality contexts" },
    { id: "LO-LJA17-005", fr: "Compétences pratiques acquises par stages rémunérés", en: "Practical skills acquired through paid internships" },
    { id: "LO-LJA17-006", fr: "Gestion de la relation client et développement de l'expérience client", en: "Client relationship management and customer experience development" },
  ],
  "NWY.1X": [
    { id: "LO-NWY1X-001", fr: "Développement et mise en œuvre de stratégies sur les réseaux sociaux", en: "Development and implementation of social media strategies" },
    { id: "LO-NWY1X-002", fr: "Création et gestion de contenu pour les plateformes numériques", en: "Content creation and management for digital platforms", redundant_with: "KR41" },
    { id: "LO-NWY1X-003", fr: "Analyse des métriques et mesure de la performance des campagnes", en: "Metrics analysis and campaign performance measurement", redundant_with: "KR49" },
    { id: "LO-NWY1X-004", fr: "Gestion de communautés en ligne", en: "Online community management", redundant_with: "KR48" },
    { id: "LO-NWY1X-005", fr: "Marketing d'influence et partenariats numériques", en: "Influencer marketing and digital partnerships" },
    { id: "LO-NWY1X-006", fr: "Veille et gestion de la réputation en ligne", en: "Online monitoring and reputation management" },
  ],
};

/**
 * Returns the non-redundant learning outcomes for a program.
 * These are shown alongside competencies in the tag drawer.
 * @param {string} programCode
 * @returns {Array<{id, fr, en}>}
 */
function getStudentOutcomes(programCode) {
  const outcomes = PROGRAM_OUTCOMES[programCode] || [];
  return outcomes.filter(o => !o.redundant_with);
}

/**
 * Returns a unified tag pool for a student: ministry competencies + non-redundant
 * program outcomes. Used to populate the Compétences & apprentissages drawer.
 * Each item: { type: 'competency'|'outcome', id, label: {fr, en} }
 * @param {string} courseCode
 * @param {string} programCode
 * @param {string} lang
 * @returns {Array}
 */
function getStudentTagPool(courseCode, programCode, lang) {
  const tags = [];
  // Competencies first
  const comps = getStudentCompetencies(courseCode, programCode);
  comps.forEach(c => tags.push({
    type: 'competency',
    id:   c.code,
    label: c.title,
  }));
  // Non-redundant outcomes
  const outcomes = getStudentOutcomes(programCode);
  outcomes.forEach(o => tags.push({
    type: 'outcome',
    id:   o.id,
    label: { 'fr-CA': o.fr, 'en-CA': o.en },
  }));
  return tags;
}
/**
 * Returns a display label for a program in the given language.
 * @param {string} programCode
 * @param {string} lang
 * @returns {string}
 */
function getProgramLabel(programCode, lang) {
  if (!programCode || programCode === "other") {
    return lang === "fr-CA" ? "Autre / Other" : "Other / Autre";
  }
  const program = PROGRAMS.find(p => p.code === programCode);
  if (!program) return programCode;
  return `${programCode} — ${program.name[lang] || program.name["fr-CA"]}`;
}
