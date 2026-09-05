/* Malta Driving Master 45.8.38.25.2.25 — School Assignments fresh server verification
   Root fix for intermittent Account/Enrollment redirect:
   capture ONLY the School Home Assignments action before the legacy School gate,
   verify current Owner/School authority server-side, then navigate to instructorassignments.
   No auth bypass. No global MutationObserver. No other School card remapping. */
(function(){
'use strict';
if(window.MDM_SCHOOL_ASSIGNMENTS_DIRECT_458382523)return;

const VERSION='45.8.38.25.2.25';
const TARGET='instructorassignments';
let busy=false;

function norm(v){return String(v||'').toLowerCase().replace(/\s+/g,' ').trim();}
function assignmentsCard(target){
  const card=target?.closest?.('.sch35-card,[data-go]');
  if(!card||!card.closest('.sch35'))return null;
  const tx=norm(card.textContent);
  if(tx.includes('assegnazioni')||tx.includes('assignments')||tx.includes('assenjazzjonijiet'))return card;
  return null;
}
function navigate(name){
  const st={name:String(name),data:null};
  history.pushState(st,'','#'+st.name);
  window.dispatchEvent(new PopStateEvent('popstate',{state:st}));
}
function wait(ms){return new Promise(r=>setTimeout(r,ms));}
async function authorized(){
  try{
    await window.MDM_OWNER_AUTHORITY?.verify?.(true);
    if(window.MDM_OWNER_AUTHORITY?.isOwner?.()===true)return true;
  }catch(_){}

  for(let attempt=0;attempt<2;attempt++){
    try{
      const s=await window.MDM_PRIVILEGED_ROUTE_GUARD?.verifySchool?.(true);
      if(s&&s.status==='verified'&&s.authorized===true)return true;
    }catch(_){}
    if(attempt===0)await wait(120);
  }
  return false;
}
async function open(card){
  if(busy)return;
  busy=true;
  try{
    card?.setAttribute?.('aria-busy','true');
    if(await authorized()){
      navigate(TARGET);
      return;
    }
    try{
      window.dispatchEvent(new CustomEvent('mdm:authorization-denied',{
        detail:{route:TARGET,kind:'school',message:'fresh_school_verification_failed'}
      }));
    }catch(_){}
    /* Stay on School Home. Never misroute an ACTIVE School Admin to enrollment. */
  }finally{
    card?.removeAttribute?.('aria-busy');
    busy=false;
  }
}
function capture(ev){
  const card=assignmentsCard(ev.target);
  if(!card)return;
  ev.preventDefault();
  ev.stopImmediatePropagation();
  card.setAttribute('data-go',TARGET);
  card.dataset.mdmAssignmentsDirect=VERSION;
  void open(card);
}
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
  card.dataset.mdmAssignmentsDirect=VERSION;
  return true;
}

document.addEventListener('click',capture,true);
window.addEventListener('pageshow',patch);
window.addEventListener('popstate',patch);
window.addEventListener('hashchange',patch);
[0,80,200,500,900,1600,2800].forEach(ms=>setTimeout(patch,ms));

window.MDM_SCHOOL_ASSIGNMENTS_DIRECT_458382523=Object.freeze({
  version:VERSION,target:TARGET,patch,authorized
});
})();