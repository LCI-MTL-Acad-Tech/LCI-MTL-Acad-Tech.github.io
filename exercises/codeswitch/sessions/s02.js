'use strict';
// Session 02 — Fonctions & Méthodes
// IDE arc S02: still snippets, first standalone functions (<10 lines), no classes

const SESSION = {
  id:'s02', num:2, prev:1, next:3, xp:90,
  blocName:{ fr:'Fondations', en:'Foundations' },
  blocColor:'#685ef7',
  title:{ fr:'Fonctions & Méthodes', en:'Functions & Methods' },
  sub:{ fr:'Même logique, syntaxe différente', en:'Same logic, different syntax' },

  tutor:{
    concept:{
      fr:`En C#, toutes les fonctions sont des méthodes — elles appartiennent à une classe. En C++, une fonction peut exister en dehors d'une classe (fonction libre), mais dans Unreal on travaille surtout avec des méthodes membres. La syntaxe de déclaration est presque identique : type de retour, nom, paramètres, corps. Ce qui surprend le plus : le qualificateur const après la méthode, et le cast explicite static_cast<>.`,
      en:`In C#, all functions are methods — they belong to a class. In C++, a function can exist outside a class (free function), but in Unreal we mostly work with member methods. The declaration syntax is almost identical: return type, name, parameters, body. What surprises most: the const qualifier after the method, and the explicit cast static_cast<>.`
    },
    deep:{
      fr:`<p><strong>Surcharge de fonctions (overloading).</strong> En C++ comme en C#, plusieurs fonctions peuvent avoir le même nom si leurs paramètres diffèrent. C++ va plus loin : il peut aussi différencier par le qualificateur <code>const</code> de la méthode — une version <em>lecture seule</em> et une version <em>modifiable</em> du même accesseur.</p>
<p>Exemple : <code>int32 GetScore();</code> et <code>int32 GetScore() const;</code> coexistent. La version <code>const</code> est appelée sur des objets constants. Tu verras souvent ce pattern dans les Getters Unreal officiels.</p>`,
      en:`<p><strong>Function overloading.</strong> In C++ as in C#, multiple functions can share a name if their parameters differ. C++ goes further: it can also differentiate by the method's <code>const</code> qualifier — a <em>read-only</em> and a <em>modifiable</em> version of the same accessor.</p>
<p>Example: <code>int32 GetScore();</code> and <code>int32 GetScore() const;</code> coexist. The <code>const</code> version is called on constant objects. You'll often see this pattern in official Unreal Getters.</p>`
    }
  },

  ide:{
    demoSteps:[
      {
        label:{ fr:'Première fonction libre en C++', en:'First free function in C++' },
        fr:`Dans main.cpp, écris une fonction AVANT main() : int add(int a, int b) { return a + b; }. C'est une fonction libre — pas dans une classe. Appelle-la dans main() : int result = add(3, 4); std::cout << result; Compile et exécute. Insiste : le type de retour est en premier, identique à C#.`,
        en:`In main.cpp, write a function BEFORE main(): int add(int a, int b) { return a + b; }. It's a free function — not in a class. Call it in main(): int result = add(3, 4); std::cout << result; Compile and run. Stress: return type comes first, identical to C#.`
      },
      {
        label:{ fr:'void et la règle du return obligatoire', en:'void and the mandatory return rule' },
        fr:`Montre une fonction void : void greet(std::string name) { std::cout << "Hello " << name; }. Puis montre que si on déclare int getScore() et qu'on oublie le return, le compilateur g++ refusera avec une erreur. Contrairement à C# qui est strict aussi, mais C++ sans -Wall peut parfois le laisser passer — montrer le warning avec g++ -Wall.`,
        en:`Show a void function: void greet(std::string name) { std::cout << "Hello " << name; }. Then show that declaring int getScore() and forgetting the return causes a g++ error. Unlike C# which is strict too, C++ without -Wall may sometimes let it through — show the warning with g++ -Wall.`
      },
      {
        label:{ fr:'static_cast — le cast explicite', en:'static_cast — the explicit cast' },
        fr:`Écris : float divide(int a, int b) { return static_cast<float>(a) / b; }. Explique : sans static_cast, a/b fait une division entière (3/4 = 0, pas 0.75). static_cast<float>(a) convertit avant la division. Compare avec (float)a en C — ça marche mais static_cast est plus lisible et vérifiable par le compilateur.`,
        en:`Write: float divide(int a, int b) { return static_cast<float>(a) / b; }. Explain: without static_cast, a/b does integer division (3/4 = 0, not 0.75). static_cast<float>(a) converts before division. Compare with (float)a in C — works but static_cast is more readable and compiler-checkable.`
      },
    ],
    discussion:[
      { fr:`Si tu oublies le return dans une fonction int en C# vs C++, qu'est-ce qui se passe dans chaque cas ?`, en:`If you forget the return in an int function in C# vs C++, what happens in each case?` },
    ],
    compare:{
      std:`<span class="cm">// C++ standard — fonctions libres</span>
<span class="kw2">int</span> <span class="fn2">add</span>(<span class="kw2">int</span> a, <span class="kw2">int</span> b) {
    <span class="kw2">return</span> a + b;
}
<span class="kw2">float</span> <span class="fn2">divide</span>(<span class="kw2">int</span> a, <span class="kw2">int</span> b) {
    <span class="kw2">return</span> <span class="kw2">static_cast</span>&lt;<span class="kw2">float</span>&gt;(a) / b;
}
<span class="kw2">void</span> <span class="fn2">greet</span>(std::<span class="ty">string</span> name) {
    std::cout &lt;&lt; <span class="str">"Hi "</span> &lt;&lt; name;
}`,
      unreal:`<span class="cm">// C++ Unreal — méthodes dans un Actor</span>
<span class="kw2">int32</span> <span class="fn2">CalcDamage</span>(<span class="kw2">int32</span> B, <span class="kw2">float</span> M) {
    <span class="kw2">return</span> <span class="kw2">static_cast</span>&lt;<span class="kw2">int32</span>&gt;(B * M);
}
<span class="kw2">void</span> <span class="fn2">Die</span>() { bIsAlive = <span class="kw2">false</span>; }
<span class="kw2">int32</span> <span class="fn2">GetHealth</span>() <span class="kw2">const</span> {
    <span class="kw2">return</span> Health;
}`
    },
    activities:[
      {
        id:'i02_1', type:'predict', xp:15,
        code:`#include &lt;iostream&gt;
int divide(int a, int b) {
    return a / b;
}
int main() {
    std::cout &lt;&lt; divide(7, 2) &lt;&lt; std::endl;
    return 0;
}`,
        question:{ fr:`Les deux paramètres sont int. Quelle est la sortie — et pourquoi pas 3.5 ?`, en:`Both parameters are int. What is the output — and why not 3.5?` },
        output:`3`,
        explanation:{ fr:`Division entière : 7/2 = 3 en C++ (comme en C#). La partie décimale est tronquée, pas arrondie. Pour obtenir 3.5, il faudrait static_cast<float>(a) / b, ou déclarer les paramètres en float.`, en:`Integer division: 7/2 = 3 in C++ (same as C#). The decimal part is truncated, not rounded. To get 3.5, you'd need static_cast<float>(a) / b, or declare the parameters as float.` }
      },
      {
        id:'i02_2', type:'cpp', xp:25,
        instr:{ fr:`Écris une fonction C++ libre nommée square qui prend un int et retourne son carré. Écris aussi un main() qui appelle square(5) et affiche le résultat.`, en:`Write a free C++ function named square that takes an int and returns its square. Also write a main() that calls square(5) and prints the result.` },
        stub:`#include &lt;iostream&gt;
// ta fonction ici / your function here

int main() {
    // appelle square(5) et affiche / call square(5) and print
    return 0;
}`,
        hint:{ fr:`Le carré de n = n * n. Retour type int.`, en:`Square of n = n * n. Return type int.` },
        solution:{
          fr:`<pre style="font-family:var(--mono);font-size:1.3rem;line-height:1.8;color:#e0e8ef">#include &lt;iostream&gt;
int square(int n) {
    return n * n;
}
int main() {
    std::cout &lt;&lt; square(5) &lt;&lt; std::endl;
    return 0;
}</pre><p style="margin-top:.8rem;font-size:1.4rem;color:var(--ch2)">Sortie : <code>25</code></p>`,
          en:`<pre style="font-family:var(--mono);font-size:1.3rem;line-height:1.8;color:#e0e8ef">#include &lt;iostream&gt;
int square(int n) {
    return n * n;
}
int main() {
    std::cout &lt;&lt; square(5) &lt;&lt; std::endl;
    return 0;
}</pre><p style="margin-top:.8rem;font-size:1.4rem;color:var(--ch2)">Output: <code>25</code></p>`
        }
      },
      {
        id:'i02_3', type:'bug', xp:20,
        instr:{ fr:`Cette fonction compilera mais donnera toujours 0. Pourquoi ?`, en:`This function will compile but always returns 0. Why?` },
        bugCode:`<span class="kw2">int</span> <span class="fn2">half</span>(<span class="kw2">int</span> a) {
    <span class="kw2">return</span> <span class="bug-line">a / 2</span>;
}
<span class="cm">// appelé avec : half(7)</span>`,
        explanation:{ fr:`a/2 avec deux entiers fait une division entière : half(7) = 3, pas 3.5. Si le résultat doit être décimal, retourner float et utiliser static_cast<float>(a) / 2. Si int est voulu, c'est correct — mais nommer la fonction "half" avec un retour entier peut surprendre.`, en:`a/2 with two integers does integer division: half(7) = 3, not 3.5. If decimal result is needed, return float and use static_cast<float>(a) / 2. If int is intended it's correct — but naming the function "half" with an int return may surprise callers.` }
      },
      {
        id:'i02_4', type:'fill', xp:15,
        instr:{ fr:`Pour convertir un int en float avant une division, complète :`, en:`To convert an int to float before division, complete:` },
        template:{ fr:'return ______<float>(a) / b;', en:'return ______<float>(a) / b;' },
        answer:'static_cast',
        hint:{ fr:`Le cast C++ moderne et explicite`, en:`The modern, explicit C++ cast` }
      },
    ],
  },

  engine:{
    demoSteps:[
      {
        label:{ fr:'Écris la même fonction dans Unity et Unreal', en:'Write the same function in Unity and Unreal' },
        fr:`Écris CalcDamage(int base, float mult) dans un MonoBehaviour Unity et dans un Actor Unreal. Tape en direct. Structure quasi identique : type de retour, nom, paramètres, corps. Différence principale : le nom en PascalCase dans Unreal, et static_cast plutôt que (int).`,
        en:`Write CalcDamage(int base, float mult) in a Unity MonoBehaviour and in an Unreal Actor. Type live. Structure almost identical: return type, name, parameters, body. Main difference: PascalCase name in Unreal, and static_cast instead of (int).`
      },
      {
        label:{ fr:'const après la méthode — une promesse', en:'const after the method — a promise' },
        fr:`Montre int32 GetHealth() const { return Health; }. Le const après la signature dit au compilateur : "cette méthode ne modifie pas l'état de l'objet". En C#, ce concept n'existe pas directement. Analogie : c'est une promesse écrite dans le code — les développeurs et le compilateur peuvent s'y fier.`,
        en:`Show int32 GetHealth() const { return Health; }. The const after the signature tells the compiler: "this method doesn't modify the object's state." In C#, this concept doesn't exist directly. Analogy: it's a written promise in the code — developers and the compiler can rely on it.`
      },
      {
        label:{ fr:'void et le return obligatoire sur tous les chemins', en:'void and the mandatory return on all paths' },
        fr:`Montre une fonction void Die() { bIsAlive = false; } — identique à C#. Puis montre que si GetScore() déclare int32 mais qu'un chemin if/else n'a pas de return, Unreal ne compilera pas. Le compilateur C++ est strict sur tous les chemins d'exécution.`,
        en:`Show a void Die() { bIsAlive = false; } — identical to C#. Then show that if GetScore() declares int32 but an if/else path has no return, Unreal won't compile. The C++ compiler is strict about all execution paths.`
      },
    ],
    discussion:[
      { fr:`En Unity, as-tu déjà créé des méthodes utilitaires statiques dans une classe Helper ? Comment tu ferais l'équivalent en C++ Unreal ?`, en:`In Unity, have you created static utility methods in a Helper class? How would you do the equivalent in Unreal C++?` },
    ],
    compare:{
      cs:`<span class="cm">// C# — méthodes dans une classe</span>
<span class="kw">public int</span> <span class="fn">CalcDamage</span>(<span class="kw">int</span> b, <span class="kw">float</span> m)
{
    <span class="kw">return</span> (<span class="kw">int</span>)(b * m);
}
<span class="kw">public void</span> <span class="fn">Die</span>() { isAlive = <span class="kw">false</span>; }
<span class="kw">public int</span> <span class="fn">GetHealth</span>() { <span class="kw">return</span> health; }`,
      cpp:`<span class="cm">// C++ Unreal — méthodes dans AActor</span>
<span class="kw2">int32</span> <span class="fn2">CalcDamage</span>(<span class="kw2">int32</span> B, <span class="kw2">float</span> M)
{
    <span class="kw2">return</span> <span class="kw2">static_cast</span>&lt;<span class="kw2">int32</span>&gt;(B * M);
}
<span class="kw2">void</span> <span class="fn2">Die</span>() { bIsAlive = <span class="kw2">false</span>; }
<span class="kw2">int32</span> <span class="fn2">GetHealth</span>() <span class="kw2">const</span> {
    <span class="kw2">return</span> Health;
}`
    },
    activities:[
      {
        id:'e02_1', type:'quiz', xp:15,
        q:{ fr:`Que signifie const après une signature de méthode en C++ (ex. int32 GetHealth() const) ?`, en:`What does const after a method signature mean in C++ (e.g. int32 GetHealth() const)?` },
        choices:[
          { t:{ fr:`La méthode retourne une valeur constante`, en:`The method returns a constant value` }, c:false, fb:{ fr:`Non — const ici qualifie l'objet, pas la valeur retournée.`, en:`No — const here qualifies the object, not the return value.` } },
          { t:{ fr:`La méthode ne modifie pas l'état de l'objet`, en:`The method does not modify the object's state` }, c:true, fb:{ fr:`Correct. C'est un contrat : le compilateur vérifie que la méthode ne modifie aucun membre non-mutable de l'objet.`, en:`Correct. It's a contract: the compiler verifies the method doesn't modify any non-mutable member of the object.` } },
          { t:{ fr:`La méthode ne peut pas être surchargée`, en:`The method cannot be overridden` }, c:false, fb:{ fr:`Non — c'est le rôle de virtual/override. const ici concerne l'état de l'objet.`, en:`No — that's virtual/override's job. const here is about the object's state.` } },
          { t:{ fr:`La méthode est obligatoirement inline`, en:`The method is necessarily inline` }, c:false, fb:{ fr:`Non, const et inline sont des concepts indépendants.`, en:`No, const and inline are independent concepts.` } },
        ]
      },
      {
        id:'e02_2', type:'fill', xp:20,
        instr:{ fr:`Complète la signature d'une méthode Unreal qui retourne des points de vie sans modifier l'objet :`, en:`Complete the signature of an Unreal method that returns health points without modifying the object:` },
        template:{ fr:'int32 GetHealth() ______;', en:'int32 GetHealth() ______;' },
        answer:'const',
        hint:{ fr:`Le qualificateur placé après les paramètres qui garantit l'immuabilité`, en:`The qualifier placed after parameters that guarantees immutability` }
      },
      {
        id:'e02_3', type:'bug', xp:25,
        instr:{ fr:`Cette méthode Unreal causera une erreur de compilation. Identifie le problème.`, en:`This Unreal method will cause a compilation error. Identify the problem.` },
        bugCode:`<span class="kw2">int32</span> <span class="fn2">GetScore</span>() <span class="kw2">const</span>
{
    <span class="kw2">int32</span> Total = Base + Bonus;
    <span class="cm">// calcul terminé</span>
    <span class="bug-line"><span class="cm">// pas de return</span></span>
}`,
        explanation:{ fr:`Une méthode déclarant int32 DOIT retourner une valeur sur tous les chemins d'exécution. L'absence de return Total; est une erreur de compilation en C++. Le compilateur refusera — ajouter return Total; avant la fermeture de l'accolade.`, en:`A method declaring int32 MUST return a value on all execution paths. The missing return Total; is a compilation error in C++. The compiler will refuse — add return Total; before the closing brace.` }
      },
      {
        id:'e02_4', type:'engine', xp:30,
        label:{ fr:'Dans Unity → Unreal', en:'In Unity → Unreal' },
        task:{ fr:`Ouvre un de tes anciens projets Unity. Trouve une méthode qui retourne une valeur (pas void). Réécris sa signature en C++ Unreal dans un fichier texte : remplace le type C# par l'équivalent Unreal, mets le nom en PascalCase, et ajoute const si elle ne modifie rien. Puis traduis le corps de la méthode ligne par ligne.`, en:`Open one of your old Unity projects. Find a method that returns a value (not void). Rewrite its signature in Unreal C++ in a text file: replace the C# type with the Unreal equivalent, put the name in PascalCase, and add const if it doesn't modify anything. Then translate the method body line by line.` },
        note:{ fr:`L'objectif est la traduction mentale, pas la compilation.`, en:`The goal is mental translation, not compilation.` }
      },
    ],
  },

  homework:{
    core:[
      {diff:'easy', fr:'Écris une fonction C++ square(int n) qui retourne n*n, et appelle-la avec 3 valeurs différentes.', en:'Write a C++ function square(int n) that returns n*n, and call it with 3 different values.'},
      {diff:'medium', fr:'Écris une fonction clamp(float val, float lo, float hi) qui retourne val contraint entre lo et hi. Teste avec des valeurs en dehors des bornes.', en:'Write a function clamp(float val, float lo, float hi) that returns val clamped between lo and hi. Test with values outside the bounds.'},
      {diff:'hard', fr:'Écris une fonction récursive factorial(int n) qui calcule n!. Ajoute une garde pour n < 0. Teste factorial(0), factorial(1), factorial(5), factorial(12).', en:'Write a recursive function factorial(int n) that computes n!. Add a guard for n < 0. Test factorial(0), factorial(1), factorial(5), factorial(12).'},
    ],
    ide:[
      {diff:'medium', fr:'Écris une fonction dans un fichier mathutils.h et inclus-la dans main.cpp. Compile avec g++ main.cpp -o main et vérifie que ça fonctionne.', en:'Write a function in a mathutils.h file and include it in main.cpp. Compile with g++ main.cpp -o main and verify it works.'},
    ],
    engine:[
      {diff:'medium', fr:'Dans Unreal, crée un Actor C++ avec une UFUNCTION(BlueprintCallable) GetHealth() qui retourne un int32. Expose-la à Blueprint et appelle-la depuis l\'Event Graph.', en:'In Unreal, create a C++ Actor with a UFUNCTION(BlueprintCallable) GetHealth() that returns an int32. Expose it to Blueprint and call it from the Event Graph.'},
    ],
  },
};
document.addEventListener('DOMContentLoaded',()=>{});
