'use strict';
// ================================================================
// Session 01 — Types & Variables
// ================================================================

const SESSION = {
  id:        's01',
  num:       1,
  prev:      null,
  next:      2,
  xp:        80,
  blocName:  { fr:'Fondations', en:'Foundations' },
  blocColor: '#685ef7',
  title:     { fr:'Types & Variables', en:'Types & Variables' },
  sub:       { fr:'Ce que tu connais déjà — en C++', en:'What you already know — in C++' },

  // ── Tutor section ──────────────────────────────────────────
  tutor: {
    concept: {
      fr:`Les types primitifs existent dans les deux langages. La syntaxe change légèrement et les conventions de nommage aussi — mais la logique sous-jacente est identique. L'objectif de cette session : montrer que le passage à C++ n'est pas un recommencement, c'est une traduction.`,
      en:`Primitive types exist in both languages. Syntax changes slightly and naming conventions too — but the underlying logic is identical. The goal of this session: show that moving to C++ is not starting over, it's a translation.`
    },
    demoSteps: [
      {
        label: { fr:'Ouvre Unity et Unreal côte à côte', en:'Open Unity and Unreal side by side' },
        fr:`Crée un script C# vide dans Unity et un Actor C++ vide dans Unreal. Ouvre les deux dans leurs éditeurs. Montre la similitude de structure : les deux ont une classe, les deux ont des méthodes. But : l'étudiant·e voit immédiatement qu'il·elle est dans un terrain connu.`,
        en:`Create an empty C# script in Unity and an empty C++ Actor in Unreal. Open both in their editors. Show the structural similarity: both have a class, both have methods. Goal: the student immediately sees familiar ground.`
      },
      {
        label: { fr:'Déclare les mêmes variables dans les deux', en:'Declare the same variables in both' },
        fr:`Tape en direct dans les deux : int score, float speed, bool isAlive, string/FString name. Dis à voix haute ce qui est identique (int, float, bool) et ce qui diffère (int32, FString, TEXT()). Insiste sur pourquoi : int32 garantit la taille sur toutes les plateformes cibles d'Unreal.`,
        en:`Type live in both: int score, float speed, bool isAlive, string/FString name. Say out loud what's identical (int, float, bool) and what differs (int32, FString, TEXT()). Stress why: int32 guarantees size across all of Unreal's target platforms.`
      },
      {
        label: { fr:'La convention bPrefix pour les booléens', en:'The bPrefix convention for booleans' },
        fr:`Dans Unreal, les booléens commencent par "b" par convention : bIsAlive, bIsDead, bCanJump. Ce n'est pas obligatoire mais c'est universel dans tout le code Unreal officiel. Renomme la variable en direct pour que l'étudiant·e le voie.`,
        en:`In Unreal, booleans conventionally start with "b": bIsAlive, bIsDead, bCanJump. It's not mandatory but it's universal in all official Unreal code. Rename the variable live so the student sees it.`
      },
      {
        label: { fr:'auto vs var', en:'auto vs var' },
        fr:`Montre que C++ a aussi un équivalent de "var" : le mot-clé "auto". La déduction de type fonctionne pareil. Explique qu'"auto" est à utiliser avec parcimonie — la lisibilité du type explicite a de la valeur en équipe.`,
        en:`Show that C++ also has a "var" equivalent: the "auto" keyword. Type deduction works the same way. Explain that "auto" should be used sparingly — explicit type readability has value in a team.`
      },
    ],
    discussion: [
      {
        fr:`Quels types as-tu utilisés le plus souvent dans tes scripts Unity ? Est-ce qu'ils existent en C++ ?`,
        en:`Which types did you use most often in your Unity scripts? Do they exist in C++?`
      },
      {
        fr:`Pourquoi Unreal préfère int32 à int ? Qu'est-ce que ça dit sur le contexte de développement ?`,
        en:`Why does Unreal prefer int32 over int? What does that say about the development context?`
      },
    ],
    deep: {
      fr:`<p><strong>Les types à taille fixe.</strong> En C++ standard, la taille d'un <code>int</code> dépend de la plateforme (16, 32 ou 64 bits). Unreal résout ça avec ses propres typedefs : <code>int8</code>, <code>int16</code>, <code>int32</code>, <code>int64</code>, et leurs équivalents non-signés <code>uint8</code>… Si tu travailles sur une mécanique où les bornes numériques comptent (HP qui ne peut pas être négatif, index d'inventaire), choisir le bon type évite des bugs subtils sur certaines plateformes consoles.</p>`,
      en:`<p><strong>Fixed-size types.</strong> In standard C++, the size of an <code>int</code> depends on the platform (16, 32, or 64 bits). Unreal solves this with its own typedefs: <code>int8</code>, <code>int16</code>, <code>int32</code>, <code>int64</code>, and their unsigned equivalents <code>uint8</code>… If you're working on a mechanic where numeric bounds matter (HP that can't go negative, inventory index), choosing the right type avoids subtle bugs on certain console platforms.</p>`
    }
  },

  // ── Code compare ──────────────────────────────────────────
  compare: {
    cs:`<span class="cm">// C# — Unity</span>
<span class="kw">int</span> score = <span class="num">0</span>;
<span class="kw">float</span> speed = <span class="num">5.0f</span>;
<span class="kw">bool</span> isAlive = <span class="kw">true</span>;
<span class="kw">string</span> name = <span class="str">"Héros"</span>;
<span class="kw">var</span> level = <span class="num">1</span>;`,
    cpp:`<span class="cm">// C++ — Unreal</span>
<span class="kw2">int32</span> Score = <span class="num">0</span>;
<span class="kw2">float</span> Speed = <span class="num">5.0f</span>;
<span class="kw2">bool</span> bIsAlive = <span class="kw2">true</span>;
<span class="ty">FString</span> Name = <span class="mac">TEXT</span>(<span class="str">"Héros"</span>);
<span class="kw2">auto</span> Level = <span class="num">1</span>;`
  },

  // ── Activities ────────────────────────────────────────────
  activities: [
    {
      id:'a1_1', type:'quiz', xp:15,
      q:{
        fr:`Dans Unreal C++, quel type utilises-tu pour stocker un entier de façon portable sur toutes les plateformes ?`,
        en:`In Unreal C++, which type do you use to store an integer portably across all platforms?`
      },
      choices:[
        { t:'int',   c:false, fb:{ fr:`int fonctionne mais sa taille n'est pas garantie. Unreal préfère int32.`, en:`int works but its size isn't guaranteed. Unreal prefers int32.` } },
        { t:'int32', c:true,  fb:{ fr:`Correct ! int32 garantit exactement 32 bits sur toutes les plateformes cibles d'Unreal.`, en:`Correct! int32 guarantees exactly 32 bits across all of Unreal's target platforms.` } },
        { t:'Integer', c:false, fb:{ fr:`Integer n'existe pas en C++.`, en:`Integer doesn't exist in C++.` } },
        { t:'long',  c:false, fb:{ fr:`long existe en C++ mais Unreal préfère ses propres types à taille fixe.`, en:`long exists in C++ but Unreal prefers its own fixed-size types.` } },
      ]
    },
    {
      id:'a1_2', type:'fill', xp:20,
      instr:{
        fr:`Déclare une variable Unreal pour la vitesse d'un personnage (nombre décimal, commence à 3.5) :`,
        en:`Declare an Unreal variable for a character's speed (decimal number, starts at 3.5):`
      },
      template:{ fr:'______ Speed = 3.5f;', en:'______ Speed = 3.5f;' },
      answer:'float',
      hint:{ fr:'Le type décimal 32 bits — identique en C# et C++', en:'The 32-bit decimal type — identical in C# and C++' }
    },
    {
      id:'a1_3', type:'fill', xp:20,
      instr:{
        fr:`Déclare une chaîne Unreal pour le nom du joueur avec la macro d'encodage correcte :`,
        en:`Declare an Unreal string for the player's name with the correct encoding macro:`
      },
      template:{ fr:'FString PlayerName = ______("Joueur 1");', en:'FString PlayerName = ______("Player 1");' },
      answer:'TEXT',
      hint:{ fr:'La macro Unreal qui garantit l\'encodage Unicode', en:'The Unreal macro that guarantees Unicode encoding' }
    },
    {
      id:'a1_4', type:'bug', xp:25,
      instr:{
        fr:`Ce code Unreal contient une erreur de convention. Trouve-la.`,
        en:`This Unreal code contains a convention error. Find it.`
      },
      bugCode:`<span class="kw2">bool</span> <span class="bug-line">isPlayerDead</span> = <span class="kw2">false</span>;
<span class="kw2">int32</span> PlayerHealth = <span class="num">100</span>;
<span class="ty">FString</span> PlayerName = <span class="mac">TEXT</span>(<span class="str">"Héros"</span>);`,
      explanation:{
        fr:`En Unreal, les booléens commencent par "b" par convention : bIsPlayerDead. Ce n'est pas une erreur de compilation, mais c'est une erreur de style qui rend le code moins lisible pour un·e collègue qui connaît Unreal.`,
        en:`In Unreal, booleans start with "b" by convention: bIsPlayerDead. It's not a compilation error, but it's a style error that makes the code less readable for a colleague who knows Unreal.`
      }
    },
    {
      id:'a1_5', type:'reflect', xp:10,
      prompt:{
        fr:`Dans tes projets Unity passés, as-tu eu un bug causé par une confusion de types (int vs float, ou une valeur qui dépassait les limites attendues) ? Décris brièvement la situation.`,
        en:`In your past Unity projects, have you had a bug caused by a type confusion (int vs float, or a value that exceeded expected limits)? Briefly describe the situation.`
      }
    },
  ],
};

// ── Inject rendered panels once engine is ready ──────────────
document.addEventListener('DOMContentLoaded', () => {
  const tp = document.getElementById('panel-tutor');
  const sp = document.getElementById('panel-student');
  if (tp) tp.innerHTML = renderTutorPanel(SESSION);
  if (sp) sp.innerHTML = renderStudentPanel(SESSION);
});
