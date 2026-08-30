/* Malta Driving Master 45.8.31.47 — targeted PWA refresh + real Server School Console mount fix
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

  function ensureRealServerHost(){
    try{
      if(document.querySelector('.dashboard-invites-card'))return true;
      const consoleCard=document.querySelector('.account-enroll-card');
      if(!consoleCard)return false;
      const host=document.createElement('div');
      host.className='dashboard-invites-card';
      host.setAttribute('data-mdm-real-server-invite-host','45.8.31.47');
      host.style.marginTop='14px';
      consoleCard.appendChild(host);
      return true;
    }catch(_){return false;}
  }

  function mountPilotInvite(){
    try{
      if(!ensureRealServerHost())return false;
      const bridge=window.MDM_PILOT_SCHOOL_DASHBOARD_BRIDGE;
      if(bridge&&typeof bridge.mount==='function')return bridge.mount();
    }catch(_){}
    return false;
  }

  function schedulePilotMount(){
    setTimeout(function(){
      mountPilotInvite();
      requestAnimationFrame(mountPilotInvite);
    },0);
  }

  document.addEventListener('click',function(){
    queueMicrotask(bindRefresh);
    schedulePilotMount();
  },false);

  window.addEventListener('pageshow',schedulePilotMount);
  document.addEventListener('visibilitychange',function(){if(!document.hidden)schedulePilotMount();});
  window.addEventListener('load',function(){
    bindRefresh();
    schedulePilotMount();
  },{once:true});

  window.MDM_PWA_REFRESH_FIX=Object.freeze({version:RELEASE,mode:'targeted',bind:bindRefresh,mountPilotInvite:schedulePilotMount});
})();
