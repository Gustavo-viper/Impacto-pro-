const C="impacto-pro-v29";
const A=[
  "./","./index.html","./style.css","./app.js","./manifest.json","./version.json",
  "./assets/impacto-pro-logo-transparent.png","./assets/impacto-pro-logo.jpeg","./assets/impacto-pro-logo-original.png","./assets/impacto-pro-marca-dagua-a4.jpg",
  "./assets/impacto-pro-app-icon.jpeg",
  "./assets/impacto-pro-app-icon-192.png",
  "./assets/impacto-pro-app-icon-512.png"
];

self.addEventListener("install", e => {
  e.waitUntil(caches.open(C).then(c => c.addAll(A)).then(() => self.skipWaiting()));
});

self.addEventListener("activate", e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== C).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", e => {
  if (e.request.method !== "GET") return;

  const url = new URL(e.request.url);
  if (url.origin === self.location.origin && url.pathname.endsWith("/version.json")) {
    e.respondWith(fetch(e.request, {cache:"no-store"}).catch(() => caches.match("./version.json")));
    return;
  }

  const isLocalAsset =
    url.origin === self.location.origin &&
    (url.pathname.includes("/assets/") ||
     url.pathname.endsWith("/index.html") ||
     url.pathname.endsWith("/style.css") ||
     url.pathname.endsWith("/app.js") ||
     url.pathname.endsWith("/manifest.json"));

  if (isLocalAsset) {
    e.respondWith(
      caches.match(e.request).then(cached =>
        cached || fetch(e.request).then(response => {
          const copy = response.clone();
          caches.open(C).then(c => c.put(e.request, copy));
          return response;
        })
      )
    );
    return;
  }

  e.respondWith(
    fetch(e.request).then(response => {
      const copy = response.clone();
      caches.open(C).then(c => c.put(e.request, copy)).catch(() => {});
      return response;
    }).catch(() =>
      caches.match(e.request).then(cached => cached || caches.match("./index.html"))
    )
  );
});

self.addEventListener("message",e=>{if(e.data==="SKIP_WAITING")self.skipWaiting();});
