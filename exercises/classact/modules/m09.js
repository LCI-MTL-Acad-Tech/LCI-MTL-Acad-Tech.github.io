'use strict';
const MODULE = {
  id: 'm09', num: '09', prev: 8, next: 10,
  title: { fr: 'Collections II', en: 'Collections II' },
  sub: { fr: 'Set : unicité, HashSet, TreeSet, comparaison avec List.', en: 'Set: uniqueness, HashSet, TreeSet, comparison with List.' },
  concepts: [
    {
      id: 'c09_1',
      title: { fr: '1 — Set : collection sans doublons', en: '1 — Set: no-duplicate collection' },
      body: {
        fr: `Un <strong>Set</strong> est une collection qui <em>refuse les doublons</em>. Ajouter un élément déjà présent n\'a aucun effet. Il n\'y a pas d\'accès par index. <code>HashSet</code> est non ordonné mais très rapide (O(1) pour add/contains/remove). <code>TreeSet</code> maintient les éléments triés (O(log n)). Pour que <code>HashSet</code> fonctionne correctement avec des objets personnalisés, ces objets doivent implémenter <code>equals()</code> et <code>hashCode()</code>.`,
        en: `A <strong>Set</strong> is a collection that <em>rejects duplicates</em>. Adding an element already present has no effect. There is no index access. <code>HashSet</code> is unordered but very fast (O(1) for add/contains/remove). <code>TreeSet</code> keeps elements sorted (O(log n)). For <code>HashSet</code> to work correctly with custom objects, those objects must implement <code>equals()</code> and <code>hashCode()</code>.`,
      },
      code: {
        java: `<span class="kw">import</span> java.util.*;

<span class="ty">Set</span>&lt;<span class="ty">String</span>&gt; hash = <span class="kw">new</span> <span class="ty">HashSet</span>&lt;&gt;();
hash.add(<span class="str">"banana"</span>);
hash.add(<span class="str">"apple"</span>);
hash.add(<span class="str">"banana"</span>); <span class="cm">// doublon ignoré</span>
<span class="ty">System</span>.out.println(hash.size());           <span class="cm">// 2</span>
<span class="ty">System</span>.out.println(hash.contains(<span class="str">"apple"</span>)); <span class="cm">// true</span>
<span class="cm">// Ordre non garanti</span>

<span class="ty">Set</span>&lt;<span class="ty">String</span>&gt; tree = <span class="kw">new</span> <span class="ty">TreeSet</span>&lt;&gt;(hash);
<span class="ty">System</span>.out.println(tree); <span class="cm">// [apple, banana] — trié</span>

<span class="cm">// Opérations ensemblistes</span>
<span class="ty">Set</span>&lt;<span class="ty">Integer</span>&gt; a = <span class="kw">new</span> <span class="ty">HashSet</span>&lt;&gt;(<span class="ty">Arrays</span>.asList(<span class="num">1</span>,<span class="num">2</span>,<span class="num">3</span>));
<span class="ty">Set</span>&lt;<span class="ty">Integer</span>&gt; b = <span class="kw">new</span> <span class="ty">HashSet</span>&lt;&gt;(<span class="ty">Arrays</span>.asList(<span class="num">2</span>,<span class="num">3</span>,<span class="num">4</span>));
a.retainAll(b); <span class="cm">// intersection</span>
<span class="ty">System</span>.out.println(a); <span class="cm">// [2, 3]</span>`,
        cs: `<span class="kw">var</span> hash = <span class="kw">new</span> <span class="ty">HashSet</span>&lt;<span class="kw">string</span>&gt;();
hash.Add(<span class="str">"banana"</span>); hash.Add(<span class="str">"apple"</span>);
hash.Add(<span class="str">"banana"</span>); <span class="cm">// doublon ignoré</span>
<span class="ty">Console</span>.WriteLine(hash.Count);          <span class="cm">// 2</span>
<span class="ty">Console</span>.WriteLine(hash.Contains(<span class="str">"apple"</span>)); <span class="cm">// True</span>

<span class="kw">var</span> sorted = <span class="kw">new</span> <span class="ty">SortedSet</span>&lt;<span class="kw">string</span>&gt;(hash);
<span class="kw">foreach</span>(<span class="kw">var</span> s <span class="kw">in</span> sorted) <span class="ty">Console</span>.Write(s + <span class="str">" "</span>);
<span class="cm">// apple banana</span>`,
        py: `<span class="cm"># Python set</span>
s = {<span class="str">"banana"</span>, <span class="str">"apple"</span>, <span class="str">"banana"</span>}
print(len(s))              <span class="cm"># 2</span>
print(<span class="str">"apple"</span> <span class="kw">in</span> s)       <span class="cm"># True</span>
s.add(<span class="str">"cherry"</span>)
s.discard(<span class="str">"banana"</span>)

<span class="cm"># Opérations ensemblistes</span>
a = {<span class="num">1</span>, <span class="num">2</span>, <span class="num">3</span>}
b = {<span class="num">2</span>, <span class="num">3</span>, <span class="num">4</span>}
print(a & b)   <span class="cm"># {2, 3}  — intersection</span>
print(a | b)   <span class="cm"># {1, 2, 3, 4} — union</span>
print(a - b)   <span class="cm"># {1}  — différence</span>`,
        cpp: `<span class="kw">#include</span> &lt;unordered_set&gt;
<span class="kw">#include</span> &lt;set&gt;
std::unordered_set&lt;std::<span class="ty">string</span>&gt; hash;
hash.insert(<span class="str">"banana"</span>); hash.insert(<span class="str">"apple"</span>);
hash.insert(<span class="str">"banana"</span>); <span class="cm">// doublon ignoré</span>
std::cout &lt;&lt; hash.size() &lt;&lt; <span class="str">"\n"</span>;           <span class="cm">// 2</span>
std::cout &lt;&lt; hash.count(<span class="str">"apple"</span>) &lt;&lt; <span class="str">"\n"</span>;   <span class="cm">// 1</span>

std::set&lt;std::<span class="ty">string</span>&gt; tree(hash.begin(), hash.end());
<span class="kw">for</span> (<span class="kw">auto</span>&amp; s : tree) std::cout &lt;&lt; s &lt;&lt; <span class="str">" "</span>;
<span class="cm">// apple banana</span>`,
        rust: `<span class="kw">use</span> std::collections::{HashSet, BTreeSet};
<span class="kw">let mut</span> hash: HashSet&lt;<span class="ty">String</span>&gt; = HashSet::new();
hash.insert(<span class="str">"banana"</span>.to_string());
hash.insert(<span class="str">"apple"</span>.to_string());
hash.insert(<span class="str">"banana"</span>.to_string()); <span class="cm">// doublon ignoré</span>
println!(<span class="str">"{}"</span>, hash.len());             <span class="cm">// 2</span>
println!(<span class="str">"{}"</span>, hash.contains(<span class="str">"apple"</span>)); <span class="cm">// true</span>

<span class="kw">let</span> tree: BTreeSet&lt;<span class="ty">String</span>&gt; = hash.into_iter().collect();
<span class="kw">for</span> s <span class="kw">in</span> &amp;tree { println!(<span class="str">"{}"</span>, s); } <span class="cm">// apple, banana</span>`,
      },
    },
    {
      id: 'c09_2',
      title: { fr: '2 — Choisir entre List, Set et Queue', en: '2 — Choosing between List, Set, and Queue' },
      body: {
        fr: `Le choix dépend du <strong>besoin</strong> : utilise <code>List</code> si l\'ordre et les doublons importent, <code>Set</code> si tu as besoin de garantir l\'unicité (dédoublonnage, appartenance rapide), <code>Queue</code> si tu traites des éléments dans l\'ordre d\'arrivée (FIFO). Ces structures s\'utilisent souvent ensemble : une Queue pour l\'ordre d\'arrivée, un Set pour vérifier si un élément a déjà été traité.`,
        en: `The choice depends on <strong>need</strong>: use <code>List</code> if order and duplicates matter, <code>Set</code> if you need guaranteed uniqueness (deduplication, fast membership check), <code>Queue</code> if you process elements in arrival order (FIFO). These structures are often used together: a Queue for arrival order, a Set to check if an element has already been processed.`,
      },
      code: {
        java: `<span class="cm">// Exemple : dédoublonner une liste de mots</span>
<span class="ty">List</span>&lt;<span class="ty">String</span>&gt; words = <span class="ty">Arrays</span>.asList(
    <span class="str">"chat"</span>, <span class="str">"chien"</span>, <span class="str">"chat"</span>, <span class="str">"oiseau"</span>, <span class="str">"chien"</span>
);
<span class="ty">Set</span>&lt;<span class="ty">String</span>&gt; unique = <span class="kw">new</span> <span class="ty">LinkedHashSet</span>&lt;&gt;(words);
<span class="cm">// LinkedHashSet conserve l'ordre d'insertion</span>
<span class="ty">System</span>.out.println(unique); <span class="cm">// [chat, chien, oiseau]</span>

<span class="cm">// Exemple : BFS (parcours en largeur) avec Queue + Set</span>
<span class="ty">Queue</span>&lt;<span class="ty">String</span>&gt;  toVisit  = <span class="kw">new</span> <span class="ty">LinkedList</span>&lt;&gt;();
<span class="ty">Set</span>&lt;<span class="ty">String</span>&gt;   visited  = <span class="kw">new</span> <span class="ty">HashSet</span>&lt;&gt;();
toVisit.offer(<span class="str">"start"</span>);
<span class="kw">while</span> (!toVisit.isEmpty()) {
    <span class="ty">String</span> node = toVisit.poll();
    <span class="kw">if</span> (visited.add(node)) { <span class="cm">// add retourne false si déjà présent</span>
        <span class="ty">System</span>.out.println(<span class="str">"Visite : "</span> + node);
        <span class="cm">// ... ajouter les voisins à toVisit</span>
    }
}`,
        cs: `<span class="cm">// Dédoublonner avec HashSet</span>
<span class="kw">var</span> words = <span class="kw">new</span> <span class="ty">List</span>&lt;<span class="kw">string</span>&gt; {<span class="str">"chat"</span>,<span class="str">"chien"</span>,<span class="str">"chat"</span>};
<span class="kw">var</span> unique = <span class="kw">new</span> <span class="ty">HashSet</span>&lt;<span class="kw">string</span>&gt;(words);
<span class="ty">Console</span>.WriteLine(unique.Count); <span class="cm">// 2</span>

<span class="cm">// Quand utiliser quoi :</span>
<span class="cm">// List   → ordre + accès index + doublons OK</span>
<span class="cm">// HashSet → appartenance rapide + unicité</span>
<span class="cm">// Queue  → traitement FIFO</span>`,
        py: `<span class="cm"># Dédoublonner en préservant l'ordre (Python 3.7+)</span>
words = [<span class="str">"chat"</span>, <span class="str">"chien"</span>, <span class="str">"chat"</span>, <span class="str">"oiseau"</span>]
unique = list(dict.fromkeys(words))
print(unique)  <span class="cm"># ['chat', 'chien', 'oiseau']</span>

<span class="cm"># Ou avec un set (sans ordre garanti)</span>
unique_set = list(set(words))

<span class="cm"># Résumé du choix :</span>
<span class="cm"># list  → séquence ordonnée, doublons OK</span>
<span class="cm"># set   → unicité, appartenance O(1)</span>
<span class="cm"># deque → FIFO efficace</span>`,
        cpp: `<span class="cm">// Résumé C++ :</span>
<span class="cm">// std::vector        → List ordonnée</span>
<span class="cm">// std::unordered_set → HashSet (O(1))</span>
<span class="cm">// std::set           → TreeSet (trié, O(log n))</span>
<span class="cm">// std::queue         → FIFO</span>

<span class="cm">// Dédoublonner un vecteur</span>
std::vector&lt;<span class="kw">int</span>&gt; v = {<span class="num">1</span>,<span class="num">2</span>,<span class="num">2</span>,<span class="num">3</span>,<span class="num">1</span>};
std::unordered_set&lt;<span class="kw">int</span>&gt; s(v.begin(), v.end());
std::vector&lt;<span class="kw">int</span>&gt; deduped(s.begin(), s.end());
<span class="cm">// deduped contient {1, 2, 3} (ordre non garanti)</span>`,
        rust: `<span class="cm">// Résumé Rust :</span>
<span class="cm">// Vec          → List ordonnée</span>
<span class="cm">// HashSet      → unicité O(1)</span>
<span class="cm">// BTreeSet     → trié O(log n)</span>
<span class="cm">// VecDeque     → FIFO</span>

<span class="kw">use</span> std::collections::HashSet;
<span class="kw">let</span> v = vec![<span class="num">1</span>, <span class="num">2</span>, <span class="num">2</span>, <span class="num">3</span>, <span class="num">1</span>];
<span class="kw">let</span> unique: HashSet&lt;<span class="kw">i32</span>&gt; = v.into_iter().collect();
println!(<span class="str">"{}"</span>, unique.len()); <span class="cm">// 3</span>`,
      },
    },
  ],
  activities: [
    {
      id: 'a09_1', concept: 'c09_1', type: 'quiz', xp: 10,
      question: { fr: 'Que se passe-t-il quand on ajoute un doublon à un HashSet en Java ?', en: 'What happens when you add a duplicate to a HashSet in Java?' },
      choices: [
        { text: { fr: 'Une exception est levée.', en: 'An exception is thrown.' }, correct: false, fb: { fr: 'Non. add() retourne simplement false sans lever d\'exception.', en: 'No. add() simply returns false without throwing an exception.' } },
        { text: { fr: 'L\'élément est ajouté en double.', en: 'The element is added twice.' }, correct: false, fb: { fr: 'Non. C\'est la propriété fondamentale du Set : pas de doublons.', en: 'No. That\'s the fundamental property of Set: no duplicates.' } },
        { text: { fr: 'L\'opération est ignorée et add() retourne false.', en: 'The operation is ignored and add() returns false.' }, correct: true, fb: { fr: 'Correct ! add() retourne true si l\'élément a été ajouté, false s\'il était déjà présent.', en: 'Correct! add() returns true if the element was added, false if it was already present.' } },
        { text: { fr: 'L\'ancien élément est remplacé par le nouveau.', en: 'The old element is replaced by the new one.' }, correct: false, fb: { fr: 'Non, c\'est ce que fait Map.put() — pas Set.add().', en: 'No, that\'s what Map.put() does — not Set.add().' } },
      ],
    },
    {
      id: 'a09_2', concept: 'c09_1', type: 'fill', xp: 15,
      instr: { fr: 'Pour avoir un Set trié automatiquement en Java, on utilise :', en: 'To have an automatically sorted Set in Java, you use:' },
      template: { fr: 'Set<String> sorted = new ______(myList);', en: 'Set<String> sorted = new ______(myList);' },
      answer: 'TreeSet',
      hint: { fr: 'L\'arbre binaire de recherche donne l\'ordre naturel. Complexité O(log n).', en: 'The binary search tree gives natural ordering. Complexity O(log n).' },
    },
    {
      id: 'a09_3', concept: 'c09_2', type: 'quiz', xp: 10,
      question: { fr: 'Tu dois stocker les IDs de toutes les pages visitées dans un crawler web et vérifier très rapidement si une page a déjà été visitée. Quelle structure choisir ?', en: 'You need to store IDs of all visited pages in a web crawler and check very quickly if a page was already visited. Which structure to choose?' },
      choices: [
        { text: { fr: 'ArrayList', en: 'ArrayList' }, correct: false, fb: { fr: 'Non. contains() sur un ArrayList est O(n) — trop lent pour des millions de pages.', en: 'No. contains() on an ArrayList is O(n) — too slow for millions of pages.' } },
        { text: { fr: 'HashSet', en: 'HashSet' }, correct: true, fb: { fr: 'Correct ! HashSet.contains() est O(1). C\'est le choix classique pour les ensembles "déjà visités" dans les algorithmes de graphe.', en: 'Correct! HashSet.contains() is O(1). It\'s the classic choice for "already visited" sets in graph algorithms.' } },
        { text: { fr: 'Queue', en: 'Queue' }, correct: false, fb: { fr: 'Non. Queue est pour l\'ordre FIFO, pas pour la vérification d\'appartenance.', en: 'No. Queue is for FIFO ordering, not membership checking.' } },
        { text: { fr: 'TreeSet', en: 'TreeSet' }, correct: false, fb: { fr: 'TreeSet fonctionne mais est O(log n) — moins efficace que HashSet pour ce cas.', en: 'TreeSet works but is O(log n) — less efficient than HashSet for this case.' } },
      ],
    },
    {
      id: 'a09_4', concept: 'c09_2', type: 'predict', xp: 8,
      question: { fr: 'Que contient unique après ce code Java ?', en: 'What does unique contain after this Java code?' },
      code: `<span class="ty">List</span>&lt;<span class="ty">Integer</span>&gt; nums = <span class="ty">Arrays</span>.asList(<span class="num">5</span>,<span class="num">3</span>,<span class="num">1</span>,<span class="num">3</span>,<span class="num">5</span>,<span class="num">2</span>);
<span class="ty">Set</span>&lt;<span class="ty">Integer</span>&gt; unique = <span class="kw">new</span> <span class="ty">TreeSet</span>&lt;&gt;(nums);
<span class="ty">System</span>.out.println(unique);`,
      explanation: { fr: '[1, 2, 3, 5]. TreeSet supprime les doublons (3 et 5 apparaissent deux fois) ET trie les éléments dans l\'ordre naturel croissant.', en: '[1, 2, 3, 5]. TreeSet removes duplicates (3 and 5 appear twice) AND sorts elements in natural ascending order.' },
    },
  ],
  homework: {
    fr: `<p>Dans ton dépôt GitHub, crée un dossier <strong>m09/</strong> contenant :</p>
<ol style="margin:.8rem 0 .8rem 2rem;font-size:1.45rem;color:var(--ch2);line-height:2">
  <li>Un <code>README.md</code> : un tableau comparatif List / Set / Queue avec une colonne "quand l'utiliser" et un exemple concret pour chacun.</li>
  <li>Un programme qui lit une liste de mots (codée en dur), affiche le nombre de mots uniques, les mots en doublon, et les mots triés alphabétiquement.</li>
  <li>Une implémentation simplifiée de l'algorithme de dédoublonnage qui préserve l'ordre d'insertion (utilise <code>LinkedHashSet</code>).</li>
</ol>`,
    en: `<p>In your GitHub repository, create a folder <strong>m09/</strong> containing:</p>
<ol style="margin:.8rem 0 .8rem 2rem;font-size:1.45rem;color:var(--ch2);line-height:2">
  <li>A <code>README.md</code>: a comparison table List / Set / Queue with a "when to use" column and a concrete example for each.</li>
  <li>A program that reads a hardcoded word list, prints the number of unique words, the duplicate words, and the words sorted alphabetically.</li>
  <li>A simplified deduplication algorithm that preserves insertion order (use <code>LinkedHashSet</code>).</li>
</ol>`,
  },



  references: [
    { title: { fr: 'W3Schools — Java HashSet', en: 'W3Schools — Java HashSet' }, url: 'https://www.w3schools.com/java/java_hashset.asp', note: { fr: 'HashSet : créer, ajouter, vérifier', en: 'HashSet: creating, adding, checking' } },
    { title: { fr: 'W3Schools — C# HashSet', en: 'W3Schools — C# HashSet' }, url: 'https://www.w3schools.com/cs/cs_hashset.php', note: { fr: 'HashSet<T> en C#', en: 'HashSet<T> in C#' } },
    { title: { fr: 'W3Schools — Python Sets', en: 'W3Schools — Python Sets' }, url: 'https://www.w3schools.com/python/python_sets.asp', note: { fr: 'Ensembles Python et opérations ensemblistes', en: 'Python sets and set operations' } },
    { title: { fr: 'Oracle — Set Interface', en: 'Oracle — Set Interface' }, url: 'https://docs.oracle.com/javase/8/docs/api/java/util/Set.html', note: { fr: 'API Set Java officielle', en: 'Official Java Set API' } },
    { title: { fr: 'Oracle — HashSet', en: 'Oracle — HashSet' }, url: 'https://docs.oracle.com/javase/8/docs/api/java/util/HashSet.html', note: { fr: 'API HashSet Java officielle', en: 'Official Java HashSet API' } },
    { title: { fr: 'Oracle — TreeSet', en: 'Oracle — TreeSet' }, url: 'https://docs.oracle.com/javase/8/docs/api/java/util/TreeSet.html', note: { fr: 'API TreeSet Java officielle', en: 'Official Java TreeSet API' } },
    { title: { fr: 'Microsoft Docs — HashSet<T>', en: 'Microsoft Docs — HashSet<T>' }, url: 'https://learn.microsoft.com/en-us/dotnet/api/system.collections.generic.hashset-1', note: { fr: 'Documentation officielle HashSet C#', en: 'Official C# HashSet documentation' } },
    { title: { fr: 'Rust Docs — HashSet', en: 'Rust Docs — HashSet' }, url: 'https://doc.rust-lang.org/std/collections/struct.HashSet.html', note: { fr: 'HashSet en Rust', en: 'HashSet in Rust' } },
  ],
};