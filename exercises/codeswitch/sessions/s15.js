'use strict';
// Session 15 — Mini-Projet
// IDE arc S15: full small program — STL containers + templates + classes + file structure

const SESSION = {
  id:'s15', num:15, prev:14, next:null, xp:200,
  blocName:{ fr:'Consolidation', en:'Consolidation' },
  blocColor:'#9cf6d4',
  title:{ fr:'Mini-Projet', en:'Mini-Project' },
  sub:{ fr:'Un collectible C++ complet — toutes les sessions réunies', en:'A complete C++ collectible — all sessions combined' },

  tutor:{
    concept:{
      fr:`Ce mini-projet synthétise les 14 sessions précédentes. Côté IDE : un petit programme multi-fichiers avec classes, templates, et STL — un système de score qui collecte, trie, et affiche des entrées. Côté moteur : un collectible Unreal Engine C++ complet — USphereComponent, overlap, rotation dans Tick(), signal au GameMode, destruction propre. Deux projets autonomes qui utilisent chacun tout ce qui a été vu dans leur parcours respectif.`,
      en:`This mini-project synthesizes the previous 14 sessions. IDE side: a small multi-file program with classes, templates, and STL — a score system that collects, sorts, and displays entries. Engine side: a complete Unreal Engine C++ collectible — USphereComponent, overlap, rotation in Tick(), signal to GameMode, clean destruction. Two standalone projects each using everything covered in their respective path.`
    },
    deep:{
      fr:`<p><strong>Ce que tu peux faire maintenant.</strong> Avec ces 15 sessions, tu as les fondements pour :</p>
<p>IDE : écrire du C++ idiomatique multi-fichiers avec classes, héritage, templates, et STL. Compiler, déboguer avec g++, et lire les erreurs du compilateur.<br>
Moteur : créer des Actors Unreal C++ complets avec Components, UPROPERTY/UFUNCTION, overlap, Tick, et communication Blueprint↔C++.</p>
<p>La prochaine étape naturelle : les systèmes Gameplay (GameMode, GameState, PlayerState), le réseau (Replication), et les interfaces de jeu (HUD, UMG). Ces sujets s'appuient directement sur tout ce que tu viens d'apprendre.</p>`,
      en:`<p><strong>What you can do now.</strong> With these 15 sessions, you have the foundations to:</p>
<p>IDE: write idiomatic multi-file C++ with classes, inheritance, templates, and STL. Compile, debug with g++, and read compiler errors.<br>
Engine: create complete Unreal C++ Actors with Components, UPROPERTY/UFUNCTION, overlap, Tick, and Blueprint↔C++ communication.</p>
<p>The natural next step: Gameplay systems (GameMode, GameState, PlayerState), networking (Replication), and game interfaces (HUD, UMG). These topics build directly on everything you've just learned.</p>`
    }
  },

  ide:{
    demoSteps:[
      {
        label:{ fr:'Architecture du mini-projet IDE', en:'IDE mini-project architecture' },
        fr:`Trois fichiers : scoreboard.h (classe template Scoreboard<T>), scoreboard.cpp (implémentations), main.cpp (programme principal). Scoreboard<T> contient un vector<pair<string,T>> entries, des méthodes addEntry(name, score), getTop(n), et printAll(). La méthode getTop(n) utilise std::sort avec un comparateur lambda. Ce projet réunit classes, templates, STL, et multi-fichiers en moins de 80 lignes.`,
        en:`Three files: scoreboard.h (template class Scoreboard<T>), scoreboard.cpp (implementations), main.cpp (main program). Scoreboard<T> contains a vector<pair<string,T>> entries, methods addEntry(name, score), getTop(n), and printAll(). The getTop(n) method uses std::sort with a lambda comparator. This project combines classes, templates, STL, and multi-file in under 80 lines.`
      },
      {
        label:{ fr:'Implémente Scoreboard<T> en live', en:'Implement Scoreboard<T> live' },
        fr:`Dans scoreboard.h (tout dans le .h — les templates l'exigent) : template<typename T> class Scoreboard { vector<pair<string,T>> entries; public: void addEntry(const string& name, T score) { entries.push_back({name, score}); } vector<pair<string,T>> getTop(int n) { auto sorted = entries; sort(sorted.begin(), sorted.end(), [](const auto& a, const auto& b){ return a.second > b.second; }); sorted.resize(min(n,(int)sorted.size())); return sorted; } };`,
        en:`In scoreboard.h (all in .h — templates require it): template<typename T> class Scoreboard { vector<pair<string,T>> entries; public: void addEntry(const string& name, T score) { entries.push_back({name, score}); } vector<pair<string,T>> getTop(int n) { auto sorted = entries; sort(sorted.begin(), sorted.end(), [](const auto& a, const auto& b){ return a.second > b.second; }); sorted.resize(min(n,(int)sorted.size())); return sorted; } };`
      },
      {
        label:{ fr:'Teste avec int et float', en:'Test with int and float' },
        fr:`Dans main.cpp : Scoreboard<int> board; board.addEntry("Alice", 150); board.addEntry("Bob", 230); board.addEntry("Carol", 190);. auto top2 = board.getTop(2); for(const auto& [name, score] : top2) cout << name << ": " << score << endl;. Sortie : Bob: 230, Carol: 190. Réutilise immédiatement Scoreboard<float> avec des précisions différentes — montre la puissance des templates.`,
        en:`In main.cpp: Scoreboard<int> board; board.addEntry("Alice", 150); board.addEntry("Bob", 230); board.addEntry("Carol", 190);. auto top2 = board.getTop(2); for(const auto& [name, score] : top2) cout << name << ": " << score << endl;. Output: Bob: 230, Carol: 190. Immediately reuse Scoreboard<float> with different precisions — shows the power of templates.`
      },
    ],
    discussion:[
      { fr:`Ton programme IDE final utilise des templates, des containers STL, des classes avec séparation .h/.cpp, des lambdas, et des range-based for. Lesquels de ces concepts t'ont semblé les plus différents de C# Unity — et lesquels étaient en fait familiers ?`, en:`Your final IDE program uses templates, STL containers, classes with .h/.cpp separation, lambdas, and range-based for. Which of these concepts felt most different from Unity C# — and which were actually familiar?` },
    ],
    compare:{
      std:`<span class="cm">// C++ — Scoreboard template</span>
<span class="kw2">template</span>&lt;<span class="kw2">typename</span> T&gt;
<span class="kw2">class</span> <span class="ty">Scoreboard</span> {
    std::<span class="ty">vector</span>&lt;
        std::<span class="ty">pair</span>&lt;std::<span class="ty">string</span>,T&gt;
    &gt; entries;
<span class="kw2">public</span>:
    <span class="kw2">void</span> <span class="fn2">addEntry</span>(<span class="kw2">const</span> std::<span class="ty">string</span>&amp; n,
                 T score);
    <span class="ty">vector</span>&lt;...&gt; <span class="fn2">getTop</span>(<span class="kw2">int</span> n);
};`,
      unreal:`<span class="cm">// Unreal — TMap pour leaderboard</span>
<span class="mac">UPROPERTY</span>()
<span class="ty">TMap</span>&lt;<span class="ty">FString</span>,<span class="kw2">int32</span>&gt; Scores;

<span class="mac">UFUNCTION</span>(BlueprintCallable)
<span class="kw2">void</span> <span class="fn2">AddScore</span>(
    <span class="ty">FString</span> Name,
    <span class="kw2">int32</span> Points)
{
    Scores.<span class="fn2">Add</span>(Name, Points);
}`
    },
    activities:[
      {
        id:'i15_1', type:'cpp', xp:50,
        instr:{ fr:`Complète Scoreboard<T> en ajoutant une méthode bool hasEntry(const string& name) const qui retourne true si un joueur existe déjà dans le classement. Utilise std::find_if avec une lambda. Teste avec hasEntry("Alice") (true) et hasEntry("Dave") (false) sur le Scoreboard de la démo.`, en:`Complete Scoreboard<T> by adding a bool hasEntry(const string& name) const method that returns true if a player already exists in the scoreboard. Use std::find_if with a lambda. Test with hasEntry("Alice") (true) and hasEntry("Dave") (false) on the demo Scoreboard.` },
        stub:`#include &lt;iostream&gt;
#include &lt;vector&gt;
#include &lt;string&gt;
#include &lt;algorithm&gt;
template&lt;typename T&gt;
class Scoreboard {
    std::vector&lt;std::pair&lt;std::string,T&gt;&gt; entries;
public:
    void addEntry(const std::string& name, T score) {
        entries.push_back({name, score});
    }
    bool hasEntry(const std::string& name) const {
        // utilise std::find_if et une lambda
        // use std::find_if and a lambda
    }
};
int main() {
    Scoreboard&lt;int&gt; board;
    board.addEntry("Alice", 150);
    board.addEntry("Bob", 230);
    std::cout &lt;&lt; board.hasEntry("Alice") &lt;&lt; " ";  // 1
    std::cout &lt;&lt; board.hasEntry("Dave") &lt;&lt; std::endl; // 0
    return 0;
}`,
        hint:{ fr:`std::find_if(entries.begin(), entries.end(), [&name](const auto& e){ return e.first == name; }) != entries.end()`, en:`std::find_if(entries.begin(), entries.end(), [&name](const auto& e){ return e.first == name; }) != entries.end()` },
        solution:{
          fr:`<pre style="font-family:var(--mono);font-size:1.3rem;line-height:1.8;color:#e0e8ef">bool hasEntry(const std::string& name) const {
    return std::find_if(
        entries.begin(), entries.end(),
        [&name](const auto& e){
            return e.first == name;
        }
    ) != entries.end();
}</pre><p style="margin-top:.8rem;font-size:1.4rem;color:var(--ch2)">Sortie : <code>1 0</code> (true, false)</p>`,
          en:`<pre style="font-family:var(--mono);font-size:1.3rem;line-height:1.8;color:#e0e8ef">bool hasEntry(const std::string& name) const {
    return std::find_if(
        entries.begin(), entries.end(),
        [&name](const auto& e){
            return e.first == name;
        }
    ) != entries.end();
}</pre><p style="margin-top:.8rem;font-size:1.4rem;color:var(--ch2)">Output: <code>1 0</code> (true, false)</p>`
        }
      },
      {
        id:'i15_2', type:'predict', xp:25,
        code:`#include &lt;iostream&gt;
#include &lt;vector&gt;
#include &lt;algorithm&gt;
int main() {
    std::vector&lt;int&gt; v = {3,1,4,1,5,9,2,6};
    v.erase(std::remove(v.begin(), v.end(), 1), v.end());
    std::cout &lt;&lt; v.size() &lt;&lt; ": ";
    for(int x : v) std::cout &lt;&lt; x &lt;&lt; " ";
}`,
        question:{ fr:`Quelle est la sortie ? Qu'est-ce que le pattern remove+erase fait exactement ?`, en:`What is the output? What does the remove+erase pattern do exactly?` },
        output:`6: 3 4 5 9 2 6 `,
        explanation:{ fr:`std::remove() déplace les éléments non-1 vers le début du vecteur et retourne un itérateur vers la "nouvelle fin" — mais ne réduit pas le vecteur. erase() supprime physiquement les éléments de cet itérateur à la fin. Le résultat : les deux 1 sont supprimés, taille passe de 8 à 6. C'est l'idiome "erase-remove" — le moyen standard de supprimer par valeur d'un vector.`, en:`std::remove() moves non-1 elements toward the vector's beginning and returns an iterator to the "new end" — but doesn't shrink the vector. erase() physically removes elements from that iterator to the end. Result: both 1s are removed, size goes from 8 to 6. This is the "erase-remove" idiom — the standard way to remove by value from a vector.` }
      },
      {
        id:'i15_3', type:'bug', xp:25,
        instr:{ fr:`Ce programme multi-fichiers ne compilera pas. Identifie l'erreur architecturale.`, en:`This multi-file program won't compile. Identify the architectural error.` },
        bugCode:`<span class="cm">// utils.h</span>
<span class="mac">#pragma once</span>
<span class="kw2">template</span>&lt;<span class="kw2">typename</span> T&gt;
T <span class="fn2">square</span>(T v);  <span class="cm">// déclaration seulement</span>

<span class="cm">// utils.cpp</span>
#include <span class="str">"utils.h"</span>
<span class="kw2">template</span>&lt;<span class="kw2">typename</span> T&gt;
T <span class="fn2">square</span>(T v) { <span class="kw2">return</span> v * v; }

<span class="cm">// main.cpp</span>
#include <span class="str">"utils.h"</span>
<span class="kw2">int</span> main() {
    <span class="bug-line">std::cout &lt;&lt; <span class="fn2">square</span>(<span class="num">4</span>);</span>
}`,
        explanation:{ fr:`Les templates doivent être entièrement définis dans le .h — pas déclarés dans le .h et définis dans un .cpp séparé. Le compilateur doit voir l'implémentation complète pour générer la version concrète (square<int>, square<float>…). Solution : mettre toute l'implémentation template dans utils.h, et supprimer utils.cpp. C'est pourquoi les classes template comme std::vector sont entièrement dans les headers.`, en:`Templates must be fully defined in the .h — not declared in .h and defined in a separate .cpp. The compiler needs to see the complete implementation to generate the concrete version (square<int>, square<float>…). Solution: put the entire template implementation in utils.h, and remove utils.cpp. That's why template classes like std::vector are entirely in headers.` }
      },
    ],
  },

  engine:{
    demoSteps:[
      {
        label:{ fr:'Architecture du Collectible final', en:'Final Collectible architecture' },
        fr:`Revue des composants du Collectible complet : USphereComponent (RootComponent, collision Overlap/Pawn), UStaticMeshComponent (attaché au root, mesh visible), float RotationSpeed = 90.0f (UPROPERTY EditAnywhere), bool bCollected = false (protège contre double-collect). Dans BeginPlay() : AddDynamic pour l'overlap. Dans Tick() : rotation. Dans OnOverlap() : vérification, signal au GameMode, Destroy().`,
        en:`Review of the final Collectible's components: USphereComponent (RootComponent, Overlap/Pawn collision), UStaticMeshComponent (attached to root, visible mesh), float RotationSpeed = 90.0f (UPROPERTY EditAnywhere), bool bCollected = false (protects against double-collect). In BeginPlay(): AddDynamic for overlap. In Tick(): rotation. In OnOverlap(): check, signal to GameMode, Destroy().`
      },
      {
        label:{ fr:'Signal au GameMode — architecture propre', en:'Signal to GameMode — clean architecture' },
        fr:`Dans OnOverlap() : AMyGameMode* GM = Cast<AMyGameMode>(GetWorld()->GetAuthGameMode()); if(GM) GM->OnItemCollected();. Dans MyGameMode.h : int32 Score = 0; void OnItemCollected() { Score++; UE_LOG(LogTemp, Display, TEXT("Score: %d"), Score); }. Le Collectible ne connaît pas le HUD — il parle au GameMode qui est le seul responsable du score. Architecture de responsabilité unique.`,
        en:`In OnOverlap(): AMyGameMode* GM = Cast<AMyGameMode>(GetWorld()->GetAuthGameMode()); if(GM) GM->OnItemCollected();. In MyGameMode.h: int32 Score = 0; void OnItemCollected() { Score++; UE_LOG(LogTemp, Display, TEXT("Score: %d"), Score); }. The Collectible doesn't know about the HUD — it talks to the GameMode which is solely responsible for the score. Single responsibility architecture.`
      },
      {
        label:{ fr:'Revue complète — tout ce que tu as appris', en:'Full review — everything you\'ve learned' },
        fr:`Ouvre le Collectible final et parcours le code en identifiant les sessions d'origine de chaque concept : S05 (headers .h/.cpp), S06 (mémoire/GC/UPROPERTY), S07 (AActor/UCLASS/GENERATED_BODY), S08 (UPROPERTY/UFUNCTION), S09 (BeginPlay/Tick/DeltaTime), S10 (CreateDefaultSubobject/Components), S12 (overlap/AddDynamic), S14 (UE_LOG). Chaque ligne correspond à quelque chose qu'on a vu progressivement.`,
        en:`Open the final Collectible and walk through the code identifying each concept's origin session: S05 (headers .h/.cpp), S06 (memory/GC/UPROPERTY), S07 (AActor/UCLASS/GENERATED_BODY), S08 (UPROPERTY/UFUNCTION), S09 (BeginPlay/Tick/DeltaTime), S10 (CreateDefaultSubobject/Components), S12 (overlap/AddDynamic), S14 (UE_LOG). Every line corresponds to something we saw progressively.`
      },
    ],
    discussion:[
      { fr:`En comparant ton script Unity le plus complexe avec le Collectible Unreal C++ que tu viens de créer — qu'est-ce qui est fondamentalement différent, et qu'est-ce qui est en fait la même chose sous une syntaxe différente ?`, en:`Comparing your most complex Unity script with the Unreal C++ Collectible you just created — what is fundamentally different, and what is actually the same thing under different syntax?` },
    ],
    compare:{
      cs:`<span class="cm">// Unity — collectible simplifié</span>
<span class="kw">void</span> <span class="fn">OnTriggerEnter</span>(
    <span class="ty">Collider</span> other)
{
    <span class="kw">if</span>(other.<span class="fn">CompareTag</span>(<span class="str">"Player"</span>))
    {
        <span class="ty">GameManager</span>.instance
            .<span class="fn">AddScore</span>(<span class="num">1</span>);
        <span class="fn">Destroy</span>(gameObject);
    }
}`,
      cpp:`<span class="cm">// Unreal — collectible C++</span>
<span class="kw2">void</span> <span class="fn2">OnOverlap</span>(...)
{
    <span class="kw2">if</span>(bCollected) <span class="kw2">return</span>;
    <span class="kw2">if</span>(!<span class="fn2">Cast</span>&lt;<span class="ty">ACharacter</span>&gt;(Other)) <span class="kw2">return</span>;
    bCollected = <span class="kw2">true</span>;
    <span class="kw2">auto</span>* GM = <span class="fn2">Cast</span>&lt;<span class="ty">AMyGM</span>&gt;(
        GetWorld()-&gt;<span class="fn2">GetAuthGameMode</span>());
    <span class="kw2">if</span>(GM) GM-&gt;<span class="fn2">OnItemCollected</span>();
    <span class="fn2">Destroy</span>();
}`
    },
    activities:[
      {
        id:'e15_1', type:'engine', xp:80,
        label:{ fr:'Dans Unreal — projet complet', en:'In Unreal — full project' },
        task:{ fr:`Construis le Collectible C++ complet en partant de zéro :\n1. Crée ACollectible (AActor C++). Dans le .h : USphereComponent*, UStaticMeshComponent*, float RotationSpeed = 90.0f (EditAnywhere), bool bCollected = false.\n2. Dans le constructeur : CreateDefaultSubobject pour les deux components. SetRootComponent(Sphere). Mesh->SetupAttachment(Sphere). Collision Overlap sur ECC_Pawn.\n3. Dans BeginPlay() : AddDynamic vers OnOverlap (UFUNCTION).\n4. Dans Tick() : AddActorLocalRotation(FRotator(0, RotationSpeed * DeltaTime, 0)).\n5. Dans OnOverlap() : guard bCollected, Cast<ACharacter>, signal au GameMode, Destroy().\n6. Crée AMyGameMode avec int32 Score et void OnItemCollected().\n7. Place 5 collectibles dans la scène avec le Third Person Character. Collecte-les tous et vérifie les logs.`, en:`Build the complete C++ Collectible from scratch:\n1. Create ACollectible (C++ AActor). In .h: USphereComponent*, UStaticMeshComponent*, float RotationSpeed = 90.0f (EditAnywhere), bool bCollected = false.\n2. In constructor: CreateDefaultSubobject for both components. SetRootComponent(Sphere). Mesh->SetupAttachment(Sphere). Overlap collision on ECC_Pawn.\n3. In BeginPlay(): AddDynamic toward OnOverlap (UFUNCTION).\n4. In Tick(): AddActorLocalRotation(FRotator(0, RotationSpeed * DeltaTime, 0)).\n5. In OnOverlap(): guard bCollected, Cast<ACharacter>, signal GameMode, Destroy().\n6. Create AMyGameMode with int32 Score and void OnItemCollected().\n7. Place 5 collectibles in the scene with the Third Person Character. Collect them all and verify logs.` },
        note:{ fr:`Ce projet réunit tout ce que tu as appris en 15 sessions. Prends le temps de reconnaître chaque concept dans le code final.`, en:`This project brings together everything you've learned over 15 sessions. Take time to recognize each concept in the final code.` }
      },
      {
        id:'e15_2', type:'reflect', xp:30,
        prompt:{ fr:`Ton Collectible Unreal C++ est terminé. Identifie trois décisions d'architecture que tu as prises (ex. pourquoi bCollected, pourquoi signaler le GameMode plutôt que le HUD directement, pourquoi RotationSpeed est UPROPERTY). Pour chaque décision, explique ce que ça change et quel problème ça évite.`, en:`Your Unreal C++ Collectible is done. Identify three architecture decisions you made (e.g. why bCollected, why signal the GameMode rather than the HUD directly, why RotationSpeed is UPROPERTY). For each decision, explain what it changes and what problem it avoids.` }
      },
      {
        id:'e15_3', type:'quiz', xp:20,
        q:{ fr:`Dans le Collectible final, pourquoi vérifier bCollected = true avant d'appeler le GameMode ?`, en:`In the final Collectible, why check bCollected = true before calling the GameMode?` },
        choices:[
          { t:{ fr:`Pour des raisons de performance — éviter un Cast inutile`, en:`For performance reasons — avoiding an unnecessary Cast` }, c:false,
            fb:{ fr:`La performance n'est pas la raison principale. Le problème est fonctionnel.`, en:`Performance isn't the main reason. The problem is functional.` } },
          { t:{ fr:`Pour éviter que l'overlap soit déclenché plusieurs fois avant que Destroy() prenne effet`, en:`To prevent the overlap from being triggered multiple times before Destroy() takes effect` }, c:true,
            fb:{ fr:`Correct. Destroy() n'est pas instantané — le frame peut déclencher plusieurs overlaps avant la destruction. Sans bCollected, le score pourrait être incrémenté plusieurs fois pour un seul objet.`, en:`Correct. Destroy() isn't instantaneous — the frame can trigger multiple overlaps before destruction. Without bCollected, the score could be incremented multiple times for a single object.` } },
          { t:{ fr:`Pour compatibilité réseau`, en:`For network compatibility` }, c:false,
            fb:{ fr:`bCollected aide aussi en réseau, mais la raison principale est le comportement single-player : plusieurs overlaps dans le même frame.`, en:`bCollected also helps in networking, but the main reason is single-player behavior: multiple overlaps in the same frame.` } },
          { t:{ fr:`Parce que IsValid() ne suffit pas`, en:`Because IsValid() isn't enough` }, c:false,
            fb:{ fr:`IsValid() vérifie la nullité et le pending kill — bCollected est une garde logique métier séparée.`, en:`IsValid() checks for null and pending kill — bCollected is a separate business logic guard.` } },
        ]
      },
    ],
  },

  homework:{
    core:[
      {diff:'easy', fr:'Complète le Scoreboard<T> de la session avec une méthode updateScore(string name, T score) : si le joueur existe, met à jour son score ; sinon, l\'ajoute.', en:'Complete the session\'s Scoreboard<T> with an updateScore(string name, T score) method: if the player exists, update their score; otherwise, add them.'},
      {diff:'medium', fr:'Étends le Scoreboard pour charger et sauvegarder les scores dans un fichier texte avec <fstream>. Format : une ligne par joueur, \'nom score\'.', en:'Extend the Scoreboard to load and save scores to a text file with <fstream>. Format: one line per player, \'name score\'.'},
      {diff:'hard', fr:'Ajoute un système de rang au Scoreboard : Bronze (< 100), Argent (100–499), Or (≥ 500). Affiche le rang à côté de chaque score. Utilise un enum class Rank.', en:'Add a rank system to the Scoreboard: Bronze (< 100), Silver (100–499), Gold (≥ 500). Display the rank next to each score. Use an enum class Rank.'},
    ],
    ide:[
      {diff:'hard', fr:'Compile ton Scoreboard final avec g++ -Wall -Wextra -std=c++17 -O2. Résous tous les warnings. Mesure le temps d\'exécution avec <chrono> sur 10 000 insertions.', en:'Compile your final Scoreboard with g++ -Wall -Wextra -std=c++17 -O2. Fix all warnings. Measure execution time with <chrono> on 10 000 insertions.'},
    ],
    engine:[
      {diff:'hard', fr:'Étends le Collectible de la session 15 pour signaler le score à un HUD Blueprint via un BlueprintImplementableEvent. Crée un Widget Blueprint minimal qui affiche le score en temps réel.', en:'Extend the Session 15 Collectible to signal the score to a HUD Blueprint via a BlueprintImplementableEvent. Create a minimal Widget Blueprint that displays the score in real time.'},
    ],
  },
};
document.addEventListener('DOMContentLoaded',()=>{});
