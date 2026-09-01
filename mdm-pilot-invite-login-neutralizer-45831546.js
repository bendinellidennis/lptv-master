/* Malta Driving Master 45.8.31.50.47 — Signed-out Login Privacy Guard
   Privacy-only UI guard.
   When no real authenticated session exists, never prefill the previous Owner email.
   Also removes stale expired-JWT diagnostics from the visible login card.
   No auth/storage/progress/profile mutation. */
(function(){
  'use strict';
  if(window.MDM_SIGNED_OUT_LOGIN_PRIVACY_GUARD)return;

  const VERSION='45.8.31.50.47';
  const AUTH_KEY='mdm_auth_session_v4410';
  const OWNER_EMAIL='maltadrivingmaster@gmail.com';
  let raf=0;

  function session(){
    try{
      const raw=localStorage.getItem(AUTH_KEY);
      return raw?JSON.parse(raw):null;
    }catch(_){return null;}
  }

  function authenticated(){
    const s=session();
    if(!s||s.status!=='authenticated'||!s.accessToken||!s.user?.id)return false;
    if(Number(s.expiresAt||0)>0&&Number(s.expiresAt)<=Date.now())return false;
    return true;
  }

  function clean(){
    if(authenticated())return false;
    let changed=false;

    const email=document.getElementById('mdmAuthEmail');
    if(email && String(email.value||'').trim().toLowerCase()===OWNER_EMAIL){
      email.value='';
      try{email.dispatchEvent(new Event('input',{bubbles:true}));}catch(_){}
      try{email.dispatchEvent(new Event('change',{bubbles:true}));}catch(_){}
      changed=true;
    }

    document.querySelectorAll('.driving-twin-disclaimer').forEach(function(el){
      const text=String(el.textContent||'').toLowerCase();
      if(text.includes('invalid jwt')||text.includes('token is expired')||text.includes('verifica sessione fallita')){
        el.textContent='Inserisci la tua e-mail e password per accedere.';
        changed=true;
      }
    });

    return changed;
  }

  function schedule(){
    if(raf)return;
    raf=requestAnimationFrame(function(){raf=0;clean();});
  }

  const screen=document.getElementById('screen');
  if(screen){
    const observer=new MutationObserver(schedule);
    observer.observe(screen,{childList:true,subtree:true});
    window.__MDM_SIGNED_OUT_LOGIN_PRIVACY_OBSERVER__=observer;
  }

  window.addEventListener('pageshow',schedule);
  document.addEventListener('visibilitychange',function(){if(!document.hidden)schedule();});
  document.addEventListener('click',schedule,false);

  window.MDM_SIGNED_OUT_LOGIN_PRIVACY_GUARD=Object.freeze({version:VERSION,clean:clean});
  schedule();
})();