/* Malta Driving Master 45.8.31.46 — Pilot Entitlement Frontend Bridge
   Public Supabase client configuration only.
   Never place sb_secret_ or service_role credentials in this file.

   This build adds the first frontend bridge to the server-side Pilot Access &
   Licensing Gate. It is intentionally SHADOW-ONLY: it reads the authoritative
   entitlement RPC and publishes a local runtime state, but it does not block
   the existing student/school UI yet. That allows us to verify the real browser
   path before enabling enforcement in the next step. */
(function(){
  'use strict';

  window.MDM_BACKEND_CONFIG = Object.freeze({
    provider: 'supabase',
    endpoint: 'https://mfphdtzgnicdusdhbcvg.supabase.co',
    publishableKey: 'sb_publishable_ZssVPLCMtgBgjdJS0o1swQ_vf3VCRrh',
    enabled: true
  });

  const state = {
    version: '45.8.31.46',
    mode: 'shadow',
    enforcement: false,
    status: 'idle',
    checkedAt: '',
    authorized: null,
    reason: '',
    licenseId: '',
    licenseType: '',
    planCode: '',
    schoolId: '',
    licenseStatus: '',
    seatStatus: '',
    deviceLimit: 0,
    activeDevices: 0,
    deviceLimitReached: false,
    error: ''
  };

  function publish(patch){
    Object.assign(state, patch || {});
    try{
      const root = document.documentElement;
      root.dataset.mdmPilotStatus = String(state.status || 'idle');
      root.dataset.mdmPilotAuthorized = state.authorized === true ? 'true' : (state.authorized === false ? 'false' : 'unknown');
      root.dataset.mdmPilotMode = 'shadow';
    }catch{}
    try{
      window.dispatchEvent(new CustomEvent('mdm:pilot-entitlement', { detail: Object.assign({}, state) }));
    }catch{}
  }

  Object.defineProperty(window, 'MDM_PILOT_ACCESS', {
    value: state,
    enumerable: false,
    writable: false,
    configurable: false
  });

  let inFlight = false;

  async function checkEntitlement(reason){
    if(inFlight) return false;
    if(typeof window.mdmAuthSummary !== 'function' && typeof mdmAuthSummary !== 'function') return false;
    if(typeof window.mdmDataRpc !== 'function' && typeof mdmDataRpc !== 'function') return false;

    let auth;
    try{ auth = (typeof mdmAuthSummary === 'function' ? mdmAuthSummary() : window.mdmAuthSummary()); }
    catch{ return false; }

    if(!auth || !auth.authenticated){
      publish({
        status: 'signed_out',
        checkedAt: new Date().toISOString(),
        authorized: null,
        reason: 'authentication_required',
        licenseId: '',
        licenseType: '',
        planCode: '',
        schoolId: '',
        licenseStatus: '',
        seatStatus: '',
        deviceLimit: 0,
        activeDevices: 0,
        deviceLimitReached: false,
        error: ''
      });
      return true;
    }

    inFlight = true;
    publish({status:'checking', error:''});

    try{
      if(typeof mdmEnsureFreshAuthForData === 'function'){
        const fresh = await mdmEnsureFreshAuthForData();
        if(!fresh){
          publish({
            status:'auth_refresh_required',
            checkedAt:new Date().toISOString(),
            authorized:null,
            reason:'auth_refresh_required',
            error:'auth_refresh_required'
          });
          return false;
        }
      }

      const result = await mdmDataRpc('mdm_check_my_pilot_entitlement', {});
      const data = typeof mdmAuthParse === 'function'
        ? (mdmAuthParse(result && result.body) || {})
        : (()=>{ try{return JSON.parse(String(result && result.body || '{}'))}catch{return {}} })();

      if(!result || result.status < 200 || result.status >= 300 || data.ok === false){
        const message = typeof mdmDataErrorMessage === 'function'
          ? (mdmDataErrorMessage(result) || String(data.error || 'entitlement_check_failed'))
          : String(data.error || 'entitlement_check_failed');
        publish({
          status:'error',
          checkedAt:new Date().toISOString(),
          authorized:null,
          reason:'entitlement_check_failed',
          error:message
        });
        return false;
      }

      publish({
        status: data.authorized === true ? 'authorized' : 'unauthorized',
        checkedAt: new Date().toISOString(),
        authorized: data.authorized === true,
        reason: String(data.reason || ''),
        licenseId: String(data.license_id || ''),
        licenseType: String(data.license_type || ''),
        planCode: String(data.plan_code || ''),
        schoolId: String(data.school_id || ''),
        licenseStatus: String(data.license_status || ''),
        seatStatus: String(data.seat_status || ''),
        deviceLimit: Number(data.device_limit || 0),
        activeDevices: Number(data.active_devices || 0),
        deviceLimitReached: data.device_limit_reached === true,
        error: ''
      });
      return true;
    }catch(error){
      publish({
        status:'error',
        checkedAt:new Date().toISOString(),
        authorized:null,
        reason:'entitlement_check_exception',
        error:String(error && error.message || error || 'entitlement_check_exception')
      });
      return false;
    }finally{
      inFlight = false;
    }
  }

  Object.defineProperty(window, 'MDM_PILOT_CHECK', {
    value: checkEntitlement,
    enumerable: false,
    writable: false,
    configurable: false
  });

  function schedule(delay, reason){
    setTimeout(()=>{ checkEntitlement(reason).catch(()=>{}); }, delay);
  }

  schedule(1800, 'startup');
  schedule(4800, 'startup_retry');

  window.addEventListener('focus', ()=>schedule(120, 'focus'), {passive:true});
  document.addEventListener('visibilitychange', ()=>{
    if(document.visibilityState === 'visible') schedule(180, 'visible');
  }, {passive:true});
})();