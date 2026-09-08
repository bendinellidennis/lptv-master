/* Malta Driving Master — Account Isolation Safe Adapter
   P0-02: account namespaces, provenance and lifecycle boundaries:
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

  const VERSION='P0-02-2026-09-08';
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
    'mdm-v1-account-enrollment',
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
  const DEVICE_KEYS=new Set([
    'mdm-v1-settings','mdm-v1-investor-preview','mdm-v1-premium-splash',
    'mdm_backend_setup_v4400','mdm_auth_attempt_guard_v458319',
    'mdm_pilot_device_token_v4583146','mdm-home-performance-focus-v1',
    'mdm_post_login_reload_v1'
  ]);
  const CONTEXT_KEYS=new Set(['mdm_pilot_pending_invite_v1']);
  const listeners=new Set(), provenance=new WeakMap();
  let epoch=0, observed='';

  function classify(key){
    const k=String(key);
    if(k===AUTH_KEY)return 'auth';
    if(DEVICE_KEYS.has(k))return 'device';
    if(CONTEXT_KEYS.has(k)||k.startsWith('mdm_invite_email_blank_once_v1::'))return 'context';
    if(/^(mdm_owner_legacy_quarantine_v1::|mdm_account_contamination_backup_v1::|mdm_dennis_pre_(restore|rehydrate)_v1::)/.test(k))return 'recovery';
    return /^mdm[-_]/.test(k)?'account':'device';
  }
  function isManaged(store){
    try{return store===window.localStorage||store===window.sessionStorage;}catch(_){return false;}
  }
  function observe(){
    const a=auth(), signature=JSON.stringify([a.userId,a.generation,accountType(a)]);
    if(signature!==observed){
      observed=signature;epoch++;
      if(a.ok){quarantineOwnerContamination(a);recoverAccountFromMatchingBackup(a);}
      for(const listener of listeners)listener();
    }
    return a;
  }
  function capture(){
    const a=observe();
    return Object.freeze({userId:a.userId,generation:a.generation,epoch});
  }
  function isCurrent(context){
    const a=observe();
    return !!context&&context.userId===a.userId&&context.generation===a.generation&&context.epoch===epoch;
  }
  function changed(error){return !!error&&error.code==='MDM_ACCOUNT_CHANGED';}
  function check(context,value){
    if(!isCurrent(context)){const error=new Error('Account changed');error.code='MDM_ACCOUNT_CHANGED';throw error;}
    return value;
  }
  function own(value,context=capture(),seen=new WeakSet()){
    if(!value||typeof value!=='object'||seen.has(value))return value;
    seen.add(value);
    // Never relabel a value which already has provenance, including nested data.
    if(!provenance.has(value))provenance.set(value,context);
    for(const item of Object.values(value))own(item,context,seen);
    return value;
  }
  function usable(value,context=capture(),seen=new WeakSet()){
    if(!isCurrent(context))return false;
    if(!value||typeof value!=='object'||seen.has(value))return true;
    seen.add(value);
    const owner=provenance.get(value);
    if(owner&&!isCurrent(owner))return false;
    return Object.values(value).every(item=>usable(item,context,seen));
  }
  function inherit(copy,source){const owner=source&&typeof source==='object'&&provenance.get(source);return owner?own(copy,owner):copy;}
  function write(key,value,context=capture()){
    if(classify(key)==='account'&&(!context.userId||!usable(value,context)))return false;
    check(context);
    if(classify(key)==='account')own(value,context);
    localStorage.setItem(key,JSON.stringify(value));return true;
  }
  function explicitOwner(key){
    const k=String(key), suffix=k.match(/^(.*?)::(user|owner):([^:]+)(.*)$/);
    if(suffix)return {base:suffix[1],type:suffix[2],userId:suffix[3],tail:suffix[4]};
    const enrollment=k.match(/^mdm-v1-account-enrollment-user:([^:]+)$/);
    if(enrollment)return {direct:true,userId:enrollment[1]};
    const metrics=k.match(/^mdm_pilot_quality_metrics_v1::([^:]+)$/);
    return metrics?{direct:true,userId:metrics[1]}:null;
  }
  function targetKey(key,a){
    if(!a.ok||/::(?:guest|signed-out)(?:::|$)/.test(key))return null;
    const owner=explicitOwner(key);
    if(owner){
      if(owner.userId!==a.userId)return null;
      if(owner.direct)return key;
      if(USER_KEYS.has(owner.base)&&accountType(a)==='owner'&&owner.type==='user')return null;
      return scoped(owner.base,a)+owner.tail;
    }
    return scoped(key,a);
  }
  function migrateIdentifiedValue(key,target,a){
    if(rawGet.call(localStorage,target)!==null)return;
    const raw=rawGet.call(localStorage,key);if(raw===null)return;
    let data;try{data=JSON.parse(raw);}catch(_){return;}
    if(!data||typeof data!=='object'||Array.isArray(data))return;
    const uid=String(data.ownerUserId||data.accountUserId||data.authUserId||'');
    const email=String(data.ownerEmail||data.accountEmail||'').trim().toLowerCase();
    if(uid?uid!==a.userId:(!email||email!==a.email))return;
    rawSet.call(localStorage,target,raw);
  }

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
      const generation=Number(s&&s.generation||0);
      // Token expiry is a credential concern; it does not change the data owner.
      const ok=status==='authenticated'&&!!userId;
      return ok?{ok:true,userId,email,generation}:{ok:false,userId:'',email:'',generation};
    }catch(_){return {ok:false,userId:'',email:'',generation:0};}
  }

  function accountType(a){
    return a&&a.ok&&a.email===TECH_OWNER_EMAIL?'owner':'user';
  }

  observed=JSON.stringify([auth().userId,auth().generation,accountType(auth())]);

  function scoped(key,a){
    const type=USER_KEYS.has(String(key))?accountType(a):'user';
    return String(key)+'::'+type+':'+String(a&&a.userId||'');
  }

  function parseLegacyScopedKey(key){
    const m=String(key).match(/^(.*)::user:([^:]+)$/);
    if(!m||!USER_KEYS.has(m[1]))return null;
    return {base:m[1],userId:m[2]};
  }

  function parseEnrollmentUserKey(key){
    const m=String(key).match(/^mdm-v1-account-enrollment-user:([^:]+)$/);
    return m?{userId:m[1]}:null;
  }

  function crossAccountKey(key,a){
    const legacy=parseLegacyScopedKey(key);
    if(legacy){
      if(!a||!a.ok)return true;
      if(accountType(a)==='owner')return true;
      return legacy.userId!==a.userId;
    }
    const enrollment=parseEnrollmentUserKey(key);
    if(enrollment){
      if(!a||!a.ok)return true;
      return enrollment.userId!==a.userId;
    }
    return false;
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

  function recoverAccountFromMatchingBackup(a){
    if(!a||!a.ok||accountType(a)==='owner'||!a.email)return {recovered:false,reason:'not_student'};
    const targetProfile=scoped('mdm-v1-user-profile',a);
    const currentProfile=rawGet.call(localStorage,targetProfile);
    let currentEmail='';
    try{currentEmail=currentProfile?findEmail(JSON.parse(currentProfile),0):'';}catch(_){}
    if(currentEmail===a.email)return {recovered:false,reason:'healthy'};

    const candidates=[];
    for(let i=0;i<localStorage.length;i++){
      const storageKey=localStorage.key(i);
      if(!storageKey)continue;
      const at=storageKey.indexOf('mdm-v1-user-profile');
      if(at<0)continue;
      const raw=rawGet.call(localStorage,storageKey);
      let email='';
      try{email=raw?findEmail(JSON.parse(raw),0):'';}catch(_){}
      if(email!==a.email)continue;
      const pre=storageKey.slice(0,at);
      const post=storageKey.slice(at+'mdm-v1-user-profile'.length);
      let count=0,total=0;
      for(const key of USER_KEYS){
        const value=rawGet.call(localStorage,pre+key+post);
        if(value!==null){count++;total+=value.length;}
      }
      candidates.push({pre,post,count,total,profileKey:storageKey});
    }
    candidates.sort((x,y)=>(y.total-x.total)||(y.count-x.count));
    const source=candidates[0];
    if(!source)return {recovered:false,reason:'no_matching_backup'};

    const stamp=Date.now();
    let restored=0;
    for(const key of USER_KEYS){
      const sourceValue=rawGet.call(localStorage,source.pre+key+source.post);
      if(sourceValue===null)continue;
      const target=scoped(key,a);
      const contaminated=rawGet.call(localStorage,target);
      if(contaminated!==null){
        rawSet.call(localStorage,'mdm_account_contamination_backup_v1::'+stamp+'::'+target,contaminated);
      }
      rawSet.call(localStorage,target,sourceValue);
      restored++;
    }
    rawSet.call(localStorage,'mdm_account_recovered_v1::'+a.userId,JSON.stringify({
      version:VERSION,email:a.email,restored,source:source.profileKey,at:new Date().toISOString()
    }));
    return {recovered:true,restored,source:source.profileKey};
  }

  Storage.prototype.getItem=function(key){
    const k=String(key);
    if(isManaged(this)){
      const kind=classify(k);
      if(kind==='recovery')return null;
      if(kind==='account'){
        const a=observe(), target=targetKey(k,a);if(!target)return null;
        if(isLocal(this)){
          quarantineOwnerContamination(a);migrateOwnedLegacy(a);
          if(!explicitOwner(k))migrateIdentifiedValue(k,target,a);
        }
        const value=rawGet.call(this,target);
        // ISO-03 could already have cached A under B's UID in an old build.
        // Keep ambiguous cache bytes, but require provenance before using them.
        if(k.split('::')[0]==='mdm-school-evidence-cache-v1'&&value!==null){
          let cache;try{cache=JSON.parse(value);}catch(_){return null;}
          const rows=Array.isArray(cache.missions)?cache.missions:[];
          if(rows.some(row=>row.student_user_id&&String(row.student_user_id)!==a.userId))return null;
          const stamped=cache.ownershipSchema==='mdm-account-owned-v2'&&cache.ownerUserId===a.userId;
          const identified=rows.length>0&&rows.every(row=>String(row.student_user_id||'')===a.userId);
          if(!stamped&&!identified)return null;
        }
        return value;
      }
    }
    return rawGet.apply(this,arguments);
  };

  Storage.prototype.setItem=function(key,value){
    const k=String(key);
    if(isManaged(this)){
      const kind=classify(k);
      if(kind==='recovery')return undefined;
      if(kind==='account'){
        const a=observe(),target=targetKey(k,a);if(!target)return undefined;
        if(isLocal(this))quarantineOwnerContamination(a);
        return rawSet.call(this,target,String(value));
      }
      if(isLocal(this)&&k===AUTH_KEY){
        const out=rawSet.apply(this,arguments);
        observe();return out;
      }
    }
    return rawSet.apply(this,arguments);
  };

  Storage.prototype.removeItem=function(key){
    const k=String(key);
    if(isManaged(this)){
      const kind=classify(k);
      if(kind==='recovery')return undefined;
      if(kind==='account'){
        const target=targetKey(k,observe());
        return target?rawRemove.call(this,target):undefined;
      }
      if(isLocal(this)&&k===AUTH_KEY){
        const out=rawRemove.apply(this,arguments);observe();return out;
      }
    }
    return rawRemove.apply(this,arguments);
  };
  window.addEventListener('storage',event=>{if(event.key===AUTH_KEY||event.key===null)observe();});

  /* Preflight before the historical app runtime starts. */
  try{
    const preflight=auth();
    if(preflight.ok){
      quarantineOwnerContamination(preflight);
      recoverAccountFromMatchingBackup(preflight);
    }
  }catch(_){}

  window.MDM_ACCOUNT_ISOLATION_SAFE=Object.freeze({
    version:VERSION,
    keys:Array.from(USER_KEYS),
    current:auth,
    accountType:()=>accountType(auth()),
    accountSwitchWriteLocked:()=>false,
    classify,capture,isCurrent,check,changed,own,usable,inherit,write,
    bind:(callback,context=capture())=>function(...args){if(!isCurrent(context))return;return callback.apply(this,args);},
    subscribe:listener=>{listeners.add(listener);return ()=>listeners.delete(listener);},
    namespace:key=>targetKey(String(key),observe()),
    recoverAccount:()=>recoverAccountFromMatchingBackup(auth()),
    quarantineOwner:()=>quarantineOwnerContamination(auth()),
    legacyOwnerEmail
  });
})();
