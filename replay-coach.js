
(function(global){
 'use strict';

 const STORAGE_KEY='mdm-replay-coach-v1';

 function loadState(){
  try{
   const parsed=JSON.parse(localStorage.getItem(STORAGE_KEY)||'null');
   if(parsed&&typeof parsed==='object')return parsed;
  }catch(_){}
  return {categories:{},history:[],version:1};
 }

 function saveState(state){
  try{localStorage.setItem(STORAGE_KEY,JSON.stringify(state));}catch(_){}
 }

 function categoryKey(question,scene){
  return scene?.category||question?.topic||'general';
 }

 function ensureCategory(state,key){
  if(!state.categories[key]){
   state.categories[key]={
    attempts:0,
    misses:0,
    hits:0,
    totalReactionMs:0,
    lastReactionMs:0,
    streak:0,
    difficulty:1
   };
  }
  return state.categories[key];
 }

 function updateDifficulty(cat){
  const attempts=Math.max(1,cat.attempts);
  const accuracy=cat.hits/attempts;
  const avg=cat.hits?cat.totalReactionMs/cat.hits:99999;

  let difficulty=1;
  if(attempts>=3&&accuracy>=.65)difficulty=2;
  if(attempts>=6&&accuracy>=.78&&avg<=5000)difficulty=3;
  if(attempts>=10&&accuracy>=.86&&avg<=3500)difficulty=4;

  cat.difficulty=Math.max(cat.difficulty||1,difficulty);
  return cat.difficulty;
 }

 function record(question,scene,result){
  const state=loadState();
  const key=categoryKey(question,scene);
  const cat=ensureCategory(state,key);

  cat.attempts+=1;
  cat.lastReactionMs=Number(result.elapsed||0);

  if(result.hit){
   cat.hits+=1;
   cat.streak=(cat.streak||0)+1;
   cat.totalReactionMs+=Number(result.elapsed||0);
  }else{
   cat.misses+=1;
   cat.streak=0;
  }

  updateDifficulty(cat);

  state.history.unshift({
   at:new Date().toISOString(),
   questionId:question?.id||null,
   sceneId:scene?.id||null,
   category:key,
   hit:!!result.hit,
   elapsed:Number(result.elapsed||0),
   x:Number(result.x||0),
   y:Number(result.y||0),
   difficulty:cat.difficulty
  });
  state.history=state.history.slice(0,100);
  saveState(state);

  return {state,category:cat,key};
 }

 function getProfile(question,scene){
  const state=loadState();
  const key=categoryKey(question,scene);
  return ensureCategory(state,key);
 }

 function coachMessage(question,scene,result,language='en'){
  const {category}=record(question,scene,result);
  const fast=result.elapsed>0&&result.elapsed<=2200;
  const slow=result.elapsed>=6000;
  const repeatedMiss=category.misses>=2&&category.streak===0;

  const it=language==='it';

  if(!result.hit){
   if(repeatedMiss){
    return {
     tone:'warning',
     title:it?'Stai guardando troppo tardi':'You are looking too late',
     body:it
      ?'Concentrati sul punto in cui la strada smette di essere completamente visibile, prima di pensare al sorpasso.'
      :'Focus on where the road stops being fully visible, before considering an overtake.'
    };
   }
   return {
    tone:'warning',
    title:it?'Il pericolo è più avanti':'The hazard is further ahead',
    body:it
     ?'Non guardare soltanto il veicolo davanti: cerca il punto in cui perdi la visuale della corsia opposta.'
     :'Do not watch only the vehicle ahead: find where you lose sight of the opposing lane.'
   };
  }

  if(fast&&category.streak>=2){
   return {
    tone:'success',
    title:it?'Ottima percezione':'Excellent hazard perception',
    body:it
     ?'Hai individuato rapidamente il punto critico. Mantieni questa attenzione anche quando cambiano strada, traffico o meteo.'
     :'You identified the critical point quickly. Keep this focus when the road, traffic or weather changes.'
   };
  }

  if(slow){
   return {
    tone:'info',
    title:it?'Risposta corretta, ma troppo lenta':'Correct, but too slow',
    body:it
     ?'Hai trovato il pericolo, ma nella guida reale devi riconoscerlo prima di iniziare la manovra.'
     :'You found the hazard, but in real driving you must recognise it before starting the manoeuvre.'
   };
  }

  return {
   tone:'success',
   title:it?'Decisione corretta':'Correct decision',
   body:it
    ?'Hai riconosciuto che senza visuale completa non esiste margine sufficiente per sorpassare.'
    :'You recognised that without a complete view there is not enough margin to overtake.'
  };
 }

 function variantFor(question,scene){
  const profile=getProfile(question,scene);
  const variants=[
   {id:'clear-day',labelIt:'Giorno · traffico leggero',labelEn:'Day · light traffic'},
   {id:'busy-day',labelIt:'Giorno · traffico moderato',labelEn:'Day · moderate traffic'},
   {id:'wet-road',labelIt:'Strada bagnata',labelEn:'Wet road'},
   {id:'night',labelIt:'Notte',labelEn:'Night'}
  ];
  return variants[Math.min(variants.length-1,Math.max(0,(profile.difficulty||1)-1))];
 }

 global.ReplayCoach=Object.freeze({
  version:'1.0.0',
  record,
  coachMessage,
  getProfile,
  variantFor,
  loadState
 });
})(window);
