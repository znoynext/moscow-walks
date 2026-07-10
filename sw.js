const CACHE_NAME = "moscow-walks-v8";
const APP_SHELL = [
  "./",
  "./index.html",
  "./styles.css",
  "./app.js",
  "./articles.html",
  "./articles.js",
  "./manifest.webmanifest",
  "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css",
  "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => Promise.allSettled(APP_SHELL.map((url) => cache.add(url))))
      .then(() => self.skipWaiting()),
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))))
      .then(() => self.clients.claim()),
  );
});

self.addEventListener("fetch", (event) => {
  const request = event.request;
  if (request.method !== "GET") return;

  const url = new URL(request.url);
  const isNavigation = request.mode === "navigate";
  const isTile = url.hostname.endsWith("tile.openstreetmap.org");
  const isLeaflet = url.hostname === "unpkg.com";
  const isLocal = url.origin === self.location.origin;

  if (isNavigation) {
    event.respondWith(networkFirst(request, "./index.html"));
    return;
  }

  if (isLocal || isLeaflet || isTile) {
    event.respondWith(networkFirst(request));
  }
});

async function networkFirst(request, fallbackUrl) {
  try {
    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(CACHE_NAME);
      await cache.put(request, response.clone());
    }
    return response;
  } catch (error) {
    return (await caches.match(request)) || (fallbackUrl ? await caches.match(fallbackUrl) : new Response("Offline", { status: 503, statusText: "Offline" }));
  }
}
