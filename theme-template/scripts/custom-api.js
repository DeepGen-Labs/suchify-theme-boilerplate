/**
 * Custom API Integration Example
 * 
 * This file demonstrates how partners can integrate their own backend APIs
 * into the Suchify theme. You can add custom functionality like:
 * - Reviews and ratings
 * - Analytics tracking
 * - Custom payment methods
 * - Loyalty programs
 * - Live chat
 * - etc.
 * 
 * IMPORTANT: Make sure your backend APIs support CORS for cross-origin requests
 */

/**
 * Example: Custom API Configuration
 * 
 * Store your API endpoints and configuration here
 */
const CustomAPIConfig = {
  // Base URL for your backend API
  baseUrl: 'https://your-api.example.com/api',
  
  // API key or authentication token (if needed)
  // NOTE: For security, consider using environment variables or
  // fetching credentials from a secure endpoint
  apiKey: null, // Set this if your API requires authentication
  
  // Request timeout in milliseconds
  timeout: 10000
};

/**
 * Generic API request function
 * 
 * @param {string} endpoint - API endpoint (e.g., '/reviews')
 * @param {Object} options - Fetch options (method, body, headers, etc.)
 * @returns {Promise} API response
 */
async function customAPIRequest(endpoint, options = {}) {
  const url = `${CustomAPIConfig.baseUrl}${endpoint}`;
  
  const defaultHeaders = {
    'Content-Type': 'application/json',
  };
  
  // Add API key if configured
  if (CustomAPIConfig.apiKey) {
    defaultHeaders['Authorization'] = `Bearer ${CustomAPIConfig.apiKey}`;
  }
  
  const config = {
    method: options.method || 'GET',
    headers: {
      ...defaultHeaders,
      ...options.headers
    },
    ...options
  };
  
  // Add body if provided
  if (options.body && typeof options.body === 'object') {
    config.body = JSON.stringify(options.body);
  }
  
  try {
    // Create timeout promise
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Request timeout')), CustomAPIConfig.timeout);
    });
    
    // Race between fetch and timeout
    const response = await Promise.race([
      fetch(url, config),
      timeoutPromise
    ]);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: response.statusText }));
      throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Custom API request failed:', error);
    throw error;
  }
}

/**
 * Example: Submit Product Review
 * 
 * @param {string} productId - Product ID
 * @param {Object} reviewData - Review data (rating, comment, customer info)
 * @returns {Promise} Review submission result
 */
async function submitReview(productId, reviewData) {
  try {
    const result = await customAPIRequest('/reviews', {
      method: 'POST',
      body: {
        product_id: productId,
        rating: reviewData.rating,
        comment: reviewData.comment,
        customer_name: reviewData.customerName,
        customer_email: reviewData.customerEmail,
        // Add any other required fields
      }
    });
    
    return result;
  } catch (error) {
    console.error('Failed to submit review:', error);
    throw error;
  }
}

/**
 * Example: Get Product Reviews
 * 
 * @param {string} productId - Product ID
 * @returns {Promise<Array>} Array of reviews
 */
async function getProductReviews(productId) {
  try {
    const reviews = await customAPIRequest(`/reviews/product/${productId}`);
    return reviews;
  } catch (error) {
    console.error('Failed to fetch reviews:', error);
    return []; // Return empty array on error to not break the UI
  }
}

/**
 * Example: Track Analytics Event
 * 
 * @param {string} eventName - Event name (e.g., 'product_view', 'add_to_cart')
 * @param {Object} eventData - Event data
 */
async function trackAnalytics(eventName, eventData = {}) {
  try {
    // Fire and forget - don't wait for response
    customAPIRequest('/analytics/track', {
      method: 'POST',
      body: {
        event: eventName,
        data: eventData,
        timestamp: new Date().toISOString(),
        store_slug: window.__STORE_SLUG__ || 'unknown',
        // Add user agent, referrer, etc. if needed
      }
    }).catch(err => {
      // Silently fail analytics - don't break user experience
      console.warn('Analytics tracking failed:', err);
    });
  } catch (error) {
    // Silently fail
    console.warn('Analytics tracking error:', error);
  }
}

/**
 * Example: Check Loyalty Points
 * 
 * @param {string} customerEmail - Customer email
 * @returns {Promise<Object>} Loyalty points information
 */
async function getLoyaltyPoints(customerEmail) {
  try {
    const loyaltyData = await customAPIRequest(`/loyalty/${encodeURIComponent(customerEmail)}`);
    return loyaltyData;
  } catch (error) {
    console.error('Failed to fetch loyalty points:', error);
    return { points: 0, tier: 'bronze' }; // Default values
  }
}

/**
 * Example: Initialize Custom Features
 * 
 * Call this function in your initTheme or after store data loads
 */
function initializeCustomFeatures() {
  // Example: Track page view
  trackAnalytics('page_view', {
    page: 'storefront',
    store_name: storeData?.name
  });
  
  // Example: Initialize live chat widget
  // loadLiveChatWidget();
  
  // Example: Initialize custom payment method
  // initializeCustomPayment();
  
  console.log('Custom features initialized');
}

/**
 * Example: Add Review Section to Product Card
 * 
 * This shows how to enhance the product display with custom data
 */
async function enhanceProductWithReviews(productId, productElement) {
  try {
    const reviews = await getProductReviews(productId);
    
    if (reviews.length > 0) {
      const averageRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
      const reviewCount = reviews.length;
      
      // Add review section to product card
      const reviewSection = document.createElement('div');
      reviewSection.className = 'product-reviews';
      reviewSection.innerHTML = `
        <div class="rating">
          ${'★'.repeat(Math.round(averageRating))}${'☆'.repeat(5 - Math.round(averageRating))}
          <span>${averageRating.toFixed(1)} (${reviewCount})</span>
        </div>
      `;
      
      // Insert before add to cart button
      const addToCartBtn = productElement.querySelector('.add-to-cart-btn');
      if (addToCartBtn) {
        addToCartBtn.parentNode.insertBefore(reviewSection, addToCartBtn);
      }
    }
  } catch (error) {
    // Silently fail - don't break product display
    console.warn('Failed to load reviews for product:', productId);
  }
}

// Export functions for use in main.js
if (typeof window !== 'undefined') {
  window.CustomAPI = {
    request: customAPIRequest,
    submitReview,
    getProductReviews,
    trackAnalytics,
    getLoyaltyPoints,
    initializeCustomFeatures,
    enhanceProductWithReviews,
    config: CustomAPIConfig
  };
}

