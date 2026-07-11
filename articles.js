const ARTICLE_LANGUAGE_KEY = "moscow-walks-language";
const ARTICLE_THEME_KEY = "moscow-walks-theme";

function readArticleStorage(key) {
  try {
    return window.localStorage.getItem(key);
  } catch (error) {
    return null;
  }
}

function writeArticleStorage(key, value) {
  try {
    window.localStorage.setItem(key, value);
  } catch (error) {
    // Storage is optional; the page remains usable without it.
  }
}

const articleTranslations = {
  ru: {
    back: "← К маршрутам",
    eyebrow: "Гид по Москве",
    title: "Что посмотреть в Москве",
    lead: "Выберите место по настроению — и добавьте его в маршрут прогулки.",
    statPlaces: "24 места",
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
    statPlaces: "24 places",
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
    language: "Switch to Russian",
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
  { category: "museums", title: "Новодевичий монастырь и пруды", en: "Novodevichy Convent and Ponds", text: "Тихий исторический ансамбль у воды: стены монастыря, пруды и один из самых приятных маршрутов рядом с Лужниками.", enText: "A peaceful historic ensemble by the water, with monastery walls, ponds and one of the most pleasant walks near Luzhniki.", tags: "История · вода", enTags: "History · waterfront", url: "https://mgomz.ru/", filter: "museums" },
  { category: "parks", title: "Воробьёвы горы и смотровая площадка", en: "Sparrow Hills and the Viewpoint", text: "Панорама Москвы, лесные дорожки и длинный спуск к Москве-реке. Хороший выбор для прогулки с видами и перепадом высоты.", enText: "A wide Moscow panorama, wooded paths and a long descent towards the river. A strong choice for views and a little elevation.", tags: "Парк · виды", enTags: "Park · views", url: "https://park-gorkogo.com/", filter: "parks" },
  { category: "parks", title: "Сокольники", en: "Sokolniki Park", text: "Большой парк с прямыми аллеями, прудами и пространством для спокойной прогулки вдали от плотного центра.", enText: "A large park of straight avenues, ponds and open space for a relaxed walk away from the busy centre.", tags: "Парк · аллеи", enTags: "Park · avenues", url: "https://park.sokolniki.com/", filter: "parks" },
  { category: "parks", title: "Нескучный сад", en: "Neskuchny Garden", text: "Самая камерная часть прогулки вдоль Москвы-реки: старые деревья, дорожки и удобное продолжение маршрута из Парка Горького.", enText: "The quieter stretch of Moscow’s riverside: old trees, winding paths and a natural continuation from Gorky Park.", tags: "Парк · Москва-река", enTags: "Park · Moscow River", url: "https://park-gorkogo.com/", filter: "parks" },
  { category: "parks", title: "Аптекарский огород", en: "Aptekarsky Ogorod", text: "Небольшой ботанический сад в центре с оранжереями, сезонными цветами и ощущением отдельного зелёного мира.", enText: "A compact botanical garden in the centre, with greenhouses, seasonal blooms and the feeling of a separate green world.", tags: "Сад · центр", enTags: "Garden · centre", url: "https://hortus.ru/", filter: "parks" },
  { category: "parks", title: "Измайловский парк", en: "Izmaylovo Park", text: "Просторный лесопарк с прудами и длинными дорожками. Подходит для медленной прогулки, велосипеда и отдыха на полдня.", enText: "A spacious woodland park with ponds and long paths. Ideal for a slow walk, cycling or a half-day outdoors.", tags: "Парк · лес", enTags: "Park · woodland", url: "https://izmailovsky-park.ru/", filter: "parks" },
  { category: "museums", title: "Усадьба Кусково", en: "Kuskovo Estate", text: "Загородная усадьба с дворцом, регулярным парком и прудами. Хороший маршрут для архитектуры, тишины и длинного дня.", enText: "A country estate with a palace, formal gardens and ponds. A rewarding day out for architecture, quiet and open space.", tags: "Усадьба · парк", enTags: "Estate · park", url: "https://kuskovo.ru/", filter: "museums" },
  { category: "centre", title: "Москва-Сити и набережная Тараса Шевченко", en: "Moscow City and Taras Shevchenko Embankment", text: "Современная Москва с небоскрёбами, видами на реку и контрастом между деловым кварталом и длинной набережной.", enText: "Modern Moscow at its most vertical: skyscrapers, river views and a striking contrast between the business district and the long embankment.", tags: "Архитектура · вода", enTags: "Architecture · waterfront", url: "https://citymoscow.ru/", filter: "centre" },
  { category: "centre", title: "Большой театр и Театральная площадь", en: "Bolshoi Theatre and Theatre Square", text: "Парадная площадь Москвы с фасадом Большого театра, фонтаном и удобным продолжением маршрута к Неглинной улице и ЦУМу.", enText: "Moscow at its most theatrical: the Bolshoi facade, the fountain and an easy continuation towards Neglinnaya Street and TSUM.", tags: "Архитектура · центр", enTags: "Architecture · centre", url: "https://www.bolshoi.ru/", filter: "centre" },
  { category: "parks", title: "Московский зоопарк", en: "Moscow Zoo", text: "Зелёный маршрут в центре Москвы с просторными аллеями и возможностью провести здесь несколько спокойных часов.", enText: "A green city-centre route with broad paths and enough to explore for a relaxed few hours.", tags: "Парк · центр", enTags: "Park · centre", url: "https://moscowzoo.ru/", filter: "parks" },
  { category: "parks", title: "Музеон и Крымская набережная", en: "Muzeon and Krymskaya Embankment", text: "Парк скульптур, спокойная набережная и удобная связка с Парком Горького. Подходит для прогулки без резких подъёмов.", enText: "A sculpture park, a calm riverside and an easy connection to Gorky Park. A smooth walk with no demanding climbs.", tags: "Парк · искусство", enTags: "Park · art", url: "https://park-gorkogo.com/muzeon/", filter: "parks" },
  { category: "parks", title: "Главный ботанический сад", en: "Main Botanical Garden", text: "Большой зелёный маршрут с коллекциями растений, аллеями и ощущением загородной прогулки внутри города.", enText: "A large green escape with plant collections, long paths and the feeling of being outside the city.", tags: "Сад · природа", enTags: "Garden · nature", url: "https://www.gbsad.ru/", filter: "parks" },
];

const articleMeta = [
  { image: "https://commons.wikimedia.org/wiki/Special:FilePath/Red%20Square,%20Moscow,%20Russia.jpg", price: "Бесплатно снаружи · от 1 000 ₽ внутри", enPrice: "Free outside · from ₽1,000 inside", address: "Красная площадь", enAddress: "Red Square", lat: 55.7539, lon: 37.6208, anchor: "alexander-garden", official: "https://www.kremlin.ru/" },
  { image: "https://commons.wikimedia.org/wiki/Special:FilePath/Russia-Moscow-Saint%20Basil's%20Cathedral-2.jpg", price: "от 700 ₽", enPrice: "from ₽700", address: "Красная площадь, 2", enAddress: "2 Red Square", lat: 55.7525, lon: 37.6231, anchor: "st-basil", official: "https://cathedral.ru/" },
  { image: "https://commons.wikimedia.org/wiki/Special:FilePath/GUM%20w%20Moskwie.JPG", price: "Свободный вход", enPrice: "Free entry", address: "Никольская улица", enAddress: "Nikolskaya Street", lat: 55.7598, lon: 37.6261, anchor: "nikolskaya", official: "https://gum.ru/" },
  { image: "https://commons.wikimedia.org/wiki/Special:FilePath/Zaryadye%20Park,%20Moscow.jpg", price: "Парк — бесплатно", enPrice: "Park — free", address: "ул. Варварка, 6", enAddress: "6 Varvarka Street", lat: 55.7517, lon: 37.6286, anchor: "zaryadye", official: "https://www.zaryadye-park.ru/" },
  { image: "https://commons.wikimedia.org/wiki/Special:FilePath/State%20Tretyakov%20Gallery%20Moscow.jpg", price: "от 300 ₽", enPrice: "from ₽300", address: "Лаврушинский переулок, 10", enAddress: "10 Lavrushinsky Lane", lat: 55.7415, lon: 37.6202, anchor: "tretyakov", official: "https://www.tretyakovgallery.ru/" },
  { image: "https://commons.wikimedia.org/wiki/Special:FilePath/Cathedral%20of%20Christ%20the%20Saviour,%20Moscow,%20Russia.jpg", price: "Свободный вход", enPrice: "Free entry", address: "ул. Волхонка, 15", enAddress: "15 Volkhonka Street", lat: 55.7446, lon: 37.6055, anchor: "cathedral", official: "https://xxc.ru/" },
  { image: "https://images.unsplash.com/photo-1519288671229-4f5a3b8f6f84?auto=format&fit=crop&w=1200&q=84", price: "Свободный вход", enPrice: "Free entry", address: "Большой Патриарший переулок", enAddress: "Bolshoy Patriarchal Lane", lat: 55.7639, lon: 37.5924, anchor: "patriarshiye", official: "https://moscowseasons.com/guide/" },
  { image: "https://commons.wikimedia.org/wiki/Special:FilePath/ArbatMoscow.jpg", price: "Свободный вход", enPrice: "Free entry", address: "ул. Арбат", enAddress: "Arbat Street", lat: 55.7522, lon: 37.5915, anchor: "arbat", official: "https://moscowseasons.com/guide/" },
  { image: "https://commons.wikimedia.org/wiki/Special:FilePath/Gorky%20Park%20(2013-07-16)%2001.jpg", price: "Свободный вход", enPrice: "Free entry", address: "Крымский Вал, 9", enAddress: "9 Krymsky Val", lat: 55.7298, lon: 37.6011, anchor: "gorky", official: "https://park-gorkogo.com/" },
  { image: "https://images.unsplash.com/photo-1500534623283-312aade485b7?auto=format&fit=crop&w=1200&q=84", price: "Парк бесплатно · музей уточнить", enPrice: "Park free · museum price varies", address: "просп. Мира, 119", enAddress: "119 Mira Avenue", lat: 55.8288, lon: 37.6331, anchor: "vdnh", official: "https://vdnh.ru/" },
  { image: "https://commons.wikimedia.org/wiki/Special:FilePath/Kolomenskoye,%20Moscow,%20Russia%20-%2030062345825.jpg", price: "Парк бесплатно · музей уточнить", enPrice: "Park free · museum price varies", address: "просп. Андропова, 39", enAddress: "39 Andropov Avenue", lat: 55.6712, lon: 37.6697, anchor: "kolomenskoye", official: "https://mgomz.ru/" },
  { image: "https://commons.wikimedia.org/wiki/Special:FilePath/Moscow,%20Russia,%20Tsaritsyno%20Palace.jpg", price: "Парк бесплатно · дворец 750 ₽", enPrice: "Park free · palace ₽750", address: "ул. Дольская, 1", enAddress: "1 Dolskaya Street", lat: 55.6197, lon: 37.6827, anchor: "tsaritsyno", official: "https://tsaritsyno-museum.ru/" },
  { image: "https://commons.wikimedia.org/wiki/Special:FilePath/2024%20Novodevichy%20Convent%20in%20Moscow.jpg", price: "Парк бесплатно · музей уточнить", enPrice: "Park free · museum price varies", address: "Новодевичий проезд, 1", enAddress: "1 Novodevichy Passage", lat: 55.7264, lon: 37.5578, anchor: "novodevichy", official: "https://mgomz.ru/" },
  { image: "https://commons.wikimedia.org/wiki/Special:FilePath/Sparrow%20Hills.jpg", price: "Свободный вход", enPrice: "Free entry", address: "Воробьёвы горы", enAddress: "Sparrow Hills", lat: 55.7104, lon: 37.5426, anchor: "sparrow", official: "https://park-gorkogo.com/" },
  { image: "https://commons.wikimedia.org/wiki/Special:FilePath/Sokolniki%20Park,%20Moskva,%20Russia%20(Unsplash).jpg", price: "Свободный вход", enPrice: "Free entry", address: "Сокольнический Вал, 1", enAddress: "1 Sokolnichesky Val", lat: 55.7958, lon: 37.6758, anchor: "sokolniki", official: "https://park.sokolniki.com/" },
  { image: "https://commons.wikimedia.org/wiki/Special:FilePath/Gorky%20Park%20(2013-07-16)%2001.jpg", price: "Свободный вход", enPrice: "Free entry", address: "Ленинский проспект, 30", enAddress: "30 Leninsky Avenue", lat: 55.7169, lon: 37.5936, anchor: "neskuchny", official: "https://park-gorkogo.com/" },
  { image: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=84", price: "от 500 ₽", enPrice: "from ₽500", address: "просп. Мира, 26", enAddress: "26 Mira Avenue", lat: 55.7798, lon: 37.6327, anchor: "aptekarsky", official: "https://hortus.ru/" },
  { image: "https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&w=1200&q=84", price: "Свободный вход", enPrice: "Free entry", address: "Московский проспект, 57", enAddress: "57 Moskovsky Avenue", lat: 55.7946, lon: 37.7994, anchor: "izmaylovo", official: "https://izmailovsky-park.ru/" },
  { image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=84", price: "от 400 ₽", enPrice: "from ₽400", address: "ул. Юности, 2", enAddress: "2 Yunosti Street", lat: 55.7353, lon: 37.8131, anchor: "kuskovo", official: "https://kuskovo.ru/" },
  { image: "https://images.unsplash.com/photo-1500534623283-312aade485b7?auto=format&fit=crop&w=1200&q=84", price: "Свободный вход", enPrice: "Free entry", address: "Пресненская набережная, 2", enAddress: "2 Presnenskaya Embankment", lat: 55.7481, lon: 37.5395, anchor: "moscow-city", official: "https://citymoscow.ru/" },
  { image: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1200&q=84", price: "от 1 000 ₽", enPrice: "from ₽1,000", address: "Театральная площадь, 1", enAddress: "1 Theatre Square", lat: 55.7601, lon: 37.6187, anchor: "bolshoi", official: "https://www.bolshoi.ru/" },
  { image: "https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&w=1200&q=84", price: "от 1 000 ₽", enPrice: "from ₽1,000", address: "Большая Грузинская, 1", enAddress: "1 Bolshaya Gruzinskaya Street", lat: 55.7616, lon: 37.5774, anchor: "zoo", official: "https://moscowzoo.ru/" },
  { image: "https://images.unsplash.com/photo-1500534623283-312aade485b7?auto=format&fit=crop&w=1200&q=84", price: "Свободный вход", enPrice: "Free entry", address: "Крымский Вал, 10", enAddress: "10 Krymsky Val", lat: 55.7355, lon: 37.6051, anchor: "muzeon", official: "https://park-gorkogo.com/muzeon/" },
  { image: "https://images.unsplash.com/photo-1497250681960-ef046c08a56e?auto=format&fit=crop&w=1200&q=84", price: "Свободный вход", enPrice: "Free entry", address: "ул. Ботаническая, 4", enAddress: "4 Botanicheskaya Street", lat: 55.8467, lon: 37.6047, anchor: "botanical-garden", official: "https://www.gbsad.ru/" },
];

const articleSlugs = ["red-square", "st-basil", "gum", "zaryadye", "tretyakov", "christ-cathedral", "patriarshiye", "arbat", "gorky", "vdnh", "kolomenskoye", "tsaritsyno", "novodevichy", "sparrow-hills", "sokolniki", "neskuchny", "aptekarsky-ogorod", "izmaylovo", "kuskovo", "moscow-city", "bolshoi", "moscow-zoo", "muzeon", "botanical-garden"];
const articleParams = new URLSearchParams(window.location.search);
let articleLanguage = articleParams.get("lang") === "en" || (articleParams.get("lang") !== "ru" && readArticleStorage(ARTICLE_LANGUAGE_KEY) === "en") ? "en" : "ru";
let articleTheme = readArticleStorage(ARTICLE_THEME_KEY) === "light" ? "light" : "dark";
const initialArticleSearch = articleParams.get("search") || "";

function at(key) { return articleTranslations[articleLanguage][key] || articleTranslations.ru[key] || key; }

function renderArticles(filter = "all") {
  const grid = document.querySelector("#articleGrid");
  const query = document.querySelector("#articleSearch")?.value.trim().toLowerCase() || "";
  grid.innerHTML = articles.filter((item, index) => {
    const haystack = `${item.title} ${item.en} ${item.text} ${item.enText} ${item.tags} ${item.enTags}`.toLowerCase();
    return (filter === "all" || item.filter === filter) && (!query || haystack.includes(query));
  }).map((item) => {
    const articleIndex = articles.indexOf(item);
    const meta = articleMeta[articleIndex];
    const imageSource = meta.image;
    const mapUrl = `https://yandex.ru/maps/?pt=${meta.lon},${meta.lat}&z=16&l=map`;
    const routeUrl = `./?start=metro-okhotny&distance=5&anchor=${meta.anchor}`;
    return `
    <article id="article-${articleSlugs[articleIndex]}" class="article-card">
      <div class="article-image-wrap"><img class="article-image" src="${imageSource}" alt="${articleLanguage === "en" ? item.en : item.title}" loading="lazy" decoding="async" width="1200" height="675" referrerpolicy="no-referrer" onerror="this.hidden=true; this.nextElementSibling.hidden=false" /><div class="article-image-placeholder" role="img" aria-label="${articleLanguage === "en" ? item.en : item.title}" hidden><span aria-hidden="true">${item.category === "parks" ? "✦" : item.category === "museums" ? "◈" : "⌂"}</span></div><span class="article-number">${String(articleIndex + 1).padStart(2, "0")}</span></div>
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
  const description = articleLanguage === "en" ? "Things to see in Moscow: 24 landmarks, parks, museums and walking ideas with short descriptions, maps and official links." : "Что посмотреть в Москве: 24 достопримечательности, парки, музеи и красивые маршруты с краткими описаниями, картой и официальными ссылками.";
  document.querySelector('meta[name="description"]')?.setAttribute("content", description);
  document.querySelector('meta[property="og:title"]')?.setAttribute("content", document.title);
  document.querySelector('meta[property="og:description"]')?.setAttribute("content", description);
  document.querySelectorAll("[data-i18n]").forEach((node) => { node.textContent = at(node.dataset.i18n); });
  document.querySelectorAll("[data-i18n-placeholder]").forEach((node) => { node.placeholder = at(node.dataset.i18nPlaceholder); });
  const searchInput = document.querySelector("#articleSearch");
  if (searchInput && initialArticleSearch && !searchInput.value) searchInput.value = initialArticleSearch;
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

document.querySelector("#languageToggle")?.addEventListener("click", () => { articleLanguage = articleLanguage === "ru" ? "en" : "ru"; writeArticleStorage(ARTICLE_LANGUAGE_KEY, articleLanguage); applyArticleLanguage(); applyArticleTheme(); });
document.querySelector("#themeToggle")?.addEventListener("click", () => { articleTheme = articleTheme === "dark" ? "light" : "dark"; writeArticleStorage(ARTICLE_THEME_KEY, articleTheme); applyArticleTheme(); });
document.querySelectorAll(".article-filter").forEach((button) => button.addEventListener("click", () => { document.querySelectorAll(".article-filter").forEach((item) => item.classList.remove("is-active")); button.classList.add("is-active"); renderArticles(button.dataset.filter); }));
document.querySelector("#articleSearch")?.addEventListener("input", () => renderArticles(document.querySelector(".article-filter.is-active")?.dataset.filter || "all"));
applyArticleTheme();
applyArticleLanguage();

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("./sw.js?v=2026-07-11-4").catch(() => {
      // The catalog remains usable when service workers are unavailable.
    });
  });
}
