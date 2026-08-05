const CACHE='mdm-build-38-7-replay-final-clean';
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
 './replay-overtaking-fallback.webp','./replay-overtaking-photo.webp',
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
