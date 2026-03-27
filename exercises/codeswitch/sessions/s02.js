'use strict';
// Session 02 — Fonctions & Méthodes

const SESSION = {
  id:        's02',
  num:       2,
  prev:      1,
  next:      3,
  xp:        90,
  blocName:  { fr:'Fondations', en:'Foundations' },
  blocColor: '#685ef7',
  title:     { fr:'Fonctions & Méthodes', en:'Functions & Methods' },
  sub:       { fr:'Même logique, syntaxe différente', en:'Same logic, different syntax' },

  tutor: {
    concept: {
      fr:`En C#, toutes les fonctions sont des méthodes — elles appartiennent à une classe. En C++, une fonction peut exister en dehors d'une classe (fonction libre), mais dans Unreal on travaille surtout avec des méthodes. La syntaxe de déclaration diffère, et le détail qui surprend le plus — la séparation déclaration/implémentation — on l'effleure ici et on l'approfondira en S05.`,
      en:`In C#, all functions are methods — they belong to a class. In C++, a function can exist outside a class (free function), but in Unreal we mostly work with methods. The declaration syntax differs, and the most surprising detail — the declaration/implementation split — we touch it here and deepen it in S05.`
    },
    demoSteps: [
      {
        label: { fr:'Écris la même fonction dans les deux', en:'Write the same function in both' },
        fr:`Écris une fonction CalculateDamage(int base, float multiplier) dans un script Unity et dans un Actor Unreal. Tape en direct. Laisse l'étudiant·e voir que la structure est presque identique : type de retour, nom, paramètres, corps. Différence principale : noms en PascalCase dans Unreal, et le type de retour s'écrit sans modificateur d'accès (public vient dans le header, pas ici).`,
        en:`Write a CalculateDamage(int base, float multiplier) function in a Unity script and in an Unreal Actor. Type live. Let the student see the structure is almost identical: return type, name, parameters, body. Main difference: PascalCase names in Unreal, and the return type is written without an access modifier (public goes in the header, not here).`
      },
      {
        label: { fr:'static_cast vs (int)', en:'static_cast vs (int)' },
        fr:`Montre le cast de float vers int32 dans les deux langages. En C# : (int)value. En C++ : static_cast<int32>(value). Explique pourquoi C++ moderne préfère static_cast : c'est explicite, le compilateur peut vérifier la validité. Le cast C-style (int) compile mais est déconseillé.`,
        en:`Show the float to int32 cast in both languages. In C#: (int)value. In C++: static_cast<int32>(value). Explain why modern C++ prefers static_cast: it's explicit, the compiler can verify validity. C-style cast (int) compiles but is discouraged.`
      },
      {
        label: { fr:'const après la méthode', en:'const after the method' },
        fr:`Montre qu'en C++, on peut mettre const APRÈS la signature d'une méthode : int32 GetHealth() const. Ça garantit que la méthode ne modifie pas l'état de l'objet. En C#, ce concept n'existe pas directement. Analogie : c'est une promesse écrite dans le code — "cette méthode ne modifie rien".`,
        en:`Show that in C++, you can put const AFTER a method signature: int32 GetHealth() const. This guarantees the method doesn't modify the object's state. In C#, this concept doesn't exist directly. Analogy: it's a written promise in the code — "this method modifies nothing".`
      },
      {
        label: { fr:'Void et valeurs de retour', en:'Void and return values' },
        fr:`Montre qu'une fonction void en C++ est identique à C# : pas de return (ou return; seul). Puis montre une fonction qui retourne bool et une qui retourne FString. Insiste : si une fonction déclare un type de retour non-void, elle DOIT retourner une valeur sur tous les chemins d'exécution — le compilateur C++ ne permet pas de "chemin sans return".`,
        en:`Show that a void function in C++ is identical to C#: no return (or bare return;). Then show a function returning bool and one returning FString. Stress: if a function declares a non-void return type, it MUST return a value on every execution path — the C++ compiler does not allow a "path without return".`
      },
    ],
    discussion: [
      {
        fr:`En Unity, est-ce que tu as déjà créé des fonctions utilitaires que tu appelais depuis plusieurs scripts ? Comment tu les organisais ?`,
        en:`In Unity, have you ever created utility functions called from multiple scripts? How did you organize them?`
      },
      {
        fr:`Que se passe-t-il si tu oublies le return dans une fonction qui retourne int en C# ? Et en C++ ?`,
        en:`What happens if you forget the return in a function that returns int in C#? And in C++?`
      },
    ],
    deep: {
      fr:`<p><strong>Surcharge de fonctions (overloading).</strong> En C++ comme en C#, tu peux avoir plusieurs fonctions avec le même nom mais des paramètres différents. C++ est encore plus flexible : il peut différencier par le qualificateur const de la méthode. Cela permet d'avoir une version "lecture seule" et une version "modifiable" d'une même fonction.</p>
<p>Exemple : <code>int32 GetScore();</code> et <code>int32 GetScore() const;</code> peuvent coexister — la version const est appelée sur des objets constants, l'autre sur des objets normaux. En pratique dans Unreal, tu croiseras souvent ce pattern dans les Getters.</p>`,
      en:`<p><strong>Function overloading.</strong> In C++ as in C#, you can have multiple functions with the same name but different parameters. C++ is even more flexible: it can also differentiate by the method's const qualifier. This allows a "read-only" and a "modifiable" version of the same function.</p>
<p>Example: <code>int32 GetScore();</code> and <code>int32 GetScore() const;</code> can coexist — the const version is called on constant objects, the other on normal objects. In practice in Unreal, you'll often encounter this pattern in Getters.</p>`
    }
  },

  compare: {
    cs:`<span class="cm">// C# — méthodes dans une classe</span>
<span class="kw">public int</span> <span class="fn">CalcDamage</span>(<span class="kw">int</span> b, <span class="kw">float</span> m)
{
    <span class="kw">return</span> (<span class="kw">int</span>)(b * m);
}
<span class="kw">public void</span> <span class="fn">Die</span>() { isAlive = <span class="kw">false</span>; }
<span class="kw">public int</span> <span class="fn">GetHealth</span>() { <span class="kw">return</span> health; }`,
    cpp:`<span class="cm">// C++ — méthodes dans un Actor Unreal</span>
<span class="kw2">int32</span> <span class="fn2">CalcDamage</span>(<span class="kw2">int32</span> B, <span class="kw2">float</span> M)
{
    <span class="kw2">return</span> <span class="kw2">static_cast</span>&lt;<span class="kw2">int32</span>&gt;(B * M);
}
<span class="kw2">void</span> <span class="fn2">Die</span>() { bIsAlive = <span class="kw2">false</span>; }
<span class="kw2">int32</span> <span class="fn2">GetHealth</span>() <span class="kw2">const</span> { <span class="kw2">return</span> Health; }`
  },

  activities: [
    {
      id:'a2_1', type:'quiz', xp:15,
      q:{
        fr:`Pourquoi utiliser static_cast<int32>() plutôt que (int) en C++ moderne ?`,
        en:`Why use static_cast<int32>() instead of (int) in modern C++?`
      },
      choices:[
        { t:{ fr:`C'est plus rapide à l'exécution`, en:`It's faster at runtime` }, c:false,
          fb:{ fr:`Les deux sont résolus à la compilation — même coût à l'exécution.`, en:`Both are resolved at compile time — same runtime cost.` } },
        { t:{ fr:`C'est obligatoire en C++`, en:`It's mandatory in C++` }, c:false,
          fb:{ fr:`Le cast C-style (int) est valide en C++, mais déconseillé.`, en:`C-style cast (int) is valid in C++, but discouraged.` } },
        { t:{ fr:`C'est explicite et vérifiable par le compilateur`, en:`It's explicit and verifiable by the compiler` }, c:true,
          fb:{ fr:`Exact. static_cast indique clairement l'intention et le compilateur peut vérifier que la conversion est légale.`, en:`Correct. static_cast clearly states intent and the compiler can verify the conversion is legal.` } },
        { t:{ fr:`Ça évite les problèmes de mémoire`, en:`It avoids memory issues` }, c:false,
          fb:{ fr:`static_cast ne concerne pas la gestion mémoire.`, en:`static_cast is not about memory management.` } },
      ]
    },
    {
      id:'a2_2', type:'fill', xp:20,
      instr:{
        fr:`Complète la signature d'une méthode Unreal qui retourne des points de vie et garantit de ne pas modifier l'objet :`,
        en:`Complete the signature of an Unreal method that returns health points and guarantees not to modify the object:`
      },
      template:{ fr:'int32 GetHealth() ______;', en:'int32 GetHealth() ______;' },
      answer:'const',
      hint:{ fr:'Le qualificateur qui garantit que la méthode ne modifie pas l\'objet', en:'The qualifier that guarantees the method does not modify the object' }
    },
    {
      id:'a2_3', type:'bug', xp:25,
      instr:{
        fr:`Cette fonction C++ causera une erreur de compilation. Identifie le problème.`,
        en:`This C++ function will cause a compilation error. Identify the problem.`
      },
      bugCode:`<span class="kw2">int32</span> <span class="fn2">GetScore</span>() <span class="kw2">const</span>
{
    <span class="kw2">int32</span> Total = BaseScore + BonusScore;
    <span class="cm">// calcul terminé...</span>
    <span class="bug-line"><span class="cm">// oubli du return</span></span>
}`,
      explanation:{
        fr:`Une fonction déclarée avec un type de retour int32 DOIT retourner une valeur. L'absence de "return Total;" est une erreur de compilation en C++. En C#, le compilateur t'aurait aussi signalé l'erreur — mais C++ ne tolère aucun chemin d'exécution sans return.`,
        en:`A function declared with return type int32 MUST return a value. The missing "return Total;" is a compilation error in C++. C# would have caught it too — but C++ tolerates no execution path without a return.`
      }
    },
    {
      id:'a2_4', type:'engine', xp:25,
      label:{ fr:'Dans Unity', en:'In Unity' },
      task:{
        fr:`Ouvre un de tes anciens projets Unity. Trouve une fonction qui retourne une valeur (pas void). Réécris sa signature en C++ dans un fichier texte : remplace le type de retour C# par l'équivalent Unreal, mets le nom en PascalCase, et ajoute const si elle ne modifie rien.`,
        en:`Open one of your old Unity projects. Find a function that returns a value (not void). Rewrite its signature in C++ in a text file: replace the C# return type with the Unreal equivalent, put the name in PascalCase, and add const if it doesn't modify anything.`
      },
      note:{
        fr:`L'objectif est la traduction mentale — pas que ça compile.`,
        en:`The goal is the mental translation — not that it compiles.`
      }
    },
    {
      id:'a2_5', type:'reflect', xp:10,
      prompt:{
        fr:`En C#, les méthodes ont un modificateur d'accès (public, private…). En C++, c'est pareil — mais si tu oublies de le spécifier, le défaut dans une classe (class) est private. Dans tes scripts Unity, est-ce que tu faisais attention à mettre private sur les méthodes internes ? Pourquoi est-ce que ça compte ?`,
        en:`In C#, methods have an access modifier (public, private…). In C++ it's the same — but if you forget to specify one, the default in a class is private. In your Unity scripts, did you pay attention to marking internal methods as private? Why does it matter?`
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
