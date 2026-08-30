/* Malta Driving Master 45.8.31.47 — targeted PWA refresh + School Dashboard mount fix
   No MutationObserver. No polling. No enforcement changes. */
(function(){
  'use strict';

  const RELEASE='45.8.31.47';

  async function hardRefresh(){
    try{
      const regs=await navigator.serviceWorker?.getRegistrations?.();
      if(Array.isArray(regs)){
        await Promise.all(regs.map(async reg=>{try{await reg.update();}catch(_){}}));
      }else{
        const reg=await navigator.serviceWorker?.getRegistration?.();
        if(reg){try{await reg.update();}catch(_){}}
      }

      if(window.caches){
        const keys=await caches.keys();
        await Promise.all(keys.map(key=>caches.delete(key)));
      }
    }catch(_){}

    try{
      const url=new URL(window.location.href);
      url.searchParams.set('mdm_release',RELEASE.replace(/\./g,'_'));
      window.location.replace(url.toString());
    }catch(_){
      window.location.reload();
    }
  }

  function bindRefresh(){
    const btn=document.getElementById('refreshAppBtn');
    if(!btn||btn.dataset.mdmPwaRefresh4583147==='1')return false;
    btn.dataset.mdmPwaRefresh4583147='1';
    btn.addEventListener('click',function(ev){
      ev.preventDefault();
      ev.stopImmediatePropagation();
      hardRefresh();
    },true);
    return true;
  }

  function mountPilotInvite(){
    try{
      const bridge=window.MDM_PILOT_SCHOOL_DASHBOARD_BRIDGE;
      if(bridge&&typeof bridge.mount==='function')bridge.mount();
    }catch(_){}
  }

  function schedulePilotMount(){
    setTimeout(function(){
      mountPilotInvite();
      requestAnimationFrame(mountPilotInvite);
    },0);
  }

  document.addEventListener('click',function(ev){
    queueMicrotask(bindRefresh);
    try{
      const target=ev.target&&ev.target.closest?ev.target.closest('[data-go="schooldashboard"]'):null;
      if(target)schedulePilotMount();
    }catch(_){}
  },false);

  window.addEventListener('pageshow',schedulePilotMount);
  document.addEventListener('visibilitychange',function(){if(!document.hidden)schedulePilotMount();});
  window.addEventListener('load',function(){
    bindRefresh();
    schedulePilotMount();
  },{once:true});

  window.MDM_PWA_REFRESH_FIX=Object.freeze({version:RELEASE,mode:'targeted',bind:bindRefresh,mountPilotInvite:schedulePilotMount});
})();
