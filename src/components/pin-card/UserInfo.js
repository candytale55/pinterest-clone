/** Builds the photographer identity and publication details below each pin. */

import downloadIconUrl from "../../assets/images/download-icon.svg";
import { getNextProfileColor } from "../../utils/profileColors.js";

/**
 * Creates the linked photographer avatar and assigns its rotating border color.
 * @param {Object} user - Unsplash user record.
 * @returns {HTMLAnchorElement}
 */
function createProfileLink(user) {
  const profileLink = document.createElement("a");
  profileLink.href = user.links.html;
  profileLink.target = "_blank";
  profileLink.rel = "noopener noreferrer";
  profileLink.classList.add("user-profile-link");
  profileLink.setAttribute(
    "aria-label",
    `Visit Unsplash profile of photographer ${user.name}`
  );

  const profilePhoto = document.createElement("div");
  profilePhoto.classList.add("gallery-user-photo");
  profilePhoto.style.backgroundImage = `url(${user.profile_image.medium})`;
  profilePhoto.style.borderColor = getNextProfileColor();

  profileLink.appendChild(profilePhoto);
  return profileLink;
}

/**
 * Creates the photographer name label.
 * @param {string} name - Photographer display name.
 * @returns {HTMLParagraphElement}
 */
function createPhotographerName(name) {
  const photographerName = document.createElement("p");
  photographerName.classList.add("user-profile-name");
  photographerName.textContent = name;
  photographerName.setAttribute("aria-label", `Photographer: ${name}`);
  return photographerName;
}

/**
 * Creates the localized publication-date row.
 * @param {string} createdAt - Date value supplied by Unsplash.
 * @returns {HTMLDivElement}
 */
function createImageDate(createdAt) {
  const dateContainer = document.createElement("div");
  dateContainer.classList.add("image-date-container");

  const downloadIcon = document.createElement("img");
  downloadIcon.src = downloadIconUrl;
  downloadIcon.alt = "";
  downloadIcon.ariaHidden = "true";
  downloadIcon.classList.add("download-icon");

  const date = document.createElement("span");
  date.textContent = new Date(createdAt).toLocaleDateString();
  date.classList.add("gallery-image-date");

  dateContainer.append(downloadIcon, date);
  return dateContainer;
}

/**
 * Builds the author and date section for a pin card.
 * @param {Object} image - Unsplash photo record.
 * @returns {HTMLDivElement}
 */
export function createUserInfo(image) {
  const userInfo = document.createElement("div");
  userInfo.classList.add("gallery-item-bottom-info-section");
  userInfo.append(
    createProfileLink(image.user),
    createPhotographerName(image.user.name),
    createImageDate(image.created_at)
  );

  return userInfo;
}
