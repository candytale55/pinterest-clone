import './css/style.css'
import './css/header.css'
import './css/gallery.css'

// Access the Unsplash Access Key from Vite's environment variables
// Vite exposes .env variables prefixed with VITE_ via import.meta.env
const UNSPLASH_ACCESS_KEY = import.meta.env.VITE_UNSPLASH_ACCESS_KEY;

// Safety check to ensure the access key is available
if (!UNSPLASH_ACCESS_KEY) {
  console.error("Unsplash Access Key is missing! Please set VITE_UNSPLASH_ACCESS_KEY in your .env file.");
}

const imageGallery = document.getElementById("image-gallery");
const searchBox = document.getElementById("search-box");
const searchButton = document.getElementById("search-button");


let currentPage = 1; // 
const imagesPerPage = 15; //

/*  //TODO (remove when done): The query="latest" default is just a placeholder that isn't affecting the API call yet. */
async function fetchImages(query = "latest", page = 1) {
  console.log(`Attempting to get images for query: ${query} on page: ${page}`);

  let url;
  let isSearch = false; // Flag to track if we're performing a search or fetching general photos

  // TODO: Remove - Left temp for reference
  /*  const url = `https://api.unsplash.com/photos?client_id=${UNSPLASH_ACCESS_KEY}&page=${page}&per_page=${imagesPerPage}`; */

  // Determine which Unsplash API endpoint to use
  if (query.trim() === "") {
    // If the query is empty, fetch general latest photos
    url = `https://api.unsplash.com/photos?client_id=${UNSPLASH_ACCESS_KEY}&page=${page}&per_page=${imagesPerPage}`;
    console.log("Using Unsplash general photos endpoint for initial load or empty search.");
  } else {
    // If there's a search query, use the search endpoint
    url = `https://api.unsplash.com/search/photos?client_id=${UNSPLASH_ACCESS_KEY}&query=${query}&page=${page}&per_page=${imagesPerPage}`;
    console.log(`Using Unsplash search endpoint for: ${query}.`);
  }

  try {

    const response = await fetch(url);

    // Check if the network request was successful, throw an error if not
    if (!response.ok) {
      console.error(`HTTP error! status: ${response.status}`);

      // Provide more specific error for 403 (Forbidden)
      if (response.status === 403) {
        console.error("Unsplash API Rate Limit Exceeded or Invalid Key. Please check your key and try again later.");
      }
      return []; // Return empty array on error 
    }

    const data = await response.json(); // Parse the JSON response

    // IMPORTANT: For /search/photos, the actual images are in data.results
    // For /photos (general endpoint), the data is directly the array of images.


    const imagesToReturn = (query.trim() === "") ? data : data.results;

    console.log("Received API data:", imagesToReturn);
    return imagesToReturn; // Return feched data

  } catch (error) {
    console.error("Error fetching images from Unsplash API:", error);
    return []; // Return empty array on error
  }
}

function displayImages(images) {
  // Clear existing images before displaying new ones
  // TODO: Important later on when adding search, load more, etc.
  while (imageGallery.firstChild) {
    imageGallery.removeChild(imageGallery.firstChild);
  }

  if (images.length === 0) {
    console.log("No images to display");
    // TODO: Fix message later
    return;
  }

  images.forEach(image => {
    // Create container
    const galleryItem = document.createElement("div");
    galleryItem.classList.add("gallery-item");

    // Create <img> element
    const img = document.createElement("img");
    img.src = image.urls.small; // Preview size
    img.alt = image.alt_description || "Unsplash Image"; // Fallback alt text
    img.loading = "lazy"; // for performance improvement (lazy-loading)

    // Append img to its container
    galleryItem.appendChild(img);

    // Get image container into the gallery
    imageGallery.appendChild(galleryItem);
  });

  console.log("Images displayed in the gallery");
}



// Call fetchImages on page load to display initial set of images
document.addEventListener("DOMContentLoaded", async () => {
  if (UNSPLASH_ACCESS_KEY) { // Only fetch if there's an API Key present

    // Calling fetchImages() with no arguments will trigger the 'general photos' endpoint

    const imageData = await fetchImages(); // Call with 'latest' explicitly for initial load
    displayImages(imageData);
  } else {
    console.error("Cannot fetch images: Unsplash API Key is missing")
  }
});

// Search button
searchButton.addEventListener("click", async (e) => {
  e.preventDefault();  // Prevent default form submission behavior (page reload)

  if (UNSPLASH_ACCESS_KEY) {
    const query = searchBox.value.trim(); // Get the value from the search input, remove whitespace

    if (query) { // Only search if the query is not empty
      
      console.log(`Performing search for: ${query}`); 
      currentPage = 1;
      // Reset currentPage to 1 (important for future pagination)
      const searchResults = await fetchImages(query, currentPage);
      displayImages(searchResults); // Display the new search results

    } else {

      console.log("Search is empty, fetching latest photos");
      currentPage = 1; // Also reset page for general photos
      const latestPhotos = await fetchImages("latest", currentPage);
      displayImages(latestPhotos);
    }
  } else {
    console.log("Cannot perform search: Unsplash Access Key is missing.");
  }
})