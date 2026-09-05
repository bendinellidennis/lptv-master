/* Malta Driving Master 45.8.38.25.2.29.2 — Core School protected-route alignment
   Fixes the actual mismatch inside the main renderer:
   School routes accept the current server-verified Platform Owner OR ACTIVE School Admin.
   This aligns the legacy core gate with the server-authoritative route guard.
   No route remapping. No observer. No local-role bypass. */
(function(){
'use strict';
if(window.MDM_CORE_SCHOOL_ROUTE_ALIGNMENT_458382529)return;

const VERSION='45.8.38.25.2.29.2';

let originalDecision=null;
try{
  if(typeof mdmProtectedRouteDecision==='function')originalDecision=mdmProtectedRouteDecision;
}catch(_){}
if(!originalDecision&&typeof window.mdmProtectedRouteDecision==='function')originalDecision=window.mdmProtectedRouteDecision;

function ownerAllowed(){
  try{if(typeof mdmPlatformOwnerAllowed==='function'&&mdmPlatformOwnerAllowed())return true;}catch(_){}
  try{if(window.MDM_OWNER_AUTHORITY?.isOwner?.()===true)return true;}catch(_){}
  return false;
}
function schoolAllowed(){
  if(ownerAllowed())return true;
  try{if(typeof mdmSchoolAdminServerAllowed==='function'&&mdmSchoolAdminServerAllowed())return true;}catch(_){}
  try{if(window.MDM_PRIVILEGED_ROUTE_GUARD?.isSchoolAllowed?.()===true)return true;}catch(_){}
  return false;
}
function patchedDecision(name){
  const n=String(name||'');
  try{
    if(typeof MDM_SCHOOL_ADMIN_ROUTES!=='undefined'&&MDM_SCHOOL_ADMIN_ROUTES.has(n)){
      return schoolAllowed()
        ? {ok:true}
        : {ok:false,target:'accountenrollment',reason:'school_admin'};
    }
  }catch(_){}
  return originalDecision?originalDecision(name):{ok:true};
}

try{mdmProtectedRouteDecision=patchedDecision;}catch(_){}
try{window.mdmProtectedRouteDecision=patchedDecision;}catch(_){}

window.MDM_CORE_SCHOOL_ROUTE_ALIGNMENT_458382529=Object.freeze({
  version:VERSION,
  ownerAllowed,
  schoolAllowed,
  decision:patchedDecision
});
})();