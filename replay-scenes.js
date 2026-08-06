
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

 global.ReplayEngine.registerScene({
  id:'MT_PEDESTRIAN_WAVE_ACROSS_V1',
  category:'pedestrian',
  country:'MT',
  licenceType:'LPTV',
  drivingSide:'left',
  countryPackId:'MT-LPTV',
  sceneKey:'pedestrianWaveAcross',
  visualStatus:'real-footage-with-instructional-overlay',
  title:'Never wave a pedestrian across',
  accessibilityLabel:'Pedestrians and moving traffic at a pedestrian crossing',
  playbackRate:0.9,
  media:{
   video:'https://www.pexels.com/download/video/2863232/',
   poster:'https://images.pexels.com/videos/2863232/free-video-2863232.jpg?auto=compress&dpr=1&h=750&w=1260',
   credit:'Pexels · George Morina'
  },
  timeline:[
   {at:0.5,event:'info',textIt:'Osserva il pedone e tutto il traffico',textEn:'Observe the pedestrian and all traffic'},
   {at:2.5,event:'danger',textIt:'Un gesto può essere interpretato come via libera',textEn:'A gesture may be interpreted as permission to cross'},
   {at:4.5,event:'slow',textIt:'Rallenta e mantieni il controllo',textEn:'Slow down and remain in control'},
   {at:6.5,event:'wait',textIt:'Non fare cenni: lascia decidere il pedone',textEn:'Do not wave: let the pedestrian decide'}
  ],
  learning:{
   correctIt:'Rallenta e preparati a fermarti, ma non invitare mai il pedone con un gesto: potrebbe arrivare un altro veicolo.',
   correctEn:'Slow down and prepare to stop, but never wave the pedestrian across because another vehicle may be approaching.'
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
  visualStatus:'real-footage-with-instructional-overlay',
  title:'Approaching a zebra crossing with pedestrians waiting',
  accessibilityLabel:'Pedestrians waiting at a zebra crossing while vehicles approach',
  playbackRate:0.9,
  media:{
   video:'https://www.pexels.com/download/video/2863232/',
   poster:'https://images.pexels.com/videos/2863232/free-video-2863232.jpg?auto=compress&dpr=1&h=750&w=1260',
   credit:'Pexels · George Morina'
  },
  timeline:[
   {at:0.5,event:'info',textIt:'Individua i pedoni in attesa',textEn:'Identify the pedestrians waiting'},
   {at:2.5,event:'danger',textIt:'Avvicinarsi troppo velocemente riduce il margine di sicurezza',textEn:'Approaching too fast reduces the safety margin'},
   {at:4.5,event:'slow',textIt:'Rallenta e preparati a fermarti',textEn:'Slow down and prepare to stop'},
   {at:6.5,event:'wait',textIt:'Fermati se necessario e lascia attraversare in sicurezza',textEn:'Stop if necessary and let them cross safely'}
  ],
  learning:{
   correctIt:'Avvicinati lentamente all’attraversamento zebra e preparati a fermarti per i pedoni in attesa.',
   correctEn:'Approach the zebra crossing slowly and prepare to stop for pedestrians waiting to cross.'
  }
 });

})(window);
