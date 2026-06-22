/** Handles configuration checks and photo requests to the Unsplash API. */

// Access the Unsplash Access Key from Vite's environment variables.
// Vite exposes .env variables prefixed with VITE_ via import.meta.env.
const UNSPLASH_ACCESS_KEY = import.meta.env.VITE_UNSPLASH_ACCESS_KEY;
const imagesPerPage = 16; // This sets the number of images to fetch per page. 

// Safety check 
if (!UNSPLASH_ACCESS_KEY) {
  console.error("Unsplash Access Key is missing! Please set VITE_UNSPLASH_ACCESS_KEY in your .env file.");
}

/** @returns {boolean} if Unsplash access key is available. */
export function isUnsplashConfigured() {
  return Boolean(UNSPLASH_ACCESS_KEY);
}

/**
 * Fetches a page of search results from Unsplash
 * @param {string} query - Search text; an empty value requests latest photos.
 * @param {number} page - One-based result page.
 * @param {{signal?: AbortSignal}} options - Optional request cancellation signal.
 * @returns {Promise<Array>} Unsplash photo records, or an empty array on failure.
 */
export async function fetchImages(query = "", page = 1, { signal } = {}) {
  const normalizedQuery = query.trim();
  const params = new URLSearchParams({
    client_id: UNSPLASH_ACCESS_KEY,
    page: String(page),
    per_page: String(imagesPerPage),
  });

  // Default endpoint for fetching latest photos.
  let endpoint = "photos";

  // Change the endpoint to /search/photos if a query is provided
  if (normalizedQuery) {
    endpoint = "search/photos";
    params.set("query", normalizedQuery);
  } else {
    params.set("order_by", "latest");
  }

  const url = `https://api.unsplash.com/${endpoint}?${params}`;

  try {
    
    const response = await fetch(url, { signal });

    // Check if the network request was successful, return an empty array if not.
    if (!response.ok) {
      console.error(`HTTP error! status: ${response.status}`);

      // More specific error for 403 (Forbidden).
      if (response.status === 403) {
        console.error("Unsplash API Rate Limit Exceeded or Invalid Key. Please check your key and try again later.");
      }

      return [];
    }

    const data = await response.json(); // Parse the JSON response.

    const imagesToReturn = normalizedQuery ? data.results : data;
    console.log("Received API data:", imagesToReturn);
    // For /search/photos, the actual images are in data.results.
    // For /photos (general endpoint), the data is directly the array of images.

    return imagesToReturn;
  } catch (error) {
    // app.js handles intentional cancellation. Rethrow it so cancellation is
    // not mistaken for a successful response containing zero images.
    if (error.name === "AbortError") {
      throw error;
    }

    console.error("Error fetching images from Unsplash API:", error);
    return []; // Return empty array on error.
  }
}
