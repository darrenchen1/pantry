const V='pantry-v1';
const SHELL=['./','index.html','manifest.webmanifest','icon-192.png','icon-512.png','apple-touch-icon.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(V).then(c=>c.addAll(SHELL)).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==V).map(x=>caches.delete(x)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{
  const r=e.request,u=new URL(r.url);
  if(r.method!=='GET'||!(u.origin===location.origin||u.hostname==='www.gstatic.com'))return;
  const keep=res=>{if(res&&(res.ok||res.type==='opaque')){const c=res.clone();caches.open(V).then(x=>x.put(r,c))}return res};
  if(r.mode==='navigate'){
    // network first so updates show up straight away, cache when offline
    e.respondWith(fetch(r).then(keep).catch(()=>caches.match(r).then(h=>h||caches.match('./'))));
    return;
  }
  // everything else: cache first, refresh in the background
  e.respondWith(caches.match(r).then(h=>{const n=fetch(r).then(keep).catch(()=>h);return h||n}));
});
