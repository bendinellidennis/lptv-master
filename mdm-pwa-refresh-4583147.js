/* Malta Driving Master 45.8.31.49.25 — persistent Home alert only for real pending students.
   Home alert no longer navigates through Profile.
   One tap opens the exact real seat-assignment queue as a focused modal over the current screen.
   SHADOW / enforcement unchanged. */
(function(){
  'use strict';
  const RELEASE='45.8.31.49.25';
  const AUTH_KEY='mdm_auth_session_v4410';
  let alertRequestSeq=0;
  let latestPendingRows=[];
  let latestPendingAt=0;

  function lang3(it,en,mt){try{const raw=localStorage.getItem('mdm-v1-settings');const code=raw?String(JSON.parse(raw).lang||'en'):'en';return code==='it'?it:code==='mt'?mt:en;}catch(_){return en;}}
  function esc(v){return String(v??'').replace(/[&<>"']/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));}
  function session(){try{const raw=localStorage.getItem(AUTH_KEY);if(!raw)return null;const s=JSON.parse(raw);if(!s||s.status!=='authenticated'||!s.accessToken||!s.user?.id)return null;if(Number(s.expiresAt||0)>0&&Number(s.expiresAt)<=Date.now())return null;return s;}catch(_){return null;}}
  async function rpc(name,payload){
    const cfg=window.MDM_BACKEND_CONFIG,s=session();
    if(!cfg||!cfg.enabled||!cfg.endpoint||!cfg.publishableKey)throw new Error('backend_config_unavailable');
    if(!s)throw new Error('authentication_required');
    const controller=new AbortController(),timer=setTimeout(()=>controller.abort(),8000);
    try{
      const r=await fetch(String(cfg.endpoint).replace(/\/$/,'')+'/rest/v1/rpc/'+name,{
        method:'POST',
        headers:{'Content-Type':'application/json','apikey':cfg.publishableKey,'Authorization':'Bearer '+s.accessToken},
        body:JSON.stringify(payload||{}),
        cache:'no-store',
        signal:controller.signal
      });
      const text=await r.text();let data={};try{data=text?JSON.parse(text):{}}catch(_){}
      if(!r.ok)throw new Error(String(data?.message||data?.error||('http_'+r.status)));
      return data;
    }catch(e){
      if(e?.name==='AbortError')throw new Error('request_timeout');
      throw e;
    }finally{clearTimeout(timer);}
  }

  async function hardRefresh(){try{const regs=await navigator.serviceWorker?.getRegistrations?.();if(Array.isArray(regs))await Promise.all(regs.map(async reg=>{try{await reg.update();}catch(_){}}));if(window.caches){const keys=await caches.keys();await Promise.all(keys.map(k=>caches.delete(k)));}}catch(_){}try{const url=new URL(location.href);url.searchParams.set('mdm_release',RELEASE.replace(/\./g,'_'));location.replace(url.toString());}catch(_){location.reload();}}
  function bindRefresh(){const btn=document.getElementById('refreshAppBtn');if(!btn||btn.dataset.mdmPwaRefresh==='1')return;btn.dataset.mdmPwaRefresh='1';btn.addEventListener('click',e=>{e.preventDefault();e.stopImmediatePropagation();hardRefresh();},true);}

  function removeAlert(){document.getElementById('mdmSchoolActivationAlert')?.remove();}
  function ensureAlert(){
    const app=document.getElementById('app'),screen=document.getElementById('screen');if(!app||!screen)return null;
    let el=document.getElementById('mdmSchoolActivationAlert');
    if(!el){
      el=document.createElement('button');el.id='mdmSchoolActivationAlert';el.type='button';
      el.style.cssText='display:flex;width:calc(100% - 24px);margin:8px 12px 4px;box-sizing:border-box;align-items:center;justify-content:space-between;gap:10px;padding:12px 14px;border:1px solid rgba(245,158,11,.40);border-radius:14px;background:#fff7df;color:#3f2b00;font:inherit;text-align:left;box-shadow:0 8px 24px rgba(3,25,38,.12);cursor:pointer;z-index:35';
      app.insertBefore(el,screen);
    }
    el.onclick=null;
    el.onclick=function(ev){try{ev?.preventDefault?.();ev?.stopPropagation?.();}catch(_){}openDirectQueue();};
    el.dataset.mdmSchoolAlertOwner=RELEASE;
    return el;
  }
  function showAlert(rows){latestPendingRows=Array.isArray(rows)?rows.slice():[];latestPendingAt=Date.now();if(!latestPendingRows.length){removeAlert();return;}const el=ensureAlert();if(!el)return;const n=latestPendingRows.length;el.innerHTML=`<span><strong>🔔 ${n} ${esc(n===1?lang3('studente da attivare','student to activate','student biex jiġi attivat'):lang3('studenti da attivare','students to activate','studenti biex jiġu attivati'))}</strong><small style="display:block;margin-top:3px;opacity:.72">${esc(lang3('Tocca: apri direttamente le richieste','Tap: open requests directly','Agħfas: iftaħ it-talbiet direttament'))}</small></span><span style="font-size:22px;font-weight:900">›</span>`;}


  function closeDirectQueue(){
    const overlay=document.getElementById('mdmDirectSeatQueueOverlay');
    if(overlay)overlay.remove();
    document.documentElement.style.overflow='';
    document.body.style.overflow='';
  }

  function ensureDirectQueue(){
    let overlay=document.getElementById('mdmDirectSeatQueueOverlay');
    if(overlay)return overlay;
    overlay=document.createElement('div');
    overlay.id='mdmDirectSeatQueueOverlay';
    overlay.style.cssText='position:fixed;inset:0;z-index:10000;background:rgba(4,21,34,.62);display:flex;align-items:flex-end;justify-content:center;padding:14px 12px calc(14px + env(safe-area-inset-bottom));box-sizing:border-box';
    overlay.innerHTML=`<section role="dialog" aria-modal="true" aria-labelledby="mdmDirectSeatQueueTitle" style="width:min(100%,560px);max-height:82vh;overflow:auto;background:var(--card,#fff);color:inherit;border-radius:22px 22px 18px 18px;padding:16px;box-sizing:border-box;box-shadow:0 24px 70px rgba(0,0,0,.34)">
      <div style="display:flex;align-items:center;justify-content:space-between;gap:12px;position:sticky;top:-16px;background:var(--card,#fff);padding:4px 0 10px;z-index:2">
        <div><small style="font-weight:900;letter-spacing:.07em;opacity:.68">${esc(lang3('CONSOLE SCUOLA','SCHOOL CONSOLE','KONSOLE SKOLA'))}</small><h2 id="mdmDirectSeatQueueTitle" style="margin:3px 0 0;font-size:22px">🎟️ ${esc(lang3('Studenti da attivare','Students to activate','Studenti biex jiġu attivati'))}</h2></div>
        <button id="mdmDirectSeatQueueClose" type="button" aria-label="${esc(lang3('Chiudi','Close','Agħlaq'))}" style="width:42px;height:42px;border:0;border-radius:999px;background:rgba(0,0,0,.08);font-size:24px;color:inherit">×</button>
      </div>
      <p style="margin:0 0 12px;opacity:.75;font-size:13px">${esc(lang3('Qui trovi direttamente gli studenti che hanno riscattato l’invito e aspettano l’attivazione.','Here are the students who redeemed their invitation and are waiting for activation.','Hawn issib direttament l-istudenti li fdew l-istedina u qed jistennew l-attivazzjoni.'))}</p>
      <div id="mdmDirectSeatQueueBody" style="min-height:70px">${esc(lang3('Caricamento richieste…','Loading requests…','Qed jitgħabbew it-talbiet…'))}</div>
    </section>`;
    document.body.appendChild(overlay);
    document.documentElement.style.overflow='hidden';document.body.style.overflow='hidden';
    overlay.querySelector('#mdmDirectSeatQueueClose').onclick=closeDirectQueue;
    overlay.addEventListener('click',e=>{if(e.target===overlay)closeDirectQueue();});
    return overlay;
  }

  async function loadDirectQueue(forceRefresh=false){
    const overlay=ensureDirectQueue(),body=overlay.querySelector('#mdmDirectSeatQueueBody');
    body.textContent=lang3('Caricamento richieste…','Loading requests…','Qed jitgħabbew it-talbiet…');
    try{
      let rows;
      if(!forceRefresh && latestPendingRows.length && (Date.now()-latestPendingAt)<30000){
        rows=latestPendingRows.slice();
      }else{
        rows=await rpc('mdm_school_list_redeemed_pilot_invitations',{});
        if(!Array.isArray(rows))rows=rows?[rows]:[];
        showAlert(rows);
      }
      if(!rows.length){
        body.innerHTML=`<div style="padding:14px;border-radius:14px;background:rgba(16,185,129,.08)">✅ ${esc(lang3('Nessuno studente in attesa di attivazione.','No student is waiting for activation.','L-ebda student mhu qed jistenna l-attivazzjoni.'))}</div>`;
        return;
      }
      body.innerHTML='';
      rows.forEach(row=>{
        const id=String(row.invitation_id||''),email=String(row.invite_email||lang3('Studente','Student','Student'));
        const item=document.createElement('article');
        item.style.cssText='padding:14px;margin-top:10px;border:1px solid rgba(16,185,129,.24);border-radius:16px;background:rgba(16,185,129,.055)';
        item.innerHTML=`<div style="font-weight:900;font-size:16px;word-break:break-word">${esc(email)}</div><div style="font-size:12px;opacity:.72;margin-top:4px">${esc(lang3('Invito riscattato · attivazione richiesta','Invitation redeemed · activation required','Stedina mifdija · attivazzjoni meħtieġa'))}</div><button class="btn mdmDirectAssignSeat" type="button" style="margin-top:11px;width:100%">${esc(lang3('Attiva studente','Activate student','Attiva student'))}</button><div class="mdmDirectAssignResult" style="display:none;margin-top:9px;font-size:13px;font-weight:700"></div>`;
        const btn=item.querySelector('.mdmDirectAssignSeat'),result=item.querySelector('.mdmDirectAssignResult');
        btn.onclick=async()=>{
          btn.disabled=true;result.style.display='block';result.textContent=lang3('Attivazione in corso…','Activating…','Qed jiġi attivat…');
          try{
            let data=await rpc('mdm_school_assign_pilot_seat',{p_invitation_id:id});if(Array.isArray(data))data=data[0]||{};
            if(data?.ok!==true)throw new Error(String(data?.error||'seat_assignment_failed'));
            result.textContent='✅ '+lang3('Studente attivato','Student activated','Student attivat');
            setTimeout(async()=>{latestPendingRows=[];latestPendingAt=0;await refreshAlert();await loadDirectQueue(true);},300);
          }catch(e){result.textContent='❌ '+String(e?.message||e||'seat_assignment_failed');btn.disabled=false;}
        };
        body.appendChild(item);
      });
    }catch(e){
      body.innerHTML=`<div style="padding:14px;border-radius:14px;background:rgba(220,38,38,.08)">❌ ${esc(String(e?.message||e||'seat_queue_failed'))}<br><button id="mdmDirectQueueRetry" class="btn secondary" type="button" style="margin-top:10px;width:100%">${esc(lang3('Riprova','Retry','Erġa pprova'))}</button></div>`;
      body.querySelector('#mdmDirectQueueRetry')?.addEventListener('click',loadDirectQueue);
    }
  }

  function openDirectQueue(){
    ensureDirectQueue();
    loadDirectQueue(false);
  }

  async function refreshAlert(){
    const s=session();if(!s){removeAlert();return;}
    const seq=++alertRequestSeq;
    const pendingTimer=setTimeout(()=>{if(seq===alertRequestSeq)showCheckingAlert();},350);
    try{
      let rows=await rpc('mdm_school_list_redeemed_pilot_invitations',{});
      clearTimeout(pendingTimer);if(seq!==alertRequestSeq)return;
      if(!Array.isArray(rows))rows=rows?[rows]:[];
      showAlert(rows);
    }catch(_){clearTimeout(pendingTimer);if(seq===alertRequestSeq)removeAlert();}
  }

  function boot(){bindRefresh();refreshAlert();}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
  window.addEventListener('pageshow',refreshAlert);
  document.addEventListener('visibilitychange',()=>{if(!document.hidden)refreshAlert();});
  window.MDM_PWA_REFRESH_FIX=Object.freeze({version:RELEASE,mode:'targeted',bind:bindRefresh,refreshSchoolAlert:refreshAlert,openSchoolActivationQueue:openDirectQueue});
})();
