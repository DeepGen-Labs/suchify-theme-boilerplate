# Custom API Integration Guide

This guide explains how partners can integrate their own backend APIs into Suchify themes to add custom functionality.

## Overview

While Suchify provides the core store APIs (products, cart, checkout, etc.), partners may want to add their own features that require custom backend APIs, such as:

- **Reviews and Ratings** - Product reviews system
- **Analytics** - Custom tracking and analytics
- **Loyalty Programs** - Points, rewards, membership tiers
- **Live Chat** - Customer support chat
- **Custom Payment Methods** - Additional payment gateways
- **Social Features** - Comments, sharing, wishlists
- **Inventory Management** - Real-time stock updates
- **Recommendations** - AI-powered product recommendations

## Getting Started

### 1. Create Custom API Module

Create a new file `scripts/custom-api.js` in your theme:

```javascript
// scripts/custom-api.js

const CustomAPIConfig = {
  baseUrl: 'https://your-api.example.com/api',
  apiKey: null, // Set if needed
  timeout: 10000
};

async function customAPIRequest(endpoint, options = {}) {
  const url = `${CustomAPIConfig.baseUrl}${endpoint}`;
  
  const config = {
    method: options.method || 'GET',
    headers: {
      'Content-Type': 'application/json',
      ...(CustomAPIConfig.apiKey && {
        'Authorization': `Bearer ${CustomAPIConfig.apiKey}`
      }),
      ...options.headers
    }
  };
  
  if (options.body) {
    config.body = JSON.stringify(options.body);
  }
  
  try {
    const response = await fetch(url, config);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
}
```

### 2. Include in HTML

Add the script to your `index.html`:

```html
<script src="scripts/api-client.js"></script>
<script src="scripts/custom-api.js"></script>  <!-- Add this -->
<script src="scripts/main.js"></script>
```

### 3. Use in Your Theme

Call your custom APIs from `main.js`:

```javascript
// After store data loads
async function loadStoreData(api, container) {
  // Load Suchify data
  const store = await api.getStore();
  const products = await api.getProducts();
  
  // Load custom data
  const reviews = await CustomAPI.getProductReviews(productId);
  CustomAPI.trackAnalytics('page_view');
  
  // Render theme
  renderTheme(store, products, container);
}
```

## Common Patterns

### Pattern 1: Product Reviews

```javascript
// Get reviews for a product
async function displayProductReviews(productId) {
  try {
    const reviews = await CustomAPI.getProductReviews(productId);
    
    // Render reviews in UI
    const reviewsHTML = reviews.map(review => `
      <div class="review">
        <div class="rating">${'★'.repeat(review.rating)}</div>
        <p>${review.comment}</p>
        <small>By ${review.customer_name}</small>
      </div>
    `).join('');
    
    document.getElementById('reviews-section').innerHTML = reviewsHTML;
  } catch (error) {
    console.error('Failed to load reviews:', error);
  }
}

// Submit a review
async function submitReview(productId, rating, comment) {
  try {
    await CustomAPI.submitReview(productId, {
      rating: rating,
      comment: comment,
      customerEmail: 'customer@example.com'
    });
    alert('Review submitted successfully!');
  } catch (error) {
    alert('Failed to submit review. Please try again.');
  }
}
```

### Pattern 2: Analytics Tracking

```javascript
// Track page views
CustomAPI.trackAnalytics('page_view', {
  page: 'storefront',
  store_name: storeData.name
});

// Track product views
function onProductView(productId) {
  CustomAPI.trackAnalytics('product_view', {
    product_id: productId,
    product_name: product.name
  });
}

// Track add to cart
async function addToCart(productId) {
  const cart = await api.addToCart(productId, 1);
  
  // Track analytics
  CustomAPI.trackAnalytics('add_to_cart', {
    product_id: productId,
    cart_total: cart.total
  });
  
  updateCartDisplay();
}
```

### Pattern 3: Loyalty Program

```javascript
// Check loyalty points
async function displayLoyaltyPoints(customerEmail) {
  try {
    const loyalty = await CustomAPI.getLoyaltyPoints(customerEmail);
    
    document.getElementById('loyalty-points').textContent = 
      `You have ${loyalty.points} points (${loyalty.tier} tier)`;
  } catch (error) {
    // Hide loyalty section on error
    document.getElementById('loyalty-section').style.display = 'none';
  }
}

// Apply loyalty discount
async function applyLoyaltyDiscount() {
  const loyalty = await CustomAPI.getLoyaltyPoints(customerEmail);
  
  if (loyalty.points >= 100) {
    // Apply discount logic
    const discount = loyalty.points * 0.01; // 1 point = $0.01
    // Update cart with discount
  }
}
```

### Pattern 4: Real-time Updates

```javascript
// Poll for inventory updates
function startInventoryPolling(productId) {
  setInterval(async () => {
    try {
      const inventory = await CustomAPI.request(`/inventory/${productId}`);
      
      // Update UI if stock changed
      const stockElement = document.querySelector(`[data-product-id="${productId}"] .stock`);
      if (stockElement) {
        stockElement.textContent = `${inventory.quantity} in stock`;
      }
    } catch (error) {
      // Silently fail - don't spam errors
    }
  }, 30000); // Poll every 30 seconds
}
```

## CORS Configuration

Your backend API **must** support CORS (Cross-Origin Resource Sharing) for the theme to make requests.

### Required CORS Headers

Your API should return these headers:

```
Access-Control-Allow-Origin: *
Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS
Access-Control-Allow-Headers: Content-Type, Authorization
```

### Example: Express.js CORS Setup

```javascript
const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors({
  origin: '*', // In production, specify allowed origins
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
```

### Example: PHP CORS Setup

```php
<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}
?>
```

## Security Considerations

### 1. API Keys

**❌ Don't hardcode API keys in JavaScript:**

```javascript
// BAD - API key is visible in source code
const apiKey = 'secret-key-12345';
```

**✅ Use environment variables or fetch from secure endpoint:**

```javascript
// Option 1: Fetch from secure endpoint (recommended)
async function getAPIKey() {
  const response = await fetch('/api/get-api-key');
  return await response.json();
}

// Option 2: Use server-side proxy
// Make requests through Suchify backend that adds API key
```

### 2. Input Validation

Always validate and sanitize user input:

```javascript
function submitReview(productId, rating, comment) {
  // Validate input
  if (rating < 1 || rating > 5) {
    throw new Error('Rating must be between 1 and 5');
  }
  
  if (comment.length > 1000) {
    throw new Error('Comment too long');
  }
  
  // Sanitize HTML
  const sanitizedComment = escapeHtml(comment);
  
  // Then make API call
  return CustomAPI.submitReview(productId, rating, sanitizedComment);
}
```

### 3. Error Handling

Always handle errors gracefully:

```javascript
async function loadCustomData() {
  try {
    const data = await CustomAPI.request('/custom-endpoint');
    // Use data
  } catch (error) {
    // Don't break the theme if custom API fails
    console.warn('Custom feature unavailable:', error);
    // Show fallback UI or hide feature
  }
}
```

### 4. Rate Limiting

Respect rate limits and implement retry logic:

```javascript
async function apiRequestWithRetry(endpoint, options, maxRetries = 3) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await CustomAPI.request(endpoint, options);
    } catch (error) {
      if (error.status === 429) { // Rate limited
        const delay = Math.pow(2, i) * 1000; // Exponential backoff
        await new Promise(resolve => setTimeout(resolve, delay));
        continue;
      }
      throw error;
    }
  }
}
```

## Best Practices

### 1. Lazy Loading

Load custom features only when needed:

```javascript
// Load reviews only when user clicks "View Reviews"
function showReviews(productId) {
  if (!window.reviewsLoaded) {
    loadProductReviews(productId).then(reviews => {
      displayReviews(reviews);
      window.reviewsLoaded = true;
    });
  }
}
```

### 2. Caching

Cache API responses to reduce requests:

```javascript
const cache = new Map();

async function getCachedData(endpoint) {
  if (cache.has(endpoint)) {
    return cache.get(endpoint);
  }
  
  const data = await CustomAPI.request(endpoint);
  cache.set(endpoint, data);
  
  // Clear cache after 5 minutes
  setTimeout(() => cache.delete(endpoint), 5 * 60 * 1000);
  
  return data;
}
```

### 3. Loading States

Show loading indicators during API calls:

```javascript
async function loadCustomData() {
  const loader = document.getElementById('custom-loader');
  loader.style.display = 'block';
  
  try {
    const data = await CustomAPI.request('/endpoint');
    displayData(data);
  } finally {
    loader.style.display = 'none';
  }
}
```

### 4. Fallback UI

Provide fallback when custom features fail:

```javascript
async function loadReviews() {
  try {
    const reviews = await CustomAPI.getProductReviews(productId);
    displayReviews(reviews);
  } catch (error) {
    // Show fallback message
    document.getElementById('reviews-section').innerHTML = 
      '<p>Reviews are temporarily unavailable. Please try again later.</p>';
  }
}
```

## Testing

### Local Testing

Test your custom APIs locally:

```javascript
// In test/index.html, add mock custom API
window.CustomAPI = {
  async request(endpoint) {
    // Return mock data
    if (endpoint === '/reviews') {
      return [
        { id: 1, rating: 5, comment: 'Great product!' }
      ];
    }
  }
};
```

### Production Testing

1. Test with real API endpoints
2. Verify CORS headers are correct
3. Test error scenarios (network failures, timeouts)
4. Verify security (no exposed API keys)

## Example: Complete Integration

See `theme-template/scripts/custom-api.js` for a complete example implementation.

## Support

For questions about custom API integration:
- **Technical Support**: dev-support@suchify.com
- **Partner Support**: partners@suchify.com

---

**Remember**: Custom APIs are optional. Your theme should work perfectly even if custom APIs are unavailable or fail.

