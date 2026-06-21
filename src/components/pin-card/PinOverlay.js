/** Builds the hover/focus actions layered over each pin image. */

import cameraIconUrl from "../../assets/images/camera-icon.svg";
import heartIconUrl from "../../assets/images/heart-icon.svg";
import { createCounterElement } from "./Counter.js";

/**
 * Creates the external link to the photo's Unsplash page.
 * @param {Object} image - Unsplash photo record.
 * @returns {HTMLAnchorElement}
 */
function createVisitLink(image) {
  const visitLink = document.createElement("a");
  visitLink.href = image.links.html;
  visitLink.target = "_blank";
  visitLink.rel = "noopener noreferrer";
  visitLink.textContent = "Visitar";
  visitLink.classList.add("btn", "btn-pill", "btn-cta", "btn-visit");
  visitLink.setAttribute(
    "aria-label",
    `Visit Unsplash page for image by ${image.user.name}`
  );

  return visitLink;
}

/**
 * Creates and positions one overlay counter.
 * @param {string} iconUrl - Counter icon asset URL.
 * @param {number|null|undefined} count - Value supplied by Unsplash.
 * @param {string} positionClass - CSS class controlling horizontal placement.
 * @returns {HTMLDivElement}
 */
function createCounter(iconUrl, count, positionClass) {
  const counter = createCounterElement(iconUrl, count ?? 0);
  counter.classList.add(positionClass);
  return counter;
}
 
/**
 * Builds the action overlay for a photo card.
 * @param {Object} image - Unsplash photo record used for links and counters.
 * @returns {HTMLDivElement}
 */
export function createPinOverlay(image) {
  const overlay = document.createElement("div");
  overlay.classList.add("gallery-item-image-overlay");

  const actions = document.createElement("div");
  actions.classList.add("gallery-item-top-overlay");
  actions.append(
    // total_photos is available in this response; downloads/views need another API call.
    createCounter(cameraIconUrl, image.user.total_photos, "counter-left"),
    createCounter(heartIconUrl, image.likes, "counter-right"),
    createVisitLink(image)
  );

  overlay.appendChild(actions);
  return overlay;
}
