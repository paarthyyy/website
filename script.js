// Select DOM elements
const form = document.getElementById("search-form");
const input = document.getElementById("search-input");
const resultsContainer = document.getElementById("results");

// Optional Enhancement: Create a result count element dynamically
let resultCountEl = document.getElementById("result-count");
if (!resultCountEl) {
  resultCountEl = document.createElement("p");
  resultCountEl.id = "result-count";
  resultCountEl.className = "result-count";
  form.insertAdjacentElement("afterend", resultCountEl);
}

// 1. Catch the search submit event
form.addEventListener("submit", async (event) => {
  event.preventDefault(); // Stop full-page reload

  // Read and clean the query
  const query = input.value.trim();

  // 4. Ignore empty searches
  if (!query) return;

  // Clear previous results and count
  resultsContainer.innerHTML = "";
  resultCountEl.textContent = "Searching...";

  try {
    // 2. Fetch the data using Wikimedia Commons API
    const url =
      "https://commons.wikimedia.org/w/api.php?action=query&generator=search" +
      "&gsrsearch=" + encodeURIComponent(query) +
      "&gsrnamespace=6&gsrlimit=12&prop=imageinfo&iiprop=url&iiurlwidth=300&format=json&origin=*";

    const response = await fetch(url);

    // Check if the HTTP request succeeded
    if (!response.ok) {
      throw new Error(`Request failed with status ${response.status}`);
    }

    const data = await response.json();

    // Check if any results were found
    if (!data.query || !data.query.pages) {
      resultCountEl.textContent = `No results found for "${query}".`;
      return;
    }

    // Extract pages array from response object
    const items = Object.values(data.query