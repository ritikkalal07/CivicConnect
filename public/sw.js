const CACHE_NAME = "jaldarpan-v2";
const APP_SHELL = ["/", "/manifest.webmanifest", "/favicon.svg"];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_SHELL))
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener("fetch", (event) => {
  const request = event.request;
  if (request.method !== "GET") return;

  // Filter out non-http(s) schemes like chrome-extension://
  const url = request.url;
  if (!url.startsWith("http://") && !url.startsWith("https://")) return;

  if (url.includes("tile.openstreetmap.org")) {
    event.respondWith(
      caches.open(CACHE_NAME).then(async (cache) => {
        const cached = await cache.match(request);
        if (cached) return cached;
        try {
          const response = await fetch(request);
          if (response.ok) {
            const copy = response.clone();
            void cache.put(request, copy);
          }
          return response;
        } catch {
          return cached ?? new Response("", { status: 404 });
        }
      })
    );
  } else if (new URL(url).pathname === "/api/reports") {
    event.respondWith(
      fetch(request)
        .then(async (response) => {
          if (response.ok) {
            const copy = response.clone();
            const cache = await caches.open(CACHE_NAME);
            void cache.put(request, copy);
          }
          return response;
        })
        .catch(() =>
          caches
            .match(request)
            .then(
              (cached) =>
                cached ??
                new Response("[]", {
                  headers: { "Content-Type": "application/json" },
                })
            )
        )
    );
  } else {
    event.respondWith(
      caches.match(request).then(
        (cached) =>
          cached ??
          fetch(request).then((response) => {
            if (response.ok) {
              const copy = response.clone();
              void caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
            }
            return response;
          })
      )
    );
  }
});
