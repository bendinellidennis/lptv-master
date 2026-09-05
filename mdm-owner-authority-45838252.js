/* Malta Driving Master 45.8.38.25.2 — Server-Authoritative Technical Owner Gate
   Security boundary: Owner UI is enabled only after the authenticated Supabase RPC
   mdm_is_platform_owner() confirms the current auth.uid(). No email/local profile is trusted. */
(function(){
  'use strict';
  if(window.MDM_OWNER_AUTHORITY)return;

  const VERSION='45.8.38.25.2.19';
  const AUTH_KEY='mdm_auth_session_v4410';
  let inFlight=null;
  let lastFingerprint='';
  const state={version:VERSION,status:'idle',authorized:false,checkedAt:'',reason:''};

  function readSession(){
    try{
      const raw=localStorage.getItem(AUTH_KEY);
      const s=raw?JSON.parse(raw):null;
      if(!s||s.status!=='authenticated'||!s.accessToken||!s.user?.id)return null;
      if(Number(s.expiresAt||0)>0&&Number(s.expiresAt)<=Date.now())return null;
      return s;
    }catch(_){return null}
  }
  function fingerprint(s){
    return s?String(s.user?.id||'')+'|'+String(s.accessToken||'').slice(-32)+'|'+String(s.expiresAt||''):'';
  }
  function currentSessionVerified(){
    const s=readSession();
    return Boolean(s&&lastFingerprint&&lastFingerprint===fingerprint(s)&&state.status==='verified');
  }
  function snapshot(){return Object.freeze({...state,currentSessionVerified:currentSessionVerified()})}
  function isOwner(){return currentSessionVerified()&&state.authorized===true}
  function signal(){
    try{window.dispatchEvent(new CustomEvent('mdm:owner-authority',{detail:snapshot()}));}catch(_){}
  }
  function reset(reason){
    lastFingerprint='';
    state.status='signed_out';state.authorized=false;state.checkedAt=new Date().toISOString();state.reason=String(reason||'authentication_required');
    signal();return snapshot();
  }
  async function verify(force=false){
    const s=readSession();
    if(!s)return reset('authentication_required');
    const fp=fingerprint(s);
    if(!force&&fp&&fp===lastFingerprint&&state.status==='verified')return snapshot();
    if(inFlight)return inFlight;

    const cfg=window.MDM_BACKEND_CONFIG||{};
    if(!cfg.enabled||!cfg.endpoint||!cfg.publishableKey){
      state.status='error';state.authorized=false;state.reason='backend_config_unavailable';state.checkedAt=new Date().toISOString();signal();return snapshot();
    }

    state.status='checking';state.authorized=false;state.reason='';signal();
    inFlight=(async()=>{
      try{
        const r=await fetch(String(cfg.endpoint).replace(/\/$/,'')+'/rest/v1/rpc/mdm_is_platform_owner',{
          method:'POST',
          headers:{'Content-Type':'application/json','apikey':String(cfg.publishableKey),'Authorization':'Bearer '+String(s.accessToken)},
          body:'{}',
          cache:'no-store',
          credentials:'omit'
        });
        const tx=await r.text();
        let d=false;try{d=tx?JSON.parse(tx):false}catch(_){}
        const ok=r.ok&&d===true;
        state.status='verified';state.authorized=ok;state.reason=ok?'':'platform_owner_required';state.checkedAt=new Date().toISOString();
        lastFingerprint=fp;
      }catch(e){
        state.status='error';state.authorized=false;state.reason=String(e?.message||e||'owner_verification_failed');state.checkedAt=new Date().toISOString();
      }finally{
        inFlight=null;signal();
      }
      return snapshot();
    })();
    return inFlight;
  }

  window.addEventListener('pageshow',()=>verify(false));
  document.addEventListener('visibilitychange',()=>{if(!document.hidden)verify(false)});
  window.MDM_OWNER_AUTHORITY=Object.freeze({version:VERSION,isOwner,snapshot,verify,reset,currentSessionVerified});
  verify(false);
})();