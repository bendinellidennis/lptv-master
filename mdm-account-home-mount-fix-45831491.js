/* Malta Driving Master 45.8.31.49.1 — deterministic Home mount for quick account entry
   Moves the existing quick account control into the real #screen Home content after render.
   No MutationObserver. No polling. No enforcement changes. */
(function(){
  'use strict';
  if(window.MDM_ACCOUNT_HOME_MOUNT_FIX)return;

  function place(){
    try{
      const bridge=window.MDM_ACCOUNT_ENTRY_BRIDGE;
      if(!bridge)return false;
      const screen=document.getElementById('screen');
      if(!screen)return false;
      const welcome=screen.querySelector('.premium-home-welcome');
      if(!welcome)return false;

      let entry=document.getElementById('mdmQuickAccountEntry');
      if(!entry){
        if(typeof bridge.mount==='function')bridge.mount();
        entry=document.getElementById('mdmQuickAccountEntry');
      }
      if(!entry)return false;

      if(entry.parentElement!==welcome)welcome.appendChild(entry);
      entry.style.cssText='display:flex;gap:8px;flex-wrap:wrap;margin-top:12px;position:relative;right:auto;top:auto;z-index:auto;justify-content:flex-start';
      return true;
    }catch(_){return false;}
  }

  function schedule(){
    setTimeout(place,40);
    setTimeout(place,180);
  }

  document.addEventListener('click',schedule,false);
  window.addEventListener('pageshow',schedule);
  window.addEventListener('load',schedule,{once:true});
  document.addEventListener('visibilitychange',function(){if(!document.hidden)schedule();});

  window.MDM_ACCOUNT_HOME_MOUNT_FIX=Object.freeze({version:'45.8.31.49.1',place,schedule});
  schedule();
})();
