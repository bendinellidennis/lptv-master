/* Malta Driving Master 45.8.38.25.2 — Server-Authoritative Technical Owner Bootstrap
   Local Owner presentation is created only after MDM_OWNER_AUTHORITY verifies auth.uid()
   against public.mdm_platform_owners. Email/localStorage alone never grants Owner UI. */
(function(){
  'use strict';
  if(window.MDM_TECH_OWNER_BOOTSTRAP)return;

  const VERSION='45.8.38.25.2';
  const AUTH_KEY='mdm_auth_session_v4410';
  const PROFILE_KEY='mdm-v1-user-profile';
  const ENROLLMENT_KEY='mdm-v1-account-enrollment';
  const ONBOARDING_KEY='mdm-v1-onboarding';

  function readJson(key){try{const raw=localStorage.getItem(key);return raw?JSON.parse(raw):null}catch(_){return null}}
  function writeJson(key,value){try{localStorage.setItem(key,JSON.stringify(value));return true}catch(_){return false}}
  function session(){
    const s=readJson(AUTH_KEY);
    if(!s||s.status!=='authenticated'||!s.user?.id||!s.accessToken)return null;
    if(Number(s.expiresAt||0)>0&&Number(s.expiresAt)<=Date.now())return null;
    return s;
  }
  function isVerifiedOwner(){return window.MDM_OWNER_AUTHORITY?.isOwner?.()===true}
  function ensure(){
    const s=session();
    if(!s||!isVerifiedOwner())return {active:false,reason:'owner_not_server_verified'};

    const now=new Date().toISOString();
    const email=String(s.user?.email||s.email||'').trim().toLowerCase();

    const currentProfile=readJson(PROFILE_KEY)||{};
    writeJson(PROFILE_KEY,{
      ...currentProfile,
      firstName:'MDM',
      lastName:'Owner',
      email,
      accountType:'technical_owner',
      ownerUserId:String(s.user.id),
      ownerVerifiedBy:'server_rpc',
      updatedAt:now
    });

    const currentEnrollment=readJson(ENROLLMENT_KEY)||{};
    writeJson(ENROLLMENT_KEY,{
      ...currentEnrollment,
      role:'school',
      name:'MDM Owner',
      email,
      schoolName:'Malta Driving Master',
      ownerUserId:String(s.user.id),
      technicalOwner:true,
      ownerVerifiedBy:'server_rpc',
      updatedAt:now
    });

    const currentOnboarding=readJson(ONBOARDING_KEY)||{};
    writeJson(ONBOARDING_KEY,{
      ...currentOnboarding,
      role:'school',
      completed:true,
      technicalOwner:true,
      ownerUserId:String(s.user.id),
      ownerVerifiedBy:'server_rpc',
      updatedAt:now
    });

    return {active:true,userId:String(s.user.id),email,role:'school',verifiedBy:'server_rpc'};
  }
  function signal(state){
    if(!state||state.active!==true)return;
    try{window.dispatchEvent(new CustomEvent('mdm:owner-ready',{detail:state}))}catch(_){}
  }
  function refresh(){
    const state=ensure();
    signal(state);
    return state;
  }

  const previousSetItem=Storage.prototype.setItem;
  if(!Storage.prototype.__mdmOwnerBootstrapAuthHook45838252){
    Object.defineProperty(Storage.prototype,'__mdmOwnerBootstrapAuthHook45838252',{value:true,configurable:false,enumerable:false,writable:false});
    Storage.prototype.setItem=function(key,value){
      const out=previousSetItem.apply(this,arguments);
      try{
        if(this===window.localStorage&&String(key)===AUTH_KEY){
          Promise.resolve(window.MDM_OWNER_AUTHORITY?.verify?.(true)).then(refresh);
        }
      }catch(_){}
      return out;
    };
  }

  window.addEventListener('mdm:owner-authority',function(ev){
    if(ev?.detail?.authorized===true&&ev?.detail?.status==='verified')refresh();
  });

  const state=refresh();
  window.MDM_TECH_OWNER_BOOTSTRAP=Object.freeze({version:VERSION,state,ensure:refresh,isOwner:isVerifiedOwner});
})();