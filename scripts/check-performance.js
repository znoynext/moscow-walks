const fs = require("node:fs");

const budgets = { "index.html": 20_000, "app.js": 90_000, "styles.css": 35_000, "articles.js": 45_000 };
const failures = Object.entries(budgets).flatMap(([file, limit]) => {
  const size = fs.statSync(file).size;
  return size > limit ? [`${file} is ${size} bytes; budget is ${limit}.`] : [];
});

if (failures.length) throw new Error(failures.join("\n"));
console.log("Static performance budgets passed.");
