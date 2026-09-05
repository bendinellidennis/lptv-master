/* Malta Driving Master 45.8.38.25.2 — Server-Authoritative Route Access Guard
   Defense in depth for privileged SPA routes. Direct hashes and UI clicks are denied
   unless Supabase confirms Platform Owner or ACTIVE School Admin for auth.uid(). */
(function(){
  'use strict';
  if(window.MDM_PRIVILEGED_ROUTE_GUARD)return;

  const VERSION='45.8.38.25.2.20';
  const AUTH_KEY='mdm_auth_session_v4410';
  const OWNER_ROUTES=new Set([
    'backendreal','externalvalidation','pilotanalytics','securitytrust',
    'pentestprep','realpilotprep','schoolpilotprep','metricsloiprep',
    'investorproduction','investorpreview','pilotreadiness','cloudready'
  ]);
  const SCHOOL_ROUTES=new Set([
    'schoolhome','schoolprofile','schoolportal2','instructorportal','fleetcorporate',
    'schooloperations','schoolroster','schooldashboard','instructorassignments',
    'instructorintelligence','schoolcommandcenter','instructorstudio'
  ]);

  let schoolInFlight=null;
  let schoolFingerprint='';
  const school={status:'idle',authorized:false,checkedAt:'',reason:''};
  let internalNav=false;

  function parse(v){try{return v?JSON.parse(v):null}catch(_){return null}}
  function session(){
    const s=parse(localStorage.getItem(AUTH_KEY));
    if(!s||s.status!=='authenticated'||!s.accessToken||!s.user?.id)return null;
    if(Number(s.expiresAt||0)>0&&Number(s.expiresAt)<=Date.now())return null;
    return s;
  }
  function fp(s){return s?String(s.user?.id||'')+'|'+String(s.accessToken||'').slice(-32)+'|'+String(s.expiresAt||''):''}
  function lang(){try{const l=String(parse(localStorage.getItem('mdm-v1-settings'))?.lang||'en');return ['it','en','mt'].includes(l)?l:'en'}catch(_){return'en'}}
  function t(it,en,mt){return lang()==='it'?it:lang()==='mt'?mt:en}
  function cfg(){const c=window.MDM_BACKEND_CONFIG||{};return c.enabled&&c.endpoint&&c.publishableKey?{endpoint:String(c.endpoint).replace(/\/$/,''),key:String(c.publishableKey)}:null}
  function ownerState(){return window.MDM_OWNER_AUTHORITY?.snapshot?.()||{status:'idle',authorized:false}}
  function ownerAllowed(){return window.MDM_OWNER_AUTHORITY?.isOwner?.()===true}
  function schoolSnapshot(){return Object.freeze({...school})}
  function schoolAllowed(){
    const s=session();
    return Boolean(s&&school.status==='verified'&&school.authorized===true&&schoolFingerprint===fp(s));
  }

  function guardOverlay(show){
    let el=document.getElementById('mdmPrivilegedRouteGuardOverlay');
    if(!show){el?.remove();return}
    if(el)return;
    el=document.createElement('div');
    el.id='mdmPrivilegedRouteGuardOverlay';
    el.setAttribute('role','status');
    el.style.cssText='position:fixed;inset:0;z-index:2147483645;display:grid;place-items:center;padding:24px;background:#edf5f7;color:#103446;font:800 15px/1.35 system-ui,-apple-system,sans-serif;text-align:center';
    el.textContent='🔐 '+t('Verifica autorizzazione…','Checking authorization…','Qed tiġi vverifikata l-awtorizzazzjoni…');
    document.body?.appendChild(el);
  }

  async function verifySchool(force=false){
    const s=session();
    if(!s){
      school.status='signed_out';school.authorized=false;school.reason='authentication_required';school.checkedAt=new Date().toISOString();schoolFingerprint='';return schoolSnapshot();
    }
    const f=fp(s);
    if(!force&&f&&f===schoolFingerprint&&school.status==='verified')return schoolSnapshot();
    if(schoolInFlight)return schoolInFlight;
    const c=cfg();
    if(!c){school.status='error';school.authorized=false;school.reason='backend_config_unavailable';school.checkedAt=new Date().toISOString();return schoolSnapshot()}

    school.status='checking';school.authorized=false;school.reason='';
    schoolInFlight=(async()=>{
      try{
        const r=await fetch(c.endpoint+'/rest/v1/rpc/mdm_get_my_school_admin_context',{
          method:'POST',
          headers:{'Content-Type':'application/json','apikey':c.key,'Authorization':'Bearer '+String(s.accessToken)},
          body:'{}',cache:'no-store',credentials:'omit'
        });
        const tx=await r.text();let d={};try{d=tx?JSON.parse(tx):{}}catch(_){}
        if(Array.isArray(d))d=d[0]||{};
        school.status='verified';
        school.authorized=Boolean(r.ok&&d?.authorized===true&&String(d?.role||'')==='school_admin'&&String(d?.membership_status||'')==='active');
        school.reason=school.authorized?'':String(d?.error||d?.reason||'school_admin_required');
        school.checkedAt=new Date().toISOString();schoolFingerprint=f;
      }catch(e){
        school.status='error';school.authorized=false;school.reason=String(e?.message||e||'school_authorization_failed');school.checkedAt=new Date().toISOString();
      }finally{schoolInFlight=null}
      return schoolSnapshot();
    })();
    return schoolInFlight;
  }

  function routeName(){return String(location.hash||'').replace(/^#/,'').split('?')[0].trim()}
  function decision(name){
    const n=String(name||'');
    if(OWNER_ROUTES.has(n)){
      const o=ownerState();
      if(o.status==='idle'||o.status==='checking')return {pending:true,kind:'owner'};
      return ownerAllowed()?{allow:true,kind:'owner'}:{allow:false,kind:'owner'};
    }
    if(SCHOOL_ROUTES.has(n)){
      if(ownerAllowed())return {allow:true,kind:'owner'};
      const s=session(),f=fp(s);
      if(!s)return {allow:false,kind:'school'};
      if(school.status==='idle'||school.status==='checking'||schoolFingerprint!==f)return {pending:true,kind:'school'};
      return schoolAllowed()?{allow:true,kind:'school'}:{allow:false,kind:'school'};
    }
    return {allow:true,kind:'public'};
  }
  function navigate(name,data=null,replace=true){
    internalNav=true;
    try{
      const st={name:String(name),data:data??null};
      if(replace)history.replaceState(st,'','#'+st.name);else history.pushState(st,'','#'+st.name);
      window.dispatchEvent(new PopStateEvent('popstate',{state:st}));
    }finally{internalNav=false}
  }
  function deny(kind){
    guardOverlay(false);
    try{
      const msg=kind==='owner'
        ?t('Area tecnica riservata al proprietario verificato dal server.','Technical area reserved for the server-verified owner.','Żona teknika riservata għas-sid ivverifikat mis-server.')
        :t('Area riservata a una Scuola Admin ACTIVE verificata dal server.','Area reserved for an ACTIVE School Admin verified by the server.','Żona riservata għal School Admin ATTIV ivverifikat mis-server.');
      window.dispatchEvent(new CustomEvent('mdm:authorization-denied',{detail:{route:routeName(),kind,message:msg}}));
    }catch(_){}
    navigate('accountenrollment',null,true);
  }
  async function authorizeRoute(name){
    const n=String(name||'');
    if(OWNER_ROUTES.has(n))await window.MDM_OWNER_AUTHORITY?.verify?.(false);
    if(SCHOOL_ROUTES.has(n)&&!ownerAllowed())await verifySchool(false);
    return decision(n);
  }
  async function enforceCurrent(){
    if(internalNav)return true;
    const n=routeName(),d=decision(n);
    if(d.allow===true){guardOverlay(false);return true}
    if(d.pending){
      guardOverlay(true);
      const final=await authorizeRoute(n);
      if(final.allow===true){guardOverlay(false);return true}
      deny(final.kind);return false;
    }
    deny(d.kind);return false;
  }

  document.addEventListener('click',function(ev){
    const b=ev.target?.closest?.('[data-go]');
    if(!b)return;
    const name=String(b.getAttribute('data-go')||'');
    if(!OWNER_ROUTES.has(name)&&!SCHOOL_ROUTES.has(name))return;
    ev.preventDefault();ev.stopImmediatePropagation();
    guardOverlay(true);
    Promise.resolve(authorizeRoute(name)).then(d=>{
      if(d.allow===true){guardOverlay(false);navigate(name,b.getAttribute('data-id')||null,false)}
      else deny(d.kind);
    });
  },true);

  window.addEventListener('popstate',function(){if(!internalNav)enforceCurrent()});
  window.addEventListener('pageshow',enforceCurrent);
  window.addEventListener('mdm:owner-authority',enforceCurrent);
  document.addEventListener('visibilitychange',function(){if(!document.hidden)enforceCurrent()});

  window.MDM_PRIVILEGED_ROUTE_GUARD=Object.freeze({
    version:VERSION,ownerRoutes:Object.freeze([...OWNER_ROUTES]),schoolRoutes:Object.freeze([...SCHOOL_ROUTES]),
    verifySchool,schoolSnapshot,enforce:enforceCurrent
  });

  verifySchool(false).then(enforceCurrent);
})();