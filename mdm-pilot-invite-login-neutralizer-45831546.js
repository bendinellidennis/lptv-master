/* Malta Driving Master 45.8.31.50.46 — Pilot Invite Login Neutralizer
   Render-level privacy fix only.
   A fresh/pending Pilot invite never exposes a previous local account email.
   No auth mutation, no storage deletion, no progress/profile mutation. */
(function(){
  'use strict';
  if(window.MDM_PILOT_INVITE_LOGIN_NEUTRALIZER)return;

  const VERSION='45.8.31.50.46';
  const PENDING_KEY='mdm_pilot_pending_invite_v1';

  function pendingInvite(){
    try{
      const raw=localStorage.getItem(PENDING_KEY);
      if(!raw)return false;
      const p=JSON.parse(raw);
      return Boolean(
        p &&
        String(p.token||'').length>=32 &&
        Date.now()-Number(p.at||0)<=7*24*60*60*1000
      );
    }catch(_){return false;}
  }

  function authStatus(){
    try{return String(mdmAuthSession?.status||'');}catch(_){return '';}
  }

  function shouldNeutralize(){
    if(!pendingInvite())return false;
    const status=authStatus();
    return !status || status==='signed_out' || status==='session_expired';
  }

  function neutralMessage(){
    return 'Invito Pilot ricevuto. Inserisci la tua e-mail e password per accedere.';
  }

  function neutralizeHtml(html){
    let out=String(html||'');
    if(!shouldNeutralize())return out;

    out=out.replace(
      /(id="mdmAuthEmail"[^>]*\bvalue=")[^"]*(")/i,
      '$1$2'
    );

    out=out.replace(
      /(<p class="driving-twin-disclaimer">)([\s\S]*?)(<\/p>)/gi,
      function(all,open,body,close){
        const text=String(body||'').toLowerCase();
        if(text.includes('invalid jwt')||text.includes('token is expired')||text.includes('sessione fallita')){
          return open+neutralMessage()+close;
        }
        return all;
      }
    );

    return out;
  }

  function neutralizeDom(){
    if(!shouldNeutralize())return false;
    let changed=false;

    const email=document.getElementById('mdmAuthEmail');
    if(email && email.value!==''){
      email.value='';
      changed=true;
    }

    document.querySelectorAll('.driving-twin-disclaimer').forEach(function(el){
      const text=String(el.textContent||'').toLowerCase();
      if(text.includes('invalid jwt')||text.includes('token is expired')||text.includes('sessione fallita')){
        el.textContent=neutralMessage();
        changed=true;
      }
    });

    return changed;
  }

  function installRenderWrapper(){
    try{
      if(typeof accountEnrollmentViewHtml!=='function')return false;
      if(accountEnrollmentViewHtml.__mdmInviteNeutralized)return true;
      const original=accountEnrollmentViewHtml;
      const wrapped=function(){
        return neutralizeHtml(original.apply(this,arguments));
      };
      Object.defineProperty(wrapped,'__mdmInviteNeutralized',{value:true});
      accountEnrollmentViewHtml=wrapped;
      return true;
    }catch(_){return false;}
  }

  installRenderWrapper();
  neutralizeDom();

  try{
    if(shouldNeutralize() && typeof render==='function' && document.getElementById('mdmAuthEmail')){
      render();
      neutralizeDom();
    }
  }catch(_){}

  window.addEventListener('pageshow',neutralizeDom);
  document.addEventListener('visibilitychange',function(){
    if(!document.hidden)neutralizeDom();
  });

  window.MDM_PILOT_INVITE_LOGIN_NEUTRALIZER=Object.freeze({
    version:VERSION,
    pending:pendingInvite,
    neutralize:neutralizeDom
  });
})();