/* Malta Driving Master 45.8.38.25.2.14 — School Assignments route fix
   Keeps the School Home "Assignments" card on the real instructor assignments route.
   Minimal route correction only; no workflow or data changes. */
(function(){
'use strict';
if(window.MDM_SCHOOL_ASSIGNMENTS_ROUTE_FIX_458382514)return;

const VERSION='45.8.38.25.2.14';
const TARGET='instructorassignments';

function titleOf(card){
  return String(card?.querySelector('h3')?.textContent||'').trim().toLowerCase();
}
function isAssignments(card){
  const t=titleOf(card);
  return t==='assegnazioni'||t==='assignments'||t==='assenjazzjonijiet';
}
function patch(){
  const root=document.querySelector('.sch35');
  if(!root)return false;
  const card=[...root.querySelectorAll('.sch35-card')].find(isAssignments);
  if(!card)return false;
  card.dataset.go=TARGET;
  card.dataset.mdmAssignmentsRouteFix=VERSION;
  return true;
}
function onClick(e){
  const card=e.target?.closest?.('.sch35-card');
  if(!card||!isAssignments(card))return;
  card.dataset.go=TARGET;
}
function schedule(){
  [0,60,160,350,700,1200,2200].forEach(ms=>setTimeout(patch,ms));
}

document.addEventListener('click',onClick,true);
window.addEventListener('pageshow',schedule);
window.addEventListener('popstate',schedule);
window.addEventListener('hashchange',schedule);
document.addEventListener('visibilitychange',()=>{if(!document.hidden)schedule()});

window.MDM_SCHOOL_ASSIGNMENTS_ROUTE_FIX_458382514=Object.freeze({version:VERSION,target:TARGET,patch,schedule});
schedule();
})();