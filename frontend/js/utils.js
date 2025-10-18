/**
 * Utility functions for LabDocs Unlocked
 */

const Utils = {
    /**
     * Debounce function to limit rate of function calls
     * @param {Function} func - Function to debounce
     * @param {number} wait - Wait time in milliseconds
     * @returns {Function} Debounced function
     */
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },

    /**
     * Highlight search terms in text
     * @param {string} text - Text to highlight
     * @param {string|array} terms - Term(s) to highlight
     * @returns {string} HTML with highlighted terms
     */
    highlightText(text, terms) {
        if (!text || !terms) return text;

        const termsArray = Array.isArray(terms) ? terms : [terms];
        let highlightedText = text;

        termsArray.forEach(term => {
            if (term && term.length > 0) {
                const regex = new RegExp(`(${this.escapeRegex(term)})`, 'gi');
                highlightedText = highlightedText.replace(regex, '<span class="highlight">$1</span>');
            }
        });

        return highlightedText;
    },

    /**
     * Escape special regex characters
     * @param {string} string - String to escape
     * @returns {string} Escaped string
     */
    escapeRegex(string) {
        return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    },

    /**
     * Escape HTML to prevent XSS
     * @param {string} text - Text to escape
     * @returns {string} Escaped text
     */
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    },

    /**
     * Format date to readable string
     * @param {string} dateString - Date string
     * @returns {string} Formatted date
     */
    formatDate(dateString) {
        if (!dateString) return 'N/A';

        const date = new Date(dateString);
        const now = new Date();
        const diffTime = Math.abs(now - date);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays < 30) {
            return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`;
        } else if (diffDays < 365) {
            const months = Math.floor(diffDays / 30);
            return `${months} month${months !== 1 ? 's' : ''} ago`;
        } else {
            return date.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
            });
        }
    },

    /**
     * Get badge class for document type
     * @param {string} docType - Document type
     * @returns {string} Badge CSS class
     */
    getBadgeClass(docType) {
        const type = docType.toLowerCase();
        if (type === 'sop') return 'badge-sop';
        if (type === '510(k)') return 'badge-510k';
        return 'badge-other';
    },

    /**
     * Truncate text to specified length
     * @param {string} text - Text to truncate
     * @param {number} maxLength - Maximum length
     * @returns {string} Truncated text
     */
    truncate(text, maxLength = 200) {
        if (!text || text.length <= maxLength) return text;
        return text.substr(0, maxLength) + '...';
    },

    /**
     * Parse citations from AI summary text
     * @param {string} text - Text with citations like [1], [2]
     * @returns {object} Parsed text and citation map
     */
    parseCitations(text) {
        if (!text) return { text: '', citations: {} };

        const citationRegex = /\[(\d+)\]/g;
        const citations = {};
        let match;

        while ((match = citationRegex.exec(text)) !== null) {
            citations[match[1]] = {
                index: match[1],
                position: match.index,
            };
        }

        return {
            text: text,
            citations: citations,
        };
    },

    /**
     * Show toast notification
     * @param {string} message - Message to display
     * @param {string} type - Type (success, error, info)
     */
    showToast(message, type = 'info') {
        // Simple toast implementation
        const toast = document.createElement('div');
        toast.className = `fixed bottom-4 right-4 px-6 py-3 rounded-lg shadow-lg text-white ${
            type === 'error' ? 'bg-red-500' :
            type === 'success' ? 'bg-green-500' :
            'bg-blue-500'
        } fade-in z-50`;
        toast.textContent = message;

        document.body.appendChild(toast);

        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transition = 'opacity 0.3s ease-out';
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    },

    /**
     * Store data in localStorage with error handling
     * @param {string} key - Storage key
     * @param {*} value - Value to store
     */
    setLocalStorage(key, value) {
        try {
            localStorage.setItem(key, JSON.stringify(value));
        } catch (error) {
            console.error('localStorage error:', error);
        }
    },

    /**
     * Retrieve data from localStorage
     * @param {string} key - Storage key
     * @param {*} defaultValue - Default value if key doesn't exist
     * @returns {*} Retrieved value or default
     */
    getLocalStorage(key, defaultValue = null) {
        try {
            const item = localStorage.getItem(key);
            return item ? JSON.parse(item) : defaultValue;
        } catch (error) {
            console.error('localStorage error:', error);
            return defaultValue;
        }
    },

    /**
     * Smooth scroll to element
     * @param {string|HTMLElement} target - Element or selector
     */
    smoothScrollTo(target) {
        const element = typeof target === 'string'
            ? document.querySelector(target)
            : target;

        if (element) {
            element.scrollIntoView({
                behavior: 'smooth',
                block: 'start',
            });
        }
    },
};

// Make utilities globally available
window.Utils = Utils;
