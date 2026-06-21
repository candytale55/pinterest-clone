/** Maintains the current Unsplash page across searches and pagination. */

const INITIAL_PAGE = 1;

// Gallery state that changes as users search, reset, and eventually paginate.
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
