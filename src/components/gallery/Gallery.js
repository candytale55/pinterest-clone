/**
* Builds and manages the image gallery for the Pinterest-style grid.
* This module creates the main gallery element, shows skeleton loading cards
* while images are being fetched, and renders Unsplash image records as pin cards.
* It either replaces the current results for a new search or appends more cards
* for pagination/infinite scroll.
* It also connects the gallery to the dynamic grid layout so card heights
* are recalculated after images load or the layout changes, helping
* variable-height cards fit together cleanly.
*/

/* https://developer.mozilla.org/es/docs/Web/API/Document/createDocumentFragment */
/* https://developer.mozilla.org/en-US/docs/Web/API/Element/replaceChildren */
/* https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Attributes/aria-busy */

import { createPinCard } from "../pin-card/PinCard.js";
import { createDynamicGridLayout } from "./DynamicGridLayout.js";

// DynamicGridLayout is a layout controller that recalculates each card's row span from its rendered height.

const SKELETON_COUNT = 8; // Gray loading cards you see before the real images arrive.
const PRIORITY_IMAGE_COUNT = 4; // Prioritize roughly the first desktop row.

/**
 * Creates a gallery controller with rendering, loading and cleanup operations.
 * Creates the HTML element and returns functions to manage the gallery.
 * @returns {{element: HTMLElement, renderImages: Function, showLoading: Function, destroy: Function}}
 */
export function createGallery() {
  const element = document.createElement("main");
  element.classList.add("gallery-container");
  element.id = "image-gallery";

  const dynamicGridLayout = createDynamicGridLayout(element);
  /* This connects the gallery element to the dynamic grid layout logic. */

  /**
   * Renders image records as cards, replacing or extending existing results.
   * @param {Array} images - Unsplash photo records.
   * @param {{append?: boolean}} options - Whether to preserve existing cards.
   * append: false → clear the gallery first
   * append: true  → keep the existing cards
   */
  function renderImages(images, { append = false } = {}) {
    if (!append) {
      element.replaceChildren();
    }
    

    // Tell assistive technology that the loading operation has completed.
    // Prevents assistive technologies from announcing changes before updates are done.
    element.setAttribute("aria-busy", "false");

    if (images.length === 0) {
      console.log("No images to display");
      return;
    }

    /**
     * Create all the pin cards first, store them in the fragment, 
     * and then add them all to the gallery in one operation.
     */
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

  /** Replaces current content with skeleton cards while a request is pending. */
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
