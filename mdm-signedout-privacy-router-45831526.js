/* Malta Driving Master 45.8.31.50.26 — Signed-Out Privacy Router
   Stable, no reload loop. On real signed_out it immediately removes stale private
   screen content, then asks the existing app router to mount the public Home.
   If the router is slow, a safe non-personal fallback is shown instead of a blank page. */
(function(){
  'use strict';
  if(window.MDM_SIGNED_OUT_PRIVACY_ROUTER)return;

  const VERSION='45.8.31.50.26';
  const AUTH_KEY='mdm_auth_session_v4410';
  const baseGet=Storage.prototype.getItem;
  const baseSet=Storage.prototype.setItem;
  const baseRemove=Storage.prototype.removeItem;
  const baseClear=Storage.prototype.clear;
  let routing=false;

  function stateFrom(raw){
    try{
      const s=raw?JSON.parse(String(raw)):null;
      const status=String(s&&s.status||'');
      const userId=String(s&&s.user&&s.user.id||'');
      const expiresAt=Number(s&&s.expiresAt||0);
      return {
        status,
        userId,
        authenticated:status==='authenticated'&&!!userId&&(expiresAt<=0||expiresAt>Date.now()),
        signedOut:status==='signed_out'||status===''
      };
    }catch(_){return {status:'',userId:'',authenticated:false,signedOut:true};}
  }
  function state(){
    try{return stateFrom(baseGet.call(localStorage,AUTH_KEY));}
    catch(_){return {status:'',userId:'',authenticated:false,signedOut:true};}
  }
  function isPublic(){
    try{
      const screen=document.getElementById('screen');
      const t=String(screen&&screen.innerText||'').replace(/\s+/g,' ').toLowerCase();
      return t.includes('benvenuto in malta driving master') ||
             t.includes('welcome to malta driving master') ||
             t.includes('come utilizzerai la piattaforma') ||
             t.includes('how will you use the platform');
    }catch(_){return false;}
  }
  function safeFallback(){
    const screen=document.getElementById('screen');
    if(!screen)return;
    screen.innerHTML='<section style="padding:34px 22px;text-align:center"><div style="font-size:56px;font-weight:900;color:#315a98">MDM</div><h1 style="font-size:32px;line-height:1.08;margin:20px 0 10px">Benvenuto in Malta Driving Master</h1><p style="font-size:17px;opacity:.7">Preparati all\'esame. Rispetta la strada. Proteggi ogni passeggero.</p></section>';
  }
  function clearPrivateScreen(){
    try{
      const screen=document.getElementById('screen');
      if(screen)screen.innerHTML='';
    }catch(_){}
  }
  function tryPublicHome(){
    try{
      const btn=document.querySelector('[data-nav="home"]')||document.querySelector('[data-action="home"]');
      if(btn&&typeof btn.click==='function'){btn.click();return true;}
    }catch(_){}
    return false;
  }
  function routeSignedOut(){
    const st=state();
    if(!st.signedOut||st.authenticated)return false;
    if(routing)return true;
    routing=true;
    clearPrivateScreen();
    tryPublicHome();
    [120,350,800].forEach(ms=>setTimeout(function(){
      if(state().authenticated){routing=false;return;}
      if(isPublic()){routing=false;return;}
      tryPublicHome();
    },ms));
    setTimeout(function(){
      if(!state().authenticated&&!isPublic())safeFallback();
      routing=false;
    },1200);
    return true;
  }

  Storage.prototype.setItem=function(key,value){
    const k=String(key);
    const before=(this===localStorage&&k===AUTH_KEY)?state():null;
    const out=baseSet.apply(this,arguments);
    if(before){
      const after=stateFrom(value);
      if(after.signedOut&&!after.authenticated)routeSignedOut();
    }
    return out;
  };
  Storage.prototype.removeItem=function(key){
    const k=String(key);
    const was=(this===localStorage&&k===AUTH_KEY)?state():null;
    const out=baseRemove.apply(this,arguments);
    if(was&&was.authenticated)setTimeout(routeSignedOut,0);
    return out;
  };
  Storage.prototype.clear=function(){
    const was=this===localStorage?state():null;
    const out=baseClear.apply(this,arguments);
    if(was&&was.authenticated)setTimeout(routeSignedOut,0);
    return out;
  };

  function settle(){
    const st=state();
    if(st.signedOut&&!st.authenticated)routeSignedOut();
  }
  window.addEventListener('pageshow',settle);
  document.addEventListener('visibilitychange',()=>{if(!document.hidden)settle();});
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',settle,{once:true});else settle();

  window.MDM_SIGNED_OUT_PRIVACY_ROUTER=Object.freeze({version:VERSION,routeSignedOut});
})();