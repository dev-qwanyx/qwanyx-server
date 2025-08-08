/**
 * Common authentication functions for Autodin
 * Shared between login.html, register.html and login_modal.html
 */

// API URL configuration
const API_URL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:5002'  // Local development
    : 'http://135.181.72.183:5002'; // Production server

// Site configuration
const SITE_CODE = 'autodin-be';

/**
 * Show notification message
 */
function showNotification(message, type = 'info', containerId = 'notifications') {
    const notifications = document.getElementById(containerId);
    if (!notifications) return;
    
    const notif = document.createElement('div');
    notif.className = `notification is-${type}`;
    notif.innerHTML = `
        <button class="delete" onclick="this.parentElement.remove()"></button>
        ${message}
    `;
    notifications.appendChild(notif);
    
    // Auto-remove after 5 seconds
    setTimeout(() => notif.remove(), 5000);
}

/**
 * Setup 6-digit code input boxes
 * @param {string} containerSelector - Selector for the container with code inputs
 * @param {string} hiddenInputId - ID of the hidden input that stores the full code
 * @param {string} formId - ID of the form to auto-submit when code is complete
 */
function setupCodeInputs(containerSelector, hiddenInputId, formId) {
    const codeInputs = document.querySelectorAll(`${containerSelector} .code-digit`);
    const hiddenInput = document.getElementById(hiddenInputId);
    
    if (!codeInputs.length || !hiddenInput) return;
    
    codeInputs.forEach((input, index) => {
        // Handle input
        input.addEventListener('input', (e) => {
            // Only allow digits
            e.target.value = e.target.value.replace(/[^0-9]/g, '');
            
            // Move to next input if value entered
            if (e.target.value && index < codeInputs.length - 1) {
                codeInputs[index + 1].focus();
            }
            
            // Update hidden input with full code
            let fullCode = '';
            codeInputs.forEach(inp => fullCode += inp.value);
            hiddenInput.value = fullCode;
            
            // Auto-submit if all 6 digits entered
            if (fullCode.length === 6 && formId) {
                document.getElementById(formId).dispatchEvent(new Event('submit'));
            }
        });
        
        // Handle backspace
        input.addEventListener('keydown', (e) => {
            if (e.key === 'Backspace' && !e.target.value && index > 0) {
                codeInputs[index - 1].focus();
            }
        });
        
        // Handle paste
        input.addEventListener('paste', (e) => {
            e.preventDefault();
            const pastedData = e.clipboardData.getData('text').replace(/[^0-9]/g, '').slice(0, 6);
            
            for (let i = 0; i < pastedData.length && i < codeInputs.length; i++) {
                codeInputs[i].value = pastedData[i];
            }
            
            // Update hidden input
            let fullCode = '';
            codeInputs.forEach(inp => fullCode += inp.value);
            hiddenInput.value = fullCode;
            
            // Focus last filled input or next empty
            const lastFilledIndex = Math.min(pastedData.length - 1, codeInputs.length - 1);
            codeInputs[lastFilledIndex].focus();
            
            // Auto-submit if all 6 digits pasted
            if (fullCode.length === 6 && formId) {
                document.getElementById(formId).dispatchEvent(new Event('submit'));
            }
        });
    });
}

/**
 * Clear all code inputs
 * @param {string} containerSelector - Selector for the container with code inputs
 */
function clearCodeInputs(containerSelector) {
    document.querySelectorAll(`${containerSelector} .code-digit`).forEach(input => {
        input.value = '';
    });
}

/**
 * Request authentication code
 * @param {string} email - User email
 * @param {Object} additionalData - Additional data to send with request
 */
async function requestAuthCode(email, additionalData = {}) {
    const response = await fetch(`${API_URL}/auth/request-code`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            email: email,
            workspace: SITE_CODE,
            site: SITE_CODE, // Both for API compatibility
            ...additionalData
        })
    });
    
    const data = await response.json();
    return { response, data };
}

/**
 * Verify authentication code
 * @param {string} email - User email
 * @param {string} code - Verification code
 * @param {Object} additionalData - Additional data to send with request
 */
async function verifyAuthCode(email, code, additionalData = {}) {
    const response = await fetch(`${API_URL}/auth/verify-code`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            email: email,
            code: code,
            workspace: SITE_CODE,
            site: SITE_CODE, // Both for API compatibility
            ...additionalData
        })
    });
    
    const data = await response.json();
    return { response, data };
}

/**
 * Store authentication token and user data
 * @param {string} token - JWT token
 * @param {Object} user - User data
 */
function storeAuthData(token, user) {
    localStorage.setItem('autodin_token', token);
    localStorage.setItem('autodin_user', JSON.stringify(user));
    localStorage.setItem('autodin_last_activity', Date.now().toString());
}

/**
 * Check if user is authenticated
 */
function isAuthenticated() {
    const token = localStorage.getItem('autodin_token');
    const lastActivity = localStorage.getItem('autodin_last_activity');
    
    if (!token) return false;
    
    // Check if last activity was within 7 days
    if (lastActivity) {
        const daysSinceActivity = (Date.now() - parseInt(lastActivity)) / (1000 * 60 * 60 * 24);
        if (daysSinceActivity > 7) {
            // Token expired, clear auth data
            clearAuthData();
            return false;
        }
    }
    
    return true;
}

/**
 * Clear authentication data
 */
function clearAuthData() {
    localStorage.removeItem('autodin_token');
    localStorage.removeItem('autodin_user');
    localStorage.removeItem('autodin_last_activity');
}

/**
 * Get current user data
 */
function getCurrentUser() {
    const userStr = localStorage.getItem('autodin_user');
    return userStr ? JSON.parse(userStr) : null;
}

/**
 * Update navbar based on authentication status
 */
function updateNavbarAuth() {
    // This function is called by checkAuth() in the main template
    // It's here for completeness but the actual implementation is in the HTML files
    if (typeof checkAuth === 'function') {
        checkAuth();
    }
}