/** Remembers which page of Unsplash results you are currently on. */
/*  A function increments the page number when more results are requested */
/*  and another resets the page number when a new search is initiated */

const INITIAL_PAGE = 1;

// This variable remembers the current page of Unsplash results.
let currentPage = INITIAL_PAGE;

/** @returns {number} The page currently selected for API requests. */
export function getCurrentPage() {
  return currentPage;
}

/**
 * Advances pagination by one page.
 * @returns {number} The incremented page number.
 */
export function incrementCurrentPage() {
  // Infinite scrolling calls this before requesting each additional page.
  currentPage += 1;
  return currentPage;
}

/**
 * Restores pagination to its initial page.
 * @returns {number} The initial page number.
 */
export function resetCurrentPage() {
  currentPage = INITIAL_PAGE;
  return currentPage;
}
