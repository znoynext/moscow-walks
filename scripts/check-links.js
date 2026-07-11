const fs = require("node:fs");
const path = require("node:path");

const files = ["index.html", "articles.html", "routes.html", "route.html", "areas.html", "privacy.html", ...fs.readdirSync("routes").filter((file) => file.endsWith(".html")).map((file) => path.join("routes", file))];
const missing = [];
const resourcePattern = /(?:href|src)=["']([^"'#]+)["']/g;

for (const file of files) {
  const source = fs.readFileSync(file, "utf8");
  for (const match of source.matchAll(resourcePattern)) {
    const target = match[1].split("?")[0];
    if (!target || target.includes("${") || /^(https?:|mailto:|data:)/.test(target)) continue;
    const resolved = target === "./" || target === "../" ? path.resolve(path.dirname(file), target, "index.html") : path.resolve(path.dirname(file), target);
    if (!fs.existsSync(resolved)) missing.push(`${file} -> ${target}`);
  }
}

if (missing.length) throw new Error(`Broken local links:\n${missing.join("\n")}`);
console.log(`Checked local links and assets in ${files.length} HTML files.`);
