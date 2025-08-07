// Main JavaScript for Sacramento Solar Companies
// Handles navigation, forms, and interactive features

// Mobile navigation toggle
function initMobileNav() {
    const mobileNavToggle = document.querySelector('.mobile-nav-toggle');
    const navLinks = document.querySelector('.nav-links');
    
    if (mobileNavToggle) {
        mobileNavToggle.addEventListener('click', function() {
            navLinks.classList.toggle('active');
            this.classList.toggle('active');
        });
    }
}

// Smooth scrolling for anchor links
function initSmoothScrolling() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
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
}

// Quote form handling
function initQuoteForm() {
    const quoteForm = document.querySelector('.quote-form');
    
    if (quoteForm) {
        quoteForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(this);
            const formObject = Object.fromEntries(formData);
            
            // Validate form
            if (validateQuoteForm(formObject)) {
                // Show loading state
                const submitBtn = this.querySelector('button[type="submit"]');
                const originalText = submitBtn.textContent;
                submitBtn.textContent = 'Sending...';
                submitBtn.disabled = true;
                
                // Simulate form submission (replace with actual API call)
                setTimeout(() => {
                    showSuccessMessage('Thank you! We\'ll connect you with Sacramento solar companies within 24 hours.');
                    this.reset();
                    submitBtn.textContent = originalText;
                    submitBtn.disabled = false;
                }, 2000);
            }
        });
    }
}

// Validate quote form
function validateQuoteForm(data) {
    const required = ['name', 'email', 'phone', 'address', 'monthly_bill'];
    const errors = [];
    
    required.forEach(field => {
        if (!data[field] || data[field].trim() === '') {
            errors.push(`${field.replace('_', ' ')} is required`);
        }
    });
    
    // Validate email
    if (data.email && !isValidEmail(data.email)) {
        errors.push('Please enter a valid email address');
    }
    
    // Validate phone
    if (data.phone && !isValidPhone(data.phone)) {
        errors.push('Please enter a valid phone number');
    }
    
    // Validate monthly bill
    if (data.monthly_bill && (isNaN(data.monthly_bill) || data.monthly_bill <= 0)) {
        errors.push('Please enter a valid monthly bill amount');
    }
    
    if (errors.length > 0) {
        showErrorMessage(errors.join('<br>'));
        return false;
    }
    
    return true;
}

// Email validation
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Phone validation
function isValidPhone(phone) {
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    return phoneRegex.test(phone.replace(/[\s\-\(\)]/g, ''));
}

// Show success message
function showSuccessMessage(message) {
    const messageDiv = document.createElement('div');
    messageDiv.className = 'message success fade-in';
    messageDiv.innerHTML = `
        <div class="message-content">
            <span class="message-icon">✓</span>
            <span>${message}</span>
        </div>
    `;
    
    document.body.appendChild(messageDiv);
    
    // Remove message after 5 seconds
    setTimeout(() => {
        messageDiv.remove();
    }, 5000);
}

// Show error message
function showErrorMessage(message) {
    const messageDiv = document.createElement('div');
    messageDiv.className = 'message error fade-in';
    messageDiv.innerHTML = `
        <div class="message-content">
            <span class="message-icon">✗</span>
            <span>${message}</span>
        </div>
    `;
    
    document.body.appendChild(messageDiv);
    
    // Remove message after 5 seconds
    setTimeout(() => {
        messageDiv.remove();
    }, 5000);
}

// Company card interactions
function initCompanyCards() {
    const companyCards = document.querySelectorAll('.company-card');
    
    companyCards.forEach(card => {
        const quoteBtn = card.querySelector('.btn-primary');
        
        if (quoteBtn) {
            quoteBtn.addEventListener('click', function(e) {
                e.preventDefault();
                
                const companyName = card.querySelector('h3').textContent;
                
                // Pre-fill quote form with company name
                const messageField = document.querySelector('#message');
                if (messageField) {
                    messageField.value = `I'm interested in getting a quote from ${companyName}.`;
                }
                
                // Scroll to quote form
                const quoteForm = document.querySelector('#quote-form');
                if (quoteForm) {
                    quoteForm.scrollIntoView({ behavior: 'smooth' });
                }
            });
        }
    });
}

// Animate elements on scroll
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    const animateElements = document.querySelectorAll('.company-card, .stat-card, .testimonial-card');
    animateElements.forEach(el => observer.observe(el));
}

// Header scroll effect
function initHeaderScroll() {
    const header = document.querySelector('.header');
    let lastScrollTop = 0;
    
    window.addEventListener('scroll', () => {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        if (scrollTop > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        
        lastScrollTop = scrollTop;
    });
}

// Search functionality for blog
function initSearch() {
    const searchInput = document.querySelector('.search-input');
    const searchResults = document.querySelector('.search-results');
    
    if (searchInput) {
        searchInput.addEventListener('input', debounce(function() {
            const query = this.value.trim();
            
            if (query.length >= 2) {
                performSearch(query);
            } else {
                hideSearchResults();
            }
        }, 300));
    }
}

// Debounce function
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Perform search (placeholder - replace with actual search API)
function performSearch(query) {
    // This would typically make an API call to search the blog
    console.log('Searching for:', query);
    
    // For now, just show a placeholder result
    const searchResults = document.querySelector('.search-results');
    if (searchResults) {
        searchResults.innerHTML = `
            <div class="search-result">
                <h4>Searching for: "${query}"</h4>
                <p>Search functionality will be implemented with backend integration.</p>
            </div>
        `;
        searchResults.style.display = 'block';
    }
}

// Hide search results
function hideSearchResults() {
    const searchResults = document.querySelector('.search-results');
    if (searchResults) {
        searchResults.style.display = 'none';
    }
}

// Newsletter signup
function initNewsletterSignup() {
    const newsletterForm = document.querySelector('.newsletter-form');
    
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const email = this.querySelector('input[type="email"]').value;
            
            if (isValidEmail(email)) {
                showSuccessMessage('Thank you for subscribing to Sacramento solar news!');
                this.reset();
            } else {
                showErrorMessage('Please enter a valid email address.');
            }
        });
    }
}

// Lazy loading for images
function initLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
}

// Analytics tracking
function initAnalytics() {
    // Track page views
    if (typeof gtag !== 'undefined') {
        gtag('config', 'GA_MEASUREMENT_ID', {
            page_title: document.title,
            page_location: window.location.href
        });
    }
    
    // Track quote form submissions
    const quoteForm = document.querySelector('.quote-form');
    if (quoteForm) {
        quoteForm.addEventListener('submit', function() {
            if (typeof gtag !== 'undefined') {
                gtag('event', 'quote_request', {
                    event_category: 'engagement',
                    event_label: 'sacramento_solar_quote'
                });
            }
        });
    }
    
    // Track calculator usage
    const calculateBtn = document.querySelector('button[onclick="calculateSavings()"]');
    if (calculateBtn) {
        calculateBtn.addEventListener('click', function() {
            if (typeof gtag !== 'undefined') {
                gtag('event', 'calculator_used', {
                    event_category: 'engagement',
                    event_label: 'sacramento_solar_calculator'
                });
            }
        });
    }
}

// Initialize all functionality
document.addEventListener('DOMContentLoaded', function() {
    initMobileNav();
    initSmoothScrolling();
    initQuoteForm();
    initCompanyCards();
    initScrollAnimations();
    initHeaderScroll();
    initSearch();
    initNewsletterSignup();
    initLazyLoading();
    initAnalytics();
    
    // Add CSS for messages
    const style = document.createElement('style');
    style.textContent = `
        .message {
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 10000;
            padding: 1rem;
            border-radius: 8px;
            max-width: 400px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        }
        
        .message.success {
            background-color: #d4edda;
            color: #155724;
            border: 1px solid #c3e6cb;
        }
        
        .message.error {
            background-color: #f8d7da;
            color: #721c24;
            border: 1px solid #f5c6cb;
        }
        
        .message-content {
            display: flex;
            align-items: center;
            gap: 0.5rem;
        }
        
        .message-icon {
            font-weight: bold;
        }
        
        .header.scrolled {
            background-color: rgba(255,255,255,0.95);
            backdrop-filter: blur(10px);
        }
        
        .breakdown {
            margin-top: 1.5rem;
            padding-top: 1.5rem;
            border-top: 1px solid rgba(255,255,255,0.2);
        }
        
        .breakdown h4 {
            color: white;
            margin-bottom: 1rem;
        }
        
        .breakdown-item {
            display: flex;
            justify-content: space-between;
            margin-bottom: 0.5rem;
            font-size: 0.9rem;
        }
        
        .breakdown-item.total {
            font-weight: 600;
            border-top: 1px solid rgba(255,255,255,0.2);
            padding-top: 0.5rem;
            margin-top: 0.5rem;
        }
    `;
    document.head.appendChild(style);
});

// Export functions for global use
window.SacramentoSolar = {
    showSuccessMessage,
    showErrorMessage,
    validateQuoteForm,
    isValidEmail,
    isValidPhone
};