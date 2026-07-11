/* Optimizes the stop order using OSRM's pedestrian-network trip service. */
(() => {
  function routeServiceUrl(baseUrl, service) {
    return baseUrl.replace("/route/v1/foot/", `/${service}/v1/foot/`);
  }

  function walkingRouteFromResponse(data) {
    const walkingRoute = data.trips?.[0];
    if (!walkingRoute?.geometry?.coordinates?.length) return null;
    return {
      distanceKm: walkingRoute.distance / 1000,
      durationMin: Math.max(1, Math.round(walkingRoute.duration / 60)),
      coordinates: walkingRoute.geometry.coordinates.map(([lon, lat]) => [lat, lon]),
    };
  }

  function orderedStopsFromTrip(stops, waypoints) {
    if (!Array.isArray(waypoints) || waypoints.length !== stops.length) return null;
    const ordered = waypoints
      .map((waypoint, index) => ({ stop: stops[index], order: waypoint.waypoint_index }))
      .filter(({ order }) => Number.isInteger(order))
      .sort((a, b) => a.order - b.order)
      .map(({ stop }) => stop);
    if (ordered.length !== stops.length || ordered[0]?.id !== stops[0]?.id) return null;
    return ordered;
  }

  window.requestOptimizedWalkingRoute = async (stops) => {
    const coords = stops.map((stop) => `${stop.lon},${stop.lat}`).join(";");
    const params = new URLSearchParams({
      roundtrip: "false",
      source: "first",
      destination: "any",
      overview: "full",
      geometries: "geojson",
      steps: "false",
    });
    for (const baseUrl of OSRM_FOOT_URLS) {
      try {
        const response = await requestPublicService("osrm", `${routeServiceUrl(baseUrl, "trip")}${coords}?${params.toString()}`);
        if (!response.ok) continue;
        const data = await response.json();
        const walking = walkingRouteFromResponse(data);
        const orderedStops = orderedStopsFromTrip(stops, data.waypoints);
        if (data.code && data.code !== "Ok") continue;
        if (!walking || !orderedStops) continue;
        return { stops: orderedStops, walking };
      } catch (error) {
        console.warn("Не удалось оптимизировать порядок точек по пешеходной сети", error);
      }
    }
    return null;
  };
})();
