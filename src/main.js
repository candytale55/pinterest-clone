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

// Call fetchImages on page load to display initial set of images
document.addEventListener("DOMContentLoaded", async () => { 
  if (UNSPLASH_ACCESS_KEY) { // Only fetch if there's an API Key present
    await fetchImages();
  } else {
    console.error("Cannot fetch images: Unsplash API Key is missing")
  }
});

/* API info is comming alright
Received API data: 
(15) [{…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}]
0
: 
{id: 'MJLy1fUvX_w', slug: 'woman-planting-a-small-houseplant-in-a-pot-MJLy1fUvX_w', alternative_slugs: {…}, created_at: '2026-03-12T16:24:21Z', updated_at: '2026-04-11T12:05:00Z', …}
1
: 
{id: 'Mt2SbwSFL0Y', slug: 'abstract-red-and-orange-floral-detail-Mt2SbwSFL0Y', alternative_slugs: {…}, created_at: '2026-04-10T18:01:44Z', updated_at: '2026-04-11T16:43:06Z', …}
2
: 
{id: 'IiCujDqXxSw', slug: 'rows-of-colorful-lanterns-in-red-yellow-blue-and-pink-IiCujDqXxSw', alternative_slugs: {…}, created_at: '2026-04-11T05:04:57Z', updated_at: '2026-04-11T15:17:14Z', …}
3
: 
{id: 'LoO6s94mup0', slug: 'people-relaxing-on-a-sunny-beach-under-a-red-umbrella-LoO6s94mup0', alternative_slugs: {…}, created_at: '2026-04-10T11:40:50Z', updated_at: '2026-04-11T16:13:07Z', …}
4
: 
{id: 'oh2iXAXWHt8', slug: 'a-butterfly-on-a-branch-oh2iXAXWHt8', alternative_slugs: {…}, created_at: '2022-07-23T04:15:30Z', updated_at: '2026-04-11T14:07:26Z', …}
5
: 
{id: 'K1WED5oMw7s', slug: 'beach-scene-with-lifeguard-stand-and-umbrellas-K1WED5oMw7s', alternative_slugs: {…}, created_at: '2026-04-05T10:43:03Z', updated_at: '2026-04-11T15:10:30Z', …}
6
: 
{id: 'hgvfIyYgU6c', slug: 'person-walking-past-a-bus-on-a-city-street-hgvfIyYgU6c', alternative_slugs: {…}, created_at: '2026-04-01T09:56:54Z', updated_at: '2026-04-11T15:59:09Z', …}
7
: 
{id: 'vBUGdI7JAvc', slug: 'two-smiling-women-in-a-park-vBUGdI7JAvc', alternative_slugs: {…}, created_at: '2025-10-30T15:53:21Z', updated_at: '2026-04-11T14:50:58Z', …}
8
: 
{id: 'J9arQNc4xTU', slug: 'a-yellow-vintage-car-parked-by-a-body-of-water-J9arQNc4xTU', alternative_slugs: {…}, created_at: '2026-03-30T05:25:53Z', updated_at: '2026-04-11T15:39:52Z', …}
9
: 
{id: 'pUY0TMADyTM', slug: 'white-blossoms-on-a-tree-branch-against-blue-sky-pUY0TMADyTM', alternative_slugs: {…}, created_at: '2026-04-01T16:19:56Z', updated_at: '2026-04-11T16:19:01Z', …}
10
: 
{id: 'm18p3pA_1sA', slug: 'couple-kissing-by-the-ocean-at-sunset-m18p3pA_1sA', alternative_slugs: {…}, created_at: '2026-03-30T09:06:02Z', updated_at: '2026-04-11T16:04:37Z', …}
11
: 
{id: 'ub-TQ9EeVEE', slug: 'snowy-mountain-landscape-under-a-clear-blue-sky-ub-TQ9EeVEE', alternative_slugs: {…}, created_at: '2026-03-31T04:24:28Z', updated_at: '2026-04-11T16:43:32Z', …}
12
: 
{id: 'SlSMSIIU5LQ', slug: 'a-narrow-canal-lined-with-old-buildings-in-venice-SlSMSIIU5LQ', alternative_slugs: {…}, created_at: '2026-04-05T15:06:42Z', updated_at: '2026-04-11T14:54:55Z', …}
13
: 
{id: 'JZhRRmhYy_E', slug: 'modern-trash-can-with-wooden-slats-in-sunlit-room-JZhRRmhYy_E', alternative_slugs: {…}, created_at: '2026-04-07T07:57:09Z', updated_at: '2026-04-11T13:07:05Z', …}
14
: 
{id: 'qUJ8fgoaLTg', slug: 'person-using-a-smartphone-over-a-notebook-qUJ8fgoaLTg', alternative_slugs: {…}, created_at: '2026-03-12T16:24:21Z', updated_at: '2026-04-11T11:09:37Z', …}
length
: 
15
*/