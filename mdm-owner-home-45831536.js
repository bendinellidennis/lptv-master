/* Malta Driving Master 45.8.38.25.2 — Server-Authoritative Technical Owner Home
   Owner navigation is cosmetic only and is enabled exclusively after MDM_OWNER_AUTHORITY
   confirms the authenticated auth.uid() server-side. */
(function(){
  'use strict';
  if(window.MDM_TECH_OWNER_HOME_GUARD)return;

  const VERSION='45.8.38.25.2';
  function isOwner(){return window.MDM_OWNER_AUTHORITY?.isOwner?.()===true}
  function navButton(){
    try{
      return document.querySelector('[data-nav="home"]')
        || document.querySelector('[data-nav="schoolhome"][data-mdm-owner-home="1"]');
    }catch(_){return null}
  }
  function armOwnerHome(){
    if(!isOwner())return false;
    const btn=navButton();if(!btn)return false;
    btn.setAttribute('data-mdm-owner-home','1');
    btn.setAttribute('data-nav','schoolhome');
    try{document.body?.classList?.add('mdm-tech-owner')}catch(_){}
    return true;
  }
  function restoreStudentHome(){
    const btn=document.querySelector('[data-nav="schoolhome"][data-mdm-owner-home="1"]');
    if(btn){btn.setAttribute('data-nav','home');btn.removeAttribute('data-mdm-owner-home')}
    try{document.body?.classList?.remove('mdm-tech-owner')}catch(_){}
    return Boolean(btn);
  }
  function openOwnerHome(){
    if(!armOwnerHome())return false;
    const btn=navButton();if(!btn)return false;
    try{btn.click();return true}catch(_){return false}
  }
  function sync(){
    if(!isOwner()){restoreStudentHome();return false}
    armOwnerHome();return true;
  }

  document.addEventListener('click',function(ev){
    if(!isOwner()){restoreStudentHome();return}
    const brand=ev.target?.closest?.('.brand');
    if(brand){ev.preventDefault();ev.stopImmediatePropagation();openOwnerHome();return}
    armOwnerHome();
  },true);

  window.addEventListener('popstate',function(){
    if(!sync())return;
    const h=String(location.hash||'');
    if(h===''||h==='#'||h==='#home')openOwnerHome();
  });
  window.addEventListener('mdm:owner-ready',function(){
    if(!sync())return;
    const h=String(location.hash||'');
    if(h===''||h==='#'||h==='#home')openOwnerHome();
  });
  window.addEventListener('mdm:owner-authority',function(){sync()});

  sync();
  if(isOwner()){
    const h=String(location.hash||'');
    if(h===''||h==='#'||h==='#home')openOwnerHome();
  }

  window.MDM_TECH_OWNER_HOME_GUARD=Object.freeze({version:VERSION,active:isOwner,arm:armOwnerHome,open:openOwnerHome,sync});
})();