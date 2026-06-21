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
