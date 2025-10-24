/**
 * API Client for LabDocs Unlocked
 * Abstracts the data source (mock vs. real API) based on configuration
 */

class APIClient {
    constructor() {
        this.baseUrl = CONFIG.api.baseUrl;
        this.timeout = CONFIG.api.timeout;
        this.useMockData = CONFIG.api.useMockData;
    }

    /**
     * Execute a search query
     * @param {string} query - The search query
     * @param {object} options - Search options (filters, sort, pagination)
     * @returns {Promise<object>} Search results
     */
    async search(query, options = {}) {
        if (this.useMockData) {
            return this._mockSearch(query, options);
        }
        return this._realSearch(query, options);
    }

    /**
     * Get autocomplete suggestions
     * @param {string} query - The partial query
     * @returns {Promise<array>} Suggestions
     */
    async autocomplete(query) {
        if (this.useMockData) {
            return this._mockAutocomplete(query);
        }
        return this._realAutocomplete(query);
    }

    /**
     * Get AI-generated summary and related questions
     * @param {string} query - The search query
     * @param {array} documentIds - Document IDs to synthesize from
     * @returns {Promise<object>} AI summary and related questions
     */
    async synthesize(query, documentIds) {
        if (this.useMockData) {
            return this._mockSynthesize(query, documentIds);
        }
        return this._realSynthesize(query, documentIds);
    }

    // ============ MOCK DATA METHODS ============

    /**
     * Mock search implementation
     */
    async _mockSearch(query, options) {
        // Simulate network delay
        await this._delay(500);

        const results = getMockSearchResults(query);

        // Apply sorting if specified
        if (options.sortBy && results.results.length > 0) {
            results.results = this._sortResults(results.results, options.sortBy);
        }

        return {
            success: true,
            data: results,
        };
    }

    /**
     * Mock autocomplete implementation
     */
    async _mockAutocomplete(query) {
        // Simulate network delay
        await this._delay(200);

        const suggestions = getMockAutocompleteSuggestions(query);

        return {
            success: true,
            data: {
                suggestions: suggestions.slice(0, CONFIG.search.maxSuggestions),
            },
        };
    }

    /**
     * Mock synthesize implementation
     */
    async _mockSynthesize(query, documentIds) {
        // Simulate network delay (longer for AI processing)
        await this._delay(1000);

        const results = getMockSearchResults(query);

        return {
            success: true,
            data: {
                summary: results.aiSummary,
                relatedQuestions: results.relatedQuestions,
            },
        };
    }

    // ============ REAL API METHODS ============

    /**
     * Real search implementation
     */
    async _realSearch(query, options) {
        try {
            const response = await this._fetchWithTimeout(`${this.baseUrl}/query`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    query: query,
                    type: options.searchType || 'hybrid',
                    filters: options.filters || {},
                    limit: options.limit || CONFIG.search.resultsPerPage,
                    offset: options.offset || 0,
                    highlight: true,
                }),
            });

            if (!response.ok) {
                throw new Error(`API request failed: ${response.status} ${response.statusText}`);
            }

            const data = await response.json();

            return {
                success: true,
                data: {
                    totalCount: data.totalCount,
                    results: data.results,
                    facets: data.facets,
                },
            };
        } catch (error) {
            console.error('Search API error:', error);
            return {
                success: false,
                error: error.message,
            };
        }
    }

    /**
     * Real autocomplete implementation
     */
    async _realAutocomplete(query) {
        try {
            const response = await this._fetchWithTimeout(
                `${this.baseUrl}/suggest?q=${encodeURIComponent(query)}&limit=${CONFIG.search.maxSuggestions}`
            );

            if (!response.ok) {
                throw new Error(`API request failed: ${response.status}`);
            }

            const data = await response.json();

            return {
                success: true,
                data: {
                    suggestions: data.suggestions,
                },
            };
        } catch (error) {
            console.error('Autocomplete API error:', error);
            return {
                success: false,
                error: error.message,
            };
        }
    }

    /**
     * Real synthesize implementation
     */
    async _realSynthesize(query, documentIds) {
        try {
            const response = await this._fetchWithTimeout(`${this.baseUrl}/synthesize`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    query: query,
                    documentIds: documentIds,
                    stream: false, // For now, use non-streaming
                }),
            });

            if (!response.ok) {
                throw new Error(`API request failed: ${response.status}`);
            }

            const data = await response.json();

            return {
                success: true,
                data: {
                    summary: data.summary,
                    relatedQuestions: data.relatedQuestions || [],
                },
            };
        } catch (error) {
            console.error('Synthesize API error:', error);
            return {
                success: false,
                error: error.message,
            };
        }
    }

    // ============ HELPER METHODS ============

    /**
     * Fetch with timeout
     */
    async _fetchWithTimeout(url, options = {}) {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), this.timeout);

        try {
            const response = await fetch(url, {
                ...options,
                signal: controller.signal,
            });
            clearTimeout(timeoutId);
            return response;
        } catch (error) {
            clearTimeout(timeoutId);
            if (error.name === 'AbortError') {
                throw new Error('Request timeout');
            }
            throw error;
        }
    }

    /**
     * Simulate network delay
     */
    _delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    /**
     * Sort results
     */
    _sortResults(results, sortBy) {
        const sorted = [...results];

        switch (sortBy) {
            case 'relevance':
                return sorted.sort((a, b) => b.score - a.score);
            case 'date-desc':
                return sorted.sort((a, b) => new Date(b.date) - new Date(a.date));
            case 'date-asc':
                return sorted.sort((a, b) => new Date(a.date) - new Date(b.date));
            case 'title-asc':
                return sorted.sort((a, b) => a.title.localeCompare(b.title));
            case 'title-desc':
                return sorted.sort((a, b) => b.title.localeCompare(a.title));
            default:
                return sorted;
        }
    }
}

// Create global API client instance
window.apiClient = new APIClient();
