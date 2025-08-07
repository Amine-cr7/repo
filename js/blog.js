// Blog Index JavaScript
// Handles category filtering, load more, and newsletter signup

document.addEventListener('DOMContentLoaded', function() {
    initializeBlogFilters();
    initializeLoadMore();
    initializeNewsletterForm();
});

// Category filtering functionality
function initializeBlogFilters() {
    const categoryButtons = document.querySelectorAll('.category-btn');
    const postCards = document.querySelectorAll('.post-card');
    
    categoryButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons
            categoryButtons.forEach(btn => btn.classList.remove('active'));
            
            // Add active class to clicked button
            this.classList.add('active');
            
            const selectedCategory = this.getAttribute('data-category');
            
            // Filter posts
            filterPosts(selectedCategory, postCards);
        });
    });
}

function filterPosts(category, postCards) {
    postCards.forEach(card => {
        const cardCategory = card.getAttribute('data-category');
        
        if (category === 'all' || cardCategory === category) {
            card.style.display = 'block';
            // Add animation
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            
            setTimeout(() => {
                card.style.transition = 'all 0.3s ease';
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, 100);
        } else {
            card.style.display = 'none';
        }
    });
    
    // Update visible posts count
    updateVisiblePostsCount(category);
}

function updateVisiblePostsCount(category) {
    const allPosts = document.querySelectorAll('.post-card');
    const visiblePosts = Array.from(allPosts).filter(card => {
        const cardCategory = card.getAttribute('data-category');
        return category === 'all' || cardCategory === category;
    });
    
    // You can add a posts count display here if needed
    console.log(`Showing ${visiblePosts.length} posts for category: ${category}`);
}

// Load more functionality
function initializeLoadMore() {
    const loadMoreBtn = document.getElementById('load-more-btn');
    let currentPage = 1;
    const postsPerPage = 6;
    
    if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', function() {
            loadMorePosts(currentPage + 1);
            currentPage++;
        });
    }
}

function loadMorePosts(page) {
    // Simulate loading more posts
    const loadMoreBtn = document.getElementById('load-more-btn');
    loadMoreBtn.textContent = 'Loading...';
    loadMoreBtn.disabled = true;
    
    // Simulate API call delay
    setTimeout(() => {
        // In a real implementation, you would fetch posts from an API
        const additionalPosts = generateAdditionalPosts(page);
        
        if (additionalPosts.length > 0) {
            appendPostsToGrid(additionalPosts);
            loadMoreBtn.textContent = 'Load More Articles';
            loadMoreBtn.disabled = false;
        } else {
            loadMoreBtn.textContent = 'No More Articles';
            loadMoreBtn.disabled = true;
        }
    }, 1000);
}

function generateAdditionalPosts(page) {
    // Mock data for additional posts
    const mockPosts = [
        {
            title: "Sacramento Solar Panel Maintenance Guide 2025",
            excerpt: "Learn how to maintain your solar panels for optimal performance in Sacramento's climate.",
            category: "installation",
            date: "November 30, 2024",
            author: "Maintenance Expert",
            readTime: "5 min read",
            image: "/images/blog/solar-maintenance-guide.jpg",
            link: "/blog/2024/sacramento-solar-maintenance-guide.html",
            tags: ["Maintenance", "Performance"]
        },
        {
            title: "Understanding Sacramento's Time-of-Use Rates",
            excerpt: "How SMUD's time-of-use rates affect your solar savings and what you need to know.",
            category: "savings",
            date: "November 25, 2024",
            author: "Rate Analyst",
            readTime: "4 min read",
            image: "/images/blog/time-of-use-rates.jpg",
            link: "/blog/2024/sacramento-time-of-use-rates.html",
            tags: ["SMUD", "Rates"]
        }
    ];
    
    // Return subset based on page (simulate pagination)
    const startIndex = (page - 2) * 2; // Adjusted for mock data
    return mockPosts.slice(startIndex, startIndex + 2);
}

function appendPostsToGrid(posts) {
    const postsGrid = document.querySelector('.posts-grid');
    
    posts.forEach(post => {
        const postElement = createPostElement(post);
        postsGrid.appendChild(postElement);
    });
}

function createPostElement(post) {
    const article = document.createElement('article');
    article.className = 'post-card';
    article.setAttribute('data-category', post.category);
    
    article.innerHTML = `
        <div class="post-image">
            <img src="${post.image}" alt="${post.title}" loading="lazy">
            <div class="post-category">${capitalizeFirst(post.category)}</div>
        </div>
        <div class="post-content">
            <div class="post-meta">
                <span class="post-date">${post.date}</span>
                <span class="post-author">${post.author}</span>
                <span class="reading-time">${post.readTime}</span>
            </div>
            <h3><a href="${post.link}">${post.title}</a></h3>
            <p class="post-excerpt">${post.excerpt}</p>
            <div class="post-tags">
                ${post.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
            </div>
            <a href="${post.link}" class="read-more">Read More →</a>
        </div>
    `;
    
    return article;
}

function capitalizeFirst(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

// Newsletter form functionality
function initializeNewsletterForm() {
    const newsletterForm = document.querySelector('.newsletter-form');
    
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            handleNewsletterSubmission(this);
        });
    }
}

function handleNewsletterSubmission(form) {
    const emailInput = form.querySelector('input[type="email"]');
    const submitBtn = form.querySelector('button[type="submit"]');
    const email = emailInput.value.trim();
    
    if (!email) {
        showNotification('Please enter a valid email address.', 'error');
        return;
    }
    
    // Disable form during submission
    submitBtn.textContent = 'Subscribing...';
    submitBtn.disabled = true;
    emailInput.disabled = true;
    
    // Simulate API call
    setTimeout(() => {
        // In a real implementation, you would send this to your backend
        console.log('Newsletter subscription:', email);
        
        // Reset form
        emailInput.value = '';
        submitBtn.textContent = 'Subscribe';
        submitBtn.disabled = false;
        emailInput.disabled = false;
        
        // Show success message
        showNotification('Thank you for subscribing to our newsletter!', 'success');
    }, 1500);
}

function showNotification(message, type) {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <span>${message}</span>
        <button onclick="this.parentElement.remove()" style="margin-left: 1rem; background: none; border: none; color: inherit; cursor: pointer; font-size: 1.2rem;">&times;</button>
    `;
    
    // Add notification styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        color: white;
        font-weight: 500;
        z-index: 10000;
        transform: translateX(100%);
        transition: transform 0.3s ease;
        ${type === 'success' ? 'background-color: #27ae60;' : 'background-color: #e74c3c;'}
    `;
    
    // Add to document
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 5000);
}

// Search functionality (if needed in the future)
function initializeBlogSearch() {
    const searchInput = document.querySelector('.blog-search');
    
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase().trim();
            searchPosts(searchTerm);
        });
    }
}

function searchPosts(searchTerm) {
    const postCards = document.querySelectorAll('.post-card');
    
    postCards.forEach(card => {
        const title = card.querySelector('h2, h3').textContent.toLowerCase();
        const excerpt = card.querySelector('.post-excerpt').textContent.toLowerCase();
        const tags = Array.from(card.querySelectorAll('.tag')).map(tag => tag.textContent.toLowerCase());
        
        const isMatch = title.includes(searchTerm) || 
                       excerpt.includes(searchTerm) || 
                       tags.some(tag => tag.includes(searchTerm));
        
        if (searchTerm === '' || isMatch) {
            card.style.display = 'block';
            card.style.opacity = '1';
        } else {
            card.style.display = 'none';
        }
    });
}

// Add responsive behavior for mobile
function addMobileResponsiveness() {
    const categoryButtons = document.querySelectorAll('.category-btn');
    
    // Handle mobile category scrolling
    if (window.innerWidth <= 768) {
        const categoriesContainer = document.querySelector('.categories-filter');
        if (categoriesContainer) {
            categoriesContainer.style.overflowX = 'auto';
            categoriesContainer.style.scrollBehavior = 'smooth';
        }
    }
}

// Initialize mobile responsiveness on load and resize
window.addEventListener('load', addMobileResponsiveness);
window.addEventListener('resize', addMobileResponsiveness);