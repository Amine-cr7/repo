// Companies Directory JavaScript
// Handles filtering, sorting, and interactive features for the companies page

// Company data (in a real application, this would come from a database)
const companiesData = [
    {
        id: 'tesla-solar',
        name: 'Tesla Solar Sacramento',
        rating: 4.8,
        reviews: 127,
        priceRange: 'medium',
        services: ['residential', 'battery', 'ev-charging'],
        areas: ['downtown', 'midtown', 'elk-grove', 'folsom'],
        description: 'Leading solar and battery storage solutions with competitive pricing and excellent customer service in the Sacramento area.',
        priceRangeText: '$12,000 - $25,000',
        coverage: 'Sacramento, Elk Grove, Folsom',
        servicesText: 'Solar Panels, Battery Storage, EV Chargers',
        founded: 2016,
        features: ['Residential', 'Battery Storage', 'EV Charging', 'Warranty']
    },
    {
        id: 'sunrun',
        name: 'Sunrun Sacramento',
        rating: 4.7,
        reviews: 89,
        priceRange: 'medium',
        services: ['residential'],
        areas: ['downtown', 'midtown', 'elk-grove', 'folsom', 'roseville'],
        description: 'Nation\'s leading residential solar company with flexible financing options and comprehensive warranty coverage.',
        priceRangeText: '$15,000 - $30,000',
        coverage: 'Sacramento Metro Area',
        servicesText: 'Solar Leasing, PPA, Purchase Options',
        founded: 2007,
        features: ['Residential', 'Leasing', 'PPA', 'Warranty']
    },
    {
        id: 'solar-city',
        name: 'Solar City Sacramento',
        rating: 4.5,
        reviews: 156,
        priceRange: 'low',
        services: ['residential', 'commercial'],
        areas: ['downtown', 'midtown', 'davis', 'woodland'],
        description: 'Local solar experts with over 15 years of experience installing high-quality solar systems throughout Sacramento County.',
        priceRangeText: '$10,000 - $22,000',
        coverage: 'Sacramento, Davis, Woodland',
        servicesText: 'Residential & Commercial Solar',
        founded: 2006,
        features: ['Residential', 'Commercial', 'Local', 'Warranty']
    },
    {
        id: 'vivint-solar',
        name: 'Vivint Solar Sacramento',
        rating: 4.4,
        reviews: 73,
        priceRange: 'high',
        services: ['residential', 'battery'],
        areas: ['sacramento', 'roseville', 'rocklin'],
        description: 'Premium solar solutions with smart home integration and comprehensive monitoring systems for Sacramento homeowners.',
        priceRangeText: '$18,000 - $35,000',
        coverage: 'Sacramento, Roseville, Rocklin',
        servicesText: 'Solar + Smart Home Integration',
        founded: 2011,
        features: ['Residential', 'Smart Home', 'Monitoring', 'Warranty']
    }
    // Additional companies would be added here
];

// Current filters
let currentFilters = {
    rating: '',
    price: '',
    services: '',
    areas: ''
};

// Apply filters to companies
function applyFilters() {
    const ratingFilter = document.getElementById('rating-filter').value;
    const priceFilter = document.getElementById('price-filter').value;
    const serviceFilter = document.getElementById('service-filter').value;
    const areaFilter = document.getElementById('area-filter').value;
    
    currentFilters = {
        rating: ratingFilter,
        price: priceFilter,
        services: serviceFilter,
        areas: areaFilter
    };
    
    filterCompanies();
}

// Clear all filters
function clearFilters() {
    document.getElementById('rating-filter').value = '';
    document.getElementById('price-filter').value = '';
    document.getElementById('service-filter').value = '';
    document.getElementById('area-filter').value = '';
    
    currentFilters = {
        rating: '',
        price: '',
        services: '',
        areas: ''
    };
    
    filterCompanies();
}

// Filter companies based on current filters
function filterCompanies() {
    const companyCards = document.querySelectorAll('.company-card');
    let visibleCount = 0;
    
    companyCards.forEach(card => {
        let shouldShow = true;
        
        // Rating filter
        if (currentFilters.rating) {
            const rating = parseFloat(card.dataset.rating);
            const minRating = parseFloat(currentFilters.rating);
            if (rating < minRating) {
                shouldShow = false;
            }
        }
        
        // Price filter
        if (currentFilters.price && shouldShow) {
            const price = card.dataset.price;
            if (price !== currentFilters.price) {
                shouldShow = false;
            }
        }
        
        // Services filter
        if (currentFilters.services && shouldShow) {
            const services = card.dataset.services.split(',');
            if (!services.includes(currentFilters.services)) {
                shouldShow = false;
            }
        }
        
        // Areas filter
        if (currentFilters.areas && shouldShow) {
            const areas = card.dataset.areas.split(',');
            if (!areas.includes(currentFilters.areas)) {
                shouldShow = false;
            }
        }
        
        // Show/hide card
        if (shouldShow) {
            card.style.display = 'block';
            visibleCount++;
        } else {
            card.style.display = 'none';
        }
    });
    
    // Update companies count
    updateCompaniesCount(visibleCount);
}

// Update companies count display
function updateCompaniesCount(count) {
    const countElement = document.getElementById('companies-count');
    if (countElement) {
        countElement.textContent = `${count} companies found`;
    }
}

// Sort companies
function sortCompanies() {
    const sortBy = document.getElementById('sort-by').value;
    const companiesGrid = document.getElementById('companies-grid');
    const companyCards = Array.from(companiesGrid.querySelectorAll('.company-card'));
    
    companyCards.sort((a, b) => {
        switch (sortBy) {
            case 'rating':
                return parseFloat(b.dataset.rating) - parseFloat(a.dataset.rating);
            case 'reviews':
                const reviewsA = parseInt(a.querySelector('.rating-text').textContent.match(/\((\d+)/)[1]);
                const reviewsB = parseInt(b.querySelector('.rating-text').textContent.match(/\((\d+)/)[1]);
                return reviewsB - reviewsA;
            case 'price-low':
                return getPriceValue(a.dataset.price) - getPriceValue(b.dataset.price);
            case 'price-high':
                return getPriceValue(b.dataset.price) - getPriceValue(a.dataset.price);
            case 'name':
                const nameA = a.querySelector('h3').textContent;
                const nameB = b.querySelector('h3').textContent;
                return nameA.localeCompare(nameB);
            default:
                return 0;
        }
    });
    
    // Reorder cards in DOM
    companyCards.forEach(card => {
        companiesGrid.appendChild(card);
    });
}

// Get price value for sorting
function getPriceValue(priceRange) {
    switch (priceRange) {
        case 'low': return 1;
        case 'medium': return 2;
        case 'high': return 3;
        default: return 0;
    }
}

// Load more companies (placeholder function)
function loadMoreCompanies() {
    const loadMoreBtn = document.querySelector('.load-more-container button');
    loadMoreBtn.textContent = 'Loading...';
    loadMoreBtn.disabled = true;
    
    // Simulate loading more companies
    setTimeout(() => {
        // In a real application, this would load more companies from the server
        loadMoreBtn.textContent = 'All Companies Loaded';
        loadMoreBtn.disabled = true;
        
        // Show success message
        if (window.SacramentoSolar) {
            window.SacramentoSolar.showSuccessMessage('All Sacramento solar companies have been loaded!');
        }
    }, 2000);
}

// Initialize map functionality
function initMap() {
    const mapContainer = document.getElementById('sacramento-map');
    
    if (mapContainer) {
        // In a real application, this would initialize Google Maps or similar
        console.log('Map initialization would go here');
        
        // For now, add some interactive features to the placeholder
        const areaItems = mapContainer.querySelectorAll('.area-item');
        areaItems.forEach(item => {
            item.addEventListener('click', function() {
                const areaName = this.querySelector('.area-name').textContent;
                filterByArea(areaName.toLowerCase().replace(' ', '-'));
            });
        });
    }
}

// Filter by specific area
function filterByArea(area) {
    // Set the area filter
    const areaFilter = document.getElementById('area-filter');
    areaFilter.value = area;
    
    // Apply filters
    applyFilters();
    
    // Scroll to companies section
    const companiesSection = document.querySelector('.companies-section');
    if (companiesSection) {
        companiesSection.scrollIntoView({ behavior: 'smooth' });
    }
}

// Company card interactions
function initCompanyCards() {
    const companyCards = document.querySelectorAll('.company-card');
    
    companyCards.forEach(card => {
        // Add hover effects
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
        
        // Add click tracking
        const quoteBtn = card.querySelector('.btn-primary');
        if (quoteBtn) {
            quoteBtn.addEventListener('click', function() {
                const companyName = card.querySelector('h3').textContent;
                trackCompanyClick(companyName);
            });
        }
    });
}

// Track company clicks for analytics
function trackCompanyClick(companyName) {
    if (typeof gtag !== 'undefined') {
        gtag('event', 'company_quote_request', {
            event_category: 'engagement',
            event_label: companyName.toLowerCase().replace(/\s+/g, '_')
        });
    }
}

// Initialize comparison functionality
function initComparison() {
    const compareCheckboxes = document.querySelectorAll('.compare-checkbox');
    
    compareCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            updateComparisonBar();
        });
    });
}

// Update comparison bar
function updateComparisonBar() {
    const checkedBoxes = document.querySelectorAll('.compare-checkbox:checked');
    const comparisonBar = document.querySelector('.comparison-bar');
    
    if (checkedBoxes.length > 0) {
        if (!comparisonBar) {
            createComparisonBar();
        }
        updateComparisonBarContent(checkedBoxes.length);
    } else {
        if (comparisonBar) {
            comparisonBar.remove();
        }
    }
}

// Create comparison bar
function createComparisonBar() {
    const comparisonBar = document.createElement('div');
    comparisonBar.className = 'comparison-bar';
    comparisonBar.innerHTML = `
        <div class="comparison-content">
            <span class="comparison-text">0 companies selected</span>
            <button class="btn btn-primary" onclick="compareSelected()">Compare Selected</button>
            <button class="btn btn-outline" onclick="clearComparison()">Clear All</button>
        </div>
    `;
    
    document.body.appendChild(comparisonBar);
}

// Update comparison bar content
function updateComparisonBarContent(count) {
    const comparisonText = document.querySelector('.comparison-text');
    if (comparisonText) {
        comparisonText.textContent = `${count} companies selected`;
    }
}

// Compare selected companies
function compareSelected() {
    const checkedBoxes = document.querySelectorAll('.compare-checkbox:checked');
    const selectedCompanies = Array.from(checkedBoxes).map(cb => cb.value);
    
    if (selectedCompanies.length < 2) {
        alert('Please select at least 2 companies to compare.');
        return;
    }
    
    // Redirect to comparison page
    const comparisonUrl = `/comparison/solar-companies-sacramento/?companies=${selectedCompanies.join(',')}`;
    window.location.href = comparisonUrl;
}

// Clear comparison
function clearComparison() {
    const checkboxes = document.querySelectorAll('.compare-checkbox');
    checkboxes.forEach(cb => cb.checked = false);
    
    const comparisonBar = document.querySelector('.comparison-bar');
    if (comparisonBar) {
        comparisonBar.remove();
    }
}

// Initialize all functionality
document.addEventListener('DOMContentLoaded', function() {
    initCompanyCards();
    initMap();
    initComparison();
    
    // Add CSS for additional features
    const style = document.createElement('style');
    style.textContent = `
        .page-header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 3rem 0;
            text-align: center;
        }
        
        .breadcrumb {
            margin-bottom: 1rem;
        }
        
        .breadcrumb a {
            color: rgba(255,255,255,0.8);
            text-decoration: none;
        }
        
        .breadcrumb span {
            color: white;
        }
        
        .page-subtitle {
            font-size: 1.1rem;
            opacity: 0.9;
            max-width: 600px;
            margin: 0 auto;
        }
        
        .filters-section {
            background-color: #f8f9fa;
            padding: 2rem 0;
            border-bottom: 1px solid #e9ecef;
        }
        
        .filters-container {
            display: flex;
            gap: 1rem;
            flex-wrap: wrap;
            align-items: end;
        }
        
        .filter-group {
            display: flex;
            flex-direction: column;
            gap: 0.5rem;
        }
        
        .filter-group label {
            font-weight: 500;
            font-size: 0.9rem;
        }
        
        .companies-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 2rem;
            flex-wrap: wrap;
            gap: 1rem;
        }
        
        .companies-stats {
            display: flex;
            align-items: center;
            gap: 1rem;
        }
        
        .sort-options {
            display: flex;
            align-items: center;
            gap: 0.5rem;
        }
        
        .company-features {
            display: flex;
            flex-wrap: wrap;
            gap: 0.5rem;
            margin-bottom: 1rem;
        }
        
        .feature {
            background-color: #f8f9fa;
            padding: 0.25rem 0.5rem;
            border-radius: 4px;
            font-size: 0.8rem;
            color: #666;
        }
        
        .company-actions {
            display: flex;
            gap: 0.5rem;
            flex-wrap: wrap;
        }
        
        .load-more-container {
            text-align: center;
            margin-top: 3rem;
        }
        
        .map-section {
            padding: 4rem 0;
            background-color: #f8f9fa;
        }
        
        .map-container {
            max-width: 800px;
            margin: 0 auto;
        }
        
        .sacramento-map {
            background: white;
            border-radius: 12px;
            padding: 2rem;
            box-shadow: 0 5px 20px rgba(0,0,0,0.1);
        }
        
        .map-placeholder {
            text-align: center;
        }
        
        .service-areas {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 1rem;
            margin-top: 2rem;
        }
        
        .area-item {
            background: #f8f9fa;
            padding: 1rem;
            border-radius: 8px;
            cursor: pointer;
            transition: background-color 0.3s ease;
        }
        
        .area-item:hover {
            background-color: #e9ecef;
        }
        
        .area-item {
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        
        .comparison-bar {
            position: fixed;
            bottom: 0;
            left: 0;
            right: 0;
            background: white;
            border-top: 1px solid #ddd;
            padding: 1rem;
            box-shadow: 0 -2px 10px rgba(0,0,0,0.1);
            z-index: 1000;
        }
        
        .comparison-content {
            display: flex;
            justify-content: space-between;
            align-items: center;
            max-width: 1200px;
            margin: 0 auto;
        }
        
        @media (max-width: 768px) {
            .filters-container {
                flex-direction: column;
                align-items: stretch;
            }
            
            .companies-header {
                flex-direction: column;
                align-items: stretch;
            }
            
            .companies-stats {
                flex-direction: column;
                gap: 0.5rem;
            }
            
            .comparison-content {
                flex-direction: column;
                gap: 1rem;
            }
        }
    `;
    document.head.appendChild(style);
});

// Export functions for global use
window.CompaniesDirectory = {
    applyFilters,
    clearFilters,
    sortCompanies,
    loadMoreCompanies,
    filterByArea,
    compareSelected,
    clearComparison
};