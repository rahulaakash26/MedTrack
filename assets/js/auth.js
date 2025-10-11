// Authentication handler for Supabase
class AuthHandler {
    constructor() {
        this.initSupabase();
    }

    initSupabase() {
        // Get Supabase client
        let createClient = null;
        if (typeof supabase !== 'undefined' && supabase && typeof supabase.createClient === 'function') {
            createClient = supabase.createClient;
        } else if (typeof window !== 'undefined' && window.supabase && typeof window.supabase.createClient === 'function') {
            createClient = window.supabase.createClient;
        }

        const LOCAL_CONFIG = (typeof window !== 'undefined' && window.MEDTRACK_CONFIG) ? window.MEDTRACK_CONFIG : {};
        const SUPABASE_URL = LOCAL_CONFIG.SUPABASE_URL || null;
        const SUPABASE_ANON_KEY = LOCAL_CONFIG.SUPABASE_ANON_KEY || null;

        if (createClient && SUPABASE_URL && SUPABASE_ANON_KEY) {
            this.supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
        } else {
            this.supabase = null;
            console.error('Supabase not configured properly');
        }
    }

    async signup(email, password) {
        if (!this.supabase) {
            return { success: false, error: 'Authentication service not available' };
        }

        try {
            // Get the current origin dynamically (works for localhost and production)
            const redirectUrl = this.getRedirectUrl('/auth/login.html');
            
            const { data, error } = await this.supabase.auth.signUp({
                email: email,
                password: password,
                options: {
                    emailRedirectTo: redirectUrl
                }
            });

            if (error) throw error;

            return { success: true, data };
        } catch (error) {
            console.error('Signup error:', error);
            return { 
                success: false, 
                error: error.message || 'Failed to create account. Please try again.' 
            };
        }
    }

    async login(email, password) {
        if (!this.supabase) {
            return { success: false, error: 'Authentication service not available' };
        }

        try {
            const { data, error } = await this.supabase.auth.signInWithPassword({
                email: email,
                password: password
            });

            if (error) throw error;

            return { success: true, data };
        } catch (error) {
            console.error('Login error:', error);
            return { 
                success: false, 
                error: error.message || 'Invalid email or password' 
            };
        }
    }

    async signInWithGoogle() {
        if (!this.supabase) {
            return { success: false, error: 'Authentication service not available' };
        }

        try {
            // Get the redirect URL for after OAuth completes
            const redirectUrl = this.getRedirectUrl('/index.html');
            
            const { data, error } = await this.supabase.auth.signInWithOAuth({
                provider: 'google',
                options: {
                    redirectTo: redirectUrl,
                    queryParams: {
                        access_type: 'offline',
                        prompt: 'consent',
                    }
                }
            });

            if (error) throw error;

            // Note: The function will redirect before returning
            return { success: true, data };
        } catch (error) {
            console.error('Google sign-in error:', error);
            return { 
                success: false, 
                error: error.message || 'Failed to sign in with Google. Please try again.' 
            };
        }
    }

    async logout() {
        if (!this.supabase) {
            return { success: false, error: 'Authentication service not available' };
        }

        try {
            const { error } = await this.supabase.auth.signOut();
            if (error) throw error;

            return { success: true };
        } catch (error) {
            console.error('Logout error:', error);
            return { 
                success: false, 
                error: error.message || 'Failed to logout' 
            };
        }
    }

    async resetPassword(email) {
        if (!this.supabase) {
            return { success: false, error: 'Authentication service not available' };
        }

        try {
            // Get the current origin dynamically (works for localhost and production)
            const redirectUrl = this.getRedirectUrl('/auth/update-password.html');
            
            const { error } = await this.supabase.auth.resetPasswordForEmail(email, {
                redirectTo: redirectUrl
            });

            if (error) throw error;

            return { success: true };
        } catch (error) {
            console.error('Reset password error:', error);
            return { 
                success: false, 
                error: error.message || 'Failed to send reset email' 
            };
        }
    }

    async updatePassword(newPassword) {
        if (!this.supabase) {
            return { success: false, error: 'Authentication service not available' };
        }

        try {
            const { error } = await this.supabase.auth.updateUser({
                password: newPassword
            });

            if (error) throw error;

            return { success: true };
        } catch (error) {
            console.error('Update password error:', error);
            return { 
                success: false, 
                error: error.message || 'Failed to update password' 
            };
        }
    }

    async getCurrentUser() {
        if (!this.supabase) {
            return null;
        }

        try {
            const { data: { user } } = await this.supabase.auth.getUser();
            return user;
        } catch (error) {
            console.error('Get user error:', error);
            return null;
        }
    }

    async getSession() {
        if (!this.supabase) {
            return null;
        }

        try {
            const { data: { session } } = await this.supabase.auth.getSession();
            return session;
        } catch (error) {
            console.error('Get session error:', error);
            return null;
        }
    }

    async checkAuthAndRedirect() {
        const user = await this.getCurrentUser();
        if (user) {
            // User is already logged in, redirect to main app
            window.location.href = '../index.html';
        }
    }

    async requireAuth() {
        const user = await this.getCurrentUser();
        if (!user) {
            // User is not logged in, redirect to login
            window.location.href = 'auth/login.html';
            return false;
        }
        return true;
    }

    showMessage(message, type = 'info') {
        const messageEl = document.getElementById('auth-message');
        if (messageEl) {
            messageEl.textContent = message;
            messageEl.className = `auth-message ${type} show`;
            
            // Auto-hide after 5 seconds
            setTimeout(() => {
                messageEl.classList.remove('show');
            }, 5000);
        }
    }

    hideMessage() {
        const messageEl = document.getElementById('auth-message');
        if (messageEl) {
            messageEl.classList.remove('show');
        }
    }

    /**
     * Get dynamic redirect URL based on current environment
     * Automatically detects localhost vs production
     * @param {string} path - The path to redirect to (e.g., '/auth/login.html')
     * @returns {string} - Full URL with origin
     */
    getRedirectUrl(path) {
        // Get current origin (e.g., http://localhost:5500 or https://username.github.io)
        const origin = window.location.origin;
        
        // Get the base path if deployed in a subdirectory (for GitHub Pages)
        // If URL is https://username.github.io/MedTrack/, pathname will be '/MedTrack/'
        const pathname = window.location.pathname;
        const pathParts = pathname.split('/').filter(Boolean);
        
        // If we're in a subdirectory (like GitHub Pages /MedTrack/), include it
        let basePath = '';
        if (pathParts.length > 0 && !pathname.endsWith('.html')) {
            // We're likely in a subdirectory like /MedTrack/
            basePath = '/' + pathParts[0];
        } else if (pathParts.length > 0) {
            // We're on a page like /MedTrack/auth/login.html
            // Check if first part is not 'auth', 'assets', 'config', or 'docs'
            const firstPart = pathParts[0];
            if (!['auth', 'assets', 'config', 'docs'].includes(firstPart)) {
                basePath = '/' + firstPart;
            }
        }
        
        // Combine origin + basePath + path
        const fullUrl = origin + basePath + path;
        
        console.log('Dynamic redirect URL:', fullUrl);
        return fullUrl;
    }

    /**
     * Get current environment info (for debugging)
     * @returns {object} - Environment information
     */
    getEnvironmentInfo() {
        const origin = window.location.origin;
        const isLocal = origin.includes('localhost') || origin.includes('127.0.0.1');
        const isGitHubPages = origin.includes('github.io');
        
        return {
            origin,
            isLocal,
            isGitHubPages,
            isProduction: !isLocal,
            currentUrl: window.location.href
        };
    }
}

