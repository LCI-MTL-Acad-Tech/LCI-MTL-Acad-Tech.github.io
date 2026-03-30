'use strict';
// Session 03 — Conditions & Boucles
// IDE arc S03: still snippets, conditionals and loops — one key trap (switch fallthrough)

const SESSION = {
  id:'s03', num:3, prev:2, next:4, xp:90,
  blocName:{ fr:'Fondations', en:'Foundations' },
  blocColor:'#685ef7',
  title:{ fr:'Conditions & Boucles', en:'Conditionals & Loops' },
  sub:{ fr:'if, for, while — presque identiques, mais un piège', en:'if, for, while — almost identical, but one trap' },

  tutor:{
    concept:{
      fr:`if, else, for, while, switch — syntaxe quasi identique en C# et C++. Les accolades, les parenthèses, tout pareil. Il y a un seul piège significatif à connaître : le switch sans break laisse l'exécution "tomber" dans le case suivant (fallthrough). En C# c'est une erreur de compilation. En C++ c'est légal — et parfois intentionnel.`,
      en:`if, else, for, while, switch — nearly identical syntax in C# and C++. Braces, parentheses, all the same. There is one significant trap: a switch without break lets execution "fall through" to the next case. In C# it's a compilation error. In C++ it's legal — and sometimes intentional.`
    },
    deep:{
      fr:`<p><strong>Le fallthrough intentionnel.</strong> Sans break, l'exécution continue dans le case suivant. C'est souvent un bug, mais parfois utile pour grouper des cases :</p>
<pre style="background:#0d1f27;padding:1rem;border-radius:4px;font-size:1.25rem;line-height:1.7;color:#e0e8ef"><span class="kw2">switch</span>(key) {
    <span class="kw2">case</span> Key_W:
    <span class="kw2">case</span> Key_Up:   <span class="cm">// fallthrough intentionnel</span>
        MoveForward(); <span class="kw2">break</span>;
}</pre>
<p>En C++17, annoter les fallthroughs intentionnels avec <code>[[fallthrough]];</code> supprime le warning du compilateur et documente l'intention.</p>`,
      en:`<p><strong>Intentional fallthrough.</strong> Without break, execution continues into the next case. Often a bug, but sometimes useful for grouping cases:</p>
<pre style="background:#0d1f27;padding:1rem;border-radius:4px;font-size:1.25rem;line-height:1.7;color:#e0e8ef"><span class="kw2">switch</span>(key) {
    <span class="kw2">case</span> Key_W:
    <span class="kw2">case</span> Key_Up:   <span class="cm">// intentional fallthrough</span>
        MoveForward(); <span class="kw2">break</span>;
}</pre>
<p>In C++17, annotate intentional fallthroughs with <code>[[fallthrough]];</code> to suppress compiler warnings and document intent.</p>`
    }
  },

  ide:{
    demoSteps:[
      {
        label:{ fr:'if/else — cherche les différences', en:'if/else — find the differences' },
        fr:`Écris le même if/else dans un fichier .cpp et dans un fichier C# fictif côte à côte. Demande à l'étudiant·e de trouver les différences. Réponse : il n'y en a presque pas. C'est intentionnel pour dédramatiser.`,
        en:`Write the same if/else in a .cpp file and a fictional C# file side by side. Ask the student to find the differences. Answer: there are almost none. This is intentional to de-dramatize.`
      },
      {
        label:{ fr:'range-based for — le foreach C++', en:'Range-based for — the C++ foreach' },
        fr:`Montre la syntaxe range-based for avec un tableau C-style d'abord : int arr[] = {1,2,3}; for(int x : arr) { cout << x; }. C'est le foreach C++. Le & évite les copies : for(const auto& x : arr). Insiste sur const auto& — bonne pratique pour les types non-triviaux.`,
        en:`Show range-based for syntax with a C-style array first: int arr[] = {1,2,3}; for(int x : arr) { cout << x; }. This is C++ foreach. & avoids copies: for(const auto& x : arr). Stress const auto& — good practice for non-trivial types.`
      },
      {
        label:{ fr:'switch — le piège du fallthrough', en:'switch — the fallthrough trap' },
        fr:`Compile et exécute ce code : switch(2) { case 1: cout<<"un"; case 2: cout<<"deux"; case 3: cout<<"trois"; }. Sortie : "deuxtois" — le fallthrough ! En C# ce code ne compilerait pas. Montre la correction avec break; après chaque case.`,
        en:`Compile and run: switch(2) { case 1: cout<<"one"; case 2: cout<<"two"; case 3: cout<<"three"; }. Output: "twothree" — the fallthrough! In C# this wouldn't compile. Show the fix with break; after each case.`
      },
    ],
    discussion:[
      { fr:`Le fallthrough du switch est-il un défaut de conception du langage, ou une fonctionnalité ? Donne un exemple où c'est utile.`, en:`Is switch fallthrough a language design flaw, or a feature? Give an example where it's useful.` },
    ],
    compare:{
      std:`<span class="cm">// C++ standard</span>
<span class="kw2">for</span>(<span class="kw2">int</span> i = <span class="num">0</span>; i &lt; <span class="num">5</span>; i++) { <span class="cm">/* ... */</span> }

<span class="cm">// range-based for (foreach)</span>
<span class="kw2">int</span> arr[] = {<span class="num">1</span>,<span class="num">2</span>,<span class="num">3</span>};
<span class="kw2">for</span>(<span class="kw2">const auto</span>&amp; x : arr)
    std::cout &lt;&lt; x;

<span class="cm">// switch — break REQUIS</span>
<span class="kw2">switch</span>(state) {
    <span class="kw2">case</span> <span class="num">1</span>: Jump(); <span class="kw2">break</span>;
    <span class="kw2">case</span> <span class="num">2</span>: Shoot(); <span class="kw2">break</span>;
}`,
      unreal:`<span class="cm">// C++ Unreal — même syntaxe</span>
<span class="kw2">for</span>(<span class="kw2">int32</span> i = <span class="num">0</span>; i &lt; <span class="num">5</span>; i++) { <span class="cm">/* ... */</span> }

<span class="cm">// sur un TArray</span>
<span class="ty">TArray</span>&lt;<span class="kw2">int32</span>&gt; Scores;
<span class="kw2">for</span>(<span class="kw2">const auto</span>&amp; S : Scores)
    <span class="mac">UE_LOG</span>(LogTemp,Display,<span class="mac">TEXT</span>(<span class="str">"%d"</span>),S);

<span class="kw2">switch</span>(EnemyState) {
    <span class="kw2">case</span> <span class="num">1</span>: Chase(); <span class="kw2">break</span>;
    <span class="kw2">case</span> <span class="num">2</span>: Attack(); <span class="kw2">break</span>;
}`
    },
    activities:[
      {
        id:'i03_1', type:'predict', xp:15,
        code:`#include &lt;iostream&gt;
int main() {
    int x = 2;
    switch(x) {
        case 1: std::cout &lt;&lt; "un ";
        case 2: std::cout &lt;&lt; "deux ";
        case 3: std::cout &lt;&lt; "trois ";
    }
    return 0;
}`,
        question:{ fr:`x vaut 2. Quelle est la sortie — et pourquoi ?`, en:`x is 2. What is the output — and why?` },
        output:`deux trois `,
        explanation:{ fr:`L'exécution commence au case 2 et tombe dans case 3 (fallthrough) car il n'y a pas de break. En C# ce code ne compilerait pas. En C++, il compile silencieusement et produit ce résultat.`, en:`Execution starts at case 2 and falls through to case 3 since there's no break. In C# this wouldn't compile. In C++, it compiles silently and produces this result.` }
      },
      {
        id:'i03_2', type:'cpp', xp:25,
        instr:{ fr:`Écris un programme qui itère sur un tableau de 5 entiers {10,3,7,1,9} avec un range-based for et affiche uniquement les valeurs supérieures à 5.`, en:`Write a program that iterates over an array of 5 integers {10,3,7,1,9} with a range-based for and prints only values greater than 5.` },
        stub:`#include &lt;iostream&gt;
int main() {
    int nums[] = {10, 3, 7, 1, 9};
    // range-based for + if ici / here
    return 0;
}`,
        hint:{ fr:`for(const auto& n : nums) { if(n > 5) ... }`, en:`for(const auto& n : nums) { if(n > 5) ... }` },
        solution:{
          fr:`<pre style="font-family:var(--mono);font-size:1.3rem;line-height:1.8;color:#e0e8ef">#include &lt;iostream&gt;
int main() {
    int nums[] = {10, 3, 7, 1, 9};
    for(const auto& n : nums) {
        if(n > 5)
            std::cout &lt;&lt; n &lt;&lt; std::endl;
    }
    return 0;
}</pre><p style="margin-top:.8rem;font-size:1.4rem;color:var(--ch2)">Sortie : <code>10</code>, <code>7</code>, <code>9</code></p>`,
          en:`<pre style="font-family:var(--mono);font-size:1.3rem;line-height:1.8;color:#e0e8ef">#include &lt;iostream&gt;
int main() {
    int nums[] = {10, 3, 7, 1, 9};
    for(const auto& n : nums) {
        if(n > 5)
            std::cout &lt;&lt; n &lt;&lt; std::endl;
    }
    return 0;
}</pre><p style="margin-top:.8rem;font-size:1.4rem;color:var(--ch2)">Output: <code>10</code>, <code>7</code>, <code>9</code></p>`
        }
      },
      {
        id:'i03_3', type:'bug', xp:20,
        instr:{ fr:`Ce switch a un bug de fallthrough. Quel case est problématique et pourquoi ?`, en:`This switch has a fallthrough bug. Which case is problematic and why?` },
        bugCode:`<span class="kw2">switch</span>(EnemyState) {
    <span class="kw2">case</span> <span class="num">0</span>: Idle();  <span class="kw2">break</span>;
    <span class="kw2">case</span> <span class="num">1</span>: <span class="bug-line"><span class="fn2">Chase</span>();</span>
    <span class="kw2">case</span> <span class="num">2</span>: Attack(); <span class="kw2">break</span>;
    <span class="kw2">default</span>: Die(); <span class="kw2">break</span>;
}`,
        explanation:{ fr:`Le case 1 (Chase) n'a pas de break. Quand EnemyState vaut 1, Chase() ET Attack() s'exécutent. Ajouter break; après Chase() corrige le problème. Ce type de bug est silencieux en C++ — le code compile sans warning par défaut.`, en:`Case 1 (Chase) has no break. When EnemyState is 1, both Chase() and Attack() execute. Adding break; after Chase() fixes it. This type of bug is silent in C++ — the code compiles without warning by default.` }
      },
      {
        id:'i03_4', type:'fill', xp:15,
        instr:{ fr:`Complète ce range-based for pour éviter les copies (bonne pratique) :`, en:`Complete this range-based for to avoid copies (best practice):` },
        template:{ fr:'for(const ______& item : items)', en:'for(const ______& item : items)' },
        answer:'auto',
        hint:{ fr:`Déduction de type — le compilateur infère le type de chaque élément`, en:`Type deduction — the compiler infers each element's type` }
      },
    ],
  },

  engine:{
    demoSteps:[
      {
        label:{ fr:'if/else dans Unreal — identique', en:'if/else in Unreal — identical' },
        fr:`Montre un if/else dans BeginPlay() d'un Actor. Compare avec Unity. Les deux sont identiques. L'objectif est de montrer la continuité — pas de surprise ici.`,
        en:`Show an if/else in an Actor's BeginPlay(). Compare with Unity. Both are identical. The goal is to show continuity — no surprises here.`
      },
      {
        label:{ fr:'range-based for sur un TArray', en:'Range-based for on a TArray' },
        fr:`Montre for(const auto& Actor : AllActors). C'est le foreach Unity (foreach(var a in allActors)) directement traduit. Insiste sur const auto& pour éviter de copier chaque Actor — en C++, les copies sont explicites et coûteuses.`,
        en:`Show for(const auto& Actor : AllActors). It's Unity's foreach (foreach(var a in allActors)) directly translated. Stress const auto& to avoid copying each Actor — in C++, copies are explicit and costly.`
      },
      {
        label:{ fr:'switch et les états d\'ennemi', en:'switch and enemy states' },
        fr:`Montre un switch sur un EnemyState (enum class). Compile intentionnellement sans break dans un case et montre la sortie surprise. Puis corrige. Insiste : quand on travaille avec des états de jeu en switch, oublier un break est une source de bugs très difficile à diagnostiquer.`,
        en:`Show a switch on an EnemyState (enum class). Intentionally compile without break in one case and show the surprise output. Then fix it. Stress: when working with game states in switch, forgetting a break is a very hard-to-diagnose bug source.`
      },
    ],
    discussion:[
      { fr:`Dans tes scripts Unity Update(), est-ce que tu utilisais des if/else chaînés ou des switch ? Lequel est plus lisible pour gérer des états de jeu ? Pourquoi ?`, en:`In your Unity Update() scripts, did you use chained if/else or switch? Which is more readable for managing game states? Why?` },
    ],
    compare:{
      cs:`<span class="cm">// C# foreach sur List</span>
<span class="kw">foreach</span>(<span class="kw">var</span> actor <span class="kw">in</span> allActors)
    actor.<span class="fn">SetActive</span>(<span class="kw">false</span>);

<span class="cm">// switch (fallthrough = erreur)</span>
<span class="kw">switch</span>(state) {
    <span class="kw">case</span> <span class="num">1</span>: Jump(); <span class="kw">break</span>;
    <span class="kw">case</span> <span class="num">2</span>: Shoot(); <span class="kw">break</span>;
}`,
      cpp:`<span class="cm">// C++ foreach sur TArray</span>
<span class="kw2">for</span>(<span class="kw2">const auto</span>&amp; Actor : AllActors)
    Actor-&gt;<span class="fn2">SetActorHiddenInGame</span>(<span class="kw2">true</span>);

<span class="cm">// switch (break OBLIGATOIRE)</span>
<span class="kw2">switch</span>(State) {
    <span class="kw2">case</span> <span class="num">1</span>: Jump(); <span class="kw2">break</span>;
    <span class="kw2">case</span> <span class="num">2</span>: Shoot(); <span class="kw2">break</span>;
}`
    },
    activities:[
      {
        id:'e03_1', type:'quiz', xp:15,
        q:{ fr:`Que se passe-t-il en C++ si tu oublies un break entre deux cases d'un switch ?`, en:`What happens in C++ if you forget a break between two switch cases?` },
        choices:[
          { t:{ fr:`Erreur de compilation`, en:`Compilation error` }, c:false, fb:{ fr:`C'est le comportement en C#. En C++, le fallthrough est légal et silencieux.`, en:`That's C#'s behavior. In C++, fallthrough is legal and silent.` } },
          { t:{ fr:`Warning de compilation systématique`, en:`Systematic compilation warning` }, c:false, fb:{ fr:`Certains compilateurs avertissent avec -Wimplicit-fallthrough, mais ce n'est pas garanti par défaut.`, en:`Some compilers warn with -Wimplicit-fallthrough, but it's not guaranteed by default.` } },
          { t:{ fr:`L'exécution continue dans le case suivant (fallthrough)`, en:`Execution continues into the next case (fallthrough)` }, c:true, fb:{ fr:`Correct. Le code compile et tourne, exécutant les deux cases — rarement ce qu'on veut.`, en:`Correct. The code compiles and runs, executing both cases — rarely what you want.` } },
          { t:{ fr:`Le programme plante à l'exécution`, en:`The program crashes at runtime` }, c:false, fb:{ fr:`Pas de crash — le code s'exécute, avec un comportement probablement inattendu.`, en:`No crash — the code runs, just with probably unexpected behavior.` } },
        ]
      },
      {
        id:'e03_2', type:'fill', xp:20,
        instr:{ fr:`Convertis ce foreach C# en range-based for C++ pour un TArray<AActor*> nommé Enemies :`, en:`Convert this C# foreach to a C++ range-based for on a TArray<AActor*> named Enemies:` },
        template:{ fr:'for(______ Enemy : Enemies)', en:'for(______ Enemy : Enemies)' },
        answer:'auto&',
        hint:{ fr:`Déduction de type + référence — évite de copier chaque Actor`, en:`Type deduction + reference — avoids copying each Actor` }
      },
      {
        id:'e03_3', type:'bug', xp:25,
        instr:{ fr:`Ce switch Unreal exécutera Idle() et Chase() quand State vaut 0. Pourquoi ?`, en:`This Unreal switch will execute both Idle() and Chase() when State is 0. Why?` },
        bugCode:`<span class="kw2">switch</span>(State) {
    <span class="kw2">case</span> <span class="num">0</span>: <span class="bug-line"><span class="fn2">Idle</span>();</span>
    <span class="kw2">case</span> <span class="num">1</span>: Chase(); <span class="kw2">break</span>;
    <span class="kw2">case</span> <span class="num">2</span>: Attack(); <span class="kw2">break</span>;
}`,
        explanation:{ fr:`Le case 0 (Idle) n'a pas de break. L'exécution tombe dans case 1 (Chase). Résultat : l'ennemi est à la fois en idle et en train de poursuivre — comportement impossible à comprendre sans connaître le fallthrough. Correction : ajouter break; après Idle().`, en:`Case 0 (Idle) has no break. Execution falls through to case 1 (Chase). Result: the enemy is both idling and chasing — impossible to understand without knowing about fallthrough. Fix: add break; after Idle().` }
      },
      {
        id:'e03_4', type:'engine', xp:30,
        label:{ fr:'Dans Unreal', en:'In Unreal' },
        task:{ fr:`Dans un Actor C++, crée une enum class EEnemyState { Idle, Chase, Attack }; et un membre EEnemyState State = EEnemyState::Idle;. Dans Tick(), ajoute un switch sur State avec les trois cases (chacun appelle UE_LOG pour afficher l'état). Teste dans l'éditeur en changeant State dans le panneau Details.`, en:`In a C++ Actor, create an enum class EEnemyState { Idle, Chase, Attack }; and a member EEnemyState State = EEnemyState::Idle;. In Tick(), add a switch on State with all three cases (each calls UE_LOG to display the state). Test in the editor by changing State in the Details panel.` },
        note:{ fr:`Ajoute UPROPERTY(EditAnywhere) sur State pour pouvoir le modifier dans l'éditeur.`, en:`Add UPROPERTY(EditAnywhere) on State to be able to modify it in the editor.` }
      },
    ],
  },
};
document.addEventListener('DOMContentLoaded',()=>{});
