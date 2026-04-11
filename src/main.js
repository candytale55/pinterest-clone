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


async function fetchImages(query = "random", page = 1) { 
  console.log("Attempting to get images");
  const url = `https://api.unsplash.com/photos?client_id=${UNSPLASH_ACCESS_KEY}&page=${page}&per_page=${imagesPerPage}`;

  try {
    
    const response = await fetch(url);

    // Check if the network request was successful, throw an error if not
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
      return []; // Return empty array on error
    }

    const data = await response.json(); // Parse the JSON response
    console.log("Received API data:", data);
    return data; // Return feched data
    
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
    const galleryItem = document.create("div");
    galleryItem.classList.add("gallery-item");

    // Create <img> element
    const img = document.create("img");
    img.src = image.url.small; // Previeview size 
    img.alt = image.alt_description || "Unsplash Image"; // Fallback alt text
    img.loading = "lazy"; // for performance improvement (lazy-loading)

    // Append img to its container
    galleryItem.appendchild(img);

    // Get image container into the gallery
    imageGallery.appendChild(galleryItem);
  });

  console.log("Images displayed in the gallery");
}



// Call fetchImages on page load to display initial set of images
document.addEventListener("DOMContentLoaded", async () => { 
  if (UNSPLASH_ACCESS_KEY) { // Only fetch if there's an API Key present
    await fetchImages();
  } else {
    console.error("Cannot fetch images: Unsplash API Key is missing")
  }
});
