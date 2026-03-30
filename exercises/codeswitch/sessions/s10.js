'use strict';
// Session 10 — Composants & Héritage
// IDE arc S10: inheritance — base class, derived class, virtual/override, super call

const SESSION = {
  id:'s10', num:10, prev:9, next:11, xp:120,
  blocName:{ fr:'Unreal Engine C++', en:'Unreal Engine C++' },
  blocColor:'#00587c',
  title:{ fr:'Composants & Héritage', en:'Components & Inheritance' },
  sub:{ fr:'GetComponent vs FindComponentByClass, héritage C++', en:'GetComponent vs FindComponentByClass, C++ inheritance' },

  tutor:{
    concept:{
      fr:`Unity est très orienté composition — tout se fait avec des Components sur un GameObject. Unreal supporte les deux : composition (UActorComponent) ET héritage C++ natif. En C++, l'héritage est plus explicite qu'en C# : les mots-clés virtual, override, et l'appel Super:: sont essentiels. Cette session couvre les deux approches et les conventions Unreal pour chacune.`,
      en:`Unity is heavily composition-oriented — everything is done with Components on a GameObject. Unreal supports both: composition (UActorComponent) AND native C++ inheritance. In C++, inheritance is more explicit than in C#: virtual, override, and the Super:: call are essential. This session covers both approaches and Unreal conventions for each.`
    },
    deep:{
      fr:`<p><strong>Interfaces en C++ Unreal.</strong> Comme en C#, Unreal a des interfaces (<code>UInterface</code> + <code>IMyInterface</code>) pour le polymorphisme sans héritage fort. Exemple classique : <code>IDamageable</code> — tout Actor implémentant cette interface peut recevoir des dégâts.</p>
<p>La déclaration en deux classes (UDamageable pour le moteur, IDamageable pour le code) est verbeuse mais conceptuellement identique aux interfaces C#. Tu les croiseras dans les systèmes de dommages, d'interaction, et de collision.</p>`,
      en:`<p><strong>Interfaces in Unreal C++.</strong> Like C#, Unreal has interfaces (<code>UInterface</code> + <code>IMyInterface</code>) for polymorphism without strong inheritance. Classic example: <code>IDamageable</code> — any Actor implementing this interface can receive damage.</p>
<p>The two-class declaration (UDamageable for the engine, IDamageable for code) is verbose but conceptually identical to C# interfaces. You'll encounter them in damage, interaction, and collision systems.</p>`
    }
  },

  ide:{
    demoSteps:[
      {
        label:{ fr:'Classe de base avec virtual', en:'Base class with virtual' },
        fr:`Crée une classe Entity avec virtual void describe() const { cout << "Entity"; }. Crée Player : public Entity avec void describe() const override { Entity::describe(); cout << " + Player"; }. Le mot virtual dans Entity dit "cette méthode peut être redéfinie". Le mot override dans Player dit "je redéfinis une méthode virtuelle existante". Montre que sans override, une faute de frappe créerait silencieusement une nouvelle méthode.`,
        en:`Create an Entity class with virtual void describe() const { cout << "Entity"; }. Create Player : public Entity with void describe() const override { Entity::describe(); cout << " + Player"; }. The word virtual in Entity says "this method can be redefined". The word override in Player says "I'm redefining an existing virtual method". Show that without override, a typo would silently create a new method.`
      },
      {
        label:{ fr:'Polymorphisme — le vrai intérêt', en:'Polymorphism — the real value' },
        fr:`Crée un pointeur de base : Entity* e = new Player("Héros", 100); e->describe();. Sortie : "Entity + Player" — la version de Player est appelée même via un pointeur Entity. C'est le polymorphisme dynamique. Montre la différence si describe() n'est pas virtual — la version d'Entity serait appelée.`,
        en:`Create a base pointer: Entity* e = new Player("Hero", 100); e->describe();. Output: "Entity + Player" — Player's version is called even through an Entity pointer. That's dynamic polymorphism. Show the difference if describe() isn't virtual — Entity's version would be called.`
      },
      {
        label:{ fr:'Destructeur virtual — obligation', en:'Virtual destructor — obligation' },
        fr:`Si Entity est une classe de base avec des classes dérivées, son destructeur DOIT être virtual. Montre : sans ~Entity() virtual, delete sur un pointeur Entity* pointant un Player ne appellera pas le destructeur de Player — memory leak et comportement indéfini. Ajoute virtual ~Entity() {} et montre la correction.`,
        en:`If Entity is a base class with derived classes, its destructor MUST be virtual. Show: without virtual ~Entity(), delete on an Entity* pointing to a Player won't call Player's destructor — memory leak and undefined behavior. Add virtual ~Entity() {} and show the fix.`
      },
    ],
    discussion:[
      { fr:`En C++, quand utilises-tu l'héritage et quand préfères-tu la composition ? Donne un exemple de chaque dans le contexte d'un jeu.`, en:`In C++, when do you use inheritance and when do you prefer composition? Give an example of each in a game context.` },
    ],
    compare:{
      std:`<span class="cm">// C++ standard — héritage</span>
<span class="kw2">class</span> <span class="ty">Entity</span> {
<span class="kw2">public</span>:
    <span class="kw2">virtual void</span> <span class="fn2">describe</span>() <span class="kw2">const</span>;
    <span class="kw2">virtual</span> ~<span class="ty">Entity</span>() {}
};
<span class="kw2">class</span> <span class="ty">Player</span> : <span class="kw2">public</span> <span class="ty">Entity</span> {
<span class="kw2">public</span>:
    <span class="kw2">void</span> <span class="fn2">describe</span>() <span class="kw2">const override</span> {
        <span class="ty">Entity</span>::<span class="fn2">describe</span>();
        <span class="cm">// + logique Player</span>
    }
};`,
      unreal:`<span class="cm">// Unreal — même pattern + macros</span>
<span class="mac">UCLASS</span>()
<span class="kw2">class</span> <span class="ty">ABaseChar</span>
    : <span class="kw2">public</span> <span class="ty">ACharacter</span>
{
    <span class="mac">GENERATED_BODY</span>()
<span class="kw2">public</span>:
    <span class="kw2">virtual void</span> <span class="fn2">BeginPlay</span>() <span class="kw2">override</span> {
        <span class="kw2">Super</span>::<span class="fn2">BeginPlay</span>();
    }
};`
    },
    activities:[
      {
        id:'i10_1', type:'predict', xp:15,
        code:`#include &lt;iostream&gt;
class Shape {
public:
    virtual float area() const { return 0.0f; }
};
class Circle : public Shape {
    float r;
public:
    Circle(float r) : r(r) {}
    float area() const override { return 3.14f * r * r; }
};
int main() {
    Shape* s = new Circle(5.0f);
    std::cout &lt;&lt; s-&gt;area() &lt;&lt; std::endl;
    delete s;
    return 0;
}`,
        question:{ fr:`s est un Shape* qui pointe un Circle. Quelle méthode area() est appelée — et pourquoi ?`, en:`s is a Shape* pointing to a Circle. Which area() method is called — and why?` },
        output:`78.5`,
        explanation:{ fr:`Circle::area() est appelée, pas Shape::area(). Parce que area() est déclarée virtual dans Shape : C++ utilise le vrai type de l'objet (Circle) pour résoudre l'appel, pas le type du pointeur (Shape*). C'est le dispatch dynamique — la magie du polymorphisme.`, en:`Circle::area() is called, not Shape::area(). Because area() is declared virtual in Shape: C++ uses the object's actual type (Circle) to resolve the call, not the pointer type (Shape*). That's dynamic dispatch — the magic of polymorphism.` }
      },
      {
        id:'i10_2', type:'cpp', xp:40,
        instr:{ fr:`Crée une classe de base Animal avec virtual std::string sound() const = 0; (méthode purement virtuelle — la classe est abstraite). Crée Dog et Cat qui héritent de Animal et implémentent sound() (respectivement "Woof" et "Meow"). Dans main(), crée un vecteur de pointeurs Animal*, ajoute un Dog et un Cat, et appelle sound() sur chacun.`, en:`Create a base class Animal with virtual std::string sound() const = 0; (purely virtual method — the class is abstract). Create Dog and Cat that inherit from Animal and implement sound() ("Woof" and "Meow" respectively). In main(), create a vector of Animal* pointers, add a Dog and a Cat, and call sound() on each.` },
        stub:`#include &lt;iostream&gt;
#include &lt;vector&gt;
#include &lt;string&gt;
class Animal {
public:
    virtual std::string sound() const = 0;
    virtual ~Animal() {}
};
// Dog et Cat ici / Dog and Cat here

int main() {
    std::vector&lt;Animal*&gt; animals;
    // ajoute Dog et Cat / add Dog and Cat
    // appelle sound() sur chacun / call sound() on each
    // libère la mémoire / free memory
    return 0;
}`,
        hint:{ fr:`= 0 dans la déclaration rend la méthode purement virtuelle — Animal ne peut pas être instancié directement.`, en:`= 0 in the declaration makes the method purely virtual — Animal cannot be instantiated directly.` },
        solution:{
          fr:`<pre style="font-family:var(--mono);font-size:1.3rem;line-height:1.8;color:#e0e8ef">class Dog : public Animal {
public:
    std::string sound() const override { return "Woof"; }
};
class Cat : public Animal {
public:
    std::string sound() const override { return "Meow"; }
};
int main() {
    std::vector&lt;Animal*&gt; animals;
    animals.push_back(new Dog());
    animals.push_back(new Cat());
    for(auto* a : animals)
        std::cout &lt;&lt; a-&gt;sound() &lt;&lt; std::endl;
    for(auto* a : animals) delete a;
    return 0;
}</pre><p style="margin-top:.8rem;font-size:1.4rem;color:var(--ch2)">Sortie : <code>Woof</code> puis <code>Meow</code></p>`,
          en:`<pre style="font-family:var(--mono);font-size:1.3rem;line-height:1.8;color:#e0e8ef">class Dog : public Animal {
public:
    std::string sound() const override { return "Woof"; }
};
class Cat : public Animal {
public:
    std::string sound() const override { return "Meow"; }
};
int main() {
    std::vector&lt;Animal*&gt; animals;
    animals.push_back(new Dog());
    animals.push_back(new Cat());
    for(auto* a : animals)
        std::cout &lt;&lt; a-&gt;sound() &lt;&lt; std::endl;
    for(auto* a : animals) delete a;
    return 0;
}</pre><p style="margin-top:.8rem;font-size:1.4rem;color:var(--ch2)">Output: <code>Woof</code> then <code>Meow</code></p>`
        }
      },
      {
        id:'i10_3', type:'bug', xp:20,
        instr:{ fr:`Ce code a un problème de polymorphisme. La mauvaise méthode sera appelée — explique pourquoi et corrige.`, en:`This code has a polymorphism problem. The wrong method will be called — explain why and fix it.` },
        bugCode:`<span class="kw2">class</span> <span class="ty">Enemy</span> {
<span class="kw2">public</span>:
    <span class="bug-line"><span class="kw2">void</span> <span class="fn2">attack</span>() { <span class="cm">/* ... */</span> }</span>
};
<span class="kw2">class</span> <span class="ty">Boss</span> : <span class="kw2">public</span> <span class="ty">Enemy</span> {
<span class="kw2">public</span>:
    <span class="kw2">void</span> <span class="fn2">attack</span>() { <span class="cm">/* attaque spéciale */</span> }
};
<span class="cm">// ailleurs :</span>
<span class="ty">Enemy</span>* e = <span class="kw2">new</span> <span class="ty">Boss</span>();
e-&gt;<span class="fn2">attack</span>(); <span class="cm">// appelle Enemy::attack() !</span>`,
        explanation:{ fr:`attack() n'est pas déclarée virtual dans Enemy. C++ utilise le type statique du pointeur (Enemy*) pour résoudre l'appel — Enemy::attack() est appelée, pas Boss::attack(). Correction : déclarer virtual void attack() dans Enemy. Avec virtual, C++ utilise le type réel de l'objet (Boss) — Boss::attack() sera appelée.`, en:`attack() is not declared virtual in Enemy. C++ uses the static type of the pointer (Enemy*) to resolve the call — Enemy::attack() is called, not Boss::attack(). Fix: declare virtual void attack() in Enemy. With virtual, C++ uses the object's actual type (Boss) — Boss::attack() will be called.` }
      },
      {
        id:'i10_4', type:'fill', xp:15,
        instr:{ fr:`Pour confirmer au compilateur qu'une méthode surcharge bien une méthode virtuelle parente (et détecter les fautes de frappe) :`, en:`To confirm to the compiler that a method is overriding a parent virtual method (and detect typos):` },
        template:{ fr:'void attack() ______;', en:'void attack() ______;' },
        answer:'override',
        hint:{ fr:`Le mot-clé C++11 qui garantit que la méthode surcharge bien quelque chose d'existant dans la classe parente`, en:`The C++11 keyword that guarantees the method overrides something existing in the parent class` }
      },
    ],
  },

  engine:{
    demoSteps:[
      {
        label:{ fr:'CreateDefaultSubobject — créer un Component dans le constructeur', en:'CreateDefaultSubobject — creating a Component in the constructor' },
        fr:`La façon Unreal de créer des Components : dans le constructeur, Mesh = CreateDefaultSubobject<UStaticMeshComponent>(TEXT("Mesh")). Ça crée le Component, l'attache à l'Actor, et le rend visible dans l'éditeur. Montre SetRootComponent() et SetupAttachment(). C'est l'équivalent d'AddComponent() au démarrage en Unity.`,
        en:`The Unreal way to create Components: in the constructor, Mesh = CreateDefaultSubobject<UStaticMeshComponent>(TEXT("Mesh")). This creates the Component, attaches it to the Actor, and makes it visible in the editor. Show SetRootComponent() and SetupAttachment(). It's the equivalent of AddComponent() at startup in Unity.`
      },
      {
        label:{ fr:'virtual + override — héritage explicite', en:'virtual + override — explicit inheritance' },
        fr:`Montre BeginPlay() avec virtual et override. virtual dans AActor dit que la méthode peut être redéfinie. override dans la sous-classe confirme qu'on la redéfinit. Le piège : sans override, une faute de frappe dans le nom crée silencieusement une nouvelle méthode au lieu de surcharger. Exemple : "BeginPIay" avec i majuscule — compile mais ne sera jamais appelé.`,
        en:`Show BeginPlay() with virtual and override. virtual in AActor says the method can be redefined. override in the subclass confirms we're redefining it. The trap: without override, a typo in the name silently creates a new method instead of overriding. Example: "BeginPIay" with capital i — compiles but will never be called.`
      },
      {
        label:{ fr:'FindComponentByClass = GetComponent — avec null check', en:'FindComponentByClass = GetComponent — with null check' },
        fr:`Montre UStaticMeshComponent* Mesh = FindComponentByClass<UStaticMeshComponent>(). Compare avec GetComponent<MeshRenderer>() en Unity. Logique identique. Différence : en Unreal, les Components sont souvent déclarés comme membres UPROPERTY() — accessible directement sans chercher, ce qui est plus propre et plus sûr.`,
        en:`Show UStaticMeshComponent* Mesh = FindComponentByClass<UStaticMeshComponent>(). Compare with GetComponent<MeshRenderer>() in Unity. Identical logic. Difference: in Unreal, Components are often declared as UPROPERTY() members — accessible directly without searching, which is cleaner and safer.`
      },
    ],
    discussion:[
      { fr:`Unreal supporte à la fois l'héritage (sous-classes C++) et la composition (Components). Pour une mécanique de vol, utiliserais-tu un Component UFloatComponent ou une sous-classe AFlyingActor ? Justifie.`, en:`Unreal supports both inheritance (C++ subclasses) and composition (Components). For a flight mechanic, would you use a UFloatComponent component or an AFlyingActor subclass? Justify.` },
    ],
    compare:{
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
<span class="cm">// créé dans le constructeur</span>
Mesh-&gt;<span class="fn2">SetSimulatePhysics</span>(<span class="kw2">true</span>);

<span class="cm">// Héritage C++</span>
<span class="kw2">virtual void</span> <span class="fn2">BeginPlay</span>() <span class="kw2">override</span> {
    <span class="kw2">Super</span>::<span class="fn2">BeginPlay</span>();
}`
    },
    activities:[
      {
        id:'e10_1', type:'quiz', xp:15,
        q:{ fr:`En C++, quelle est la différence entre virtual et override ?`, en:`In C++, what is the difference between virtual and override?` },
        choices:[
          { t:{ fr:`virtual et override sont synonymes`, en:`virtual and override are synonyms` }, c:false, fb:{ fr:`Non — virtual déclare qu'une méthode PEUT être surchargée. override confirme qu'on surcharge une méthode virtuelle existante.`, en:`No — virtual declares a method CAN be overridden. override confirms we're overriding an existing virtual method.` } },
          { t:{ fr:`virtual déclare la méthode comme surchargeable dans la classe parente ; override confirme la surcharge dans la classe enfant`, en:`virtual declares the method as overridable in the parent class; override confirms the override in the child class` }, c:true, fb:{ fr:`Correct. override est aussi un filet de sécurité : une faute de frappe dans le nom provoquera une erreur de compilation plutôt qu'une nouvelle méthode silencieuse.`, en:`Correct. override is also a safety net: a typo in the method name will cause a compilation error rather than a silent new method.` } },
          { t:{ fr:`virtual est en C# ; override est en C++`, en:`virtual is in C#; override is in C++` }, c:false, fb:{ fr:`Les deux mots-clés existent dans les deux langages avec des rôles similaires.`, en:`Both keywords exist in both languages with similar roles.` } },
          { t:{ fr:`override empêche les sous-classes de surcharger à nouveau`, en:`override prevents sub-subclasses from overriding again` }, c:false, fb:{ fr:`Pour empêcher une nouvelle surcharge, on utilise final (ex. void attack() override final). override seul n'empêche rien.`, en:`To prevent further overriding, use final (e.g. void attack() override final). override alone doesn't prevent anything.` } },
        ]
      },
      {
        id:'e10_2', type:'fill', xp:20,
        instr:{ fr:`Complète la déclaration d'un Component dans le constructeur d'un Actor Unreal :`, en:`Complete the Component declaration in an Unreal Actor's constructor:` },
        template:{ fr:'Mesh = ______<UStaticMeshComponent>(TEXT("Mesh"));', en:'Mesh = ______<UStaticMeshComponent>(TEXT("Mesh"));' },
        answer:'CreateDefaultSubobject',
        hint:{ fr:`La fonction Unreal pour créer et enregistrer un Component dans le constructeur`, en:`The Unreal function to create and register a Component in the constructor` }
      },
      {
        id:'e10_3', type:'bug', xp:25,
        instr:{ fr:`Cette tentative de surcharge ne fonctionnera pas comme prévu. Pourquoi ?`, en:`This override attempt won't work as expected. Why?` },
        bugCode:`<span class="kw2">void</span> <span class="fn2">BeginPlay</span>() {
    <span class="cm">// Ma logique d'init</span>
    <span class="fn2">SpawnEnemy</span>();
    <span class="bug-line"><span class="cm">// pas de Super::</span></span>
}`,
        explanation:{ fr:`L'absence de Super::BeginPlay() ignore toute la logique d'initialisation d'AActor et des classes intermédiaires (APawn, ACharacter si applicable). Les Components peuvent ne pas s'initialiser correctement, les Timers peuvent ne pas démarrer, l'état réseau peut être incorrect. Toujours appeler Super::BeginPlay() en premier.`, en:`Missing Super::BeginPlay() skips all initialization logic of AActor and intermediate classes (APawn, ACharacter if applicable). Components may not initialize correctly, Timers may not start, network state may be incorrect. Always call Super::BeginPlay() first.` }
      },
      {
        id:'e10_4', type:'engine', xp:40,
        label:{ fr:'Dans Unreal', en:'In Unreal' },
        task:{ fr:`1. Dans le Third Person Character C++ template, ouvre le .h. Identifie les Components déclarés comme membres UPROPERTY() (CapsuleComponent, Mesh, CharacterMovementComponent). 2. Dans le .cpp, trouve les CreateDefaultSubobject correspondants dans le constructeur. 3. Trouve les méthodes marquées override et vérifie que chaque implémentation dans le .cpp appelle Super::. 4. Crée un Actor C++ avec deux Components : UStaticMeshComponent comme RootComponent et USphereComponent attaché au mesh.`, en:`1. In the Third Person Character C++ template, open the .h. Identify Components declared as UPROPERTY() members (CapsuleComponent, Mesh, CharacterMovementComponent). 2. In the .cpp, find the corresponding CreateDefaultSubobject calls in the constructor. 3. Find methods marked override and verify each implementation in the .cpp calls Super::. 4. Create a C++ Actor with two Components: UStaticMeshComponent as RootComponent and USphereComponent attached to the mesh.` },
        note:{ fr:`Observer l'ordre dans le constructeur : les Components sont créés puis configurés dans un ordre précis.`, en:`Observe the order in the constructor: Components are created then configured in a specific order.` }
      },
    ],
  },
};
document.addEventListener('DOMContentLoaded',()=>{});
