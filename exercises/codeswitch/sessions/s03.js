'use strict';
// Session 03 — Conditions & Boucles

const SESSION = {
  id:        's03',
  num:       3,
  prev:      2,
  next:      4,
  xp:        90,
  blocName:  { fr:'Fondations', en:'Foundations' },
  blocColor: '#685ef7',
  title:     { fr:'Conditions & Boucles', en:'Conditionals & Loops' },
  sub:       { fr:'if, for, while — presque identiques, mais un piège', en:'if, for, while — almost identical, but one trap' },

  tutor: {
    concept: {
      fr:`La bonne nouvelle : if, else, for, while, switch — syntaxe quasi identique en C# et C++. Les accolades, les parenthèses, tout est pareil. Il y a un seul piège significatif à connaître : le comportement du switch sans break. Cette session est intentionnellement courte — pour montrer que la continuité entre les deux langages est réelle.`,
      en:`Good news: if, else, for, while, switch — syntax is nearly identical in C# and C++. Braces, parentheses, everything the same. There is one significant trap to know: switch behavior without break. This session is intentionally short — to show that continuity between the two languages is real.`
    },
    demoSteps: [
      {
        label: { fr:'if / else — cherche les différences', en:'if / else — find the differences' },
        fr:`Écris le même if/else dans les deux langages. Demande à l'étudiant·e de trouver les différences. Réponse : il n'y en a presque pas. C'est intentionnel pour dédramatiser la transition. La seule nuance : en C++, les booléens ont les valeurs littérales true et false (minuscule), identiques à C#.`,
        en:`Write the same if/else in both languages. Ask the student to find the differences. Answer: there are almost none. That's intentional to de-dramatize the transition. One nuance: in C++, booleans have literal values true and false (lowercase), identical to C#.`
      },
      {
        label: { fr:'for range-based — le foreach C++', en:'Range-based for — C++ foreach' },
        fr:`Montre le range-based for de C++ : for(auto& item : Items). C'est l'équivalent exact du foreach C#. La syntaxe change mais le concept est identique. Montre sur un TArray<int32> d'Unreal. Insiste : le & après auto évite une copie de chaque élément — c'est la bonne pratique.`,
        en:`Show C++'s range-based for: for(auto& item : Items). It's the exact equivalent of C# foreach. Syntax changes but the concept is identical. Show on an Unreal TArray<int32>. Stress: the & after auto avoids copying each element — that's best practice.`
      },
      {
        label: { fr:'switch — le piège du fallthrough', en:'switch — the fallthrough trap' },
        fr:`Le switch en C++ a un comportement différent de C# : sans break, l'exécution "tombe" dans le case suivant (fallthrough). En C#, ça génère une erreur de compilation. En C++, ça compile mais fait probablement quelque chose d'indésirable. Montre l'exemple avec un état d'ennemi : case Chase sans break exécute aussi Attack.`,
        en:`The switch in C++ has different behavior from C#: without break, execution "falls through" to the next case. In C#, that's a compilation error. In C++, it compiles but probably does something undesirable. Show the example with an enemy state: case Chase without break also executes Attack.`
      },
    ],
    discussion: [
      {
        fr:`As-tu déjà eu un bug dans un switch en C# parce que tu avais oublié un break ? Que se serait-il passé si ce code avait tourné en C++ ?`,
        en:`Have you ever had a switch bug in C# from a missing break? What would have happened if that code had run in C++?`
      },
      {
        fr:`Dans tes scripts Unity Update(), est-ce que tu itères souvent sur des listes ? Avec for, foreach, ou LINQ ?`,
        en:`In your Unity Update() scripts, do you often iterate over lists? With for, foreach, or LINQ?`
      },
    ],
    deep: {
      fr:`<p><strong>Le fallthrough intentionnel.</strong> Le fallthrough du switch C++ n'est pas toujours un bug — il a des utilisations légitimes. Exemple classique : grouper plusieurs cases qui partagent le même code.</p>
<pre style="background:#0d1f27;padding:1rem;border-radius:4px;font-size:1.25rem;line-height:1.7;color:#e0e8ef"><span class="kw2">switch</span>(KeyPressed) {
    <span class="kw2">case</span> Key_W:
    <span class="kw2">case</span> Key_Up:    <span class="cm">// fallthrough intentionnel</span>
        <span class="fn2">MoveForward</span>(); <span class="kw2">break</span>;
}</pre>
<p>W et flèche haut font la même chose — un seul bloc de code, deux entrées. En C# tu devais dupliquer ou refactoriser. En C++, c'est idiomatique.</p>`,
      en:`<p><strong>Intentional fallthrough.</strong> C++ switch fallthrough isn't always a bug — it has legitimate uses. Classic example: grouping multiple cases that share the same code.</p>
<pre style="background:#0d1f27;padding:1rem;border-radius:4px;font-size:1.25rem;line-height:1.7;color:#e0e8ef"><span class="kw2">switch</span>(KeyPressed) {
    <span class="kw2">case</span> Key_W:
    <span class="kw2">case</span> Key_Up:    <span class="cm">// intentional fallthrough</span>
        <span class="fn2">MoveForward</span>(); <span class="kw2">break</span>;
}</pre>
<p>W and up arrow do the same thing — one block of code, two entries. In C# you had to duplicate or refactor. In C++, it's idiomatic.</p>`
    }
  },

  compare: {
    cs:`<span class="cm">// C# foreach</span>
<span class="kw">foreach</span>(<span class="kw">int</span> item <span class="kw">in</span> items)
    DoSomething(item);

<span class="cm">// switch (fallthrough = erreur en C#)</span>
<span class="kw">switch</span>(state) {
    <span class="kw">case</span> <span class="num">1</span>: Jump(); <span class="kw">break</span>;
    <span class="kw">case</span> <span class="num">2</span>: Shoot(); <span class="kw">break</span>;
}`,
    cpp:`<span class="cm">// C++ range-based for</span>
<span class="kw2">for</span>(<span class="kw2">auto</span>&amp; Item : Items)
    DoSomething(Item);

<span class="cm">// switch (break REQUIS — silencieux sinon)</span>
<span class="kw2">switch</span>(State) {
    <span class="kw2">case</span> <span class="num">1</span>: Jump(); <span class="kw2">break</span>;
    <span class="kw2">case</span> <span class="num">2</span>: Shoot(); <span class="kw2">break</span>;
}`
  },

  activities: [
    {
      id:'a3_1', type:'quiz', xp:15,
      q:{
        fr:`Que se passe-t-il en C++ si tu oublies un break entre deux cases d'un switch ?`,
        en:`What happens in C++ if you forget a break between two switch cases?`
      },
      choices:[
        { t:{ fr:`Erreur de compilation`, en:`Compilation error` }, c:false,
          fb:{ fr:`En C#, oui. En C++, non — le fallthrough est silencieux et légal.`, en:`In C#, yes. In C++, no — fallthrough is silent and legal.` } },
        { t:{ fr:`Avertissement du compilateur`, en:`Compiler warning` }, c:false,
          fb:{ fr:`Certains compilateurs avertissent avec -Wimplicit-fallthrough, mais ce n'est pas garanti. On ne peut pas compter dessus.`, en:`Some compilers warn with -Wimplicit-fallthrough, but it's not guaranteed. You can't rely on it.` } },
        { t:{ fr:`L'exécution continue dans le case suivant (fallthrough)`, en:`Execution continues into the next case (fallthrough)` }, c:true,
          fb:{ fr:`Correct. Le code compile et tourne, mais exécute le code des deux cases — rarement ce qu'on veut.`, en:`Correct. The code compiles and runs, but executes the code of both cases — rarely what you want.` } },
        { t:{ fr:`Le programme plante`, en:`The program crashes` }, c:false,
          fb:{ fr:`Pas de crash — le code s'exécute, avec un comportement inattendu.`, en:`No crash — the code runs, just with unexpected behavior.` } },
      ]
    },
    {
      id:'a3_2', type:'fill', xp:20,
      instr:{
        fr:`Convertis ce foreach C# en range-based for C++ pour un TArray<int32> nommé Scores :`,
        en:`Convert this C# foreach to a C++ range-based for on a TArray<int32> named Scores:`
      },
      template:{ fr:'for(______ Score : Scores)', en:'for(______ Score : Scores)' },
      answer:'auto&',
      hint:{ fr:'Déduction de type + référence pour éviter les copies', en:'Type deduction + reference to avoid copies' }
    },
    {
      id:'a3_3', type:'bug', xp:25,
      instr:{
        fr:`Ce switch C++ a un bug de fallthrough. Quel case est problématique ?`,
        en:`This C++ switch has a fallthrough bug. Which case is problematic?`
      },
      bugCode:`<span class="kw2">switch</span>(EnemyState) {
    <span class="kw2">case</span> <span class="num">0</span>: Idle();  <span class="kw2">break</span>;
    <span class="kw2">case</span> <span class="num">1</span>: <span class="bug-line">Chase();</span>
    <span class="kw2">case</span> <span class="num">2</span>: Attack(); <span class="kw2">break</span>;
    <span class="kw2">default</span>: Die(); <span class="kw2">break</span>;
}`,
      explanation:{
        fr:`Le case 1 (Chase) n'a pas de break. Quand EnemyState vaut 1, le code exécutera Chase() ET Attack(). L'ennemi court ET attaque simultanément — bug classique. Ajouter "break;" après Chase() corrige le problème.`,
        en:`Case 1 (Chase) has no break. When EnemyState is 1, the code executes Chase() AND Attack(). The enemy chases AND attacks simultaneously — classic bug. Adding "break;" after Chase() fixes it.`
      }
    },
    {
      id:'a3_4', type:'engine', xp:30,
      label:{ fr:'Dans Unity', en:'In Unity' },
      task:{
        fr:`Dans un de tes projets Unity, trouve une fonction Update() ou FixedUpdate() qui contient une boucle ou un if. Copie-la dans un fichier texte et réécris-la en syntaxe C++. Attention particulière : si tu as un foreach, utilise le range-based for. Si tu as un switch, vérifie tous tes breaks.`,
        en:`In one of your Unity projects, find an Update() or FixedUpdate() function that contains a loop or if. Copy it into a text file and rewrite it in C++ syntax. Special attention: if you have a foreach, use range-based for. If you have a switch, check all your breaks.`
      },
      note:{
        fr:`L'objectif n'est pas que ça compile — c'est de pratiquer la traduction mentale.`,
        en:`The goal is not to make it compile — it's to practice the mental translation.`
      }
    },
    {
      id:'a3_5', type:'reflect', xp:10,
      prompt:{
        fr:`Le fallthrough du switch C++ est souvent considéré comme un défaut de conception du langage. Pourtant, il a des utilisations légitimes (grouper des cases). Donne un exemple de situation en programmation de jeu où le fallthrough pourrait être intentionnel et utile.`,
        en:`C++ switch fallthrough is often considered a language design flaw. Yet it has legitimate uses (grouping cases). Give an example of a game programming situation where fallthrough might be intentional and useful.`
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
