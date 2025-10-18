# LabDocs Unlocked - Chat Interface

A conversational AI-powered chat interface for laboratory documentation search.

## 🎨 Interface Overview

The chat interface provides a modern, conversational way to search through laboratory documentation:

- **Chat-based interaction** - Ask questions naturally at the bottom
- **Streaming AI responses** - See answers appear in real-time
- **Source documents sidebar** - View and click through to original documents
- **Citation linking** - Click citations to highlight sources
- **Conversation history** - Build on previous questions

## 🚀 Quick Start

### Option 1: Direct File Opening

```bash
# From the frontend directory
open index-chat.html  # macOS
# or
start index-chat.html  # Windows
# or
xdg-open index-chat.html  # Linux
```

### Option 2: HTTP Server (Recommended)

```bash
# Python 3
python -m http.server 8000

# Node.js
npx http-server -p 8000
```

Then open: **http://localhost:8000/index-chat.html**

## 📁 Project Structure

```
frontend/
├── index-chat.html          # Chat interface (NEW!)
├── index.html               # Original search interface
├── css/
│   ├── styles-chat.css     # Chat-specific styles
│   └── styles.css          # Original search styles
├── js/
│   ├── config.js           # Configuration
│   ├── sampleData.js       # Mock data
│   ├── api.js              # API abstraction
│   ├── utils.js            # Utilities
│   ├── chat.js             # Chat UI logic (NEW!)
│   ├── main-chat.js        # Chat app init (NEW!)
│   ├── search.js           # Search UI logic
│   └── main.js             # Search app init
└── assets/
```

## 🎯 Key Features

### ✅ Conversational Interface
- Natural language question input
- Chat history preserved in session
- Follow-up questions suggested
- Clear conversation button

### ✅ Streaming AI Responses
- Token-by-token streaming effect (simulated in mock mode)
- Typing indicator while processing
- Real-time citation display
- Smooth animations

### ✅ Source Documents Sidebar
- Right-side panel with all sources
- Clickable cards open PDFs
- Citation numbers [1], [2], etc.
- Highlight on click from AI response
- Collapsible on mobile

### ✅ Smart Citations
- Inline citations in AI responses
- Click citation → highlight source
- Click source → open PDF at correct page
- Bidirectional linking

### ✅ Mobile Responsive
- Full-screen chat on mobile
- Slide-out sources panel
- Touch-friendly interface
- Auto-resizing textarea

## 🧪 Testing the Chat Interface

### Sample Questions to Try:

1. **"What are the specimen requirements for TB PCR testing?"**
   - Should return TB PCR protocol
   - Shows specimen collection, transport, storage info
   - Citations link to source sections

2. **"Tell me about AlloMap heart transplant testing"**
   - Returns FDA 510(k) clearance info
   - Shows indications for use
   - Suggests related questions

3. **"specimen requirements"**
   - General query about specimen handling
   - Multiple sources may appear

### Expected Flow:

1. **Type question** in chat input at bottom
2. **Press Enter** or click send button
3. **Typing indicator** appears (...)
4. **AI response streams** in word-by-word
5. **Sources appear** in right sidebar [1], [2], [3]
6. **Related questions** shown below response
7. **Click citations** to highlight sources
8. **Click source cards** to open PDFs

## 🎨 UI Layout

```
┌─────────────────────────────────────────────────────────────┐
│  🔬 LabDocs Unlocked         Sources (3)  Clear Chat  🌙    │
├────────────────────────────────────┬────────────────────────┤
│                                    │  Source Documents      │
│  [CONVERSATION AREA]               │                        │
│  (Scrollable)                      │  📄 [1] TB PCR SOP     │
│                                    │  ┌──────────────────┐  │
│  User: What are specimen...        │  │ Sputum, BAL...   │  │
│                                    │  │ Sterile contain..│  │
│  🤖 AI: For Mycobacterium...       │  └──────────────────┘  │
│  [Streaming response] [1] [2]      │                        │
│                                    │  📄 [2] TB PCR SOP     │
│  💡 Related questions:              │  ┌──────────────────┐  │
│  • What is transport temp?         │  │ PCR Setup...     │  │
│                                    │  └──────────────────┘  │
│                                    │                        │
├────────────────────────────────────┴────────────────────────┤
│  💬 Ask anything about lab docs...              [Send →]   │
│  Press Enter to send, Shift+Enter for new line             │
└─────────────────────────────────────────────────────────────┘
```

## ⚙️ Configuration

All settings in `js/config.js`:

```javascript
const CONFIG = {
    api: {
        baseUrl: 'http://localhost:8080/search/api/v1',
        timeout: 30000,
        useMockData: true,  // Toggle mock vs. real API
    },
    search: {
        debounceDelay: 300,
        minQueryLength: 2,
        resultsPerPage: 10,
        maxSuggestions: 5,
    },
    features: {
        enableAISummary: true,
        enableRelatedQuestions: true,
        enableAutocomplete: false,  // Not used in chat mode
        enableFilters: false,
    },
};
```

## 🔌 Switching to Real API

When your Vespa backend is ready:

1. Open `js/config.js`
2. Change `useMockData: false`
3. Update `baseUrl` to your endpoint
4. Refresh the page

That's it! The chat interface will automatically use real API calls.

## 🎨 Customization

### Streaming Speed

In `js/chat.js`, adjust the delay:

```javascript
// Faster streaming
await Utils.delay(10);  // milliseconds per token

// Slower streaming (more dramatic effect)
await Utils.delay(50);
```

### Color Scheme

Edit `css/styles-chat.css`:

```css
/* Change citation color */
.citation {
    color: #2563eb;  /* Blue */
}

/* Change AI avatar gradient */
.message-ai-avatar {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}
```

### Source Panel Width

In `index-chat.html`:

```html
<!-- Change from w-96 to w-80 (narrower) or w-[32rem] (wider) -->
<div class="md:w-96 lg:w-[28rem]">
```

## 🐛 Troubleshooting

### Chat input not sending?
- Check if `isProcessing` flag is stuck (refresh page)
- Ensure Enter key (not Shift+Enter) is pressed
- Check console for errors

### Sources not appearing?
- Verify mock data includes results for your query
- Check `sourcesPanel` is not hidden via CSS
- Try queries: "tb pcr", "cardiac", "specimen requirements"

### Streaming too fast/slow?
- Adjust `Utils.delay()` value in `chat.js`
- Default: 30ms in mock mode, 10ms in real mode

### Citations not clickable?
- Check `attachCitationHandlers()` is called
- Verify citation format is `[number]`
- Look for JavaScript errors in console

### Dark mode not working?
- Check localStorage permissions
- Try clearing localStorage
- Verify Tailwind CSS `dark:` classes are supported

## 📊 Mock Data Limitations

Currently, only these queries work in mock mode:
- "tb pcr" (any variation)
- "cardiac" (any variation)
- "specimen requirements" (any variation)

Other queries will return "no results found" message.

## 🚧 Differences from Search Interface

| Feature | Chat Interface | Search Interface |
|---------|---------------|------------------|
| Input location | Bottom (fixed) | Top |
| Results display | Streaming, conversational | All at once |
| Sources | Right sidebar | Inline with results |
| History | Preserved in conversation | Single search |
| AI response | Streamed token-by-token | Displayed instantly |
| Mobile UX | Full-screen chat | Scrollable list |
| Follow-ups | Suggested questions | None |

## 🎓 Code Architecture

### `chat.js` - Main Chat Logic

**Key Methods:**
- `handleSendMessage()` - Processes user input
- `streamAIResponse()` - Simulates token streaming
- `updateSources()` - Populates sidebar
- `highlightSource()` - Links citations to sources
- `clearConversation()` - Resets chat

**State Management:**
- `messages[]` - Conversation history
- `sources[]` - Current source documents
- `isProcessing` - Prevents duplicate submissions

### `main-chat.js` - Initialization

**Responsibilities:**
- Initialize `ChatUI` instance
- Setup theme toggle
- Show mock data banner
- Display welcome toast

### `styles-chat.css` - Chat-Specific Styles

**Key Components:**
- Message bubbles (user/AI)
- Typing indicator animation
- Streaming cursor effect
- Source card highlighting
- Responsive breakpoints

## 📱 Mobile Experience

On mobile devices (<768px):
- Sources panel becomes overlay
- "Sources" button in header toggles panel
- Chat input stays fixed at bottom
- Example questions are full-width
- Touch-optimized tap targets

## 🔄 Next Steps

### Phase 2 - Enhanced Chat
- [ ] Multi-turn conversation context
- [ ] Export conversation as PDF
- [ ] Share conversation link
- [ ] Voice input support

### Phase 3 - Advanced Features
- [ ] True streaming from backend (SSE)
- [ ] Real-time collaboration
- [ ] Saved conversations
- [ ] Conversation search

## ✨ Pro Tips

1. **Use Enter for quick sends** - No need to click button
2. **Shift+Enter for multi-line** - Compose longer questions
3. **Click citations** - Quickly jump to exact source
4. **Try follow-up questions** - Build on previous answers
5. **Clear chat to start fresh** - Resets conversation context

## 📄 License

Part of the ADLM 2025 Data Science Challenge.

---

**Status**: ✅ Chat Interface Complete - Streaming, sources, citations working!

**Recommended**: Use this interface for the competition submission
