/* Malta Driving Master 45.8.31.50.38 — Technical Owner Home Navigation Fix
   Uses the app's own existing bottom-nav handler instead of calling a private/global route function.
   No reloads, no polling, no timers, no auth mutation, no data copying. */
(function(){
  'use strict';
  if(window.MDM_TECH_OWNER_HOME_GUARD)return;

  const VERSION='45.8.31.50.38';
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

  function navButton(){
    try{
      return document.querySelector('[data-nav="home"]')
        || document.querySelector('[data-nav="schoolhome"][data-mdm-owner-home="1"]');
    }catch(_){return null;}
  }

  function armOwnerHome(){
    if(!isOwner())return false;
    const btn=navButton();
    if(!btn)return false;
    btn.setAttribute('data-mdm-owner-home','1');
    btn.setAttribute('data-nav','schoolhome');
    try{document.body?.classList?.add('mdm-tech-owner');}catch(_){}
    return true;
  }

  function restoreStudentHome(){
    const btn=document.querySelector('[data-nav="schoolhome"][data-mdm-owner-home="1"]');
    if(!btn)return false;
    btn.setAttribute('data-nav','home');
    btn.removeAttribute('data-mdm-owner-home');
    try{document.body?.classList?.remove('mdm-tech-owner');}catch(_){}
    return true;
  }

  function openOwnerHome(){
    if(!armOwnerHome())return false;
    const btn=navButton();
    if(!btn)return false;
    try{btn.click();return true;}catch(_){return false;}
  }

  document.addEventListener('click',function(ev){
    if(!isOwner()){
      restoreStudentHome();
      return;
    }
    const brand=ev.target&&ev.target.closest?ev.target.closest('.brand'):null;
    if(brand){
      ev.preventDefault();
      ev.stopImmediatePropagation();
      openOwnerHome();
      return;
    }
    armOwnerHome();
  },true);

  window.addEventListener('popstate',function(){
    if(!isOwner()){restoreStudentHome();return;}
    const h=String(location.hash||'');
    if(h===''||h==='#'||h==='#home')openOwnerHome();
  });

  window.addEventListener('mdm:owner-ready',function(){
    if(!isOwner())return;
    armOwnerHome();
    const h=String(location.hash||'');
    if(h===''||h==='#'||h==='#home')openOwnerHome();
  });

  if(isOwner()){
    armOwnerHome();
    const h=String(location.hash||'');
    if(h===''||h==='#'||h==='#home')openOwnerHome();
  }else{
    restoreStudentHome();
  }

  window.MDM_TECH_OWNER_HOME_GUARD=Object.freeze({
    version:VERSION,
    active:isOwner,
    arm:armOwnerHome,
    open:openOwnerHome
  });
})();