// Caches the whole game so it runs with no connection. The version changes on every build,
// so a new build replaces the old cache the next time the app is opened online.
const CACHE='ironhold-c9614238f8';
const FILES=['./', 'index.html', 'manifest.webmanifest', 'icon-192.png', 'icon-512.png', 'icon-maskable-512.png', 'fonts/PirataOne-400.woff2', 'fonts/Cinzel-600.woff2', 'fonts/Cinzel-700.woff2', 'fonts/Cinzel-900.woff2', 'fonts/Alegreya-400.woff2', 'fonts/Alegreya-500.woff2', 'fonts/Alegreya-700.woff2', 'fonts/Alegreya-400i.woff2'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(FILES)).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{
  if(e.request.method!=='GET')return;
  e.respondWith(caches.match(e.request,{ignoreSearch:true}).then(hit=>hit||fetch(e.request).catch(()=>caches.match('index.html'))));
});
