'use strict';
const MODULE = {
  id: 'm11', num: '11', prev: 10, next: 12,
  title: { fr: 'Maps II', en: 'Maps II' },
  sub: { fr: 'LinkedHashMap, choisir la bonne Map, patterns courants.', en: 'LinkedHashMap, choosing the right Map, common patterns.' },
  concepts: [
    {
      id: 'c11_1',
      title: { fr: '1 — LinkedHashMap : ordre d\'insertion garanti', en: '1 — LinkedHashMap: guaranteed insertion order' },
      body: {
        fr: `<code>LinkedHashMap</code> combine les performances de <code>HashMap</code> (O(1)) avec la garantie de l\'ordre d\'insertion. Les entrées sont itérées dans l\'ordre où elles ont été ajoutées. C\'est utile pour implémenter des caches LRU (Least Recently Used), des historiques, ou simplement quand l\'affichage doit refléter l\'ordre de saisie.`,
        en: `<code>LinkedHashMap</code> combines <code>HashMap</code> performance (O(1)) with guaranteed insertion order. Entries are iterated in the order they were added. It\'s useful for implementing LRU (Least Recently Used) caches, histories, or simply when display must reflect input order.`,
      },
      code: {
        java: `<span class="kw">import</span> java.util.*;

<span class="cm">// HashMap : ordre imprévisible</span>
<span class="ty">Map</span>&lt;<span class="ty">String</span>, <span class="ty">Integer</span>&gt; hash = <span class="kw">new</span> <span class="ty">HashMap</span>&lt;&gt;();
hash.put(<span class="str">"banana"</span>, <span class="num">3</span>); hash.put(<span class="str">"apple"</span>, <span class="num">1</span>); hash.put(<span class="str">"cherry"</span>, <span class="num">5</span>);
<span class="ty">System</span>.out.println(hash); <span class="cm">// ordre variable</span>

<span class="cm">// LinkedHashMap : ordre d'insertion conservé</span>
<span class="ty">Map</span>&lt;<span class="ty">String</span>, <span class="ty">Integer</span>&gt; linked = <span class="kw">new</span> <span class="ty">LinkedHashMap</span>&lt;&gt;();
linked.put(<span class="str">"banana"</span>, <span class="num">3</span>); linked.put(<span class="str">"apple"</span>, <span class="num">1</span>); linked.put(<span class="str">"cherry"</span>, <span class="num">5</span>);
<span class="ty">System</span>.out.println(linked);
<span class="cm">// {banana=3, apple=1, cherry=5} — toujours dans cet ordre</span>

<span class="cm">// Cache LRU simple avec LinkedHashMap</span>
<span class="ty">Map</span>&lt;<span class="ty">String</span>, <span class="ty">String</span>&gt; lruCache =
    <span class="kw">new</span> <span class="ty">LinkedHashMap</span>&lt;&gt;(<span class="num">16</span>, <span class="num">0.75f</span>, <span class="kw">true</span>) { <span class="cm">// accessOrder=true</span>
        @<span class="ty">Override</span>
        <span class="kw">protected boolean</span> <span class="fn">removeEldestEntry</span>(<span class="ty">Map</span>.<span class="ty">Entry</span> e) {
            <span class="kw">return</span> size() &gt; <span class="num">3</span>; <span class="cm">// max 3 entrées</span>
        }
    };`,
        cs: `<span class="cm">// C# n'a pas de LinkedHashMap natif.</span>
<span class="cm">// On utilise Dictionary (préserve l'ordre en .NET 5+)</span>
<span class="cm">// ou OrderedDictionary pour garantie explicite.</span>
<span class="kw">var</span> linked = <span class="kw">new</span> System.Collections.Specialized.OrderedDictionary();
linked[<span class="str">"banana"</span>] = <span class="num">3</span>;
linked[<span class="str">"apple"</span>]  = <span class="num">1</span>;
linked[<span class="str">"cherry"</span>] = <span class="num">5</span>;
<span class="kw">foreach</span> (<span class="ty">DictionaryEntry</span> e <span class="kw">in</span> linked)
    <span class="ty">Console</span>.WriteLine(<span class="str">$"{e.Key}: {e.Value}"</span>);
<span class="cm">// banana: 3 / apple: 1 / cherry: 5</span>`,
        py: `<span class="cm"># Python 3.7+ : dict ordinaire conserve l'ordre d'insertion</span>
linked = {}
linked[<span class="str">"banana"</span>] = <span class="num">3</span>
linked[<span class="str">"apple"</span>]  = <span class="num">1</span>
linked[<span class="str">"cherry"</span>] = <span class="num">5</span>
print(list(linked.keys()))
<span class="cm"># ['banana', 'apple', 'cherry']</span>

<span class="cm"># Pour compatibilité < 3.7 ou explicite :</span>
<span class="kw">from</span> collections <span class="kw">import</span> OrderedDict
ordered = OrderedDict()
ordered[<span class="str">"banana"</span>] = <span class="num">3</span>
ordered.move_to_end(<span class="str">"banana"</span>)  <span class="cm"># déplacer en fin</span>`,
        cpp: `<span class="cm">// C++ n'a pas de LinkedHashMap natif.</span>
<span class="cm">// On peut combiner unordered_map + list pour simuler :</span>
<span class="kw">#include</span> &lt;list&gt;
<span class="kw">#include</span> &lt;unordered_map&gt;

<span class="cm">// Liste pour l'ordre, map pour l'accès rapide</span>
std::list&lt;std::pair&lt;std::<span class="ty">string</span>, <span class="kw">int</span>&gt;&gt; order;
std::unordered_map&lt;std::<span class="ty">string</span>,
    decltype(order)::iterator&gt; index;

<span class="kw">auto</span> <span class="fn">insert</span> = [&amp;](std::<span class="ty">string</span> k, <span class="kw">int</span> v) {
    order.push_back({k, v});
    index[k] = std::prev(order.end());
};`,
        rust: `<span class="cm">// Rust : IndexMap (crate externe) = LinkedHashMap</span>
<span class="cm">// Sans crate, on peut combiner Vec + HashMap</span>
<span class="kw">use</span> std::collections::HashMap;

<span class="kw">let mut</span> order: Vec&lt;<span class="ty">String</span>&gt; = Vec::new();
<span class="kw">let mut</span> map: HashMap&lt;<span class="ty">String</span>, i32&gt; = HashMap::new();

<span class="kw">for</span> (k, v) <span class="kw">in</span> [(<span class="str">"banana"</span>, <span class="num">3</span>), (<span class="str">"apple"</span>, <span class="num">1</span>), (<span class="str">"cherry"</span>, <span class="num">5</span>)] {
    <span class="kw">if</span> map.insert(k.to_string(), v).is_none() {
        order.push(k.to_string());
    }
}
<span class="kw">for</span> k <span class="kw">in</span> &amp;order { println!(<span class="str">"{}: {}"</span>, k, map[k]); }`,
      },
    },
    {
      id: 'c11_2',
      title: { fr: '2 — Choisir la bonne Map', en: '2 — Choosing the right Map' },
      body: {
        fr: `Le choix dépend de trois questions : as-tu besoin d'<strong>ordre</strong> ? De quel type ? Les trois principales options Java : <code>HashMap</code> si l\'ordre est sans importance et la vitesse prime, <code>TreeMap</code> si tu as besoin de clés triées (ordre naturel ou personnalisé), <code>LinkedHashMap</code> si tu as besoin de conserver l\'ordre d\'insertion ou d\'accès.`,
        en: `The choice depends on three questions: do you need <strong>order</strong>? Of what type? The three main Java options: <code>HashMap</code> if order doesn\'t matter and speed is key, <code>TreeMap</code> if you need sorted keys (natural or custom order), <code>LinkedHashMap</code> if you need to preserve insertion or access order.`,
      },
      code: {
        java: `<span class="cm">┌──────────────────┬──────────────┬───────────────┬──────────────────┐</span>
<span class="cm">│                  │   HashMap    │   TreeMap     │  LinkedHashMap   │</span>
<span class="cm">├──────────────────┼──────────────┼───────────────┼──────────────────┤</span>
<span class="cm">│ Ordre            │ Aucun        │ Clés triées   │ Insertion/accès  │</span>
<span class="cm">│ get/put          │ O(1)         │ O(log n)      │ O(1)             │</span>
<span class="cm">│ Null key         │ 1 autorisée  │ ✗             │ 1 autorisée      │</span>
<span class="cm">│ Navigation       │ ✗            │ first/last/sub│ ✗                │</span>
<span class="cm">└──────────────────┴──────────────┴───────────────┴──────────────────┘</span>

<span class="cm">// Patterns courants :</span>

<span class="cm">// 1. Grouper des éléments par catégorie</span>
<span class="ty">Map</span>&lt;<span class="ty">String</span>, <span class="ty">List</span>&lt;<span class="ty">String</span>&gt;&gt; byDept = <span class="kw">new</span> <span class="ty">HashMap</span>&lt;&gt;();
byDept.computeIfAbsent(<span class="str">"IT"</span>, k -> <span class="kw">new</span> <span class="ty">ArrayList</span>&lt;&gt;()).add(<span class="str">"Alice"</span>);
byDept.computeIfAbsent(<span class="str">"IT"</span>, k -> <span class="kw">new</span> <span class="ty">ArrayList</span>&lt;&gt;()).add(<span class="str">"Bob"</span>);

<span class="cm">// 2. Compter les occurrences</span>
<span class="ty">Map</span>&lt;<span class="ty">String</span>, <span class="ty">Long</span>&gt; freq = <span class="kw">new</span> <span class="ty">HashMap</span>&lt;&gt;();
freq.merge(<span class="str">"apple"</span>, <span class="num">1L</span>, <span class="ty">Long</span>::sum);
freq.merge(<span class="str">"apple"</span>, <span class="num">1L</span>, <span class="ty">Long</span>::sum);
<span class="ty">System</span>.out.println(freq.get(<span class="str">"apple"</span>)); <span class="cm">// 2</span>`,
        cs: `<span class="cm">// C# équivalents :</span>
<span class="cm">// HashMap        → Dictionary&lt;K,V&gt;</span>
<span class="cm">// TreeMap        → SortedDictionary&lt;K,V&gt;</span>
<span class="cm">// LinkedHashMap  → Dictionary&lt;K,V&gt; en .NET 5+</span>
<span class="cm">//                 (ordre d'insertion préservé de facto)</span>

<span class="cm">// Grouper par département</span>
<span class="kw">var</span> byDept = <span class="kw">new</span> <span class="ty">Dictionary</span>&lt;<span class="kw">string</span>, <span class="ty">List</span>&lt;<span class="kw">string</span>&gt;&gt;();
<span class="kw">if</span> (!byDept.ContainsKey(<span class="str">"IT"</span>))
    byDept[<span class="str">"IT"</span>] = <span class="kw">new</span> <span class="ty">List</span>&lt;<span class="kw">string</span>&gt;();
byDept[<span class="str">"IT"</span>].Add(<span class="str">"Alice"</span>);`,
        py: `<span class="cm"># Python : defaultdict simplifie le groupement</span>
<span class="kw">from</span> collections <span class="kw">import</span> defaultdict, Counter

<span class="cm"># Grouper</span>
by_dept = defaultdict(list)
by_dept[<span class="str">"IT"</span>].append(<span class="str">"Alice"</span>)
by_dept[<span class="str">"IT"</span>].append(<span class="str">"Bob"</span>)

<span class="cm"># Compter avec Counter (équivalent de merge/getOrDefault)</span>
words = [<span class="str">"apple"</span>, <span class="str">"banana"</span>, <span class="str">"apple"</span>, <span class="str">"cherry"</span>]
freq = Counter(words)
print(freq.most_common(<span class="num">2</span>))
<span class="cm"># [('apple', 2), ('banana', 1)]</span>`,
        cpp: `<span class="cm">// std::map     → TreeMap (trié)</span>
<span class="cm">// std::unordered_map → HashMap</span>

<span class="cm">// Grouper par catégorie</span>
std::map&lt;std::<span class="ty">string</span>, std::vector&lt;std::<span class="ty">string</span>&gt;&gt; byDept;
byDept[<span class="str">"IT"</span>].push_back(<span class="str">"Alice"</span>);
byDept[<span class="str">"IT"</span>].push_back(<span class="str">"Bob"</span>);

<span class="cm">// Compter avec unordered_map</span>
std::unordered_map&lt;std::<span class="ty">string</span>, <span class="kw">int</span>&gt; freq;
<span class="kw">for</span> (<span class="kw">auto</span>&amp; w : std::vector&lt;std::<span class="ty">string</span>&gt;{<span class="str">"a"</span>,<span class="str">"b"</span>,<span class="str">"a"</span>})
    freq[w]++;`,
        rust: `<span class="cm">// Résumé Rust Maps :</span>
<span class="cm">// HashMap  → non ordonné O(1)</span>
<span class="cm">// BTreeMap → trié O(log n)</span>

<span class="kw">use</span> std::collections::HashMap;

<span class="cm">// Grouper</span>
<span class="kw">let mut</span> by_dept: HashMap&lt;&amp;<span class="kw">str</span>, Vec&lt;&amp;<span class="kw">str</span>&gt;&gt; = HashMap::new();
by_dept.entry(<span class="str">"IT"</span>).or_default().push(<span class="str">"Alice"</span>);
by_dept.entry(<span class="str">"IT"</span>).or_default().push(<span class="str">"Bob"</span>);

<span class="cm">// Compter</span>
<span class="kw">let mut</span> freq: HashMap&lt;&amp;<span class="kw">str</span>, u32&gt; = HashMap::new();
*freq.entry(<span class="str">"apple"</span>).or_insert(<span class="num">0</span>) += <span class="num">1</span>;`,
      },
    },
  ],
  activities: [
    {
      id: 'a11_1', concept: 'c11_1', type: 'quiz', xp: 10,
      question: { fr: 'Quelle Map Java garantit que les entrées sont itérées dans l\'ordre d\'insertion ?', en: 'Which Java Map guarantees entries are iterated in insertion order?' },
      choices: [
        { text: { fr: 'HashMap', en: 'HashMap' }, correct: false, fb: { fr: 'Non. HashMap ne garantit aucun ordre.', en: 'No. HashMap guarantees no order.' } },
        { text: { fr: 'TreeMap', en: 'TreeMap' }, correct: false, fb: { fr: 'Non. TreeMap trie par ordre des clés, pas par ordre d\'insertion.', en: 'No. TreeMap sorts by key order, not insertion order.' } },
        { text: { fr: 'LinkedHashMap', en: 'LinkedHashMap' }, correct: true, fb: { fr: 'Correct ! LinkedHashMap maintient une liste chaînée des entrées dans l\'ordre d\'insertion (ou d\'accès si accessOrder=true).', en: 'Correct! LinkedHashMap maintains a linked list of entries in insertion order (or access order if accessOrder=true).' } },
        { text: { fr: 'SortedMap', en: 'SortedMap' }, correct: false, fb: { fr: 'SortedMap est une interface — TreeMap en est l\'implémentation, qui trie par clé.', en: 'SortedMap is an interface — TreeMap is its implementation, which sorts by key.' } },
      ],
    },
    {
      id: 'a11_2', concept: 'c11_2', type: 'fill', xp: 15,
      instr: { fr: 'Pour grouper des éléments dans une Map en Java sans vérifier manuellement si la clé existe, on utilise :', en: 'To group elements in a Java Map without manually checking if the key exists, you use:' },
      template: { fr: 'map.______(key, k -> new ArrayList<>()).add(value);', en: 'map.______(key, k -> new ArrayList<>()).add(value);' },
      answer: 'computeIfAbsent',
      hint: { fr: 'Cette méthode crée la valeur seulement si la clé est absente, puis retourne la valeur (nouvelle ou existante).', en: 'This method creates the value only if the key is absent, then returns the value (new or existing).' },
    },
    {
      id: 'a11_3', concept: 'c11_2', type: 'predict', xp: 8,
      question: { fr: 'Que contient byDept après ce code ?', en: 'What does byDept contain after this code?' },
      code: `<span class="ty">Map</span>&lt;<span class="ty">String</span>, <span class="ty">List</span>&lt;<span class="ty">String</span>&gt;&gt; byDept = <span class="kw">new</span> <span class="ty">HashMap</span>&lt;&gt;();
<span class="ty">String</span>[][] data = {
    {<span class="str">"Alice"</span>, <span class="str">"IT"</span>}, {<span class="str">"Bob"</span>, <span class="str">"RH"</span>},
    {<span class="str">"Carol"</span>, <span class="str">"IT"</span>}, {<span class="str">"Zara"</span>, <span class="str">"RH"</span>}
};
<span class="kw">for</span> (<span class="ty">String</span>[] row : data) {
    byDept.computeIfAbsent(row[<span class="num">1</span>], k -> <span class="kw">new</span> <span class="ty">ArrayList</span>&lt;&gt;())
          .add(row[<span class="num">0</span>]);
}`,
      explanation: { fr: '{"IT": ["Alice", "Carol"], "RH": ["Bob", "Zara"]}. computeIfAbsent crée la liste si la clé est absente, puis add() l\'alimente. Après le loop, IT a deux membres et RH deux membres.', en: '{"IT": ["Alice", "Carol"], "RH": ["Bob", "Zara"]}. computeIfAbsent creates the list if the key is absent, then add() populates it. After the loop, IT has two members and RH has two members.' },
    },
    {
      id: 'a11_4', concept: 'c11_1', type: 'bug', xp: 20,
      instr: { fr: 'Ce code tente d\'implémenter un historique de navigation avec LinkedHashMap, mais le comportement n\'est pas celui voulu. Trouve le problème.', en: 'This code tries to implement a browsing history with LinkedHashMap, but the behaviour isn\'t what\'s intended. Find the problem.' },
      bugCode: `<span class="ty">Map</span>&lt;<span class="ty">String</span>, <span class="ty">Integer</span>&gt; history =
    <span class="kw">new</span> <span class="bug-line"><span class="ty">HashMap</span></span>&lt;&gt;();
history.put(<span class="str">"page1"</span>, <span class="num">1</span>);
history.put(<span class="str">"page2"</span>, <span class="num">2</span>);
history.put(<span class="str">"page3"</span>, <span class="num">3</span>);
<span class="cm">// Vouloir afficher dans l'ordre de visite</span>
history.forEach((k, v) ->
    <span class="ty">System</span>.out.println(v + <span class="str">": "</span> + k));`,
      explanation: { fr: 'La déclaration utilise HashMap, qui ne garantit pas l\'ordre d\'insertion. Pour un historique de navigation dans l\'ordre de visite, il faut <code>LinkedHashMap</code>. Le changement : <code>new LinkedHashMap&lt;&gt;()</code>.', en: 'The declaration uses HashMap, which doesn\'t guarantee insertion order. For a browsing history in visit order, <code>LinkedHashMap</code> is needed. The fix: <code>new LinkedHashMap&lt;&gt;()</code>.' },
    },
  ],
  homework: {
    fr: `<p>Dans ton dépôt GitHub, crée un dossier <strong>m11/</strong> contenant :</p>
<ol style="margin:.8rem 0 .8rem 2rem;font-size:1.45rem;color:var(--ch2);line-height:2">
  <li>Un <code>README.md</code> — remplis le tableau HashMap / TreeMap / LinkedHashMap avec tes propres exemples de cas d'usage (pas comptage de mots / historique).</li>
  <li>Un programme "carnet de contacts" : stocke nom → numéro dans une <code>LinkedHashMap</code>, permet d'ajouter, de rechercher par nom, et d'afficher tous les contacts dans l'ordre d'ajout.</li>
  <li>Le même carnet affiché trié alphabétiquement par nom (utilise <code>TreeMap</code> ou un tri explicite).</li>
</ol>`,
    en: `<p>In your GitHub repository, create a folder <strong>m11/</strong> containing:</p>
<ol style="margin:.8rem 0 .8rem 2rem;font-size:1.45rem;color:var(--ch2);line-height:2">
  <li>A <code>README.md</code> — fill in the HashMap / TreeMap / LinkedHashMap table with your own use-case examples (not word counting / browsing history).</li>
  <li>An "address book" program: stores name → number in a <code>LinkedHashMap</code>, allows adding, searching by name, and displaying all contacts in addition order.</li>
  <li>The same address book displayed sorted alphabetically by name (use <code>TreeMap</code> or explicit sorting).</li>
</ol>`,
  },



  references: [
    { title: { fr: 'W3Schools — Java LinkedList (as Map equiv.)', en: 'W3Schools — Java LinkedList (as Map equiv.)' }, url: 'https://www.w3schools.com/java/java_linkedlist.asp', note: { fr: 'LinkedList et ordre d\'insertion', en: 'LinkedList and insertion order' } },
    { title: { fr: 'W3Schools — C# SortedDictionary', en: 'W3Schools — C# SortedDictionary' }, url: 'https://www.w3schools.com/cs/cs_sorteddictionary.php', note: { fr: 'SortedDictionary<K,V> en C#', en: 'SortedDictionary<K,V> in C#' } },
    { title: { fr: 'W3Schools — Python OrderedDict', en: 'W3Schools — Python OrderedDict' }, url: 'https://www.w3schools.com/python/python_dictionaries.asp', note: { fr: 'Dicts et ordre d\'insertion en Python', en: 'Dicts and insertion order in Python' } },
    { title: { fr: 'Oracle — LinkedHashMap', en: 'Oracle — LinkedHashMap' }, url: 'https://docs.oracle.com/javase/8/docs/api/java/util/LinkedHashMap.html', note: { fr: 'API LinkedHashMap Java officielle', en: 'Official Java LinkedHashMap API' } },
    { title: { fr: 'Oracle — Map Implementations', en: 'Oracle — Map Implementations' }, url: 'https://docs.oracle.com/javase/tutorial/collections/implementations/map.html', note: { fr: 'Comparaison des trois implémentations', en: 'Comparison of the three implementations' } },
    { title: { fr: 'Microsoft Docs — SortedDictionary<TK,TV>', en: 'Microsoft Docs — SortedDictionary<TK,TV>' }, url: 'https://learn.microsoft.com/en-us/dotnet/api/system.collections.generic.sorteddictionary-2', note: { fr: 'Documentation officielle C#', en: 'Official C# documentation' } },
    { title: { fr: 'Python Docs — collections.OrderedDict', en: 'Python Docs — collections.OrderedDict' }, url: 'https://docs.python.org/3/library/collections.html#collections.OrderedDict', note: { fr: 'OrderedDict Python', en: 'Python OrderedDict' } },
    { title: { fr: 'Rust Docs — BTreeMap', en: 'Rust Docs — BTreeMap' }, url: 'https://doc.rust-lang.org/std/collections/struct.BTreeMap.html', note: { fr: 'BTreeMap Rust (ordonné par clé)', en: 'Rust BTreeMap (key-ordered)' } },
  ],
};