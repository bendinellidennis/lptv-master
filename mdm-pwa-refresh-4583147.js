/* Malta Driving Master 45.8.31.47 — targeted PWA refresh fix
   Fixes the obsolete cache-preservation logic used by the Help > Update action.
   No MutationObserver. No enforcement changes. */
(function(){
  'use strict';

  const RELEASE='45.8.31.47';
  const CACHE_PREFIX='mdm-build-';

  async function hardRefresh(){
    try{
      const regs=await navigator.serviceWorker?.getRegistrations?.();
      if(Array.isArray(regs)){
        await Promise.all(regs.map(async reg=>{
          try{await reg.update();}catch(_){}
        }));
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

  function bind(){
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

  document.addEventListener('click',function(){
    queueMicrotask(bind);
  },true);

  window.addEventListener('load',function(){
    bind();
  },{once:true});

  window.MDM_PWA_REFRESH_FIX=Object.freeze({version:RELEASE,mode:'targeted',bind});
})();
