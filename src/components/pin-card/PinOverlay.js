import cameraIconUrl from "../../assets/images/camera-icon.svg";
import heartIconUrl from "../../assets/images/heart-icon.svg";
import { createCounterElement } from "./Counter.js";

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

function createCounter(iconUrl, count, positionClass) {
  const counter = createCounterElement(iconUrl, count ?? 0);
  counter.classList.add(positionClass);
  return counter;
}

/* Uses users.total_photos to use a value that is readily available, unlike downloads or views which may require additional API calls = KAPUT Unsplash Limit */
export function createPinOverlay(image) {
  const overlay = document.createElement("div");
  overlay.classList.add("gallery-item-image-overlay");

  const actions = document.createElement("div");
  actions.classList.add("gallery-item-top-overlay");
  actions.append(
    createCounter(cameraIconUrl, image.user.total_photos, "counter-left"),
    createCounter(heartIconUrl, image.likes, "counter-right"),
    createVisitLink(image)
  );

  overlay.appendChild(actions);
  return overlay;
}
