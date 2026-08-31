
(function(){try{const raw=localStorage.getItem('mdm-v1-settings'),lang=raw?JSON.parse(raw).lang:'en',el=document.getElementById('mdmStartupSub');if(!el)return;el.textContent=lang==='it'?'Caricamento della tua intelligenza di guida…':lang==='mt'?'Qed titgħabba l-intelliġenza tas-sewqan tiegħek…':'Loading your driving intelligence…';}catch(_){}})();

/* 45.8.31.49.24 — automatic Pilot email/deep-link loader.
   The Profile no longer renders a second "Studenti da attivare" queue.
   Home alert + exact activation modal are owned only by mdm-pwa-refresh-4583147.js.
   The School bridge here only mounts the real invite controls.
   One scoped #screen observer only; no global observer and no polling. */
window.addEventListener('load',function(){
  try{
    if(!window.MDM_PILOT_ACCESS_BRIDGE){const s=document.createElement('script');s.src='mdm-pilot-access-4583146.js?v=45831497';s.async=true;s.setAttribute('data-mdm-pilot-bridge','shadow');document.head.appendChild(s);}
    if(!window.MDM_PILOT_SCHOOL_DASHBOARD_BRIDGE){const school=document.createElement('script');school.src='mdm-pilot-school-dashboard-4583147.js?v=45831478-email-deeplink';school.async=true;school.setAttribute('data-mdm-pilot-school-bridge','shadow');document.head.appendChild(school);}
    if(!window.MDM_PILOT_STUDENT_REDEEM_BRIDGE){const redeem=document.createElement('script');redeem.src='mdm-pilot-student-redeem-4583148.js?v=45831483-deterministic';redeem.async=true;redeem.setAttribute('data-mdm-pilot-student-redeem','shadow');document.head.appendChild(redeem);}
    if(!window.MDM_ACCOUNT_ENTRY_BRIDGE){const account=document.createElement('script');account.src='mdm-account-entry-4583149.js?v=45831496-direct';account.async=true;account.setAttribute('data-mdm-account-entry','quick');document.head.appendChild(account);}
    if(!window.MDM_PWA_REFRESH_FIX){const refresh=document.createElement('script');refresh.src='mdm-pwa-refresh-4583147.js?v=458314925-no-flash';refresh.async=true;refresh.setAttribute('data-mdm-pwa-refresh-fix','direct-school-queue');document.head.appendChild(refresh);}

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
        });
      };
      const observer=new MutationObserver(syncSchoolPilot);
      observer.observe(screen,{childList:true,subtree:true});
      window.__MDM_SCHOOL_INVITE_SCREEN_OBSERVER__=observer;
      syncSchoolPilot();
    }
  }catch(_){}
},{once:true});
