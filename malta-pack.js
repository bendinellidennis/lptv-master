
(function(global){
 'use strict';
 if(!global.CountryPacks)throw new Error('CountryPacks must load first');

 global.CountryPacks.register({
  id:'MT-LPTV',
  countryCode:'MT',
  countryName:'Malta',
  licenceType:'LPTV',
  drivingSide:'left',
  units:{distance:'km',speed:'km/h'},
  languages:['en','it','mt'],
  visualProfile:{
   roadStone:'limestone',
   climate:'Mediterranean',
   plates:'Malta',
   trafficFlow:'left'
  },
  sceneRequirements:{
   overtakeLimitedView:{
    required:['left-driving','two-way-road','limited-visibility','vehicle-ahead'],
    forbidden:['right-driving','unrelated-skyline','unrelated-mountain-panorama'],
    status:'final-real-footage'
   }
  }
 });
})(window);
