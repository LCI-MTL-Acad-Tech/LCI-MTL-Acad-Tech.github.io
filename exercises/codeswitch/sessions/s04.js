'use strict';
// Session 04 — Pointeurs & Références
// IDE arc S04: first functions with pointer/reference parameters — the key new concept

const SESSION = {
  id:'s04', num:4, prev:3, next:5, xp:110,
  blocName:{ fr:'Ce qui change vraiment', en:'What Really Changes' },
  blocColor:'#f2f537',
  title:{ fr:'Pointeurs & Références', en:'Pointers & References' },
  sub:{ fr:'Le concept qui fait peur — démystifié', en:'The scary concept — demystified' },

  tutor:{
    concept:{
      fr:`Les pointeurs font peur. La bonne nouvelle : tu utilises déjà la notion sans le savoir. En C# Unity, quand tu fais GetComponent<Rigidbody>(), tu récupères une référence à un objet existant — pas une copie. C'est exactement ce que fait un pointeur en C++. La différence : en C++, c'est explicite, avec sa propre syntaxe (*,  &, ->).`,
      en:`Pointers are scary. Good news: you already use the concept without knowing it. In C# Unity, when you call GetComponent<Rigidbody>(), you get a reference to an existing object — not a copy. That's exactly what a C++ pointer does. The difference: in C++, it's explicit, with its own syntax (*, &, ->).`
    },
    deep:{
      fr:`<p><strong>Pointeurs bruts vs smart pointers.</strong> En C++ moderne (hors Unreal), on évite les pointeurs bruts pour les membres de classe. Les smart pointers gèrent la durée de vie automatiquement : <code>std::unique_ptr&lt;T&gt;</code> (propriété exclusive), <code>std::shared_ptr&lt;T&gt;</code> (propriété partagée).</p>
<p>Dans Unreal, les UObjects utilisent le GC — pas besoin de smart pointers pour eux. Pour les objets non-UObject, Unreal a <code>TUniquePtr&lt;T&gt;</code> et <code>TSharedPtr&lt;T&gt;</code>. La règle pratique : si c'est un UObject, utilise un pointeur brut marqué UPROPERTY. Sinon, envisage un smart pointer.</p>`,
      en:`<p><strong>Raw pointers vs smart pointers.</strong> In modern C++ (outside Unreal), raw pointers are avoided for class members. Smart pointers manage lifetime automatically: <code>std::unique_ptr&lt;T&gt;</code> (exclusive ownership), <code>std::shared_ptr&lt;T&gt;</code> (shared ownership).</p>
<p>In Unreal, UObjects use the GC — no smart pointers needed for them. For non-UObject objects, Unreal has <code>TUniquePtr&lt;T&gt;</code> and <code>TSharedPtr&lt;T&gt;</code>. Practical rule: if it's a UObject, use a raw pointer marked UPROPERTY. Otherwise, consider a smart pointer.</p>`
    }
  },

  ide:{
    demoSteps:[
      {
        label:{ fr:`L'analogie : adresse GPS d'un bâtiment`, en:'The analogy: GPS address of a building' },
        fr:`Un pointeur c'est une adresse mémoire. Dessine : [ health: 100 ] à l'adresse 0x1A2B. Un pointeur "ptr" contient "0x1A2B". Modifier *ptr c'est aller à cette adresse et changer la valeur. Tape : int health = 100; int* ptr = &health; *ptr = 80; cout << health; — affiche 80.`,
        en:`A pointer is a memory address. Draw: [ health: 100 ] at address 0x1A2B. A pointer "ptr" holds "0x1A2B". Modifying *ptr means going to that address and changing the value. Type: int health = 100; int* ptr = &health; *ptr = 80; cout << health; — prints 80.`
      },
      {
        label:{ fr:'* et & — les deux opérateurs', en:'* and & — the two operators' },
        fr:`int* ptr = &score; — ptr contient l'adresse de score. *ptr = 50; — déréférence : va à l'adresse et modifie. Puis montre une référence : int& ref = score; — alias direct, plus simple. ref = 99; modifie score. La différence : une référence ne peut pas être nulle et ne peut pas changer de cible.`,
        en:`int* ptr = &score; — ptr holds the address of score. *ptr = 50; — dereference: go to the address and modify. Then show a reference: int& ref = score; — direct alias, simpler. ref = 99; modifies score. The difference: a reference can't be null and can't change target.`
      },
      {
        label:{ fr:'Passage par référence dans une fonction', en:'Pass by reference in a function' },
        fr:`Montre void increment(int& n) { n++; } — le & dans le paramètre signifie "passe l'original, pas une copie". Appelle : int x = 5; increment(x); cout << x; — affiche 6. Compare avec void increment(int n) (sans &) — x reste 5. Le passage par valeur copie, le passage par référence modifie l'original.`,
        en:`Show void increment(int& n) { n++; } — the & in the parameter means "pass the original, not a copy". Call: int x = 5; increment(x); cout << x; — prints 6. Compare with void increment(int n) (no &) — x stays 5. Pass by value copies, pass by reference modifies the original.`
      },
      {
        label:{ fr:'nullptr — la valeur nulle', en:'nullptr — the null value' },
        fr:`int* ptr = nullptr; — pointeur nul : n'adresse rien. Déréférencer nullptr est un crash garanti (segfault). Toujours vérifier if(ptr != nullptr) avant d'utiliser un pointeur qui pourrait être nul. En C++ old-school, c'était NULL ou 0 — nullptr est typé et plus sûr.`,
        en:`int* ptr = nullptr; — null pointer: points to nothing. Dereferencing nullptr is a guaranteed crash (segfault). Always check if(ptr != nullptr) before using a pointer that might be null. In old-school C++ it was NULL or 0 — nullptr is typed and safer.`
      },
    ],
    discussion:[
      { fr:`En C#, quand tu passes un objet à une méthode, est-ce par valeur ou par référence ? Ça dépend de quoi ?`, en:`In C#, when you pass an object to a method, is it by value or by reference? What does it depend on?` },
    ],
    compare:{
      std:`<span class="cm">// Pointeur</span>
<span class="kw2">int</span> score = <span class="num">100</span>;
<span class="kw2">int</span>* ptr = &amp;score;
*ptr = <span class="num">80</span>;           <span class="cm">// score vaut 80</span>

<span class="cm">// Référence</span>
<span class="kw2">int</span>&amp; ref = score;
ref = <span class="num">60</span>;           <span class="cm">// score vaut 60</span>

<span class="cm">// Passage par référence</span>
<span class="kw2">void</span> <span class="fn2">add</span>(<span class="kw2">int</span>&amp; n) { n++; }`,
      unreal:`<span class="cm">// Pointeur Unreal</span>
<span class="ty">AActor</span>* Enemy = <span class="fn2">FindEnemy</span>();
<span class="kw2">if</span>(Enemy != <span class="kw2">nullptr</span>)
    Enemy-&gt;<span class="fn2">Destroy</span>();

<span class="cm">// Référence dans fonction</span>
<span class="kw2">void</span> <span class="fn2">Heal</span>(<span class="kw2">int32</span>&amp; Health) {
    Health += <span class="num">10</span>;
}
<span class="cm">// -> pour les membres</span>
Enemy-&gt;<span class="fn2">TakeDamage</span>(<span class="num">50</span>);`
    },
    activities:[
      {
        id:'i04_1', type:'predict', xp:15,
        code:`#include &lt;iostream&gt;
void doubleIt(int& n) { n *= 2; }
int main() {
    int x = 5;
    doubleIt(x);
    std::cout &lt;&lt; x &lt;&lt; std::endl;
    return 0;
}`,
        question:{ fr:`n est passé par référence. Quelle est la valeur de x après l'appel ?`, en:`n is passed by reference. What is x's value after the call?` },
        output:`10`,
        explanation:{ fr:`Le & dans int& n signifie que n EST x (alias). Modifier n dans la fonction modifie directement x. Si le paramètre avait été int n (sans &), doubleIt travaillerait sur une copie et x resterait 5.`, en:`The & in int& n means n IS x (alias). Modifying n inside the function directly modifies x. If the parameter were int n (no &), doubleIt would work on a copy and x would stay 5.` }
      },
      {
        id:'i04_2', type:'cpp', xp:30,
        instr:{ fr:`Écris une fonction swap(int& a, int& b) qui échange les valeurs de deux entiers sans variable temporaire externe. Écris le main() qui échange 3 et 7 et affiche le résultat.`, en:`Write a function swap(int& a, int& b) that swaps two integers without an external temporary variable. Write the main() that swaps 3 and 7 and prints the result.` },
        stub:`#include &lt;iostream&gt;
// ta fonction swap ici / your swap function here

int main() {
    int a = 3, b = 7;
    swap(a, b);
    std::cout &lt;&lt; a &lt;&lt; " " &lt;&lt; b &lt;&lt; std::endl;
    return 0;
}`,
        hint:{ fr:`Utilise une variable temporaire int temp à l'intérieur de swap. a et b sont des références — toute modification les affecte directement.`, en:`Use a temporary variable int temp inside swap. a and b are references — any modification directly affects them.` },
        solution:{
          fr:`<pre style="font-family:var(--mono);font-size:1.3rem;line-height:1.8;color:#e0e8ef">#include &lt;iostream&gt;
void swap(int& a, int& b) {
    int temp = a;
    a = b;
    b = temp;
}
int main() {
    int a = 3, b = 7;
    swap(a, b);
    std::cout &lt;&lt; a &lt;&lt; " " &lt;&lt; b &lt;&lt; std::endl;
    return 0;
}</pre><p style="margin-top:.8rem;font-size:1.4rem;color:var(--ch2)">Sortie : <code>7 3</code></p>`,
          en:`<pre style="font-family:var(--mono);font-size:1.3rem;line-height:1.8;color:#e0e8ef">#include &lt;iostream&gt;
void swap(int& a, int& b) {
    int temp = a;
    a = b;
    b = temp;
}
int main() {
    int a = 3, b = 7;
    swap(a, b);
    std::cout &lt;&lt; a &lt;&lt; " " &lt;&lt; b &lt;&lt; std::endl;
    return 0;
}</pre><p style="margin-top:.8rem;font-size:1.4rem;color:var(--ch2)">Output: <code>7 3</code></p>`
        }
      },
      {
        id:'i04_3', type:'bug', xp:25,
        instr:{ fr:`Ce code crashe à l'exécution. Identifie et corrige le problème.`, en:`This code crashes at runtime. Identify and fix the problem.` },
        bugCode:`<span class="kw2">int</span>* <span class="fn2">findValue</span>() {
    <span class="kw2">return</span> <span class="kw2">nullptr</span>;
}
<span class="kw2">int</span> main() {
    <span class="kw2">int</span>* ptr = findValue();
    <span class="bug-line">*ptr = <span class="num">42</span>;</span>
    <span class="kw2">return</span> <span class="num">0</span>;
}`,
        explanation:{ fr:`findValue() retourne nullptr. Déréférencer nullptr (*ptr) est un accès mémoire invalide — crash garanti (segfault). Il faut toujours vérifier if(ptr != nullptr) avant de déréférencer un pointeur dont la nullité n'est pas certaine.`, en:`findValue() returns nullptr. Dereferencing nullptr (*ptr) is an invalid memory access — guaranteed crash (segfault). Always check if(ptr != nullptr) before dereferencing a pointer whose nullness isn't certain.` }
      },
      {
        id:'i04_4', type:'fill', xp:15,
        instr:{ fr:`Complète la déclaration d'un pointeur vers un entier, initialisé à null en C++ moderne :`, en:`Complete the declaration of a pointer to an integer, initialized to null in modern C++:` },
        template:{ fr:'int* ptr = ______;', en:'int* ptr = ______;' },
        answer:'nullptr',
        hint:{ fr:`Le mot-clé C++ moderne pour un pointeur nul — plus sûr que NULL ou 0`, en:`The modern C++ keyword for a null pointer — safer than NULL or 0` }
      },
    ],
  },

  engine:{
    demoSteps:[
      {
        label:{ fr:'GetComponent<>() — déjà un pointeur', en:'GetComponent<>() — already a pointer' },
        fr:`Ouvre un script Unity avec GetComponent<Rigidbody>(). Dis : "Tu récupères déjà une référence à un objet existant — pas une copie. C'est exactement ce que fait un pointeur en C++." Puis ouvre un Actor Unreal avec FindComponentByClass<UStaticMeshComponent>(). Montre la vérification if(Mesh != nullptr) — obligatoire avant toute utilisation.`,
        en:`Open a Unity script with GetComponent<Rigidbody>(). Say: "You're already getting a reference to an existing object — not a copy. That's exactly what a C++ pointer does." Then open an Unreal Actor with FindComponentByClass<UStaticMeshComponent>(). Show the if(Mesh != nullptr) check — mandatory before any use.`
      },
      {
        label:{ fr:'-> pour accéder via un pointeur', en:'-> to access through a pointer' },
        fr:`En C# : enemy.TakeDamage(50) — le point. En C++ si enemy est un pointeur : enemy->TakeDamage(50) — la flèche. Montre que -> est un raccourci pour (*enemy).TakeDamage(50). Tape les deux formes et compile. Insiste : tu verras -> partout dans le code Unreal.`,
        en:`In C#: enemy.TakeDamage(50) — the dot. In C++ if enemy is a pointer: enemy->TakeDamage(50) — the arrow. Show that -> is shorthand for (*enemy).TakeDamage(50). Type both forms and compile. Stress: you'll see -> everywhere in Unreal code.`
      },
      {
        label:{ fr:'Le null check — une habitude obligatoire', en:'The null check — a mandatory habit' },
        fr:`Génère intentionnellement un crash : AActor* Target = nullptr; Target->Destroy();. Montre le crash. Puis corrige avec if(Target != nullptr) Target->Destroy();. En Unreal, IsValid(Target) est encore plus sûr que != nullptr car il vérifie aussi que l'objet n'est pas "pending kill".`,
        en:`Intentionally generate a crash: AActor* Target = nullptr; Target->Destroy();. Show the crash. Then fix with if(Target != nullptr) Target->Destroy();. In Unreal, IsValid(Target) is even safer than != nullptr because it also checks the object isn't "pending kill".`
      },
    ],
    discussion:[
      { fr:`En Unity, tu as probablement eu des NullReferenceException. C'est l'équivalent C# d'un nullptr dereference. Comment détectais-tu ces erreurs et comment les éviteras-tu en C++ Unreal ?`, en:`In Unity, you've probably had NullReferenceExceptions. That's the C# equivalent of a nullptr dereference. How did you detect those errors and how will you avoid them in Unreal C++?` },
    ],
    compare:{
      cs:`<span class="cm">// C# — référence implicite</span>
<span class="ty">Rigidbody</span> rb =
    <span class="fn">GetComponent</span>&lt;<span class="ty">Rigidbody</span>&gt;();
<span class="kw">if</span>(rb != <span class="kw">null</span>)
    rb.<span class="fn">AddForce</span>(<span class="ty">Vector3</span>.up);

<span class="ty">GameObject</span> enemy =
    <span class="fn">FindEnemy</span>();
enemy.<span class="fn">SetActive</span>(<span class="kw">false</span>);`,
      cpp:`<span class="cm">// C++ Unreal — pointeur explicite</span>
<span class="ty">UStaticMeshComponent</span>* Mesh =
    <span class="fn2">FindComponentByClass</span>&lt;<span class="ty">UStaticMeshComponent</span>&gt;();
<span class="kw2">if</span>(<span class="fn2">IsValid</span>(Mesh))
    Mesh-&gt;<span class="fn2">SetSimulatePhysics</span>(<span class="kw2">true</span>);

<span class="ty">AActor</span>* Enemy = <span class="fn2">FindEnemy</span>();
<span class="kw2">if</span>(Enemy != <span class="kw2">nullptr</span>)
    Enemy-&gt;<span class="fn2">SetActorHiddenInGame</span>(<span class="kw2">true</span>);`
    },
    activities:[
      {
        id:'e04_1', type:'quiz', xp:15,
        q:{ fr:`Qu'est-ce que l'opérateur -> fait en C++ ?`, en:`What does the -> operator do in C++?` },
        choices:[
          { t:{ fr:`Il déclare un pointeur`, en:`It declares a pointer` }, c:false, fb:{ fr:`La déclaration d'un pointeur utilise * : AActor* ptr. -> est l'opérateur d'accès à travers un pointeur.`, en:`Pointer declaration uses *: AActor* ptr. -> is the access operator through a pointer.` } },
          { t:{ fr:`Il déréférence le pointeur puis accède à un membre`, en:`It dereferences the pointer then accesses a member` }, c:true, fb:{ fr:`Correct. ptr->Method() est équivalent à (*ptr).Method() — raccourci idiomatique en C++.`, en:`Correct. ptr->Method() is equivalent to (*ptr).Method() — idiomatic C++ shorthand.` } },
          { t:{ fr:`Il vérifie si le pointeur est nul`, en:`It checks if the pointer is null` }, c:false, fb:{ fr:`La vérification se fait avec ptr != nullptr ou IsValid(ptr) — pas avec ->.`, en:`The check uses ptr != nullptr or IsValid(ptr) — not ->.` } },
          { t:{ fr:`Il libère la mémoire du pointeur`, en:`It frees the pointer's memory` }, c:false, fb:{ fr:`La libération mémoire utilise delete (ou le GC Unreal) — pas ->.`, en:`Memory freeing uses delete (or Unreal's GC) — not ->.` } },
        ]
      },
      {
        id:'e04_2', type:'fill', xp:20,
        instr:{ fr:`Complète le null-check Unreal recommandé avant d'utiliser un pointeur Actor :`, en:`Complete the recommended Unreal null-check before using an Actor pointer:` },
        template:{ fr:'if(______(MyActor))', en:'if(______(MyActor))' },
        answer:'IsValid',
        hint:{ fr:`La fonction Unreal qui vérifie nullité ET que l'objet n'est pas en cours de destruction`, en:`The Unreal function that checks for null AND that the object isn't being destroyed` }
      },
      {
        id:'e04_3', type:'bug', xp:30,
        instr:{ fr:`Ce code crashe au runtime. Identifie exactement la ligne responsable.`, en:`This code crashes at runtime. Identify exactly the responsible line.` },
        bugCode:`<span class="ty">AActor</span>* Target = <span class="fn2">GetTarget</span>();
<span class="cm">// GetTarget() peut retourner nullptr</span>
Target<span class="bug-line">-&gt;<span class="fn2">Destroy</span>();</span>`,
        explanation:{ fr:`GetTarget() peut retourner nullptr. Appeler ->Destroy() sur nullptr est un accès mémoire invalide — crash. Correction : if(IsValid(Target)) Target->Destroy(); IsValid() est plus sûr que != nullptr en Unreal car il gère aussi le cas "pending kill".`, en:`GetTarget() can return nullptr. Calling ->Destroy() on nullptr is invalid memory access — crash. Fix: if(IsValid(Target)) Target->Destroy(); IsValid() is safer than != nullptr in Unreal because it also handles "pending kill".` }
      },
      {
        id:'e04_4', type:'engine', xp:40,
        label:{ fr:'Dans Unity + Unreal', en:'In Unity + Unreal' },
        task:{ fr:`1. Dans le Third Person Template Unreal, ouvre le .cpp du personnage. Cherche toutes les utilisations de -> et compte-les. 2. Pour chaque utilisation, identifie si un null-check précède l'accès. 3. Dans le .h, trouve une variable déclarée comme pointeur (*) sans UPROPERTY(). Note ce que ça implique pour le GC.`, en:`1. In Unreal's Third Person Template, open the character's .cpp. Find all uses of -> and count them. 2. For each use, identify if a null-check precedes the access. 3. In the .h, find a variable declared as a pointer (*) without UPROPERTY(). Note what that implies for the GC.` },
        note:{ fr:`Observer les patterns — tu n'as pas à comprendre tout le code.`, en:`Observe the patterns — you don't need to understand all the code.` }
      },
    ],
  },

  homework:{
    core:[
      {diff:'easy', fr:'Écris une fonction swap(int* a, int* b) qui échange les valeurs de deux entiers via des pointeurs. Vérifie avec cout avant et après.', en:'Write a function swap(int* a, int* b) that swaps two integers via pointers. Verify with cout before and after.'},
      {diff:'medium', fr:'Écris une fonction qui prend un tableau d\'entiers et sa taille, et retourne le maximum via un pointeur de retour. Teste avec {3, 7, 1, 9, 4}.', en:'Write a function that takes an array of integers and its size, and returns the maximum via a return pointer. Test with {3, 7, 1, 9, 4}.'},
      {diff:'hard', fr:'Crée une fonction multiReturn(int a, int b, int* sum, int* product) qui retourne void mais écrit la somme et le produit via pointeurs. C\'est le pattern classique avant std::pair.', en:'Create a function multiReturn(int a, int b, int* sum, int* product) that returns void but writes the sum and product via pointers. This is the classic pattern before std::pair.'},
    ],
    ide:[
      {diff:'hard', fr:'Écris intentionnellement un dangling pointer : alloue avec new, libère avec delete, puis essaie de lire la valeur. Note le comportement (indéfini — peut tout faire). Ajoute nullptr après delete.', en:'Intentionally write a dangling pointer: allocate with new, free with delete, then try to read the value. Note the behavior (undefined — can do anything). Add nullptr after delete.'},
    ],
    engine:[
      {diff:'medium', fr:'Dans Unreal, trouve 3 utilisations de -> dans le code du Third Person Template. Pour chacune, identifie quel type de pointeur est déréférencé et pourquoi IsValid() serait utile.', en:'In Unreal, find 3 uses of -> in the Third Person Template code. For each, identify what type of pointer is dereferenced and why IsValid() would be useful.'},
    ],
  },
};
document.addEventListener('DOMContentLoaded',()=>{});
