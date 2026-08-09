/* 39.12.12: Replay55 phases 01-03 forced to photographic stills; video reserved for 04. */

(function(global){
 'use strict';
 if(!global.SceneAssets)throw new Error('SceneAssets must load first');

 [

  {
   sceneKey:'msmRoutine',countryPackId:'MT-LPTV',drivingSide:'left',status:'approved',sourceType:'remote-stock',
   video:'https://www.pexels.com/download/video/4118586/',
   videoSources:["https://www.pexels.com/download/video/4118586/"],
   poster:'https://images.pexels.com/videos/4118586/free-video-4118586.jpg?auto=compress&dpr=1&h=750&w=1260',
   credit:'Pexels · WeStarMoney Rec',
   sourcePage:'https://www.pexels.com/video/man-driving-a-car-and-looking-curious-4118586/',
   tags:['driver','vehicle-moving','road-visible','side-mirror','mirror-check','signal','manoeuvre','ordered-sequence'],
   note:'CARS1.7 strict-match sequence. Dedicated footage not used by any previously approved Replay: first observe/check mirrors, then show the turn signal, then show the manoeuvre.'
  },

  {
   sceneKey:'blindSpotDefinition',countryPackId:'MT-LPTV',drivingSide:'left',status:'approved',sourceType:'remote-stock',
   video:'https://www.pexels.com/download/video/4607432/',
   videoSources:["https://www.pexels.com/download/video/4607432/"],
   poster:'https://images.pexels.com/videos/4607432/free-video-4607432.jpg?auto=compress&dpr=1&h=750&w=1260',
   credit:'Pexels · cottonbro studio',
   sourcePage:'https://www.pexels.com/video/a-car-is-shown-in-the-side-mirror-of-a-car-4607432/',
   tags:['side-mirror','traffic','mirror-coverage','blind-spot'],
   note:'CARS1.3 strict-match: real side-mirror traffic view used to distinguish the area visible in mirrors from the blind spot outside mirror coverage.'
  },


  {
   sceneKey:'uTurnShoulderCheck',countryPackId:'MT-LPTV',drivingSide:'left',status:'approved',sourceType:'remote-stock',
   video:'https://www.pexels.com/download/video/3525672/',
   videoSources:["https://www.pexels.com/download/video/3525672/"],
   poster:'https://images.pexels.com/videos/3525672/free-video-3525672.jpg?auto=compress&dpr=1&h=750&w=1260',
   credit:'Pexels · Matthias Groeneveld',sourcePage:'https://www.pexels.com/video/yellow-taxi-cab-making-a-u-turn-3525672/',
   tags:['u-turn','turning','road','traffic','blind-spot','shoulder-check'],
   note:'CARS1.2 dedicated U-turn footage. Replay overlays teach the final shoulder check immediately before committing to the manoeuvre.'
  },
  {
   sceneKey:'phoneDistractionDriving',countryPackId:'MT-LPTV',drivingSide:'left',status:'approved',sourceType:'remote-stock',
   video:'https://videos.pexels.com/video-files/5290305/5290305-hd_1920_1080_30fps.mp4',
   videoSources:["https://videos.pexels.com/video-files/5290305/5290305-hd_1920_1080_30fps.mp4","https://www.pexels.com/download/video/5290305/"],
   poster:'https://images.pexels.com/videos/5290305/free-video-5290305.jpg?auto=compress&dpr=1&h=750&w=1260',
   credit:'Pexels · faizan amjed',
   sourcePage:'https://www.pexels.com/video/man-answering-a-call-while-driving-5290305/',
   tags:['driver','mobile-phone','vehicle-moving','road-visible','distraction'],
   note:'CARS1.12 strict-match upgraded: moving driver visibly talking on a handheld phone with steering wheel and rainy road context, directly showing distraction while driving.'
  },

  {
   sceneKey:'handsFreeDistraction',countryPackId:'MT-LPTV',drivingSide:'left',status:'approved',sourceType:'remote-stock',
   video:'https://videos.pexels.com/video-files/5520095/5520095-hd_1920_1080_30fps.mp4',
   videoSources:["https://videos.pexels.com/video-files/5520095/5520095-hd_1920_1080_30fps.mp4","https://www.pexels.com/download/video/5520095/"],
   poster:'https://images.pexels.com/videos/5520095/boss-business-businessman-communication-5520095.jpeg?auto=compress&dpr=1&h=750&w=1260',
   credit:'Pexels · Pavel Danilyuk',
   sourcePage:'https://www.pexels.com/video/a-man-driving-his-car-5520095/',
   tags:['driver','wireless-earphones','hands-free','vehicle-moving','road-visible','mental-distraction','communication'],
   note:'CARS1.13 strict-match: moving driver wears wireless earbuds while driving. The visual distinguishes hands-free communication from handheld-phone use and supports the rule that the conversation can still create mental distraction.'
  },

  {
   sceneKey:'phoneStopSafe',countryPackId:'MT-LPTV',drivingSide:'left',status:'approved',sourceType:'remote-stock',
   video:'https://www.pexels.com/download/video/3048166/',
   videoSources:["https://www.pexels.com/download/video/3048166/","https://videos.pexels.com/video-files/3048166/3048166-hd_1920_1080_25fps.mp4","https://www.pexels.com/download/video/4281368/"],
   poster:'https://images.pexels.com/videos/3048166/free-video-3048166.jpg?auto=compress&dpr=1&h=750&w=1260',
   credit:'Pexels · fauxels',sourcePage:'https://www.pexels.com/video/woman-on-the-driver-s-seat-of-a-car-using-her-phone-3048166/',
   tags:['parked-car','driver-seat','mobile-phone','vehicle-stationary','safe-stop'],
   note:'CARS1.19: phone used while vehicle is parked/stationary, illustrating the correct answer.'
  },

  {
   sceneKey:'cyclistSafePass',countryPackId:'MT-LPTV',drivingSide:'left',status:'approved',sourceType:'remote-stock',
   video:'https://www.pexels.com/download/video/34633207/',
   videoSources:['https://www.pexels.com/download/video/34633207/','https://videos.pexels.com/video-files/34633207/34633207-hd_1920_1080_30fps.mp4','https://videos.pexels.com/video-files/34633207/34633207-hd_1920_1080_25fps.mp4'],poster:'https://images.pexels.com/videos/34633207/free-video-34633207.jpg?auto=compress&dpr=1&h=750&w=1260',credit:'Pexels · BJ Zurc',
   sourcePage:'https://www.pexels.com/video/cyclists-passing-by-in-car-side-mirror-view-34633207/',
   tags:['car-view','cyclist-clearly-visible','real-road','passing-context','cyclists','safe-passing','wide-gap'],note:'CARS1.18 metadata synchronized with the already-approved Replay video. Real car/mirror view with cyclists supports slow passing with plenty of room.'
  },
  {
   sceneKey:'largeVehicleFollowing',countryPackId:'MT-LPTV',drivingSide:'left',status:'approved',sourceType:'remote-stock',
   video:'https://www.pexels.com/download/video/4608275/',
   videoSources:["https://www.pexels.com/download/video/4608275/", "https://videos.pexels.com/video-files/4608275/4608275-hd_1920_1080_25fps.mp4", "https://videos.pexels.com/video-files/4608275/4608275-hd_1920_1080_30fps.mp4", "https://www.pexels.com/download/video/35408009/"],poster:'https://images.pexels.com/videos/4608275/free-video-4608275.jpg?auto=compress&dpr=1&h=750&w=1260',credit:'Pexels · K',
   sourcePage:'https://www.pexels.com/video/moving-cars-on-expressway-4608275/',
   tags:['pov','following','truck','large-truck','expressway','following-gap','mirror-visibility','visibility'],note:'CARS1.9 strict-match: driver POV following large trucks, selected so the learner can judge the following gap and understand why staying back keeps the car visible to the truck driver.'
  },
  {
   sceneKey:'dazzledHeadlights',countryPackId:'MT-LPTV',drivingSide:'left',status:'approved',sourceType:'remote-stock',
   video:'https://www.pexels.com/download/video/34738405/',poster:'https://images.pexels.com/videos/34738405/free-video-34738405.jpg?auto=compress&dpr=1&h=750&w=1260',credit:'Pexels · Ravi Kant',
   tags:['night-driving','driver-view','oncoming-vehicle','headlights','headlight-glare','dark-road'],note:'CARS1.24 dedicated real footage: driver-view night road with approaching vehicle lights; used only for the oncoming-headlight dazzle rule.'
  },
  {
   sceneKey:'duskLightsVisibility',countryPackId:'MT-LPTV',drivingSide:'left',status:'approved',sourceType:'remote-stock',
   video:'https://videos.pexels.com/video-files/4833483/4833483-hd_1920_1080_25fps.mp4',
   videoSources:["https://videos.pexels.com/video-files/4833483/4833483-hd_1920_1080_25fps.mp4","https://www.pexels.com/download/video/4833483/"],
   poster:'https://images.pexels.com/videos/4833483/pexels-photo-4833483.jpeg?auto=compress&dpr=1&h=750&w=1260',
   credit:'Pexels · WeStarMoney Rec',
   sourcePage:'https://www.pexels.com/video/sunset-driving-at-a-community-road-4833483/',
   tags:['dusk','twilight','moving-traffic','headlights-on','streetlights','visibility','lit-street'],
   note:'CARS1.25 strict-match: twilight traffic with headlights already visible while street lighting is present, directly teaching both correct answers — use lights so others can see you and use them even on lit streets.'
  },
  {
   sceneKey:'zebraWaitingStop',
   countryPackId:'MT-LPTV',
   drivingSide:'left',
   status:'approved',
   sourceType:'remote-stock',
   video:'https://www.pexels.com/download/video/2863232/',
   videoSources:["https://www.pexels.com/download/video/2863232/","https://videos.pexels.com/video-files/2863232/2863232-hd_1920_1080_25fps.mp4","https://www.pexels.com/download/video/12769743/"],
   poster:'https://images.pexels.com/videos/2863232/free-video-2863232.jpg?auto=compress&dpr=1&h=750&w=1260',
   credit:'Pexels · George Morina',
   sourcePage:'https://www.pexels.com/video/cars-stopping-at-a-pedestrian-crossing-2863232/',
   tags:['zebra-crossing','pedestrians','cars-stopping','yielding','approach','pedestrian-safety'],
   note:'CARS2.4 strict-match footage: cars visibly stopping at a pedestrian crossing; selected to teach slowing down and preparing to stop.'
  },
  {
   sceneKey:'pedestrianWaveAcross',
   countryPackId:'MT-LPTV',
   drivingSide:'left',
   status:'approved',
   sourceType:'remote-stock',
   video:'https://www.pexels.com/download/video/3121459/',
   videoSources:["https://www.pexels.com/download/video/3121459/", "https://videos.pexels.com/video-files/3121459/3121459-hd_1920_1080_25fps.mp4", "https://www.pexels.com/download/video/12769743/"],
   poster:'https://images.pexels.com/videos/3121459/free-video-3121459.jpg?auto=compress&dpr=1&h=750&w=1260',
   credit:'Pexels · George Morina',
   tags:['pedestrian-crossing','cars','urban-intersection','moving-traffic','pedestrian-risk'],
   note:'CARS2.6 strict-match: pedestrian plus multiple moving vehicles, chosen to make the unseen-other-vehicle risk visually understandable.'
  },
  {
   sceneKey:'overtakeLimitedView',
   countryPackId:'MT-LPTV',
   drivingSide:'left',
   status:'approved',
   sourceType:'remote-stock',
   video:'https://videos.pexels.com/video-files/19201236/19201236-hd_1920_1080_30fps.mp4',
   videoSources:["https://videos.pexels.com/video-files/19201236/19201236-hd_1920_1080_30fps.mp4", "https://videos.pexels.com/video-files/19201236/19201236-hd_1920_1080_25fps.mp4", "https://www.pexels.com/download/video/19201236/", "https://videos.pexels.com/video-files/11791710/11791710-hd_1920_1080_25fps.mp4"],
   poster:'https://images.pexels.com/videos/19201236/pexels-photo-19201236.jpeg?auto=compress&dpr=1&h=750&w=1260',
   credit:'Pexels · Mehmet Eray',
   sourcePage:'https://www.pexels.com/video/a-view-from-the-driver-s-seat-of-a-car-on-a-road-19201236/',
   tags:['pov-driving','hilly-road','curvy-road','limited-visibility','rural-road','dip-risk','left-driving','two-way-road'],
   note:'CARS1.10 strict-match candidate: driver POV on a hilly curving road with forward visibility reduction. Multiple MP4 sources are tried automatically on Safari; final fallback is the last known working direct MP4.'
  },
  {
   sceneKey:'twoSecondRuleGap',countryPackId:'MT-LPTV',drivingSide:'left',status:'approved',sourceType:'remote-stock',
   video:'https://www.pexels.com/download/video/5786587/',
   videoSources:["https://www.pexels.com/download/video/5786587/","https://videos.pexels.com/video-files/5786587/5786587-uhd_3840_2160_30fps.mp4"],
   poster:'https://images.pexels.com/videos/5786587/pexels-photo-5786587.jpeg?auto=compress&dpr=1&h=750&w=1260',
   credit:'Pexels · Tom Fisk',
   sourcePage:'https://www.pexels.com/video/vehicles-moving-on-a-highway-5786587/',
   tags:['pov-driving','vehicle-ahead','traffic','following-gap','two-second-rule','fixed-reference-point','safe-distance'],
   note:'CARS2.9 strict-match: driver-view road traffic with vehicles ahead. The replay uses a visible roadside reference point to teach the two-second following-gap method in normal conditions.'
  },

  {
   sceneKey:'largeVehicleTooClose',countryPackId:'MT-LPTV',drivingSide:'left',status:'approved',sourceType:'remote-stock',
   video:'https://www.pexels.com/download/video/9521384/',
   videoSources:["https://www.pexels.com/download/video/9521384/","https://videos.pexels.com/video-files/9521384/9521384-uhd_3840_2160_15fps.mp4"],
   poster:'https://images.pexels.com/videos/9521384/car-s-motorway-road-traffic-united-kingdom-9521384.jpeg?auto=compress&dpr=1&h=750&w=1260',
   credit:'Pexels · George Morina',
   sourcePage:'https://www.pexels.com/video/a-car-driving-on-the-highway-with-other-cars-9521384/',
   tags:['pov-driving','large-vehicle-ahead','truck','following-too-close','reduced-forward-view','mirror-blind-zone','traffic'],
   note:'CARS2.14 strict-match: driver POV in live motorway traffic with a large goods vehicle ahead. The replay explicitly teaches both official answers: staying too close blocks the view ahead and can place the following car where the large-vehicle driver cannot see it in the mirrors.'
  },

  {
   sceneKey:'wetRoadFourSecondGap',countryPackId:'MT-LPTV',drivingSide:'left',status:'approved',sourceType:'remote-stock',
   video:'https://videos.pexels.com/video-files/32015769/13645753_2160_3840_60fps.mp4',
   videoSources:["https://videos.pexels.com/video-files/32015769/13645753_2160_3840_60fps.mp4"],
   poster:'https://images.pexels.com/videos/32015769/carphotography-carview-instagood-travelgram-32015769.jpeg?auto=compress&dpr=1&h=750&w=1260',
   credit:'Pexels · Sapol Churanon',
   sourcePage:'https://www.pexels.com/video/driving-through-rainy-weather-on-a-busy-road-32015769/',
   tags:['pov-driving','rain','wet-road','windshield-wipers','vehicle-ahead','traffic','following-gap','four-second-rule'],
   note:'CARS2.17 strict-match: driver POV in heavy rain on a busy wet road with vehicles ahead and active wipers. The replay teaches doubling the normal two-second gap to at least four seconds on wet and slippery roads.'
  },

  {
   sceneKey:'rearFlashingAllowOvertake',countryPackId:'MT-LPTV',drivingSide:'left',status:'approved',sourceType:'remote-stock',
   video:'https://www.pexels.com/download/video/5446333/',
   videoSources:["https://www.pexels.com/download/video/5446333/"],
   poster:'https://images.pexels.com/videos/5446333/pexels-photo-5446333.jpeg?auto=compress&dpr=1&h=750&w=1260',
   credit:'Pexels · Martina Tomšič',
   sourcePage:'https://www.pexels.com/video/over-taking-cars-view-through-rear-view-mirror-5446333/',
   tags:['rear-view-mirror','car-behind','vehicle-behind','headlights','overtaking','traffic','allow-pass','allow-safe-pass','do-not-compete','attitude'],
   note:'CARS2.20 strict-match: rear/side-mirror traffic footage chosen to teach the correct response to a faster vehicle approaching from behind: do not compete, brake-check or block it; keep control and allow it to overtake when safe.'
  },


  {
   sceneKey:'neverExceedSpeedLimit',countryPackId:'MT-LPTV',drivingSide:'left',status:'approved',sourceType:'remote-stock',
   video:'https://www.pexels.com/download/video/5927764/',
   videoSources:["https://www.pexels.com/download/video/5927764/"],
   poster:'https://images.pexels.com/videos/5927764/airport-automobile-car-car-interior-5927764.jpeg?auto=compress&dpr=1&h=750&w=1260',
   credit:'Pexels · Christopher Schultz',
   sourcePage:'https://www.pexels.com/video/driving-on-a-highway-5927764/',
   tags:['driver-pov','dashboard','speedometer','highway','road','road-signs','speed-limit','speed-limit-rule','overtaking-rule','overtaking-context'],
   note:'CARS2.22 strict-match: highway driving with dashboard/speed context. Replay teaches that the posted maximum speed limit is never permission to exceed it, including on a clear road or while overtaking.'
  },

  {
   sceneKey:'blueFlashingBeacons',countryPackId:'MT-LPTV',drivingSide:'left',status:'approved',sourceType:'remote-stock',
   video:'https://videos.pexels.com/video-files/10029631/10029631-hd_1920_1080_24fps.mp4',
   videoSources:[
    'https://videos.pexels.com/video-files/10029631/10029631-hd_1920_1080_24fps.mp4',
    'https://www.pexels.com/download/video/10029631/'
   ],
   poster:'https://images.pexels.com/videos/10029631/free-video-10029631.jpg?auto=compress&dpr=1&h=750&w=1260',
   credit:'Pexels · Connor Kane / CityXcape',
   sourcePage:'https://www.pexels.com/video/police-car-lights-at-night-10029631/',
   tags:['police-vehicle','ambulance','blue-flashing-beacons','emergency-response'],
   note:'CARS2.30 strict-match. Primary scene shows police blue beacons; phase media shows ambulance emergency lights. Two correct answers taught in one standard Replay.'
  },

  {
   sceneKey:'ambulanceFollowingMakeWay',countryPackId:'MT-LPTV',drivingSide:'left',status:'approved',sourceType:'remote-stock',
   video:'https://videos.pexels.com/video-files/5514366/5514366-uhd_3840_2160_24fps.mp4',
   videoSources:[
    'https://videos.pexels.com/video-files/5514366/5514366-uhd_3840_2160_24fps.mp4',
    'https://www.pexels.com/download/video/5514366/'
   ],
   poster:'https://images.pexels.com/videos/5514366/pexels-photo-5514366.jpeg?auto=compress&dpr=1&h=750&w=1260',
   credit:'Pexels · K',
   sourcePage:'https://www.pexels.com/video/vehicle-stops-for-an-ambulance-passing-through-city-traffic-5514366/',
   tags:['ambulance','flashing-blue-light','emergency-response','traffic','make-way','pull-over-safely','vehicle-behind'],
   note:'CARS2.31 strict-match. Real traffic scene shows a vehicle stopping/making space for an ambulance passing through city traffic; Replay teaches to make way promptly but safely without harsh braking or accelerating away.'
  },

  {
   sceneKey:'underInflatedSteeringBraking',countryPackId:'MT-LPTV',drivingSide:'left',status:'approved',sourceType:'remote-stock-sequence',
   video:'https://www.pexels.com/download/video/8470711/',
   videoSources:['https://www.pexels.com/download/video/8470711/'],
   poster:'https://images.pexels.com/videos/8470711/free-video-8470711.jpg?auto=compress&dpr=1&h=750&w=1260',
   credit:'Pexels · Anastasia Shuraeva',
   sourcePage:'https://www.pexels.com/video/person-checking-tire-pressure-8470711/',
   tags:['tyre-pressure','tyre-pressure-check','pressure-gauge','under-inflation','steering','steering-response','braking','braking-performance','vehicle-safety'],
   note:'CARS3.4 strict-match sequence. Starts with a real tyre-pressure check, then isolates steering response and braking as the two vehicle-control functions adversely affected by under-inflation.'
  },

  {
   sceneKey:'hornAlertPresence',countryPackId:'MT-LPTV',drivingSide:'left',status:'approved',sourceType:'remote-stock',
   video:'https://www.pexels.com/download/video/12365082/',
   videoSources:[
    'https://www.pexels.com/download/video/12365082/'
   ],
   poster:'https://images.pexels.com/videos/12365082/free-video-12365082.jpg?auto=compress&dpr=1&h=750&w=1260',
   credit:'Pexels · Dimitri Baret',
   sourcePage:'https://www.pexels.com/video/point-of-view-of-a-car-driving-on-a-mountain-road-12365082/',
   tags:['horn','horn-warning','alert-presence','blind-corner','blind-or-limited-view','winding-road','driver-pov','safety-warning','safety-purpose'],
   note:'CARS2.34 strict-match. Real POV winding-road scene creates the exact context in which the horn is a warning device: alert unseen or potentially unseen road users to your presence, never to show annoyance, greet someone, or claim priority.'
  },

  {
   sceneKey:'busRightSignalGiveWay',countryPackId:'MT-LPTV',drivingSide:'left',status:'approved',sourceType:'remote-stock',
   video:'https://videos.pexels.com/video-files/2950082/2950082-uhd_3840_2160_30fps.mp4',
   videoSources:[
    'https://videos.pexels.com/video-files/2950082/2950082-uhd_3840_2160_30fps.mp4',
    'https://www.pexels.com/download/video/2950082/'
   ],
   poster:'https://images.pexels.com/videos/2950082/free-video-2950082.jpg?auto=compress&dpr=1&h=750&w=1260',
   credit:'Pexels · George Morina / Rec Everywhere',
   sourcePage:'https://www.pexels.com/video/passenger-bus-making-a-stop-on-designated-bus-stops-2950082/',
   tags:['bus-stop','bus-stationary','right-indicator','pulling-out','slow-down','give-way-if-safe','left-driving','london-bus'],
   note:'CARS2.32 strict teaching sequence. Primary real London footage establishes a bus stopped at a designated stop in left-driving traffic. Phase 2 isolates a real flashing amber turn indicator so the learner recognises the exact right-signal cue. Final phases return to the bus-stop scene and teach slowing down, holding back and giving way if safe.'
  },

  {
   sceneKey:'tyrePressureWeeklyCheck',countryPackId:'MT-LPTV',drivingSide:'left',status:'approved',sourceType:'remote-stock',
   video:'https://www.pexels.com/download/video/5637839/',
   videoSources:['https://www.pexels.com/download/video/5637839/'],
   poster:'https://images.pexels.com/videos/5637839/free-video-5637839.jpg?auto=compress&dpr=1&h=750&w=1260',
   credit:'Pexels · Tima Miroshnichenko',
   sourcePage:'https://www.pexels.com/video/close-up-of-a-tire-pressure-gauge-5637839/',
   tags:['tyre-pressure','pressure-gauge','weekly-check','regular-maintenance','vehicle-safety','pressure-measurement'],
   note:'CARS3.8 strict-match. Real close-up of a tyre pressure gauge during measurement. Replay teaches the exact minimum interval required by the database: once a week.'
  },

  {
   sceneKey:'dippedHeadlightsPoorVisibility',countryPackId:'MT-LPTV',drivingSide:'left',status:'approved',sourceType:'remote-stock',
   video:'https://videos.pexels.com/video-files/27861399/12246686_1920_1080_30fps.mp4',
   videoSources:['https://videos.pexels.com/video-files/27861399/12246686_1920_1080_30fps.mp4'],
   poster:'https://images.pexels.com/videos/27861399/pexels-photo-27861399.jpeg?auto=compress&dpr=1&h=750&w=1260',
   credit:'Pexels · Nothing Ahead',
   sourcePage:'https://www.pexels.com/video/a-man-driving-a-car-through-a-foggy-city-27861399/',
   tags:['daytime','fog','poor-visibility','dipped-headlights','driver-view','windshield'],
   note:'CARS3.18 strict-match. Driver POV through dense daytime fog. Replay teaches the exact database condition: dipped headlights during the day in poor visibility.'
  },

  {
   sceneKey:'tyrePressureColdCheck',countryPackId:'MT-LPTV',drivingSide:'left',status:'approved',sourceType:'remote-stock',
   video:'https://videos.pexels.com/video-files/9738025/9738025-uhd_3840_2160_24fps.mp4',
   videoSources:['https://videos.pexels.com/video-files/9738025/9738025-uhd_3840_2160_24fps.mp4','https://www.pexels.com/download/video/9738025/'],
   poster:'https://images.pexels.com/videos/9738025/pexels-photo-9738025.jpeg?auto=compress&dpr=1&h=750&w=1260',
   credit:"Pexels · K",
   sourcePage:'https://www.pexels.com/video/man-measuring-air-pressure-in-tires-9738025/',
   tags:['tyre-pressure','pressure-gauge','cold-tyres','maintenance-check','tire-care','measurement'],
   note:"CARS3.7 strict-match. Real tyre-pressure measurement with a gauge; Replay teaches the exact database condition: measure pressure when the tyres are cold."
  },

  {
   sceneKey:'underInflatedBrakingFuel',countryPackId:'MT-LPTV',drivingSide:'left',status:'approved',sourceType:'remote-stock',
   video:'https://videos.pexels.com/video-files/9737844/9737844-uhd_3840_2160_24fps.mp4',
   videoSources:['https://videos.pexels.com/video-files/9737844/9737844-uhd_3840_2160_24fps.mp4','https://www.pexels.com/download/video/9737844/'],
   poster:'https://images.pexels.com/videos/9737844/air-gauge-mechanic-racing-tire-9737844.jpeg?auto=compress&dpr=1&h=750&w=1260',
   credit:"Pexels · K",
   sourcePage:'https://www.pexels.com/video/a-mechanic-inflating-a-tire-9737844/',
   tags:['under-inflation','tyre-pressure','braking','fuel-consumption','pressure-check','tire-maintenance'],
   note:"CARS3.9 strict-match. Dedicated tyre-pressure footage; Replay teaches the two database effects of under-inflation: poorer braking and higher fuel consumption."
  },

  {
   sceneKey:'unevenTyreWearFaults',countryPackId:'MT-LPTV',drivingSide:'left',status:'approved',sourceType:'remote-stock',
   video:'https://videos.pexels.com/video-files/5302693/5302693-hd_1920_1080_25fps.mp4',
   videoSources:['https://videos.pexels.com/video-files/5302693/5302693-hd_1920_1080_25fps.mp4','https://www.pexels.com/download/video/5302693/'],
   poster:'https://images.pexels.com/videos/5302693/pexels-photo-5302693.jpeg?auto=compress&dpr=1&h=750&w=1260',
   credit:"Pexels · Enis Yavuz",
   sourcePage:'https://www.pexels.com/video/close-up-video-of-a-tire-tread-5302693/',
   tags:['tyre-wear','suspension','wheel-alignment','braking-system','tire-tread','vehicle-maintenance'],
   note:"CARS3.31 strict-match. Real tyre/alignment inspection freeze plus dedicated tread video; Replay binds the three correct causes from the database: suspension, wheel alignment and braking faults."
  },

  {
   sceneKey:'hornBuiltUpNightRestriction',countryPackId:'MT-LPTV',drivingSide:'left',status:'approved',sourceType:'remote-stock',
   video:'https://videos.pexels.com/video-files/3554563/3554563-hd_1920_1080_30fps.mp4',
   videoSources:['https://videos.pexels.com/video-files/3554563/3554563-hd_1920_1080_30fps.mp4','https://www.pexels.com/download/video/3554563/'],
   poster:'https://images.pexels.com/videos/3554563/free-video-3554563.jpg?auto=compress&dpr=1&h=750&w=1260',
   credit:"Pexels · Rholdan Ortiz",
   sourcePage:'https://www.pexels.com/video/man-driving-a-car-at-night-3554563/',
   tags:['built-up-area','night-driving','horn-restriction','23-to-06','urban-road','streetlights'],
   note:"CARS3.38 strict-match. Real night urban driving. Replay teaches the current database wording: no horn in a built-up area from 23:00 to 06:00, except where necessary to avoid danger."
  },

  {
   sceneKey:'walkCycleEnvironment',countryPackId:'MT-LPTV',drivingSide:'left',status:'approved',sourceType:'remote-stock',
   video:'https://videos.pexels.com/video-files/6580998/6580998-uhd_3840_2160_24fps.mp4',
   videoSources:['https://videos.pexels.com/video-files/6580998/6580998-uhd_3840_2160_24fps.mp4','https://www.pexels.com/download/video/6580998/'],
   poster:'https://images.pexels.com/videos/6580998/pexels-photo-6580998.jpeg?auto=compress&dpr=1&h=750&w=1260',
   credit:"Pexels · K",
   sourcePage:'https://www.pexels.com/video/cyclist-in-the-city-6580998/',
   tags:['walking-or-cycling','cycling','urban','environment','lower-emissions','green-transport'],
   note:"CARS3.29 strict-match. Real urban cycling. Replay teaches the exact database answer: walk or cycle when you can to avoid unnecessary emissions."
  },


  {
   sceneKey:'brakeFluidLowLevel',countryPackId:'MT-LPTV',drivingSide:'left',status:'approved',sourceType:'remote-stock',
   video:'https://videos.pexels.com/video-files/6870344/6870344-uhd_3840_2160_30fps.mp4',
   videoSources:['https://videos.pexels.com/video-files/6870344/6870344-uhd_3840_2160_30fps.mp4','https://www.pexels.com/download/video/6870344/'],
   poster:'https://images.pexels.com/videos/6870344/pexels-photo-6870344.jpeg?auto=compress&dpr=1&h=750&w=1260',
   credit:'Pexels · Gustavo Fring',
   sourcePage:'https://www.pexels.com/video/a-mechanic-working-on-a-car-s-disc-brake-6870344/',
   tags:['brake-fluid','braking-system','brake-maintenance','fluid-level','vehicle-safety'],
   note:'CARS3.1 strict-match. Embedded photographic freeze shows the real brake-fluid reservoir and level markings; phase 04 uses dedicated real brake-service footage.'
  },

  {
   sceneKey:'ecoDrivingHelpEnvironment',countryPackId:'MT-LPTV',drivingSide:'left',status:'approved',sourceType:'remote-stock',
   video:'https://videos.pexels.com/video-files/31901316/13588857_3840_2160_30fps.mp4',
   videoSources:['https://videos.pexels.com/video-files/31901316/13588857_3840_2160_30fps.mp4','https://www.pexels.com/download/video/31901316/'],
   poster:'https://images.pexels.com/videos/31901316/pexels-photo-31901316.jpeg?auto=compress&dpr=1&h=750&w=1260',
   credit:'Pexels · Jabriel',
   sourcePage:'https://www.pexels.com/video/scenic-city-drive-at-sunset-from-car-dashboard-31901316/',
   tags:['eco-driving','smooth-driving','gentle-acceleration','reduced-speed','driver-control'],
   note:'CARS3.23 strict-match teaching sequence. Real driver-control freeze and smooth-drive video support the three correct habits: proper maintenance, gentle acceleration and lower speed.'
  },

  {
   sceneKey:'vehicleEnvironmentalDamage',countryPackId:'MT-LPTV',drivingSide:'left',status:'approved',sourceType:'remote-stock',
   video:'https://videos.pexels.com/video-files/14389224/14389224-uhd_3840_2160_30fps.mp4',
   videoSources:['https://videos.pexels.com/video-files/14389224/14389224-uhd_3840_2160_30fps.mp4','https://www.pexels.com/download/video/14389224/'],
   poster:'https://images.pexels.com/videos/14389224/active-life-air-pollution-bangladesh-busy-street-14389224.jpeg?auto=compress&dpr=1&h=750&w=1260',
   credit:'Pexels · Ferdous Hasan',
   sourcePage:'https://www.pexels.com/video/environmental-pollution-in-the-city-14389224/',
   tags:['traffic','air-pollution','urban-buildings','environmental-damage','resources'],
   note:'CARS3.27 strict-match. Smog over dense urban buildings makes the transport-related environmental impact visible; Replay teaches resources, building damage and air pollution.'
  },

  {
   sceneKey:'reduceEnvironmentalDamageDriving',countryPackId:'MT-LPTV',drivingSide:'left',status:'approved',sourceType:'remote-stock',
   video:'https://videos.pexels.com/video-files/5873175/5873175-uhd_3840_2160_24fps.mp4',
   videoSources:['https://videos.pexels.com/video-files/5873175/5873175-uhd_3840_2160_24fps.mp4','https://www.pexels.com/download/video/5873175/'],
   poster:'https://images.pexels.com/videos/5873175/pexels-photo-5873175.jpeg?auto=compress&dpr=1&h=750&w=1260',
   credit:'Pexels · Marta Wave',
   sourcePage:'https://www.pexels.com/video/video-of-a-person-driving-and-holding-the-steering-wheel-5873175/',
   tags:['eco-driving','plan-ahead','early-braking','gentle-acceleration','smooth-driving'],
   note:'CARS3.28 strict-match teaching sequence. Real road/driver visuals support planned, smooth progress: plan ahead, brake in good time and avoid harsh acceleration.'
  },

  {
   sceneKey:'avoidVeryShortJourneys',countryPackId:'MT-LPTV',drivingSide:'left',status:'approved',sourceType:'remote-stock',
   video:'https://videos.pexels.com/video-files/37898712/16079864_3840_2160_30fps.mp4',
   videoSources:['https://videos.pexels.com/video-files/37898712/16079864_3840_2160_30fps.mp4','https://www.pexels.com/download/video/37898712/'],
   poster:'https://images.pexels.com/videos/37898712/pexels-photo-37898712.jpeg?auto=compress&dpr=1&h=750&w=1260',
   credit:'Pexels · Yura Forrat',
   sourcePage:'https://www.pexels.com/video/urban-cycling-on-a-busy-city-bridge-37898712/',
   tags:['short-journey','alternative-travel','bicycle','cycling','eco-friendly-travel'],
   note:'CARS3.30 phase 04 shows a clear practical alternative to a very short car journey: urban cycling.'
  },


  {
   sceneKey:'fuelConsumptionPlanSpeed',countryPackId:'MT-LPTV',drivingSide:'left',status:'approved',sourceType:'remote-stock',
   video:'https://videos.pexels.com/video-files/15330792/15330792-uhd_3840_1620_24fps.mp4',
   videoSources:['https://videos.pexels.com/video-files/15330792/15330792-uhd_3840_1620_24fps.mp4','https://www.pexels.com/download/video/15330792/'],
   poster:'https://images.pexels.com/videos/15330792/videographie-0153-15330792.jpeg?auto=compress&dpr=1&h=750&w=1260',
   credit:'Pexels · Dimitri Baret',
   sourcePage:'https://www.pexels.com/video/point-of-view-of-a-car-driving-along-the-road-15330792/',
   tags:['fuel-consumption','plan-ahead','reduced-speed','smooth-driving','eco-driving'],
   note:'CARS3.33 strict-match. Embedded real driving freeze supports planning ahead and controlled road speed; phase 04 uses dedicated driver-view road footage.'
  },

  {
   sceneKey:'trafficCalmingMeasures',countryPackId:'MT-LPTV',drivingSide:'left',status:'approved',sourceType:'remote-stock',
   video:'https://videos.pexels.com/video-files/4832678/4832678-uhd_3840_2160_30fps.mp4',
   videoSources:['https://videos.pexels.com/video-files/4832678/4832678-uhd_3840_2160_30fps.mp4','https://www.pexels.com/download/video/4832678/'],
   poster:'https://images.pexels.com/videos/4832678/pexels-photo-4832678.jpeg?auto=compress&dpr=1&h=750&w=1260',
   credit:'Pexels · Tom Fisk',
   sourcePage:'https://www.pexels.com/video/driving-on-a-narrow-rural-road-4832678/',
   tags:['traffic-calming','speed-bump','chicane','road-narrowing','residential'],
   note:'CARS3.46 strict-match. Embedded photographic freeze shows a real traffic-calming chicane/narrowing; phase 04 now uses a driver-view journey on a genuinely narrow road, making the road-narrowing traffic-calming idea visually immediate.'
  },

  {
   sceneKey:'roadHumpsReducedSpeed',countryPackId:'MT-LPTV',drivingSide:'left',status:'approved',sourceType:'remote-stock',
   video:'https://videos.pexels.com/video-files/3736929/3736929-hd_1080_1920_30fps.mp4',
   videoSources:['https://videos.pexels.com/video-files/3736929/3736929-hd_1080_1920_30fps.mp4','https://www.pexels.com/download/video/3736929/'],
   poster:'https://images.pexels.com/videos/3736929/driving-luxembourg-morning-rida-road-3736929.jpeg?auto=compress&dpr=1&h=750&w=1260',
   credit:'Pexels · Jack Kazanjyan',
   sourcePage:'https://www.pexels.com/video/driving-on-a-two-way-asphalt-road-3736929/',
   tags:['road-humps','reduced-speed','residential-road','steady-speed','traffic-calming'],
   note:'CARS3.47 strict-match. Embedded freeze clearly shows speed-hump road markings in a residential street; phase 04 continues with a real neighbourhood drive.'
  },

  {
   sceneKey:'fogSafeDriving',countryPackId:'MT-LPTV',drivingSide:'left',status:'approved',sourceType:'remote-stock',
   video:'https://videos.pexels.com/video-files/36480477/15468883_3840_2160_25fps.mp4',
   videoSources:['https://videos.pexels.com/video-files/36480477/15468883_3840_2160_25fps.mp4','https://www.pexels.com/download/video/36480477/'],
   poster:'https://images.pexels.com/videos/36480477/pexels-photo-36480477.jpeg?auto=compress&dpr=1&h=750&w=1260',
   credit:'Pexels · Grigoriy Bunkov',
   sourcePage:'https://www.pexels.com/video/foggy-highway-traffic-and-low-visibility-scene-36480477/',
   tags:['fog','limited-visibility','dipped-headlights','slow-down','journey-time'],
   note:'CARS4.7 strict-match. Embedded freeze shows a real car and oncoming lights in dense fog; phase 04 now uses verified current footage of vehicles moving through dense fog and low visibility.'
  },

  {
   sceneKey:'aquaplaningHeavyRain',countryPackId:'MT-LPTV',drivingSide:'left',status:'approved',sourceType:'remote-stock',
   video:'https://videos.pexels.com/video-files/1350979/1350979-hd_1920_1080_30fps.mp4',
   videoSources:['https://videos.pexels.com/video-files/1350979/1350979-hd_1920_1080_30fps.mp4','https://www.pexels.com/download/video/1350979/'],
   poster:'https://images.pexels.com/videos/1350979/free-video-1350979.jpg?auto=compress&dpr=1&h=750&w=1260',
   credit:'Pexels · Asif Khan',
   sourcePage:'https://www.pexels.com/video/a-rainy-day-1350979/',
   tags:['heavy-rain','aquaplaning','light-steering','ease-accelerator','wet-road'],
   note:'CARS4.14 strict-match. Embedded freeze shows severe rain through the windscreen with wipers active; phase 04 uses dedicated heavy-rain driving footage.'
  },


  {
   sceneKey:'mobilePhoneDrivingDistraction',countryPackId:'MT-LPTV',drivingSide:'left',status:'approved',sourceType:'remote-stock',
   video:'https://videos.pexels.com/video-files/5290305/5290305-hd_1920_1080_30fps.mp4',
   videoSources:['https://videos.pexels.com/video-files/5290305/5290305-hd_1920_1080_30fps.mp4','https://www.pexels.com/download/video/5290305/'],
   poster:'https://images.pexels.com/videos/5290305/free-video-5290305.jpg?auto=compress&dpr=1&h=750&w=1260',
   credit:'Pexels · faizan amjed',
   sourcePage:'https://www.pexels.com/video/man-answering-a-call-while-driving-5290305/',
   tags:['mobile-phone','driver','driving-distraction','attention-from-road','vehicle-control'],
   note:'CARS1.15 corrected strict-match: phases 01-03 use three distinct real photographs clearly showing mobile-phone use at the steering wheel; phase 04 uses dedicated real footage explicitly described as an adult male driving in rainy conditions while talking on a smartphone, with the road and active driving clearly visible.'
  },

  {
   sceneKey:'mobilePhoneParkedControl',countryPackId:'MT-LPTV',drivingSide:'left',status:'approved',sourceType:'remote-stock',
   video:'https://videos.pexels.com/video-files/5834191/5834191-uhd_2160_3840_24fps.mp4',
   videoSources:['https://videos.pexels.com/video-files/5834191/5834191-uhd_2160_3840_24fps.mp4','https://www.pexels.com/download/video/5834191/'],
   poster:'https://images.pexels.com/videos/5834191/pexels-photo-5834191.jpeg?auto=compress&dpr=1&h=750&w=1260',
   credit:'Pexels · Tim Samuel',
   sourcePage:'https://www.pexels.com/video/cab-driver-sitting-in-car-and-busy-with-phone-5834191/',
   tags:['mobile-phone','parked-vehicle','vehicle-control','safe-stop','stationary-car'],
   note:'CARS1.23 strict-match. Embedded photographic freeze shows a person using a smartphone inside a parked vehicle; phase 04 uses real stationary-car phone footage.'
  },

  {
   sceneKey:'zebraWaitUntilCrossed',countryPackId:'MT-LPTV',drivingSide:'left',status:'approved',sourceType:'remote-stock',
   video:'https://videos.pexels.com/video-files/13308165/13308165-hd_1920_1080_50fps.mp4',
   videoSources:['https://videos.pexels.com/video-files/13308165/13308165-hd_1920_1080_50fps.mp4','https://www.pexels.com/download/video/13308165/'],
   poster:'https://images.pexels.com/videos/13308165/asia-bus-car-city-13308165.jpeg?auto=compress&dpr=1&h=750&w=1260',
   credit:'Pexels · Levi Wedge',
   sourcePage:'https://www.pexels.com/video/people-walking-on-the-street-while-crossing-the-pedestrian-13308165/',
   tags:['zebra-crossing','pedestrians-crossing','remain-stopped','patient-wait','crosswalk'],
   note:'CARS2.5 strict-match. Embedded photographic freeze shows a pedestrian actively crossing a zebra crossing; phase 04 uses real crosswalk footage with pedestrians and traffic.'
  },

  {
   sceneKey:'rainLongerStoppingDistance',countryPackId:'MT-LPTV',drivingSide:'left',status:'approved',sourceType:'remote-stock',
   video:'https://videos.pexels.com/video-files/15442191/15442191-uhd_2158_3840_60fps.mp4',
   videoSources:['https://videos.pexels.com/video-files/15442191/15442191-uhd_2158_3840_60fps.mp4','https://www.pexels.com/download/video/15442191/'],
   poster:'https://images.pexels.com/videos/15442191/4k-video-amazing-car-day-video-15442191.jpeg?auto=compress&dpr=1&h=750&w=1260',
   credit:'Pexels · Rebaz Geo',
   sourcePage:'https://www.pexels.com/video/a-car-parked-on-a-wet-road-on-a-rainy-day-15442191/',
   tags:['rain','wet-road','reduced-grip','longer-stopping-distance','wet-weather-driving'],
   note:'CARS4.11 strict-match. Embedded photographic freeze is a real driver view through a rain-covered windscreen onto a wet road; phase 04 uses dedicated real rainy-road footage.'
  },

  {
   sceneKey:'floodTestBrakes',countryPackId:'MT-LPTV',drivingSide:'left',status:'approved',sourceType:'remote-stock',
   video:'https://videos.pexels.com/video-files/15814789/15814789-hd_1920_1080_30fps.mp4',
   videoSources:['https://videos.pexels.com/video-files/15814789/15814789-hd_1920_1080_30fps.mp4','https://www.pexels.com/download/video/15814789/'],
   poster:'https://images.pexels.com/videos/15814789/pexels-photo-15814789.jpeg?auto=compress&dpr=1&h=750&w=1260',
   credit:'Pexels · Nothing Ahead',
   sourcePage:'https://www.pexels.com/video/a-view-from-inside-a-car-on-a-rainy-day-15814789/',
   tags:['flood-water','vehicle-through-water','brake-test','reduced-brake-effect','wet-brakes'],
   note:'CARS4.15 corrected phase 04: driver-perspective real footage shows the vehicle travelling through rain and standing water, placing the learner directly in the just-driven-through-water scenario before the brake-test instruction.'
  },


  {
   sceneKey:'overtakeCheckFollowingTraffic',countryPackId:'MT-LPTV',drivingSide:'left',status:'approved',sourceType:'remote-stock',
   video:'https://videos.pexels.com/video-files/27551715/12165642_2160_3840_30fps.mp4',
   videoSources:['https://videos.pexels.com/video-files/27551715/12165642_2160_3840_30fps.mp4','https://www.pexels.com/download/video/27551715/'],
   poster:'https://images.pexels.com/videos/27551715/pexels-photo-27551715.jpeg?auto=compress&dpr=1&h=750&w=1260',
   credit:'Pexels · Ольга Шилова',sourcePage:'https://www.pexels.com/video/a-car-is-driving-down-the-road-with-traffic-27551715/',
   tags:['side-mirror','following-traffic','overtaking-check','speed-position','moving-car'],
   note:'CARS1.26 strict-match. Real moving-car footage keeps following traffic visible in the side mirror, directly supporting the pre-overtake mirror check for traffic speed and position.'
  },

  {
   sceneKey:'zebraKeepClearQueues',countryPackId:'MT-LPTV',drivingSide:'left',status:'approved',sourceType:'remote-stock',
   video:'https://videos.pexels.com/video-files/5834617/5834617-uhd_3840_2160_24fps.mp4',
   videoSources:['https://videos.pexels.com/video-files/5834617/5834617-uhd_3840_2160_24fps.mp4','https://www.pexels.com/download/video/5834617/'],
   poster:'https://images.pexels.com/videos/5834617/pexels-photo-5834617.jpeg?auto=compress&dpr=1&h=750&w=1260',
   credit:'Pexels · Tim Samuel',sourcePage:'https://www.pexels.com/video/pedestrians-crossing-while-the-yellow-cab-is-in-full-stop-5834617/',
   tags:['zebra-crossing','vehicle-stopped-before-crossing','pedestrians','crossing-clear','road-safety'],
   note:'CARS2.7 strict-match. A real taxi is fully stopped before the pedestrian crossing while people use it, visibly demonstrating that the crossing itself must remain clear.'
  },

  {
   sceneKey:'zebraPatientWait',countryPackId:'MT-LPTV',drivingSide:'left',status:'approved',sourceType:'remote-stock',
   video:'https://videos.pexels.com/video-files/3657621/3657621-hd_1280_720_30fps.mp4',
   videoSources:['https://videos.pexels.com/video-files/3657621/3657621-hd_1280_720_30fps.mp4','https://www.pexels.com/download/video/3657621/'],
   poster:'https://images.pexels.com/videos/3657621/free-video-3657621.jpg?auto=compress&dpr=1&h=750&w=1260',
   credit:'Pexels · George Morina',sourcePage:'https://www.pexels.com/video/group-of-people-standing-on-sidewalk-waiting-to-cross-the-street-3657621/',
   tags:['pedestrians-waiting','crossing','patience','remain-stopped','london','uk'],
   note:'CARS2.8 strict-match. Real pedestrians are visibly waiting at a London crossing; the Replay teaches the driver to stay patient and not wave, horn or pressure them.'
  },

  {
   sceneKey:'lorryOvertakingSlowDown',countryPackId:'MT-LPTV',drivingSide:'left',status:'approved',sourceType:'remote-stock',
   video:'https://videos.pexels.com/video-files/3010208/3010208-hd_1920_1080_24fps.mp4',
   videoSources:['https://videos.pexels.com/video-files/3010208/3010208-hd_1920_1080_24fps.mp4','https://www.pexels.com/download/video/3010208/'],
   poster:'https://images.pexels.com/videos/3010208/free-video-3010208.jpg?auto=compress&dpr=1&h=750&w=1260',
   credit:'Pexels · Athena Sandrini',sourcePage:'https://www.pexels.com/video/road-travel-footage-on-a-highway-from-inside-a-car-3010208/',
   tags:['heavy-lorry','overtaking','moving-vehicles','slow-down','british-road'],
   note:'CARS2.26 corrected strict-match. Real footage is filmed from inside a heavy truck while it overtakes other vehicles, removing the previous ambiguity where the camera car appeared to be overtaking the lorry. The replay teaches the overtaken driver to ease off and let the lorry complete the pass.'
  },

  {
   sceneKey:'twoSecondSafeGap',countryPackId:'MT-LPTV',drivingSide:'left',status:'approved',sourceType:'remote-stock',
   video:'https://videos.pexels.com/video-files/35186910/14907392_1920_1080_60fps.mp4',
   videoSources:['https://videos.pexels.com/video-files/35186910/14907392_1920_1080_60fps.mp4','https://www.pexels.com/download/video/35186910/'],
   poster:'https://images.pexels.com/videos/35186910/pexels-photo-35186910.jpeg?auto=compress&dpr=1&h=750&w=1260',
   credit:'Pexels · Nothing Ahead',sourcePage:'https://www.pexels.com/video/highway-traffic-view-from-inside-car-35186910/',
   tags:['vehicle-ahead','fixed-reference','two-second-rule','safe-gap','pov-driving','traffic-cones'],
   note:'CARS4.10 strict-match. Driver POV shows a vehicle ahead plus fixed traffic-cone reference points, allowing the Replay to demonstrate exactly how the two-second following-gap check is applied.'
  },


  {
   sceneKey:'engineBrakingLowerGear',countryPackId:'MT-LPTV',drivingSide:'left',status:'approved',sourceType:'remote-stock',
   video:'https://videos.pexels.com/video-files/4707185/4707185-hd_1920_1080_24fps.mp4',
   videoSources:['https://videos.pexels.com/video-files/4707185/4707185-hd_1920_1080_24fps.mp4','https://www.pexels.com/download/video/4707185/'],
   poster:'https://images.pexels.com/videos/4707185/pexels-photo-4707185.jpeg?auto=compress&dpr=1&h=750&w=1260',
   credit:'Pexels · Ricky Esquivel',sourcePage:'https://www.pexels.com/video/shifting-gears-of-a-car-4707185/',
   tags:['manual-gear-lever','manual-transmission','shifting','lower-gear','engine-braking','vehicle-control'],
   note:'CARS4.25 strict-match. Real close-up footage of a manual gear lever makes the required action unambiguous: select a lower gear to obtain engine braking. Phases 01-03 use separate frozen real frames from this same dedicated footage; phase 04 shows the live gear-change action.'
  },

  {
   sceneKey:'elderlyCrossingPatience',countryPackId:'MT-LPTV',drivingSide:'left',status:'approved',sourceType:'remote-stock',
   video:'https://videos.pexels.com/video-files/5970642/5970642-uhd_4096_2160_25fps.mp4',
   videoSources:['https://videos.pexels.com/video-files/5970642/5970642-uhd_4096_2160_25fps.mp4','https://www.pexels.com/download/video/5970642/'],
   poster:'https://images.pexels.com/videos/5970642/pexels-photo-5970642.jpeg?auto=compress&dpr=1&h=750&w=1260',
   credit:'Pexels · cottonbro studio',sourcePage:'https://www.pexels.com/video/an-elderly-woman-crossing-the-street-5970642/',
   tags:['elderly-pedestrian','senior-woman','crossing','crosswalk','walking','patience'],
   note:'CARS6.24 strict-match. Real footage shows an elderly woman crossing a street; the lesson is to remain patient and allow an older pedestrian to cross in her own time. Phases 01-03 are real frozen frames from the dedicated clip and phase 04 is the live crossing.'
  },

  {
   sceneKey:'sideRoadPedestriansWait',countryPackId:'MT-LPTV',drivingSide:'left',status:'approved',sourceType:'remote-stock',
   video:'https://videos.pexels.com/video-files/4791721/4791721-hd_1920_1080_30fps.mp4',
   videoSources:['https://videos.pexels.com/video-files/4791721/4791721-hd_1920_1080_30fps.mp4','https://www.pexels.com/download/video/4791721/'],
   poster:'https://images.pexels.com/videos/4791721/canada-cars-city-footage-4791721.jpeg?auto=compress&dpr=1&h=750&w=1260',
   credit:'Pexels · German Korb',sourcePage:'https://www.pexels.com/video/cars-stopping-on-a-t-road-4791721/',
   tags:['t-road','junction','turns','pedestrians','people-crossing','crosswalk','yield','road-safety'],
   note:'CARS6.4 strict-match. Real T-road footage combines turning traffic, a junction and pedestrians/people crossing; the Replay teaches the turning driver to wait rather than proceed through the pedestrian path. Phases 01-03 are real frozen frames from the clip and phase 04 is the live scene.'
  },

  {
   sceneKey:'junctionSmallRidersVisibility',countryPackId:'MT-LPTV',drivingSide:'left',status:'approved',sourceType:'remote-stock',
   video:'https://videos.pexels.com/video-files/20408588/20408588-hd_1920_1080_50fps.mp4',
   videoSources:['https://videos.pexels.com/video-files/20408588/20408588-hd_1920_1080_50fps.mp4','https://www.pexels.com/download/video/20408588/'],
   poster:'https://images.pexels.com/videos/20408588/pexels-photo-20408588.jpeg?auto=compress&dpr=1&h=750&w=1260',
   credit:'Pexels · David Channel',sourcePage:'https://www.pexels.com/video/a-city-street-with-motorcycles-and-cars-driving-down-it-20408588/',
   tags:['intersection','motorcycles','motorcyclists','cars','mixed-traffic','busy-road','small-road-user'],
   note:'CARS6.36 strict-match. The real mixed-traffic scene visibly places smaller motorcycles among cars near an urban junction, directly illustrating why riders are easier to miss. Phases 01-03 freeze three different real moments; phase 04 shows the traffic in motion.'
  },

  {
   sceneKey:'sideRoadWatchMotorcycles',countryPackId:'MT-LPTV',drivingSide:'left',status:'approved',sourceType:'remote-stock',
   video:'https://videos.pexels.com/video-files/29469397/12685256_1920_1080_30fps.mp4',
   videoSources:['https://videos.pexels.com/video-files/29469397/12685256_1920_1080_30fps.mp4','https://www.pexels.com/download/video/29469397/'],
   poster:'https://images.pexels.com/videos/29469397/pexels-photo-29469397.jpeg?auto=compress&dpr=1&h=750&w=1260',
   credit:'Pexels · NGUYỄN THÀNH NHƠN',sourcePage:'https://www.pexels.com/video/busy-rural-road-with-motorbikes-and-cars-29469397/',
   tags:['crossroad','side-road','motorbikes','motorcycles','cars','traffic-flow','small-road-user'],
   note:'CARS6.37 strict-match. A real crossroad/side-road scene contains motorcycles mixed with cars, making their small visual profile clear when checking before emerging. Phases 01-03 use distinct frozen real moments and phase 04 runs the live traffic.'
  },

  {
   sceneKey:'pedestrianHidden',
   countryPackId:'MT-LPTV',
   drivingSide:'left',
   status:'awaiting-footage',
   sourceType:'local',
   video:'assets/mt/pedestrian-hidden.mp4',
   poster:'assets/mt/pedestrian-hidden.webp',
   credit:'',
   tags:['malta','urban','parked-cars','pedestrian']
  },
  {
   sceneKey:'motorcycleBlindSpot',
   countryPackId:'MT-LPTV',
   drivingSide:'left',
   status:'awaiting-footage',
   sourceType:'local',
   video:'assets/mt/motorcycle-blind-spot.mp4',
   poster:'assets/mt/motorcycle-blind-spot.webp',
   credit:'',
   tags:['malta','mirror','motorcycle','blind-spot']
  },
  {
   sceneKey:'busStopDeparture',
   countryPackId:'MT-LPTV',
   drivingSide:'left',
   status:'awaiting-footage',
   sourceType:'local',
   video:'assets/mt/bus-stop-departure.mp4',
   poster:'assets/mt/bus-stop-departure.webp',
   credit:'',
   tags:['malta','bus','bus-stop']
  },
  {
   sceneKey:'tunnelBreakdown',
   countryPackId:'MT-LPTV',
   drivingSide:'left',
   status:'awaiting-footage',
   sourceType:'local',
   video:'assets/mt/tunnel-breakdown.mp4',
   poster:'assets/mt/tunnel-breakdown.webp',
   credit:'',
   tags:['malta','tunnel','breakdown']
  },
  {
   sceneKey:'junctionRoundabout',
   countryPackId:'MT-LPTV',
   drivingSide:'left',
   status:'awaiting-footage',
   sourceType:'local',
   video:'assets/mt/junction-roundabout.mp4',
   poster:'assets/mt/junction-roundabout.webp',
   credit:'',
   tags:['malta','roundabout','junction','left-driving']
  }
 ].forEach(item=>global.SceneAssets.register(item));
})(window);
