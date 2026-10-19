const V='dex51-pwa-35-work-offline';
const FILES=[
 './','./index.html','./manifest.webmanifest','./icon-192.png','./icon-512.png','./icon-maskable-512.png',
 './layer.js','./dex-work-bridge.js','./work/index.html',
 './work/OLVASD_EL.txt','./work/wdea-integrations/wdea-ai-command-bridge.css',
 './work/wdea-integrations/wdea-ai-command-bridge.js','./work/wdea-integrations/wdea-ai.css',
 './work/wdea-integrations/wdea-ai.js','./work/wdea-integrations/wdea-dex-link.js',
 './work/wdea-integrations/wdea-drive-voice-adapter.js','./work/wdea-integrations/wdea-robot-blue.png'
];
self.addEventListener('install',e=>{e.waitUntil(caches.open(V).then(c=>c.addAll(FILES)).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==V).map(x=>caches.delete(x)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{const r=e.request;if(r.method!=='GET'||new URL(r.url).origin!==location.origin)return;
 e.respondWith(fetch(r).then(res=>{if(res.ok){const c=res.clone();caches.open(V).then(x=>x.put(r,c)).catch(()=>{})}return res}).catch(()=>caches.match(r).then(m=>m||caches.match('./index.html'))))});
