import { createPinCard } from "../pin-card/PinCard.js";

export function createGallery() {
  const element = document.createElement("main");
  element.classList.add("gallery-container");
  element.id = "image-gallery";

  function renderImages(images) {
    // Clear existing images before displaying new ones.
    // TODO: Important later on when adding search, load more, etc. PLEASE EXPLAIN WHY THIS IS IMPORTANT AND HOW IT WORKS (removing old images before adding new ones).
    while (element.firstChild) {
      element.removeChild(element.firstChild);
    }

    if (images.length === 0) {
      console.log("No images to display");
      // TODO: Fix message later.
      return;
    }

    // Create a document fragment to append all items, then add to DOM once.
    const fragment = document.createDocumentFragment();

    images.forEach((image) => {
      const galleryItem = createPinCard(image, {
        onImageLoad: adjustGalleryItemRowSpans
      });

      // Append the gallery item to the fragment instead of directly to the gallery.
      fragment.appendChild(galleryItem);
    });

    // Append all gallery items to the DOM at once for better performance.
    element.appendChild(fragment);

    // After all images are in the DOM, adjust their row spans.
    adjustGalleryItemRowSpans();

    console.log("Images displayed in the gallery"); // TODO: Remove after testing.
  }

  /* ======================= */
  /* ====  Dynamic Grid ==== */
  /* ======================= */

  // New function to adjust row spans for masonry layout.
  function adjustGalleryItemRowSpans() {
    const galleryStyles = window.getComputedStyle(element);
    const rowHeight = parseFloat(galleryStyles.getPropertyValue("grid-auto-rows"));
    const rowGap = parseFloat(galleryStyles.getPropertyValue("row-gap"));

    if (!rowHeight || Number.isNaN(rowHeight)) {
      return;
    }

    const galleryItems = element.querySelectorAll(".gallery-item");

    galleryItems.forEach((item) => {
      const itemHeight = item.getBoundingClientRect().height;
      const rowSpan = Math.ceil((itemHeight + rowGap) / (rowHeight + rowGap));
      item.style.gridRowEnd = `span ${rowSpan}`;
    });

    console.log("Adjusted gallery item row spans for masonry layout"); // TODO: Remove after testing.
  }

  window.addEventListener("resize", adjustGalleryItemRowSpans);

  return {
    element,
    renderImages
  };
}
