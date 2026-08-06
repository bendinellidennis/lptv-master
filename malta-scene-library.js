
(function(global){
 'use strict';
 if(!global.SceneCatalog)throw new Error('SceneCatalog must load first');

 const entries=[
  {
   key:'pedestrianWaveAcross',
   category:'pedestrian',
   titleIt:'Non invitare il pedone ad attraversare',
   titleEn:'Never wave a pedestrian across',
   status:'ready',
   engineSceneId:'MT_PEDESTRIAN_WAVE_ACROSS_V1',
   countryPackId:'MT-LPTV',
   visualStatus:'real-footage-with-instructional-overlay',
   required:['pedestrian-crossing','moving-traffic','pedestrian-risk'],
   prohibited:['rural-road','overtaking']
  },
  {
   key:'overtakeLimitedView',
   category:'overtaking',
   titleIt:'Sorpasso con visuale limitata',
   titleEn:'Overtaking with limited visibility',
   status:'ready',
   engineSceneId:'MT_OVERTAKE_LIMITED_VIEW_PILOT',
   countryPackId:'MT-LPTV',
   visualStatus:'technical-pilot',
   required:['left-driving','two-way-road','limited-visibility'],
   prohibited:['right-driving','unrelated-skyline']
  },
  {
   key:'pedestrianHidden',
   category:'pedestrian',
   titleIt:'Pedone nascosto tra auto parcheggiate',
   titleEn:'Pedestrian hidden between parked cars',
   status:'production',
   engineSceneId:null,
   countryPackId:'MT-LPTV',
   visualStatus:'awaiting-malta-footage',
   required:['left-driving','urban-malta','parked-cars','pedestrian'],
   prohibited:['empty-landscape','motorway']
  },
  {
   key:'motorcycleBlindSpot',
   category:'motorcycle',
   titleIt:'Motocicletta nell’angolo cieco',
   titleEn:'Motorcycle in the blind spot',
   status:'production',
   engineSceneId:null,
   countryPackId:'MT-LPTV',
   visualStatus:'awaiting-malta-footage',
   required:['left-driving','mirror-view','motorcycle'],
   prohibited:['unrelated-rural-landscape']
  },
  {
   key:'busStopDeparture',
   category:'bus',
   titleIt:'Autobus in partenza dalla fermata',
   titleEn:'Bus departing from a stop',
   status:'planned',
   engineSceneId:null,
   countryPackId:'MT-LPTV',
   visualStatus:'planned',
   required:['malta-bus','left-driving','bus-stop'],
   prohibited:['non-malta-bus']
  },
  {
   key:'tunnelBreakdown',
   category:'tunnel',
   titleIt:'Guasto in galleria',
   titleEn:'Breakdown in a tunnel',
   status:'planned',
   engineSceneId:null,
   countryPackId:'MT-LPTV',
   visualStatus:'planned',
   required:['tunnel','hazard-lights','safe-stop'],
   prohibited:['open-road']
  },
  {
   key:'junctionRoundabout',
   category:'junction',
   titleIt:'Incrocio o rotatoria',
   titleEn:'Junction or roundabout',
   status:'planned',
   engineSceneId:null,
   countryPackId:'MT-LPTV',
   visualStatus:'planned',
   required:['left-driving','malta-markings','give-way'],
   prohibited:['right-driving']
  }
 ];

 entries.forEach(entry=>global.SceneCatalog.register(entry));
})(window);
