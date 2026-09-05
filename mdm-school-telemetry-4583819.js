/* Malta Driving Master 45.8.38.25.2.24 — Immediate School tools mount
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
function restoreLoadedUi(){
 try{window.MDM_SCHOOL_TELEMETRY_PLACEMENT_458381944?.place?.();}catch(_){}
 try{window.MDM_SCHOOL_EVIDENCE_ENTRY_4583823_API?.place?.();}catch(_){}
}
function fastRestore(){
 [0,16,32,50,80,120,180,250,350,500,700,900,1200,1600,2200,3000].forEach(ms=>{
  setTimeout(function(){
   if(routeName()!=='schoolhome')return;
   restoreLoadedUi();
  },ms);
 });
}
function start(){
 if(!authorizedSchoolHome()){cleanStudentHome();return;}
 if(started){restoreLoadedUi();fastRestore();return;}
 started=true;
 const st=document.createElement('style');
 st.id='mdmTelemetryCardFirstGuard';
 st.textContent='#mdmSchoolTelemetryPanel{display:none!important}#mdmSchoolTelemetryPanel[data-mdm-open="1"]{display:block!important}';
 document.head.appendChild(st);

 load('mdm-school-telemetry-placement-45838194.js?v=458382524-immediate-school-only',function(){
  if(window.MDM_SCHOOL_TELEMETRY_4583819){
   try{window.MDM_SCHOOL_TELEMETRY_PLACEMENT_458381944?.place?.();}catch(_){}
   load('mdm-school-evidence-entry-4583823.js?v=458382524-immediate-school-only',function(){restoreLoadedUi();fastRestore();});
   fastRestore();
   return;
  }
  load('mdm-school-telemetry-engine-45838193.js?v=458381944-engine-no-flash',function(){
   try{window.MDM_SCHOOL_TELEMETRY_PLACEMENT_458381944?.place?.();}catch(_){}
   load('mdm-school-evidence-entry-4583823.js?v=458382524-immediate-school-only',function(){restoreLoadedUi();fastRestore();});
   fastRestore();
  });
 });
}
async function sync(){
 if(routeName()!=='schoolhome'){cleanStudentHome();return;}
 try{await window.MDM_OWNER_AUTHORITY?.verify?.(false);}catch(_){}
 if(window.MDM_OWNER_AUTHORITY?.isOwner?.()===true){start();return;}
 try{
  const s=await window.MDM_PRIVILEGED_ROUTE_GUARD?.verifySchool?.(false);
  if(s&&s.status==='verified'&&s.authorized===true){start();return;}
 }catch(_){}
 cleanStudentHome();
}
[0,40,100,180,300,500,800,1200,1800,2600,4000].forEach(ms=>setTimeout(sync,ms));
window.addEventListener('pageshow',sync);
window.addEventListener('popstate',sync);
window.addEventListener('mdm:owner-authority',sync);
document.addEventListener('visibilitychange',function(){if(!document.hidden)sync();});
})();
