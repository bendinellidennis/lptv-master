/* Malta Driving Master 45.8.38.23.9 — Student School Evidence Bridge
   Additive only: shows server-assigned school missions in Student Home.
   Does not replace #screen, does not alter local ProofLoop state. */
(function(){
'use strict';
if(window.MDM_STUDENT_SCHOOL_EVIDENCE_45838239)return;
window.MDM_STUDENT_SCHOOL_EVIDENCE_45838239=true;

const VERSION='45.8.38.23.9';
const AUTH='mdm_auth_session_v4410';
const HOST_ID='mdmStudentSchoolEvidence';
let busy=false;

function parse(v){try{return v?JSON.parse(v):null}catch(_){return null}}
function settings(){return parse(localStorage.getItem('mdm-v1-settings'))||{}}
function lang(){const l=String(settings().lang||'en').toLowerCase();return ['it','en','mt'].includes(l)?l:'en'}
function t(it,en,mt){return lang()==='it'?it:lang()==='mt'?mt:en}
function esc(v){return String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
function session(){const s=parse(localStorage.getItem(AUTH));return s&&s.accessToken&&s.user?.id?s:null}
function home(){const h=String(location.hash||'').replace(/^#/,'');return !h||h==='home'}
function cfg(){const c=window.MDM_BACKEND_CONFIG||{};if(!c.enabled||!c.endpoint||!c.publishableKey)throw new Error('backend_unavailable');return{endpoint:String(c.endpoint).replace(/\/$/,''),key:String(c.publishableKey)}}
async function rpc(name,payload){
 const c=cfg(),s=session();if(!s)throw new Error('authentication_required');
 const r=await fetch(c.endpoint+'/rest/v1/rpc/'+name,{method:'POST',headers:{'Content-Type':'application/json','apikey':c.key,'Authorization':'Bearer '+s.accessToken},body:JSON.stringify(payload||{}),cache:'no-store'});
 const tx=await r.text();let d={};try{d=tx?JSON.parse(tx):{}}catch(_){}
 if(Array.isArray(d))d=d[0]||{};
 if(!r.ok)throw new Error(String(d?.message||d?.error||('http_'+r.status)));
 return d||{};
}
function anchor(){return document.getElementById('mdmCompactRealPreparation')||document.querySelector('.mdm-compact-real-preparation')||null}
function missionTitle(m){return String(m?.payload?.title||m?.payload?.objective||t('Missione della scuola','School mission','Missjoni tal-iskola'))}
function missionObjective(m){const x=String(m?.payload?.objective||'').trim();return x&&x!==missionTitle(m)?x:''}
function statusLabel(s){
 return ({assigned:t('Assegnata dalla scuola','Assigned by school','Assenjata mill-iskola'),
 evidence_submitted:t('Evidenza inviata','Evidence submitted','Evidenza mibgħuta'),
 accepted:t('Accettata','Accepted','Aċċettata'),
 revision_requested:t('Nuova evidenza richiesta','New evidence requested','Evidenza ġdida mitluba')})[s]||t('Missione','Mission','Missjoni')
}
function canSubmit(m){return m?.status==='assigned'||m?.status==='revision_requested'}

function installStyle(){
 if(document.getElementById('mdmStudentSchoolEvidenceStyle'))return;
 const s=document.createElement('style');s.id='mdmStudentSchoolEvidenceStyle';
 s.textContent='#'+HOST_ID+'{margin:14px 0 18px;padding:16px;border:1px solid #cfe2e8;border-radius:22px;background:linear-gradient(145deg,#f5fbfc,#edf6f8);color:#103446;box-shadow:0 8px 22px rgba(20,60,80,.05)}'
 +'#'+HOST_ID+' .sse-head{display:flex;align-items:flex-start;justify-content:space-between;gap:10px;margin-bottom:12px}'
 +'#'+HOST_ID+' .sse-head small{display:block;font-size:10px;letter-spacing:.09em;font-weight:900;color:#0b8798;margin-bottom:4px}'
 +'#'+HOST_ID+' .sse-head strong{display:block;font-size:18px;line-height:1.15}'
 +'#'+HOST_ID+' .sse-refresh{border:1px solid #c8dce2;background:#fff;color:#15536a;border-radius:12px;padding:8px 10px;font-weight:850}'
 +'#'+HOST_ID+' .sse-list{display:grid;gap:10px}'
 +'#'+HOST_ID+' .sse-card{background:#fff;border:1px solid #d7e5e9;border-radius:17px;padding:13px}'
 +'#'+HOST_ID+' .sse-top{display:flex;justify-content:space-between;gap:10px;align-items:flex-start}'
 +'#'+HOST_ID+' .sse-title{font-size:15px;font-weight:900;line-height:1.2}'
 +'#'+HOST_ID+' .sse-pill{font-size:10px;font-weight:900;border-radius:999px;padding:5px 8px;background:#edf5f7;white-space:nowrap}'
 +'#'+HOST_ID+' .sse-objective{font-size:12px;line-height:1.35;color:#617985;margin:8px 0 0}'
 +'#'+HOST_ID+' textarea{width:100%;min-height:82px;margin-top:10px;border:1px solid #cadde3;border-radius:13px;padding:11px;background:#fff;color:#103446;font:inherit;resize:vertical}'
 +'#'+HOST_ID+' .sse-submit{margin-top:8px;border:0;border-radius:13px;padding:11px 13px;background:#0b7488;color:#fff;font-weight:900}'
 +'#'+HOST_ID+' .sse-wait{margin-top:9px;padding:9px 10px;border-radius:12px;background:#eef7f2;color:#315f47;font-size:12px;font-weight:750}'
 +'#'+HOST_ID+' .sse-revision{margin-top:8px;color:#8b6425;font-size:12px;font-weight:750}'
 +'#'+HOST_ID+' .sse-error{margin-top:8px;color:#9a4d3c;font-size:12px}';
 document.head.appendChild(s);
}

function cardHtml(m){
 const id=esc(m.mission_id||m.id||''),review=String(m?.review_note||m?.school_review?.note||'').trim();
 return '<article class="sse-card" data-mid="'+id+'">'
  +'<div class="sse-top"><div class="sse-title">🎯 '+esc(missionTitle(m))+'</div><span class="sse-pill">'+esc(statusLabel(m.status))+'</span></div>'
  +(missionObjective(m)?'<p class="sse-objective">'+esc(missionObjective(m))+'</p>':'')
  +(m.status==='revision_requested'&&review?'<div class="sse-revision">↺ '+esc(review)+'</div>':'')
  +(canSubmit(m)?'<textarea maxlength="1200" placeholder="'+esc(t('Descrivi la prova o ciò che hai completato','Describe the evidence or what you completed','Iddeskrivi l-evidenza jew dak li lestejt'))+'"></textarea><button class="sse-submit" type="button">📤 '+esc(t('Invia evidenza alla scuola','Send evidence to school','Ibgħat l-evidenza lill-iskola'))+'</button><div class="sse-error" hidden></div>':'')
  +(m.status==='evidence_submitted'?'<div class="sse-wait">✓ '+esc(t('Inviata. In attesa della verifica della scuola.','Sent. Waiting for school review.','Mibgħuta. Qed tistenna r-reviżjoni tal-iskola.'))+'</div>':'')
  +(m.status==='accepted'?'<div class="sse-wait">✅ '+esc(t('Verifica completata dalla scuola.','School review completed.','Ir-reviżjoni tal-iskola tlestiet.'))+'</div>':'')
  +'</article>';
}

function bind(host){
 host.querySelector('.sse-refresh')?.addEventListener('click',load);
 host.querySelectorAll('.sse-submit').forEach(btn=>btn.addEventListener('click',async()=>{
  if(busy)return;
  const card=btn.closest('[data-mid]'),ta=card?.querySelector('textarea'),err=card?.querySelector('.sse-error');
  const summary=String(ta?.value||'').trim(),mid=String(card?.dataset.mid||'');
  if(!mid||!summary){if(err){err.hidden=false;err.textContent=t('Scrivi prima una breve evidenza.','Write a short evidence note first.','Ikteb nota qasira tal-evidenza l-ewwel.')}return}
  busy=true;btn.disabled=true;
  try{
   const d=await rpc('mdm_student_submit_mission_evidence',{p_mission_id:mid,p_evidence:{summary,source:'student-school-evidence',version:VERSION,submittedAt:new Date().toISOString()}});
   if(d?.ok===false)throw new Error(String(d.error||'submit_failed'));
   await load();
  }catch(_){if(err){err.hidden=false;err.textContent=t('Invio non riuscito. Riprova.','Could not send. Try again.','Ma setax jintbagħat. Erġa’ pprova.')}}
  finally{busy=false;btn.disabled=false}
 }));
}

async function load(){
 if(!home()||!session())return false;
 try{
  const d=await rpc('mdm_student_evidence_list_missions',{}),items=Array.isArray(d?.missions)?d.missions:[];
  const rows=items.filter(m=>['assigned','revision_requested','evidence_submitted','accepted'].includes(String(m?.status||''))).slice(0,8);
  if(!rows.length){document.getElementById(HOST_ID)?.remove();return false}
  const a=anchor();if(!a)return false;
  installStyle();
  let host=document.getElementById(HOST_ID);
  if(!host){host=document.createElement('section');host.id=HOST_ID;a.insertAdjacentElement('afterend',host)}
  host.innerHTML='<div class="sse-head"><div><small>MDM · '+VERSION+'</small><strong>🏫 '+esc(t('Missioni della scuola','School missions','Missjonijiet tal-iskola'))+'</strong></div><button class="sse-refresh" type="button">↻</button></div><div class="sse-list">'+rows.map(cardHtml).join('')+'</div>';
  bind(host);return true;
 }catch(_){return false}
}
function schedule(){[0,180,500,1000,1800,3000,5000,8000].forEach(ms=>setTimeout(load,ms))}
schedule();
window.addEventListener('pageshow',schedule);
window.addEventListener('popstate',schedule);
document.addEventListener('visibilitychange',()=>{if(!document.hidden)schedule()});
window.MDM_STUDENT_SCHOOL_EVIDENCE_45838239_API=Object.freeze({version:VERSION,load});
})();