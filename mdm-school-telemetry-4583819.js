/* Malta Driving Master 45.8.38.19 — School Telemetry Evidence Bridge */
(function(){
'use strict';
if(window.MDM_SCHOOL_TELEMETRY_4583819)return;

const AUTH='mdm_auth_session_v4410';
const TELEMETRY_KEY='mdm-v1-real-road-telemetry';
const SCHEMA='mdm-school-telemetry-evidence-v1';
let schoolStudents=[];
let selectedStudent='';
let watchId=null;
let active=null;
let mountBusy=false;
let syncBusy=false;

function parse(v){try{return v?JSON.parse(v):null}catch(_){return null}}
function session(){return parse(localStorage.getItem(AUTH))}
function authenticated(){
 const s=session();
 return !!(s&&s.status==='authenticated'&&s.accessToken&&s.user?.id&&(!(Number(s.expiresAt)>0)||Number(s.expiresAt)>Date.now()));
}
function lang(){
 try{return String(parse(localStorage.getItem('mdm-v1-settings'))?.lang||'en')}catch(_){return'en'}
}
function t(it,en,mt){const l=lang();return l==='it'?it:l==='mt'?mt:en}
function esc(v){return String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
function cfg(){
 const c=window.MDM_BACKEND_CONFIG;
 if(!c||!c.enabled||!c.endpoint||!c.publishableKey)throw new Error('backend_config_unavailable');
 return {endpoint:String(c.endpoint).replace(/\/$/,''),key:String(c.publishableKey)};
}
async function rpc(name,payload){
 const c=cfg(),s=session();
 if(!authenticated())throw new Error('authentication_required');
 const r=await fetch(c.endpoint+'/rest/v1/rpc/'+name,{
  method:'POST',
  headers:{'Content-Type':'application/json','apikey':c.key,'Authorization':'Bearer '+s.accessToken},
  body:JSON.stringify(payload||{}),
  cache:'no-store'
 });
 const tx=await r.text();let d={};try{d=tx?JSON.parse(tx):{}}catch(_){}
 if(Array.isArray(d))d=d[0]||{};
 if(!r.ok)throw new Error(String(d?.message||d?.error||('http_'+r.status)));
 return d||{};
}
function findSchoolHost(){
 const direct=document.querySelector('.sch35');
 if(direct)return direct;
 const account=document.querySelector('.account-enroll-card');
 if(account)return account;
 return Array.from(document.querySelectorAll('section,article,.card,div')).find(el=>/CONSOLE\s+SCUOLA\s+SERVER/i.test(String(el.innerText||'')))||null;
}
function fmt(n,d){return Number.isFinite(Number(n))?Number(n).toFixed(d):'0'}
function haversine(a,b){
 if(!a||!b)return 0;
 const R=6371000,rad=Math.PI/180;
 const dLat=(b.lat-a.lat)*rad,dLon=(b.lon-a.lon)*rad;
 const x=Math.sin(dLat/2)**2+Math.cos(a.lat*rad)*Math.cos(b.lat*rad)*Math.sin(dLon/2)**2;
 return 2*R*Math.atan2(Math.sqrt(x),Math.sqrt(1-x));
}
function coarse(v){return Number(Number(v).toFixed(3))}
function durationSec(){return active?Math.max(0,Math.round((Date.now()-active.startedMs)/1000)):0}
function live(){
 if(!active)return;
 const d=document.getElementById('mdmTelemetryDuration');
 const km=document.getElementById('mdmTelemetryDistance');
 const sp=document.getElementById('mdmTelemetrySpeed');
 const sm=document.getElementById('mdmTelemetrySamples');
 if(d)d.textContent=Math.floor(durationSec()/60)+':'+String(durationSec()%60).padStart(2,'0');
 if(km)km.textContent=fmt(active.distanceM/1000,2)+' km';
 if(sp)sp.textContent=fmt(active.lastSpeedKph||0,0)+' km/h';
 if(sm)sm.textContent=String(active.samples||0);
}
function setPanelStatus(text,ok){
 const el=document.getElementById('mdmSchoolTelemetryStatus');
 if(!el)return;
 el.textContent=text;
 el.style.background=ok===true?'rgba(16,185,129,.10)':ok===false?'rgba(220,38,38,.09)':'rgba(15,113,128,.08)';
}
function onPosition(pos){
 if(!active)return;
 const c=pos.coords||{};
 const p={lat:Number(c.latitude),lon:Number(c.longitude),accuracy:Number(c.accuracy||999),at:Number(pos.timestamp||Date.now())};
 if(!Number.isFinite(p.lat)||!Number.isFinite(p.lon))return;
 active.samples++;
 active.accuracySum+=Number.isFinite(p.accuracy)?p.accuracy:0;
 active.bestAccuracy=Math.min(active.bestAccuracy,p.accuracy);
 if(!active.start)active.start=p;
 active.end=p;

 let segment=0;
 if(active.last&&p.accuracy<=60&&active.last.accuracy<=60){
  segment=haversine(active.last,p);
  const dt=Math.max(.5,(p.at-active.last.at)/1000);
  const derived=(segment/dt)*3.6;
  if(derived<=180&&segment<=500)active.distanceM+=segment;
 }
 let speed=Number(c.speed);
 speed=Number.isFinite(speed)&&speed>=0?speed*3.6:(active.last&&p.at>active.last.at?segment/((p.at-active.last.at)/1000)*3.6:0);
 if(!Number.isFinite(speed)||speed<0||speed>180)speed=0;
 active.lastSpeedKph=speed;
 active.maxSpeedKph=Math.max(active.maxSpeedKph,speed);
 const moving=speed>=2;
 if(active.wasMoving&&!moving)active.stops++;
 active.wasMoving=moving;
 active.last=p;
 live();
}
function onGeoError(err){
 setPanelStatus(t('GPS non disponibile: ','GPS unavailable: ','GPS mhux disponibbli: ')+String(err?.message||err||''),false);
}
async function loadStudents(){
 const d=await rpc('mdm_school_list_active_students',{});
 if(d.authorized!==true)return [];
 schoolStudents=Array.isArray(d.students)?d.students:[];
 if(!selectedStudent&&schoolStudents[0])selectedStudent=String(schoolStudents[0].student_user_id||'');
 return schoolStudents;
}
function panelHtml(){
 const opts=schoolStudents.map(s=>'<option value="'+esc(String(s.student_user_id||''))+'" '+(String(s.student_user_id||'')===selectedStudent?'selected':'')+'>'+esc(String(s.student_name||s.student_email||t('Studente','Student','Student')))+'</option>').join('');
 return '<section id="mdmSchoolTelemetryPanel" style="margin:14px 0;padding:15px;border:1px solid rgba(15,113,128,.22);border-radius:18px;background:rgba(238,248,250,.92);color:#173f4c">'+
  '<div style="display:flex;justify-content:space-between;gap:12px;align-items:flex-start"><div><small style="font-weight:900;letter-spacing:.07em">MDM · '+VERSION+'</small><h3 style="margin:4px 0 5px">🚗 '+esc(t('Telemetria lezione pratica','Practical lesson telemetry','Telemetrija tal-lezzjoni prattika'))+'</h3><p style="margin:0;font-size:12px;line-height:1.4;opacity:.78">'+esc(t('La Scuola registra la sessione e la attribuisce allo studente selezionato. Il telefono deve restare fissato durante la guida.','The school records the session and assigns it to the selected learner. The phone must remain mounted while driving.','L-iskola tirreġistra s-sessjoni u torbotha mal-istudent magħżul. It-telefon għandu jibqa’ mwaħħal waqt is-sewqan.'))+'</p></div><span style="font-size:28px">📡</span></div>'+
  '<label style="display:block;margin-top:12px"><span style="display:block;font-size:10px;font-weight:900;margin-bottom:5px">'+esc(t('Studente','Student','Student'))+'</span><select id="mdmTelemetryStudent" style="width:100%;padding:10px;border-radius:11px;border:1px solid rgba(15,113,128,.22);background:#fff">'+opts+'</select></label>'+
  '<div style="display:grid;grid-template-columns:repeat(4,1fr);gap:7px;margin-top:11px">'+
   '<div style="padding:8px;border-radius:10px;background:#fff"><small>'+esc(t('Durata','Duration','Tul'))+'</small><strong id="mdmTelemetryDuration" style="display:block">0:00</strong></div>'+
   '<div style="padding:8px;border-radius:10px;background:#fff"><small>'+esc(t('Distanza','Distance','Distanza'))+'</small><strong id="mdmTelemetryDistance" style="display:block">0.00 km</strong></div>'+
   '<div style="padding:8px;border-radius:10px;background:#fff"><small>'+esc(t('Velocità','Speed','Veloċità'))+'</small><strong id="mdmTelemetrySpeed" style="display:block">0 km/h</strong></div>'+
   '<div style="padding:8px;border-radius:10px;background:#fff"><small>'+esc(t('Campioni','Samples','Kampjuni'))+'</small><strong id="mdmTelemetrySamples" style="display:block">0</strong></div>'+
  '</div>'+
  '<div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-top:11px">'+
   '<button id="mdmTelemetryStart" type="button" style="border:0;border-radius:12px;padding:11px;font-weight:900;background:#0f7180;color:#fff">▶ '+esc(t('Avvia telemetria','Start telemetry','Ibda t-telemetrija'))+'</button>'+
   '<button id="mdmTelemetryStop" type="button" disabled style="border:0;border-radius:12px;padding:11px;font-weight:900;background:#173f4c;color:#fff;opacity:.5">■ '+esc(t('Termina e salva','Stop & save','Waqqaf u salva'))+'</button>'+
  '</div>'+
  '<div id="mdmSchoolTelemetryStatus" style="margin-top:10px;padding:9px 10px;border-radius:10px;background:rgba(15,113,128,.08);font-size:11px">'+esc(t('Pronta. Seleziona lo studente e avvia prima di partire.','Ready. Select the learner and start before driving.','Lesta. Agħżel l-istudent u ibda qabel issuq.'))+'</div>'+
  '<small style="display:block;margin-top:9px;opacity:.65">'+esc(t('Privacy: MDM salva metriche della sessione e coordinate iniziale/finale approssimate (~100 m), non il percorso GPS completo.','Privacy: MDM stores session metrics and approximate start/end coordinates (~100 m), not the full GPS track.','Privatezza: MDM jaħżen il-metriċi tas-sessjoni u koordinati approssimattivi tal-bidu/tmiem (~100 m), mhux ir-rotta GPS sħiħa.'))+'</small>'+
 '</section>';
}
function bindPanel(){
 const sel=document.getElementById('mdmTelemetryStudent');
 const start=document.getElementById('mdmTelemetryStart');
 const stop=document.getElementById('mdmTelemetryStop');
 if(sel)sel.onchange=function(){selectedStudent=String(sel.value||'')};
 if(start)start.onclick=startTelemetry;
 if(stop)stop.onclick=stopTelemetry;
}
async function mountSchool(){
 if(mountBusy||!authenticated())return false;
 const host=findSchoolHost();
 if(!host){document.getElementById('mdmSchoolTelemetryPanel')?.remove();return false}
 if(document.getElementById('mdmSchoolTelemetryPanel'))return true;
 mountBusy=true;
 try{
  const rows=await loadStudents();
  if(!rows.length)return false;
  const wrap=document.createElement('div');
  wrap.innerHTML=panelHtml();
  const panel=wrap.firstElementChild;
  const anchor=host.querySelector('.sch35-profile-entry')||host.querySelector('.sch35-head');
  if(anchor)anchor.insertAdjacentElement('afterend',panel);else host.insertBefore(panel,host.firstChild||null);
  bindPanel();
  return true;
 }catch(_){return false}
 finally{mountBusy=false}
}
function startTelemetry(){
 if(active||watchId!==null)return;
 if(!selectedStudent){setPanelStatus(t('Seleziona uno studente.','Select a learner.','Agħżel student.'),false);return}
 if(!navigator.geolocation){setPanelStatus(t('GPS non supportato su questo dispositivo.','GPS is not supported on this device.','GPS mhux appoġġjat fuq dan l-apparat.'),false);return}
 active={
  sessionId:'TEL-'+Date.now().toString(36).toUpperCase(),
  studentUserId:selectedStudent,
  startedAt:new Date().toISOString(),
  startedMs:Date.now(),
  samples:0,distanceM:0,maxSpeedKph:0,lastSpeedKph:0,stops:0,
  accuracySum:0,bestAccuracy:9999,start:null,end:null,last:null,wasMoving:false
 };
 watchId=navigator.geolocation.watchPosition(onPosition,onGeoError,{enableHighAccuracy:true,maximumAge:1000,timeout:12000});
 const start=document.getElementById('mdmTelemetryStart'),stop=document.getElementById('mdmTelemetryStop');
 if(start){start.disabled=true;start.style.opacity='.5'}
 if(stop){stop.disabled=false;stop.style.opacity='1'}
 setPanelStatus(t('Registrazione attiva. Non usare il telefono durante la guida.','Recording. Do not use the phone while driving.','Ir-reġistrazzjoni attiva. Tużax it-telefon waqt is-sewqan.'),true);
 live();
}
async function stopTelemetry(){
 if(!active)return;
 const snapshot=active;
 if(watchId!==null){try{navigator.geolocation.clearWatch(watchId)}catch(_){}watchId=null}
 active=null;
 const start=document.getElementById('mdmTelemetryStart'),stop=document.getElementById('mdmTelemetryStop');
 if(start){start.disabled=false;start.style.opacity='1'}
 if(stop){stop.disabled=true;stop.style.opacity='.5'}

 const endedAt=new Date().toISOString();
 const duration=Math.max(0,Math.round((Date.now()-snapshot.startedMs)/1000));
 const valid=duration>=30&&snapshot.samples>=3;
 if(!valid){
  setPanelStatus(t('Sessione troppo breve: servono almeno 30 secondi e 3 campioni GPS. Non salvata.','Session too short: at least 30 seconds and 3 GPS samples are required. Not saved.','Sessjoni qasira wisq: hemm bżonn mill-inqas 30 sekonda u 3 kampjuni GPS. Ma ġietx salvata.'),false);
  return;
 }
 const telemetry={
  sessionId:snapshot.sessionId,
  source:'school_instructor',
  valid:true,
  startedAt:snapshot.startedAt,
  endedAt,
  durationSeconds:duration,
  distanceKm:Number((snapshot.distanceM/1000).toFixed(3)),
  avgSpeedKph:duration>0?Number(((snapshot.distanceM/1000)/(duration/3600)).toFixed(1)):0,
  maxSpeedKph:Number(snapshot.maxSpeedKph.toFixed(1)),
  stops:Number(snapshot.stops||0),
  sampleCount:Number(snapshot.samples||0),
  avgAccuracyM:snapshot.samples?Number((snapshot.accuracySum/snapshot.samples).toFixed(1)):null,
  bestAccuracyM:Number.isFinite(snapshot.bestAccuracy)?Number(snapshot.bestAccuracy.toFixed(1)):null,
  coarseStart:snapshot.start?{lat:coarse(snapshot.start.lat),lon:coarse(snapshot.start.lon)}:null,
  coarseEnd:snapshot.end?{lat:coarse(snapshot.end.lat),lon:coarse(snapshot.end.lon)}:null
 };
 const payload={
  schema:SCHEMA,
  evidenceType:'telemetry_session',
  title:t('Telemetria lezione pratica','Practical lesson telemetry','Telemetrija tal-lezzjoni prattika'),
  priority:'telemetry',
  requiresInstructorCheck:false,
  telemetry
 };
 setPanelStatus(t('Salvataggio server in corso…','Saving to server…','Qed tissejvja fuq is-server…'),null);
 try{
  await rpc('mdm_school_assign_mission',{p_student_user_id:snapshot.studentUserId,p_payload:payload});
  setPanelStatus('✅ '+t('Sessione salvata e attribuita allo studente.','Session saved and assigned to the learner.','Is-sessjoni ġiet salvata u marbuta mal-istudent.'),true);
 }catch(e){
  setPanelStatus('❌ '+t('Salvataggio non riuscito: ','Save failed: ','Is-salvataġġ falla: ')+String(e?.message||e||''),false);
 }
}
function readLocalTelemetry(){return parse(localStorage.getItem(TELEMETRY_KEY))||{sessions:[]}}
function writeLocalTelemetry(v){try{localStorage.setItem(TELEMETRY_KEY,JSON.stringify(v))}catch(_){}}
async function syncStudentTelemetry(){
 if(syncBusy||!authenticated())return false;
 const host=findSchoolHost();
 if(host)return false;
 syncBusy=true;
 try{
  const d=await rpc('mdm_student_list_missions',{});
  const rows=Array.isArray(d?.missions)?d.missions:(Array.isArray(d)?d:[]);
  const incoming=rows.map(x=>x?.payload).filter(p=>p&&p.schema===SCHEMA&&p.evidenceType==='telemetry_session'&&p.telemetry?.valid===true).map(p=>p.telemetry);
  if(!incoming.length)return false;
  const store=readLocalTelemetry();
  const existing=Array.isArray(store.sessions)?store.sessions:[];
  const byId=new Map(existing.map(x=>[String(x?.sessionId||x?.id||''),x]));
  incoming.forEach(x=>{
   const id=String(x.sessionId||'');
   if(id)byId.set(id,Object.assign({},x,{verified:true,serverEvidence:true}));
  });
  const sessions=Array.from(byId.values()).sort((a,b)=>String(a.startedAt||'').localeCompare(String(b.startedAt||'')));
  if(sessions.length===existing.length&&incoming.every(x=>existing.some(e=>String(e?.sessionId||'')===String(x.sessionId||''))))return false;
  store.sessions=sessions;
  store.updatedAt=new Date().toISOString();
  store.source='server_school_telemetry_sync';
  writeLocalTelemetry(store);
  try{window.MDM_PROOFLOOP_UI?.render?.()}catch(_){}
  try{window.MDM_COMPACT_HOME_45836?.refresh?.()}catch(_){}
  return true;
 }catch(_){return false}
 finally{syncBusy=false}
}
function schedule(){
 setTimeout(mountSchool,120);
 setTimeout(mountSchool,700);
 setTimeout(syncStudentTelemetry,250);
 setTimeout(syncStudentTelemetry,1400);
}
schedule();
window.addEventListener('pageshow',schedule);
window.addEventListener('popstate',schedule);
document.addEventListener('visibilitychange',function(){if(!document.hidden)schedule()});
window.MDM_SCHOOL_TELEMETRY_4583819=Object.freeze({version:VERSION,mount:mountSchool,sync:syncStudentTelemetry});
})();