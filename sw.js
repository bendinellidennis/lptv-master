'use strict';

/* Malta Driving Master 45.8.38.25.2 — Pre-Pentest Cache Hygiene */

const CACHE = 'mdm-build-45-8-38-25-2-24-school-tools-immediate';
const BLOCKED_LEGACY = new Set([
  '/lptv-master/account-storage-inspector.html',
  '/lptv-master/pilot-entitlement-test.html',
  '/lptv-master/mdm-school-evidence.html',
  '/lptv-master/mdm-school-evidence-v2.html',
  '/lptv-master/mdm-school-evidence-45838233.html'
]);
const CORE = [
  './',
  './index.html',
  './manifest.webmanifest',
  './icon-192.png',
  './icon-512.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE)
      .then((cache) => cache.addAll(CORE))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    Promise.all([
      self.clients.claim(),
      caches.keys().then((keys) =>
        Promise.all(
          keys
            .filter((key) => key !== CACHE)
            .map((key) => caches.delete(key))
        )
      )
    ])
  );
});

self.addEventListener('fetch', (event) => {
  const request = event.request;
  if (request.method !== 'GET') return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  if (BLOCKED_LEGACY.has(url.pathname)) {
    event.respondWith(Promise.resolve(new Response('Not Found',{status:404,headers:{'Content-Type':'text/plain; charset=utf-8','Cache-Control':'no-store'}})));
    return;
  }

  event.respondWith(
    fetch(request, { cache: 'no-store' })
      .then((response) => {
        if (response && response.ok) {
          const copy = response.clone();
          caches.open(CACHE).then((cache) => cache.put(request, copy));
        }
        return response;
      })
      .catch(async () => {
        const cached = await caches.match(request);
        if (cached) return cached;

        if (request.mode === 'navigate') {
          const shell = await caches.match('./index.html');
          if (shell) return shell;
        }

        return Response.error();
      })
  );
});
