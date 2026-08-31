/* Malta Driving Master 45.8.31.50.27 — One-Shot Logout Reload
   Exactly one controlled reload on authenticated -> signed_out.
   No pageshow routing, no polling, no repeated timers, no persistent masks. */
(function(){
  'use strict';
  if(window.MDM_LOGOUT_ONCE)return;

  const VERSION='45.8.31.50.27';
  const AUTH_KEY='mdm_auth_session_v4410';
  const GUARD='mdm_logout_once_guard_v45831527';
  const Q='mdm_logout_once';
  const get0=Storage.prototype.getItem;
  const set0=Storage.prototype.setItem;
  const remove0=Storage.prototype.removeItem;
  const clear0=Storage.prototype.clear;
  let fired=false;

  function parse(raw){
    try{
      const s=raw?JSON.parse(String(raw)):null;
      const status=String(s&&s.status||'');
      const userId=String(s&&s.user&&s.user.id||'');
      const exp=Number(s&&s.expiresAt||0);
      return {
        status,
        authenticated:status==='authenticated'&&!!userId&&(exp<=0||exp>Date.now()),
        signedOut:status==='signed_out'||status===''
      };
    }catch(_){return {status:'',authenticated:false,signedOut:true};}
  }

  function current(){
    try{return parse(get0.call(localStorage,AUTH_KEY));}
    catch(_){return {status:'',authenticated:false,signedOut:true};}
  }

  function clearPrivateScreen(){
    try{
      const screen=document.getElementById('screen');
      if(screen)screen.innerHTML='';
    }catch(_){}
  }

  function reloadOnce(){
    if(fired)return;
    const st=current();
    if(!st.signedOut||st.authenticated)return;
    try{
      if(sessionStorage.getItem(GUARD)==='1')return;
      sessionStorage.setItem(GUARD,'1');
    }catch(_){}
    fired=true;
    clearPrivateScreen();
    setTimeout(function(){
      try{
        const url=new URL(location.href);
        url.hash='';
        url.searchParams.set(Q,'45831527');
        location.replace(url.toString());
      }catch(_){try{location.reload();}catch(__){}}
    },80);
  }

  Storage.prototype.setItem=function(key,value){
    const k=String(key);
    const before=(this===localStorage&&k===AUTH_KEY)?current():null;
    const out=set0.apply(this,arguments);
    if(before){
      const after=parse(value);
      if(after.authenticated){
        try{sessionStorage.removeItem(GUARD);}catch(_){}
        fired=false;
      }else if(before.authenticated&&after.signedOut){
        reloadOnce();
      }
    }
    return out;
  };

  Storage.prototype.removeItem=function(key){
    const k=String(key);
    const before=(this===localStorage&&k===AUTH_KEY)?current():null;
    const out=remove0.apply(this,arguments);
    if(before&&before.authenticated)setTimeout(reloadOnce,0);
    return out;
  };

  Storage.prototype.clear=function(){
    const before=this===localStorage?current():null;
    const out=clear0.apply(this,arguments);
    if(before&&before.authenticated)setTimeout(reloadOnce,0);
    return out;
  };

  try{
    const url=new URL(location.href);
    if(url.searchParams.get(Q)==='45831527'){
      url.searchParams.delete(Q);
      history.replaceState(history.state,'',url.toString());
      setTimeout(function(){
        try{sessionStorage.removeItem(GUARD);}catch(_){}
      },1500);
    }else if(current().authenticated){
      try{sessionStorage.removeItem(GUARD);}catch(_){}
    }
  }catch(_){}

  window.MDM_LOGOUT_ONCE=Object.freeze({version:VERSION,reloadOnce});
})();