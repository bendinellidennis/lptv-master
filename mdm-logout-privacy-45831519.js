/* Malta Driving Master 45.8.31.50.20 — Logout Privacy & Immediate Signed-Out Routing
   Prevents stale personal/profile UI from remaining visible after auth logout.
   Does not delete user data. It only reacts to authenticated -> signed_out and routes
   the signed-out shell back to Home/Welcome without requiring app restart. */
(function(){
  'use strict';
  if(window.MDM_LOGOUT_PRIVACY_GUARD)return;
  const VERSION='45.8.31.50.19';
  const AUTH_KEY='mdm_auth_session_v4410';
  const lowerGet=Storage.prototype.getItem;
  const lowerSet=Storage.prototype.setItem;
  const lowerRemove=Storage.prototype.removeItem;
  const lowerClear=Storage.prototype.clear;
  let navigating=false;

  function read(){
    try{
      const s=JSON.parse(lowerGet.call(localStorage,AUTH_KEY)||'null');
      return {authenticated:Boolean(s&&s.status==='authenticated'&&s.user&&s.user.id),userId:String(s&&s.user&&s.user.id||'')};
    }catch(_){return {authenticated:false,userId:''};}
  }
  function parse(raw){
    try{
      const s=raw?JSON.parse(String(raw)):null;
      return {authenticated:Boolean(s&&s.status==='authenticated'&&s.user&&s.user.id),userId:String(s&&s.user&&s.user.id||'')};
    }catch(_){return {authenticated:false,userId:''};}
  }
  function mask(){
    try{
      document.documentElement.setAttribute('data-mdm-logout-transition','1');
      let style=document.getElementById('mdmLogoutPrivacyStyle');
      if(!style){
        style=document.createElement('style');
        style.id='mdmLogoutPrivacyStyle';
        style.textContent='html[data-mdm-logout-transition="1"] main{visibility:hidden!important}';
        (document.head||document.documentElement).appendChild(style);
      }
    }catch(_){}
  }
  function unmaskOnlyWhenWelcome(){
    try{
      if(document.querySelector('.hm30'))document.documentElement.removeAttribute('data-mdm-logout-transition');
    }catch(_){}
  }
  function goSignedOut(){
    if(navigating)return;
    navigating=true;
    mask();
    setTimeout(function(){
      try{
        const url=new URL(location.href);
        url.hash='';
        url.searchParams.set('mdm_logout_refresh','45831519');
        location.replace(url.toString());
      }catch(_){try{location.reload();}catch(__){}}
    },60);
  }
  function routeWelcomeIfSignedOut(){
    if(read().authenticated){document.documentElement.removeAttribute('data-mdm-logout-transition');return false;}
    mask();
    try{
      if(document.querySelector('.hm30')){unmaskOnlyWhenWelcome();return true;}
      const home=document.querySelector('[data-nav="home"]')||document.querySelector('[data-action="home"]');
      if(home&&typeof home.click==='function')home.click();
      setTimeout(unmaskOnlyWhenWelcome,80);
      return true;
    }catch(_){}
    return false;
  }

  Storage.prototype.setItem=function(key,value){
    const before=(this===localStorage&&String(key)===AUTH_KEY)?read():null;
    const out=lowerSet.apply(this,arguments);
    if(before){
      const after=parse(value);
      if(before.authenticated&&!after.authenticated)goSignedOut();
    }
    return out;
  };
  Storage.prototype.removeItem=function(key){
    const before=(this===localStorage&&String(key)===AUTH_KEY)?read():null;
    const out=lowerRemove.apply(this,arguments);
    if(before&&before.authenticated)goSignedOut();
    return out;
  };
  Storage.prototype.clear=function(){
    const before=this===localStorage?read():null;
    const out=lowerClear.apply(this,arguments);
    if(before&&before.authenticated)goSignedOut();
    return out;
  };

  function isLogoutClick(target){
    try{
      const el=target&&target.closest?target.closest('button,a,[role="button"]'):null;
      if(!el)return false;
      const s=((el.innerText||el.textContent||'')+' '+(el.getAttribute('aria-label')||'')+' '+(el.id||'')).replace(/\s+/g,' ').trim().toLowerCase();
      return /\b(esci|logout|sign out|disconnetti|disconnect)\b/.test(s)&&s.length<100;
    }catch(_){return false;}
  }
  document.addEventListener('click',function(ev){
    if(!isLogoutClick(ev.target))return;
    [80,250,700,1500].forEach(ms=>setTimeout(function(){if(!read().authenticated)goSignedOut();},ms));
  },true);

  function settle(){
    try{
      const url=new URL(location.href);
      if(url.searchParams.get('mdm_logout_refresh')==='45831519'){
        url.searchParams.delete('mdm_logout_refresh');
        history.replaceState(history.state,'',url.toString());
      }
    }catch(_){}
    if(!read().authenticated){
      mask();
      [80,250,700,1500,3000].forEach(ms=>setTimeout(routeWelcomeIfSignedOut,ms));
    }
  }
  window.addEventListener('pageshow',settle);
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',settle,{once:true});else settle();

  window.MDM_LOGOUT_PRIVACY_GUARD=Object.freeze({version:VERSION,routeWelcomeIfSignedOut});
})();