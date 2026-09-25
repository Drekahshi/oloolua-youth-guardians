import { supabase } from '../../services/supabase.js';

/**
 * Authentication Service for Oloolua Youth Guardians
 * Uses self-contained local authentication aligned with KAI Nuvari CFA permissions.
 */

const AuthService = {
    /**
     * Attempt to log in a guardian/member
     * @param {string} email 
     * @param {string} password 
     * @returns {Promise<object|null>} User object if successful
     */
    login: async function (email, password) {
<<<<<<< HEAD
        this.lastError = null;
        let data, error;
        try {
            ({ data, error } = await supabase.auth.signInWithPassword({
                email: email,
                password: password,
            }));
        } catch (e) {
            error = e;
        }

        if (error) {
            console.error('Login error:', error.message);
            // A network failure means the login service is unreachable, not a wrong password.
            this.lastError = /fetch|network/i.test(error.message || '') || error.status === 0 ? 'offline' : 'invalid';
=======
        try {
            const { data, error } = await supabase.auth.signInWithPassword({
                email: email,
                password: password,
            });

            if (error) {
                console.error('Login error:', error);
                return null;
            }
            
            return data.user;
        } catch (err) {
            console.error('Auth error:', err);
>>>>>>> 9d2f43e (feat: complete Next.js conversion with Neon DB integration, faithful HTML routes, accurate botanical catalogue, and photo galleries)
            return null;
        }
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
        try {
            const { data } = await supabase.auth.getUser();
            return data?.user ?? null;
        } catch (e) {
            return null;
        }
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
    }
};

export default AuthService;
