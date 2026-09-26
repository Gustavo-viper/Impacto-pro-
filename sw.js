const VERSION="62.0";
const CACHE=`impacto-pro-v${VERSION}`;
const ASSETS=[
  "./","./index.html","./style.css","./app.js","./manifest.json","./version.json",
  "./assets/impacto-pro-logo-transparent.png","./assets/impacto-pro-logo.jpeg","./assets/impacto-pro-logo-original.png","./assets/impacto-pro-marca-dagua-a4.jpg",
  "./assets/impacto-pro-app-icon.jpeg","./assets/impacto-pro-app-icon-192.png","./assets/impacto-pro-app-icon-512.png"
];

self.addEventListener("install",event=>{
  event.waitUntil(
    caches.open(CACHE)
      .then(cache=>cache.addAll(ASSETS))
      .then(()=>self.skipWaiting())
  );
});

self.addEventListener("activate",event=>{
  event.waitUntil(
    caches.keys()
      .then(keys=>Promise.all(keys.filter(k=>k.startsWith("impacto-pro-")&&k!==CACHE).map(k=>caches.delete(k))))
      .then(()=>self.clients.claim())
  );
});

async function networkFirst(request,cacheKey=request){
  try{
    const response=await fetch(request,{cache:"no-store"});
    if(response && response.ok){
      const cache=await caches.open(CACHE);
      await cache.put(cacheKey,response.clone());
    }
    return response;
  }catch(error){
    const cached=await caches.match(cacheKey);
    if(cached) return cached;
    throw error;
  }
}

async function staleWhileRevalidate(request){
  const cached=await caches.match(request);
  const network=fetch(request,{cache:"no-store"}).then(async response=>{
    if(response&&response.ok){
      const cache=await caches.open(CACHE);
      await cache.put(request,response.clone());
    }
    return response;
  }).catch(()=>null);
  return cached || await network || caches.match("./index.html");
}

self.addEventListener("fetch",event=>{
  if(event.request.method!=="GET") return;
  const url=new URL(event.request.url);
  if(url.origin!==self.location.origin) return;

  if(url.pathname.endsWith("/version.json")){
    event.respondWith(networkFirst(event.request,"./version.json"));
    return;
  }

  const path=url.pathname;
  const core=/\/(index\.html|app\.js|style\.css|manifest\.json|sw\.js)$/.test(path) || path.endsWith("/");
  if(core){
    event.respondWith(networkFirst(event.request));
    return;
  }

  if(path.includes("/assets/")){
    event.respondWith(staleWhileRevalidate(event.request));
    return;
  }

  event.respondWith(
    fetch(event.request).catch(()=>caches.match(event.request).then(c=>c||caches.match("./index.html")))
  );
});

self.addEventListener("message",event=>{
  if(event.data==="SKIP_WAITING") self.skipWaiting();
});