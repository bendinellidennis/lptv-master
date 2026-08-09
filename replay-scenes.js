
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
   poster:'https://images.pexels.com/videos/5446333/pexels-photo-5446333.jpeg?auto=compress&dpr=1&h=750&w=1260',
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


 global.ReplayEngine.registerScene({
  id:'MT_NEVER_EXCEED_SPEED_LIMIT_V1',
  category:'attitude',country:'MT',licenceType:'LPTV',drivingSide:'left',countryPackId:'MT-LPTV',
  sceneKey:'neverExceedSpeedLimit',visualStatus:'final-real-footage',replayTemplate:'standard-video',
  title:'Maximum speed limit — never exceed it',
  accessibilityLabel:'Driver view on a highway with dashboard and speedometer visible, teaching that the maximum speed limit must never be exceeded, including while overtaking',
  playbackRate:0.9,
  media:{
   video:'https://www.pexels.com/download/video/5927764/',
   videoSources:["https://www.pexels.com/download/video/5927764/"],
   poster:'https://images.pexels.com/videos/5927764/airport-automobile-car-car-interior-5927764.jpeg?auto=compress&dpr=1&h=750&w=1260',
   credit:'Pexels · Christopher Schultz',
   sourcePage:'https://www.pexels.com/video/driving-on-a-highway-5927764/'
  },
  timeline:[
   {at:.4,end:2.2,event:'observe',textIt:'Osserva la strada e il tachimetro: il limite indicato è il massimo consentito',textEn:'Watch the road and speedometer: the posted limit is the maximum permitted speed'},
   {at:2.4,end:4.4,event:'danger',textIt:'Strada libera o sorpasso non trasformano il limite massimo in un valore facoltativo',textEn:'A clear road or an overtake does not make the maximum speed limit optional'},
   {at:4.6,end:6.8,event:'rule',textIt:'Durante un sorpasso devi pianificare la manovra senza superare il limite massimo',textEn:'When overtaking, plan the manoeuvre without exceeding the maximum speed limit'},
   {at:7.0,end:9.8,event:'correct',textIt:'Risposta corretta: non è mai consentito superare il limite massimo di velocità',textEn:'Correct answer: you are never permitted to exceed the maximum speed limit'}
  ],
  ui:{
   hotspot:{left:50,top:72,radiusX:29,radiusY:19,instructionIt:'TOCCA IL TACHIMETRO / LA STRADA',instructionEn:'TAP THE SPEEDOMETER / ROAD',ariaIt:'Tocca il tachimetro o la strada davanti',ariaEn:'Tap the speedometer or road ahead'},
   phases:[
    {},
    {titleIt:'IL LIMITE È UN MASSIMO, NON UN OBIETTIVO',titleEn:'THE LIMIT IS A MAXIMUM, NOT A TARGET',bodyIt:'Puoi dover guidare più lentamente per traffico, visibilità o condizioni della strada, ma non più velocemente del limite massimo.',bodyEn:'You may need to drive slower for traffic, visibility or road conditions, but not faster than the maximum limit.'},
    {titleIt:'NEANCHE DURANTE UN SORPASSO',titleEn:'NOT EVEN WHILE OVERTAKING',bodyIt:'Il sorpasso deve essere iniziato solo quando può essere completato in sicurezza restando entro il limite. Se serve superarlo, non è il momento giusto per sorpassare.',bodyEn:'Start an overtake only when it can be completed safely within the limit. If exceeding it would be necessary, it is not the right moment to overtake.'},
    {titleIt:'RISPOSTA: MAI',titleEn:'ANSWER: AT NO TIME',bodyIt:'La risposta corretta è “Mai”. Strada libera, orario o sorpasso non autorizzano a superare il limite massimo.',bodyEn:'The correct answer is “At no time”. A clear road, time of day or overtaking does not permit exceeding the maximum speed limit.'}
   ],
   phaseOptions:[
    {startRatio:0,autoplay:true,endRatio:.42},
    {startRatio:.20,freeze:true},
    {startRatio:.34,autoplay:false,endRatio:.72},
    {startRatio:.50,autoplay:false,endRatio:.95}
   ]
  },
  coach:{
   missIt:'Guarda il tachimetro e pensa alla parola “massimo”: la domanda chiede se esiste un caso in cui puoi superare quel limite.',
   missEn:'Look at the speedometer and focus on the word “maximum”: the question asks whether there is any situation in which you may exceed that limit.',
   hitIt:'Esatto. Il limite massimo non si supera, neppure durante un sorpasso. Se non puoi completare la manovra entro il limite, aspetta.',
   hitEn:'Correct. The maximum speed limit must not be exceeded, even while overtaking. If you cannot complete the manoeuvre within the limit, wait.'
  },
  learning:{
   correctIt:'Non è mai consentito superare il limite massimo di velocità; anche un sorpasso deve essere completato restando entro il limite.',
   correctEn:'You are never permitted to exceed the maximum speed limit; even an overtake must be completed while remaining within the limit.'
  }
 });


 global.ReplayEngine.registerScene({
  id:'MT_BLUE_FLASHING_BEACONS_V2',
  category:'emergency-vehicles',country:'MT',licenceType:'LPTV',drivingSide:'left',countryPackId:'MT-LPTV',
  sceneKey:'blueFlashingBeacons',visualStatus:'final-real-footage',replayTemplate:'standard-video',
  title:'Blue flashing beacons — police and ambulance',
  accessibilityLabel:'Police and emergency vehicles with blue flashing lights, followed by an ambulance, teaching the two correct answers',
  playbackRate:0.9,
  media:{
   video:'https://videos.pexels.com/video-files/10029631/10029631-hd_1920_1080_24fps.mp4',
   videoSources:[
    'https://videos.pexels.com/video-files/10029631/10029631-hd_1920_1080_24fps.mp4',
    'https://www.pexels.com/download/video/10029631/'
   ],
   poster:'https://images.pexels.com/videos/10029631/free-video-10029631.jpg?auto=compress&dpr=1&h=750&w=1260',
   credit:'Pexels · Connor Kane',
   sourcePage:'https://www.pexels.com/video/police-car-lights-at-night-10029631/'
  },
  timeline:[
   {at:.4,end:2.2,event:'observe',textIt:'Osserva i lampeggianti blu sui veicoli di emergenza',textEn:'Observe the blue flashing lights on the emergency vehicles'},
   {at:2.4,end:4.4,event:'identify',textIt:'Prima risposta corretta: Pattuglia di polizia',textEn:'First correct answer: Police patrol'},
   {at:4.6,end:6.8,event:'identify',textIt:'Seconda risposta corretta: Ambulanza',textEn:'Second correct answer: Ambulance'},
   {at:7.0,end:9.8,event:'correct',textIt:'Ricorda: POLIZIA + AMBULANZA',textEn:'Remember: POLICE + AMBULANCE'}
  ],
  ui:{
   hotspot:{left:50,top:45,radiusX:38,radiusY:30,instructionIt:'TOCCA I LAMPEGGIANTI BLU',instructionEn:'TAP THE BLUE FLASHING LIGHTS',ariaIt:'Tocca i lampeggianti blu dei veicoli di emergenza',ariaEn:'Tap the emergency vehicle blue flashing lights'},
   phases:[
    {},
    {titleIt:'1ª RISPOSTA: PATTUGLIA DI POLIZIA',titleEn:'1st ANSWER: POLICE PATROL',bodyIt:'I veicoli della polizia impegnati in un intervento possono utilizzare lampeggianti blu.',bodyEn:'Police vehicles responding to an incident may use blue flashing beacons.'},
    {titleIt:'2ª RISPOSTA: AMBULANZA',titleEn:'2nd ANSWER: AMBULANCE',bodyIt:'Anche l’ambulanza in servizio di emergenza usa lampeggianti blu.',bodyEn:'An ambulance on emergency response also uses blue flashing beacons.'},
    {titleIt:'SELEZIONA: POLIZIA + AMBULANZA',titleEn:'SELECT: POLICE + AMBULANCE',bodyIt:'La domanda richiede due risposte: Pattuglia di polizia e Ambulanza.',bodyEn:'The question requires two answers: Police patrol and Ambulance.'}
   ],
   phaseMedia:[
    null,
    null,
    {
     video:'https://videos.pexels.com/video-files/3940427/3940427-hd_1920_1080_30fps.mp4',
     videoSources:[
      'https://videos.pexels.com/video-files/3940427/3940427-hd_1920_1080_30fps.mp4',
      'https://www.pexels.com/download/video/3940427/'
     ],
     poster:'https://images.pexels.com/videos/3940427/free-video-3940427.jpg?auto=compress&dpr=1&h=750&w=1260',
     credit:'Pexels · CityXcape',
     sourcePage:'https://www.pexels.com/video/emergency-medicine-paramedic-emergency-lights-3940427/'
    },
    {
     video:'https://videos.pexels.com/video-files/3940427/3940427-hd_1920_1080_30fps.mp4',
     videoSources:[
      'https://videos.pexels.com/video-files/3940427/3940427-hd_1920_1080_30fps.mp4',
      'https://www.pexels.com/download/video/3940427/'
     ],
     poster:'https://images.pexels.com/videos/3940427/free-video-3940427.jpg?auto=compress&dpr=1&h=750&w=1260',
     credit:'Pexels · CityXcape',
     sourcePage:'https://www.pexels.com/video/emergency-medicine-paramedic-emergency-lights-3940427/'
    }
   ],
   phaseOptions:[
    {startRatio:0,autoplay:true,endRatio:.45},
    {startRatio:.18,freeze:true},
    {startRatio:0,autoplay:true,endRatio:.72},
    {startRatio:.28,autoplay:false,endRatio:.88}
   ]
  },
  coach:{
   missIt:'Concentrati sul tipo di veicolo e sul lampeggiante: devi riconoscere due servizi di emergenza.',
   missEn:'Focus on the vehicle type and flashing light: you must identify two emergency services.',
   hitIt:'Esatto. Le due risposte sono Pattuglia di polizia e Ambulanza.',
   hitEn:'Correct. The two answers are Police patrol and Ambulance.'
  },
  learning:{
   correctIt:'Per questa domanda seleziona Pattuglia di polizia e Ambulanza.',
   correctEn:'For this question select Police patrol and Ambulance.'
  }
 });


 global.ReplayEngine.registerScene({
  id:'MT_AMBULANCE_FOLLOWING_MAKE_WAY_V1',
  category:'emergency-vehicles',country:'MT',licenceType:'LPTV',drivingSide:'left',countryPackId:'MT-LPTV',
  sceneKey:'ambulanceFollowingMakeWay',visualStatus:'final-real-footage',replayTemplate:'standard-video',
  title:'Ambulance following — make way safely',
  accessibilityLabel:'An ambulance moving through traffic while other vehicles make space, teaching the driver to pull over safely and let it pass',
  playbackRate:0.9,
  media:{
   video:'https://videos.pexels.com/video-files/5514366/5514366-uhd_3840_2160_24fps.mp4',
   videoSources:[
    'https://videos.pexels.com/video-files/5514366/5514366-uhd_3840_2160_24fps.mp4',
    'https://www.pexels.com/download/video/5514366/'
   ],
   poster:'https://images.pexels.com/videos/5514366/pexels-photo-5514366.jpeg?auto=compress&dpr=1&h=750&w=1260',
   credit:'Pexels · K',
   sourcePage:'https://www.pexels.com/video/vehicle-stops-for-an-ambulance-passing-through-city-traffic-5514366/'
  },
  timeline:[
   {at:.4,end:2.4,event:'observe',textIt:'Osserva l’ambulanza che deve avanzare nel traffico',textEn:'Observe the ambulance needing to move through traffic'},
   {at:2.6,end:4.8,event:'hazard',textIt:'Non frenare bruscamente: potresti creare un altro pericolo',textEn:'Do not brake harshly: you could create another hazard'},
   {at:5.0,end:7.2,event:'explain',textIt:'Controlla intorno a te e cerca uno spazio sicuro per accostare',textEn:'Check around you and look for a safe place to pull over'},
   {at:7.4,end:10.2,event:'correct',textIt:'Accosta appena è possibile in sicurezza e lascia passare l’ambulanza',textEn:'Pull over as soon as safely possible and let the ambulance pass'}
  ],
  ui:{
   hotspot:{left:50,top:48,radiusX:40,radiusY:32,instructionIt:'TOCCA L’AMBULANZA',instructionEn:'TAP THE AMBULANCE',ariaIt:'Tocca l’ambulanza che deve passare',ariaEn:'Tap the ambulance that needs to pass'},
   phases:[
    {},
    {titleIt:'NON CREARE UN SECONDO PERICOLO',titleEn:'DO NOT CREATE A SECOND HAZARD',bodyIt:'Evita frenate brusche o manovre improvvise. Prima controlla specchi e spazio disponibile.',bodyEn:'Avoid harsh braking or sudden manoeuvres. First check your mirrors and the available space.'},
    {titleIt:'LASCIA STRADA, MA IN SICUREZZA',titleEn:'MAKE WAY, BUT SAFELY',bodyIt:'Un mezzo di emergenza deve poter passare, ma la tua manovra deve restare controllata e prevedibile.',bodyEn:'An emergency vehicle must be allowed through, but your manoeuvre must remain controlled and predictable.'},
    {titleIt:'ACCOSTA APPENA È SICURO',titleEn:'PULL OVER WHEN SAFE',bodyIt:'La risposta corretta è accostare appena è possibile in sicurezza e lasciare passare l’ambulanza.',bodyEn:'The correct answer is to pull over as soon as safely possible and let the ambulance pass.'}
   ],
   phaseOptions:[
    {startRatio:0,autoplay:true,endRatio:.42},
    {startRatio:.18,freeze:true},
    {startRatio:.28,autoplay:false,endRatio:.76},
    {startRatio:.45,autoplay:false,endRatio:.95}
   ]
  },
  coach:{
   missIt:'Non concentrarti solo sul lampeggiante. La domanda chiede come liberare il passaggio senza causare un altro rischio.',
   missEn:'Do not focus only on the flashing light. The question asks how to clear the way without causing another risk.',
   hitIt:'Esatto. Controlla, accosta appena è sicuro e lascia passare l’ambulanza. Mai frenare bruscamente o accelerare per allontanarti.',
   hitEn:'Correct. Check, pull over when safe and let the ambulance pass. Never brake harshly or accelerate away.'
  },
  learning:{
   correctIt:'Quando un’ambulanza con lampeggiante blu ti segue, accosta appena è possibile in sicurezza per lasciarla passare.',
   correctEn:'When an ambulance with a flashing blue light is following you, pull over as soon as safely possible to let it pass.'
  }
 });


global.ReplayEngine.registerScene({
 id:'MT_BUS_RIGHT_SIGNAL_GIVE_WAY_V2',
 category:'buses',country:'MT',licenceType:'LPTV',drivingSide:'left',countryPackId:'MT-LPTV',
 sceneKey:'busRightSignalGiveWay',visualStatus:'final-real-footage',replayTemplate:'standard-video',
 title:'Bus at stop signalling right — slow down and give way if safe',
 accessibilityLabel:'A bus stopped at a bus stop in left-driving traffic, followed by a close view of a flashing amber right indicator, teaching the driver to slow down and give way if safe when the bus signals to pull out',
 playbackRate:0.9,
 media:{
  video:'https://videos.pexels.com/video-files/2950082/2950082-uhd_3840_2160_30fps.mp4',
  videoSources:[
   'https://videos.pexels.com/video-files/2950082/2950082-uhd_3840_2160_30fps.mp4',
   'https://www.pexels.com/download/video/2950082/'
  ],
  poster:'https://images.pexels.com/videos/2950082/free-video-2950082.jpg?auto=compress&dpr=1&h=750&w=1260',
  credit:'Pexels · George Morina',
  sourcePage:'https://www.pexels.com/video/passenger-bus-making-a-stop-on-designated-bus-stops-2950082/'
 },
 timeline:[
  {at:.4,end:2.6,event:'observe',textIt:'Individua l’autobus fermo alla fermata davanti a te',textEn:'Identify the bus stopped at the bus stop ahead'},
  {at:2.8,end:5.0,event:'hazard',textIt:'La freccia destra significa che l’autobus vuole rientrare nel traffico',textEn:'The right indicator means the bus intends to pull back into traffic'},
  {at:5.2,end:7.4,event:'explain',textIt:'Rallenta e non tentare di passarlo mentre sta iniziando la manovra',textEn:'Slow down and do not try to pass while it is beginning the manoeuvre'},
  {at:7.6,end:10.5,event:'correct',textIt:'Se è sicuro, resta indietro e dagli precedenza per uscire dalla fermata',textEn:'If it is safe, hold back and give way so it can leave the stop'}
 ],
 ui:{
  hotspot:{left:67,top:47,radiusX:30,radiusY:28,instructionIt:'TOCCA L’AUTOBUS / FRECCIA DESTRA',instructionEn:'TAP THE BUS / RIGHT INDICATOR',ariaIt:'Tocca l’autobus fermo che segnala a destra',ariaEn:'Tap the stopped bus signalling right'},
  phases:[
   {},
   {titleIt:'FERMATA + FRECCIA DESTRA',titleEn:'BUS STOP + RIGHT INDICATOR',bodyIt:'Il segnale importante non è semplicemente “c’è un autobus”: è un autobus fermo alla fermata che aziona la freccia destra per rientrare nella corsia.',bodyEn:'The important cue is not simply “there is a bus”: it is a bus stopped at the stop using its right indicator to re-enter the lane.'},
   {titleIt:'RALLENTA E LASCIA SPAZIO',titleEn:'SLOW DOWN AND LEAVE SPACE',bodyIt:'Riduci la velocità e non affiancarti mentre l’autobus sta iniziando a uscire. Devi mantenere una situazione prevedibile e controllata.',bodyEn:'Reduce speed and do not draw alongside as the bus begins to move out. Keep the situation predictable and controlled.'},
   {titleIt:'DAI PRECEDENZA SE È SICURO',titleEn:'GIVE WAY IF SAFE',bodyIt:'La risposta corretta è rallentare e dare precedenza all’autobus se puoi farlo in sicurezza.',bodyEn:'The correct answer is to slow down and give way to the bus if it is safe to do so.'}
  ],
  phaseMedia:[
   null,
   {
    video:'https://videos.pexels.com/video-files/32084102/13676479_3840_2160_60fps.mp4',
    videoSources:[
     'https://videos.pexels.com/video-files/32084102/13676479_3840_2160_60fps.mp4',
     'https://www.pexels.com/download/video/32084102/'
    ],
    poster:'https://images.pexels.com/videos/32084102/free-video-32084102.jpg?auto=compress&dpr=1&h=750&w=1260',
    credit:'Pexels · Rec Everywhere',
    sourcePage:'https://www.pexels.com/video/automotive-turn-signal-demonstration-video-32084102/'
   },
   null,
   null
  ],
  phaseOptions:[
   {startRatio:0,autoplay:true,endRatio:.42},
   {startRatio:0,autoplay:true,endRatio:.72},
   {startRatio:.20,freeze:true},
   {startRatio:.32,autoplay:false,endRatio:.88}
  ]
 },
 coach:{
  missIt:'Guarda la situazione completa: autobus fermo alla fermata + freccia destra. Quel segnale indica che sta per rientrare nel traffico.',
  missEn:'Read the whole situation: bus stopped at the stop + right indicator. That signal means it is about to re-enter traffic.',
  hitIt:'Esatto. Rallenta, resta indietro e dagli precedenza se è sicuro. Non suonare il clacson e non lampeggiare per forzare il passaggio.',
  hitEn:'Correct. Slow down, hold back and give way if safe. Do not sound the horn or flash your headlights to force your way through.'
 },
 learning:{
  correctIt:'Autobus alla fermata con freccia destra: rallenta e dagli precedenza se è sicuro.',
  correctEn:'Bus at a stop signalling right: slow down and give way if it is safe.'
 }
});

global.ReplayEngine.registerScene({
 id:'MT_UNDERINFLATED_STEERING_BRAKING_V1',
 category:'vehicle-safety',country:'MT',licenceType:'LPTV',drivingSide:'left',countryPackId:'MT-LPTV',
 sceneKey:'underInflatedSteeringBraking',visualStatus:'final-real-footage',replayTemplate:'standard-video',
 title:'Under-inflated tyres — steering and braking',
 accessibilityLabel:'Real tyre pressure check followed by steering and braking examples to teach the two controls adversely affected by under-inflated tyres',
 playbackRate:0.9,
 media:{
  video:'https://www.pexels.com/download/video/8470711/',
  videoSources:['https://www.pexels.com/download/video/8470711/'],
  poster:'https://images.pexels.com/videos/8470711/free-video-8470711.jpg?auto=compress&dpr=1&h=750&w=1260',
  credit:'Pexels · Anastasia Shuraeva',
  sourcePage:'https://www.pexels.com/video/person-checking-tire-pressure-8470711/'
 },
 timeline:[
  {at:.4,end:2.4,event:'observe',textIt:'Controlla la pressione: uno pneumatico sotto-gonfiato si deforma più del previsto',textEn:'Check tyre pressure: an under-inflated tyre deforms more than intended'},
  {at:2.6,end:4.6,event:'hazard',textIt:'Con poca pressione il pneumatico risponde peggio alle richieste del conducente',textEn:'With low pressure the tyre responds less effectively to driver inputs'},
  {at:4.8,end:6.8,event:'explain',textIt:'Le due funzioni da ricordare sono STERZO e FRENATA',textEn:'The two functions to remember are STEERING and BRAKING'},
  {at:7.0,end:10.5,event:'correct',textIt:'Pressione corretta = risposta dello sterzo più precisa e frenata più efficace',textEn:'Correct pressure = more precise steering response and more effective braking'}
 ],
 ui:{
  staticUntilFinal:true,
  hotspot:{left:48,top:55,radiusX:30,radiusY:30,instructionIt:'TOCCA IL PNEUMATICO / MANOMETRO',instructionEn:'TAP THE TYRE / GAUGE',ariaIt:'Tocca il pneumatico o il manometro della pressione',ariaEn:'Tap the tyre or tyre-pressure gauge'},
  phases:[
   {},
   {titleIt:'PRESSIONE TROPPO BASSA',titleEn:'PRESSURE TOO LOW',bodyIt:'Uno pneumatico sotto-gonfiato si flette e lavora fuori dalla pressione prevista: la risposta del veicolo peggiora.',bodyEn:'An under-inflated tyre flexes and operates below its intended pressure, reducing vehicle response.'},
   {titleIt:'STERZO + FRENATA',titleEn:'STEERING + BRAKING',bodyIt:'Memorizza la coppia esatta richiesta dall’esame: la bassa pressione peggiora la risposta dello STERZO e le prestazioni di FRENATA.',bodyEn:'Remember the exact pair required by the test: low pressure impairs STEERING response and BRAKING performance.'},
   {titleIt:'MANTIENI LA PRESSIONE CORRETTA',titleEn:'KEEP THE CORRECT PRESSURE',bodyIt:'Controlla regolarmente la pressione: pneumatici correttamente gonfiati aiutano il veicolo a sterzare e frenare come previsto.',bodyEn:'Check pressure regularly: correctly inflated tyres help the vehicle steer and brake as intended.'}
  ],
  phaseMedia:[null,null,{
   video:'https://www.pexels.com/download/video/27445074/',
   videoSources:['https://www.pexels.com/download/video/27445074/'],
   poster:'https://images.pexels.com/videos/27445074/free-video-27445074.jpg?auto=compress&dpr=1&h=750&w=1260',
   credit:'Pexels · Furkan Elveren',
   sourcePage:'https://www.pexels.com/video/a-person-is-driving-a-car-with-their-hands-on-the-steering-wheel-27445074/'
  },{
   video:'https://www.pexels.com/download/video/15565206/',
   videoSources:['https://www.pexels.com/download/video/15565206/'],
   poster:'https://images.pexels.com/videos/15565206/free-video-15565206.jpg?auto=compress&dpr=1&h=750&w=1260',
   credit:'Pexels · Martyn Day',
   sourcePage:'https://www.pexels.com/video/cars-stopping-at-a-traffic-light-at-night-15565206/'
  }],
  phaseOptions:[
   {startRatio:.18,freeze:true},
   {startRatio:.42,freeze:true},
   {startRatio:.28,freeze:true},
   {startRatio:.10,autoplay:true,endRatio:.78}
  ]
 },
 coach:{
  missIt:'Non pensare a parcheggio o cambio marcia. Con pressione bassa peggiorano due funzioni direttamente legate al contatto pneumatico-strada: sterzo e frenata.',
  missEn:'Do not choose parking or gear changing. Low pressure affects two functions directly linked to tyre-road contact: steering and braking.',
  hitIt:'Esatto: STERZO e FRENATA. Sono le due risposte da associare immediatamente agli pneumatici sotto-gonfiati.',
  hitEn:'Correct: STEERING and BRAKING. These are the two answers to associate immediately with under-inflated tyres.'
 },
 learning:{
  correctIt:'Pneumatici sgonfi: peggiorano sterzo e frenata.',
  correctEn:'Under-inflated tyres adversely affect steering and braking.'
 }
});


global.ReplayEngine.registerScene({
 id:'MT_TYRE_PRESSURE_WEEKLY_CHECK_V1',
 category:'vehicle-safety',country:'MT',licenceType:'LPTV',drivingSide:'left',countryPackId:'MT-LPTV',
 sceneKey:'tyrePressureWeeklyCheck',visualStatus:'final-real-footage',replayTemplate:'standard-video',
 title:'Tyre pressure — check at least once a week',
 accessibilityLabel:'Real close-up of a tyre pressure gauge during a pressure measurement, teaching the minimum weekly tyre-pressure check',
 playbackRate:0.9,
 media:{
  video:'https://www.pexels.com/download/video/5637839/',
  videoSources:['https://www.pexels.com/download/video/5637839/'],
  poster:'https://images.pexels.com/videos/5637839/free-video-5637839.jpg?auto=compress&dpr=1&h=750&w=1260',
  credit:'Pexels · Tima Miroshnichenko',
  sourcePage:'https://www.pexels.com/video/close-up-of-a-tire-pressure-gauge-5637839/'
 },
 timeline:[
  {at:.4,end:2.2,event:'observe',textIt:'Guarda il manometro: la pressione degli pneumatici va controllata regolarmente',textEn:'Look at the gauge: tyre pressures need regular checking'},
  {at:2.4,end:4.4,event:'hazard',textIt:'Aspettare il tagliando o il VRT è troppo tardi per un controllo di sicurezza ordinario',textEn:'Waiting for a service or VRT is too long for a routine safety check'},
  {at:4.6,end:6.8,event:'explain',textIt:'Per l’esame ricorda la frequenza minima: UNA VOLTA ALLA SETTIMANA',textEn:'For the test remember the minimum frequency: ONCE A WEEK'},
  {at:7.0,end:10.5,event:'correct',textIt:'Controllo settimanale: misura la pressione e correggila secondo i valori previsti dal veicolo',textEn:'Weekly check: measure tyre pressure and correct it to the vehicle’s specified values'}
 ],
 ui:{
  staticUntilFinal:true,
  hotspot:{left:51,top:52,radiusX:30,radiusY:30,instructionIt:'TOCCA IL MANOMETRO',instructionEn:'TAP THE PRESSURE GAUGE',ariaIt:'Tocca il manometro della pressione',ariaEn:'Tap the tyre-pressure gauge'},
  phases:[
   {},
   {titleIt:'NON ASPETTARE TROPPO',titleEn:'DO NOT WAIT TOO LONG',bodyIt:'La pressione può cambiare tra un tagliando e l’altro. Il controllo deve essere molto più frequente.',bodyEn:'Tyre pressure can change between services. The check must be much more frequent.'},
   {titleIt:'UNA VOLTA ALLA SETTIMANA',titleEn:'ONCE A WEEK',bodyIt:'Memorizza la risposta esatta: la pressione degli pneumatici va controllata almeno una volta alla settimana.',bodyEn:'Remember the exact answer: tyre pressures should be checked at least once a week.'},
   {titleIt:'CONTROLLO REGOLARE',titleEn:'REGULAR CHECK',bodyIt:'Usa un manometro e controlla regolarmente la pressione: aiuta sicurezza, comportamento del veicolo ed efficienza.',bodyEn:'Use a pressure gauge and check regularly: it supports safety, vehicle behaviour and efficiency.'}
  ],
  phaseOptions:[
   {startRatio:.18,freeze:true},
   {startRatio:.38,freeze:true},
   {startRatio:.58,freeze:true},
   {startRatio:.12,autoplay:true,endRatio:.82}
  ]
 },
 coach:{
  missIt:'Non aspettare VRT o tagliando. Per questa domanda la frequenza minima da ricordare è una volta alla settimana.',
  missEn:'Do not wait for the VRT or a service. For this question the minimum frequency to remember is once a week.',
  hitIt:'Esatto: almeno UNA VOLTA ALLA SETTIMANA. È la frequenza minima richiesta dalla domanda.',
  hitEn:'Correct: at least ONCE A WEEK. That is the minimum frequency required by the question.'
 },
 learning:{
  correctIt:'Pressione pneumatici: controllala almeno una volta alla settimana.',
  correctEn:'Tyre pressures: check them at least once a week.'
 }
});


global.ReplayEngine.registerScene({
 id:'MT_DIPPED_HEADLIGHTS_POOR_VISIBILITY_V1',
 category:'vehicle-lighting',country:'MT',licenceType:'LPTV',drivingSide:'left',countryPackId:'MT-LPTV',
 sceneKey:'dippedHeadlightsPoorVisibility',visualStatus:'final-real-footage',replayTemplate:'standard-video',
 title:'Dipped headlights — poor visibility during the day',
 accessibilityLabel:'Driver point of view through dense daytime fog with severely reduced road visibility',
 playbackRate:0.9,
 media:{
  video:'https://videos.pexels.com/video-files/27861399/12246686_1920_1080_30fps.mp4',
  videoSources:['https://videos.pexels.com/video-files/27861399/12246686_1920_1080_30fps.mp4'],
  poster:'https://images.pexels.com/videos/27861399/pexels-photo-27861399.jpeg?auto=compress&dpr=1&h=750&w=1260',
  credit:'Pexels · Nothing Ahead',
  sourcePage:'https://www.pexels.com/video/a-man-driving-a-car-through-a-foggy-city-27861399/'
 },
 timeline:[
  {at:.5,end:2.4,event:'observe',textIt:'Guarda attraverso il parabrezza: è giorno, ma la nebbia riduce fortemente la visibilità',textEn:'Look through the windscreen: it is daytime, but fog severely reduces visibility'},
  {at:2.6,end:4.8,event:'hazard',textIt:'Con scarsa visibilità gli altri utenti possono vederti troppo tardi',textEn:'In poor visibility other road users may see you too late'},
  {at:5.0,end:7.4,event:'explain',textIt:'Durante il giorno usa gli ANABBAGLIANTI quando la visibilità è scarsa',textEn:'During the day use DIPPED HEADLIGHTS when visibility is poor'},
  {at:7.6,end:11.5,event:'correct',textIt:'Nebbia, pioggia intensa o condizioni simili: renditi visibile con gli anabbaglianti senza abbagliare',textEn:'Fog, heavy rain or similar conditions: use dipped headlights to be seen without dazzling'}
 ],
 ui:{
  staticUntilFinal:true,
  hotspot:{left:52,top:46,radiusX:36,radiusY:31,instructionIt:'TOCCA LA STRADA NELLA NEBBIA',instructionEn:'TAP THE FOGGY ROAD',ariaIt:'Tocca la zona di scarsa visibilità davanti al veicolo',ariaEn:'Tap the area of poor visibility ahead'},
  phases:[
   {},
   {titleIt:'VISIBILITÀ RIDOTTA',titleEn:'REDUCED VISIBILITY',bodyIt:'Anche di giorno, nebbia e condizioni simili possono rendere difficile vedere ed essere visti.',bodyEn:'Even during daylight, fog and similar conditions can make it difficult to see and be seen.'},
   {titleIt:'USA GLI ANABBAGLIANTI',titleEn:'USE DIPPED HEADLIGHTS',bodyIt:'La risposta da ricordare è precisa: durante il giorno gli anabbaglianti vanno usati in condizioni di scarsa visibilità.',bodyEn:'Remember the exact answer: during the day dipped headlights must be used in poor visibility.'},
   {titleIt:'VEDERE ED ESSERE VISTI',titleEn:'SEE AND BE SEEN',bodyIt:'Gli anabbaglianti migliorano la tua visibilità agli altri senza l’abbagliamento causato dalle luci più intense.',bodyEn:'Dipped headlights improve your visibility to others without the glare caused by stronger lights.'}
  ],
  phaseOptions:[
   {startRatio:.16,freeze:true},
   {startRatio:.36,freeze:true},
   {startRatio:.56,freeze:true},
   {startRatio:.10,autoplay:true,endRatio:.84}
  ]
 },
 coach:{
  missIt:'Non sempre e non solo nelle strade strette. La situazione chiave è la scarsa visibilità.',
  missEn:'Not all the time and not just on narrow streets. The key situation is poor visibility.',
  hitIt:'Esatto: durante il giorno usa gli anabbaglianti quando la visibilità è scarsa.',
  hitEn:'Correct: during the day use dipped headlights when visibility is poor.'
 },
 learning:{
  correctIt:'Di giorno: anabbaglianti in condizioni di scarsa visibilità.',
  correctEn:'During the day: dipped headlights in poor visibility.'
 }
});

global.ReplayEngine.registerScene({
 id:'MT_HORN_ALERT_PRESENCE_V1',
 category:'signals',country:'MT',licenceType:'LPTV',drivingSide:'left',countryPackId:'MT-LPTV',
 sceneKey:'hornAlertPresence',visualStatus:'final-real-footage',replayTemplate:'standard-video',
 title:'Horn — alert others to your presence',
 accessibilityLabel:'Driver approaching a winding road with limited view, learning that the horn is used briefly to warn other road users of the vehicle presence',
 playbackRate:0.9,
 media:{
  video:'https://www.pexels.com/download/video/12365082/',
  videoSources:['https://www.pexels.com/download/video/12365082/'],
  poster:'https://images.pexels.com/videos/12365082/free-video-12365082.jpg?auto=compress&dpr=1&h=750&w=1260',
  credit:'Pexels · Dimitri Baret',
  sourcePage:'https://www.pexels.com/video/point-of-view-of-a-car-driving-on-a-mountain-road-12365082/'
 },
 timeline:[
  {at:.4,end:2.4,event:'observe',textIt:'Osserva la strada davanti: la visuale oltre la curva è limitata',textEn:'Observe the road ahead: the view beyond the bend is limited'},
  {at:2.6,end:4.6,event:'hazard',textIt:'Un altro utente potrebbe non sapere che stai arrivando',textEn:'Another road user may not know that you are approaching'},
  {at:4.8,end:6.8,event:'explain',textIt:'Il clacson serve ad avvisare gli altri della tua presenza',textEn:'The horn is used to alert others to your presence'},
  {at:7.0,end:10.5,event:'correct',textIt:'Usalo brevemente come avvertimento, non per rabbia, saluto o precedenza',textEn:'Use it briefly as a warning, not for anger, greeting, or claiming priority'}
 ],
 ui:{
  staticUntilFinal:true,
  hotspot:{left:52,top:46,radiusX:34,radiusY:30,instructionIt:'TOCCA LA ZONA A VISUALE LIMITATA',instructionEn:'TAP THE LIMITED-VIEW AREA',ariaIt:'Tocca la curva o la zona con visuale limitata',ariaEn:'Tap the bend or limited-view area'},
  phases:[
   {},
   {titleIt:'PRESENZA NON VISIBILE',titleEn:'YOUR PRESENCE MAY BE UNSEEN',bodyIt:'Il pericolo non è “la curva” in sé: è che un altro utente possa non vederti o non sapere che stai arrivando.',bodyEn:'The hazard is not the bend itself: another road user may not see you or know you are approaching.'},
   {titleIt:'IL CLACSON È UN AVVERTIMENTO',titleEn:'THE HORN IS A WARNING',bodyIt:'La funzione corretta del clacson è segnalare la tua presenza agli altri utenti quando serve per la sicurezza.',bodyEn:'The correct purpose of the horn is to alert other road users to your presence when safety requires it.'},
   {titleIt:'AVVISA, NON IMPORRE',titleEn:'WARN, DO NOT DEMAND',bodyIt:'Un breve colpo di clacson può avvisare della tua presenza. Non usarlo per esprimere rabbia, salutare o pretendere la precedenza.',bodyEn:'A brief horn warning can alert others to your presence. Do not use it to show anger, greet someone, or demand priority.'}
  ],
  phaseMedia:[null,null,null,{
   video:'https://www.pexels.com/download/video/4607429/',
   videoSources:['https://www.pexels.com/download/video/4607429/'],
   poster:'https://images.pexels.com/videos/4607429/free-video-4607429.jpg?auto=compress&dpr=1&h=750&w=1260',
   credit:'Pexels · cottonbro studio',
   sourcePage:'https://www.pexels.com/video/a-man-is-driving-a-car-with-his-hands-on-the-steering-wheel-4607429/'
  }],
  phaseOptions:[
   {startRatio:.20,freeze:true},
   {startRatio:.38,freeze:true},
   {startRatio:.52,freeze:true},
   {startRatio:.15,autoplay:false,endRatio:.85}
  ]
 },
 coach:{
  missIt:'Guarda il motivo di sicurezza: il clacson serve a far sapere agli altri che sei presente quando potrebbero non vederti.',
  missEn:'Focus on the safety purpose: the horn tells other road users you are there when they may not see you.',
  hitIt:'Esatto. Il clacson è un avvertimento di presenza, non uno strumento per rabbia, saluti o per ottenere precedenza.',
  hitEn:'Correct. The horn is a presence warning, not a tool for anger, greetings, or obtaining priority.'
 },
 learning:{
  correctIt:'Usa il clacson per avvisare gli altri della tua presenza.',
  correctEn:'Use the horn to alert others to your presence.'
 }
});


global.ReplayEngine.registerScene({
 id:'MT_TYRE_PRESSURE_COLD_CHECK_V1',
 category:'vehicle-safety',country:'MT',licenceType:'LPTV',drivingSide:'left',countryPackId:'MT-LPTV',
 sceneKey:'tyrePressureColdCheck',visualStatus:'final-real-footage',replayTemplate:'standard-video',
 title:'Tyre pressure — check when tyres are cold',
 accessibilityLabel:'Close-up of a tyre pressure gauge connected to a vehicle tyre',
 playbackRate:0.9,
 media:{
  video:'https://videos.pexels.com/video-files/9738025/9738025-uhd_3840_2160_24fps.mp4',
  videoSources:['https://videos.pexels.com/video-files/9738025/9738025-uhd_3840_2160_24fps.mp4','https://www.pexels.com/download/video/9738025/'],
  poster:'https://images.pexels.com/videos/9738025/pexels-photo-9738025.jpeg?auto=compress&dpr=1&h=750&w=1260',
  credit:'Pexels · K',sourcePage:'https://www.pexels.com/video/man-measuring-air-pressure-in-tires-9738025/'
 },
 timeline:[
  {at:.4,end:2.4,event:'observe',textIt:'Osserva il controllo della pressione sullo pneumatico',textEn:'Observe the tyre-pressure check'},
  {at:2.6,end:4.8,event:'hazard',textIt:'Dopo la guida gli pneumatici possono essere caldi',textEn:'After driving, the tyres may be hot'},
  {at:5.0,end:7.2,event:'explain',textIt:'La pressione deve essere misurata quando gli pneumatici sono FREDDI',textEn:'Tyre pressure should be measured when the tyres are COLD'},
  {at:7.4,end:11.0,event:'correct',textIt:'Controlla la pressione a freddo con un manometro',textEn:'Check tyre pressure when cold using a pressure gauge'}
 ],
 ui:{
  staticUntilFinal:true,
  hotspot:{left:47,top:55,radiusX:30,radiusY:28,instructionIt:'TOCCA IL MANOMETRO',instructionEn:'TAP THE PRESSURE GAUGE',ariaIt:'Tocca il manometro usato per controllare la pressione dello pneumatico',ariaEn:'Tap the gauge used to check tyre pressure'},
  phases:[
   {},
   {titleIt:'NON DOPO AVER SCALDATO LE GOMME',titleEn:'NOT AFTER THE TYRES HAVE HEATED UP',bodyIt:'La domanda chiede quando misurare la pressione: non dopo alta velocità o un lungo viaggio.',bodyEn:'The question asks when to measure pressure: not after high-speed driving or a long journey.'},
   {titleIt:'MISURA A FREDDO',titleEn:'MEASURE WHEN COLD',bodyIt:'La risposta corretta è precisa: la pressione degli pneumatici deve essere controllata quando gli pneumatici sono freddi.',bodyEn:'The exact correct answer is: tyre pressure should be checked when the tyres are cold.'},
   {titleIt:'CONTROLLO CORRETTO',titleEn:'CORRECT CHECK',bodyIt:'Usa un manometro e controlla la pressione prima che la guida abbia riscaldato gli pneumatici.',bodyEn:'Use a pressure gauge and check before driving has warmed the tyres.'}
  ],
  phaseOptions:[
   {startRatio:.18,freeze:true},{startRatio:.38,freeze:true},{startRatio:.58,freeze:true},{startRatio:.12,autoplay:true,endRatio:.82}
  ]
 },
 coach:{
  missIt:'Concentrati sulla temperatura degli pneumatici: la misura corretta si fa a freddo.',
  missEn:'Focus on tyre temperature: the correct pressure check is made when the tyres are cold.',
  hitIt:'Esatto: controlla la pressione quando gli pneumatici sono FREDDI.',
  hitEn:'Correct: check tyre pressure when the tyres are COLD.'
 },
 learning:{correctIt:'La pressione degli pneumatici va misurata a freddo.',correctEn:'Tyre pressure should be measured when the tyres are cold.'}
});


global.ReplayEngine.registerScene({
 id:'MT_UNDERINFLATED_BRAKING_FUEL_V1',
 category:'vehicle-safety',country:'MT',licenceType:'LPTV',drivingSide:'left',countryPackId:'MT-LPTV',
 sceneKey:'underInflatedBrakingFuel',visualStatus:'final-real-footage',replayTemplate:'standard-video',
 title:'Under-inflated tyres — braking and fuel consumption',
 accessibilityLabel:'Close-up of a tyre showing severe wear associated with under-inflation',
 playbackRate:0.9,
 media:{
  video:'https://videos.pexels.com/video-files/9737844/9737844-uhd_3840_2160_24fps.mp4',
  videoSources:['https://videos.pexels.com/video-files/9737844/9737844-uhd_3840_2160_24fps.mp4','https://www.pexels.com/download/video/9737844/'],
  poster:'https://images.pexels.com/videos/9737844/air-gauge-mechanic-racing-tire-9737844.jpeg?auto=compress&dpr=1&h=750&w=1260',
  credit:'Pexels · K',sourcePage:'https://www.pexels.com/video/a-mechanic-inflating-a-tire-9737844/'
 },
 timeline:[
  {at:.4,end:2.4,event:'observe',textIt:'Osserva lo pneumatico e pensa agli effetti della pressione insufficiente',textEn:'Observe the tyre and consider the effects of insufficient pressure'},
  {at:2.6,end:4.8,event:'hazard',textIt:'Uno pneumatico sgonfio peggiora il comportamento del veicolo',textEn:'An under-inflated tyre worsens vehicle performance'},
  {at:5.0,end:7.3,event:'explain',textIt:'Le due risposte corrette sono FRENATA e CONSUMO DI CARBURANTE',textEn:'The two correct answers are BRAKING and FUEL CONSUMPTION'},
  {at:7.5,end:11.2,event:'correct',textIt:'Mantieni la pressione corretta per una frenata migliore e per evitare consumo inutile',textEn:'Maintain correct pressure for better braking and to avoid unnecessary fuel use'}
 ],
 ui:{
  staticUntilFinal:true,
  hotspot:{left:52,top:47,radiusX:38,radiusY:32,instructionIt:'TOCCA LO PNEUMATICO',instructionEn:'TAP THE TYRE',ariaIt:'Tocca lo pneumatico che mostra gli effetti della pressione insufficiente',ariaEn:'Tap the tyre showing effects associated with insufficient pressure'},
  phases:[
   {},
   {titleIt:'PRESSIONE INSUFFICIENTE',titleEn:'UNDER-INFLATION',bodyIt:'La pressione insufficiente non riguarda la pressione dell’olio o la temperatura del motore.',bodyEn:'Under-inflation does not refer to oil pressure or engine temperature.'},
   {titleIt:'DUE EFFETTI DA RICORDARE',titleEn:'TWO EFFECTS TO REMEMBER',bodyIt:'Pneumatici sgonfi peggiorano la FRENATA e aumentano il CONSUMO DI CARBURANTE.',bodyEn:'Under-inflated tyres worsen BRAKING and increase FUEL CONSUMPTION.'},
   {titleIt:'MANTIENI LA PRESSIONE CORRETTA',titleEn:'KEEP THE CORRECT PRESSURE',bodyIt:'Controllare e correggere la pressione protegge la sicurezza di frenata e l’efficienza.',bodyEn:'Checking and correcting tyre pressure supports braking safety and efficiency.'}
  ],
  phaseOptions:[
   {startRatio:.18,freeze:true},{startRatio:.38,freeze:true},{startRatio:.58,freeze:true},{startRatio:.12,autoplay:true,endRatio:.82}
  ]
 },
 coach:{
  missIt:'Sono due risposte: FRENATA e CONSUMO DI CARBURANTE.',
  missEn:'There are two answers: BRAKING and FUEL CONSUMPTION.',
  hitIt:'Esatto: gli pneumatici sgonfi peggiorano la frenata e aumentano il consumo di carburante.',
  hitEn:'Correct: under-inflated tyres worsen braking and increase fuel consumption.'
 },
 learning:{correctIt:'Pneumatici sgonfi: frenata peggiore e maggiore consumo di carburante.',correctEn:'Under-inflated tyres: worse braking and higher fuel consumption.'}
});


global.ReplayEngine.registerScene({
 id:'MT_UNEVEN_TYRE_WEAR_FAULTS_V1',
 category:'vehicle-safety',country:'MT',licenceType:'LPTV',drivingSide:'left',countryPackId:'MT-LPTV',
 sceneKey:'unevenTyreWearFaults',visualStatus:'final-real-footage',replayTemplate:'standard-video',
 title:'Uneven tyre wear — suspension, alignment and braking faults',
 accessibilityLabel:'Mechanic checking a wheel and tyre during an alignment inspection',
 playbackRate:0.9,
 media:{
  video:'https://videos.pexels.com/video-files/5302693/5302693-hd_1920_1080_25fps.mp4',
  videoSources:['https://videos.pexels.com/video-files/5302693/5302693-hd_1920_1080_25fps.mp4','https://www.pexels.com/download/video/5302693/'],
  poster:'https://images.pexels.com/videos/5302693/pexels-photo-5302693.jpeg?auto=compress&dpr=1&h=750&w=1260',
  credit:'Pexels · Enis Yavuz',sourcePage:'https://www.pexels.com/video/close-up-video-of-a-tire-tread-5302693/'
 },
 timeline:[
  {at:.4,end:2.4,event:'observe',textIt:'Osserva lo pneumatico durante il controllo dell’assetto',textEn:'Observe the tyre during the wheel/alignment inspection'},
  {at:2.6,end:4.8,event:'hazard',textIt:'Usura eccessiva o irregolare può indicare un problema del veicolo',textEn:'Excessive or uneven wear can indicate a vehicle fault'},
  {at:5.0,end:7.5,event:'explain',textIt:'Ricorda tre cause: SOSPENSIONI, ALLINEAMENTO RUOTE e IMPIANTO FRENANTE',textEn:'Remember three causes: SUSPENSION, WHEEL ALIGNMENT and BRAKING SYSTEM'},
  {at:7.7,end:11.3,event:'correct',textIt:'Se l’usura è irregolare, controlla pneumatici, assetto, sospensioni e freni',textEn:'If wear is uneven, inspect the tyres, alignment, suspension and brakes'}
 ],
 ui:{
  staticUntilFinal:true,
  hotspot:{left:31,top:58,radiusX:29,radiusY:31,instructionIt:'TOCCA RUOTA E PNEUMATICO',instructionEn:'TAP THE WHEEL AND TYRE',ariaIt:'Tocca la ruota e lo pneumatico sottoposti al controllo',ariaEn:'Tap the wheel and tyre being inspected'},
  phases:[
   {},
   {titleIt:'USURA IRREGOLARE = CONTROLLA IL VEICOLO',titleEn:'UNEVEN WEAR = CHECK THE VEHICLE',bodyIt:'L’usura irregolare può essere collegata a guasti che alterano il comportamento della ruota o della frenata.',bodyEn:'Uneven wear can be linked to faults affecting the wheel or braking behaviour.'},
   {titleIt:'LE TRE RISPOSTE',titleEn:'THE THREE ANSWERS',bodyIt:'SOSPENSIONI + ALLINEAMENTO RUOTE + IMPIANTO FRENANTE. Non scarico, acceleratore o cambio.',bodyEn:'SUSPENSION + WHEEL ALIGNMENT + BRAKING SYSTEM. Not exhaust, accelerator or gearbox.'},
   {titleIt:'CONTROLLA IL BATTISTRADA',titleEn:'INSPECT THE TREAD',bodyIt:'L’usura anomala dello pneumatico è un segnale da non ignorare: individua e correggi la causa.',bodyEn:'Abnormal tyre wear is a warning sign: identify and correct the cause.'}
  ],
  phaseOptions:[
   {startRatio:.18,freeze:true},{startRatio:.38,freeze:true},{startRatio:.58,freeze:true},{startRatio:.12,autoplay:true,endRatio:.82}
  ]
 },
 coach:{
  missIt:'Devi selezionarne tre: SOSPENSIONI, ALLINEAMENTO RUOTE e IMPIANTO FRENANTE.',
  missEn:'Select three: SUSPENSION, WHEEL ALIGNMENT and BRAKING SYSTEM.',
  hitIt:'Esatto: sospensioni, allineamento delle ruote e impianto frenante.',
  hitEn:'Correct: suspension, wheel alignment and braking system.'
 },
 learning:{correctIt:'Usura irregolare: controlla sospensioni, allineamento ruote e freni.',correctEn:'Uneven wear: check suspension, wheel alignment and brakes.'}
});


global.ReplayEngine.registerScene({
 id:'MT_HORN_BUILT_UP_NIGHT_RESTRICTION_V1',
 category:'horn',country:'MT',licenceType:'LPTV',drivingSide:'left',countryPackId:'MT-LPTV',
 sceneKey:'hornBuiltUpNightRestriction',visualStatus:'final-real-footage',replayTemplate:'standard-video',
 title:'Horn restriction in built-up areas — 23:00 to 06:00',
 accessibilityLabel:'Driver view of a built-up urban road at night under street lighting',
 playbackRate:0.9,
 media:{
  video:'https://videos.pexels.com/video-files/3554563/3554563-hd_1920_1080_30fps.mp4',
  videoSources:['https://videos.pexels.com/video-files/3554563/3554563-hd_1920_1080_30fps.mp4','https://www.pexels.com/download/video/3554563/'],
  poster:'https://images.pexels.com/videos/3554563/free-video-3554563.jpg?auto=compress&dpr=1&h=750&w=1260',
  credit:'Pexels · Rholdan Ortiz',sourcePage:'https://www.pexels.com/video/man-driving-a-car-at-night-3554563/'
 },
 timeline:[
  {at:.4,end:2.4,event:'observe',textIt:'Osserva la strada urbana: è notte e siamo in una zona abitata',textEn:'Observe the urban road: it is night in a built-up area'},
  {at:2.6,end:4.8,event:'hazard',textIt:'In zona abitata il clacson è soggetto a una restrizione notturna',textEn:'In a built-up area the horn is subject to a night restriction'},
  {at:5.0,end:7.4,event:'explain',textIt:'La banca domande indica il divieto dalle 23:00 alle 06:00',textEn:'The question bank states the restriction from 11:00 pm to 6:00 am'},
  {at:7.6,end:11.4,event:'correct',textIt:'Non suonare il clacson in quell’orario, salvo necessità per evitare un pericolo',textEn:'Do not sound the horn during that period, except where necessary to avoid danger'}
 ],
 ui:{
  staticUntilFinal:true,
  hotspot:{left:54,top:51,radiusX:37,radiusY:31,instructionIt:'TOCCA LA STRADA URBANA DI NOTTE',instructionEn:'TAP THE URBAN ROAD AT NIGHT',ariaIt:'Tocca la strada in zona abitata durante la notte',ariaEn:'Tap the built-up road during the night'},
  phases:[
   {},
   {titleIt:'ZONA ABITATA + NOTTE',titleEn:'BUILT-UP AREA + NIGHT',bodyIt:'La domanda riguarda una fascia oraria precisa per l’uso del clacson in una zona abitata.',bodyEn:'The question concerns a specific time period for horn use in a built-up area.'},
   {titleIt:'23:00 → 06:00',titleEn:'11:00 PM → 6:00 AM',bodyIt:'La risposta corretta della banca domande è: tra le 23:00 e le 06:00.',bodyEn:'The correct question-bank answer is: between 11:00 pm and 6:00 am.'},
   {titleIt:'ECCEZIONE: EVITARE UN PERICOLO',titleEn:'EXCEPTION: AVOIDING DANGER',bodyIt:'In quella fascia non usare il clacson in zona abitata, salvo quando è necessario per evitare un pericolo.',bodyEn:'During that period, do not use the horn in a built-up area except when necessary to avoid danger.'}
  ],
  phaseOptions:[
   {startRatio:.18,freeze:true},{startRatio:.38,freeze:true},{startRatio:.58,freeze:true},{startRatio:.12,autoplay:true,endRatio:.82}
  ]
 },
 coach:{
  missIt:'Ricorda la fascia esatta indicata dalla domanda: 23:00–06:00.',
  missEn:'Remember the exact period in the question: 11:00 pm–6:00 am.',
  hitIt:'Esatto: in zona abitata, 23:00–06:00, salvo necessità per evitare un pericolo.',
  hitEn:'Correct: in a built-up area, 11:00 pm–6:00 am, except where necessary to avoid danger.'
 },
 learning:{correctIt:'Clacson in zona abitata: non usarlo tra le 23:00 e le 06:00, salvo per evitare un pericolo.',correctEn:'Horn in a built-up area: do not use it between 11:00 pm and 6:00 am, except to avoid danger.'}
});


global.ReplayEngine.registerScene({
 id:'MT_WALK_CYCLE_ENVIRONMENT_V1',
 category:'eco-driving',country:'MT',licenceType:'LPTV',drivingSide:'left',countryPackId:'MT-LPTV',
 sceneKey:'walkCycleEnvironment',visualStatus:'final-real-footage',replayTemplate:'standard-video',
 title:'Help the environment — walk or cycle when you can',
 accessibilityLabel:'People cycling through a busy urban street',
 playbackRate:0.9,
 media:{
  video:'https://videos.pexels.com/video-files/6580998/6580998-uhd_3840_2160_24fps.mp4',
  videoSources:['https://videos.pexels.com/video-files/6580998/6580998-uhd_3840_2160_24fps.mp4','https://www.pexels.com/download/video/6580998/'],
  poster:'https://images.pexels.com/videos/6580998/pexels-photo-6580998.jpeg?auto=compress&dpr=1&h=750&w=1260',
  credit:'Pexels · K',sourcePage:'https://www.pexels.com/video/cyclist-in-the-city-6580998/'
 },
 timeline:[
  {at:.4,end:2.4,event:'observe',textIt:'Osserva gli spostamenti in bicicletta in città',textEn:'Observe people travelling by bicycle in the city'},
  {at:2.6,end:4.8,event:'hazard',textIt:'Non tutti gli spostamenti richiedono necessariamente l’auto',textEn:'Not every journey necessarily requires a car'},
  {at:5.0,end:7.3,event:'explain',textIt:'Camminare o andare in bicicletta quando puoi evita emissioni inutili',textEn:'Walking or cycling when you can avoids unnecessary emissions'},
  {at:7.5,end:11.2,event:'correct',textIt:'Per aiutare l’ambiente, scegli di camminare o pedalare quando è possibile',textEn:'To help the environment, choose to walk or cycle when possible'}
 ],
 ui:{
  staticUntilFinal:true,
  hotspot:{left:49,top:55,radiusX:39,radiusY:32,instructionIt:'TOCCA I CICLISTI',instructionEn:'TAP THE CYCLISTS',ariaIt:'Tocca i ciclisti che si spostano in città',ariaEn:'Tap the cyclists travelling through the city'},
  phases:[
   {},
   {titleIt:'EVITA GLI SPOSTAMENTI INUTILI IN AUTO',titleEn:'AVOID UNNECESSARY CAR JOURNEYS',bodyIt:'Tra le risposte proposte, accelerare/frenare bruscamente, ridurre la pressione e usare lo starter non aiutano l’ambiente.',bodyEn:'Among the options, sharp acceleration/braking, reducing tyre pressure and using full choke do not help the environment.'},
   {titleIt:'CAMMINA O PEDALA',titleEn:'WALK OR CYCLE',bodyIt:'La risposta corretta è: cammina o usa la bicicletta quando puoi.',bodyEn:'The correct answer is: walk or cycle when you can.'},
   {titleIt:'MENO EMISSIONI INUTILI',titleEn:'FEWER UNNECESSARY EMISSIONS',bodyIt:'Quando il tragitto lo permette, camminare o pedalare evita emissioni che un viaggio in auto avrebbe prodotto.',bodyEn:'When the journey allows it, walking or cycling avoids emissions that a car journey would have produced.'}
  ],
  phaseOptions:[
   {startRatio:.18,freeze:true},{startRatio:.38,freeze:true},{startRatio:.58,freeze:true},{startRatio:.12,autoplay:true,endRatio:.82}
  ]
 },
 coach:{
  missIt:'Guarda l’opzione che evita direttamente emissioni inutili: camminare o usare la bicicletta quando puoi.',
  missEn:'Look for the option that directly avoids unnecessary emissions: walk or cycle when you can.',
  hitIt:'Esatto: camminare o andare in bicicletta quando puoi aiuta l’ambiente.',
  hitEn:'Correct: walking or cycling when you can helps the environment.'
 },
 learning:{correctIt:'Aiuta l’ambiente: cammina o usa la bicicletta quando puoi.',correctEn:'Help the environment: walk or cycle when you can.'}
});


global.ReplayEngine.registerScene({
 id:'MT_BRAKE_FLUID_LOW_LEVEL_V1',
 category:'vehicle-safety',country:'MT',licenceType:'LPTV',drivingSide:'left',countryPackId:'MT-LPTV',
 sceneKey:'brakeFluidLowLevel',visualStatus:'final-real-footage',replayTemplate:'standard-video',
 title:'Brake fluid — low level is dangerous',
 accessibilityLabel:'Real brake-fluid reservoir showing MIN and MAX level markings',
 playbackRate:0.9,
 media:{
  video:'https://videos.pexels.com/video-files/6870344/6870344-uhd_3840_2160_30fps.mp4',
  videoSources:['https://videos.pexels.com/video-files/6870344/6870344-uhd_3840_2160_30fps.mp4','https://www.pexels.com/download/video/6870344/'],
  poster:'https://images.pexels.com/videos/6870344/pexels-photo-6870344.jpeg?auto=compress&dpr=1&h=750&w=1260',
  credit:'Pexels · Gustavo Fring',sourcePage:'https://www.pexels.com/video/a-mechanic-working-on-a-car-s-disc-brake-6870344/'
 },
 timeline:[
  {at:.4,end:2.4,event:'observe',textIt:'Osserva il serbatoio del liquido freni e i riferimenti MIN e MAX',textEn:'Observe the brake-fluid reservoir and the MIN/MAX markings'},
  {at:2.6,end:4.8,event:'hazard',textIt:'Un livello troppo basso può indicare un guasto',textEn:'A very low level can indicate a fault'},
  {at:5.0,end:7.3,event:'explain',textIt:'Tra le opzioni, il liquido pericoloso se scende troppo è il LIQUIDO FRENI',textEn:'Among the options, the dangerous fluid if allowed to get too low is BRAKE FLUID'},
  {at:7.5,end:11.2,event:'correct',textIt:'Un problema al liquido freni può compromettere seriamente la frenata',textEn:'A brake-fluid problem can seriously affect braking'}
 ],
 ui:{
  staticUntilFinal:true,
  hotspot:{left:39,top:45,radiusX:33,radiusY:28,instructionIt:'TOCCA IL SERBATOIO DEL LIQUIDO FRENI',instructionEn:'TAP THE BRAKE-FLUID RESERVOIR',ariaIt:'Tocca il serbatoio con i riferimenti MIN e MAX',ariaEn:'Tap the reservoir with MIN and MAX markings'},
  phases:[
   {},
   {titleIt:'GUARDA MIN E MAX',titleEn:'LOOK AT MIN AND MAX',bodyIt:'Il livello del liquido freni deve rimanere nel campo previsto. Un calo anomalo richiede un controllo.',bodyEn:'Brake-fluid level must remain within its specified range. An abnormal drop requires checking.'},
   {titleIt:'RISPOSTA: LIQUIDO FRENI',titleEn:'ANSWER: BRAKE FLUID',bodyIt:'Tra refrigerante, liquido freni, acqua batteria e antigelo, la risposta della domanda è LIQUIDO FRENI.',bodyEn:'Among coolant, brake fluid, battery water and antifreeze, the answer is BRAKE FLUID.'},
   {titleIt:'PROTEGGI LA FRENATA',titleEn:'PROTECT BRAKING',bodyIt:'Se il livello è troppo basso, non ignorarlo: può indicare un problema capace di compromettere la frenata.',bodyEn:'If the level is too low, do not ignore it: it may indicate a problem that can compromise braking.'}
  ],
  phaseOptions:[{startRatio:.18,freeze:true},{startRatio:.38,freeze:true},{startRatio:.58,freeze:true},{startRatio:.12,autoplay:true,endRatio:.82}]
 },
 coach:{
  missIt:'Cerca il fluido direttamente collegato al sistema frenante.',
  missEn:'Look for the fluid directly connected to the braking system.',
  hitIt:'Esatto: un livello troppo basso del LIQUIDO FRENI è pericoloso.',
  hitEn:'Correct: a very low BRAKE FLUID level is dangerous.'
 },
 learning:{correctIt:'Liquido freni basso: possibile guasto e frenata seriamente compromessa.',correctEn:'Low brake fluid: possible fault and seriously impaired braking.'}
});


global.ReplayEngine.registerScene({
 id:'MT_ECO_DRIVING_SERVICE_GENTLE_SPEED_V1',
 category:'eco-driving',country:'MT',licenceType:'LPTV',drivingSide:'left',countryPackId:'MT-LPTV',
 sceneKey:'ecoDrivingHelpEnvironment',visualStatus:'final-real-footage',replayTemplate:'standard-video',
 title:'Eco driving — service, gentle acceleration and lower speed',
 accessibilityLabel:'Real driver holding the steering wheel while travelling on the road',
 playbackRate:0.9,
 media:{
  video:'https://videos.pexels.com/video-files/31901316/13588857_3840_2160_30fps.mp4',
  videoSources:['https://videos.pexels.com/video-files/31901316/13588857_3840_2160_30fps.mp4','https://www.pexels.com/download/video/31901316/'],
  poster:'https://images.pexels.com/videos/31901316/pexels-photo-31901316.jpeg?auto=compress&dpr=1&h=750&w=1260',
  credit:'Pexels · Jabriel',sourcePage:'https://www.pexels.com/video/scenic-city-drive-at-sunset-from-car-dashboard-31901316/'
 },
 timeline:[
  {at:.4,end:2.4,event:'observe',textIt:'Osserva una guida regolare e controllata',textEn:'Observe smooth, controlled driving'},
  {at:2.6,end:4.8,event:'hazard',textIt:'Accelerazioni brusche e velocità maggiore fanno consumare di più',textEn:'Harsh acceleration and higher speed increase fuel use'},
  {at:5.0,end:7.5,event:'explain',textIt:'Tre risposte: manutenzione corretta, accelerazione dolce e velocità ridotta',textEn:'Three answers: proper maintenance, gentle acceleration and lower speed'},
  {at:7.7,end:11.3,event:'correct',textIt:'Una guida efficiente riduce consumo ed emissioni',textEn:'Efficient driving reduces fuel use and emissions'}
 ],
 ui:{
  staticUntilFinal:true,
  hotspot:{left:53,top:48,radiusX:38,radiusY:32,instructionIt:'TOCCA IL VOLANTE E IL CONTROLLO DELLA GUIDA',instructionEn:'TAP THE STEERING CONTROL',ariaIt:'Tocca il volante usato per una guida regolare',ariaEn:'Tap the steering wheel used for controlled driving'},
  phases:[
   {},
   {titleIt:'AUTO IN ORDINE',titleEn:'KEEP THE VEHICLE SERVICED',bodyIt:'La corretta manutenzione aiuta il veicolo a funzionare in modo efficiente.',bodyEn:'Proper servicing helps the vehicle operate efficiently.'},
   {titleIt:'DOLCE + PIÙ LENTO',titleEn:'GENTLE + SLOWER',bodyIt:'ACCELERAZIONE DOLCE e RIDUZIONE DELLA VELOCITÀ sono le altre due risposte corrette.',bodyEn:'GENTLE ACCELERATION and LOWER SPEED are the other two correct answers.'},
   {titleIt:'TRE AZIONI INSIEME',titleEn:'THREE ACTIONS TOGETHER',bodyIt:'Manutenzione corretta + accelerazione dolce + velocità ridotta = meno consumo ed emissioni.',bodyEn:'Proper servicing + gentle acceleration + lower speed = less fuel use and emissions.'}
  ],
  phaseOptions:[{startRatio:.18,freeze:true},{startRatio:.38,freeze:true},{startRatio:.58,freeze:true},{startRatio:.12,autoplay:true,endRatio:.82}]
 },
 coach:{
  missIt:'Sono tre: manutenzione corretta, accelerazione dolce e riduzione della velocità.',
  missEn:'There are three: proper servicing, gentle acceleration and lower speed.',
  hitIt:'Esatto: manutenzione, accelerazione dolce e velocità ridotta.',
  hitEn:'Correct: servicing, gentle acceleration and lower speed.'
 },
 learning:{correctIt:'Per aiutare l’ambiente: manutenzione corretta, accelera dolcemente e riduci la velocità.',correctEn:'To help the environment: service properly, accelerate gently and reduce speed.'}
});


global.ReplayEngine.registerScene({
 id:'MT_VEHICLE_ENVIRONMENTAL_HARM_V1',
 category:'environment',country:'MT',licenceType:'LPTV',drivingSide:'left',countryPackId:'MT-LPTV',
 sceneKey:'vehicleEnvironmentalDamage',visualStatus:'final-real-footage',replayTemplate:'standard-video',
 title:'Vehicle environmental harm — resources, buildings and air pollution',
 accessibilityLabel:'Dense city buildings visible through heavy smog caused in part by urban traffic',
 playbackRate:0.9,
 media:{
  video:'https://videos.pexels.com/video-files/14389224/14389224-uhd_3840_2160_30fps.mp4',
  videoSources:['https://videos.pexels.com/video-files/14389224/14389224-uhd_3840_2160_30fps.mp4','https://www.pexels.com/download/video/14389224/'],
  poster:'https://images.pexels.com/videos/14389224/active-life-air-pollution-bangladesh-busy-street-14389224.jpeg?auto=compress&dpr=1&h=750&w=1260',
  credit:'Pexels · Ferdous Hasan',sourcePage:'https://www.pexels.com/video/environmental-pollution-in-the-city-14389224/'
 },
 timeline:[
  {at:.4,end:2.4,event:'observe',textIt:'Osserva la città avvolta dallo smog',textEn:'Observe the city covered by smog'},
  {at:2.6,end:4.8,event:'hazard',textIt:'Il traffico stradale ha un costo ambientale',textEn:'Road traffic has an environmental cost'},
  {at:5.0,end:7.5,event:'explain',textIt:'Tre effetti: consumo di risorse, danni agli edifici e inquinamento atmosferico',textEn:'Three effects: resource use, damage to buildings and air pollution'},
  {at:7.7,end:11.4,event:'correct',textIt:'Ricorda le tre conseguenze negative richieste dalla domanda',textEn:'Remember the three negative consequences required by the question'}
 ],
 ui:{
  staticUntilFinal:true,
  hotspot:{left:51,top:46,radiusX:41,radiusY:34,instructionIt:'TOCCA LA CITTÀ NELLO SMOG',instructionEn:'TAP THE SMOGGY CITY',ariaIt:'Tocca gli edifici visibili attraverso l’inquinamento atmosferico',ariaEn:'Tap the buildings visible through air pollution'},
  phases:[
   {},
   {titleIt:'RISORSE NATURALI',titleEn:'NATURAL RESOURCES',bodyIt:'I veicoli consumano carburanti, materiali ed energia: quindi utilizzano risorse naturali.',bodyEn:'Vehicles consume fuel, materials and energy, so they use natural resources.'},
   {titleIt:'EDIFICI + ARIA',titleEn:'BUILDINGS + AIR',bodyIt:'Le altre risposte corrette sono DANNI AGLI EDIFICI e INQUINAMENTO ATMOSFERICO.',bodyEn:'The other correct answers are DAMAGE TO BUILDINGS and AIR POLLUTION.'},
   {titleIt:'TRE IMPATTI',titleEn:'THREE IMPACTS',bodyIt:'Risorse naturali + edifici + aria: sono i tre effetti da selezionare.',bodyEn:'Natural resources + buildings + air are the three effects to select.'}
  ],
  phaseOptions:[{startRatio:.18,freeze:true},{startRatio:.38,freeze:true},{startRatio:.58,freeze:true},{startRatio:.12,autoplay:true,endRatio:.82}]
 },
 coach:{
  missIt:'Seleziona tre effetti negativi reali: risorse naturali, edifici e aria.',
  missEn:'Select three real negative effects: natural resources, buildings and air.',
  hitIt:'Esatto: consumo di risorse, danni agli edifici e inquinamento atmosferico.',
  hitEn:'Correct: resource use, damage to buildings and air pollution.'
 },
 learning:{correctIt:'I veicoli consumano risorse, possono danneggiare edifici e contribuiscono all’inquinamento atmosferico.',correctEn:'Vehicles use resources, can damage buildings and contribute to air pollution.'}
});


global.ReplayEngine.registerScene({
 id:'MT_ECO_PLAN_BRAKE_ACCELERATE_V1',
 category:'eco-driving',country:'MT',licenceType:'LPTV',drivingSide:'left',countryPackId:'MT-LPTV',
 sceneKey:'reduceEnvironmentalDamageDriving',visualStatus:'final-real-footage',replayTemplate:'standard-video',
 title:'Eco driving — plan ahead, brake early, avoid harsh acceleration',
 accessibilityLabel:'Real multi-lane road with traffic visible ahead for planning and smooth progress',
 playbackRate:0.9,
 media:{
  video:'https://videos.pexels.com/video-files/5873175/5873175-uhd_3840_2160_24fps.mp4',
  videoSources:['https://videos.pexels.com/video-files/5873175/5873175-uhd_3840_2160_24fps.mp4','https://www.pexels.com/download/video/5873175/'],
  poster:'https://images.pexels.com/videos/5873175/pexels-photo-5873175.jpeg?auto=compress&dpr=1&h=750&w=1260',
  credit:'Pexels · Marta Wave',sourcePage:'https://www.pexels.com/video/video-of-a-person-driving-and-holding-the-steering-wheel-5873175/'
 },
 timeline:[
  {at:.4,end:2.4,event:'observe',textIt:'Guarda lontano e pianifica quello che succede davanti',textEn:'Look well ahead and plan for what is happening in front'},
  {at:2.6,end:4.8,event:'hazard',textIt:'Guidare senza pianificare porta più facilmente a frenate e accelerazioni brusche',textEn:'Failing to plan makes harsh braking and acceleration more likely'},
  {at:5.0,end:7.5,event:'explain',textIt:'Tre azioni: pianifica, frena per tempo, evita accelerazioni brusche',textEn:'Three actions: plan ahead, brake in good time, avoid harsh acceleration'},
  {at:7.7,end:11.4,event:'correct',textIt:'Mantieni una guida fluida per ridurre consumo ed emissioni',textEn:'Keep driving smooth to reduce fuel use and emissions'}
 ],
 ui:{
  staticUntilFinal:true,
  hotspot:{left:49,top:52,radiusX:42,radiusY:34,instructionIt:'TOCCA IL TRAFFICO DAVANTI',instructionEn:'TAP THE TRAFFIC AHEAD',ariaIt:'Tocca la strada e il traffico che devi osservare in anticipo',ariaEn:'Tap the road and traffic you should observe ahead'},
  phases:[
   {},
   {titleIt:'PIANIFICA IN ANTICIPO',titleEn:'PLAN WELL AHEAD',bodyIt:'Leggere la strada prima permette di evitare correzioni improvvise.',bodyEn:'Reading the road early helps avoid sudden corrections.'},
   {titleIt:'FRENA PER TEMPO',titleEn:'BRAKE IN GOOD TIME',bodyIt:'Rilascia e rallenta per tempo invece di arrivare a una frenata tardiva e brusca.',bodyEn:'Ease off and slow in good time instead of relying on late harsh braking.'},
   {titleIt:'NIENTE ACCELERAZIONI BRUSCHE',titleEn:'AVOID HARSH ACCELERATION',bodyIt:'Le tre risposte corrette formano una guida fluida: pianifica, frena per tempo, accelera dolcemente.',bodyEn:'The three correct answers form smooth driving: plan, brake early and accelerate gently.'}
  ],
  phaseOptions:[{startRatio:.18,freeze:true},{startRatio:.38,freeze:true},{startRatio:.58,freeze:true},{startRatio:.12,autoplay:true,endRatio:.82}]
 },
 coach:{
  missIt:'Sono tre: pianifica in anticipo, frena per tempo ed evita accelerazioni brusche.',
  missEn:'There are three: plan ahead, brake in good time and avoid harsh acceleration.',
  hitIt:'Esatto: pianifica, frena per tempo ed evita accelerazioni brusche.',
  hitEn:'Correct: plan ahead, brake in good time and avoid harsh acceleration.'
 },
 learning:{correctIt:'Guida fluida: pianifica in anticipo, frena per tempo ed evita accelerazioni brusche.',correctEn:'Smooth driving: plan ahead, brake in good time and avoid harsh acceleration.'}
});


global.ReplayEngine.registerScene({
 id:'MT_AVOID_VERY_SHORT_CAR_JOURNEYS_V1',
 category:'eco-driving',country:'MT',licenceType:'LPTV',drivingSide:'left',countryPackId:'MT-LPTV',
 sceneKey:'avoidVeryShortJourneys',visualStatus:'final-real-footage',replayTemplate:'standard-video',
 title:'Environment — avoid very short car journeys',
 accessibilityLabel:'Cyclists commuting through the city as an alternative to a very short car journey',
 playbackRate:0.9,
 media:{
  video:'https://videos.pexels.com/video-files/37898712/16079864_3840_2160_30fps.mp4',
  videoSources:['https://videos.pexels.com/video-files/37898712/16079864_3840_2160_30fps.mp4','https://www.pexels.com/download/video/37898712/'],
  poster:'https://images.pexels.com/videos/37898712/pexels-photo-37898712.jpeg?auto=compress&dpr=1&h=750&w=1260',
  credit:'Pexels · Yura Forrat',sourcePage:'https://www.pexels.com/video/urban-cycling-on-a-busy-city-bridge-37898712/'
 },
 timeline:[
  {at:.4,end:2.4,event:'observe',textIt:'Osserva i ciclisti: per un tragitto breve l’auto non è sempre necessaria',textEn:'Observe the cyclists: for a short journey the car is not always necessary'},
  {at:2.6,end:4.8,event:'hazard',textIt:'Per tragitti molto brevi, usare l’auto aumenta inutilmente consumi ed emissioni',textEn:'For very short journeys, using the car unnecessarily increases fuel use and emissions'},
  {at:5.0,end:7.3,event:'explain',textIt:'Per aiutare l’ambiente NON usare l’auto per tragitti molto brevi quando puoi evitarlo',textEn:'To help the environment, do NOT use the car for very short journeys when you can avoid it'},
  {at:7.5,end:11.2,event:'correct',textIt:'Meglio camminare, pedalare o usare il trasporto pubblico quando è pratico',textEn:'Walk, cycle or use public transport when practical'}
 ],
 ui:{
  staticUntilFinal:true,
  hotspot:{left:50,top:48,radiusX:40,radiusY:31,instructionIt:'TOCCA IL QUADRO STRUMENTI ALL’AVVIAMENTO',instructionEn:'TAP THE DASHBOARD AT STARTUP',ariaIt:'Tocca il quadro strumenti dell’auto appena avviata',ariaEn:'Tap the instrument cluster as the car starts'},
  phases:[
   {},
   {titleIt:'PARTENZA A MOTORE FREDDO',titleEn:'COLD-ENGINE START',bodyIt:'Un tragitto molto breve richiede comunque avviamento e riscaldamento del motore.',bodyEn:'A very short journey still requires starting and warming the engine.'},
   {titleIt:'EVITA IL VIAGGIO IN AUTO',titleEn:'AVOID THE CAR JOURNEY',bodyIt:'La risposta da NON fare è usare il veicolo per tragitti molto brevi.',bodyEn:'The action you should NOT do is use the vehicle for very short journeys.'},
   {titleIt:'SCEGLI UN’ALTERNATIVA',titleEn:'CHOOSE AN ALTERNATIVE',bodyIt:'Quando è pratico, cammina, pedala o usa il trasporto pubblico per i tragitti brevi.',bodyEn:'When practical, walk, cycle or use public transport for short journeys.'}
  ],
  phaseOptions:[{startRatio:.18,freeze:true},{startRatio:.38,freeze:true},{startRatio:.58,freeze:true},{startRatio:.12,autoplay:true,endRatio:.82}]
 },
 coach:{
  missIt:'La domanda chiede cosa NON fare: usare l’auto per tragitti molto brevi.',
  missEn:'The question asks what NOT to do: use the car for very short journeys.',
  hitIt:'Esatto: evita di usare l’auto per tragitti molto brevi quando puoi.',
  hitEn:'Correct: avoid using the car for very short journeys when you can.'
 },
 learning:{correctIt:'Per l’ambiente, evita l’auto per tragitti molto brevi quando esiste un’alternativa pratica.',correctEn:'For the environment, avoid the car for very short journeys when a practical alternative exists.'}
});


global.ReplayEngine.registerScene({
 id:'MT_FUEL_CONSUMPTION_PLAN_SPEED_V1',
 category:'eco-driving',country:'MT',licenceType:'LPTV',drivingSide:'left',countryPackId:'MT-LPTV',
 sceneKey:'fuelConsumptionPlanSpeed',visualStatus:'final-real-footage',replayTemplate:'standard-video',
 title:'Fuel consumption — plan ahead and reduce road speed',
 accessibilityLabel:'Driver view along a real road, encouraging observation well ahead and controlled speed',
 playbackRate:0.9,
 media:{
  video:'https://videos.pexels.com/video-files/15330792/15330792-uhd_3840_1620_24fps.mp4',
  videoSources:['https://videos.pexels.com/video-files/15330792/15330792-uhd_3840_1620_24fps.mp4','https://www.pexels.com/download/video/15330792/'],
  poster:'https://images.pexels.com/videos/15330792/videographie-0153-15330792.jpeg?auto=compress&dpr=1&h=750&w=1260',
  credit:'Pexels · Dimitri Baret',sourcePage:'https://www.pexels.com/video/point-of-view-of-a-car-driving-along-the-road-15330792/'
 },
 timeline:[
  {at:.4,end:2.4,event:'observe',textIt:'Guarda lontano lungo la strada e pianifica in anticipo',textEn:'Look well ahead along the road and plan in advance'},
  {at:2.6,end:4.8,event:'hazard',textIt:'Accelerazioni, frenate tardive e velocità elevata aumentano il consumo',textEn:'Harsh acceleration, late braking and higher speed increase fuel use'},
  {at:5.0,end:7.4,event:'explain',textIt:'Le due risposte corrette sono pianificare in anticipo e ridurre la velocità',textEn:'The two correct answers are planning well ahead and reducing road speed'},
  {at:7.6,end:11.2,event:'correct',textIt:'Guida fluida e velocità ridotta aiutano a consumare meno carburante',textEn:'Smooth driving and lower speed help reduce fuel consumption'}
 ],
 ui:{
  staticUntilFinal:true,
  hotspot:{left:57,top:43,radiusX:39,radiusY:30,instructionIt:'TOCCA LA STRADA DAVANTI',instructionEn:'TAP THE ROAD AHEAD',ariaIt:'Tocca la strada davanti per pianificare in anticipo',ariaEn:'Tap the road ahead to plan well in advance'},
  phases:[
   {},
   {titleIt:'PIANIFICA IN ANTICIPO',titleEn:'PLAN WELL AHEAD',bodyIt:'Osservare lontano permette una guida più fluida e riduce accelerazioni e frenate inutili.',bodyEn:'Looking well ahead allows smoother driving and reduces unnecessary acceleration and braking.'},
   {titleIt:'RIDUCI LA VELOCITÀ',titleEn:'REDUCE ROAD SPEED',bodyIt:'Una velocità più moderata riduce il consumo di carburante.',bodyEn:'A more moderate road speed reduces fuel consumption.'},
   {titleIt:'DUE RISPOSTE',titleEn:'TWO ANSWERS',bodyIt:'PIANIFICARE IN ANTICIPO + RIDURRE LA VELOCITÀ.',bodyEn:'PLAN WELL AHEAD + REDUCE ROAD SPEED.'}
  ],
  phaseOptions:[{startRatio:.18,freeze:true},{startRatio:.38,freeze:true},{startRatio:.58,freeze:true},{startRatio:.12,autoplay:true,endRatio:.82}]
 },
 coach:{
  missIt:'Cerca le due azioni che rendono la guida più fluida ed efficiente.',
  missEn:'Look for the two actions that make driving smoother and more efficient.',
  hitIt:'Esatto: pianifica in anticipo e riduci la velocità.',
  hitEn:'Correct: plan well ahead and reduce road speed.'
 },
 learning:{correctIt:'Per ridurre il consumo: pianifica in anticipo e mantieni una velocità più moderata.',correctEn:'To reduce fuel consumption: plan well ahead and keep a more moderate road speed.'}
});


global.ReplayEngine.registerScene({
 id:'MT_TRAFFIC_CALMING_MEASURES_V1',
 category:'traffic-calming',country:'MT',licenceType:'LPTV',drivingSide:'left',countryPackId:'MT-LPTV',
 sceneKey:'trafficCalmingMeasures',visualStatus:'final-real-footage',replayTemplate:'standard-video',
 title:'Traffic calming — humps, chicanes and road narrowing',
 accessibilityLabel:'Driver-view on a genuinely narrow road where reduced width naturally moderates traffic speed',
 playbackRate:0.9,
 media:{
  video:'https://videos.pexels.com/video-files/4832678/4832678-uhd_3840_2160_30fps.mp4',
  videoSources:['https://videos.pexels.com/video-files/4832678/4832678-uhd_3840_2160_30fps.mp4','https://www.pexels.com/download/video/4832678/'],
  poster:'https://images.pexels.com/videos/4832678/pexels-photo-4832678.jpeg?auto=compress&dpr=1&h=750&w=1260',
  credit:'Pexels · Tom Fisk',sourcePage:'https://www.pexels.com/video/driving-on-a-narrow-rural-road-4832678/'
 },
 timeline:[
  {at:.4,end:2.4,event:'observe',textIt:'Osserva il restringimento e la deviazione della traiettoria',textEn:'Observe the narrowing and the deflected traffic path'},
  {at:2.6,end:4.8,event:'hazard',textIt:'Questi elementi obbligano i veicoli a ridurre la velocità',textEn:'These features make vehicles reduce speed'},
  {at:5.0,end:7.4,event:'explain',textIt:'Dossi, chicane e restringimenti sono misure di moderazione del traffico',textEn:'Road humps, chicanes and narrowing are traffic-calming measures'},
  {at:7.6,end:11.2,event:'correct',textIt:'Servono a rallentare e rendere più sicura la zona',textEn:'They are designed to slow traffic and make the area safer'}
 ],
 ui:{
  staticUntilFinal:true,
  hotspot:{left:53,top:58,radiusX:40,radiusY:29,instructionIt:'TOCCA IL RESTRINGIMENTO',instructionEn:'TAP THE ROAD NARROWING',ariaIt:'Tocca la chicane e il restringimento che moderano il traffico',ariaEn:'Tap the chicane and narrowing used for traffic calming'},
  phases:[
   {},
   {titleIt:'RESTRINGIMENTO',titleEn:'ROAD NARROWING',bodyIt:'Lo spazio ridotto costringe il traffico a moderare la velocità.',bodyEn:'Reduced road width forces traffic to moderate speed.'},
   {titleIt:'CHICANE E DOSSI',titleEn:'CHICANES AND HUMPS',bodyIt:'Anche chicane e dossi vengono usati per rallentare i veicoli.',bodyEn:'Chicanes and road humps are also used to slow vehicles.'},
   {titleIt:'TRAFFIC CALMING',titleEn:'TRAFFIC CALMING',bodyIt:'La risposta corretta è MISURE DI MODERAZIONE DEL TRAFFICO.',bodyEn:'The correct answer is TRAFFIC-CALMING MEASURES.'}
  ],
  phaseOptions:[{startRatio:.18,freeze:true},{startRatio:.38,freeze:true},{startRatio:.58,freeze:true},{startRatio:.12,autoplay:true,endRatio:.82}]
 },
 coach:{
  missIt:'Guarda cosa fanno dossi, chicane e restringimenti: fanno rallentare.',
  missEn:'Think about what humps, chicanes and narrowing do: they slow traffic.',
  hitIt:'Esatto: sono misure di moderazione del traffico.',
  hitEn:'Correct: they are traffic-calming measures.'
 },
 learning:{correctIt:'Dossi, chicane e restringimenti sono progettati per ridurre la velocità del traffico.',correctEn:'Road humps, chicanes and road narrowing are designed to reduce traffic speed.'}
});


global.ReplayEngine.registerScene({
 id:'MT_ROAD_HUMPS_REDUCED_SPEED_V1',
 category:'traffic-calming',country:'MT',licenceType:'LPTV',drivingSide:'left',countryPackId:'MT-LPTV',
 sceneKey:'roadHumpsReducedSpeed',visualStatus:'final-real-footage',replayTemplate:'standard-video',
 title:'Road humps — maintain a reduced speed throughout',
 accessibilityLabel:'Real residential street with speed-hump markings ahead',
 playbackRate:0.9,
 media:{
  video:'https://videos.pexels.com/video-files/3736929/3736929-hd_1080_1920_30fps.mp4',
  videoSources:['https://videos.pexels.com/video-files/3736929/3736929-hd_1080_1920_30fps.mp4','https://www.pexels.com/download/video/3736929/'],
  poster:'https://images.pexels.com/videos/3736929/driving-luxembourg-morning-rida-road-3736929.jpeg?auto=compress&dpr=1&h=750&w=1260',
  credit:'Pexels · Jack Kazanjyan',sourcePage:'https://www.pexels.com/video/driving-on-a-two-way-asphalt-road-3736929/'
 },
 timeline:[
  {at:.4,end:2.4,event:'observe',textIt:'Individua i dossi e le marcature sulla strada',textEn:'Identify the road humps and their markings'},
  {at:2.6,end:4.8,event:'hazard',textIt:'Accelerare tra un dosso e l’altro annulla lo scopo della zona',textEn:'Accelerating between humps defeats the purpose of the area'},
  {at:5.0,end:7.4,event:'explain',textIt:'Mantieni una velocità ridotta per tutto il tratto',textEn:'Maintain a reduced speed throughout the traffic-calmed section'},
  {at:7.6,end:11.2,event:'correct',textIt:'Velocità bassa e costante: niente accelerazioni tra i dossi',textEn:'Keep a low, steady speed: do not accelerate between humps'}
 ],
 ui:{
  staticUntilFinal:true,
  hotspot:{left:51,top:68,radiusX:42,radiusY:25,instructionIt:'TOCCA IL DOSSO',instructionEn:'TAP THE ROAD HUMP',ariaIt:'Tocca le marcature del dosso sulla carreggiata',ariaEn:'Tap the speed-hump road markings'},
  phases:[
   {},
   {titleIt:'ENTRA GIÀ PIANO',titleEn:'ENTER SLOWLY',bodyIt:'Riduci la velocità prima del primo dosso.',bodyEn:'Reduce speed before the first hump.'},
   {titleIt:'RESTA A VELOCITÀ RIDOTTA',titleEn:'KEEP SPEED REDUCED',bodyIt:'Non accelerare tra un dosso e l’altro.',bodyEn:'Do not accelerate between one hump and the next.'},
   {titleIt:'PER TUTTO IL TRATTO',titleEn:'THROUGHOUT THE AREA',bodyIt:'Mantieni una velocità ridotta e costante per tutta la zona.',bodyEn:'Maintain a consistently reduced speed throughout the area.'}
  ],
  phaseOptions:[{startRatio:.18,freeze:true},{startRatio:.38,freeze:true},{startRatio:.58,freeze:true},{startRatio:.12,autoplay:true,endRatio:.82}]
 },
 coach:{
  missIt:'Non basta rallentare solo sul dosso: mantieni la velocità ridotta per tutta la zona.',
  missEn:'Do not slow only at each hump: keep speed reduced throughout the area.',
  hitIt:'Esatto: mantieni una velocità ridotta per tutto il tratto.',
  hitEn:'Correct: maintain a reduced speed throughout.'
 },
 learning:{correctIt:'In una zona con dossi, mantieni una velocità ridotta e costante per tutto il tratto.',correctEn:'On a road with humps, maintain a reduced, steady speed throughout the section.'}
});


global.ReplayEngine.registerScene({
 id:'MT_FOG_DIP_SLOW_TIME_V1',
 category:'weather',country:'MT',licenceType:'LPTV',drivingSide:'left',countryPackId:'MT-LPTV',
 sceneKey:'fogSafeDriving',visualStatus:'final-real-footage',replayTemplate:'standard-video',
 title:'Fog — dipped headlights, lower speed and more journey time',
 accessibilityLabel:'Vehicles travelling cautiously on a highway with severely reduced visibility in dense fog',
 playbackRate:0.9,
 media:{
  video:'https://videos.pexels.com/video-files/36480477/15468883_3840_2160_25fps.mp4',
  videoSources:['https://videos.pexels.com/video-files/36480477/15468883_3840_2160_25fps.mp4','https://www.pexels.com/download/video/36480477/'],
  poster:'https://images.pexels.com/videos/36480477/pexels-photo-36480477.jpeg?auto=compress&dpr=1&h=750&w=1260',
  credit:'Pexels · Grigoriy Bunkov',sourcePage:'https://www.pexels.com/video/foggy-highway-traffic-and-low-visibility-scene-36480477/'
 },
 timeline:[
  {at:.4,end:2.4,event:'observe',textIt:'La visibilità nella nebbia è fortemente ridotta',textEn:'Visibility is severely reduced in fog'},
  {at:2.6,end:4.8,event:'hazard',textIt:'Abbaglianti e distanza troppo corta peggiorano il rischio',textEn:'Full beam and following too closely increase the risk'},
  {at:5.0,end:7.5,event:'explain',textIt:'Tre misure corrette: anabbaglianti, rallenta, prevedi più tempo',textEn:'Three correct measures: dipped headlights, slow down, allow more time'},
  {at:7.7,end:11.4,event:'correct',textIt:'Adatta luci, velocità e tempo di viaggio alla visibilità',textEn:'Adapt lights, speed and journey time to the visibility'}
 ],
 ui:{
  staticUntilFinal:true,
  hotspot:{left:50,top:54,radiusX:43,radiusY:32,instructionIt:'TOCCA LA STRADA NELLA NEBBIA',instructionEn:'TAP THE FOGGY ROAD',ariaIt:'Tocca la strada dove la visibilità è ridotta dalla nebbia',ariaEn:'Tap the road where visibility is reduced by fog'},
  phases:[
   {},
   {titleIt:'ANABBAGLIANTI',titleEn:'DIPPED HEADLIGHTS',bodyIt:'Usa gli ANABBAGLIANTI: gli abbaglianti possono riflettersi nella nebbia.',bodyEn:'Use DIPPED HEADLIGHTS: full beam can reflect back in fog.'},
   {titleIt:'RALLENTA',titleEn:'SLOW DOWN',bodyIt:'Riduci la velocità per avere più tempo e spazio per reagire.',bodyEn:'Reduce speed to give yourself more time and space to react.'},
   {titleIt:'PREVEDI PIÙ TEMPO',titleEn:'ALLOW MORE TIME',bodyIt:'Anabbaglianti + rallenta + prevedi più tempo per il viaggio.',bodyEn:'Dipped headlights + slow down + allow more time for the journey.'}
  ],
  phaseOptions:[{startRatio:.18,freeze:true},{startRatio:.38,freeze:true},{startRatio:.58,freeze:true},{startRatio:.12,autoplay:true,endRatio:.82}]
 },
 coach:{
  missIt:'Sono tre: anabbaglianti, velocità ridotta e più tempo per il viaggio.',
  missEn:'There are three: dipped headlights, reduced speed and more journey time.',
  hitIt:'Esatto: anabbaglianti, rallenta e prevedi più tempo.',
  hitEn:'Correct: use dipped headlights, slow down and allow more time.'
 },
 learning:{correctIt:'Nella nebbia usa gli anabbaglianti, rallenta e prevedi più tempo per il viaggio.',correctEn:'In fog, use dipped headlights, slow down and allow more time for the journey.'}
});


global.ReplayEngine.registerScene({
 id:'MT_AQUAPLANING_EASE_ACCELERATOR_V1',
 category:'weather',country:'MT',licenceType:'LPTV',drivingSide:'left',countryPackId:'MT-LPTV',
 sceneKey:'aquaplaningHeavyRain',visualStatus:'final-real-footage',replayTemplate:'standard-video',
 title:'Heavy rain — light steering and aquaplaning',
 accessibilityLabel:'Real driver view through a windscreen in heavy rain with wipers operating',
 playbackRate:0.9,
 media:{
  video:'https://videos.pexels.com/video-files/1350979/1350979-hd_1920_1080_30fps.mp4',
  videoSources:['https://videos.pexels.com/video-files/1350979/1350979-hd_1920_1080_30fps.mp4','https://www.pexels.com/download/video/1350979/'],
  poster:'https://images.pexels.com/videos/1350979/free-video-1350979.jpg?auto=compress&dpr=1&h=750&w=1260',
  credit:'Pexels · Asif Khan',sourcePage:'https://www.pexels.com/video/a-rainy-day-1350979/'
 },
 timeline:[
  {at:.4,end:2.4,event:'observe',textIt:'Pioggia intensa e molta acqua sulla strada riducono l’aderenza',textEn:'Heavy rain and standing water reduce tyre grip'},
  {at:2.6,end:4.8,event:'hazard',textIt:'Se lo sterzo diventa improvvisamente leggero potresti stare aquaplanando',textEn:'If the steering suddenly becomes light, the vehicle may be aquaplaning'},
  {at:5.0,end:7.4,event:'explain',textIt:'Non frenare bruscamente: rilascia dolcemente l’acceleratore',textEn:'Do not brake hard: ease off the accelerator smoothly'},
  {at:7.6,end:11.2,event:'correct',textIt:'Lascia diminuire la velocità gradualmente finché torna l’aderenza',textEn:'Allow speed to reduce gradually until grip returns'}
 ],
 ui:{
  staticUntilFinal:true,
  hotspot:{left:50,top:54,radiusX:44,radiusY:34,instructionIt:'TOCCA LA PIOGGIA SUL PARABREZZA',instructionEn:'TAP THE RAIN ON THE WINDSCREEN',ariaIt:'Tocca la zona di forte pioggia davanti al veicolo',ariaEn:'Tap the heavy rain visible ahead through the windscreen'},
  phases:[
   {},
   {titleIt:'STERZO MOLTO LEGGERO',titleEn:'VERY LIGHT STEERING',bodyIt:'È un segnale possibile di AQUAPLANING: gli pneumatici stanno perdendo contatto efficace con la strada.',bodyEn:'This can indicate AQUAPLANING: the tyres are losing effective contact with the road.'},
   {titleIt:'NIENTE MANOVRE BRUSCHE',titleEn:'NO SUDDEN INPUTS',bodyIt:'Evita frenate forti, accelerazioni e sterzate improvvise.',bodyEn:'Avoid hard braking, acceleration and sudden steering inputs.'},
   {titleIt:'RILASCIA L’ACCELERATORE',titleEn:'EASE OFF THE ACCELERATOR',bodyIt:'Rilascia dolcemente l’acceleratore e lascia ridurre la velocità gradualmente.',bodyEn:'Ease off the accelerator smoothly and allow speed to reduce gradually.'}
  ],
  phaseOptions:[{startRatio:.18,freeze:true},{startRatio:.38,freeze:true},{startRatio:.58,freeze:true},{startRatio:.12,autoplay:true,endRatio:.82}]
 },
 coach:{
  missIt:'Sterzo improvvisamente leggero nella pioggia intensa: pensa all’aquaplaning.',
  missEn:'Suddenly light steering in heavy rain: think aquaplaning.',
  hitIt:'Esatto: rilascia dolcemente l’acceleratore.',
  hitEn:'Correct: ease off the accelerator smoothly.'
 },
 learning:{correctIt:'Se sospetti aquaplaning, rilascia dolcemente l’acceleratore ed evita manovre brusche.',correctEn:'If you suspect aquaplaning, ease off the accelerator and avoid sudden inputs.'}
});



global.ReplayEngine.registerScene({
 id:'MT_MOBILE_PHONE_DRIVING_DISTRACTION_V1',
 category:'alertness',country:'MT',licenceType:'LPTV',drivingSide:'left',countryPackId:'MT-LPTV',
 sceneKey:'mobilePhoneDrivingDistraction',visualStatus:'final-real-footage',replayTemplate:'standard-video',
 title:'Mobile phone while driving — distraction from the road',
 accessibilityLabel:'Real driver holding a mobile phone while at the steering wheel',
 playbackRate:0.9,
 media:{
  video:'https://videos.pexels.com/video-files/6637301/6637301-uhd_3840_2160_30fps.mp4',
  videoSources:['https://videos.pexels.com/video-files/6637301/6637301-uhd_3840_2160_30fps.mp4','https://www.pexels.com/download/video/6637301/'],
  poster:'https://images.pexels.com/videos/6637301/pexels-photo-6637301.jpeg?auto=compress&dpr=1&h=750&w=1260',
  credit:'Pexels · Gustavo Fring',sourcePage:'https://www.pexels.com/video/a-man-talking-on-the-cell-phone-inside-the-vehicle-6637301/'
 },
 timeline:[
  {at:.4,end:2.4,event:'observe',textIt:'Il conducente sta usando il telefono mentre è al volante',textEn:'The driver is using a phone while at the wheel'},
  {at:2.6,end:4.8,event:'hazard',textIt:'Occhi e attenzione possono allontanarsi dalla strada',textEn:'Eyes and attention can be drawn away from the road'},
  {at:5.0,end:7.4,event:'explain',textIt:'La distrazione riduce osservazione, reazione e controllo',textEn:'Distraction reduces observation, reaction and control'},
  {at:7.6,end:11.2,event:'correct',textIt:'Il telefono può distrarre la tua attenzione dalla strada',textEn:'The phone could distract your attention from the road'}
 ],
 ui:{
  staticUntilFinal:true,
  hotspot:{left:72,top:34,radiusX:23,radiusY:27,instructionIt:'TOCCA IL TELEFONO',instructionEn:'TAP THE PHONE',ariaIt:'Tocca il telefono usato dal conducente',ariaEn:'Tap the phone being used by the driver'},
  phases:[
   {},
   {titleIt:'ATTENZIONE DIVISA',titleEn:'DIVIDED ATTENTION',bodyIt:'Il telefono porta parte dell’attenzione fuori dalla guida.',bodyEn:'The phone takes part of your attention away from driving.'},
   {titleIt:'REAZIONE E CONTROLLO',titleEn:'REACTION AND CONTROL',bodyIt:'Una distrazione può farti vedere tardi un pericolo e reagire peggio.',bodyEn:'A distraction can make you notice a hazard late and react less effectively.'},
   {titleIt:'PUÒ DISTRARTI',titleEn:'IT CAN DISTRACT YOU',bodyIt:'La risposta corretta è che il telefono può distrarre la tua attenzione dalla strada.',bodyEn:'The correct answer is that mobile-phone use could distract your attention from the road.'}
  ],
  phaseOptions:[{startRatio:.18,freeze:true},{startRatio:.38,freeze:true},{startRatio:.58,freeze:true},{startRatio:.12,autoplay:true,endRatio:.82}]
 },
 coach:{
  missIt:'Guarda cosa sta facendo il conducente: il rischio principale è la distrazione dalla strada.',
  missEn:'Look at what the driver is doing: the main risk is distraction from the road.',
  hitIt:'Esatto: il telefono può distrarre l’attenzione dalla strada.',
  hitEn:'Correct: the phone can distract attention from the road.'
 },
 learning:{correctIt:'Usare il telefono mentre guidi può distrarre la tua attenzione dalla strada.',correctEn:'Using a mobile phone while driving can distract your attention from the road.'}
});


global.ReplayEngine.registerScene({
 id:'MT_MOBILE_PHONE_PARKED_CONTROL_V1',
 category:'alertness',country:'MT',licenceType:'LPTV',drivingSide:'left',countryPackId:'MT-LPTV',
 sceneKey:'mobilePhoneParkedControl',visualStatus:'final-real-footage',replayTemplate:'standard-video',
 title:'Mobile phone — be parked before using it',
 accessibilityLabel:'Person using a smartphone while seated in a stationary parked vehicle',
 playbackRate:0.9,
 media:{
  video:'https://videos.pexels.com/video-files/5834191/5834191-uhd_2160_3840_24fps.mp4',
  videoSources:['https://videos.pexels.com/video-files/5834191/5834191-uhd_2160_3840_24fps.mp4','https://www.pexels.com/download/video/5834191/'],
  poster:'https://images.pexels.com/videos/5834191/pexels-photo-5834191.jpeg?auto=compress&dpr=1&h=750&w=1260',
  credit:'Pexels · Tim Samuel',sourcePage:'https://www.pexels.com/video/cab-driver-sitting-in-car-and-busy-with-phone-5834191/'
 },
 timeline:[
  {at:.4,end:2.4,event:'observe',textIt:'Il telefono viene usato con il veicolo fermo e parcheggiato',textEn:'The phone is being used with the vehicle stopped and parked'},
  {at:2.6,end:4.8,event:'hazard',textIt:'Usarlo mentre il veicolo è in movimento può compromettere il controllo',textEn:'Using it while the vehicle is moving can affect vehicle control'},
  {at:5.0,end:7.4,event:'explain',textIt:'Prima parcheggia in sicurezza, poi usa il telefono',textEn:'Park safely first, then use the phone'},
  {at:7.6,end:11.2,event:'correct',textIt:'Così il controllo del veicolo non viene compromesso',textEn:'This prevents phone use from affecting control of the vehicle'}
 ],
 ui:{
  staticUntilFinal:true,
  hotspot:{left:67,top:65,radiusX:25,radiusY:25,instructionIt:'TOCCA IL TELEFONO NELL’AUTO FERMA',instructionEn:'TAP THE PHONE IN THE PARKED CAR',ariaIt:'Tocca il telefono usato nella vettura parcheggiata',ariaEn:'Tap the phone being used in the parked vehicle'},
  phases:[
   {},
   {titleIt:'PRIMA PARCHEGGIA',titleEn:'PARK FIRST',bodyIt:'Il momento corretto per usare il telefono è quando sei parcheggiato in sicurezza.',bodyEn:'The correct time to use the phone is when you are safely parked.'},
   {titleIt:'PROTEGGI IL CONTROLLO',titleEn:'PROTECT CONTROL',bodyIt:'Se lo usi in movimento, attenzione e controllo del veicolo possono risentirne.',bodyEn:'If you use it while moving, your attention and vehicle control can be affected.'},
   {titleIt:'VEICOLO SOTTO CONTROLLO',titleEn:'KEEP VEHICLE CONTROL',bodyIt:'Essere parcheggiato evita che l’uso del telefono comprometta il controllo del veicolo.',bodyEn:'Being parked prevents phone use from affecting control of the vehicle.'}
  ],
  phaseOptions:[{startRatio:.18,freeze:true},{startRatio:.38,freeze:true},{startRatio:.58,freeze:true},{startRatio:.12,autoplay:true,endRatio:.82}]
 },
 coach:{
  missIt:'La domanda riguarda il controllo del veicolo: usa il telefono solo dopo esserti parcheggiato.',
  missEn:'The question is about vehicle control: use the phone only after parking.',
  hitIt:'Esatto: parcheggiati prima, così il controllo del veicolo non viene compromesso.',
  hitEn:'Correct: park first so vehicle control is not affected.'
 },
 learning:{correctIt:'Devi essere parcheggiato prima di usare il telefono per non compromettere il controllo del veicolo.',correctEn:'You should be parked before using a mobile phone so control of the vehicle is not affected.'}
});


global.ReplayEngine.registerScene({
 id:'MT_ZEBRA_WAIT_UNTIL_CROSSED_V1',
 category:'pedestrian-crossings',country:'MT',licenceType:'LPTV',drivingSide:'left',countryPackId:'MT-LPTV',
 sceneKey:'zebraWaitUntilCrossed',visualStatus:'final-real-footage',replayTemplate:'standard-video',
 title:'Zebra crossing — wait until pedestrians have crossed',
 accessibilityLabel:'Real pedestrian actively crossing a zebra crossing',
 playbackRate:0.9,
 media:{
  video:'https://videos.pexels.com/video-files/13308165/13308165-hd_1920_1080_50fps.mp4',
  videoSources:['https://videos.pexels.com/video-files/13308165/13308165-hd_1920_1080_50fps.mp4','https://www.pexels.com/download/video/13308165/'],
  poster:'https://images.pexels.com/videos/13308165/asia-bus-car-city-13308165.jpeg?auto=compress&dpr=1&h=750&w=1260',
  credit:'Pexels · Levi Wedge',sourcePage:'https://www.pexels.com/video/people-walking-on-the-street-while-crossing-the-pedestrian-13308165/'
 },
 timeline:[
  {at:.4,end:2.4,event:'observe',textIt:'Un pedone sta ancora attraversando sulle strisce',textEn:'A pedestrian is still crossing on the zebra crossing'},
  {at:2.6,end:4.8,event:'hazard',textIt:'Avanzare, accelerare il motore o fare cenni mette pressione sul pedone',textEn:'Edging forward, revving or waving puts pressure on the pedestrian'},
  {at:5.0,end:7.4,event:'explain',textIt:'Rimani fermo e paziente finché l’attraversamento è completato',textEn:'Remain stopped and patient until the crossing is complete'},
  {at:7.6,end:11.2,event:'correct',textIt:'Attendi finché i pedoni hanno attraversato',textEn:'Wait until the pedestrians have crossed'}
 ],
 ui:{
  staticUntilFinal:true,
  hotspot:{left:58,top:67,radiusX:24,radiusY:30,instructionIt:'TOCCA IL PEDONE SULLE STRISCE',instructionEn:'TAP THE PEDESTRIAN ON THE CROSSING',ariaIt:'Tocca il pedone che sta attraversando sulle strisce',ariaEn:'Tap the pedestrian who is crossing on the zebra crossing'},
  phases:[
   {},
   {titleIt:'È ANCORA SULLE STRISCE',titleEn:'STILL ON THE CROSSING',bodyIt:'Il pedone non ha ancora completato l’attraversamento.',bodyEn:'The pedestrian has not yet completed the crossing.'},
   {titleIt:'RESTA FERMO',titleEn:'REMAIN STOPPED',bodyIt:'Non avanzare e non mettergli fretta con gesti o col motore.',bodyEn:'Do not edge forward or hurry the pedestrian with gestures or engine revs.'},
   {titleIt:'ATTENDI CHE ABBIA ATTRAVERSATO',titleEn:'WAIT UNTIL THEY HAVE CROSSED',bodyIt:'Riparti solo quando il pedone ha completato l’attraversamento in sicurezza.',bodyEn:'Move off only when the pedestrian has safely completed the crossing.'}
  ],
  phaseOptions:[{startRatio:.18,freeze:true},{startRatio:.38,freeze:true},{startRatio:.58,freeze:true},{startRatio:.12,autoplay:true,endRatio:.82}]
 },
 coach:{
  missIt:'Il pedone sta ancora attraversando: resta fermo e aspetta.',
  missEn:'The pedestrian is still crossing: remain stopped and wait.',
  hitIt:'Esatto: attendi finché i pedoni hanno completato l’attraversamento.',
  hitEn:'Correct: wait until the pedestrians have completed the crossing.'
 },
 learning:{correctIt:'Dopo esserti fermato a uno zebra crossing, attendi finché i pedoni hanno attraversato.',correctEn:'After stopping at a zebra crossing, wait until the pedestrians have crossed.'}
});


global.ReplayEngine.registerScene({
 id:'MT_RAIN_LONGER_STOPPING_DISTANCE_V1',
 category:'stopping-distance',country:'MT',licenceType:'LPTV',drivingSide:'left',countryPackId:'MT-LPTV',
 sceneKey:'rainLongerStoppingDistance',visualStatus:'final-real-footage',replayTemplate:'standard-video',
 title:'Rain — longer overall stopping distance',
 accessibilityLabel:'Real view through a rain-covered windscreen onto a wet road',
 playbackRate:0.9,
 media:{
  video:'https://videos.pexels.com/video-files/15442191/15442191-uhd_2158_3840_60fps.mp4',
  videoSources:['https://videos.pexels.com/video-files/15442191/15442191-uhd_2158_3840_60fps.mp4','https://www.pexels.com/download/video/15442191/'],
  poster:'https://images.pexels.com/videos/15442191/4k-video-amazing-car-day-video-15442191.jpeg?auto=compress&dpr=1&h=750&w=1260',
  credit:'Pexels · Rebaz Geo',sourcePage:'https://www.pexels.com/video/a-car-parked-on-a-wet-road-on-a-rainy-day-15442191/'
 },
 timeline:[
  {at:.4,end:2.4,event:'observe',textIt:'Pioggia e carreggiata bagnata riducono l’aderenza',textEn:'Rain and a wet road reduce tyre grip'},
  {at:2.6,end:4.8,event:'hazard',textIt:'Con meno aderenza serve più spazio per rallentare e fermarsi',textEn:'With less grip, more distance is needed to slow and stop'},
  {at:5.0,end:7.4,event:'explain',textIt:'La distanza totale di arresto aumenta sulla strada bagnata',textEn:'Overall stopping distance increases on a wet road'},
  {at:7.6,end:11.2,event:'correct',textIt:'La risposta corretta è: sotto la pioggia',textEn:'The correct answer is: in the rain'}
 ],
 ui:{
  staticUntilFinal:true,
  hotspot:{left:49,top:53,radiusX:43,radiusY:34,instructionIt:'TOCCA LA STRADA BAGNATA',instructionEn:'TAP THE WET ROAD',ariaIt:'Tocca la carreggiata bagnata visibile attraverso il parabrezza',ariaEn:'Tap the wet road visible through the windscreen'},
  phases:[
   {},
   {titleIt:'ADERENZA RIDOTTA',titleEn:'REDUCED GRIP',bodyIt:'L’acqua tra pneumatici e asfalto riduce l’aderenza disponibile.',bodyEn:'Water between tyres and road reduces available grip.'},
   {titleIt:'SERVE PIÙ SPAZIO',titleEn:'MORE SPACE NEEDED',bodyIt:'Con meno aderenza il veicolo impiega più distanza per fermarsi.',bodyEn:'With less grip, the vehicle needs more distance to stop.'},
   {titleIt:'SOTTO LA PIOGGIA',titleEn:'IN THE RAIN',bodyIt:'La distanza totale di arresto è maggiore quando guidi sotto la pioggia.',bodyEn:'Your overall stopping distance is longer when driving in the rain.'}
  ],
  phaseOptions:[{startRatio:.18,freeze:true},{startRatio:.38,freeze:true},{startRatio:.58,freeze:true},{startRatio:.12,autoplay:true,endRatio:.82}]
 },
 coach:{
  missIt:'Guarda l’asfalto bagnato: meno aderenza significa più spazio per fermarsi.',
  missEn:'Look at the wet road: less grip means more space is needed to stop.',
  hitIt:'Esatto: sotto la pioggia la distanza totale di arresto aumenta.',
  hitEn:'Correct: overall stopping distance increases in the rain.'
 },
 learning:{correctIt:'La strada bagnata riduce l’aderenza e aumenta la distanza totale di arresto.',correctEn:'Wet roads reduce tyre grip and increase overall stopping distance.'}
});


global.ReplayEngine.registerScene({
 id:'MT_FLOOD_TEST_BRAKES_V1',
 category:'braking',country:'MT',licenceType:'LPTV',drivingSide:'left',countryPackId:'MT-LPTV',
 sceneKey:'floodTestBrakes',visualStatus:'final-real-footage',replayTemplate:'standard-video',
 title:'After flood water — test the brakes',
 accessibilityLabel:'Real vehicles driving through flood water across a road',
 playbackRate:0.9,
 media:{
  video:'https://videos.pexels.com/video-files/18640859/18640859-hd_1920_1080_60fps.mp4',
  videoSources:['https://videos.pexels.com/video-files/18640859/18640859-hd_1920_1080_60fps.mp4','https://www.pexels.com/download/video/18640859/'],
  poster:'https://images.pexels.com/videos/18640859/california-floods-flooding-heavy-rains-speeding-18640859.jpeg?auto=compress&dpr=1&h=750&w=1260',
  credit:'Pexels · D Goug',sourcePage:'https://www.pexels.com/video/street-flooding-18640859/'
 },
 timeline:[
  {at:.4,end:2.4,event:'observe',textIt:'Il veicolo ha appena attraversato acqua profonda sulla carreggiata',textEn:'The vehicle has just passed through deep water on the road'},
  {at:2.6,end:4.8,event:'hazard',textIt:'L’acqua può rendere temporaneamente meno efficaci i freni',textEn:'Water can temporarily make the brakes less effective'},
  {at:5.0,end:7.4,event:'explain',textIt:'Appena fuori dall’acqua, controlla delicatamente la risposta dei freni',textEn:'Once clear of the water, gently check the brake response'},
  {at:7.6,end:11.2,event:'correct',textIt:'La prima cosa da fare è provare i freni',textEn:'The first thing to do is test your brakes'}
 ],
 ui:{
  staticUntilFinal:true,
  hotspot:{left:52,top:68,radiusX:42,radiusY:25,instructionIt:'TOCCA L’ACQUA ATTRAVERSATA DAI VEICOLI',instructionEn:'TAP THE FLOOD WATER',ariaIt:'Tocca l’acqua sulla carreggiata attraversata dai veicoli',ariaEn:'Tap the flood water being crossed by the vehicles'},
  phases:[
   {},
   {titleIt:'FRENI BAGNATI',titleEn:'WET BRAKES',bodyIt:'Dopo l’acqua i freni possono rispondere meno efficacemente.',bodyEn:'After passing through water, the brakes may respond less effectively.'},
   {titleIt:'CONTROLLALI SUBITO',titleEn:'CHECK THEM PROMPTLY',bodyIt:'Quando sei fuori dall’acqua e in sicurezza, prova delicatamente i freni.',bodyEn:'When clear of the water and safe, gently test the brakes.'},
   {titleIt:'PROVA I FRENI',titleEn:'TEST THE BRAKES',bodyIt:'La prima cosa da fare dopo aver attraversato un allagamento è verificare che i freni rispondano.',bodyEn:'The first thing after driving through flood water is to check that the brakes respond.'}
  ],
  phaseOptions:[{startRatio:.18,freeze:true},{startRatio:.38,freeze:true},{startRatio:.58,freeze:true},{startRatio:.12,autoplay:true,endRatio:.82}]
 },
 coach:{
  missIt:'Dopo l’acqua pensa ai freni: potrebbero essere meno efficaci.',
  missEn:'After driving through water, think about the brakes: they may be less effective.',
  hitIt:'Esatto: dopo l’allagamento prova delicatamente i freni.',
  hitEn:'Correct: after flood water, gently test the brakes.'
 },
 learning:{correctIt:'Dopo aver attraversato un allagamento, prova delicatamente i freni perché potrebbero essere meno efficaci.',correctEn:'After driving through flood water, test the brakes gently because they may be less effective.'}
});

})(window);
