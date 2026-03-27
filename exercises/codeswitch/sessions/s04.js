'use strict';
// Session 04 — Pointeurs & Références

const SESSION = {
  id:        's04',
  num:       4,
  prev:      3,
  next:      5,
  xp:        110,
  blocName:  { fr:'Ce qui change vraiment', en:'What Really Changes' },
  blocColor: '#f2f537',
  title:     { fr:'Pointeurs & Références', en:'Pointers & References' },
  sub:       { fr:'Le concept qui fait peur — démystifié', en:'The scary concept — demystified' },

  tutor: {
    concept: {
      fr:`Les pointeurs font peur à beaucoup d'étudiant·es. La bonne nouvelle : tu utilises déjà la notion sans le savoir. En C# Unity, quand tu fais GetComponent<Rigidbody>(), tu récupères une référence à un objet existant — pas une copie. C'est exactement ce que fait un pointeur. La différence : en C++, c'est explicite.`,
      en:`Pointers scare many students. Good news: you already use the concept without knowing it. In C# Unity, when you call GetComponent<Rigidbody>(), you get a reference to an existing object — not a copy. That's exactly what a pointer does. The difference: in C++, it's explicit.`
    },
    demoSteps: [
      {
        label: { fr:'L\'analogie : adresse GPS d\'un bâtiment', en:'The analogy: GPS address of a building' },
        fr:`Un pointeur, c'est une adresse mémoire — comme une adresse GPS. La variable ne contient pas l'objet, elle contient l'adresse où l'objet se trouve. Dessine (ou tape) : [ PlayerHealth: 100 ] à l'adresse 0x1A2B. Un pointeur "HealthPtr" contient "0x1A2B". Modifier *HealthPtr, c'est aller à cette adresse et changer la valeur.`,
        en:`A pointer is a memory address — like a GPS address. The variable doesn't contain the object, it contains the address where the object lives. Draw (or type): [ PlayerHealth: 100 ] at address 0x1A2B. A pointer "HealthPtr" contains "0x1A2B". Modifying *HealthPtr means going to that address and changing the value.`
      },
      {
        label: { fr:'* et & — les deux opérateurs', en:'* and & — the two operators' },
        fr:`Montre en code : int32* ptr = &Score; dit "ptr contient l'adresse de Score". *ptr = 50; dit "va à l'adresse de ptr et mets 50 dedans" — ça modifie Score directement. Ensuite montre une référence : int32& ref = Score; — ref est un alias, plus simple qu'un pointeur pour la majorité des usages.`,
        en:`Show in code: int32* ptr = &Score; says "ptr holds the address of Score". *ptr = 50; says "go to ptr's address and put 50 there" — it directly modifies Score. Then show a reference: int32& ref = Score; — ref is an alias, simpler than a pointer for most uses.`
      },
      {
        label: { fr:'-> pour accéder via un pointeur', en:'-> to access through a pointer' },
        fr:`En C#, tu utilises le point pour accéder aux membres : enemy.TakeDamage(). En C++, si "enemy" est un pointeur, tu utilises -> : enemy->TakeDamage(). Montre les deux. L'opérateur -> est simplement un raccourci pour (*enemy).TakeDamage() — déréférencer puis accéder.`,
        en:`In C#, you use the dot to access members: enemy.TakeDamage(). In C++, if "enemy" is a pointer, you use ->: enemy->TakeDamage(). Show both. The -> operator is simply shorthand for (*enemy).TakeDamage() — dereference then access.`
      },
      {
        label: { fr:'nullptr — l\'équivalent de null', en:'nullptr — the null equivalent' },
        fr:`En C++, la valeur nulle pour un pointeur est nullptr. C++ old-school utilisait NULL ou 0, mais nullptr est typé et plus sûr. Montre la vérification : if(MyActor != nullptr) — identique au null check en C#. Insiste : déréférencer un nullptr est un crash garanti.`,
        en:`In C++, the null value for a pointer is nullptr. Old-school C++ used NULL or 0, but nullptr is typed and safer. Show the check: if(MyActor != nullptr) — identical to the null check in C#. Stress: dereferencing a nullptr is a guaranteed crash.`
      },
    ],
    discussion: [
      {
        fr:`En Unity, quand tu fais GetComponent<>(), tu récupères quoi exactement ? Une copie de l'objet ou une référence vers l'objet original ?`,
        en:`In Unity, when you call GetComponent<>(), what do you exactly get? A copy of the object or a reference to the original?`
      },
      {
        fr:`Pourquoi est-ce dangereux de déréférencer un pointeur nullptr ? Qu'est-ce qui se passe dans le jeu ?`,
        en:`Why is it dangerous to dereference a nullptr pointer? What happens in the game?`
      },
    ],
    deep: {
      fr:`<p><strong>Pointeurs bruts vs TObjectPtr vs TWeakObjectPtr.</strong> En Unreal moderne, on évite les pointeurs bruts (<code>AActor*</code>) pour les membres de classe. On préfère <code>TObjectPtr&lt;AActor&gt;</code> (gestion automatique par le garbage collector d'Unreal) ou <code>TWeakObjectPtr&lt;AActor&gt;</code> (référence faible qui ne prolonge pas la durée de vie de l'objet).</p>
<p>Les pointeurs bruts restent courants dans les paramètres de fonctions et les variables locales — là où la durée de vie est évidente. La règle pratique : pour un membre de classe qui pointe vers un UObject, utilise TObjectPtr.</p>`,
      en:`<p><strong>Raw pointers vs TObjectPtr vs TWeakObjectPtr.</strong> In modern Unreal, raw pointers (<code>AActor*</code>) are avoided for class members. Prefer <code>TObjectPtr&lt;AActor&gt;</code> (automatically managed by Unreal's garbage collector) or <code>TWeakObjectPtr&lt;AActor&gt;</code> (weak reference that doesn't extend the object's lifetime).</p>
<p>Raw pointers remain common in function parameters and local variables — where lifetime is obvious. Practical rule: for a class member pointing to a UObject, use TObjectPtr.</p>`
    }
  },

  compare: {
    cs:`<span class="cm">// C# — référence implicite</span>
<span class="ty">GameObject</span> enemy = <span class="fn">FindEnemy</span>();
<span class="cm">// "enemy" est une référence</span>
<span class="kw">if</span> (enemy != <span class="kw">null</span>)
    enemy.<span class="fn">SetActive</span>(<span class="kw">false</span>);

<span class="cm">// GetComponent — aussi une référence</span>
<span class="ty">Rigidbody</span> rb = <span class="fn">GetComponent</span>&lt;<span class="ty">Rigidbody</span>&gt;();`,
    cpp:`<span class="cm">// C++ — pointeur explicite</span>
<span class="ty">AActor</span>* Enemy = <span class="fn2">FindEnemy</span>();
<span class="cm">// "*" = c'est un pointeur</span>
<span class="kw2">if</span> (Enemy != <span class="kw2">nullptr</span>)
    Enemy-&gt;<span class="fn2">SetActorHiddenInGame</span>(<span class="kw2">true</span>);

<span class="cm">// FindComponentByClass — aussi un pointeur</span>
<span class="ty">UStaticMeshComponent</span>* Mesh =
    <span class="fn2">FindComponentByClass</span>&lt;<span class="ty">UStaticMeshComponent</span>&gt;();`
  },

  activities: [
    {
      id:'a4_1', type:'quiz', xp:15,
      q:{
        fr:`Qu'est-ce que l'opérateur -> fait en C++ ?`,
        en:`What does the -> operator do in C++?`
      },
      choices:[
        { t:{ fr:`Il déclare un pointeur`, en:`It declares a pointer` }, c:false,
          fb:{ fr:`Le * dans la déclaration déclare le pointeur. -> est l'opérateur d'accès à travers un pointeur.`, en:`The * in the declaration declares the pointer. -> is the access operator through a pointer.` } },
        { t:{ fr:`Il accède à un membre via un pointeur (déréférence + accès)`, en:`It accesses a member through a pointer (dereference + access)` }, c:true,
          fb:{ fr:`Correct. ptr->Method() est équivalent à (*ptr).Method(). C'est la syntaxe standard pour appeler des méthodes sur des pointeurs.`, en:`Correct. ptr->Method() is equivalent to (*ptr).Method(). It's the standard syntax for calling methods on pointers.` } },
        { t:{ fr:`Il compare deux pointeurs`, en:`It compares two pointers` }, c:false,
          fb:{ fr:`La comparaison utilise == ou !=.`, en:`Comparison uses == or !=.` } },
        { t:{ fr:`Il crée une référence`, en:`It creates a reference` }, c:false,
          fb:{ fr:`Une référence se crée avec & dans la déclaration.`, en:`A reference is created with & in the declaration.` } },
      ]
    },
    {
      id:'a4_2', type:'fill', xp:20,
      instr:{
        fr:`Complète le null-check Unreal pour un pointeur vers un Actor :`,
        en:`Complete the Unreal null-check for a pointer to an Actor:`
      },
      template:{ fr:'if (MyActor != ______)', en:'if (MyActor != ______) ' },
      answer:'nullptr',
      hint:{ fr:'Le mot-clé C++ moderne pour représenter un pointeur nul', en:'The modern C++ keyword for a null pointer' }
    },
    {
      id:'a4_3', type:'bug', xp:30,
      instr:{
        fr:`Ce code crashe au runtime. Pourquoi ?`,
        en:`This code crashes at runtime. Why?`
      },
      bugCode:`<span class="ty">AActor</span>* Target = <span class="fn2">GetTarget</span>();
<span class="cm">// GetTarget() peut retourner nullptr</span>
Target<span class="bug-line">-&gt;</span><span class="fn2">Destroy</span>();`,
      explanation:{
        fr:`GetTarget() peut retourner nullptr si aucune cible n'est trouvée. Appeler ->Destroy() sur nullptr est un accès mémoire invalide — crash garanti. Il faut toujours vérifier if(Target != nullptr) avant de déréférencer un pointeur dont la valeur n'est pas certaine.`,
        en:`GetTarget() can return nullptr if no target is found. Calling ->Destroy() on nullptr is an invalid memory access — guaranteed crash. Always check if(Target != nullptr) before dereferencing a pointer whose value isn't certain.`
      }
    },
    {
      id:'a4_4', type:'engine', xp:40,
      label:{ fr:'Dans Unity + Unreal', en:'In Unity + Unreal' },
      task:{
        fr:`1. Dans Unity, ouvre un script et trouve un GetComponent<>(). Note : Unity gère le null silencieusement dans certains cas. 2. Dans Unreal, ouvre un exemple de projet (ex. Third Person Template). Cherche des exemples de AActor* ou UStaticMeshComponent* dans un header. Compte combien de fois tu vois -> utilisé. Compare avec le . (point) en C#.`,
        en:`1. In Unity, open a script and find a GetComponent<>(). Note: Unity handles null silently in some cases. 2. In Unreal, open a sample project (e.g. Third Person Template). Find examples of AActor* or UStaticMeshComponent* in a header. Count how many times you see -> used. Compare with the . (dot) in C#.`
      },
      note:{
        fr:`Observe les patterns — tu n'as pas à comprendre tout le code.`,
        en:`Observe the patterns — you don't need to understand all the code.`
      }
    },
    {
      id:'a4_5', type:'reflect', xp:10,
      prompt:{
        fr:`En Unity, tu as peut-être eu un NullReferenceException. C'est l'équivalent C# d'un accès à nullptr en C++. Décris une fois où tu as eu cette erreur et comment tu l'as réglée. La solution aurait-elle été la même en C++ ?`,
        en:`In Unity, you've probably had a NullReferenceException. It's the C# equivalent of a nullptr access in C++. Describe a time you got this error and how you fixed it. Would the solution have been the same in C++?`
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
