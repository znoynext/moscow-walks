(() => {
  function showImageFallback(image) {
    image.closest(".article-image-wrap")?.classList.add("is-broken");
    const placeholder = image.nextElementSibling;
    if (placeholder?.classList.contains("article-image-placeholder")) {
      image.hidden = true;
      placeholder.hidden = false;
    }
  }

  function isFallbackImage(target) {
    return target instanceof HTMLImageElement && target.matches("img[data-image-fallback]");
  }

  document.addEventListener("error", (event) => {
    if (isFallbackImage(event.target)) showImageFallback(event.target);
  }, true);

  document.querySelectorAll("img[data-image-fallback]").forEach((image) => {
    if (image.complete && !image.naturalWidth) showImageFallback(image);
  });
})();
