/* Function to create a counter element with an icon and count. */
export function createCounterElement(iconPath, count) {
  const counterWrapper = document.createElement("div");
  counterWrapper.classList.add("counter-wrapper");
  counterWrapper.setAttribute("aria-label", `Counter with ${count} items`); // Accessibility label.

  const icon = document.createElement("img");
  icon.src = iconPath;
  icon.alt = ""; // Decorative icon, so alt is empty.
  icon.ariaHidden = "true"; // Hide from screen readers.
  icon.classList.add("counter-icon");

  const counterText = document.createElement("p");
  counterText.textContent = count;
  counterText.classList.add("counter-text");

  counterWrapper.appendChild(icon);
  counterWrapper.appendChild(counterText);

  return counterWrapper;
}
