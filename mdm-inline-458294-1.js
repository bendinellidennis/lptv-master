
(function(){try{const raw=localStorage.getItem('mdm-v1-settings'),lang=raw?JSON.parse(raw).lang:'en',el=document.getElementById('mdmStartupSub');if(!el)return;el.textContent=lang==='it'?'Caricamento della tua intelligenza di guida…':lang==='mt'?'Qed titgħabba l-intelliġenza tas-sewqan tiegħek…':'Loading your driving intelligence…';}catch(_){}})();

/* 45.8.31.46/47/48 — load Pilot shadow bridges and targeted PWA refresh fix
   only after the stable app and every declared page resource completed loading. */
window.addEventListener('load',function(){
  try{
    if(!window.MDM_PILOT_ACCESS_BRIDGE){
      const s=document.createElement('script');
      s.src='mdm-pilot-access-4583146.js?v=4583146-session-v2';
      s.async=true;
      s.setAttribute('data-mdm-pilot-bridge','shadow');
      document.head.appendChild(s);
    }

    if(!window.MDM_PILOT_SCHOOL_DASHBOARD_BRIDGE){
      const school=document.createElement('script');
      school.src='mdm-pilot-school-dashboard-4583147.js?v=4583147-invite-v1';
      school.async=true;
      school.setAttribute('data-mdm-pilot-school-bridge','shadow');
      document.head.appendChild(school);
    }

    if(!window.MDM_PILOT_STUDENT_REDEEM_BRIDGE){
      const redeem=document.createElement('script');
      redeem.src='mdm-pilot-student-redeem-4583148.js?v=4583148-redeem-v1';
      redeem.async=true;
      redeem.setAttribute('data-mdm-pilot-student-redeem','shadow');
      document.head.appendChild(redeem);
    }

    if(!window.MDM_PWA_REFRESH_FIX){
      const refresh=document.createElement('script');
      refresh.src='mdm-pwa-refresh-4583147.js?v=4583147-refresh-v1';
      refresh.async=true;
      refresh.setAttribute('data-mdm-pwa-refresh-fix','targeted');
      document.head.appendChild(refresh);
    }
  }catch(_){}
},{once:true});
