/* Malta Driving Master 45.8.37 — Malta Road Intelligence */
(function(){
'use strict';
if(window.MDM_MALTA_ROAD_INTELLIGENCE)return;

const VERSION='45.8.37';
const AUTH='mdm_auth_session_v4410';
const K={
 telemetry:'mdm-v1-real-road-telemetry',
 road:'mdm-v1-real-road-twin',
 pattern:'mdm-v1-real-road-selected-pattern'
};
let raf=0;

function parse(v){try{return v?JSON.parse(v):null}catch(_){return null}}
function session(){return parse(localStorage.getItem(AUTH))}
function uid(){return String(session()?.user?.id||'')}
function authenticated(){const s=session();return !!(s&&s.status==='authenticated'&&s.accessToken&&s.user?.id&&(!(Number(s.expiresAt)>0)||Number(s.expiresAt)>Date.now()))}
function read(base){const id=uid();if(id){const x=parse(localStorage.getItem(base+'::user:'+id));if(x!==null)return x}return parse(localStorage.getItem(base))}
function lang(){return String(read('mdm-v1-settings')?.lang||'en')}
function t(it,en,mt){const l=lang();return l==='it'?it:l==='mt'?mt:en}
function esc(v){return String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
function home(){const h=String(location.hash||'').replace(/^#/,'');return !h||h==='home'}

function telemetryStore(){
 const local=read(K.telemetry)||{};
 let global=null;
 try{if(typeof realRoadTelemetryStore!=='undefined')global=realRoadTelemetryStore}catch(_){}
 const sessions=[];
 if(Array.isArray(local.sessions))sessions.push(...local.sessions);
 if(global&&Array.isArray(global.sessions))global.sessions.forEach(x=>{if(!sessions.includes(x))sessions.push(x)});
 return {local,global,sessions};
}
function roadRecords(){
 try{if(typeof realRoadEvidenceRows==='function'){const x=realRoadEvidenceRows();if(Array.isArray(x))return x}}catch(_){}
 const raw=read(K.road);
 if(Array.isArray(raw))return raw;
 if(Array.isArray(raw?.rows))return raw.rows;
 if(Array.isArray(raw?.records))return raw.records;
 return raw&&typeof raw==='object'?[raw]:[];
}
function proof(){try{return window.MDM_PROOFLOOP_ENGINE?.evaluate?.()||null}catch(_){return null}}
function mission(){try{return window.MDM_PROOFLOOP_VERIFICATION?.current?.()||null}catch(_){return null}}

function walk(obj,cb,depth=0,seen=new WeakSet()){
 if(depth>6||obj==null)return;
 if(typeof obj==='object'){
  if(seen.has(obj))return;seen.add(obj);
  if(Array.isArray(obj)){obj.slice(0,500).forEach(v=>walk(v,cb,depth+1,seen));return}
  cb(obj);
  Object.values(obj).slice(0,300).forEach(v=>walk(v,cb,depth+1,seen));
 }
}
function coordOf(o){
 if(!o||typeof o!=='object')return null;
 const lat=Number(o.latitude??o.lat??o.coords?.latitude??o.coords?.lat);
 const lon=Number(o.longitude??o.lng??o.lon??o.coords?.longitude??o.coords?.lng??o.coords?.lon);
 if(!Number.isFinite(lat)||!Number.isFinite(lon))return null;
 if(lat<35.6||lat>36.3||lon<14.0||lon>14.8)return null;
 return {lat,lon};
}
function zoneKey(c){
 if(!c)return '';
 const lat=Math.round(c.lat*100)/100;
 const lon=Math.round(c.lon*100)/100;
 return lat.toFixed(2)+'/'+lon.toFixed(2);
}
function eventType(o){
 if(!o||typeof o!=='object')return '';
 const raw=String(o.type??o.event??o.kind??o.name??o.label??'').toLowerCase();
 if(!raw)return '';
 if(/brak|decel|fren/.test(raw))return 'braking';
 if(/acceler/.test(raw))return 'acceleration';
 if(/speed|veloc/.test(raw))return 'speed';
 if(/stop|halt|sosta/.test(raw))return 'stop';
 if(/turn|corner|bend|curve|svolt|curv/.test(raw))return 'turn';
 if(/lane|position|corsia|posizion/.test(raw))return 'lane';
 if(/mirror|observ|specch|osserv/.test(raw))return 'observation';
 if(/junction|roundabout|incro|rotator/.test(raw))return 'junction';
 return '';
}
function eventLabel(k){
 const m={
  braking:[t('Frenata','Braking','Ibbrejkjar'),'🛑'],
  acceleration:[t('Accelerazione','Acceleration','Aċċelerazzjoni'),'↗️'],
  speed:[t('Velocità','Speed','Veloċità'),'🧭'],
  stop:[t('Soste','Stops','Waqfiet'),'⏸️'],
  turn:[t('Curve / svolte','Turns / bends','Dawriet'),'↪️'],
  lane:[t('Corsia / posizione','Lane / positioning','Korsija / pożizzjoni'),'🛣️'],
  observation:[t('Osservazione','Observation','Osservazzjoni'),'👀'],
  junction:[t('Incroci / rotatorie','Junctions / roundabouts','Salib it-toroq / roundabouts'),'🔄']
 };
 return m[k]||[k,'•'];
}
function latestTime(items){
 let best=0;
 walk(items,o=>{
  for(const k of ['endedAt','completedAt','createdAt','startedAt','timestamp','date','at']){
   const ms=Date.parse(o?.[k]||'');
   if(Number.isFinite(ms)&&ms>best)best=ms;
  }
 });
 return best||null;
}
function snapshot(){
 const tel=telemetryStore(), roads=roadRecords(), p=proof(), m=mission();
 const zones=new Set(), events={};
 let coords=0;
 walk(tel.sessions,o=>{
  const c=coordOf(o);
  if(c){coords++;zones.add(zoneKey(c))}
  const ev=eventType(o);if(ev)events[ev]=(events[ev]||0)+1;
 });
 walk(roads,o=>{
  const c=coordOf(o);
  if(c){coords++;zones.add(zoneKey(c))}
  const ev=eventType(o);if(ev)events[ev]=(events[ev]||0)+1;
 });
 const sessions=Number(p?.sources?.telemetry?.sessions||tel.sessions.length||0);
 const records=Number(p?.sources?.road?.records||roads.length||0);
 const missionNew=Number(m?.evidence?.roadDelta||0)+Number(m?.evidence?.telemetryDelta||0);
 let next=t('Registra una nuova sessione reale per ampliare la copertura osservata.','Record a new real-road session to expand observed coverage.','Irreġistra sessjoni ġdida fit-triq biex twessa’ l-kopertura osservata.');
 if(m?.status==='active'&&missionNew<=0)next=t('Completa la missione attiva con una nuova prova strada o telemetria successiva alla baseline.','Complete the active mission with new road or telemetry evidence after its baseline.','Imla l-missjoni attiva b’evidenza ġdida tat-triq jew telemetrija wara l-baseline.');
 else if(m?.status==='awaiting_instructor')next=t('La nuova prova è acquisita: ora serve la verifica dell’istruttore.','New evidence has been acquired: instructor verification is now required.','L-evidenza l-ġdida nġabret: issa hemm bżonn il-verifika tal-istruttur.');
 else if(sessions>0&&Object.keys(events).length<2)next=t('La telemetria è presente: la prossima prova utile deve aggiungere varietà di eventi, non solo chilometri.','Telemetry is present: the next useful drive should add event variety, not just mileage.','It-telemetrija hija preżenti: is-sewqan li jmiss għandu jżid varjetà ta’ avvenimenti, mhux biss kilometri.');
 return {
  version:VERSION,
  sessions,records,
  zones:zones.size,
  coordinateSamples:coords,
  events,
  eventTypes:Object.keys(events).length,
  latestAt:latestTime([tel.sessions,roads]),
  missionTarget:String(m?.target?.label||''),
  missionStatus:String(m?.status||''),
  next
 };
}
function dateLabel(ms){if(!ms)return t('Non disponibile','Not available','Mhux disponibbli');try{return new Date(ms).toLocaleDateString()}catch(_){return '—'}}
function html(x){
 const ev=Object.entries(x.events).sort((a,b)=>b[1]-a[1]).slice(0,6);
 const eventHtml=ev.length?ev.map(([k,n])=>{const [label,icon]=eventLabel(k);return '<span>'+icon+' '+esc(label)+' · '+n+'</span>'}).join(''):'<span>'+esc(t('Nessun evento classificabile ancora','No classifiable events yet','Għad m’hemm l-ebda avveniment klassifikabbli'))+'</span>';
 const privacy=x.coordinateSamples>0
  ?t('Le coordinate precise non vengono mostrate: MDM usa solo zone aggregate per leggere la varietà della guida.','Precise coordinates are not displayed: MDM uses only aggregated zones to understand driving variety.','Il-koordinati preċiżi ma jintwerewx: MDM juża biss żoni aggregati biex jifhem il-varjetà tas-sewqan.')
  :t('Nessuna coordinata utilizzabile rilevata: l’intelligence resta basata solo sulle prove realmente disponibili.','No usable coordinates detected: intelligence remains based only on evidence actually available.','Ma nstabet l-ebda koordinata li tista’ tintuża: l-intelliġenza tibqa’ bbażata biss fuq l-evidenza disponibbli.');
 return '<div class="mdm-road-head"><div><small>MDM PROOFLOOP · '+VERSION+'</small><h2>🛣️ '+esc(t('Malta Road Intelligence','Malta Road Intelligence','Malta Road Intelligence'))+'</h2><p>'+esc(t('Trasforma le sessioni reali già raccolte in copertura stradale osservata, senza inventare percorsi d’esame.','Turns already-collected real drives into observed road coverage, without inventing test routes.','Jibdel is-sessjonijiet reali diġà miġbura f’kopertura osservata tat-triq, mingħajr ma jivvinta rotot tat-test.'))+'</p></div><span>🇲🇹</span></div>'+
 '<div class="mdm-road-stats"><div><span>'+esc(t('Sessioni','Sessions','Sessjonijiet'))+'</span><strong>'+x.sessions+'</strong></div><div><span>'+esc(t('Prove strada','Road evidence','Evidenza tat-triq'))+'</span><strong>'+x.records+'</strong></div><div><span>'+esc(t('Zone aggregate','Aggregated zones','Żoni aggregati'))+'</span><strong>'+(x.coordinateSamples?x.zones:'—')+'</strong></div><div><span>'+esc(t('Tipi evento','Event types','Tipi ta’ avvenimenti'))+'</span><strong>'+x.eventTypes+'</strong></div></div>'+
 '<div class="mdm-road-events"><div><strong>'+esc(t('Eventi osservati','Observed events','Avvenimenti osservati'))+'</strong><small>'+esc(t('Ultima evidenza','Latest evidence','L-aħħar evidenza'))+': '+esc(dateLabel(x.latestAt))+'</small></div><div class="mdm-road-event-chips">'+eventHtml+'</div></div>'+
 (x.missionTarget?'<div class="mdm-road-mission"><span>🎯 '+esc(t('Missione collegata','Linked mission','Missjoni marbuta'))+'</span><strong>'+esc(x.missionTarget)+'</strong></div>':'')+
 '<div class="mdm-road-next"><span>→ '+esc(t('Prossima prova utile','Next useful road proof','Il-prova utli li jmiss'))+'</span><strong>'+esc(x.next)+'</strong></div>'+
 '<p class="mdm-road-privacy">🔒 '+esc(privacy)+'</p>';
}
function render(){
 const old=document.getElementById('mdmMaltaRoadIntelligence');
 if(!authenticated()||!home()){old?.remove();return}
 const p=proof();if(!p||['school','owner','admin'].includes(String(p.role||''))){old?.remove();return}
 const anchor=document.getElementById('mdmDriverCompetencePassport')||document.getElementById('mdmExamOutcomeCard')||document.getElementById('mdmProofLoopCard');
 if(!anchor)return;
 let card=old;if(!card){card=document.createElement('section');card.id='mdmMaltaRoadIntelligence';card.className='mdm-road-intelligence';anchor.insertAdjacentElement('afterend',card)}
 card.innerHTML=html(snapshot());
}
function schedule(){if(raf)return;raf=requestAnimationFrame(()=>{raf=0;render()})}
render();
const screen=document.getElementById('screen');if(screen){const o=new MutationObserver(schedule);o.observe(screen,{childList:true,subtree:true});window.__MDM_ROAD_INTELLIGENCE_OBSERVER__=o}
window.addEventListener('pageshow',schedule);window.addEventListener('storage',schedule);window.addEventListener('popstate',schedule);document.addEventListener('visibilitychange',()=>{if(!document.hidden)schedule()});
window.MDM_MALTA_ROAD_INTELLIGENCE=Object.freeze({version:VERSION,snapshot,render});
})();