const fs = require("node:fs");
const path = require("node:path");

const files = ["index.html", "articles.html", "routes.html", "route.html", "areas.html", "privacy.html"];
const missing = [];
const hrefPattern = /href=["'](\.[^"'#?]+|[^"'#?]+\.html)["']/g;

for (const file of files) {
  const source = fs.readFileSync(file, "utf8");
  for (const match of source.matchAll(hrefPattern)) {
    const target = match[1].split("?")[0];
    if (target.startsWith("http")) continue;
    const resolved = path.resolve(path.dirname(file), target);
    if (!fs.existsSync(resolved)) missing.push(`${file} -> ${target}`);
  }
}

if (missing.length) throw new Error(`Broken local links:\n${missing.join("\n")}`);
console.log(`Checked local links in ${files.length} HTML files.`);
