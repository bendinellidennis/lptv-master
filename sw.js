const CACHE='mdm-build-38-9-replay-library-pack-1';
const ASSETS=[
 './',
 './index.html',
 './styles.css?v=38.8',
 './app.js?v=38.8',
 './database.js?v=38.8',
 './content.js?v=38.8',
 './replay-engine.js?v=38.8',
 './replay-scenes.js?v=38.8',
 './manifest.webmanifest',
 './icon-192.png',
 './icon-512.png',
 './replay-overtaking-fallback.webp','./assets/mt/junction-roundabout.webp','./assets/mt/junction-roundabout.mp4','./assets/mt/tunnel-breakdown.webp','./assets/mt/tunnel-breakdown.mp4','./assets/mt/bus-stop-departure.webp','./assets/mt/bus-stop-departure.mp4','./assets/mt/motorcycle-blind-spot.webp','./assets/mt/motorcycle-blind-spot.mp4','./assets/mt/pedestrian-hidden.webp','./assets/mt/pedestrian-hidden.mp4','./replay-overtaking-photo.webp',
 './country-packs.js?v=38.8',
 './malta-pack.js?v=38.8',
 './replay-coach.js?v=38.8',
 './scene-catalog.js?v=38.8',
 './malta-scene-library.js?v=38.8',
 './scene-assets.js?v=38.8',
 './malta-scene-assets.js?v=38.8',
 './assets/mt/README.txt'];
self.addEventListener('install',event=>{self.skipWaiting();event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(ASSETS)))});
self.addEventListener('activate',event=>{event.waitUntil(Promise.all([self.clients.claim(),caches.keys().then(keys=>Promise.all(keys.filter(key=>key!==CACHE).map(key=>caches.delete(key))))]))});
self.addEventListener('fetch',event=>{if(event.request.method!=='GET')return;event.respondWith(fetch(event.request,{cache:'no-store'}).then(response=>{const copy=response.clone();caches.open(CACHE).then(cache=>cache.put(event.request,copy));return response}).catch(()=>caches.match(event.request).then(response=>response||caches.match('./index.html'))))});
