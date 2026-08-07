
(function(global){
 'use strict';
 if(!global.SceneAssets)throw new Error('SceneAssets must load first');

 [

  {
   sceneKey:'cyclistSafePass',countryPackId:'MT-LPTV',drivingSide:'left',status:'approved',sourceType:'remote-stock',
   video:'https://www.pexels.com/download/video/6656000/',poster:'https://images.pexels.com/videos/6656000/free-video-6656000.jpg?auto=compress&dpr=1&h=750&w=1260',credit:'Pexels · 대정 김',
   tags:['country-road','car','cyclist','safe-passing','wide-gap'],note:'Unique real footage for CARS1.18 showing a car and bicycle sharing a country road.'
  },
  {
   sceneKey:'largeVehicleFollowing',countryPackId:'MT-LPTV',drivingSide:'left',status:'approved',sourceType:'remote-stock',
   video:'https://www.pexels.com/download/video/35408009/',poster:'https://images.pexels.com/videos/35408009/free-video-35408009.jpg?auto=compress&dpr=1&h=750&w=1260',credit:'Pexels · Altaf Shah',
   tags:['following','truck','night-road','visibility'],note:'Unique real footage for CARS1.9 showing a driver following a truck.'
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
   video:'https://www.pexels.com/download/video/12769743/',
   poster:'https://images.pexels.com/videos/12769743/free-video-12769743.jpg?auto=compress&dpr=1&h=750&w=1260',
   credit:'Pexels · utopia 36',
   tags:['zebra-crossing','waiting-pedestrians','approaching-traffic'],
   note:'Specific real footage for CARS2.4: pedestrians visibly waiting to cross while traffic passes.'
  },
  {
   sceneKey:'pedestrianWaveAcross',
   countryPackId:'MT-LPTV',
   drivingSide:'left',
   status:'approved',
   sourceType:'remote-stock',
   video:'https://www.pexels.com/download/video/2863232/',
   poster:'https://images.pexels.com/videos/2863232/free-video-2863232.jpg?auto=compress&dpr=1&h=750&w=1260',
   credit:'Pexels · George Morina',
   tags:['pedestrian-crossing','cars','urban-intersection','moving-traffic','pedestrian-risk'],
   note:'Real crossing footage; instructional overlays explain why a driver must not wave a pedestrian across.'
  },
  {
   sceneKey:'overtakeLimitedView',
   countryPackId:'MT-LPTV',
   drivingSide:'left',
   status:'approved',
   sourceType:'remote-stock',
   video:'https://videos.pexels.com/video-files/11791710/11791710-hd_1920_1080_25fps.mp4',
   poster:'https://images.pexels.com/videos/11791710/pexels-photo-11791710.jpeg?auto=compress&dpr=1&h=750&w=1260',
   credit:'Pexels · Vizual Production',
   tags:['left-driving','two-way-road','limited-visibility','rural-road'],
   note:'Final approved real footage for CARS1.10. It demonstrates limited forward visibility on a rural road; the instructional overlay supplies the exact no-overtaking rule.'
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
