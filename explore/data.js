'use strict';

/* ═══════════════════════════════════════════
   i18n
═══════════════════════════════════════════ */
const T = {
  fr: {
    'w-eyebrow':'Tech et design','w-title':'Trouve ton programme',
    'w-sub':"Réponds à quelques questions et découvre les programmes du Collège LaSalle qui correspondent le mieux à ton profil.",
    'w-cta':'Commencer',back:'← Retour',next:'Suivant →',last:'Découvrir mes programmes →',
    eye:'Tes préférences',neither:'Aucune de ces options',both:'Les deux',conflbl:'Confiance du résultat',
    rtitle:'Tes programmes',rsub:'Ces programmes correspondent le mieux à ton profil.',
    kg:'Continuer à affiner →',reset:'↺ Recommencer',export:'Télécharger mes résultats',
    share:'Partager', shareMenu:'Partager mes résultats',
    shareEmail:'Envoyer par courriel', shareCopy:'Copier le texte',
    shareCopied:'✓ Copié !', shareSubject:'Mes programmes — Collège LaSalle',
    school:'École',code:'Code',detail_what:'Ce que tu feras',detail_where:'Où tu travailleras',
    detail_titles:'Titres de postes',detail_future:'Le métier en 2025 et après',
    warnInt:"Programme de moins de 2 ans — les étudiant·e·s internationaux·ales doivent vérifier les conditions de leur permis d'études (CAQ) avec le Collège.",
    warnFrInter:"En étudiant en anglais, tu devras réussir un examen de français pour obtenir ton diplôme (EUF pour le DEC, ou test TEFAQ/TCF niveau 7 pour l'AEC). Un soutien linguistique est inclus dans ton programme.",
    warnFrBeg:"Attention : un niveau de français insuffisant risque d'empêcher l'obtention du diplôme. La Loi 14 exige la réussite de l'EUF pour le DEC et une preuve de niveau 7 pour l'AEC. Des cours de francisation gratuits sont disponibles au Collège.",
    warnGlobal:"Rappel : étudier en anglais au Québec exige de réussir un examen de français pour obtenir ton diplôme. Le Collège offre des cours de soutien linguistique inclus dans ton programme.",
  },
  en: {
    'w-eyebrow':'Tech & design','w-title':'Find your program',
    'w-sub':'Answer a few questions and discover the Collège LaSalle programs that best match your profile.',
    'w-cta':'Get started',back:'← Back',next:'Next →',last:'Find my programs →',
    eye:'Your preferences',neither:'Neither of these',both:'Both',conflbl:'Result confidence',
    rtitle:'Your top programs',rsub:'These programs best match your profile.',
    kg:'Keep refining →',reset:'↺ Start over',export:'Download my results',
    share:'Share', shareMenu:'Share my results',
    shareEmail:'Send by email', shareCopy:'Copy text',
    shareCopied:'✓ Copied!', shareSubject:'My top programs — Collège LaSalle',
    school:'School',code:'Code',detail_what:'What you will do',detail_where:'Where you will work',
    detail_titles:'Job titles',detail_future:'The field in 2025 and beyond',
    warnInt:'Program under 2 years — international students should verify their study permit (CAQ) conditions with the College.',
    warnFrInter:'Studying in English still requires passing a French language test to graduate — the EUF for a DEC, or TEFAQ/TCF Level 7 for an AEC. Language support is included in your program.',
    warnFrBeg:'Important: Insufficient French may prevent graduation. Law 14 requires passing the EUF for a DEC and proof of French Level 7 for an AEC. Free French courses are available at the College.',
    warnGlobal:'Reminder: Studying in English in Quebec requires passing a French language test to graduate. The College provides French language support courses included in your program.',
  },
  es: {
    'w-eyebrow':'Tecnología y diseño','w-title':'Encuentra tu programa',
    'w-sub':'Responde algunas preguntas y descubre los programas del Collège LaSalle que mejor se adaptan a tu perfil.',
    'w-cta':'Empezar',back:'← Volver',next:'Siguiente →',last:'Encontrar mis programas →',
    eye:'Tus preferencias',neither:'Ninguna de las dos',both:'Ambas',conflbl:'Confianza del resultado',
    rtitle:'Tus programas',rsub:'Estos programas corresponden mejor a tu perfil.',
    kg:'Seguir refinando →',reset:'↺ Volver a empezar',export:'Descargar mis resultados',
    share:'Compartir', shareMenu:'Compartir mis resultados',
    shareEmail:'Enviar por correo', shareCopy:'Copiar texto',
    shareCopied:'✓ Copiado!', shareSubject:'Mis programas — Collège LaSalle',
    school:'Escuela',code:'Código',detail_what:'Lo que harás',detail_where:'Dónde trabajarás',
    detail_titles:'Títulos de puestos',detail_future:'El oficio en 2025 y más allá',
    warnInt:'Programa de menos de 2 años — los estudiantes internacionales deben verificar las condiciones de su permiso de estudios (CAQ) con el Colegio.',
    warnFrInter:'Estudiar en inglés igualmente requiere aprobar un examen de francés para graduarse (EUF para DEC, o TEFAQ/TCF nivel 7 para AEC). El apoyo lingüístico está incluido en tu programa.',
    warnFrBeg:'Importante: un nivel de francés insuficiente puede impedir la obtención del diploma. La Ley 14 exige aprobar la EUF para el DEC y una prueba de nivel 7 para el AEC. Hay cursos gratuitos de francés en el Colegio.',
    warnGlobal:'Recordatorio: estudiar en inglés en Quebec requiere aprobar un examen de francés para graduarse. El Colegio ofrece cursos de apoyo en francés incluidos en tu programa.',
  }
};
let lang='fr';
function t(k){return T[lang][k]||T.fr[k]||k;}
function setLang(l){
  lang=l;
  document.querySelectorAll('.lang-btn').forEach(b=>b.classList.toggle('active',b.textContent.toLowerCase()===l));
  document.documentElement.lang=l;
  applyT();
  if(cur==='profile') renderProfile();
  if(cur==='quiz')    renderQuiz();
  if(cur==='results') {
    renderResults();
    const panel=document.getElementById('refinePanel');
    if(panel&&panel.style.display!=='none') renderRefinePanel();
  }
}
function applyT(){
  const ids={
    'w-eyebrow':'w-eyebrow','w-title':'w-title','w-sub':'w-sub','w-cta':'w-cta',
    'qEye':'eye','qNeither':'neither','qBothLbl':'both','qConfLbl':'conflbl',
    'rTitle':'rtitle','rSub':'rsub','rReset':'reset','rExport':'export','kgLbl':'kg',
    'pBack':'back','rShareLbl':'share',
    'shareMenuTitle':'shareMenu','shareEmailLbl':'shareEmail',
    'shareCopyLbl':'shareCopy','shareCopied':'shareCopied'
  };
  Object.entries(ids).forEach(([id,k])=>{const e=document.getElementById(id);if(e)e.textContent=t(k);});
  // Update logo link language
  const logoLink = document.getElementById('logoLink');
  if(logoLink) logoLink.href = lang==='en'
    ? 'https://lasallecollege.lcieducation.com/en'
    : 'https://collegelasalle.lcieducation.com/fr';
}

/* ═══════════════════════════════════════════
   PROGRAMS
═══════════════════════════════════════════ */
const PROGS = [
  // ── Arts, Design & Communication ──
  { id:'design-interieur-dec', code:'570.E0', type:'DEC', dur:3, fac:'art', col:'#cdc19e', visible:true,
    url:{fr:'https://collegelasalle.lcieducation.com/fr/programmes-et-cours/dec-techniques-de-design-d-interieur',en:'https://lasallecollege.lcieducation.com/en/programs-and-courses/dcs-interior-design'},
    decPair:null, aecPair:'design-interieur-aec',
    name:{fr:'Techniques de design d\'intérieur',en:'Interior Design Techniques',es:'Técnicas de diseño de interiores'},
    school:{fr:'Arts, design et communication',en:'Art, Design & Communication',es:'Artes, Diseño y Comunicación'},
    tags:['visual','creative','spatial','design','colors','shapes','people-needs','wellbeing','architecture','3d'],
    detail:{
      what:{fr:"Concevoir des espaces résidentiels, commerciaux et institutionnels — de l'esquisse au plan technique — en travaillant avec des clients réels dès la formation.",en:"Design residential, commercial and institutional spaces — from sketch to technical plan — working with real clients throughout your training.",es:"Diseñar espacios residenciales, comerciales e institucionales — desde el boceto hasta el plano técnico — trabajando con clientes reales desde la formación."},
      where:{fr:"Firmes de design et d'architecture, studios de cinéma et télévision, hôtels, commerces, résidences pour aîné·e·s, à ton compte.",en:"Design and architecture firms, film and TV studios, hotels, retail, seniors' residences, self-employed.",es:"Estudios de diseño y arquitectura, estudios de cine y TV, hoteles, comercios, residencias para mayores, por cuenta propia."},
      titles:{fr:['Designer d\'intérieur','Technicien·ne en aménagement','Visualiseur·se 3D','Chargé·e de projet'],en:['Interior Designer','Space Planning Technician','3D Visualizer','Project Coordinator'],es:['Diseñador/a de interiores','Técnico/a de espacios','Visualizador/a 3D','Coordinador/a de proyectos']},
      future:{fr:["L'IA génère des concepts visuels en secondes — les meilleurs designer·e·s savent diriger ces outils, pas juste les utiliser","La crise du logement au Québec = beaucoup de rénovations = beaucoup d'emplois","Les clients s'attendent maintenant à voir leurs espaces en réalité augmentée avant les travaux","Le design durable (matériaux écologiques, lumière naturelle, certification LEED) est devenu un standard"],en:["AI generates visual concepts in seconds — the best designers know how to direct these tools, not just use them","Quebec's housing crisis means more renovations, more jobs","Clients now expect to see their spaces in augmented reality before construction begins","Sustainable design (eco materials, natural light, LEED certification) is now standard, not a bonus"],es:["La IA genera conceptos visuales en segundos — los mejores diseñadores saben dirigir estas herramientas","La crisis habitacional en Quebec = más renovaciones = más empleos","Los clientes esperan ver sus espacios en realidad aumentada antes de las obras","El diseño sostenible (materiales ecológicos, luz natural, LEED) es ya un estándar"]}
    }
  },
  { id:'design-interieur-aec', code:'NTA.21', type:'AEC', dur:2, fac:'art', col:'#cdc19e', visible:true,
    url:{fr:'https://collegelasalle.lcieducation.com/fr/programmes-et-cours/aec-design-d-interieur',en:'https://lasallecollege.lcieducation.com/en/programs-and-courses/acs-interior-design'},
    decPair:'design-interieur-dec', aecPair:null,
    name:{fr:"Design d'intérieur",en:'Interior Design',es:'Diseño de interiores'},
    school:{fr:'Arts, design et communication',en:'Art, Design & Communication',es:'Artes, Diseño y Comunicación'},
    tags:['visual','creative','spatial','design','colors','shapes','people-needs','wellbeing','architecture'],
    detail:{
      what:{fr:"Même cœur de métier que le DEC mais en version accélérée, sans cours de formation générale. Tu conçois des espaces résidentiels et commerciaux de A à Z, logiciels inclus.",en:"Same core skills as the DCS but accelerated, without general education courses. You design residential and commercial spaces end-to-end, software included.",es:"El mismo núcleo del DCS pero acelerado, sin cursos de educación general. Diseñas espacios residenciales y comerciales de principio a fin."},
      where:{fr:"Firmes de design, agences de rénovation, commerces de détail, hôtellerie, à ton compte.",en:"Design firms, renovation agencies, retail, hospitality, self-employed.",es:"Estudios de diseño, agencias de renovación, comercio, hotelería, por cuenta propia."},
      titles:{fr:['Designer d\'intérieur','Consultant·e en aménagement','Visualiseur·se 3D','Coordinateur·trice de projet'],en:['Interior Designer','Space Planning Consultant','3D Visualizer','Project Coordinator'],es:['Diseñador/a de interiores','Consultor/a de espacios','Visualizador/a 3D','Coordinador/a de proyectos']},
      future:{fr:["Mêmes dynamiques que le DEC — crise du logement, IA, réalité augmentée, durabilité","L'AEC est particulièrement populaire auprès des professionnel·le·s qui changent de carrière","Le vieillissement de la population crée une forte demande en design d'espaces adaptés pour aîné·e·s"],en:["Same dynamics as the DCS — housing crisis, AI, augmented reality, sustainability","The ACS is especially popular among career changers who want to enter the market quickly","An aging population is driving strong demand for age-adapted space design"],es:["Mismas dinámicas que el DCS — crisis habitacional, IA, realidad aumentada, sostenibilidad","El AEC es especialmente popular entre quienes cambian de carrera","El envejecimiento de la población genera fuerte demanda de diseño adaptado para mayores"]}
    }
  },
  { id:'design-graphique', code:'NTA.1C', type:'AEC', dur:2, fac:'art', col:'#cdc19e', visible:true,
    url:{fr:'https://collegelasalle.lcieducation.com/fr/programmes-et-cours/aec-design-graphique',en:'https://lasallecollege.lcieducation.com/en/programs-and-courses/acs-graphic-design'},
    decPair:null, aecPair:null,
    name:{fr:'Design graphique',en:'Graphic Design',es:'Diseño gráfico'},
    school:{fr:'Arts, design et communication',en:'Art, Design & Communication',es:'Artes, Diseño y Comunicación'},
    tags:['visual','creative','digital','art','design','branding','colors','shapes','people-needs'],
    detail:{
      what:{fr:"Concevoir des identités visuelles, des emballages de produits, des affiches, des interfaces, des campagnes numériques et des contenus pour les médias sociaux.",en:"Design visual identities, product packaging, posters, interfaces, digital campaigns and social media content.",es:"Diseñar identidades visuales, packaging, carteles, interfaces, campañas digitales y contenidos para redes sociales."},
      where:{fr:"Agences de design et de publicité, studios créatifs, équipes marketing en entreprise, fabricants de produits de consommation, médias, à ton compte.",en:"Design and advertising agencies, creative studios, in-house marketing teams, consumer goods manufacturers, media, self-employed.",es:"Agencias de diseño y publicidad, estudios creativos, equipos de marketing, fabricantes de bienes de consumo, medios, por cuenta propia."},
      titles:{fr:['Designer graphique','Designer d\'emballage (packaging)','Concepteur·trice visuel·le','Designer UI junior','Directeur·trice artistique junior'],en:['Graphic Designer','Packaging Designer','Visual Designer','Junior UI Designer','Junior Art Director'],es:['Diseñador/a gráfico/a','Diseñador/a de packaging','Diseñador/a visual','Diseñador/a UI junior','Director/a artístico/a junior']},
      future:{fr:["Le design d'emballage est un secteur robuste — chaque produit vendu en épicerie ou en pharmacie a besoin d'un emballage conçu par quelqu'un","Les nouvelles exigences environnementales (emballages recyclables) créent une vague de refonte — opportunité concrète pour les jeunes designer·e·s","Les outils IA (Midjourney, Adobe Firefly) génèrent des visuels en secondes — les designer·e·s qui savent diriger ces outils sont plus demandé·e·s que jamais","Le motion design est devenu une compétence attendue, pas optionnelle","Montréal est un pôle créatif nord-américain reconnu — Sid Lee, lg2, Cossette recrutent régulièrement"],en:["Packaging design is a resilient sector — every product sold in a grocery or pharmacy needs packaging designed by someone","New environmental requirements (recyclable packaging) are driving a wave of redesigns — a concrete opportunity for young designers","AI tools generate visuals in seconds — designers who can direct and critique these tools are more in demand than ever","Motion design is now an expected skill, not optional","Montreal is a recognized North American creative hub — Sid Lee, lg2, Cossette regularly recruit graduates"],es:["El diseño de packaging es un sector sólido — cada producto en el supermercado necesita un diseño","Las nuevas exigencias medioambientales crean una ola de rediseños — oportunidad concreta","Las herramientas de IA generan visuales en segundos — los diseñadores que saben dirigirlas son los más demandados","El motion design ya es una habilidad esperada, no opcional","Montreal es un polo creativo norteamericano reconocido — Sid Lee, lg2, Cossette contratan regularmente"]}
    }
  },
  { id:'montage-video', code:'NWY.1D', type:'AEC', dur:2, fac:'art', col:'#cdc19e', visible:true,
    url:{fr:'https://collegelasalle.lcieducation.com/fr/programmes-et-cours/aec-montage-video',en:'https://lasallecollege.lcieducation.com/en/programs-and-courses/acs-video-editing'},
    decPair:null, aecPair:null,
    name:{fr:'Montage vidéo',en:'Video Editing',es:'Edición de video'},
    school:{fr:'Arts, design et communication',en:'Art, Design & Communication',es:'Artes, Diseño y Comunicación'},
    tags:['visual','creative','digital','video','audio','cinema','storytelling','technical','help-others'],
    detail:{
      what:{fr:"Assembler, rythmer et finaliser des contenus vidéo — documentaires, publicités, webséries, vidéos pour marques, contenu pour plateformes numériques.",en:"Assemble, pace and finalize video content — documentaries, ads, web series, branded videos, content for digital platforms.",es:"Montar, ritmar y finalizar contenidos de video — documentales, publicidad, series web, videos de marca, contenido para plataformas."},
      where:{fr:"Maisons de production, agences de contenu, chaînes de télévision, studios de création numérique, à ton compte en freelance.",en:"Production houses, content agencies, TV channels, digital creative studios, freelance.",es:"Productoras, agencias de contenido, cadenas de televisión, estudios digitales, freelance."},
      titles:{fr:['Monteur·se vidéo','Monteur·se de contenu numérique','Assistant·e éditeur·trice','Étalonniste junior','Créateur·trice de contenu pour marques'],en:['Video Editor','Digital Content Editor','Assistant Editor','Junior Colorist','Branded Content Creator'],es:['Editor/a de video','Editor/a de contenido digital','Asistente de edición','Colorista junior','Creador/a de contenido de marca']},
      future:{fr:["Montréal a une industrie audiovisuelle très active — Netflix, Amazon et Crave produisent localement","La demande en contenu court pour les médias sociaux a explosé — les marques ont besoin de monteur·se·s qui comprennent ces formats","L'IA commence à automatiser le montage de base — les monteur·se·s qui se distinguent apportent un jugement narratif que l'IA ne remplace pas","Le freelance est une réalité courante dans ce métier","Les compétences sont très transférables : publicité, documentaire, fiction, formation en ligne, contenu corporatif"],en:["Montreal has a very active audiovisual industry — Netflix, Amazon and Crave produce locally","Demand for short-form social media content has exploded — brands need editors who understand these formats","AI is starting to automate basic editing tasks — editors who stand out bring narrative judgment AI cannot replace","Freelancing is common in this field","Skills are highly transferable: advertising, documentary, fiction, e-learning, corporate content"],es:["Montreal tiene una industria audiovisual muy activa — Netflix, Amazon y Crave producen localmente","La demanda de contenido corto para redes sociales ha explotado","La IA empieza a automatizar el montaje básico — los editores que se distinguen aportan juicio narrativo","El freelance es una realidad común en este oficio","Las habilidades son muy transferibles entre publicidad, documental, ficción y contenido corporativo"]}
    }
  },

  // ── Gaming, Animation & VFX ──
  { id:'uiux-dec', code:'574.CX', type:'DEC', dur:3, fac:'game', col:'#f2f537', visible:true,
    url:{fr:'https://collegelasalle.lcieducation.com/fr/programmes-et-cours/dec-production-3d-et-synthese-d-images',en:'https://lasallecollege.lcieducation.com/en/programs-and-courses/dcs-3d-production-and-image-synthesis'},
    decPair:null, aecPair:null,
    name:{fr:'Production 3D et synthèse d\'images – Profil UI/UX',en:'3D Production & Image Synthesis – UI/UX Design',es:'Producción 3D y síntesis de imágenes – UI/UX'},
    school:{fr:'Jeux vidéo, animation et VFX',en:'Gaming, Animation & VFX',es:'Videojuegos, Animación y VFX'},
    tags:['visual','creative','interactive','ux','3d','psychology','tech','code','spatial','immersive','systems','people-needs','colors','shapes','wellbeing','design'],
    detail:{
      what:{fr:"Concevoir des interfaces interactives et des environnements visuels immersifs — pour des jeux vidéo, des applications, des simulations industrielles ou des expériences web.",en:"Design interactive interfaces and immersive visual environments — for video games, apps, industrial simulations or web experiences.",es:"Diseñar interfaces interactivas y entornos visuales inmersivos — para videojuegos, aplicaciones, simulaciones industriales o experiencias web."},
      where:{fr:"Studios de jeux vidéo, agences numériques, entreprises tech, firmes de design UX, startups, à ton compte.",en:"Video game studios, digital agencies, tech companies, UX design firms, startups, self-employed.",es:"Estudios de videojuegos, agencias digitales, empresas tech, firmas de UX, startups, por cuenta propia."},
      titles:{fr:['Designer UI/UX','Artiste technique','Concepteur·trice d\'expériences interactives','Designer de produits numériques','Intégrateur·trice web créatif·ve'],en:['UI/UX Designer','Technical Artist','Interactive Experience Designer','Digital Product Designer','Creative Web Integrator'],es:['Diseñador/a UI/UX','Artista técnico/a','Diseñador/a de experiencias interactivas','Diseñador/a de productos digitales','Integrador/a web creativo/a']},
      future:{fr:["L'IA génère des interfaces et des visuels — les UI/UX designers qui savent diriger et critiquer ces outils sont les plus demandé·e·s","Montréal est le 3e pôle mondial du jeu vidéo — les débouchés locaux sont excellents","La réalité augmentée et les interfaces spatiales créent des nouveaux métiers que ce programme prépare directement","Les entreprises de tous les secteurs (santé, finance, transport) recrutent des UI/UX designers"],en:["AI generates interfaces and visuals — UI/UX designers who can direct and critique these tools are most in demand","Montreal is the world's 3rd largest video game hub — local job prospects are excellent","Augmented reality and spatial interfaces are creating new roles this program prepares you for directly","Companies in every sector (health, finance, transport) are hiring UI/UX designers"],es:["La IA genera interfaces y visuales — los diseñadores UI/UX que saben dirigir estas herramientas son los más demandados","Montreal es el 3er polo mundial del videojuego — excelentes salidas locales","La realidad aumentada y las interfaces espaciales crean nuevos empleos que este programa prepara directamente","Empresas de todos los sectores (salud, finanzas, transporte) contratan diseñadores UI/UX"]}
    }
  },
  { id:'jeux-dec', code:'420.BX', type:'DEC', dur:3, fac:'game', col:'#f2f537', visible:true,
    url:{fr:'https://collegelasalle.lcieducation.com/fr/programmes-et-cours/dec-techniques-de-l-informatique-programmation-en-jeux-video',en:'https://lasallecollege.lcieducation.com/en/programs-and-courses/dcs-computer-science-technology-video-game-programming'},
    decPair:null, aecPair:'cisco',
    name:{fr:'Techniques de l\'informatique – Programmation en jeux vidéo',en:'Computer Science – Video Game Programming',es:'Técnicas de informática – Programación de videojuegos'},
    school:{fr:'Jeux vidéo, animation et VFX',en:'Gaming, Animation & VFX',es:'Videojuegos, Animación y VFX'},
    tags:['tech','code','games','logic','interactive','storytelling','systems','abstraction','video','audio'],
    detail:{
      what:{fr:"Écrire le code qui fait tourner les jeux — moteurs, physique, IA des personnages, multijoueur. Tu travailles en équipe avec des artistes et des designers sur des projets jouables réels.",en:"Write the code that makes games run — engines, physics, character AI, multiplayer. You work with artists and designers on real playable projects.",es:"Escribir el código que hace funcionar los juegos — motores, física, IA de personajes, multijugador. Trabajas en equipo con artistas y diseñadores."},
      where:{fr:"Studios locaux (Ubisoft, Behaviour, WB Games), petits studios indépendants, en freelance, ou dans des secteurs connexes comme la simulation ou la santé numérique.",en:"Local studios (Ubisoft, Behaviour, WB Games), small indie studios, freelance, or adjacent fields like simulation or digital health.",es:"Estudios locales (Ubisoft, Behaviour, WB Games), pequeños estudios indie, freelance, o sectores conexos como simulación o salud digital."},
      titles:{fr:['Programmeur·se gameplay','Développeur·se de moteur','Programmeur·se IA','Développeur·se généraliste','Freelance / développeur·se indépendant·e'],en:['Gameplay Programmer','Engine Developer','AI Programmer','Generalist Developer','Freelance / Indie Developer'],es:['Programador/a gameplay','Desarrollador/a de motor','Programador/a IA','Desarrollador/a generalista','Freelance / desarrollador/a independiente']},
      future:{fr:["L'industrie du jeu vidéo à Montréal est en turbulence — vagues de mises à pied, crédits d'impôt provinciaux en baisse jusqu'en 2028","Les petits studios indépendants souffrent particulièrement mais restent nombreux et créatifs","Les programmeur·se·s qui savent aussi développer des apps ou des simulations trouvent du travail plus facilement — les compétences sont très transférables","L'IA génère du code et des niveaux automatiquement — les programmeur·se·s qui maîtrisent ces outils restent indispensables","Lancer son propre jeu indépendant (Steam, itch.io) est une voie réelle pour beaucoup de diplômé·e·s"],en:["Montreal's video game industry is turbulent — layoffs, provincial tax credits declining through 2028","Small indie studios are hit hardest but remain numerous and creative","Programmers who can also build apps or simulations find work more easily — skills are very transferable","AI generates code and levels automatically — programmers who master these tools remain essential","Launching an indie game (Steam, itch.io) is a real path for many graduates"],es:["La industria del videojuego en Montreal está en turbulencia — despidos, créditos fiscales provinciales en baja hasta 2028","Los pequeños estudios indie sufren especialmente pero siguen siendo numerosos y creativos","Los programadores que también pueden desarrollar apps o simulaciones encuentran trabajo más fácilmente","La IA genera código y niveles automáticamente — los programadores que dominan estas herramientas siguen siendo esenciales","Lanzar tu propio juego indie (Steam, itch.io) es una vía real para muchos graduados"]}
    }
  },
  { id:'design-jeux', code:'NTL.1H', type:'AEC', dur:2, fac:'game', col:'#f2f537', visible:true,
    url:{fr:'https://collegelasalle.lcieducation.com/fr/programmes-et-cours/aec-design-de-jeux-et-de-niveaux',en:'https://lasallecollege.lcieducation.com/en/programs-and-courses/acs-game-and-level-design'},
    decPair:'uiux-dec', aecPair:null,
    name:{fr:'Design de jeux et de niveaux',en:'Game & Level Design',es:'Diseño de juegos y niveles'},
    school:{fr:'Jeux vidéo, animation et VFX',en:'Gaming, Animation & VFX',es:'Videojuegos, Animación y VFX'},
    tags:['games','creative','logic','design','storytelling','interactive','systems','video','audio','empower-others'],
    detail:{
      what:{fr:"Concevoir les règles, les mécaniques, les niveaux et l'expérience globale d'un jeu vidéo. Tu documentes tes idées, crées des prototypes et travailles avec des programmeur·se·s et des artistes.",en:"Design the rules, mechanics, levels and overall experience of a video game. You document ideas, build prototypes and work with programmers and artists.",es:"Diseñar las reglas, mecánicas, niveles y experiencia global de un videojuego. Documentas ideas, creas prototipos y trabajas con programadores y artistas."},
      where:{fr:"Studios de jeux vidéo, studios indépendants, entreprises de formation interactive (serious games), à ton compte.",en:"Video game studios, indie studios, interactive training companies (serious games), self-employed.",es:"Estudios de videojuegos, estudios indie, empresas de formación interactiva (serious games), por cuenta propia."},
      titles:{fr:['Game designer junior','Level designer','Narrative designer','Concepteur·trice UX de jeu','Producteur·trice associé·e'],en:['Junior Game Designer','Level Designer','Narrative Designer','Game UX Designer','Associate Producer'],es:['Diseñador/a de juegos junior','Diseñador/a de niveles','Diseñador/a narrativo/a','Diseñador/a UX de juego','Productor/a asociado/a']},
      future:{fr:["Même contexte difficile que la programmation de jeux — mises à pied, crédits d'impôt en baisse, industrie en restructuration","Le game design est l'un des postes les plus compétitifs — un portfolio de projets jouables est indispensable","Les jeux indépendants sont une voie sérieuse — Red Barrels (Outlast) et Behaviour ont commencé petit","L'IA génère des niveaux et des quêtes procéduralement — les designer·e·s qui supervisent ces systèmes ont un avantage","Les compétences en game design sont valorisées hors du jeu : apps d'apprentissage, simulations d'entraînement"],en:["Same difficult context as game programming — layoffs, declining tax credits, industry restructuring","Game design is one of the most competitive roles — a portfolio of playable projects is essential","Indie games are a serious path — Red Barrels (Outlast) and Behaviour started small","AI generates levels and quests procedurally — designers who can oversee these systems have an edge","Game design skills are valued outside games: learning apps, training simulations"],es:["Mismo contexto difícil que la programación de juegos — despidos, créditos fiscales en baja","El game design es uno de los puestos más competitivos — un portfolio de proyectos jugables es indispensable","Los juegos indie son una vía seria — Red Barrels y Behaviour empezaron pequeños","La IA genera niveles y misiones proceduralmente — los diseñadores que supervisan estos sistemas tienen ventaja","Las habilidades en game design se valoran fuera del juego: apps educativas, simulaciones de formación"]}
    }
  },
  // Animation 3D — hidden (visible:false), data kept
  { id:'animation-3d', code:'NWE.1B', type:'AEC', dur:2, fac:'game', col:'#f2f537', visible:false,
    url:{fr:'https://collegelasalle.lcieducation.com/fr/programmes-et-cours/aec-animation-3d-pour-la-television-et-le-cinema',en:'https://lasallecollege.lcieducation.com/en/programs-and-courses/acs-3d-animation'},
    decPair:null, aecPair:null,
    name:{fr:'Animation 3D pour la télévision et le cinéma',en:'3D Animation for TV & Film',es:'Animación 3D para televisión y cine'},
    school:{fr:'Jeux vidéo, animation et VFX',en:'Gaming, Animation & VFX',es:'Videojuegos, Animación y VFX'},
    tags:['visual','creative','art','3d','cinema','storytelling','characters','video','audio'],
    detail:{ what:{fr:'—',en:'—',es:'—'}, where:{fr:'—',en:'—',es:'—'}, titles:{fr:[],en:[],es:[]}, future:{fr:[],en:[],es:[]} }
  },

  // ── Information Technology ──
  { id:'prog-dec', code:'420.BP', type:'DEC', dur:3, fac:'tech', col:'#685ef7', visible:true,
    url:{fr:'https://collegelasalle.lcieducation.com/fr/programmes-et-cours/dec-techniques-de-l-informatique-programmation',en:'https://lasallecollege.lcieducation.com/en/programs-and-courses/dcs-computer-science-technology-programming'},
    decPair:null, aecPair:'programmeur-analyste',
    name:{fr:'Techniques de l\'informatique – Programmation',en:'Computer Science Technology – Programming',es:'Técnicas de informática – Programación'},
    school:{fr:'Technologies de l\'information',en:'Information Technology',es:'Tecnologías de la información'},
    tags:['tech','code','logic','systems','web','new-products','automate','abstraction','databases'],
    detail:{
      what:{fr:"Développer des applications web, mobiles (iOS et Android) et d'entreprise — de l'analyse des besoins jusqu'au déploiement. Tu apprends à coder proprement, en équipe, avec les méthodes Agile et les outils de l'industrie.",en:"Develop web, mobile (iOS and Android) and enterprise applications — from needs analysis to deployment. You learn to code cleanly, in a team, using Agile methods and industry tools.",es:"Desarrollar aplicaciones web, móviles (iOS y Android) y empresariales — desde el análisis de necesidades hasta el despliegue. Aprendes a codificar limpiamente, en equipo, con métodos Agile."},
      where:{fr:"Agences numériques, entreprises tech, startups, institutions financières, gouvernement, santé numérique, à ton compte en freelance.",en:"Digital agencies, tech companies, startups, financial institutions, government, digital health, freelance.",es:"Agencias digitales, empresas tech, startups, instituciones financieras, gobierno, salud digital, freelance."},
      titles:{fr:['Développeur·se web','Développeur·se mobile','Développeur·se fullstack','Analyste-programmeur·se','Développeur·se indépendant·e'],en:['Web Developer','Mobile Developer','Fullstack Developer','Programmer-Analyst','Indie/Freelance Developer'],es:['Desarrollador/a web','Desarrollador/a móvil','Desarrollador/a fullstack','Analista-programador/a','Desarrollador/a independiente']},
      future:{fr:["La demande en développeur·se·s au Québec reste parmi les plus stables du marché tech — presque tous les secteurs recrutent","L'IA (GitHub Copilot, Cursor, Claude) change la façon de coder — les développeur·se·s qui utilisent ces outils livrent plus vite et sont plus demandé·e·s","Le développement mobile multiplateforme (React Native, Flutter) est devenu un standard — ce programme y prépare directement","Les compétences sont hautement transférables — des jeux vidéo à la santé en passant par la finance","Contrairement au jeu vidéo, ce secteur est peu exposé aux cycles de mises à pied massives"],en:["Demand for developers in Quebec remains among the most stable in the tech market — almost every sector recruits","AI (GitHub Copilot, Cursor, Claude) is changing how we code — developers who use these tools ship faster and are more in demand","Cross-platform mobile development (React Native, Flutter) is now standard — this program prepares you directly","Skills are highly transferable — from video games to healthcare to finance","Unlike the game industry, this sector is largely shielded from mass layoff cycles"],es:["La demanda de desarrolladores en Quebec es de las más estables del mercado tech","La IA (GitHub Copilot, Cursor, Claude) cambia la forma de codificar — los que usan estas herramientas son más demandados","El desarrollo móvil multiplataforma (React Native, Flutter) es ya estándar","Las habilidades son muy transferibles — de videojuegos a salud o finanzas","A diferencia del videojuego, este sector está poco expuesto a los ciclos de despidos masivos"]}
    }
  },
  { id:'reseaux-dec', code:'420.B0', type:'DEC', dur:3, fac:'tech', col:'#685ef7', visible:true,
    url:{fr:'https://collegelasalle.lcieducation.com/fr/programmes-et-cours/dec-techniques-de-l-informatique-gestion-de-reseaux-et-securite',en:'https://lasallecollege.lcieducation.com/en/programs-and-courses/dcs-computer-science-technology-network-and-security-management'},
    decPair:null, aecPair:null,
    name:{fr:'Techniques de l\'informatique – Gestion de réseaux et sécurité',en:'Computer Science – Network Management & Security',es:'Técnicas de informática – Gestión de redes y seguridad'},
    school:{fr:'Technologies de l\'information',en:'Information Technology',es:'Tecnologías de la información'},
    tags:['tech','networks','security','systems','infrastructure','logic','configure','optimize','abstraction'],
    detail:{
      what:{fr:"Installer, configurer et sécuriser les infrastructures réseau des organisations — serveurs, routeurs, pare-feux, VPN, services cloud. De plus en plus, ton rôle est de défendre ces systèmes contre des attaques de plus en plus sophistiquées.",en:"Install, configure and secure organizational network infrastructure — servers, routers, firewalls, VPNs, cloud services. Increasingly, your role is defending these systems against ever more sophisticated attacks.",es:"Instalar, configurar y asegurar infraestructuras de red — servidores, routers, firewalls, VPNs, servicios cloud. Cada vez más, tu rol es defender estos sistemas contra ataques sofisticados."},
      where:{fr:"Entreprises de toutes tailles, gouvernement, hôpitaux, fournisseurs de services gérés (MSP), firmes de cybersécurité, forces de l'ordre (cybercriminalité).",en:"Organizations of all sizes, government, hospitals, managed service providers (MSPs), cybersecurity firms, law enforcement (cybercrime).",es:"Organizaciones de todos los tamaños, gobierno, hospitales, proveedores de servicios gestionados (MSP), firmas de ciberseguridad."},
      titles:{fr:['Analyste en cybersécurité','Administrateur·trice réseau','Testeur·se d\'intrusion (pentester)','Spécialiste cloud','Ingénieur·e en sécurité des systèmes'],en:['Cybersecurity Analyst','Network Administrator','Penetration Tester (Pentester)','Cloud Specialist','Systems Security Engineer'],es:['Analista en ciberseguridad','Administrador/a de redes','Tester de intrusión (pentester)','Especialista cloud','Ingeniero/a de seguridad de sistemas']},
      future:{fr:["Le Québec a subi des cyberattaques majeures ces dernières années (hôpitaux, municipalités) — la demande en spécialistes est en hausse directe","La cybersécurité est maintenant une priorité dans pratiquement toutes les organisations","Les rançongiciels et attaques sur les infrastructures critiques sont en augmentation mondiale","L'IA est utilisée des deux côtés : par les attaquant·e·s pour automatiser les attaques, et par les défenseur·e·s pour les détecter","Pénurie chronique dans ce domaine — les perspectives d'emploi à la sortie sont parmi les meilleures du Collège"],en:["Quebec has suffered major cyberattacks in recent years (hospitals, municipalities) — specialist demand is rising directly","Cybersecurity is now a priority in virtually every organization","Ransomware and attacks on critical infrastructure are increasing globally","AI is used on both sides: by attackers to automate attacks, and defenders to detect them","Chronic shortage in this field — job prospects upon graduation are among the best at the College"],es:["Quebec ha sufrido importantes ciberataques recientes (hospitales, municipios) — la demanda de especialistas crece directamente","La ciberseguridad es ahora una prioridad en prácticamente todas las organizaciones","Los ransomware y ataques a infraestructuras críticas aumentan globalmente","La IA se usa en ambos lados: atacantes y defensores","Escasez crónica en este campo — las perspectivas de empleo son de las mejores del Colegio"]}
    }
  },
  { id:'gestion-dec', code:'420.B0', type:'DEC', dur:3, fac:'tech', col:'#685ef7', visible:false,
    url:{fr:'https://collegelasalle.lcieducation.com/fr/programmes-et-cours/dec-techniques-de-l-informatique-informatique-de-gestion',en:'https://lasallecollege.lcieducation.com/en/programs-and-courses/dcs-computer-science-technology-business-data-processing'},
    decPair:null, aecPair:'bi',
    name:{fr:'Techniques de l\'informatique – Informatique de gestion',en:'Computer Science – Business IT',es:'Técnicas de informática – Gestión'},
    school:{fr:'Technologies de l\'information',en:'Information Technology',es:'Tecnologías de la información'},
    tags:['tech','code','business','systems','databases','management','lead-teams','efficiency','automate'],
    detail:{
      what:{fr:"Faire le pont entre la technologie et les affaires — implanter des systèmes d'information, analyser les besoins des équipes, gérer des projets TI et améliorer l'efficacité des organisations.",en:"Bridge technology and business — implement information systems, analyse team needs, manage IT projects and improve organisational efficiency.",es:"Tender puentes entre tecnología y negocio — implementar sistemas de información, analizar necesidades de equipos, gestionar proyectos TI y mejorar la eficiencia organizacional."},
      where:{fr:"Entreprises de services, cabinets-conseils, institutions financières, gouvernement, commerces de détail, tout secteur utilisant des logiciels de gestion.",en:"Service companies, consulting firms, financial institutions, government, retail — any sector using management software (which is everyone).",es:"Empresas de servicios, consultoras, instituciones financieras, gobierno, comercio minorista — cualquier sector que use software de gestión."},
      titles:{fr:['Analyste en systèmes d\'information','Consultant·e ERP junior','Chargé·e de projet TI','Analyste fonctionnel·le','Coordinateur·trice de transformation numérique'],en:['Information Systems Analyst','Junior ERP Consultant','IT Project Manager','Functional Analyst','Digital Transformation Coordinator'],es:['Analista de sistemas de información','Consultor/a ERP junior','Gestor/a de proyectos TI','Analista funcional','Coordinador/a de transformación digital']},
      future:{fr:["Chaque organisation au Québec est en train de se numériser — quelqu'un doit coordonner cette transformation","Les outils SaaS (Salesforce, Microsoft 365, SAP, ServiceNow) sont omniprésents — les diplômé·e·s qui les maîtrisent sont immédiatement employables","L'IA s'intègre dans tous les logiciels de gestion — savoir configurer et superviser ces outils devient une compétence clé","Profil idéal pour évoluer vers la gestion d'équipes TI ou la direction de projets","Moins exposé aux cycles de mises à pied que le secteur des jeux vidéo"],en:["Every organization in Quebec is undergoing digital transformation — someone must coordinate this shift","SaaS tools (Salesforce, Microsoft 365, SAP, ServiceNow) are everywhere — graduates who master them are immediately employable","AI is being integrated into all management software — knowing how to configure and oversee these tools is a key skill","Ideal profile for growing into IT team management or project leadership","Less exposed to mass layoff cycles than the video game sector"],es:["Cada organización en Quebec está digitalizándose — alguien debe coordinar esta transformación","Las herramientas SaaS (Salesforce, SAP, ServiceNow) están en todas partes — los graduados que las dominan son inmediatamente empleables","La IA se integra en todos los softwares de gestión — configurarla y supervisarla es una habilidad clave","Perfil ideal para crecer hacia la gestión de equipos TI o la dirección de proyectos","Menos expuesto a los ciclos de despidos masivos que el sector del videojuego"]}
    }
  },
  { id:'programmeur-analyste', code:'LEA.3Q', type:'AEC', dur:2, fac:'tech', col:'#685ef7', visible:true,
    url:{fr:'https://collegelasalle.lcieducation.com/fr/programmes-et-cours/aec-programmeur-analyste-en-technologie-de-l-information',en:'https://lasallecollege.lcieducation.com/en/programs-and-courses/acs-information-technology-programmer-analyst'},
    decPair:'prog-dec', aecPair:null,
    name:{fr:'Programmeur-analyste en Technologies de l\'information',en:'IT Programmer-Analyst',es:'Programador-analista en TI'},
    school:{fr:'Technologies de l\'information',en:'Information Technology',es:'Tecnologías de la información'},
    tags:['tech','code','logic','databases','systems','web','new-products','automate','abstraction'],
    detail:{
      what:{fr:"Développer des applications, analyser les besoins des utilisateur·trice·s et écrire le code qui résout des problèmes concrets. Tu travailles sur le web, les applications d'entreprise et les systèmes internes.",en:"Develop applications, analyse user needs and write code that solves concrete problems. You work on web, enterprise applications and internal systems.",es:"Desarrollar aplicaciones, analizar las necesidades de los usuarios y escribir código que resuelve problemas concretos."},
      where:{fr:"Entreprises de toutes tailles, agences numériques, institutions financières, gouvernement, startups, à ton compte.",en:"Organizations of all sizes, digital agencies, financial institutions, government, startups, freelance.",es:"Organizaciones de todos los tamaños, agencias digitales, instituciones financieras, gobierno, startups, freelance."},
      titles:{fr:['Développeur·se web','Développeur·se d\'applications','Analyste-programmeur·se','Développeur·se fullstack junior','Développeur·se backend'],en:['Web Developer','Application Developer','Programmer-Analyst','Junior Fullstack Developer','Backend Developer'],es:['Desarrollador/a web','Desarrollador/a de aplicaciones','Analista-programador/a','Desarrollador/a fullstack junior','Desarrollador/a backend']},
      future:{fr:["La demande en développeur·se·s au Québec reste forte dans presque tous les secteurs","L'IA change la façon de coder — les développeur·se·s qui utilisent ces outils intelligemment livrent plus vite","Le profil est particulièrement recherché dans les services financiers, l'assurance et le gouvernement","L'AEC est idéale pour une reconversion rapide — beaucoup de diplômé·e·s trouvent du travail dans les 6 mois"],en:["Demand for developers in Quebec remains strong across almost every sector","AI is changing how we code — developers who use these tools intelligently ship faster","This profile is particularly sought after in financial services, insurance and government","The ACS is ideal for a quick career change — many graduates find work within 6 months"],es:["La demanda de desarrolladores en Quebec sigue siendo fuerte en casi todos los sectores","La IA cambia la forma de codificar — los que usan estas herramientas inteligentemente son más productivos","El perfil es especialmente buscado en servicios financieros, seguros y gobierno","El AEC es ideal para una reconversión rápida — muchos graduados encuentran trabajo en 6 meses"]}
    }
  },
  { id:'ia-ml', code:'LEA.DQ', type:'AEC', dur:2, fac:'tech', col:'#685ef7', visible:true,
    url:{fr:'https://collegelasalle.lcieducation.com/fr/programmes-et-cours/aec-intelligence-artificielle-et-apprentissage-automatique',en:'https://lasallecollege.lcieducation.com/en/programs-and-courses/acs-artificial-intelligence-and-machine-learning'},
    decPair:'prog-dec', aecPair:null,
    name:{fr:'Intelligence artificielle et apprentissage automatique',en:'Artificial Intelligence & Machine Learning',es:'IA y aprendizaje automático'},
    school:{fr:'Technologies de l\'information',en:'Information Technology',es:'Tecnologías de la información'},
    tags:['tech','code','data','logic','ai','math','systems','abstraction','create-tech','insights'],
    detail:{
      what:{fr:"Construire, entraîner et déployer des modèles d'IA — classification, prédiction, traitement du langage, vision par ordinateur. Tu transformes des données brutes en systèmes intelligents.",en:"Build, train and deploy AI models — classification, prediction, natural language processing, computer vision. You transform raw data into intelligent systems.",es:"Construir, entrenar y desplegar modelos de IA — clasificación, predicción, procesamiento del lenguaje, visión por computadora."},
      where:{fr:"Entreprises tech, startups IA, institutions financières, santé numérique, transport, médias, cabinets-conseils.",en:"Tech companies, AI startups, financial institutions, digital health, transportation, media, consulting firms.",es:"Empresas tech, startups de IA, instituciones financieras, salud digital, transporte, medios, consultoras."},
      titles:{fr:['Développeur·se IA/ML','Ingénieur·e MLOps','Scientifique des données junior','Analyste de données','Développeur·se d\'applications IA'],en:['AI/ML Developer','MLOps Engineer','Junior Data Scientist','Data Analyst','AI Application Developer'],es:['Desarrollador/a IA/ML','Ingeniero/a MLOps','Científico/a de datos junior','Analista de datos','Desarrollador/a de aplicaciones IA']},
      future:{fr:["Montréal est un centre mondial de la recherche en IA grâce à Mila — les débouchés locaux sont excellents","L'IA générative (LLMs, images, vidéo) a transformé l'industrie en deux ans — ce programme prépare à construire ces systèmes, pas seulement les utiliser","C'est l'un des profils les mieux rémunérés à la sortie d'un programme collégial au Québec","La demande dépasse largement l'offre de diplômé·e·s — le marché est loin d'être saturé","Les compétences mathématiques sont importantes — ce programme est plus exigeant que la moyenne"],en:["Montreal is a global AI research hub thanks to Mila — local job prospects are excellent","Generative AI (LLMs, images, video) has transformed the industry in two years — this program prepares you to build these systems, not just use them","This is one of the best-paid profiles upon graduating from a college program in Quebec","Demand far exceeds the supply of graduates — the market is far from saturated","Strong math skills are important — this program is more demanding than average, but the prospects are worth it"],es:["Montreal es un centro mundial de investigación en IA gracias a Mila — excelentes salidas locales","La IA generativa ha transformado la industria en dos años — este programa prepara para construir estos sistemas","Es uno de los perfiles mejor remunerados al salir de un programa colegial en Quebec","La demanda supera con creces la oferta de graduados — el mercado está lejos de estar saturado","Se requieren sólidas bases matemáticas — este programa es más exigente que la media"]}
    }
  },
  { id:'bi', code:'LEAD7', type:'AEC', dur:2, fac:'tech', col:'#685ef7', visible:true,
    url:{fr:'https://collegelasalle.lcieducation.com/fr/programmes-et-cours/aec-specialisation-en-intelligence-d-entreprise',en:'https://lasallecollege.lcieducation.com/en/programs-and-courses/acs-specialization-in-business-intelligence'},
    decPair:'gestion-dec', aecPair:null,
    name:{fr:'Spécialisation en intelligence d\'entreprise (Business Intelligence)',en:'Business Intelligence',es:'Inteligencia empresarial (BI)'},
    school:{fr:'Technologies de l\'information',en:'Information Technology',es:'Tecnologías de la información'},
    tags:['tech','data','business','management','systems','logic','insights','efficiency'],
    detail:{
      what:{fr:"Extraire, transformer et visualiser des données d'entreprise pour aider les organisations à prendre de meilleures décisions. Tu construis des tableaux de bord, des rapports et des pipelines de données.",en:"Extract, transform and visualise enterprise data to help organisations make better decisions. You build dashboards, reports and data pipelines.",es:"Extraer, transformar y visualizar datos empresariales para ayudar a las organizaciones a tomar mejores decisiones. Construyes dashboards, reportes y pipelines de datos."},
      where:{fr:"Entreprises de toutes tailles, services financiers, commerce de détail, santé, gouvernement, cabinets-conseils en données.",en:"Organizations of all sizes, financial services, retail, healthcare, government, data consulting firms.",es:"Organizaciones de todos los tamaños, servicios financieros, comercio minorista, salud, gobierno, consultoras de datos."},
      titles:{fr:['Analyste BI','Développeur·se de rapports','Analyste de données','Gestionnaire de données','Spécialiste Tableau / Power BI'],en:['BI Analyst','Report Developer','Data Analyst','Data Manager','Tableau / Power BI Specialist'],es:['Analista BI','Desarrollador/a de reportes','Analista de datos','Gestor/a de datos','Especialista Tableau / Power BI']},
      future:{fr:["Chaque organisation génère des masses de données et très peu savent les lire — les analyste BI sont très recherchés","Power BI et Tableau sont devenus aussi courants que Excel — les diplômé·e·s qui les maîtrisent sont immédiatement employables","L'IA s'intègre dans les outils BI (Copilot dans Power BI, Tableau AI) — savoir collaborer avec ces fonctions est un avantage","Les données climatiques et ESG sont devenues une priorité — nouveau domaine d'application direct","Profil très stable, peu exposé aux cycles de mises à pied — la donnée est utile dans tous les secteurs"],en:["Every organization generates masses of data but few can read it — BI analysts are highly sought after","Power BI and Tableau are now as common as Excel — graduates who master them are immediately employable","AI is integrating into BI tools (Copilot in Power BI, Tableau AI) — knowing how to work with these features is an advantage","Climate and ESG data has become a priority — a new direct application domain","Very stable profile, little exposure to layoff cycles — data is useful in every sector"],es:["Cada organización genera masas de datos pero pocas saben leerlos — los analistas BI son muy buscados","Power BI y Tableau son tan comunes como Excel — los graduados que los dominan son inmediatamente empleables","La IA se integra en las herramientas BI — saber colaborar con estas funciones es una ventaja","Los datos climáticos y ESG se han convertido en prioridad — nuevo campo de aplicación","Perfil muy estable, poco expuesto a los ciclos de despidos — los datos son útiles en todos los sectores"]}
    }
  },
  { id:'cisco', code:'LEA.99', type:'AEC', dur:1.5, fac:'tech', col:'#685ef7', visible:true,
    url:{fr:'https://collegelasalle.lcieducation.com/fr/programmes-et-cours/aec-installation-et-administration-de-reseaux',en:'https://lasallecollege.lcieducation.com/en/programs-and-courses/acs-network-management'},
    decPair:'jeux-dec', aecPair:null,
    name:{fr:'Installation et administration de réseaux',en:'Network Installation and Administration',es:'Instalación y administración de redes'},
    school:{fr:'Technologies de l\'information',en:'Information Technology',es:'Tecnologías de la información'},
    tags:['tech','networks','security','infrastructure','systems','configure','optimize'],
    detail:{
      what:{fr:"Installer, configurer et gérer des infrastructures réseau en entreprise avec les technologies CISCO, Microsoft et Linux. Tu prépares plusieurs certifications reconnues mondialement — CCNA, CCNP, CompTIA A+ et LPIC.",en:"Install, configure and manage enterprise network infrastructure using CISCO, Microsoft and Linux technologies. You prepare for globally recognised certifications — CCNA, CCNP, CompTIA A+ and LPIC.",es:"Instalar, configurar y gestionar infraestructuras de red empresarial con tecnologías CISCO, Microsoft y Linux. Te preparas para certificaciones reconocidas mundialmente — CCNA, CCNP, CompTIA A+ y LPIC."},
      where:{fr:"Fournisseurs de services gérés (MSP), entreprises de toutes tailles, gouvernement, télécommunications, firmes de cybersécurité.",en:"Managed service providers (MSPs), organizations of all sizes, government, telecommunications, cybersecurity firms.",es:"Proveedores de servicios gestionados (MSP), organizaciones de todos los tamaños, gobierno, telecomunicaciones, firmas de ciberseguridad."},
      titles:{fr:['Administrateur·trice réseau','Gestionnaire de réseau','Technicien·ne support niveau 2/3','Spécialiste CISCO','Analyste en sécurité réseau'],en:['Network Administrator','Network Manager','Level 2/3 Support Technician','CISCO Specialist','Network Security Analyst'],es:['Administrador/a de redes','Gestor/a de redes','Técnico/a de soporte nivel 2/3','Especialista CISCO','Analista de seguridad de redes']},
      future:{fr:["La cybersécurité est en forte croissance — les spécialistes réseau qui comprennent aussi la sécurité sont particulièrement demandé·e·s","Les certifications CCNA et CCNP sont reconnues mondialement — elles ouvrent des portes bien au-delà du Québec","La migration vers les réseaux définis par logiciel (SD-WAN) et le cloud transforme le métier","Les cyberattaques contre les infrastructures critiques sont en hausse — les défenseur·e·s de réseaux sont de plus en plus essentiels","Pénurie chronique de technicien·ne·s réseau qualifié·e·s — les perspectives d'emploi sont excellentes"],en:["Cybersecurity is growing strongly — network specialists who also understand security are particularly in demand","CCNA and CCNP certifications are recognised worldwide — they open doors well beyond Quebec","Migration to software-defined networking (SD-WAN) and cloud is transforming the field","Cyberattacks on critical infrastructure are increasing — network defenders are increasingly essential","Chronic shortage of qualified network technicians — job prospects are excellent"],es:["La ciberseguridad crece con fuerza — los especialistas de redes que también entienden seguridad son muy demandados","Las certificaciones CCNA y CCNP son reconocidas mundialmente — abren puertas mucho más allá de Quebec","La migración hacia redes definidas por software (SD-WAN) y cloud transforma el oficio","Los ataques a infraestructuras críticas aumentan — los defensores de redes son cada vez más esenciales","Escasez crónica de técnicos de redes cualificados — excelentes perspectivas de empleo"]}
    }
  },
];

/* ═══════════════════════════════════════════
   DEDUPLICATION PAIRS
   If the DEC in pair appears in top3,
   remove its aecPair from eligible.
═══════════════════════════════════════════ */
// Built from PROGS data — decPair on AEC means "remove me if this DEC is in top3"
// aecPair on DEC means "remove this AEC if I'm in top3"

/* ═══════════════════════════════════════════
   PROFILE STEPS
═══════════════════════════════════════════ */
const PSTEPS = [
  { id:'status',
    q:{fr:'Quel est ton statut au Canada ?',en:'What is your status in Canada?',es:'¿Cuál es tu estatus en Canadá?'},
    opts:[
      {val:'citizen', icon:'🍁', l:{fr:'Citoyen·ne ou résident·e permanent·e',en:'Citizen or permanent resident',es:'Ciudadano/a o residente permanente'}},
      {val:'intl',    icon:'✈',  l:{fr:'Étudiant·e international·e',en:'International student',es:'Estudiante internacional'},
                                 s:{fr:'Sans citoyenneté ni résidence permanente',en:'Without citizenship or permanent residency',es:'Sin ciudadanía ni residencia permanente'}},
    ]},
  { id:'education',
    q:{fr:"Quel est ton niveau d'études complété ?",en:'What is your highest completed level of education?',es:'¿Cuál es tu nivel de estudios completado?'},
    opts:[
      {val:'hs_qc',    icon:'🏫', l:{fr:'Secondaire 5 au Québec (ou en cours)',en:'Secondary 5 in Quebec (or in progress)',es:'Secundaria 5 en Quebec (o en curso)'}},
      {val:'other',    icon:'🗺',  l:{fr:"Études dans une autre province ou à l'étranger",en:'Studies in another province or abroad',es:'Estudios en otra provincia o en el extranjero'}},
      {val:'dec',      icon:'📋', l:{fr:'DEC complété (cégep)',en:'Completed DEC (CEGEP)',es:'DEC completado (cégep)'}},
      {val:'bachelor', icon:'🎓', l:{fr:'Baccalauréat (université)',en:"Bachelor's degree (university)",es:'Licenciatura (universidad)'}},
      {val:'grad',     icon:'🏛',  l:{fr:'Maîtrise, doctorat ou plus',en:"Master's, doctorate or higher",es:'Maestría, doctorado o más'}},
    ]},
  { id:'equiv',
    q:{fr:'Ton diplôme équivaut-il au DES québécois ou à un niveau supérieur ?',en:'Does your diploma equal a Quebec Secondary School Diploma or higher?',es:'¿Tu diploma equivale al DES quebequense o nivel superior?'},
    opts:[
      {val:'yes', icon:'✓', l:{fr:'Oui',en:'Yes',es:'Sí'}},
      {val:'no',  icon:'✗', l:{fr:'Non ou je ne suis pas certain·e',en:"No or I'm not sure",es:'No o no estoy seguro/a'}},
    ]},
  { id:'uni_goal',
    q:{fr:"Souhaites-tu retourner à l'université ?",en:'Do you plan to return to university?',es:'¿Planeas volver a la universidad?'},
    opts:[
      {val:'no',    icon:'💼', l:{fr:'Non, je veux entrer sur le marché du travail',en:'No, I want to enter the job market',es:'No, quiero entrar al mercado laboral'}},
      {val:'bach2', icon:'📚', l:{fr:'Oui, pour un autre baccalauréat',en:"Yes, for another bachelor's",es:'Sí, para otra licenciatura'}},
      {val:'grad',  icon:'🏛',  l:{fr:'Oui, pour une maîtrise ou un doctorat',en:"Yes, for a master's or doctorate",es:'Sí, para una maestría o doctorado'}},
    ]},
  { id:'teach_lang',
    q:{fr:'Dans quelle langue préfères-tu étudier ?',en:'In which language do you prefer to study?',es:'¿En qué idioma prefieres estudiar?'},
    opts:[
      {val:'fr', icon:'🇫🇷', l:{fr:'Français',en:'French',es:'Francés'}},
      {val:'en', icon:'🇬🇧', l:{fr:'Anglais',en:'English',es:'Inglés'}},
    ]},
  { id:'french_level',
    q:{fr:'Quel est ton niveau de français ?',en:'What is your level of French?',es:'¿Cuál es tu nivel de francés?'},
    opts:[
      {val:'native',  icon:'★', l:{fr:'Langue maternelle ou courant·e',en:'Native or fluent',es:'Lengua materna o fluido/a'}},
      {val:'inter',   icon:'◐', l:{fr:'Intermédiaire — je me débrouille',en:'Intermediate — I can get by',es:'Intermedio — me las arreglo'},
                                s:{fr:"Quelques lacunes à l'écrit",en:'Some gaps in writing',es:'Algunas lagunas en escritura'}},
      {val:'beginner',icon:'○', l:{fr:'Débutant·e ou aucune connaissance',en:'Beginner or no knowledge',es:'Principiante o ningún conocimiento'}},
    ]},
];

/* ═══════════════════════════════════════════
   QUIZ QUESTIONS
═══════════════════════════════════════════ */
const QQ = [
  { q:{fr:'Par rapport à la créativité…',en:'When it comes to creativity…',es:'En cuanto a la creatividad…'},
    a:{t:{fr:'Je préfère créer des choses visuelles que les gens peuvent voir et toucher',en:'I prefer creating visual things people can see and touch',es:'Prefiero crear cosas visuales que la gente pueda ver y tocar'},tags:['visual','art','design','colors','shapes','branding']},
    b:{t:{fr:'Je préfère créer des expériences interactives que les gens peuvent vivre',en:'I prefer creating interactive experiences people can live through',es:'Prefiero crear experiencias interactivas que la gente pueda vivir'},tags:['interactive','ux','games','systems','immersive']}},
  { q:{fr:'Les espaces physiques et les environnements…',en:'Physical spaces and environments…',es:'Los espacios físicos y entornos…'},
    a:{t:{fr:"M'inspirent — j'aime concevoir des espaces où les gens se sentent bien",en:'Inspire me — I love designing spaces where people feel good',es:'Me inspiran — me encanta diseñar espacios donde la gente se sienta bien'},tags:['spatial','architecture','design','wellbeing','people-needs','ux']},
    b:{t:{fr:'Me semblent moins attrayants que les mondes numériques et virtuels',en:'Feel less appealing to me than digital and virtual worlds',es:'Me atraen menos que los mundos digitales y virtuales'},tags:['digital','interactive','immersive','games','3d','tech']}},
  { q:{fr:'Les couleurs, les formes et la composition…',en:'Colors, shapes and composition…',es:'Los colores, formas y composición…'},
    a:{t:{fr:"Sont au cœur de ce qui m'attire dans un projet créatif",en:'Are at the heart of what draws me to a creative project',es:'Están en el corazón de lo que me atrae en un proyecto creativo'},tags:['colors','shapes','visual','design','branding','ux']},
    b:{t:{fr:"M'intéressent moins que la logique et l'architecture des systèmes",en:'Interest me less than the logic and architecture of systems',es:'Me interesan menos que la lógica y arquitectura de sistemas'},tags:['logic','systems','abstraction','tech','networks','code']}},
  { q:{fr:'La vidéo et le son…',en:'Video and sound…',es:'El video y el sonido…'},
    a:{t:{fr:'Sont des outils puissants pour raconter des histoires et émouvoir',en:'Are powerful tools for storytelling and moving people',es:'Son herramientas poderosas para contar historias y emocionar'},tags:['video','audio','cinema','storytelling','creative','games']},
    b:{t:{fr:"M'intéressent surtout comme composantes techniques de systèmes interactifs",en:'Interest me mainly as technical components of interactive systems',es:'Me interesan principalmente como componentes técnicas de sistemas interactivos'},tags:['tech','interactive','systems','code','logic']}},
  { q:{fr:"Résoudre des problèmes pour moi, c'est avant tout…",en:'For me, problem-solving is mainly about…',es:'Para mí, resolver problemas consiste principalmente en…'},
    a:{t:{fr:'Configurer, réarranger et optimiser des systèmes existants',en:'Configuring, rearranging and optimizing existing systems',es:'Configurar, reorganizar y optimizar sistemas existentes'},tags:['configure','optimize','networks','infrastructure','logic','systems']},
    b:{t:{fr:"Imaginer de nouveaux produits et processus qui n'existent pas encore",en:'Imagining new products and processes that do not yet exist',es:'Imaginar nuevos productos y procesos que aún no existen'},tags:['new-products','management','code','ux','design','automate']}},
  { q:{fr:'La narration et divertir les autres…',en:'Storytelling and entertaining others…',es:'La narración y entretener a otros…'},
    a:{t:{fr:'Sont au centre de ce que je veux faire professionnellement',en:'Are at the center of what I want to do professionally',es:'Están en el centro de lo que quiero hacer profesionalmente'},tags:['storytelling','cinema','games','video','audio','creative','empower-others']},
    b:{t:{fr:"M'intéressent moins que l'efficacité et l'automatisation",en:'Interest me less than efficiency and automation',es:'Me interesan menos que la eficiencia y la automatización'},tags:['automate','efficiency','management','code','systems','tech']}},
  { q:{fr:"L'abstraction et les modèles conceptuels…",en:'Abstraction and conceptual models…',es:'La abstracción y los modelos conceptuales…'},
    a:{t:{fr:"Me fascinent — j'aime trouver des patterns cachés dans des données complexes",en:'Fascinate me — I love finding hidden patterns in complex data',es:'Me fascinan — me encanta encontrar patrones ocultos en datos complejos'},tags:['abstraction','math','ai','logic','code','insights','data']},
    b:{t:{fr:"M'intéressent moins que le concret et la réalisation visible",en:'Interest me less than concrete, visible results',es:'Me interesan menos que los resultados concretos y visibles'},tags:['visual','design','creative','spatial','architecture','wellbeing']}},
  { q:{fr:'Travailler en étroite collaboration avec des gens…',en:'Working closely with people…',es:'Trabajar estrechamente con personas…'},
    a:{t:{fr:"Est essentiel pour moi — j'aime co-créer et aider directement",en:'Is essential for me — I love co-creating and helping directly',es:'Es esencial para mí — me encanta co-crear y ayudar directamente'},tags:['people-needs','wellbeing','ux','design','help-others','empower-others']},
    b:{t:{fr:'Est moins important que la profondeur technique et analytique',en:'Is less important than technical and analytical depth',es:'Es menos importante que la profundidad técnica y analítica'},tags:['tech','abstraction','systems','code','logic','networks']}},
  { q:{fr:'Créer des solutions qui répondent aux besoins des gens…',en:"Creating solutions that meet people's needs…",es:'Crear soluciones que respondan a las necesidades de las personas…'},
    a:{t:{fr:"Est ma principale motivation — je veux voir l'impact humain de mon travail",en:'Is my main motivation — I want to see the human impact of my work',es:'Es mi principal motivación — quiero ver el impacto humano de mi trabajo'},tags:['people-needs','wellbeing','ux','design','architecture','spatial','help-others']},
    b:{t:{fr:"Est important, mais je suis surtout motivé·e par les défis intellectuels",en:'Is important, but I am mainly driven by intellectual challenges',es:'Es importante, pero me motivan principalmente los desafíos intelectuales'},tags:['abstraction','logic','math','ai','tech','code','data']}},
  { q:{fr:'Automatiser et simplifier des tâches répétitives…',en:'Automating and simplifying repetitive tasks…',es:'Automatizar y simplificar tareas repetitivas…'},
    a:{t:{fr:"M'enthousiasme — je veux libérer les gens de ce qui est fastidieux",en:'Excites me — I want to free people from tedious work',es:'Me entusiasma — quiero liberar a la gente del trabajo tedioso'},tags:['automate','code','systems','management','efficiency','lead-teams','new-products']},
    b:{t:{fr:"M'intéresse moins que la conception créative ou l'analyse de données",en:'Interests me less than creative design or data analysis',es:'Me interesa menos que el diseño creativo o el análisis de datos'},tags:['visual','creative','design','data','insights','storytelling']}},
  { q:{fr:"Extraire des insights à partir de données…",en:'Extracting insights from data…',es:'Extraer conclusiones de los datos…'},
    a:{t:{fr:"Est fascinant — les données sont une mine d'or pour prendre de meilleures décisions",en:'Is fascinating — data is a goldmine for better decisions',es:'Es fascinante — los datos son una mina de oro para mejores decisiones'},tags:['data','insights','ai','logic','management','bi','math']},
    b:{t:{fr:"Est moins attrayant que créer des choses visuelles ou interactives",en:'Is less appealing than creating visual or interactive things',es:'Es menos atractivo que crear cosas visuales o interactivas'},tags:['visual','creative','interactive','ux','games','storytelling','art']}},
  { q:{fr:'La psychologie et le comportement humain…',en:'Psychology and human behaviour…',es:'La psicología y el comportamiento humano…'},
    a:{t:{fr:"M'intéressent beaucoup — je veux comprendre pourquoi les gens agissent comme ils le font",en:'Interest me a lot — I want to understand why people act the way they do',es:'Me interesan mucho — quiero entender por qué la gente actúa como lo hace'},tags:['psychology','ux','wellbeing','people-needs','design','interactive']},
    b:{t:{fr:"M'intéressent moins que comprendre comment la technologie fonctionne",en:'Interest me less than understanding how technology works',es:'Me interesan menos que entender cómo funciona la tecnología'},tags:['tech','code','networks','ai','systems','logic','configure']}},
  { q:{fr:'Savoir comment la technologie fonctionne en profondeur…',en:'Understanding deeply how technology works…',es:'Entender en profundidad cómo funciona la tecnología…'},
    a:{t:{fr:"Est une passion — j'aime démonter et reconstruire des systèmes",en:'Is a passion — I love taking systems apart and rebuilding them',es:'Es una pasión — me encanta desmontar y reconstruir sistemas'},tags:['tech','code','networks','ai','systems','logic','abstraction','create-tech']},
    b:{t:{fr:"Est un moyen, pas une fin — ce qui m'importe c'est le résultat créatif ou humain",en:'Is a means, not an end — what matters to me is the creative or human result',es:'Es un medio, no un fin — lo que me importa es el resultado creativo o humano'},tags:['visual','creative','people-needs','design','storytelling','ux','wellbeing']}},
  { q:{fr:"Créer de la nouvelle technologie (IA, outils, logiciels)…",en:'Creating new technology (AI, tools, software)…',es:'Crear nueva tecnología (IA, herramientas, software)…'},
    a:{t:{fr:"Est ce que je veux faire — je veux construire ce que d'autres utiliseront",en:'Is what I want to do — I want to build what others will use',es:'Es lo que quiero hacer — quiero construir lo que otros usarán'},tags:['create-tech','code','ai','systems','tech','abstraction','automate']},
    b:{t:{fr:"Est moins attrayant que d'utiliser la technologie au service d'une création artistique ou humaine",en:'Is less appealing than using technology in service of artistic or human creation',es:'Es menos atractivo que usar la tecnología al servicio de la creación artística o humana'},tags:['visual','creative','art','design','storytelling','people-needs','ux','empower-others']}},
  { q:{fr:'Les expériences immersives et la réalité augmentée…',en:'Immersive experiences and augmented reality…',es:'Las experiencias inmersivas y la realidad aumentada…'},
    a:{t:{fr:"Me fascinent — je veux concevoir des mondes et des interfaces que l'on peut habiter",en:'Fascinate me — I want to design worlds and interfaces people can inhabit',es:'Me fascinan — quiero diseñar mundos e interfaces que se puedan habitar'},tags:['immersive','ux','interactive','3d','spatial','design','create-tech']},
    b:{t:{fr:"M'intéressent moins que les systèmes qui font tourner le monde réel",en:'Interest me less than the systems that keep the real world running',es:'Me interesan menos que los sistemas que hacen funcionar el mundo real'},tags:['tech','networks','systems','code','infrastructure','configure','logic']}},
];

