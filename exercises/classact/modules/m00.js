'use strict';

const MODULE = {
  id: 'm00',
  num: '00',
  prev: null,
  next: 1,
  title: {
    fr: 'Introduction à la POO',
    en: 'Introduction to OOP',
  },
  sub: {
    fr: 'Les 4 piliers de la programmation orientée objet et leur syntaxe dans 5 langages.',
    en: 'The 4 pillars of object-oriented programming and their syntax across 5 languages.',
  },

  concepts: [
    // ── 1. What is OOP ────────────────────────────────────────
    {
      id: 'c00_1',
      title: { fr: '1 — Qu\'est-ce que la POO ?', en: '1 — What is OOP?' },
      body: {
        fr: `La programmation orientée objet organise le code autour d'<strong>objets</strong> — des entités qui regroupent des données (<em>attributs</em>) et des comportements (<em>méthodes</em>). Un objet est une instance concrète d'une <strong>classe</strong>, qui en est le modèle. Plutôt que d'écrire des fonctions isolées qui manipulent des données séparées, la POO permet de modéliser le problème en termes d'entités du monde réel.`,
        en: `Object-oriented programming organises code around <strong>objects</strong> — entities that bundle data (<em>attributes</em>) and behaviours (<em>methods</em>). An object is a concrete instance of a <strong>class</strong>, which serves as its blueprint. Rather than writing isolated functions that manipulate separate data, OOP lets you model problems in terms of real-world entities.`,
      },
      code: {
        java: `<span class="cm">// Définition d'une classe (le modèle)</span>
<span class="kw">class</span> <span class="ty">Animal</span> {
    <span class="ty">String</span> name;   <span class="cm">// attribut</span>
    <span class="kw">void</span> <span class="fn">speak</span>() { <span class="cm">// méthode</span>
        <span class="ty">System</span>.out.println(name + <span class="str">" parle."</span>);
    }
}
<span class="cm">// Création d'un objet (une instance)</span>
<span class="ty">Animal</span> a = <span class="kw">new</span> <span class="ty">Animal</span>();
a.name = <span class="str">"Rex"</span>;
a.speak(); <span class="cm">// Rex parle.</span>`,

        cs: `<span class="cm">// Définition d'une classe</span>
<span class="kw">class</span> <span class="ty">Animal</span> {
    <span class="kw">public</span> <span class="ty">string</span> Name;
    <span class="kw">public</span> <span class="kw">void</span> <span class="fn">Speak</span>() {
        <span class="ty">Console</span>.WriteLine(Name + <span class="str">" parle."</span>);
    }
}
<span class="cm">// Création d'un objet</span>
<span class="ty">Animal</span> a = <span class="kw">new</span> <span class="ty">Animal</span>();
a.Name = <span class="str">"Rex"</span>;
a.Speak();`,

        py: `<span class="cm"># Définition d'une classe</span>
<span class="kw">class</span> <span class="ty">Animal</span>:
    <span class="kw">def</span> <span class="fn">__init__</span>(self, name):
        self.name = name   <span class="cm"># attribut</span>
    <span class="kw">def</span> <span class="fn">speak</span>(self):     <span class="cm"># méthode</span>
        print(self.name + <span class="str">" parle."</span>)

<span class="cm"># Création d'un objet</span>
a = <span class="ty">Animal</span>(<span class="str">"Rex"</span>)
a.speak()  <span class="cm"># Rex parle.</span>`,

        cpp: `<span class="cm">// Définition d'une classe</span>
<span class="kw">class</span> <span class="ty">Animal</span> {
<span class="kw">public</span>:
    std::<span class="ty">string</span> name;
    <span class="kw">void</span> <span class="fn">speak</span>() {
        std::cout &lt;&lt; name &lt;&lt; <span class="str">" parle.\n"</span>;
    }
};
<span class="cm">// Création d'un objet</span>
<span class="ty">Animal</span> a;
a.name = <span class="str">"Rex"</span>;
a.speak();`,

        rust: `<span class="cm">// Définition d'une struct + impl</span>
<span class="kw">struct</span> <span class="ty">Animal</span> {
    name: <span class="ty">String</span>,
}
<span class="kw">impl</span> <span class="ty">Animal</span> {
    <span class="kw">fn</span> <span class="fn">speak</span>(&amp;self) {
        println!(<span class="str">"{} parle."</span>, self.name);
    }
}
<span class="cm">// Création d'un objet</span>
<span class="kw">let</span> a = <span class="ty">Animal</span> { name: <span class="ty">String</span>::from(<span class="str">"Rex"</span>) };
a.speak();`,
      },
    },

    // ── 2. The 4 pillars ──────────────────────────────────────
    {
      id: 'c00_2',
      title: { fr: '2 — Les 4 piliers', en: '2 — The 4 pillars' },
      body: {
        fr: `La POO repose sur quatre principes fondamentaux. L\'<strong>encapsulation</strong> regroupe données et méthodes dans une classe et restreint l\'accès direct via des modificateurs (<code>private</code>, <code>public</code>). L\'<strong>héritage</strong> permet à une classe de reprendre les membres d\'une autre. Le <strong>polymorphisme</strong> permet d\'appeler la bonne méthode selon le type réel de l\'objet. L\'<strong>abstraction</strong> expose uniquement ce qui est nécessaire et masque les détails internes.`,
        en: `OOP rests on four fundamental principles. <strong>Encapsulation</strong> bundles data and methods in a class and restricts direct access via modifiers (<code>private</code>, <code>public</code>). <strong>Inheritance</strong> allows a class to reuse members from another. <strong>Polymorphism</strong> allows calling the right method based on the object's actual type. <strong>Abstraction</strong> exposes only what is necessary and hides internal details.`,
      },
      code: {
        java: `<span class="cm">// Encapsulation — données privées, accès via méthodes</span>
<span class="kw">class</span> <span class="ty">BankAccount</span> {
    <span class="kw">private double</span> balance; <span class="cm">// inaccessible directement</span>
    <span class="kw">public void</span> <span class="fn">deposit</span>(<span class="kw">double</span> amount) { balance += amount; }
    <span class="kw">public double</span> <span class="fn">getBalance</span>() { <span class="kw">return</span> balance; }
}

<span class="cm">// Héritage</span>
<span class="kw">class</span> <span class="ty">Dog</span> <span class="kw">extends</span> <span class="ty">Animal</span> {
    <span class="kw">void</span> <span class="fn">speak</span>() { <span class="ty">System</span>.out.println(<span class="str">"Woof!"</span>); }
}

<span class="cm">// Polymorphisme — même appel, comportement différent</span>
<span class="ty">Animal</span> x = <span class="kw">new</span> <span class="ty">Dog</span>();
x.speak(); <span class="cm">// Woof! (méthode de Dog)</span>`,

        cs: `<span class="cm">// Encapsulation</span>
<span class="kw">class</span> <span class="ty">BankAccount</span> {
    <span class="kw">private double</span> balance;
    <span class="kw">public void</span> <span class="fn">Deposit</span>(<span class="kw">double</span> amount) { balance += amount; }
    <span class="kw">public double</span> <span class="fn">GetBalance</span>() { <span class="kw">return</span> balance; }
}

<span class="cm">// Héritage + polymorphisme</span>
<span class="kw">class</span> <span class="ty">Dog</span> : <span class="ty">Animal</span> {
    <span class="kw">public override void</span> <span class="fn">Speak</span>() {
        <span class="ty">Console</span>.WriteLine(<span class="str">"Woof!"</span>);
    }
}
<span class="ty">Animal</span> x = <span class="kw">new</span> <span class="ty">Dog</span>();
x.Speak(); <span class="cm">// Woof!</span>`,

        py: `<span class="cm"># Encapsulation (convention _ = privé)</span>
<span class="kw">class</span> <span class="ty">BankAccount</span>:
    <span class="kw">def</span> <span class="fn">__init__</span>(self):
        self._balance = <span class="num">0</span>
    <span class="kw">def</span> <span class="fn">deposit</span>(self, amount):
        self._balance += amount
    <span class="kw">def</span> <span class="fn">get_balance</span>(self):
        <span class="kw">return</span> self._balance

<span class="cm"># Héritage + polymorphisme</span>
<span class="kw">class</span> <span class="ty">Dog</span>(<span class="ty">Animal</span>):
    <span class="kw">def</span> <span class="fn">speak</span>(self):
        print(<span class="str">"Woof!"</span>)

x = <span class="ty">Dog</span>(<span class="str">"Rex"</span>)
x.speak()  <span class="cm"># Woof!</span>`,

        cpp: `<span class="cm">// Encapsulation</span>
<span class="kw">class</span> <span class="ty">BankAccount</span> {
<span class="kw">private</span>:
    <span class="kw">double</span> balance = <span class="num">0</span>;
<span class="kw">public</span>:
    <span class="kw">void</span> <span class="fn">deposit</span>(<span class="kw">double</span> a) { balance += a; }
    <span class="kw">double</span> <span class="fn">getBalance</span>() { <span class="kw">return</span> balance; }
};

<span class="cm">// Héritage + polymorphisme</span>
<span class="kw">class</span> <span class="ty">Dog</span> : <span class="kw">public</span> <span class="ty">Animal</span> {
<span class="kw">public</span>:
    <span class="kw">void</span> <span class="fn">speak</span>() <span class="kw">override</span> {
        std::cout &lt;&lt; <span class="str">"Woof!\n"</span>;
    }
};`,

        rust: `<span class="cm">// Encapsulation via champs privés + méthodes publiques</span>
<span class="kw">struct</span> <span class="ty">BankAccount</span> { balance: f64 }
<span class="kw">impl</span> <span class="ty">BankAccount</span> {
    <span class="kw">pub fn</span> <span class="fn">deposit</span>(&amp;<span class="kw">mut</span> self, amount: f64) { self.balance += amount; }
    <span class="kw">pub fn</span> <span class="fn">get_balance</span>(&amp;self) -> f64 { self.balance }
}

<span class="cm">// Héritage simulé via traits (Rust n'a pas d'héritage classique)</span>
<span class="kw">trait</span> <span class="ty">Speaks</span> { <span class="kw">fn</span> <span class="fn">speak</span>(&amp;self); }
<span class="kw">struct</span> <span class="ty">Dog</span>;
<span class="kw">impl</span> <span class="ty">Speaks</span> <span class="kw">for</span> <span class="ty">Dog</span> {
    <span class="kw">fn</span> <span class="fn">speak</span>(&amp;self) { println!(<span class="str">"Woof!"</span>); }
}`,
      },
    },
  ],

  activities: [
    // ── Activities tied to concept c00_1 ──────────────────────
    {
      id: 'a00_1', concept: 'c00_1', type: 'quiz', xp: 10,
      question: {
        fr: 'Quelle est la différence entre une classe et un objet ?',
        en: 'What is the difference between a class and an object?',
      },
      choices: [
        {
          text: { fr: 'Une classe est un objet spécial avec des méthodes statiques.', en: 'A class is a special object with static methods.' },
          correct: false,
          fb: { fr: 'Non. Les méthodes statiques appartiennent à une classe, mais ce n\'est pas ce qui différencie classe et objet.', en: 'No. Static methods belong to a class, but that\'s not what distinguishes a class from an object.' },
        },
        {
          text: { fr: 'Une classe est un modèle ; un objet est une instance concrète de ce modèle.', en: 'A class is a blueprint; an object is a concrete instance of that blueprint.' },
          correct: true,
          fb: { fr: 'Correct ! La classe définit la structure, l\'objet en est une réalisation en mémoire.', en: 'Correct! The class defines the structure; the object is a realisation of it in memory.' },
        },
        {
          text: { fr: 'Un objet est une classe sans attributs.', en: 'An object is a class without attributes.' },
          correct: false,
          fb: { fr: 'Non. Un objet a toujours les attributs définis par sa classe, avec ses propres valeurs.', en: 'No. An object always has the attributes defined by its class, with its own values.' },
        },
        {
          text: { fr: 'Classe et objet sont synonymes en POO moderne.', en: 'Class and object are synonyms in modern OOP.' },
          correct: false,
          fb: { fr: 'Non. Ce sont deux concepts distincts fondamentaux.', en: 'No. They are two distinct fundamental concepts.' },
        },
      ],
    },
    {
      id: 'a00_2', concept: 'c00_1', type: 'fill', xp: 15,
      instr: {
        fr: 'En Java, le mot-clé pour créer une nouvelle instance d\'une classe est :',
        en: 'In Java, the keyword used to create a new instance of a class is:',
      },
      template: { fr: 'Animal a = ______ Animal();', en: 'Animal a = ______ Animal();' },
      answer: 'new',
      hint: { fr: 'Même mot-clé en Java, C#, et C++.', en: 'Same keyword in Java, C#, and C++.' },
    },

    // ── Activities tied to concept c00_2 ──────────────────────
    {
      id: 'a00_3', concept: 'c00_2', type: 'quiz', xp: 10,
      question: {
        fr: 'Quel pilier OOP consiste à regrouper données et méthodes dans une classe et à restreindre l\'accès direct ?',
        en: 'Which OOP pillar consists of bundling data and methods in a class and restricting direct access?',
      },
      choices: [
        { text: { fr: 'Héritage', en: 'Inheritance' }, correct: false, fb: { fr: 'Non. L\'héritage concerne la relation entre classes.', en: 'No. Inheritance concerns the relationship between classes.' } },
        { text: { fr: 'Polymorphisme', en: 'Polymorphism' }, correct: false, fb: { fr: 'Non. Le polymorphisme concerne les comportements variables selon le type réel.', en: 'No. Polymorphism concerns variable behaviours depending on the actual type.' } },
        { text: { fr: 'Encapsulation', en: 'Encapsulation' }, correct: true, fb: { fr: 'Correct ! L\'encapsulation protège les données internes et expose une interface contrôlée.', en: 'Correct! Encapsulation protects internal data and exposes a controlled interface.' } },
        { text: { fr: 'Abstraction', en: 'Abstraction' }, correct: false, fb: { fr: 'Proche, mais l\'abstraction concerne plutôt le masquage de la complexité via des classes abstraites et interfaces.', en: 'Close, but abstraction is more about hiding complexity via abstract classes and interfaces.' } },
      ],
    },
    {
      id: 'a00_4', concept: 'c00_2', type: 'predict', xp: 8,
      question: {
        fr: 'Quel est le résultat de l\'appel x.speak() si x est déclaré comme Animal mais instancié en Dog qui redéfinit speak() ?',
        en: 'What is the result of calling x.speak() if x is declared as Animal but instantiated as Dog, which overrides speak()?',
      },
      code: `<span class="cm">// Java</span>
<span class="ty">Animal</span> x = <span class="kw">new</span> <span class="ty">Dog</span>();
x.speak();`,
      explanation: {
        fr: 'La méthode de Dog est appelée — c\'est le polymorphisme. Même si x est déclaré comme Animal, le type réel à l\'exécution est Dog. Java (et la plupart des langages OOP) utilisent la résolution dynamique : la méthode appelée dépend du type réel, pas du type déclaré.',
        en: 'Dog\'s method is called — that\'s polymorphism. Even though x is declared as Animal, the actual runtime type is Dog. Java (and most OOP languages) use dynamic dispatch: the method called depends on the actual type, not the declared type.',
      },
    },
    {
      id: 'a00_5', concept: 'c00_2', type: 'quiz', xp: 10,
      question: {
        fr: 'Parmi les 4 piliers OOP, lequel est particulièrement différent en Rust par rapport aux autres langages ?',
        en: 'Among the 4 OOP pillars, which one works quite differently in Rust compared to other languages?',
      },
      choices: [
        { text: { fr: 'Encapsulation', en: 'Encapsulation' }, correct: false, fb: { fr: 'L\'encapsulation fonctionne de façon similaire via les champs privés.', en: 'Encapsulation works similarly via private fields.' } },
        { text: { fr: 'Abstraction', en: 'Abstraction' }, correct: false, fb: { fr: 'L\'abstraction via les traits est bien présente.', en: 'Abstraction via traits is well supported.' } },
        { text: { fr: 'Héritage', en: 'Inheritance' }, correct: true, fb: { fr: 'Correct ! Rust n\'a pas d\'héritage de structure classique. Le partage de comportement passe par les traits (similaires aux interfaces), pas par extends.', en: 'Correct! Rust has no classical struct inheritance. Behaviour sharing is done via traits (similar to interfaces), not extends.' } },
        { text: { fr: 'Polymorphisme', en: 'Polymorphism' }, correct: false, fb: { fr: 'Le polymorphisme est supporté en Rust via les traits et les dyn Trait.', en: 'Polymorphism is supported in Rust via traits and dyn Trait.' } },
      ],
    },
  ],

  homework: {
    fr: `<p>Dans ton dépôt GitHub, crée un dossier <strong>m00/</strong> contenant :</p>
<ol style="margin:.8rem 0 .8rem 2rem;font-size:1.45rem;color:var(--ch2);line-height:2">
  <li>Un fichier <code>README.md</code> avec une section <strong>Les 4 piliers</strong> — décris chaque pilier en tes propres mots (2–3 phrases par pilier).</li>
  <li>Un fichier de code dans le langage de ton choix qui définit une classe <code>Etudiant</code> avec au moins deux attributs et une méthode <code>sePresenter()</code> qui affiche une présentation.</li>
  <li>Dans ton <code>README.md</code>, identifie quel pilier est illustré par ta classe <code>Etudiant</code> et pourquoi.</li>
</ol>`,
    en: `<p>In your GitHub repository, create a folder <strong>m00/</strong> containing:</p>
<ol style="margin:.8rem 0 .8rem 2rem;font-size:1.45rem;color:var(--ch2);line-height:2">
  <li>A <code>README.md</code> file with a section <strong>The 4 Pillars</strong> — describe each pillar in your own words (2–3 sentences per pillar).</li>
  <li>A code file in the language of your choice defining a class <code>Student</code> with at least two attributes and a <code>introduce()</code> method that prints a self-introduction.</li>
  <li>In your <code>README.md</code>, identify which pillar is illustrated by your <code>Student</code> class and why.</li>
</ol>`,
  },



  references: [
    { title: { fr: 'W3Schools — Java OOP', en: 'W3Schools — Java OOP' }, url: 'https://www.w3schools.com/java/java_oop.asp', note: { fr: 'Introduction aux concepts OOP en Java', en: 'Introduction to OOP concepts in Java' } },
    { title: { fr: 'W3Schools — Python OOP', en: 'W3Schools — Python OOP' }, url: 'https://www.w3schools.com/python/python_classes.asp', note: { fr: 'Classes et objets en Python', en: 'Classes and objects in Python' } },
    { title: { fr: 'W3Schools — C# OOP', en: 'W3Schools — C# OOP' }, url: 'https://www.w3schools.com/cs/cs_oop.php', note: { fr: 'Introduction à la POO en C#', en: 'Introduction to OOP in C#' } },
    { title: { fr: 'Oracle — Java OOP Concepts', en: 'Oracle — Java OOP Concepts' }, url: 'https://docs.oracle.com/javase/tutorial/java/concepts/index.html', note: { fr: 'Documentation officielle Java', en: 'Official Java documentation' } },
    { title: { fr: 'Python Docs — Classes', en: 'Python Docs — Classes' }, url: 'https://docs.python.org/3/tutorial/classes.html', note: { fr: 'Documentation officielle Python', en: 'Official Python documentation' } },
    { title: { fr: 'Microsoft Docs — C# OOP', en: 'Microsoft Docs — C# OOP' }, url: 'https://learn.microsoft.com/en-us/dotnet/csharp/fundamentals/object-oriented/', note: { fr: 'Documentation officielle C#', en: 'Official C# documentation' } },
    { title: { fr: 'cppreference — Classes (C++)', en: 'cppreference — Classes (C++)' }, url: 'https://en.cppreference.com/w/cpp/language/classes', note: { fr: 'Référence technique C++', en: 'C++ technical reference' } },
    { title: { fr: 'The Rust Book — Structs', en: 'The Rust Book — Structs' }, url: 'https://doc.rust-lang.org/book/ch05-00-structs.html', note: { fr: 'Structures et implémentations en Rust', en: 'Structs and implementations in Rust' } },
  ],
};