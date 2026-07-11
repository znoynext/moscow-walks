const assert = require("node:assert/strict");
const fs = require("node:fs");
const test = require("node:test");

const html = fs.readFileSync("index.html", "utf8");
const app = fs.readFileSync("app.js", "utf8");

test("P0 form offers every required start method", () => {
  assert.match(html, /id="startSearch"/);
  assert.match(html, /id="pickOnMapButton"/);
  assert.match(html, /id="locateButton"/);
  assert.match(app, /function setPickedStart/);
});

test("P0 time presets and factual-distance guard are present", () => {
  for (const value of ["3", "4", "6", "8", "12", "custom"]) assert.match(html, new RegExp(`value="${value}"`));
  assert.match(app, /ROUTE_TOLERANCE/);
  assert.match(app, /buildWalkingRoute\(candidate\)/);
});

test("share URL keeps custom search and distance state", () => {
  assert.match(app, /customDistance/);
  assert.match(app, /startSearch/);
  assert.match(app, /validateCatalogueData/);
});
