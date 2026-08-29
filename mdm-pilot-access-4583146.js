/* Malta Driving Master 45.8.31.46 — Isolated Pilot Access Bridge
   Passive by design: no startup RPC, no DOM mutation, no timers, no UI blocking.
   Loaded only after the stable application runtime has completed startup. */
(function(){
  'use strict';

  if (window.MDM_PILOT_ACCESS_BRIDGE) return;

  const state = {
    version: '45.8.31.46',
    mode: 'shadow',
    enforcement: false,
    status: 'ready',
    checkedAt: '',
    authorized: null,
    reason: '',
    error: ''
  };

  async function check(){
    if (typeof window.mdmAuthSummary !== 'function' || typeof window.mdmDataRpc !== 'function') {
      state.status = 'runtime_unavailable';
      state.error = 'runtime_unavailable';
      return Object.assign({}, state);
    }

    let auth;
    try { auth = window.mdmAuthSummary(); }
    catch (e) {
      state.status = 'auth_error';
      state.error = String(e && e.message || e || 'auth_error');
      return Object.assign({}, state);
    }

    if (!auth || !auth.authenticated) {
      state.status = 'signed_out';
      state.checkedAt = new Date().toISOString();
      state.authorized = null;
      state.reason = 'authentication_required';
      state.error = '';
      return Object.assign({}, state);
    }

    state.status = 'checking';
    state.error = '';

    try {
      const result = await window.mdmDataRpc('mdm_check_my_pilot_entitlement', {});
      let data = {};
      try {
        data = typeof window.mdmAuthParse === 'function'
          ? (window.mdmAuthParse(result && result.body) || {})
          : JSON.parse(String(result && result.body || '{}'));
      } catch (_) {}

      if (!result || result.status < 200 || result.status >= 300 || data.ok === false) {
        state.status = 'error';
        state.checkedAt = new Date().toISOString();
        state.authorized = null;
        state.reason = 'entitlement_check_failed';
        state.error = String(data.error || 'entitlement_check_failed');
        return Object.assign({}, state);
      }

      state.status = data.authorized === true ? 'authorized' : 'unauthorized';
      state.checkedAt = new Date().toISOString();
      state.authorized = data.authorized === true;
      state.reason = String(data.reason || '');
      state.error = '';
      return Object.assign({}, state);
    } catch (e) {
      state.status = 'error';
      state.checkedAt = new Date().toISOString();
      state.authorized = null;
      state.reason = 'entitlement_check_exception';
      state.error = String(e && e.message || e || 'entitlement_check_exception');
      return Object.assign({}, state);
    }
  }

  window.MDM_PILOT_ACCESS_BRIDGE = Object.freeze({
    version: '45.8.31.46',
    mode: 'shadow',
    getState: function(){ return Object.assign({}, state); },
    check: check
  });
})();
