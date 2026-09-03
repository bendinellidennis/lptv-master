/* Malta Driving Master 45.8.32 — ProofLoop Read-only Store Adapter */
(function(){
'use strict';
if(window.MDM_PROOFLOOP_STORE)return;
const VERSION='45.8.32',AUTH='mdm_auth_session_v4410';
const K={onboarding:'mdm-v1-onboarding',progress:'mdm-v1-progress',replay:'mdm-v1-error-replay',mission:'mdm-v1-mission-system',instructor:'mdm-v1-ai-instructor',passport:'mdm-v1-lptv-passport',road:'mdm-v1-real-road-twin',telemetry:'mdm-v1-real-road-telemetry',pattern:'mdm-v1-real-road-selected-pattern',recovery:'mdm-v1-coach-recovery',zero:'mdm-v1-zero-error'};
function parse(v){try{return v?JSON.parse(v):null}catch(_){return null}}
function session(){return parse(localStorage.getItem(AUTH))}
function uid(){return String(session()?.user?.id||'')}
function authenticated(){const s=session();return !!(s&&s.status==='authenticated'&&s.accessToken&&s.user?.id&&(!(Number(s.expiresAt)>0)||Number(s.expiresAt)>Date.now()))}
function read(base){const id=uid();if(id){const scoped=parse(localStorage.getItem(base+'::user:'+id));if(scoped!==null)return scoped}return parse(localStorage.getItem(base))}
function scan(v){
 const out={meaningful:false,verified:0,contradictions:0,retention:0};const seen=new WeakSet();
 function walk(n,d){if(d>6||n==null)return;if(typeof n==='object'){if(seen.has(n))return;seen.add(n)}
  if(Array.isArray(n)){if(n.length)out.meaningful=true;n.slice(0,200).forEach(x=>walk(x,d+1));return}
  if(typeof n==='object'){const keys=Object.keys(n);if(keys.length)out.meaningful=true;keys.slice(0,250).forEach(k=>{const x=n[k],s=String(k).toLowerCase();
   if(x===true&&/(verified|verificat|stable|stabile|complete|completed|done)/i.test(s))out.verified++;
   if(x===true&&/(contrad|incoher|mismatch|divario|conflict)/i.test(s))out.contradictions++;
   if(x===true&&/(retain|retention|recheck|recall|stable|stabile|consolidat)/i.test(s))out.retention++;
   walk(x,d+1);
  });return}
  if(typeof n==='string'){const s=n.trim().toLowerCase();if(s)out.meaningful=true;if(/(verified|verificato|verificata|stable|stabile|completed|completato)/i.test(s))out.verified++;if(/(contradict|contraddizion|incoher|mismatch|divario|conflict)/i.test(s))out.contradictions++;if(/(retain|retention|recheck|recall|stabile|stable|consolidat)/i.test(s))out.retention++}
  else if(typeof n==='number'&&Number.isFinite(n)&&n!==0)out.meaningful=true;else if(n===true)out.meaningful=true;
 }
 walk(v,0);return out;
}
function roadCount(){try{const r=typeof realRoadEvidenceRows==='function'?realRoadEvidenceRows():[];return Array.isArray(r)?r.length:0}catch(_){return 0}}
function telemetryCount(v){let n=Array.isArray(v?.sessions)?v.sessions.length:0;try{if(typeof realRoadTelemetryStore!=='undefined'&&Array.isArray(realRoadTelemetryStore?.sessions))n=Math.max(n,realRoadTelemetryStore.sessions.length)}catch(_){}return n}
function snapshot(){
 const v={theory:read(K.progress),replayA:read(K.replay),replayB:read(K.mission),roadA:read(K.road),roadB:read(K.pattern),telemetry:read(K.telemetry),instructorA:read(K.instructor),instructorB:read(K.passport),retentionA:read(K.recovery),retentionB:read(K.zero)};
 const s={theory:scan(v.theory),replayA:scan(v.replayA),replayB:scan(v.replayB),roadA:scan(v.roadA),roadB:scan(v.roadB),telemetry:scan(v.telemetry),instructorA:scan(v.instructorA),instructorB:scan(v.instructorB),retentionA:scan(v.retentionA),retentionB:scan(v.retentionB)};
 const rc=roadCount(),tc=telemetryCount(v.telemetry),on=read(K.onboarding)||{};
 return {version:VERSION,authenticated:authenticated(),role:String(on.role||'').toLowerCase(),sources:{
  theory:{present:s.theory.meaningful,verified:s.theory.verified},
  replay:{present:s.replayA.meaningful||s.replayB.meaningful,verified:s.replayA.verified+s.replayB.verified},
  road:{present:s.roadA.meaningful||s.roadB.meaningful||rc>0,verified:s.roadA.verified+s.roadB.verified,records:rc},
  telemetry:{present:s.telemetry.meaningful||tc>0,verified:s.telemetry.verified,sessions:tc},
  instructor:{present:s.instructorA.meaningful||s.instructorB.meaningful,verified:s.instructorA.verified+s.instructorB.verified}
 },contradictions:s.roadA.contradictions+s.roadB.contradictions+s.instructorB.contradictions,retentionPresent:s.retentionA.meaningful||s.retentionB.meaningful||s.retentionA.retention>0||s.retentionB.retention>0};
}
window.MDM_PROOFLOOP_STORE=Object.freeze({version:VERSION,snapshot});
})();