/* 39.12.13 Replay60 — five new strict sign/signal replays. */

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
   key:'brakeFluidLowLevel',category:'vehicle-safety',titleIt:"Liquido freni: livello basso pericoloso",titleEn:"Brake fluid: dangerously low level",status:'ready',
   questionIds:['CARS3.1'],expectedCorrect:[1],engineSceneId:'MT_BRAKE_FLUID_LOW_LEVEL_V1',countryPackId:'MT-LPTV',visualStatus:'final-real-footage',
   required:['brake-fluid','fluid-reservoir','low-level','braking-system'],prohibited:['coolant-only','battery-water','antifreeze-only','reused-approved-video']
  },

  {
   key:'ecoDrivingHelpEnvironment',category:'eco-driving',titleIt:"Ambiente: manutenzione, accelerazione dolce e velocità ridotta",titleEn:"Environment: maintenance, gentle acceleration and lower speed",status:'ready',
   questionIds:['CARS3.23'],expectedCorrect:[0,1,4],engineSceneId:'MT_ECO_DRIVING_SERVICE_GENTLE_SPEED_V1',countryPackId:'MT-LPTV',visualStatus:'final-real-footage',
   required:['driver-control','smooth-driving','gentle-acceleration','reduced-speed','vehicle-maintenance'],prohibited:['harsh-acceleration','speeding','leaded-fuel','reused-approved-video']
  },

  {
   key:'vehicleEnvironmentalDamage',category:'environment',titleIt:"Veicoli: risorse, edifici e inquinamento atmosferico",titleEn:"Vehicles: resources, buildings and air pollution",status:'ready',
   questionIds:['CARS3.27'],expectedCorrect:[0,1,5],engineSceneId:'MT_VEHICLE_ENVIRONMENTAL_HARM_V1',countryPackId:'MT-LPTV',visualStatus:'final-real-footage',
   required:['urban-traffic','air-pollution','buildings','natural-resources','environmental-impact'],prohibited:['clean-air-only','empty-landscape','reused-approved-video']
  },

  {
   key:'reduceEnvironmentalDamageDriving',category:'eco-driving',titleIt:"Guida ecologica: pianifica, frena per tempo, accelera dolcemente",titleEn:"Eco driving: plan, brake early, accelerate gently",status:'ready',
   questionIds:['CARS3.28'],expectedCorrect:[1,2,3],engineSceneId:'MT_ECO_PLAN_BRAKE_ACCELERATE_V1',countryPackId:'MT-LPTV',visualStatus:'final-real-footage',
   required:['driver-view','plan-ahead','early-braking','gentle-acceleration','smooth-driving'],prohibited:['busy-route','harsh-acceleration','late-braking','reused-approved-video']
  },

  {
   key:'avoidVeryShortJourneys',category:'eco-driving',titleIt:"Ambiente: evita tragitti molto brevi in auto",titleEn:"Environment: avoid very short car journeys",status:'ready',
   questionIds:['CARS3.30'],expectedCorrect:[1],engineSceneId:'MT_AVOID_VERY_SHORT_CAR_JOURNEYS_V1',countryPackId:'MT-LPTV',visualStatus:'final-real-footage',
   required:['vehicle-start','cold-engine','short-journey','fuel-use','pollution'],prohibited:['long-trip-only','walking-is-wrong','reused-approved-video']
  },


  {
   key:'fuelConsumptionPlanSpeed',category:'eco-driving',titleIt:"Consumo carburante: pianifica e riduci la velocità",titleEn:"Fuel consumption: plan ahead and reduce speed",status:'ready',
   questionIds:['CARS3.33'],expectedCorrect:[0,1],engineSceneId:'MT_FUEL_CONSUMPTION_PLAN_SPEED_V1',countryPackId:'MT-LPTV',visualStatus:'final-real-footage',
   required:['plan-ahead','reduced-speed','smooth-driving','fuel-efficiency'],prohibited:['rapid-acceleration','late-harsh-braking','lower-gears-only','reused-approved-video']
  },

  {
   key:'trafficCalmingMeasures',category:'traffic-calming',titleIt:"Dossi, chicane e restringimenti: moderazione del traffico",titleEn:"Humps, chicanes and narrowing: traffic calming",status:'ready',
   questionIds:['CARS3.46'],expectedCorrect:[3],engineSceneId:'MT_TRAFFIC_CALMING_MEASURES_V1',countryPackId:'MT-LPTV',visualStatus:'final-real-footage',
   required:['road-humps','chicane','road-narrowing','traffic-calming'],prohibited:['roadworks','toll-bridge','speed-increase','reused-approved-video']
  },

  {
   key:'roadHumpsReducedSpeed',category:'traffic-calming',titleIt:"Dossi: mantieni una velocità ridotta",titleEn:"Road humps: maintain a reduced speed",status:'ready',
   questionIds:['CARS3.47'],expectedCorrect:[0],engineSceneId:'MT_ROAD_HUMPS_REDUCED_SPEED_V1',countryPackId:'MT-LPTV',visualStatus:'final-real-footage',
   required:['road-humps','reduced-speed','residential-area','steady-speed'],prohibited:['accelerate-between-humps','maximum-speed','school-times-only','reused-approved-video']
  },

  {
   key:'fogSafeDriving',category:'weather',titleIt:"Nebbia: anabbaglianti, rallenta e più tempo",titleEn:"Fog: dipped headlights, slow down and allow more time",status:'ready',
   questionIds:['CARS4.7'],expectedCorrect:[1,3,5],engineSceneId:'MT_FOG_DIP_SLOW_TIME_V1',countryPackId:'MT-LPTV',visualStatus:'final-real-footage',
   required:['fog','dipped-headlights','reduced-speed','more-time'],prohibited:['full-beam','close-following','sidelights-only','reused-approved-video']
  },

  {
   key:'aquaplaningHeavyRain',category:'weather',titleIt:"Aquaplaning: rilascia dolcemente l'acceleratore",titleEn:"Aquaplaning: ease off the accelerator",status:'ready',
   questionIds:['CARS4.14'],expectedCorrect:[3],engineSceneId:'MT_AQUAPLANING_EASE_ACCELERATOR_V1',countryPackId:'MT-LPTV',visualStatus:'final-real-footage',
   required:['heavy-rain','light-steering','aquaplaning','ease-accelerator'],prohibited:['hard-braking','accelerate','steer-side','reused-approved-video']
  },


  {
   key:'mobilePhoneDrivingDistraction',category:'alertness',titleIt:'Telefono alla guida: distrazione dalla strada',titleEn:'Mobile phone while driving: road distraction',status:'ready',
   questionIds:['CARS1.15'],expectedCorrect:[2],engineSceneId:'MT_MOBILE_PHONE_DRIVING_DISTRACTION_V1',countryPackId:'MT-LPTV',visualStatus:'final-real-footage',
   required:['mobile-phone','driver','driving-distraction','attention-from-road'],prohibited:['parked-only','hands-free-only','reused-approved-video']
  },

  {
   key:'mobilePhoneParkedControl',category:'alertness',titleIt:'Telefono: usalo solo da parcheggiato',titleEn:'Mobile phone: use it only when parked',status:'ready',
   questionIds:['CARS1.23'],expectedCorrect:[1],engineSceneId:'MT_MOBILE_PHONE_PARKED_CONTROL_V1',countryPackId:'MT-LPTV',visualStatus:'final-real-footage',
   required:['mobile-phone','parked-vehicle','vehicle-control','safe-stop'],prohibited:['moving-vehicle-phone-use','hands-free-only','reused-approved-video']
  },

  {
   key:'zebraWaitUntilCrossed',category:'pedestrian-crossings',titleIt:'Zebra: attendi che i pedoni abbiano attraversato',titleEn:'Zebra crossing: wait until pedestrians have crossed',status:'ready',
   questionIds:['CARS2.5'],expectedCorrect:[0],engineSceneId:'MT_ZEBRA_WAIT_UNTIL_CROSSED_V1',countryPackId:'MT-LPTV',visualStatus:'final-real-footage',
   required:['zebra-crossing','pedestrians-crossing','remain-stopped','patient-wait'],prohibited:['wave-across','creep-forward','rev-engine','reused-approved-video']
  },

  {
   key:'rainLongerStoppingDistance',category:'stopping-distance',titleIt:'Pioggia: distanza d’arresto più lunga',titleEn:'Rain: longer stopping distance',status:'ready',
   questionIds:['CARS4.11'],expectedCorrect:[0],engineSceneId:'MT_RAIN_LONGER_STOPPING_DISTANCE_V1',countryPackId:'MT-LPTV',visualStatus:'final-real-footage',
   required:['rain','wet-road','reduced-grip','longer-stopping-distance'],prohibited:['dry-road-only','fog-only','night-only','reused-approved-video']
  },

  {
   key:'floodTestBrakes',category:'braking',titleIt:'Dopo un allagamento: prova i freni',titleEn:'After flood water: test the brakes',status:'ready',
   questionIds:['CARS4.15'],expectedCorrect:[3],engineSceneId:'MT_FLOOD_TEST_BRAKES_V1',countryPackId:'MT-LPTV',visualStatus:'final-real-footage',
   required:['flood-water','vehicle-through-water','brake-test','reduced-brake-effect'],prohibited:['tyre-check-first','wipers-first','dry-brakes-by-stopping','reused-approved-video']
  },


  {
   key:'overtakeCheckFollowingTraffic',category:'overtaking',titleIt:'Sorpasso: controlla traffico dietro',titleEn:'Overtaking: check following traffic',status:'ready',
   questionIds:['CARS1.26'],expectedCorrect:[0],engineSceneId:'MT_OVERTAKE_CHECK_FOLLOWING_TRAFFIC_V1',countryPackId:'MT-LPTV',visualStatus:'final-real-footage',
   required:['side-mirror','following-traffic','overtaking-check','speed-position'],prohibited:['sharp-steer','close-follow','cut-in','reused-approved-video']
  },

  {
   key:'zebraKeepClearQueues',category:'pedestrian-crossings',titleIt:'Zebra: lascialo sempre libero',titleEn:'Zebra crossing: always keep it clear',status:'ready',
   questionIds:['CARS2.7'],expectedCorrect:[2],engineSceneId:'MT_ZEBRA_KEEP_CLEAR_QUEUES_V1',countryPackId:'MT-LPTV',visualStatus:'final-real-footage',
   required:['zebra-crossing','vehicle-stopped-before-crossing','pedestrians','crossing-clear'],prohibited:['blocked-crossing','park-zigzag','wave-across','reused-approved-video']
  },

  {
   key:'zebraPatientWait',category:'pedestrian-crossings',titleIt:'Zebra: sii paziente e aspetta',titleEn:'Zebra crossing: be patient and wait',status:'ready',
   questionIds:['CARS2.8'],expectedCorrect:[0],engineSceneId:'MT_ZEBRA_PATIENT_WAIT_V1',countryPackId:'MT-LPTV',visualStatus:'final-real-footage',
   required:['pedestrians-waiting','crossing','patience','remain-stopped'],prohibited:['wave-across','sound-horn','drive-on','reused-approved-video']
  },

  {
   key:'lorryOvertakingSlowDown',category:'overtaking',titleIt:'Camion in sorpasso: rallenta',titleEn:'Lorry overtaking: slow down',status:'ready',
   questionIds:['CARS2.26'],expectedCorrect:[1],engineSceneId:'MT_LORRY_OVERTAKING_SLOW_DOWN_V1',countryPackId:'MT-LPTV',visualStatus:'final-real-footage',
   required:['heavy-lorry','overtaking','moving-vehicles','slow-down'],prohibited:['speed-up','hold-speed','change-direction','reused-approved-video']
  },

  {
   key:'twoSecondSafeGap',category:'safety-margins',titleIt:'Regola dei due secondi: distanza sicura',titleEn:'Two-second rule: safe following gap',status:'ready',
   questionIds:['CARS4.10'],expectedCorrect:[0],engineSceneId:'MT_TWO_SECOND_SAFE_GAP_V1',countryPackId:'MT-LPTV',visualStatus:'final-real-footage',
   required:['vehicle-ahead','fixed-reference','two-second-rule','safe-gap'],prohibited:['kerb-distance','blind-spot','mirror-only','reused-approved-video']
  },


  {
   key:'engineBrakingLowerGear',category:'vehicle-control',titleIt:'Freno motore: inserisci una marcia più bassa',titleEn:'Engine braking: select a lower gear',status:'ready',
   questionIds:['CARS4.25'],expectedCorrect:[3],engineSceneId:'MT_ENGINE_BRAKING_LOWER_GEAR_V1',countryPackId:'MT-LPTV',visualStatus:'final-real-footage',
   required:['manual-gear-lever','lower-gear','engine-braking','vehicle-control'],prohibited:['neutral','higher-gear','reverse','reused-approved-video']
  },

  {
   key:'elderlyCrossingPatience',category:'vulnerable-road-users',titleIt:'Anziani che attraversano: pazienza',titleEn:'Elderly pedestrians crossing: be patient',status:'ready',
   questionIds:['CARS6.24'],expectedCorrect:[1],engineSceneId:'MT_ELDERLY_CROSSING_PATIENCE_V1',countryPackId:'MT-LPTV',visualStatus:'final-real-footage',
   required:['elderly-pedestrian','crossing','patience','allow-time'],prohibited:['horn','rev-engine','wave-across','reused-approved-video']
  },

  {
   key:'sideRoadPedestriansWait',category:'pedestrian',titleIt:'Svolta in strada laterale: aspetta i pedoni',titleEn:'Turning into side road: wait for pedestrians',status:'ready',
   questionIds:['CARS6.4'],expectedCorrect:[3],engineSceneId:'MT_SIDE_ROAD_PEDESTRIANS_WAIT_V1',countryPackId:'MT-LPTV',visualStatus:'final-real-footage',
   required:['junction','side-road','pedestrians-crossing','vehicle-waiting'],prohibited:['horn','wave-on','force-through','reused-approved-video']
  },

  {
   key:'junctionSmallRidersVisibility',category:'vulnerable-road-users',titleIt:'Incrocio: motociclisti e ciclisti sono più difficili da vedere',titleEn:'Junction: riders are harder to see',status:'ready',
   questionIds:['CARS6.36'],expectedCorrect:[2],engineSceneId:'MT_JUNCTION_SMALL_RIDERS_VISIBILITY_V1',countryPackId:'MT-LPTV',visualStatus:'final-real-footage',
   required:['junction','motorcycles','mixed-traffic','small-road-user'],prohibited:['motorcycle-priority-always','empty-road','reused-approved-video']
  },

  {
   key:'sideRoadWatchMotorcycles',category:'vulnerable-road-users',titleIt:'Uscita da strada laterale: cerca bene i motocicli',titleEn:'Emerging from side road: watch carefully for motorcycles',status:'ready',
   questionIds:['CARS6.37'],expectedCorrect:[2],engineSceneId:'MT_SIDE_ROAD_WATCH_MOTORCYCLES_V1',countryPackId:'MT-LPTV',visualStatus:'final-real-footage',
   required:['crossroad','side-road','motorcycles','small-hard-to-see'],prohibited:['motorcycle-always-priority','police-only','reused-approved-video']
  },


  {
   key:'noEntrySignMeaning',category:'road-signs',titleIt:'Divieto di accesso: nessun veicolo può entrare',titleEn:'No entry: vehicles must not enter',status:'ready',
   questionIds:['CARS11.9'],expectedCorrect:[3],engineSceneId:'MT_NO_ENTRY_SIGN_MEANING_V1',countryPackId:'MT-LPTV',visualStatus:'final-real-footage',
   required:['no-entry-sign','regulatory-sign','vehicles-must-not-enter'],prohibited:['no-through-road','no-parking','reused-approved-video']
  },

  {
   key:'triangularSignsWarnings',category:'road-signs',titleIt:'Segnali triangolari: avvertono dei pericoli',titleEn:'Triangular signs: warnings',status:'ready',
   questionIds:['CARS11.30'],expectedCorrect:[0],engineSceneId:'MT_TRIANGULAR_SIGNS_WARNINGS_V1',countryPackId:'MT-LPTV',visualStatus:'final-real-footage',
   required:['triangular-warning-sign','warning','road-sign'],prohibited:['directions','orders-only','information-only','reused-approved-video']
  },

  {
   key:'trafficLightRedAmberGreenSequence',category:'traffic-signals',titleIt:'Semaforo: rosso → rosso e giallo → verde',titleEn:'Traffic lights: red → red and amber → green',status:'ready',
   questionIds:['CARS11.55'],expectedCorrect:[0],engineSceneId:'MT_TRAFFIC_LIGHT_RED_AMBER_GREEN_SEQUENCE_V1',countryPackId:'MT-LPTV',visualStatus:'final-real-footage',
   required:['red-light','red-amber','green-light','signal-sequence'],prohibited:['red-direct-green','amber-only-transition','reused-approved-video']
  },

  {
   key:'redLightStopBehindLine',category:'traffic-signals',titleIt:'Semaforo rosso: fermati dietro la linea',titleEn:'Red light: stop behind the line',status:'ready',
   questionIds:['CARS11.56'],expectedCorrect:[2],engineSceneId:'MT_RED_LIGHT_STOP_BEHIND_LINE_V1',countryPackId:'MT-LPTV',visualStatus:'final-real-footage',
   required:['red-light','vehicles-stopped','stop-line','wait'],prohibited:['proceed-cautiously','turn-left','reused-approved-video']
  },

  {
   key:'amberLightPrepareStop',category:'traffic-signals',titleIt:'Giallo da solo: preparati a fermarti',titleEn:'Amber alone: prepare to stop',status:'ready',
   questionIds:['CARS11.57'],expectedCorrect:[3],engineSceneId:'MT_AMBER_LIGHT_PREPARE_STOP_V1',countryPackId:'MT-LPTV',visualStatus:'final-real-footage',
   required:['amber-light','prepare-stop','stop-line'],prohibited:['prepare-go','go-if-clear','reused-approved-video']
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
