/* Malta Driving Master 45.8.38.19.4.3 — Telemetry Advanced Tools card + expandable panel */
(function(){
'use strict';
if(window.MDM_SCHOOL_TELEMETRY_PLACEMENT_458381943)return;
const VERSION='45.8.38.19.4.3';
const CARD_ID='mdmSchoolTelemetryCard';

function norm(v){return String(v||'').replace(/\s+/g,' ').trim().toUpperCase();}
function lang(){try{return String(JSON.parse(localStorage.getItem('mdm-v1-settings')||'{}').lang||'en')}catch(_){return'en'}}
function tr(it,en,mt){const l=lang();return l==='it'?it:l==='mt'?mt:en}
function isAdvancedText(tx){return tx.includes('STRUMENTI AVANZATI')||tx.includes('ADVANCED TOOLS')||tx.includes('GĦODOD AVVANZATI');}
function advancedTitle(){
 const preferred=Array.from(document.querySelectorAll('.sch35-title,h1,h2,h3,h4,h5,strong,b'));
 let hit=preferred.find(el=>{const tx=norm(el.textContent||'');return tx.length<=90&&isAdvancedText(tx)});
 if(hit)return hit;
 return Array.from(document.querySelectorAll('main *')).find(el=>{const tx=norm(el.textContent||'');return tx.length<=90&&isAdvancedText(tx)})||null;
}
function advancedGrid(title){
 if(!title)return null;
 const school=title.closest('.sch35,.sch35-profile')||title.parentElement;
 if(!school)return null;
 const titleTop=title.getBoundingClientRect?.().top||0;
 const candidates=Array.from(school.querySelectorAll('.sch35-grid,[class*="grid"]')).filter(el=>{
  if(el===title||el.contains(title))return false;
  const r=el.getBoundingClientRect?.();
  if(r&&r.top<titleTop-2)return false;
  const tx=norm(el.textContent||'');
  return tx.includes('INTELLIGENZA ISTRUTTORE')||tx.includes('INSTRUCTOR INTELLIGENCE')||tx.includes('STUDIO ISTRUTTORE')||tx.includes('INSTRUCTOR STUDIO')||tx.includes('CENTRO DI COMANDO')||tx.includes('COMMAND CENTER')||tx.includes('TRUST CENTER');
 });
 if(candidates.length)return candidates.sort((a,b)=>(a.getBoundingClientRect?.().top||0)-(b.getBoundingClientRect?.().top||0))[0];
 let n=title.nextElementSibling;
 while(n){
  const tx=norm(n.textContent||'');
  if(tx.includes('INTELLIGENZA ISTRUTTORE')||tx.includes('STUDIO ISTRUTTORE')||tx.includes('CENTRO DI COMANDO')||tx.includes('TRUST CENTER'))return n;
  n=n.nextElementSibling;
 }
 return null;
}
function makeCard(){
 let card=document.getElementById(CARD_ID);
 if(card)return card;
 card=document.createElement('button');
 card.id=CARD_ID;
 card.type='button';
 card.className='sch35-card blue';
 card.setAttribute('aria-expanded','false');
 card.style.cssText='text-align:left;width:100%;cursor:pointer;border:0;font:inherit;color:inherit';
 card.innerHTML='<div style="font-size:30px;line-height:1;margin-bottom:12px">📡</div><strong style="display:block;font-size:17px;margin-bottom:5px">'+tr('Telemetria','Telemetry','Telemetrija')+'</strong><span style="display:block;font-size:12px;opacity:.72">'+tr('GPS e dati della lezione pratica','GPS and practical lesson data','GPS u data tal-lezzjoni prattika')+'</span>';
 card.addEventListener('click',function(){
  const panel=document.getElementById('mdmSchoolTelemetryPanel');
  if(!panel)return;
  const open=card.getAttribute('aria-expanded')==='true';
  card.setAttribute('aria-expanded',open?'false':'true');
  panel.style.display=open?'none':'block';
  if(!open)setTimeout(()=>{try{panel.scrollIntoView({behavior:'smooth',block:'start'})}catch(_){}},40);
 });
 return card;
}
function place(){
 const panel=document.getElementById('mdmSchoolTelemetryPanel');
 if(!panel)return false;
 const title=advancedTitle();
 const grid=advancedGrid(title);
 if(!title||!grid)return false;
 const card=makeCard();
 if(card.parentNode!==grid)grid.appendChild(card);
 const parent=grid.parentNode;
 if(panel.parentNode!==parent||panel.previousElementSibling!==grid)grid.insertAdjacentElement('afterend',panel);
 const open=card.getAttribute('aria-expanded')==='true';
 panel.style.display=open?'block':'none';
 panel.dataset.mdmPlacement='advanced-tools-card';
 panel.dataset.mdmPlacementVersion=VERSION;
 return true;
}
function schedule(){[0,80,180,350,700,1200,2000,3500,5000,8000,12000,20000,30000].forEach(ms=>setTimeout(place,ms));}
schedule();
window.addEventListener('pageshow',schedule);
window.addEventListener('popstate',schedule);
document.addEventListener('visibilitychange',function(){if(!document.hidden)schedule()});
window.MDM_SCHOOL_TELEMETRY_PLACEMENT_458381943=Object.freeze({version:VERSION,place});
})();