'use strict';
// Session 06 — Mémoire & Ownership
// IDE arc S06: last of the functions+pointers bloc — new/delete, heap vs stack

const SESSION = {
  id:'s06', num:6, prev:5, next:7, xp:110,
  blocName:{ fr:'Ce qui change vraiment', en:'What Really Changes' },
  blocColor:'#f2f537',
  title:{ fr:'Mémoire & Ownership', en:'Memory & Ownership' },
  sub:{ fr:'Stack, heap, et le garbage collector qu\'Unreal gère pour toi', en:'Stack, heap, and the garbage collector Unreal handles for you' },

  tutor:{
    concept:{
      fr:`C# a un garbage collector — il nettoie la mémoire automatiquement. C++ pur n'en a pas : tu alloues avec new et libères avec delete. Mais Unreal ajoute son propre GC pour les UObjects, ce qui réduit drastiquement la complexité. Comprendre la différence stack/heap et le rôle de UPROPERTY() dans le GC suffit pour 95% du code Unreal.`,
      en:`C# has a garbage collector — it cleans memory automatically. Pure C++ does not: you allocate with new and free with delete. But Unreal adds its own GC for UObjects, which drastically reduces complexity. Understanding the stack/heap difference and UPROPERTY()'s role in the GC covers 95% of Unreal code.`
    },
    deep:{
      fr:`<p><strong>Smart pointers pour les non-UObjects.</strong> En C++ moderne, on évite les pointeurs bruts avec new/delete en dehors d'Unreal. Les smart pointers gèrent la durée de vie automatiquement :</p>
<p><code>TUniquePtr&lt;T&gt;</code> — propriété exclusive, détruit à la sortie du scope.<br>
<code>TSharedPtr&lt;T&gt;</code> — propriété partagée par comptage de références.<br>
<code>TWeakPtr&lt;T&gt;</code> — référence qui ne prolonge pas la durée de vie.</p>
<p>Ces types sont pour les objets non-UObject (structs, systèmes internes). Pour tout ce qui hérite de UObject, UPROPERTY() + le GC Unreal est la bonne approche.</p>`,
      en:`<p><strong>Smart pointers for non-UObjects.</strong> In modern C++, raw pointers with new/delete are avoided outside Unreal. Smart pointers manage lifetime automatically:</p>
<p><code>TUniquePtr&lt;T&gt;</code> — exclusive ownership, destroyed when leaving scope.<br>
<code>TSharedPtr&lt;T&gt;</code> — shared ownership via reference counting.<br>
<code>TWeakPtr&lt;T&gt;</code> — reference that doesn't extend lifetime.</p>
<p>These types are for non-UObject objects (structs, internal systems). For anything inheriting from UObject, UPROPERTY() + Unreal's GC is the right approach.</p>`
    }
  },

  ide:{
    demoSteps:[
      {
        label:{ fr:'Stack vs Heap — deux zones mémoire', en:'Stack vs Heap — two memory regions' },
        fr:`La stack stocke les variables locales d'une fonction. Quand la fonction est appelée, l'espace est réservé automatiquement; quand elle se termine, il est libéré automatiquement. La taille de chaque variable doit être connue à la compilation. Le heap stocke les objets alloués explicitement avec new — leur durée de vie est indépendante des fonctions et persiste jusqu'à un delete explicite. Note : stack et heap sont ici des concepts de gestion mémoire, pas les structures de données du même nom — ne pas confondre les deux usages du terme.`,
        en:`The stack stores local variables for a function. When the function is called, space is reserved automatically; when it returns, it is freed automatically. Each variable's size must be known at compile time. The heap stores objects explicitly allocated with new — their lifetime is independent of any function and persists until an explicit delete. Note: stack and heap here are runtime memory management concepts, not the data structures of the same name — don't conflate the two uses of the term.`
      },
      {
        label:{ fr:'new et delete — démonstration live', en:'new and delete — live demo' },
        fr:`Tape dans main() : int* p = new int(42); cout << *p; delete p; p = nullptr;. Insiste : après delete, TOUJOURS mettre p = nullptr — sinon p est un "dangling pointer" qui pointe vers de la mémoire libérée, et le déréférencer crashe. Montre le leak si on oublie delete — pas visible immédiatement mais mesurable avec Valgrind.`,
        en:`Type in main(): int* p = new int(42); cout << *p; delete p; p = nullptr;. Stress: after delete, ALWAYS set p = nullptr — otherwise p is a "dangling pointer" pointing to freed memory, and dereferencing it crashes. Show the leak if you forget delete — not immediately visible but measurable with Valgrind.`
      },
      {
        label:{ fr:'Stack vs heap en pratique', en:'Stack vs heap in practice' },
        fr:`Montre la différence de lifetime : { int x = 5; } — x est détruite dès la fermeture de l'accolade. int* p = new int(5); — p survit à tous les blocs jusqu'à delete. Insiste : les tableaux dynamiques nécessitent aussi delete[] (pas delete). Montre : int* arr = new int[10]; delete[] arr;`,
        en:`Show the lifetime difference: { int x = 5; } — x is destroyed at the closing brace. int* p = new int(5); — p survives all blocks until delete. Stress: dynamic arrays also need delete[] (not delete). Show: int* arr = new int[10]; delete[] arr;`
      },
    ],
    discussion:[
      { fr:`En C#, le GC rend les memory leaks quasi impossibles. En C++, ils sont silencieux. Qu'est-ce qui t'aide à ne pas oublier un delete ?`, en:`In C#, the GC makes memory leaks nearly impossible. In C++, they're silent. What helps you remember not to forget a delete?` },
    ],
    compare:{
      std:`<span class="cm">// Stack — durée de vie automatique</span>
{
    <span class="kw2">int</span> x = <span class="num">5</span>; <span class="cm">// créé ici</span>
}  <span class="cm">// x détruit ici automatiquement</span>

<span class="cm">// Heap — gestion manuelle</span>
<span class="kw2">int</span>* p = <span class="kw2">new</span> <span class="kw2">int</span>(<span class="num">42</span>);
std::cout &lt;&lt; *p;
<span class="kw2">delete</span> p;
p = <span class="kw2">nullptr</span>; <span class="cm">// toujours !</span>`,
      unreal:`<span class="cm">// Unreal — GC automatique via UPROPERTY</span>
<span class="mac">UPROPERTY</span>()
<span class="ty">AMyActor</span>* Obj = <span class="kw2">nullptr</span>;

<span class="cm">// Crée (équivalent Instantiate)</span>
Obj = GetWorld()-&gt;
    <span class="fn2">SpawnActor</span>&lt;<span class="ty">AMyActor</span>&gt;(Cls, ...);

<span class="cm">// Détruit (équivalent Destroy)</span>
Obj-&gt;<span class="fn2">Destroy</span>();
<span class="cm">// pas de delete — GC gère</span>`
    },
    activities:[
      {
        id:'i06_1', type:'predict', xp:15,
        code:`#include &lt;iostream&gt;
void addOnHeap() {
    int* p = new int(99);
    std::cout &lt;&lt; *p &lt;&lt; std::endl;
    // pas de delete
}
int main() {
    addOnHeap();
    addOnHeap();
    return 0;
}`,
        question:{ fr:`Quelle est la sortie ? Et quel problème ce code a-t-il, invisible à l'exécution ?`, en:`What is the output? And what problem does this code have, invisible at runtime?` },
        output:`99\n99`,
        explanation:{ fr:`Sortie : 99 deux fois. Mais chaque appel alloue un int sur le heap sans le libérer — memory leak × 2. Le programme se termine normalement (l'OS récupère la mémoire à la fin du processus), mais dans un programme long-running ou un jeu, ces leaks s'accumulent et causent des crashs ou ralentissements.`, en:`Output: 99 twice. But each call allocates an int on the heap without freeing it — memory leak × 2. The program exits normally (the OS reclaims memory at process end), but in a long-running program or game, these leaks accumulate and cause crashes or slowdowns.` }
      },
      {
        id:'i06_2', type:'cpp', xp:30,
        instr:{ fr:`Écris une fonction createArray(int size) qui alloue un tableau d'entiers sur le heap, remplit chaque case avec son indice × 2, affiche les valeurs, puis libère correctement la mémoire. Appelle-la avec size = 4.`, en:`Write a function createArray(int size) that allocates an int array on the heap, fills each slot with its index × 2, prints the values, then correctly frees the memory. Call it with size = 4.` },
        stub:`#include &lt;iostream&gt;
void createArray(int size) {
    // alloue avec new[] / allocate with new[]
    // remplis et affiche / fill and print
    // libère avec delete[] / free with delete[]
}
int main() {
    createArray(4);
    return 0;
}`,
        hint:{ fr:`int* arr = new int[size]; ... delete[] arr; (noter le [] pour les tableaux)`, en:`int* arr = new int[size]; ... delete[] arr; (note the [] for arrays)` },
        solution:{
          fr:`<pre style="font-family:var(--mono);font-size:1.3rem;line-height:1.8;color:#e0e8ef">#include &lt;iostream&gt;
void createArray(int size) {
    int* arr = new int[size];
    for(int i = 0; i &lt; size; i++)
        arr[i] = i * 2;
    for(int i = 0; i &lt; size; i++)
        std::cout &lt;&lt; arr[i] &lt;&lt; " ";
    std::cout &lt;&lt; std::endl;
    delete[] arr;
}
int main() {
    createArray(4);
    return 0;
}</pre><p style="margin-top:.8rem;font-size:1.4rem;color:var(--ch2)">Sortie : <code>0 2 4 6</code></p>`,
          en:`<pre style="font-family:var(--mono);font-size:1.3rem;line-height:1.8;color:#e0e8ef">#include &lt;iostream&gt;
void createArray(int size) {
    int* arr = new int[size];
    for(int i = 0; i &lt; size; i++)
        arr[i] = i * 2;
    for(int i = 0; i &lt; size; i++)
        std::cout &lt;&lt; arr[i] &lt;&lt; " ";
    std::cout &lt;&lt; std::endl;
    delete[] arr;
}
int main() {
    createArray(4);
    return 0;
}</pre><p style="margin-top:.8rem;font-size:1.4rem;color:var(--ch2)">Output: <code>0 2 4 6</code></p>`
        }
      },
      {
        id:'i06_3', type:'bug', xp:25,
        instr:{ fr:`Ce code a un problème de gestion mémoire. Identifie-le.`, en:`This code has one memory management problem. Identify it.` },
        bugCode:`<span class="kw2">#include</span> <span class="str">&lt;iostream&gt;</span>
<span class="kw2">int</span>* <span class="fn2">makeValue</span>() {
    <span class="kw2">int</span>* p = <span class="kw2">new</span> <span class="kw2">int</span>(<span class="num">10</span>);
    <span class="kw2">return</span> p;
}
<span class="kw2">int</span> main() {
    <span class="kw2">int</span>* val = <span class="fn2">makeValue</span>();
    std::cout &lt;&lt; *val;
    <span class="kw2">delete</span> val;
    <span class="bug-line">std::cout &lt;&lt; *val;</span>
    <span class="kw2">return</span> <span class="num">0</span>;
}`,
        explanation:{ fr:`Après delete val, val est un dangling pointer — il pointe vers de la mémoire déjà libérée. Accéder à *val est un comportement indéfini : crash possible, données corrompues, ou silence trompeur selon le compilateur et le moment. Correction : ajouter val = nullptr; immédiatement après delete, et ne jamais déréférencer un pointeur sans savoir qu'il est valide.`, en:`After delete val, val is a dangling pointer — it points to memory that has already been freed. Accessing *val is undefined behaviour: possible crash, corrupted data, or deceptive silence depending on the compiler and timing. Fix: add val = nullptr; immediately after delete, and never dereference a pointer without knowing it is valid.` }
      },
      {
        id:'i06_4', type:'fill', xp:15,
        instr:{ fr:`Pour libérer un tableau alloué avec new[], la bonne syntaxe est :`, en:`To free an array allocated with new[], the correct syntax is:` },
        template:{ fr:'______ arr;', en:'______ arr;' },
        answer:'delete[]',
        hint:{ fr:`delete seul est pour un objet unique, delete[] est pour un tableau`, en:`delete alone is for a single object, delete[] is for an array` }
      },
    ],
  },

  engine:{
    demoSteps:[
      {
        label:{ fr:'SpawnActor = Instantiate, Destroy = Destroy', en:'SpawnActor = Instantiate, Destroy = Destroy' },
        fr:`Montre GetWorld()->SpawnActor<AMyActor>(). C'est l'équivalent de Instantiate() en Unity. Puis Obj->Destroy() = Destroy(gameObject). Insiste : pas de delete manuel — le GC Unreal gère. La différence avec C++ brut : aucune gestion mémoire manuelle pour les UObjects.`,
        en:`Show GetWorld()->SpawnActor<AMyActor>(). It's the equivalent of Instantiate() in Unity. Then Obj->Destroy() = Destroy(gameObject). Stress: no manual delete — Unreal's GC handles it. The difference from raw C++: no manual memory management for UObjects.`
      },
      {
        label:{ fr:'UPROPERTY() protège contre le GC', en:'UPROPERTY() protects against the GC' },
        fr:`Le GC Unreal détruit les UObjects qui ne sont plus référencés. Si un pointeur vers un Actor n'est pas marqué UPROPERTY(), le GC peut détruire l'objet sans prévenir — dangling pointer garanti. UPROPERTY() dit au GC "ce pointeur est une référence valide, ne détruis pas l'objet". Demo : déclare un AActor* sans UPROPERTY() et montre le risque.`,
        en:`Unreal's GC destroys UObjects that are no longer referenced. If a pointer to an Actor isn't marked UPROPERTY(), the GC may destroy the object without warning — guaranteed dangling pointer. UPROPERTY() tells the GC "this pointer is a valid reference, don't destroy the object". Demo: declare an AActor* without UPROPERTY() and show the risk.`
      },
      {
        label:{ fr:'IsValid() — plus sûr que != nullptr', en:'IsValid() — safer than != nullptr' },
        fr:`Après Destroy(), un Actor est "pending kill" — il existe encore en mémoire mais est marqué pour suppression. != nullptr sera encore vrai, mais accéder à ses membres crashera. IsValid(ptr) vérifie à la fois nullité ET que l'objet n'est pas pending kill. Montrer la différence concrète.`,
        en:`After Destroy(), an Actor is "pending kill" — it still exists in memory but is marked for removal. != nullptr will still be true, but accessing its members will crash. IsValid(ptr) checks both nullness AND that the object isn't pending kill. Show the concrete difference.`
      },
    ],
    discussion:[
      { fr:`Unity cache complètement la gestion mémoire. Unreal la montre partiellement. C++ pur la montre entièrement. Est-ce que comprendre ce qui se passe "sous le capot" change ta façon d'écrire du code ?`, en:`Unity completely hides memory management. Unreal partially shows it. Pure C++ shows it entirely. Does understanding what happens "under the hood" change how you write code?` },
    ],
    compare:{
      cs:`<span class="cm">// C# Unity — GC automatique</span>
<span class="ty">GameObject</span> obj =
    <span class="ty">Instantiate</span>(prefab);
<span class="cm">// Pas de delete manuel</span>
<span class="ty">Destroy</span>(obj);`,
      cpp:`<span class="cm">// Unreal — GC via UPROPERTY</span>
<span class="mac">UPROPERTY</span>()
<span class="ty">AMyActor</span>* Obj = <span class="kw2">nullptr</span>;
Obj = GetWorld()-&gt;
    <span class="fn2">SpawnActor</span>&lt;<span class="ty">AMyActor</span>&gt;(...);
<span class="kw2">if</span>(<span class="fn2">IsValid</span>(Obj))
    Obj-&gt;<span class="fn2">Destroy</span>();`
    },
    activities:[
      {
        id:'e06_1', type:'quiz', xp:15,
        q:{ fr:`Pourquoi marquer un pointeur UObject avec UPROPERTY() est-il important pour la gestion mémoire dans Unreal ?`, en:`Why is marking a UObject pointer with UPROPERTY() important for memory management in Unreal?` },
        choices:[
          { t:{ fr:`Pour le rendre visible dans l'éditeur`, en:`To make it visible in the editor` }, c:false, fb:{ fr:`UPROPERTY() peut rendre une variable visible dans l'éditeur, mais ce n'est pas sa raison d'être pour la mémoire.`, en:`UPROPERTY() can make a variable visible in the editor, but that's not its memory management purpose.` } },
          { t:{ fr:`Pour que le GC Unreal suive le pointeur et ne détruise pas l'objet référencé`, en:`So that Unreal's GC tracks the pointer and doesn't destroy the referenced object` }, c:true, fb:{ fr:`Correct. Sans UPROPERTY(), le GC ne voit pas le pointeur et peut détruire l'objet — dangling pointer garanti.`, en:`Correct. Without UPROPERTY(), the GC doesn't see the pointer and may destroy the object — guaranteed dangling pointer.` } },
          { t:{ fr:`Pour éviter d'avoir à appeler delete`, en:`To avoid having to call delete` }, c:false, fb:{ fr:`Les UObjects ne s'utilisent jamais avec delete — c'est Destroy() ou le GC. UPROPERTY() est pour que le GC suive l'objet.`, en:`UObjects are never used with delete — it's Destroy() or the GC. UPROPERTY() is so the GC tracks the object.` } },
          { t:{ fr:`Pour activer la réplication réseau`, en:`To enable network replication` }, c:false, fb:{ fr:`UPROPERTY() peut activer la réplication si on ajoute le specifier Replicated, mais ce n'est pas sa fonction principale ici.`, en:`UPROPERTY() can enable replication with the Replicated specifier, but that's not its main function here.` } },
        ]
      },
      {
        id:'e06_2', type:'fill', xp:20,
        instr:{ fr:`Complète la macro nécessaire pour protéger ce pointeur Actor contre la destruction par le GC Unreal :`, en:`Complete the macro needed to protect this Actor pointer from Unreal's GC destruction:` },
        template:{ fr:'______()\nAActor* MyTarget;', en:'______()\nAActor* MyTarget;' },
        answer:'UPROPERTY',
        hint:{ fr:`La macro Unreal qui expose une variable au système de réflexion et au GC`, en:`The Unreal macro that exposes a variable to the reflection system and GC` }
      },
      {
        id:'e06_3', type:'bug', xp:30,
        instr:{ fr:`Ce code a un risque de crash silencieux. Identifie le problème.`, en:`This code has a silent crash risk. Identify the problem.` },
        bugCode:`<span class="ty">AActor</span>* Enemy = <span class="fn2">SpawnEnemy</span>();
Enemy-&gt;<span class="fn2">TakeDamage</span>(<span class="num">50</span>);
Enemy-&gt;<span class="fn2">Destroy</span>();
<span class="cm">// ... plus tard dans Tick() ...</span>
<span class="kw2">if</span>(<span class="bug-line">Enemy != <span class="kw2">nullptr</span></span>)
    Enemy-&gt;<span class="fn2">Heal</span>(<span class="num">10</span>);`,
        explanation:{ fr:`Après Destroy(), Enemy n'est pas null — il pointe encore vers la mémoire de l'Actor, mais cet Actor est "pending kill". != nullptr vaut true, donc la condition passe et Heal() crashe. La correction : utiliser if(IsValid(Enemy)) qui vérifie à la fois nullité et l'état "pending kill".`, en:`After Destroy(), Enemy isn't null — it still points to the Actor's memory, but that Actor is "pending kill". != nullptr is true, so the condition passes and Heal() crashes. The fix: use if(IsValid(Enemy)) which checks both null and "pending kill" state.` }
      },
      {
        id:'e06_4', type:'engine', xp:40,
        label:{ fr:'Dans Unreal', en:'In Unreal' },
        task:{ fr:`1. Dans le Third Person Character C++ template, ouvre le .h. Trouve toutes les variables déclarées avec UPROPERTY() qui sont des pointeurs (contiennent *). Note lesquelles n'ont pas UPROPERTY() — s'il y en a. 2. Dans le .cpp, trouve où SpawnActor ou CreateDefaultSubobject est utilisé. 3. Crée un Actor vide avec un UPROPERTY() AActor* Target. Dans BeginPlay(), assigne Target = GetWorld()->SpawnActor<AActor>(...) et appelle Destroy() dans EndPlay(). Compile et teste.`, en:`1. In the Third Person Character C++ template, open the .h. Find all UPROPERTY() variables that are pointers (contain *). Note any without UPROPERTY() — if there are any. 2. In the .cpp, find where SpawnActor or CreateDefaultSubobject is used. 3. Create an empty Actor with a UPROPERTY() AActor* Target. In BeginPlay(), assign Target = GetWorld()->SpawnActor<AActor>(...) and call Destroy() in EndPlay(). Compile and test.` },
        note:{ fr:`Observer les patterns de gestion mémoire dans du vrai code Unreal.`, en:`Observe memory management patterns in real Unreal code.` }
      },
    ],
  },

  homework:{
    core:[
      {diff:'easy', fr:'Écris un programme qui alloue un tableau de 5 ints avec new[], les remplit, les affiche, puis les libère avec delete[]. Ajoute nullptr après le delete.', en:'Write a program that allocates an array of 5 ints with new[], fills them, prints them, then frees them with delete[]. Add nullptr after delete.'},
      {diff:'medium', fr:'Crée une classe Resource qui alloue un int* dans son constructeur et le libère dans son destructeur. Teste la durée de vie en imbriquant des blocs {}.', en:'Create a Resource class that allocates an int* in its constructor and frees it in its destructor. Test the lifetime by nesting {} blocks.'},
      {diff:'hard', fr:'Réécris la classe Resource en utilisant std::unique_ptr<int> au lieu d\'un raw pointer. Compare : qu\'est-ce qui disparaît ? Pourquoi préfère-t-on les smart pointers en C++ moderne ?', en:'Rewrite the Resource class using std::unique_ptr<int> instead of a raw pointer. Compare: what disappears? Why are smart pointers preferred in modern C++?'},
    ],
    ide:[
      {diff:'hard', fr:'Écris un memory leak intentionnel (new sans delete), compile avec g++ -fsanitize=address, et lis le rapport d\'AddressSanitizer. C\'est l\'outil standard pour détecter les leaks.', en:'Write an intentional memory leak (new without delete), compile with g++ -fsanitize=address, and read the AddressSanitizer report. This is the standard tool for detecting leaks.'},
    ],
    engine:[
      {diff:'medium', fr:'Dans Unreal, identifie 3 UPROPERTY() dans le Third Person Character. Pour chacun, explique pourquoi UPROPERTY() est nécessaire pour que le GC ne le supprime pas prématurément.', en:'In Unreal, identify 3 UPROPERTY() in the Third Person Character. For each, explain why UPROPERTY() is necessary so the GC doesn\'t prematurely destroy it.'},
    ],
  },
};
document.addEventListener('DOMContentLoaded',()=>{});

// ── Further reading — displayed by engine if SESSION.references exists ──
const REFERENCES = [
  {
    label:{ fr:'Stack vs Heap en C++ — cppreference (stockage automatique vs dynamique)', en:'Stack vs Heap in C++ — cppreference (automatic vs dynamic storage)' },
    url:'https://en.cppreference.com/w/cpp/language/storage_duration',
    note:{ fr:'Définitions formelles des durées de stockage. Les termes "stack" et "heap" y apparaissent sous "automatic" et "dynamic" — c\'est le vocabulaire exact du standard.', en:'Formal definitions of storage durations. "Stack" and "heap" appear as "automatic" and "dynamic" — the exact vocabulary of the standard.' }
  },
  {
    label:{ fr:'Stack (structure de données) — Wikipedia', en:'Stack (data structure) — Wikipedia' },
    url:'https://en.wikipedia.org/wiki/Stack_(abstract_data_type)',
    note:{ fr:'Pour ne pas confondre avec la mémoire stack : la structure de données pile est un concept séparé. La mémoire stack s\'appelle ainsi parce qu\'elle se comporte comme une pile LIFO — mais ce n\'est pas nécessaire de maîtriser les détails internes pour écrire du C++ correct.', en:'Not to be confused with the memory stack: the stack data structure is a separate concept. The memory stack is called that because it behaves like a LIFO stack — but you don\'t need to master the internals to write correct C++.' }
  },
  {
    label:{ fr:'new et delete — cppreference', en:'new and delete — cppreference' },
    url:'https://en.cppreference.com/w/cpp/memory/new/operator_new',
    note:{ fr:'Référence complète sur l\'allocation dynamique en C++.', en:'Complete reference on dynamic allocation in C++.' }
  },
  {
    label:{ fr:'AddressSanitizer — détection de leaks et dangling pointers', en:'AddressSanitizer — leak and dangling pointer detection' },
    url:'https://github.com/google/sanitizers/wiki/AddressSanitizer',
    note:{ fr:'L\'outil standard pour trouver les erreurs mémoire en C++. Compile avec -fsanitize=address.', en:'The standard tool for finding memory errors in C++. Compile with -fsanitize=address.' }
  },
  {
    label:{ fr:'Smart pointers (unique_ptr, shared_ptr) — cppreference', en:'Smart pointers (unique_ptr, shared_ptr) — cppreference' },
    url:'https://en.cppreference.com/w/cpp/memory',
    note:{ fr:'En C++ moderne, les raw pointers avec delete manuel sont évités. Les smart pointers gèrent la durée de vie automatiquement.', en:'In modern C++, raw pointers with manual delete are avoided. Smart pointers manage lifetime automatically.' }
  },
];

