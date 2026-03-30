'use strict';
// Session 09 — BeginPlay & Tick
// IDE arc S09: class with constructor + a method called on a timer pattern (no engine)

const SESSION = {
  id:'s09', num:9, prev:8, next:10, xp:110,
  blocName:{ fr:'Unreal Engine C++', en:'Unreal Engine C++' },
  blocColor:'#00587c',
  title:{ fr:'BeginPlay & Tick', en:'BeginPlay & Tick' },
  sub:{ fr:'Start() et Update() — version Unreal', en:'Start() and Update() — Unreal edition' },

  tutor:{
    concept:{
      fr:`Start() → BeginPlay(). Update() → Tick(float DeltaTime). La traduction est directe. La différence importante : Tick() reçoit DeltaTime explicitement en paramètre — pas besoin de chercher un Time.deltaTime global. Et désactiver Tick pour les Actors statiques est une bonne pratique de performance souvent négligée.`,
      en:`Start() → BeginPlay(). Update() → Tick(float DeltaTime). The translation is direct. The important difference: Tick() receives DeltaTime explicitly as a parameter — no need to look up a global Time.deltaTime. And disabling Tick for static Actors is a performance best practice often overlooked.`
    },
    deep:{
      fr:`<p><strong>Timers et SetTimer.</strong> Pour des actions répétées à intervalles, évite un compteur dans Tick(). Utilise <code>GetWorld()->GetTimerManager().SetTimer()</code> — plus performant, plus lisible, compatible réseau.</p>
<pre style="background:#0d1f27;padding:1rem;border-radius:4px;font-size:1.25rem;line-height:1.7;color:#e0e8ef"><span class="ty">FTimerHandle</span> TimerHandle;
GetWorld()-&gt;<span class="fn2">GetTimerManager</span>().<span class="fn2">SetTimer</span>(
    TimerHandle,
    <span class="kw2">this</span>, &amp;<span class="ty">AMyActor</span>::<span class="fn2">OnTick</span>,
    <span class="num">2.0f</span>, <span class="kw2">true</span>);  <span class="cm">// 2s, boucle</span></pre>
<p>Équivalent Unity : <code>InvokeRepeating()</code>. Ne pas mettre de logique lourde dans Tick() si elle peut être déclenchée par un Timer.</p>`,
      en:`<p><strong>Timers and SetTimer.</strong> For repeated actions at intervals, avoid a counter in Tick(). Use <code>GetWorld()->GetTimerManager().SetTimer()</code> — more performant, more readable, network-compatible.</p>
<pre style="background:#0d1f27;padding:1rem;border-radius:4px;font-size:1.25rem;line-height:1.7;color:#e0e8ef"><span class="ty">FTimerHandle</span> TimerHandle;
GetWorld()-&gt;<span class="fn2">GetTimerManager</span>().<span class="fn2">SetTimer</span>(
    TimerHandle,
    <span class="kw2">this</span>, &amp;<span class="ty">AMyActor</span>::<span class="fn2">OnTick</span>,
    <span class="num">2.0f</span>, <span class="kw2">true</span>);  <span class="cm">// 2s, loop</span></pre>
<p>Unity equivalent: <code>InvokeRepeating()</code>. Don't put heavy logic in Tick() if it can be triggered by a Timer.</p>`
    }
  },

  ide:{
    demoSteps:[
      {
        label:{ fr:'Classe avec init() et update()', en:'Class with init() and update()' },
        fr:`Crée une classe GameLoop avec deux méthodes : void init() (appelée une fois) et void update(float dt) (appelée chaque frame). Dans main(), simule une boucle : GameLoop g; g.init(); for(int i=0; i<5; i++) g.update(0.016f); — simule 5 frames à 60fps. C'est exactement le pattern Start()/Update() ou BeginPlay()/Tick().`,
        en:`Create a class GameLoop with two methods: void init() (called once) and void update(float dt) (called each frame). In main(), simulate a loop: GameLoop g; g.init(); for(int i=0; i<5; i++) g.update(0.016f); — simulates 5 frames at 60fps. This is exactly the Start()/Update() or BeginPlay()/Tick() pattern.`
      },
      {
        label:{ fr:'DeltaTime — le paramètre explicite', en:'DeltaTime — the explicit parameter' },
        fr:`Dans la GameLoop, ajoute un membre float position = 0.0f et dans update : position += speed * dt;. Avec dt = 0.016f (60fps), position avance de speed * 0.016 par frame. Montre que sans dt, le mouvement serait frame-rate-dépendant. C'est le bug DeltaTime — identique en Unity et Unreal.`,
        en:`In the GameLoop, add a float position = 0.0f member and in update: position += speed * dt;. With dt = 0.016f (60fps), position advances by speed * 0.016 per frame. Show that without dt, movement would be frame-rate-dependent. This is the DeltaTime bug — identical in Unity and Unreal.`
      },
      {
        label:{ fr:'Super:: — appel à la classe parente', en:'Super:: — calling the parent class' },
        fr:`Crée une classe Entity avec virtual void init() { cout << "Entity init"; }. Crée Player qui hérite de Entity et surcharge init() : void init() override { Entity::init(); cout << " + Player init"; }. Entity::init() est l'équivalent de Super::BeginPlay() en Unreal. Toujours appeler la version parente — sinon sa logique est perdue.`,
        en:`Create an Entity class with virtual void init() { cout << "Entity init"; }. Create Player inheriting from Entity and overriding init(): void init() override { Entity::init(); cout << " + Player init"; }. Entity::init() is the equivalent of Super::BeginPlay() in Unreal. Always call the parent version — otherwise its logic is lost.`
      },
    ],
    discussion:[
      { fr:`Si update() est appelée à 30fps au lieu de 60fps mais sans DeltaTime, qu'est-ce qui se passe avec le mouvement ? Donne un exemple concret.`, en:`If update() is called at 30fps instead of 60fps but without DeltaTime, what happens to movement? Give a concrete example.` },
    ],
    compare:{
      std:`<span class="cm">// C++ standard — pattern GameLoop</span>
<span class="kw2">class</span> <span class="ty">Entity</span> {
<span class="kw2">public</span>:
    <span class="kw2">virtual void</span> <span class="fn2">init</span>() { <span class="cm">/* ... */</span> }
    <span class="kw2">virtual void</span> <span class="fn2">update</span>(<span class="kw2">float</span> dt) {
        pos += speed * dt;
    }
};
<span class="cm">// Entity::init() dans la surcharge</span>
<span class="kw2">void</span> <span class="fn2">init</span>() <span class="kw2">override</span> {
    <span class="ty">Entity</span>::<span class="fn2">init</span>(); <span class="cm">// parent d'abord</span>
    <span class="cm">// logique enfant</span>
}`,
      unreal:`<span class="cm">// Unreal — BeginPlay / Tick</span>
<span class="kw2">void</span> <span class="fn2">BeginPlay</span>() {
    <span class="kw2">Super</span>::<span class="fn2">BeginPlay</span>(); <span class="cm">// toujours en premier</span>
    <span class="cm">// logique init</span>
}
<span class="kw2">void</span> <span class="fn2">Tick</span>(<span class="kw2">float</span> DeltaTime) {
    <span class="kw2">Super</span>::<span class="fn2">Tick</span>(DeltaTime);
    Pos += Speed * DeltaTime;
    <span class="cm">// DeltaTime passé explicitement</span>
}`
    },
    activities:[
      {
        id:'i09_1', type:'predict', xp:15,
        code:`#include &lt;iostream&gt;
class Mover {
public:
    float pos = 0.0f;
    float speed = 100.0f;
    void update(float dt) { pos += speed; } // bug !
};
int main() {
    Mover m;
    m.update(0.016f);
    m.update(0.033f);
    std::cout &lt;&lt; m.pos &lt;&lt; std::endl;
    return 0;
}`,
        question:{ fr:`Quelle est la sortie ? Quel bug contient update() — et comment le corriger ?`, en:`What is the output? What bug does update() contain — and how to fix it?` },
        output:`200`,
        explanation:{ fr:`Sortie : 200 (100 + 100). Le bug : pos += speed ignore dt — le déplacement est identique quelle que soit la durée de la frame. À 60fps (dt=0.016) et à 30fps (dt=0.033), l'objet se déplace de la même distance. Correction : pos += speed * dt.`, en:`Output: 200 (100 + 100). The bug: pos += speed ignores dt — displacement is identical regardless of frame duration. At 60fps (dt=0.016) and 30fps (dt=0.033), the object moves the same distance. Fix: pos += speed * dt.` }
      },
      {
        id:'i09_2', type:'cpp', xp:35,
        instr:{ fr:`Crée une classe Projectile avec un float position = 0.0f et un float speed = 200.0f. Ajoute void launch() qui affiche "Lancé !" et void move(float dt) qui avance position de speed * dt. Simule dans main() : lance le projectile, puis appelle move() 3 fois avec dt = 0.016f. Affiche la position finale.`, en:`Create a Projectile class with float position = 0.0f and float speed = 200.0f. Add void launch() that prints "Launched!" and void move(float dt) that advances position by speed * dt. Simulate in main(): launch the projectile, then call move() 3 times with dt = 0.016f. Print the final position.` },
        stub:`#include &lt;iostream&gt;
class Projectile {
    // tes membres / your members
public:
    // launch() et move(float dt)
};
int main() {
    Projectile p;
    p.launch();
    // 3 appels à move(0.016f)
    // affiche position
    return 0;
}`,
        hint:{ fr:`position finale ≈ 200.0f * 0.016f * 3 = 9.6f`, en:`Final position ≈ 200.0f * 0.016f * 3 = 9.6f` },
        solution:{
          fr:`<pre style="font-family:var(--mono);font-size:1.3rem;line-height:1.8;color:#e0e8ef">#include &lt;iostream&gt;
class Projectile {
    float position = 0.0f;
    float speed = 200.0f;
public:
    void launch() {
        std::cout &lt;&lt; "Lancé !" &lt;&lt; std::endl;
    }
    void move(float dt) {
        position += speed * dt;
    }
    float getPos() const { return position; }
};
int main() {
    Projectile p;
    p.launch();
    p.move(0.016f);
    p.move(0.016f);
    p.move(0.016f);
    std::cout &lt;&lt; p.getPos() &lt;&lt; std::endl;
    return 0;
}</pre><p style="margin-top:.8rem;font-size:1.4rem;color:var(--ch2)">Sortie : <code>Lancé !</code> puis <code>9.6</code></p>`,
          en:`<pre style="font-family:var(--mono);font-size:1.3rem;line-height:1.8;color:#e0e8ef">#include &lt;iostream&gt;
class Projectile {
    float position = 0.0f;
    float speed = 200.0f;
public:
    void launch() {
        std::cout &lt;&lt; "Launched!" &lt;&lt; std::endl;
    }
    void move(float dt) {
        position += speed * dt;
    }
    float getPos() const { return position; }
};
int main() {
    Projectile p;
    p.launch();
    p.move(0.016f);
    p.move(0.016f);
    p.move(0.016f);
    std::cout &lt;&lt; p.getPos() &lt;&lt; std::endl;
    return 0;
}</pre><p style="margin-top:.8rem;font-size:1.4rem;color:var(--ch2)">Output: <code>Launched!</code> then <code>9.6</code></p>`
        }
      },
      {
        id:'i09_3', type:'bug', xp:20,
        instr:{ fr:`Cette surcharge de update() causera un problème silencieux. Identifie-le.`, en:`This update() override will cause a silent problem. Identify it.` },
        bugCode:`<span class="kw2">class</span> <span class="ty">Entity</span> {
<span class="kw2">public</span>:
    <span class="kw2">virtual void</span> <span class="fn2">update</span>(<span class="kw2">float</span> dt) {
        <span class="cm">// logique importante de Entity</span>
    }
};
<span class="kw2">class</span> <span class="ty">Player</span> : <span class="kw2">public</span> <span class="ty">Entity</span> {
<span class="kw2">public</span>:
    <span class="kw2">void</span> <span class="fn2">update</span>(<span class="kw2">float</span> dt) <span class="kw2">override</span> {
        <span class="bug-line"><span class="cm">// pas d'appel à Entity::update()</span></span>
        pos += speed * dt;
    }
};`,
        explanation:{ fr:`L'absence d'Entity::update(dt) dans la surcharge signifie que toute la logique de la classe parente est ignorée. En Unreal, c'est Super::BeginPlay() et Super::Tick(DeltaTime) — les oublier peut casser l'initialisation des Components, des Timers, ou d'autres systèmes du moteur.`, en:`The missing Entity::update(dt) call in the override means all parent class logic is ignored. In Unreal, this is Super::BeginPlay() and Super::Tick(DeltaTime) — forgetting them can break Component initialization, Timers, or other engine systems.` }
      },
      {
        id:'i09_4', type:'fill', xp:15,
        instr:{ fr:`Pour désactiver le Tick d'un Actor Unreal dans son constructeur (bonne pratique pour les Actors statiques) :`, en:`To disable Tick for an Unreal Actor in its constructor (best practice for static Actors):` },
        template:{ fr:'PrimaryActorTick.bCanEverTick = ______;', en:'PrimaryActorTick.bCanEverTick = ______;' },
        answer:'false',
        hint:{ fr:`La valeur booléenne qui désactive le tick`, en:`The boolean value that disables ticking` }
      },
    ],
  },

  engine:{
    demoSteps:[
      {
        label:{ fr:'BeginPlay() = Start() + Super:: obligatoire', en:'BeginPlay() = Start() + mandatory Super::' },
        fr:`Montre BeginPlay() dans un Actor et Start() dans Unity côte à côte. Mêmes règles : appelé une fois au démarrage. Différence clé : Super::BeginPlay() doit être appelé en premier — sinon la logique AActor (initialisation des Components, etc.) est sautée. Montre ce qui se passe si on l'omet.`,
        en:`Show BeginPlay() in an Actor and Start() in Unity side by side. Same rules: called once at startup. Key difference: Super::BeginPlay() must be called first — otherwise AActor logic (Component initialization, etc.) is skipped. Show what happens if you omit it.`
      },
      {
        label:{ fr:'Tick() = Update() + DeltaTime explicite', en:'Tick() = Update() + explicit DeltaTime' },
        fr:`Dans Unity : transform.position += speed * Time.deltaTime. Dans Unreal : SetActorLocation(GetActorLocation() + FVector(Speed * DeltaTime, 0, 0)). DeltaTime est un paramètre — pas une variable globale. Montre le bug si on oublie DeltaTime dans Tick (mouvement frame-rate dépendant). Aussi : Super::Tick(DeltaTime) obligatoire.`,
        en:`In Unity: transform.position += speed * Time.deltaTime. In Unreal: SetActorLocation(GetActorLocation() + FVector(Speed * DeltaTime, 0, 0)). DeltaTime is a parameter — not a global variable. Show the bug of forgetting DeltaTime in Tick (frame-rate dependent movement). Also: Super::Tick(DeltaTime) mandatory.`
      },
      {
        label:{ fr:'PrimaryActorTick.bCanEverTick = false', en:'PrimaryActorTick.bCanEverTick = false' },
        fr:`Dans le constructeur de l'Actor, PrimaryActorTick.bCanEverTick est true par défaut. Pour un Actor statique (mur, pickup, décor), désactiver le Tick économise du CPU multiplié par toutes les instances. Montre dans le constructeur : PrimaryActorTick.bCanEverTick = false;. En Unity, l'équivalent est de ne pas implémenter Update().`,
        en:`In the Actor constructor, PrimaryActorTick.bCanEverTick is true by default. For a static Actor (wall, pickup, scenery), disabling Tick saves CPU times all instances. Show in constructor: PrimaryActorTick.bCanEverTick = false;. In Unity, the equivalent is not implementing Update().`
      },
    ],
    discussion:[
      { fr:`Dans tes projets Unity, est-ce que tu mettais de la logique dans Update() pour des objets qui n'en avaient pas besoin chaque frame ? Quel impact potentiel sur les performances ?`, en:`In your Unity projects, did you put logic in Update() for objects that didn't need per-frame updates? What potential performance impact?` },
    ],
    compare:{
      cs:`<span class="cm">// Unity</span>
<span class="kw">void</span> <span class="fn">Start</span>() {
    <span class="cm">// init une fois</span>
}
<span class="kw">void</span> <span class="fn">Update</span>() {
    <span class="kw">float</span> dt = <span class="ty">Time</span>.deltaTime;
    transform.position +=
        <span class="ty">Vector3</span>.right * speed * dt;
}`,
      cpp:`<span class="cm">// Unreal</span>
<span class="kw2">void</span> <span class="fn2">BeginPlay</span>() {
    <span class="kw2">Super</span>::<span class="fn2">BeginPlay</span>(); <span class="cm">// en premier</span>
    <span class="cm">// init une fois</span>
}
<span class="kw2">void</span> <span class="fn2">Tick</span>(<span class="kw2">float</span> DeltaTime) {
    <span class="kw2">Super</span>::<span class="fn2">Tick</span>(DeltaTime);
    <span class="cm">// DeltaTime passé explicitement</span>
    Pos += Speed * DeltaTime;
}`
    },
    activities:[
      {
        id:'e09_1', type:'quiz', xp:15,
        q:{ fr:`Pourquoi faut-il appeler Super::BeginPlay() dans la surcharge BeginPlay() d'un Actor Unreal ?`, en:`Why must you call Super::BeginPlay() in an Unreal Actor's BeginPlay() override?` },
        choices:[
          { t:{ fr:`C'est une convention stylistique, pas fonctionnelle`, en:`It's a style convention, not functional` }, c:false, fb:{ fr:`Non — omettre Super::BeginPlay() peut causer des bugs réels si la classe parente a une logique d'initialisation.`, en:`No — omitting Super::BeginPlay() can cause real bugs if the parent class has initialization logic.` } },
          { t:{ fr:`Pour exécuter la logique d'initialisation de la classe parente`, en:`To execute the parent class initialization logic` }, c:true, fb:{ fr:`Correct. AActor (et APawn, ACharacter) ont leur propre logique BeginPlay — Components, Timers, état réseau. La sauter peut causer des comportements indéfinis.`, en:`Correct. AActor (and APawn, ACharacter) have their own BeginPlay logic — Components, Timers, network state. Skipping it can cause undefined behavior.` } },
          { t:{ fr:`Pour compiler sans warnings`, en:`To compile without warnings` }, c:false, fb:{ fr:`Le compilateur ne génère pas de warning pour un Super:: manquant — c'est un bug silencieux.`, en:`The compiler doesn't warn about a missing Super:: — it's a silent bug.` } },
          { t:{ fr:`Pour activer le Tick`, en:`To enable Tick` }, c:false, fb:{ fr:`L'activation du Tick se configure dans le constructeur, pas dans BeginPlay.`, en:`Tick activation is configured in the constructor, not in BeginPlay.` } },
        ]
      },
      {
        id:'e09_2', type:'fill', xp:20,
        instr:{ fr:`Ce déplacement est frame-rate dépendant. Complète pour le corriger :`, en:`This movement is frame-rate dependent. Complete to fix it:` },
        template:{ fr:'Pos += Speed * ______;', en:'Pos += Speed * ______;' },
        answer:'DeltaTime',
        hint:{ fr:`Le paramètre de Tick() qui contient la durée de la dernière frame`, en:`The Tick() parameter that contains the duration of the last frame` }
      },
      {
        id:'e09_3', type:'bug', xp:25,
        instr:{ fr:`Ce Tick() Unreal a un bug de frame-rate. Identifie la ligne problématique.`, en:`This Unreal Tick() has a frame-rate bug. Identify the problematic line.` },
        bugCode:`<span class="kw2">void</span> <span class="fn2">Tick</span>(<span class="kw2">float</span> DeltaTime)
{
    <span class="kw2">Super</span>::<span class="fn2">Tick</span>(DeltaTime);
    <span class="ty">FVector</span> Loc = <span class="fn2">GetActorLocation</span>();
    <span class="bug-line">Loc.X += Speed;</span>
    <span class="fn2">SetActorLocation</span>(Loc);
}`,
        explanation:{ fr:`Loc.X += Speed; sans DeltaTime signifie que l'objet se déplace de Speed unités par frame — pas par seconde. À 60fps il va 2× plus vite qu'à 30fps. Correction : Loc.X += Speed * DeltaTime; — le mouvement est alors en unités par seconde, indépendant du framerate.`, en:`Loc.X += Speed; without DeltaTime means the object moves Speed units per frame — not per second. At 60fps it goes 2× faster than at 30fps. Fix: Loc.X += Speed * DeltaTime; — movement is then in units per second, independent of framerate.` }
      },
      {
        id:'e09_4', type:'engine', xp:40,
        label:{ fr:'Dans Unity + Unreal', en:'In Unity + Unreal' },
        task:{ fr:`1. Dans Unity : crée un cube qui se déplace horizontalement dans Update() avec Time.deltaTime. 2. Dans Unreal : crée un Actor C++ qui fait le même mouvement dans Tick(float DeltaTime). 3. Dans les deux moteurs, change le Target Frame Rate (console Unreal : t.MaxFPS 30). Vérifie que le mouvement reste cohérent à 30fps et 60fps. Si ce n'est pas le cas, tu as trouvé un bug DeltaTime.`, en:`1. In Unity: create a cube that moves horizontally in Update() with Time.deltaTime. 2. In Unreal: create a C++ Actor doing the same movement in Tick(float DeltaTime). 3. In both engines, change the Target Frame Rate (Unreal console: t.MaxFPS 30). Verify the movement stays consistent at 30fps and 60fps. If not, you've found a DeltaTime bug.` },
        note:{ fr:`Le test de framerate est la validation définitive d'une mécanique DeltaTime correcte.`, en:`The framerate test is the definitive validation of a correct DeltaTime mechanic.` }
      },
    ],
  },
};
document.addEventListener('DOMContentLoaded',()=>{});
