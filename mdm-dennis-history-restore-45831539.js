/* Malta Driving Master 45.8.31.50.39 — Dennis Historical Data Restore
   Restores historical student data only for the authenticated Dennis account,
   selecting a backup set whose profile email matches the Dennis account.
   Existing destination values are backed up before overwrite.
   No navigation, no reloads, no timers, no server writes. */
(function(){
  'use strict';
  if(window.MDM_DENNIS_HISTORY_RESTORE)return;

  const VERSION='45.8.31.50.50';
  const AUTH_KEY='mdm_auth_session_v4410';
  const TARGET_EMAIL='bendinellidennis@gmail.com';
  const PROFILE_KEY='mdm-v1-user-profile';
  const MARKER_PREFIX='mdm_dennis_history_restored_v1::';
  const PRE_RESTORE_PREFIX='mdm_dennis_pre_restore_v1::';
  const PRE_REHYDRATE_PREFIX='mdm_dennis_pre_rehydrate_v1::';
  const REHYDRATE_PREFIX='mdm_dennis_history_rehydrated_v1::';

  const USER_KEYS=[
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
  ];

  function readJson(raw){
    try{return raw?JSON.parse(raw):null;}catch(_){return null;}
  }

  function auth(){
    try{
      const raw=localStorage.getItem(AUTH_KEY);
      const s=readJson(raw);
      if(!s||s.status!=='authenticated'||!s.user?.id)return null;
      if(Number(s.expiresAt||0)>0&&Number(s.expiresAt)<=Date.now())return null;
      const email=String(s.user?.email||s.email||'').trim().toLowerCase();
      return email===TARGET_EMAIL?s:null;
    }catch(_){return null;}
  }

  function findEmail(value,depth){
    if(depth>5||value==null)return '';
    if(typeof value==='string'){
      const s=value.trim().toLowerCase();
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s)?s:'';
    }
    if(Array.isArray(value)){
      for(const x of value){const e=findEmail(x,depth+1);if(e)return e;}
      return '';
    }
    if(typeof value==='object'){
      for(const k of ['email','userEmail','user_email','accountEmail','account_email']){
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

  function profileMatches(raw){
    const obj=readJson(raw);
    return Boolean(obj&&findEmail(obj,0)===TARGET_EMAIL);
  }

  function candidatePrefixes(){
    const out=[];
    for(let i=0;i<localStorage.length;i++){
      const key=localStorage.key(i);
      if(!key)continue;
      if(key.endsWith('::'+PROFILE_KEY)){
        const raw=localStorage.getItem(key);
        if(profileMatches(raw))out.push(key.slice(0,-PROFILE_KEY.length));
      }
      if(key==='mdm_owner_legacy_quarantine_v1::'+PROFILE_KEY){
        const raw=localStorage.getItem(key);
        if(profileMatches(raw))out.push('mdm_owner_legacy_quarantine_v1::');
      }
    }
    return Array.from(new Set(out));
  }

  function scorePrefix(prefix){
    let total=0,count=0;
    for(const key of USER_KEYS){
      const raw=localStorage.getItem(prefix+key);
      if(raw!==null){count++;total+=raw.length;}
    }
    return {prefix,count,total};
  }

  function bestSource(){
    const scored=candidatePrefixes().map(scorePrefix)
      .filter(x=>x.count>0)
      .sort((a,b)=>(b.total-a.total)||(b.count-a.count));
    return scored[0]||null;
  }

  function currentState(userId){
    let count=0,total=0;
    const values={};
    for(const key of USER_KEYS){
      const targetKey=key+'::user:'+userId;
      const raw=localStorage.getItem(targetKey);
      values[key]=raw;
      if(raw!==null){count++;total+=raw.length;}
    }
    const profile=values[PROFILE_KEY];
    return {
      count,
      total,
      values,
      profileEmail:profile?findEmail(readJson(profile),0):''
    };
  }

  function needsRepair(current,source){
    if(!source)return false;
    if(current.profileEmail!==TARGET_EMAIL)return true;

    const sourceProgress=localStorage.getItem(source.prefix+'mdm-v1-progress');
    const currentProgress=current.values['mdm-v1-progress'];
    if(sourceProgress!==null){
      if(currentProgress===null)return true;
      if(sourceProgress.length>120 && currentProgress.length < sourceProgress.length*0.55)return true;
    }

    if(source.total>500 && current.total < source.total*0.55)return true;
    return false;
  }

  function restore(){
    const s=auth();
    if(!s)return {restored:false,reason:'not_target_account'};
    const userId=String(s.user.id);
    const marker=MARKER_PREFIX+userId;
    const source=bestSource();
    if(!source)return {restored:false,reason:'no_matching_backup',userId};

    const current=currentState(userId);
    const firstRestore=localStorage.getItem(marker)!=='1';
    const repair=needsRepair(current,source);

    if(!firstRestore&&!repair){
      return {
        restored:false,
        reason:'already_restored_and_healthy',
        userId,
        currentCount:current.count,
        currentBytes:current.total,
        sourceCount:source.count,
        sourceBytes:source.total
      };
    }

    const stamp=Date.now();
    let restoredCount=0,restoredBytes=0,repairedCount=0;

    for(const key of USER_KEYS){
      const sourceValue=localStorage.getItem(source.prefix+key);
      if(sourceValue===null)continue;

      const targetKey=key+'::user:'+userId;
      const currentValue=localStorage.getItem(targetKey);

      let shouldCopy=firstRestore || currentValue===null;

      if(!shouldCopy && key===PROFILE_KEY){
        const currentEmail=findEmail(readJson(currentValue),0);
        if(currentEmail!==TARGET_EMAIL)shouldCopy=true;
      }

      if(!shouldCopy && currentValue!==null){
        if(sourceValue.length>120 && currentValue.length < sourceValue.length*0.55)shouldCopy=true;
      }

      if(!shouldCopy)continue;

      if(currentValue!==null){
        const backupKey=(firstRestore?PRE_RESTORE_PREFIX:PRE_REHYDRATE_PREFIX+stamp+'::')+targetKey;
        if(localStorage.getItem(backupKey)===null)localStorage.setItem(backupKey,currentValue);
      }

      localStorage.setItem(targetKey,sourceValue);
      restoredCount++;
      restoredBytes+=sourceValue.length;
      if(!firstRestore)repairedCount++;
    }

    localStorage.setItem(marker,'1');
    const meta={
      version:VERSION,
      sourcePrefix:source.prefix,
      sourceCount:source.count,
      sourceBytes:source.total,
      restoredCount,
      restoredBytes,
      repairedCount,
      firstRestore,
      repair,
      previousCount:current.count,
      previousBytes:current.total,
      at:new Date().toISOString()
    };
    localStorage.setItem(marker+'::meta',JSON.stringify(meta));
    if(!firstRestore&&repair){
      localStorage.setItem(REHYDRATE_PREFIX+userId,JSON.stringify(meta));
    }

    return {restored:true,userId,...meta};
  }

  const previousSetItem=Storage.prototype.setItem;
  Storage.prototype.setItem=function(key,value){
    const out=previousSetItem.apply(this,arguments);
    try{
      if(this===window.localStorage&&String(key)===AUTH_KEY)restore();
    }catch(_){}
    return out;
  };

  const state=restore();
  window.MDM_DENNIS_HISTORY_RESTORE=Object.freeze({
    version:VERSION,
    state,
    restore
  });
})();