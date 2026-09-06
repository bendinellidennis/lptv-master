/* Malta Driving Master 45.8.38.25.2.32.2 — Cumulative feature entrypoint bridge
   Restores reachability of approved modules already present in the active split runtime.
   It does NOT reimplement their logic and does NOT touch Auth, question banks, Replay,
   Telemetry, Evidence, ProofLoop or mission engines. */
(function(){
'use strict';
if(window.MDM_CUMULATIVE_ENTRYPOINT_BRIDGE_4583825322)return;

const VERSION='45.8.38.25.2.32.2';
const ROUTES=Object.freeze({
  parent:'parentportal',
  debrief:'lessondebrief',
  operations:'schooloperations',
  fleet:'fleetcorporate'
});

function parse(v){try{return v?JSON.parse(v):null}catch(_){return null}}
function lang(){try{const l=String(parse(localStorage.getItem('mdm-v1-settings'))?.lang||'en');return ['it','en','mt'].includes(l)?l:'en'}catch(_){return'en'}}
function t(it,en,mt){const l=lang();return l==='it'?it:l==='mt'?mt:en}
function esc(v){return String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
function routeName(){return String(location.hash||'').replace(/^#/,'').split('?')[0].trim()}
function session(){
  const s=parse(localStorage.getItem('mdm_auth_session_v4410'));
  if(!s||s.status!=='authenticated'||!s.user?.id)return null;
  if(Number(s.expiresAt||0)>0&&Number(s.expiresAt)<=Date.now())return null;
  return s;
}
function isOwner(){return window.MDM_OWNER_AUTHORITY?.isOwner?.()===true}
function schoolAllowed(){
  if(isOwner())return true;
  const s=window.MDM_PRIVILEGED_ROUTE_GUARD?.schoolSnapshot?.();
  return Boolean(s&&s.status==='verified'&&s.authorized===true);
}
function studentAllowed(){
  if(!session()||isOwner())return false;
  const s=window.MDM_PRIVILEGED_ROUTE_GUARD?.schoolSnapshot?.();
  return !(s&&s.status==='verified'&&s.authorized===true);
}
function norm(v){return String(v||'').replace(/\s+/g,' ').trim().toUpperCase()}

function makeCard(id,school,icon,title,sub,route){
  let card=document.getElementById(id);
  if(!card){
    card=document.createElement('button');
    card.id=id;
    card.type='button';
  }
  card.className=school?'sch35-card blue':(document.querySelector('.hm30-card')?'hm30-card':'home-card');
  card.setAttribute('data-go',route);
  card.setAttribute('data-mdm-cumulative-entry','1');
  card.removeAttribute('data-mdm-restored-route');
  card.style.cssText='text-align:left;width:100%;cursor:pointer;border:0;font:inherit;color:inherit';
  card.innerHTML='<div style="font-size:30px;line-height:1;margin-bottom:12px">'+icon+'</div><strong style="display:block;font-size:17px;margin-bottom:5px">'+esc(title)+'</strong><span style="display:block;font-size:12px;opacity:.72">'+esc(sub)+'</span>';
  return card;
}

function studentGrid(){
  const screen=document.getElementById('screen');if(!screen)return null;
  const anchor=screen.querySelector('[data-go="evidencepassport"]')||screen.querySelector('[data-go="studentos"]')||screen.querySelector('.hm30-card,.home-card');
  if(anchor?.parentElement)return anchor.parentElement;
  return screen.querySelector('.hm30-grid,.grid')||null;
}
function mountStudentHome(){
  const r=routeName();
  if(r&&r!=='home')return false;
  if(!studentAllowed())return false;
  const grid=studentGrid();if(!grid)return false;
  const card=makeCard(
    'mdmParentSponsorHomeCard',false,'👪',
    t('Parent / Sponsor Portal','Parent / Sponsor Portal','Portal tal-Ġenitur / Sponsor'),
    t('Report trasparente su progresso, evidenze e prossimo obiettivo, condiviso solo su scelta dello studente.','Transparent report on progress, evidence and the next goal, shared only by learner choice.','Rapport trasparenti dwar progress, evidenza u l-għan li jmiss, maqsum biss bl-għażla tal-istudent.'),
    ROUTES.parent
  );
  if(card.parentElement!==grid)grid.appendChild(card);
  return true;
}

function advancedTitle(){
  const preferred=Array.from(document.querySelectorAll('.sch35-title,h1,h2,h3,h4,h5,strong,b'));
  return preferred.find(el=>{
    const tx=norm(el.textContent||'');
    return tx.length<=90&&(tx.includes('STRUMENTI AVANZATI')||tx.includes('ADVANCED TOOLS')||tx.includes('GĦODOD AVVANZATI'));
  })||null;
}
function schoolGrid(){
  const telemetry=document.getElementById('mdmSchoolTelemetryCard');
  if(telemetry?.parentElement)return telemetry.parentElement;
  const evidence=document.getElementById('mdmSchoolEvidenceSafeCard');
  if(evidence?.parentElement)return evidence.parentElement;
  const title=advancedTitle();if(!title)return null;
  const school=title.closest('.sch35,.sch35-profile')||title.parentElement;if(!school)return null;
  const titleTop=title.getBoundingClientRect?.().top||0;
  const candidates=Array.from(school.querySelectorAll('.sch35-grid,[class*="grid"]')).filter(el=>{
    if(el===title||el.contains(title))return false;
    const r=el.getBoundingClientRect?.();if(r&&r.top<titleTop-2)return false;
    const tx=norm(el.textContent||'');
    return tx.includes('INTELLIGENZA ISTRUTTORE')||tx.includes('INSTRUCTOR INTELLIGENCE')||
      tx.includes('CENTRO DI COMANDO')||tx.includes('COMMAND CENTER')||
      tx.includes('TRUST CENTER')||tx.includes('TELEMETRIA')||tx.includes('TELEMETRY');
  });
  return candidates.sort((a,b)=>(a.getBoundingClientRect?.().top||0)-(b.getBoundingClientRect?.().top||0))[0]||null;
}
function mountSchoolHome(){
  if(routeName()!=='schoolhome'||!schoolAllowed())return false;
  const grid=schoolGrid();if(!grid)return false;
  const ops=makeCard(
    'mdmSchoolOperationsHomeCard',true,'🏫',
    t('Operazioni scuola','School Operations','Operazzjonijiet tal-Iskola'),
    t('Prenotazioni, pagamenti, CRM e operazioni della scuola.','Bookings, payments, CRM and school operations.','Ibbukkjar, ħlasijiet, CRM u operazzjonijiet tal-iskola.'),
    ROUTES.operations
  );
  const fleet=makeCard(
    'mdmFleetCorporateHomeCard',true,'🚚',
    t('Fleet / Corporate Driver Intelligence','Fleet / Corporate Driver Intelligence','Intelliġenza tas-Sewwieq għall-Flotta / Kumpanija'),
    t('Twin, Passport, strada e telemetria nel contesto professionale.','Twin, Passport, road evidence and telemetry in the professional context.','Twin, Passport, evidenza tat-triq u telemetrija fil-kuntest professjonali.'),
    ROUTES.fleet
  );
  if(ops.parentElement!==grid)grid.appendChild(ops);
  if(fleet.parentElement!==grid)grid.appendChild(fleet);
  return true;
}

function mountPracticalDebrief(){
  if(routeName()!=='practicallesson'||!studentAllowed())return false;
  const screen=document.getElementById('screen');if(!screen)return false;
  if(screen.querySelector('[data-go="lessondebrief"]'))return true;
  let box=document.getElementById('mdmAIDebriefPracticalLaunch');
  if(!box){
    box=document.createElement('section');
    box.id='mdmAIDebriefPracticalLaunch';
    box.className='card practical-lesson-debrief-launch';
    box.innerHTML='<small>MDM · '+VERSION+'</small><h3>'+esc(t('AI Lesson Debrief','AI Lesson Debrief','AI Lesson Debrief'))+'</h3><p>'+esc(t('Debrief post-lezione basato sulle prove già registrate.','Post-lesson debrief grounded in evidence already recorded.','Debrief wara l-lezzjoni bbażat fuq evidenza diġà rreġistrata.'))+'</p><button type="button" class="btn" data-go="'+ROUTES.debrief+'">'+esc(t('Apri debrief della lezione','Open lesson debrief','Iftaħ id-debrief tal-lezzjoni'))+' →</button>';
  }
  const title=screen.querySelector('.section-title');
  if(box.parentElement!==screen){
    if(title)title.insertAdjacentElement('afterend',box);
    else screen.insertBefore(box,screen.firstChild||null);
  }
  return true;
}

function cleanWrongContext(){
  if(routeName()!=='home'||!studentAllowed())document.getElementById('mdmParentSponsorHomeCard')?.remove();
  if(routeName()!=='schoolhome'||!schoolAllowed()){
    document.getElementById('mdmSchoolOperationsHomeCard')?.remove();
    document.getElementById('mdmFleetCorporateHomeCard')?.remove();
  }
  if(routeName()!=='practicallesson')document.getElementById('mdmAIDebriefPracticalLaunch')?.remove();
}
function place(){
  cleanWrongContext();
  mountStudentHome();
  mountSchoolHome();
  mountPracticalDebrief();
}
function schedule(){[0,60,160,350,700,1200,2200,4000].forEach(ms=>setTimeout(place,ms))}

schedule();
window.addEventListener('pageshow',schedule);
window.addEventListener('popstate',schedule);
window.addEventListener('mdm:owner-authority',schedule);
document.addEventListener('visibilitychange',()=>{if(!document.hidden)schedule()});
document.addEventListener('click',ev=>{
  if(ev.target?.closest?.('[data-nav],.brand,[data-go],#langBtn'))setTimeout(schedule,40);
},true);

window.MDM_CUMULATIVE_ENTRYPOINT_BRIDGE_4583825322=Object.freeze({
  version:VERSION,
  routes:ROUTES,
  refresh:schedule
});
})();