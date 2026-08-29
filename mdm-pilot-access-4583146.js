/* Malta Driving Master 45.8.31.46 — Isolated Pilot Access Bridge
   Loaded only after the stable application runtime has completed startup.
   Performs one shadow entitlement check and renders one non-interactive status badge.
   No access enforcement, no observers, no repeated timers, no direct table access. */
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

  function snapshot(){ return Object.assign({}, state); }

  function renderBadge(){
    try{
      let el = document.getElementById('mdmPilotShadowBadge');
      if(!el){
        el = document.createElement('div');
        el.id = 'mdmPilotShadowBadge';
        el.setAttribute('aria-live','polite');
        el.style.cssText = 'position:fixed;z-index:5;right:10px;top:calc(8px + env(safe-area-inset-top));max-width:72vw;padding:6px 9px;border-radius:10px;background:rgba(6,26,43,.84);color:#fff;font:700 10px/1.25 system-ui;letter-spacing:.01em;pointer-events:none;opacity:.88';
        document.body.appendChild(el);
      }
      const auth = state.authorized === true ? 'AUTHORIZED' : state.authorized === false ? 'NO ACTIVE LICENSE' : 'PENDING';
      el.textContent = 'Pilot 45.8.31.46 · ' + String(state.status || 'ready').toUpperCase() + ' · ' + auth;
    }catch(_){}
  }

  async function check(){
    if (typeof window.mdmAuthSummary !== 'function' || typeof window.mdmDataRpc !== 'function') {
      state.status = 'runtime_unavailable';
      state.error = 'runtime_unavailable';
      renderBadge();
      return snapshot();
    }

    let auth;
    try { auth = window.mdmAuthSummary(); }
    catch (e) {
      state.status = 'auth_error';
      state.error = String(e && e.message || e || 'auth_error');
      renderBadge();
      return snapshot();
    }

    if (!auth || !auth.authenticated) {
      state.status = 'signed_out';
      state.checkedAt = new Date().toISOString();
      state.authorized = null;
      state.reason = 'authentication_required';
      state.error = '';
      renderBadge();
      return snapshot();
    }

    state.status = 'checking';
    state.error = '';
    renderBadge();

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
        renderBadge();
        return snapshot();
      }

      state.status = data.authorized === true ? 'authorized' : 'unauthorized';
      state.checkedAt = new Date().toISOString();
      state.authorized = data.authorized === true;
      state.reason = String(data.reason || '');
      state.error = '';
      renderBadge();
      return snapshot();
    } catch (e) {
      state.status = 'error';
      state.checkedAt = new Date().toISOString();
      state.authorized = null;
      state.reason = 'entitlement_check_exception';
      state.error = String(e && e.message || e || 'entitlement_check_exception');
      renderBadge();
      return snapshot();
    }
  }

  window.MDM_PILOT_ACCESS_BRIDGE = Object.freeze({
    version: '45.8.31.46',
    mode: 'shadow',
    getState: snapshot,
    check: check
  });

  check().catch(function(){
    state.status='error';
    state.error='entitlement_check_exception';
    renderBadge();
  });
})();
