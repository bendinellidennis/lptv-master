
(function(global){
 'use strict';
 if(!global.SceneCatalog)throw new Error('SceneCatalog must load first');

 const entries=[

  {
   key:'cyclistSafePass',category:'cyclist',titleIt:'Sorpasso sicuro del ciclista',titleEn:'Safe pass of a cyclist',status:'ready',
   questionIds:['CARS1.18'],expectedCorrect:[2],engineSceneId:'MT_CYCLIST_SAFE_PASS_V1',countryPackId:'MT-LPTV',visualStatus:'final-real-footage',
   required:['country-road','car','cyclist','wide-gap'],prohibited:['cyclist-only','no-car']
  },
  {
   key:'largeVehicleFollowing',category:'following-distance',titleIt:'Distanza dietro un veicolo grande',titleEn:'Following a large vehicle',status:'ready',
   questionIds:['CARS1.9'],expectedCorrect:[2],engineSceneId:'MT_LARGE_VEHICLE_FOLLOWING_V1',countryPackId:'MT-LPTV',visualStatus:'final-real-footage',
   required:['truck','following','visibility'],prohibited:['unrelated-pedestrian']
  },
  {
   key:'dazzledHeadlights',category:'night-driving',titleIt:'Abbagliamento da fari in arrivo',titleEn:'Dazzled by oncoming headlights',status:'ready',
   questionIds:['CARS1.24'],expectedCorrect:[0],engineSceneId:'MT_DAZZLED_HEADLIGHTS_V1',countryPackId:'MT-LPTV',visualStatus:'final-real-footage',
   required:['night-driving','driver-view','oncoming-vehicle','headlights','headlight-glare'],prohibited:['daylight','rear-headlights','cyclist','pedestrian']
  },
  {
   key:'zebraWaitingStop',
   category:'pedestrian',
   titleIt:'Pedoni in attesa a un attraversamento zebra',
   titleEn:'Pedestrians waiting at a zebra crossing',
   status:'ready',
   questionIds:['CARS2.4'],
   expectedCorrect:[1],
   engineSceneId:'MT_ZEBRA_WAITING_STOP_V1',
   countryPackId:'MT-LPTV',
   visualStatus:'real-footage-with-instructional-overlay',
   required:['zebra-crossing','waiting-pedestrians','approaching-traffic'],
   prohibited:['rural-road','overtaking']
  },
  {
   key:'pedestrianWaveAcross',
   category:'pedestrian',
   titleIt:'Non invitare il pedone ad attraversare',
   titleEn:'Never wave a pedestrian across',
   status:'ready',
   questionIds:['CARS2.6'],
   expectedCorrect:[0],
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
   questionIds:['CARS1.10'],
   expectedCorrect:[3],
   engineSceneId:'MT_OVERTAKE_LIMITED_VIEW_V1',
   countryPackId:'MT-LPTV',
   visualStatus:'final-real-footage',
   required:['left-driving','two-way-road','limited-visibility'],
   prohibited:['right-driving','unrelated-skyline']
  },
  {
   key:'pedestrianHidden',
   category:'pedestrian',
   titleIt:'Pedone nascosto tra auto parcheggiate',
   titleEn:'Pedestrian hidden between parked cars',
   status:'production',
   questionIds:[],
   expectedCorrect:[],
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
   questionIds:[],
   expectedCorrect:[],
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
   questionIds:[],
   expectedCorrect:[],
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
   questionIds:[],
   expectedCorrect:[],
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
   questionIds:[],
   expectedCorrect:[],
   engineSceneId:null,
   countryPackId:'MT-LPTV',
   visualStatus:'planned',
   required:['left-driving','malta-markings','give-way'],
   prohibited:['right-driving']
  }
 ];

 entries.forEach(entry=>global.SceneCatalog.register(entry));
})(window);
