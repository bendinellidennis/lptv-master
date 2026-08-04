
(function(global){
 'use strict';

 const packs=new Map();

 function register(pack){
  if(!pack||!pack.id)throw new Error('Country pack id missing');
  if(!pack.countryCode)throw new Error('Country code missing');
  if(!['left','right'].includes(pack.drivingSide))throw new Error('Invalid driving side');
  packs.set(pack.id,Object.freeze(pack));
  return pack;
 }

 function get(id){return packs.get(id)||null;}
 function list(){return Array.from(packs.values());}

 global.CountryPacks=Object.freeze({register,get,list});
})(window);
