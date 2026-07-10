const ARTICLE_LANGUAGE_KEY = "moscow-walks-language";
const ARTICLE_THEME_KEY = "moscow-walks-theme";

const articleTranslations = {
  ru: {
    back: "← К маршрутам",
    eyebrow: "Гид по Москве",
    title: "Что посмотреть в Москве",
    lead: "Выберите место по настроению — и добавьте его в маршрут прогулки.",
    statPlaces: "12 мест",
    statLinks: "Официальные ссылки",
    statRoutes: "Маршрут в один клик",
    searchLabel: "Поиск по местам",
    searchPlaceholder: "Найти место…",
    all: "Все места",
    centre: "Центр",
    parks: "Парки и вода",
    museums: "Музеи и история",
    noteEyebrow: "Перед визитом",
    note: "Цены и режим работы могут меняться. Перед поездкой откройте официальный сайт места — карточка ведёт прямо к первоисточнику.",
    footer: "Идеи для прогулок по Москве",
    openOfficial: "Официальный сайт",
    openMap: "На карте",
    buildRoute: "Построить маршрут",
    priceLabel: "Вход",
    free: "Бесплатно",
    priceCheck: "Проверить цену",
    addressLabel: "Адрес",
    lightTheme: "Переключить светлую тему",
    darkTheme: "Переключить тёмную тему",
    language: "Переключить на английский",
  },
  en: {
    back: "← Build a route",
    eyebrow: "Moscow guide",
    title: "Things to see in Moscow",
    lead: "Choose a place by mood — then add it to your walking route.",
    statPlaces: "12 places",
    statLinks: "Official links",
    statRoutes: "One-tap routes",
    searchLabel: "Search places",
    searchPlaceholder: "Find a place…",
    all: "All places",
    centre: "City centre",
    parks: "Parks & waterfronts",
    museums: "Museums & history",
    noteEyebrow: "Before you go",
    note: "Prices and opening hours can change. Check the official website before your visit — every card links directly to a primary source.",
    footer: "Ideas for walking around Moscow",
    openOfficial: "Official website",
    openMap: "Open map",
    buildRoute: "Build a route",
    priceLabel: "Entry",
    free: "Free",
    priceCheck: "Check price",
    addressLabel: "Address",
    lightTheme: "Switch to light theme",
    darkTheme: "Switch to dark theme",
    language: "Переключить на русский",
  },
};

const articles = [
  { category: "centre", title: "Красная площадь и Кремль", en: "Red Square and the Kremlin", text: "Начните с главного символа Москвы: площади, кремлёвских стен и панорамы исторического центра. Лучше приходить утром или ближе к вечеру, когда прогулка продолжается по Никольской.", enText: "Start with Moscow’s defining ensemble: the square, Kremlin walls and historic centre. Come in the morning or later in the day and continue along Nikolskaya Street.", tags: "История · центр", enTags: "History · centre", url: "https://www.kremlin.ru/", filter: "centre" },
  { category: "centre", title: "Собор Василия Блаженного", en: "Saint Basil’s Cathedral", text: "Яркий силуэт собора делает Красную площадь узнаваемой. Даже если вы не заходите внутрь, остановитесь у Москворецкого моста ради одной из лучших панорам.", enText: "The cathedral’s colourful silhouette makes Red Square instantly recognisable. Even without going inside, walk to Bolshoy Moskvoretsky Bridge for a memorable panorama.", tags: "Архитектура · центр", enTags: "Architecture · centre", url: "https://cathedral.ru/", filter: "centre" },
  { category: "centre", title: "ГУМ и Никольская улица", en: "GUM and Nikolskaya Street", text: "Парадная городская прогулка с историческими фасадами, аркадами ГУМа и удобным выходом к Лубянской площади. Хороший вариант для короткого маршрута в любую погоду.", enText: "A polished city walk through historic façades, GUM’s glass arcade and Lubyanka Square. A reliable short route in any weather.", tags: "Архитектура · прогулка", enTags: "Architecture · walk", url: "https://gum.ru/", filter: "centre" },
  { category: "parks", title: "Парк Зарядье", en: "Zaryadye Park", text: "Современный парк у Кремля с видами на Москву-реку, разными ландшафтами и парящим мостом. Подходит, когда хочется совместить центр и немного воздуха.", enText: "A contemporary park beside the Kremlin with river views, varied landscapes and the famous floating bridge. Ideal when you want both landmarks and open air.", tags: "Парк · виды", enTags: "Park · views", url: "https://www.zaryadye-park.ru/", filter: "parks" },
  { category: "museums", title: "Третьяковская галерея", en: "The Tretyakov Gallery", text: "Главное место для знакомства с русским искусством — от древнерусской иконописи до живописи XIX века. После музея удобно пройти к Водоотводному каналу и Репинскому скверу.", enText: "The essential place to discover Russian art, from early icons to nineteenth-century painting. Afterwards, walk towards the Vodootvodny Canal and Repinsky Square.", tags: "Искусство · Замоскворечье", enTags: "Art · Zamoskvorechye", url: "https://www.tretyakovgallery.ru/", filter: "museums" },
  { category: "centre", title: "Храм Христа Спасителя и Пречистенка", en: "Cathedral of Christ the Saviour and Prechistenka", text: "Начните у храма, перейдите Патриарший мост и продолжите прогулку по Пречистенке к Остоженке. Здесь много спокойных дворов, музеев и красивых фасадов.", enText: "Start at the cathedral, cross Patriarch Bridge and continue along Prechistenka towards Ostozhenka. The area mixes quiet courtyards, museums and elegant façades.", tags: "Архитектура · центр", enTags: "Architecture · centre", url: "https://xxc.ru/", filter: "centre" },
  { category: "centre", title: "Патриаршие пруды", en: "Patriarch’s Ponds", text: "Небольшой пруд, бульвар и кварталы старой Москвы. Место особенно приятно для неспешной прогулки вечером, а маршрут можно продолжить по Тверскому бульвару.", enText: "A small pond, a leafy boulevard and old Moscow streets. It is especially pleasant in the evening, with Tverskoy Boulevard making a natural continuation.", tags: "Атмосфера · центр", enTags: "Atmosphere · centre", url: "https://moscowseasons.com/guide/", filter: "centre" },
  { category: "centre", title: "Арбат и переулки", en: "Arbat and its side streets", text: "Пешеходный Арбат — простой способ увидеть историческую Москву без сложной навигации. Для более тихого продолжения сверните на Пречистенку и в арбатские переулки.", enText: "Pedestrian Arbat is an easy introduction to historic Moscow. For a quieter continuation, turn towards Prechistenka and the surrounding lanes.", tags: "Улицы · история", enTags: "Streets · history", url: "https://moscowseasons.com/guide/", filter: "centre" },
  { category: "parks", title: "Парк Горького и Крымская набережная", en: "Gorky Park and Krymskaya Embankment", text: "Один из самых удобных маршрутов у воды: широкая набережная, мосты, зелень и пространство для длинной прогулки. Хорошо работает как самостоятельный маршрут на 5–8 км.", enText: "One of Moscow’s easiest waterfront walks: a broad embankment, bridges, greenery and room for a longer route. A natural 5–8 km walk on its own.", tags: "Парк · Москва-река", enTags: "Park · Moscow River", url: "https://park-gorkogo.com/", filter: "parks" },
  { category: "parks", title: "ВДНХ и Музей космонавтики", en: "VDNH and the Museum of Cosmonautics", text: "Монументальные павильоны, длинные аллеи и одна из самых узнаваемых городских осей. Для тематического дня добавьте Музей космонавтики и павильон «Космос».", enText: "Monumental pavilions, long avenues and one of the city’s most recognisable ensembles. Add the Museum of Cosmonautics and the Cosmos pavilion for a themed day.", tags: "Парк · космос", enTags: "Park · space", url: "https://vdnh.ru/", filter: "parks" },
  { category: "museums", title: "Коломенское", en: "Kolomenskoye", text: "Бывшая царская усадьба с просторными видами на Москву-реку, садами и памятниками древнерусской архитектуры. Это место лучше закладывать на несколько часов.", enText: "A former royal estate with broad river views, gardens and remarkable early Russian architecture. Allow several hours to explore it properly.", tags: "Усадьба · парк", enTags: "Estate · park", url: "https://mgomz.ru/", filter: "museums" },
  { category: "museums", title: "Царицыно", en: "Tsaritsyno", text: "Неоготический дворцово-парковый ансамбль, пруды и большие прогулочные пространства на юге Москвы. Особенно красиво в сезон цветения и осенью.", enText: "A neo-Gothic palace and park ensemble with ponds and expansive walking paths in the south of Moscow. Especially rewarding during blossom season and autumn.", tags: "Архитектура · парк", enTags: "Architecture · park", url: "https://tsaritsyno-museum.ru/", filter: "museums" },
];

const articleMeta = [
  { image: "https://images.unsplash.com/photo-1513326738677-b964603b136d?auto=format&fit=crop&w=1200&q=84", price: "Бесплатно снаружи · от 1 000 ₽ внутри", enPrice: "Free outside · from ₽1,000 inside", address: "Красная площадь", enAddress: "Red Square", lat: 55.7539, lon: 37.6208, anchor: "alexander-garden", official: "https://www.kremlin.ru/" },
  { image: "https://images.unsplash.com/photo-1548919973-5cef591cdbc9?auto=format&fit=crop&w=1200&q=84", price: "от 700 ₽", enPrice: "from ₽700", address: "Красная площадь, 2", enAddress: "2 Red Square", lat: 55.7525, lon: 37.6231, anchor: "st-basil", official: "https://cathedral.ru/" },
  { image: "https://images.unsplash.com/photo-1523731407965-2430cd12f5e4?auto=format&fit=crop&w=1200&q=84", price: "Свободный вход", enPrice: "Free entry", address: "Никольская улица", enAddress: "Nikolskaya Street", lat: 55.7598, lon: 37.6261, anchor: "nikolskaya", official: "https://gum.ru/" },
  { image: "https://images.unsplash.com/photo-1539650116574-75c0c6d73f6e?auto=format&fit=crop&w=1200&q=84", price: "Парк — бесплатно", enPrice: "Park — free", address: "ул. Варварка, 6", enAddress: "6 Varvarka Street", lat: 55.7517, lon: 37.6286, anchor: "zaryadye", official: "https://www.zaryadye-park.ru/" },
  { image: "https://images.unsplash.com/photo-1577083288073-40892c0860a4?auto=format&fit=crop&w=1200&q=84", price: "от 300 ₽", enPrice: "from ₽300", address: "Лаврушинский переулок, 10", enAddress: "10 Lavrushinsky Lane", lat: 55.7415, lon: 37.6202, anchor: "tretyakov", official: "https://www.tretyakovgallery.ru/" },
  { image: "https://images.unsplash.com/photo-1544986581-efac024faf62?auto=format&fit=crop&w=1200&q=84", price: "Свободный вход", enPrice: "Free entry", address: "ул. Волхонка, 15", enAddress: "15 Volkhonka Street", lat: 55.7446, lon: 37.6055, anchor: "cathedral", official: "https://xxc.ru/" },
  { image: "https://images.unsplash.com/photo-1519288671229-4f5a3b8f6f84?auto=format&fit=crop&w=1200&q=84", price: "Свободный вход", enPrice: "Free entry", address: "Большой Патриарший переулок", enAddress: "Bolshoy Patriarchal Lane", lat: 55.7639, lon: 37.5924, anchor: "patriarshiye", official: "https://moscowseasons.com/guide/" },
  { image: "https://images.unsplash.com/photo-1526495124232-a04e1849168c?auto=format&fit=crop&w=1200&q=84", price: "Свободный вход", enPrice: "Free entry", address: "ул. Арбат", enAddress: "Arbat Street", lat: 55.7522, lon: 37.5915, anchor: "arbat", official: "https://moscowseasons.com/guide/" },
  { image: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=84", price: "Свободный вход", enPrice: "Free entry", address: "Крымский Вал, 9", enAddress: "9 Krymsky Val", lat: 55.7298, lon: 37.6011, anchor: "gorky", official: "https://park-gorkogo.com/" },
  { image: "https://images.unsplash.com/photo-1500534623283-312aade485b7?auto=format&fit=crop&w=1200&q=84", price: "Парк бесплатно · музей уточнить", enPrice: "Park free · museum price varies", address: "просп. Мира, 119", enAddress: "119 Mira Avenue", lat: 55.8288, lon: 37.6331, anchor: "vdnh", official: "https://vdnh.ru/" },
  { image: "https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&w=1200&q=84", price: "Парк бесплатно · музей уточнить", enPrice: "Park free · museum price varies", address: "просп. Андропова, 39", enAddress: "39 Andropov Avenue", lat: 55.6712, lon: 37.6697, anchor: "kolomenskoye", official: "https://mgomz.ru/" },
  { image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=84", price: "Парк бесплатно · дворец 750 ₽", enPrice: "Park free · palace ₽750", address: "ул. Дольская, 1", enAddress: "1 Dolskaya Street", lat: 55.6197, lon: 37.6827, anchor: "tsaritsyno", official: "https://tsaritsyno-museum.ru/" },
];

const articleSlugs = ["red-square", "st-basil", "gum", "zaryadye", "tretyakov", "christ-cathedral", "patriarshiye", "arbat", "gorky", "vdnh", "kolomenskoye", "tsaritsyno"];

const articleParams = new URLSearchParams(window.location.search);
let articleLanguage = articleParams.get("lang") === "en" || (articleParams.get("lang") !== "ru" && localStorage.getItem(ARTICLE_LANGUAGE_KEY) === "en") ? "en" : "ru";
let articleTheme = localStorage.getItem(ARTICLE_THEME_KEY) === "light" ? "light" : "dark";

function at(key) { return articleTranslations[articleLanguage][key] || articleTranslations.ru[key] || key; }

function renderArticles(filter = "all") {
  const grid = document.querySelector("#articleGrid");
  const query = document.querySelector("#articleSearch")?.value.trim().toLowerCase() || "";
  grid.innerHTML = articles.filter((item, index) => {
    const haystack = `${item.title} ${item.en} ${item.text} ${item.enText} ${item.tags} ${item.enTags}`.toLowerCase();
    return (filter === "all" || item.filter === filter) && (!query || haystack.includes(query));
  }).map((item) => {
    const meta = articleMeta[articles.indexOf(item)];
    const mapUrl = `https://yandex.ru/maps/?pt=${meta.lon},${meta.lat}&z=16&l=map`;
    const routeUrl = `./?start=metro-okhotny&distance=5&anchor=${meta.anchor}`;
    return `
    <article id="article-${articleSlugs[articles.indexOf(item)]}" class="article-card">
      <div class="article-image-wrap"><img class="article-image" src="${meta.image}" alt="${articleLanguage === "en" ? item.en : item.title}" loading="lazy" onerror="this.closest('.article-image-wrap').classList.add('is-broken')" /><span class="article-number">${String(articles.indexOf(item) + 1).padStart(2, "0")}</span></div>
      <div class="article-card-body"><div class="article-card-top"><span class="article-tag">${articleLanguage === "en" ? item.enTags : item.tags}</span></div>
      <h2>${articleLanguage === "en" ? item.en : item.title}</h2>
      <p>${articleLanguage === "en" ? item.enText : item.text}</p>
      <div class="article-facts"><span><b>${at("priceLabel")}</b> ${articleLanguage === "en" ? meta.enPrice : meta.price}</span><span><b>${at("addressLabel")}</b> ${articleLanguage === "en" ? meta.enAddress : meta.address}</span></div>
      <div class="article-actions"><a href="${routeUrl}" class="article-primary">${at("buildRoute")}</a><a href="${mapUrl}" target="_blank" rel="noreferrer" class="article-secondary">${at("openMap")}</a><a href="${meta.official}" target="_blank" rel="noreferrer" class="article-link">${at("openOfficial")} <span aria-hidden="true">↗</span></a></div></div>
    </article>`;
  }).join("");
}

function applyArticleLanguage() {
  document.documentElement.lang = articleLanguage;
  document.title = articleLanguage === "en" ? "Walk Moscow — things to see in Moscow" : "Walk Moscow — что посмотреть в Москве";
  document.querySelectorAll("[data-i18n]").forEach((node) => { node.textContent = at(node.dataset.i18n); });
  document.querySelectorAll("[data-i18n-placeholder]").forEach((node) => { node.placeholder = at(node.dataset.i18nPlaceholder); });
  document.querySelector("#languageToggle").textContent = articleLanguage === "ru" ? "EN" : "RU";
  document.querySelector("#languageToggle").setAttribute("aria-label", at("language"));
  renderArticles(document.querySelector(".article-filter.is-active")?.dataset.filter || "all");
  if (window.location.hash) document.getElementById(window.location.hash.slice(1))?.scrollIntoView({ block: "center" });
}

function applyArticleTheme() {
  document.documentElement.dataset.theme = articleTheme;
  const button = document.querySelector("#themeToggle");
  button.textContent = articleTheme === "dark" ? "☼" : "☾";
  button.setAttribute("aria-label", articleTheme === "dark" ? at("lightTheme") : at("darkTheme"));
}

document.querySelector("#languageToggle").addEventListener("click", () => { articleLanguage = articleLanguage === "ru" ? "en" : "ru"; localStorage.setItem(ARTICLE_LANGUAGE_KEY, articleLanguage); applyArticleLanguage(); applyArticleTheme(); });
document.querySelector("#themeToggle").addEventListener("click", () => { articleTheme = articleTheme === "dark" ? "light" : "dark"; localStorage.setItem(ARTICLE_THEME_KEY, articleTheme); applyArticleTheme(); });
document.querySelectorAll(".article-filter").forEach((button) => button.addEventListener("click", () => { document.querySelectorAll(".article-filter").forEach((item) => item.classList.remove("is-active")); button.classList.add("is-active"); renderArticles(button.dataset.filter); }));
document.querySelector("#articleSearch").addEventListener("input", () => renderArticles(document.querySelector(".article-filter.is-active")?.dataset.filter || "all"));
applyArticleTheme();
applyArticleLanguage();
