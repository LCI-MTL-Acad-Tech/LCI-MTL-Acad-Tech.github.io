'use strict';
// Session 10 — Composants & Héritage

const SESSION = {
  id:        's10',
  num:       10,
  prev:      9,
  next:      11,
  xp:        120,
  blocName:  { fr:'Unreal Engine C++', en:'Unreal Engine C++' },
  blocColor: '#00587c',
  title:     { fr:'Composants & Héritage', en:'Components & Inheritance' },
  sub:       { fr:'GetComponent vs FindComponentByClass, sous-classes C++', en:'GetComponent vs FindComponentByClass, C++ subclasses' },

  tutor: {
    concept: {
      fr:`Unity est très orienté composition — tout se fait avec des Components. Unreal supporte les deux : composition (UActorComponent) ET héritage C++ natif. En C++, l'héritage est plus explicite qu'en C# — les mots-clés virtual, override, et Super:: sont essentiels. Cette session couvre les deux approches et quand choisir l'une ou l'autre.`,
      en:`Unity is heavily composition-oriented — everything done with Components. Unreal supports both: composition (UActorComponent) AND native C++ inheritance. In C++, inheritance is more explicit than in C# — virtual, override, and Super:: keywords are essential. This session covers both approaches and when to choose each.`
    },
    demoSteps: [
      {
        label: { fr:'FindComponentByClass = GetComponent', en:'FindComponentByClass = GetComponent' },
        fr:`En Unity : GetComponent<Rigidbody>(). En Unreal : FindComponentByClass<UStaticMeshComponent>(). Montre les deux en direct. La logique est identique — cherche un composant du type donné attaché à l'Actor. Différence : en Unreal, les Components sont souvent déclarés comme membres UPROPERTY() et accessibles directement, sans chercher.`,
        en:`In Unity: GetComponent<Rigidbody>(). In Unreal: FindComponentByClass<UStaticMeshComponent>(). Show both live. Logic is identical — find a component of the given type attached to the Actor. Difference: in Unreal, Components are often declared as UPROPERTY() members and directly accessible, no searching needed.`
      },
      {
        label: { fr:'CreateDefaultSubobject — créer un Component dans le constructeur', en:'CreateDefaultSubobject — creating a Component in the constructor' },
        fr:`La façon Unreal de créer des Components : dans le constructeur, utilise CreateDefaultSubobject<UStaticMeshComponent>(TEXT("Mesh")). Ça crée le Component, l'attache à l'Actor, et le rend visible dans l'éditeur. Montre SetRootComponent() et SetupAttachment(). C'est l'équivalent d'AddComponent() au démarrage en Unity.`,
        en:`The Unreal way to create Components: in the constructor, use CreateDefaultSubobject<UStaticMeshComponent>(TEXT("Mesh")). This creates the Component, attaches it to the Actor, and makes it visible in the editor. Show SetRootComponent() and SetupAttachment(). It's the equivalent of AddComponent() at startup in Unity.`
      },
      {
        label: { fr:'virtual et override — l\'héritage explicite', en:'virtual and override — explicit inheritance' },
        fr:`En C++, une méthode doit être déclarée virtual dans la classe parente pour pouvoir être surchargée. BeginPlay() et Tick() sont virtual dans AActor — c'est pourquoi on peut les override. Montre : dans le header, "virtual void BeginPlay() override;" — le mot override est important : si tu fais une faute de frappe dans le nom, le compilateur te le signale. Sans override, tu créerais silencieusement une nouvelle méthode.`,
        en:`In C++, a method must be declared virtual in the parent class to be overridable. BeginPlay() and Tick() are virtual in AActor — that's why we can override them. Show: in the header, "virtual void BeginPlay() override;" — the override keyword matters: if you make a typo in the method name, the compiler catches it. Without override, you'd silently create a new method.`
      },
      {
        label: { fr:'Super:: — appeler la classe parente', en:'Super:: — calling the parent class' },
        fr:`Super::BeginPlay() est l'équivalent de base.Start() en C# — appelle la méthode de la classe parente. En C++, Super est un alias défini par Unreal pour la classe parente directe. Toujours appeler Super:: dans BeginPlay(), Tick(), et les méthodes d'override importantes — sinon la logique de la classe parente est perdue.`,
        en:`Super::BeginPlay() is the equivalent of base.Start() in C# — calls the parent class method. In C++, Super is an alias defined by Unreal for the direct parent class. Always call Super:: in BeginPlay(), Tick(), and important override methods — otherwise parent class logic is lost.`
      },
    ],
    discussion: [
      {
        fr:`En Unity, tu peux accéder à n'importe quel Component avec GetComponent<>(). En Unreal, les Components sont souvent des membres directs. Quelle approche est plus sûre et pourquoi ?`,
        en:`In Unity you can access any Component with GetComponent<>(). In Unreal, Components are often direct members. Which approach is safer and why?`
      },
      {
        fr:`En C++, l'héritage multiple est possible (hériter de deux classes à la fois). En C#, c'est interdit (sauf pour les interfaces). Pourquoi C# a-t-il fait ce choix selon toi ?`,
        en:`In C++, multiple inheritance is possible (inheriting from two classes at once). In C#, it's forbidden (except for interfaces). Why do you think C# made that choice?`
      },
    ],
    deep: {
      fr:`<p><strong>Interfaces en C++ Unreal.</strong> Comme en C#, Unreal a des interfaces (<code>UInterface</code> + <code>IMyInterface</code>). Elles permettent à différents types d'Actors de répondre à un même message sans couplage fort.</p>
<p>Exemple classique : <code>IDamageable</code> — n'importe quel Actor implémentant l'interface peut recevoir des dégâts, qu'il soit un personnage, un mur ou un objet. En C++, l'interface se déclare en deux classes : <code>UDamageable</code> (hérite de UInterface, pour le moteur) et <code>IDamageable</code> (hérite de IInterface, pour le code). C'est verbeux mais identique conceptuellement aux interfaces C#.</p>`,
      en:`<p><strong>Interfaces in Unreal C++.</strong> Like C#, Unreal has interfaces (<code>UInterface</code> + <code>IMyInterface</code>). They allow different Actor types to respond to the same message without tight coupling.</p>
<p>Classic example: <code>IDamageable</code> — any Actor implementing the interface can receive damage, whether it's a character, wall, or object. In C++, the interface is declared as two classes: <code>UDamageable</code> (inherits from UInterface, for the engine) and <code>IDamageable</code> (inherits from IInterface, for code). It's verbose but conceptually identical to C# interfaces.</p>`
    }
  },

  compare: {
    cs:`<span class="cm">// Unity — GetComponent</span>
<span class="ty">Rigidbody</span> rb =
    <span class="fn">GetComponent</span>&lt;<span class="ty">Rigidbody</span>&gt;();
<span class="kw">if</span>(rb != <span class="kw">null</span>)
    rb.<span class="fn">AddForce</span>(<span class="ty">Vector3</span>.up);

<span class="cm">// Héritage C#</span>
<span class="kw">public override void</span> <span class="fn">Start</span>() {
    <span class="kw">base</span>.<span class="fn">Start</span>();
}`,
    cpp:`<span class="cm">// Unreal — membre direct (préféré)</span>
<span class="mac">UPROPERTY</span>()
<span class="ty">UStaticMeshComponent</span>* Mesh;
<span class="cm">// OU FindComponentByClass si besoin</span>
Mesh-&gt;<span class="fn2">SetSimulatePhysics</span>(<span class="kw2">true</span>);

<span class="cm">// Héritage C++</span>
<span class="kw2">virtual void</span> <span class="fn2">BeginPlay</span>() <span class="kw2">override</span> {
    <span class="kw2">Super</span>::<span class="fn2">BeginPlay</span>();
}`
  },

  activities: [
    {
      id:'a10_1', type:'quiz', xp:15,
      q:{
        fr:`En C++, quelle est la différence entre les mots-clés virtual et override ?`,
        en:`In C++, what is the difference between the virtual and override keywords?`
      },
      choices:[
        { t:{ fr:`virtual et override sont synonymes`, en:`virtual and override are synonyms` }, c:false,
          fb:{ fr:`Non — virtual déclare qu'une méthode PEUT être surchargée. override confirme qu'on surcharge une méthode virtuelle existante.`, en:`No — virtual declares a method CAN be overridden. override confirms we're overriding an existing virtual method.` } },
        { t:{ fr:`virtual déclare la méthode comme surchargeable ; override confirme qu'on surcharge une méthode virtuelle parente`, en:`virtual declares the method as overridable; override confirms we're overriding a parent virtual method` }, c:true,
          fb:{ fr:`Correct. override est aussi utile car une faute de frappe dans le nom de la méthode provoquera une erreur de compilation — sans override, tu créerais silencieusement une nouvelle méthode.`, en:`Correct. override is also useful because a typo in the method name will cause a compilation error — without override, you'd silently create a new method.` } },
        { t:{ fr:`virtual est utilisé en C# ; override est utilisé en C++`, en:`virtual is used in C#; override is used in C++` }, c:false,
          fb:{ fr:`Les deux mots-clés existent dans les deux langages avec des rôles similaires.`, en:`Both keywords exist in both languages with similar roles.` } },
        { t:{ fr:`override est requis uniquement dans Unreal, pas en C++ standard`, en:`override is required only in Unreal, not in standard C++` }, c:false,
          fb:{ fr:`override est un mot-clé standard C++11, disponible partout.`, en:`override is a standard C++11 keyword, available everywhere.` } },
      ]
    },
    {
      id:'a10_2', type:'fill', xp:20,
      instr:{
        fr:`Complète la déclaration d'un Component dans le constructeur d'un Actor Unreal :`,
        en:`Complete the Component declaration in an Unreal Actor's constructor:`
      },
      template:{ fr:'Mesh = ______<UStaticMeshComponent>(TEXT("Mesh"));', en:'Mesh = ______<UStaticMeshComponent>(TEXT("Mesh"));' },
      answer:'CreateDefaultSubobject',
      hint:{ fr:"La fonction Unreal pour créer un Component dans le constructeur d'un Actor", en:"The Unreal function for creating a Component in an Actor's constructor" }
    },
    {
      id:'a10_3', type:'bug', xp:30,
      instr:{
        fr:`Cette tentative de surcharge de BeginPlay ne fonctionnera pas comme prévu. Pourquoi ?`,
        en:`This attempt to override BeginPlay won't work as expected. Why?`
      },
      bugCode:`<span class="kw2">void</span> <span class="fn2">BeginPlay</span>() {
    <span class="cm">// Ma logique custom</span>
    <span class="fn2">InitializeWeapon</span>();
    <span class="cm">// pas d'appel Super::</span>
}`,
      explanation:{
        fr:`Il manque Super::BeginPlay(). Sans cette ligne, toute la logique d'initialisation de AActor (et des classes intermédiaires comme APawn, ACharacter si applicable) est ignorée — Components non initialisés, Timers non démarrés, etc. Toujours appeler Super::BeginPlay() en premier dans ta surcharge.`,
        en:`Missing Super::BeginPlay(). Without it, all initialization logic of AActor (and intermediate classes like APawn, ACharacter if applicable) is skipped — uninitialized Components, Timers not started, etc. Always call Super::BeginPlay() first in your override.`
      }
    },
    {
      id:'a10_4', type:'engine', xp:40,
      label:{ fr:'Dans Unreal', en:'In Unreal' },
      task:{
        fr:`Dans le Third Person Character C++ template d'Unreal, ouvre le fichier .h du personnage. 1. Identifie les Components déclarés comme membres UPROPERTY() (CapsuleComponent, CharacterMovementComponent, etc.). 2. Dans le .cpp, trouve les CreateDefaultSubobject correspondants. 3. Trouve les méthodes marquées override. 4. Dans le .cpp, vérifie que chaque override appelle Super::.`,
        en:`In Unreal's Third Person Character C++ template, open the character's .h file. 1. Identify Components declared as UPROPERTY() members (CapsuleComponent, CharacterMovementComponent, etc.). 2. In the .cpp, find the corresponding CreateDefaultSubobject calls. 3. Find methods marked override. 4. In the .cpp, verify each override calls Super::.`
      },
      note:{
        fr:`Observer l'ordre dans le constructeur : les Components sont créés, puis configurés, dans un ordre précis.`,
        en:`Observe the order in the constructor: Components are created, then configured, in a specific order.`
      }
    },
    {
      id:'a10_5', type:'reflect', xp:10,
      prompt:{
        fr:`Tu as maintenant vu les deux approches : composition (Components) et héritage (sous-classes C++). Dans un projet de jeu concret que tu imagines, donne un exemple où tu utiliserais l'héritage, et un exemple où tu préférerais la composition. Pourquoi dans chaque cas ?`,
        en:`You've now seen both approaches: composition (Components) and inheritance (C++ subclasses). In a concrete game project you can imagine, give an example where you'd use inheritance, and one where you'd prefer composition. Why in each case?`
      }
    },
  ],
};

document.addEventListener('DOMContentLoaded', () => {
  const tp = document.getElementById('panel-tutor');
  const sp = document.getElementById('panel-student');
  if (tp) tp.innerHTML = renderTutorPanel(SESSION);
  if (sp) sp.innerHTML = renderStudentPanel(SESSION);
});
