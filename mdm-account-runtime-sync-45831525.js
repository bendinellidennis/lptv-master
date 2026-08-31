/* Malta Driving Master 45.8.31.50.25 — Stable Account Runtime Sync
   One controlled reload after a real authenticated identity transition.
   Prevents stale in-memory profile/progress state without login/logout loops. */
(function(){
  'use strict';
  if(window.MDM_ACCOUNT_RUNTIME_SYNC)return;

  const VERSION='45.8.31.50.25';
  const AUTH_KEY='mdm_auth_session_v4410';
  const MARK='mdm_account_runtime_user_v45831525';
  const nativeGet=Storage.prototype.getItem;
  const nativeSet=Storage.prototype.setItem;
  const nativeRemove=Storage.prototype.removeItem;
  let timer=0;

  function parse(raw){
    try{
      const s=raw?JSON.parse(String(raw)):null;
      const status=String(s&&s.status||'');
      const userId=String(s&&s.user&&s.user.id||'');
      const expiresAt=Number(s&&s.expiresAt||0);
      return {
        status,
        userId,
        authenticated:status==='authenticated'&&!!userId&&(expiresAt<=0||expiresAt>Date.now())
      };
    }catch(_){return {status:'',userId:'',authenticated:false};}
  }
  function current(){
    try{return parse(nativeGet.call(localStorage,AUTH_KEY));}
    catch(_){return {status:'',userId:'',authenticated:false};}
  }
  function mark(){try{return String(sessionStorage.getItem(MARK)||'');}catch(_){return '';}}
  function setMark(v){try{sessionStorage.setItem(MARK,String(v||''));}catch(_){}}

  function reloadWhenStable(expectedUserId){
    if(timer)clearTimeout(timer);
    timer=setTimeout(function(){
      timer=0;
      const a=current();
      if(!a.authenticated||a.userId!==expectedUserId)return;
      if(mark()===expectedUserId)return;
      setMark(expectedUserId);
      try{
        const url=new URL(location.href);
        url.searchParams.set('mdm_account_sync','45831525');
        location.replace(url.toString());
      }catch(_){try{location.reload();}catch(__){}}
    },700);
  }

  Storage.prototype.setItem=function(key,value){
    const k=String(key);
    const before=(this===localStorage&&k===AUTH_KEY)?current():null;
    const out=nativeSet.apply(this,arguments);
    if(before){
      const after=parse(value);
      if(after.authenticated&&(!before.authenticated||before.userId!==after.userId)){
        reloadWhenStable(after.userId);
      }else if(!after.authenticated&&after.status==='signed_out'){
        setMark('');
      }
    }
    return out;
  };

  Storage.prototype.removeItem=function(key){
    const k=String(key);
    const out=nativeRemove.apply(this,arguments);
    if(this===localStorage&&k===AUTH_KEY)setMark('');
    return out;
  };

  try{
    const a=current();
    const url=new URL(location.href);
    if(url.searchParams.get('mdm_account_sync')==='45831525'){
      url.searchParams.delete('mdm_account_sync');
      history.replaceState(history.state,'',url.toString());
      if(a.authenticated)setMark(a.userId);
    }else if(a.authenticated&&!mark()){
      /* Existing authenticated page load: adopt current runtime as already synced. */
      setMark(a.userId);
    }
  }catch(_){}

  window.MDM_ACCOUNT_RUNTIME_SYNC=Object.freeze({version:VERSION,current});
})();