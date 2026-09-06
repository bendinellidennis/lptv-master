/* Malta Driving Master 45.8.38.25.2.31 — Assignment delivery integrity
   Server-active learner assignments are written directly to Supabase and
   are labelled delivered only after the returned mission_id is confirmed
   by mdm_school_list_student_missions.
   Scope: Instructor Assignments delivery only. No observers. */
(function(){
'use strict';
if(window.MDM_ASSIGNMENT_DELIVERY_INTEGRITY_458382531)return;

const VERSION='45.8.38.25.2.31';
const AUTH_KEY='mdm_auth_session_v4410';
const STATE_KEY='mdm_instructor_assignments_4320';
const SCHEMA='mdm-instructor-assignment-v1';
let busy=false;

function parse(v){try{return v?JSON.parse(v):null}catch(_){return null}}
function routeName(){return String(location.hash||'').replace(/^#/,'').split('?')[0].trim()}
function session(){
  const s=parse(localStorage.getItem(AUTH_KEY));
  return s&&s.status==='authenticated'&&s.accessToken&&s.user?.id?s:null;
}
function cfg(){
  const c=window.MDM_BACKEND_CONFIG||{};
  if(!c.enabled||!c.endpoint||!c.publishableKey)return null;
  return {endpoint:String(c.endpoint).replace(/\/$/,''),key:String(c.publishableKey)};
}
function state(){
  const s=parse(localStorage.getItem(STATE_KEY))||{assignments:[],selectedStudentId:'',serverTarget:null};
  s.assignments=Array.isArray(s.assignments)?s.assignments:[];
  return s;
}
function saveState(s){try{localStorage.setItem(STATE_KEY,JSON.stringify(s))}catch(_){}}
function uuid(v){return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(String(v||''))}
function notify(it,en,mt){
  let l='en';try{l=String(parse(localStorage.getItem('mdm-v1-settings'))?.lang||'en')}catch(_){}
  const msg=l==='it'?it:l==='mt'?mt:en;
  try{if(typeof toast==='function'){toast(msg);return}}catch(_){}
}
function selectedServerTarget(){
  const sel=document.getElementById('assignmentStudent');
  const opt=sel?.selectedOptions?.[0];
  const id=String(sel?.value||'').trim();
  const txt=String(opt?.textContent||'').trim();
  if(!uuid(id)||!/SERVER\s+ACTIVE/i.test(txt))return null;
  return {userId:id,name:txt.replace(/\s*[·•]\s*SERVER\s+ACTIVE.*$/i,'').trim()||'Student'};
}
function formPayload(target,existing){
  const title=String(document.getElementById('assignmentTitle')?.value||existing?.title||'').trim();
  const priority=String(document.getElementById('assignmentPriority')?.value||existing?.priority||'').trim();
  const instruction=String(document.getElementById('assignmentInstruction')?.value||existing?.instruction||'').trim();
  const criteria=[1,2,3].map(i=>String(document.getElementById('assignmentCriterion'+i)?.value||existing?.criteria?.[i-1]||'').trim()).filter(Boolean);
  const due=String(document.getElementById('assignmentDue')?.value||existing?.due||'next-lesson');
  const requires=Boolean(document.getElementById('assignmentInstructorCheck')?.checked ?? existing?.requiresInstructorCheck ?? true);
  if(!title||!instruction||criteria.length<3)return null;
  const id=String(existing?.id||('ASN-'+Date.now().toString(36).slice(-6).toUpperCase()+'-'+Math.random().toString(36).slice(2,6).toUpperCase()));
  return {
    ...(existing&&typeof existing==='object'?existing:{}),
    schema:SCHEMA,id,
    studentId:target.userId,studentName:target.name,studentSource:'server',
    title,priority,instruction,criteria:criteria.slice(0,3),due,
    requiresInstructorCheck:requires,
    createdAt:String(existing?.createdAt||new Date().toISOString()),
    deliveryState:'prepared-local',previewStatus:String(existing?.previewStatus||'open'),
    lifecycle:'unified_mission_v1',
    verification_scope:'driver_competence',
    mission_type:'verification',
    source:'instructor_assignments',
    objective:instruction,
    competence_label:priority||title,
    deliveryIntegrityVersion:VERSION
  };
}
async function rpc(name,payload){
  const c=cfg(),s=session();
  if(!c||!s)throw new Error('authentication_required');
  const r=await fetch(c.endpoint+'/rest/v1/rpc/'+name,{
    method:'POST',
    headers:{'Content-Type':'application/json','apikey':c.key,'Authorization':'Bearer '+String(s.accessToken)},
    body:JSON.stringify(payload||{}),cache:'no-store',credentials:'omit'
  });
  const tx=await r.text();let d={};try{d=tx?JSON.parse(tx):{}}catch(_){}
  if(Array.isArray(d))d=d[0]||{};
  return {ok:r.ok,status:r.status,data:d};
}
async function withRefresh(name,payload){
  let r=await rpc(name,payload);
  if(r.status===401){
    try{if(typeof mdmAuthRefreshSession==='function')await mdmAuthRefreshSession()}catch(_){}
    r=await rpc(name,payload);
  }
  return r;
}
async function confirmed(targetUserId,missionId){
  for(const wait of [0,120,350]){
    if(wait)await new Promise(r=>setTimeout(r,wait));
    const q=await withRefresh('mdm_school_list_student_missions',{p_student_user_id:targetUserId});
    if(!q.ok||q.data?.ok===false)continue;
    const rows=Array.isArray(q.data?.missions)?q.data.missions:[];
    if(rows.some(x=>String(x?.id||x?.mission_id||'')===String(missionId)))return true;
  }
  return false;
}
function persistDelivered(payload,missionId){
  const s=state();
  const next={...payload,deliveryState:'server-active',serverMissionId:String(missionId),serverDeliveredAt:new Date().toISOString(),serverConfirmed:true};
  const ix=s.assignments.findIndex(x=>String(x?.id||'')===String(next.id));
  if(ix>=0)s.assignments[ix]=next;else s.assignments.unshift(next);
  s.assignments=s.assignments.slice(0,100);
  s.selectedStudentId=String(next.studentId||s.selectedStudentId||'');
  saveState(s);
}
function persistError(payload,error){
  const s=state();
  const next={...payload,deliveryState:'server-error',serverDeliveryError:String(error||'delivery_failed'),serverConfirmed:false};
  const ix=s.assignments.findIndex(x=>String(x?.id||'')===String(next.id));
  if(ix>=0)s.assignments[ix]=next;else s.assignments.unshift(next);
  s.assignments=s.assignments.slice(0,100);
  saveState(s);
}
async function deliver(payload,target){
  const r=await withRefresh('mdm_school_assign_mission',{p_student_user_id:target.userId,p_payload:payload});
  const mid=String(r.data?.mission_id||'');
  if(!r.ok||r.data?.ok===false||!uuid(mid))throw new Error(String(r.data?.error||r.data?.message||('http_'+r.status)));
  if(!(await confirmed(target.userId,mid)))throw new Error('mission_not_confirmed_on_server');
  persistDelivered(payload,mid);
  try{if(typeof render==='function')render()}catch(_){}
  notify('Missione consegnata e confermata dal server.','Mission delivered and confirmed by the server.','Il-missjoni ntbagħtet u ġiet ikkonfermata mis-server.');
  return true;
}
async function handleCreate(button){
  if(busy)return;
  const target=selectedServerTarget();if(!target)return;
  const payload=formPayload(target,null);
  if(!payload){
    notify('Completa titolo, istruzione e tutti e 3 i criteri osservabili.','Complete title, instruction and all 3 observable criteria.','Imla t-titlu, l-istruzzjoni u t-3 kriterji osservabbli.');
    return;
  }
  busy=true;button.disabled=true;
  try{await deliver(payload,target)}
  catch(e){
    persistError(payload,e?.message||e);
    try{if(typeof render==='function')render()}catch(_){}
    notify('Consegna server non confermata. La missione non viene marcata come consegnata.','Server delivery was not confirmed. The mission is not marked as delivered.','Il-kunsinna mis-server ma ġietx ikkonfermata. Il-missjoni mhix immarkata bħala mibgħuta.');
  }finally{busy=false;button.disabled=false}
}
async function handleExisting(button){
  if(busy)return;
  const target=selectedServerTarget();if(!target)return;
  const id=String(button.getAttribute('data-assignment-send-server')||'');
  const existing=state().assignments.find(x=>String(x?.id||'')===id);
  if(!existing)return;
  const payload=formPayload(target,existing);if(!payload)return;
  busy=true;button.disabled=true;
  try{await deliver(payload,target)}
  catch(e){
    persistError(payload,e?.message||e);
    try{if(typeof render==='function')render()}catch(_){}
    notify('Consegna server non confermata.','Server delivery was not confirmed.','Il-kunsinna mis-server ma ġietx ikkonfermata.');
  }finally{busy=false;button.disabled=false}
}
document.addEventListener('click',function(ev){
  if(routeName()!=='instructorassignments')return;
  const create=ev.target?.closest?.('#assignmentPrepare');
  if(create&&selectedServerTarget()){
    ev.preventDefault();ev.stopImmediatePropagation();
    void handleCreate(create);return;
  }
  const existing=ev.target?.closest?.('[data-assignment-send-server]');
  if(existing&&selectedServerTarget()){
    ev.preventDefault();ev.stopImmediatePropagation();
    void handleExisting(existing);
  }
},true);

window.MDM_ASSIGNMENT_DELIVERY_INTEGRITY_458382531=Object.freeze({version:VERSION,confirmed});
})();