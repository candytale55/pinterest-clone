import { createPinCard } from "../pin-card/PinCard.js";
import { createDynamicGridLayout } from "./DynamicGridLayout.js";

const SKELETON_COUNT = 8; // Enough placeholders to fill most initial viewports.
const PRIORITY_IMAGE_COUNT = 4; // Prioritize roughly the first desktop row.

export function createGallery() {
  const element = document.createElement("main");
  element.classList.add("gallery-container");
  element.id = "image-gallery";

  const dynamicGridLayout = createDynamicGridLayout(element);

  function renderImages(images, { append = false } = {}) {
    // New searches replace the gallery; pagination keeps the current cards.
    if (!append) {
      element.replaceChildren();
    }

    // Tell assistive technology that the loading operation has completed.
    element.setAttribute("aria-busy", "false");

    if (images.length === 0) {
      console.log("No images to display");
      // TODO: Fix message later.
      return;
    }

    // Create a document fragment to append all items, then add to DOM once.
    const fragment = document.createDocumentFragment();

    images.forEach((image, index) => {
      const galleryItem = createPinCard(image, {
        onImageLoad: dynamicGridLayout.recalculateLayout,
        // Appended/off-screen results keep native lazy-loading.
        prioritizeImage: !append && index < PRIORITY_IMAGE_COUNT
      });

      // Append the gallery item to the fragment instead of directly to the gallery.
      fragment.appendChild(galleryItem);
    });

    // Append all gallery items to the DOM at once for better performance.
    element.appendChild(fragment);

    // After all images are in the DOM, adjust their row spans.
    dynamicGridLayout.recalculateLayout();
  }

  function showLoading() {
    // Build placeholders in memory, then update the DOM in one operation.
    const fragment = document.createDocumentFragment();

    for (let index = 0; index < SKELETON_COUNT; index += 1) {
      const skeleton = document.createElement("div");
      skeleton.classList.add("gallery-item", "gallery-skeleton");
      skeleton.setAttribute("aria-hidden", "true");
      skeleton.innerHTML = `
        <div class="gallery-skeleton-image"></div>
        <div class="gallery-skeleton-info">
          <span class="gallery-skeleton-avatar"></span>
          <span class="gallery-skeleton-line"></span>
          <span class="gallery-skeleton-line gallery-skeleton-line-short"></span>
        </div>
      `;
      fragment.appendChild(skeleton);
    }

    // Replacing old cards provides immediate feedback and lets the browser
    // stop obsolete image downloads from the previous results.
    element.setAttribute("aria-busy", "true");
    element.replaceChildren(fragment);
    dynamicGridLayout.recalculateLayout();
  }

  return {
    element,
    renderImages,
    showLoading,
    destroy: dynamicGridLayout.destroy
  };
}
