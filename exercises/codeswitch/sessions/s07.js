'use strict';
// Session 07 — AActor & UObject
// IDE arc S07: first class — struct then class, constructor, members, methods

const SESSION = {
  id:'s07', num:7, prev:6, next:8, xp:120,
  blocName:{ fr:'Unreal Engine C++', en:'Unreal Engine C++' },
  blocColor:'#00587c',
  title:{ fr:'AActor & UObject', en:'AActor & UObject' },
  sub:{ fr:"L'équivalent de MonoBehaviour — et la hiérarchie Unreal", en:'The MonoBehaviour equivalent — and the Unreal hierarchy' },

  tutor:{
    concept:{
      fr:`En Unity, tout objet de scène hérite de MonoBehaviour. En Unreal, la hiérarchie est plus riche : UObject est la base de tout, AActor est pour les objets qui existent dans le monde, APawn peut être contrôlé, ACharacter est un personnage complet. Les macros UCLASS() et GENERATED_BODY() rendent la classe "visible" au moteur pour le GC, l'éditeur, et les Blueprints.`,
      en:`In Unity, every scene object inherits from MonoBehaviour. In Unreal, the hierarchy is richer: UObject is the base of everything, AActor is for objects that exist in the world, APawn can be controlled, ACharacter is a full character. The UCLASS() and GENERATED_BODY() macros make the class "visible" to the engine for the GC, editor, and Blueprints.`
    },
    deep:{
      fr:`<p><strong>La réflexion Unreal (UHT).</strong> UCLASS(), UPROPERTY(), UFUNCTION() sont des marqueurs traités par l'Unreal Header Tool avant la compilation C++. UHT génère des fichiers .generated.h qui injectent le code permettant au moteur de lister les propriétés d'une classe, de les sérialiser, de les exposer aux Blueprints, et de les gérer dans le GC.</p>
<p>C'est ce qui rend Unreal plus puissant que du C++ brut — et explique aussi les temps de compilation parfois longs. Quand tu vois "error: include of generated header must be last", c'est UHT qui parle.</p>`,
      en:`<p><strong>Unreal reflection (UHT).</strong> UCLASS(), UPROPERTY(), UFUNCTION() are markers processed by the Unreal Header Tool before C++ compilation. UHT generates .generated.h files that inject code allowing the engine to list class properties, serialize them, expose them to Blueprints, and manage them in the GC.</p>
<p>This is what makes Unreal more powerful than raw C++ — and also explains sometimes long compile times. When you see "error: include of generated header must be last", that's UHT talking.</p>`
    }
  },

  ide:{
    demoSteps:[
      {
        label:{ fr:'Première struct C++', en:'First C++ struct' },
        fr:`Dans VS Code, crée player.h et player.cpp. Dans player.h : struct Player { std::string name; int health; int score; };. Dans main.cpp, crée un Player : Player p; p.name = "Héros"; p.health = 100;. Compile et affiche. En C++, struct et class sont quasi identiques — la seule différence : les membres d'une struct sont public par défaut, ceux d'une class sont private.`,
        en:`In VS Code, create player.h and player.cpp. In player.h: struct Player { std::string name; int health; int score; };. In main.cpp, create a Player: Player p; p.name = "Hero"; p.health = 100;. Compile and print. In C++, struct and class are nearly identical — the only difference: struct members are public by default, class members are private.`
      },
      {
        label:{ fr:'Ajoute un constructeur', en:'Add a constructor' },
        fr:`Dans player.h, ajoute dans la struct : Player(std::string n, int h) : name(n), health(h), score(0) {}. C'est un constructeur avec initializer list — la façon idiomatique C++ d'initialiser les membres (plus efficace qu'assigner dans le corps). Montre que Player p("Héros", 100); fonctionne maintenant.`,
        en:`In player.h, add to the struct: Player(std::string n, int h) : name(n), health(h), score(0) {}. It's a constructor with initializer list — the idiomatic C++ way to initialize members (more efficient than assigning in the body). Show that Player p("Hero", 100); now works.`
      },
      {
        label:{ fr:'Ajoute des méthodes', en:'Add methods' },
        fr:`Déclare void takeDamage(int d); et bool isAlive() const; dans la struct (dans player.h). Implémente dans player.cpp : void Player::takeDamage(int d) { health -= d; } et bool Player::isAlive() const { return health > 0; }. Utilise dans main : p.takeDamage(30); cout << p.isAlive();. C'est une classe fonctionnelle — données + comportement.`,
        en:`Declare void takeDamage(int d); and bool isAlive() const; in the struct (in player.h). Implement in player.cpp: void Player::takeDamage(int d) { health -= d; } and bool Player::isAlive() const { return health > 0; }. Use in main: p.takeDamage(30); cout << p.isAlive();. It's a functional class — data + behavior.`
      },
    ],
    discussion:[
      { fr:`En C++, quelle est la seule différence entre struct et class ? Dans quels cas utilises-tu l'un ou l'autre par convention ?`, en:`In C++, what is the only difference between struct and class? When do you use one vs the other by convention?` },
    ],
    compare:{
      std:`<span class="cm">// C++ — struct avec méthodes</span>
<span class="kw2">struct</span> <span class="ty">Player</span> {
    std::<span class="ty">string</span> name;
    <span class="kw2">int</span> health;
    <span class="kw2">int</span> score;

    <span class="ty">Player</span>(std::<span class="ty">string</span> n, <span class="kw2">int</span> h)
        : name(n), health(h), score(<span class="num">0</span>) {}

    <span class="kw2">void</span> <span class="fn2">takeDamage</span>(<span class="kw2">int</span> d) { health -= d; }
    <span class="kw2">bool</span> <span class="fn2">isAlive</span>() <span class="kw2">const</span> {
        <span class="kw2">return</span> health &gt; <span class="num">0</span>;
    }
};`,
      unreal:`<span class="cm">// Unreal — AActor avec UCLASS</span>
<span class="mac">UCLASS</span>()
<span class="kw2">class</span> <span class="ty">APlayerChar</span>
    : <span class="kw2">public</span> <span class="ty">AActor</span>
{
    <span class="mac">GENERATED_BODY</span>()
<span class="kw2">private</span>:
    <span class="mac">UPROPERTY</span>()
    <span class="kw2">int32</span> Health = <span class="num">100</span>;
<span class="kw2">public</span>:
    <span class="kw2">void</span> <span class="fn2">TakeDamage</span>(<span class="kw2">int32</span> D);
    <span class="kw2">bool</span> <span class="fn2">IsAlive</span>() <span class="kw2">const</span>;
};`
    },
    activities:[
      {
        id:'i07_1', type:'predict', xp:15,
        code:`#include &lt;iostream&gt;
#include &lt;string&gt;
struct Point {
    float x, y;
    Point(float a, float b) : x(a), y(b) {}
    float sum() const { return x + y; }
};
int main() {
    Point p(3.0f, 4.5f);
    std::cout &lt;&lt; p.sum() &lt;&lt; std::endl;
    return 0;
}`,
        question:{ fr:`Quelle est la sortie ? Quel est le rôle du const après sum() ?`, en:`What is the output? What does const after sum() do?` },
        output:`7.5`,
        explanation:{ fr:`Sortie : 7.5 (3.0 + 4.5). const après la méthode garantit que sum() ne modifie pas les membres x et y de l'objet. Si sum() essayait de faire x = 0;, le compilateur refuserait.`, en:`Output: 7.5 (3.0 + 4.5). const after the method guarantees that sum() doesn't modify the object's x and y members. If sum() tried to do x = 0;, the compiler would refuse.` }
      },
      {
        id:'i07_2', type:'cpp', xp:35,
        instr:{ fr:`Crée une struct Vector2 avec deux membres float x et y, un constructeur qui les initialise, une méthode float length() const qui retourne sqrt(x*x + y*y), et une méthode void print() const qui affiche "(x, y)". Teste avec Vector2(3.0f, 4.0f) — length() devrait retourner 5.`, en:`Create a struct Vector2 with two float members x and y, a constructor that initializes them, a float length() const method that returns sqrt(x*x + y*y), and a void print() const method that displays "(x, y)". Test with Vector2(3.0f, 4.0f) — length() should return 5.` },
        stub:`#include &lt;iostream&gt;
#include &lt;cmath&gt;
// ta struct Vector2 ici / your Vector2 struct here

int main() {
    Vector2 v(3.0f, 4.0f);
    v.print();
    std::cout &lt;&lt; v.length() &lt;&lt; std::endl;
    return 0;
}`,
        hint:{ fr:`#include <cmath> pour sqrt(). Initializer list : Vector2(float a, float b) : x(a), y(b) {}`, en:`#include <cmath> for sqrt(). Initializer list: Vector2(float a, float b) : x(a), y(b) {}` },
        solution:{
          fr:`<pre style="font-family:var(--mono);font-size:1.3rem;line-height:1.8;color:#e0e8ef">#include &lt;iostream&gt;
#include &lt;cmath&gt;
struct Vector2 {
    float x, y;
    Vector2(float a, float b) : x(a), y(b) {}
    float length() const {
        return std::sqrt(x*x + y*y);
    }
    void print() const {
        std::cout &lt;&lt; "(" &lt;&lt; x &lt;&lt; ", " &lt;&lt; y &lt;&lt; ")" &lt;&lt; std::endl;
    }
};
int main() {
    Vector2 v(3.0f, 4.0f);
    v.print();
    std::cout &lt;&lt; v.length() &lt;&lt; std::endl;
    return 0;
}</pre><p style="margin-top:.8rem;font-size:1.4rem;color:var(--ch2)">Sortie : <code>(3, 4)</code> puis <code>5</code></p>`,
          en:`<pre style="font-family:var(--mono);font-size:1.3rem;line-height:1.8;color:#e0e8ef">#include &lt;iostream&gt;
#include &lt;cmath&gt;
struct Vector2 {
    float x, y;
    Vector2(float a, float b) : x(a), y(b) {}
    float length() const {
        return std::sqrt(x*x + y*y);
    }
    void print() const {
        std::cout &lt;&lt; "(" &lt;&lt; x &lt;&lt; ", " &lt;&lt; y &lt;&lt; ")" &lt;&lt; std::endl;
    }
};
int main() {
    Vector2 v(3.0f, 4.0f);
    v.print();
    std::cout &lt;&lt; v.length() &lt;&lt; std::endl;
    return 0;
}</pre><p style="margin-top:.8rem;font-size:1.4rem;color:var(--ch2)">Output: <code>(3, 4)</code> then <code>5</code></p>`
        }
      },
      {
        id:'i07_3', type:'bug', xp:20,
        instr:{ fr:`Cette méthode causera une erreur de compilation. Pourquoi ?`, en:`This method will cause a compilation error. Why?` },
        bugCode:`<span class="kw2">struct</span> <span class="ty">Counter</span> {
    <span class="kw2">int</span> count = <span class="num">0</span>;
    <span class="kw2">void</span> <span class="fn2">increment</span>() <span class="kw2">const</span> {
        <span class="bug-line">count++;</span>
    }
};`,
        explanation:{ fr:`const après la méthode promet que increment() ne modifie pas l'objet. Mais count++ modifie le membre count — contradiction. Le compilateur refuse. Correction : supprimer const, car cette méthode est par nature mutante.`, en:`const after the method promises that increment() doesn't modify the object. But count++ modifies the count member — contradiction. The compiler refuses. Fix: remove const, because this method is inherently mutating.` }
      },
      {
        id:'i07_4', type:'fill', xp:15,
        instr:{ fr:`Pour initialiser les membres d'un constructeur C++ de façon idiomatique, on utilise :`, en:`To initialize a C++ constructor's members idiomatically, you use:` },
        template:{ fr:'Player(std::string n, int h)\n    ______ name(n), health(h) {}', en:'Player(std::string n, int h)\n    ______ name(n), health(h) {}' },
        answer:':',
        hint:{ fr:`Le deux-points qui introduit l'initializer list`, en:`The colon that introduces the initializer list` }
      },
    ],
  },

  engine:{
    demoSteps:[
      {
        label:{ fr:'La hiérarchie : UObject → AActor → APawn → ACharacter', en:'The hierarchy: UObject → AActor → APawn → ACharacter' },
        fr:`Dessine la hiérarchie. UObject : base de tout, GC, réflexion. AActor : objet du monde avec Transform. APawn : peut être contrôlé par un Controller. ACharacter : personnage complet avec mouvement, CapsuleComponent, CharacterMovementComponent. En Unity, c'est un GameObject + différents Components qui font tout ça.`,
        en:`Draw the hierarchy. UObject: base of everything, GC, reflection. AActor: world object with Transform. APawn: can be controlled by a Controller. ACharacter: full character with movement, CapsuleComponent, CharacterMovementComponent. In Unity, it's a GameObject + various Components that do all this.`
      },
      {
        label:{ fr:'Préfixes de nommage Unreal', en:'Unreal naming prefixes' },
        fr:`Les conventions Unreal sont strictes : A = Actor (hérite de AActor), U = UObject non-Actor, F = struct, T = template/container, I = interface, E = enum. Montre des exemples : APlayerCharacter, UHealthComponent, FVector, TArray<int32>, IDamageable, EWeaponType. Ce n'est pas esthétique mais permet de savoir instantanément de quel type on parle.`,
        en:`Unreal conventions are strict: A = Actor (inherits from AActor), U = non-Actor UObject, F = struct, T = template/container, I = interface, E = enum. Show examples: APlayerCharacter, UHealthComponent, FVector, TArray<int32>, IDamageable, EWeaponType. Not pretty but lets you instantly know what type you're looking at.`
      },
      {
        label:{ fr:'UCLASS() et GENERATED_BODY()', en:'UCLASS() and GENERATED_BODY()' },
        fr:`Crée un Actor C++ vide. Montre UCLASS() et GENERATED_BODY() dans le .h. UCLASS() expose la classe au moteur (GC, éditeur, Blueprints, sérialisation). GENERATED_BODY() injecte le code généré par UHT. Sans l'un ou l'autre, la classe C++ fonctionne mais est invisible au moteur. Montre ce qui se passe si on commente GENERATED_BODY().`,
        en:`Create an empty C++ Actor. Show UCLASS() and GENERATED_BODY() in the .h. UCLASS() exposes the class to the engine (GC, editor, Blueprints, serialization). GENERATED_BODY() injects the code generated by UHT. Without either, the C++ class works but is invisible to the engine. Show what happens if you comment out GENERATED_BODY().`
      },
    ],
    discussion:[
      { fr:`En Unity, quelle est la différence entre un GameObject et un Component ? Comment ça se traduit dans la hiérarchie AActor / UActorComponent d'Unreal ?`, en:`In Unity, what's the difference between a GameObject and a Component? How does that translate into Unreal's AActor / UActorComponent hierarchy?` },
    ],
    compare:{
      cs:`<span class="cm">// Unity — MonoBehaviour</span>
<span class="kw">public class</span> <span class="ty">EnemyAI</span>
    : <span class="ty">MonoBehaviour</span>
{
    <span class="kw">void</span> <span class="fn">Start</span>() { }
    <span class="kw">void</span> <span class="fn">Update</span>() { }
}`,
      cpp:`<span class="cm">// Unreal — AActor</span>
<span class="mac">UCLASS</span>()
<span class="kw2">class</span> <span class="ty">AEnemyAI</span>
    : <span class="kw2">public</span> <span class="ty">AActor</span>
{
    <span class="mac">GENERATED_BODY</span>()
<span class="kw2">public</span>:
    <span class="kw2">virtual void</span> <span class="fn2">BeginPlay</span>() <span class="kw2">override</span>;
    <span class="kw2">virtual void</span> <span class="fn2">Tick</span>(<span class="kw2">float</span> D) <span class="kw2">override</span>;
};`
    },
    activities:[
      {
        id:'e07_1', type:'quiz', xp:15,
        q:{ fr:`Dans la convention de nommage Unreal, quel préfixe utilise-t-on pour une struct (ex. une struct qui représente un vecteur 2D) ?`, en:`In Unreal naming convention, what prefix is used for a struct (e.g. a struct representing a 2D vector)?` },
        choices:[
          { t:'A', c:false, fb:{ fr:`A est pour les classes qui héritent de AActor.`, en:`A is for classes that inherit from AActor.` } },
          { t:'U', c:false, fb:{ fr:`U est pour les classes qui héritent de UObject mais pas Actor.`, en:`U is for classes that inherit from UObject but not Actor.` } },
          { t:'F', c:true, fb:{ fr:`Correct. F est le préfixe des structs Unreal : FVector, FRotator, FString, FHitResult…`, en:`Correct. F is the prefix for Unreal structs: FVector, FRotator, FString, FHitResult…` } },
          { t:'T', c:false, fb:{ fr:`T est pour les templates et containers : TArray, TMap, TSharedPtr…`, en:`T is for templates and containers: TArray, TMap, TSharedPtr…` } },
        ]
      },
      {
        id:'e07_2', type:'fill', xp:20,
        instr:{ fr:`Cette macro est obligatoire dans toute classe UCLASS() — elle injecte le code de réflexion généré par UHT :`, en:`This macro is mandatory in any UCLASS() class — it injects the reflection code generated by UHT:` },
        template:{ fr:'UCLASS()\nclass AMyActor : public AActor {\n    ______\n};', en:'UCLASS()\nclass AMyActor : public AActor {\n    ______\n};' },
        answer:'GENERATED_BODY()',
        hint:{ fr:`La macro que tu vois dans tous les headers Unreal, juste après l'ouverture de la classe`, en:`The macro you see in every Unreal header, right after the class opening` }
      },
      {
        id:'e07_3', type:'bug', xp:25,
        instr:{ fr:`Ce header Unreal provoquera des erreurs cryptiques à la compilation. Qu'est-ce qui manque ?`, en:`This Unreal header will cause cryptic compilation errors. What's missing?` },
        bugCode:`<span class="mac">UCLASS</span>()
<span class="kw2">class</span> <span class="ty">AWeapon</span> : <span class="kw2">public</span> <span class="ty">AActor</span>
{
    <span class="bug-line"><span class="cm">// manque quelque chose ici</span></span>
<span class="kw2">public</span>:
    <span class="kw2">void</span> <span class="fn2">Fire</span>();
    <span class="kw2">float</span> Damage = <span class="num">10.0f</span>;
};`,
        explanation:{ fr:`Il manque GENERATED_BODY() juste après l'ouverture de la classe. Cette macro est obligatoire dans toute classe UCLASS() — sans elle, l'Unreal Header Tool ne peut pas injecter son code, et les erreurs de compilation sont cryptiques et difficiles à diagnostiquer.`, en:`Missing GENERATED_BODY() right after the class opening. This macro is mandatory in any UCLASS() class — without it, the Unreal Header Tool can't inject its code, and compilation errors are cryptic and hard to diagnose.` }
      },
      {
        id:'e07_4', type:'engine', xp:40,
        label:{ fr:'Dans Unity + Unreal', en:'In Unity + Unreal' },
        task:{ fr:`1. Dans Unity : ouvre un MonoBehaviour et liste ses méthodes de cycle de vie (Start, Update, OnTriggerEnter, OnDestroy, etc.) dans un fichier texte. 2. Dans Unreal : ouvre un AActor C++ généré et liste ses équivalents (BeginPlay, Tick, NotifyActorBeginOverlap, EndPlay, etc.). 3. Fais une table de correspondance à deux colonnes. 4. Trouve au moins un cycle de vie présent dans Unreal mais sans équivalent direct en Unity.`, en:`1. In Unity: open a MonoBehaviour and list its lifecycle methods (Start, Update, OnTriggerEnter, OnDestroy, etc.) in a text file. 2. In Unreal: open a generated C++ AActor and list its equivalents (BeginPlay, Tick, NotifyActorBeginOverlap, EndPlay, etc.). 3. Make a two-column correspondence table. 4. Find at least one lifecycle event in Unreal with no direct Unity equivalent.` },
        note:{ fr:`Cette table sera utile pour les sessions suivantes.`, en:`This table will be useful for upcoming sessions.` }
      },
    ],
  },

  homework:{
    core:[
      {diff:'easy', fr:'Crée une classe Point avec x et y, un constructeur avec liste d\'initialisation, et une méthode print() const. Instancie-la dans main().', en:'Create a Point class with x and y, a constructor with initializer list, and a const print() method. Instantiate it in main().'},
      {diff:'medium', fr:'Ajoute une méthode distanceTo(const Point& other) const à ta classe Point. Utilise sqrt() de <cmath>. Teste avec deux points connus.', en:'Add a distanceTo(const Point& other) const method to your Point class. Use sqrt() from <cmath>. Test with two known points.'},
      {diff:'hard', fr:'Crée une classe Shape abstraite avec virtual float area() const = 0. Dérive Circle et Rectangle. Stocke-les dans un vector<Shape*> et appelle area() sur chacun. N\'oublie pas les destructeurs virtuels.', en:'Create an abstract Shape class with virtual float area() const = 0. Derive Circle and Rectangle. Store them in a vector<Shape*> and call area() on each. Don\'t forget virtual destructors.'},
    ],
    ide:[
      {diff:'medium', fr:'Sépare ta classe Shape en shape.h/shape.cpp, circle.h/circle.cpp, rectangle.h/rectangle.cpp. Écris le Makefile ou la commande g++ pour compiler tous ces fichiers ensemble.', en:'Separate your Shape class into shape.h/shape.cpp, circle.h/circle.cpp, rectangle.h/rectangle.cpp. Write the Makefile or g++ command to compile all these files together.'},
    ],
    engine:[
      {diff:'medium', fr:'Crée un Actor C++ vide dans Unreal. Identifie dans le .h généré : UCLASS(), GENERATED_BODY(), BeginPlay(), Tick(). À quoi correspond chacun en Unity ?', en:'Create an empty C++ Actor in Unreal. Identify in the generated .h: UCLASS(), GENERATED_BODY(), BeginPlay(), Tick(). What does each correspond to in Unity?'},
    ],
  },
};
document.addEventListener('DOMContentLoaded',()=>{});
