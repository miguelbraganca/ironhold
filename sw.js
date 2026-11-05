// Offline support. The game page is fetched fresh from the network whenever there is a
// connection (so updates show up on the next open) and served from the cache when offline.
// Fonts and icons never change between builds, so they come from the cache first.
// Every fetch here bypasses the browser's HTTP cache (GitHub Pages keeps copies for 10 minutes),
// so a new build never stores a stale page.
const CACHE='ironhold-5e8326f5ce';
const FILES=['./', 'index.html', 'manifest.webmanifest', 'icon-192.png', 'icon-512.png', 'icon-maskable-512.png', 'apple-touch-icon.png', 'fonts/PirataOne-400.woff2', 'fonts/Cinzel-600.woff2', 'fonts/Cinzel-700.woff2', 'fonts/Cinzel-900.woff2', 'fonts/Alegreya-400.woff2', 'fonts/Alegreya-500.woff2', 'fonts/Alegreya-700.woff2', 'fonts/Alegreya-400i.woff2'];
const fresh=u=>new Request(u,{cache:'reload'});
self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(FILES.map(fresh))).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{
  const r=e.request;if(r.method!=='GET')return;
  const page=r.mode==='navigate'||/\/(index\.html)?$/.test(new URL(r.url).pathname);
  if(page){
    e.respondWith(fetch(new Request(r.url,{cache:'no-store'})).then(res=>{
      if(res.ok){const copy=res.clone();caches.open(CACHE).then(c=>c.put('index.html',copy))}return res})
      .catch(()=>caches.match('index.html')));
    return;
  }
  e.respondWith(caches.match(r,{ignoreSearch:true}).then(hit=>hit||fetch(r)));
});
