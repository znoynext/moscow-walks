const assert = require("node:assert/strict");
const fs = require("node:fs");
const test = require("node:test");

const html = fs.readFileSync("index.html", "utf8");
const app = fs.readFileSync("app.js", "utf8");
const routes = fs.readFileSync("routes.js", "utf8");

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

test("map opens at the Moscow overview scale", () => {
  assert.match(app, /const MAP_INITIAL_ZOOM = 10;/);
  assert.match(app, /setView\(MAP_VIEW, MAP_INITIAL_ZOOM\)/);
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
  assert.match(routePage, /TouristTrip/);
  assert.doesNotMatch(routePage, /insertAdjacentHTML\("beforeend", `<script/);
  const inlineScript = routePage.match(/<script>\s*([\s\S]*?)<\/script>/)?.[1];
  assert.ok(inlineScript);
  assert.doesNotThrow(() => new Function(inlineScript));
  assert.match(fs.readFileSync("privacy.html", "utf8"), /Геолокация/);
});

test("catalogue cards keep their content inside a padded body", () => {
  assert.match(fs.readFileSync("areas.html", "utf8"), /<article class="article-card"><div class="article-image-wrap">[\s\S]*?<div class="article-card-body">/);
  assert.match(fs.readFileSync("routes.html", "utf8"), /<article class="article-card"><div class="article-image-wrap">[\s\S]*?<div class="article-card-body">/);
  assert.match(fs.readFileSync("route.html", "utf8"), /<div class="article-image-wrap">[\s\S]*?<div class="article-card-body"><div class="article-card-top">/);
  assert.match(fs.readFileSync("styles.css", "utf8"), /\.article-card-body \{[\s\S]*?min-width: 0;/);
});

test("quality scripts are part of CI", () => {
  const workflow = fs.readFileSync(".github/workflows/ci.yml", "utf8");
  assert.match(workflow, /check-links/);
  assert.match(workflow, /check-performance/);
});
