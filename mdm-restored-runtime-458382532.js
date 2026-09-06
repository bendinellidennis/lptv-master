/* Malta Driving Master 45.8.38.25.2.32 — Restored cumulative runtime modules
   Restores only the approved feature surfaces that disappeared from the active split runtime:
   AI Lesson Debrief, Parent/Sponsor, School Operations and Fleet/Corporate.
   No question bank, Replay, Auth, Telemetry or Evidence engine changes. */
(function(){
'use strict';
if(window.MDM_RESTORED_RUNTIME_458382532)return;

const VERSION='45.8.38.25.2.32';
const ROUTES=Object.freeze({
  parent:'parentsponsor',
  debrief:'aidebrief',
  operations:'schooloperations',
  fleet:'fleetcorporate'
});
const OPS_KEY='mdm-school-operations-v458241';
const FLEET_KEY='mdm-fleet-corporate-v45825';

function parse(v){try{return v?JSON.parse(v):null}catch(_){return null}}
function read(key,fallback){const v=parse(localStorage.getItem(key));return v&&typeof v==='object'?v:fallback}
function write(key,value){try{localStorage.setItem(key,JSON.stringify(value));return true}catch(_){return false}}
function lang(){try{const l=String(parse(localStorage.getItem('mdm-v1-settings'))?.lang||'en');return ['it','en','mt'].includes(l)?l:'en'}catch(_){return'en'}}
function t(it,en,mt){const l=lang();return l==='it'?it:l==='mt'?mt:en}
function esc(v){return String(v??'').replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]})}
function routeName(){return String(location.hash||'').replace(/^#/,'').split('?')[0].trim()}
function session(){const s=parse(localStorage.getItem('mdm_auth_session_v4410'));if(!s||s.status!=='authenticated'||!s.user?.id)return null;if(Number(s.expiresAt||0)>0&&Number(s.expiresAt)<=Date.now())return null;return s}
function isOwner(){return window.MDM_OWNER_AUTHORITY?.isOwner?.()===true}
function schoolAllowed(){if(isOwner())return true;const s=window.MDM_PRIVILEGED_ROUTE_GUARD?.schoolSnapshot?.();return Boolean(s&&s.status==='verified'&&s.authorized===true)}
function studentAllowed(){
  if(!session()||isOwner())return false;
  const p=proof();
  const role=String(p?.role||'').toLowerCase();
  return !['school','school_admin','owner','admin'].includes(role);
}
function proof(){try{return window.MDM_PROOFLOOP_ENGINE?.evaluate?.()||null}catch(_){return null}}
function mission(){
  try{return window.MDM_PROOFLOOP_VERIFICATION?.unifiedCurrent?.()
    ||window.MDM_PROOFLOOP_VERIFICATION?.activeSchoolMission?.()
    ||window.MDM_PROOFLOOP_VERIFICATION?.current?.()
    ||null}catch(_){return null}
}
function missionTitle(m){return String(m?.payload?.title||m?.title||m?.payload?.objective||'').trim()}
function statusLabel(v){
  const s=String(v||'').toLowerCase();
  if(['verified','accepted','complete','completed'].includes(s))return t('Verificata','Verified','Ivverifikata');
  if(['awaiting_review','evidence_submitted','awaiting_instructor'].includes(s))return t('In verifica','Under review','Qed tiġi vverifikata');
  if(['assigned','seen','active'].includes(s))return t('Assegnata','Assigned','Assenjata');
  if(['cancelled','canceled'].includes(s))return t('Annullata','Cancelled','Ikkanċellata');
  return s?String(v):t('Nessuna missione attiva','No active mission','L-ebda missjoni attiva');
}
function nextNeedLabel(v){
  const map={
    verification:[t('Verifica finale','Final verification','Verifika finali')],
    resolve_contradiction:[t('Risolvi la contraddizione','Resolve the contradiction','Issolvi l-kontradizzjoni')],
    theory:[t('Rafforza la teoria','Strengthen theory','Saħħaħ it-teorija')],
    road:[t('Aggiungi evidenza su strada','Add road evidence','Żid evidenza fit-triq')],
    instructor:[t('Serve verifica istruttore','Instructor verification needed','Jeħtieġ verifika tal-istruttur')],
    retention:[t('Conferma la ritenzione','Confirm retention','Ikkonferma ż-żamma')],
    telemetry:[t('Aggiungi telemetria','Add telemetry','Żid it-telemetrija')]
  };
  return map[String(v||'')]?.[0]||t('Continua la raccolta di evidenze','Continue collecting evidence','Kompli iġbor l-evidenza');
}
function fmtDate(v){try{return new Date(v).toLocaleString(lang()==='it'?'it-IT':lang()==='mt'?'mt-MT':'en-GB',{dateStyle:'short',timeStyle:'short'})}catch(_){return String(v||'')}}
async function copyText(text){
  try{await navigator.clipboard.writeText(String(text));return true}catch(_){}
  try{const ta=document.createElement('textarea');ta.value=String(text);ta.style.position='fixed';ta.style.opacity='0';document.body.appendChild(ta);ta.select();document.execCommand('copy');ta.remove();return true}catch(_){return false}
}
function notify(message){
  const toast=document.getElementById('toast');
  if(toast){toast.textContent=message;toast.classList.add('show');setTimeout(()=>toast.classList.remove('show'),1800);return}
}
function injectStyle(){
  if(document.getElementById('mdmRestoredRuntimeStyle'))return;
  const s=document.createElement('style');s.id='mdmRestoredRuntimeStyle';
  s.textContent=[
    '.mdm-restored-page{display:grid;gap:14px;padding-bottom:20px}',
    '.mdm-restored-hero{padding:22px;border-radius:24px;background:linear-gradient(145deg,#073f43,#0b7774);color:#fff;box-shadow:var(--shadow)}',
    '.mdm-restored-hero small{font-weight:900;letter-spacing:.12em;color:#77e3dd}.mdm-restored-hero h1{margin:8px 0;font-size:28px;line-height:1.1}.mdm-restored-hero p{margin:0;color:#d8f2ef;line-height:1.45}',
    '.mdm-restored-metrics{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:8px;margin-top:16px}.mdm-restored-metrics article{padding:12px 8px;border-radius:16px;background:rgba(255,255,255,.11);text-align:center}.mdm-restored-metrics strong{display:block;font-size:24px}.mdm-restored-metrics span{font-size:11px;color:#d8f2ef}',
    '.mdm-restored-card{padding:18px;border:1px solid var(--line);border-radius:20px;background:var(--card);box-shadow:var(--shadow)}',
    '.mdm-restored-card h2,.mdm-restored-card h3{margin:0 0 10px}.mdm-restored-card p{color:var(--muted);line-height:1.5}.mdm-restored-card .btn{width:100%}',
    '.mdm-restored-grid{display:grid;grid-template-columns:1fr 1fr;gap:10px}.mdm-restored-source{padding:13px;border:1px solid var(--line);border-radius:16px;background:rgba(10,118,116,.04)}.mdm-restored-source strong{display:block;margin-top:4px}.mdm-restored-source small{color:var(--muted)}',
    '.mdm-restored-form{display:grid;grid-template-columns:1fr 1fr;gap:10px}.mdm-restored-form label{display:grid;gap:6px;font-size:12px;font-weight:850;color:var(--muted)}.mdm-restored-form label.wide{grid-column:1/-1}.mdm-restored-form input,.mdm-restored-form select,.mdm-restored-form textarea{width:100%;box-sizing:border-box;min-height:46px;border:1px solid var(--line);border-radius:13px;padding:10px 12px;background:var(--card);color:var(--text);font:inherit}.mdm-restored-form textarea{min-height:96px;resize:vertical}',
    '.mdm-restored-list{display:grid;gap:9px}.mdm-restored-item{padding:13px;border:1px solid var(--line);border-radius:16px}.mdm-restored-item-head{display:flex;justify-content:space-between;gap:10px;align-items:flex-start}.mdm-restored-item small{color:var(--muted)}.mdm-restored-actions{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-top:10px}',
    '.mdm-restored-launch{margin:14px 0;padding:16px;border:1px solid rgba(11,150,150,.25);border-radius:18px;background:linear-gradient(145deg,#f7fffd,#edf8f7)}',
    '.hm30-card[data-mdm-restored-card],.sch35-card[data-mdm-restored-card]{cursor:pointer;text-align:left}',
    '@media(max-width:620px){.mdm-restored-metrics{grid-template-columns:1fr 1fr}.mdm-restored-metrics article:last-child{grid-column:1/-1}.mdm-restored-grid,.mdm-restored-form{grid-template-columns:1fr}.mdm-restored-form label.wide{grid-column:auto}}'
  ].join('');
  document.head.appendChild(s);
}
function showBack(){
  const b=document.getElementById('backBtn');if(!b)return;
  b.classList.remove('hidden');b.setAttribute('data-mdm-restored-back','1');
}
function setScreen(html){
  const screen=document.getElementById('screen');if(!screen)return false;
  screen.innerHTML=html;showBack();
  try{window.scrollTo({top:0,left:0,behavior:'auto'})}catch(_){try{window.scrollTo(0,0)}catch(__){}}
  return true;
}
function navigate(name){
  const st={name:String(name),data:null};
  history.pushState(st,'','#'+st.name);
  window.dispatchEvent(new PopStateEvent('popstate',{state:st}));
}
async function openRoute(name){
  if(name===ROUTES.operations||name===ROUTES.fleet){
    if(!isOwner()){
      try{const s=await window.MDM_PRIVILEGED_ROUTE_GUARD?.verifySchool?.(false);if(!(s&&s.status==='verified'&&s.authorized===true))return false}catch(_){return false}
    }
  }
  navigate(name);return true;
}

function homeCard(id,icon,title,sub,route,school){
  let card=document.getElementById(id);if(card)return card;
  card=document.createElement('button');card.type='button';card.id=id;
  card.className=school?'sch35-card blue':'hm30-card';
  card.setAttribute('data-mdm-restored-card','1');card.setAttribute('data-mdm-restored-route',route);
  card.style.cssText='width:100%;border:0;font:inherit;color:inherit';
  card.innerHTML='<div style="font-size:28px;line-height:1;margin-bottom:10px">'+icon+'</div><h3 style="margin:0 0 5px;font-size:17px">'+esc(title)+'</h3><p style="margin:0;font-size:12px;opacity:.72">'+esc(sub)+'</p>';
  return card;
}
function studentHomeGrid(){
  const cards=Array.from(document.querySelectorAll('.hm30-card')).filter(x=>!x.hasAttribute('data-mdm-restored-card'));
  return cards[0]?.parentElement||null;
}
function mountStudentHome(){
  const r=routeName();if(r&&r!=='home')return false;
  if(!studentAllowed())return false;
  const grid=studentHomeGrid();if(!grid)return false;
  const parent=homeCard('mdmParentSponsorHomeCard','👥',t('Parent / Sponsor','Parent / Sponsor','Ġenitur / Sponsor'),t('Vista trasparente dei progressi e delle evidenze','Transparent view of progress and evidence','Veduta trasparenti tal-progress u l-evidenza'),ROUTES.parent,false);
  const debrief=homeCard('mdmAIDebriefHomeCard','🧠',t('AI Lesson Debrief','AI Lesson Debrief','Debrief tal-Lezzjoni AI'),t('Riepilogo basato sulle evidenze della guida reale','Evidence-based practical driving summary','Sommarju tal-prattika bbażat fuq l-evidenza'),ROUTES.debrief,false);
  if(parent.parentElement!==grid)grid.appendChild(parent);
  if(debrief.parentElement!==grid)grid.appendChild(debrief);
  return true;
}
function norm(v){return String(v||'').replace(/\s+/g,' ').trim().toUpperCase()}
function advancedTitle(){
  const preferred=Array.from(document.querySelectorAll('.sch35-title,h1,h2,h3,h4,h5,strong,b'));
  return preferred.find(el=>{const tx=norm(el.textContent||'');return tx.length<=90&&(tx.includes('STRUMENTI AVANZATI')||tx.includes('ADVANCED TOOLS')||tx.includes('GĦODOD AVVANZATI'))})||null;
}
function schoolGrid(){
  const telemetry=document.getElementById('mdmSchoolTelemetryCard');if(telemetry?.parentElement)return telemetry.parentElement;
  const title=advancedTitle();if(!title)return null;
  const school=title.closest('.sch35,.sch35-profile')||title.parentElement;if(!school)return null;
  const titleTop=title.getBoundingClientRect?.().top||0;
  const candidates=Array.from(school.querySelectorAll('.sch35-grid,[class*="grid"]')).filter(el=>{
    if(el===title||el.contains(title))return false;
    const r=el.getBoundingClientRect?.();if(r&&r.top<titleTop-2)return false;
    const tx=norm(el.textContent||'');
    return tx.includes('INTELLIGENZA ISTRUTTORE')||tx.includes('INSTRUCTOR INTELLIGENCE')||tx.includes('CENTRO DI COMANDO')||tx.includes('COMMAND CENTER')||tx.includes('TRUST CENTER')||tx.includes('TELEMETRIA')||tx.includes('TELEMETRY');
  });
  return candidates.sort((a,b)=>(a.getBoundingClientRect?.().top||0)-(b.getBoundingClientRect?.().top||0))[0]||null;
}
function mountSchoolHome(){
  if(routeName()!=='schoolhome'||!schoolAllowed())return false;
  const grid=schoolGrid();if(!grid)return false;
  const ops=homeCard('mdmSchoolOperationsHomeCard','🗂️',t('Operazioni scuola','School Operations','Operazzjonijiet tal-Iskola'),t('Lezioni, attività e storico operativo','Lessons, activities and operational history','Lezzjonijiet, attivitajiet u storja operattiva'),ROUTES.operations,true);
  const fleet=homeCard('mdmFleetCorporateHomeCard','🚚',t('Fleet / Corporate','Fleet / Corporate','Flotta / Korporattiv'),t('Contesto conducente, evidenze e Driver Brief','Driver context, evidence and Driver Brief','Kuntest tas-sewwieq, evidenza u Driver Brief'),ROUTES.fleet,true);
  if(ops.parentElement!==grid)grid.appendChild(ops);
  if(fleet.parentElement!==grid)grid.appendChild(fleet);
  return true;
}
function mountPractical(){
  if(routeName()!=='practicallesson'||!studentAllowed())return false;
  if(document.getElementById('mdmAIDebriefPracticalLaunch'))return true;
  const screen=document.getElementById('screen');if(!screen)return false;
  const box=document.createElement('section');box.id='mdmAIDebriefPracticalLaunch';box.className='mdm-restored-launch';
  box.innerHTML='<small style="font-weight:900;letter-spacing:.1em;color:#0a817c">MDM · '+VERSION+'</small><h3 style="margin:7px 0">'+esc(t('AI Lesson Debrief','AI Lesson Debrief','Debrief tal-Lezzjoni AI'))+'</h3><p style="margin:0 0 10px;color:var(--muted)">'+esc(t('Apri il riepilogo basato sulle evidenze già raccolte da ProofLoop, strada, telemetria e istruttore.','Open the summary based on evidence already collected from ProofLoop, road, telemetry and instructor.','Iftaħ is-sommarju bbażat fuq l-evidenza miġbura minn ProofLoop, it-triq, it-telemetrija u l-istruttur.'))+'</p><button type="button" class="btn" data-mdm-restored-route="'+ROUTES.debrief+'">'+esc(t('Apri Debrief','Open Debrief','Iftaħ id-Debrief'))+'</button>';
  const title=screen.querySelector('.section-title');if(title)title.insertAdjacentElement('afterend',box);else screen.insertBefore(box,screen.firstChild||null);
  return true;
}

function renderParent(){
  if(!studentAllowed())return false;
  const p=proof(),m=mission();
  const n=Number(p?.independentSources||0),total=Number(p?.sourceTotal||5),contr=Number(p?.contradictions||0);
  const title=missionTitle(m)||t('Nessuna missione attiva','No active mission','L-ebda missjoni attiva');
  const status=statusLabel(m?.status);
  const summary=[
    'MDM · '+t('Parent / Sponsor','Parent / Sponsor','Ġenitur / Sponsor'),
    t('Fonti di evidenza','Evidence sources','Sorsi ta’ evidenza')+': '+n+'/'+total,
    t('Contraddizioni','Contradictions','Kontradizzjonijiet')+': '+contr,
    t('Missione','Mission','Missjoni')+': '+title,
    t('Stato','Status','Status')+': '+status
  ].join('\n');
  const html='<div class="mdm-restored-page parent-sponsor-home">'+
    '<div class="section-title"><div><h2>'+esc(t('Parent / Sponsor','Parent / Sponsor','Ġenitur / Sponsor'))+'</h2><p>'+esc(t('Vista trasparente e in sola lettura delle evidenze reali dello studente.','Transparent, read-only view of the learner’s real evidence.','Veduta trasparenti u għall-qari biss tal-evidenza reali tal-istudent.'))+'</p></div><span class="badge">45.8.23</span></div>'+
    '<section class="mdm-restored-hero parent-sponsor-hero"><small>MDM · EVIDENCE VIEW</small><h1>'+esc(t('Progressi che si possono spiegare','Progress that can be explained','Progress li jista’ jiġi spjegat'))+'</h1><p>'+esc(t('Nessun punteggio inventato: vengono mostrati solo segnali già presenti nel sistema.','No invented score: only signals already present in the system are shown.','L-ebda punteġġ ivvintat: jintwerew biss sinjali li diġà jinsabu fis-sistema.'))+'</p><div class="mdm-restored-metrics"><article><strong>'+n+'/'+total+'</strong><span>'+esc(t('fonti evidenza','evidence sources','sorsi ta’ evidenza'))+'</span></article><article><strong>'+contr+'</strong><span>'+esc(t('contraddizioni','contradictions','kontradizzjonijiet'))+'</span></article><article><strong>'+esc(status)+'</strong><span>'+esc(t('missione','mission','missjoni'))+'</span></article></div></section>'+
    '<section class="mdm-restored-card"><h2>'+esc(t('Missione corrente','Current mission','Missjoni kurrenti'))+'</h2><strong>'+esc(title)+'</strong><p>'+esc(t('Stato','Status','Status'))+': '+esc(status)+'</p></section>'+
    '<section class="mdm-restored-card"><h2>'+esc(t('Trasparenza','Transparency','Trasparenza'))+'</h2><p>'+esc(t('Questa vista non consente al genitore o allo sponsor di modificare prove, verifiche o competenze. La verifica umana della scuola resta separata.','This view does not allow a parent or sponsor to modify evidence, reviews or competencies. Human school verification remains separate.','Din il-veduta ma tippermettix lill-ġenitur jew lill-isponsor ibiddel l-evidenza, il-verifiki jew il-kompetenzi. Il-verifika umana tal-iskola tibqa’ separata.'))+'</p></section>'+
    '<section class="mdm-restored-card"><h2>'+esc(t('Condividi riepilogo','Share summary','Aqsam is-sommarju'))+'</h2><div class="mdm-restored-actions"><button id="mdmParentCopy" class="btn" type="button">'+esc(t('Copia','Copy','Ikkopja'))+'</button><button id="mdmParentShare" class="btn secondary" type="button">'+esc(t('Condividi','Share','Aqsam'))+'</button></div></section>'+
  '</div>';
  if(!setScreen(html))return false;
  document.getElementById('mdmParentCopy')?.addEventListener('click',async()=>{await copyText(summary);notify(t('Riepilogo copiato','Summary copied','Sommarju kkupjat'))});
  document.getElementById('mdmParentShare')?.addEventListener('click',async()=>{
    if(navigator.share){try{await navigator.share({title:'Malta Driving Master',text:summary});return}catch(_){}}
    await copyText(summary);notify(t('Riepilogo copiato','Summary copied','Sommarju kkupjat'));
  });
  return true;
}
function renderDebrief(){
  if(!studentAllowed())return false;
  const p=proof(),m=mission(),sources=p?.sources||{};
  const ids=[
    ['theory','📘',t('Teoria','Theory','Teorija')],
    ['replay','🎬','Replay'],
    ['road','🛣️',t('Guida reale','Real driving','Sewqan reali')],
    ['telemetry','📡',t('Telemetria','Telemetry','Telemetrija')],
    ['instructor','🧑‍🏫',t('Istruttore','Instructor','Istruttur')]
  ];
  const n=Number(p?.independentSources||0),total=Number(p?.sourceTotal||5),contr=Number(p?.contradictions||0);
  const evidence=m?.evidence||{};
  const roadDelta=Number.isFinite(Number(evidence.roadDelta))?Number(evidence.roadDelta):null;
  const teleDelta=Number.isFinite(Number(evidence.telemetryDelta))?Number(evidence.telemetryDelta):null;
  const srcHtml=ids.map(x=>'<article class="mdm-restored-source"><span>'+x[1]+'</span><strong>'+esc(x[2])+'</strong><small>'+esc(sources?.[x[0]]?.present===true?t('Presente','Present','Preżenti'):t('Non ancora presente','Not present yet','Għadha mhix preżenti'))+'</small></article>').join('');
  const html='<div class="mdm-restored-page">'+
    '<div class="section-title"><div><h2>'+esc(t('AI Lesson Debrief','AI Lesson Debrief','Debrief tal-Lezzjoni AI'))+'</h2><p>'+esc(t('Riepilogo delle evidenze disponibili, senza sostituire il giudizio dell’istruttore.','Summary of available evidence without replacing instructor judgement.','Sommarju tal-evidenza disponibbli mingħajr ma jieħu post il-ġudizzju tal-istruttur.'))+'</p></div><span class="badge">45.8.22.3</span></div>'+
    '<section class="mdm-restored-hero"><small>MDM · EVIDENCE DEBRIEF</small><h1>'+esc(missionTitle(m)||t('Ultima situazione disponibile','Latest available situation','L-aħħar sitwazzjoni disponibbli'))+'</h1><p>'+esc(t('Copertura evidenze','Evidence coverage','Kopertura tal-evidenza'))+': '+n+'/'+total+'</p><div class="mdm-restored-metrics"><article><strong>'+n+'/'+total+'</strong><span>'+esc(t('fonti','sources','sorsi'))+'</span></article><article><strong>'+contr+'</strong><span>'+esc(t('contraddizioni','contradictions','kontradizzjonijiet'))+'</span></article><article><strong>'+esc(statusLabel(m?.status))+'</strong><span>'+esc(t('stato missione','mission status','status tal-missjoni'))+'</span></article></div></section>'+
    '<section class="mdm-restored-card"><h2>'+esc(t('Fonti utilizzate','Evidence sources','Sorsi użati'))+'</h2><div class="mdm-restored-grid">'+srcHtml+'</div></section>'+
    '<section class="mdm-restored-card"><h2>'+esc(t('Evidenza dalla missione','Mission evidence','Evidenza mill-missjoni'))+'</h2><div class="mdm-restored-grid"><article class="mdm-restored-source"><strong>'+(roadDelta===null?'—':roadDelta)+'</strong><small>'+esc(t('nuove evidenze strada','new road evidence','evidenza ġdida fit-triq'))+'</small></article><article class="mdm-restored-source"><strong>'+(teleDelta===null?'—':teleDelta)+'</strong><small>'+esc(t('nuove sessioni telemetria','new telemetry sessions','sessjonijiet ġodda tat-telemetrija'))+'</small></article></div></section>'+
    '<section class="mdm-restored-card"><h2>'+esc(t('Prossima prova necessaria','Next evidence needed','L-evidenza li jmiss meħtieġa'))+'</h2><p><strong>'+esc(nextNeedLabel(p?.nextNeed))+'</strong></p><p>'+esc(t('Il Debrief usa solo segnali già raccolti da MDM. Non crea una certificazione automatica.','The Debrief uses only signals already collected by MDM. It does not create automatic certification.','Id-Debrief juża biss sinjali li MDM diġà ġabar. Ma joħloqx ċertifikazzjoni awtomatika.'))+'</p></section>'+
  '</div>';
  return setScreen(html);
}

function opsDefault(){return {version:'45.8.24.1',bookings:[],audit:[]}}
function opsState(){const s=read(OPS_KEY,opsDefault());if(!Array.isArray(s.bookings))s.bookings=[];if(!Array.isArray(s.audit))s.audit=[];return s}
function saveOps(s){s.version='45.8.24.1';s.updatedAt=new Date().toISOString();s.bookings=s.bookings.slice(0,100);s.audit=s.audit.slice(0,100);write(OPS_KEY,s)}
function opsTypeLabel(v){return v==='verification'?t('Verifica','Verification','Verifika'):v==='mock'?t('Simulazione pratica','Practical mock','Simulazzjoni prattika'):t('Lezione','Lesson','Lezzjoni')}
function renderOperations(){
  if(!schoolAllowed())return false;
  const s=opsState();
  const bookings=s.bookings.slice().sort((a,b)=>String(b.date||'').localeCompare(String(a.date||'')));
  const crm={};bookings.forEach(b=>{const k=String(b.learner||'').trim();if(!k)return;if(!crm[k])crm[k]={total:0,completed:0};crm[k].total++;if(b.status==='completed')crm[k].completed++});
  const list=bookings.length?bookings.map(b=>'<article class="mdm-restored-item"><div class="mdm-restored-item-head"><div><strong>'+esc(b.learner)+'</strong><small style="display:block">'+esc(b.date)+' · '+esc(b.time||'—')+' · '+esc(opsTypeLabel(b.type))+'</small></div><span class="badge">'+esc(b.status==='completed'?t('Completata','Completed','Lesta'):b.status==='cancelled'?t('Annullata','Cancelled','Ikkanċellata'):t('Pianificata','Scheduled','Ippjanata'))+'</span></div>'+(b.status==='scheduled'?'<div class="mdm-restored-actions"><button type="button" class="btn" data-ops-status="completed" data-ops-id="'+esc(b.id)+'">'+esc(t('Completa','Complete','Imla'))+'</button><button type="button" class="btn secondary" data-ops-status="cancelled" data-ops-id="'+esc(b.id)+'">'+esc(t('Annulla','Cancel','Ikkanċella'))+'</button></div>':'')+'</article>').join(''):'<p>'+esc(t('Nessuna attività registrata.','No activities recorded.','L-ebda attività rreġistrata.'))+'</p>';
  const crmHtml=Object.keys(crm).length?Object.entries(crm).map(([name,v])=>'<article class="mdm-restored-source"><strong>'+esc(name)+'</strong><small>'+v.completed+'/'+v.total+' '+esc(t('completate','completed','lesti'))+'</small></article>').join(''):'<p>'+esc(t('Il riepilogo studenti apparirà quando salvi la prima attività.','The learner summary appears after the first activity is saved.','Is-sommarju tal-istudenti jidher wara li tissejvja l-ewwel attività.'))+'</p>';
  const audit=s.audit.slice(0,8).map(a=>'<div class="mdm-restored-item"><small>'+esc(fmtDate(a.at))+'</small><div>'+esc(a.text)+'</div></div>').join('')||'<p>'+esc(t('Nessun evento operativo.','No operational events.','L-ebda avveniment operattiv.'))+'</p>';
  const html='<div class="mdm-restored-page">'+
    '<div class="section-title"><div><h2>'+esc(t('Operazioni scuola','School Operations','Operazzjonijiet tal-Iskola'))+'</h2><p>'+esc(t('Fondazione operativa locale per lezioni e attività della scuola.','Local operational foundation for school lessons and activities.','Bażi operattiva lokali għal-lezzjonijiet u l-attivitajiet tal-iskola.'))+'</p></div><span class="badge">45.8.24.1</span></div>'+
    '<section class="mdm-restored-hero"><small>MDM · SCHOOL OPERATIONS</small><h1>'+esc(t('Organizza il lavoro senza confondere dati locali e dati server','Organise work without mixing local and server data','Organizza x-xogħol mingħajr ma tħallat data lokali ma’ data tas-server'))+'</h1><p>'+esc(t('Le attività di questa sezione restano locali al dispositivo; missioni, evidenze e verifiche continuano a usare i moduli server dedicati.','Activities in this section remain local to the device; missions, evidence and reviews continue to use their dedicated server modules.','L-attivitajiet f’din is-sezzjoni jibqgħu lokali fuq l-apparat; il-missjonijiet, l-evidenza u l-verifiki jibqgħu jużaw il-moduli tas-server dedikati.'))+'</p><div class="mdm-restored-metrics"><article><strong>'+bookings.filter(x=>x.status==='scheduled').length+'</strong><span>'+esc(t('pianificate','scheduled','ippjanati'))+'</span></article><article><strong>'+bookings.filter(x=>x.status==='completed').length+'</strong><span>'+esc(t('completate','completed','lesti'))+'</span></article><article><strong>'+Object.keys(crm).length+'</strong><span>'+esc(t('studenti','learners','studenti'))+'</span></article></div></section>'+
    '<section class="mdm-restored-card"><h2>'+esc(t('Nuova attività','New activity','Attività ġdida'))+'</h2><div class="mdm-restored-form"><label><span>'+esc(t('Studente','Learner','Student'))+'</span><input id="mdmOpsLearner" maxlength="80"></label><label><span>'+esc(t('Tipo','Type','Tip'))+'</span><select id="mdmOpsType"><option value="lesson">'+esc(t('Lezione','Lesson','Lezzjoni'))+'</option><option value="mock">'+esc(t('Simulazione pratica','Practical mock','Simulazzjoni prattika'))+'</option><option value="verification">'+esc(t('Verifica','Verification','Verifika'))+'</option></select></label><label><span>'+esc(t('Data','Date','Data'))+'</span><input id="mdmOpsDate" type="date"></label><label><span>'+esc(t('Ora','Time','Ħin'))+'</span><input id="mdmOpsTime" type="time"></label></div><button id="mdmOpsSave" type="button" class="btn" style="margin-top:12px;width:100%">'+esc(t('Salva attività','Save activity','Issejvja l-attività'))+'</button></section>'+
    '<section class="mdm-restored-card"><h2>'+esc(t('Attività','Activities','Attivitajiet'))+'</h2><div class="mdm-restored-list">'+list+'</div></section>'+
    '<section class="mdm-restored-card"><h2>'+esc(t('Riepilogo studenti','Learner summary','Sommarju tal-istudenti'))+'</h2><div class="mdm-restored-grid">'+crmHtml+'</div></section>'+
    '<section class="mdm-restored-card"><h2>'+esc(t('Storico operativo','Operational history','Storja operattiva'))+'</h2><div class="mdm-restored-list">'+audit+'</div><button id="mdmOpsCopy" type="button" class="btn secondary" style="margin-top:10px;width:100%">'+esc(t('Copia report operativo','Copy operations report','Ikkopja r-rapport operattiv'))+'</button></section>'+
  '</div>';
  if(!setScreen(html))return false;
  document.getElementById('mdmOpsSave')?.addEventListener('click',()=>{
    const learner=String(document.getElementById('mdmOpsLearner')?.value||'').trim();
    const date=String(document.getElementById('mdmOpsDate')?.value||'').trim();
    const time=String(document.getElementById('mdmOpsTime')?.value||'').trim();
    const type=String(document.getElementById('mdmOpsType')?.value||'lesson');
    if(!learner||!date||!time){notify(t('Completa studente, data e ora','Complete learner, date and time','Imla l-istudent, id-data u l-ħin'));return}
    const st=opsState(),id='ops-'+Date.now();
    st.bookings.unshift({id,learner,date,time,type,status:'scheduled',createdAt:new Date().toISOString()});
    st.audit.unshift({at:new Date().toISOString(),text:t('Attività creata per ','Activity created for ','Inħolqot attività għal ')+learner});
    saveOps(st);renderOperations();
  });
  document.querySelectorAll('[data-ops-status]').forEach(btn=>btn.addEventListener('click',()=>{
    const st=opsState(),id=String(btn.getAttribute('data-ops-id')||''),status=String(btn.getAttribute('data-ops-status')||'');
    const b=st.bookings.find(x=>String(x.id)===id);if(!b)return;b.status=status;
    st.audit.unshift({at:new Date().toISOString(),text:(status==='completed'?t('Attività completata: ','Activity completed: ','Attività lesta: '):t('Attività annullata: ','Activity cancelled: ','Attività kkanċellata: '))+b.learner});
    saveOps(st);renderOperations();
  }));
  document.getElementById('mdmOpsCopy')?.addEventListener('click',async()=>{
    const lines=[t('MDM OPERAZIONI SCUOLA','MDM SCHOOL OPERATIONS','MDM OPERAZZJONIJIET TAL-ISKOLA')].concat(s.bookings.map(b=>[b.date,b.time,b.learner,opsTypeLabel(b.type),b.status].join(' · ')));
    await copyText(lines.join('\n'));notify(t('Report copiato','Report copied','Rapport kkupjat'));
  });
  return true;
}

function fleetDefault(){return {version:'45.8.25',company:'',vehicle:'',duty:'',notes:'',updatedAt:''}}
function fleetState(){return read(FLEET_KEY,fleetDefault())}
function renderFleet(){
  if(!schoolAllowed())return false;
  const s=fleetState(),p=proof();
  const n=Number(p?.independentSources||0),total=Number(p?.sourceTotal||5),contr=Number(p?.contradictions||0);
  const telemetry=p?.sources?.telemetry?.present===true;
  const brief=[
    'MDM · FLEET / CORPORATE DRIVER BRIEF',
    t('Azienda','Company','Kumpanija')+': '+(s.company||'—'),
    t('Veicolo / contesto','Vehicle / context','Vettura / kuntest')+': '+(s.vehicle||'—'),
    t('Mansione','Duty','Dmir')+': '+(s.duty||'—'),
    t('Priorità operative','Operational priorities','Prijoritajiet operattivi')+': '+(s.notes||'—'),
    t('Fonti evidenza','Evidence sources','Sorsi ta’ evidenza')+': '+n+'/'+total,
    t('Telemetria','Telemetry','Telemetrija')+': '+(telemetry?t('presente','present','preżenti'):t('non presente','not present','mhix preżenti')),
    t('Contraddizioni','Contradictions','Kontradizzjonijiet')+': '+contr
  ].join('\n');
  const html='<div class="mdm-restored-page">'+
    '<div class="section-title"><div><h2>'+esc(t('Fleet / Corporate','Fleet / Corporate','Flotta / Korporattiv'))+'</h2><p>'+esc(t('Contesto conducente e Driver Brief collegati alle evidenze reali già disponibili.','Driver context and Driver Brief linked to real evidence already available.','Kuntest tas-sewwieq u Driver Brief marbuta mal-evidenza reali diġà disponibbli.'))+'</p></div><span class="badge">45.8.25</span></div>'+
    '<section class="mdm-restored-hero"><small>MDM · DRIVER INTELLIGENCE</small><h1>'+esc(t('Dal contesto di lavoro alle evidenze di guida','From work context to driving evidence','Mill-kuntest tax-xogħol għall-evidenza tas-sewqan'))+'</h1><p>'+esc(t('Il contesto Fleet è locale; le evidenze mostrate provengono dal ProofLoop corrente.','Fleet context is local; displayed evidence comes from the current ProofLoop.','Il-kuntest tal-Flotta huwa lokali; l-evidenza murija ġejja mill-ProofLoop kurrenti.'))+'</p><div class="mdm-restored-metrics"><article><strong>'+n+'/'+total+'</strong><span>'+esc(t('fonti','sources','sorsi'))+'</span></article><article><strong>'+(telemetry?'✓':'—')+'</strong><span>'+esc(t('telemetria','telemetry','telemetrija'))+'</span></article><article><strong>'+contr+'</strong><span>'+esc(t('contraddizioni','contradictions','kontradizzjonijiet'))+'</span></article></div></section>'+
    '<section class="mdm-restored-card"><h2>'+esc(t('Contesto conducente','Driver context','Kuntest tas-sewwieq'))+'</h2><div class="mdm-restored-form"><label><span>'+esc(t('Azienda','Company','Kumpanija'))+'</span><input id="mdmFleetCompany" maxlength="100" value="'+esc(s.company||'')+'"></label><label><span>'+esc(t('Veicolo / contesto','Vehicle / context','Vettura / kuntest'))+'</span><input id="mdmFleetVehicle" maxlength="100" value="'+esc(s.vehicle||'')+'"></label><label class="wide"><span>'+esc(t('Mansione / tipo di lavoro','Duty / work type','Dmir / tip ta’ xogħol'))+'</span><input id="mdmFleetDuty" maxlength="140" value="'+esc(s.duty||'')+'"></label><label class="wide"><span>'+esc(t('Priorità operative','Operational priorities','Prijoritajiet operattivi'))+'</span><textarea id="mdmFleetNotes" maxlength="600">'+esc(s.notes||'')+'</textarea></label></div><button id="mdmFleetSave" type="button" class="btn" style="margin-top:12px;width:100%">'+esc(t('Salva contesto locale','Save local context','Issejvja l-kuntest lokali'))+'</button></section>'+
    '<section class="mdm-restored-card"><h2>'+esc(t('Evidenze disponibili','Available evidence','Evidenza disponibbli'))+'</h2><div class="mdm-restored-grid"><article class="mdm-restored-source"><strong>'+n+'/'+total+'</strong><small>'+esc(t('fonti indipendenti','independent sources','sorsi indipendenti'))+'</small></article><article class="mdm-restored-source"><strong>'+(telemetry?t('Presente','Present','Preżenti'):t('Non presente','Not present','Mhix preżenti'))+'</strong><small>'+esc(t('telemetria','telemetry','telemetrija'))+'</small></article></div></section>'+
    '<section class="mdm-restored-card"><h2>Driver Brief</h2><p>'+esc(t('Il brief riassume il contesto locale insieme ai segnali ProofLoop correnti.','The brief summarises local context together with current ProofLoop signals.','Il-brief jiġbor fil-qosor il-kuntest lokali flimkien mas-sinjali ProofLoop kurrenti.'))+'</p><button id="mdmFleetBrief" type="button" class="btn">'+esc(t('Copia Driver Brief','Copy Driver Brief','Ikkopja Driver Brief'))+'</button></section>'+
  '</div>';
  if(!setScreen(html))return false;
  document.getElementById('mdmFleetSave')?.addEventListener('click',()=>{
    const st={version:'45.8.25',company:String(document.getElementById('mdmFleetCompany')?.value||'').trim(),vehicle:String(document.getElementById('mdmFleetVehicle')?.value||'').trim(),duty:String(document.getElementById('mdmFleetDuty')?.value||'').trim(),notes:String(document.getElementById('mdmFleetNotes')?.value||'').trim(),updatedAt:new Date().toISOString()};
    write(FLEET_KEY,st);notify(t('Contesto salvato','Context saved','Kuntest issejvjat'));
  });
  document.getElementById('mdmFleetBrief')?.addEventListener('click',async()=>{await copyText(brief);notify(t('Driver Brief copiato','Driver Brief copied','Driver Brief ikkupjat'))});
  return true;
}

function renderRoute(){
  injectStyle();
  const r=routeName();
  if(r===ROUTES.parent)return renderParent();
  if(r===ROUTES.debrief)return renderDebrief();
  if(r===ROUTES.operations)return renderOperations();
  if(r===ROUTES.fleet)return renderFleet();
  const b=document.getElementById('backBtn');if(b?.hasAttribute('data-mdm-restored-back'))b.removeAttribute('data-mdm-restored-back');
  mountStudentHome();mountSchoolHome();mountPractical();
  return false;
}
function schedule(){
  [0,60,160,350,700,1200,2200].forEach(ms=>setTimeout(renderRoute,ms));
}
document.addEventListener('click',function(ev){
  const routeEl=ev.target?.closest?.('[data-mdm-restored-route]');
  if(routeEl){
    ev.preventDefault();ev.stopImmediatePropagation();
    openRoute(String(routeEl.getAttribute('data-mdm-restored-route')||''));
    return;
  }
  const back=ev.target?.closest?.('#backBtn[data-mdm-restored-back]');
  if(back&&Object.values(ROUTES).includes(routeName())){
    ev.preventDefault();ev.stopImmediatePropagation();history.back();return;
  }
  if(ev.target?.closest?.('[data-nav],.brand,[data-go],#langBtn'))setTimeout(schedule,40);
},true);
window.addEventListener('popstate',schedule);
window.addEventListener('pageshow',schedule);
window.addEventListener('mdm:owner-authority',schedule);
window.addEventListener('storage',function(ev){if([OPS_KEY,FLEET_KEY,'mdm-v1-settings'].includes(String(ev.key||'')))schedule()});
document.addEventListener('visibilitychange',function(){if(!document.hidden)schedule()});
injectStyle();schedule();

window.MDM_RESTORED_RUNTIME_458382532=Object.freeze({
  version:VERSION,
  routes:ROUTES,
  refresh:schedule,
  render:renderRoute
});
})();