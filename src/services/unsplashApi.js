// Access the Unsplash Access Key from Vite's environment variables.
// Vite exposes .env variables prefixed with VITE_ via import.meta.env.
const UNSPLASH_ACCESS_KEY = import.meta.env.VITE_UNSPLASH_ACCESS_KEY;
const imagesPerPage = 20; // Number of images to fetch per page. Adjust as needed for performance and layout.

// Safety check to ensure the access key is available.
if (!UNSPLASH_ACCESS_KEY) {
  console.error("Unsplash Access Key is missing! Please set VITE_UNSPLASH_ACCESS_KEY in your .env file.");
}

export function isUnsplashConfigured() {
  return Boolean(UNSPLASH_ACCESS_KEY);
}

export async function fetchImages(query = "", page = 1, { signal } = {}) {
  const normalizedQuery = query.trim();
  const params = new URLSearchParams({
    client_id: UNSPLASH_ACCESS_KEY,
    page: String(page),
    per_page: String(imagesPerPage),
  });

  let endpoint = "photos";

  // Searches and the general feed use different Unsplash endpoints and return
  // differently shaped JSON responses.
  if (normalizedQuery) {
    endpoint = "search/photos";
    params.set("query", normalizedQuery);
  } else {
    params.set("order_by", "latest");
  }

  const url = `https://api.unsplash.com/${endpoint}?${params}`;

  try {
    // The AbortSignal allows a newer search to cancel this request instead of
    // leaving it to consume bandwidth in the background.
    const response = await fetch(url, { signal });

    // Check if the network request was successful, return an empty array if not.
    if (!response.ok) {
      console.error(`HTTP error! status: ${response.status}`);

      // Provide more specific error for 403 (Forbidden).
      if (response.status === 403) {
        console.error("Unsplash API Rate Limit Exceeded or Invalid Key. Please check your key and try again later.");
      }

      return [];
    }

    const data = await response.json(); // Parse the JSON response.

    // For /search/photos, the actual images are in data.results.
    // For /photos (general endpoint), the data is directly the array of images.
    const imagesToReturn = normalizedQuery ? data.results : data;
    console.log("Received API data:", imagesToReturn);

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
