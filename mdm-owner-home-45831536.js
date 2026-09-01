/* Malta Driving Master 45.8.31.50.37 — Technical Owner Home Separation
   Maps the technical Owner's Home to the existing School/Operations Home.
   No reloads, no polling, no timers, no auth mutation, no data copying. */
(function(){
  'use strict';
  if(window.MDM_TECH_OWNER_HOME_GUARD)return;

  const VERSION='45.8.31.50.36';
  const AUTH_KEY='mdm_auth_session_v4410';
  const OWNER_EMAIL='maltadrivingmaster@gmail.com';

  function readSession(){
    try{
      const raw=localStorage.getItem(AUTH_KEY);
      const s=raw?JSON.parse(raw):null;
      if(!s||s.status!=='authenticated'||!s.user?.id)return null;
      if(Number(s.expiresAt||0)>0&&Number(s.expiresAt)<=Date.now())return null;
      const email=String(s.user?.email||s.email||'').trim().toLowerCase();
      return email===OWNER_EMAIL?s:null;
    }catch(_){return null;}
  }

  function isOwner(){return Boolean(readSession());}

  function ownerHome(push){
    if(!isOwner())return false;
    try{document.body?.classList?.add('mdm-tech-owner');}catch(_){}
    try{
      if(typeof window.go==='function'){
        if(!push)history.replaceState({name:'schoolhome',data:null},'', '#schoolhome');
        window.go('schoolhome',null,Boolean(push));
        return true;
      }
    }catch(_){}
    return false;
  }

  function homeTarget(target){
    try{
      const el=target&&target.closest?target.closest('[data-nav="home"],[data-go="home"],.brand'):null;
      return el||null;
    }catch(_){return null;}
  }

  document.addEventListener('click',function(ev){
    if(!isOwner())return;
    if(!homeTarget(ev.target))return;
    ev.preventDefault();
    ev.stopImmediatePropagation();
    ownerHome(true);
  },true);

  window.addEventListener('popstate',function(){
    if(!isOwner())return;
    const h=String(location.hash||'');
    if(h===''||h==='#'||h==='#home')ownerHome(false);
  });

  window.addEventListener('mdm:owner-ready',function(){
    ownerHome(false);
  });

  const initialHash=String(location.hash||'');
  if(isOwner()&&(initialHash===''||initialHash==='#'||initialHash==='#home')){
    ownerHome(false);
  }

  window.MDM_TECH_OWNER_HOME_GUARD=Object.freeze({
    version:VERSION,
    active:isOwner,
    open:()=>ownerHome(true)
  });
})();