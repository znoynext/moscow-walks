const fs = require("node:fs");
const path = require("node:path");

function htmlFiles(directory) {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const entryPath = path.join(directory, entry.name);
    return entry.isDirectory() ? htmlFiles(entryPath) : entry.name.endsWith(".html") ? [entryPath] : [];
  });
}

const files = ["index.html", "articles.html", "routes.html", "route.html", "areas.html", "privacy.html", ...htmlFiles("articles"), ...htmlFiles("areas"), ...htmlFiles("privacy"), ...htmlFiles("routes")];
const missing = [];
const resourcePattern = /(?:href|src)=["']([^"'#]+)["']/g;

for (const file of files) {
  const source = fs.readFileSync(file, "utf8");
  for (const match of source.matchAll(resourcePattern)) {
    const target = match[1].split("?")[0];
    if (!target || target.includes("${") || /^(https?:|mailto:|data:)/.test(target)) continue;
    const resolved = path.resolve(path.dirname(file), target);
    const checkedPath = fs.existsSync(resolved) && fs.statSync(resolved).isDirectory() ? path.join(resolved, "index.html") : resolved;
    if (!fs.existsSync(checkedPath)) missing.push(`${file} -> ${target}`);
  }
}

if (missing.length) throw new Error(`Broken local links:\n${missing.join("\n")}`);
console.log(`Checked local links and assets in ${files.length} HTML files.`);
