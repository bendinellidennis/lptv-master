/* Malta Driving Master 45.8.31.50.69 — Signed-Out Neutral Gate + Password Setup
   Privacy-only visual isolation after logout / before login.
   Signed-out users never see the previous student's profile, progress or school data.
   Existing authenticated data remains untouched in storage.
   No reload. No auth mutation. No progress mutation. No server writes. */
(function(){
  'use strict';
  if(window.MDM_SIGNED_OUT_NEUTRAL_GATE)return;

  const VERSION='45.8.31.50.69';
  const AUTH_KEY='mdm_auth_session_v4410';
  const APP_URL='https://bendinellidennis.github.io/lptv-master/';
  let recoverySession=null;
  let raf=0;
  let emailPrimed=false;
  let emailDraft='';
  let emailEditedAt=0;

  function restoreEmailDraft(){
    if(authenticated()||!emailDraft)return;
    const email=document.getElementById('mdmStableAuthEmail');
    if(email&&String(email.value||'')!==emailDraft)email.value=emailDraft;
  }

  function queueEmailRestore(){
    Promise.resolve().then(restoreEmailDraft);
    requestAnimationFrame(restoreEmailDraft);
    setTimeout(restoreEmailDraft,0);
    setTimeout(restoreEmailDraft,80);
  }

  function captureEmailDraft(event){
    const target=event&&event.target;
    if(!target||target.id!=='mdmStableAuthEmail')return;
    emailDraft=String(target.value||'');
    emailEditedAt=Date.now();
    queueEmailRestore();
  }

  document.addEventListener('input',captureEmailDraft,true);
  document.addEventListener('change',captureEmailDraft,true);

  function readSession(){
    try{
      const raw=localStorage.getItem(AUTH_KEY);
      return raw?JSON.parse(raw):null;
    }catch(_){return null;}
  }

  function authenticated(){
    const s=readSession();
    if(!s||s.status!=='authenticated'||!s.accessToken||!s.user?.id)return false;
    if(Number(s.expiresAt||0)>0&&Number(s.expiresAt)<=Date.now())return false;
    return true;
  }

  function t(it,en,mt){
    try{
      const raw=localStorage.getItem('mdm-v1-settings');
      const lang=raw?String(JSON.parse(raw).lang||'en'):'en';
      return lang==='it'?it:lang==='mt'?mt:en;
    }catch(_){return en;}
  }

  function authNote(message,isError){
    const el=document.getElementById('mdmSignedOutAuthNote');
    if(!el)return;
    el.textContent=String(message||'');
    el.style.color=isError?'#9a3c2f':'#607b8b';
  }

  function setAuthBusy(busy){
    const signIn=document.getElementById('mdmStableAuthSignIn');
    const signUp=document.getElementById('mdmStableAuthSignUp');
    const recover=document.getElementById('mdmStableAuthRecover');
    const email=document.getElementById('mdmStableAuthEmail');
    const password=document.getElementById('mdmStableAuthPassword');
    if(signIn)signIn.disabled=Boolean(busy);
    if(signUp)signUp.disabled=Boolean(busy);
    if(recover)recover.disabled=Boolean(busy);
    if(email)email.disabled=Boolean(busy);
    if(password)password.disabled=Boolean(busy);
  }

  function authErrorMessage(payload,status){
    return String(
      payload?.msg||
      payload?.message||
      payload?.error_description||
      payload?.error||
      ('HTTP '+String(status||0))
    ).slice(0,240);
  }

  function storeAuthenticatedSession(payload,email){
    const user=payload&&payload.user&&typeof payload.user==='object'?payload.user:null;
    const accessToken=String(payload?.access_token||'');
    const refreshToken=String(payload?.refresh_token||'');
    if(!user?.id||!accessToken)return false;

    const expiresAt=Number(payload?.expires_at||0)>0
      ? Number(payload.expires_at)*1000
      : (Number(payload?.expires_in||0)>0?Date.now()+Number(payload.expires_in)*1000:0);

    const next={
      status:'authenticated',
      email:String(user.email||email||''),
      user,
      accessToken,
      refreshToken,
      expiresAt,
      verifiedAt:new Date().toISOString(),
      lastHttpStatus:200,
      lastMessage:'Supabase Auth session verified',
      lastAction:'session'
    };

    localStorage.setItem(AUTH_KEY,JSON.stringify(next));
    return true;
  }

  function readRecoveryHash(){
    try{
      const params=new URLSearchParams(String(location.hash||'').replace(/^#/,''));
      const accessToken=String(params.get('access_token')||'');
      const refreshToken=String(params.get('refresh_token')||'');
      const type=String(params.get('type')||'');
      if(type!=='recovery'||!accessToken)return null;
      window.__MDM_PASSWORD_RECOVERY_IN_PROGRESS__=true;
      return {accessToken,refreshToken,expiresIn:Number(params.get('expires_in')||3600)||3600};
    }catch(_){return null;}
  }

  async function requestPasswordSetup(email){
    const cfg=window.MDM_BACKEND_CONFIG;
    const normalized=String(email||emailDraft||'').trim().toLowerCase();
    if(!cfg?.enabled||!cfg.endpoint||!cfg.publishableKey||!/^\S+@\S+\.\S+$/.test(normalized)){
      authNote(t('Inserisci prima un indirizzo e-mail valido.','Enter a valid email address first.','L-ewwel daħħal indirizz tal-email validu.'),true);return false;
    }
    setAuthBusy(true);
    authNote(t('Invio del link per impostare la password…','Sending the password setup link…','Qed jintbagħat il-link biex tissettja l-password…'),false);
    try{
      const redirect=new URL(APP_URL);
      redirect.searchParams.set('mdm_password_setup','1');
      redirect.searchParams.set('pilot_email',normalized);
      const endpoint=String(cfg.endpoint).replace(/\/$/,'')+'/auth/v1/recover?redirect_to='+encodeURIComponent(redirect.toString());
      const response=await fetch(endpoint,{
        method:'POST',
        headers:{'Content-Type':'application/json','apikey':cfg.publishableKey,'Accept':'application/json'},
        body:JSON.stringify({email:normalized}),cache:'no-store'
      });
      if(!response.ok){let payload={};try{payload=await response.json();}catch(_){}throw new Error(authErrorMessage(payload,response.status));}
      authNote(t('E-mail inviata. Apri il nuovo messaggio “Imposta password” e premi il link.','Email sent. Open the new “Set password” message and tap the link.','L-email intbagħtet. Iftaħ il-messaġġ il-ġdid “Issettja l-password” u agħfas il-link.'),false);
      return true;
    }catch(e){
      authNote(t('Invio non riuscito: ','Could not send: ','Ma setax jintbagħat: ')+String(e?.message||e||''),true);return false;
    }finally{setAuthBusy(false);}
  }

  function renderPasswordSetup(){
    if(!recoverySession||document.getElementById('mdmPasswordSetupGate'))return;
    const gate=document.createElement('div');
    gate.id='mdmPasswordSetupGate';
    gate.style.cssText='position:fixed;inset:0;z-index:2147483647;display:grid;place-items:center;padding:20px;background:#edf5f7;color:#123548;font-family:system-ui,-apple-system,sans-serif';
    gate.innerHTML='<section style="width:min(100%,480px);box-sizing:border-box;padding:24px;border-radius:22px;background:#fff;box-shadow:0 18px 50px rgba(5,36,55,.16)"><div style="font-size:42px;text-align:center">🔑</div><h1 style="margin:8px 0;text-align:center;font-size:26px">'+t('Imposta la tua password','Set your password','Issettja l-password tiegħek')+'</h1><p style="margin:0 0 14px;text-align:center;color:#607b8b">'+t('Scegli una password personale di almeno 8 caratteri.','Choose a personal password of at least 8 characters.','Agħżel password personali ta’ mill-inqas 8 karattri.')+'</p><input id="mdmRecoveryPassword" type="password" autocomplete="new-password" placeholder="'+t('Nuova password','New password','Password ġdida')+'" style="box-sizing:border-box;width:100%;padding:12px;border:1px solid #cad8df;border-radius:12px;font-size:16px"><input id="mdmRecoveryPassword2" type="password" autocomplete="new-password" placeholder="'+t('Ripeti password','Repeat password','Irrepeti l-password')+'" style="box-sizing:border-box;width:100%;margin-top:9px;padding:12px;border:1px solid #cad8df;border-radius:12px;font-size:16px"><button id="mdmRecoveryPasswordSave" type="button" style="width:100%;margin-top:12px;padding:13px;border:0;border-radius:12px;background:#08a9b5;color:#fff;font-size:17px;font-weight:800">'+t('Salva e accedi','Save and sign in','Issejvja u idħol')+'</button><p id="mdmRecoveryPasswordNote" style="margin:11px 0 0;text-align:center;color:#9a3c2f;font-size:12px"></p></section>';
    document.body.appendChild(gate);
    gate.querySelector('#mdmRecoveryPasswordSave').onclick=saveRecoveryPassword;
  }

  async function saveRecoveryPassword(){
    const cfg=window.MDM_BACKEND_CONFIG;
    const pass=document.getElementById('mdmRecoveryPassword');
    const pass2=document.getElementById('mdmRecoveryPassword2');
    const button=document.getElementById('mdmRecoveryPasswordSave');
    const note=document.getElementById('mdmRecoveryPasswordNote');
    const password=String(pass?.value||''),repeat=String(pass2?.value||'');
    if(password.length<8){if(note)note.textContent=t('Servono almeno 8 caratteri.','At least 8 characters are required.','Huma meħtieġa mill-inqas 8 karattri.');return;}
    if(password!==repeat){if(note)note.textContent=t('Le password non coincidono.','Passwords do not match.','Il-passwords ma jaqblux.');return;}
    if(button)button.disabled=true;if(note)note.textContent='';
    try{
      const response=await fetch(String(cfg.endpoint).replace(/\/$/,'')+'/auth/v1/user',{
        method:'PUT',headers:{'Content-Type':'application/json','apikey':cfg.publishableKey,'Authorization':'Bearer '+recoverySession.accessToken},body:JSON.stringify({password}),cache:'no-store'
      });
      const textBody=await response.text();let user={};try{user=textBody?JSON.parse(textBody):{};}catch(_){}
      if(!response.ok||!user?.id)throw new Error(authErrorMessage(user,response.status));
      const payload={access_token:recoverySession.accessToken,refresh_token:recoverySession.refreshToken,expires_in:recoverySession.expiresIn,user};
      if(!storeAuthenticatedSession(payload,user.email||''))throw new Error('session_store_failed');
      const url=new URL(location.href);url.hash='';url.searchParams.delete('mdm_password_setup');history.replaceState(history.state,'',url.pathname+url.search);
      recoverySession=null;window.__MDM_PASSWORD_RECOVERY_IN_PROGRESS__=false;location.reload();
    }catch(e){if(note)note.textContent=t('Password non salvata: ','Password not saved: ','Il-password ma ġietx issejvjata: ')+String(e?.message||e||'');if(button)button.disabled=false;}
  }

  async function directAuth(action){
    const cfg=window.MDM_BACKEND_CONFIG;
    const emailEl=document.getElementById('mdmStableAuthEmail');
    const passwordEl=document.getElementById('mdmStableAuthPassword');
    const email=String(emailEl?.value||emailDraft||'').trim().toLowerCase();
    const password=String(passwordEl?.value||'');

    if(!cfg?.enabled||!cfg.endpoint||!cfg.publishableKey){
      authNote(t(
        'Servizio di accesso non disponibile. Riprova tra poco.',
        'Sign-in service unavailable. Please try again shortly.',
        'Is-servizz tad-dħul mhux disponibbli. Erġa’ pprova dalwaqt.'
      ),true);
      return;
    }
    if(!/^\S+@\S+\.\S+$/.test(email)||!password){
      authNote(t(
        'Inserisci e-mail e password.',
        'Enter email and password.',
        'Daħħal email u password.'
      ),true);
      return;
    }
    if(action==='signup'&&password.length<6){
      authNote(t(
        'La password deve avere almeno 6 caratteri.',
        'Password must contain at least 6 characters.',
        'Il-password għandu jkollha mill-inqas 6 karattri.'
      ),true);
      return;
    }

    setAuthBusy(true);
    authNote(action==='signup'
      ? t('Creazione account in corso…','Creating account…','Qed jinħoloq il-kont…')
      : t('Accesso in corso…','Signing in…','Qed isir id-dħul…'),false);

    try{
      const base=String(cfg.endpoint).replace(/\/$/,'')+'/auth/v1';
      const url=action==='signup'
        ? base+'/signup'
        : base+'/token?grant_type=password';
      const body=action==='signup'
        ? {email,password,data:{mdm_role:'student',mdm_build:VERSION}}
        : {email,password};

      const response=await fetch(url,{
        method:'POST',
        headers:{
          'Content-Type':'application/json',
          'apikey':cfg.publishableKey,
          'Accept':'application/json'
        },
        body:JSON.stringify(body),
        cache:'no-store'
      });

      const textBody=await response.text();
      let payload={};
      try{payload=textBody?JSON.parse(textBody):{};}catch(_){}

      if(response.ok&&payload?.access_token&&payload?.user?.id){
        if(!storeAuthenticatedSession(payload,email))throw new Error('session_store_failed');
        authNote(t('Accesso riuscito. Caricamento del tuo profilo…','Signed in successfully. Loading your profile…','Id-dħul irnexxa. Qed jitgħabba l-profil tiegħek…'),false);
        try{sessionStorage.setItem('mdm_post_login_reload_v1',String(payload.user.id));}catch(_){}
        location.reload();
        return;
      }

      if(action==='signup'&&response.ok){
        await requestPasswordSetup(email);
        return;
      }

      authNote(
        (action==='signup'
          ? t('Creazione account non riuscita: ','Account creation failed: ','Il-ħolqien tal-kont falla: ')
          : t('Accesso non riuscito: ','Sign-in failed: ','Id-dħul falla: ')
        )+authErrorMessage(payload,response.status),
        true
      );
    }catch(e){
      authNote(
        t(
          'Problema di connessione. I dati inseriti sono rimasti qui: riprova.',
          'Connection problem. Your entered details are still here: try again.',
          'Problema ta’ konnessjoni. Id-data li daħħalt għadha hawn: erġa’ pprova.'
        ),
        true
      );
    }finally{
      if(!authenticated())setAuthBusy(false);
    }
  }

  function installStyle(){
    if(document.getElementById('mdmSignedOutNeutralStyle'))return;
    const style=document.createElement('style');
    style.id='mdmSignedOutNeutralStyle';
    style.textContent=`
      body.mdm-signed-out-home #screen > :not(#mdmSignedOutGate){
        display:none!important
      }

      #mdmSignedOutGate{
        box-sizing:border-box;
        width:min(720px,calc(100% - 28px));
        margin:18px auto 110px;
        padding:22px 18px;
        border:1px solid rgba(18,53,72,.14);
        border-radius:22px;
        background:linear-gradient(145deg,#ffffff,#eef8fb);
        color:#123548;
        text-align:center;
        box-shadow:0 14px 34px rgba(5,40,60,.10)
      }
      #mdmSignedOutGate .mdm-so-icon{
        width:64px;
        height:64px;
        margin:0 auto 12px;
        border-radius:20px;
        display:grid;
        place-items:center;
        background:#0d516b;
        color:#fff;
        font-size:30px
      }
      #mdmSignedOutGate h2{
        margin:0 0 7px;
        font-size:23px;
        line-height:1.15
      }
      #mdmSignedOutGate p{
        margin:0 auto 15px;
        max-width:520px;
        color:#607b8b;
        font-size:13px;
        line-height:1.48
      }
      #mdmSignedOutGate button{width:100%}
      @media(max-width:520px){
        #mdmSignedOutGate > div[style*="grid-template-columns"]{grid-template-columns:1fr!important}
      }

      body.mdm-signed-out-profile .account-hero,
      body.mdm-signed-out-profile .account-status-grid,
      body.mdm-signed-out-profile .account-role-select,
      body.mdm-signed-out-profile .account-enroll-card,
      body.mdm-signed-out-profile .account-security-card,
      body.mdm-signed-out-profile .account-no-fake,
      body.mdm-signed-out-profile .account-title .badge,
      body.mdm-signed-out-profile .account-identity-card:not(.mdm-public-auth-card){
        display:none!important
      }

      body.mdm-signed-out-profile .account-title p{
        display:none!important
      }

      body.mdm-signed-out-profile #mdmStudentPilotStatus{
        display:none!important
      }

      body.mdm-signed-out-home #mdmPilotFeedbackButton,
      body.mdm-signed-out-profile #mdmPilotFeedbackButton{
        display:none!important
      }
    `;
    document.head.appendChild(style);
  }

  function findAuthCard(){
    const direct=Array.from(document.querySelectorAll('#mdmStableAuthEmail,#mdmStableAuthSignIn,#mdmStableAuthSignUp'))
      .find(function(el){return !el.closest('#mdmSignedOutGate');});
    if(!direct)return null;
    return direct.closest('.account-identity-card,.card,section,article,div');
  }

  function cleanSignedOutAuthCard(card){
    if(!card)return;
    card.classList.add('mdm-public-auth-card');

    const email=card.querySelector('#mdmStableAuthEmail');
    if(email){
      if(!emailPrimed){
        const userIsTyping=Date.now()-emailEditedAt<2000||document.activeElement===email;
        if(userIsTyping){
          emailDraft=String(email.value||emailDraft||'');
        }else{
          email.value='';
          emailDraft='';
        }
        emailPrimed=true;
      }else if(String(email.value||'')!==emailDraft){
        email.value=emailDraft;
      }
      if(email.dataset.mdmDraftBound!=='1'){
        email.dataset.mdmDraftBound='1';
        email.addEventListener('input',captureEmailDraft,false);
      }
    }

    const linked=card.querySelector('.account-linked');
    if(linked)linked.style.display='none';

    const ids=card.querySelector('.account-id-lines');
    if(ids)ids.style.display='none';

    Array.from(card.querySelectorAll('.driving-twin-disclaimer')).forEach(function(el){
      const txt=String(el.textContent||'').toLowerCase();
      if(txt.includes('invalid jwt')||txt.includes('token is expired')||txt.includes('sessione fallita')){
        el.textContent=t(
          'Inserisci la tua e-mail e password per accedere.',
          'Enter your email and password to sign in.',
          'Daħħal l-email u l-password tiegħek biex tidħol.'
        );
      }
    });
  }

  function ensureHomeGate(){
    const screen=document.getElementById('screen');
    if(!screen)return;
    if(document.getElementById('mdmSignedOutGate'))return;

    const gate=document.createElement('section');
    gate.id='mdmSignedOutGate';
    gate.innerHTML=
      '<div class="mdm-so-icon">👤</div>'+
      '<h2>'+t('Benvenuto in Malta Driving Master','Welcome to Malta Driving Master','Merħba f’Malta Driving Master')+'</h2>'+
      '<p>'+t(
        'Accedi o crea un account per vedere il tuo profilo, i tuoi progressi e il tuo percorso di studio.',
        'Sign in or create an account to see your profile, progress and study journey.',
        'Idħol jew oħloq kont biex tara l-profil, il-progress u l-mixja tal-istudju tiegħek.'
      )+'</p>'+
      '<label style="display:block;text-align:left;margin:14px auto 7px;width:min(100%,420px);font-weight:800">'+
        'E-mail'+
        '<input id="mdmStableAuthEmail" type="email" value="" autocomplete="email" autocapitalize="none" spellcheck="false" '+
        'style="box-sizing:border-box;width:100%;margin-top:6px;padding:12px;border:1px solid rgba(18,53,72,.18);border-radius:12px;background:#fff;color:#123548;font:600 16px system-ui">'+
      '</label>'+
      '<label style="display:block;text-align:left;margin:7px auto 12px;width:min(100%,420px);font-weight:800">'+
        t('Password','Password','Password')+
        '<input id="mdmStableAuthPassword" type="password" value="" autocomplete="current-password" '+
        'style="box-sizing:border-box;width:100%;margin-top:6px;padding:12px;border:1px solid rgba(18,53,72,.18);border-radius:12px;background:#fff;color:#123548;font:600 16px system-ui">'+
      '</label>'+
      '<div style="display:grid;grid-template-columns:1fr 1fr;gap:9px;width:min(100%,420px);margin:0 auto">'+
        '<button id="mdmStableAuthSignIn" class="btn" type="button">🔓 '+t('Accedi','Sign in','Idħol')+'</button>'+
        '<button id="mdmStableAuthSignUp" class="btn secondary" type="button">＋ '+t('Crea account','Create account','Oħloq kont')+'</button>'+
      '</div>'+
      '<button id="mdmStableAuthRecover" class="btn secondary" type="button" style="width:min(100%,420px);margin:9px auto 0">🔑 '+t('Imposta o reimposta password','Set or reset password','Issettja jew ibdel il-password')+'</button>'+
      '<p id="mdmSignedOutAuthNote" style="margin-top:12px;font-size:11px">'+t(
        'I dati del precedente utente restano privati e ricompaiono solo dopo il suo accesso.',
        'The previous user’s data stays private and only returns after that user signs in.',
        'Id-data tal-utent preċedenti tibqa’ privata u terġa’ tidher biss wara d-dħul tiegħu.'
      )+'</p>';

    screen.insertBefore(gate,screen.firstChild||null);
    restoreEmailDraft();

    const signIn=gate.querySelector('#mdmStableAuthSignIn');
    const signUp=gate.querySelector('#mdmStableAuthSignUp');

    if(signIn)signIn.onclick=function(){directAuth('signin');};
    if(signUp)signUp.onclick=function(){directAuth('signup');};
    const recover=gate.querySelector('#mdmStableAuthRecover');
    if(recover)recover.onclick=function(){requestPasswordSetup(String(gate.querySelector('#mdmStableAuthEmail')?.value||emailDraft||''));};

    const password=gate.querySelector('#mdmStableAuthPassword');
    if(password)password.addEventListener('keydown',function(event){
      if(event.key==='Enter'){event.preventDefault();directAuth('signin');}
    });
  }

  function clearClasses(){
    emailPrimed=false;
    emailDraft='';
    document.body?.classList?.remove('mdm-signed-out-home','mdm-signed-out-profile');
    document.getElementById('mdmSignedOutGate')?.remove();
    document.querySelectorAll('.mdm-public-auth-card').forEach(function(el){
      el.classList.remove('mdm-public-auth-card');
    });
  }

  function sync(){
    installStyle();

    if(authenticated()){
      clearClasses();
      return;
    }

    document.body?.classList?.remove('mdm-signed-out-profile');
    document.body?.classList?.add('mdm-signed-out-home');
    ensureHomeGate();
  }

  function schedule(){
    if(raf)return;
    raf=requestAnimationFrame(function(){
      raf=0;
      sync();
    });
  }

  installStyle();
  recoverySession=readRecoveryHash();
  sync();
  if(recoverySession)renderPasswordSetup();

  const screen=document.getElementById('screen');
  if(screen){
    const observer=new MutationObserver(schedule);
    observer.observe(screen,{childList:true,subtree:true});
    window.__MDM_SIGNED_OUT_NEUTRAL_OBSERVER__=observer;
  }

  document.addEventListener('click',schedule,false);
  window.addEventListener('pageshow',schedule);
  window.addEventListener('popstate',schedule);
  document.addEventListener('visibilitychange',function(){
    if(!document.hidden)schedule();
  });

  window.MDM_SIGNED_OUT_NEUTRAL_GATE=Object.freeze({
    version:VERSION,
    sync:sync,
    authenticated:authenticated
  });
})();
