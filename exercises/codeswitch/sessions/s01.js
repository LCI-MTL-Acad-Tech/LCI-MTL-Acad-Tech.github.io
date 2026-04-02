'use strict';
// ================================================================
// Session 01 — Types & Variables
// SESSION.tutor        — shared concept + deep dive (shown above tabs)
// SESSION.ide          — { demoSteps, discussion, compare, activities }
// SESSION.engine       — { demoSteps, discussion, compare, activities }
// Activity IDs: i01_N (IDE), e01_N (Engine)
// ================================================================

const SESSION = {
  id:        's01',
  num:       1,
  prev:      null,
  next:      2,
  xp:        80,
  blocName:  { fr:'Fondations', en:'Foundations' },
  blocColor: '#685ef7',
  title:     { fr:'Types & Variables', en:'Types & Variables' },
  sub:       { fr:'Ce que tu connais déjà — en C++', en:'What you already know — in C++' },

  // ── Shared concept (shown above both path tabs) ──────────────
  tutor: {
    concept: {
      fr:`Les types primitifs que tu connais de C# existent en C++ — int, float, bool ont exactement la même syntaxe. Ce qui change : les conventions de nommage Unreal, le type FString pour les chaînes, et quelques différences subtiles comme le littéral float. Le principe sous-jacent est identique dans les deux langages.`,
      en:`The primitive types you know from C# exist in C++ — int, float, bool have exactly the same syntax. What changes: Unreal naming conventions, the FString type for strings, and a few subtle differences like the float literal. The underlying principle is identical in both languages.`
    },
    deep: {
      fr:`<p><strong>Types à taille fixe.</strong> En C++ standard, <code>int</code> peut faire 16, 32 ou 64 bits selon la plateforme. <code>&lt;cstdint&gt;</code> garantit : <code>int32_t</code>, <code>uint8_t</code>… Unreal a ses propres versions : <code>int32</code>, <code>uint8</code>.</p>
<p>En jeu, le bon type évite des bugs subtils : un index d'inventaire non négatif → <code>uint8_t</code> (0–255). Des HP pouvant dépasser 32 767 → <code>int32_t</code>. C'est de la précision intentionnelle, pas de l'optimisation prématurée.</p>`,
      en:`<p><strong>Fixed-size types.</strong> In standard C++, <code>int</code> can be 16, 32, or 64 bits depending on platform. <code>&lt;cstdint&gt;</code> guarantees: <code>int32_t</code>, <code>uint8_t</code>… Unreal has its own: <code>int32</code>, <code>uint8</code>.</p>
<p>In games, the right type prevents subtle bugs: non-negative inventory index → <code>uint8_t</code> (0–255). HP that can exceed 32,767 → <code>int32_t</code>. That's intentional precision, not premature optimization.</p>`
    }
  },

  // ══════════════════════════════════════════════════════════════
  // PATH A — IDE  (pure C++, compiler/terminal workflow)
  // Escalation arc S01: snippets <10 lines, no functions, plain types
  // ══════════════════════════════════════════════════════════════
  ide: {
    demoSteps: [
      {
        label: { fr:'Crée main.cpp et inclus iostream', en:'Create main.cpp and include iostream' },
        fr:`Dans VS Code ou ton éditeur, crée main.cpp. Première ligne : #include <iostream>. C'est l'équivalent de "using System;" en C# — ça donne accès à std::cout. Fonction d'entrée : int main() { return 0; }`,
        en:`In VS Code or your editor, create main.cpp. First line: #include <iostream>. It's the equivalent of "using System;" in C# — gives access to std::cout. Entry function: int main() { return 0; }`
      },
      {
        label: { fr:'Déclare les quatre types de base', en:'Declare the four basic types' },
        fr:`Dans main() : int score = 0; float speed = 5.0f; bool isAlive = true; std::string name = "Héros";. Le f après 5.0 est requis — sans lui, c'est un double. bool, int, float : syntaxe identique à C#.`,
        en:`Inside main(): int score = 0; float speed = 5.0f; bool isAlive = true; std::string name = "Hero";. The f after 5.0 is required — without it, it's a double. bool, int, float: identical syntax to C#.`
      },
      {
        label: { fr:'Affiche avec std::cout', en:'Display with std::cout' },
        fr:`std::cout << "Score: " << score << std::endl; — l'opérateur << enchaîne les valeurs. Équivalent de Console.WriteLine(). Compile : g++ main.cpp -o main. Exécute : ./main`,
        en:`std::cout << "Score: " << score << std::endl; — the << operator chains values. Equivalent of Console.WriteLine(). Compile: g++ main.cpp -o main. Run: ./main`
      },
      {
        label: { fr:'auto — déduction de type', en:'auto — type deduction' },
        fr:`auto level = 1; — le compilateur déduit int. Identique à var en C#. Mais auto pi = 3.14; c'est un double — pour float : auto pi = 3.14f;`,
        en:`auto level = 1; — compiler deduces int. Identical to var in C#. But auto pi = 3.14; is a double — for float: auto pi = 3.14f;`
      },
    ],
    discussion: [
      {
        fr:`En C#, string est un type référence géré par le GC. En C++, std::string est un objet valeur qui se copie. Qu'est-ce que ça implique quand on le passe à une fonction ?`,
        en:`In C#, string is a reference type managed by the GC. In C++, std::string is a value object that copies. What does that imply when passing it to a function?`
      },
    ],
    compare: {
      std:`<span class="cm">// C++ standard</span>
#include &lt;iostream&gt;
#include &lt;string&gt;
<span class="kw2">int</span>         score   = <span class="num">0</span>;
<span class="kw2">float</span>       speed   = <span class="num">5.0f</span>;
<span class="kw2">bool</span>        isAlive = <span class="kw2">true</span>;
std::<span class="ty">string</span>  name    = <span class="str">"Héros"</span>;
<span class="kw2">auto</span>        level   = <span class="num">1</span>;
std::cout &lt;&lt; score &lt;&lt; std::endl;`,
      unreal:`<span class="cm">// C++ Unreal (équivalents)</span>

<span class="kw2">int32</span>    Score    = <span class="num">0</span>;
<span class="kw2">float</span>    Speed    = <span class="num">5.0f</span>;
<span class="kw2">bool</span>     bIsAlive = <span class="kw2">true</span>;
<span class="ty">FString</span>  Name     = <span class="mac">TEXT</span>(<span class="str">"Héros"</span>);
<span class="kw2">auto</span>     Level    = <span class="num">1</span>;
<span class="mac">UE_LOG</span>(LogTemp,Display,<span class="mac">TEXT</span>(<span class="str">"%d"</span>),Score);`
    },
    activities: [
      {
        id:'i01_1', type:'predict', xp:15,
        code:`#include &lt;iostream&gt;
int main() {
    int x = 10;
    float y = 3.0f;
    auto z = x / y;
    std::cout &lt;&lt; z &lt;&lt; std::endl;
    return 0;
}`,
        question: {
          fr:`x est int, y est float. Quel est le type de z ? Quelle est la sortie ?`,
          en:`x is int, y is float. What type is z? What is the output?`
        },
        output: `3.33333`,
        explanation: {
          fr:`En divisant un int par un float, C++ convertit l'int en float (promotion). auto déduit z comme float. Sortie : 3.33333 (précision float, ~6 chiffres significatifs).`,
          en:`Dividing an int by a float, C++ promotes the int to float. auto deduces z as float. Output: 3.33333 (float precision, ~6 significant digits).`
        }
      },
      {
        id:'i01_2', type:'cpp', xp:25,
        instr: {
          fr:`Écris un programme complet qui déclare int health = 100 et float armor = 0.75f, et affiche les deux sur des lignes séparées.`,
          en:`Write a complete program that declares int health = 100 and float armor = 0.75f, and displays both on separate lines.`
        },
        stub: `#include &lt;iostream&gt;
int main() {
    // ton code ici / your code here
    return 0;
}`,
        hint: {
          fr:`std::cout << valeur << std::endl; pour chaque variable`,
          en:`std::cout << value << std::endl; for each variable`
        },
        solution: {
          fr:`<pre style="font-family:var(--mono);font-size:1.3rem;line-height:1.8;color:#e0e8ef">#include &lt;iostream&gt;
int main() {
    int health = 100;
    float armor = 0.75f;
    std::cout &lt;&lt; health &lt;&lt; std::endl;
    std::cout &lt;&lt; armor  &lt;&lt; std::endl;
    return 0;
}</pre><p style="margin-top:.8rem;font-size:1.4rem;color:var(--ch2)">Sortie : <code>100</code> puis <code>0.75</code></p>`,
          en:`<pre style="font-family:var(--mono);font-size:1.3rem;line-height:1.8;color:#e0e8ef">#include &lt;iostream&gt;
int main() {
    int health = 100;
    float armor = 0.75f;
    std::cout &lt;&lt; health &lt;&lt; std::endl;
    std::cout &lt;&lt; armor  &lt;&lt; std::endl;
    return 0;
}</pre><p style="margin-top:.8rem;font-size:1.4rem;color:var(--ch2)">Output: <code>100</code> then <code>0.75</code></p>`
        }
      },
      {
        id:'i01_3', type:'bug', xp:20,
        instr: {
          fr:`Ce programme contient deux erreurs. Identifie-les.`,
          en:`This program contains two errors. Identify them.`
        },
        bugCode:`#include &lt;iostream&gt;
int main() {
    float speed = <span class="bug-line">5.0</span>;
    <span class="bug-line">Bool</span> isAlive = true;
    std::cout &lt;&lt; speed &lt;&lt; std::endl;
    return 0;
}`,
        explanation: {
          fr:`Erreur 1 : 5.0 sans "f" est un double — conversion implicite vers float. Mieux : 5.0f.<br>Erreur 2 : "Bool" avec majuscule n'existe pas en C++. Le type est "bool" (tout en minuscules).`,
          en:`Error 1: 5.0 without "f" is a double — implicit conversion to float. Better: 5.0f.<br>Error 2: "Bool" with capital B doesn't exist in C++. The type is "bool" (all lowercase).`
        }
      },
      {
        id:'i01_4', type:'fill', xp:15,
        instr: {
          fr:`Complète la déclaration C++ utilisant la déduction de type, initialisée à 1 :`,
          en:`Complete the C++ declaration using type deduction, initialized to 1:`
        },
        template: { fr:'______ playerLevel = 1;', en:'______ playerLevel = 1;' },
        answer: 'auto',
        hint: { fr:"L'équivalent C++ de \"var\" en C#", en:'The C++ equivalent of "var" in C#' }
      },
    ],
  },

  // ══════════════════════════════════════════════════════════════
  // PATH B — ENGINE  (Unity + Unreal side by side)
  // ══════════════════════════════════════════════════════════════
  engine: {
    demoSteps: [
      {
        label: { fr:'Ouvre Unity et Unreal côte à côte', en:'Open Unity and Unreal side by side' },
        fr:`Crée un script C# vide dans Unity et un Actor C++ vide dans Unreal. Ouvre les deux dans leurs éditeurs. Montre la similitude structurelle — les deux ont une classe, les deux ont des méthodes. L'étudiant·e voit immédiatement un terrain connu.`,
        en:`Create an empty C# script in Unity and an empty C++ Actor in Unreal. Open both in their editors. Show the structural similarity — both have a class, both have methods. The student immediately sees familiar ground.`
      },
      {
        label: { fr:'Déclare les mêmes variables dans les deux', en:'Declare the same variables in both' },
        fr:`Tape en direct dans les deux : int score = 0, float speed = 5.0f, bool isAlive = true, string/FString name. Dis à voix haute ce qui est identique et ce qui diffère. Insiste : int32 garantit la taille sur toutes les plateformes cibles d'Unreal.`,
        en:`Type live in both: int score = 0, float speed = 5.0f, bool isAlive = true, string/FString name. Say out loud what's identical and what differs. Stress: int32 guarantees size across all of Unreal's target platforms.`
      },
      {
        label: { fr:'Convention bPrefix pour les booléens', en:'bPrefix convention for booleans' },
        fr:`Dans Unreal, les booléens commencent par "b" : bIsAlive, bIsDead, bCanJump. Universel dans tout le code officiel Unreal. Renomme en direct. Ce n'est pas obligatoire mais tout collègue Unreal le verra immédiatement.`,
        en:`In Unreal, booleans start with "b": bIsAlive, bIsDead, bCanJump. Universal in all official Unreal code. Rename live. Not mandatory but every Unreal developer will notice it immediately.`
      },
      {
        label: { fr:'FString et TEXT()', en:'FString and TEXT()' },
        fr:`Unreal utilise FString (pas std::string) pour l'intégration éditeur, la sérialisation, et les Blueprints. TEXT() garantit l'encodage Unicode — sans lui, les caractères non-ASCII peuvent se corrompre selon la plateforme de destination.`,
        en:`Unreal uses FString (not std::string) for editor integration, serialization, and Blueprints. TEXT() guarantees Unicode encoding — without it, non-ASCII characters can corrupt depending on the target platform.`
      },
    ],
    discussion: [
      {
        fr:`Quels types as-tu utilisés le plus souvent dans tes scripts Unity ? Lesquels existent en C++ Unreal avec la même syntaxe ?`,
        en:`Which types did you use most often in your Unity scripts? Which ones exist in Unreal C++ with the same syntax?`
      },
      {
        fr:`Pourquoi Unreal préfère int32 à int ? Qu'est-ce que ça révèle sur les contraintes du développement multiplateforme ?`,
        en:`Why does Unreal prefer int32 over int? What does that reveal about multiplatform development constraints?`
      },
    ],
    compare: {
      cs:`<span class="cm">// C# — Unity</span>
<span class="kw">int</span>    score   = <span class="num">0</span>;
<span class="kw">float</span>  speed   = <span class="num">5.0f</span>;
<span class="kw">bool</span>   isAlive = <span class="kw">true</span>;
<span class="kw">string</span> name    = <span class="str">"Héros"</span>;
<span class="kw">var</span>    level   = <span class="num">1</span>;`,
      cpp:`<span class="cm">// C++ — Unreal</span>
<span class="kw2">int32</span>    Score    = <span class="num">0</span>;
<span class="kw2">float</span>    Speed    = <span class="num">5.0f</span>;
<span class="kw2">bool</span>     bIsAlive = <span class="kw2">true</span>;
<span class="ty">FString</span>  Name     = <span class="mac">TEXT</span>(<span class="str">"Héros"</span>);
<span class="kw2">auto</span>     Level    = <span class="num">1</span>;`
    },
    activities: [
      {
        id:'e01_1', type:'quiz', xp:15,
        q: {
          fr:`Dans Unreal C++, quel type utilises-tu pour stocker le nom d'un personnage (texte modifiable) ?`,
          en:`In Unreal C++, which type do you use to store a character's name (editable text)?`
        },
        choices: [
          { t:'<code>string</code>', c:false,
            fb:{ fr:`string est le type C++ standard — Unreal utilise FString pour l'intégration moteur.`, en:`string is the standard C++ type — Unreal uses FString for engine integration.` } },
          { t:'<code>FString</code>', c:true,
            fb:{ fr:`Correct ! FString est le type texte principal d'Unreal pour les chaînes modifiables.`, en:`Correct! FString is Unreal's main text type for mutable strings.` } },
          { t:'<code>FName</code>', c:false,
            fb:{ fr:`FName est pour les identifiants internes (bones, assets) — pas pour du texte affiché.`, en:`FName is for internal identifiers (bones, assets) — not for displayed text.` } },
          { t:'<code>FText</code>', c:false,
            fb:{ fr:`FText est pour le texte localisé dans l'UI finale. Pour une variable gameplay : FString.`, en:`FText is for localized text in the final UI. For a gameplay variable: FString.` } },
        ]
      },
      {
        id:'e01_2', type:'fill', xp:20,
        instr: {
          fr:`Déclare une variable Unreal pour la vie du joueur (entier 32 bits, vaut 100 au départ) :`,
          en:`Declare an Unreal variable for player health (32-bit integer, starts at 100):`
        },
        template: { fr:'______ PlayerHealth = 100;', en:'______ PlayerHealth = 100;' },
        answer: 'int32',
        hint: { fr:`Le type entier garanti 32 bits d'Unreal`, en:`Unreal's guaranteed 32-bit integer type` }
      },
      {
        id:'e01_3', type:'bug', xp:25,
        instr: {
          fr:`Ce code Unreal contient une erreur de convention. Identifie-la.`,
          en:`This Unreal code contains a convention error. Identify it.`
        },
        bugCode:`<span class="kw2">bool</span>    <span class="bug-line">isPlayerDead</span> = <span class="kw2">false</span>;
<span class="kw2">int32</span>   PlayerHealth  = <span class="num">100</span>;
<span class="ty">FString</span> PlayerName    = <span class="mac">TEXT</span>(<span class="str">"Héros"</span>);`,
        explanation: {
          fr:`En Unreal, les booléens commencent par "b" : bIsPlayerDead. Pas une erreur de compilation, mais une erreur de style universelle — tout développeur Unreal le remarquera immédiatement et considérera le code comme non-idiomatique.`,
          en:`In Unreal, booleans start with "b": bIsPlayerDead. Not a compilation error, but a universal style error — every Unreal developer will notice it immediately and consider the code non-idiomatic.`
        }
      },
      {
        id:'e01_4', type:'engine', xp:30,
        label: { fr:'Dans Unity + Unreal', en:'In Unity + Unreal' },
        task: {
          fr:`1. Dans Unity : ajoute ces variables à un MonoBehaviour : int score = 0; float speed = 5f; bool isAlive = true; string heroName = "Héros";. 2. Dans Unreal : crée un Actor C++ et déclare les équivalents dans le .h (int32, float, bool avec bPrefix, FString avec TEXT()). 3. Compile et vérifie qu'il n'y a pas d'erreur.`,
          en:`1. In Unity: add these to a MonoBehaviour: int score = 0; float speed = 5f; bool isAlive = true; string heroName = "Hero";. 2. In Unreal: create a C++ Actor and declare the equivalents in the .h (int32, float, bool with bPrefix, FString with TEXT()). 3. Compile and verify no errors.`
        },
        note: {
          fr:`L'objectif est la traduction manuelle — sentir la correspondance entre les deux syntaxes.`,
          en:`The goal is manual translation — feeling the correspondence between the two syntaxes.`
        }
      },
    ],
  },

  homework:{
    core:[
      {diff:'easy', fr:'Déclare 5 variables de types différents (int, float, bool, string, auto) et affiche chacune avec cout. Vérifie que le programme compile sans warning.', en:'Declare 5 variables of different types (int, float, bool, string, auto) and print each with cout. Verify the program compiles without warnings.'},
      {diff:'medium', fr:'Écris un programme qui déclare une variable entière, la modifie trois fois, et affiche sa valeur après chaque modification. Que remarques-tu sur la différence entre = (affectation) et == (comparaison) ?', en:'Write a program that declares an integer variable, modifies it three times, and prints its value after each modification. What do you notice about = (assignment) vs == (comparison)?'},
      {diff:'hard', fr:'Crée un programme qui démontre la différence de précision entre int, float et double pour le calcul de 1.0/3.0. Affiche 10 décimales avec setprecision(10).', en:'Create a program that demonstrates the precision difference between int, float, and double for computing 1.0/3.0. Print 10 decimal places with setprecision(10).'},
    ],
    ide:[
      {diff:'medium', fr:'Dans ton éditeur, configure l\'extension C/C++ pour souligner les variables non utilisées. Teste-la en déclarant une variable sans l\'utiliser.', en:'In your editor, configure the C/C++ extension to underline unused variables. Test it by declaring a variable without using it.'},
    ],
    engine:[
      {diff:'medium', fr:'Dans Unreal, ouvre un Blueprint existant du Third Person Template. Identifie 3 variables et note leur type Unreal (int32, float, bool, FString). Compare avec leurs équivalents C++.', en:'In Unreal, open an existing Blueprint from the Third Person Template. Identify 3 variables and note their Unreal type (int32, float, bool, FString). Compare with their C++ equivalents.'},
    ],
  },
};

document.addEventListener('DOMContentLoaded', () => {
  // engine.js handles all rendering via initSessionPage()
});
