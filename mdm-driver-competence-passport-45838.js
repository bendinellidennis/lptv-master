/* Malta Driving Master 45.8.38 — Driver Competence Passport + Instructor Co-Sign */
(function(){
'use strict';
if(window.MDM_DRIVER_COMPETENCE_PASSPORT)return;

const VERSION='45.8.38';
const AUTH='mdm_auth_session_v4410';
const STORE='mdm-driver-competence-passport-v1';
const OWNER='maltadrivingmaster@gmail.com';
let raf=0,viewPack='';

const PACKS=[
 {id:'MT-B',code:'B',it:'Patente B · Auto',en:'Category B · Car',mt:'Kategorija B · Karozza'},
 {id:'MT-A',code:'A',it:'Moto',en:'Motorcycle',mt:'Mutur'},
 {id:'MT-C-CE',code:'C/CE',it:'Camion C/CE',en:'Truck C/CE',mt:'Trakk C/CE'},
 {id:'MT-D',code:'D',it:'Bus D',en:'Bus D',mt:'Xarabank D'},
 {id:'MT-LPTV',code:'LPTV',it:'LPTV TAG',en:'LPTV TAG',mt:'LPTV TAG'}
];

const CORE=[
 ['risk','Rischi, condizioni e attenzione','Risk, conditions and attention','Riskji, kundizzjonijiet u attenzjoni'],
 ['observation','Osservazione e specchi','Observation and mirrors','Osservazzjoni u mirja'],
 ['junctions','Incroci e precedenza','Junctions and priority','Salib it-toroq u prijorità'],
 ['positioning','Posizionamento e corsia','Positioning and lane discipline','Pożizzjonament u korsija'],
 ['speed','Velocità e adattamento','Speed and adaptation','Veloċità u adattament'],
 ['control','Controllo del veicolo','Vehicle control','Kontroll tal-vettura'],
 ['manoeuvres','Manovre','Manoeuvres','Manuvri'],
 ['vulnerable','Utenti vulnerabili','Vulnerable road users','Utenti vulnerabbli']
];

const STATUS={
 verified:['✅','Verificata','Verified','Ivverifikata'],
 in_verification:['🟦','In verifica','In verification','Qed tiġi vverifikata'],
 consolidate:['🟡','Da consolidare','Needs consolidation','Trid tiġi kkonsolidata'],
 contradictory:['⚠️','Contraddittoria','Contradictory','Kontradittorja'],
 insufficient:['○','Evidenza insufficiente','Insufficient evidence','Evidenza insuffiċjenti']
};

function parse(v){try{return v?JSON.parse(v):null}catch(_){return null}}
function auth(){return parse(localStorage.getItem(AUTH))}
function uid(){return String(auth()?.user?.id||'').trim()}
function email(){const s=auth();return String(s?.user?.email||s?.email||'').trim().toLowerCase()}
function authenticated(){const s=auth();return !!(s&&s.status==='authenticated'&&s.accessToken&&s.user?.id&&(!(Number(s.expiresAt)>0)||Number(s.expiresAt)>Date.now()))}
function read(base){const id=uid();if(id){const x=parse(localStorage.getItem(base+'::user:'+id));if(x!==null)return x}return parse(localStorage.getItem(base))}
function key(){return STORE+(uid()?'::user:'+uid():'::signed-out')}
function lang(){return String(read('mdm-v1-settings')?.lang||'en')}
function t(it,en,mt){const l=lang();return l==='it'?it:l==='mt'?mt:en}
function esc(v){return String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
function home(){const h=String(location.hash||'').replace(/^#/,'');return !h||h==='home'}
function isOwner(){return email()===OWNER}
function now(){return new Date().toISOString()}
function packMeta(id){return PACKS.find(p=>p.id===id)||PACKS[4]}
function packName(id){const p=packMeta(id),l=lang();return p[l]||p.en}
function slug(v){return String(v||'').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'').slice(0,72)||'competence'}
function normalisePack(v){
 const s=String(v??'').trim().toUpperCase();
 if(!s)return '';
 if(/C\s*\/?\s*CE|C1E|GOODTRA|GOODS|TRUCK|CAMION/.test(s))return 'MT-C-CE';
 if(/LPTV|TAG/.test(s))return 'MT-LPTV';
 if(/MOTO|MOTOR|BIKE|^A$|MT-A/.test(s))return 'MT-A';
 if(/BUS|COACH|PASSENGER|^D$|MT-D/.test(s))return 'MT-D';
 if(/AUTO|CAR|^B$|MT-B/.test(s))return 'MT-B';
 return PACKS.some(p=>p.id===s)?s:'';
}
function collectStrings(obj,depth=0,out=[]){
 if(depth>3||obj==null)return out;
 if(typeof obj==='string'||typeof obj==='number'){out.push(String(obj));return out}
 if(Array.isArray(obj)){obj.slice(0,30).forEach(x=>collectStrings(x,depth+1,out));return out}
 if(typeof obj==='object')Object.entries(obj).slice(0,80).forEach(([k,v])=>{
  if(/licen[cs]e|licence|patente|pack|programme|program|category/i.test(k))collectStrings(v,depth+1,out);
 });
 return out;
}
function activePack(){
 const candidates=[];
 const onboarding=read('mdm-v1-onboarding')||{};
 collectStrings(onboarding,0,candidates);
 ['mdm-v1-settings','mdm-v1-profile','mdm-v1-user-profile'].forEach(k=>collectStrings(read(k),0,candidates));
 try{
  for(let i=0;i<localStorage.length;i++){
   const k=localStorage.key(i)||'';
   if(!/licen[cs]e|licence|patente|active.?pack|selected.?pack/i.test(k))continue;
   const raw=localStorage.getItem(k);
   const val=parse(raw);collectStrings(val===null?raw:val,0,candidates);
  }
 }catch(_){}
 try{
  document.querySelectorAll('[data-license],[data-licence],[data-license-id],[data-pack-id],[aria-pressed="true"].active').forEach(el=>{
   ['license','licence','licenseId','packId'].forEach(k=>{if(el.dataset?.[k])candidates.push(el.dataset[k])});
   candidates.push(el.textContent||'');
  });
 }catch(_){}
 for(const v of candidates){const id=normalisePack(v);if(id)return id}
 if(read('mdm-v1-lptv-passport'))return 'MT-LPTV';
 return 'MT-LPTV';
}
function freshState(){return {schema:'mdm-driver-competence-passport-v1',version:VERSION,packs:{},history:[],createdAt:now(),updatedAt:now()}}
function load(){
 try{
  const v=parse(localStorage.getItem(key()));
  return v&&v.schema==='mdm-driver-competence-passport-v1'?v:freshState();
 }catch(_){return freshState()}
}
function save(v){
 v.version=VERSION;v.updatedAt=now();
 try{localStorage.setItem(key(),JSON.stringify(v))}catch(_){}
 return v
}
function proof(){try{return window.MDM_PROOFLOOP_ENGINE?.evaluate?.()||null}catch(_){return null}}
function mission(){try{return window.MDM_PROOFLOOP_VERIFICATION?.current?.()||null}catch(_){return null}}
function examOutcome(){try{return window.MDM_PROOFLOOP_EXAM_OUTCOME?.current?.()||null}catch(_){return null}}
function licenceTaxonomy(packId){
 try{
  const p=window.LicensePacks?.get?.(packId);
  if(Array.isArray(p?.categoryTaxonomy)&&p.categoryTaxonomy.length){
   const l=lang();
   return p.categoryTaxonomy.map(x=>({id:String(x.id||slug(x[l]||x.en)),label:String(x[l]||x.en||x.it||x.mt||x.id)}));
  }
 }catch(_){}
 return CORE.map(x=>({id:x[0],label:lang()==='it'?x[1]:lang()==='mt'?x[3]:x[2]}));
}
function tokens(v){return new Set(String(v||'').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').split(/[^a-z0-9]+/).filter(x=>x.length>2))}
function similarity(a,b){
 const A=tokens(a),B=tokens(b);if(!A.size||!B.size)return 0;let n=0;A.forEach(x=>{if(B.has(x))n++});return n/Math.min(A.size,B.size);
}
function mapMissionStatus(m){
 if(!m)return 'insufficient';
 if(m.status==='evidence_conflict')return 'contradictory';
 if(m.status==='verified'&&m.requiresInstructorCheck===true&&m.instructorVerified===true)return 'verified';
 if(m.status==='revision_requested')return 'consolidate';
 if(m.status==='active'||m.status==='awaiting_instructor')return 'in_verification';
 return 'insufficient';
}
function ensurePack(state,id){
 if(!state||typeof state!=='object')state=freshState();
 if(!state.packs||typeof state.packs!=='object')state.packs={};
 if(!state.packs[id])state.packs[id]={id,competencies:{},events:[],createdAt:now(),updatedAt:now()};
 const pack=state.packs[id];
 if(!pack.competencies||typeof pack.competencies!=='object')pack.competencies={};
 if(!Array.isArray(pack.events))pack.events=[];
 return pack;
}
function appendEvent(pack,type,id,data){
 if(!pack)return;
 if(!Array.isArray(pack.events))pack.events=[];
 if(pack.events.some(e=>e&&e.type===type&&e.id===id))return;
 pack.events.unshift({type,id,at:now(),data:data||{}});
 pack.events=pack.events.slice(0,120);
}
function sync(){
 const state=load(),packId=activePack(),pack=ensurePack(state,packId);
 const p=proof(),m=mission(),out=examOutcome();
 const catalog=licenceTaxonomy(packId);
 catalog.forEach(a=>{
  if(!pack.competencies[a.id])pack.competencies[a.id]={id:a.id,label:a.label,status:'insufficient',firstSeenAt:now(),lastUpdatedAt:now(),source:'catalog'};
  else pack.competencies[a.id].label=a.label;
 });

 if(m?.target?.label){
  let best=null,bestScore=0;
  catalog.forEach(a=>{const sc=similarity(m.target.label,a.label);if(sc>bestScore){bestScore=sc;best=a}});
  const id=bestScore>=0.34?best.id:'mission-'+slug(m.target.label);
  const rec=pack.competencies[id]||{id,label:bestScore>=0.34?best.label:String(m.target.label),firstSeenAt:now()};
  const nextStatus=mapMissionStatus(m);
  if(rec.status&&rec.status!==nextStatus)appendEvent(pack,'competence-status',m.id+'-'+nextStatus,{competenceId:id,from:rec.status,to:nextStatus});
  rec.label=bestScore>=0.34?best.label:String(m.target.label);
  rec.status=nextStatus;
  rec.source='proofloop-verification';
  rec.missionId=String(m.id||'');
  rec.missionStatus=String(m.status||'');
  rec.lastUpdatedAt=now();
  rec.evidence={
   quality:String(p?.quality||''),
   independentSources:Number(p?.independentSources||0),
   sourceTotal:Number(p?.sourceTotal||5),
   contradictions:Number(p?.contradictions||0),
   retentionPresent:Boolean(p?.retentionPresent),
   roadDelta:Number(m.evidence?.roadDelta||0),
   telemetryDelta:Number(m.evidence?.telemetryDelta||0),
   requiresInstructorCheck:m.requiresInstructorCheck===true
  };
  pack.competencies[id]=rec;
  appendEvent(pack,'verification-mission',String(m.id||id),{competenceId:id,label:rec.label,status:rec.status});
 }

 if(out?.outcome?.result){
  const o=out.outcome;
  appendEvent(pack,'real-exam',String(o.recordedAt||o.date||o.result),{result:o.result,date:o.date,faults:Array.isArray(o.faults)?o.faults:[]});
  pack.lastExamOutcome={result:o.result,date:o.date,recordedAt:o.recordedAt||''};
 }

 pack.lastProofLoop=p?{quality:p.quality,sources:p.independentSources,total:p.sourceTotal,contradictions:p.contradictions,retentionPresent:p.retentionPresent,at:now()}:pack.lastProofLoop||null;
 pack.updatedAt=now();state.activePackId=packId;
 save(state);return state;
}
function statusMeta(code){const x=STATUS[code]||STATUS.insufficient;return {icon:x[0],label:t(x[1],x[2],x[3])}}
function counts(pack){
 const rows=Object.values(pack?.competencies||{});
 const out={verified:0,in_verification:0,consolidate:0,contradictory:0,insufficient:0};
 rows.forEach(r=>{if(out[r.status]!==undefined)out[r.status]++});return out;
}
function summaryText(state,packId){
 const pack=state.packs[packId]||{competencies:{},events:[]},c=counts(pack);
 return [
  'MDM DRIVER COMPETENCE PASSPORT',
  'Build '+VERSION,
  packName(packId),
  '',
  t('Competenze verificate','Verified competencies','Ħiliet ivverifikati')+': '+c.verified,
  t('In verifica','In verification','Qed jiġu vverifikati')+': '+c.in_verification,
  t('Contraddittorie','Contradictory','Kontradittorji')+': '+c.contradictory,
  t('Evidenza insufficiente','Insufficient evidence','Evidenza insuffiċjenti')+': '+c.insufficient,
  '',
  ...Object.values(pack.competencies||{}).map(r=>statusMeta(r.status).label+' · '+r.label),
  '',
  t('Nota','Note','Nota')+': '+t('Le evidenze possono accompagnare il conducente tra licenze; lo stato VERIFICATA non viene trasferito automaticamente.','Evidence can follow the driver across licences; VERIFIED status is never transferred automatically.','L-evidenza tista’ ssegwi lis-sewwieq bejn il-liċenzji; l-istatus IVVERIFIKATA qatt ma jiġi trasferit awtomatikament.')
 ].join('\n');
}
async function copyPassport(){
 const state=sync(),id=viewPack||state.activePackId;
 const text=summaryText(state,id);
 try{await navigator.clipboard.writeText(text)}catch(_){
  const ta=document.createElement('textarea');ta.value=text;ta.style.position='fixed';ta.style.opacity='0';document.body.appendChild(ta);ta.select();document.execCommand('copy');ta.remove();
 }
}
function render(){
 const old=document.getElementById('mdmDriverCompetencePassport');
 if(!authenticated()||isOwner()||!home()){old?.remove();return}
 const p=proof();if(!p||['school','owner','admin'].includes(String(p.role||''))){old?.remove();return}
 const anchor=document.getElementById('mdmExamOutcomeCard')||document.getElementById('mdmProofLoopCard');
 if(!anchor)return;
 let card=old;
 if(!card){
  card=document.createElement('section');
  card.id='mdmDriverCompetencePassport';
  card.className='mdm-competence-passport';
  card.innerHTML='<div class="mdm-passport-head"><div><small>MDM PROOFLOOP · '+VERSION+'</small><h2>🪪 Driver Competence Passport</h2><p>'+esc(t('Preparazione del registro competenze…','Preparing competence record…','Qed jitħejja r-reġistru tal-kompetenzi…'))+'</p></div><span>🛡️</span></div>';
  anchor.insertAdjacentElement('afterend',card);
 }
 let state;
 try{state=sync()}catch(_){
  state=load();
  const fallback=activePack();
  state.activePackId=state.activePackId||fallback;
  ensurePack(state,state.activePackId);
 }
 if(!viewPack)viewPack=state.activePackId||activePack();
 if(!PACKS.some(x=>x.id===viewPack))viewPack=state.activePackId||activePack();
 const pack=ensurePack(state,viewPack),active=viewPack===state.activePackId,c=counts(pack);
 const tabs=PACKS.map(x=>'<button type="button" data-mdm-passport-pack="'+x.id+'" class="'+(x.id===viewPack?'active':'')+'">'+esc(x.code)+(x.id===state.activePackId?' · '+esc(t('attiva','active','attiva')):'')+'</button>').join('');
 const rows=Object.values(pack.competencies||{}).sort((a,b)=>{
  const order={verified:0,in_verification:1,contradictory:2,consolidate:3,insufficient:4};
  return (order[a.status]??9)-(order[b.status]??9)||a.label.localeCompare(b.label);
 }).map(r=>{
  const sm=statusMeta(r.status),ev=r.evidence||{};
  const detail=r.source==='proofloop-verification'
   ?'<small>'+esc(t('ProofLoop','ProofLoop','ProofLoop'))+' · '+Number(ev.independentSources||0)+'/'+Number(ev.sourceTotal||5)+' '+esc(t('fonti','sources','sorsi'))+(ev.requiresInstructorCheck?' · '+esc(t('verifica istruttore richiesta','instructor verification required','verifika tal-istruttur meħtieġa')):'')+'</small>'
   :'<small>'+esc(t('Nessuna prova specifica ancora registrata','No specific evidence recorded yet','Għadha ma ġiet irreġistrata ebda evidenza speċifika'))+'</small>';
  return '<div class="mdm-competence-row '+esc(r.status)+'"><div class="mdm-competence-status">'+sm.icon+'</div><div><strong>'+esc(r.label)+'</strong>'+detail+'</div><span>'+esc(sm.label)+'</span></div>';
 }).join('');
 const exam=pack.lastExamOutcome?'<div class="mdm-passport-exam">🏁 <strong>'+esc(String(pack.lastExamOutcome.result||'').toUpperCase())+'</strong><span>'+esc(pack.lastExamOutcome.date||'')+'</span></div>':'';
 card.innerHTML=
  '<div class="mdm-passport-head"><div><small>MDM PROOFLOOP · '+VERSION+'</small><h2>🪪 '+esc(t('Driver Competence Passport','Driver Competence Passport','Passaport tal-Kompetenzi tas-Sewwieq'))+'</h2><p>'+esc(t('Registro permanente, per licenza, delle competenze realmente dimostrate.','A permanent, licence-aware record of demonstrated driving competence.','Reġistru permanenti, skont il-liċenzja, tal-ħiliet tas-sewqan li ġew murija.'))+'</p></div><span>🛡️</span></div>'+
  '<div class="mdm-passport-tabs">'+tabs+'</div>'+
  '<div class="mdm-passport-pack-title"><div><span>'+esc(active?t('Licenza attiva','Active licence','Liċenzja attiva'):t('Storico licenza','Licence history','Storja tal-liċenzja'))+'</span><strong>'+esc(packName(viewPack))+'</strong></div>'+exam+'</div>'+
  '<div class="mdm-passport-summary"><div><span>'+esc(t('Verificate','Verified','Ivverifikati'))+'</span><strong>'+c.verified+'</strong></div><div><span>'+esc(t('In verifica','In verification','Qed jiġu vverifikati'))+'</span><strong>'+c.in_verification+'</strong></div><div><span>'+esc(t('Contraddizioni','Contradictions','Kontradizzjonijiet'))+'</span><strong>'+c.contradictory+'</strong></div><div><span>'+esc(t('Da provare','Need evidence','Jeħtieġu evidenza'))+'</span><strong>'+c.insufficient+'</strong></div></div>'+
  '<div class="mdm-passport-map"><div class="mdm-passport-map-title"><strong>'+esc(t('Mappa competenze','Competence map','Mappa tal-kompetenzi'))+'</strong><span>'+esc(t('Nessun punteggio magico','No magic score','L-ebda punteġġ maġiku'))+'</span></div>'+rows+'</div>'+
  '<div class="mdm-passport-rule">🔒 '+esc(t('Regola: una competenza diventa VERIFICATA solo con prova specifica e verifica richiesta. Le evidenze possono seguire il conducente tra licenze, ma la verifica non viene mai trasferita automaticamente.','Rule: a skill becomes VERIFIED only with specific evidence and the required verification. Evidence may follow the driver across licences, but verification is never transferred automatically.','Regola: ħila ssir IVVERIFIKATA biss b’evidenza speċifika u l-verifika meħtieġa. L-evidenza tista’ ssegwi lis-sewwieq bejn il-liċenzji, iżda l-verifika qatt ma tiġi trasferita awtomatikament.'))+'</div>'+
  '<button id="mdmPassportCopy" type="button">'+esc(t('Copia Passport','Copy Passport','Ikkopja l-Passaport'))+'</button>';
 card.querySelectorAll('[data-mdm-passport-pack]').forEach(b=>b.onclick=()=>{viewPack=b.dataset.mdmPassportPack;render()});
 card.querySelector('#mdmPassportCopy')?.addEventListener('click',copyPassport);
}
function schedule(){if(raf)return;raf=requestAnimationFrame(()=>{raf=0;render()})}
render();
const screen=document.getElementById('screen');if(screen){const o=new MutationObserver(schedule);o.observe(screen,{childList:true,subtree:true});window.__MDM_COMPETENCE_PASSPORT_OBSERVER__=o}
window.addEventListener('pageshow',schedule);window.addEventListener('popstate',schedule);window.addEventListener('storage',schedule);document.addEventListener('visibilitychange',()=>{if(!document.hidden)schedule()});
window.MDM_DRIVER_COMPETENCE_PASSPORT=Object.freeze({version:VERSION,sync,current:load,activePack,render});
})();