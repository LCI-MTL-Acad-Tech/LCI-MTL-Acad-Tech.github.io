'use strict';
const MODULE = {
  id: 'm04', num: '04', prev: 3, next: 5,
  title: { fr: 'Sous-classes et héritage', en: 'Subclasses and Inheritance' },
  sub: { fr: 'extends, super, redéfinition de méthodes (@Override).', en: 'extends, super, method overriding (@Override).' },
  concepts: [
    {
      id: 'c04_1',
      title: { fr: '1 — Créer une sous-classe', en: '1 — Creating a subclass' },
      body: {
        fr: `Une <strong>sous-classe</strong> hérite de tous les attributs et méthodes non-privés de sa <strong>super-classe</strong>. Le mot-clé varie selon le langage : <code>extends</code> en Java, <code>:</code> en C#/C++, parenthèses en Python. Le constructeur de la sous-classe doit appeler le constructeur parent via <code>super()</code> (Java/C#) ou <code>super().__init__()</code> (Python) — généralement en première ligne.`,
        en: `A <strong>subclass</strong> inherits all non-private attributes and methods from its <strong>superclass</strong>. The keyword varies by language: <code>extends</code> in Java, <code>:</code> in C#/C++, parentheses in Python. The subclass constructor must call the parent constructor via <code>super()</code> (Java/C#) or <code>super().__init__()</code> (Python) — usually as the first line.`,
      },
      code: {
        java: `<span class="kw">class</span> <span class="ty">Animal</span> {
    <span class="ty">String</span> name;
    <span class="ty">Animal</span>(<span class="ty">String</span> name) { <span class="kw">this</span>.name = name; }
    <span class="kw">void</span> <span class="fn">eat</span>() { <span class="ty">System</span>.out.println(name + <span class="str">" mange."</span>); }
}

<span class="kw">class</span> <span class="ty">Dog</span> <span class="kw">extends</span> <span class="ty">Animal</span> {
    <span class="ty">String</span> breed;
    <span class="ty">Dog</span>(<span class="ty">String</span> name, <span class="ty">String</span> breed) {
        <span class="kw">super</span>(name); <span class="cm">// appel du constructeur parent</span>
        <span class="kw">this</span>.breed = breed;
    }
    <span class="kw">void</span> <span class="fn">bark</span>() { <span class="ty">System</span>.out.println(name + <span class="str">" aboie !"</span>); }
}

<span class="ty">Dog</span> d = <span class="kw">new</span> <span class="ty">Dog</span>(<span class="str">"Rex"</span>, <span class="str">"Labrador"</span>);
d.eat();  <span class="cm">// Rex mange. (hérité)</span>
d.bark(); <span class="cm">// Rex aboie ! (propre à Dog)</span>`,
        cs: `<span class="kw">class</span> <span class="ty">Animal</span> {
    <span class="kw">public string</span> Name;
    <span class="kw">public</span> <span class="ty">Animal</span>(<span class="kw">string</span> name) { Name = name; }
    <span class="kw">public void</span> <span class="fn">Eat</span>() => <span class="ty">Console</span>.WriteLine(Name + <span class="str">" mange."</span>);
}
<span class="kw">class</span> <span class="ty">Dog</span> : <span class="ty">Animal</span> {
    <span class="kw">public string</span> Breed;
    <span class="kw">public</span> <span class="ty">Dog</span>(<span class="kw">string</span> name, <span class="kw">string</span> breed) : <span class="kw">base</span>(name) {
        Breed = breed;
    }
    <span class="kw">public void</span> <span class="fn">Bark</span>() => <span class="ty">Console</span>.WriteLine(Name + <span class="str">" aboie !"</span>);
}`,
        py: `<span class="kw">class</span> <span class="ty">Animal</span>:
    <span class="kw">def</span> <span class="fn">__init__</span>(self, name): self.name = name
    <span class="kw">def</span> <span class="fn">eat</span>(self): print(self.name + <span class="str">" mange."</span>)

<span class="kw">class</span> <span class="ty">Dog</span>(<span class="ty">Animal</span>):
    <span class="kw">def</span> <span class="fn">__init__</span>(self, name, breed):
        <span class="kw">super</span>().<span class="fn">__init__</span>(name)
        self.breed = breed
    <span class="kw">def</span> <span class="fn">bark</span>(self): print(self.name + <span class="str">" aboie !"</span>)

d = <span class="ty">Dog</span>(<span class="str">"Rex"</span>, <span class="str">"Labrador"</span>)
d.eat(); d.bark()`,
        cpp: `<span class="kw">class</span> <span class="ty">Animal</span> {
<span class="kw">public</span>:
    std::<span class="ty">string</span> name;
    <span class="ty">Animal</span>(std::<span class="ty">string</span> n) : name(n) {}
    <span class="kw">void</span> <span class="fn">eat</span>() { std::cout &lt;&lt; name &lt;&lt; <span class="str">" mange.\n"</span>; }
};
<span class="kw">class</span> <span class="ty">Dog</span> : <span class="kw">public</span> <span class="ty">Animal</span> {
<span class="kw">public</span>:
    std::<span class="ty">string</span> breed;
    <span class="ty">Dog</span>(std::<span class="ty">string</span> n, std::<span class="ty">string</span> b)
        : <span class="ty">Animal</span>(n), breed(b) {}
    <span class="kw">void</span> <span class="fn">bark</span>() { std::cout &lt;&lt; name &lt;&lt; <span class="str">" aboie !\n"</span>; }
};`,
        rust: `<span class="cm">// Rust n'a pas d'héritage de struct.</span>
<span class="cm">// On compose : Dog contient un Animal.</span>
<span class="kw">struct</span> <span class="ty">Animal</span> { name: <span class="ty">String</span> }
<span class="kw">struct</span> <span class="ty">Dog</span> { animal: <span class="ty">Animal</span>, breed: <span class="ty">String</span> }
<span class="kw">impl</span> <span class="ty">Animal</span> {
    <span class="kw">fn</span> <span class="fn">eat</span>(&amp;self) { println!(<span class="str">"{} mange."</span>, self.name); }
}
<span class="kw">impl</span> <span class="ty">Dog</span> {
    <span class="kw">fn</span> <span class="fn">bark</span>(&amp;self) { println!(<span class="str">"{} aboie !"</span>, self.animal.name); }
}`,
      },
    },
    {
      id: 'c04_2',
      title: { fr: '2 — Redéfinition de méthodes (overriding)', en: '2 — Method overriding' },
      body: {
        fr: `La <strong>redéfinition</strong> (overriding) consiste à réécrire dans la sous-classe une méthode héritée de la super-classe pour lui donner un comportement différent. En Java, l\'annotation <code>@Override</code> est fortement conseillée — elle permet au compilateur de détecter les erreurs de signature. Pour appeler la version parente depuis la version redéfinie, on utilise <code>super.methode()</code>.`,
        en: `<strong>Overriding</strong> means rewriting in the subclass an inherited method from the superclass to give it different behaviour. In Java, the <code>@Override</code> annotation is strongly recommended — it lets the compiler detect signature errors. To call the parent version from the overridden version, use <code>super.method()</code>.`,
      },
      code: {
        java: `<span class="kw">class</span> <span class="ty">Shape</span> {
    <span class="ty">String</span> color;
    <span class="ty">Shape</span>(<span class="ty">String</span> color) { <span class="kw">this</span>.color = color; }
    <span class="kw">double</span> <span class="fn">area</span>() { <span class="kw">return</span> <span class="num">0</span>; }
    <span class="ty">String</span> <span class="fn">describe</span>() {
        <span class="kw">return</span> color + <span class="str">" shape, area="</span> + <span class="fn">area</span>();
    }
}
<span class="kw">class</span> <span class="ty">Circle</span> <span class="kw">extends</span> <span class="ty">Shape</span> {
    <span class="kw">double</span> radius;
    <span class="ty">Circle</span>(<span class="ty">String</span> c, <span class="kw">double</span> r) { <span class="kw">super</span>(c); radius = r; }

    @<span class="ty">Override</span>
    <span class="kw">double</span> <span class="fn">area</span>() { <span class="kw">return</span> Math.PI * radius * radius; }
}
<span class="ty">Shape</span> s = <span class="kw">new</span> <span class="ty">Circle</span>(<span class="str">"rouge"</span>, <span class="num">5</span>);
<span class="ty">System</span>.out.println(s.describe());
<span class="cm">// rouge shape, area=78.53...</span>`,
        cs: `<span class="kw">class</span> <span class="ty">Shape</span> {
    <span class="kw">public string</span> Color;
    <span class="kw">public</span> <span class="ty">Shape</span>(<span class="kw">string</span> c) { Color = c; }
    <span class="kw">public virtual double</span> <span class="fn">Area</span>() => <span class="num">0</span>;
}
<span class="kw">class</span> <span class="ty">Circle</span> : <span class="ty">Shape</span> {
    <span class="kw">double</span> radius;
    <span class="kw">public</span> <span class="ty">Circle</span>(<span class="kw">string</span> c, <span class="kw">double</span> r) : <span class="kw">base</span>(c) { radius=r; }
    <span class="kw">public override double</span> <span class="fn">Area</span>() => Math.PI * radius * radius;
}
<span class="ty">Shape</span> s = <span class="kw">new</span> <span class="ty">Circle</span>(<span class="str">"rouge"</span>, <span class="num">5</span>);
<span class="ty">Console</span>.WriteLine(s.Area()); <span class="cm">// 78.53...</span>`,
        py: `<span class="kw">class</span> <span class="ty">Shape</span>:
    <span class="kw">def</span> <span class="fn">area</span>(self): <span class="kw">return</span> <span class="num">0</span>
    <span class="kw">def</span> <span class="fn">describe</span>(self):
        <span class="kw">return</span> <span class="str">f"area={self.area()}"</span>

<span class="kw">class</span> <span class="ty">Circle</span>(<span class="ty">Shape</span>):
    <span class="kw">def</span> <span class="fn">__init__</span>(self, r): self.radius = r
    <span class="kw">def</span> <span class="fn">area</span>(self):   <span class="cm"># redéfinition</span>
        <span class="kw">import</span> math
        <span class="kw">return</span> math.pi * self.radius ** <span class="num">2</span>

c = <span class="ty">Circle</span>(<span class="num">5</span>)
print(c.describe()) <span class="cm"># area=78.53...</span>`,
        cpp: `<span class="kw">class</span> <span class="ty">Shape</span> {
<span class="kw">public</span>:
    <span class="kw">virtual double</span> <span class="fn">area</span>() <span class="kw">const</span> { <span class="kw">return</span> <span class="num">0</span>; }
};
<span class="kw">class</span> <span class="ty">Circle</span> : <span class="kw">public</span> <span class="ty">Shape</span> {
    <span class="kw">double</span> radius;
<span class="kw">public</span>:
    <span class="ty">Circle</span>(<span class="kw">double</span> r) : radius(r) {}
    <span class="kw">double</span> <span class="fn">area</span>() <span class="kw">const override</span> {
        <span class="kw">return</span> <span class="num">3.14159</span> * radius * radius;
    }
};
<span class="ty">Shape</span>* s = <span class="kw">new</span> <span class="ty">Circle</span>(<span class="num">5</span>);
std::cout &lt;&lt; s->area(); <span class="cm">// 78.53...</span>`,
        rust: `<span class="kw">trait</span> <span class="ty">Shape</span> { <span class="kw">fn</span> <span class="fn">area</span>(&amp;self) -> f64; }
<span class="kw">struct</span> <span class="ty">Circle</span> { radius: f64 }
<span class="kw">impl</span> <span class="ty">Shape</span> <span class="kw">for</span> <span class="ty">Circle</span> {
    <span class="kw">fn</span> <span class="fn">area</span>(&amp;self) -> f64 {
        std::f64::consts::PI * self.radius * self.radius
    }
}
<span class="kw">let</span> c = <span class="ty">Circle</span> { radius: <span class="num">5.0</span> };
println!(<span class="str">"{:.2}"</span>, c.area()); <span class="cm">// 78.54</span>`,
      },
    },
  ],
  activities: [
    {
      id: 'a04_1', concept: 'c04_1', type: 'fill', xp: 15,
      instr: { fr: 'En Java, complète le constructeur de Dog pour appeler le constructeur parent Animal :', en: 'In Java, complete the Dog constructor to call the parent Animal constructor:' },
      template: { fr: 'Dog(String name) { ______(name); }', en: 'Dog(String name) { ______(name); }' },
      answer: 'super',
      hint: { fr: 'Même mot-clé dans Java et C#. Python utilise super().__init__().', en: 'Same keyword in Java and C#. Python uses super().__init__().' },
    },
    {
      id: 'a04_2', concept: 'c04_1', type: 'quiz', xp: 10,
      question: { fr: 'Qu\'hérite une sous-classe de sa super-classe en Java ?', en: 'What does a subclass inherit from its superclass in Java?' },
      choices: [
        { text: { fr: 'Tous les membres, y compris les privés.', en: 'All members, including private ones.' }, correct: false, fb: { fr: 'Non. Les membres privés ne sont pas directement accessibles dans la sous-classe.', en: 'No. Private members are not directly accessible in the subclass.' } },
        { text: { fr: 'Uniquement les méthodes publiques.', en: 'Only public methods.' }, correct: false, fb: { fr: 'Non. Les membres protected et package-private sont aussi hérités.', en: 'No. Protected and package-private members are also inherited.' } },
        { text: { fr: 'Tous les membres public et protected (attributs et méthodes).', en: 'All public and protected members (attributes and methods).' }, correct: true, fb: { fr: 'Correct ! Les membres private restent dans la super-classe mais peuvent être accédés via des getters protected ou public.', en: 'Correct! Private members remain in the superclass but can be accessed via protected or public getters.' } },
        { text: { fr: 'Uniquement les constructeurs.', en: 'Only constructors.' }, correct: false, fb: { fr: 'Les constructeurs ne sont pas hérités — on doit appeler super() explicitement.', en: 'Constructors are not inherited — super() must be called explicitly.' } },
      ],
    },
    {
      id: 'a04_3', concept: 'c04_2', type: 'predict', xp: 8,
      question: { fr: 'Qu\'affiche ce code Java ?', en: 'What does this Java code print?' },
      code: `<span class="kw">class</span> <span class="ty">A</span> { <span class="kw">void</span> <span class="fn">hello</span>() { <span class="ty">System</span>.out.println(<span class="str">"A"</span>); } }
<span class="kw">class</span> <span class="ty">B</span> <span class="kw">extends</span> <span class="ty">A</span> {
    @<span class="ty">Override</span>
    <span class="kw">void</span> <span class="fn">hello</span>() {
        <span class="kw">super</span>.hello();
        <span class="ty">System</span>.out.println(<span class="str">"B"</span>);
    }
}
<span class="ty">A</span> obj = <span class="kw">new</span> <span class="ty">B</span>();
obj.hello();`,
      explanation: { fr: 'Affiche A puis B sur deux lignes. super.hello() appelle la version de A, puis "B" est affiché. Même si obj est déclaré comme A, la méthode de B est appelée (polymorphisme par dispatch dynamique).', en: 'Prints A then B on two lines. super.hello() calls A\'s version, then "B" is printed. Even though obj is declared as A, B\'s method is called (dynamic dispatch polymorphism).' },
    },
    {
      id: 'a04_4', concept: 'c04_2', type: 'bug', xp: 20,
      instr: { fr: 'Ce code Java tente de redéfinir une méthode mais ne fonctionne pas comme prévu. Trouve le problème.', en: 'This Java code attempts to override a method but doesn\'t work as expected. Find the problem.' },
      bugCode: `<span class="kw">class</span> <span class="ty">Vehicle</span> {
    <span class="kw">void</span> <span class="fn">describe</span>() {
        <span class="ty">System</span>.out.println(<span class="str">"Véhicule"</span>);
    }
}
<span class="kw">class</span> <span class="ty">Car</span> <span class="kw">extends</span> <span class="ty">Vehicle</span> {
    <span class="cm">// Tentative de redéfinition</span>
    <span class="kw">void</span> <span class="fn">describe</span>(<span class="bug-line"><span class="ty">String</span> extra</span>) {
        <span class="ty">System</span>.out.println(<span class="str">"Voiture: "</span> + extra);
    }
}
<span class="ty">Vehicle</span> v = <span class="kw">new</span> <span class="ty">Car</span>();
v.describe();`,
      explanation: { fr: 'Ce n\'est pas une redéfinition (override) mais une surcharge (overload). La méthode de Car a un paramètre supplémentaire, donc elle ne remplace pas describe() de Vehicle. v.describe() appelle donc la version de Vehicle. Pour redéfinir correctement, la signature doit être identique : <code>void describe()</code> avec <code>@Override</code>.', en: 'This is not overriding but overloading. Car\'s method has an extra parameter, so it doesn\'t replace Vehicle\'s describe(). v.describe() therefore calls Vehicle\'s version. To correctly override, the signature must be identical: <code>void describe()</code> with <code>@Override</code>.' },
    },
  ],
  homework: {
    fr: `<p>Dans ton dépôt GitHub, crée un dossier <strong>m04/</strong> contenant :</p>
<ol style="margin:.8rem 0 .8rem 2rem;font-size:1.45rem;color:var(--ch2);line-height:2">
  <li>Un <code>README.md</code> avec un tableau à deux colonnes : <strong>surcharge</strong> vs <strong>redéfinition</strong>. Pour chaque ligne, une différence clé.</li>
  <li>Une hiérarchie : classe <code>Employe</code> (nom, salaire, calculerBonus()) → sous-classes <code>Manager</code> et <code>Technicien</code> avec des bonusses différents.</li>
  <li>Un <code>main</code> qui crée un tableau <code>Employe[]</code>, le remplit de Managers et Techniciens, et appelle <code>calculerBonus()</code> pour chacun (polymorphisme).</li>
</ol>`,
    en: `<p>In your GitHub repository, create a folder <strong>m04/</strong> containing:</p>
<ol style="margin:.8rem 0 .8rem 2rem;font-size:1.45rem;color:var(--ch2);line-height:2">
  <li>A <code>README.md</code> with a two-column table: <strong>overloading</strong> vs <strong>overriding</strong>. One key difference per row.</li>
  <li>A hierarchy: class <code>Employee</code> (name, salary, calculateBonus()) → subclasses <code>Manager</code> and <code>Technician</code> with different bonuses.</li>
  <li>A <code>main</code> that creates an <code>Employee[]</code> array, fills it with Managers and Technicians, and calls <code>calculateBonus()</code> for each (polymorphism).</li>
</ol>`,
  },



  references: [
    { title: { fr: 'W3Schools — Java Inheritance', en: 'W3Schools — Java Inheritance' }, url: 'https://www.w3schools.com/java/java_inheritance.asp', note: { fr: 'extends et super en Java', en: 'extends and super in Java' } },
    { title: { fr: 'W3Schools — Python Inheritance', en: 'W3Schools — Python Inheritance' }, url: 'https://www.w3schools.com/python/python_inheritance.asp', note: { fr: 'Héritage simple et multiple en Python', en: 'Single and multiple inheritance in Python' } },
    { title: { fr: 'W3Schools — C# Inheritance', en: 'W3Schools — C# Inheritance' }, url: 'https://www.w3schools.com/cs/cs_inheritance.php', note: { fr: 'Héritage et base en C#', en: 'Inheritance and base in C#' } },
    { title: { fr: 'W3Schools — Java Polymorphism', en: 'W3Schools — Java Polymorphism' }, url: 'https://www.w3schools.com/java/java_polymorphism.asp', note: { fr: 'Polymorphisme et @Override en Java', en: 'Polymorphism and @Override in Java' } },
    { title: { fr: 'Oracle — Inheritance', en: 'Oracle — Inheritance' }, url: 'https://docs.oracle.com/javase/tutorial/java/IandI/subclasses.html', note: { fr: 'Documentation officielle Java', en: 'Official Java documentation' } },
    { title: { fr: 'Microsoft Docs — Inheritance (C#)', en: 'Microsoft Docs — Inheritance (C#)' }, url: 'https://learn.microsoft.com/en-us/dotnet/csharp/fundamentals/object-oriented/inheritance', note: { fr: 'Documentation officielle C#', en: 'Official C# documentation' } },
    { title: { fr: 'cppreference — Derived classes (C++)', en: 'cppreference — Derived classes (C++)' }, url: 'https://en.cppreference.com/w/cpp/language/derived_class', note: { fr: 'Héritage en C++', en: 'Inheritance in C++' } },
    { title: { fr: 'Rust Book — Traits as Interfaces', en: 'Rust Book — Traits as Interfaces' }, url: 'https://doc.rust-lang.org/book/ch10-02-traits.html', note: { fr: 'Traits Rust en remplacement de l\'héritage', en: 'Rust traits as a replacement for inheritance' } },
  ],
};