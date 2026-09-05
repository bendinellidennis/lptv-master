/* Malta Driving Master 45.8.38.25.2.22 — School Admin gate bridge
   Root fix: the app's legacy School route gate must accept the already server-verified,
   session-bound School Admin authority from MDM_PRIVILEGED_ROUTE_GUARD.
   This removes the incorrect dependency on loading the pending-enrolments list.
   No card rewrite, no auth bypass, no global MutationObserver. */
(function(){
'use strict';
if(window.MDM_SCHOOL_ADMIN_GATE_BRIDGE_458382522)return;

const VERSION='45.8.38.25.2.22';
let installed=false;
let originalGate=null;

function install(){
  if(installed)return true;
  try{
    if(typeof mdmSchoolAdminServerAllowed!=='function')return false;
    originalGate=mdmSchoolAdminServerAllowed;
    mdmSchoolAdminServerAllowed=function(){
      try{if(originalGate&&originalGate())return true;}catch(_){}
      try{if(window.MDM_OWNER_AUTHORITY?.isOwner?.()===true)return true;}catch(_){}
      try{return window.MDM_PRIVILEGED_ROUTE_GUARD?.isSchoolAllowed?.()===true;}catch(_){return false;}
    };
    installed=true;
    return true;
  }catch(_){return false;}
}

install();
window.addEventListener('pageshow',install);
document.addEventListener('visibilitychange',()=>{if(!document.hidden)install();});

window.MDM_SCHOOL_ADMIN_GATE_BRIDGE_458382522=Object.freeze({
  version:VERSION,
  install,
  isInstalled:()=>installed
});
})();