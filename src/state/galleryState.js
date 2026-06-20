const INITIAL_PAGE = 1;

// Gallery state that changes as users search, reset, and eventually paginate.
let currentPage = INITIAL_PAGE;

export function getCurrentPage() {
  return currentPage;
}

export function resetCurrentPage() {
  currentPage = INITIAL_PAGE;
  return currentPage;
}
