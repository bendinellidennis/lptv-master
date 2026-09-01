/* Malta Driving Master 45.8.31.50.51 — Signed-Out Neutral Gate
   Privacy-only visual isolation after logout / before login.
   Signed-out users never see the previous student's profile, progress or school data.
   Existing authenticated data remains untouched in storage.
   No reload. No auth mutation. No progress mutation. No server writes. */
(function(){
  'use strict';
  if(window.MDM_SIGNED_OUT_NEUTRAL_GATE)return;

  const VERSION='45.8.31.50.52';
  const AUTH_KEY='mdm_auth_session_v4410';
  let raf=0;

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
    const direct=Array.from(document.querySelectorAll('#mdmAuthEmail,#mdmAuthSignIn,#mdmAuthSignUp'))
      .find(function(el){return !el.closest('#mdmSignedOutGate');});
    if(!direct)return null;
    return direct.closest('.account-identity-card,.card,section,article,div');
  }

  function cleanSignedOutAuthCard(card){
    if(!card)return;
    card.classList.add('mdm-public-auth-card');

    const email=card.querySelector('#mdmAuthEmail');
    if(email && String(email.value||'')!==''){
      email.value='';
      try{email.dispatchEvent(new Event('input',{bubbles:true}));}catch(_){}
      try{email.dispatchEvent(new Event('change',{bubbles:true}));}catch(_){}
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
        '<input id="mdmAuthEmail" type="email" value="" autocomplete="email" autocapitalize="none" spellcheck="false" '+
        'style="box-sizing:border-box;width:100%;margin-top:6px;padding:12px;border:1px solid rgba(18,53,72,.18);border-radius:12px;background:#fff;color:#123548;font:600 16px system-ui">'+
      '</label>'+
      '<label style="display:block;text-align:left;margin:7px auto 12px;width:min(100%,420px);font-weight:800">'+
        t('Password','Password','Password')+
        '<input id="mdmAuthPassword" type="password" value="" autocomplete="current-password" '+
        'style="box-sizing:border-box;width:100%;margin-top:6px;padding:12px;border:1px solid rgba(18,53,72,.18);border-radius:12px;background:#fff;color:#123548;font:600 16px system-ui">'+
      '</label>'+
      '<div style="display:grid;grid-template-columns:1fr 1fr;gap:9px;width:min(100%,420px);margin:0 auto">'+
        '<button id="mdmAuthSignIn" class="btn" type="button">🔓 '+t('Accedi','Sign in','Idħol')+'</button>'+
        '<button id="mdmAuthSignUp" class="btn secondary" type="button">＋ '+t('Crea account','Create account','Oħloq kont')+'</button>'+
      '</div>'+
      '<p id="mdmSignedOutAuthNote" style="margin-top:12px;font-size:11px">'+t(
        'I dati del precedente utente restano privati e ricompaiono solo dopo il suo accesso.',
        'The previous user’s data stays private and only returns after that user signs in.',
        'Id-data tal-utent preċedenti tibqa’ privata u terġa’ tidher biss wara d-dħul tiegħu.'
      )+'</p>';

    screen.insertBefore(gate,screen.firstChild||null);

    const signIn=gate.querySelector('#mdmAuthSignIn');
    const signUp=gate.querySelector('#mdmAuthSignUp');

    if(signIn)signIn.onclick=function(){
      try{
        if(typeof mdmAuthSignIn==='function'){mdmAuthSignIn();return;}
      }catch(_){}
      const profile=document.querySelector('[data-nav="profile"]');
      if(profile)profile.click();
    };

    if(signUp)signUp.onclick=function(){
      try{
        if(typeof mdmAuthSignUp==='function'){mdmAuthSignUp();return;}
      }catch(_){}
      const profile=document.querySelector('[data-nav="profile"]');
      if(profile)profile.click();
    };
  }

  function clearClasses(){
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

    const authCard=findAuthCard();

    if(authCard){
      document.body?.classList?.remove('mdm-signed-out-home');
      document.body?.classList?.add('mdm-signed-out-profile');
      document.getElementById('mdmSignedOutGate')?.remove();
      cleanSignedOutAuthCard(authCard);
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