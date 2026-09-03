/* Malta Driving Master 45.8.38.25 — Unified Mission Lifecycle Student Bridge
   Additive only: shows server-assigned school missions in Student Home.
   Does not replace #screen, does not alter local ProofLoop state. */
(function(){
'use strict';
if(window.MDM_STUDENT_SCHOOL_EVIDENCE_45838239)return;
window.MDM_STUDENT_SCHOOL_EVIDENCE_45838239=true;

const VERSION='45.8.38.25';
const AUTH='mdm_auth_session_v4410';
const HOST_ID='mdmStudentSchoolEvidence';
const CACHE='mdm-school-evidence-cache-v1';
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
function cacheKey(){const id=String(session()?.user?.id||'').trim();return CACHE+(id?'::user:'+id:'::signed-out')}
function saveMissionCache(items){try{localStorage.setItem(cacheKey(),JSON.stringify({schema:'mdm-school-evidence-cache-v1',version:VERSION,updatedAt:new Date().toISOString(),missions:Array.isArray(items)?items:[]}))}catch(_){}}
function packLabel(id){return ({'MT-LPTV':'LPTV TAG','MT-B':'B','MT-A':'A','MT-C-CE':'C/CE','MT-D':'D'})[String(id||'')]||String(id||'')}
function missionMeta(m){const p=m?.payload||{},parts=[];if(p.pack_id)parts.push(packLabel(p.pack_id));if(p.competence_label)parts.push(String(p.competence_label));return parts.join(' · ')}
function missionId(m){return String(m?.mission_id||m?.id||'')}
function currentMission(items){
 const rows=Array.isArray(items)?items:(parse(localStorage.getItem(cacheKey()))?.missions||[]);
 return rows.find(m=>['assigned','revision_requested','evidence_submitted'].includes(String(m?.status||'')))||null;
}
function historyMissionRows(items,current){
 const cid=missionId(current);
 return (Array.isArray(items)?items:[]).filter(m=>missionId(m)!==cid&&['assigned','revision_requested','evidence_submitted','accepted'].includes(String(m?.status||''))).slice(0,8);
}
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
 +'#'+HOST_ID+' .sse-meta{font-size:11px;line-height:1.3;color:#0b7488;margin:7px 0 0;font-weight:800}'
 +'#'+HOST_ID+' .sse-open-editor{margin-top:10px;border:0;border-radius:13px;padding:12px 14px;background:#0b7488;color:#fff;font-weight:900}'
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
  +(missionMeta(m)?'<p class="sse-meta">🪪 '+esc(missionMeta(m))+'</p>':'')
  +(m.status==='revision_requested'&&review?'<div class="sse-revision">↺ '+esc(review)+'</div>':'')
  +(canSubmit(m)?'<button class="sse-open-editor" type="button">✍️ '+esc(t('Scrivi e invia evidenza','Write and send evidence','Ikteb u ibgħat evidenza'))+'</button><div class="sse-error" hidden></div>':'')
  +(m.status==='evidence_submitted'?'<div class="sse-wait">✓ '+esc(t('Inviata. In attesa della verifica della scuola.','Sent. Waiting for school review.','Mibgħuta. Qed tistenna r-reviżjoni tal-iskola.'))+'</div>':'')
  +(m.status==='accepted'?'<div class="sse-wait">✅ '+esc(t('Verifica completata dalla scuola.','School review completed.','Ir-reviżjoni tal-iskola tlestiet.'))+'</div>':'')
  +'</article>';
}

function draftKey(mid){return 'mdm-school-evidence-draft::'+String(mid||'')}
function closeEditor(){
 const m=document.getElementById('mdmEvidenceEditorModal');
 if(m)m.remove();
}
function openEditor(mid,title){
 closeEditor();
 const modal=document.createElement('div');
 modal.id='mdmEvidenceEditorModal';
 modal.style.cssText='position:fixed;inset:0;z-index:100000;background:rgba(3,24,38,.74);display:flex;align-items:flex-start;justify-content:center;padding:calc(env(safe-area-inset-top) + 18px) 14px calc(env(safe-area-inset-bottom) + 18px);overflow:auto;-webkit-overflow-scrolling:touch';
 const draft=localStorage.getItem(draftKey(mid))||'';
 modal.innerHTML='<div style="width:min(680px,100%);margin:auto 0;background:#fff;border-radius:22px;padding:18px;box-shadow:0 18px 60px rgba(0,0,0,.28);color:#103446">'
  +'<div style="display:flex;justify-content:space-between;gap:12px;align-items:flex-start"><div><small style="display:block;font-size:10px;letter-spacing:.08em;font-weight:900;color:#0b8798">MDM · '+VERSION+'</small><strong style="display:block;font-size:19px;line-height:1.2;margin-top:4px">🎯 '+esc(title)+'</strong></div><button id="mdmEvidenceEditorClose" type="button" style="border:1px solid #c8dce2;background:#fff;border-radius:12px;width:42px;height:42px;font-size:22px">×</button></div>'
  +'<textarea id="mdmEvidenceEditorText" maxlength="1200" style="box-sizing:border-box;width:100%;min-height:150px;margin-top:14px;border:1px solid #bfd5dd;border-radius:14px;padding:13px;background:#fff;color:#103446;font-family:-apple-system,BlinkMacSystemFont,Segoe UI,sans-serif;font-size:18px!important;line-height:1.4;resize:vertical;-webkit-text-size-adjust:100%" placeholder="'+esc(t('Descrivi la prova o ciò che hai completato','Describe the evidence or what you completed','Iddeskrivi l-evidenza jew dak li lestejt'))+'"></textarea>'
  +'<div id="mdmEvidenceEditorError" style="display:none;margin-top:8px;color:#9a4d3c;font-size:13px"></div>'
  +'<button id="mdmEvidenceEditorSend" type="button" style="margin-top:12px;width:100%;border:0;border-radius:14px;padding:13px 15px;background:#0b7488;color:#fff;font-size:16px;font-weight:900">📤 '+esc(t('Invia evidenza alla scuola','Send evidence to school','Ibgħat l-evidenza lill-iskola'))+'</button>'
  +'</div>';
 document.body.appendChild(modal);
 const ta=modal.querySelector('#mdmEvidenceEditorText');
 ta.value=draft;
 ta.addEventListener('input',()=>{try{localStorage.setItem(draftKey(mid),ta.value)}catch(_){}});
 modal.querySelector('#mdmEvidenceEditorClose').onclick=closeEditor;
 modal.addEventListener('click',ev=>{if(ev.target===modal)closeEditor()});
 modal.querySelector('#mdmEvidenceEditorSend').onclick=async()=>{
   if(busy)return;
   const summary=String(ta.value||'').trim(),err=modal.querySelector('#mdmEvidenceEditorError'),send=modal.querySelector('#mdmEvidenceEditorSend');
   if(!summary){err.style.display='block';err.textContent=t('Scrivi prima una breve evidenza.','Write a short evidence note first.','Ikteb nota qasira tal-evidenza l-ewwel.');return}
   busy=true;send.disabled=true;
   try{
     const automaticEvidence=window.MDM_PROOFLOOP_VERIFICATION?.evidenceForServerMission?.(mid)||null;
     const d=await rpc('mdm_student_submit_mission_evidence',{p_mission_id:mid,p_evidence:{summary,source:'unified-mission-lifecycle',version:VERSION,submittedAt:new Date().toISOString(),automaticEvidence}});
     if(d?.ok===false)throw new Error(String(d.error||'submit_failed'));
     try{localStorage.removeItem(draftKey(mid))}catch(_){}
     closeEditor();
     await load(true);
   }catch(_){
     err.style.display='block';
     err.textContent=t('Invio non riuscito. Riprova.','Could not send. Try again.','Ma setax jintbagħat. Erġa’ pprova.');
   }finally{busy=false;send.disabled=false}
 };
 setTimeout(()=>{try{ta.focus({preventScroll:true});const n=ta.value.length;ta.setSelectionRange(n,n)}catch(_){}},180);
}
function bind(host){
 host.querySelector('.sse-refresh')?.addEventListener('click',()=>load(true));
 host.querySelectorAll('.sse-open-editor').forEach(btn=>btn.addEventListener('click',()=>{
   const card=btn.closest('[data-mid]'),mid=String(card?.dataset.mid||''),title=String(card?.querySelector('.sse-title')?.textContent||'').replace(/^🎯\s*/,'');
   if(mid)openEditor(mid,title);
 }));
}
async function load(force=false){
 if(!home()||!session())return false;
 try{
  const d=await rpc('mdm_student_evidence_list_missions',{}),items=Array.isArray(d?.missions)?d.missions:[];
  saveMissionCache(items);
  const current=currentMission(items);
  try{window.MDM_PROOFLOOP_VERIFICATION?.unifiedCurrent?.(window.MDM_PROOFLOOP_ENGINE?.evaluate?.()||null)}catch(_){}
  try{window.MDM_DRIVER_COMPETENCE_PASSPORT?.sync?.();window.MDM_DRIVER_COMPETENCE_PASSPORT?.render?.()}catch(_){}
  try{window.MDM_PROOFLOOP_UI?.render?.();window.MDM_COMPACT_HOME_45836?.refresh?.()}catch(_){}
  const rows=historyMissionRows(items,current);
  if(!rows.length){document.getElementById(HOST_ID)?.remove();return true}
  const a=anchor();if(!a)return false;
  installStyle();
  let host=document.getElementById(HOST_ID);
  if(!host){host=document.createElement('section');host.id=HOST_ID;a.insertAdjacentElement('afterend',host)}
  const sig=lang()+'|'+JSON.stringify(rows.map(m=>[m?.mission_id||m?.id||'',m?.status||'',m?.updated_at||'',m?.review_note||'',m?.payload?.title||'',m?.payload?.objective||'',m?.student_evidence?.summary||'']));
  const active=document.activeElement;
  const editing=!!(active&&host.contains(active)&&active.matches('textarea'));
  const hasDraft=Array.from(host.querySelectorAll('textarea')).some(x=>String(x.value||'').length>0);
  if(!force&&host.dataset.sig===sig)return true;
  if(!force&&(editing||hasDraft))return true;
  host.innerHTML='<div class="sse-head"><div><small>MDM · '+VERSION+'</small><strong>🏫 '+esc(t('Storico e altre missioni','History and other missions','Storja u missjonijiet oħra'))+'</strong></div><button class="sse-refresh" type="button">↻</button></div><div class="sse-list">'+rows.map(cardHtml).join('')+'</div>';
  host.dataset.sig=sig;
  bind(host);return true;
 }catch(_){return false}
}
function schedule(){[0,180,500,1000,1800,3000,5000,8000].forEach(ms=>setTimeout(load,ms))}
schedule();
window.addEventListener('pageshow',schedule);
window.addEventListener('popstate',schedule);
document.addEventListener('visibilitychange',()=>{if(!document.hidden)schedule()});
window.MDM_STUDENT_SCHOOL_EVIDENCE_45838239_API=Object.freeze({version:VERSION,load,openEditor,currentMission:()=>currentMission()});
})();