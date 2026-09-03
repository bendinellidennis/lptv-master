/* Malta Driving Master 45.8.38.19.4.2 — Force-fresh Telemetry Advanced Tools loader */
(function(){
'use strict';
if(window.MDM_SCHOOL_TELEMETRY_BOOTSTRAP_458381942)return;
window.MDM_SCHOOL_TELEMETRY_BOOTSTRAP_458381942=true;

function load(src,done){
 const s=document.createElement('script');
 s.src=src;
 s.async=false;
 s.onload=function(){if(done)done();};
 document.head.appendChild(s);
}

function loadPlacement(){
 load('mdm-school-telemetry-placement-45838194.js?v=458381942-advanced-tools-forcefresh');
}

if(window.MDM_SCHOOL_TELEMETRY_4583819){
 loadPlacement();
}else{
 load('mdm-school-telemetry-engine-45838193.js?v=458381942-engine-forcefresh',loadPlacement);
}
})();