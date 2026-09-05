/* Malta Driving Master 45.8.38.25.2.28 — Server-authoritative School Area route-safe alignment
   Prevents a Student session from entering the operational School Home through the local role toggle.
   No route remapping. No question/replay changes. */
(function(){
'use strict';
if(window.MDM_SCHOOL_SERVER_ROLE_ALIGNMENT_458382519)return;

const VERSION='45.8.38.25.2.28';
let busy=false;

function routeName(){return String(location.hash||'').replace(/^#/,'').split('?')[0].trim();}
function guard(){return window.MDM_PRIVILEGED_ROUTE_GUARD||null;}
function owner(){return window.MDM_OWNER_AUTHORITY||null;}

async function schoolAllowed(){
  try{await owner()?.verify?.(false);}catch(_){}
  if(owner()?.isOwner?.()===true)return true;
  try{
    const s=await guard()?.verifySchool?.(false);
    return Boolean(s&&s.status==='verified'&&s.authorized===true);
  }catch(_){return false;}
}
function navigate(name,replace=false){
  const st={name:String(name),data:null};
  if(replace)history.replaceState(st,'','#'+st.name);
  else history.pushState(st,'','#'+st.name);
  window.dispatchEvent(new PopStateEvent('popstate',{state:st}));
}
async function enterSchool(){
  if(busy)return;
  busy=true;
  try{
    if(await schoolAllowed())navigate('schoolhome',false);
    else navigate('accountenrollment',false);
  }finally{busy=false;}
}
async function auditCurrent(){
  /* Only audit the actual School Home route.
     The old School Home DOM can remain for a few milliseconds during SPA navigation;
     using .sch35 presence here caused false redirects after opening School tools. */
  if(routeName()!=='schoolhome')return true;
  if(busy)return false;
  busy=true;
  try{
    if(await schoolAllowed())return true;
    navigate('accountenrollment',true);
    return false;
  }finally{busy=false;}
}

document.addEventListener('click',function(ev){
  const schoolSwitch=ev.target?.closest?.('#sch35SchoolArea');
  if(schoolSwitch){
    ev.preventDefault();
    ev.stopImmediatePropagation();
    enterSchool();
    return;
  }
  const complete=ev.target?.closest?.('#completeOnboarding');
  if(complete){
    const selected=document.querySelector('[data-onboarding-role].selected,[data-onboarding-role] input:checked');
    const role=String(selected?.closest?.('[data-onboarding-role]')?.dataset?.onboardingRole||selected?.value||'').toLowerCase();
    if(role==='school'){
      ev.preventDefault();
      ev.stopImmediatePropagation();
      enterSchool();
    }
  }
},true);

[0,120,400,900,1800].forEach(ms=>setTimeout(auditCurrent,ms));
window.addEventListener('pageshow',auditCurrent);
window.addEventListener('popstate',auditCurrent);
document.addEventListener('visibilitychange',()=>{if(!document.hidden)auditCurrent();});

window.MDM_SCHOOL_SERVER_ROLE_ALIGNMENT_458382519=Object.freeze({
  version:VERSION,schoolAllowed,enterSchool,audit:auditCurrent
});
})();