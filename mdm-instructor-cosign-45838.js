/* Malta Driving Master 45.8.38 — Instructor Verified Co-Sign */
(function(){
'use strict';
if(window.MDM_INSTRUCTOR_COSIGN_45838)return;

const VERSION='45.8.38';
const AUTH='mdm_auth_session_v4410';
const STATE='mdm-proofloop-cosign-v1';
let raf=0,studentBusy=false,schoolBusy=false;
let schoolAuthorized=null,schoolStudents=[],schoolSelected='',schoolMissions=[];

function parse(v){try{return v?JSON.parse(v):null}catch(_){return null}}
function session(){return parse(localStorage.getItem(AUTH))}
function uid(){return String(session()?.user?.id||'').trim()}
function authenticated(){const s=session();return !!(s&&s.status==='authenticated'&&s.accessToken&&s.user?.id&&(!(Number(s.expiresAt)>0)||Number(s.expiresAt)>Date.now()))}
function key(){return STATE+(uid()?'::user:'+uid():'::signed-out')}
function loadState(){return parse(localStorage.getItem(key()))||{version:VERSION,localMissionId:'',linked:false,serverMissionId:'',serverStatus:'',reviewNote:'',reviewedAt:'',updatedAt:''}}
function saveState(x){x.version=VERSION;x.updatedAt=new Date().toISOString();try{localStorage.setItem(key(),JSON.stringify(x))}catch(_){}return x}
function lang(){try{return String(parse(localStorage.getItem('mdm-v1-settings'))?.lang||'en')}catch(_){return 'en'}}
function t(it,en,mt){const l=lang();return l==='it'?it:l==='mt'?mt:en}
function esc(v){return String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
function home(){const h=String(location.hash||'').replace(/^#/,'');return !h||h==='home'}
function cfg(){const c=window.MDM_BACKEND_CONFIG;if(!c||!c.enabled||!c.endpoint||!c.publishableKey)throw new Error('backend_config_unavailable');return {endpoint:String(c.endpoint).replace(/\/$/,''),key:String(c.publishableKey)}}
async function rpc(name,payload){
 const c=cfg(),s=session();if(!authenticated())throw new Error('authentication_required');
 const r=await fetch(c.endpoint+'/rest/v1/rpc/'+name,{method:'POST',headers:{'Content-Type':'application/json','apikey':c.key,'Authorization':'Bearer '+s.accessToken},body:JSON.stringify(payload||{}),cache:'no-store'});
 const tx=await r.text();let d={};try{d=tx?JSON.parse(tx):{}}catch(_){}
 if(Array.isArray(d))d=d[0]||{};
 if(!r.ok)throw new Error(String(d?.message||d?.error||('http_'+r.status)));
 return d||{};
}
function rawMission(){try{return window.__MDM_COSIGN_BASE_VERIFICATION__?.current?.()||window.MDM_PROOFLOOP_VERIFICATION?.current?.()||null}catch(_){return null}}
function overlayMission(m){
 if(!m)return m;
 const st=loadState();if(st.localMissionId!==String(m.id||''))return m;
 const out=Object.assign({},m);
 if(st.serverStatus==='verified'){
  out.status='verified';out.instructorVerified=true;out.reviewedAt=st.reviewedAt||'';out.reviewNote=st.reviewNote||'';out.serverMissionId=st.serverMissionId||'';
 }else if(st.serverStatus==='revision_requested'){
  out.status='revision_requested';out.instructorVerified=false;out.reviewedAt=st.reviewedAt||'';out.reviewNote=st.reviewNote||'';out.serverMissionId=st.serverMissionId||'';
 }else if(st.serverStatus==='awaiting_review'){
  out.status='awaiting_instructor';out.serverMissionId=st.serverMissionId||'';out.serverStatus='awaiting_review';
 }
 return out;
}
function installOverlay(){
 const base=window.MDM_PROOFLOOP_VERIFICATION;
 if(!base||window.__MDM_COSIGN_BASE_VERIFICATION__)return;
 window.__MDM_COSIGN_BASE_VERIFICATION__=base;
 const wrapped=Object.assign({},base,{current(){return overlayMission(base.current())}});
 window.MDM_PROOFLOOP_VERIFICATION=Object.freeze(wrapped);
}
function proofLoopId(item){
 const p=item?.payload&&typeof item.payload==='object'?item.payload:{};
 return String(p?.proofLoop?.missionId||p?.proofLoop?.mission?.id||p?.proofLoopMissionId||p?.missionId||'');
}
function requiresReview(item){const p=item?.payload||{};return p.requiresInstructorCheck===true||String(p.requiresInstructorCheck).toLowerCase()==='true'||p?.proofLoop?.requiresInstructorCheck===true}
function matchServerMission(local,items){
 if(!local)return null;
 const id=String(local.id||''),title=String(local.title||''),target=String(local.target?.label||'');
 const candidates=(Array.isArray(items)?items:[]).filter(requiresReview);
 return candidates.find(x=>proofLoopId(x)===id)
  ||candidates.find(x=>String(x?.payload?.id||'')===id)
  ||candidates.find(x=>title&&String(x?.payload?.title||'')===title)
  ||candidates.find(x=>target&&String(x?.payload?.priority||'')===target)
  ||null;
}
function reviewStateFromServer(local,item){
 const st=loadState();
 st.localMissionId=String(local?.id||'');
 st.linked=!!item;
 st.serverMissionId=String(item?.id||'');
 st.serverStatus=String(item?.status||'');
 st.reviewNote=String(item?.review_note||'');
 st.reviewedAt=String(item?.reviewed_at||'');
 return saveState(st);
}
async function syncStudent(){
 if(studentBusy||!authenticated())return loadState();
 const local=rawMission();if(!local)return loadState();
 studentBusy=true;
 try{
  const data=await rpc('mdm_student_list_missions',{});
  const item=matchServerMission(local,Array.isArray(data.missions)?data.missions:[]);
  return reviewStateFromServer(local,item);
 }catch(_){return loadState()}
 finally{studentBusy=false;schedule()}
}
async function submitForReview(){
 const local=rawMission(),st=loadState();
 if(!local||!st.linked||!st.serverMissionId)return false;
 studentBusy=true;
 try{
  const d=await rpc('mdm_student_update_mission',{p_mission_id:st.serverMissionId,p_status:'completed'});
  st.serverStatus=String(d.status||'awaiting_review');saveState(st);
  await syncStudent();return true;
 }catch(_){return false}
 finally{studentBusy=false;schedule()}
}
function studentBox(){
 const local=overlayMission(rawMission());if(!local)return '';
 const st=loadState();
 if(st.localMissionId!==String(local.id||''))return '<div class="mdm-cosign-state neutral">🔗 '+esc(t('Controllo collegamento con la scuola…','Checking school link…','Qed jiġi ċċekkjat il-link mal-iskola…'))+'</div>';
 if(st.serverStatus==='verified')return '<div class="mdm-cosign-state verified"><strong>✅ '+esc(t('Co-sign istruttore registrato','Instructor co-sign recorded','Co-sign tal-istruttur irreġistrat'))+'</strong><small>'+esc(st.reviewedAt?new Date(st.reviewedAt).toLocaleString():'')+'</small></div>';
 if(st.serverStatus==='revision_requested')return '<div class="mdm-cosign-state revision"><strong>🔁 '+esc(t('Revisione richiesta dall’istruttore','Instructor requested revision','L-istruttur talab reviżjoni'))+'</strong><p>'+esc(st.reviewNote||t('Serve una nuova prova prima di ripresentare la missione.','New evidence is required before resubmission.','Hemm bżonn evidenza ġdida qabel terġa’ tintbagħat il-missjoni.'))+'</p></div>';
 if(st.serverStatus==='awaiting_review')return '<div class="mdm-cosign-state waiting"><strong>⏳ '+esc(t('Inviata all’istruttore','Sent to instructor','Mibgħuta lill-istruttur'))+'</strong><small>'+esc(t('La competenza non è ancora verificata.','The skill is not verified yet.','Il-ħila għadha mhix ivverifikata.'))+'</small><button type="button" data-cosign-refresh>↻ '+esc(t('Aggiorna stato','Refresh status','Aġġorna l-istatus'))+'</button></div>';
 if(!st.linked)return '<div class="mdm-cosign-state neutral"><strong>🔗 '+esc(t('Missione non ancora collegata alla scuola','Mission not yet linked to the school','Il-missjoni għadha mhix marbuta mal-iskola'))+'</strong><small>'+esc(t('MDM non inventa il collegamento: serve una missione server assegnata dalla scuola con lo stesso ProofLoop.','MDM does not invent the link: a server mission assigned by the school with the same ProofLoop is required.','MDM ma jivvintax il-link: hemm bżonn missjoni tas-server assenjata mill-iskola bl-istess ProofLoop.'))+'</small><button type="button" data-cosign-refresh>↻ '+esc(t('Controlla collegamento','Check link','Iċċekkja l-link'))+'</button></div>';
 const ready=local.status==='awaiting_instructor'||Number(local.evidence?.roadDelta||0)>0||Number(local.evidence?.telemetryDelta||0)>0;
 return '<div class="mdm-cosign-state linked"><strong>🔗 '+esc(t('Missione collegata al server scuola','Mission linked to school server','Missjoni marbuta mas-server tal-iskola'))+'</strong><small>'+esc(t('Stato server','Server status','Status tas-server'))+': '+esc(st.serverStatus||'assigned')+'</small>'+(ready?'<button type="button" data-cosign-submit>👨‍🏫 '+esc(t('Invia alla verifica istruttore','Send for instructor review','Ibgħat għall-verifika tal-istruttur'))+'</button>':'')+'</div>';
}
function decorateStudent(){
 const host=document.querySelector('.mdm-proofloop-verification');if(!host)return;
 let box=host.querySelector('.mdm-instructor-cosign-box');
 if(!box){box=document.createElement('div');box.className='mdm-instructor-cosign-box';const copy=host.querySelector('#mdmProofLoopCopyMission');if(copy)copy.before(box);else host.appendChild(box)}
 const html=studentBox();if(box.dataset.sig!==html){box.innerHTML=html;box.dataset.sig=html}
 box.querySelector('[data-cosign-refresh]')?.addEventListener('click',syncStudent);
 box.querySelector('[data-cosign-submit]')?.addEventListener('click',submitForReview);
 const local=overlayMission(rawMission());
 if(local?.status==='verified'){
  const badge=host.querySelector('.mdm-proofloop-verification-head span');if(badge)badge.textContent=t('Competenza verificata','Skill verified','Ħila ivverifikata');
  const msg=host.querySelector('.mdm-proofloop-verification-status');if(msg)msg.textContent=t('La verifica professionale dell’istruttore è stata registrata.','Professional instructor verification has been recorded.','Il-verifika professjonali tal-istruttur ġiet irreġistrata.');
 }
 if(local?.status==='revision_requested'){
  const badge=host.querySelector('.mdm-proofloop-verification-head span');if(badge)badge.textContent=t('Revisione richiesta','Revision requested','Intalbet reviżjoni');
 }
}
async function refreshSchoolContext(){
 if(schoolBusy||!authenticated())return;
 schoolBusy=true;
 try{
  const d=await rpc('mdm_school_list_active_students',{});
  schoolAuthorized=d.authorized===true;
  schoolStudents=Array.isArray(d.students)?d.students:[];
  if(schoolAuthorized&&!schoolSelected&&schoolStudents[0])schoolSelected=String(schoolStudents[0].student_user_id||'');
 }catch(_){schoolAuthorized=false;schoolStudents=[]}
 finally{schoolBusy=false;schedule()}
}
async function loadSchoolMissions(studentId){
 if(!studentId)return;
 schoolBusy=true;
 try{
  const d=await rpc('mdm_school_list_student_missions',{p_student_user_id:studentId});
  schoolMissions=Array.isArray(d.missions)?d.missions.filter(requiresReview):[];
 }catch(_){schoolMissions=[]}
 finally{schoolBusy=false;schedule()}
}
async function schoolReview(id,decision,note){
 schoolBusy=true;
 try{
  await rpc('mdm_school_review_mission',{p_mission_id:id,p_decision:decision,p_note:String(note||'')});
  await loadSchoolMissions(schoolSelected);return true;
 }catch(_){return false}
 finally{schoolBusy=false;schedule()}
}
function schoolPanelHtml(){
 const opts=schoolStudents.map(s=>'<option value="'+esc(String(s.student_user_id||''))+'" '+(String(s.student_user_id||'')===schoolSelected?'selected':'')+'>'+esc(String(s.student_name||s.student_email||'Studente'))+'</option>').join('');
 const pending=schoolMissions.filter(x=>String(x.status)==='awaiting_review');
 const cards=pending.length?pending.map(x=>{
  const p=x.payload||{};
  return '<article class="mdm-cosign-review-card"><div><small>'+esc(String(x.id||''))+'</small><strong>🎯 '+esc(String(p.title||p.priority||t('Missione di verifica','Verification mission','Missjoni ta’ verifika')))+'</strong><p>'+esc(String(p.priority||''))+'</p></div><textarea data-review-note="'+esc(String(x.id||''))+'" placeholder="'+esc(t('Nota revisione (obbligatoria solo se richiedi revisione)','Revision note (required only for revision)','Nota tar-reviżjoni (meħtieġa biss għar-reviżjoni)'))+'"></textarea><div><button type="button" data-review-approve="'+esc(String(x.id||''))+'">✅ '+esc(t('Approva','Approve','Approva'))+'</button><button type="button" class="secondary" data-review-revision="'+esc(String(x.id||''))+'">🔁 '+esc(t('Richiedi revisione','Request revision','Itlob reviżjoni'))+'</button></div></article>';
 }).join(''):'<p class="mdm-cosign-empty">'+esc(t('Nessuna missione in attesa di co-sign per questo studente.','No missions awaiting co-sign for this learner.','L-ebda missjoni qed tistenna co-sign għal dan l-istudent.'))+'</p>';
 return '<div class="mdm-cosign-school-head"><div><small>MDM · '+VERSION+'</small><h2>👨‍🏫 '+esc(t('Instructor Verified Co-Sign','Instructor Verified Co-Sign','Instructor Verified Co-Sign'))+'</h2><p>'+esc(t('Solo una review server autorizzata può trasformare una missione in competenza verificata.','Only an authorised server review can turn a mission into a verified skill.','Review awtorizzata tas-server biss tista’ tbiddel missjoni f’ħila ivverifikata.'))+'</p></div><span>🛡️</span></div><div class="mdm-cosign-school-select"><select id="mdmCosignStudent">'+opts+'</select><button id="mdmCosignLoad" type="button">↻ '+esc(t('Carica missioni','Load missions','Tella’ l-missjonijiet'))+'</button></div><div class="mdm-cosign-review-list">'+cards+'</div>';
}
function mountSchoolPanel(){
 const old=document.getElementById('mdmInstructorCosignSchool');
 if(!schoolAuthorized||!home()){old?.remove();return}
 const screen=document.getElementById('screen');if(!screen)return;
 let panel=old;if(!panel){panel=document.createElement('section');panel.id='mdmInstructorCosignSchool';panel.className='mdm-instructor-cosign-school';screen.appendChild(panel)}
 const html=schoolPanelHtml();if(panel.dataset.sig!==html){panel.innerHTML=html;panel.dataset.sig=html}
 const sel=panel.querySelector('#mdmCosignStudent');if(sel)sel.onchange=()=>{schoolSelected=sel.value;schoolMissions=[]};
 panel.querySelector('#mdmCosignLoad')?.addEventListener('click',()=>loadSchoolMissions(schoolSelected));
 panel.querySelectorAll('[data-review-approve]').forEach(b=>b.onclick=()=>schoolReview(b.dataset.reviewApprove,'approve',''));
 panel.querySelectorAll('[data-review-revision]').forEach(b=>b.onclick=()=>{
  const id=b.dataset.reviewRevision,note=String(panel.querySelector('[data-review-note="'+CSS.escape(id)+'"]')?.value||'').trim();
  if(!note)return;
  schoolReview(id,'revision',note);
 });
}
function schedule(){if(raf)return;raf=requestAnimationFrame(()=>{raf=0;installOverlay();decorateStudent();mountSchoolPanel()})}
installOverlay();schedule();
setTimeout(()=>{syncStudent();refreshSchoolContext()},900);
const screen=document.getElementById('screen');if(screen){const o=new MutationObserver(schedule);o.observe(screen,{childList:true,subtree:true});window.__MDM_COSIGN_OBSERVER__=o}
window.addEventListener('pageshow',()=>{schedule();syncStudent();refreshSchoolContext()});
window.addEventListener('storage',schedule);
document.addEventListener('visibilitychange',()=>{if(!document.hidden){schedule();syncStudent()}});
window.MDM_INSTRUCTOR_COSIGN_45838=Object.freeze({version:VERSION,syncStudent,submitForReview,refreshSchoolContext,loadSchoolMissions,schoolReview,current:loadState});
})();