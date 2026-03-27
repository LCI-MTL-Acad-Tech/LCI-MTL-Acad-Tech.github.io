'use strict';
// Session 13 — Blueprint ↔ C++

const SESSION = {
  id:        's13',
  num:       13,
  prev:      12,
  next:      14,
  xp:        130,
  blocName:  { fr:'Patterns de jeu', en:'Game Patterns' },
  blocColor: '#fe6c06',
  title:     { fr:'Blueprint ↔ C++', en:'Blueprint ↔ C++' },
  sub:       { fr:'Quand utiliser quoi — et comment les faire coexister', en:'When to use which — and how to make them coexist' },

  tutor: {
    concept: {
      fr:`Blueprint et C++ ne sont pas concurrents — ils sont complémentaires. La règle pratique de l'industrie : le C++ définit les systèmes et la performance critique, les Blueprints gèrent le contenu, le prototypage rapide, et la logique accessible aux designers. Cette session montre comment les deux communiquent et comment décider ce qui va où.`,
      en:`Blueprint and C++ are not competitors — they're complementary. The industry practical rule: C++ defines systems and performance-critical code, Blueprints handle content, rapid prototyping, and logic accessible to designers. This session shows how the two communicate and how to decide what goes where.`
    },
    demoSteps: [
      {
        label: { fr:'Créer un Blueprint depuis une classe C++', en:'Creating a Blueprint from a C++ class' },
        fr:`Montre comment créer un Blueprint enfant d'un Actor C++ : clic droit sur la classe C++ dans le Content Browser > Create Blueprint class based on… Le Blueprint hérite de tout le C++ et peut surcharger des méthodes ou ajouter de la logique visuelle. C'est l'équivalent de créer un prefab Unity basé sur un script.`,
        en:`Show how to create a Blueprint child of a C++ Actor: right-click the C++ class in Content Browser > Create Blueprint class based on… The Blueprint inherits all C++ and can override methods or add visual logic. It's the equivalent of creating a Unity prefab based on a script.`
      },
      {
        label: { fr:'Exposer du C++ aux Blueprints', en:'Exposing C++ to Blueprints' },
        fr:`Montre UPROPERTY(BlueprintReadWrite) et UFUNCTION(BlueprintCallable). Ces marqueurs permettent aux Blueprints de lire/modifier les données C++ et d'appeler des méthodes C++. Crée une variable Speed avec BlueprintReadWrite et montre qu'elle apparaît dans le graph Blueprint. C'est l'API que tu offres à tes designers.`,
        en:`Show UPROPERTY(BlueprintReadWrite) and UFUNCTION(BlueprintCallable). These markers allow Blueprints to read/modify C++ data and call C++ methods. Create a Speed variable with BlueprintReadWrite and show it appears in the Blueprint graph. It's the API you're offering your designers.`
      },
      {
        label: { fr:'BlueprintImplementableEvent — C++ appelle du Blueprint', en:'BlueprintImplementableEvent — C++ calling Blueprint' },
        fr:`UFUNCTION(BlueprintImplementableEvent) déclare une fonction dans le .h C++, mais son implémentation est entièrement dans le Blueprint. Tu l'appelles depuis C++ comme une fonction normale — le Blueprint fournit ce qui se passe. Exemple : OnPickedUp() — le C++ détecte le pickup, le Blueprint joue le son et la particule.`,
        en:`UFUNCTION(BlueprintImplementableEvent) declares a function in the C++ .h, but its implementation is entirely in the Blueprint. You call it from C++ like a normal function — the Blueprint provides what happens. Example: OnPickedUp() — C++ detects the pickup, Blueprint plays the sound and particle.`
      },
      {
        label: { fr:'BlueprintNativeEvent — C++ avec fallback', en:'BlueprintNativeEvent — C++ with fallback' },
        fr:`BlueprintNativeEvent = définie ET implémentée en C++ (comme fallback), mais surchargeable en Blueprint. La méthode C++ s'appelle NomFonction_Implementation(). Exemple classique : OnDeath() — comportement par défaut en C++, mais le designer peut personnaliser l'effet visuel dans le Blueprint sans toucher au code.`,
        en:`BlueprintNativeEvent = declared AND implemented in C++ (as fallback), but overridable in Blueprint. The C++ method is called FunctionName_Implementation(). Classic example: OnDeath() — default behavior in C++, but the designer can customize the visual effect in Blueprint without touching code.`
      },
    ],
    discussion: [
      {
        fr:`Dans une équipe avec des programmeurs C++ et des game designers (Blueprints), quelle frontière tracerais-tu entre ce qui doit être en C++ et ce qui peut être en Blueprint ?`,
        en:`In a team with C++ programmers and game designers (Blueprints), what boundary would you draw between what must be in C++ and what can be in Blueprint?`
      },
    ],
    deep: {
      fr:`<p><strong>Performance : quand le C++ est obligatoire.</strong> Les Blueprints ont un overhead d'interprétation — environ 10× plus lents que le C++ pour des opérations équivalentes. La règle empirique : si quelque chose tourne dans Tick() sur plus de 10–20 objets simultanément, C++ est nécessaire.</p>
<p>Les outils de profilage d'Unreal (commande <code>stat game</code> en jeu, Unreal Insights) montrent exactement où va le temps CPU. Ne pas optimiser à l'aveugle — profiler d'abord, puis décider si le Blueprint doit être porté en C++. La plupart de la logique de gameplay peut rester en Blueprint sans problème de performance.</p>`,
      en:`<p><strong>Performance: when C++ is mandatory.</strong> Blueprints have an interpretation overhead — roughly 10× slower than C++ for equivalent operations. Rule of thumb: if something runs in Tick() on more than 10–20 objects simultaneously, C++ is necessary.</p>
<p>Unreal's profiling tools (in-game command <code>stat game</code>, Unreal Insights) show exactly where CPU time goes. Don't optimize blindly — profile first, then decide if a Blueprint needs to be ported to C++. Most gameplay logic can stay in Blueprint without performance issues.</p>`
    }
  },

  compare: {
    cs:`<span class="cm">// Unity — tout en C#</span>
<span class="cm">// pas de séparation native</span>
<span class="cm">// code / visual script</span>
[<span class="ty">SerializeField</span>]
<span class="kw">private float</span> speed;
<span class="cm">// Bolt/Visual Scripting
// accède via réflexion</span>`,
    cpp:`<span class="cm">// Unreal — C++ expose aux BP</span>
<span class="mac">UPROPERTY</span>(BlueprintReadWrite,
    EditAnywhere)
<span class="kw2">float</span> Speed;

<span class="mac">UFUNCTION</span>(BlueprintCallable)
<span class="kw2">void</span> <span class="fn2">Jump</span>();

<span class="mac">UFUNCTION</span>(BlueprintImplementableEvent)
<span class="kw2">void</span> <span class="fn2">OnPickedUp</span>(); <span class="cm">// impl. en BP</span>`
  },

  activities: [
    {
      id:'a13_1', type:'quiz', xp:15,
      q:{
        fr:`Quelle macro UFUNCTION() permet à une méthode d'avoir une implémentation par défaut en C++ tout en pouvant être surchargée dans un Blueprint ?`,
        en:`Which UFUNCTION() macro allows a method to have a default C++ implementation while being overridable in a Blueprint?`
      },
      choices:[
        { t:'BlueprintCallable', c:false,
          fb:{ fr:`BlueprintCallable rend la fonction appelable depuis un Blueprint, mais n'implique pas de surcharge possible.`, en:`BlueprintCallable makes the function callable from a Blueprint, but doesn't imply overriding.` } },
        { t:'BlueprintImplementableEvent', c:false,
          fb:{ fr:`BlueprintImplementableEvent n'a PAS d'implémentation C++ — elle doit être implémentée entièrement dans un Blueprint.`, en:`BlueprintImplementableEvent has NO C++ implementation — it must be implemented entirely in a Blueprint.` } },
        { t:'BlueprintNativeEvent', c:true,
          fb:{ fr:`Correct. BlueprintNativeEvent a une implémentation C++ (_Implementation) utilisée par défaut si le Blueprint ne surcharge pas la fonction.`, en:`Correct. BlueprintNativeEvent has a C++ implementation (_Implementation) used by default if the Blueprint doesn't override the function.` } },
        { t:'BlueprintPure', c:false,
          fb:{ fr:`BlueprintPure rend la fonction accessible en Blueprint sans exécution (nœud sans exec pin) — pas lié à la surcharge.`, en:`BlueprintPure makes the function accessible in Blueprint without execution (node without exec pin) — not related to overriding.` } },
      ]
    },
    {
      id:'a13_2', type:'fill', xp:20,
      instr:{
        fr:`Pour déclarer une méthode C++ qui peut être complètement remplacée par l'implémentation d'un Blueprint (sans fallback C++) :`,
        en:`To declare a C++ method that can be completely replaced by a Blueprint implementation (no C++ fallback):`
      },
      template:{ fr:'UFUNCTION(______)\nvoid OnDeath();', en:'UFUNCTION(______)\nvoid OnDeath();' },
      answer:'BlueprintImplementableEvent',
      hint:{ fr:'La méthode est déclarée en C++ mais implémentée uniquement dans le Blueprint', en:'The method is declared in C++ but implemented only in the Blueprint' }
    },
    {
      id:'a13_3', type:'engine', xp:55,
      label:{ fr:'Dans Unreal', en:'In Unreal' },
      task:{
        fr:`1. Prends l'Actor C++ avec UPROPERTY créé en S08. 2. Crée un Blueprint enfant de cet Actor. 3. Ajoute une UFUNCTION(BlueprintImplementableEvent) void OnActivated() au C++. 4. Dans le Blueprint graph, implémente Event OnActivated : Print String "Activé !". 5. Ajoute une UFUNCTION(BlueprintCallable) void Activate() qui appelle OnActivated() depuis le C++. 6. Dans le Blueprint, connecte Event BeginPlay → Activate. 7. Joue et vérifie que "Activé !" s'affiche.`,
        en:`1. Take the C++ Actor with UPROPERTY created in S08. 2. Create a Blueprint child of that Actor. 3. Add UFUNCTION(BlueprintImplementableEvent) void OnActivated() to the C++. 4. In the Blueprint graph, implement Event OnActivated: Print String "Activated!". 5. Add UFUNCTION(BlueprintCallable) void Activate() that calls OnActivated() from C++. 6. In the Blueprint, connect Event BeginPlay → Activate. 7. Play and verify "Activated!" displays.`
      },
      note:{
        fr:`C'est la chaîne complète C++ → Blueprint en action : C++ appelle un event, Blueprint l'implémente.`,
        en:`This is the complete C++ → Blueprint chain in action: C++ calls an event, Blueprint implements it.`
      }
    },
    {
      id:'a13_4', type:'reflect', xp:10,
      prompt:{
        fr:`Tu as maintenant les outils pour décider quoi mettre en C++ et quoi laisser en Blueprint. Pour une mécanique de combat simple (attaque, dégâts, mort), décris en quelques lignes comment tu organiserais cette séparation dans un projet en équipe avec un game designer.`,
        en:`You now have the tools to decide what goes in C++ and what stays in Blueprint. For a simple combat mechanic (attack, damage, death), describe in a few lines how you'd organize this separation in a team project with a game designer.`
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
