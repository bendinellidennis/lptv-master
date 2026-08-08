
(function(global){
 'use strict';


 global.ReplayEngine.registerScene({
  id:'MT_MSM_ROUTINE_V1',
  category:'alertness',country:'MT',licenceType:'LPTV',drivingSide:'left',countryPackId:'MT-LPTV',
  sceneKey:'msmRoutine',visualStatus:'real-footage-sequence',replayTemplate:'standard-video',
  title:'MSM — Mirror, Signal, Manoeuvre',
  accessibilityLabel:'Driver checks traffic and mirrors, then the replay shows the indicator and a real turning manoeuvre',
  playbackRate:0.9,
  media:{
   video:'https://www.pexels.com/download/video/4118586/',
   videoSources:["https://www.pexels.com/download/video/4118586/"],
   poster:'https://images.pexels.com/videos/4118586/free-video-4118586.jpg?auto=compress&dpr=1&h=750&w=1260',
   credit:'Pexels · WeStarMoney Rec',
   sourcePage:'https://www.pexels.com/video/man-driving-a-car-and-looking-curious-4118586/'
  },
  timeline:[
   {at:.4,end:2.2,event:'observe',textIt:'1. SPECCHIO: controlla il traffico dietro e accanto',textEn:'1. MIRROR: check traffic behind and beside you'},
   {at:2.4,end:4.2,event:'signal',textIt:'2. SEGNALE: comunica per tempo ciò che vuoi fare',textEn:'2. SIGNAL: communicate your intention in good time'},
   {at:4.4,end:6.2,event:'manoeuvre',textIt:'3. MANOVRA: muoviti solo quando è sicuro',textEn:'3. MANOEUVRE: move only when it is safe'},
   {at:6.4,end:8.6,event:'sequence',textIt:'MSM = Specchio → Segnale → Manovra',textEn:'MSM = Mirror → Signal → Manoeuvre'}
  ],
  ui:{
   hotspot:{left:54,top:48,radiusX:40,radiusY:35,instructionIt:'TOCCA IL CONTROLLO DEGLI SPECCHI',instructionEn:'TAP THE MIRROR CHECK',ariaIt:'Tocca il conducente o lo specchio durante il controllo',ariaEn:'Tap the driver or mirror during the check'},
   phases:[
    {},
    {titleIt:'PRIMA CONTROLLA: NON INIZIARE DALLA MANOVRA',titleEn:'CHECK FIRST: DO NOT START WITH THE MANOEUVRE',bodyIt:'Se ti sposti o svolti prima di controllare gli specchi, puoi non sapere cosa sta arrivando dietro o accanto a te.',bodyEn:'If you move or turn before checking the mirrors, you may not know what is approaching behind or beside you.'},
    {titleIt:'S = SIGNAL • SEGNALE',titleEn:'S = SIGNAL',bodyIt:'Dopo il controllo degli specchi, usa l’indicatore in tempo per far capire agli altri cosa stai per fare.',bodyEn:'After checking the mirrors, use the indicator in good time so others know what you intend to do.'},
    {titleIt:'M = MANOEUVRE • MANOVRA',titleEn:'M = MANOEUVRE',bodyIt:'Solo dopo Specchio e Segnale esegui la manovra quando è sicura. MSM = Specchio → Segnale → Manovra.',bodyEn:'Only after Mirror and Signal carry out the manoeuvre when it is safe. MSM = Mirror → Signal → Manoeuvre.'}
   ],
   phaseMedia:[
    null,
    null,
    {
     video:'https://www.pexels.com/download/video/4565727/',
     videoSources:["https://www.pexels.com/download/video/4565727/"],
     poster:'https://images.pexels.com/videos/4565727/free-video-4565727.jpg?auto=compress&dpr=1&h=750&w=1260',
     credit:'Pexels · ArtHouse Studio',
     sourcePage:'https://www.pexels.com/video/close-up-video-of-a-steering-wheel-4565727/'
    },
    {
     video:'https://www.pexels.com/download/video/3999415/',
     videoSources:["https://www.pexels.com/download/video/3999415/"],
     poster:'https://images.pexels.com/videos/3999415/free-video-3999415.jpg?auto=compress&dpr=1&h=750&w=1260',
     credit:'Pexels · K',
     sourcePage:'https://www.pexels.com/video/close-up-a-car-driving-on-the-road-3999415/'
    }
   ],
   phaseOptions:[
    {startRatio:0,autoplay:true,endRatio:.55},
    {startRatio:.22,freeze:true},
    {startRatio:0,autoplay:true,endRatio:.85},
    {startRatio:0,autoplay:true,endRatio:.88}
   ]
  },
  coach:{
   missIt:'Cerca il primo passo della sequenza: prima di segnalare o muoverti devi controllare cosa succede attorno al veicolo.',
   missEn:'Find the first step in the sequence: before signalling or moving, check what is happening around the vehicle.',
   hitIt:'Esatto: il primo passo è Mirror. Poi Signal e infine Manoeuvre.',
   hitEn:'Correct: the first step is Mirror. Then Signal and finally Manoeuvre.'
  },
  learning:{
   correctIt:'MSM significa Specchio, Segnale, Manovra: controlla, comunica, poi esegui la manovra.',
   correctEn:'MSM means Mirror, Signal, Manoeuvre: check, communicate, then carry out the manoeuvre.'
  }
 });


 global.ReplayEngine.registerScene({
  id:'MT_BLIND_SPOT_DEFINITION_V1',category:'alertness',country:'MT',licenceType:'LPTV',drivingSide:'left',countryPackId:'MT-LPTV',
  sceneKey:'blindSpotDefinition',visualStatus:'real-footage-with-instructional-overlay',replayTemplate:'standard-video',
  title:'Blind spot: area not covered by mirrors',
  accessibilityLabel:'Real traffic seen in a car side mirror, used to explain the area that remains outside mirror coverage',
  playbackRate:0.85,
  media:{
   video:'https://www.pexels.com/download/video/4607432/',
   videoSources:["https://www.pexels.com/download/video/4607432/"],
   poster:'https://images.pexels.com/videos/4607432/free-video-4607432.jpg?auto=compress&dpr=1&h=750&w=1260',
   credit:'Pexels · cottonbro studio',
   sourcePage:'https://www.pexels.com/video/a-car-is-shown-in-the-side-mirror-of-a-car-4607432/'
  },
  timeline:[
   {at:.4,end:2.0,event:'observe',textIt:'Osserva ciò che compare nello specchietto',textEn:'Observe what appears in the side mirror'},
   {at:2.2,end:4.0,event:'coverage',textIt:'Lo specchio mostra solo una parte dello spazio accanto e dietro al veicolo',textEn:'The mirror shows only part of the area beside and behind the vehicle'},
   {at:4.2,end:6.2,event:'blind-spot',textIt:'La zona fuori dalla visuale degli specchi è l’angolo cieco',textEn:'The area outside mirror coverage is the blind spot'},
   {at:6.4,end:8.8,event:'check',textIt:'Per controllarla serve anche un rapido controllo diretto sopra la spalla',textEn:'A quick direct shoulder check is also needed to check it'}
  ],
  ui:{
   hotspot:{left:48,top:51,radiusX:38,radiusY:34,instructionIt:'TOCCA LO SPECCHIETTO',instructionEn:'TAP THE SIDE MIRROR',ariaIt:'Tocca lo specchietto laterale',ariaEn:'Tap the side mirror'},
   phases:[
    {},
    {titleIt:'LO SPECCHIO NON MOSTRA TUTTO',titleEn:'THE MIRROR DOES NOT SHOW EVERYTHING',bodyIt:'Quello che vedi nello specchio è solo una parte dello spazio attorno al veicolo.',bodyEn:'What you see in the mirror is only part of the space around the vehicle.'},
    {titleIt:'ANGOLO CIECO = FUORI DALLA VISUALE',titleEn:'BLIND SPOT = OUTSIDE MIRROR VIEW',bodyIt:'L’angolo cieco è precisamente l’area che non è coperta dagli specchi.',bodyEn:'The blind spot is precisely the area not covered by your mirrors.'},
    {titleIt:'SPECCHI + CONTROLLO DIRETTO',titleEn:'MIRRORS + DIRECT CHECK',bodyIt:'Prima di spostarti lateralmente controlla gli specchi e, quando necessario, anche sopra la spalla.',bodyEn:'Before moving sideways, check the mirrors and, when needed, make a shoulder check.'}
   ],
   phaseOptions:[{startRatio:0,autoplay:true,endRatio:.45},{startRatio:.28,freeze:true},{startRatio:.28,freeze:true},{startRatio:.45,autoplay:false,endRatio:.95}]
  },
  coach:{
   missIt:'Concentrati sullo specchietto: la domanda riguarda ciò che gli specchi non riescono a mostrarti.',missEn:'Focus on the mirror: the question is about what the mirrors cannot show you.',
   hitIt:'Esatto: l’angolo cieco è la zona che resta fuori dalla visuale degli specchi.',hitEn:'Correct: the blind spot is the area that remains outside mirror coverage.'
  },
  learning:{
   correctIt:'L’angolo cieco è un’area attorno al veicolo che non è visibile negli specchi.',
   correctEn:'A blind spot is an area around the vehicle that cannot be seen in the mirrors.'
  }
 });


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
  id:'MT_HANDS_FREE_DISTRACTION_V1',
  category:'alertness',country:'MT',licenceType:'LPTV',drivingSide:'left',countryPackId:'MT-LPTV',
  sceneKey:'handsFreeDistraction',visualStatus:'final-real-footage',replayTemplate:'standard-video',
  title:'Hands-free phone distraction while driving',
  accessibilityLabel:'Driver actively driving with wireless earbuds, illustrating hands-free communication while the vehicle is moving',
  playbackRate:0.9,
  media:{
   video:'https://videos.pexels.com/video-files/5520095/5520095-hd_1920_1080_30fps.mp4',
   videoSources:["https://videos.pexels.com/video-files/5520095/5520095-hd_1920_1080_30fps.mp4","https://www.pexels.com/download/video/5520095/"],
   poster:'https://images.pexels.com/videos/5520095/boss-business-businessman-communication-5520095.jpeg?auto=compress&dpr=1&h=750&w=1260',
   credit:'Pexels · Pavel Danilyuk',
   sourcePage:'https://www.pexels.com/video/a-man-driving-his-car-5520095/'
  },
  timeline:[
   {at:.5,end:2.0,event:'observe',textIt:'Osserva il conducente: guida con auricolari wireless',textEn:'Observe the driver: he is driving with wireless earbuds'},
   {at:2.2,end:4.0,event:'hands-free',textIt:'Le mani sono libere, ma la conversazione richiede attenzione',textEn:'Your hands are free, but the conversation still uses attention'},
   {at:4.2,end:6.2,event:'hazard',textIt:'Anche senza tenere il telefono puoi perdere concentrazione sulla strada',textEn:'Even without holding the phone, you can lose concentration on the road'},
   {at:6.4,end:9.0,event:'correct',textIt:'Vivavoce non significa assenza di distrazione',textEn:'Hands-free does not mean distraction-free'}
  ],
  ui:{
   hotspot:{left:30,top:36,radiusX:28,radiusY:34,instructionIt:'TOCCA L’AURICOLARE / CONDUCENTE',instructionEn:'TAP THE EARBUD / DRIVER',ariaIt:'Tocca il conducente con auricolare wireless',ariaEn:'Tap the driver wearing a wireless earbud'},
   phases:[
    {},
    {titleIt:'LE MANI SONO LIBERE, LA MENTE NO',titleEn:'HANDS FREE, MIND STILL BUSY',bodyIt:'Il conducente non tiene il telefono in mano, ma sta comunque gestendo una comunicazione mentre guida.',bodyEn:'The driver is not holding a phone, but is still handling communication while driving.'},
    {titleIt:'LA CONVERSAZIONE USA ATTENZIONE',titleEn:'THE CONVERSATION USES ATTENTION',bodyIt:'Seguire e rispondere a una conversazione può sottrarre attenzione mentale a ciò che accade sulla strada.',bodyEn:'Following and responding to a conversation can take mental attention away from what is happening on the road.'},
    {titleIt:'VIVAVOCE ≠ GUIDA SENZA DISTRAZIONI',titleEn:'HANDS-FREE ≠ DISTRACTION-FREE',bodyIt:'La risposta corretta è: anche il vivavoce può distrarre la tua attenzione dalla strada.',bodyEn:'The correct answer is: hands-free phone use can still distract your attention from the road.'}
   ],
   phaseOptions:[{startRatio:0,autoplay:true,endRatio:.45},{startRatio:.28,freeze:true},{startRatio:.28,freeze:true},{startRatio:.45,autoplay:false,endRatio:.95}]
  },
  coach:{
   missIt:'Guarda l’auricolare e il conducente in movimento: non sta tenendo il telefono, ma la sua attenzione può essere divisa.',missEn:'Look at the earbud and the moving driver: he is not holding the phone, but his attention can still be divided.',
   hitIt:'Esatto: è una comunicazione hands-free, ma può comunque distrarre la mente dalla strada.',hitEn:'Correct: it is hands-free communication, but it can still distract the mind from the road.'
  },
  learning:{
   correctIt:'Usare il vivavoce durante la guida può comunque distrarre la tua attenzione dalla strada.',
   correctEn:'Using a hands-free phone while driving can still distract your attention from the road.'
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


 global.ReplayEngine.registerScene({
  id:'MT_DUSK_LIGHTS_VISIBILITY_V1',
  category:'alertness',country:'MT',licenceType:'LPTV',drivingSide:'left',countryPackId:'MT-LPTV',
  sceneKey:'duskLightsVisibility',visualStatus:'final-real-footage',replayTemplate:'standard-video',
  title:'Dusk driving — switch on lights to be seen',
  accessibilityLabel:'Twilight road traffic with vehicle headlights visible while street lighting is also present',
  playbackRate:0.88,
  media:{
   video:'https://videos.pexels.com/video-files/4833483/4833483-hd_1920_1080_25fps.mp4',
   videoSources:["https://videos.pexels.com/video-files/4833483/4833483-hd_1920_1080_25fps.mp4","https://www.pexels.com/download/video/4833483/"],
   poster:'https://images.pexels.com/videos/4833483/pexels-photo-4833483.jpeg?auto=compress&dpr=1&h=750&w=1260',
   credit:'Pexels · WeStarMoney Rec',
   sourcePage:'https://www.pexels.com/video/sunset-driving-at-a-community-road-4833483/'
  },
  timeline:[
   {at:.5,end:2.4,event:'observe',textIt:'È crepuscolo: la strada non è ancora completamente buia',textEn:'It is dusk: the road is not fully dark yet'},
   {at:2.6,end:4.5,event:'visibility',textIt:'I fari rendono i veicoli molto più facili da vedere',textEn:'Headlights make vehicles much easier to see'},
   {at:4.7,end:6.8,event:'streetlights',textIt:'I lampioni accesi non sostituiscono le luci del veicolo',textEn:'Street lighting does not replace the vehicle lights'},
   {at:7.0,end:9.4,event:'correct',textIt:'Al crepuscolo: luci accese per essere visibili, anche su strade illuminate',textEn:'At dusk: lights on to be visible, even on lit streets'}
  ],
  ui:{
   hotspot:{left:51,top:47,radiusX:27,radiusY:23,instructionIt:'TOCCA I FARI ACCESI',instructionEn:'TAP THE HEADLIGHTS',ariaIt:'Tocca i fari dei veicoli visibili al crepuscolo',ariaEn:'Tap the vehicle headlights visible at dusk'},
   phases:[
    {},
    {titleIt:'AL CREPUSCOLO PUOI ESSERE DIFFICILE DA VEDERE',titleEn:'AT DUSK YOU CAN BE HARD TO SEE',bodyIt:'Anche se riesci ancora a vedere la strada, gli altri possono distinguere peggio il tuo veicolo.',bodyEn:'Even if you can still see the road, other road users may see your vehicle less clearly.'},
    {titleIt:'ACCENDI LE LUCI ANCHE CON I LAMPIONI',titleEn:'USE YOUR LIGHTS EVEN WITH STREET LIGHTING',bodyIt:'L’illuminazione stradale illumina l’ambiente, ma le luci del veicolo servono anche a rendere visibile te.',bodyEn:'Street lighting illuminates the surroundings, but your vehicle lights also make you visible.'},
    {titleIt:'FATTI VEDERE • LUCI ACCESE',titleEn:'BE SEEN • LIGHTS ON',bodyIt:'Le due risposte corrette sono: accendi le luci affinché gli altri possano vederti e usale anche quando i lampioni sono accesi.',bodyEn:'The two correct answers are: use your lights so others can see you, and use them even when street lights are lit.'}
   ],
   phaseMedia:[
    null,
    null,
    {
     video:'https://www.pexels.com/download/video/19016555/',
     videoSources:["https://www.pexels.com/download/video/19016555/"],
     poster:'https://images.pexels.com/videos/19016555/pexels-photo-19016555.jpeg?auto=compress&dpr=1&h=750&w=1260',
     credit:'Pexels · Th2city Santana',
     sourcePage:'https://www.pexels.com/video/a-city-street-at-sunset-with-cars-driving-down-the-road-19016555/'
    },
    {
     video:'https://www.pexels.com/download/video/19016555/',
     videoSources:["https://www.pexels.com/download/video/19016555/"],
     poster:'https://images.pexels.com/videos/19016555/pexels-photo-19016555.jpeg?auto=compress&dpr=1&h=750&w=1260',
     credit:'Pexels · Th2city Santana',
     sourcePage:'https://www.pexels.com/video/a-city-street-at-sunset-with-cars-driving-down-the-road-19016555/'
    }
   ],
   phaseOptions:[
    {startRatio:0,autoplay:true,endRatio:.52},
    {startRatio:.28,freeze:true},
    {startRatio:0,autoplay:true,endRatio:.72},
    {startRatio:.12,autoplay:false,endRatio:.90}
   ]
  },
  coach:{
   missIt:'Cerca i fari dei veicoli: al crepuscolo servono soprattutto a rendere il veicolo riconoscibile agli altri.',
   missEn:'Look for the vehicle headlights: at dusk they are especially important for making the vehicle visible to others.',
   hitIt:'Esatto: i fari accesi rendono il veicolo visibile già al crepuscolo, anche dove ci sono lampioni.',
   hitEn:'Correct: headlights make the vehicle visible from dusk, even where street lights are present.'
  },
  learning:{
   correctIt:'Al crepuscolo accendi le luci per farti vedere dagli altri, anche quando l’illuminazione stradale è accesa.',
   correctEn:'At dusk, switch on your lights so others can see you, even when street lighting is on.'
  }
 });


 global.ReplayEngine.registerScene({
  id:'MT_TWO_SECOND_RULE_GAP_V1',
  category:'safety-margins',country:'MT',licenceType:'LPTV',drivingSide:'left',countryPackId:'MT-LPTV',
  sceneKey:'twoSecondRuleGap',visualStatus:'final-real-footage',replayTemplate:'standard-video',
  title:'Two-second rule — safe following gap',
  accessibilityLabel:'Driver point of view following traffic with a vehicle ahead and roadside reference points',
  playbackRate:0.82,
  media:{
   video:'https://www.pexels.com/download/video/5786587/',
   videoSources:["https://www.pexels.com/download/video/5786587/","https://videos.pexels.com/video-files/5786587/5786587-uhd_3840_2160_30fps.mp4"],
   poster:'https://images.pexels.com/videos/5786587/pexels-photo-5786587.jpeg?auto=compress&dpr=1&h=750&w=1260',
   credit:'Pexels · Tom Fisk',
   sourcePage:'https://www.pexels.com/video/vehicles-moving-on-a-highway-5786587/'
  },
  timeline:[
   {at:.5,end:2.3,event:'observe',textIt:'Osserva il veicolo davanti e scegli un punto fisso sul bordo strada',textEn:'Watch the vehicle ahead and choose a fixed roadside point'},
   {at:2.5,end:4.2,event:'danger',textIt:'Se raggiungi quel punto troppo presto, la distanza è insufficiente',textEn:'If you reach that point too soon, the following gap is too small'},
   {at:4.4,end:6.8,event:'rule',textIt:'Quando il veicolo davanti supera il punto, conta almeno due secondi',textEn:'When the vehicle ahead passes the point, count at least two seconds'},
   {at:7.0,end:9.6,event:'correct',textIt:'Raggiungi il punto solo dopo due secondi: così mantieni una distanza sicura',textEn:'Reach the point only after two seconds to keep a safe following gap'}
  ],
  ui:{
   hotspot:{left:50,top:45,radiusX:31,radiusY:26,instructionIt:'TOCCA IL VEICOLO DAVANTI',instructionEn:'TAP THE VEHICLE AHEAD',ariaIt:'Tocca il veicolo che stai seguendo',ariaEn:'Tap the vehicle you are following'},
   phases:[
    {},
    {titleIt:'TROPPO VICINO = MENO TEMPO PER REAGIRE',titleEn:'TOO CLOSE = LESS TIME TO REACT',bodyIt:'La regola dei due secondi serve a controllare la distanza dal veicolo che precede, non a decidere quando immettersi o iniziare una manovra.',bodyEn:'The two-second rule checks the gap to the vehicle ahead; it is not for deciding when to emerge or begin a manoeuvre.'},
    {titleIt:'USA UN PUNTO FISSO E CONTA DUE SECONDI',titleEn:'USE A FIXED POINT AND COUNT TWO SECONDS',bodyIt:'Scegli un cartello, un palo o un altro punto fisso. Quando il veicolo davanti lo supera, conta due secondi.',bodyEn:'Choose a sign, post or another fixed point. When the vehicle ahead passes it, count two seconds.'},
    {titleIt:'MANTIENI ALMENO DUE SECONDI',titleEn:'KEEP AT LEAST TWO SECONDS',bodyIt:'In condizioni normali devi arrivare allo stesso punto non prima di due secondi dopo il veicolo davanti.',bodyEn:'In good conditions, you should reach the same point no sooner than two seconds after the vehicle ahead.'}
   ],
   phaseOptions:[
    {startRatio:0,autoplay:true,endRatio:.48},
    {startRatio:.30,freeze:true},
    {startRatio:.18,autoplay:false,endRatio:.70},
    {startRatio:.42,autoplay:false,endRatio:.94}
   ]
  },
  coach:{
   missIt:'Cerca il veicolo davanti: la regola dei due secondi misura proprio lo spazio che lasci tra voi.',
   missEn:'Look for the vehicle ahead: the two-second rule measures the gap you leave behind it.',
   hitIt:'Esatto. Ora usa un punto fisso e controlla che passino almeno due secondi prima che tu raggiunga lo stesso punto.',
   hitEn:'Correct. Now use a fixed point and make sure at least two seconds pass before you reach the same point.'
  },
  learning:{
   correctIt:'Usa la regola dei due secondi per mantenere una distanza di sicurezza dal veicolo davanti in condizioni normali.',
   correctEn:'Use the two-second rule to keep a safe following gap from the vehicle ahead in good conditions.'
  }
 });


 global.ReplayEngine.registerScene({
  id:'MT_LARGE_VEHICLE_TOO_CLOSE_V1',
  category:'safety-margins',country:'MT',licenceType:'LPTV',drivingSide:'left',countryPackId:'MT-LPTV',
  sceneKey:'largeVehicleTooClose',visualStatus:'final-real-footage',replayTemplate:'standard-video',
  title:'Following a large vehicle too closely',
  accessibilityLabel:'Driver point of view in motorway traffic with a large goods vehicle ahead, teaching the loss of forward view and mirror visibility when following too closely',
  playbackRate:0.88,
  media:{
   video:'https://www.pexels.com/download/video/9521384/',
   videoSources:["https://www.pexels.com/download/video/9521384/","https://videos.pexels.com/video-files/9521384/9521384-uhd_3840_2160_15fps.mp4"],
   poster:'https://images.pexels.com/videos/9521384/car-s-motorway-road-traffic-united-kingdom-9521384.jpeg?auto=compress&dpr=1&h=750&w=1260',
   credit:'Pexels · George Morina',
   sourcePage:'https://www.pexels.com/video/a-car-driving-on-the-highway-with-other-cars-9521384/'
  },
  timeline:[
   {at:.5,end:2.2,event:'observe',textIt:'Osserva il veicolo grande davanti e quanto spazio occupa nella tua visuale',textEn:'Watch the large vehicle ahead and how much of your forward view it occupies'},
   {at:2.4,end:4.5,event:'danger',textIt:'Se lo segui troppo vicino, il veicolo grande ti nasconde una parte importante della strada davanti',textEn:'If you follow too closely, the large vehicle blocks an important part of the road ahead'},
   {at:4.7,end:6.8,event:'blindspot',textIt:'Da troppo vicino puoi anche trovarti fuori dalla zona visibile nei suoi specchi',textEn:'From too close, you may also sit outside the area visible in its mirrors'},
   {at:7.0,end:9.8,event:'correct',textIt:'Aumenta la distanza: recuperi visuale davanti e rendi più facile al conducente vederti',textEn:'Increase the gap: regain your forward view and make it easier for the driver to see you'}
  ],
  ui:{
   hotspot:{left:50,top:38,radiusX:25,radiusY:28,instructionIt:'TOCCA IL VEICOLO GRANDE',instructionEn:'TAP THE LARGE VEHICLE',ariaIt:'Tocca il veicolo grande davanti',ariaEn:'Tap the large vehicle ahead'},
   phases:[
    {},
    {titleIt:'TROPPO VICINO = VISUALE RIDOTTA',titleEn:'TOO CLOSE = REDUCED VIEW',bodyIt:'Il veicolo grande riempie il tuo campo visivo e ti impedisce di vedere bene cosa succede più avanti.',bodyEn:'The large vehicle fills your field of view and prevents you from seeing clearly what is happening farther ahead.'},
    {titleIt:'PUOI SPARIRE DAI SUOI SPECCHI',titleEn:'YOU MAY DISAPPEAR FROM ITS MIRRORS',bodyIt:'I veicoli grandi hanno zone cieche. Se resti troppo vicino, il conducente può non vederti negli specchi.',bodyEn:'Large vehicles have blind areas. If you stay too close, the driver may not see you in the mirrors.'},
    {titleIt:'RESTA BEN DISTANTE',titleEn:'STAY WELL BACK',bodyIt:'Le due ragioni corrette sono entrambe qui: più visuale davanti per te e maggiore possibilità di essere visto dal conducente del veicolo grande.',bodyEn:'Both correct reasons are here: more forward view for you and a better chance of being seen by the large-vehicle driver.'}
   ],
   phaseOptions:[
    {startRatio:0,autoplay:true,endRatio:.46},
    {startRatio:.18,freeze:true},
    {startRatio:.34,freeze:true},
    {startRatio:.42,autoplay:false,endRatio:.92}
   ]
  },
  coach:{
   missIt:'Cerca il veicolo grande davanti: devi capire cosa perdi quando gli stai troppo vicino.',
   missEn:'Look for the large vehicle ahead: identify what you lose by following it too closely.',
   hitIt:'Esatto. Troppo vicino perdi visuale davanti e puoi anche non essere visibile nei suoi specchi.',
   hitEn:'Correct. Too close, you lose forward view and may also be invisible in its mirrors.'
  },
  learning:{
   correctIt:'Non seguire troppo da vicino un veicolo grande: riduce la tua visuale davanti e il conducente può non vederti negli specchi.',
   correctEn:'Do not follow a large vehicle too closely: it reduces your forward view and the driver may not see you in the mirrors.'
  }
 });


 global.ReplayEngine.registerScene({
  id:'MT_WET_ROAD_FOUR_SECOND_GAP_V1',
  category:'safety-margins',country:'MT',licenceType:'LPTV',drivingSide:'left',countryPackId:'MT-LPTV',
  sceneKey:'wetRoadFourSecondGap',visualStatus:'final-real-footage',replayTemplate:'standard-video',
  title:'Wet road — four-second following gap',
  accessibilityLabel:'Driver point of view through a rain-covered windscreen on a wet busy road with vehicles ahead and wipers operating',
  playbackRate:0.86,
  media:{
   video:'https://videos.pexels.com/video-files/32015769/13645753_2160_3840_60fps.mp4',
   videoSources:["https://videos.pexels.com/video-files/32015769/13645753_2160_3840_60fps.mp4"],
   poster:'https://images.pexels.com/videos/32015769/carphotography-carview-instagood-travelgram-32015769.jpeg?auto=compress&dpr=1&h=750&w=1260',
   credit:'Pexels · Sapol Churanon',
   sourcePage:'https://www.pexels.com/video/driving-through-rainy-weather-on-a-busy-road-32015769/'
  },
  timeline:[
   {at:.4,end:2.2,event:'observe',textIt:'Osserva la pioggia, la strada bagnata e il veicolo davanti',textEn:'Notice the rain, wet road and the vehicle ahead'},
   {at:2.4,end:4.4,event:'danger',textIt:'Sul bagnato aumentano gli spazi di arresto e hai meno aderenza',textEn:'On a wet road, stopping distances increase and grip is reduced'},
   {at:4.6,end:6.8,event:'rule',textIt:'Raddoppia la distanza normale: da due ad almeno quattro secondi',textEn:'Double the normal gap: from two to at least four seconds'},
   {at:7.0,end:9.8,event:'correct',textIt:'Mantieni almeno quattro secondi dal veicolo davanti finché la strada resta bagnata e scivolosa',textEn:'Keep at least four seconds behind the vehicle ahead while the road remains wet and slippery'}
  ],
  ui:{
   hotspot:{left:49,top:43,radiusX:29,radiusY:24,instructionIt:'TOCCA IL VEICOLO DAVANTI',instructionEn:'TAP THE VEHICLE AHEAD',ariaIt:'Tocca il veicolo che stai seguendo sulla strada bagnata',ariaEn:'Tap the vehicle you are following on the wet road'},
   phases:[
    {},
    {titleIt:'BAGNATO = PIÙ SPAZIO PER FERMARTI',titleEn:'WET ROAD = MORE STOPPING SPACE',bodyIt:'Pioggia e asfalto bagnato riducono l’aderenza. La stessa distanza usata sull’asciutto non è sufficiente.',bodyEn:'Rain and wet tarmac reduce grip. The same gap used in dry conditions is not enough.'},
    {titleIt:'RADDOPPIA: ALMENO 4 SECONDI',titleEn:'DOUBLE IT: AT LEAST 4 SECONDS',bodyIt:'In condizioni normali usi almeno due secondi. Su strada bagnata e scivolosa devi raddoppiare e lasciare almeno quattro secondi.',bodyEn:'In normal conditions use at least two seconds. On a wet and slippery road, double it and leave at least four seconds.'},
    {titleIt:'QUATTRO SECONDI MINIMI',titleEn:'FOUR SECONDS MINIMUM',bodyIt:'La risposta corretta è quattro secondi: più tempo e più spazio per reagire e frenare in sicurezza sul bagnato.',bodyEn:'The correct answer is four seconds: more time and space to react and brake safely on a wet road.'}
   ],
   phaseOptions:[
    {startRatio:0,autoplay:true,endRatio:.45},
    {startRatio:.22,freeze:true},
    {startRatio:.30,autoplay:false,endRatio:.72},
    {startRatio:.45,autoplay:false,endRatio:.94}
   ]
  },
  coach:{
   missIt:'Guarda il veicolo davanti e le condizioni della strada: sul bagnato la distanza normale deve aumentare.',
   missEn:'Look at the vehicle ahead and the road conditions: on a wet road the normal following gap must increase.',
   hitIt:'Esatto. Con strada bagnata e scivolosa raddoppia i due secondi normali e lascia almeno quattro secondi.',
   hitEn:'Correct. On a wet and slippery road, double the normal two-second gap and leave at least four seconds.'
  },
  learning:{
   correctIt:'Su una strada bagnata e scivolosa lascia almeno quattro secondi dal veicolo che precede.',
   correctEn:'On a wet and slippery road, leave at least four seconds behind the vehicle ahead.'
  }
 });



 global.ReplayEngine.registerScene({
  id:'MT_REAR_FLASHING_ALLOW_OVERTAKE_V1',
  category:'attitude',country:'MT',licenceType:'LPTV',drivingSide:'left',countryPackId:'MT-LPTV',
  sceneKey:'rearFlashingAllowOvertake',visualStatus:'final-real-footage',replayTemplate:'standard-video',
  title:'Fast vehicle approaching from behind — allow it to overtake',
  accessibilityLabel:'Traffic visible in a vehicle mirror while another car approaches from behind, teaching calm and safe response to a faster driver wanting to overtake',
  playbackRate:0.88,
  media:{
   video:'https://www.pexels.com/download/video/5446333/',
   videoSources:["https://www.pexels.com/download/video/5446333/"],
   poster:'',
   credit:'Pexels · Martina Tomšič',
   sourcePage:'https://www.pexels.com/video/over-taking-cars-view-through-rear-view-mirror-5446333/'
  },
  timeline:[
   {at:.4,end:2.1,event:'observe',textIt:'Controlla lo specchio: un veicolo arriva rapidamente da dietro e vuole superare',textEn:'Check the mirror: a vehicle is closing quickly from behind and wants to overtake'},
   {at:2.3,end:4.2,event:'danger',textIt:'Non competere: non accelerare, non frenare per intimidirlo e non impedirgli il sorpasso',textEn:'Do not compete: do not accelerate, brake-check or block the overtake'},
   {at:4.4,end:6.6,event:'rule',textIt:'Mantieni una guida prevedibile e lascia spazio perché possa passare quando è sicuro',textEn:'Drive predictably and leave room for it to pass when safe'},
   {at:6.8,end:9.6,event:'correct',textIt:'La risposta corretta è lasciare che il veicolo sorpassi in sicurezza',textEn:'The correct response is to allow the vehicle to overtake safely'}
  ],
  ui:{
   hotspot:{left:53,top:43,radiusX:30,radiusY:27,instructionIt:'TOCCA IL VEICOLO NELLO SPECCHIO',instructionEn:'TAP THE VEHICLE IN THE MIRROR',ariaIt:'Tocca il veicolo che si avvicina da dietro',ariaEn:'Tap the vehicle approaching from behind'},
   phases:[
    {},
    {titleIt:'NON TRASFORMARE LA SITUAZIONE IN UNA GARA',titleEn:'DO NOT TURN IT INTO A CONTEST',bodyIt:'Anche se stai già guidando al limite legale, non devi accelerare né ostacolare chi vuole superarti.',bodyEn:'Even if you are already at the legal limit, do not accelerate or obstruct a driver who wants to pass.'},
    {titleIt:'NIENTE BRAKE CHECK',titleEn:'NO BRAKE-CHECKING',bodyIt:'Toccare i freni per reagire al conducente dietro può aumentare il rischio di tamponamento. Mantieni velocità e traiettoria prevedibili.',bodyEn:'Braking to react to the driver behind can increase rear-end collision risk. Keep your speed and path predictable.'},
    {titleIt:'LASCIALO SORPASSARE QUANDO È SICURO',titleEn:'ALLOW IT TO OVERTAKE WHEN SAFE',bodyIt:'Non competere e non bloccare. Conserva il controllo del veicolo e lascia che l’altro conducente completi il sorpasso in sicurezza.',bodyEn:'Do not compete or block. Keep control and allow the other driver to complete the overtake safely.'}
   ],
   phaseOptions:[
    {startRatio:0,autoplay:true,endRatio:.42},
    {startRatio:.20,freeze:true},
    {startRatio:.34,autoplay:false,endRatio:.70},
    {startRatio:.48,autoplay:false,endRatio:.94}
   ]
  },
  coach:{
   missIt:'Guarda lo specchio: il punto chiave è il veicolo che arriva rapidamente da dietro e vuole superare.',
   missEn:'Look at the mirror: the key hazard is the vehicle closing quickly from behind and wanting to overtake.',
   hitIt:'Esatto. Non competere, non frenare per reazione e non bloccarlo: lascia che sorpassi quando è sicuro.',
   hitEn:'Correct. Do not compete, brake in retaliation or block it: allow it to overtake when safe.'
  },
  learning:{
   correctIt:'Se un veicolo arriva rapidamente da dietro lampeggiando mentre sei al limite legale, non competere: lascialo sorpassare quando è sicuro.',
   correctEn:'If a vehicle closes quickly from behind flashing while you are at the legal speed limit, do not compete: allow it to overtake when safe.'
  }
 });

})(window);
