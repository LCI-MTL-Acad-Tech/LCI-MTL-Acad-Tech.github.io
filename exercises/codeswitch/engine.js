'use strict';
// ================================================================
// CODE//SWITCH — Shared Engine v3.1
// Two-path model: IDE | Engine
// SESSION structure:
//   SESSION.tutor          — shared concept + deep dive (shown above tabs)
//   SESSION.ide            — { demoSteps, discussion, compare:{std,unreal}, activities }
//   SESSION.engine         — { demoSteps, discussion, compare:{cs,cpp}, activities }
// Progress: tracked per path (ide/eng), EITHER path ≥60% = session done
// Home screen: single progress indicator per card
// ================================================================

// ── Language — localStorage, fallback to browser preference ──
const _storedLang = localStorage.getItem('cs_lang');
const _browserFr = (navigator.language || navigator.userLanguage || '').startsWith('fr');
let L = _storedLang || (_browserFr ? 'fr' : 'en');
if(L !== 'fr' && L !== 'en') L = 'fr';
console.log('[lang] on load — localStorage cs_lang:', _storedLang, '— L set to:', L);

// ── Theme — localStorage, fallback to browser preference ────
const _storedTheme = localStorage.getItem('cs_theme');
const _prefDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
const _theme = _storedTheme || (_prefDark ? 'dark' : 'light');
document.documentElement.setAttribute('data-theme', _theme);

const TXT = {
  fr: {
    back:'Accueil', langBtn:'EN',
    heroTitle:'De C# Unity<br>vers <em>C++ Unreal</em>',
    heroSub:"Renforce tes bases de programmation et réduis la charge cognitive du passage d'un moteur à l'autre — une session à la fois.",
    xpLabel:'points accumulés',
    sessAvail:'Disponible', sessDone:'Terminée', sessLocked:'Verrouillée', sessPartial:'En cours',
    ideTab:'Parcours IDE',
    engineTab:'Parcours moteur',
    concept:'Concept',
    demoTitle:'Démonstration',
    discTitle:'Questions de discussion',
    deepToggle:'Approfondir — <span>contenu avancé (optionnel)</span>',
    ideLbl:'Exercices IDE — C++ sans moteur',
    engineLbl:'Exercices dans le moteur',
    checkBtn:'Vérifier', retryBtn:'Réessayer', revealBtn:'Voir la solution',
    homeBtn:'Accueil', nextSessBtn:'Session suivante →',
    markDone:'Marquer terminé',
    hint:'Indice',
    quizLabel:'Quiz', fillLabel:'Complète le code', bugLabel:'Trouve le bug',
    cppLabel:'C++ pur', predictLabel:'Prédis la sortie',
    engineLabel:'Dans le moteur', reflectLabel:'Réflexion',
    predictQ:'Quelle est la sortie de ce programme ?',
    showOutput:'Voir la sortie',
    of:(a,b)=>`${a} / ${b}`,
    sessionsOf:(a,b)=>`${a} session${a!==1?'s':''} terminée${a!==1?'s':''} sur ${b}`,
    xpGain:n=>`+${n} XP`,
    unlockMsg:s=>`🔓 Déverrouillée : ${s}`,
    idePathLabel:'IDE C++',
    enginePathLabel:'Moteur',
    ideBadge:'IDE — C++ sans moteur',
    engineBadge:'Moteur — session interactive',
  },
  en: {
    back:'Home', langBtn:'FR',
    heroTitle:'From C# Unity<br>to <em>C++ Unreal</em>',
    heroSub:'Strengthen your programming fundamentals and reduce the cognitive load of switching engines — one session at a time.',
    xpLabel:'points earned',
    sessAvail:'Available', sessDone:'Completed', sessLocked:'Locked', sessPartial:'In Progress',
    ideTab:'IDE Path',
    engineTab:'Engine Path',
    concept:'Concept',
    demoTitle:'Demonstration',
    discTitle:'Discussion Prompts',
    deepToggle:'Go Deeper — <span>advanced content (optional)</span>',
    ideLbl:'IDE Exercises — Pure C++, no engine',
    engineLbl:'In-engine exercises',
    checkBtn:'Check', retryBtn:'Try Again', revealBtn:'Show Solution',
    homeBtn:'Home', nextSessBtn:'Next Session →',
    markDone:'Mark Complete',
    hint:'Hint',
    quizLabel:'Quiz', fillLabel:'Complete the Code', bugLabel:'Find the Bug',
    cppLabel:'Pure C++', predictLabel:'Predict the Output',
    engineLabel:'In the Engine', reflectLabel:'Reflection',
    predictQ:'What is the output of this program?',
    showOutput:'Show Output',
    of:(a,b)=>`${a} / ${b}`,
    sessionsOf:(a,b)=>`${a} of ${b} session${b!==1?'s':''} completed`,
    xpGain:n=>`+${n} XP`,
    unlockMsg:s=>`🔓 Unlocked: ${s}`,
    idePathLabel:'IDE C++',
    enginePathLabel:'Engine',
    ideBadge:'IDE — Pure C++, no engine',
    engineBadge:'Engine — live interactive session',
  }
};
function t(k,...a){ const v=TXT[L][k]; return typeof v==='function'?v(...a):v||k; }

function toggleLang(){
  console.log('[lang] toggleLang called, current L:', L);
  L=L==='fr'?'en':'fr';
  localStorage.setItem('cs_lang',L);
  console.log('[lang] localStorage written — reads back:', localStorage.getItem('cs_lang'));
  console.log('[lang] reloading...');
  location.reload();
}

// ── Lang cookie (kept as cookie — small, needs no migration) ──
function setCookie(n,v,d){ const e=new Date(); e.setTime(e.getTime()+d*864e5); document.cookie=`${n}=${encodeURIComponent(v)};expires=${e.toUTCString()};path=/;SameSite=Lax`; }
function getCookie(n){ const m=document.cookie.match(new RegExp('(^| )'+n+'=([^;]+)')); return m?decodeURIComponent(m[2]):null; }

// ── Per-session localStorage ───────────────────────────────────
// Key pattern: cs_s01, cs_s02, …
// Value: JSON { ide:{actId:true,…}, eng:{actId:true,…},
//               complete_ide:bool, complete_eng:bool, lastPath:'ide'|'engine' }
// Fallback: if localStorage unavailable (private browsing without storage), silently no-op.

function _lsGet(sessId){
  try{ return JSON.parse(localStorage.getItem('cs_'+sessId)||'null')||{}; }
  catch{ return {}; }
}
function _lsSet(sessId,rec){
  try{ localStorage.setItem('cs_'+sessId, JSON.stringify(rec)); }catch{}
}

// One-time migration from old monolithic cookie
(function migrateLegacyCookie(){
  try{
    const raw=getCookie('cs_p');
    if(!raw) return;
    const all=JSON.parse(decodeURIComponent(raw));
    Object.entries(all).forEach(([sessId,rec])=>{
      if(sessId.startsWith('s')&&!localStorage.getItem('cs_'+sessId)){
        _lsSet(sessId,rec);
      }
    });
    // Expire the old cookie
    document.cookie='cs_p=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/';
  }catch{}
})();

// Aggregate read — returns a proxy-like object for bulk home-screen reads
// Individual session pages always use _lsGet(sessId) directly via helpers below
function getP(){
  // Used only on home page for iterating all sessions.
  // Assembles a map on demand — not cached (home renders once per load).
  const all={};
  try{
    for(let i=1;i<=15;i++){
      const id='s'+String(i).padStart(2,'0');
      const rec=_lsGet(id);
      if(Object.keys(rec).length) all[id]=rec;
    }
  }catch{}
  return all;
}

// ── Progress helpers ── ns: 'ide' | 'eng' ────────────────────
function actDone(sessId,actId,ns){
  return !!(_lsGet(sessId)?.[ns]?.[actId]);
}
function markActNs(sessId,actId,ns){
  const rec=_lsGet(sessId);
  if(!rec[ns]) rec[ns]={};
  rec[ns][actId]=true;
  _lsSet(sessId,rec);
}
function pathDone(sessId,acts,ns){
  return acts.filter(a=>actDone(sessId,a.id,ns)).length;
}
function isSessDone(sessId){
  const rec=_lsGet(sessId);
  return !!(rec.complete_ide||rec.complete_eng);
}
function markPathComplete(sessId,ns){
  const rec=_lsGet(sessId);
  rec['complete_'+ns]=true;
  _lsSet(sessId,rec);
}
function isPathComplete(sessId,ns){ return !!(_lsGet(sessId)?.['complete_'+ns]); }

// ── Toast ─────────────────────────────────────────────────────
let _tt=null;
function showToast(msg){
  const el=document.getElementById('toast');
  if(!el) return;
  el.textContent=msg; el.classList.add('show');
  if(_tt) clearTimeout(_tt);
  _tt=setTimeout(()=>el.classList.remove('show'),3200);
}

function toggleTheme(){
  const current = document.documentElement.getAttribute('data-theme') || 'dark';
  const next = current === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', next);
  localStorage.setItem('cs_theme', next);
  const btn = document.getElementById('theme-btn');
  if(btn) btn.textContent = next === 'dark' ? '🌙' : '☀️';
}

// ── Header ────────────────────────────────────────────────────
function initHeader(){
  document.documentElement.lang=L;
  const lb=document.getElementById('lang-btn');
  if(lb){ lb.textContent=t('langBtn'); lb.onclick=toggleLang; }
  const tb=document.getElementById('theme-btn');
  const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
  if(tb){ tb.textContent = currentTheme === 'dark' ? '🌙' : '☀️'; tb.onclick=toggleTheme; }
  const bb=document.getElementById('back-btn');
  if(bb){ bb.textContent='← '+t('back'); bb.onclick=()=>{ location.href='../index.html'; }; }
}

// ================================================================
// SESSION PAGE
// ================================================================
function initSessionPage(){
  if(typeof SESSION==='undefined') return;
  const S=SESSION;
  const sessId=S.id;

  document.title=`Code//Switch — S${S.num}: ${S.title[L]}`;
  const blbl=document.getElementById('sess-bloc-lbl');
  if(blbl){ blbl.textContent=S.blocName[L]; blbl.style.color=S.blocColor; }
  const stitle=document.getElementById('sess-title');
  if(stitle) stitle.textContent=S.title[L];
  const ssub=document.getElementById('sess-sub');
  if(ssub) ssub.textContent=S.sub[L];

  // Shared concept block (above tabs)
  const conceptEl=document.getElementById('sess-concept');
  if(conceptEl&&S.tutor) conceptEl.innerHTML=renderSharedConcept(S);

  // Tab labels + handlers
  const tabIde=document.getElementById('tab-ide');
  const tabEng=document.getElementById('tab-engine');
  if(tabIde){ tabIde.textContent=t('ideTab'); tabIde.onclick=()=>switchPath('ide'); }
  if(tabEng){ tabEng.textContent=t('engineTab'); tabEng.onclick=()=>switchPath('engine'); }

  // Render both path panels
  const pIde=document.getElementById('panel-ide');
  const pEng=document.getElementById('panel-engine');
  if(pIde) pIde.innerHTML=S.ide ? renderPathPanel(S,'ide') : renderComingSoon();
  if(pEng) pEng.innerHTML=S.engine ? renderPathPanel(S,'engine') : renderComingSoon();

  // Restore saved path
  const saved=(_lsGet(sessId)?.lastPath)||'ide';
  switchPath(saved);

  // Homework
  const hwEl=document.getElementById('sess-hw');
  if(hwEl&&S.homework) hwEl.innerHTML=renderHomework(S);

  // Nav
  const prevBtn=document.getElementById('prev-sess-btn');
  const nextBtn=document.getElementById('next-sess-btn');
  if(prevBtn&&S.prev){ prevBtn.onclick=()=>{ location.href=`s${String(S.prev).padStart(2,'0')}.html`; }; }
  else if(prevBtn) prevBtn.classList.add('hidden');
  if(nextBtn&&S.next){ nextBtn.textContent=t('nextSessBtn'); nextBtn.onclick=()=>{ location.href=`s${String(S.next).padStart(2,'0')}.html`; }; }
  else if(nextBtn) nextBtn.classList.add('hidden');
}

function switchPath(path){
  if(typeof SESSION==='undefined') return;
  const sessId=SESSION.id;
  const rec=_lsGet(sessId);
  rec.lastPath=path;
  _lsSet(sessId,rec);

  ['ide','engine'].forEach(pt=>{
    const panel=document.getElementById('panel-'+pt);
    const tab=document.getElementById('tab-'+(pt));
    if(panel) panel.style.display=(pt===path?'block':'none');
    if(tab) tab.className='path-tab'+(pt===path?' active-'+(pt==='ide'?'ide':'eng'):'');
  });
  // update mode pill
  const pill=document.getElementById('mode-pill');
  if(pill){
    if(path==='ide'){
      pill.className='mode-pill ide-pill';
      pill.textContent=t('idePathLabel');
    } else {
      pill.className='mode-pill eng-pill';
      pill.textContent=t('enginePathLabel');
    }
  }
}

// ── Shared concept block (above path tabs) ────────────────────
// Escape literal newlines inside string-literal spans so \n renders as text
function fixCodeNewlines(html){
  // Replace actual newline chars inside <span class="str">...</span> with \n text
  return html.replace(/<span class="str">([\s\S]*?)<\/span>/g, (match, inner) =>
    '<span class="str">' + inner.replace(/\n/g, '\\n') + '</span>'
  );
}

function renderSharedConcept(S){
  let h=`<div class="shared-concept">
    <p class="concept-text">${S.tutor.concept[L]}</p>`;
  if(S.tutor.deep){
    const did='dd-'+S.id;
    h+=`<div class="deep-toggle" onclick="toggleDeep('${did}')">
      <input type="checkbox" id="${did}-cb" onclick="event.stopPropagation()">
      <label for="${did}-cb">${t('deepToggle')}</label>
    </div>
    <div class="deep-body" id="${did}">${S.tutor.deep[L]}</div>`;
  }
  h+=`</div>`;
  return h;
}

// ── Path panel (demo steps + compare + activities) ────────────
function renderPathPanel(S, path){
  const ns   = path==='ide'?'ide':'eng';
  const data = path==='ide'?S.ide:S.engine;
  const acts = data.activities||[];
  const done = pathDone(S.id,acts,ns);
  const pct  = acts.length ? Math.round(done/acts.length*100) : 0;
  const pathColor = path==='ide' ? 'var(--cobalt)' : 'var(--aqua)';
  const badge = path==='ide' ? t('ideBadge') : t('engineBadge');
  const isComplete = isPathComplete(S.id,ns);

  let h=`<div class="path-panel-inner">`;

  // Demo steps section
  if(data.demoSteps?.length){
    h+=`<div class="path-demo-wrap">
      <div class="path-demo-badge" style="border-color:${pathColor};color:${pathColor}">${badge}</div>
      <h3 class="path-demo-title">${t('demoTitle')}</h3>
      <div class="demo-steps">`;
    data.demoSteps.forEach((step,i)=>{
      h+=`<div class="dstep">
        <div class="dstep-num" style="color:${pathColor}">${i+1}</div>
        <div class="dstep-body">
          <strong>${step.label[L]}</strong>
          <p>${step[L]}</p>
        </div>
      </div>`;
    });
    h+=`</div>`;
    if(data.discussion?.length){
      h+=`<div class="disc-section"><h4>${t('discTitle')}</h4>`;
      data.discussion.forEach(q=>{ h+=`<div class="disc-q">${q[L]}</div>`; });
      h+=`</div>`;
    }
    h+=`</div>`;
  }

  // Code compare
  if(data.compare){
    if(path==='ide'){
      h+=`<div class="compare">
        <div class="cpanel"><div class="cpanel-hdr cpp-std">C++ standard</div><pre>${fixCodeNewlines(data.compare.std)}</pre></div>
        <div class="cpanel"><div class="cpanel-hdr cpp">C++ — Unreal</div><pre>${fixCodeNewlines(data.compare.unreal)}</pre></div>
      </div>`;
    } else {
      h+=`<div class="compare">
        <div class="cpanel"><div class="cpanel-hdr cs">C# — Unity</div><pre>${fixCodeNewlines(data.compare.cs)}</pre></div>
        <div class="cpanel"><div class="cpanel-hdr cpp">C++ — Unreal</div><pre>${fixCodeNewlines(data.compare.cpp)}</pre></div>
      </div>`;
    }
  }

  // Activities
  h+=`<div class="acts-section">
    <div class="path-progress-row">
      <span class="acts-lbl">${path==='ide'?t('ideLbl'):t('engineLbl')}</span>
      <span class="path-prog-label">${done}/${acts.length}</span>
    </div>
    <div class="path-progress-bar">
      <div class="path-progress-fill" style="width:${pct}%;background:${pathColor}"></div>
    </div>`;

  acts.forEach(act=>{ h+=renderAct(act,S.id,ns); });

  // Complete button — shown if ≥60% done and not yet complete
  if(acts.length){
    const showBtn=!isComplete&&done>=Math.ceil(acts.length*.6);
    h+=`<div class="path-comp-row">
      <button class="btn orange comp-path-btn${showBtn?' show':''}" id="comp-${ns}"
        onclick="completePathBtn('${S.id}','${ns}')">${t('markDone')}</button>
    </div>`;
  }

  h+=`</div></div>`;
  return h;
}

function renderComingSoon(){
  return `<div style="padding:3.2rem 0;color:var(--ch3);font-size:1.6rem">
    ${L==='fr'?'Contenu à venir pour ce parcours.':'Content coming soon for this path.'}
  </div>`;
}

// ── Mark path complete ────────────────────────────────────────
function completePathBtn(sessId,ns){
  markPathComplete(sessId,ns);
  const btn=document.getElementById('comp-'+ns);
  if(btn) btn.classList.remove('show');
  const xp=typeof SESSION!=='undefined'?Math.round((SESSION.xp||100)*.5):50;
  showToast(t('xpGain',xp));
}

// ── Single activity renderer ──────────────────────────────────
function renderAct(act,sessId,ns){
  const isDone=actDone(sessId,act.id,ns);
  const badgeMap={quiz:'bq',fill:'bf',bug:'bb',cpp:'bcpp',predict:'bpredict',engine:'be',reflect:'br'};
  const labelMap={
    quiz:t('quizLabel'),fill:t('fillLabel'),bug:t('bugLabel'),
    cpp:t('cppLabel'),predict:t('predictLabel'),engine:t('engineLabel'),reflect:t('reflectLabel')
  };
  let h=`<div class="activity${isDone?' completed':''}" id="wrap-${act.id}">
    <div class="act-top">
      <span class="abadge ${badgeMap[act.type]||'bq'}">${labelMap[act.type]||act.type} · ${act.xp||10} XP</span>
      <button class="acheck${isDone?' done':''}" onclick="toggleActCheck('${sessId}','${act.id}','${ns}')">${isDone?'✓':''}</button>
    </div>`;
  if(act.type==='quiz')    h+=renderQuiz(act,sessId,ns);
  if(act.type==='fill')    h+=renderFill(act,sessId,ns);
  if(act.type==='bug')     h+=renderBug(act,sessId,ns);
  if(act.type==='cpp')     h+=renderCpp(act,sessId,ns);
  if(act.type==='predict') h+=renderPredict(act,sessId,ns);
  if(act.type==='engine')  h+=renderEngine(act);
  if(act.type==='reflect') h+=renderReflect(act);
  h+=`</div>`;
  return h;
}

// ── Renderers ─────────────────────────────────────────────────
function renderQuiz(act,sessId,ns){
  const done=actDone(sessId,act.id,ns);
  const choices=act.choices.map((c,i)=>{
    const label=typeof c.t==='object'?c.t[L]:c.t;
    return `<button class="choice" id="qc-${act.id}-${i}"
      onclick="checkQ('${sessId}','${act.id}',${i},${act.choices.length},'${ns}')"
      data-correct="${c.c}"
      data-fb="${encodeURIComponent(typeof c.fb==='object'?c.fb[L]:c.fb)}"
      ${done?'disabled':''}>${label}</button>`;
  }).join('');
  return `<h4>${act.q[L]}</h4><div class="choices">${choices}</div><div class="feedback" id="fb-${act.id}"></div>`;
}

function renderFill(act,sessId,ns){
  const done=actDone(sessId,act.id,ns);
  const code=act.template[L].replace('______',
    `<input class="blank" id="bi-${act.id}" placeholder="???" autocomplete="off" autocorrect="off" spellcheck="false"
      onkeydown="if(event.key==='Enter')checkF('${sessId}','${act.id}','${ns}')"
      ${done?'disabled':''}>`);
  return `<h4>${act.instr[L]}</h4>
    <div class="code-block">${code}</div>
    <p style="font-size:1.3rem;color:var(--ch4);margin-bottom:1rem">${t('hint')}: ${act.hint[L]}</p>
    <div style="display:flex;gap:.8rem;flex-wrap:wrap">
      <button class="btn" onclick="checkF('${sessId}','${act.id}','${ns}')" ${done?'disabled':''}>${t('checkBtn')}</button>
      <button class="btn sec" id="retry-${act.id}" style="display:none" onclick="retryF('${act.id}')">${t('retryBtn')}</button>
    </div>
    <div class="feedback" id="fb-${act.id}"></div>`;
}

function renderBug(act,sessId,ns){
  const rid='br-'+act.id;
  return `<h4>${act.instr[L]}</h4>
    <div class="bug-code">${act.bugCode}</div>
    <button class="btn sec" onclick="revealAns('${rid}','${sessId}','${act.id}','${ns}')">${t('revealBtn')}</button>
    <div class="bug-reveal" id="${rid}">${act.explanation[L]}</div>`;
}

function renderCpp(act,sessId,ns){
  let h=`<h4>${act.instr[L]}</h4>`;
  if(act.stub) h+=`<div class="code-block" style="white-space:pre-wrap">${act.stub}</div>`;
  if(act.hint) h+=`<p style="font-size:1.3rem;color:var(--ch4);margin-bottom:1rem">${t('hint')}: ${act.hint[L]}</p>`;
  const rid='cpp-'+act.id;
  h+=`<button class="btn sec" onclick="revealAns('${rid}','${sessId}','${act.id}','${ns}')">${t('revealBtn')}</button>
    <div class="bug-reveal" id="${rid}">${act.solution[L]}</div>`;
  return h;
}

function renderPredict(act,sessId,ns){
  const rid='pr-'+act.id;
  return `<h4>${t('predictQ')}</h4>
    <div class="code-block" style="white-space:pre-wrap">${act.code}</div>
    <p style="font-size:1.3rem;color:var(--ch4);margin-bottom:1rem">${act.question[L]}</p>
    <button class="btn sec" onclick="revealAns('${rid}','${sessId}','${act.id}','${ns}')">${t('showOutput')}</button>
    <div class="bug-reveal" id="${rid}">
      <strong style="display:block;margin-bottom:.4rem;font-size:1.1rem;letter-spacing:.08em;text-transform:uppercase;color:var(--aqua)">${L==='fr'?'Sortie':'Output'}</strong>
      <pre style="font-family:var(--mono);font-size:1.3rem;line-height:1.6;color:#e0e8ef;margin-bottom:.8rem">${act.output}</pre>
      <p style="font-size:1.4rem;color:var(--ch2);line-height:1.5">${act.explanation[L]}</p>
    </div>`;
}

function renderEngine(act){
  return `<h4>${act.task[L]}</h4>
    <div class="engine-task">
      <h5>${act.label?act.label[L]:'Engine'}</h5>
      <p>${act.task[L]}</p>
      ${act.note?`<p class="note">${act.note[L]}</p>`:''}
    </div>`;
}

function renderReflect(act){
  return `<div class="reflect-prompt">${act.prompt[L]}</div>`;
}

// ── Interaction handlers ──────────────────────────────────────
function checkQ(sessId,actId,idx,total,ns){
  const btn=document.getElementById(`qc-${actId}-${idx}`);
  if(!btn||btn.disabled) return;
  const correct=btn.dataset.correct==='true';
  const fb=decodeURIComponent(btn.dataset.fb);
  for(let i=0;i<total;i++){
    const b=document.getElementById(`qc-${actId}-${i}`);
    if(b){ b.disabled=true; if(b.dataset.correct==='true') b.classList.add('correct'); }
  }
  if(!correct) btn.classList.add('wrong');
  const f=document.getElementById('fb-'+actId);
  if(f){ f.textContent=fb; f.className=`feedback show ${correct?'ok':'nok'}`; }
  if(correct){ markActNs(sessId,actId,ns); updateActCheck(actId,true); showToast(t('xpGain',10)); updateCompBtn(sessId,ns); }
}

function checkF(sessId,actId,ns){
  const input=document.getElementById('bi-'+actId);
  if(!input||input.disabled) return;
  const allActs=[
    ...(SESSION.activities||[]),
    ...(SESSION.ide?.activities||[]),
    ...(SESSION.engine?.activities||[])
  ];
  const act=allActs.find(a=>a.id===actId);
  if(!act){ console.warn('[checkF] act not found for', actId); return; }
  const correct=input.value.trim().toLowerCase()===act.answer.toLowerCase();
  input.classList.remove('ok','nok'); input.classList.add(correct?'ok':'nok');
  input.disabled=true;
  const f=document.getElementById('fb-'+actId);
  if(f){ f.textContent=correct?(L==='fr'?`✓ Correct ! Réponse : ${act.answer}`:`✓ Correct! Answer: ${act.answer}`):(L==='fr'?`✗ Réponse : ${act.answer}`:`✗ Answer: ${act.answer}`); f.className=`feedback show ${correct?'ok':'nok'}`; }
  const r=document.getElementById('retry-'+actId);
  if(r&&!correct) r.style.display='inline-flex';
  if(correct){ markActNs(sessId,actId,ns); updateActCheck(actId,true); showToast(t('xpGain',15)); updateCompBtn(sessId,ns); }
}

function retryF(actId){
  const input=document.getElementById('bi-'+actId);
  if(!input) return;
  input.value=''; input.disabled=false; input.classList.remove('ok','nok');
  const f=document.getElementById('fb-'+actId);
  if(f){ f.className='feedback'; f.textContent=''; }
  const r=document.getElementById('retry-'+actId);
  if(r) r.style.display='none';
  input.focus();
}

function revealAns(rid,sessId,actId,ns){
  const el=document.getElementById(rid);
  if(el){ el.classList.add('show'); markActNs(sessId,actId,ns); updateActCheck(actId,true); showToast(t('xpGain',20)); updateCompBtn(sessId,ns); }
}

function toggleActCheck(sessId,actId,ns){
  console.log('[acheck] toggleActCheck called — sessId:', sessId, 'actId:', actId, 'ns:', ns);
  const rec=_lsGet(sessId);
  console.log('[acheck] rec before:', JSON.stringify(rec));
  if(!rec[ns]) rec[ns]={};
  rec[ns][actId]=!rec[ns][actId];
  _lsSet(sessId,rec);
  console.log('[acheck] rec after:', JSON.stringify(rec));
  updateActCheck(actId,!!rec[ns][actId]);
  updateCompBtn(sessId,ns);
}

function updateActCheck(actId,done){
  const btn=document.querySelector(`.acheck[onclick*="'${actId}'"]`);
  if(btn){ btn.className=`acheck${done?' done':''}`; btn.textContent=done?'✓':''; }
  const wrap=document.getElementById('wrap-'+actId);
  if(wrap){ wrap.className=`activity${done?' completed':''}`; }
}

function updateCompBtn(sessId,ns){
  const S=SESSION;
  let acts;
  if(ns==='m0') acts=S.activities||[];
  else { const data=ns==='ide'?S.ide:S.engine; acts=data?.activities||[]; }
  if(!acts.length) return;
  const done=pathDone(sessId,acts,ns);
  const isComplete=isPathComplete(sessId,ns);
  const btn=document.getElementById('comp-'+ns);
  if(!btn) return;
  if(!isComplete&&done>=Math.ceil(acts.length*.6)) btn.classList.add('show');
  else btn.classList.remove('show');
}

function toggleDeep(id){
  const el=document.getElementById(id);
  const cb=document.getElementById(id+'-cb');
  if(el){ el.classList.toggle('open'); if(cb) cb.checked=el.classList.contains('open'); }
}

// ================================================================
// MODULE 0 — Single-panel warmup (no IDE/Engine split)
// SESSION.solo = true signals this page to engine
// Activities support: predict, quiz, fill, diff (spot-the-difference)
// Progress stored under cs_s00 in localStorage, ns='m0'
// ================================================================

const _m0CodeMap = {};  // frameId → plainCpp, set during render

const TXT_M0 = {
  fr:{
    tryItLabel:'Essaie en direct — C++',
    tryItNote:'Clique le bouton pour copier le code et ouvrir l\'éditeur, puis colle avec Ctrl+V :',
    launchEditor:'▶ Copier le code et ouvrir l\'éditeur',
    copyCode:'Copier le code',
    copyDone:'Copié !',
    openEditor:'Ouvrir onecompiler.com/cpp ↗',
    pasteNote:'✓ Code copié — dans l\'éditeur : Ctrl+A pour tout sélectionner, puis Ctrl+V pour coller, puis Run ▶',
    diffPrompt:'Qu\'est-ce qui a changé entre le C# et le C++ ?',
    actLabel:'Activités — C# ↔ C++',
    diffLabel:'Spot la diff',
    markDone:'Marquer terminé',
  },
  en:{
    tryItLabel:'Try it live — C++',
    tryItNote:'Click the button to copy the code and open the editor, then paste with Ctrl+V:',
    launchEditor:'▶ Copy code and open editor',
    copyCode:'Copy code',
    copyDone:'Copied!',
    openEditor:'Open onecompiler.com/cpp ↗',
    pasteNote:'✓ Code copied — in the editor: Ctrl+A to select all, then Ctrl+V to paste, then Run ▶',
    diffPrompt:'What changed between C# and C++?',
    actLabel:'Activities — C# ↔ C++',
    diffLabel:'Spot the diff',
    markDone:'Mark Complete',
  }
};
function tm0(k){ return TXT_M0[L][k]||k; }

function launchM0Frame(btn){
  const target = btn.dataset.target;
  const code   = _m0CodeMap[target] || '';
  const ph     = document.getElementById(target+'-ph');
  const wrap   = document.getElementById(target);

  console.log('[M0] launchM0Frame called, target:', target);
  console.log('[M0] code in _m0CodeMap:', !!code, '— first 80 chars:', code.slice(0,80));
  console.log('[M0] wrap found:', !!wrap, '  ph found:', !!ph);

  if(!wrap){ console.warn('[M0] wrap element not found — aborting'); return; }

  // Copy the correct code to clipboard
  if(code){
    navigator.clipboard.writeText(code).then(()=>{
      console.log('[M0] clipboard write succeeded');
    }).catch(err=>{
      console.warn('[M0] clipboard write failed:', err);
    });
  } else {
    console.warn('[M0] no code found for target:', target);
  }

  // Inject clean empty iframe
  if(!wrap.querySelector('iframe')){
    console.log('[M0] injecting iframe');
    const iframe = document.createElement('iframe');
    iframe.src = 'https://onecompiler.com/embed/cpp?theme=dark&hideTitle=true&hideStdin=true';
    iframe.className = 'm0-iframe';
    iframe.setAttribute('sandbox','allow-scripts allow-same-origin allow-forms allow-popups');
    iframe.setAttribute('title','C++ live editor');
    wrap.appendChild(iframe);
    console.log('[M0] iframe injected');
  } else {
    console.log('[M0] iframe already present — skipping inject');
  }

  if(ph){ ph.style.display = 'none'; console.log('[M0] placeholder hidden'); }
  wrap.style.display = 'block';
  console.log('[M0] wrap now visible');
}

function copyM0Code(btn){
  const code = btn.dataset.code.replace(/\\n/g,'\n');
  const label = btn.querySelector('.m0-copy-label');
  navigator.clipboard.writeText(code).then(()=>{
    if(label) label.textContent=tm0('copyDone');
    btn.classList.add('copied');
    setTimeout(()=>{ if(label) label.textContent=tm0('copyCode'); btn.classList.remove('copied'); }, 1800);
  }).catch(()=>{
    const ta=document.createElement('textarea');
    ta.value=code; ta.style.cssText='position:fixed;opacity:0';
    document.body.appendChild(ta); ta.select();
    document.execCommand('copy'); document.body.removeChild(ta);
    if(label) label.textContent=tm0('copyDone');
    setTimeout(()=>{ if(label) label.textContent=tm0('copyCode'); }, 1800);
  });
}

function initM0Page(){
  if(typeof SESSION==='undefined'||!SESSION.solo) return;
  const S=SESSION;
  const sessId=S.id; // 's00'

  document.title=`Code//Switch — ${S.title[L]}`;
  const blbl=document.getElementById('sess-bloc-lbl');
  if(blbl){ blbl.textContent=S.blocName[L]; blbl.style.color=S.blocColor; }
  const stitle=document.getElementById('sess-title');
  if(stitle) stitle.textContent=S.title[L];
  const ssub=document.getElementById('sess-sub');
  if(ssub) ssub.textContent=S.sub[L];

  // Mode pill
  const pill=document.getElementById('mode-pill');
  if(pill){ pill.textContent=L==='fr'?'ÉCHAUFFEMENT':'WARMUP'; }

  // Concept block
  const conceptEl=document.getElementById('sess-concept');
  if(conceptEl&&S.tutor) conceptEl.innerHTML=renderSharedConcept(S);

  // Render the single panel
  const panel=document.getElementById('panel-m0');
  if(panel){
    panel.innerHTML=renderM0Panel(S);
    // Delegated listener — catches acheck clicks even if inline onclick fails
    panel.addEventListener('click', e=>{
      const btn = e.target.closest('.acheck');
      if(!btn) return;
      console.log('[acheck] delegated click on', btn.outerHTML);
      const onclick = btn.getAttribute('onclick');
      console.log('[acheck] onclick attr:', onclick);
      if(onclick) {
        try { eval(onclick); }
        catch(err) { console.error('[acheck] eval error:', err); }
      }
    });
  }

  // Nav — no prev, next goes to s01
  const prevBtn=document.getElementById('prev-sess-btn');
  const nextBtn=document.getElementById('next-sess-btn');
  if(prevBtn) prevBtn.classList.add('hidden');
  if(nextBtn&&S.next){
    nextBtn.textContent=t('nextSessBtn');
    nextBtn.onclick=()=>{ location.href=`s${String(S.next).padStart(2,'0')}.html`; };
  }
}

function renderM0Panel(S){
  const sessId=S.id;
  const ns='m0';
  const acts=S.activities||[];
  const done=pathDone(sessId,acts,ns);
  const pct=acts.length?Math.round(done/acts.length*100):0;
  const isComplete=isPathComplete(sessId,ns);

  let h=`<div class="acts-section">
    <div class="path-progress-row">
      <span class="acts-lbl">${tm0('actLabel')}</span>
      <span class="path-prog-label">${done}/${acts.length}</span>
    </div>
    <div class="path-progress-bar">
      <div class="path-progress-fill" style="width:${pct}%;background:var(--canary)"></div>
    </div>`;

  // Render concepts interleaved with activities
  (S.concepts||[]).forEach(concept=>{
    h+=renderM0Concept(concept,sessId,ns,acts);
  });

  // Complete button
  if(acts.length){
    const showBtn=!isComplete&&done>=Math.ceil(acts.length*.6);
    h+=`<div class="path-comp-row">
      <button class="btn orange comp-path-btn${showBtn?' show':''}" id="comp-m0"
        onclick="completeM0('${sessId}')">${tm0('markDone')}</button>
    </div>`;
  }

  h+=`</div>`;
  return h;
}

function renderM0Concept(concept,sessId,ns,allActs){
  const conceptIdx = (SESSION.concepts||[]).indexOf(concept);
  const frameId = `m0-frame-${conceptIdx}`;

  // Decode HTML entities via DOM
  const _d = document.createElement('div');
  _d.innerHTML = concept.cpp;
  let plainCpp = (_d.innerText || _d.textContent || '').trim();

  // Clean up visual line-continuations: a line that starts with << or other
  // operators was split for display only — rejoin it
  plainCpp = plainCpp.replace(/\n[ \t]*(<<|>>|\+|\|)/g, ' $1');

  // Fix newlines inside string literals — innerText turns \n into a real newline
  // which breaks C++ string literals. Restore them to \n escape sequences.
  plainCpp = plainCpp.replace(/"([^"]*)"/g, (match) =>
    match.replace(/\n/g, '\\n')
  );
  const encoded  = encodeURIComponent(plainCpp);
  const embedUrl = `https://onecompiler.com/embed/cpp?theme=dark&hideTitle=true&hideStdin=true&code=${encoded}`;

  const safeCpp = plainCpp.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');

  let h=`<div class="m0-concept-block">
    <h3 class="m0-concept-title">${concept.title[L]}</h3>
    <p class="m0-concept-body">${concept.body[L]}</p>
    <div class="m0-concept-grid">

      <div class="m0-concept-left">
        <div class="m0-side-by-side">
          <div class="m0-col">
            <div class="m0-lang-hdr cs-hdr">C# — Unity / .NET</div>
            <div class="code-block" style="white-space:pre-wrap">${fixCodeNewlines(concept.cs)}</div>
          </div>
          <div class="m0-col">
            <div class="m0-lang-hdr cpp-hdr">C++ — équivalent</div>
            <div class="code-block" style="white-space:pre-wrap">${fixCodeNewlines(concept.cpp)}</div>
          </div>
        </div>`;

  if(concept.diff){
    h+=`<div class="m0-diff-callout">
      <strong>${L==='fr'?'Ce qui change :':'What changes:'}</strong>
      <ul>${concept.diff[L].map(d=>`<li>${d}</li>`).join('')}</ul>
    </div>`;
  }

  // Wrap plainCpp in runnable boilerplate before storing
  const includes = [];
  if(/std::cout|std::cin|std::endl/.test(plainCpp)) includes.push('#include <iostream>');
  if(/std::string/.test(plainCpp))                  includes.push('#include <string>');
  if(/std::vector/.test(plainCpp))                  includes.push('#include <vector>');
  if(/std::map/.test(plainCpp))                     includes.push('#include <map>');
  if(/std::cout/.test(plainCpp) && !includes.includes('#include <iostream>')) includes.push('#include <iostream>');
  // Deduplicate
  const uniqueIncludes = [...new Set(includes)];

  // Detect if code already has main() or is a class/struct definition
  const needsMain = !/int\s+main\s*\(/.test(plainCpp)
    && !/^\s*(class|struct)\s/m.test(plainCpp)
    && !/^\s*\w[\w\s*&:<>]*\s+\w+\s*\([^)]*\)\s*\{/m.test(plainCpp);

  let runnableCpp;
  if(needsMain){
    runnableCpp = (uniqueIncludes.length ? uniqueIncludes.join('\n') + '\n\n' : '')
      + 'int main() {\n'
      + plainCpp.split('\n').map(l => '    ' + l).join('\n')
      + '\n    return 0;\n}';
  } else {
    runnableCpp = (uniqueIncludes.length ? uniqueIncludes.join('\n') + '\n\n' : '') + plainCpp;
  }

  _m0CodeMap[frameId] = runnableCpp;
  console.log('[M0] _m0CodeMap set for', frameId, '— length:', runnableCpp.length, 'first 60:', runnableCpp.slice(0,60));

  const safeCode = plainCpp.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');

  h+=`</div>

      <div class="m0-concept-right">
        <div class="m0-lang-hdr cpp-hdr" style="margin-bottom:.8rem">${tm0('tryItLabel')}</div>
        <div id="${frameId}-ph" class="m0-frame-placeholder">
          <p class="m0-run-note" style="margin-bottom:.8rem">${tm0('tryItNote')}</p>
          <div class="code-block" style="white-space:pre;font-size:1.2rem;line-height:1.7;margin-bottom:1rem;overflow-x:auto">${safeCode}</div>
          <button class="m0-launch-btn"
            data-target="${frameId}"
            onclick="launchM0Frame(this)">▶ ${tm0('launchEditor')}</button>
        </div>
        <div id="${frameId}" class="m0-frame-wrap" style="display:none">
          <div class="m0-paste-note">${tm0('pasteNote')}</div>
        </div>
      </div>

    </div>`;

  const conceptActs=(concept.actIds||[]).map(id=>allActs.find(a=>a.id===id)).filter(Boolean);
  conceptActs.forEach(act=>{ h+=renderM0Act(act,sessId,ns); });

  h+=`</div>`;
  return h;
}

function renderM0Act(act,sessId,ns){
  const isDone=actDone(sessId,act.id,ns);
  const badgeMap={quiz:'bq',fill:'bf',predict:'bpredict',diff:'bdiff'};
  const labelMap={
    quiz:t('quizLabel'),fill:t('fillLabel'),
    predict:t('predictLabel'),diff:tm0('diffLabel')
  };
  let h=`<div class="activity${isDone?' completed':''}" id="wrap-${act.id}">
    <div class="act-top">
      <span class="abadge ${badgeMap[act.type]||'bq'}">${labelMap[act.type]||act.type} · ${act.xp||10} XP</span>
      <button class="acheck${isDone?' done':''}" onclick="toggleActCheck('${sessId}','${act.id}','${ns}')">${isDone?'✓':''}</button>
    </div>`;
  if(act.type==='quiz')    h+=renderQuiz(act,sessId,ns);
  if(act.type==='fill')    h+=renderFill(act,sessId,ns);
  if(act.type==='predict') h+=renderPredict(act,sessId,ns);
  if(act.type==='diff')    h+=renderDiff(act,sessId,ns);
  h+=`</div>`;
  return h;
}

function renderDiff(act,sessId,ns){
  // Shows C# and C++ side by side, asks what changed — quiz format
  const done=actDone(sessId,act.id,ns);
  const choices=act.choices.map((c,i)=>{
    const label=typeof c.t==='object'?c.t[L]:c.t;
    return `<button class="choice" id="qc-${act.id}-${i}"
      onclick="checkQ('${sessId}','${act.id}',${i},${act.choices.length},'${ns}')"
      data-correct="${c.c}"
      data-fb="${encodeURIComponent(typeof c.fb==='object'?c.fb[L]:c.fb)}"
      ${done?'disabled':''}>${label}</button>`;
  }).join('');
  return `<div class="m0-diff-pair">
    <div class="m0-diff-col"><div class="m0-diff-col-hdr cs-hdr">C#</div>
      <div class="code-block" style="white-space:pre-wrap;font-size:1.25rem">${fixCodeNewlines(act.cs)}</div></div>
    <div class="m0-diff-col"><div class="m0-diff-col-hdr cpp-hdr">C++</div>
      <div class="code-block" style="white-space:pre-wrap;font-size:1.25rem">${fixCodeNewlines(act.cpp)}</div></div>
  </div>
  <p style="font-size:1.4rem;color:var(--ch2);margin-bottom:.8rem">${tm0('diffPrompt')}</p>
  <div class="choices">${choices}</div>
  <div class="feedback" id="fb-${act.id}"></div>`;
}

function completeM0(sessId){
  markPathComplete(sessId,'m0');
  const btn=document.getElementById('comp-m0');
  if(btn) btn.classList.remove('show');
  showToast(t('xpGain',typeof SESSION!=='undefined'?SESSION.xp:50));
}

// ── Homework ──────────────────────────────────────────────────
function renderHomework(S){
  const hw = S.homework;
  const label = L==='fr' ? 'Pratique optionnelle' : 'Optional practice';
  const sublabel = L==='fr'
    ? 'Exercices à faire chez toi avant la prochaine session — pas obligatoires, pas évalués.'
    : 'Exercises to do before the next session — not required, not graded.';
  const coreLbl = L==='fr' ? 'Tronc commun' : 'Shared core';
  const ideLbl  = L==='fr' ? 'Extension IDE' : 'IDE extension';
  const engLbl  = L==='fr' ? 'Extension moteur' : 'Engine extension';
  const diffLabels = {
    easy:   L==='fr' ? '🟢 Facile'       : '🟢 Easy',
    medium: L==='fr' ? '🟡 Intermédiaire' : '🟡 Intermediate',
    hard:   L==='fr' ? '🔴 Difficile'    : '🔴 Hard',
  };
  const renderItems = items => items.map(item=>`
    <div class="hw-item">
      <span class="hw-diff">${diffLabels[item.diff]||item.diff}</span>
      <p class="hw-text">${item[L]||item.fr}</p>
    </div>`).join('');

  return `<div class="hw-section">
    <button class="hw-toggle" onclick="this.parentElement.classList.toggle('hw-open')">
      <span class="hw-icon">▸</span>
      <span class="hw-label">${label}</span>
      <span class="hw-sub">${sublabel}</span>
    </button>
    <div class="hw-body">
      ${hw.core?.length?`<div class="hw-group">
        <div class="hw-group-lbl">${coreLbl}</div>
        ${renderItems(hw.core)}</div>`:''}
      ${hw.ide?.length?`<div class="hw-group">
        <div class="hw-group-lbl ide-lbl">${ideLbl}</div>
        ${renderItems(hw.ide)}</div>`:''}
      ${hw.engine?.length?`<div class="hw-group">
        <div class="hw-group-lbl eng-lbl">${engLbl}</div>
        ${renderItems(hw.engine)}</div>`:''}
    </div>
  </div>`;
}

// ── Copy buttons ──────────────────────────────────────────────
function initCopyButtons(){
  // Selectors that get a copy button
  const sel = [
    '.code-cmd',
    '.code-block',
    '.bug-code',
    '.cpanel pre',
    '.m0-side-by-side .code-block',
  ].join(',');

  document.querySelectorAll(sel).forEach(el=>{
    // Skip if already wrapped
    if(el.parentElement.classList.contains('copyable')) return;
    // Skip code blocks containing interactive inputs (fill activities)
    if(el.querySelector('input')) return;

    const wrapper = document.createElement('div');
    wrapper.className = 'copyable';
    el.parentNode.insertBefore(wrapper, el);
    wrapper.appendChild(el);

    const btn = document.createElement('button');
    btn.className = 'copy-btn';
    btn.title = 'Copier';
    btn.innerHTML = `<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5"
      xmlns="http://www.w3.org/2000/svg">
      <rect x="5" y="5" width="9" height="10" rx="1.5"/>
      <path d="M11 5V3.5A1.5 1.5 0 0 0 9.5 2h-7A1.5 1.5 0 0 0 1 3.5v7A1.5 1.5 0 0 0 2.5 12H4"/>
    </svg>`;

    btn.addEventListener('click', ()=>{
      // Get plain text — strip HTML tags from innerHTML
      const text = (el.innerText || el.textContent || '').trim();
      navigator.clipboard.writeText(text).then(()=>{
        btn.classList.add('copied');
        btn.title = L==='fr' ? 'Copié !' : 'Copied!';
        setTimeout(()=>{
          btn.classList.remove('copied');
          btn.title = 'Copier';
        }, 1800);
      }).catch(()=>{
        // Fallback for older browsers
        const ta = document.createElement('textarea');
        ta.value = text;
        ta.style.position = 'fixed';
        ta.style.opacity = '0';
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        document.body.removeChild(ta);
        btn.classList.add('copied');
        setTimeout(()=>btn.classList.remove('copied'), 1800);
      });
    });

    wrapper.appendChild(btn);
  });
}

// ================================================================
// GLOSSARY — inline term tooltips
// ================================================================
const GLOSSARY = {
  'stack':               { fr:'Zone mémoire automatique pour les variables locales. Créée et détruite avec chaque appel de fonction. Rapide, mais de taille limitée.', en:'Automatic memory area for local variables. Created and destroyed with each function call. Fast, but limited in size.' },
  'heap':                { fr:'Zone mémoire dynamique, allouée avec new et libérée avec delete. Persiste jusqu\'à libération explicite. Plus grande que le stack, mais plus lente.', en:'Dynamic memory area, allocated with new and freed with delete. Persists until explicitly freed. Larger than the stack, but slower.' },
  'scope':               { fr:'La portée d\'une variable — la région du code où elle existe. Une variable déclarée dans {} n\'existe qu\'entre ces accolades.', en:'The region of code where a variable exists. A variable declared inside {} only exists between those braces.' },
  'namespace':           { fr:'Espace de noms — regroupe des noms (fonctions, types) pour éviter les conflits. std:: est le namespace de la bibliothèque standard C++.', en:'A named scope that groups identifiers (functions, types) to avoid conflicts. std:: is the C++ standard library namespace.' },
  'linker':              { fr:'Outil qui assemble les fichiers objets compilés en un exécutable final. L\'erreur "undefined reference" vient du linker, pas du compilateur.', en:'Tool that assembles compiled object files into a final executable. An "undefined reference" error comes from the linker, not the compiler.' },
  'forward declaration': { fr:'Déclaration minimale disant qu\'un type existe, sans détailler sa structure. Permet de briser les dépendances circulaires entre fichiers .h.', en:'Minimal declaration saying a type exists, without detailing its structure. Used to break circular dependencies between .h files.' },
  'initializer list':    { fr:'Syntaxe de constructeur C++ : Player(int h) : health(h) {}. Initialise les membres directement, plus efficace qu\'une assignation dans le corps.', en:'C++ constructor syntax: Player(int h) : health(h) {}. Initializes members directly — more efficient than assigning inside the body.' },
  'overloading':         { fr:'Plusieurs fonctions avec le même nom mais des paramètres différents. Ex : add(int,int) et add(float,float) coexistent.', en:'Multiple functions sharing the same name but with different parameters. E.g. add(int,int) and add(float,float) coexist.' },
  'polymorphism':        { fr:'Capacité d\'un pointeur de classe de base à appeler la méthode correcte selon le vrai type de l\'objet. Ex : un pointeur Animal* appelle Dog::sound() si l\'objet est un Dog — grâce au mot-clé virtual qui active la résolution dynamique.', en:'Ability of a base class pointer to call the correct method based on the object\'s actual type. E.g. an Animal* pointer calls Dog::sound() if the object is a Dog — the virtual keyword enables this dynamic resolution.' },
  'abstract class':      { fr:'Classe avec au moins une méthode purement virtuelle (= 0). Ne peut pas être instanciée directement — doit être héritée.', en:'Class with at least one purely virtual method (= 0). Cannot be instantiated directly — must be inherited.' },
  'template':            { fr:'Mécanisme C++ pour écrire du code générique qui fonctionne pour plusieurs types. template<typename T> — le compilateur génère une version concrète par type utilisé.', en:'C++ mechanism to write generic code that works for multiple types. template<typename T> — the compiler generates a concrete version per type used.' },
  'iterator':            { fr:'Objet qui pointe vers un élément d\'un conteneur et permet de se déplacer. begin() pointe au premier élément, end() après le dernier.', en:'Object that points to an element in a container and allows traversal. begin() points to the first element, end() past the last.' },
  'lambda':              { fr:'Fonction anonyme définie en ligne. Syntaxe : [capture](params){ corps }. Équivalent de () => en C#.', en:'Anonymous function defined inline. Syntax: [capture](params){ body }. Equivalent of () => in C#.' },
  'callback':            { fr:'Fonction passée en paramètre pour être appelée plus tard. Ex : onHit.subscribe([]() { /* réaction */ });', en:'Function passed as a parameter to be called later. E.g. onHit.subscribe([]() { /* reaction */ });' },
  'constructor':         { fr:'Méthode spéciale appelée automatiquement à la création d\'un objet. Même nom que la classe, pas de type de retour.', en:'Special method called automatically when an object is created. Same name as the class, no return type.' },
  'destructor':          { fr:'Méthode spéciale appelée automatiquement à la destruction d\'un objet. Syntaxe : ~ClassName(). Libère les ressources.', en:'Special method called automatically when an object is destroyed. Syntax: ~ClassName(). Frees resources.' },
  'encapsulation':       { fr:'Principe de masquer les données internes (private) et d\'exposer seulement ce qui est nécessaire (public). Réduit les dépendances et les bugs.', en:'Principle of hiding internal data (private) and exposing only what\'s necessary (public). Reduces dependencies and bugs.' },
  'access modifier':     { fr:'Mot-clé qui contrôle la visibilité d\'un membre : public (accessible partout), private (accessible seulement dans la classe), protected (accessible dans les sous-classes).', en:'Keyword controlling member visibility: public (accessible everywhere), private (class only), protected (class and subclasses).' },
  'cast':                { fr:'Conversion explicite d\'un type vers un autre. En C++ moderne : static_cast<float>(x). En Unreal : Cast<ACharacter>(actor).', en:'Explicit conversion from one type to another. In modern C++: static_cast<float>(x). In Unreal: Cast<ACharacter>(actor).' },
  'dereference':         { fr:'Accéder à la valeur à l\'adresse d\'un pointeur. L\'opérateur * déréférence : *ptr donne la valeur pointée.', en:'Accessing the value at a pointer\'s address. The * operator dereferences: *ptr gives the pointed-to value.' },
  'dangling pointer':    { fr:'Pointeur vers de la mémoire déjà libérée. Déréférencer un dangling pointer cause un crash ou un comportement imprévisible.', en:'Pointer to memory that has already been freed. Dereferencing a dangling pointer causes a crash or unpredictable behavior.' },
  'memory leak':         { fr:'Mémoire allouée (new) mais jamais libérée (delete). S\'accumule silencieusement et peut causer des ralentissements ou crashs.', en:'Memory allocated (new) but never freed (delete). Accumulates silently and can cause slowdowns or crashes.' },
  'undefined behavior':  { fr:'Situation où le standard C++ ne garantit aucun résultat — le programme peut crasher, donner des résultats incorrects, ou sembler fonctionner. Ex : déréférencer nullptr.', en:'Situation where the C++ standard guarantees no specific result — the program may crash, give wrong results, or seem to work. E.g. dereferencing nullptr.' },
  'segfault':            { fr:'Segmentation fault — crash causé par un accès mémoire invalide (nullptr, hors bornes, mémoire libérée). Le signal d\'erreur le plus courant en C++.', en:'Segmentation fault — crash caused by invalid memory access (nullptr, out of bounds, freed memory). The most common C++ error signal.' },
  'implicit conversion': { fr:'Conversion automatique de type effectuée par le compilateur sans instruction explicite. Ex : int divisé par float — l\'int est converti silencieusement.', en:'Automatic type conversion performed by the compiler without explicit instruction. E.g. int divided by float — the int is silently converted.' },
  'container':           { fr:'Structure de données de la STL qui stocke une collection d\'éléments — vector, map, array. Équivalent des collections C#.', en:'STL data structure that stores a collection of elements — vector, map, array. Equivalent to C# collections.' },
  'vector':              { fr:'Tableau dynamique de la STL — taille variable, accès par index. Équivalent de List<T> en C# ou TArray<T> en Unreal.', en:'STL dynamic array — variable size, index access. Equivalent to C#\'s List<T> or Unreal\'s TArray<T>.' },
  'map':                 { fr:'Conteneur STL clé/valeur trié par clé. Équivalent de Dictionary<K,V> en C# ou TMap<K,V> en Unreal.', en:'STL key/value container sorted by key. Equivalent to C#\'s Dictionary<K,V> or Unreal\'s TMap<K,V>.' },
  'algorithm':           { fr:'Fonctions génériques de <algorithm> opérant sur des conteneurs : sort(), find(), count_if(). Fonctionnent avec n\'importe quel conteneur via des itérateurs.', en:'Generic functions from <algorithm> operating on containers: sort(), find(), count_if(). Work with any container via iterators.' },
  'runtime':             { fr:'Moment d\'exécution du programme — par opposition à compile time. Une erreur runtime survient pendant l\'exécution, pas à la compilation.', en:'The moment the program executes — as opposed to compile time. A runtime error occurs during execution, not at compilation.' },
  'compile time':        { fr:'Moment de compilation du code source. Les erreurs de syntaxe et de type sont détectées à compile time — avant que le programme tourne.', en:'The moment source code is compiled. Syntax and type errors are caught at compile time — before the program runs.' },
  'breakpoint':          { fr:'Marqueur placé dans le code qui suspend l\'exécution à cet endroit lors d\'une session de débogage. Permet d\'inspecter les variables.', en:'Marker placed in code that pauses execution at that point during a debug session. Allows inspecting variables.' },
  'call stack':          { fr:'Liste des fonctions en cours d\'exécution, de la plus récente à la plus ancienne. Essentiel pour comprendre un crash — montre le chemin qui a mené à l\'erreur.', en:'List of currently executing functions, from most recent to oldest. Essential for understanding a crash — shows the path that led to the error.' },
  'stack trace':         { fr:'Capture du call stack au moment d\'un crash ou d\'une exception. La première ligne est l\'origine directe du problème.', en:'Capture of the call stack at the moment of a crash or exception. The first line is the direct origin of the problem.' },
  'exception':           { fr:'Mécanisme de signalement d\'erreurs à l\'exécution — throw/catch. En Unreal, les crashs C++ ne passent pas par des exceptions mais par des assertions (check()).', en:'Runtime error-signaling mechanism — throw/catch. In Unreal, C++ crashes don\'t go through exceptions but through assertions (check()).' },
  'reflection':          { fr:'Système qui permet au moteur d\'inspecter les classes et propriétés C++ à l\'exécution. Activé par UCLASS/UPROPERTY/UFUNCTION — rend le GC, l\'éditeur et les Blueprints possibles.', en:'System allowing the engine to inspect C++ classes and properties at runtime. Enabled by UCLASS/UPROPERTY/UFUNCTION — makes the GC, editor, and Blueprints possible.' },
  'serialization':       { fr:'Processus de sauvegarde et rechargement de l\'état d\'un objet (fichiers de niveau, assets). UPROPERTY() marque les variables à sérialiser.', en:'Process of saving and reloading an object\'s state (level files, assets). UPROPERTY() marks variables to serialize.' },
  'deltatime':           { fr:'Durée de la dernière frame en secondes. Multiplier par DeltaTime rend un mouvement indépendant du framerate.', en:'Duration of the last frame in seconds. Multiplying by DeltaTime makes movement frame-rate independent.' },
  'overlap':             { fr:'Type de collision où deux objets s\'interpénètrent et déclenchent un événement, sans se bloquer physiquement. Opposé de Block.', en:'Collision type where two objects interpenetrate and trigger an event, without physically blocking each other. Opposite of Block.' },
  'collision channel':   { fr:'Catégorie de collision Unreal (ECC_Pawn, ECC_Visibility…). Chaque Component répond différemment à chaque channel — Ignore, Overlap, ou Block.', en:'Unreal collision category (ECC_Pawn, ECC_Visibility…). Each Component responds differently to each channel — Ignore, Overlap, or Block.' },
  'input action':        { fr:'Asset Unreal représentant l\'intention d\'entrée d\'un joueur ("Sauter", "Tirer") indépendamment de la touche physique. Fait partie de l\'Enhanced Input System.', en:'Unreal asset representing a player\'s input intent ("Jump", "Fire") independently of the physical key. Part of the Enhanced Input System.' },
  'input mapping context':{ fr:'Asset Unreal qui associe des touches physiques à des InputActions. Peut être empilé et swappé dynamiquement (ex : à pied / en véhicule).', en:'Unreal asset that maps physical keys to InputActions. Can be stacked and swapped dynamically (e.g. on foot / in vehicle).' },
  'variable':       { fr:'Espace nommé en mémoire qui stocke une valeur pouvant changer. Ex : int score = 0; — \'score\' est la variable, 0 est sa valeur.', en:'Named memory slot that stores a value which can change. E.g. int score = 0; — \'score\' is the variable, 0 is its value.' },
  'type':           { fr:'Catégorie d\'une valeur — int (entier), float (décimal), bool (vrai/faux), string (texte). Détermine la taille en mémoire et les opérations permises.', en:'Category of a value — int (whole number), float (decimal), bool (true/false), string (text). Determines memory size and allowed operations.' },
  'operator':       { fr:'Symbole qui effectue une opération sur une ou plusieurs valeurs. Ex : + (addition), == (comparaison), && (et logique), = (affectation).', en:'Symbol that performs an operation on one or more values. E.g. + (addition), == (comparison), && (logical and), = (assignment).' },
  'loop':           { fr:'Bloc de code qui se répète. for répète un nombre connu de fois ; while répète tant qu\'une condition est vraie ; foreach parcourt une collection.', en:'Block of code that repeats. for repeats a known number of times; while repeats as long as a condition is true; foreach iterates a collection.' },
  'condition':      { fr:'Expression évaluée à vrai ou faux qui contrôle l\'exécution. Ex : if (hp > 0) — si hp est supérieur à 0, le bloc s\'exécute.', en:'Expression evaluated as true or false that controls execution. E.g. if (hp > 0) — if hp is greater than 0, the block executes.' },
  'statement':      { fr:'Instruction complète dans un programme. Ex : int x = 5; est un statement. Différent d\'une expression qui produit une valeur.', en:'Complete instruction in a program. E.g. int x = 5; is a statement. Different from an expression which produces a value.' },
  'assignment':     { fr:'Action de stocker une valeur dans une variable avec l\'opérateur =. Ex : score = 10; affecte 10 à score. À ne pas confondre avec == qui compare.', en:'Action of storing a value in a variable with the = operator. E.g. score = 10; assigns 10 to score. Not to be confused with == which compares.' },
  'comparison':     { fr:'Opération qui évalue la relation entre deux valeurs et retourne vrai ou faux. Opérateurs : == (égal), != (différent), > < >= <=.', en:'Operation that evaluates the relationship between two values and returns true or false. Operators: == (equal), != (different), > < >= <=.' },
  'boolean':        { fr:'Type qui ne peut valoir que vrai (true) ou faux (false). Utilisé pour les conditions et les drapeaux. En C++ : bool. En Unreal : bool aussi.', en:'Type that can only be true or false. Used for conditions and flags. In C++: bool. In Unreal: bool as well.' },
  'class':          { fr:'Modèle qui regroupe des données (membres) et des comportements (méthodes) liés. Ex : une classe Player a un health et une méthode TakeDamage().', en:'Blueprint grouping related data (members) and behaviors (methods). E.g. a Player class has health and a TakeDamage() method.' },
  'object':         { fr:'Instance concrète d\'une classe. Si Player est la classe, Player p("Alice") crée un objet p avec ses propres données.', en:'Concrete instance of a class. If Player is the class, Player p("Alice") creates an object p with its own data.' },
  'definition':     { fr:'Code qui fournit le corps complet d\'une fonction ou classe — où la logique réelle est écrite. Différent d\'une déclaration qui donne seulement la signature.', en:'Code that provides the full body of a function or class — where the actual logic is written. Different from a declaration which gives only the signature.' },
  'compiler':       { fr:'Programme qui traduit le code source en fichier exécutable. g++ est le compilateur C++ de ce cours. Détecte les erreurs de syntaxe et de type avant l\'exécution.', en:'Program that translates source code into an executable file. g++ is this course\'s C++ compiler. Detects syntax and type errors before execution.' },
  'ide':            { fr:'Environnement de Développement Intégré — éditeur de code avec outils intégrés : autocomplétion, débogueur, terminal. Ex : VS Code, Visual Studio, Rider.', en:'Integrated Development Environment — code editor with built-in tools: autocomplete, debugger, terminal. E.g. VS Code, Visual Studio, Rider.' },
  'editor':         { fr:'Logiciel pour écrire et modifier du code. Peut être simple (Notepad) ou complet (VS Code avec extensions). Dans Unreal, désigne aussi l\'éditeur de niveaux.', en:'Software for writing and modifying code. Can be simple (Notepad) or full-featured (VS Code with extensions). In Unreal, also refers to the level editor.' },
  'pointer':        { fr:'Variable qui stocke l\'adresse mémoire d\'une autre variable. Permet d\'accéder à un objet ou de le modifier sans le copier. Déclaré avec *.', en:'Variable that stores the memory address of another variable. Allows accessing or modifying an object without copying it. Declared with *.' },
  'address':        { fr:'Emplacement numérique d\'une donnée en mémoire. Chaque variable a une adresse unique. L\'opérateur & donne l\'adresse d\'une variable.', en:'Numeric location of data in memory. Every variable has a unique address. The & operator gives a variable\'s address.' },
  'memory':         { fr:'Espace de stockage temporaire utilisé par un programme en cours d\'exécution. Différent du stockage disque — la mémoire est perdue à la fermeture du programme.', en:'Temporary storage space used by a running program. Different from disk storage — memory is lost when the program closes.' },
  'error':          { fr:'Problème qui empêche le programme de fonctionner correctement. Trois types : erreur de compilation (syntaxe/type), erreur à l\'exécution (crash), erreur logique (résultat incorrect).', en:'Problem that prevents the program from working correctly. Three types: compilation error (syntax/type), runtime error (crash), logic error (wrong result).' },
  'bit':            { fr:'La plus petite unité d\'information — valeur 0 ou 1. 8 bits = 1 octet (byte). Un int de 32 bits peut stocker ~4 milliards de valeurs.', en:'The smallest unit of information — value 0 or 1. 8 bits = 1 byte. A 32-bit int can store ~4 billion values.' },
  'array':          { fr:'Collection d\'éléments du même type stockés en séquence. Accès par index (commence à 0). En C++ : int arr[5]; En C# : int[] arr = new int[5];', en:'Collection of same-type elements stored in sequence. Accessed by index (starts at 0). In C++: int arr[5]; In C#: int[] arr = new int[5];' },
  'list':           { fr:'Collection ordonnée d\'éléments, souvent de taille variable. En C# : List<T>. En C++ STL : std::vector<T>. En Unreal : TArray<T>.', en:'Ordered collection of elements, often variable in size. In C#: List<T>. In C++ STL: std::vector<T>. In Unreal: TArray<T>.' },
  'index':          { fr:'Numéro de position dans un tableau ou une liste. Commence à 0 — le premier élément est à l\'index 0, le deuxième à 1, etc.', en:'Position number in an array or list. Starts at 0 — the first element is at index 0, the second at 1, etc.' },
  'dictionary':     { fr:'Collection de paires clé/valeur. Accès par clé plutôt que par index. En C# : Dictionary<K,V>. En C++ : std::map<K,V>. En Unreal : TMap<K,V>.', en:'Collection of key/value pairs. Accessed by key rather than index. In C#: Dictionary<K,V>. In C++: std::map<K,V>. In Unreal: TMap<K,V>.' },
  'event':          { fr:'Signal indiquant qu\'une chose s\'est produite. Un ou plusieurs écouteurs (listeners) peuvent y réagir. Ex : OnOverlap, OnDeath, OnButtonClicked.', en:'Signal indicating that something occurred. One or more listeners can react to it. E.g. OnOverlap, OnDeath, OnButtonClicked.' },
  'listener':       { fr:'Fonction qui s\'abonne à un événement et est appelée quand il se produit. Aussi appelé handler ou callback selon le contexte.', en:'Function that subscribes to an event and is called when it occurs. Also called handler or callback depending on context.' },
  'blueprint':      { fr:'Système de scripting visuel d\'Unreal Engine — nœuds reliés par des fils au lieu de lignes de code. Accessible aux non-programmeurs et complémentaire au C++.', en:'Unreal Engine\'s visual scripting system — nodes connected by wires instead of lines of code. Accessible to non-programmers and complementary to C++.' },
  'asset':          { fr:'Ressource utilisée dans un jeu : texture, mesh, son, animation, Blueprint, niveau. Les assets sont gérés par le Content Browser dans Unreal.', en:'Resource used in a game: texture, mesh, sound, animation, Blueprint, level. Assets are managed by the Content Browser in Unreal.' },
  'framerate':      { fr:'Nombre d\'images affichées par seconde (FPS). 60 FPS = une nouvelle image toutes les ~16ms. Multiplier par DeltaTime rend le code indépendant du framerate.', en:'Number of images displayed per second (FPS). 60 FPS = a new image every ~16ms. Multiplying by DeltaTime makes code frame-rate independent.' },
  'resolution':     { fr:'Dimensions d\'une image en pixels — ex : 1920×1080. En jeu, affecte la qualité visuelle et les performances. Un rendu haute résolution demande plus de puissance.', en:'Image dimensions in pixels — e.g. 1920×1080. In games, affects visual quality and performance. Higher resolution rendering requires more processing power.' },
  'script':         { fr:'Fichier de code attaché à un objet pour définir son comportement. En Unity : MonoBehaviour en C#. En Unreal : Actor C++ ou Blueprint.', en:'Code file attached to an object to define its behavior. In Unity: MonoBehaviour in C#. In Unreal: C++ Actor or Blueprint.' },
  'function':       { fr:'Bloc de code nommé et réutilisable qui effectue une tâche. Prend des paramètres en entrée, peut retourner une valeur en sortie.', en:'Named, reusable block of code that performs a task. Takes parameters as input, can return a value as output.' },
  'method':         { fr:'Fonction qui appartient à une classe ou un objet. Ex : player.TakeDamage(10) — TakeDamage est une méthode de Player.', en:'Function that belongs to a class or object. E.g. player.TakeDamage(10) — TakeDamage is a method of Player.' },
  'parameter':      { fr:'Variable déclarée dans la signature d\'une fonction. Ex : dans void move(float speed), speed est un paramètre.', en:'Variable declared in a function signature. E.g. in void move(float speed), speed is a parameter.' },
  'return value':   { fr:'Valeur renvoyée par une fonction à l\'appelant. Ex : int add(int a, int b) { return a+b; } — a+b est la valeur de retour.', en:'Value sent back by a function to the caller. E.g. int add(int a, int b) { return a+b; } — a+b is the return value.' },
  'return type':    { fr:'Type de la valeur qu\'une fonction retourne. Ex : int signifie qu\'elle retourne un entier. void signifie qu\'elle ne retourne rien.', en:'Type of the value a function returns. E.g. int means it returns a whole number. void means it returns nothing.' },
  'syntax':         { fr:'Les règles d\'écriture d\'un langage — l\'équivalent de la grammaire. Une erreur de syntaxe = une phrase mal formée que le compilateur ne comprend pas.', en:'The writing rules of a language — equivalent to grammar. A syntax error = a malformed sentence the compiler doesn\'t understand.' },
  'inheritance':    { fr:'Mécanisme par lequel une classe reprend les membres et méthodes d\'une autre. Ex : Dog hérite d\'Animal — Dog a tout ce qu\'Animal a, plus ses propres ajouts.', en:'Mechanism by which a class takes on the members and methods of another. E.g. Dog inherits from Animal — Dog has everything Animal has, plus its own additions.' },
  'interface':      { fr:'Contrat définissant un ensemble de méthodes qu\'une classe doit implémenter, sans fournir le code. En C++, simulée par une classe abstraite avec uniquement des méthodes purement virtuelles.', en:'Contract defining a set of methods a class must implement, without providing the code. In C++, simulated by an abstract class with only purely virtual methods.' },
  'library':        { fr:'Collection de code préécrit et réutilisable que tu peux inclure dans ton projet. Ex : <iostream> est une bibliothèque C++ pour l\'affichage.', en:'Collection of pre-written, reusable code you can include in your project. E.g. <iostream> is a C++ library for output.' },
  'null':           { fr:'Valeur spéciale signifiant "aucun objet" ou "aucune adresse". Un pointeur null ne pointe vers rien — le déréférencer cause un crash.', en:'Special value meaning "no object" or "no address". A null pointer points to nothing — dereferencing it causes a crash.' },
  'reference':      { fr:'Alias direct vers une variable existante — pas une copie. Modifier la référence modifie l\'original. Déclarée avec & en C++.', en:'Direct alias for an existing variable — not a copy. Modifying the reference modifies the original. Declared with & in C++.' },
  'string':         { fr:'Séquence de caractères représentant du texte. En C# : string. En C++ : std::string. Ex : "Bonjour" est une string.', en:'Sequence of characters representing text. In C#: string. In C++: std::string. E.g. "Hello" is a string.' },
  'integer':        { fr:'Nombre entier sans décimale. En C++ : int (32 bits), int32 en Unreal. Ex : 0, -5, 42.', en:'Whole number without a decimal. In C++: int (32-bit), int32 in Unreal. E.g. 0, -5, 42.' },
  'float':          { fr:'Nombre décimal à virgule flottante. Ex : 3.14f, -0.5f. Le suffixe f indique à C++ que c\'est un float et non un double.', en:'Decimal number with a floating point. E.g. 3.14f, -0.5f. The f suffix tells C++ it\'s a float and not a double.' },
  'character':      { fr:'Un seul symbole de texte — lettre, chiffre, ou ponctuation. En C++ : char. Ex : \'A\', \'3\', \'!\'. Différent de string qui est une séquence.', en:'A single text symbol — letter, digit, or punctuation. In C++: char. E.g. \'A\', \'3\', \'!\'. Different from string which is a sequence.' },
  'header':         { fr:'Fichier .h contenant des déclarations (classes, fonctions, types) sans leur implémentation. Inclus avec #include pour les rendre visibles dans d\'autres fichiers.', en:'A .h file containing declarations (classes, functions, types) without their implementation. Included with #include to make them visible in other files.' },
  'enum':           { fr:'Type qui définit un ensemble de valeurs nommées. Ex : enum class State { Idle, Running, Dead }; — plus lisible qu\'utiliser des entiers bruts.', en:'Type that defines a set of named values. E.g. enum class State { Idle, Running, Dead }; — more readable than using raw integers.' },
  'struct':         { fr:'Groupe de variables liées regroupées sous un nom. En C++, similaire à une classe mais avec les membres publics par défaut. Ex : struct Vector2 { float x, y; };', en:'Group of related variables bundled under one name. In C++, similar to a class but with members public by default. E.g. struct Vector2 { float x, y; };' },
  'instance':       { fr:'Un objet concret créé à partir d\'une classe. Si Player est la classe, Player p("Alice") crée une instance p avec ses propres données.', en:'A concrete object created from a class. If Player is the class, Player p("Alice") creates an instance p with its own data.' },
  'property':       { fr:'Variable membre d\'une classe exposée pour lecture ou écriture. En Unreal, UPROPERTY() rend une propriété visible dans l\'éditeur ou les Blueprints.', en:'Member variable of a class exposed for reading or writing. In Unreal, UPROPERTY() makes a property visible in the editor or Blueprints.' },
  'field':          { fr:'Variable stockée directement dans une classe ou struct. Ex : class Player { int health; }; — health est un champ (field).', en:'Variable stored directly in a class or struct. E.g. class Player { int health; }; — health is a field.' },
  'component':      { fr:'Objet attaché à un Actor Unreal pour lui ajouter une fonctionnalité. Ex : USphereComponent pour la collision, UStaticMeshComponent pour le visuel.', en:'Object attached to an Unreal Actor to add functionality. E.g. USphereComponent for collision, UStaticMeshComponent for visuals.' },
  'tick':           { fr:'Mise à jour appelée chaque frame. En Unreal : Tick(float DeltaTime). En Unity : Update(). Toute logique dépendant du temps y est placée.', en:'Update called every frame. In Unreal: Tick(float DeltaTime). In Unity: Update(). Any time-dependent logic goes here.' },
  'frame':          { fr:'Une image calculée et affichée par le moteur. À 60 FPS, le moteur génère 60 frames par seconde. Chaque frame déclenche un Tick/Update.', en:'One image computed and displayed by the engine. At 60 FPS, the engine generates 60 frames per second. Each frame triggers a Tick/Update.' },
  'mesh':           { fr:'Modèle 3D composé de sommets, arêtes et faces. UStaticMeshComponent affiche un mesh dans Unreal. Équivalent du MeshRenderer en Unity.', en:'3D model made of vertices, edges, and faces. UStaticMeshComponent displays a mesh in Unreal. Equivalent of MeshRenderer in Unity.' },
  'collision':      { fr:'Détection du contact entre objets. En Unreal : trois réponses possibles — Ignore (aucun effet), Overlap (événement), Block (blocage physique).', en:'Detection of contact between objects. In Unreal: three possible responses — Ignore (no effect), Overlap (event), Block (physical blocking).' },
  'physics':        { fr:'Simulation de comportements physiques : gravité, collisions, forces. En Unreal, géré par le PhysicsAsset et le CharacterMovementComponent.', en:'Simulation of physical behaviors: gravity, collisions, forces. In Unreal, managed by the PhysicsAsset and CharacterMovementComponent.' },
  'input':          { fr:'Données reçues depuis l\'utilisateur — clavier, souris, manette. En Unreal : géré par l\'Enhanced Input System via InputActions et InputMappingContexts.', en:'Data received from the user — keyboard, mouse, gamepad. In Unreal: managed by the Enhanced Input System via InputActions and InputMappingContexts.' },
  'output':         { fr:'Données produites par un programme vers l\'extérieur — affichage, fichier, réseau. En C++ : std::cout. En Unreal : UE_LOG ou le viewport.', en:'Data produced by a program to the outside — display, file, network. In C++: std::cout. In Unreal: UE_LOG or the viewport.' },
  'log':            { fr:'Message enregistré pendant l\'exécution pour aider au débogage. En Unreal : UE_LOG(LogTemp, Display, TEXT("...")). Visible dans l\'Output Log.', en:'Message recorded during execution to help with debugging. In Unreal: UE_LOG(LogTemp, Display, TEXT("...")). Visible in the Output Log.' },
  'ascii':          { fr:'Standard d\'encodage qui associe un nombre à chaque caractère latin de base. \'A\' = 65, \'a\' = 97, \'0\' = 48. Limité à 128 caractères — pas d\'accents.', en:'Encoding standard that maps a number to each basic Latin character. \'A\' = 65, \'a\' = 97, \'0\' = 48. Limited to 128 characters — no accented letters.' },
  'unicode':        { fr:'Standard d\'encodage universel couvrant tous les systèmes d\'écriture — lettres, idéogrammes, emoji. UTF-8 est l\'encodage Unicode le plus courant.', en:'Universal encoding standard covering all writing systems — letters, ideograms, emoji. UTF-8 is the most common Unicode encoding.' },
  'operation':      { fr:'Action effectuée sur une ou plusieurs valeurs pour produire un résultat. Ex : addition, comparaison, affectation, lecture mémoire.', en:'Action performed on one or more values to produce a result. E.g. addition, comparison, assignment, memory read.' },
  'byte':           { fr:'Unité de base de la mémoire — 8 bits. Un char occupe 1 octet, un int 4 octets, un double 8 octets.', en:'Basic unit of memory — 8 bits. A char occupies 1 byte, an int 4 bytes, a double 8 bytes.' },
  'tree':           { fr:'Structure de données hiérarchique avec un nœud racine et des nœuds enfants. Ex : la hiérarchie d\'Actors dans Unreal, l\'arbre DOM HTML.', en:'Hierarchical data structure with a root node and child nodes. E.g. the Actor hierarchy in Unreal, the HTML DOM tree.' },
  'data structure': { fr:'Façon organisée de stocker et d\'accéder aux données. Ex : tableau (accès rapide par index), liste chaînée (insertion rapide), map (accès par clé).', en:'Organized way of storing and accessing data. E.g. array (fast index access), linked list (fast insertion), map (key-based access).' },
  'recursive':      { fr:'Qualifie une fonction qui s\'appelle elle-même. Utile pour parcourir des structures hiérarchiques. Doit avoir une condition d\'arrêt pour éviter une boucle infinie.', en:'Describes a function that calls itself. Useful for traversing hierarchical structures. Must have a stopping condition to avoid infinite loops.' },
  'debugger':       { fr:'Outil permettant de suspendre l\'exécution, d\'inspecter les variables et d\'avancer pas à pas. Intégré dans VS Code, Visual Studio, et Rider.', en:'Tool that lets you pause execution, inspect variables, and step through code line by line. Built into VS Code, Visual Studio, and Rider.' },
  'queue':          { fr:'Structure de données FIFO (Premier Entré, Premier Sorti). Le premier élément ajouté est le premier retiré — comme une file d\'attente.', en:'FIFO (First In, First Out) data structure. The first element added is the first removed — like a waiting line.' },
  'gui':            { fr:'Interface Graphique Utilisateur — interaction via fenêtres, boutons, menus plutôt que du texte. Ex : l\'éditeur Unreal, VS Code, l\'inspecteur Unity.', en:'Graphical User Interface — interaction via windows, buttons, menus rather than text. E.g. the Unreal editor, VS Code, the Unity inspector.' },
  'cli':            { fr:'Interface en Ligne de Commande — interaction via du texte tapé dans un terminal. Ex : g++ main.cpp -o main. Plus puissant que la GUI pour l\'automatisation.', en:'Command Line Interface — interaction via text typed in a terminal. E.g. g++ main.cpp -o main. More powerful than GUI for automation.' },
  'binary':         { fr:'Système numérique en base 2 — uniquement des 0 et des 1. Tous les programmes et données sont stockés en binaire. Ex : 1010 en binaire = 10 en décimal.', en:'Base-2 number system — only 0s and 1s. All programs and data are stored in binary. E.g. 1010 in binary = 10 in decimal.' },
  'hexadecimal':    { fr:'Système numérique en base 16 : 0–9 puis A–F. Utilisé pour les adresses mémoire, les couleurs (ex : #FF5500), et les opcodes. Préfixe : 0x.', en:'Base-16 number system: 0–9 then A–F. Used for memory addresses, colors (e.g. #FF5500), and opcodes. Prefix: 0x.' },
  'octal':          { fr:'Système numérique en base 8 : chiffres 0–7. Utilisé dans les permissions Unix (ex : chmod 755). Préfixe : 0 en C++.', en:'Base-8 number system: digits 0–7. Used in Unix permissions (e.g. chmod 755). Prefix: 0 in C++.' },
  'floating point': { fr:'Représentation informatique des nombres décimaux. La virgule "flotte" selon l\'exposant. float (32 bits) et double (64 bits) sont les types C++ courants.', en:'Computer representation of decimal numbers. The decimal point "floats" based on an exponent. float (32-bit) and double (64-bit) are common C++ types.' },
  'whitespace':     { fr:'Caractères invisibles : espace, tabulation, retour à la ligne. Le compilateur C++ les ignore généralement. Important en Python qui s\'en sert pour la structure.', en:'Invisible characters: space, tab, newline. The C++ compiler generally ignores them. Important in Python where they define structure.' },
  'alphanumeric':   { fr:'Contenant uniquement des lettres (A–Z, a–z) et des chiffres (0–9). Ex : les noms de variables C++ doivent être alphanumériques (plus _).', en:'Containing only letters (A–Z, a–z) and digits (0–9). E.g. C++ variable names must be alphanumeric (plus _).' },
  'regex':          { fr:'Expression régulière — motif de texte pour chercher ou valider des chaînes. Ex : ^[a-z]+$ vérifie que la chaîne ne contient que des minuscules.', en:'Regular expression — text pattern for searching or validating strings. E.g. ^[a-z]+$ checks that a string contains only lowercase letters.' },
  // ── Reserved words — C++ and C# ──────────────────────────
  'abstract': { fr:'C# : classe ou méthode qui doit être héritée/implémentée — ne peut pas être instanciée directement. Équivalent d\'une classe avec méthode purement virtuelle en C++.', en:'C#: class or method that must be inherited/implemented — cannot be instantiated directly. Equivalent of a class with purely virtual method in C++.' },
  'as': { fr:'C# : cast sécurisé — retourne null si le type ne correspond pas, au lieu de lancer une exception. Ex : Boss b = enemy as Boss;', en:'C#: safe cast — returns null if the type doesn\'t match, instead of throwing an exception. E.g. Boss b = enemy as Boss;' },
  'async': { fr:'C# : marque une méthode comme asynchrone. Permet d\'utiliser await à l\'intérieur. Rarement utilisé en jeu — préférer les coroutines Unity.', en:'C#: marks a method as asynchronous. Allows using await inside. Rarely used in games — prefer Unity coroutines.' },
  'auto': { fr:'C++ : déduit le type automatiquement à la compilation. Équivalent de var en C#. Ex : auto x = 42; — x est déduit comme int.', en:'C++: deduces type automatically at compile time. Equivalent of var in C#. E.g. auto x = 42; — x is deduced as int.' },
  'await': { fr:'C# : suspend l\'exécution d\'une méthode async jusqu\'à la fin d\'une tâche. Utilisé avec Task.', en:'C#: suspends an async method until a task completes. Used with Task.' },
  'base': { fr:'C# : référence vers la classe parente. base.Method() appelle la méthode de la classe parente. Équivalent de Super:: en Unreal C++.', en:'C#: reference to the parent class. base.Method() calls the parent class method. Equivalent of Super:: in Unreal C++.' },
  'break': { fr:'Sort immédiatement d\'une boucle ou d\'un switch. Identique en C# et C++.', en:'Immediately exits a loop or switch. Identical in C# and C++.' },
  'catch': { fr:'Bloc qui intercepte et gère une exception lancée par try. Ex : catch (const std::exception& e) { ... }.', en:'Block that catches and handles an exception thrown by try. E.g. catch (const std::exception& e) { ... }.' },
  'char': { fr:'Type entier 8 bits représentant un caractère ASCII. Ex : char c = \'A\';. En Unreal, le texte utilise FString ou TCHAR plutôt que char.', en:'An 8-bit integer representing an ASCII character. E.g. char c = \'A\';. In Unreal, text uses FString or TCHAR rather than char.' },
  'checked': { fr:'C# : active la vérification de dépassement arithmétique. checked { int x = int.MaxValue + 1; } lance une OverflowException.', en:'C#: enables arithmetic overflow checking. checked { int x = int.MaxValue + 1; } throws an OverflowException.' },
  'const': { fr:'Rend une valeur immuable — ne peut pas être modifiée après initialisation. En Unreal : const FString& Name évite une copie inutile.', en:'Makes a value immutable — cannot be modified after initialization. In Unreal: const FString& Name avoids an unnecessary copy.' },
  'continue': { fr:'Saute le reste du corps de la boucle et passe à l\'itération suivante. Identique en C# et C++.', en:'Skips the rest of the loop body and moves to the next iteration. Identical in C# and C++.' },
  'delete': { fr:'C++ : libère la mémoire allouée par new. delete ptr; pour un objet, delete[] ptr; pour un tableau. Oublier delete = memory leak.', en:'C++: frees memory allocated by new. delete ptr; for an object, delete[] ptr; for an array. Forgetting delete = memory leak.' },
  'do': { fr:'Boucle do-while : exécute le bloc au moins une fois avant de tester la condition. Ex : do { ... } while (condition);', en:'do-while loop: executes the block at least once before testing the condition. E.g. do { ... } while (condition);' },
  'double': { fr:'Nombre décimal 64 bits — deux fois plus précis que float. En jeu, float suffit généralement. Unreal utilise float pour les vecteurs et la physique.', en:'64-bit decimal number — twice the precision of float. In games, float is usually sufficient. Unreal uses float for vectors and physics.' },
  'else': { fr:'Bloc exécuté quand la condition du if précédent est fausse. Peut être chaîné : else if (...) { ... } else { ... }.', en:'Block executed when the preceding if condition is false. Can be chained: else if (...) { ... } else { ... }.' },
  'enum': { fr:'Type définissant un ensemble de valeurs nommées. En C++11 : enum class State { Idle, Running }; — préférer enum class à enum pour éviter les collisions.', en:'Type defining a set of named values. In C++11: enum class State { Idle, Running }; — prefer enum class over enum to avoid name collisions.' },
  'explicit': { fr:'Empêche la conversion implicite d\'un constructeur à un seul paramètre. Évite des bugs subtils dus à des conversions automatiques non souhaitées.', en:'Prevents implicit conversion of a single-parameter constructor. Avoids subtle bugs from unwanted automatic conversions.' },
  'false': { fr:'Valeur booléenne faux. En C++ et C# : bool done = false;. Identique dans les deux langages.', en:'Boolean value false. In C++ and C#: bool done = false;. Identical in both languages.' },
  'for': { fr:'Boucle avec initialisation, condition et incrément. Ex : for (int i = 0; i < 5; i++). Identique en C# et C++.', en:'Loop with initialization, condition, and increment. E.g. for (int i = 0; i < 5; i++). Identical in C# and C++.' },
  'foreach': { fr:'C# : parcourt tous les éléments d\'une collection. foreach (var item in list). En C++ : for (const auto& item : list).', en:'C#: iterates over all elements of a collection. foreach (var item in list). In C++: for (const auto& item : list).' },
  'if': { fr:'Exécute un bloc seulement si une condition est vraie. Identique en C# et C++. Toujours suivi d\'une condition entre parenthèses.', en:'Executes a block only if a condition is true. Identical in C# and C++. Always followed by a condition in parentheses.' },
  'in': { fr:'C# : séparateur du foreach. foreach (var x in list). En C++ : remplacé par : dans le range-based for.', en:'C#: foreach separator. foreach (var x in list). In C++: replaced by : in the range-based for.' },
  'inline': { fr:'Suggestion au compilateur de substituer l\'appel de fonction par son code directement. Peut améliorer les performances pour les petites fonctions fréquemment appelées.', en:'Suggestion to the compiler to substitute the function call with its code directly. Can improve performance for small frequently called functions.' },
  'interface': { fr:'C# : contrat définissant des méthodes sans implémentation. Une classe peut implémenter plusieurs interfaces. En C++, simulée par une classe abstraite pure.', en:'C#: contract defining methods without implementation. A class can implement multiple interfaces. In C++, simulated by a pure abstract class.' },
  'is': { fr:'C# : teste si un objet est d\'un certain type. Ex : if (enemy is Boss b) { ... } — combine test et cast en une expression.', en:'C#: tests if an object is of a certain type. E.g. if (enemy is Boss b) { ... } — combines test and cast in one expression.' },
  'long': { fr:'Entier 32 ou 64 bits selon la plateforme. Préférer int32/int64 en Unreal pour des tailles garanties.', en:'32 or 64-bit integer depending on the platform. Prefer int32/int64 in Unreal for guaranteed sizes.' },
  'namespace': { fr:'C# : regroupe des types sous un nom pour éviter les conflits. using MonJeu.Gameplay; importe le namespace. En C++ : namespace MonJeu { ... }', en:'C#: groups types under a name to avoid conflicts. using MyGame.Gameplay; imports the namespace. In C++: namespace MyGame { ... }' },
  'new': { fr:'C++ : alloue de la mémoire sur le heap et retourne un pointeur. Ex : int* p = new int(5);. Doit être suivi d\'un delete correspondant.', en:'C++: allocates memory on the heap and returns a pointer. E.g. int* p = new int(5);. Must be followed by a corresponding delete.' },
  'null': { fr:'C# : valeur d\'une référence qui ne pointe vers aucun objet. En C++ : nullptr. Toujours vérifier avant d\'accéder — une référence null provoque un crash.', en:'C#: value of a reference pointing to no object. In C++: nullptr. Always check before accessing — a null reference causes a crash.' },
  'nullptr': { fr:'C++11 : pointeur nul typé. Préféré à NULL ou 0 car évite les ambiguïtés de surcharge. Toujours tester IsValid() ou != nullptr avant de déréférencer.', en:'C++11: typed null pointer. Preferred over NULL or 0 as it avoids overload ambiguities. Always check IsValid() or != nullptr before dereferencing.' },
  'out': { fr:'C# : paramètre de sortie — doit être assigné dans la fonction. Ex : bool TryParse(string s, out int result). Permet de retourner plusieurs valeurs.', en:'C#: output parameter — must be assigned inside the function. E.g. bool TryParse(string s, out int result). Allows returning multiple values.' },
  'override': { fr:'C# et C++ : surcharge une méthode virtuelle de la classe parente. En C#, virtual doit être sur la méthode parente. En C++, override est optionnel mais recommandé.', en:'C# and C++: overrides a virtual method from the parent class. In C#, virtual must be on the parent method. In C++, override is optional but recommended.' },
  'params': { fr:'C# : paramètre tableau de longueur variable. Ex : void Log(params string[] msgs) — peut être appelé avec n\'importe quel nombre d\'arguments.', en:'C#: variable-length array parameter. E.g. void Log(params string[] msgs) — can be called with any number of arguments.' },
  'private': { fr:'Modificateur d\'accès : membre accessible seulement depuis l\'intérieur de la classe. Par défaut dans les classes C++.', en:'Access modifier: member accessible only from inside the class. Default in C++ classes.' },
  'protected': { fr:'Modificateur d\'accès : membre accessible depuis la classe et ses classes dérivées, mais pas de l\'extérieur.', en:'Access modifier: member accessible from the class and its derived classes, but not from outside.' },
  'public': { fr:'Modificateur d\'accès : membre accessible depuis n\'importe quel code. En C++ : étiquette de bloc (public:). En C# : mot-clé par membre.', en:'Access modifier: member accessible from any code. In C++: block label (public:). In C#: per-member keyword.' },
  'readonly': { fr:'C# : champ qui ne peut être assigné qu\'à la déclaration ou dans le constructeur. Similaire à const mais évalué à l\'exécution.', en:'C#: field that can only be assigned at declaration or in the constructor. Similar to const but evaluated at runtime.' },
  'ref': { fr:'C# : passe un argument par référence — la fonction peut modifier la variable originale. Ex : void Add(ref int x) { x++; }. Similaire à & en C++.', en:'C#: passes an argument by reference — the function can modify the original variable. E.g. void Add(ref int x) { x++; }. Similar to & in C++.' },
  'return': { fr:'Termine une fonction et renvoie une valeur à l\'appelant. Ex : return a + b; envoie le résultat. Dans une fonction void, return; seul quitte la fonction.', en:'Ends a function and sends a value back to the caller. E.g. return a + b; sends the result. In a void function, return; alone exits.' },
  'sealed': { fr:'C# : empêche une classe d\'être héritée, ou une méthode d\'être surchargée. Équivalent de final en C++11.', en:'C#: prevents a class from being inherited, or a method from being overridden. Equivalent of final in C++11.' },
  'short': { fr:'Entier 16 bits : -32768 à 32767. Utilisé quand la mémoire est critique. Rarement nécessaire dans le code de jeu.', en:'16-bit integer: -32768 to 32767. Used when memory is critical. Rarely needed in game code.' },
  'sizeof': { fr:'Opérateur qui retourne la taille en octets d\'un type ou d\'une variable. sizeof(int) vaut généralement 4. Évalué à la compilation.', en:'Operator returning the size in bytes of a type or variable. sizeof(int) is usually 4. Evaluated at compile time.' },
  'static': { fr:'C# : membre appartenant à la classe, pas à une instance. GameManager.Instance est un membre static — un seul existe pour toute l\'application.', en:'C#: member belonging to the class, not an instance. GameManager.Instance is a static member — only one exists for the whole application.' },
  'string': { fr:'Séquence de caractères. En C# : string (alias de System.String). En C++ : std::string. En Unreal C++ : FString pour le texte Unicode.', en:'Sequence of characters. In C#: string (alias for System.String). In C++: std::string. In Unreal C++: FString for Unicode text.' },
  'struct': { fr:'Groupe de variables liées sous un nom. En C++, identique à class mais membres publics par défaut. En Unreal : préfixe F (ex : FVector).', en:'Group of related variables under one name. In C++, identical to class but members public by default. In Unreal: F prefix (e.g. FVector).' },
  'switch': { fr:'Branchement multi-cas sur une valeur. Chaque cas doit se terminer par break; en C++ — sinon l\'exécution tombe dans le cas suivant (fallthrough).', en:'Multi-case branch on a value. Each case must end with break; in C++ — otherwise execution falls into the next case (fallthrough).' },
  'template': { fr:'Mécanisme C++ pour du code générique. template<typename T> permet d\'écrire une fonction ou classe qui fonctionne pour tout type T.', en:'C++ mechanism for generic code. template<typename T> lets you write a function or class that works for any type T.' },
  'this': { fr:'Référence vers l\'instance courante à l\'intérieur d\'une méthode. Ex : this.health = 100; en C#. En C++ : this->health = 100;', en:'Reference to the current instance inside a method. E.g. this.health = 100; in C#. In C++: this->health = 100;' },
  'throw': { fr:'Lance une exception pour signaler une erreur. Ex : throw std::runtime_error("message");. En Unreal, préférer check() ou ensure() aux exceptions.', en:'Throws an exception to signal an error. E.g. throw std::runtime_error("message");. In Unreal, prefer check() or ensure() over exceptions.' },
  'true': { fr:'Valeur booléenne vrai. En C++ et C# : bool flag = true;. Identique dans les deux langages.', en:'Boolean value true. In C++ and C#: bool flag = true;. Identical in both languages.' },
  'try': { fr:'Bloc qui surveille les exceptions. Si une exception est lancée à l\'intérieur, le bloc catch correspondant est exécuté.', en:'Block that monitors for exceptions. If an exception is thrown inside, the matching catch block executes.' },
  'typedef': { fr:'Crée un alias pour un type existant. Ex : typedef unsigned int uint;. Remplacé par using en C++11 mais encore courant dans du code legacy.', en:'Creates an alias for an existing type. E.g. typedef unsigned int uint;. Replaced by using in C++11 but still common in legacy code.' },
  'typename': { fr:'Introduit un paramètre de type dans un template. template<typename T> — T est un nom de type fourni par l\'appelant.', en:'Introduces a type parameter in a template. template<typename T> — T is a type name provided by the caller.' },
  'typeof': { fr:'C# : retourne l\'objet Type d\'un type. Ex : typeof(Player). Utilisé avec la réflexion. Ne pas confondre avec GetType() qui s\'appelle sur une instance.', en:'C#: returns the Type object of a type. E.g. typeof(Player). Used with reflection. Not to be confused with GetType() called on an instance.' },
  'unchecked': { fr:'C# : désactive la vérification de dépassement arithmétique (comportement par défaut). Le dépassement silencieux peut causer des bugs.', en:'C#: disables arithmetic overflow checking (default behavior). Silent overflow can cause bugs.' },
  'unsigned': { fr:'Modificateur de type entier : pas de valeur négative, donc double la plage positive. Ex : unsigned int stocke 0 à ~4 milliards au lieu de -2G à +2G.', en:'Integer type modifier: no negative values, so double the positive range. E.g. unsigned int stores 0 to ~4 billion instead of -2B to +2B.' },
  'using': { fr:'C# : importe un namespace (using System;) ou déclare une ressource à fermer automatiquement (using var f = File.Open(...)).', en:'C#: imports a namespace (using System;) or declares a resource to close automatically (using var f = File.Open(...)).' },
  'var': { fr:'C# : déduit le type de la variable à la compilation. Ex : var score = 0; — score est déduit comme int. Équivalent de auto en C++.', en:'C#: deduces the variable\'s type at compile time. E.g. var score = 0; — score is deduced as int. Equivalent of auto in C++.' },
  'virtual': { fr:'Marque une méthode comme pouvant être surchargée par une classe dérivée. Active le dispatch dynamique — l\'appel résout la bonne version au runtime selon le type réel.', en:'Marks a method as overridable by a derived class. Enables dynamic dispatch — the call resolves to the correct version at runtime based on the actual type.' },
  'void': { fr:'Type de retour signifiant "ne retourne rien". Ex : void printScore() { ... } — la fonction affiche mais ne retourne pas de valeur.', en:'Return type meaning "returns nothing". E.g. void printScore() { ... } — the function displays but returns no value.' },
  'while': { fr:'Boucle qui répète tant qu\'une condition est vraie. Ex : while (hp > 0) { ... }. Identique en C# et C++.', en:'Loop that repeats as long as a condition is true. E.g. while (hp > 0) { ... }. Identical in C# and C++.' },
  'yield': { fr:'C# : retourne une valeur d\'un énumérateur, ou suspend une coroutine Unity. yield return new WaitForSeconds(1f); attend 1 seconde.', en:'C#: returns a value from an enumerator, or suspends a Unity coroutine. yield return new WaitForSeconds(1f); waits 1 second.' },
};

// Terms sorted longest-first to avoid partial matches (e.g. "dangling pointer" before "pointer")
const _GLOSS_TERMS = Object.keys(GLOSSARY).sort((a,b)=>b.length-a.length);

// Track which terms have already been marked on this page
const _glossUsed = new Set();

function applyGlossary(rootEl){
  if(!rootEl) return;

  // ── Pass 1: badge first use of each term inside <code> elements ──
  rootEl.querySelectorAll('code').forEach(codeEl=>{
    if(codeEl.closest('.gloss-term')) return;
    const text = codeEl.textContent;
    for(const term of _GLOSS_TERMS){
      if(_glossUsed.has(term)) continue;
      const re = new RegExp(`\\b(${term.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')})\\b`, 'i');
      if(re.test(text)){
        _glossUsed.add(term);
        const btn = document.createElement('button');
        btn.className = 'gloss-btn';
        btn.dataset.term = term.toLowerCase();
        btn.setAttribute('aria-label', 'Définition');
        btn.textContent = '?';
        const wrap = document.createElement('span');
        wrap.className = 'gloss-term';
        codeEl.parentNode.insertBefore(wrap, codeEl);
        wrap.appendChild(codeEl);
        wrap.appendChild(btn);
        break;
      }
    }
  });

  // ── Pass 2: badge first use of each term in prose text nodes ──
  const walker = document.createTreeWalker(
    rootEl,
    NodeFilter.SHOW_TEXT,
    { acceptNode: n => {
        const p = n.parentElement;
        if(!p) return NodeFilter.FILTER_REJECT;
        const tag = p.tagName.toLowerCase();
        // Skip code/script/style/form elements
        if(['code','pre','button','input','textarea','script','style'].includes(tag))
          return NodeFilter.FILTER_REJECT;
        // Skip inside code-block divs, existing gloss spans, badges
        if(p.closest('.code-block,.code-cmd,.bug-code,.cpanel,.gloss-term,.abadge'))
          return NodeFilter.FILTER_REJECT;
        return NodeFilter.FILTER_ACCEPT;
    }}
  );

  const nodes = [];
  let n;
  while((n=walker.nextNode())) nodes.push(n);

  nodes.forEach(node=>{
    const text = node.textContent;
    let replaced = false;
    let html = '';
    let last = 0;

    for(const term of _GLOSS_TERMS){
      if(_glossUsed.has(term)) continue;
      const re = new RegExp(`\\b(${term.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')})\\b`, 'gi');
      const m = re.exec(text);
      if(m){
        _glossUsed.add(term);
        html += escHtml(text.slice(last, m.index));
        html += `<span class="gloss-term">${escHtml(m[1])}<button class="gloss-btn" data-term="${term.toLowerCase()}" aria-label="Définition">?</button></span>`;
        last = m.index + m[0].length;
        replaced = true;
        break;
      }
    }

    if(replaced){
      html += escHtml(text.slice(last));
      const span = document.createElement('span');
      span.innerHTML = html;
      node.parentNode.replaceChild(span, node);
    }
  });
}

function escHtml(s){ return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }

// ── Tooltip singleton ─────────────────────────────────────────
// ── Glossary drawer ───────────────────────────────────────────
function initGlossaryDrawer(){
  if(document.getElementById('gloss-drawer')) return;

  // Floating tab
  const tab = document.createElement('button');
  tab.id = 'gloss-tab';
  tab.setAttribute('aria-label', L==='fr' ? 'Ouvrir le glossaire' : 'Open glossary');
  tab.innerHTML = `<span class="gloss-tab-icon">📖</span><span class="gloss-tab-label">${L==='fr'?'Glossaire':'Glossary'}</span>`;
  tab.onclick = toggleGlossDrawer;
  document.body.appendChild(tab);

  // Drawer
  const drawer = document.createElement('div');
  drawer.id = 'gloss-drawer';
  drawer.setAttribute('aria-hidden','true');
  drawer.innerHTML = `
    <div class="gloss-drawer-hdr">
      <span>${L==='fr'?'Glossaire':'Glossary'}</span>
      <button class="gloss-drawer-close" onclick="toggleGlossDrawer()" aria-label="Fermer">✕</button>
    </div>
    <div class="gloss-drawer-search-wrap">
      <input id="gloss-search" type="text" placeholder="${L==='fr'?'Chercher un terme…':'Search a term…'}"
        autocomplete="off" spellcheck="false" oninput="filterGloss(this.value)">
    </div>
    <div class="gloss-drawer-list" id="gloss-list"></div>`;
  document.body.appendChild(drawer);

  // Overlay (mobile)
  const overlay = document.createElement('div');
  overlay.id = 'gloss-overlay';
  overlay.onclick = toggleGlossDrawer;
  document.body.appendChild(overlay);

  renderGlossList('');
}

function toggleGlossDrawer(){
  const drawer  = document.getElementById('gloss-drawer');
  const overlay = document.getElementById('gloss-overlay');
  const tab     = document.getElementById('gloss-tab');
  if(!drawer) return;
  const open = drawer.classList.toggle('open');
  drawer.setAttribute('aria-hidden', String(!open));
  if(overlay) overlay.classList.toggle('show', open);
  if(tab) tab.classList.toggle('active', open);
  if(open){
    const inp = document.getElementById('gloss-search');
    if(inp) setTimeout(()=>inp.focus(), 120);
  }
}

function filterGloss(q){
  renderGlossList(q.trim().toLowerCase());
}

function glossLangPill(def){
  const hasCpp = /^C\+\+\s*:|identique en C#\s*et\s*C\+\+|identical in C#\s*and\s*C\+\+/i.test(def);
  const hasCs  = /^C#\s*:|identique en C#\s*et\s*C\+\+|identical in C#\s*and\s*C\+\+/i.test(def);
  if(hasCpp && hasCs) return `<span class="gloss-lang gloss-lang-both">C# + C++</span>`;
  if(hasCpp)          return `<span class="gloss-lang gloss-lang-cpp">C++</span>`;
  if(hasCs)           return `<span class="gloss-lang gloss-lang-cs">C#</span>`;
  return '';
}

function renderGlossList(q){
  const list = document.getElementById('gloss-list');
  if(!list) return;
  const all = Object.keys(GLOSSARY).sort((a,b)=>a.localeCompare(b));
  const filtered = q ? all.filter(t=>t.includes(q) || (GLOSSARY[t][L]||GLOSSARY[t].fr).toLowerCase().includes(q)) : all;
  if(!filtered.length){
    list.innerHTML = `<p class="gloss-empty">${L==='fr'?'Aucun résultat.':'No results.'}</p>`;
    return;
  }
  list.innerHTML = filtered.map(term=>{
    const raw = GLOSSARY[term][L] || GLOSSARY[term].fr;
    const def = raw.replace(/</g,'&lt;').replace(/>/g,'&gt;');
    const pill = glossLangPill(raw);
    return `<div class="gloss-entry">
      <div class="gloss-entry-top">
        <span class="gloss-entry-term">${term}</span>
        ${pill}
      </div>
      <span class="gloss-entry-def">${def}</span>
    </div>`;
  }).join('');
}

function initGlossaryTip(){
  if(document.getElementById('gloss-tip')) return;
  const tip = document.createElement('div');
  tip.id = 'gloss-tip';
  tip.setAttribute('role','tooltip');
  document.body.appendChild(tip);

  // Hide on outside click/touch
  document.addEventListener('click', e=>{
    if(!e.target.closest('.gloss-btn,.gloss-tip')) hideGlossTip();
  });
}

function showGlossTip(btn){
  const term = btn.dataset.term;
  const def  = GLOSSARY[term];
  if(!def) return;
  const tip = document.getElementById('gloss-tip');
  if(!tip) return;
  tip.textContent = def[L] || def.fr;
  tip.classList.add('show');

  // Position above the button, clamped to viewport
  const r   = btn.getBoundingClientRect();
  const tw  = Math.min(320, window.innerWidth - 32);
  tip.style.maxWidth = tw + 'px';
  let left = r.left + r.width/2 - tw/2 + window.scrollX;
  left = Math.max(12 + window.scrollX, Math.min(left, window.innerWidth - tw - 12 + window.scrollX));
  const top = r.top + window.scrollY - tip.offsetHeight - 10;
  tip.style.left = left + 'px';
  tip.style.top  = (top < window.scrollY + 8 ? r.bottom + window.scrollY + 8 : top) + 'px';
}

function hideGlossTip(){
  const tip = document.getElementById('gloss-tip');
  if(tip) tip.classList.remove('show');
}

// Delegate hover + tap on gloss buttons
document.addEventListener('mouseover', e=>{
  if(e.target.classList.contains('gloss-btn')) showGlossTip(e.target);
});
document.addEventListener('mouseout', e=>{
  if(e.target.classList.contains('gloss-btn')) hideGlossTip();
});
document.addEventListener('click', e=>{
  if(e.target.classList.contains('gloss-btn')){ e.stopPropagation(); showGlossTip(e.target); }
});

// ── Footer ────────────────────────────────────────────────────
function injectFooter(){
  const FOOTER = {
    fr:`<footer class="site-footer-credits">
  <div class="footer-inner">
    <p class="footer-heading">Comment cet outil a été créé</p>
    <p>Ce site a été construit en collaboration itérative entre <strong>Elisa Schaeffer</strong>, doyen·ne de la Technologie et du Design au Collège LaSalle Montréal, et <strong>Claude</strong> (Anthropic), un assistant IA. Le contenu pédagogique, la structure, les activités, les priorités et les choix éditoriaux ont été définis, questionnés et affinés par Elisa à chaque étape. Claude a généré le code, proposé des formulations et signalé des incohérences — mais chaque décision substantielle a été prise par un être humain.</p>
    <p>Ce n'est pas du contenu IA à usage unique. C'est le résultat d'un dialogue de révision prolongé : chaque session a été lue, critiquée et corrigée. L'outil évolue.</p>
    <p class="footer-note">Utilisation réfléchie de l'IA — L'IA générative est un outil de travail, pas un substitut au jugement professionnel. Ce projet illustre une approche où <strong>l'humain reste auteur</strong> : l'IA amplifie la capacité de production, mais la responsabilité éditoriale, pédagogique et éthique demeure entièrement humaine. Dernière mise à jour : avril 2026.</p>
  </div>
</footer>`,
    en:`<footer class="site-footer-credits">
  <div class="footer-inner">
    <p class="footer-heading">How this tool was made</p>
    <p>This site was built through iterative collaboration between <strong>Elisa Schaeffer</strong>, Dean of Technology and Design at Collège LaSalle Montréal, and <strong>Claude</strong> (Anthropic), an AI assistant. The pedagogical content, structure, activities, priorities, and editorial choices were defined, questioned, and refined by Elisa at every step. Claude generated the code, proposed phrasings, and flagged inconsistencies — but every substantive decision was made by a human.</p>
    <p>This is not one-shot AI content. It is the result of a prolonged review dialogue: every session was read, critiqued, and corrected. The tool evolves.</p>
    <p class="footer-note">Thoughtful AI use — Generative AI is a work tool, not a substitute for professional judgment. This project illustrates an approach where <strong>the human remains the author</strong>: AI amplifies production capacity, but editorial, pedagogical, and ethical responsibility remains entirely human. Last updated: April 2026.</p>
  </div>
</footer>`
  };
  const el = document.createElement('div');
  el.innerHTML = FOOTER[L] || FOOTER.fr;
  document.body.appendChild(el.firstElementChild);
}

// ── Auto-init ─────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded',()=>{
  initHeader();
  initGlossaryTip();
  initGlossaryDrawer();
  injectFooter();
  if(typeof SESSION!=='undefined'&&SESSION.solo) initM0Page();
  else if(typeof SESSION!=='undefined') initSessionPage();
  else if(typeof initHome==='function') initHome();
  initCopyButtons();
  setTimeout(()=>{
    initCopyButtons();
    applyGlossary(document.getElementById('panel-m0'));
    applyGlossary(document.getElementById('sess-concept'));
    applyGlossary(document.getElementById('panel-ide'));
    applyGlossary(document.getElementById('panel-engine'));
  }, 350);
});

