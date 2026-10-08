# LensCraft 📷

**LensCraft** is a modern, responsive web application designed for seamless visual discovery. Built with clean HTML, CSS, and plain JavaScript, it provides a fast and intuitive interface for searching high-resolution images.

---

## 🚀 Key Features   

* **Responsive CSS Grid Layout**: Image results adapt automatically across mobile, tablet, and desktop screens using native CSS Grid (`auto-fill` and `minmax`).
* **Category Suggestion Chips**: Quick-pick topic pills (Nature, Architecture, Cyberpunk, Minimalism) for instant search ideas.
* **Sticky Header**: A modern sticky header ensures the search controls remain accessible as you scroll through image results.
* **Empty State Messaging**: Clear UI feedback informing users how to begin searching when no results are displayed.

---

## 🎨 Design Decisions

1. **Teal Dark Mode Theme**: Selected a deep slate (`#0f172a`) background with vibrant teal accents (`#0d9488`) to establish a modern aesthetic distinct from standard layout templates.
2. **Accessible Form Architecture**: Wrapped search inputs inside a native HTML `<form>` element to provide built-in keyboard accessibility (submitting via the `Enter` key) and full screen-reader support.
3. **Responsive Grid without Media Queries**: Leveraged `repeat(auto-fill, minmax(240px, 1fr))` for image card containers to enable dynamic column re-flowing across all viewport sizes.

---

## 📁 Project Structure

```text
.
├── index.html   # Main structural skeleton & search UI
├── styles.css   # Color variables, layout, & responsive grid styling
├── script.js    # Logic & API fetching setup
└── README.md    # Project overview and documentation
