'use strict';
// Session 11 — Input & Mouvement

const SESSION = {
  id:        's11',
  num:       11,
  prev:      10,
  next:      12,
  xp:        130,
  blocName:  { fr:'Patterns de jeu', en:'Game Patterns' },
  blocColor: '#fe6c06',
  title:     { fr:'Input & Mouvement', en:'Input & Movement' },
  sub:       { fr:'Enhanced Input System vs Input Manager Unity', en:'Enhanced Input System vs Unity\'s Input Manager' },

  tutor: {
    concept: {
      fr:`Unity a l'Input Manager (ancien) et le nouveau Input System (package). Unreal 5 a l'Enhanced Input System. Les deux découplent les actions logiques (sauter, tirer) des touches physiques. La différence architecturale : Unreal lie les inputs au code C++ via des callbacks dans SetupPlayerInputComponent() — pas de polling dans Tick().`,
      en:`Unity has the Input Manager (old) and the new Input System (package). Unreal 5 has the Enhanced Input System. Both decouple logical actions (jump, shoot) from physical keys. The architectural difference: Unreal binds inputs to C++ code via callbacks in SetupPlayerInputComponent() — no polling in Tick().`
    },
    demoSteps: [
      {
        label: { fr:'Créer une Input Action dans l\'éditeur', en:'Create an Input Action in the editor' },
        fr:`Dans le Content Browser, crée une Input Action (clic droit > Input > Input Action). Appelle-la IA_Jump. Montre que c'est un asset — découplé du code. En Unity (nouveau Input System), c'est pareil : un InputActionAsset. L'idée clé : les touches physiques sont configurées dans des Input Mapping Contexts, séparément du code.`,
        en:`In the Content Browser, create an Input Action (right-click > Input > Input Action). Name it IA_Jump. Show it's an asset — decoupled from code. In Unity's new Input System, same thing: an InputActionAsset. Key idea: physical keys are configured in Input Mapping Contexts, separately from code.`
      },
      {
        label: { fr:'SetupPlayerInputComponent — lier les actions au code', en:'SetupPlayerInputComponent — binding actions to code' },
        fr:`Dans AMyCharacter::SetupPlayerInputComponent(), montre BindAction pour IA_Jump lié à une méthode OnJump. Compare avec += en Unity new Input System. Logique identique : "quand cette action se déclenche, appelle cette fonction". La signature du callback prend un FInputActionValue& qui contient la valeur de l'input (float, Vector2D, bool, etc.).`,
        en:`In AMyCharacter::SetupPlayerInputComponent(), show BindAction for IA_Jump bound to an OnJump method. Compare with += in Unity's new Input System. Identical logic: "when this action triggers, call this function". The callback signature takes an FInputActionValue& containing the input value (float, Vector2D, bool, etc.).`
      },
      {
        label: { fr:'AddMovementInput — le déplacement ACharacter', en:'AddMovementInput — ACharacter movement' },
        fr:`Montre AddMovementInput(GetActorForwardVector(), Value.Get<float>()). C'est l'équivalent de controller.Move() en Unity CharacterController. La CharacterMovementComponent d'Unreal gère la physique, la gravité, et les collisions automatiquement. Tu lui donnes juste une direction et une magnitude.`,
        en:`Show AddMovementInput(GetActorForwardVector(), Value.Get<float>()). It's the equivalent of controller.Move() in Unity's CharacterController. Unreal's CharacterMovementComponent handles physics, gravity, and collisions automatically. You just give it a direction and magnitude.`
      },
    ],
    discussion: [
      {
        fr:`En Unity, tu avais probablement Input.GetAxis("Horizontal") dans Update(). En Unreal, les inputs ne sont pas lus dans Tick() — ils déclenchent des callbacks. Quelle approche te semble plus propre architecturalement ? Pourquoi ?`,
        en:`In Unity you probably had Input.GetAxis("Horizontal") in Update(). In Unreal, inputs aren't read in Tick() — they trigger callbacks. Which approach seems architecturally cleaner to you? Why?`
      },
    ],
    deep: {
      fr:`<p><strong>Input Modifiers et Triggers.</strong> L'Enhanced Input System permet d'ajouter des Modifiers (inverser un axe, normaliser un vecteur, dead zone) et des Triggers (seulement après un délai, sur hold, sur double-tap, sur release) directement sur les assets d'Input Action ou de Mapping Context — sans modifier le code C++.</p>
<p>C'est très puissant pour des contrôles complexes : un même axe peut se comporter différemment selon le contexte (nager vs marcher) en changeant simplement le Mapping Context actif avec <code>UEnhancedInputLocalPlayerSubsystem</code>. Aucun if dans le code de gameplay.</p>`,
      en:`<p><strong>Input Modifiers and Triggers.</strong> The Enhanced Input System allows adding Modifiers (invert axis, normalize vector, dead zone) and Triggers (only after a delay, on hold, on double-tap, on release) directly on Input Action or Mapping Context assets — without modifying C++ code.</p>
<p>Very powerful for complex controls: the same axis can behave differently depending on context (swimming vs walking) by simply switching the active Mapping Context with <code>UEnhancedInputLocalPlayerSubsystem</code>. No if statements in gameplay code.</p>`
    }
  },

  compare: {
    cs:`<span class="cm">// Unity new Input System</span>
<span class="kw">void</span> <span class="fn">OnEnable</span>() {
    actions.Jump.performed
        += <span class="fn">OnJump</span>;
}
<span class="kw">void</span> <span class="fn">OnJump</span>(
    <span class="ty">InputAction.CallbackContext</span> ctx)
{ <span class="fn">Jump</span>(); }`,
    cpp:`<span class="cm">// Unreal Enhanced Input</span>
<span class="kw2">void</span> <span class="fn2">SetupPlayerInputComponent</span>(
    <span class="ty">UInputComponent</span>* Input) {
    <span class="fn2">BindAction</span>(IA_Jump,
        ETriggerEvent::Triggered,
        <span class="kw2">this</span>, &amp;<span class="ty">AMyChar</span>::<span class="fn2">OnJump</span>);
}
<span class="kw2">void</span> <span class="fn2">OnJump</span>(
    <span class="kw2">const</span> <span class="ty">FInputActionValue</span>&amp; V)
{ <span class="fn2">Jump</span>(); }`
  },

  activities: [
    {
      id:'a11_1', type:'quiz', xp:15,
      q:{
        fr:`Quelle méthode Unreal faut-il surcharger pour lier des Input Actions à des fonctions C++ ?`,
        en:`Which Unreal method must you override to bind Input Actions to C++ functions?`
      },
      choices:[
        { t:'BeginPlay()', c:false,
          fb:{ fr:`BeginPlay est pour l'initialisation générale — lier les inputs là est possible mais n'est pas la bonne pratique.`, en:`BeginPlay is for general initialization — binding inputs there is possible but not best practice.` } },
        { t:'SetupPlayerInputComponent(UInputComponent*)', c:true,
          fb:{ fr:`Correct. SetupPlayerInputComponent est appelé automatiquement par Unreal pour configurer les inputs d'un Pawn ou Character.`, en:`Correct. SetupPlayerInputComponent is automatically called by Unreal to configure inputs for a Pawn or Character.` } },
        { t:'Tick(float DeltaTime)', c:false,
          fb:{ fr:`Tick est pour la logique frame-par-frame — lire les inputs dans Tick est l'ancienne approche, pas l'Enhanced Input System.`, en:`Tick is for per-frame logic — reading inputs in Tick is the old approach, not the Enhanced Input System.` } },
        { t:'PostInitializeComponents()', c:false,
          fb:{ fr:`PostInitializeComponents est appelé après l'initialisation des components — pas spécifiquement pour les inputs.`, en:`PostInitializeComponents is called after component initialization — not specifically for inputs.` } },
      ]
    },
    {
      id:'a11_2', type:'fill', xp:20,
      instr:{
        fr:`Pour déplacer un ACharacter Unreal dans la direction forward, complète cet appel :`,
        en:`To move an Unreal ACharacter in the forward direction, complete this call:`
      },
      template:{ fr:'______(GetActorForwardVector(), MoveValue);', en:'______(GetActorForwardVector(), MoveValue);' },
      answer:'AddMovementInput',
      hint:{ fr:'La fonction qui ajoute un vecteur de déplacement au CharacterMovementComponent', en:'The function that adds a movement vector to the CharacterMovementComponent' }
    },
    {
      id:'a11_3', type:'engine', xp:50,
      label:{ fr:'Dans Unreal', en:'In Unreal' },
      task:{
        fr:`Dans le Third Person Template Unreal, ouvre AThirdPersonCharacter.cpp. 1. Trouve SetupPlayerInputComponent() et identifie toutes les BindAction. 2. Suis les liens vers les méthodes callback (Move, Look, Jump). 3. Identifie comment AddMovementInput est utilisé dans Move(). 4. Dans l'éditeur, ouvre un Input Mapping Context et change la touche assignée à l'une des actions. Joue et vérifie que le changement fonctionne sans modifier le C++.`,
        en:`In the Unreal Third Person Template, open AThirdPersonCharacter.cpp. 1. Find SetupPlayerInputComponent() and identify all BindAction calls. 2. Follow the links to the callback methods (Move, Look, Jump). 3. Identify how AddMovementInput is used in Move(). 4. In the editor, open an Input Mapping Context and change the key assigned to one action. Play and verify the change works without modifying C++.`
      },
      note:{
        fr:`Observer l'architecture : le code C++ ne connaît pas les touches physiques — seulement les actions logiques.`,
        en:`Observe the architecture: the C++ code doesn't know the physical keys — only the logical actions.`
      }
    },
    {
      id:'a11_4', type:'reflect', xp:10,
      prompt:{
        fr:`Le découplage input (touches physiques) / actions (logique de jeu) permet de changer les contrôles sans toucher au code. Dans tes projets Unity passés, avais-tu ce découplage ? Si tu refaisais un projet, comment intégrerais-tu ce principe dès le départ ?`,
        en:`Decoupling inputs (physical keys) / actions (game logic) lets you change controls without touching code. Did your past Unity projects have this decoupling? If you were redoing a project, how would you integrate this principle from the start?`
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
