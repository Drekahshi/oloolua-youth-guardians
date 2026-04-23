import { supabase } from './services/supabase.js';

/**
 * Authentication Service
 * Handles user login, logout, and session management using Supabase.
 */

const AuthService = {
    /**
     * Attempt to log in a user
     * @param {string} email 
     * @param {string} password 
     * @returns {Promise<object|null>} User object if successful, null otherwise
     */
    login: async function (email, password) {
        const { data, error } = await supabase.auth.signInWithPassword({
            email: email,
            password: password,
        });

        if (error) {
            console.error('Login error:', error.message);
            return null;
        }
        
        return data.user;
    },

    /**
     * Log out the current user
     */
    logout: async function () {
        await supabase.auth.signOut();
        window.location.href = 'login.html';
    },

    /**
     * Get current logged in user
     * @returns {Promise<object|null>}
     */
    getCurrentUser: async function () {
        const { data: { user } } = await supabase.auth.getUser();
        return user;
    },

    /**
     * Check if user is authenticated, redirect if not
     */
    checkAuth: async function () {
        const user = await this.getCurrentUser();
        if (!user) {
            if (!window.location.href.includes('login.html')) {
                window.location.href = 'login.html';
            }
            return false;
        }
        return true;
    },

    /**
     * Initialize auth state on page load
     */
    init: async function () {
        const user = await this.getCurrentUser();
        const loginLink = document.getElementById('loginLink');
        const logoutLink = document.getElementById('logoutLink');
        const memberLink = document.getElementById('memberLink');

        if (user) {
            if (loginLink) loginLink.style.display = 'none';
            if (logoutLink) {
                logoutLink.style.display = 'block';
                logoutLink.addEventListener('click', (e) => {
                    e.preventDefault();
                    this.logout();
                });
            }
            if (memberLink) memberLink.style.display = 'block';
        } else {
            if (loginLink) loginLink.style.display = 'block';
            if (logoutLink) logoutLink.style.display = 'none';
            if (memberLink) memberLink.style.display = 'none';
        }
    }
};

// Export for use in other modules
export default AuthService;

// Initialize on load if not imported as module in some cases
// But we should use it via module imports mostly
document.addEventListener('DOMContentLoaded', () => {
    AuthService.init();
});
