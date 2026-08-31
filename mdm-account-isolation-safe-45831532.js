/* Malta Driving Master — Account Isolation Safe Adapter
   Branch-only candidate. Pure storage isolation:
   - no navigation
   - no reload
   - no timers
   - no DOM routing
   - no auth mutation
   User-owned keys are scoped by authenticated auth.user.id.
   Legacy migration runs only when legacy profile email matches auth email. */
(function(){
  'use strict';
  if(window.MDM_ACCOUNT_ISOLATION_SAFE)return;

  const VERSION='45.8.31.50.33';
  const TECH_OWNER_EMAIL='maltadrivingmaster@gmail.com';
  const AUTH_KEY='mdm_auth_session_v4410';
  const MIGRATION_PREFIX='mdm_account_safe_migrated_v1::';
  const QUARANTINE_PREFIX='mdm_owner_legacy_quarantine_v1::';
  const OWNER_QUARANTINE_MARKER='mdm_owner_isolation_quarantined_v1::';
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

  const rawGet=Storage.prototype.getItem;
  const rawSet=Storage.prototype.setItem;
  const rawRemove=Storage.prototype.removeItem;

  function isLocal(store){
    try{return store===window.localStorage;}catch(_){return false;}
  }

  function auth(){
    try{
      const raw=rawGet.call(localStorage,AUTH_KEY);
      const s=raw?JSON.parse(raw):null;
      const status=String(s&&s.status||'');
      const userId=String(s&&s.user&&s.user.id||'');
      const email=String(s&&s.user&&s.user.email||'').trim().toLowerCase();
      const expiresAt=Number(s&&s.expiresAt||0);
      const ok=status==='authenticated'&&!!userId&&(expiresAt<=0||expiresAt>Date.now());
      return ok?{ok:true,userId,email}:{ok:false,userId:'',email:''};
    }catch(_){return {ok:false,userId:'',email:''};}
  }

  function accountType(a){
    return a&&a.ok&&a.email===TECH_OWNER_EMAIL?'owner':'user';
  }

  function scoped(key,a){
    const type=accountType(a);
    return String(key)+'::'+type+':'+String(a&&a.userId||'');
  }

  function findEmail(value,depth){
    if(depth>4||value==null)return '';
    if(typeof value==='string'){
      const s=value.trim().toLowerCase();
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s)?s:'';
    }
    if(Array.isArray(value)){
      for(const v of value){const e=findEmail(v,depth+1);if(e)return e;}
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
    }
    return '';
  }

  function legacyOwnerEmail(){
    try{
      const raw=rawGet.call(localStorage,'mdm-v1-user-profile') || rawGet.call(localStorage,QUARANTINE_PREFIX+'mdm-v1-user-profile');
      if(!raw)return '';
      return findEmail(JSON.parse(raw),0);
    }catch(_){return '';}
  }

  function legacyValue(key){
    const direct=rawGet.call(localStorage,key);
    if(direct!==null)return direct;
    return rawGet.call(localStorage,QUARANTINE_PREFIX+key);
  }

  function quarantineOwnerContamination(a){
    if(!a||!a.ok||accountType(a)!=='owner')return false;
    const marker=OWNER_QUARANTINE_MARKER+a.userId;
    if(rawGet.call(localStorage,marker)==='1')return true;

    /* Preserve and remove the old student namespace accidentally attached
       to the technical Owner account. */
    for(const key of USER_KEYS){
      const wrong=String(key)+'::user:'+a.userId;
      const value=rawGet.call(localStorage,wrong);
      if(value!==null){
        const backup=QUARANTINE_PREFIX+wrong;
        if(rawGet.call(localStorage,backup)===null)rawSet.call(localStorage,backup,value);
        rawRemove.call(localStorage,wrong);
      }
    }

    /* If legacy global user data belongs to another email, preserve it and
       remove it from the live global namespace so even direct legacy reads
       cannot paint another user's profile into the Owner Home. */
    const directProfile=rawGet.call(localStorage,'mdm-v1-user-profile');
    let directEmail='';
    try{directEmail=directProfile?findEmail(JSON.parse(directProfile),0):'';}catch(_){}
    if(directEmail&&directEmail!==a.email){
      for(const key of USER_KEYS){
        const value=rawGet.call(localStorage,key);
        if(value===null)continue;
        const backup=QUARANTINE_PREFIX+key;
        if(rawGet.call(localStorage,backup)===null)rawSet.call(localStorage,backup,value);
        rawRemove.call(localStorage,key);
      }
    }

    rawSet.call(localStorage,marker,'1');
    return true;
  }

  function migrateOwnedLegacy(a){
    if(!a.ok||!a.email||accountType(a)==='owner')return false;
    const owner=legacyOwnerEmail();
    if(!owner||owner!==a.email)return false;
    const marker=MIGRATION_PREFIX+a.userId;
    if(rawGet.call(localStorage,marker)==='1')return true;

    for(const key of USER_KEYS){
      const target=scoped(key,a);
      if(rawGet.call(localStorage,target)!==null)continue;
      const legacy=legacyValue(key);
      if(legacy!==null)rawSet.call(localStorage,target,legacy);
    }
    rawSet.call(localStorage,marker,'1');
    return true;
  }

  function readUserKey(key){
    const a=auth();
    if(!a.ok)return null;
    quarantineOwnerContamination(a);
    migrateOwnedLegacy(a);
    return rawGet.call(localStorage,scoped(key,a));
  }

  function writeUserKey(key,value){
    const a=auth();
    if(!a.ok)return rawSet.call(localStorage,String(key)+'::guest',String(value));
    quarantineOwnerContamination(a);
    return rawSet.call(localStorage,scoped(key,a),String(value));
  }

  function removeUserKey(key){
    const a=auth();
    if(!a.ok)return rawRemove.call(localStorage,String(key)+'::guest');
    return rawRemove.call(localStorage,scoped(key,a));
  }

  Storage.prototype.getItem=function(key){
    const k=String(key);
    if(isLocal(this)&&USER_KEYS.has(k))return readUserKey(k);
    return rawGet.apply(this,arguments);
  };

  Storage.prototype.setItem=function(key,value){
    const k=String(key);
    if(isLocal(this)&&USER_KEYS.has(k))return writeUserKey(k,value);
    if(isLocal(this)&&k===AUTH_KEY){
      const out=rawSet.apply(this,arguments);
      const a=auth();
      if(a.ok)quarantineOwnerContamination(a);
      return out;
    }
    return rawSet.apply(this,arguments);
  };

  Storage.prototype.removeItem=function(key){
    const k=String(key);
    if(isLocal(this)&&USER_KEYS.has(k))return removeUserKey(k);
    return rawRemove.apply(this,arguments);
  };

  window.MDM_ACCOUNT_ISOLATION_SAFE=Object.freeze({
    version:VERSION,
    keys:Array.from(USER_KEYS),
    current:auth,
    accountType:()=>accountType(auth()),
    quarantineOwner:()=>quarantineOwnerContamination(auth()),
    legacyOwnerEmail
  });
})();
/* Run once before the historical app runtime starts. */
try{const __a=auth();if(__a.ok)quarantineOwnerContamination(__a);}catch(_){}
