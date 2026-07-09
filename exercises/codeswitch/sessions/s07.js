'use strict';
// Session 07 — Structs & Classes
// Pure C++ — no Unreal content. Comes after memory/ownership, before Unreal class system.

const SESSION = {
  id:'s07', num:7, prev:6, next:8, xp:120,
  blocName:{ fr:'Ce qui change vraiment', en:'What Really Changes' },
  blocColor:'#f2f537',
  title:{ fr:'Structs & Classes', en:'Structs & Classes' },
  sub:{ fr:'struct, class, membres, constructeurs, encapsulation — le C++ avant Unreal', en:'struct, class, members, constructors, encapsulation — C++ before Unreal' },
  compare:{
    std:`<span class="cm">// C# : class uniquement (struct = type valeur différent)</span>
<span class="kw">public class</span> <span class="ty">Player</span> {
    <span class="kw">public string</span> Name { <span class="kw">get</span>; <span class="kw">set</span>; }
    <span class="kw">private int</span> health;
    <span class="kw">public</span> <span class="ty">Player</span>(<span class="kw">string</span> name, <span class="kw">int</span> hp) {
        Name = name; health = hp;
    }
    <span class="kw">public void</span> <span class="fn">TakeDamage</span>(<span class="kw">int</span> d) { health -= d; }
    <span class="kw">public bool</span> <span class="fn">IsAlive</span>() => health > <span class="num">0</span>;
}`,
    cpp:`<span class="cm">// C++ : struct et class — même chose, accès par défaut différent</span>
<span class="kw">class</span> <span class="ty">Player</span> {               <span class="cm">// struct Player { — quasi identique</span>
<span class="kw">public</span>:
    <span class="ty">std::string</span> name;
    <span class="ty">Player</span>(<span class="ty">std::string</span> n, <span class="kw">int</span> hp)
        : name(n), health(hp) {}
    <span class="kw">void</span> <span class="fn">takeDamage</span>(<span class="kw">int</span> d) { health -= d; }
    <span class="kw">bool</span> <span class="fn">isAlive</span>() <span class="kw">const</span>    { <span class="kw">return</span> health > <span class="num">0</span>; }
<span class="kw">private</span>:
    <span class="kw">int</span> health;
};`
  },

  ide:{
    demoSteps:[
      {
        label:{ fr:'struct — données groupées, accès public par défaut', en:'struct — grouped data, public by default' },
        fr:`Crée player.h. Écris : struct Player { std::string name; int health; int score; };. Dans main.cpp : Player p; p.name = "Héros"; p.health = 100; p.score = 0;. Compile et affiche. En C++, struct regroupe des données — tous les membres sont publics par défaut. C'est le choix idiomatique pour les données simples sans logique propre.`,
        en:`Create player.h. Write: struct Player { std::string name; int health; int score; };. In main.cpp: Player p; p.name = "Héros"; p.health = 100; p.score = 0;. Compile and print. In C++, struct groups data — all members are public by default. It's the idiomatic choice for simple data without its own logic.`
      },
      {
        label:{ fr:'Constructeur et initializer list', en:'Constructor and initializer list' },
        fr:`Ajoute dans la struct : Player(std::string n, int hp) : name(n), health(hp), score(0) {}. C'est l'initializer list — la façon idiomatique C++ d'initialiser les membres. Plus efficace que d'assigner dans le corps (construit directement, pas construit puis assigné). Montre que Player p("Héros", 100); fonctionne. Insiste : l'ordre dans l'initializer list doit suivre l'ordre de déclaration des membres.`,
        en:`Add to the struct: Player(std::string n, int hp) : name(n), health(hp), score(0) {}. This is the initializer list — the idiomatic C++ way to initialise members. More efficient than assigning in the body (constructs directly, not construct then assign). Show that Player p("Héros", 100); works. Note: the order in the initializer list must follow the declaration order of members.`
      },
      {
        label:{ fr:'Méthodes et const — donner du comportement', en:'Methods and const — giving behaviour' },
        fr:`Déclare dans player.h : void takeDamage(int d); et bool isAlive() const;. Implémente dans player.cpp : void Player::takeDamage(int d) { health -= d; } bool Player::isAlive() const { return health > 0; }. Le mot-clé const après la signature garantit que la méthode ne modifie pas l'objet — le compilateur l'enforce. Utilise : p.takeDamage(30); cout << p.isAlive();. Une struct avec constructeur et méthodes est fonctionnellement une classe — la différence n'est que l'accès par défaut.`,
        en:`Declare in player.h: void takeDamage(int d); and bool isAlive() const;. Implement in player.cpp: void Player::takeDamage(int d) { health -= d; } bool Player::isAlive() const { return health > 0; }. The const keyword after the signature guarantees the method doesn't modify the object — the compiler enforces it. Use: p.takeDamage(30); cout << p.isAlive();. A struct with a constructor and methods is functionally a class — the difference is only default access.`
      },
      {
        label:{ fr:'class : private par défaut — encapsulation explicite', en:'class : private by default — explicit encapsulation' },
        fr:`Refactorise en class Player. La seule différence : members are private by default. Montre que p.health = 50; ne compile plus — erreur : health is private. Ajoute public: au-dessus de name et du constructeur. Garde health dans private:. Ajoute int getHealth() const { return health; } et void setHealth(int h) { if(h >= 0) health = h; }. Insiste : private protège l'invariant — setHealth valide avant d'assigner, impossible avec un champ public.`,
        en:`Refactor into class Player. The only difference: members are private by default. Show that p.health = 50; no longer compiles — error: health is private. Add public: above name and the constructor. Keep health in private:. Add int getHealth() const { return health; } and void setHealth(int h) { if(h >= 0) health = h; }. Key point: private protects the invariant — setHealth validates before assigning, impossible with a public field.`
      },
    ],
    discussion:[
      { fr:`En C++, la seule différence entre struct et class est l'accès par défaut (public vs private). Pourtant on les utilise différemment par convention. Quand choisirais-tu l'un plutôt que l'autre ?`, en:`In C++, the only difference between struct and class is default access (public vs private). Yet they're used differently by convention. When would you choose one over the other?` },
    ],
    activities:[
      {
        id:'i07_1', type:'predict', xp:10,
        instr:{ fr:`Qu'affiche ce code ? Pourquoi ?`, en:`What does this code print? Why?` },
        code:`<span class="kw">struct</span> <span class="ty">Vec2</span> {
    <span class="kw">float</span> x, y;
    <span class="ty">Vec2</span>(<span class="kw">float</span> x, <span class="kw">float</span> y) : x(x), y(y) {}
    <span class="kw">float</span> <span class="fn">length</span>() <span class="kw">const</span> {
        <span class="kw">return</span> std::sqrt(x*x + y*y);
    }
};
<span class="ty">Vec2</span> v(<span class="num">3.0f</span>, <span class="num">4.0f</span>);
std::cout &lt;&lt; v.length();`,
        explanation:{ fr:`Affiche 5. Vec2 est une struct avec un constructeur par initializer list et une méthode const length(). sqrt(3²+4²) = sqrt(25) = 5. Le mot-clé const après length() est correct : la méthode ne modifie pas l'objet. Une struct peut avoir constructeurs et méthodes — aucune restriction.`, en:`Prints 5. Vec2 is a struct with an initializer list constructor and a const method length(). sqrt(3²+4²) = sqrt(25) = 5. The const keyword after length() is correct: the method doesn't modify the object. A struct can have constructors and methods — no restriction.` }
      },
      {
        id:'i07_2', type:'cpp', xp:20,
        instr:{ fr:`Écris une struct Rectangle avec membres float width et height, un constructeur, une méthode area() const et une méthode perimeter() const. Crée un Rectangle(4.0f, 3.0f) et affiche son aire et son périmètre.`, en:`Write a struct Rectangle with float width and height members, a constructor, an area() const method and a perimeter() const method. Create a Rectangle(4.0f, 3.0f) and print its area and perimeter.` },
        hint:{ fr:`area() = width * height. perimeter() = 2 * (width + height). N'oublie pas const après les signatures de méthodes qui ne modifient pas l'objet.`, en:`area() = width * height. perimeter() = 2 * (width + height). Don't forget const after method signatures that don't modify the object.` }
      },
      {
        id:'i07_3', type:'bug', xp:25,
        instr:{ fr:`Ce code ne compile pas. Identifie le problème et corrige-le.`, en:`This code does not compile. Identify the problem and fix it.` },
        bugCode:`<span class="kw">class</span> <span class="ty">Timer</span> {
    <span class="kw">float</span> elapsed = <span class="num">0.0f</span>;
<span class="kw">public</span>:
    <span class="kw">void</span> <span class="fn">tick</span>(<span class="kw">float</span> dt) { elapsed += dt; }
    <span class="kw">float</span> <span class="fn">getElapsed</span>() { <span class="kw">return</span> elapsed; }
};
<span class="kw">const</span> <span class="ty">Timer</span> t;
<span class="bug-line">t.tick(<span class="num">0.016f</span>);</span>
std::cout &lt;&lt; <span class="bug-line">t.getElapsed()</span>;`,
        explanation:{ fr:`Deux erreurs liées à const. Premièrement, t est const — appeler tick() qui modifie elapsed est interdit. Deuxièmement, getElapsed() n'est pas marquée const, donc elle ne peut pas être appelée sur un objet const même si elle ne modifie rien. Corrections : supprimer const sur t, ou marquer getElapsed() const et supprimer l'appel à tick(). La règle : tout getter qui ne modifie pas l'objet doit être const.`, en:`Two errors related to const. First, t is const — calling tick() which modifies elapsed is forbidden. Second, getElapsed() is not marked const, so it cannot be called on a const object even if it doesn't modify anything. Fixes: remove const from t, or mark getElapsed() const and remove the tick() call. The rule: any getter that doesn't modify the object must be const.` }
      },
      {
        id:'i07_4', type:'fill', xp:15,
        instr:{ fr:`Complète l'initializer list de ce constructeur (ordre : name, health) :`, en:`Complete the initializer list of this constructor (order: name, health):` },
        template:{ fr:`Player(std::string n, int hp) ______ name(n), health(hp) {}`, en:`Player(std::string n, int hp) ______ name(n), health(hp) {}` },
        answer:':',
        hint:{ fr:`Un seul caractère, placé entre la signature et la liste d'initialiseurs.`, en:`A single character, placed between the signature and the initialiser list.` }
      },
    ],
  },

  engine:{
    demoSteps:[],
    discussion:[],
    activities:[],
    compare:{ std:``, cpp:`` },
  },

  homework:{
    core:[
      {diff:'easy', fr:'Écris une struct Point3D avec trois float (x, y, z), un constructeur, et une méthode distanceTo(Point3D other) const qui retourne la distance euclidienne. Teste avec deux points.', en:'Write a struct Point3D with three floats (x, y, z), a constructor, and a distanceTo(Point3D other) const method that returns the Euclidean distance. Test with two points.'},
      {diff:'medium', fr:'Refactorise Point3D en class avec x, y, z privés, getters const, et un setter qui valide que les coordonnées sont finies (std::isfinite). Explique dans ton README pourquoi tu ferais ce choix.', en:'Refactor Point3D into a class with private x, y, z, const getters, and a setter that validates coordinates are finite (std::isfinite). Explain in your README why you would make this choice.'},
      {diff:'hard', fr:'Ajoute à ta classe Point3D une méthode normalize() qui retourne un nouveau Point3D dont la longueur est 1.0. Gère le cas dégénéré (vecteur zéro). Ajoute une surcharge de operator+ pour additionner deux points.', en:'Add to your Point3D class a normalize() method that returns a new Point3D with length 1.0. Handle the degenerate case (zero vector). Add an operator+ overload to add two points.'},
    ],
    ide:[
      {diff:'medium', fr:'Écris une classe Stack<int> (sans templates pour l\'instant) qui stocke jusqu\'à 10 entiers dans un tableau, avec push(int), pop(), top() const, et isEmpty() const. Teste avec 5 push et 3 pop.', en:'Write a Stack<int> class (no templates yet) that stores up to 10 ints in an array, with push(int), pop(), top() const, and isEmpty() const. Test with 5 push and 3 pop.'},
    ],
    engine:[],
  },
};
document.addEventListener('DOMContentLoaded',()=>{});
