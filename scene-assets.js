
(function(global){
 'use strict';

 const manifests=new Map();
 const verified=new Map();

 function register(manifest){
  if(!manifest||!manifest.sceneKey)throw new Error('Scene asset sceneKey missing');
  if(!manifest.countryPackId)throw new Error('Scene asset countryPackId missing');
  manifests.set(manifest.sceneKey,Object.freeze(manifest));
  return manifest;
 }

 function get(sceneKey){return manifests.get(sceneKey)||null;}
 function list(){return Array.from(manifests.values());}

 async function fileExists(url){
  if(!url)return false;
  try{
   const response=await fetch(url,{method:'HEAD',cache:'no-store'});
   return response.ok;
  }catch(_){
   return false;
  }
 }

 function validateMetadata(manifest,pack){
  const problems=[];
  if(!manifest)problems.push('manifest-missing');
  if(manifest&&manifest.countryPackId!==pack?.id)problems.push('country-pack-mismatch');
  if(manifest&&manifest.drivingSide!==pack?.drivingSide)problems.push('driving-side-mismatch');
  if(manifest&&manifest.status!=='approved')problems.push('asset-not-approved');
  if(manifest&&!manifest.video)problems.push('video-missing');
  if(manifest&&!manifest.poster)problems.push('poster-missing');
  return {ok:problems.length===0,problems};
 }

 async function verify(sceneKey,pack){
  const manifest=get(sceneKey);
  const meta=validateMetadata(manifest,pack);
  if(!meta.ok){
   const result={ok:false,sceneKey,problems:meta.problems,manifest};
   verified.set(sceneKey,result);
   return result;
  }

  const remote=/^https?:/i.test(manifest.video||'');
  if(remote){
   const result={ok:true,sceneKey,problems:[],manifest,remote:true};
   verified.set(sceneKey,result);
   return result;
  }

  const [videoOk,posterOk]=await Promise.all([
   fileExists(manifest.video),
   fileExists(manifest.poster)
  ]);

  const problems=[];
  if(!videoOk)problems.push('video-file-unavailable');
  if(!posterOk)problems.push('poster-file-unavailable');

  const result={ok:problems.length===0,sceneKey,problems,manifest,remote:false};
  verified.set(sceneKey,result);
  return result;
 }

 function lastVerification(sceneKey){return verified.get(sceneKey)||null;}

 global.SceneAssets=Object.freeze({
  version:'1.0.0',
  register,get,list,verify,lastVerification,validateMetadata
 });
})(window);
