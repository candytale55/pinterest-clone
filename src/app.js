import { createGallery } from "./components/gallery/Gallery.js";
import { fetchImages, isUnsplashConfigured } from "./services/unsplashApi.js";
import { getCurrentPage, resetCurrentPage } from "./state/galleryState.js";

export function startApp() {
  const galleryRoot = document.getElementById("gallery-root");
  const searchInput = document.getElementById("search-box");
  const appLogo = document.querySelector("[data-app-logo]");

  const gallery = createGallery();

  galleryRoot.replaceChildren(gallery.element);

  searchInput.addEventListener("keydown", async (event) => {
    if (event.key !== "Enter") {
      return;
    }

    event.preventDefault();
    await handleSearch(searchInput.value.trim());
    searchInput.value = "";
  });

  appLogo.addEventListener("click", async (event) => {
    event.preventDefault();
    searchInput.value = "";
    await handleReset();
  });

  // Call fetchImages on page load to display initial set of images.
  document.addEventListener("DOMContentLoaded", async () => {
    if (isUnsplashConfigured()) { // Only fetch if there's an API Key present.
      // Calling fetchImages() with no arguments will trigger the 'general photos' endpoint.
      const imageData = await fetchImages(); // Call with 'latest' explicitly for initial load.
      gallery.renderImages(imageData);
    } else {
      console.error("Cannot fetch images: Unsplash API Key is missing");
    }
  });

  /* Search action used by the static header in index.html. */
  async function handleSearch(query) {
    if (isUnsplashConfigured()) {
      resetCurrentPage(); // Reset currentPage to 1 (important for future pagination).

      if (query) { // Only search if the query is not empty.
        console.log(`Performing search for: ${query}`);
        const searchResults = await fetchImages(query, getCurrentPage());
        gallery.renderImages(searchResults); // Display the new search results.
        return;
      }

      console.log("Search is empty, fetching latest photos"); // TODO: REMOVE after testing.
      const latestPhotos = await fetchImages("latest", getCurrentPage());
      gallery.renderImages(latestPhotos);
    } else {
      console.log("Cannot perform search: Unsplash Access Key is missing.");
    }
  }

  // App logo action passed to the Header component (reset to initial state).
  async function handleReset() {
    console.log("Logo clicked. Resetting to initial state (latest photos)"); // TODO: REMOVE after testing.

    if (!isUnsplashConfigured()) {
      console.error("Cannot reset to initial state: Unsplash Access Key is missing.");
      return;
    }

    resetCurrentPage(); // Reset page for initial load.
    const latestPhotos = await fetchImages("latest", getCurrentPage());
    gallery.renderImages(latestPhotos);
  }
}
