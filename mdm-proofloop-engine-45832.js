/* Malta Driving Master 45.8.32 — ProofLoop Engine */
(function(){
'use strict';
if(window.MDM_PROOFLOOP_ENGINE)return;
const VERSION='45.8.32';
function evaluate(){
 const m=window.MDM_PROOFLOOP_MODEL,s=window.MDM_PROOFLOOP_STORE;if(!m||!s)return null;
 const x=s.snapshot(),n=Object.values(x.sources).filter(v=>v?.present===true).length,c=Math.max(0,Number(x.contradictions)||0);
 let next='verification';
 if(c)next='resolve_contradiction';else if(!x.sources.theory.present)next='theory';else if(!x.sources.road.present)next='road';else if(!x.sources.instructor.present)next='instructor';else if(!x.retentionPresent)next='retention';else if(!x.sources.telemetry.present)next='telemetry';
 return {version:VERSION,authenticated:x.authenticated,role:x.role,sources:x.sources,independentSources:n,sourceTotal:m.SOURCE_IDS.length,contradictions:c,retentionPresent:x.retentionPresent,state:m.stateFor(n,c),quality:m.qualityFor(n,c),nextNeed:next};
}
window.MDM_PROOFLOOP_ENGINE=Object.freeze({version:VERSION,evaluate});
})();