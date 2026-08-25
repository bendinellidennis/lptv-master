/* MDM 45.8.28.3 — GitHub Web-Light Conflict Resolution Overlay
   Loads after the already-installed 45.8.28.2 runtime.
   Contains only the approved multi-device conflict-resolution delta.
*/
(function(){
'use strict';
mdmProductionSyncState.serverProtected = mdmProductionSyncState.serverProtected && typeof mdmProductionSyncState.serverProtected==='object' ? mdmProductionSyncState.serverProtected : {};
mdmProductionSyncState.resolutionLog = Array.isArray(mdmProductionSyncState.resolutionLog) ? mdmProductionSyncState.resolutionLog : [];
mdmProductionSyncSave();
mdmProductionSyncQueueRecords = function(records,{force=false}={}){
 const list=Array.isArray(records)?records:[];
 list.forEach(record=>{if(!record?.entityType||!record?.localId||!record?.payload)return;const key=mdmProductionSyncKey(record.entityType,record.localId);if(!force&&mdmProductionSyncState.serverProtected[key])return;const existing=mdmProductionSyncState.pending.find(x=>mdmProductionSyncKey(x.entityType,x.localId)===key);const item={entityType:String(record.entityType),localId:String(record.localId),payload:mdmProductionSyncClone(record.payload),clientUpdatedAt:String(record.clientUpdatedAt||new Date().toISOString()),expectedServerVersion:mdmProductionSyncExpectedVersion(record.entityType,record.localId),operationId:existing?.operationId||mdmProductionSyncOpId(),queuedAt:new Date().toISOString()};if(existing)Object.assign(existing,item);else mdmProductionSyncState.pending.push(item)});
 mdmProductionSyncState.pending=mdmProductionSyncState.pending.slice(-250);mdmProductionSyncSave();
}

mdmProductionSyncFlush = async function({silent=false}={}){
 if(mdmProductionSyncInFlight)return false;
 const auth=mdmAuthSummary();
 if(!auth.authenticated)return false;
 if(!mdmProductionSyncState.schemaReady){
  if(!silent)toast(lang3('Verifica prima lo schema Production Sync 45.8.28.','Verify the Production Sync 45.8.28 schema first.','L-ewwel ivverifika l-schema Production Sync 45.8.28.'));
  return false;
 }
 mdmProductionSyncInFlight=true;
 let sent=0;
 try{
  if(!(await mdmEnsureFreshAuthForData()))return false;
  const pending=[...mdmProductionSyncState.pending];
  for(const item of pending){
   let result=await mdmDataRpc('mdm_production_upsert_record',{
    p_entity_type:item.entityType,
    p_local_id:item.localId,
    p_payload:item.payload,
    p_expected_server_version:Number(item.expectedServerVersion)||0,
    p_client_updated_at:item.clientUpdatedAt||null,
    p_device_id:mdmProductionSyncDeviceId(),
    p_operation_id:item.operationId
   });
   if(result.status===401&&mdmAuthSession.refreshToken&&await mdmAuthRefreshSession()){
    result=await mdmDataRpc('mdm_production_upsert_record',{
     p_entity_type:item.entityType,
     p_local_id:item.localId,
     p_payload:item.payload,
     p_expected_server_version:Number(item.expectedServerVersion)||0,
     p_client_updated_at:item.clientUpdatedAt||null,
     p_device_id:mdmProductionSyncDeviceId(),
     p_operation_id:item.operationId
    });
   }
   const data=mdmAuthParse(result.body);
   const key=mdmProductionSyncKey(item.entityType,item.localId);
   const exactAck=Boolean(
    result.status>=200&&result.status<300&&
    data&&typeof data==='object'&&data.ok===true&&
    String(data.entity_type||'')===String(item.entityType||'')&&
    String(data.local_id||'')===String(item.localId||'')&&
    Number(data.server_version)>=1
   );
   if(exactAck){
    mdmProductionSyncState.serverVersions[key]=Math.max(0,Number(data.server_version)||0);
    mdmProductionSyncState.pending=mdmProductionSyncState.pending.filter(x=>x.operationId!==item.operationId);
    sent++;
    continue;
   }
   const parsed=data&&typeof data==='object'?data:{};
   if(String(parsed.error||'')==='version_conflict'||String(parsed.error||'')==='server_missing_conflict'){
    mdmProductionSyncState.conflicts.unshift({entityType:item.entityType,localId:item.localId,localExpected:Number(item.expectedServerVersion)||0,serverVersion:Number(parsed.server_version)||0,clientUpdatedAt:String(item.clientUpdatedAt||''),localPayload:mdmProductionSyncClone(item.payload),at:new Date().toISOString()});
    mdmProductionSyncState.conflicts=mdmProductionSyncState.conflicts.slice(0,50);
    mdmProductionSyncState.pending=mdmProductionSyncState.pending.filter(x=>x.operationId!==item.operationId);
    continue;
   }
   mdmProductionSyncState.lastMessage=(result.status>=200&&result.status<300)
    ?`RPC acknowledgement not verifiable for ${item.entityType}/${item.localId}`
    :(mdmDataErrorMessage(result)||String(parsed.error||'sync_failed'));
   break;
  }
  mdmProductionSyncState.lastPushAt=sent?new Date().toISOString():mdmProductionSyncState.lastPushAt;
  mdmProductionSyncState.lastMessage=sent?`${sent} record synced with exact server acknowledgement`:mdmProductionSyncState.lastMessage;
  mdmProductionSyncSave();
  render();
  if(!silent)toast(sent
   ?lang3(`${sent} record sincronizzati con conferma server.`,`${sent} records synced with server acknowledgement.`,`${sent} rekords ġew sinkronizzati b’konferma tas-server.`)
   :lang3('Nessun record sincronizzato. Controlla stato o conflitti.','No records were synced. Check status or conflicts.','L-ebda rekord ma ġie sinkronizzat. Iċċekkja l-istat jew il-kunflitti.'));
  return sent>0;
 }finally{mdmProductionSyncInFlight=false}
}

mdmProductionSyncRecordForKey = function(entityType,localId){
 const type=String(entityType||''),id=String(localId||'');
 let records=[];
 try{records=mdmProductionSyncEvidenceRecords().concat(mdmProductionSyncTelemetryRecords())}catch{}
 return records.find(r=>String(r?.entityType||'')===type&&String(r?.localId||'')===id)||null;
}
mdmProductionSyncServerItem = function(entityType,localId){
 const type=String(entityType||''),id=String(localId||'');
 return (Array.isArray(mdmProductionSyncState.previewItems)?mdmProductionSyncState.previewItems:[]).find(r=>String(r?.entityType||'')===type&&String(r?.localId||'')===id)||null;
}
mdmProductionSyncRecordSummary = function(entityType,payload){
 const type=String(entityType||''),p=payload&&typeof payload==='object'?payload:{};
 if(type==='driving_twin')return lang3(`${Array.isArray(p.patterns)?p.patterns.length:0} pattern · ${Number(p.evidencePoints)||0} evidenze`,`${Array.isArray(p.patterns)?p.patterns.length:0} patterns · ${Number(p.evidencePoints)||0} evidence points`,`${Array.isArray(p.patterns)?p.patterns.length:0} patterns · ${Number(p.evidencePoints)||0} punti ta’ evidenza`);
 if(type==='evidence_passport')return lang3(`${Number(p.evidenceCoverage)||0}% copertura · ${Number(p.totalAxes)||0} assi`,`${Number(p.evidenceCoverage)||0}% coverage · ${Number(p.totalAxes)||0} axes`,`${Number(p.evidenceCoverage)||0}% kopertura · ${Number(p.totalAxes)||0} assi`);
 if(type==='road_evidence')return `${String(p.status||'—')} · ${String(p.evaluation||'—')}`;
 if(type==='telemetry_session')return lang3(`${Number(p.gpsOriginalCount)||0} punti GPS · ${Array.isArray(p.events)?p.events.length:0} eventi`,`${Number(p.gpsOriginalCount)||0} GPS points · ${Array.isArray(p.events)?p.events.length:0} events`,`${Number(p.gpsOriginalCount)||0} punti GPS · ${Array.isArray(p.events)?p.events.length:0} avvenimenti`);
 if(type==='driving_event')return `${String(p.type||'—')} · ${String(p.confidence||'—')}`;
 return String(p.schema||type||'record');
}
mdmProductionSyncResolutionLog = function(action,entityType,localId,serverVersion){
 mdmProductionSyncState.resolutionLog.unshift({action:String(action||''),entityType:String(entityType||''),localId:String(localId||''),serverVersion:Number(serverVersion)||0,at:new Date().toISOString(),deviceId:mdmProductionSyncDeviceId()});
 mdmProductionSyncState.resolutionLog=mdmProductionSyncState.resolutionLog.slice(0,50);
}
mdmProductionSyncResolveConflict = async function(index,choice){
 const conflict=mdmProductionSyncState.conflicts[Number(index)];
 if(!conflict)return false;
 const type=String(conflict.entityType||''),id=String(conflict.localId||''),key=mdmProductionSyncKey(type,id);
 if(!(await mdmProductionSyncPullPreview({silent:true}))){toast(lang3('Impossibile rileggere il server: conflitto non modificato.','Could not refresh the server: conflict left unchanged.','Ma setax jerġa’ jinqara s-server: il-kunflitt baqa’ kif kien.'));return false}
 const server=mdmProductionSyncServerItem(type,id);
 if(!server){toast(lang3('Record server non trovato. Nessuna decisione applicata.','Server record not found. No decision was applied.','Ir-rekord tas-server ma nstabx. Ma ġiet applikata l-ebda deċiżjoni.'));return false}
 if(choice==='server'){
  mdmProductionSyncState.serverVersions[key]=Math.max(0,Number(server.serverVersion)||0);
  mdmProductionSyncState.serverProtected[key]={entityType:type,localId:id,serverVersion:Number(server.serverVersion)||0,updatedAt:String(server.updatedAt||''),protectedAt:new Date().toISOString()};
  mdmProductionSyncState.pending=mdmProductionSyncState.pending.filter(x=>mdmProductionSyncKey(x.entityType,x.localId)!==key);
  mdmProductionSyncState.conflicts=mdmProductionSyncState.conflicts.filter(x=>mdmProductionSyncKey(x.entityType,x.localId)!==key);
  mdmProductionSyncResolutionLog('keep_server',type,id,server.serverVersion);
  mdmProductionSyncState.lastMessage=`Server protected for ${type}/${id} at v${Number(server.serverVersion)||0}`;
  mdmProductionSyncSave();render();
  toast(lang3('Versione server mantenuta e protetta. La copia locale resta sul dispositivo ma non verrà inviata finché non la riabiliti.','Server version kept and protected. The local copy stays on this device but will not be uploaded until you re-enable it.','Il-verżjoni tas-server inżammet u ġiet protetta. Il-kopja lokali tibqa’ fuq dan l-apparat iżda ma tittellax sakemm terġa’ tattivaha.'));
  return true;
 }
 if(choice==='local'){
  const local=mdmProductionSyncRecordForKey(type,id);
  if(!local){toast(lang3('Copia locale non disponibile: nessuna sovrascrittura eseguita.','Local copy is unavailable: no overwrite was performed.','Il-kopja lokali mhix disponibbli: ma sar l-ebda overwrite.'));return false}
  const ok=confirm(lang3(`Inviare la copia LOCALE di ${type}/${id} sopra la versione server v${Number(server.serverVersion)||0}? Questa scelta è esplicita e verrà verificata con una nuova lettura server.`,`Upload the LOCAL copy of ${type}/${id} over server version v${Number(server.serverVersion)||0}? This is an explicit choice and will be verified with a fresh server read.`,`Tella’ l-kopja LOKALI ta’ ${type}/${id} fuq il-verżjoni tas-server v${Number(server.serverVersion)||0}? Din hija għażla espliċita u tiġi vverifikata b’qari ġdid tas-server.`));
  if(!ok)return false;
  mdmProductionSyncState.serverVersions[key]=Math.max(0,Number(server.serverVersion)||0);
  delete mdmProductionSyncState.serverProtected[key];
  mdmProductionSyncState.conflicts=mdmProductionSyncState.conflicts.filter(x=>mdmProductionSyncKey(x.entityType,x.localId)!==key);
  mdmProductionSyncQueueRecords([local],{force:true});mdmProductionSyncSave();render();
  await mdmProductionSyncFlush({silent:true});
  const pulled=await mdmProductionSyncPullPreview({silent:true});
  const after=pulled?mdmProductionSyncServerItem(type,id):null;
  const stillConflict=mdmProductionSyncState.conflicts.some(x=>mdmProductionSyncKey(x.entityType,x.localId)===key);
  if(after&&!stillConflict&&Number(after.serverVersion)>Number(server.serverVersion)){
   mdmProductionSyncResolutionLog('use_local',type,id,after.serverVersion);mdmProductionSyncState.lastMessage=`Local version committed for ${type}/${id} at v${Number(after.serverVersion)||0}`;mdmProductionSyncSave();render();
   toast(lang3(`Copia locale verificata sul server: ${type}/${id} ora è v${Number(after.serverVersion)||0}.`,`Local copy verified on the server: ${type}/${id} is now v${Number(after.serverVersion)||0}.`,`Il-kopja lokali ġiet ivverifikata fuq is-server: ${type}/${id} issa hija v${Number(after.serverVersion)||0}.`));return true;
  }
  toast(lang3('Risoluzione locale non verificata. Il record non viene dichiarato risolto.','Local resolution was not verified. The record is not declared resolved.','Ir-riżoluzzjoni lokali ma ġietx ivverifikata. Ir-rekord ma jitqiesx solvut.'));return false;
 }
 return false;
}
mdmProductionSyncUnprotect = function(index){
 const entries=Object.entries(mdmProductionSyncState.serverProtected||{}),entry=entries[Number(index)];if(!entry)return;
 const [key,row]=entry;delete mdmProductionSyncState.serverProtected[key];mdmProductionSyncResolutionLog('re_enable_local',row?.entityType||'',row?.localId||'',row?.serverVersion||0);mdmProductionSyncSave();render();toast(lang3('Sync locale riabilitato. Nessun dato è stato inviato: il prossimo push richiederà una nuova azione.','Local sync re-enabled. No data was sent: the next push still requires a new action.','Is-sync lokali reġa’ ġie attivat. Ma ntbagħtet l-ebda dejta: il-push li jmiss xorta jeħtieġ azzjoni ġdida.'));
}

mdmProductionSyncPanelHtml = function(){
 const auth=mdmAuthSummary(),state=mdmProductionSyncState,localTelemetry=Array.isArray(realRoadTelemetryStore?.sessions)?realRoadTelemetryStore.sessions.length:0,localRoad=typeof realRoadEvidenceRows==='function'?realRoadEvidenceRows().length:0,conflicts=state.conflicts.length,pending=state.pending.length;
 const gates=[{ok:auth.authenticated,label:lang3('Sessione Supabase Auth','Supabase Auth session','Sessjoni Supabase Auth'),detail:auth.authenticated?auth.email:lang3('Accesso richiesto','Sign-in required','Jeħtieġ dħul')},{ok:Boolean(state.schemaReady),label:lang3('Schema Production Sync 45.8.28','Production Sync 45.8.28 schema','Schema Production Sync 45.8.28'),detail:state.schemaReady?lang3('RPC e concorrenza verificati','RPCs and concurrency verified','RPCs u concurrency ivverifikati'):lang3('Da verificare dopo la migrazione SQL','Verify after SQL migration','Għandu jiġi vverifikat wara l-migrazzjoni SQL')},{ok:conflicts===0,label:lang3('Conflitti non sovrascritti','Conflicts not overwritten','Kunflitti mhux miktubin fuqhom'),detail:conflicts?`${conflicts} ${lang3('da risolvere','to resolve','biex jiġu solvuti')}`:lang3('Nessun conflitto locale aperto','No open local conflict','L-ebda kunflitt lokali miftuħ')}];
 const countText=Object.entries(state.previewCounts||{}).map(([k,v])=>`${k}: ${v}`).join(' · ')||lang3('Nessun preview server ancora letto','No server preview read yet','Għadu ma nqara l-ebda preview tas-server');
 const conflictHtml=(Array.isArray(state.conflicts)?state.conflicts:[]).map((c,i)=>{const local=mdmProductionSyncRecordForKey(c.entityType,c.localId),server=mdmProductionSyncServerItem(c.entityType,c.localId);const localPayload=local?.payload||c.localPayload||{},serverPayload=server?.payload||{};return `<article class="locked" style="display:block"><div style="display:flex;gap:10px;align-items:flex-start"><span>⚠️</span><div style="min-width:0;flex:1"><strong>${esc(String(c.entityType||''))} · ${esc(String(c.localId||''))}</strong><small>${esc(lang3(`Locale atteso v${Number(c.localExpected)||0} · Server v${Number(server?.serverVersion||c.serverVersion)||0}`,`Local expected v${Number(c.localExpected)||0} · Server v${Number(server?.serverVersion||c.serverVersion)||0}`,`Lokali mistenni v${Number(c.localExpected)||0} · Server v${Number(server?.serverVersion||c.serverVersion)||0}`))}</small><small>${esc(lang3('Locale','Local','Lokali'))}: ${esc(mdmProductionSyncRecordSummary(c.entityType,localPayload))}</small><small>${esc(lang3('Server','Server','Server'))}: ${esc(mdmProductionSyncRecordSummary(c.entityType,serverPayload))}</small><div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:10px"><button class="btn secondary" data-production-conflict-server="${i}">☁️ ${esc(lang3('Mantieni server','Keep server','Żomm is-server'))}</button><button class="btn secondary" data-production-conflict-local="${i}">📱 ${esc(lang3('Invia locale','Use local','Uża lokali'))}</button></div></div></div></article>`}).join('');
 const protectedEntries=Object.entries(state.serverProtected||{});const protectedHtml=protectedEntries.map(([key,row],i)=>`<article class="pass" style="display:block"><div style="display:flex;gap:10px;align-items:flex-start"><span>☁️</span><div style="min-width:0;flex:1"><strong>${esc(String(row?.entityType||key))} · ${esc(String(row?.localId||''))}</strong><small>${esc(lang3(`Server protetto v${Number(row?.serverVersion)||0}; la copia locale non viene caricata automaticamente.`,`Protected server v${Number(row?.serverVersion)||0}; the local copy is not uploaded automatically.`,`Server protett v${Number(row?.serverVersion)||0}; il-kopja lokali ma tittellax awtomatikament.`))}</small><button class="btn secondary" style="margin-top:8px" data-production-unprotect="${i}">↩ ${esc(lang3('Riabilita sync locale','Re-enable local sync','Erġa’ attiva sync lokali'))}</button></div></div></article>`).join('');
 return `<section class="card backend-real-gates" style="margin-top:14px"><div class="backend-real-head"><div><small>${esc(lang3('45.8.28 · BACKEND PRODUCTION SYNC','45.8.28 · BACKEND PRODUCTION SYNC','45.8.28 · BACKEND PRODUCTION SYNC'))}</small><h2>${esc(lang3('Sincronizzazione local-first con conflitti espliciti','Local-first sync with explicit conflicts','Sync local-first b’kunflitti espliċiti'))}</h2></div><span>☁️</span></div><p>${esc(lang3('Nessun upload automatico. Le evidenze vengono inviate solo quando premi il comando; la telemetria richiede una conferma separata perché può contenere coordinate GPS. Un conflitto di versione non viene mai sovrascritto in silenzio.','No automatic upload. Evidence is sent only when you press the command; telemetry requires separate confirmation because it may contain GPS coordinates. A version conflict is never silently overwritten.','L-ebda upload awtomatiku. L-evidenza tintbagħat biss meta tagħfas il-kmand; it-telemetrija teħtieġ konferma separata għax jista’ jkun fiha koordinati GPS. Kunflitt tal-verżjoni qatt ma jinkiteb fuqu fis-skiet.'))}</p><div class="backend-real-gate-list">${gates.map(g=>`<article class="${g.ok?'pass':'locked'}"><span>${g.ok?'✓':'🔒'}</span><div><strong>${esc(g.label)}</strong><small>${esc(g.detail)}</small></div></article>`).join('')}</div><div class="backend-real-actions" style="margin-top:12px;display:flex;gap:8px;flex-wrap:wrap"><button class="btn" id="productionSyncProbe">🔎 ${esc(lang3('Verifica schema 45.8.28','Verify 45.8.28 schema','Ivverifika l-schema 45.8.28'))}</button><button class="btn secondary" id="productionSyncEvidence" ${!state.schemaReady||!auth.authenticated?'disabled':''}>🪪 ${esc(lang3('Sincronizza evidenze','Sync evidence','Issinkronizza l-evidenza'))}</button><button class="btn secondary" id="productionSyncTelemetry" ${!state.schemaReady||!auth.authenticated||!localTelemetry?'disabled':''}>📡 ${esc(lang3('Carica telemetria esplicitamente','Explicitly upload telemetry','Tella’ t-telemetrija espliċitament'))}</button><button class="btn secondary" id="productionSyncPull" ${!state.schemaReady||!auth.authenticated?'disabled':''}>↻ ${esc(lang3('Leggi snapshot server','Read server snapshot','Aqra l-snapshot tas-server'))}</button></div><div class="backend-real-gate-list" style="margin-top:12px"><article class="${pending?'locked':'pass'}"><span>${pending?'⏳':'✓'}</span><div><strong>${pending} ${esc(lang3('record in coda locale','records in local queue','rekords fil-kju lokali'))}</strong><small>${esc(lang3('Retry idempotente: lo stesso operation ID non crea duplicati.','Idempotent retry: the same operation ID does not create duplicates.','Retry idempotenti: l-istess operation ID ma joħloqx duplikati.'))}</small></div></article><article class="pass"><span>🛣️</span><div><strong>${localRoad} ${esc(lang3('evidenze strada locali','local road evidence records','rekords lokali tal-evidenza fit-triq'))}</strong><small>${localTelemetry} ${esc(lang3('sessioni telemetria locali','local telemetry sessions','sessjonijiet lokali tat-telemetrija'))}</small></div></article><article class="${conflicts?'locked':'pass'}"><span>${conflicts?'⚠️':'✓'}</span><div><strong>${conflicts} ${esc(lang3('conflitti versione','version conflicts','kunflitti tal-verżjoni'))}</strong><small>${esc(lang3('Nessun merge automatico: prima si legge il server, poi si decide.','No automatic merge: read the server first, then decide.','L-ebda merge awtomatiku: l-ewwel aqra s-server, imbagħad iddeċiedi.'))}</small></div></article></div><p style="margin-top:12px"><strong>${esc(lang3('Server','Server','Server'))}:</strong> ${state.serverRecordCount} ${esc(lang3('record','records','rekords'))} · ${esc(lang3('ultimo push','last push','l-aħħar push'))}: ${esc(mdmProductionSyncDate(state.lastPushAt))} · ${esc(lang3('ultimo pull','last pull','l-aħħar pull'))}: ${esc(mdmProductionSyncDate(state.lastPullAt))}</p><p class="backend-real-key-note">${esc(countText)}</p>${conflictHtml?`<div class="backend-real-gate-list" style="margin-top:12px"><p style="margin:0 0 8px"><strong>${esc(lang3('Risoluzione conflitti multi-device','Multi-device conflict resolution','Riżoluzzjoni ta’ kunflitti multi-device'))}</strong></p>${conflictHtml}</div>`:''}${protectedHtml?`<div class="backend-real-gate-list" style="margin-top:12px"><p style="margin:0 0 8px"><strong>${esc(lang3('Record server protetti','Protected server records','Rekords tas-server protetti'))}</strong></p>${protectedHtml}</div>`:''}<p class="backend-real-key-note">${esc(lang3('Foundation 45.8.28.3: il pull è solo una preview e non applica ancora merge multi-device. L’upload telemetria viene dichiarato riuscito solo dopo una rilettura server indipendente degli stessi record. Operations/Fleet/Parent restano locali finché i relativi permessi server non vengono chiusi nei prossimi sub-step.','45.8.28.3 foundation: multi-device conflicts require an explicit choice. Keep server protects the server record without changing the local copy; Use local targets the current server version and verifies the new push with an independent read. Operations/Fleet/Parent remain local until their server permissions are closed in the next sub-steps.','Foundation 45.8.28.3: il-kunflitti multi-device jeħtieġu għażla espliċita. Żomm is-server jipproteġi r-rekord tas-server mingħajr ma jbiddel il-kopja lokali; Uża lokali juża l-verżjoni kurrenti tas-server u jivverifika l-push b’qari indipendenti. Operations/Fleet/Parent jibqgħu lokali sakemm jingħalqu l-permessi tas-server fil-passi li jmiss.'))}</p></section>`;
}
bindMdmProductionSync = function(){
 const probe=$('#productionSyncProbe');if(probe)probe.onclick=()=>mdmProductionSyncProbe({silent:false});
 const evidence=$('#productionSyncEvidence');if(evidence)evidence.onclick=mdmProductionSyncEvidence;
 const telemetry=$('#productionSyncTelemetry');if(telemetry)telemetry.onclick=mdmProductionSyncTelemetry;
 const pull=$('#productionSyncPull');if(pull)pull.onclick=()=>mdmProductionSyncPullPreview({silent:false});
 screen.querySelectorAll('[data-production-conflict-server]').forEach(button=>button.onclick=()=>mdmProductionSyncResolveConflict(Number(button.dataset.productionConflictServer),'server'));
 screen.querySelectorAll('[data-production-conflict-local]').forEach(button=>button.onclick=()=>mdmProductionSyncResolveConflict(Number(button.dataset.productionConflictLocal),'local'));
 screen.querySelectorAll('[data-production-unprotect]').forEach(button=>button.onclick=()=>mdmProductionSyncUnprotect(Number(button.dataset.productionUnprotect)));
}
// Show the overlay build number in visible badges while the base runtime remains 45.8.28.2.
function mdm458283TagBuild(){
  try{
    document.querySelectorAll('.badge.official,.app-version-row strong').forEach(el=>{
      if(String(el.textContent||'').includes('45.8.28.2')) el.textContent=String(el.textContent).replace(/45\.8\.28\.2/g,'45.8.28.3');
    });
  }catch{}
}
try{
  const mdm458283BaseRender=render;
  render=function(...args){const result=mdm458283BaseRender.apply(this,args);setTimeout(mdm458283TagBuild,0);return result};
}catch{}
try{render();setTimeout(mdm458283TagBuild,0)}catch{}
})();
