
(function(){try{const raw=localStorage.getItem('mdm-v1-settings'),lang=raw?JSON.parse(raw).lang:'en',el=document.getElementById('mdmStartupSub');if(!el)return;el.textContent=lang==='it'?'Caricamento della tua intelligenza di guida…':lang==='mt'?'Qed titgħabba l-intelliġenza tas-sewqan tiegħek…':'Loading your driving intelligence…';}catch(_){}})();

/* 45.8.31.49.14 — School Admin Pilot UX.
   - real redeemed-invite queue
   - global school-admin activation alert
   - one tap jumps directly to the exact seat queue
   - no UUID/token copy-paste for seat assignment
   - one scoped #screen observer only; no polling */
window.addEventListener('load',function(){
  try{
    if(!window.MDM_PILOT_ACCESS_BRIDGE){const s=document.createElement('script');s.src='mdm-pilot-access-4583146.js?v=45831497';s.async=true;s.setAttribute('data-mdm-pilot-bridge','shadow');document.head.appendChild(s);}
    if(!window.MDM_PILOT_SCHOOL_DASHBOARD_BRIDGE){const school=document.createElement('script');school.src='mdm-pilot-school-dashboard-4583147.js?v=45831475-admin-alert';school.async=true;school.setAttribute('data-mdm-pilot-school-bridge','shadow');document.head.appendChild(school);}
    if(!window.MDM_PILOT_STUDENT_REDEEM_BRIDGE){const redeem=document.createElement('script');redeem.src='mdm-pilot-student-redeem-4583148.js?v=45831483-deterministic';redeem.async=true;redeem.setAttribute('data-mdm-pilot-student-redeem','shadow');document.head.appendChild(redeem);}
    if(!window.MDM_ACCOUNT_ENTRY_BRIDGE){const account=document.createElement('script');account.src='mdm-account-entry-4583149.js?v=45831496-direct';account.async=true;account.setAttribute('data-mdm-account-entry','quick');document.head.appendChild(account);}
    if(!window.MDM_PWA_REFRESH_FIX){const refresh=document.createElement('script');refresh.src='mdm-pwa-refresh-4583147.js?v=45831497';refresh.async=true;refresh.setAttribute('data-mdm-pwa-refresh-fix','targeted');document.head.appendChild(refresh);}

    const AUTH_KEY='mdm_auth_session_v4410';
    function lang3(it,en,mt){try{const raw=localStorage.getItem('mdm-v1-settings');const code=raw?String(JSON.parse(raw).lang||'en'):'en';return code==='it'?it:code==='mt'?mt:en;}catch(_){return en;}}
    function esc(value){return String(value??'').replace(/[&<>"']/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));}
    function readSession(){try{const raw=localStorage.getItem(AUTH_KEY);if(!raw)return null;const s=JSON.parse(raw);if(!s||s.status!=='authenticated'||!s.accessToken||!s.user?.id)return null;if(Number(s.expiresAt||0)>0&&Number(s.expiresAt)<=Date.now())return null;return s;}catch(_){return null;}}
    function findSchoolConsole(){const direct=document.querySelector('.account-enroll-card');if(direct)return direct;return Array.from(document.querySelectorAll('section,article,.card,div')).find(el=>/CONSOLE\s+SCUOLA\s+SERVER/i.test(String(el.innerText||'')))||null;}
    function isSchoolAdmin(host){if(!host)return false;const t=String(host.innerText||'').toLowerCase();return t.includes('school_admin')&&t.includes('active');}
    async function pilotRpc(name,payload){const cfg=window.MDM_BACKEND_CONFIG,session=readSession();if(!cfg||!cfg.enabled||!cfg.endpoint||!cfg.publishableKey)throw new Error('backend_config_unavailable');if(!session)throw new Error('authentication_required');const r=await fetch(String(cfg.endpoint).replace(/\/$/,'')+'/rest/v1/rpc/'+name,{method:'POST',headers:{'Content-Type':'application/json','apikey':cfg.publishableKey,'Authorization':'Bearer '+session.accessToken},body:JSON.stringify(payload||{}),cache:'no-store'});const text=await r.text();let data={};try{data=text?JSON.parse(text):{}}catch(_){}if(!r.ok)throw new Error(String(data?.message||data?.error||('http_'+r.status)));return data;}

    function removeAdminAlert(){document.getElementById('mdmSchoolActivationAlert')?.remove();}
    function findProfileButton(){
      const candidates=Array.from(document.querySelectorAll('#bottomNav button,#bottomNav [data-action],button[data-action]'));
      return candidates.find(el=>String(el.dataset?.action||'').toLowerCase()==='profile')||candidates.find(el=>/profilo|profile|profil/i.test(String(el.innerText||el.getAttribute('aria-label')||'')))||null;
    }
    function jumpToSeatQueue(){
      const profile=findProfileButton();if(profile)profile.click();
      const reveal=function(){try{window.MDM_PILOT_SCHOOL_DASHBOARD_BRIDGE?.mount?.();}catch(_){}try{renderSeatQueue();}catch(_){}const panel=document.getElementById('mdmPilotSeatAssignPanel');if(panel){panel.scrollIntoView({behavior:'smooth',block:'center'});panel.style.boxShadow='0 0 0 3px rgba(16,185,129,.28)';setTimeout(()=>{panel.style.boxShadow='';},1800);}};
      try{requestAnimationFrame(()=>requestAnimationFrame(reveal));}catch(_){}
      setTimeout(reveal,120);setTimeout(reveal,360);
    }
    function renderAdminAlert(rows){
      if(!Array.isArray(rows)||!rows.length){removeAdminAlert();return;}
      const app=document.getElementById('app'),screen=document.getElementById('screen');if(!app||!screen)return;
      let alert=document.getElementById('mdmSchoolActivationAlert');
      if(!alert){alert=document.createElement('button');alert.id='mdmSchoolActivationAlert';alert.type='button';alert.style.cssText='display:flex;width:calc(100% - 24px);margin:8px 12px 4px;box-sizing:border-box;align-items:center;justify-content:space-between;gap:10px;padding:12px 14px;border:1px solid rgba(245,158,11,.34);border-radius:14px;background:#fff7df;color:#3f2b00;font:inherit;text-align:left;box-shadow:0 8px 24px rgba(3,25,38,.10);cursor:pointer;z-index:35';app.insertBefore(alert,screen);alert.onclick=jumpToSeatQueue;}
      const n=rows.length;
      alert.innerHTML=`<span><strong>🔔 ${n} ${esc(n===1?lang3('studente da attivare','student to activate','student biex jiġi attivat'):lang3('studenti da attivare','students to activate','studenti biex jiġu attivati'))}</strong><small style="display:block;margin-top:3px;opacity:.72">${esc(lang3('Tocca per andare direttamente alla conferma','Tap to go directly to confirmation','Agħfas biex tmur direttament għall-konferma'))}</small></span><span style="font-size:22px;font-weight:900">›</span>`;
    }
    async function refreshAdminAlert(){
      if(!readSession()){removeAdminAlert();return;}
      try{let rows=await pilotRpc('mdm_school_list_redeemed_pilot_invitations',{});if(!Array.isArray(rows))rows=rows?[rows]:[];renderAdminAlert(rows);}catch(_){removeAdminAlert();}
    }

    let seatLoading=false;
    async function renderSeatQueue(){
      const host=findSchoolConsole();const old=document.getElementById('mdmPilotSeatAssignPanel');
      if(!host||!isSchoolAdmin(host)||!readSession()){if(old)old.remove();return false;}
      if(seatLoading)return true;seatLoading=true;
      try{
        let panel=old;if(!panel){panel=document.createElement('div');panel.id='mdmPilotSeatAssignPanel';panel.style.cssText='margin-top:12px;padding:14px;border:1px solid rgba(16,185,129,.28);border-radius:14px;background:rgba(16,185,129,.06)';host.appendChild(panel);}
        panel.innerHTML=`<strong>🎟️ ${esc(lang3('Studenti da attivare','Students to activate','Studenti biex jiġu attivati'))}</strong><p style="margin:6px 0 10px;opacity:.78;font-size:12px">${esc(lang3('Gli inviti riscattati compaiono qui automaticamente. Nessun ID da copiare.','Redeemed invitations appear here automatically. No ID to copy.','L-istediniet mifdija jidhru hawn awtomatikament. Ebda ID biex tikkopja.'))}</p><div id="mdmPilotSeatQueue">${esc(lang3('Caricamento…','Loading…','Qed jitgħabba…'))}</div>`;
        const queue=panel.querySelector('#mdmPilotSeatQueue');let rows=await pilotRpc('mdm_school_list_redeemed_pilot_invitations',{});if(!Array.isArray(rows))rows=rows?[rows]:[];renderAdminAlert(rows);
        if(!rows.length){queue.innerHTML=`<div style="padding:10px;border-radius:10px;background:rgba(0,0,0,.04)">✅ ${esc(lang3('Nessuno studente in attesa di seat','No student waiting for a seat','L-ebda student mistenni għal seat'))}</div>`;return true;}
        queue.innerHTML='';rows.forEach(row=>{const item=document.createElement('div');item.style.cssText='padding:11px;margin-top:8px;border:1px solid rgba(0,0,0,.10);border-radius:11px;background:var(--card,#fff)';const email=String(row.invite_email||lang3('Studente','Student','Student')),id=String(row.invitation_id||'');item.innerHTML=`<div style="font-weight:800;word-break:break-word">${esc(email)}</div><div style="font-size:12px;opacity:.72;margin-top:3px">${esc(lang3('Invito riscattato · seat non ancora attivo','Invitation redeemed · seat not active yet','Stedina mifdija · seat għadu mhux attiv'))}</div><button class="btn mdmPilotAutoAssignSeat" type="button" style="margin-top:9px;width:100%">${esc(lang3('Assegna seat','Assign seat','Assenja seat'))}</button><div class="mdmPilotAutoSeatResult" style="display:none;margin-top:8px;font-size:12px"></div>`;const btn=item.querySelector('.mdmPilotAutoAssignSeat'),result=item.querySelector('.mdmPilotAutoSeatResult');btn.onclick=async()=>{btn.disabled=true;result.style.display='block';result.textContent=lang3('Assegnazione seat in corso…','Assigning seat…','Qed jiġi assenjat is-seat…');try{let data=await pilotRpc('mdm_school_assign_pilot_seat',{p_invitation_id:id});if(Array.isArray(data))data=data[0]||{};if(data?.ok!==true)throw new Error(String(data?.error||'seat_assignment_failed'));result.textContent='✅ '+lang3('Seat Pilot assegnato','Pilot seat assigned','Seat Pilot assenjat');setTimeout(()=>{renderSeatQueue();refreshAdminAlert();},250);}catch(e){result.textContent='❌ '+String(e?.message||e||'seat_assignment_failed');btn.disabled=false;}};queue.appendChild(item);});return true;
      }catch(e){let panel=document.getElementById('mdmPilotSeatAssignPanel');if(panel)panel.innerHTML=`<strong>🎟️ ${esc(lang3('Studenti da attivare','Students to activate','Studenti biex jiġu attivati'))}</strong><div style="margin-top:8px;font-size:12px">❌ ${esc(String(e?.message||e||'seat_queue_failed'))}</div>`;return false;}finally{seatLoading=false;}
    }

    const screen=document.getElementById('screen');
    if(screen&&!window.__MDM_SCHOOL_INVITE_SCREEN_OBSERVER__){let raf=0;const syncSchoolPilot=function(){if(raf)return;raf=requestAnimationFrame(function(){raf=0;try{window.MDM_PILOT_SCHOOL_DASHBOARD_BRIDGE?.mount?.();}catch(_){}try{renderSeatQueue();}catch(_){}});};const observer=new MutationObserver(syncSchoolPilot);observer.observe(screen,{childList:true,subtree:true});window.__MDM_SCHOOL_INVITE_SCREEN_OBSERVER__=observer;syncSchoolPilot();}

    refreshAdminAlert();
    window.addEventListener('pageshow',refreshAdminAlert);
    document.addEventListener('visibilitychange',()=>{if(!document.hidden)refreshAdminAlert();});
  }catch(_){}
},{once:true});
