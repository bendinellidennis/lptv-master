/* Malta Driving Master 45.8.38.25.2.32.19 — School tools immediate shell + authority activation
   Telemetry and the School Evidence entry are loaded only inside the server-authorized School Home.
   Student Home never mounts these School tools. */
(function(){
'use strict';
if(window.MDM_SCHOOL_TELEMETRY_BOOTSTRAP_458382521)return;
window.MDM_SCHOOL_TELEMETRY_BOOTSTRAP_458382521=true;

let started=false;
let schoolObserver=null;
let schoolRaf=0;
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
 if(src.includes('mdm-school-telemetry-placement-45838194.js')&&window.MDM_SCHOOL_TELEMETRY_PLACEMENT_458381944){if(done)done();return;}
 if(src.includes('mdm-school-evidence-entry-4583823.js')&&window.MDM_SCHOOL_EVIDENCE_ENTRY_4583823_API){if(done)done();return;}
 if(src.includes('mdm-school-telemetry-engine-45838193.js')&&window.MDM_SCHOOL_TELEMETRY_4583819){if(done)done();return;}
 const s=document.createElement('script');
 s.src=src;s.async=false;
 s.onload=function(){if(done)done();};
 document.head.appendChild(s);
}
function restoreLoadedUi(){
 try{window.MDM_SCHOOL_TELEMETRY_PLACEMENT_458381944?.place?.();}catch(_){}
 try{window.MDM_SCHOOL_EVIDENCE_ENTRY_4583823_API?.place?.();}catch(_){}
}
function advancedToolsReady(){
 if(routeName()!=='schoolhome')return false;
 const els=Array.from(document.querySelectorAll('#screen .sch35-title,#screen h1,#screen h2,#screen h3,#screen h4,#screen strong'));
 return els.some(el=>{
  const tx=String(el.textContent||'').replace(/\s+/g,' ').trim().toUpperCase();
  return tx.includes('STRUMENTI AVANZATI')||tx.includes('ADVANCED TOOLS')||tx.includes('GĦODOD AVVANZATI');
 });
}
function stopSchoolObserver(){
 try{schoolObserver?.disconnect?.();}catch(_){}
 schoolObserver=null;
 if(schoolRaf){try{cancelAnimationFrame(schoolRaf)}catch(_){} schoolRaf=0;}
}
function signalSchoolHomeReady(){
 if(!authorizedSchoolHome()||!advancedToolsReady())return false;
 restoreLoadedUi();
 try{window.MDM_RUNTIME_RECOVERY_4583825331?.place?.();}catch(_){}
 window.__MDM_SCHOOL_HOME_RENDER_READY__=Date.now();
 try{window.dispatchEvent(new CustomEvent('mdm:school-home-rendered'));}catch(_){}
 return true;
}
function armSchoolObserver(){
 if(routeName()!=='schoolhome'){stopSchoolObserver();return false;}
 if(signalSchoolHomeReady()){stopSchoolObserver();return true;}
 if(schoolObserver)return true;
 const screen=document.getElementById('screen');if(!screen)return false;
 schoolObserver=new MutationObserver(function(){
  if(schoolRaf)return;
  schoolRaf=requestAnimationFrame(function(){
   schoolRaf=0;
   if(routeName()!=='schoolhome'){stopSchoolObserver();return;}
   if(signalSchoolHomeReady())stopSchoolObserver();
  });
 });
 schoolObserver.observe(screen,{childList:true,subtree:true});
 return true;
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
 if(!authorizedSchoolHome()){stopSchoolObserver();cleanStudentHome();return;}
 armSchoolObserver();
 if(started){restoreLoadedUi();signalSchoolHomeReady();fastRestore();return;}
 started=true;
 const st=document.createElement('style');
 st.id='mdmTelemetryCardFirstGuard';
 st.textContent='#mdmSchoolTelemetryPanel{display:none!important}#mdmSchoolTelemetryPanel[data-mdm-open="1"]{display:block!important}';
 document.head.appendChild(st);

 load('mdm-school-telemetry-placement-45838194.js?v=458382524-immediate-school-only',function(){
  if(window.MDM_SCHOOL_TELEMETRY_4583819){
   try{window.MDM_SCHOOL_TELEMETRY_PLACEMENT_458381944?.place?.();}catch(_){}
   load('mdm-school-evidence-entry-4583823.js?v=458382524-immediate-school-only',function(){restoreLoadedUi();signalSchoolHomeReady();fastRestore();});
   fastRestore();
   return;
  }
  load('mdm-school-telemetry-engine-45838193.js?v=458381944-engine-no-flash',function(){
   try{window.MDM_SCHOOL_TELEMETRY_PLACEMENT_458381944?.place?.();}catch(_){}
   load('mdm-school-evidence-entry-4583823.js?v=458382524-immediate-school-only',function(){restoreLoadedUi();signalSchoolHomeReady();fastRestore();});
   fastRestore();
  });
 });
}
async function sync(){
 if(routeName()!=='schoolhome'){stopSchoolObserver();cleanStudentHome();return;}
 armSchoolObserver();
 try{await window.MDM_OWNER_AUTHORITY?.verify?.(false);}catch(_){}
 if(window.MDM_OWNER_AUTHORITY?.isOwner?.()===true){start();signalSchoolHomeReady();return;}
 try{
  const s=await window.MDM_PRIVILEGED_ROUTE_GUARD?.verifySchool?.(false);
  if(s&&s.status==='verified'&&s.authorized===true){start();signalSchoolHomeReady();return;}
 }catch(_){}
 cleanStudentHome();
}
[0,40,100,180,300,500,800,1200,1800,2600,4000].forEach(ms=>setTimeout(sync,ms));
window.addEventListener('pageshow',sync);
window.addEventListener('popstate',sync);
window.addEventListener('mdm:owner-authority',sync);
window.addEventListener('mdm:school-authority',function(ev){
 const s=ev?.detail;
 if(routeName()!=='schoolhome')return;
 if(window.MDM_OWNER_AUTHORITY?.isOwner?.()===true||(s&&s.status==='verified'&&s.authorized===true)){
  start();
  signalSchoolHomeReady();
 }
});
document.addEventListener('visibilitychange',function(){if(!document.hidden)sync();});
})();
