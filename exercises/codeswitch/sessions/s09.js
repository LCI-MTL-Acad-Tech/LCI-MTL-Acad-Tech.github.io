'use strict';
// Session 09 — BeginPlay & Tick

const SESSION = {
  id:        's09',
  num:       9,
  prev:      8,
  next:      10,
  xp:        110,
  blocName:  { fr:'Unreal Engine C++', en:'Unreal Engine C++' },
  blocColor: '#00587c',
  title:     { fr:'BeginPlay & Tick', en:'BeginPlay & Tick' },
  sub:       { fr:'Start() et Update() — version Unreal', en:'Start() and Update() — Unreal edition' },

  tutor: {
    concept: {
      fr:`Start() → BeginPlay(). Update() → Tick(). La traduction est directe. La différence importante : Tick() reçoit un float DeltaTime en paramètre — comme Time.deltaTime dans Update() Unity, mais passé explicitement. Et désactiver Tick() pour les Actors statiques est une bonne pratique de performance souvent négligée.`,
      en:`Start() → BeginPlay(). Update() → Tick(). The translation is direct. The important difference: Tick() receives a float DeltaTime parameter — like Time.deltaTime in Unity's Update(), but explicitly passed. And disabling Tick() for static Actors is a performance best practice often overlooked.`
    },
    demoSteps: [
      {
        label: { fr:'BeginPlay() = Start()', en:'BeginPlay() = Start()' },
        fr:`Montre BeginPlay() dans un Actor Unreal et Start() en Unity côte à côte. Mêmes règles : appelé une fois au démarrage de l'Actor. Différence : Unreal appelle Super::BeginPlay() pour exécuter la logique de la classe parente — toujours l'appeler en premier. Montre ce qui se passe si on l'omet : les Components peuvent ne pas s'initialiser correctement.`,
        en:`Show BeginPlay() in an Unreal Actor and Unity's Start() side by side. Same rules: called once when the Actor starts. Difference: Unreal calls Super::BeginPlay() to run parent class logic — always call it first. Show what happens if omitted: Components may not initialize correctly.`
      },
      {
        label: { fr:'Tick() = Update() + DeltaTime explicite', en:'Tick() = Update() + explicit DeltaTime' },
        fr:`Dans Unity : void Update() { transform.position += speed * Time.deltaTime; }. Dans Unreal : void Tick(float DeltaTime) { SetActorLocation(GetActorLocation() + FVector(Speed * DeltaTime, 0, 0)); }. DeltaTime est là, explicitement — plus besoin de chercher Time.deltaTime. Montre que Super::Tick(DeltaTime) doit aussi être appelé.`,
        en:`In Unity: void Update() { transform.position += speed * Time.deltaTime; }. In Unreal: void Tick(float DeltaTime) { SetActorLocation(GetActorLocation() + FVector(Speed * DeltaTime, 0, 0)); }. DeltaTime is right there, explicitly — no need to look for Time.deltaTime. Show that Super::Tick(DeltaTime) must also be called.`
      },
      {
        label: { fr:'PrimaryActorTick.bCanEverTick = false', en:'PrimaryActorTick.bCanEverTick = false' },
        fr:`Montre dans le constructeur de l'Actor que PrimaryActorTick.bCanEverTick est true par défaut. Pour un Actor statique (un mur, un décor, un collectible), désactiver le Tick économise du CPU — multiplié par le nombre d'instances dans la scène. En Unity, l'équivalent est de ne pas implémenter Update(). En Unreal, il faut le dire explicitement dans le constructeur.`,
        en:`Show in the Actor constructor that PrimaryActorTick.bCanEverTick is true by default. For a static Actor (wall, scenery, collectible), disabling Tick saves CPU — multiplied by the number of instances in the scene. In Unity, the equivalent is not implementing Update(). In Unreal, you must state it explicitly in the constructor.`
      },
    ],
    discussion: [
      {
        fr:`Dans tes projets Unity, est-ce que tu mettais de la logique dans Update() pour des objets qui n'en avaient pas besoin chaque frame ? Quel impact ça pouvait avoir sur les performances ?`,
        en:`In your Unity projects, did you put logic in Update() for objects that didn't need per-frame updates? What impact could that have on performance?`
      },
      {
        fr:`Pourquoi passer DeltaTime en paramètre explicite est-il une meilleure pratique que d'y accéder via une variable globale comme Time.deltaTime ?`,
        en:`Why is passing DeltaTime as an explicit parameter better practice than accessing it through a global variable like Time.deltaTime?`
      },
    ],
    deep: {
      fr:`<p><strong>Timers et SetTimer.</strong> Pour des actions répétées à intervalles fixes, évite de mettre un compteur dans Tick(). Utilise plutôt <code>GetWorld()->GetTimerManager().SetTimer()</code>. C'est plus performant (le timer ne tourne que s'il y a des Timers actifs), plus lisible, et compatible avec le réseau.</p>
<pre style="background:#0d1f27;padding:1rem;border-radius:4px;font-size:1.25rem;line-height:1.7;color:#e0e8ef"><span class="ty">FTimerHandle</span> TimerHandle;
GetWorld()-&gt;<span class="fn2">GetTimerManager</span>().<span class="fn2">SetTimer</span>(
    TimerHandle,
    <span class="kw2">this</span>, &amp;<span class="ty">AMyActor</span>::<span class="fn2">OnTimerFired</span>,
    <span class="num">2.0f</span>,  <span class="cm">// délai en secondes</span>
    <span class="kw2">true</span>   <span class="cm">// boucle</span>
);</pre>
<p>Équivalent Unity : <code>InvokeRepeating()</code> ou <code>StartCoroutine()</code> avec un yield.</p>`,
      en:`<p><strong>Timers and SetTimer.</strong> For repeated actions at fixed intervals, avoid putting a counter in Tick(). Use <code>GetWorld()->GetTimerManager().SetTimer()</code> instead. More performant (timer only runs if there are active timers), more readable, and network-compatible.</p>
<pre style="background:#0d1f27;padding:1rem;border-radius:4px;font-size:1.25rem;line-height:1.7;color:#e0e8ef"><span class="ty">FTimerHandle</span> TimerHandle;
GetWorld()-&gt;<span class="fn2">GetTimerManager</span>().<span class="fn2">SetTimer</span>(
    TimerHandle,
    <span class="kw2">this</span>, &amp;<span class="ty">AMyActor</span>::<span class="fn2">OnTimerFired</span>,
    <span class="num">2.0f</span>,  <span class="cm">// delay in seconds</span>
    <span class="kw2">true</span>   <span class="cm">// loop</span>
);</pre>
<p>Unity equivalent: <code>InvokeRepeating()</code> or <code>StartCoroutine()</code> with a yield.</p>`
    }
  },

  compare: {
    cs:`<span class="cm">// Unity</span>
<span class="kw">void</span> <span class="fn">Start</span>() {
    <span class="cm">// init une fois</span>
}
<span class="kw">void</span> <span class="fn">Update</span>() {
    <span class="kw">float</span> dt = <span class="ty">Time</span>.deltaTime;
    <span class="fn">Move</span>(dt);
}`,
    cpp:`<span class="cm">// Unreal</span>
<span class="kw2">void</span> <span class="fn2">BeginPlay</span>() {
    <span class="kw2">Super</span>::<span class="fn2">BeginPlay</span>(); <span class="cm">// toujours en premier</span>
    <span class="cm">// init une fois</span>
}
<span class="kw2">void</span> <span class="fn2">Tick</span>(<span class="kw2">float</span> DeltaTime) {
    <span class="kw2">Super</span>::<span class="fn2">Tick</span>(DeltaTime);
    <span class="fn2">Move</span>(DeltaTime); <span class="cm">// DeltaTime explicite</span>
}`
  },

  activities: [
    {
      id:'a9_1', type:'quiz', xp:15,
      q:{
        fr:`Pourquoi faut-il appeler Super::BeginPlay() dans la méthode BeginPlay() d'un Actor Unreal ?`,
        en:`Why must you call Super::BeginPlay() in an Unreal Actor's BeginPlay() method?`
      },
      choices:[
        { t:{ fr:`C'est une règle stylistique, pas fonctionnelle`, en:`It's a style rule, not functional` }, c:false,
          fb:{ fr:`Non — omettre Super::BeginPlay() peut causer des bugs silencieux si la classe parente a une logique d'initialisation.`, en:`No — omitting Super::BeginPlay() can cause silent bugs if the parent class has initialization logic.` } },
        { t:{ fr:`Pour exécuter la logique d'initialisation de la classe parente`, en:`To execute the parent class initialization logic` }, c:true,
          fb:{ fr:`Correct. Si tu n'appelles pas Super::BeginPlay(), toute la logique de la classe parente est ignorée — potentiellement des initialisations Unreal critiques (Components, etc.).`, en:`Correct. If you don't call Super::BeginPlay(), all parent class logic is skipped — potentially critical Unreal initializations (Components, etc.).` } },
        { t:{ fr:`Pour activer le Tick`, en:`To activate Tick` }, c:false,
          fb:{ fr:`L'activation du Tick se configure dans le constructeur, pas dans BeginPlay.`, en:`Tick activation is configured in the constructor, not in BeginPlay.` } },
        { t:{ fr:`Unreal l'appelle automatiquement de toute façon`, en:`Unreal calls it automatically anyway` }, c:false,
          fb:{ fr:`Non, Unreal ne peut pas savoir où dans ta méthode tu veux que la logique parente s'exécute. Tu dois l'appeler explicitement.`, en:`No, Unreal can't know where in your method you want parent logic to execute. You must call it explicitly.` } },
      ]
    },
    {
      id:'a9_2', type:'fill', xp:20,
      instr:{
        fr:`Dans le constructeur d'un Actor statique (mur, décor), désactive le Tick pour optimiser les performances :`,
        en:`In the constructor of a static Actor (wall, scenery), disable Tick to optimize performance:`
      },
      template:{ fr:'PrimaryActorTick.bCanEverTick = ______;', en:'PrimaryActorTick.bCanEverTick = ______;' },
      answer:'false',
      hint:{ fr:'La valeur booléenne qui désactive quelque chose', en:'The boolean value that disables something' }
    },
    {
      id:'a9_3', type:'bug', xp:25,
      instr:{
        fr:`Ce mouvement est frame-rate dépendant. Pourquoi ?`,
        en:`This movement is frame-rate dependent. Why?`
      },
      bugCode:`<span class="kw2">void</span> <span class="fn2">Tick</span>(<span class="kw2">float</span> DeltaTime) {
    <span class="kw2">Super</span>::<span class="fn2">Tick</span>(DeltaTime);
    <span class="ty">FVector</span> Loc = <span class="fn2">GetActorLocation</span>();
    <span class="bug-line">Loc.X += Speed;</span>
    <span class="fn2">SetActorLocation</span>(Loc);
}`,
      explanation:{
        fr:`Le mouvement utilise Speed sans le multiplier par DeltaTime. À 60fps, l'objet se déplace 60×Speed par seconde. À 30fps, seulement 30×Speed. La correction : Loc.X += Speed * DeltaTime — identique au bug classique dans Unity quand on oublie Time.deltaTime.`,
        en:`The movement uses Speed without multiplying by DeltaTime. At 60fps, the object moves 60×Speed per second. At 30fps, only 30×Speed. The fix: Loc.X += Speed * DeltaTime — identical to the classic Unity bug when forgetting Time.deltaTime.`
      }
    },
    {
      id:'a9_4', type:'engine', xp:40,
      label:{ fr:'Dans Unity + Unreal', en:'In Unity + Unreal' },
      task:{
        fr:`1. Dans Unity : crée un objet qui se déplace horizontalement dans Update() avec Time.deltaTime. 2. Dans Unreal : crée un Actor C++ qui fait le même mouvement dans Tick(float DeltaTime). Compile et joue. 3. Dans les deux moteurs, change le Target Frame Rate (console : t.MaxFPS 30 dans Unreal). Est-ce que le mouvement reste cohérent ?`,
        en:`1. In Unity: create an object that moves horizontally in Update() with Time.deltaTime. 2. In Unreal: create a C++ Actor that does the same movement in Tick(float DeltaTime). Compile and play. 3. In both engines, change the Target Frame Rate (console: t.MaxFPS 30 in Unreal). Is the movement consistent?`
      },
      note:{
        fr:`Si le mouvement est différent selon le framerate, tu as trouvé un bug DeltaTime.`,
        en:`If movement differs by framerate, you've found a DeltaTime bug.`
      }
    },
    {
      id:'a9_5', type:'reflect', xp:10,
      prompt:{
        fr:`Certains calculs de jeu (physique, réseau, IA) se font à un timestep fixe plutôt qu'à chaque frame. Unity a FixedUpdate(), Unreal a des Physics Tick séparés. Pourquoi est-ce important de ne pas mélanger logique physique et logique de rendu dans le même Tick ?`,
        en:`Some game calculations (physics, network, AI) happen at a fixed timestep rather than every frame. Unity has FixedUpdate(), Unreal has separate Physics Ticks. Why is it important not to mix physics logic and rendering logic in the same Tick?`
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
