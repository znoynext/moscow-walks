const assert = require("node:assert/strict");
const fs = require("node:fs");
const test = require("node:test");

const html = fs.readFileSync("index.html", "utf8");
const app = fs.readFileSync("app.js", "utf8");
const routes = fs.readFileSync("routes.js", "utf8");
const { curatedRoutes } = require("../routes.js");

test("P0 form offers every required start method", () => {
  assert.match(html, /id="startSearch"/);
  assert.match(html, /id="pickOnMapButton"/);
  assert.match(html, /id="locateButton"/);
  assert.match(html, /id="navigationModeButton"/);
  assert.match(app, /function setPickedStart/);
  assert.match(app, /navigator\.geolocation\.watchPosition/);
  assert.match(app, /DeviceOrientationEvent/);
  assert.match(app, /function renderNavigationProgress/);
});

test("P0 time presets and factual-distance guard are present", () => {
  for (const value of ["3", "4", "6", "8", "12", "custom"]) assert.match(html, new RegExp(`value="${value}"`));
  assert.match(app, /ROUTE_TOLERANCE/);
  assert.match(app, /buildWalkingRoute\(candidate\)/);
});

test("map cannot zoom out past the Moscow overview scale", () => {
  assert.match(app, /const MAP_MIN_ZOOM = 12;/);
  assert.match(app, /const MAP_BOUNDS = \[\[55\.57, 37\.35\], \[55\.90, 37\.90\]\];/);
  assert.match(app, /minZoom: MAP_MIN_ZOOM/);
  assert.match(app, /const MAP_INITIAL_ZOOM = 12;/);
  assert.match(app, /setView\(MAP_VIEW, MAP_INITIAL_ZOOM\)/);
});

test("map guide filters and follows the catalogue automatically", () => {
  const guide = fs.readFileSync("map-guide.js", "utf8");
  const places = fs.readFileSync("map-places.js", "utf8");
  assert.match(html, /data-map-filter="metro"/);
  assert.match(html, /data-map-filter="park"/);
  assert.match(html, /data-map-filter="sight"/);
  assert.match(guide, /const attractions = pois\.map\(guidePlaceFromPoi\)/);
  assert.match(guide, /\.filter\(\(place\) => mapGuideFilters\[place\.type\]\)/);
  assert.match(guide, /function visibleGuidePlaces/);
  assert.match(guide, /zoom >= 15/);
  assert.match(guide, /function isInsideGardenRing/);
  assert.doesNotMatch(guide, /loading="lazy"/);
  assert.match(places, /const metroStations =/);
  assert.ok((places.match(/"line":"/g) || []).length >= 100);
});

test("share URL keeps custom search and distance state", () => {
  assert.match(app, /customDistance/);
  assert.match(app, /startSearch/);
  assert.match(app, /validateCatalogueData/);
});

test("SEO route catalogue and privacy surface exist", () => {
  assert.match(routes, /curatedRoutes/);
  assert.match(routes, /routeImages/);
  assert.match(fs.readFileSync("routes.html", "utf8"), /routeGrid/);
  const routePage = fs.readFileSync("route.html", "utf8");
  assert.match(routePage, /id="routeDetail"/);
  assert.match(routePage, /startNames\[route\.start\]/);
  assert.doesNotMatch(routePage, /route\.start\.replace\("metro-"/);
  const inlineScript = routePage.match(/<script>\s*([\s\S]*?)<\/script>/)?.[1];
  assert.ok(inlineScript);
  assert.doesNotThrow(() => new Function(inlineScript));
  assert.match(fs.readFileSync("privacy.html", "utf8"), /Геолокация/);
});

test("catalogue cards keep their content inside a padded body", () => {
  assert.match(fs.readFileSync("areas.html", "utf8"), /<article class="article-card"><div class="article-image-wrap">[\s\S]*?<div class="article-card-body">/);
  assert.match(fs.readFileSync("routes.html", "utf8"), /<article class="article-card"><div class="article-image-wrap">[\s\S]*?<div class="article-card-body">/);
  assert.match(fs.readFileSync("route.html", "utf8"), /id="routeDetail"/);
  assert.match(fs.readFileSync("styles.css", "utf8"), /\.article-card-body \{[\s\S]*?min-width: 0;/);
});

test("quality scripts are part of CI", () => {
  const workflow = fs.readFileSync(".github/workflows/ci.yml", "utf8");
  assert.match(workflow, /generate-route-pages/);
  assert.match(workflow, /check-links/);
  assert.match(workflow, /check-performance/);
});

test("service worker updates manually and does not intercept map tiles", () => {
  const registration = fs.readFileSync("sw-register.js", "utf8");
  const worker = fs.readFileSync("sw.js", "utf8");
  assert.match(registration, /updateViaCache: "none"/);
  assert.match(registration, /registration\.update\(\)/);
  assert.match(registration, /Доступна новая версия/);
  assert.match(registration, /SKIP_WAITING/);
  assert.doesNotMatch(registration, /location\.reload/);
  assert.doesNotMatch(worker, /cache: "no-store"/);
  assert.match(worker, /tile\.openstreetmap\.org/);
  assert.match(worker, /return;/);
  assert.match(worker, /SHELL_CACHE/);
  assert.match(worker, /RUNTIME_CACHE/);
  assert.match(worker, /ignoreSearch: true/);
  for (const page of ["index.html", "articles.html", "routes.html", "route.html", "areas.html", "privacy.html"]) {
    assert.match(fs.readFileSync(page, "utf8"), /<script defer src="\.\/sw-register\.js"><\/script>/);
  }
});

test("public HTML has no placeholder contacts and keeps the public brand", () => {
  const publicPages = ["index.html", "articles.html", "routes.html", "route.html", "areas.html", "privacy.html", ...curatedRoutes.map((route) => `routes/${route.slug}/index.html`), "articles/index.html", "areas/index.html", "routes/index.html", "privacy/index.html"];
  for (const page of publicPages) {
    const source = fs.readFileSync(page, "utf8");
    assert.doesNotMatch(source, /@example\.com/i);
    assert.match(source, /Пешком\.Москва/);
    assert.doesNotMatch(source, /Walk Moscow/i);
  }
});

test("every curated route has an indexed static page and sitemap entry", () => {
  const sitemap = fs.readFileSync("sitemap.xml", "utf8");
  assert.equal(new Set(curatedRoutes.map((route) => route.slug)).size, curatedRoutes.length);
  for (const route of curatedRoutes) {
    const filename = `routes/${route.slug}/index.html`;
    const source = fs.readFileSync(filename, "utf8");
    const url = `https://znoynext.github.io/moscow-walks/routes/${route.slug}/`;
    assert.match(source, new RegExp(`<link rel="canonical" href="${url}"`));
    assert.match(source, /<h1>/);
    assert.equal((source.match(/<h1(?:\s|>)/g) || []).length, 1);
    assert.match(source, /<title>[^<]+<\/title>/);
    assert.match(source, /<meta name="description" content="[^"]+"/);
    assert.match(source, /"@type":"TouristTrip"/);
    assert.match(sitemap, new RegExp(url));
  }
});

test("public catalogue pages use clean directory URLs", () => {
  const pages = ["articles", "areas", "privacy", "routes"];
  for (const page of pages) {
    const source = fs.readFileSync(`${page}/index.html`, "utf8");
    assert.match(source, new RegExp(`canonical" href="https://znoynext.github.io/moscow-walks/${page}/`));
    assert.doesNotMatch(source, new RegExp(`https://znoynext.github.io/moscow-walks/${page}\\.html`));
  }
});

test("manifest references existing local PWA icons", () => {
  const manifest = JSON.parse(fs.readFileSync("manifest.webmanifest", "utf8"));
  assert.equal(manifest.id, "/moscow-walks/");
  assert.equal(manifest.scope, "./");
  assert.equal(manifest.lang, "ru");
  assert.ok(manifest.icons.length >= 3);
  for (const icon of manifest.icons) assert.ok(fs.existsSync(icon.src.replace(/^\.\//, "")));
  assert.ok(fs.existsSync("assets/favicon.svg"));
  assert.ok(fs.existsSync("assets/social-preview.svg"));
});
