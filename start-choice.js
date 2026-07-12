(() => {
  const select = document.querySelector("#startSelect");
  const search = document.querySelector("#startSearch");
  const settingsStatus = document.querySelector("#settingsStatus");
  const buildButton = document.querySelector("#buildButton");
  if (!select || !search) return;

  function syncFromSearch({ markChanged = false } = {}) {
    select.selectedIndex = search.value.trim() ? -1 : 0;
    if (!markChanged) return;
    if (settingsStatus) settingsStatus.textContent = "Настройки изменены — соберите прогулку, когда будете готовы.";
    buildButton?.classList.add("is-ready");
  }

  select.addEventListener("change", () => {
    if (select.value) search.value = "";
  });
  search.addEventListener("input", () => syncFromSearch({ markChanged: true }));
  new MutationObserver(syncFromSearch).observe(select, { childList: true });
  syncFromSearch();
})();
