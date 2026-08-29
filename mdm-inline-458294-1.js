
(function(){try{const raw=localStorage.getItem('mdm-v1-settings'),lang=raw?JSON.parse(raw).lang:'en',el=document.getElementById('mdmStartupSub');if(!el)return;el.textContent=lang==='it'?'Caricamento della tua intelligenza di guida…':lang==='mt'?'Qed titgħabba l-intelliġenza tas-sewqan tiegħek…':'Loading your driving intelligence…';}catch(_){}})();

/* 45.8.31.46 — load the passive Pilot Access bridge only after the stable app
   and every declared page resource have completed loading. The bridge itself
   performs no automatic RPC, timer, DOM mutation or access enforcement. */
window.addEventListener('load',function(){
  try{
    if(window.MDM_PILOT_ACCESS_BRIDGE)return;
    const s=document.createElement('script');
    s.src='mdm-pilot-access-4583146.js?v=4583146-passive';
    s.async=true;
    s.setAttribute('data-mdm-pilot-bridge','passive');
    document.head.appendChild(s);
  }catch(_){}
},{once:true});
