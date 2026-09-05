/* Malta Driving Master 45.8.38.25.2.28 — School Assignments target only
   Narrow responsibility: keep the School Home Assignments card pointed at
   instructorassignments. Navigation and authorization remain owned by the
   app router + server-authoritative privileged route guard.
   No manual history navigation. No auth logic. No observer. */
(function(){
'use strict';
if(window.MDM_SCHOOL_ASSIGNMENTS_TARGET_458382528)return;

const VERSION='45.8.38.25.2.28';
const TARGET='instructorassignments';

function norm(v){return String(v||'').toLowerCase().replace(/\s+/g,' ').trim();}
function patch(){
  const home=document.querySelector('.sch35');
  if(!home)return false;
  const cards=[...home.querySelectorAll('.sch35-card,[data-go]')];
  const card=cards.find(el=>{
    const tx=norm(el.textContent);
    return tx.includes('assegnazioni')||tx.includes('assignments')||tx.includes('assenjazzjonijiet');
  });
  if(!card)return false;
  card.setAttribute('data-go',TARGET);
  card.dataset.mdmAssignmentsTarget=VERSION;
  return true;
}

[0,40,100,180,300,500,800,1200,1800].forEach(ms=>setTimeout(patch,ms));
window.addEventListener('pageshow',patch);
window.addEventListener('popstate',patch);
document.addEventListener('visibilitychange',()=>{if(!document.hidden)patch();});

window.MDM_SCHOOL_ASSIGNMENTS_TARGET_458382528=Object.freeze({
  version:VERSION,target:TARGET,patch
});
})();