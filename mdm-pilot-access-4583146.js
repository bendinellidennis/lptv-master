/* Malta Driving Master 45.8.31.46 — Pilot Access Shadow Bridge
   Uses the existing verified MDM auth session key.
   Entitlement + device registration run only after authenticated readiness.
   No DOM observers, no repeated polling, no enforcement. */
(function(){
  'use strict';

  if (window.MDM_PILOT_ACCESS_BRIDGE) return;

  const AUTH_KEY='mdm_auth_session_v4410';
  const DEVICE_TOKEN_KEY='mdm_pilot_device_token_v4583146';
  let lastAuthFingerprint='';
  let checkInFlight=false;
  let deviceInFlight=false;

  const state={
    version:'45.8.31.46.1',
    mode:'shadow',
    enforcement:false,
    status:'ready',
    checkedAt:'',
    authorized:null,
    reason:'',
    error:'',
    deviceStatus:'not_checked',
    deviceReason:'',
    deviceError:'',
    deviceCheckedAt:''
  };

  function snapshot(){return Object.assign({},state)}

  function renderBadge(){
    try{
      let el=document.getElementById('mdmPilotShadowBadge');
      if(!el){
        el=document.createElement('div');
        el.id='mdmPilotShadowBadge';
        el.setAttribute('aria-live','polite');
        el.style.cssText='position:fixed;z-index:9999;right:10px;top:calc(8px + env(safe-area-inset-top));max-width:82vw;padding:7px 10px;border-radius:10px;background:rgba(6,26,43,.90);color:#fff;font:700 10px/1.25 system-ui;letter-spacing:.01em;pointer-events:none;opacity:.94';
        document.body.appendChild(el);
      }
      const auth=state.authorized===true?'AUTHORIZED':state.authorized===false?'NO ACTIVE LICENSE':'PENDING';
      const device=state.authorized===true?' · DEVICE '+String(state.deviceStatus||'not_checked').toUpperCase():'';
      el.textContent='Pilot 45.8.31.46 · '+String(state.status||'ready').toUpperCase()+' · '+auth+device;
    }catch(_){}
  }

  function readSession(){
    try{
      const raw=localStorage.getItem(AUTH_KEY);
      if(!raw)return null;
      const s=JSON.parse(raw);
      if(!s||typeof s!=='object')return null;
      return s;
    }catch(_){return null}
  }

  function authFingerprint(session){
    try{
      const userId=String(session&&session.user&&session.user.id||'');
      const token=String(session&&session.accessToken||'');
      const verifiedAt=String(session&&session.verifiedAt||'');
      const status=String(session&&session.status||'');
      if(status!=='authenticated'||!userId||!token)return '';
      return userId+'|'+verifiedAt+'|'+token.slice(-24);
    }catch(_){return ''}
  }

  function randomDeviceToken(){
    const bytes=new Uint8Array(32);
    crypto.getRandomValues(bytes);
    let out='';
    for(let i=0;i<bytes.length;i++)out+=bytes[i].toString(16).padStart(2,'0');
    return out;
  }

  function getDeviceToken(){
    try{
      let token=String(localStorage.getItem(DEVICE_TOKEN_KEY)||'').trim();
      if(token.length>=32&&token.length<=512)return token;
      token=randomDeviceToken();
      localStorage.setItem(DEVICE_TOKEN_KEY,token);
      return token;
    }catch(_){return ''}
  }

  async function registerDevice(session){
    if(deviceInFlight)return snapshot();
    const cfg=window.MDM_BACKEND_CONFIG;
    const token=String(session&&session.accessToken||'');
    if(!cfg||!cfg.enabled||!cfg.endpoint||!cfg.publishableKey||!token)return snapshot();

    const deviceToken=getDeviceToken();
    if(!deviceToken){
      state.deviceStatus='error';
      state.deviceReason='device_token_unavailable';
      state.deviceError='device_token_unavailable';
      state.deviceCheckedAt=new Date().toISOString();
      renderBadge();
      return snapshot();
    }

    state.deviceStatus='checking';
    state.deviceReason='';
    state.deviceError='';
    renderBadge();
    deviceInFlight=true;

    try{
      const response=await fetch(
        String(cfg.endpoint).replace(/\/$/,'')+'/rest/v1/rpc/mdm_register_my_pilot_device',
        {
          method:'POST',
          headers:{
            'Content-Type':'application/json',
            'apikey':cfg.publishableKey,
            'Authorization':'Bearer '+token
          },
          body:JSON.stringify({p_device_token:deviceToken,p_device_label:'iPhone / Safari PWA'}),
          cache:'no-store'
        }
      );

      const body=await response.text();
      let data={};
      try{data=body?JSON.parse(body):{}}catch(_){}
      if(Array.isArray(data))data=data[0]||{};

      state.deviceCheckedAt=new Date().toISOString();

      if(!response.ok){
        state.deviceStatus='error';
        state.deviceReason=String((data&&data.reason)||'device_registration_failed');
        state.deviceError=String((data&&((data.error)||(data.message)))||('http_'+response.status));
        renderBadge();
        return snapshot();
      }

      const registered=Boolean(data&&data.ok===true&&data.registered===true);
      state.deviceStatus=registered?'authorized':'denied';
      state.deviceReason=String((data&&((data.error)||(data.device_status)||(data.reason)))||'');
      state.deviceError=registered?'':String((data&&data.error)||'device_registration_denied');
      renderBadge();
      return snapshot();
    }catch(e){
      state.deviceStatus='error';
      state.deviceCheckedAt=new Date().toISOString();
      state.deviceReason='device_registration_exception';
      state.deviceError=String(e&&e.message||e||'device_registration_exception');
      renderBadge();
      return snapshot();
    }finally{
      deviceInFlight=false;
    }
  }

  async function check(){
    if(checkInFlight)return snapshot();

    const cfg=window.MDM_BACKEND_CONFIG;
    if(!cfg||!cfg.enabled||!cfg.endpoint||!cfg.publishableKey){
      state.status='config_unavailable';
      state.error='config_unavailable';
      state.authorized=null;
      renderBadge();
      return snapshot();
    }

    const session=readSession();
    const token=String(session&&session.accessToken||'');
    const userId=String(session&&session.user&&session.user.id||'');
    const expiresAt=Number(session&&session.expiresAt||0);

    if(!token||!userId||String(session&&session.status||'')!=='authenticated'){
      state.status='signed_out';
      state.checkedAt=new Date().toISOString();
      state.authorized=null;
      state.reason='authentication_required';
      state.error='';
      state.deviceStatus='not_checked';
      renderBadge();
      return snapshot();
    }

    if(expiresAt>0&&expiresAt<=Date.now()){
      state.status='session_expired';
      state.checkedAt=new Date().toISOString();
      state.authorized=null;
      state.reason='session_expired';
      state.error='';
      state.deviceStatus='not_checked';
      renderBadge();
      return snapshot();
    }

    const fingerprint=authFingerprint(session);
    if(fingerprint&&fingerprint===lastAuthFingerprint&&state.checkedAt)return snapshot();

    state.status='checking';
    state.error='';
    renderBadge();
    checkInFlight=true;

    try{
      const response=await fetch(
        String(cfg.endpoint).replace(/\/$/,'')+'/rest/v1/rpc/mdm_check_my_pilot_entitlement',
        {
          method:'POST',
          headers:{
            'Content-Type':'application/json',
            'apikey':cfg.publishableKey,
            'Authorization':'Bearer '+token
          },
          body:'{}',
          cache:'no-store'
        }
      );

      const body=await response.text();
      let data={};
      try{data=body?JSON.parse(body):{}}catch(_){}
      if(Array.isArray(data))data=data[0]||{};

      state.checkedAt=new Date().toISOString();

      if(!response.ok){
        state.status='error';
        state.authorized=null;
        state.reason='entitlement_check_failed';
        state.error=String((data&&((data.error)||(data.message)))||('http_'+response.status));
        state.deviceStatus='not_checked';
        renderBadge();
        return snapshot();
      }

      lastAuthFingerprint=fingerprint;
      state.authorized=data&&data.authorized===true;
      state.status=state.authorized?'authorized':'unauthorized';
      state.reason=String(data&&data.reason||'');
      state.error='';
      state.deviceStatus=state.authorized?'queued':'not_checked';
      renderBadge();

      if(state.authorized)await registerDevice(session);
      return snapshot();
    }catch(e){
      state.status='error';
      state.checkedAt=new Date().toISOString();
      state.authorized=null;
      state.reason='entitlement_check_exception';
      state.error=String(e&&e.message||e||'entitlement_check_exception');
      state.deviceStatus='not_checked';
      renderBadge();
      return snapshot();
    }finally{
      checkInFlight=false;
    }
  }

  function checkWhenAuthReady(){
    try{
      const session=readSession();
      if(authFingerprint(session))check();
    }catch(_){}
  }

  function resetSignedOutState(){
    lastAuthFingerprint='';
    state.status='signed_out';
    state.checkedAt=new Date().toISOString();
    state.authorized=null;
    state.reason='authentication_required';
    state.error='';
    state.deviceStatus='not_checked';
    state.deviceReason='';
    state.deviceError='';
    state.deviceCheckedAt='';
    renderBadge();
  }

  try{
    const originalSetItem=Storage.prototype.setItem;
    const originalRemoveItem=Storage.prototype.removeItem;
    const originalClear=Storage.prototype.clear;
    if(!Storage.prototype.__mdmPilotAuthHook4583146){
      Object.defineProperty(Storage.prototype,'__mdmPilotAuthHook4583146',{value:true,configurable:false,enumerable:false,writable:false});
      Storage.prototype.setItem=function(key,value){
        const result=originalSetItem.apply(this,arguments);
        try{
          if(this===localStorage&&String(key)===AUTH_KEY){
            const parsed=JSON.parse(String(value||'{}'));
            if(authFingerprint(parsed))Promise.resolve().then(checkWhenAuthReady);
            else resetSignedOutState();
          }
        }catch(_){}
        return result;
      };
      Storage.prototype.removeItem=function(key){
        const result=originalRemoveItem.apply(this,arguments);
        try{if(this===localStorage&&String(key)===AUTH_KEY)resetSignedOutState();}catch(_){}
        return result;
      };
      Storage.prototype.clear=function(){
        const result=originalClear.apply(this,arguments);
        try{if(this===localStorage)resetSignedOutState();}catch(_){}
        return result;
      };
    }
  }catch(_){}

  window.MDM_PILOT_ACCESS_BRIDGE=Object.freeze({
    version:'45.8.31.46',
    mode:'shadow',
    getState:snapshot,
    check:check
  });

  check();
})();
