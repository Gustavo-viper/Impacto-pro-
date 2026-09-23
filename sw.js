const C="impacto-pro-v7";
const A=["./","./index.html","./style.css","./app.js","./manifest.json","./assets/impacto-pro-logo.jpeg","./assets/impacto-pro-app-icon.jpeg"];
self.addEventListener("install",e=>e.waitUntil(caches.open(C).then(c=>c.addAll(A)).then(()=>self.skipWaiting())));
self.addEventListener("activate",e=>e.waitUntil(caches.keys().then(a=>Promise.all(a.filter(x=>x!==C).map(x=>caches.delete(x)))).then(()=>self.clients.claim())));
self.addEventListener("fetch",e=>e.respondWith(caches.match(e.request).then(r=>r||fetch(e.request))));
