/**
 * ========================================
 * Quote Generator - JavaScript
 * Pure Vanilla JS, No Frameworks
 * ========================================
 */

// ========================================
// QUOTE DATA
// ========================================

const quotes = [
    // Success Category
    { id: 1, text: "The only way to do great work is to love what you do.", author: "Steve Jobs", category: "success" },
    { id: 2, text: "Success is not final, failure is not fatal: it is the courage to continue that counts.", author: "Winston Churchill", category: "success" },
    { id: 3, text: "Success usually comes to those who are too busy to be looking for it.", author: "Henry David Thoreau", category: "success" },
    { id: 4, text: "Don't be afraid to give up the good to go for the great.", author: "John D. Rockefeller", category: "success" },
    { id: 5, text: "I find that the harder I work, the more luck I seem to have.", author: "Thomas Jefferson", category: "success" },
    
    // Love Category
    { id: 6, text: "The best thing to hold onto in life is each other.", author: "Audrey Hepburn", category: "love" },
    { id: 7, text: "Love is composed of a single soul inhabiting two bodies.", author: "Aristotle", category: "love" },
    { id: 8, text: "Where there is love there is life.", author: "Mahatma Gandhi", category: "love" },
    { id: 9, text: "The greatest happiness of life is the conviction that we are loved.", author: "Victor Hugo", category: "love" },
    { id: 10, text: "To love and be loved is to feel the sun from both sides.", author: "David Viscott", category: "love" },
    
    // Coding Category
    { id: 11, text: "First, solve the problem. Then, write the code.", author: "John Johnson", category: "coding" },
    { id: 12, text: "Code is like humor. When you have to explain it, it's bad.", author: "Cory House", category: "coding" },
    { id: 13, text: "Any fool can write code that a computer can understand. Good programmers write code that humans can understand.", author: "Martin Fowler", category: "coding" },
    { id: 14, text: "Experience is the name everyone gives to their mistakes.", author: "Oscar Wilde", category: "coding" },
    { id: 15, text: "The most disastrous thing that you can ever learn is your first programming language.", author: "Alan Kay", category: "coding" },
    
    // Life Category
    { id: 16, text: "In the end, it's not the years in your life that count. It's the life in your years.", author: "Abraham Lincoln", category: "life" },
    { id: 17, text: "Life is what happens when you're busy making other plans.", author: "John Lennon", category: "life" },
    { id: 18, text: "The purpose of our lives is to be happy.", author: "Dalai Lama", category: "life" },
    { id: 19, text: "Life is really simple, but we insist on making it complicated.", author: "Confucius", category: "life" },
    { id: 20, text: "Get busy living or get busy dying.", author: "Stephen King", category: "life" },
    
    // Motivation Category
    { id: 21, text: "The only impossible journey is the one you never begin.", author: "Tony Robbins", category: "motivation" },
    { id: 22, text: "Everything you've ever wanted is on the other side of fear.", author: "George Addair", category: "motivation" },
    { id: 23, text: "Believe you can and you're halfway there.", author: "Theodore Roosevelt", category: "motivation" },
    { id: 24, text: "The future belongs to those who believe in the beauty of their dreams.", author: "Eleanor Roosevelt", category: "motivation" },
    { id: 25, text: "It does not matter how slowly you go as long as you do not stop.", author: "Confucius", category: "motivation" }
];

// ========================================
// STATE MANAGEMENT
// ========================================

const state = {
    currentQuote: null,
    currentCategory: 'all',
    favorites: [],
    isTransitioning: false
};

// ========================================
// DOM ELEMENTS
// ========================================

const elements = {
    // Quote Display
    quoteCard: document.getElementById('quoteCard'),
    quoteContent: document.getElementById('quoteContent'),
    quoteText: document.getElementById('quoteText'),
    quoteAuthor: document.getElementById('quoteAuthor'),
    quoteCategory: document.getElementById('quoteCategory'),
    
    // Buttons
    newQuoteBtn: document.getElementById('newQuoteBtn'),
    favoriteBtn: document.getElementById('favoriteBtn'),
    copyBtn: document.getElementById('copyBtn'),
    tweetBtn: document.getElementById('tweetBtn'),
    viewFavoritesBtn: document.getElementById('viewFavoritesBtn'),
    
    // Category
    categoryButtons: document.querySelectorAll('.category-btn'),
    
    // Favorites Modal
    favoritesModal: document.getElementById('favoritesModal'),
    modalOverlay: document.getElementById('modalOverlay'),
    closeModalBtn: document.getElementById('closeModalBtn'),
    favoritesList: document.getElementById('favoritesList'),
    emptyFavorites: document.getElementById('emptyFavorites'),
    favoritesCount: document.getElementById('favoritesCount'),
    
    // Toast
    toast: document.getElementById('toast'),
    toastMessage: document.getElementById('toastMessage'),
    
    // Loading
    loadingOverlay: document.getElementById('loadingOverlay')
};

// ========================================
// STORAGE HANDLING
// ========================================

/**
 * Load favorites from localStorage
 * @returns {Array} Array of favorite quote IDs
 */
function loadFavorites() {
    try {
        const stored = localStorage.getItem('quoteGeneratorFavorites');
        return stored ? JSON.parse(stored) : [];
    } catch (error) {
        console.error('Error loading favorites:', error);
        return [];
    }
}

/**
 * Save favorites to localStorage
 * @param {Array} favorites - Array of favorite quote IDs
 */
function saveFavorites(favorites) {
    try {
        localStorage.setItem('quoteGeneratorFavorites', JSON.stringify(favorites));
    } catch (error) {
        console.error('Error saving favorites:', error);
    }
}

// ========================================
// QUOTE FILTERING
// ========================================

/**
 * Filter quotes by category
 * @param {string} category - Category to filter by
 * @returns {Array} Filtered quotes array
 */
function filterQuotesByCategory(category) {
    if (category === 'all') {
        return quotes;
    }
    return quotes.filter(quote => quote.category === category);
}

/**
 * Get random quote from filtered quotes
 * @param {string} category - Current category filter
 * @returns {Object} Random quote object
 */
function getRandomQuote(category) {
    const filteredQuotes = filterQuotesByCategory(category);
    
    if (filteredQuotes.length === 0) {
        return null;
    }
    
    // Avoid showing the same quote twice in a row
    let randomIndex;
    do {
        randomIndex = Math.floor(Math.random() * filteredQuotes.length);
    } while (
        state.currentQuote && 
        filteredQuotes.length > 1 &&
        filteredQuotes[randomIndex].id === state.currentQuote.id
    );
    
    return filteredQuotes[randomIndex];
}

// ========================================
// UI RENDERING
// ========================================

/**
 * Render quote to the display
 * @param {Object} quote - Quote object to display
 */
function renderQuote(quote) {
    if (!quote) return;
    
    // Update quote data
    elements.quoteText.textContent = `"${quote.text}"`;
    elements.quoteAuthor.textContent = `— ${quote.author}`;
    elements.quoteCategory.textContent = quote.category;
    
    // Update current quote state
    state.currentQuote = quote;
    
    // Update favorite button state
    updateFavoriteButton();
}

/**
 * Update favorite button appearance based on current state
 */
function updateFavoriteButton() {
    if (!state.currentQuote) return;
    
    const isFavorited = state.favorites.includes(state.currentQuote.id);
    
    if (isFavorited) {
        elements.favoriteBtn.classList.add('favorited');
        elements.favoriteBtn.querySelector('.btn-icon').textContent = '❤️';
    } else {
        elements.favoriteBtn.classList.remove('favorited');
        elements.favoriteBtn.querySelector('.btn-icon').textContent = '🤍';
    }
}

/**
 * Show fade transition for quote change
 * @param {Function} callback - Function to execute after fade out
 */
function showTransition(callback) {
    if (state.isTransitioning) return;
    state.isTransitioning = true;
    
    // Add fade out class
    elements.quoteContent.classList.add('fade-out');
    
    // Wait for fade out, then update and fade in
    setTimeout(() => {
        callback();
        elements.quoteContent.classList.remove('fade-out');
        
        setTimeout(() => {
            state.isTransitioning = false;
        }, 400);
    }, 400);
}

/**
 * Update favorites count badge
 */
function updateFavoritesCount() {
    elements.favoritesCount.textContent = state.favorites.length;
}

/**
 * Render favorites list in modal
 */
function renderFavoritesList() {
    elements.favoritesList.innerHTML = '';
    
    if (state.favorites.length === 0) {
        elements.emptyFavorites.style.display = 'block';
        return;
    }
    
    elements.emptyFavorites.style.display = 'none';
    
    // Get full quote objects for favorited IDs
    const favoriteQuotes = quotes.filter(q => state.favorites.includes(q.id));
    
    favoriteQuotes.forEach(quote => {
        const item = document.createElement('div');
        item.className = 'favorite-item';
        item.innerHTML = `
            <div class="favorite-content">
                <p class="favorite-text">"${quote.text}"</p>
                <p class="favorite-author">— ${quote.author}</p>
            </div>
            <button class="favorite-remove" data-id="${quote.id}" aria-label="Remove from favorites">
                🗑️
            </button>
        `;
        
        // Add remove event listener
        item.querySelector('.favorite-remove').addEventListener('click', () => {
            removeFavorite(quote.id);
        });
        
        elements.favoritesList.appendChild(item);
    });
}

// ========================================
// TOAST NOTIFICATIONS
// ========================================

/**
 * Show toast notification
 * @param {string} message - Message to display
 * @param {string} type - 'success' or 'error'
 */
function showToast(message, type = 'success') {
    elements.toast.textContent = message;
    elements.toast.className = `toast ${type} show`;
    
    setTimeout(() => {
        elements.toast.classList.remove('show');
    }, 3000);
}

// ========================================
// LOADING OVERLAY
// ========================================

/**
 * Show loading overlay
 */
function showLoading() {
    elements.loadingOverlay.classList.add('show');
}

/**
 * Hide loading overlay
 */
function hideLoading() {
    elements.loadingOverlay.classList.remove('show');
}

// ========================================
// BUTTON ACTIONS
// ========================================

/**
 * Generate and display new random quote
 */
function handleNewQuote() {
    if (state.isTransitioning) return;
    
    showTransition(() => {
        const newQuote = getRandomQuote(state.currentCategory);
        renderQuote(newQuote);
    });
}

/**
 * Toggle favorite status of current quote
 */
function handleFavorite() {
    if (!state.currentQuote) return;
    
    const quoteId = state.currentQuote.id;
    const index = state.favorites.indexOf(quoteId);
    
    if (index === -1) {
        // Add to favorites
        state.favorites.push(quoteId);
        showToast('Added to favorites! ❤️', 'success');
    } else {
        // Remove from favorites
        state.favorites.splice(index, 1);
        showToast('Removed from favorites', 'success');
    }
    
    saveFavorites(state.favorites);
    updateFavoriteButton();
    updateFavoritesCount();
}

/**
 * Copy quote to clipboard
 */
async function handleCopy() {
    if (!state.currentQuote) return;
    
    const text = `"${state.currentQuote.text}" — ${state.currentQuote.author}`;
    
    try {
        await navigator.clipboard.writeText(text);
        showToast('Copied to clipboard! 📋', 'success');
    } catch (error) {
        // Fallback for older browsers
        const textarea = document.createElement('textarea');
        textarea.value = text;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        showToast('Copied to clipboard! 📋', 'success');
    }
}

/**
 * Open Twitter share dialog
 */
function handleTweet() {
    if (!state.currentQuote) return;
    
    const text = `"${state.currentQuote.text}" — ${state.currentQuote.author}`;
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`;
    
    window.open(twitterUrl, '_blank', 'width=550,height=420');
}

/**
 * Remove quote from favorites
 * @param {number} quoteId - ID of quote to remove
 */
function removeFavorite(quoteId) {
    const index = state.favorites.indexOf(quoteId);
    if (index !== -1) {
        state.favorites.splice(index, 1);
        saveFavorites(state.favorites);
        updateFavoritesCount();
        renderFavoritesList();
        updateFavoriteButton();
        showToast('Removed from favorites', 'success');
    }
}

// ========================================
// MODAL HANDLING
// ========================================

/**
 * Open favorites modal
 */
function openFavoritesModal() {
    renderFavoritesList();
    elements.favoritesModal.classList.add('open');
    elements.favoritesModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
}

/**
 * Close favorites modal
 */
function closeFavoritesModal() {
    elements.favoritesModal.classList.remove('open');
    elements.favoritesModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
}

// ========================================
// CATEGORY FILTERING
// ========================================

/**
 * Handle category button click
 * @param {string} category - Selected category
 */
function handleCategoryChange(category) {
    // Update active button
    elements.categoryButtons.forEach(btn => {
        btn.classList.toggle('active', btn.dataset.category === category);
    });
    
    // Update state
    state.currentCategory = category;
    
    // Get new random quote from selected category
    handleNewQuote();
}

// ========================================
// EVENT LISTENERS
// ========================================

/**
 * Initialize all event listeners
 */
function initEventListeners() {
    // New Quote Button
    elements.newQuoteBtn.addEventListener('click', handleNewQuote);
    
    // Favorite Button
    elements.favoriteBtn.addEventListener('click', handleFavorite);
    
    // Copy Button
    elements.copyBtn.addEventListener('click', handleCopy);
    
    // Tweet Button
    elements.tweetBtn.addEventListener('click', handleTweet);
    
    // View Favorites Button
    elements.viewFavoritesBtn.addEventListener('click', openFavoritesModal);
    
    // Close Modal Button
    elements.closeModalBtn.addEventListener('click', closeFavoritesModal);
    
    // Modal Overlay Click
    elements.modalOverlay.addEventListener('click', closeFavoritesModal);
    
    // Escape Key to Close Modal
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && elements.favoritesModal.classList.contains('open')) {
            closeFavoritesModal();
        }
    });
    
    // Category Buttons
    elements.categoryButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            handleCategoryChange(btn.dataset.category);
        });
    });
    
    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
        // Space or N for new quote (when not in modal or input)
        if ((e.key === ' ' || e.key === 'n') && 
            !elements.favoritesModal.classList.contains('open') &&
            document.activeElement.tagName !== 'INPUT' &&
            document.activeElement.tagName !== 'TEXTAREA') {
            e.preventDefault();
            handleNewQuote();
        }
        
        // F for favorite
        if (e.key === 'f' && 
            !elements.favoritesModal.classList.contains('open') &&
            document.activeElement.tagName !== 'INPUT' &&
            document.activeElement.tagName !== 'TEXTAREA') {
            e.preventDefault();
            handleFavorite();
        }
    });
}

// ========================================
// INITIALIZATION
// ========================================

/**
 * Initialize the application
 */
function init() {
    // Load favorites from localStorage
    state.favorites = loadFavorites();
    updateFavoritesCount();
    
    // Initialize event listeners
    initEventListeners();
    
    // Show initial random quote
    const initialQuote = getRandomQuote(state.currentCategory);
    renderQuote(initialQuote);
}

// Start the application when DOM is ready
document.addEventListener('DOMContentLoaded', init);


// ========================================
// OPTIONAL ENHANCEMENTS (Commented)
// ========================================

/* 
// -------- Light/Dark Theme Toggle --------
function toggleTheme() {
    const root = document.documentElement;
    const isDark = root.style.getPropertyValue('--bg-primary') === '#0f0f1a';
    
    if (isDark) {
        // Switch to light theme
        root.style.setProperty('--bg-primary', '#f8fafc');
        root.style.setProperty('--bg-secondary', '#f1f5f9');
        root.style.setProperty('--bg-card', '#ffffff');
        root.style.setProperty('--text-primary', '#1e293b');
        root.style.setProperty('--text-secondary', '#475569');
    } else {
        // Switch to dark theme
        root.style.setProperty('--bg-primary', '#0f0f1a');
        root.style.setProperty('--bg-secondary', '#1a1a2e');
        root.style.setProperty('--bg-card', '#16213e');
        root.style.setProperty('--text-primary', '#f1f5f9');
        root.style.setProperty('--text-secondary', '#94a3b8');
    }
}

// -------- Filter by Author --------
function filterByAuthor(author) {
    return quotes.filter(quote => 
        quote.author.toLowerCase().includes(author.toLowerCase())
    );
}

// -------- Search Quotes --------
function searchQuotes(query) {
    const lowerQuery = query.toLowerCase();
    return quotes.filter(quote => 
        quote.text.toLowerCase().includes(lowerQuery) ||
        quote.author.toLowerCase().includes(lowerQuery)
    );
}

// -------- Quote of the Day --------
function getQuoteOfTheDay() {
    const today = new Date();
    const dayOfYear = Math.floor((today - new Date(today.getFullYear(), 0, 0)) / (1000 * 60 * 60 * 24));
    const index = dayOfYear % quotes.length;
    return quotes[index];
}

// -------- Previous Quote History --------
const quoteHistory = [];
const MAX_HISTORY = 10;

function addToHistory(quote) {
    quoteHistory.unshift(quote);
    if (quoteHistory.length > MAX_HISTORY) {
        quoteHistory.pop();
    }
}

function getPreviousQuote() {
    return quoteHistory[0] || null;
}
*/
