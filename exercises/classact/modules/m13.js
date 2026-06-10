'use strict';
const MODULE = {
  id: 'm13', num: '13', prev: 12, next: null,
  title: { fr: 'Préparation à l\'oral', en: 'Oral Exam Prep' },
  sub: { fr: 'Questions types, vocabulaire clé, démonstration de raisonnement.', en: 'Practice questions, key vocabulary, demonstrating reasoning.' },
  concepts: [
    {
      id: 'c13_1',
      title: { fr: '1 — Comment répondre à une question d\'oral', en: '1 — How to answer an oral question' },
      body: {
        fr: `Un examen oral de POO évalue ta capacité à <em>expliquer</em>, pas seulement à coder. La structure recommandée pour n\'importe quelle question : <strong>1. Définir</strong> le concept en une phrase. <strong>2. Donner un exemple concret</strong> dans un langage. <strong>3. Expliquer pourquoi</strong> c\'est utile (quel problème ça résout). <strong>4. Mentionner une limite ou un piège</strong> pour montrer la maîtrise. Prends le temps de reformuler la question si elle est ambiguë — c\'est apprécié.`,
        en: `An OOP oral exam evaluates your ability to <em>explain</em>, not just code. The recommended structure for any question: <strong>1. Define</strong> the concept in one sentence. <strong>2. Give a concrete example</strong> in a language. <strong>3. Explain why</strong> it\'s useful (what problem it solves). <strong>4. Mention a limitation or pitfall</strong> to show mastery. Take time to rephrase an ambiguous question — it\'s appreciated.`,
      },
      code: {
        java: `<span class="cm">// Question : "Qu'est-ce que l'encapsulation ?"</span>

<span class="cm">// Réponse structurée :</span>

<span class="cm">// 1. DÉFINIR</span>
<span class="cm">// "L'encapsulation regroupe des données et des méthodes dans</span>
<span class="cm">//  une classe, et restreint l'accès direct aux données via</span>
<span class="cm">//  des modificateurs d'accès."</span>

<span class="cm">// 2. EXEMPLE</span>
<span class="kw">class</span> <span class="ty">BankAccount</span> {
    <span class="kw">private double</span> balance; <span class="cm">// données cachées</span>
    <span class="kw">public void</span> <span class="fn">deposit</span>(<span class="kw">double</span> a) {
        <span class="kw">if</span> (a > <span class="num">0</span>) balance += a; <span class="cm">// contrôle dans la méthode</span>
    }
    <span class="kw">public double</span> <span class="fn">getBalance</span>() { <span class="kw">return</span> balance; }
}

<span class="cm">// 3. POURQUOI</span>
<span class="cm">// "Cela empêche du code extérieur d'assigner -1000 directement</span>
<span class="cm">//  au solde — deposit() peut valider avant d'agir."</span>

<span class="cm">// 4. LIMITE</span>
<span class="cm">// "En Python, la convention _ est honorée mais pas imposée —</span>
<span class="cm">//  on peut accéder à _balance directement si on le veut."</span>`,
        cs: `<span class="cm">// Question : "Différence entre abstract class et interface ?"</span>

<span class="cm">// 1. DÉFINIR les deux</span>
<span class="cm">// Abstract class : modèle partiel avec état partagé</span>
<span class="cm">// Interface : contrat pur sans état</span>

<span class="cm">// 2. EXEMPLE</span>
<span class="kw">abstract class</span> <span class="ty">Vehicle</span> { <span class="kw">protected int</span> speed = <span class="num">0</span>; } <span class="cm">// état</span>
<span class="kw">interface</span> <span class="ty">IElectric</span> { <span class="kw">void</span> <span class="fn">Charge</span>(); }              <span class="cm">// contrat</span>
<span class="kw">class</span> <span class="ty">Tesla</span> : <span class="ty">Vehicle</span>, <span class="ty">IElectric</span> {
    <span class="kw">public override void</span> <span class="fn">Accelerate</span>() { speed += <span class="num">10</span>; }
    <span class="kw">public void</span> <span class="fn">Charge</span>() { <span class="cm">/* ... */</span> }
}

<span class="cm">// 3. POURQUOI</span>
<span class="cm">// "Vehicle a speed — partagé par tous les véhicules.</span>
<span class="cm">//  IElectric est une capacité optionnelle — pas tous les véhicules."</span>

<span class="cm">// 4. LIMITE</span>
<span class="cm">// "Une classe ne peut hériter que d'une abstract class,</span>
<span class="cm">//  mais implémenter plusieurs interfaces."</span>`,
        py: `<span class="cm"># Question : "Qu'est-ce que le polymorphisme ?"</span>

<span class="cm"># 1. DÉFINIR</span>
<span class="cm"># "Le polymorphisme permet à une référence de type parent</span>
<span class="cm">#  d'appeler la bonne méthode selon le type réel de l'objet."</span>

<span class="cm"># 2. EXEMPLE</span>
<span class="kw">class</span> <span class="ty">Shape</span>:
    <span class="kw">def</span> <span class="fn">area</span>(self): <span class="kw">return</span> <span class="num">0</span>

<span class="kw">class</span> <span class="ty">Circle</span>(<span class="ty">Shape</span>):
    <span class="kw">def</span> <span class="fn">area</span>(self): <span class="kw">return</span> <span class="num">3.14</span> * <span class="num">5</span>**<span class="num">2</span>

shapes = [<span class="ty">Shape</span>(), <span class="ty">Circle</span>()]
<span class="kw">for</span> s <span class="kw">in</span> shapes:
    print(s.area()) <span class="cm"># 0, puis 78.5</span>

<span class="cm"># 3. POURQUOI</span>
<span class="cm"># "On peut écrire du code générique sur Shape sans connaître</span>
<span class="cm">#  les sous-types — drawAll(shapes) fonctionne pour toute Shape."</span>

<span class="cm"># 4. LIMITE</span>
<span class="cm"># "Requiert la redéfinition de méthode (overriding).</span>
<span class="cm">#  La surcharge seule ne produit pas de polymorphisme à l'exécution."</span>`,
        cpp: `<span class="cm">// Question : "Pourquoi virtual en C++ ?"</span>

<span class="cm">// 1. DÉFINIR</span>
<span class="cm">// "virtual active la résolution dynamique : la méthode appelée</span>
<span class="cm">//  dépend du type réel, pas du type déclaré du pointeur."</span>

<span class="cm">// 2. EXEMPLE</span>
<span class="kw">class</span> <span class="ty">A</span> { <span class="kw">public</span>: <span class="kw">virtual void</span> <span class="fn">go</span>() { std::cout << <span class="str">"A\n"</span>; } };
<span class="kw">class</span> <span class="ty">B</span> : <span class="kw">public</span> <span class="ty">A</span> { <span class="kw">public</span>: <span class="kw">void</span> <span class="fn">go</span>() <span class="kw">override</span> { std::cout << <span class="str">"B\n"</span>; } };
<span class="ty">A</span>* a = <span class="kw">new</span> <span class="ty">B</span>(); a->go(); <span class="cm">// B (résolution dynamique)</span>

<span class="cm">// 3. POURQUOI</span>
<span class="cm">// "Sans virtual, le compilateur appelle A::go statiquement.</span>
<span class="cm">//  Avec virtual, la vtable permet d'appeler B::go à l'exécution."</span>

<span class="cm">// 4. LIMITE</span>
<span class="cm">// "virtual a un coût léger (vtable pointer). Pour les classes</span>
<span class="cm">//  final (jamais héritées), on peut éviter virtual."</span>`,
        rust: `<span class="cm">// Question : "Comment Rust implémente-t-il la POO ?"</span>

<span class="cm">// 1. DÉFINIR</span>
<span class="cm">// "Rust n'a pas d'héritage classique. Il sépare</span>
<span class="cm">//  données (struct) et comportements (trait)."</span>

<span class="cm">// 2. EXEMPLE</span>
<span class="kw">trait</span> <span class="ty">Speaks</span> { <span class="kw">fn</span> <span class="fn">speak</span>(&amp;self); }
<span class="kw">struct</span> <span class="ty">Dog</span>;
<span class="kw">impl</span> <span class="ty">Speaks</span> <span class="kw">for</span> <span class="ty">Dog</span> { <span class="kw">fn</span> <span class="fn">speak</span>(&amp;self) { println!(<span class="str">"Woof"</span>); } }
<span class="kw">fn</span> <span class="fn">make_speak</span>(s: &amp;<span class="kw">dyn</span> <span class="ty">Speaks</span>) { s.speak(); } <span class="cm">// polymorphisme</span>

<span class="cm">// 3. POURQUOI</span>
<span class="cm">// "Plus flexible : une struct peut implémenter plusieurs traits.</span>
<span class="cm">//  Pas de problème de diamant comme avec l'héritage multiple."</span>

<span class="cm">// 4. LIMITE</span>
<span class="cm">// "Pas de partage d'état via héritage — on compose via</span>
<span class="cm">//  des champs ou des traits avec méthodes par défaut."</span>`,
      },
    },
    {
      id: 'c13_2',
      title: { fr: '2 — Questions types et réponses modèles', en: '2 — Practice questions and model answers' },
      body: {
        fr: `Voici les questions les plus fréquentes dans un oral de POO, avec la structure de réponse attendue. Entraîne-toi à répondre à voix haute, sans regarder tes notes, en moins de 2 minutes. L\'objectif n\'est pas de réciter une définition mais de montrer que tu comprends <em>pourquoi</em> le concept existe.`,
        en: `Here are the most common questions in an OOP oral, with the expected answer structure. Practice answering out loud, without notes, in under 2 minutes. The goal isn\'t to recite a definition but to show you understand <em>why</em> the concept exists.`,
      },
      code: {
        java: `<span class="cm">// Q1 : Qu'est-ce qu'un constructeur ? Pourquoi en a-t-on besoin ?</span>
<span class="cm">// → Méthode appelée à new. Garantit un état initial valide.</span>
<span class="cm">//   Sans constructeur explicite, les attributs numériques = 0,</span>
<span class="cm">//   String = null — souvent source de NullPointerException.</span>

<span class="cm">// Q2 : Explique la différence entre overloading et overriding.</span>
<span class="cm">// → Overloading : même nom, signatures différentes, même classe.</span>
<span class="cm">//   Overriding   : même nom, même signature, classe différente (sous-classe).</span>
<span class="cm">//   @Override détecte les erreurs de signature.</span>

<span class="cm">// Q3 : Quand utiliser HashMap vs TreeMap vs LinkedHashMap ?</span>
<span class="cm">// → HashMap : vitesse, ordre sans importance.</span>
<span class="cm">//   TreeMap  : clés triées (plage, min/max).</span>
<span class="cm">//   LinkedHashMap : ordre d'insertion (historique, cache LRU).</span>

<span class="cm">// Q4 : Pourquoi redéfinir hashCode() si on redéfinit equals() ?</span>
<span class="cm">// → Contrat Java : a.equals(b) → a.hashCode() == b.hashCode().</span>
<span class="cm">//   Sans ça, HashMap/HashSet cassés : objets "égaux" dans</span>
<span class="cm">//   des buckets différents → duplicats invisibles.</span>

<span class="cm">// Q5 : Quelle est la différence entre List, Set et Map ?</span>
<span class="cm">// → List   : séquence ordonnée, doublons OK, accès par index.</span>
<span class="cm">//   Set    : unicité, pas d'accès index, appartenance O(1).</span>
<span class="cm">//   Map    : association clé→valeur, clés uniques.</span>`,
        cs: `<span class="cm">// Q1 : C# — virtual vs override ?</span>
<span class="cm">// → virtual : annonce qu'une méthode PEUT être redéfinie.</span>
<span class="cm">//   override : redéfinit une méthode virtual dans une sous-classe.</span>
<span class="cm">//   Sans virtual, le compilateur utilise la résolution statique.</span>

<span class="cm">// Q2 : Interface vs classe abstraite en C# ?</span>
<span class="cm">// → Même règle qu'en Java. La nouveauté C# 8+ : les interfaces</span>
<span class="cm">//   peuvent avoir des implémentations par défaut.</span>

<span class="cm">// Q3 : Qu'est-ce que sealed en C# ?</span>
<span class="cm">// → Interdit l'héritage. Optimisation et design intent :</span>
<span class="cm">//   "cette classe n'est pas faite pour être étendue."</span>

<span class="cm">// Q4 : Génériques : pourquoi pas juste object ?</span>
<span class="cm">// → Sécurité à la compilation. Pas de cast. Pas de boxing</span>
<span class="cm">//   pour les types valeur. List&lt;int&gt; vs ArrayList.</span>`,
        py: `<span class="cm"># Q1 : Python a-t-il vraiment l'encapsulation ?</span>
<span class="cm"># → Convention plutôt qu'enforcement. _ = "privé par convention".</span>
<span class="cm">#   __ = name-mangling (_Classe__attr). Mais techniquement</span>
<span class="cm">#   accessible. Python fait confiance au développeur.</span>

<span class="cm"># Q2 : Qu'est-ce que MRO en Python ?</span>
<span class="cm"># → Method Resolution Order : ordre dans lequel Python cherche</span>
<span class="cm">#   une méthode en cas d'héritage multiple. Algorithme C3.</span>

<span class="cm"># Q3 : @abstractmethod vs NotImplementedError ?</span>
<span class="cm"># → @abstractmethod empêche l'instanciation si non implémenté.</span>
<span class="cm">#   raise NotImplementedError est une convention sans contrainte</span>
<span class="cm">#   à la création — l'erreur arrive seulement à l'appel.</span>

<span class="cm"># Q4 : Pourquoi __eq__ et __hash__ sont-ils liés ?</span>
<span class="cm"># → Même contrat qu'en Java. Python met __hash__ à None</span>
<span class="cm">#   si __eq__ est défini sans __hash__ → non-hashable.</span>`,
        cpp: `<span class="cm">// Q1 : Qu'est-ce que le destructeur virtuel en C++ ?</span>
<span class="cm">// → Si on delete via un pointeur de base, le destructeur de la</span>
<span class="cm">//   classe dérivée n'est appelé que si le destructeur est virtual.</span>
<span class="cm">//   Sans ça : fuite mémoire pour les ressources de la dérivée.</span>

<span class="cm">// Q2 : Différence entre pointeur et référence en POO C++ ?</span>
<span class="cm">// → Pointeur : peut être null, réaffectable, nécessite ->.</span>
<span class="cm">//   Référence : ne peut être null, liée à l'init, utilise ..</span>
<span class="cm">//   Pour le polymorphisme : pointeur ou référence (pas valeur).</span>

<span class="cm">// Q3 : Quand utiliser unique_ptr vs shared_ptr ?</span>
<span class="cm">// → unique_ptr : propriété exclusive, pas de partage.</span>
<span class="cm">//   shared_ptr  : propriété partagée, ref-counting.</span>
<span class="cm">//   Préférer unique_ptr par défaut.</span>`,
        rust: `<span class="cm">// Q1 : Rust est-il orienté objet ?</span>
<span class="cm">// → Partiellement. Encapsulation : oui (pub/private).</span>
<span class="cm">//   Héritage : non. Polymorphisme : oui (traits + dyn).</span>
<span class="cm">//   Abstraction : oui (traits). Design différent, pas inférieur.</span>

<span class="cm">// Q2 : Quelle est la différence entre impl Trait et dyn Trait ?</span>
<span class="cm">// → impl Trait : dispatch statique (monomorphisation), rapide.</span>
<span class="cm">//   dyn Trait  : dispatch dynamique (vtable), flexible.</span>
<span class="cm">//   impl Trait quand le type est connu à la compilation.</span>
<span class="cm">//   dyn Trait pour les collections hétérogènes.</span>

<span class="cm">// Q3 : Comment simuler l'héritage en Rust ?</span>
<span class="cm">// → Composition : struct Child { parent: Parent }.</span>
<span class="cm">//   Traits avec méthodes par défaut pour le comportement partagé.</span>`,
      },
    },
  ],
  activities: [
    {
      id: 'a13_1', concept: 'c13_1', type: 'quiz', xp: 10,
      question: { fr: 'Un examinateur demande : "Explique-moi le polymorphisme." Quelle est la meilleure structure de réponse ?', en: 'An examiner asks: "Explain polymorphism to me." What is the best answer structure?' },
      choices: [
        { text: { fr: 'Réciter la définition du livre, puis passer à la suite.', en: 'Recite the textbook definition, then move on.' }, correct: false, fb: { fr: 'Non. Une définition seule ne démontre pas la compréhension.', en: 'No. A definition alone doesn\'t demonstrate understanding.' } },
        { text: { fr: 'Définir, donner un exemple en code, expliquer pourquoi c\'est utile, mentionner une limite.', en: 'Define, give a code example, explain why it\'s useful, mention a limitation.' }, correct: true, fb: { fr: 'Correct ! Cette structure montre que tu comprends le concept en profondeur, pas juste la terminologie.', en: 'Correct! This structure shows you understand the concept in depth, not just the terminology.' } },
        { text: { fr: 'Écrire le plus de code possible au tableau.', en: 'Write as much code as possible on the board.' }, correct: false, fb: { fr: 'Non. Un oral valorise l\'explication verbale.', en: 'No. An oral exam values verbal explanation.' } },
        { text: { fr: 'Dire qu\'on ne se souvient plus et passer à la question suivante.', en: 'Say you don\'t remember and move on to the next question.' }, correct: false, fb: { fr: 'Jamais. Essaie toujours de reformuler ce que tu sais.', en: 'Never. Always try to rephrase what you know.' } },
      ],
    },
    {
      id: 'a13_2', concept: 'c13_2', type: 'quiz', xp: 10,
      question: { fr: '"Pourquoi redéfinir hashCode() quand on redéfinit equals() en Java ?" — Quelle réponse est correcte ?', en: '"Why override hashCode() when overriding equals() in Java?" — Which answer is correct?' },
      choices: [
        { text: { fr: 'Pour respecter le contrat Java : deux objets equals() doivent avoir le même hashCode(), sinon HashMap et HashSet sont cassés.', en: 'To respect the Java contract: two equals() objects must have the same hashCode(), otherwise HashMap and HashSet break.' }, correct: true, fb: { fr: 'Correct ! C\'est exactement la bonne explication. HashMap cherche dans le bucket hashCode() — si deux objets "égaux" ont des hashCodes différents, ils atterrissent dans des buckets différents et ne se dédoublonnent pas.', en: 'Correct! That\'s exactly the right explanation. HashMap looks in the hashCode() bucket — if two "equal" objects have different hashCodes, they land in different buckets and aren\'t deduplicated.' } },
        { text: { fr: 'Pour des raisons de performance — hashCode() est plus rapide que equals().', en: 'For performance reasons — hashCode() is faster than equals().' }, correct: false, fb: { fr: 'Partiellement vrai mais ce n\'est pas la raison principale — c\'est le contrat de cohérence.', en: 'Partially true but not the main reason — it\'s the consistency contract.' } },
        { text: { fr: 'Parce que Java l\'exige syntaxiquement.', en: 'Because Java requires it syntactically.' }, correct: false, fb: { fr: 'Non, Java ne l\'exige pas syntaxiquement — le compilateur ne génère pas d\'erreur. Mais le comportement sera incorrect.', en: 'No, Java doesn\'t require it syntactically — the compiler doesn\'t error. But the behaviour will be incorrect.' } },
        { text: { fr: 'Pour que l\'objet puisse être sérialisé.', en: 'So the object can be serialised.' }, correct: false, fb: { fr: 'Non, la sérialisation utilise l\'interface Serializable — sans lien avec hashCode().', en: 'No, serialisation uses the Serializable interface — unrelated to hashCode().' } },
      ],
    },
    {
      id: 'a13_3', concept: 'c13_1', type: 'predict', xp: 8,
      question: { fr: 'L\'examinateur montre ce code et demande : "Que fait ce code et quel concept OOP illustre-t-il ?"', en: 'The examiner shows this code and asks: "What does this code do and which OOP concept does it illustrate?"' },
      code: `<span class="ty">List</span>&lt;<span class="ty">Shape</span>&gt; shapes = <span class="kw">new</span> <span class="ty">ArrayList</span>&lt;&gt;();
shapes.add(<span class="kw">new</span> <span class="ty">Circle</span>(<span class="num">5</span>));
shapes.add(<span class="kw">new</span> <span class="ty">Rectangle</span>(<span class="num">3</span>, <span class="num">4</span>));
shapes.add(<span class="kw">new</span> <span class="ty">Triangle</span>(<span class="num">6</span>, <span class="num">8</span>));
<span class="kw">double</span> total = shapes.stream()
    .mapToDouble(<span class="ty">Shape</span>::area)
    .sum();`,
      explanation: { fr: 'Ce code calcule la somme des aires de formes différentes. Il illustre le polymorphisme : la liste est de type List<Shape> mais contient des Circle, Rectangle et Triangle (toutes des sous-classes). .mapToDouble(Shape::area) appelle la méthode area() appropriée sur chaque objet selon son type réel — c\'est le dispatch dynamique. Sans polymorphisme, il faudrait un if/else pour chaque type.', en: 'This code calculates the sum of areas of different shapes. It illustrates polymorphism: the list is List<Shape> but contains Circle, Rectangle and Triangle (all subclasses). .mapToDouble(Shape::area) calls the appropriate area() method on each object based on its actual type — that\'s dynamic dispatch. Without polymorphism, an if/else for each type would be needed.' },
    },
    {
      id: 'a13_4', concept: 'c13_2', type: 'quiz', xp: 10,
      question: { fr: 'L\'examinateur demande : "Quelle collection Java utiliserais-tu pour un dictionnaire de définitions trié par mot ?" Ta réponse ?', en: 'The examiner asks: "Which Java collection would you use for a dictionary of definitions sorted by word?" Your answer?' },
      choices: [
        { text: { fr: 'ArrayList<String>', en: 'ArrayList<String>' }, correct: false, fb: { fr: 'Non. ArrayList ne fait pas d\'association clé→valeur.', en: 'No. ArrayList doesn\'t do key→value association.' } },
        { text: { fr: 'HashMap<String, String>', en: 'HashMap<String, String>' }, correct: false, fb: { fr: 'Presque — HashMap est une Map mais sans ordre de clés. Pour un dictionnaire "trié par mot", il faut l\'ordre.', en: 'Almost — HashMap is a Map but without key ordering. For a "sorted by word" dictionary, you need ordering.' } },
        { text: { fr: 'TreeMap<String, String>', en: 'TreeMap<String, String>' }, correct: true, fb: { fr: 'Correct ! TreeMap<String, String> : clés (mots) triées alphabétiquement, association avec la définition, accès O(log n).', en: 'Correct! TreeMap<String, String>: keys (words) sorted alphabetically, association with the definition, O(log n) access.' } },
        { text: { fr: 'TreeSet<String>', en: 'TreeSet<String>' }, correct: false, fb: { fr: 'TreeSet stocke des valeurs uniques triées, mais pas d\'association clé→valeur.', en: 'TreeSet stores sorted unique values, but no key→value association.' } },
      ],
    },
    {
      id: 'a13_5', concept: 'c13_2', type: 'bug', xp: 20,
      instr: { fr: 'L\'examinateur te donne ce code Java et dit : "Ce code est censé dédoublonner et trier des étudiants par GPA, mais il ne fonctionne pas comme prévu. Explique pourquoi et corrige-le."', en: 'The examiner gives you this Java code and says: "This code is supposed to deduplicate and sort students by GPA, but it doesn\'t work as expected. Explain why and fix it."' },
      bugCode: `<span class="kw">class</span> <span class="ty">Student</span> {
    <span class="ty">String</span> name; <span class="kw">double</span> gpa;
    <span class="ty">Student</span>(<span class="ty">String</span> n, <span class="kw">double</span> g) { name=n; gpa=g; }
}
<span class="ty">Set</span>&lt;<span class="ty">Student</span>&gt; students = <span class="kw">new</span> <span class="bug-line"><span class="ty">HashSet</span></span>&lt;&gt;();
students.add(<span class="kw">new</span> <span class="ty">Student</span>(<span class="str">"Alice"</span>, <span class="num">3.8</span>));
students.add(<span class="kw">new</span> <span class="ty">Student</span>(<span class="str">"Alice"</span>, <span class="num">3.8</span>)); <span class="cm">// voulu : doublon ignoré</span>
<span class="ty">System</span>.out.println(students.size()); <span class="cm">// voulu : 1, obtenu : 2</span>`,
      explanation: { fr: 'Deux problèmes : (1) HashSet utilise equals() et hashCode() — Student ne les redéfinit pas, donc deux objets "Alice/3.8" distincts en mémoire ne sont pas reconnus comme égaux. Correction : redéfinir equals() et hashCode() dans Student. (2) Pour le tri par GPA, HashSet ne trie pas. Il faut TreeSet avec un Comparator, ou implémenter Comparable<Student>.', en: 'Two problems: (1) HashSet uses equals() and hashCode() — Student doesn\'t override them, so two distinct "Alice/3.8" objects in memory are not recognised as equal. Fix: override equals() and hashCode() in Student. (2) For GPA sorting, HashSet doesn\'t sort. A TreeSet with a Comparator, or implementing Comparable<Student>, is needed.' },
    },
  ],
  homework: {
    fr: `<p>Dans ton dépôt GitHub, crée un dossier <strong>m13/</strong> contenant :</p>
<ol style="margin:.8rem 0 .8rem 2rem;font-size:1.45rem;color:var(--ch2);line-height:2">
  <li>Un <code>README.md</code> — Réponds par écrit à ces 5 questions comme si c'était un oral (définition + exemple + pourquoi + limite) :<br>
    a) Qu'est-ce que l'encapsulation ?<br>
    b) Différence overloading vs overriding ?<br>
    c) Quand choisir une classe abstraite plutôt qu'une interface ?<br>
    d) Qu'arrive-t-il si on n'implémente pas hashCode() avec equals() ?<br>
    e) Quelle collection pour une liste de cours sans doublons, dans l'ordre d'inscription ?
  </li>
  <li>Un fichier de code avec une mini-app qui démontre au moins 3 concepts OOP distincts (pas les mêmes exemples que les modules précédents — invente ton propre contexte).</li>
</ol>`,
    en: `<p>In your GitHub repository, create a folder <strong>m13/</strong> containing:</p>
<ol style="margin:.8rem 0 .8rem 2rem;font-size:1.45rem;color:var(--ch2);line-height:2">
  <li>A <code>README.md</code> — Answer these 5 questions in writing as if it were an oral (definition + example + why + limitation):<br>
    a) What is encapsulation?<br>
    b) Difference between overloading and overriding?<br>
    c) When to choose an abstract class rather than an interface?<br>
    d) What happens if you don't implement hashCode() with equals()?<br>
    e) Which collection for a list of courses without duplicates, in registration order?
  </li>
  <li>A code file with a mini-app demonstrating at least 3 distinct OOP concepts (not the same examples as previous modules — invent your own context).</li>
</ol>`,
  },



  references: [
    { title: { fr: 'W3Schools — Java Quiz', en: 'W3Schools — Java Quiz' }, url: 'https://www.w3schools.com/java/java_quiz.asp', note: { fr: 'Quiz Java interactif pour s\'auto-évaluer', en: 'Interactive Java quiz for self-assessment' } },
    { title: { fr: 'W3Schools — Python Quiz', en: 'W3Schools — Python Quiz' }, url: 'https://www.w3schools.com/python/python_quiz.asp', note: { fr: 'Quiz Python interactif', en: 'Interactive Python quiz' } },
    { title: { fr: 'W3Schools — C# Quiz', en: 'W3Schools — C# Quiz' }, url: 'https://www.w3schools.com/cs/cs_quiz.php', note: { fr: 'Quiz C# interactif', en: 'Interactive C# quiz' } },
    { title: { fr: 'Oracle — Java OOP Tutorial (index)', en: 'Oracle — Java OOP Tutorial (index)' }, url: 'https://docs.oracle.com/javase/tutorial/java/index.html', note: { fr: 'Index complet du tutoriel Java officiel', en: 'Complete index of the official Java tutorial' } },
    { title: { fr: 'Python Docs — Index général', en: 'Python Docs — General Index' }, url: 'https://docs.python.org/3/genindex.html', note: { fr: 'Index de toute la documentation Python', en: 'Index of all Python documentation' } },
    { title: { fr: 'Microsoft Docs — C# Reference', en: 'Microsoft Docs — C# Reference' }, url: 'https://learn.microsoft.com/en-us/dotnet/csharp/language-reference/', note: { fr: 'Référence complète du langage C#', en: 'Complete C# language reference' } },
    { title: { fr: 'cppreference — C++ Reference', en: 'cppreference — C++ Reference' }, url: 'https://en.cppreference.com/w/cpp', note: { fr: 'Référence complète C++', en: 'Complete C++ reference' } },
    { title: { fr: 'The Rust Book', en: 'The Rust Book' }, url: 'https://doc.rust-lang.org/book/', note: { fr: 'Documentation officielle Rust complète', en: 'Complete official Rust documentation' } },
  ],
};