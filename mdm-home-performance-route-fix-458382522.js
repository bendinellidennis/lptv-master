/* Malta Driving Master 45.8.38.25.2.4 — Student Home performance-card route fix
   Fixes two wrong Home links without touching the core learning engines:
   Readiness -> Exam Day readiness predictor
   Pattern   -> AI cognitive pattern analysis
   Existing route handlers remain authoritative; this module only corrects the Home card targets
   and focuses the relevant section after navigation. */
(function(){
'use strict';
if(window.MDM_HOME_PERFORMANCE_ROUTE_FIX_458382522)return;
window.MDM_HOME_PERFORMANCE_ROUTE_FIX_458382522=true;

const VERSION='45.8.38.25.2.2';
const FOCUS_KEY='mdm-home-performance-focus-v1';

function routeName(){
 return String(location.hash||'').replace(/^#/,'').split('?')[0].trim();
}
function cardByTitle(title){
 return Array.from(document.querySelectorAll('.hm30-card')).find(card=>
  String(card.querySelector('h3')?.textContent||'').trim().toLowerCase()===String(title).toLowerCase()
 )||null;
}
function patchHome(){
 const route=routeName();
 if(route&&route!=='home')return false;
 const readiness=cardByTitle('Readiness');
 const pattern=cardByTitle('Pattern');
 if(readiness){
  readiness.dataset.go='examday';
  readiness.dataset.mdmRouteFix='readiness';
 }
 if(pattern){
  pattern.dataset.go='aiinstructor';
  pattern.dataset.mdmRouteFix='pattern';
 }
 return Boolean(readiness||pattern);
}
function rememberFocus(event){
 const card=event.target?.closest?.('.hm30-card[data-mdm-route-fix]');
 if(!card)return;
 const focus=String(card.dataset.mdmRouteFix||'');
 if(focus==='readiness'||focus==='pattern'){
  try{sessionStorage.setItem(FOCUS_KEY,focus)}catch(_){}
 }
}
function focusDestination(){
 let focus='';
 try{focus=sessionStorage.getItem(FOCUS_KEY)||''}catch(_){}
 const route=routeName();

 let target=null;
 if(focus==='readiness'&&route==='examday')target=document.querySelector('.ai-readiness-predictor');
 if(focus==='pattern'&&route==='aiinstructor')target=document.querySelector('.ai-pattern-engine');
 if(!target)return false;

 /*
   Do not scroll into the middle of a long host page.
   These Home cards represent a specific feature, so when opened from Home
   the requested feature is temporarily promoted directly below the page title.
   The underlying page/engine is untouched; a normal re-render restores its
   original layout.
 */
 const title=document.querySelector('#screen > .section-title')||document.querySelector('#screen .section-title');
 if(title&&target.previousElementSibling!==title){
   title.insertAdjacentElement('afterend',target);
 }

 try{window.scrollTo({top:0,left:0,behavior:'auto'})}catch(_){try{window.scrollTo(0,0)}catch(__){}}
 try{sessionStorage.removeItem(FOCUS_KEY)}catch(_){}
 return true;
}
function sync(){
 patchHome();
 focusDestination();
}
document.addEventListener('click',rememberFocus,true);
const screen=document.getElementById('screen');
if(screen){
 const observer=new MutationObserver(sync);
 observer.observe(screen,{childList:true,subtree:true});
 window.__MDM_HOME_PERFORMANCE_ROUTE_FIX_OBSERVER__=observer;
}
[0,60,160,350,700,1200].forEach(ms=>setTimeout(sync,ms));
window.addEventListener('pageshow',sync);
window.addEventListener('popstate',sync);
document.addEventListener('visibilitychange',()=>{if(!document.hidden)sync()});
window.MDM_HOME_PERFORMANCE_ROUTE_FIX=Object.freeze({version:VERSION,refresh:sync});
})();