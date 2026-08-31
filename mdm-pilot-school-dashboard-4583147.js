/* Malta Driving Master 45.8.31.47.5 — School Admin Pilot lifecycle
   Single authoritative School bridge: real invite creation + automatic redeemed-invite seat queue.
   No UUID copy/paste. School scoped backend RPC. SHADOW / enforcement OFF. */
(function(){
  'use strict';
  if(window.MDM_PILOT_SCHOOL_DASHBOARD_BRIDGE)return;

  const AUTH_KEY='mdm_auth_session_v4410';
  const state={version:'45.8.31.47.5',mode:'shadow',enforcement:false,status:'ready',licenseId:'',lastInvitation:null,error:''};
  let queueLoading=false;

  function lang3(it,en,mt){try{const raw=localStorage.getItem('mdm-v1-settings');const code=raw?String(JSON.parse(raw).lang||'en'):'en';return code==='it'?it:code==='mt'?mt:en;}catch(_){return en;}}
  function esc(value){return String(value??'').replace(/[&<>"']/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot',"'":'&#39;'}[ch]));}
  function readSession(){try{const raw=localStorage.getItem(AUTH_KEY);if(!raw)return null;const s=JSON.parse(raw);if(!s||s.status!=='authenticated'||!s.accessToken||!s.user?.id)return null;if(Number(s.expiresAt||0)>0&&Number(s.expiresAt)<=Date.now())return null;return s;}catch(_){return null;}}
  async function rpc(name,payload){const cfg=window.MDM_BACKEND_CONFIG;const session=readSession();if(!cfg||!cfg.enabled||!cfg.endpoint||!cfg.publishableKey)throw new Error('backend_config_unavailable');if(!session)throw new Error('authentication_required');const response=await fetch(String(cfg.endpoint).replace(/\/$/,'')+'/rest/v1/rpc/'+name,{method:'POST',headers:{'Content-Type':'application/json','apikey':cfg.publishableKey,'Authorization':'Bearer '+session.accessToken},body:JSON.stringify(payload||{}),cache:'no-store'});const text=await response.text();let data={};try{data=text?JSON.parse(text):{}}catch(_){}if(!response.ok)throw new Error(String(data?.message||data?.error||('http_'+response.status)));return data;}

  function findSchoolConsole(){const direct=document.querySelector('.account-enroll-card');if(direct)return direct;return Array.from(document.querySelectorAll('section,article,.card,div')).find(el=>/CONSOLE\s+SCUOLA\s+SERVER/i.test(String(el.innerText||'')))||null;}
  function renderedSchoolAdmin(host){if(!host)return false;const text=String(host.innerText||'').toLowerCase();return text.includes('school_admin')&&text.includes('active');}
  function removePanels(){document.getElementById('mdmPilotRealInvitePanel')?.remove();document.getElementById('mdmPilotSeatAssignPanel')?.remove();}
  async function resolveSchoolLicense(host){if(!readSession())throw new Error('authentication_required');if(!renderedSchoolAdmin(host))throw new Error('not_school_admin');let data=await rpc('mdm_check_my_pilot_entitlement',{});if(Array.isArray(data))data=data[0]||{};if(data?.authorized===true&&data?.license_id){state.licenseId=String(data.license_id);return state.licenseId;}throw new Error(String(data?.reason||'no_active_pilot_license'));}

  function buildInvitePanel(host){
    let panel=document.getElementById('mdmPilotRealInvitePanel');
    if(panel&&panel.parentElement===host)return panel;
    if(panel)panel.remove();
    panel=document.createElement('div');panel.id='mdmPilotRealInvitePanel';panel.style.cssText='margin-top:14px;padding:14px;border:1px solid rgba(45,125,255,.22);border-radius:14px;background:rgba(45,125,255,.05)';
    panel.innerHTML=`<div style="display:flex;gap:10px;align-items:flex-start;justify-content:space-between;flex-wrap:wrap"><div><strong>🔐 ${esc(lang3('Invito Pilot reale','Real Pilot invitation','Stedina Pilot reali'))}</strong><p style="margin:6px 0 0;opacity:.78;font-size:12px">${esc(lang3('Crea un invito reale per uno studente. Il token viene mostrato una sola volta.','Create a real invitation for a learner. The token is shown once.','Oħloq stedina reali għal student. It-token jintwera darba biss.'))}</p></div><span style="font-size:10px;font-weight:800;padding:5px 8px;border-radius:999px;background:#132d46;color:#fff">SHADOW · ENFORCEMENT OFF</span></div><div style="display:grid;grid-template-columns:minmax(0,1fr) 110px;gap:8px;margin-top:12px"><input id="mdmPilotInviteEmail" type="email" maxlength="254" autocomplete="email" placeholder="student@example.com" style="min-width:0;padding:11px;border:1px solid rgba(0,0,0,.18);border-radius:10px;background:var(--card,#fff);color:inherit"><select id="mdmPilotInviteHours" style="padding:11px;border:1px solid rgba(0,0,0,.18);border-radius:10px;background:var(--card,#fff);color:inherit"><option value="24">24 h</option><option value="72" selected>72 h</option><option value="168">7 days</option></select></div><button id="mdmPilotCreateRealInvite" class="btn" type="button" style="margin-top:9px;width:100%">${esc(lang3('Crea invito Pilot','Create Pilot invitation','Oħloq stedina Pilot'))}</button><div id="mdmPilotInviteResult" style="display:none;margin-top:10px;padding:10px;border-radius:10px;background:rgba(0,0,0,.05);font-size:12px;word-break:break-word"></div>`;
    host.appendChild(panel);panel.querySelector('#mdmPilotCreateRealInvite').onclick=createInvitation;return panel;
  }

  function ensureQueuePanel(host){
    let panel=document.getElementById('mdmPilotSeatAssignPanel');
    if(panel&&panel.parentElement===host)return panel;
    if(panel)panel.remove();
    panel=document.createElement('div');panel.id='mdmPilotSeatAssignPanel';panel.style.cssText='margin-top:12px;padding:14px;border:1px solid rgba(16,185,129,.28);border-radius:14px;background:rgba(16,185,129,.06)';host.appendChild(panel);return panel;
  }

  async function refreshSeatQueue(host){
    if(queueLoading)return;
    const panel=ensureQueuePanel(host);queueLoading=true;
    panel.innerHTML=`<strong>🎟️ ${esc(lang3('Studenti da attivare','Students to activate','Studenti biex jiġu attivati'))}</strong><p style="margin:6px 0 10px;opacity:.78;font-size:12px">${esc(lang3('Gli inviti riscattati compaiono qui automaticamente. Nessun ID da copiare.','Redeemed invitations appear here automatically. No ID to copy.','L-istediniet mifdija jidhru hawn awtomatikament. Ebda ID biex tikkopja.'))}</p><div id="mdmPilotSeatQueue">${esc(lang3('Caricamento…','Loading…','Qed jitgħabba…'))}</div>`;
    try{
      let rows=await rpc('mdm_school_list_redeemed_pilot_invitations',{});if(!Array.isArray(rows))rows=rows?[rows]:[];
      const queue=panel.querySelector('#mdmPilotSeatQueue');if(!queue)return;
      if(!rows.length){queue.innerHTML=`<div style="padding:10px;border-radius:10px;background:rgba(0,0,0,.04)">✅ ${esc(lang3('Nessuno studente in attesa di seat','No student waiting for a seat','L-ebda student mistenni għal seat'))}</div>`;return;}
      queue.innerHTML='';
      rows.forEach(row=>{
        const id=String(row.invitation_id||''),email=String(row.invite_email||lang3('Studente','Student','Student'));
        const item=document.createElement('div');item.style.cssText='padding:11px;margin-top:8px;border:1px solid rgba(0,0,0,.10);border-radius:11px;background:var(--card,#fff)';
        item.innerHTML=`<div style="font-weight:800;word-break:break-word">${esc(email)}</div><div style="font-size:12px;opacity:.72;margin-top:3px">${esc(lang3('Invito riscattato · seat non ancora attivo','Invitation redeemed · seat not active yet','Stedina mifdija · seat għadu mhux attiv'))}</div><button class="btn mdmPilotAutoAssignSeat" type="button" style="margin-top:9px;width:100%">${esc(lang3('Assegna seat','Assign seat','Assenja seat'))}</button><div class="mdmPilotAutoSeatResult" style="display:none;margin-top:8px;font-size:12px"></div>`;
        const btn=item.querySelector('.mdmPilotAutoAssignSeat'),result=item.querySelector('.mdmPilotAutoSeatResult');
        btn.onclick=async()=>{btn.disabled=true;result.style.display='block';result.textContent=lang3('Assegnazione seat in corso…','Assigning seat…','Qed jiġi assenjat is-seat…');try{let data=await rpc('mdm_school_assign_pilot_seat',{p_invitation_id:id});if(Array.isArray(data))data=data[0]||{};if(data?.ok!==true)throw new Error(String(data?.error||'seat_assignment_failed'));result.textContent='✅ '+lang3('Seat Pilot assegnato','Pilot seat assigned','Seat Pilot assenjat');setTimeout(()=>refreshSeatQueue(host),250);}catch(e){result.textContent='❌ '+String(e?.message||e||'seat_assignment_failed');btn.disabled=false;}};
        queue.appendChild(item);
      });
    }catch(e){const queue=panel.querySelector('#mdmPilotSeatQueue');if(queue)queue.textContent='❌ '+String(e?.message||e||'seat_queue_failed');}
    finally{queueLoading=false;}
  }

  function mount(){const host=findSchoolConsole();if(!host||!renderedSchoolAdmin(host)||!readSession()){removePanels();return false;}buildInvitePanel(host);refreshSeatQueue(host);return true;}

  async function createInvitation(){
    const emailEl=document.getElementById('mdmPilotInviteEmail'),hoursEl=document.getElementById('mdmPilotInviteHours'),result=document.getElementById('mdmPilotInviteResult'),button=document.getElementById('mdmPilotCreateRealInvite');if(!emailEl||!result||!button)return;
    const email=String(emailEl.value||'').trim().toLowerCase();result.style.display='block';if(!/^\S+@\S+\.\S+$/.test(email)){result.textContent=lang3('Inserisci un’email valida.','Enter a valid email.','Daħħal email valida.');return;}
    button.disabled=true;result.textContent=lang3('Verifica licenza e creazione invito…','Checking licence and creating invitation…','Qed tiġi vverifikata l-liċenzja u tinħoloq l-istedina…');state.status='creating';state.error='';state.lastInvitation=null;
    try{const host=findSchoolConsole();const licenseId=await resolveSchoolLicense(host);const hours=Math.max(1,Math.min(168,Number(hoursEl?.value||72)||72));let data=await rpc('mdm_school_create_pilot_invitation',{p_license_id:licenseId,p_invite_email:email,p_valid_hours:hours});if(Array.isArray(data))data=data[0]||{};if(data?.ok!==true||!data?.invite_token)throw new Error(String(data?.error||'invite_creation_failed'));state.status='created';state.lastInvitation={invitationId:String(data.invitation_id||''),email:String(data.invite_email||email),expiresAt:String(data.expires_at||''),token:String(data.invite_token)};result.innerHTML=`<strong>✅ ${esc(lang3('Invito creato','Invitation created','Stedina maħluqa'))}</strong><br><br><b>Email:</b> ${esc(state.lastInvitation.email)}<br><b>${esc(lang3('Scadenza','Expires','Jiskadi'))}:</b> ${esc(state.lastInvitation.expiresAt||'—')}<br><br><b>${esc(lang3('Token monouso','One-time token','Token ta’ darba'))}:</b><br><code id="mdmPilotInviteRawToken">${esc(state.lastInvitation.token)}</code><br><br><button id="mdmPilotCopyInviteToken" class="btn secondary" type="button">⧉ ${esc(lang3('Copia token','Copy token','Ikkopja token'))}</button>`;const copy=result.querySelector('#mdmPilotCopyInviteToken');if(copy)copy.onclick=async()=>{try{await navigator.clipboard.writeText(state.lastInvitation.token);copy.textContent='✓ '+lang3('Copiato','Copied','Ikkupjat');}catch(_){copy.textContent=lang3('Copia manualmente','Copy manually','Ikkopja manwalment');}};
    }catch(e){state.status='error';state.error=String(e?.message||e||'invite_creation_failed');result.textContent='❌ '+state.error;}finally{button.disabled=false;}
  }

  function schedule(){try{queueMicrotask(mount);}catch(_){mount();}try{requestAnimationFrame(()=>requestAnimationFrame(mount));}catch(_){}setTimeout(mount,80);}
  function installHistoryLifecycleHook(){if(window.__MDM_PILOT_SCHOOL_HISTORY_HOOK__)return;window.__MDM_PILOT_SCHOOL_HISTORY_HOOK__=true;const push=history.pushState.bind(history),replace=history.replaceState.bind(history);history.pushState=function(){const out=push(...arguments);setTimeout(schedule,0);return out;};history.replaceState=function(){const out=replace(...arguments);setTimeout(schedule,0);return out;};window.addEventListener('popstate',()=>setTimeout(schedule,0));}
  const originalSetItem=Storage.prototype.setItem;if(!window.__MDM_PILOT_SCHOOL_INVITE_AUTH_HOOK__){window.__MDM_PILOT_SCHOOL_INVITE_AUTH_HOOK__=true;Storage.prototype.setItem=function(key,value){const out=originalSetItem.apply(this,arguments);if(this===localStorage&&String(key)===AUTH_KEY)setTimeout(schedule,0);return out;};}

  installHistoryLifecycleHook();document.addEventListener('click',()=>setTimeout(schedule,0),false);window.addEventListener('pageshow',schedule);window.addEventListener('load',schedule,{once:true});document.addEventListener('visibilitychange',()=>{if(!document.hidden)schedule();});
  window.MDM_PILOT_SCHOOL_DASHBOARD_BRIDGE=Object.freeze({version:'45.8.31.47.5',mode:'shadow',getState:()=>JSON.parse(JSON.stringify(state)),mount,refreshSeatQueue:()=>{const host=findSchoolConsole();if(host&&renderedSchoolAdmin(host))return refreshSeatQueue(host);}});
  schedule();
})();
