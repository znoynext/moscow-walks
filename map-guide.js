window.renderMapGuide = function renderMapGuide() {
  if (!map || !window.L || !guideLayer) return;
  guideLayer.clearLayers();
  mapPlaces.forEach((place) => {
    const name = currentLanguage === "en" ? place.nameEn : place.name;
    const description = currentLanguage === "en" ? place.descriptionEn : place.description;
    const article = place.article ? ` <a class="map-popup-link" href="./articles.html#article-${place.article}">${currentLanguage === "en" ? "Read more" : "Подробнее"}</a>` : "";
    const imageAlt = escapeHtml(name);
    const popup = `<div class="map-guide-popup"><img src="${place.image}" alt="${imageAlt}" loading="lazy" referrerpolicy="no-referrer" onerror="this.hidden=true"><strong>${escapeHtml(name)}</strong><p>${escapeHtml(description)}</p>${article}</div>`;
    L.marker([place.lat, place.lon], { icon: createGuideIcon(place.type), keyboard: true, title: name })
      .bindPopup(popup, { maxWidth: 240 })
      .addTo(guideLayer);
  });
};

window.createGuideIcon = function createGuideIcon(type) {
  const symbols = { metro: "M", park: "✦", sight: "•" };
  return L.divIcon({
    className: `map-guide-marker map-guide-marker--${type}`,
    html: `<span aria-hidden="true">${symbols[type] || "•"}</span>`,
    iconSize: [24, 24],
    iconAnchor: [12, 12],
    popupAnchor: [0, -12],
  });
};
