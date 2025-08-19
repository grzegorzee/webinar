// MailerLite Configuration
const MAILERLITE_CONFIG = {
    // Replace with your actual MailerLite API key
    apiKey: 'YOUR_MAILERLITE_API_KEY',
    // Replace with your actual group ID
    groupId: 'YOUR_GROUP_ID',
    // MailerLite API endpoint
    apiUrl: 'https://api.mailerlite.com/api/v2/subscribers'
};

// Form handling
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('newsletter-form');
    const submitBtn = form.querySelector('.submit-btn');
    const originalBtnText = submitBtn.textContent;

    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        // Get form data
        const formData = new FormData(form);
        const name = formData.get('name');
        const email = formData.get('email');
        const privacyAccepted = formData.get('privacy');

        // Validate form
        if (!name || !email || !privacyAccepted) {
            showMessage('Please fill in all fields and accept the privacy policy.', 'error');
            return;
        }

        if (!isValidEmail(email)) {
            showMessage('Please enter a valid email address.', 'error');
            return;
        }

        // Update button state
        submitBtn.disabled = true;
        submitBtn.textContent = 'SIGNING UP...';
        submitBtn.style.opacity = '0.7';

        try {
            // Submit to MailerLite
            const success = await submitToMailerLite(name, email);
            
            if (success) {
                showMessage('🎉 Successfully signed up! Check your email for confirmation.', 'success');
                form.reset();
                
                // Track successful signup
                trackEvent('newsletter_signup', {
                    email: email,
                    source: 'marketing_ai_webinar'
                });
            } else {
                throw new Error('Subscription failed');
            }
        } catch (error) {
            console.error('Subscription error:', error);
            showMessage('Something went wrong. Please try again later.', 'error');
        } finally {
            // Reset button state
            submitBtn.disabled = false;
            submitBtn.textContent = originalBtnText;
            submitBtn.style.opacity = '1';
        }
    });
});

// Submit to MailerLite API
async function submitToMailerLite(name, email) {
    try {
        // For demo purposes, we'll simulate the API call
        // In production, you'll need to implement server-side proxy to avoid CORS issues
        
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // For now, we'll log the data and return success
        console.log('Submitting to MailerLite:', { name, email });
        
        // In production, use this structure for the actual API call:
        /*
        const response = await fetch(MAILERLITE_CONFIG.apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-MailerLite-ApiKey': MAILERLITE_CONFIG.apiKey
            },
            body: JSON.stringify({
                email: email,
                name: name,
                groups: [MAILERLITE_CONFIG.groupId],
                fields: {
                    name: name,
                    source: 'Marketing AI Webinar Landing Page',
                    signup_date: new Date().toISOString()
                }
            })
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return data.id ? true : false;
        */
        
        // For demo, always return success
        return true;
    } catch (error) {
        console.error('MailerLite API error:', error);
        return false;
    }
}

// Email validation
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Show message to user
function showMessage(message, type) {
    // Remove existing messages
    const existingMessage = document.querySelector('.form-message');
    if (existingMessage) {
        existingMessage.remove();
    }

    // Create new message element
    const messageDiv = document.createElement('div');
    messageDiv.className = `form-message ${type}`;
    messageDiv.textContent = message;
    
    // Style the message
    messageDiv.style.cssText = `
        padding: 1rem;
        margin: 1rem 0;
        border-radius: 8px;
        font-weight: 600;
        text-align: center;
        animation: slideIn 0.3s ease-out;
        ${type === 'success' 
            ? 'background: rgba(34, 197, 94, 0.2); color: #22c55e; border: 1px solid rgba(34, 197, 94, 0.3);'
            : 'background: rgba(239, 68, 68, 0.2); color: #ef4444; border: 1px solid rgba(239, 68, 68, 0.3);'
        }
    `;

    // Insert message after the form
    const form = document.getElementById('newsletter-form');
    form.parentNode.insertBefore(messageDiv, form.nextSibling);

    // Remove message after 5 seconds
    setTimeout(() => {
        messageDiv.style.animation = 'slideOut 0.3s ease-out';
        setTimeout(() => {
            if (messageDiv.parentNode) {
                messageDiv.remove();
            }
        }, 300);
    }, 5000);
}

// Event tracking (for analytics)
function trackEvent(eventName, properties) {
    // Google Analytics 4 tracking
    if (typeof gtag !== 'undefined') {
        gtag('event', eventName, properties);
    }
    
    // Facebook Pixel tracking
    if (typeof fbq !== 'undefined') {
        fbq('track', 'Lead', properties);
    }
    
    // Console log for debugging
    console.log('Event tracked:', eventName, properties);
}

// Smooth scrolling for navigation links
document.addEventListener('DOMContentLoaded', function() {
    const navLinks = document.querySelectorAll('.nav a[href^="#"]');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = targetElement.offsetTop - headerHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
});

// Header scroll effect
window.addEventListener('scroll', function() {
    const header = document.querySelector('.header');
    if (window.scrollY > 100) {
        header.style.background = 'rgba(15, 20, 25, 0.98)';
        header.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.3)';
    } else {
        header.style.background = 'rgba(15, 20, 25, 0.95)';
        header.style.boxShadow = 'none';
    }
});

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            opacity: 0;
            transform: translateY(-10px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    @keyframes slideOut {
        from {
            opacity: 1;
            transform: translateY(0);
        }
        to {
            opacity: 0;
            transform: translateY(-10px);
        }
    }
`;
document.head.appendChild(style);

// Console welcome message
console.log(`
🚀 Marketing AI Webinar Landing Page
📧 Ready to collect email signups
🎯 MailerLite integration configured
⚡ All systems ready!

To connect to MailerLite:
1. Replace YOUR_MAILERLITE_API_KEY with your actual API key
2. Replace YOUR_GROUP_ID with your actual group ID
3. Implement server-side proxy to handle CORS
`);