/* Malta Driving Master 45.8.31.49.3 — native Home account icon mount
   Places the account entry as the first compact Home control, matching the existing Home visual language.
   Removes the full-width account bar. Slightly larger touch target because account access is the first action.
   No MutationObserver. No polling. No enforcement changes. */
(function(){
  'use strict';
  if(window.MDM_ACCOUNT_HOME_MOUNT_FIX)return;

  function place(){
    try{
      const bridge=window.MDM_ACCOUNT_ENTRY_BRIDGE;
      if(!bridge)return false;

      const home=document.querySelector('.hm30');
      const top=home&&home.querySelector('.hm30-top');
      if(!home||!top)return false;

      let entry=document.getElementById('mdmQuickAccountEntry');
      if(!entry){
        if(typeof bridge.mount==='function')bridge.mount();
        entry=document.getElementById('mdmQuickAccountEntry');
      }
      if(!entry)return false;

      const button=entry.querySelector('#mdmQuickAccountIcon');
      if(button){
        button.innerHTML='<svg viewBox="0 0 24 24" width="30" height="30" aria-hidden="true" focusable="false"><path fill="currentColor" d="M12 12a5 5 0 1 0 0-10 5 5 0 0 0 0 10Zm0 2c-5.05 0-9 2.53-9 5.75C3 21.02 4.03 22 5.3 22h13.4c1.27 0 2.3-.98 2.3-2.25C21 16.53 17.05 14 12 14Z"/></svg>';
        button.style.cssText='width:60px;height:60px;border:1px solid rgba(30,110,210,.16);border-radius:18px;background:var(--card,#fff);box-shadow:0 6px 18px rgba(24,85,150,.12);display:flex;align-items:center;justify-content:center;line-height:1;padding:0;color:#0b5fb3;-webkit-tap-highlight-color:transparent;cursor:pointer';
      }

      entry.style.cssText='display:flex;align-items:center;justify-content:center;width:60px;height:60px;flex:0 0 60px;margin:0 10px 10px 0;position:relative;right:auto;top:auto;z-index:auto';

      if(entry.parentElement!==top || top.firstElementChild!==entry){
        top.insertBefore(entry,top.firstElementChild);
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

  window.MDM_ACCOUNT_HOME_MOUNT_FIX=Object.freeze({version:'45.8.31.49.3',place,schedule});
  schedule();
})();
