'use strict';
// ================================================================
// CODE//SWITCH — Shared Engine
// Loaded by every page (index + all session pages)
// Depends on: SESSION global (set by each sNN.js)
// ================================================================

// ── Language ──────────────────────────────────────────────────
let L = getCookie('cs_lang') || 'fr';

const TXT = {
  fr: {
    back:'Accueil', langBtn:'EN',
    heroTitle:'De C# Unity<br>vers <em>C++ Unreal</em>',
    heroSub:"Renforce tes bases de programmation et réduis la charge cognitive du passage d'un moteur à l'autre — une session à la fois.",
    xpLabel:'points accumulés',
    sessAvail:'Disponible', sessDone:'Terminée', sessLocked:'Verrouillée', sessPartial:'En cours',
    tutorTab:'Intro tuteur·rice', studentTab:'Activités autonomes',
    tutorBadge:'MODE TUTEUR·RICE — Session interactive (~45 min)',
    demoTitle:'Démonstration en direct',
    discTitle:'Questions de discussion',
    deepToggle:'Approfondir — <span>contenu avancé (optionnel)</span>',
    actLabel:'Activités autonomes',
    checkBtn:'Vérifier', nextBtn:'Suivant →', retryBtn:'Réessayer', revealBtn:'Voir la solution',
    homeBtn:'Accueil', nextSessBtn:'Session suivante →',
    markDone:'Marquer terminé',
    hint:'Indice',
    quizLabel:'Quiz', fillLabel:'Complète le code', bugLabel:'Trouve le bug',
    engineLabel:'Dans le moteur', reflectLabel:'Réflexion',
    of:(a,b)=>`${a} / ${b}`,
    sessionsOf:(a,b)=>`${a} session${a!==1?'s':''} terminée${a!==1?'s':''} sur ${b}`,
    xpGain:n=>`+${n} XP`,
    unlockMsg:s=>`🔓 Déverrouillée : ${s}`,
  },
  en: {
    back:'Home', langBtn:'FR',
    heroTitle:'From C# Unity<br>to <em>C++ Unreal</em>',
    heroSub:'Strengthen your programming fundamentals and reduce the cognitive load of switching engines — one session at a time.',
    xpLabel:'points earned',
    sessAvail:'Available', sessDone:'Completed', sessLocked:'Locked', sessPartial:'In Progress',
    tutorTab:'Tutor Intro', studentTab:'Independent Activities',
    tutorBadge:'TUTOR MODE — Live interactive session (~45 min)',
    demoTitle:'Live Demonstration',
    discTitle:'Discussion Prompts',
    deepToggle:'Go Deeper — <span>advanced content (optional)</span>',
    actLabel:'Independent Activities',
    checkBtn:'Check', nextBtn:'Next →', retryBtn:'Try Again', revealBtn:'Show Solution',
    homeBtn:'Home', nextSessBtn:'Next Session →',
    markDone:'Mark Complete',
    hint:'Hint',
    quizLabel:'Quiz', fillLabel:'Complete the Code', bugLabel:'Find the Bug',
    engineLabel:'In the Engine', reflectLabel:'Reflection',
    of:(a,b)=>`${a} / ${b}`,
    sessionsOf:(a,b)=>`${a} of ${b} session${b!==1?'s':''} completed`,
    xpGain:n=>`+${n} XP`,
    unlockMsg:s=>`🔓 Unlocked: ${s}`,
  }
};
function t(k,...a){ const v=TXT[L][k]; return typeof v==='function'?v(...a):v||k; }

function toggleLang(){
  L = L==='fr'?'en':'fr';
  setCookie('cs_lang',L,365);
  location.reload();
}

// ── Cookies ───────────────────────────────────────────────────
function setCookie(n,v,d){ const e=new Date(); e.setTime(e.getTime()+d*864e5); document.cookie=`${n}=${encodeURIComponent(v)};expires=${e.toUTCString()};path=/;SameSite=Lax`; }
function getCookie(n){ const m=document.cookie.match(new RegExp('(^| )'+n+'=([^;]+)')); return m?decodeURIComponent(m[2]):null; }
function getP(){ try{ return JSON.parse(getCookie('cs_p')||'{}'); }catch{ return {}; } }
function saveP(p){ setCookie('cs_p',JSON.stringify(p),365); }

// ── Progress helpers ──────────────────────────────────────────
function actDone(sessId,actId){ return !!getP()[sessId]?.acts?.[actId]; }
function markAct(sessId,actId){
  const p=getP();
  if(!p[sessId]) p[sessId]={acts:{},complete:false};
  if(!p[sessId].acts) p[sessId].acts={};
  p[sessId].acts[actId]=true;
  saveP(p);
}
function sessDoneCount(id,acts){ return acts.filter(a=>actDone(id,a.id)).length; }
function isSessComplete(id){ return !!getP()[id]?.complete; }
function markSessComplete(id){ const p=getP(); if(!p[id]) p[id]={acts:{},complete:false}; p[id].complete=true; saveP(p); }

// ── Toast ─────────────────────────────────────────────────────
let _tt=null;
function showToast(msg){
  const el=document.getElementById('toast');
  if(!el) return;
  el.textContent=msg; el.classList.add('show');
  if(_tt) clearTimeout(_tt);
  _tt=setTimeout(()=>el.classList.remove('show'),3200);
}

// ── Header init (both pages) ──────────────────────────────────
function initHeader(){
  document.documentElement.lang=L;
  const lb=document.getElementById('lang-btn');
  if(lb){ lb.textContent=t('langBtn'); lb.onclick=toggleLang; }
  const bb=document.getElementById('back-btn');
  if(bb){ bb.textContent='← '+t('back'); bb.onclick=()=>{ location.href='../index.html'; }; }
}

// ================================================================
// SESSION PAGE ENGINE
// Runs when a session page loads and window.SESSION is defined
// ================================================================
function initSessionPage(){
  if(typeof SESSION==='undefined') return;
  const S=SESSION;
  const sessId=S.id;

  // Apply lang to static elements
  document.title=`Code//Switch — S${S.num}: ${S.title[L]}`;
  document.getElementById('sess-bloc-lbl').textContent=S.blocName[L];
  document.getElementById('sess-bloc-lbl').style.color=S.blocColor;
  document.getElementById('sess-title').textContent=S.title[L];
  document.getElementById('sess-sub').textContent=S.sub[L];

  // Mode pill
  updateModePill();

  // Mode tabs
  document.getElementById('tab-tutor').textContent=t('tutorTab');
  document.getElementById('tab-student').textContent=t('studentTab');
  document.getElementById('tab-tutor').onclick=()=>switchMode('tutor');
  document.getElementById('tab-student').onclick=()=>switchMode('student');

  // Render initial panel based on saved mode
  const p=getP();
  const savedMode=(p[sessId]?.mode)||'student';
  switchMode(savedMode);

  // Session nav buttons
  const prevBtn=document.getElementById('prev-sess-btn');
  const nextBtn=document.getElementById('next-sess-btn');
  const compBtn=document.getElementById('comp-sess-btn');
  if(prevBtn && S.prev){ prevBtn.onclick=()=>{ location.href=`s${String(S.prev).padStart(2,'0')}.html`; }; }
  else if(prevBtn) prevBtn.classList.add('hidden');
  if(nextBtn && S.next){ nextBtn.textContent=t('nextSessBtn'); nextBtn.onclick=()=>{ location.href=`s${String(S.next).padStart(2,'0')}.html`; }; }
  else if(nextBtn) nextBtn.classList.add('hidden');
  if(compBtn){
    compBtn.textContent=t('markDone');
    compBtn.onclick=()=>{
      markSessComplete(sessId);
      compBtn.classList.remove('show');
      showToast(t('xpGain',S.xp||100));
      updateCompBtn();
    };
    updateCompBtn();
  }
}

function updateModePill(){
  if(typeof SESSION==='undefined') return;
  const p=getP();
  const mode=(p[SESSION.id]?.mode)||'student';
  const pill=document.getElementById('mode-pill');
  if(!pill) return;
  pill.className='mode-pill '+(mode==='tutor'?'tutor':'student');
  pill.textContent=mode==='tutor'?(L==='fr'?'TUTEUR·RICE':'TUTOR'):(L==='fr'?'ÉTUDIANT·E':'STUDENT');
}

function switchMode(mode){
  if(typeof SESSION==='undefined') return;
  const p=getP();
  if(!p[SESSION.id]) p[SESSION.id]={acts:{},complete:false};
  p[SESSION.id].mode=mode;
  saveP(p);

  const tp=document.getElementById('panel-tutor');
  const sp=document.getElementById('panel-student');
  const tt=document.getElementById('tab-tutor');
  const st=document.getElementById('tab-student');
  if(tp) tp.style.display=mode==='tutor'?'block':'none';
  if(sp) sp.style.display=mode==='student'?'block':'none';
  if(tt){ tt.className='mtab'+(mode==='tutor'?' at':''); }
  if(st){ st.className='mtab'+(mode==='student'?' as':''); }
  updateModePill();
}

function updateCompBtn(){
  if(typeof SESSION==='undefined') return;
  const S=SESSION;
  const btn=document.getElementById('comp-sess-btn');
  if(!btn) return;
  const done=sessDoneCount(S.id,S.activities);
  const total=S.activities.length;
  const complete=isSessComplete(S.id);
  if(!complete && done>=Math.ceil(total*.6)) btn.classList.add('show');
  else btn.classList.remove('show');
}

// ── Render tutor panel ────────────────────────────────────────
function renderTutorPanel(S){
  const t_=t;
  let h=`<div class="tutor-panel">
    <div class="tutor-badge">${t_('tutorBadge')}</div>
    <h3>${t_('demoTitle')}</h3>
    <p>${S.tutor.concept[L]}</p>
    <div class="demo-steps">`;
  S.tutor.demoSteps.forEach((step,i)=>{
    h+=`<div class="dstep">
      <div class="dstep-num">${i+1}</div>
      <div class="dstep-body">
        <strong>${step.label[L]}</strong>
        <p>${step[L]}</p>
      </div>
    </div>`;
  });
  h+=`</div>`;
  if(S.tutor.discussion?.length){
    h+=`<div class="disc-section"><h4>${t_('discTitle')}</h4>`;
    S.tutor.discussion.forEach(q=>{ h+=`<div class="disc-q">${q[L]}</div>`; });
    h+=`</div>`;
  }
  h+=`</div>`;
  // Code compare
  if(S.compare){
    h+=`<div class="compare">
      <div class="cpanel"><div class="cpanel-hdr cs">C# — Unity</div><pre>${S.compare.cs}</pre></div>
      <div class="cpanel"><div class="cpanel-hdr cpp">C++ — Unreal</div><pre>${S.compare.cpp}</pre></div>
    </div>`;
  }
  // Deep dive
  if(S.tutor.deep){
    const did='dd-'+S.id;
    h+=`<div class="deep-toggle" onclick="toggleDeep('${did}')">
      <input type="checkbox" id="${did}-cb" onclick="event.stopPropagation()">
      <label for="${did}-cb">${t_('deepToggle')}</label>
    </div>
    <div class="deep-body" id="${did}">${S.tutor.deep[L]}</div>`;
  }
  return h;
}

// ── Render student panel ──────────────────────────────────────
function renderStudentPanel(S){
  const sessId=S.id;
  let h=`<div class="acts-section"><div class="acts-lbl">${t('actLabel')}</div>`;
  S.activities.forEach(act=>{
    const done=actDone(sessId,act.id);
    const badgeClass={quiz:'bq',fill:'bf',bug:'bb',engine:'be',reflect:'br'}[act.type]||'bq';
    const badgeLabel={quiz:t('quizLabel'),fill:t('fillLabel'),bug:t('bugLabel'),engine:t('engineLabel'),reflect:t('reflectLabel')}[act.type]||act.type;
    h+=`<div class="activity${done?' completed':''}" id="wrap-${act.id}">
      <div class="act-top">
        <span class="abadge ${badgeClass}">${badgeLabel} · ${act.xp||10} XP</span>
        <button class="acheck${done?' done':''}" onclick="toggleActCheck('${sessId}','${act.id}')">${done?'✓':''}</button>
      </div>`;
    if(act.type==='quiz')    h+=renderQuiz(act,sessId);
    if(act.type==='fill')    h+=renderFill(act,sessId);
    if(act.type==='bug')     h+=renderBug(act,sessId);
    if(act.type==='engine')  h+=renderEngine(act);
    if(act.type==='reflect') h+=renderReflect(act);
    h+=`</div>`;
  });
  h+=`</div>`;
  return h;
}

function renderQuiz(act,sessId){
  const done=actDone(sessId,act.id);
  const choices=act.choices.map((c,i)=>{
    const label=typeof c.t==='object'?c.t[L]:c.t;
    return `<button class="choice" id="qc-${act.id}-${i}"
      onclick="checkQ('${sessId}','${act.id}',${i},${act.choices.length})"
      data-correct="${c.c}"
      data-fb="${encodeURIComponent(typeof c.fb==='object'?c.fb[L]:c.fb)}"
      ${done?'disabled':''}>${label}</button>`;
  }).join('');
  return `<h4>${act.q[L]}</h4><div class="choices">${choices}</div><div class="feedback" id="fb-${act.id}"></div>`;
}

function renderFill(act,sessId){
  const done=actDone(sessId,act.id);
  const code=act.template[L].replace('______',
    `<input class="blank" id="bi-${act.id}" placeholder="???" autocomplete="off" autocorrect="off" spellcheck="false"
      onkeydown="if(event.key==='Enter')checkF('${sessId}','${act.id}')"
      ${done?'disabled':''}>`);
  return `<h4>${act.instr[L]}</h4>
    <div class="code-block">${code}</div>
    <p style="font-size:1.3rem;color:var(--ch4);margin-bottom:1rem">${t('hint')}: ${act.hint[L]}</p>
    <div style="display:flex;gap:.8rem;flex-wrap:wrap">
      <button class="btn" onclick="checkF('${sessId}','${act.id}')" ${done?'disabled':''}>${t('checkBtn')}</button>
      <button class="btn sec" id="retry-${act.id}" style="display:none" onclick="retryF('${act.id}')">${t('retryBtn')}</button>
    </div>
    <div class="feedback" id="fb-${act.id}"></div>`;
}

function renderBug(act,sessId){
  const rid='br-'+act.id;
  return `<h4>${act.instr[L]}</h4>
    <div class="bug-code">${act.bugCode}</div>
    <button class="btn sec" onclick="revealBug('${rid}','${sessId}','${act.id}')">${t('revealBtn')}</button>
    <div class="bug-reveal" id="${rid}">${act.explanation[L]}</div>`;
}

function renderEngine(act){
  return `<h4>${act.task[L]}</h4>
    <div class="engine-task">
      <h5>${act.label?act.label[L]:(act.engine||'Engine')}</h5>
      <p>${act.task[L]}</p>
      ${act.note?`<p class="note">${act.note[L]}</p>`:''}
    </div>`;
}

function renderReflect(act){
  return `<div class="reflect-prompt">${act.prompt[L]}</div>`;
}

// ── Interaction handlers ──────────────────────────────────────
function checkQ(sessId,actId,idx,total){
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
  if(correct){ markAct(sessId,actId); updateActCheck(actId,true); showToast(t('xpGain',10)); updateCompBtn(); }
}

function checkF(sessId,actId){
  const input=document.getElementById('bi-'+actId);
  if(!input||input.disabled) return;
  const act=SESSION.activities.find(a=>a.id===actId);
  if(!act) return;
  const correct=input.value.trim().toLowerCase()===act.answer.toLowerCase();
  input.classList.remove('ok','nok'); input.classList.add(correct?'ok':'nok');
  input.disabled=true;
  const f=document.getElementById('fb-'+actId);
  if(f){ f.textContent=correct?(L==='fr'?`✓ Correct ! Réponse : ${act.answer}`:`✓ Correct! Answer: ${act.answer}`):(L==='fr'?`✗ Réponse : ${act.answer}`:`✗ Answer: ${act.answer}`); f.className=`feedback show ${correct?'ok':'nok'}`; }
  const r=document.getElementById('retry-'+actId);
  if(r&&!correct) r.style.display='inline-flex';
  if(correct){ markAct(sessId,actId); updateActCheck(actId,true); showToast(t('xpGain',15)); updateCompBtn(); }
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

function revealBug(rid,sessId,actId){
  const el=document.getElementById(rid);
  if(el){ el.classList.add('show'); markAct(sessId,actId); updateActCheck(actId,true); showToast(t('xpGain',20)); updateCompBtn(); }
}

function toggleActCheck(sessId,actId){
  const p=getP();
  if(!p[sessId]) p[sessId]={acts:{},complete:false};
  if(!p[sessId].acts) p[sessId].acts={};
  const current=!!p[sessId].acts[actId];
  p[sessId].acts[actId]=!current;
  saveP(p);
  updateActCheck(actId,!current);
  updateCompBtn();
}

function updateActCheck(actId,done){
  const btn=document.querySelector(`.acheck[onclick*="${actId}"]`);
  if(btn){ btn.className=`acheck${done?' done':''}`; btn.textContent=done?'✓':''; }
  const wrap=document.getElementById('wrap-'+actId);
  if(wrap){ wrap.className=`activity${done?' completed':''}`; }
}

function toggleDeep(id){
  const el=document.getElementById(id);
  const cb=document.getElementById(id+'-cb');
  if(el){ el.classList.toggle('open'); if(cb) cb.checked=el.classList.contains('open'); }
}

// ── Auto-init ─────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded',()=>{
  initHeader();
  if(typeof SESSION!=='undefined') initSessionPage();
  else if(typeof initHome==='function') initHome();
});
