/**
 * Mock Authentication Service
 * Handles user login, logout, and session management using localStorage.
 */

const AuthService = {
    // Mock credentials (in a real app, this would be on a server)
    users: [
        { username: 'admin', password: 'password123', role: 'admin', name: 'Administrator' },
        { username: 'member', password: 'member123', role: 'member', name: 'Member' }
    ],

    /**
     * Attempt to log in a user
     * @param {string} username 
     * @param {string} password 
     * @returns {object|null} User object if successful, null otherwise
     */
    login: function (username, password) {
        const user = this.users.find(u => u.username === username && u.password === password);
        if (user) {
            // Store user session
            const session = {
                username: user.username,
                role: user.role,
                name: user.name,
                loginTime: new Date().toISOString()
            };
            localStorage.setItem('currentUser', JSON.stringify(session));
            return session;
        }
        return null;
    },

    /**
     * Log out the current user
     */
    logout: function () {
        localStorage.removeItem('currentUser');
        window.location.href = 'login.html';
    },

    /**
     * Get current logged in user
     * @returns {object|null}
     */
    getCurrentUser: function () {
        const userStr = localStorage.getItem('currentUser');
        return userStr ? JSON.parse(userStr) : null;
    },

    /**
     * Check if user is authenticated, redirect if not
     */
    checkAuth: function () {
        const user = this.getCurrentUser();
        if (!user) {
            // Redirect to login page if not on login page
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
    init: function () {
        const user = this.getCurrentUser();
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

// Initialize on load
document.addEventListener('DOMContentLoaded', () => {
    AuthService.init();
});
