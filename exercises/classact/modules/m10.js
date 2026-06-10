'use strict';
const MODULE = {
  id: 'm10', num: '10', prev: 9, next: 11,
  title: { fr: 'Maps I', en: 'Maps I' },
  sub: { fr: 'HashMap et TreeMap : paires clé-valeur.', en: 'HashMap and TreeMap: key-value pairs.' },
  concepts: [
    {
      id: 'c10_1',
      title: { fr: '1 — HashMap : accès O(1) par clé', en: '1 — HashMap: O(1) key access' },
      body: {
        fr: `Une <strong>Map</strong> associe des <em>clés</em> à des <em>valeurs</em>. Chaque clé est unique ; une valeur peut être dupliquée. <code>HashMap</code> utilise une table de hachage : accès, insertion et suppression sont en O(1) en moyenne. L'ordre d'itération n'est pas garanti. Comme pour <code>HashSet</code>, les clés doivent avoir <code>equals()</code> et <code>hashCode()</code> correctement implémentés.`,
        en: `A <strong>Map</strong> associates <em>keys</em> with <em>values</em>. Each key is unique; a value can be duplicated. <code>HashMap</code> uses a hash table: access, insertion and removal are O(1) on average. Iteration order is not guaranteed. As with <code>HashSet</code>, keys must have <code>equals()</code> and <code>hashCode()</code> correctly implemented.`,
      },
      code: {
        java: `<span class="kw">import</span> java.util.*;

<span class="ty">Map</span>&lt;<span class="ty">String</span>, <span class="ty">Integer</span>&gt; scores = <span class="kw">new</span> <span class="ty">HashMap</span>&lt;&gt;();
scores.put(<span class="str">"Alice"</span>, <span class="num">95</span>);
scores.put(<span class="str">"Bob"</span>,   <span class="num">87</span>);
scores.put(<span class="str">"Carol"</span>, <span class="num">92</span>);
scores.put(<span class="str">"Alice"</span>, <span class="num">98</span>); <span class="cm">// remplace 95</span>

<span class="ty">System</span>.out.println(scores.get(<span class="str">"Alice"</span>));       <span class="cm">// 98</span>
<span class="ty">System</span>.out.println(scores.getOrDefault(<span class="str">"Zara"</span>, <span class="num">0</span>)); <span class="cm">// 0</span>
<span class="ty">System</span>.out.println(scores.containsKey(<span class="str">"Bob"</span>)); <span class="cm">// true</span>
scores.remove(<span class="str">"Bob"</span>);

<span class="cm">// Itérer sur toutes les entrées</span>
<span class="kw">for</span> (<span class="ty">Map</span>.<span class="ty">Entry</span>&lt;<span class="ty">String</span>, <span class="ty">Integer</span>&gt; e : scores.entrySet()) {
    <span class="ty">System</span>.out.println(e.getKey() + <span class="str">" → "</span> + e.getValue());
}

<span class="cm">// getOrDefault évite les NullPointerException</span>
scores.merge(<span class="str">"Alice"</span>, <span class="num">5</span>, <span class="ty">Integer</span>::sum); <span class="cm">// 98+5=103</span>`,
        cs: `<span class="kw">var</span> scores = <span class="kw">new</span> <span class="ty">Dictionary</span>&lt;<span class="kw">string</span>, <span class="kw">int</span>&gt;();
scores[<span class="str">"Alice"</span>] = <span class="num">95</span>;
scores[<span class="str">"Bob"</span>]   = <span class="num">87</span>;
scores[<span class="str">"Alice"</span>] = <span class="num">98</span>; <span class="cm">// remplace</span>
<span class="ty">Console</span>.WriteLine(scores[<span class="str">"Alice"</span>]);        <span class="cm">// 98</span>
<span class="ty">Console</span>.WriteLine(scores.ContainsKey(<span class="str">"Bob"</span>)); <span class="cm">// True</span>
scores.TryGetValue(<span class="str">"Zara"</span>, <span class="kw">out int</span> v);     <span class="cm">// v = 0</span>
<span class="kw">foreach</span> (<span class="kw">var</span> kv <span class="kw">in</span> scores)
    <span class="ty">Console</span>.WriteLine(<span class="str">$"{kv.Key} → {kv.Value}"</span>);`,
        py: `<span class="cm"># Python dict = HashMap</span>
scores = {<span class="str">"Alice"</span>: <span class="num">95</span>, <span class="str">"Bob"</span>: <span class="num">87</span>, <span class="str">"Carol"</span>: <span class="num">92</span>}
scores[<span class="str">"Alice"</span>] = <span class="num">98</span>  <span class="cm"># remplace</span>
print(scores[<span class="str">"Alice"</span>])              <span class="cm"># 98</span>
print(scores.get(<span class="str">"Zara"</span>, <span class="num">0</span>))       <span class="cm"># 0</span>
print(<span class="str">"Bob"</span> <span class="kw">in</span> scores)             <span class="cm"># True</span>
<span class="kw">del</span> scores[<span class="str">"Bob"</span>]
<span class="kw">for</span> k, v <span class="kw">in</span> scores.items():
    print(<span class="str">f"{k} → {v}"</span>)`,
        cpp: `<span class="kw">#include</span> &lt;unordered_map&gt;
std::unordered_map&lt;std::<span class="ty">string</span>, <span class="kw">int</span>&gt; scores;
scores[<span class="str">"Alice"</span>] = <span class="num">95</span>;
scores[<span class="str">"Bob"</span>]   = <span class="num">87</span>;
scores[<span class="str">"Alice"</span>] = <span class="num">98</span>; <span class="cm">// remplace</span>
std::cout &lt;&lt; scores[<span class="str">"Alice"</span>] &lt;&lt; <span class="str">"\n"</span>; <span class="cm">// 98</span>
<span class="kw">if</span> (scores.count(<span class="str">"Bob"</span>)) std::cout &lt;&lt; <span class="str">"Bob existe\n"</span>;
scores.erase(<span class="str">"Bob"</span>);
<span class="kw">for</span> (<span class="kw">auto</span>&amp; [k,v] : scores)
    std::cout &lt;&lt; k &lt;&lt; <span class="str">" → "</span> &lt;&lt; v &lt;&lt; <span class="str">"\n"</span>;`,
        rust: `<span class="kw">use</span> std::collections::HashMap;
<span class="kw">let mut</span> scores: HashMap&lt;<span class="ty">String</span>, i32&gt; = HashMap::new();
scores.insert(<span class="str">"Alice"</span>.to_string(), <span class="num">95</span>);
scores.insert(<span class="str">"Bob"</span>.to_string(),   <span class="num">87</span>);
*scores.entry(<span class="str">"Alice"</span>.to_string()).or_insert(<span class="num">0</span>) = <span class="num">98</span>;
println!(<span class="str">"{}"</span>, scores[<span class="str">"Alice"</span>]);     <span class="cm">// 98</span>
println!(<span class="str">"{}"</span>, scores.get(<span class="str">"Zara"</span>).unwrap_or(&amp;<span class="num">0</span>)); <span class="cm">// 0</span>
<span class="kw">for</span> (k, v) <span class="kw">in</span> &amp;scores { println!(<span class="str">"{} → {}"</span>, k, v); }`,
      },
    },
    {
      id: 'c10_2',
      title: { fr: '2 — TreeMap : clés triées', en: '2 — TreeMap: sorted keys' },
      body: {
        fr: `<code>TreeMap</code> maintient les clés dans leur <strong>ordre naturel</strong> (ou selon un <code>Comparator</code> fourni). L'accès est O(log n). Utilise <code>TreeMap</code> quand tu as besoin d'itérer sur les entrées dans un ordre précis, de trouver les clés minimale/maximale, ou de travailler avec des sous-maps (plages de clés) via <code>subMap()</code>, <code>headMap()</code>, <code>tailMap()</code>.`,
        en: `<code>TreeMap</code> keeps keys in their <strong>natural order</strong> (or according to a provided <code>Comparator</code>). Access is O(log n). Use <code>TreeMap</code> when you need to iterate over entries in a specific order, find minimum/maximum keys, or work with sub-maps (key ranges) via <code>subMap()</code>, <code>headMap()</code>, <code>tailMap()</code>.`,
      },
      code: {
        java: `<span class="ty">TreeMap</span>&lt;<span class="ty">String</span>, <span class="ty">Integer</span>&gt; scores = <span class="kw">new</span> <span class="ty">TreeMap</span>&lt;&gt;();
scores.put(<span class="str">"Carol"</span>, <span class="num">92</span>);
scores.put(<span class="str">"Alice"</span>, <span class="num">98</span>);
scores.put(<span class="str">"Bob"</span>,   <span class="num">87</span>);

<span class="cm">// Itération dans l'ordre alphabétique des clés</span>
scores.forEach((k, v) ->
    <span class="ty">System</span>.out.println(k + <span class="str">": "</span> + v));
<span class="cm">// Alice: 98 / Bob: 87 / Carol: 92</span>

<span class="ty">System</span>.out.println(scores.firstKey()); <span class="cm">// Alice</span>
<span class="ty">System</span>.out.println(scores.lastKey());  <span class="cm">// Carol</span>

<span class="cm">// Sous-map : de "Alice" (inclus) à "Carol" (exclus)</span>
<span class="ty">System</span>.out.println(scores.subMap(<span class="str">"Alice"</span>, <span class="str">"Carol"</span>));
<span class="cm">// {Alice=98, Bob=87}</span>`,
        cs: `<span class="cm">// C# : SortedDictionary = TreeMap</span>
<span class="kw">var</span> scores = <span class="kw">new</span> <span class="ty">SortedDictionary</span>&lt;<span class="kw">string</span>, <span class="kw">int</span>&gt;();
scores[<span class="str">"Carol"</span>] = <span class="num">92</span>;
scores[<span class="str">"Alice"</span>] = <span class="num">98</span>;
scores[<span class="str">"Bob"</span>]   = <span class="num">87</span>;
<span class="kw">foreach</span> (<span class="kw">var</span> kv <span class="kw">in</span> scores)
    <span class="ty">Console</span>.WriteLine(<span class="str">$"{kv.Key}: {kv.Value}"</span>);
<span class="cm">// Alice: 98 / Bob: 87 / Carol: 92</span>`,
        py: `<span class="cm"># Python : sorted() sur le dict</span>
scores = {<span class="str">"Carol"</span>: <span class="num">92</span>, <span class="str">"Alice"</span>: <span class="num">98</span>, <span class="str">"Bob"</span>: <span class="num">87</span>}

<span class="cm"># Itérer dans l'ordre des clés</span>
<span class="kw">for</span> k <span class="kw">in</span> sorted(scores):
    print(<span class="str">f"{k}: {scores[k]}"</span>)
<span class="cm"># Alice: 98 / Bob: 87 / Carol: 92</span>

<span class="cm"># Ou créer un dict trié (Python 3.7+ garde l'ordre d'insertion)</span>
<span class="kw">from</span> collections <span class="kw">import</span> OrderedDict
sorted_scores = OrderedDict(sorted(scores.items()))`,
        cpp: `<span class="kw">#include</span> &lt;map&gt;
std::map&lt;std::<span class="ty">string</span>, <span class="kw">int</span>&gt; scores; <span class="cm">// trié par clé</span>
scores[<span class="str">"Carol"</span>] = <span class="num">92</span>;
scores[<span class="str">"Alice"</span>] = <span class="num">98</span>;
scores[<span class="str">"Bob"</span>]   = <span class="num">87</span>;
<span class="kw">for</span> (<span class="kw">auto</span>&amp; [k,v] : scores)
    std::cout &lt;&lt; k &lt;&lt; <span class="str">": "</span> &lt;&lt; v &lt;&lt; <span class="str">"\n"</span>;
<span class="cm">// Alice: 98 / Bob: 87 / Carol: 92</span>
std::cout &lt;&lt; scores.begin()->first; <span class="cm">// Alice (min)</span>`,
        rust: `<span class="kw">use</span> std::collections::BTreeMap;
<span class="kw">let mut</span> scores = BTreeMap::new();
scores.insert(<span class="str">"Carol"</span>, <span class="num">92</span>);
scores.insert(<span class="str">"Alice"</span>, <span class="num">98</span>);
scores.insert(<span class="str">"Bob"</span>,   <span class="num">87</span>);
<span class="kw">for</span> (k, v) <span class="kw">in</span> &amp;scores {
    println!(<span class="str">"{}: {}"</span>, k, v);
}
<span class="cm">// Alice: 98 / Bob: 87 / Carol: 92</span>
println!(<span class="str">"{:?}"</span>, scores.iter().next()); <span class="cm">// Some(("Alice", 98))</span>`,
      },
    },
  ],
  activities: [
    {
      id: 'a10_1', concept: 'c10_1', type: 'fill', xp: 15,
      instr: { fr: 'En Java, pour récupérer une valeur sans risquer NullPointerException si la clé est absente :', en: 'In Java, to retrieve a value without risking NullPointerException if the key is absent:' },
      template: { fr: 'int score = scores.______(name, 0);', en: 'int score = scores.______(name, 0);' },
      answer: 'getOrDefault',
      hint: { fr: 'Méthode ajoutée en Java 8. Le deuxième paramètre est la valeur par défaut.', en: 'Method added in Java 8. The second parameter is the default value.' },
    },
    {
      id: 'a10_2', concept: 'c10_1', type: 'quiz', xp: 10,
      question: { fr: 'Que se passe-t-il quand on appelle put() avec une clé déjà existante dans un HashMap ?', en: 'What happens when put() is called with an existing key in a HashMap?' },
      choices: [
        { text: { fr: 'Une exception est levée.', en: 'An exception is thrown.' }, correct: false, fb: { fr: 'Non. put() est silencieux.', en: 'No. put() is silent.' } },
        { text: { fr: 'La nouvelle valeur est ignorée.', en: 'The new value is ignored.' }, correct: false, fb: { fr: 'Non. C\'est ce que fait putIfAbsent().', en: 'No. That\'s what putIfAbsent() does.' } },
        { text: { fr: 'La valeur existante est remplacée et l\'ancienne valeur est retournée.', en: 'The existing value is replaced and the old value is returned.' }, correct: true, fb: { fr: 'Correct ! put() retourne l\'ancienne valeur (ou null si la clé était absente), ce qui permet de détecter si une clé était déjà présente.', en: 'Correct! put() returns the old value (or null if the key was absent), which allows detecting if a key was already present.' } },
        { text: { fr: 'Un doublon est créé.', en: 'A duplicate is created.' }, correct: false, fb: { fr: 'Non. Les clés d\'une Map sont uniques.', en: 'No. Map keys are unique.' } },
      ],
    },
    {
      id: 'a10_3', concept: 'c10_2', type: 'predict', xp: 8,
      question: { fr: 'Qu\'affiche ce code Java (TreeMap) ?', en: 'What does this Java code print (TreeMap)?' },
      code: `<span class="ty">TreeMap</span>&lt;<span class="ty">Integer</span>, <span class="ty">String</span>&gt; map = <span class="kw">new</span> <span class="ty">TreeMap</span>&lt;&gt;();
map.put(<span class="num">3</span>, <span class="str">"trois"</span>);
map.put(<span class="num">1</span>, <span class="str">"un"</span>);
map.put(<span class="num">4</span>, <span class="str">"quatre"</span>);
map.put(<span class="num">2</span>, <span class="str">"deux"</span>);
<span class="ty">System</span>.out.println(map.firstKey() + <span class="str">" "</span> + map.lastKey());`,
      explanation: { fr: '"1 4". TreeMap trie les clés entières dans l\'ordre croissant naturel. firstKey() retourne 1 (le minimum), lastKey() retourne 4 (le maximum).', en: '"1 4". TreeMap sorts integer keys in natural ascending order. firstKey() returns 1 (minimum), lastKey() returns 4 (maximum).' },
    },
    {
      id: 'a10_4', concept: 'c10_2', type: 'quiz', xp: 10,
      question: { fr: 'Quand préférer TreeMap à HashMap ?', en: 'When to prefer TreeMap over HashMap?' },
      choices: [
        { text: { fr: 'Toujours : TreeMap est plus rapide.', en: 'Always: TreeMap is faster.' }, correct: false, fb: { fr: 'Non. HashMap est plus rapide pour la plupart des opérations (O(1) vs O(log n)).', en: 'No. HashMap is faster for most operations (O(1) vs O(log n)).' } },
        { text: { fr: 'Quand on a besoin d\'itérer dans l\'ordre des clés ou d\'utiliser des sous-maps.', en: 'When you need to iterate in key order or use sub-maps.' }, correct: true, fb: { fr: 'Correct ! TreeMap est le bon choix quand l\'ordre des clés est important : tri, plages de clés, premier/dernier.', en: 'Correct! TreeMap is the right choice when key order matters: sorting, key ranges, first/last.' } },
        { text: { fr: 'Quand les clés sont des nombres entiers.', en: 'When keys are integers.' }, correct: false, fb: { fr: 'Non. Le type de la clé ne détermine pas le choix — c\'est le besoin d\'ordre qui compte.', en: 'No. The key type doesn\'t determine the choice — it\'s the need for order that matters.' } },
        { text: { fr: 'Quand la Map contient plus de 1000 entrées.', en: 'When the Map has more than 1000 entries.' }, correct: false, fb: { fr: 'Non, la taille n\'est pas le critère.', en: 'No, size is not the criterion.' } },
      ],
    },
    {
      id: 'a10_5', concept: 'c10_1', type: 'bug', xp: 20,
      instr: { fr: 'Ce code Java tente de compter les occurrences de chaque lettre. Trouve le bug.', en: 'This Java code tries to count occurrences of each letter. Find the bug.' },
      bugCode: `<span class="ty">Map</span>&lt;<span class="ty">Character</span>, <span class="ty">Integer</span>&gt; freq = <span class="kw">new</span> <span class="ty">HashMap</span>&lt;&gt;();
<span class="kw">for</span> (<span class="kw">char</span> c : <span class="str">"hello"</span>.toCharArray()) {
    freq.put(c, <span class="bug-line">freq.get(c) + 1</span>);
}`,
      explanation: { fr: 'freq.get(c) retourne null si la clé n\'existe pas encore — et null + 1 cause une NullPointerException. La correction : <code>freq.put(c, freq.getOrDefault(c, 0) + 1);</code> ou <code>freq.merge(c, 1, Integer::sum);</code>.', en: 'freq.get(c) returns null if the key doesn\'t exist yet — and null + 1 causes a NullPointerException. The fix: <code>freq.put(c, freq.getOrDefault(c, 0) + 1);</code> or <code>freq.merge(c, 1, Integer::sum);</code>.' },
    },
  ],
  homework: {
    fr: `<p>Dans ton dépôt GitHub, crée un dossier <strong>m10/</strong> contenant :</p>
<ol style="margin:.8rem 0 .8rem 2rem;font-size:1.45rem;color:var(--ch2);line-height:2">
  <li>Un <code>README.md</code> expliquant la différence entre HashMap et TreeMap avec un exemple concret de cas d'usage pour chacun.</li>
  <li>Un programme "compteur de mots" : prend une phrase (codée en dur), compte les occurrences de chaque mot, et affiche les 3 mots les plus fréquents.</li>
  <li>Le même résultat affiché par ordre alphabétique des mots (utilise TreeMap ou tri explicite).</li>
</ol>`,
    en: `<p>In your GitHub repository, create a folder <strong>m10/</strong> containing:</p>
<ol style="margin:.8rem 0 .8rem 2rem;font-size:1.45rem;color:var(--ch2);line-height:2">
  <li>A <code>README.md</code> explaining the difference between HashMap and TreeMap with a concrete use-case example for each.</li>
  <li>A "word counter" program: takes a hardcoded sentence, counts each word's occurrences, and displays the 3 most frequent words.</li>
  <li>The same result displayed in alphabetical word order (use TreeMap or explicit sorting).</li>
</ol>`,
  },



  references: [
    { title: { fr: 'W3Schools — Java HashMap', en: 'W3Schools — Java HashMap' }, url: 'https://www.w3schools.com/java/java_hashmap.asp', note: { fr: 'HashMap : put, get, remove, iterate', en: 'HashMap: put, get, remove, iterate' } },
    { title: { fr: 'W3Schools — C# Dictionary', en: 'W3Schools — C# Dictionary' }, url: 'https://www.w3schools.com/cs/cs_dictionary.php', note: { fr: 'Dictionary<K,V> en C#', en: 'Dictionary<K,V> in C#' } },
    { title: { fr: 'W3Schools — Python Dictionaries', en: 'W3Schools — Python Dictionaries' }, url: 'https://www.w3schools.com/python/python_dictionaries.asp', note: { fr: 'Dictionnaires Python', en: 'Python dictionaries' } },
    { title: { fr: 'Oracle — HashMap', en: 'Oracle — HashMap' }, url: 'https://docs.oracle.com/javase/8/docs/api/java/util/HashMap.html', note: { fr: 'API HashMap Java officielle', en: 'Official Java HashMap API' } },
    { title: { fr: 'Oracle — TreeMap', en: 'Oracle — TreeMap' }, url: 'https://docs.oracle.com/javase/8/docs/api/java/util/TreeMap.html', note: { fr: 'API TreeMap Java officielle', en: 'Official Java TreeMap API' } },
    { title: { fr: 'Microsoft Docs — Dictionary<TK,TV>', en: 'Microsoft Docs — Dictionary<TK,TV>' }, url: 'https://learn.microsoft.com/en-us/dotnet/api/system.collections.generic.dictionary-2', note: { fr: 'Documentation officielle Dictionary C#', en: 'Official C# Dictionary documentation' } },
    { title: { fr: 'Python Docs — dict', en: 'Python Docs — dict' }, url: 'https://docs.python.org/3/library/stdtypes.html#dict', note: { fr: 'Référence officielle dict Python', en: 'Official Python dict reference' } },
    { title: { fr: 'Rust Docs — HashMap', en: 'Rust Docs — HashMap' }, url: 'https://doc.rust-lang.org/std/collections/struct.HashMap.html', note: { fr: 'HashMap en Rust', en: 'HashMap in Rust' } },
  ],
};