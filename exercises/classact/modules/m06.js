'use strict';
const MODULE = {
  id: 'm06', num: '06', prev: 5, next: 7,
  title: { fr: 'Interfaces I', en: 'Interfaces I' },
  sub: { fr: 'Déclarer et implémenter des interfaces.', en: 'Declaring and implementing interfaces.' },
  concepts: [
    {
      id: 'c06_1',
      title: { fr: '1 — Déclarer une interface', en: '1 — Declaring an interface' },
      body: {
        fr: `Une <strong>interface</strong> est un contrat qui définit ce qu\'une classe <em>peut faire</em>, sans dire comment. Elle liste des méthodes que toute classe implémentant l\'interface devra fournir. En Java, les méthodes d\'interface sont implicitement <code>public abstract</code>. Une interface ne peut pas avoir d\'attributs d\'instance ni de constructeurs — seulement des constantes et (depuis Java 8) des méthodes <code>default</code> ou <code>static</code>.`,
        en: `An <strong>interface</strong> is a contract that defines what a class <em>can do</em>, without saying how. It lists methods that any class implementing the interface must provide. In Java, interface methods are implicitly <code>public abstract</code>. An interface cannot have instance attributes or constructors — only constants and (since Java 8) <code>default</code> or <code>static</code> methods.`,
      },
      code: {
        java: `<span class="cm">// Déclaration d'une interface</span>
<span class="kw">interface</span> <span class="ty">Printable</span> {
    <span class="kw">void</span> <span class="fn">print</span>();                    <span class="cm">// implicitement public abstract</span>
    <span class="kw">default void</span> <span class="fn">printTwice</span>() {     <span class="cm">// Java 8+ : méthode default</span>
        <span class="fn">print</span>(); <span class="fn">print</span>();
    }
}
<span class="kw">interface</span> <span class="ty">Saveable</span> {
    <span class="kw">void</span> <span class="fn">save</span>(<span class="ty">String</span> filename);
}
<span class="cm">// Une classe peut implémenter plusieurs interfaces</span>
<span class="kw">class</span> <span class="ty">Report</span> <span class="kw">implements</span> <span class="ty">Printable</span>, <span class="ty">Saveable</span> {
    <span class="ty">String</span> content;
    <span class="ty">Report</span>(<span class="ty">String</span> c) { content = c; }

    @<span class="ty">Override</span>
    <span class="kw">public void</span> <span class="fn">print</span>() { <span class="ty">System</span>.out.println(content); }

    @<span class="ty">Override</span>
    <span class="kw">public void</span> <span class="fn">save</span>(<span class="ty">String</span> f) {
        <span class="ty">System</span>.out.println(<span class="str">"Sauvé dans "</span> + f);
    }
}`,
        cs: `<span class="kw">interface</span> <span class="ty">IPrintable</span> {
    <span class="kw">void</span> <span class="fn">Print</span>();
}
<span class="kw">interface</span> <span class="ty">ISaveable</span> {
    <span class="kw">void</span> <span class="fn">Save</span>(<span class="kw">string</span> filename);
}
<span class="kw">class</span> <span class="ty">Report</span> : <span class="ty">IPrintable</span>, <span class="ty">ISaveable</span> {
    <span class="kw">string</span> content;
    <span class="kw">public</span> <span class="ty">Report</span>(<span class="kw">string</span> c) { content = c; }
    <span class="kw">public void</span> <span class="fn">Print</span>() => <span class="ty">Console</span>.WriteLine(content);
    <span class="kw">public void</span> <span class="fn">Save</span>(<span class="kw">string</span> f) =>
        <span class="ty">Console</span>.WriteLine(<span class="str">"Sauvé dans "</span> + f);
}`,
        py: `<span class="kw">from</span> abc <span class="kw">import</span> ABC, abstractmethod

<span class="kw">class</span> <span class="ty">Printable</span>(ABC):
    @abstractmethod
    <span class="kw">def</span> <span class="fn">print</span>(self): ...

<span class="kw">class</span> <span class="ty">Saveable</span>(ABC):
    @abstractmethod
    <span class="kw">def</span> <span class="fn">save</span>(self, filename): ...

<span class="cm"># Python : héritage multiple</span>
<span class="kw">class</span> <span class="ty">Report</span>(<span class="ty">Printable</span>, <span class="ty">Saveable</span>):
    <span class="kw">def</span> <span class="fn">__init__</span>(self, c): self.content = c
    <span class="kw">def</span> <span class="fn">print</span>(self): print(self.content)
    <span class="kw">def</span> <span class="fn">save</span>(self, f): print(<span class="str">f"Sauvé dans {f}"</span>)`,
        cpp: `<span class="cm">// C++ : interface = classe abstraite pure</span>
<span class="kw">class</span> <span class="ty">IPrintable</span> {
<span class="kw">public</span>:
    <span class="kw">virtual void</span> <span class="fn">print</span>() <span class="kw">const</span> = <span class="num">0</span>;
    <span class="kw">virtual</span> ~<span class="ty">IPrintable</span>() = <span class="kw">default</span>;
};
<span class="kw">class</span> <span class="ty">ISaveable</span> {
<span class="kw">public</span>:
    <span class="kw">virtual void</span> <span class="fn">save</span>(std::<span class="ty">string</span> f) <span class="kw">const</span> = <span class="num">0</span>;
    <span class="kw">virtual</span> ~<span class="ty">ISaveable</span>() = <span class="kw">default</span>;
};
<span class="kw">class</span> <span class="ty">Report</span> : <span class="kw">public</span> <span class="ty">IPrintable</span>, <span class="kw">public</span> <span class="ty">ISaveable</span> {
    std::<span class="ty">string</span> content;
<span class="kw">public</span>:
    <span class="ty">Report</span>(std::<span class="ty">string</span> c) : content(c) {}
    <span class="kw">void</span> <span class="fn">print</span>() <span class="kw">const override</span> { std::cout &lt;&lt; content; }
    <span class="kw">void</span> <span class="fn">save</span>(std::<span class="ty">string</span> f) <span class="kw">const override</span> {
        std::cout &lt;&lt; <span class="str">"Sauvé dans "</span> &lt;&lt; f;
    }
};`,
        rust: `<span class="kw">trait</span> <span class="ty">Printable</span> { <span class="kw">fn</span> <span class="fn">print</span>(&amp;self); }
<span class="kw">trait</span> <span class="ty">Saveable</span>  { <span class="kw">fn</span> <span class="fn">save</span>(&amp;self, filename: &amp;<span class="kw">str</span>); }

<span class="kw">struct</span> <span class="ty">Report</span> { content: <span class="ty">String</span> }
<span class="kw">impl</span> <span class="ty">Printable</span> <span class="kw">for</span> <span class="ty">Report</span> {
    <span class="kw">fn</span> <span class="fn">print</span>(&amp;self) { println!(<span class="str">"{}"</span>, self.content); }
}
<span class="kw">impl</span> <span class="ty">Saveable</span> <span class="kw">for</span> <span class="ty">Report</span> {
    <span class="kw">fn</span> <span class="fn">save</span>(&amp;self, f: &amp;<span class="kw">str</span>) { println!(<span class="str">"Sauvé dans {}"</span>, f); }
}`,
      },
    },
    {
      id: 'c06_2',
      title: { fr: '2 — Utiliser les interfaces comme types', en: '2 — Using interfaces as types' },
      body: {
        fr: `Une interface peut être utilisée comme <strong>type de variable</strong> — c\'est un des usages les plus puissants. Cela permet d\'écrire du code qui fonctionne avec n\'importe quelle classe qui implémente l\'interface, sans connaître la classe concrète. C\'est le principe de la programmation orientée abstraction : <em>coder vers une interface, pas vers une implémentation</em>.`,
        en: `An interface can be used as a <strong>variable type</strong> — this is one of its most powerful uses. It allows writing code that works with any class implementing the interface, without knowing the concrete class. This is the principle of programming to an abstraction: <em>code to an interface, not to an implementation</em>.`,
      },
      code: {
        java: `<span class="kw">interface</span> <span class="ty">Drawable</span> { <span class="kw">void</span> <span class="fn">draw</span>(); }

<span class="kw">class</span> <span class="ty">Circle</span>    <span class="kw">implements</span> <span class="ty">Drawable</span> {
    <span class="kw">public void</span> <span class="fn">draw</span>() { <span class="ty">System</span>.out.println(<span class="str">"Cercle"</span>); }
}
<span class="kw">class</span> <span class="ty">Triangle</span>  <span class="kw">implements</span> <span class="ty">Drawable</span> {
    <span class="kw">public void</span> <span class="fn">draw</span>() { <span class="ty">System</span>.out.println(<span class="str">"Triangle"</span>); }
}

<span class="cm">// Code qui travaille avec Drawable, peu importe le type réel</span>
<span class="kw">static void</span> <span class="fn">drawAll</span>(<span class="ty">Drawable</span>[] shapes) {
    <span class="kw">for</span> (<span class="ty">Drawable</span> d : shapes) d.draw();
}

<span class="ty">Drawable</span>[] canvas = { <span class="kw">new</span> <span class="ty">Circle</span>(), <span class="kw">new</span> <span class="ty">Triangle</span>(), <span class="kw">new</span> <span class="ty">Circle</span>() };
<span class="fn">drawAll</span>(canvas);
<span class="cm">// Cercle / Triangle / Cercle</span>`,
        cs: `<span class="kw">interface</span> <span class="ty">IDrawable</span> { <span class="kw">void</span> <span class="fn">Draw</span>(); }
<span class="kw">class</span> <span class="ty">Circle</span>   : <span class="ty">IDrawable</span> { <span class="kw">public void</span> <span class="fn">Draw</span>() => <span class="ty">Console</span>.WriteLine(<span class="str">"Cercle"</span>); }
<span class="kw">class</span> <span class="ty">Triangle</span> : <span class="ty">IDrawable</span> { <span class="kw">public void</span> <span class="fn">Draw</span>() => <span class="ty">Console</span>.WriteLine(<span class="str">"Triangle"</span>); }

<span class="kw">static void</span> <span class="fn">DrawAll</span>(<span class="ty">IDrawable</span>[] shapes) {
    <span class="kw">foreach</span> (<span class="kw">var</span> d <span class="kw">in</span> shapes) d.Draw();
}`,
        py: `<span class="kw">from</span> abc <span class="kw">import</span> ABC, abstractmethod

<span class="kw">class</span> <span class="ty">Drawable</span>(ABC):
    @abstractmethod
    <span class="kw">def</span> <span class="fn">draw</span>(self): ...

<span class="kw">class</span> <span class="ty">Circle</span>(<span class="ty">Drawable</span>):
    <span class="kw">def</span> <span class="fn">draw</span>(self): print(<span class="str">"Cercle"</span>)

<span class="kw">class</span> <span class="ty">Triangle</span>(<span class="ty">Drawable</span>):
    <span class="kw">def</span> <span class="fn">draw</span>(self): print(<span class="str">"Triangle"</span>)

<span class="kw">def</span> <span class="fn">draw_all</span>(shapes): [s.draw() <span class="kw">for</span> s <span class="kw">in</span> shapes]
draw_all([<span class="ty">Circle</span>(), <span class="ty">Triangle</span>(), <span class="ty">Circle</span>()])`,
        cpp: `<span class="kw">class</span> <span class="ty">IDrawable</span> {
<span class="kw">public</span>:
    <span class="kw">virtual void</span> <span class="fn">draw</span>() <span class="kw">const</span> = <span class="num">0</span>;
    <span class="kw">virtual</span> ~<span class="ty">IDrawable</span>() = <span class="kw">default</span>;
};
<span class="kw">class</span> <span class="ty">Circle</span>   : <span class="kw">public</span> <span class="ty">IDrawable</span> { <span class="kw">public</span>: <span class="kw">void</span> <span class="fn">draw</span>() <span class="kw">const override</span> { std::cout &lt;&lt; <span class="str">"Cercle\n"</span>; } };
<span class="kw">class</span> <span class="ty">Triangle</span> : <span class="kw">public</span> <span class="ty">IDrawable</span> { <span class="kw">public</span>: <span class="kw">void</span> <span class="fn">draw</span>() <span class="kw">const override</span> { std::cout &lt;&lt; <span class="str">"Triangle\n"</span>; } };

<span class="kw">void</span> <span class="fn">drawAll</span>(std::vector&lt;<span class="ty">IDrawable</span>*&gt; shapes) {
    <span class="kw">for</span> (<span class="kw">auto</span> d : shapes) d->draw();
}`,
        rust: `<span class="kw">trait</span> <span class="ty">Drawable</span> { <span class="kw">fn</span> <span class="fn">draw</span>(&amp;self); }
<span class="kw">struct</span> <span class="ty">Circle</span>;
<span class="kw">struct</span> <span class="ty">Triangle</span>;
<span class="kw">impl</span> <span class="ty">Drawable</span> <span class="kw">for</span> <span class="ty">Circle</span>   { <span class="kw">fn</span> <span class="fn">draw</span>(&amp;self) { println!(<span class="str">"Cercle"</span>); } }
<span class="kw">impl</span> <span class="ty">Drawable</span> <span class="kw">for</span> <span class="ty">Triangle</span> { <span class="kw">fn</span> <span class="fn">draw</span>(&amp;self) { println!(<span class="str">"Triangle"</span>); } }

<span class="kw">fn</span> <span class="fn">draw_all</span>(shapes: &amp;[&amp;<span class="kw">dyn</span> <span class="ty">Drawable</span>]) {
    <span class="kw">for</span> d <span class="kw">in</span> shapes { d.draw(); }
}`,
      },
    },
  ],
  activities: [
    {
      id: 'a06_1', concept: 'c06_1', type: 'fill', xp: 15,
      instr: { fr: 'En Java, le mot-clé pour qu\'une classe respecte un contrat d\'interface est :', en: 'In Java, the keyword for a class to fulfil an interface contract is:' },
      template: { fr: 'class Report ______ Printable, Saveable { ... }', en: 'class Report ______ Printable, Saveable { ... }' },
      answer: 'implements',
      hint: { fr: 'extends est pour les classes. Ce mot-clé est réservé aux interfaces en Java.', en: 'extends is for classes. This keyword is reserved for interfaces in Java.' },
    },
    {
      id: 'a06_2', concept: 'c06_1', type: 'quiz', xp: 10,
      question: { fr: 'Combien d\'interfaces une classe Java peut-elle implémenter ?', en: 'How many interfaces can a Java class implement?' },
      choices: [
        { text: { fr: 'Une seule.', en: 'Only one.' }, correct: false, fb: { fr: 'Non. L\'implémentation multiple d\'interfaces est une des forces de Java face à l\'héritage simple.', en: 'No. Multiple interface implementation is one of Java\'s strengths given single class inheritance.' } },
        { text: { fr: 'Deux maximum.', en: 'Two at most.' }, correct: false, fb: { fr: 'Non, il n\'y a pas de limite.', en: 'No, there is no limit.' } },
        { text: { fr: 'Autant que nécessaire.', en: 'As many as needed.' }, correct: true, fb: { fr: 'Correct ! Une classe peut implémenter un nombre illimité d\'interfaces. C\'est ce qui compense l\'héritage simple des classes.', en: 'Correct! A class can implement any number of interfaces. This compensates for single class inheritance.' } },
        { text: { fr: 'Autant que nécessaire, mais seulement si la classe est abstraite.', en: 'As many as needed, but only if the class is abstract.' }, correct: false, fb: { fr: 'Non, n\'importe quelle classe peut implémenter plusieurs interfaces.', en: 'No, any class can implement multiple interfaces.' } },
      ],
    },
    {
      id: 'a06_3', concept: 'c06_2', type: 'predict', xp: 8,
      question: { fr: 'Quel est le résultat de ce code Java ?', en: 'What is the result of this Java code?' },
      code: `<span class="kw">interface</span> <span class="ty">Greeter</span> { <span class="ty">String</span> <span class="fn">greet</span>(<span class="ty">String</span> name); }
<span class="ty">Greeter</span> formal   = name -> <span class="str">"Bonjour, "</span> + name;
<span class="ty">Greeter</span> informal = name -> <span class="str">"Salut "</span>   + name + <span class="str">"!"</span>;
<span class="ty">System</span>.out.println(formal.greet(<span class="str">"Alice"</span>));
<span class="ty">System</span>.out.println(informal.greet(<span class="str">"Bob"</span>));`,
      explanation: { fr: 'Bonjour, Alice puis Salut Bob! Les interfaces fonctionnelles (une seule méthode abstraite) peuvent être implémentées par des lambdas en Java 8+. Greeter est une interface fonctionnelle — la lambda fournit l\'implémentation de greet().', en: 'Bonjour, Alice then Salut Bob! Functional interfaces (single abstract method) can be implemented by lambdas in Java 8+. Greeter is a functional interface — the lambda provides the implementation of greet().' },
    },
    {
      id: 'a06_4', concept: 'c06_2', type: 'bug', xp: 20,
      instr: { fr: 'Ce code Java ne compile pas. Trouve l\'erreur.', en: 'This Java code does not compile. Find the error.' },
      bugCode: `<span class="kw">interface</span> <span class="ty">Resizable</span> {
    <span class="bug-line"><span class="kw">private int</span> defaultSize = <span class="num">10</span>;</span>
    <span class="kw">void</span> <span class="fn">resize</span>(<span class="kw">int</span> newSize);
}`,
      explanation: { fr: 'Les interfaces ne peuvent pas avoir d\'attributs d\'instance. <code>private int defaultSize</code> est un attribut d\'instance — interdit. Les interfaces peuvent avoir des constantes (static final) : <code>int DEFAULT_SIZE = 10;</code> est valide (implicitement public static final).', en: 'Interfaces cannot have instance attributes. <code>private int defaultSize</code> is an instance attribute — not allowed. Interfaces can have constants (static final): <code>int DEFAULT_SIZE = 10;</code> is valid (implicitly public static final).' },
    },
  ],
  homework: {
    fr: `<p>Dans ton dépôt GitHub, crée un dossier <strong>m06/</strong> contenant :</p>
<ol style="margin:.8rem 0 .8rem 2rem;font-size:1.45rem;color:var(--ch2);line-height:2">
  <li>Un <code>README.md</code> — après avoir lu ce module, compare avec ton README de M05 : est-ce que tu changerais quelque chose à ta réponse sur "quand choisir une classe abstraite" ?</li>
  <li>Une interface <code>Exportable</code> avec <code>toCSV()</code> et <code>toJSON()</code>.</li>
  <li>Deux classes <code>Produit</code> et <code>Commande</code> qui implémentent <code>Exportable</code>. Les méthodes peuvent retourner des chaînes fictives.</li>
  <li>Un <code>main</code> qui stocke des <code>Exportable</code> dans une liste et appelle <code>toCSV()</code> sur chacun.</li>
</ol>`,
    en: `<p>In your GitHub repository, create a folder <strong>m06/</strong> containing:</p>
<ol style="margin:.8rem 0 .8rem 2rem;font-size:1.45rem;color:var(--ch2);line-height:2">
  <li>A <code>README.md</code> — after reading this module, compare with your M05 README: would you change anything in your answer on "when to choose an abstract class"?</li>
  <li>An interface <code>Exportable</code> with <code>toCSV()</code> and <code>toJSON()</code>.</li>
  <li>Two classes <code>Product</code> and <code>Order</code> implementing <code>Exportable</code>. Methods can return placeholder strings.</li>
  <li>A <code>main</code> that stores <code>Exportable</code> objects in a list and calls <code>toCSV()</code> on each.</li>
</ol>`,
  },



  references: [
    { title: { fr: 'W3Schools — Java Interfaces', en: 'W3Schools — Java Interfaces' }, url: 'https://www.w3schools.com/java/java_interface.asp', note: { fr: 'Déclarer et implémenter des interfaces Java', en: 'Declaring and implementing Java interfaces' } },
    { title: { fr: 'W3Schools — C# Interfaces', en: 'W3Schools — C# Interfaces' }, url: 'https://www.w3schools.com/cs/cs_interface.php', note: { fr: 'Interfaces en C#', en: 'Interfaces in C#' } },
    { title: { fr: 'W3Schools — Python Polymorphism', en: 'W3Schools — Python Polymorphism' }, url: 'https://www.w3schools.com/python/python_polymorphism.asp', note: { fr: 'Polymorphisme via classes abstraites en Python', en: 'Polymorphism via abstract classes in Python' } },
    { title: { fr: 'Oracle — Interfaces', en: 'Oracle — Interfaces' }, url: 'https://docs.oracle.com/javase/tutorial/java/IandI/createinterface.html', note: { fr: 'Documentation officielle Java', en: 'Official Java documentation' } },
    { title: { fr: 'Microsoft Docs — Interfaces (C#)', en: 'Microsoft Docs — Interfaces (C#)' }, url: 'https://learn.microsoft.com/en-us/dotnet/csharp/fundamentals/types/interfaces', note: { fr: 'Documentation officielle C#', en: 'Official C# documentation' } },
    { title: { fr: 'Rust Book — Traits', en: 'Rust Book — Traits' }, url: 'https://doc.rust-lang.org/book/ch10-02-traits.html', note: { fr: 'Les traits Rust comme équivalent des interfaces', en: 'Rust traits as interface equivalents' } },
    { title: { fr: 'cppreference — Abstract classes (C++ interfaces)', en: 'cppreference — Abstract classes (C++ interfaces)' }, url: 'https://en.cppreference.com/w/cpp/language/abstract_class', note: { fr: 'Interfaces en C++ via classes abstraites pures', en: 'C++ interfaces via pure abstract classes' } },
  ],
};