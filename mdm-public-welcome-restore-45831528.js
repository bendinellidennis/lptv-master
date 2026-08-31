/* Malta Driving Master 45.8.31.50.28 — Restore Original Public Welcome
   Removes the temporary simplified fallback introduced during logout diagnostics.
   When signed out, asks the existing app Home router to render the real Welcome
   screen ("Come utilizzerai la piattaforma?"). No reloads, no polling loops. */
(function(){
  'use strict';
  if(window.MDM_PUBLIC_WELCOME_RESTORE)return;

  const VERSION='45.8.31.50.28';
  const AUTH_KEY='mdm_auth_session_v4410';

  function signedOut(){
    try{
      const s=JSON.parse(localStorage.getItem(AUTH_KEY)||'null');
      const status=String(s&&s.status||'');
      const userId=String(s&&s.user&&s.user.id||'');
      return status==='signed_out'||(!status&&!userId);
    }catch(_){return true;}
  }

  function screenText(){
    try{return String((document.getElementById('screen')||{}).innerText||'').replace(/\s+/g,' ').trim().toLowerCase();}
    catch(_){return '';}
  }

  function realWelcomeMounted(){
    const t=screenText();
    return t.includes('come utilizzerai la piattaforma') ||
           t.includes('how will you use the platform') ||
           t.includes('kif se tuża l-pjattaforma');
  }

  function temporaryFallbackMounted(){
    const t=screenText();
    return t.includes('benvenuto in malta driving master') && !realWelcomeMounted();
  }

  function askHome(){
    if(!signedOut()||realWelcomeMounted())return true;
    try{
      const home=document.querySelector('[data-nav="home"]')||document.querySelector('[data-action="home"]');
      if(home&&typeof home.click==='function'){
        if(temporaryFallbackMounted()){
          const screen=document.getElementById('screen');
          if(screen)screen.innerHTML='';
        }
        home.click();
        return realWelcomeMounted();
      }
    }catch(_){}
    return false;
  }

  function settle(){
    if(!signedOut())return;
    [0,180,450,900,1500].forEach(ms=>setTimeout(function(){
      if(realWelcomeMounted())return;
      askHome();
    },ms));
  }

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',settle,{once:true});
  else settle();
  window.addEventListener('pageshow',settle);

  window.MDM_PUBLIC_WELCOME_RESTORE=Object.freeze({version:VERSION,restore:settle});
})();