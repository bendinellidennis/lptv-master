/* Malta Driving Master 45.8.38.25.2.11 — Smart Match persistent full course catalog */
(function(){
'use strict';
if(window.MDM_SMART_MATCH_COURSES_458382527)return;

const VERSION='45.8.38.25.2.11';
const ORDER=['MT-LPTV','MT-B','MT-A','MT-C-CE','MT-D'];
const KEEP_KEY='mdm-smart-match-course-v1';
const LABELS={
  it:{all:'Tutti i corsi','MT-LPTV':'LPTV / TAG','MT-B':'Patente B','MT-A':'Moto','MT-C-CE':'C / CE','MT-D':'Bus D'},
  en:{all:'All courses','MT-LPTV':'LPTV / TAG','MT-B':'Category B','MT-A':'Motorcycle','MT-C-CE':'C / CE','MT-D':'Bus D'},
  mt:{all:'Il-korsijiet kollha','MT-LPTV':'LPTV / TAG','MT-B':'Kategorija B','MT-A':'Mutur','MT-C-CE':'C / CE','MT-D':'Xarabank D'}
};

function parse(v){try{return v?JSON.parse(v):null}catch(_){return null}}
function lang(){
  const l=String(parse(localStorage.getItem('mdm-v1-settings'))?.lang||document.documentElement.lang||'en').toLowerCase();
  return l.startsWith('it')?'it':l.startsWith('mt')?'mt':'en';
}
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
function saved(){
  try{return sessionStorage.getItem(KEEP_KEY)||''}catch(_){return''}
}
function save(v){
  try{sessionStorage.setItem(KEEP_KEY,String(v||''))}catch(_){}
}
function correct(s,l){
  const labels=LABELS[l];
  if(s.options.length!==6)return false;
  const texts=[...s.options].map(o=>String(o.textContent||'').trim());
  return texts[0]===labels.all &&
    texts[1]===labels['MT-LPTV'] &&
    texts[2]===labels['MT-B'] &&
    texts[3]===labels['MT-A'] &&
    texts[4]===labels['MT-C-CE'] &&
    texts[5]===labels['MT-D'];
}
function apply(){
  const s=findSelect(); if(!s)return false;
  const l=lang(), labels=LABELS[l];

  if(correct(s,l)){
    if(!s.dataset.mdmCourseBound){
      s.addEventListener('change',()=>save(s.value));
      s.dataset.mdmCourseBound='1';
    }
    return true;
  }

  const old=[...s.options];
  const values={};
  for(const o of old){
    const id=packIdForText(o.textContent);
    if(id)values[id]=o.value;
  }
  const allValue=old.find(o=>!packIdForText(o.textContent))?.value ?? '';
  const current=s.value;
  const keep=saved()||current;

  const defs=[
    ['ALL',allValue,labels.all],
    ['MT-LPTV',values['MT-LPTV']??'MT-LPTV',labels['MT-LPTV']],
    ['MT-B',values['MT-B']??'MT-B',labels['MT-B']],
    ['MT-A','MT-A',labels['MT-A']],
    ['MT-C-CE','MT-C-CE',labels['MT-C-CE']],
    ['MT-D','MT-D',labels['MT-D']]
  ];

  const frag=document.createDocumentFragment();
  for(const [id,value,label] of defs){
    const o=document.createElement('option');
    o.value=value;
    o.textContent=label;
    o.dataset.mdmPackId=id;
    frag.appendChild(o);
  }
  s.replaceChildren(frag);

  const canKeep=[...s.options].some(o=>o.value===keep);
  s.value=canKeep?keep:allValue;
  s.dataset.mdmFullCourseCatalog=VERSION;
  if(!s.dataset.mdmCourseBound){
    s.addEventListener('change',()=>save(s.value));
    s.dataset.mdmCourseBound='1';
  }
  return true;
}

let timers=[];
function schedule(){
  timers.forEach(clearTimeout); timers=[];
  [0,60,150,300,600,1000,1800,3000,5000,8000,12000].forEach(ms=>{
    timers.push(setTimeout(apply,ms));
  });
}
window.addEventListener('pageshow',schedule);
window.addEventListener('popstate',schedule);
window.addEventListener('hashchange',schedule);
document.addEventListener('visibilitychange',()=>{if(!document.hidden)schedule()});

/* The Smart Match view is rebuilt by the SPA after navigation.
   A tiny idempotent check keeps only this selector in sync without a global MutationObserver. */
const heartbeat=setInterval(()=>{if(!document.hidden)apply()},750);
window.MDM_SMART_MATCH_COURSES_458382527=Object.freeze({version:VERSION,apply,schedule,heartbeat});
schedule();
})();