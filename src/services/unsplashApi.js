// Access the Unsplash Access Key from Vite's environment variables.
// Vite exposes .env variables prefixed with VITE_ via import.meta.env.
const UNSPLASH_ACCESS_KEY = import.meta.env.VITE_UNSPLASH_ACCESS_KEY;
const imagesPerPage = 16;

// Safety check to ensure the access key is available.
if (!UNSPLASH_ACCESS_KEY) {
  console.error("Unsplash Access Key is missing! Please set VITE_UNSPLASH_ACCESS_KEY in your .env file.");
}

export function isUnsplashConfigured() {
  return Boolean(UNSPLASH_ACCESS_KEY);
}

/* TODO (remove when done): The query="latest" default is just a placeholder that isn't affecting the API call yet. */
export async function fetchImages(query = "latest", page = 1) {
  console.log(`Attempting to get images for query: ${query} on page: ${page}`);

  let url;

  // Determine which Unsplash API endpoint to use.
  if (query.trim() === "") {
    // If the query is empty, fetch general latest photos.
    url = `https://api.unsplash.com/photos?client_id=${UNSPLASH_ACCESS_KEY}&page=${page}&per_page=${imagesPerPage}`;
    // TODO: Remove after testing.
    console.log("Using Unsplash general photos endpoint for initial load or empty search.");
  } else {
    // If there's a search query, use the search endpoint.
    url = `https://api.unsplash.com/search/photos?client_id=${UNSPLASH_ACCESS_KEY}&query=${query}&page=${page}&per_page=${imagesPerPage}`;
    console.log(`Using Unsplash search endpoint for: ${query}.`);
  }

  try {
    const response = await fetch(url);

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

    // TODO: IMPORTANT:
    // For /search/photos, the actual images are in data.results.
    // For /photos (general endpoint), the data is directly the array of images.
    const imagesToReturn = query.trim() === "" ? data : data.results;
    console.log("Received API data:", imagesToReturn);

    return imagesToReturn;
  } catch (error) {
    console.error("Error fetching images from Unsplash API:", error);
    return []; // Return empty array on error.
  }
}
