function installIcons() {
  document.querySelectorAll(".icon").forEach((icon) => { const key = [...icon.classList].find((name) => name.startsWith("icon-"))?.slice(5); if (key) icon.innerHTML = `<svg aria-hidden="true"><use href="#icon-${key}"></use></svg>`; });
}

function initMapControls() {
  installIcons();
  document.querySelector("#editSettingsButton")?.addEventListener("click", showPlanner);
  document.querySelectorAll("[data-distance-option]").forEach((button) => button.addEventListener("click", () => { elements.distance.value = button.dataset.distanceOption; syncCustomDistance(); markSettingsChanged(); }));
  const layersButton = document.querySelector("[data-map-action=layers]");
  const layersPanel = document.querySelector("#mapLayersPanel");
  const setLayersOpen = (isOpen) => {
    if (!layersPanel || !layersButton) return;
    layersPanel.hidden = !isOpen;
    layersButton.setAttribute("aria-expanded", String(isOpen));
  };
  layersButton?.addEventListener("click", () => setLayersOpen(layersPanel?.hidden));
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !layersPanel?.hidden) {
      setLayersOpen(false);
      layersButton?.focus();
    }
  });
  document.querySelectorAll("[data-map-action]").forEach((button) => button.addEventListener("click", () => handleMapAction(button.dataset.mapAction)));
  document.querySelectorAll("[data-layer-filter]").forEach((input) => input.addEventListener("change", () => handleLayerChange(input.dataset.layerFilter, input.checked)));
}

function showPlanner() {
  document.body.classList.remove("has-route");
  const planner = document.querySelector("#routePlanner");
  planner?.scrollTo({ top: 0, behavior: "auto" });
  planner?.focus({ preventScroll: true });
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
