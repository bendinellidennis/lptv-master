/* Malta Driving Master 45.8.38.19.4.4 — Telemetry no-flash card-first bootstrap */
(function(){
'use strict';
if(window.MDM_SCHOOL_TELEMETRY_BOOTSTRAP_458381944)return;
window.MDM_SCHOOL_TELEMETRY_BOOTSTRAP_458381944=true;

/* Hide the operational panel before the engine can mount it, preventing the old top-of-home flash. */
(function(){
 const st=document.createElement('style');
 st.id='mdmTelemetryCardFirstGuard';
 st.textContent='#mdmSchoolTelemetryPanel{display:none!important}#mdmSchoolTelemetryPanel[data-mdm-open="1"]{display:block!important}';
 document.head.appendChild(st);
})();

function load(src,done){
 const s=document.createElement('script');
 s.src=src;
 s.async=false;
 s.onload=function(){if(done)done();};
 document.head.appendChild(s);
}

/* Card/placement first, telemetry engine second. */
load('mdm-school-telemetry-placement-45838194.js?v=458381944-card-first-no-flash',function(){
 if(window.MDM_SCHOOL_TELEMETRY_4583819){
  try{window.MDM_SCHOOL_TELEMETRY_PLACEMENT_458381944?.place?.();}catch(_){}
  load('mdm-school-evidence-entry-4583823.js?v=45838238-backend-live');
  return;
 }
 load('mdm-school-telemetry-engine-45838193.js?v=458381944-engine-no-flash',function(){
  try{window.MDM_SCHOOL_TELEMETRY_PLACEMENT_458381944?.place?.();}catch(_){}
  load('mdm-school-evidence-entry-4583823.js?v=45838238-backend-live');
 });
});
})();