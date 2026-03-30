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
        label:{ fr:'Classe de base abstraite avec méthode virtuelle pure', en:'Abstract base class with pure virtual method' },
        fr:`Crée deux fichiers : movable.h et player.h/player.cpp. Dans movable.h : class Movable { public: virtual void move(float dx, float dy) = 0; virtual ~Movable() {} float x=0, y=0; };. Le = 0 rend move() purement virtuelle — Movable ne peut pas être instancié directement. C'est l'équivalent d'une interface en C#.`,
        en:`Create two files: movable.h and player.h/player.cpp. In movable.h: class Movable { public: virtual void move(float dx, float dy) = 0; virtual ~Movable() {} float x=0, y=0; };. The = 0 makes move() purely virtual — Movable cannot be instantiated directly. It's the equivalent of an interface in C#.`
      },
      {
        label:{ fr:'Classe dérivée Player implémente move()', en:'Derived Player class implements move()' },
        fr:`Dans player.h : class Player : public Movable { public: void move(float dx, float dy) override; void printPos() const; };. Dans player.cpp : void Player::move(float dx, float dy) { x += dx; y += dy; } void Player::printPos() const { cout << "(" << x << "," << y << ")"; }. Compile et teste : Player p; p.move(3,4); p.printPos();`,
        en:`In player.h: class Player : public Movable { public: void move(float dx, float dy) override; void printPos() const; };. In player.cpp: void Player::move(float dx, float dy) { x += dx; y += dy; } void Player::printPos() const { cout << "(" << x << "," << y << ")"; }. Compile and test: Player p; p.move(3,4); p.printPos();`
      },
      {
        label:{ fr:'Polymorphisme avec Movable*', en:'Polymorphism with Movable*' },
        fr:`Dans main.cpp : Movable* entity = new Player(); entity->move(5, -2); Montre que move() de Player est appelée via le pointeur Movable. Ajoute une deuxième classe Enemy : public Movable avec son propre move() qui applique une vélocité différente. Stocke les deux dans vector<Movable*> et appelle move() sur tous.`,
        en:`In main.cpp: Movable* entity = new Player(); entity->move(5, -2); Show that Player's move() is called through the Movable pointer. Add a second Enemy : public Movable class with its own move() applying different velocity. Store both in a vector<Movable*> and call move() on all.`
      },
    ],
    discussion:[
      { fr:`Une méthode purement virtuelle (= 0) force toutes les classes dérivées à l'implémenter. Quelle est la différence avec une méthode virtuelle ordinaire qui a une implémentation par défaut ?`, en:`A purely virtual method (= 0) forces all derived classes to implement it. What's the difference from an ordinary virtual method that has a default implementation?` },
    ],
    compare:{
      std:`<span class="cm">// C++ — interface via classe abstraite</span>
<span class="kw2">class</span> <span class="ty">Movable</span> {
<span class="kw2">public</span>:
    <span class="kw2">virtual void</span> <span class="fn2">move</span>(<span class="kw2">float</span> dx, <span class="kw2">float</span> dy) = <span class="num">0</span>;
    <span class="kw2">virtual</span> ~<span class="ty">Movable</span>() {}
    <span class="kw2">float</span> x=<span class="num">0</span>, y=<span class="num">0</span>;
};
<span class="kw2">class</span> <span class="ty">Player</span> : <span class="kw2">public</span> <span class="ty">Movable</span> {
<span class="kw2">public</span>:
    <span class="kw2">void</span> <span class="fn2">move</span>(<span class="kw2">float</span> dx, <span class="kw2">float</span> dy) <span class="kw2">override</span> {
        x += dx; y += dy;
    }
};`,
      unreal:`<span class="cm">// Unreal — interface via UInterface + I*</span>
<span class="mac">UINTERFACE</span>()
<span class="kw2">class</span> <span class="ty">UMovable</span> : <span class="kw2">public</span> <span class="ty">UInterface</span>
    { <span class="mac">GENERATED_BODY</span>() };

<span class="kw2">class</span> <span class="ty">IMovable</span> {
    <span class="mac">GENERATED_BODY</span>()
<span class="kw2">public</span>:
    <span class="kw2">virtual void</span> <span class="fn2">Move</span>(
        <span class="ty">FVector</span> Dir) = <span class="num">0</span>;
};`
    },
    activities:[
      {
        id:'i11_1', type:'predict', xp:15,
        code:`#include &lt;iostream&gt;
class Shape {
public:
    virtual float area() const = 0;
    virtual ~Shape() {}
};
class Rect : public Shape {
    float w, h;
public:
    Rect(float w, float h) : w(w), h(h) {}
    float area() const override { return w * h; }
};
class Circle : public Shape {
    float r;
public:
    Circle(float r) : r(r) {}
    float area() const override { return 3.14f * r * r; }
};
int main() {
    Shape* shapes[2] = { new Rect(4,3), new Circle(2) };
    for(auto* s : shapes)
        std::cout &lt;&lt; s-&gt;area() &lt;&lt; " ";
    for(auto* s : shapes) delete s;
}`,
        question:{ fr:`Quelle est la sortie ? Pourquoi Shape* peut-il appeler la bonne méthode area() pour chaque type ?`, en:`What is the output? Why can Shape* call the correct area() method for each type?` },
        output:`12 12.56 `,
        explanation:{ fr:`12 (4×3) et 12.56 (3.14×4). area() est purement virtuelle — le dispatch dynamique appelle la version réelle de l'objet (Rect ou Circle), pas celle de Shape (qui n'en a pas). C'est le polymorphisme via pointeur de classe de base.`, en:`12 (4×3) and 12.56 (3.14×4). area() is purely virtual — dynamic dispatch calls the actual object's version (Rect or Circle), not Shape's (which has none). That's polymorphism via base class pointer.` }
      },
      {
        id:'i11_2', type:'cpp', xp:35,
        instr:{ fr:`Crée une classe abstraite Animal avec virtual std::string sound() const = 0 et virtual void describe() const qui affiche "Animal: " + sound(). Crée Dog et Cat qui héritent d'Animal et implémentent sound(). Dans main(), appelle describe() sur chacun via Animal*.`, en:`Create an abstract class Animal with virtual std::string sound() const = 0 and virtual void describe() const that prints "Animal: " + sound(). Create Dog and Cat inheriting from Animal and implementing sound(). In main(), call describe() on each via Animal*.` },
        stub:`#include &lt;iostream&gt;
#include &lt;string&gt;
class Animal {
public:
    virtual std::string sound() const = 0;
    virtual void describe() const {
        std::cout &lt;&lt; "Animal: " &lt;&lt; sound() &lt;&lt; std::endl;
    }
    virtual ~Animal() {}
};
// Dog et Cat ici

int main() {
    Animal* animals[] = { new Dog(), new Cat() };
    for(auto* a : animals) { a-&gt;describe(); delete a; }
    return 0;
}`,
        hint:{ fr:`describe() dans la classe de base appelle sound() — qui sera résolue dynamiquement vers Dog::sound() ou Cat::sound() selon l'objet réel.`, en:`describe() in the base class calls sound() — which will be dynamically resolved to Dog::sound() or Cat::sound() based on the actual object.` },
        solution:{
          fr:`<pre style="font-family:var(--mono);font-size:1.3rem;line-height:1.8;color:#e0e8ef">class Dog : public Animal {
public:
    std::string sound() const override { return "Woof"; }
};
class Cat : public Animal {
public:
    std::string sound() const override { return "Meow"; }
};</pre><p style="margin-top:.8rem;font-size:1.4rem;color:var(--ch2)">Sortie : <code>Animal: Woof</code> puis <code>Animal: Meow</code><br>Note : describe() appelle sound() via dispatch dynamique — la version concrète est choisie à l'exécution.</p>`,
          en:`<pre style="font-family:var(--mono);font-size:1.3rem;line-height:1.8;color:#e0e8ef">class Dog : public Animal {
public:
    std::string sound() const override { return "Woof"; }
};
class Cat : public Animal {
public:
    std::string sound() const override { return "Meow"; }
};</pre><p style="margin-top:.8rem;font-size:1.4rem;color:var(--ch2)">Output: <code>Animal: Woof</code> then <code>Animal: Meow</code><br>Note: describe() calls sound() via dynamic dispatch — the concrete version is chosen at runtime.</p>`
        }
      },
      {
        id:'i11_3', type:'bug', xp:20,
        instr:{ fr:`Ce code compile mais ne peut jamais être exécuté tel quel. Pourquoi ?`, en:`This code compiles but can never be executed as-is. Why?` },
        bugCode:`<span class="kw2">class</span> <span class="ty">Weapon</span> {
<span class="kw2">public</span>:
    <span class="kw2">virtual void</span> <span class="fn2">fire</span>() = <span class="num">0</span>;
    <span class="kw2">virtual</span> ~<span class="ty">Weapon</span>() {}
};
<span class="kw2">int</span> main() {
    <span class="bug-line"><span class="ty">Weapon</span> w;</span>  <span class="cm">// tentative d'instanciation</span>
    w.<span class="fn2">fire</span>();
}`,
        explanation:{ fr:`Weapon est une classe abstraite car fire() est purement virtuelle (= 0). Instancier directement une classe abstraite est une erreur de compilation. Pour utiliser Weapon, il faut créer une classe dérivée concrète (ex. Pistol : public Weapon) qui implémente fire(), puis instancier cette classe.`, en:`Weapon is an abstract class because fire() is purely virtual (= 0). Directly instantiating an abstract class is a compilation error. To use Weapon, you need to create a concrete derived class (e.g. Pistol : public Weapon) that implements fire(), then instantiate that class.` }
      },
      {
        id:'i11_4', type:'fill', xp:15,
        instr:{ fr:`Pour déclarer une méthode virtuelle pure qui oblige toutes les classes dérivées à l'implémenter :`, en:`To declare a purely virtual method that forces all derived classes to implement it:` },
        template:{ fr:'virtual void attack() ______;', en:'virtual void attack() ______;' },
        answer:'= 0',
        hint:{ fr:`La syntaxe après la signature qui rend la méthode "purement virtuelle"`, en:`The syntax after the signature that makes the method "purely virtual"` }
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
};
document.addEventListener('DOMContentLoaded',()=>{});
