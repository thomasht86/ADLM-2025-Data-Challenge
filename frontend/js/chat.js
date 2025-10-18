/**
 * Chat interface for LabDocs Unlocked
 */

class ChatUI {
    constructor() {
        this.messages = []; // Conversation history
        this.sources = []; // Current source documents
        this.isProcessing = false;
        this.currentStreamingMessage = null;

        this.initializeElements();
        this.attachEventListeners();
    }

    initializeElements() {
        // Get DOM elements
        this.chatForm = document.getElementById('chat-form');
        this.chatInput = document.getElementById('chat-input');
        this.sendButton = document.getElementById('send-button');
        this.messagesList = document.getElementById('messages-list');
        this.messagesContainer = document.getElementById('messages-container');
        this.welcomeHeader = document.getElementById('welcome-header');
        this.exampleQuestions = document.getElementById('example-questions');
        this.keyboardHint = document.getElementById('keyboard-hint');
        this.chatInputContainer = document.getElementById('chat-input-container');
        this.sourcesPanel = document.getElementById('sources-panel');
        this.sourcesList = document.getElementById('sources-list');
        this.noSources = document.getElementById('no-sources');
        this.sourcesCount = document.getElementById('sources-count');
        this.clearChatBtn = document.getElementById('clear-chat');
        this.toggleSourcesBtn = document.getElementById('toggle-sources');
        this.closeSourcesBtn = document.getElementById('close-sources');
        this.hasStartedChat = false;
    }

    attachEventListeners() {
        // Form submission
        this.chatForm.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleSendMessage();
        });

        // Auto-resize textarea
        this.chatInput.addEventListener('input', () => {
            this.autoResizeTextarea();
        });

        // Handle Enter key (submit) and Shift+Enter (new line)
        this.chatInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.handleSendMessage();
            }
        });

        // Example query buttons
        document.querySelectorAll('.example-query-chat').forEach(button => {
            button.addEventListener('click', (e) => {
                const questionDiv = e.currentTarget.querySelector('div:last-child');
                const question = questionDiv ? questionDiv.textContent.trim() : '';
                if (question) {
                    this.chatInput.value = question;
                    this.handleSendMessage();
                }
            });
        });

        // Clear chat
        this.clearChatBtn.addEventListener('click', () => {
            this.clearConversation();
        });

        // Toggle sources panel (mobile)
        this.toggleSourcesBtn?.addEventListener('click', () => {
            this.sourcesPanel.classList.toggle('show');
        });

        this.closeSourcesBtn?.addEventListener('click', () => {
            this.sourcesPanel.classList.remove('show');
        });
    }

    autoResizeTextarea() {
        this.chatInput.style.height = 'auto';
        this.chatInput.style.height = Math.min(this.chatInput.scrollHeight, 200) + 'px';
    }

    async handleSendMessage() {
        const message = this.chatInput.value.trim();
        if (!message || this.isProcessing) return;

        this.isProcessing = true;
        this.sendButton.disabled = true;

        // Clear input
        this.chatInput.value = '';
        this.chatInput.style.height = 'auto';

        // Handle first message transition
        if (!this.hasStartedChat) {
            this.transitionToChat();
            this.hasStartedChat = true;
        }

        // Add user message
        this.addUserMessage(message);

        // Show typing indicator
        const typingId = this.showTypingIndicator();

        try {
            // Search for documents
            const searchResponse = await apiClient.search(message);

            if (searchResponse.success && searchResponse.data.results.length > 0) {
                // Update sources
                this.updateSources(searchResponse.data.results);

                // Get AI summary
                const documentIds = searchResponse.data.results.map(r => r.id);
                const summaryResponse = await apiClient.synthesize(message, documentIds);

                // Remove typing indicator
                this.removeTypingIndicator(typingId);

                if (summaryResponse.success) {
                    // Stream AI response
                    await this.streamAIResponse(
                        summaryResponse.data.summary,
                        summaryResponse.data.relatedQuestions
                    );
                } else {
                    this.addAIMessage('I apologize, but I encountered an error generating a response. Please try again.');
                }
            } else {
                this.removeTypingIndicator(typingId);
                this.addAIMessage(`I couldn't find any relevant documents for "${message}". Please try rephrasing your question or ask about laboratory protocols, FDA clearances, or testing procedures.`);
            }
        } catch (error) {
            console.error('Chat error:', error);
            this.removeTypingIndicator(typingId);
            this.addAIMessage('I apologize, but something went wrong. Please try again.');
        } finally {
            this.isProcessing = false;
            this.sendButton.disabled = false;
            this.chatInput.focus();
        }
    }

    addUserMessage(text) {
        const messageId = `msg-${Date.now()}`;
        const messageHTML = `
            <div class="message-user flex justify-end fade-in" id="${messageId}">
                <div class="message-user-content">
                    ${Utils.escapeHtml(text)}
                </div>
            </div>
        `;

        this.messagesList.insertAdjacentHTML('beforeend', messageHTML);
        this.messages.push({ type: 'user', text, id: messageId });
        this.scrollToBottom();
    }

    showTypingIndicator() {
        const typingId = `typing-${Date.now()}`;
        const typingHTML = `
            <div class="message-ai flex gap-3 fade-in" id="${typingId}">
                <div class="message-ai-avatar">
                    <span class="text-white text-sm">🤖</span>
                </div>
                <div class="typing-indicator">
                    <div class="typing-dot"></div>
                    <div class="typing-dot"></div>
                    <div class="typing-dot"></div>
                </div>
            </div>
        `;

        this.messagesList.insertAdjacentHTML('beforeend', typingHTML);
        this.scrollToBottom();
        return typingId;
    }

    removeTypingIndicator(typingId) {
        const typingElement = document.getElementById(typingId);
        if (typingElement) {
            typingElement.remove();
        }
    }

    async streamAIResponse(fullText, relatedQuestions = []) {
        const messageId = `msg-${Date.now()}`;

        // Create AI message container
        const messageHTML = `
            <div class="message-ai flex gap-3 fade-in" id="${messageId}">
                <div class="message-ai-avatar">
                    <span class="text-white text-sm">🤖</span>
                </div>
                <div class="message-ai-content">
                    <div class="ai-response-prose text-gray-700 dark:text-gray-300" id="${messageId}-content">
                        <span class="streaming-cursor"></span>
                    </div>
                    <div id="${messageId}-questions" class="mt-4"></div>
                </div>
            </div>
        `;

        this.messagesList.insertAdjacentHTML('beforeend', messageHTML);
        const contentElement = document.getElementById(`${messageId}-content`);
        const questionsElement = document.getElementById(`${messageId}-questions`);

        // Simulate streaming by adding text character by character
        const tokens = fullText.split(' ');
        let displayedText = '';

        for (let i = 0; i < tokens.length; i++) {
            const token = tokens[i] + ' ';
            displayedText += token;

            // Process citations and formatting
            const formattedText = this.formatAIResponse(displayedText);
            contentElement.innerHTML = formattedText + '<span class="streaming-cursor"></span>';

            // Scroll to bottom during streaming
            this.scrollToBottom();

            // Add delay to simulate streaming (adjust speed here)
            await Utils.delay(CONFIG.api.useMockData ? 30 : 10); // Slower in mock mode for effect
        }

        // Remove cursor and finalize
        contentElement.innerHTML = this.formatAIResponse(displayedText);

        // Add citation click handlers
        this.attachCitationHandlers(contentElement);

        // Add related questions
        if (relatedQuestions && relatedQuestions.length > 0) {
            this.renderRelatedQuestions(questionsElement, relatedQuestions);
        }

        this.messages.push({ type: 'ai', text: fullText, id: messageId });
        this.scrollToBottom();
    }

    addAIMessage(text) {
        const messageId = `msg-${Date.now()}`;
        const formattedText = this.formatAIResponse(text);

        const messageHTML = `
            <div class="message-ai flex gap-3 fade-in" id="${messageId}">
                <div class="message-ai-avatar">
                    <span class="text-white text-sm">🤖</span>
                </div>
                <div class="message-ai-content">
                    <div class="ai-response-prose text-gray-700 dark:text-gray-300">
                        ${formattedText}
                    </div>
                </div>
            </div>
        `;

        this.messagesList.insertAdjacentHTML('beforeend', messageHTML);
        this.messages.push({ type: 'ai', text, id: messageId });
        this.scrollToBottom();
    }

    formatAIResponse(text) {
        let formatted = Utils.escapeHtml(text);

        // Convert citations [1], [2] to clickable links
        formatted = formatted.replace(/\[(\d+)\]/g, (match, num) => {
            return `<a href="#source-${num}" class="citation" data-citation="${num}">[${num}]</a>`;
        });

        // Convert line breaks to <br>
        formatted = formatted.replace(/\n\n/g, '</p><p>');
        formatted = '<p>' + formatted + '</p>';

        return formatted;
    }

    attachCitationHandlers(element) {
        element.querySelectorAll('.citation').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const citationNum = parseInt(e.target.dataset.citation);
                this.highlightSource(citationNum - 1); // Convert to 0-based index

                // Show sources panel on mobile
                if (window.innerWidth < 768) {
                    this.sourcesPanel.classList.add('show');
                }
            });
        });
    }

    renderRelatedQuestions(container, questions) {
        const questionsHTML = `
            <div class="mt-3">
                <div class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Related questions:</div>
                ${questions.map(q => `
                    <button class="related-question" data-question="${Utils.escapeHtml(q)}">
                        💡 ${Utils.escapeHtml(q)}
                    </button>
                `).join('')}
            </div>
        `;

        container.innerHTML = questionsHTML;

        // Add click handlers
        container.querySelectorAll('.related-question').forEach(button => {
            button.addEventListener('click', (e) => {
                const question = e.target.dataset.question;
                this.chatInput.value = question;
                this.handleSendMessage();
            });
        });
    }

    transitionToChat() {
        // Fade out and hide welcome elements
        if (this.welcomeHeader) {
            this.welcomeHeader.style.opacity = '0';
            setTimeout(() => {
                this.welcomeHeader.style.display = 'none';
            }, 300);
        }

        if (this.exampleQuestions) {
            this.exampleQuestions.style.opacity = '0';
            setTimeout(() => {
                this.exampleQuestions.style.display = 'none';
            }, 300);
        }

        if (this.keyboardHint) {
            this.keyboardHint.style.opacity = '0';
            setTimeout(() => {
                this.keyboardHint.style.display = 'none';
            }, 300);
        }

        // Move messages container to top
        if (this.messagesContainer) {
            this.messagesContainer.style.justifyContent = 'flex-start';
        }

        // Move chat input to bottom with border
        if (this.chatInputContainer) {
            setTimeout(() => {
                this.chatInputContainer.classList.add('border-t', 'border-gray-200', 'dark:border-gray-700');
                this.chatInputContainer.querySelector('.max-w-4xl').classList.remove('py-6');
                this.chatInputContainer.querySelector('.max-w-4xl').classList.add('py-4');
            }, 300);
        }

        // Show and animate sources button
        setTimeout(() => {
            this.toggleSourcesBtn.classList.remove('hidden', 'opacity-0');
            this.toggleSourcesBtn.classList.add('md:flex', 'opacity-100');
        }, 500);
    }

    updateSources(results) {
        this.sources = results;
        this.noSources.style.display = 'none';
        this.sourcesCount.textContent = results.length;

        // Show sources panel on desktop with smooth transition
        setTimeout(() => {
            this.sourcesPanel.classList.remove('hidden');
            this.sourcesPanel.classList.add('flex');
        }, 300);

        // Render source cards
        this.sourcesList.innerHTML = results.map((source, index) =>
            this.createSourceCard(source, index)
        ).join('');

        // Add click handlers
        this.sourcesList.querySelectorAll('.source-card').forEach((card, index) => {
            card.addEventListener('click', () => {
                const pdfPath = this.sources[index].pdfPath;
                const pageNumber = this.sources[index].pageNumber;
                const url = pageNumber ? `${pdfPath}#page=${pageNumber}` : pdfPath;
                window.open(url, '_blank');
            });
        });
    }

    createSourceCard(source, index) {
        const badgeClass = Utils.getBadgeClass(source.documentType);
        const highlightedSnippet = Utils.highlightText(
            Utils.truncate(source.snippet, 150),
            source.highlights
        );

        return `
            <div class="source-card" id="source-${index + 1}" data-source-index="${index}">
                <div class="flex items-start justify-between mb-2">
                    <span class="badge ${badgeClass}">${Utils.escapeHtml(source.documentType)}</span>
                    <span class="text-xs text-gray-500 dark:text-gray-400">[${index + 1}]</span>
                </div>
                <h4 class="font-medium text-sm text-gray-900 dark:text-white mb-1">
                    ${Utils.escapeHtml(source.title)}
                </h4>
                <div class="text-xs text-gray-600 dark:text-gray-400 mb-2">
                    ${Utils.escapeHtml(source.category)} • ${Utils.formatDate(source.date)}
                </div>
                <div class="text-xs text-gray-700 dark:text-gray-300 leading-relaxed">
                    ${highlightedSnippet}
                </div>
                ${source.section ? `
                    <div class="text-xs text-gray-500 dark:text-gray-400 mt-2">
                        📄 ${Utils.escapeHtml(source.section)}
                    </div>
                ` : ''}
            </div>
        `;
    }

    highlightSource(index) {
        // Remove previous highlights
        this.sourcesList.querySelectorAll('.source-card').forEach(card => {
            card.classList.remove('highlighted');
        });

        // Highlight the selected source
        const sourceCard = this.sourcesList.querySelector(`[data-source-index="${index}"]`);
        if (sourceCard) {
            sourceCard.classList.add('highlighted');
            sourceCard.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

            // Remove highlight after 3 seconds
            setTimeout(() => {
                sourceCard.classList.remove('highlighted');
            }, 3000);
        }
    }

    scrollToBottom() {
        requestAnimationFrame(() => {
            this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;
        });
    }

    clearConversation() {
        if (this.messages.length === 0) return;

        if (confirm('Are you sure you want to clear the conversation?')) {
            this.messages = [];
            this.sources = [];
            this.messagesList.innerHTML = '';
            this.hasStartedChat = false;

            // Reset to welcome state
            if (this.welcomeHeader) {
                this.welcomeHeader.style.display = 'block';
                setTimeout(() => {
                    this.welcomeHeader.style.opacity = '1';
                }, 10);
            }

            if (this.exampleQuestions) {
                this.exampleQuestions.style.display = 'block';
                setTimeout(() => {
                    this.exampleQuestions.style.opacity = '1';
                }, 10);
            }

            if (this.keyboardHint) {
                this.keyboardHint.style.display = 'block';
                setTimeout(() => {
                    this.keyboardHint.style.opacity = '1';
                }, 10);
            }

            // Reset messages container
            if (this.messagesContainer) {
                this.messagesContainer.style.justifyContent = 'center';
            }

            // Reset chat input container
            if (this.chatInputContainer) {
                this.chatInputContainer.classList.remove('border-t', 'border-gray-200', 'dark:border-gray-700');
                const container = this.chatInputContainer.querySelector('.max-w-4xl');
                if (container) {
                    container.classList.remove('py-4');
                    container.classList.add('py-6');
                }
            }

            // Hide sources button
            this.toggleSourcesBtn.classList.add('hidden', 'opacity-0');
            this.toggleSourcesBtn.classList.remove('md:flex', 'opacity-100');

            // Hide sources panel
            this.sourcesPanel.classList.add('hidden');
            this.sourcesPanel.classList.remove('flex');
            this.noSources.style.display = 'block';
            this.sourcesList.innerHTML = '';
            this.sourcesCount.textContent = '0';
        }
    }
}

// Add delay utility
Utils.delay = function (ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
};

// Make ChatUI globally available
window.ChatUI = ChatUI;
