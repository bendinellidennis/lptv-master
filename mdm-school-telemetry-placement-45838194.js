/* Malta Driving Master 45.8.38.19.4.1 — Robust Telemetry placement inside Advanced Tools */
(function(){
'use strict';
if(window.MDM_SCHOOL_TELEMETRY_PLACEMENT_458381941)return;
const VERSION='45.8.38.19.4.1';

function norm(v){return String(v||'').replace(/\s+/g,' ').trim().toUpperCase();}
function isAdvancedText(tx){return tx.includes('STRUMENTI AVANZATI')||tx.includes('ADVANCED TOOLS')||tx.includes('GĦODOD AVVANZATI');}
function advancedTitle(){
 const preferred=Array.from(document.querySelectorAll('.sch35-title,h1,h2,h3,h4,h5,strong,b'));
 let hit=preferred.find(el=>{const tx=norm(el.textContent||'');return tx.length<=90&&isAdvancedText(tx)});
 if(hit)return hit;
 const all=Array.from(document.querySelectorAll('main *'));
 hit=all.find(el=>{const tx=norm(el.textContent||'');return tx.length<=90&&isAdvancedText(tx)});
 return hit||null;
}
function advancedGrid(title){
 if(!title)return null;
 const school=title.closest('.sch35,.sch35-profile')||title.parentElement;
 if(!school)return null;
 const titleRect=title.getBoundingClientRect?.();
 const titleTop=titleRect?titleRect.top:0;
 const candidates=Array.from(school.querySelectorAll('.sch35-grid,[class*="grid"]')).filter(el=>{
  if(el===title||el.contains(title))return false;
  const r=el.getBoundingClientRect?.();
  if(r&&r.top<titleTop-2)return false;
  const tx=norm(el.textContent||'');
  return tx.includes('INTELLIGENZA ISTRUTTORE')||tx.includes('INSTRUCTOR INTELLIGENCE')||tx.includes('STUDIO ISTRUTTORE')||tx.includes('INSTRUCTOR STUDIO')||tx.includes('CENTRO DI COMANDO')||tx.includes('COMMAND CENTER')||tx.includes('TRUST CENTER');
 });
 if(candidates.length)return candidates.sort((a,b)=>(a.getBoundingClientRect?.().top||0)-(b.getBoundingClientRect?.().top||0))[0];
 let n=title.nextElementSibling;
 while(n){
  const tx=norm(n.textContent||'');
  if(tx.includes('INTELLIGENZA ISTRUTTORE')||tx.includes('STUDIO ISTRUTTORE')||tx.includes('CENTRO DI COMANDO')||tx.includes('TRUST CENTER'))return n;
  n=n.nextElementSibling;
 }
 return null;
}
function place(){
 const panel=document.getElementById('mdmSchoolTelemetryPanel');
 if(!panel)return false;
 const title=advancedTitle();
 if(!title)return false;
 const grid=advancedGrid(title);
 const parent=(grid&&grid.parentNode)||(title.parentNode);
 if(!parent)return false;
 if(grid){
  if(panel.parentNode!==parent||panel.previousElementSibling!==grid){
   grid.insertAdjacentElement('afterend',panel);
  }
 }else{
  if(panel.parentNode!==parent||panel.previousElementSibling!==title){
   title.insertAdjacentElement('afterend',panel);
  }
 }
 panel.dataset.mdmPlacement='advanced-tools';
 panel.dataset.mdmPlacementVersion=VERSION;
 return true;
}
function schedule(){
 [0,80,180,350,700,1200,2000,3500,5000,8000,12000,20000,30000].forEach(ms=>setTimeout(place,ms));
}
schedule();
window.addEventListener('pageshow',schedule);
window.addEventListener('popstate',schedule);
document.addEventListener('visibilitychange',function(){if(!document.hidden)schedule()});
window.MDM_SCHOOL_TELEMETRY_PLACEMENT_458381941=Object.freeze({version:VERSION,place});
})();