const API_CONFIG = window.WALK_MOSCOW_CONFIG || {};
const OSRM_FOOT_URLS = API_CONFIG.osrmFootUrls || [
  "https://routing.openstreetmap.de/routed-foot/route/v1/foot/",
];
const NOMINATIM_URL = API_CONFIG.nominatimUrl || "https://nominatim.openstreetmap.org/search";
const ROUTE_STATE_KEY = "moscow-walks-route-state";
const LANGUAGE_KEY = "moscow-walks-language";
const THEME_KEY = "moscow-walks-theme";
const HISTORY_KEY = "moscow-walks-history";
const RATING_KEY = "moscow-walks-ratings";
const REQUEST_TIMEOUT_MS = 15000;
const ROUTE_TOLERANCE = 0.35;
// Moscow and a small surrounding area. Coordinates are [latitude, longitude].
const MAP_BOUNDS = [[55.45, 37.0], [56.05, 38.35]];
const MAP_VIEW = [55.7539, 37.6208];
const MAP_MIN_ZOOM = 10;
const WALK_DURATION_LABELS = {
  "3": { ru: "45 минут · около 3 км", en: "45 minutes · about 3 km" },
  "4": { ru: "1 час · около 4 км", en: "1 hour · about 4 km" },
  "6": { ru: "1,5 часа · около 6 км", en: "1.5 hours · about 6 km" },
  "8": { ru: "2 часа · около 8 км", en: "2 hours · about 8 km" },
  "12": { ru: "3 часа · около 12 км", en: "3 hours · about 12 km" },
};

const analytics = window.analytics && typeof window.analytics.track === "function"
  ? window.analytics
  : { track() {} };

function readStorage(key) {
  try {
    return window.localStorage.getItem(key);
  } catch (error) {
    return null;
  }
}

function writeStorage(key, value) {
  try {
    window.localStorage.setItem(key, value);
  } catch (error) {
    // Private browsing and locked-down WebViews may disable storage.
  }
}

const translations = {
  ru: {
    heroTitle: "Соберите прогулку по Москве под своё настроение",
    heroNote: "Выберите старт, время и формат — получите готовый маршрут через интересные места с картой, длиной и удобным финишем.",
    freeBadge: "Бесплатно",
    noRegistration: "Без регистрации",
    secondsBadge: "Маршрут за несколько секунд",
    articlesLink: "Что посмотреть",
    start: "Откуда начать?",
    useLocation: "Начать от меня",
    locationHint: "Координаты используются только для создания маршрута.",
    stopLocation: "Остановить геолокацию",
    locationOn: "Местоположение обновляется",
    locationDenied: "Не удалось получить местоположение",
    yourLocation: "Ваше местоположение",
    distance: "Сколько есть времени?",
    mood: "Как хочется провести прогулку?",
    themeClassic: "Главные места",
    themeClassicNote: "Известные достопримечательности и атмосферные улицы",
    themeGreen: "Парки и зелень",
    themeGreenNote: "Больше скверов, парков и спокойных участков",
    themeArchitecture: "Архитектура и особняки",
    themeArchitectureNote: "Исторические здания, переулки и интересные фасады",
    themeWater: "Набережные и виды",
    themeWaterNote: "Маршрут ближе к воде и открытым панорамам",
    optionalPoint: "Есть место, которое обязательно нужно включить?",
    anchor: "Что обязательно увидеть",
    addAnotherPlace: "+ Добавить ещё место",
    removePlace: "Убрать место",
    buildRoute: "Собрать прогулку",
    settingsChanged: "Настройки изменены — соберите прогулку, когда будете готовы.",
    time: "Время",
    stops: "Точек",
    caloriesLabel: "Примерно потрачено",
    caloriesSpent: "Вы потратите",
    stopNote: "Интересная точка по пути.",
    route: "Ваша прогулка",
    another: "Другой маршрут",
    navigate: "Навигация",
    share: "Поделиться маршрутом",
    guideEyebrow: "Прогулки без подготовки",
    guideTitle: "Идея для вечера, свидания или выходного",
    guideText: "Выберите старт, длину и настроение. Walk Moscow соберёт прогулку через интересные места Москвы, покажет расстояние и время в пути.",
    howItWorks: "Как строится маршрут",
    howItWorksText: "",
    mapData: "Прогулка начинается здесь",
    routeLoading: "Ищем приятные места для прогулки…",
    building: "Обновляем маршрут…",
    routeBuilt: "",
    routeFallback: "",
    walkUnavailable: "Не удалось проложить непрерывный путь по пешеходным дорожкам. Попробуйте другую точку.",
    routeError: "Не удалось построить маршрут. Проверьте интернет и попробуйте ещё раз.",
    tryAgain: "Маршрут не построен — попробуйте ещё раз.",
    copied: "Ссылка и маршрут скопированы.",
    sent: "Меню отправки открыто.",
    shareFailed: "Не удалось поделиться маршрутом. Скопируйте ссылку вручную.",
    shareTitle: "Прогулка по Москве",
    startNote: "Старт рядом с метро — можно начинать.",
    finishNote: "Финиш рядом с метро — прогулку удобно завершить.",
  legStart: "старт",
    lightTheme: "Переключить светлую тему",
    darkTheme: "Переключить тёмную тему",
    toRoute: "К маршруту",
  },
  en: {
    heroTitle: "Build a Moscow walk for your mood",
    heroNote: "Choose a start, time and style — get a ready walking route through interesting places with a map, distance and an easy finish.",
    freeBadge: "Free",
    noRegistration: "No sign-up",
    secondsBadge: "A walk in seconds",
    articlesLink: "Things to see",
    start: "Where do you want to start?",
    useLocation: "Start from me",
    locationHint: "Coordinates are used only to create this walk.",
    stopLocation: "Stop location",
    locationOn: "Location is updating",
    locationDenied: "Could not get your location",
    yourLocation: "Your location",
    distance: "How much time do you have?",
    mood: "How would you like to spend the walk?",
    themeClassic: "Key sights",
    themeClassicNote: "Famous landmarks and atmospheric streets",
    themeGreen: "Parks and greenery",
    themeGreenNote: "More parks, squares and quieter stretches",
    themeArchitecture: "Architecture and mansions",
    themeArchitectureNote: "Historic buildings, lanes and facades",
    themeWater: "Embankments and views",
    themeWaterNote: "A walk closer to water and open views",
    optionalPoint: "Is there a place you must include?",
    anchor: "Must-see place",
    addAnotherPlace: "+ Add another place",
    removePlace: "Remove place",
    buildRoute: "Build my walk",
    settingsChanged: "Settings changed — build your walk when you are ready.",
    time: "Time",
    stops: "Stops",
    caloriesLabel: "Estimated energy",
    caloriesSpent: "You will spend",
    stopNote: "An interesting stop along the way.",
    route: "Your walk",
    another: "Another route",
    navigate: "Open navigation",
    share: "Share this walk",
    guideEyebrow: "Walks without planning",
    guideTitle: "An easy idea for an evening or weekend",
    guideText: "Choose a start, distance and mood. Walk Moscow creates a route through interesting places, with distance and walking time included.",
    howItWorks: "How it works",
    howItWorksText: "",
    mapData: "Your walk starts here",
    routeLoading: "Finding lovely places for your walk…",
    building: "Updating route…",
    routeBuilt: "",
    routeFallback: "",
    walkUnavailable: "A continuous walking path could not be found. Try another place.",
    routeError: "We couldn’t build the route. Check your connection and try again.",
    tryAgain: "Route failed — please try again.",
    copied: "Link and walk details copied.",
    sent: "Share menu opened.",
    shareFailed: "Couldn’t share the route. Copy the link manually.",
    shareTitle: "A walk through Moscow",
    startNote: "Start near the metro — ready to go.",
    finishNote: "Finish near the metro — easy to wrap up.",
  legStart: "start",
    lightTheme: "Switch to light theme",
    darkTheme: "Switch to dark theme",
    toRoute: "To route",
  },
};

const areaNames = {
  center: "Historic centre",
  boulevards: "Boulevard Ring",
  zamoskvorechye: "Zamoskvorechye",
  gorky: "Gorky Park and waterfronts",
  arbat: "Arbat and Prechistenka",
  patriki: "Patriki and Tverskoy Boulevard",
  vdnh: "VDNH and Ostankino",
  "river-west": "Western riverfront",
  kolomenskoye: "Kolomenskoye",
  tsaritsyno: "Tsaritsyno",
};

const englishPlaceNames = {
  "м. Охотный Ряд": "Okhotny Ryad Metro",
  "м. Кропоткинская": "Kropotkinskaya Metro",
  "м. Парк культуры": "Park Kultury Metro",
  "м. Третьяковская": "Tretyakovskaya Metro",
  "м. Маяковская": "Mayakovskaya Metro",
  "м. ВДНХ": "VDNH Metro",
  "м. Киевская": "Kiyevskaya Metro",
  "м. Смоленская": "Smolenskaya Metro",
  "м. Чистые пруды": "Chistye Prudy Metro",
  "Красная площадь": "Red Square", "Александровский сад": "Alexander Garden",
  "Собор Василия Блаженного": "Saint Basil’s Cathedral", "Манежная площадь": "Manezhnaya Square",
  "Большой театр": "Bolshoi Theatre", "Никольская улица": "Nikolskaya Street", "Ильинка": "Ilyinka Street",
  "Варварка": "Varvarka Street", "Парк Зарядье": "Zaryadye Park", "Лубянская площадь": "Lubyanka Square",
  "Мясницкая улица": "Myasnitskaya Street", "Чистые пруды": "Chistye Prudy", "Покровка": "Pokrovka Street",
  "Сретенский бульвар": "Sretensky Boulevard", "Тверской бульвар": "Tverskoy Boulevard", "Страстной бульвар": "Strastnoy Boulevard",
  "Петровский бульвар": "Petrovsky Boulevard", "Трубная площадь": "Trubnaya Square", "Сад Эрмитаж": "Hermitage Garden",
  "Патриаршие пруды": "Patriarch’s Ponds", "Спиридоновка": "Spiridonovka Street", "Малая Бронная": "Malaya Bronnaya Street",
  "Тишинская площадь": "Tishinskaya Square", "Московский зоопарк": "Moscow Zoo", "Старый Арбат": "Old Arbat",
  "Арбатские переулки": "Arbat side streets", "Остоженка": "Ostozhenka Street", "Пречистенка": "Prechistenka Street",
  "Храм Христа Спасителя": "Cathedral of Christ the Saviour", "Крымский мост": "Krymsky Bridge", "Музеон": "Muzeon Arts Park",
  "Парк Горького": "Gorky Park", "Андреевский мост": "Andreevsky Bridge", "Нескучный сад": "Neskuchny Garden",
  "Смотровая у РАН": "Russian Academy of Sciences viewpoint", "Третьяковская галерея": "Tretyakov Gallery",
  "Лаврушинский переулок": "Lavrushinsky Lane", "Болотная набережная": "Bolotnaya Embankment", "Кадашёвская набережная": "Kadashevskaya Embankment",
  "Пятницкая улица": "Pyatnitskaya Street", "Большая Ордынка": "Bolshaya Ordynka Street", "Новодевичий монастырь": "Novodevichy Convent",
  "Новодевичьи пруды": "Novodevichy Ponds", "Лужники": "Luzhniki", "Воробьёвы горы": "Sparrow Hills", "Главное здание МГУ": "Moscow State University",
  "ВДНХ": "VDNH", "Фонтан Дружба народов": "Friendship of Nations Fountain", "Павильон Космос": "Cosmos Pavilion", "Останкинский парк": "Ostankino Park",
  "Главный ботанический сад": "Main Botanical Garden", "Рабочий и колхозница": "Worker and Kolkhoz Woman", "Коломенское": "Kolomenskoye", "Царицыно": "Tsaritsyno",
  "Новодевичий монастырь": "Novodevichy Convent", "Воробьёвы горы": "Sparrow Hills", "Сокольники": "Sokolniki Park",
  "Нескучный сад": "Neskuchny Garden", "Аптекарский огород": "Aptekarsky Ogorod", "Измайловский парк": "Izmaylovo Park",
  "Усадьба Кусково": "Kuskovo Estate", "Москва-Сити": "Moscow City", "Набережная Тараса Шевченко": "Taras Shevchenko Embankment",
};

let currentLanguage = readStorage(LANGUAGE_KEY) === "en" ? "en" : "ru";
let currentTheme = readStorage(THEME_KEY) === "light" ? "light" : "dark";

function t(key) {
  return translations[currentLanguage][key] || translations.ru[key] || key;
}

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
  { id: "kolomenskoye", name: "Коломенское", center: [55.6712, 37.6697], themes: ["green", "architecture", "view"], mood: "усадьба, сады и виды на реку" },
  { id: "tsaritsyno", name: "Царицыно", center: [55.6197, 37.6827], themes: ["green", "architecture", "water"], mood: "дворцы, пруды и большая прогулка" },
];

const pois = [
  point("red-square", "Красная площадь", 55.7539, 37.6208, "center", ["classic", "architecture"], 99, "Главная площадь Москвы, сильный якорь для коротких и средних прогулок."),
  point("alexander-garden", "Александровский сад", 55.7521, 37.6137, "center", ["classic", "green"], 92, "Зелёный проход у Кремля, удобен как спокойная пауза в центре."),
  point("st-basil", "Собор Василия Блаженного", 55.7525, 37.6231, "center", ["classic", "architecture"], 95, "Главный силуэт Красной площади и одна из самых узнаваемых точек Москвы."),
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
  point("kolomenskoye", "Коломенское", 55.6712, 37.6697, "kolomenskoye", ["green", "architecture", "view"], 94, "Усадьба, сады и большие виды на Москву-реку."),
  point("tsaritsyno", "Царицыно", 55.6197, 37.6827, "tsaritsyno", ["green", "architecture", "water"], 94, "Дворцовый ансамбль, пруды и красивый парк."),
  point("sokolniki", "Сокольники", 55.7958, 37.6758, "boulevards", ["green", "water"], 86, "Большой парк с аллеями и прудами."),
  point("aptekarsky", "Аптекарский огород", 55.7798, 37.6327, "boulevards", ["green", "architecture"], 84, "Ботанический сад и оранжереи в центре города."),
  point("izmaylovo", "Измайловский парк", 55.7946, 37.7994, "vdnh", ["green", "water"], 86, "Просторный лесопарк с длинными дорожками и прудами."),
  point("kuskovo", "Усадьба Кусково", 55.7353, 37.8131, "vdnh", ["green", "architecture", "water"], 88, "Усадьба, дворец и регулярный парк для длинной прогулки."),
  point("moscow-city", "Москва-Сити", 55.7481, 37.5395, "river-west", ["architecture", "water", "view"], 86, "Небоскрёбы и панорама современной Москвы у реки."),
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
  customDistance: document.querySelector("#customDistance"),
  pickOnMapButton: document.querySelector("#pickOnMapButton"),
  anchor: document.querySelector("#anchorSelect"),
  anchorFields: document.querySelector("#anchorFields"),
  addAnchorButton: document.querySelector("#addAnchorButton"),
  anchorSearch: document.querySelector("#anchorSearch"),
  locateButton: document.querySelector("#locateButton"),
  locationStatus: document.querySelector("#locationStatus"),
  buildButton: document.querySelector("#buildButton"),
  settingsStatus: document.querySelector("#settingsStatus"),
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
  copyButton: document.querySelector("#copyButton"),
  navigationButton: document.querySelector("#navigationButton"),
  regenerateButton: document.querySelector("#regenerateButton"),
  placeHints: document.querySelector("#placeHints"),
  toast: document.querySelector("#toast"),
  routeSummary: document.querySelector(".route-summary"),
  itinerary: document.querySelector(".itinerary"),
  languageToggle: document.querySelector("#languageToggle"),
  themeToggle: document.querySelector("#themeToggle"),
  historyList: document.querySelector("#historyList"),
  clearHistoryButton: document.querySelector("#clearHistoryButton"),
  ratingButtons: document.querySelectorAll("#ratingButtons [data-rating]"),
  ratingStatus: document.querySelector("#ratingStatus"),
};

let userPosition = null;
let userLocationMarker = null;
let pickedStart = null;
let pickedStartMarker = null;
let isPickingStart = false;

function point(id, name, lat, lon, area, themes, score, note) {
  return { id, name, lat, lon, area, themes, score, note };
}

function init() {
  if (!elements.form || !elements.start || !elements.distance) return;
  fillSelects();
  fillHints();
  if (elements.locateButton) elements.locateButton.textContent = t("useLocation");
  if (userPosition) userPosition.name = t("yourLocation");
  restoreRouteState();
  applyTheme();
  applyLanguage();
  renderHistory();
  initMap();
  elements.form.addEventListener("change", (event) => {
    if (event.target === elements.distance) syncCustomDistance();
    syncAnchorOptions();
    updateAnchorControls();
    markSettingsChanged();
    const eventName = event.target.name === "distance" ? "duration_selected" : event.target.name === "theme" ? "mood_selected" : "start_selected";
    analytics.track(eventName, { value: event.target.value });
  });
  elements.form.addEventListener("submit", handleSubmit);
  elements.regenerateButton?.addEventListener("click", () => generateAndRender({ alternative: true }));
  elements.copyButton?.addEventListener("click", copyRoute);
  elements.navigationButton?.addEventListener("click", openNavigation);
  elements.locateButton?.addEventListener("click", toggleLocationTracking);
  elements.pickOnMapButton?.addEventListener("click", toggleMapPicking);
  elements.customDistance?.addEventListener("input", markSettingsChanged);
  elements.addAnchorButton?.addEventListener("click", addAnchorField);
  elements.anchorFields?.addEventListener("click", (event) => {
    const removeButton = event.target.closest("[data-remove-anchor]");
    if (!removeButton) return;
    removeButton.closest(".anchor-row")?.remove();
    fillSelects();
    markSettingsChanged();
  });
  elements.languageToggle?.addEventListener("click", toggleLanguage);
  elements.themeToggle?.addEventListener("click", toggleTheme);
  elements.clearHistoryButton?.addEventListener("click", clearHistory);
  elements.ratingButtons?.forEach((button) => button.addEventListener("click", () => rateCurrentRoute(Number(button.dataset.rating))));
  analytics.track("planner_view");
}

function markSettingsChanged() {
  if (elements.settingsStatus) elements.settingsStatus.textContent = t("settingsChanged");
  elements.buildButton?.classList.add("is-ready");
}

function fillSelects() {
  const selectedStart = elements.start.value;
  const selectedAnchors = [...document.querySelectorAll(".anchor-select")].map((select) => select.value);
  elements.start.innerHTML = starts.map((start) => `<option value="${start.id}">${localizedPlaceName(start.name)}</option>`).join("");
  const anchorOptions = [
    `<option value="">${currentLanguage === "en" ? "No extra place" : "Без дополнительного места"}</option>`,
    ...pois
      .slice()
      .sort((a, b) => a.name.localeCompare(b.name, "ru"))
      .map((poi) => `<option value="${poi.id}">${localizedPlaceName(poi.name)}</option>`),
  ].join("");
  document.querySelectorAll(".anchor-select").forEach((select, index) => {
    select.innerHTML = anchorOptions;
    if (selectedAnchors[index]) select.value = selectedAnchors[index];
  });
  if (selectedStart) elements.start.value = selectedStart;
  syncAnchorOptions();
  updateAnchorControls();
}

function targetDistanceKm() {
  if (elements.distance.value !== "custom") return Number(elements.distance.value);
  const value = Number(elements.customDistance?.value);
  return Number.isFinite(value) && value >= 1 && value <= 25 ? value : 4;
}

function syncCustomDistance() {
  if (!elements.customDistance) return;
  const isCustom = elements.distance.value === "custom";
  elements.customDistance.hidden = !isCustom;
  elements.customDistance.disabled = !isCustom;
}

function getSelectedAnchorIds() {
  return [...document.querySelectorAll(".anchor-select")]
    .map((select) => select.value)
    .filter(Boolean)
    .filter((value, index, values) => values.indexOf(value) === index);
}

function syncAnchorOptions() {
  const selects = [...document.querySelectorAll(".anchor-select")];
  const selected = selects.map((select) => select.value).filter(Boolean);
  selects.forEach((select) => {
    [...select.options].forEach((option) => {
      option.disabled = Boolean(option.value && selected.includes(option.value) && option.value !== select.value);
    });
  });
}

function updateAnchorControls() {
  const rows = document.querySelectorAll(".anchor-row");
  const hasSelection = getSelectedAnchorIds().length > 0;
  elements.addAnchorButton.disabled = rows.length >= 4;
  elements.addAnchorButton.hidden = rows.length >= 4 || !hasSelection;
  rows.forEach((row, index) => {
    const label = row.querySelector("span");
    if (index > 0 && label) label.textContent = `${currentLanguage === "en" ? "Place" : "Место"} ${index + 1}`;
  });
}

function addAnchorField() {
  const rows = document.querySelectorAll(".anchor-row");
  if (rows.length >= 4) return;
  const row = document.createElement("label");
  row.className = "field anchor-row anchor-row-extra";
  row.innerHTML = `<span>${currentLanguage === "en" ? "Place" : "Место"} ${rows.length + 1}</span><div class="anchor-input-row"><select class="anchor-select" name="anchor"></select><button class="remove-anchor-button" type="button" data-remove-anchor aria-label="${t("removePlace")}">×</button></div>`;
  elements.anchorFields.append(row);
  fillSelects();
}

function fillHints() {
  if (!elements.placeHints) return;
  elements.placeHints.innerHTML = [...starts, ...pois]
    .map((place) => `<option value="${place.name}"></option>`)
    .join("");
}

function applyLanguage() {
  document.documentElement.lang = currentLanguage;
  document.title = currentLanguage === "en" ? "Walk Moscow — walking routes in Moscow" : "Walk Moscow — пешие маршруты по Москве";
  document.querySelector('meta[name="description"]')?.setAttribute("content", currentLanguage === "en" ? "Build a free walking route in Moscow with landmarks, a map and estimated walking time." : "Бесплатный генератор пеших маршрутов по Москве с картой, достопримечательностями и расчётом времени.");
  document.querySelector('meta[property="og:locale"]')?.setAttribute("content", currentLanguage === "en" ? "en_US" : "ru_RU");
  document.querySelector('meta[property="og:title"]')?.setAttribute("content", currentLanguage === "en" ? "Walk Moscow — walking routes in Moscow" : "Walk Moscow — прогулки по Москве");
  document.querySelector('meta[property="og:description"]')?.setAttribute("content", currentLanguage === "en" ? "Free walking routes in Moscow with landmarks, a map and estimated walking time." : "Бесплатные пешие маршруты по Москве с картой, интересными местами и расчётом времени.");
  document.querySelector('meta[name="twitter:title"]')?.setAttribute("content", document.title);
  document.querySelector('meta[name="twitter:description"]')?.setAttribute("content", currentLanguage === "en" ? "Build a free Moscow walk in seconds." : "Соберите бесплатную прогулку по Москве за несколько секунд.");
  document.querySelectorAll("[data-i18n]").forEach((node) => {
    const key = node.dataset.i18n;
    if (translations[currentLanguage][key]) node.textContent = t(key);
  });
  elements.languageToggle.textContent = currentLanguage === "ru" ? "EN" : "RU";
  elements.languageToggle.setAttribute("aria-label", currentLanguage === "ru" ? "Switch to English" : "Switch to Russian");
  elements.themeToggle.setAttribute("aria-label", currentTheme === "dark" ? t("lightTheme") : t("darkTheme"));
  document.querySelector(".skip-link")?.setAttribute("aria-label", t("toRoute"));
  document.querySelector(".planner")?.setAttribute("aria-label", currentLanguage === "en" ? "Route settings" : "Параметры маршрута");
  document.querySelector(".site-nav")?.setAttribute("aria-label", currentLanguage === "en" ? "Navigation" : "Навигация");
  document.querySelector(".workspace")?.setAttribute("aria-label", currentLanguage === "en" ? "Route result" : "Результат маршрута");
  document.querySelector(".map")?.setAttribute("aria-label", currentLanguage === "en" ? "Interactive walking route map" : "Интерактивная карта пешего маршрута");
  document.querySelector(".itinerary")?.setAttribute("aria-label", currentLanguage === "en" ? "Route" : "Маршрут");
  document.querySelector(".guide")?.setAttribute("aria-label", currentLanguage === "en" ? "About the service" : "О сервисе");
  fillSelects();
  [...elements.distance.options].forEach((option) => {
    option.textContent = WALK_DURATION_LABELS[option.value]?.[currentLanguage] || option.value;
  });
  syncCustomDistance();
  if (currentRoute.length) {
    elements.routeTitle.textContent = buildRouteTitle(currentRoute);
    elements.routeArea.textContent = localizedArea(routeArea(currentRoute));
    renderStops(currentRoute);
    elements.routeReason.textContent = explainRoute(currentRoute, routeArea(currentRoute), { source: currentWalkingLine.length ? "osrm" : "fallback" });
  }
}

function toggleLanguage() {
  currentLanguage = currentLanguage === "ru" ? "en" : "ru";
  writeStorage(LANGUAGE_KEY, currentLanguage);
  applyLanguage();
  if (currentRoute.length) window.history.replaceState({}, "", buildShareUrl());
}

function applyTheme() {
  document.documentElement.dataset.theme = currentTheme;
  elements.themeToggle.textContent = currentTheme === "dark" ? "☼" : "☾";
  document.querySelector('meta[name="theme-color"]')?.setAttribute("content", currentTheme === "dark" ? "#0f1115" : "#f5f7f8");
}

function toggleTheme() {
  currentTheme = currentTheme === "dark" ? "light" : "dark";
  writeStorage(THEME_KEY, currentTheme);
  applyTheme();
  if (currentRoute.length) window.history.replaceState({}, "", buildShareUrl());
}

function initMap() {
  if (!window.L) {
    return;
  }

  map = L.map("map", {
    zoomControl: false,
    scrollWheelZoom: true,
    maxBounds: MAP_BOUNDS,
    maxBoundsViscosity: 1,
    minZoom: MAP_MIN_ZOOM,
    maxZoom: 19,
  }).setView(MAP_VIEW, 12);

  L.control.zoom({ position: "bottomright" }).addTo(map);
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
  }).addTo(map);

  markersLayer = L.layerGroup().addTo(map);
  routeLayer = L.layerGroup().addTo(map);
  map.on("click", (event) => {
    if (isPickingStart) setPickedStart(event.latlng);
  });
  elements.fallbackMap.classList.add("hidden");
}

function toggleMapPicking() {
  if (!map || !window.L) {
    elements.locationStatus.textContent = currentLanguage === "en" ? "The map is still loading. Try again in a moment." : "Карта ещё загружается. Попробуйте через секунду.";
    return;
  }
  isPickingStart = !isPickingStart;
  elements.pickOnMapButton?.setAttribute("aria-pressed", String(isPickingStart));
  elements.pickOnMapButton?.classList.toggle("is-active", isPickingStart);
  elements.pickOnMapButton.textContent = isPickingStart
    ? (currentLanguage === "en" ? "Tap a point on the map" : "Нажмите на точку на карте")
    : (currentLanguage === "en" ? "Pick a point on the map" : "Выбрать точку на карте");
  elements.locationStatus.textContent = isPickingStart ? (currentLanguage === "en" ? "Tap the map to set your start." : "Нажмите на карту, чтобы задать старт.") : "";
}

function setPickedStart(latlng) {
  pickedStart = point("map-start", currentLanguage === "en" ? "Selected point" : "Выбранная точка", latlng.lat, latlng.lng, "custom", ["classic"], 100, "");
  if (!pickedStartMarker) pickedStartMarker = L.circleMarker([latlng.lat, latlng.lng], { radius: 8, color: "#fff", weight: 3, fillColor: "#ce4a3b", fillOpacity: 1 }).addTo(map);
  else pickedStartMarker.setLatLng([latlng.lat, latlng.lng]);
  isPickingStart = false;
  elements.pickOnMapButton?.setAttribute("aria-pressed", "false");
  elements.pickOnMapButton?.classList.remove("is-active");
  elements.pickOnMapButton.textContent = currentLanguage === "en" ? "Pick a point on the map" : "Выбрать точку на карте";
  elements.locationStatus.textContent = currentLanguage === "en" ? "Start set from the map." : "Старт задан точкой на карте.";
  markSettingsChanged();
}

function toggleLocationTracking() {
  if (!navigator.geolocation) {
    elements.locationStatus.textContent = t("locationDenied");
    analytics.track("location_error", { reason: "unsupported" });
    return;
  }

  elements.locateButton.disabled = true;
  analytics.track("location_requested");
  navigator.geolocation.getCurrentPosition(
    (position) => {
      elements.locateButton.disabled = false;
      if (!updateUserPosition(position)) return;
      elements.locationStatus.textContent = currentLanguage === "en" ? "Start set to your location." : "Старт установлен по вашему местоположению.";
      analytics.track("location_success");
      markSettingsChanged();
    },
    () => {
      elements.locateButton.disabled = false;
      elements.locationStatus.textContent = t("locationDenied");
      analytics.track("location_error", { reason: "denied_or_unavailable" });
    },
    { enableHighAccuracy: true, maximumAge: 10000, timeout: 12000 },
  );
}

function updateUserPosition(position) {
  const latitude = position.coords.latitude;
  const longitude = position.coords.longitude;
  const [[minLatitude, minLongitude], [maxLatitude, maxLongitude]] = MAP_BOUNDS;
  if (latitude < minLatitude || latitude > maxLatitude || longitude < minLongitude || longitude > maxLongitude) {
    elements.locationStatus.textContent = currentLanguage === "en"
      ? "Your location is outside Moscow and the selected area."
      : "Вы находитесь за пределами Москвы и выбранной области.";
    analytics.track("location_error", { reason: "outside_map_bounds" });
    return false;
  }

  userPosition = { id: "user-location", name: t("yourLocation"), lat: latitude, lon: longitude, area: "custom", themes: ["classic", "view"], score: 100, note: "" };
  if (map && window.L) {
    if (!userLocationMarker) {
      userLocationMarker = L.circleMarker([userPosition.lat, userPosition.lon], { radius: 8, color: "#fff", weight: 3, fillColor: "#3b82f6", fillOpacity: 1 }).addTo(map);
    } else {
      userLocationMarker.setLatLng([userPosition.lat, userPosition.lon]);
    }
    map.setView([userPosition.lat, userPosition.lon], Math.max(map.getZoom(), 13), { animate: true });
  }
  elements.locationStatus.textContent = t("locationOn");
  return true;
}

function handleLocationError() {
  elements.locationStatus.textContent = t("locationDenied");
}

function handleSubmit(event) {
  event.preventDefault();
  generateAndRender();
}

async function generateAndRender({ alternative = false } = {}) {
  const run = ++latestRun;
  variantSeed += 1;
  setRouteLoading(true);
  analytics.track(alternative ? "route_alternative_requested" : "route_build_started");

  try {
    const selectedStart = pickedStart || userPosition || starts.find((item) => item.id === elements.start.value) || starts[0];
    const selectedAnchors = getSelectedAnchorIds().map((id) => pois.find((item) => item.id === id)).filter(Boolean);
    const selectedAnchor = selectedAnchors[0];
    const targetKm = targetDistanceKm();
    const theme = new FormData(elements.form).get("theme");
    const start = (await resolveSearchPoint(elements.startSearch?.value, "Старт из поиска", "search")) || selectedStart;
    const anchor = (await resolveSearchPoint(elements.anchorSearch?.value, "Место из поиска", "search")) || selectedAnchor;

    if (run !== latestRun) return;
    let candidate = buildRoute({ start, targetKm, anchor, anchors: anchor ? selectedAnchors : [], theme, variantSeed });
    let walking = await buildWalkingRoute(candidate);
    for (let attempt = 1; attempt < 3 && walking && !isRouteDistanceAcceptable(walking.distanceKm, targetKm); attempt += 1) {
      const alternativeRoute = buildRoute({ start, targetKm, anchor, anchors: anchor ? selectedAnchors : [], theme, variantSeed: variantSeed + attempt * 17 });
      const alternativeWalking = await buildWalkingRoute(alternativeRoute);
      if (alternativeWalking && Math.abs(alternativeWalking.distanceKm - targetKm) < Math.abs(walking.distanceKm - targetKm)) {
        candidate = alternativeRoute;
        walking = alternativeWalking;
      }
    }
    currentRoute = candidate;

    if (run !== latestRun) return;
    if (!walking) {
      currentWalkingLine = [];
      renderUnroutableRoute(currentRoute);
      return;
    }
    currentWalkingLine = walking.coordinates;
    renderRoute(currentRoute, walking);
    if (elements.settingsStatus) elements.settingsStatus.textContent = "";
    elements.buildButton?.classList.remove("is-ready");
    analytics.track("route_build_success", { stops: currentRoute.length, distance_km: Number(walking.distanceKm.toFixed(1)) });
    scrollToResult();
  } catch (error) {
    console.warn("Не удалось построить маршрут", error);
    elements.routeStatus.textContent = t("routeError");
    showToast(t("tryAgain"));
    analytics.track("route_build_error", { message: error instanceof Error ? error.message : "unknown" });
  } finally {
    if (run === latestRun) setRouteLoading(false);
  }
}

function scrollToResult() {
  const reduceMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
  elements.itinerary?.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" });
}

async function resolveSearchPoint(query, note, area) {
  const text = (query || "").trim();
  if (text.length < 3) return null;

  const local = [...starts, ...pois].find((place) => place.name.toLowerCase() === text.toLowerCase());
  if (local) return point(local.id, local.name, local.lat, local.lon, local.area, local.themes || [], local.score || 76, local.note || note);

  try {
    const params = new URLSearchParams({
      q: `${text}, Москва`,
      format: "jsonv2",
      limit: "1",
      viewbox: "37.0,56.05,38.35,55.45",
      bounded: "1",
      addressdetails: "0",
    });
    const response = await fetchWithTimeout(`${NOMINATIM_URL}?${params.toString()}`, {
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

function buildRoute({ start, targetKm, anchor, anchors = [], theme, variantSeed }) {
  const area = chooseArea(start, anchor, theme);
  const requiredPlaces = anchors.length ? anchors : anchor ? [anchor] : [];
  const candidatePool = rankCandidates({ start, anchor, anchors: requiredPlaces, theme, area, targetKm, variantSeed });
  const desiredStops = targetKm <= 3 ? 4 : targetKm <= 5 ? 6 : targetKm <= 8 ? 8 : 10;
  const route = [asRouteStop(start, "Старт: удобно начать рядом с метро или выбранной точкой.")];

  if (requiredPlaces.length) {
    requiredPlaces.forEach((place) => {
      if (!route.some((stop) => stop.id === place.id)) route.push(asRouteStop(place, place.note || "Интересное место, которое вы выбрали для прогулки."));
    });
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

function rankCandidates({ start, anchor, anchors = [], theme, area, targetKm, variantSeed }) {
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
    .filter((poi) => !anchors.some((required) => required.id === poi.id))
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

async function requestWalkingRoute(stops) {
  const coords = stops.map((stop) => `${stop.lon},${stop.lat}`).join(";");
  const params = new URLSearchParams({
    overview: "full",
    geometries: "geojson",
    steps: "false",
    continue_straight: "false",
  });

  for (const baseUrl of OSRM_FOOT_URLS) {
    try {
      const response = await fetchWithTimeout(`${baseUrl}${coords}?${params.toString()}`);
      if (!response.ok) continue;
      const data = await response.json();
      const walkingRoute = data.routes?.[0];
      if (data.code && data.code !== "Ok") continue;
      if (!walkingRoute?.geometry?.coordinates?.length) continue;
      return {
        distanceKm: walkingRoute.distance / 1000,
        durationMin: Math.max(1, Math.round(walkingRoute.duration / 60)),
        coordinates: walkingRoute.geometry.coordinates.map(([lon, lat]) => [lat, lon]),
      };
    } catch (error) {
      console.warn("Пешеходный сервис временно недоступен", error);
    }
  }
  return null;
}

async function buildWalkingRoute(route) {
  if (route.length < 2) return null;

  const fullRoute = await requestWalkingRoute(route);
  if (fullRoute) return { source: "pedestrian", ...fullRoute };

  // A multi-stop request can fail even when every individual leg is routable.
  // Retry leg by leg, but never draw a straight line between places.
  const legs = [];
  for (let index = 1; index < route.length; index += 1) {
    const leg = await requestWalkingRoute([route[index - 1], route[index]]);
    if (!leg) return null;
    legs.push(leg);
  }

  const coordinates = legs.flatMap((leg, index) => index === 0 ? leg.coordinates : leg.coordinates.slice(1));
  return {
    source: "pedestrian",
    distanceKm: legs.reduce((sum, leg) => sum + leg.distanceKm, 0),
    durationMin: legs.reduce((sum, leg) => sum + leg.durationMin, 0),
    coordinates,
  };
}

function renderRoute(route, walking) {
  if (!route.length) return;
  const area = routeArea(route);
  elements.totalDistance.textContent = formatDistance(walking.distanceKm);
  elements.totalTime.textContent = formatDuration(walking.durationMin);
  elements.stopCount.textContent = String(route.length);
  elements.caloriesCount.textContent = formatCalories(estimateCalories(walking.distanceKm));
  currentSummary = {
    distanceKm: walking.distanceKm,
    durationMin: walking.durationMin,
    calories: estimateCalories(walking.distanceKm),
  };
  elements.routeTitle.textContent = buildRouteTitle(route);
  elements.routeArea.textContent = localizedArea(area);
  elements.routeReason.textContent = explainRoute(route, area, walking);
  elements.routeStatus.textContent = "";
  persistRouteState();
  saveHistoryEntry(route, walking);
  renderStops(route);
  renderFallbackMap(walking.coordinates, route);
  renderLeafletRoute(route, walking.coordinates);
  elements.itinerary.classList.remove("updated");
  void elements.itinerary.offsetWidth;
  elements.itinerary.classList.add("updated");
}

function readHistory() {
  try {
    const value = JSON.parse(readStorage(HISTORY_KEY) || "[]");
    return Array.isArray(value) ? value.slice(0, 8) : [];
  } catch (error) { return []; }
}

function saveHistoryEntry(route, walking) {
  const entry = { id: `${Date.now()}-${route[0]?.id || "walk"}`, title: buildRouteTitle(route), distanceKm: Number(walking.distanceKm.toFixed(1)), durationMin: walking.durationMin, start: elements.start.value, customDistance: elements.customDistance?.value || "", distance: elements.distance.value, theme: new FormData(elements.form).get("theme") || "classic", anchor: getSelectedAnchorIds()[0] || "", createdAt: new Date().toISOString() };
  const history = [entry, ...readHistory().filter((item) => item.title !== entry.title)].slice(0, 8);
  writeStorage(HISTORY_KEY, JSON.stringify(history));
  renderHistory();
}

function renderHistory() {
  if (!elements.historyList) return;
  const history = readHistory();
  if (!history.length) { elements.historyList.innerHTML = `<p class="field-hint">${currentLanguage === "en" ? "Built walks will appear here." : "Построенные маршруты появятся здесь."}</p>`; return; }
  elements.historyList.innerHTML = history.map((item) => `<button class="history-item" type="button" data-history-id="${escapeHtml(item.id)}"><span>${escapeHtml(item.title)}</span><small>${formatDistance(item.distanceKm)} · ${formatDuration(item.durationMin)}</small></button>`).join("");
  elements.historyList.querySelectorAll("[data-history-id]").forEach((button) => button.addEventListener("click", () => loadHistoryEntry(history.find((item) => item.id === button.dataset.historyId))));
}

function loadHistoryEntry(entry) {
  if (!entry) return;
  if (starts.some((item) => item.id === entry.start)) elements.start.value = entry.start;
  elements.distance.value = entry.distance || "4";
  if (elements.customDistance) elements.customDistance.value = entry.customDistance || "";
  const theme = [...elements.form.querySelectorAll('input[name="theme"]')].find((input) => input.value === entry.theme);
  if (theme) theme.checked = true;
  if (elements.anchor) elements.anchor.value = entry.anchor || "";
  syncCustomDistance();
  generateAndRender();
}

function clearHistory() { writeStorage(HISTORY_KEY, "[]"); renderHistory(); }

function rateCurrentRoute(rating) {
  if (!currentRoute.length || rating < 1 || rating > 5) return;
  const ratings = (() => { try { return JSON.parse(readStorage(RATING_KEY) || "{}"); } catch (error) { return {}; } })();
  const key = currentRoute.map((stop) => stop.id).join(",");
  ratings[key] = { rating, createdAt: new Date().toISOString() };
  writeStorage(RATING_KEY, JSON.stringify(ratings));
  elements.ratingButtons?.forEach((button) => button.classList.toggle("is-selected", Number(button.dataset.rating) <= rating));
  if (elements.ratingStatus) elements.ratingStatus.textContent = currentLanguage === "en" ? "Thanks — your rating is saved on this device." : "Спасибо — оценка сохранена на этом устройстве.";
  analytics.track("route_rated", { rating });
}

function renderUnroutableRoute(route) {
  const area = routeArea(route);
  elements.totalDistance.textContent = "—";
  elements.totalTime.textContent = "—";
  elements.stopCount.textContent = String(route.length);
  elements.caloriesCount.textContent = "—";
  currentSummary = { distanceKm: 0, durationMin: 0, calories: 0 };
  elements.routeTitle.textContent = buildRouteTitle(route);
  elements.routeArea.textContent = localizedArea(area);
  elements.routeReason.textContent = currentLanguage === "en" ? "The selected places are shown below. Try another start to get a continuous walking line." : "Выбранные места показаны ниже. Попробуйте другой старт, чтобы получить непрерывную линию для пешей прогулки.";
  elements.routeStatus.textContent = t("walkUnavailable");
  renderStops(route);
  renderLeafletStopsOnly(route);
  renderFallbackStops(route);
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
      .bindPopup(`<strong>${index + 1}. ${articleLinkForStop(stop, true)}</strong><br>${escapeHtml(localizedNote(stop, index))}`)
      .addTo(markersLayer);
  });

  map.fitBounds(polyline.getBounds(), { padding: [36, 36], maxZoom: 16 });
}

function renderLeafletStopsOnly(route) {
  if (!map || !window.L) return;
  markersLayer.clearLayers();
  routeLayer.clearLayers();
  route.forEach((stop, index) => {
    L.marker([stop.lat, stop.lon], { icon: createMarkerIcon(index + 1, index === 0) })
      .bindPopup(`<strong>${index + 1}. ${articleLinkForStop(stop, true)}</strong><br>${escapeHtml(localizedNote(stop, index))}`)
      .addTo(markersLayer);
  });
  map.fitBounds(L.latLngBounds(route.map((stop) => [stop.lat, stop.lon])), { padding: [36, 36], maxZoom: 15 });
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
  if (primary) return `${localizedArea(primary)}: ${localizedPlaceName(route[0].name)} → ${localizedPlaceName(route[route.length - 1].name)}`;
  return `${localizedPlaceName(route[0].name)} → ${localizedPlaceName(route[route.length - 1].name)}`;
}

function localizedArea(area) {
  if (!area) return currentLanguage === "en" ? "City walk" : "Городская прогулка";
  return currentLanguage === "en" ? areaNames[area.id] || area.name : area.name;
}

function localizedPlaceName(name) {
  if (currentLanguage === "en") return englishPlaceNames[name] || String(name).replace(/^м\.\s*/, "Metro ");
  return name;
}

function localizedNote(stop, index) {
  if (currentLanguage === "ru") return stop.note || t("stopNote");
  if (index === 0) return t("startNote");
  if (/метро|Metro/i.test(stop.name) || index === currentRoute.length - 1) return t("finishNote");
  const theme = stop.themes?.[0];
  const notes = {
    classic: "A memorable city stop with a strong sense of place.",
    architecture: "A distinctive architectural stop along the walk.",
    green: "A calmer green pause in the city.",
    water: "A scenic waterfront pause with room to slow down.",
    view: "A viewpoint worth adding to the route.",
  };
  return notes[theme] || "A carefully chosen stop for this walk.";
}

const articleSlugByPoint = {
  "alexander-garden": "red-square",
  "st-basil": "st-basil",
  nikolskaya: "gum",
  zaryadye: "zaryadye",
  tretyakov: "tretyakov",
  cathedral: "christ-cathedral",
  patriarshiye: "patriarshiye",
  arbat: "arbat",
  gorky: "gorky",
  vdnh: "vdnh",
  kolomenskoye: "kolomenskoye",
  tsaritsyno: "tsaritsyno",
  novodevichy: "novodevichy",
  sparrow: "sparrow-hills",
  sokolniki: "sokolniki",
  neskuchny: "neskuchny",
  aptekarsky: "aptekarsky-ogorod",
  izmaylovo: "izmaylovo",
  kuskovo: "kuskovo",
  "moscow-city": "moscow-city",
};

function articleLinkForStop(stop, compact = false) {
  const label = escapeHtml(localizedPlaceName(stop.name));
  const slug = articleSlugByPoint[stop.id];
  if (!slug) return label;
  const className = compact ? "map-popup-link" : "stop-link";
  return `<a class="${className}" href="./articles.html#article-${slug}">${label}</a>`;
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
      const leg = index === 0 ? t("legStart") : formatDistance(distanceKm(route[index - 1], stop));
      const tags = stop.themes.slice(0, 2).map(themeLabel).join(" · ");
      return `
        <li class="stop entering" style="--stop-index:${index}">
          <span class="stop-number">${index + 1}</span>
          <div>
            <h3>${articleLinkForStop(stop)}</h3>
            <p>${escapeHtml(localizedNote(stop, index))}</p>
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

function renderFallbackStops(route) {
  if (!elements.fallbackMap || (map && window.L)) return;
  const stopPoints = route.map((stop) => projectPoint(stop));
  elements.fallbackMap.classList.remove("hidden");
  elements.fallbackMap.innerHTML = `
    <rect width="1000" height="720" fill="#f3f5f0"></rect>
    ${stopPoints.map((point, index) => `<circle cx="${point.x}" cy="${point.y}" r="17" fill="${index === 0 ? "#b9903c" : "#ce4a3b"}"></circle><text x="${point.x}" y="${point.y + 5}" text-anchor="middle" fill="#fff" font-size="14" font-weight="800">${index + 1}</text>`).join("")}
  `;
}

function explainRoute(route, area, walking) {
  if (currentLanguage === "en") {
    const areaText = area ? `${localizedArea(area)} · ` : "";
    return `${areaText}A relaxed route with ${route.length} places, made for an easy walk and a good finish near the metro.`;
  }
  const areaText = area ? `${area.name} · ` : "";
  return `${areaText}Спокойный маршрут через ${route.length} интересных мест — с удобным завершением рядом с метро.`;
}

function setRouteLoading(isLoading) {
  const primaryButton = elements.buildButton;
  elements.regenerateButton.disabled = isLoading;
  if (primaryButton) {
    primaryButton.disabled = isLoading;
    primaryButton.classList.toggle("is-loading", isLoading);
    primaryButton.setAttribute("aria-busy", String(isLoading));
    primaryButton.textContent = isLoading ? t("building") : t("buildRoute");
  }
  elements.form.setAttribute("aria-busy", String(isLoading));
  elements.routeSummary.classList.toggle("is-updating", isLoading);
  elements.routeStatus.textContent = isLoading ? t("routeLoading") : elements.routeStatus.textContent;
}

async function copyRoute() {
  const text = buildShareText();
  const url = buildShareUrl();
  try {
    await copyText(`${text}\n\n${currentLanguage === "en" ? "Route link" : "Ссылка на маршрут"}: ${url}`);
    elements.copyButton.textContent = currentLanguage === "en" ? "Copied" : "Скопировано";
    showToast(t("copied"));
  } catch (error) {
    elements.routeStatus.textContent = t("shareFailed");
    showToast(t("shareFailed"));
    return;
  }

  if (navigator.share && window.matchMedia?.("(pointer: coarse)").matches) {
    try {
      await navigator.share({ title: elements.routeTitle.textContent || t("shareTitle"), text, url });
      elements.copyButton.textContent = currentLanguage === "en" ? "Shared" : "Отправлено";
      showToast(t("sent"));
    } catch (error) {
      if (error?.name !== "AbortError") showToast(t("copied"));
    }
  }
  window.setTimeout(() => {
    elements.copyButton.textContent = t("share");
  }, 1400);
}

function copyText(text) {
  if (navigator.clipboard?.writeText) return navigator.clipboard.writeText(text);

  return new Promise((resolve, reject) => {
    const textarea = document.createElement("textarea");
    textarea.value = text;
    textarea.setAttribute("readonly", "");
    textarea.style.position = "fixed";
    textarea.style.opacity = "0";
    document.body.appendChild(textarea);
    textarea.select();
    try {
      document.execCommand("copy") ? resolve() : reject(new Error("Copy failed"));
    } finally {
      textarea.remove();
    }
  });
}

function openNavigation() {
  if (!currentRoute.length) return;
  const routeText = currentRoute.map((stop) => `${stop.lat},${stop.lon}`).join("~");
  window.open(`https://yandex.ru/maps/?rtext=${routeText}&rtt=pedestrian`, "_blank", "noopener");
}

function buildShareText() {
  const title = elements.routeTitle.textContent || t("shareTitle");
  const stops = currentRoute.map((stop, index) => `${index + 1}. ${localizedPlaceName(stop.name)}`).join("\n");
  return `${title}\n${formatDistance(currentSummary.distanceKm)} · ${formatDuration(currentSummary.durationMin)}\n\n${stops}\n\nWalk Moscow`;
}

function formatDistance(distance) {
  return `${distance.toFixed(1)} ${currentLanguage === "ru" ? "км" : "km"}`;
}

function formatDuration(minutes) {
  if (currentLanguage === "en") return `${minutes} min`;
  return `${minutes} мин`;
}

function formatCalories(calories) {
  return `${calories} ${currentLanguage === "ru" ? "ккал" : "kcal"}`;
}

function isRouteDistanceAcceptable(actualKm, targetKm) {
  return Number.isFinite(actualKm) && Number.isFinite(targetKm) && targetKm > 0 && Math.abs(actualKm - targetKm) / targetKm <= ROUTE_TOLERANCE;
}

function buildShareUrl() {
  const params = new URLSearchParams({
    start: elements.start.value,
    distance: elements.distance.value,
    theme: new FormData(elements.form).get("theme") || "classic",
    lang: currentLanguage,
    mode: currentTheme,
  });
  if (elements.customDistance?.value) params.set("customDistance", elements.customDistance.value);
  if (elements.anchor?.value) params.set("anchor", elements.anchor.value);
  const selectedAnchors = getSelectedAnchorIds();
  if (selectedAnchors.length) params.set("anchors", selectedAnchors.join(","));
  if (elements.startSearch?.value.trim()) params.set("startSearch", elements.startSearch.value.trim());
  if (elements.anchorSearch?.value.trim()) params.set("anchorSearch", elements.anchorSearch.value.trim());
  return `${window.location.origin}${window.location.pathname}?${params.toString()}`;
}

function persistRouteState() {
  const state = {
    start: elements.start.value,
    distance: elements.distance.value,
    customDistance: elements.customDistance?.value || "",
    theme: new FormData(elements.form).get("theme") || "classic",
    anchor: elements.anchor?.value || "",
    anchors: getSelectedAnchorIds(),
    startSearch: elements.startSearch?.value || "",
    anchorSearch: elements.anchorSearch?.value || "",
    lang: currentLanguage,
    mode: currentTheme,
  };
  try {
    writeStorage(ROUTE_STATE_KEY, JSON.stringify(state));
    window.history.replaceState({}, "", buildShareUrl());
  } catch (error) {
    console.warn("Не удалось сохранить параметры маршрута", error);
  }
}

function restoreRouteState() {
  let state = {};
  try {
    const params = new URLSearchParams(window.location.search);
    const saved = JSON.parse(readStorage(ROUTE_STATE_KEY) || "{}");
    state = Object.fromEntries(params.entries());
    if (!Object.keys(state).length) state = saved;
  } catch (error) {
    console.warn("Не удалось восстановить параметры маршрута", error);
  }

  if (starts.some((item) => item.id === state.start)) elements.start.value = state.start;
  if (["3", "4", "6", "8", "12", "custom"].includes(state.distance)) elements.distance.value = state.distance;
  if (elements.customDistance && state.customDistance) elements.customDistance.value = state.customDistance;
  syncCustomDistance();
  const savedAnchors = String(state.anchors || state.anchor || "").split(",").filter((id) => pois.some((item) => item.id === id));
  while (document.querySelectorAll(".anchor-select").length < savedAnchors.length) addAnchorField();
  document.querySelectorAll(".anchor-select").forEach((select, index) => { select.value = savedAnchors[index] || ""; });
  syncAnchorOptions();
  if (elements.startSearch && state.startSearch) elements.startSearch.value = state.startSearch;
  if (elements.anchorSearch && state.anchorSearch) elements.anchorSearch.value = state.anchorSearch;
  const theme = [...elements.form.querySelectorAll('input[name="theme"]')].find((input) => input.value === (state.theme || "classic"));
  if (theme) theme.checked = true;
  if (state.lang === "en" || state.lang === "ru") currentLanguage = state.lang;
  if (state.mode === "light" || state.mode === "dark") currentTheme = state.mode;
}

function showToast(message) {
  if (!elements.toast) return;
  elements.toast.textContent = message;
  elements.toast.classList.add("visible");
  window.clearTimeout(showToast.timer);
  showToast.timer = window.setTimeout(() => elements.toast.classList.remove("visible"), 2600);
}

async function fetchWithTimeout(url, options = {}) {
  const controller = new AbortController();
  const timeout = window.setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
  try {
    return await fetch(url, { ...options, signal: controller.signal });
  } finally {
    window.clearTimeout(timeout);
  }
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
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
    classic: currentLanguage === "en" ? "history" : "история",
    architecture: currentLanguage === "en" ? "architecture" : "архитектура",
    green: currentLanguage === "en" ? "greenery" : "зелень",
    water: currentLanguage === "en" ? "water" : "вода",
    view: currentLanguage === "en" ? "views" : "виды",
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
    navigator.serviceWorker.register("./sw.js?v=2026-07-11-7").catch((error) => {
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
  targetDistanceKm,
  isRouteDistanceAcceptable,
  validateCatalogueData,
};

function validateCatalogueData(catalogue = { starts, pois, routespace }) {
  const errors = [];
  const ids = new Set();
  [...catalogue.starts, ...catalogue.pois].forEach((place) => {
    if (!place.id || ids.has(place.id)) errors.push(`Duplicate or missing place id: ${place.id || "(empty)"}`);
    ids.add(place.id);
    if (!place.name || !Number.isFinite(place.lat) || !Number.isFinite(place.lon) || place.lat < 55.45 || place.lat > 56.05 || place.lon < 37 || place.lon > 38.35) errors.push(`Invalid place: ${place.id}`);
  });
  return errors;
}
