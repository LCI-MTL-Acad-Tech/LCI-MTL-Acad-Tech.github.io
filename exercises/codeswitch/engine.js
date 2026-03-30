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

let L = getCookie('cs_lang') || 'fr';

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
  L=L==='fr'?'en':'fr';
  setCookie('cs_lang',L,365);
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

// ── Header ────────────────────────────────────────────────────
function initHeader(){
  document.documentElement.lang=L;
  const lb=document.getElementById('lang-btn');
  if(lb){ lb.textContent=t('langBtn'); lb.onclick=toggleLang; }
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
        <div class="cpanel"><div class="cpanel-hdr cpp-std">C++ standard</div><pre>${data.compare.std}</pre></div>
        <div class="cpanel"><div class="cpanel-hdr cpp">C++ — Unreal</div><pre>${data.compare.unreal}</pre></div>
      </div>`;
    } else {
      h+=`<div class="compare">
        <div class="cpanel"><div class="cpanel-hdr cs">C# — Unity</div><pre>${data.compare.cs}</pre></div>
        <div class="cpanel"><div class="cpanel-hdr cpp">C++ — Unreal</div><pre>${data.compare.cpp}</pre></div>
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
  const allActs=[...(SESSION.ide?.activities||[]),...(SESSION.engine?.activities||[])];
  const act=allActs.find(a=>a.id===actId);
  if(!act) return;
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
  const rec=_lsGet(sessId);
  if(!rec[ns]) rec[ns]={};
  rec[ns][actId]=!rec[ns][actId];
  _lsSet(sessId,rec);
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
  const data=ns==='ide'?S.ide:S.engine;
  const acts=data?.activities||[];
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

const TXT_M0 = {
  fr:{
    tryItLabel:'Essaie ce code en ligne — aucune installation',
    tryItNote:'S\'ouvre dans onecompiler.com — clique Run ▶ pour exécuter',
    diffPrompt:'Qu\'est-ce qui a changé entre le C# et le C++ ?',
    actLabel:'Activités — C# ↔ C++',
    diffLabel:'Spot la diff',
    markDone:'Marquer terminé',
  },
  en:{
    tryItLabel:'Try this code online — no install needed',
    tryItNote:'Opens in onecompiler.com — click Run ▶ to execute',
    diffPrompt:'What changed between C# and C++?',
    actLabel:'Activities — C# ↔ C++',
    diffLabel:'Spot the diff',
    markDone:'Mark Complete',
  }
};
function tm0(k){ return TXT_M0[L][k]||k; }

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
  if(panel) panel.innerHTML=renderM0Panel(S);

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
  let h=`<div class="m0-concept-block">
    <h3 class="m0-concept-title">${concept.title[L]}</h3>
    <p class="m0-concept-body">${concept.body[L]}</p>`;

  // Side-by-side code comparison
  h+=`<div class="m0-side-by-side">
    <div class="m0-col">
      <div class="m0-lang-hdr cs-hdr">C# — Unity / .NET</div>
      <div class="code-block" style="white-space:pre-wrap">${concept.cs}</div>
    </div>
    <div class="m0-col">
      <div class="m0-lang-hdr cpp-hdr">C++ — équivalent</div>
      <div class="code-block" style="white-space:pre-wrap">${concept.cpp}</div>
    </div>
  </div>`;

  // Single web compiler link (OneCompiler, pre-set to C++)
  if(concept.runUrl){
    h+=`<div class="m0-run-row">
      <a class="m0-run-btn" href="${concept.runUrl}" target="_blank">
        <span>▶</span> ${tm0('tryItLabel')}
      </a>
      <span class="m0-run-note">${tm0('tryItNote')}</span>
    </div>`;
  }

  // Key differences callout
  if(concept.diff){
    h+=`<div class="m0-diff-callout">
      <strong>${L==='fr'?'Ce qui change :':'What changes:'}</strong>
      <ul>${concept.diff[L].map(d=>`<li>${d}</li>`).join('')}</ul>
    </div>`;
  }

  // Activities for this concept
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
      <div class="code-block" style="white-space:pre-wrap;font-size:1.25rem">${act.cs}</div></div>
    <div class="m0-diff-col"><div class="m0-diff-col-hdr cpp-hdr">C++</div>
      <div class="code-block" style="white-space:pre-wrap;font-size:1.25rem">${act.cpp}</div></div>
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

// ── Auto-init ─────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded',()=>{
  initHeader();
  if(typeof SESSION!=='undefined'&&SESSION.solo) initM0Page();
  else if(typeof SESSION!=='undefined') initSessionPage();
  else if(typeof initHome==='function') initHome();
});

