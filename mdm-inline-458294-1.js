/* 45.8.31.50.42 — Pilot invite auth hygiene.
   Before the app runtime reads auth state, keep only the invited student's identity.
   Never expose the previous account email on an invite landing. */
(function(){
  'use strict';
  const AUTH_KEY='mdm_auth_session_v4410';
  const PENDING_KEY='mdm_pilot_pending_invite_v1';
  function norm(v){return String(v||'').trim().toLowerCase();}
  try{
    const url=new URL(location.href);
    const token=String(url.searchParams.get('pilot_invite')||'').trim();
    const email=norm(url.searchParams.get('pilot_email')||'');
    if(token.length>=32&&token.length<=256){
      localStorage.setItem(PENDING_KEY,JSON.stringify({token,email,at:Date.now()}));
    }
    const raw=localStorage.getItem(PENDING_KEY);
    const p=raw?JSON.parse(raw):null;
    if(p&&String(p.token||'').length>=32&&Date.now()-Number(p.at||0)<=7*24*60*60*1000){
      const sraw=localStorage.getItem(AUTH_KEY);
      const s=sraw?JSON.parse(sraw):null;
      const sessionEmail=norm(s?.user?.email||s?.email||'');
      const invitedEmail=norm(p.email||'');
      const expired=Number(s?.expiresAt||0)>0&&Number(s.expiresAt)<=Date.now();
      if(s&&(expired||(invitedEmail&&sessionEmail&&sessionEmail!==invitedEmail))){
        localStorage.removeItem(AUTH_KEY);
      }
    }
  }catch(_){}
})();


/* 45.8.31.50.58 — Invite login privacy scrub, once per invite */
function mdmInviteLoginPrivacyScrub(){
  try{
    const raw=localStorage.getItem('mdm_pilot_pending_invite_v1');
    const p=raw?JSON.parse(raw):null;
    if(!p||String(p.token||'').length<32||Date.now()-Number(p.at||0)>7*24*60*60*1000)return false;

    const input=document.getElementById('mdmAuthEmail');
    let changed=false;

    const marker='mdm_invite_email_blank_once_v1::'+String(p.token||'').slice(0,24);
    let alreadyBlanked=false;
    try{alreadyBlanked=sessionStorage.getItem(marker)==='1';}catch(_){}

    if(input && !alreadyBlanked){
      input.value='';
      try{input.dispatchEvent(new Event('input',{bubbles:true}));}catch(_){}
      try{input.dispatchEvent(new Event('change',{bubbles:true}));}catch(_){}
      try{sessionStorage.setItem(marker,'1');}catch(_){}
      changed=true;
    }

    document.querySelectorAll('.driving-twin-disclaimer').forEach(el=>{
      const msg=String(el.textContent||'').toLowerCase();
      if(msg.includes('invalid jwt')||msg.includes('token is expired')){
        el.textContent='Invito Pilot ricevuto. Inserisci la tua e-mail e password per accedere.';
        changed=true;
      }
    });

    return changed;
  }catch(_){return false;}
}

(function(){try{const raw=localStorage.getItem('mdm-v1-settings'),lang=raw?JSON.parse(raw).lang:'en',el=document.getElementById('mdmStartupSub');if(!el)return;el.textContent=lang==='it'?'Caricamento della tua intelligenza di guida…':lang==='mt'?'Qed titgħabba l-intelliġenza tas-sewqan tiegħek…':'Loading your driving intelligence…';}catch(_){}})();

/* 45.8.31.49.24 — automatic Pilot email/deep-link loader.
   The Profile no longer renders a second "Studenti da attivare" queue.
   Home alert + exact activation modal are owned only by mdm-pwa-refresh-4583147.js.
   The School bridge here only mounts the real invite controls.
   One scoped #screen observer only; no global observer and no polling. */
window.addEventListener('load',function(){
  try{
    if(!window.MDM_PILOT_ACCESS_BRIDGE){const s=document.createElement('script');s.src='mdm-pilot-access-4583146.js?v=45831497';s.async=true;s.setAttribute('data-mdm-pilot-bridge','shadow');document.head.appendChild(s);}
    if(!window.MDM_PILOT_SCHOOL_DASHBOARD_BRIDGE){const school=document.createElement('script');school.src='mdm-pilot-school-dashboard-4583147.js?v=458315057-invite-email-once';school.async=true;school.setAttribute('data-mdm-pilot-school-bridge','shadow');document.head.appendChild(school);}
    if(!window.MDM_PILOT_STUDENT_REDEEM_BRIDGE){const redeem=document.createElement('script');redeem.src='mdm-pilot-student-redeem-4583148.js?v=458315042-pending-only';redeem.async=true;redeem.setAttribute('data-mdm-pilot-student-redeem','shadow');document.head.appendChild(redeem);}
    if(!window.MDM_ACCOUNT_ENTRY_BRIDGE){const account=document.createElement('script');account.src='mdm-account-entry-4583149.js?v=45831496-direct';account.async=true;account.setAttribute('data-mdm-account-entry','quick');document.head.appendChild(account);}
    if(!window.MDM_PWA_REFRESH_FIX){const refresh=document.createElement('script');refresh.src='mdm-pwa-refresh-4583147.js?v=4583149201-direct-modal';refresh.async=true;refresh.setAttribute('data-mdm-pwa-refresh-fix','direct-school-queue');document.head.appendChild(refresh);}

    /* Remove any legacy duplicate seat queue left by an older cached runtime.
       The only activation entry point is now the Home alert -> exact modal. */
    try{document.getElementById('mdmPilotSeatAssignPanel')?.remove();}catch(_){}

    const screen=document.getElementById('screen');
    if(screen&&!window.__MDM_SCHOOL_INVITE_SCREEN_OBSERVER__){
      let raf=0;
      const syncSchoolPilot=function(){
        if(raf)return;
        raf=requestAnimationFrame(function(){
          raf=0;
          try{document.getElementById('mdmPilotSeatAssignPanel')?.remove();}catch(_){}
          try{window.MDM_PILOT_SCHOOL_DASHBOARD_BRIDGE?.mount?.();}catch(_){}
          try{mdmInviteLoginPrivacyScrub();}catch(_){}
        });
      };
      const observer=new MutationObserver(syncSchoolPilot);
      observer.observe(screen,{childList:true,subtree:true});
      window.__MDM_SCHOOL_INVITE_SCREEN_OBSERVER__=observer;
      syncSchoolPilot();
      try{mdmInviteLoginPrivacyScrub();}catch(_){}
    }
  }catch(_){}
},{once:true});
