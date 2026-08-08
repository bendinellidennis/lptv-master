
(function(global){
 'use strict';
 if(!global.SceneCatalog)throw new Error('SceneCatalog must load first');

 const entries=[

  {
   key:'blindSpotDefinition',category:'alertness',titleIt:'Angolo cieco: area fuori dagli specchi',titleEn:'Blind spot: area outside mirror coverage',status:'ready',
   questionIds:['CARS1.3'],expectedCorrect:[3],engineSceneId:'MT_BLIND_SPOT_DEFINITION_V1',countryPackId:'MT-LPTV',visualStatus:'real-footage-with-instructional-overlay',
   required:['side-mirror','traffic','mirror-coverage','blind-spot'],prohibited:['mechanic','parked-only','no-mirror']
  },

  {
   key:'uTurnShoulderCheck',category:'alertness',titleIt:'Inversione a U: controllo finale sopra la spalla',titleEn:'U-turn: final shoulder check',status:'ready',
   questionIds:['CARS1.2'],expectedCorrect:[2],engineSceneId:'MT_UTURN_SHOULDER_CHECK_V1',countryPackId:'MT-LPTV',visualStatus:'real-footage-with-instructional-overlay',
   required:['u-turn','road','traffic','blind-spot','shoulder-check'],prohibited:['mechanic','parked-only','unrelated-road']
  },

  {
   key:'phoneDistractionDriving',category:'alertness',titleIt:'Telefono: distrazione durante la guida',titleEn:'Phone distraction while driving',status:'ready',
   questionIds:['CARS1.12'],expectedCorrect:[2],engineSceneId:'MT_PHONE_DISTRACTION_DRIVING_V1',countryPackId:'MT-LPTV',visualStatus:'final-real-footage',
   required:['driver','mobile-phone','vehicle-moving','road-visible','distraction'],prohibited:['parked-only','no-road-context']
  },

  {
   key:'phoneStopSafe',category:'alertness',titleIt:'Telefono: fermati prima di rispondere',titleEn:'Phone call: stop safely first',status:'ready',
   questionIds:['CARS1.19'],expectedCorrect:[1],engineSceneId:'MT_PHONE_STOP_SAFE_V1',countryPackId:'MT-LPTV',visualStatus:'final-real-footage',
   required:['parked-car','driver-seat','mobile-phone','vehicle-stationary','safe-stop'],prohibited:['vehicle-moving','phone-while-driving']
  },

  {
   key:'cyclistSafePass',category:'cyclist',titleIt:'Sorpasso sicuro del ciclista',titleEn:'Safe pass of a cyclist',status:'ready',
   questionIds:['CARS1.18'],expectedCorrect:[2],engineSceneId:'MT_CYCLIST_SAFE_PASS_V1',countryPackId:'MT-LPTV',visualStatus:'final-real-footage',
   required:['car-view','cyclist-clearly-visible','real-road','passing-context'],prohibited:['cyclist-not-visible','empty-road','generic-road']
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
   required:['zebra-crossing','pedestrians','cars-stopping','pedestrian-safety'],
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
