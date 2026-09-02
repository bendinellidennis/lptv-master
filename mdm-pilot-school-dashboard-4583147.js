/* Malta Driving Master 45.8.31.47.8 — Pilot Invite Email + Deep Link
   Single production-style flow:
   School Admin -> create real Pilot invitation -> Supabase Auth sends email -> student taps link ->
   MDM captures/authenticates the magic-link session -> invitation auto-redeems -> school activation alert.
   No manual token is required in the normal path. Raw token is shown only as fallback if email delivery fails.
   Student activation queue is NOT rendered here; Home alert/direct modal remain owned by mdm-pwa-refresh.
   SHADOW / enforcement OFF. */
(function(){
  'use strict';
  if(window.MDM_PILOT_SCHOOL_DASHBOARD_BRIDGE)return;

  const AUTH_KEY='mdm_auth_session_v4410';
  const PENDING_KEY='mdm_pilot_pending_invite_v1';
  const VERSION='45.8.31.50.68.1';
  const APP_URL='https://bendinellidennis.github.io/lptv-master/';
  const state={version:VERSION,mode:'enforced',enforcement:true,status:'ready',licenseId:'',lastInvitation:null,error:'',emailDelivery:'',activationQueue:[]};
  let activationRefreshInFlight=null;
  let activationQueueLoaded=false;

  function lang3(it,en,mt){try{const raw=localStorage.getItem('mdm-v1-settings');const code=raw?String(JSON.parse(raw).lang||'en'):'en';return code==='it'?it:code==='mt'?mt:en;}catch(_){return en;}}
  function esc(value){return String(value??'').replace(/[&<>"']/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));}
  function normalizeEmail(value){return String(value||'').trim().replace(/^mailto:\s*/i,'').trim().toLowerCase();}
  function cfg(){const c=window.MDM_BACKEND_CONFIG;if(!c||!c.enabled||!c.endpoint||!c.publishableKey)throw new Error('backend_config_unavailable');return {endpoint:String(c.endpoint).replace(/\/$/,''),key:String(c.publishableKey)};}
  function readSession(){try{const raw=localStorage.getItem(AUTH_KEY);if(!raw)return null;const s=JSON.parse(raw);if(!s||s.status!=='authenticated'||!s.accessToken||!s.user?.id)return null;if(Number(s.expiresAt||0)>0&&Number(s.expiresAt)<=Date.now())return null;return s;}catch(_){return null;}}
  async function rpc(name,payload){const c=cfg(),session=readSession();if(!session)throw new Error('authentication_required');const response=await fetch(c.endpoint+'/rest/v1/rpc/'+name,{method:'POST',headers:{'Content-Type':'application/json','apikey':c.key,'Authorization':'Bearer '+session.accessToken},body:JSON.stringify(payload||{}),cache:'no-store'});const text=await response.text();let data={};try{data=text?JSON.parse(text):{}}catch(_){}if(Array.isArray(data))data=data[0]||{};if(!response.ok)throw new Error(String(data?.message||data?.error||('http_'+response.status)));return data||{};}

  function savePending(token,email){try{localStorage.setItem(PENDING_KEY,JSON.stringify({token:String(token||''),email:normalizeEmail(email),at:Date.now()}));}catch(_){}}
  function readPending(){try{const raw=localStorage.getItem(PENDING_KEY);if(!raw)return null;const p=JSON.parse(raw);if(!p||String(p.token||'').length<32||Date.now()-Number(p.at||0)>7*24*60*60*1000){localStorage.removeItem(PENDING_KEY);return null;}return p;}catch(_){return null;}}
  function clearPending(){try{localStorage.removeItem(PENDING_KEY);}catch(_){}}
  function jwtExpired(token){
    try{
      const body=String(token||'').split('.')[1]||'';
      const json=JSON.parse(atob(body.replace(/-/g,'+').replace(/_/g,'/')));
      return Number(json?.exp||0)>0 && Number(json.exp)*1000<=Date.now();
    }catch(_){return false;}
  }
  function syncInviteLoginEmail(){
    const p=readPending(); if(!p)return;
    const input=document.getElementById('mdmAuthEmail');
    if(!input)return;

    const token=String(p.token||'');
    const marker='mdm_invite_email_blank_once_v1::'+token.slice(0,24);
    let already=false;
    try{already=sessionStorage.getItem(marker)==='1';}catch(_){}
    if(already)return;

    input.value='';
    try{input.dispatchEvent(new Event('input',{bubbles:true}));}catch(_){}
    try{input.dispatchEvent(new Event('change',{bubbles:true}));}catch(_){}
    try{sessionStorage.setItem(marker,'1');}catch(_){}
  }

  function captureInviteFromUrl(){
    try{
      const url=new URL(location.href);
      const token=String(url.searchParams.get('pilot_invite')||'').trim();
      const email=normalizeEmail(url.searchParams.get('pilot_email')||'');
      if(token.length>=32&&token.length<=256){
        savePending(token,email);
        url.searchParams.delete('pilot_invite');url.searchParams.delete('pilot_email');
        history.replaceState(history.state,'',url.pathname+url.search+url.hash);
      }
    }catch(_){}
  }

  async function adoptMagicLinkSession(){
    try{
      if(window.__MDM_PASSWORD_RECOVERY_IN_PROGRESS__)return false;
      const hash=String(location.hash||'').replace(/^#/,'');if(!hash)return false;
      const p=new URLSearchParams(hash);
      const accessToken=String(p.get('access_token')||'');
      const refreshToken=String(p.get('refresh_token')||'');
      if(!accessToken||!refreshToken)return false;
      if(jwtExpired(accessToken)){
        const url=new URL(location.href);url.hash='';history.replaceState(history.state,'',url.pathname+url.search);
        showStudentNotice(lang3('Link di accesso scaduto. L’invito resta valido: inserisci la tua e-mail e la password.','Sign-in link expired. The invitation is still valid: enter your email and password.','Il-link tad-dħul skada. L-istedina għadha valida: idħol bl-email mistiedna u l-password tiegħek.'),false);
        syncInviteLoginEmail();
        return false;
      }
      const c=cfg();
      const userRes=await fetch(c.endpoint+'/auth/v1/user',{headers:{'apikey':c.key,'Authorization':'Bearer '+accessToken},cache:'no-store'});
      if(!userRes.ok){
        const url=new URL(location.href);url.hash='';history.replaceState(history.state,'',url.pathname+url.search);
        showStudentNotice(lang3('Il link di accesso non è più valido. Accedi normalmente: l’invito è stato conservato.','The sign-in link is no longer valid. Sign in normally: the invitation has been preserved.','Il-link tad-dħul m’għadux validu. Idħol normalment: l-istedina nżammet.'),false);
        syncInviteLoginEmail();
        return false;
      }
      const user=await userRes.json();
      const expiresIn=Math.max(60,Number(p.get('expires_in')||3600)||3600);
      const session={
        status:'authenticated',
        accessToken,
        refreshToken,
        tokenType:String(p.get('token_type')||'bearer'),
        expiresAt:Date.now()+expiresIn*1000,
        user,
        source:'pilot_magic_link'
      };
      localStorage.setItem(AUTH_KEY,JSON.stringify(session));
      const url=new URL(location.href);url.hash='';history.replaceState(history.state,'',url.pathname+url.search);
      return true;
    }catch(_){return false;}
  }

  function showStudentNotice(text,ok=true){
    try{
      let el=document.getElementById('mdmPilotInviteLandingNotice');
      if(!el){el=document.createElement('div');el.id='mdmPilotInviteLandingNotice';el.style.cssText='position:fixed;left:12px;right:12px;top:86px;z-index:999990;padding:13px 15px;border-radius:14px;background:#fff;color:#123548;box-shadow:0 12px 34px rgba(3,25,38,.25);font-weight:800;font-size:14px';document.body.appendChild(el);}
      el.textContent=(ok?'✅ ':'⚠️ ')+text;setTimeout(()=>{try{el.remove();}catch(_){}},6000);
    }catch(_){}
  }

  async function autoRedeemPending(){
    const pending=readPending(),session=readSession();if(!pending||!session)return false;
    const sessionEmail=normalizeEmail(session.user?.email||'');
    if(pending.email&&sessionEmail&&pending.email!==sessionEmail){
      showStudentNotice(lang3('Questo invito appartiene a un’altra email.','This invitation belongs to another email.','Din l-istedina tappartjeni għal email oħra.'),false);return false;
    }
    try{
      const data=await rpc('mdm_redeem_pilot_invitation',{p_invite_token:pending.token});
      if(data?.ok===true&&data?.redeemed===true){
        clearPending();
        showStudentNotice(lang3('Invito scuola accettato. Ora la scuola deve attivare il tuo posto.','School invitation accepted. The school now needs to activate your seat.','L-istedina tal-iskola ġiet aċċettata. Issa l-iskola trid tattiva s-seat tiegħek.'));
        try{window.MDM_PILOT_ACCESS_BRIDGE?.check?.();}catch(_){}
        return true;
      }
      if(String(data?.error||'')==='invitation_not_pending'&&String(data?.status||'')==='redeemed'){
        clearPending();return true;
      }
      throw new Error(String(data?.error||'redeem_failed'));
    }catch(e){
      state.error=String(e?.message||e||'redeem_failed');return false;
    }
  }

  async function processInboundInvite(){
    captureInviteFromUrl();
    await adoptMagicLinkSession();
    syncInviteLoginEmail();
    await autoRedeemPending();
    syncInviteLoginEmail();
  }

  async function sendInvitationEmail(email,token,invitationId){
    const c=cfg();
    const redirect=new URL(APP_URL);
    redirect.searchParams.set('pilot_invite',token);
    redirect.searchParams.set('pilot_email',email);
    const endpoint=c.endpoint+'/auth/v1/otp?redirect_to='+encodeURIComponent(redirect.toString());
    const response=await fetch(endpoint,{
      method:'POST',
      headers:{'Content-Type':'application/json','apikey':c.key,'Authorization':'Bearer '+c.key},
      body:JSON.stringify({
        email,
        data:{mdm_pilot_invite:true,mdm_pilot_invitation_id:String(invitationId||'')},
        create_user:true,
        gotrue_meta_security:{captcha_token:null}
      }),
      cache:'no-store'
    });
    if(!response.ok){
      let data={};try{data=await response.json();}catch(_){}
      throw new Error(String(data?.msg||data?.message||data?.error_description||data?.error||('email_http_'+response.status)));
    }
    return true;
  }

  function isTechnicalOwner(){const s=readSession();return normalizeEmail(s?.user?.email||s?.email||'')==='maltadrivingmaster@gmail.com';}
  function findSchoolConsole(){
    const home=document.querySelector('.sch35');
    if(home&&isTechnicalOwner())return home;
    const direct=document.querySelector('.account-enroll-card');
    if(direct)return direct;
    return Array.from(document.querySelectorAll('section,article,.card,div')).find(el=>/CONSOLE\s+SCUOLA\s+SERVER/i.test(String(el.innerText||'')))||null;
  }
  function renderedSchoolAdmin(host){
    if(!host)return false;
    if(host.classList?.contains('sch35')&&isTechnicalOwner())return true;
    const text=String(host.innerText||'').toLowerCase();
    return text.includes('school_admin')&&text.includes('active');
  }
  function removeLegacySeatQueue(){try{document.getElementById('mdmPilotSeatAssignPanel')?.remove();}catch(_){}}
  function removePanel(){document.getElementById('mdmPilotRealInvitePanel')?.remove();removeActivationPanel();removeLegacySeatQueue();}
  async function resolveSchoolLicense(host){
    if(!readSession())throw new Error('authentication_required');
    const data=await rpc('mdm_school_get_pilot_license',{});
    if(data?.authorized===true&&data?.license_found===true&&data?.license_id){
      state.licenseId=String(data.license_id);
      return state.licenseId;
    }
    throw new Error(String(data?.reason||(data?.license_found===false?'no_active_school_pilot_license':'pilot_license_lookup_failed')));
  }

  function activationPanel(){return document.getElementById('mdmPilotActivationQueuePanel');}
  function removeActivationPanel(){try{activationPanel()?.remove();}catch(_){}}

  async function refreshActivationQueue(){
    if(activationRefreshInFlight)return activationRefreshInFlight;
    activationRefreshInFlight=refreshActivationQueueOnce();
    try{return await activationRefreshInFlight;}finally{activationRefreshInFlight=null;}
  }

  async function refreshActivationQueueOnce(){
    const panel=activationPanel();
    if(!panel)return false;
    const body=panel.querySelector('#mdmPilotActivationQueueBody');
    if(!body)return false;
    body.innerHTML='<div style="opacity:.7;font-size:12px">Aggiornamento…</div>';
    try{
      const data=await rpc('mdm_school_list_pilot_activation_queue',{});
      if(data?.authorized!==true)throw new Error('school_admin_required');
      const items=Array.isArray(data?.items)?data.items:[];
      state.activationQueue=items;
      activationQueueLoaded=true;
      if(!items.length){
        body.innerHTML='<div style="opacity:.72;font-size:12px">Nessun invito riscattato in attesa.</div>';
        return true;
      }
      body.innerHTML=items.map(item=>{
        const assigned=item?.seat_assigned===true;
        const revoked=String(item?.seat_status||'')==='revoked';
        const email=esc(item?.invite_email||'—');
        const id=esc(item?.invitation_id||'');
        const status=assigned?lang3('ACCESSO ATTIVO','ACCESS ACTIVE','AĊĊESS ATTIV'):revoked?lang3('ACCESSO REVOCATO','ACCESS REVOKED','AĊĊESS REVOKAT'):lang3('INVITO RISCATTATO · DA ATTIVARE','INVITATION REDEEMED · TO ACTIVATE','STEDINA UŻATA · BIEX TIĠI ATTIVATA');
        const action=assigned?lang3('Revoca accesso','Revoke access','Irrevoka l-aċċess'):revoked?lang3('Riattiva accesso','Reactivate access','Erġa’ attiva l-aċċess'):lang3('Attiva posto','Activate seat','Attiva l-post');
        return '<div style="display:grid;grid-template-columns:minmax(0,1fr) auto;gap:10px;align-items:center;padding:10px 0;border-top:1px solid rgba(0,0,0,.08)"><div><strong style="font-size:12px">'+email+'</strong><div style="font-size:10px;opacity:.68;margin-top:3px">'+esc(status)+'</div></div>'+(assigned?'<button class="btn secondary mdmPilotRevokeSeat" type="button" data-invitation-id="'+id+'" style="padding:8px 10px;min-height:34px;color:#a33">'+esc(action)+'</button>':'<button class="btn mdmPilotAssignSeat" type="button" data-invitation-id="'+id+'" style="padding:8px 10px;min-height:34px">'+esc(action)+'</button>')+'</div>';
      }).join('');
      body.querySelectorAll('.mdmPilotAssignSeat').forEach(btn=>{
        btn.onclick=()=>assignSeat(String(btn.dataset.invitationId||''),btn);
      });
      body.querySelectorAll('.mdmPilotRevokeSeat').forEach(btn=>{
        btn.onclick=()=>revokeSeat(String(btn.dataset.invitationId||''),btn);
      });
      return true;
    }catch(e){
      body.innerHTML='<div style="font-size:12px;color:#a33">❌ '+esc(String(e?.message||e||'activation_queue_failed'))+'</div>';
      return false;
    }
  }

  async function assignSeat(invitationId,button){
    if(!invitationId)return;
    if(button)button.disabled=true;
    try{
      const data=await rpc('mdm_school_assign_pilot_seat',{p_invitation_id:invitationId});
      if(data?.ok!==true||data?.assigned!==true)throw new Error(String(data?.error||'seat_assignment_failed'));
      await refreshActivationQueue();
    }catch(e){
      if(button){button.disabled=false;button.textContent='Errore';}
      state.error=String(e?.message||e||'seat_assignment_failed');
    }
  }

  async function revokeSeat(invitationId,button){
    if(!invitationId)return;
    const confirmed=window.confirm(lang3('Revocare temporaneamente l\u2019accesso Pilot? Account, profilo e progressi resteranno intatti.','Temporarily revoke Pilot access? Account, profile and progress will remain intact.','Tirrevoke temporanjament l-aċċess Pilot? Il-kont, il-profil u l-progress jibqgħu intatti.'));
    if(!confirmed)return;
    if(button)button.disabled=true;
    try{
      const data=await rpc('mdm_school_revoke_pilot_seat',{p_invitation_id:invitationId});
      if(data?.ok!==true||data?.revoked!==true)throw new Error(String(data?.error||'seat_revocation_failed'));
      await refreshActivationQueue();
    }catch(e){
      if(button){button.disabled=false;button.textContent='Errore';}
      state.error=String(e?.message||e||'seat_revocation_failed');
    }
  }

  function buildActivationPanel(host){
    let panel=activationPanel();
    if(panel&&panel.parentElement===host){if(!activationQueueLoaded)refreshActivationQueue();return panel;}
    if(panel)panel.remove();
    panel=document.createElement('div');
    panel.id='mdmPilotActivationQueuePanel';
    panel.style.cssText='margin-top:14px;padding:14px;border:1px solid rgba(22,129,95,.22);border-radius:14px;background:rgba(22,129,95,.05)';
    panel.innerHTML='<div style="display:flex;align-items:center;justify-content:space-between;gap:10px"><div><strong>✅ '+esc(lang3('Gestione accessi Pilot','Pilot access management','Ġestjoni tal-aċċess Pilot'))+'</strong><p style="margin:5px 0 0;opacity:.74;font-size:11px">'+esc(lang3('Attiva, revoca o riattiva l’accesso senza eliminare account e progressi.','Activate, revoke or reactivate access without deleting accounts or progress.','Attiva, irrevoka jew erġa’ attiva l-aċċess mingħajr ma tħassar kontijiet jew progress.'))+'</p></div><button id="mdmPilotRefreshActivationQueue" class="btn secondary" type="button" style="padding:8px 10px">'+esc(lang3('Aggiorna','Refresh','Aġġorna'))+'</button></div><div id="mdmPilotActivationQueueBody" style="margin-top:10px"></div>';
    const invite=document.getElementById('mdmPilotRealInvitePanel');
    if(host.classList?.contains('sch35')&&invite&&invite.parentNode===host)invite.insertAdjacentElement('afterend',panel);
    else host.appendChild(panel);
    panel.querySelector('#mdmPilotRefreshActivationQueue').onclick=refreshActivationQueue;
    refreshActivationQueue();
    return panel;
  }

  function buildInvitePanel(host){
    removeLegacySeatQueue();
    let panel=document.getElementById('mdmPilotRealInvitePanel');
    if(panel&&panel.parentElement===host)return panel;
    if(panel)panel.remove();
    panel=document.createElement('div');panel.id='mdmPilotRealInvitePanel';panel.style.cssText='margin-top:14px;padding:14px;border:1px solid rgba(45,125,255,.22);border-radius:14px;background:rgba(45,125,255,.05)';
    panel.innerHTML=`<div style="display:flex;gap:10px;align-items:flex-start;justify-content:space-between;flex-wrap:wrap"><div><strong>✉️ ${esc(lang3('Invita studente Pilot','Invite Pilot student','Stieden student Pilot'))}</strong><p style="margin:6px 0 0;opacity:.78;font-size:12px">${esc(lang3('Inserisci l’email: MDM invia automaticamente il link allo studente.','Enter the email: MDM automatically sends the link to the student.','Daħħal l-email: MDM jibgħat il-link awtomatikament lill-istudent.'))}</p></div><span style="font-size:10px;font-weight:800;padding:5px 8px;border-radius:999px;background:#16815f;color:#fff">${esc(lang3('ACCESSO REALE ATTIVO','REAL ACCESS ACTIVE','AĊĊESS REALI ATTIV'))}</span></div><div style="display:grid;grid-template-columns:minmax(0,1fr) 110px;gap:8px;margin-top:12px"><input id="mdmPilotInviteEmail" type="email" maxlength="254" autocomplete="email" inputmode="email" placeholder="student@example.com" style="min-width:0;padding:11px;border:1px solid rgba(0,0,0,.18);border-radius:10px;background:var(--card,#fff);color:inherit"><select id="mdmPilotInviteHours" style="padding:11px;border:1px solid rgba(0,0,0,.18);border-radius:10px;background:var(--card,#fff);color:inherit"><option value="24">24 h</option><option value="72" selected>72 h</option><option value="168">7 days</option></select></div><button id="mdmPilotCreateRealInvite" class="btn" type="button" style="margin-top:9px;width:100%">${esc(lang3('Invia invito allo studente','Send invitation to student','Ibgħat stedina lill-istudent'))}</button><div id="mdmPilotInviteResult" style="display:none;margin-top:10px;padding:10px;border-radius:10px;background:rgba(0,0,0,.05);font-size:12px;word-break:break-word"></div>`;
    if(host.classList?.contains('sch35')){
      const anchor=host.querySelector('.sch35-profile-entry')||host.querySelector('.sch35-head');
      if(anchor)anchor.insertAdjacentElement('afterend',panel); else host.insertBefore(panel,host.firstChild||null);
    }else host.appendChild(panel);
    panel.querySelector('#mdmPilotCreateRealInvite').onclick=createInvitation;return panel;
  }

  function mount(){removeLegacySeatQueue();const host=findSchoolConsole();if(!host||!renderedSchoolAdmin(host)||!readSession()){removePanel();return false;}buildInvitePanel(host);buildActivationPanel(host);return true;}

  async function createInvitation(){
    const emailEl=document.getElementById('mdmPilotInviteEmail'),hoursEl=document.getElementById('mdmPilotInviteHours'),result=document.getElementById('mdmPilotInviteResult'),button=document.getElementById('mdmPilotCreateRealInvite');if(!emailEl||!result||!button)return;
    const email=normalizeEmail(emailEl.value);emailEl.value=email;result.style.display='block';
    if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)){result.textContent='❌ '+lang3('Inserisci un’email valida.','Enter a valid email.','Daħħal email valida.');return;}
    button.disabled=true;state.status='creating';state.error='';state.lastInvitation=null;state.emailDelivery='';result.textContent=lang3('Creazione invito e invio email…','Creating invitation and sending email…','Qed tinħoloq l-istedina u tintbagħat l-email…');
    try{
      const host=findSchoolConsole(),licenseId=await resolveSchoolLicense(host),hours=Math.max(1,Math.min(168,Number(hoursEl?.value||72)||72));
      const data=await rpc('mdm_school_create_pilot_invitation',{p_license_id:licenseId,p_invite_email:email,p_valid_hours:hours});
      if(data?.ok!==true||!data?.invite_token)throw new Error(String(data?.error||'invite_creation_failed'));
      state.lastInvitation={invitationId:String(data.invitation_id||''),email:String(data.invite_email||email),expiresAt:String(data.expires_at||''),token:String(data.invite_token)};
      try{
        await sendInvitationEmail(state.lastInvitation.email,state.lastInvitation.token,state.lastInvitation.invitationId);
        state.status='sent';state.emailDelivery='sent';
        result.innerHTML=`<strong>✅ ${esc(lang3('Invito creato e email inviata','Invitation created and email sent','Stedina maħluqa u email mibgħuta'))}</strong><br><br><b>Email:</b> ${esc(state.lastInvitation.email)}<br><b>${esc(lang3('Scadenza','Expires','Jiskadi'))}:</b> ${esc(state.lastInvitation.expiresAt||'—')}<br><br>${esc(lang3('Lo studente deve aprire il link ricevuto: MDM conserverà l’invito e lo riscatterà automaticamente dopo l’accesso.','The student should open the received link: MDM will keep the invitation and redeem it automatically after sign-in.','L-istudent għandu jiftaħ il-link: MDM iżomm l-istedina u jużaha awtomatikament wara l-login.'))}`;
      }catch(mailError){
        state.status='created_email_failed';state.emailDelivery='failed';state.error=String(mailError?.message||mailError||'email_send_failed');
        result.innerHTML=`<strong>⚠️ ${esc(lang3('Invito creato, ma email non inviata','Invitation created, but email was not sent','Stedina maħluqa, iżda l-email ma ntbagħtitx'))}</strong><br><br><b>Email:</b> ${esc(state.lastInvitation.email)}<br><b>${esc(lang3('Errore email','Email error','Żball tal-email'))}:</b> ${esc(state.error)}<br><br><details><summary style="font-weight:800">${esc(lang3('Token di emergenza','Emergency token','Token ta’ emerġenza'))}</summary><code id="mdmPilotInviteRawToken" style="display:block;margin-top:8px;word-break:break-all">${esc(state.lastInvitation.token)}</code><button id="mdmPilotCopyInviteToken" class="btn secondary" type="button" style="margin-top:8px">⧉ ${esc(lang3('Copia token','Copy token','Ikkopja token'))}</button></details>`;
        const copy=result.querySelector('#mdmPilotCopyInviteToken');if(copy)copy.onclick=async()=>{try{await navigator.clipboard.writeText(state.lastInvitation.token);copy.textContent='✓ '+lang3('Copiato','Copied','Ikkupjat');}catch(_){}};
      }
    }catch(e){state.status='error';state.error=String(e?.message||e||'invite_creation_failed');result.textContent='❌ '+state.error;}
    finally{button.disabled=false;}
  }

  function schedule(){syncInviteLoginEmail();try{queueMicrotask(mount);}catch(_){mount();}try{requestAnimationFrame(()=>requestAnimationFrame(mount));}catch(_){}setTimeout(mount,80);}
  function installHistoryLifecycleHook(){if(window.__MDM_PILOT_SCHOOL_HISTORY_HOOK__)return;window.__MDM_PILOT_SCHOOL_HISTORY_HOOK__=true;const push=history.pushState.bind(history),replace=history.replaceState.bind(history);history.pushState=function(){const out=push(...arguments);setTimeout(schedule,0);return out;};history.replaceState=function(){const out=replace(...arguments);setTimeout(schedule,0);return out;};window.addEventListener('popstate',()=>setTimeout(schedule,0));}
  const originalSetItem=Storage.prototype.setItem;
  if(!window.__MDM_PILOT_SCHOOL_INVITE_AUTH_HOOK__){window.__MDM_PILOT_SCHOOL_INVITE_AUTH_HOOK__=true;Storage.prototype.setItem=function(key,value){const out=originalSetItem.apply(this,arguments);if(this===localStorage&&String(key)===AUTH_KEY){setTimeout(()=>{schedule();autoRedeemPending();},0);}return out;};}

  installHistoryLifecycleHook();
  document.addEventListener('click',()=>setTimeout(schedule,0),false);
  window.addEventListener('pageshow',()=>{schedule();processInboundInvite();});
  window.addEventListener('load',()=>{schedule();processInboundInvite();},{once:true});
  document.addEventListener('visibilitychange',()=>{if(!document.hidden){schedule();processInboundInvite();}});

  window.MDM_PILOT_SCHOOL_DASHBOARD_BRIDGE=Object.freeze({version:VERSION,mode:'enforced',getState:()=>JSON.parse(JSON.stringify(state)),mount,processInboundInvite,refreshActivationQueue});
  processInboundInvite();schedule();
})();
