
(function(global){
 'use strict';
 if(!global.SceneAssets)throw new Error('SceneAssets must load first');

 [
  {
   sceneKey:'zebraWaitingStop',
   countryPackId:'MT-LPTV',
   drivingSide:'left',
   status:'approved',
   sourceType:'remote-stock',
   video:'https://www.pexels.com/download/video/2863232/',
   poster:'https://images.pexels.com/videos/2863232/free-video-2863232.jpg?auto=compress&dpr=1&h=750&w=1260',
   credit:'Pexels · George Morina',
   tags:['zebra-crossing','waiting-pedestrians','approaching-traffic'],
   note:'Real crossing footage used specifically for CARS2.4 with question-specific overlays and timing.'
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
   tags:['pedestrian-crossing','cars','urban-intersection'],
   note:'Real crossing footage; instructional overlays explain why a driver must not wave a pedestrian across.'
  },
  {
   sceneKey:'overtakeLimitedView',
   countryPackId:'MT-LPTV',
   drivingSide:'left',
   status:'approved',
   sourceType:'remote-pilot',
   video:'https://www.pexels.com/download/video/11791710/',
   poster:'https://images.pexels.com/videos/11791710/pexels-photo-11791710.jpeg?auto=compress&dpr=1&h=750&w=1260',
   credit:'Pexels · Vizual Production',
   tags:['left-driving-compatible','rural-road','limited-view'],
   note:'Technical pilot; not authentic Malta footage.'
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
