// Initialize Supabase client (guarded)
let createClient = null;
if (typeof supabase !== 'undefined' && supabase && typeof supabase.createClient === 'function') {
    createClient = supabase.createClient;
} else if (typeof window !== 'undefined' && window.supabase && typeof window.supabase.createClient === 'function') {
    createClient = window.supabase.createClient;
} else {
    // supabase SDK not loaded or available
    console.warn('Supabase SDK not found. Cloud sync will be disabled. Make sure the CDN script is loaded before app.js');
}

class MedicineTracker {
    constructor() {
        if (createClient && SUPABASE_URL && SUPABASE_ANON_KEY) {
            this.supabase = createClient(
                SUPABASE_URL,
                SUPABASE_ANON_KEY
            );
            console.log('Supabase client initialized:', this.supabase);
        } else {
            this.supabase = null;
            if (!createClient) {
                console.log('Supabase SDK not available — cloud sync disabled.');
            } else {
                console.warn('SUPABASE_URL or SUPABASE_ANON_KEY missing. Please create a local config.js from config.example.js. Cloud sync disabled.');
            }
        }
        
        this.medicines = [];
        this.currentFilter = 'all';
        this.userId = null;
        
        this.init();
    }

    init() {
        // Get or create user ID
        this.getUserId();
        
        // Load medicines from Supabase
        this.loadMedicinesFromSupabase();
        
        // Set up event listeners
        this.setupEventListeners();
        
        // Check for expired medicines and notify
        this.checkExpiredMedicines();
        
        // Set up daily check for expired medicines
        this.setupDailyCheck();
    }

    // Update your getUserId method in app.js
    async getUserId() {
        // First, try to get user email from localStorage
        let userEmail = localStorage.getItem('medicineTrackerUserEmail');
        
        if (!userEmail) {
            // If no email, prompt user to enter one
            userEmail = prompt('Please enter your email address to access your medicine data:');
            
            if (!userEmail || !userEmail.includes('@')) {
                alert('Valid email required to save your medicine data. Please refresh and try again.');
                return null;
            }
            
            // Save to localStorage
            localStorage.setItem('medicineTrackerUserEmail', userEmail);
        }
        
        // Generate a consistent userId from the email (hash it)
        this.userId = this.generateUserIdFromEmail(userEmail);
        return this.userId;
    }

    // Add this helper method
    generateUserIdFromEmail(email) {
        // Simple hash function to generate consistent ID from email
        let hash = 0;
        for (let i = 0; i < email.length; i++) {
            const char = email.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash; // Convert to 32bit integer
        }
        return 'user_' + Math.abs(hash).toString(36);
    }

    async loadMedicinesFromSupabase() {
        if (!this.supabase) {
            console.log('Supabase client not initialized — loading from localStorage');
            this.loadFromLocalStorage();
            return;
        }

        try {
            console.log('Loading medicines from Supabase for user:', this.userId);
            const { data, error } = await this.supabase
                .from('medicines')
                .select('*')
                .eq('user_id', this.userId)
                .order('expiry_date', { ascending: true });
            console.log('Supabase select response:', { data, error });
            
            if (error) throw error;
            
            // Convert expiry_date to expiryDate for consistency with existing code
            this.medicines = (data || []).map(med => ({
                ...med,
                expiryDate: med.expiry_date,
                id: med.id || this.generateId() // Ensure we have an ID
            }));
            
            // Save to localStorage as backup/offline cache
            this.saveToLocalStorage();
            
            this.renderMedicines();
        } catch (error) {
            console.error('Error loading medicines from Supabase:', error);
            // Fallback to local storage if Supabase fails
            this.loadFromLocalStorage();
        }
    }

    async saveMedicinesToSupabase() {
        if (!this.supabase) {
            console.log('Supabase client not initialized — saving to localStorage only');
            this.saveToLocalStorage();
            return;
        }

        try {
            console.log('Saving medicines to Supabase for user:', this.userId, 'count:', this.medicines.length);
            // Prepare medicines for Supabase (convert property names)
            const medicinesForSupabase = this.medicines.map(med => ({
                id: med.id,
                user_id: this.userId,
                name: med.name,
                quantity: med.quantity,
                expiry_date: med.expiryDate, // Convert to DB column name
                notes: med.notes,
                added_date: med.addedDate || new Date().toISOString(),
                last_updated: new Date().toISOString(),
                notified: med.notified || false,
                warned: med.warned || false
            }));
            
            // First, delete all existing records for this user
            const { error: deleteError, data: deleteData } = await this.supabase
                .from('medicines')
                .delete()
                .eq('user_id', this.userId);
            console.log('Supabase delete response:', { deleteError, deleteData });
            
            if (deleteError) throw deleteError;
            
            // Then insert all current medicines
            if (medicinesForSupabase.length > 0) {
                const { error: insertError } = await this.supabase
                    .from('medicines')
                    .insert(medicinesForSupabase);
                
                console.log('Supabase insert response:', { insertError });
                if (insertError) throw insertError;
            }
            
            console.log('Data saved to Supabase successfully');
            
            // Also save to localStorage as backup/offline cache
            this.saveToLocalStorage();
        } catch (error) {
            console.error('Error saving medicines to Supabase:', error);
            alert('Failed to save to cloud. Data saved locally.');
            this.saveToLocalStorage();
        }
    }

    // Keep your existing localStorage methods as fallback/offline support
    saveToLocalStorage() {
        localStorage.setItem('medicines', JSON.stringify(this.medicines));
    }

    loadFromLocalStorage() {
        const savedMedicines = localStorage.getItem('medicines');
        if (savedMedicines) {
            this.medicines = JSON.parse(savedMedicines);
        }
        this.renderMedicines();
    }

    setupEventListeners() {
        // Add medicine button
        document.getElementById('add-medicine-btn').addEventListener('click', () => {
            this.openAddMedicineModal();
        });
        
        document.getElementById('add-first-medicine').addEventListener('click', () => {
            this.openAddMedicineModal();
        });
        
        // Form submission
        document.getElementById('medicine-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.saveMedicine();
        });
        
        // Cancel button
        document.getElementById('cancel-btn').addEventListener('click', () => {
            this.closeModal();
        });
        
        // Filter tabs
        document.querySelectorAll('.tab').forEach(tab => {
            tab.addEventListener('click', (e) => {
                this.setFilter(e.target.dataset.filter);
            });
        });
    }

    openAddMedicineModal() {
        document.getElementById('modal-title').textContent = 'Add New Medicine';
        document.getElementById('medicine-form').reset();
        document.getElementById('medicine-id').value = '';
        document.getElementById('medicine-modal').style.display = 'block';
    }

    openEditMedicineModal(medicine) {
        document.getElementById('modal-title').textContent = 'Edit Medicine';
        document.getElementById('medicine-id').value = medicine.id;
        document.getElementById('medicine-name').value = medicine.name;
        document.getElementById('medicine-quantity').value = medicine.quantity || 1;
        document.getElementById('expiry-date').value = medicine.expiryDate;
        document.getElementById('medicine-notes').value = medicine.notes || '';
        document.getElementById('medicine-modal').style.display = 'block';
    }

    closeModal() {
        document.getElementById('medicine-modal').style.display = 'none';
    }

    async saveMedicine() {
        const id = document.getElementById('medicine-id').value;
        const name = document.getElementById('medicine-name').value;
        const quantity = parseInt(document.getElementById('medicine-quantity').value) || 1;
        const expiryDate = document.getElementById('expiry-date').value;
        const notes = document.getElementById('medicine-notes').value;
        
        if (!name || !expiryDate) {
            alert('Please fill in all required fields');
            return;
        }
        
        if (id) {
            // Edit existing medicine
            const index = this.medicines.findIndex(med => med.id === id);
            if (index !== -1) {
                this.medicines[index] = {
                    ...this.medicines[index],
                    name,
                    quantity,
                    expiryDate,
                    notes,
                    lastUpdated: new Date().toISOString()
                };
            }
        } else {
            // Add new medicine
            const newMedicine = {
                id: this.generateId(),
                name,
                quantity,
                expiryDate,
                notes,
                addedDate: new Date().toISOString(),
                lastUpdated: new Date().toISOString(),
                notified: false,
                warned: false
            };
            this.medicines.push(newMedicine);
        }
        
        try {
            await this.saveMedicinesToSupabase();
            this.renderMedicines();
            this.closeModal();
        } catch (error) {
            console.error('Failed to save medicines:', error);
            alert('Failed to save. Please try again.');
        }
    }

    async deleteMedicine(id) {
        if (confirm('Are you sure you want to delete this medicine?')) {
            this.medicines = this.medicines.filter(med => med.id !== id);
            try {
                await this.saveMedicinesToSupabase();
                this.renderMedicines();
            } catch (error) {
                console.error('Failed to delete medicine:', error);
                alert('Failed to delete. Please try again.');
            }
        }
    }

    generateId() {
    // Generate a proper UUID v4
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        const r = Math.random() * 16 | 0;
        const v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

    setFilter(filter) {
        this.currentFilter = filter;
        
        // Update active tab
        document.querySelectorAll('.tab').forEach(tab => {
            tab.classList.remove('active');
            if (tab.dataset.filter === filter) {
                tab.classList.add('active');
            }
        });
        
        this.renderMedicines();
    }

    getFilteredMedicines() {
        let filtered = [...this.medicines];
        
        if (this.currentFilter === 'active') {
            filtered = filtered.filter(med => !this.isExpired(med.expiryDate));
        } else if (this.currentFilter === 'expired') {
            filtered = filtered.filter(med => this.isExpired(med.expiryDate));
        } else if (this.currentFilter === 'expiring') {
            filtered = filtered.filter(med => this.isExpiringSoon(med.expiryDate));
        }
        
        // Sort by expiry date (soonest first)
        return filtered.sort((a, b) => new Date(a.expiryDate) - new Date(b.expiryDate));
    }

    isExpired(expiryDate) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const expiry = new Date(expiryDate);
        return expiry < today;
    }

    isExpiringSoon(expiryDate) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const expiry = new Date(expiryDate);
        const diffTime = expiry - today;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays <= 7 && diffDays > 0;
    }

    formatDate(dateString) {
        const options = { year: 'numeric', month: 'short', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    }

    renderMedicines() {
        const container = document.getElementById('medicines-container');
        const emptyState = document.getElementById('empty-state');
        const filteredMedicines = this.getFilteredMedicines();
        
        if (filteredMedicines.length === 0) {
            container.style.display = 'none';
            emptyState.style.display = 'block';
        } else {
            container.style.display = 'flex';
            emptyState.style.display = 'none';
            
            container.innerHTML = '';
            
            filteredMedicines.forEach(medicine => {
                const isExpired = this.isExpired(medicine.expiryDate);
                const isExpiringSoon = this.isExpiringSoon(medicine.expiryDate);
                const statusClass = isExpired ? 'expired' : (isExpiringSoon ? 'warning' : 'active');
                const expiryClass = isExpired ? 'expired' : (isExpiringSoon ? 'warning' : '');
                const expiryIcon = isExpired ? '❌' : (isExpiringSoon ? '⚠️' : '✅');
                
                const card = document.createElement('div');
                card.className = `medicine-card ${statusClass} fade-in-up`;
                card.innerHTML = `
                    <h3 class="medicine-name">${medicine.name}</h3>
                    <div class="medicine-details-row">
                        <span class="medicine-quantity-badge">Qty: ${medicine.quantity}</span>
                        <span class="expiry-info">
                            <span class="expiry-icon">${expiryIcon}</span>
                            <span class="expiry-date ${expiryClass}">${this.formatDate(medicine.expiryDate)}</span>
                        </span>
                    </div>
                    ${medicine.notes ? `<p class="medicine-notes">${medicine.notes}</p>` : ''}
                    <div class="card-actions">
                        <button class="card-btn edit" data-id="${medicine.id}" title="Edit">✏️</button>
                        <button class="card-btn delete" data-id="${medicine.id}" title="Delete">🗑️</button>
                    </div>
                `;
                
                container.appendChild(card);
                
                // Add event listeners to buttons
                card.querySelector('.edit').addEventListener('click', (e) => {
                    this.openEditMedicineModal(medicine);
                });
                
                card.querySelector('.delete').addEventListener('click', (e) => {
                    this.deleteMedicine(medicine.id);
                });
            });
        }
    }

    checkExpiredMedicines() {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        // Get medicines that expired today or before and haven't been notified
        const newlyExpired = this.medicines.filter(med => {
            const expiry = new Date(med.expiryDate);
            const hasBeenNotified = med.notified || false;
            return expiry < today && !hasBeenNotified;
        });
        
        if (newlyExpired.length > 0) {
            this.showNotification(`You have ${newlyExpired.length} expired medicine(s) that should be discarded.`);
            
            // Mark as notified
            newlyExpired.forEach(med => {
                const index = this.medicines.findIndex(m => m.id === med.id);
                if (index !== -1) {
                    this.medicines[index].notified = true;
                }
            });
            
            this.saveMedicinesToSupabase().then(() => {
                this.renderMedicines();
            }).catch(err => {
                console.error('Failed to save notification status:', err);
            });
        }
        
        // Also check for medicines expiring soon (within 7 days)
        const expiringSoon = this.medicines.filter(med => {
            const expiry = new Date(med.expiryDate);
            const diffTime = expiry - today;
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            return diffDays <= 7 && diffDays > 0 && !med.warned;
        });
        
        if (expiringSoon.length > 0) {
            this.showNotification(`${expiringSoon.length} medicine(s) will expire in the next 7 days.`);
            
            // Mark as warned
            expiringSoon.forEach(med => {
                const index = this.medicines.findIndex(m => m.id === med.id);
                if (index !== -1) {
                    this.medicines[index].warned = true;
                }
            });
            
            this.saveMedicinesToSupabase().catch(err => {
                console.error('Failed to save warning status:', err);
            });
        }
    }

    showNotification(message) {
        // Try browser notification first
        if ('Notification' in window) {
            if (Notification.permission === 'granted') {
                this.createBrowserNotification(message);
            } else if (Notification.permission !== 'denied') {
                Notification.requestPermission().then(permission => {
                    if (permission === 'granted') {
                        this.createBrowserNotification(message);
                    } else {
                        this.createInAppNotification(message);
                    }
                });
            } else {
                this.createInAppNotification(message);
            }
        } else {
            // Fallback to in-app notification
            this.createInAppNotification(message);
        }
    }

    createBrowserNotification(message) {
        const notification = new Notification('Medicine Tracker', {
            body: message,
            icon: 'pill-icon.svg'
        });
        
        notification.onclick = function() {
            window.focus();
        };
    }

    createInAppNotification(message) {
        // Create or update in-app notification
        let notification = document.getElementById('in-app-notification');
        if (!notification) {
            notification = document.createElement('div');
            notification.id = 'in-app-notification';
            notification.className = 'notification';
            notification.innerHTML = `
                <button class="notification-close">&times;</button>
                <p>${message}</p>
            `;
            document.body.appendChild(notification);
            
            notification.querySelector('.notification-close').addEventListener('click', () => {
                notification.classList.remove('show');
                setTimeout(() => {
                    if (notification.parentNode) {
                        notification.parentNode.removeChild(notification);
                    }
                }, 300);
            });
        } else {
            notification.querySelector('p').textContent = message;
        }
        
        notification.classList.add('show');
        
        // Auto-hide after 5 seconds
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 5000);
    }

    setupDailyCheck() {
        // Check for expired medicines daily
        const checkDaily = () => {
            this.checkExpiredMedicines();
            
            // Schedule next check for tomorrow
            const now = new Date();
            const tomorrow = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
            const timeToTomorrow = tomorrow.getTime() - now.getTime();
            
            setTimeout(checkDaily, timeToTomorrow);
        };
        
        // Initial check
        this.checkExpiredMedicines();
        
        // Calculate time to next midnight
        const now = new Date();
        const midnight = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
        const timeToMidnight = midnight.getTime() - now.getTime();
        
        // Set timeout for first daily check
        setTimeout(checkDaily, timeToMidnight);
    }
}

// Read config from a local `config.js` (not committed) or fallback to defaults.
const LOCAL_CONFIG = (typeof window !== 'undefined' && window.MEDTRACK_CONFIG) ? window.MEDTRACK_CONFIG : {};
const SUPABASE_URL = LOCAL_CONFIG.SUPABASE_URL || null;
const SUPABASE_ANON_KEY = LOCAL_CONFIG.SUPABASE_ANON_KEY || null;

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new MedicineTracker();
});