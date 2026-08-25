/* Malta Driving Master 45.8.28.3 — SAFE Multi-Device Conflict Manager
   Loads after the approved 45.8.28.2 runtime.
   IMPORTANT: does not call, wrap or replace render() during startup. */
(function(){
  if (window.__MDM_4582833_CONFLICT_MANAGER_SAFE__) return;
  window.__MDM_4582833_CONFLICT_MANAGER_SAFE__ = true;

  const OVERLAY_BUILD = '45.8.28.3';
  let initialized = false;
  let observer = null;
  let baseQueue = null;

  function t(it,en,mt){
    try { return typeof lang3 === 'function' ? lang3(it,en,mt) : it; }
    catch { return it; }
  }
  function h(value){
    return String(value == null ? '' : value)
      .replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')
      .replace(/"/g,'&quot;').replace(/'/g,'&#39;');
  }
  function key(type,id){
    try { return mdmProductionSyncKey(type,id); }
    catch { return String(type||'')+'::'+String(id||''); }
  }
  function ensureState(){
    if (typeof mdmProductionSyncState === 'undefined' || !mdmProductionSyncState) return false;
    mdmProductionSyncState.serverProtected = mdmProductionSyncState.serverProtected && typeof mdmProductionSyncState.serverProtected === 'object' ? mdmProductionSyncState.serverProtected : {};
    mdmProductionSyncState.resolutionLog = Array.isArray(mdmProductionSyncState.resolutionLog) ? mdmProductionSyncState.resolutionLog : [];
    mdmProductionSyncState.conflicts = Array.isArray(mdmProductionSyncState.conflicts) ? mdmProductionSyncState.conflicts : [];
    mdmProductionSyncState.pending = Array.isArray(mdmProductionSyncState.pending) ? mdmProductionSyncState.pending : [];
    mdmProductionSyncState.previewItems = Array.isArray(mdmProductionSyncState.previewItems) ? mdmProductionSyncState.previewItems : [];
    return true;
  }
  function save(){ try { mdmProductionSyncSave(); } catch {} }

  function localRecord(type,id){
    let records=[];
    try { records = mdmProductionSyncEvidenceRecords().concat(mdmProductionSyncTelemetryRecords()); } catch {}
    return records.find(r=>String(r?.entityType||'')===String(type||'') && String(r?.localId||'')===String(id||'')) || null;
  }
  function serverItem(type,id){
    if (!ensureState()) return null;
    return mdmProductionSyncState.previewItems.find(r=>String(r?.entityType||'')===String(type||'') && String(r?.localId||'')===String(id||'')) || null;
  }
  function summary(type,payload){
    const p = payload && typeof payload === 'object' ? payload : {};
    type = String(type||'');
    if(type==='driving_twin') return t(`${Array.isArray(p.patterns)?p.patterns.length:0} pattern · ${Number(p.evidencePoints)||0} evidenze`,`${Array.isArray(p.patterns)?p.patterns.length:0} patterns · ${Number(p.evidencePoints)||0} evidence points`,`${Array.isArray(p.patterns)?p.patterns.length:0} patterns · ${Number(p.evidencePoints)||0} punti ta’ evidenza`);
    if(type==='evidence_passport') return t(`${Number(p.evidenceCoverage)||0}% copertura · ${Number(p.totalAxes)||0} assi`,`${Number(p.evidenceCoverage)||0}% coverage · ${Number(p.totalAxes)||0} axes`,`${Number(p.evidenceCoverage)||0}% kopertura · ${Number(p.totalAxes)||0} assi`);
    if(type==='road_evidence') return `${String(p.status||'—')} · ${String(p.evaluation||'—')}`;
    if(type==='telemetry_session') return t(`${Number(p.gpsOriginalCount)||0} punti GPS · ${Array.isArray(p.events)?p.events.length:0} eventi`,`${Number(p.gpsOriginalCount)||0} GPS points · ${Array.isArray(p.events)?p.events.length:0} events`,`${Number(p.gpsOriginalCount)||0} punti GPS · ${Array.isArray(p.events)?p.events.length:0} avvenimenti`);
    if(type==='driving_event') return `${String(p.type||'—')} · ${String(p.confidence||'—')}`;
    return String(p.schema||type||'record');
  }
  function logResolution(action,type,id,serverVersion){
    if (!ensureState()) return;
    let device='';
    try { device = mdmProductionSyncDeviceId(); } catch {}
    mdmProductionSyncState.resolutionLog.unshift({action:String(action||''),entityType:String(type||''),localId:String(id||''),serverVersion:Number(serverVersion)||0,at:new Date().toISOString(),deviceId:device});
    mdmProductionSyncState.resolutionLog = mdmProductionSyncState.resolutionLog.slice(0,50);
  }

  async function refreshServer(){
    if (!ensureState()) return false;
    try {
      if (typeof mdmEnsureFreshAuthForData !== 'function' || !(await mdmEnsureFreshAuthForData())) return false;
      let result = await mdmDataRpc('mdm_production_list_own',{p_since:null,p_limit:200});
      if(result.status===401 && typeof mdmAuthSession!=='undefined' && mdmAuthSession.refreshToken && typeof mdmAuthRefreshSession==='function' && await mdmAuthRefreshSession()){
        result = await mdmDataRpc('mdm_production_list_own',{p_since:null,p_limit:200});
      }
      const data = (typeof mdmAuthParse==='function' ? mdmAuthParse(result.body) : null) || {};
      if(result.status<200 || result.status>=300 || data.ok===false) return false;
      const items = Array.isArray(data.items) ? data.items : [];
      const counts = {};
      items.forEach(item=>{
        const type=String(item?.entity_type||'unknown'); counts[type]=(counts[type]||0)+1;
        const k=key(type,item?.local_id||'');
        mdmProductionSyncState.serverVersions[k]=Math.max(0,Number(item?.server_version)||0);
      });
      mdmProductionSyncState.previewItems = items.slice(0,200).map(item=>({
        entityType:String(item?.entity_type||''), localId:String(item?.local_id||''),
        serverVersion:Number(item?.server_version)||0, updatedAt:String(item?.updated_at||''),
        deletedAt:String(item?.deleted_at||''), payload:item?.payload&&typeof item.payload==='object' ? JSON.parse(JSON.stringify(item.payload)) : {}
      }));
      mdmProductionSyncState.previewCounts = counts;
      mdmProductionSyncState.serverRecordCount = items.filter(x=>!x?.deleted_at).length;
      mdmProductionSyncState.lastPullAt = new Date().toISOString();
      save();
      return true;
    } catch { return false; }
  }

  function installQueueGuard(){
    if (baseQueue || typeof mdmProductionSyncQueueRecords !== 'function' || !ensureState()) return;
    baseQueue = mdmProductionSyncQueueRecords;
    mdmProductionSyncQueueRecords = function(records, options){
      const force = !!(options && options.force);
      const list = Array.isArray(records) ? records : [];
      const filtered = force ? list : list.filter(r=>!mdmProductionSyncState.serverProtected[key(r?.entityType,r?.localId)]);
      return baseQueue(filtered);
    };
  }

  async function resolveConflict(index,choice){
    if (!ensureState()) return false;
    const conflict = mdmProductionSyncState.conflicts[Number(index)];
    if(!conflict) return false;
    const type=String(conflict.entityType||''), id=String(conflict.localId||''), k=key(type,id);

    if(!(await refreshServer())){
      try { toast(t('Impossibile rileggere il server: conflitto non modificato.','Could not refresh the server: conflict left unchanged.','Ma setax jerġa’ jinqara s-server: il-kunflitt baqa’ kif kien.')); } catch {}
      return false;
    }
    const server=serverItem(type,id);
    if(!server){
      try { toast(t('Record server non trovato. Nessuna decisione applicata.','Server record not found. No decision was applied.','Ir-rekord tas-server ma nstabx. Ma ġiet applikata l-ebda deċiżjoni.')); } catch {}
      return false;
    }

    if(choice==='server'){
      mdmProductionSyncState.serverVersions[k]=Math.max(0,Number(server.serverVersion)||0);
      mdmProductionSyncState.serverProtected[k]={entityType:type,localId:id,serverVersion:Number(server.serverVersion)||0,updatedAt:String(server.updatedAt||''),protectedAt:new Date().toISOString()};
      mdmProductionSyncState.pending=mdmProductionSyncState.pending.filter(x=>key(x.entityType,x.localId)!==k);
      mdmProductionSyncState.conflicts=mdmProductionSyncState.conflicts.filter(x=>key(x.entityType,x.localId)!==k);
      logResolution('keep_server',type,id,server.serverVersion); save(); refreshUI();
      try { toast(t('Versione server mantenuta e protetta. La copia locale resta sul dispositivo ma non verrà inviata finché non la riabiliti.','Server version kept and protected. The local copy stays on this device but will not be uploaded until you re-enable it.','Il-verżjoni tas-server inżammet u ġiet protetta. Il-kopja lokali tibqa’ fuq dan l-apparat iżda ma tittellax sakemm terġa’ tattivaha.')); } catch {}
      return true;
    }

    if(choice==='local'){
      const local=localRecord(type,id);
      if(!local){ try { toast(t('Copia locale non disponibile: nessuna sovrascrittura eseguita.','Local copy is unavailable: no overwrite was performed.','Il-kopja lokali mhix disponibbli: ma sar l-ebda overwrite.')); } catch{} return false; }
      const ok = confirm(t(`Inviare la copia LOCALE di ${type}/${id} sopra la versione server v${Number(server.serverVersion)||0}? Questa scelta verrà verificata con una nuova lettura server.`,`Upload the LOCAL copy of ${type}/${id} over server version v${Number(server.serverVersion)||0}? This choice will be verified with a fresh server read.`,`Tella’ l-kopja LOKALI ta’ ${type}/${id} fuq il-verżjoni tas-server v${Number(server.serverVersion)||0}? Din l-għażla tiġi vverifikata b’qari ġdid tas-server.`));
      if(!ok) return false;
      mdmProductionSyncState.serverVersions[k]=Math.max(0,Number(server.serverVersion)||0);
      delete mdmProductionSyncState.serverProtected[k];
      mdmProductionSyncState.conflicts=mdmProductionSyncState.conflicts.filter(x=>key(x.entityType,x.localId)!==k);
      installQueueGuard();
      mdmProductionSyncQueueRecords([local],{force:true}); save();
      try { await mdmProductionSyncFlush({silent:true}); } catch {}
      const pulled=await refreshServer();
      const after=pulled?serverItem(type,id):null;
      const stillConflict=mdmProductionSyncState.conflicts.some(x=>key(x.entityType,x.localId)===k);
      if(after && !stillConflict && Number(after.serverVersion)>Number(server.serverVersion)){
        logResolution('use_local',type,id,after.serverVersion); save(); refreshUI();
        try { toast(t(`Copia locale verificata sul server: ${type}/${id} ora è v${Number(after.serverVersion)||0}.`,`Local copy verified on the server: ${type}/${id} is now v${Number(after.serverVersion)||0}.`,`Il-kopja lokali ġiet ivverifikata fuq is-server: ${type}/${id} issa hija v${Number(after.serverVersion)||0}.`)); } catch {}
        return true;
      }
      // Put the conflict back if independent verification did not prove success.
      if(!stillConflict){ mdmProductionSyncState.conflicts.unshift(conflict); mdmProductionSyncState.conflicts=mdmProductionSyncState.conflicts.slice(0,50); save(); }
      refreshUI();
      try { toast(t('Risoluzione locale non verificata. Il record non viene dichiarato risolto.','Local resolution was not verified. The record is not declared resolved.','Ir-riżoluzzjoni lokali ma ġietx ivverifikata. Ir-rekord ma jitqiesx solvut.')); } catch {}
      return false;
    }
    return false;
  }

  function unprotect(index){
    if (!ensureState()) return;
    const entries=Object.entries(mdmProductionSyncState.serverProtected||{}), entry=entries[Number(index)];
    if(!entry) return;
    const [k,row]=entry; delete mdmProductionSyncState.serverProtected[k];
    logResolution('re_enable_local',row?.entityType||'',row?.localId||'',row?.serverVersion||0); save(); refreshUI();
    try { toast(t('Sync locale riabilitato. Nessun dato è stato inviato.','Local sync re-enabled. No data was sent.','Is-sync lokali reġa’ ġie attivat. Ma ntbagħtet l-ebda dejta.')); } catch {}
  }

  function cardHtml(){
    if(!ensureState()) return '';
    const conflicts=mdmProductionSyncState.conflicts;
    const protectedEntries=Object.entries(mdmProductionSyncState.serverProtected||{});
    const conflictHtml=conflicts.map((c,i)=>{
      const local=localRecord(c.entityType,c.localId), server=serverItem(c.entityType,c.localId);
      return `<article class="locked" style="display:block"><div style="display:flex;gap:10px;align-items:flex-start"><span>⚠️</span><div style="min-width:0;flex:1"><strong>${h(c.entityType)} · ${h(c.localId)}</strong><small>${h(t(`Locale atteso v${Number(c.localExpected)||0} · Server v${Number(server?.serverVersion||c.serverVersion)||0}`,`Local expected v${Number(c.localExpected)||0} · Server v${Number(server?.serverVersion||c.serverVersion)||0}`,`Lokali mistenni v${Number(c.localExpected)||0} · Server v${Number(server?.serverVersion||c.serverVersion)||0}`))}</small><small>${h(t('Locale','Local','Lokali'))}: ${h(summary(c.entityType,local?.payload||{}))}</small><small>${h(t('Server','Server','Server'))}: ${h(server ? summary(c.entityType,server.payload||{}) : t('dettagli verificati al momento della scelta','details verified when you choose','id-dettalji jiġu vverifikati meta tagħżel'))}</small><div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:10px"><button class="btn secondary" data-mdm4582833-server="${i}">☁️ ${h(t('Mantieni server','Keep server','Żomm is-server'))}</button><button class="btn secondary" data-mdm4582833-local="${i}">📱 ${h(t('Invia locale','Use local','Uża lokali'))}</button></div></div></div></article>`;
    }).join('');
    const protectedHtml=protectedEntries.map(([k,row],i)=>`<article class="pass" style="display:block"><div style="display:flex;gap:10px;align-items:flex-start"><span>☁️</span><div style="min-width:0;flex:1"><strong>${h(row?.entityType||k)} · ${h(row?.localId||'')}</strong><small>${h(t(`Server protetto v${Number(row?.serverVersion)||0}; la copia locale non viene caricata automaticamente.`,`Protected server v${Number(row?.serverVersion)||0}; the local copy is not uploaded automatically.`,`Server protett v${Number(row?.serverVersion)||0}; il-kopja lokali ma tittellax awtomatikament.`))}</small><button class="btn secondary" style="margin-top:8px" data-mdm4582833-unprotect="${i}">↩ ${h(t('Riabilita sync locale','Re-enable local sync','Erġa’ attiva sync lokali'))}</button></div></div></article>`).join('');
    return `<section id="mdm4582833ConflictManager" class="card backend-real-gates" style="margin-top:14px"><div class="backend-real-head"><div><small>45.8.28.3 · MULTI-DEVICE CONFLICT RESOLUTION</small><h2>${h(t('Gestione controllata dei conflitti','Controlled conflict resolution','Riżoluzzjoni kkontrollata tal-kunflitti'))}</h2></div><span>🔀</span></div><p>${h(t('Nessun merge automatico: per ogni conflitto scegli esplicitamente quale versione mantenere.','No automatic merge: explicitly choose which version to keep for every conflict.','L-ebda merge awtomatiku: agħżel b’mod espliċitu liema verżjoni żżomm għal kull kunflitt.'))}</p><div class="backend-real-gate-list"><article class="${conflicts.length?'locked':'pass'}"><span>${conflicts.length?'⚠️':'✓'}</span><div><strong>${conflicts.length} ${h(t('conflitti da risolvere','conflicts to resolve','kunflitti biex jiġu solvuti'))}</strong><small>${h(t('Il server viene riletto prima di applicare ogni scelta.','The server is re-read before each choice is applied.','Is-server jerġa’ jinqara qabel kull għażla.'))}</small></div></article>${conflictHtml}</div>${protectedHtml?`<div class="backend-real-gate-list" style="margin-top:12px"><p style="margin:0 0 8px"><strong>${h(t('Record server protetti','Protected server records','Rekords tas-server protetti'))}</strong></p>${protectedHtml}</div>`:''}</section>`;
  }

  function tagBuild(){
    // Display-only update. Core 45.8.28.2 stays untouched underneath.
    try {
      document.querySelectorAll('.badge.official').forEach(el=>{
        if(String(el.textContent||'').includes('45.8.28.2')) el.textContent=String(el.textContent).replace(/45\.8\.28\.2/g,OVERLAY_BUILD);
      });
    } catch {}
  }

  function refreshUI(){
    if(!ensureState()) return;
    const pull=document.getElementById('productionSyncPull');
    const baseCard=pull && pull.closest ? pull.closest('section.card') : null;
    const old=document.getElementById('mdm4582833ConflictManager');
    if(!baseCard){ if(old) old.remove(); return; }
    const html=cardHtml();
    if(!html) return;
    const holder=document.createElement('div'); holder.innerHTML=html;
    const fresh=holder.firstElementChild;
    if(old) old.replaceWith(fresh); else baseCard.insertAdjacentElement('afterend',fresh);
    fresh.querySelectorAll('[data-mdm4582833-server]').forEach(btn=>btn.onclick=()=>resolveConflict(Number(btn.dataset.mdm4582833Server),'server'));
    fresh.querySelectorAll('[data-mdm4582833-local]').forEach(btn=>btn.onclick=()=>resolveConflict(Number(btn.dataset.mdm4582833Local),'local'));
    fresh.querySelectorAll('[data-mdm4582833-unprotect]').forEach(btn=>btn.onclick=()=>unprotect(Number(btn.dataset.mdm4582833Unprotect)));
    tagBuild();
  }

  function init(){
    if(initialized) return;
    if(typeof mdmProductionSyncState==='undefined' || typeof mdmProductionSyncQueueRecords!=='function'){
      setTimeout(init,400); return;
    }
    initialized=true;
    ensureState(); installQueueGuard(); save();
    observer=new MutationObserver(()=>{ clearTimeout(window.__mdm4582833_ui_timer); window.__mdm4582833_ui_timer=setTimeout(refreshUI,40); });
    observer.observe(document.body,{childList:true,subtree:true});
    refreshUI();
  }

  // Deliberately after startup. No render(), no route change, no startup interception.
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',()=>setTimeout(init,500),{once:true});
  else setTimeout(init,500);
})();
