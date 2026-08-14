/* Build 39.12.56 Replay200 — five new strict mappings; previous 195 preserved */
/* Build 39.12.55 Replay195 — five new strict mappings; previous 190 preserved */
/* Build 39.12.53 Replay190 — five new strict mappings; previous 185 preserved */
/* Build 39.12.50 Replay185 — five new strict mappings; previous 180 preserved */
/* Build 39.12.34 Replay140 — five new strict mappings; previous 135 preserved */
/* Build 39.12.33 Replay135 — five new strict mappings; previous 130 preserved */
/* Build 39.12.31 Replay130 — five new strict mappings; previous 125 preserved */
/* Build 39.12.30 Replay125 — five new strict mappings; previous 120 preserved */
/* Build 39.12.29 Replay120 — five new strict mappings; previous 115 preserved */
/* Build 39.12.28 Replay115 — five new strict mappings; Replay110 GitHub fix preserved */
/* 39.12.26 Replay110 — five new strict real-media mappings; previous 105 unchanged. */
/* build 39.12.23 Replay105 */
/* 39.12.20 Replay90 — CARS13.7 freeze reliability fix; catalog unchanged. */
/* 39.12.19 Replay90 — five new strict real-media replays. */
/* 39.12.16 Replay75 — five new strict real-media replays. */
/* 39.12.15 Replay70 — five new strict real-media replays. */
/* 39.12.13 Replay60 — five new strict sign/signal replays. */

(function(global){
 'use strict';
 if(!global.SceneCatalog)throw new Error('SceneCatalog must load first');

 const entries=[
  /* Build 39.12.57 Replay205 */
  {"key":"residential35Limit205","category":"speed-limits","titleIt":"Strade residenziali: limite di 35 km/h","titleEn":"Residential roads: 35 kph limit","status":"ready","questionIds":["CARS3.45"],"expectedCorrect":[2],"engineSceneId":"MT_RESIDENTIAL_35_LIMIT_205_V1","countryPackId":"MT-LPTV","visualStatus":"final-real-footage","required":["residential-road","35-kph","speed-limit","question-specific"],"prohibited":["reused-approved-video","generic-unrelated-scene","remote-freeze"]},
  {"key":"stoppingDistance48kph205","category":"braking","titleIt":"48 km/h: distanza totale di arresto 23 metri","titleEn":"48 kph: total stopping distance 23 metres","status":"ready","questionIds":["CARS4.5"],"expectedCorrect":[3],"engineSceneId":"MT_STOPPING_DISTANCE_48KPH_205_V1","countryPackId":"MT-LPTV","visualStatus":"final-real-footage","required":["48-kph","stopping-distance","23-metres","dry-road","question-specific"],"prohibited":["reused-approved-video","generic-unrelated-scene","remote-freeze"]},
  {"key":"hotSoftRoadGrip205","category":"road-conditions","titleIt":"Caldo intenso: asfalto morbido, sterzo e frenata","titleEn":"Very hot weather: soft road affects steering and braking","status":"ready","questionIds":["CARS4.21"],"expectedCorrect":[1,3],"engineSceneId":"MT_HOT_SOFT_ROAD_GRIP_205_V1","countryPackId":"MT-LPTV","visualStatus":"final-real-footage","required":["hot-weather","soft-road","steering","braking","question-specific"],"prohibited":["reused-approved-video","generic-unrelated-scene","remote-freeze"]},
  {"key":"national80OutsideBuiltUp205","category":"speed-limits","titleIt":"Fuori dai centri abitati: limite nazionale 80 km/h","titleEn":"Outside built-up areas: national speed limit 80 kph","status":"ready","questionIds":["CARS10.3"],"expectedCorrect":[2],"engineSceneId":"MT_NATIONAL_80_OUTSIDE_BUILT_UP_205_V1","countryPackId":"MT-LPTV","visualStatus":"final-real-footage","required":["outside-built-up","80-kph","national-speed-limit","question-specific"],"prohibited":["reused-approved-video","generic-unrelated-scene","remote-freeze"]},
  {"key":"registrationDocumentInfo205","category":"vehicle-documents","titleIt":"Documento di registrazione: marca e proprietario registrato","titleEn":"Registration document: vehicle make and registered owner","status":"ready","questionIds":["CARS12.8"],"expectedCorrect":[0,1],"engineSceneId":"MT_REGISTRATION_DOCUMENT_INFO_205_V1","countryPackId":"MT-LPTV","visualStatus":"final-real-footage","required":["registration-document","vehicle-make","registered-owner","question-specific"],"prohibited":["reused-approved-video","generic-unrelated-scene","remote-freeze"]},

  {"key":"skidDriverError200","category":"vehicle-control","titleIt":"Sbandata: la causa più comune è l'errore del conducente","titleEn":"Skidding: driver error is the most common cause","status":"ready","questionIds":["CARS4.12"],"expectedCorrect":[1],"engineSceneId":"MT_SKID_DRIVER_ERROR_200_V1","countryPackId":"MT-LPTV","visualStatus":"final-real-footage","required":["car-skid","driver-error","loss-of-control","road-safety","question-specific"],"prohibited":["reused-approved-video","generic-unrelated-scene","remote-freeze"]},
  {"key":"medicineDoNotDrive200","category":"medication","titleIt":"Farmaco che può influire sulla guida: non guidare","titleEn":"Medicine that may affect driving: do not drive","status":"ready","questionIds":["CARS5.18"],"expectedCorrect":[2],"engineSceneId":"MT_MEDICINE_DO_NOT_DRIVE_200_V1","countryPackId":"MT-LPTV","visualStatus":"final-real-footage","required":["doctor","prescription","medicine","do-not-drive","question-specific"],"prohibited":["reused-approved-video","generic-unrelated-scene","remote-freeze"]},
  {"key":"triangularWarnings200","category":"road-signs","titleIt":"Segnali triangolari: indicano pericoli","titleEn":"Triangular signs: hazard warnings","status":"ready","questionIds":["CARS11.34"],"expectedCorrect":[1,2,3,4],"engineSceneId":"MT_TRIANGULAR_WARNINGS_200_V1","countryPackId":"MT-LPTV","visualStatus":"final-real-footage","required":["triangular-warning-sign","hazard-warning","children-crossing","junction","road-narrows","tunnel","question-specific"],"prohibited":["reused-approved-video","generic-unrelated-scene","remote-freeze"]},
  {"key":"otherVehicleInsurance200","category":"legal","titleIt":"Veicolo altrui: assicurazione valida per il tuo uso","titleEn":"Someone else's vehicle: insured for your use","status":"ready","questionIds":["CARS12.3"],"expectedCorrect":[2],"engineSceneId":"MT_OTHER_VEHICLE_INSURANCE_200_V1","countryPackId":"MT-LPTV","visualStatus":"final-real-footage","required":["other-vehicle","insurance","driver-cover","legal-driving","question-specific"],"prohibited":["reused-approved-video","generic-unrelated-scene","remote-freeze"]},
  {"key":"legalDriveDocuments200","category":"legal","titleIt":"Prima di guidare legalmente: assicurazione, road tax e patente","titleEn":"Driving legally: insurance, road tax and licence","status":"ready","questionIds":["CARS12.7"],"expectedCorrect":[0,3,4],"engineSceneId":"MT_LEGAL_DRIVE_DOCUMENTS_200_V1","countryPackId":"MT-LPTV","visualStatus":"final-real-footage","required":["insurance","road-tax","driving-licence","driver-documents","legal-driving","question-specific"],"prohibited":["reused-approved-video","generic-unrelated-scene","remote-freeze"]},

  {"key":"pedestrianWarning195","category":"vulnerable-road-users","titleIt":"Segnale di pericolo: pedoni lungo la strada","titleEn":"Warning sign: pedestrians may be on the road","status":"ready","questionIds":["CARS6.2"],"expectedCorrect":[0],"engineSceneId":"MT_PEDESTRIAN_WARNING_SIGN_195_V1","countryPackId":"MT-LPTV","visualStatus":"final-real-footage","required":["pedestrian-warning-sign","pedestrians","road","warning","question-specific"],"prohibited":["reused-approved-video","generic-unrelated-scene","remote-freeze"]},
  {"key":"disabledPelicanPatient195","category":"vulnerable-road-users","titleIt":"Pelican crossing: lascia completare l’attraversamento","titleEn":"Pelican crossing: let the disabled pedestrian finish crossing","status":"ready","questionIds":["CARS6.14"],"expectedCorrect":[2,4],"engineSceneId":"MT_DISABLED_PELICAN_PATIENT_195_V1","countryPackId":"MT-LPTV","visualStatus":"final-real-footage","required":["disabled-pedestrian","pelican-crossing","allow-to-cross","be-patient","question-specific"],"prohibited":["reused-approved-video","generic-unrelated-scene","remote-freeze"]},
  {"key":"iceCreamChildHazard195","category":"children","titleIt":"Furgone dei gelati: attenzione ai bambini","titleEn":"Ice-cream van: watch for children running into the road","status":"ready","questionIds":["CARS6.16"],"expectedCorrect":[3],"engineSceneId":"MT_ICE_CREAM_CHILD_HAZARD_195_V1","countryPackId":"MT-LPTV","visualStatus":"final-real-footage","required":["ice-cream-van","child","run-into-road","children-hazard","question-specific"],"prohibited":["reused-approved-video","generic-unrelated-scene","remote-freeze"]},
  {"key":"motorcycleShoulderCheck195","category":"motorcyclists","titleIt":"Motociclista: controllo sopra la spalla prima di svoltare","titleEn":"Motorcyclist: shoulder check before turning right","status":"ready","questionIds":["CARS6.43"],"expectedCorrect":[3],"engineSceneId":"MT_MOTORCYCLE_SHOULDER_CHECK_195_V1","countryPackId":"MT-LPTV","visualStatus":"final-real-footage","required":["motorcyclist","right-turn","shoulder-check","blind-area","traffic-check","question-specific"],"prohibited":["reused-approved-video","generic-unrelated-scene","remote-freeze"]},
  {"key":"wetDrainCover195","category":"motorcyclists","titleIt":"Strada bagnata: tombini metallici scivolosi","titleEn":"Wet road: slippery metal drain covers","status":"ready","questionIds":["CARS7.1"],"expectedCorrect":[3],"engineSceneId":"MT_WET_DRAIN_COVER_195_V1","countryPackId":"MT-LPTV","visualStatus":"final-real-footage","required":["motorcyclist","wet-road","drain-cover","metal-cover","sliding-risk","question-specific"],"prohibited":["reused-approved-video","generic-unrelated-scene","remote-freeze"]},

  {"key":"horseRoundaboutDirection190","category":"horse-riders","titleIt":"Cavaliere alla rotatoria: non presumere la direzione","titleEn":"Horse rider at a roundabout: do not assume direction","status":"ready","questionIds":["CARS6.55"],"expectedCorrect":[3],"engineSceneId":"MT_HORSE_ROUNDABOUT_DIRECTION_190_V1","countryPackId":"MT-LPTV","visualStatus":"final-real-footage","required":["horse-rider","roundabout","lane-position","any-direction","real-scene","question-specific"],"prohibited":["reused-approved-video","generic-unrelated-scene","remote-freeze"]},
  {"key":"horsesRoundaboutRoomStop190","category":"horse-riders","titleIt":"Cavalli alla rotatoria: lascia spazio e preparati a fermarti","titleEn":"Horses at a roundabout: leave room and be prepared to stop","status":"ready","questionIds":["CARS6.56"],"expectedCorrect":[1,4],"engineSceneId":"MT_HORSES_ROUNDABOUT_ROOM_STOP_190_V1","countryPackId":"MT-LPTV","visualStatus":"final-real-footage","required":["horses","roundabout","plenty-room","prepared-stop","real-scene","question-specific"],"prohibited":["reused-approved-video","generic-unrelated-scene","remote-freeze"]},
  {"key":"horseGroupRoundaboutStayBack190","category":"horse-riders","titleIt":"Cavalieri alla rotatoria: resta ben distante","titleEn":"Horse riders at a roundabout: stay well back","status":"ready","questionIds":["CARS6.57"],"expectedCorrect":[3],"engineSceneId":"MT_HORSE_GROUP_ROUNDABOUT_STAY_BACK_190_V1","countryPackId":"MT-LPTV","visualStatus":"final-real-footage","required":["horse-riders","roundabout","right-signal","keep-left","stay-back","real-scene","question-specific"],"prohibited":["reused-approved-video","generic-unrelated-scene","remote-freeze"]},
  {"key":"driverErrorAccidents190","category":"road-safety","titleIt":"Incidenti stradali: l'errore del conducente è la causa più comune","titleEn":"Road accidents: driver error is the most common cause","status":"ready","questionIds":["CARS6.58"],"expectedCorrect":[1],"engineSceneId":"MT_DRIVER_ERROR_ACCIDENTS_190_V1","countryPackId":"MT-LPTV","visualStatus":"final-real-footage","required":["driver-error","distraction","driving","road-safety","real-scene","question-specific"],"prohibited":["reused-approved-video","generic-unrelated-scene","remote-freeze"]},
  {"key":"youngDriversAccidentRisk190","category":"road-safety","titleIt":"Rischio incidenti: fascia 18–25 anni","titleEn":"Accident risk: ages 18–25","status":"ready","questionIds":["CARS6.60"],"expectedCorrect":[3],"engineSceneId":"MT_YOUNG_DRIVERS_ACCIDENT_RISK_190_V1","countryPackId":"MT-LPTV","visualStatus":"final-real-footage","required":["young-driver","18-25","driving","accident-risk","real-scene","question-specific"],"prohibited":["reused-approved-video","generic-unrelated-scene","remote-freeze"]},

  {"key":"partyUsePublicTransport185","category":"alcohol","titleIt":"Dopo aver bevuto a una festa: usa un altro mezzo","titleEn":"After drinking at a party: use another form of transport","status":"ready","questionIds":["CARS5.13"],"expectedCorrect":[2],"engineSceneId":"MT_PARTY_USE_PUBLIC_TRANSPORT_185_V1","countryPackId":"MT-LPTV","visualStatus":"final-real-footage","required":["party","alcohol","do-not-drive","public-transport","real-scene","question-specific"],"prohibited":["reused-approved-video","generic-unrelated-scene","remote-freeze"]},
  {"key":"socialEventAvoidAlcohol185","category":"alcohol","titleIt":"Evento sociale: se devi guidare evita completamente l’alcol","titleEn":"Social event: if you must drive, avoid alcohol completely","status":"ready","questionIds":["CARS5.14"],"expectedCorrect":[2],"engineSceneId":"MT_SOCIAL_EVENT_AVOID_ALCOHOL_185_V1","countryPackId":"MT-LPTV","visualStatus":"final-real-footage","required":["social-event","driving-later","zero-alcohol","non-alcoholic-drink","real-scene","question-specific"],"prohibited":["reused-approved-video","generic-unrelated-scene","remote-freeze"]},
  {"key":"alcoholEightHoursRisk185","category":"alcohol","titleIt":"Otto ore dopo: potresti non essere ancora idoneo a guidare","titleEn":"Eight hours later: you may still be unfit to drive","status":"ready","questionIds":["CARS5.15"],"expectedCorrect":[2,3],"engineSceneId":"MT_ALCOHOL_EIGHT_HOURS_RISK_185_V1","countryPackId":"MT-LPTV","visualStatus":"final-real-footage","required":["alcohol","eight-hours","hangover","unfit-to-drive","legal-limit","real-scene","question-specific"],"prohibited":["reused-approved-video","generic-unrelated-scene","remote-freeze"]},
  {"key":"medicineSlowReactions185","category":"medicines","titleIt":"Farmaci prescritti: possono rallentare le reazioni","titleEn":"Prescription medicine: it can slow your reactions","status":"ready","questionIds":["CARS5.16"],"expectedCorrect":[2],"engineSceneId":"MT_MEDICINE_SLOW_REACTIONS_185_V1","countryPackId":"MT-LPTV","visualStatus":"final-real-footage","required":["prescription-medicine","doctor","slow-reactions","driving-safety","real-scene","question-specific"],"prohibited":["reused-approved-video","generic-unrelated-scene","remote-freeze"]},
  {"key":"medicineDoctorCheck185","category":"medicines","titleIt":"Farmaco che causa sonnolenza: chiedi al medico prima di guidare","titleEn":"Drowsy medicine: check with your doctor before driving","status":"ready","questionIds":["CARS5.17"],"expectedCorrect":[3],"engineSceneId":"MT_MEDICINE_DOCTOR_CHECK_185_V1","countryPackId":"MT-LPTV","visualStatus":"final-real-footage","required":["medicine","drowsiness","doctor-check","do-not-drive-until-cleared","real-scene","question-specific"],"prohibited":["reused-approved-video","generic-unrelated-scene","remote-freeze"]},

  {"key":"alcoholLikelyEffects180","category":"alcohol","titleIt":"Alcol: giudizio, falsa sicurezza e coordinazione","titleEn":"Alcohol: judgement, false confidence and coordination","status":"ready","questionIds":["CARS5.7"],"expectedCorrect":[0,1,5],"engineSceneId":"MT_ALCOHOL_LIKELY_EFFECTS_180_V1","countryPackId":"MT-LPTV","visualStatus":"final-real-footage","required":["alcohol","driving","poor-judgement","false-confidence","reduced-coordination","real-scene","question-specific"],"prohibited":["reused-approved-video","generic-unrelated-scene","remote-freeze"]},
  {"key":"alcoholAnyAmountEffects180","category":"alcohol","titleIt":"Alcol: falsa sicurezza, velocità e reazioni","titleEn":"Alcohol: false confidence, speed judgement and reactions","status":"ready","questionIds":["CARS5.8"],"expectedCorrect":[0,3,4],"engineSceneId":"MT_ALCOHOL_ANY_AMOUNT_EFFECTS_180_V1","countryPackId":"MT-LPTV","visualStatus":"final-real-footage","required":["alcohol","driving","false-confidence","speed-judgement","slow-reactions","real-scene","question-specific"],"prohibited":["reused-approved-video","generic-unrelated-scene","remote-freeze"]},
  {"key":"pubLunchNoAlcohol180","category":"alcohol","titleIt":"Pranzo al pub: se devi guidare, niente alcol","titleEn":"Pub lunch: if you must drive, choose no alcohol","status":"ready","questionIds":["CARS5.9"],"expectedCorrect":[3],"engineSceneId":"MT_PUB_LUNCH_NO_ALCOHOL_180_V1","countryPackId":"MT-LPTV","visualStatus":"final-real-footage","required":["pub-lunch","driving-later","no-alcohol","safe-choice","real-scene","question-specific"],"prohibited":["reused-approved-video","generic-unrelated-scene","remote-freeze"]},
  {"key":"alcoholReducesConcentration180","category":"alcohol","titleIt":"Alcol: riduce la concentrazione alla guida","titleEn":"Alcohol: reduces concentration while driving","status":"ready","questionIds":["CARS5.11"],"expectedCorrect":[3],"engineSceneId":"MT_ALCOHOL_REDUCES_CONCENTRATION_180_V1","countryPackId":"MT-LPTV","visualStatus":"final-real-footage","required":["alcohol","driving","reduced-concentration","attention","real-scene","question-specific"],"prohibited":["reused-approved-video","generic-unrelated-scene","remote-freeze"]},
  {"key":"alcoholNextDayRisk180","category":"alcohol","titleIt":"Alcol il giorno dopo: attenzione e limite legale","titleEn":"Alcohol the next day: concentration and legal limit","status":"ready","questionIds":["CARS5.12"],"expectedCorrect":[0,1],"engineSceneId":"MT_ALCOHOL_NEXT_DAY_RISK_180_V1","countryPackId":"MT-LPTV","visualStatus":"final-real-footage","required":["alcohol","next-day","hangover","concentration","legal-limit","real-scene","question-specific"],"prohibited":["reused-approved-video","generic-unrelated-scene","remote-freeze"]},
  {"key":"alcoholDrivingEffects175","category":"alcohol","titleIt":"Alcol e guida: tre effetti pericolosi","titleEn":"Alcohol and driving: three dangerous effects","status":"ready","questionIds":["CARS5.6"],"expectedCorrect":[0,1,4],"engineSceneId":"MT_ALCOHOL_DRIVING_EFFECTS_175_V1","countryPackId":"MT-LPTV","visualStatus":"final-real-footage","required":["alcohol","driving","less-control","speed-judgement","false-confidence","real-scene","question-specific"],"prohibited":["reused-approved-video","generic-unrelated-scene","remote-freeze"]},
  {"key":"concentrationRisks175","category":"concentration","titleIt":"Concentrazione: musica alta, stanchezza e droghe","titleEn":"Concentration: loud music, tiredness and drugs","status":"ready","questionIds":["CARS5.10"],"expectedCorrect":[0,1,4],"engineSceneId":"MT_CONCENTRATION_RISKS_175_V1","countryPackId":"MT-LPTV","visualStatus":"final-real-footage","required":["concentration","loud-music","tiredness","drugs","real-scene","question-specific"],"prohibited":["reused-approved-video","generic-unrelated-scene","remote-freeze"]},
  {"key":"pelicanCentralIsland175","category":"pedestrian-crossings","titleIt":"Pelican crossing con isola centrale: un unico attraversamento","titleEn":"Pelican crossing with central island: one complete crossing","status":"ready","questionIds":["CARS2.1"],"expectedCorrect":[1],"engineSceneId":"MT_PELICAN_CENTRAL_ISLAND_175_V1","countryPackId":"MT-LPTV","visualStatus":"final-real-footage","required":["pelican-crossing","central-island","one-crossing","real-scene","question-specific"],"prohibited":["reused-approved-video","generic-unrelated-scene","remote-freeze"]},
  {"key":"pelicanAmberMeaning175","category":"pedestrian-crossings","titleIt":"Pelican crossing: significato della luce gialla","titleEn":"Pelican crossing: meaning of the amber light","status":"ready","questionIds":["CARS2.2"],"expectedCorrect":[0,1],"engineSceneId":"MT_PELICAN_AMBER_MEANING_175_V1","countryPackId":"MT-LPTV","visualStatus":"final-real-footage","required":["pelican-crossing","amber-light","pedestrians-crossing","stop","real-scene","question-specific"],"prohibited":["reused-approved-video","generic-unrelated-scene","remote-freeze"]},
  {"key":"pelicanApproachAmber175","category":"pedestrian-crossings","titleIt":"Pelican crossing: avvicinamento con luce gialla","titleEn":"Pelican crossing: approaching on amber","status":"ready","questionIds":["CARS2.3"],"expectedCorrect":[0,3],"engineSceneId":"MT_PELICAN_APPROACH_AMBER_175_V1","countryPackId":"MT-LPTV","visualStatus":"final-real-footage","required":["pelican-crossing","approach","amber-light","stop","wait-signal","real-scene","question-specific"],"prohibited":["reused-approved-video","generic-unrelated-scene","remote-freeze"]},

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
   key:'noRightTurnSignMeaning',category:'road-signs',titleIt:'Divieto di svolta a destra',titleEn:'No right turn',status:'ready',
   questionIds:['CARS11.10'],expectedCorrect:[3],engineSceneId:'MT_NO_RIGHT_TURN_SIGN_MEANING_V1',countryPackId:'MT-LPTV',visualStatus:'final-real-footage',
   required:['no-right-turn-sign','prohibition','right-turn'],prohibited:['right-bend','road-closed','reused-approved-video']
  },
  {
   key:'redTrafficLightMeaning',category:'traffic-signals',titleIt:'Semaforo rosso: fermati dietro la linea',titleEn:'Red light: stop behind the line',status:'ready',
   questionIds:['CARS11.58'],expectedCorrect:[0],engineSceneId:'MT_RED_TRAFFIC_LIGHT_MEANING_V1',countryPackId:'MT-LPTV',visualStatus:'final-real-footage',
   required:['red-light','stop','stop-line'],prohibited:['go-if-clear','turn-left','reused-approved-video']
  },
  {
   key:'maximumSpeedLimitMeaning',category:'speed-limits',titleIt:'Limite massimo: non superare il numero indicato',titleEn:'Maximum speed: do not exceed the number shown',status:'ready',
   questionIds:['CARS10.6'],expectedCorrect:[3],engineSceneId:'MT_MAXIMUM_SPEED_LIMIT_MEANING_V1',countryPackId:'MT-LPTV',visualStatus:'final-real-footage',
   required:['maximum-speed-limit-sign','number','legal-maximum'],prohibited:['advisory-speed','target-speed','reused-approved-video']
  },
  {
   key:'ballIntoRoadChildren',category:'vulnerable-road-users',titleIt:'Palla in strada: aspettati un bambino',titleEn:'Ball in road: expect a child',status:'ready',
   questionIds:['CARS6.18'],expectedCorrect:[2],engineSceneId:'MT_BALL_INTO_ROAD_CHILDREN_V1',countryPackId:'MT-LPTV',visualStatus:'final-real-footage',
   required:['ball','road','children-risk','slow-ready-stop'],prohibited:['continue-speed','horn-only','reused-approved-video']
  },
  {
   key:'wheelchairZebraPrepareStop',category:'vulnerable-road-users',titleIt:'Sedia a rotelle alla zebra: preparati a fermarti',titleEn:'Wheelchair at zebra: be prepared to stop',status:'ready',
   questionIds:['CARS6.23'],expectedCorrect:[3],engineSceneId:'MT_WHEELCHAIR_ZEBRA_PREPARE_STOP_V1',countryPackId:'MT-LPTV',visualStatus:'final-real-footage',
   required:['wheelchair','pedestrian-crossing','zebra-crossing','prepare-stop'],prohibited:['wave-across','continue','reused-approved-video']
  },


  {
   key:'whiteStickBlindPedestrian',category:'vulnerable-road-users',titleIt:'Bastone bianco: pedone non vedente',titleEn:'White stick: blind pedestrian',status:'ready',
   questionIds:['CARS6.22'],expectedCorrect:[3],engineSceneId:'MT_WHITE_STICK_BLIND_PEDESTRIAN_V1',countryPackId:'MT-LPTV',visualStatus:'final-real-footage',
   required:['white-stick','blind-pedestrian','visual-impairment','pedestrian'],prohibited:['deaf-only','elderly-only','reused-approved-video']
  },
  {
   key:'correctiveGlassesAlwaysDriving',category:'eyesight',titleIt:'Occhiali correttivi: indossali sempre alla guida',titleEn:'Corrective glasses: wear them whenever driving',status:'ready',
   questionIds:['CARS5.3'],expectedCorrect:[0],engineSceneId:'MT_CORRECTIVE_GLASSES_ALWAYS_DRIVING_V1',countryPackId:'MT-LPTV',visualStatus:'final-real-footage',
   required:['driver','glasses','driving','corrective-lenses'],prohibited:['poor-visibility-only','long-journey-only','reused-approved-video']
  },
  {
   key:'eyesightStandardCorrectiveLenses',category:'eyesight',titleIt:'Standard visivo: occhiali o lenti se necessari',titleEn:'Eyesight standard: glasses or lenses when required',status:'ready',
   questionIds:['CARS5.5'],expectedCorrect:[3],engineSceneId:'MT_EYESIGHT_STANDARD_CORRECTIVE_LENSES_V1',countryPackId:'MT-LPTV',visualStatus:'final-real-footage',
   required:['driver','glasses','eyesight-standard','corrective-lenses'],prohibited:['family-history','optional-eyewear','reused-approved-video']
  },
  {
   key:'hardShoulderEmergencyOnly',category:'dual-carriageways',titleIt:'Corsia di emergenza: solo per emergenze',titleEn:'Hard shoulder: emergencies only',status:'ready',
   questionIds:['CARS9.7'],expectedCorrect:[0],engineSceneId:'MT_HARD_SHOULDER_EMERGENCY_ONLY_V1',countryPackId:'MT-LPTV',visualStatus:'final-real-footage',
   required:['highway','roadside','emergency-stop','breakdown'],prohibited:['rest-stop','normal-parking','reused-approved-video']
  },
  {
   key:'doNotFollowTooClosely',category:'following-distance',titleIt:'Distanza: non seguire troppo da vicino',titleEn:'Following distance: do not follow too closely',status:'ready',
   questionIds:['CARS2.12'],expectedCorrect:[2],engineSceneId:'MT_DO_NOT_FOLLOW_TOO_CLOSELY_V1',countryPackId:'MT-LPTV',visualStatus:'final-real-footage',
   required:['vehicle-ahead','following-distance','safe-gap','traffic'],prohibited:['tailgating-as-correct','reused-approved-video']
  },


  {
   key:'brakeLightsSignal',category:'signals',titleIt:'Luci di stop: segnalano rallentamento o arresto',titleEn:'Brake lights: signal slowing or stopping',status:'ready',
   questionIds:['CARS10.25'],expectedCorrect:[0],engineSceneId:'MT_BRAKE_LIGHTS_SIGNAL_V1',countryPackId:'MT-LPTV',visualStatus:'final-real-footage',
   required:['brake-lights','rear-vehicle','slowing-stopping','signal'],prohibited:['indicator-only','headlights-only','reused-approved-video']
  },
  {
   key:'hazardLightsSuddenSlowdown',category:'dual-carriageways',titleIt:'Hazard davanti: traffico in rapido rallentamento',titleEn:'Hazard lights ahead: traffic slowing suddenly',status:'ready',
   questionIds:['CARS9.4'],expectedCorrect:[2],engineSceneId:'MT_HAZARD_LIGHTS_SUDDEN_SLOWDOWN_V1',countryPackId:'MT-LPTV',visualStatus:'final-real-footage',
   required:['dual-carriageway','hazard-lights','traffic-ahead','sudden-slowing'],prohibited:['lane-change-signal','police-speed-check','reused-approved-video']
  },
  {
   key:'longVehicleRoundaboutCourse',category:'roundabouts',titleIt:'Veicolo lungo: traiettoria più ampia in rotatoria',titleEn:'Long vehicle: wider course at a roundabout',status:'ready',
   questionIds:['CARS10.27'],expectedCorrect:[3],engineSceneId:'MT_LONG_VEHICLE_ROUNDABOUT_COURSE_V1',countryPackId:'MT-LPTV',visualStatus:'final-real-footage',
   required:['long-vehicle','bus','roundabout','wide-course'],prohibited:['sports-car','estate-car','reused-approved-video']
  },
  {
   key:'leftLaneBeforeExit',category:'dual-carriageways',titleIt:'Prossima uscita: posizionati nella corsia sinistra',titleEn:'Next exit: position in the left lane',status:'ready',
   questionIds:['CARS9.10'],expectedCorrect:[1],engineSceneId:'MT_LEFT_LANE_BEFORE_EXIT_V1',countryPackId:'MT-LPTV',visualStatus:'final-real-footage',
   required:['uk-motorway','left-driving','exit','left-lane'],prohibited:['hard-shoulder-driving','middle-lane-only','reused-approved-video']
  },
  {
   key:'giveWayPedestriansJunction',category:'pedestrian',titleIt:'Svolta a sinistra: dai precedenza ai pedoni',titleEn:'Turning left: give way to pedestrians',status:'ready',
   questionIds:['CARS6.5'],expectedCorrect:[3],engineSceneId:'MT_GIVE_WAY_PEDESTRIANS_JUNCTION_V1',countryPackId:'MT-LPTV',visualStatus:'final-real-footage',
   required:['junction','pedestrians-crossing','vehicles','give-way'],prohibited:['sound-horn','wave-across','force-through','reused-approved-video']
  },

  {
   key:'hardShoulderRejoinSpeed',category:'dual-carriageways',titleIt:'Rientro dalla corsia di emergenza: accelera prima di immetterti',titleEn:'Rejoining from hard shoulder: build speed before merging',status:'ready',
   questionIds:['CARS9.8'],expectedCorrect:[2],engineSceneId:'MT_HARD_SHOULDER_REJOIN_SPEED_V1',countryPackId:'MT-LPTV',visualStatus:'final-real-footage',
   required:['hard-shoulder','highway-entry','build-speed','merge'],prohibited:['move-out-first','hazard-lights-merge','reused-approved-video']
  },
  {
   key:'missedExitContinueNext',category:'dual-carriageways',titleIt:'Uscita mancata: prosegui fino alla successiva',titleEn:'Missed exit: continue to the next one',status:'ready',
   questionIds:['CARS9.11'],expectedCorrect:[1],engineSceneId:'MT_MISSED_EXIT_CONTINUE_NEXT_V1',countryPackId:'MT-LPTV',visualStatus:'final-real-footage',
   required:['highway','exit-sign','continue-forward','next-exit'],prohibited:['reverse','u-turn','hard-shoulder-reverse','reused-approved-video']
  },
  {
   key:'driverCausesSkid',category:'skidding',titleIt:'Sbandata: il conducente è la causa principale',titleEn:'Skid: the driver is the main cause',status:'ready',
   questionIds:['CARS4.16'],expectedCorrect:[1],engineSceneId:'MT_DRIVER_CAUSES_SKID_V1',countryPackId:'MT-LPTV',visualStatus:'final-real-footage',
   required:['driver','skid','sideways-motion','high-speed','curved-road'],prohibited:['road-alone-causes-skid','weather-alone-causes-skid','reused-approved-video']
  },
  {
   key:'shockStayAndReassure',category:'first-aid',titleIt:'Shock: resta con il ferito e rassicuralo',titleEn:'Shock: stay with the casualty and reassure them',status:'ready',
   questionIds:['CARS13.11'],expectedCorrect:[0,1],engineSceneId:'MT_SHOCK_STAY_REASSURE_V1',countryPackId:'MT-LPTV',visualStatus:'final-real-footage',
   required:['patient','paramedic','hand-holding','reassurance','stay-with-casualty'],prohibited:['leave-alone','drink','cigarette','reused-approved-video']
  },
  {
   key:'firstAidAbc',category:'first-aid',titleIt:'Primo soccorso ABC: vie aeree, respirazione, circolazione',titleEn:'First aid ABC: airway, breathing, circulation',status:'ready',
   questionIds:['CARS13.8'],expectedCorrect:[0,1,4],engineSceneId:'MT_FIRST_AID_ABC_V1',countryPackId:'MT-LPTV',visualStatus:'final-real-footage',
   required:['first-aid','airway-management','breathing','cpr','circulation'],prohibited:['broken-bones-priority','alert-only','reused-approved-video']
  },

  {
   key:'rightBendImproveView',category:'bends',titleIt:'Curva a destra: tieni la sinistra per vedere meglio',titleEn:'Right-hand bend: keep left to improve the view',status:'ready',
   questionIds:['CARS4.28'],expectedCorrect:[3],engineSceneId:'MT_RIGHT_BEND_IMPROVE_VIEW_V1',countryPackId:'MT-LPTV',visualStatus:'final-real-footage',
   required:['right-hand-bend','keep-left','better-view','uk-road'],prohibited:['keep-right','overtake','reused-approved-video']
  },
  {
   key:'rightBendKeepLeft',category:'bends',titleIt:'Curva a destra: mantieni la sinistra',titleEn:'Right-hand bend: keep left',status:'ready',
   questionIds:['CARS4.29'],expectedCorrect:[1],engineSceneId:'MT_RIGHT_BEND_KEEP_LEFT_V1',countryPackId:'MT-LPTV',visualStatus:'final-real-footage',
   required:['right-hand-bend','keep-left','better-view','british-countryside'],prohibited:['keep-right','faster-bend','reused-approved-video']
  },
  {
   key:'dualCarriagewayKeepLeft',category:'dual-carriageways',titleIt:'Doppia carreggiata: tieni la sinistra salvo sorpasso',titleEn:'Dual carriageway: keep left unless overtaking',status:'ready',
   questionIds:['CARS9.3'],expectedCorrect:[1],engineSceneId:'MT_DUAL_CARRIAGEWAY_KEEP_LEFT_V1',countryPackId:'MT-LPTV',visualStatus:'final-real-footage',
   required:['dual-carriageway','keep-left','overtaking-rule','uk-motorway'],prohibited:['keep-middle','undertake','reused-approved-video']
  },
  {
   key:'twoSecondMinimumGap',category:'following-distance',titleIt:'Distanza minima: almeno due secondi',titleEn:'Minimum following gap: at least two seconds',status:'ready',
   questionIds:['CARS9.9'],expectedCorrect:[3],engineSceneId:'MT_TWO_SECOND_MINIMUM_GAP_V1',countryPackId:'MT-LPTV',visualStatus:'final-real-footage',
   required:['vehicle-ahead','safe-gap','two-second-rule','uk-motorway'],prohibited:['one-second','tailgating-as-correct','reused-approved-video']
  },
  {
   key:'collisionStopAtScene',category:'accidents',titleIt:'Collisione: fermati sul luogo',titleEn:'Collision: stop at the scene',status:'ready',
   questionIds:['CARS6.59'],expectedCorrect:[2],engineSceneId:'MT_COLLISION_STOP_AT_SCENE_V1',countryPackId:'MT-LPTV',visualStatus:'final-real-footage',
   required:['collision','crash-scene','stop-at-scene','vehicle-damage'],prohibited:['drive-away','insurance-first','reused-approved-video']
  },


  {
   key:'elderlyPelicanWait',category:'vulnerable-road-users',titleIt:'Pelican: aspetta gli anziani ancora in attraversamento',titleEn:'Pelican: wait for elderly pedestrians still crossing',status:'ready',
   questionIds:['CARS6.15'],expectedCorrect:[3],engineSceneId:'MT_ELDERLY_PELICAN_WAIT_V1',countryPackId:'MT-LPTV',visualStatus:'final-real-footage',
   required:['elderly-pedestrians','pedestrian-crossing','crossing-in-progress','wait-patiently'],prohibited:['flash-headlights','rev-engine','wave-hurry','reused-approved-video']
  },
  {
   key:'dualCarriagewayJoinLeft',category:'dual-carriageways',titleIt:'Doppia carreggiata: dopo l’ingresso posizionati a sinistra',titleEn:'Dual carriageway: after joining, position in the left lane',status:'ready',
   questionIds:['CARS9.1'],expectedCorrect:[3],engineSceneId:'MT_DUAL_CARRIAGEWAY_JOIN_LEFT_V1',countryPackId:'MT-LPTV',visualStatus:'final-real-footage',
   required:['uk-motorway','multiple-lanes','left-lane','left-driving'],prohibited:['centre-lane-normal','overtake-immediately','reused-approved-video']
  },
  {
   key:'accidentProtectYourself',category:'accidents',titleIt:'Incidente: non mettere te stesso in pericolo',titleEn:'Accident scene: do not put yourself at risk',status:'ready',
   questionIds:['CARS13.1'],expectedCorrect:[0],engineSceneId:'MT_ACCIDENT_PROTECT_YOURSELF_V1',countryPackId:'MT-LPTV',visualStatus:'final-real-footage',
   required:['accident-scene','paramedics','protective-response','street-emergency'],prohibited:['run-into-danger','leave-engines-running','pull-everyone-out','reused-approved-video']
  },
  {
   key:'antiDazzleInteriorMirror',category:'night-driving',titleIt:'Abbagliamento da dietro: usa lo specchio antiabbagliamento',titleEn:'Rear glare at night: set the interior mirror to anti-dazzle',status:'ready',
   questionIds:['CARS6.64'],expectedCorrect:[0],engineSceneId:'MT_ANTI_DAZZLE_INTERIOR_MIRROR_V1',countryPackId:'MT-LPTV',visualStatus:'final-real-footage',
   required:['rearview-mirror','driver','mirror-adjustment','anti-dazzle'],prohibited:['brake-sharply','dazzle-other-driver','reused-approved-video']
  },
  {
   key:'unconsciousCasualtyAbc',category:'first-aid',titleIt:'Incidente: controlla subito vie aeree, circolazione e respirazione',titleEn:'Accident: urgently check airway, circulation and breathing',status:'ready',
   questionIds:['CARS13.7'],expectedCorrect:[1,3,4],engineSceneId:'MT_UNCONSCIOUS_CASUALTY_ABC_V1',countryPackId:'MT-LPTV',visualStatus:'final-real-footage',
   required:['first-aid','airway','breathing','circulation','cpr-training'],prohibited:['broken-bones-first','shock-only','reused-approved-video']
  },

  {
   key:'accidentFirstArrivalActions',category:'accidents',titleIt:'Incidente: metti in sicurezza e chiama i soccorsi',titleEn:'Accident: secure the scene and call emergency services',status:'ready',
   questionIds:['CARS13.2'],expectedCorrect:[0,1,2,3],engineSceneId:'MT_ACCIDENT_FIRST_ARRIVAL_ACTIONS_V1',countryPackId:'MT-LPTV',visualStatus:'final-real-footage',
   required:['accident','ambulance','emergency-response','call-emergency-services','scene-safety'],prohibited:['reused-approved-video']
  },

  {
   key:'seriousAccidentProtectScene',category:'accidents',titleIt:'Incidente grave: proteggi la scena e chiama l’ambulanza',titleEn:'Serious accident: protect the scene and call an ambulance',status:'ready',
   questionIds:['CARS13.3'],expectedCorrect:[2,3,4],engineSceneId:'MT_SERIOUS_ACCIDENT_PROTECT_SCENE_V1',countryPackId:'MT-LPTV',visualStatus:'final-real-footage',
   required:['serious-accident','ambulance','paramedics','hazard-lights','move-uninjured-away'],prohibited:['reused-approved-video']
  },

  {
   key:'motorcyclistAirwayBreathingBleeding',category:'first-aid',titleIt:'Motociclista incosciente: vie aeree, respirazione e sanguinamento',titleEn:'Unconscious motorcyclist: airway, breathing and bleeding',status:'ready',
   questionIds:['CARS13.5'],expectedCorrect:[0,1,4],engineSceneId:'MT_MOTORCYCLIST_AIRWAY_BREATHING_BLEEDING_V1',countryPackId:'MT-LPTV',visualStatus:'final-real-footage',
   required:['first-aid','airway','breathing','severe-bleeding','bandage','paramedic'],prohibited:['reused-approved-video']
  },

  {
   key:'unconsciousMotorcyclistBreathingFirst',category:'first-aid',titleIt:'Motociclista incosciente: controlla prima la respirazione',titleEn:'Unconscious motorcyclist: check breathing first',status:'ready',
   questionIds:['CARS13.6'],expectedCorrect:[0],engineSceneId:'MT_UNCONSCIOUS_MOTORCYCLIST_BREATHING_FIRST_V1',countryPackId:'MT-LPTV',visualStatus:'final-real-footage',
   required:['first-aid','breathing','airway','rescue-breaths','unconscious-casualty'],prohibited:['reused-approved-video']
  },

  {
   key:'unconsciousPrioritiesAbcBleeding',category:'first-aid',titleIt:'Persona incosciente: respirazione, vie aeree e sanguinamento',titleEn:'Unconscious casualty: breathing, airway and severe bleeding',status:'ready',
   questionIds:['CARS13.9'],expectedCorrect:[0,1,2],engineSceneId:'MT_UNCONSCIOUS_PRIORITIES_ABC_BLEEDING_V1',countryPackId:'MT-LPTV',visualStatus:'final-real-footage',
   required:['first-aid','airway','breathing','severe-bleeding','cpr-training'],prohibited:['reused-approved-video']
  },


  /* 39.12.22 Replay100 — five new strict real-scene mappings. */
  {
   key:'headlightFlashPresence',category:'signals',titleIt:'Lampeggio fari: segnala solo la tua presenza',titleEn:'Headlight flash: only signal your presence',status:'ready',
   questionIds:['CARS2.33'],expectedCorrect:[3],engineSceneId:'MT_HEADLIGHT_FLASH_PRESENCE_V1',countryPackId:'MT-LPTV',visualStatus:'final-real-footage',
   required:['headlights','flashing','vehicle','presence-warning'],prohibited:['give-way-message','right-of-way-message','reused-approved-video']
  },
  {
   key:'restrictedJunctionParkedCars',category:'junctions',titleIt:'Incrocio con visuale coperta: fermati e avanza lentamente',titleEn:'Restricted junction: stop and creep forward',status:'ready',
   questionIds:['CARS6.10'],expectedCorrect:[3],engineSceneId:'MT_RESTRICTED_JUNCTION_PARKED_CARS_V1',countryPackId:'MT-LPTV',visualStatus:'final-real-footage',
   required:['junction','parked-cars','restricted-view','creep-forward'],prohibited:['pull-out-fast','horn-and-go','reused-approved-video']
  },
  {
   key:'oneWayRightTurnPosition',category:'positioning',titleIt:'Senso unico: posizione a destra prima della svolta',titleEn:'One-way street: position right before turning right',status:'ready',
   questionIds:['CARS2.36'],expectedCorrect:[3],engineSceneId:'MT_ONE_WAY_RIGHT_TURN_POSITION_V1',countryPackId:'MT-LPTV',visualStatus:'final-real-footage',
   required:['one-way-street','right-side-position','right-turn','positioning'],prohibited:['left-lane-position','centre-only','reused-approved-video']
  },
  {
   key:'learnerDriverPatience',category:'attitude',titleIt:'Learner driver: sii paziente',titleEn:'Learner driver: be patient',status:'ready',
   questionIds:['CARS6.61'],expectedCorrect:[0],engineSceneId:'MT_LEARNER_DRIVER_PATIENCE_V1',countryPackId:'MT-LPTV',visualStatus:'final-real-footage',
   required:['learner-driver','driving-lesson','patience','no-pressure'],prohibited:['rev-engine','flash-headlights','overtake-immediately','reused-approved-video']
  },
  {
   key:'pelicanChangingSignalPedestrians',category:'pedestrian-crossings',titleIt:'Pelican: lascia terminare l’attraversamento',titleEn:'Pelican crossing: let pedestrians finish crossing',status:'ready',
   questionIds:['CARS6.13'],expectedCorrect:[2],engineSceneId:'MT_PELICAN_CHANGING_SIGNAL_PEDESTRIANS_V1',countryPackId:'MT-LPTV',visualStatus:'final-real-footage',
   required:['pedestrian-crossing','pedestrians','red-light','give-way'],prohibited:['move-off-immediately','wave-across','reused-approved-video']
  },

  {
   key:'closeFollowerIncreaseGap',category:'attitude',titleIt:"Veicolo troppo vicino dietro: aumenta lo spazio davanti",titleEn:"Close follower: increase the gap ahead",status:'ready',
   questionIds:['CARS2.19'],expectedCorrect:[1],engineSceneId:'MT_CLOSE_FOLLOWER_INCREASE_GAP_V1',countryPackId:'MT-LPTV',visualStatus:'final-real-footage',
   required:['following-traffic','close-follower','mirror','increase-gap-ahead'],prohibited:['reused-approved-video','generic-unrelated-scene']
  },

  {
   key:'limitedVisibilityJunctionCreep',category:'junctions',titleIt:"Incrocio con visuale limitata: avanza lentamente guardando entrambi i lati",titleEn:"Limited-view junction: creep forward checking both ways",status:'ready',
   questionIds:['CARS4.20'],expectedCorrect:[3],engineSceneId:'MT_LIMITED_VISIBILITY_JUNCTION_CREEP_V1',countryPackId:'MT-LPTV',visualStatus:'final-real-footage',
   required:['junction','limited-view','creep-forward','look-both-ways'],prohibited:['reused-approved-video','generic-unrelated-scene']
  },

  {
   key:'elderlyDriverAllowTime',category:'vulnerable-road-users',titleIt:"Conducente anziano: può reagire più lentamente",titleEn:"Elderly driver: may react more slowly",status:'ready',
   questionIds:['CARS6.19'],expectedCorrect:[2],engineSceneId:'MT_ELDERLY_DRIVER_ALLOW_TIME_V1',countryPackId:'MT-LPTV',visualStatus:'final-real-footage',
   required:['elderly-driver','car','allow-time','patience'],prohibited:['reused-approved-video','generic-unrelated-scene']
  },

  {
   key:'motorcyclistUnevenRoadRoom',category:'motorcyclists',titleIt:"Motociclista su fondo irregolare: lascia più spazio",titleEn:"Motorcyclist on uneven road: leave extra room",status:'ready',
   questionIds:['CARS6.26'],expectedCorrect:[2],engineSceneId:'MT_MOTORCYCLIST_UNEVEN_ROAD_ROOM_V1',countryPackId:'MT-LPTV',visualStatus:'final-real-footage',
   required:['motorcyclist','rough-road','uneven-surface','extra-room'],prohibited:['reused-approved-video','generic-unrelated-scene']
  },

  {
   key:'hardBrakingBendSkid',category:'vehicle-control',titleIt:"Frenata forte in curva: rischio di sbandata",titleEn:"Hard braking on a bend: skidding risk",status:'ready',
   questionIds:['CARS4.6'],expectedCorrect:[1],engineSceneId:'MT_HARD_BRAKING_BEND_SKID_V1',countryPackId:'MT-LPTV',visualStatus:'final-real-footage',
   required:['car','sharp-bend','hard-braking','skid'],prohibited:['reused-approved-video','generic-unrelated-scene']
  },


  /* 39.12.26 Replay110 — five new strict real-scene mappings. */
  {
   key:'dualCarriagewayJoinGiveWay',category:'dual-carriageways',titleIt:'Immissione su doppia carreggiata: dai precedenza',titleEn:'Joining a dual carriageway: give way',status:'ready',
   questionIds:['CARS9.2'],expectedCorrect:[3],engineSceneId:'MT_DUAL_CARRIAGEWAY_JOIN_GIVE_WAY_V1',countryPackId:'MT-LPTV',visualStatus:'final-real-footage',
   required:['dual-carriageway','slip-road','merge','give-way-to-main-traffic'],prohibited:['stop-at-end','hard-shoulder','reused-approved-video','generic-unrelated-scene']
  },
  {
   key:'slowTrafficCheckFilteringMotorcycles',category:'motorcyclists',titleIt:'Traffico lento: controlla i motociclisti prima di cambiare corsia',titleEn:'Slow traffic: check filtering motorcyclists before changing lane',status:'ready',
   questionIds:['CARS6.49'],expectedCorrect:[3],engineSceneId:'MT_SLOW_TRAFFIC_CHECK_FILTERING_MOTORCYCLES_V1',countryPackId:'MT-LPTV',visualStatus:'final-real-footage',
   required:['slow-traffic','motorcycle','filtering','lane-change-check'],prohibited:['horn','arm-signal','reused-approved-video','generic-unrelated-scene']
  },
  {
   key:'motorcyclistsQueueHazards',category:'motorcyclists',titleIt:'Code di traffico: tre pericoli dei motociclisti',titleEn:'Traffic queues: three motorcyclist hazards',status:'ready',
   questionIds:['CARS6.47'],expectedCorrect:[0,3,4],engineSceneId:'MT_MOTORCYCLISTS_QUEUE_HAZARDS_V1',countryPackId:'MT-LPTV',visualStatus:'final-real-footage',
   required:['traffic-queue','motorcycles','passing-close','filtering','cutting-in'],prohibited:['dipped-headlights-as-hazard','single-file-as-hazard','reused-approved-video','generic-unrelated-scene']
  },
  {
   key:'amberBeaconVehicles',category:'signals',titleIt:'Lampeggianti gialli: manutenzione e soccorso stradale',titleEn:'Amber beacons: maintenance and breakdown recovery',status:'ready',
   questionIds:['CARS9.6'],expectedCorrect:[1,3],engineSceneId:'MT_AMBER_BEACON_VEHICLES_V1',countryPackId:'MT-LPTV',visualStatus:'final-real-footage',
   required:['amber-beacon','maintenance-vehicle','breakdown-recovery','warning-light'],prohibited:['doctor-car','blood-transfusion','reused-approved-video','generic-unrelated-scene']
  },
  {
   key:'roadHumpsSlowDown',category:'traffic-calming',titleIt:'Dossi stradali: riduci molto la velocità',titleEn:'Road humps: slow right down',status:'ready',
   questionIds:['CARS4.27'],expectedCorrect:[2],engineSceneId:'MT_ROAD_HUMPS_SLOW_DOWN_V1',countryPackId:'MT-LPTV',visualStatus:'final-real-footage',
   required:['road-hump','residential-road','slow-down','traffic-calming'],prohibited:['stop-and-check-pavements','move-left','reused-approved-video','generic-unrelated-scene']
  },

  /* 39.12.28 Replay115 — five new strict real-scene mappings. */
  {
   key:'rightMirrorOvertakeCheck',category:'junctions',titleIt:'Prima di svoltare a destra: controlla chi sta sorpassando',titleEn:'Before turning right: check for overtaking traffic',status:'ready',
   questionIds:['CARS6.11'],expectedCorrect:[1],engineSceneId:'MT_RIGHT_MIRROR_OVERTAKE_CHECK_V1',countryPackId:'MT-LPTV',visualStatus:'final-real-footage',
   required:['right-mirror','overtaking-traffic','queue','right-turn'],prohibited:['emerging-traffic-only','pedestrian-only','reused-approved-video','generic-unrelated-scene']
  },
  {
   key:'busyJunctionWrongLaneContinue',category:'junctions',titleIt:'Corsia sbagliata all’ultimo momento: continua nella corsia',titleEn:'Wrong lane at the last moment: continue in lane',status:'ready',
   questionIds:['CARS10.21'],expectedCorrect:[0],engineSceneId:'MT_BUSY_JUNCTION_WRONG_LANE_CONTINUE_V1',countryPackId:'MT-LPTV',visualStatus:'final-real-footage',
   required:['busy-junction','multiple-lanes','road-markings','continue-lane'],prohibited:['cut-across','stop-in-lane','force-across','reused-approved-video']
  },
  {
   key:'roundaboutStraightAheadIndicateLeft',category:'roundabouts',titleIt:'Dritto in rotatoria: indica a sinistra dopo l’uscita precedente',titleEn:'Straight ahead at a roundabout: signal left after the previous exit',status:'ready',
   questionIds:['CARS10.26'],expectedCorrect:[0],engineSceneId:'MT_ROUNDABOUT_STRAIGHT_AHEAD_INDICATE_LEFT_V1',countryPackId:'MT-LPTV',visualStatus:'final-real-footage',
   required:['roundabout','straight-ahead','previous-exit','left-indicator'],prohibited:['signal-left-on-approach','signal-right','no-signal','reused-approved-video']
  },
  {
   key:'dualCarriagewaySuddenHazardLights',category:'dual-carriageways',titleIt:'Rallentamento improvviso: accendi le quattro frecce',titleEn:'Sudden slowing: use hazard warning lights',status:'ready',
   questionIds:['CARS9.5'],expectedCorrect:[0],engineSceneId:'MT_DUAL_CARRIAGEWAY_SUDDEN_HAZARD_LIGHTS_V1',countryPackId:'MT-LPTV',visualStatus:'final-real-footage',
   required:['dual-carriageway','sudden-hazard','rapid-slowing','hazard-warning-lights'],prohibited:['flash-headlights','horn','full-beam','reused-approved-video']
  },
  {
   key:'handsFreePhoneDivertsAttention',category:'alertness',titleIt:'Vivavoce: può comunque distogliere l’attenzione',titleEn:'Hands-free phone: can still divert attention',status:'ready',
   questionIds:['CARS1.14'],expectedCorrect:[3],engineSceneId:'MT_HANDS_FREE_PHONE_DIVERTS_ATTENTION_V1',countryPackId:'MT-LPTV',visualStatus:'final-real-footage',
   required:['driver','hands-free','phone-conversation','distraction'],prohibited:['improves-concentration','improves-safety','reused-approved-video','generic-unrelated-scene']
  },

  /* 39.12.29 Replay120 — five new strict real-scene mappings. */
  {"key":"cyclistsRoundaboutAnyDirection","category":"cyclists","titleIt":"Ciclisti in rotatoria: possono andare in qualsiasi direzione","titleEn":"Cyclists at a roundabout: expect any direction","status":"ready","questionIds":["CARS6.30"],"expectedCorrect":[2],"engineSceneId":"MT_CYCLISTS_ROUNDABOUT_ANY_DIRECTION_V1","countryPackId":"MT-LPTV","visualStatus":"final-real-footage","required":["cyclists","roundabout","left-lane","any-direction"],"prohibited":["assume-left-only","assume-straight-only","reused-approved-video","generic-unrelated-scene"]},
  {"key":"extraRoomMotorcyclesBicycles","category":"vulnerable-road-users","titleIt":"Sorpasso: più spazio a motocicli e biciclette","titleEn":"Overtaking: extra room for motorcycles and bicycles","status":"ready","questionIds":["CARS6.33"],"expectedCorrect":[1,3],"engineSceneId":"MT_EXTRA_ROOM_MOTORCYCLES_BICYCLES_V1","countryPackId":"MT-LPTV","visualStatus":"final-real-footage","required":["motorcycles","bicycles","overtaking","extra-room"],"prohibited":["tractor-only","sweeper-only","reused-approved-video","generic-unrelated-scene"]},
  {"key":"windyMotorcyclistExtraRoom","category":"motorcyclists","titleIt":"Vento forte: lascia più spazio al motociclista","titleEn":"Strong wind: give the motorcyclist extra room","status":"ready","questionIds":["CARS6.34"],"expectedCorrect":[1],"engineSceneId":"MT_WINDY_MOTORCYCLIST_EXTRA_ROOM_V1","countryPackId":"MT-LPTV","visualStatus":"final-real-footage","required":["motorcyclist","windy-road","crosswind","extra-room"],"prohibited":["normal-speed-only","reused-approved-video","generic-unrelated-scene"]},
  {"key":"motorcycleStrongWindMostAffected","category":"wind","titleIt":"Vento forte: il motociclo è il più esposto","titleEn":"Strong winds: motorcycles are most affected","status":"ready","questionIds":["CARS6.35"],"expectedCorrect":[1],"engineSceneId":"MT_MOTORCYCLE_STRONG_WIND_MOST_AFFECTED_V1","countryPackId":"MT-LPTV","visualStatus":"final-real-footage","required":["motorcycle","strong-wind","exposed-vehicle"],"prohibited":["car-as-answer","tractor-as-answer","reused-approved-video","generic-unrelated-scene"]},
  {"key":"motorcyclesCyclistsJunctionVisibility","category":"junctions","titleIt":"Incroci: motociclisti e ciclisti sono più difficili da vedere","titleEn":"Junctions: motorcyclists and cyclists are harder to see","status":"ready","questionIds":["CARS6.36"],"expectedCorrect":[2],"engineSceneId":"MT_MOTORCYCLES_CYCLISTS_JUNCTION_VISIBILITY_V1","countryPackId":"MT-LPTV","visualStatus":"final-real-footage","required":["junction","motorcyclist","cyclist","visibility"],"prohibited":["priority-claim","generic-empty-road","reused-approved-video"]},

  /* 39.12.30 Replay125 — five new strict real-scene mappings. */
  {"key":"offsideMirrorBeforeMovingRight","category":"mirrors-observation","titleIt":"Prima di spostarti a destra: controlla lo specchio lato conducente","titleEn":"Before moving right: check the driver-side mirror","status":"ready","questionIds":["SCHOOL.004"],"expectedCorrect":[0],"engineSceneId":"MT_OFFSIDE_MIRROR_BEFORE_MOVING_RIGHT_V1","countryPackId":"MT-LPTV","visualStatus":"final-real-footage","required":["driver-side-mirror","observation","move-right"],"prohibited":["rear-seat","fuel-gauge","generic-unrelated-scene","reused-approved-video"]},
  {"key":"policeFollowingStopSignal","category":"police-signals","titleIt":"Polizia dietro di te: riconosci il segnale di arresto","titleEn":"Police behind you: recognise the stop signal","status":"ready","questionIds":["SCHOOL.013"],"expectedCorrect":[0],"engineSceneId":"MT_POLICE_FOLLOWING_STOP_SIGNAL_V1","countryPackId":"MT-LPTV","visualStatus":"final-real-footage","required":["police-car","blue-lights","flashing-lights","stop-signal"],"prohibited":["horn-only","lights-off","generic-unrelated-scene","reused-approved-video"]},
  {"key":"handsFreePhoneStillDistracts","category":"mobile-phones","titleIt":"Vivavoce alla guida: l’attenzione viene comunque distolta","titleEn":"Hands-free driving calls still divert attention","status":"ready","questionIds":["SCHOOL.018"],"expectedCorrect":[0],"engineSceneId":"MT_HANDS_FREE_PHONE_STILL_DISTRACTS_V1","countryPackId":"MT-LPTV","visualStatus":"final-real-footage","required":["driver","hands-free","phone","distraction"],"prohibited":["safe-phone-claim","improved-concentration","generic-unrelated-scene","reused-approved-video"]},
  {"key":"rightTurnCheckOvertakingMotorcyclist","category":"motorcyclists","titleIt":"Prima di girare a destra: controlla i motociclisti in sorpasso","titleEn":"Before turning right: check for overtaking motorcyclists","status":"ready","questionIds":["SCHOOL.016"],"expectedCorrect":[0],"engineSceneId":"MT_RIGHT_TURN_CHECK_OVERTAKING_MOTORCYCLIST_V1","countryPackId":"MT-LPTV","visualStatus":"final-real-footage","required":["motorcyclist","overtaking","right-side","blind-spot"],"prohibited":["parked-pavement","far-behind","generic-unrelated-scene","reused-approved-video"]},
  {"key":"largeVehicleHidesOvertaker","category":"large-vehicles","titleIt":"Veicolo grande da destra: può nascondere un veicolo in sorpasso","titleEn":"Large vehicle from the right: it may hide an overtaking vehicle","status":"ready","questionIds":["CARS7.4"],"expectedCorrect":[3],"engineSceneId":"MT_LARGE_VEHICLE_HIDES_OVERTAKER_V1","countryPackId":"MT-LPTV","visualStatus":"final-real-footage","required":["large-vehicle","overtaking-car","hidden-vehicle","junction"],"prohibited":["emerge-immediately","steering-claim","generic-unrelated-scene","reused-approved-video"]},

  /* 39.12.31 Replay130 — five new strict real-scene mappings. */
  {"key":"engineOilChangeIntervals","category":"engine-maintenance","titleIt":"Cambio olio motore: riduce attrito e usura","titleEn":"Engine oil changes reduce friction and wear","status":"ready","questionIds":["SCHOOL.008"],"expectedCorrect":[0],"engineSceneId":"MT_ENGINE_OIL_CHANGE_INTERVALS_V1","countryPackId":"MT-LPTV","visualStatus":"final-real-footage","required":["engine-oil","oil-change","engine","maintenance"],"prohibited":["exhaust-smoke","brakes","tyre-pressure","generic-unrelated-scene","reused-approved-video"]},
  {"key":"heavyRainDoubleBrakingDistance","category":"wet-weather","titleIt":"Pioggia intensa: almeno il doppio della distanza di frenata","titleEn":"Heavy rain: allow at least twice the normal braking distance","status":"ready","questionIds":["SCHOOL.010"],"expectedCorrect":[1],"engineSceneId":"MT_HEAVY_RAIN_DOUBLE_BRAKING_DISTANCE_V1","countryPackId":"MT-LPTV","visualStatus":"final-real-footage","required":["heavy-rain","wet-road","poor-visibility","braking-distance"],"prohibited":["dry-road","same-distance","half-distance","generic-unrelated-scene","reused-approved-video"]},
  {"key":"countryRoadHorseRiders","category":"country-roads","titleIt":"Strada di campagna: aspettati cavalieri sul tuo lato","titleEn":"Country road: expect horse riders on your side","status":"ready","questionIds":["SCHOOL.017"],"expectedCorrect":[0],"engineSceneId":"MT_COUNTRY_ROAD_HORSE_RIDERS_V1","countryPackId":"MT-LPTV","visualStatus":"final-real-footage","required":["country-road","horse-riders","approaching","road-position"],"prohibited":["parked-cars-only","traffic-lights","pedestrian-barriers","generic-unrelated-scene","reused-approved-video"]},
  {"key":"excessiveExhaustSmokeOffence","category":"vehicle-emissions","titleIt":"Fumo di scarico eccessivo: possibile infrazione","titleEn":"Excessive exhaust smoke: you may be breaking the law","status":"ready","questionIds":["SCHOOL.020"],"expectedCorrect":[0],"engineSceneId":"MT_EXCESSIVE_EXHAUST_SMOKE_OFFENCE_V1","countryPackId":"MT-LPTV","visualStatus":"final-real-footage","required":["exhaust-smoke","vehicle-emissions","visible-smoke","vehicle-defect"],"prohibited":["normal-exhaust","safe-if-warm","generic-unrelated-scene","reused-approved-video"]},
  {"key":"tunnelLightsStayLane","category":"tunnels","titleIt":"In galleria: luci accese e stessa corsia","titleEn":"In a tunnel: lights on and stay in the same lane","status":"ready","questionIds":["LPOINTS1.171"],"expectedCorrect":[1],"engineSceneId":"MT_TUNNEL_LIGHTS_STAY_LANE_V1","countryPackId":"MT-LPTV","visualStatus":"final-real-footage","required":["tunnel","lights","lane-markings","stay-in-lane"],"prohibited":["hazard-lights-throughout","lane-changing","speeding","generic-unrelated-scene","reused-approved-video"]},

  /* 39.12.33 Replay135 — five new strict mappings. */
  {"key":"avoidOvertakingApproachBend","category":"overtaking","titleIt":"Evita il sorpasso avvicinandoti a una curva","titleEn":"Avoid overtaking on the approach to a bend","status":"ready","questionIds":["LPOINTS1.106"],"expectedCorrect":[2],"engineSceneId":"MT_AVOID_OVERTAKING_APPROACH_BEND_V1","countryPackId":"MT-LPTV","visualStatus":"final-real-footage","required":["bend","curved-road","restricted-view","overtaking"],"prohibited":["clear-straight-road","safe-overtake","reused-approved-video","generic-unrelated-scene"]},
  {"key":"stayCalmWhenOvertaken","category":"attitude","titleIt":"Se vieni sorpassato: resta calmo e continua a guidare","titleEn":"When overtaken: stay calm and continue driving","status":"ready","questionIds":["LPOINTS1.107"],"expectedCorrect":[0],"engineSceneId":"MT_STAY_CALM_WHEN_OVERTAKEN_V1","countryPackId":"MT-LPTV","visualStatus":"final-real-footage","required":["overtaking-vehicle","steady-driving","calm-attitude","no-retaliation"],"prohibited":["race-back","accelerate-against-overtaker","tailgating","reused-approved-video","generic-unrelated-scene"]},
  {"key":"roughWeatherDriveCautiously","category":"weather","titleIt":"Maltempo: guida con maggiore prudenza","titleEn":"Rough weather: drive more cautiously","status":"ready","questionIds":["LPOINTS1.118"],"expectedCorrect":[0],"engineSceneId":"MT_ROUGH_WEATHER_DRIVE_CAUTIOUSLY_V1","countryPackId":"MT-LPTV","visualStatus":"final-real-footage","required":["heavy-rain","poor-visibility","wet-road","cautious-driving"],"prohibited":["dry-clear-road","faster-driving","reused-approved-video","generic-unrelated-scene"]},
  {"key":"weeklyTyrePressureCheck","category":"tyres","titleIt":"Pressione pneumatici: controllala almeno ogni settimana","titleEn":"Tyre pressure: check it at least every week","status":"ready","questionIds":["LPOINTS1.175"],"expectedCorrect":[0],"engineSceneId":"MT_WEEKLY_TYRE_PRESSURE_CHECK_V1","countryPackId":"MT-LPTV","visualStatus":"final-real-footage","required":["tyre","pressure","air","weekly-check"],"prohibited":["annual-check-only","ignore-pressure","reused-approved-video","generic-unrelated-scene"]},
  {"key":"underInflatedTyresHeavySteering","category":"vehicle-faults","titleIt":"Pneumatici sgonfi: possono rendere lo sterzo pesante","titleEn":"Under-inflated tyres can cause heavy steering","status":"ready","questionIds":["LPOINTS1.100"],"expectedCorrect":[1],"engineSceneId":"MT_UNDER_INFLATED_TYRES_HEAVY_STEERING_V1","countryPackId":"MT-LPTV","visualStatus":"final-real-footage","required":["under-inflated-tyre","tyre-inflation","steering-effort","vehicle-fault"],"prohibited":["over-inflated-only","rain-only","full-fuel-tank","reused-approved-video","generic-unrelated-scene"]},

  /* 39.12.34 Replay140 — five new strict mappings. */
  {"key":"noOvertakeHazardConditions","category":"overtaking","titleIt":"Non sorpassare con visuale ostruita, vicino a un incrocio o prima di svoltare","titleEn":"Do not overtake with restricted view, near a junction, or before turning","status":"ready","questionIds":["CARS4.30"],"expectedCorrect":[2,3,4],"engineSceneId":"MT_NO_OVERTAKE_HAZARD_CONDITIONS_V1","countryPackId":"MT-LPTV","visualStatus":"final-real-footage","required":["restricted-view","junction","left-turn","no-overtaking"],"prohibited":["clear-straight-road","safe-overtake","reused-approved-video","generic-unrelated-scene"]},
  {"key":"defensiveDrivingAnticipateHazards","category":"defensive-driving","titleIt":"Guida difensiva: anticipa pericoli e azioni degli altri","titleEn":"Defensive driving: anticipate hazards and others' actions","status":"ready","questionIds":["LPOINTS1.114"],"expectedCorrect":[0],"engineSceneId":"MT_DEFENSIVE_DRIVING_ANTICIPATE_HAZARDS_V1","countryPackId":"MT-LPTV","visualStatus":"final-real-footage","required":["alert-driver","traffic","anticipation","safety-margin"],"prohibited":["aggressive-driving","tailgating","reused-approved-video","generic-unrelated-scene"]},
  {"key":"avoidDistractionsStayFocused","category":"distractions","titleIt":"Evita le distrazioni e resta concentrato sulla strada","titleEn":"Avoid distractions and stay focused on the road","status":"ready","questionIds":["LPOINTS1.115"],"expectedCorrect":[0],"engineSceneId":"MT_AVOID_DISTRACTIONS_STAY_FOCUSED_V1","countryPackId":"MT-LPTV","visualStatus":"final-real-footage","required":["focused-driver","road-attention","distraction-awareness","safe-driving"],"prohibited":["phone-use-while-driving","looking-away","reused-approved-video","generic-unrelated-scene"]},
  {"key":"injuryAccidentCall112Assist","category":"accidents","titleIt":"Incidente con feriti: chiama il 112 e presta assistenza","titleEn":"Injury accident: call 112 and provide assistance","status":"ready","questionIds":["LPOINTS1.124"],"expectedCorrect":[2],"engineSceneId":"MT_INJURY_ACCIDENT_CALL_112_ASSIST_V1","countryPackId":"MT-LPTV","visualStatus":"final-real-footage","required":["injury","emergency-assistance","112","first-aid"],"prohibited":["leave-scene","911","reused-approved-video","generic-unrelated-scene"]},
  {"key":"roadworksMotorcyclistExtraRoom","category":"motorcyclists","titleIt":"Lavori stradali: lascia più spazio ai motociclisti","titleEn":"Roadworks: give motorcyclists extra room","status":"ready","questionIds":["SCHOOL.019"],"expectedCorrect":[0],"engineSceneId":"MT_ROADWORKS_MOTORCYCLIST_EXTRA_ROOM_V1","countryPackId":"MT-LPTV","visualStatus":"final-real-footage","required":["motorcycle","roadworks","potholes","extra-room"],"prohibited":["close-pass","fixed-line-riding","reused-approved-video","generic-unrelated-scene"]},

  /* 39.12.35 Replay145 — five new strict mappings. */
  {"key":"stopSignAlwaysFullStop","category":"road-signs-junctions","titleIt":"STOP: arresto completo anche quando la strada è libera","titleEn":"STOP: make a complete stop even when the road is clear","status":"ready","questionIds":["LPOINTS1.62"],"expectedCorrect":[2],"engineSceneId":"MT_STOP_SIGN_ALWAYS_FULL_STOP_V1","countryPackId":"MT-LPTV","visualStatus":"final-real-footage","required":["stop-sign","complete-stop","junction","road-safety"],"prohibited":["rolling-stop","ignore-stop","reused-approved-video","generic-unrelated-scene"]},
  {"key":"stopSignStopBeforeLine","category":"road-signs-junctions","titleIt":"STOP: fermati prima della linea di arresto","titleEn":"STOP: stop before the stop line","status":"ready","questionIds":["LPOINTS1.93"],"expectedCorrect":[2],"engineSceneId":"MT_STOP_SIGN_STOP_BEFORE_LINE_V1","countryPackId":"MT-LPTV","visualStatus":"final-real-footage","required":["stop-sign","stop-line","road-marking","junction"],"prohibited":["stop-after-line","middle-of-junction","reused-approved-video","generic-unrelated-scene"]},
  {"key":"signalBeforeTurnLaneChange","category":"signals","titleIt":"Segnala per tempo prima di svoltare o cambiare corsia","titleEn":"Signal in good time before turning or changing lane","status":"ready","questionIds":["LPOINTS1.99"],"expectedCorrect":[1],"engineSceneId":"MT_SIGNAL_BEFORE_TURN_LANE_CHANGE_V1","countryPackId":"MT-LPTV","visualStatus":"final-real-footage","required":["indicator","turning","lane-change","early-signal"],"prohibited":["no-signal","late-signal","reused-approved-video","generic-unrelated-scene"]},
  {"key":"hornWarnPresenceBlindBend","category":"horn","titleIt":"Clacson: avverti gli altri utenti della tua presenza","titleEn":"Horn: warn other road users of your presence","status":"ready","questionIds":["LPOINTS1.108"],"expectedCorrect":[1],"engineSceneId":"MT_HORN_WARN_PRESENCE_BLIND_BEND_V1","countryPackId":"MT-LPTV","visualStatus":"final-real-footage","required":["blind-bend","warning","presence","horn-purpose"],"prohibited":["anger","greeting","traffic-pressure","reused-approved-video","generic-unrelated-scene"]},
  {"key":"busStopTwelveMetresClear","category":"parking","titleIt":"Fermata autobus: lascia 12 metri liberi su ciascun lato","titleEn":"Bus stop: leave 12 metres clear on each side","status":"ready","questionIds":["LPOINTS1.183"],"expectedCorrect":[0],"engineSceneId":"MT_BUS_STOP_TWELVE_METRES_CLEAR_V1","countryPackId":"MT-LPTV","visualStatus":"final-real-footage","required":["bus-stop","parking-clearance","twelve-metres","public-transport"],"prohibited":["park-at-stop","block-bus","reused-approved-video","generic-unrelated-scene"]},


  /* 39.12.36 Replay150 — five new strict mappings. */
  {"key":"microsleepInvoluntaryEpisode","category":"fatigue","titleIt":"Microsleep: breve episodio involontario di sonno","titleEn":"Microsleep: a brief involuntary episode of sleep","status":"ready","questionIds":["LPOINTS1.110"],"expectedCorrect":[0],"engineSceneId":"MT_MICROSLEEP_INVOLUNTARY_EPISODE_V1","countryPackId":"MT-LPTV","visualStatus":"final-real-footage","required":["tired-driver","drowsiness","microsleep","loss-of-attention"],"prohibited":["planned-rest","hotel-sleep","reused-approved-video","generic-unrelated-scene"]},
  {"key":"tooTiredUseAlternativeTransport","category":"fatigue","titleIt":"Troppo stanco per guidare: usa un altro mezzo","titleEn":"Too tired to drive: use alternative transport","status":"ready","questionIds":["LPOINTS1.111"],"expectedCorrect":[0],"engineSceneId":"MT_TOO_TIRED_USE_ALTERNATIVE_TRANSPORT_V1","countryPackId":"MT-LPTV","visualStatus":"final-real-footage","required":["fatigue","do-not-drive","rest","alternative-transport"],"prohibited":["coffee-fix","open-window","drive-faster","reused-approved-video","generic-unrelated-scene"]},
  {"key":"avoidHeavilyFloodedRoad","category":"floods","titleIt":"Strada fortemente allagata: evita l'area","titleEn":"Heavily flooded road: avoid the area","status":"ready","questionIds":["LPOINTS1.123"],"expectedCorrect":[1],"engineSceneId":"MT_AVOID_HEAVILY_FLOODED_ROAD_V1","countryPackId":"MT-LPTV","visualStatus":"final-real-footage","required":["flooded-road","deep-water","heavy-rain","avoid-area"],"prohibited":["speed-through-water","follow-closely","reused-approved-video","generic-unrelated-scene"]},
  {"key":"driverResponsibleRoadworthyVehicle","category":"vehicle-roadworthiness","titleIt":"Idoneità del veicolo: responsabilità del conducente","titleEn":"Vehicle roadworthiness: the driver's responsibility","status":"ready","questionIds":["CARS12.11"],"expectedCorrect":[3],"engineSceneId":"MT_DRIVER_RESPONSIBLE_ROADWORTHY_VEHICLE_V1","countryPackId":"MT-LPTV","visualStatus":"final-real-footage","required":["vehicle-check","roadworthiness","driver-responsibility","maintenance"],"prohibited":["mechanic-only-responsible","vrt-only-responsible","reused-approved-video","generic-unrelated-scene"]},
  {"key":"reversingSeatbeltExemption","category":"seat-belts","titleIt":"Retromarcia: possibile esenzione temporanea dalla cintura","titleEn":"Reversing: temporary seat-belt exemption","status":"ready","questionIds":["SCHOOL.009"],"expectedCorrect":[0],"engineSceneId":"MT_REVERSING_SEATBELT_EXEMPTION_V1","countryPackId":"MT-LPTV","visualStatus":"final-real-footage","required":["reversing","backward-manoeuvre","observation","seat-belt-exemption"],"prohibited":["overtaking","tunnel-driving","junction-approach","reused-approved-video","generic-unrelated-scene"]},

  /* 39.12.37 Replay155 — Replay 151–155 strict mappings. */
  {"key":"laneChangeMirrorSignalShoulder","category":"lane-changing","titleIt":"Cambio corsia: specchi, indicatore e controllo sopra la spalla","titleEn":"Lane change: mirrors, signal and shoulder check","status":"ready","questionIds":["LPOINTS1.97"],"expectedCorrect":[2],"engineSceneId":"MT_LANE_CHANGE_MIRROR_SIGNAL_SHOULDER_V1","countryPackId":"MT-LPTV","visualStatus":"final-real-footage","required":["lane-changing","real-scene","question-specific"],"prohibited":["reused-approved-video","generic-unrelated-scene","remote-freeze"]},
  {"key":"shockReassureLoosenClothing","category":"first-aid","titleIt":"Shock: rassicura e allenta gli indumenti stretti","titleEn":"Shock: reassure and loosen tight clothing","status":"ready","questionIds":["SCHOOL.001"],"expectedCorrect":[0,1],"engineSceneId":"MT_SHOCK_REASSURE_LOOSEN_CLOTHING_V1","countryPackId":"MT-LPTV","visualStatus":"final-real-footage","required":["first-aid","real-scene","question-specific"],"prohibited":["reused-approved-video","generic-unrelated-scene","remote-freeze"]},
  {"key":"heavySteeringPuncturePowerAssist","category":"vehicle-faults","titleIt":"Sterzo improvvisamente pesante: pneumatico anteriore o servosterzo","titleEn":"Sudden heavy steering: front tyre or power assistance fault","status":"ready","questionIds":["SCHOOL.003"],"expectedCorrect":[0,1],"engineSceneId":"MT_HEAVY_STEERING_PUNCTURE_POWER_ASSIST_V1","countryPackId":"MT-LPTV","visualStatus":"final-real-footage","required":["vehicle-faults","real-scene","question-specific"],"prohibited":["reused-approved-video","generic-unrelated-scene","remote-freeze"]},
  {"key":"vehicleEnvironmentalDamage","category":"environment","titleIt":"Veicoli: inquinamento e danni ambientali","titleEn":"Vehicles: pollution and environmental damage","status":"ready","questionIds":["SCHOOL.006"],"expectedCorrect":[0,1,2],"engineSceneId":"MT_VEHICLE_ENVIRONMENTAL_DAMAGE_V1","countryPackId":"MT-LPTV","visualStatus":"final-real-footage","required":["environment","real-scene","question-specific"],"prohibited":["reused-approved-video","generic-unrelated-scene","remote-freeze"]},
  {"key":"neverOvertakeCyclistRoundabout","category":"cyclists","titleIt":"Rotatoria: non sorpassare mai un ciclista","titleEn":"Roundabout: never overtake a cyclist","status":"ready","questionIds":["SCHOOL.015"],"expectedCorrect":[0],"engineSceneId":"MT_NEVER_OVERTAKE_CYCLIST_ROUNDABOUT_V1","countryPackId":"MT-LPTV","visualStatus":"final-real-footage","required":["cyclists","real-scene","question-specific"],"prohibited":["reused-approved-video","generic-unrelated-scene","remote-freeze"]},

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
  },
  {"key":"rightTurnPositionEarly","category":"positioning","titleIt":"Svolta a destra: posizionati per tempo","titleEn":"Right turn: take position in good time","status":"ready","questionIds":["CARS2.37"],"expectedCorrect":[2],"engineSceneId":"MT_RIGHT_TURN_POSITION_EARLY_V1","countryPackId":"MT-LPTV","visualStatus":"final-real-footage","required":["positioning","real-scene","question-specific"],"prohibited":["reused-approved-video","generic-unrelated-scene","remote-freeze"]},
  {"key":"signalsWhenUseful","category":"signals","titleIt":"Segnali: quando devi usarli","titleEn":"Signals: when to use them","status":"ready","questionIds":["CARS2.41"],"expectedCorrect":[0,2],"engineSceneId":"MT_SIGNALS_WHEN_USEFUL_V1","countryPackId":"MT-LPTV","visualStatus":"final-real-footage","required":["signals","real-scene","question-specific"],"prohibited":["reused-approved-video","generic-unrelated-scene","remote-freeze"]},
  {"key":"signalBeforeParking","category":"parking","titleIt":"Parcheggio: segnala sempre per tempo","titleEn":"Parking: signal clearly in good time","status":"ready","questionIds":["LPOINTS1.134"],"expectedCorrect":[0],"engineSceneId":"MT_SIGNAL_BEFORE_PARKING_V1","countryPackId":"MT-LPTV","visualStatus":"final-real-footage","required":["parking","real-scene","question-specific"],"prohibited":["reused-approved-video","generic-unrelated-scene","remote-freeze"]},
  {"key":"hazardLightsAmber","category":"vehicle-lights","titleIt":"Luci di emergenza: colore ambra","titleEn":"Hazard warning lights: amber","status":"ready","questionIds":["LPOINTS1.176"],"expectedCorrect":[2],"engineSceneId":"MT_HAZARD_LIGHTS_AMBER_V1","countryPackId":"MT-LPTV","visualStatus":"final-real-footage","required":["vehicle-lights","real-scene","question-specific"],"prohibited":["reused-approved-video","generic-unrelated-scene","remote-freeze"]},
  {"key":"hornRestrictedHospital","category":"horn","titleIt":"Clacson: limitato vicino agli ospedali","titleEn":"Horn use: restricted near hospitals","status":"ready","questionIds":["LPOINTS1.184"],"expectedCorrect":[2],"engineSceneId":"MT_HORN_RESTRICTED_HOSPITAL_V1","countryPackId":"MT-LPTV","visualStatus":"final-real-footage","required":["horn","real-scene","question-specific"],"prohibited":["reused-approved-video","generic-unrelated-scene","remote-freeze"]},
  {"key":"neverOvertakeCyclistBeforeLeftTurn","category":"cyclists","titleIt":"Ciclista: non sorpassare prima di svoltare a sinistra","titleEn":"Cyclist: never overtake just before turning left","status":"ready","questionIds":["CARS6.27"],"expectedCorrect":[0],"engineSceneId":"MT_NEVER_OVERTAKE_CYCLIST_BEFORE_LEFT_TURN_V1","countryPackId":"MT-LPTV","visualStatus":"final-real-footage","required":["cyclists","real-scene","question-specific"],"prohibited":["reused-approved-video","generic-unrelated-scene","remote-freeze"]},
  {"key":"holdBackCyclistBeforeJunction","category":"cyclists","titleIt":"Svolta a sinistra: lascia passare prima il ciclista","titleEn":"Left turn: hold back until the cyclist passes the junction","status":"ready","questionIds":["CARS6.28"],"expectedCorrect":[2],"engineSceneId":"MT_HOLD_BACK_CYCLIST_BEFORE_JUNCTION_V1","countryPackId":"MT-LPTV","visualStatus":"final-real-footage","required":["cyclists","real-scene","question-specific"],"prohibited":["reused-approved-video","generic-unrelated-scene","remote-freeze"]},
  {"key":"cyclistRightSignalAtRoundabout","category":"cyclists","titleIt":"Rotatoria: dai molto spazio al ciclista che segnala","titleEn":"Roundabout: give a signalling cyclist plenty of room","status":"ready","questionIds":["CARS6.29"],"expectedCorrect":[3],"engineSceneId":"MT_CYCLIST_RIGHT_SIGNAL_ROUNDABOUT_V1","countryPackId":"MT-LPTV","visualStatus":"final-real-footage","required":["cyclists","real-scene","question-specific"],"prohibited":["reused-approved-video","generic-unrelated-scene","remote-freeze"]},
  {"key":"oncomingVehicleSingleTrackRoad","category":"country-roads","titleIt":"Strada a corsia unica: incontra un veicolo in arrivo","titleEn":"Single-track road: meeting an oncoming vehicle","status":"ready","questionIds":["CARS8.36"],"expectedCorrect":[2],"engineSceneId":"MT_ONCOMING_VEHICLE_SINGLE_TRACK_ROAD_V1","countryPackId":"MT-LPTV","visualStatus":"final-real-footage","required":["country-roads","real-scene","question-specific"],"prohibited":["reused-approved-video","generic-unrelated-scene","remote-freeze"]},
  {"key":"stopGiveWayNoRoadMarkings","category":"junctions","titleIt":"STOP o Dare precedenza senza linea: scegli il punto più sicuro","titleEn":"STOP or GIVE WAY without markings: use the safest clear-view point","status":"ready","questionIds":["LPOINTS1.79"],"expectedCorrect":[1],"engineSceneId":"MT_STOP_GIVE_WAY_NO_MARKINGS_V1","countryPackId":"MT-LPTV","visualStatus":"final-real-footage","required":["junctions","real-scene","question-specific"],"prohibited":["reused-approved-video","generic-unrelated-scene","remote-freeze"]},
  {"key":"singleTrackPassingPlaces170","category":"country-roads","titleIt":"Strada a corsia unica: usa correttamente le piazzole","titleEn":"Single-track road: use passing places correctly","status":"ready","questionIds":["CARS10.24"],"expectedCorrect":[3,4],"engineSceneId":"MT_SINGLE_TRACK_PASSING_PLACES_170_V1","countryPackId":"MT-LPTV","visualStatus":"final-real-footage","required":["country-roads","real-scene","question-specific"],"prohibited":["reused-approved-video","generic-unrelated-scene","remote-freeze"]},
  {"key":"footpathPropertyAccess170","category":"rules-of-road","titleIt":"Marciapiede: attraversalo solo per accesso legale a una proprietà","titleEn":"Footpath: cross only for lawful property access","status":"ready","questionIds":["CARS10.1"],"expectedCorrect":[3],"engineSceneId":"MT_FOOTPATH_PROPERTY_ACCESS_170_V1","countryPackId":"MT-LPTV","visualStatus":"final-real-footage","required":["rules-of-road","real-scene","question-specific"],"prohibited":["reused-approved-video","generic-unrelated-scene","remote-freeze"]},
  {"key":"correctiveGlassesNoDrive170","category":"eyesight","titleIt":"Occhiali correttivi: non guidare senza","titleEn":"Corrective glasses: do not drive without them","status":"ready","questionIds":["CARS5.4"],"expectedCorrect":[3],"engineSceneId":"MT_CORRECTIVE_GLASSES_NO_DRIVE_170_V1","countryPackId":"MT-LPTV","visualStatus":"final-real-footage","required":["eyesight","real-scene","question-specific"],"prohibited":["reused-approved-video","generic-unrelated-scene","remote-freeze"]},
  {"key":"absLooseWetSurface170","category":"braking-abs","titleIt":"ABS: fondo sconnesso o bagnato riduce l’efficacia","titleEn":"ABS: loose and wet surfaces reduce effectiveness","status":"ready","questionIds":["CARS4.4"],"expectedCorrect":[1,4],"engineSceneId":"MT_ABS_LOOSE_WET_SURFACE_170_V1","countryPackId":"MT-LPTV","visualStatus":"final-real-footage","required":["braking-abs","real-scene","question-specific"],"prohibited":["reused-approved-video","generic-unrelated-scene","remote-freeze"]},
  {"key":"indicatorArmSignalSun170","category":"signals","titleIt":"Sole forte: rafforza l’indicatore con un segnale del braccio","titleEn":"Bright sunlight: reinforce the indicator with an arm signal","status":"ready","questionIds":["CARS4.22"],"expectedCorrect":[1],"engineSceneId":"MT_INDICATOR_ARM_SIGNAL_SUN_170_V1","countryPackId":"MT-LPTV","visualStatus":"final-real-footage","required":["signals","real-scene","question-specific"],"prohibited":["reused-approved-video","generic-unrelated-scene","remote-freeze"]}
,
  {"key":"motorcycleHelmetEssential210","category":"first-aid","titleIt":"Incidente moto: casco solo se indispensabile","titleEn":"Motorcycle accident: remove helmet only if essential","status":"ready","questionIds":["CARS13.4"],"expectedCorrect":[0],"engineSceneId":"MT_MOTORCYCLE_HELMET_ESSENTIAL_210_V1","countryPackId":"MT-LPTV","visualStatus":"final-real-footage","required":["motorcycle-accident","injured-rider","helmet","first-aid","question-specific"],"prohibited":["reused-approved-video","generic-unrelated-scene","remote-freeze"]},
  {"key":"maximum30AfterSign210","category":"speed-limits","titleIt":"Limite 30: non superarlo dopo il segnale","titleEn":"30 kph limit: do not exceed it after the sign","status":"ready","questionIds":["CARS10.5"],"expectedCorrect":[3],"engineSceneId":"MT_MAXIMUM_30_AFTER_SIGN_210_V1","countryPackId":"MT-LPTV","visualStatus":"final-real-footage","required":["speed-limit-30","maximum-speed","road-sign","question-specific"],"prohibited":["reused-approved-video","generic-unrelated-scene","remote-freeze"]},
  {"key":"end20Zone210","category":"speed-limits","titleIt":"Fine zona 20 km/h","titleEn":"End of 20 kph zone","status":"ready","questionIds":["CARS11.7"],"expectedCorrect":[3],"engineSceneId":"MT_END_20_ZONE_210_V1","countryPackId":"MT-LPTV","visualStatus":"final-real-footage","required":["end-zone","20-kph","road-sign","question-specific"],"prohibited":["reused-approved-video","generic-unrelated-scene","remote-freeze"]},
  {"key":"noMotorVehicles210","category":"road-signs","titleIt":"Segnale: divieto ai veicoli a motore","titleEn":"Sign: no motor vehicles","status":"ready","questionIds":["CARS11.8"],"expectedCorrect":[0],"engineSceneId":"MT_NO_MOTOR_VEHICLES_210_V1","countryPackId":"MT-LPTV","visualStatus":"final-real-footage","required":["no-motor-vehicles","car","motorcycle","prohibition-sign","question-specific"],"prohibited":["reused-approved-video","generic-unrelated-scene","remote-freeze"]},
  {"key":"oneWayOvertakeEitherSide210","category":"overtaking","titleIt":"Senso unico: sorpasso possibile su entrambi i lati","titleEn":"One-way street: overtaking may be on either side","status":"ready","questionIds":["CARS10.22"],"expectedCorrect":[3],"engineSceneId":"MT_ONE_WAY_OVERTAKE_EITHER_SIDE_210_V1","countryPackId":"MT-LPTV","visualStatus":"final-real-footage","required":["one-way-street","overtaking","left-or-right","question-specific"],"prohibited":["reused-approved-video","generic-unrelated-scene","remote-freeze"]},
  {"key":"dangerousVehicleRescue215","category":"accidents-first-aid","titleIt":"Veicolo pericoloso: sposta il ferito solo in pericolo immediato","titleEn":"Dangerous vehicle: move casualty only for immediate danger","status":"ready","questionIds":["SCHOOL.002"],"expectedCorrect":[0],"engineSceneId":"MT_DANGEROUS_VEHICLE_RESCUE_215_V1","countryPackId":"MT-LPTV","visualStatus":"final-real-footage","required":["accident","dangerous-vehicle","casualty","emergency-rescue","question-specific"],"prohibited":["reused-approved-video","generic-unrelated-scene","remote-freeze"]},
  {"key":"secureFuelFillerCaps215","category":"fuel-safety","titleIt":"Carburante: chiudi e fissa bene tutti i tappi","titleEn":"Fuel safety: close and secure all filler caps","status":"ready","questionIds":["SCHOOL.005"],"expectedCorrect":[0],"engineSceneId":"MT_SECURE_FUEL_FILLER_CAPS_215_V1","countryPackId":"MT-LPTV","visualStatus":"final-real-footage","required":["fuel-safety","filler-cap","secure-cap","spill-prevention","question-specific"],"prohibited":["reused-approved-video","generic-unrelated-scene","remote-freeze"]},
  {"key":"vulnerablePassengerAssist215","category":"customer-care","titleIt":"Passeggero vulnerabile: guida dolce e assistenza adeguata","titleEn":"Vulnerable passenger: smooth driving and appropriate assistance","status":"ready","questionIds":["CUSTOMER.003"],"expectedCorrect":[0,1],"engineSceneId":"MT_VULNERABLE_PASSENGER_ASSIST_215_V1","countryPackId":"MT-LPTV","visualStatus":"final-real-footage","required":["vulnerable-passenger","smooth-driving","assistance","dignity","question-specific"],"prohibited":["reused-approved-video","generic-unrelated-scene","remote-freeze"]},
  {"key":"boxJunctionExitClear215","category":"junctions","titleIt":"Box junction: entra solo con uscita libera","titleEn":"Box junction: enter only when your exit is clear","status":"ready","questionIds":["LPOINTS1.103"],"expectedCorrect":[1],"engineSceneId":"MT_BOX_JUNCTION_EXIT_CLEAR_215_V1","countryPackId":"MT-LPTV","visualStatus":"final-real-footage","required":["box-junction","yellow-grid","clear-exit","junction","question-specific"],"prohibited":["reused-approved-video","generic-unrelated-scene","remote-freeze"]},
  {"key":"cornerParkingFiveMetres215","category":"parking","titleIt":"Parcheggio vicino a un angolo: lascia 5 metri","titleEn":"Parking near a corner: leave five metres clear","status":"ready","questionIds":["LPOINTS1.182"],"expectedCorrect":[0],"engineSceneId":"MT_CORNER_PARKING_FIVE_METRES_215_V1","countryPackId":"MT-LPTV","visualStatus":"final-real-footage","required":["parking","street-corner","junction","five-metres","question-specific"],"prohibited":["reused-approved-video","generic-unrelated-scene","remote-freeze"]},
  {"key":"fareRefusalStayCalm220","category":"customer-care","titleIt":"Pagamento rifiutato: resta calmo e segui la procedura","titleEn":"Fare refused: stay calm and follow procedure","status":"ready","questionIds":["CUSTOMER.001"],"expectedCorrect":[0],"engineSceneId":"MT_FARE_REFUSAL_STAY_CALM_220_V1","countryPackId":"MT-LPTV","visualStatus":"final-real-footage","required":["fare-payment","passenger","dispute","stay-calm","procedure","question-specific"],"prohibited":["reused-approved-video","generic-unrelated-scene","remote-freeze"]},
  {"key":"passengerComfortSmoothDrive220","category":"customer-care","titleIt":"Comfort passeggeri: guida dolce, anticipa e accosta in sicurezza","titleEn":"Passenger comfort: drive smoothly, plan ahead and stop safely","status":"ready","questionIds":["CUSTOMER.005"],"expectedCorrect":[0,1,2],"engineSceneId":"MT_PASSENGER_COMFORT_SMOOTH_DRIVE_220_V1","countryPackId":"MT-LPTV","visualStatus":"final-real-footage","required":["passenger-comfort","smooth-braking","anticipation","safe-kerb-stop","question-specific"],"prohibited":["reused-approved-video","generic-unrelated-scene","remote-freeze"]},
  {"key":"tJunctionIndicatorWaitTurn220","category":"junctions","titleIt":"Incrocio a T: non fidarti dell'indicatore, aspetta la svolta","titleEn":"T-junction: do not rely on the indicator, wait for the turn","status":"ready","questionIds":["CARS11.70"],"expectedCorrect":[1],"engineSceneId":"MT_T_JUNCTION_INDICATOR_WAIT_TURN_220_V1","countryPackId":"MT-LPTV","visualStatus":"final-real-footage","required":["t-junction","left-indicator","vehicle-from-right","wait-for-turn","question-specific"],"prohibited":["reused-approved-video","generic-unrelated-scene","remote-freeze"]},
  {"key":"driverPreventsOverload220","category":"vehicle-safety","titleIt":"Sovraccarico: la responsabilità è del conducente","titleEn":"Overloading: the driver is responsible","status":"ready","questionIds":["LPOINTS1.98"],"expectedCorrect":[1],"engineSceneId":"MT_DRIVER_PREVENTS_OVERLOAD_220_V1","countryPackId":"MT-LPTV","visualStatus":"final-real-footage","required":["vehicle-load","overloading","driver-responsibility","cargo","question-specific"],"prohibited":["reused-approved-video","generic-unrelated-scene","remote-freeze"]},
  {"key":"longVehicleRoundaboutSpace220","category":"large-vehicles","titleIt":"Veicolo lungo in rotatoria: dagli molto spazio","titleEn":"Long vehicle on a roundabout: give it plenty of room","status":"ready","questionIds":["LPOINTS1.172"],"expectedCorrect":[0],"engineSceneId":"MT_LONG_VEHICLE_ROUNDABOUT_SPACE_220_V1","countryPackId":"MT-LPTV","visualStatus":"final-real-footage","required":["long-vehicle","roundabout","extra-space","multiple-lanes","question-specific"],"prohibited":["reused-approved-video","generic-unrelated-scene","remote-freeze"]},
  {"key":"disabledPassengerRespectChoice225","category":"customer-care","titleIt":"Passeggero con disabilità: rispetta la sua scelta","titleEn":"Disabled passenger: respect their choice","status":"ready","questionIds":["CUSTOMER.004"],"expectedCorrect":[0],"engineSceneId":"MT_DISABLED_PASSENGER_RESPECT_CHOICE_225_V1","countryPackId":"MT-LPTV","visualStatus":"final-real-footage","required":["disabled-passenger","wheelchair","independence","respect-choice","remain-available","question-specific"],"prohibited":["reused-approved-video","generic-unrelated-scene","remote-freeze"]},
  {"key":"platformFacialRecognition225","category":"platform-compliance","titleIt":"Piattaforme: verifica dell’identità con riconoscimento facciale","titleEn":"Platforms: identity verification with facial recognition","status":"ready","questionIds":["LPTV2026.011"],"expectedCorrect":[1],"engineSceneId":"MT_PLATFORM_FACIAL_RECOGNITION_225_V1","countryPackId":"MT-LPTV","visualStatus":"final-real-footage","required":["platform","driver-identity","facial-recognition","authorised-driver","question-specific"],"prohibited":["reused-approved-video","generic-unrelated-scene","remote-freeze"]},
  {"key":"driverFacialVerification225","category":"platform-compliance","titleIt":"Conducente: completa la verifica facciale quando richiesta","titleEn":"Driver: complete facial verification when requested","status":"ready","questionIds":["LPTV2026.030"],"expectedCorrect":[0],"engineSceneId":"MT_DRIVER_FACIAL_VERIFICATION_225_V1","countryPackId":"MT-LPTV","visualStatus":"final-real-footage","required":["driver","platform-request","facial-verification","identity-check","question-specific"],"prohibited":["reused-approved-video","generic-unrelated-scene","remote-freeze"]},
  {"key":"authorisedVehicleGaraging225","category":"garaging","titleIt":"Veicolo autorizzato non in uso: garaging approvato o fuori strada","titleEn":"Authorised vehicle not in use: approved garaging or off-street","status":"ready","questionIds":["LPTV2026.025"],"expectedCorrect":[1],"engineSceneId":"MT_AUTHORISED_VEHICLE_GARAGING_225_V1","countryPackId":"MT-LPTV","visualStatus":"final-real-footage","required":["authorised-vehicle","garaging","off-street","parking","question-specific"],"prohibited":["reused-approved-video","generic-unrelated-scene","remote-freeze"]},
  {"key":"approvedGaragingCapacity225","category":"garaging","titleIt":"Garaging approvato: capacità sufficiente per i veicoli autorizzati","titleEn":"Approved garaging: sufficient capacity for authorised vehicles","status":"ready","questionIds":["LPTV2026.026"],"expectedCorrect":[0],"engineSceneId":"MT_APPROVED_GARAGING_CAPACITY_225_V1","countryPackId":"MT-LPTV","visualStatus":"final-real-footage","required":["approved-garaging","capacity","authorised-vehicles","vehicle-storage","question-specific"],"prohibited":["reused-approved-video","generic-unrelated-scene","remote-freeze"]}
 ];

 entries.forEach(entry=>global.SceneCatalog.register(entry));
})(window);
