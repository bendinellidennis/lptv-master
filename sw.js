const CACHE='mdm-build-38-7-replay-final-clean';
const ASSETS=[
 './',
 './index.html',
 './styles.css?v=39.0',
 './app.js?v=39.0',
 './database.js?v=39.0',
 './content.js?v=39.0',
 './replay-engine.js?v=39.0',
 './replay-scenes.js?v=39.0',
 './manifest.webmanifest',
 './icon-192.png',
 './icon-512.png',
 './replay-overtaking-fallback.webp','./replay-overtaking-photo.webp',
 './country-packs.js?v=39.0',
 './malta-pack.js?v=39.0',
 './replay-coach.js?v=39.0',
 './scene-catalog.js?v=39.0',
 './malta-scene-library.js?v=39.0',
 './scene-assets.js?v=39.0',
 './malta-scene-assets.js?v=39.0',
 './assets/mt/README.txt'];
self.addEventListener('install',event=>{self.skipWaiting();event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(ASSETS)))});
self.addEventListener('activate',event=>{event.waitUntil(Promise.all([self.clients.claim(),caches.keys().then(keys=>Promise.all(keys.filter(key=>key!==CACHE).map(key=>caches.delete(key))))]))});
self.addEventListener('fetch',event=>{if(event.request.method!=='GET')return;event.respondWith(fetch(event.request,{cache:'no-store'}).then(response=>{const copy=response.clone();caches.open(CACHE).then(cache=>cache.put(event.request,copy));return response}).catch(()=>caches.match(event.request).then(response=>response||caches.match('./index.html'))))});
