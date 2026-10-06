// Select DOM elements
const form = document.getElementById("search-form");
const input = document.getElementById("search-input");
const clearBtn = document.getElementById("clear-button");
const resultsContainer = document.getElementById("results");
const statusMessage = document.getElementById("status-message");
const emptyState = document.getElementById("empty-state");
const chips = document.querySelectorAll(".chip");

// Core Search Handler Function
async function handleSearch(query) {
  if (!query) return;

  // 1. LOADING STATE
  resultsContainer.innerHTML = "";
  emptyState.style.display = "none";
  statusMessage.innerHTML = '<span class="loading-spinner"></span> Searching for high-res images...';

  try {
    // Fetch data using Wikimedia Commons API
    const url =
      "https://commons.wikimedia.org/w/api.php?action=query&generator=search" +
      "&gsrsearch=" + encodeURIComponent(query) +
      "&gsrnamespace=6&gsrlimit=12&prop=imageinfo&iiprop=url&iiurlwidth=400&format=json&origin=*";

    const response = await fetch(url);

    // Check HTTP response status
    if (!response.ok) {
      throw new Error(`Server returned status code ${response.status}`);
    }

    const data = await response.json();

    // 2. EMPTY STATE (0 results)
    if (!data.query || !data.query.pages) {
      statusMessage.textContent = "";
      emptyState.style.display = "block";
      emptyState.innerHTML = `<p>🔍 No results found for "<strong>${escapeHTML(query)}</strong>". Try searching for another topic!</p>`;
      return;
    }

    // Extract pages
    const items = Object.values(data.query.pages);

    // Filter items that contain image info with thumbnails
    const validItems = items.filter(
      (item) => item.imageinfo && item.imageinfo[0] && item.imageinfo[0].thumburl
    );

    if (validItems.length === 0) {
      statusMessage.textContent = "";
      emptyState.style.display = "block";
      emptyState.innerHTML = `<p>🔍 No displayable image previews found for "<strong>${escapeHTML(query)}</strong>".</p>`;
      return;
    }

    // 3. RESULTS STATE & POLISH (Result count display)
    statusMessage.textContent = `Showing ${validItems.length} result${validItems.length > 1 ? "s" : ""} for "${query}".`;
    renderResults(validItems);

  } catch (error) {
    // 4. ERROR STATE
    console.error("Fetch error:", error);
    statusMessage.textContent = "";
    emptyState.style.display = "block";
    emptyState.innerHTML = `<p class="error-text">⚠️ Something went wrong while loading images. Please check your network connection and try again.</p>`;
  }
}

// Render Results Grid
function renderResults(items) {
  items.forEach((item) => {
    const imgInfo = item.imageinfo[0];
    const rawTitle = item.title.replace(/^File:/, "").replace(/\.[^/.]+$/, "");
    const cleanedTitle = escapeHTML(rawTitle);

    const card = document.createElement("article");
    card.className = "card";
    card.innerHTML = `
      <div class="card-image-wrapper">
        <img src="${imgInfo.thumburl}" alt="${cleanedTitle}" loading="lazy" />
      </div>
      <div class="card-body">
        <h3 class="card-title">${cleanedTitle}</h3>
        <a href="${imgInfo.descriptionurl}" target="_blank" rel="noopener noreferrer" class="view-btn">View Source</a>
      </div>
    `;
    resultsContainer.appendChild(card);
  });
}

// Helper: Escape HTML string to prevent XSS
function escapeHTML(str) {
  return str.replace(/[&<>'"]/g, 
    tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag] || tag)
  );
}

// Form Submit Listener
form.addEventListener("submit", (e) => {
  e.preventDefault();
  handleSearch(input.value.trim());
});

// Clear Button Listener
clearBtn.addEventListener("click", () => {
  input.value = "";
  resultsContainer.innerHTML = "";
  statusMessage.textContent = "Showing 0 results";
  emptyState.style.display = "block";
  emptyState.innerHTML = "<p>✨ Search to see results or click a category above to begin!</p>";
});

// Category Chips Listeners
chips.forEach((chip) => {
  chip.addEventListener("click", () => {
    const topic = chip.textContent.trim();
    input.value = topic;
    handleSearch(topic);
  });
});