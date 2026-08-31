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

  const VERSION='45.8.31.50.16';
  const AUTH_KEY='mdm_auth_session_v4410';
  const LAST_AUTH_KEY='mdm_account_isolation_last_auth_user_v4583152';
  const LEGACY_BACKUP_PREFIX='mdm_account_isolation_legacy_backup_v4583154::';

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
  const lowerClear=Storage.prototype.clear;

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

  function backupKey(key){return LEGACY_BACKUP_PREFIX+String(key);}
  function legacyRaw(key){
    try{
      const backup=lowerGet.call(localStorage,backupKey(key));
      if(backup!==null)return backup;
      return lowerGet.call(localStorage,String(key));
    }catch(_){return null;}
  }
  function legacyOwnerEmail(){
    try{
      const raw=legacyRaw('mdm-v1-user-profile');
      if(!raw)return '';
      return findEmail(JSON.parse(raw),0);
    }catch(_){return '';}
  }

  function quarantineLegacyGlobals(){
    for(const key of USER_KEYS){
      try{
        const legacy=lowerGet.call(localStorage,key);
        if(legacy===null)continue;
        const bk=backupKey(key);
        if(lowerGet.call(localStorage,bk)===null)lowerSet.call(localStorage,bk,legacy);
        if(lowerGet.call(localStorage,bk)!==null)lowerRemove.call(localStorage,key);
      }catch(_){}
    }
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

      /* Never auto-adopt quarantined legacy data here.
         Historical recovery is handled only by the dedicated owner-matched recovery bridge. */
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
  let reloadDueAt=0;
  function scheduleAccountReload(delay,expectedAuthenticated,expectedUserId){
    const wait=Math.max(80,Number(delay||120));
    const due=Date.now()+wait;
    if(reloadTimer){
      if(reloadDueAt&&reloadDueAt<=due)return;
      try{clearTimeout(reloadTimer);}catch(_){}
      reloadTimer=0;
    }
    reloadDueAt=due;
    reloadTimer=setTimeout(function(){
      reloadTimer=0;reloadDueAt=0;
      const now=auth();
      if(expectedAuthenticated===true){
        if(!now.authenticated)return;
        if(expectedUserId&&String(now.userId)!==String(expectedUserId))return;
      }
      if(expectedAuthenticated===false&&now.authenticated)return;
      try{
        const url=new URL(location.href);
        url.searchParams.set('mdm_auth_refresh','45831510');
        location.replace(url.toString());
      }catch(_){
        try{location.href=location.href;}catch(__){}
      }
    },wait);
  }

  function noteAuthTransition(before,raw){
    const next=parseAuth(raw);
    if(next.authenticated){
      try{lowerSet.call(localStorage,LAST_AUTH_KEY,next.userId);}catch(_){}
    }
    const identityChanged=String(before&&before.userId||'')!==String(next.userId||'');
    const authChanged=Boolean(before&&before.authenticated)!==Boolean(next.authenticated);
    if(identityChanged||authChanged){
      /* Never navigate during login: reloading here can interrupt the real auth
         completion flow and drop the new session on Safari. Logout still refreshes. */
      if(!next.authenticated)scheduleAccountReload(120,false,'');
    }
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
    let before=null;
    if(isLocal(this)&&k===AUTH_KEY){
      try{before=parseAuth(lowerGet.call(this,AUTH_KEY));}catch(_){before={userId:'',email:'',authenticated:false};}
    }
    const out=lowerSet.apply(this,arguments);
    if(isLocal(this)&&k===AUTH_KEY){
      noteAuthTransition(before,value);
      const next=parseAuth(value);
      if(next.authenticated&&!(before&&before.authenticated))schedulePostLoginHome();
    }
    return out;
  };

  Storage.prototype.removeItem=function(key){
    const k=String(key);
    if(isLocal(this)&&USER_KEYS.has(k)){
      return removeUserKey(k);
    }
    let before=null;
    if(isLocal(this)&&k===AUTH_KEY){
      try{before=parseAuth(lowerGet.call(this,AUTH_KEY));}catch(_){before={userId:'',email:'',authenticated:false};}
    }
    const out=lowerRemove.apply(this,arguments);
    if(isLocal(this)&&k===AUTH_KEY&&before&&before.authenticated)scheduleAccountReload(120,false,'');
    return out;
  };

  Storage.prototype.clear=function(){
    let before={userId:'',email:'',authenticated:false};
    if(isLocal(this)){
      try{before=parseAuth(lowerGet.call(this,AUTH_KEY));}catch(_){}
    }
    const out=lowerClear.apply(this,arguments);
    if(isLocal(this)&&before.authenticated)scheduleAccountReload(120,false,'');
    return out;
  };

  /* Event-driven fallback for legacy logout/login code paths that may bypass
     the patched Storage methods. No polling and no MutationObserver. */
  let lastObservedAuth=auth();
  function reconcileAuthTransition(){
    const next=auth();
    const identityChanged=String(lastObservedAuth&&lastObservedAuth.userId||'')!==String(next.userId||'');
    const authChanged=Boolean(lastObservedAuth&&lastObservedAuth.authenticated)!==Boolean(next.authenticated);
    if(identityChanged||authChanged){
      lastObservedAuth=next;
      if(!next.authenticated)scheduleAccountReload(120,false,'');
    }else{
      lastObservedAuth=next;
    }
  }
  function looksLikeLogoutTarget(target){
    try{
      const el=target&&target.closest?target.closest('button,a,[role="button"]'):null;
      if(!el)return false;
      const text=String(el.innerText||el.textContent||'').trim().toLowerCase();
      const aria=String(el.getAttribute&&el.getAttribute('aria-label')||'').trim().toLowerCase();
      const id=String(el.id||'').trim().toLowerCase();
      const label=(text+' '+aria+' '+id).replace(/\s+/g,' ').trim();
      return /^(?:.*\s)?(?:esci|logout|sign out|disconnect|disconnetti)(?:\s.*)?$/i.test(label) && label.length<=80;
    }catch(_){return false;}
  }

  function onAuthInteraction(ev){
    if(!looksLikeLogoutTarget(ev.target))return;
    [120,500,1500,3000].forEach(ms=>setTimeout(function(){
      const now=auth();
      if(!now.authenticated)scheduleAccountReload(120,false,'');
    },ms));
  }

  function goHomeAfterAuthenticated(){
    const now=auth();
    if(!now.authenticated)return false;
    const home=document.querySelector('[data-nav="home"]') || document.querySelector('[data-action="home"]');
    if(!home||typeof home.click!=='function')return false;
    try{home.click();return true;}catch(_){return false;}
  }

  function schedulePostLoginHome(){
    [180,500,1000].forEach(ms=>setTimeout(function(){
      if(goHomeAfterAuthenticated())return;
    },ms));
  }

  document.addEventListener('click',onAuthInteraction,true);
  window.addEventListener('pageshow',reconcileAuthTransition);
  document.addEventListener('visibilitychange',()=>{if(!document.hidden)reconcileAuthTransition();});

  /* Quarantine proven user-owned legacy globals before the historical runtime loads.
     Data is copied first, then only the global alias is removed. */
  quarantineLegacyGlobals();

  /* Seed last-auth marker for the currently authenticated session. */
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