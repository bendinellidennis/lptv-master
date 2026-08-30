/* Malta Driving Master 45.8.31.49.6 — Direct Registration Icon + Password Recovery
   The account/registration icon mounts directly in the real app header before Language.
   No dependency on Home mount adapters. No existing Home graphics are modified.
   No enforcement changes. No credential storage. No polling. No MutationObserver. */
(function(){
  'use strict';
  if(window.MDM_ACCOUNT_ENTRY_BRIDGE)return;

  const AUTH_KEY='mdm_auth_session_v4410';
  const VERSION='45.8.31.49.6';

  function t(it,en,mt){
    try{const raw=localStorage.getItem('mdm-v1-settings');const lang=raw?String(JSON.parse(raw).lang||'en'):'en';return lang==='it'?it:lang==='mt'?mt:en;}catch(_){return en;}
  }
  function readSession(){
    try{const raw=localStorage.getItem(AUTH_KEY);if(!raw)return null;const s=JSON.parse(raw);if(!s||s.status!=='authenticated'||!s.accessToken||!s.user?.id)return null;if(Number(s.expiresAt||0)>0&&Number(s.expiresAt)<=Date.now())return null;return s;}catch(_){return null;}
  }
  function openProfile(){const nav=document.querySelector('[data-nav="profile"]');if(nav){nav.click();return true;}return false;}
  function closeMenu(){const menu=document.getElementById('mdmAccountQuickMenu');if(menu)menu.remove();}

  function showMenu(){
    closeMenu();const session=readSession();const menu=document.createElement('div');menu.id='mdmAccountQuickMenu';
    menu.style.cssText='position:fixed;inset:0;z-index:999998;background:rgba(2,12,20,.44);display:flex;align-items:flex-start;justify-content:flex-end;padding:78px 14px 14px';
    menu.innerHTML=`<div style="width:min(320px,calc(100vw - 28px));background:var(--card,#fff);color:inherit;border-radius:18px;padding:12px;box-shadow:0 18px 55px rgba(0,0,0,.24)"><div style="display:flex;align-items:center;justify-content:space-between;gap:10px;margin-bottom:10px"><strong>👤 ${t('Account','Account','Kont')}</strong><button id="mdmAccountQuickClose" type="button" aria-label="Close" style="border:0;background:transparent;font-size:22px;color:inherit;line-height:1">×</button></div><button id="mdmAccountQuickOpen" class="btn" type="button" style="width:100%">${session?t('Il mio account','My account','Il-kont tiegħi'):t('Accedi / Registrati','Sign in / Register','Idħol / Irreġistra')}</button><button id="mdmAccountQuickRecovery" class="btn secondary" type="button" style="width:100%;margin-top:8px">🔑 ${t('Password dimenticata?','Forgot password?','Insejt il-password?')}</button></div>`;
    document.body.appendChild(menu);menu.querySelector('#mdmAccountQuickClose').onclick=closeMenu;menu.addEventListener('click',e=>{if(e.target===menu)closeMenu();});menu.querySelector('#mdmAccountQuickOpen').onclick=()=>{closeMenu();openProfile();};menu.querySelector('#mdmAccountQuickRecovery').onclick=()=>{closeMenu();showRecovery();};
  }

  function showRecovery(){
    let modal=document.getElementById('mdmAccountRecoveryModal');if(modal)return;
    modal=document.createElement('div');modal.id='mdmAccountRecoveryModal';modal.style.cssText='position:fixed;inset:0;z-index:999999;background:rgba(2,12,20,.68);display:flex;align-items:center;justify-content:center;padding:18px';
    modal.innerHTML=`<div style="width:min(430px,100%);background:var(--card,#fff);color:inherit;border-radius:18px;padding:18px;box-shadow:0 20px 60px rgba(0,0,0,.28)"><div style="display:flex;align-items:center;justify-content:space-between;gap:12px"><strong>🔑 ${t('Recupera password','Recover password','Irkupra l-password')}</strong><button id="mdmAccountRecoveryClose" type="button" style="border:0;background:transparent;font-size:22px;color:inherit">×</button></div><p style="font-size:12px;opacity:.76;line-height:1.45">${t('Inserisci l’e-mail usata per l’account. Riceverai un link sicuro per impostare una nuova password.','Enter the email used for the account. You will receive a secure link to set a new password.','Daħħal l-email użata għall-kont. Tirċievi link sigur biex tissettja password ġdida.')}</p><input id="mdmAccountRecoveryEmail" type="email" autocomplete="email" inputmode="email" placeholder="Email" style="box-sizing:border-box;width:100%;padding:11px;border:1px solid rgba(0,0,0,.18);border-radius:10px;background:var(--card,#fff);color:inherit"><button id="mdmAccountRecoverySend" class="btn" type="button" style="margin-top:9px;width:100%">${t('Invia link di recupero','Send recovery link','Ibgħat link ta’ rkupru')}</button><div id="mdmAccountRecoveryResult" style="display:none;margin-top:10px;padding:10px;border-radius:10px;background:rgba(0,0,0,.05);font-size:12px"></div></div>`;
    document.body.appendChild(modal);modal.querySelector('#mdmAccountRecoveryClose').onclick=()=>modal.remove();modal.addEventListener('click',e=>{if(e.target===modal)modal.remove();});modal.querySelector('#mdmAccountRecoverySend').onclick=sendRecovery;
  }

  async function sendRecovery(){
    const input=document.getElementById('mdmAccountRecoveryEmail'),out=document.getElementById('mdmAccountRecoveryResult'),btn=document.getElementById('mdmAccountRecoverySend');if(!input||!out||!btn)return;const email=String(input.value||'').trim().toLowerCase();out.style.display='block';if(!/^\S+@\S+\.\S+$/.test(email)){out.textContent='❌ '+t('Inserisci un’e-mail valida.','Enter a valid email.','Daħħal email valida.');return;}const cfg=window.MDM_BACKEND_CONFIG;if(!cfg||!cfg.enabled||!cfg.endpoint||!cfg.publishableKey){out.textContent='❌ backend_config_unavailable';return;}btn.disabled=true;out.textContent=t('Invio in corso…','Sending…','Qed jintbagħat…');
    try{const response=await fetch(String(cfg.endpoint).replace(/\/$/,'')+'/auth/v1/recover',{method:'POST',headers:{'Content-Type':'application/json','apikey':cfg.publishableKey,'Authorization':'Bearer '+cfg.publishableKey},body:JSON.stringify({email}),cache:'no-store'});if(!response.ok){let data={};try{data=await response.json();}catch(_){}throw new Error(String(data?.msg||data?.message||data?.error_description||data?.error||('http_'+response.status)));}out.textContent='✅ '+t('Se l’e-mail è registrata, riceverai il link per reimpostare la password.','If the email is registered, you will receive the password-reset link.','Jekk l-email hija rreġistrata, tirċievi l-link biex tirrisettja l-password.');}catch(e){out.textContent='❌ '+String(e?.message||e||'recovery_failed');}finally{btn.disabled=false;}
  }

  function mount(){
    const header=document.querySelector('.app-header');const lang=document.getElementById('langBtn');if(!header||!lang)return false;
    let wrap=document.getElementById('mdmQuickAccountEntry');
    if(!wrap){
      wrap=document.createElement('div');wrap.id='mdmQuickAccountEntry';
      const button=document.createElement('button');button.id='mdmQuickAccountIcon';button.type='button';button.setAttribute('aria-label',t('Registrati / Account','Register / Account','Irreġistra / Kont'));button.title=t('Registrati / Account','Register / Account','Irreġistra / Kont');
      button.innerHTML='<svg viewBox="0 0 24 24" width="28" height="28" aria-hidden="true"><path fill="currentColor" d="M15 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4ZM7 10V7H5v3H2v2h3v3h2v-3h3v-2H7Zm8 4c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4Z"/></svg>';
      button.onclick=showMenu;wrap.appendChild(button);
    }
    wrap.style.cssText='display:flex!important;align-items:center;justify-content:center;width:56px;height:56px;flex:0 0 56px;margin:0 8px 0 0;position:relative;z-index:6';
    const button=wrap.querySelector('#mdmQuickAccountIcon');if(button)button.style.cssText='display:flex!important;width:56px;height:56px;border:1px solid rgba(255,255,255,.22);border-radius:16px;background:rgba(255,255,255,.10);align-items:center;justify-content:center;padding:0;color:#fff;box-shadow:none;line-height:1;-webkit-tap-highlight-color:transparent';
    if(wrap.parentElement!==header||wrap.nextElementSibling!==lang)header.insertBefore(wrap,lang);
    return !!document.querySelector('.app-header #mdmQuickAccountEntry #mdmQuickAccountIcon');
  }

  function refresh(){const old=document.getElementById('mdmQuickAccountEntry');if(old)old.remove();closeMenu();return mount();}
  window.addEventListener('pageshow',mount);window.addEventListener('load',mount,{once:true});document.addEventListener('visibilitychange',()=>{if(!document.hidden)mount();});
  window.MDM_ACCOUNT_ENTRY_BRIDGE=Object.freeze({version:VERSION,mount,refresh,showRecovery,showMenu});
  mount();
})();
