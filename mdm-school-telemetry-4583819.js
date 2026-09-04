/* Malta Driving Master 45.8.38.25.2.1 — School-only Telemetry bootstrap
   Telemetry and the School Evidence entry are loaded only inside the server-authorized School Home.
   Student Home never mounts these School tools. */
(function(){
'use strict';
if(window.MDM_SCHOOL_TELEMETRY_BOOTSTRAP_458382521)return;
window.MDM_SCHOOL_TELEMETRY_BOOTSTRAP_458382521=true;

let started=false;
function routeName(){return String(location.hash||'').replace(/^#/,'').split('?')[0].trim();}
function authorizedSchoolHome(){
 if(routeName()!=='schoolhome')return false;
 if(window.MDM_OWNER_AUTHORITY?.isOwner?.()===true)return true;
 const s=window.MDM_PRIVILEGED_ROUTE_GUARD?.schoolSnapshot?.();
 return Boolean(s&&s.status==='verified'&&s.authorized===true);
}
function cleanStudentHome(){
 document.getElementById('mdmSchoolTelemetryCard')?.remove();
 document.getElementById('mdmSchoolEvidenceSafeCard')?.remove();
 const panel=document.getElementById('mdmSchoolTelemetryPanel');
 if(panel){panel.removeAttribute('data-mdm-open');panel.style.display='none';}
}
function load(src,done){
 const s=document.createElement('script');
 s.src=src;s.async=false;
 s.onload=function(){if(done)done();};
 document.head.appendChild(s);
}
function start(){
 if(started)return;
 if(!authorizedSchoolHome()){cleanStudentHome();return;}
 started=true;
 const st=document.createElement('style');
 st.id='mdmTelemetryCardFirstGuard';
 st.textContent='#mdmSchoolTelemetryPanel{display:none!important}#mdmSchoolTelemetryPanel[data-mdm-open="1"]{display:block!important}';
 document.head.appendChild(st);

 load('mdm-school-telemetry-placement-45838194.js?v=458382521-school-only',function(){
  if(window.MDM_SCHOOL_TELEMETRY_4583819){
   try{window.MDM_SCHOOL_TELEMETRY_PLACEMENT_458381944?.place?.();}catch(_){}
   load('mdm-school-evidence-entry-4583823.js?v=458382521-school-only');
   return;
  }
  load('mdm-school-telemetry-engine-45838193.js?v=458381944-engine-no-flash',function(){
   try{window.MDM_SCHOOL_TELEMETRY_PLACEMENT_458381944?.place?.();}catch(_){}
   load('mdm-school-evidence-entry-4583823.js?v=458382521-school-only');
  });
 });
}
function sync(){if(authorizedSchoolHome())start();else cleanStudentHome();}
[0,100,250,500,900,1500,2500,4000].forEach(ms=>setTimeout(sync,ms));
window.addEventListener('pageshow',sync);
window.addEventListener('popstate',sync);
window.addEventListener('mdm:owner-authority',sync);
document.addEventListener('visibilitychange',function(){if(!document.hidden)sync();});
})();
