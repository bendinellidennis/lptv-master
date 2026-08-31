/* Malta Driving Master 45.8.31.50.16 — Account Contamination Scrub
   Safety rule: if the scoped profile stored under the CURRENT authenticated user_id
   contains a different email than auth.user.email, quarantine and clear ONLY that
   current user's scoped user-owned keys. Other accounts are untouched. */
(function(){
  'use strict';
  if(window.MDM_ACCOUNT_CONTAMINATION_SCRUB)return;

  const VERSION='45.8.31.50.16';
  const AUTH_KEY='mdm_auth_session_v4410';
  const BACKUP_PREFIX='mdm_account_contamination_backup_v45831516::';
  const USER_KEYS=[
    'mdm-v1-progress','mdm-v1-error-replay','mdm-v1-zero-error','mdm-v1-exam-day',
    'mdm-v1-coach-recovery','mdm-v1-user-profile','mdm-v1-mission-system',
    'mdm-v1-ai-instructor','mdm-v1-coach','mdm-v1-onboarding',
    'mdm-v1-pilot-analytics','mdm-v1-personal-roadmap','mdm-v1-lptv-passport',
    'mdm-v1-real-road-twin','mdm-v1-real-road-telemetry',
    'mdm-v1-real-road-selected-pattern','mdm-v1-real-road-telemetry-mission-launch'
  ];

  function session(){
    try{
      const s=JSON.parse(localStorage.getItem(AUTH_KEY)||'null');
      if(!s||s.status!=='authenticated'||!s.user?.id)return null;
      return {userId:String(s.user.id),email:String(s.user.email||'').trim().toLowerCase()};
    }catch(_){return null;}
  }

  function findEmail(value,depth){
    if(depth>5||value==null)return '';
    if(typeof value==='string'){
      const s=value.trim().toLowerCase();
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s)?s:'';
    }
    if(Array.isArray(value)){
      for(const v of value){const e=findEmail(v,depth+1);if(e)return e;}
      return '';
    }
    if(typeof value==='object'){
      for(const k of ['email','userEmail','user_email','accountEmail','account_email']){
        if(Object.prototype.hasOwnProperty.call(value,k)){
          const e=findEmail(value[k],depth+1);if(e)return e;
        }
      }
      for(const k of Object.keys(value)){
        if(/email/i.test(k)){const e=findEmail(value[k],depth+1);if(e)return e;}
      }
    }
    return '';
  }

  function scrubIfMismatch(){
    const a=session();
    if(!a||!a.userId||!a.email)return {ok:false,reason:'not_authenticated'};
    const profileKey='mdm-v1-user-profile::user:'+a.userId;
    const raw=localStorage.getItem(profileKey);
    if(!raw)return {ok:true,reason:'no_scoped_profile'};
    let profileEmail='';
    try{profileEmail=findEmail(JSON.parse(raw),0);}catch(_){}
    if(!profileEmail)return {ok:true,reason:'profile_email_missing'};
    if(profileEmail===a.email)return {ok:true,reason:'profile_matches_auth'};

    let cleared=0;
    for(const key of USER_KEYS){
      const scoped=key+'::user:'+a.userId;
      try{
        const value=localStorage.getItem(scoped);
        if(value===null)continue;
        const backup=BACKUP_PREFIX+a.userId+'::'+key;
        if(localStorage.getItem(backup)===null)localStorage.setItem(backup,value);
        localStorage.removeItem(scoped);
        cleared++;
      }catch(_){}
    }
    try{sessionStorage.setItem('mdm_account_contamination_scrub_v45831516',JSON.stringify({userId:a.userId,email:a.email,profileEmail,cleared,at:Date.now()}));}catch(_){}
    if(cleared>0){
      try{
        const url=new URL(location.href);
        url.searchParams.set('mdm_scrub','45831516');
        location.replace(url.toString());
      }catch(_){try{location.reload();}catch(__){}}
    }
    return {ok:true,reason:'mismatch_scrubbed',cleared};
  }

  window.MDM_ACCOUNT_CONTAMINATION_SCRUB=Object.freeze({version:VERSION,run:scrubIfMismatch});
  setTimeout(scrubIfMismatch,0);
})();