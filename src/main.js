import './styles/index.css'
import { createHeader } from './components/header/Header.js'
import { createCounterElement } from './components/pin-card/Counter.js'
import { fetchImages, isUnsplashConfigured } from './services/unsplashApi.js'
import { getCurrentPage, resetCurrentPage } from './state/galleryState.js'

const imageGallery = document.getElementById("image-gallery");
const headerRoot = document.getElementById("header-root");

// Array of colors for user profile photo borders
const borderColors = [
  "var(--color-green-lime)",
  "var(--color-blue)",
  "var(--color-cyan)",
  "var(--color-green-dark)",
  "var(--color-fuchsia)",
  "var(--color-orange)",
  "var(--color-cyan)",
  "var(--color-pink-lilac)",
  "var(--color-green-mint)",
  "var(--color-green-teal)",
  "var(--color-red-primary)",
  "var(--color-fuchsia)",
  "var(--color-pink-coral)"
];
let currentColorIndex = 0;

function displayImages(images) {
  // Clear existing images before displaying new ones
  // TODO: Important later on when adding search, load more, etc. PLEASE EXPLAIN WHY THIS IS IMPORTANT AND HOW IT WORKS (removing old images before adding new ones)
  while (imageGallery.firstChild) {
    imageGallery.removeChild(imageGallery.firstChild);
  }

  if (images.length === 0) {
    console.log("No images to display");
    // TODO: Fix message later
    return;
  }

  // Create a document fragment to append all items, then add to DOM once
  const fragment = document.createDocumentFragment();

  images.forEach(image => {

    // --- 1. Create main gallery-item container ---

    // Each image post unit will be a gallery-item, containing the image and all its associated information (counters, photographer info, etc.)
    const galleryItem = document.createElement("div");
    galleryItem.classList.add("gallery-item");

    // --- 2. Create gallery-image-wrapper, <img> element and overlay ---

    // This will contain the image and its overlay (so that the overlay can be positioned absolutely on top of the image without affecting the layout of the gallery item)

    const galleryImageWrapper = document.createElement("div");
    galleryImageWrapper.classList.add("gallery-image-wrapper"); // New wrapper for the image and its overlay

    // Create <img> element and append to the gallery item wrapper
    const img = document.createElement("img");
    img.src = image.urls.small; // Preview size
    img.alt = image.alt_description || "Unsplash Image"; // Fallback alt text
    img.loading = "lazy"; // for performance improvement (lazy-loading)
    img.addEventListener("load", () => {
      adjustGalleryItemRowSpans();
    });
    galleryImageWrapper.appendChild(img);

    /* --- --- --- --- --- */

    // Main overlay container for all elements 
    // Purpose: This is the main container for everything that appears over the image when you hover. Its job is to cover the entire image area with a semi-transparent background and manage the overall show/hide (opacity, pointer-events) on hover.
    const imageOverlay = document.createElement("div");
    imageOverlay.classList.add("gallery-item-image-overlay");


    //  Create the TOP section of the overlay
    // This is a sub-container within itemOverlay specifically designed to hold and lay out the elements that need to appear at the top of the image (the camera counter, heart counter, and the "Visitar" button).
    const topOverlay = document.createElement("div");
    topOverlay.classList.add("gallery-item-top-overlay");

    // Create counters. Random numbers for now .
    // TODO: Use views from API for one of the counters later.

    // Camera counter
    const cameraCounter = createCounterElement("./src/assets/images/camera-icon.svg", Math.floor(Math.random() * 1000));
    cameraCounter.classList.add("camera-counter", "counter-left");
    /* //TODO: Maybe remove some of the classes */

    // Heart counter
    const heartCounter = createCounterElement("./src/assets/images/heart-icon.svg", Math.floor(Math.random() * 1000));
    heartCounter.classList.add("heart-counter", "counter-right");
    /* //TODO: Maybe remove some of the classes */

    // Visit button (link to Unsplash page for the image)
    const visitButton = document.createElement("a");
    visitButton.href = image.links.html; // Link to the image's Unsplash page
    visitButton.target = "_blank"; // Open in new tab
    visitButton.textContent = "Visitar"; // Button text
    visitButton.classList.add("btn", "btn-pill", "btn-cta", "btn-visit"); // Add button classes for styling
    visitButton.setAttribute("aria-label", `Visit Unsplash page for image by ${image.user.name}`); // Accessibility label

    // Append counters to the top overlay
    topOverlay.appendChild(cameraCounter);
    topOverlay.appendChild(heartCounter);
    topOverlay.appendChild(visitButton); // Add visit button to the top overlay

    /* Add top overlay to the image overlay (main container for all overlay elements) */
    imageOverlay.appendChild(topOverlay);


    /* --- --- --- --- --- */


    // Keep the overlay inside the image wrapper so it sits above the image.
    galleryImageWrapper.appendChild(imageOverlay);
    galleryItem.appendChild(galleryImageWrapper); // Add the wrapper to the gallery item


    /* --- --- --- --- --- */

    // Create the BOTTOM section
    // This will contain the user profile and date information, and sits below the image
    const galleryInfoSection = document.createElement("div");
    galleryInfoSection.classList.add("gallery-item-bottom-info-section");

    // User Profile Link (wraps the profile picture so that if you click on the profile picture, it takes you to the photographer's Unsplash profile)
    const userProfileLink = document.createElement("a");
    userProfileLink.href = image.user.links.html; // Link to photographer's Unsplash profile
    userProfileLink.target = "_blank"; // Open in new tab
    userProfileLink.rel = "noopener noreferrer"; // Security best practice for external links
    userProfileLink.setAttribute("aria-label", `Visit Unsplash profile of photographer ${image.user.name}`); // Accessibility label for the link
    userProfileLink.classList.add("user-profile-link"); // Add class for styling (if needed)

    galleryInfoSection.appendChild(userProfileLink); // Add the user profile link to the bottom overlay


    // User Profile Photo (Circular, centered below the image)
    const userProfilePhoto = document.createElement("div");
    userProfilePhoto.classList.add("gallery-user-photo");
    userProfilePhoto.style.backgroundImage = `url(${image.user.profile_image.medium})`; // Photographer's profile picture

    // Apply rotating border color from the array for each profile photo
    userProfilePhoto.style.borderColor = borderColors[currentColorIndex];
    currentColorIndex = (currentColorIndex + 1) % borderColors.length;
    // TODO: Add to dev notes for future self:  The line currentColorIndex = (currentColorIndex + 1) % borderColors.length; increments currentColorIndex to select the next color. The modulo operator (%) then ensures this index remains within the array's valid bounds (0 to length - 1). When currentColorIndex + 1 equals borderColors.length (i.e., it attempts to go one past the last index), the modulo operation X % length will yield 0, effectively resetting the index to the first element and initiating the color cycle anew.

    userProfileLink.appendChild(userProfilePhoto); // Add profile picture to the user profile link

    /* --- */

    /* User Info Container (name and date) */
    const userProfileName = document.createElement("p");
    userProfileName.classList.add("user-profile-name");
    userProfileName.textContent = image.user.name; // Photographer's name
    userProfileName.setAttribute("aria-label", `Photographer: ${image.user.name}`); // Accessibility label

    /* --- */

    // Date container (contains download icon + date text)

    const imageDateContainer = document.createElement("div");
    imageDateContainer.classList.add("image-date-container");

    /* Download icon */
    const downloadIcon = document.createElement("img");
    downloadIcon.src = "./src/assets/images/download-icon.svg"; // Download icon
    downloadIcon.alt = ""; // Decorative icon, so alt is empty
    downloadIcon.ariaHidden = "true"; // Hide from screen readers
    downloadIcon.classList.add("download-icon");


    /* Image date - formatted */
    const imageDate = document.createElement("span");
    const dateObj = new Date(image.created_at);
    imageDate.textContent = dateObj.toLocaleDateString();
    imageDate.classList.add("gallery-image-date");

    imageDateContainer.appendChild(downloadIcon); // Add download icon to the date container
    imageDateContainer.appendChild(imageDate); // Add date text to the date container

    /* --- */

    /* Append elements to the user info container galleryInfoSection */

    galleryInfoSection.appendChild(userProfileLink); // Add the user profile link (with photo) to the info section

    galleryInfoSection.appendChild(userProfileName); // Add photographer's name to the bottom overlay

    galleryInfoSection.appendChild(imageDateContainer); // Add date to the bottom overlay

    /* --- */



    /* Append the user info section to the gallery item */
    galleryItem.appendChild(galleryInfoSection); // Add the bottom info section to the gallery item

    /* --- */

    // Append the gallery item to the fragment instead of directly to imageGallery
    fragment.appendChild(galleryItem);

  });

  // Append all gallery items to the DOM at once for better performance
  imageGallery.appendChild(fragment);

  // New: After all images are in the DOM, adjust their row spans
  adjustGalleryItemRowSpans();

  console.log("Images displayed in the gallery"); // TODO: Remove after testing
}

// New function to adjust row spans for masonry layout
function adjustGalleryItemRowSpans() {
  const galleryStyles = window.getComputedStyle(imageGallery);
  const rowHeight = parseFloat(galleryStyles.getPropertyValue("grid-auto-rows"));
  const rowGap = parseFloat(galleryStyles.getPropertyValue("row-gap"));

  if (!rowHeight || Number.isNaN(rowHeight)) {
    return;
  }

  const galleryItems = imageGallery.querySelectorAll(".gallery-item");

  galleryItems.forEach((item) => {
    const itemHeight = item.getBoundingClientRect().height;
    const rowSpan = Math.ceil((itemHeight + rowGap) / (rowHeight + rowGap));
    item.style.gridRowEnd = `span ${rowSpan}`;
  });

  console.log("Adjusted gallery item row spans for masonry layout"); // TODO: Remove after testing
}

window.addEventListener("resize", adjustGalleryItemRowSpans);

headerRoot.replaceChildren(createHeader({
  onSearch: handleSearch,
  onReset: handleReset
}));


// Call fetchImages on page load to display initial set of images
document.addEventListener("DOMContentLoaded", async () => {
  if (isUnsplashConfigured()) { // Only fetch if there's an API Key present

    // Calling fetchImages() with no arguments will trigger the 'general photos' endpoint

    const imageData = await fetchImages(); // Call with 'latest' explicitly for initial load
    displayImages(imageData);
  } else {
    console.error("Cannot fetch images: Unsplash API Key is missing")
  }
});

/* ======================= */
/* ====  Dynamic Grid ==== */
/* ======================= */






/* Search action passed to the Header component. */
async function handleSearch(query) {
  if (isUnsplashConfigured()) {
    resetCurrentPage(); // Reset currentPage to 1 (important for future pagination).

    if (query) { // Only search if the query is not empty.
      console.log(`Performing search for: ${query}`);
      const searchResults = await fetchImages(query, getCurrentPage());
      displayImages(searchResults); // Display the new search results.
      return;
    }

    console.log("Search is empty, fetching latest photos"); // TODO: REMOVE after testing
    const latestPhotos = await fetchImages("latest", getCurrentPage());
    displayImages(latestPhotos);
  } else {
    console.log("Cannot perform search: Unsplash Access Key is missing.");
  }
}

// App logo action passed to the Header component (reset to initial state).
async function handleReset() {
  console.log("Logo clicked. Resetting to initial state (latest photos)") // TODO: REMOVE after testing

  if (!isUnsplashConfigured()) {
    console.error("Cannot reset to initial state: Unsplash Access Key is missing.");
    return;
  }

  resetCurrentPage(); // Reset page for initial load.
  const latestPhotos = await fetchImages("latest", getCurrentPage());
  displayImages(latestPhotos);
}
