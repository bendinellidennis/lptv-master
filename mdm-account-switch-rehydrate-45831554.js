/* Malta Driving Master 45.8.31.50.54 — Account Switch Rehydrate
   Fixes stale in-memory profile/enrollment after switching authenticated users
   without a page reload. The persisted scoped account data remains the source of truth.
   No server writes. No progress mutation. No timers/polling. */
(function(){
  'use strict';
  if(window.MDM_ACCOUNT_SWITCH_REHYDRATE)return;

  const VERSION='45.8.31.50.54';
  const AUTH_KEY='mdm_auth_session_v4410';
  const OWNER_EMAIL='maltadrivingmaster@gmail.com';
  const PROFILE_KEY='mdm-v1-user-profile';
  const ENROLLMENT_KEY='mdm-v1-account-enrollment';
  const ONBOARDING_KEY='mdm-v1-onboarding';
  let scheduled=false;

  function readJson(key){
    try{
      const raw=localStorage.getItem(key);
      return raw?JSON.parse(raw):null;
    }catch(_){return null;}
  }

  function session(){
    const s=readJson(AUTH_KEY);
    if(!s||s.status!=='authenticated'||!s.user?.id)return null;
    if(Number(s.expiresAt||0)>0&&Number(s.expiresAt)<=Date.now())return null;
    return s;
  }

  function emailOfSession(s){
    return String(s?.user?.email||s?.email||'').trim().toLowerCase();
  }

  function replaceObject(target,fresh){
    if(!target||typeof target!=='object'||!fresh||typeof fresh!=='object')return false;
    try{
      for(const k of Object.keys(target))delete target[k];
      Object.assign(target,fresh);
      return true;
    }catch(_){return false;}
  }

  function rehydrateRuntimeObject(name,fresh){
    if(!fresh||typeof fresh!=='object')return false;
    try{
      if(name==='userProfile' && typeof userProfile!=='undefined')return replaceObject(userProfile,fresh);
    }catch(_){}
    try{
      if(name==='accountEnrollment' && typeof accountEnrollment!=='undefined')return replaceObject(accountEnrollment,fresh);
    }catch(_){}
    try{
      if(name==='onboardingState' && typeof onboardingState!=='undefined')return replaceObject(onboardingState,fresh);
    }catch(_){}
    try{
      if(name==='onboardingData' && typeof onboardingData!=='undefined')return replaceObject(onboardingData,fresh);
    }catch(_){}
    return false;
  }

  function restoreStudentNavIfNeeded(isOwner){
    try{
      const armed=document.querySelector('[data-nav="schoolhome"][data-mdm-owner-home="1"]');
      if(!isOwner && armed){
        armed.setAttribute('data-nav','home');
        armed.removeAttribute('data-mdm-owner-home');
        document.body?.classList?.remove('mdm-tech-owner');
      }
      if(isOwner){
        window.MDM_TECH_OWNER_HOME_GUARD?.arm?.();
      }
    }catch(_){}
  }

  function freshAccountState(s){
    const email=emailOfSession(s);

    try{
      if(email==='bendinellidennis@gmail.com'){
        window.MDM_DENNIS_HISTORY_RESTORE?.restore?.();
      }
    }catch(_){}

    const profile=readJson(PROFILE_KEY)||{};
    const enrollment=readJson(ENROLLMENT_KEY)||{};
    const onboarding=readJson(ONBOARDING_KEY)||{};

    return {email,profile,enrollment,onboarding};
  }

  function enforceIdentityCard(state){
    try{
      const cards=Array.from(document.querySelectorAll('.account-identity-card'));
      const identity=cards.find(function(card){
        const txt=String(card.innerText||'').toLowerCase();
        return txt.includes('identità locale')||txt.includes('local identity')||txt.includes('identità lokali');
      });
      if(!identity)return false;

      const h2=identity.querySelector('.account-section-head h2');
      const p=identity.querySelector('.account-section-head p');
      const email=state.email;
      const first=String(state.profile?.firstName||'').trim();
      const last=String(state.profile?.lastName||'').trim();

      const expectedName=email===OWNER_EMAIL
        ? 'MDM Owner'
        : ((first+' '+last).trim()||'Profilo da completare');

      if(h2)h2.textContent=expectedName;
      if(p)p.textContent=email||'';

      return true;
    }catch(_){return false;}
  }

  function sync(){
    scheduled=false;
    const s=session();
    if(!s)return {ok:false,reason:'signed_out'};

    const state=freshAccountState(s);
    const isOwner=state.email===OWNER_EMAIL;

    const updated={
      profile:rehydrateRuntimeObject('userProfile',state.profile),
      enrollment:rehydrateRuntimeObject('accountEnrollment',state.enrollment),
      onboarding:rehydrateRuntimeObject('onboardingState',state.onboarding) ||
                 rehydrateRuntimeObject('onboardingData',state.onboarding)
    };

    restoreStudentNavIfNeeded(isOwner);

    try{
      if(typeof render==='function')render();
    }catch(_){}

    enforceIdentityCard(state);

    try{window.MDM_PILOT_UX_CLEANUP?.sync?.();}catch(_){}
    try{window.MDM_SIGNED_OUT_NEUTRAL_GATE?.sync?.();}catch(_){}

    return {ok:true,email:state.email,isOwner,updated};
  }

  function schedule(){
    if(scheduled)return;
    scheduled=true;
    try{
      queueMicrotask(sync);
    }catch(_){
      Promise.resolve().then(sync);
    }
  }

  const previousSetItem=Storage.prototype.setItem;
  Storage.prototype.setItem=function(key,value){
    const out=previousSetItem.apply(this,arguments);
    try{
      if(this===window.localStorage&&String(key)===AUTH_KEY)schedule();
    }catch(_){}
    return out;
  };

  window.addEventListener('pageshow',schedule);
  window.addEventListener('mdm:owner-ready',schedule);

  const initial=sync();

  window.MDM_ACCOUNT_SWITCH_REHYDRATE=Object.freeze({
    version:VERSION,
    sync,
    state:initial
  });
})();