
(function(){try{const raw=localStorage.getItem('mdm-v1-settings'),lang=raw?JSON.parse(raw).lang:'en',el=document.getElementById('mdmStartupSub');if(!el)return;el.textContent=lang==='it'?'Caricamento della tua intelligenza di guida…':lang==='mt'?'Qed titgħabba l-intelliġenza tas-sewqan tiegħek…':'Loading your driving intelligence…';}catch(_){}})();

/* 45.8.31.49.11 — deterministic Pilot/account bridge loader.
   School invite + seat assignment synchronized with the real #screen render lifecycle.
   One scoped observer only; no global DOM observer and no polling. */
window.addEventListener('load',function(){
  try{
    if(!window.MDM_PILOT_ACCESS_BRIDGE){
      const s=document.createElement('script');
      s.src='mdm-pilot-access-4583146.js?v=45831497';
      s.async=true;
      s.setAttribute('data-mdm-pilot-bridge','shadow');
      document.head.appendChild(s);
    }

    if(!window.MDM_PILOT_SCHOOL_DASHBOARD_BRIDGE){
      const school=document.createElement('script');
      school.src='mdm-pilot-school-dashboard-4583147.js?v=45831474-route-lifecycle';
      school.async=true;
      school.setAttribute('data-mdm-pilot-school-bridge','shadow');
      document.head.appendChild(school);
    }

    if(!window.MDM_PILOT_STUDENT_REDEEM_BRIDGE){
      const redeem=document.createElement('script');
      redeem.src='mdm-pilot-student-redeem-4583148.js?v=45831483-deterministic';
      redeem.async=true;
      redeem.setAttribute('data-mdm-pilot-student-redeem','shadow');
      document.head.appendChild(redeem);
    }

    if(!window.MDM_ACCOUNT_ENTRY_BRIDGE){
      const account=document.createElement('script');
      account.src='mdm-account-entry-4583149.js?v=45831496-direct';
      account.async=true;
      account.setAttribute('data-mdm-account-entry','quick');
      document.head.appendChild(account);
    }

    if(!window.MDM_PWA_REFRESH_FIX){
      const refresh=document.createElement('script');
      refresh.src='mdm-pwa-refresh-4583147.js?v=45831497';
      refresh.async=true;
      refresh.setAttribute('data-mdm-pwa-refresh-fix','targeted');
      document.head.appendChild(refresh);
    }

    const AUTH_KEY='mdm_auth_session_v4410';
    function readSession(){
      try{
        const raw=localStorage.getItem(AUTH_KEY);if(!raw)return null;
        const s=JSON.parse(raw);
        if(!s||s.status!=='authenticated'||!s.accessToken||!s.user?.id)return null;
        if(Number(s.expiresAt||0)>0&&Number(s.expiresAt)<=Date.now())return null;
        return s;
      }catch(_){return null;}
    }
    function findSchoolConsole(){
      const direct=document.querySelector('.account-enroll-card');
      if(direct)return direct;
      return Array.from(document.querySelectorAll('section,article,.card,div')).find(el=>/CONSOLE\s+SCUOLA\s+SERVER/i.test(String(el.innerText||'')))||null;
    }
    function isSchoolAdmin(host){
      if(!host)return false;
      const t=String(host.innerText||'').toLowerCase();
      return t.includes('school_admin')&&t.includes('active');
    }
    async function pilotRpc(name,payload){
      const cfg=window.MDM_BACKEND_CONFIG,session=readSession();
      if(!cfg||!cfg.enabled||!cfg.endpoint||!cfg.publishableKey)throw new Error('backend_config_unavailable');
      if(!session)throw new Error('authentication_required');
      const r=await fetch(String(cfg.endpoint).replace(/\/$/,'')+'/rest/v1/rpc/'+name,{method:'POST',headers:{'Content-Type':'application/json','apikey':cfg.publishableKey,'Authorization':'Bearer '+session.accessToken},body:JSON.stringify(payload||{}),cache:'no-store'});
      const text=await r.text();let data={};try{data=text?JSON.parse(text):{}}catch(_){}if(Array.isArray(data))data=data[0]||{};
      if(!r.ok)throw new Error(String(data?.message||data?.error||('http_'+r.status)));
      return data||{};
    }
    function mountSeatControl(){
      const host=findSchoolConsole();
      const old=document.getElementById('mdmPilotSeatAssignPanel');
      if(!host||!isSchoolAdmin(host)||!readSession()){if(old)old.remove();return false;}
      if(old)return true;
      const panel=document.createElement('div');
      panel.id='mdmPilotSeatAssignPanel';
      panel.style.cssText='margin-top:12px;padding:14px;border:1px solid rgba(16,185,129,.28);border-radius:14px;background:rgba(16,185,129,.06)';
      panel.innerHTML='<strong>🎟️ Assegna seat Pilot</strong><p style="margin:6px 0 10px;opacity:.78;font-size:12px">Dopo che lo studente ha riscattato l’invito, inserisci qui l’ID invito e assegna il posto.</p><input id="mdmPilotSeatInvitationId" type="text" autocomplete="off" placeholder="ID invito riscattato" style="width:100%;box-sizing:border-box;padding:11px;border:1px solid rgba(0,0,0,.18);border-radius:10px;background:var(--card,#fff);color:inherit"><button id="mdmPilotAssignSeatBtn" class="btn" type="button" style="margin-top:9px;width:100%">Assegna seat allo studente</button><div id="mdmPilotSeatResult" style="display:none;margin-top:10px;padding:10px;border-radius:10px;background:rgba(0,0,0,.05);font-size:12px;word-break:break-word"></div>';
      host.appendChild(panel);
      const btn=panel.querySelector('#mdmPilotAssignSeatBtn');
      btn.onclick=async function(){
        const input=panel.querySelector('#mdmPilotSeatInvitationId'),result=panel.querySelector('#mdmPilotSeatResult');
        const invitationId=String(input?.value||'').trim();
        result.style.display='block';
        if(!/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(invitationId)){result.textContent='Inserisci un ID invito valido.';return;}
        btn.disabled=true;result.textContent='Assegnazione seat in corso…';
        try{
          const data=await pilotRpc('mdm_school_assign_pilot_seat',{p_invitation_id:invitationId});
          if(data?.ok!==true)throw new Error(String(data?.error||'seat_assignment_failed'));
          result.textContent='✅ Seat Pilot assegnato allo studente';
        }catch(e){result.textContent='❌ '+String(e?.message||e||'seat_assignment_failed');}
        finally{btn.disabled=false;}
      };
      return true;
    }

    const screen=document.getElementById('screen');
    if(screen&&!window.__MDM_SCHOOL_INVITE_SCREEN_OBSERVER__){
      let raf=0;
      const syncSchoolPilot=function(){
        if(raf)return;
        raf=requestAnimationFrame(function(){
          raf=0;
          try{window.MDM_PILOT_SCHOOL_DASHBOARD_BRIDGE?.mount?.();}catch(_){}
          try{mountSeatControl();}catch(_){}
        });
      };
      const observer=new MutationObserver(syncSchoolPilot);
      observer.observe(screen,{childList:true,subtree:true});
      window.__MDM_SCHOOL_INVITE_SCREEN_OBSERVER__=observer;
      syncSchoolPilot();
    }
  }catch(_){}
},{once:true});
