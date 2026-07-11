const fs = require("node:fs");
const path = require("node:path");
const { curatedRoutes } = require("../routes.js");

function htmlFiles(directory) {
  if (!fs.existsSync(directory)) return [];
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const entryPath = path.join(directory, entry.name);
    return entry.isDirectory() ? htmlFiles(entryPath) : entry.name.endsWith(".html") ? [entryPath] : [];
  });
}

const files = ["index.html", "articles.html", "routes.html", "route.html", "areas.html", "privacy.html", "offline.html", ...htmlFiles("articles"), ...htmlFiles("areas"), ...htmlFiles("privacy"), ...htmlFiles("routes")];
const missing = [];
const stale = [];
const invalidData = [];
const resourcePattern = /(?:href|src)=['"]([^'"#]+)['"]/g;
const starts = new Set([...fs.readFileSync("app.js", "utf8").matchAll(/id:\s*"(metro-[a-z0-9-]+)"/g)].map((match) => match[1]));
const anchors = new Set([...curatedRoutes.map((route) => route.anchor), ...[...fs.readFileSync("app.js", "utf8").matchAll(/anchor:\s*"([a-z0-9-]+)"/g)].map((match) => match[1])]);
const slugs = new Set(curatedRoutes.map((route) => route.slug));

for (const file of files) {
  const source = fs.readFileSync(file, "utf8");
  for (const match of source.matchAll(resourcePattern)) {
    const target = match[1].split("?")[0];
    if (!target || target.includes("${") || /^(https?:|mailto:|data:|javascript:)/.test(target)) continue;
    if (target.endsWith(".html") && fs.existsSync(path.join(path.dirname(file), target.replace(/\.html$/, ""), "index.html"))) stale.push(`${file} -> ${target}`);
    const resolved = path.resolve(path.dirname(file), target);
    const checkedPath = fs.existsSync(resolved) && fs.statSync(resolved).isDirectory() ? path.join(resolved, "index.html") : resolved;
    if (!fs.existsSync(checkedPath)) missing.push(`${file} -> ${target}`);
  }
  for (const match of source.matchAll(/(?:href|src)=['"]([^'"]*)['"]/g)) {
    const value = match[1];
    if (!value.includes("?")) continue;
    if (value.includes("${")) continue;
    const query = new URL(value, "https://example.test/").searchParams;
    if (query.get("start") && !starts.has(query.get("start"))) invalidData.push(`${file}: unknown start ${query.get("start")}`);
    for (const key of ["anchor", "anchors"]) for (const value of (query.get(key) || "").split(",").filter(Boolean)) if (!anchors.has(value)) invalidData.push(`${file}: unknown anchor ${value}`);
  }
}
for (const route of curatedRoutes) {
  if (!fs.existsSync(path.join("routes", route.slug, "index.html"))) invalidData.push(`missing generated route: ${route.slug}`);
}
if (stale.length || missing.length || invalidData.length) throw new Error([...stale.map((item) => `Stale internal HTML link: ${item}`), ...missing.map((item) => `Broken local link: ${item}`), ...invalidData].join("\n"));
console.log(`Checked ${files.length} HTML files, clean URLs, route data and generated pages.`);
