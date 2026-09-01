/* Malta Driving Master 45.8.31.50.49 — Pilot Quality Gate
   Local-only pilot quality metrics + Owner preflight.
   No analytics upload. No email/body capture. No answers, GPS or stack traces.
   Student-facing UI stays clean; Owner gets a compact operational readiness card. */
(function(){
  'use strict';
  if(window.MDM_PILOT_QUALITY_GATE)return;

  const VERSION='45.8.31.50.49.1';
  const AUTH_KEY='mdm_auth_session_v4410';
  const OWNER_EMAIL='maltadrivingmaster@gmail.com';
  const METRICS_KEY_PREFIX='mdm_pilot_quality_metrics_v1::';
  let lastRoute='';
  let raf=0;

  function readJson(key,fallback=null){
    try{const raw=localStorage.getItem(key);return raw?JSON.parse(raw):fallback;}catch(_){return fallback;}
  }
  function writeJson(key,value){
    try{localStorage.setItem(key,JSON.stringify(value));return true;}catch(_){return false;}
  }
  function session(){return readJson(AUTH_KEY,null);}
  function norm(v){return String(v||'').trim().toLowerCase();}
  function isOwner(){const s=session();return norm(s?.user?.email||s?.email||'')===OWNER_EMAIL;}
  function isAuthenticated(){
    const s=session();
    return Boolean(s&&s.status==='authenticated'&&s.accessToken&&s.user?.id&&(!(Number(s.expiresAt)>0)||Number(s.expiresAt)>Date.now()));
  }
  function nowIso(){return new Date().toISOString();}
  function routeName(){
    const h=String(location.hash||'#home').replace(/^#/,'').trim();
    return h||'home';
  }
  function metricsKey(){
    const uid=String(session()?.user?.id||'').trim();
    return METRICS_KEY_PREFIX+(uid||'signed-out');
  }
  function metrics(){
    const base=readJson(metricsKey(),{});
    return {
      version:1,
      createdAt:String(base.createdAt||nowIso()),
      lastSeenAt:String(base.lastSeenAt||''),
      appOpens:Number(base.appOpens||0),
      routeViews:base.routeViews&&typeof base.routeViews==='object'?base.routeViews:{},
      feedbackOpens:Number(base.feedbackOpens||0),
      welcomeDismissed:Number(base.welcomeDismissed||0),
      firstAuthenticatedAt:String(base.firstAuthenticatedAt||''),
      firstHomeAt:String(base.firstHomeAt||''),
      firstQuizAt:String(base.firstQuizAt||''),
      firstRecoveryAt:String(base.firstRecoveryAt||''),
      firstReplayAt:String(base.firstReplayAt||''),
      firstExamAt:String(base.firstExamAt||''),
      lastNavigationMs:Number(base.lastNavigationMs||0)
    };
  }
  function save(m){m.lastSeenAt=nowIso();writeJson(metricsKey(),m);}
  function markRoute(){
    if(isOwner())return;
    const r=routeName();
    if(r===lastRoute)return;
    lastRoute=r;
    const m=metrics();
    m.routeViews[r]=Number(m.routeViews[r]||0)+1;
    if(r==='home'&&!m.firstHomeAt)m.firstHomeAt=nowIso();
    if((r==='quiz'||r==='bridgequiz')&&!m.firstQuizAt)m.firstQuizAt=nowIso();
    if(/recovery|errorreplay/i.test(r)&&!m.firstRecoveryAt)m.firstRecoveryAt=nowIso();
    if(/replay/i.test(r)&&!m.firstReplayAt)m.firstReplayAt=nowIso();
    if(/exam/i.test(r)&&!m.firstExamAt)m.firstExamAt=nowIso();
    if(isAuthenticated()&&!m.firstAuthenticatedAt)m.firstAuthenticatedAt=nowIso();
    save(m);
  }
  function markOpen(){
    if(isOwner())return;
    const m=metrics();
    m.appOpens+=1;
    try{
      const nav=performance.getEntriesByType?.('navigation')?.[0];
      if(nav&&Number.isFinite(nav.duration))m.lastNavigationMs=Math.round(nav.duration);
    }catch(_){}
    save(m);
  }
  function markFeedback(){
    if(isOwner())return;
    const m=metrics();m.feedbackOpens+=1;save(m);
  }
  function markWelcome(){
    if(isOwner())return;
    const m=metrics();m.welcomeDismissed+=1;save(m);
  }

  function hookStudentSignals(){
    document.addEventListener('click',function(e){
      const target=e.target?.closest?.('#mdmPilotFeedbackButton,#mdmPilotWelcomeDone');
      if(!target)return;
      if(target.id==='mdmPilotFeedbackButton')markFeedback();
      if(target.id==='mdmPilotWelcomeDone')markWelcome();
    },false);
  }

  function fmtMs(ms){
    if(!ms)return '—';
    return ms<1000?ms+' ms':(ms/1000).toFixed(1)+' s';
  }
  function check(label,ok,detail){
    return '<div style="display:grid;grid-template-columns:24px minmax(0,1fr);gap:8px;padding:8px 0;border-top:1px solid rgba(0,0,0,.08)">'+
      '<span style="font-size:16px">'+(ok?'✅':'⚠️')+'</span>'+
      '<div><strong style="display:block;font-size:12px">'+label+'</strong><span style="display:block;margin-top:2px;font-size:10px;opacity:.7">'+detail+'</span></div>'+
    '</div>';
  }
  function ownerPreflight(){
    if(!isOwner())return;
    const host=document.querySelector('.sch35');
    if(!host)return;
    if(document.getElementById('mdmPilotQualityGate'))return;

    const panel=document.createElement('section');
    panel.id='mdmPilotQualityGate';
    panel.style.cssText='margin:14px 0;padding:14px;border:1px solid rgba(16,168,184,.24);border-radius:16px;background:rgba(16,168,184,.05);color:#123548';
    panel.innerHTML=
      '<div style="display:flex;align-items:flex-start;justify-content:space-between;gap:10px">'+
        '<div><strong style="display:block">🧪 Pilot Preflight</strong>'+
        '<span style="display:block;margin-top:4px;font-size:11px;opacity:.72">Controlli essenziali prima di invitare utenti reali.</span></div>'+
        '<button id="mdmPilotRunPreflight" class="btn secondary" type="button" style="padding:8px 10px">Esegui</button>'+
      '</div>'+
      '<div id="mdmPilotPreflightBody" style="margin-top:8px"></div>';

    const invite=document.getElementById('mdmPilotRealInvitePanel');
    if(invite&&invite.parentNode===host)invite.insertAdjacentElement('beforebegin',panel);
    else{
      const anchor=host.querySelector('.sch35-profile-entry')||host.querySelector('.sch35-head');
      if(anchor)anchor.insertAdjacentElement('afterend',panel); else host.insertBefore(panel,host.firstChild||null);
    }
    panel.querySelector('#mdmPilotRunPreflight').onclick=runPreflight;
    runPreflight();
  }

  function runPreflight(){
    const body=document.getElementById('mdmPilotPreflightBody');if(!body)return;
    const s=session();
    const bridge=window.MDM_PILOT_ACCESS_BRIDGE;
    let pwa=false;
    try{pwa=window.matchMedia('(display-mode: standalone)').matches||window.navigator.standalone===true;}catch(_){}
    let navMs=0;
    try{
      const nav=performance.getEntriesByType?.('navigation')?.[0];
      navMs=nav&&Number.isFinite(nav.duration)?Math.round(nav.duration):0;
    }catch(_){}

    const tests=[
      ['Owner autenticato',isOwner()&&isAuthenticated(),'Account tecnico Owner riconosciuto e sessione valida.'],
      ['Home Scuola disponibile',Boolean(document.querySelector('.sch35')),'La Home operativa della scuola è renderizzata.'],
      ['Inviti Pilot',Boolean(window.MDM_PILOT_SCHOOL_DASHBOARD_BRIDGE),'Bridge inviti e attivazioni caricato.'],
      ['Pilot Access',Boolean(bridge),'Bridge entitlement/device caricato.'],
      ['Privacy login',Boolean(window.MDM_SIGNED_OUT_LOGIN_PRIVACY_GUARD),'Protezione e-mail precedente attiva.'],
      ['UX studente',Boolean(window.MDM_PILOT_UX_CLEANUP),'Clean-Up Gate caricato.'],
      ['Primo caricamento',!navMs||navMs<=5000,'Ultimo caricamento: '+fmtMs(navMs)+(navMs>5000?' — da osservare su dispositivo pulito.':'')],
      ['PWA',pwa,'Modalità installata rilevata su questo dispositivo.']
    ];
    body.innerHTML=tests.map(x=>check(x[0],x[1],x[2])).join('')+
      '<div style="margin-top:10px;padding:10px;border-radius:12px;background:#fff;font-size:11px;line-height:1.45">'+
        '<strong>Test dispositivo pulito prima del Pilot:</strong><br>'+
        '1. apri MDM su Safari/telefono senza dati precedenti; 2. accetta l’invito; 3. crea account; 4. logout/login; 5. prova secondo dispositivo; 6. revoca il posto e verifica il blocco.'+
      '</div>';
  }

  function ownerMetricsSummary(){
    if(!isOwner())return;
    const panel=document.getElementById('mdmPilotQualityGate');
    const body=document.getElementById('mdmPilotPreflightBody');
    if(!panel||!body||document.getElementById('mdmPilotLocalMetricsNote'))return;
    const note=document.createElement('div');
    note.id='mdmPilotLocalMetricsNote';
    note.style.cssText='margin-top:10px;padding:10px;border-radius:12px;background:#eef6fa;font-size:10px;line-height:1.45';
    note.innerHTML='<strong>Metriche Pilot:</strong> la 50.49 registra solo localmente conteggi minimizzati (aperture, pagine visitate, primo quiz/recovery/replay/esame, feedback e tempo di caricamento). Nessun testo risposta, GPS, e-mail o stack trace viene registrato o inviato.';
    body.appendChild(note);
  }

  function sync(){
    markRoute();
    ownerPreflight();
    ownerMetricsSummary();
  }
  function schedule(){
    if(raf)return;
    raf=requestAnimationFrame(function(){raf=0;sync();});
  }

  markOpen();
  hookStudentSignals();
  sync();

  const screen=document.getElementById('screen');
  if(screen){
    const observer=new MutationObserver(schedule);
    observer.observe(screen,{childList:true,subtree:true});
    window.__MDM_PILOT_QUALITY_GATE_OBSERVER__=observer;
  }
  window.addEventListener('popstate',schedule);
  window.addEventListener('pageshow',schedule);
  document.addEventListener('visibilitychange',function(){if(!document.hidden)schedule();});

  window.MDM_PILOT_QUALITY_GATE=Object.freeze({
    version:VERSION,
    getLocalMetrics:metrics,
    runPreflight:runPreflight
  });
})();