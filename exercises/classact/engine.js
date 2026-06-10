/* ============================================================
   Class//Act — shared engine
   ============================================================ */
'use strict';

// ── Language & theme init ─────────────────────────────────────
const _storedLang = localStorage.getItem('ca_lang');
const _browserFr  = (navigator.language||'').startsWith('fr');
let L = _storedLang || (_browserFr ? 'fr' : 'en');
if(L !== 'fr' && L !== 'en') L = 'fr';

// Programming language
let PL = localStorage.getItem('ca_pl') || 'java';
const PL_LIST = ['java','cs','py','cpp','rust'];
if(!PL_LIST.includes(PL)) PL = 'java';

// Theme
const _storedTheme = localStorage.getItem('ca_theme');
const _prefDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
const _theme = _storedTheme || (_prefDark ? 'dark' : 'light');
document.documentElement.setAttribute('data-theme', _theme);

// ── UI strings ────────────────────────────────────────────────
const UI = {
  fr: {
    back:'Accueil', langBtn:'EN', checkBtn:'Vérifier',
    retryBtn:'Réessayer', revealBtn:'Voir la réponse',
    correctMsg:'Correct !', wrongMsg:'Incorrect.',
    xpGain: xp => `+${xp} XP`,
    glossary:'Glossaire', glossSearch:'Chercher un terme…',
    hwLabel:'Devoir de la semaine', hwSub:'À remettre dans ton dépôt GitHub avant le prochain module.',
    mdNote:'Crée un fichier README.md à la racine de ton dépôt. Inclus les sections demandées et au moins un fichier de code dans le langage de ton choix.',
    tryIt:'Essaie en direct',
    tryNote:'Clique pour copier le code et ouvrir l\'éditeur, puis Ctrl+A → Ctrl+V → Run ▶',
    pasteNote:'✓ Code copié — Ctrl+A pour tout sélectionner, Ctrl+V pour coller, Run ▶',
    prev:'Module précédent', next:'Module suivant',
    plLabel:'Langage :',
  },
  en: {
    back:'Home', langBtn:'FR', checkBtn:'Check',
    retryBtn:'Try again', revealBtn:'Show answer',
    correctMsg:'Correct!', wrongMsg:'Incorrect.',
    xpGain: xp => `+${xp} XP`,
    glossary:'Glossary', glossSearch:'Search a term…',
    hwLabel:'Weekly homework', hwSub:'Submit in your GitHub repository before the next module.',
    mdNote:'Create a README.md at the root of your repository. Include the required sections and at least one code file in the language of your choice.',
    tryIt:'Try it live',
    tryNote:'Click to copy the code and open the editor, then Ctrl+A → Ctrl+V → Run ▶',
    pasteNote:'✓ Code copied — Ctrl+A to select all, Ctrl+V to paste, Run ▶',
    prev:'Previous module', next:'Next module',
    plLabel:'Language:',
  }
};

function t(key){ const v=UI[L][key]; return typeof v==='function'?v:v||key; }

// ── PL display names ──────────────────────────────────────────
const PL_NAMES = { java:'Java', cs:'C#', py:'Python', cpp:'C++', rust:'Rust' };

// ── Storage ───────────────────────────────────────────────────
function _lsKey(modId){ return `ca_${modId}`; }
function _lsGet(modId){ try{ return JSON.parse(localStorage.getItem(_lsKey(modId)))||{}; }catch{ return {}; } }
function _lsSet(modId,rec){ localStorage.setItem(_lsKey(modId),JSON.stringify(rec)); }

function actDone(modId,actId){ return !!(_lsGet(modId)?.[actId]); }
function markAct(modId,actId){ const r=_lsGet(modId); r[actId]=true; _lsSet(modId,r); }

// ── Header ────────────────────────────────────────────────────
function initHeader(){
  document.documentElement.lang = L;
  const lb = document.getElementById('lang-btn');
  if(lb){ lb.textContent = t('langBtn'); lb.onclick = toggleLang; }
  const tb = document.getElementById('theme-btn');
  const cur = document.documentElement.getAttribute('data-theme')||'dark';
  if(tb){ tb.textContent = cur==='dark'?'🌙':'☀️'; tb.onclick = toggleTheme; }
  const bb = document.getElementById('back-btn');
  if(bb){ bb.textContent = '← '+t('back'); bb.onclick = ()=>{ location.href='../index.html'; }; }
}

function toggleLang(){
  L = L==='fr'?'en':'fr';
  localStorage.setItem('ca_lang', L);
  location.reload();
}

function toggleTheme(){
  const cur = document.documentElement.getAttribute('data-theme')||'dark';
  const next = cur==='dark'?'light':'dark';
  document.documentElement.setAttribute('data-theme', next);
  localStorage.setItem('ca_theme', next);
  const btn = document.getElementById('theme-btn');
  if(btn) btn.textContent = next==='dark'?'🌙':'☀️';
}

// ── Language selector ─────────────────────────────────────────
function initLangSelector(){
  const sel = document.getElementById('pl-selector');
  if(!sel) return;
  PL_LIST.forEach(pl=>{
    const btn = document.createElement('button');
    btn.className = `lang-pill${pl===PL?' active':''}`;
    btn.dataset.lang = pl;
    btn.textContent = PL_NAMES[pl];
    btn.onclick = ()=>{ switchPL(pl); };
    sel.appendChild(btn);
  });
}

function switchPL(pl){
  PL = pl;
  localStorage.setItem('ca_pl', pl);
  // Update pill active states
  document.querySelectorAll('.lang-pill').forEach(b=>{
    b.classList.toggle('active', b.dataset.lang===pl);
  });
  // Show/hide lang blocks
  document.querySelectorAll('.lang-block').forEach(b=>{
    b.classList.toggle('active', b.dataset.lang===pl);
  });
  // Re-apply glossary on newly visible content
  const panel = document.getElementById('module-body');
  if(panel) applyGlossary(panel);
}

// ── Activities ────────────────────────────────────────────────
function updateActCheck(actId, done){
  const btn = document.querySelector(`.acheck[data-act="${actId}"]`);
  if(btn){ btn.className=`acheck${done?' done':''}`; btn.textContent=done?'✓':''; }
  const wrap = document.getElementById('wrap-'+actId);
  if(wrap){ wrap.className=`activity${done?' completed':''}`; }
}

function toggleActCheck(modId, actId){
  const rec = _lsGet(modId);
  rec[actId] = !rec[actId];
  _lsSet(modId, rec);
  updateActCheck(actId, !!rec[actId]);
  updateProgress(modId);
}

function updateProgress(modId){
  if(typeof MODULE==='undefined') return;
  const all = (MODULE.activities||[]);
  const done = all.filter(a=>actDone(modId,a.id)).length;
  const pct = all.length ? Math.round(done/all.length*100) : 0;
  const fill = document.getElementById('mod-prog-fill');
  const label = document.getElementById('mod-prog-label');
  if(fill) fill.style.width = pct+'%';
  if(label) label.textContent = `${done}/${all.length}`;
}

// ── Quiz ──────────────────────────────────────────────────────
function checkQ(modId, actId, idx, total, ns){
  const btn = document.getElementById(`qc-${actId}-${idx}`);
  if(!btn||btn.disabled) return;
  const correct = btn.dataset.correct==='true';
  const fb = decodeURIComponent(btn.dataset.fb||'');
  for(let i=0;i<total;i++){
    const b=document.getElementById(`qc-${actId}-${i}`);
    if(b){ b.disabled=true; if(b.dataset.correct==='true') b.classList.add('correct'); }
  }
  if(!correct) btn.classList.add('wrong');
  const f=document.getElementById('fb-'+actId);
  if(f){ f.textContent=fb; f.className=`feedback show ${correct?'ok':'nok'}`; }
  if(correct){ markAct(modId,actId); updateActCheck(actId,true); showToast(t('xpGain')(10)); updateProgress(modId); }
}

// ── Fill ──────────────────────────────────────────────────────
function checkF(modId, actId){
  const input = document.getElementById('bi-'+actId);
  if(!input||input.disabled) return;
  const all = (MODULE?.activities||[]);
  const act = all.find(a=>a.id===actId);
  if(!act){ console.warn('[checkF] act not found:', actId); return; }
  const val = input.value.trim();
  const correct = val.toLowerCase()===act.answer.toLowerCase();
  input.disabled = true;
  const f = document.getElementById('fb-'+actId);
  if(f){ f.textContent=correct?t('correctMsg'):(t('wrongMsg')+' '+(act.hint?.[L]||act.hint?.fr||'')); f.className=`feedback show ${correct?'ok':'nok'}`; }
  if(correct){ markAct(modId,actId); updateActCheck(actId,true); showToast(t('xpGain')(15)); updateProgress(modId); }
}

// ── Replit launcher ───────────────────────────────────────────
const _replCodeMap = {};

function launchReplit(btn){
  const target = btn.dataset.target;
  const code   = _replCodeMap[target] || '';
  const ph     = document.getElementById(target+'-ph');
  const wrap   = document.getElementById(target);
  console.log('[replit] launch target:', target, 'code length:', code.length);
  if(!wrap) return;
  if(code){
    navigator.clipboard.writeText(code).then(()=>{
      console.log('[replit] clipboard write ok');
    }).catch(err=>{ console.warn('[replit] clipboard failed:', err); });
  }
  if(!wrap.querySelector('iframe')){
    const iframe = document.createElement('iframe');
    // Language-appropriate Replit URL
    const replUrls = { java:'java', cs:'csharp', py:'python3', cpp:'cpp', rust:'rust' };
    const lang = replUrls[PL] || 'java';
    iframe.src = `https://replit.com/languages/${lang}`;
    iframe.className = 'replit-iframe';
    iframe.setAttribute('sandbox','allow-scripts allow-same-origin allow-forms allow-popups');
    iframe.setAttribute('title','Live editor');
    wrap.appendChild(iframe);
    console.log('[replit] iframe injected, lang:', lang);
  }
  if(ph) ph.style.display='none';
  wrap.style.display='block';
  wrap.classList.add('open');
}

// ── Toast ─────────────────────────────────────────────────────
function showToast(msg){
  const el = document.getElementById('toast');
  if(!el) return;
  el.textContent = msg; el.classList.add('show');
  setTimeout(()=>el.classList.remove('show'), 2200);
}

// ── Glossary ──────────────────────────────────────────────────
// OOP glossary — language-agnostic definitions
const GLOSSARY = {
  'class':           { fr:'Modèle définissant les attributs (données) et méthodes (comportements) d\'un type d\'objet. Une classe est un plan, un objet est une instance concrète de ce plan.', en:'Blueprint defining the attributes (data) and methods (behaviours) of a type of object. A class is a template; an object is a concrete instance of that template.' },
  'object':          { fr:'Instance concrète d\'une classe créée en mémoire. Chaque objet possède ses propres valeurs pour les attributs de la classe.', en:'Concrete instance of a class created in memory. Each object has its own values for the class\'s attributes.' },
  'constructor':     { fr:'Méthode spéciale appelée lors de la création d\'un objet. Initialise les attributs de l\'instance. Même nom que la classe en Java/C#/C++.', en:'Special method called when an object is created. Initialises the instance\'s attributes. Same name as the class in Java/C#/C++.' },
  'attribute':       { fr:'Variable stockée dans un objet, aussi appelée champ (field) ou propriété. Représente l\'état de l\'objet.', en:'Variable stored in an object, also called a field or property. Represents the object\'s state.' },
  'method':          { fr:'Fonction appartenant à une classe, définissant son comportement. Accède aux attributs de l\'objet via this (Java/C#/C++) ou self (Python).', en:'Function belonging to a class, defining its behaviour. Accesses the object\'s attributes via this (Java/C#/C++) or self (Python).' },
  'encapsulation':   { fr:'Principe OOP consistant à regrouper données et méthodes dans une classe, et à restreindre l\'accès direct aux données via des modificateurs d\'accès (private, protected, public).', en:'OOP principle of bundling data and methods in a class, and restricting direct data access via access modifiers (private, protected, public).' },
  'inheritance':     { fr:'Mécanisme permettant à une classe (sous-classe) de reprendre les attributs et méthodes d\'une autre (super-classe). Favorise la réutilisation du code.', en:'Mechanism allowing a class (subclass) to inherit attributes and methods from another (superclass). Promotes code reuse.' },
  'polymorphism':    { fr:'Capacité d\'une référence de super-classe à se comporter différemment selon le type réel de l\'objet. Activé par l\'héritage et la redéfinition de méthodes.', en:'Ability of a superclass reference to behave differently depending on the actual object type. Enabled by inheritance and method overriding.' },
  'abstraction':     { fr:'Principe OOP consistant à exposer uniquement les détails nécessaires et à masquer la complexité interne. Réalisé via des classes abstraites et des interfaces.', en:'OOP principle of exposing only necessary details and hiding internal complexity. Achieved via abstract classes and interfaces.' },
  'interface':       { fr:'Contrat définissant des méthodes qu\'une classe doit implémenter, sans fournir leur code. Une classe peut implémenter plusieurs interfaces.', en:'Contract defining methods a class must implement, without providing their code. A class can implement multiple interfaces.' },
  'abstract class':  { fr:'Classe qui ne peut pas être instanciée directement. Peut contenir des méthodes abstraites (sans corps) et des méthodes concrètes. Une sous-classe doit implémenter les méthodes abstraites.', en:'Class that cannot be instantiated directly. Can contain abstract methods (no body) and concrete methods. A subclass must implement the abstract methods.' },
  'overriding':      { fr:'Redéfinition d\'une méthode héritée dans une sous-classe pour modifier son comportement. En Java : @Override. En C++ : virtual + override.', en:'Redefining an inherited method in a subclass to change its behaviour. In Java: @Override. In C++: virtual + override.' },
  'overloading':     { fr:'Plusieurs méthodes avec le même nom mais des signatures différentes (paramètres différents) dans la même classe. Le compilateur choisit la bonne selon les arguments.', en:'Multiple methods with the same name but different signatures (different parameters) in the same class. The compiler picks the right one based on arguments.' },
  'subclass':        { fr:'Classe qui hérite d\'une autre (super-classe). Aussi appelée classe dérivée ou classe enfant. Utilise extends (Java), : (C#/C++), ou () (Python).', en:'Class that inherits from another (superclass). Also called derived class or child class. Uses extends (Java), : (C#/C++), or () (Python).' },
  'superclass':      { fr:'Classe dont une autre hérite. Aussi appelée classe de base ou classe parente. Fournit les attributs et méthodes hérités.', en:'Class that another inherits from. Also called base class or parent class. Provides inherited attributes and methods.' },
  'generic':         { fr:'Classe ou méthode paramétrée par un type (T). Permet d\'écrire du code réutilisable sans se lier à un type spécifique. Ex : List<T>, Map<K,V>.', en:'Class or method parameterised by a type (T). Allows writing reusable code without binding to a specific type. E.g. List<T>, Map<K,V>.' },
  'collection':      { fr:'Structure qui regroupe plusieurs objets. Les principales interfaces : List (ordre garanti), Set (pas de doublons), Queue (FIFO). En Java : java.util.', en:'Structure grouping multiple objects. Main interfaces: List (ordered), Set (no duplicates), Queue (FIFO). In Java: java.util.' },
  'list':            { fr:'Collection ordonnée qui autorise les doublons. Accès par index. En Java : ArrayList, LinkedList. En C# : List<T>. En Python : list.', en:'Ordered collection that allows duplicates. Access by index. In Java: ArrayList, LinkedList. In C#: List<T>. In Python: list.' },
  'set':             { fr:'Collection sans doublons. Pas d\'accès par index. En Java : HashSet (non ordonné), TreeSet (trié). En C# : HashSet<T>. En Python : set.', en:'Collection with no duplicates. No index access. In Java: HashSet (unordered), TreeSet (sorted). In C#: HashSet<T>. In Python: set.' },
  'queue':           { fr:'Collection FIFO (Premier Entré, Premier Sorti). Le premier élément ajouté est le premier retiré. En Java : LinkedList implémente Queue.', en:'FIFO (First In, First Out) collection. The first element added is the first removed. In Java: LinkedList implements Queue.' },
  'map':             { fr:'Structure de données associant des clés à des valeurs. Accès par clé, pas par index. En Java : HashMap, TreeMap, LinkedHashMap. En C# : Dictionary<K,V>.', en:'Data structure associating keys with values. Accessed by key, not by index. In Java: HashMap, TreeMap, LinkedHashMap. In C#: Dictionary<K,V>.' },
  'hashmap':         { fr:'Implémentation de Map utilisant une table de hachage. Accès O(1) en moyenne. Pas d\'ordre garanti. Permet une clé null en Java.', en:'Map implementation using a hash table. O(1) average access. No guaranteed order. Allows one null key in Java.' },
  'treemap':         { fr:'Implémentation de Map stockant les entrées triées par clé (ordre naturel ou Comparator). Accès O(log n). Ne permet pas de clé null en Java.', en:'Map implementation storing entries sorted by key (natural order or Comparator). O(log n) access. Does not allow null keys in Java.' },
  'linkedhashmap':   { fr:'Implémentation de Map conservant l\'ordre d\'insertion des entrées. Accès O(1). Utile quand l\'ordre d\'insertion est important.', en:'Map implementation preserving insertion order of entries. O(1) access. Useful when insertion order matters.' },
  'equals':          { fr:'Méthode de comparaison d\'égalité. Par défaut, compare les références (adresses mémoire). À redéfinir pour comparer les contenus. Lié à hashCode() en Java.', en:'Equality comparison method. By default, compares references (memory addresses). Must be overridden to compare contents. Linked to hashCode() in Java.' },
  'inner class':     { fr:'Classe définie à l\'intérieur d\'une autre classe. A accès aux membres privés de la classe externe. Variantes : statique, locale, anonyme.', en:'Class defined inside another class. Has access to the outer class\'s private members. Variants: static, local, anonymous.' },
  'access modifier': { fr:'Mot-clé contrôlant la visibilité d\'un membre : public (tous), protected (classe + sous-classes + même package), private (classe uniquement), package-private (même package, défaut Java).', en:'Keyword controlling a member\'s visibility: public (everyone), protected (class + subclasses + same package), private (class only), package-private (same package, Java default).' },
  'this':            { fr:'Référence vers l\'instance courante dans une méthode ou un constructeur. Permet de distinguer un attribut d\'un paramètre du même nom.', en:'Reference to the current instance inside a method or constructor. Allows distinguishing an attribute from a parameter of the same name.' },
  'super':           { fr:'Référence vers la super-classe. super() appelle le constructeur parent. super.method() appelle une méthode redéfinie de la super-classe.', en:'Reference to the superclass. super() calls the parent constructor. super.method() calls an overridden method from the superclass.' },
  'static':          { fr:'Membre appartenant à la classe elle-même, pas à une instance. Partagé entre tous les objets. Appelé via ClassName.member.', en:'Member belonging to the class itself, not an instance. Shared across all objects. Called via ClassName.member.' },
  'interface (common)': { fr:'Interfaces standards souvent utilisées : Comparable (comparaison naturelle), Iterable (foreach), Serializable (sérialisation), Runnable (thread). Permettent le polymorphisme via des contrats standardisés.', en:'Commonly used standard interfaces: Comparable (natural ordering), Iterable (foreach), Serializable (serialisation), Runnable (threading). Enable polymorphism through standardised contracts.' },

  // ── New terms added from module content review ────────────────
  'getter':             { fr:'Méthode qui lit et retourne la valeur d\'un attribut privé. Nom conventionnel : getX() en Java/C#, get_x() ou propriété en Python.', en:'Method that reads and returns the value of a private attribute. Conventional name: getX() in Java/C#, get_x() or a property in Python.' },
  'setter':             { fr:'Méthode qui assigne une valeur à un attribut privé, souvent avec validation. Nom conventionnel : setX() en Java/C#. Permet de contrôler ce qui est accepté.', en:'Method that assigns a value to a private attribute, often with validation. Conventional name: setX() in Java/C#. Allows controlling what values are accepted.' },
  'abstract method':    { fr:'Méthode déclarée sans corps dans une classe abstraite. Les sous-classes concrètes sont obligées de l\'implémenter. En Java : abstract void eat(); En C++ : virtual void eat() = 0;', en:'Method declared without a body in an abstract class. Concrete subclasses are required to implement it. In Java: abstract void eat(); In C++: virtual void eat() = 0;' },
  'concrete class':     { fr:'Classe qui implémente toutes ses méthodes et peut être instanciée directement. S\'oppose à classe abstraite. Toute sous-classe d\'une classe abstraite qui fournit tous les corps de méthodes devient concrète.', en:'Class that implements all its methods and can be directly instantiated. Opposite of abstract class. Any subclass of an abstract class that provides all method bodies becomes concrete.' },
  'comparable':         { fr:'Interface Java/C# imposant la méthode compareTo() pour définir l\'ordre naturel d\'une classe. Permet le tri avec Collections.sort(). compareTo() retourne négatif, zéro, ou positif.', en:'Java/C# interface requiring compareTo() to define a class\'s natural ordering. Enables sorting with Collections.sort(). compareTo() returns negative, zero, or positive.' },
  'comparator':         { fr:'Objet qui définit un ordre de tri personnalisé entre deux objets, indépendamment de leur ordre naturel. En Java : Comparator.comparing(). Permet plusieurs ordres de tri pour la même classe.', en:'Object defining a custom sort order between two objects, independently of their natural order. In Java: Comparator.comparing(). Allows multiple sort orders for the same class.' },
  'iterable':           { fr:'Interface imposant iterator() qui permet d\'utiliser la boucle for-each sur une classe personnalisée. En Java : for (T item : myCollection). Toutes les collections Java l\'implémentent.', en:'Interface requiring iterator() that enables the for-each loop on a custom class. In Java: for (T item : myCollection). All Java collections implement it.' },
  'iterator':           { fr:'Objet qui parcourt une collection un élément à la fois via hasNext() et next(). Pattern de conception standard. Permet de traverser des structures complexes sans exposer leur implémentation.', en:'Object that traverses a collection one element at a time via hasNext() and next(). Standard design pattern. Allows traversing complex structures without exposing their implementation.' },
  'fifo':               { fr:'First In, First Out — Premier Entré, Premier Sorti. Principe d\'une Queue : le premier élément ajouté est le premier retiré. Utilisé dans les files d\'attente, les buffers, le BFS (parcours en largeur).', en:'First In, First Out. The principle of a Queue: the first element added is the first removed. Used in waiting queues, buffers, and BFS (breadth-first search).' },
  'dispatch':           { fr:'Mécanisme qui détermine quelle implémentation de méthode appeler. Dispatch statique : résolu à la compilation (surcharge). Dispatch dynamique : résolu à l\'exécution selon le type réel (polymorphisme, virtual).', en:'Mechanism determining which method implementation to call. Static dispatch: resolved at compile time (overloading). Dynamic dispatch: resolved at runtime based on actual type (polymorphism, virtual).' },
  'composition':        { fr:'Patron de conception où une classe contient des instances d\'autres classes plutôt que d\'en hériter. "A a un B" vs "A est un B". Favorise le couplage faible et la flexibilité. Préféré à l\'héritage quand la relation n\'est pas is-a.', en:'"has-a" design where a class contains instances of other classes rather than inheriting from them. "A has a B" vs "A is a B". Promotes loose coupling and flexibility. Preferred over inheritance when the relation is not is-a.' },
  'coupling':           { fr:'Degré de dépendance entre classes. Couplage fort : une classe dépend des détails internes d\'une autre. Couplage faible : les classes communiquent via des interfaces. Objectif : couplage le plus faible possible.', en:'Degree of dependency between classes. Tight coupling: a class depends on another\'s internal details. Loose coupling: classes communicate via interfaces. Goal: as loose as possible.' },
  'cohesion':           { fr:'Degré auquel une classe a un rôle unique et bien défini. Haute cohésion : une classe fait une seule chose bien. Classe God (qui fait tout) = basse cohésion. Principe de responsabilité unique (SRP).', en:'Degree to which a class has a single, well-defined purpose. High cohesion: a class does one thing well. God class (does everything) = low cohesion. Single Responsibility Principle (SRP).' },
  'type parameter':     { fr:'Le type de substitution (T, K, V, E...) dans une classe ou méthode générique. Remplacé par un type concret à l\'utilisation. Ex : dans List<T>, T est le paramètre de type — List<String> le remplace par String.', en:'The placeholder type (T, K, V, E...) in a generic class or method. Replaced by a concrete type at use time. E.g. in List<T>, T is the type parameter — List<String> replaces it with String.' },
  'bounded type':       { fr:'Paramètre de type générique contraint par une borne supérieure. Ex : <T extends Comparable<T>> n\'accepte que les types qui implémentent Comparable. Garantit qu\'une opération (comparaison, tri) est disponible sur T.', en:'Generic type parameter constrained by an upper bound. E.g. <T extends Comparable<T>> only accepts types implementing Comparable. Guarantees an operation (comparison, sort) is available on T.' },
  'default method':     { fr:'Méthode avec implémentation déclarée dans une interface Java (depuis Java 8). Permet d\'ajouter des méthodes à une interface sans casser les classes existantes qui l\'implémentent.', en:'Method with an implementation declared in a Java interface (since Java 8). Allows adding methods to an interface without breaking existing implementing classes.' },
  'functional interface':{ fr:'Interface avec exactement une méthode abstraite. Peut être implémentée par une lambda en Java 8+. Annotation @FunctionalInterface recommandée. Ex : Runnable, Comparator, Callable.', en:'Interface with exactly one abstract method. Can be implemented by a lambda in Java 8+. @FunctionalInterface annotation recommended. E.g. Runnable, Comparator, Callable.' },
  'lambda':             { fr:'Fonction anonyme inline qui implémente une interface fonctionnelle. Syntaxe Java : (params) -> expression. Réduit le boilerplate des classes anonymes. Ex : list.sort((a, b) -> a.compareTo(b)).', en:'Anonymous inline function implementing a functional interface. Java syntax: (params) -> expression. Reduces anonymous class boilerplate. E.g. list.sort((a, b) -> a.compareTo(b)).' },
  'immutable':          { fr:'Objet dont l\'état ne peut pas être modifié après création. Thread-safe par nature. Ex : String en Java. Pour créer une classe immuable : tous les attributs final, pas de setters, constructeur seul.', en:'Object whose state cannot be changed after creation. Thread-safe by nature. E.g. String in Java. To create an immutable class: all attributes final, no setters, constructor only.' },
  'instanceof':         { fr:'Opérateur qui vérifie si un objet est une instance d\'une classe ou interface donnée. Retourne true/false. Utilisé avant un cast pour éviter ClassCastException. Java 16+ : instanceof avec pattern matching.', en:'Operator checking whether an object is an instance of a given class or interface. Returns true/false. Used before a cast to avoid ClassCastException. Java 16+: instanceof with pattern matching.' },
  'cast':               { fr:'Conversion explicite d\'un type vers un autre. En OOP : downcast (Animal → Dog) possible uniquement si l\'objet est réellement de ce type, sinon ClassCastException. Toujours vérifier avec instanceof avant de caster.', en:'Explicit conversion from one type to another. In OOP: downcast (Animal → Dog) only works if the object is actually of that type, otherwise ClassCastException. Always check with instanceof before casting.' },
  'final':              { fr:'Modificateur Java/C# qui interdit la modification. Classe final : ne peut pas être héritée. Méthode final : ne peut pas être redéfinie. Variable final : ne peut être assignée qu\'une fois (constante).', en:'Java/C# modifier that prevents modification. Final class: cannot be inherited. Final method: cannot be overridden. Final variable: can only be assigned once (constant).' },
  '@override':          { fr:'Annotation Java (et attribut C#) qui signale que la méthode redéfinit une méthode héritée. Le compilateur vérifie que la signature correspond — protège contre les erreurs de frappe et les surcharges accidentelles.', en:'Java annotation (and C# attribute) signalling that a method overrides an inherited one. The compiler verifies the signature matches — protects against typos and accidental overloading.' },
  'arraylist':          { fr:'Implémentation de List basée sur un tableau dynamique. Accès par index O(1). Insertion/suppression au milieu O(n). Choix par défaut quand l\'ordre et l\'accès rapide par index importent.', en:'List implementation based on a dynamic array. O(1) index access. O(n) insertion/removal in the middle. Default choice when order and fast index access matter.' },
  'linkedlist':         { fr:'Implémentation de List et Queue basée sur une liste chaînée. Insertion/suppression en tête O(1). Accès par index O(n). Préférer quand les insertions fréquentes en milieu de liste sont prioritaires.', en:'List and Queue implementation based on a linked list. O(1) insertion/removal at head. O(n) index access. Prefer when frequent mid-list insertions are a priority.' },
  'hashset':            { fr:'Implémentation de Set utilisant une table de hachage. add/contains/remove en O(1). Aucun ordre garanti. Requiert equals() et hashCode() corrects sur les éléments.', en:'Set implementation using a hash table. O(1) add/contains/remove. No guaranteed order. Requires correct equals() and hashCode() on elements.' },
  'treeset':            { fr:'Implémentation de Set utilisant un arbre binaire équilibré. Éléments maintenus dans leur ordre naturel (ou Comparator). Opérations en O(log n). Pas de null en Java.', en:'Set implementation using a balanced binary tree. Elements kept in natural order (or Comparator). O(log n) operations. No null in Java.' },
  'linkedhashset':      { fr:'Implémentation de Set conservant l\'ordre d\'insertion. Combine les performances de HashSet (O(1)) avec l\'ordre prévisible de LinkedList. Utile pour dédoublonner en préservant l\'ordre.', en:'Set implementation preserving insertion order. Combines HashSet performance (O(1)) with the predictable order of LinkedList. Useful for deduplication while preserving order.' },
  'deque':              { fr:'File à deux bouts (Double-Ended Queue). Insertion et suppression efficaces aux deux extrémités. En Java : ArrayDeque. Peut servir de Stack (LIFO) ou Queue (FIFO). Plus efficace que LinkedList pour ce rôle.', en:'Double-Ended Queue. Efficient insertion and removal at both ends. In Java: ArrayDeque. Can serve as Stack (LIFO) or Queue (FIFO). More efficient than LinkedList for this role.' },
  'entry':              { fr:'Paire clé-valeur stockée dans une Map. En Java : Map.Entry<K,V> avec getKey() et getValue(). Obtenu via map.entrySet() pour itérer sur toutes les paires.', en:'Key-value pair stored in a Map. In Java: Map.Entry<K,V> with getKey() and getValue(). Obtained via map.entrySet() to iterate over all pairs.' },
  'natural order':      { fr:'Ordre de tri par défaut défini par une classe implémentant Comparable. Ex : String trie alphabétiquement, Integer trie numériquement. Utilisé par Collections.sort() et TreeMap/TreeSet sans Comparator.', en:'Default sort order defined by a class implementing Comparable. E.g. String sorts alphabetically, Integer sorts numerically. Used by Collections.sort() and TreeMap/TreeSet without a Comparator.' },
  'composition (vs inheritance)': { fr:'Règle de conception "préférer la composition à l\'héritage". L\'héritage crée un couplage fort et une hiérarchie rigide. La composition (contenir un objet plutôt qu\'en hériter) est plus flexible et testable.', en:'"Favour composition over inheritance" design rule. Inheritance creates tight coupling and a rigid hierarchy. Composition (containing an object rather than inheriting from it) is more flexible and testable.' },
  'lru cache':          { fr:'Least Recently Used — stratégie de cache qui évince l\'entrée la moins récemment utilisée quand le cache est plein. Implémentable avec LinkedHashMap(capacity, 0.75f, true) en Java.', en:'Least Recently Used — cache strategy that evicts the least recently accessed entry when full. Implementable with LinkedHashMap(capacity, 0.75f, true) in Java.' },
  'mro':                { fr:'Method Resolution Order — ordre dans lequel Python cherche une méthode en cas d\'héritage multiple. Utilise l\'algorithme C3. Consultable avec ClassName.__mro__. Évite les conflits dans les hiérarchies complexes.', en:'Method Resolution Order — the order Python searches for a method in multiple inheritance hierarchies. Uses the C3 algorithm. Inspectable via ClassName.__mro__. Avoids conflicts in complex hierarchies.' },
  'name mangling':      { fr:'Mécanisme Python qui renomme les attributs préfixés de __ (double underscore) en _ClassName__attr. Empêche la collision accidentelle dans les hiérarchies d\'héritage. Ne remplace pas l\'encapsulation stricte.', en:'Python mechanism that renames __ (double underscore) prefixed attributes to _ClassName__attr. Prevents accidental name collision in inheritance hierarchies. Does not replace strict encapsulation.' },
  'vtable':             { fr:'Table de dispatch virtuel utilisée en C++ (et en interne par la plupart des langages OOP) pour résoudre les appels de méthodes virtuelles à l\'exécution. Chaque objet polymorphe contient un pointeur vers la vtable de sa classe.', en:'Virtual dispatch table used in C++ (and internally by most OOP languages) to resolve virtual method calls at runtime. Each polymorphic object contains a pointer to its class\'s vtable.' },
};

const _GLOSS_TERMS = Object.keys(GLOSSARY).sort((a,b)=>b.length-a.length);
const _glossUsed   = new Set();

function escHtml(s){ return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }

function applyGlossary(rootEl){
  if(!rootEl) return;
  // Pass 1: code elements
  rootEl.querySelectorAll('code').forEach(codeEl=>{
    if(codeEl.closest('.gloss-term')) return;
    const text = codeEl.textContent;
    for(const term of _GLOSS_TERMS){
      if(_glossUsed.has(term)) continue;
      const re = new RegExp(`\\b(${term.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')})\\b`, 'i');
      if(re.test(text)){
        _glossUsed.add(term);
        const btn = document.createElement('button');
        btn.className='gloss-btn'; btn.dataset.term=term.toLowerCase(); btn.textContent='?';
        const wrap = document.createElement('span');
        wrap.className='gloss-term';
        codeEl.parentNode.insertBefore(wrap, codeEl);
        wrap.appendChild(codeEl); wrap.appendChild(btn);
        break;
      }
    }
  });
  // Pass 2: prose text nodes
  const walker = document.createTreeWalker(rootEl, NodeFilter.SHOW_TEXT, {
    acceptNode: n=>{
      const p=n.parentElement; if(!p) return NodeFilter.FILTER_REJECT;
      const tag=p.tagName.toLowerCase();
      if(['code','pre','button','input','textarea','script','style'].includes(tag)) return NodeFilter.FILTER_REJECT;
      if(p.closest('.code-block,.gloss-term,.abadge')) return NodeFilter.FILTER_REJECT;
      return NodeFilter.FILTER_ACCEPT;
    }
  });
  const nodes=[]; let n;
  while((n=walker.nextNode())) nodes.push(n);
  nodes.forEach(node=>{
    const text=node.textContent; let replaced=false; let html=''; let last=0;
    for(const term of _GLOSS_TERMS){
      if(_glossUsed.has(term)) continue;
      const re=new RegExp(`\\b(${term.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')})\\b`,'gi');
      const m=re.exec(text);
      if(m){
        _glossUsed.add(term);
        html+=escHtml(text.slice(last,m.index));
        html+=`<span class="gloss-term">${escHtml(m[1])}<button class="gloss-btn" data-term="${term.toLowerCase()}" aria-label="Definition">?</button></span>`;
        last=m.index+m[0].length; replaced=true; break;
      }
    }
    if(replaced){ html+=escHtml(text.slice(last)); const span=document.createElement('span'); span.innerHTML=html; node.parentNode.replaceChild(span,node); }
  });
}

function initGlossaryDrawer(){
  if(document.getElementById('gloss-drawer')) return;
  const tab = document.createElement('button');
  tab.id='gloss-tab';
  tab.innerHTML=`<span class="gloss-tab-icon">📖</span><span class="gloss-tab-label">${t('glossary')}</span>`;
  tab.onclick=toggleGlossDrawer; document.body.appendChild(tab);
  const drawer=document.createElement('div'); drawer.id='gloss-drawer'; drawer.setAttribute('aria-hidden','true');
  drawer.innerHTML=`<div class="gloss-drawer-hdr"><span>${t('glossary')}</span><button class="gloss-drawer-close" onclick="toggleGlossDrawer()">✕</button></div><div class="gloss-drawer-search-wrap"><input id="gloss-search" type="text" placeholder="${t('glossSearch')}" oninput="filterGloss(this.value)" autocomplete="off"></div><div class="gloss-drawer-list" id="gloss-list"></div>`;
  document.body.appendChild(drawer);
  const overlay=document.createElement('div'); overlay.id='gloss-overlay'; overlay.onclick=toggleGlossDrawer; document.body.appendChild(overlay);
  renderGlossList('');
}

function toggleGlossDrawer(){
  const drawer=document.getElementById('gloss-drawer');
  const overlay=document.getElementById('gloss-overlay');
  const tab=document.getElementById('gloss-tab');
  if(!drawer) return;
  const open=drawer.classList.toggle('open');
  drawer.setAttribute('aria-hidden',String(!open));
  if(overlay) overlay.classList.toggle('show',open);
  if(tab) tab.classList.toggle('active',open);
  if(open){ const inp=document.getElementById('gloss-search'); if(inp) setTimeout(()=>inp.focus(),120); }
}

function filterGloss(q){ renderGlossList(q.trim().toLowerCase()); }

function renderGlossList(q){
  const list=document.getElementById('gloss-list'); if(!list) return;
  const all=Object.keys(GLOSSARY).sort((a,b)=>a.localeCompare(b));
  const filtered=q?all.filter(t=>t.includes(q)||(GLOSSARY[t][L]||GLOSSARY[t].en).toLowerCase().includes(q)):all;
  if(!filtered.length){ list.innerHTML=`<p class="gloss-empty">${L==='fr'?'Aucun résultat.':'No results.'}</p>`; return; }
  list.innerHTML=filtered.map(term=>{
    const def=(GLOSSARY[term][L]||GLOSSARY[term].en).replace(/</g,'&lt;').replace(/>/g,'&gt;');
    return `<div class="gloss-entry"><div class="gloss-entry-top"><span class="gloss-entry-term">${term}</span><span class="gloss-lang gloss-lang-oop">OOP</span></div><span class="gloss-entry-def">${def}</span></div>`;
  }).join('');
}

function initGlossaryTip(){
  if(document.getElementById('gloss-tip')) return;
  const tip=document.createElement('div'); tip.id='gloss-tip'; tip.setAttribute('role','tooltip');
  document.body.appendChild(tip);
  document.addEventListener('click',e=>{ if(!e.target.closest('.gloss-btn,.gloss-tip')) hideGlossTip(); });
  document.addEventListener('click',e=>{ if(e.target.classList.contains('gloss-btn')){ e.stopPropagation(); showGlossTip(e.target); } });
}

function showGlossTip(btn){
  const term=btn.dataset.term; const def=GLOSSARY[term]; if(!def) return;
  const tip=document.getElementById('gloss-tip'); if(!tip) return;
  tip.textContent=(def[L]||def.en);
  const rect=btn.getBoundingClientRect();
  tip.style.top=(rect.bottom+window.scrollY+8)+'px';
  tip.style.left=Math.min(rect.left+window.scrollX,window.innerWidth-340)+'px';
  tip.classList.add('show');
}

function hideGlossTip(){
  const tip=document.getElementById('gloss-tip'); if(tip) tip.classList.remove('show');
}

// ── Footer ────────────────────────────────────────────────────
function injectFooter(){
  const FOOTER = {
    fr:`<footer class="site-footer-credits"><div class="footer-inner"><p class="footer-heading">Comment cet outil a été créé</p><p>Ce site a été construit en collaboration itérative entre <strong>Elisa Schaeffer</strong>, doyen·ne de la Technologie et du Design au Collège LaSalle Montréal, et <strong>Claude</strong> (Anthropic), un assistant IA. Le contenu pédagogique, les activités et les choix éditoriaux ont été définis et vérifiés par Elisa à chaque étape.</p><p class="footer-note">Utilisation réfléchie de l'IA — L'humain reste auteur. Dernière mise à jour : juin 2026.</p></div></footer>`,
    en:`<footer class="site-footer-credits"><div class="footer-inner"><p class="footer-heading">How this tool was made</p><p>This site was built through iterative collaboration between <strong>Elisa Schaeffer</strong>, Dean of Technology and Design at Collège LaSalle Montréal, and <strong>Claude</strong> (Anthropic), an AI assistant. Pedagogical content, activities, and editorial choices were defined and verified by Elisa at every step.</p><p class="footer-note">Thoughtful AI use — the human remains the author. Last updated: June 2026.</p></div></footer>`
  };
  const el=document.createElement('div'); el.innerHTML=FOOTER[L]||FOOTER.en; document.body.appendChild(el.firstElementChild);
}

// ── Module page init ──────────────────────────────────────────
function initModulePage(){
  if(typeof MODULE==='undefined') return;
  const M=MODULE;
  document.title=`Class//Act — M${M.num}: ${M.title[L]}`;
  document.documentElement.lang=L;

  // Title
  const numEl=document.getElementById('mod-num');
  const titleEl=document.getElementById('mod-title');
  const subEl=document.getElementById('mod-sub');
  if(numEl) numEl.textContent=`Module ${M.num}`;
  if(titleEl) titleEl.textContent=M.title[L];
  if(subEl) subEl.textContent=M.sub?.[L]||'';

  // Body
  const body=document.getElementById('module-body');
  if(body){
    body.innerHTML=renderModuleBody(M);
    // Wire delegated acheck listener
    body.addEventListener('click',e=>{
      const btn=e.target.closest('.acheck');
      if(!btn) return;
      toggleActCheck(M.id, btn.dataset.act);
    });
  }

  // Homework
  const hwEl=document.getElementById('mod-hw');
  if(hwEl&&M.homework) hwEl.innerHTML=renderHomework(M);

  // References
  const refEl=document.getElementById('mod-refs');
  if(refEl&&M.references) refEl.innerHTML=renderReferences(M);

  // Nav
  const prevBtn=document.getElementById('prev-mod-btn');
  const nextBtn=document.getElementById('next-mod-btn');
  if(prevBtn){ if(M.prev){ prevBtn.textContent='← '+t('prev'); prevBtn.onclick=()=>location.href=`m${String(M.prev).padStart(2,'0')}.html`; }else{ prevBtn.classList.add('hidden'); } }
  if(nextBtn){ if(M.next){ nextBtn.textContent=t('next')+' →'; nextBtn.className='mod-nav-btn primary'; nextBtn.onclick=()=>location.href=`m${String(M.next).padStart(2,'0')}.html`; }else{ nextBtn.classList.add('hidden'); } }

  // Progress
  updateProgress(M.id);

  // Restore activity states
  (M.activities||[]).forEach(a=>{ if(actDone(M.id,a.id)) updateActCheck(a.id,true); });

  // Language selector
  initLangSelector();
  switchPL(PL); // apply initial language visibility

  // Glossary
  setTimeout(()=>applyGlossary(body), 300);
}

// ── Render module body ────────────────────────────────────────
function renderModuleBody(M){
  let h='';
  // Progress bar
  const total=(M.activities||[]).length;
  h+=`<div class="mod-progress-row"><span class="mod-progress-label" id="mod-prog-label">0/${total}</span><div class="mod-progress-bar"><div class="mod-progress-fill" id="mod-prog-fill" style="width:0%"></div></div></div>`;
  // Concepts
  (M.concepts||[]).forEach(concept=>{
    h+=renderConcept(concept,M);
  });
  return h;
}

function renderConcept(concept, M){
  let h=`<div class="concept-section">`;
  h+=`<h2 class="concept-hdr">${concept.title[L]}</h2>`;
  h+=`<p class="concept-body">${concept.body[L]}</p>`;
  // Code examples per language
  if(concept.code){
    PL_LIST.forEach(pl=>{
      const snippet=concept.code[pl];
      if(!snippet) return;
      h+=`<div class="lang-block${pl===PL?' active':''}" data-lang="${pl}">`;
      h+=`<div class="code-block">${snippet}</div>`;
      if(concept.replit?.[pl]){
        const frameId=`rf-${concept.id}-${pl}`;
        _replCodeMap[frameId]=concept.replit[pl];
        h+=renderReplitLauncher(frameId);
      }
      h+=`</div>`;
    });
  }
  // Activities for this concept
  const acts=(M.activities||[]).filter(a=>a.concept===concept.id);
  acts.forEach(act=>{ h+=renderActivity(act,M.id); });
  h+=`</div>`;
  return h;
}

function renderActivity(act, modId){
  const isDone=actDone(modId,act.id);
  const typeLabels={quiz:'Quiz',fill:'Fill-in',predict:'Predict',bug:'Find the bug'};
  const badgeClass={quiz:'bq',fill:'bf',predict:'bpredict',bug:'bbug'};
  let h=`<div class="activity${isDone?' completed':''}" id="wrap-${act.id}">`;
  h+=`<div class="act-top"><span class="abadge ${badgeClass[act.type]||'bq'}">${typeLabels[act.type]||act.type} · ${act.xp||10} XP</span><button class="acheck${isDone?' done':''}" data-act="${act.id}">${isDone?'✓':''}</button></div>`;
  if(act.type==='quiz')    h+=renderQuiz(act,modId);
  if(act.type==='fill')    h+=renderFill(act,modId);
  if(act.type==='predict') h+=renderPredict(act,modId);
  if(act.type==='bug')     h+=renderBug(act,modId);
  h+=`</div>`;
  return h;
}

function renderQuiz(act, modId){
  let h=`<p style="font-size:1.5rem;color:var(--white);margin-bottom:1.2rem">${act.question[L]}</p>`;
  h+=`<div class="choices">`;
  act.choices.forEach((c,i)=>{
    const fb=encodeURIComponent(c.fb?.[L]||c.fb?.en||'');
    h+=`<button class="choice-btn" id="qc-${act.id}-${i}" data-correct="${!!c.correct}" data-fb="${fb}" onclick="checkQ('${modId}','${act.id}',${i},${act.choices.length})">${c.text[L]}</button>`;
  });
  h+=`</div><div class="feedback" id="fb-${act.id}"></div>`;
  return h;
}

function renderFill(act, modId){
  let h=`<p style="font-size:1.5rem;color:var(--white);margin-bottom:1rem">${act.instr[L]}</p>`;
  const tpl=act.template?.[L]||act.template?.fr||'';
  const parts=tpl.split('______');
  h+=`<div class="fill-row"><span class="fill-code">${escHtml(parts[0])}</span><input class="fill-input" id="bi-${act.id}" type="text" autocomplete="off" placeholder="?" onkeydown="if(event.key==='Enter')checkF('${modId}','${act.id}')"><span class="fill-code">${escHtml(parts[1]||'')}</span></div>`;
  h+=`<button class="btn" onclick="checkF('${modId}','${act.id}')" style="margin-bottom:.8rem">${t('checkBtn')}</button>`;
  if(act.hint) h+=`<p style="font-size:1.3rem;color:var(--ch3);margin-bottom:.8rem">${L==='fr'?'Indice':'Hint'} : ${act.hint[L]||act.hint.fr}</p>`;
  h+=`<div class="feedback" id="fb-${act.id}"></div>`;
  return h;
}

function renderPredict(act, modId){
  const isDone=actDone(modId,act.id);
  let h=`<p style="font-size:1.5rem;color:var(--white);margin-bottom:1rem">${act.question[L]}</p>`;
  h+=`<div class="code-block" style="font-size:1.25rem">${act.code}</div>`;
  h+=`<button class="btn" onclick="revealPred('${modId}','${act.id}')" id="pred-btn-${act.id}"${isDone?' style="display:none"':''}>${t('revealBtn')}</button>`;
  h+=`<div class="feedback ok${isDone?' show':''}" id="pred-ans-${act.id}">${isDone?act.explanation?.[L]||act.explanation?.en:''}</div>`;
  return h;
}

function revealPred(modId, actId){
  const act=(MODULE?.activities||[]).find(a=>a.id===actId); if(!act) return;
  const ans=document.getElementById('pred-ans-'+actId);
  const btn=document.getElementById('pred-btn-'+actId);
  if(ans){ ans.textContent=act.explanation?.[L]||act.explanation?.en||''; ans.className='feedback ok show'; }
  if(btn) btn.style.display='none';
  markAct(modId,actId); updateActCheck(actId,true); showToast(t('xpGain')(8)); updateProgress(modId);
}

function renderBug(act, modId){
  let h=`<p style="font-size:1.5rem;color:var(--white);margin-bottom:1rem">${act.instr[L]}</p>`;
  h+=`<div class="code-block" style="white-space:pre-wrap">${act.bugCode}</div>`;
  h+=`<button class="btn sec" onclick="revealBug('${modId}','${act.id}')" id="bug-btn-${act.id}">${t('revealBtn')}</button>`;
  h+=`<div class="feedback" id="bug-fb-${act.id}"></div>`;
  return h;
}

function revealBug(modId, actId){
  const act=(MODULE?.activities||[]).find(a=>a.id===actId); if(!act) return;
  const fb=document.getElementById('bug-fb-'+actId);
  const btn=document.getElementById('bug-btn-'+actId);
  if(fb){ fb.innerHTML=act.explanation?.[L]||act.explanation?.en||''; fb.className='feedback ok show'; }
  if(btn) btn.style.display='none';
  markAct(modId,actId); updateActCheck(actId,true); showToast(t('xpGain')(20)); updateProgress(modId);
}

function renderReplitLauncher(frameId){
  return `<div class="replit-launcher"><p class="replit-note">${t('tryNote')}</p><div class="replit-ph" id="${frameId}-ph"><button class="btn" data-target="${frameId}" onclick="launchReplit(this)">▶ ${t('tryIt')}</button></div><div class="replit-frame-wrap" id="${frameId}"><div class="replit-paste-note">${t('pasteNote')}</div></div></div>`;
}

function renderReferences(M){
  const refs = M.references;
  if(!refs||!refs.length) return '';
  const label = { fr:'Pour aller plus loin', en:'Further reading' };
  const items = refs.map(r=>{
    const title = r.title[L]||r.title.fr;
    const note  = r.note?.[L]||r.note?.fr||'';
    return `<li><a href="${r.url}" target="_blank" rel="noopener">${title}</a>${note?' <span class="ref-note">— '+note+'</span>':''}${r.free===false?' <span class="ref-badge">payant</span>':''}</li>`;
  }).join('');
  return `<div class="ref-section"><h3 class="ref-heading">${label[L]}</h3><ul class="ref-list">${items}</ul></div>`;
}
  const hw=M.homework;
  return `<div class="hw-section"><button class="hw-toggle" onclick="this.parentElement.classList.toggle('hw-open')"><span class="hw-icon">▸</span><span class="hw-label">${t('hwLabel')}</span><span class="hw-sub">${t('hwSub')}</span></button><div class="hw-body"><div class="hw-prompt">${hw[L]||hw.fr}</div><div class="hw-md-note">${t('mdNote')}</div></div></div>`;
}

// ── Auto-init ─────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded',()=>{
  initHeader();
  initGlossaryTip();
  initGlossaryDrawer();
  injectFooter();
  if(typeof MODULE!=='undefined') initModulePage();
  else if(typeof initHome==='function') initHome();
});
