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

function createCounter(iconUrl, positionClass) {
  const counter = createCounterElement(
    iconUrl,
    Math.floor(Math.random() * 1000)
  );
  counter.classList.add(positionClass);
  return counter;
}

export function createPinOverlay(image) {
  const overlay = document.createElement("div");
  overlay.classList.add("gallery-item-image-overlay");

  const actions = document.createElement("div");
  actions.classList.add("gallery-item-top-overlay");
  actions.append(
    createCounter(cameraIconUrl, "counter-left"),
    createCounter(heartIconUrl, "counter-right"),
    createVisitLink(image)
  );

  overlay.appendChild(actions);
  return overlay;
}
