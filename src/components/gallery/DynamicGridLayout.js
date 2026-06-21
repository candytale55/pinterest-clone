/* ======================= */
/* ====  Dynamic Grid ==== */
/* ======================= */

export function createDynamicGridLayout(galleryElement) {
  function recalculateLayout() {
    const galleryStyles = window.getComputedStyle(galleryElement);
    const rowHeight = parseFloat(galleryStyles.getPropertyValue("grid-auto-rows"));
    const rowGap = parseFloat(galleryStyles.getPropertyValue("row-gap"));

    if (!rowHeight || Number.isNaN(rowHeight)) {
      return;
    }

    const galleryItems = galleryElement.querySelectorAll(".gallery-item");

    galleryItems.forEach((item) => {
      const itemHeight = item.getBoundingClientRect().height;
      const rowSpan = Math.ceil((itemHeight + rowGap) / (rowHeight + rowGap));
      item.style.gridRowEnd = `span ${rowSpan}`;
    });
  }

  window.addEventListener("resize", recalculateLayout);

  function destroy() {
    // Remove the global listener when the gallery is unmounted so stale callbacks cannot accumulate.
    window.removeEventListener("resize", recalculateLayout);
  }

  return {
    recalculateLayout,
    destroy
  };
}
