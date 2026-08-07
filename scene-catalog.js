(function(global){
 'use strict';

 const catalog=new Map();
 const questionIndex=new Map();

 function freezeArray(value){return Object.freeze([...(Array.isArray(value)?value:[])]);}

 function register(raw){
  if(!raw||!raw.key)throw new Error('Scene catalog key missing');
  if(!raw.category)throw new Error(`Scene category missing: ${raw.key}`);
  if(catalog.has(raw.key))throw new Error(`Duplicate scene key: ${raw.key}`);

  const questionIds=freezeArray(raw.questionIds);
  if(raw.status==='ready'&&!questionIds.length)throw new Error(`Ready scene has no questionIds: ${raw.key}`);

  questionIds.forEach(id=>{
   if(questionIndex.has(id))throw new Error(`Question ${id} is already mapped to ${questionIndex.get(id)}`);
   questionIndex.set(id,raw.key);
  });

  const entry=Object.freeze({
   ...raw,
   questionIds,
   expectedCorrect:freezeArray(raw.expectedCorrect),
   required:freezeArray(raw.required),
   prohibited:freezeArray(raw.prohibited)
  });
  catalog.set(entry.key,entry);
  return entry;
 }

 function get(key){return catalog.get(key)||null;}
 function list(){return Array.from(catalog.values());}
 function classifyQuestion(question){return questionIndex.get(question?.id)||null;}

 function sameNumbers(a,b){
  const left=[...(a||[])].map(Number).sort((x,y)=>x-y);
  const right=[...(b||[])].map(Number).sort((x,y)=>x-y);
  return left.length===right.length&&left.every((value,index)=>value===right[index]);
 }

 function validate(entry,scene,pack,question,asset){
  if(!entry)return {ok:false,reason:'catalog-missing'};
  if(entry.status!=='ready')return {ok:false,reason:'scene-not-ready'};
  if(!question||!entry.questionIds.includes(question.id))return {ok:false,reason:'question-not-bound'};
  if(entry.expectedCorrect.length&&!sameNumbers(entry.expectedCorrect,question.correct))return {ok:false,reason:'correct-answer-mismatch'};
  if(!scene)return {ok:false,reason:'engine-scene-missing'};
  if(scene.sceneKey!==entry.key)return {ok:false,reason:'scene-key-mismatch'};
  if(scene.countryPackId!==pack?.id)return {ok:false,reason:'country-pack-mismatch'};
  if(scene.drivingSide!==pack?.drivingSide)return {ok:false,reason:'driving-side-mismatch'};
  if(!scene.media?.video)return {ok:false,reason:'video-missing'};
  if(!Array.isArray(scene.timeline)||scene.timeline.length<4)return {ok:false,reason:'timeline-incomplete'};
  if(!asset||asset.status!=='approved')return {ok:false,reason:'asset-not-approved'};
  if(asset.video!==scene.media.video)return {ok:false,reason:'asset-video-mismatch'};
  const tags=new Set(Array.isArray(asset.tags)?asset.tags:[]);
  const missingRequired=(entry.required||[]).filter(tag=>!tags.has(tag));
  if(missingRequired.length)return {ok:false,reason:'required-evidence-missing',missingRequired};
  const prohibitedFound=(entry.prohibited||[]).filter(tag=>tags.has(tag));
  if(prohibitedFound.length)return {ok:false,reason:'prohibited-evidence-found',prohibitedFound};
  return {ok:true,reason:'ready'};
 }

 function readyCount(){return list().filter(item=>item.status==='ready').length;}

 function audit({questions=[],engine,assets,pack}={}){
  const errors=[];
  const warnings=[];
  const byId=new Map((questions||[]).map(question=>[question.id,question]));
  const usedVideos=new Map();

  list().forEach(entry=>{
   if(entry.status!=='ready')return;
   const scene=entry.engineSceneId?engine?.getScene(entry.engineSceneId):null;
   const asset=assets?.get(entry.key)||null;

   entry.questionIds.forEach(id=>{
    const question=byId.get(id);
    if(!question){errors.push({sceneKey:entry.key,questionId:id,code:'question-missing'});return;}
    if(entry.expectedCorrect.length&&!sameNumbers(entry.expectedCorrect,question.correct)){
     errors.push({sceneKey:entry.key,questionId:id,code:'correct-answer-mismatch',expected:entry.expectedCorrect,actual:question.correct});
    }
   });

   const validation=validate(entry,scene,pack,byId.get(entry.questionIds[0]),asset);
   if(!validation.ok)errors.push({sceneKey:entry.key,code:validation.reason});

   const video=scene?.media?.video||asset?.video||'';
   if(video){
    if(usedVideos.has(video))errors.push({sceneKey:entry.key,code:'duplicate-video',otherSceneKey:usedVideos.get(video)});
    else usedVideos.set(video,entry.key);
   }

   if(String(scene?.visualStatus||'').includes('pilot'))errors.push({sceneKey:entry.key,code:'pilot-scene-not-final'});
   if(!scene?.media?.poster)warnings.push({sceneKey:entry.key,code:'poster-missing'});
  });

  return Object.freeze({ok:errors.length===0,errors:Object.freeze(errors),warnings:Object.freeze(warnings)});
 }

 global.SceneCatalog=Object.freeze({
  version:'2.0.0',
  register,get,list,classifyQuestion,validate,readyCount,audit
 });
})(window);
