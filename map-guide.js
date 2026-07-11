const mapGuideFilters = { metro: false, park: false, sight: false };
window.mapGuideFilters = mapGuideFilters;
const MAP_PLACE_FALLBACK_IMAGE = "https://commons.wikimedia.org/wiki/Special:FilePath/Red_Square%2C_Moscow%2C_Russia.jpg?width=640";

function resolveMapImage(source) {
  if (!source) return MAP_PLACE_FALLBACK_IMAGE;
  const match = source.match(/\/commons\/thumb\/[^/]+\/[^/]+\/([^/]+)\/\d+px-/);
  return match ? `https://commons.wikimedia.org/wiki/Special:FilePath/${match[1]}?width=640` : source;
}

function guidePlaceFromPoi(place) {
  const meta = mapPlaceMeta[place.id] || {};
  const type = place.themes?.includes("green") ? "park" : "sight";
  return {
    id: `guide-${place.id}`,
    type,
    name: place.name,
    nameEn: place.name,
    description: place.note || "Интересное место для прогулки по Москве.",
    descriptionEn: place.note || "An interesting place to discover on a walk through Moscow.",
    image: resolveMapImage(meta.image),
    article: articleSlugByPoint[place.id],
    score: place.score || 0,
    lat: place.lat,
    lon: place.lon,
  };
}

function getMapGuidePlaces() {
  const attractions = pois.map(guidePlaceFromPoi);
  const stationNames = metroStations.reduce((counts, station) => {
    counts[station.name] = (counts[station.name] || 0) + 1;
    return counts;
  }, {});
  const metro = metroStations.filter(isInsideGardenRing).map((station) => ({
    ...station,
    type: "metro",
    isHub: stationNames[station.name] > 1 || station.line === "Кольцевая",
    nameEn: station.name,
    description: `Станция линии «${station.line}» рядом с местами для прогулок из каталога.`,
    descriptionEn: `${station.line} line station near places from the walking catalogue.`,
    image: MAP_PLACE_FALLBACK_IMAGE,
  }));
  return [...metro, ...attractions];
}

function isInsideGardenRing(station) {
  const latRadius = 0.027;
  const lonRadius = 0.047;
  const latDistance = (station.lat - 55.755) / latRadius;
  const lonDistance = (station.lon - 37.62) / lonRadius;
  return latDistance ** 2 + lonDistance ** 2 <= 1;
}

function visibleGuidePlaces(places) {
  const zoom = map.getZoom();
  if (zoom >= 15) return places;
  if (zoom >= 13) return places.filter((place) => place.type !== "metro" || place.isHub);
  return places.filter((place) => place.type === "park" || place.isHub || (place.type === "sight" && place.score >= 90));
}

window.renderMapGuide = function renderMapGuide() {
  if (!map || !window.L || !guideLayer) return;
  map.getContainer().classList.toggle("map-guide-labels-hidden", map.getZoom() < 15);
  guideLayer.clearLayers();
  visibleGuidePlaces(getMapGuidePlaces())
    .filter((place) => mapGuideFilters[place.type])
    .forEach((place) => {
      const name = currentLanguage === "en" ? place.nameEn : place.name;
      const description = currentLanguage === "en" ? place.descriptionEn : place.description;
      const article = place.article ? ` <a class="map-popup-link" href="./articles.html#article-${place.article}">${currentLanguage === "en" ? "Read more" : "Подробнее"}</a>` : "";
      const imageAlt = escapeHtml(name);
      const category = place.type === "metro" ? (currentLanguage === "en" ? "Metro" : "Метро") : place.type === "park" ? (currentLanguage === "en" ? "Park" : "Парк") : (currentLanguage === "en" ? "Landmark" : "Достопримечательность");
      const popup = `<div class="map-guide-popup"><span class="route-popup-category">${category}</span><strong>${escapeHtml(name)}</strong><p>${escapeHtml(description)}</p>${article}</div>`;
      L.marker([place.lat, place.lon], { icon: createGuideIcon(place.type, name), keyboard: true, title: name })
        .bindPopup(popup, { maxWidth: 220, className: "map-guide-leaflet-popup" })
        .addTo(guideLayer);
    });
};
function createGuideIcon(type, name) {
  const symbols = { metro: "<path d='M5 19h14M7 19V5h10v14M9 8h6M9 12h6'/>", park: "<path d='M12 21V9m0 4-4-4m4 1 4-5M5 21h14'/>", sight: "<circle cx='12' cy='12' r='5'/>" };
  return L.divIcon({
    className: `map-guide-marker map-guide-marker--${type}`,
    html: `<span aria-hidden="true"><svg viewBox="0 0 24 24">${symbols[type] || symbols.sight}</svg></span><b>${escapeHtml(name)}</b>`,
    iconSize: [16, 16],
    iconAnchor: [8, 8],
    popupAnchor: [0, -8],
  });
}

document.querySelectorAll("[data-layer-filter]").forEach((input) => {
  input.addEventListener("change", () => {
    mapGuideFilters[input.dataset.layerFilter] = input.checked;
    window.renderMapGuide();
  });
});
