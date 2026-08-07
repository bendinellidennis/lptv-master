(function(global){
 'use strict';
 function run(){
  const questions=global.LPTV_QUESTIONS||[];
  const pack=global.CountryPacks?.get?.('MT-LPTV')||global.MaltaPack||null;
  const report=global.SceneCatalog?.audit?.({questions,engine:global.ReplayEngine,assets:global.SceneAssets,pack})||{ok:false,errors:[{code:'audit-unavailable'}],warnings:[]};
  global.ReplaySceneAudit=Object.freeze(report);
  if(!report.ok){
   console.error('[Replay Scene Audit] BLOCKED',report.errors);
  }else{
   console.info('[Replay Scene Audit] PASS', {ready:global.SceneCatalog.readyCount(),warnings:report.warnings});
  }
  return report;
 }
 global.runReplaySceneAudit=run;
})(window);
