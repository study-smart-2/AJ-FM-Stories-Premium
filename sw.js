/* Keeps the app itself on the phone so the Mini App can open without internet (episodes are stored separately, inside the app). */
const C = 'ajfm-shell-v1';
self.addEventListener('install', e => { self.skipWaiting(); e.waitUntil(caches.open(C).then(c => c.add('./')).catch(() => {})); });
self.addEventListener('activate', e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== C).map(k => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener('fetch', e => {
  const r = e.request, u = new URL(r.url);
  if (r.method !== 'GET' || u.origin !== location.origin) return;        // the server API and audio are never cached here
  if (r.mode === 'navigate'){
    e.respondWith(fetch(r).then(res => { if (res.ok){ const cp = res.clone(); caches.open(C).then(c => c.put('./', cp)); } return res; }).catch(() => caches.match('./', {ignoreSearch: true})));
    return;
  }
  e.respondWith(fetch(r).then(res => { if (res.ok){ const cp = res.clone(); caches.open(C).then(c => c.put(r, cp)); } return res; }).catch(() => caches.match(r)));
});
