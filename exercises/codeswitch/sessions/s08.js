'use strict';
// Session 08 — UPROPERTY & UFUNCTION

const SESSION = {
  id:        's08',
  num:       8,
  prev:      7,
  next:      9,
  xp:        120,
  blocName:  { fr:'Unreal Engine C++', en:'Unreal Engine C++' },
  blocColor: '#00587c',
  title:     { fr:'UPROPERTY & UFUNCTION', en:'UPROPERTY & UFUNCTION' },
  sub:       { fr:'[SerializeField] et events — version Unreal', en:'[SerializeField] and events — Unreal edition' },

  tutor: {
    concept: {
      fr:`En Unity, [SerializeField] expose une variable privée dans l'Inspector. [Header("...")] ajoute une catégorie. En Unreal, UPROPERTY() fait tout ça et plus : expose à l'éditeur, au GC, aux Blueprints, et à la sérialisation. UFUNCTION() fait pareil pour les méthodes. Ce sont les deux macros que tu utiliseras le plus souvent dans tout code Unreal.`,
      en:`In Unity, [SerializeField] exposes a private variable in the Inspector. [Header("...")] adds a category. In Unreal, UPROPERTY() does all that and more: exposes to editor, GC, Blueprints, and serialization. UFUNCTION() does the same for methods. These are the two macros you'll use most often in all Unreal code.`
    },
    demoSteps: [
      {
        label: { fr:'UPROPERTY — les spécificateurs essentiels', en:'UPROPERTY — essential specifiers' },
        fr:`Montre les trois spécificateurs les plus courants : EditAnywhere (visible et modifiable dans l'éditeur), BlueprintReadWrite (accessible en Blueprint), Category. Tape en live une variable Health avec UPROPERTY(EditAnywhere, BlueprintReadWrite, Category="Combat"). Glisse l'Actor dans la scène et montre que Health apparaît dans le panneau Details.`,
        en:`Show the three most common specifiers: EditAnywhere (visible and editable in editor), BlueprintReadWrite (accessible in Blueprint), Category. Live-type a Health variable with UPROPERTY(EditAnywhere, BlueprintReadWrite, Category="Combat"). Drag the Actor into the scene and show Health appears in the Details panel.`
      },
      {
        label: { fr:'VisibleAnywhere vs EditAnywhere', en:'VisibleAnywhere vs EditAnywhere' },
        fr:`VisibleAnywhere : visible dans l'éditeur mais pas modifiable. EditAnywhere : visible ET modifiable. Analogie Unity : [SerializeField] = EditAnywhere. [HideInInspector] = pas de UPROPERTY. EditDefaultsOnly = modifiable uniquement sur le Blueprint/prefab, pas sur les instances.`,
        en:`VisibleAnywhere: visible in editor but not editable. EditAnywhere: visible AND editable. Unity analogy: [SerializeField] = EditAnywhere. [HideInInspector] = no UPROPERTY. EditDefaultsOnly = editable only on the Blueprint/prefab, not on instances.`
      },
      {
        label: { fr:'UFUNCTION — BlueprintCallable', en:'UFUNCTION — BlueprintCallable' },
        fr:`UFUNCTION(BlueprintCallable) rend une méthode C++ appelable depuis un Blueprint. Montre une méthode TakeDamage avec UFUNCTION(BlueprintCallable, Category="Combat"). Crée un Blueprint enfant et montre que TakeDamage apparaît comme un nœud. C'est l'équivalent d'une méthode publique en Unity que le designer peut appeler via des Events.`,
        en:`UFUNCTION(BlueprintCallable) makes a C++ method callable from a Blueprint. Show a TakeDamage method with UFUNCTION(BlueprintCallable, Category="Combat"). Create a Blueprint child and show TakeDamage appears as a node. It's the equivalent of a public Unity method the designer can call via Events.`
      },
    ],
    discussion: [
      {
        fr:`En Unity, tu utilisais probablement [SerializeField] pour beaucoup de variables. En Unreal, EditAnywhere fait pareil. Quelle est la différence philosophique entre les deux systèmes de métadonnées ?`,
        en:`In Unity, you probably used [SerializeField] for many variables. In Unreal, EditAnywhere does the same. What's the philosophical difference between the two metadata systems?`
      },
      {
        fr:`UFUNCTION(BlueprintCallable) permet à un designer de déclencher du code C++ depuis un Blueprint. Comment est-ce que ça change la façon dont tu penserais l'architecture de ton code dans un projet en équipe ?`,
        en:`UFUNCTION(BlueprintCallable) allows a designer to trigger C++ code from a Blueprint. How does that change how you'd think about your code architecture in a team project?`
      },
    ],
    deep: {
      fr:`<p><strong>Replication pour le multijoueur.</strong> UPROPERTY() peut aussi prendre <code>Replicated</code> ou <code>ReplicatedUsing=OnRep_Health</code> pour le multijoueur. Quand une variable marquée Replicated change sur le serveur, Unreal la synchronise automatiquement sur tous les clients.</p>
<p>UFUNCTION() peut prendre <code>Server</code>, <code>Client</code>, ou <code>NetMulticast</code> pour définir qui exécute la fonction. C'est l'un des systèmes de réplication réseau les plus puissants de l'industrie — et tout passe par ces macros que tu connais maintenant.</p>`,
      en:`<p><strong>Replication for multiplayer.</strong> UPROPERTY() can also take <code>Replicated</code> or <code>ReplicatedUsing=OnRep_Health</code> for multiplayer. When a Replicated variable changes on the server, Unreal automatically syncs it to all clients.</p>
<p>UFUNCTION() can take <code>Server</code>, <code>Client</code>, or <code>NetMulticast</code> to define who executes the function. It's one of the most powerful network replication systems in the industry — and it all goes through these macros you now know.</p>`
    }
  },

  compare: {
    cs:`<span class="cm">// Unity — Inspector</span>
[<span class="ty">SerializeField</span>]
<span class="kw">private int</span> health = <span class="num">100</span>;

[<span class="ty">Header</span>(<span class="str">"Combat"</span>)]
<span class="kw">public float</span> damage;

<span class="cm">// Méthode appelable depuis un Event</span>
<span class="kw">public void</span> <span class="fn">TakeDamage</span>(<span class="kw">float</span> d) { }`,
    cpp:`<span class="cm">// Unreal — UPROPERTY / UFUNCTION</span>
<span class="mac">UPROPERTY</span>(EditAnywhere,
    Category=<span class="str">"Combat"</span>)
<span class="kw2">int32</span> Health = <span class="num">100</span>;

<span class="mac">UPROPERTY</span>(EditAnywhere,
    Category=<span class="str">"Combat"</span>)
<span class="kw2">float</span> Damage;

<span class="mac">UFUNCTION</span>(BlueprintCallable,
    Category=<span class="str">"Combat"</span>)
<span class="kw2">void</span> <span class="fn2">TakeDamage</span>(<span class="kw2">float</span> D);`
  },

  activities: [
    {
      id:'a8_1', type:'quiz', xp:15,
      q:{
        fr:`Quel spécificateur UPROPERTY() doit-on utiliser pour qu'une variable soit visible ET modifiable dans l'éditeur Unreal ?`,
        en:`Which UPROPERTY() specifier makes a variable visible AND editable in the Unreal editor?`
      },
      choices:[
        { t:'VisibleAnywhere', c:false, fb:{ fr:`VisibleAnywhere = visible mais pas modifiable. Comme un champ en lecture seule dans l'Inspector Unity.`, en:`VisibleAnywhere = visible but not editable. Like a read-only field in Unity's Inspector.` } },
        { t:'EditAnywhere', c:true, fb:{ fr:`Correct ! EditAnywhere = visible ET modifiable dans l'éditeur. C'est l'équivalent de [SerializeField] en Unity.`, en:`Correct! EditAnywhere = visible AND editable in the editor. It's the equivalent of [SerializeField] in Unity.` } },
        { t:'BlueprintReadOnly', c:false, fb:{ fr:`BlueprintReadOnly rend la variable lisible depuis un Blueprint — pas modifiable dans l'éditeur.`, en:`BlueprintReadOnly makes the variable readable from a Blueprint — not editable in the editor.` } },
        { t:'ExposeOnSpawn', c:false, fb:{ fr:`ExposeOnSpawn expose la variable lors de la création de l'Actor via Blueprint, pas pour l'édition générale.`, en:`ExposeOnSpawn exposes the variable when creating the Actor via Blueprint, not for general editing.` } },
      ]
    },
    {
      id:'a8_2', type:'fill', xp:20,
      instr:{
        fr:`Complète la macro pour rendre cette fonction C++ appelable depuis un Blueprint :`,
        en:`Complete the macro to make this C++ function callable from a Blueprint:`
      },
      template:{ fr:'UFUNCTION(______)\nvoid TakeDamage(float Amount);', en:'UFUNCTION(______)\nvoid TakeDamage(float Amount);' },
      answer:'BlueprintCallable',
      hint:{ fr:'Le spécificateur qui permet d\'appeler une fonction C++ depuis un Blueprint', en:'The specifier that allows calling a C++ function from a Blueprint' }
    },
    {
      id:'a8_3', type:'bug', xp:25,
      instr:{
        fr:`Ce code Unreal a un problème : la variable Health n'apparaît pas dans l'éditeur. Pourquoi ?`,
        en:`This Unreal code has a problem: the Health variable doesn't appear in the editor. Why?`
      },
      bugCode:`<span class="mac">UCLASS</span>()
<span class="kw2">class</span> <span class="ty">APlayer</span> : <span class="kw2">public</span> <span class="ty">AActor</span>
{
    <span class="mac">GENERATED_BODY</span>()
<span class="kw2">private</span>:
    <span class="mac">UPROPERTY</span>(<span class="bug-line">BlueprintReadWrite</span>)
    <span class="kw2">int32</span> Health = <span class="num">100</span>;
};`,
      explanation:{
        fr:`UPROPERTY(BlueprintReadWrite) permet l'accès en Blueprint, mais ne rend pas la variable visible dans l'éditeur. Pour la voir dans le panneau Details, il faut EditAnywhere ou EditDefaultsOnly. De plus, BlueprintReadWrite sur une variable private nécessite meta=(AllowPrivateAccess="true") — sans ça, erreur de compilation.`,
        en:`UPROPERTY(BlueprintReadWrite) allows Blueprint access, but doesn't make the variable visible in the editor. To see it in the Details panel, you need EditAnywhere or EditDefaultsOnly. Also, BlueprintReadWrite on a private variable requires meta=(AllowPrivateAccess="true") — without it, compilation error.`
      }
    },
    {
      id:'a8_4', type:'engine', xp:40,
      label:{ fr:'Dans Unreal', en:'In Unreal' },
      task:{
        fr:`1. Crée un Actor C++ avec au moins trois variables membres (int32, float, FString). 2. Ajoute UPROPERTY(EditAnywhere, Category="Test") à chacune. 3. Compile et glisse l'Actor dans la scène. 4. Dans le panneau Details, vérifie que tes trois variables apparaissent et que tu peux les modifier. 5. Modifie une valeur et joue la scène — est-ce que la valeur modifiée est bien celle utilisée ?`,
        en:`1. Create a C++ Actor with at least three member variables (int32, float, FString). 2. Add UPROPERTY(EditAnywhere, Category="Test") to each. 3. Compile and drag the Actor into the scene. 4. In the Details panel, verify your three variables appear and can be edited. 5. Modify a value and play the scene — is the modified value the one being used?`
      },
      note:{
        fr:`C'est ton premier Actor C++ fonctionnel avec des propriétés éditables dans Unreal !`,
        en:`This is your first functional C++ Actor with editable properties in Unreal!`
      }
    },
    {
      id:'a8_5', type:'reflect', xp:10,
      prompt:{
        fr:`UPROPERTY() et UFUNCTION() permettent la communication entre le code C++ et les Blueprints. Dans un jeu développé en équipe avec des game designers (Blueprints) et des programmeurs (C++), comment organiserais-tu cette séparation pour une mécanique de combat ?`,
        en:`UPROPERTY() and UFUNCTION() enable communication between C++ code and Blueprints. In a game developed by a team with game designers (Blueprints) and programmers (C++), how would you organize this separation for a combat mechanic?`
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
