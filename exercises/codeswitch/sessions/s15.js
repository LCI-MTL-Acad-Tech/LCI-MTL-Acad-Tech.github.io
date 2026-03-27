'use strict';
// Session 15 — Mini-Projet : Actor C++ Complet

const SESSION = {
  id:        's15',
  num:       15,
  prev:      14,
  next:      null,
  xp:        200,
  blocName:  { fr:'Consolidation', en:'Consolidation' },
  blocColor: '#9cf6d4',
  title:     { fr:'Mini-Projet : Actor C++ Complet', en:'Mini-Project: Complete C++ Actor' },
  sub:       { fr:'Un collectible fonctionnel de A à Z', en:'A functional collectible from A to Z' },

  tutor: {
    concept: {
      fr:`Cette session est une synthèse de tout le cours. On construit ensemble un Collectible Actor C++ complet : déclaration .h / .cpp, Components, UPROPERTY, UFUNCTION, overlap trigger, communication Blueprint, et débogage. Chaque concept utilisé renvoie à une session précédente — c'est intentionnel.`,
      en:`This session synthesizes the entire course. We build together a complete C++ Collectible Actor: .h / .cpp declaration, Components, UPROPERTY, UFUNCTION, overlap trigger, Blueprint communication, and debugging. Each concept used refers back to a previous session — that's intentional.`
    },
    demoSteps: [
      {
        label: { fr:'Étape 1 : Le header .h', en:'Step 1: The .h header' },
        fr:`Crée ACollectibleActor.h avec : #pragma once (S05), UCLASS() + GENERATED_BODY() (S07), un USphereComponent* pour la détection (S10), un UStaticMeshComponent* pour le visuel (S10), un float PointValue avec UPROPERTY(EditAnywhere) (S08), et la signature de OnOverlapBegin marquée UFUNCTION() (S08, S12). Montre que chaque élément vient d'une session spécifique.`,
        en:`Create ACollectibleActor.h with: #pragma once (S05), UCLASS() + GENERATED_BODY() (S07), a USphereComponent* for detection (S10), a UStaticMeshComponent* for visuals (S10), a float PointValue with UPROPERTY(EditAnywhere) (S08), and the OnOverlapBegin signature marked UFUNCTION() (S08, S12). Show each element comes from a specific session.`
      },
      {
        label: { fr:'Étape 2 : Le constructeur dans .cpp', en:'Step 2: The constructor in .cpp' },
        fr:`Dans ACollectibleActor.cpp, implémente le constructeur : CreateDefaultSubobject pour la SphereComponent et le StaticMeshComponent (S10), SetRootComponent, SetupAttachment. Configure la SphereComponent pour générer des overlaps : SetGenerateOverlapEvents(true), SetCollisionEnabled. Désactive le Tick dans le constructeur — un collectible statique n'en a pas besoin (S09).`,
        en:`In ACollectibleActor.cpp, implement the constructor: CreateDefaultSubobject for SphereComponent and StaticMeshComponent (S10), SetRootComponent, SetupAttachment. Configure the SphereComponent to generate overlaps: SetGenerateOverlapEvents(true), SetCollisionEnabled. Disable Tick in the constructor — a static collectible doesn't need it (S09).`
      },
      {
        label: { fr:'Étape 3 : BeginPlay et le delegate', en:'Step 3: BeginPlay and the delegate' },
        fr:`Dans BeginPlay() : Super::BeginPlay() en premier (S09, S10). Puis lier le delegate : SphereComponent->OnComponentBeginOverlap.AddDynamic(this, &ACollectibleActor::OnOverlapBegin) (S12). Ajoute un UE_LOG pour confirmer que BeginPlay a bien été appelé (S14).`,
        en:`In BeginPlay(): Super::BeginPlay() first (S09, S10). Then bind the delegate: SphereComponent->OnComponentBeginOverlap.AddDynamic(this, &ACollectibleActor::OnOverlapBegin) (S12). Add a UE_LOG to confirm BeginPlay was called (S14).`
      },
      {
        label: { fr:'Étape 4 : Overlap, BlueprintImplementableEvent, et Blueprint enfant', en:'Step 4: Overlap, BlueprintImplementableEvent, and child Blueprint' },
        fr:`Implémente OnOverlapBegin : vérifier le tag "Player" (S12), appeler OnPickedUp() (BlueprintImplementableEvent, S13), puis Destroy(). Crée un Blueprint enfant. Implémente Event OnPickedUp dans le Blueprint : Print String + Play Sound + Spawn Emitter. Place dans la scène, joue, ramasse. Montre le UE_LOG et le Blueprint event qui se déclenchent.`,
        en:`Implement OnOverlapBegin: check "Player" tag (S12), call OnPickedUp() (BlueprintImplementableEvent, S13), then Destroy(). Create a child Blueprint. Implement Event OnPickedUp in Blueprint: Print String + Play Sound + Spawn Emitter. Place in scene, play, collect. Show the UE_LOG and Blueprint event firing.`
      },
    ],
    discussion: [
      {
        fr:`En regardant le code final du Collectible, identifie les concepts de chaque session utilisée : types (S01), fonctions (S02), pointeurs (S04), headers (S05), GC/UPROPERTY (S06), AActor/UCLASS (S07), UPROPERTY/UFUNCTION (S08), BeginPlay/Super (S09), Components/CreateDefaultSubobject (S10), overlap delegate (S12), BlueprintImplementableEvent (S13), UE_LOG (S14).`,
        en:`Looking at the final Collectible code, identify the concepts from each session used: types (S01), functions (S02), pointers (S04), headers (S05), GC/UPROPERTY (S06), AActor/UCLASS (S07), UPROPERTY/UFUNCTION (S08), BeginPlay/Super (S09), Components/CreateDefaultSubobject (S10), overlap delegate (S12), BlueprintImplementableEvent (S13), UE_LOG (S14).`
      },
      {
        fr:`Qu'est-ce qui te semble encore flou ? Quels concepts voudrais-tu revoir avant de travailler sur ton propre projet ?`,
        en:`What still seems unclear? Which concepts would you like to revisit before working on your own project?`
      },
    ],
    deep: {
      fr:`<p><strong>Prochaines étapes après ce cours.</strong> Tu as maintenant les bases solides pour travailler en C++ Unreal. Les sujets naturels à explorer ensuite :</p>
<p><strong>Systèmes Unreal :</strong> GameMode / GameState / PlayerState (architecture de jeu), SaveGame (persistance), Subsystems (alternative moderne aux Singletons).</p>
<p><strong>Animation :</strong> AnimBlueprint depuis C++, AnimNotifies, AnimMontages.</p>
<p><strong>Réseau :</strong> Replication (Replicated, OnRep_), RPCs Server/Client/NetMulticast — tout passe par les macros que tu connais déjà.</p>
<p><strong>Performance :</strong> Unreal Insights, TRACE_CPUPROFILER_EVENT_SCOPE, optimisation des Actors statiques.</p>
<p>Chaque sujet s'appuie directement sur ce que tu as appris ici.</p>`,
      en:`<p><strong>Next steps after this course.</strong> You now have solid foundations for working in Unreal C++. Natural topics to explore next:</p>
<p><strong>Unreal Systems:</strong> GameMode / GameState / PlayerState (game architecture), SaveGame (persistence), Subsystems (modern alternative to Singletons).</p>
<p><strong>Animation:</strong> AnimBlueprint from C++, AnimNotifies, AnimMontages.</p>
<p><strong>Networking:</strong> Replication (Replicated, OnRep_), RPCs Server/Client/NetMulticast — all going through the macros you already know.</p>
<p><strong>Performance:</strong> Unreal Insights, TRACE_CPUPROFILER_EVENT_SCOPE, static Actor optimization.</p>
<p>Each topic builds directly on what you've learned here.</p>`
    }
  },

  compare: {
    cs:`<span class="cm">// Unity — Collectible</span>
<span class="kw">void</span> <span class="fn">OnTriggerEnter</span>(
    <span class="ty">Collider</span> c) {
    <span class="kw">if</span>(c.<span class="fn">CompareTag</span>(<span class="str">"Player"</span>)) {
        <span class="fn">OnPickedUp</span>();
        <span class="ty">Destroy</span>(gameObject);
    }
}
<span class="cm">// effets visuels dans la même classe</span>
<span class="kw">void</span> <span class="fn">OnPickedUp</span>() {
    <span class="ty">AudioSource</span>.<span class="fn">PlayClipAtPoint</span>(...);
    <span class="ty">Instantiate</span>(particlePrefab, ...);
}`,
    cpp:`<span class="cm">// Unreal — Collectible C++</span>
<span class="kw2">void</span> <span class="fn2">OnOverlapBegin</span>(...,
    <span class="ty">AActor</span>* Other, ...) {
    <span class="kw2">if</span>(Other-&gt;<span class="fn2">ActorHasTag</span>(<span class="str">"Player"</span>)) {
        <span class="fn2">OnPickedUp</span>(); <span class="cm">// BP impl.</span>
        <span class="fn2">Destroy</span>();
    }
}
<span class="cm">// effets visuels dans le Blueprint enfant</span>
<span class="mac">UFUNCTION</span>(BlueprintImplementableEvent)
<span class="kw2">void</span> <span class="fn2">OnPickedUp</span>();`
  },

  activities: [
    {
      id:'a15_1', type:'engine', xp:120,
      label:{ fr:'Dans Unreal — Projet final', en:'In Unreal — Final Project' },
      task:{
        fr:`Construis le Collectible C++ complet de mémoire, en utilisant les sessions précédentes comme référence si nécessaire :

1. ACollectibleActor.h : #pragma once, UCLASS, GENERATED_BODY, USphereComponent* (UPROPERTY), UStaticMeshComponent* (UPROPERTY), float PointValue (UPROPERTY EditAnywhere), void OnOverlapBegin(...) (UFUNCTION), void OnPickedUp() (UFUNCTION BlueprintImplementableEvent).

2. ACollectibleActor.cpp : constructeur avec CreateDefaultSubobject pour les deux Components, SetRootComponent, SetupAttachment, SetGenerateOverlapEvents(true), Tick désactivé. BeginPlay avec Super:: et AddDynamic pour lier OnOverlapBegin. Implémentation de OnOverlapBegin : tag check, appel OnPickedUp, UE_LOG, Destroy().

3. Blueprint enfant : implémente Event OnPickedUp avec au minimum Print String "Collecté !".

4. Place 3 instances dans la scène avec des PointValues différents. Joue et ramasse les trois.`,
        en:`Build the complete C++ Collectible from memory, using previous sessions as reference if needed:

1. ACollectibleActor.h: #pragma once, UCLASS, GENERATED_BODY, USphereComponent* (UPROPERTY), UStaticMeshComponent* (UPROPERTY), float PointValue (UPROPERTY EditAnywhere), void OnOverlapBegin(...) (UFUNCTION), void OnPickedUp() (UFUNCTION BlueprintImplementableEvent).

2. ACollectibleActor.cpp: constructor with CreateDefaultSubobject for both Components, SetRootComponent, SetupAttachment, SetGenerateOverlapEvents(true), Tick disabled. BeginPlay with Super:: and AddDynamic to bind OnOverlapBegin. OnOverlapBegin implementation: tag check, call OnPickedUp, UE_LOG, Destroy().

3. Child Blueprint: implement Event OnPickedUp with at minimum Print String "Collected!".

4. Place 3 instances in the scene with different PointValues. Play and collect all three.`
      },
      note:{
        fr:`Utilise les sessions précédentes comme référence : S05 pour la structure .h/.cpp, S07 pour UCLASS, S08 pour UPROPERTY/UFUNCTION, S09 pour BeginPlay, S10 pour CreateDefaultSubobject, S12 pour l'overlap, S13 pour BlueprintImplementableEvent, S14 pour UE_LOG.`,
        en:`Use previous sessions as reference: S05 for .h/.cpp structure, S07 for UCLASS, S08 for UPROPERTY/UFUNCTION, S09 for BeginPlay, S10 for CreateDefaultSubobject, S12 for overlap, S13 for BlueprintImplementableEvent, S14 for UE_LOG.`
      }
    },
    {
      id:'a15_2', type:'quiz', xp:30,
      q:{
        fr:`Dans le constructeur d'un Actor Unreal, quelle fonction crée un Component attaché au GC ?`,
        en:`In an Unreal Actor's constructor, which function creates a Component tracked by the GC?`
      },
      choices:[
        { t:'new UStaticMeshComponent()', c:false,
          fb:{ fr:`new alloue de la mémoire brute — le GC Unreal ne suivrait pas ce Component correctement.`, en:`new allocates raw memory — Unreal's GC would not track this Component correctly.` } },
        { t:'AddComponent<>()', c:false,
          fb:{ fr:`AddComponent existe pour le runtime dynamique, pas pour les Components définis dans le constructeur.`, en:`AddComponent exists for dynamic runtime use, not for Components defined in the constructor.` } },
        { t:'CreateDefaultSubobject<>(TEXT("Name"))', c:true,
          fb:{ fr:`Correct. CreateDefaultSubobject crée le Component dans le constructeur, l'enregistre auprès du GC, et le rend visible dans l'éditeur.`, en:`Correct. CreateDefaultSubobject creates the Component in the constructor, registers it with the GC, and makes it visible in the editor.` } },
        { t:'SpawnActor<>()', c:false,
          fb:{ fr:`SpawnActor crée un Actor complet dans le monde, pas un Component dans un Actor existant.`, en:`SpawnActor creates a full Actor in the world, not a Component inside an existing Actor.` } },
      ]
    },
    {
      id:'a15_3', type:'reflect', xp:30,
      prompt:{
        fr:`Tu as parcouru 15 sessions de C++ Unreal. Identifie trois choses : (1) le concept qui te semblait le plus intimidant avant et qui est maintenant clair, (2) le concept qui te semble encore le plus flou — sois honnête, c'est utile, (3) une mécanique de jeu spécifique que tu veux coder en C++ dans ton prochain projet.`,
        en:`You've completed 15 sessions of Unreal C++. Identify three things: (1) the concept that seemed most intimidating before and is now clear, (2) the concept that still seems most unclear — be honest, it's useful, (3) a specific game mechanic you want to code in C++ in your next project.`
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
