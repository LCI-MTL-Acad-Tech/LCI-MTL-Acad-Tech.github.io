'use strict';
// Session 05 — Headers .h / .cpp
// IDE arc S05: first multi-file project — declare in .h, implement in .cpp

const SESSION = {
  id:'s05', num:5, prev:4, next:6, xp:100,
  blocName:{ fr:'Ce qui change vraiment', en:'What Really Changes' },
  blocColor:'#f2f537',
  title:{ fr:'Headers .h / .cpp', en:'Headers .h / .cpp' },
  sub:{ fr:'Pourquoi C++ sépare déclaration et implémentation', en:'Why C++ separates declaration from implementation' },

  tutor:{
    concept:{
      fr:`En C#, tout est dans un seul fichier .cs. En C++, on sépare en deux : le .h (header) déclare ce qui existe — la table des matières — et le .cpp l'implémente — le contenu réel. Cette structure peut dérouter au début, mais dans Unreal elle est systématique. Une fois le pattern compris, c'est lisible et pratique : le .h est l'interface publique que tes collègues lisent, le .cpp est le détail d'implémentation.`,
      en:`In C#, everything is in one .cs file. In C++, we split into two: the .h (header) declares what exists — the table of contents — and the .cpp implements it — the actual content. This structure can be disorienting at first, but in Unreal it's systematic. Once the pattern is understood, it's readable and practical: the .h is the public interface your colleagues read, the .cpp is the implementation detail.`
    },
    deep:{
      fr:`<p><strong>Forward declarations.</strong> Problème classique : A.h inclut B.h et B.h inclut A.h — boucle infinie. Solution : au lieu d'inclure B.h dans A.h, écrire <code>class B;</code> — on déclare que B existe sans détailler sa structure. Le compilateur accepte, puis voit les détails de B dans le .cpp.</p>
<p>Dans Unreal, c'est courant pour garder les headers légers. Tu verras souvent <code>class AActor;</code> en haut d'un .h au lieu d'un #include complet — ça accélère les temps de compilation qui peuvent devenir très longs sur de gros projets.</p>`,
      en:`<p><strong>Forward declarations.</strong> Classic problem: A.h includes B.h and B.h includes A.h — infinite loop. Solution: instead of including B.h in A.h, write <code>class B;</code> — declaring B exists without detailing its structure. The compiler accepts, then sees B's details in the .cpp.</p>
<p>In Unreal, this is common to keep headers light. You'll often see <code>class AActor;</code> at the top of a .h instead of a full #include — it speeds up compilation times that can get very long in large projects.</p>`
    }
  },

  ide:{
    demoSteps:[
      {
        label:{ fr:'Crée deux fichiers : math.h et math.cpp', en:'Create two files: math.h and math.cpp' },
        fr:`Dans VS Code, crée un dossier avec trois fichiers : math.h, math.cpp, main.cpp. Dans math.h : #pragma once puis la déclaration int add(int a, int b); (point-virgule, pas de corps). Dans math.cpp : #include "math.h" puis l'implémentation int add(int a, int b) { return a + b; }. Dans main.cpp : #include "math.h" puis l'appel.`,
        en:`In VS Code, create a folder with three files: math.h, math.cpp, main.cpp. In math.h: #pragma once then the declaration int add(int a, int b); (semicolon, no body). In math.cpp: #include "math.h" then the implementation int add(int a, int b) { return a + b; }. In main.cpp: #include "math.h" then the call.`
      },
      {
        label:{ fr:'Compile les deux .cpp ensemble', en:'Compile both .cpp files together' },
        fr:`g++ main.cpp math.cpp -o program. Note qu'on compile les deux fichiers .cpp — pas le .h (le header est inclus automatiquement via #include). Exécute ./program. Montre que si on oublie math.cpp dans la commande, on obtient une "undefined reference" error.`,
        en:`g++ main.cpp math.cpp -o program. Note that we compile both .cpp files — not the .h (the header is included automatically via #include). Run ./program. Show that if you forget math.cpp in the command, you get an "undefined reference" error.`
      },
      {
        label:{ fr:`#pragma once — le garde d'inclusion`, en:'#pragma once — the include guard' },
        fr:`Sans #pragma once, si deux .cpp incluent le même .h, le compilateur voit les déclarations deux fois — erreur de redéfinition. #pragma once dit "n'inclus ce fichier qu'une seule fois par compilation". Montre ce qui se passe sans (erreur) puis avec (succès). C'est la façon moderne — l'alternative classique est #ifndef/#define/#endif que tu verras dans du vieux code.`,
        en:`Without #pragma once, if two .cpp files include the same .h, the compiler sees declarations twice — redefinition error. #pragma once says "only include this file once per compilation". Show what happens without (error) then with (success). This is the modern way — the classic alternative is #ifndef/#define/#endif you'll see in old code.`
      },
      {
        label:{ fr:"L'opérateur :: dans le .cpp", en:'The :: operator in the .cpp' },
        fr:`Si on déclare une classe Calculator dans calculator.h, son implémentation dans calculator.cpp utilise :: : int Calculator::add(int a, int b) { return a + b; }. L'opérateur :: dit "add appartient à la classe Calculator". C'est le "scope resolution operator" — il rattache l'implémentation à sa déclaration.`,
        en:`If we declare a class Calculator in calculator.h, its implementation in calculator.cpp uses ::: int Calculator::add(int a, int b) { return a + b; }. The :: operator says "add belongs to class Calculator". It's the "scope resolution operator" — it connects the implementation to its declaration.`
      },
    ],
    discussion:[
      { fr:`La séparation .h/.cpp peut sembler redondante (écrire la signature deux fois). Quel avantage concret est-ce que ça apporte dans un projet en équipe ?`, en:`The .h/.cpp split may seem redundant (writing the signature twice). What concrete advantage does it bring in a team project?` },
    ],
    compare:{
      std:`<span class="cm">// math.h</span>
<span class="mac">#pragma once</span>
<span class="kw2">int</span> <span class="fn2">add</span>(<span class="kw2">int</span> a, <span class="kw2">int</span> b);  <span class="cm">// déclaration</span>

<span class="cm">// math.cpp</span>
#include <span class="str">"math.h"</span>
<span class="kw2">int</span> <span class="fn2">add</span>(<span class="kw2">int</span> a, <span class="kw2">int</span> b) {  <span class="cm">// impl.</span>
    <span class="kw2">return</span> a + b;
}

<span class="cm">// main.cpp</span>
#include <span class="str">"math.h"</span>
<span class="cm">// utilise add()</span>`,
      unreal:`<span class="cm">// MyActor.h</span>
<span class="mac">#pragma once</span>
<span class="mac">UCLASS</span>()
<span class="kw2">class</span> <span class="ty">AMyActor</span> : <span class="kw2">public</span> <span class="ty">AActor</span> {
    <span class="mac">GENERATED_BODY</span>()
<span class="kw2">public</span>:
    <span class="kw2">void</span> <span class="fn2">Fire</span>();  <span class="cm">// déclaration</span>
};

<span class="cm">// MyActor.cpp</span>
#include <span class="str">"MyActor.h"</span>
<span class="kw2">void</span> <span class="ty">AMyActor</span>::<span class="fn2">Fire</span>() {  <span class="cm">// impl.</span>
    <span class="cm">/* ... */</span>
}`
    },
    activities:[
      {
        id:'i05_1', type:'predict', xp:15,
        code:`<span class="cm">// utils.h</span>
<span class="mac">#pragma once</span>
<span class="kw2">int</span> <span class="fn2">square</span>(<span class="kw2">int</span> n);

<span class="cm">// utils.cpp</span>
#include <span class="str">"utils.h"</span>
<span class="kw2">int</span> <span class="fn2">square</span>(<span class="kw2">int</span> n) { <span class="kw2">return</span> n * n; }

<span class="cm">// main.cpp — compilé avec utils.cpp</span>
#include &lt;iostream&gt;
#include <span class="str">"utils.h"</span>
<span class="kw2">int</span> main() {
    std::cout &lt;&lt; <span class="fn2">square</span>(<span class="num">4</span>) &lt;&lt; std::endl;
}`,
        question:{ fr:`Quelle est la sortie ? Et que se passerait-il si on compilait seulement main.cpp sans utils.cpp ?`, en:`What is the output? And what would happen if we compiled only main.cpp without utils.cpp?` },
        output:`16`,
        explanation:{ fr:`Sortie : 16 (4² = 16). Si on compile seulement main.cpp, le compilateur voit la déclaration de square (via utils.h) mais le linker ne trouvera pas l'implémentation — erreur "undefined reference to square".`, en:`Output: 16 (4² = 16). If we compile only main.cpp, the compiler sees square's declaration (via utils.h) but the linker won't find the implementation — "undefined reference to square" error.` }
      },
      {
        id:'i05_2', type:'cpp', xp:35,
        instr:{ fr:`Crée trois fichiers. Dans greet.h : #pragma once et la déclaration void greet(std::string name);. Dans greet.cpp : l'implémentation qui affiche "Bonjour " + name. Dans main.cpp : inclus greet.h et appelle greet("monde"). Compile avec g++ main.cpp greet.cpp -o program.`, en:`Create three files. In greet.h: #pragma once and the declaration void greet(std::string name);. In greet.cpp: the implementation that prints "Hello " + name. In main.cpp: include greet.h and call greet("world"). Compile with g++ main.cpp greet.cpp -o program.` },
        stub:`<span class="cm">// greet.h</span>
<span class="mac">#pragma once</span>
#include &lt;string&gt;
<span class="cm">// ta déclaration / your declaration</span>

<span class="cm">// greet.cpp</span>
#include "greet.h"
#include &lt;iostream&gt;
<span class="cm">// ton implémentation / your implementation</span>

<span class="cm">// main.cpp</span>
#include "greet.h"
<span class="kw2">int</span> main() {
    <span class="cm">// appelle greet / call greet</span>
    <span class="kw2">return</span> <span class="num">0</span>;
}`,
        hint:{ fr:`Déclaration = signature + ; sans corps. Implémentation = même signature avec {} et le corps.`, en:`Declaration = signature + ; without body. Implementation = same signature with {} and the body.` },
        solution:{
          fr:`<pre style="font-family:var(--mono);font-size:1.3rem;line-height:1.8;color:#e0e8ef">// greet.h
#pragma once
#include &lt;string&gt;
void greet(std::string name);

// greet.cpp
#include "greet.h"
#include &lt;iostream&gt;
void greet(std::string name) {
    std::cout &lt;&lt; "Bonjour " &lt;&lt; name &lt;&lt; std::endl;
}

// main.cpp
#include "greet.h"
int main() {
    greet("monde");
    return 0;
}</pre><p style="margin-top:.8rem;font-size:1.4rem;color:var(--ch2)">Sortie : <code>Bonjour monde</code></p>`,
          en:`<pre style="font-family:var(--mono);font-size:1.3rem;line-height:1.8;color:#e0e8ef">// greet.h
#pragma once
#include &lt;string&gt;
void greet(std::string name);

// greet.cpp
#include "greet.h"
#include &lt;iostream&gt;
void greet(std::string name) {
    std::cout &lt;&lt; "Hello " &lt;&lt; name &lt;&lt; std::endl;
}

// main.cpp
#include "greet.h"
int main() {
    greet("world");
    return 0;
}</pre><p style="margin-top:.8rem;font-size:1.4rem;color:var(--ch2)">Output: <code>Hello world</code></p>`
        }
      },
      {
        id:'i05_3', type:'bug', xp:20,
        instr:{ fr:`Ce header causera une erreur de redéfinition si inclus depuis deux fichiers. Qu'est-ce qui manque ?`, en:`This header will cause a redefinition error if included from two files. What's missing?` },
        bugCode:`<span class="cm">// weapon.h</span>
<span class="bug-line"><span class="cm">// manque quelque chose</span></span>
<span class="kw2">int</span> <span class="fn2">calcDamage</span>(<span class="kw2">int</span> base, <span class="kw2">float</span> mult);`,
        explanation:{ fr:`Il manque #pragma once en première ligne. Sans ça, si deux .cpp incluent weapon.h, le compilateur voit calcDamage déclaré deux fois — erreur "redefinition". Toujours commencer un .h par #pragma once.`, en:`Missing #pragma once as the first line. Without it, if two .cpp files include weapon.h, the compiler sees calcDamage declared twice — "redefinition" error. Always start a .h with #pragma once.` }
      },
      {
        id:'i05_4', type:'fill', xp:15,
        instr:{ fr:`Complète la syntaxe d'implémentation d'une méthode add() appartenant à la classe Calculator dans un fichier .cpp :`, en:`Complete the implementation syntax for an add() method belonging to class Calculator in a .cpp file:` },
        template:{ fr:'int Calculator______add(int a, int b)', en:'int Calculator______add(int a, int b)' },
        answer:'::',
        hint:{ fr:`L'opérateur de résolution de portée qui relie classe et méthode`, en:`The scope resolution operator that connects class and method` }
      },
    ],
  },

  engine:{
    demoSteps:[
      {
        label:{ fr:'Crée un Actor Unreal et ouvre les deux fichiers', en:'Create an Unreal Actor and open both files' },
        fr:`Dans Unreal, crée un nouveau C++ Actor (clic droit Content Browser > New C++ Class > Actor). Montre immédiatement les deux fichiers générés : MyActor.h et MyActor.cpp. Ouvre-les côte à côte. Fais remarquer : #pragma once en haut du .h, #include "MyActor.h" en première ligne du .cpp.`,
        en:`In Unreal, create a new C++ Actor (right-click Content Browser > New C++ Class > Actor). Immediately show the two generated files: MyActor.h and MyActor.cpp. Open them side by side. Point out: #pragma once at the top of .h, #include "MyActor.h" as the first line of .cpp.`
      },
      {
        label:{ fr:'Le .h = déclarations, le .cpp = implémentations', en:'.h = declarations, .cpp = implementations' },
        fr:`Dans le .h : la classe, les membres, les signatures de méthodes — sans corps. Analogie : le menu d'un restaurant. Dans le .cpp : l'implémentation de chaque méthode avec la syntaxe AMyActor::MethodName(). C'est la même méthode vue de deux endroits différents.`,
        en:`In the .h: the class, members, method signatures — without bodies. Analogy: a restaurant menu. In the .cpp: the implementation of each method with syntax AMyActor::MethodName(). It's the same method seen from two different places.`
      },
      {
        label:{ fr:'Ajoute une méthode et implémente-la', en:'Add a method and implement it' },
        fr:`Dans le .h, dans la section public, ajoute : void Fire();. Dans le .cpp, ajoute l'implémentation : void AMyActor::Fire() { UE_LOG(LogTemp, Display, TEXT("Fire!")); }. Compile (bouton Compile dans Unreal ou Ctrl+Alt+F11). Vérifie dans l'Output Log. C'est le cycle entier : déclarer → implémenter → compiler.`,
        en:`In the .h, in the public section, add: void Fire();. In the .cpp, add the implementation: void AMyActor::Fire() { UE_LOG(LogTemp, Display, TEXT("Fire!")); }. Compile (Compile button in Unreal or Ctrl+Alt+F11). Check in Output Log. This is the full cycle: declare → implement → compile.`
      },
    ],
    discussion:[
      { fr:`En Unity, quand tu voulais utiliser une classe d'un autre fichier .cs, tu utilisais "using". En C++, c'est #include. Quelle est la différence conceptuelle entre les deux systèmes ?`, en:`In Unity, when you wanted to use a class from another .cs file, you used "using". In C++, it's #include. What's the conceptual difference between the two systems?` },
    ],
    compare:{
      cs:`<span class="cm">// C# — tout dans PlayerCtrl.cs</span>
<span class="kw">public class</span> <span class="ty">PlayerController</span>
    : <span class="ty">MonoBehaviour</span>
{
    <span class="kw">private int</span> health = <span class="num">100</span>;

    <span class="kw">public void</span> <span class="fn">TakeDamage</span>(<span class="kw">int</span> d)
    {
        health -= d;
    }
}`,
      cpp:`<span class="cm">// APlayerCtrl.h — déclaration</span>
<span class="mac">#pragma once</span>
<span class="mac">UCLASS</span>()
<span class="kw2">class</span> <span class="ty">APlayerCtrl</span> : <span class="kw2">public</span> <span class="ty">AActor</span> {
    <span class="mac">GENERATED_BODY</span>()
<span class="kw2">private</span>:
    <span class="kw2">int32</span> Health = <span class="num">100</span>;
<span class="kw2">public</span>:
    <span class="kw2">void</span> <span class="fn2">TakeDamage</span>(<span class="kw2">int32</span> D);
};
<span class="cm">// APlayerCtrl.cpp — implémentation</span>
<span class="kw2">void</span> <span class="ty">APlayerCtrl</span>::<span class="fn2">TakeDamage</span>(<span class="kw2">int32</span> D)
{ Health -= D; }`
    },
    activities:[
      {
        id:'e05_1', type:'quiz', xp:15,
        q:{ fr:`À quoi sert #pragma once en haut d'un fichier .h ?`, en:`What does #pragma once at the top of a .h file do?` },
        choices:[
          { t:{ fr:`Ça définit une constante`, en:`It defines a constant` }, c:false, fb:{ fr:`#define sert aux constantes. #pragma once est une directive de compilation.`, en:`#define is for constants. #pragma once is a compilation directive.` } },
          { t:{ fr:`Ça empêche le header d'être inclus plus d'une fois par compilation`, en:`It prevents the header from being included more than once per compilation` }, c:true, fb:{ fr:`Correct. Sans ça, deux .cpp incluant le même .h provoqueraient des erreurs de redéfinition.`, en:`Correct. Without it, two .cpp files including the same .h would cause redefinition errors.` } },
          { t:{ fr:`Ça rend le fichier accessible à tous les .cpp du projet`, en:`It makes the file accessible to all .cpp files in the project` }, c:false, fb:{ fr:`L'accessibilité dépend des #include — pas de #pragma once.`, en:`Accessibility depends on #include — not #pragma once.` } },
          { t:{ fr:`Ça optimise la compilation du fichier`, en:`It optimizes the compilation of the file` }, c:false, fb:{ fr:`#pragma once peut légèrement accélérer la compilation, mais ce n'est pas son objectif principal.`, en:`#pragma once can slightly speed up compilation, but that's not its main purpose.` } },
        ]
      },
      {
        id:'e05_2', type:'fill', xp:20,
        instr:{ fr:`Complète l'implémentation de Fire() pour la classe AWeapon dans le fichier .cpp :`, en:`Complete the implementation of Fire() for the AWeapon class in the .cpp file:` },
        template:{ fr:'void AWeapon______Fire()', en:'void AWeapon______Fire()' },
        answer:'::',
        hint:{ fr:`Le scope resolution operator qui relie la classe à sa méthode`, en:`The scope resolution operator that connects the class to its method` }
      },
      {
        id:'e05_3', type:'bug', xp:25,
        instr:{ fr:`Ce header Unreal provoquera une erreur de compilation cryptique. Qu'est-ce qui manque ?`, en:`This Unreal header will cause a cryptic compilation error. What's missing?` },
        bugCode:`<span class="mac">UCLASS</span>()
<span class="kw2">class</span> <span class="ty">AWeapon</span> : <span class="kw2">public</span> <span class="ty">AActor</span>
{
    <span class="bug-line"><span class="cm">// manque quelque chose ici</span></span>
<span class="kw2">public</span>:
    <span class="kw2">void</span> <span class="fn2">Fire</span>();
};`,
        explanation:{ fr:`Il manque GENERATED_BODY() juste après l'ouverture de la classe. Cette macro est obligatoire dans toute classe marquée UCLASS() — elle injecte le code de réflexion généré par l'Unreal Header Tool. Sans elle, le compilateur produit des erreurs cryptiques sur des symboles manquants.`, en:`Missing GENERATED_BODY() right after the class opening. This macro is mandatory in any class marked UCLASS() — it injects reflection code generated by the Unreal Header Tool. Without it, the compiler produces cryptic errors about missing symbols.` }
      },
      {
        id:'e05_4', type:'engine', xp:35,
        label:{ fr:'Dans Unreal', en:'In Unreal' },
        task:{ fr:`1. Crée un C++ Actor vide dans Unreal. 2. Dans le .h, dans la section public, ajoute : void Activate();. 3. Dans le .cpp, implémente-la : void AMonActor::Activate() { UE_LOG(LogTemp, Warning, TEXT("Activé !")); }. 4. Dans BeginPlay(), appelle Activate(). 5. Compile et place l'Actor dans la scène. Joue et vérifie que "Activé !" apparaît dans l'Output Log.`, en:`1. Create an empty C++ Actor in Unreal. 2. In the .h, in the public section, add: void Activate();. 3. In the .cpp, implement it: void AMyActor::Activate() { UE_LOG(LogTemp, Warning, TEXT("Activated!")); }. 4. In BeginPlay(), call Activate(). 5. Compile and place the Actor in the scene. Play and verify "Activated!" appears in the Output Log.` },
        note:{ fr:`C'est le cycle complet : déclarer dans .h → implémenter dans .cpp → appeler → compiler → tester.`, en:`This is the full cycle: declare in .h → implement in .cpp → call → compile → test.` }
      },
    ],
  },
};
document.addEventListener('DOMContentLoaded',()=>{});
