/* Malta Driving Master 45.8.38.25 — Unified Mission Lifecycle */
(function(){
'use strict';
if(window.MDM_PROOFLOOP_VERIFICATION)return;

const VERSION='45.8.38.25';
const AUTH_KEY='mdm_auth_session_v4410';
const BASE_KEY='mdm-proofloop-verification-v1';
const SCHOOL_CACHE='mdm-school-evidence-cache-v1';
const UNIFIED_BASE='mdm-unified-mission-baseline-v1';

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
function scopedKey(base){const id=uid();return base+(id?'::user:'+id:'::signed-out')}
function schoolCache(){try{return parse(localStorage.getItem(scopedKey(SCHOOL_CACHE)))||{}}catch(_){return{}}}
function schoolMissions(){const x=schoolCache();return Array.isArray(x?.missions)?x.missions:[]}
function serverMissionId(m){return String(m?.mission_id||m?.id||'').trim()}
function activeSchoolMission(){
 return schoolMissions().find(m=>['assigned','revision_requested','evidence_submitted'].includes(String(m?.status||'')))||null;
}
function normLabel(v){return String(v||'').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9]+/g,' ').trim()}
function labelSimilarity(a,b){
 const A=new Set(normLabel(a).split(/\s+/).filter(x=>x.length>2)),B=new Set(normLabel(b).split(/\s+/).filter(x=>x.length>2));
 if(!A.size||!B.size)return 0;let n=0;A.forEach(x=>{if(B.has(x))n++});return n/Math.min(A.size,B.size);
}
function unifiedBaselineKey(mid){return scopedKey(UNIFIED_BASE)+'::'+String(mid||'')}
function unifiedBaseline(result,server){
 const mid=serverMissionId(server);if(!mid||!result)return null;
 let b=parse(localStorage.getItem(unifiedBaselineKey(mid)));
 if(!b){
  b={schema:'mdm-unified-mission-baseline-v1',version:VERSION,missionId:mid,createdAt:now(),
   roadRecords:Number(result.sources?.road?.records||0),telemetrySessions:Number(result.sources?.telemetry?.sessions||0),
   contradictions:Number(result.contradictions||0),independentSources:Number(result.independentSources||0)};
  try{localStorage.setItem(unifiedBaselineKey(mid),JSON.stringify(b))}catch(_){}
 }
 return b;
}
function evidenceForServerMission(mid,result){
 const server=schoolMissions().find(m=>serverMissionId(m)===String(mid||''));if(!server)return null;
 const r=result||window.MDM_PROOFLOOP_ENGINE?.evaluate?.()||null;if(!r)return null;
 const b=unifiedBaseline(r,server);if(!b)return null;
 return {schema:'mdm-unified-proof-evidence-v1',version:VERSION,missionId:serverMissionId(server),
  collectedAt:now(),roadDelta:Math.max(0,Number(r.sources?.road?.records||0)-Number(b.roadRecords||0)),
  telemetryDelta:Math.max(0,Number(r.sources?.telemetry?.sessions||0)-Number(b.telemetrySessions||0)),
  contradictions:Number(r.contradictions||0),independentSources:Number(r.independentSources||0),
  sourceTotal:Number(r.sourceTotal||5),quality:String(r.quality||''),baseline:b};
}
function unifiedCurrent(result){
 const server=activeSchoolMission();
 if(server){
  const p=server.payload||{};if(result)unifiedBaseline(result,server);
  return {source:'school',id:serverMissionId(server),serverMissionId:serverMissionId(server),status:String(server.status||'assigned'),
   title:String(p.title||p.objective||t('Missione della scuola','School mission','Missjoni tal-iskola')),
   target:{label:String(p.competence_label||p.objective||p.title||t('Competenza da verificare','Skill to verify','Ħila li trid tiġi vverifikata'))},
   payload:p,server};
 }
 syncAcceptedSchoolMission();
 const local=load();return local?{...local,source:'proofloop'}:null;
}
function syncAcceptedSchoolMission(){
 const local=load();if(!local?.target?.label)return local;
 const accepted=schoolMissions().filter(m=>String(m?.status||'')==='accepted'&&String(m?.raw_status||'')==='verified'&&m?.payload?.verification_scope==='driver_competence');
 const hit=accepted.find(m=>labelSimilarity(local.target.label,m?.payload?.competence_label||'')>=0.72);
 if(!hit)return local;
 if(local.status!=='verified'||local.serverMissionId!==serverMissionId(hit)){
  local.status='verified';local.instructorVerified=true;local.requiresInstructorCheck=true;
  local.serverMissionId=serverMissionId(hit);local.verifiedAt=String(hit.reviewed_at||now());
  local.verifiedBy='school-human-review';local.version=VERSION;save(local);
 }
 return local;
}

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
 syncAcceptedSchoolMission();
 const mission=load();
 if(!mission||!result)return mission;
 if(mission.status==='verified')return mission;
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
 if(status==='verified')return ['ready',t('Verificata dalla scuola','Verified by school','Ivverifikata mill-iskola'),t('La verifica umana della scuola ha chiuso questa missione. La competenza può ora aggiornare il Competence Passport.','Human school review closed this mission. The skill can now update the Competence Passport.','Il-verifika umana tal-iskola għalqet din il-missjoni. Il-ħila issa tista’ taġġorna l-Passaport tal-Kompetenzi.')];
 if(status==='awaiting_instructor')return ['ready',t('Nuova prova acquisita','New evidence captured','Inġabret evidenza ġdida'),t('MDM ha rilevato nuova evidenza dopo l’avvio. La missione è pronta per la verifica dell’istruttore, ma non è ancora verificata.','MDM detected new evidence after the mission started. It is ready for instructor review, but it is not verified yet.','MDM sab evidenza ġdida wara li bdiet il-missjoni. Hija lesta għall-verifika tal-istruttur, iżda għadha mhix ivverifikata.')];
 if(status==='evidence_conflict')return ['conflict',t('Prova da chiarire','Evidence needs resolving','L-evidenza trid tiġi ċċarata'),t('È presente una contraddizione. La missione resta aperta finché le prove non concordano.','A contradiction is present. The mission stays open until the evidence agrees.','Hemm kontradizzjoni. Il-missjoni tibqa’ miftuħa sakemm l-evidenza taqbel.')];
 return ['active',t('Missione attiva','Mission active','Missjoni attiva'),t('Serve nuova evidenza successiva all’avvio. Le prove precedenti non vengono riutilizzate per chiudere la missione.','New evidence recorded after mission start is required. Earlier evidence is not reused to close the mission.','Hemm bżonn evidenza ġdida rreġistrata wara l-bidu tal-missjoni. Evidenza eqdem ma terġax tintuża biex tingħalaq il-missjoni.')];
}

const COSIGN_STATE_KEY='mdm-proofloop-cosign-v2';
const COSIGN_AUTH_KEY='mdm_auth_session_v4410';

function cosignAuth(){
 try{
  const x=JSON.parse(localStorage.getItem(COSIGN_AUTH_KEY)||'null');
  return x&&x.status==='authenticated'&&x.accessToken&&x.user?.id?x:null;
 }catch(_){return null}
}
function cosignState(){
 try{return JSON.parse(localStorage.getItem(COSIGN_STATE_KEY)||'{}')||{}}catch(_){return{}}
}
function saveCosignState(v){
 try{localStorage.setItem(COSIGN_STATE_KEY,JSON.stringify(v||{}))}catch(_){}
 return v||{};
}
async function cosignRpc(name,payload){
 const cfg=window.MDM_BACKEND_CONFIG,a=cosignAuth();
 if(!cfg?.enabled||!cfg.endpoint||!cfg.publishableKey||!a)throw new Error('auth_required');
 const r=await fetch(String(cfg.endpoint).replace(/\/$/,'')+'/rest/v1/rpc/'+name,{
  method:'POST',
  headers:{'Content-Type':'application/json','apikey':cfg.publishableKey,'Authorization':'Bearer '+a.accessToken},
  body:JSON.stringify(payload||{}),
  cache:'no-store'
 });
 const text=await r.text();let d={};try{d=text?JSON.parse(text):{}}catch(_){}
 if(!r.ok)throw new Error(String(d?.message||d?.error||('http_'+r.status)));
 return d;
}
function cosignRequiresReview(x){
 return Boolean(x?.payload?.requiresInstructorCheck||x?.payload?.proofLoop?.requiresInstructorCheck);
}
function cosignProofLoopId(x){return String(x?.payload?.proofLoop?.id||'').trim()}
function cosignMatch(local,items){
 if(!local)return null;
 const id=String(local.id||'').trim();if(!id)return null;
 const c=(Array.isArray(items)?items:[]).filter(cosignRequiresReview);
 return c.find(x=>cosignProofLoopId(x)===id)
  ||c.find(x=>String(x?.payload?.id||'').trim()===id)
  ||null;
}
function cosignPayload(local){
 if(!local?.id)return null;
 const base=assignmentPayload(local)||{};
 return {
  ...base,
  id:String(local.id),
  requiresInstructorCheck:true,
  proofLoop:{...(base.proofLoop||{}),id:String(local.id),requiresInstructorCheck:true}
 };
}
function cosignEncode(local){
 const p=cosignPayload(local);if(!p)return'';
 try{return 'MDM-COSIGN-1.'+btoa(unescape(encodeURIComponent(JSON.stringify(p))))}catch(_){return''}
}
async function cosignSync(local){
 const d=await cosignRpc('mdm_student_list_missions',{});
 const items=Array.isArray(d?.missions)?d.missions:(Array.isArray(d)?d:[]);
 const item=cosignMatch(local,items),st=cosignState();
 if(item){
  st.linked=true;
  st.localMissionId=String(local.id);
  st.serverMissionId=String(item.id||item.mission_id||'');
  st.serverStatus=String(item.status||'assigned');
 }else if(String(st.localMissionId||'')===String(local.id)){
  st.linked=false;st.serverMissionId='';st.serverStatus='';
 }
 return saveCosignState(st);
}
function cosignHtml(local){
 if(!local?.id)return'';
 const st=cosignState();
 const linked=st.linked===true&&String(st.localMissionId||'')===String(local.id);
 return '<div class="mdm-proofloop-verification-lock" data-mdm-cosign-local="4583814">'+
  '<strong>👤 '+esc(t('Co-sign istruttore','Instructor co-sign','Co-sign tal-istruttur'))+'</strong><br>'+
  '<span>'+esc(linked
    ?t('Missione collegata alla scuola','Mission linked to school','Missjoni marbuta mal-iskola')
    :t('Missione non ancora collegata alla scuola','Mission not linked to school yet','Il-missjoni għadha mhix marbuta mal-iskola'))+'</span>'+
  '<div style="margin-top:10px">'+
   '<button id="mdmLocalCosignShow" class="secondary" type="button">'+esc(t('Mostra codice co-sign','Show co-sign code','Uri l-kodiċi co-sign'))+'</button> '+
   '<button id="mdmLocalCosignCheck" class="secondary" type="button">'+esc(t('Controlla collegamento','Check link','Iċċekkja l-link'))+'</button>'+
  '</div>'+
  '<textarea id="mdmLocalCosignCode" readonly hidden style="width:100%;min-height:110px;margin-top:10px"></textarea>'+
 '</div>';
}
function bindCosign(local,rerender){
 const show=document.getElementById('mdmLocalCosignShow');
 const check=document.getElementById('mdmLocalCosignCheck');
 const area=document.getElementById('mdmLocalCosignCode');
 let lastShow=0,lastCheck=0;

 function bindLocal(btn,fn,key){
  if(!btn||btn.dataset[key]==='1')return;
  btn.dataset[key]='1';
  const fire=function(ev){
   const now=Date.now();
   if(key==='mdmShowBound'){
    if(now-lastShow<500)return;lastShow=now;
   }else{
    if(now-lastCheck<500)return;lastCheck=now;
   }
   try{ev?.preventDefault?.();ev?.stopPropagation?.()}catch(_){}
   fn();
  };
  btn.addEventListener('pointerup',fire,{passive:false});
  btn.addEventListener('touchend',fire,{passive:false});
  btn.addEventListener('click',fire,false);
 }

 if(show&&area)bindLocal(show,function(){
  area.value=cosignEncode(local);
  area.hidden=false;
  area.style.display='block';
  show.setAttribute('aria-pressed','true');
 },'mdmShowBound');

 if(check)bindLocal(check,async function(){
  if(check.disabled)return;
  check.disabled=true;
  try{await cosignSync(local)}catch(_){}
  finally{
   check.disabled=false;
   if(typeof rerender==='function')rerender();
  }
 },'mdmCheckBound');
}

function schoolStatusCopy(status){
 if(status==='revision_requested')return [t('Nuova evidenza richiesta','New evidence requested','Evidenza ġdida mitluba'),t('La scuola ha chiesto una nuova prova. ProofLoop continua a raccogliere segnali mentre completi la missione.','The school requested new evidence. ProofLoop keeps collecting signals while you complete the mission.','L-iskola talbet evidenza ġdida. ProofLoop jibqa’ jiġbor sinjali waqt li tlesti l-missjoni.')];
 if(status==='evidence_submitted')return [t('In attesa della scuola','Waiting for school review','Qed tistenna l-iskola'),t('L’evidenza è stata inviata. Solo la verifica umana della scuola può chiudere la missione.','Evidence was submitted. Only human school review can close the mission.','L-evidenza ntbagħtet. Il-verifika umana tal-iskola biss tista’ tagħlaq il-missjoni.')];
 return [t('Assegnata dalla scuola','Assigned by school','Assenjata mill-iskola'),t('Questa è la missione attiva unica. ProofLoop, strada e telemetria alimentano la stessa catena di evidenza.','This is the single active mission. ProofLoop, road and telemetry feed the same evidence chain.','Din hija l-missjoni attiva waħda. ProofLoop, it-triq u t-telemetrija jsaħħu l-istess katina ta’ evidenza.')];
}
function schoolMissionHtml(server,result){
 const p=server?.payload||{},mid=serverMissionId(server),sc=schoolStatusCopy(server?.status),auto=evidenceForServerMission(mid,result)||{};
 const meta=[p.pack_id||'',p.competence_label||''].filter(Boolean).join(' · ');
 return '<div class="mdm-proofloop-verification active" data-mdm-unified-school-mission="'+esc(mid)+'">'+
  '<div class="mdm-proofloop-verification-head"><div><small>MDM UNIFIED MISSION · '+esc(VERSION)+'</small><strong>🎯 '+esc(String(p.title||p.objective||t('Missione della scuola','School mission','Missjoni tal-iskola')))+'</strong></div><span>'+esc(sc[0])+'</span></div>'+
  '<p class="mdm-proofloop-verification-status">'+esc(sc[1])+'</p>'+
  (meta?'<div class="mdm-proofloop-verification-target"><span>'+esc(t('Licenza e competenza','Licence and competence','Liċenzja u ħila'))+'</span><strong>'+esc(meta)+'</strong></div>':'')+
  '<div class="mdm-proofloop-verification-evidence"><span>🛣️ +'+Number(auto.roadDelta||0)+' '+esc(t('evidenze strada','road evidence','evidenza fit-triq'))+'</span><span>📡 +'+Number(auto.telemetryDelta||0)+' '+esc(t('sessioni','sessions','sessjonijiet'))+'</span></div>'+
  (server?.status==='evidence_submitted'
    ?'<div class="mdm-proofloop-verification-lock">🔒 '+esc(t('Evidenza inviata: in attesa della verifica umana della scuola.','Evidence submitted: waiting for human school review.','Evidenza mibgħuta: qed tistenna l-verifika umana tal-iskola.'))+'</div>'
    :'<button id="mdmUnifiedSchoolEvidenceSend" class="secondary" type="button">✍️ '+esc(t('Scrivi e invia evidenza','Write and send evidence','Ikteb u ibgħat evidenza'))+'</button>')+
  '</div>';
}
function html(result){
 const server=activeSchoolMission();
 if(server)return schoolMissionHtml(server,result);
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
  cosignHtml(mission)+
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
 const unifiedBtn=document.getElementById('mdmUnifiedSchoolEvidenceSend');
 if(unifiedBtn)unifiedBtn.onclick=function(){
  const m=activeSchoolMission(),mid=serverMissionId(m),title=String(m?.payload?.title||m?.payload?.objective||t('Missione della scuola','School mission','Missjoni tal-iskola'));
  const api=window.MDM_STUDENT_SCHOOL_EVIDENCE_45838239_API;
  if(api&&typeof api.openEditor==='function'&&mid)api.openEditor(mid,title);
 };
 const createBtn=document.getElementById('mdmProofLoopCreateMission');
 if(createBtn)createBtn.onclick=function(){create(result);if(typeof rerender==='function')rerender()};
 const copyBtn=document.getElementById('mdmProofLoopCopyMission');
 if(copyBtn)copyBtn.onclick=copyBrief;
 bindCosign(load(),rerender);
}
migrateStoredMissions();
window.MDM_PROOFLOOP_VERIFICATION=Object.freeze({
 version:VERSION,
 create,
 refresh,
 current:load,
 unifiedCurrent,
 activeSchoolMission,
 evidenceForServerMission,
 syncAcceptedSchoolMission,
 assignmentPayload,
 html,
 bind
});
})();