/* Malta Driving Master 45.8.31.50.37 — Technical Owner Bootstrap
   Purpose: give the authenticated technical Owner its own complete local identity
   and professional Home role before the historical app runtime starts.
   No navigation, no reload, no timers, no server-role grants. */
(function(){
  'use strict';
  if(window.MDM_TECH_OWNER_BOOTSTRAP)return;

  const VERSION='45.8.31.50.35';
  const AUTH_KEY='mdm_auth_session_v4410';
  const OWNER_EMAIL='maltadrivingmaster@gmail.com';
  const PROFILE_KEY='mdm-v1-user-profile';
  const ENROLLMENT_KEY='mdm-v1-account-enrollment';
  const ONBOARDING_KEY='mdm-v1-onboarding';

  function readJson(key){
    try{const raw=localStorage.getItem(key);return raw?JSON.parse(raw):null;}catch(_){return null;}
  }
  function writeJson(key,value){
    try{localStorage.setItem(key,JSON.stringify(value));return true;}catch(_){return false;}
  }
  function session(){
    const s=readJson(AUTH_KEY);
    if(!s||s.status!=='authenticated'||!s.user?.id)return null;
    if(Number(s.expiresAt||0)>0&&Number(s.expiresAt)<=Date.now())return null;
    const email=String(s.user?.email||s.email||'').trim().toLowerCase();
    return email===OWNER_EMAIL?s:null;
  }
  function clean(v,max=80){
    return String(v||'').trim().replace(/\s+/g,' ').slice(0,max);
  }
  function ownerNameParts(s){
    const meta=s?.user?.user_metadata||s?.user?.metadata||{};
    const first=clean(meta.first_name||meta.firstName||'');
    const last=clean(meta.last_name||meta.lastName||'');
    if(first&&last)return {first,last};
    const full=clean(meta.full_name||meta.name||'');
    if(full){
      const bits=full.split(' ').filter(Boolean);
      if(bits.length>1)return {first:bits[0],last:bits.slice(1).join(' ')};
      return {first:full,last:'Owner'};
    }
    return {first:'MDM',last:'Owner'};
  }

  function ensure(){
    const s=session();
    if(!s)return {active:false,reason:'not_owner'};

    const now=new Date().toISOString();
    const parts=ownerNameParts(s);

    const currentProfile=readJson(PROFILE_KEY)||{};
    if(String(currentProfile.email||'').trim().toLowerCase()!==OWNER_EMAIL ||
       !clean(currentProfile.firstName)||!clean(currentProfile.lastName)){
      writeJson(PROFILE_KEY,{
        ...currentProfile,
        firstName:parts.first,
        lastName:parts.last,
        email:OWNER_EMAIL,
        accountType:'technical_owner',
        ownerUserId:String(s.user.id),
        updatedAt:now
      });
    }

    const currentEnrollment=readJson(ENROLLMENT_KEY)||{};
    if(String(currentEnrollment.email||'').trim().toLowerCase()!==OWNER_EMAIL ||
       String(currentEnrollment.role||'')!=='school'){
      writeJson(ENROLLMENT_KEY,{
        ...currentEnrollment,
        role:'school',
        name:clean(currentEnrollment.name)||'Malta Driving Master',
        email:OWNER_EMAIL,
        schoolName:clean(currentEnrollment.schoolName)||'Malta Driving Master',
        ownerUserId:String(s.user.id),
        technicalOwner:true,
        updatedAt:now
      });
    }

    const currentOnboarding=readJson(ONBOARDING_KEY)||{};
    if(String(currentOnboarding.role||'')!=='school' || currentOnboarding.technicalOwner!==true){
      writeJson(ONBOARDING_KEY,{
        ...currentOnboarding,
        role:'school',
        completed:true,
        technicalOwner:true,
        ownerUserId:String(s.user.id),
        updatedAt:now
      });
    }

    return {active:true,userId:String(s.user.id),email:OWNER_EMAIL,role:'school'};
  }

  function signal(state){
    if(!state||state.active!==true)return;
    try{window.dispatchEvent(new CustomEvent('mdm:owner-ready',{detail:state}));}catch(_){}
  }

  const previousSetItem=Storage.prototype.setItem;
  Storage.prototype.setItem=function(key,value){
    const out=previousSetItem.apply(this,arguments);
    try{
      if(this===window.localStorage&&String(key)===AUTH_KEY){
        const next=ensure();
        signal(next);
      }
    }catch(_){}
    return out;
  };

  const state=ensure();
  window.MDM_TECH_OWNER_BOOTSTRAP=Object.freeze({version:VERSION,state,ensure});
})();