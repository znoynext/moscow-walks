const fs = require("node:fs");
const path = require("node:path");
const { curatedRoutes, routeImages, startNames } = require("../routes.js");

const root = path.resolve(__dirname, "..");
const outputDir = path.join(root, "routes");
const siteUrl = "https://znoynext.github.io/moscow-walks";
const today = new Date().toISOString().slice(0, 10);

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[character]);
}

function routeUrl(route) {
  return `${siteUrl}/routes/${route.slug}/`;
}

function routePage(route) {
  const image = routeImages[route.slug];
  const url = routeUrl(route);
  const stops = route.stops.map((stop) => `<li>${escapeHtml(stop)}</li>`).join("");
  const trip = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "TouristTrip",
    name: route.title,
    description: route.description,
    url,
    image,
    touristType: "Пешеходная прогулка",
    itinerary: {
      "@type": "ItemList",
      itemListElement: route.stops.map((name, position) => ({ "@type": "ListItem", position: position + 1, name })),
    },
  }).replace(/</g, "\\u003c");

  return `<!doctype html>
<html lang="ru">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${escapeHtml(route.title)} — Пешком.Москва</title>
    <meta name="description" content="${escapeHtml(route.description)}" />
    <meta name="robots" content="index, follow" />
    <link rel="canonical" href="${url}" />
    <meta property="og:title" content="${escapeHtml(route.title)} — Пешком.Москва" />
    <meta property="og:description" content="${escapeHtml(route.description)}" />
    <meta property="og:type" content="website" />
    <meta property="og:url" content="${url}" />
    <meta property="og:image" content="${siteUrl}/assets/social-preview.svg" />
    <meta property="og:image:alt" content="Пешком.Москва — пешеходные маршруты" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:image" content="${siteUrl}/assets/social-preview.svg" />
    <link rel="manifest" href="../../manifest.webmanifest" />
    <link rel="icon" href="../../assets/favicon.svg" type="image/svg+xml" />
    <link rel="stylesheet" href="../../styles.css" />
    <link rel="stylesheet" href="../../ui-fixes.css" />
    <script type="application/ld+json">${trip}</script>
  </head>
  <body class="articles-page">
    <header class="articles-header"><a class="articles-brand" href="../../">Пешком.Москва</a><a class="back-link" href="../../routes/">Все прогулки</a></header>
    <main class="articles-main"><article class="article-card"><div class="article-image-wrap"><img class="article-image" src="${escapeHtml(image)}" alt="${escapeHtml(route.title)}" width="1200" height="675" decoding="async" referrerpolicy="no-referrer" onerror="this.parentElement.classList.add('is-broken')" /></div><div class="article-card-body"><div class="article-card-top"><span class="article-tag">${route.tags.map(escapeHtml).join(" · ")}</span><span class="article-number">${route.distance} км</span></div><h1>${escapeHtml(route.title)}</h1><p>${escapeHtml(route.description)}</p><div class="article-facts"><span><b>Старт</b> м. ${escapeHtml(startNames[route.start] || route.start)}</span><span><b>Длина</b> около ${route.distance} км</span></div><h2>Точки маршрута</h2><ol>${stops}</ol><div class="article-actions"><a class="article-primary" href="../../?start=${encodeURIComponent(route.start)}&amp;distance=${route.distance}&amp;theme=${encodeURIComponent(route.theme)}&amp;anchor=${encodeURIComponent(route.anchor)}">Открыть в конструкторе</a><a class="article-secondary" href="../../routes/">Другие прогулки</a></div></div></article></main>
    <footer class="site-footer"><a href="../../privacy/">Приватность</a><a href="../../routes/">Все прогулки</a></footer>
    <script defer src="../../sw-register.js"></script>
  </body>
</html>
`;
}

function sitemap() {
  const staticPages = [
    ["/", "weekly", "1.0"], ["/articles/", "monthly", "0.8"], ["/routes/", "weekly", "0.9"], ["/privacy/", "yearly", "0.2"], ["/areas/", "monthly", "0.6"],
  ];
  const entries = [...staticPages, ...curatedRoutes.map((route) => [`/routes/${route.slug}/`, "monthly", "0.8"])];
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${entries.map(([pathname, changefreq, priority]) => `  <url><loc>${siteUrl}${pathname}</loc><lastmod>${today}</lastmod><changefreq>${changefreq}</changefreq><priority>${priority}</priority></url>`).join("\n")}\n</urlset>\n`;
}

fs.mkdirSync(outputDir, { recursive: true });
for (const entry of fs.readdirSync(outputDir, { withFileTypes: true })) {
  if (entry.isFile() && entry.name.endsWith(".html")) fs.unlinkSync(path.join(outputDir, entry.name));
}
for (const route of curatedRoutes) {
  const routeDir = path.join(outputDir, route.slug);
  fs.mkdirSync(routeDir, { recursive: true });
  fs.writeFileSync(path.join(routeDir, "index.html"), routePage(route));
}

function writeCleanCopy(sourceName, directory, replacements) {
  const source = fs.readFileSync(path.join(root, sourceName), "utf8");
  const transformed = replacements.reduce((html, [from, to]) => html.replaceAll(from, to), source);
  const targetDir = path.join(root, directory);
  fs.mkdirSync(targetDir, { recursive: true });
  fs.writeFileSync(path.join(targetDir, "index.html"), transformed);
}

writeCleanCopy("articles.html", "articles", [["/articles.html", "/articles/"], ["./routes.html", "../routes/"], ["./routes/", "../routes/"], ["./privacy.html", "../privacy/"], ["./privacy/", "../privacy/"], ["href=\"./\"", "href=\"../\""], ["src=\"./", "src=\"../"], ["href=\"./manifest", "href=\"../manifest"], ["href=\"./assets", "href=\"../assets"], ["href=\"./styles.css", "href=\"../styles.css"], ["href=\"./ui-fixes.css", "href=\"../ui-fixes.css"]]);
writeCleanCopy("areas.html", "areas", [["/areas.html", "/areas/"], ["./routes.html", "../routes/"], ["./routes/", "../routes/"], ["./privacy.html", "../privacy/"], ["./privacy/", "../privacy/"], ["href=\"./\"", "href=\"../\""], ["src=\"./", "src=\"../"], ["href=\"./assets", "href=\"../assets"], ["href=\"./styles.css", "href=\"../styles.css"], ["href=\"./ui-fixes.css", "href=\"../ui-fixes.css"]]);
writeCleanCopy("privacy.html", "privacy", [["/privacy.html", "/privacy/"], ["href=\"./\"", "href=\"../\""], ["src=\"./", "src=\"../"], ["href=\"./assets", "href=\"../assets"], ["href=\"./styles.css", "href=\"../styles.css"], ["href=\"./ui-fixes.css", "href=\"../ui-fixes.css"]]);
writeCleanCopy("routes.html", "routes", [["/routes.html", "/routes/"], ["./routes/${route.slug}.html", "./${route.slug}/"], ["./articles.html", "../articles/"], ["./articles/", "../articles/"], ["./privacy.html", "../privacy/"], ["./privacy/", "../privacy/"], ["href=\"./\"", "href=\"../\""], ["href=\"./?", "href=\"../?"], ["src=\"./", "src=\"../"], ["href=\"./assets", "href=\"../assets"], ["href=\"./manifest", "href=\"../manifest"], ["href=\"./styles.css", "href=\"../styles.css"], ["href=\"./ui-fixes.css", "href=\"../ui-fixes.css"]]);
fs.writeFileSync(path.join(root, "sitemap.xml"), sitemap());
console.log(`Generated ${curatedRoutes.length} static route pages, clean catalogue pages and sitemap.xml.`);
