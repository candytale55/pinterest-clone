import { createGallery } from "./components/gallery/Gallery.js";
import { fetchImages, isUnsplashConfigured } from "./services/unsplashApi.js";
import {
  getCurrentPage,
  incrementCurrentPage,
  resetCurrentPage
} from "./state/galleryState.js";

export function startApp() {
  const galleryRoot = document.getElementById("gallery-root");
  const searchInput = document.getElementById("search-box");
  const appLogo = document.querySelector("[data-app-logo]");

  const gallery = createGallery();

  // This invisible sentinel sits after the gallery. When it approaches the
  // viewport, IntersectionObserver requests the next page of results.
  const loadMoreTrigger = document.createElement("div");
  loadMoreTrigger.classList.add("infinite-scroll-trigger");
  loadMoreTrigger.setAttribute("aria-hidden", "true");

  galleryRoot.replaceChildren(gallery.element, loadMoreTrigger);

  let activeQuery = ""; // Empty means the general "latest photos" feed.
  let isLoading = true; // Prevents the observer from starting duplicate requests.
  let hasMoreImages = true; // False after Unsplash returns an empty page.
  let requestVersion = 0; // Identifies responses from an older search.
  let activeRequestController = null; // Lets a new search cancel the current request.

  // Begin loading before the user reaches the end of the current gallery.
  const loadMoreObserver = new IntersectionObserver((entries) => {
    if (entries.some((entry) => entry.isIntersecting)) {
      void loadNextPage();
    }
  }, {
    rootMargin: "600px 0px"
  });

  loadMoreObserver.observe(loadMoreTrigger);

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
      await loadFirstPage("");
    } else {
      console.error("Cannot fetch images: Unsplash API Key is missing");
    }
  });

  /* Search action used by the static header in index.html. */
  async function handleSearch(query) {
    if (isUnsplashConfigured()) {
      if (query) { // Only search if the query is not empty.
        console.log(`Performing search for: ${query}`);
        await loadFirstPage(query);
        return;
      }

      console.log("Search is empty, fetching latest photos"); // TODO: REMOVE after testing.
      await loadFirstPage("");
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

    await loadFirstPage("");
  }

  async function loadFirstPage(query) {
    // A new search/reset always starts a fresh result set at page one.
    activeQuery = query;
    resetCurrentPage();
    hasMoreImages = true;
    loadMoreObserver.observe(loadMoreTrigger);
    requestVersion += 1;

    const version = requestVersion;

    // Cancel pagination from the previous query so it cannot compete with or
    // append results into this new search.
    activeRequestController?.abort();
    const controller = new AbortController();
    activeRequestController = controller;
    isLoading = true;
    // Give immediate visual feedback while the API request is in progress.
    gallery.showLoading();

    try {
      const images = await fetchImages(activeQuery, getCurrentPage(), {
        signal: controller.signal
      });

      // Ignore an older response if the user searched or reset while it was loading.
      if (version !== requestVersion) {
        return;
      }

      gallery.renderImages(images);
      hasMoreImages = images.length > 0;
    } catch (error) {
      // AbortError is expected when another search supersedes this one.
      if (error.name !== "AbortError") {
        console.error("Unable to load the first page of images:", error);
      }
    } finally {
      // An older request must not unlock the loading guard of a newer request.
      if (version === requestVersion) {
        isLoading = false;
      }

      if (activeRequestController === controller) {
        activeRequestController = null;
      }
    }
  }

  async function loadNextPage() {
    // Avoid duplicate requests and stop after the API reaches its final page.
    if (!isUnsplashConfigured() || isLoading || !hasMoreImages) {
      return;
    }

    isLoading = true;
    const version = requestVersion;
    const nextPage = incrementCurrentPage();
    const controller = new AbortController();
    activeRequestController = controller;

    try {
      const images = await fetchImages(activeQuery, nextPage, {
        signal: controller.signal
      });

      if (version !== requestVersion) {
        return;
      }

      if (images.length === 0) {
        // No results means pagination is complete, so observation can stop.
        hasMoreImages = false;
        loadMoreObserver.unobserve(loadMoreTrigger);
      } else {
        // Pagination appends; a first-page search replaces the gallery instead.
        gallery.renderImages(images, { append: true });
      }
    } catch (error) {
      if (error.name !== "AbortError") {
        console.error("Unable to load more images:", error);
      }
    } finally {
      if (version === requestVersion) {
        isLoading = false;
      }

      if (activeRequestController === controller) {
        activeRequestController = null;
      }
    }
  }
}
