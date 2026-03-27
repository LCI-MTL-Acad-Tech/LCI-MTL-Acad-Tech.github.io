'use strict';
// Session 05 — Headers .h / .cpp

const SESSION = {
  id:        's05',
  num:       5,
  prev:      4,
  next:      6,
  xp:        100,
  blocName:  { fr:'Ce qui change vraiment', en:'What Really Changes' },
  blocColor: '#f2f537',
  title:     { fr:'Headers .h / .cpp', en:'Headers .h / .cpp' },
  sub:       { fr:'Pourquoi C++ sépare déclaration et implémentation', en:'Why C++ separates declaration from implementation' },

  tutor: {
    concept: {
      fr:`En C#, tout est dans un seul fichier .cs. En C++, on sépare en deux : le .h (header) déclare ce qui existe, le .cpp implémente ce que ça fait. C'est une particularité historique du C++ qui peut dérouter au début. Mais dans Unreal, cette structure est systématique — et une fois le pattern compris, c'est lisible et pratique.`,
      en:`In C#, everything is in one .cs file. In C++, we split into two: the .h (header) declares what exists, the .cpp implements what it does. This is a historical C++ quirk that can be disorienting at first. But in Unreal, this structure is systematic — and once the pattern is understood, it's readable and practical.`
    },
    demoSteps: [
      {
        label: { fr:'Crée un Actor Unreal et ouvre les deux fichiers', en:'Create an Unreal Actor and open both files' },
        fr:`Dans Unreal, crée un nouvel Actor C++ (Add New > C++ Class > Actor). Montre immédiatement les deux fichiers générés : MyActor.h et MyActor.cpp. Fais remarquer que les deux existent et sont liés. Ouvre-les côte à côte dans l'éditeur.`,
        en:`In Unreal, create a new C++ Actor (Add New > C++ Class > Actor). Immediately show the two generated files: MyActor.h and MyActor.cpp. Point out that both exist and are linked. Open them side by side in the editor.`
      },
      {
        label: { fr:'Le .h = table des matières', en:'.h = table of contents' },
        fr:`Le fichier .h déclare la classe, ses variables membres, et les signatures de méthodes — sans le corps. Analogie : c'est le menu d'un restaurant. Tu sais ce qui est disponible, pas encore comment c'est préparé. Montre #pragma once en haut — c'est le garde contre les inclusions multiples.`,
        en:`The .h file declares the class, its member variables, and method signatures — without the body. Analogy: it's a restaurant menu. You know what's available, not yet how it's prepared. Show #pragma once at the top — it's the guard against multiple inclusions.`
      },
      {
        label: { fr:'Le .cpp = le corps des méthodes', en:'.cpp = the method bodies' },
        fr:`Le .cpp inclut le .h en première ligne (#include "MyActor.h"), puis implémente chaque méthode avec la syntaxe NomClasse::NomMethode(). Montre BeginPlay() et Tick() dans le .cpp. L'opérateur :: est le "scope resolution operator" — il dit au compilateur à quelle classe appartient cette implémentation.`,
        en:`The .cpp includes the .h on the first line (#include "MyActor.h"), then implements each method with the syntax ClassName::MethodName(). Show BeginPlay() and Tick() in the .cpp. The :: operator is the "scope resolution operator" — it tells the compiler which class this implementation belongs to.`
      },
      {
        label: { fr:'Pourquoi #pragma once ?', en:'Why #pragma once?' },
        fr:`Sans #pragma once, si deux fichiers incluent le même .h, le compilateur voit la classe deux fois — erreur de redéfinition. #pragma once dit "n'inclus ce fichier qu'une seule fois par compilation". C'est la façon moderne — l'alternative classique sont les include guards (#ifndef / #define / #endif) que tu verras parfois dans du vieux code.`,
        en:`Without #pragma once, if two files include the same .h, the compiler sees the class twice — redefinition error. #pragma once says "only include this file once per compilation". It's the modern way — the classic alternative is include guards (#ifndef / #define / #endif) you'll sometimes see in old code.`
      },
    ],
    discussion: [
      {
        fr:`En C#, quand tu voulais accéder à une classe d'un autre fichier, tu faisais "using". En C++, c'est #include. Quelle est la différence conceptuelle ?`,
        en:`In C#, when you wanted to access a class from another file, you used "using". In C++ it's #include. What's the conceptual difference?`
      },
      {
        fr:`Si tu travailles en équipe et que tu veux savoir rapidement ce que fait une classe Unreal, quel fichier ouvres-tu en premier — le .h ou le .cpp ?`,
        en:`If you're working in a team and want to quickly understand what an Unreal class does, which file do you open first — the .h or the .cpp?`
      },
    ],
    deep: {
      fr:`<p><strong>Dépendances circulaires et forward declarations.</strong> Problème classique : A.h inclut B.h et B.h inclut A.h — boucle infinie à la compilation. La solution : les forward declarations. Au lieu d'inclure B.h dans A.h, on écrit juste <code>class B;</code> — on dit au compilateur "B existe, tu verras ses détails plus tard".</p>
<p>En Unreal, c'est une pratique très courante pour garder les headers légers et accélérer les temps de compilation (qui peuvent devenir très longs sur de gros projets). Tu verras souvent <code>class AActor;</code> en haut d'un .h au lieu d'un #include.</p>`,
      en:`<p><strong>Circular dependencies and forward declarations.</strong> Classic problem: A.h includes B.h and B.h includes A.h — infinite loop at compilation. Solution: forward declarations. Instead of including B.h in A.h, just write <code>class B;</code> — telling the compiler "B exists, you'll see its details later".</p>
<p>In Unreal, this is very common practice to keep headers light and speed up compilation times (which can become very long on large projects). You'll often see <code>class AActor;</code> at the top of a .h instead of a #include.</p>`
    }
  },

  compare: {
    cs:`<span class="cm">// C# — tout dans PlayerCharacter.cs</span>
<span class="kw">public class</span> <span class="ty">PlayerCharacter</span>
{
    <span class="kw">private int</span> health = <span class="num">100</span>;

    <span class="kw">public void</span> <span class="fn">TakeDamage</span>(<span class="kw">int</span> d)
    {
        health -= d;
    }
}`,
    cpp:`<span class="cm">// PlayerCharacter.h — déclaration</span>
<span class="mac">#pragma once</span>
<span class="kw2">class</span> <span class="ty">APlayerCharacter</span> : <span class="kw2">public</span> <span class="ty">AActor</span>
{
    <span class="mac">GENERATED_BODY</span>()
<span class="kw2">private</span>:
    <span class="kw2">int32</span> Health = <span class="num">100</span>;
<span class="kw2">public</span>:
    <span class="kw2">void</span> <span class="fn2">TakeDamage</span>(<span class="kw2">int32</span> D);
};
<span class="cm">// PlayerCharacter.cpp — implémentation</span>
<span class="kw2">void</span> <span class="ty">APlayerCharacter</span><span class="op">::</span><span class="fn2">TakeDamage</span>(<span class="kw2">int32</span> D)
{
    Health -= D;
}`
  },

  activities: [
    {
      id:'a5_1', type:'quiz', xp:15,
      q:{
        fr:`À quoi sert #pragma once en haut d'un fichier .h en C++ ?`,
        en:`What does #pragma once at the top of a .h file do in C++?`
      },
      choices:[
        { t:{ fr:`Ça définit une valeur constante`, en:`It defines a constant value` }, c:false,
          fb:{ fr:`Non, #define sert à ça. #pragma once est une directive de compilation.`, en:`No, #define does that. #pragma once is a compilation directive.` } },
        { t:{ fr:`Ça empêche le fichier d'être inclus plus d'une fois lors d'une compilation`, en:`It prevents the file from being included more than once during compilation` }, c:true,
          fb:{ fr:`Correct. Sans ça, inclure le même .h depuis deux fichiers différents ferait voir la déclaration deux fois au compilateur — erreur de redéfinition.`, en:`Correct. Without it, including the same .h from two different files would show the declaration twice to the compiler — redefinition error.` } },
        { t:{ fr:`Ça rend le fichier accessible depuis n'importe où dans le projet`, en:`It makes the file accessible from anywhere in the project` }, c:false,
          fb:{ fr:`Non, l'accessibilité dépend des #include et de la structure du projet.`, en:`No, accessibility depends on #include and project structure.` } },
        { t:{ fr:`Ça désactive les avertissements du compilateur`, en:`It disables compiler warnings` }, c:false,
          fb:{ fr:`Non, pour ça il existerait des pragmas spécifiques différents.`, en:`No, that would require different specific pragmas.` } },
      ]
    },
    {
      id:'a5_2', type:'fill', xp:20,
      instr:{
        fr:`Complète l'implémentation de TakeDamage dans le fichier .cpp (syntaxe de scope resolution) :`,
        en:`Complete the TakeDamage implementation in the .cpp file (scope resolution syntax):`
      },
      template:{ fr:'void APlayerCharacter______TakeDamage(int32 D)', en:'void APlayerCharacter______TakeDamage(int32 D)' },
      answer:'::',
      hint:{ fr:"L'opérateur qui relie le nom de classe au nom de méthode dans le .cpp", en:'The operator that connects the class name to the method name in the .cpp' }
    },
    {
      id:'a5_3', type:'bug', xp:25,
      instr:{
        fr:`Ce header .h causera une erreur si inclus depuis deux fichiers différents. Qu'est-ce qui manque ?`,
        en:`This .h header will cause an error if included from two different files. What's missing?`
      },
      bugCode:`<span class="cm">// MyWeapon.h</span>
<span class="bug-line"><span class="cm">// (manque quelque chose ici)</span></span>
<span class="kw2">class</span> <span class="ty">AMyWeapon</span> : <span class="kw2">public</span> <span class="ty">AActor</span>
{
<span class="kw2">public</span>:
    <span class="kw2">float</span> Damage = <span class="num">10.0f</span>;
    <span class="kw2">void</span> <span class="fn2">Fire</span>();
};`,
      explanation:{
        fr:`Il manque #pragma once en haut du fichier. Si ce header est inclus depuis plusieurs fichiers .cpp, le compilateur verra la classe AMyWeapon définie plusieurs fois — erreur de redéfinition. Toujours commencer un .h par #pragma once.`,
        en:`Missing #pragma once at the top of the file. If this header is included from multiple .cpp files, the compiler will see class AMyWeapon defined multiple times — redefinition error. Always start a .h with #pragma once.`
      }
    },
    {
      id:'a5_4', type:'engine', xp:35,
      label:{ fr:'Dans Unreal', en:'In Unreal' },
      task:{
        fr:`Dans Unreal, crée un nouveau C++ Actor vide (clic droit dans le Content Browser > New C++ Class > Actor). Ouvre les deux fichiers générés (.h et .cpp) dans VS Code ou Rider. Identifie et note : (1) #pragma once, (2) les #include, (3) la déclaration de classe dans le .h, (4) les implémentations de BeginPlay() et Tick() dans le .cpp avec la syntaxe ::.`,
        en:`In Unreal, create a new empty C++ Actor (right-click in Content Browser > New C++ Class > Actor). Open both generated files (.h and .cpp) in VS Code or Rider. Identify and note: (1) #pragma once, (2) the #includes, (3) the class declaration in .h, (4) BeginPlay() and Tick() implementations in .cpp with :: syntax.`
      },
      note:{
        fr:`Tu n'as pas à modifier le code — juste observer et identifier les quatre éléments.`,
        en:`You don't have to modify the code — just observe and identify the four elements.`
      }
    },
    {
      id:'a5_5', type:'reflect', xp:10,
      prompt:{
        fr:`La séparation .h / .cpp peut sembler redondante au premier abord — écrire la même signature deux fois. Mais elle a un avantage important pour le travail en équipe. Selon toi, lequel ?`,
        en:`The .h / .cpp separation can seem redundant at first — writing the same signature twice. But it has an important advantage for team work. What do you think it is?`
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
