/* Malta Driving Master 45.8.31.48.3 — Student-only deterministic Pilot Redeem Shadow Bridge
   Shows redeem only to authenticated users who are NOT already Pilot-authorized.
   Waits for the real Pilot entitlement result before deciding visibility, so first load is deterministic.
   Licensed school/admin accounts never see the student redeem control.
   Compact UI only. No seat assignment. No enforcement. No polling. No MutationObserver. */
(function(){
  'use strict';
  if(window.MDM_PILOT_STUDENT_REDEEM_BRIDGE)return;

  const AUTH_KEY='mdm_auth_session_v4410';
  const state={version:'45.8.31.48.3',mode:'shadow',enforcement:false,status:'ready',lastResult:null,error:''};
  let visibilityInFlight=false;

  function lang3(it,en,mt){
    try{const raw=localStorage.getItem('mdm-v1-settings');const code=raw?String(JSON.parse(raw).lang||'en'):'en';return code==='it'?it:code==='mt'?mt:en;}catch(_){return en}
  }

  function readSession(){
    try{const raw=localStorage.getItem(AUTH_KEY);if(!raw)return null;const s=JSON.parse(raw);if(!s||s.status!=='authenticated'||!s.accessToken||!s.user?.id)return null;if(Number(s.expiresAt||0)>0&&Number(s.expiresAt)<=Date.now())return null;return s;}catch(_){return null}
  }

  async function rpc(name,payload){
    const cfg=window.MDM_BACKEND_CONFIG;const session=readSession();
    if(!cfg||!cfg.enabled||!cfg.endpoint||!cfg.publishableKey)throw new Error('backend_config_unavailable');
    if(!session)throw new Error('authentication_required');
    const response=await fetch(String(cfg.endpoint).replace(/\/$/,'')+'/rest/v1/rpc/'+name,{method:'POST',headers:{'Content-Type':'application/json','apikey':cfg.publishableKey,'Authorization':'Bearer '+session.accessToken},body:JSON.stringify(payload||{}),cache:'no-store'});
    const text=await response.text();let data={};try{data=text?JSON.parse(text):{}}catch(_){}if(Array.isArray(data))data=data[0]||{};
    if(!response.ok)throw new Error(String(data?.message||data?.error||('http_'+response.status)));return data||{};
  }

  function pilotState(){
    try{return window.MDM_PILOT_ACCESS_BRIDGE&&typeof window.MDM_PILOT_ACCESS_BRIDGE.getState==='function'?window.MDM_PILOT_ACCESS_BRIDGE.getState():null;}catch(_){return null;}
  }

  function removePanel(){const old=document.getElementById('mdmPilotStudentRedeemPanel');if(old)old.remove();}

  function findHost(){return document.querySelector('.hm30')||document.querySelector('main')||document.body;}

  function renderPanel(){
    const session=readSession();
    if(!session){removePanel();return false;}

    const ps=pilotState();
    if(!ps||ps.authorized!==false){removePanel();return false;}

    if(document.getElementById('mdmPilotStudentRedeemPanel'))return true;
    const host=findHost();if(!host)return false;

    const panel=document.createElement('div');
    panel.id='mdmPilotStudentRedeemPanel';
    panel.style.cssText='margin:12px 0;padding:12px;border:1px solid rgba(45,125,255,.20);border-radius:14px;background:rgba(45,125,255,.045)';
    panel.innerHTML=`<div style="display:flex;align-items:center;justify-content:space-between;gap:10px"><div style="min-width:0"><strong style="display:block;font-size:14px">🎓 ${lang3('Hai un invito dalla scuola?','Invitation from your school?','Għandek stedina mill-iskola?')}</strong><span style="display:block;margin-top:3px;opacity:.72;font-size:11px;line-height:1.3">${lang3('Inserisci il token ricevuto per collegare il tuo account.','Enter the token you received to connect your account.','Daħħal it-token li rċevejt biex torbot il-kont tiegħek.')}</span></div><button id="mdmPilotRedeemOpen" class="btn" type="button" style="flex:0 0 auto;padding:9px 12px;min-height:38px">${lang3('Riscatta','Redeem','Uża')}</button></div><div id="mdmPilotRedeemCompactForm" style="display:none;margin-top:10px"><textarea id="mdmPilotRedeemToken" rows="2" autocomplete="off" autocapitalize="off" spellcheck="false" placeholder="${lang3('Token monouso','One-time token','Token ta’ darba')}" style="box-sizing:border-box;width:100%;padding:9px;border:1px solid rgba(0,0,0,.16);border-radius:10px;background:var(--card,#fff);color:inherit;resize:vertical"></textarea><button id="mdmPilotRedeemButton" class="btn" type="button" style="margin-top:7px;width:100%">${lang3('Conferma invito','Confirm invitation','Ikkonferma l-istedina')}</button><div id="mdmPilotRedeemResult" style="display:none;margin-top:8px;padding:9px;border-radius:9px;background:rgba(0,0,0,.05);font-size:11px;word-break:break-word"></div></div>`;
    host.insertBefore(panel,host.firstChild||null);
    panel.querySelector('#mdmPilotRedeemOpen').onclick=()=>{const form=panel.querySelector('#mdmPilotRedeemCompactForm');if(form)form.style.display=form.style.display==='none'?'block':'none';};
    panel.querySelector('#mdmPilotRedeemButton').onclick=redeem;
    return true;
  }

  async function syncVisibility(){
    if(visibilityInFlight)return;
    const session=readSession();
    if(!session){removePanel();return;}
    visibilityInFlight=true;
    try{
      const bridge=window.MDM_PILOT_ACCESS_BRIDGE;
      if(bridge&&typeof bridge.check==='function'){
        try{await bridge.check();}catch(_){}
      }
      renderPanel();
    }finally{visibilityInFlight=false;}
  }

  function scheduleMount(){
    try{queueMicrotask(syncVisibility);}catch(_){syncVisibility();}
    try{requestAnimationFrame(()=>{syncVisibility();});}catch(_){}
    setTimeout(syncVisibility,120);
  }

  async function redeem(){
    const tokenEl=document.getElementById('mdmPilotRedeemToken'),result=document.getElementById('mdmPilotRedeemResult'),button=document.getElementById('mdmPilotRedeemButton');if(!tokenEl||!result||!button)return;
    const token=String(tokenEl.value||'').trim();result.style.display='block';
    if(token.length<32||token.length>256){result.textContent='❌ '+lang3('Token non valido.','Invalid token.','Token mhux validu.');return;}
    button.disabled=true;state.status='redeeming';state.error='';state.lastResult=null;result.textContent=lang3('Riscatto invito in corso…','Redeeming invitation…','Qed tintuża l-istedina…');
    try{
      const data=await rpc('mdm_redeem_pilot_invitation',{p_invite_token:token});
      if(data?.ok!==true||data?.redeemed!==true)throw new Error(String(data?.error||'redeem_failed'));
      state.status='redeemed';state.lastResult={invitationId:String(data.invitation_id||''),licenseId:String(data.license_id||''),schoolId:String(data.school_id||''),seatAssigned:Boolean(data.seat_assigned),nextStep:String(data.next_step||'')};tokenEl.value='';
      result.innerHTML=`<strong>✅ ${lang3('Invito riscattato','Invitation redeemed','Stedina użata')}</strong>`;
      await syncVisibility();
    }catch(e){state.status='error';state.error=String(e?.message||e||'redeem_failed');result.textContent='❌ '+state.error;}finally{button.disabled=false;}
  }

  const originalSetItem=Storage.prototype.setItem;
  if(!window.__MDM_PILOT_STUDENT_REDEEM_AUTH_HOOK__){
    window.__MDM_PILOT_STUDENT_REDEEM_AUTH_HOOK__=true;
    Storage.prototype.setItem=function(key,value){const result=originalSetItem.apply(this,arguments);if(this===localStorage&&key===AUTH_KEY){try{const s=JSON.parse(String(value||''));if(s&&s.status==='authenticated'&&s.accessToken&&s.user?.id)scheduleMount();}catch(_){}}return result;};
  }

  document.addEventListener('click',scheduleMount,false);
  window.addEventListener('pageshow',scheduleMount);
  window.addEventListener('load',scheduleMount,{once:true});
  document.addEventListener('visibilitychange',()=>{if(!document.hidden)scheduleMount();});
  window.MDM_PILOT_STUDENT_REDEEM_BRIDGE=Object.freeze({version:'45.8.31.48.3',mode:'shadow',mount:syncVisibility,getState:()=>JSON.parse(JSON.stringify(state))});
  scheduleMount();
})();
