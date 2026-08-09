/* 39.12.16 Replay75 — five new strict real-media assets. */
/* 39.12.15 Replay70 — five new strict real-media assets. */
/* 39.12.13 Replay60 — five new strict sign/signal assets. */

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
   sceneKey:'noEntrySignMeaning',countryPackId:'MT-LPTV',drivingSide:'left',status:'approved',sourceType:'remote-stock',
   video:'https://videos.pexels.com/video-files/34633268/14679167_3840_2160_50fps.mp4',
   videoSources:['https://videos.pexels.com/video-files/34633268/14679167_3840_2160_50fps.mp4','https://www.pexels.com/download/video/34633268/'],
   poster:'https://images.pexels.com/videos/34633268/pexels-photo-34633268.jpeg?auto=compress&dpr=1&h=750&w=1260',credit:'Pexels · Salim Da',sourcePage:'https://www.pexels.com/video/no-entry-and-turn-prohibition-signs-in-forest-34633268/',
   tags:['no-entry-sign','prohibition','regulatory-sign','road-safety'],
   note:'CARS11.9 strict-match. Real no-entry sign is unmistakably visible in 01-03; phase 04 uses dedicated real footage of entry/turn prohibition signs.'
  },

  {
   sceneKey:'triangularSignsWarnings',countryPackId:'MT-LPTV',drivingSide:'left',status:'approved',sourceType:'remote-stock',
   video:'https://videos.pexels.com/video-files/12950315/12950315-hd_1080_1920_30fps.mp4',
   videoSources:['https://videos.pexels.com/video-files/12950315/12950315-hd_1080_1920_30fps.mp4','https://www.pexels.com/download/video/12950315/'],
   poster:'https://images.pexels.com/videos/12950315/pexels-photo-12950315.jpeg?auto=compress&dpr=1&h=750&w=1260',credit:'Pexels · Nothing Ahead',sourcePage:'https://www.pexels.com/video/motorcycles-passing-by-road-signs-12950315/',
   tags:['triangular-sign','warning-sign','winding-road','road-hazard'],
   note:'CARS11.30 strict-match. A real triangular winding-road warning sign dominates the photographic phases; phase 04 shows the same real warning sign in a live road scene.'
  },

  {
   sceneKey:'trafficLightRedAmberGreenSequence',countryPackId:'MT-LPTV',drivingSide:'left',status:'approved',sourceType:'remote-stock',
   video:'https://videos.pexels.com/video-files/30787610/13168508_3840_2160_25fps.mp4',
   videoSources:['https://videos.pexels.com/video-files/30787610/13168508_3840_2160_25fps.mp4','https://www.pexels.com/download/video/30787610/'],
   poster:'https://images.pexels.com/videos/30787610/amber-building-bus-car-30787610.jpeg?auto=compress&dpr=1&h=750&w=1260',credit:'Pexels · Media Hopper Studio',sourcePage:'https://www.pexels.com/video/traffic-light-transition-in-edinburgh-cityscape-30787610/',
   tags:['traffic-light','red','red-amber','green','uk-sequence'],
   note:'CARS11.55 strict-match. 01-03 use real UK photographs showing red, red+amber and green in the exact taught order; phase 04 is real Edinburgh footage of a traffic-light transition. Still-photo attribution: Gary / Geograph, Wikimedia Commons, CC BY-SA 2.0.'
  },

  {
   sceneKey:'redLightStopBehindLine',countryPackId:'MT-LPTV',drivingSide:'left',status:'approved',sourceType:'remote-stock',
   video:'https://videos.pexels.com/video-files/3552475/3552475-hd_1920_1080_30fps.mp4',
   videoSources:['https://videos.pexels.com/video-files/3552475/3552475-hd_1920_1080_30fps.mp4','https://www.pexels.com/download/video/3552475/'],
   poster:'https://images.pexels.com/videos/3552475/free-video-3552475.jpg?auto=compress&dpr=1&h=750&w=1260',credit:'Pexels · Marc Van den Broeck',sourcePage:'https://www.pexels.com/video/motor-vehicles-stopping-on-a-red-light-of-the-traffic-lights-3552475/',
   tags:['red-light','cars-stopping','intersection','stop','traffic-signal'],
   note:'CARS11.56 strict-match. 01-03 show a real red-light stopping scene; phase 04 shows motor vehicles stopping at a red traffic signal.'
  },

  {
   sceneKey:'amberLightPrepareStop',countryPackId:'MT-LPTV',drivingSide:'left',status:'approved',sourceType:'remote-stock',
   video:'https://videos.pexels.com/video-files/3999410/3999410-hd_1920_1080_24fps.mp4',
   videoSources:['https://videos.pexels.com/video-files/3999410/3999410-hd_1920_1080_24fps.mp4','https://www.pexels.com/download/video/3999410/'],
   poster:'https://images.pexels.com/videos/3999410/pexels-photo-3999410.jpeg?auto=compress&dpr=1&h=750&w=1260',credit:'Pexels · K',sourcePage:'https://www.pexels.com/video/traffic-light-with-yellow-light-turning-to-red-3999410/',
   tags:['amber-light','yellow-signal','prepare-stop','traffic-light'],
   note:'CARS11.57 strict-match. 01-03 clearly show an amber signal on its own; phase 04 is a real close-up of the amber signal changing to red, reinforcing preparation to stop.'
  },



  {
   sceneKey:'noRightTurnSignMeaning',countryPackId:'MT-LPTV',drivingSide:'left',status:'approved',sourceType:'remote-stock',
   video:'https://videos.pexels.com/video-files/35672646/15116891_1080_1920_60fps.mp4',
   videoSources:['https://videos.pexels.com/video-files/35672646/15116891_1080_1920_60fps.mp4','https://www.pexels.com/download/video/35672646/'],
   poster:'https://images.pexels.com/videos/35672646/pexels-photo-35672646.jpeg?auto=compress&dpr=1&h=750&w=1260',credit:'Pexels · Ebahir',sourcePage:'https://www.pexels.com/video/snowy-winter-road-with-no-right-turn-sign-35672646/',
   tags:['no-right-turn','prohibition-sign','road','car'],
   note:'CARS11.10 strict-match. Real no-right-turn sign is clearly visible; phase 04 shows a car on the road with that exact prohibition sign.'
  },
  {
   sceneKey:'redTrafficLightMeaning',countryPackId:'MT-LPTV',drivingSide:'left',status:'approved',sourceType:'remote-stock',
   video:'https://videos.pexels.com/video-files/4524964/4524964-hd_1920_1080_30fps.mp4',
   videoSources:['https://videos.pexels.com/video-files/4524964/4524964-hd_1920_1080_30fps.mp4','https://www.pexels.com/download/video/4524964/'],
   poster:'https://images.pexels.com/videos/4524964/red-signal-red-traffic-light-red-traffic-signal-traffic-light-4524964.jpeg?auto=compress&dpr=1&h=750&w=1260',credit:'Pexels · Ashok kumar Shah',sourcePage:'https://www.pexels.com/video/red-traffic-light-4524964/',
   tags:['red-light','traffic-signal','stop','road-safety'],
   note:'CARS11.58 strict-match. Real red traffic signal fills the scene; the taught action is to stop behind the white stop line.'
  },
  {
   sceneKey:'maximumSpeedLimitMeaning',countryPackId:'MT-LPTV',drivingSide:'left',status:'approved',sourceType:'remote-stock',
   video:'https://videos.pexels.com/video-files/12950311/12950311-hd_1080_1920_30fps.mp4',
   videoSources:['https://videos.pexels.com/video-files/12950311/12950311-hd_1080_1920_30fps.mp4','https://www.pexels.com/download/video/12950311/'],
   poster:'https://images.pexels.com/videos/12950311/pexels-photo-12950311.jpeg?auto=compress&dpr=1&h=750&w=1260',credit:'Pexels · Nothing Ahead',sourcePage:'https://www.pexels.com/video/car-passing-by-road-signs-12950311/',
   tags:['maximum-speed-limit','40-kph','road-sign','legal-maximum'],
   note:'CARS10.6 strict-match. A real MAX 40 KPH sign is clearly visible; the exact principle is that the displayed number is the maximum and must not be exceeded.'
  },
  {
   sceneKey:'ballIntoRoadChildren',countryPackId:'MT-LPTV',drivingSide:'left',status:'approved',sourceType:'remote-stock',
   video:'https://videos.pexels.com/video-files/16436835/16436835-hd_1920_1080_24fps.mp4',
   videoSources:['https://videos.pexels.com/video-files/16436835/16436835-hd_1920_1080_24fps.mp4','https://www.pexels.com/download/video/16436835/'],
   poster:'https://images.pexels.com/videos/16436835/pexels-photo-16436835.jpeg?auto=compress&dpr=1&h=750&w=1260',credit:'Pexels · Ali Alcántara',sourcePage:'https://www.pexels.com/video/a-red-and-white-soccer-ball-rolling-on-the-street-16436835/',
   tags:['ball','street','child-hazard','slow-down','prepare-stop'],
   note:'CARS6.18 strict-match. The real video shows the exact hazard cue: a football rolling into the street. Replay teaching links that cue to a child possibly following it.'
  },
  {
   sceneKey:'wheelchairZebraPrepareStop',countryPackId:'MT-LPTV',drivingSide:'left',status:'approved',sourceType:'remote-stock',
   video:'https://videos.pexels.com/video-files/3206945/3206945-uhd_3840_2160_30fps.mp4',
   videoSources:['https://videos.pexels.com/video-files/3206945/3206945-uhd_3840_2160_30fps.mp4','https://www.pexels.com/download/video/3206945/'],
   poster:'https://images.pexels.com/videos/3206945/free-video-3206945.jpg?auto=compress&dpr=1&h=750&w=1260',credit:'Pexels · George Morina',sourcePage:'https://www.pexels.com/video/traveling-a-street-in-central-london-3206945/',
   tags:['wheelchair','crosswalk','pedestrian-crossing','traffic','prepare-stop'],
   note:'CARS6.23 strict-match. Real London street footage is explicitly tagged with wheelchair, pedestrian crossing, traffic lights and vehicles, providing the exact vulnerable-road-user context.'
  },


  {
   sceneKey:'whiteStickBlindPedestrian',countryPackId:'MT-LPTV',drivingSide:'left',status:'approved',sourceType:'remote-stock',
   video:'https://videos.pexels.com/video-files/8322535/8322535-uhd_2160_4096_25fps.mp4',
   videoSources:['https://videos.pexels.com/video-files/8322535/8322535-uhd_2160_4096_25fps.mp4','https://www.pexels.com/download/video/8322535/'],
   poster:'https://images.pexels.com/videos/8322535/pexels-photo-8322535.jpeg?auto=compress&dpr=1&h=750&w=1260',credit:'Pexels · MART PRODUCTION',sourcePage:'https://www.pexels.com/video/person-using-a-walking-stick-8322535/',
   tags:['white-stick','blind-pedestrian','visual-impairment','pedestrian','walking-stick'],
   note:'CARS6.22 strict-match. The real scene visibly shows a visually impaired pedestrian using a white mobility cane; the correct answer is that the person is blind.'
  },
  {
   sceneKey:'correctiveGlassesAlwaysDriving',countryPackId:'MT-LPTV',drivingSide:'left',status:'approved',sourceType:'remote-stock',
   video:'https://videos.pexels.com/video-files/5834804/5834804-uhd_3840_2160_24fps.mp4',
   videoSources:['https://videos.pexels.com/video-files/5834804/5834804-uhd_3840_2160_24fps.mp4','https://www.pexels.com/download/video/5834804/'],
   poster:'https://images.pexels.com/videos/5834804/pexels-photo-5834804.jpeg?auto=compress&dpr=1&h=750&w=1260',credit:'Pexels · Tim Samuel',sourcePage:'https://www.pexels.com/video/a-cab-driver-on-his-way-5834804/',
   tags:['driver','glasses','driving','corrective-lenses','road-visible'],
   note:'CARS5.3 strict-match. Phase 01-03 use a separate real close-up photo where corrective glasses are unmistakably visible on a driver; phase 04 uses real driving footage explicitly tagged with eyeglasses and driving.'
  },
  {
   sceneKey:'eyesightStandardCorrectiveLenses',countryPackId:'MT-LPTV',drivingSide:'left',status:'approved',sourceType:'remote-stock',
   video:'https://videos.pexels.com/video-files/3704118/3704118-hd_1920_1080_30fps.mp4',
   videoSources:['https://videos.pexels.com/video-files/3704118/3704118-hd_1920_1080_30fps.mp4','https://www.pexels.com/download/video/3704118/'],
   poster:'https://images.pexels.com/videos/3704118/driving-glasses-look-up-stop-3704118.jpeg?auto=compress&dpr=1&h=750&w=1260',credit:'Pexels · Rholdan Ortiz',sourcePage:'https://www.pexels.com/video/footage-of-a-woman-waiting-at-the-traffic-light-3704118/',
   tags:['driver','glasses','eyesight-standard','corrective-lenses','traffic'],
   note:'CARS5.5 strict-match. The stills clearly show a driver wearing glasses; phase 04 shows a real female driver with glasses in live traffic, reinforcing that required corrective lenses must be worn while driving.'
  },
  {
   sceneKey:'hardShoulderEmergencyOnly',countryPackId:'MT-LPTV',drivingSide:'left',status:'approved',sourceType:'remote-stock',
   video:'https://videos.pexels.com/video-files/2881486/2881486-uhd_3840_2160_30fps.mp4',
   videoSources:['https://videos.pexels.com/video-files/2881486/2881486-uhd_3840_2160_30fps.mp4','https://www.pexels.com/download/video/2881486/'],
   poster:'https://images.pexels.com/videos/2881486/free-video-2881486.jpg?auto=compress&dpr=1&h=750&w=1260',credit:'Pexels · Suraphat Nuea-on',sourcePage:'https://www.pexels.com/video/men-changing-a-flat-tire-assisted-by-highway-police-2881486/',
   tags:['highway','roadside','emergency-stop','breakdown','flat-tyre','roadside-assistance'],
   note:'CARS9.7 strict-match. A vehicle is stopped at the edge of a highway because of a flat-tyre emergency and receives roadside/highway-police assistance; this is the exact emergency-use context for a hard shoulder.'
  },
  {
   sceneKey:'doNotFollowTooClosely',countryPackId:'MT-LPTV',drivingSide:'left',status:'approved',sourceType:'remote-stock',
   video:'https://videos.pexels.com/video-files/5786587/5786587-uhd_3840_2160_30fps.mp4',
   videoSources:['https://videos.pexels.com/video-files/5786587/5786587-uhd_3840_2160_30fps.mp4','https://www.pexels.com/download/video/5786587/'],
   poster:'https://images.pexels.com/videos/5786587/pexels-photo-5786587.jpeg?auto=compress&dpr=1&h=750&w=1260',credit:'Pexels · Tom Fisk',sourcePage:'https://www.pexels.com/video/vehicles-moving-on-a-highway-5786587/',
   tags:['vehicle-ahead','following-distance','safe-gap','traffic','pov'],
   note:'CARS2.12 strict-match. Phase 01-03 use a real driver-view photograph showing substantial space to vehicles ahead; phase 04 uses real POV traffic footage so the learner sees the correct alternative to following too closely.'
  },


  {
   sceneKey:'brakeLightsSignal',countryPackId:'MT-LPTV',drivingSide:'left',status:'approved',sourceType:'remote-stock',
   video:'https://videos.pexels.com/video-files/4099070/4099070-hd_1920_1080_30fps.mp4',
   videoSources:['https://videos.pexels.com/video-files/4099070/4099070-hd_1920_1080_30fps.mp4','https://www.pexels.com/download/video/4099070/'],
   poster:'https://images.pexels.com/videos/4099070/pexels-photo-4099070.jpeg?auto=compress&dpr=1&h=750&w=1260',credit:'Pexels · TYPHOON BRO',sourcePage:'https://www.pexels.com/video/balloon-hot-air-balloons-balloon-fiesta-4099070/',
   tags:['brake-lights','rear-vehicle','slowing-stopping','signal','stop-lights','traffic'],
   note:'CARS10.25 strict-match. The real rear view clearly shows the vehicle ahead with its brake/stop lights illuminated; phase 04 keeps the same real traffic context in motion.'
  },
  {
   sceneKey:'hazardLightsSuddenSlowdown',countryPackId:'MT-LPTV',drivingSide:'left',status:'approved',sourceType:'remote-stock',
   video:'https://videos.pexels.com/video-files/5004303/5004303-hd_1920_1080_30fps.mp4',
   videoSources:['https://videos.pexels.com/video-files/5004303/5004303-hd_1920_1080_30fps.mp4','https://www.pexels.com/download/video/5004303/'],
   poster:'https://images.pexels.com/videos/5004303/norway-oslo-5004303.jpeg?auto=compress&dpr=1&h=750&w=1260',credit:'Pexels · Joshua Miranda',sourcePage:'https://www.pexels.com/video/vehicles-traveling-on-expressway-while-raining-5004303/',
   tags:['dual-carriageway','hazard-lights','traffic-ahead','sudden-slowing','expressway','traffic'],
   note:'CARS9.4 strict-match. Real expressway traffic footage is explicitly indexed with hazard lights and shows traffic ahead in a fast-road environment, matching the warning of sudden slowing/stopping.'
  },
  {
   sceneKey:'longVehicleRoundaboutCourse',countryPackId:'MT-LPTV',drivingSide:'left',status:'approved',sourceType:'remote-stock',
   video:'https://videos.pexels.com/video-files/34742973/14728346_3840_2160_60fps.mp4',
   videoSources:['https://videos.pexels.com/video-files/34742973/14728346_3840_2160_60fps.mp4','https://www.pexels.com/download/video/34742973/'],
   poster:'https://images.pexels.com/videos/34742973/pexels-photo-34742973.jpeg?auto=compress&dpr=1&h=750&w=1260',credit:'Pexels · 强 王',sourcePage:'https://www.pexels.com/video/scenic-electric-bus-roundabout-journey-34742973/',
   tags:['long-vehicle','bus','roundabout','wide-course','large-vehicle'],
   note:'CARS10.27 strict-match. Real long buses are visibly negotiating a roundabout, directly illustrating why a long vehicle may need a different/wider course.'
  },
  {
   sceneKey:'leftLaneBeforeExit',countryPackId:'MT-LPTV',drivingSide:'left',status:'approved',sourceType:'remote-stock',
   video:'https://videos.pexels.com/video-files/3621864/3621864-hd_1280_720_30fps.mp4',
   videoSources:['https://videos.pexels.com/video-files/3621864/3621864-hd_1280_720_30fps.mp4','https://www.pexels.com/download/video/3621864/'],
   poster:'https://images.pexels.com/videos/3621864/free-video-3621864.jpg?auto=compress&dpr=1&h=750&w=1260',credit:'Pexels · George Morina',sourcePage:'https://www.pexels.com/video/shoulder-roads-as-exit-points-coming-from-a-highway-3621864/',
   tags:['uk-motorway','left-driving','exit','left-lane','multi-lane-carriageway'],
   note:'CARS9.10 strict-match. Real UK motorway/exit footage keeps the driving side and exit context visible so the learner associates the next exit with moving into the left lane in good time.'
  },
  {
   sceneKey:'giveWayPedestriansJunction',countryPackId:'MT-LPTV',drivingSide:'left',status:'approved',sourceType:'remote-stock',
   video:'https://videos.pexels.com/video-files/36304391/15396212_1920_1080_25fps.mp4',
   videoSources:['https://videos.pexels.com/video-files/36304391/15396212_1920_1080_25fps.mp4','https://www.pexels.com/download/video/36304391/'],
   poster:'https://images.pexels.com/videos/36304391/pexels-photo-36304391.jpeg?auto=compress&dpr=1&h=750&w=1260',credit:'Pexels · Scott Precious',sourcePage:'https://www.pexels.com/video/busy-city-intersection-with-traffic-and-pedestrians-36304391/',
   tags:['junction','pedestrians-crossing','vehicles','give-way','uk','intersection'],
   note:'CARS6.5 strict-match. Phase 01-03 use a separate real crossing frame where pedestrians are unmistakable; phase 04 uses a real UK intersection with cars, a bus and pedestrians crossing through the junction.'
  },

  {
   sceneKey:'hardShoulderRejoinSpeed',countryPackId:'MT-LPTV',drivingSide:'left',status:'approved',sourceType:'remote-stock',
   video:'https://www.pexels.com/download/video/4320049/',videoSources:['https://www.pexels.com/download/video/4320049/'],
   poster:'https://images.pexels.com/videos/4320049/caminhao-de-carga-4320049.jpeg?auto=compress&dpr=1&h=750&w=1260',credit:'Pexels · SANDRO CALABREZI',sourcePage:'https://www.pexels.com/video/caminhao-de-carga-4320049/',
   tags:['hard-shoulder','highway-entry','build-speed','merge','cargo-truck','highway'],
   note:'CARS9.8 strict-match. Dedicated real footage shows a heavy vehicle entering a highway from the shoulder/entry road. Replay teaching focuses on building speed before safely merging, never moving out first and accelerating afterwards.'
  },
  {
   sceneKey:'missedExitContinueNext',countryPackId:'MT-LPTV',drivingSide:'left',status:'approved',sourceType:'remote-stock',
   video:'https://www.pexels.com/download/video/4035988/',videoSources:['https://www.pexels.com/download/video/4035988/'],
   poster:'https://images.pexels.com/videos/4035988/pexels-photo-4035988.jpeg?auto=compress&dpr=1&h=750&w=1260',credit:'Pexels · K',sourcePage:'https://www.pexels.com/video/close-up-shot-of-a-road-signs-4035988/',
   tags:['highway','exit-sign','road-signs','continue-forward','next-exit'],
   note:'CARS9.11 strict-match. Real highway footage prominently shows an EXIT sign and continuing traffic. The Replay makes the correct recovery explicit: continue forward to the next exit; never reverse or U-turn.'
  },
  {
   sceneKey:'driverCausesSkid',countryPackId:'MT-LPTV',drivingSide:'left',status:'approved',sourceType:'remote-stock',
   video:'https://www.pexels.com/download/video/36224050/',videoSources:['https://www.pexels.com/download/video/36224050/'],
   poster:'https://images.pexels.com/videos/36224050/pexels-photo-36224050.jpeg?auto=compress&dpr=1&h=750&w=1260',credit:'Pexels · Harvey Tan Villarino',sourcePage:'https://www.pexels.com/video/white-car-drifting-on-winding-road-outdoors-36224050/',
   tags:['driver','skid','sideways-motion','high-speed','curved-road','car-control'],
   note:'CARS4.16 strict-match. The real vehicle is deliberately driven into a visible skid/sideways motion on a curved road, directly illustrating that driver input is the main cause of this skid rather than the road acting by itself.'
  },
  {
   sceneKey:'shockStayAndReassure',countryPackId:'MT-LPTV',drivingSide:'left',status:'approved',sourceType:'remote-stock',
   video:'https://www.pexels.com/download/video/6687814/',videoSources:['https://www.pexels.com/download/video/6687814/'],
   poster:'https://images.pexels.com/videos/6687814/pexels-photo-6687814.jpeg?auto=compress&dpr=1&h=750&w=1260',credit:'Pexels · Pavel Danilyuk',sourcePage:'https://www.pexels.com/video/emt-holding-woman-s-hand-6687814/',
   tags:['patient','paramedic','hand-holding','reassurance','stay-with-casualty','emergency-care'],
   note:'CARS13.11 strict-match. Real emergency-care footage visibly shows the responder remaining beside the patient and holding her hand, matching both correct actions: do not leave the casualty alone and reassure them.'
  },
  {
   sceneKey:'firstAidAbc',countryPackId:'MT-LPTV',drivingSide:'left',status:'approved',sourceType:'remote-stock',
   video:'https://www.pexels.com/download/video/3981743/',videoSources:['https://www.pexels.com/download/video/3981743/'],
   poster:'https://images.pexels.com/videos/3981743/pexels-photo-3981743.jpeg?auto=compress&dpr=1&h=750&w=1260',credit:'Pexels · Gustavo Fring',sourcePage:'https://www.pexels.com/video/people-practicing-bag-valve-mask-ventilation-on-dummy-3981743/',
   tags:['first-aid','airway-management','breathing','cpr','circulation','resuscitation-training'],
   note:'CARS13.8 strict-match. Real CPR/airway training visibly uses airway-management and ventilation equipment; Replay labels the full ABC sequence: Airway, Breathing, Circulation.'
  },

  {
   sceneKey:'rightBendImproveView',countryPackId:'MT-LPTV',drivingSide:'left',status:'approved',sourceType:'remote-stock',
   video:'https://videos.pexels.com/video-files/37630187/15950521_2160_3840_60fps.mp4',videoSources:['https://videos.pexels.com/video-files/37630187/15950521_2160_3840_60fps.mp4','https://www.pexels.com/download/video/37630187/'],
   poster:'https://images.pexels.com/videos/37630187/pexels-photo-37630187.jpeg?auto=compress&dpr=1&h=750&w=1260',credit:'Pexels · Piotr Wojnowski',sourcePage:'https://www.pexels.com/video/aerial-view-of-scenic-countryside-road-37630187/',
   tags:['right-hand-bend','keep-left','better-view','uk-road','winding-road','cars'],
   note:'CARS4.28 strict-match. Real UK countryside road footage visibly shows a pronounced bend and traffic; the Replay highlights the left-side road position because keeping left improves the view around a right-hand bend.'
  },
  {
   sceneKey:'rightBendKeepLeft',countryPackId:'MT-LPTV',drivingSide:'left',status:'approved',sourceType:'remote-stock',
   video:'https://videos.pexels.com/video-files/29353529/12650032_3840_2160_30fps.mp4',videoSources:['https://videos.pexels.com/video-files/29353529/12650032_3840_2160_30fps.mp4','https://www.pexels.com/download/video/29353529/'],
   poster:'https://images.pexels.com/videos/29353529/pexels-photo-29353529.jpeg?auto=compress&dpr=1&h=750&w=1260',credit:'Pexels · David Pickup | Advertising & Marketing 🇬🇧',sourcePage:'https://www.pexels.com/video/car-on-winding-countryside-road-on-overcast-day-29353529/',
   tags:['right-hand-bend','keep-left','better-view','british-countryside','winding-road','car'],
   note:'CARS4.29 strict-match. A real car approaches and travels through a winding British countryside road; the scene is used only to teach keeping left for the better view, not to make the bend faster.'
  },
  {
   sceneKey:'dualCarriagewayKeepLeft',countryPackId:'MT-LPTV',drivingSide:'left',status:'approved',sourceType:'remote-stock',
   video:'https://videos.pexels.com/video-files/26617954/11975399_3840_2160_30fps.mp4',videoSources:['https://videos.pexels.com/video-files/26617954/11975399_3840_2160_30fps.mp4','https://www.pexels.com/download/video/26617954/'],
   poster:'https://images.pexels.com/videos/26617954/fast-fast-cars-fast-moving-vehicles-m1-26617954.jpeg?auto=compress&dpr=1&h=750&w=1260',credit:'Pexels · David Pickup | Advertising & Marketing 🇬🇧',sourcePage:'https://www.pexels.com/video/fast-cars-on-motorway-26617954/',
   tags:['dual-carriageway','keep-left','overtaking-rule','uk-motorway','multiple-lanes','traffic'],
   note:'CARS9.3 strict-match. Real UK motorway traffic provides left-driving, multi-lane context; Replay explicitly marks the normal left lane and explains that other lanes are for overtaking.'
  },
  {
   sceneKey:'twoSecondMinimumGap',countryPackId:'MT-LPTV',drivingSide:'left',status:'approved',sourceType:'remote-stock',
   video:'https://videos.pexels.com/video-files/26616229/11974836_3840_2160_30fps.mp4',videoSources:['https://videos.pexels.com/video-files/26616229/11974836_3840_2160_30fps.mp4','https://www.pexels.com/download/video/26616229/'],
   poster:'https://images.pexels.com/videos/26616229/a1-motorway-motorway-traffic-in-the-uk-three-lane-motorway-26616229.jpeg?auto=compress&dpr=1&h=750&w=1260',credit:'Pexels · David Pickup | Advertising & Marketing 🇬🇧',sourcePage:'https://www.pexels.com/video/motorway-traffic-in-the-uk-26616229/',
   tags:['vehicle-ahead','safe-gap','two-second-rule','uk-motorway','good-conditions','traffic'],
   note:'CARS9.9 strict-match. Clear daytime UK motorway traffic shows vehicles travelling with visible space between them; Replay turns that visible gap into the minimum two-second rule in good conditions.'
  },
  {
   sceneKey:'collisionStopAtScene',countryPackId:'MT-LPTV',drivingSide:'left',status:'approved',sourceType:'remote-stock',
   video:'https://videos.pexels.com/video-files/12901485/12901485-uhd_3840_2160_24fps.mp4',videoSources:['https://videos.pexels.com/video-files/12901485/12901485-uhd_3840_2160_24fps.mp4','https://www.pexels.com/download/video/12901485/'],
   poster:'https://images.pexels.com/videos/12901485/pexels-photo-12901485.jpeg?auto=compress&dpr=1&h=750&w=1260',credit:'Pexels · K',sourcePage:'https://www.pexels.com/video/accident-on-highway-12901485/',
   tags:['collision','crash-scene','stop-at-scene','vehicle-damage','road-incident','stopped-traffic'],
   note:'CARS6.59 strict-match. Real collision aftermath clearly shows a damaged vehicle stopped at the incident scene, directly supporting the first required action after a collision: stop at the scene.'
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
