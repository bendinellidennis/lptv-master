/* Malta Driving Master 45.8.38.19.4 — Telemetry bootstrap with Advanced Tools placement */
(function(){
'use strict';
if(window.MDM_SCHOOL_TELEMETRY_BOOTSTRAP_45838194)return;
window.MDM_SCHOOL_TELEMETRY_BOOTSTRAP_45838194=true;
function load(src,done){
 const s=document.createElement('script');
 s.src=src;
 s.async=false;
 if(done)s.onload=done;
 document.head.appendChild(s);
}
load('mdm-school-telemetry-engine-45838193.js?v=45838193-engine',function(){
 load('mdm-school-telemetry-placement-45838194.js?v=45838194-advanced-tools');
});
})();