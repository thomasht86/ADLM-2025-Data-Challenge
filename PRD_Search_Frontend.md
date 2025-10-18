# Product Requirements Document (PRD)
## LabDocs Unlocked - Search Frontend

**Version**: 1.0
**Date**: October 18, 2025
**Competition**: ADLM 2025 Data Science Challenge
**Document Owner**: [Your Team Name]

---

## 1. Executive Summary

### 1.1 Product Vision
Build an intelligent, Perplexity.ai-style search frontend that enables laboratory professionals to quickly extract and understand information from complex laboratory documentation, including SOPs, FDA 510(k) clearances, and regulatory materials.

### 1.2 Success Metrics
Aligned with ADLM competition scoring criteria:
- **Accuracy** (10 pts): Precise retrieval and presentation of relevant information
- **User Experience** (10 pts): Intuitive, fast, and easy-to-navigate interface
- **Explainability** (10 pts): Clear source citations with jump-to-document capabilities
- **Best Practices** (10 pts): Clean, modular, reusable code with proper documentation

### 1.3 Competition Context
- **Submission Deadline**: November 15, 2025
- **Dataset**: ~3.5GB of laboratory documents (SOPs, FDA clearances)
- **Format**: PDFs converted to Markdown for Vespa indexing
- **Backend**: Vespa search engine with vector/hybrid search capabilities

---

## 2. User Personas

### 2.1 Laura - Laboratory Technologist (Primary)
- **Role**: Performs daily laboratory tests
- **Technical Proficiency**: Moderate
- **Primary Need**: Quick access to specific protocol steps during active testing
- **Typical Queries**: "What are specimen requirements for TB PCR?", "Troubleshooting failed controls"
- **Success Criteria**: Finds answer in <30 seconds without leaving workflow

### 2.2 Dr. Marcus - Laboratory Director
- **Role**: Oversees operations, ensures compliance
- **Technical Proficiency**: High
- **Primary Need**: Verify regulatory compliance, audit preparation
- **Typical Queries**: "All cardiac testing with FDA clearance", "QC requirements for molecular testing"
- **Success Criteria**: Comprehensive results with regulatory references

### 2.3 Sarah - Regulatory Affairs Specialist
- **Role**: Manages FDA submissions and regulatory documentation
- **Technical Proficiency**: High
- **Primary Need**: Find specific regulatory language, cross-reference 510(k)s
- **Typical Queries**: "510(k) submissions for gene expression testing", "Indications for use statements"
- **Success Criteria**: Exact text citations with document metadata

### 2.4 James - Quality Assurance Manager
- **Role**: Ensures protocol compliance, investigates incidents
- **Technical Proficiency**: Moderate-High
- **Primary Need**: Validate procedures, find reference ranges
- **Typical Queries**: "Reference intervals for cardiac biomarkers", "QC acceptance criteria"
- **Success Criteria**: Clear QC specifications with source documentation

### 2.5 Dr. Chen - Clinical Pathologist
- **Role**: Interprets results, provides clinical consultation
- **Technical Proficiency**: High
- **Primary Need**: Clinical context and test limitations during patient care
- **Typical Queries**: "Limitations of TB molecular testing", "Clinical significance of biomarkers"
- **Success Criteria**: Clinically relevant information with interference/limitation details

---

## 3. Product Requirements

### 3.1 Core Features (MVP - Comprehensive)

#### 3.1.1 Perplexity.ai-Style Search Interface

**Description**: Conversational AI-powered search with LLM-generated responses and inline citations.

**User Flow**:
1. User enters natural language query in search bar
2. System shows "Searching..." with real-time progress indicators:
   - "Analyzing query..."
   - "Searching X documents..."
   - "Reviewing Y sources..."
   - "Generating response..."
3. System displays:
   - **LLM-Generated Summary** (conversational answer)
   - **Inline Citations** [1], [2], [3] clickable to source documents
   - **Source Documents** panel with:
     - Document title
     - Document type badge (SOP, 510(k), etc.)
     - Relevant text snippets highlighted
     - "View in PDF" button with jump-to-section link
   - **Related Questions** suggestions for deeper exploration

**Technical Requirements**:
- Execute multiple backend searches before final response
- Real-time streaming of LLM response
- Citation tracking and source linking
- Snippet extraction with context (±2 sentences)

**Acceptance Criteria**:
- [ ] Natural language query processing
- [ ] Multi-stage search execution visible to user
- [ ] LLM response with inline citations
- [ ] Clickable citations jump to specific document sections
- [ ] Source panel with PDF links and highlighted snippets
- [ ] Related questions generation

---

#### 3.1.2 Advanced Search Capabilities

**A. Basic Keyword Search**
- Full-text search across all document content
- Boolean operators (AND, OR, NOT)
- Phrase matching with quotes
- Wildcard support (*, ?)

**B. Semantic/Vector Search**
- Meaning-based search beyond exact keywords
- Query: "heart rejection monitoring" returns "AlloMap cardiac allograft gene expression"
- Relevance ranking combining keyword + semantic similarity

**C. Autocomplete/Suggestions**
- Real-time query suggestions as user types
- Based on:
  - Document titles
  - Common medical terms
  - Procedure names
  - Previous queries (if stored)
- Debounced API calls (300ms delay)

**D. Hybrid Search Strategy**
- Combine keyword (BM25) + vector (HNSW) + LLM reasoning
- Weighted ranking algorithm
- User can toggle search modes (if needed for debugging/testing)

**Acceptance Criteria**:
- [ ] Keyword search with boolean operators
- [ ] Semantic search returns contextually relevant results
- [ ] Autocomplete shows suggestions <500ms
- [ ] Hybrid ranking produces superior results to single method

---

#### 3.1.3 Filters and Facets

**Filter Categories**:

1. **Document Type**
   - Standard Operating Procedure (SOP)
   - FDA 510(k) Clearance
   - Package Insert
   - Other Regulatory Document

2. **Medical Specialty** (Categories)
   - Immunology
   - Cardiology
   - Molecular Diagnostics
   - Clinical Chemistry
   - Hematology
   - Microbiology
   - Toxicology
   - Other

3. **Date Range**
   - Last modified date
   - Approval date (for regulatory docs)
   - Date picker: From - To
   - Presets: Last 30 days, Last year, Last 5 years

4. **Regulatory Status** (for FDA docs)
   - Approved
   - Cleared (510(k))
   - Pending
   - De Novo

5. **Test Type**
   - PCR/Molecular
   - Immunoassay
   - Clinical Chemistry
   - Immunostain
   - Gene Panel/NGS
   - Other

**Filter UI**:
- Left sidebar (collapsible on mobile)
- Multi-select checkboxes
- Active filters shown as removable chips above results
- Filter counts showing # of matching documents
- "Clear All Filters" button

**Acceptance Criteria**:
- [ ] All filter categories functional
- [ ] Multi-select filters with AND/OR logic
- [ ] Filter counts update in real-time
- [ ] Active filters displayed as removable chips
- [ ] Filters persist during session
- [ ] Mobile-responsive filter panel

---

#### 3.1.4 Sorting Options

**Sort By**:
- Relevance (default) - Vespa ranking score
- Date (newest first)
- Date (oldest first)
- Alphabetical (A-Z)
- Alphabetical (Z-A)
- Document Type

**UI**:
- Dropdown in results header
- Icon indicates current sort direction
- Preserves filters when changing sort

**Acceptance Criteria**:
- [ ] All sort options functional
- [ ] Sort persists with filters
- [ ] Visual indicator of active sort

---

#### 3.1.5 Results Display with Explainability

**Result Card Components**:

```
┌─────────────────────────────────────────────────────────────┐
│ [Badge: SOP] MYCOBACTERIUM_TUBERCULOSIS_PCR                 │
│ Laboratory Protocol • Microbiology • Modified: 2024-10-15   │
├─────────────────────────────────────────────────────────────┤
│ "...Specimen Types: Sputum, BAL, tissue, other body        │
│  fluids. Collection: Collect specimens in sterile           │
│  containers. Transport: Transport specimens to the          │
│  laboratory immediately..."                                  │
│                                                              │
│ [View Full Document →] [Jump to Section: Specimen Req.]    │
└─────────────────────────────────────────────────────────────┘
```

**Required Elements**:
- Document title (linked)
- Document type badge (color-coded)
- Metadata: Category, Date, Status
- **Highlighted snippet** (query terms highlighted)
- Relevance score (optional, for debugging)
- **"View Full Document" button** → Opens PDF in new tab
- **"Jump to Section" button** → Deep link to specific PDF page/section
- Citation number for LLM response references [1], [2], etc.

**Snippet Extraction**:
- Extract 2-3 sentences around matching text
- Highlight query terms in yellow/bold
- Show "..." for truncated content
- Click snippet to expand inline or jump to document

**PDF Jump-to-Section**:
- Use PDF page numbers from Vespa metadata
- URL format: `LabDocs/{filename}.pdf#page=X`
- Section markers if available (e.g., "Procedure", "Equipment")

**Pagination**:
- 10 results per page (configurable)
- Infinite scroll OR pagination controls
- "Load more" button
- Jump to page number

**Acceptance Criteria**:
- [ ] All metadata displayed correctly
- [ ] Query terms highlighted in snippets
- [ ] "View Full Document" opens correct PDF
- [ ] "Jump to Section" navigates to specific location
- [ ] Citations link bidirectionally (result ↔ LLM answer)
- [ ] Pagination/infinite scroll functional
- [ ] Mobile-responsive cards

---

#### 3.1.6 LLM-Generated Response

**Response Components**:

```
┌─────────────────────────────────────────────────────────────┐
│ 🤖 AI Summary                                                │
├─────────────────────────────────────────────────────────────┤
│ For Mycobacterium tuberculosis PCR testing, specimen        │
│ collection requires sterile containers [1]. Acceptable      │
│ specimen types include sputum, bronchoalveolar lavage       │
│ (BAL), tissue, and other body fluids [1]. Specimens should  │
│ be transported to the laboratory immediately, or            │
│ refrigerated at 2-8°C if delays are expected [1].           │
│                                                              │
│ The PCR analysis uses a threshold Ct value of 35, where     │
│ Ct < 35 is considered positive [2]. Results are reported    │
│ as qualitative (Positive/Negative/Indeterminate) [2].       │
│                                                              │
│ [1] MYCOBACTERIUM_TUBERCULOSIS_PCR - Section 3              │
│ [2] MYCOBACTERIUM_TUBERCULOSIS_PCR - Section 4.C            │
└─────────────────────────────────────────────────────────────┘
```

**Technical Flow**:
1. **Query Analysis**: LLM analyzes user intent
2. **Multi-Stage Search**:
   - Initial broad search (retrieve top 20 documents)
   - Refined search based on LLM analysis (retrieve top 10 passages)
   - Follow-up searches for specific entities if needed
3. **Synthesis**: LLM generates coherent answer from retrieved passages
4. **Citation Mapping**: Track which passages contributed to each sentence
5. **Streaming**: Stream LLM response token-by-token

**Response Requirements**:
- Conversational, easy-to-read tone
- Factual, no hallucinations (grounded in sources)
- **Every claim cited** with [number] notation
- Citations clickable to source documents
- "Show sources" expandable section
- "Regenerate" button for new synthesis

**Multi-Search Strategy**:
- Search 1: Broad keyword + semantic search → Top 20 docs
- Search 2: LLM extracts key entities → Focused search
- Search 3 (if needed): Follow-up for missing information
- Show progress: "Searching... (1/3)", "Analyzing sources (2/3)", "Generating answer (3/3)"

**Acceptance Criteria**:
- [ ] LLM generates accurate, cited responses
- [ ] All claims have citations
- [ ] Citations are clickable and accurate
- [ ] Multi-stage search visible to user
- [ ] Streaming response for better UX
- [ ] No hallucinations (verify with test set)
- [ ] "Regenerate" produces new response

---

#### 3.1.7 Related Questions / Query Refinement

**Feature**: Suggest follow-up questions based on current results

**Example**:
```
Query: "What are specimen requirements for TB PCR?"

Related Questions:
• "What is the transport temperature for TB specimens?"
• "How long can TB specimens be stored before testing?"
• "What are the quality control requirements for TB PCR?"
• "What causes false negatives in TB PCR?"
```

**Generation Strategy**:
- LLM-generated based on retrieved documents
- 3-5 suggestions
- Click to execute new search
- Tracks query history for context

**Acceptance Criteria**:
- [ ] 3-5 relevant questions generated
- [ ] Clicking question executes new search
- [ ] Questions contextually relevant to current query

---

### 3.2 User Interface Requirements

#### 3.2.1 Tech Stack

**Core Technologies**:
- **Vanilla JavaScript** (ES6+)
- **BasecoatUI** (https://basecoatui.com/)
  - Tailwind CSS for styling
  - Alpine.js for interactivity
  - HTMX for dynamic content
- **No React/Vue/Angular** (per requirements)

**UI Components from BasecoatUI**:
- `input` - Search bar
- `button` - Action buttons
- `card` - Result cards
- `badge` - Document type tags
- `dropdown-menu` - Sort/filter menus
- `dialog` - Modals for full document view
- `tabs` - Category tabs
- `accordion` - Expandable filters
- `tooltip` - Help text
- `skeleton` - Loading states
- `toast` - Notifications
- `theme-switcher` - Dark/light mode

#### 3.2.2 Layout Structure

```
┌─────────────────────────────────────────────────────────────┐
│  [Logo] LabDocs Unlocked          [Dark Mode] [Help] [•••] │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌────────────────────────────────────────────────────┐    │
│  │ 🔍 Search laboratory documentation...          [→] │    │
│  └────────────────────────────────────────────────────┘    │
│        [Autocomplete suggestions...]                        │
│                                                              │
├──────────────┬──────────────────────────────────────────────┤
│              │  🤖 AI Summary                               │
│  FILTERS     │  [LLM Response with citations]               │
│              │                                              │
│  Document    │  ┌──────────────────────────────────────┐   │
│  Type        │  │ Source Documents (8)                 │   │
│  ☑ SOP       │  └──────────────────────────────────────┘   │
│  ☑ 510(k)    │                                              │
│              │  [Result Card 1]                             │
│  Category    │  [Result Card 2]                             │
│  ☐ Cardio    │  [Result Card 3]                             │
│  ☑ Immuno    │  ...                                         │
│              │                                              │
│  Date Range  │  Related Questions:                          │
│  [From][To]  │  • Question 1                               │
│              │  • Question 2                               │
│              │                                              │
│  [Clear All] │  [Load More Results]                        │
└──────────────┴──────────────────────────────────────────────┘
```

#### 3.2.3 Design Principles

**Visual Design**:
- Clean, distraction-free interface (like Perplexity)
- Professional medical/laboratory aesthetic
- Color-coded badges for document types
- High contrast for readability
- Generous whitespace

**Interaction Design**:
- Keyboard navigation support (Tab, Enter, Esc)
- Loading states for all async operations
- Smooth transitions and animations
- Progressive disclosure (show more/less)
- Error states with helpful messages

**Responsive Design**:
- Mobile-first approach
- Breakpoints: 640px (mobile), 768px (tablet), 1024px (desktop)
- Collapsible filter sidebar on mobile
- Touch-friendly tap targets (min 44×44px)

**Accessibility (WCAG 2.1 Level AA)**:
- Semantic HTML
- ARIA labels for screen readers
- Keyboard navigation
- Color contrast ratios ≥4.5:1
- Focus indicators
- Alt text for icons

**Performance**:
- First Contentful Paint < 1.5s
- Time to Interactive < 3s
- Lazy load images/PDFs
- Debounced search input
- Virtualized long lists if needed

**Acceptance Criteria**:
- [ ] Layout matches mockup
- [ ] Responsive on mobile/tablet/desktop
- [ ] Dark/light theme functional
- [ ] WCAG 2.1 AA compliant
- [ ] Keyboard navigation works
- [ ] Loading states for all actions
- [ ] Performance metrics met

---

### 3.3 Backend Integration Requirements

#### 3.3.1 Vespa API Endpoints

**Search Endpoint**:
```
POST /search/api/v1/query
Content-Type: application/json

{
  "query": "specimen requirements TB PCR",
  "type": "hybrid",  // keyword | semantic | hybrid
  "filters": {
    "documentType": ["SOP"],
    "category": ["Microbiology"],
    "dateRange": {"from": "2020-01-01", "to": "2025-10-18"}
  },
  "limit": 10,
  "offset": 0,
  "highlight": true
}
```

**Response Format**:
```json
{
  "totalCount": 45,
  "results": [
    {
      "id": "doc123",
      "title": "MYCOBACTERIUM_TUBERCULOSIS_PCR",
      "documentType": "SOP",
      "category": "Microbiology",
      "date": "2024-10-15",
      "snippet": "...Specimen Types: Sputum, BAL, tissue...",
      "highlights": [
        {"field": "content", "text": "specimen requirements", "position": 1234}
      ],
      "score": 0.87,
      "pdfPath": "/LabDocs/Synthetic_Procedures/MYCOBACTERIUM_TUBERCULOSIS_PCR.pdf",
      "section": "Specimen Requirements and Stability",
      "pageNumber": 2
    }
  ],
  "facets": {
    "documentType": {"SOP": 30, "510(k)": 15},
    "category": {"Microbiology": 12, "Immunology": 8}
  }
}
```

**Autocomplete Endpoint**:
```
GET /search/api/v1/suggest?q=speci&limit=5

Response:
{
  "suggestions": [
    "specimen requirements",
    "specimen collection",
    "specimen transport",
    "specimen stability",
    "specimen rejection criteria"
  ]
}
```

**LLM Synthesis Endpoint**:
```
POST /search/api/v1/synthesize
Content-Type: application/json

{
  "query": "What are specimen requirements for TB PCR?",
  "documentIds": ["doc123", "doc124", "doc125"],
  "stream": true
}

Response (Server-Sent Events):
data: {"token": "For", "citation": null}
data: {"token": " Mycobacterium", "citation": null}
data: {"token": " tuberculosis", "citation": null}
...
data: {"token": "[1]", "citation": {"docId": "doc123", "section": "..."}}
...
```

**Related Questions Endpoint**:
```
POST /search/api/v1/related-questions

{
  "query": "What are specimen requirements for TB PCR?",
  "documentIds": ["doc123", "doc124"]
}

Response:
{
  "questions": [
    "What is the transport temperature for TB specimens?",
    "How long can TB specimens be stored?",
    "What causes false negatives in TB PCR?"
  ]
}
```

**Error Handling**:
- HTTP 400: Bad request (invalid query)
- HTTP 404: No results found
- HTTP 429: Rate limit exceeded
- HTTP 500: Server error
- HTTP 503: Service unavailable

**Acceptance Criteria**:
- [ ] All endpoints documented
- [ ] Error handling for all status codes
- [ ] Request/response validation
- [ ] Timeout handling (30s max)
- [ ] Retry logic for transient failures

---

### 3.4 Vespa Schema Requirements

**Document Schema** (to be defined with backend team):

```yaml
schema labdoc {

  document labdoc {

    field doc_id type string {
      indexing: summary | attribute
    }

    field title type string {
      indexing: summary | index
      index: enable-bm25
    }

    field document_type type string {
      indexing: summary | attribute
      attribute: fast-search
    }

    field category type string {
      indexing: summary | attribute
      attribute: fast-search
    }

    field date type long {
      indexing: summary | attribute
      attribute: fast-search
    }

    field content type string {
      indexing: summary | index
      index: enable-bm25
    }

    field content_embedding type tensor<float>(x[768]) {
      indexing: embed | attribute | index
      attribute {
        distance-metric: angular
      }
      index {
        hnsw {
          max-links-per-node: 16
          neighbors-to-explore-at-insert: 200
        }
      }
    }

    field sections type array<string> {
      indexing: summary | attribute
    }

    field page_numbers type array<int> {
      indexing: summary | attribute
    }

    field pdf_path type string {
      indexing: summary | attribute
    }

    field test_type type string {
      indexing: summary | attribute
      attribute: fast-search
    }

    field regulatory_status type string {
      indexing: summary | attribute
      attribute: fast-search
    }

  }

  fieldset default {
    fields: title, content
  }

  rank-profile hybrid {
    first-phase {
      expression: 0.7 * bm25(title) + 0.3 * bm25(content)
    }
    second-phase {
      expression: 0.5 * firstPhase + 0.5 * closeness(field, content_embedding)
    }
  }

}
```

**Key Fields**:
- `title`: Document title (indexed for keyword search)
- `content`: Full document text (indexed + embeddings)
- `content_embedding`: Vector embeddings for semantic search
- `document_type`: SOP, 510(k), etc. (filterable)
- `category`: Medical specialty (filterable)
- `date`: Last modified / approval date (sortable, filterable)
- `sections`: Array of section names for jump-to links
- `page_numbers`: Array mapping sections to pages
- `pdf_path`: Path to original PDF file
- `test_type`: PCR, immunoassay, etc. (filterable)
- `regulatory_status`: For FDA documents (filterable)

**Indexing Strategy**:
- Chunk documents by section (not whole document)
- Each chunk = 1 Vespa document with metadata
- Preserves context while enabling precise retrieval
- Max chunk size: ~500 tokens

**Acceptance Criteria**:
- [ ] Schema supports all required filters
- [ ] Hybrid search (BM25 + vector) configured
- [ ] Metadata fields for explainability
- [ ] Document chunking strategy defined

---

## 4. Non-Functional Requirements

### 4.1 Performance
- Search results return < 2 seconds (p95)
- Autocomplete suggestions < 500ms (p95)
- LLM response starts streaming < 3 seconds
- Page load time < 2 seconds
- Supports 100 concurrent users

### 4.2 Scalability
- Handle 3.5GB+ document corpus
- Support for corpus growth (10GB+)
- Efficient caching strategy

### 4.3 Security
- No authentication required for competition
- Input sanitization (prevent XSS)
- Rate limiting on API calls
- HTTPS only in production

### 4.4 Browser Support
- Chrome/Edge (latest 2 versions)
- Firefox (latest 2 versions)
- Safari (latest 2 versions)
- Mobile browsers (iOS Safari, Chrome Android)

### 4.5 Code Quality
- ESLint + Prettier for code formatting
- Modular architecture (separate JS modules)
- Commented code (JSDoc style)
- Unit tests for core functions (optional but recommended)
- Git commit history showing logical development

### 4.6 Deployment
- Dockerized application
- `docker-compose.yml` for easy setup
- Environment variables for configuration
- README with setup instructions
- Demo video/screenshots

---

## 5. Out of Scope (Post-MVP)

### 5.1 Future Enhancements
- User authentication and saved searches
- Query history and bookmarking
- Document upload by users
- Collaborative annotations
- Multi-language support
- Advanced analytics dashboard
- Export search results (CSV, PDF)
- API for external integrations
- Mobile native app
- Voice search

### 5.2 Not Included
- Document editing capabilities
- Version control for documents
- User management system
- Payment/subscription features

---

## 6. Technical Architecture

### 6.1 Frontend Architecture

```
src/
├── index.html              # Main HTML
├── css/
│   └── styles.css          # Custom Tailwind styles
├── js/
│   ├── main.js            # App initialization
│   ├── search.js          # Search logic
│   ├── api.js             # Vespa API client
│   ├── llm.js             # LLM response handling
│   ├── filters.js         # Filter state management
│   ├── results.js         # Results rendering
│   ├── autocomplete.js    # Autocomplete logic
│   └── utils.js           # Helper functions
├── components/            # Reusable UI components
│   ├── SearchBar.js
│   ├── FilterPanel.js
│   ├── ResultCard.js
│   ├── LLMResponse.js
│   └── RelatedQuestions.js
└── config.js              # Configuration
```

### 6.2 State Management
- Vanilla JS with event-driven architecture
- Custom event bus for component communication
- LocalStorage for session persistence (filters, theme)

### 6.3 API Communication
- Fetch API for HTTP requests
- EventSource for SSE (streaming LLM responses)
- AbortController for request cancellation
- Retry logic with exponential backoff

### 6.4 Rendering Strategy
- Template literals for HTML generation
- Incremental rendering for large result sets
- Virtual scrolling for 100+ results (if needed)

---

## 7. Development Phases

### Phase 1: Foundation (Week 1)
- [ ] Project setup (BasecoatUI, Tailwind, build tools)
- [ ] Basic HTML layout and navigation
- [ ] Vespa API client implementation
- [ ] Basic keyword search
- [ ] Simple results display

### Phase 2: Core Search (Week 2)
- [ ] Autocomplete/suggestions
- [ ] Filter panel implementation
- [ ] Sorting functionality
- [ ] Snippet highlighting
- [ ] Pagination/infinite scroll

### Phase 3: AI Features (Week 3)
- [ ] LLM response integration
- [ ] Citation tracking and linking
- [ ] Multi-stage search flow
- [ ] Related questions generation
- [ ] Progress indicators

### Phase 4: Explainability (Week 4)
- [ ] PDF jump-to-section links
- [ ] Source document panel
- [ ] Citation bidirectional linking
- [ ] Snippet expansion
- [ ] Document metadata display

### Phase 5: Polish (Week 5)
- [ ] Responsive design refinement
- [ ] Dark mode
- [ ] Accessibility audit
- [ ] Performance optimization
- [ ] Error handling and edge cases

### Phase 6: Testing & Deployment (Week 6-7)
- [ ] Cross-browser testing
- [ ] User acceptance testing
- [ ] Documentation (README, setup guide)
- [ ] Docker containerization
- [ ] Competition submission prep

---

## 8. Success Criteria & Testing

### 8.1 Accuracy Testing
- Test set of 50 queries with known correct answers
- Measure precision@10, recall@10, MRR
- LLM response accuracy (manual evaluation)
- Citation accuracy (every claim verifiable)

### 8.2 User Experience Testing
- Task completion time (find answer to query)
- User satisfaction survey (5 test users)
- Accessibility audit (automated + manual)
- Mobile usability testing

### 8.3 Explainability Testing
- Verify all citations link to correct documents
- Test PDF jump-to-section functionality
- Ensure snippets provide adequate context
- Validate source transparency

### 8.4 Best Practices Validation
- Code review checklist
- ESLint/Prettier passing
- Git commit history review
- Documentation completeness
- Deployment testing (fresh install)

---

## 9. Open Questions & Decisions Needed

### 9.1 Vespa Schema
- **Q**: What embedding model for vectors? (e.g., BERT, sentence-transformers?)
- **Q**: Chunking strategy - by section or fixed token size?
- **Q**: How to handle section metadata (page numbers, headings)?

### 9.2 LLM Integration
- **Q**: Which LLM? (Claude, GPT-4, open-source?)
- **Q**: Prompt engineering for citation generation?
- **Q**: Token limits and cost considerations?

### 9.3 Document Processing
- **Q**: How to extract section headings from PDFs?
- **Q**: How to map markdown back to PDF page numbers?
- **Q**: Handle tables/figures in PDFs?

### 9.4 Category Taxonomy
- **Q**: Finalize list of medical specialties for filters?
- **Q**: Auto-categorization strategy (rule-based or ML)?

---

## 10. Appendix

### 10.1 References
- ADLM 2025 Data Challenge: https://github.com/myADLM/ADLM-2025-Data-Challenge
- BasecoatUI Docs: https://basecoatui.com/
- Perplexity.ai: https://perplexity.ai (UX reference)
- Vespa Documentation: https://docs.vespa.ai/

### 10.2 Glossary
- **SOP**: Standard Operating Procedure
- **510(k)**: FDA premarket notification
- **BM25**: Keyword ranking algorithm
- **HNSW**: Hierarchical Navigable Small World (vector index)
- **SSE**: Server-Sent Events (streaming)
- **Ct**: Cycle threshold (PCR)
- **LLM**: Large Language Model
- **MRR**: Mean Reciprocal Rank

### 10.3 Contact
- Team Lead: [Name]
- Backend Lead: [Name]
- Frontend Lead: [Name]
- QA Lead: [Name]

---

**Document Status**: Draft v1.0 - Awaiting stakeholder review

**Next Steps**:
1. Review and approve PRD
2. Define Vespa schema with backend team
3. Set up development environment
4. Begin Phase 1 implementation

