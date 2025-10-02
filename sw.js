const CACHE_NAME = "news-lite-v5";
const ASSETS = [
  "/",
  "/index.html",
  "/styles.css",
  "/app.js",
  "/manifest.json",
  "/icons/icon-192.png",
  "/icons/icon-512.png"
];

// Install: cache static files
self.addEventListener("install", event => {
  event.waitUntil(
    (async () => {
      const cache = await caches.open(CACHE_NAME);
      for (const asset of ASSETS) {
        try {
          await cache.add(asset);
        } catch (err) {
          console.warn("⚠️ Skipped asset:", asset);
        }
      }
    })()
  );
});

// Activate: clean old caches
self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.map(k => k !== CACHE_NAME && caches.delete(k)))
    )
  );
});

// Fetch: network-first for RSS, cache-first for static
self.addEventListener("fetch", event => {
  const url = event.request.url;

  if (url.includes("allorigins.win")) {
    // Network-first (fresh RSS)
    event.respondWith(
      fetch(event.request)
        .then(res => {
          const resClone = res.clone();
          caches.open(CACHE_NAME).then(c => c.put(event.request, resClone));
          return res;
        })
        .catch(() => caches.match(event.request))
    );
  } else {
    // Cache-first for app shell
    event.respondWith(
      caches.match(event.request).then(cached =>
        cached || fetch(event.request).catch(() => null)
      )
    );
  }
});
