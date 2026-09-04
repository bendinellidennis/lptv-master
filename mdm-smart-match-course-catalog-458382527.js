/* Malta Driving Master 45.8.38.25.2.10 — Smart Match full course catalog persistent */
(function(){
'use strict';
if(window.MDM_SMART_MATCH_COURSES_458382527)return;
const VERSION='45.8.38.25.2.10';
const ORDER=['MT-LPTV','MT-B','MT-A','MT-C-CE','MT-D'];
const LABELS={
  it:{all:'Tutti i corsi','MT-LPTV':'LPTV / TAG','MT-B':'Patente B','MT-A':'Moto','MT-C-CE':'C / CE','MT-D':'Bus D'},
  en:{all:'All courses','MT-LPTV':'LPTV / TAG','MT-B':'Category B','MT-A':'Motorcycle','MT-C-CE':'C / CE','MT-D':'Bus D'},
  mt:{all:'Il-korsijiet kollha','MT-LPTV':'LPTV / TAG','MT-B':'Kategorija B','MT-A':'Mutur','MT-C-CE':'C / CE','MT-D':'Xarabank D'}
};
function parse(v){try{return v?JSON.parse(v):null}catch(_){return null}}
function lang(){const l=String(parse(localStorage.getItem('mdm-v1-settings'))?.lang||document.documentElement.lang||'en').toLowerCase();return l.startsWith('it')?'it':l.startsWith('mt')?'mt':'en'}
function norm(s){return String(s||'').toLowerCase().replace(/\s+/g,' ').trim()}
function findSelect(){
  return [...document.querySelectorAll('select')].find(s=>{
    const t=norm([...s.options].map(o=>o.textContent).join(' | '));
    return t.includes('lptv')&&(t.includes('patente b')||t.includes('category b')||t.includes('kategorija b'));
  })||null;
}
function packIdForText(t){
  t=norm(t);
  if(t.includes('lptv'))return'MT-LPTV';
  if(t.includes('patente b')||t.includes('category b')||t.includes('kategorija b'))return'MT-B';
  if(t.includes('moto')||t.includes('motorcycle')||t.includes('mutur'))return'MT-A';
  if(t.includes('c / ce')||t.includes('c/ce')||t.includes('camion c'))return'MT-C-CE';
  if(t.includes('bus d')||t.includes('xarabank d'))return'MT-D';
  return'';
}
function apply(){
  const s=findSelect(); if(!s)return false;
  const current=s.value;
  const old=[...s.options];
  const values={};
  for(const o of old){const id=packIdForText(o.textContent);if(id)values[id]=o.value}
  const allValue=old[0]?.value??'';
  const packs=(window.LicensePacks?.list?.()||[]).filter(p=>ORDER.includes(p.id)&&window.LicensePacks.activatable(p));
  if(packs.length<5)return false;
  const l=lang(), labels=LABELS[l];
  s.replaceChildren();
  const all=document.createElement('option');all.value=allValue;all.textContent=labels.all;s.appendChild(all);
  for(const id of ORDER){
    const p=packs.find(x=>x.id===id);if(!p)continue;
    const o=document.createElement('option');
    o.value=values[id]??id;
    o.textContent=labels[id];
    s.appendChild(o);
  }
  const allowed=[...s.options].some(o=>o.value===current);
  s.value=allowed?current:allValue;
  s.dataset.mdmFullCourseCatalog=VERSION;
  return true;
}
function schedule(){
  [0,80,200,500,1000,1800,3000,5000,8000,12000].forEach(ms=>setTimeout(apply,ms));
}
window.addEventListener('pageshow',schedule);
window.addEventListener('popstate',schedule);
window.addEventListener('hashchange',schedule);
document.addEventListener('visibilitychange',()=>{if(!document.hidden)schedule()});
window.MDM_SMART_MATCH_COURSES_458382527=Object.freeze({version:VERSION,apply});
schedule();
})();