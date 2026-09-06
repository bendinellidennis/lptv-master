/* Malta Driving Master 45.8.38.25.2.32.9 — Immediate Parent Home entry */
(function(){
'use strict';
if(window.MDM_RUNTIME_RECOVERY_4583825329)return;
const V='45.8.38.25.2.32.9',R={parent:'parentportal',debrief:'lessondebrief',ops:'schooloperations',fleet:'fleetcorporate'},PASSPORT='evidencepassport';
const CUSTOM=new Set(Object.values(R));
const $=s=>document.querySelector(s),parse=v=>{try{return v?JSON.parse(v):null}catch(_){return null}},esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function lang(){const l=String(parse(localStorage.getItem('mdm-v1-settings'))?.lang||'en');return ['it','en','mt'].includes(l)?l:'en'}
function t(it,en,mt){return lang()==='it'?it:lang()==='mt'?mt:en}
function route(){return String(location.hash||'').replace(/^#/,'').split('?')[0]}
function session(){const s=parse(localStorage.getItem('mdm_auth_session_v4410'));return s&&s.status==='authenticated'&&s.user?.id&&(!Number(s.expiresAt)||Number(s.expiresAt)>Date.now())?s:null}
function owner(){return window.MDM_OWNER_AUTHORITY?.isOwner?.()===true}
function school(){if(owner())return true;const s=window.MDM_PRIVILEGED_ROUTE_GUARD?.schoolSnapshot?.();return !!(s&&s.status==='verified'&&s.authorized===true)}
function student(){return !!session()&&!owner()&&!school()}
function nativeGo(name){history.pushState({name},'','#'+name);window.dispatchEvent(new PopStateEvent('popstate',{state:{name}}))}
function resetTop(){
  try{window.scrollTo({top:0,left:0,behavior:'auto'})}catch(_){try{window.scrollTo(0,0)}catch(__){}}
  try{document.documentElement.scrollTop=0;document.body.scrollTop=0}catch(_){}
}
function customGo(name){
  history.pushState({mdmRecovery:name},'','#'+name);
  resetTop();
  render();
  requestAnimationFrame(resetTop);
}
function go(name){if(CUSTOM.has(name))customGo(name);else nativeGo(name)}
function button(label,name){return '<button type="button" class="btn" data-recovery-go="'+name+'">'+esc(label)+' →</button>'}
function showHeaderBack(fallback){
 const b=document.getElementById('backBtn');if(!b)return;
 if(b.dataset.mdmRecoveryOwned!=='1'){
   b.dataset.mdmRecoveryOwned='1';
   b.dataset.mdmRecoveryWasHidden=b.classList.contains('hidden')?'1':'0';
 }
 b.dataset.mdmRecoveryBack=fallback||'home';
 b.classList.remove('hidden');
 b.setAttribute('aria-label',t('Indietro','Back','Lura'));
}
function restoreHeaderBack(){
 const b=document.getElementById('backBtn');if(!b||b.dataset.mdmRecoveryOwned!=='1')return;
 if(b.dataset.mdmRecoveryWasHidden==='1')b.classList.add('hidden');else b.classList.remove('hidden');
 delete b.dataset.mdmRecoveryOwned;delete b.dataset.mdmRecoveryWasHidden;delete b.dataset.mdmRecoveryBack;
}
function restoreScreen(){
 const s=$('#screen');if(!s)return;
 const host=document.getElementById('mdmRecoveryRouteHost');if(host)host.remove();
 Array.from(s.children).forEach(el=>{
   if(el.dataset?.mdmRecoveryHidden!=='1')return;
   const old=el.dataset.mdmRecoveryDisplay||'';
   if(old)el.style.display=old;else el.style.removeProperty('display');
   delete el.dataset.mdmRecoveryHidden;delete el.dataset.mdmRecoveryDisplay;
 });
}
function hostFor(r){
 const s=$('#screen');if(!s)return null;
 let host=document.getElementById('mdmRecoveryRouteHost');
 if(!host){
   Array.from(s.children).forEach(el=>{
     el.dataset.mdmRecoveryHidden='1';
     el.dataset.mdmRecoveryDisplay=el.style.display||'';
     el.style.display='none';
   });
   host=document.createElement('section');
   host.id='mdmRecoveryRouteHost';
   host.className='mdm-recovered-route-host';
   s.appendChild(host);
 }
 host.style.display='';
 if(host.dataset.route!==r){host.dataset.route=r;host.dataset.version=V;host.innerHTML='';}
 return host;
}
function shell(title,lead,body,back){
 showHeaderBack(back);
 const r=route(),h=hostFor(r);if(!h)return false;
 if(h.dataset.ready==='1'&&h.dataset.route===r)return true;
 h.innerHTML='<section class="card mdm-recovered-route"><small>MDM · '+V+'</small><h2>'+esc(title)+'</h2><p>'+esc(lead)+'</p>'+body+'<div style="margin-top:18px"><button type="button" class="btn secondary" data-recovery-back="'+esc(back)+'">← '+esc(t('Indietro','Back','Lura'))+'</button></div></section>';
 h.dataset.ready='1';return true;
}
function render(){
 const r=route();
 if(!CUSTOM.has(r))return false;
 if(r===R.parent){if(!student())return false;return shell('Parent / Sponsor Portal',t('Condivisione controllata dallo studente.','Sharing controlled by the learner.','Qsim ikkontrollat mill-istudent.'),'<div class="card"><h3>'+esc(t('Report condivisibile','Shareable report','Rapport li jista’ jinqasam'))+'</h3><p>'+esc(t('Progresso, evidenze e prossimo obiettivo restano sotto il controllo dello studente.','Progress, evidence and the next goal remain under learner control.','Il-progress, l-evidenza u l-għan li jmiss jibqgħu taħt il-kontroll tal-istudent.'))+'</p>'+button(t('Apri Competence Passport','Open Competence Passport','Iftaħ il-Competence Passport'),'evidencepassport')+'</div>','home')}
 if(r===R.debrief){if(!student())return false;if(document.querySelector('#screen .ai-debrief-hero,#screen .ai-debrief-title')){showHeaderBack('practicallesson');resetTop();return true}return shell('AI Lesson Debrief',t('Debrief post-lezione basato sulle prove già registrate.','Post-lesson debrief grounded in evidence already recorded.','Debrief wara l-lezzjoni bbażat fuq evidenza diġà rreġistrata.'),'<div class="card">'+button(t('Torna alla lezione pratica','Return to practical lesson','Erġa’ lura għal-lezzjoni prattika'),'practicallesson')+'</div>','practicallesson')}
 if(r===R.ops){if(!school())return false;return shell(t('Operazioni scuola','School Operations','Operazzjonijiet tal-Iskola'),t('Area operativa riservata alla scuola verificata.','Operational area reserved for the verified school.','Żona operattiva riservata għall-iskola vverifikata.'),'<div class="card">'+button(t('Apri studenti','Open students','Iftaħ l-istudenti'),'schoolroster')+'</div>','schoolhome')}
 if(r===R.fleet){if(!school())return false;return shell('Fleet / Corporate Driver Intelligence',t('Vista professionale riservata alla scuola verificata.','Professional view reserved for the verified school.','Veduta professjonali riservata għall-iskola vverifikata.'),'<div class="card">'+button(t('Torna alla scuola','Return to school','Erġa’ lura għall-iskola'),'schoolhome')+'</div>','schoolhome')}
 return false;
}
function card(id,icon,title,sub,name){
 let b=document.getElementById(id);if(!b){b=document.createElement('button');b.id=id;b.type='button'}
 b.className='sch35-card blue';b.style.cssText='text-align:left;width:100%;cursor:pointer;border:0;font:inherit;color:inherit';
 b.setAttribute('data-recovery-go',name);
 b.innerHTML='<div style="font-size:30px;line-height:1;margin-bottom:12px">'+icon+'</div><strong style="display:block;font-size:17px;margin-bottom:5px">'+esc(title)+'</strong><span style="display:block;font-size:12px;opacity:.72">'+esc(sub)+'</span>';
 return b;
}
function norm(v){return String(v||'').replace(/\s+/g,' ').trim().toUpperCase()}
function studentSchoolGrid(){
 const direct=document.querySelector('#screen [data-go="practicallesson"],#screen [data-go="schoolportal2"],#screen [data-go="schoolhome"]');
 if(direct?.parentElement)return direct.parentElement;
 const titles=Array.from(document.querySelectorAll('#screen h1,#screen h2,#screen h3,#screen h4,#screen strong'));
 const title=titles.find(e=>{
   const x=norm(e.textContent);
   return x.includes('SCUOLA E ISTRUTTORE')||x.includes('SCHOOL AND INSTRUCTOR')||(x.includes('SKOLA')&&x.includes('GĦALLIEM'));
 });
 if(!title)return null;
 let n=title.nextElementSibling;
 for(let i=0;n&&i<5;i++,n=n.nextElementSibling){
   if(n.matches?.('.hm30-grid,.grid,[class*="grid"]'))return n;
 }
 const box=title.parentElement;
 if(box){
   const grids=Array.from(box.querySelectorAll?.('.hm30-grid,.grid,[class*="grid"]')||[]);
   const t=title.getBoundingClientRect?.().top||0;
   const g=grids.filter(x=>(x.getBoundingClientRect?.().top||0)>=t-2).sort((a,b)=>(a.getBoundingClientRect?.().top||0)-(b.getBoundingClientRect?.().top||0))[0];
   if(g)return g;
 }
 return null;
}
function advancedGrid(){
 const a=document.getElementById('mdmSchoolTelemetryCard')||document.getElementById('mdmSchoolEvidenceSafeCard');if(a?.parentElement)return a.parentElement;
 const titles=Array.from(document.querySelectorAll('#screen .sch35-title,#screen h1,#screen h2,#screen h3,#screen h4,#screen strong'));
 const title=titles.find(e=>{const x=norm(e.textContent);return x.includes('STRUMENTI AVANZATI')||x.includes('ADVANCED TOOLS')||x.includes('GĦODOD AVVANZATI')});
 if(!title)return null;
 const box=title.closest('.sch35,.sch35-profile')||title.parentElement,top=title.getBoundingClientRect?.().top||0;
 return Array.from(box?.querySelectorAll?.('.sch35-grid,[class*="grid"]')||[]).filter(g=>(g.getBoundingClientRect?.().top||0)>=top-2).sort((a,b)=>(a.getBoundingClientRect?.().top||0)-(b.getBoundingClientRect?.().top||0))[0]||null;
}
function entries(){
 const r=route();
 if((!r||r==='home')&&!owner()){
   const g=studentSchoolGrid();
   if(g){
     const b=card('mdmParentSponsorHomeCard','👪','Parent / Sponsor Portal',t('Report condiviso solo su scelta dello studente.','Report shared only by learner choice.','Rapport maqsum biss bl-għażla tal-istudent.'),R.parent);
     b.className=g.querySelector?.('.hm30-card')?'hm30-card':($('.hm30-card')?'hm30-card':'home-card');
     if(b.parentElement!==g)g.appendChild(b);
   }
 }
 if(r==='schoolhome'&&school()){
   const g=advancedGrid();
   if(g)[['mdmSchoolOperationsHomeCard','🏫',t('Operazioni scuola','School Operations','Operazzjonijiet tal-Iskola'),R.ops],['mdmFleetCorporateHomeCard','🚚','Fleet / Corporate Driver Intelligence',R.fleet]].forEach(x=>{const b=card(x[0],x[1],x[2],t('Modulo operativo verificato.','Verified operational module.','Modulu operattiv ivverifikat.'),x[3]);if(b.parentElement!==g)g.appendChild(b)});
 }
 if(r==='practicallesson'&&student()&&!document.getElementById('mdmAIDebriefPracticalLaunch')){
   const s=$('#screen');if(s){const b=document.createElement('section');b.id='mdmAIDebriefPracticalLaunch';b.className='card';b.innerHTML='<h3>AI Lesson Debrief</h3><p>'+esc(t('Debrief post-lezione basato sulle prove già registrate.','Post-lesson debrief grounded in evidence already recorded.','Debrief wara l-lezzjoni bbażat fuq evidenza diġà rreġistrata.'))+'</p>'+button(t('Apri debrief','Open debrief','Iftaħ id-debrief'),R.debrief);s.appendChild(b)}
 }
}
function place(){
 const r=route();
 if(r===PASSPORT)showHeaderBack('home');
 if(!render()){
   if(r!==PASSPORT)restoreHeaderBack();
   restoreScreen();
   entries();
 }
}
function schedule(){let n=0;function tick(){place();if(++n<120)requestAnimationFrame(tick)}requestAnimationFrame(tick);[120,240,480,800,1200,1800,2600].forEach(ms=>setTimeout(place,ms))}
document.addEventListener('click',e=>{
 const headerBack=e.target?.closest?.('#backBtn');
 if(headerBack&&(CUSTOM.has(route())||route()===PASSPORT)){
   e.preventDefault();e.stopImmediatePropagation();
   const fallback=headerBack.dataset.mdmRecoveryBack||'home';
   if(history.length>1)history.back();else nativeGo(fallback);
   return;
 }
 const nativeDebrief=e.target?.closest?.('[data-go="lessondebrief"]');
 if(nativeDebrief){[0,60,160].forEach(ms=>setTimeout(resetTop,ms))}
 const back=e.target?.closest?.('[data-recovery-back]');
 if(back){e.preventDefault();e.stopImmediatePropagation();const fallback=back.getAttribute('data-recovery-back');if(history.length>1)history.back();else nativeGo(fallback);return}
 const b=e.target?.closest?.('[data-recovery-go]');if(!b)return;
 e.preventDefault();e.stopImmediatePropagation();go(b.getAttribute('data-recovery-go'));
},true);
window.addEventListener('popstate',()=>{schedule();if(CUSTOM.has(route())){resetTop();requestAnimationFrame(resetTop)}});
window.addEventListener('pageshow',()=>{schedule();if(CUSTOM.has(route()))resetTop()});
window.addEventListener('mdm:owner-authority',schedule);
document.addEventListener('visibilitychange',()=>{if(!document.hidden)schedule()});
schedule();
window.MDM_RUNTIME_RECOVERY_4583825329=Object.freeze({version:V,routes:R,passport:PASSPORT,refresh:schedule,resetTop,place,studentSchoolGrid});
})();