/* Malta Driving Master 45.8.34 — Real Exam Outcome Calibration */
(function(){
'use strict';
if(window.MDM_PROOFLOOP_EXAM_OUTCOME)return;

const VERSION='45.8.34';
const AUTH_KEY='mdm_auth_session_v4410';
const OWNER='maltadrivingmaster@gmail.com';
const STORE='mdm-proofloop-exam-outcome-v1';
let raf=0;

function parse(v){try{return v?JSON.parse(v):null}catch(_){return null}}
function auth(){return parse(localStorage.getItem(AUTH_KEY))}
function uid(){return String(auth()?.user?.id||'').trim()}
function email(){const s=auth();return String(s?.user?.email||s?.email||'').trim().toLowerCase()}
function authenticated(){const s=auth();return !!(s&&s.status==='authenticated'&&s.accessToken&&s.user?.id&&(!(Number(s.expiresAt)>0)||Number(s.expiresAt)>Date.now()))}
function lang(){return String(read('mdm-v1-settings')?.lang||'en')}
function t(it,en,mt){const l=lang();return l==='it'?it:l==='mt'?mt:en}
function esc(v){return String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
function read(base){
 const id=uid();
 if(id){const scoped=parse(localStorage.getItem(base+'::user:'+id));if(scoped!==null)return scoped}
 return parse(localStorage.getItem(base));
}
function key(){return STORE+(uid()?'::user:'+uid():'::signed-out')}
function load(){return parse(localStorage.getItem(key()))||{schema:'mdm-proofloop-exam-outcome-v1',version:VERSION,snapshot:null,outcome:null}}
function save(v){v.schema='mdm-proofloop-exam-outcome-v1';v.version=VERSION;localStorage.setItem(key(),JSON.stringify(v));return v}
function home(){const h=String(location.hash||'').replace(/^#/,'');return !h||h==='home'}
function isOwner(){return email()===OWNER}
function proof(){try{return window.MDM_PROOFLOOP_ENGINE?.evaluate?.()||null}catch(_){return null}}
function checklistStats(v){
 const c=v&&typeof v.checklist==='object'&&v.checklist?v.checklist:{};
 const keys=Object.keys(c);const total=keys.length;const done=keys.filter(k=>c[k]===true).length;
 return {done,total,pct:total?Math.round(done/total*100):null};
}
function latestSimulation(){
 const day=read('mdm-v1-exam-day')||{};
 if(day.finalSimulationDone&&Number.isFinite(Number(day.finalSimulationScore)))return Number(day.finalSimulationScore);
 const p=read('mdm-v1-progress')||{};
 const exams=Array.isArray(p.exams)?p.exams:[];
 const last=exams.length?exams[exams.length-1]:null;
 return last&&Number.isFinite(Number(last.score))?Number(last.score):null;
}
function currentSnapshot(){
 const p=proof();if(!p)return null;
 const day=read('mdm-v1-exam-day')||{};
 return {
  capturedAt:new Date().toISOString(),
  proofLoop:{
   state:String(p.state||''),
   quality:String(p.quality||''),
   independentSources:Number(p.independentSources||0),
   sourceTotal:Number(p.sourceTotal||5),
   contradictions:Number(p.contradictions||0),
   retentionPresent:Boolean(p.retentionPresent),
   nextNeed:String(p.nextNeed||''),
   sources:Object.fromEntries(Object.entries(p.sources||{}).map(([k,v])=>[k,{present:Boolean(v?.present)}]))
  },
  examDay:{
   targetDate:String(day.targetDate||''),
   finalSimulationScore:latestSimulation(),
   checklist:checklistStats(day)
  }
 };
}
function freeze(){
 const p=proof();if(!authenticated()||!p)return null;
 const st=load();
 st.snapshot=currentSnapshot();
 st.outcome=null;
 save(st);
 return st.snapshot;
}
function predictionLabel(snapshot){
 const p=snapshot?.proofLoop||{};
 if(p.quality==='high'&&Number(p.independentSources)>=4&&Number(p.contradictions)===0){
  return t('Evidenza forte','Strong evidence','Evidenza qawwija');
 }
 if(Number(p.contradictions)>0||p.quality==='low'||Number(p.independentSources)<3){
  return t('Evidenza con riserve','Evidence with reservations','Evidenza b’riżervi');
 }
 return t('Evidenza intermedia','Intermediate evidence','Evidenza intermedja');
}
function calibration(snapshot,outcome){
 if(!snapshot||!outcome)return {code:'insufficient'};
 const p=snapshot.proofLoop||{};
 const strong=p.quality==='high'&&Number(p.independentSources)>=4&&Number(p.contradictions)===0;
 const cautious=Number(p.contradictions)>0||p.quality==='low'||Number(p.independentSources)<3;
 if(outcome.result==='pass'){
  if(strong)return {code:'aligned_positive'};
  if(cautious)return {code:'surprise_positive'};
  return {code:'informative'};
 }
 if(outcome.result==='fail'){
  if(cautious)return {code:'aligned_negative'};
  if(strong)return {code:'surprise_negative'};
  return {code:'informative'};
 }
 return {code:'insufficient'};
}
function calibrationCopy(code){
 const map={
  aligned_positive:[
   t('Esito coerente','Outcome aligned','Riżultat konsistenti'),
   t('Le evidenze pre-esame erano forti e l’esito reale è PASS. Questo singolo caso supporta la direzione del modello, ma non misura da solo la sua accuratezza.','Pre-exam evidence was strong and the real outcome was PASS. This single case supports the model direction, but it does not measure accuracy on its own.','L-evidenza qabel l-eżami kienet qawwija u r-riżultat reali kien PASS. Dan il-każ wieħed jappoġġja d-direzzjoni tal-mudell, iżda ma jkejjelx l-eżattezza waħdu.')
  ],
  aligned_negative:[
   t('Esito coerente con le riserve','Outcome aligned with reservations','Riżultat konsistenti mar-riżervi'),
   t('Prima dell’esame MDM vedeva evidenza debole o contraddittoria e l’esito reale è FAIL. Il caso è utile per la futura calibrazione.','Before the exam MDM saw weak or contradictory evidence and the real outcome was FAIL. This case is useful for future calibration.','Qabel l-eżami MDM ra evidenza dgħajfa jew kontradittorja u r-riżultat reali kien FAIL. Il-każ huwa utli għall-kalibrazzjoni futura.')
  ],
  surprise_negative:[
   t('Sorpresa da analizzare','Calibration miss to analyse','Sorpriża li trid tiġi analizzata'),
   t('MDM aveva evidenza forte, ma l’esito reale è FAIL. Questo è precisamente il tipo di caso che deve migliorare il modello: non viene nascosto né reinterpretato.','MDM had strong evidence, but the real outcome was FAIL. This is exactly the kind of case that should improve the model: it is not hidden or reinterpreted.','MDM kellu evidenza qawwija, iżda r-riżultat reali kien FAIL. Dan hu eżatt it-tip ta’ każ li għandu jtejjeb il-mudell: ma jinħebiex u ma jiġix reinterpretat.')
  ],
  surprise_positive:[
   t('Esito migliore del previsto','Outcome better than evidence suggested','Riżultat aħjar milli indikat mill-evidenza'),
   t('MDM aveva riserve, ma l’esito reale è PASS. Anche questo caso deve entrare nella futura calibrazione per evitare previsioni troppo prudenti.','MDM had reservations, but the real outcome was PASS. This case should also inform future calibration to avoid predictions that are too cautious.','MDM kellu riżervi, iżda r-riżultat reali kien PASS. Dan il-każ għandu jgħin ukoll il-kalibrazzjoni futura biex jiġu evitati tbassir prudenti żżejjed.')
  ],
  informative:[
   t('Caso informativo','Informative case','Każ informattiv'),
   t('Il risultato reale è stato registrato. La previsione pre-esame non era abbastanza netta per dichiarare coerenza o errore.','The real result was recorded. The pre-exam evidence was not strong enough to classify this as aligned or a miss.','Ir-riżultat reali ġie rreġistrat. L-evidenza qabel l-eżami ma kinitx ċara biżżejjed biex dan jitqies konsistenti jew żball.')
  ],
  insufficient:[
   t('Dati insufficienti','Insufficient data','Data insuffiċjenti'),
   t('Serve uno snapshot pre-esame e un risultato reale per fare il confronto.','A pre-exam snapshot and a real result are required for comparison.','Hemm bżonn snapshot qabel l-eżami u riżultat reali biex isir il-paragun.')
  ]
 };
 return map[code]||map.insufficient;
}
function recordOutcome(){
 const st=load();if(!st.snapshot)return false;
 const result=String(document.getElementById('mdmRealExamResult')?.value||'');
 const date=String(document.getElementById('mdmRealExamDate')?.value||'');
 if(!['pass','fail'].includes(result)||!date)return false;
 const faults=Array.from(document.querySelectorAll('[data-mdm-real-fault]:checked')).map(x=>String(x.value||'')).filter(Boolean);
 const note=String(document.getElementById('mdmRealExamNote')?.value||'').trim().slice(0,600);
 const official=Boolean(document.getElementById('mdmRealExamOfficial')?.checked);
 st.outcome={
  result,date,faults,note,officialReportAvailable:official,
  recordedAt:new Date().toISOString(),
  calibration:calibration(st.snapshot,{result})
 };
 save(st);return true;
}
function reset(){
 const st=load();st.snapshot=null;st.outcome=null;save(st);
}
function faultOptions(){
 return [
  ['observation',t('Osservazione / specchi','Observation / mirrors','Osservazzjoni / mirja')],
  ['junctions',t('Incroci / precedenza','Junctions / priority','Salib it-toroq / prijorità')],
  ['positioning',t('Posizionamento / corsia','Positioning / lane','Pożizzjonament / korsija')],
  ['speed',t('Velocità / adattamento','Speed / adaptation','Veloċità / adattament')],
  ['control',t('Controllo veicolo','Vehicle control','Kontroll tal-vettura')],
  ['manoeuvres',t('Manovre','Manoeuvres','Manuvri')],
  ['signals',t('Segnalazioni','Signals','Sinjali')],
  ['other',t('Altro','Other','Ieħor')]
 ];
}
function fmtDate(s){if(!s)return '—';try{return new Date(s).toLocaleDateString()}catch(_){return s}}
function briefText(st){
 const snap=st.snapshot||{},out=st.outcome||{},cal=calibrationCopy(out.calibration?.code||'insufficient');
 return [
  'MDM PROOFLOOP · REAL EXAM OUTCOME',
  'Build '+VERSION,
  '',
  t('Snapshot pre-esame','Pre-exam snapshot','Snapshot qabel l-eżami')+': '+fmtDate(snap.capturedAt),
  t('Qualità evidenze','Evidence quality','Kwalità tal-evidenza')+': '+String(snap.proofLoop?.quality||'—'),
  t('Fonti','Sources','Sorsi')+': '+Number(snap.proofLoop?.independentSources||0)+'/'+Number(snap.proofLoop?.sourceTotal||5),
  t('Contraddizioni','Contradictions','Kontradizzjonijiet')+': '+Number(snap.proofLoop?.contradictions||0),
  t('Simulazione finale','Final simulation','Simulazzjoni finali')+': '+(snap.examDay?.finalSimulationScore??'—'),
  '',
  t('Esito reale','Real outcome','Riżultat reali')+': '+String(out.result||'—').toUpperCase(),
  t('Data','Date','Data')+': '+String(out.date||'—'),
  t('Aree report','Report areas','Oqsma tar-rapport')+': '+(Array.isArray(out.faults)&&out.faults.length?out.faults.join(', '):'—'),
  '',
  cal[0],
  cal[1]
 ].join('\n');
}
async function copyReport(){
 const text=briefText(load());if(!text)return;
 try{await navigator.clipboard.writeText(text)}catch(_){
  const ta=document.createElement('textarea');ta.value=text;ta.style.position='fixed';ta.style.opacity='0';document.body.appendChild(ta);ta.select();document.execCommand('copy');ta.remove();
 }
}
function html(){
 const st=load(),snap=st.snapshot,out=st.outcome;
 if(!snap){
  return '<div class="mdm-exam-outcome-intro"><div><small>REAL EXAM OUTCOME</small><h3>'+esc(t('Calibra MDM con la realtà','Calibrate MDM against reality','Ikkalibra MDM mar-realtà'))+'</h3><p>'+esc(t('Prima dell’esame pratico reale, congela lo stato delle evidenze. Dopo l’esame registra PASS/FAIL e confrontiamo previsione e risultato senza riscrivere il passato.','Before the real practical test, freeze the evidence state. After the test record PASS/FAIL and compare prediction with reality without rewriting the past.','Qabel it-test prattiku reali, iffriża l-istat tal-evidenza. Wara t-test irreġistra PASS/FAIL u qabbel it-tbassir mar-realtà mingħajr ma tbiddel il-passat.'))+'</p></div><button id="mdmExamFreeze" type="button">'+esc(t('Congela snapshot pre-esame','Freeze pre-exam snapshot','Iffriża snapshot qabel l-eżami'))+'</button></div>';
 }
 const sim=snap.examDay?.finalSimulationScore;
 const top='<div class="mdm-exam-snapshot"><div><span>'+esc(t('Pre-esame','Pre-exam','Qabel l-eżami'))+'</span><strong>'+esc(predictionLabel(snap))+'</strong></div><div><span>'+esc(t('Fonti','Sources','Sorsi'))+'</span><strong>'+Number(snap.proofLoop?.independentSources||0)+'/'+Number(snap.proofLoop?.sourceTotal||5)+'</strong></div><div><span>'+esc(t('Contraddizioni','Contradictions','Kontradizzjonijiet'))+'</span><strong>'+Number(snap.proofLoop?.contradictions||0)+'</strong></div><div><span>'+esc(t('Simulazione','Simulation','Simulazzjoni'))+'</span><strong>'+(sim==null?'—':esc(sim+'/35'))+'</strong></div></div>';
 if(!out){
  const faults=faultOptions().map(([v,l])=>'<label><input type="checkbox" data-mdm-real-fault value="'+esc(v)+'"><span>'+esc(l)+'</span></label>').join('');
  return top+'<div class="mdm-exam-outcome-form"><div class="mdm-exam-outcome-head"><div><small>ACTUAL RESULT</small><h3>'+esc(t('Registra l’esito dell’esame pratico reale','Record the real practical-test outcome','Irreġistra r-riżultat tat-test prattiku reali'))+'</h3></div><span>🏁</span></div><div class="mdm-exam-form-grid"><label><span>'+esc(t('Esito','Outcome','Riżultat'))+'</span><select id="mdmRealExamResult"><option value="">—</option><option value="pass">PASS</option><option value="fail">FAIL</option></select></label><label><span>'+esc(t('Data esame','Exam date','Data tat-test'))+'</span><input id="mdmRealExamDate" type="date"></label></div><div class="mdm-exam-faults"><strong>'+esc(t('Aree indicate nel report/debrief (facoltative)','Areas mentioned in the report/debrief (optional)','Oqsma msemmija fir-rapport/debrief (fakultattivi)'))+'</strong>'+faults+'</div><label class="mdm-exam-official"><input id="mdmRealExamOfficial" type="checkbox"><span>'+esc(t('Ho un report/debrief ufficiale','I have an official report/debrief','Għandi rapport/debrief uffiċjali'))+'</span></label><label class="mdm-exam-note"><span>'+esc(t('Nota facoltativa','Optional note','Nota fakultattiva'))+'</span><textarea id="mdmRealExamNote" maxlength="600"></textarea></label><button id="mdmExamSaveOutcome" type="button">'+esc(t('Salva esito reale','Save real outcome','Issejvja r-riżultat reali'))+'</button><p class="mdm-exam-privacy">'+esc(t('Nessun risultato viene dichiarato “ufficiale” da MDM: stai registrando ciò che è avvenuto nel test reale.','MDM does not declare any result “official”: you are recording what happened in the real test.','MDM ma jiddikjara l-ebda riżultat “uffiċjali”: qed tirreġistra dak li ġara fit-test reali.'))+'</p></div>';
 }
 const cal=calibrationCopy(out.calibration?.code||'insufficient');
 return top+'<div class="mdm-exam-calibration '+esc(out.calibration?.code||'insufficient')+'"><div class="mdm-exam-result"><span>'+esc(t('Esito reale','Real outcome','Riżultat reali'))+'</span><strong>'+esc(String(out.result||'').toUpperCase())+'</strong><small>'+esc(out.date||'')+'</small></div><div class="mdm-exam-calibration-copy"><strong>'+esc(cal[0])+'</strong><p>'+esc(cal[1])+'</p></div><div class="mdm-exam-calibration-actions"><button id="mdmExamCopyReport" type="button">'+esc(t('Copia confronto','Copy comparison','Ikkopja l-paragun'))+'</button><button id="mdmExamNewCycle" class="secondary" type="button">'+esc(t('Nuovo ciclo esame','New exam cycle','Ċiklu ġdid tat-test'))+'</button></div><p class="mdm-exam-privacy">'+esc(t('Un singolo esito non cambia automaticamente il modello e non viene usato come percentuale di accuratezza.','A single outcome does not automatically change the model and is not used as an accuracy percentage.','Riżultat wieħed ma jbiddilx awtomatikament il-mudell u ma jintużax bħala perċentwal ta’ eżattezza.'))+'</p></div>';
}
function render(){
 const old=document.getElementById('mdmExamOutcomeCard');
 if(!authenticated()||isOwner()||!home()){old?.remove();return}
 const p=proof();if(!p||['school','owner','admin'].includes(String(p.role||''))){old?.remove();return}
 const proofCard=document.getElementById('mdmProofLoopCard');if(!proofCard)return;
 let card=old;
 if(!card){card=document.createElement('section');card.id='mdmExamOutcomeCard';card.className='mdm-exam-outcome-card';proofCard.insertAdjacentElement('afterend',card)}
 card.innerHTML='<div class="mdm-exam-outcome-title"><div><small>MDM PROOFLOOP · 45.8.34</small><h2>🏁 '+esc(t('Real Exam Outcome','Real Exam Outcome','Riżultat Reali tat-Test'))+'</h2></div><span>↔</span></div>'+html();
 bind();
}
function bind(){
 const freezeBtn=document.getElementById('mdmExamFreeze');if(freezeBtn)freezeBtn.onclick=()=>{freeze();render()};
 const saveBtn=document.getElementById('mdmExamSaveOutcome');if(saveBtn)saveBtn.onclick=()=>{if(recordOutcome())render()};
 const copyBtn=document.getElementById('mdmExamCopyReport');if(copyBtn)copyBtn.onclick=copyReport;
 const newBtn=document.getElementById('mdmExamNewCycle');if(newBtn)newBtn.onclick=()=>{if(confirm(t('Aprire un nuovo ciclo cancella solo questo snapshot e questo esito locale. Continuare?','Starting a new cycle clears only this local snapshot and outcome. Continue?','Ċiklu ġdid iħassar biss dan is-snapshot u r-riżultat lokali. Tkompli?'))){reset();render()}};
}
function schedule(){if(raf)return;raf=requestAnimationFrame(()=>{raf=0;render()})}
render();
const screen=document.getElementById('screen');if(screen){const o=new MutationObserver(schedule);o.observe(screen,{childList:true,subtree:true});window.__MDM_EXAM_OUTCOME_OBSERVER__=o}
window.addEventListener('pageshow',schedule);window.addEventListener('popstate',schedule);window.addEventListener('storage',schedule);document.addEventListener('visibilitychange',()=>{if(!document.hidden)schedule()});
window.MDM_PROOFLOOP_EXAM_OUTCOME=Object.freeze({version:VERSION,current:load,freeze,currentSnapshot,calibration,render});
})();