# LabDocs Unlocked - Frontend

A Perplexity.ai-style search interface for laboratory documentation.

## 🚀 Quick Start

### Local Development (No Build Required)

Simply open `index.html` in your browser:

```bash
# From the frontend directory
open index.html  # macOS
# or
start index.html  # Windows
# or
xdg-open index.html  # Linux
```

Or use a simple HTTP server:

```bash
# Python 3
python -m http.server 8000

# Python 2
python -m SimpleHTTPServer 8000

# Node.js (if you have http-server installed)
npx http-server -p 8000
```

Then open http://localhost:8000 in your browser.

## 📁 Project Structure

```
frontend/
├── index.html              # Main HTML file
├── css/
│   └── styles.css         # Custom styles
├── js/
│   ├── config.js          # Configuration
│   ├── sampleData.js      # Mock data for testing
│   ├── api.js             # API abstraction layer
│   ├── utils.js           # Utility functions
│   ├── search.js          # Search UI logic
│   └── main.js            # App initialization
└── assets/                # Images and other assets
```

## 🎯 Features

### ✅ Implemented (MVP)

- **Search Interface**: Natural language search with debounced input
- **AI-Generated Summary**: Perplexity-style response with citations
- **Source Documents**: Result cards with highlighted snippets
- **Citations**: Clickable inline citations linking to source documents
- **Related Questions**: AI-suggested follow-up queries
- **Autocomplete**: Real-time search suggestions
- **Sorting**: Sort by relevance, date, or title
- **Dark Mode**: Toggle between light and dark themes
- **Responsive Design**: Mobile-friendly layout

### 🔄 Sample Data Mode

The application currently uses **mock data** for testing. This allows frontend development without a backend.

**Mock Data Includes**:
- Sample searches for "tb pcr", "cardiac", "specimen requirements"
- Autocomplete suggestions
- AI-generated summaries with citations
- Related questions

### 🔌 Backend Integration

The API layer is **abstracted** for easy switching between mock and real data:

**To switch to real Vespa API**:

1. Open `js/config.js`
2. Set `useMockData: false`
3. Update `baseUrl` to your Vespa endpoint:

```javascript
const CONFIG = {
    api: {
        baseUrl: 'http://your-vespa-server:8080/search/api/v1',
        useMockData: false,  // Changed from true
    },
    // ...
};
```

The API client (`js/api.js`) will automatically use real endpoints.

## 🔍 Testing the Interface

### Try These Sample Queries:

1. **"tb pcr"** or **"specimen requirements"**
   - Returns TB PCR protocol results
   - Shows specimen collection requirements
   - Displays AI summary with citations

2. **"cardiac"**
   - Returns FDA 510(k) clearance for AlloMap
   - Shows cardiac testing information

3. Click the **example query buttons** in the empty state

### Expected Behavior:

1. **Type query** → See autocomplete suggestions
2. **Press Enter** → Loading state appears
3. **Results display**:
   - AI Summary at top with clickable citations [1], [2], etc.
   - Source Documents below with highlighted text
   - Related Questions at bottom
4. **Click citation** → Scrolls to source document
5. **Click "View Full Document"** → Opens PDF (mock path)
6. **Click related question** → Executes new search

## 🎨 UI Components

Uses **vanilla JavaScript** with:
- **Tailwind CSS** (via CDN) for styling
- **Alpine.js** (via CDN) for interactivity (BasecoatUI)
- No build process required

### Theme Toggle

Click the 🌙/☀️ button in the header to toggle dark mode.
Preference is saved to localStorage.

## 🔧 Configuration

All settings in `js/config.js`:

```javascript
const CONFIG = {
    api: {
        baseUrl: 'http://localhost:8080/search/api/v1',
        timeout: 30000,
        useMockData: true,  // Toggle mock vs. real API
    },
    search: {
        debounceDelay: 300,      // Autocomplete delay (ms)
        minQueryLength: 2,       // Min chars for autocomplete
        resultsPerPage: 10,
        maxSuggestions: 5,
    },
    features: {
        enableAISummary: true,
        enableRelatedQuestions: true,
        enableAutocomplete: true,
        enableFilters: false,    // Coming in next iteration
    },
};
```

## 📝 API Integration Guide

The `api.js` file provides a unified interface with automatic fallback:

### Search API

**Mock Mode**: Returns sample data from `sampleData.js`

**Real Mode**: Calls `POST /search/api/v1/query`

```javascript
// Usage (same for both modes)
const response = await apiClient.search(query, {
    sortBy: 'relevance',
    limit: 10,
    offset: 0,
});
```

### Autocomplete API

**Mock Mode**: Returns suggestions from `sampleData.js`

**Real Mode**: Calls `GET /search/api/v1/suggest?q=...`

### Synthesize API (AI Summary)

**Mock Mode**: Returns pre-written summaries

**Real Mode**: Calls `POST /search/api/v1/synthesize`

## 🚧 Next Iterations

### Planned Features:

1. **Filters Panel** (Phase 2)
   - Document type filter
   - Category filter (Immunology, Cardiology, etc.)
   - Date range picker
   - Regulatory status filter

2. **Advanced Search** (Phase 2)
   - Boolean operators (AND, OR, NOT)
   - Phrase matching with quotes
   - Field-specific search

3. **Streaming LLM Response** (Phase 3)
   - Real-time token streaming
   - Progress indicators

4. **Pagination** (Phase 2)
   - Load more results
   - Infinite scroll option

## 🐛 Troubleshooting

### Autocomplete not working?
- Check `CONFIG.features.enableAutocomplete` is `true`
- Ensure query length ≥ `minQueryLength`

### Search returns no results?
- In mock mode, only specific queries work (see sampleData.js)
- Try: "tb pcr", "cardiac", "specimen requirements"

### Dark mode not persisting?
- Check browser localStorage is enabled
- Clear localStorage and try again

### Console errors?
- Check all JS files are loading (Network tab)
- Ensure correct script load order in index.html

## 📚 Code Organization

### `search.js` - Main search logic
- `executeSearch()` - Runs search and orchestrates API calls
- `renderResults()` - Displays search results
- `renderAISummary()` - Renders AI response with citations
- `renderResultCards()` - Creates result card HTML

### `api.js` - API abstraction
- Automatically switches between mock and real APIs
- Handles timeouts, retries, and errors
- Unified interface for all endpoints

### `utils.js` - Helper functions
- `highlightText()` - Highlights query terms
- `formatDate()` - Formats dates
- `debounce()` - Rate limiting for input
- `parseCitations()` - Extracts citation numbers

## 🎓 Learning Resources

- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [BasecoatUI Components](https://basecoatui.com/)
- [Alpine.js Guide](https://alpinejs.dev/)

## 📄 License

This project is part of the ADLM 2025 Data Science Challenge.

## 🤝 Contributing

This is an iterative development process. Each feature will be added step-by-step with testing.

---

**Status**: ✅ MVP Complete - Basic search with mock data functional

**Next**: Add filters panel and connect to real Vespa backend
