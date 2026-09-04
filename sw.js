const CACHE='cci8-fase2-v2';
const BASE='/CCI8-CREPDEC8-FASE2/';
const ASSETS=[BASE,BASE+'index.html',BASE+'manifest.json',BASE+'config.js',BASE+'icon-192.png',BASE+'icon-512.png'];
self.addEventListener('install',e=>e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS)).then(()=>self.skipWaiting())));
self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',e=>{
  if(e.request.method!=='GET') return;
  const u=new URL(e.request.url);
  if(u.origin!==location.origin) return;
  if(u.pathname.endsWith('/config.js')) { e.respondWith(fetch(e.request,{cache:'no-store'})); return; }
  e.respondWith(fetch(e.request).then(r=>{const copy=r.clone(); caches.open(CACHE).then(c=>c.put(e.request,copy)); return r;}).catch(()=>caches.match(e.request).then(r=>r||caches.match(BASE+'index.html'))));
});
