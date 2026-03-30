'use strict';
// Session 13 — Blueprint ↔ C++
// IDE arc S13: first templates — template function, then template class

const SESSION = {
  id:'s13', num:13, prev:12, next:14, xp:130,
  blocName:{ fr:'Patterns de jeu', en:'Game Patterns' },
  blocColor:'#fe6c06',
  title:{ fr:'Blueprint ↔ C++', en:'Blueprint ↔ C++' },
  sub:{ fr:'Quand utiliser quoi — exposer du C++ aux Blueprints et vice versa', en:'When to use which — exposing C++ to Blueprints and vice versa' },

  tutor:{
    concept:{
      fr:`Blueprint et C++ ne sont pas en compétition — ils se complètent. C++ pour la logique critique (physique, IA, systèmes réseau), Blueprint pour le prototypage rapide, les animations, et les ajustements des designers. UPROPERTY() et UFUNCTION() sont le pont : ils exposent des variables et méthodes C++ aux Blueprints. BlueprintImplementableEvent va dans l'autre sens : C++ appelle une fonction définie dans Blueprint.`,
      en:`Blueprint and C++ aren't competing — they complement each other. C++ for performance-critical logic (physics, AI, network systems), Blueprint for rapid prototyping, animations, and designer tweaks. UPROPERTY() and UFUNCTION() are the bridge: they expose C++ variables and methods to Blueprints. BlueprintImplementableEvent goes the other direction: C++ calls a function defined in Blueprint.`
    },
    deep:{
      fr:`<p><strong>BlueprintNativeEvent.</strong> Entre BlueprintCallable (C++ seulement) et BlueprintImplementableEvent (Blueprint seulement), il y a BlueprintNativeEvent : la fonction a une implémentation C++ par défaut, mais peut être surchargée en Blueprint.</p>
<pre style="background:#0d1f27;padding:1rem;border-radius:4px;font-size:1.25rem;line-height:1.7;color:#e0e8ef"><span class="mac">UFUNCTION</span>(BlueprintNativeEvent)
<span class="kw2">void</span> <span class="fn2">OnDeath</span>();
<span class="kw2">virtual void</span> <span class="fn2">OnDeath_Implementation</span>();</pre>
<p>Le Blueprint peut surcharger OnDeath() et appeler la version C++ avec "Call Parent Function". Pattern idéal pour les comportements par défaut que les designers peuvent personnaliser.</p>`,
      en:`<p><strong>BlueprintNativeEvent.</strong> Between BlueprintCallable (C++ only) and BlueprintImplementableEvent (Blueprint only), there's BlueprintNativeEvent: the function has a default C++ implementation but can be overridden in Blueprint.</p>
<pre style="background:#0d1f27;padding:1rem;border-radius:4px;font-size:1.25rem;line-height:1.7;color:#e0e8ef"><span class="mac">UFUNCTION</span>(BlueprintNativeEvent)
<span class="kw2">void</span> <span class="fn2">OnDeath</span>();
<span class="kw2">virtual void</span> <span class="fn2">OnDeath_Implementation</span>();</pre>
<p>The Blueprint can override OnDeath() and call the C++ version with "Call Parent Function". Ideal pattern for default behaviors that designers can customize.</p>`
    }
  },

  ide:{
    demoSteps:[
      {
        label:{ fr:'Première fonction template', en:'First template function' },
        fr:`Dans main.cpp : template<typename T> T maxOf(T a, T b) { return a > b ? a : b; }. Appelle : maxOf(3, 7) → 7, maxOf(3.14f, 2.7f) → 3.14, maxOf(string("chat"), string("chien")) → "chien". Le compilateur génère une version concrète pour chaque type utilisé. Compare avec une version C# générique : T Max<T>(T a, T b) — syntaxe différente, même idée.`,
        en:`In main.cpp: template<typename T> T maxOf(T a, T b) { return a > b ? a : b; }. Call: maxOf(3, 7) → 7, maxOf(3.14f, 2.7f) → 3.14, maxOf(string("cat"), string("dog")) → "dog". The compiler generates a concrete version for each type used. Compare with C# generics: T Max<T>(T a, T b) — different syntax, same idea.`
      },
      {
        label:{ fr:'Template avec contrainte — static_assert', en:'Template with constraint — static_assert' },
        fr:`Ajoute une contrainte sur le type : template<typename T> T clamp(T val, T lo, T hi) { static_assert(std::is_arithmetic<T>::value, "clamp requires numeric type"); return val < lo ? lo : val > hi ? hi : val; }. static_assert est évalué à la compilation — si on appelle clamp avec une string, on obtient une erreur claire plutôt qu'une erreur cryptique. C++20 a les "Concepts" pour ça, mais static_assert fonctionne en C++17.`,
        en:`Add a type constraint: template<typename T> T clamp(T val, T lo, T hi) { static_assert(std::is_arithmetic<T>::value, "clamp requires numeric type"); return val < lo ? lo : val > hi ? hi : val; }. static_assert is evaluated at compile time — calling clamp with a string gives a clear error rather than a cryptic one. C++20 has "Concepts" for this, but static_assert works in C++17.`
      },
      {
        label:{ fr:'Classe template — Stack<T>', en:'Template class — Stack<T>' },
        fr:`Crée une classe template Stack<T> simple dans un fichier stack.h (tout dans le .h — les templates doivent être visibles à la compilation) : template<typename T> class Stack { vector<T> data; public: void push(T v){data.push_back(v);} T pop(){T v=data.back();data.pop_back();return v;} bool empty()const{return data.empty();} };. Utilise Stack<int> et Stack<string> dans main.cpp.`,
        en:`Create a simple template class Stack<T> in a stack.h file (all in .h — templates must be visible at compile time): template<typename T> class Stack { vector<T> data; public: void push(T v){data.push_back(v);} T pop(){T v=data.back();data.pop_back();return v;} bool empty()const{return data.empty();} };. Use Stack<int> and Stack<string> in main.cpp.`
      },
    ],
    discussion:[
      { fr:`Les templates C++ et les génériques C# ont la même motivation (réutiliser du code pour plusieurs types), mais fonctionnent différemment à la compilation. Quelle est la différence principale ?`, en:`C++ templates and C# generics have the same motivation (reusing code for multiple types), but work differently at compile time. What is the main difference?` },
    ],
    compare:{
      std:`<span class="cm">// C++ — template function</span>
<span class="kw2">template</span>&lt;<span class="kw2">typename</span> T&gt;
T <span class="fn2">maxOf</span>(T a, T b) {
    <span class="kw2">return</span> a &gt; b ? a : b;
}
<span class="cm">// template class</span>
<span class="kw2">template</span>&lt;<span class="kw2">typename</span> T&gt;
<span class="kw2">class</span> <span class="ty">Stack</span> {
    std::<span class="ty">vector</span>&lt;T&gt; data;
<span class="kw2">public</span>:
    <span class="kw2">void</span> <span class="fn2">push</span>(T v) { data.<span class="fn2">push_back</span>(v); }
    T <span class="fn2">pop</span>() { <span class="cm">/* ... */</span> }
};`,
      unreal:`<span class="cm">// Unreal — TArray<T>, TMap<K,V></span>
<span class="ty">TArray</span>&lt;<span class="kw2">int32</span>&gt; Scores;
Scores.<span class="fn2">Add</span>(<span class="num">100</span>);

<span class="ty">TMap</span>&lt;<span class="ty">FString</span>,<span class="kw2">int32</span>&gt; PlayerMap;
PlayerMap.<span class="fn2">Add</span>(<span class="mac">TEXT</span>(<span class="str">"Alice"</span>),<span class="num">50</span>);

<span class="cm">// SpawnActor<T> est aussi un template</span>
<span class="kw2">auto</span>* Gun = GetWorld()-&gt;
    <span class="fn2">SpawnActor</span>&lt;<span class="ty">AWeapon</span>&gt;(
        AWeapon::<span class="kw2">static</span>Class(), ...);`
    },
    activities:[
      {
        id:'i13_1', type:'predict', xp:15,
        code:`#include &lt;iostream&gt;
template&lt;typename T&gt;
T add(T a, T b) { return a + b; }

int main() {
    std::cout &lt;&lt; add(3, 4) &lt;&lt; " ";
    std::cout &lt;&lt; add(1.5f, 2.5f) &lt;&lt; " ";
    std::cout &lt;&lt; add(std::string("foo"), std::string("bar"));
}`,
        question:{ fr:`Combien de versions de add() le compilateur génère-t-il, et quelle est la sortie ?`, en:`How many versions of add() does the compiler generate, and what is the output?` },
        output:`7 4 foobar`,
        explanation:{ fr:`Trois versions : add<int>, add<float>, add<std::string>. Chacune est générée à la compilation pour le type utilisé. L'opérateur + fonctionne pour int (7), float (4.0), et string (concaténation "foobar"). Si on appelait add avec un type sans +, le compilateur produirait une erreur.`, en:`Three versions: add<int>, add<float>, add<std::string>. Each is generated at compile time for the type used. The + operator works for int (7), float (4.0), and string (concatenation "foobar"). If you called add with a type without +, the compiler would produce an error.` }
      },
      {
        id:'i13_2', type:'cpp', xp:35,
        instr:{ fr:`Écris une fonction template clamp<T>(T val, T lo, T hi) qui retourne val contraint entre lo et hi inclus. Teste avec clamp(15, 0, 10) → 10, clamp(-5, 0, 10) → 0, clamp(7, 0, 10) → 7, clamp(3.14f, 0.0f, 2.0f) → 2.0f.`, en:`Write a template function clamp<T>(T val, T lo, T hi) that returns val clamped between lo and hi inclusive. Test with clamp(15, 0, 10) → 10, clamp(-5, 0, 10) → 0, clamp(7, 0, 10) → 7, clamp(3.14f, 0.0f, 2.0f) → 2.0f.` },
        stub:`#include &lt;iostream&gt;
// ta fonction template clamp ici / your template clamp here

int main() {
    std::cout &lt;&lt; clamp(15, 0, 10)    &lt;&lt; " ";
    std::cout &lt;&lt; clamp(-5, 0, 10)    &lt;&lt; " ";
    std::cout &lt;&lt; clamp(7, 0, 10)     &lt;&lt; " ";
    std::cout &lt;&lt; clamp(3.14f, 0.0f, 2.0f) &lt;&lt; std::endl;
    return 0;
}`,
        hint:{ fr:`if(val < lo) return lo; if(val > hi) return hi; return val;`, en:`if(val < lo) return lo; if(val > hi) return hi; return val;` },
        solution:{
          fr:`<pre style="font-family:var(--mono);font-size:1.3rem;line-height:1.8;color:#e0e8ef">template&lt;typename T&gt;
T clamp(T val, T lo, T hi) {
    if(val &lt; lo) return lo;
    if(val &gt; hi) return hi;
    return val;
}</pre><p style="margin-top:.8rem;font-size:1.4rem;color:var(--ch2)">Sortie : <code>10 0 7 2</code></p>`,
          en:`<pre style="font-family:var(--mono);font-size:1.3rem;line-height:1.8;color:#e0e8ef">template&lt;typename T&gt;
T clamp(T val, T lo, T hi) {
    if(val &lt; lo) return lo;
    if(val &gt; hi) return hi;
    return val;
}</pre><p style="margin-top:.8rem;font-size:1.4rem;color:var(--ch2)">Output: <code>10 0 7 2</code></p>`
        }
      },
      {
        id:'i13_3', type:'bug', xp:20,
        instr:{ fr:`Ce code template compilera mais pas pour les bonnes raisons. Identifie le problème de conception.`, en:`This template code will compile but not for the right reasons. Identify the design problem.` },
        bugCode:`<span class="kw2">template</span>&lt;<span class="kw2">typename</span> T&gt;
T <span class="fn2">double_it</span>(T val) {
    <span class="kw2">return</span> <span class="bug-line">val + val</span>;
}
<span class="cm">// Utilisé avec :</span>
<span class="fn2">double_it</span>(<span class="ty">std::string</span>(<span class="str">"test"</span>));`,
        explanation:{ fr:`double_it("test") retourne "testtest" — la concaténation de string avec + fonctionne, mais ce n'est probablement pas l'intention. La fonction est censée doubler numériquement. Sans contrainte (static_assert ou concept), le template accepte n'importe quel type qui supporte +, y compris string. Correction : ajouter static_assert(std::is_arithmetic<T>::value, "numeric type required");`, en:`double_it("test") returns "testtest" — string concatenation with + works, but that's probably not the intent. The function is meant to numerically double. Without a constraint (static_assert or concept), the template accepts any type supporting +, including string. Fix: add static_assert(std::is_arithmetic<T>::value, "numeric type required");` }
      },
      {
        id:'i13_4', type:'fill', xp:15,
        instr:{ fr:`Pour déclarer une fonction template en C++ qui accepte n'importe quel type T :`, en:`To declare a template function in C++ that accepts any type T:` },
        template:{ fr:'______ <typename T>\nT identity(T val) { return val; }', en:'______ <typename T>\nT identity(T val) { return val; }' },
        answer:'template',
        hint:{ fr:`Le mot-clé C++ qui introduit un paramètre de type générique`, en:`The C++ keyword that introduces a generic type parameter` }
      },
    ],
  },

  engine:{
    demoSteps:[
      {
        label:{ fr:'C++ → Blueprint : BlueprintCallable', en:'C++ → Blueprint: BlueprintCallable' },
        fr:`Dans le .h d'un Actor, ajoute : UFUNCTION(BlueprintCallable, Category="Gameplay") void SetHealth(int32 NewHealth); UPROPERTY(BlueprintReadOnly, Category="Gameplay") int32 Health = 100;. Compile. Crée un Blueprint enfant de cet Actor. Dans l'EventGraph, Event BeginPlay → nœud SetHealth(80). Joue et observe. C'est l'API que tu offres aux designers — ils peuvent appeler SetHealth sans voir le C++.`,
        en:`In an Actor's .h, add: UFUNCTION(BlueprintCallable, Category="Gameplay") void SetHealth(int32 NewHealth); UPROPERTY(BlueprintReadOnly, Category="Gameplay") int32 Health = 100;. Compile. Create a Blueprint child of this Actor. In the EventGraph, Event BeginPlay → SetHealth(80) node. Play and observe. This is the API you offer to designers — they can call SetHealth without seeing the C++.`
      },
      {
        label:{ fr:'Blueprint → C++ : BlueprintImplementableEvent', en:'Blueprint → C++: BlueprintImplementableEvent' },
        fr:`Dans le .h, ajoute : UFUNCTION(BlueprintImplementableEvent) void OnHealthChanged(int32 OldHealth, int32 NewHealth);. Dans SetHealth() du .cpp : OnHealthChanged(Health, NewHealth); Health = NewHealth;. Le .cpp appelle la fonction, mais le Blueprint en est l'implémentation. Dans le Blueprint enfant, Event OnHealthChanged apparaît dans la palette — le designer peut y mettre des effets visuels ou sonores.`,
        en:`In the .h, add: UFUNCTION(BlueprintImplementableEvent) void OnHealthChanged(int32 OldHealth, int32 NewHealth);. In SetHealth() in the .cpp: OnHealthChanged(Health, NewHealth); Health = NewHealth;. The .cpp calls the function, but Blueprint implements it. In the child Blueprint, Event OnHealthChanged appears in the palette — the designer can add visual or sound effects there.`
      },
      {
        label:{ fr:'Quand choisir C++ vs Blueprint', en:'When to choose C++ vs Blueprint' },
        fr:`Règle pratique : C++ pour la logique qui doit être fiable, testable, et performante (systèmes de combat, networking, physique custom). Blueprint pour ce qui change souvent et ce que les designers pilotent (UI, animations, comportements visuels). Le piège classique : mettre trop de logique en Blueprint → graphes illisibles. Mettre trop en C++ → designers bloqués. Trouver la ligne de partage fait partie du design d'architecture.`,
        en:`Practical rule: C++ for logic that must be reliable, testable, and performant (combat systems, networking, custom physics). Blueprint for things that change frequently and that designers drive (UI, animations, visual behaviors). The classic trap: too much logic in Blueprint → unreadable graphs. Too much in C++ → designers blocked. Finding the dividing line is part of architecture design.`
      },
    ],
    discussion:[
      { fr:`Dans un projet en équipe, qui écrit du C++ et qui écrit du Blueprint ? Comment définir une frontière claire sans que les deux équipes se bloquent mutuellement ?`, en:`In a team project, who writes C++ and who writes Blueprint? How do you define a clear boundary without both teams blocking each other?` },
    ],
    compare:{
      cs:`<span class="cm">// Unity — SerializeField + méthode publique</span>
[<span class="ty">SerializeField</span>]
<span class="kw">private int</span> health = <span class="num">100</span>;

<span class="kw">public void</span> <span class="fn">SetHealth</span>(<span class="kw">int</span> v) {
    health = v;
    <span class="fn">OnHealthChanged</span>?.Invoke(v);
}
<span class="cm">// event C# — pas de Blueprint equiv.</span>`,
      cpp:`<span class="cm">// Unreal — UPROPERTY + UFUNCTION</span>
<span class="mac">UPROPERTY</span>(BlueprintReadOnly)
<span class="kw2">int32</span> Health = <span class="num">100</span>;

<span class="mac">UFUNCTION</span>(BlueprintCallable)
<span class="kw2">void</span> <span class="fn2">SetHealth</span>(<span class="kw2">int32</span> v);

<span class="cm">// Blueprint l'implémente</span>
<span class="mac">UFUNCTION</span>(BlueprintImplementableEvent)
<span class="kw2">void</span> <span class="fn2">OnHealthChanged</span>(<span class="kw2">int32</span> Old,
    <span class="kw2">int32</span> New);`
    },
    activities:[
      {
        id:'e13_1', type:'quiz', xp:15,
        q:{ fr:`Quelle est la différence entre UFUNCTION(BlueprintCallable) et UFUNCTION(BlueprintImplementableEvent) ?`, en:`What is the difference between UFUNCTION(BlueprintCallable) and UFUNCTION(BlueprintImplementableEvent)?` },
        choices:[
          { t:{ fr:`BlueprintCallable = C++ peut appeler Blueprint ; BlueprintImplementableEvent = Blueprint peut appeler C++`, en:`BlueprintCallable = C++ can call Blueprint; BlueprintImplementableEvent = Blueprint can call C++` }, c:false,
            fb:{ fr:`C'est l'inverse — BlueprintCallable expose une méthode C++ aux Blueprints, BlueprintImplementableEvent demande au Blueprint de l'implémenter.`, en:`It's the opposite — BlueprintCallable exposes a C++ method to Blueprints, BlueprintImplementableEvent asks Blueprint to implement it.` } },
          { t:{ fr:`BlueprintCallable = Blueprint peut appeler cette méthode C++ ; BlueprintImplementableEvent = C++ déclare la signature, Blueprint l'implémente`, en:`BlueprintCallable = Blueprint can call this C++ method; BlueprintImplementableEvent = C++ declares the signature, Blueprint implements it` }, c:true,
            fb:{ fr:`Correct. BlueprintCallable = C++ fournit l'implémentation. BlueprintImplementableEvent = Blueprint fournit l'implémentation.`, en:`Correct. BlueprintCallable = C++ provides the implementation. BlueprintImplementableEvent = Blueprint provides the implementation.` } },
          { t:{ fr:`Ce sont deux façons d'écrire la même chose`, en:`They're two ways of writing the same thing` }, c:false,
            fb:{ fr:`Non — ils vont dans des directions opposées : C++→BP ou BP→C++.`, en:`No — they go in opposite directions: C++→BP or BP→C++.` } },
          { t:{ fr:`BlueprintImplementableEvent est plus rapide que BlueprintCallable`, en:`BlueprintImplementableEvent is faster than BlueprintCallable` }, c:false,
            fb:{ fr:`Les performances ne sont pas la distinction pertinente ici — c'est la direction du flux de contrôle qui compte.`, en:`Performance isn't the relevant distinction here — it's the direction of control flow that matters.` } },
        ]
      },
      {
        id:'e13_2', type:'fill', xp:20,
        instr:{ fr:`Pour déclarer une méthode que C++ appellera mais dont l'implémentation sera définie dans Blueprint :`, en:`To declare a method that C++ will call but whose implementation will be defined in Blueprint:` },
        template:{ fr:'UFUNCTION(______)\nvoid OnDeath();', en:'UFUNCTION(______)\nvoid OnDeath();' },
        answer:'BlueprintImplementableEvent',
        hint:{ fr:`Le spécificateur qui inverse la direction : C++ déclare, Blueprint implémente`, en:`The specifier that reverses direction: C++ declares, Blueprint implements` }
      },
      {
        id:'e13_3', type:'bug', xp:25,
        instr:{ fr:`Ce BlueprintImplementableEvent ne fonctionnera jamais. Identifie le problème.`, en:`This BlueprintImplementableEvent will never work. Identify the problem.` },
        bugCode:`<span class="mac">UFUNCTION</span>(BlueprintImplementableEvent)
<span class="kw2">void</span> <span class="fn2">OnPickup</span>();

<span class="cm">// Dans le .cpp :</span>
<span class="kw2">void</span> <span class="ty">AItem</span>::<span class="fn2">OnPickup</span>() {
    <span class="bug-line"><span class="cm">// implémentation C++</span>
    <span class="mac">UE_LOG</span>(LogTemp, Display,
        <span class="mac">TEXT</span>(<span class="str">"Ramassé"</span>));
</span>}`,
        explanation:{ fr:`BlueprintImplementableEvent ne doit PAS avoir d'implémentation dans le .cpp — c'est Blueprint qui l'implémente. Ajouter un corps C++ est une erreur de compilation. Si on veut une implémentation C++ par défaut ET une surcharge Blueprint, utiliser BlueprintNativeEvent à la place, et nommer l'implémentation OnPickup_Implementation().`, en:`BlueprintImplementableEvent must NOT have a C++ implementation — Blueprint implements it. Adding a C++ body is a compilation error. If you want a default C++ implementation AND a Blueprint override, use BlueprintNativeEvent instead, and name the implementation OnPickup_Implementation().` }
      },
      {
        id:'e13_4', type:'engine', xp:40,
        label:{ fr:'Dans Unreal', en:'In Unreal' },
        task:{ fr:`1. Crée un Actor C++ "HealthActor" avec UPROPERTY(BlueprintReadOnly) int32 Health = 100 et UFUNCTION(BlueprintCallable) void Heal(int32 Amount). 2. Ajoute UFUNCTION(BlueprintImplementableEvent) void OnHealed(int32 Amount) que Heal() appelle avant de modifier Health. 3. Crée un Blueprint enfant. Dans l'Event OnHealed, ajoute un Print String qui affiche le montant de soin. 4. Depuis le Level Blueprint, récupère l'actor et appelle Heal(50) au Begin Play. Vérifie que le Blueprint reçoit l'événement.`, en:`1. Create a C++ Actor "HealthActor" with UPROPERTY(BlueprintReadOnly) int32 Health = 100 and UFUNCTION(BlueprintCallable) void Heal(int32 Amount). 2. Add UFUNCTION(BlueprintImplementableEvent) void OnHealed(int32 Amount) that Heal() calls before modifying Health. 3. Create a child Blueprint. In the OnHealed Event, add a Print String showing the heal amount. 4. From the Level Blueprint, get the actor and call Heal(50) at Begin Play. Verify the Blueprint receives the event.` },
        note:{ fr:`Ce pattern (C++ appelle, Blueprint réagit) est au cœur de la plupart des architectures Unreal en équipe.`, en:`This pattern (C++ calls, Blueprint reacts) is at the core of most team Unreal architectures.` }
      },
    ],
  },
};
document.addEventListener('DOMContentLoaded',()=>{});
