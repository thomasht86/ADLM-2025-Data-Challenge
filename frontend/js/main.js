/**
 * Main application file for LabDocs Unlocked (Chat Interface)
 * Initializes the chat application and manages global state
 */

class ChatApp {
    constructor() {
        this.chatUI = null;
        this.darkMode = false;
    }

    /**
     * Initialize the application
     */
    init() {
        console.log('🔬 LabDocs Unlocked (Chat Interface) initializing...');
        console.log('📊 Configuration:', CONFIG);

        // Load theme preference
        this.loadTheme();

        // Initialize chat UI
        this.chatUI = new ChatUI();

        // Setup theme toggle
        this.setupThemeToggle();

        // Check if using mock data
        if (CONFIG.api.useMockData) {
            console.warn('⚠️ Using mock data. Set CONFIG.api.useMockData = false to use real API.');
            this.showMockDataBanner();
        }

        // Show welcome message
        this.showWelcomeToast();

        console.log('✅ LabDocs Unlocked initialized successfully!');
    }

    /**
     * Setup theme toggle functionality
     */
    setupThemeToggle() {
        const themeToggle = document.getElementById('theme-toggle');
        if (!themeToggle) return;

        themeToggle.addEventListener('click', () => {
            this.toggleTheme();
        });
    }

    /**
     * Load theme from localStorage
     */
    loadTheme() {
        const savedTheme = Utils.getLocalStorage('theme', 'light');
        if (savedTheme === 'dark') {
            this.enableDarkMode();
        } else {
            this.disableDarkMode();
        }
    }

    /**
     * Toggle between light and dark mode
     */
    toggleTheme() {
        if (this.darkMode) {
            this.disableDarkMode();
        } else {
            this.enableDarkMode();
        }
    }

    /**
     * Enable dark mode
     */
    enableDarkMode() {
        document.documentElement.classList.add('dark');
        this.darkMode = true;
        Utils.setLocalStorage('theme', 'dark');
    }

    /**
     * Disable dark mode
     */
    disableDarkMode() {
        document.documentElement.classList.remove('dark');
        this.darkMode = false;
        Utils.setLocalStorage('theme', 'light');
    }

    /**
     * Show banner indicating mock data is being used
     */
    showMockDataBanner() {
        const banner = document.createElement('div');
        banner.className = 'fixed top-14 left-0 right-0 bg-yellow-100 dark:bg-yellow-900 border-b border-yellow-200 dark:border-yellow-800 px-4 py-2 text-center z-40';
        banner.innerHTML = `
            <p class="text-sm text-yellow-800 dark:text-yellow-200">
                ⚠️ <strong>Development Mode:</strong> Using sample data. Try: "tb pcr", "cardiac", or "specimen requirements"
                <span class="ml-2">
                    <button id="close-banner" class="underline hover:no-underline">Dismiss</button>
                </span>
            </p>
        `;

        document.body.prepend(banner);

        // Add close handler
        document.getElementById('close-banner')?.addEventListener('click', () => {
            banner.remove();
        });

        // Auto-dismiss after 8 seconds
        setTimeout(() => {
            if (banner.parentElement) {
                banner.style.opacity = '0';
                banner.style.transition = 'opacity 0.5s ease-out';
                setTimeout(() => banner.remove(), 500);
            }
        }, 8000);
    }

    /**
     * Show welcome toast with instructions
     */
    showWelcomeToast() {
        // Only show once per session
        const hasSeenWelcome = sessionStorage.getItem('hasSeenWelcome');
        if (hasSeenWelcome) return;

        setTimeout(() => {
            Utils.showToast('👋 Ask me anything about laboratory documentation!', 'info');
            sessionStorage.setItem('hasSeenWelcome', 'true');
        }, 1000);
    }
}

// Initialize app when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.chatApp = new ChatApp();
        window.chatApp.init();
    });
} else {
    window.chatApp = new ChatApp();
    window.chatApp.init();
}
