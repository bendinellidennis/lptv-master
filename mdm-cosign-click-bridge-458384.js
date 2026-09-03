/* Malta Driving Master 45.8.38.4 — Co-Sign Click Bridge */
(function(){
'use strict';
if(window.MDM_COSIGN_CLICK_BRIDGE_458384)return;
const VERSION='45.8.38.4';
function lang(){try{return String(JSON.parse(localStorage.getItem('mdm-v1-settings')||'{}').lang||'en')}catch(_){return'en'}}
function t(it,en,mt){const l=lang();return l==='it'?it:l==='mt'?mt:en}
function bridge(){return window.MDM_INSTRUCTOR_COSIGN_458382||window.MDM_INSTRUCTOR_COSIGN_458381||null}
async function handle(ev){
 const btn=ev.target?.closest?.('[data-cosign-copy]');if(!btn)return;
 ev.preventDefault();ev.stopImmediatePropagation();
 btn.textContent='⏳ '+t('Preparazione codice…','Preparing code…','Qed jitħejja l-kodiċi…');
 btn.disabled=true;
 try{
  const api=bridge();
  if(!api||typeof api.copyCosignCode!=='function')throw new Error('bridge_unavailable');
  const ok=await api.copyCosignCode();
  if(!ok)btn.textContent='📋 '+t('Codice pronto sotto','Code ready below','Kodiċi lest hawn taħt');
 }catch(_){
  btn.textContent='⚠️ '+t('Riprova','Try again','Erġa’ pprova');
 }finally{btn.disabled=false}
}
document.addEventListener('click',handle,true);
document.addEventListener('touchend',function(ev){
 const btn=ev.target?.closest?.('[data-cosign-copy]');if(!btn)return;
 if(Date.now()-Number(btn.dataset.mdmTouch||0)<700)return;
 btn.dataset.mdmTouch=String(Date.now());
 handle(ev);
},true);
window.MDM_COSIGN_CLICK_BRIDGE_458384=Object.freeze({version:VERSION});
})();
