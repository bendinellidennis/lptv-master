/* Malta Driving Master 45.8.38.25.2.26 — Instructor Assignments render correction
   Scope: Instructor Assignments UI only.
   Fixes stale technical labels, server-role display, duplicate delivered local history,
   zero local-queue clutter and IT/EN/MT label purity before the view is painted.
   No route/auth/telemetry mutation. No MutationObserver. */
(function(){
'use strict';
if(window.MDM_INSTRUCTOR_ASSIGNMENTS_RENDER_FIX_458382526)return;

const VERSION='45.8.38.25.2.26';

function lang(){
  try{
    const s=JSON.parse(localStorage.getItem('mdm-v1-settings')||'{}');
    const l=String(s.lang||'en').toLowerCase();
    return l==='it'||l==='mt'?l:'en';
  }catch(_){return'en'}
}
function tr(it,en,mt){const l=lang();return l==='it'?it:l==='mt'?mt:en}
function schoolAuthorized(){
  try{if(window.MDM_OWNER_AUTHORITY?.isOwner?.()===true)return true}catch(_){}
  try{if(window.MDM_PRIVILEGED_ROUTE_GUARD?.isSchoolAllowed?.()===true)return true}catch(_){}
  try{
    const s=window.MDM_PRIVILEGED_ROUTE_GUARD?.schoolSnapshot?.();
    return Boolean(s&&s.status==='verified'&&s.authorized===true);
  }catch(_){return false}
}
function n(v){const x=parseInt(String(v||'').match(/\d+/)?.[0]||'0',10);return Number.isFinite(x)?x:0}

function cleanHtml(html){
  const box=document.createElement('div');
  box.innerHTML=String(html||'');

  const title=box.querySelector('.assignment-title h2');
  if(title)title.textContent='🎯 '+tr('Assegnazioni Istruttore','Instructor Assignments','Inkarigi tal-Istruttur');
  box.querySelector('.assignment-title .badge')?.remove();

  const heroSmall=box.querySelector('.assignment-hero small');
  if(heroSmall)heroSmall.textContent=String(heroSmall.textContent||'').replace(/^44\.5\s*·\s*/,'').trim();

  const statusArticles=[...box.querySelectorAll('.assignment-status-grid article')];
  for(const a of statusArticles){
    const key=String(a.querySelector('small')?.textContent||'').trim().toUpperCase();
    const strong=a.querySelector('strong');
    if(!strong)continue;
    if(key.includes('RUOLO SERVER')||key.includes('SERVER ROLE')||key.includes('RWOL TAS-SERVER')){
      if(schoolAuthorized())strong.textContent='🏫 School Admin · ACTIVE';
    }
    if(key.includes('PREVIEW COMPLETE')||key.includes('PREVIEW COMPLETED')||key.includes('PREVIEW LESTI')){
      const small=a.querySelector('small');
      if(small)small.textContent=tr('ANTEPRIME COMPLETATE','PREVIEWS COMPLETED','PREVIEWS LESTI');
    }
  }

  const queue=box.querySelector('.assignment-queue-lock');
  if(queue){
    const count=n(queue.querySelector('h2')?.textContent);
    if(count===0){
      queue.remove();
    }else{
      const small=queue.querySelector('small');
      const h2=queue.querySelector('h2');
      const p=queue.querySelector('p');
      if(small)small.textContent=tr('CONSEGNA IN ATTESA','DELIVERY PENDING','KUNSINNA PENDENTI');
      if(h2)h2.textContent=count+' '+(count===1
        ?tr('missione locale in attesa','local mission waiting','missjoni lokali qed tistenna')
        :tr('missioni locali in attesa','local missions waiting','missjonijiet lokali qed jistennew'));
      if(p)p.textContent=tr(
        'Le missioni non ancora consegnate restano locali finché il server non conferma studente e scuola.',
        'Missions not yet delivered remain local until the server confirms learner and school.',
        'Missjonijiet li għadhom ma twasslux jibqgħu lokali sakemm is-server jikkonferma l-istudent u l-iskola.'
      );
    }
  }

  const history=box.querySelector('.assignment-history');
  if(history){
    const list=history.querySelector('.assignment-list');
    if(list){
      [...list.querySelectorAll('.assignment-card')].forEach(card=>{
        const st=String(card.querySelector('.assignment-status')?.textContent||'').toUpperCase();
        if(st.includes('SERVER · CONSEGNATA')||st.includes('SERVER · DELIVERED')||st.includes('SERVER · MOGĦTIJA'))card.remove();
      });
      const remain=list.querySelectorAll('.assignment-card').length;
      if(remain===0){
        history.remove();
      }else{
        const h2=history.querySelector('.assignment-section-head h2');
        if(h2)h2.textContent=remain+' '+(remain===1
          ?tr('assegnazione preparata','prepared assignment','assenjazzjoni mħejjija')
          :tr('assegnazioni preparate','prepared assignments','assenjazzjonijiet imħejjija'));
      }
    }
  }

  const roster=box.querySelector('[data-go="schoolroster"]');
  if(roster)roster.textContent='👥 '+tr('Registro Scuola','School Roster','Reġistru tal-Iskola');
  const intel=box.querySelector('[data-go="instructorintelligence"]');
  if(intel)intel.textContent='👨‍🏫 '+tr('Intelligenza Istruttore','Instructor Intelligence','Intelliġenza tal-Istruttur');

  return box.innerHTML;
}

function install(){
  const original=window.instructorAssignmentsViewHtml;
  if(typeof original!=='function')return false;
  if(original.__mdm458382526)return true;
  function wrapped(){
    return cleanHtml(original.apply(this,arguments));
  }
  Object.defineProperty(wrapped,'__mdm458382526',{value:true});
  window.instructorAssignmentsViewHtml=wrapped;
  return true;
}

install();
window.addEventListener('pageshow',install);

window.MDM_INSTRUCTOR_ASSIGNMENTS_RENDER_FIX_458382526=Object.freeze({
  version:VERSION,install,cleanHtml
});
})();