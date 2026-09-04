/* Malta Driving Master 45.8.38.25.2.15 — Smart Match deterministic course selector
   Patches only #schoolCourseFilter after the app renderer creates it.
   Targeted #screen observer only; no global observer and no polling. */
(function(){
'use strict';
if(window.MDM_SMART_MATCH_COURSE_RUNTIME_458382515)return;
window.MDM_SMART_MATCH_COURSE_RUNTIME_458382515=true;

const VERSION='45.8.38.25.2.15';
const PREFS_KEY='mdm-v1-school-preferences';

function parse(v){try{return v?JSON.parse(v):null}catch(_){return null}}
function lang(){
  const s=parse(localStorage.getItem('mdm-v1-settings'))||{};
  const l=String(s.lang||document.documentElement.lang||'en').toLowerCase();
  return l.startsWith('it')?'it':l.startsWith('mt')?'mt':'en';
}
const LABELS={
  it:{any:'Tutti i corsi',lptv:'LPTV / TAG',b:'Patente B',a:'Moto',cce:'C / CE',d:'Bus D'},
  en:{any:'All courses',lptv:'LPTV / TAG',b:'Category B',a:'Motorcycle',cce:'C / CE',d:'Bus D'},
  mt:{any:'Il-korsijiet kollha',lptv:'LPTV / TAG',b:'Kategorija B',a:'Mutur',cce:'C / CE',d:'Xarabank D'}
};
const ORDER=['any','lptv','b','a','cce','d'];

function preferredValue(select){
  const saved=parse(localStorage.getItem(PREFS_KEY));
  const v=String(saved?.course||select.value||'any');
  return ORDER.includes(v)?v:'any';
}
function correct(select,L){
  if(select.options.length!==ORDER.length)return false;
  return ORDER.every((value,i)=>select.options[i]?.value===value && String(select.options[i]?.textContent||'')===L[value]);
}
function patch(){
  const select=document.getElementById('schoolCourseFilter');
  if(!select)return false;
  const L=LABELS[lang()];
  if(!correct(select,L)){
    const keep=preferredValue(select);
    const frag=document.createDocumentFragment();
    ORDER.forEach(value=>{
      const o=document.createElement('option');
      o.value=value;
      o.textContent=L[value];
      frag.appendChild(o);
    });
    select.replaceChildren(frag);
    select.value=keep;
  }
  select.dataset.mdmCourseReady='1';
  select.style.visibility='';
  return true;
}
function patchSoon(){
  patch();
  requestAnimationFrame(patch);
  setTimeout(patch,40);
  setTimeout(patch,120);
}
const screen=document.getElementById('screen');
let observer=null;
if(screen){
  observer=new MutationObserver(()=>patchSoon());
  observer.observe(screen,{childList:true,subtree:true});
}
window.addEventListener('pageshow',patchSoon);
window.addEventListener('hashchange',patchSoon);
window.addEventListener('popstate',patchSoon);
document.addEventListener('visibilitychange',()=>{if(!document.hidden)patchSoon()});
patchSoon();

window.MDM_SMART_MATCH_COURSE_RUNTIME=Object.freeze({version:VERSION,patch:patchSoon,observer});
})();