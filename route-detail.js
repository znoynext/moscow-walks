const slug = new URLSearchParams(location.search).get("slug");
const route = Object.hasOwn(routeBySlug, slug) ? routeBySlug[slug] : null;
const card = document.querySelector("#routeDetail");
const body = document.createElement("div");
body.className = "article-card-body";
card.append(body);

function addTextElement(tagName, text, className) {
  const element = document.createElement(tagName);
  element.textContent = text;
  if (className) element.className = className;
  body.append(element);
  return element;
}

if (!route) {
  addTextElement("h1", "Прогулка не найдена");
  const back = addTextElement("a", "Все прогулки", "article-primary");
  back.href = "./routes/";
} else {
  document.title = `${route.title} — Пешком.Москва`;
  addTextElement("h1", route.title);
  addTextElement("p", route.description);
  addTextElement("p", `Старт: м. ${startNames[route.start] || route.start} · около ${route.distance} км`);

  const stops = document.createElement("ol");
  route.stops.forEach((stop) => {
    const item = document.createElement("li");
    item.textContent = stop;
    stops.append(item);
  });
  body.append(stops);

  const actions = document.createElement("div");
  actions.className = "article-actions";
  const params = new URLSearchParams({ start: route.start, distance: route.distance, theme: route.theme, anchor: route.anchor });
  const build = document.createElement("a");
  build.className = "article-primary";
  build.href = `./?${params.toString()}`;
  build.textContent = "Построить маршрут";
  const other = document.createElement("a");
  other.className = "article-secondary";
  other.href = "./routes/";
  other.textContent = "Другие прогулки";
  actions.append(build, other);
  body.append(actions);

  const structuredData = document.createElement("script");
  structuredData.type = "application/ld+json";
  structuredData.textContent = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "TouristTrip",
    name: route.title,
    description: route.description,
    touristType: "Пешеходная прогулка",
    itinerary: {
      "@type": "ItemList",
      itemListElement: route.stops.map((name, index) => ({ "@type": "ListItem", position: index + 1, name })),
    },
  }).replace(/</g, "\\u003c");
  document.head.append(structuredData);
}
