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
const appLogo = document.getElementById("app-logo");


let currentPage = 1; // 
const imagesPerPage = 16; //
let url;


/*  //TODO (remove when done): The query="latest" default is just a placeholder that isn't affecting the API call yet. */
async function fetchImages(query = "latest", page = 1) {
  console.log(`Attempting to get images for query: ${query} on page: ${page}`);


  // Determine which Unsplash API endpoint to use
  if (query.trim() === "") {
    // If the query is empty, fetch general latest photos
    url = `https://api.unsplash.com/photos?client_id=${UNSPLASH_ACCESS_KEY}&page=${page}&per_page=${imagesPerPage}`;
    // TODO: Remove after testing.
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
    // TODO: IMPORTANT: 
    // For /search/photos, the actual images are in data.results
    // For /photos (general endpoint), the data is directly the array of images.
    const imagesToReturn = (query.trim() === "") ? data : data.results;
    console.log("Received API data:", imagesToReturn);

    return imagesToReturn; // Return feched data

  } catch (error) {
    console.error("Error fetching images from Unsplash API:", error);
    return []; // Return empty array on error
  }
}



/* //TODO: Move to a separate module for better organization after it is working */
/* Function to create a counter element with an icon and count */
function createCounterElement(iconPath, count) {
  const counterWrapper = document.createElement("div");
  counterWrapper.classList.add("counter-wrapper");
  counterWrapper.setAttribute("aria-label", `Counter with ${count} items`); // Accessibility label

  const icon = document.createElement("img");
  icon.src = iconPath;
  icon.alt = ""; // decorative icon, so alt is empty
  icon.ariaHidden = "true"; // Hide from screen readers
  icon.classList.add("counter-icon");

  const countSpan = document.createElement("span");
  countSpan.textContent = count;
  countSpan.classList.add("counter-text");

  counterWrapper.appendChild(icon);
  counterWrapper.appendChild(countSpan);
  return counterWrapper;
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



    // Main overlay container for all elements 
    const overlay = document.createElement("div");
    overlay.classList.add("gallery-item-overlay");

    //  Create the TOP section of the overlay for all elements that appear on hover (contains the "Visit" button and counters)
    const topOverlay = document.createElement("div");
    topOverlay.classList.add("gallery-item-top-overlay");


    // Create counters. Random numbers for now .
    // TODO: Use views from API for one of the counters later.

    // Camera counter
    const cameraCounter = createCounterElement("./src/assets/images/camera-icon.svg", Math.floor(Math.random() * 1000));
    cameraCounter.classList.add("camera-counter");

    // Heart counter
    const heartCounter = createCounterElement("./src/assets/images/heart-icon.svg", Math.floor(Math.random() * 1000));
    heartCounter.classList.add("heart-counter");


    // Visit button (link to Unsplash page for the image)
    const visitButton = document.createElement("a");
    visitButton.href = image.links.html; // Link to the image's Unsplash page
    visitButton.target = "_blank"; // Open in new tab
    visitButton.textContent = "Visit"; // Button text
    visitButton.classList.add("btn", "btn-pill", "btn-cta"); // Add button classes for styling


    // Append counters to the top overlay
    topOverlay.appendChild(cameraCounter);
    topOverlay.appendChild(heartCounter);
    topOverlay.appendChild(visitButton); // Add visit button to the top overlay
    


    // Create overlay for photographer's name, image and image creation date
    const userPhoto = document.createElement("div");
    userPhoto.classList.add("gallery-item-user-photo");
    userPhoto.style.backgroundImage = `url(${image.user.profile_image.medium})`; // Photographer's profile picture

    const bottomOverlay = document.createElement("div");
    bottomOverlay.classList.add("gallery-item-overlay");
    bottomOverlay.textContent = image.user.name; // Photographer's name
    
    const imageDate = document.createElement("div");
    imageDate.textContent = image.created_at; // Image creation date 
    imageDate.classList.add("gallery-item-date"); // Add class for styling


    // Append the overlay and date to the gallery item
    galleryItem.appendChild(topOverlay); // Add the top overlay (visit button) to the gallery item

    galleryItem.appendChild(userPhoto);
    galleryItem.appendChild(bottomOverlay);
    galleryItem.appendChild(imageDate);

    
    // Get image container into the gallery
    imageGallery.appendChild(galleryItem);
  });

  console.log("Images displayed in the gallery"); // TODO: Remove after testing
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


/* ======================= */
/* ==== Search button ==== */
/* ======================= */

searchBox.addEventListener("keydown", async (e) => {
  if (e.key === "Enter") {

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

        console.log("Search is empty, fetching latest photos"); // TODO: REMOVE after testing
        currentPage = 1; // Also reset page for general photos
        const latestPhotos = await fetchImages("latest", currentPage);
        displayImages(latestPhotos);
      }
      searchBox.value = ""; // Clear the search box after performing the search
    } else {
      console.log("Cannot perform search: Unsplash Access Key is missing.");
    }
  }
  });

// App logo (reset to initial state)
appLogo.addEventListener("click", async (e) => {
  e.preventDefault(); // Prevent default link behavior
  console.log("Logo clicked. Resetting to initial state (latest photos)") // TODO: REMOVE after testing

  if (UNSPLASH_ACCESS_KEY) {
    currentPage = 1; // Reset page for initial load
    searchBox.value = ""; //Clear input box
    const latestPhotos = await fetchImages("latest", currentPage);
    displayImages(latestPhotos);
  } else {
    console.error("Cannot reset to initial state: Unsplash Access Key is missing.");
  }

});