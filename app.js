const OSRM_FOOT_URLS = [
  "https://routing.openstreetmap.de/routed-foot/route/v1/foot/",
  "https://router.project-osrm.org/route/v1/foot/",
];
const NOMINATIM_URL = "https://nominatim.openstreetmap.org/search";

const starts = [
  { id: "metro-okhotny", name: "м. Охотный Ряд", lat: 55.7577, lon: 37.6156, area: "center" },
  { id: "metro-kropotkinskaya", name: "м. Кропоткинская", lat: 55.7453, lon: 37.6037, area: "arbat" },
  { id: "metro-park-kultury", name: "м. Парк культуры", lat: 55.7357, lon: 37.5947, area: "gorky" },
  { id: "metro-tretyakovskaya", name: "м. Третьяковская", lat: 55.7406, lon: 37.6256, area: "zamoskvorechye" },
  { id: "metro-mayakovskaya", name: "м. Маяковская", lat: 55.7690, lon: 37.5964, area: "patriki" },
  { id: "metro-vdnkh", name: "м. ВДНХ", lat: 55.8213, lon: 37.6410, area: "vdnh" },
  { id: "metro-kievskaya", name: "м. Киевская", lat: 55.7436, lon: 37.5655, area: "river-west" },
  { id: "metro-smolenskaya", name: "м. Смоленская", lat: 55.7473, lon: 37.5822, area: "arbat" },
  { id: "metro-chistye", name: "м. Чистые пруды", lat: 55.7648, lon: 37.6387, area: "boulevards" },
];

const routespace = [
  { id: "center", name: "Исторический центр", center: [55.7558, 37.6202], themes: ["classic", "architecture"], mood: "плотный центр, площади и пешеходные улицы" },
  { id: "boulevards", name: "Бульварное кольцо", center: [55.7622, 37.6156], themes: ["classic", "green", "architecture"], mood: "тенистые бульвары и спокойные переходы" },
  { id: "zamoskvorechye", name: "Замоскворечье", center: [55.7418, 37.6207], themes: ["classic", "architecture", "water"], mood: "тихие улицы, музеи и виды через реку" },
  { id: "gorky", name: "Парк Горького и набережные", center: [55.7294, 37.6001], themes: ["green", "water"], mood: "широкие аллеи, парки и Москва-река" },
  { id: "arbat", name: "Арбат и Пречистенка", center: [55.7469, 37.5902], themes: ["classic", "architecture"], mood: "старые переулки, особняки и понятная пешеходная ось" },
  { id: "patriki", name: "Патрики и Тверские бульвары", center: [55.7639, 37.5944], themes: ["classic", "water", "architecture"], mood: "камерные улицы, пруды и городская фактура" },
  { id: "vdnh", name: "ВДНХ и Останкино", center: [55.8278, 37.6263], themes: ["green", "architecture"], mood: "монументальная архитектура и большие прогулочные пространства" },
  { id: "river-west", name: "Западная река", center: [55.7257, 37.5578], themes: ["green", "water", "view"], mood: "длинные видовые прогулки у воды" },
];

const pois = [
  point("red-square", "Красная площадь", 55.7539, 37.6208, "center", ["classic", "architecture"], 99, "Главная площадь Москвы, сильный якорь для коротких и средних прогулок."),
  point("alexander-garden", "Александровский сад", 55.7521, 37.6137, "center", ["classic", "green"], 92, "Зелёный проход у Кремля, удобен как спокойная пауза в центре."),
  point("manege", "Манежная площадь", 55.7555, 37.6139, "center", ["classic"], 82, "Открытая городская площадь рядом с ключевыми пешеходными связями."),
  point("bolshoi", "Большой театр", 55.7601, 37.6187, "center", ["classic", "architecture"], 88, "Архитектурная доминанта и хорошая точка для маршрута через Театральную площадь."),
  point("nikolskaya", "Никольская улица", 55.7586, 37.6246, "center", ["classic", "architecture"], 90, "Пешеходная улица с плотной исторической средой."),
  point("ilyinka", "Ильинка", 55.7559, 37.6267, "center", ["architecture", "classic"], 82, "Короткая архитектурная ось между Китай-городом и Красной площадью."),
  point("varvarka", "Варварка", 55.7529, 37.6264, "center", ["classic", "architecture"], 86, "Историческая улица с выходом к Зарядью."),
  point("zaryadye", "Парк Зарядье", 55.7517, 37.6286, "center", ["classic", "green", "water", "view"], 96, "Виды на реку, Кремль и удобная пешеходная связка с Китай-городом."),
  point("lubyanka", "Лубянская площадь", 55.7606, 37.6276, "center", ["classic", "architecture"], 74, "Городская площадь рядом с Никольской и Мясницкой."),
  point("myasnitskaya", "Мясницкая улица", 55.7634, 37.6364, "boulevards", ["architecture", "classic"], 84, "Красивая улица с хорошим темпом для пешей прогулки."),
  point("chistye-prudy", "Чистые пруды", 55.7648, 37.6384, "boulevards", ["green", "classic", "water"], 88, "Вода, бульвар и много мест для естественной остановки."),
  point("pokrovka", "Покровка", 55.7614, 37.6454, "boulevards", ["architecture", "classic"], 78, "Живая улица с историческими фасадами и кафе."),
  point("sretensky", "Сретенский бульвар", 55.7657, 37.6324, "boulevards", ["green", "architecture"], 80, "Короткий зелёный участок Бульварного кольца."),
  point("tverskoy", "Тверской бульвар", 55.7624, 37.6020, "boulevards", ["green", "architecture"], 84, "Тенистая прогулочная ось между центром и Патриками."),
  point("strastnoy", "Страстной бульвар", 55.7664, 37.6091, "boulevards", ["green", "classic"], 80, "Удобный переход от Пушкинской к Трубной."),
  point("petrovsky", "Петровский бульвар", 55.7668, 37.6205, "boulevards", ["green", "architecture"], 78, "Спокойный зелёный отрезок в плотной городской среде."),
  point("trubnaya", "Трубная площадь", 55.7677, 37.6217, "boulevards", ["classic"], 73, "Перекрёсток бульваров и удобная точка смены направления."),
  point("hermitage", "Сад Эрмитаж", 55.7721, 37.6092, "boulevards", ["green"], 82, "Уютный парк для короткой передышки."),
  point("patriarshiye", "Патриаршие пруды", 55.7639, 37.5924, "patriki", ["classic", "water"], 88, "Камерный район с красивыми улицами вокруг пруда."),
  point("spiridonovka", "Спиридоновка", 55.7608, 37.5938, "patriki", ["architecture", "classic"], 80, "Тихая улица с особняками и мягким городским ритмом."),
  point("malaya-bronnaya", "Малая Бронная", 55.7640, 37.5967, "patriki", ["classic", "architecture"], 76, "Живая улица с кафе и плотной городской фактурой."),
  point("tishinka", "Тишинская площадь", 55.7728, 37.5838, "patriki", ["classic"], 70, "Полезная точка для более длинного маршрута вокруг Пресни."),
  point("zoo", "Московский зоопарк", 55.7616, 37.5774, "patriki", ["green"], 78, "Зелёный якорь рядом с Баррикадной и Красной Пресней."),
  point("arbat", "Старый Арбат", 55.7498, 37.5912, "arbat", ["classic", "architecture"], 84, "Пешеходная улица с понятным ритмом прогулки."),
  point("arbatskiye-lanes", "Арбатские переулки", 55.7525, 37.5960, "arbat", ["architecture", "classic"], 80, "Камерные улицы, где маршрут ощущается менее туристическим."),
  point("ostozhenka", "Остоженка", 55.7417, 37.6007, "arbat", ["architecture", "classic"], 82, "Тихая архитектурная ось рядом с центром."),
  point("prechistenka", "Пречистенка", 55.7429, 37.5950, "arbat", ["architecture", "classic"], 84, "Особняки, музеи и спокойный темп прогулки."),
  point("cathedral", "Храм Христа Спасителя", 55.7446, 37.6055, "arbat", ["architecture", "water", "view"], 88, "Видовая точка у Москвы-реки."),
  point("krymsky-bridge", "Крымский мост", 55.7351, 37.5995, "gorky", ["water", "view"], 84, "Красивый переход между Парком Горького и районом Кропоткинской."),
  point("muzeon", "Музеон", 55.7355, 37.6051, "gorky", ["green", "water"], 88, "Парк искусств рядом с набережной."),
  point("gorky", "Парк Горького", 55.7298, 37.6011, "gorky", ["green", "water"], 94, "Широкие аллеи, набережная и понятная прогулочная логика."),
  point("andreevsky", "Андреевский мост", 55.7156, 37.5795, "gorky", ["water", "view"], 76, "Видовой мост и хороший переход к Нескучному саду."),
  point("neskuchny", "Нескучный сад", 55.7169, 37.5936, "gorky", ["green"], 86, "Тихий зелёный участок для длинной прогулки."),
  point("leninsky-view", "Смотровая у РАН", 55.7085, 37.5748, "gorky", ["view", "architecture"], 76, "Нестандартная видовая точка для длинного маршрута."),
  point("tretyakov", "Третьяковская галерея", 55.7414, 37.6208, "zamoskvorechye", ["classic", "architecture"], 88, "Музейный якорь Замоскворечья."),
  point("lavrushinsky", "Лаврушинский переулок", 55.7412, 37.6202, "zamoskvorechye", ["classic", "architecture"], 82, "Камерная улица рядом с Третьяковкой."),
  point("bolotnaya", "Болотная набережная", 55.7464, 37.6125, "zamoskvorechye", ["water", "classic", "view"], 84, "Виды на воду и удобный переход к острову."),
  point("kadashevskaya", "Кадашёвская набережная", 55.7444, 37.6191, "zamoskvorechye", ["water", "architecture"], 80, "Тихая набережная с видом на центр."),
  point("pyatnitskaya", "Пятницкая улица", 55.7386, 37.6267, "zamoskvorechye", ["classic", "architecture"], 82, "Живая улица с хорошей пешеходной связностью."),
  point("ordynka", "Большая Ордынка", 55.7368, 37.6231, "zamoskvorechye", ["architecture", "classic"], 80, "Спокойная историческая улица Замоскворечья."),
  point("novodevichy", "Новодевичий монастырь", 55.7264, 37.5567, "river-west", ["architecture", "water"], 92, "Исторический ансамбль и пруд рядом."),
  point("novodevichy-pond", "Новодевичьи пруды", 55.7244, 37.5547, "river-west", ["green", "water"], 86, "Тихая вода и красивый обход монастыря."),
  point("luzhniki", "Лужники", 55.7158, 37.5537, "river-west", ["water", "green"], 82, "Широкие пространства и длинные участки у реки."),
  point("sparrow", "Воробьёвы горы", 55.7104, 37.5426, "river-west", ["green", "water", "view"], 92, "Смотровая, лесные дорожки и выход к реке."),
  point("moscow-state", "Главное здание МГУ", 55.7033, 37.5306, "river-west", ["architecture", "view"], 84, "Сильная архитектурная точка для длинного видового маршрута."),
  point("vdnh", "ВДНХ", 55.8310, 37.6298, "vdnh", ["architecture", "green"], 96, "Монументальная архитектура и широкие пешеходные пространства."),
  point("friendship-fountain", "Фонтан Дружба народов", 55.8298, 37.6326, "vdnh", ["architecture", "classic"], 88, "Главная точка внутри ВДНХ для выразительного маршрута."),
  point("cosmos", "Павильон Космос", 55.8345, 37.6247, "vdnh", ["architecture"], 84, "Монументальный павильон с сильным визуальным образом."),
  point("ostankino-park", "Останкинский парк", 55.8245, 37.6131, "vdnh", ["green"], 86, "Зелёный маршрут рядом с ВДНХ."),
  point("botanical-garden", "Главный ботанический сад", 55.8421, 37.6038, "vdnh", ["green"], 84, "Подходит для длинной зелёной прогулки."),
  point("worker", "Рабочий и колхозница", 55.8297, 37.6469, "vdnh", ["architecture", "classic"], 80, "Яркая городская скульптура у входа в ВДНХ."),
];

let map;
let markersLayer;
let routeLayer;
let currentRoute = [];
let currentWalkingLine = [];
let currentSummary = { distanceKm: 0, durationMin: 0, calories: 0 };
let latestRun = 0;
let variantSeed = 0;

const svgBounds = {
  minLat: 55.69,
  maxLat: 55.85,
  minLon: 37.52,
  maxLon: 37.66,
};

const elements = {
  form: document.querySelector("#routeForm"),
  start: document.querySelector("#startSelect"),
  startSearch: document.querySelector("#startSearch"),
  distance: document.querySelector("#distanceSelect"),
  anchor: document.querySelector("#anchorSelect"),
  anchorSearch: document.querySelector("#anchorSearch"),
  totalDistance: document.querySelector("#totalDistance"),
  totalTime: document.querySelector("#totalTime"),
  stopCount: document.querySelector("#stopCount"),
  caloriesCount: document.querySelector("#caloriesCount"),
  routeReason: document.querySelector("#routeReason"),
  routeStatus: document.querySelector("#routeStatus"),
  routeTitle: document.querySelector("#routeTitle"),
  routeArea: document.querySelector("#routeArea"),
  stopsList: document.querySelector("#stopsList"),
  fallbackMap: document.querySelector("#fallbackMap"),
  mapStatus: document.querySelector("#mapStatus"),
  copyButton: document.querySelector("#copyButton"),
  exportButton: document.querySelector("#exportButton"),
  regenerateButton: document.querySelector("#regenerateButton"),
  placeHints: document.querySelector("#placeHints"),
};

function point(id, name, lat, lon, area, themes, score, note) {
  return { id, name, lat, lon, area, themes, score, note };
}

function init() {
  fillSelects();
  fillHints();
  initMap();
  elements.form.addEventListener("submit", handleSubmit);
  elements.regenerateButton.addEventListener("click", generateAndRender);
  elements.copyButton.addEventListener("click", copyRoute);
  elements.exportButton.addEventListener("click", exportRouteJson);
  generateAndRender();
}

function fillSelects() {
  elements.start.innerHTML = starts.map((start) => `<option value="${start.id}">${start.name}</option>`).join("");
  elements.anchor.innerHTML = [
    '<option value="">Не выбирать</option>',
    ...pois
      .slice()
      .sort((a, b) => a.name.localeCompare(b.name, "ru"))
      .map((poi) => `<option value="${poi.id}">${poi.name}</option>`),
  ].join("");
}

function fillHints() {
  elements.placeHints.innerHTML = [...starts, ...pois]
    .map((place) => `<option value="${place.name}"></option>`)
    .join("");
}

function initMap() {
  if (!window.L) {
    elements.mapStatus.textContent = "Локальная схема";
    return;
  }

  map = L.map("map", {
    zoomControl: false,
    scrollWheelZoom: true,
  }).setView([55.7539, 37.6208], 12);

  L.control.zoom({ position: "bottomright" }).addTo(map);
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
  }).addTo(map);

  markersLayer = L.layerGroup().addTo(map);
  routeLayer = L.layerGroup().addTo(map);
  elements.mapStatus.textContent = "OpenStreetMap";
  elements.fallbackMap.classList.add("hidden");
}

function handleSubmit(event) {
  event.preventDefault();
  generateAndRender();
}

async function generateAndRender() {
  const run = ++latestRun;
  variantSeed += 1;
  setRouteLoading(true);

  const selectedStart = starts.find((item) => item.id === elements.start.value) || starts[0];
  const selectedAnchor = pois.find((item) => item.id === elements.anchor.value);
  const targetKm = Number(elements.distance.value);
  const theme = new FormData(elements.form).get("theme");
  const start = (await resolveSearchPoint(elements.startSearch.value, "Старт из поиска", "search")) || selectedStart;
  const anchor = (await resolveSearchPoint(elements.anchorSearch.value, "Место из поиска", "search")) || selectedAnchor;

  if (run !== latestRun) return;
  currentRoute = buildRoute({ start, targetKm, anchor, theme, variantSeed });
  const walking = await buildWalkingRoute(currentRoute);

  if (run !== latestRun) return;
  currentWalkingLine = walking.coordinates;
  renderRoute(currentRoute, walking);
  setRouteLoading(false);
}

async function resolveSearchPoint(query, note, area) {
  const text = query.trim();
  if (text.length < 3) return null;

  const local = [...starts, ...pois].find((place) => place.name.toLowerCase() === text.toLowerCase());
  if (local) return point(local.id, local.name, local.lat, local.lon, local.area, local.themes || [], local.score || 76, local.note || note);

  try {
    const params = new URLSearchParams({
      q: `${text}, Москва`,
      format: "jsonv2",
      limit: "1",
      viewbox: "37.25,56.02,38.02,55.56",
      bounded: "1",
      addressdetails: "0",
    });
    const response = await fetch(`${NOMINATIM_URL}?${params.toString()}`, {
      headers: { Accept: "application/json" },
    });
    if (!response.ok) return null;
    const data = await response.json();
    const result = data[0];
    if (!result) return null;
    return point(
      `search-${text.toLowerCase().replace(/\s+/g, "-")}`,
      result.display_name.split(",").slice(0, 2).join(", "),
      Number(result.lat),
      Number(result.lon),
      area,
      [],
      82,
      note,
    );
  } catch (error) {
    console.warn("Не удалось найти точку через OpenStreetMap", error);
    return null;
  }
}

function buildRoute({ start, targetKm, anchor, theme, variantSeed }) {
  const area = chooseArea(start, anchor, theme);
  const candidatePool = rankCandidates({ start, anchor, theme, area, targetKm, variantSeed });
  const desiredStops = targetKm <= 3 ? 4 : targetKm <= 5 ? 6 : targetKm <= 8 ? 8 : 10;
  const route = [asRouteStop(start, "Старт: удобно начать рядом с метро или выбранной точкой.")];

  if (anchor) {
    route.push(asRouteStop(anchor, anchor.note || "Обязательная точка, которую маршрут старается встроить естественно."));
  } else {
    route.push(candidatePool[0]);
  }

  let attempts = 0;
  while (route.length < desiredStops && attempts < 80) {
    attempts += 1;
    const next = chooseNextStop({ route, candidates: candidatePool, start, area, theme, targetKm, variantSeed });
    if (!next) break;
    const projected = roughRouteDistance([...route, next]);
    if (projected > targetKm * 1.25 && route.length >= desiredStops - 2) break;
    route.push(next);
  }

  return orderRoute(addUsefulFinish(route, targetKm), start);
}

function chooseArea(start, anchor, theme) {
  const pointForArea = anchor || start;
  return routespace
    .map((area) => {
      const areaPoint = { lat: area.center[0], lon: area.center[1] };
      const themeBoost = area.themes.includes(theme) ? 1.25 : 1;
      return { area, value: themeBoost / Math.max(0.45, distanceKm(pointForArea, areaPoint)) };
    })
    .sort((a, b) => b.value - a.value)[0].area;
}

function rankCandidates({ start, anchor, theme, area, targetKm, variantSeed }) {
  const origin = anchor || start;
  return pois
    .map((poi) => {
      const areaBoost = poi.area === area.id ? 38 : sameCluster(poi.area, area.id) ? 16 : -22;
      const themeBoost = poi.themes.includes(theme) ? 28 : 0;
      const distancePenalty = Math.max(0, distanceKm(origin, poi) - targetKm * 0.45) * 18;
      const shortWalkBoost = distanceKm(origin, poi) < 1.8 ? 9 : 0;
      const variantBoost = seededNoise(poi.id, variantSeed) * 14;
      return { ...poi, value: poi.score + areaBoost + themeBoost + shortWalkBoost + variantBoost - distancePenalty };
    })
    .filter((poi) => !anchor || poi.id !== anchor.id)
    .sort((a, b) => b.value - a.value)
    .map((poi) => asRouteStop(poi, poi.note));
}

function chooseNextStop({ route, candidates, start, area, theme, targetKm, variantSeed }) {
  const last = route[route.length - 1];
  const currentKm = roughRouteDistance(route);
  return candidates
    .filter((candidate) => !route.some((stop) => stop.id === candidate.id))
    .map((candidate) => {
      const leg = distanceKm(last, candidate);
      const fromStart = distanceKm(start, candidate);
      const ideal = idealLeg(targetKm);
      const themeBoost = candidate.themes.includes(theme) ? 18 : 0;
      const areaBoost = candidate.area === area.id ? 22 : sameCluster(candidate.area, area.id) ? 8 : -18;
      const legPenalty = Math.abs(leg - ideal) * 22;
      const jumpPenalty = leg > targetKm * 0.36 ? 45 : 0;
      const overrunPenalty = currentKm + leg > targetKm * 1.16 ? 48 : 0;
      const sprawlPenalty = fromStart > targetKm * 0.92 ? 24 : 0;
      const varietyBoost = new Set([...route.flatMap((stop) => stop.themes), ...candidate.themes]).size * 2;
      const variantBoost = seededNoise(`${candidate.id}-${route.length}`, variantSeed) * 10;
      return {
        candidate,
        value: candidate.score + themeBoost + areaBoost + varietyBoost + variantBoost - legPenalty - jumpPenalty - overrunPenalty - sprawlPenalty,
      };
    })
    .filter(({ candidate }) => {
      const leg = distanceKm(last, candidate);
      return leg >= 0.25 && leg <= Math.max(2.3, targetKm * 0.38);
    })
    .sort((a, b) => b.value - a.value)[0]?.candidate;
}

function addUsefulFinish(route, targetKm) {
  const last = route[route.length - 1];
  const finish = starts
    .map((station) => ({ station, km: distanceKm(last, station) }))
    .filter(({ station }) => !route.some((stop) => stop.id === station.id))
    .sort((a, b) => a.km - b.km)[0];
  if (!finish) return route;

  const withFinish = [...route, asRouteStop(finish.station, "Финиш рядом с метро, чтобы прогулку было легко завершить.")];
  if (roughRouteDistance(withFinish) <= targetKm * 1.28 || finish.km < 0.75) return withFinish;
  return route;
}

function orderRoute(route, start) {
  const fixedStart = route[0];
  const rest = route.slice(1);
  const ordered = [fixedStart];
  let current = start;

  while (rest.length) {
    const nextIndex = rest
      .map((stop, index) => ({ index, km: distanceKm(current, stop), score: stop.score }))
      .sort((a, b) => a.km - b.km || b.score - a.score)[0].index;
    const [next] = rest.splice(nextIndex, 1);
    ordered.push(next);
    current = next;
  }
  return ordered;
}

async function buildWalkingRoute(route) {
  if (route.length < 2) return routeFallback(route);
  const coords = route.map((stop) => `${stop.lon},${stop.lat}`).join(";");
  const params = new URLSearchParams({
    overview: "full",
    geometries: "geojson",
    steps: "false",
    continue_straight: "false",
  });

  try {
    for (const baseUrl of OSRM_FOOT_URLS) {
      const response = await fetch(`${baseUrl}${coords}?${params.toString()}`);
      if (!response.ok) continue;
      const data = await response.json();
      const osrmRoute = data.routes?.[0];
      if (!osrmRoute?.geometry?.coordinates) continue;
      return {
        source: "osrm",
        distanceKm: osrmRoute.distance / 1000,
        durationMin: Math.round(osrmRoute.duration / 60),
        coordinates: osrmRoute.geometry.coordinates.map(([lon, lat]) => [lat, lon]),
      };
    }
    throw new Error("No OSRM provider returned a route");
  } catch (error) {
    console.warn("OSRM недоступен, включена локальная схема", error);
    return routeFallback(route);
  }
}

function routeFallback(route) {
  return {
    source: "fallback",
    distanceKm: roughRouteDistance(route),
    durationMin: Math.round((roughRouteDistance(route) / 4.2) * 60),
    coordinates: route.map((stop) => [stop.lat, stop.lon]),
  };
}

function renderRoute(route, walking) {
  if (!route.length) return;
  const area = routeArea(route);
  elements.totalDistance.textContent = `${walking.distanceKm.toFixed(1)} км`;
  elements.totalTime.textContent = `${walking.durationMin} мин`;
  elements.stopCount.textContent = String(route.length);
  elements.caloriesCount.textContent = `${estimateCalories(walking.distanceKm)} ккал`;
  currentSummary = {
    distanceKm: walking.distanceKm,
    durationMin: walking.durationMin,
    calories: estimateCalories(walking.distanceKm),
  };
  elements.routeTitle.textContent = buildRouteTitle(route);
  elements.routeArea.textContent = area ? area.name : "Городская прогулка";
  elements.routeReason.textContent = explainRoute(route, area, walking);
  elements.routeStatus.textContent =
    walking.source === "osrm"
      ? "Линия построена по пешеходной сети OpenStreetMap через бесплатный OSRM."
      : "OSRM сейчас недоступен, показана локальная схема маршрута.";
  renderStops(route);
  renderFallbackMap(walking.coordinates, route);
  renderLeafletRoute(route, walking.coordinates);
}

function renderLeafletRoute(route, line) {
  if (!map || !window.L) return;
  markersLayer.clearLayers();
  routeLayer.clearLayers();

  const polyline = L.polyline(line, {
    color: "#ce4a3b",
    weight: 6,
    opacity: 0.92,
    lineCap: "round",
    lineJoin: "round",
  }).addTo(routeLayer);

  route.forEach((stop, index) => {
    L.marker([stop.lat, stop.lon], {
      icon: createMarkerIcon(index + 1, index === 0),
    })
      .bindPopup(`<strong>${index + 1}. ${stop.name}</strong><br>${stop.note}`)
      .addTo(markersLayer);
  });

  map.fitBounds(polyline.getBounds(), { padding: [36, 36], maxZoom: 16 });
}

function createMarkerIcon(number, isStart) {
  const color = isStart ? "#b9903c" : "#ce4a3b";
  return L.divIcon({
    className: "walk-marker",
    html: `<span style="background:${color}">${number}</span>`,
    iconSize: [30, 30],
    iconAnchor: [15, 15],
    popupAnchor: [0, -14],
  });
}

function buildRouteTitle(route) {
  const primary = routeArea(route);
  if (primary) return `${primary.name}: ${route[0].name} → ${route[route.length - 1].name}`;
  return `${route[0].name} → ${route[route.length - 1].name}`;
}

function routeArea(route) {
  const counts = route.reduce((acc, stop) => {
    acc[stop.area] = (acc[stop.area] || 0) + 1;
    return acc;
  }, {});
  const areaId = Object.entries(counts).sort((a, b) => b[1] - a[1])[0]?.[0];
  return routespace.find((area) => area.id === areaId);
}

function renderStops(route) {
  elements.stopsList.innerHTML = route
    .map((stop, index) => {
      const leg = index === 0 ? "старт" : `${distanceKm(route[index - 1], stop).toFixed(1)} км`;
      const tags = stop.themes.slice(0, 2).map(themeLabel).join(" · ");
      return `
        <li class="stop">
          <span class="stop-number">${index + 1}</span>
          <div>
            <h3>${stop.name}</h3>
            <p>${stop.note}</p>
            ${tags ? `<span class="stop-tags">${tags}</span>` : ""}
          </div>
          <small>${leg}</small>
        </li>
      `;
    })
    .join("");
}

function renderFallbackMap(line, route) {
  const points = line.map(([lat, lon]) => projectPoint({ lat, lon }));
  const stopPoints = route.map(projectPoint);
  const polyline = points.map((mapPoint) => `${mapPoint.x},${mapPoint.y}`).join(" ");
  const river = "M40,430 C190,360 260,490 390,420 C520,350 570,470 710,400 C810,350 880,380 960,330";
  const gardenRing = "M235,140 C420,40 705,115 780,300 C850,470 650,640 420,610 C190,580 105,410 145,260 C160,210 190,170 235,140";

  elements.fallbackMap.innerHTML = `
    <rect width="1000" height="720" fill="#f3f5f0"></rect>
    <path d="${river}" fill="none" stroke="#8bb9cd" stroke-width="38" stroke-linecap="round" opacity="0.72"></path>
    <path d="${gardenRing}" fill="none" stroke="#d7c893" stroke-width="14" stroke-dasharray="8 14" opacity="0.72"></path>
    <g opacity="0.45">
      <path d="M120 210 L900 580" stroke="#cbd3ce" stroke-width="5"></path>
      <path d="M230 640 L760 80" stroke="#cbd3ce" stroke-width="5"></path>
      <path d="M80 510 L940 170" stroke="#cbd3ce" stroke-width="4"></path>
    </g>
    <polyline points="${polyline}" fill="none" stroke="#ce4a3b" stroke-width="8" stroke-linecap="round" stroke-linejoin="round"></polyline>
    ${stopPoints
      .map(
        (mapPoint, index) => `
          <g>
            <circle cx="${mapPoint.x}" cy="${mapPoint.y}" r="17" fill="${index === 0 ? "#b9903c" : "#ce4a3b"}"></circle>
            <text x="${mapPoint.x}" y="${mapPoint.y + 5}" text-anchor="middle" fill="#fff" font-size="14" font-weight="800">${index + 1}</text>
          </g>
        `,
      )
      .join("")}
  `;
}

function explainRoute(route, area, walking) {
  const uniqueThemes = new Set(route.flatMap((stop) => stop.themes)).size;
  const areaText = area ? `Маршрут держится в зоне «${area.name}»: ${area.mood}.` : "Маршрут собран вокруг выбранных точек.";
  const routeText = walking.source === "osrm" ? "Финальная линия идёт по дорожкам и улицам OSM." : "Пока показана резервная линия между точками.";
  return `${areaText} Алгоритм выбирает близкие переходы, смешивает ${uniqueThemes} типа впечатлений и старается закончить прогулку у метро. ${routeText}`;
}

function setRouteLoading(isLoading) {
  elements.regenerateButton.disabled = isLoading;
  elements.form.querySelector(".primary-button").disabled = isLoading;
  elements.routeStatus.textContent = isLoading ? "Строю пеший маршрут по дорожкам..." : elements.routeStatus.textContent;
}

function copyRoute() {
  const text = currentRoute.map((stop, index) => `${index + 1}. ${stop.name} - ${stop.note}`).join("\n");
  navigator.clipboard.writeText(text).then(() => {
    elements.copyButton.textContent = "Скопировано";
    window.setTimeout(() => {
      elements.copyButton.textContent = "Скопировать";
    }, 1200);
  });
}

function exportRouteJson() {
  const payload = {
    app: "Moscow Walks",
    version: 1,
    generatedAt: new Date().toISOString(),
    route: currentRoute,
    summary: { ...currentSummary, stops: currentRoute.length },
  };
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "moscow-walks-route.json";
  link.click();
  URL.revokeObjectURL(url);
}

function asRouteStop(pointData, fallbackNote) {
  return {
    id: pointData.id,
    name: pointData.name,
    lat: pointData.lat,
    lon: pointData.lon,
    area: pointData.area || "custom",
    themes: pointData.themes || [],
    score: pointData.score || 72,
    note: pointData.note || fallbackNote,
  };
}

function sameCluster(a, b) {
  const clusters = [
    ["center", "boulevards", "patriki", "arbat", "zamoskvorechye"],
    ["gorky", "arbat", "zamoskvorechye", "river-west"],
    ["vdnh"],
  ];
  return clusters.some((cluster) => cluster.includes(a) && cluster.includes(b));
}

function idealLeg(targetKm) {
  if (targetKm <= 3) return 0.55;
  if (targetKm <= 5) return 0.8;
  if (targetKm <= 8) return 1.05;
  return 1.3;
}

function estimateCalories(distanceKm) {
  const averageWeightKg = 75;
  const kcalPerKgPerKm = 0.72;
  return Math.round(distanceKm * averageWeightKg * kcalPerKgPerKm);
}

function themeLabel(theme) {
  const labels = {
    classic: "история",
    architecture: "архитектура",
    green: "зелень",
    water: "вода",
    view: "виды",
  };
  return labels[theme] || theme;
}

function seededNoise(text, seed) {
  let hash = seed * 131;
  for (let index = 0; index < text.length; index += 1) {
    hash = (hash * 31 + text.charCodeAt(index)) % 9973;
  }
  return hash / 9973 - 0.5;
}

function projectPoint(mapPoint) {
  const x = ((mapPoint.lon - svgBounds.minLon) / (svgBounds.maxLon - svgBounds.minLon)) * 880 + 60;
  const y = (1 - (mapPoint.lat - svgBounds.minLat) / (svgBounds.maxLat - svgBounds.minLat)) * 600 + 60;
  return { x: Math.round(x), y: Math.round(y) };
}

function roughRouteDistance(route) {
  return route.reduce((sum, mapPoint, index) => {
    if (index === 0) return 0;
    return sum + distanceKm(route[index - 1], mapPoint);
  }, 0) * 1.18;
}

function distanceKm(a, b) {
  const radius = 6371;
  const dLat = toRad(b.lat - a.lat);
  const dLon = toRad(b.lon - a.lon);
  const lat1 = toRad(a.lat);
  const lat2 = toRad(b.lat);
  const h =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  return radius * 2 * Math.atan2(Math.sqrt(h), Math.sqrt(1 - h));
}

function toRad(value) {
  return (value * Math.PI) / 180;
}

init();

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("./sw.js").catch((error) => {
      console.warn("Service worker не зарегистрирован", error);
    });
  });
}

window.MoscowWalksCore = {
  estimateCalories,
  buildRoute: (options) => buildRoute(options),
  currentRoute: () => currentRoute.slice(),
  routeArea,
  roughRouteDistance,
};
