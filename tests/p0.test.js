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

test("map layers respect hidden state and expose expanded state", () => {
  const controls = fs.readFileSync("map-controls.js", "utf8");
  const fixes = fs.readFileSync("ui-fixes.css", "utf8");
  assert.match(html, /id="mapLayersPanel"[^>]*hidden/);
  assert.match(html, /data-map-action="layers"[^>]*aria-controls="mapLayersPanel"[^>]*aria-expanded="false"/);
  assert.match(fixes, /\[hidden\]\s*\{\s*display:\s*none\s*!important/);
  assert.match(controls, /layersButton\.setAttribute\("aria-expanded", String\(isOpen\)\)/);
});

test("mobile route results can return to settings without horizontal overflow", () => {
  const fixes = fs.readFileSync("ui-fixes.css", "utf8");
  const controls = fs.readFileSync("map-controls.js", "utf8");
  assert.match(html, /id="editSettingsButton"/);
  assert.match(controls, /function showPlanner\(\)/);
  assert.match(controls, /classList\.remove\("has-route"\)/);
  assert.match(fixes, /\.history-item\s*\{[\s\S]*?width:\s*100%;[\s\S]*?min-width:\s*0;/);
  assert.match(fixes, /\.history-item span\s*\{[\s\S]*?min-width:\s*0;/);
});

test("interactive controls include practical touch and focus styles", () => {
  const fixes = fs.readFileSync("ui-fixes.css", "utf8");
  assert.match(fixes, /:where\(a, button, input, select, summary\):focus-visible/);
  assert.match(fixes, /\.utility-button,[\s\S]*?min-width:\s*44px;[\s\S]*?min-height:\s*44px;/);
});

test("shared UI fixes load on every public page", () => {
  for (const page of ["index.html", "articles.html", "routes.html", "route.html", "areas.html", "privacy.html", "offline.html"]) {
    assert.match(fs.readFileSync(page, "utf8"), /ui-fixes\.css/);
  }
  assert.match(fs.readFileSync("scripts/generate-route-pages.js", "utf8"), /\.\.\/\.\.\/ui-fixes\.css/);
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
  assert.match(guide, /Special:FilePath/);
  assert.match(guide, /className: "map-guide-leaflet-popup"/);
  assert.match(places, /const metroStations =/);
  assert.ok((places.match(/"line":"/g) || []).length >= 100);
});

test("share URL keeps custom search and distance state", () => {
  assert.match(app, /customDistance/);
  assert.match(app, /startSearch/);
  assert.match(app, /validateCatalogueData/);
});

test("search input and geocoder response are bounded", () => {
  assert.match(html, /id="startSearch"[^>]*maxlength="120"/);
  assert.match(app, /\.trim\(\)\.slice\(0, 120\)/);
  assert.match(app, /Number\.isFinite\(lat\)/);
  assert.match(app, /lat < MAP_BOUNDS\[0\]\[0\]/);
});

test("Leaflet assets are pinned with integrity metadata", () => {
  assert.match(html, /leaflet\.css" integrity="sha256-[^"]+" crossorigin="anonymous"/);
  assert.match(html, /leaflet\.js" integrity="sha256-[^"]+" crossorigin="anonymous"/);
});

test("map tiles keep their layout if the Leaflet CDN stylesheet is unavailable", () => {
  const fallback = fs.readFileSync("leaflet-fallback.css", "utf8");
  const markerFixes = fs.readFileSync("map-marker-fixes.css", "utf8");
  const serviceWorker = fs.readFileSync("sw.js", "utf8");
  assert.match(html, /href="\.\/leaflet-fallback\.css\?v=2026-07-11-4"/);
  assert.match(html, /href="\.\/map-marker-fixes\.css\?v=2026-07-11-2"/);
  assert.match(fallback, /\.leaflet-tile[\s\S]*?position:\s*absolute/);
  assert.match(fallback, /\.leaflet-tile-loaded[\s\S]*?visibility:\s*inherit/);
  assert.match(fallback, /\.leaflet-tile-pane\s*\{\s*z-index:\s*200/);
  assert.match(fallback, /\.leaflet-overlay-pane\s*\{\s*z-index:\s*400/);
  assert.match(fallback, /\.leaflet-marker-pane\s*\{\s*z-index:\s*600/);
  assert.match(fallback, /\.leaflet-popup-content-wrapper[\s\S]*?background:\s*#fff/);
  assert.match(fallback, /\.leaflet-popup-tip-container/);
  assert.match(markerFixes, /\.map-guide-marker > svg[\s\S]*?background:\s*#ce4a3b/);
  assert.match(markerFixes, /\.map-guide-marker--metro > svg/);
  assert.match(markerFixes, /\.map-guide-marker--park > svg/);
  assert.doesNotMatch(fallback, /\.leaflet-container \.leaflet-overlay-pane svg\s*\{[\s\S]*?width:\s*100%/);
  assert.match(serviceWorker, /\.\/leaflet-fallback\.css/);
});

test("walking routes use a backup service when the primary router is unavailable", () => {
  const config = fs.readFileSync("api-config.js", "utf8");
  assert.match(app, /for \(const baseUrl of OSRM_FOOT_URLS\)/);
  assert.doesNotMatch(app, /OSRM_FOOT_URLS\.slice\(0, 1\)/);
  assert.match(config, /routing\.openstreetmap\.de/);
  assert.match(config, /router\.project-osrm\.org/);
});

test("walking routes optimize stop order on the pedestrian network", () => {
  const optimizer = fs.readFileSync("route-optimizer.js", "utf8");
  assert.match(html, /route-optimizer\.js\?v=2026-07-11-1/);
  assert.match(optimizer, /roundtrip:\s*"false"/);
  assert.match(optimizer, /source:\s*"first"/);
  assert.match(optimizer, /destination:\s*"any"/);
  assert.match(optimizer, /routeServiceUrl\(baseUrl, "trip"\)/);
  assert.match(optimizer, /orderedStopsFromTrip\(stops, data\.waypoints\)/);
  assert.match(app, /window\.requestOptimizedWalkingRoute\?\.\(route\)/);
});

test("a built route keeps the map and its walking line in view", () => {
  assert.match(app, /document\.querySelector\("\.map"\)\?\.scrollIntoView/);
  assert.match(app, /color: "#ff5f4d",\s*weight: 7/);
});

test("SEO route catalogue and privacy surface exist", () => {
  assert.match(routes, /curatedRoutes/);
  assert.match(routes, /routeImages/);
  assert.match(fs.readFileSync("routes.html", "utf8"), /routeGrid/);
  const routePage = fs.readFileSync("route.html", "utf8");
  assert.match(routePage, /id="routeDetail"/);
  assert.match(routePage, /startNames\[route\.start\]/);
  assert.doesNotMatch(routePage, /\.innerHTML\s*=/);
  assert.match(routePage, /Object\.hasOwn\(routeBySlug, slug\)/);
  assert.match(routePage, /document\.createElement\("script"\)/);
  assert.doesNotMatch(routePage, /route\.start\.replace\("metro-"/);
  const inlineScript = routePage.match(/<script>\s*([\s\S]*?)<\/script>/)?.[1];
  assert.ok(inlineScript);
  assert.doesNotThrow(() => new Function(inlineScript));
  assert.match(fs.readFileSync("privacy.html", "utf8"), /Геолокация/);
});

test("dynamic UI links use clean public catalogue URLs", () => {
  assert.match(app, /href="\.\/articles\/#article-/);
  assert.doesNotMatch(app, /href="\.\/articles\.html#article-/);
  assert.match(fs.readFileSync("map-guide.js", "utf8"), /href="\.\/articles\/#article-/);
});

test("article search has an accessible empty state", () => {
  const articleHtml = fs.readFileSync("articles.html", "utf8");
  const articleJs = fs.readFileSync("articles.js", "utf8");
  assert.match(articleHtml, /id="articleSearch"[^>]*maxlength="100"/);
  assert.match(articleHtml, /data-filter="all"[^>]*aria-pressed="true"/);
  assert.match(articleJs, /class="article-empty" role="status"/);
  assert.match(articleJs, /setAttribute\("aria-pressed", String\(isActive\)\)/);
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
