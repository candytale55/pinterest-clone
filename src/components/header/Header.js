/**
 * Builds the application header mounted by app.js into index.html.
 */

import pintrestLogo from "../../assets/images/pintrest-logo.png";
import searchIcon from "../../assets/images/search-icon.png";
import bellSvg from "../../assets/images/bell-svg.svg";
import blurbSvg from "../../assets/images/blurb-svg.svg";


/**
 * Creates an image with optional presentation and accessibility attributes.
 * @param {{src: string, alt?: string, className?: string, ariaHidden?: boolean}} options
 * @returns {HTMLImageElement}
 */
function createImage({ src, alt = "", className, ariaHidden = false }) {
  const image = document.createElement("img");
  image.src = src;
  image.alt = alt;

  if (className) {
    image.className = className;
  }

  if (ariaHidden) {
    image.setAttribute("aria-hidden", "true");
  }

  return image;
}

/**
 * Creates a text navigation link.
 * @param {{text: string, className: string, href?: string}} options
 * @returns {HTMLAnchorElement}
 */
function createLink({ text, className, href = "#header" }) {
  const link = document.createElement("a");
  link.href = href;
  link.className = className;
  link.textContent = text;
  return link;
}

/**
 * Creates an icon-only header link with an accessible label.
 * @param {string} src - Icon asset URL.
 * @param {string} label - Accessible link description.
 * @returns {HTMLAnchorElement}
 */
function createIconLink(src, label) {
  const link = document.createElement("a");
  link.href = "#header";
  link.className = "icon-button";
  link.setAttribute("aria-label", label);
  link.append(createImage({ src, ariaHidden: true }));
  return link;
}

/**
 * Builds the complete header and connects its search and reset actions.
 * @param {{onSearch: Function, onReset: Function}} callbacks
 * @returns {HTMLElement} The configured header element.
 */
export function createHeader({ onSearch, onReset }) {
  const header = document.createElement("header");
  header.className = "header";
  header.id = "header";

  const headerLeft = document.createElement("div");
  headerLeft.className = "header-left";

  const appLogo = document.createElement("a");
  appLogo.href = "#";
  appLogo.className = "logo";
  appLogo.dataset.appLogo = "";
  appLogo.setAttribute("aria-label", "Gallery Home");
  appLogo.append(createImage({ src: pintrestLogo, alt: "Pinterest" }));

  const nav = document.createElement("nav");
  nav.className = "main-nav";
  nav.setAttribute("aria-label", "Navegación principal");

  const navList = document.createElement("ul");
  const navItems = [
    ["Inicio", "btn btn-pill btn-dark"],
    ["Explorar", "btn btn-pill"],
    ["Crear", "btn btn-pill"]
  ];

  navItems.forEach(([text, className]) => {
    const item = document.createElement("li");
    item.append(createLink({ text, className }));
    navList.append(item);
  });

  nav.append(navList);
  headerLeft.append(appLogo, nav);

  const searchContainer = document.createElement("div");
  searchContainer.className = "search-container";

  const searchLabel = document.createElement("label");
  searchLabel.htmlFor = "search-box";
  searchLabel.className = "sr-only";
  searchLabel.textContent = "Buscar en galería";

  const searchWrapper = document.createElement("div");
  searchWrapper.className = "search-input-wrapper";
  searchWrapper.append(createImage({
    src: searchIcon,
    className: "search-icon",
    ariaHidden: true
  }));

  const searchInput = document.createElement("input");
  searchInput.type = "search";
  searchInput.id = "search-box";
  searchInput.className = "search-input";
  searchInput.placeholder = "Buscar";
  searchWrapper.append(searchInput);
  searchContainer.append(searchLabel, searchWrapper);

  const headerRight = document.createElement("div");
  headerRight.className = "header-right";
  headerRight.append(
    createIconLink(bellSvg, "Ver notificaciones"),
    createIconLink(blurbSvg, "Abrir mensajes")
  );

  const profile = document.createElement("a");
  profile.href = "#header";
  profile.className = "profile-circle";
  profile.setAttribute("aria-label", "Ver perfil de usuario");

  const profileText = document.createElement("span");
  profileText.className = "profile-text";
  profileText.textContent = "CT";
  profile.append(profileText);

  header.append(headerLeft, searchContainer, headerRight, profile);

  searchInput.addEventListener("keydown", async (event) => {
    if (event.key !== "Enter") {
      return;
    }

    event.preventDefault();
    await onSearch(searchInput.value.trim());
    searchInput.value = "";
  });

  appLogo.addEventListener("click", async (event) => {
    event.preventDefault();
    searchInput.value = "";
    await onReset();
  });

  return header;
}
