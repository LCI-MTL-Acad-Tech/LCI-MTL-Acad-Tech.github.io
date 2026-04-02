'use strict';
// Session 14 — Débogage & Erreurs
// IDE arc S14: STL containers — vector, map, range-based for, algorithms

const SESSION = {
  id:'s14', num:14, prev:13, next:15, xp:140,
  blocName:{ fr:'Consolidation', en:'Consolidation' },
  blocColor:'#9cf6d4',
  title:{ fr:'Débogage & Erreurs', en:'Debugging & Errors' },
  sub:{ fr:'UE_LOG, Visual Logger, breakpoints VS Code — survivre aux crashes Unreal', en:'UE_LOG, Visual Logger, VS Code breakpoints — surviving Unreal crashes' },

  tutor:{
    concept:{
      fr:`Déboguer en Unreal est différent de Unity. Les crashes C++ donnent des call stacks cryptiques plutôt que des lignes de code claires. UE_LOG est l'outil de base — disponible partout, sans impact en release build. Le Visual Logger capture l'état dans le temps. Les breakpoints dans VS Code (ou Visual Studio) permettent de suspendre l'exécution et d'inspecter les variables. Savoir lire un crash log est une compétence qui s'apprend.`,
      en:`Debugging in Unreal is different from Unity. C++ crashes give cryptic call stacks rather than clear code lines. UE_LOG is the baseline tool — available everywhere, no impact in release builds. The Visual Logger captures state over time. Breakpoints in VS Code (or Visual Studio) let you pause execution and inspect variables. Learning to read a crash log is a skill that takes practice.`
    },
    deep:{
      fr:`<p><strong>Crash Reporter et minidumps.</strong> Quand Unreal crashe complètement, il génère un dossier dans Saved/Crashes/ contenant un .log et parfois un .dmp (minidump). Le .log contient les dernières lignes de log avant le crash — souvent suffisant pour identifier la cause. Le .dmp peut être ouvert dans Visual Studio pour voir la call stack exacte au moment du crash.</p>
<p>La cause la plus fréquente de crash Unreal en C++ : déréférencement d'un pointeur nul ou "pending kill". D'où l'importance d'IsValid() vue en session 6.</p>`,
      en:`<p><strong>Crash Reporter and minidumps.</strong> When Unreal crashes completely, it generates a folder in Saved/Crashes/ containing a .log and sometimes a .dmp (minidump). The .log contains the last log lines before the crash — often enough to identify the cause. The .dmp can be opened in Visual Studio to see the exact call stack at the moment of crash.</p>
<p>The most frequent Unreal C++ crash cause: dereferencing a null or "pending kill" pointer. Hence the importance of IsValid() covered in session 6.</p>`
    }
  },

  ide:{
    demoSteps:[
      {
        label:{ fr:'std::vector — le tableau dynamique STL', en:'std::vector — the STL dynamic array' },
        fr:`#include <vector>. vector<int> scores; scores.push_back(80); scores.push_back(95); scores.push_back(72);. Accès : scores[0], scores.at(1) (avec vérification de bornes). Taille : scores.size(). Range-based for : for(const auto& s : scores) cout << s. Comparable au TArray<T> d'Unreal et à List<T> en C#. L'avantage de at() sur [] : lève une exception si l'index est hors bornes au lieu d'un crash silencieux.`,
        en:`#include <vector>. vector<int> scores; scores.push_back(80); scores.push_back(95); scores.push_back(72);. Access: scores[0], scores.at(1) (with bounds checking). Size: scores.size(). Range-based for: for(const auto& s : scores) cout << s. Comparable to Unreal's TArray<T> and C#'s List<T>. The advantage of at() over []: throws an exception if index is out of bounds instead of a silent crash.`
      },
      {
        label:{ fr:'std::map — dictionnaire clé/valeur', en:'std::map — key/value dictionary' },
        fr:`#include <map>. map<string, int> playerScores; playerScores["Alice"] = 150; playerScores["Bob"] = 200;. Itération : for(const auto& [name, score] : playerScores) cout << name << ": " << score. La décomposition [name, score] est C++17 — structured bindings. map est trié par clé; pour non-trié, utiliser unordered_map. Comparable à TMap<K,V> d'Unreal et Dictionary<K,V> en C#.`,
        en:`#include <map>. map<string, int> playerScores; playerScores["Alice"] = 150; playerScores["Bob"] = 200;. Iteration: for(const auto& [name, score] : playerScores) cout << name << ": " << score. The [name, score] decomposition is C++17 — structured bindings. map is sorted by key; for unsorted, use unordered_map. Comparable to Unreal's TMap<K,V> and C#'s Dictionary<K,V>.`
      },
      {
        label:{ fr:'<algorithm> — sort, find, count_if', en:'<algorithm> — sort, find, count_if' },
        fr:`#include <algorithm>. sort(scores.begin(), scores.end()); — trie le vecteur. auto it = find(scores.begin(), scores.end(), 95); if(it != scores.end()) cout << "Trouvé";. int above80 = count_if(scores.begin(), scores.end(), [](int s){ return s > 80; });. Ce sont des algorithmes génériques qui fonctionnent sur n'importe quel conteneur avec des itérateurs — le C++ standard library way.`,
        en:`#include <algorithm>. sort(scores.begin(), scores.end()); — sorts the vector. auto it = find(scores.begin(), scores.end(), 95); if(it != scores.end()) cout << "Found";. int above80 = count_if(scores.begin(), scores.end(), [](int s){ return s > 80; });. These are generic algorithms that work on any container with iterators — the C++ standard library way.`
      },
    ],
    discussion:[
      { fr:`std::vector vs std::array vs C-style array — quand utiliser lequel ? La taille est-elle connue à la compilation ?`, en:`std::vector vs std::array vs C-style array — when to use which? Is the size known at compile time?` },
    ],
    compare:{
      std:`<span class="cm">// STL — vector et map</span>
#include &lt;vector&gt;
#include &lt;map&gt;
#include &lt;algorithm&gt;

std::<span class="ty">vector</span>&lt;<span class="kw2">int</span>&gt; scores = {<span class="num">80</span>,<span class="num">95</span>,<span class="num">72</span>};
std::<span class="fn2">sort</span>(scores.<span class="fn2">begin</span>(), scores.<span class="fn2">end</span>());

std::<span class="ty">map</span>&lt;std::<span class="ty">string</span>,<span class="kw2">int</span>&gt; db;
db[<span class="str">"Alice"</span>] = <span class="num">150</span>;
<span class="kw2">for</span>(<span class="kw2">auto</span>&amp; [k,v] : db)
    std::cout &lt;&lt; k &lt;&lt; <span class="str">": "</span> &lt;&lt; v;`,
      unreal:`<span class="cm">// Unreal — TArray et TMap</span>
<span class="ty">TArray</span>&lt;<span class="kw2">int32</span>&gt; Scores = {<span class="num">80</span>,<span class="num">95</span>,<span class="num">72</span>};
Scores.<span class="fn2">Sort</span>();

<span class="ty">TMap</span>&lt;<span class="ty">FString</span>,<span class="kw2">int32</span>&gt; DB;
DB.<span class="fn2">Add</span>(<span class="mac">TEXT</span>(<span class="str">"Alice"</span>), <span class="num">150</span>);
<span class="kw2">for</span>(<span class="kw2">auto</span>&amp; [K,V] : DB)
    <span class="mac">UE_LOG</span>(LogTemp,Display,
        <span class="mac">TEXT</span>(<span class="str">"%s: %d"</span>),*K,V);`
    },
    activities:[
      {
        id:'i14_1', type:'predict', xp:15,
        code:`#include &lt;iostream&gt;
#include &lt;vector&gt;
#include &lt;algorithm&gt;
int main() {
    std::vector&lt;int&gt; v = {5, 2, 8, 1, 9, 3};
    std::sort(v.begin(), v.end());
    for(int i = 0; i &lt; 3; i++)
        std::cout &lt;&lt; v[i] &lt;&lt; " ";
    return 0;
}`,
        question:{ fr:`Quelle est la sortie ? Qu'est-ce que sort() fait exactement au vecteur ?`, en:`What is the output? What exactly does sort() do to the vector?` },
        output:`1 2 3 `,
        explanation:{ fr:`sort() trie le vecteur en ordre croissant : {1, 2, 3, 5, 8, 9}. Les 3 premiers éléments sont 1, 2, 3. sort() modifie le vecteur en place — il ne retourne pas de nouveau vecteur. La complexité est O(n log n).`, en:`sort() sorts the vector in ascending order: {1, 2, 3, 5, 8, 9}. The first 3 elements are 1, 2, 3. sort() modifies the vector in place — it doesn't return a new vector. Complexity is O(n log n).` }
      },
      {
        id:'i14_2', type:'cpp', xp:35,
        instr:{ fr:`Écris un programme qui crée une map<string, int> de 4 joueurs avec leurs scores, puis : 1. affiche tous les joueurs et leurs scores. 2. trouve et affiche le joueur avec le score le plus élevé. 3. compte combien de joueurs ont un score supérieur à 100.`, en:`Write a program that creates a map<string, int> of 4 players with their scores, then: 1. prints all players and scores. 2. finds and prints the player with the highest score. 3. counts how many players have a score above 100.` },
        stub:`#include &lt;iostream&gt;
#include &lt;map&gt;
#include &lt;string&gt;
int main() {
    std::map&lt;std::string, int&gt; scores = {
        {"Alice", 150}, {"Bob", 80},
        {"Carol", 200}, {"Dave", 95}
    };
    // 1. affiche tous / print all
    // 2. trouve le max / find max
    // 3. compte > 100 / count > 100
    return 0;
}`,
        hint:{ fr:`Pour le max : initialise un pair<string,int> maxPlayer et itère. Pour compter : utilise une variable int count = 0 et ++count dans la boucle.`, en:`For max: initialize a pair<string,int> maxPlayer and iterate. For counting: use an int count = 0 variable and ++count in the loop.` },
        solution:{
          fr:`<pre style="font-family:var(--mono);font-size:1.3rem;line-height:1.8;color:#e0e8ef">// 1. Tous les joueurs
for(const auto& [name, score] : scores)
    std::cout &lt;&lt; name &lt;&lt; ": " &lt;&lt; score &lt;&lt; std::endl;

// 2. Max
auto maxIt = std::max_element(scores.begin(), scores.end(),
    [](const auto& a, const auto& b){ return a.second &lt; b.second; });
std::cout &lt;&lt; "Max: " &lt;&lt; maxIt-&gt;first &lt;&lt; " (" &lt;&lt; maxIt-&gt;second &lt;&lt; ")" &lt;&lt; std::endl;

// 3. Count
int above = 0;
for(const auto& [n,s] : scores) if(s &gt; 100) above++;
std::cout &lt;&lt; above &lt;&lt; " joueurs &gt; 100" &lt;&lt; std::endl;</pre>`,
          en:`<pre style="font-family:var(--mono);font-size:1.3rem;line-height:1.8;color:#e0e8ef">// 1. All players
for(const auto& [name, score] : scores)
    std::cout &lt;&lt; name &lt;&lt; ": " &lt;&lt; score &lt;&lt; std::endl;

// 2. Max
auto maxIt = std::max_element(scores.begin(), scores.end(),
    [](const auto& a, const auto& b){ return a.second &lt; b.second; });
std::cout &lt;&lt; "Max: " &lt;&lt; maxIt-&gt;first &lt;&lt; " (" &lt;&lt; maxIt-&gt;second &lt;&lt; ")" &lt;&lt; std::endl;

// 3. Count
int above = 0;
for(const auto& [n,s] : scores) if(s &gt; 100) above++;
std::cout &lt;&lt; above &lt;&lt; " players &gt; 100" &lt;&lt; std::endl;</pre>`
        }
      },
      {
        id:'i14_3', type:'bug', xp:20,
        instr:{ fr:`Ce code provoquera un comportement indéfini (probablement un crash). Identifie la cause exacte.`, en:`This code will cause undefined behavior (likely a crash). Identify the exact cause.` },
        bugCode:`#include &lt;vector&gt;
#include &lt;iostream&gt;
<span class="kw2">int</span> main() {
    std::<span class="ty">vector</span>&lt;<span class="kw2">int</span>&gt; v = {<span class="num">1</span>, <span class="num">2</span>, <span class="num">3</span>};
    <span class="kw2">for</span>(<span class="kw2">int</span> i = <span class="num">0</span>; i &lt;= <span class="bug-line">v.size()</span>; i++)
        std::cout &lt;&lt; v[i];
}`,
        explanation:{ fr:`La condition i <= v.size() inclut i == 3. v[3] est un accès hors bornes — comportement indéfini (crash ou valeur aléatoire). v.size() retourne 3, donc la boucle doit être i < v.size() (strictement inférieur). Utiliser v.at(i) aurait lancé une exception out_of_range, plus utile pour le débogage.`, en:`The condition i <= v.size() includes i == 3. v[3] is an out-of-bounds access — undefined behavior (crash or random value). v.size() returns 3, so the loop should be i < v.size() (strictly less than). Using v.at(i) would have thrown an out_of_range exception, more useful for debugging.` }
      },
      {
        id:'i14_4', type:'fill', xp:15,
        instr:{ fr:`Pour itérer sur un vecteur v avec les indices et éviter un accès hors bornes, la condition correcte est :`, en:`To iterate over a vector v with indices and avoid out-of-bounds access, the correct condition is:` },
        template:{ fr:'for(int i = 0; i ______ v.size(); i++)', en:'for(int i = 0; i ______ v.size(); i++)' },
        answer:'<',
        hint:{ fr:`Strictement inférieur — les indices valides vont de 0 à size()-1 inclus`, en:`Strictly less than — valid indices run from 0 to size()-1 inclusive` }
      },
    ],
  },

  engine:{
    demoSteps:[
      {
        label:{ fr:'UE_LOG — catégories et verbosités', en:'UE_LOG — categories and verbosities' },
        fr:`UE_LOG(LogTemp, Display, TEXT("Valeur: %d"), Score); — trois paramètres : catégorie (LogTemp pour tests rapides), verbosité (Display / Warning / Error), message (TEXT() avec formatage printf). Montre les trois verbosités : Display = info blanc, Warning = orange (pas de crash), Error = rouge (pas de crash non plus mais signale un problème grave). Ces logs apparaissent dans la fenêtre Output Log (Window → Output Log).`,
        en:`UE_LOG(LogTemp, Display, TEXT("Value: %d"), Score); — three parameters: category (LogTemp for quick tests), verbosity (Display / Warning / Error), message (TEXT() with printf formatting). Show the three verbosities: Display = white info, Warning = orange (no crash), Error = red (also no crash but signals serious problem). These logs appear in the Output Log window (Window → Output Log).`
      },
      {
        label:{ fr:'Breakpoints dans VS Code', en:'Breakpoints in VS Code' },
        fr:`Dans VS Code avec le projet Unreal ouvert : clique dans la marge gauche d'une ligne pour poser un breakpoint (cercle rouge). Lance Unreal en mode Debug (F5 ou "Launch" dans VS Code). Quand l'exécution atteint le breakpoint, VS Code affiche les variables locales dans le panneau Run and Debug. Montre comment inspecter une FVector ou un TArray. Navigue avec Continue (F5), Step Over (F10), Step Into (F11).`,
        en:`In VS Code with the Unreal project open: click in the left margin of a line to set a breakpoint (red circle). Launch Unreal in Debug mode (F5 or "Launch" in VS Code). When execution hits the breakpoint, VS Code shows local variables in the Run and Debug panel. Show how to inspect an FVector or TArray. Navigate with Continue (F5), Step Over (F10), Step Into (F11).`
      },
      {
        label:{ fr:'Lire un crash log — les 5 premières lignes comptent', en:'Reading a crash log — the first 5 lines matter' },
        fr:`Génère un crash intentionnel : AActor* ptr = nullptr; ptr->GetName();. Ouvre Saved/Logs/MonProjet.log. Montre la section "[Callstack]". Les premières lignes sont les plus récentes — cherche les noms de fonctions qui ressemblent à du code du cours (pas les lignes UEngine::*). La ligne qui contient GetName() ou le nom de l'Actor est souvent la cause directe. La ligne juste au-dessus est l'appelant.`,
        en:`Intentionally generate a crash: AActor* ptr = nullptr; ptr->GetName();. Open Saved/Logs/MyProject.log. Show the "[Callstack]" section. The first lines are most recent — look for function names that resemble course code (not UEngine::* lines). The line containing GetName() or the Actor name is often the direct cause. The line just above is the caller.`
      },
    ],
    discussion:[
      { fr:`En Unity, les erreurs NullReferenceException indiquent une ligne précise. En Unreal C++, les crashes sont souvent moins directs. Quelle stratégie adoptes-tu pour identifier rapidement la source d'un crash ?`, en:`In Unity, NullReferenceException errors point to a precise line. In Unreal C++, crashes are often less direct. What strategy do you adopt to quickly identify the source of a crash?` },
    ],
    compare:{
      cs:`<span class="cm">// Unity — Debug.Log</span>
<span class="ty">Debug</span>.<span class="fn">Log</span>(<span class="str">"Score: "</span> + score);
<span class="ty">Debug</span>.<span class="fn">LogWarning</span>(<span class="str">"HP bas"</span>);
<span class="ty">Debug</span>.<span class="fn">LogError</span>(<span class="str">"Null ref!"</span>);

<span class="cm">// NullRef → ligne précise dans console</span>
<span class="cm">// Breakpoints dans VS / Rider</span>`,
      cpp:`<span class="cm">// Unreal — UE_LOG</span>
<span class="mac">UE_LOG</span>(LogTemp, Display,
    <span class="mac">TEXT</span>(<span class="str">"Score: %d"</span>), Score);
<span class="mac">UE_LOG</span>(LogTemp, Warning,
    <span class="mac">TEXT</span>(<span class="str">"HP bas"</span>));
<span class="mac">UE_LOG</span>(LogTemp, Error,
    <span class="mac">TEXT</span>(<span class="str">"Pointeur nul!"</span>));
<span class="cm">// Crash → Saved/Logs/*.log</span>`
    },
    activities:[
      {
        id:'e14_1', type:'quiz', xp:15,
        q:{ fr:`Quelle est la différence entre UE_LOG(LogTemp, Warning, ...) et UE_LOG(LogTemp, Error, ...) en termes de comportement à l'exécution ?`, en:`What is the difference between UE_LOG(LogTemp, Warning, ...) and UE_LOG(LogTemp, Error, ...) in terms of runtime behavior?` },
        choices:[
          { t:{ fr:`Warning = log orange, ne crashe pas ; Error = crash immédiat`, en:`Warning = orange log, no crash; Error = immediate crash` }, c:false,
            fb:{ fr:`UE_LOG(Error) n'arrête pas l'exécution — il affiche seulement en rouge. Pour crasher intentionnellement, on utilise check() ou ensureAlways().`, en:`UE_LOG(Error) doesn't stop execution — it just displays in red. To intentionally crash, use check() or ensureAlways().` } },
          { t:{ fr:`Les deux affichent dans le log sans crasher — Warning = orange, Error = rouge`, en:`Both display in the log without crashing — Warning = orange, Error = red` }, c:true,
            fb:{ fr:`Correct. UE_LOG ne crashe jamais — c'est uniquement visuel. La différence est la couleur et la gravité signalée. Pour un crash contrôlé : check(condition) crashe si la condition est fausse.`, en:`Correct. UE_LOG never crashes — it's purely visual. The difference is color and severity signaled. For a controlled crash: check(condition) crashes if the condition is false.` } },
          { t:{ fr:`Warning = ignoré en release build ; Error = gardé en release`, en:`Warning = ignored in release build; Error = kept in release` }, c:false,
            fb:{ fr:`Les deux sont ignorés (compilés à rien) en release build par défaut. C'est l'un des avantages d'UE_LOG : aucun coût de performance en release.`, en:`Both are stripped out (compiled to nothing) in release builds by default. That's one advantage of UE_LOG: no performance cost in release.` } },
          { t:{ fr:`Error affiche dans le panneau Details, Warning seulement dans l'Output Log`, en:`Error displays in the Details panel, Warning only in Output Log` }, c:false,
            fb:{ fr:`Les deux apparaissent dans l'Output Log. Le panneau Details affiche les propriétés UPROPERTY(), pas les logs.`, en:`Both appear in the Output Log. The Details panel shows UPROPERTY() properties, not logs.` } },
        ]
      },
      {
        id:'e14_2', type:'fill', xp:20,
        instr:{ fr:`Pour afficher une FString dans UE_LOG, il faut la déréférencer avec l'opérateur * :`, en:`To display an FString in UE_LOG, you need to dereference it with the * operator:` },
        template:{ fr:'UE_LOG(LogTemp, Display, TEXT("%s"), ______MyName);', en:'UE_LOG(LogTemp, Display, TEXT("%s"), ______MyName);' },
        answer:'*',
        hint:{ fr:`FString convertit en TCHAR* avec l'opérateur de déréférencement — nécessaire pour %s dans TEXT()`, en:`FString converts to TCHAR* with the dereference operator — needed for %s in TEXT()` }
      },
      {
        id:'e14_3', type:'bug', xp:30,
        instr:{ fr:`Ce UE_LOG compilera mais ne sera jamais utile pour diagnostiquer un problème. Pourquoi ?`, en:`This UE_LOG will compile but will never be useful for diagnosing a problem. Why?` },
        bugCode:`<span class="kw2">void</span> <span class="fn2">TakeDamage</span>(<span class="kw2">float</span> Amount)
{
    Health -= Amount;
    <span class="kw2">if</span>(Health &lt;= <span class="num">0</span>)
    {
        <span class="bug-line"><span class="mac">UE_LOG</span>(LogTemp, Error,
            <span class="mac">TEXT</span>(<span class="str">"Mort"</span>));</span>
        <span class="fn2">Die</span>();
    }
}`,
        explanation:{ fr:`Le message "Mort" n'inclut aucune information contextuelle : quel Actor ? quel montant de dégâts ? à quelle santé ? Un log utile inclurait au minimum : UE_LOG(LogTemp, Warning, TEXT("%s mort — dégâts: %.1f, santé finale: %.1f"), *GetName(), Amount, Health). Sans contexte, le log confirme qu'un Actor est mort mais n'aide pas à diagnostiquer pourquoi ou lequel.`, en:`The message "Dead" includes no contextual information: which Actor? what damage amount? at what health? A useful log would include at minimum: UE_LOG(LogTemp, Warning, TEXT("%s dead — damage: %.1f, final health: %.1f"), *GetName(), Amount, Health). Without context, the log confirms an Actor died but doesn't help diagnose why or which one.` }
      },
      {
        id:'e14_4', type:'engine', xp:40,
        label:{ fr:'Dans Unreal', en:'In Unreal' },
        task:{ fr:`1. Dans le Collectible de la session 12, ajoute des UE_LOG à chaque étape clé : BeginPlay (l'actor est prêt), OnOverlap (quel Actor l'a touché, son nom), juste avant Destroy(). Utilise Display pour l'info normale, Warning si l'Actor qui overlap n'est pas un Character. 2. Place 3 instances dans la scène. Dans l'Output Log, filtre par "LogTemp" et joue. Lis les logs dans l'ordre pour reconstituer ce qui s'est passé. 3. Pose un breakpoint dans OnOverlap avec VS Code, relance en mode Debug, et inspecte la variable Other.`, en:`1. In the Collectible from session 12, add UE_LOG at each key step: BeginPlay (actor is ready), OnOverlap (which Actor touched it, its name), just before Destroy(). Use Display for normal info, Warning if the overlapping Actor isn't a Character. 2. Place 3 instances in the scene. In the Output Log, filter by "LogTemp" and play. Read the logs in order to reconstruct what happened. 3. Set a breakpoint in OnOverlap with VS Code, relaunch in Debug mode, and inspect the Other variable.` },
        note:{ fr:`Le trio UE_LOG + filtre Output Log + breakpoint couvre 90% des problèmes de débogage courants en Unreal C++.`, en:`The trio UE_LOG + Output Log filter + breakpoint covers 90% of common Unreal C++ debugging problems.` }
      },
    ],
  },

  homework:{
    core:[
      {diff:'easy', fr:'Crée un vector<string> de 5 noms. Trie-les avec std::sort, cherche-en un avec std::find, et supprime-en un avec l\'idiome erase-remove.', en:'Create a vector<string> of 5 names. Sort them with std::sort, search one with std::find, and remove one with the erase-remove idiom.'},
      {diff:'medium', fr:'Crée un map<string, int> de scores de joueurs. Trouve le joueur avec le score max avec std::max_element. Filtre les scores > 100 avec une lambda dans std::copy_if.', en:'Create a map<string, int> of player scores. Find the player with the max score using std::max_element. Filter scores > 100 with a lambda in std::copy_if.'},
      {diff:'hard', fr:'Implémente un leaderboard : vector de paires (nom, score), trié par score décroissant. Permets d\'ajouter, de mettre à jour, et de supprimer des entrées. Utilise uniquement les algorithmes STL.', en:'Implement a leaderboard: vector of pairs (name, score), sorted by descending score. Allow adding, updating, and removing entries. Use only STL algorithms.'},
    ],
    ide:[
      {diff:'medium', fr:'Pose un breakpoint dans VS Code dans une boucle sur un vector. Lance en mode Debug. Inspecte le vecteur entier dans le panneau Variables. Avance avec Step Over.', en:'Set a breakpoint in VS Code inside a loop over a vector. Launch in Debug mode. Inspect the full vector in the Variables panel. Step through with Step Over.'},
    ],
    engine:[
      {diff:'medium', fr:'Ajoute des UE_LOG dans ton Collectible de la session 12 à chaque étape : BeginPlay, OnOverlap (avec le nom de l\'actor), Destroy(). Filtre par LogTemp dans l\'Output Log.', en:'Add UE_LOG to your Session 12 Collectible at each step: BeginPlay, OnOverlap (with the actor\'s name), Destroy(). Filter by LogTemp in the Output Log.'},
    ],
  },
};
document.addEventListener('DOMContentLoaded',()=>{});
