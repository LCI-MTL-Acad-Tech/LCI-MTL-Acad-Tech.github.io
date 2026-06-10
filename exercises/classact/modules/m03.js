'use strict';
const MODULE = {
  id: 'm03', num: '03', prev: 2, next: 4,
  title: { fr: 'Génériques', en: 'Generics' },
  sub: { fr: 'Classes et méthodes paramétrées par un type.', en: 'Type-parameterised classes and methods.' },
  concepts: [
    {
      id: 'c03_1',
      title: { fr: '1 — Classes génériques', en: '1 — Generic classes' },
      body: {
        fr: `Une <strong>classe générique</strong> est paramétrée par un type noté <code>T</code> (ou autre lettre). Elle permet d\'écrire une seule implémentation qui fonctionne pour n\'importe quel type. Sans génériques, il faudrait une classe par type, ou utiliser <code>Object</code> et risquer des erreurs de cast à l\'exécution. Les génériques déplacent ces erreurs au moment de la compilation.`,
        en: `A <strong>generic class</strong> is parameterised by a type written <code>T</code> (or another letter). It allows writing a single implementation that works for any type. Without generics, you\'d need a separate class per type, or use <code>Object</code> and risk cast errors at runtime. Generics move those errors to compile time.`,
      },
      code: {
        java: `<span class="cm">// Classe générique : Boîte qui peut contenir n'importe quoi</span>
<span class="kw">class</span> <span class="ty">Box</span>&lt;T&gt; {
    <span class="kw">private</span> T value;
    <span class="ty">Box</span>(T value) { <span class="kw">this</span>.value = value; }
    T <span class="fn">get</span>() { <span class="kw">return</span> value; }
}

<span class="ty">Box</span>&lt;<span class="ty">String</span>&gt;  sb = <span class="kw">new</span> <span class="ty">Box</span>&lt;&gt;(<span class="str">"Bonjour"</span>);
<span class="ty">Box</span>&lt;<span class="ty">Integer</span>&gt; ib = <span class="kw">new</span> <span class="ty">Box</span>&lt;&gt;(<span class="num">42</span>);
<span class="ty">System</span>.out.println(sb.get()); <span class="cm">// Bonjour</span>
<span class="ty">System</span>.out.println(ib.get()); <span class="cm">// 42</span>`,
        cs: `<span class="kw">class</span> <span class="ty">Box</span>&lt;T&gt; {
    <span class="kw">private</span> T value;
    <span class="kw">public</span> <span class="ty">Box</span>(T value) { <span class="kw">this</span>.value = value; }
    <span class="kw">public</span> T <span class="fn">Get</span>() => value;
}

<span class="kw">var</span> sb = <span class="kw">new</span> <span class="ty">Box</span>&lt;<span class="kw">string</span>&gt;(<span class="str">"Bonjour"</span>);
<span class="kw">var</span> ib = <span class="kw">new</span> <span class="ty">Box</span>&lt;<span class="kw">int</span>&gt;(<span class="num">42</span>);
<span class="ty">Console</span>.WriteLine(sb.Get()); <span class="cm">// Bonjour</span>`,
        py: `<span class="cm"># Python est dynamiquement typé — les génériques sont optionnels</span>
<span class="cm"># On utilise les annotations de type pour la clarté :</span>
<span class="kw">from</span> typing <span class="kw">import</span> Generic, TypeVar
T = TypeVar(<span class="str">'T'</span>)

<span class="kw">class</span> <span class="ty">Box</span>(Generic[T]):
    <span class="kw">def</span> <span class="fn">__init__</span>(self, value: T):
        self.value = value
    <span class="kw">def</span> <span class="fn">get</span>(self) -> T:
        <span class="kw">return</span> self.value

sb: <span class="ty">Box</span>[<span class="kw">str</span>] = <span class="ty">Box</span>(<span class="str">"Bonjour"</span>)
ib: <span class="ty">Box</span>[<span class="kw">int</span>] = <span class="ty">Box</span>(<span class="num">42</span>)`,
        cpp: `<span class="cm">// C++ : template</span>
<span class="kw">template</span>&lt;<span class="kw">typename</span> T&gt;
<span class="kw">class</span> <span class="ty">Box</span> {
    T value;
<span class="kw">public</span>:
    <span class="ty">Box</span>(T v) : value(v) {}
    T <span class="fn">get</span>() <span class="kw">const</span> { <span class="kw">return</span> value; }
};

<span class="ty">Box</span>&lt;std::<span class="ty">string</span>&gt; sb(<span class="str">"Bonjour"</span>);
<span class="ty">Box</span>&lt;<span class="kw">int</span>&gt;         ib(<span class="num">42</span>);
std::cout &lt;&lt; sb.get() &lt;&lt; <span class="str">" "</span> &lt;&lt; ib.get();`,
        rust: `<span class="kw">struct</span> <span class="ty">Box</span>&lt;T&gt; { value: T }
<span class="kw">impl</span>&lt;T&gt; <span class="ty">Box</span>&lt;T&gt; {
    <span class="kw">fn</span> <span class="fn">new</span>(value: T) -> Self { <span class="ty">Box</span> { value } }
    <span class="kw">fn</span> <span class="fn">get</span>(&amp;self) -> &amp;T { &amp;self.value }
}
<span class="kw">let</span> sb = <span class="ty">Box</span>::<span class="fn">new</span>(<span class="str">"Bonjour"</span>);
<span class="kw">let</span> ib = <span class="ty">Box</span>::<span class="fn">new</span>(<span class="num">42</span>);
println!(<span class="str">"{} {}"</span>, sb.get(), ib.get());`,
      },
    },
    {
      id: 'c03_2',
      title: { fr: '2 — Méthodes génériques', en: '2 — Generic methods' },
      body: {
        fr: `Une <strong>méthode générique</strong> déclare son propre paramètre de type, indépendamment de la classe. On peut aussi contraindre le type avec <code>extends</code> (Java/C#) pour n\'accepter que les types qui respectent une certaine interface — par exemple <code>T extends Comparable&lt;T&gt;</code> pour pouvoir comparer des éléments.`,
        en: `A <strong>generic method</strong> declares its own type parameter, independently from the class. You can also constrain the type with <code>extends</code> (Java/C#) to only accept types that implement a certain interface — for example <code>T extends Comparable&lt;T&gt;</code> to be able to compare elements.`,
      },
      code: {
        java: `<span class="cm">// Méthode générique dans une classe normale</span>
<span class="kw">class</span> <span class="ty">Utils</span> {
    <span class="kw">static</span> &lt;T&gt; T <span class="fn">firstOrDefault</span>(T[] arr, T def) {
        <span class="kw">return</span> arr.length &gt; <span class="num">0</span> ? arr[<span class="num">0</span>] : def;
    }

    <span class="cm">// Contrainte : T doit implémenter Comparable</span>
    <span class="kw">static</span> &lt;T <span class="kw">extends</span> <span class="ty">Comparable</span>&lt;T&gt;&gt; T <span class="fn">max</span>(T a, T b) {
        <span class="kw">return</span> a.compareTo(b) &gt;= <span class="num">0</span> ? a : b;
    }
}

<span class="ty">String</span>[] names = {<span class="str">"Alice"</span>, <span class="str">"Bob"</span>};
<span class="ty">System</span>.out.println(<span class="ty">Utils</span>.firstOrDefault(names, <span class="str">"Inconnu"</span>)); <span class="cm">// Alice</span>
<span class="ty">System</span>.out.println(<span class="ty">Utils</span>.max(<span class="num">10</span>, <span class="num">25</span>));   <span class="cm">// 25</span>`,
        cs: `<span class="kw">class</span> <span class="ty">Utils</span> {
    <span class="kw">public static</span> T <span class="fn">FirstOrDefault</span>&lt;T&gt;(T[] arr, T def)
        => arr.Length &gt; <span class="num">0</span> ? arr[<span class="num">0</span>] : def;

    <span class="kw">public static</span> T <span class="fn">Max</span>&lt;T&gt;(T a, T b) <span class="kw">where</span> T : IComparable&lt;T&gt;
        => a.CompareTo(b) &gt;= <span class="num">0</span> ? a : b;
}
<span class="ty">Console</span>.WriteLine(<span class="ty">Utils</span>.Max(<span class="num">10</span>, <span class="num">25</span>)); <span class="cm">// 25</span>`,
        py: `<span class="kw">from</span> typing <span class="kw">import</span> TypeVar, List
T = TypeVar(<span class="str">'T'</span>)

<span class="kw">def</span> <span class="fn">first_or_default</span>(lst: List[T], default: T) -> T:
    <span class="kw">return</span> lst[<span class="num">0</span>] <span class="kw">if</span> lst <span class="kw">else</span> default

<span class="kw">def</span> <span class="fn">maximum</span>(a: T, b: T) -> T:
    <span class="kw">return</span> a <span class="kw">if</span> a >= b <span class="kw">else</span> b

print(first_or_default([<span class="str">"Alice"</span>], <span class="str">"Inconnu"</span>)) <span class="cm"># Alice</span>
print(maximum(<span class="num">10</span>, <span class="num">25</span>))  <span class="cm"># 25</span>`,
        cpp: `<span class="kw">template</span>&lt;<span class="kw">typename</span> T&gt;
T <span class="fn">maximum</span>(T a, T b) { <span class="kw">return</span> a >= b ? a : b; }

<span class="kw">template</span>&lt;<span class="kw">typename</span> T&gt;
T <span class="fn">firstOrDefault</span>(T* arr, <span class="kw">int</span> len, T def) {
    <span class="kw">return</span> len &gt; <span class="num">0</span> ? arr[<span class="num">0</span>] : def;
}

std::cout &lt;&lt; <span class="fn">maximum</span>(<span class="num">10</span>, <span class="num">25</span>); <span class="cm">// 25</span>`,
        rust: `<span class="kw">fn</span> <span class="fn">maximum</span>&lt;T: PartialOrd&gt;(a: T, b: T) -> T {
    <span class="kw">if</span> a >= b { a } <span class="kw">else</span> { b }
}
<span class="kw">fn</span> <span class="fn">first_or_default</span>&lt;T: Clone&gt;(v: &amp;[T], def: T) -> T {
    v.first().cloned().unwrap_or(def)
}
println!(<span class="str">"{}"</span>, <span class="fn">maximum</span>(<span class="num">10</span>, <span class="num">25</span>)); <span class="cm">// 25</span>`,
      },
    },
  ],
  activities: [
    {
      id: 'a03_1', concept: 'c03_1', type: 'quiz', xp: 10,
      question: { fr: 'Quel est le principal avantage des classes génériques par rapport à l\'utilisation de Object ?', en: 'What is the main advantage of generic classes over using Object?' },
      choices: [
        { text: { fr: 'Les génériques sont plus rapides à l\'exécution.', en: 'Generics are faster at runtime.' }, correct: false, fb: { fr: 'Pas l\'avantage principal.', en: 'Not the main advantage.' } },
        { text: { fr: 'Les erreurs de type sont détectées à la compilation, pas à l\'exécution.', en: 'Type errors are caught at compile time, not at runtime.' }, correct: true, fb: { fr: 'Correct ! Avec Object, un cast incorrect cause une ClassCastException à l\'exécution. Avec les génériques, le compilateur interdit les types incompatibles dès la compilation.', en: 'Correct! With Object, an incorrect cast causes a ClassCastException at runtime. With generics, the compiler forbids incompatible types at compile time.' } },
        { text: { fr: 'On peut stocker plusieurs types différents dans une seule collection.', en: 'You can store different types in a single collection.' }, correct: false, fb: { fr: 'C\'est l\'inverse : les génériques enforctent l\'homogénéité du type.', en: 'That\'s the opposite: generics enforce type homogeneity.' } },
        { text: { fr: 'Les génériques évitent d\'écrire des constructeurs.', en: 'Generics avoid writing constructors.' }, correct: false, fb: { fr: 'Non.', en: 'No.' } },
      ],
    },
    {
      id: 'a03_2', concept: 'c03_1', type: 'fill', xp: 15,
      instr: { fr: 'Complète la déclaration de cette classe générique en Java :', en: 'Complete the declaration of this generic class in Java:' },
      template: { fr: 'class Pair<______, T2> { T1 first; T2 second; }', en: 'class Pair<______, T2> { T1 first; T2 second; }' },
      answer: 'T1',
      hint: { fr: 'Les paramètres de type sont généralement nommés T, T1, T2, K, V... par convention.', en: 'Type parameters are conventionally named T, T1, T2, K, V...' },
    },
    {
      id: 'a03_3', concept: 'c03_2', type: 'predict', xp: 8,
      question: { fr: 'Que retourne ce code Java ?', en: 'What does this Java code return?' },
      code: `<span class="kw">static</span> &lt;T <span class="kw">extends</span> <span class="ty">Comparable</span>&lt;T&gt;&gt; T <span class="fn">max</span>(T a, T b) {
    <span class="kw">return</span> a.compareTo(b) &gt;= <span class="num">0</span> ? a : b;
}
<span class="ty">System</span>.out.println(<span class="fn">max</span>(<span class="str">"apple"</span>, <span class="str">"banana"</span>));`,
      explanation: { fr: '"banana". La comparaison lexicographique des String compare les caractères. \'b\' > \'a\' en ASCII, donc "banana" > "apple", et max retourne "banana".', en: '"banana". String comparison is lexicographic. \'b\' > \'a\' in ASCII, so "banana" > "apple", and max returns "banana".' },
    },
    {
      id: 'a03_4', concept: 'c03_2', type: 'quiz', xp: 10,
      question: { fr: 'Que signifie <T extends Comparable<T>> dans une méthode générique Java ?', en: 'What does <T extends Comparable<T>> mean in a Java generic method?' },
      choices: [
        { text: { fr: 'T doit être une sous-classe de Comparable.', en: 'T must be a subclass of Comparable.' }, correct: false, fb: { fr: 'Comparable est une interface, pas une classe. On dit "implémenter", pas "étendre".', en: 'Comparable is an interface, not a class. We say "implements", not "extends".' } },
        { text: { fr: 'T doit implémenter l\'interface Comparable, ce qui garantit que compareTo() est disponible.', en: 'T must implement the Comparable interface, guaranteeing that compareTo() is available.' }, correct: true, fb: { fr: 'Correct ! C\'est une contrainte de type (bounded type parameter). Elle garantit qu\'on peut comparer deux T entre eux.', en: 'Correct! This is a bounded type parameter. It guarantees that two T values can be compared with each other.' } },
        { text: { fr: 'T ne peut être qu\'un type primitif.', en: 'T can only be a primitive type.' }, correct: false, fb: { fr: 'Non, les types primitifs n\'implémentent pas d\'interfaces en Java.', en: 'No, primitive types don\'t implement interfaces in Java.' } },
        { text: { fr: 'La méthode retourne un Comparable, pas un T.', en: 'The method returns a Comparable, not a T.' }, correct: false, fb: { fr: 'Non, le type de retour est T.', en: 'No, the return type is T.' } },
      ],
    },
  ],
  homework: {
    fr: `<p>Dans ton dépôt GitHub, crée un dossier <strong>m03/</strong> contenant :</p>
<ol style="margin:.8rem 0 .8rem 2rem;font-size:1.45rem;color:var(--ch2);line-height:2">
  <li>Un <code>README.md</code> expliquant dans tes propres mots ce qu'est un type générique et pourquoi on l'utilise plutôt que <code>Object</code>.</li>
  <li>Une classe générique <code>Paire&lt;T1, T2&gt;</code> qui stocke deux valeurs de types potentiellement différents, avec des getters et une méthode <code>afficher()</code>.</li>
  <li>Une méthode générique statique <code>swap(T[] arr, int i, int j)</code> qui échange deux éléments d'un tableau.</li>
</ol>`,
    en: `<p>In your GitHub repository, create a folder <strong>m03/</strong> containing:</p>
<ol style="margin:.8rem 0 .8rem 2rem;font-size:1.45rem;color:var(--ch2);line-height:2">
  <li>A <code>README.md</code> explaining in your own words what a generic type is and why to use it instead of <code>Object</code>.</li>
  <li>A generic class <code>Pair&lt;T1, T2&gt;</code> that stores two values of potentially different types, with getters and a <code>display()</code> method.</li>
  <li>A generic static method <code>swap(T[] arr, int i, int j)</code> that swaps two elements of an array.</li>
</ol>`,
  },



  references: [
    { title: { fr: 'W3Schools — Java Generics', en: 'W3Schools — Java Generics' }, url: 'https://www.w3schools.com/java/java_generics.asp', note: { fr: 'Classes et méthodes génériques en Java', en: 'Generic classes and methods in Java' } },
    { title: { fr: 'W3Schools — C# Generics', en: 'W3Schools — C# Generics' }, url: 'https://www.w3schools.com/cs/cs_generics.php', note: { fr: 'Génériques en C#', en: 'Generics in C#' } },
    { title: { fr: 'Oracle — Java Generics Tutorial', en: 'Oracle — Java Generics Tutorial' }, url: 'https://docs.oracle.com/javase/tutorial/java/generics/index.html', note: { fr: 'Guide complet des génériques Java', en: 'Complete Java generics guide' } },
    { title: { fr: 'Microsoft Docs — Generics (C#)', en: 'Microsoft Docs — Generics (C#)' }, url: 'https://learn.microsoft.com/en-us/dotnet/csharp/fundamentals/types/generics', note: { fr: 'Documentation officielle des génériques C#', en: 'Official C# generics documentation' } },
    { title: { fr: 'Python Docs — typing module', en: 'Python Docs — typing module' }, url: 'https://docs.python.org/3/library/typing.html', note: { fr: 'TypeVar, Generic et annotations de type', en: 'TypeVar, Generic, and type annotations' } },
    { title: { fr: 'cppreference — Templates (C++)', en: 'cppreference — Templates (C++)' }, url: 'https://en.cppreference.com/w/cpp/language/templates', note: { fr: 'Référence technique des templates C++', en: 'C++ templates technical reference' } },
    { title: { fr: 'Rust Book — Generic Types', en: 'Rust Book — Generic Types' }, url: 'https://doc.rust-lang.org/book/ch10-01-syntax.html', note: { fr: 'Génériques en Rust', en: 'Generics in Rust' } },
  ],
};