/* Malta Driving Master 45.8.38.23 — Safe dedicated School Evidence entry
   Adds one Advanced Tools card only. It never replaces #screen, never overlays body,
   and opens a separate same-origin page so the approved Home remains untouched. */
(function(){
'use strict';
if(window.MDM_SCHOOL_EVIDENCE_ENTRY_4583823)return;
window.MDM_SCHOOL_EVIDENCE_ENTRY_4583823=true;
const CARD_ID='mdmSchoolEvidenceSafeCard';
function parse(v){try{return v?JSON.parse(v):null}catch(_){return null}}
function lang(){try{return String(parse(localStorage.getItem('mdm-v1-settings'))?.lang||'en')}catch(_){return'en'}}
function tr(it,en,mt){const l=lang();return l==='it'?it:l==='mt'?mt:en}
function norm(v){return String(v||'').replace(/\s+/g,' ').trim().toUpperCase()}
function advancedTitle(){
 const nodes=Array.from(document.querySelectorAll('.sch35-title,h1,h2,h3,h4,h5,strong,b'));
 return nodes.find(el=>{const tx=norm(el.textContent);return tx==='STRUMENTI AVANZATI'||tx==='ADVANCED TOOLS'||tx==='GĦODOD AVVANZATI'})||null;
}
function advancedGrid(title){
 if(!title)return null;
 const school=title.closest('.sch35,.sch35-profile')||title.parentElement;
 if(!school)return null;
 const telemetry=document.getElementById('mdmSchoolTelemetryCard');
 if(telemetry?.parentElement)return telemetry.parentElement;
 return Array.from(school.querySelectorAll('.sch35-grid,[class*="grid"]')).find(el=>{
  const tx=norm(el.textContent);
  return tx.includes('INTELLIGENZA ISTRUTTORE')||tx.includes('INSTRUCTOR INTELLIGENCE')||tx.includes('STUDIO ISTRUTTORE')||tx.includes('INSTRUCTOR STUDIO')||tx.includes('TRUST CENTER');
 })||null;
}
function makeCard(){
 let card=document.getElementById(CARD_ID);if(card)return card;
 card=document.createElement('button');
 card.id=CARD_ID;card.type='button';card.className='sch35-card blue';
 card.style.cssText='text-align:left;width:100%;cursor:pointer;border:0;font:inherit;color:inherit';
 card.innerHTML='<div style="font-size:30px;line-height:1;margin-bottom:12px">🔄</div><strong style="display:block;font-size:17px;margin-bottom:5px">'+tr('Evidenze studenti','Student Evidence','Evidenza tal-istudenti')+'</strong><span style="display:block;font-size:12px;opacity:.72">'+tr('Missioni, prove e verifica umana','Missions, evidence and human review','Missjonijiet, evidenza u verifika umana')+'</span>';
 card.addEventListener('click',function(){window.location.assign('mdm-school-evidence.html?v=4583823');});
 return card;
}
function place(){const title=advancedTitle(),grid=advancedGrid(title);if(!grid)return false;const card=makeCard();if(card.parentElement!==grid)grid.appendChild(card);return true}
function schedule(){[0,100,250,600,1200,2500,5000,9000,15000].forEach(ms=>setTimeout(place,ms))}
schedule();window.addEventListener('pageshow',schedule);document.addEventListener('visibilitychange',function(){if(!document.hidden)schedule()});
window.MDM_SCHOOL_EVIDENCE_ENTRY_4583823_API=Object.freeze({version:'45.8.38.23',place});
})();