/* Malta Driving Master 45.8.38.25.2.27 — Legacy School gate bridge
   Installs AFTER the legacy app renderer and AFTER the server-authoritative route guard.
   Makes the legacy mdmSchoolAdminServerAllowed() accept only the already verified
   current-session Owner / ACTIVE School Admin authority.
   No route remapping. No auth bypass. No observers. */
(function(){
'use strict';
if(window.MDM_SCHOOL_LEGACY_GATE_BRIDGE_458382527)return;

const VERSION='45.8.38.25.2.27';
let installed=false;
let original=null;

function serverAllowed(){
  try{if(window.MDM_OWNER_AUTHORITY?.isOwner?.()===true)return true;}catch(_){}
  try{if(window.MDM_PRIVILEGED_ROUTE_GUARD?.isSchoolAllowed?.()===true)return true;}catch(_){}
  return false;
}

function install(){
  if(installed)return true;
  try{
    let current=null;
    try{
      if(typeof mdmSchoolAdminServerAllowed==='function')current=mdmSchoolAdminServerAllowed;
    }catch(_){}
    if(!current&&typeof window.mdmSchoolAdminServerAllowed==='function')current=window.mdmSchoolAdminServerAllowed;
    if(typeof current!=='function')return false;

    original=current;
    const wrapped=function(){
      try{if(original&&original())return true;}catch(_){}
      return serverAllowed();
    };
    try{mdmSchoolAdminServerAllowed=wrapped;}catch(_){}
    try{window.mdmSchoolAdminServerAllowed=wrapped;}catch(_){}
    installed=true;
    return true;
  }catch(_){return false;}
}

install();
setTimeout(install,0);
setTimeout(install,50);
setTimeout(install,150);
window.addEventListener('pageshow',install);
document.addEventListener('visibilitychange',()=>{if(!document.hidden)install();});

window.MDM_SCHOOL_LEGACY_GATE_BRIDGE_458382527=Object.freeze({
  version:VERSION,
  install,
  isInstalled:()=>installed,
  serverAllowed
});
})();