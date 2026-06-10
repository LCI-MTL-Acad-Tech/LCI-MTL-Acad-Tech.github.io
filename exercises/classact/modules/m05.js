'use strict';
const MODULE = {
  id: 'm05', num: '05', prev: 4, next: 6,
  title: { fr: 'Classes abstraites', en: 'Abstract Classes' },
  sub: { fr: 'Méthodes abstraites, classes non-instanciables, quand les utiliser.', en: 'Abstract methods, non-instantiable classes, when to use them.' },
  concepts: [
    {
      id: 'c05_1',
      title: { fr: '1 — Déclarer une classe abstraite', en: '1 — Declaring an abstract class' },
      body: {
        fr: `Une <strong>classe abstraite</strong> ne peut pas être instanciée directement — elle doit être héritée. Elle peut contenir des <strong>méthodes abstraites</strong> (sans corps) que les sous-classes sont obligées d\'implémenter, ainsi que des méthodes concrètes (avec corps) partagées. C\'est le bon choix quand plusieurs classes partagent du code commun mais doivent chacune définir certains comportements spécifiques.`,
        en: `An <strong>abstract class</strong> cannot be instantiated directly — it must be inherited. It can contain <strong>abstract methods</strong> (no body) that subclasses are required to implement, as well as concrete methods (with body) that are shared. It\'s the right choice when several classes share common code but each must define certain specific behaviours.`,
      },
      code: {
        java: `<span class="kw">abstract class</span> <span class="ty">Shape</span> {
    <span class="ty">String</span> color;
    <span class="ty">Shape</span>(<span class="ty">String</span> color) { <span class="kw">this</span>.color = color; }

    <span class="cm">// Méthode abstraite : pas de corps, doit être implémentée</span>
    <span class="kw">abstract double</span> <span class="fn">area</span>();

    <span class="cm">// Méthode concrète partagée par toutes les sous-classes</span>
    <span class="kw">void</span> <span class="fn">printInfo</span>() {
        <span class="ty">System</span>.out.println(color + <span class="str">", area="</span> + <span class="fn">area</span>());
    }
}
<span class="kw">class</span> <span class="ty">Rectangle</span> <span class="kw">extends</span> <span class="ty">Shape</span> {
    <span class="kw">double</span> w, h;
    <span class="ty">Rectangle</span>(<span class="ty">String</span> c, <span class="kw">double</span> w, <span class="kw">double</span> h) {
        <span class="kw">super</span>(c); <span class="kw">this</span>.w=w; <span class="kw">this</span>.h=h;
    }
    @<span class="ty">Override</span>
    <span class="kw">double</span> <span class="fn">area</span>() { <span class="kw">return</span> w * h; }
}
<span class="cm">// Shape s = new Shape("rouge"); // ERREUR : abstraite</span>
<span class="ty">Shape</span> r = <span class="kw">new</span> <span class="ty">Rectangle</span>(<span class="str">"bleu"</span>, <span class="num">4</span>, <span class="num">5</span>);
r.printInfo(); <span class="cm">// bleu, area=20.0</span>`,
        cs: `<span class="kw">abstract class</span> <span class="ty">Shape</span> {
    <span class="kw">public string</span> Color;
    <span class="kw">public</span> <span class="ty">Shape</span>(<span class="kw">string</span> c) { Color = c; }
    <span class="kw">public abstract double</span> <span class="fn">Area</span>();
    <span class="kw">public void</span> <span class="fn">PrintInfo</span>() =>
        <span class="ty">Console</span>.WriteLine(<span class="str">$"{Color}, area={Area()}"</span>);
}
<span class="kw">class</span> <span class="ty">Rectangle</span> : <span class="ty">Shape</span> {
    <span class="kw">double</span> w, h;
    <span class="kw">public</span> <span class="ty">Rectangle</span>(<span class="kw">string</span> c, <span class="kw">double</span> w, <span class="kw">double</span> h)
        : <span class="kw">base</span>(c) { <span class="kw">this</span>.w=w; <span class="kw">this</span>.h=h; }
    <span class="kw">public override double</span> <span class="fn">Area</span>() => w * h;
}`,
        py: `<span class="kw">from</span> abc <span class="kw">import</span> ABC, abstractmethod

<span class="kw">class</span> <span class="ty">Shape</span>(ABC):
    <span class="kw">def</span> <span class="fn">__init__</span>(self, color): self.color = color

    @abstractmethod
    <span class="kw">def</span> <span class="fn">area</span>(self): ...   <span class="cm"># doit être implémentée</span>

    <span class="kw">def</span> <span class="fn">print_info</span>(self):
        print(<span class="str">f"{self.color}, area={self.area()}"</span>)

<span class="kw">class</span> <span class="ty">Rectangle</span>(<span class="ty">Shape</span>):
    <span class="kw">def</span> <span class="fn">__init__</span>(self, c, w, h):
        <span class="kw">super</span>().<span class="fn">__init__</span>(c); self.w=w; self.h=h
    <span class="kw">def</span> <span class="fn">area</span>(self): <span class="kw">return</span> self.w * self.h`,
        cpp: `<span class="kw">class</span> <span class="ty">Shape</span> { <span class="cm">// abstraite car méthode purement virtuelle</span>
<span class="kw">public</span>:
    std::<span class="ty">string</span> color;
    <span class="ty">Shape</span>(std::<span class="ty">string</span> c) : color(c) {}
    <span class="kw">virtual double</span> <span class="fn">area</span>() <span class="kw">const</span> = <span class="num">0</span>; <span class="cm">// purement virtuelle</span>
    <span class="kw">void</span> <span class="fn">printInfo</span>() <span class="kw">const</span> {
        std::cout &lt;&lt; color &lt;&lt; <span class="str">", area="</span> &lt;&lt; <span class="fn">area</span>() &lt;&lt; <span class="str">"\n"</span>;
    }
};
<span class="kw">class</span> <span class="ty">Rectangle</span> : <span class="kw">public</span> <span class="ty">Shape</span> {
    <span class="kw">double</span> w, h;
<span class="kw">public</span>:
    <span class="ty">Rectangle</span>(std::<span class="ty">string</span> c, <span class="kw">double</span> w, <span class="kw">double</span> h)
        : <span class="ty">Shape</span>(c), w(w), h(h) {}
    <span class="kw">double</span> <span class="fn">area</span>() <span class="kw">const override</span> { <span class="kw">return</span> w*h; }
};`,
        rust: `<span class="cm">// Rust : trait avec méthode par défaut = classe abstraite partielle</span>
<span class="kw">trait</span> <span class="ty">Shape</span> {
    <span class="kw">fn</span> <span class="fn">area</span>(&amp;self) -> f64;  <span class="cm">// abstraite</span>
    <span class="kw">fn</span> <span class="fn">print_info</span>(&amp;self) { <span class="cm">// concrète partagée</span>
        println!(<span class="str">"area={:.1}"</span>, self.area());
    }
}
<span class="kw">struct</span> <span class="ty">Rectangle</span> { w: f64, h: f64 }
<span class="kw">impl</span> <span class="ty">Shape</span> <span class="kw">for</span> <span class="ty">Rectangle</span> {
    <span class="kw">fn</span> <span class="fn">area</span>(&amp;self) -> f64 { self.w * self.h }
}`,
      },
    },
    {
      id: 'c05_2',
      title: { fr: '2 — Quand utiliser une classe abstraite ?', en: '2 — When to use an abstract class?' },
      body: {
        fr: `Utilise une classe abstraite quand : les sous-classes <strong>partagent du code commun</strong> (attributs, méthodes concrètes) qu\'il serait dupliqué sinon, ET certains comportements doivent être imposés aux sous-classes. Compare avec une interface (M06) : une interface ne peut pas avoir d\'attributs d\'instance ni de constructeurs — elle définit seulement un contrat. En Java, une classe peut hériter d\'une seule classe abstraite mais implémenter plusieurs interfaces.`,
        en: `Use an abstract class when: subclasses <strong>share common code</strong> (attributes, concrete methods) that would otherwise be duplicated, AND certain behaviours must be enforced on subclasses. Compare with an interface (M06): an interface cannot have instance attributes or constructors — it only defines a contract. In Java, a class can inherit from only one abstract class but implement multiple interfaces.`,
      },
      code: {
        java: `<span class="cm">// Bon usage : les formes partagent color et printInfo()</span>
<span class="kw">abstract class</span> <span class="ty">Shape</span> {
    <span class="kw">protected</span> <span class="ty">String</span> color;    <span class="cm">// attribut partagé</span>
    <span class="ty">Shape</span>(<span class="ty">String</span> c) { color = c; }
    <span class="kw">abstract double</span> <span class="fn">area</span>();   <span class="cm">// contrat imposé</span>
    <span class="kw">void</span> <span class="fn">printInfo</span>() {          <span class="cm">// méthode partagée</span>
        <span class="ty">System</span>.out.println(<span class="str">"["</span> + color + <span class="str">"] area="</span> + <span class="fn">area</span>());
    }
}

<span class="cm">// Mauvais usage : si on n'a pas de code partagé,</span>
<span class="cm">// une interface suffit (voir M06)</span>`,
        cs: `<span class="cm">// Classe abstraite avec état partagé — appropriée</span>
<span class="kw">abstract class</span> <span class="ty">Animal</span> {
    <span class="kw">protected string</span> Name;
    <span class="kw">protected int</span>    Energy = <span class="num">100</span>;
    <span class="kw">public</span> <span class="ty">Animal</span>(<span class="kw">string</span> name) { Name = name; }
    <span class="kw">public abstract void</span> <span class="fn">Eat</span>();
    <span class="kw">public void</span> <span class="fn">Sleep</span>() { Energy += <span class="num">20</span>; } <span class="cm">// partagée</span>
}`,
        py: `<span class="cm"># Classe abstraite appropriée : état + comportements partagés</span>
<span class="kw">from</span> abc <span class="kw">import</span> ABC, abstractmethod

<span class="kw">class</span> <span class="ty">Animal</span>(ABC):
    <span class="kw">def</span> <span class="fn">__init__</span>(self, name):
        self.name = name
        self.energy = <span class="num">100</span>         <span class="cm"># attribut partagé</span>

    @abstractmethod
    <span class="kw">def</span> <span class="fn">eat</span>(self): ...

    <span class="kw">def</span> <span class="fn">sleep</span>(self):              <span class="cm"># méthode partagée</span>
        self.energy += <span class="num">20</span>`,
        cpp: `<span class="cm">// Classe abstraite C++ : méthode virtuelle pure + état partagé</span>
<span class="kw">class</span> <span class="ty">Animal</span> {
<span class="kw">protected</span>:
    std::<span class="ty">string</span> name;
    <span class="kw">int</span> energy = <span class="num">100</span>;
<span class="kw">public</span>:
    <span class="ty">Animal</span>(std::<span class="ty">string</span> n) : name(n) {}
    <span class="kw">virtual void</span> <span class="fn">eat</span>() = <span class="num">0</span>;   <span class="cm">// abstraite</span>
    <span class="kw">void</span> <span class="fn">sleep</span>() { energy += <span class="num">20</span>; } <span class="cm">// partagée</span>
    <span class="kw">virtual</span> ~<span class="ty">Animal</span>() = <span class="kw">default</span>; <span class="cm">// destructeur virtuel</span>
};`,
        rust: `<span class="cm">// Trait avec méthode par défaut = comportement partagé</span>
<span class="kw">trait</span> <span class="ty">Animal</span> {
    <span class="kw">fn</span> <span class="fn">name</span>(&amp;self) -> &amp;<span class="kw">str</span>;
    <span class="kw">fn</span> <span class="fn">eat</span>(&amp;self);            <span class="cm">// abstraite</span>
    <span class="kw">fn</span> <span class="fn">sleep</span>(&amp;self) {        <span class="cm">// partagée (méthode par défaut)</span>
        println!(<span class="str">"{} dort."</span>, self.name());
    }
}`,
      },
    },
  ],
  activities: [
    {
      id: 'a05_1', concept: 'c05_1', type: 'quiz', xp: 10,
      question: { fr: 'Peut-on créer une instance directe d\'une classe abstraite en Java ?', en: 'Can you directly instantiate an abstract class in Java?' },
      choices: [
        { text: { fr: 'Oui, si elle a un constructeur public.', en: 'Yes, if it has a public constructor.' }, correct: false, fb: { fr: 'Non. Le mot-clé abstract interdit l\'instanciation directe, quel que soit le constructeur.', en: 'No. The abstract keyword forbids direct instantiation, regardless of the constructor.' } },
        { text: { fr: 'Non. Elle doit être héritée par une sous-classe concrète.', en: 'No. It must be inherited by a concrete subclass.' }, correct: true, fb: { fr: 'Correct ! Une tentative de new AbstractClass() provoque une erreur de compilation.', en: 'Correct! An attempt at new AbstractClass() causes a compilation error.' } },
        { text: { fr: 'Oui, si toutes ses méthodes abstraites ont une implémentation par défaut.', en: 'Yes, if all abstract methods have a default implementation.' }, correct: false, fb: { fr: 'Non. Si tous les corps sont définis, la classe ne devrait plus être marquée abstract.', en: 'No. If all bodies are defined, the class should no longer be marked abstract.' } },
        { text: { fr: 'Oui, via la réflexion (reflection).', en: 'Yes, via reflection.' }, correct: false, fb: { fr: 'Non, même la réflexion ne peut pas instancier une classe abstraite.', en: 'No, even reflection cannot instantiate an abstract class.' } },
      ],
    },
    {
      id: 'a05_2', concept: 'c05_1', type: 'fill', xp: 15,
      instr: { fr: 'Complète le mot-clé manquant pour déclarer une méthode abstraite en Java :', en: 'Complete the missing keyword to declare an abstract method in Java:' },
      template: { fr: 'public ______ double area();', en: 'public ______ double area();' },
      answer: 'abstract',
      hint: { fr: 'Ce même mot-clé apparaît aussi dans la déclaration de la classe.', en: 'This same keyword also appears in the class declaration.' },
    },
    {
      id: 'a05_3', concept: 'c05_2', type: 'quiz', xp: 10,
      question: { fr: 'Quelle affirmation est correcte concernant les classes abstraites vs les interfaces en Java ?', en: 'Which statement is correct about abstract classes vs interfaces in Java?' },
      choices: [
        { text: { fr: 'Une classe abstraite peut avoir des attributs d\'instance ; une interface ne peut pas.', en: 'An abstract class can have instance attributes; an interface cannot.' }, correct: true, fb: { fr: 'Correct ! C\'est la différence clé. Une interface ne peut pas avoir d\'état (attributs d\'instance). Java 8+ autorise des méthodes default dans les interfaces, mais pas d\'attributs d\'instance.', en: 'Correct! That\'s the key difference. An interface cannot have state (instance attributes). Java 8+ allows default methods in interfaces, but not instance attributes.' } },
        { text: { fr: 'Une interface peut être instanciée directement.', en: 'An interface can be directly instantiated.' }, correct: false, fb: { fr: 'Non, tout comme les classes abstraites.', en: 'No, just like abstract classes.' } },
        { text: { fr: 'On peut hériter de plusieurs classes abstraites en Java.', en: 'A class can inherit from multiple abstract classes in Java.' }, correct: false, fb: { fr: 'Non. Java n\'autorise qu\'un seul parent (héritage simple). On peut implémenter plusieurs interfaces.', en: 'No. Java only allows one parent (single inheritance). Multiple interfaces can be implemented.' } },
        { text: { fr: 'Une classe abstraite doit avoir au moins une méthode abstraite.', en: 'An abstract class must have at least one abstract method.' }, correct: false, fb: { fr: 'Non. Une classe peut être déclarée abstract sans aucune méthode abstraite — cela l\'empêche juste d\'être instanciée.', en: 'No. A class can be declared abstract without any abstract methods — it just prevents instantiation.' } },
      ],
    },
    {
      id: 'a05_4', concept: 'c05_2', type: 'predict', xp: 8,
      question: { fr: 'Que se passe-t-il si une sous-classe de classe abstraite n\'implémente pas toutes les méthodes abstraites ?', en: 'What happens if a subclass of an abstract class doesn\'t implement all abstract methods?' },
      code: `<span class="kw">abstract class</span> <span class="ty">Vehicle</span> {
    <span class="kw">abstract void</span> <span class="fn">fuel</span>();
    <span class="kw">abstract void</span> <span class="fn">move</span>();
}
<span class="kw">class</span> <span class="ty">Car</span> <span class="kw">extends</span> <span class="ty">Vehicle</span> {
    @<span class="ty">Override</span>
    <span class="kw">void</span> <span class="fn">fuel</span>() { <span class="ty">System</span>.out.println(<span class="str">"Essence"</span>); }
    <span class="cm">// move() non implémentée</span>
}`,
      explanation: { fr: 'Erreur de compilation. Car doit implémenter toutes les méthodes abstraites de Vehicle. La seule exception : si Car est elle-même déclarée abstract, elle peut déléguer l\'implémentation à ses propres sous-classes.', en: 'Compilation error. Car must implement all abstract methods from Vehicle. The only exception: if Car is itself declared abstract, it can delegate the implementation to its own subclasses.' },
    },
  ],
  homework: {
    fr: `<p>Dans ton dépôt GitHub, crée un dossier <strong>m05/</strong> contenant :</p>
<ol style="margin:.8rem 0 .8rem 2rem;font-size:1.45rem;color:var(--ch2);line-height:2">
  <li>Un <code>README.md</code> expliquant dans tes propres mots quand choisir une classe abstraite plutôt qu'une interface (avant de lire M06 !).</li>
  <li>Une classe abstraite <code>ComptesBancaire</code> avec attributs (solde, titulaire), méthodes concrètes (déposer, afficherSolde), et une méthode abstraite <code>calculerInterets()</code>.</li>
  <li>Deux sous-classes : <code>CompteEpargne</code> (taux fixe) et <code>CompteInvestissement</code> (taux variable selon le solde).</li>
</ol>`,
    en: `<p>In your GitHub repository, create a folder <strong>m05/</strong> containing:</p>
<ol style="margin:.8rem 0 .8rem 2rem;font-size:1.45rem;color:var(--ch2);line-height:2">
  <li>A <code>README.md</code> explaining in your own words when to choose an abstract class over an interface (before reading M06!).</li>
  <li>An abstract class <code>BankAccount</code> with attributes (balance, holder), concrete methods (deposit, printBalance), and an abstract method <code>calculateInterest()</code>.</li>
  <li>Two subclasses: <code>SavingsAccount</code> (fixed rate) and <code>InvestmentAccount</code> (variable rate based on balance).</li>
</ol>`,
  },



  references: [
    { title: { fr: 'W3Schools — Java Abstract Classes', en: 'W3Schools — Java Abstract Classes' }, url: 'https://www.w3schools.com/java/java_abstract.asp', note: { fr: 'Classes et méthodes abstraites en Java', en: 'Abstract classes and methods in Java' } },
    { title: { fr: 'W3Schools — C# Abstract', en: 'W3Schools — C# Abstract' }, url: 'https://www.w3schools.com/cs/cs_abstract.php', note: { fr: 'Classes abstraites en C#', en: 'Abstract classes in C#' } },
    { title: { fr: 'W3Schools — Python Abstract', en: 'W3Schools — Python Abstract' }, url: 'https://www.w3schools.com/python/python_abstract.asp', note: { fr: 'Classes abstraites avec ABC en Python', en: 'Abstract classes with ABC in Python' } },
    { title: { fr: 'Oracle — Abstract Classes', en: 'Oracle — Abstract Classes' }, url: 'https://docs.oracle.com/javase/tutorial/java/IandI/abstract.html', note: { fr: 'Documentation officielle Java', en: 'Official Java documentation' } },
    { title: { fr: 'Microsoft Docs — abstract (C#)', en: 'Microsoft Docs — abstract (C#)' }, url: 'https://learn.microsoft.com/en-us/dotnet/csharp/language-reference/keywords/abstract', note: { fr: 'Mot-clé abstract en C#', en: 'abstract keyword in C#' } },
    { title: { fr: 'Python Docs — abc module', en: 'Python Docs — abc module' }, url: 'https://docs.python.org/3/library/abc.html', note: { fr: 'Module abc : Abstract Base Classes', en: 'abc module: Abstract Base Classes' } },
    { title: { fr: 'cppreference — Pure virtual (C++)', en: 'cppreference — Pure virtual (C++)' }, url: 'https://en.cppreference.com/w/cpp/language/abstract_class', note: { fr: 'Classes abstraites C++ via méthodes virtuelles pures', en: 'C++ abstract classes via pure virtual methods' } },
  ],
};