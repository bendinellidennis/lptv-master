/* Malta Driving Master 45.8.38.23.2 — Safe dedicated School Evidence entry
   Uses the already verified Telemetry card as the primary mount anchor.
   Never replaces #screen, never overlays body, never modifies the School Home structure. */
(function(){
'use strict';
if(window.MDM_SCHOOL_EVIDENCE_ENTRY_45838232)return;
window.MDM_SCHOOL_EVIDENCE_ENTRY_45838232=true;
const VERSION='45.8.38.23.2';
const CARD_ID='mdmSchoolEvidenceSafeCard';
function parse(v){try{return v?JSON.parse(v):null}catch(_){return null}}
function lang(){try{return String(parse(localStorage.getItem('mdm-v1-settings'))?.lang||'en')}catch(_){return'en'}}
function tr(it,en,mt){const l=lang();return l==='it'?it:l==='mt'?mt:en}
function norm(v){return String(v||'').replace(/\s+/g,' ').trim().toUpperCase()}
function isAdvancedText(tx){return tx.includes('STRUMENTI AVANZATI')||tx.includes('ADVANCED TOOLS')||tx.includes('GĦODOD AVVANZATI')}
function advancedTitle(){
 const preferred=Array.from(document.querySelectorAll('.sch35-title,h1,h2,h3,h4,h5,strong,b'));
 let hit=preferred.find(el=>{const tx=norm(el.textContent||'');return tx.length<=90&&isAdvancedText(tx)});
 if(hit)return hit;
 return Array.from(document.querySelectorAll('main *')).find(el=>{const tx=norm(el.textContent||'');return tx.length<=90&&isAdvancedText(tx)})||null;
}
function advancedGrid(){
 /* Primary, safest anchor: Telemetry is already approved and visible in this exact grid. */
 const telemetry=document.getElementById('mdmSchoolTelemetryCard');
 if(telemetry?.parentElement)return telemetry.parentElement;
 const title=advancedTitle();
 if(!title)return null;
 const school=title.closest('.sch35,.sch35-profile')||title.parentElement;
 if(!school)return null;
 const titleTop=title.getBoundingClientRect?.().top||0;
 const candidates=Array.from(school.querySelectorAll('.sch35-grid,[class*="grid"]')).filter(el=>{
  if(el===title||el.contains(title))return false;
  const r=el.getBoundingClientRect?.();
  if(r&&r.top<titleTop-2)return false;
  const tx=norm(el.textContent||'');
  return tx.includes('INTELLIGENZA ISTRUTTORE')||tx.includes('INSTRUCTOR INTELLIGENCE')||tx.includes('STUDIO ISTRUTTORE')||tx.includes('INSTRUCTOR STUDIO')||tx.includes('CENTRO DI COMANDO')||tx.includes('COMMAND CENTER')||tx.includes('TRUST CENTER')||tx.includes('TELEMETRIA')||tx.includes('TELEMETRY');
 });
 return candidates.length?candidates.sort((a,b)=>(a.getBoundingClientRect?.().top||0)-(b.getBoundingClientRect?.().top||0))[0]:null;
}
function makeCard(){
 let card=document.getElementById(CARD_ID);if(card)return card;
 card=document.createElement('button');
 card.id=CARD_ID;card.type='button';card.className='sch35-card blue';
 card.style.cssText='text-align:left;width:100%;cursor:pointer;border:0;font:inherit;color:inherit';
 card.innerHTML='<div style="font-size:30px;line-height:1;margin-bottom:12px">🔄</div><strong style="display:block;font-size:17px;margin-bottom:5px">'+tr('Evidenze studenti','Student Evidence','Evidenza tal-istudenti')+'</strong><span style="display:block;font-size:12px;opacity:.72">'+tr('Missioni, prove e verifica umana','Missions, evidence and human review','Missjonijiet, evidenza u verifika umana')+'</span>';
 card.addEventListener('click',function(){window.location.assign('mdm-school-evidence.html?v=45838232');});
 return card;
}
function place(){
 const grid=advancedGrid();
 if(!grid)return false;
 const card=makeCard();
 if(card.parentElement!==grid)grid.appendChild(card);
 return true;
}
function schedule(){[0,80,180,350,700,1200,2000,3500,5000,8000,12000,20000,30000].forEach(ms=>setTimeout(place,ms))}
schedule();
window.addEventListener('pageshow',schedule);
window.addEventListener('popstate',schedule);
document.addEventListener('visibilitychange',function(){if(!document.hidden)schedule()});
window.MDM_SCHOOL_EVIDENCE_ENTRY_4583823_API=Object.freeze({version:VERSION,place});
})();