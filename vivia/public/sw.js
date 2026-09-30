// VIVIA service worker — keeps the offline emergency card and the bathroom
// finder shell available without network. Health data is NOT cached here:
// the emergency card content lives in the patient's own device storage.
const CACHE = "vivia-shell-v1";
const OFFLINE_PAGES = ["/card", "/bathroom"];

self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(OFFLINE_PAGES)).then(() => self.skipWaiting()));
});
self.addEventListener("activate", (e) => {
  e.waitUntil(caches.keys().then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener("fetch", (e) => {
  const url = new URL(e.request.url);
  if (e.request.method !== "GET" || url.origin !== location.origin) return;
  if (url.pathname.startsWith("/api/")) return; // never cache API responses (health data)
  const isStatic = url.pathname.startsWith("/_next/static/") || url.pathname === "/icon.svg";
  if (isStatic) {
    e.respondWith(caches.match(e.request).then((r) => r || fetch(e.request).then((res) => { const copy = res.clone(); caches.open(CACHE).then((c) => c.put(e.request, copy)); return res; })));
    return;
  }
  if (OFFLINE_PAGES.includes(url.pathname)) {
    e.respondWith(fetch(e.request).then((res) => { const copy = res.clone(); caches.open(CACHE).then((c) => c.put(e.request, copy)); return res; }).catch(() => caches.match(e.request)));
  }
});
