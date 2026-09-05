/* Malta Driving Master 45.8.38.25.2.21 — School Assignments card route stabilization
   Narrow fix: only the School Home Assignments card is corrected.
   No global observer, no auth override, no workflow/data mutation. */
(function(){
'use strict';
if(window.MDM_SCHOOL_ASSIGNMENT_CARD_ROUTE_458382521)return;

const VERSION='45.8.38.25.2.21';
const TARGET='instructorassignments';

function norm(v){
  return String(v||'').toLowerCase().replace(/\s+/g,' ').trim();
}
function isAssignmentsCard(el){
  if(!el)return false;
  const txt=norm(el.textContent);
  return txt.includes('assegnazioni') ||
         txt.includes('assignments') ||
         txt.includes('assenjazzjonijiet');
}
function patch(){
  const home=document.querySelector('.sch35');
  if(!home)return false;
  const cards=[...home.querySelectorAll('.sch35-card,[data-go]')];
  const card=cards.find(isAssignmentsCard);
  if(!card)return false;
  card.setAttribute('data-go',TARGET);
  card.dataset.mdmAssignmentRouteFix=VERSION;
  return true;
}
function onClick(ev){
  const home=ev.target?.closest?.('.sch35');
  if(!home)return;
  const card=ev.target?.closest?.('.sch35-card,[data-go]');
  if(!isAssignmentsCard(card))return;
  card.setAttribute('data-go',TARGET);
  card.dataset.mdmAssignmentRouteFix=VERSION;
}

document.addEventListener('click',onClick,true);
window.addEventListener('pageshow',patch);
window.addEventListener('popstate',patch);
window.addEventListener('hashchange',patch);
document.addEventListener('visibilitychange',()=>{if(!document.hidden)patch();});

window.MDM_SCHOOL_ASSIGNMENT_CARD_ROUTE_458382521=Object.freeze({
  version:VERSION,
  target:TARGET,
  patch
});
patch();
})();