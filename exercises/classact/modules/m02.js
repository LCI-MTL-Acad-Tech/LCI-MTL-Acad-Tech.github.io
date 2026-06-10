'use strict';
const MODULE = {
  id: 'm02', num: '02', prev: 1, next: 3,
  title: { fr: 'Classes et objets II', en: 'Classes and Objects II' },
  sub: { fr: 'Surcharge de méthodes, equals(), classes internes.', en: 'Method overloading, equals(), inner classes.' },
  concepts: [
    {
      id: 'c02_1',
      title: { fr: '1 — Surcharge de méthodes (overloading)', en: '1 — Method overloading' },
      body: {
        fr: `La <strong>surcharge</strong> consiste à définir plusieurs méthodes avec le <strong>même nom</strong> mais des <strong>signatures différentes</strong> (nombre ou types de paramètres différents). Le compilateur choisit la bonne version selon les arguments fournis à l\'appel. La surcharge ne dépend <em>pas</em> du type de retour.`,
        en: `<strong>Overloading</strong> means defining multiple methods with the <strong>same name</strong> but <strong>different signatures</strong> (different number or types of parameters). The compiler picks the right version based on the arguments provided. Overloading does <em>not</em> depend on the return type.`,
      },
      code: {
        java: `<span class="kw">class</span> <span class="ty">Printer</span> {
    <span class="kw">void</span> <span class="fn">print</span>(<span class="ty">String</span> s)  { <span class="ty">System</span>.out.println(s); }
    <span class="kw">void</span> <span class="fn">print</span>(<span class="kw">int</span> n)     { <span class="ty">System</span>.out.println(n); }
    <span class="kw">void</span> <span class="fn">print</span>(<span class="ty">String</span> s, <span class="kw">int</span> n) {
        <span class="ty">System</span>.out.println(s + <span class="str">" x"</span> + n);
    }
}
<span class="ty">Printer</span> p = <span class="kw">new</span> <span class="ty">Printer</span>();
p.print(<span class="str">"Bonjour"</span>);   <span class="cm">// Bonjour</span>
p.print(<span class="num">42</span>);          <span class="cm">// 42</span>
p.print(<span class="str">"Score"</span>, <span class="num">10</span>); <span class="cm">// Score x10</span>`,
        cs: `<span class="kw">class</span> <span class="ty">Printer</span> {
    <span class="kw">void</span> <span class="fn">Print</span>(<span class="kw">string</span> s)  => <span class="ty">Console</span>.WriteLine(s);
    <span class="kw">void</span> <span class="fn">Print</span>(<span class="kw">int</span> n)     => <span class="ty">Console</span>.WriteLine(n);
    <span class="kw">void</span> <span class="fn">Print</span>(<span class="kw">string</span> s, <span class="kw">int</span> n)
        => <span class="ty">Console</span>.WriteLine(s + <span class="str">" x"</span> + n);
}`,
        py: `<span class="cm"># Python ne supporte pas la surcharge native.</span>
<span class="cm"># On utilise des paramètres optionnels :</span>
<span class="kw">class</span> <span class="ty">Printer</span>:
    <span class="kw">def</span> <span class="fn">print_val</span>(self, s, n=<span class="kw">None</span>):
        <span class="kw">if</span> n <span class="kw">is</span> <span class="kw">None</span>:
            print(s)
        <span class="kw">else</span>:
            print(<span class="str">f"{s} x{n}"</span>)`,
        cpp: `<span class="kw">class</span> <span class="ty">Printer</span> {
<span class="kw">public</span>:
    <span class="kw">void</span> <span class="fn">print</span>(std::<span class="ty">string</span> s) { std::cout &lt;&lt; s &lt;&lt; <span class="str">"\n"</span>; }
    <span class="kw">void</span> <span class="fn">print</span>(<span class="kw">int</span> n)         { std::cout &lt;&lt; n &lt;&lt; <span class="str">"\n"</span>; }
    <span class="kw">void</span> <span class="fn">print</span>(std::<span class="ty">string</span> s, <span class="kw">int</span> n) {
        std::cout &lt;&lt; s &lt;&lt; <span class="str">" x"</span> &lt;&lt; n &lt;&lt; <span class="str">"\n"</span>;
    }
};`,
        rust: `<span class="cm">// Rust n'a pas de surcharge. On utilise des traits ou des enums :</span>
<span class="kw">enum</span> <span class="ty">PrintVal</span> { Text(<span class="ty">String</span>), Number(<span class="kw">i32</span>), TextNum(<span class="ty">String</span>, <span class="kw">i32</span>) }
<span class="kw">fn</span> <span class="fn">print_val</span>(v: <span class="ty">PrintVal</span>) {
    <span class="kw">match</span> v {
        <span class="ty">PrintVal</span>::Text(s)      => println!(<span class="str">"{}"</span>, s),
        <span class="ty">PrintVal</span>::Number(n)    => println!(<span class="str">"{}"</span>, n),
        <span class="ty">PrintVal</span>::TextNum(s,n) => println!(<span class="str">"{} x{}"</span>, s, n),
    }
}`,
      },
    },
    {
      id: 'c02_2',
      title: { fr: '2 — equals() et classes internes', en: '2 — equals() and inner classes' },
      body: {
        fr: `Par défaut, <code>equals()</code> compare les <strong>références</strong> (adresses mémoire). Pour comparer les <strong>contenus</strong>, il faut redéfinir equals(). En Java, on redéfinit aussi <code>hashCode()</code> pour maintenir le contrat : si deux objets sont égaux selon equals(), ils doivent avoir le même hashCode. Une <strong>classe interne</strong> est une classe définie à l\'intérieur d\'une autre — elle a accès aux membres privés de la classe externe.`,
        en: `By default, <code>equals()</code> compares <strong>references</strong> (memory addresses). To compare <strong>contents</strong>, equals() must be overridden. In Java, <code>hashCode()</code> must also be overridden to maintain the contract: if two objects are equal by equals(), they must have the same hashCode. An <strong>inner class</strong> is a class defined inside another — it has access to the outer class\'s private members.`,
      },
      code: {
        java: `<span class="kw">class</span> <span class="ty">Point</span> {
    <span class="kw">int</span> x, y;
    <span class="ty">Point</span>(<span class="kw">int</span> x, <span class="kw">int</span> y) { <span class="kw">this</span>.x=x; <span class="kw">this</span>.y=y; }

    <span class="cm">// Redéfinir equals()</span>
    @<span class="ty">Override</span>
    <span class="kw">public boolean</span> <span class="fn">equals</span>(<span class="ty">Object</span> o) {
        <span class="kw">if</span> (<span class="kw">this</span> == o) <span class="kw">return true</span>;
        <span class="kw">if</span> (!(o <span class="kw">instanceof</span> <span class="ty">Point</span>)) <span class="kw">return false</span>;
        <span class="ty">Point</span> p = (<span class="ty">Point</span>) o;
        <span class="kw">return</span> x == p.x && y == p.y;
    }
    @<span class="ty">Override</span>
    <span class="kw">public int</span> <span class="fn">hashCode</span>() { <span class="kw">return</span> <span class="ty">Objects</span>.hash(x, y); }

    <span class="cm">// Classe interne</span>
    <span class="kw">class</span> <span class="ty">Translator</span> {
        <span class="ty">Point</span> <span class="fn">move</span>(<span class="kw">int</span> dx, <span class="kw">int</span> dy) {
            <span class="kw">return new</span> <span class="ty">Point</span>(x+dx, y+dy); <span class="cm">// accès à x,y</span>
        }
    }
}
<span class="ty">Point</span> a = <span class="kw">new</span> <span class="ty">Point</span>(<span class="num">1</span>,<span class="num">2</span>), b = <span class="kw">new</span> <span class="ty">Point</span>(<span class="num">1</span>,<span class="num">2</span>);
<span class="ty">System</span>.out.println(a.equals(b)); <span class="cm">// true</span>`,
        cs: `<span class="kw">class</span> <span class="ty">Point</span> {
    <span class="kw">public int</span> X, Y;
    <span class="kw">public</span> <span class="ty">Point</span>(<span class="kw">int</span> x, <span class="kw">int</span> y) { X=x; Y=y; }

    <span class="kw">public override bool</span> <span class="fn">Equals</span>(<span class="ty">object</span> o)
        => o <span class="kw">is</span> <span class="ty">Point</span> p && X==p.X && Y==p.Y;

    <span class="kw">public override int</span> <span class="fn">GetHashCode</span>()
        => <span class="ty">HashCode</span>.Combine(X, Y);
}
<span class="kw">var</span> a = <span class="kw">new</span> <span class="ty">Point</span>(<span class="num">1</span>,<span class="num">2</span>);
<span class="kw">var</span> b = <span class="kw">new</span> <span class="ty">Point</span>(<span class="num">1</span>,<span class="num">2</span>);
<span class="ty">Console</span>.WriteLine(a.Equals(b)); <span class="cm">// True</span>`,
        py: `<span class="kw">class</span> <span class="ty">Point</span>:
    <span class="kw">def</span> <span class="fn">__init__</span>(self, x, y): self.x=x; self.y=y
    <span class="kw">def</span> <span class="fn">__eq__</span>(self, other):   <span class="cm"># équivalent de equals()</span>
        <span class="kw">return</span> isinstance(other, <span class="ty">Point</span>) and self.x==other.x and self.y==other.y
    <span class="kw">def</span> <span class="fn">__hash__</span>(self):
        <span class="kw">return</span> hash((self.x, self.y))

a, b = <span class="ty">Point</span>(<span class="num">1</span>,<span class="num">2</span>), <span class="ty">Point</span>(<span class="num">1</span>,<span class="num">2</span>)
print(a == b) <span class="cm"># True</span>`,
        cpp: `<span class="kw">class</span> <span class="ty">Point</span> {
<span class="kw">public</span>:
    <span class="kw">int</span> x, y;
    <span class="ty">Point</span>(<span class="kw">int</span> x, <span class="kw">int</span> y) : x(x), y(y) {}
    <span class="kw">bool</span> <span class="kw">operator</span>==(<span class="kw">const</span> <span class="ty">Point</span>& o) <span class="kw">const</span> {
        <span class="kw">return</span> x==o.x && y==o.y;
    }
};
<span class="ty">Point</span> a(<span class="num">1</span>,<span class="num">2</span>), b(<span class="num">1</span>,<span class="num">2</span>);
std::cout &lt;&lt; (a==b); <span class="cm">// 1 (true)</span>`,
        rust: `<span class="kw">#[derive(PartialEq)]</span>
<span class="kw">struct</span> <span class="ty">Point</span> { x: i32, y: i32 }

<span class="kw">let</span> a = <span class="ty">Point</span> { x:<span class="num">1</span>, y:<span class="num">2</span> };
<span class="kw">let</span> b = <span class="ty">Point</span> { x:<span class="num">1</span>, y:<span class="num">2</span> };
println!(<span class="str">"{}"</span>, a == b); <span class="cm">// true</span>
<span class="cm">// PartialEq dérive automatiquement la comparaison champ par champ</span>`,
      },
    },
  ],
  activities: [
    {
      id: 'a02_1', concept: 'c02_1', type: 'quiz', xp: 10,
      question: { fr: 'Sur quoi repose le choix de la méthode surchargée à l\'appel ?', en: 'What determines which overloaded method is called?' },
      choices: [
        { text: { fr: 'Le type de retour de la méthode.', en: 'The return type of the method.' }, correct: false, fb: { fr: 'Non. Le type de retour n\'est pas pris en compte pour la résolution de surcharge.', en: 'No. Return type is not considered for overload resolution.' } },
        { text: { fr: 'Le nombre et les types des arguments à l\'appel.', en: 'The number and types of arguments at the call site.' }, correct: true, fb: { fr: 'Correct ! Le compilateur choisit la signature qui correspond le mieux aux arguments fournis.', en: 'Correct! The compiler selects the signature that best matches the provided arguments.' } },
        { text: { fr: 'L\'ordre de déclaration des méthodes dans la classe.', en: 'The order of method declarations in the class.' }, correct: false, fb: { fr: 'Non.', en: 'No.' } },
        { text: { fr: 'Le nom de la variable qui appelle la méthode.', en: 'The name of the variable calling the method.' }, correct: false, fb: { fr: 'Non.', en: 'No.' } },
      ],
    },
    {
      id: 'a02_2', concept: 'c02_1', type: 'fill', xp: 15,
      instr: { fr: 'Complète la deuxième surcharge de print() qui accepte un entier :', en: 'Complete the second overload of print() that accepts an integer:' },
      template: { fr: 'void ______(int n) { System.out.println(n); }', en: 'void ______(int n) { System.out.println(n); }' },
      answer: 'print',
      hint: { fr: 'Même nom que la première méthode — c\'est le principe de surcharge.', en: 'Same name as the first method — that\'s the overloading principle.' },
    },
    {
      id: 'a02_3', concept: 'c02_2', type: 'predict', xp: 8,
      question: { fr: 'Sans redéfinir equals(), que retourne ce code Java ?', en: 'Without overriding equals(), what does this Java code return?' },
      code: `<span class="ty">Point</span> a = <span class="kw">new</span> <span class="ty">Point</span>(<span class="num">1</span>, <span class="num">2</span>);
<span class="ty">Point</span> b = <span class="kw">new</span> <span class="ty">Point</span>(<span class="num">1</span>, <span class="num">2</span>);
<span class="ty">System</span>.out.println(a.equals(b));`,
      explanation: { fr: 'false. Sans redéfinition, equals() compare les références — a et b pointent vers deux objets différents en mémoire, même si leurs contenus sont identiques. C\'est pourquoi il faut toujours redéfinir equals() pour les classes dont on veut comparer les contenus.', en: 'false. Without overriding, equals() compares references — a and b point to two different objects in memory, even if their contents are identical. That\'s why equals() must always be overridden for classes whose content you want to compare.' },
    },
    {
      id: 'a02_4', concept: 'c02_2', type: 'quiz', xp: 10,
      question: { fr: 'En Java, si on redéfinit equals(), que doit-on aussi redéfinir ?', en: 'In Java, if equals() is overridden, what else must be overridden?' },
      choices: [
        { text: { fr: 'toString()', en: 'toString()' }, correct: false, fb: { fr: 'toString() est souvent utile à redéfinir mais n\'est pas lié au contrat equals().', en: 'toString() is often useful to override but is not tied to the equals() contract.' } },
        { text: { fr: 'hashCode()', en: 'hashCode()' }, correct: true, fb: { fr: 'Correct ! Le contrat Java : si a.equals(b) est true, alors a.hashCode() == b.hashCode() doit être vrai. Sans cela, les HashMap et HashSet ne fonctionnent pas correctement.', en: 'Correct! The Java contract: if a.equals(b) is true, then a.hashCode() == b.hashCode() must also be true. Without this, HashMaps and HashSets break.' } },
        { text: { fr: 'compareTo()', en: 'compareTo()' }, correct: false, fb: { fr: 'compareTo() est pour l\'ordre naturel (Comparable), pas directement lié à equals().', en: 'compareTo() is for natural ordering (Comparable), not directly linked to equals().' } },
        { text: { fr: 'clone()', en: 'clone()' }, correct: false, fb: { fr: 'Non.', en: 'No.' } },
      ],
    },
    {
      id: 'a02_5', concept: 'c02_2', type: 'bug', xp: 20,
      instr: { fr: 'Cette redéfinition de equals() en Java est incomplète ou incorrecte. Trouve le problème.', en: 'This Java equals() override is incomplete or incorrect. Find the problem.' },
      bugCode: `<span class="kw">public boolean</span> <span class="fn">equals</span>(<span class="ty">Object</span> o) {
    <span class="ty">Point</span> p = (<span class="ty">Point</span>) <span class="bug-line">o</span>;
    <span class="kw">return</span> x == p.x && y == p.y;
}`,
      explanation: { fr: 'Il manque deux vérifications essentielles : <code>if (this == o) return true;</code> (optimisation pour le même objet) et <code>if (!(o instanceof Point)) return false;</code> (protection contre le cast invalide qui causerait une ClassCastException si o n\'est pas un Point).', en: 'Two essential checks are missing: <code>if (this == o) return true;</code> (optimisation for the same object) and <code>if (!(o instanceof Point)) return false;</code> (protection against an invalid cast that would throw a ClassCastException if o is not a Point).' },
    },
  ],
  homework: {
    fr: `<p>Dans ton dépôt GitHub, crée un dossier <strong>m02/</strong> contenant :</p>
<ol style="margin:.8rem 0 .8rem 2rem;font-size:1.45rem;color:var(--ch2);line-height:2">
  <li>Un <code>README.md</code> expliquant la différence entre <strong>surcharge</strong> (overloading) et <strong>redéfinition</strong> (overriding). Pourquoi les confond-on souvent ?</li>
  <li>Une classe <code>Calculatrice</code> avec 3 surcharges de la méthode <code>additionner()</code> : deux entiers, deux doubles, trois entiers.</li>
  <li>Une classe <code>Livre</code> avec titre et auteur, dont tu redéfinis <code>equals()</code> et <code>hashCode()</code> correctement.</li>
</ol>`,
    en: `<p>In your GitHub repository, create a folder <strong>m02/</strong> containing:</p>
<ol style="margin:.8rem 0 .8rem 2rem;font-size:1.45rem;color:var(--ch2);line-height:2">
  <li>A <code>README.md</code> explaining the difference between <strong>overloading</strong> and <strong>overriding</strong>. Why are they often confused?</li>
  <li>A <code>Calculator</code> class with 3 overloads of an <code>add()</code> method: two ints, two doubles, three ints.</li>
  <li>A <code>Book</code> class with title and author, with correctly overridden <code>equals()</code> and <code>hashCode()</code>.</li>
</ol>`,
  },



  references: [
    { title: { fr: 'W3Schools — Java Method Overloading', en: 'W3Schools — Java Method Overloading' }, url: 'https://www.w3schools.com/java/java_methods_overloading.asp', note: { fr: 'Surcharge de méthodes en Java', en: 'Method overloading in Java' } },
    { title: { fr: 'W3Schools — C# Method Overloading', en: 'W3Schools — C# Method Overloading' }, url: 'https://www.w3schools.com/cs/cs_method_overloading.php', note: { fr: 'Surcharge de méthodes en C#', en: 'Method overloading in C#' } },
    { title: { fr: 'Oracle — equals() and hashCode()', en: 'Oracle — equals() and hashCode()' }, url: 'https://docs.oracle.com/javase/8/docs/api/java/lang/Object.html#equals-java.lang.Object-', note: { fr: 'Contrat equals/hashCode dans l\'API Java', en: 'equals/hashCode contract in the Java API' } },
    { title: { fr: 'Oracle — Nested Classes', en: 'Oracle — Nested Classes' }, url: 'https://docs.oracle.com/javase/tutorial/java/javaOO/nested.html', note: { fr: 'Classes internes, statiques et anonymes', en: 'Inner, static and anonymous classes' } },
    { title: { fr: 'Microsoft Docs — Operator overloading (C#)', en: 'Microsoft Docs — Operator overloading (C#)' }, url: 'https://learn.microsoft.com/en-us/dotnet/csharp/language-reference/operators/operator-overloading', note: { fr: 'Surcharge d\'opérateurs en C#', en: 'Operator overloading in C#' } },
    { title: { fr: 'Python Docs — __eq__ and __hash__', en: 'Python Docs — __eq__ and __hash__' }, url: 'https://docs.python.org/3/reference/datamodel.html#object.__hash__', note: { fr: 'Protocole d\'égalité en Python', en: 'Python equality protocol' } },
    { title: { fr: 'Rust Book — Operator Overloading (traits)', en: 'Rust Book — Operator Overloading (traits)' }, url: 'https://doc.rust-lang.org/book/appendix-02-operators.html', note: { fr: 'PartialEq et opérateurs en Rust', en: 'PartialEq and operators in Rust' } },
  ],
};