/* Malta Driving Master 45.8.34.1 — Real Exam Simulation Validity Fix */
(function(){
'use strict';
if(window.MDM_REAL_EXAM_SIMFIX)return;

const VERSION='45.8.34.1';
const AUTH='mdm_auth_session_v4410';
const OUTCOME='mdm-proofloop-exam-outcome-v1';

function parse(v){try{return v?JSON.parse(v):null}catch(_){return null}}
function auth(){return parse(localStorage.getItem(AUTH))}
function uid(){return String(auth()?.user?.id||'').trim()}
function read(base){
  const id=uid();
  if(id){
    const scoped=parse(localStorage.getItem(base+'::user:'+id));
    if(scoped!==null)return scoped;
  }
  return parse(localStorage.getItem(base));
}
function outcomeKey(){return OUTCOME+(uid()?'::user:'+uid():'::signed-out')}
function validExam(exam){
  if(!exam||typeof exam!=='object')return false;
  const total=Number(exam.total),score=Number(exam.score);
  return total===35&&Number.isInteger(score)&&score>=0&&score<=35&&Array.isArray(exam.details)&&exam.details.length===35;
}
function timeOf(exam){
  const ms=Date.parse(exam?.date||exam?.completedAt||exam?.timestamp||'');
  return Number.isFinite(ms)?ms:0;
}
function latestValidBefore(iso){
  const progress=read('mdm-v1-progress')||{};
  const exams=Array.isArray(progress.exams)?progress.exams:[];
  const limit=Number.isFinite(Date.parse(iso||''))?Date.parse(iso):Infinity;
  const valid=exams.filter(validExam).filter(e=>!timeOf(e)||timeOf(e)<=limit);
  if(!valid.length)return null;
  valid.sort((a,b)=>timeOf(a)-timeOf(b));
  return Number(valid[valid.length-1].score);
}
function correct(){
  const key=outcomeKey();
  const state=parse(localStorage.getItem(key));
  const snap=state?.snapshot;
  if(!snap?.examDay)return false;
  if(snap.examDay.finalSimulationScore!==0)return false;

  const actual=latestValidBefore(snap.capturedAt);
  if(actual===0)return false;

  snap.examDay.finalSimulationScore=actual;
  snap.examDay.simulationValidityFixedAt=new Date().toISOString();
  state.version=VERSION;
  localStorage.setItem(key,JSON.stringify(state));
  return true;
}
function refresh(){
  const changed=correct();
  if(changed){
    try{window.MDM_PROOFLOOP_EXAM_OUTCOME?.render?.()}catch(_){}
  }
}
document.addEventListener('click',function(e){
  if(e.target?.closest?.('#mdmExamFreeze'))setTimeout(refresh,0);
},true);
window.addEventListener('pageshow',refresh);
window.addEventListener('storage',refresh);
setTimeout(refresh,0);

window.MDM_REAL_EXAM_SIMFIX=Object.freeze({version:VERSION,refresh,latestValidBefore});
})();