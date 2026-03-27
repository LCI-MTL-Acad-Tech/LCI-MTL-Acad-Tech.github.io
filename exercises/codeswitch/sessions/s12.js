'use strict';
// Session 12 — Collision & Overlap

const SESSION = {
  id:        's12',
  num:       12,
  prev:      11,
  next:      13,
  xp:        130,
  blocName:  { fr:'Patterns de jeu', en:'Game Patterns' },
  blocColor: '#fe6c06',
  title:     { fr:'Collision & Overlap', en:'Collision & Overlap' },
  sub:       { fr:'OnTriggerEnter → NotifyActorBeginOverlap', en:'OnTriggerEnter → NotifyActorBeginOverlap' },

  tutor: {
    concept: {
      fr:`En Unity : OnTriggerEnter, OnCollisionEnter, Physics.Raycast. En Unreal : NotifyActorBeginOverlap, OnComponentHit, LineTraceSingleByChannel. Les concepts sont identiques, la syntaxe diffère. La grande différence : Unreal a un système de Collision Channels très granulaire qui remplace et dépasse les Physics Layers Unity.`,
      en:`In Unity: OnTriggerEnter, OnCollisionEnter, Physics.Raycast. In Unreal: NotifyActorBeginOverlap, OnComponentHit, LineTraceSingleByChannel. Concepts are identical, syntax differs. The big difference: Unreal has a very granular Collision Channels system that replaces and surpasses Unity's Physics Layers.`
    },
    demoSteps: [
      {
        label: { fr:'NotifyActorBeginOverlap = OnTriggerEnter', en:'NotifyActorBeginOverlap = OnTriggerEnter' },
        fr:`Montre NotifyActorBeginOverlap(AActor* OtherActor) dans un Actor Unreal. Compare avec OnTriggerEnter(Collider other) en Unity. Même logique : appelé quand un autre objet entre dans la zone. OtherActor est l'équivalent de other.gameObject. Montre aussi NotifyActorEndOverlap pour la sortie.`,
        en:`Show NotifyActorBeginOverlap(AActor* OtherActor) in an Unreal Actor. Compare with OnTriggerEnter(Collider other) in Unity. Same logic: called when another object enters the zone. OtherActor is the equivalent of other.gameObject. Also show NotifyActorEndOverlap for exit.`
      },
      {
        label: { fr:'OnComponentBeginOverlap — sur un Component spécifique', en:'OnComponentBeginOverlap — on a specific Component' },
        fr:`Plutôt que de surcharger NotifyActorBeginOverlap (qui réagit à tout), on peut lier un callback directement sur un Component via son delegate. Dans BeginPlay() : MySphereComponent->OnComponentBeginOverlap.AddDynamic(this, &AMyActor::OnSphereOverlap). C'est plus précis — seulement la sphere, pas la capsule ou le mesh. Analogie Unity : ajouter un listener sur un Collider spécifique.`,
        en:`Rather than overriding NotifyActorBeginOverlap (which reacts to everything), we can bind a callback directly on a Component via its delegate. In BeginPlay(): MySphereComponent->OnComponentBeginOverlap.AddDynamic(this, &AMyActor::OnSphereOverlap). More precise — only the sphere, not the capsule or mesh. Unity analogy: adding a listener on a specific Collider.`
      },
      {
        label: { fr:'LineTraceSingleByChannel = Raycast', en:'LineTraceSingleByChannel = Raycast' },
        fr:`Physics.Raycast en Unity → GetWorld()->LineTraceSingleByChannel() en Unreal. Montre la structure FHitResult qui contient les infos du hit (Actor touché, Component, point de contact, normale). Plus verbose qu'Unity mais bien plus riche en informations. Montre aussi la visualisation avec DrawDebugLine pour le debug.`,
        en:`Physics.Raycast in Unity → GetWorld()->LineTraceSingleByChannel() in Unreal. Show the FHitResult structure containing hit info (hit Actor, Component, contact point, normal). More verbose than Unity but much richer in information. Also show DrawDebugLine for debug visualization.`
      },
      {
        label: { fr:'Block vs Overlap — la distinction Unreal', en:'Block vs Overlap — the Unreal distinction' },
        fr:`Unreal distingue Block (collision physique qui stoppe le mouvement) et Overlap (trigger sans résistance). En Unity, c'est Collider (block) vs Trigger (overlap). La différence : en Unreal, un même objet peut bloquer certains types de collision tout en permettant l'overlap pour d'autres, configuré via les Collision Channels dans l'éditeur.`,
        en:`Unreal distinguishes Block (physical collision that stops movement) and Overlap (trigger without resistance). In Unity, it's Collider (block) vs Trigger (overlap). The difference: in Unreal, the same object can block certain collision types while allowing overlap for others, configured via Collision Channels in the editor.`
      },
    ],
    discussion: [
      {
        fr:`En Unity, pour faire un raycast d'arme vers une cible, tu utilisais quel pattern ? Comment tu gérais les layers pour ignorer certains objets (ex. ignorer le propre corps du joueur) ?`,
        en:`In Unity, for a weapon raycast to the target, what pattern did you use? How did you manage layers to ignore certain objects (e.g. ignore the player's own body)?`
      },
    ],
    deep: {
      fr:`<p><strong>Multi-trace et SweepTrace.</strong> LineTraceSingleByChannel retourne le premier hit. Pour tous les hits sur le trajet, utilise <code>LineTraceMultiByChannel</code>. Pour un "rayon avec épaisseur" (ex. une balle grosse ou un objet qui balaye une zone), utilise <code>SweepSingleByChannel</code> avec une forme (sphere, capsule, box).</p>
<p>Exemple pratique : une attaque de mêlée au corps à corps utilise souvent un SweepTrace en forme de capsule pour simuler le volume de l'arme. Beaucoup plus précis qu'un simple raycast fin, et toujours plus performant que créer un Component de collision temporaire.</p>`,
      en:`<p><strong>Multi-trace and SweepTrace.</strong> LineTraceSingleByChannel returns the first hit. For all hits along the path, use <code>LineTraceMultiByChannel</code>. For a "ray with thickness" (e.g. a large bullet or an object sweeping an area), use <code>SweepSingleByChannel</code> with a shape (sphere, capsule, box).</p>
<p>Practical example: a melee attack often uses a capsule-shaped SweepTrace to simulate the weapon's volume. Much more precise than a thin raycast, and still more performant than creating a temporary collision Component.</p>`
    }
  },

  compare: {
    cs:`<span class="cm">// Unity — trigger</span>
<span class="kw">void</span> <span class="fn">OnTriggerEnter</span>(
    <span class="ty">Collider</span> other)
{
    <span class="kw">if</span>(other.<span class="fn">CompareTag</span>(<span class="str">"Player"</span>))
        <span class="fn">PickUp</span>();
}
<span class="cm">// Raycast</span>
<span class="ty">Physics</span>.<span class="fn">Raycast</span>(
    origin, dir, <span class="kw">out</span> hit);`,
    cpp:`<span class="cm">// Unreal — overlap</span>
<span class="kw2">void</span> <span class="fn2">NotifyActorBeginOverlap</span>(
    <span class="ty">AActor</span>* Other)
{
    <span class="kw2">if</span>(Other-&gt;<span class="fn2">ActorHasTag</span>(<span class="str">"Player"</span>))
        <span class="fn2">PickUp</span>();
}
<span class="cm">// LineTrace</span>
<span class="ty">FHitResult</span> Hit;
GetWorld()-&gt;<span class="fn2">LineTraceSingleByChannel</span>(
    Hit, Start, End, ECC_Visibility);`
  },

  activities: [
    {
      id:'a12_1', type:'quiz', xp:15,
      q:{
        fr:`Quel est l'équivalent Unreal de OnTriggerEnter() en Unity ?`,
        en:`What is the Unreal equivalent of Unity's OnTriggerEnter()?`
      },
      choices:[
        { t:'OnComponentHit()', c:false,
          fb:{ fr:`OnComponentHit est pour les collisions physiques (Block), pas les overlaps (Trigger).`, en:`OnComponentHit is for physical collisions (Block), not overlaps (Trigger).` } },
        { t:'NotifyActorBeginOverlap()', c:true,
          fb:{ fr:`Correct. NotifyActorBeginOverlap est appelé sur l'Actor quand un autre Actor entre en overlap. Équivalent direct de OnTriggerEnter.`, en:`Correct. NotifyActorBeginOverlap is called on the Actor when another Actor begins overlapping. Direct equivalent of OnTriggerEnter.` } },
        { t:'BeginPlay()', c:false,
          fb:{ fr:`BeginPlay est appelé au démarrage de l'Actor, pas lors d'une collision.`, en:`BeginPlay is called when the Actor starts, not on collision.` } },
        { t:'Tick(float DeltaTime)', c:false,
          fb:{ fr:`Tick est appelé chaque frame, pas spécifiquement lors d'un overlap.`, en:`Tick is called every frame, not specifically on overlap.` } },
      ]
    },
    {
      id:'a12_2', type:'fill', xp:20,
      instr:{
        fr:`Complète la déclaration de la structure qui stocke les informations d'un LineTrace en Unreal :`,
        en:`Complete the declaration of the structure that stores LineTrace information in Unreal:`
      },
      template:{ fr:'F______ HitResult;\nGetWorld()->LineTraceSingleByChannel(..., HitResult, ...);', en:'F______ HitResult;\nGetWorld()->LineTraceSingleByChannel(..., HitResult, ...);' },
      answer:'HitResult',
      hint:{ fr:'La structure Unreal qui stocke les infos d\'un impact (commence par F)', en:'The Unreal structure that stores impact information (starts with F)' }
    },
    {
      id:'a12_3', type:'bug', xp:30,
      instr:{
        fr:`Ce code de pickup ne se déclenche jamais, même quand le joueur touche le collectible. Trouve pourquoi.`,
        en:`This pickup code never triggers, even when the player touches the collectible. Find why.`
      },
      bugCode:`<span class="kw2">void</span> <span class="fn2">NotifyActorBeginOverlap</span>(
    <span class="ty">AActor</span>* OtherActor)
{
    <span class="kw2">if</span>(OtherActor-&gt;<span class="fn2">ActorHasTag</span>(
        <span class="str"><span class="bug-line">"player"</span></span>))
        <span class="fn2">Collect</span>();
}`,
      explanation:{
        fr:`Les tags Unreal sont sensibles à la casse. Si le joueur a le tag "Player" (P majuscule) et qu'on cherche "player" (p minuscule), ActorHasTag retourne false. Toujours vérifier la casse exacte des tags dans l'éditeur Unreal — et préférer des constantes nommées plutôt que des strings en dur pour éviter ce type d'erreur.`,
        en:`Unreal tags are case-sensitive. If the player has tag "Player" (capital P) and we search for "player" (lowercase p), ActorHasTag returns false. Always verify the exact case of tags in the Unreal editor — and prefer named constants over hardcoded strings to avoid this type of error.`
      }
    },
    {
      id:'a12_4', type:'engine', xp:50,
      label:{ fr:'Dans Unreal', en:'In Unreal' },
      task:{
        fr:`1. Crée un Actor C++ avec une USphereComponent comme trigger zone. 2. Dans BeginPlay(), lie MySphere->OnComponentBeginOverlap.AddDynamic(this, &AMyActor::OnOverlap). 3. Implémente OnOverlap pour logger "Overlap!" avec UE_LOG quand un Actor entre. 4. Configure le SphereComponent pour qu'il génère des overlaps (SetGenerateOverlapEvents(true)). 5. Place l'Actor dans la scène avec le personnage et teste.`,
        en:`1. Create a C++ Actor with a USphereComponent as a trigger zone. 2. In BeginPlay(), bind MySphere->OnComponentBeginOverlap.AddDynamic(this, &AMyActor::OnOverlap). 3. Implement OnOverlap to log "Overlap!" with UE_LOG when an Actor enters. 4. Configure the SphereComponent to generate overlaps (SetGenerateOverlapEvents(true)). 5. Place the Actor in the scene with the character and test.`
      },
      note:{
        fr:`C'est l'un des exercices les plus complets jusqu'ici — prends le temps de lire les erreurs de compilation si ça ne compile pas du premier coup.`,
        en:`This is one of the most complete exercises so far — take time to read compilation errors if it doesn't compile on the first try.`
      }
    },
    {
      id:'a12_5', type:'reflect', xp:10,
      prompt:{
        fr:`Unreal distingue Block (collision physique) et Overlap (trigger). Dans ton dernier projet Unity, as-tu eu des cas où tu avais besoin des deux sur le même objet — ex. un personnage qui bloque physiquement ET détecte les pickups ? Comment tu avais résolu ça, et comment le ferais-tu en Unreal ?`,
        en:`Unreal distinguishes Block (physical collision) and Overlap (trigger). In your last Unity project, did you need both on the same object — e.g. a character that physically blocks AND detects pickups? How did you solve it, and how would you do it in Unreal?`
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
