/* Malta Driving Master 45.8.31.50.2 — Account Data Isolation Adapter
   User-owned local data is namespaced by authenticated auth.user.id.
   Safe legacy migration: legacy global data is copied only when the legacy
   profile email matches the currently authenticated account email.
   Legacy globals are never deleted by this adapter.
   Auth/session, global settings, school config and device token remain untouched.
*/
(function(){
  'use strict';
  if(window.MDM_ACCOUNT_DATA_ISOLATION)return;

  const VERSION='45.8.31.50.3';
  const AUTH_KEY='mdm_auth_session_v4410';
  const LAST_AUTH_KEY='mdm_account_isolation_last_auth_user_v4583152';

  /* Explicit allow-list: only data proven/user-owned in the isolation diagnostic. */
  const USER_KEYS=new Set([
    'mdm-v1-progress',
    'mdm-v1-error-replay',
    'mdm-v1-zero-error',
    'mdm-v1-exam-day',
    'mdm-v1-coach-recovery',
    'mdm-v1-user-profile',
    'mdm-v1-mission-system',
    'mdm-v1-ai-instructor',
    'mdm-v1-coach',
    'mdm-v1-onboarding',
    'mdm-v1-pilot-analytics',
    'mdm-v1-personal-roadmap',
    'mdm-v1-lptv-passport',
    'mdm-v1-real-road-twin',
    'mdm-v1-real-road-telemetry',
    'mdm-v1-real-road-selected-pattern',
    'mdm-v1-real-road-telemetry-mission-launch'
  ]);

  /* At this point the diagnostic may already have wrapped Storage.
     Keep those wrappers as our lower layer so diagnostics remain visible. */
  const lowerGet=Storage.prototype.getItem;
  const lowerSet=Storage.prototype.setItem;
  const lowerRemove=Storage.prototype.removeItem;

  function isLocal(store){
    try{return store===window.localStorage;}catch(_){return false;}
  }

  function parseAuth(raw){
    try{
      const s=raw?JSON.parse(String(raw)):null;
      const status=String(s&&s.status||'');
      const userId=String(s&&s.user&&s.user.id||'');
      const email=String(s&&s.user&&s.user.email||'').trim().toLowerCase();
      const expiresAt=Number(s&&s.expiresAt||0);
      if(status!=='authenticated'||!userId)return {userId:'',email:'',authenticated:false};
      if(expiresAt>0&&expiresAt<=Date.now())return {userId:'',email:'',authenticated:false};
      return {userId,email,authenticated:true};
    }catch(_){
      return {userId:'',email:'',authenticated:false};
    }
  }

  function auth(){
    try{return parseAuth(lowerGet.call(localStorage,AUTH_KEY));}
    catch(_){return {userId:'',email:'',authenticated:false};}
  }

  function lastAuthId(){
    try{return String(lowerGet.call(localStorage,LAST_AUTH_KEY)||'');}
    catch(_){return '';}
  }

  function scopedKey(key,userId){
    return String(key)+'::user:'+String(userId);
  }

  function findEmail(value,depth){
    if(depth>5||value==null)return '';
    if(typeof value==='string'){
      const s=value.trim().toLowerCase();
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s)?s:'';
    }
    if(Array.isArray(value)){
      for(const item of value){
        const e=findEmail(item,depth+1);if(e)return e;
      }
      return '';
    }
    if(typeof value==='object'){
      const preferred=['email','userEmail','user_email','accountEmail','account_email'];
      for(const k of preferred){
        if(Object.prototype.hasOwnProperty.call(value,k)){
          const e=findEmail(value[k],depth+1);if(e)return e;
        }
      }
      for(const k of Object.keys(value)){
        if(/email/i.test(k)){
          const e=findEmail(value[k],depth+1);if(e)return e;
        }
      }
      for(const k of Object.keys(value)){
        const e=findEmail(value[k],depth+1);if(e)return e;
      }
    }
    return '';
  }

  function legacyOwnerEmail(){
    try{
      const raw=lowerGet.call(localStorage,'mdm-v1-user-profile');
      if(!raw)return '';
      return findEmail(JSON.parse(raw),0);
    }catch(_){return '';}
  }

  function mayAdoptLegacy(current){
    if(!current.authenticated||!current.email)return false;
    const legacyEmail=legacyOwnerEmail();
    return !!legacyEmail && legacyEmail===current.email;
  }

  function readUserKey(key){
    const current=auth();

    if(current.authenticated){
      const sk=scopedKey(key,current.userId);
      const scoped=lowerGet.call(localStorage,sk);
      if(scoped!==null)return scoped;

      /* Never attach another account's legacy data to this user. */
      if(mayAdoptLegacy(current)){
        const legacy=lowerGet.call(localStorage,key);
        if(legacy!==null){
          lowerSet.call(localStorage,sk,legacy);
          return legacy;
        }
      }
      return null;
    }

    /* Signed-out/guest state must never expose account-owned data.
       Legacy globals remain stored only as a migration source and are adopted
       after authenticated email ownership is verified. */
    return null;
  }

  function writeUserKey(key,value){
    const current=auth();
    if(current.authenticated){
      return lowerSet.call(localStorage,scopedKey(key,current.userId),value);
    }
    if(lastAuthId()){
      return lowerSet.call(localStorage,scopedKey(key,'guest'),value);
    }
    return lowerSet.call(localStorage,key,value);
  }

  function removeUserKey(key){
    const current=auth();
    if(current.authenticated){
      return lowerRemove.call(localStorage,scopedKey(key,current.userId));
    }
    if(lastAuthId()){
      return lowerRemove.call(localStorage,scopedKey(key,'guest'));
    }
    return lowerRemove.call(localStorage,key);
  }

  let reloadTimer=0;
  function scheduleAccountReload(){
    if(reloadTimer)return;
    reloadTimer=setTimeout(function(){
      try{location.reload();}catch(_){}
    },80);
  }

  function noteAuthenticatedUser(raw){
    const next=parseAuth(raw);
    if(!next.authenticated)return;
    const previous=lastAuthId();
    try{lowerSet.call(localStorage,LAST_AUTH_KEY,next.userId);}catch(_){}
    if(previous&&previous!==next.userId)scheduleAccountReload();
  }

  Storage.prototype.getItem=function(key){
    if(isLocal(this)&&USER_KEYS.has(String(key))){
      return readUserKey(String(key));
    }
    return lowerGet.apply(this,arguments);
  };

  Storage.prototype.setItem=function(key,value){
    const k=String(key);
    if(isLocal(this)&&USER_KEYS.has(k)){
      return writeUserKey(k,String(value));
    }
    const out=lowerSet.apply(this,arguments);
    if(isLocal(this)&&k===AUTH_KEY)noteAuthenticatedUser(value);
    return out;
  };

  Storage.prototype.removeItem=function(key){
    const k=String(key);
    if(isLocal(this)&&USER_KEYS.has(k)){
      return removeUserKey(k);
    }
    const out=lowerRemove.apply(this,arguments);
    if(isLocal(this)&&k===AUTH_KEY&&lastAuthId())scheduleAccountReload();
    return out;
  };

  /* Seed last-auth marker for the currently authenticated session.
     This does not migrate any user data by itself. */
  try{
    const current=auth();
    if(current.authenticated&&!lastAuthId())lowerSet.call(localStorage,LAST_AUTH_KEY,current.userId);
  }catch(_){}

  window.MDM_ACCOUNT_DATA_ISOLATION=Object.freeze({
    version:VERSION,
    userKeys:Array.from(USER_KEYS),
    current:()=>auth(),
    legacyOwnerEmail:()=>legacyOwnerEmail(),
    namespaceFor:(key)=>{const a=auth();return a.authenticated&&USER_KEYS.has(String(key))?scopedKey(String(key),a.userId):String(key);}
  });
})();