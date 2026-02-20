/* ═══════════════════════════════════════════
   STATE
═══════════════════════════════════════════ */
let cur='welcome', profile={}, scores={}, eligible=[], qIdx=0, qPicks={},
    top3=[], pIdx=0, pSeq=[], resultsShown=false;

/* ═══════════════════════════════════════════
   SCREEN
═══════════════════════════════════════════ */
function showScreen(id){
  document.querySelectorAll('.screen').forEach(s=>s.classList.remove('active'));
  document.getElementById('screen-'+id).classList.add('active');
  cur=id; window.scrollTo(0,0);
}

/* ═══════════════════════════════════════════
   PROFILE
═══════════════════════════════════════════ */
function buildSeq(){
  const seq=['status','education'];
  if(profile.education==='other')    seq.push('equiv');
  if(profile.education==='bachelor') seq.push('uni_goal');
  seq.push('teach_lang','french_level');
  pSeq=seq;
}

function startProfile(){
  profile={}; scores={}; qIdx=0; qPicks={}; top3=[]; resultsShown=false;
  PROGS.forEach(p=>scores[p.id]=0);
  pIdx=0; buildSeq(); renderProfile(); showScreen('profile');
}
function resetAll(){
  profile={}; scores={};
  const panel=document.getElementById('refinePanel');
  if(panel) panel.style.display='none';
  const kg=document.getElementById('btnKG');
  if(kg) kg.classList.remove('hidden');
  showScreen('welcome');
}

function renderProfile(){
  buildSeq();
  const stepId=pSeq[pIdx], step=PSTEPS.find(s=>s.id===stepId), total=pSeq.length;
  document.getElementById('pDots').innerHTML=pSeq.map((_,i)=>`<div class="pdot ${i<pIdx?'done':i===pIdx?'current':''}"></div>`).join('');
  document.getElementById('pLbl').textContent=`${pIdx+1} / ${total}`;
  document.getElementById('pQ').textContent=step.q[lang];
  document.getElementById('pOpts').innerHTML=step.opts.map(o=>`
    <button class="opt-btn ${profile[stepId]===o.val?'sel':''}" onclick="selP('${stepId}','${o.val}')">
      <span class="opt-icon">${o.icon}</span>
      <span><span class="opt-main">${o.l[lang]}</span>${o.s?`<span class="opt-sub">${o.s[lang]}</span>`:''}</span>
    </button>`).join('');
  document.getElementById('pBack').style.visibility=pIdx===0?'hidden':'visible';
  document.getElementById('pBack').textContent=t('back');
  const nx=document.getElementById('pNext');
  nx.classList.toggle('ready',!!profile[stepId]);
  nx.textContent=pIdx===total-1?t('last'):t('next');
  updateWarn();
}

function selP(stepId,val){
  profile[stepId]=val;
  if(stepId==='education') buildSeq();
  renderProfile();
}

function updateWarn(){
  const box=document.getElementById('pWarn'); box.classList.remove('show');
  if(pSeq[pIdx]!=='french_level'||profile.teach_lang!=='en') return;
  const lvl=profile.french_level;
  if(!lvl||lvl==='native') return;
  box.textContent=lvl==='beginner'?t('warnFrBeg'):t('warnFrInter');
  box.classList.add('show');
}

function profileBack(){ if(pIdx>0){pIdx--;renderProfile();} }

function profileNext(){
  const stepId=pSeq[pIdx];
  if(!profile[stepId]) return;
  if(pIdx<pSeq.length-1){pIdx++;renderProfile();}
  else{applyFilters();qIdx=0;qPicks={};renderQuiz();showScreen('quiz');}
}

/* ═══════════════════════════════════════════
   FILTERS & DEDUP
═══════════════════════════════════════════ */
function typeFilter(){
  const e=profile.education,u=profile.uni_goal;
  if(e==='hs_qc') return 'DEC';
  if(e==='other'&&profile.equiv==='no') return 'DEC';
  if(e==='grad') return 'AEC';
  if(e==='bachelor'){
    if(u==='bach2') return 'DEC';
    if(u==='grad'||u==='no') return 'AEC';
  }
  return null;
}

function applyFilters(){
  const tf=typeFilter(), franco=profile.teach_lang==='fr';
  PROGS.forEach(p=>{
    if(!p.visible){scores[p.id]=-9999;return;}
    if(tf&&p.type!==tf){scores[p.id]=-9999;return;}
    if(franco&&p.type==='AEC') scores[p.id]+=2;
    if(!franco&&!tf&&p.type==='DEC') scores[p.id]+=2;
  });
  eligible=PROGS.filter(p=>scores[p.id]>-9999).map(p=>p.id);
}

function applyDedup(ranked){
  // Build set of DEC ids in ranked top
  const decInTop=new Set(ranked.filter(id=>{const p=PROGS.find(pr=>pr.id===id);return p&&p.type==='DEC';}).map(id=>id));
  // Remove AECs whose decPair is in the top
  return ranked.filter(id=>{
    const p=PROGS.find(pr=>pr.id===id);
    if(!p) return false;
    if(p.decPair&&decInTop.has(p.decPair)) return false;
    return true;
  });
}

/* ═══════════════════════════════════════════
   QUIZ
═══════════════════════════════════════════ */
function renderQuiz(){
  const conf=confidence();
  const pct=Math.min(conf,100);
  document.getElementById('qFill').style.width=pct+'%';
  document.getElementById('qConfFill').style.width=pct+'%';
  document.getElementById('qConfPct').textContent=Math.round(pct)+'%';
  document.getElementById('qEye').textContent=t('eye');
  document.getElementById('qNeither').textContent=t('neither');
  document.getElementById('qBothLbl').textContent=t('both');
  if(conf>=100&&!resultsShown){peekResults();return;}
  if(qIdx>=QQ.length){peekResults();return;}
  const q=QQ[qIdx];
  document.getElementById('qQ').textContent=q.q[lang];
  const pick=qPicks[qIdx];
  const selA=pick==='a'||pick==='both', selB=pick==='b'||pick==='both';
  const dot='<svg viewBox="0 0 10 8"><path d="M1 4l2.5 2.5 5-5" stroke="white" stroke-width="1.5" fill="none"/></svg>';
  document.getElementById('qPair').innerHTML=`
    <button class="choice-card ${selA?(pick==='both'?'sel-both':'sel-a'):''}" onclick="pickCard('a')">
      <span class="cc-dot">${dot}</span>${q.a.t[lang]}
    </button>
    <button class="choice-card ${selB?(pick==='both'?'sel-both':'sel-b'):''}" onclick="pickCard('b')">
      <span class="cc-dot">${dot}</span>${q.b.t[lang]}
    </button>`;
}

function pickCard(which){
  const prev=qPicks[qIdx]; let next;
  if(!prev) next=which;
  else if(prev===which) next=null;
  else if(prev==='both') next=which==='a'?'b':'a';
  else next='both';

  // Score delta
  if(!prev&&next){
    if(next==='a') awardTags(QQ[qIdx].a.tags,3);
    else if(next==='b') awardTags(QQ[qIdx].b.tags,3);
    else{awardTags(QQ[qIdx].a.tags,3);awardTags(QQ[qIdx].b.tags,3);}
  } else if(prev&&next){
    if(prev==='a'&&next==='both') awardTags(QQ[qIdx].b.tags,3);
    else if(prev==='b'&&next==='both') awardTags(QQ[qIdx].a.tags,3);
    else if(prev==='both'&&next==='a') awardTags(QQ[qIdx].b.tags,-3);
    else if(prev==='both'&&next==='b') awardTags(QQ[qIdx].a.tags,-3);
    else if(prev==='a'&&next==='b'){awardTags(QQ[qIdx].a.tags,-3);awardTags(QQ[qIdx].b.tags,3);}
    else if(prev==='b'&&next==='a'){awardTags(QQ[qIdx].b.tags,-3);awardTags(QQ[qIdx].a.tags,3);}
  } else if(prev&&!next){
    if(prev==='a') awardTags(QQ[qIdx].a.tags,-3);
    else if(prev==='b') awardTags(QQ[qIdx].b.tags,-3);
    else{awardTags(QQ[qIdx].a.tags,-3);awardTags(QQ[qIdx].b.tags,-3);}
  }

  if(next) qPicks[qIdx]=next; else delete qPicks[qIdx];

  if(next){
    setTimeout(()=>{
      qIdx++;
      const c=confidence();
      if(c>=100&&!resultsShown) peekResults();
      else if(qIdx>=QQ.length) peekResults();
      else renderQuiz();
    },300);
  } else renderQuiz();
}

function pickNeither(){ qPicks[qIdx]='neither'; qIdx++; if(confidence()>=100&&!resultsShown) peekResults(); else if(qIdx>=QQ.length) peekResults(); else renderQuiz(); }

function pickBoth(){
  const prev=qPicks[qIdx];
  // Award both tags (undo prev if needed)
  if(prev==='a')    { awardTags(QQ[qIdx].b.tags,3); }
  else if(prev==='b') { awardTags(QQ[qIdx].a.tags,3); }
  else if(!prev)    { awardTags(QQ[qIdx].a.tags,3); awardTags(QQ[qIdx].b.tags,3); }
  // if prev==='both' already, no change needed
  if(prev!=='both') qPicks[qIdx]='both';
  setTimeout(()=>{
    qIdx++;
    const c=confidence();
    if(c>=100&&!resultsShown) peekResults();
    else if(qIdx>=QQ.length) peekResults();
    else renderQuiz();
  },300);
}

function awardTags(tags,pts){
  eligible.forEach(id=>{
    const p=PROGS.find(pr=>pr.id===id);
    const n=tags.filter(tg=>p.tags.includes(tg)).length;
    if(n>0) scores[id]+=pts*n;
  });
}

function getTop3(){
  const ranked=[...eligible].sort((a,b)=>scores[b]-scores[a]);
  return applyDedup(ranked).slice(0,3);
}

function confidence(){
  const r=[...eligible].sort((a,b)=>scores[b]-scores[a]);
  if(r.length<3) return 100;
  const s3=scores[r[2]]||0, s4=scores[r[3]]||0;
  return Math.max(0,Math.min(100,(s3-s4)*10+qIdx*8));
}

/* ═══════════════════════════════════════════
   RESULTS
═══════════════════════════════════════════ */
function peekResults(){
  top3=getTop3(); resultsShown=true;
  renderResults(); showScreen('results');
}

function keepGoing(){
  if(qIdx>=QQ.length){
    document.getElementById('btnKG').classList.add('hidden');
    return;
  }
  // Hide the "keep going" button, show the inline refine panel
  document.getElementById('btnKG').classList.add('hidden');
  renderRefinePanel();
}

function renderRefinePanel(){
  if(qIdx>=QQ.length){
    document.getElementById('refinePanel').style.display='none';
    return;
  }
  const q=QQ[qIdx];
  const panel=document.getElementById('refinePanel');
  panel.style.display='block';

  document.getElementById('refinePanelQ').textContent=q.q[lang];
  document.getElementById('refineBothLbl').textContent=t('both');
  document.getElementById('refineNeitherLbl').textContent=t('neither');

  const dot='<svg viewBox="0 0 10 8"><path d="M1 4l2.5 2.5 5-5" stroke="white" stroke-width="1.5" fill="none"/></svg>';
  const pick=qPicks[qIdx];
  const selA=pick==='a'||pick==='both', selB=pick==='b'||pick==='both';
  document.getElementById('refinePanelPair').innerHTML=`
    <button class="choice-card ${selA?(pick==='both'?'sel-both':'sel-a'):''}" onclick="refinePickCard('a')">
      <span class="cc-dot">${dot}</span>${q.a.t[lang]}
    </button>
    <button class="choice-card ${selB?(pick==='both'?'sel-both':'sel-b'):''}" onclick="refinePickCard('b')">
      <span class="cc-dot">${dot}</span>${q.b.t[lang]}
    </button>`;
}

function refinePickCard(which){
  const prev=qPicks[qIdx]; let next;
  if(!prev) next=which;
  else if(prev===which) next=null;
  else if(prev==='both') next=which==='a'?'b':'a';
  else next='both';

  if(!prev&&next){
    if(next==='a') awardTags(QQ[qIdx].a.tags,3);
    else if(next==='b') awardTags(QQ[qIdx].b.tags,3);
    else{awardTags(QQ[qIdx].a.tags,3);awardTags(QQ[qIdx].b.tags,3);}
  } else if(prev&&next){
    if(prev==='a'&&next==='both') awardTags(QQ[qIdx].b.tags,3);
    else if(prev==='b'&&next==='both') awardTags(QQ[qIdx].a.tags,3);
    else if(prev==='both'&&next==='a') awardTags(QQ[qIdx].b.tags,-3);
    else if(prev==='both'&&next==='b') awardTags(QQ[qIdx].a.tags,-3);
    else if(prev==='a'&&next==='b'){awardTags(QQ[qIdx].a.tags,-3);awardTags(QQ[qIdx].b.tags,3);}
    else if(prev==='b'&&next==='a'){awardTags(QQ[qIdx].b.tags,-3);awardTags(QQ[qIdx].a.tags,3);}
  } else if(prev&&!next){
    if(prev==='a') awardTags(QQ[qIdx].a.tags,-3);
    else if(prev==='b') awardTags(QQ[qIdx].b.tags,-3);
    else{awardTags(QQ[qIdx].a.tags,-3);awardTags(QQ[qIdx].b.tags,-3);}
  }
  if(next) qPicks[qIdx]=next; else delete qPicks[qIdx];

  if(next){
    setTimeout(()=>{
      qIdx++;
      top3=getTop3();
      renderResults(); // update cards (may reorder)
      if(qIdx>=QQ.length){
        document.getElementById('refinePanel').style.display='none';
      } else {
        renderRefinePanel();
      }
    },300);
  } else {
    renderRefinePanel();
  }
}

function refinePickBoth(){
  const prev=qPicks[qIdx];
  if(prev==='a')    awardTags(QQ[qIdx].b.tags,3);
  else if(prev==='b') awardTags(QQ[qIdx].a.tags,3);
  else if(!prev)    {awardTags(QQ[qIdx].a.tags,3);awardTags(QQ[qIdx].b.tags,3);}
  if(prev!=='both') qPicks[qIdx]='both';
  setTimeout(()=>{
    qIdx++;
    top3=getTop3();
    renderResults();
    if(qIdx>=QQ.length){
      document.getElementById('refinePanel').style.display='none';
    } else {
      renderRefinePanel();
    }
  },300);
}

function refinePickNeither(){
  qPicks[qIdx]='neither'; qIdx++;
  top3=getTop3();
  renderResults();
  if(qIdx>=QQ.length){
    document.getElementById('refinePanel').style.display='none';
  } else {
    renderRefinePanel();
  }
}

function renderResults(){
  top3=getTop3();
  const isInt=profile.status==='intl', engL=profile.teach_lang==='en';
  document.getElementById('rTitle').textContent=t('rtitle');
  document.getElementById('rSub').textContent=t('rsub');
  document.getElementById('rReset').textContent=t('reset');
  document.getElementById('rExport').textContent=t('export');
  document.getElementById('rShareLbl').textContent=t('share');
  document.getElementById('kgLbl').textContent=t('kg');

  const thumbSVG='<svg viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"><path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3H14z"/><path d="M7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"/></svg>';
  const ranks=[3,2,1];

  document.getElementById('rCards').innerHTML=top3.map((id,i)=>{
    const p=PROGS.find(pr=>pr.id===id);
    const thumbs=Array.from({length:3},(_,ti)=>
      `<span class="thumb ${ti<ranks[i]?'t-full':'t-empty'}">${thumbSVG}</span>`).join('');
    const warn=isInt&&p.dur<2?`<div class="rc-warn show">${t('warnInt')}</div>`:'';
    const d=p.detail;
    const titlesHtml=d.titles[lang].map(ti=>`<li>${ti}</li>`).join('');
    const futureHtml=d.future[lang].map(f=>`<li>${f}</li>`).join('');
    const progUrl = p.url ? p.url[profile.teach_lang==='en'?'en':'fr'] : null;
    const extIcon = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>';
    const viewLbl = lang==='fr'?'Voir le programme':lang==='es'?'Ver el programa':'View program';
    const linkHtml = progUrl ? `<a class="rc-link" href="${progUrl}" target="_blank" rel="noopener">${extIcon}${viewLbl}</a>` : '';
    return `
    <div class="rc" id="rc-${id}">
      <div class="rc-header" style="border-left-color:${p.col}">
        <div class="thumbs">${thumbs}</div>
        <div class="rc-info">
          <span class="rc-badge badge-${p.type.toLowerCase()}">${p.type}</span>
          <div class="rc-name">${p.name[lang]}</div>
          <div class="rc-meta">${p.school[lang]} <span class="rc-code">· ${p.code}</span></div>
          ${linkHtml}
        </div>
        <button class="rc-expand-btn" onclick="toggleDetail('${id}')" aria-label="Détails">&#8964;</button>
      </div>
      ${warn}
      <div class="rc-detail">
        <div class="detail-grid">
          <div class="detail-block full">
            <div class="detail-lbl">${t('detail_what')}</div>
            <div class="detail-txt">${d.what[lang]}</div>
          </div>
          <div class="detail-block">
            <div class="detail-lbl">${t('detail_where')}</div>
            <div class="detail-txt">${d.where[lang]}</div>
          </div>
          <div class="detail-block">
            <div class="detail-lbl">${t('detail_titles')}</div>
            <ul class="detail-list">${titlesHtml}</ul>
          </div>
          <div class="detail-block full">
            <div class="detail-lbl">${t('detail_future')}</div>
            <ul class="detail-list">${futureHtml}</ul>
          </div>
        </div>
      </div>
    </div>`;
  }).join('');

  const gw=document.getElementById('gWarn');
  gw.classList.remove('show');
  if(engL&&profile.french_level!=='native'){gw.textContent=t('warnGlobal');gw.classList.add('show');}
}

function toggleDetail(id){
  const el=document.getElementById('rc-'+id);
  el.classList.toggle('open');
}

/* ═══════════════════════════════════════════
   EXPORT
═══════════════════════════════════════════ */
function exportResults(){
  const d=new Date().toLocaleDateString(lang==='fr'?'fr-CA':lang==='es'?'es-419':'en-CA');
  const hdr={fr:`Résultats du ${d}`,en:`Results — ${d}`,es:`Resultados — ${d}`}[lang];
  const lines=[
    'Collège LaSalle — Explore', hdr, '',
    ...top3.map((id,i)=>{
      const p=PROGS.find(pr=>pr.id===id);
      const url=p.url?p.url[profile.teach_lang==='en'?'en':'fr']:'';
      return `${'👍'.repeat(3-i)} ${p.name[lang]} (${p.type} ${p.code})\n${url}`;
    }),
  ];
  const a=Object.assign(document.createElement('a'),{
    href:URL.createObjectURL(new Blob([lines.join('\n')],{type:'text/plain;charset=utf-8'})),
    download:`lasalle-explore-${Date.now()}.txt`
  });
  a.click();
}

/* ═══════════════════════════════════════════
   SHARE
═══════════════════════════════════════════ */
function buildShareText() {
  const lines = [
    t('shareSubject'), '',
    ...top3.map((id,i) => {
      const p = PROGS.find(pr=>pr.id===id);
      const url = p.url ? p.url[profile.teach_lang==='en'?'en':'fr'] : '';
      return `${'👍'.repeat(3-i)} ${p.name[lang]} (${p.type} ${p.code})\n${url}`;
    }),
    '', 'explore.lasalle.ca'
  ];
  return lines.join('\n');
}

function triggerShare() {
  const text = buildShareText();
  if (navigator.share) {
    navigator.share({ title: t('shareSubject'), text }).catch(()=>{});
  } else {
    // Fallback menu
    document.getElementById('shareMenuTitle').textContent = t('shareMenu');
    document.getElementById('shareEmailLbl').textContent  = t('shareEmail');
    document.getElementById('shareCopyLbl').textContent   = t('shareCopy');
    document.getElementById('shareCopied').textContent    = t('shareCopied');
    document.getElementById('shareCopied').classList.remove('show');
    document.getElementById('shareMenu').classList.add('open');
    document.getElementById('shareBackdrop').classList.add('open');
  }
}

function closeShare() {
  document.getElementById('shareMenu').classList.remove('open');
  document.getElementById('shareBackdrop').classList.remove('open');
}

function shareEmail() {
  const subj = encodeURIComponent(t('shareSubject'));
  const body = encodeURIComponent(buildShareText());
  window.open(`mailto:?subject=${subj}&body=${body}`);
  closeShare();
}

function copyShareText() {
  const text = buildShareText();
  navigator.clipboard.writeText(text).then(() => {
    const el = document.getElementById('shareCopied');
    el.classList.add('show');
    setTimeout(() => { el.classList.remove('show'); closeShare(); }, 1800);
  }).catch(() => {
    // Fallback for older browsers
    const ta = document.createElement('textarea');
    ta.value = text; ta.style.position='fixed'; ta.style.opacity='0';
    document.body.appendChild(ta); ta.select();
    document.execCommand('copy'); document.body.removeChild(ta);
    const el = document.getElementById('shareCopied');
    el.classList.add('show');
    setTimeout(() => { el.classList.remove('show'); closeShare(); }, 1800);
  });
}

/* ═══════════════════════════════════════════
   INIT
═══════════════════════════════════════════ */
applyT();
