/* Malta Driving Master 45.8.38.13 — Safe Local Instructor Co-Sign */
(function(){
'use strict';
const VERSION='45.8.38.13';
const STATE_KEY='mdm-proofloop-cosign-v2';
const AUTH_KEY='mdm_auth_session_v4410';

function lang(){try{return String(JSON.parse(localStorage.getItem('mdm-v1-settings')||'{}').lang||'en')}catch(_){return'en'}}
function t(it,en,mt){return lang()==='it'?it:lang()==='mt'?mt:en}
function esc(v){return String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
function auth(){try{const s=JSON.parse(localStorage.getItem(AUTH_KEY)||'null');return s&&s.status==='authenticated'&&s.accessToken&&s.user?.id?s:null}catch(_){return null}}
async function rpc(name,payload){
 const cfg=window.MDM_BACKEND_CONFIG,s=auth();if(!cfg?.enabled||!cfg.endpoint||!cfg.publishableKey||!s)throw new Error('auth_required');
 const r=await fetch(String(cfg.endpoint).replace(/\/$/,'')+'/rest/v1/rpc/'+name,{method:'POST',headers:{'Content-Type':'application/json','apikey':cfg.publishableKey,'Authorization':'Bearer '+s.accessToken},body:JSON.stringify(payload||{}),cache:'no-store'});
 const text=await r.text();let d={};try{d=text?JSON.parse(text):{}}catch(_){}
 if(!r.ok)throw new Error(String(d?.message||d?.error||('http_'+r.status)));return d;
}
function load(){try{return JSON.parse(localStorage.getItem(STATE_KEY)||'{}')||{}}catch(_){return{}}}
function save(v){try{localStorage.setItem(STATE_KEY,JSON.stringify(v||{}))}catch(_){}return v||{}}
function requiresReview(x){return Boolean(x?.payload?.requiresInstructorCheck||x?.payload?.proofLoop?.requiresInstructorCheck)}
function proofLoopId(x){return String(x?.payload?.proofLoop?.id||'').trim()}
function matchServerMission(local,items){
 if(!local)return null;const id=String(local.id||'').trim();if(!id)return null;
 const candidates=(Array.isArray(items)?items:[]).filter(requiresReview);
 return candidates.find(x=>proofLoopId(x)===id)||candidates.find(x=>String(x?.payload?.id||'').trim()===id)||null;
}
function payload(local){
 if(!local?.id)return null;
 const base=window.MDM_PROOFLOOP_VERIFICATION?.assignmentPayload?.(local)||{};
 return {...base,id:String(local.id),proofLoop:{...(base.proofLoop||{}),id:String(local.id),requiresInstructorCheck:true},requiresInstructorCheck:true};
}
function encode(local){const p=payload(local);if(!p)return'';try{return 'MDM-COSIGN-1.'+btoa(unescape(encodeURIComponent(JSON.stringify(p))))}catch(_){return''}}
async function syncStudent(local){
 const s=auth();if(!s||!local)return load();
 const d=await rpc('mdm_student_list_missions',{});
 const items=Array.isArray(d?.missions)?d.missions:(Array.isArray(d)?d:[]);
 const item=matchServerMission(local,items);
 const st=load();
 if(item){st.linked=true;st.localMissionId=String(local.id);st.serverMissionId=String(item.id||item.mission_id||'');st.serverStatus=String(item.status||'assigned')}
 else if(String(st.localMissionId||'')===String(local.id)){st.linked=false;st.serverMissionId='';st.serverStatus=''}
 return save(st);
}
function html(local){
 if(!local?.id)return'';
 const st=load(),linked=st.linked&&String(st.localMissionId||'')===String(local.id);
 return '<div class="mdm-proofloop-verification-lock" data-mdm-safe-cosign="1">'+
  '<strong>👤 '+esc(t('Co-sign istruttore','Instructor co-sign','Co-sign tal-istruttur'))+'</strong><br>'+
  '<span>'+esc(linked?t('Missione collegata alla scuola','Mission linked to school','Missjoni marbuta mal-iskola'):t('Missione non ancora collegata alla scuola','Mission not linked to school yet','Il-missjoni għadha mhix marbuta mal-iskola'))+'</span>'+
  '<div><button id="mdmSafeCosignShow" class="secondary" type="button">'+esc(t('Mostra codice co-sign','Show co-sign code','Uri l-kodiċi co-sign'))+'</button> '+
  '<button id="mdmSafeCosignCheck" class="secondary" type="button">'+esc(t('Controlla collegamento','Check link','Iċċekkja l-link'))+'</button></div>'+
  '<textarea id="mdmSafeCosignCode" readonly hidden></textarea>'+
 '</div>';
}
function bind(local,rerender){
 const show=document.getElementById('mdmSafeCosignShow');
 const check=document.getElementById('mdmSafeCosignCheck');
 const area=document.getElementById('mdmSafeCosignCode');
 if(show&&area)show.onclick=function(){const c=encode(local);area.value=c;area.hidden=false;show.textContent='📋 '+t('Codice pronto','Code ready','Kodiċi lest')};
 if(check)check.onclick=async function(){check.disabled=true;check.textContent='⏳ '+t('Controllo…','Checking…','Qed jiġi ċċekkjat…');try{await syncStudent(local)}catch(_){}finally{check.disabled=false;if(typeof rerender==='function')rerender()}};
}
window.MDM_INSTRUCTOR_COSIGN_SAFE_4583813=Object.freeze({version:VERSION,html,bind,syncStudent,encode,matchServerMission});
})();