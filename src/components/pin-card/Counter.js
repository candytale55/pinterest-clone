/** Creates the compact icon-and-value counters displayed over pin images. */

/**
 * Builds a counter from an icon and display value.
 * @param {string} iconPath - Counter icon asset URL.
 * @param {number} count - Value shown beneath the icon.
 * @returns {HTMLDivElement}
 */
export function createCounterElement(iconPath, count) {
  const counterWrapper = document.createElement("div");
  counterWrapper.classList.add("counter-wrapper");
  counterWrapper.setAttribute("aria-label", `Counter with ${count} items`);

  const icon = document.createElement("img");
  icon.src = iconPath;
  icon.alt = "";
  icon.ariaHidden = "true";
  icon.classList.add("counter-icon");

  const counterText = document.createElement("p");
  counterText.textContent = count;
  counterText.classList.add("counter-text");

  counterWrapper.appendChild(icon);
  counterWrapper.appendChild(counterText);

  return counterWrapper;
}
