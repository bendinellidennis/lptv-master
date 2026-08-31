/* Malta Driving Master 45.8.31.50.0 — Account Isolation Diagnostic
   TEMPORARY diagnostic only.
   Purpose: identify localStorage keys touched by account/profile/progress/history/stats flows
   and confirm the active auth user on the same iPhone.
   Non-destructive: does not delete, rewrite, migrate or namespace application data.
   No tokens or stored values are displayed or persisted. */
(function(){
  'use strict';
  if(window.MDM_ACCOUNT_ISOLATION_DIAGNOSTIC)return;

  const AUTH_KEY='mdm_auth_session_v4410';
  const VERSION='45.8.31.50.0-diag';
  const nativeGet=Storage.prototype.getItem;
  const nativeSet=Storage.prototype.setItem;
  const nativeRemove=Storage.prototype.removeItem;
  const nativeClear=Storage.prototype.clear;

  const records=new Map();
  let currentUserId='';
  let currentEmail='';
  let authSwitches=0;
  let renderQueued=false;

  function isLocal(store){
    try{return store===window.localStorage;}catch(_){return false;}
  }

  function parseAuth(raw){
    try{
      const s=raw?JSON.parse(String(raw)):null;
      return {
        status:String(s&&s.status||'signed_out'),
        userId:String(s&&s.user&&s.user.id||''),
        email:String(s&&s.user&&s.user.email||'')
      };
    }catch(_){
      return {status:'invalid',userId:'',email:''};
    }
  }

  function refreshAuthFromNative(){
    try{
      const a=parseAuth(nativeGet.call(localStorage,AUTH_KEY));
      currentUserId=a.userId;
      currentEmail=a.email;
      return a;
    }catch(_){
      currentUserId='';
      currentEmail='';
      return {status:'unavailable',userId:'',email:''};
    }
  }

  function classify(key){
    const k=String(key||'');
    if(k===AUTH_KEY)return 'AUTH';
    if(/profile|student|progress|history|exam|stat|score|quiz|attempt|readiness|recovery|error|training|lesson|result|performance|dna/i.test(k))return 'USER?';
    if(/lang|theme|setting|consent|device|pwa|cache|ui/i.test(k))return 'GLOBAL?';
    return 'OTHER';
  }

  function remember(op,key,value){
    const k=String(key||'');
    if(!k)return;
    const now=Date.now();
    let r=records.get(k);
    if(!r){
      r={key:k,classification:classify(k),get:0,set:0,remove:0,clear:0,lastOp:'',lastAt:0,lastSize:null};
      records.set(k,r);
    }
    if(op==='get')r.get++;
    if(op==='set')r.set++;
    if(op==='remove')r.remove++;
    if(op==='clear')r.clear++;
    r.lastOp=op;
    r.lastAt=now;
    if(typeof value==='string')r.lastSize=value.length;
    queueRender();
  }

  function onAuthWrite(raw){
    const before=currentUserId;
    const a=parseAuth(raw);
    currentUserId=a.userId;
    currentEmail=a.email;
    if(before&&a.userId&&before!==a.userId)authSwitches++;
    queueRender();
  }

  Storage.prototype.getItem=function(key){
    const out=nativeGet.apply(this,arguments);
    if(isLocal(this))remember('get',key,out);
    return out;
  };

  Storage.prototype.setItem=function(key,value){
    const out=nativeSet.apply(this,arguments);
    if(isLocal(this)){
      remember('set',key,String(value));
      if(String(key)===AUTH_KEY)onAuthWrite(value);
    }
    return out;
  };

  Storage.prototype.removeItem=function(key){
    const out=nativeRemove.apply(this,arguments);
    if(isLocal(this)){
      remember('remove',key,null);
      if(String(key)===AUTH_KEY){
        currentUserId='';
        currentEmail='';
        queueRender();
      }
    }
    return out;
  };

  Storage.prototype.clear=function(){
    const out=nativeClear.apply(this,arguments);
    if(isLocal(this)){
      records.set('[localStorage.clear]',{key:'[localStorage.clear]',classification:'DANGER',get:0,set:0,remove:0,clear:1,lastOp:'clear',lastAt:Date.now(),lastSize:null});
      currentUserId='';
      currentEmail='';
      queueRender();
    }
    return out;
  };

  function esc(v){
    return String(v??'').replace(/[&<>"']/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
  }

  function sortedRecords(){
    const rank={'USER?':0,'AUTH':1,'OTHER':2,'GLOBAL?':3,'DANGER':4};
    return Array.from(records.values()).sort((a,b)=>{
      const ra=rank[a.classification]??9,rb=rank[b.classification]??9;
      if(ra!==rb)return ra-rb;
      return b.lastAt-a.lastAt;
    });
  }

  function authLabel(){
    const id=currentUserId?currentUserId.slice(0,8)+'…':'—';
    const email=currentEmail||'—';
    return 'AUTH '+id+' · '+email;
  }

  function ensureBadge(){
    if(!document.body)return null;
    let el=document.getElementById('mdmIsoDiagBadge');
    if(el)return el;
    el=document.createElement('button');
    el.id='mdmIsoDiagBadge';
    el.type='button';
    el.style.cssText='position:fixed;left:10px;bottom:calc(10px + env(safe-area-inset-bottom));z-index:1000000;border:0;border-radius:12px;padding:8px 10px;background:rgba(96,45,8,.93);color:#fff;font:800 10px/1.25 system-ui;box-shadow:0 6px 18px rgba(0,0,0,.22);max-width:74vw;text-align:left';
    el.onclick=showPanel;
    document.body.appendChild(el);
    return el;
  }

  function updateBadge(){
    const el=ensureBadge();
    if(!el)return;
    const suspects=Array.from(records.values()).filter(r=>r.classification==='USER?').length;
    el.textContent='ISO DIAG · '+suspects+' suspect · '+authLabel();
  }

  function showPanel(){
    let modal=document.getElementById('mdmIsoDiagPanel');
    if(modal){modal.remove();return;}
    modal=document.createElement('div');
    modal.id='mdmIsoDiagPanel';
    modal.style.cssText='position:fixed;inset:0;z-index:1000001;background:rgba(2,12,20,.74);display:flex;align-items:center;justify-content:center;padding:14px';
    const rows=sortedRecords();
    const suspect=rows.filter(r=>r.classification==='USER?'||r.classification==='AUTH'||r.classification==='DANGER');
    const all=rows.slice(0,40);
    const renderRows=list=>list.length?list.map(r=>'<div style="padding:7px 0;border-bottom:1px solid rgba(0,0,0,.08);word-break:break-word"><b>'+esc(r.classification)+'</b> · <code>'+esc(r.key)+'</code><br><span style="opacity:.72">get '+r.get+' · set '+r.set+' · remove '+r.remove+(r.lastSize!==null?' · size '+r.lastSize:'')+'</span></div>').join(''):'<div style="opacity:.7">Nessuna chiave ancora rilevata.</div>';
    modal.innerHTML='<div style="width:min(560px,100%);max-height:88vh;overflow:auto;background:#fff;color:#123548;border-radius:18px;padding:16px;box-shadow:0 20px 60px rgba(0,0,0,.32)">'+
      '<div style="display:flex;justify-content:space-between;gap:10px;align-items:flex-start"><div><strong>Account Isolation Diagnostic</strong><div style="font-size:11px;opacity:.72;margin-top:3px">'+esc(VERSION)+'</div></div><button id="mdmIsoDiagClose" type="button" style="border:0;background:transparent;font-size:22px">×</button></div>'+
      '<div style="margin-top:10px;padding:10px;border-radius:10px;background:#f1f5f7;font-size:12px"><b>'+esc(authLabel())+'</b><br>Auth switch rilevati: '+authSwitches+'<br>Valori e token: NON mostrati / NON salvati.</div>'+
      '<h4 style="margin:14px 0 4px">Chiavi sospette / auth</h4>'+renderRows(suspect)+
      '<h4 style="margin:14px 0 4px">Ultime chiavi toccate (max 40)</h4>'+renderRows(all)+
      '</div>';
    document.body.appendChild(modal);
    modal.querySelector('#mdmIsoDiagClose').onclick=()=>modal.remove();
    modal.addEventListener('click',e=>{if(e.target===modal)modal.remove();});
  }

  function queueRender(){
    if(renderQueued)return;
    renderQueued=true;
    try{
      requestAnimationFrame(()=>{renderQueued=false;updateBadge();});
    }catch(_){
      renderQueued=false;
      setTimeout(updateBadge,0);
    }
  }

  refreshAuthFromNative();
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',updateBadge,{once:true});
  else updateBadge();

  window.addEventListener('pageshow',()=>{refreshAuthFromNative();updateBadge();});
  document.addEventListener('visibilitychange',()=>{if(!document.hidden){refreshAuthFromNative();updateBadge();}});

  window.MDM_ACCOUNT_ISOLATION_DIAGNOSTIC=Object.freeze({
    version:VERSION,
    getReport:()=>({
      auth:{userId:currentUserId,email:currentEmail,switches:authSwitches},
      keys:sortedRecords().map(r=>Object.assign({},r))
    }),
    show:showPanel
  });
})();
