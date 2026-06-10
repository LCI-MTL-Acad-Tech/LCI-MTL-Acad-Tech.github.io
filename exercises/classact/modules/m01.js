'use strict';

const MODULE = {
  id: 'm01', num: '01', prev: 0, next: 2,
  title: { fr: 'Classes et objets I', en: 'Classes and Objects I' },
  sub: { fr: 'Attributs, constructeurs, instanciation et méthodes de base.', en: 'Attributes, constructors, instantiation and basic methods.' },

  concepts: [
    {
      id: 'c01_1',
      title: { fr: '1 — Attributs et constructeurs', en: '1 — Attributes and constructors' },
      body: {
        fr: `Un <strong>attribut</strong> stocke l'état d'un objet. Un <strong>constructeur</strong> est une méthode spéciale appelée lors de la création d'un objet avec <code>new</code> — il initialise les attributs. Sans constructeur explicite, la plupart des langages fournissent un constructeur par défaut sans paramètres.`,
        en: `An <strong>attribute</strong> stores an object's state. A <strong>constructor</strong> is a special method called when an object is created with <code>new</code> — it initialises the attributes. Without an explicit constructor, most languages provide a default no-argument constructor.`,
      },
      code: {
        java: `<span class="kw">class</span> <span class="ty">Student</span> {
    <span class="ty">String</span> name;
    <span class="kw">int</span>    age;
    <span class="kw">double</span> gpa;

    <span class="ty">Student</span>(<span class="ty">String</span> name, <span class="kw">int</span> age, <span class="kw">double</span> gpa) {
        <span class="kw">this</span>.name = name;
        <span class="kw">this</span>.age  = age;
        <span class="kw">this</span>.gpa  = gpa;
    }
}
<span class="ty">Student</span> s = <span class="kw">new</span> <span class="ty">Student</span>(<span class="str">"Alice"</span>, <span class="num">20</span>, <span class="num">3.8</span>);
<span class="ty">System</span>.out.println(s.name); <span class="cm">// Alice</span>`,
        cs: `<span class="kw">class</span> <span class="ty">Student</span> {
    <span class="kw">public string</span> Name;
    <span class="kw">public int</span>    Age;
    <span class="kw">public double</span> Gpa;

    <span class="kw">public</span> <span class="ty">Student</span>(<span class="kw">string</span> name, <span class="kw">int</span> age, <span class="kw">double</span> gpa) {
        Name = name; Age = age; Gpa = gpa;
    }
}
<span class="ty">Student</span> s = <span class="kw">new</span> <span class="ty">Student</span>(<span class="str">"Alice"</span>, <span class="num">20</span>, <span class="num">3.8</span>);
<span class="ty">Console</span>.WriteLine(s.Name);`,
        py: `<span class="kw">class</span> <span class="ty">Student</span>:
    <span class="kw">def</span> <span class="fn">__init__</span>(self, name, age, gpa):
        self.name = name
        self.age  = age
        self.gpa  = gpa

s = <span class="ty">Student</span>(<span class="str">"Alice"</span>, <span class="num">20</span>, <span class="num">3.8</span>)
print(s.name)  <span class="cm"># Alice</span>`,
        cpp: `<span class="kw">class</span> <span class="ty">Student</span> {
<span class="kw">public</span>:
    std::<span class="ty">string</span> name;
    <span class="kw">int</span> age; <span class="kw">double</span> gpa;
    <span class="ty">Student</span>(std::<span class="ty">string</span> n, <span class="kw">int</span> a, <span class="kw">double</span> g)
        : name(n), age(a), gpa(g) {}
};
<span class="ty">Student</span> s(<span class="str">"Alice"</span>, <span class="num">20</span>, <span class="num">3.8</span>);
std::cout &lt;&lt; s.name;`,
        rust: `<span class="kw">struct</span> <span class="ty">Student</span> { name: <span class="ty">String</span>, age: u32, gpa: f64 }
<span class="kw">impl</span> <span class="ty">Student</span> {
    <span class="kw">fn</span> <span class="fn">new</span>(name: &amp;<span class="kw">str</span>, age: u32, gpa: f64) -> Self {
        <span class="ty">Student</span> { name: name.to_string(), age, gpa }
    }
}
<span class="kw">let</span> s = <span class="ty">Student</span>::<span class="fn">new</span>(<span class="str">"Alice"</span>, <span class="num">20</span>, <span class="num">3.8</span>);
println!(<span class="str">"{}"</span>, s.name);`,
      },
    },
    {
      id: 'c01_2',
      title: { fr: '2 — Méthodes et encapsulation', en: '2 — Methods and encapsulation' },
      body: {
        fr: `Les <strong>méthodes</strong> définissent le comportement d'un objet. Pour protéger les données, on déclare les attributs <code>private</code> et on y accède via des <strong>getters</strong> et <strong>setters</strong>. Le setter peut valider la valeur avant de l'assigner — c'est l'encapsulation en pratique.`,
        en: `<strong>Methods</strong> define an object's behaviour. To protect data, attributes are declared <code>private</code> and accessed via <strong>getters</strong> and <strong>setters</strong>. The setter can validate the value before assigning it — that's encapsulation in practice.`,
      },
      code: {
        java: `<span class="kw">class</span> <span class="ty">BankAccount</span> {
    <span class="kw">private double</span> balance;

    <span class="ty">BankAccount</span>(<span class="kw">double</span> initial) { <span class="kw">this</span>.balance = initial; }

    <span class="kw">public double</span> <span class="fn">getBalance</span>() { <span class="kw">return</span> balance; }

    <span class="kw">public void</span> <span class="fn">deposit</span>(<span class="kw">double</span> amount) {
        <span class="kw">if</span> (amount &gt; <span class="num">0</span>) balance += amount;
    }
}
<span class="ty">BankAccount</span> acc = <span class="kw">new</span> <span class="ty">BankAccount</span>(<span class="num">100.0</span>);
acc.deposit(<span class="num">50.0</span>);
<span class="ty">System</span>.out.println(acc.getBalance()); <span class="cm">// 150.0</span>`,
        cs: `<span class="kw">class</span> <span class="ty">BankAccount</span> {
    <span class="kw">private double</span> balance;
    <span class="kw">public</span> <span class="ty">BankAccount</span>(<span class="kw">double</span> initial) { balance = initial; }
    <span class="kw">public double</span> <span class="fn">GetBalance</span>() => balance;
    <span class="kw">public void</span> <span class="fn">Deposit</span>(<span class="kw">double</span> amount) {
        <span class="kw">if</span> (amount &gt; <span class="num">0</span>) balance += amount;
    }
}
<span class="kw">var</span> acc = <span class="kw">new</span> <span class="ty">BankAccount</span>(<span class="num">100.0</span>);
acc.Deposit(<span class="num">50.0</span>);
<span class="ty">Console</span>.WriteLine(acc.GetBalance()); <span class="cm">// 150</span>`,
        py: `<span class="kw">class</span> <span class="ty">BankAccount</span>:
    <span class="kw">def</span> <span class="fn">__init__</span>(self, initial):
        self._balance = initial

    <span class="kw">def</span> <span class="fn">get_balance</span>(self): <span class="kw">return</span> self._balance

    <span class="kw">def</span> <span class="fn">deposit</span>(self, amount):
        <span class="kw">if</span> amount &gt; <span class="num">0</span>: self._balance += amount

acc = <span class="ty">BankAccount</span>(<span class="num">100</span>)
acc.deposit(<span class="num">50</span>)
print(acc.get_balance())  <span class="cm"># 150</span>`,
        cpp: `<span class="kw">class</span> <span class="ty">BankAccount</span> {
<span class="kw">private</span>: <span class="kw">double</span> balance;
<span class="kw">public</span>:
    <span class="ty">BankAccount</span>(<span class="kw">double</span> i) : balance(i) {}
    <span class="kw">double</span> <span class="fn">getBalance</span>() <span class="kw">const</span> { <span class="kw">return</span> balance; }
    <span class="kw">void</span> <span class="fn">deposit</span>(<span class="kw">double</span> a) { <span class="kw">if</span>(a&gt;<span class="num">0</span>) balance+=a; }
};
<span class="ty">BankAccount</span> acc(<span class="num">100.0</span>);
acc.deposit(<span class="num">50.0</span>);
std::cout &lt;&lt; acc.getBalance(); <span class="cm">// 150</span>`,
        rust: `<span class="kw">struct</span> <span class="ty">BankAccount</span> { balance: f64 }
<span class="kw">impl</span> <span class="ty">BankAccount</span> {
    <span class="kw">fn</span> <span class="fn">new</span>(i: f64) -> Self { <span class="ty">BankAccount</span> { balance: i } }
    <span class="kw">fn</span> <span class="fn">get_balance</span>(&amp;self) -> f64 { self.balance }
    <span class="kw">fn</span> <span class="fn">deposit</span>(&amp;<span class="kw">mut</span> self, a: f64) { <span class="kw">if</span> a&gt;<span class="num">0.0</span> { self.balance+=a; } }
}
<span class="kw">let mut</span> acc = <span class="ty">BankAccount</span>::<span class="fn">new</span>(<span class="num">100.0</span>);
acc.deposit(<span class="num">50.0</span>);
println!(<span class="str">"{}"</span>, acc.get_balance()); <span class="cm">// 150</span>`,
      },
    },
  ],

  activities: [
    {
      id: 'a01_1', concept: 'c01_1', type: 'quiz', xp: 10,
      question: { fr: 'Un constructeur doit-il obligatoirement avoir des paramètres ?', en: 'Must a constructor always have parameters?' },
      choices: [
        { text: { fr: 'Oui, sinon la classe ne peut pas être instanciée.', en: 'Yes, otherwise the class cannot be instantiated.' }, correct: false, fb: { fr: 'Non. Un constructeur sans paramètre est valide.', en: 'No. A no-argument constructor is valid.' } },
        { text: { fr: 'Non — un constructeur sans paramètres s\'appelle constructeur par défaut.', en: 'No — a no-argument constructor is called a default constructor.' }, correct: true, fb: { fr: 'Correct ! Java et C# en génèrent un automatiquement si aucun n\'est défini.', en: 'Correct! Java and C# generate one automatically if none is defined.' } },
        { text: { fr: 'Oui, au moins un paramètre est requis.', en: 'Yes, at least one parameter is required.' }, correct: false, fb: { fr: 'Incorrect.', en: 'Incorrect.' } },
        { text: { fr: 'Un constructeur n\'a jamais de paramètres.', en: 'A constructor never has parameters.' }, correct: false, fb: { fr: 'Non, les constructeurs avec paramètres sont très courants.', en: 'No, constructors with parameters are very common.' } },
      ],
    },
    {
      id: 'a01_2', concept: 'c01_1', type: 'fill', xp: 15,
      instr: { fr: 'En Java, pour désigner l\'instance courante dans un constructeur, on utilise :', en: 'In Java, to refer to the current instance inside a constructor, you use:' },
      template: { fr: '______.name = name;', en: '______.name = name;' },
      answer: 'this',
      hint: { fr: 'Même mot-clé en Java, C#, C++. Python utilise self.', en: 'Same keyword in Java, C#, C++. Python uses self.' },
    },
    {
      id: 'a01_3', concept: 'c01_2', type: 'predict', xp: 8,
      question: { fr: 'Qu\'affiche ce code ?', en: 'What does this code print?' },
      code: `<span class="kw">class</span> <span class="ty">Counter</span> {
    <span class="kw">private int</span> count = <span class="num">0</span>;
    <span class="kw">void</span> <span class="fn">increment</span>() { count++; }
    <span class="kw">int</span>  <span class="fn">get</span>()       { <span class="kw">return</span> count; }
}
<span class="ty">Counter</span> c = <span class="kw">new</span> <span class="ty">Counter</span>();
c.increment(); c.increment(); c.increment();
<span class="ty">System</span>.out.println(c.get());`,
      explanation: { fr: 'Affiche 3. Chaque appel à increment() ajoute 1 à count. L\'attribut count est private — inaccessible directement de l\'extérieur.', en: 'Prints 3. Each call to increment() adds 1 to count. The count attribute is private — inaccessible directly from outside.' },
    },
    {
      id: 'a01_4', concept: 'c01_2', type: 'quiz', xp: 10,
      question: { fr: 'Pourquoi utiliser des getters/setters plutôt que des attributs publics ?', en: 'Why use getters/setters rather than public attributes?' },
      choices: [
        { text: { fr: 'Pour rendre le code plus long.', en: 'To make the code longer.' }, correct: false, fb: { fr: 'Non.', en: 'No.' } },
        { text: { fr: 'Pour contrôler et valider l\'accès aux données (encapsulation).', en: 'To control and validate data access (encapsulation).' }, correct: true, fb: { fr: 'Correct ! Un setter peut vérifier que la valeur est valide avant de l\'assigner.', en: 'Correct! A setter can verify the value is valid before assigning it.' } },
        { text: { fr: 'Java n\'autorise pas les attributs publics.', en: 'Java does not allow public attributes.' }, correct: false, fb: { fr: 'Java les autorise, mais c\'est déconseillé.', en: 'Java allows them, but it\'s discouraged.' } },
        { text: { fr: 'Pour améliorer les performances.', en: 'To improve performance.' }, correct: false, fb: { fr: 'Non, l\'impact est négligeable.', en: 'No, the impact is negligible.' } },
      ],
    },
    {
      id: 'a01_5', concept: 'c01_2', type: 'bug', xp: 20,
      instr: { fr: 'Ce code Java contient une erreur de compilation. Laquelle ?', en: 'This Java code has a compilation error. Which one?' },
      bugCode: `<span class="kw">class</span> <span class="ty">Circle</span> {
    <span class="kw">private double</span> radius;
    <span class="ty">Circle</span>(<span class="kw">double</span> r) { radius = r; }
    <span class="kw">double</span> <span class="fn">area</span>() { <span class="kw">return</span> Math.PI * radius * radius; }
}
<span class="ty">Circle</span> c = <span class="kw">new</span> <span class="ty">Circle</span>(<span class="num">5</span>);
<span class="ty">System</span>.out.println(<span class="bug-line">c.radius</span>);`,
      explanation: { fr: '<code>radius</code> est <code>private</code> — accès direct interdit depuis l\'extérieur. Il faut ajouter un getter : <code>public double getRadius() { return radius; }</code> et appeler <code>c.getRadius()</code>.', en: '<code>radius</code> is <code>private</code> — direct access is forbidden from outside. A getter is needed: <code>public double getRadius() { return radius; }</code> and call <code>c.getRadius()</code>.' },
    },
  ],

  homework: {
    fr: `<p>Dans ton dépôt GitHub, crée un dossier <strong>m01/</strong> contenant :</p>
<ol style="margin:.8rem 0 .8rem 2rem;font-size:1.45rem;color:var(--ch2);line-height:2">
  <li>Un <code>README.md</code> expliquant dans tes propres mots la différence entre <strong>attribut</strong>, <strong>constructeur</strong> et <strong>méthode</strong>, avec un exemple concret de ta vie quotidienne.</li>
  <li>Une classe <code>Playlist</code> avec attributs (nom, nombre de pistes, durée totale), constructeur, et méthodes <code>ajouterPiste()</code> et <code>afficherInfo()</code>.</li>
  <li>Un <code>main</code> créant deux instances de <code>Playlist</code> et appelant les méthodes.</li>
</ol>`,
    en: `<p>In your GitHub repository, create a folder <strong>m01/</strong> containing:</p>
<ol style="margin:.8rem 0 .8rem 2rem;font-size:1.45rem;color:var(--ch2);line-height:2">
  <li>A <code>README.md</code> explaining in your own words the difference between <strong>attribute</strong>, <strong>constructor</strong>, and <strong>method</strong>, with a concrete example from your daily life.</li>
  <li>A <code>Playlist</code> class with attributes (name, track count, total duration), a constructor, and methods <code>addTrack()</code> and <code>displayInfo()</code>.</li>
  <li>A <code>main</code> that creates two <code>Playlist</code> instances and calls the methods.</li>
</ol>`,
  },



  references: [
    { title: { fr: 'W3Schools — Java Classes & Objects', en: 'W3Schools — Java Classes & Objects' }, url: 'https://www.w3schools.com/java/java_classes.asp', note: { fr: 'Définir et instancier des classes Java', en: 'Defining and instantiating Java classes' } },
    { title: { fr: 'W3Schools — Python Classes', en: 'W3Schools — Python Classes' }, url: 'https://www.w3schools.com/python/python_classes.asp', note: { fr: 'Classes, __init__ et self en Python', en: 'Classes, __init__, and self in Python' } },
    { title: { fr: 'W3Schools — C# Classes', en: 'W3Schools — C# Classes' }, url: 'https://www.w3schools.com/cs/cs_classes.php', note: { fr: 'Classes et objets en C#', en: 'Classes and objects in C#' } },
    { title: { fr: 'Oracle — Providing Constructors', en: 'Oracle — Providing Constructors' }, url: 'https://docs.oracle.com/javase/tutorial/java/javaOO/constructors.html', note: { fr: 'Constructeurs en Java', en: 'Constructors in Java' } },
    { title: { fr: 'Python Docs — __init__', en: 'Python Docs — __init__' }, url: 'https://docs.python.org/3/reference/datamodel.html#object.__init__', note: { fr: 'Méthode d\'initialisation Python', en: 'Python initialisation method' } },
    { title: { fr: 'cppreference — Constructors (C++)', en: 'cppreference — Constructors (C++)' }, url: 'https://en.cppreference.com/w/cpp/language/constructor', note: { fr: 'Constructeurs en C++', en: 'C++ constructors' } },
    { title: { fr: 'The Rust Book — Methods', en: 'The Rust Book — Methods' }, url: 'https://doc.rust-lang.org/book/ch05-03-method-syntax.html', note: { fr: 'Méthodes et impl en Rust', en: 'Methods and impl in Rust' } },
  ],
};