'use strict';
// Session 07 — AActor & UObject

const SESSION = {
  id:        's07',
  num:       7,
  prev:      6,
  next:      8,
  xp:        120,
  blocName:  { fr:'Unreal Engine C++', en:'Unreal Engine C++' },
  blocColor: '#00587c',
  title:     { fr:'AActor & UObject', en:'AActor & UObject' },
  sub:       { fr:"L'équivalent de MonoBehaviour — et bien plus", en:'The MonoBehaviour equivalent — and much more' },

  tutor: {
    concept: {
      fr:`En Unity, tout objet de scène hérite de MonoBehaviour. En Unreal, la hiérarchie est plus riche : UObject est la base de tout, AActor est pour les objets qui existent dans le monde, UActorComponent pour les comportements attachables. C'est plus puissant, et la transition est directe une fois le vocabulaire connu.`,
      en:`In Unity, every scene object inherits from MonoBehaviour. In Unreal, the hierarchy is richer: UObject is the base of everything, AActor is for objects that exist in the world, UActorComponent for attachable behaviors. It's more powerful, and the transition is direct once the vocabulary is known.`
    },
    demoSteps: [
      {
        label: { fr:'La hiérarchie : UObject → AActor → APawn → ACharacter', en:'The hierarchy: UObject → AActor → APawn → ACharacter' },
        fr:`Dessine ou tape la hiérarchie. UObject : base de tout, gestion GC, réflexion. AActor : peut être placé dans le monde, a un Transform. APawn : peut être contrôlé par un Controller (joueur ou IA). ACharacter : personnage avec mouvement, CapsuleComponent, CharacterMovementComponent. En Unity, c'est un GameObject + les différents Components qui composent tout ça.`,
        en:`Draw or type the hierarchy. UObject: base of everything, GC management, reflection. AActor: can be placed in the world, has a Transform. APawn: can be controlled by a Controller (player or AI). ACharacter: character with movement, CapsuleComponent, CharacterMovementComponent. In Unity, it's a GameObject + various Components that compose all this.`
      },
      {
        label: { fr:'Préfixes de nommage Unreal', en:'Unreal naming prefixes' },
        fr:`Unreal a des conventions de préfixes stricts : A = Actor (hérite de AActor), U = UObject non-Actor, F = struct, T = template/container, I = interface, E = enum. Montre des exemples : APlayerCharacter, UHealthComponent, FVector, TArray, IDamageable, EWeaponType. Ce n'est pas esthétique, mais ça permet de savoir immédiatement de quel type on parle.`,
        en:`Unreal has strict prefix conventions: A = Actor (inherits from AActor), U = non-Actor UObject, F = struct, T = template/container, I = interface, E = enum. Show examples: APlayerCharacter, UHealthComponent, FVector, TArray, IDamageable, EWeaponType. It's not pretty, but it lets you instantly know what type you're looking at.`
      },
      {
        label: { fr:'UCLASS() et GENERATED_BODY()', en:'UCLASS() and GENERATED_BODY()' },
        fr:`Crée un Actor C++ dans Unreal. Montre les macros UCLASS() et GENERATED_BODY() dans le .h. Ce sont des macros de réflexion — elles permettent à Unreal de "voir" la classe pour le GC, l'éditeur, les Blueprints, et la sérialisation. Sans elles, la classe C++ fonctionne mais est invisible au moteur.`,
        en:`Create a C++ Actor in Unreal. Show the UCLASS() and GENERATED_BODY() macros in the .h. These are reflection macros — they allow Unreal to "see" the class for the GC, editor, Blueprints, and serialization. Without them, the C++ class works but is invisible to the engine.`
      },
    ],
    discussion: [
      {
        fr:`En Unity, quelle est la différence entre un GameObject et un Component ? Comment ça se traduit dans la hiérarchie AActor / UActorComponent ?`,
        en:`In Unity, what is the difference between a GameObject and a Component? How does that translate into the AActor / UActorComponent hierarchy?`
      },
      {
        fr:`Pourquoi Unreal impose-t-il des préfixes (A, U, F…) ? Selon toi, est-ce une bonne pratique à adopter dans tes propres projets ?`,
        en:`Why does Unreal enforce prefixes (A, U, F…)? Do you think it's a good practice to adopt in your own projects?`
      },
    ],
    deep: {
      fr:`<p><strong>La réflexion Unreal (Unreal Header Tool).</strong> UCLASS(), UPROPERTY(), UFUNCTION() sont des marqueurs de réflexion traités par l'Unreal Header Tool (UHT) avant la compilation C++. UHT génère des fichiers .generated.h qui injectent du code permettant au moteur de lister toutes les propriétés d'une classe, de les sérialiser, de les exposer aux Blueprints, et de les gérer dans le GC.</p>
<p>C'est ce qui rend Unreal plus puissant que du C++ brut — mais aussi ce qui explique les temps de compilation parfois longs et les messages d'erreur cryptiques. Quand tu vois "error: include of generated header must be last", c'est UHT qui parle.</p>`,
      en:`<p><strong>Unreal reflection (Unreal Header Tool).</strong> UCLASS(), UPROPERTY(), UFUNCTION() are reflection markers processed by the Unreal Header Tool (UHT) before C++ compilation. UHT generates .generated.h files that inject code allowing the engine to list all class properties, serialize them, expose them to Blueprints, and manage them in the GC.</p>
<p>This is what makes Unreal more powerful than raw C++ — but also explains sometimes long compilation times and cryptic error messages. When you see "error: include of generated header must be last", that's UHT talking.</p>`
    }
  },

  compare: {
    cs:`<span class="cm">// Unity — MonoBehaviour</span>
<span class="kw">public class</span> <span class="ty">EnemyAI</span>
    : <span class="ty">MonoBehaviour</span>
{
    <span class="kw">void</span> <span class="fn">Start</span>() { }
    <span class="kw">void</span> <span class="fn">Update</span>() { }
    <span class="cm">// Component via GetComponent</span>
}`,
    cpp:`<span class="cm">// Unreal — AActor</span>
<span class="mac">UCLASS</span>()
<span class="kw2">class</span> <span class="ty">AEnemyAI</span>
    : <span class="kw2">public</span> <span class="ty">AActor</span>
{
    <span class="mac">GENERATED_BODY</span>()
<span class="kw2">public</span>:
    <span class="kw2">void</span> <span class="fn2">BeginPlay</span>() <span class="kw2">override</span>;
    <span class="kw2">void</span> <span class="fn2">Tick</span>(<span class="kw2">float</span> D) <span class="kw2">override</span>;
};`
  },

  activities: [
    {
      id:'a7_1', type:'quiz', xp:15,
      q:{
        fr:`Quel est l'équivalent Unreal du MonoBehaviour Unity pour un objet qui peut être placé dans le monde ?`,
        en:`What is the Unreal equivalent of Unity's MonoBehaviour for an object that can be placed in the world?`
      },
      choices:[
        { t:'UObject', c:false, fb:{ fr:`UObject est la base de tout dans Unreal, mais ne peut pas être placé directement dans le monde.`, en:`UObject is the base of everything in Unreal, but can't be placed directly in the world.` } },
        { t:'UActorComponent', c:false, fb:{ fr:`UActorComponent est l'équivalent d'un Component Unity — il s'attache à un Actor mais n'existe pas seul dans le monde.`, en:`UActorComponent is the equivalent of a Unity Component — it attaches to an Actor but doesn't exist standalone in the world.` } },
        { t:'ACharacter', c:false, fb:{ fr:`ACharacter est spécifique aux personnages avec mouvement. Pour un objet générique, AActor est plus approprié.`, en:`ACharacter is specific to characters with movement. For a generic object, AActor is more appropriate.` } },
        { t:'AActor', c:true, fb:{ fr:`Correct. AActor est la classe de base pour tout objet du monde. APawn et ACharacter en héritent pour des fonctionnalités plus spécifiques.`, en:`Correct. AActor is the base class for all world objects. APawn and ACharacter inherit from it for more specific functionality.` } },
      ]
    },
    {
      id:'a7_2', type:'fill', xp:20,
      instr:{
        fr:`Dans la convention de nommage Unreal, une structure (struct) a le préfixe :`,
        en:`In Unreal naming convention, a struct has the prefix:`
      },
      template:{ fr:'struct ______PlayerData { int32 Health; };', en:'struct ______PlayerData { int32 Health; };' },
      answer:'F',
      hint:{ fr:'Pense à FString, FVector, FRotator — quel est leur préfixe commun ?', en:'Think of FString, FVector, FRotator — what\'s their common prefix?' }
    },
    {
      id:'a7_3', type:'bug', xp:25,
      instr:{
        fr:`Ce header Unreal a une macro manquante critique. Sans elle, la classe ne peut pas être utilisée par le moteur.`,
        en:`This Unreal header is missing a critical macro. Without it, the class cannot be used by the engine.`
      },
      bugCode:`<span class="mac">UCLASS</span>()
<span class="kw2">class</span> <span class="ty">AWeapon</span> : <span class="kw2">public</span> <span class="ty">AActor</span>
{
    <span class="bug-line"><span class="cm">// il manque quelque chose ici</span></span>
<span class="kw2">public</span>:
    <span class="kw2">float</span> Damage = <span class="num">10.0f</span>;
    <span class="kw2">void</span> <span class="fn2">Fire</span>();
};`,
      explanation:{
        fr:`Il manque GENERATED_BODY() juste après l'ouverture de la classe. Cette macro est obligatoire dans toute classe marquée UCLASS() — elle injecte le code généré par Unreal pour la réflexion, le GC, et les Blueprints. Sans elle, la compilation échouera avec des erreurs cryptiques liées à l'Unreal Header Tool.`,
        en:`Missing GENERATED_BODY() right after the class opening. This macro is mandatory in any class marked UCLASS() — it injects code generated by Unreal for reflection, GC, and Blueprints. Without it, compilation will fail with cryptic errors related to the Unreal Header Tool.`
      }
    },
    {
      id:'a7_4', type:'engine', xp:40,
      label:{ fr:'Dans Unity + Unreal', en:'In Unity + Unreal' },
      task:{
        fr:`1. Dans Unity : ouvre un MonoBehaviour. Liste ses méthodes de cycle de vie dans un fichier texte (Start, Update, OnTriggerEnter, OnDestroy, etc.). 2. Dans Unreal : ouvre un AActor C++ généré. Liste ses méthodes équivalentes (BeginPlay, Tick, NotifyActorBeginOverlap, EndPlay, etc.). 3. Fais une table de correspondance à deux colonnes.`,
        en:`1. In Unity: open a MonoBehaviour. List its lifecycle methods in a text file (Start, Update, OnTriggerEnter, OnDestroy, etc.). 2. In Unreal: open a generated C++ AActor. List its equivalent methods (BeginPlay, Tick, NotifyActorBeginOverlap, EndPlay, etc.). 3. Make a two-column correspondence table.`
      },
      note:{
        fr:`Cette table sera une référence utile pour les sessions suivantes.`,
        en:`This table will be a useful reference for upcoming sessions.`
      }
    },
    {
      id:'a7_5', type:'reflect', xp:10,
      prompt:{
        fr:`En Unity, tout objet de scène est un GameObject avec des Components. En Unreal, les Actors peuvent directement contenir de la logique sans passer par des Components. Quelle approche te semble plus claire pour organiser un projet de jeu complexe ? Pourquoi ?`,
        en:`In Unity, every scene object is a GameObject with Components. In Unreal, Actors can directly contain logic without going through Components. Which approach seems clearer to you for organizing a complex game project? Why?`
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
