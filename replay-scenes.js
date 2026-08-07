
(function(global){
 'use strict';


 global.ReplayEngine.registerScene({
  id:'MT_UTURN_SHOULDER_CHECK_V1',category:'alertness',country:'MT',licenceType:'LPTV',drivingSide:'left',countryPackId:'MT-LPTV',
  sceneKey:'uTurnShoulderCheck',visualStatus:'real-footage-with-instructional-overlay',replayTemplate:'standard-video',
  title:'Final shoulder check before a U-turn',accessibilityLabel:'Vehicle making a U-turn while the replay teaches the final blind-spot shoulder check',playbackRate:0.85,
  media:{video:'https://www.pexels.com/download/video/3525672/',videoSources:['https://www.pexels.com/download/video/3525672/'],poster:'https://images.pexels.com/videos/3525672/free-video-3525672.jpg?auto=compress&dpr=1&h=750&w=1260',credit:'Pexels · Matthias Groeneveld',sourcePage:'https://www.pexels.com/video/yellow-taxi-cab-making-a-u-turn-3525672/'},
  timeline:[
   {at:.3,end:2,event:'observe',textIt:'Osserva l’auto che si prepara all’inversione a U',textEn:'Watch the car preparing for the U-turn'},
   {at:2.1,end:4,event:'hazard',textIt:'Prima di sterzare resta un’area che gli specchi non mostrano',textEn:'Before turning, an area remains hidden from the mirrors'},
   {at:4.1,end:6,event:'explain',textIt:'Fai un ultimo controllo sopra la spalla',textEn:'Make one final check over your shoulder'},
   {at:6.1,end:9,event:'correct',textIt:'Specchi • segnale • spalla • poi manovra',textEn:'Mirrors • signal • shoulder • then manoeuvre'}
  ],
  ui:{hotspot:{left:48,top:52,radiusX:38,radiusY:32,instructionIt:'TOCCA L’AUTO PRIMA DELLA MANOVRA',instructionEn:'TAP THE CAR BEFORE THE MANOEUVRE',ariaIt:'Tocca l’auto che sta per fare inversione',ariaEn:'Tap the car about to make a U-turn'},phases:[{},
   {titleIt:'PRIMA DI GIRARE: ANGOLO CIECO',titleEn:'BEFORE TURNING: BLIND SPOT',bodyIt:'Gli specchi non coprono tutto. Un ciclista, moto o veicolo può trovarsi accanto a te.',bodyEn:'Mirrors do not cover everything. A cyclist, motorcycle or vehicle may be beside you.'},
   {titleIt:'CONTROLLO FINALE SOPRA LA SPALLA',titleEn:'FINAL SHOULDER CHECK',bodyIt:'Subito prima di iniziare l’inversione, gira rapidamente la testa verso il lato della manovra e controlla l’angolo cieco.',bodyEn:'Immediately before the U-turn, quickly turn your head toward the manoeuvre and check the blind spot.'},
   {titleIt:'CONTROLLA • POI ESEGUI LA U-TURN',titleEn:'CHECK • THEN MAKE THE U-TURN',bodyIt:'La risposta corretta è: guardare sopra la spalla per una conferma finale.',bodyEn:'The correct answer is: look over your shoulder for final confirmation.'}
  ],phaseOptions:[{startRatio:0,autoplay:true,endRatio:.4},{startRatio:.25,freeze:true},{startRatio:.25,freeze:true},{startRatio:.4,autoplay:true,endRatio:.95}]},
  coach:{missIt:'Concentrati sul momento immediatamente prima della U-turn: cosa può sfuggire agli specchi?',missEn:'Focus on the instant before the U-turn: what can the mirrors miss?',hitIt:'Esatto: prima della manovra serve l’ultimo controllo dell’angolo cieco.',hitEn:'Correct: before the manoeuvre you need one final blind-spot check.'},
  learning:{correctIt:'Prima di effettuare un’inversione a U, guarda sopra la spalla per la conferma finale che l’angolo cieco sia libero.',correctEn:'Before making a U-turn, look over your shoulder for final confirmation that the blind spot is clear.'}
 });



 global.ReplayEngine.registerScene({
  id:'MT_PHONE_DISTRACTION_DRIVING_V1',
  category:'alertness',country:'MT',licenceType:'LPTV',drivingSide:'left',countryPackId:'MT-LPTV',
  sceneKey:'phoneDistractionDriving',visualStatus:'final-real-footage',replayTemplate:'standard-video',
  title:'Mobile phone distraction while driving',
  accessibilityLabel:'Driver actively driving in rainy conditions while talking on a handheld mobile phone',
  playbackRate:0.9,
  media:{
   video:'https://videos.pexels.com/video-files/5290305/5290305-hd_1920_1080_30fps.mp4',
   videoSources:["https://videos.pexels.com/video-files/5290305/5290305-hd_1920_1080_30fps.mp4","https://www.pexels.com/download/video/5290305/"],
   poster:'https://images.pexels.com/videos/5290305/free-video-5290305.jpg?auto=compress&dpr=1&h=750&w=1260',
   credit:'Pexels · faizan amjed',
   sourcePage:'https://www.pexels.com/video/man-answering-a-call-while-driving-5290305/'
  },
  timeline:[
   {at:.5,end:2.0,event:'observe',textIt:'Osserva dove guarda il conducente',textEn:'Observe where the driver is looking'},
   {at:2.2,end:4.0,event:'phone',textIt:'Il telefono sposta l’attenzione dalla strada',textEn:'The phone takes attention away from the road'},
   {at:4.2,end:6.0,event:'hazard',textIt:'Basta un attimo per perdere un pericolo davanti',textEn:'A moment is enough to miss a hazard ahead'},
   {at:6.2,end:8.8,event:'correct',textIt:'Durante la guida l’attenzione deve restare sulla strada',textEn:'While driving, attention must remain on the road'}
  ],
  ui:{
   hotspot:{left:55,top:49,radiusX:35,radiusY:36,instructionIt:'TOCCA IL TELEFONO / CONDUCENTE',instructionEn:'TAP PHONE / DRIVER',ariaIt:'Tocca il conducente che usa il telefono',ariaEn:'Tap the driver using the phone'},
   phases:[
    {},
    {titleIt:'ATTENZIONE SPOSTATA DALLA STRADA',titleEn:'ATTENTION TAKEN OFF THE ROAD',bodyIt:'Il conducente sta guidando ma una parte della sua attenzione è assorbita dalla telefonata.',bodyEn:'The driver is moving, but part of his attention is taken by the phone call.'},
    {titleIt:'ECCO COSA PUOI NON VEDERE IN TEMPO',titleEn:'THIS IS WHAT YOU MAY MISS',bodyIt:'Mentre sei distratto dal telefono, davanti possono esserci pedoni o veicoli che richiedono una reazione immediata.',bodyEn:'While distracted by the phone, pedestrians or vehicles ahead may require an immediate reaction.'},
    {titleIt:'TELEFONO VIA • ATTENZIONE ALLA STRADA',titleEn:'EYES AND ATTENTION ON THE ROAD',bodyIt:'La risposta corretta è: il telefono può distrarre la tua attenzione dalla strada davanti.',bodyEn:'The correct answer is: the phone may distract your attention from the road ahead.'}
   ],
   phaseMedia:[
    null,
    null,
    {
     video:'https://www.pexels.com/download/video/2863232/',
     videoSources:["https://www.pexels.com/download/video/2863232/","https://videos.pexels.com/video-files/2863232/2863232-hd_1920_1080_25fps.mp4"],
     poster:'https://images.pexels.com/videos/2863232/free-video-2863232.jpg?auto=compress&dpr=1&h=750&w=1260',
     credit:'Pexels · George Morina'
    },
    {
     video:'https://www.pexels.com/download/video/2863232/',
     videoSources:["https://www.pexels.com/download/video/2863232/","https://videos.pexels.com/video-files/2863232/2863232-hd_1920_1080_25fps.mp4"],
     poster:'https://images.pexels.com/videos/2863232/free-video-2863232.jpg?auto=compress&dpr=1&h=750&w=1260',
     credit:'Pexels · George Morina'
    }
   ],
   phaseOptions:[{startRatio:0,autoplay:true,endRatio:.45},{startRatio:.27,freeze:true},{startRatio:.27,freeze:true},{startRatio:.45,autoplay:false,endRatio:.95}]
  },
  coach:{
   missIt:'Osserva insieme telefono, volante e guida in corso: il conducente sta facendo due cose contemporaneamente.',missEn:'Observe the phone, steering wheel and moving drive together: the driver is doing two things at once.',
   hitIt:'Esatto: il problema è la distrazione dalla strada davanti.',hitEn:'Correct: the problem is distraction from the road ahead.'
  },
  learning:{
   correctIt:'Non usare il telefono mentre guidi perché può distrarre la tua attenzione dalla strada davanti.',
   correctEn:'Do not use a mobile phone while driving because it may distract your attention from the road ahead.'
  }
 });


 global.ReplayEngine.registerScene({
  id:'MT_PHONE_STOP_SAFE_V1',
  category:'alertness',country:'MT',licenceType:'LPTV',drivingSide:'left',countryPackId:'MT-LPTV',
  sceneKey:'phoneStopSafe',visualStatus:'final-real-footage',replayTemplate:'standard-video',
  title:'Stop safely before using a mobile phone',
  accessibilityLabel:'Driver seated in a parked stationary car using a mobile phone',playbackRate:0.9,
  media:{video:'https://www.pexels.com/download/video/3048166/',videoSources:["https://www.pexels.com/download/video/3048166/","https://videos.pexels.com/video-files/3048166/3048166-hd_1920_1080_25fps.mp4","https://www.pexels.com/download/video/4281368/"],poster:'https://images.pexels.com/videos/3048166/free-video-3048166.jpg?auto=compress&dpr=1&h=750&w=1260',credit:'Pexels · fauxels'},
  timeline:[
   {at:.5,end:1.8,event:'phone',textIt:'Il telefono richiede attenzione',textEn:'The phone demands your attention'},
   {at:2.0,end:3.8,event:'stop',textIt:'Prima fermati in un luogo adatto e sicuro',textEn:'First stop in a proper and safe place'},
   {at:4.0,end:5.8,event:'stationary',textIt:'Usa il telefono solo a veicolo fermo',textEn:'Use the phone only when the vehicle is stationary'},
   {at:6.0,end:8.5,event:'resume',textIt:'Riparti solo dopo aver terminato',textEn:'Resume driving only after finishing'}
  ],
  ui:{
   hotspot:{left:56,top:52,radiusX:34,radiusY:35,instructionIt:'TOCCA TELEFONO E AUTO FERMA',instructionEn:'TAP PHONE AND PARKED CAR',ariaIt:'Tocca il telefono usato nell’auto ferma',ariaEn:'Tap the phone being used in the stationary car'},
   phases:[{},
    {titleIt:'NON RISPONDERE MENTRE GUIDI',titleEn:'DO NOT ANSWER WHILE DRIVING',bodyIt:'Il telefono toglie attenzione alla strada.',bodyEn:'The phone takes attention away from the road.'},
    {titleIt:'PRIMA FERMATI IN SICUREZZA',titleEn:'STOP SAFELY FIRST',bodyIt:'La risposta corretta è fermarti in un luogo adatto e sicuro prima di rispondere.',bodyEn:'The correct answer is to stop in a proper and safe place before answering.'},
    {titleIt:'AUTO FERMA • POI TELEFONO',titleEn:'VEHICLE STOPPED • THEN PHONE',bodyIt:'Usa il telefono solo dopo esserti fermato.',bodyEn:'Use the phone only after stopping.'}],
   phaseOptions:[{startRatio:0,autoplay:true,endRatio:.45},{startRatio:.25,freeze:true},{startRatio:.25,freeze:true},{startRatio:.45,autoplay:false,endRatio:.95}]
  },
  coach:{missIt:'Osserva il dettaglio decisivo: l’auto è ferma.',missEn:'Notice the key detail: the car is stationary.',hitIt:'Esatto: prima ti fermi in sicurezza, poi rispondi.',hitEn:'Correct: stop safely first, then answer.'},
  learning:{correctIt:'Fermati in un luogo adatto e sicuro prima di rispondere o fare una chiamata.',correctEn:'Stop in a proper and safe place before answering or making a call.'}
 });
 if(!global.ReplayEngine) throw new Error('ReplayEngine must load before replay-scenes.js');

 global.ReplayEngine.registerScene({
  id:'MT_OVERTAKE_LIMITED_VIEW_V1',
  category:'overtaking',
  country:'MT',
  licenceType:'LPTV',
  drivingSide:'left',
  countryPackId:'MT-LPTV',
  sceneKey:'overtakeLimitedView',
  visualStatus:'final-real-footage',
  replayTemplate:'standard-video',
  title:'Overtaking with limited visibility',
  accessibilityLabel:'Driver point of view on a hilly curving road where forward visibility becomes restricted',
  playbackRate:0.82,
  media:{
   video:'https://videos.pexels.com/video-files/19201236/19201236-hd_1920_1080_30fps.mp4',
   videoSources:["https://videos.pexels.com/video-files/19201236/19201236-hd_1920_1080_30fps.mp4", "https://videos.pexels.com/video-files/19201236/19201236-hd_1920_1080_25fps.mp4", "https://www.pexels.com/download/video/19201236/", "https://videos.pexels.com/video-files/11791710/11791710-hd_1920_1080_25fps.mp4"],
   poster:'https://images.pexels.com/videos/19201236/pexels-photo-19201236.jpeg?auto=compress&dpr=1&h=750&w=1260',
   credit:'Pexels · Mehmet Eray',
   sourcePage:'https://www.pexels.com/video/a-view-from-the-driver-s-seat-of-a-car-on-a-road-19201236/'
  },
  timeline:[
   {at:0.7,end:2.2,event:'slow',textIt:'Rallenta progressivamente',textEn:'Slow down smoothly'},
   {at:2.8,end:4.5,event:'distance',textIt:'Mantieni la distanza',textEn:'Keep your distance'},
   {at:5.1,end:7.2,event:'lane',textIt:'Resta nella tua corsia',textEn:'Stay in your lane'},
   {at:7.8,end:9.0,event:'wait',textIt:'Attendi visuale completa',textEn:'Wait for a complete view'}
  ],
  ui:{
   hotspot:{left:52,top:46,radiusX:30,radiusY:28,instructionIt:'TOCCA DOVE LA VISUALE SI RIDUCE',instructionEn:'TAP WHERE VISIBILITY REDUCES',ariaIt:'Tocca il punto in cui la visuale davanti diventa limitata',ariaEn:'Tap where the forward view becomes limited'},
   phases:[
    {},
    {titleIt:'NON SORPASSARE CON VISUALE LIMITATA',titleEn:'DO NOT OVERTAKE WITH LIMITED VIEW',bodyIt:'Un avvallamento può nascondere un veicolo che arriva in senso opposto.',bodyEn:'A dip can hide an oncoming vehicle.'},
    {titleIt:'ATTENDI LA VISUALE COMPLETA',titleEn:'WAIT FOR A COMPLETE VIEW',bodyIt:'Resta dietro e sorpassa solo quando puoi vedere chiaramente la corsia opposta.',bodyEn:'Stay behind and overtake only when the opposing lane is clearly visible.'},
    {titleIt:'RESTA DIETRO • CONTROLLA • SORPASSA SOLO SE SICURO',titleEn:'STAY BACK • CHECK • OVERTAKE ONLY IF SAFE',bodyIt:'La risposta corretta è evitare il sorpasso avvicinandosi a un avvallamento.',bodyEn:'The correct answer is to avoid overtaking when approaching a dip.'}
   ],
   phaseOptions:[{startRatio:0,autoplay:true,endRatio:.44},{startRatio:.30,freeze:true},{startRatio:.30,freeze:true},{startRatio:.44,autoplay:false,endRatio:.94}]
  },
  coach:{
   missIt:'Guarda dove la strada scende e la visuale del traffico in arrivo si interrompe.',missEn:'Look where the road dips and your view of oncoming traffic is interrupted.',
   hitIt:'Hai individuato la visuale limitata: qui non devi iniziare il sorpasso.',hitEn:'You identified the limited view: do not begin overtaking here.'
  },
  learning:{
   correctIt:'Resta dietro al veicolo e sorpassa soltanto quando la corsia opposta è completamente visibile.',
   correctEn:'Stay behind the vehicle and overtake only when the opposing lane is completely visible.'
  }
 });

 global.ReplayEngine.registerScene({
  id:'MT_PEDESTRIAN_WAVE_ACROSS_V1',
  category:'pedestrian',
  country:'MT',
  licenceType:'LPTV',
  drivingSide:'left',
  countryPackId:'MT-LPTV',
  sceneKey:'pedestrianWaveAcross',
  visualStatus:'final-real-footage',
  replayTemplate:'standard-video',
  title:'Never wave a pedestrian across',
  accessibilityLabel:'Pedestrians crossing while multiple vehicles move through the road environment',
  playbackRate:0.9,
  media:{
   video:'https://www.pexels.com/download/video/3121459/',
   videoSources:["https://www.pexels.com/download/video/3121459/", "https://videos.pexels.com/video-files/3121459/3121459-hd_1920_1080_25fps.mp4", "https://www.pexels.com/download/video/12769743/"],
   poster:'https://images.pexels.com/videos/3121459/free-video-3121459.jpg?auto=compress&dpr=1&h=750&w=1260',
   credit:'Pexels',
   sourcePage:'https://www.pexels.com/video/pedestrians-crossing-a-busy-road-with-moving-vehicles-3121459/'
  },
  timeline:[
   {at:0.8,end:2.2,event:'observe',textIt:'Osserva pedone e traffico circostante',textEn:'Observe the pedestrian and surrounding traffic'},
   {at:2.5,end:4.2,event:'hazard',textIt:'Non dare tu il via con un gesto',textEn:'Do not wave the pedestrian across'},
   {at:4.5,end:6.4,event:'other-traffic',textIt:'Controlla il traffico che può arrivare da altre direzioni',textEn:'Check traffic that may approach from other directions'},
   {at:6.7,end:9.0,event:'safe-action',textIt:'Rallenta e lascia decidere al pedone quando attraversare',textEn:'Slow down and let the pedestrian decide when to cross'}
  ],
  ui:{
   hotspot:{left:50,top:54,radiusX:40,radiusY:34,instructionIt:'TOCCA PEDONE E TRAFFICO',instructionEn:'TAP PEDESTRIAN AND TRAFFIC',ariaIt:'Tocca la zona del pedone e del traffico',ariaEn:'Tap the pedestrian and traffic area'},
   phases:[
    {},
    {titleIt:'NON DARE TU IL VIA',titleEn:'DO NOT WAVE THEM ACROSS',bodyIt:'Il pedone potrebbe interpretare il tuo gesto come se tutta la strada fosse libera.',bodyEn:'The pedestrian may interpret your gesture as meaning the whole road is clear.'},
    {titleIt:'IL PERICOLO PUÒ ARRIVARE DA ALTROVE',titleEn:'DANGER MAY COME FROM ELSEWHERE',bodyIt:'Un altro veicolo può arrivare da una direzione che il pedone non vede.',bodyEn:'Another vehicle may approach from a direction the pedestrian cannot see.'},
    {titleIt:'RALLENTA • CONTROLLA • NESSUN CENNO',titleEn:'SLOW • CHECK • DO NOT WAVE',bodyIt:'Rallenta e preparati a fermarti, ma lascia che sia il pedone a decidere quando attraversare.',bodyEn:'Slow down and prepare to stop, but let the pedestrian decide when it is safe to cross.'}
   ],
   phaseOptions:[{startRatio:0,autoplay:true,endRatio:.45},{startRatio:.25,freeze:true},{startRatio:.25,freeze:true},{startRatio:.45,autoplay:false,endRatio:.95}]
  },
  coach:{
   missIt:'Guarda insieme il pedone e gli altri veicoli: il rischio è ciò che il pedone potrebbe non vedere.',missEn:'Look at both the pedestrian and the other vehicles: the risk is what the pedestrian may not see.',
   hitIt:'Esatto: non puoi garantire che le altre direzioni siano libere.',hitEn:'Correct: you cannot guarantee that traffic from other directions is clear.'
  },
  learning:{
   correctIt:'Non invitare mai il pedone con un gesto: potrebbe arrivare un altro veicolo da una direzione che il pedone non vede.',
   correctEn:'Never wave a pedestrian across: another vehicle may approach from a direction the pedestrian cannot see.'
  }
 });

 global.ReplayEngine.registerScene({
  id:'MT_ZEBRA_WAITING_STOP_V1',
  category:'pedestrian',
  country:'MT',
  licenceType:'LPTV',
  drivingSide:'left',
  countryPackId:'MT-LPTV',
  sceneKey:'zebraWaitingStop',
  visualStatus:'final-real-footage',
  replayTemplate:'standard-video',
  title:'Approaching a zebra crossing with pedestrians waiting',
  accessibilityLabel:'Cars stopping at a pedestrian crossing with pedestrians clearly visible',
  playbackRate:0.9,
  media:{
   video:'https://www.pexels.com/download/video/2863232/',
   videoSources:["https://www.pexels.com/download/video/2863232/","https://videos.pexels.com/video-files/2863232/2863232-hd_1920_1080_25fps.mp4","https://www.pexels.com/download/video/12769743/"],
   poster:'https://images.pexels.com/videos/2863232/free-video-2863232.jpg?auto=compress&dpr=1&h=750&w=1260',
   credit:'Pexels · George Morina',
   sourcePage:'https://www.pexels.com/video/cars-stopping-at-a-pedestrian-crossing-2863232/'
  },
  timeline:[
   {at:0.5,event:'info',textIt:'Individua i pedoni in attesa',textEn:'Identify the pedestrians waiting'},
   {at:2.5,event:'danger',textIt:'Avvicinarsi troppo velocemente riduce il margine di sicurezza',textEn:'Approaching too fast reduces the safety margin'},
   {at:4.5,event:'slow',textIt:'Rallenta e preparati a fermarti',textEn:'Slow down and prepare to stop'},
   {at:6.5,event:'wait',textIt:'Fermati se necessario e lascia attraversare in sicurezza',textEn:'Stop if necessary and let them cross safely'}
  ],
  ui:{
   hotspot:{left:50,top:56,radiusX:38,radiusY:30,instructionIt:'TOCCA I PEDONI / ATTRAVERSAMENTO',instructionEn:'TAP THE PEDESTRIANS / CROSSING',ariaIt:'Tocca i pedoni in attesa o l’attraversamento zebra',ariaEn:'Tap the waiting pedestrians or zebra crossing'},
   phases:[
    {},
    {titleIt:'PEDONI IN ATTESA: RIDUCI LA VELOCITÀ',titleEn:'PEDESTRIANS WAITING: SLOW DOWN',bodyIt:'Avvicinarti troppo velocemente riduce il tempo per fermarti in sicurezza.',bodyEn:'Approaching too fast reduces the time available to stop safely.'},
    {titleIt:'PREPARATI A FERMARTI',titleEn:'PREPARE TO STOP',bodyIt:'Allo zebra crossing devi rallentare e poter arrestare il veicolo se i pedoni iniziano ad attraversare.',bodyEn:'At the zebra crossing, slow down and be able to stop if pedestrians begin to cross.'},
    {titleIt:'RALLENTA • CONTROLLA • FERMATI SE NECESSARIO',titleEn:'SLOW • CHECK • STOP IF NEEDED',bodyIt:'La risposta corretta è rallentare e prepararti a fermarti.',bodyEn:'The correct answer is to slow down and prepare to stop.'}
   ],
   phaseOptions:[{startRatio:0,autoplay:true,endRatio:.48},{startRatio:.28,freeze:true},{startRatio:.28,freeze:true},{startRatio:.48,autoplay:false,endRatio:.95}]
  },
  coach:{
   missIt:'Cerca i pedoni in attesa e lo zebra crossing davanti ai veicoli.',missEn:'Look for the waiting pedestrians and the zebra crossing ahead of the vehicles.',
   hitIt:'Esatto: qui devi ridurre la velocità e prepararti a fermarti.',hitEn:'Correct: slow down here and prepare to stop.'
  },
  learning:{
   correctIt:'Avvicinati lentamente all’attraversamento zebra e preparati a fermarti per i pedoni in attesa.',
   correctEn:'Approach the zebra crossing slowly and prepare to stop for pedestrians waiting to cross.'
  }
 });


 global.ReplayEngine.registerScene({
  id:'MT_CYCLIST_SAFE_PASS_V1',
  category:'cyclist',country:'MT',licenceType:'LPTV',drivingSide:'left',countryPackId:'MT-LPTV',
  sceneKey:'cyclistSafePass',visualStatus:'final-real-footage',replayTemplate:'standard-video',
  title:'Pass a cyclist slowly and leave plenty of room',
  accessibilityLabel:'Cyclists clearly visible from a car side-mirror perspective during a real road passing situation',playbackRate:0.86,
  media:{
   video:'https://www.pexels.com/download/video/34633207/',
   videoSources:[
    "https://www.pexels.com/download/video/34633207/",
    "https://videos.pexels.com/video-files/34633207/34633207-hd_1920_1080_30fps.mp4",
    "https://videos.pexels.com/video-files/34633207/34633207-hd_1920_1080_25fps.mp4"
   ],
   poster:'https://images.pexels.com/videos/34633207/free-video-34633207.jpg?auto=compress&dpr=1&h=750&w=1260',
   credit:'Pexels · BJ Zurc',
   sourcePage:'https://www.pexels.com/video/cyclists-passing-by-in-car-side-mirror-view-34633207/'
  },
  timeline:[
   {at:.5,event:'info',textIt:'Individua il ciclista davanti',textEn:'Identify the cyclist ahead'},
   {at:2.2,event:'danger',textIt:'Riduci la velocità prima di affiancarlo',textEn:'Reduce speed before drawing alongside'},
   {at:4.2,event:'distance',textIt:'Lascia un ampio margine laterale',textEn:'Leave a wide lateral gap'},
   {at:6.2,event:'lane',textIt:'Rientra solo quando hai spazio sufficiente',textEn:'Move back only when there is enough room'}
  ],
  ui:{
   hotspot:{left:50,top:52,radiusX:34,radiusY:34,instructionIt:'TOCCA IL CICLISTA',instructionEn:'TAP THE CYCLIST',ariaIt:'Tocca il ciclista sulla strada',ariaEn:'Tap the cyclist on the road'},
   phases:[
    {},
    {titleIt:'NON PASSARE VELOCEMENTE O TROPPO VICINO',titleEn:'DO NOT PASS FAST OR TOO CLOSE',bodyIt:'Su una strada stretta il ciclista può oscillare o deviare improvvisamente.',bodyEn:'On a narrow road the cyclist may wobble or move unexpectedly.'},
    {titleIt:'LENTAMENTE E CON MOLTO SPAZIO',titleEn:'SLOWLY WITH PLENTY OF ROOM',bodyIt:'La risposta corretta è ridurre la velocità e mantenere un ampio margine laterale.',bodyEn:'The correct answer is to reduce speed and keep a wide lateral margin.'},
    {titleIt:'RALLENTA • ALLARGATI • RIENTRA CON MARGINE',titleEn:'SLOW • MOVE OUT • RETURN WITH MARGIN',bodyIt:'Completa il sorpasso solo quando puoi farlo senza stringere il ciclista.',bodyEn:'Complete the pass only when you can do so without squeezing the cyclist.'}
   ],
   phaseOptions:[{startRatio:0,autoplay:true,endRatio:.45},{startRatio:.32,freeze:true},{startRatio:.32,freeze:true},{startRatio:.45,autoplay:false,endRatio:.95}]
  },
  coach:{
   missIt:'Cerca il ciclista e valuta lo spazio laterale che gli stai lasciando.',missEn:'Find the cyclist and judge the lateral space you are leaving.',
   hitIt:'Hai individuato l’utente vulnerabile: ora la priorità è rallentare e lasciare molto spazio.',hitEn:'You identified the vulnerable road user: now slow down and leave plenty of room.'
  },
  learning:{correctIt:'Passa lentamente e lascia molto spazio al ciclista.',correctEn:'Pass slowly and leave plenty of room for the cyclist.'}
 });

 global.ReplayEngine.registerScene({
  id:'MT_LARGE_VEHICLE_FOLLOWING_V1',
  category:'following-distance',country:'MT',licenceType:'LPTV',drivingSide:'left',countryPackId:'MT-LPTV',
  sceneKey:'largeVehicleFollowing',visualStatus:'final-real-footage',replayTemplate:'standard-video',
  title:'Stay well back behind a large vehicle',
  accessibilityLabel:'Driver point of view following large trucks on an expressway with a clearly visible following gap',playbackRate:0.9,
  media:{
   video:'https://www.pexels.com/download/video/4608275/',
   videoSources:["https://www.pexels.com/download/video/4608275/", "https://videos.pexels.com/video-files/4608275/4608275-hd_1920_1080_25fps.mp4", "https://videos.pexels.com/video-files/4608275/4608275-hd_1920_1080_30fps.mp4", "https://www.pexels.com/download/video/35408009/"],
   poster:'https://images.pexels.com/videos/4608275/free-video-4608275.jpg?auto=compress&dpr=1&h=750&w=1260',
   credit:'Pexels · K',
   sourcePage:'https://www.pexels.com/video/moving-cars-on-expressway-4608275/'
  },
  timeline:[
   {at:.5,event:'info',textIt:'Osserva il veicolo grande davanti',textEn:'Observe the large vehicle ahead'},
   {at:2.0,event:'danger',textIt:'Troppo vicino puoi sparire dai suoi specchi',textEn:'Too close, you may disappear from its mirrors'},
   {at:4.0,event:'distance',textIt:'Aumenta la distanza',textEn:'Increase the gap'},
   {at:6.0,event:'wait',textIt:'Resta visibile e migliora la visuale avanti',textEn:'Stay visible and improve your view ahead'}
  ],
  ui:{
   hotspot:{left:50,top:42,radiusX:34,radiusY:30,instructionIt:'TOCCA IL VEICOLO GRANDE',instructionEn:'TAP THE LARGE VEHICLE',ariaIt:'Tocca il veicolo grande davanti',ariaEn:'Tap the large vehicle ahead'},
   phases:[{},
    {titleIt:'TROPPO VICINO = MENO VISIBILE',titleEn:'TOO CLOSE = LESS VISIBLE',bodyIt:'Se resti troppo vicino, il conducente del veicolo grande può non vederti negli specchi.',bodyEn:'If you stay too close, the large-vehicle driver may not see you in the mirrors.'},
    {titleIt:'RESTA BEN DISTANTE',titleEn:'STAY WELL BACK',bodyIt:'La distanza ti rende più visibile negli specchi e migliora la tua visuale davanti.',bodyEn:'The gap keeps you visible in the mirrors and improves your view ahead.'},
    {titleIt:'AUMENTA LA DISTANZA E RESTA VISIBILE',titleEn:'INCREASE THE GAP AND STAY VISIBLE',bodyIt:'Mantieni una posizione che il conducente possa vedere negli specchi.',bodyEn:'Keep a position the driver can see in the mirrors.'}],
   phaseOptions:[{startRatio:0,autoplay:true,endRatio:.42},{startRatio:.28,freeze:true},{startRatio:.28,freeze:true},{startRatio:.42,autoplay:false,endRatio:.92}]
  },
  coach:{missIt:'Concentrati sul veicolo grande davanti e sulla distanza che mantieni.',missEn:'Focus on the large vehicle ahead and the gap you keep.',hitIt:'Hai individuato il veicolo grande: resta abbastanza indietro da essere visibile nei suoi specchi.',hitEn:'You identified the large vehicle: stay far enough back to remain visible in its mirrors.'},
  learning:{correctIt:'Mantieniti ben distante per restare visibile negli specchi del conducente.',correctEn:'Stay well back so the driver can see you in the mirrors.'}
 });

 global.ReplayEngine.registerScene({
  id:'MT_DAZZLED_HEADLIGHTS_V1',
  category:'night-driving',country:'MT',licenceType:'LPTV',drivingSide:'left',countryPackId:'MT-LPTV',
  sceneKey:'dazzledHeadlights',visualStatus:'final-real-footage',replayTemplate:'standard-video',
  title:'Dazzled by oncoming headlights',
  accessibilityLabel:'Driver view on a dark road with an approaching vehicle and strong headlights',playbackRate:0.78,
  media:{video:'https://www.pexels.com/download/video/34738405/',poster:'https://images.pexels.com/videos/34738405/free-video-34738405.jpg?auto=compress&dpr=1&h=750&w=1260',credit:'Pexels · Ravi Kant'},
  timeline:[
   {at:.4,event:'info',textIt:'Osserva il veicolo che arriva di fronte',textEn:'Watch the approaching vehicle'},
   {at:1.8,event:'danger',textIt:'I fari entrano direttamente nel campo visivo',textEn:'The headlights shine directly into your view'},
   {at:3.6,event:'slow',textIt:'Rallenta subito e mantieni il controllo',textEn:'Slow down immediately and keep control'},
   {at:5.6,event:'wait',textIt:'Se non vedi chiaramente, fermati finché l’abbagliamento passa',textEn:'If you cannot see clearly, stop until the glare passes'}
  ],
  ui:{
   hotspot:{left:51,top:45,radiusX:30,radiusY:25,instructionIt:'TOCCA I FARI CHE ABBAGLIANO',instructionEn:'TAP THE GLARING HEADLIGHTS',ariaIt:'Tocca i fari del traffico in arrivo',ariaEn:'Tap the oncoming headlights'},
   phases:[{},
    {titleIt:'NON CONTINUARE ALLA STESSA VELOCITÀ',titleEn:'DO NOT CONTINUE AT THE SAME SPEED',bodyIt:'Se i fari ti abbagliano, la distanza visibile davanti si riduce.',bodyEn:'If headlights dazzle you, the visible distance ahead is reduced.'},
    {titleIt:'RALLENTA O FERMATI',titleEn:'SLOW DOWN OR STOP',bodyIt:'Riduci la velocità e, se necessario, fermati finché recuperi una visibilità sicura.',bodyEn:'Reduce speed and, if necessary, stop until safe visibility returns.'},
    {titleIt:'RIDUCI LA VELOCITÀ • RECUPERA VISIBILITÀ',titleEn:'REDUCE SPEED • REGAIN VISIBILITY',bodyIt:'Riprendi normalmente solo quando riesci a vedere chiaramente.',bodyEn:'Resume normally only when you can see clearly.'}],
   phaseOptions:[{startRatio:0,autoplay:true,endRatio:.44},{startRatio:.30,freeze:true},{startRatio:.30,freeze:true},{startRatio:.44,autoplay:false,endRatio:.94}]
  },
  coach:{missIt:'Individua la sorgente dell’abbagliamento: i fari dei veicoli in arrivo.',missEn:'Identify the source of the glare: the oncoming vehicle headlights.',hitIt:'Hai riconosciuto l’abbagliamento: ora riduci la velocità e fermati se non vedi in sicurezza.',hitEn:'You recognised the glare: now reduce speed and stop if you cannot see safely.'},
  learning:{correctIt:'Rallenta o fermati finché riesci a vedere chiaramente.',correctEn:'Slow down or stop until you can see clearly.'}
 });

})(window);
