function installIcons() {
  document.querySelectorAll(".icon").forEach((icon) => { const key = [...icon.classList].find((name) => name.startsWith("icon-"))?.slice(5); if (key) icon.innerHTML = `<svg aria-hidden="true"><use href="#icon-${key}"></use></svg>`; });
}

function initMapControls() {
  installIcons();
  document.querySelectorAll("[data-distance-option]").forEach((button) => button.addEventListener("click", () => { elements.distance.value = button.dataset.distanceOption; syncCustomDistance(); markSettingsChanged(); }));
  document.querySelector("[data-map-action=layers]")?.addEventListener("click", () => { const panel = document.querySelector("#mapLayersPanel"); if (panel) panel.hidden = !panel.hidden; });
  document.querySelectorAll("[data-map-action]").forEach((button) => button.addEventListener("click", () => handleMapAction(button.dataset.mapAction)));
  document.querySelectorAll("[data-layer-filter]").forEach((input) => input.addEventListener("change", () => handleLayerChange(input.dataset.layerFilter, input.checked)));
  elements.plannerToggle = document.querySelector("#plannerToggle");
  elements.plannerToggle?.addEventListener("click", togglePlanner);
}

function handleMapAction(action) {
  if (!map) return;
  if (action === "zoom-in") map.zoomIn();
  if (action === "zoom-out") map.zoomOut();
  if (action === "fit" && currentRoute.length) map.fitBounds(L.latLngBounds(currentRoute.map((stop) => [stop.lat, stop.lon])), { padding: [44, 44], maxZoom: 16 });
  if (action === "locate") requestUserLocation();
}

function handleLayerChange(type, enabled) {
  if (type === "route") { if (enabled && currentRoute.length) renderLeafletRoute(currentRoute, currentWalkingLine); else markersLayer?.clearLayers(); }
  else if (window.mapGuideFilters) { window.mapGuideFilters[type] = enabled; window.renderMapGuide?.(); }
}

function togglePlanner() {
  const planner = document.querySelector(".planner");
  const collapsed = planner?.classList.toggle("is-collapsed");
  elements.plannerToggle?.setAttribute("aria-expanded", String(!collapsed));
  elements.plannerToggle?.setAttribute("data-i18n", collapsed ? "expandPanel" : "collapsePanel");
  if (elements.plannerToggle) elements.plannerToggle.textContent = t(collapsed ? "expandPanel" : "collapsePanel");
  setTimeout(() => map?.invalidateSize(), 180);
}
