
(function(global){
 'use strict';
 if(!global.SceneCatalog)throw new Error('SceneCatalog must load first');

 const entries=[

  {
   key:'msmRoutine',category:'alertness',titleIt:'MSM: Specchio, Segnale, Manovra',titleEn:'MSM: Mirror, Signal, Manoeuvre',status:'ready',
   questionIds:['CARS1.7'],expectedCorrect:[0],engineSceneId:'MT_MSM_ROUTINE_V1',countryPackId:'MT-LPTV',visualStatus:'real-footage-sequence',
   required:['mirror-check','signal','manoeuvre','ordered-sequence'],prohibited:['generic-road','unrelated-scene','reused-approved-video']
  },

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
   key:'handsFreeDistraction',category:'alertness',titleIt:'Vivavoce: distrazione mentale alla guida',titleEn:'Hands-free: mental distraction while driving',status:'ready',
   questionIds:['CARS1.13'],expectedCorrect:[1],engineSceneId:'MT_HANDS_FREE_DISTRACTION_V1',countryPackId:'MT-LPTV',visualStatus:'final-real-footage',
   required:['driver','wireless-earphones','hands-free','vehicle-moving','road-visible','mental-distraction'],prohibited:['handheld-phone','parked-only','reused-approved-video']
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
   key:'duskLightsVisibility',category:'alertness',titleIt:'Crepuscolo: luci per essere visibili',titleEn:'Dusk: lights to be seen',status:'ready',
   questionIds:['CARS1.25'],expectedCorrect:[0,1],engineSceneId:'MT_DUSK_LIGHTS_VISIBILITY_V1',countryPackId:'MT-LPTV',visualStatus:'final-real-footage',
   required:['dusk','moving-traffic','headlights-on','streetlights','visibility'],prohibited:['full-daylight','lights-off-only','reused-approved-video']
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
   key:'twoSecondRuleGap',category:'safety-margins',titleIt:'Regola dei due secondi: distanza di sicurezza',titleEn:'Two-second rule: safe following gap',status:'ready',
   questionIds:['CARS2.9'],expectedCorrect:[1],engineSceneId:'MT_TWO_SECOND_RULE_GAP_V1',countryPackId:'MT-LPTV',visualStatus:'final-real-footage',
   required:['pov-driving','vehicle-ahead','following-gap','two-second-rule','fixed-reference-point'],prohibited:['parked-only','pedestrian-only','reused-approved-video']
  },

  {
   key:'largeVehicleTooClose',category:'safety-margins',titleIt:'Veicolo grande: troppo vicino riduce visuale e visibilità',titleEn:'Large vehicle: following too closely reduces view and visibility',status:'ready',
   questionIds:['CARS2.14'],expectedCorrect:[1,3],engineSceneId:'MT_LARGE_VEHICLE_TOO_CLOSE_V1',countryPackId:'MT-LPTV',visualStatus:'final-real-footage',
   required:['pov-driving','large-vehicle-ahead','following-too-close','reduced-forward-view','mirror-blind-zone'],prohibited:['parked-only','pedestrian-only','reused-approved-video']
  },

  {
   key:'wetRoadFourSecondGap',category:'safety-margins',titleIt:'Strada bagnata: almeno quattro secondi',titleEn:'Wet road: at least four seconds',status:'ready',
   questionIds:['CARS2.17'],expectedCorrect:[3],engineSceneId:'MT_WET_ROAD_FOUR_SECOND_GAP_V1',countryPackId:'MT-LPTV',visualStatus:'final-real-footage',
   required:['pov-driving','wet-road','rain','vehicle-ahead','following-gap','four-second-rule'],prohibited:['dry-road-only','parked-only','reused-approved-video']
  },

  {
   key:'rearFlashingAllowOvertake',category:'attitude',titleIt:'Veicolo rapido da dietro: lascia sorpassare',titleEn:'Fast vehicle behind: allow it to overtake',status:'ready',
   questionIds:['CARS2.20'],expectedCorrect:[3],engineSceneId:'MT_REAR_FLASHING_ALLOW_OVERTAKE_V1',countryPackId:'MT-LPTV',visualStatus:'final-real-footage',
   required:['rear-view-mirror','vehicle-behind','overtaking','do-not-compete','allow-safe-pass'],prohibited:['horse-rider','brake-check','speed-up','block-overtake','reused-approved-video']
  },


  {
   key:'neverExceedSpeedLimit',category:'attitude',titleIt:'Limite massimo: non si supera',titleEn:'Maximum speed limit: never exceed it',status:'ready',
   questionIds:['CARS2.22'],expectedCorrect:[1],engineSceneId:'MT_NEVER_EXCEED_SPEED_LIMIT_V1',countryPackId:'MT-LPTV',visualStatus:'final-real-footage',
   required:['driver-pov','dashboard','speedometer','road','speed-limit-rule','overtaking-context'],prohibited:['speeding-encouragement','race','reused-approved-video']
  },


  {
   key:'blueFlashingBeacons',category:'emergency-vehicles',titleIt:'Lampeggianti blu: polizia e ambulanza',titleEn:'Blue flashing beacons: police and ambulance',status:'ready',
   questionIds:['CARS2.30'],expectedCorrect:[1,2],engineSceneId:'MT_BLUE_FLASHING_BEACONS_V2',countryPackId:'MT-LPTV',visualStatus:'final-real-footage',
   required:['police-vehicle','ambulance','blue-flashing-beacons','emergency-response'],prohibited:['breakdown-recovery','road-maintenance','reused-approved-video']
  },

  {
   key:'ambulanceFollowingMakeWay',category:'emergency-vehicles',titleIt:'Ambulanza da dietro: lascia strada in sicurezza',titleEn:'Ambulance following: make way safely',status:'ready',
   questionIds:['CARS2.31'],expectedCorrect:[0],engineSceneId:'MT_AMBULANCE_FOLLOWING_MAKE_WAY_V1',countryPackId:'MT-LPTV',visualStatus:'final-real-footage',
   required:['ambulance','flashing-blue-light','vehicle-behind','make-way','pull-over-safely'],prohibited:['brake-harshly','accelerate-away','block-emergency-vehicle','reused-approved-video']
  },

  {
   key:'busRightSignalGiveWay',category:'buses',titleIt:'Autobus alla fermata con freccia destra',titleEn:'Bus at stop signalling right',status:'ready',
   questionIds:['CARS2.32'],expectedCorrect:[1],engineSceneId:'MT_BUS_RIGHT_SIGNAL_GIVE_WAY_V2',countryPackId:'MT-LPTV',visualStatus:'final-real-footage',
   required:['bus-stop','bus-stationary','right-indicator','pulling-out','slow-down','give-way-if-safe','left-driving'],prohibited:['horn','flash-headlights','generic-bus-only','reused-approved-video']
  },

  {
   key:'hornAlertPresence',category:'signals',titleIt:'Clacson: avvisa della tua presenza',titleEn:'Horn: alert others to your presence',status:'ready',
   questionIds:['CARS2.34'],expectedCorrect:[0],engineSceneId:'MT_HORN_ALERT_PRESENCE_V1',countryPackId:'MT-LPTV',visualStatus:'final-real-footage',
   required:['driver-pov','blind-or-limited-view','horn-warning','alert-presence','safety-purpose'],prohibited:['anger','greeting','right-of-way','reused-approved-video']
  },

  {
   key:'underInflatedSteeringBraking',category:'vehicle-safety',titleIt:'Pneumatici sgonfi: sterzo e frenata',titleEn:'Under-inflated tyres: steering and braking',status:'ready',
   questionIds:['CARS3.4'],expectedCorrect:[0,1],engineSceneId:'MT_UNDERINFLATED_STEERING_BRAKING_V1',countryPackId:'MT-LPTV',visualStatus:'final-real-footage',
   required:['tyre-pressure-check','under-inflation','steering-response','braking-performance'],prohibited:['parking','gear-change','generic-tyre-only','reused-approved-video']
  },

  {
   key:'tyrePressureWeeklyCheck',category:'vehicle-safety',titleIt:'Pressione pneumatici: controllo settimanale',titleEn:'Tyre pressure: weekly check',status:'ready',
   questionIds:['CARS3.8'],expectedCorrect:[1],engineSceneId:'MT_TYRE_PRESSURE_WEEKLY_CHECK_V1',countryPackId:'MT-LPTV',visualStatus:'final-real-footage',
   required:['tyre-pressure','pressure-gauge','weekly-check','regular-maintenance','vehicle-safety'],prohibited:['vrt-only','monthly-only','service-only','reused-approved-video']
  },

  {
   key:'dippedHeadlightsPoorVisibility',category:'vehicle-lighting',titleIt:'Anabbaglianti di giorno con scarsa visibilità',titleEn:'Dipped headlights in daytime poor visibility',status:'ready',
   questionIds:['CARS3.18'],expectedCorrect:[2],engineSceneId:'MT_DIPPED_HEADLIGHTS_POOR_VISIBILITY_V1',countryPackId:'MT-LPTV',visualStatus:'final-real-footage',
   required:['daytime','poor-visibility','fog','dipped-headlights','driver-view'],prohibited:['parking-only','narrow-street-only','clear-weather','high-beam','reused-approved-video']
  },

  {
   key:'tyrePressureColdCheck',category:'vehicle-safety',titleIt:"Pressione pneumatici: controllo a freddo",titleEn:"Tyre pressure: check when cold",status:'ready',
   questionIds:['CARS3.7'],expectedCorrect:[3],engineSceneId:'MT_TYRE_PRESSURE_COLD_CHECK_V1',countryPackId:'MT-LPTV',visualStatus:'final-real-footage',
   required:['tyre-pressure','pressure-gauge','cold-tyres','maintenance-check'],prohibited:['hot-tyres','reused-approved-video']
  },

  {
   key:'underInflatedBrakingFuel',category:'vehicle-safety',titleIt:"Pneumatici sgonfi: frenata e consumo",titleEn:"Under-inflated tyres: braking and fuel use",status:'ready',
   questionIds:['CARS3.9'],expectedCorrect:[1,2],engineSceneId:'MT_UNDERINFLATED_BRAKING_FUEL_V1',countryPackId:'MT-LPTV',visualStatus:'final-real-footage',
   required:['under-inflation','tyre-pressure','braking','fuel-consumption'],prohibited:['oil-pressure','engine-temperature','reused-approved-video']
  },

  {
   key:'unevenTyreWearFaults',category:'vehicle-safety',titleIt:"Usura irregolare: sospensioni, allineamento e freni",titleEn:"Uneven tyre wear: suspension, alignment and brakes",status:'ready',
   questionIds:['CARS3.31'],expectedCorrect:[1,4,5],engineSceneId:'MT_UNEVEN_TYRE_WEAR_FAULTS_V1',countryPackId:'MT-LPTV',visualStatus:'final-real-footage',
   required:['tyre-wear','suspension','wheel-alignment','braking-system'],prohibited:['exhaust-system','accelerator','gearbox','reused-approved-video']
  },

  {
   key:'hornBuiltUpNightRestriction',category:'horn',titleIt:"Clacson in zona abitata: divieto notturno",titleEn:"Horn in built-up areas: night restriction",status:'ready',
   questionIds:['CARS3.38'],expectedCorrect:[3],engineSceneId:'MT_HORN_BUILT_UP_NIGHT_RESTRICTION_V1',countryPackId:'MT-LPTV',visualStatus:'final-real-footage',
   required:['built-up-area','night-driving','horn-restriction','23-to-06'],prohibited:['daytime-only','unrestricted-horn','reused-approved-video']
  },

  {
   key:'walkCycleEnvironment',category:'eco-driving',titleIt:"Ambiente: cammina o usa la bicicletta quando puoi",titleEn:"Environment: walk or cycle when you can",status:'ready',
   questionIds:['CARS3.29'],expectedCorrect:[3],engineSceneId:'MT_WALK_CYCLE_ENVIRONMENT_V1',countryPackId:'MT-LPTV',visualStatus:'final-real-footage',
   required:['walking-or-cycling','cycling','urban','environment','lower-emissions'],prohibited:['sharp-acceleration','low-tyre-pressure','full-choke','reused-approved-video']
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
