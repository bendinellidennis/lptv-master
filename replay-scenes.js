
(function(global){
 'use strict';
 if(!global.ReplayEngine) throw new Error('ReplayEngine must load before replay-scenes.js');

 global.ReplayEngine.registerScene({
  id:'MT_OVERTAKE_LIMITED_VIEW_PILOT',
  category:'overtaking',
  country:'MT',
  licenceType:'LPTV',
  drivingSide:'left',
  countryPackId:'MT-LPTV',
  sceneKey:'overtakeLimitedView',
  visualStatus:'pilot-awaiting-malta-footage',
  title:'Overtaking with limited visibility',
  accessibilityLabel:'Real driving on a country road while maintaining lane position',
  playbackRate:0.82,
  media:{
   video:'https://www.pexels.com/download/video/11791710/',
   poster:'https://images.pexels.com/videos/11791710/pexels-photo-11791710.jpeg?auto=compress&dpr=1&h=750&w=1260',
   credit:'Pexels · Vizual Production'
  },
  timeline:[
   {at:0.7,end:2.2,event:'slow',textIt:'Rallenta progressivamente',textEn:'Slow down smoothly'},
   {at:2.8,end:4.5,event:'distance',textIt:'Mantieni la distanza',textEn:'Keep your distance'},
   {at:5.1,end:7.2,event:'lane',textIt:'Resta nella tua corsia',textEn:'Stay in your lane'},
   {at:7.8,end:9.0,event:'wait',textIt:'Attendi visuale completa',textEn:'Wait for a complete view'}
  ],
  learning:{
   correctIt:'Resta dietro al veicolo e sorpassa soltanto quando la corsia opposta è completamente visibile.',
   correctEn:'Stay behind the vehicle and overtake only when the opposing lane is completely visible.'
  }
 });


 const localScenes=[
  {id:'MT_PEDESTRIAN_HIDDEN',sceneKey:'pedestrianHidden',category:'pedestrian',title:'Hidden pedestrian',video:'assets/mt/pedestrian-hidden.mp4',poster:'assets/mt/pedestrian-hidden.webp',timeline:[{at:.5,event:'slow',textIt:'Rallenta',textEn:'Slow down'},{at:2.2,event:'danger',textIt:'Controlla tra le auto',textEn:'Check between parked cars'},{at:4.4,event:'wait',textIt:'Preparati a fermarti',textEn:'Be ready to stop'}]},
  {id:'MT_MOTORCYCLE_BLIND_SPOT',sceneKey:'motorcycleBlindSpot',category:'motorcycle',title:'Motorcycle blind spot',video:'assets/mt/motorcycle-blind-spot.mp4',poster:'assets/mt/motorcycle-blind-spot.webp',timeline:[{at:.5,event:'info',textIt:'Specchi',textEn:'Mirrors'},{at:2.2,event:'danger',textIt:'Controlla angolo cieco',textEn:'Check blind spot'},{at:4.5,event:'wait',textIt:'Aspetta prima di cambiare corsia',textEn:'Wait before changing lane'}]},
  {id:'MT_BUS_STOP_DEPARTURE',sceneKey:'busStopDeparture',category:'bus',title:'Bus departure',video:'assets/mt/bus-stop-departure.mp4',poster:'assets/mt/bus-stop-departure.webp',timeline:[{at:.5,event:'slow',textIt:'Rallenta',textEn:'Slow down'},{at:2.4,event:'danger',textIt:'Autobus segnala la partenza',textEn:'Bus signals to leave'},{at:4.8,event:'wait',textIt:'Lascia spazio se è sicuro',textEn:'Give room if safe'}]},
  {id:'MT_TUNNEL_BREAKDOWN',sceneKey:'tunnelBreakdown',category:'tunnel',title:'Tunnel safety',video:'assets/mt/tunnel-breakdown.mp4',poster:'assets/mt/tunnel-breakdown.webp',timeline:[{at:.5,event:'info',textIt:'Accendi le luci',textEn:'Switch on lights'},{at:2.4,event:'lane',textIt:'Resta in corsia',textEn:'Stay in lane'},{at:4.8,event:'danger',textIt:'Segnala il pericolo',textEn:'Warn of danger'}]},
  {id:'MT_JUNCTION_ROUNDABOUT',sceneKey:'junctionRoundabout',category:'junction',title:'Junction visibility',video:'assets/mt/junction-roundabout.mp4',poster:'assets/mt/junction-roundabout.webp',timeline:[{at:.5,event:'slow',textIt:'Avanza lentamente',textEn:'Creep forward slowly'},{at:2.4,event:'danger',textIt:'Visuale limitata',textEn:'Restricted view'},{at:4.8,event:'wait',textIt:'Entra solo quando è libero',textEn:'Proceed only when clear'}]}
 ];
 localScenes.forEach(item=>global.ReplayEngine.registerScene({id:item.id,category:item.category,country:'MT',licenceType:'LPTV',drivingSide:'left',countryPackId:'MT-LPTV',sceneKey:item.sceneKey,visualStatus:'local-animation-v1',title:item.title,accessibilityLabel:item.title,playbackRate:1,media:{video:item.video,poster:item.poster,credit:'Malta Driving Master · Replay Library'},timeline:item.timeline,learning:{correctIt:'Osserva il pericolo, rallenta e scegli l’azione più sicura.',correctEn:'Observe the hazard, slow down and choose the safest action.'}}));

})(window);
