'use strict';
const MODULE = {
  id: 'm08', num: '08', prev: 7, next: 9,
  title: { fr: 'Collections I', en: 'Collections I' },
  sub: { fr: 'List et Queue : créer, manipuler, itérer.', en: 'List and Queue: creating, manipulating, iterating.' },
  concepts: [
    {
      id: 'c08_1',
      title: { fr: '1 — List : ArrayList et LinkedList', en: '1 — List: ArrayList and LinkedList' },
      body: {
        fr: `<strong>List</strong> est une collection <em>ordonnée</em> qui autorise les doublons. Les deux implémentations principales en Java sont <code>ArrayList</code> (tableau dynamique — accès rapide par index, O(1)) et <code>LinkedList</code> (liste chaînée — insertion/suppression rapides en tête ou milieu, O(1), mais accès lent par index, O(n)). Pour la plupart des cas, <code>ArrayList</code> est le choix par défaut.`,
        en: `<strong>List</strong> is an <em>ordered</em> collection that allows duplicates. The two main implementations in Java are <code>ArrayList</code> (dynamic array — fast index access, O(1)) and <code>LinkedList</code> (linked list — fast insertion/removal at head or middle, O(1), but slow index access, O(n)). For most cases, <code>ArrayList</code> is the default choice.`,
      },
      code: {
        java: `<span class="kw">import</span> java.util.*;

<span class="ty">List</span>&lt;<span class="ty">String</span>&gt; names = <span class="kw">new</span> <span class="ty">ArrayList</span>&lt;&gt;();
names.add(<span class="str">"Alice"</span>);
names.add(<span class="str">"Bob"</span>);
names.add(<span class="str">"Carol"</span>);
names.add(<span class="num">1</span>, <span class="str">"Zara"</span>); <span class="cm">// insère à l'index 1</span>

<span class="ty">System</span>.out.println(names.get(<span class="num">0</span>));   <span class="cm">// Alice</span>
<span class="ty">System</span>.out.println(names.size());    <span class="cm">// 4</span>
<span class="ty">System</span>.out.println(names.contains(<span class="str">"Bob"</span>)); <span class="cm">// true</span>

names.remove(<span class="str">"Zara"</span>);               <span class="cm">// supprime par valeur</span>
names.remove(<span class="num">0</span>);                    <span class="cm">// supprime par index</span>

<span class="cm">// Itération</span>
<span class="kw">for</span> (<span class="ty">String</span> name : names) {
    <span class="ty">System</span>.out.println(name);
}
<span class="cm">// Collections.sort pour trier</span>
<span class="ty">Collections</span>.sort(names);`,
        cs: `<span class="kw">using</span> System.Collections.Generic;
<span class="kw">var</span> names = <span class="kw">new</span> <span class="ty">List</span>&lt;<span class="kw">string</span>&gt;();
names.Add(<span class="str">"Alice"</span>); names.Add(<span class="str">"Bob"</span>); names.Add(<span class="str">"Carol"</span>);
names.Insert(<span class="num">1</span>, <span class="str">"Zara"</span>);
<span class="ty">Console</span>.WriteLine(names[<span class="num">0</span>]);         <span class="cm">// Alice</span>
<span class="ty">Console</span>.WriteLine(names.Count);      <span class="cm">// 4</span>
names.Remove(<span class="str">"Zara"</span>);
names.RemoveAt(<span class="num">0</span>);
names.Sort();
<span class="kw">foreach</span> (<span class="kw">var</span> n <span class="kw">in</span> names) <span class="ty">Console</span>.WriteLine(n);`,
        py: `<span class="cm"># Python : list est la List par défaut</span>
names = [<span class="str">"Alice"</span>, <span class="str">"Bob"</span>, <span class="str">"Carol"</span>]
names.append(<span class="str">"Zara"</span>)
names.insert(<span class="num">1</span>, <span class="str">"Zara"</span>)        <span class="cm"># insère à l'index 1</span>
print(names[<span class="num">0</span>])                  <span class="cm"># Alice</span>
print(len(names))                 <span class="cm"># 5</span>
print(<span class="str">"Bob"</span> <span class="kw">in</span> names)            <span class="cm"># True</span>
names.remove(<span class="str">"Zara"</span>)             <span class="cm"># première occurrence</span>
names.pop(<span class="num">0</span>)                     <span class="cm"># supprime l'index 0</span>
names.sort()
<span class="kw">for</span> n <span class="kw">in</span> names: print(n)`,
        cpp: `<span class="kw">#include</span> &lt;vector&gt;
<span class="kw">#include</span> &lt;algorithm&gt;
std::vector&lt;std::<span class="ty">string</span>&gt; names = {<span class="str">"Alice"</span>, <span class="str">"Bob"</span>, <span class="str">"Carol"</span>};
names.push_back(<span class="str">"Zara"</span>);
names.insert(names.begin()+<span class="num">1</span>, <span class="str">"Zara"</span>);
std::cout &lt;&lt; names[<span class="num">0</span>] &lt;&lt; <span class="str">"\n"</span>;      <span class="cm">// Alice</span>
std::cout &lt;&lt; names.size() &lt;&lt; <span class="str">"\n"</span>; <span class="cm">// 5</span>
names.erase(names.begin());
std::sort(names.begin(), names.end());
<span class="kw">for</span> (<span class="kw">auto</span>&amp; n : names) std::cout &lt;&lt; n &lt;&lt; <span class="str">"\n"</span>;`,
        rust: `<span class="kw">let mut</span> names: Vec&lt;<span class="ty">String</span>&gt; = vec![
    <span class="str">"Alice"</span>.to_string(), <span class="str">"Bob"</span>.to_string(), <span class="str">"Carol"</span>.to_string()
];
names.push(<span class="str">"Zara"</span>.to_string());
names.insert(<span class="num">1</span>, <span class="str">"Zara"</span>.to_string());
println!(<span class="str">"{}"</span>, names[<span class="num">0</span>]);  <span class="cm">// Alice</span>
println!(<span class="str">"{}"</span>, names.len()); <span class="cm">// 5</span>
names.retain(|n| n != <span class="str">"Zara"</span>); <span class="cm">// supprime toutes les "Zara"</span>
names.sort();
<span class="kw">for</span> n <span class="kw">in</span> &amp;names { println!(<span class="str">"{}"</span>, n); }`,
      },
    },
    {
      id: 'c08_2',
      title: { fr: '2 — Queue : file d\'attente FIFO', en: '2 — Queue: FIFO queue' },
      body: {
        fr: `<strong>Queue</strong> (file d'attente) suit le principe <strong>FIFO</strong> : Premier Entré, Premier Sorti. On ajoute en queue (<code>offer</code>/<code>add</code>) et on retire en tête (<code>poll</code>/<code>remove</code>). En Java, <code>Queue</code> est une interface — <code>LinkedList</code> et <code>ArrayDeque</code> l'implémentent. Utilise <code>offer()</code> et <code>poll()</code> plutôt que <code>add()</code> et <code>remove()</code> — ils retournent null/false au lieu de lever une exception si la file est vide.`,
        en: `<strong>Queue</strong> follows the <strong>FIFO</strong> principle: First In, First Out. Elements are added at the tail (<code>offer</code>/<code>add</code>) and removed from the head (<code>poll</code>/<code>remove</code>). In Java, <code>Queue</code> is an interface — <code>LinkedList</code> and <code>ArrayDeque</code> implement it. Use <code>offer()</code> and <code>poll()</code> rather than <code>add()</code> and <code>remove()</code> — they return null/false instead of throwing an exception when the queue is empty.`,
      },
      code: {
        java: `<span class="kw">import</span> java.util.*;

<span class="ty">Queue</span>&lt;<span class="ty">String</span>&gt; queue = <span class="kw">new</span> <span class="ty">LinkedList</span>&lt;&gt;();
queue.offer(<span class="str">"Alice"</span>);  <span class="cm">// ajoute en queue</span>
queue.offer(<span class="str">"Bob"</span>);
queue.offer(<span class="str">"Carol"</span>);

<span class="ty">System</span>.out.println(queue.peek());  <span class="cm">// Alice (sans retirer)</span>
<span class="ty">System</span>.out.println(queue.poll());  <span class="cm">// Alice (retire)</span>
<span class="ty">System</span>.out.println(queue.poll());  <span class="cm">// Bob</span>
<span class="ty">System</span>.out.println(queue.size());  <span class="cm">// 1</span>

<span class="cm">// Vider la queue</span>
<span class="kw">while</span> (!queue.isEmpty()) {
    <span class="ty">System</span>.out.println(<span class="str">"Traitement : "</span> + queue.poll());
}`,
        cs: `<span class="kw">var</span> queue = <span class="kw">new</span> <span class="ty">Queue</span>&lt;<span class="kw">string</span>&gt;();
queue.Enqueue(<span class="str">"Alice"</span>);
queue.Enqueue(<span class="str">"Bob"</span>);
queue.Enqueue(<span class="str">"Carol"</span>);
<span class="ty">Console</span>.WriteLine(queue.Peek());    <span class="cm">// Alice</span>
<span class="ty">Console</span>.WriteLine(queue.Dequeue()); <span class="cm">// Alice</span>
<span class="kw">while</span> (queue.Count &gt; <span class="num">0</span>)
    <span class="ty">Console</span>.WriteLine(queue.Dequeue());`,
        py: `<span class="kw">from</span> collections <span class="kw">import</span> deque
queue = deque()
queue.append(<span class="str">"Alice"</span>)   <span class="cm"># enqueue</span>
queue.append(<span class="str">"Bob"</span>)
queue.append(<span class="str">"Carol"</span>)
print(queue[<span class="num">0</span>])         <span class="cm"># Alice (peek)</span>
print(queue.popleft())   <span class="cm"># Alice (dequeue)</span>
print(queue.popleft())   <span class="cm"># Bob</span>
<span class="kw">while</span> queue:
    print(<span class="str">"Traitement :"</span>, queue.popleft())`,
        cpp: `<span class="kw">#include</span> &lt;queue&gt;
std::queue&lt;std::<span class="ty">string</span>&gt; q;
q.push(<span class="str">"Alice"</span>);
q.push(<span class="str">"Bob"</span>);
q.push(<span class="str">"Carol"</span>);
std::cout &lt;&lt; q.front() &lt;&lt; <span class="str">"\n"</span>; <span class="cm">// Alice</span>
q.pop();                          <span class="cm">// retire Alice</span>
<span class="kw">while</span> (!q.empty()) {
    std::cout &lt;&lt; q.front() &lt;&lt; <span class="str">"\n"</span>;
    q.pop();
}`,
        rust: `<span class="kw">use</span> std::collections::VecDeque;
<span class="kw">let mut</span> queue: VecDeque&lt;<span class="ty">String</span>&gt; = VecDeque::new();
queue.push_back(<span class="str">"Alice"</span>.to_string());
queue.push_back(<span class="str">"Bob"</span>.to_string());
queue.push_back(<span class="str">"Carol"</span>.to_string());
println!(<span class="str">"{:?}"</span>, queue.front()); <span class="cm">// Some("Alice")</span>
queue.pop_front();               <span class="cm">// retire Alice</span>
<span class="kw">while let</span> Some(name) = queue.pop_front() {
    println!(<span class="str">"Traitement : {}"</span>, name);
}`,
      },
    },
  ],
  activities: [
    {
      id: 'a08_1', concept: 'c08_1', type: 'quiz', xp: 10,
      question: { fr: 'Quelle est la complexité d\'accès par index à un élément d\'un ArrayList vs un LinkedList ?', en: 'What is the index access complexity for ArrayList vs LinkedList?' },
      choices: [
        { text: { fr: 'ArrayList O(1), LinkedList O(1)', en: 'ArrayList O(1), LinkedList O(1)' }, correct: false, fb: { fr: 'Non. LinkedList doit parcourir la chaîne depuis le début.', en: 'No. LinkedList must traverse the chain from the beginning.' } },
        { text: { fr: 'ArrayList O(n), LinkedList O(1)', en: 'ArrayList O(n), LinkedList O(1)' }, correct: false, fb: { fr: 'C\'est l\'inverse. ArrayList accède directement par calcul d\'adresse.', en: 'It\'s the opposite. ArrayList accesses directly by address calculation.' } },
        { text: { fr: 'ArrayList O(1), LinkedList O(n)', en: 'ArrayList O(1), LinkedList O(n)' }, correct: true, fb: { fr: 'Correct ! ArrayList calcule l\'adresse mémoire directement (base + index * taille). LinkedList doit parcourir les noeuds un par un.', en: 'Correct! ArrayList calculates the memory address directly (base + index * size). LinkedList must traverse nodes one by one.' } },
        { text: { fr: 'Les deux O(n)', en: 'Both O(n)' }, correct: false, fb: { fr: 'Non.', en: 'No.' } },
      ],
    },
    {
      id: 'a08_2', concept: 'c08_1', type: 'fill', xp: 15,
      instr: { fr: 'Pour trier une List en Java, on appelle :', en: 'To sort a List in Java, you call:' },
      template: { fr: 'Collections.______(myList);', en: 'Collections.______(myList);' },
      answer: 'sort',
      hint: { fr: 'Méthode statique de la classe Collections (avec s).', en: 'Static method of the Collections class (with s).' },
    },
    {
      id: 'a08_3', concept: 'c08_2', type: 'predict', xp: 8,
      question: { fr: 'Qu\'affiche ce code Java ?', en: 'What does this Java code print?' },
      code: `<span class="ty">Queue</span>&lt;<span class="ty">Integer</span>&gt; q = <span class="kw">new</span> <span class="ty">LinkedList</span>&lt;&gt;();
q.offer(<span class="num">10</span>); q.offer(<span class="num">20</span>); q.offer(<span class="num">30</span>);
q.poll();
q.offer(<span class="num">40</span>);
<span class="kw">while</span> (!q.isEmpty()) {
    <span class="ty">System</span>.out.print(q.poll() + <span class="str">" "</span>);
}`,
      explanation: { fr: 'Affiche : 20 30 40. Après offer(10,20,30) : [10,20,30]. poll() retire 10 : [20,30]. offer(40) : [20,30,40]. Le while retire et affiche dans l\'ordre FIFO : 20, 30, 40.', en: 'Prints: 20 30 40. After offer(10,20,30): [10,20,30]. poll() removes 10: [20,30]. offer(40): [20,30,40]. The while removes and prints in FIFO order: 20, 30, 40.' },
    },
    {
      id: 'a08_4', concept: 'c08_2', type: 'quiz', xp: 10,
      question: { fr: 'Quelle méthode de Queue retourne l\'élément de tête SANS le retirer ?', en: 'Which Queue method returns the head element WITHOUT removing it?' },
      choices: [
        { text: { fr: 'poll()', en: 'poll()' }, correct: false, fb: { fr: 'poll() retire et retourne la tête.', en: 'poll() removes and returns the head.' } },
        { text: { fr: 'peek()', en: 'peek()' }, correct: true, fb: { fr: 'Correct ! peek() regarde la tête sans modifier la queue. Retourne null si vide.', en: 'Correct! peek() looks at the head without modifying the queue. Returns null if empty.' } },
        { text: { fr: 'get(0)', en: 'get(0)' }, correct: false, fb: { fr: 'get() n\'est pas une méthode de l\'interface Queue.', en: 'get() is not a method of the Queue interface.' } },
        { text: { fr: 'first()', en: 'first()' }, correct: false, fb: { fr: 'first() n\'existe pas dans Queue. C\'est element() qui est l\'alternative à peek() (mais lève une exception si vide).', en: 'first() doesn\'t exist in Queue. element() is the alternative to peek() (but throws an exception if empty).' } },
      ],
    },
  ],
  homework: {
    fr: `<p>Dans ton dépôt GitHub, crée un dossier <strong>m08/</strong> contenant :</p>
<ol style="margin:.8rem 0 .8rem 2rem;font-size:1.45rem;color:var(--ch2);line-height:2">
  <li>Un <code>README.md</code> : dans quels cas utiliserais-tu un <code>LinkedList</code> plutôt qu'un <code>ArrayList</code> ?</li>
  <li>Un programme de simulation d'une file d'attente (ex: caisse de supermarché). Clients ajoutés en queue, traités en FIFO, avec un temps de traitement simulé (compteur). Afficher le temps d'attente de chaque client.</li>
  <li>Une <code>List</code> des 5 clients les plus rapides (temps d'attente le plus court), triée.</li>
</ol>`,
    en: `<p>In your GitHub repository, create a folder <strong>m08/</strong> containing:</p>
<ol style="margin:.8rem 0 .8rem 2rem;font-size:1.45rem;color:var(--ch2);line-height:2">
  <li>A <code>README.md</code>: when would you use a <code>LinkedList</code> instead of an <code>ArrayList</code>?</li>
  <li>A queue simulation program (e.g. supermarket checkout). Customers added to the queue, processed FIFO, with a simulated processing time (counter). Print each customer's wait time.</li>
  <li>A <code>List</code> of the 5 fastest customers (shortest wait time), sorted.</li>
</ol>`,
  },



  references: [
    { title: { fr: 'W3Schools — Java ArrayList', en: 'W3Schools — Java ArrayList' }, url: 'https://www.w3schools.com/java/java_arraylist.asp', note: { fr: 'Créer, ajouter, supprimer et itérer', en: 'Creating, adding, removing and iterating' } },
    { title: { fr: 'W3Schools — Java LinkedList', en: 'W3Schools — Java LinkedList' }, url: 'https://www.w3schools.com/java/java_linkedlist.asp', note: { fr: 'LinkedList comme List et Queue', en: 'LinkedList as both List and Queue' } },
    { title: { fr: 'W3Schools — C# List', en: 'W3Schools — C# List' }, url: 'https://www.w3schools.com/cs/cs_list.php', note: { fr: 'List<T> en C#', en: 'List<T> in C#' } },
    { title: { fr: 'W3Schools — Python Lists', en: 'W3Schools — Python Lists' }, url: 'https://www.w3schools.com/python/python_lists.asp', note: { fr: 'Listes Python complètes', en: 'Complete Python lists' } },
    { title: { fr: 'Oracle — List Interface', en: 'Oracle — List Interface' }, url: 'https://docs.oracle.com/javase/8/docs/api/java/util/List.html', note: { fr: 'API List Java officielle', en: 'Official Java List API' } },
    { title: { fr: 'Oracle — Queue Interface', en: 'Oracle — Queue Interface' }, url: 'https://docs.oracle.com/javase/8/docs/api/java/util/Queue.html', note: { fr: 'API Queue Java officielle', en: 'Official Java Queue API' } },
    { title: { fr: 'Microsoft Docs — List<T>', en: 'Microsoft Docs — List<T>' }, url: 'https://learn.microsoft.com/en-us/dotnet/api/system.collections.generic.list-1', note: { fr: 'Documentation officielle List C#', en: 'Official C# List documentation' } },
    { title: { fr: 'Python Docs — collections.deque', en: 'Python Docs — collections.deque' }, url: 'https://docs.python.org/3/library/collections.html#collections.deque', note: { fr: 'Deque Python pour les files FIFO', en: 'Python deque for FIFO queues' } },
    { title: { fr: 'Rust Docs — Vec', en: 'Rust Docs — Vec' }, url: 'https://doc.rust-lang.org/std/vec/struct.Vec.html', note: { fr: 'Vecteur dynamique Rust (équivalent ArrayList)', en: 'Rust dynamic vector (ArrayList equivalent)' } },
    { title: { fr: 'Rust Docs — VecDeque', en: 'Rust Docs — VecDeque' }, url: 'https://doc.rust-lang.org/std/collections/struct.VecDeque.html', note: { fr: 'Deque Rust pour les files FIFO', en: 'Rust VecDeque for FIFO queues' } },
  ],
};