/* Malta Driving Master 45.8.33 — ProofLoop Verification Missions */
(function(){
'use strict';
if(window.MDM_PROOFLOOP_VERIFICATION)return;

const VERSION='45.8.33.3';
const AUTH_KEY='mdm_auth_session_v4410';
const BASE_KEY='mdm-proofloop-verification-v1';

function parse(v){try{return v?JSON.parse(v):null}catch(_){return null}}
function auth(){return parse(localStorage.getItem(AUTH_KEY))}
function uid(){return String(auth()?.user?.id||'').trim()}
function lang(){return String(parse(localStorage.getItem('mdm-v1-settings'))?.lang||'en')}
function t(it,en,mt){const l=lang();return l==='it'?it:l==='mt'?mt:en}
function esc(v){return String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
function key(){const id=uid();return BASE_KEY+(id?'::user:'+id:'::signed-out')}
function read(base){const id=uid();if(id){const scoped=parse(localStorage.getItem(base+'::user:'+id));if(scoped!==null)return scoped}return parse(localStorage.getItem(base))}
function load(){return parse(localStorage.getItem(key()))}
function save(v){localStorage.setItem(key(),JSON.stringify(v));return v}
function now(){return new Date().toISOString()}
function shortId(){return 'PLV-'+Date.now().toString(36).slice(-7).toUpperCase()+'-'+Math.random().toString(36).slice(2,5).toUpperCase()}

const GENERIC=new Set(['high','medium','low','ready','stable','verified','completed','open','active','pending','true','false','student','school','instructor','theory','practice','road','replay','telemetry','risk','status','score','priority','accuracy','confidence','severity','level','category','pattern','weakness','focus','critical','warning','pass','fail']);
function candidates(value,baseWeight){
 const out=[],seen=new WeakSet();
 function walk(node,depth,path){
  if(depth>6||node==null)return;
  if(typeof node==='object'){if(seen.has(node))return;seen.add(node)}
  if(Array.isArray(node)){node.slice(0,120).forEach((x,i)=>walk(x,depth+1,path+'['+i+']'));return}
  if(typeof node==='object'){
   Object.keys(node).slice(0,220).forEach(k=>{
    const child=node[k],low=String(k).toLowerCase();
    if(typeof child==='string'&&/(title|label|name|topic|category|pattern|priority|weakness|skill|competence|area|focus)/i.test(low)){
      const s=child.trim();
      if(validTargetLabel(s)){
        let bonus=0;
        if(/weakness|skill|competence|focus|pattern/i.test(low))bonus=35;
        else if(/priority|topic|category/i.test(low))bonus=25;
        else bonus=10;
        out.push({label:s,score:baseWeight+bonus-depth});
      }
    }
    walk(child,depth+1,path+'.'+k);
   });
  }
 }
 walk(value,0,'');
 return out;
}
function validTargetLabel(value){
 const s=String(value||'').trim();
 const low=s.toLowerCase();
 if(s.length<3||s.length>90)return false;
 if(GENERIC.has(low))return false;
 if(/@|https?:|^[A-Z0-9_-]{12,}$/i.test(s))return false;
 if(/^(risk|status|score|priority|accuracy|confidence|severity|level|category|pattern|weakness|focus)\s*[:=-]?\s*/i.test(s))return false;
 return true;
}
function fallbackTarget(result){
 const fallback={
  resolve_contradiction:t('Contraddizione teoria ↔ pratica','Theory ↔ practice contradiction','Kontradizzjoni teorija ↔ prattika'),
  road:t('Competenza da dimostrare nella guida reale','Skill to prove on the real road','Ħila li trid tintwera fis-sewqan reali'),
  instructor:t('Competenza da confermare con l’istruttore','Skill to confirm with the instructor','Ħila li trid tiġi kkonfermata mal-istruttur'),
  retention:t('Stabilità della competenza','Skill stability','Stabbiltà tal-ħila'),
  telemetry:t('Controllo della competenza in guida reale','Real-road skill check','Kontroll tal-ħila fis-sewqan reali'),
  theory:t('Competenza teorica prioritaria','Priority theory skill','Ħila teorika prijoritarja'),
  verification:t('Competenza pratica prioritaria','Priority practical skill','Ħila prattika prijoritarja')
 };
 const code=String(result?.nextNeed||result?.reason||'verification');
 return {label:fallback[code]||fallback.verification,source:'proofloop-safe-fallback'};
}
function migrateStoredMissions(){
 try{
  for(let i=0;i<localStorage.length;i++){
   const k=localStorage.key(i);
   if(!k||!k.startsWith(BASE_KEY))continue;
   const mission=parse(localStorage.getItem(k));
   if(!mission||validTargetLabel(mission.target?.label))continue;
   const repaired=fallbackTarget({nextNeed:mission.reason});
   mission.target=repaired;
   mission.title=t('Missione di verifica','Verification Mission','Missjoni ta’ verifika')+' · '+repaired.label;
   mission.criteria=criteriaFor(repaired.label);
   mission.version=VERSION;
   mission.repairedTargetAt=now();
   localStorage.setItem(k,JSON.stringify(mission));
  }
 }catch(_){}
}
function targetFor(result){
 const sources=[
  ['mdm-v1-real-road-selected-pattern',120],
  ['mdm-v1-real-road-twin',100],
  ['mdm-v1-lptv-passport',80],
  ['mdm-v1-coach-recovery',70],
  ['mdm-v1-ai-instructor',60]
 ];
 const all=[];
 for(const [k,w] of sources)all.push(...candidates(read(k),w));
 all.sort((a,b)=>b.score-a.score);
 if(all[0])return {label:all[0].label,source:'existing-evidence'};
 return fallbackTarget(result);
}
function criteriaFor(target){
 return [
  t('Esegui la competenza in una situazione reale senza usare il telefono durante la guida.','Perform the skill in a real situation without using the phone while driving.','Wettaq il-ħila f’sitwazzjoni reali mingħajr ma tuża t-telefon waqt is-sewqan.'),
  t('MDM deve registrare almeno una nuova evidenza strada o una nuova sessione telemetria dopo l’avvio della missione.','MDM must record at least one new road-evidence item or telemetry session after the mission starts.','MDM irid jirreġistra mill-inqas evidenza ġdida fit-triq jew sessjoni ġdida ta’ telemetrija wara li tibda l-missjoni.'),
  t('La chiusura richiede una verifica dell’istruttore: lo studente non può auto-certificare la competenza.','Closure requires instructor verification: the learner cannot self-certify the skill.','L-għeluq jeħtieġ verifika tal-istruttur: l-istudent ma jistax jiċċertifika l-ħila tiegħu stess.')
 ];
}
function create(result){
 if(!result||!result.authenticated)return null;
 const target=targetFor(result);
 const mission={
  schema:'mdm-proofloop-verification-v1',
  version:VERSION,
  id:shortId(),
  title:t('Missione di verifica','Verification Mission','Missjoni ta’ verifika')+' · '+target.label,
  target,
  reason:String(result.nextNeed||'verification'),
  criteria:criteriaFor(target.label),
  requiresInstructorCheck:true,
  status:'active',
  createdAt:now(),
  baseline:{
   roadRecords:Number(result.sources?.road?.records||0),
   telemetrySessions:Number(result.sources?.telemetry?.sessions||0),
   contradictions:Number(result.contradictions||0),
   independentSources:Number(result.independentSources||0)
  },
  evidence:{
   roadDelta:0,
   telemetryDelta:0,
   detectedAt:''
  }
 };
 save(mission);
 return mission;
}
function refresh(result){
 const mission=load();
 if(!mission||!result)return mission;
 if(!validTargetLabel(mission.target?.label)){
  const repaired=fallbackTarget(result);
  mission.target=repaired;
  mission.title=t('Missione di verifica','Verification Mission','Missjoni ta’ verifika')+' · '+repaired.label;
  mission.criteria=criteriaFor(repaired.label);
  mission.repairedTargetAt=now();
 }
 const roadNow=Number(result.sources?.road?.records||0);
 const telemetryNow=Number(result.sources?.telemetry?.sessions||0);
 const roadDelta=Math.max(0,roadNow-Number(mission.baseline?.roadRecords||0));
 const telemetryDelta=Math.max(0,telemetryNow-Number(mission.baseline?.telemetrySessions||0));
 const contradictions=Math.max(0,Number(result.contradictions||0));

 mission.evidence=mission.evidence||{};
 mission.evidence.roadDelta=roadDelta;
 mission.evidence.telemetryDelta=telemetryDelta;

 if(contradictions>0){
  mission.status='evidence_conflict';
 }else if(roadDelta>0||telemetryDelta>0){
  mission.status='awaiting_instructor';
  if(!mission.evidence.detectedAt)mission.evidence.detectedAt=now();
 }else{
  mission.status='active';
 }
 save(mission);
 return mission;
}
function assignmentPayload(mission){
 const m=mission||load();if(!m)return null;
 return {
  schema:'mdm-instructor-assignment-v1',
  id:m.id,
  title:m.title,
  priority:m.target?.label||'ProofLoop',
  instruction:t('Verifica la competenza indicata osservando comportamento, decisione, controllo e consistenza.','Verify the stated skill by observing behaviour, decision-making, control and consistency.','Ivverifika l-ħila indikata billi tosserva l-imġiba, id-deċiżjoni, il-kontroll u l-konsistenza.'),
  criteria:Array.isArray(m.criteria)?m.criteria.slice(0,3):[],
  due:'next-lesson',
  requiresInstructorCheck:true,
  proofLoop:{schema:m.schema,missionId:m.id,target:m.target,createdAt:m.createdAt,baseline:m.baseline,evidence:m.evidence}
 };
}
function statusCopy(status){
 if(status==='awaiting_instructor')return ['ready',t('Nuova prova acquisita','New evidence captured','Inġabret evidenza ġdida'),t('MDM ha rilevato nuova evidenza dopo l’avvio. La missione è pronta per la verifica dell’istruttore, ma non è ancora verificata.','MDM detected new evidence after the mission started. It is ready for instructor review, but it is not verified yet.','MDM sab evidenza ġdida wara li bdiet il-missjoni. Hija lesta għall-verifika tal-istruttur, iżda għadha mhix ivverifikata.')];
 if(status==='evidence_conflict')return ['conflict',t('Prova da chiarire','Evidence needs resolving','L-evidenza trid tiġi ċċarata'),t('È presente una contraddizione. La missione resta aperta finché le prove non concordano.','A contradiction is present. The mission stays open until the evidence agrees.','Hemm kontradizzjoni. Il-missjoni tibqa’ miftuħa sakemm l-evidenza taqbel.')];
 return ['active',t('Missione attiva','Mission active','Missjoni attiva'),t('Serve nuova evidenza successiva all’avvio. Le prove precedenti non vengono riutilizzate per chiudere la missione.','New evidence recorded after mission start is required. Earlier evidence is not reused to close the mission.','Hemm bżonn evidenza ġdida rreġistrata wara l-bidu tal-missjoni. Evidenza eqdem ma terġax tintuża biex tingħalaq il-missjoni.')];
}
function html(result){
 const mission=refresh(result);
 if(!mission){
  return '<div class="mdm-proofloop-verification create">'+
   '<div><strong>🎯 '+esc(t('Verification Mission','Verification Mission','Missjoni ta’ Verifika'))+'</strong>'+
   '<p>'+esc(t('Trasforma la prossima prova in una missione reale con una baseline nuova e verifica finale dell’istruttore.','Turn the next evidence gap into a real mission with a fresh baseline and final instructor review.','Ibdel il-pass li jmiss f’missjoni reali b’baseline ġdida u verifika finali tal-istruttur.'))+'</p></div>'+
   '<button id="mdmProofLoopCreateMission" type="button">'+esc(t('Crea missione','Create mission','Oħloq missjoni'))+'</button>'+
  '</div>';
 }
 const sc=statusCopy(mission.status);
 const d=mission.evidence||{};
 return '<div class="mdm-proofloop-verification '+sc[0]+'">'+
  '<div class="mdm-proofloop-verification-head"><div><small>'+esc(mission.id)+'</small><strong>🎯 '+esc(mission.title)+'</strong></div><span>'+esc(sc[1])+'</span></div>'+
  '<p class="mdm-proofloop-verification-status">'+esc(sc[2])+'</p>'+
  '<div class="mdm-proofloop-verification-target"><span>'+esc(t('Competenza da verificare','Skill to verify','Ħila li trid tiġi vverifikata'))+'</span><strong>'+esc(mission.target?.label||'—')+'</strong></div>'+
  '<ol>'+mission.criteria.map(x=>'<li>'+esc(x)+'</li>').join('')+'</ol>'+
  '<div class="mdm-proofloop-verification-evidence">'+
   '<span>🛣️ +'+Number(d.roadDelta||0)+' '+esc(t('evidenze strada','road evidence','evidenza fit-triq'))+'</span>'+
   '<span>📡 +'+Number(d.telemetryDelta||0)+' '+esc(t('sessioni','sessions','sessjonijiet'))+'</span>'+
  '</div>'+
  (mission.status==='awaiting_instructor'
    ?'<div class="mdm-proofloop-verification-lock">🔒 '+esc(t('Solo la verifica dell’istruttore può chiudere questa missione come competenza verificata.','Only instructor verification can close this mission as a verified skill.','Il-verifika tal-istruttur biss tista’ tagħlaq din il-missjoni bħala ħila vverifikata.'))+'</div>'
    :'')+
  '<button id="mdmProofLoopCopyMission" class="secondary" type="button">'+esc(t('Copia briefing istruttore','Copy instructor brief','Ikkopja l-brief tal-istruttur'))+'</button>'+
 '</div>';
}
function brief(mission){
 const p=assignmentPayload(mission);if(!p)return '';
 return [
  'MDM PROOFLOOP · VERIFICATION MISSION',
  p.title,
  '',
  t('Obiettivo','Objective','Għan')+': '+String(p.priority||''),
  t('Istruzione','Instruction','Istruzzjoni')+': '+String(p.instruction||''),
  '',
  ...p.criteria.map((x,i)=>(i+1)+'. '+x),
  '',
  t('Regola','Rule','Regola')+': '+t('richiede verifica finale dell’istruttore; nessuna auto-certificazione dello studente.','requires final instructor verification; no learner self-certification.','teħtieġ verifika finali tal-istruttur; l-istudent ma jistax jiċċertifika lilu nnifsu.')
 ].join('\n');
}
async function copyBrief(){
 const text=brief(load());if(!text)return;
 try{await navigator.clipboard.writeText(text)}catch(_){
  const ta=document.createElement('textarea');ta.value=text;ta.style.position='fixed';ta.style.opacity='0';document.body.appendChild(ta);ta.select();document.execCommand('copy');ta.remove();
 }
}
function bind(result,rerender){
 const createBtn=document.getElementById('mdmProofLoopCreateMission');
 if(createBtn)createBtn.onclick=function(){create(result);if(typeof rerender==='function')rerender()};
 const copyBtn=document.getElementById('mdmProofLoopCopyMission');
 if(copyBtn)copyBtn.onclick=copyBrief;
}
migrateStoredMissions();
window.MDM_PROOFLOOP_VERIFICATION=Object.freeze({
 version:VERSION,
 create,
 refresh,
 current:load,
 assignmentPayload,
 html,
 bind
});
})();