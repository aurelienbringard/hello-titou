/* Hello Titou — minimal service worker for installability.
   Network-first for same-origin GET requests. Cross-origin traffic
   (Supabase audio and auth) and non-GET requests are not intercepted. */
self.addEventListener("install", function () {
  self.skipWaiting();
});

self.addEventListener("activate", function (event) {
  event.waitUntil(self.clients.claim());
});

self.addEventListener("fetch", function (event) {
  var req = event.request;
  if (req.method !== "GET") return;
  var url = new URL(req.url);
  if (url.origin !== self.location.origin) return;
  event.respondWith(
    fetch(req).catch(function (err) {
      throw err;
    })
  );
});
