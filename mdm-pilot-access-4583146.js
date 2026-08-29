/* Malta Driving Master 45.8.31.46 — Pilot Access Shadow Bridge
   Uses the existing verified MDM auth session key.
   One entitlement RPC at startup. No observers, no repeated timers, no enforcement. */
(function(){
  'use strict';

  if (window.MDM_PILOT_ACCESS_BRIDGE) return;

  const AUTH_KEY='mdm_auth_session_v4410';
  const state={
    version:'45.8.31.46',
    mode:'shadow',
    enforcement:false,
    status:'ready',
    checkedAt:'',
    authorized:null,
    reason:'',
    error:''
  };

  function snapshot(){return Object.assign({},state)}

  function renderBadge(){
    try{
      let el=document.getElementById('mdmPilotShadowBadge');
      if(!el){
        el=document.createElement('div');
        el.id='mdmPilotShadowBadge';
        el.setAttribute('aria-live','polite');
        el.style.cssText='position:fixed;z-index:9999;right:10px;top:calc(8px + env(safe-area-inset-top));max-width:78vw;padding:7px 10px;border-radius:10px;background:rgba(6,26,43,.90);color:#fff;font:700 10px/1.25 system-ui;letter-spacing:.01em;pointer-events:none;opacity:.94';
        document.body.appendChild(el);
      }
      const auth=state.authorized===true?'AUTHORIZED':state.authorized===false?'NO ACTIVE LICENSE':'PENDING';
      el.textContent='Pilot 45.8.31.46 · '+String(state.status||'ready').toUpperCase()+' · '+auth;
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

  async function check(){
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
      renderBadge();
      return snapshot();
    }

    if(expiresAt>0&&expiresAt<=Date.now()){
      state.status='session_expired';
      state.checkedAt=new Date().toISOString();
      state.authorized=null;
      state.reason='session_expired';
      state.error='';
      renderBadge();
      return snapshot();
    }

    state.status='checking';
    state.error='';
    renderBadge();

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
        renderBadge();
        return snapshot();
      }

      state.authorized=data&&data.authorized===true;
      state.status=state.authorized?'authorized':'unauthorized';
      state.reason=String(data&&data.reason||'');
      state.error='';
      renderBadge();
      return snapshot();
    }catch(e){
      state.status='error';
      state.checkedAt=new Date().toISOString();
      state.authorized=null;
      state.reason='entitlement_check_exception';
      state.error=String(e&&e.message||e||'entitlement_check_exception');
      renderBadge();
      return snapshot();
    }
  }

  window.MDM_PILOT_ACCESS_BRIDGE=Object.freeze({
    version:'45.8.31.46',
    mode:'shadow',
    getState:snapshot,
    check:check
  });

  check();
})();
