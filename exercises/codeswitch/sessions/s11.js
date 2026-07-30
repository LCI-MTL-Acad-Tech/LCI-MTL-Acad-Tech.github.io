'use strict';
// Session 11 — Input & Mouvement
// IDE arc S11: inheritance + virtual — base Entity class, derived Mover, pure virtual interface

const SESSION = {
  id:'s11', num:11, prev:10, next:12, xp:130,
  blocName:{ fr:'Patterns de jeu', en:'Game Patterns' },
  blocColor:'#fe6c06',
  title:{ fr:'Input & Mouvement', en:'Input & Movement' },
  sub:{ fr:'Enhanced Input System — et déplacer un Actor en C++', en:'Enhanced Input System — and moving an Actor in C++' },

  tutor:{
    concept:{
      fr:`L'Enhanced Input System (EIS) d'Unreal remplace le système de mapping legacy. Il sépare l'intention (InputAction : "Jump") de la touche (InputMappingContext : "Barre espace → Jump"). En C++, les actions sont liées via BindAction() dans SetupPlayerInputComponent(). Le mouvement physique passe par AddMovementInput() pour les Pawns, ou SetActorLocation()/AddActorWorldOffset() pour les Actors simples.`,
      en:`Unreal's Enhanced Input System (EIS) replaces the legacy mapping system. It separates intent (InputAction: "Jump") from key (InputMappingContext: "Space bar → Jump"). In C++, actions are bound via BindAction() in SetupPlayerInputComponent(). Physical movement goes through AddMovementInput() for Pawns, or SetActorLocation()/AddActorWorldOffset() for simple Actors.`
    },
    deep:{
      fr:`<p><strong>InputMappingContext par situation.</strong> L'EIS permet d'empiler plusieurs IMC avec des priorités. Exemple : un IMC "On Foot" et un IMC "Driving" — quand le joueur entre dans un véhicule, l'IMC Driving est ajouté avec une priorité supérieure. Les touches communes (ex. regarder avec la souris) restent actives via l'IMC de base.</p>
<p>En C++ : <code>APlayerController::AddMappingContext(IMC, Priority)</code>. Plus flexible que l'ancien système de axes/boutons, et entièrement data-driven : les designers peuvent reconfigurer les touches dans l'éditeur sans toucher le code.</p>`,
      en:`<p><strong>InputMappingContext by situation.</strong> EIS allows stacking multiple IMCs with priorities. Example: an "On Foot" IMC and a "Driving" IMC — when the player enters a vehicle, the Driving IMC is added with higher priority. Common inputs (e.g. mouse look) remain active via the base IMC.</p>
<p>In C++: <code>APlayerController::AddMappingContext(IMC, Priority)</code>. More flexible than the old axis/button system, and fully data-driven: designers can remap keys in the editor without touching code.</p>`
    }
  },

  ide:{
    demoSteps:[
      {
        label:{ fr:'Vecteur 2D — position et déplacement', en:'2D vector — position and displacement' },
        fr:`Crée vec2.h. Définit struct Vec2 { float x, y; Vec2(float x=0, float y=0): x(x), y(y){} Vec2 operator+(const Vec2& o) const { return {x+o.x, y+o.y}; } Vec2 operator*(float s) const { return {x*s, y*s}; } float length() const { return std::sqrt(x*x+y*y); } };. Dans main.cpp : Vec2 pos(0,0); Vec2 vel(3,-1); pos = pos + vel; std::cout << pos.x << " " << pos.y;. Résultat : 3 -1. C'est exactement ce que AddMovementInput fait sous le capot — additionner un vecteur direction à une position.`,
        en:`Create vec2.h. Define struct Vec2 { float x, y; Vec2(float x=0, float y=0): x(x), y(y){} Vec2 operator+(const Vec2& o) const { return {x+o.x, y+o.y}; } Vec2 operator*(float s) const { return {x*s, y*s}; } float length() const { return std::sqrt(x*x+y*y); } };. In main.cpp: Vec2 pos(0,0); Vec2 vel(3,-1); pos = pos + vel; std::cout << pos.x << " " << pos.y;. Result: 3 -1. This is exactly what AddMovementInput does under the hood — adding a direction vector to a position.`
      },
      {
        label:{ fr:'Delta time — mouvement indépendant du framerate', en:'Delta time — frame-rate independent movement' },
        fr:`Simule une boucle de jeu. float dt = 0.016f; // ~60fps. Vec2 pos(0,0); Vec2 vel(100, 0); // 100 unités/seconde. for(int i=0; i<5; i++) { pos = pos + vel * dt; std::cout << pos.x << "\n"; }. Résultat : 1.6, 3.2, 4.8, 6.4, 8.0. Change dt à 0.033f (30fps) — même distance couverte par frame : 3.3, 6.6... mais la distance par seconde reste 100. Sans dt : pos = pos + vel donne 500 en 5 frames peu importe le framerate — le jeu est deux fois plus rapide à 120fps.`,
        en:`Simulate a game loop. float dt = 0.016f; // ~60fps. Vec2 pos(0,0); Vec2 vel(100, 0); // 100 units/second. for(int i=0; i<5; i++) { pos = pos + vel * dt; std::cout << pos.x << "\n"; }. Result: 1.6, 3.2, 4.8, 6.4, 8.0. Change dt to 0.033f (30fps) — same distance per second: 3.3, 6.6... but distance per second stays 100. Without dt: pos = pos + vel gives 500 in 5 frames regardless of framerate — the game runs twice as fast at 120fps.`
      },
      {
        label:{ fr:'Normalisation — direction sans magnitude', en:'Normalisation — direction without magnitude' },
        fr:`Vec2 input(1, 1); // diagonale. float len = input.length(); // 1.414... if(len > 0) input = input * (1.0f / len); // normalize. std::cout << input.length(); // ~1.0. Sans normalisation, se déplacer en diagonale est 41% plus rapide qu'en ligne droite — bug classique. Teste avec (3, 4) → length 5 → normalisé (0.6, 0.8) → length 1. En Unreal, GetActorForwardVector() retourne déjà un vecteur normalisé — c'est pourquoi tu peux le passer directement à AddMovementInput.`,
        en:`Vec2 input(1, 1); // diagonal. float len = input.length(); // 1.414... if(len > 0) input = input * (1.0f / len); // normalize. std::cout << input.length(); // ~1.0. Without normalisation, moving diagonally is 41% faster than in a straight line — classic bug. Test with (3, 4) → length 5 → normalised (0.6, 0.8) → length 1. In Unreal, GetActorForwardVector() already returns a normalised vector — that's why you can pass it directly to AddMovementInput.`
      },
      {
        label:{ fr:'FMath::Clamp — borner la vitesse et la position', en:'FMath::Clamp — bounding speed and position' },
        fr:`float speed = 250.0f; float maxSpeed = 200.0f; float clamped = std::max(-maxSpeed, std::min(maxSpeed, speed)); // 200.0. En Unreal : FMath::Clamp(speed, -MaxSpeed, MaxSpeed). Applique sur la position : float posX = -50.0f; posX = std::max(0.0f, std::min(800.0f, posX)); // 0 — resté dans les bords. C'est la base de tout système de contrainte de mouvement : zones interdites, vitesse plafonnée, inertie limitée.`,
        en:`float speed = 250.0f; float maxSpeed = 200.0f; float clamped = std::max(-maxSpeed, std::min(maxSpeed, speed)); // 200.0. In Unreal: FMath::Clamp(speed, -MaxSpeed, MaxSpeed). Apply to position: float posX = -50.0f; posX = std::max(0.0f, std::min(800.0f, posX)); // 0 — stays within bounds. This is the basis of every movement constraint system: forbidden zones, capped speed, limited inertia.`
      },
    ],
    discussion:[
      { fr:`Si tu multiples une direction par delta time mais que tu oublies de normaliser la direction d'abord, qu'est-ce qui se passe concrètement dans le jeu quand le joueur appuie simultanément sur deux touches ?`, en:`If you multiply a direction by delta time but forget to normalise the direction first, what concretely happens in the game when the player presses two keys simultaneously?` },
    ],
    compare:{
      std:`<span class="cm">// C++ — mouvement manuel avec dt</span>
<span class="kw2">struct</span> <span class="ty">Vec2</span> { <span class="kw2">float</span> x, y; };
<span class="ty">Vec2</span> pos{<span class="num">0</span>,<span class="num">0</span>}, vel{<span class="num">100</span>,<span class="num">0</span>};
<span class="kw2">float</span> dt = <span class="num">0.016f</span>;
pos.x += vel.x * dt;   <span class="cm">// 1.6 par frame</span>
pos.y += vel.y * dt;
<span class="cm">// normaliser la direction :</span>
<span class="kw2">float</span> len = std::sqrt(
    vel.x*vel.x + vel.y*vel.y);
<span class="kw2">if</span>(len > <span class="num">0</span>) {
    vel.x /= len; vel.y /= len;
}`,
      unreal:`<span class="cm">// Unreal — même logique, APIs intégrées</span>
<span class="kw2">void</span> <span class="fn2">Move</span>(
    <span class="kw2">const</span> <span class="ty">FInputActionValue</span>&amp; Val)
{
    <span class="ty">FVector2D</span> In =
        Val.<span class="fn2">Get</span>&lt;<span class="ty">FVector2D</span>&gt;();
    <span class="cm">// GetActorForwardVector() est déjà</span>
    <span class="cm">// normalisé — pas besoin de diviser</span>
    <span class="fn2">AddMovementInput</span>(
        <span class="fn2">GetActorForwardVector</span>(), In.Y);
    <span class="fn2">AddMovementInput</span>(
        <span class="fn2">GetActorRightVector</span>(), In.X);
    <span class="cm">// DeltaTime géré par CharacterMovement</span>
}`
    },
    activities:[
      {
        id:'i11_1', type:'predict', xp:15,
        code:`<span class="kw2">struct</span> <span class="ty">Vec2</span> {
    <span class="kw2">float</span> x, y;
    <span class="ty">Vec2</span> <span class="kw2">operator</span>*(<span class="kw2">float</span> s) <span class="kw2">const</span> { <span class="kw2">return</span> {x*s, y*s}; }
};
<span class="ty">Vec2</span> dir{<span class="num">1</span>, <span class="num">1</span>};
<span class="kw2">float</span> speed = <span class="num">100.0f</span>, dt = <span class="num">0.016f</span>;
<span class="ty">Vec2</span> vel = dir * speed * dt;
std::cout &lt;&lt; vel.x &lt;&lt; <span class="str">" "</span> &lt;&lt; vel.y;`,
        question:{ fr:`Quelle est la sortie ? Y a-t-il un problème avec ce code de mouvement ?`, en:`What is the output? Is there a problem with this movement code?` },
        explanation:{ fr:`Sortie : 1.6 1.6. Oui — dir (1,1) n'est pas normalisé. Sa longueur est sqrt(2) ≈ 1.414, donc le personnage se déplace à 141 unités/s en diagonale au lieu de 100. Il faut normaliser dir avant de multiplier. Normalisé : (0.707, 0.707) → vel = (1.131, 1.131) → vitesse réelle = 100.`, en:`Output: 1.6 1.6. Yes — dir (1,1) is not normalised. Its length is sqrt(2) ≈ 1.414, so the character moves at 141 units/s diagonally instead of 100. dir must be normalised before multiplying. Normalised: (0.707, 0.707) → vel = (1.131, 1.131) → actual speed = 100.` }
      },
      {
        id:'i11_2', type:'cpp', xp:35,
        instr:{ fr:`Complète cette fonction move() qui déplace une position par une vélocité × deltaTime, en clampant le résultat entre -500 et 500 sur chaque axe. Teste avec pos=(490,0), vel=(100,0), dt=0.016f.`, en:`Complete this move() function that moves a position by velocity × deltaTime, clamping the result between -500 and 500 on each axis. Test with pos=(490,0), vel=(100,0), dt=0.016f.` },
        stub:`<span class="kw2">#include</span> <span class="str">&lt;algorithm&gt;</span>
<span class="kw2">struct</span> <span class="ty">Vec2</span> { <span class="kw2">float</span> x, y; };
<span class="ty">Vec2</span> <span class="fn2">move</span>(<span class="ty">Vec2</span> pos, <span class="ty">Vec2</span> vel, <span class="kw2">float</span> dt) {
    <span class="cm">// 1. applique la vélocité × dt</span>
    <span class="cm">// 2. clamp x et y entre -500 et 500</span>
    <span class="cm">// 3. retourne la position mise à jour</span>
}`,
        hint:{ fr:`std::max(-500.0f, std::min(500.0f, val)) pour clamper. Avec pos.x=490, vel.x=100, dt=0.016 → 490 + 1.6 = 491.6 → pas encore clampé. Essaie dt=0.5f pour voir le clamp.`, en:`std::max(-500.0f, std::min(500.0f, val)) to clamp. With pos.x=490, vel.x=100, dt=0.016 → 490 + 1.6 = 491.6 → not clamped yet. Try dt=0.5f to see the clamp.` }
      },
      {
        id:'i11_3', type:'bug', xp:20,
        instr:{ fr:`Ce code de mouvement produit un bug classique. Identifie-le.`, en:`This movement code produces a classic bug. Identify it.` },
        bugCode:`<span class="kw2">struct</span> <span class="ty">Vec2</span> {
    <span class="kw2">float</span> x, y;
    <span class="kw2">float</span> <span class="fn2">length</span>() <span class="kw2">const</span> {
        <span class="kw2">return</span> std::sqrt(x*x + y*y);
    }
};
<span class="ty">Vec2</span> input = getPlayerInput(); <span class="cm">// ex : {1,1}</span>
<span class="kw2">float</span> speed = <span class="num">200.0f</span>;
<span class="cm">// Applique la vitesse</span>
<span class="ty">Vec2</span> vel = { <span class="bug-line">input.x * speed, input.y * speed</span> };`,
        explanation:{ fr:`input n'est pas normalisé avant d'être multiplié par speed. Si le joueur appuie sur W et D simultanément, input = (1,1), length ≈ 1.414 → vitesse diagonale ≈ 283 au lieu de 200. Correction : normaliser input d'abord. float len = input.length(); if(len > 0.001f) { input.x /= len; input.y /= len; } puis multiplier par speed.`, en:`input is not normalised before multiplying by speed. If the player presses W and D simultaneously, input = (1,1), length ≈ 1.414 → diagonal speed ≈ 283 instead of 200. Fix: normalise input first. float len = input.length(); if(len > 0.001f) { input.x /= len; input.y /= len; } then multiply by speed.` }
      },
      {
        id:'i11_4', type:'fill', xp:15,
        instr:{ fr:`Complète la formule de mouvement indépendant du framerate :`, en:`Complete the frame-rate independent movement formula:` },
        template:{ fr:'position = position + velocity * ______;', en:'position = position + velocity * ______;' },
        answer:'deltaTime',
        hint:{ fr:`La variable qui représente le temps écoulé depuis la dernière frame, en secondes.`, en:`The variable representing time elapsed since the last frame, in seconds.` }
      },
    ],
  },
  engine:{
    demoSteps:[
      {
        label:{ fr:'Crée un InputAction et un InputMappingContext', en:'Create an InputAction and InputMappingContext' },
        fr:`Dans l'éditeur Unreal : Content Browser → clic droit → Input → Input Action. Nomme-le IA_Move. Type : Axis2D (pour X/Y). Crée aussi un IMC_Default (Input Mapping Context). Ouvre l'IMC et ajoute IA_Move avec WASD et les touches directionnelles. En C# Unity, c'est l'équivalent de "Horizontal" et "Vertical" dans le Input Manager — mais ici tout est data-driven.`,
        en:`In the Unreal editor: Content Browser → right-click → Input → Input Action. Name it IA_Move. Type: Axis2D (for X/Y). Also create an IMC_Default (Input Mapping Context). Open the IMC and add IA_Move with WASD and arrow keys. In Unity C#, this is the equivalent of "Horizontal" and "Vertical" in the Input Manager — but here everything is data-driven.`
      },
      {
        label:{ fr:'Lie l\'action dans SetupPlayerInputComponent()', en:'Bind the action in SetupPlayerInputComponent()' },
        fr:`Dans le .h du Character, ajoute : UPROPERTY(EditAnywhere) UInputMappingContext* IMC_Default; UPROPERTY(EditAnywhere) UInputAction* IA_Move; void Move(const FInputActionValue& Value);. Dans le .cpp : #include "EnhancedInputComponent.h" et dans SetupPlayerInputComponent() : Cast<UEnhancedInputComponent>(PlayerInputComponent)->BindAction(IA_Move, ETriggerEvent::Triggered, this, &AMyChar::Move);`,
        en:`In the Character's .h, add: UPROPERTY(EditAnywhere) UInputMappingContext* IMC_Default; UPROPERTY(EditAnywhere) UInputAction* IA_Move; void Move(const FInputActionValue& Value);. In the .cpp: #include "EnhancedInputComponent.h" and in SetupPlayerInputComponent(): Cast<UEnhancedInputComponent>(PlayerInputComponent)->BindAction(IA_Move, ETriggerEvent::Triggered, this, &AMyChar::Move);`
      },
      {
        label:{ fr:'Implémente Move() avec AddMovementInput()', en:'Implement Move() with AddMovementInput()' },
        fr:`void AMyChar::Move(const FInputActionValue& Value) { FVector2D Input = Value.Get<FVector2D>(); if(Controller) { const FRotator Rot = Controller->GetControlRotation(); AddMovementInput(FRotationMatrix(Rot).GetUnitAxis(EAxis::X), Input.Y); AddMovementInput(FRotationMatrix(Rot).GetUnitAxis(EAxis::Y), Input.X); } }. Attribue les assets IA et IMC dans le panneau Details. Joue et vérifie le mouvement.`,
        en:`void AMyChar::Move(const FInputActionValue& Value) { FVector2D Input = Value.Get<FVector2D>(); if(Controller) { const FRotator Rot = Controller->GetControlRotation(); AddMovementInput(FRotationMatrix(Rot).GetUnitAxis(EAxis::X), Input.Y); AddMovementInput(FRotationMatrix(Rot).GetUnitAxis(EAxis::Y), Input.X); } }. Assign the IA and IMC assets in the Details panel. Play and verify movement.`
      },
    ],
    discussion:[
      { fr:`L'EIS sépare les InputActions des InputMappingContexts. Quel avantage concret est-ce que ça donne au designer d'un jeu avec plusieurs schémas de contrôle (clavier/manette/mobile) ?`, en:`EIS separates InputActions from InputMappingContexts. What concrete advantage does this give a game designer managing multiple control schemes (keyboard/gamepad/mobile)?` },
    ],
    compare:{
      cs:`<span class="cm">// Unity — Input.GetAxis (legacy)</span>
<span class="kw">void</span> <span class="fn">Update</span>() {
    <span class="kw">float</span> h = <span class="ty">Input</span>.<span class="fn">GetAxis</span>(<span class="str">"Horizontal"</span>);
    <span class="kw">float</span> v = <span class="ty">Input</span>.<span class="fn">GetAxis</span>(<span class="str">"Vertical"</span>);
    <span class="kw">var</span> dir = <span class="kw">new</span> <span class="ty">Vector3</span>(h, <span class="num">0</span>, v);
    transform.Translate(dir * speed
        * <span class="ty">Time</span>.deltaTime);
}`,
      cpp:`<span class="cm">// Unreal — Enhanced Input</span>
<span class="kw2">void</span> <span class="fn2">Move</span>(
    <span class="kw2">const</span> <span class="ty">FInputActionValue</span>&amp; Val)
{
    <span class="ty">FVector2D</span> In =
        Val.<span class="fn2">Get</span>&lt;<span class="ty">FVector2D</span>&gt;();
    <span class="fn2">AddMovementInput</span>(
        <span class="fn2">GetActorForwardVector</span>(), In.Y);
    <span class="fn2">AddMovementInput</span>(
        <span class="fn2">GetActorRightVector</span>(), In.X);
}`
    },
    activities:[
      {
        id:'e11_1', type:'quiz', xp:15,
        q:{ fr:`Dans l'Enhanced Input System, quelle est la différence entre une InputAction et un InputMappingContext ?`, en:`In the Enhanced Input System, what is the difference between an InputAction and an InputMappingContext?` },
        choices:[
          { t:{ fr:`InputAction = la touche physique ; InputMappingContext = l'intention du joueur`, en:`InputAction = the physical key; InputMappingContext = the player's intent` }, c:false,
            fb:{ fr:`C'est l'inverse. L'InputAction représente l'intention ("Sauter"), l'IMC associe les touches physiques à cette intention.`, en:`It's the opposite. InputAction represents the intent ("Jump"), the IMC associates physical keys with that intent.` } },
          { t:{ fr:`InputAction = l'intention du joueur (ex. "Sauter") ; InputMappingContext = la liaison touches → actions`, en:`InputAction = player intent (e.g. "Jump"); InputMappingContext = key → action binding` }, c:true,
            fb:{ fr:`Correct. Cette séparation permet de changer les touches sans toucher au code C++ — seul l'IMC change.`, en:`Correct. This separation allows changing keys without touching C++ code — only the IMC changes.` } },
          { t:{ fr:`Ce sont deux noms pour la même chose`, en:`They're two names for the same thing` }, c:false,
            fb:{ fr:`Non — ce sont deux assets distincts avec des rôles différents dans le pipeline d'input.`, en:`No — they're two distinct assets with different roles in the input pipeline.` } },
          { t:{ fr:`InputMappingContext est uniquement pour les manettes`, en:`InputMappingContext is only for gamepads` }, c:false,
            fb:{ fr:`L'IMC gère tous les périphériques : clavier, souris, manette, écran tactile.`, en:`The IMC handles all devices: keyboard, mouse, gamepad, touchscreen.` } },
        ]
      },
      {
        id:'e11_2', type:'fill', xp:20,
        instr:{ fr:`Pour déplacer un APawn en C++ Unreal dans une direction, la méthode correcte est :`, en:`To move an APawn in Unreal C++ in a direction, the correct method is:` },
        template:{ fr:'______(GetActorForwardVector(), InputValue);', en:'______(GetActorForwardVector(), InputValue);' },
        answer:'AddMovementInput',
        hint:{ fr:`La méthode APawn qui ajoute une entrée de déplacement traitée par le CharacterMovementComponent`, en:`The APawn method that adds movement input processed by the CharacterMovementComponent` }
      },
      {
        id:'e11_3', type:'bug', xp:25,
        instr:{ fr:`Ce code de binding d'input Unreal ne fonctionnera pas. Identifie le problème.`, en:`This Unreal input binding code won't work. Identify the problem.` },
        bugCode:`<span class="kw2">void</span> <span class="ty">AMyChar</span>::<span class="fn2">SetupPlayerInputComponent</span>(
    <span class="ty">UInputComponent</span>* Comp)
{
    <span class="kw2">Super</span>::<span class="fn2">SetupPlayerInputComponent</span>(Comp);
    <span class="bug-line">Comp-&gt;<span class="fn2">BindAction</span>(IA_Move,
        <span class="ty">ETriggerEvent</span>::Triggered,
        <span class="kw2">this</span>, &amp;<span class="ty">AMyChar</span>::<span class="fn2">Move</span>);</span>
}`,
        explanation:{ fr:`Comp est un UInputComponent de base qui n'a pas BindAction() pour l'EIS. Il faut le caster en UEnhancedInputComponent : auto* EIC = Cast<UEnhancedInputComponent>(Comp); if(EIC) EIC->BindAction(IA_Move, ETriggerEvent::Triggered, this, &AMyChar::Move);. Sans le cast, le code compile mais l'input ne fonctionne jamais.`, en:`Comp is a base UInputComponent that doesn't have BindAction() for EIS. It needs to be cast to UEnhancedInputComponent: auto* EIC = Cast<UEnhancedInputComponent>(Comp); if(EIC) EIC->BindAction(IA_Move, ETriggerEvent::Triggered, this, &AMyChar::Move);. Without the cast, the code compiles but input never works.` }
      },
      {
        id:'e11_4', type:'engine', xp:40,
        label:{ fr:'Dans Unity + Unreal', en:'In Unity + Unreal' },
        task:{ fr:`1. Dans Unity : crée un cube qui se déplace avec WASD dans Update() via Input.GetAxis. 2. Dans Unreal : crée un Pawn C++ avec l'Enhanced Input System. Crée IA_Move (Axis2D) et un IMC par défaut avec WASD. Lie IA_Move dans SetupPlayerInputComponent() et implémente Move() avec AddMovementInput(). 3. Dans les deux moteurs, teste et vérifie que le mouvement est frame-rate indépendant (DeltaTime). 4. Dans l'IMC Unreal, ajoute un binding pour la manette sans toucher au code C++.`, en:`1. In Unity: create a cube that moves with WASD in Update() via Input.GetAxis. 2. In Unreal: create a C++ Pawn with the Enhanced Input System. Create IA_Move (Axis2D) and a default IMC with WASD. Bind IA_Move in SetupPlayerInputComponent() and implement Move() with AddMovementInput(). 3. In both engines, test and verify movement is frame-rate independent (DeltaTime). 4. In the Unreal IMC, add a gamepad binding without touching C++ code.` },
        note:{ fr:`L'objectif final (step 4) démontre l'avantage data-driven de l'EIS.`, en:`The final step demonstrates the data-driven advantage of EIS.` }
      },
    ],
  },

  homework:{
    core:[
      {diff:'easy', fr:'Crée une interface IMovable en C++ (classe abstraite pure) avec virtual void move(float dx, float dy) = 0. Dérive Player et Enemy avec des comportements différents.', en:'Create an IMovable interface in C++ (pure abstract class) with virtual void move(float dx, float dy) = 0. Derive Player and Enemy with different behaviors.'},
      {diff:'medium', fr:'Stocke Player et Enemy dans un vector<IMovable*> et appelle move() sur tous avec les mêmes paramètres. Affiche la position de chacun après.', en:'Store Player and Enemy in a vector<IMovable*> and call move() on all with the same parameters. Print each one\'s position afterward.'},
      {diff:'hard', fr:'Implémente un InputSimulator qui stocke une liste de commandes {dx, dy} et les rejoue en ordre sur un IMovable*. C\'est le pattern Command — utile pour le replay et le undo.', en:'Implement an InputSimulator that stores a list of commands {dx, dy} and replays them in order on an IMovable*. This is the Command pattern — useful for replay and undo.'},
    ],
    ide:[
      {diff:'medium', fr:'Compile ton projet IMovable avec plusieurs fichiers (.h + .cpp par classe). Écris un script shell ou un Makefile minimal pour recompiler en une commande.', en:'Compile your IMovable project with multiple files (.h + .cpp per class). Write a shell script or minimal Makefile to recompile in one command.'},
    ],
    engine:[
      {diff:'hard', fr:'Dans Unreal, crée un InputMappingContext avec des bindings pour WASD, les touches directionnelles, ET un gamepad. Vérifie que les trois fonctionnent sans changer une ligne de C++.', en:'In Unreal, create an InputMappingContext with bindings for WASD, arrow keys, AND a gamepad. Verify all three work without changing a single line of C++.'},
    ],
  },
};
document.addEventListener('DOMContentLoaded',()=>{});
