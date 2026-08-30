/* Malta Driving Master 45.8.31.49.4 — dedicated registration icon only
   Adds one dedicated account/registration icon to Home header.
   Does not alter existing Home graphics, cards, spacing, language button, Pilot logic or enforcement.
   No MutationObserver. No polling. */
(function(){
  'use strict';
  if(window.MDM_ACCOUNT_HOME_MOUNT_FIX)return;

  function place(){
    try{
      const bridge=window.MDM_ACCOUNT_ENTRY_BRIDGE;
      if(!bridge)return false;

      const home=document.querySelector('.hm30');
      let entry=document.getElementById('mdmQuickAccountEntry');

      if(!home){
        if(entry)entry.style.display='none';
        return false;
      }

      if(!entry){
        if(typeof bridge.mount==='function')bridge.mount();
        entry=document.getElementById('mdmQuickAccountEntry');
      }
      if(!entry)return false;

      const header=document.querySelector('.app-header');
      const lang=document.getElementById('langBtn');
      if(!header||!lang)return false;

      const button=entry.querySelector('#mdmQuickAccountIcon');
      if(!button)return false;

      entry.style.cssText='display:flex;align-items:center;justify-content:center;width:56px;height:56px;flex:0 0 56px;margin:0 8px 0 0;position:relative;right:auto;top:auto;z-index:auto';
      button.innerHTML='<svg viewBox="0 0 24 24" width="28" height="28" aria-hidden="true" focusable="false"><path fill="currentColor" d="M15 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4Zm-8-2V7H5v3H2v2h3v3h2v-3h3v-2H7Zm8 4c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4Z"/></svg>';
      button.setAttribute('aria-label','Account');
      button.title='Account';
      button.style.cssText='width:56px;height:56px;border:1px solid rgba(255,255,255,.18);border-radius:16px;background:rgba(255,255,255,.08);box-shadow:none;display:flex;align-items:center;justify-content:center;padding:0;color:#fff;line-height:1;-webkit-tap-highlight-color:transparent;cursor:pointer';

      if(entry.parentElement!==header || entry.nextElementSibling!==lang){
        header.insertBefore(entry,lang);
      }
      return true;
    }catch(_){return false;}
  }

  function schedule(){
    setTimeout(place,30);
    setTimeout(place,120);
  }

  document.addEventListener('click',schedule,false);
  window.addEventListener('pageshow',schedule);
  window.addEventListener('load',schedule,{once:true});
  document.addEventListener('visibilitychange',function(){if(!document.hidden)schedule();});

  window.MDM_ACCOUNT_HOME_MOUNT_FIX=Object.freeze({version:'45.8.31.49.4',place,schedule});
  schedule();
})();
