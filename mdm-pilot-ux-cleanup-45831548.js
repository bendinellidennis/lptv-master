/* Malta Driving Master 45.8.31.50.65 — Pilot UX & Clean-Up Gate
   Student-facing polish only.
   Goals:
   - hide technical diagnostics from students
   - keep Owner diagnostics untouched
   - simplify the Student Home
   - humanize Account/Auth language
   - show one short first-run explanation
   - provide a simple feedback entry point
   - keep onboarding visually compact
   No auth mutation. No progress mutation. No server writes. No polling. */
(function(){
  'use strict';
  if(window.MDM_PILOT_UX_CLEANUP)return;

  const VERSION='45.8.31.50.65';
  const AUTH_KEY='mdm_auth_session_v4410';
  const OWNER_EMAIL='maltadrivingmaster@gmail.com';
  const PENDING_KEY='mdm_pilot_pending_invite_v1';
  const FEEDBACK_EMAIL='maltadrivingmaster@gmail.com';
  let raf=0;

  function readJson(key){
    try{const raw=localStorage.getItem(key);return raw?JSON.parse(raw):null;}catch(_){return null;}
  }
  function session(){return readJson(AUTH_KEY);}
  function normalize(v){return String(v||'').trim().toLowerCase();}
  function isOwner(){
    const s=session();
    return normalize(s?.user?.email||s?.email||'')===OWNER_EMAIL;
  }
  function isAuthenticated(){
    const s=session();
    if(!s||s.status!=='authenticated'||!s.accessToken||!s.user?.id)return false;
    if(Number(s.expiresAt||0)>0&&Number(s.expiresAt)<=Date.now())return false;
    return true;
  }
  function userId(){return String(session()?.user?.id||'');}
  function lang(){
    try{return String(readJson('mdm-v1-settings')?.lang||'en');}catch(_){return 'en';}
  }
  function t(it,en,mt){const l=lang();return l==='it'?it:l==='mt'?mt:en;}
  function pendingInvite(){
    try{
      const p=readJson(PENDING_KEY);
      return Boolean(p&&String(p.token||'').length>=32&&Date.now()-Number(p.at||0)<=7*24*60*60*1000);
    }catch(_){return false;}
  }
  function esc(v){
    return String(v??'').replace(/[&<>"']/g,function(ch){
      return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch];
    });
  }

  function installStyle(){
    if(document.getElementById('mdmPilotUxCleanStyle'))return;
    const style=document.createElement('style');
    style.id='mdmPilotUxCleanStyle';
    style.textContent=`
      body.mdm-student-clean #mdmPilotShadowBadge{display:none!important}
      body.mdm-student-clean .account-title .badge,
      body.mdm-student-clean .account-hero,
      body.mdm-student-clean .account-status-grid,
      body.mdm-student-clean .account-no-fake,
      body.mdm-student-clean .account-identity-card .account-id-lines,
      body.mdm-student-clean #mdmAuthVerify,
      body.mdm-student-clean .account-role-card,
      body.mdm-student-clean .account-security-card,
      body.mdm-student-clean .account-links,
      body.mdm-student-clean .investor-profile-card,
      body.mdm-student-clean [data-go="pilotanalytics"],
      body.mdm-student-clean [data-go="pilotreadiness"],
      body.mdm-student-clean [data-go="externalvalidation"],
      body.mdm-student-clean [data-go="securitytrust"],
      body.mdm-student-clean [data-go="pentestprep"],
      body.mdm-student-clean [data-go="realpilotprep"],
      body.mdm-student-clean [data-go="schoolpilotprep"],
      body.mdm-student-clean [data-go="metricsloiprep"],
      body.mdm-student-clean [data-go="backendreal"],
      body.mdm-student-clean [data-go="investorproduction"],
      body.mdm-student-clean [data-go="investorpreview"],
      body.mdm-student-clean [data-go="cloudready"],
      body.mdm-student-clean .installed-version-card,
      body.mdm-student-clean .security-trust-home,
      body.mdm-student-clean .investor-production-home,
      body.mdm-student-clean .fleet-corporate-home{display:none!important}

      body.mdm-student-clean #screen > .section-title .badge.official{display:none!important}

      body.mdm-student-clean .premium-focus-card{
        border:2px solid rgba(16,168,184,.28)!important;
        box-shadow:0 10px 28px rgba(8,64,88,.10)!important
      }
      body.mdm-student-clean .mdm-pilot-today-label{
        margin:14px 0 7px;
        font-size:12px;
        font-weight:950;
        letter-spacing:.08em;
        color:#0b7180
      }

      .mdm-pilot-welcome{
        margin:12px 0 14px;
        padding:15px;
        border:1px solid rgba(16,168,184,.25);
        border-radius:18px;
        background:linear-gradient(145deg,#eefbfc,#f5fbff);
        color:#123548
      }
      .mdm-pilot-welcome h3{margin:0 0 6px;font-size:18px}
      .mdm-pilot-welcome p{margin:0;color:#587487;font-size:12px;line-height:1.42}
      .mdm-pilot-welcome-steps{
        display:grid;
        grid-template-columns:repeat(3,minmax(0,1fr));
        gap:7px;
        margin:12px 0
      }
      .mdm-pilot-welcome-steps div{
        padding:10px 8px;
        border-radius:13px;
        background:#fff;
        border:1px solid rgba(18,53,72,.10);
        text-align:center
      }
      .mdm-pilot-welcome-steps b{display:block;font-size:12px;color:#123548}
      .mdm-pilot-welcome-steps span{display:block;font-size:22px;margin-bottom:4px}
      .mdm-pilot-welcome button{width:100%}

      .mdm-student-pilot-status{
        margin:12px 0;
        padding:12px 13px;
        border-radius:14px;
        border:1px solid rgba(25,135,102,.20);
        background:#eef9f4;
        color:#173e32
      }
      .mdm-student-pilot-status.pending{
        border-color:rgba(210,145,30,.24);
        background:#fff8e8;
        color:#694914
      }
      .mdm-student-pilot-status strong{display:block;font-size:13px}
      .mdm-student-pilot-status span{display:block;margin-top:3px;font-size:11px;opacity:.78}

      #mdmPilotFeedbackButton{
        position:fixed;
        right:12px;
        bottom:calc(78px + env(safe-area-inset-bottom));
        z-index:8500;
        border:1px solid rgba(255,255,255,.24);
        border-radius:999px;
        padding:10px 13px;
        background:#123548;
        color:#fff;
        font:800 11px/1 system-ui;
        box-shadow:0 9px 24px rgba(4,30,45,.20)
      }
      #mdmPilotFeedbackModal{
        position:fixed;
        inset:0;
        z-index:999999;
        background:rgba(2,12,20,.62);
        display:flex;
        align-items:center;
        justify-content:center;
        padding:18px
      }
      #mdmPilotFeedbackModal .mdm-feedback-card{
        width:min(430px,100%);
        border-radius:18px;
        padding:17px;
        background:var(--card,#fff);
        color:inherit;
        box-shadow:0 20px 60px rgba(0,0,0,.28)
      }
      #mdmPilotFeedbackModal textarea{
        box-sizing:border-box;
        width:100%;
        min-height:125px;
        resize:vertical;
        padding:11px;
        border:1px solid rgba(0,0,0,.16);
        border-radius:11px;
        background:var(--card,#fff);
        color:inherit
      }
      #mdmPilotFeedbackModal .mdm-feedback-actions{
        display:grid;
        grid-template-columns:1fr 1fr;
        gap:8px;
        margin-top:9px
      }

      body.mdm-student-clean .onboarding-data-card ul{display:none!important}
      body.mdm-student-clean .onboarding-data-card,
      body.mdm-student-clean .onboarding-consents{
        border-radius:16px!important
      }
      .mdm-pilot-onboarding-guide{
        margin:0 0 12px;
        padding:11px 12px;
        border:1px solid rgba(16,168,184,.22);
        border-radius:14px;
        background:#eefbfc;
        color:#123548;
        font-size:12px;
        font-weight:850;
        text-align:center
      }

      @media(max-width:520px){
        .mdm-pilot-welcome-steps{grid-template-columns:1fr}
        #mdmPilotFeedbackButton{bottom:calc(72px + env(safe-area-inset-bottom))}
      }
    `;
    document.head.appendChild(style);
  }

  function applyMode(){
    if(isOwner()){
      document.body?.classList?.remove('mdm-student-clean');
      document.getElementById('mdmPilotFeedbackButton')?.remove();
      document.getElementById('mdmPilotFeedbackModal')?.remove();
      return false;
    }
    document.body?.classList?.add('mdm-student-clean');
    return true;
  }

  function humanizeAccount(){
    if(isOwner())return;
    const title=document.querySelector('.account-title');
    if(title){
      const h=title.querySelector('h2');
      const p=title.querySelector('p');
      if(h)h.textContent='👤 '+t('Il tuo account','Your account','Il-kont tiegħek');
      if(p)p.textContent=t(
        'Gestisci accesso e collegamento con la tua scuola.',
        'Manage your sign-in and school connection.',
        'Immaniġġja d-dħul u l-konnessjoni mal-iskola.'
      );
    }

    const authCard=Array.from(document.querySelectorAll('.account-identity-card')).find(function(card){
      return card.querySelector('#mdmAuthEmail,#mdmAuthSignIn,#mdmAuthSignOut') || /supabase auth/i.test(String(card.innerText||''));
    });
    if(authCard){
      const small=authCard.querySelector('.account-section-head small');
      const h2=authCard.querySelector('.account-section-head h2');
      const p=authCard.querySelector('.account-section-head p');
      if(small)small.textContent=t('ACCESSO ACCOUNT','ACCOUNT ACCESS','AĊĊESS TAL-KONT');
      if(h2)h2.textContent=isAuthenticated()
        ? '✅ '+t('Account attivo','Account active','Kont attiv')
        : '🔐 '+t('Accedi al tuo account','Sign in to your account','Idħol fil-kont tiegħek');
      if(p)p.textContent=t(
        'Usa la tua e-mail e password. MDM non salva la password.',
        'Use your email and password. MDM does not store your password.',
        'Uża l-email u l-password tiegħek. MDM ma jaħżinx il-password.'
      );
      const linked=authCard.querySelector('.account-linked span');
      if(linked&&isAuthenticated())linked.textContent=t('Accesso verificato','Sign-in verified','Dħul ivverifikat');
    }

    Array.from(document.querySelectorAll('.account-role-select .driving-twin-disclaimer')).forEach(function(el){
      el.style.display='none';
    });
  }

  function pilotStatus(){
    try{return window.MDM_PILOT_ACCESS_BRIDGE?.getState?.()||null;}catch(_){return null;}
  }

  function renderCleanPilotStatus(){
    if(isOwner())return;
    const old=document.getElementById('mdmStudentPilotStatus');
    const authCard=Array.from(document.querySelectorAll('.account-identity-card')).find(function(card){
      return card.querySelector('#mdmAuthEmail,#mdmAuthSignIn,#mdmAuthSignOut') || /account attivo|sign in|accedi/i.test(String(card.innerText||''));
    });
    if(!authCard){old?.remove();return;}

    const ps=pilotStatus();
    const authorized=ps?.authorized===true;
    const waiting=pendingInvite()&&isAuthenticated()&&!authorized;
    if(!authorized&&!waiting){old?.remove();return;}

    let box=old;
    if(!box){
      box=document.createElement('div');
      box.id='mdmStudentPilotStatus';
      box.className='mdm-student-pilot-status';
      authCard.insertAdjacentElement('afterend',box);
    }
    box.classList.toggle('pending',waiting);
    if(authorized){
      box.innerHTML='<strong>✅ '+esc(t('Accesso Pilot attivo','Pilot access active','Aċċess Pilot attiv'))+'</strong><span>'+esc(t(
        'Il tuo account è pronto per usare Malta Driving Master.',
        'Your account is ready to use Malta Driving Master.',
        'Il-kont tiegħek huwa lest biex juża Malta Driving Master.'
      ))+'</span>';
    }else{
      box.innerHTML='<strong>⏳ '+esc(t('Invito ricevuto','Invitation received','Stedina riċevuta'))+'</strong><span>'+esc(t(
        'La scuola deve ancora attivare il tuo accesso.',
        'Your school still needs to activate your access.',
        'L-iskola għadha trid tattiva l-aċċess tiegħek.'
      ))+'</span>';
    }
  }

  function isStudentHome(){
    const hash=String(location.hash||'');
    return hash===''||hash==='#'||hash==='#home';
  }

  function promoteToday(){
    if(isOwner()||!isStudentHome())return;
    const screen=document.getElementById('screen');
    if(!screen)return;
    const focus=screen.querySelector('.premium-focus-card');
    if(!focus)return;

    if(!document.getElementById('mdmPilotTodayLabel')){
      const label=document.createElement('div');
      label.id='mdmPilotTodayLabel';
      label.className='mdm-pilot-today-label';
      label.textContent='🎯 '+t('OGGI FAI QUESTO','DO THIS TODAY','AGĦMEL DAN ILLUM');
      focus.insertAdjacentElement('beforebegin',label);
    }
  }

  function welcomeKey(){
    const id=userId();
    return id?'mdm_pilot_student_welcome_seen_v1::'+id:'';
  }

  function mountWelcome(){
    if(isOwner()||!isAuthenticated()||!isStudentHome())return;
    const key=welcomeKey();if(!key)return;
    if(localStorage.getItem(key)==='1'){document.getElementById('mdmPilotWelcome')?.remove();return;}
    if(document.getElementById('mdmPilotWelcome'))return;

    const screen=document.getElementById('screen');
    const anchor=screen?.querySelector('.premium-home-welcome,.premium-focus-card');
    if(!anchor)return;

    const card=document.createElement('section');
    card.id='mdmPilotWelcome';
    card.className='mdm-pilot-welcome';
    card.innerHTML=
      '<h3>'+esc(t('MDM non è solo un quiz','MDM is more than a quiz','MDM mhux biss quiz'))+'</h3>'+
      '<p>'+esc(t(
        'Studia normalmente: MDM osserva gli errori, capisce dove hai difficoltà e ti guida nel recupero.',
        'Study normally: MDM learns from your mistakes, finds weak areas and guides your recovery.',
        'Studja normalment: MDM jitgħallem mill-iżbalji tiegħek, isib id-dgħufijiet u jiggwidak fl-irkupru.'
      ))+'</p>'+
      '<div class="mdm-pilot-welcome-steps">'+
        '<div><span>📘</span><b>'+esc(t('1 · Studia','1 · Study','1 · Studja'))+'</b></div>'+
        '<div><span>🧠</span><b>'+esc(t('2 · MDM capisce','2 · MDM learns','2 · MDM jifhem'))+'</b></div>'+
        '<div><span>🎯</span><b>'+esc(t('3 · Recupera','3 · Recover','3 · Irkupra'))+'</b></div>'+
      '</div>'+
      '<button id="mdmPilotWelcomeDone" class="btn" type="button">'+esc(t('Ho capito, inizia','Got it, start','Fhimt, ibda'))+'</button>';

    anchor.insertAdjacentElement('beforebegin',card);
    card.querySelector('#mdmPilotWelcomeDone').onclick=function(){
      try{localStorage.setItem(key,'1');}catch(_){}
      card.remove();
    };
  }

  function simplifyInvitedOnboarding(){
    if(isOwner()||!pendingInvite())return;
    const roleInputs=Array.from(document.querySelectorAll('[data-onboarding-role] input, input[name="onboardingRole"]'));
    if(!roleInputs.length)return;

    let studentInput=null;
    roleInputs.forEach(function(input){
      const value=String(input.value||'').toLowerCase();
      const label=input.closest('label,[data-onboarding-role]');
      if(value==='student')studentInput=input;
      else if(label)label.style.display='none';
    });

    const title=document.querySelector('.onboarding-panel h2,.onboarding-brand h1');
    if(title)title.textContent=t(
      'Prepariamo il tuo accesso studente',
      'Set up your student access',
      'Ipprepara l-aċċess tal-istudent tiegħek'
    );
  }

  function compactOnboarding(){
    if(isOwner())return;
    const screen=document.getElementById('screen');
    if(!screen)return;
    const role=screen.querySelector('[data-onboarding-role]');
    const licence=screen.querySelector('[data-onboarding-licence]');
    const continueBtn=screen.querySelector('#completeOnboarding');
    if(!role&&!licence&&!continueBtn){
      document.getElementById('mdmPilotOnboardingGuide')?.remove();
      return;
    }
    if(document.getElementById('mdmPilotOnboardingGuide'))return;
    const guide=document.createElement('div');
    guide.id='mdmPilotOnboardingGuide';
    guide.className='mdm-pilot-onboarding-guide';
    guide.textContent=t(
      '1. Scegli il profilo · 2. Scegli la patente · 3. Accetta e inizia',
      '1. Choose profile · 2. Choose licence · 3. Accept and start',
      '1. Agħżel profil · 2. Agħżel liċenzja · 3. Aċċetta u ibda'
    );
    const target=role?.closest('section,div')||screen.firstElementChild;
    if(target)target.insertAdjacentElement('beforebegin',guide);
  }

  function closeFeedback(){document.getElementById('mdmPilotFeedbackModal')?.remove();}

  function sendFeedback(){
    const area=document.getElementById('mdmPilotFeedbackText');
    const text=String(area?.value||'').trim();
    if(!text){area?.focus();return;}
    const subject='MDM Pilot Feedback';
    const body=[
      text,
      '',
      'Build: '+VERSION,
      'Pagina: '+String(location.hash||'#home')
    ].join('\n');
    location.href='mailto:'+FEEDBACK_EMAIL+'?subject='+encodeURIComponent(subject)+'&body='+encodeURIComponent(body);
  }

  function openFeedback(){
    closeFeedback();
    const modal=document.createElement('div');
    modal.id='mdmPilotFeedbackModal';
    modal.innerHTML=
      '<div class="mdm-feedback-card">'+
        '<div style="display:flex;align-items:center;justify-content:space-between;gap:10px">'+
          '<strong>💬 '+esc(t('Segnala un problema o suggerimento','Report a problem or suggestion','Irrapporta problema jew suġġeriment'))+'</strong>'+
          '<button id="mdmPilotFeedbackClose" type="button" style="border:0;background:transparent;font-size:24px;color:inherit">×</button>'+
        '</div>'+
        '<p style="font-size:12px;opacity:.74;line-height:1.4">'+esc(t(
          'Scrivi cosa non ha funzionato o cosa miglioreresti. Nulla viene inviato automaticamente.',
          'Tell us what did not work or what you would improve. Nothing is sent automatically.',
          'Ikteb x’ma ħadimx jew x’tista’ tittejjeb. Xejn ma jintbagħat awtomatikament.'
        ))+'</p>'+
        '<textarea id="mdmPilotFeedbackText" placeholder="'+esc(t('Scrivi qui…','Write here…','Ikteb hawn…'))+'"></textarea>'+
        '<div class="mdm-feedback-actions">'+
          '<button id="mdmPilotFeedbackCancel" class="btn secondary" type="button">'+esc(t('Annulla','Cancel','Ikkanċella'))+'</button>'+
          '<button id="mdmPilotFeedbackSend" class="btn" type="button">'+esc(t('Invia feedback','Send feedback','Ibgħat feedback'))+'</button>'+
        '</div>'+
      '</div>';
    document.body.appendChild(modal);
    modal.querySelector('#mdmPilotFeedbackClose').onclick=closeFeedback;
    modal.querySelector('#mdmPilotFeedbackCancel').onclick=closeFeedback;
    modal.querySelector('#mdmPilotFeedbackSend').onclick=sendFeedback;
    modal.onclick=function(e){if(e.target===modal)closeFeedback();};
  }

  function mountFeedback(){
    if(isOwner()){
      document.getElementById('mdmPilotFeedbackButton')?.remove();
      return;
    }
    if(document.getElementById('mdmPilotFeedbackButton'))return;
    const btn=document.createElement('button');
    btn.id='mdmPilotFeedbackButton';
    btn.type='button';
    btn.textContent='💬 '+t('Feedback','Feedback','Feedback');
    btn.onclick=openFeedback;
    document.body.appendChild(btn);
  }

  function cleanStudentHome(){
    if(isOwner())return;
    Array.from(document.querySelectorAll('.security-trust-home,.investor-production-home,.fleet-corporate-home')).forEach(function(el){
      el.setAttribute('aria-hidden','true');
    });
  }

  function hideTechnicalEntries(){
    if(isOwner())return;
    const ownerOnlyRoutes=new Set([
      'pilotanalytics','pilotreadiness','externalvalidation','securitytrust',
      'pentestprep','realpilotprep','schoolpilotprep','metricsloiprep',
      'backendreal','investorproduction','investorpreview','cloudready'
    ]);
    document.querySelectorAll('[data-go]').forEach(function(el){
      if(ownerOnlyRoutes.has(String(el.getAttribute('data-go')||''))){
        el.setAttribute('aria-hidden','true');
        el.setAttribute('tabindex','-1');
      }
    });
  }

  function blockTechnicalRoute(){
    if(isOwner())return false;
    const ownerOnlyRoutes=new Set([
      'pilotanalytics','pilotreadiness','externalvalidation','securitytrust',
      'pentestprep','realpilotprep','schoolpilotprep','metricsloiprep',
      'backendreal','investorproduction','investorpreview','cloudready'
    ]);
    let active='';
    try{active=String(route?.name||'');}catch(_){}
    if(!active)active=String(location.hash||'').replace(/^#/,'');
    if(!ownerOnlyRoutes.has(active))return false;

    const role=String(readJson('mdm-v1-onboarding')?.role||'').toLowerCase();
    const fallback=role==='school'?'schoolhome':'home';
    try{
      if(typeof go==='function'){go(fallback);return true;}
    }catch(_){}
    history.replaceState({name:fallback,data:null},'',location.pathname+'#'+fallback);
    return true;
  }

  function sync(){
    installStyle();
    const student=applyMode();
    if(!student)return;
    if(blockTechnicalRoute())return;
    humanizeAccount();
    renderCleanPilotStatus();
    simplifyInvitedOnboarding();
    promoteToday();
    mountWelcome();
    compactOnboarding();
    mountFeedback();
    cleanStudentHome();
    hideTechnicalEntries();
  }

  function schedule(){
    if(raf)return;
    raf=requestAnimationFrame(function(){raf=0;sync();});
  }

  installStyle();
  sync();

  const screen=document.getElementById('screen');
  if(screen){
    const observer=new MutationObserver(schedule);
    observer.observe(screen,{childList:true,subtree:true});
    window.__MDM_PILOT_UX_CLEANUP_OBSERVER__=observer;
  }

  const previousPush=history.pushState.bind(history);
  const previousReplace=history.replaceState.bind(history);
  history.pushState=function(){const out=previousPush(...arguments);schedule();return out;};
  history.replaceState=function(){const out=previousReplace(...arguments);schedule();return out;};

  window.addEventListener('popstate',schedule);
  window.addEventListener('pageshow',schedule);
  document.addEventListener('visibilitychange',function(){if(!document.hidden)schedule();});

  window.MDM_PILOT_UX_CLEANUP=Object.freeze({
    version:VERSION,
    sync:sync,
    isOwner:isOwner
  });
})();
