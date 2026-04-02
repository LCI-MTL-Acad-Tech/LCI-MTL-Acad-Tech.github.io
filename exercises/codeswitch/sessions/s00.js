'use strict';
// ================================================================
// Module 0 — Échauffement C# → C++
// SESSION.solo = true — engine uses initM0Page()
// Layout: side-by-side C# | C++ per concept, single OneCompiler link
// 6 concepts: types, output, conditionals, loops, functions, classes
// 11 activities: predict, quiz, fill, diff (spot-the-difference)
// ================================================================

// OneCompiler base URL — C++ template with a ready-to-run stub
// Students click, see the code already loaded, hit Run ▶
const _OC = 'https://onecompiler.com/cpp';

const SESSION = {
  id:       's00',
  num:      0,
  prev:     null,
  next:     1,
  xp:       60,
  solo:     true,
  blocName: { fr:'Échauffement', en:'Warmup' },
  blocColor:'#f2f537',
  title:    { fr:'Module 0 — C# que tu connais déjà', en:'Module 0 — C# you already know' },
  sub:{
    fr:'Six concepts côte à côte — reconnais ce que tu sais déjà avant d\'installer quoi que ce soit',
    en:'Six concepts side by side — recognize what you already know before installing anything'
  },

  tutor:{
    concept:{
      fr:`Pas d'installation, pas de moteur. Ce module te montre que tu connais déjà la moitié de C++. Pour chaque concept C# que tu maîtrises, il y a un équivalent C++ — souvent presque identique. Lis les deux colonnes, clique Run pour voir le code s'exécuter, et fais les activités. À la fin, tu seras prêt·e à compiler pour de vrai en S01.`,
      en:`No install, no engine. This module shows you already know half of C++. For every C# concept you master, there's a C++ equivalent — often almost identical. Read both columns, click Run to see the code execute, and do the activities. By the end, you'll be ready to compile for real in S01.`
    },
    deep: null
  },

  // ── Concepts (side-by-side, sequential) ──────────────────────
  concepts:[

    // ── 1. Types & Variables ───────────────────────────────────
    {
      title:{ fr:'1 — Types & Variables', en:'1 — Types & Variables' },
      body:{
        fr:`En C#, chaque variable a un type qui détermine ce qu'elle peut stocker. Regarde les deux colonnes — <code>int</code>, <code>float</code>, <code>bool</code> sont identiques ; seuls <code>string</code> et <code>var</code> changent de nom.`,
        en:`In C#, every variable has a type that determines what it can store. Look at both columns — <code>int</code>, <code>float</code>, <code>bool</code> are identical; only <code>string</code> and <code>var</code> change names.`
      },
      cs:`<span class="kw">int</span>    score  = <span class="num">0</span>;
<span class="kw">float</span>  speed  = <span class="num">5.0f</span>;
<span class="kw">bool</span>   alive  = <span class="kw">true</span>;
<span class="kw">string</span> name   = <span class="str">"Héros"</span>;
<span class="kw">var</span>    level  = <span class="num">1</span>;`,
      cpp:`<span class="kw2">int</span>         score  = <span class="num">0</span>;
<span class="kw2">float</span>       speed  = <span class="num">5.0f</span>;
<span class="kw2">bool</span>        alive  = <span class="kw2">true</span>;
std::<span class="ty">string</span>  name   = <span class="str">"Héros"</span>;
<span class="kw2">auto</span>        level  = <span class="num">1</span>;`,
      runUrl: _OC,
      diff:{
        fr:[
          `<code>int</code>, <code>float</code>, <code>bool</code> — <strong>identiques</strong>`,
          `<code>string</code> → <code>std::string</code> — le préfixe <code>std::</code> désigne la bibliothèque standard C++`,
          `<code>var</code> → <code>auto</code> — même idée : le compilateur déduit le type automatiquement`,
        ],
        en:[
          `<code>int</code>, <code>float</code>, <code>bool</code> — <strong>identical</strong>`,
          `<code>string</code> → <code>std::string</code> — the <code>std::</code> prefix means C++ standard library`,
          `<code>var</code> → <code>auto</code> — same idea: the compiler deduces the type automatically`,
        ]
      },
      actIds:['a00_1','a00_2']
    },

    // ── 2. Output ──────────────────────────────────────────────
    {
      title:{ fr:'2 — Affichage', en:'2 — Output' },
      body:{
        fr:`Console.WriteLine() affiche une ligne en C#. En C++, c'est std::cout avec l'opérateur <<. La logique est la même — seule la syntaxe change. L'opérateur << peut s'enchaîner pour combiner texte et variables.`,
        en:`Console.WriteLine() prints a line in C#. In C++, it's std::cout with the << operator. The logic is the same — only the syntax changes. The << operator chains to combine text and variables.`
      },
      cs:`<span class="kw">int</span> score = <span class="num">42</span>;
<span class="ty">Console</span>.<span class="fn">WriteLine</span>(
    <span class="str">"Score : "</span> + score);
<span class="ty">Console</span>.<span class="fn">WriteLine</span>(<span class="str">"Fini !"</span>);`,
      cpp:`<span class="kw2">int</span> score = <span class="num">42</span>;
std::cout &lt;&lt; <span class="str">"Score : "</span>
          &lt;&lt; score &lt;&lt; <span class="str">"\n"</span>;
std::cout &lt;&lt; <span class="str">"Fini !\n"</span>;`,
      runUrl: _OC,
      diff:{
        fr:[
          `<code>Console.WriteLine(x)</code> → <code>std::cout &lt;&lt; x &lt;&lt; "\n"</code>`,
          `L'opérateur <code>&lt;&lt;</code> enchaîne les valeurs (comme <code>+</code> dans la string C#)`,
          `<code>\n</code> ou <code>std::endl</code> ajoutent le retour à la ligne`,
          `<code>#include &lt;iostream&gt;</code> est nécessaire en haut du fichier (comme <code>using System;</code>)`,
        ],
        en:[
          `<code>Console.WriteLine(x)</code> → <code>std::cout &lt;&lt; x &lt;&lt; "\n"</code>`,
          `The <code>&lt;&lt;</code> operator chains values (like <code>+</code> in C# strings)`,
          `<code>\n</code> or <code>std::endl</code> add a newline`,
          `<code>#include &lt;iostream&gt;</code> is needed at the top of the file (like <code>using System;</code>)`,
        ]
      },
      actIds:['a00_3','a00_4']
    },

    // ── 3. Conditionals ────────────────────────────────────────
    {
      title:{ fr:'3 — Conditions', en:'3 — Conditionals' },
      body:{
        fr:`if / else if / else — la structure est identique dans les deux langages. C'est l'un des rares endroits où C++ est pratiquement mot pour mot comme C#. Les opérateurs de comparaison (>, >=, ==, !=, &&, ||) sont aussi identiques.`,
        en:`if / else if / else — the structure is identical in both languages. This is one of the rare places where C++ is practically word-for-word like C#. Comparison operators (>, >=, ==, !=, &&, ||) are also identical.`
      },
      cs:`<span class="kw">int</span> hp = <span class="num">75</span>;

<span class="kw">if</span> (hp &gt;= <span class="num">100</span>) {
    <span class="ty">Console</span>.<span class="fn">WriteLine</span>(<span class="str">"Pleine santé"</span>);
} <span class="kw">else if</span> (hp &gt; <span class="num">0</span>) {
    <span class="ty">Console</span>.<span class="fn">WriteLine</span>(<span class="str">"Blessé"</span>);
} <span class="kw">else</span> {
    <span class="ty">Console</span>.<span class="fn">WriteLine</span>(<span class="str">"Mort"</span>);
}`,
      cpp:`<span class="kw2">int</span> hp = <span class="num">75</span>;

<span class="kw2">if</span> (hp &gt;= <span class="num">100</span>) {
    std::cout &lt;&lt; <span class="str">"Pleine santé\n"</span>;
} <span class="kw2">else if</span> (hp &gt; <span class="num">0</span>) {
    std::cout &lt;&lt; <span class="str">"Blessé\n"</span>;
} <span class="kw2">else</span> {
    std::cout &lt;&lt; <span class="str">"Mort\n"</span>;
}`,
      runUrl: _OC,
      diff:{
        fr:[
          `Structure <code>if / else if / else</code> — <strong>identique</strong>`,
          `Opérateurs <code>&gt;=</code>, <code>&gt;</code>, <code>==</code>, <code>!=</code> — <strong>identiques</strong>`,
          `Seule différence visible : <code>Console.WriteLine</code> → <code>std::cout</code>`,
        ],
        en:[
          `<code>if / else if / else</code> structure — <strong>identical</strong>`,
          `Operators <code>&gt;=</code>, <code>&gt;</code>, <code>==</code>, <code>!=</code> — <strong>identical</strong>`,
          `Only visible difference: <code>Console.WriteLine</code> → <code>std::cout</code>`,
        ]
      },
      actIds:['a00_5']
    },

    // ── 4. Loops ───────────────────────────────────────────────
    {
      title:{ fr:'4 — Boucles', en:'4 — Loops' },
      body:{
        fr:`La boucle for classique est identique. Le foreach devient un "range-based for" avec : au lieu de in. La boucle while aussi est identique. La seule vraie surprise : en C++, oublier un break dans un switch laisse l'exécution tomber dans le case suivant (S03 en détaille les conséquences).`,
        en:`The classic for loop is identical. foreach becomes a "range-based for" with : instead of in. while is also identical. The only real surprise: in C++, forgetting break in a switch lets execution fall into the next case (S03 covers the consequences).`
      },
      cs:`<span class="cm">// for classique</span>
<span class="kw">for</span> (<span class="kw">int</span> i = <span class="num">0</span>; i &lt; <span class="num">3</span>; i++)
    <span class="ty">Console</span>.<span class="fn">WriteLine</span>(i);

<span class="cm">// foreach</span>
<span class="kw">int</span>[] nums = {<span class="num">10</span>, <span class="num">20</span>, <span class="num">30</span>};
<span class="kw">foreach</span> (<span class="kw">var</span> n <span class="kw">in</span> nums)
    <span class="ty">Console</span>.<span class="fn">WriteLine</span>(n);

<span class="cm">// while</span>
<span class="kw">int</span> x = <span class="num">3</span>;
<span class="kw">while</span> (x &gt; <span class="num">0</span>) x--;`,
      cpp:`<span class="cm">// for classique — identique</span>
<span class="kw2">for</span> (<span class="kw2">int</span> i = <span class="num">0</span>; i &lt; <span class="num">3</span>; i++)
    std::cout &lt;&lt; i &lt;&lt; <span class="str">"\n"</span>;

<span class="cm">// range-based for (= foreach)</span>
<span class="kw2">int</span> nums[] = {<span class="num">10</span>, <span class="num">20</span>, <span class="num">30</span>};
<span class="kw2">for</span> (<span class="kw2">const auto</span>&amp; n : nums)
    std::cout &lt;&lt; n &lt;&lt; <span class="str">"\n"</span>;

<span class="cm">// while — identique</span>
<span class="kw2">int</span> x = <span class="num">3</span>;
<span class="kw2">while</span> (x &gt; <span class="num">0</span>) x--;`,
      runUrl: _OC,
      diff:{
        fr:[
          `<code>for</code> classique et <code>while</code> — <strong>identiques</strong>`,
          `<code>foreach (var n in nums)</code> → <code>for (const auto& n : nums)</code>`,
          `<code>in</code> devient <code>:</code> et <code>var</code> devient <code>const auto&</code>`,
          `<code>const auto&</code> évite de copier chaque élément — bonne pratique C++`,
        ],
        en:[
          `Classic <code>for</code> and <code>while</code> — <strong>identical</strong>`,
          `<code>foreach (var n in nums)</code> → <code>for (const auto& n : nums)</code>`,
          `<code>in</code> becomes <code>:</code> and <code>var</code> becomes <code>const auto&</code>`,
          `<code>const auto&</code> avoids copying each element — C++ best practice`,
        ]
      },
      actIds:['a00_6','a00_7']
    },

    // ── 5. Functions ───────────────────────────────────────────
    {
      title:{ fr:'5 — Fonctions', en:'5 — Functions' },
      body:{
        fr:`En C#, toute fonction appartient à une classe. En C++, une fonction peut exister seule, sans classe — on l'appelle une "fonction libre". La déclaration est presque identique : type de retour, nom, paramètres, corps. Deux petites différences : pas de "public" pour les fonctions libres, et int main() est le point d'entrée obligatoire.`,
        en:`In C#, every function belongs to a class. In C++, a function can exist alone, without a class — it's called a "free function". The declaration is almost identical: return type, name, parameters, body. Two small differences: no "public" for free functions, and int main() is the mandatory entry point.`
      },
      cs:`<span class="cm">// dans une classe</span>
<span class="kw">public int</span> <span class="fn">Add</span>(<span class="kw">int</span> a, <span class="kw">int</span> b) {
    <span class="kw">return</span> a + b;
}

<span class="kw">public void</span> <span class="fn">Greet</span>(<span class="kw">string</span> name) {
    <span class="ty">Console</span>.<span class="fn">WriteLine</span>(
        <span class="str">"Bonjour, "</span> + name);
}`,
      cpp:`<span class="cm">// fonctions libres (hors classe)</span>
<span class="kw2">int</span> <span class="fn2">add</span>(<span class="kw2">int</span> a, <span class="kw2">int</span> b) {
    <span class="kw2">return</span> a + b;
}

<span class="kw2">void</span> <span class="fn2">greet</span>(std::<span class="ty">string</span> name) {
    std::cout &lt;&lt; <span class="str">"Bonjour, "</span>
              &lt;&lt; name &lt;&lt; <span class="str">"\n"</span>;
}`,
      runUrl: _OC,
      diff:{
        fr:[
          `Pas de <code>public</code> — les fonctions libres C++ n'ont pas de modificateur d'accès`,
          `Type de retour, nom, paramètres, corps — <strong>structure identique</strong>`,
          `<code>string</code> → <code>std::string</code> dans les paramètres aussi`,
          `La fonction peut exister sans classe — impossible en C#`,
        ],
        en:[
          `No <code>public</code> — C++ free functions have no access modifier`,
          `Return type, name, parameters, body — <strong>identical structure</strong>`,
          `<code>string</code> → <code>std::string</code> in parameters too`,
          `Function exists without a class — impossible in C#`,
        ]
      },
      actIds:['a00_8','a00_9']
    },

    // ── 6. Classes & Objects ───────────────────────────────────
    {
      title:{ fr:'6 — Classes & Objets', en:'6 — Classes & Objects' },
      body:{
        fr:`Les classes C++ ressemblent beaucoup aux classes C#. La différence principale : en C++, on sépare la déclaration (dans un fichier .h) de l'implémentation (dans un fichier .cpp). Ici, pour simplifier, on met tout dans un seul fichier. L'accès public/private fonctionne pareil — mais la syntaxe de déclaration est légèrement différente.`,
        en:`C++ classes look a lot like C# classes. The main difference: in C++, you separate the declaration (in a .h file) from the implementation (in a .cpp file). Here, for simplicity, we put everything in one file. public/private access works the same — but the declaration syntax is slightly different.`
      },
      cs:`<span class="kw">public class</span> <span class="ty">Player</span> {
    <span class="kw">private int</span> health = <span class="num">100</span>;
    <span class="kw">public string</span> name;

    <span class="kw">public</span> <span class="fn">Player</span>(<span class="kw">string</span> n) {
        name = n;
    }
    <span class="kw">public void</span> <span class="fn">TakeDamage</span>(<span class="kw">int</span> d) {
        health -= d;
    }
    <span class="kw">public bool</span> <span class="fn">IsAlive</span>() {
        <span class="kw">return</span> health &gt; <span class="num">0</span>;
    }
}`,
      cpp:`<span class="kw2">class</span> <span class="ty">Player</span> {
<span class="kw2">private</span>:
    <span class="kw2">int</span> health = <span class="num">100</span>;
<span class="kw2">public</span>:
    std::<span class="ty">string</span> name;

    <span class="ty">Player</span>(std::<span class="ty">string</span> n) {
        name = n;
    }
    <span class="kw2">void</span> <span class="fn2">takeDamage</span>(<span class="kw2">int</span> d) {
        health -= d;
    }
    <span class="kw2">bool</span> <span class="fn2">isAlive</span>() {
        <span class="kw2">return</span> health &gt; <span class="num">0</span>;
    }
};  <span class="cm">// ← point-virgule obligatoire !</span>`,
      runUrl: _OC,
      diff:{
        fr:[
          `<code>public class Player</code> → <code>class Player</code> — pas de "public" devant la classe en C++ standard`,
          `<code>public:</code> / <code>private:</code> s'écrivent une fois comme des étiquettes, pas sur chaque membre`,
          `Constructeur identique — même nom que la classe, pas de type de retour`,
          `Méthodes identiques — sauf la convention de nommage (camelCase en C++ standard)`,
          `<code>};</code> — le point-virgule après l'accolade fermante est <strong>obligatoire</strong> en C++`,
        ],
        en:[
          `<code>public class Player</code> → <code>class Player</code> — no "public" before the class in standard C++`,
          `<code>public:</code> / <code>private:</code> are written once as labels, not on each member`,
          `Constructor identical — same name as class, no return type`,
          `Methods identical — except naming convention (camelCase in standard C++)`,
          `<code>};</code> — the semicolon after the closing brace is <strong>mandatory</strong> in C++`,
        ]
      },
      actIds:['a00_10','a00_11']
    },
  ],

  // ── Activities ────────────────────────────────────────────────
  activities:[

    // ── Concept 1 — Types ─────────────────────────────────────
    {
      id:'a00_1', type:'diff', xp:8,
      cs:`<span class="kw">string</span> hero = <span class="str">"Lara"</span>;
<span class="kw">var</span>    pts  = <span class="num">50</span>;`,
      cpp:`std::<span class="ty">string</span> hero = <span class="str">"Lara"</span>;
<span class="kw2">auto</span>        pts  = <span class="num">50</span>;`,
      choices:[
        { t:{ fr:`string → std::string  et  var → auto`, en:`string → std::string  and  var → auto` }, c:true,
          fb:{ fr:`Exact — deux substitutions directes. std:: signale la bibliothèque standard, auto remplace var.`, en:`Correct — two direct substitutions. std:: signals the standard library, auto replaces var.` } },
        { t:{ fr:`Seulement var qui change`, en:`Only var changes` }, c:false,
          fb:{ fr:`string change aussi : il devient std::string en C++.`, en:`string also changes: it becomes std::string in C++.` } },
        { t:{ fr:`int change aussi`, en:`int also changes` }, c:false,
          fb:{ fr:`int est identique dans les deux langages — c'est l'un des points communs.`, en:`int is identical in both languages — that's one of the common points.` } },
        { t:{ fr:`Le type de pts change`, en:`The type of pts changes` }, c:false,
          fb:{ fr:`Non — pts est déduit comme int dans les deux cas. C'est auto/var qui change, pas le type.`, en:`No — pts is deduced as int in both cases. It's auto/var that changes, not the type.` } },
      ]
    },
    {
      id:'a00_2', type:'fill', xp:7,
      instr:{ fr:`En C++, le mot-clé qui déduit le type d'une variable automatiquement (équivalent de "var" en C#) est :`, en:`In C++, the keyword that deduces a variable's type automatically (equivalent to "var" in C#) is:` },
      template:{ fr:'______ score = 100;  // déduit int', en:'______ score = 100;  // deduces int' },
      answer:'auto',
      hint:{ fr:`Même idée que var : le compilateur déduit le type`, en:`Same idea as var: the compiler deduces the type` }
    },

    // ── Concept 2 — Output ────────────────────────────────────
    {
      id:'a00_3', type:'predict', xp:8,
      code:`#include &lt;iostream&gt;
int main() {
    int x = 6, y = 7;
    std::cout &lt;&lt; x &lt;&lt; " x " &lt;&lt; y
              &lt;&lt; " = " &lt;&lt; x * y &lt;&lt; "\n";
    return 0;
}`,
      question:{ fr:`Même logique qu'en C# — quelle est la sortie ?`, en:`Same logic as in C# — what is the output?` },
      output:`6 x 7 = 42`,
      explanation:{ fr:`std::cout << x << " x " << y << " = " << x * y enchaîne les valeurs avec <<, exactement comme la concaténation avec + en C#. Résultat : "6 x 7 = 42".`, en:`std::cout << x << " x " << y << " = " << x * y chains values with <<, exactly like + concatenation in C#. Result: "6 x 7 = 42".` }
    },
    {
      id:'a00_4', type:'diff', xp:8,
      cs:`<span class="ty">Console</span>.<span class="fn">WriteLine</span>(
    <span class="str">"HP: "</span> + hp);`,
      cpp:`std::cout &lt;&lt; <span class="str">"HP: "</span>
         &lt;&lt; hp &lt;&lt; <span class="str">"\n"</span>;`,
      choices:[
        { t:{ fr:`Console.WriteLine(...) → std::cout << ... << "\n"  et  + → <<`, en:`Console.WriteLine(...) → std::cout << ... << "\n"  and  + → <<` }, c:true,
          fb:{ fr:`Exact. La concaténation + devient l'opérateur << et le retour à la ligne est explicite avec "\n".`, en:`Correct. The + concatenation becomes the << operator and the newline is explicit with "\n".` } },
        { t:{ fr:`Seul le retour à la ligne change`, en:`Only the newline changes` }, c:false,
          fb:{ fr:`Toute la syntaxe d'affichage change : Console.WriteLine → std::cout, + → <<.`, en:`The entire display syntax changes: Console.WriteLine → std::cout, + → <<.` } },
        { t:{ fr:`hp doit être converti en texte avant d'être affiché`, en:`hp must be converted to text before displaying` }, c:false,
          fb:{ fr:`Non — std::cout gère les types numériques directement, comme Console.WriteLine.`, en:`No — std::cout handles numeric types directly, like Console.WriteLine.` } },
        { t:{ fr:`#include est optionnel`, en:`#include is optional` }, c:false,
          fb:{ fr:`#include <iostream> est obligatoire pour utiliser std::cout — c'est l'équivalent de "using System;".`, en:`#include <iostream> is mandatory to use std::cout — it's the equivalent of "using System;".` } },
      ]
    },

    // ── Concept 3 — Conditionals ──────────────────────────────
    {
      id:'a00_5', type:'quiz', xp:7,
      q:{ fr:`Tu veux tester si deux variables sont égales en C++. Quel opérateur utilises-tu ?`, en:`You want to test if two variables are equal in C++. Which operator do you use?` },
      choices:[
        { t:'<code>=</code>',  c:false, fb:{ fr:`= est l'affectation, pas la comparaison. Même chose qu'en C#.`, en:`= is assignment, not comparison. Same as in C#.` } },
        { t:'<code>==</code>', c:true,  fb:{ fr:`Correct — identique à C#. Les opérateurs de comparaison (==, !=, >, <, >=, <=) sont les mêmes dans les deux langages.`, en:`Correct — identical to C#. Comparison operators (==, !=, >, <, >=, <=) are the same in both languages.` } },
        { t:'<code>eq</code>', c:false, fb:{ fr:`"eq" n'existe pas en C++ ni en C#.`, en:`"eq" doesn't exist in C++ or C#.` } },
        { t:'<code>===</code>',c:false, fb:{ fr:`=== est le JavaScript. C++ et C# utilisent ==.`, en:`=== is JavaScript. C++ and C# both use ==.` } },
      ]
    },

    // ── Concept 4 — Loops ─────────────────────────────────────
    {
      id:'a00_6', type:'predict', xp:8,
      code:`#include &lt;iostream&gt;
int main() {
    int total = 0;
    for (int i = 1; i &lt;= 5; i++)
        total += i;
    std::cout &lt;&lt; total &lt;&lt; "\n";
    return 0;
}`,
      question:{ fr:`La boucle for est identique à C#. Calcule la sortie.`, en:`The for loop is identical to C#. Calculate the output.` },
      output:`15`,
      explanation:{ fr:`1 + 2 + 3 + 4 + 5 = 15. La boucle for C++ est syntaxiquement identique à C# — init ; condition ; incrément. Aucune surprise ici.`, en:`1 + 2 + 3 + 4 + 5 = 15. The C++ for loop is syntactically identical to C# — init ; condition ; increment. No surprises here.` }
    },
    {
      id:'a00_7', type:'diff', xp:8,
      cs:`<span class="kw">foreach</span> (<span class="kw">var</span> item <span class="kw">in</span> list)
    <span class="ty">Console</span>.<span class="fn">WriteLine</span>(item);`,
      cpp:`<span class="kw2">for</span> (<span class="kw2">const auto</span>&amp; item : list)
    std::cout &lt;&lt; item &lt;&lt; <span class="str">"\n"</span>;`,
      choices:[
        { t:{ fr:`foreach → for,  in → :,  var → const auto&`, en:`foreach → for,  in → :,  var → const auto&` }, c:true,
          fb:{ fr:`Exact. Trois substitutions : le mot-clé foreach, le séparateur "in", et le type var. La logique est identique.`, en:`Correct. Three substitutions: the foreach keyword, the "in" separator, and the var type. The logic is identical.` } },
        { t:{ fr:`Seulement "in" qui change`, en:`Only "in" changes` }, c:false,
          fb:{ fr:`"foreach" et "var" changent aussi — foreach → for, var → const auto&.`, en:`"foreach" and "var" also change — foreach → for, var → const auto&.` } },
        { t:{ fr:`La variable item doit être déclarée avant`, en:`The variable item must be declared before` }, c:false,
          fb:{ fr:`Non — const auto& item est déclaré directement dans la boucle, comme var item en C#.`, en:`No — const auto& item is declared directly in the loop, like var item in C#.` } },
        { t:{ fr:`C++ ne supporte pas le foreach`, en:`C++ doesn't support foreach` }, c:false,
          fb:{ fr:`Si — c'est le "range-based for". La syntaxe est différente mais la fonctionnalité est identique.`, en:`It does — it's the "range-based for". The syntax differs but the functionality is identical.` } },
      ]
    },

    // ── Concept 5 — Functions ─────────────────────────────────
    {
      id:'a00_8', type:'diff', xp:8,
      cs:`<span class="kw">public int</span> <span class="fn">Square</span>(<span class="kw">int</span> n) {
    <span class="kw">return</span> n * n;
}`,
      cpp:`<span class="kw2">int</span> <span class="fn2">square</span>(<span class="kw2">int</span> n) {
    <span class="kw2">return</span> n * n;
}`,
      choices:[
        { t:{ fr:`"public" disparaît et la casse du nom change`, en:`"public" disappears and the name casing changes` }, c:true,
          fb:{ fr:`Exact. Les fonctions libres C++ n'ont pas de modificateur d'accès. La convention de nommage passe souvent de PascalCase (C#) à camelCase (C++ standard).`, en:`Correct. C++ free functions have no access modifier. Naming convention often shifts from PascalCase (C#) to camelCase (standard C++).` } },
        { t:{ fr:`Le type de retour passe à la fin`, en:`The return type moves to the end` }, c:false,
          fb:{ fr:`Non — le type de retour reste en premier en C++ standard, comme en C#.`, en:`No — the return type stays first in standard C++, same as in C#.` } },
        { t:{ fr:`return devient yield`, en:`return becomes yield` }, c:false,
          fb:{ fr:`return est identique dans les deux langages.`, en:`return is identical in both languages.` } },
        { t:{ fr:`Rien ne change`, en:`Nothing changes` }, c:false,
          fb:{ fr:`"public" disparaît et le nom change de casse (Square → square).`, en:`"public" disappears and the name changes casing (Square → square).` } },
      ]
    },
    {
      id:'a00_9', type:'fill', xp:7,
      instr:{ fr:`Une fonction C++ qui ne retourne rien utilise le type de retour :`, en:`A C++ function that returns nothing uses the return type:` },
      template:{ fr:'______ printScore(int s) { std::cout << s; }', en:'______ printScore(int s) { std::cout << s; }' },
      answer:'void',
      hint:{ fr:`Identique à C# — le type "vide" qui signifie "ne retourne rien"`, en:`Identical to C# — the "empty" type meaning "returns nothing"` }
    },

    // ── Concept 6 — Classes ───────────────────────────────────
    {
      id:'a00_10', type:'diff', xp:8,
      cs:`<span class="kw">public class</span> <span class="ty">Weapon</span> {
    <span class="kw">public string</span> name;
    <span class="kw">private float</span> damage;
}`,
      cpp:`<span class="kw2">class</span> <span class="ty">Weapon</span> {
<span class="kw2">public</span>:
    std::<span class="ty">string</span> name;
<span class="kw2">private</span>:
    <span class="kw2">float</span> damage;
};`,
      choices:[
        { t:{ fr:`"public class" → "class" ; public/private deviennent des étiquettes ; }; final obligatoire`, en:`"public class" → "class" ; public/private become labels ; final }; mandatory` }, c:true,
          fb:{ fr:`Exact. Trois différences : pas de "public" devant class, public/private sont des étiquettes groupées (pas par membre), et le }; final est obligatoire en C++.`, en:`Correct. Three differences: no "public" before class, public/private are group labels (not per-member), and the final }; is mandatory in C++.` } },
        { t:{ fr:`Seul le }; final change`, en:`Only the final }; changes` }, c:false,
          fb:{ fr:`Trois choses changent : "public class" → "class", la syntaxe public/private, et le }; final.`, en:`Three things change: "public class" → "class", the public/private syntax, and the final };.` } },
        { t:{ fr:`Les membres doivent être dans l'ordre public puis private`, en:`Members must be in order public then private` }, c:false,
          fb:{ fr:`Non — l'ordre n'est pas imposé. On peut avoir plusieurs blocs public: et private: dans une même classe.`, en:`No — the order is not imposed. You can have multiple public: and private: blocks in the same class.` } },
        { t:{ fr:`string doit être déclaré avant d'utiliser la classe`, en:`string must be declared before using the class` }, c:false,
          fb:{ fr:`Non — std::string est disponible après #include <string>. Pas de déclaration préalable nécessaire.`, en:`No — std::string is available after #include <string>. No prior declaration needed.` } },
      ]
    },
    {
      id:'a00_11', type:'quiz', xp:7,
      q:{ fr:`En C++, pourquoi faut-il mettre un point-virgule après l'accolade fermante d'une classe — "class Player { ... };" ?`, en:`In C++, why is a semicolon required after a class's closing brace — "class Player { ... };" ?` },
      choices:[
        { t:{ fr:`Par convention historique — C++ imite C`, en:`Historical convention — C++ imitates C` }, c:false,
          fb:{ fr:`Bien qu'historiquement lié au C, la vraie raison est fonctionnelle — voir ci-dessous.`, en:`Although historically tied to C, the real reason is functional — see below.` } },
        { t:{ fr:`Parce qu'une déclaration de classe peut aussi déclarer une variable juste après`, en:`Because a class declaration can also declare a variable right after` }, c:true,
          fb:{ fr:`Correct. En C++, on peut écrire "class Player { ... } p1, p2;" pour déclarer deux Player. Le ; indique la fin de la déclaration. En C#, ce n'est pas possible — d'où l'absence du ;.`, en:`Correct. In C++ you can write "class Player { ... } p1, p2;" to declare two Players. The ; marks the end of the declaration. In C# this isn't possible — hence no ;.` } },
        { t:{ fr:`Pour que le compilateur sache que la classe est complète`, en:`So the compiler knows the class is complete` }, c:false,
          fb:{ fr:`L'accolade fermante suffit déjà pour signaler la fin. Le ; a une raison syntaxique plus précise.`, en:`The closing brace already signals the end. The ; has a more precise syntactic reason.` } },
        { t:{ fr:`C'est optionnel — certains compilateurs l'acceptent sans`, en:`It's optional — some compilers accept it without` }, c:false,
          fb:{ fr:`Non — le ; est obligatoire. Son absence est une erreur de compilation.`, en:`No — the ; is mandatory. Its absence is a compilation error.` } },
      ]
    },
  ],
};

document.addEventListener('DOMContentLoaded',()=>{});
