/* Malta Driving Master 45.8.38 — Compact Home + Instructor Co-Sign */
(function(){
'use strict';
if(window.MDM_COMPACT_HOME_45836)return;
const V='45.8.38', HUB='mdmCompactRealPreparation';
let open='', raf=0;

function p(v){try{return v?JSON.parse(v):null}catch(_){return null}}
function lang(){return String(p(localStorage.getItem('mdm-v1-settings'))?.lang||'en')}
function t(it,en,mt){const l=lang();return l==='it'?it:l==='mt'?mt:en}
function home(){const h=String(location.hash||'').replace(/^#/,'');return !h||h==='home'}
function proof(){try{return window.MDM_PROOFLOOP_ENGINE?.evaluate?.()||null}catch(_){return null}}
function mission(){try{return window.MDM_PROOFLOOP_VERIFICATION?.current?.()||null}catch(_){return null}}
function exam(){try{return window.MDM_PROOFLOOP_EXAM_OUTCOME?.current?.()||null}catch(_){return null}}
function passport(){try{return window.MDM_DRIVER_COMPETENCE_PASSPORT?.current?.()||null}catch(_){return null}}
function road(){try{return window.MDM_MALTA_ROAD_INTELLIGENCE?.snapshot?.()||null}catch(_){return null}}
function esc(v){return String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}

function proofText(){
 const x=proof();if(!x)return t('Dati non disponibili','Data unavailable','Data mhux disponibbli');
 const q=x.quality==='high'?t('Alta','High','Għolja'):x.quality==='medium'?t('Media','Medium','Medja'):t('Bassa','Low','Baxxa');
 return q+' · '+Number(x.independentSources||0)+'/'+Number(x.sourceTotal||5)+' '+t('fonti','sources','sorsi')+' · '+Number(x.contradictions||0)+' '+t('contraddizioni','contradictions','kontradizzjonijiet');
}
function missionText(){
 const m=mission();if(!m)return t('Nessuna missione attiva','No active mission','L-ebda missjoni attiva');
 const label=String(m.target?.label||t('Competenza da verificare','Skill to verify','Ħila li trid tiġi vverifikata'));
 let state=t('Missione attiva','Mission active','Missjoni attiva');
 if(m.status==='awaiting_instructor')state=t('Pronta per istruttore','Ready for instructor','Lesta għall-istruttur');
 if(m.status==='evidence_conflict')state=t('Da chiarire','Needs resolving','Trid tiġi ċċarata');
 if(m.status==='revision_requested')state=t('Revisione richiesta','Revision requested','Intalbet reviżjoni');
 if(m.status==='verified'&&m.instructorVerified===true)state=t('Verificata','Verified','Ivverifikata');
 return label+' · '+state;
}
function examText(){
 const e=exam();
 if(e?.outcome?.result)return String(e.outcome.result).toUpperCase()+(e.outcome.date?' · '+e.outcome.date:'');
 if(e?.snapshot)return t('Snapshot pre-esame pronto','Pre-exam snapshot ready','Snapshot qabel l-eżami lest');
 return t('Snapshot non creato','Snapshot not created','Snapshot għadu ma nħoloqx');
}
function passportText(){
 const s=passport();if(!s)return t('Passport non inizializzato','Passport not initialized','Passaport għadu ma nbdiex');
 const id=s.activePackId||'', pack=s.packs?.[id]||{}, rows=Object.values(pack.competencies||{});
 const verified=rows.filter(r=>r?.status==='verified').length;
 const checking=rows.filter(r=>r?.status==='in_verification').length;
 const consolidate=rows.filter(r=>r?.status==='consolidate').length;
 const code={'MT-B':'B','MT-A':'A','MT-C-CE':'C/CE','MT-D':'D','MT-LPTV':'LPTV'}[id]||id||'—';
 let out=code+' · '+verified+' '+t('verificate','verified','ivverifikati')+' · '+checking+' '+t('in verifica','in verification','qed jiġu vverifikati');
 if(consolidate)out+=' · '+consolidate+' '+t('da consolidare','to consolidate','biex jiġu kkonsolidati');
 return out;
}
function roadText(){
 const r=road();if(!r)return t('Dati strada non disponibili','Road data unavailable','Data tat-triq mhux disponibbli');
 return Number(r.sessions||0)+' '+t('sessioni','sessions','sessjonijiet')+' · '+Number(r.records||0)+' '+t('prove','road proofs','provi')+' · '+Number(r.eventTypes||0)+' '+t('tipi evento','event types','tipi ta’ avvenimenti');
}
function rows(){
 return [
  ['proof','🛡️','ProofLoop',proofText()],
  ['mission','🎯',t('Missione di verifica','Verification Mission','Missjoni ta’ verifika'),missionText()],
  ['exam','🏁',t('Esito esame reale','Real Exam Outcome','Riżultat reali tat-test'),examText()],
  ['passport','🪪',t('Competence Passport','Competence Passport','Passaport tal-kompetenzi'),passportText()],
  ['road','🛣️',t('Malta Road Intelligence','Malta Road Intelligence','Malta Road Intelligence'),roadText()]
 ];
}
function cards(){
 return {
  proof:document.getElementById('mdmProofLoopCard'),
  exam:document.getElementById('mdmExamOutcomeCard'),
  passport:document.getElementById('mdmDriverCompetencePassport'),
  road:document.getElementById('mdmMaltaRoadIntelligence')
 };
}
function target(id){
 const c=cards();
 if(id==='proof'||id==='mission')return c.proof;
 return c[id]||null;
}
function collapseButton(card,id){
 if(!card)return;
 let b=card.querySelector(':scope > .mdm-compact-collapse');
 if(!b){b=document.createElement('button');b.type='button';b.className='mdm-compact-collapse';card.prepend(b)}
 b.textContent='↑ '+t('Riduci','Collapse','Naqqas');
 b.onclick=()=>{open='';apply();document.getElementById(HUB)?.scrollIntoView({behavior:'smooth',block:'start'})};
}
function setCollapsed(el,collapsed){
 if(!el)return;
 el.classList.toggle('mdm-compact-collapsed',!!collapsed);
 el.setAttribute('aria-hidden',collapsed?'true':'false');
}
function setVisibility(){
 const c=cards();
 setCollapsed(c.proof,!(open==='proof'||open==='mission'));
 setCollapsed(c.exam,open!=='exam');
 setCollapsed(c.passport,open!=='passport');
 setCollapsed(c.road,open!=='road');
 if(c.proof&&(open==='proof'||open==='mission'))collapseButton(c.proof,open);
 if(c.exam&&open==='exam')collapseButton(c.exam,'exam');
 if(c.passport&&open==='passport')collapseButton(c.passport,'passport');
 if(c.road&&open==='road')collapseButton(c.road,'road');
}
function renderHub(){
 const c=cards(), anchor=c.proof||c.exam||c.passport;if(!anchor)return null;
 let hub=document.getElementById(HUB);
 if(!hub){hub=document.createElement('section');hub.id=HUB;hub.className='mdm-compact-hub';anchor.before(hub)}
 const body=rows().map(([id,icon,title,detail])=>{
  const active=open===id;
  return '<button type="button" data-open="'+id+'" class="'+(active?'active':'')+'" aria-expanded="'+active+'"><span class="ico">'+icon+'</span><span class="copy"><strong>'+esc(title)+'</strong><small>'+esc(detail)+'</small></span><span class="go">'+esc(active?t('Aperto','Open','Miftuħ'):t('Apri','Open','Iftaħ'))+' '+(active?'↑':'›')+'</span></button>';
 }).join('');
 const html='<header><div><small>MDM PROOFLOOP · '+V+'</small><h2>'+esc(t('La tua preparazione reale','Your real preparation','Il-preparazzjoni reali tiegħek'))+'</h2><p>'+esc(t('Apri solo ciò che ti serve.','Open only what you need.','Iftaħ biss dak li għandek bżonn.'))+'</p></div><span>⚡</span></header><div class="list">'+body+'</div>';
 if(hub.dataset.signature!==html){
  hub.innerHTML=html;
  hub.dataset.signature=html;
 }
 hub.querySelectorAll('[data-open]').forEach(b=>b.onclick=()=>{
  const id=b.dataset.open;open=open===id?'':id;apply();
  if(open)setTimeout(()=>{
   let el=target(open);if(open==='mission')el=el?.querySelector('.mdm-proofloop-verification')||el;
   el?.scrollIntoView({behavior:'smooth',block:'start'});
  },30);
 });
 return hub;
}
function apply(){
 if(!home()){
  document.getElementById(HUB)?.remove();
  Object.values(cards()).filter(Boolean).forEach(x=>{x.classList.remove('mdm-compact-collapsed');x.removeAttribute('aria-hidden')});
  return;
 }
 if(!renderHub())return;
 setVisibility();
}
function schedule(){if(raf)return;raf=requestAnimationFrame(()=>{raf=0;apply()})}
apply();
const screen=document.getElementById('screen');
if(screen){const o=new MutationObserver(schedule);o.observe(screen,{childList:true,subtree:true});window.__MDM_COMPACT_HOME_OBSERVER__=o}
window.addEventListener('pageshow',schedule);
window.addEventListener('storage',schedule);
window.addEventListener('popstate',()=>{open='';schedule()});
document.addEventListener('visibilitychange',()=>{if(!document.hidden)schedule()});
window.MDM_COMPACT_HOME_45836=Object.freeze({version:V,refresh:apply,close(){open='';apply()}});
})();