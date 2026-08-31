/* Malta Driving Master 45.8.31.50.15 — Owned Legacy Account Recovery
   One-time recovery of quarantined user-owned data into the authenticated account.
   Recovery runs only when the authenticated email matches the email stored in the
   quarantined legacy profile. No auth/session values are modified. */
(function(){
  'use strict';
  if(window.MDM_OWNED_LEGACY_RECOVERY)return;

  const VERSION='45.8.31.50.15';
  const AUTH_KEY='mdm_auth_session_v4410';
  const BACKUP_PREFIX='mdm_account_isolation_legacy_backup_v4583154::';
  const MARKER_PREFIX='mdm_account_isolation_legacy_restored_v45831515::';
  const USER_KEYS=[
    'mdm-v1-progress','mdm-v1-error-replay','mdm-v1-zero-error','mdm-v1-exam-day',
    'mdm-v1-coach-recovery','mdm-v1-user-profile','mdm-v1-mission-system',
    'mdm-v1-ai-instructor','mdm-v1-coach','mdm-v1-onboarding',
    'mdm-v1-pilot-analytics','mdm-v1-personal-roadmap','mdm-v1-lptv-passport',
    'mdm-v1-real-road-twin','mdm-v1-real-road-telemetry',
    'mdm-v1-real-road-selected-pattern','mdm-v1-real-road-telemetry-mission-launch'
  ];

  function emailFrom(value,depth){
    if(depth>5||value==null)return '';
    if(typeof value==='string'){
      const s=value.trim().toLowerCase();
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s)?s:'';
    }
    if(Array.isArray(value)){
      for(const v of value){const e=emailFrom(v,depth+1);if(e)return e;}
      return '';
    }
    if(typeof value==='object'){
      for(const k of ['email','userEmail','user_email','accountEmail','account_email']){
        if(Object.prototype.hasOwnProperty.call(value,k)){
          const e=emailFrom(value[k],depth+1);if(e)return e;
        }
      }
      for(const k of Object.keys(value)){
        if(/email/i.test(k)){const e=emailFrom(value[k],depth+1);if(e)return e;}
      }
    }
    return '';
  }

  function auth(){
    try{
      const raw=localStorage.getItem(AUTH_KEY);
      const s=raw?JSON.parse(raw):null;
      if(!s||s.status!=='authenticated'||!s.user?.id)return null;
      return {userId:String(s.user.id),email:String(s.user.email||'').trim().toLowerCase()};
    }catch(_){return null;}
  }

  function legacyOwnerEmail(){
    try{
      const raw=localStorage.getItem(BACKUP_PREFIX+'mdm-v1-user-profile');
      return raw?emailFrom(JSON.parse(raw),0):'';
    }catch(_){return '';}
  }

  function recover(){
    const a=auth();
    if(!a||!a.userId||!a.email)return false;
    const owner=legacyOwnerEmail();
    if(!owner||owner!==a.email)return false;

    const marker=MARKER_PREFIX+a.userId;
    if(localStorage.getItem(marker)==='1')return true;

    let copied=0;
    for(const key of USER_KEYS){
      try{
        const legacy=localStorage.getItem(BACKUP_PREFIX+key);
        if(legacy===null)continue;
        localStorage.setItem(key+'::user:'+a.userId,legacy);
        copied++;
      }catch(_){}
    }
    if(copied>0){
      localStorage.setItem(marker,'1');
      document.documentElement.dataset.mdmLegacyRecovery='restored';
      return true;
    }
    return false;
  }

  const previousSet=Storage.prototype.setItem;
  Storage.prototype.setItem=function(key,value){
    const out=previousSet.apply(this,arguments);
    try{
      if(this===localStorage&&String(key)===AUTH_KEY){
        [0,80,250].forEach(ms=>setTimeout(recover,ms));
      }
    }catch(_){}
    return out;
  };

  window.addEventListener('pageshow',()=>{try{recover();}catch(_){}});
  document.addEventListener('visibilitychange',()=>{if(!document.hidden){try{recover();}catch(_){}}});
  try{recover();}catch(_){}

  window.MDM_OWNED_LEGACY_RECOVERY=Object.freeze({version:VERSION,recover});
})();