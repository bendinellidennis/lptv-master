/* Malta Driving Master 45.8.31.49 — Quick Account Entry + Password Recovery
   Makes account access obvious from the main UI and adds a Supabase password-reset flow.
   No enforcement changes. No credential storage. No polling. No MutationObserver. */
(function(){
  'use strict';
  if(window.MDM_ACCOUNT_ENTRY_BRIDGE)return;

  const AUTH_KEY='mdm_auth_session_v4410';
  const VERSION='45.8.31.49';

  function t(it,en,mt){
    try{
      const raw=localStorage.getItem('mdm-v1-settings');
      const lang=raw?String(JSON.parse(raw).lang||'en'):'en';
      return lang==='it'?it:lang==='mt'?mt:en;
    }catch(_){return en;}
  }

  function readSession(){
    try{
      const raw=localStorage.getItem(AUTH_KEY);
      if(!raw)return null;
      const s=JSON.parse(raw);
      if(!s||s.status!=='authenticated'||!s.accessToken||!s.user?.id)return null;
      if(Number(s.expiresAt||0)>0&&Number(s.expiresAt)<=Date.now())return null;
      return s;
    }catch(_){return null;}
  }

  function openProfile(){
    const nav=document.querySelector('[data-nav="profile"]');
    if(nav){nav.click();return true;}
    return false;
  }

  function showRecovery(){
    let modal=document.getElementById('mdmAccountRecoveryModal');
    if(!modal){
      modal=document.createElement('div');
      modal.id='mdmAccountRecoveryModal';
      modal.style.cssText='position:fixed;inset:0;z-index:999999;background:rgba(2,12,20,.68);display:flex;align-items:center;justify-content:center;padding:18px';
      modal.innerHTML=`<div style="width:min(430px,100%);background:var(--card,#fff);color:inherit;border-radius:18px;padding:18px;box-shadow:0 20px 60px rgba(0,0,0,.28)">
        <div style="display:flex;align-items:center;justify-content:space-between;gap:12px"><strong>🔑 ${t('Recupera password','Recover password','Irkupra l-password')}</strong><button id="mdmAccountRecoveryClose" type="button" style="border:0;background:transparent;font-size:22px;color:inherit">×</button></div>
        <p style="font-size:12px;opacity:.76;line-height:1.45">${t('Inserisci l’e-mail usata per l’account. Riceverai un link sicuro per impostare una nuova password.','Enter the email used for the account. You will receive a secure link to set a new password.','Daħħal l-email użata għall-kont. Tirċievi link sigur biex tissettja password ġdida.')}</p>
        <input id="mdmAccountRecoveryEmail" type="email" autocomplete="email" inputmode="email" placeholder="Email" style="box-sizing:border-box;width:100%;padding:11px;border:1px solid rgba(0,0,0,.18);border-radius:10px;background:var(--card,#fff);color:inherit">
        <button id="mdmAccountRecoverySend" class="btn" type="button" style="margin-top:9px;width:100%">${t('Invia link di recupero','Send recovery link','Ibgħat link ta’ rkupru')}</button>
        <div id="mdmAccountRecoveryResult" style="display:none;margin-top:10px;padding:10px;border-radius:10px;background:rgba(0,0,0,.05);font-size:12px"></div>
      </div>`;
      document.body.appendChild(modal);
      modal.querySelector('#mdmAccountRecoveryClose').onclick=()=>modal.remove();
      modal.addEventListener('click',e=>{if(e.target===modal)modal.remove();});
      modal.querySelector('#mdmAccountRecoverySend').onclick=sendRecovery;
    }
  }

  async function sendRecovery(){
    const input=document.getElementById('mdmAccountRecoveryEmail');
    const out=document.getElementById('mdmAccountRecoveryResult');
    const btn=document.getElementById('mdmAccountRecoverySend');
    if(!input||!out||!btn)return;
    const email=String(input.value||'').trim().toLowerCase();
    out.style.display='block';
    if(!/^\S+@\S+\.\S+$/.test(email)){out.textContent='❌ '+t('Inserisci un’e-mail valida.','Enter a valid email.','Daħħal email valida.');return;}
    const cfg=window.MDM_BACKEND_CONFIG;
    if(!cfg||!cfg.enabled||!cfg.endpoint||!cfg.publishableKey){out.textContent='❌ backend_config_unavailable';return;}
    btn.disabled=true;out.textContent=t('Invio in corso…','Sending…','Qed jintbagħat…');
    try{
      const response=await fetch(String(cfg.endpoint).replace(/\/$/,'')+'/auth/v1/recover',{
        method:'POST',headers:{'Content-Type':'application/json','apikey':cfg.publishableKey,'Authorization':'Bearer '+cfg.publishableKey},
        body:JSON.stringify({email}),cache:'no-store'
      });
      if(!response.ok){let data={};try{data=await response.json();}catch(_){};throw new Error(String(data?.msg||data?.message||data?.error_description||data?.error||('http_'+response.status)));}
      out.textContent='✅ '+t('Se l’e-mail è registrata, riceverai il link per reimpostare la password.','If the email is registered, you will receive the password-reset link.','Jekk l-email hija rreġistrata, tirċievi l-link biex tirrisettja l-password.');
    }catch(e){out.textContent='❌ '+String(e?.message||e||'recovery_failed');}
    finally{btn.disabled=false;}
  }

  function mount(){
    if(document.getElementById('mdmQuickAccountEntry'))return true;
    const welcome=document.querySelector('.premium-home-welcome');
    const header=document.querySelector('header');
    const host=welcome||header||document.body;
    if(!host)return false;

    const wrap=document.createElement('div');
    wrap.id='mdmQuickAccountEntry';
    wrap.style.cssText=welcome?'display:flex;gap:8px;flex-wrap:wrap;margin-top:12px':'position:fixed;right:12px;top:12px;z-index:99998;display:flex;gap:7px;flex-wrap:wrap;justify-content:flex-end';
    const session=readSession();
    const main=document.createElement('button');
    main.type='button';main.className='btn';
    main.textContent=session?t('Il mio account','My account','Il-kont tiegħi'):t('Accedi / Registrati','Sign in / Register','Idħol / Irreġistra');
    main.onclick=openProfile;
    wrap.appendChild(main);

    if(!session){
      const recover=document.createElement('button');
      recover.type='button';recover.className='btn secondary';
      recover.textContent=t('Password dimenticata?','Forgot password?','Insejt il-password?');
      recover.onclick=showRecovery;
      wrap.appendChild(recover);
    }
    host.appendChild(wrap);
    return true;
  }

  function refresh(){
    const old=document.getElementById('mdmQuickAccountEntry');
    if(old)old.remove();
    mount();
  }

  document.addEventListener('click',()=>{try{mount();}catch(_){};},false);
  window.addEventListener('pageshow',()=>{try{mount();}catch(_){};});
  document.addEventListener('visibilitychange',()=>{if(!document.hidden){try{mount();}catch(_){}}});
  window.MDM_ACCOUNT_ENTRY_BRIDGE=Object.freeze({version:VERSION,mount,refresh,showRecovery});
  try{mount();}catch(_){}
})();
