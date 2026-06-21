/** Calculates CSS Grid row spans so variable-height pin cards pack tightly. */

/**
 * Creates a layout controller bound to a gallery element and window resizing.
 * @param {HTMLElement} galleryElement - Grid container whose cards are measured.
 * @returns {{recalculateLayout: Function, destroy: Function}}
 */
export function createDynamicGridLayout(galleryElement) {
  /** Recalculates each card's row span from its rendered height. */
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
      // Include the gap in both dimensions to map pixel height onto grid tracks.
      const rowSpan = Math.ceil((itemHeight + rowGap) / (rowHeight + rowGap));
      item.style.gridRowEnd = `span ${rowSpan}`;
    });
  }

  window.addEventListener("resize", recalculateLayout);

  /** Removes the global resize listener when the gallery is discarded. */
  function destroy() {
    // Remove the global listener when the gallery is unmounted so stale callbacks cannot accumulate.
    window.removeEventListener("resize", recalculateLayout);
  }

  return {
    recalculateLayout,
    destroy
  };
}
