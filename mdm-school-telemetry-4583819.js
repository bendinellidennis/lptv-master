/* Malta Driving Master 45.8.38.19.4.3 — Telemetry Advanced Tools card loader */
(function(){
'use strict';
if(window.MDM_SCHOOL_TELEMETRY_BOOTSTRAP_458381943)return;
window.MDM_SCHOOL_TELEMETRY_BOOTSTRAP_458381943=true;
function load(src,done){
 const s=document.createElement('script');
 s.src=src;
 s.async=false;
 s.onload=function(){if(done)done();};
 document.head.appendChild(s);
}
function loadPlacement(){load('mdm-school-telemetry-placement-45838194.js?v=458381943-card-toggle');}
if(window.MDM_SCHOOL_TELEMETRY_4583819){loadPlacement();}
else{load('mdm-school-telemetry-engine-45838193.js?v=458381943-engine',loadPlacement);}
})();