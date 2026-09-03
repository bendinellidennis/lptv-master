/* Malta Driving Master 45.8.38.19.4 — Telemetry placement inside Advanced Tools */
(function(){
'use strict';
if(window.MDM_SCHOOL_TELEMETRY_PLACEMENT_45838194)return;
const VERSION='45.8.38.19.4';

function norm(v){return String(v||'').replace(/\s+/g,' ').trim().toUpperCase();}
function advancedTitle(){
 const nodes=Array.from(document.querySelectorAll('h1,h2,h3,h4,h5,strong,b,div,section'));
 return nodes.find(el=>{
  const tx=norm(el.textContent||'');
  return tx==='STRUMENTI AVANZATI'||tx==='ADVANCED TOOLS'||tx==='GĦODOD AVVANZATI';
 })||null;
}
function advancedGrid(title){
 if(!title)return null;
 const root=title.closest('.sch35')||title.parentElement||document;
 const titleTop=title.getBoundingClientRect?.().top||0;
 const grids=Array.from(root.querySelectorAll('.sch35-grid,[class*="grid"],section,div')).filter(el=>{
  if(el===title||el.contains(title))return false;
  const r=el.getBoundingClientRect?.();
  if(!r||r.top<titleTop)return false;
  const tx=norm(el.textContent||'');
  return tx.includes('INTELLIGENZA ISTRUTTORE')||tx.includes('INSTRUCTOR INTELLIGENCE')||tx.includes('STUDIO ISTRUTTORE')||tx.includes('INSTRUCTOR STUDIO')||tx.includes('CENTRO DI COMANDO')||tx.includes('COMMAND CENTER')||tx.includes('TRUST CENTER');
 });
 return grids.sort((a,b)=>(a.getBoundingClientRect?.().top||0)-(b.getBoundingClientRect?.().top||0))[0]||null;
}
function place(){
 const panel=document.getElementById('mdmSchoolTelemetryPanel');
 const title=advancedTitle();
 if(!panel||!title)return false;
 const grid=advancedGrid(title);
 if(grid){
  if(panel.previousElementSibling===title||panel.nextElementSibling===grid)return true;
  grid.parentNode.insertBefore(panel,grid);
 }else{
  title.insertAdjacentElement('afterend',panel);
 }
 panel.dataset.mdmPlacement='advanced-tools';
 return true;
}
function schedule(){
 [0,120,300,700,1200,2000,3500,5000,8000,12000,20000,30000].forEach(ms=>setTimeout(place,ms));
}
schedule();
window.addEventListener('pageshow',schedule);
window.addEventListener('popstate',schedule);
document.addEventListener('visibilitychange',()=>{if(!document.hidden)schedule()});
window.MDM_SCHOOL_TELEMETRY_PLACEMENT_45838194=Object.freeze({version:VERSION,place});
})();