'use strict';
const MODULE = {
  id: 'm07', num: '07', prev: 6, next: 8,
  title: { fr: 'Interfaces II', en: 'Interfaces II' },
  sub: { fr: 'Abstraites vs interfaces, interfaces communes (Comparable, Iterable).', en: 'Abstract classes vs interfaces, common interfaces (Comparable, Iterable).' },
  concepts: [
    {
      id: 'c07_1',
      title: { fr: '1 — Abstraite vs interface : tableau comparatif', en: '1 — Abstract class vs interface: comparison' },
      body: {
        fr: `Le choix entre classe abstraite et interface repose sur une question clé : est-ce que les classes partagent un <strong>état commun</strong> (attributs d\'instance) ? Si oui → classe abstraite. Si non, et qu\'on définit seulement un <strong>contrat de comportement</strong> → interface. Une classe peut hériter d\'une seule classe (abstraite ou non) mais implémenter plusieurs interfaces.`,
        en: `The choice between abstract class and interface comes down to a key question: do the classes share <strong>common state</strong> (instance attributes)? If yes → abstract class. If not, and you\'re only defining a <strong>behaviour contract</strong> → interface. A class can only inherit from one class (abstract or not) but implement multiple interfaces.`,
      },
      code: {
        java: `<span class="cm">┌─────────────────────┬──────────────────┬──────────────────────┐</span>
<span class="cm">│                     │ Classe abstraite │ Interface            │</span>
<span class="cm">├─────────────────────┼──────────────────┼──────────────────────┤</span>
<span class="cm">│ Attributs instance  │ ✓                │ ✗                    │</span>
<span class="cm">│ Constructeur        │ ✓                │ ✗                    │</span>
<span class="cm">│ Méthodes concrètes  │ ✓                │ ✓ (default, Java 8+) │</span>
<span class="cm">│ Héritage multiple   │ ✗ (une seule)    │ ✓ (plusieurs)        │</span>
<span class="cm">│ État partagé        │ ✓                │ ✗                    │</span>
<span class="cm">└─────────────────────┴──────────────────┴──────────────────────┘</span>

<span class="cm">// Règle pratique :</span>
<span class="cm">// "Est-ce un type d'objet avec un état ?" → classe abstraite</span>
<span class="cm">// "Est-ce une capacité qu'un objet peut avoir ?" → interface</span>
<span class="cm">// Ex : Animal (état) vs Flyable, Swimmable (capacités)</span>`,
        cs: `<span class="cm">// C# : même règle qu'en Java</span>
<span class="cm">// abstract class : état partagé + comportements imposés</span>
<span class="cm">// interface : contrat pur, pas d'état</span>

<span class="kw">abstract class</span> <span class="ty">Vehicle</span> {
    <span class="kw">protected int</span> speed = <span class="num">0</span>;  <span class="cm">// état partagé → abstract class</span>
    <span class="kw">public abstract void</span> <span class="fn">Accelerate</span>();
}
<span class="kw">interface</span> <span class="ty">IElectric</span> { <span class="kw">void</span> <span class="fn">Charge</span>(); } <span class="cm">// capacité → interface</span>
<span class="kw">interface</span> <span class="ty">IAuto</span>     { <span class="kw">void</span> <span class="fn">SelfDrive</span>(); }

<span class="kw">class</span> <span class="ty">Tesla</span> : <span class="ty">Vehicle</span>, <span class="ty">IElectric</span>, <span class="ty">IAuto</span> {
    <span class="kw">public override void</span> <span class="fn">Accelerate</span>() { speed += <span class="num">10</span>; }
    <span class="kw">public void</span> <span class="fn">Charge</span>()    { <span class="cm">/* ... */</span> }
    <span class="kw">public void</span> <span class="fn">SelfDrive</span>() { <span class="cm">/* ... */</span> }
}`,
        py: `<span class="cm"># Python : pas de distinction syntaxique stricte</span>
<span class="cm"># Convention : ABC sans attributs = "interface"</span>

<span class="kw">from</span> abc <span class="kw">import</span> ABC, abstractmethod

<span class="cm"># "Interface" (pas d'état)</span>
<span class="kw">class</span> <span class="ty">Flyable</span>(ABC):
    @abstractmethod
    <span class="kw">def</span> <span class="fn">fly</span>(self): ...

<span class="cm"># Classe abstraite (avec état)</span>
<span class="kw">class</span> <span class="ty">Animal</span>(ABC):
    <span class="kw">def</span> <span class="fn">__init__</span>(self, name):
        self.name = name    <span class="cm"># état partagé</span>
    @abstractmethod
    <span class="kw">def</span> <span class="fn">speak</span>(self): ...`,
        cpp: `<span class="cm">// C++ : même classe abstraite pure pour les deux rôles</span>
<span class="cm">// Convention : nommer avec I... pour les interfaces</span>

<span class="cm">// "Interface" — aucun état, méthodes purement virtuelles</span>
<span class="kw">class</span> <span class="ty">IFlyable</span> {
<span class="kw">public</span>:
    <span class="kw">virtual void</span> <span class="fn">fly</span>() = <span class="num">0</span>;
    <span class="kw">virtual</span> ~<span class="ty">IFlyable</span>() = <span class="kw">default</span>;
};

<span class="cm">// Classe abstraite — avec état</span>
<span class="kw">class</span> <span class="ty">Animal</span> {
<span class="kw">protected</span>: std::<span class="ty">string</span> name;
<span class="kw">public</span>:
    <span class="ty">Animal</span>(std::<span class="ty">string</span> n) : name(n) {}
    <span class="kw">virtual void</span> <span class="fn">speak</span>() = <span class="num">0</span>;
};`,
        rust: `<span class="cm">// Rust : trait = interface (pas d'état dans le trait)</span>
<span class="cm">// L'état est dans la struct, le comportement dans le trait</span>

<span class="kw">trait</span> <span class="ty">Flyable</span> { <span class="kw">fn</span> <span class="fn">fly</span>(&amp;self); }  <span class="cm">// contrat pur</span>
<span class="kw">trait</span> <span class="ty">Swimmable</span> { <span class="kw">fn</span> <span class="fn">swim</span>(&amp;self); }

<span class="kw">struct</span> <span class="ty">Duck</span> { name: <span class="ty">String</span> }  <span class="cm">// état dans la struct</span>
<span class="kw">impl</span> <span class="ty">Flyable</span>   <span class="kw">for</span> <span class="ty">Duck</span> { <span class="kw">fn</span> <span class="fn">fly</span>(&amp;self)  { println!(<span class="str">"{} vole"</span>, self.name); } }
<span class="kw">impl</span> <span class="ty">Swimmable</span> <span class="kw">for</span> <span class="ty">Duck</span> { <span class="kw">fn</span> <span class="fn">swim</span>(&amp;self) { println!(<span class="str">"{} nage"</span>, self.name); } }`,
      },
    },
    {
      id: 'c07_2',
      title: { fr: '2 — Interfaces communes : Comparable et Iterable', en: '2 — Common interfaces: Comparable and Iterable' },
      body: {
        fr: `Java fournit des interfaces standard très utilisées. <strong>Comparable&lt;T&gt;</strong> impose une méthode <code>compareTo(T o)</code> qui retourne négatif, zéro, ou positif. Implémenter Comparable permet de trier des objets avec <code>Collections.sort()</code>. <strong>Iterable&lt;T&gt;</strong> impose <code>iterator()</code> et permet d\'utiliser la boucle <code>for-each</code> sur une classe personnalisée.`,
        en: `Java provides commonly used standard interfaces. <strong>Comparable&lt;T&gt;</strong> requires a <code>compareTo(T o)</code> method returning negative, zero, or positive. Implementing Comparable allows sorting objects with <code>Collections.sort()</code>. <strong>Iterable&lt;T&gt;</strong> requires <code>iterator()</code> and allows using the <code>for-each</code> loop on a custom class.`,
      },
      code: {
        java: `<span class="kw">class</span> <span class="ty">Student</span> <span class="kw">implements</span> <span class="ty">Comparable</span>&lt;<span class="ty">Student</span>&gt; {
    <span class="ty">String</span> name;
    <span class="kw">double</span> gpa;
    <span class="ty">Student</span>(<span class="ty">String</span> n, <span class="kw">double</span> g) { name=n; gpa=g; }

    @<span class="ty">Override</span>
    <span class="kw">public int</span> <span class="fn">compareTo</span>(<span class="ty">Student</span> other) {
        <span class="cm">// Tri par GPA décroissant</span>
        <span class="kw">return</span> <span class="ty">Double</span>.compare(other.gpa, <span class="kw">this</span>.gpa);
    }
}

<span class="ty">List</span>&lt;<span class="ty">Student</span>&gt; list = <span class="kw">new</span> <span class="ty">ArrayList</span>&lt;&gt;();
list.add(<span class="kw">new</span> <span class="ty">Student</span>(<span class="str">"Alice"</span>, <span class="num">3.8</span>));
list.add(<span class="kw">new</span> <span class="ty">Student</span>(<span class="str">"Bob"</span>,   <span class="num">3.5</span>));
list.add(<span class="kw">new</span> <span class="ty">Student</span>(<span class="str">"Carol"</span>, <span class="num">3.9</span>));
<span class="ty">Collections</span>.sort(list);
list.forEach(s -> <span class="ty">System</span>.out.println(s.name + <span class="str">": "</span> + s.gpa));
<span class="cm">// Carol: 3.9 / Alice: 3.8 / Bob: 3.5</span>`,
        cs: `<span class="kw">class</span> <span class="ty">Student</span> : <span class="ty">IComparable</span>&lt;<span class="ty">Student</span>&gt; {
    <span class="kw">public string</span> Name; <span class="kw">public double</span> Gpa;
    <span class="kw">public</span> <span class="ty">Student</span>(<span class="kw">string</span> n, <span class="kw">double</span> g) { Name=n; Gpa=g; }

    <span class="kw">public int</span> <span class="fn">CompareTo</span>(<span class="ty">Student</span> other)
        => other.Gpa.CompareTo(<span class="kw">this</span>.Gpa); <span class="cm">// décroissant</span>
}
<span class="kw">var</span> list = <span class="kw">new</span> <span class="ty">List</span>&lt;<span class="ty">Student</span>&gt; {
    <span class="kw">new</span>(<span class="str">"Alice"</span>,<span class="num">3.8</span>), <span class="kw">new</span>(<span class="str">"Bob"</span>,<span class="num">3.5</span>), <span class="kw">new</span>(<span class="str">"Carol"</span>,<span class="num">3.9</span>)
};
list.Sort();
list.ForEach(s => <span class="ty">Console</span>.WriteLine(<span class="str">$"{s.Name}: {s.Gpa}"</span>));`,
        py: `<span class="cm"># Python : __lt__, __eq__ pour le tri (ou functools.total_ordering)</span>
<span class="kw">from</span> functools <span class="kw">import</span> total_ordering

@total_ordering
<span class="kw">class</span> <span class="ty">Student</span>:
    <span class="kw">def</span> <span class="fn">__init__</span>(self, name, gpa):
        self.name=name; self.gpa=gpa
    <span class="kw">def</span> <span class="fn">__lt__</span>(self, other): <span class="kw">return</span> self.gpa &lt; other.gpa
    <span class="kw">def</span> <span class="fn">__eq__</span>(self, other): <span class="kw">return</span> self.gpa == other.gpa

students = [<span class="ty">Student</span>(<span class="str">"Alice"</span>,<span class="num">3.8</span>), <span class="ty">Student</span>(<span class="str">"Bob"</span>,<span class="num">3.5</span>), <span class="ty">Student</span>(<span class="str">"Carol"</span>,<span class="num">3.9</span>)]
students.sort(reverse=<span class="kw">True</span>)
<span class="kw">for</span> s <span class="kw">in</span> students: print(<span class="str">f"{s.name}: {s.gpa}"</span>)`,
        cpp: `<span class="cm">// C++ : opérateur < pour le tri</span>
<span class="kw">struct</span> <span class="ty">Student</span> {
    std::<span class="ty">string</span> name; <span class="kw">double</span> gpa;
    <span class="kw">bool</span> <span class="kw">operator</span>&lt;(<span class="kw">const</span> <span class="ty">Student</span>& o) <span class="kw">const</span> {
        <span class="kw">return</span> gpa &gt; o.gpa; <span class="cm">// décroissant</span>
    }
};
std::vector&lt;<span class="ty">Student</span>&gt; v = {{<span class="str">"Alice"</span>,<span class="num">3.8</span>},{<span class="str">"Bob"</span>,<span class="num">3.5</span>},{<span class="str">"Carol"</span>,<span class="num">3.9</span>}};
std::sort(v.begin(), v.end());
<span class="kw">for</span> (<span class="kw">auto</span>& s : v) std::cout &lt;&lt; s.name &lt;&lt; <span class="str">": "</span> &lt;&lt; s.gpa &lt;&lt; <span class="str">"\n"</span>;`,
        rust: `<span class="kw">use</span> std::cmp::Ordering;
<span class="kw">#[derive(PartialEq)]</span>
<span class="kw">struct</span> <span class="ty">Student</span> { name: <span class="ty">String</span>, gpa: f64 }
<span class="kw">impl</span> PartialOrd <span class="kw">for</span> <span class="ty">Student</span> {
    <span class="kw">fn</span> <span class="fn">partial_cmp</span>(&amp;self, other: &amp;<span class="ty">Student</span>) -> Option&lt;Ordering&gt; {
        other.gpa.partial_cmp(&amp;self.gpa) <span class="cm">// décroissant</span>
    }
}
<span class="kw">let mut</span> v = vec![
    <span class="ty">Student</span>{name:<span class="str">"Alice"</span>.into(),gpa:<span class="num">3.8</span>},
    <span class="ty">Student</span>{name:<span class="str">"Carol"</span>.into(),gpa:<span class="num">3.9</span>},
];
v.sort_by(|a,b| a.partial_cmp(b).unwrap());`,
      },
    },
  ],
  activities: [
    {
      id: 'a07_1', concept: 'c07_1', type: 'quiz', xp: 10,
      question: { fr: 'Une classe Java doit modéliser un Véhicule avec vitesse et carburant (attributs partagés), et différents types (Voiture, Moto) doivent aussi être Électrique ou Hybride (capacités). Quelle combinaison choisir ?', en: 'A Java class must model a Vehicle with speed and fuel (shared attributes), and different types (Car, Motorcycle) must also be Electric or Hybrid (capabilities). What combination to choose?' },
      choices: [
        { text: { fr: 'Deux interfaces : Vehicule et Electrique.', en: 'Two interfaces: Vehicle and Electric.' }, correct: false, fb: { fr: 'Non. Vehicule a des attributs (vitesse, carburant) — une interface ne peut pas les contenir.', en: 'No. Vehicle has attributes (speed, fuel) — an interface cannot contain them.' } },
        { text: { fr: 'Classe abstraite Vehicle + interfaces IElectrique, IHybride.', en: 'Abstract class Vehicle + interfaces IElectric, IHybrid.' }, correct: true, fb: { fr: 'Correct ! Vehicle est abstraite car elle a un état partagé. Les capacités (Électrique, Hybride) sont des interfaces car ce sont des contrats de comportement sans état propre.', en: 'Correct! Vehicle is abstract because it has shared state. Capabilities (Electric, Hybrid) are interfaces because they are behaviour contracts with no own state.' } },
        { text: { fr: 'Classe abstraite Vehicle et classe abstraite Electrique.', en: 'Abstract class Vehicle and abstract class Electric.' }, correct: false, fb: { fr: 'Non. Une classe Java ne peut hériter que d\'une seule classe. Une Voiture Électrique ne pourrait pas hériter de Vehicle et Electrique en même temps.', en: 'No. A Java class can only inherit from one class. An Electric Car could not inherit from both Vehicle and Electric.' } },
        { text: { fr: 'Une seule classe concrète Vehicle.', en: 'A single concrete class Vehicle.' }, correct: false, fb: { fr: 'Non, cela forcerait de dupliquer le code pour chaque type de véhicule.', en: 'No, this would force code duplication for each vehicle type.' } },
      ],
    },
    {
      id: 'a07_2', concept: 'c07_2', type: 'fill', xp: 15,
      instr: { fr: 'Complète la signature de compareTo() pour que Student soit triable :', en: 'Complete the compareTo() signature to make Student sortable:' },
      template: { fr: 'public int ______(Student other) { ... }', en: 'public int ______(Student other) { ... }' },
      answer: 'compareTo',
      hint: { fr: 'C\'est la méthode imposée par l\'interface Comparable<T>.', en: 'It\'s the method required by the Comparable<T> interface.' },
    },
    {
      id: 'a07_3', concept: 'c07_2', type: 'predict', xp: 8,
      question: { fr: 'Que retourne compareTo() si a.compareTo(b) retourne un nombre négatif ?', en: 'What does it mean if a.compareTo(b) returns a negative number?' },
      code: `<span class="cm">// Contrat de Comparable :</span>
<span class="cm">// négatif  → this vient AVANT other</span>
<span class="cm">// zéro     → this et other sont égaux</span>
<span class="cm">// positif  → this vient APRÈS other</span>
<span class="ty">Student</span> alice = <span class="kw">new</span> <span class="ty">Student</span>(<span class="str">"Alice"</span>, <span class="num">3.8</span>);
<span class="ty">Student</span> bob   = <span class="kw">new</span> <span class="ty">Student</span>(<span class="str">"Bob"</span>,   <span class="num">3.5</span>);
<span class="ty">System</span>.out.println(alice.compareTo(bob));`,
      explanation: { fr: 'Retourne un nombre négatif si le tri est par GPA décroissant (other.gpa - this.gpa < 0 quand alice > bob), ce qui signifie qu\'Alice vient AVANT Bob dans l\'ordre de tri. Concrètement : Double.compare(bob.gpa, alice.gpa) = Double.compare(3.5, 3.8) retourne un nombre négatif.', en: 'Returns a negative number if sorted by descending GPA (other.gpa - this.gpa < 0 when alice > bob), meaning Alice comes BEFORE Bob in sort order. Concretely: Double.compare(bob.gpa, alice.gpa) = Double.compare(3.5, 3.8) returns a negative number.' },
    },
    {
      id: 'a07_4', concept: 'c07_1', type: 'bug', xp: 20,
      instr: { fr: 'Ce code Java ne compile pas. Trouve l\'erreur.', en: 'This Java code does not compile. Find the error.' },
      bugCode: `<span class="kw">interface</span> <span class="ty">Serializable</span> {
    <span class="kw">void</span> <span class="fn">serialize</span>();
}
<span class="kw">abstract class</span> <span class="ty">Document</span> {
    <span class="ty">String</span> title;
    <span class="kw">abstract void</span> <span class="fn">print</span>();
}
<span class="kw">class</span> <span class="ty">Report</span> <span class="kw">extends</span> <span class="ty">Document</span> <span class="bug-line"><span class="kw">extends</span></span> <span class="ty">Serializable</span> {
    <span class="kw">public void</span> <span class="fn">print</span>()     { <span class="cm">/* ... */</span> }
    <span class="kw">public void</span> <span class="fn">serialize</span>() { <span class="cm">/* ... */</span> }
}`,
      explanation: { fr: 'On utilise <code>extends</code> pour hériter d\'une classe et <code>implements</code> pour les interfaces. La syntaxe correcte est : <code>class Report extends Document implements Serializable</code>. On ne peut pas utiliser <code>extends</code> pour une interface.', en: 'Use <code>extends</code> to inherit from a class and <code>implements</code> for interfaces. The correct syntax is: <code>class Report extends Document implements Serializable</code>. You cannot use <code>extends</code> for an interface.' },
    },
  ],
  homework: {
    fr: `<p>Dans ton dépôt GitHub, crée un dossier <strong>m07/</strong> contenant :</p>
<ol style="margin:.8rem 0 .8rem 2rem;font-size:1.45rem;color:var(--ch2);line-height:2">
  <li>Un <code>README.md</code> avec le tableau "abstraite vs interface" complété avec tes propres exemples (pas Animal/Véhicule).</li>
  <li>Une classe <code>Film</code> (titre, année, note/10) qui implémente <code>Comparable&lt;Film&gt;</code> pour trier par note décroissante.</li>
  <li>Un <code>main</code> qui crée une liste de 5 films, la trie avec <code>Collections.sort()</code> ou équivalent, et affiche le résultat.</li>
</ol>`,
    en: `<p>In your GitHub repository, create a folder <strong>m07/</strong> containing:</p>
<ol style="margin:.8rem 0 .8rem 2rem;font-size:1.45rem;color:var(--ch2);line-height:2">
  <li>A <code>README.md</code> with the "abstract vs interface" table completed with your own examples (not Animal/Vehicle).</li>
  <li>A <code>Movie</code> class (title, year, rating/10) implementing <code>Comparable&lt;Movie&gt;</code> for descending rating sort.</li>
  <li>A <code>main</code> that creates a list of 5 movies, sorts it with <code>Collections.sort()</code> or equivalent, and prints the result.</li>
</ol>`,
  },



  references: [
    { title: { fr: 'W3Schools — Java Comparable', en: 'W3Schools — Java Comparable' }, url: 'https://www.w3schools.com/java/java_interface.asp', note: { fr: 'Interfaces Java et Comparable', en: 'Java interfaces and Comparable' } },
    { title: { fr: 'W3Schools — C# IComparable', en: 'W3Schools — C# IComparable' }, url: 'https://www.w3schools.com/cs/cs_interface.php', note: { fr: 'IComparable en C#', en: 'IComparable in C#' } },
    { title: { fr: 'Oracle — Comparable', en: 'Oracle — Comparable' }, url: 'https://docs.oracle.com/javase/8/docs/api/java/lang/Comparable.html', note: { fr: 'API Comparable Java officielle', en: 'Official Java Comparable API' } },
    { title: { fr: 'Oracle — Comparator', en: 'Oracle — Comparator' }, url: 'https://docs.oracle.com/javase/8/docs/api/java/util/Comparator.html', note: { fr: 'API Comparator Java officielle', en: 'Official Java Comparator API' } },
    { title: { fr: 'Microsoft Docs — IComparable<T>', en: 'Microsoft Docs — IComparable<T>' }, url: 'https://learn.microsoft.com/en-us/dotnet/api/system.icomparable-1', note: { fr: 'Documentation officielle IComparable C#', en: 'Official IComparable C# documentation' } },
    { title: { fr: 'Python Docs — functools.total_ordering', en: 'Python Docs — functools.total_ordering' }, url: 'https://docs.python.org/3/library/functools.html#functools.total_ordering', note: { fr: 'Décorateur pour simplifier les comparaisons Python', en: 'Decorator to simplify Python comparisons' } },
    { title: { fr: 'Rust Docs — PartialOrd / Ord', en: 'Rust Docs — PartialOrd / Ord' }, url: 'https://doc.rust-lang.org/std/cmp/trait.Ord.html', note: { fr: 'Traits de comparaison et de tri en Rust', en: 'Comparison and sorting traits in Rust' } },
  ],
};