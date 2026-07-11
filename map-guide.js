const mapGuideFilters = { metro: true, park: true, sight: true };

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
    image: meta.image || DEFAULT_MAP_PLACE_IMAGE,
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
    image: DEFAULT_MAP_PLACE_IMAGE,
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
      const popup = `<div class="map-guide-popup"><img src="${place.image}" alt="${imageAlt}" referrerpolicy="no-referrer" onerror="this.onerror=null;this.src='${DEFAULT_MAP_PLACE_IMAGE}'"><strong>${escapeHtml(name)}</strong><p>${escapeHtml(description)}</p>${article}</div>`;
      L.marker([place.lat, place.lon], { icon: createGuideIcon(place.type, name), keyboard: true, title: name })
        .bindPopup(popup, { maxWidth: 240 })
        .addTo(guideLayer);
    });
};
function createGuideIcon(type, name) {
  const symbols = { metro: "M", park: "✦", sight: "•" };
  return L.divIcon({
    className: `map-guide-marker map-guide-marker--${type}`,
    html: `<span aria-hidden="true">${symbols[type] || "•"}</span><b>${escapeHtml(name)}</b>`,
    iconSize: [20, 20],
    iconAnchor: [10, 10],
    popupAnchor: [0, -10],
  });
}

document.querySelectorAll("[data-map-filter]").forEach((input) => {
  input.addEventListener("change", () => {
    mapGuideFilters[input.dataset.mapFilter] = input.checked;
    window.renderMapGuide();
  });
});
