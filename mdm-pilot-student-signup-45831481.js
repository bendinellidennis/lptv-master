/* Malta Driving Master 45.8.31.48.1 — Pilot Student Signup Bridge
   Creates a real Supabase Auth account for an invited student.
   No automatic seat assignment. No enforcement. No password storage. */
(function(){
  'use strict';
  if(window.MDM_PILOT_STUDENT_SIGNUP_BRIDGE)return;

  const AUTH_KEY='mdm_auth_session_v4410';
  const VERSION='45.8.31.48.2';
  const PENDING_KEY='mdm_pilot_pending_invite_v1';
  const state={version:VERSION,mode:'shadow',enforcement:false,status:'ready',error:''};

  function t(it,en,mt){
    try{
      const raw=localStorage.getItem('mdm-v1-settings');
      const lang=raw?String(JSON.parse(raw).lang||'en'):'en';
      return lang==='it'?it:lang==='mt'?mt:en;
    }catch(_){return en;}
  }

  function isAuthenticated(){
    try{
      const raw=localStorage.getItem(AUTH_KEY);
      if(!raw)return false;
      const s=JSON.parse(raw);
      return Boolean(s&&s.status==='authenticated'&&s.accessToken&&s.user?.id&&(!(Number(s.expiresAt)>0)||Number(s.expiresAt)>Date.now()));
    }catch(_){return false;}
  }

  function hasPendingInvite(){
    try{
      const raw=localStorage.getItem(PENDING_KEY);
      if(!raw)return false;
      const p=JSON.parse(raw);
      return Boolean(p&&String(p.token||'').length>=32&&Date.now()-Number(p.at||0)<=7*24*60*60*1000);
    }catch(_){return false;}
  }

  function removePanel(){
    try{document.getElementById('mdmPilotStudentSignupPanel')?.remove();}catch(_){}
  }

  function backend(){
    const cfg=window.MDM_BACKEND_CONFIG;
    if(!cfg||!cfg.enabled||!cfg.endpoint||!cfg.publishableKey)throw new Error('backend_config_unavailable');
    return {endpoint:String(cfg.endpoint).replace(/\/$/,''),key:String(cfg.publishableKey)};
  }

  function host(){
    return document.querySelector('.account-enroll-card') || document.querySelector('main') || document.body;
  }

  function render(){
    if(isAuthenticated()||!hasPendingInvite()){removePanel();return false;}
    if(document.getElementById('mdmPilotStudentSignupPanel'))return true;
    const root=host();
    if(!root)return false;

    const panel=document.createElement('div');
    panel.id='mdmPilotStudentSignupPanel';
    panel.style.cssText='margin-top:14px;padding:14px;border:1px solid rgba(45,125,255,.22);border-radius:14px;background:rgba(45,125,255,.05)';
    panel.innerHTML=`
      <div style="display:flex;gap:10px;align-items:flex-start;justify-content:space-between;flex-wrap:wrap">
        <div>
          <strong>👤 ${t('Registrazione studente Pilot','Pilot student registration','Reġistrazzjoni student Pilot')}</strong>
          <p style="margin:6px 0 0;opacity:.78;font-size:12px">${t('Crea l’account con la stessa email a cui la scuola ha inviato l’invito.','Create the account with the same email the school invited.','Oħloq il-kont bl-istess email li l-iskola stiednet.')}</p>
        </div>
        <span style="font-size:10px;font-weight:800;padding:5px 8px;border-radius:999px;background:#132d46;color:#fff">SHADOW · ENFORCEMENT OFF</span>
      </div>
      <input id="mdmPilotSignupEmail" type="email" autocomplete="email" inputmode="email" placeholder="Email" style="box-sizing:border-box;width:100%;margin-top:12px;padding:11px;border:1px solid rgba(0,0,0,.18);border-radius:10px;background:var(--card,#fff);color:inherit">
      <input id="mdmPilotSignupPassword" type="password" autocomplete="new-password" placeholder="${t('Password (minimo 8 caratteri)','Password (minimum 8 characters)','Password (minimu 8 karattri)')}" style="box-sizing:border-box;width:100%;margin-top:8px;padding:11px;border:1px solid rgba(0,0,0,.18);border-radius:10px;background:var(--card,#fff);color:inherit">
      <input id="mdmPilotSignupPassword2" type="password" autocomplete="new-password" placeholder="${t('Ripeti password','Repeat password','Irrepeti l-password')}" style="box-sizing:border-box;width:100%;margin-top:8px;padding:11px;border:1px solid rgba(0,0,0,.18);border-radius:10px;background:var(--card,#fff);color:inherit">
      <button id="mdmPilotSignupButton" class="btn" type="button" style="margin-top:9px;width:100%">${t('Crea account studente','Create student account','Oħloq kont ta’ student')}</button>
      <div id="mdmPilotSignupResult" style="display:none;margin-top:10px;padding:10px;border-radius:10px;background:rgba(0,0,0,.05);font-size:12px;word-break:break-word"></div>`;
    root.appendChild(panel);
    panel.querySelector('#mdmPilotSignupButton').onclick=signup;
    return true;
  }

  async function signup(){
    const emailEl=document.getElementById('mdmPilotSignupEmail');
    const passEl=document.getElementById('mdmPilotSignupPassword');
    const pass2El=document.getElementById('mdmPilotSignupPassword2');
    const btn=document.getElementById('mdmPilotSignupButton');
    const out=document.getElementById('mdmPilotSignupResult');
    if(!emailEl||!passEl||!pass2El||!btn||!out)return;

    const email=String(emailEl.value||'').trim().toLowerCase();
    const password=String(passEl.value||'');
    const password2=String(pass2El.value||'');
    out.style.display='block';

    if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)){
      out.textContent='❌ '+t('Email non valida.','Invalid email.','Email mhux valida.');return;
    }
    if(password.length<8){
      out.textContent='❌ '+t('La password deve avere almeno 8 caratteri.','Password must contain at least 8 characters.','Il-password trid ikollha mill-inqas 8 karattri.');return;
    }
    if(password!==password2){
      out.textContent='❌ '+t('Le password non coincidono.','Passwords do not match.','Il-passwords ma jaqblux.');return;
    }

    btn.disabled=true;
    state.status='creating';state.error='';
    out.textContent=t('Creazione account in corso…','Creating account…','Qed jinħoloq il-kont…');

    try{
      const cfg=backend();
      const r=await fetch(cfg.endpoint+'/auth/v1/signup',{
        method:'POST',
        headers:{'Content-Type':'application/json','apikey':cfg.key,'Authorization':'Bearer '+cfg.key},
        body:JSON.stringify({email,password}),
        cache:'no-store'
      });
      const text=await r.text();
      let data={};
      try{data=text?JSON.parse(text):{};}catch(_){}
      if(!r.ok){
        const msg=String(data?.msg||data?.message||data?.error_description||data?.error||('http_'+r.status));
        throw new Error(msg);
      }

      state.status='created';
      passEl.value='';pass2El.value='';
      const needsConfirm=!(data&&data.access_token);
      out.innerHTML=`<strong>✅ ${t('Account creato','Account created','Kont maħluq')}</strong><br><br>${needsConfirm?t('Se Supabase richiede la conferma email, apri il messaggio ricevuto e conferma l’indirizzo. Poi torna nell’app ed esegui il login.','If Supabase requires email confirmation, open the received message and confirm the address. Then return to the app and sign in.','Jekk Supabase jitlob konferma tal-email, iftaħ il-messaġġ u kkonferma l-indirizz. Imbagħad erġa’ lura fl-app u idħol.') : t('Ora puoi effettuare il login nell’app con questa email e password.','You can now sign in to the app with this email and password.','Issa tista’ tidħol fl-app b’din l-email u password.')}`;
    }catch(e){
      state.status='error';state.error=String(e?.message||e||'signup_failed');
      out.textContent='❌ '+state.error;
    }finally{
      passEl.value='';pass2El.value='';btn.disabled=false;
    }
  }

  window.MDM_PILOT_STUDENT_SIGNUP_BRIDGE=Object.freeze({version:VERSION,mode:'shadow',mount:render,getState:()=>JSON.parse(JSON.stringify(state))});
  window.addEventListener('pageshow',()=>{try{render();}catch(_){}});
  document.addEventListener('visibilitychange',()=>{if(!document.hidden){try{render();}catch(_){}}});
  try{render();}catch(_){}
})();
