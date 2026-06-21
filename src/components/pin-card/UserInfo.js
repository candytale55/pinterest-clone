import downloadIconUrl from "../../assets/images/download-icon.svg";
import { getNextProfileColor } from "../../utils/profileColors.js";

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

function createPhotographerName(name) {
  const photographerName = document.createElement("p");
  photographerName.classList.add("user-profile-name");
  photographerName.textContent = name;
  photographerName.setAttribute("aria-label", `Photographer: ${name}`);
  return photographerName;
}

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
