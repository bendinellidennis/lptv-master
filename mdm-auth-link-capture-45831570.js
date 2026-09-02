/* Malta Driving Master 45.8.31.50.69.1 — Early Auth Link Capture */
(function(){
  'use strict';
  try{
    const raw=String(location.hash||'');
    const params=new URLSearchParams(raw.replace(/^#/,''));
    if(String(params.get('type')||'')==='recovery'&&String(params.get('access_token')||'')){
      window.__MDM_RECOVERY_HASH__=raw;
      window.__MDM_PASSWORD_RECOVERY_IN_PROGRESS__=true;
    }
  }catch(_){}
})();
