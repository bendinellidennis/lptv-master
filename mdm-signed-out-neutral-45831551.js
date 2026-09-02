/* Malta Driving Master 45.8.31.50.64 — Signed-Out Neutral Gate
   Privacy-only visual isolation after logout / before login.
   Signed-out users never see the previous student's profile, progress or school data.
   Existing authenticated data remains untouched in storage.
   No reload. No auth mutation. No progress mutation. No server writes. */
(function(){
  'use strict';
  if(window.MDM_SIGNED_OUT_NEUTRAL_GATE)return;

  const VERSION='45.8.31.50.64';
  const AUTH_KEY='mdm_auth_session_v4410';
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
    const email=document.getElementById('mdmStableAuthEmail');
    const password=document.getElementById('mdmStableAuthPassword');
    if(signIn)signIn.disabled=Boolean(busy);
    if(signUp)signUp.disabled=Boolean(busy);
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

      if(action==='signup'&&response.ok&&payload?.user?.id){
        authNote(t(
          'Account creato. Controlla l’e-mail di conferma, poi torna qui e accedi.',
          'Account created. Check your confirmation email, then return here and sign in.',
          'Il-kont inħoloq. Iċċekkja l-email ta’ konferma, imbagħad erġa’ idħol hawn.'
        ),false);
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
  sync();

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
