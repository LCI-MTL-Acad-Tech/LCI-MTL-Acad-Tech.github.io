'use strict';
// Session 08 — UPROPERTY & UFUNCTION
// IDE arc S08: class with .h/.cpp split, private/public, accessors

const SESSION = {
  id:'s08', num:8, prev:7, next:9, xp:120,
  blocName:{ fr:'Unreal Engine C++', en:'Unreal Engine C++' },
  blocColor:'#00587c',
  title:{ fr:'UPROPERTY & UFUNCTION', en:'UPROPERTY & UFUNCTION' },
  sub:{ fr:'[SerializeField] et events — version Unreal', en:'[SerializeField] and events — Unreal edition' },

  tutor:{
    concept:{
      fr:`En Unity, [SerializeField] expose une variable privée dans l'Inspector. En Unreal, UPROPERTY() fait ça et bien plus : exposer à l'éditeur, au GC, aux Blueprints, et à la sérialisation. UFUNCTION() fait pareil pour les méthodes. Ces deux macros sont les plus fréquentes dans tout code Unreal — les maîtriser déverrouille la communication entre C++ et le reste du moteur.`,
      en:`In Unity, [SerializeField] exposes a private variable in the Inspector. In Unreal, UPROPERTY() does that and more: expose to the editor, GC, Blueprints, and serialization. UFUNCTION() does the same for methods. These two macros are the most frequent in all Unreal code — mastering them unlocks communication between C++ and the rest of the engine.`
    },
    deep:{
      fr:`<p><strong>Replication pour le multijoueur.</strong> UPROPERTY() peut aussi prendre <code>Replicated</code> ou <code>ReplicatedUsing=OnRep_Health</code>. Quand la variable change sur le serveur, Unreal la synchronise automatiquement sur tous les clients.</p>
<p>UFUNCTION() peut prendre <code>Server</code>, <code>Client</code>, ou <code>NetMulticast</code> pour définir qui exécute la fonction réseau. C'est l'un des systèmes de réplication les plus puissants de l'industrie — et tout passe par ces macros que tu connais maintenant.</p>`,
      en:`<p><strong>Replication for multiplayer.</strong> UPROPERTY() can also take <code>Replicated</code> or <code>ReplicatedUsing=OnRep_Health</code>. When the variable changes on the server, Unreal automatically syncs it to all clients.</p>
<p>UFUNCTION() can take <code>Server</code>, <code>Client</code>, or <code>NetMulticast</code> to define who executes the network function. It's one of the most powerful replication systems in the industry — and it all goes through these macros you now know.</p>`
    }
  },

  ide:{
    demoSteps:[
      {
        label:{ fr:'class avec private/public — la vraie séparation', en:'class with private/public — the real separation' },
        fr:`Refactorise la struct Player de S07 en class. Dans player.h : class Player { private: std::string name; int health; public: Player(std::string n, int h); std::string getName() const; void takeDamage(int d); bool isAlive() const; };. Insiste sur private — les membres ne sont pas directement accessibles de l'extérieur. C'est l'encapsulation.`,
        en:`Refactor the Player struct from S07 into a class. In player.h: class Player { private: std::string name; int health; public: Player(std::string n, int h); std::string getName() const; void takeDamage(int d); bool isAlive() const; };. Stress private — members are not directly accessible from outside. That's encapsulation.`
      },
      {
        label:{ fr:'Getters et setters', en:'Getters and setters' },
        fr:`Dans player.cpp, implémente getName() const { return name; } et un setter setHealth(int h) { if(h >= 0) health = h; }. Montre que p.name = "x"; ne compile pas (private), mais p.getName() oui. Insiste : les setters permettent de valider les données avant de les stocker — health ne peut pas être négatif dans cet exemple.`,
        en:`In player.cpp, implement getName() const { return name; } and a setter setHealth(int h) { if(h >= 0) health = h; }. Show that p.name = "x"; doesn't compile (private), but p.getName() does. Stress: setters allow validating data before storing — health can't be negative in this example.`
      },
      {
        label:{ fr:'Séparation .h/.cpp pour une classe', en:'.h/.cpp split for a class' },
        fr:`Montre la structure finale : dans player.h toutes les déclarations (membres privés + signatures publiques), dans player.cpp toutes les implémentations avec Player::. Compile avec g++ main.cpp player.cpp -o prog. C'est le pattern exact de tout Actor Unreal — la corrélation avec S05 est intentionnelle.`,
        en:`Show the final structure: in player.h all declarations (private members + public signatures), in player.cpp all implementations with Player::. Compile with g++ main.cpp player.cpp -o prog. This is the exact pattern of every Unreal Actor — the correlation with S05 is intentional.`
      },
    ],
    discussion:[
      { fr:`Pourquoi rendre les membres privés alors qu'en C# on met souvent [SerializeField] private pour les rendre visibles dans l'Inspector sans les exposer en code ? C'est la même idée ?`, en:`Why make members private when in C# we often use [SerializeField] private to make them visible in the Inspector without exposing them in code? Is it the same idea?` },
    ],
    compare:{
      std:`<span class="cm">// C++ standard — class</span>
<span class="kw2">class</span> <span class="ty">Player</span> {
<span class="kw2">private</span>:
    std::<span class="ty">string</span> name;
    <span class="kw2">int</span> health;
<span class="kw2">public</span>:
    <span class="ty">Player</span>(std::<span class="ty">string</span> n, <span class="kw2">int</span> h);
    std::<span class="ty">string</span> <span class="fn2">getName</span>() <span class="kw2">const</span>;
    <span class="kw2">void</span> <span class="fn2">takeDamage</span>(<span class="kw2">int</span> d);
    <span class="kw2">bool</span> <span class="fn2">isAlive</span>() <span class="kw2">const</span>;
};`,
      unreal:`<span class="cm">// Unreal — même pattern + macros</span>
<span class="mac">UCLASS</span>()
<span class="kw2">class</span> <span class="ty">APlayerChar</span>
    : <span class="kw2">public</span> <span class="ty">AActor</span>
{
    <span class="mac">GENERATED_BODY</span>()
<span class="kw2">private</span>:
    <span class="mac">UPROPERTY</span>(EditAnywhere)
    <span class="kw2">int32</span> Health = <span class="num">100</span>;
<span class="kw2">public</span>:
    <span class="mac">UFUNCTION</span>(BlueprintCallable)
    <span class="kw2">void</span> <span class="fn2">TakeDamage</span>(<span class="kw2">int32</span> D);
};`
    },
    activities:[
      {
        id:'i08_1', type:'predict', xp:15,
        code:`#include &lt;iostream&gt;
class Counter {
private:
    int count = 0;
public:
    void inc() { count++; }
    int get() const { return count; }
};
int main() {
    Counter c;
    c.inc(); c.inc(); c.inc();
    std::cout &lt;&lt; c.get() &lt;&lt; std::endl;
    return 0;
}`,
        question:{ fr:`Quelle est la sortie ? Que se passerait-il si on essayait d'écrire c.count = 0; dans main() ?`, en:`What is the output? What would happen if you tried to write c.count = 0; in main()?` },
        output:`3`,
        explanation:{ fr:`Sortie : 3 (trois appels à inc()). Si on écrit c.count = 0; dans main(), le compilateur refuse avec "count is private" — l'encapsulation fonctionne. Pour réinitialiser count depuis l'extérieur, il faudrait une méthode publique reset().`, en:`Output: 3 (three calls to inc()). If you write c.count = 0; in main(), the compiler refuses with "count is private" — encapsulation works. To reset count from outside, you'd need a public reset() method.` }
      },
      {
        id:'i08_2', type:'cpp', xp:35,
        instr:{ fr:`Crée une class Weapon (dans weapon.h + weapon.cpp) avec un membre privé float damage et un membre privé std::string name. Ajoute un constructeur, un getter getDamage() const, un getter getName() const, et une méthode void upgrade() qui multiplie damage par 1.5f. Dans main.cpp, crée un Weapon("Épée", 10.0f), appelle upgrade() deux fois, et affiche le nom et les dégâts.`, en:`Create a class Weapon (in weapon.h + weapon.cpp) with a private float damage member and a private std::string name member. Add a constructor, a getDamage() const getter, a getName() const getter, and a void upgrade() method that multiplies damage by 1.5f. In main.cpp, create a Weapon("Sword", 10.0f), call upgrade() twice, and display the name and damage.` },
        stub:`<span class="cm">// weapon.h</span>
<span class="mac">#pragma once</span>
#include &lt;string&gt;
<span class="kw2">class</span> <span class="ty">Weapon</span> {
<span class="kw2">private</span>:
    <span class="cm">// tes membres / your members</span>
<span class="kw2">public</span>:
    <span class="cm">// constructeur + getters + upgrade</span>
};`,
        hint:{ fr:`upgrade() modifie damage — ne peut donc pas être const. Les getters ne modifient rien — doivent être const.`, en:`upgrade() modifies damage — can't be const. Getters modify nothing — must be const.` },
        solution:{
          fr:`<pre style="font-family:var(--mono);font-size:1.3rem;line-height:1.8;color:#e0e8ef">// weapon.h
#pragma once
#include &lt;string&gt;
class Weapon {
private:
    float damage;
    std::string name;
public:
    Weapon(std::string n, float d) : name(n), damage(d) {}
    float getDamage() const { return damage; }
    std::string getName() const { return name; }
    void upgrade() { damage *= 1.5f; }
};</pre><p style="margin-top:.8rem;font-size:1.4rem;color:var(--ch2)">Après 2× upgrade(10.0f) : <code>22.5</code></p>`,
          en:`<pre style="font-family:var(--mono);font-size:1.3rem;line-height:1.8;color:#e0e8ef">// weapon.h
#pragma once
#include &lt;string&gt;
class Weapon {
private:
    float damage;
    std::string name;
public:
    Weapon(std::string n, float d) : name(n), damage(d) {}
    float getDamage() const { return damage; }
    std::string getName() const { return name; }
    void upgrade() { damage *= 1.5f; }
};</pre><p style="margin-top:.8rem;font-size:1.4rem;color:var(--ch2)">After 2× upgrade(10.0f): <code>22.5</code></p>`
        }
      },
      {
        id:'i08_3', type:'bug', xp:20,
        instr:{ fr:`Ce code ne compilera pas. Combien d'erreurs y a-t-il et pourquoi ?`, en:`This code won't compile. How many errors are there and why?` },
        bugCode:`<span class="kw2">class</span> <span class="ty">Box</span> {
<span class="kw2">private</span>:
    <span class="kw2">float</span> width = <span class="num">1.0f</span>;
<span class="kw2">public</span>:
    <span class="kw2">float</span> <span class="fn2">getWidth</span>() <span class="kw2">const</span> { <span class="kw2">return</span> width; }
};
<span class="kw2">int</span> main() {
    <span class="ty">Box</span> b;
    <span class="bug-line">b.width = <span class="num">2.0f</span>;</span>
    <span class="cm">// width est private</span>
    std::cout &lt;&lt; b.<span class="fn2">getWidth</span>();
}`,
        explanation:{ fr:`Une erreur : b.width = 2.0f tente d'accéder à un membre privé depuis l'extérieur de la classe. Le compilateur refuse. Pour modifier width depuis l'extérieur, il faut ajouter une méthode publique setWidth(float w) { width = w; } dans la classe.`, en:`One error: b.width = 2.0f attempts to access a private member from outside the class. The compiler refuses. To modify width from outside, add a public setWidth(float w) { width = w; } method to the class.` }
      },
      {
        id:'i08_4', type:'fill', xp:15,
        instr:{ fr:`Pour déclarer un membre de classe inaccessible directement de l'extérieur :`, en:`To declare a class member not directly accessible from outside:` },
        template:{ fr:'class Player {\n______:\n    int health;\n};', en:'class Player {\n______:\n    int health;\n};' },
        answer:'private',
        hint:{ fr:`Le modificateur d'accès qui restreint l'accès aux méthodes de la classe seulement`, en:`The access modifier that restricts access to the class's own methods only` }
      },
    ],
  },

  engine:{
    demoSteps:[
      {
        label:{ fr:'UPROPERTY — les spécificateurs essentiels', en:'UPROPERTY — essential specifiers' },
        fr:`Montre les trois spécificateurs les plus courants : EditAnywhere (visible ET modifiable dans l'éditeur), VisibleAnywhere (visible mais pas modifiable), BlueprintReadWrite (accessible en Blueprint). Tape en live une variable Health avec UPROPERTY(EditAnywhere, BlueprintReadWrite, Category="Combat"). Glisse l'Actor dans la scène et montre Health dans le panneau Details.`,
        en:`Show the three most common specifiers: EditAnywhere (visible AND editable in editor), VisibleAnywhere (visible but not editable), BlueprintReadWrite (accessible in Blueprint). Live-type a Health variable with UPROPERTY(EditAnywhere, BlueprintReadWrite, Category="Combat"). Drag the Actor into the scene and show Health in the Details panel.`
      },
      {
        label:{ fr:'UFUNCTION — BlueprintCallable', en:'UFUNCTION — BlueprintCallable' },
        fr:`UFUNCTION(BlueprintCallable) rend une méthode C++ appelable depuis un Blueprint. Montre une méthode TakeDamage avec UFUNCTION(BlueprintCallable, Category="Combat"). Crée un Blueprint enfant et montre que TakeDamage apparaît comme un nœud dans le graph. C'est l'API que tu offres aux designers.`,
        en:`UFUNCTION(BlueprintCallable) makes a C++ method callable from a Blueprint. Show a TakeDamage method with UFUNCTION(BlueprintCallable, Category="Combat"). Create a child Blueprint and show TakeDamage appears as a node in the graph. This is the API you're offering to designers.`
      },
      {
        label:{ fr:'BlueprintReadWrite sur private — piège courant', en:'BlueprintReadWrite on private — common trap' },
        fr:`Montre ce qui se passe si on met UPROPERTY(BlueprintReadWrite) sur un membre private sans meta=(AllowPrivateAccess="true") — erreur de compilation. Correction : UPROPERTY(BlueprintReadWrite, meta=(AllowPrivateAccess="true")). Ou mieux : mettre la variable protected ou public si elle doit être accessible en Blueprint.`,
        en:`Show what happens if you put UPROPERTY(BlueprintReadWrite) on a private member without meta=(AllowPrivateAccess="true") — compilation error. Fix: UPROPERTY(BlueprintReadWrite, meta=(AllowPrivateAccess="true")). Or better: make the variable protected or public if it needs Blueprint access.`
      },
    ],
    discussion:[
      { fr:`UPROPERTY(BlueprintReadWrite) permet à un designer de lire ET modifier une variable C++ depuis un Blueprint. Dans un projet en équipe, quelles variables exposerais-tu en ReadWrite et lesquelles en ReadOnly ? Pourquoi ?`, en:`UPROPERTY(BlueprintReadWrite) lets a designer read AND modify a C++ variable from a Blueprint. In a team project, which variables would you expose as ReadWrite and which as ReadOnly? Why?` },
    ],
    compare:{
      cs:`<span class="cm">// Unity — Inspector</span>
[<span class="ty">Header</span>(<span class="str">"Combat"</span>)]
[<span class="ty">SerializeField</span>]
<span class="kw">private int</span> health = <span class="num">100</span>;

<span class="kw">public float</span> damage;

<span class="cm">// Méthode appelable par Event</span>
<span class="kw">public void</span> <span class="fn">TakeDamage</span>(<span class="kw">float</span> d) { }`,
      cpp:`<span class="cm">// Unreal — UPROPERTY / UFUNCTION</span>
<span class="mac">UPROPERTY</span>(EditAnywhere,
    Category=<span class="str">"Combat"</span>)
<span class="kw2">int32</span> Health = <span class="num">100</span>;

<span class="mac">UPROPERTY</span>(EditAnywhere,
    Category=<span class="str">"Combat"</span>)
<span class="kw2">float</span> Damage;

<span class="mac">UFUNCTION</span>(BlueprintCallable,
    Category=<span class="str">"Combat"</span>)
<span class="kw2">void</span> <span class="fn2">TakeDamage</span>(<span class="kw2">float</span> D);`
    },
    activities:[
      {
        id:'e08_1', type:'quiz', xp:15,
        q:{ fr:`Quel spécificateur UPROPERTY() permet de modifier une variable directement sur les instances dans le panneau Details de l'éditeur ?`, en:`Which UPROPERTY() specifier allows modifying a variable directly on instances in the editor's Details panel?` },
        choices:[
          { t:'VisibleAnywhere', c:false, fb:{ fr:`VisibleAnywhere = visible mais pas modifiable dans l'éditeur.`, en:`VisibleAnywhere = visible but not editable in the editor.` } },
          { t:'EditAnywhere', c:true, fb:{ fr:`Correct. EditAnywhere = visible ET modifiable sur l'archetype et les instances. L'équivalent de [SerializeField] en Unity.`, en:`Correct. EditAnywhere = visible AND editable on both the archetype and instances. The Unity [SerializeField] equivalent.` } },
          { t:'BlueprintReadWrite', c:false, fb:{ fr:`BlueprintReadWrite permet l'accès en Blueprint — pas dans le panneau Details de l'éditeur.`, en:`BlueprintReadWrite allows Blueprint access — not in the editor's Details panel.` } },
          { t:'EditDefaultsOnly', c:false, fb:{ fr:`EditDefaultsOnly = modifiable sur le Blueprint/CDO mais pas sur les instances individuelles.`, en:`EditDefaultsOnly = editable on the Blueprint/CDO but not on individual instances.` } },
        ]
      },
      {
        id:'e08_2', type:'fill', xp:20,
        instr:{ fr:`Complète la macro qui rend cette méthode C++ appelable depuis un graph Blueprint :`, en:`Complete the macro that makes this C++ method callable from a Blueprint graph:` },
        template:{ fr:'UFUNCTION(______)\nvoid Activate();', en:'UFUNCTION(______)\nvoid Activate();' },
        answer:'BlueprintCallable',
        hint:{ fr:`Le spécificateur UFUNCTION qui expose la méthode comme nœud dans le graph Blueprint`, en:`The UFUNCTION specifier that exposes the method as a node in the Blueprint graph` }
      },
      {
        id:'e08_3', type:'bug', xp:25,
        instr:{ fr:`Ce code ne compilera pas. Identifie pourquoi.`, en:`This code won't compile. Identify why.` },
        bugCode:`<span class="mac">UCLASS</span>()
<span class="kw2">class</span> <span class="ty">APlayer</span> : <span class="kw2">public</span> <span class="ty">AActor</span>
{
    <span class="mac">GENERATED_BODY</span>()
<span class="kw2">private</span>:
    <span class="mac">UPROPERTY</span>(<span class="bug-line">BlueprintReadWrite</span>)
    <span class="kw2">int32</span> Health = <span class="num">100</span>;
};`,
        explanation:{ fr:`UPROPERTY(BlueprintReadWrite) sur un membre private provoque une erreur de compilation car Blueprint ne peut pas accéder aux membres private sans permission explicite. Correction : ajouter meta=(AllowPrivateAccess="true"), ou changer le membre en public, ou utiliser BlueprintReadOnly (lecture seule depuis Blueprint).`, en:`UPROPERTY(BlueprintReadWrite) on a private member causes a compilation error because Blueprint can't access private members without explicit permission. Fix: add meta=(AllowPrivateAccess="true"), or change the member to public, or use BlueprintReadOnly (read-only from Blueprint).` }
      },
      {
        id:'e08_4', type:'engine', xp:40,
        label:{ fr:'Dans Unreal', en:'In Unreal' },
        task:{ fr:`1. Crée un Actor C++ avec trois variables membres : int32 Health = 100 (EditAnywhere), float Speed = 300.0f (EditAnywhere), FString DisplayName = TEXT("Héros") (EditAnywhere). 2. Ajoute UFUNCTION(BlueprintCallable) void PrintInfo() qui affiche les trois valeurs avec UE_LOG. 3. Compile, glisse dans la scène, modifie les valeurs dans Details, joue et appelle PrintInfo() depuis un Blueprint EventGraph. 4. Vérifie que les valeurs modifiées dans l'éditeur sont bien celles affichées.`, en:`1. Create a C++ Actor with three member variables: int32 Health = 100 (EditAnywhere), float Speed = 300.0f (EditAnywhere), FString DisplayName = TEXT("Hero") (EditAnywhere). 2. Add UFUNCTION(BlueprintCallable) void PrintInfo() that displays all three with UE_LOG. 3. Compile, drag into scene, modify values in Details, play and call PrintInfo() from a Blueprint EventGraph. 4. Verify that values edited in the editor are the ones displayed.` },
        note:{ fr:`C'est la démonstration complète de la chaîne UPROPERTY → Details → Blueprint → C++.`, en:`This is the full demonstration of the UPROPERTY → Details → Blueprint → C++ chain.` }
      },
    ],
  },

  homework:{
    core:[
      {diff:'easy', fr:'Crée une classe Weapon avec int damage en private et une méthode getDamage() const en public. Essaie d\'accéder directement à damage depuis main() et lis l\'erreur du compilateur.', en:'Create a Weapon class with int damage as private and a getDamage() const method as public. Try to access damage directly from main() and read the compiler error.'},
      {diff:'medium', fr:'Ajoute à Weapon une méthode upgrade() qui augmente damage de 10 et retourne *this par référence pour permettre le chaînage : weapon.upgrade().upgrade().upgrade();', en:'Add to Weapon an upgrade() method that increases damage by 10 and returns *this by reference to enable chaining: weapon.upgrade().upgrade().upgrade();'},
      {diff:'hard', fr:'Implémente une classe Counter avec un membre static int count qui s\'incrémente dans le constructeur et se décrémente dans le destructeur. Affiche combien d\'instances sont actives à tout moment.', en:'Implement a Counter class with a static int count member that increments in the constructor and decrements in the destructor. Print how many instances are alive at any time.'},
    ],
    ide:[
      {diff:'medium', fr:'Écris une classe avec un getter et un setter. Dans le setter, ajoute une validation (ex : health ne peut pas dépasser 100 ni être négatif). Teste avec des valeurs invalides.', en:'Write a class with a getter and setter. In the setter, add validation (e.g. health can\'t exceed 100 or be negative). Test with invalid values.'},
    ],
    engine:[
      {diff:'hard', fr:'Crée un Actor Unreal avec UPROPERTY(EditAnywhere) float Speed et UFUNCTION(BlueprintCallable) void DoubleSpeed(). Dans Blueprint, appelle DoubleSpeed() au Begin Play et vérifie dans les détails.', en:'Create a Unreal Actor with UPROPERTY(EditAnywhere) float Speed and UFUNCTION(BlueprintCallable) void DoubleSpeed(). In Blueprint, call DoubleSpeed() at Begin Play and verify in the Details.'},
    ],
  },
};
document.addEventListener('DOMContentLoaded',()=>{});
