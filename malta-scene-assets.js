
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
   video:'https://videos.pexels.com/video-files/30601919/30601919-hd_1920_1080_30fps.mp4',
   videoSources:["https://videos.pexels.com/video-files/30601919/30601919-hd_1920_1080_30fps.mp4", "https://videos.pexels.com/video-files/30601919/30601919-hd_1920_1080_25fps.mp4", "https://www.pexels.com/download/video/30601919/", "https://videos.pexels.com/video-files/6656000/6656000-hd_1920_1080_25fps.mp4", "https://www.pexels.com/download/video/6656000/"],poster:'https://images.pexels.com/videos/30601919/free-video-30601919.jpg?auto=compress&dpr=1&h=750&w=1260',credit:'Pexels · David Pickup',
   sourcePage:'https://www.pexels.com/video/rural-road-with-passing-cars-and-cyclists-30601919/',
   tags:['country-road','rural-road','cars','cyclists','passing','safe-passing','wide-gap'],note:'CARS1.18 strict-match candidate: rural road with cars and cyclists, selected to show the exact passing context rather than a generic cyclist clip.'
  },
  {
   sceneKey:'largeVehicleFollowing',countryPackId:'MT-LPTV',drivingSide:'left',status:'approved',sourceType:'remote-stock',
   video:'https://www.pexels.com/download/video/4608275/',
   videoSources:["https://www.pexels.com/download/video/4608275/", "https://videos.pexels.com/video-files/4608275/4608275-hd_1920_1080_25fps.mp4", "https://videos.pexels.com/video-files/4608275/4608275-hd_1920_1080_30fps.mp4", "https://www.pexels.com/download/video/35408009/"],poster:'https://images.pexels.com/videos/4608275/free-video-4608275.jpg?auto=compress&dpr=1&h=750&w=1260',credit:'Pexels · K',
   sourcePage:'https://www.pexels.com/video/moving-cars-on-expressway-4608275/',
   tags:['pov','following','large-truck','expressway','following-gap','mirror-visibility'],note:'CARS1.9 strict-match: driver POV following large trucks, selected so the learner can judge the following gap and understand why staying back keeps the car visible to the truck driver.'
  },
  {
   sceneKey:'dazzledHeadlights',countryPackId:'MT-LPTV',drivingSide:'left',status:'approved',sourceType:'remote-stock',
   video:'https://www.pexels.com/download/video/34738405/',poster:'https://images.pexels.com/videos/34738405/free-video-34738405.jpg?auto=compress&dpr=1&h=750&w=1260',credit:'Pexels · Ravi Kant',
   tags:['night-driving','driver-view','oncoming-vehicle','headlights','headlight-glare','dark-road'],note:'CARS1.24 dedicated real footage: driver-view night road with approaching vehicle lights; used only for the oncoming-headlight dazzle rule.'
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
   tags:['pov-driving','hilly-road','curvy-road','limited-visibility','rural-road','dip-risk'],
   note:'CARS1.10 strict-match candidate: driver POV on a hilly curving road with forward visibility reduction. Multiple MP4 sources are tried automatically on Safari; final fallback is the last known working direct MP4.'
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
