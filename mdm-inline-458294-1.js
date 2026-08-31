
(function(){try{const raw=localStorage.getItem('mdm-v1-settings'),lang=raw?JSON.parse(raw).lang:'en',el=document.getElementById('mdmStartupSub');if(!el)return;el.textContent=lang==='it'?'Caricamento della tua intelligenza di guida…':lang==='mt'?'Qed titgħabba l-intelliġenza tas-sewqan tiegħek…':'Loading your driving intelligence…';}catch(_){}})();

/* 45.8.31.49.12 — deterministic Pilot/account bridge loader.
   School invite + automatic redeemed-invite seat assignment synchronized with #screen.
   One scoped observer only; no global DOM observer and no polling. */
window.addEventListener('load',function(){
  try{
    if(!window.MDM_PILOT_ACCESS_BRIDGE){const s=document.createElement('script');s.src='mdm-pilot-access-4583146.js?v=45831497';s.async=true;s.setAttribute('data-mdm-pilot-bridge','shadow');document.head.appendChild(s);}
    if(!window.MDM_PILOT_SCHOOL_DASHBOARD_BRIDGE){const school=document.createElement('script');school.src='mdm-pilot-school-dashboard-4583147.js?v=45831474-route-lifecycle';school.async=true;school.setAttribute('data-mdm-pilot-school-bridge','shadow');document.head.appendChild(school);}
    if(!window.MDM_PILOT_STUDENT_REDEEM_BRIDGE){const redeem=document.createElement('script');redeem.src='mdm-pilot-student-redeem-4583148.js?v=45831483-deterministic';redeem.async=true;redeem.setAttribute('data-mdm-pilot-student-redeem','shadow');document.head.appendChild(redeem);}
    if(!window.MDM_ACCOUNT_ENTRY_BRIDGE){const account=document.createElement('script');account.src='mdm-account-entry-4583149.js?v=45831496-direct';account.async=true;account.setAttribute('data-mdm-account-entry','quick');document.head.appendChild(account);}
    if(!window.MDM_PWA_REFRESH_FIX){const refresh=document.createElement('script');refresh.src='mdm-pwa-refresh-4583147.js?v=45831497';refresh.async=true;refresh.setAttribute('data-mdm-pwa-refresh-fix','targeted');document.head.appendChild(refresh);}

    const AUTH_KEY='mdm_auth_session_v4410';
    function readSession(){try{const raw=localStorage.getItem(AUTH_KEY);if(!raw)return null;const s=JSON.parse(raw);if(!s||s.status!=='authenticated'||!s.accessToken||!s.user?.id)return null;if(Number(s.expiresAt||0)>0&&Number(s.expiresAt)<=Date.now())return null;return s;}catch(_){return null;}}
    function findSchoolConsole(){const direct=document.querySelector('.account-enroll-card');if(direct)return direct;return Array.from(document.querySelectorAll('section,article,.card,div')).find(el=>/CONSOLE\s+SCUOLA\s+SERVER/i.test(String(el.innerText||'')))||null;}
    function isSchoolAdmin(host){if(!host)return false;const t=String(host.innerText||'').toLowerCase();return t.includes('school_admin')&&t.includes('active');}
    async function pilotRpc(name,payload){const cfg=window.MDM_BACKEND_CONFIG,session=readSession();if(!cfg||!cfg.enabled||!cfg.endpoint||!cfg.publishableKey)throw new Error('backend_config_unavailable');if(!session)throw new Error('authentication_required');const r=await fetch(String(cfg.endpoint).replace(/\/$/,'')+'/rest/v1/rpc/'+name,{method:'POST',headers:{'Content-Type':'application/json','apikey':cfg.publishableKey,'Authorization':'Bearer '+session.accessToken},body:JSON.stringify(payload||{}),cache:'no-store'});const text=await r.text();let data={};try{data=text?JSON.parse(text):{}}catch(_){}if(!r.ok)throw new Error(String(data?.message||data?.error||('http_'+r.status)));return data;}

    let seatLoading=false;
    async function renderSeatQueue(){
      const host=findSchoolConsole();
      const old=document.getElementById('mdmPilotSeatAssignPanel');
      if(!host||!isSchoolAdmin(host)||!readSession()){if(old)old.remove();return false;}
      if(seatLoading)return true;
      seatLoading=true;
      try{
        let panel=old;
        if(!panel){panel=document.createElement('div');panel.id='mdmPilotSeatAssignPanel';panel.style.cssText='margin-top:12px;padding:14px;border:1px solid rgba(16,185,129,.28);border-radius:14px;background:rgba(16,185,129,.06)';host.appendChild(panel);}
        panel.innerHTML='<strong>🎟️ Studenti da attivare</strong><p style="margin:6px 0 10px;opacity:.78;font-size:12px">Gli inviti riscattati compaiono qui automaticamente. Nessun ID da copiare.</p><div id="mdmPilotSeatQueue">Caricamento…</div>';
        const queue=panel.querySelector('#mdmPilotSeatQueue');
        let rows=await pilotRpc('mdm_school_list_redeemed_pilot_invitations',{});
        if(!Array.isArray(rows))rows=rows?[rows]:[];
        if(!rows.length){queue.innerHTML='<div style="padding:10px;border-radius:10px;background:rgba(0,0,0,.04)">✅ Nessuno studente in attesa di seat</div>';return true;}
        queue.innerHTML='';
        rows.forEach(row=>{
          const item=document.createElement('div');item.style.cssText='padding:11px;margin-top:8px;border:1px solid rgba(0,0,0,.10);border-radius:11px;background:var(--card,#fff)';
          const email=String(row.invite_email||'Studente');
          const id=String(row.invitation_id||'');
          item.innerHTML='<div style="font-weight:800;word-break:break-word">'+email.replace(/[&<>"']/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]))+'</div><div style="font-size:12px;opacity:.72;margin-top:3px">Invito riscattato · seat non ancora attivo</div><button class="btn mdmPilotAutoAssignSeat" type="button" style="margin-top:9px;width:100%">Assegna seat</button><div class="mdmPilotAutoSeatResult" style="display:none;margin-top:8px;font-size:12px"></div>';
          const btn=item.querySelector('.mdmPilotAutoAssignSeat'),result=item.querySelector('.mdmPilotAutoSeatResult');
          btn.onclick=async()=>{btn.disabled=true;result.style.display='block';result.textContent='Assegnazione seat in corso…';try{const data=await pilotRpc('mdm_school_assign_pilot_seat',{p_invitation_id:id});const obj=Array.isArray(data)?(data[0]||{}):(data||{});if(obj?.ok!==true)throw new Error(String(obj?.error||'seat_assignment_failed'));result.textContent='✅ Seat Pilot assegnato';setTimeout(()=>renderSeatQueue(),250);}catch(e){result.textContent='❌ '+String(e?.message||e||'seat_assignment_failed');btn.disabled=false;}};
          queue.appendChild(item);
        });
        return true;
      }catch(e){
        let panel=document.getElementById('mdmPilotSeatAssignPanel');if(panel)panel.innerHTML='<strong>🎟️ Studenti da attivare</strong><div style="margin-top:8px;font-size:12px">❌ '+String(e?.message||e||'seat_queue_failed')+'</div>';
        return false;
      }finally{seatLoading=false;}
    }

    const screen=document.getElementById('screen');
    if(screen&&!window.__MDM_SCHOOL_INVITE_SCREEN_OBSERVER__){
      let raf=0;
      const syncSchoolPilot=function(){if(raf)return;raf=requestAnimationFrame(function(){raf=0;try{window.MDM_PILOT_SCHOOL_DASHBOARD_BRIDGE?.mount?.();}catch(_){}try{renderSeatQueue();}catch(_){}});};
      const observer=new MutationObserver(syncSchoolPilot);observer.observe(screen,{childList:true,subtree:true});window.__MDM_SCHOOL_INVITE_SCREEN_OBSERVER__=observer;syncSchoolPilot();
    }
  }catch(_){}
},{once:true});
