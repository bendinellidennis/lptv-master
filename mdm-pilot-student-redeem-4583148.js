/* Malta Driving Master 45.8.31.48 — Pilot Student Redeem Shadow Bridge
   Authenticated student-side redeem UI for real Pilot invitations.
   No seat assignment. No enforcement. No polling. No MutationObserver. */
(function(){
  'use strict';
  if(window.MDM_PILOT_STUDENT_REDEEM_BRIDGE)return;

  const AUTH_KEY='mdm_auth_session_v4410';
  const state={version:'45.8.31.48',mode:'shadow',enforcement:false,status:'ready',lastResult:null,error:''};

  function lang3(it,en,mt){
    try{
      const raw=localStorage.getItem('mdm-v1-settings');
      const code=raw?String(JSON.parse(raw).lang||'en'):'en';
      return code==='it'?it:code==='mt'?mt:en;
    }catch(_){return en}
  }

  function readSession(){
    try{
      const raw=localStorage.getItem(AUTH_KEY);
      if(!raw)return null;
      const s=JSON.parse(raw);
      if(!s||s.status!=='authenticated'||!s.accessToken||!s.user?.id)return null;
      if(Number(s.expiresAt||0)>0&&Number(s.expiresAt)<=Date.now())return null;
      return s;
    }catch(_){return null}
  }

  async function rpc(name,payload){
    const cfg=window.MDM_BACKEND_CONFIG;
    const session=readSession();
    if(!cfg||!cfg.enabled||!cfg.endpoint||!cfg.publishableKey)throw new Error('backend_config_unavailable');
    if(!session)throw new Error('authentication_required');
    const response=await fetch(String(cfg.endpoint).replace(/\/$/,'')+'/rest/v1/rpc/'+name,{
      method:'POST',
      headers:{'Content-Type':'application/json','apikey':cfg.publishableKey,'Authorization':'Bearer '+session.accessToken},
      body:JSON.stringify(payload||{}),cache:'no-store'
    });
    const text=await response.text();
    let data={};
    try{data=text?JSON.parse(text):{}}catch(_){}
    if(Array.isArray(data))data=data[0]||{};
    if(!response.ok)throw new Error(String(data?.message||data?.error||('http_'+response.status)));
    return data||{};
  }

  function findHost(){
    return document.querySelector('.account-enroll-card') || document.querySelector('main') || document.body;
  }

  function renderPanel(){
    const session=readSession();
    if(!session)return false;
    if(document.getElementById('mdmPilotStudentRedeemPanel'))return true;

    const host=findHost();
    if(!host)return false;

    const panel=document.createElement('div');
    panel.id='mdmPilotStudentRedeemPanel';
    panel.style.cssText='margin-top:14px;padding:14px;border:1px solid rgba(45,125,255,.22);border-radius:14px;background:rgba(45,125,255,.05)';
    panel.innerHTML=`
      <div style="display:flex;gap:10px;align-items:flex-start;justify-content:space-between;flex-wrap:wrap">
        <div><strong>🎓 ${lang3('Riscatta invito Pilot','Redeem Pilot invitation','Uża stedina Pilot')}</strong>
        <p style="margin:6px 0 0;opacity:.78;font-size:12px">${lang3('Usa il token ricevuto dalla scuola. L’email dell’account autenticato deve coincidere con quella invitata.','Use the token received from the school. The authenticated account email must match the invited email.','Uża t-token mill-iskola. L-email tal-kont awtentikat trid taqbel mal-email mistiedna.')}</p></div>
        <span style="font-size:10px;font-weight:800;padding:5px 8px;border-radius:999px;background:#132d46;color:#fff">SHADOW · ENFORCEMENT OFF</span>
      </div>
      <textarea id="mdmPilotRedeemToken" rows="3" autocomplete="off" autocapitalize="off" spellcheck="false" placeholder="${lang3('Incolla qui il token monouso','Paste the one-time token here','Waħħal it-token ta’ darba hawn')}" style="box-sizing:border-box;width:100%;margin-top:12px;padding:11px;border:1px solid rgba(0,0,0,.18);border-radius:10px;background:var(--card,#fff);color:inherit;resize:vertical"></textarea>
      <button id="mdmPilotRedeemButton" class="btn" type="button" style="margin-top:9px;width:100%">${lang3('Riscatta invito Pilot','Redeem Pilot invitation','Uża stedina Pilot')}</button>
      <div id="mdmPilotRedeemResult" style="display:none;margin-top:10px;padding:10px;border-radius:10px;background:rgba(0,0,0,.05);font-size:12px;word-break:break-word"></div>`;

    host.appendChild(panel);
    panel.querySelector('#mdmPilotRedeemButton').onclick=redeem;
    return true;
  }

  async function redeem(){
    const tokenEl=document.getElementById('mdmPilotRedeemToken');
    const result=document.getElementById('mdmPilotRedeemResult');
    const button=document.getElementById('mdmPilotRedeemButton');
    if(!tokenEl||!result||!button)return;

    const token=String(tokenEl.value||'').trim();
    result.style.display='block';
    if(token.length<32||token.length>256){
      result.textContent='❌ '+lang3('Token non valido.','Invalid token.','Token mhux validu.');
      return;
    }

    button.disabled=true;
    state.status='redeeming';state.error='';state.lastResult=null;
    result.textContent=lang3('Riscatto invito in corso…','Redeeming invitation…','Qed tintuża l-istedina…');

    try{
      const data=await rpc('mdm_redeem_pilot_invitation',{p_invite_token:token});
      if(data?.ok!==true||data?.redeemed!==true)throw new Error(String(data?.error||'redeem_failed'));
      state.status='redeemed';
      state.lastResult={invitationId:String(data.invitation_id||''),licenseId:String(data.license_id||''),schoolId:String(data.school_id||''),seatAssigned:Boolean(data.seat_assigned),nextStep:String(data.next_step||'')};
      tokenEl.value='';
      result.innerHTML=`<strong>✅ ${lang3('Invito riscattato','Invitation redeemed','Stedina użata')}</strong><br><br><b>ID:</b> ${state.lastResult.invitationId}<br><b>${lang3('Seat assegnato','Seat assigned','Seat assenjat')}:</b> ${state.lastResult.seatAssigned?'YES':'NO'}<br><b>${lang3('Prossimo step','Next step','Pass li jmiss')}:</b> ${state.lastResult.nextStep||'—'}`;
    }catch(e){
      state.status='error';state.error=String(e?.message||e||'redeem_failed');
      result.textContent='❌ '+state.error;
    }finally{button.disabled=false;}
  }

  window.MDM_PILOT_STUDENT_REDEEM_BRIDGE=Object.freeze({version:'45.8.31.48',mode:'shadow',mount:renderPanel,getState:()=>JSON.parse(JSON.stringify(state))});
  window.addEventListener('pageshow',()=>{try{renderPanel()}catch(_){};});
  document.addEventListener('visibilitychange',()=>{if(!document.hidden){try{renderPanel()}catch(_){}}});
  try{renderPanel()}catch(_){}
})();
