'use strict';
// Session 12 — Collision & Overlap
// IDE arc S12: multi-file project with inheritance — Event/Observer pattern in pure C++

const SESSION = {
  id:'s12', num:12, prev:11, next:13, xp:130,
  blocName:{ fr:'Patterns de jeu', en:'Game Patterns' },
  blocColor:'#fe6c06',
  title:{ fr:'Collision & Overlap', en:'Collision & Overlap' },
  sub:{ fr:'OnTriggerEnter → NotifyActorBeginOverlap — Collision Channels en C++', en:'OnTriggerEnter → NotifyActorBeginOverlap — Collision Channels in C++' },

  tutor:{
    concept:{
      fr:`En Unity, OnTriggerEnter(Collider other) est déclenché automatiquement. En Unreal C++, l'équivalent est NotifyActorBeginOverlap(AActor* OtherActor) pour les Actors, ou OnComponentBeginOverlap pour les Components spécifiques. La collision en Unreal est plus granulaire : chaque Component a son propre Collision Channel et ses réponses (Ignore, Overlap, Block). Configurable en code et dans l'éditeur.`,
      en:`In Unity, OnTriggerEnter(Collider other) fires automatically. In Unreal C++, the equivalent is NotifyActorBeginOverlap(AActor* OtherActor) for Actors, or OnComponentBeginOverlap for specific Components. Collision in Unreal is more granular: each Component has its own Collision Channel and responses (Ignore, Overlap, Block). Configurable in code and in the editor.`
    },
    deep:{
      fr:`<p><strong>Channels personnalisés et traces.</strong> Unreal permet de créer des Collision Channels personnalisés (ex. "Projectile", "Pickup") via le Project Settings. Les traces (LineTrace, SphereTrace) utilisent ces channels pour ne détecter que ce qui est pertinent — une balle ne teste que les ennemis et les décors, pas les autres balles.</p>
<p>En C++ : <code>GetWorld()->LineTraceSingleByChannel(HitResult, Start, End, ECC_Visibility)</code>. C'est l'équivalent de Physics.Raycast en Unity, mais avec un contrôle plus fin sur quels objects sont "vus".</p>`,
      en:`<p><strong>Custom channels and traces.</strong> Unreal allows creating custom Collision Channels (e.g. "Projectile", "Pickup") via Project Settings. Traces (LineTrace, SphereTrace) use these channels to detect only what's relevant — a bullet only tests enemies and scenery, not other bullets.</p>
<p>In C++: <code>GetWorld()->LineTraceSingleByChannel(HitResult, Start, End, ECC_Visibility)</code>. It's the equivalent of Physics.Raycast in Unity, but with finer control over which objects are "seen".</p>`
    }
  },

  ide:{
    demoSteps:[
      {
        label:{ fr:'Pattern Observer — callback sur événement', en:'Observer pattern — event callback' },
        fr:`Crée event.h avec une classe EventSystem simple : class EventSystem { vector<function<void()>> listeners; public: void subscribe(function<void()> cb) { listeners.push_back(cb); } void fire() { for(auto& cb : listeners) cb(); } };. Inclus <functional> et <vector>. C'est le pattern Observer — équivalent d'un UnityEvent ou d'un delegate C#.`,
        en:`Create event.h with a simple EventSystem class: class EventSystem { vector<function<void()>> listeners; public: void subscribe(function<void()> cb) { listeners.push_back(cb); } void fire() { for(auto& cb : listeners) cb(); } };. Include <functional> and <vector>. This is the Observer pattern — equivalent of a UnityEvent or a C# delegate.`
      },
      {
        label:{ fr:'Collision simulée — deux zones rectangulaires', en:'Simulated collision — two rectangular zones' },
        fr:`Crée une struct Rect { float x, y, w, h; bool overlaps(const Rect& o) const { return x < o.x+o.w && x+w > o.x && y < o.y+o.h && y+h > o.y; } };. Dans main(), simule un test de collision chaque "frame" dans une boucle et déclenche l'EventSystem quand overlaps() retourne true. C'est le principe derrière tout système de collision — vérification géométrique + événement.`,
        en:`Create a struct Rect { float x, y, w, h; bool overlaps(const Rect& o) const { return x < o.x+o.w && x+w > o.x && y < o.y+o.h && y+h > o.y; } };. In main(), simulate a collision check each "frame" in a loop and trigger the EventSystem when overlaps() returns true. This is the principle behind every collision system — geometric check + event.`
      },
      {
        label:{ fr:'std::function et lambda — callbacks modernes', en:'std::function and lambda — modern callbacks' },
        fr:`Montre comment s'abonner à l'EventSystem avec une lambda : system.subscribe([]() { cout << "Collision!"; });. La lambda [] () { ... } est une fonction anonyme — équivalent de () => en C#. Montre aussi la capture : int count = 0; system.subscribe([&count]() { count++; cout << count; }); — le [&count] capture la variable par référence.`,
        en:`Show how to subscribe to the EventSystem with a lambda: system.subscribe([]() { cout << "Collision!"; });. The lambda [] () { ... } is an anonymous function — equivalent of () => in C#. Also show capture: int count = 0; system.subscribe([&count]() { count++; cout << count; }); — the [&count] captures the variable by reference.`
      },
    ],
    discussion:[
      { fr:`Le pattern Observer (EventSystem) décorrèle l'émetteur des receveurs. En quoi c'est plus flexible qu'un appel direct de méthode ? Donne un exemple de jeu où ça évite du couplage fort.`, en:`The Observer pattern (EventSystem) decouples the emitter from receivers. Why is that more flexible than a direct method call? Give a game example where it avoids tight coupling.` },
    ],
    compare:{
      std:`<span class="cm">// C++ — std::function callback</span>
#include &lt;functional&gt;
#include &lt;vector&gt;

<span class="kw2">int</span> count = <span class="num">0</span>;
<span class="ty">EventSystem</span> onCollide;

onCollide.<span class="fn2">subscribe</span>(
    [&amp;count]() { count++; }
);
onCollide.<span class="fn2">subscribe</span>(
    []() { std::cout &lt;&lt; <span class="str">"Hit!"</span>; }
);
onCollide.<span class="fn2">fire</span>();  <span class="cm">// tous les callbacks</span>`,
      unreal:`<span class="cm">// Unreal — delegate / overlap</span>
<span class="kw2">void</span> <span class="fn2">BeginPlay</span>() <span class="kw2">override</span> {
    <span class="kw2">Super</span>::<span class="fn2">BeginPlay</span>();
    Sphere-&gt;OnComponentBeginOverlap
        .<span class="fn2">AddDynamic</span>(<span class="kw2">this</span>,
        &amp;<span class="ty">ACollectible</span>::<span class="fn2">OnOverlap</span>);
}
<span class="mac">UFUNCTION</span>()
<span class="kw2">void</span> <span class="fn2">OnOverlap</span>(
    <span class="ty">UPrimitiveComponent</span>* Self,
    <span class="ty">AActor</span>* Other, ...);`
    },
    activities:[
      {
        id:'i12_1', type:'predict', xp:15,
        code:`#include &lt;iostream&gt;
#include &lt;functional&gt;
#include &lt;vector&gt;
struct Event {
    std::vector&lt;std::function&lt;void(int)&gt;&gt; cbs;
    void on(std::function&lt;void(int)&gt; cb) { cbs.push_back(cb); }
    void emit(int v) { for(auto& c : cbs) c(v); }
};
int main() {
    Event e;
    int total = 0;
    e.on([&total](int v){ total += v; });
    e.on([](int v){ std::cout &lt;&lt; v*2 &lt;&lt; " "; });
    e.emit(3);
    e.emit(5);
    std::cout &lt;&lt; total;
}`,
        question:{ fr:`Dans quel ordre les callbacks s'exécutent-ils, et quelle est la sortie complète ?`, en:`In what order do the callbacks execute, and what is the full output?` },
        output:`6 10 8`,
        explanation:{ fr:`emit(3) : callback 1 (total += 3 = 3), callback 2 (affiche 6). emit(5) : callback 1 (total += 5 = 8), callback 2 (affiche 10). Puis total (8) est affiché. Sortie : "6 10 8". Les callbacks s'exécutent dans l'ordre d'abonnement.`, en:`emit(3): callback 1 (total += 3 = 3), callback 2 (prints 6). emit(5): callback 1 (total += 5 = 8), callback 2 (prints 10). Then total (8) is printed. Output: "6 10 8". Callbacks execute in subscription order.` }
      },
      {
        id:'i12_2', type:'cpp', xp:35,
        instr:{ fr:`Implémente un système de collision 2D simplifié. Crée une struct AABB (Axis-Aligned Bounding Box) avec float x, y, w, h et une méthode bool intersects(const AABB& o) const. Crée deux AABB dans main(), teste si elles se superposent, et affiche "Collision!" ou "Pas de collision".`, en:`Implement a simplified 2D collision system. Create an AABB (Axis-Aligned Bounding Box) struct with float x, y, w, h and a bool intersects(const AABB& o) const method. Create two AABBs in main(), test if they overlap, and print "Collision!" or "No collision".` },
        stub:`#include &lt;iostream&gt;
struct AABB {
    float x, y, w, h;
    bool intersects(const AABB& o) const {
        // vrai si les deux rectangles se superposent
        // true if the two rectangles overlap
    }
};
int main() {
    AABB a{0, 0, 4, 4};
    AABB b{3, 3, 4, 4};  // superposition partielle
    AABB c{10, 10, 2, 2}; // pas de contact
    std::cout &lt;&lt; (a.intersects(b) ? "Collision!" : "Pas de collision") &lt;&lt; std::endl;
    std::cout &lt;&lt; (a.intersects(c) ? "Collision!" : "Pas de collision") &lt;&lt; std::endl;
    return 0;
}`,
        hint:{ fr:`Deux rectangles se superposent si : x < o.x+o.w && x+w > o.x && y < o.y+o.h && y+h > o.y`, en:`Two rectangles overlap if: x < o.x+o.w && x+w > o.x && y < o.y+o.h && y+h > o.y` },
        solution:{
          fr:`<pre style="font-family:var(--mono);font-size:1.3rem;line-height:1.8;color:#e0e8ef">bool intersects(const AABB& o) const {
    return x < o.x + o.w &&
           x + w > o.x   &&
           y < o.y + o.h &&
           y + h > o.y;
}</pre><p style="margin-top:.8rem;font-size:1.4rem;color:var(--ch2)">Sortie : <code>Collision!</code> puis <code>Pas de collision</code></p>`,
          en:`<pre style="font-family:var(--mono);font-size:1.3rem;line-height:1.8;color:#e0e8ef">bool intersects(const AABB& o) const {
    return x < o.x + o.w &&
           x + w > o.x   &&
           y < o.y + o.h &&
           y + h > o.y;
}</pre><p style="margin-top:.8rem;font-size:1.4rem;color:var(--ch2)">Output: <code>Collision!</code> then <code>No collision</code></p>`
        }
      },
      {
        id:'i12_3', type:'bug', xp:20,
        instr:{ fr:`Cette lambda capture une variable par valeur alors qu'elle devrait la modifier. Identifie et corrige.`, en:`This lambda captures a variable by value when it should modify it. Identify and fix.` },
        bugCode:`<span class="kw2">int</span> score = <span class="num">0</span>;
<span class="kw2">auto</span> onHit = [<span class="bug-line">score</span>]() {
    score += <span class="num">10</span>;  <span class="cm">// ne modifie pas score !</span>
};
onHit(); onHit();
std::cout &lt;&lt; score;  <span class="cm">// affiche 0</span>`,
        explanation:{ fr:`[score] capture score par valeur — une copie locale est modifiée, pas la variable originale. score restera 0 après les appels. Correction : [&score] pour capturer par référence. Règle : pour modifier une variable extérieure dans une lambda, toujours capturer par référence (&).`, en:`[score] captures score by value — a local copy is modified, not the original variable. score will remain 0 after calls. Fix: [&score] to capture by reference. Rule: to modify an outer variable inside a lambda, always capture by reference (&).` }
      },
      {
        id:'i12_4', type:'fill', xp:15,
        instr:{ fr:`Pour capturer une variable extérieure par référence dans une lambda C++ :`, en:`To capture an outer variable by reference in a C++ lambda:` },
        template:{ fr:'auto cb = [______count]() { count++; };', en:'auto cb = [______count]() { count++; };' },
        answer:'&',
        hint:{ fr:`Le préfixe de capture qui prend l'adresse de la variable au lieu de la copier`, en:`The capture prefix that takes the variable's address instead of copying it` }
      },
    ],
  },

  engine:{
    demoSteps:[
      {
        label:{ fr:'Configure la collision sur un Component', en:'Configure collision on a Component' },
        fr:`Dans le constructeur de l'Actor, crée un USphereComponent : Sphere = CreateDefaultSubobject<USphereComponent>(TEXT("Sphere")). Configure : Sphere->SetCollisionEnabled(ECollisionEnabled::QueryOnly); Sphere->SetCollisionResponseToAllChannels(ECR_Ignore); Sphere->SetCollisionResponseToChannel(ECC_Pawn, ECR_Overlap);. C'est plus explicite qu'Unity — on contrôle exactement avec quoi le component interagit.`,
        en:`In the Actor's constructor, create a USphereComponent: Sphere = CreateDefaultSubobject<USphereComponent>(TEXT("Sphere")). Configure: Sphere->SetCollisionEnabled(ECollisionEnabled::QueryOnly); Sphere->SetCollisionResponseToAllChannels(ECR_Ignore); Sphere->SetCollisionResponseToChannel(ECC_Pawn, ECR_Overlap);. More explicit than Unity — you control exactly what the component interacts with.`
      },
      {
        label:{ fr:'Lie OnComponentBeginOverlap dans BeginPlay()', en:'Bind OnComponentBeginOverlap in BeginPlay()' },
        fr:`Dans BeginPlay() : Sphere->OnComponentBeginOverlap.AddDynamic(this, &AMyActor::OnOverlap);. Dans le .h, déclare : UFUNCTION() void OnOverlap(UPrimitiveComponent* Self, AActor* Other, UPrimitiveComponent* OtherComp, int32 OtherIdx, bool bFromSweep, const FHitResult& Hit);. La signature doit être exacte — AddDynamic est sensible aux types des paramètres.`,
        en:`In BeginPlay(): Sphere->OnComponentBeginOverlap.AddDynamic(this, &AMyActor::OnOverlap);. In the .h, declare: UFUNCTION() void OnOverlap(UPrimitiveComponent* Self, AActor* Other, UPrimitiveComponent* OtherComp, int32 OtherIdx, bool bFromSweep, const FHitResult& Hit);. The signature must be exact — AddDynamic is sensitive to parameter types.`
      },
      {
        label:{ fr:'Implémente OnOverlap et teste', en:'Implement OnOverlap and test' },
        fr:`void AMyActor::OnOverlap(...) { if(AActor* Pawn = Cast<AActor>(Other)) { UE_LOG(LogTemp, Display, TEXT("Overlap avec: %s"), *Pawn->GetName()); Destroy(); } }. Place l'Actor dans la scène avec le ThirdPerson character. Joue et marche dans l'Actor. L'Actor doit loguer l'overlap et se détruire. Compare avec OnTriggerEnter en Unity — même logique, syntaxe plus explicite.`,
        en:`void AMyActor::OnOverlap(...) { if(AActor* Pawn = Cast<AActor>(Other)) { UE_LOG(LogTemp, Display, TEXT("Overlap with: %s"), *Pawn->GetName()); Destroy(); } }. Place the Actor in the scene with the ThirdPerson character. Play and walk into the Actor. It should log the overlap and destroy itself. Compare with OnTriggerEnter in Unity — same logic, more explicit syntax.`
      },
    ],
    discussion:[
      { fr:`En Unity, la collision est configurée sur le GameObject via le Collider inspector. En Unreal, c'est par Component en code. Lequel donne plus de contrôle dans un jeu avec beaucoup de types d'objets différents ?`, en:`In Unity, collision is configured on the GameObject via the Collider inspector. In Unreal, it's per Component in code. Which gives more control in a game with many different object types?` },
    ],
    compare:{
      cs:`<span class="cm">// Unity</span>
<span class="kw">void</span> <span class="fn">OnTriggerEnter</span>(
    <span class="ty">Collider</span> other)
{
    <span class="kw">if</span>(other.<span class="fn">CompareTag</span>(<span class="str">"Player"</span>))
    {
        <span class="fn">Destroy</span>(gameObject);
    }
}`,
      cpp:`<span class="cm">// Unreal</span>
<span class="mac">UFUNCTION</span>()
<span class="kw2">void</span> <span class="fn2">OnOverlap</span>(
    <span class="ty">UPrimitiveComponent</span>* Self,
    <span class="ty">AActor</span>* Other, ...)
{
    <span class="kw2">if</span>(<span class="fn2">Cast</span>&lt;<span class="ty">ACharacter</span>&gt;(Other))
        <span class="fn2">Destroy</span>();
}`
    },
    activities:[
      {
        id:'e12_1', type:'quiz', xp:15,
        q:{ fr:`Pourquoi la méthode OnOverlap liée avec AddDynamic doit-elle être marquée UFUNCTION() ?`, en:`Why must the OnOverlap method bound with AddDynamic be marked UFUNCTION()?` },
        choices:[
          { t:{ fr:`Pour la rendre plus rapide à l'exécution`, en:`To make it faster at runtime` }, c:false, fb:{ fr:`UFUNCTION() n'affecte pas les performances — c'est une macro de réflexion.`, en:`UFUNCTION() doesn't affect performance — it's a reflection macro.` } },
          { t:{ fr:`Pour qu'Unreal puisse la trouver via le système de réflexion au moment du binding`, en:`So Unreal can find it via the reflection system at binding time` }, c:true, fb:{ fr:`Correct. AddDynamic utilise la réflexion Unreal pour lier la fonction par nom — sans UFUNCTION(), la fonction est invisible au système de delegates.`, en:`Correct. AddDynamic uses Unreal's reflection to bind the function by name — without UFUNCTION(), the function is invisible to the delegate system.` } },
          { t:{ fr:`Pour pouvoir l'appeler depuis Blueprint`, en:`To be able to call it from Blueprint` }, c:false, fb:{ fr:`UFUNCTION() sans spécificateur BlueprintCallable ne l'expose pas aux Blueprints. C'est pour le système de réflexion interne.`, en:`UFUNCTION() without BlueprintCallable doesn't expose it to Blueprints. It's for the internal reflection system.` } },
          { t:{ fr:`Pour éviter que le GC ne supprime la fonction`, en:`To prevent the GC from deleting the function` }, c:false, fb:{ fr:`Le GC gère les UObjects — pas les fonctions membres C++. UFUNCTION() est pour la réflexion.`, en:`The GC manages UObjects — not C++ member functions. UFUNCTION() is for reflection.` } },
        ]
      },
      {
        id:'e12_2', type:'fill', xp:20,
        instr:{ fr:`Pour qu'un Component Unreal génère des événements Overlap (et non Block), la réponse de collision correcte est :`, en:`For an Unreal Component to generate Overlap events (not Block), the correct collision response is:` },
        template:{ fr:'Sphere->SetCollisionResponseToChannel(ECC_Pawn, ______);', en:'Sphere->SetCollisionResponseToChannel(ECC_Pawn, ______);' },
        answer:'ECR_Overlap',
        hint:{ fr:`L'une des trois réponses Unreal : ECR_Ignore, ECR_Overlap, ECR_Block`, en:`One of Unreal's three responses: ECR_Ignore, ECR_Overlap, ECR_Block` }
      },
      {
        id:'e12_3', type:'bug', xp:25,
        instr:{ fr:`Cet Actor est censé détecter les overlaps avec le personnage, mais ne reçoit jamais l'événement. Identifie pourquoi.`, en:`This Actor is supposed to detect overlaps with the character, but never receives the event. Identify why.` },
        bugCode:`<span class="cm">// Constructeur</span>
Sphere-&gt;<span class="fn2">SetCollisionEnabled</span>(
    <span class="ty">ECollisionEnabled</span>::QueryOnly);
Sphere-&gt;<span class="fn2">SetCollisionResponseToAllChannels</span>(
    <span class="bug-line"><span class="ty">ECR_Block</span></span>);

<span class="cm">// BeginPlay</span>
Sphere-&gt;OnComponentBeginOverlap.<span class="fn2">AddDynamic</span>(
    <span class="kw2">this</span>, &amp;<span class="ty">AItem</span>::<span class="fn2">OnOverlap</span>);`,
        explanation:{ fr:`ECR_Block ne génère pas d'événements Overlap — il bloque le mouvement. Pour recevoir OnComponentBeginOverlap, il faut ECR_Overlap. Correction : SetCollisionResponseToAllChannels(ECR_Ignore); puis SetCollisionResponseToChannel(ECC_Pawn, ECR_Overlap); — ignore tout sauf les Pawns qu'on detecte par Overlap.`, en:`ECR_Block doesn't generate Overlap events — it blocks movement. To receive OnComponentBeginOverlap, you need ECR_Overlap. Fix: SetCollisionResponseToAllChannels(ECR_Ignore); then SetCollisionResponseToChannel(ECC_Pawn, ECR_Overlap); — ignore everything except Pawns detected by Overlap.` }
      },
      {
        id:'e12_4', type:'engine', xp:40,
        label:{ fr:'Dans Unreal', en:'In Unreal' },
        task:{ fr:`Crée un Actor C++ "Collectible" qui se détruit quand le joueur le touche et affiche un message dans le log. Étapes : 1. USphereComponent comme RootComponent. 2. SetCollisionResponseToAllChannels(ECR_Ignore), puis ECR_Overlap pour ECC_Pawn. 3. AddDynamic vers une fonction OnOverlap marquée UFUNCTION(). 4. Dans OnOverlap, Cast<ACharacter>(Other) pour vérifier que c'est le joueur, puis UE_LOG + Destroy(). 5. Place 5 instances dans la scène et collecte-les toutes.`, en:`Create a C++ "Collectible" Actor that destroys itself when the player touches it and logs a message. Steps: 1. USphereComponent as RootComponent. 2. SetCollisionResponseToAllChannels(ECR_Ignore), then ECR_Overlap for ECC_Pawn. 3. AddDynamic to an OnOverlap function marked UFUNCTION(). 4. In OnOverlap, Cast<ACharacter>(Other) to verify it's the player, then UE_LOG + Destroy(). 5. Place 5 instances in the scene and collect them all.` },
        note:{ fr:`Ce Collectible sera réutilisé et enrichi dans la session 15.`, en:`This Collectible will be reused and enhanced in session 15.` }
      },
    ],
  },

  homework:{
    core:[
      {diff:'easy', fr:'Écris un EventSystem<T> template qui stocke des callbacks std::function<void(T)>. Teste avec T=int (événement de dommage) et T=string (message).', en:'Write a template EventSystem<T> that stores std::function<void(T)> callbacks. Test with T=int (damage event) and T=string (message).'},
      {diff:'medium', fr:'Implémente un système AABB 2D complet : détection de collision, résolution de direction (de quel côté vient la collision), et un callback OnCollision.', en:'Implement a complete 2D AABB system: collision detection, direction resolution (which side the collision came from), and an OnCollision callback.'},
      {diff:'hard', fr:'Simule 10 objets en mouvement dans une grille 2D. Pour chaque frame, vérifie toutes les paires de collisions (O(n²)). Discute pourquoi c\'est un problème et comment un quadtree aiderait.', en:'Simulate 10 moving objects in a 2D grid. Each frame, check all collision pairs (O(n²)). Discuss why this is a problem and how a quadtree would help.'},
    ],
    ide:[
      {diff:'medium', fr:'Implémente un Observer pattern avec des lambdas qui capturent par référence [&]. Teste qu\'une lambda qui capture une variable locale qui sort de scope provoque un dangling reference.', en:'Implement an Observer pattern with lambdas that capture by reference [&]. Test that a lambda capturing a local variable that goes out of scope causes a dangling reference.'},
    ],
    engine:[
      {diff:'hard', fr:'Dans Unreal, crée un Collectible Actor avec collision Overlap sur ECC_Pawn uniquement. Place-en 10 dans la scène. Vérifie que seul le Character les collecte, pas d\'autres objets.', en:'In Unreal, create a Collectible Actor with Overlap collision on ECC_Pawn only. Place 10 in the scene. Verify that only the Character collects them, not other objects.'},
    ],
  },
};
document.addEventListener('DOMContentLoaded',()=>{});
