const routeGrid = document.querySelector("#routeGrid");
const areaFilters = { center: "центр", parks: "парки", north: "парки", south: "усадьбы" };
const routePlannerPath = window.location.pathname.endsWith("/routes/") ? "../" : "./";

function renderRoutes(filter = "all") {
  routeGrid.innerHTML = curatedRoutes
    .filter((route) => filter === "all" || route.tags.some((tag) => tag.includes(filter)))
    .map((route, index) => `<article class="article-card"><div class="article-image-wrap"><img class="article-image" src="${routeImages[route.slug]}" alt="${route.title}" loading="lazy" decoding="async" width="1200" height="675" referrerpolicy="no-referrer" data-image-fallback /><span class="article-number">${String(index + 1).padStart(2, "0")}</span></div><div class="article-card-body"><div class="article-card-top"><span class="article-tag">${route.tags.join(" · ")}</span></div><h2>${route.title}</h2><p>${route.description}</p><div class="article-facts"><span><b>Длина</b> около ${route.distance} км</span><span><b>Точки</b> ${route.stops.length}</span></div><div class="article-actions"><a class="article-primary" href="./${route.slug}/">Открыть прогулку</a><a class="article-secondary" href="${routePlannerPath}?start=${route.start}&distance=${route.distance}&theme=${route.theme}&anchor=${route.anchor}">Изменить маршрут</a></div></div></article>`)
    .join("");
}

function selectRouteFilter(filter) {
  document.querySelectorAll(".article-filter").forEach((button) => {
    const isActive = button.dataset.filter === filter;
    button.classList.toggle("is-active", isActive);
    button.setAttribute("aria-pressed", String(isActive));
  });
  renderRoutes(filter);
}

document.querySelectorAll(".article-filter").forEach((button) => button.addEventListener("click", () => selectRouteFilter(button.dataset.filter)));
selectRouteFilter(areaFilters[location.hash.slice(1)] || "all");
