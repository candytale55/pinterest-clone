import cameraIconUrl from "../../assets/images/camera-icon.svg";
import heartIconUrl from "../../assets/images/heart-icon.svg";
import downloadIconUrl from "../../assets/images/download-icon.svg";
import { createCounterElement } from "./Counter.js";
import { getNextProfileColor } from "../../utils/profileColors.js";

export function createPinCard(image, { onImageLoad }) {
  // --- 1. Create main gallery-item container ---

  // Each image post unit will be a gallery-item, containing the image and all its associated information (counters, photographer info, etc.).
  const galleryItem = document.createElement("div");
  galleryItem.classList.add("gallery-item");

  // --- 2. Create gallery-image-wrapper, <img> element and overlay ---

  // This contains the image and its overlay so the overlay can be positioned above the image without affecting the card layout.
  const galleryImageWrapper = document.createElement("div");
  galleryImageWrapper.classList.add("gallery-image-wrapper");

  // Create <img> element and append to the gallery item wrapper.
  const img = document.createElement("img");
  img.src = image.urls.small; // Preview size.
  img.alt = image.alt_description || "Unsplash Image"; // Fallback alt text.
  img.loading = "lazy"; // For performance improvement (lazy-loading).
  img.addEventListener("load", onImageLoad);
  galleryImageWrapper.appendChild(img);

  /* --- --- --- --- --- */

  // Main overlay container for all elements.
  // Purpose: cover the image and manage the elements that appear when the card is hovered or focused.
  const imageOverlay = document.createElement("div");
  imageOverlay.classList.add("gallery-item-image-overlay");

  // Create the TOP section of the overlay.
  // This sub-container holds the camera counter, heart counter, and the "Visitar" button.
  const topOverlay = document.createElement("div");
  topOverlay.classList.add("gallery-item-top-overlay");

  // Create counters. Random numbers for now.
  // TODO: Use views from API for one of the counters later.

  // Camera counter.
  const cameraCounter = createCounterElement(cameraIconUrl, Math.floor(Math.random() * 1000));
  cameraCounter.classList.add("camera-counter", "counter-left");
  /* TODO: Maybe remove some of the classes. */

  // Heart counter.
  const heartCounter = createCounterElement(heartIconUrl, Math.floor(Math.random() * 1000));
  heartCounter.classList.add("heart-counter", "counter-right");
  /* TODO: Maybe remove some of the classes. */

  // Visit button (link to Unsplash page for the image).
  const visitButton = document.createElement("a");
  visitButton.href = image.links.html;
  visitButton.target = "_blank";
  visitButton.rel = "noopener noreferrer";
  visitButton.textContent = "Visitar";
  visitButton.classList.add("btn", "btn-pill", "btn-cta", "btn-visit");
  visitButton.setAttribute("aria-label", `Visit Unsplash page for image by ${image.user.name}`);

  // Append counters and visit button to the top overlay.
  topOverlay.appendChild(cameraCounter);
  topOverlay.appendChild(heartCounter);
  topOverlay.appendChild(visitButton);
  imageOverlay.appendChild(topOverlay);

  // Keep the overlay inside the image wrapper so it sits above the image.
  galleryImageWrapper.appendChild(imageOverlay);
  galleryItem.appendChild(galleryImageWrapper);

  /* --- --- --- --- --- */

  // Create the BOTTOM section.
  // This contains the user profile and date information and sits below the image.
  const galleryInfoSection = document.createElement("div");
  galleryInfoSection.classList.add("gallery-item-bottom-info-section");

  // User Profile Link wraps the profile picture and links to the photographer's Unsplash profile.
  const userProfileLink = document.createElement("a");
  userProfileLink.href = image.user.links.html;
  userProfileLink.target = "_blank";
  userProfileLink.rel = "noopener noreferrer";
  userProfileLink.setAttribute("aria-label", `Visit Unsplash profile of photographer ${image.user.name}`);
  userProfileLink.classList.add("user-profile-link");

  // User Profile Photo (circular, centered below the image).
  const userProfilePhoto = document.createElement("div");
  userProfilePhoto.classList.add("gallery-user-photo");
  userProfilePhoto.style.backgroundImage = `url(${image.user.profile_image.medium})`;

  // Use the next shared palette color, preserving the gallery's repeating order.
  userProfilePhoto.style.borderColor = getNextProfileColor();

  userProfileLink.appendChild(userProfilePhoto);

  /* User Info Container (name and date). */
  const userProfileName = document.createElement("p");
  userProfileName.classList.add("user-profile-name");
  userProfileName.textContent = image.user.name;
  userProfileName.setAttribute("aria-label", `Photographer: ${image.user.name}`);

  // Date container (contains download icon + date text).
  const imageDateContainer = document.createElement("div");
  imageDateContainer.classList.add("image-date-container");

  /* Download icon. */
  const downloadIcon = document.createElement("img");
  downloadIcon.src = downloadIconUrl;
  downloadIcon.alt = ""; // Decorative icon, so alt is empty.
  downloadIcon.ariaHidden = "true"; // Hide from screen readers.
  downloadIcon.classList.add("download-icon");

  /* Image date - formatted. */
  const imageDate = document.createElement("span");
  const dateObj = new Date(image.created_at);
  imageDate.textContent = dateObj.toLocaleDateString();
  imageDate.classList.add("gallery-image-date");

  imageDateContainer.appendChild(downloadIcon);
  imageDateContainer.appendChild(imageDate);

  /* Append elements to the user info container galleryInfoSection. */
  galleryInfoSection.appendChild(userProfileLink);
  galleryInfoSection.appendChild(userProfileName);
  galleryInfoSection.appendChild(imageDateContainer);

  /* Append the user info section to the gallery item. */
  galleryItem.appendChild(galleryInfoSection);

  return galleryItem;
}
