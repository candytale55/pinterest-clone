/** Composes each Unsplash result from its image, overlay and author details. */

/* https://developer.mozilla.org/en-US/docs/Web/API/HTMLImageElement/decoding */
/* https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Attributes/fetchpriority */

import { createPinOverlay } from "./PinOverlay.js";
import { createUserInfo } from "./UserInfo.js";

/**
 * Creates an HTML <img> element for one Pinterest-style card/pin
 * @param {Object} image - Unsplash photo record.
 * @param {{onImageLoad?: Function, prioritizeImage: boolean}} options
 * @returns {HTMLImageElement}
 */
function createPinImage(image, { onImageLoad, prioritizeImage }) {
  const img = document.createElement("img");
  img.src = image.urls.small;
  img.alt = image.alt_description || "Unsplash Image";
  img.width = image.width;
  img.height = image.height;
  img.decoding = "async";  // Async to avoid blocking other content updates
  img.loading = prioritizeImage ? "eager" : "lazy";  // Will load faster high priority images, lazy-load the rest

  if (prioritizeImage) {
    img.fetchPriority = "high";
  } // Images near the top of the page, esp. if visible immediately

  if (onImageLoad) {
    img.addEventListener("load", onImageLoad);
  } // Add a listener to recalculate the layout when the image has loaded

  return img;
}

/**
 * Builds a complete gallery card for an Unsplash photo.
 * @param {Object} image - Unsplash photo record.
 * @param {{onImageLoad?: Function, prioritizeImage?: boolean}} options
 * @returns {HTMLDivElement}
 */
export function createPinCard(image, { onImageLoad, prioritizeImage = false } = {}) {
  const galleryItem = document.createElement("div");
  galleryItem.classList.add("gallery-item");

  const imageWrapper = document.createElement("div");
  imageWrapper.classList.add("gallery-image-wrapper");
  imageWrapper.append(
    createPinImage(image, { onImageLoad, prioritizeImage }),
    createPinOverlay(image)
  );

  galleryItem.append(imageWrapper, createUserInfo(image));

  return galleryItem;
}
