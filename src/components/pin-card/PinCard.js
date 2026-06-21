/** Composes each Unsplash result from its image, overlay and author details. */

import { createPinOverlay } from "./PinOverlay.js";
import { createUserInfo } from "./UserInfo.js";

/**
 * Creates a responsive pin image with appropriate loading priority.
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
  img.decoding = "async";
  img.loading = prioritizeImage ? "eager" : "lazy";

  if (prioritizeImage) {
    img.fetchPriority = "high";
  }

  if (onImageLoad) {
    img.addEventListener("load", onImageLoad);
  }

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
