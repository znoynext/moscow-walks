if ("serviceWorker" in navigator) {
  let wasControlled = Boolean(navigator.serviceWorker.controller);
  let isReloading = false;

  navigator.serviceWorker.addEventListener("controllerchange", () => {
    if (wasControlled && !isReloading) {
      isReloading = true;
      window.location.reload();
    }
    wasControlled = true;
  });

  window.addEventListener("load", async () => {
    try {
      const registration = await navigator.serviceWorker.register("./sw.js", { updateViaCache: "none" });
      await registration.update();
    } catch (error) {
      // The site remains usable when service workers are unavailable.
    }
  });
}
