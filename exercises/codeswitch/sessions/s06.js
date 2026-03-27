'use strict';
// Session 06 — Mémoire & Ownership

const SESSION = {
  id:        's06',
  num:       6,
  prev:      5,
  next:      7,
  xp:        110,
  blocName:  { fr:'Ce qui change vraiment', en:'What Really Changes' },
  blocColor: '#f2f537',
  title:     { fr:'Mémoire & Ownership', en:'Memory & Ownership' },
  sub:       { fr:'Stack, heap, et le garbage collector qu\'Unreal gère pour toi', en:'Stack, heap, and the garbage collector Unreal manages for you' },

  tutor: {
    concept: {
      fr:`C# a un garbage collector — il nettoie la mémoire automatiquement. C++ "pur" ne le fait pas : tu alloues avec new et libères avec delete. Unreal ajoute son propre garbage collector pour les UObjects, ce qui réduit drastiquement la complexité. L'objectif de cette session : comprendre le modèle de mémoire sans en avoir peur, et savoir quand Unreal s'en charge.`,
      en:`C# has a garbage collector — it cleans memory automatically. "Pure" C++ does not: you allocate with new and free with delete. Unreal adds its own garbage collector for UObjects, which drastically reduces complexity. Goal of this session: understand the memory model without fearing it, and know when Unreal handles it.`
    },
    demoSteps: [
      {
        label: { fr:'Stack vs Heap — l\'analogie', en:'Stack vs Heap — the analogy' },
        fr:`Stack : variables locales, automatiquement détruites quand la fonction se termine. Analogie : des plateaux de cafétéria empilés — chaque fonction pose son plateau, quand elle se termine son plateau disparaît. Heap : mémoire allouée avec new, qui persiste jusqu'à ce qu'on la libère avec delete. Les objets du monde (Actors, Components) vivent sur le heap.`,
        en:`Stack: local variables, automatically destroyed when the function ends. Analogy: stacked cafeteria trays — each function puts its tray down, when it ends its tray disappears. Heap: memory allocated with new, persisting until freed with delete. World objects (Actors, Components) live on the heap.`
      },
      {
        label: { fr:'new et delete — brève démonstration', en:'new and delete — brief demonstration' },
        fr:`Montre : int32* p = new int32(100); puis delete p; p = nullptr;. Insiste : après delete, toujours mettre nullptr pour éviter le "dangling pointer" — un pointeur qui pointe vers de la mémoire libérée. Ne pas s'attarder — en Unreal, on utilise rarement new/delete directement pour les UObjects.`,
        en:`Show: int32* p = new int32(100); then delete p; p = nullptr;. Stress: after delete, always set nullptr to avoid a "dangling pointer" — a pointer pointing to freed memory. Don't dwell — in Unreal, we rarely use new/delete directly for UObjects.`
      },
      {
        label: { fr:'Le GC d\'Unreal — NewObject et SpawnActor', en:'Unreal\'s GC — NewObject and SpawnActor' },
        fr:`Dans Unreal, on crée des objets avec NewObject<T>() ou GetWorld()->SpawnActor<T>(). Le GC d'Unreal les suit automatiquement via UPROPERTY(). Montre dans le Third Person template que SpawnActor est utilisé pour créer des projectiles. C'est l'équivalent de Instantiate() en Unity.`,
        en:`In Unreal, we create objects with NewObject<T>() or GetWorld()->SpawnActor<T>(). Unreal's GC tracks them automatically via UPROPERTY(). Show in the Third Person template that SpawnActor is used to create projectiles. It's the equivalent of Instantiate() in Unity.`
      },
      {
        label: { fr:'UPROPERTY protège contre le GC', en:'UPROPERTY protects against the GC' },
        fr:`Le GC d'Unreal détruit les objets qui ne sont plus référencés. Si tu as un pointeur vers un Actor mais qu'il n'est pas marqué UPROPERTY(), le GC peut détruire l'Actor sans que tu le saches — puis ton pointeur devient un dangling pointer. UPROPERTY() dit au GC : "ce pointeur est une référence valide, ne détruis pas l'objet".`,
        en:`Unreal's GC destroys objects that are no longer referenced. If you have a pointer to an Actor but it's not marked UPROPERTY(), the GC may destroy the Actor without you knowing — then your pointer becomes a dangling pointer. UPROPERTY() tells the GC: "this pointer is a valid reference, don't destroy the object".`
      },
    ],
    discussion: [
      {
        fr:`En Unity, as-tu déjà utilisé Instantiate() et Destroy() ? C'est l'équivalent conceptuel de SpawnActor et DestroyActor en Unreal.`,
        en:`In Unity, have you used Instantiate() and Destroy()? They're the conceptual equivalent of SpawnActor and DestroyActor in Unreal.`
      },
      {
        fr:`Pourquoi est-il important de mettre un pointeur à nullptr après l'avoir deleted ?`,
        en:`Why is it important to set a pointer to nullptr after deleting it?`
      },
    ],
    deep: {
      fr:`<p><strong>Smart pointers pour les non-UObjects.</strong> C++ moderne (et Unreal hors UObject) utilise RAII : une ressource est acquise à la construction et libérée à la destruction. Les smart pointers gèrent la durée de vie automatiquement :</p>
<p><code>TUniquePtr&lt;T&gt;</code> — ownership exclusif, détruit quand le pointeur sort du scope.<br>
<code>TSharedPtr&lt;T&gt;</code> — ownership partagé par comptage de références.<br>
<code>TWeakPtr&lt;T&gt;</code> — référence qui ne prolonge pas la durée de vie.</p>
<p>Ces types sont utilisés pour les objets non-UObject (structs, systèmes internes). Pour tout ce qui hérite de UObject, UPROPERTY() + le GC Unreal suffisent.</p>`,
      en:`<p><strong>Smart pointers for non-UObjects.</strong> Modern C++ (and Unreal outside UObject) uses RAII: a resource is acquired at construction and released at destruction. Smart pointers manage lifetime automatically:</p>
<p><code>TUniquePtr&lt;T&gt;</code> — exclusive ownership, destroyed when the pointer goes out of scope.<br>
<code>TSharedPtr&lt;T&gt;</code> — shared ownership via reference counting.<br>
<code>TWeakPtr&lt;T&gt;</code> — reference that doesn't extend lifetime.</p>
<p>These types are used for non-UObject objects (structs, internal systems). For anything inheriting from UObject, UPROPERTY() + Unreal's GC is sufficient.</p>`
    }
  },

  compare: {
    cs:`<span class="cm">// C# — GC automatique</span>
<span class="cm">// Unity Instantiate / Destroy</span>
<span class="ty">GameObject</span> obj =
    <span class="ty">Instantiate</span>(prefab);
<span class="cm">// Pas de delete manuel</span>
<span class="ty">Destroy</span>(obj, <span class="num">2.0f</span>);`,
    cpp:`<span class="cm">// Unreal — GC via UPROPERTY</span>
<span class="mac">UPROPERTY</span>()
<span class="ty">AMyActor</span>* Obj = <span class="kw2">nullptr</span>;

Obj = GetWorld()-&gt;<span class="fn2">SpawnActor</span>&lt;<span class="ty">AMyActor</span>&gt;(Cls);
<span class="cm">// Unreal GC gère la mémoire</span>
Obj-&gt;<span class="fn2">Destroy</span>();`
  },

  activities: [
    {
      id:'a6_1', type:'quiz', xp:15,
      q:{
        fr:`Dans Unreal C++, pourquoi les pointeurs vers des UObjects doivent-ils être marqués UPROPERTY() pour être gérés par le garbage collector ?`,
        en:`In Unreal C++, why must pointers to UObjects be marked UPROPERTY() to be managed by the garbage collector?`
      },
      choices:[
        { t:{ fr:`Pour les rendre visibles dans l'éditeur Unreal`, en:`To make them visible in the Unreal editor` }, c:false,
          fb:{ fr:`UPROPERTY() peut aussi les rendre visibles, mais ce n'est pas la raison liée au GC.`, en:`UPROPERTY() can also make them visible, but that's not the GC-related reason.` } },
        { t:{ fr:`Pour que le GC Unreal sache qu'il doit suivre et protéger ce pointeur`, en:`So that Unreal's GC knows it must track and protect this pointer` }, c:true,
          fb:{ fr:`Correct. Sans UPROPERTY(), le GC ne voit pas le pointeur et peut détruire l'objet pendant que tu essaies de l'utiliser — crash.`, en:`Correct. Without UPROPERTY(), the GC doesn't see the pointer and may destroy the object while you're trying to use it — crash.` } },
        { t:{ fr:`C'est obligatoire pour toutes les variables en Unreal`, en:`It's mandatory for all variables in Unreal` }, c:false,
          fb:{ fr:`Non, UPROPERTY() n'est requis que pour les pointeurs vers des UObjects et les variables qu'on veut exposer/sérialiser.`, en:`No, UPROPERTY() is only required for pointers to UObjects and variables you want to expose/serialize.` } },
        { t:{ fr:`Pour éviter les erreurs de compilation`, en:`To avoid compilation errors` }, c:false,
          fb:{ fr:`L'absence de UPROPERTY() ne cause pas d'erreur de compilation — c'est un bug silencieux au runtime.`, en:`Missing UPROPERTY() doesn't cause a compilation error — it's a silent runtime bug.` } },
      ]
    },
    {
      id:'a6_2', type:'fill', xp:20,
      instr:{
        fr:`Déclare un pointeur vers un Actor dans un header Unreal, correctement suivi par le GC :`,
        en:`Declare a pointer to an Actor in an Unreal header, correctly tracked by the GC:`
      },
      template:{ fr:'______() \nAActor* MyTarget;', en:'______() \nAActor* MyTarget;' },
      answer:'UPROPERTY',
      hint:{ fr:'La macro Unreal qui expose une variable au garbage collector', en:'The Unreal macro that exposes a variable to the garbage collector' }
    },
    {
      id:'a6_3', type:'bug', xp:30,
      instr:{
        fr:`Ce code a un risque de crash mémoire. Identifie le problème.`,
        en:`This code has a memory crash risk. Identify the problem.`
      },
      bugCode:`<span class="ty">AActor</span>* Enemy = <span class="fn2">SpawnEnemy</span>();
Enemy-&gt;<span class="fn2">TakeDamage</span>(<span class="num">50</span>);
Enemy-&gt;<span class="fn2">Destroy</span>();
<span class="cm">// ... plus tard dans Tick() ...</span>
<span class="kw2">if</span> (<span class="bug-line">Enemy-&gt;<span class="fn2">IsAlive</span>()</span>)
    <span class="fn2">PlayDeathAnim</span>();`,
      explanation:{
        fr:`Après Destroy(), l'Actor est marqué pour destruction par le GC d'Unreal. Accéder à Enemy->IsAlive() après Destroy() peut accéder à de la mémoire libérée — crash. Il faut vérifier IsValid(Enemy) après toute destruction potentielle, ou mettre Enemy à nullptr.`,
        en:`After Destroy(), the Actor is marked for destruction by Unreal's GC. Accessing Enemy->IsAlive() after Destroy() may access freed memory — crash. Always check IsValid(Enemy) after any potential destruction, or set Enemy to nullptr.`
      }
    },
    {
      id:'a6_4', type:'engine', xp:40,
      label:{ fr:'Dans Unreal', en:'In Unreal' },
      task:{
        fr:`Dans le Third Person Character C++ template d'Unreal, ouvre le fichier .h du personnage. Cherche toutes les variables marquées UPROPERTY(). Note lesquelles sont des pointeurs (contiennent *) et lesquelles ne le sont pas. Pourquoi les pointeurs ont-ils particulièrement besoin de UPROPERTY ?`,
        en:`In Unreal's Third Person Character C++ template, open the character's .h file. Find all variables marked with UPROPERTY(). Note which ones are pointers (contain *) and which are not. Why do pointers particularly need UPROPERTY?`
      },
      note:{
        fr:`Cherche dans ThirdPersonCharacter.h — il contient de bons exemples.`,
        en:`Look in ThirdPersonCharacter.h — it contains good examples.`
      }
    },
    {
      id:'a6_5', type:'reflect', xp:10,
      prompt:{
        fr:`Unity te cache complètement la gestion mémoire. Unreal te la montre partiellement (UPROPERTY, SpawnActor, Destroy). C++ pur te la montre entièrement. Est-ce que comprendre ce qui se passe "sous le capot" change ta façon d'écrire du code ? Pourquoi ?`,
        en:`Unity completely hides memory management from you. Unreal partially shows it (UPROPERTY, SpawnActor, Destroy). Pure C++ shows it entirely. Does understanding what happens "under the hood" change how you write code? Why?`
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
