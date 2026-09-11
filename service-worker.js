const CACHE='sabr-auto-pin-3';
self.addEventListener('install',e=>e.waitUntil(caches.open(CACHE).then(c=>c.addAll(['./','./index.html','./manifest.json','./icon-192.png','./icon-512.png','./auto-pin.js'])).then(()=>self.skipWaiting())));
self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',e=>{
 if(e.request.method!=='GET')return;
 e.respondWith(fetch(e.request).then(async r=>{
   const type=r.headers.get('content-type')||'';
   if(e.request.mode==='navigate'||type.includes('text/html')){
     const text=await r.clone().text();
     if(text.includes('auto-pin.js'))return r;
     const fixed=text.replace('</body>','<script src="./auto-pin.js?v=3"></script></body>');
     const h=new Headers(r.headers); h.delete('content-encoding'); h.delete('content-length');
     return new Response(fixed,{status:r.status,statusText:r.statusText,headers:h});
   }
   const cp=r.clone(); caches.open(CACHE).then(c=>c.put(e.request,cp)).catch(()=>{}); return r;
 }).catch(()=>caches.match(e.request).then(r=>r||caches.match('./index.html'))));
});
