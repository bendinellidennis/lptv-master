/* Malta Driving Master 45.8.38.25.2.8 — Smart Match course catalogue persistence
   Adds every active Malta licence pack to the "required course" selector.
   No MutationObserver: finite retries + existing SPA/page/language events only. */
(function(){
  'use strict';
  if(window.MDM_SMART_MATCH_COURSES_458382527)return;

  const VERSION='45.8.38.25.2.8';
  const SETTINGS_KEY='mdm-v1-settings';

  function parse(v){try{return v?JSON.parse(v):null}catch(_){return null}}
  function lang(){
    const l=String(parse(localStorage.getItem(SETTINGS_KEY))?.lang||'en').toLowerCase();
    return ['it','en','mt'].includes(l)?l:'en';
  }

  const LABELS={
    it:{all:'Tutti i corsi',lptv:'LPTV / TAG',B:'Patente B',A:'Moto A','C/CE':'Camion C / CE',D:'Bus D'},
    en:{all:'All courses',lptv:'LPTV / TAG',B:'Category B',A:'Motorcycle A','C/CE':'Truck C / CE',D:'Bus D'},
    mt:{all:'Il-korsijiet kollha',lptv:'LPTV / TAG',B:'Kategorija B',A:'Mutur A','C/CE':'Trakk C / CE',D:'Xarabank D'}
  };

  function textOf(o){return String(o?.textContent||'').trim()}
  function norm(s){return String(s||'').trim().toLowerCase()}

  function findCourseSelect(){
    return Array.from(document.querySelectorAll('select')).find(sel=>{
      const texts=Array.from(sel.options).map(textOf);
      const joined=texts.join(' | ').toLowerCase();
      const hasLptv=joined.includes('lptv');
      const hasB=texts.some(t=>/\bpatente\s*b\b/i.test(t)||/\bcategory\s*b\b/i.test(t)||/\bkategorija\s*b\b/i.test(t)||/^b$/i.test(t));
      return hasLptv&&hasB;
    })||null;
  }

  function courseValue(type,bValue){
    const b=String(bValue||'').trim();
    if(/^mt-b$/i.test(b)){
      return type==='A'?'MT-A':type==='C/CE'?'MT-C-CE':'MT-D';
    }
    if(b==='b')return type==='A'?'a':type==='C/CE'?'cce':'d';
    if(b==='B')return type==='A'?'A':type==='C/CE'?'C/CE':'D';
    if(/category[-_ ]?b/i.test(b))return type==='A'?'category-a':type==='C/CE'?'category-c-ce':'category-d';
    return type==='A'?'a':type==='C/CE'?'cce':'d';
  }

  let observedSelect=null;
  let optionObserver=null;

  function bindOptionPersistence(sel){
    if(observedSelect===sel)return;
    if(optionObserver)optionObserver.disconnect();
    observedSelect=sel;
    optionObserver=new MutationObserver(()=>{
      clearTimeout(bindOptionPersistence._t);
      bindOptionPersistence._t=setTimeout(()=>patch(),20);
    });
    optionObserver.observe(sel,{childList:true});
  }

  function patch(){
    const sel=findCourseSelect();
    if(!sel)return false;

    const current=sel.value;
    const L=LABELS[lang()];

    const opts=Array.from(sel.options);
    const lptvOpt=opts.find(o=>/lptv/i.test(textOf(o)));
    const bOpt=opts.find(o=>/\bpatente\s*b\b/i.test(textOf(o))||/\bcategory\s*b\b/i.test(textOf(o))||/\bkategorija\s*b\b/i.test(textOf(o))||/^b$/i.test(textOf(o)));

    const general=opts.find(o=>!o.disabled&&(
      /tutti gli argomenti/i.test(textOf(o))||
      /tutti i corsi/i.test(textOf(o))||
      /all topics/i.test(textOf(o))||
      /all courses/i.test(textOf(o))||
      /il-korsijiet kollha/i.test(textOf(o))
    )) || opts.find(o=>o.value===''||norm(o.value)==='all');

    if(general)general.textContent=L.all;
    if(lptvOpt)lptvOpt.textContent=L.lptv;
    if(bOpt)bOpt.textContent=L.B;

    const bValue=bOpt?.value||'B';
    const wanted=[
      {type:'A',label:L.A,value:courseValue('A',bValue),pack:'MT-A'},
      {type:'C/CE',label:L['C/CE'],value:courseValue('C/CE',bValue),pack:'MT-C-CE'},
      {type:'D',label:L.D,value:courseValue('D',bValue),pack:'MT-D'}
    ];

    for(const item of wanted){
      let o=Array.from(sel.options).find(x=>x.dataset?.mdmPackId===item.pack);
      if(!o){
        o=document.createElement('option');
        o.value=item.value;
        o.dataset.mdmPackId=item.pack;
        sel.appendChild(o);
      }
      o.textContent=item.label;
    }

    if(Array.from(sel.options).some(o=>o.value===current))sel.value=current;
    sel.dataset.mdmFullCourseCatalog='true';
    bindOptionPersistence(sel);
    return true;
  }

  let timers=[];
  function schedule(){
    timers.forEach(clearTimeout);timers=[];
    [0,120,400,900,1800,3200,5000,8000,12000].forEach(ms=>{
      timers.push(setTimeout(()=>{patch()},ms));
    });
  }

  window.addEventListener('pageshow',schedule);
  window.addEventListener('popstate',schedule);
  document.addEventListener('visibilitychange',()=>{if(!document.hidden)schedule()});

  const langBtn=document.getElementById('langBtn');
  if(langBtn)langBtn.addEventListener('click',()=>setTimeout(schedule,50));

  window.MDM_SMART_MATCH_COURSES_458382527=Object.freeze({version:VERSION,patch,schedule});
  schedule();
})();