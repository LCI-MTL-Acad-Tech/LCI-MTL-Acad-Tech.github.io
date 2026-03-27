'use strict';
// Session 14 — Débogage & Erreurs Courantes

const SESSION = {
  id:        's14',
  num:       14,
  prev:      13,
  next:      15,
  xp:        140,
  blocName:  { fr:'Consolidation', en:'Consolidation' },
  blocColor: '#9cf6d4',
  title:     { fr:'Débogage & Erreurs Courantes', en:'Debugging & Common Errors' },
  sub:       { fr:'Lire les logs Unreal, survivre aux crashes', en:'Reading Unreal logs, surviving crashes' },

  tutor: {
    concept: {
      fr:`C++ donne des messages d'erreur plus cryptiques que C#. Les crashes Unreal ont souvent une call stack. Mais Unreal a des outils puissants : UE_LOG, le Output Log, les breakpoints dans l'IDE, et les macros d'assertion. Cette session donne les réflexes de débogage qui font gagner des heures.`,
      en:`C++ gives more cryptic error messages than C#. Unreal crashes often have a call stack. But Unreal has powerful tools: UE_LOG, the Output Log, IDE breakpoints, and assertion macros. This session builds the debugging reflexes that save hours.`
    },
    demoSteps: [
      {
        label: { fr:'UE_LOG — ton meilleur ami', en:'UE_LOG — your best friend' },
        fr:`UE_LOG(LogTemp, Warning, TEXT("Health = %d"), Health). Équivalent de Debug.Log en Unity, mais avec des niveaux (Display, Warning, Error) et des catégories. Montre comment filtrer dans le Output Log pour ne voir que ses propres logs. Montre aussi les formats : %d (entier), %f (float), %s (string). Pour les FStrings : *MyString (déréférence en TCHAR*).`,
        en:`UE_LOG(LogTemp, Warning, TEXT("Health = %d"), Health). Equivalent of Debug.Log in Unity, but with levels (Display, Warning, Error) and categories. Show how to filter in the Output Log to see only your own logs. Also show formats: %d (int), %f (float), %s (string). For FStrings: *MyString (dereference to TCHAR*).`
      },
      {
        label: { fr:'Lire une call stack de crash', en:'Reading a crash call stack' },
        fr:`Génère intentionnellement un crash (déréférencer nullptr). Montre le crash reporter Unreal. Explique comment lire la call stack de bas en haut : la cause du crash est souvent tout en bas, les fonctions au-dessus sont le chemin qui y a mené. Les numéros de ligne permettent d'aller directement au code incriminé dans l'IDE.`,
        en:`Intentionally generate a crash (dereference nullptr). Show Unreal's crash reporter. Explain reading the call stack bottom to top: the crash cause is often at the bottom, functions above are the path that led there. Line numbers let you jump directly to the offending code in the IDE.`
      },
      {
        label: { fr:'ensure() et check() — assertions Unreal', en:'ensure() and check() — Unreal assertions' },
        fr:`check(MyActor != nullptr) : si la condition est fausse, crash immédiat avec un message clair. ensure(MyActor != nullptr) : log un warning mais ne crash pas — le code continue. Analogie : check() = Debug.Assert avec crash, ensure() = Debug.Assert avec juste un log. Montrer dans quel ordre les utiliser : ensure() pour les conditions "anormales mais récupérables", check() pour les invariants absolus.`,
        en:`check(MyActor != nullptr): if condition is false, immediate crash with a clear message. ensure(MyActor != nullptr): logs a warning but doesn't crash — code continues. Analogy: check() = Debug.Assert with crash, ensure() = Debug.Assert with just a log. Show when to use each: ensure() for "abnormal but recoverable" conditions, check() for absolute invariants.`
      },
      {
        label: { fr:'Erreurs de compilation courantes', en:'Common compilation errors' },
        fr:`Tour rapide des 5 erreurs de compilation les plus fréquentes : (1) GENERATED_BODY() manquant, (2) include du .generated.h pas en dernier, (3) BlueprintReadWrite sur private sans AllowPrivateAccess, (4) fonction non-const appelée sur un objet const, (5) oubli du #pragma once. Montre un exemple et la correction pour chacune.`,
        en:`Quick tour of the 5 most frequent compilation errors: (1) missing GENERATED_BODY(), (2) .generated.h include not last, (3) BlueprintReadWrite on private without AllowPrivateAccess, (4) non-const function called on const object, (5) missing #pragma once. Show an example and fix for each.`
      },
    ],
    discussion: [
      {
        fr:`Quelle est la différence entre un Warning et une Error dans le Output Log Unreal ? Pourquoi les Warnings méritent-ils attention même si le jeu tourne ?`,
        en:`What's the difference between a Warning and an Error in the Unreal Output Log? Why do Warnings deserve attention even if the game runs?`
      },
    ],
    deep: {
      fr:`<p><strong>Unreal Insights et le profilage.</strong> Quand le jeu lag, UE_LOG ne suffit pas. Unreal Insights est le profiler intégré qui montre le temps passé dans chaque fonction, chaque frame. Ajoute <code>TRACE_CPUPROFILER_EVENT_SCOPE(NomDeLaFonction)</code> pour que ta fonction apparaisse dans le profiler.</p>
<p>La commande console <code>stat game</code> en jeu donne une vue rapide des temps de frame. <code>stat unit</code> montre CPU vs GPU vs Game thread. Règle : ne jamais optimiser sans profiler d'abord — les hypothèses sur les bottlenecks sont presque toujours fausses.</p>`,
      en:`<p><strong>Unreal Insights and profiling.</strong> When the game lags, UE_LOG isn't enough. Unreal Insights is the built-in profiler showing time spent in each function, each frame. Add <code>TRACE_CPUPROFILER_EVENT_SCOPE(FunctionName)</code> to make your function appear in the profiler.</p>
<p>The in-game console command <code>stat game</code> gives a quick frame time overview. <code>stat unit</code> shows CPU vs GPU vs Game thread. Rule: never optimize without profiling first — assumptions about bottlenecks are almost always wrong.</p>`
    }
  },

  compare: {
    cs:`<span class="cm">// Unity — debug</span>
<span class="ty">Debug</span>.<span class="fn">Log</span>(<span class="str">"Health: "</span> + hp);
<span class="ty">Debug</span>.<span class="fn">LogWarning</span>(<span class="str">"Low HP!"</span>);
<span class="ty">Debug</span>.<span class="fn">LogError</span>(<span class="str">"Dead!"</span>);
<span class="ty">Debug</span>.<span class="fn">Assert</span>(
    hp > <span class="num">0</span>, <span class="str">"HP must be > 0"</span>);`,
    cpp:`<span class="cm">// Unreal — debug</span>
<span class="mac">UE_LOG</span>(LogTemp, Display,
    <span class="mac">TEXT</span>(<span class="str">"Health: %d"</span>), Hp);
<span class="mac">UE_LOG</span>(LogTemp, Warning,
    <span class="mac">TEXT</span>(<span class="str">"Low HP!"</span>));
<span class="mac">UE_LOG</span>(LogTemp, Error,
    <span class="mac">TEXT</span>(<span class="str">"Dead!"</span>));
<span class="fn2">ensure</span>(Hp > <span class="num">0</span>);  <span class="cm">// log + continue</span>
<span class="fn2">check</span>(Hp > <span class="num">0</span>);   <span class="cm">// log + crash</span>`
  },

  activities: [
    {
      id:'a14_1', type:'quiz', xp:15,
      q:{
        fr:`Quelle est la différence entre check() et ensure() en Unreal ?`,
        en:`What is the difference between check() and ensure() in Unreal?`
      },
      choices:[
        { t:{ fr:`check() et ensure() font exactement la même chose`, en:`check() and ensure() do exactly the same thing` }, c:false,
          fb:{ fr:`Non — leur comportement en cas d'échec est différent.`, en:`No — their behavior on failure is different.` } },
        { t:{ fr:`check() crashe le programme si la condition est fausse ; ensure() log un warning et continue`, en:`check() crashes the program if the condition is false; ensure() logs a warning and continues` }, c:true,
          fb:{ fr:`Correct. check() pour les invariants critiques qui ne peuvent jamais être violés. ensure() pour les conditions anormales qu'on veut détecter sans crasher.`, en:`Correct. check() for critical invariants that can never be violated. ensure() for abnormal conditions you want to detect without crashing.` } },
        { t:{ fr:`ensure() est pour le mode Debug ; check() est pour le mode Release`, en:`ensure() is for Debug mode; check() is for Release mode` }, c:false,
          fb:{ fr:`Les deux se comportent différemment selon le build, mais ce n'est pas leur distinction principale.`, en:`Both behave differently across build types, but that's not their main distinction.` } },
        { t:{ fr:`check() est plus rapide que ensure()`, en:`check() is faster than ensure()` }, c:false,
          fb:{ fr:`La performance n'est pas la distinction principale entre les deux.`, en:`Performance is not the main distinction between the two.` } },
      ]
    },
    {
      id:'a14_2', type:'fill', xp:20,
      instr:{
        fr:`Complète ce UE_LOG pour afficher une FString dans le Output Log avec le niveau Warning :`,
        en:`Complete this UE_LOG to display an FString in the Output Log at Warning level:`
      },
      template:{ fr:'UE_LOG(LogTemp, ______, TEXT("Name: %s"), *PlayerName);', en:'UE_LOG(LogTemp, ______, TEXT("Name: %s"), *PlayerName);' },
      answer:'Warning',
      hint:{ fr:"L'un des trois niveaux de log Unreal : Display, Warning, Error", en:"One of Unreal's three log levels: Display, Warning, Error" }
    },
    {
      id:'a14_3', type:'bug', xp:35,
      instr:{
        fr:`Ce code compilera mais causera un crash difficile à diagnostiquer. Identifie le problème et la solution.`,
        en:`This code will compile but cause a hard-to-diagnose crash. Identify the problem and the solution.`
      },
      bugCode:`<span class="ty">AActor</span>* <span class="fn2">FindTarget</span>()
{
    <span class="kw2">for</span>(<span class="ty">AActor</span>* A : AllActors)
        <span class="kw2">if</span>(A-&gt;<span class="fn2">ActorHasTag</span>(<span class="str">"Enemy"</span>))
            <span class="kw2">return</span> A;
    <span class="cm">// aucun ennemi trouvé — pas de return</span>
}
<span class="cm">// appelé ensuite :</span>
<span class="ty">AActor</span>* T = <span class="fn2">FindTarget</span>();
<span class="bug-line">T-&gt;<span class="fn2">Destroy</span>();</span>`,
      explanation:{
        fr:`FindTarget() ne retourne rien si aucun ennemi n'est trouvé — comportement indéfini en C++. T peut valoir n'importe quelle adresse. T->Destroy() va crasher ou corrompre la mémoire. Solution : retourner nullptr si aucun ennemi, et toujours vérifier if(T != nullptr) avant Destroy(). Un ensure(T != nullptr) avant l'appel permettrait aussi de détecter le problème proprement.`,
        en:`FindTarget() returns nothing if no enemy is found — undefined behavior in C++. T can be any address. T->Destroy() will crash or corrupt memory. Fix: return nullptr if no enemy found, and always check if(T != nullptr) before Destroy(). An ensure(T != nullptr) before the call would also detect the problem cleanly.`
      }
    },
    {
      id:'a14_4', type:'engine', xp:45,
      label:{ fr:'Dans Unreal', en:'In Unreal' },
      task:{
        fr:`1. Dans un Actor C++, ajoute un UE_LOG dans BeginPlay() affichant le nom de l'Actor et sa position (GetActorLocation().ToString()). 2. Dans Tick(), ajoute un UE_LOG conditionnel : si Health < 20.0f, log un Warning "Low health!". 3. Joue et filtre le Output Log sur "LogTemp". 4. Intentionnellement, crée un crash contrôlé : déclare AActor* Ptr = nullptr; puis appelle Ptr->Destroy(); Lis le crash reporter. 5. Corrige en ajoutant check(Ptr != nullptr) avant l'appel.`,
        en:`1. In a C++ Actor, add a UE_LOG in BeginPlay() displaying the Actor's name and position (GetActorLocation().ToString()). 2. In Tick(), add a conditional UE_LOG: if Health < 20.0f, log a Warning "Low health!". 3. Play and filter the Output Log on "LogTemp". 4. Intentionally create a controlled crash: declare AActor* Ptr = nullptr; then call Ptr->Destroy(). Read the crash reporter. 5. Fix by adding check(Ptr != nullptr) before the call.`
      },
      note:{
        fr:`Créer un crash intentionnel dans un contexte sûr est la meilleure façon d'apprendre à lire les crash logs sans le stress d'un vrai bug de production.`,
        en:`Intentionally creating a crash in a safe context is the best way to learn to read crash logs without the stress of a real production bug.`
      }
    },
    {
      id:'a14_5', type:'reflect', xp:10,
      prompt:{
        fr:`En C#/Unity, les erreurs de runtime sont souvent des exceptions avec des messages lisibles. En C++, un crash peut être cryptique. Maintenant que tu connais UE_LOG, check(), et ensure(), comment changerais-tu tes habitudes de débogage par rapport à ce que tu faisais en Unity ? Qu'est-ce que tu ferais systématiquement dès le début d'un projet ?`,
        en:`In C#/Unity, runtime errors are often exceptions with readable messages. In C++, a crash can be cryptic. Now that you know UE_LOG, check(), and ensure(), how would you change your debugging habits compared to what you did in Unity? What would you do systematically from the start of a project?`
      }
    },
  ],
};

document.addEventListener('DOMContentLoaded', () => {
  const tp = document.getElementById('panel-tutor');
  const sp = document.getElementById('panel-student');
  if (tp) tp.innerHTML = renderTutorPanel(SESSION);
  if (sp) sp.innerHTML = renderStudentPanel(SESSION);
});
