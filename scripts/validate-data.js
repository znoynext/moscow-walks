const fs = require("node:fs");

const source = fs.readFileSync("app.js", "utf8");
const pointRows = [...source.matchAll(/point\("([a-z0-9-]+)",\s*"([^"]+)",\s*([\d.]+),\s*([\d.]+)/g)];
const ids = new Set();
const errors = [];

for (const [, id, name, latText, lonText] of pointRows) {
  const lat = Number(latText);
  const lon = Number(lonText);
  if (ids.has(id)) errors.push(`Duplicate id: ${id}`);
  ids.add(id);
  if (!name || lat < 55.45 || lat > 56.05 || lon < 37 || lon > 38.35) errors.push(`Invalid place: ${id}`);
}

if (pointRows.length < 15) errors.push("The catalogue must contain at least 15 places.");
if (errors.length) throw new Error(errors.join("\n"));
console.log(`Validated ${pointRows.length} catalogue places.`);
