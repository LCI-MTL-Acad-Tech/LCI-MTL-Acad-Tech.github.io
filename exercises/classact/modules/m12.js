'use strict';
const MODULE = {
  id: 'm12', num: '12', prev: 11, next: 13,
  title: { fr: 'Révision intégrative', en: 'Integrative Review' },
  sub: { fr: 'Synthèse des 4 piliers, collections, et exercices croisés.', en: 'Synthesis of the 4 pillars, collections, and cross-topic exercises.' },
  concepts: [
    {
      id: 'c12_1',
      title: { fr: '1 — Carte mentale : tout relie tout', en: '1 — Mind map: everything connects' },
      body: {
        fr: `La POO forme un système cohérent. Une classe encapsule des données (<strong>encapsulation</strong>). Elle peut hériter d'une autre (<strong>héritage</strong>). Une référence parent peut pointer vers un enfant (<strong>polymorphisme</strong>). On cache la complexité derrière des interfaces (<strong>abstraction</strong>). Les collections stockent des objets selon différents besoins : ordre (<code>List</code>), unicité (<code>Set</code>), association (<code>Map</code>), traitement FIFO (<code>Queue</code>). Les <strong>génériques</strong> garantissent la sécurité de type pour toutes ces structures.`,
        en: `OOP forms a coherent system. A class encapsulates data (<strong>encapsulation</strong>). It can inherit from another (<strong>inheritance</strong>). A parent reference can point to a child (<strong>polymorphism</strong>). Complexity is hidden behind interfaces (<strong>abstraction</strong>). Collections store objects according to different needs: order (<code>List</code>), uniqueness (<code>Set</code>), association (<code>Map</code>), FIFO processing (<code>Queue</code>). <strong>Generics</strong> ensure type safety for all these structures.`,
      },
      code: {
        java: `<span class="cm">// Exemple intégratif : catalogue de produits</span>
<span class="kw">interface</span> <span class="ty">Taxable</span>    { <span class="kw">double</span> <span class="fn">taxAmount</span>(); }
<span class="kw">interface</span> <span class="ty">Discountable</span> { <span class="kw">double</span> <span class="fn">discountedPrice</span>(); }

<span class="kw">abstract class</span> <span class="ty">Product</span> <span class="kw">implements</span> <span class="ty">Taxable</span> {
    <span class="kw">protected</span> <span class="ty">String</span> name;
    <span class="kw">protected double</span> price;
    <span class="ty">Product</span>(<span class="ty">String</span> n, <span class="kw">double</span> p) { name=n; price=p; }
    <span class="kw">abstract double</span> <span class="fn">category</span>();
    <span class="kw">public double</span> <span class="fn">taxAmount</span>() { <span class="kw">return</span> price * <span class="fn">category</span>(); }
}

<span class="kw">class</span> <span class="ty">Food</span> <span class="kw">extends</span> <span class="ty">Product</span> <span class="kw">implements</span> <span class="ty">Discountable</span> {
    <span class="ty">Food</span>(<span class="ty">String</span> n, <span class="kw">double</span> p) { <span class="kw">super</span>(n, p); }
    @<span class="ty">Override</span> <span class="kw">double</span>  <span class="fn">category</span>()        { <span class="kw">return</span> <span class="num">0.05</span>; }
    @<span class="ty">Override</span> <span class="kw">public double</span> <span class="fn">discountedPrice</span>() { <span class="kw">return</span> price * <span class="num">0.9</span>; }
}

<span class="cm">// Stockage polymorphe dans une collection générique</span>
<span class="ty">List</span>&lt;<span class="ty">Product</span>&gt; catalogue = <span class="kw">new</span> <span class="ty">ArrayList</span>&lt;&gt;();
catalogue.add(<span class="kw">new</span> <span class="ty">Food</span>(<span class="str">"Pain"</span>, <span class="num">2.50</span>));
<span class="ty">Map</span>&lt;<span class="ty">String</span>, <span class="ty">Double</span>&gt; taxes = <span class="kw">new</span> <span class="ty">TreeMap</span>&lt;&gt;();
catalogue.forEach(p -> taxes.put(p.name, p.taxAmount()));`,
        cs: `<span class="cm">// Même pattern en C#</span>
<span class="kw">interface</span> <span class="ty">ITaxable</span>      { <span class="kw">double</span> <span class="fn">TaxAmount</span>(); }
<span class="kw">interface</span> <span class="ty">IDiscountable</span>  { <span class="kw">double</span> <span class="fn">DiscountedPrice</span>(); }

<span class="kw">abstract class</span> <span class="ty">Product</span> : <span class="ty">ITaxable</span> {
    <span class="kw">protected string</span> Name; <span class="kw">protected double</span> Price;
    <span class="kw">protected</span> <span class="ty">Product</span>(<span class="kw">string</span> n, <span class="kw">double</span> p) { Name=n; Price=p; }
    <span class="kw">protected abstract double</span> <span class="fn">TaxRate</span>();
    <span class="kw">public double</span> <span class="fn">TaxAmount</span>() => Price * TaxRate();
}
<span class="kw">var</span> catalogue = <span class="kw">new</span> <span class="ty">List</span>&lt;<span class="ty">Product</span>&gt;();`,
        py: `<span class="kw">from</span> abc <span class="kw">import</span> ABC, abstractmethod

<span class="kw">class</span> <span class="ty">Taxable</span>(ABC):
    @abstractmethod
    <span class="kw">def</span> <span class="fn">tax_amount</span>(self): ...

<span class="kw">class</span> <span class="ty">Product</span>(<span class="ty">Taxable</span>, ABC):
    <span class="kw">def</span> <span class="fn">__init__</span>(self, name, price):
        self.name = name; self.price = price
    @abstractmethod
    <span class="kw">def</span> <span class="fn">category</span>(self): ...
    <span class="kw">def</span> <span class="fn">tax_amount</span>(self): <span class="kw">return</span> self.price * self.category()

<span class="kw">class</span> <span class="ty">Food</span>(<span class="ty">Product</span>):
    <span class="kw">def</span> <span class="fn">category</span>(self): <span class="kw">return</span> <span class="num">0.05</span>

catalogue = [<span class="ty">Food</span>(<span class="str">"Pain"</span>, <span class="num">2.50</span>)]
taxes = {p.name: p.tax_amount() <span class="kw">for</span> p <span class="kw">in</span> catalogue}`,
        cpp: `<span class="kw">class</span> <span class="ty">ITaxable</span> {
<span class="kw">public</span>: <span class="kw">virtual double</span> <span class="fn">taxAmount</span>() <span class="kw">const</span> = <span class="num">0</span>;
};
<span class="kw">class</span> <span class="ty">Product</span> : <span class="kw">public</span> <span class="ty">ITaxable</span> {
<span class="kw">protected</span>: std::<span class="ty">string</span> name; <span class="kw">double</span> price;
<span class="kw">public</span>:
    <span class="ty">Product</span>(std::<span class="ty">string</span> n, <span class="kw">double</span> p): name(n), price(p){}
    <span class="kw">virtual double</span> <span class="fn">taxRate</span>() <span class="kw">const</span> = <span class="num">0</span>;
    <span class="kw">double</span> <span class="fn">taxAmount</span>() <span class="kw">const override</span> { <span class="kw">return</span> price*taxRate(); }
};
std::vector&lt;std::unique_ptr&lt;<span class="ty">Product</span>&gt;&gt; catalogue;`,
        rust: `<span class="kw">trait</span> <span class="ty">Taxable</span> { <span class="kw">fn</span> <span class="fn">tax_amount</span>(&amp;self) -> f64; }

<span class="kw">struct</span> <span class="ty">Food</span> { name: <span class="ty">String</span>, price: f64 }
<span class="kw">impl</span> <span class="ty">Taxable</span> <span class="kw">for</span> <span class="ty">Food</span> {
    <span class="kw">fn</span> <span class="fn">tax_amount</span>(&amp;self) -> f64 { self.price * <span class="num">0.05</span> }
}
<span class="kw">let</span> catalogue: Vec&lt;Box&lt;<span class="kw">dyn</span> <span class="ty">Taxable</span>&gt;&gt; = vec![
    Box::new(<span class="ty">Food</span> { name: <span class="str">"Pain"</span>.into(), price: <span class="num">2.50</span> })
];
<span class="kw">let</span> total: f64 = catalogue.iter().map(|p| p.tax_amount()).sum();`,
      },
    },
    {
      id: 'c12_2',
      title: { fr: '2 — Erreurs classiques à éviter', en: '2 — Classic mistakes to avoid' },
      body: {
        fr: `Quelques pièges récurrents : oublier de redéfinir <code>hashCode()</code> quand on redéfinit <code>equals()</code>, confondre <code>overloading</code> et <code>overriding</code>, appeler une méthode abstraite sans implémentation dans toutes les sous-classes, utiliser une <code>List</code> quand un <code>Set</code> ferait mieux le travail (ou vice-versa), et oublier <code>super()</code> dans un constructeur de sous-classe.`,
        en: `Some recurring pitfalls: forgetting to override <code>hashCode()</code> when overriding <code>equals()</code>, confusing <code>overloading</code> and <code>overriding</code>, missing method implementations in subclasses, using a <code>List</code> when a <code>Set</code> would work better (or vice-versa), and forgetting <code>super()</code> in a subclass constructor.`,
      },
      code: {
        java: `<span class="cm">// Piège 1 : equals() sans hashCode()</span>
<span class="kw">class</span> <span class="ty">Tag</span> {
    <span class="ty">String</span> value;
    <span class="ty">Tag</span>(<span class="ty">String</span> v) { value = v; }
    @<span class="ty">Override</span>
    <span class="kw">public boolean</span> <span class="fn">equals</span>(<span class="ty">Object</span> o) {
        <span class="kw">return</span> o <span class="kw">instanceof</span> <span class="ty">Tag</span> t && value.equals(t.value);
    }
    <span class="cm">// MANQUE hashCode() — HashSet/HashMap CASSÉS !</span>
}

<span class="cm">// Piège 2 : confondre overloading et overriding</span>
<span class="kw">class</span> <span class="ty">A</span> { <span class="kw">void</span> <span class="fn">go</span>(<span class="kw">int</span> n) {} }
<span class="kw">class</span> <span class="ty">B</span> <span class="kw">extends</span> <span class="ty">A</span> {
    <span class="kw">void</span> <span class="fn">go</span>(<span class="ty">String</span> s) {} <span class="cm">// SURCHARGE, pas redéfinition !</span>
    <span class="cm">// @Override forcerait une erreur de compilation ici</span>
}

<span class="cm">// Piège 3 : NullPointerException sur Map</span>
<span class="ty">Map</span>&lt;<span class="ty">String</span>, <span class="ty">Integer</span>&gt; m = <span class="kw">new</span> <span class="ty">HashMap</span>&lt;&gt;();
<span class="cm">// int x = m.get("absent"); // NPE : unboxing de null</span>
<span class="kw">int</span> x = m.getOrDefault(<span class="str">"absent"</span>, <span class="num">0</span>); <span class="cm">// CORRECT</span>`,
        cs: `<span class="cm">// Piège 1 : GetHashCode() manquant</span>
<span class="kw">class</span> <span class="ty">Tag</span> {
    <span class="kw">public string</span> Value;
    <span class="kw">public override bool</span> <span class="fn">Equals</span>(<span class="ty">object</span> o)
        => o <span class="kw">is</span> <span class="ty">Tag</span> t && Value == t.Value;
    <span class="cm">// MANQUE GetHashCode() — HashSet cassé !</span>
}

<span class="cm">// Piège 2 : virtual manquant pour override</span>
<span class="kw">class</span> <span class="ty">A</span> { <span class="kw">public void</span> <span class="fn">Go</span>() {} } <span class="cm">// pas virtual</span>
<span class="kw">class</span> <span class="ty">B</span> : <span class="ty">A</span> { <span class="kw">public override void</span> <span class="fn">Go</span>() {} } <span class="cm">// ERREUR</span>
<span class="cm">// Solution : ajouter virtual à la méthode de A</span>`,
        py: `<span class="cm"># Piège 1 : __hash__ manquant</span>
<span class="kw">class</span> <span class="ty">Tag</span>:
    <span class="kw">def</span> <span class="fn">__init__</span>(self, v): self.value = v
    <span class="kw">def</span> <span class="fn">__eq__</span>(self, o):
        <span class="kw">return</span> isinstance(o, <span class="ty">Tag</span>) and self.value == o.value
    <span class="cm"># Python met __hash__ à None si __eq__ défini sans __hash__</span>
    <span class="cm"># → Tag ne peut pas être utilisé dans un set ou dict</span>
    <span class="kw">def</span> <span class="fn">__hash__</span>(self): <span class="kw">return</span> hash(self.value)  <span class="cm"># CORRECT</span>

<span class="cm"># Piège 2 : oublier super().__init__()</span>
<span class="kw">class</span> <span class="ty">Child</span>(<span class="ty">Parent</span>):
    <span class="kw">def</span> <span class="fn">__init__</span>(self):
        <span class="cm"># super().__init__()  ← oubli fréquent</span>
        self.own_attr = <span class="num">42</span>`,
        cpp: `<span class="cm">// Piège 1 : destructeur non virtuel</span>
<span class="kw">class</span> <span class="ty">Base</span> {
<span class="kw">public</span>:
    ~<span class="ty">Base</span>() {} <span class="cm">// NON virtuel — fuite mémoire possible</span>
};
<span class="kw">class</span> <span class="ty">Derived</span> : <span class="kw">public</span> <span class="ty">Base</span> { <span class="cm">/* ... */</span> };
<span class="ty">Base</span>* b = <span class="kw">new</span> <span class="ty">Derived</span>();
<span class="kw">delete</span> b; <span class="cm">// ~Derived() PAS appelé si ~Base non virtuel !</span>

<span class="cm">// Correction : virtual ~Base() = default;</span>

<span class="cm">// Piège 2 : oublier override</span>
<span class="kw">class</span> <span class="ty">A</span> { <span class="kw">virtual void</span> <span class="fn">go</span>() {} };
<span class="kw">class</span> <span class="ty">B</span> : <span class="kw">public</span> <span class="ty">A</span> { <span class="kw">void</span> <span class="fn">go</span>(<span class="kw">int</span> n) {} }; <span class="cm">// surcharge, pas override</span>`,
        rust: `<span class="cm">// Rust évite la plupart de ces pièges par conception</span>

<span class="cm">// Piège Rust : ne pas implémenter tous les méthodes d'un trait</span>
<span class="kw">trait</span> <span class="ty">Summary</span> { <span class="kw">fn</span> <span class="fn">summarize</span>(&amp;self) -> <span class="ty">String</span>; }
<span class="kw">struct</span> <span class="ty">Article</span>;
<span class="cm">// impl Summary for Article {}  // ERREUR : summarize() manquant</span>
<span class="kw">impl</span> <span class="ty">Summary</span> <span class="kw">for</span> <span class="ty">Article</span> {
    <span class="kw">fn</span> <span class="fn">summarize</span>(&amp;self) -> <span class="ty">String</span> { <span class="str">"Article..."</span>.to_string() }
}`,
      },
    },
  ],
  activities: [
    {
      id: 'a12_1', concept: 'c12_1', type: 'quiz', xp: 10,
      question: { fr: 'Une classe Student implémente Comparable<Student> ET hérite de Person (classe abstraite). Est-ce possible en Java ?', en: 'A Student class implements Comparable<Student> AND inherits from Person (abstract class). Is this possible in Java?' },
      choices: [
        { text: { fr: 'Non, une classe ne peut que faire l\'un ou l\'autre.', en: 'No, a class can only do one or the other.' }, correct: false, fb: { fr: 'Non. On peut hériter d\'une classe ET implémenter des interfaces.', en: 'No. You can inherit from a class AND implement interfaces.' } },
        { text: { fr: 'Oui : class Student extends Person implements Comparable<Student>', en: 'Yes: class Student extends Person implements Comparable<Student>' }, correct: true, fb: { fr: 'Correct ! La syntaxe est : extends d\'abord, implements ensuite.', en: 'Correct! The syntax is: extends first, implements after.' } },
        { text: { fr: 'Oui mais uniquement si Person est une interface.', en: 'Yes but only if Person is an interface.' }, correct: false, fb: { fr: 'Non, Person peut être une classe abstraite (ou concrète).', en: 'No, Person can be an abstract class (or concrete).' } },
        { text: { fr: 'Non, Comparable est réservé aux types primitifs.', en: 'No, Comparable is reserved for primitive types.' }, correct: false, fb: { fr: 'Non, Comparable<T> est une interface générique pour n\'importe quel type.', en: 'No, Comparable<T> is a generic interface for any type.' } },
      ],
    },
    {
      id: 'a12_2', concept: 'c12_2', type: 'bug', xp: 20,
      instr: { fr: 'Ce code Java contient deux erreurs distinctes. Identifie-les toutes les deux.', en: 'This Java code has two distinct errors. Identify both of them.' },
      bugCode: `<span class="kw">class</span> <span class="ty">Point</span> {
    <span class="kw">int</span> x, y;
    <span class="ty">Point</span>(<span class="kw">int</span> x, <span class="kw">int</span> y) { <span class="kw">this</span>.x=x; <span class="kw">this</span>.y=y; }
    @<span class="ty">Override</span>
    <span class="kw">public boolean</span> <span class="fn">equals</span>(<span class="ty">Object</span> o) {
        <span class="bug-line"><span class="ty">Point</span> p = (<span class="ty">Point</span>) o;</span>
        <span class="kw">return</span> x==p.x && y==p.y;
    }
    <span class="cm">// hashCode() non redéfini</span>
}
<span class="ty">Set</span>&lt;<span class="ty">Point</span>&gt; s = <span class="kw">new</span> <span class="ty">HashSet</span>&lt;&gt;();
s.add(<span class="kw">new</span> <span class="ty">Point</span>(<span class="num">1</span>,<span class="num">2</span>));
s.add(<span class="kw">new</span> <span class="ty">Point</span>(<span class="num">1</span>,<span class="num">2</span>));
<span class="ty">System</span>.out.println(<span class="bug-line">s.size()</span>); <span class="cm">// attendu : 1</span>`,
      explanation: { fr: 'Erreur 1 : cast non sécurisé dans equals() — il manque <code>if (!(o instanceof Point)) return false;</code>. Erreur 2 : hashCode() non redéfini — le HashSet utilise hashCode() pour déterminer le bucket, donc deux Points "égaux" selon equals() peuvent atterrir dans des buckets différents, d\'où size() = 2 au lieu de 1. Solution : ajouter la vérification instanceof ET redéfinir hashCode().', en: 'Error 1: unsafe cast in equals() — missing <code>if (!(o instanceof Point)) return false;</code>. Error 2: hashCode() not overridden — HashSet uses hashCode() to determine the bucket, so two Points "equal" by equals() may land in different buckets, causing size() = 2 instead of 1. Solution: add the instanceof check AND override hashCode().' },
    },
    {
      id: 'a12_3', concept: 'c12_1', type: 'predict', xp: 8,
      question: { fr: 'Quel est le résultat de ce code Java qui combine héritage, interface, et collections ?', en: 'What is the result of this Java code combining inheritance, interface, and collections?' },
      code: `<span class="kw">interface</span> <span class="ty">Named</span> { <span class="ty">String</span> <span class="fn">getName</span>(); }
<span class="kw">abstract class</span> <span class="ty">Animal</span> <span class="kw">implements</span> <span class="ty">Named</span> {
    <span class="kw">protected</span> <span class="ty">String</span> name;
    <span class="ty">Animal</span>(<span class="ty">String</span> n) { name = n; }
    <span class="kw">public</span> <span class="ty">String</span> <span class="fn">getName</span>() { <span class="kw">return</span> name; }
    <span class="kw">abstract</span> <span class="ty">String</span> <span class="fn">sound</span>();
}
<span class="kw">class</span> <span class="ty">Cat</span> <span class="kw">extends</span> <span class="ty">Animal</span> {
    <span class="ty">Cat</span>(<span class="ty">String</span> n) { <span class="kw">super</span>(n); }
    <span class="ty">String</span> <span class="fn">sound</span>() { <span class="kw">return</span> <span class="str">"Miaou"</span>; }
}
<span class="ty">List</span>&lt;<span class="ty">Animal</span>&gt; zoo = <span class="ty">List</span>.of(<span class="kw">new</span> <span class="ty">Cat</span>(<span class="str">"Luna"</span>), <span class="kw">new</span> <span class="ty">Cat</span>(<span class="str">"Mochi"</span>));
zoo.forEach(a -> <span class="ty">System</span>.out.println(a.getName() + <span class="str">": "</span> + a.sound()));`,
      explanation: { fr: '"Luna: Miaou" puis "Mochi: Miaou". Animal est abstraite et implémente Named. Cat hérite d\'Animal et fournit sound(). La liste est de type List<Animal> mais contient des Cat (polymorphisme). forEach itère et appelle getName() (hérité de Animal via Named) et sound() (redéfini dans Cat).', en: '"Luna: Miaou" then "Mochi: Miaou". Animal is abstract and implements Named. Cat inherits from Animal and provides sound(). The list is List<Animal> but contains Cat instances (polymorphism). forEach iterates and calls getName() (inherited from Animal via Named) and sound() (overridden in Cat).' },
    },
    {
      id: 'a12_4', concept: 'c12_2', type: 'quiz', xp: 10,
      question: { fr: 'Lequel de ces cas EST un exemple correct de polymorphisme en Java ?', en: 'Which of these cases IS a correct example of polymorphism in Java?' },
      choices: [
        { text: { fr: 'Deux méthodes print(String) et print(int) dans la même classe.', en: 'Two methods print(String) and print(int) in the same class.' }, correct: false, fb: { fr: 'C\'est de la surcharge (overloading), pas du polymorphisme par héritage.', en: 'That\'s overloading, not inheritance-based polymorphism.' } },
        { text: { fr: 'Animal a = new Dog(); a.speak(); appelle la méthode de Dog.', en: 'Animal a = new Dog(); a.speak(); calls Dog\'s method.' }, correct: true, fb: { fr: 'Correct ! Une référence de type parent pointe vers un objet enfant, et la méthode appelée est celle de l\'enfant (dispatch dynamique).', en: 'Correct! A parent-type reference points to a child object, and the method called is the child\'s (dynamic dispatch).' } },
        { text: { fr: 'Un objet Dog instancié avec new Dog().', en: 'A Dog object instantiated with new Dog().' }, correct: false, fb: { fr: 'C\'est de l\'instanciation, pas du polymorphisme.', en: 'That\'s instantiation, not polymorphism.' } },
        { text: { fr: 'Une classe Dog qui hérite de Animal mais ne redéfinit aucune méthode.', en: 'A class Dog that inherits from Animal but overrides no methods.' }, correct: false, fb: { fr: 'L\'héritage seul ne suffit pas — le polymorphisme requiert que le comportement change selon le type réel.', en: 'Inheritance alone is not enough — polymorphism requires the behaviour to change based on the actual type.' } },
      ],
    },
  ],
  homework: {
    fr: `<p>Dans ton dépôt GitHub, crée un dossier <strong>m12/</strong> contenant :</p>
<ol style="margin:.8rem 0 .8rem 2rem;font-size:1.45rem;color:var(--ch2);line-height:2">
  <li>Un <code>README.md</code> — Auto-évaluation : pour chacun des 4 piliers OOP, note-toi de 1 à 5 et explique en une phrase ce que tu maîtrises et ce qui reste flou.</li>
  <li>Un mini-projet intégratif : une bibliothèque de médias (livres, films, podcasts). Classe abstraite <code>Media</code>, interface <code>Searchable</code>, stockage dans une <code>Map&lt;String, List&lt;Media&gt;&gt;</code> par catégorie, tri par titre avec <code>Comparable</code>.</li>
  <li>Un <code>main</code> qui démontre l'ajout, la recherche, et l'affichage trié.</li>
</ol>`,
    en: `<p>In your GitHub repository, create a folder <strong>m12/</strong> containing:</p>
<ol style="margin:.8rem 0 .8rem 2rem;font-size:1.45rem;color:var(--ch2);line-height:2">
  <li>A <code>README.md</code> — Self-assessment: for each of the 4 OOP pillars, rate yourself 1–5 and explain in one sentence what you master and what's still unclear.</li>
  <li>An integrative mini-project: a media library (books, films, podcasts). Abstract class <code>Media</code>, interface <code>Searchable</code>, storage in a <code>Map&lt;String, List&lt;Media&gt;&gt;</code> by category, sorting by title with <code>Comparable</code>.</li>
  <li>A <code>main</code> demonstrating adding, searching, and sorted display.</li>
</ol>`,
  },



  references: [
    { title: { fr: 'W3Schools — Java OOP (révision)', en: 'W3Schools — Java OOP (review)' }, url: 'https://www.w3schools.com/java/java_oop.asp', note: { fr: 'Révision complète des concepts OOP Java', en: 'Complete review of Java OOP concepts' } },
    { title: { fr: 'W3Schools — Python OOP (révision)', en: 'W3Schools — Python OOP (review)' }, url: 'https://www.w3schools.com/python/python_classes.asp', note: { fr: 'Révision complète des concepts OOP Python', en: 'Complete review of Python OOP concepts' } },
    { title: { fr: 'Oracle — Java Collections Overview', en: 'Oracle — Java Collections Overview' }, url: 'https://docs.oracle.com/javase/8/docs/technotes/guides/collections/overview.html', note: { fr: 'Vue d\'ensemble de toutes les collections Java', en: 'Overview of all Java collections' } },
    { title: { fr: 'Refactoring.Guru — Design Patterns', en: 'Refactoring.Guru — Design Patterns' }, url: 'https://refactoring.guru/design-patterns', note: { fr: 'Catalogue illustré des patrons de conception', en: 'Illustrated design patterns catalogue' } },
    { title: { fr: 'Microsoft Docs — C# Collections', en: 'Microsoft Docs — C# Collections' }, url: 'https://learn.microsoft.com/en-us/dotnet/standard/collections/', note: { fr: 'Vue d\'ensemble des collections .NET', en: 'Overview of .NET collections' } },
  ],
};