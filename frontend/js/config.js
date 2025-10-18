/**
 * Configuration file for LabDocs Unlocked
 */

const CONFIG = {
    // API Configuration
    api: {
        baseUrl: 'http://localhost:8080/search/api/v1', // Vespa API endpoint
        timeout: 30000, // 30 seconds
        useMockData: true, // Set to false when backend is ready
    },

    // Search Configuration
    search: {
        debounceDelay: 300, // milliseconds
        minQueryLength: 2,
        resultsPerPage: 10,
        maxSuggestions: 5,
    },

    // UI Configuration
    ui: {
        enableDarkMode: true,
        enableAnimations: true,
        highlightColor: '#fef08a',
    },

    // Feature Flags
    features: {
        enableAISummary: true,
        enableRelatedQuestions: true,
        enableAutocomplete: true,
        enableFilters: false, // To be implemented in next iteration
    },
};

// Make config globally available
window.CONFIG = CONFIG;
