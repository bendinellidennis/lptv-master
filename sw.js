const CACHE='mdm-build-05-2';
const ASSETS=[
 './',
 './index.html',
 './styles.css?v=5.2',
 './app.js?v=5.2',
 './database.js?v=5.2',
 './content.js?v=5.2',
 './manifest.webmanifest',
 './icon-192.png',
 './icon-512.png'
];
self.addEventListener('install',event=>{
 self.skipWaiting();
 event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(ASSETS)));
});
self.addEventListener('activate',event=>{
 event.waitUntil(Promise.all([
   self.clients.claim(),
   caches.keys().then(keys=>Promise.all(keys.filter(key=>key!==CACHE).map(key=>caches.delete(key))))
 ]));
});
self.addEventListener('fetch',event=>{
 if(event.request.method!=='GET')return;
 event.respondWith(
   fetch(event.request,{cache:'no-store'}).then(response=>{
     const copy=response.clone();
     caches.open(CACHE).then(cache=>cache.put(event.request,copy));
     return response;
   }).catch(()=>caches.match(event.request).then(response=>response||caches.match('./index.html')))
 );
});
