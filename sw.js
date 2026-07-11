const SHELL_CACHE = "moscow-walks-shell-v18";
const RUNTIME_CACHE = "moscow-walks-runtime-v1";
const APP_SHELL = [
  "./", "./index.html", "./articles/", "./routes/", "./areas/", "./privacy/",
  "./styles.css", "./app.js", "./api-config.js", "./articles.js", "./routes.js",
  "./route.html", "./manifest.webmanifest", "./sw-register.js", "./offline.html",
  "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css",
  "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js",
];

self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(SHELL_CACHE).then((cache) => Promise.allSettled(APP_SHELL.map((url) => cache.add(url))).then(() => self.skipWaiting())));
});

self.addEventListener("activate", (event) => {
  event.waitUntil(caches.keys().then((keys) => Promise.all(keys.filter((key) => ![SHELL_CACHE, RUNTIME_CACHE].includes(key)).map((key) => caches.delete(key)))).then(() => self.clients.claim()));
});

self.addEventListener("message", (event) => {
  if (event.data?.type === "SKIP_WAITING") self.skipWaiting();
});

self.addEventListener("fetch", (event) => {
  const request = event.request;
  if (request.method !== "GET") return;
  const url = new URL(request.url);
  if (url.hostname.endsWith("tile.openstreetmap.org")) return;
  if (request.mode === "navigate") {
    event.respondWith(networkFirst(request));
    return;
  }
  if (url.origin === self.location.origin || url.hostname === "unpkg.com") event.respondWith(networkFirst(request));
});

async function networkFirst(request) {
  try {
    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(RUNTIME_CACHE);
      await cache.put(request, response.clone());
    }
    return response;
  } catch (error) {
    return (await caches.match(request, { ignoreSearch: true })) || (await caches.match(request.url.replace(/\.html$/, "/"))) || caches.match("./offline.html");
  }
}
