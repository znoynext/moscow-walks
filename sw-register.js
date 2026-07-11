if ("serviceWorker" in navigator) {
  const showUpdate = (registration) => {
    if (document.querySelector("[data-sw-update]")) return;
    const notice = document.createElement("div");
    notice.dataset.swUpdate = "true";
    notice.setAttribute("role", "status");
    notice.style.cssText = "position:fixed;right:1rem;bottom:1rem;z-index:1000;padding:.7rem 1rem;background:#18231f;color:#fff;border-radius:999px;box-shadow:0 8px 30px #0003;font:inherit";
    notice.append(document.createTextNode("Доступна новая версия "));
    const updateButton = document.createElement("button");
    updateButton.type = "button";
    updateButton.textContent = "Обновить";
    updateButton.style.marginLeft = ".5rem";
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
