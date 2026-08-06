
(function(global){
 'use strict';

 const catalog=new Map();

 function register(entry){
  if(!entry||!entry.key)throw new Error('Scene catalog key missing');
  if(!entry.category)throw new Error('Scene category missing');
  catalog.set(entry.key,Object.freeze(entry));
  return entry;
 }

 function get(key){return catalog.get(key)||null;}
 function list(){return Array.from(catalog.values());}

 function classifyQuestion(question){
  const text=`${question?.question||''} ${(question?.answers||[]).join(' ')}`.toLowerCase();

  if(question?.id==='CARS2.6'||/never wave|urge people across|invite.*gesture|invitare.*gesto/.test(text))return 'pedestrianWaveAcross';
  if(/overtak|limited view|crest|blind bend|curve/.test(text))return 'overtakeLimitedView';
  if(/pedestrian|parked cars|crossing|pelican/.test(text))return 'pedestrianHidden';
  if(/blind spot|motorcycl|shoulder check/.test(text))return 'motorcycleBlindSpot';
  if(/bus stop|bus pulling|passenger boarding/.test(text))return 'busStopDeparture';
  if(/tunnel|breakdown|hazard lights/.test(text))return 'tunnelBreakdown';
  if(/roundabout|junction|intersection|give way/.test(text))return 'junctionRoundabout';
  return null;
 }

 function validate(entry,scene,pack){
  if(!entry)return {ok:false,reason:'catalog-missing'};
  if(entry.status!=='ready')return {ok:false,reason:'scene-not-ready'};
  if(!scene)return {ok:false,reason:'engine-scene-missing'};
  if(scene.sceneKey!==entry.key)return {ok:false,reason:'scene-key-mismatch'};
  if(scene.countryPackId!==pack?.id)return {ok:false,reason:'country-pack-mismatch'};
  if(scene.drivingSide!==pack?.drivingSide)return {ok:false,reason:'driving-side-mismatch'};
  return {ok:true,reason:'ready'};
 }

 function readyCount(){
  return list().filter(item=>item.status==='ready').length;
 }

 global.SceneCatalog=Object.freeze({
  version:'1.0.0',
  register,get,list,classifyQuestion,validate,readyCount
 });
})(window);
