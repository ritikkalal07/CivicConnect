const CACHE_NAME = "jaldarpan-v1";
const APP_SHELL = ["/", "/manifest.webmanifest", "/favicon.svg"];
self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_SHELL)));
  self.skipWaiting();
});
self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
});
self.addEventListener("fetch", (event) => {
  const request = event.request;
  if (request.method !== "GET") return;
  if (request.url.includes("tile.openstreetmap.org"))
    event.respondWith(
      caches.open(CACHE_NAME).then(async (cache) => {
        const cached = await cache.match(request);
        const response = await fetch(request);
        if (response.ok) await cache.put(request, response.clone());
        return cached ?? response;
      }),
    );
  else if (new URL(request.url).pathname === "/api/reports")
    event.respondWith(
      fetch(request)
        .then(async (response) => {
          const cache = await caches.open(CACHE_NAME);
          await cache.put(request, response.clone());
          return response;
        })
        .catch(() =>
          caches
            .match(request)
            .then(
              (response) =>
                response ?? new Response("[]", { headers: { "Content-Type": "application/json" } }),
            ),
        ),
    );
  else
    event.respondWith(
      caches.match(request).then(
        (cached) =>
          cached ??
          fetch(request).then((response) => {
            if (response.ok)
              void caches.open(CACHE_NAME).then((cache) => cache.put(request, response.clone()));
            return response;
          }),
      ),
    );
});
