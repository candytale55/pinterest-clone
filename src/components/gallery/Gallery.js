import { createPinCard } from "../pin-card/PinCard.js";
import { createDynamicGridLayout } from "./DynamicGridLayout.js";

export function createGallery() {
  const element = document.createElement("main");
  element.classList.add("gallery-container");
  element.id = "image-gallery";

  const dynamicGridLayout = createDynamicGridLayout(element);

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
        onImageLoad: dynamicGridLayout.recalculateLayout
      });

      // Append the gallery item to the fragment instead of directly to the gallery.
      fragment.appendChild(galleryItem);
    });

    // Append all gallery items to the DOM at once for better performance.
    element.appendChild(fragment);

    // After all images are in the DOM, adjust their row spans.
    dynamicGridLayout.recalculateLayout();

    console.log("Images displayed in the gallery"); // TODO: Remove after testing.
  }

  return {
    element,
    renderImages,
    destroy: dynamicGridLayout.destroy
  };
}
