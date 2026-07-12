if ("serviceWorker" in navigator) {
  const showUpdate = (registration) => {
    if (document.querySelector("[data-sw-update]")) return;
    const notice = document.createElement("div");
    notice.dataset.swUpdate = "true";
    notice.setAttribute("role", "status");
    notice.className = "sw-update-notice";
    notice.append(document.createTextNode("Доступна новая версия "));
    const updateButton = document.createElement("button");
    updateButton.type = "button";
    updateButton.textContent = "Обновить";
    updateButton.className = "sw-update-notice__button";
    updateButton.addEventListener("click", () => registration.waiting?.postMessage({ type: "SKIP_WAITING" }));
    notice.append(updateButton);
    document.body.append(notice);
  };
  window.addEventListener("load", async () => {
    try {
      const registration = await navigator.serviceWorker.register("./sw.js", { updateViaCache: "none" });
      await registration.update();
      if (registration.waiting) showUpdate(registration);
      registration.addEventListener("updatefound", () => {
        registration.installing?.addEventListener("statechange", () => {
          if (registration.waiting) showUpdate(registration);
        });
      });
    } catch (error) {
      // The site remains usable when service workers are unavailable.
    }
  });
}
