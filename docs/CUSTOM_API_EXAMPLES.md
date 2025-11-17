# Custom API Integration - Quick Examples

Quick reference examples for common custom API integrations.

## Setup

1. Include `custom-api.js` in your `index.html`:
```html
<script src="scripts/custom-api.js"></script>
```

2. Configure your API endpoint in `custom-api.js`:
```javascript
const CustomAPIConfig = {
  baseUrl: 'https://your-api.example.com/api',
  apiKey: 'your-api-key' // Optional
};
```

## Example 1: Product Reviews

### Backend API Endpoints
- `GET /reviews/product/{productId}` - Get reviews
- `POST /reviews` - Submit review

### Frontend Implementation

```javascript
// Display reviews on product card
async function loadProductReviews(productId) {
  try {
    const reviews = await CustomAPI.getProductReviews(productId);
    
    if (reviews.length > 0) {
      const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
      
      return `
        <div class="product-rating">
          ${'★'.repeat(Math.round(avgRating))}${'☆'.repeat(5 - Math.round(avgRating))}
          <span>${avgRating.toFixed(1)} (${reviews.length} reviews)</span>
        </div>
      `;
    }
  } catch (error) {
    return ''; // Hide reviews if API fails
  }
}

// Add to product rendering
function renderProduct(product) {
  const reviewsHTML = await loadProductReviews(product.id);
  
  return `
    <div class="product">
      <h3>${product.name}</h3>
      ${reviewsHTML}
      <button onclick="addToCart('${product.id}')">Add to Cart</button>
    </div>
  `;
}
```

## Example 2: Analytics Tracking

```javascript
// Track page views
CustomAPI.trackAnalytics('page_view', {
  page: 'storefront',
  store_slug: storeSlug
});

// Track product views
function onProductClick(productId) {
  CustomAPI.trackAnalytics('product_click', {
    product_id: productId
  });
}

// Track checkout completion
async function handleCheckout(orderData) {
  const order = await api.checkout(orderData);
  
  // Track analytics
  CustomAPI.trackAnalytics('purchase', {
    order_id: order.order_id,
    total: order.total,
    items_count: order.items.length
  });
  
  return order;
}
```

## Example 3: Loyalty Points Display

```javascript
// Show loyalty points in header
async function displayLoyaltyPoints(customerEmail) {
  try {
    const loyalty = await CustomAPI.getLoyaltyPoints(customerEmail);
    
    const loyaltyHTML = `
      <div class="loyalty-badge">
        <span class="points">${loyalty.points} points</span>
        <span class="tier">${loyalty.tier} member</span>
      </div>
    `;
    
    document.getElementById('header').insertAdjacentHTML('beforeend', loyaltyHTML);
  } catch (error) {
    // Silently fail - don't break theme
  }
}

// Apply loyalty discount at checkout
async function applyLoyaltyDiscount(customerEmail, cartTotal) {
  try {
    const loyalty = await CustomAPI.getLoyaltyPoints(customerEmail);
    
    if (loyalty.points >= 100) {
      const discount = Math.min(loyalty.points * 0.01, cartTotal * 0.1); // 1 point = $0.01, max 10%
      return discount;
    }
  } catch (error) {
    return 0; // No discount if API fails
  }
}
```

## Example 4: Live Chat Widget

```javascript
// Initialize chat widget
function initializeChat() {
  // Load third-party chat script
  const script = document.createElement('script');
  script.src = 'https://your-chat-provider.com/widget.js';
  script.onload = () => {
    window.ChatWidget.init({
      apiKey: 'your-chat-api-key',
      storeName: storeData.name
    });
  };
  document.head.appendChild(script);
}

// Call in initTheme
function initTheme({ api, container, storeSlug }) {
  // ... existing code ...
  
  // Initialize chat after store loads
  if (storeData) {
    initializeChat();
  }
}
```

## Example 5: Real-time Inventory

```javascript
// Poll for inventory updates
function startInventoryUpdates(productId) {
  const interval = setInterval(async () => {
    try {
      const inventory = await CustomAPI.request(`/inventory/${productId}`);
      
      const stockElement = document.querySelector(`[data-product-id="${productId}"] .stock`);
      if (stockElement) {
        stockElement.textContent = `${inventory.quantity} in stock`;
        
        // Disable add to cart if out of stock
        const addBtn = stockElement.closest('.product').querySelector('.add-to-cart-btn');
        if (inventory.quantity === 0) {
          addBtn.disabled = true;
          addBtn.textContent = 'Out of Stock';
        }
      }
    } catch (error) {
      // Stop polling on error
      clearInterval(interval);
    }
  }, 30000); // Every 30 seconds
}
```

## Example 6: Custom Payment Method

```javascript
// Add custom payment option
function renderPaymentOptions() {
  return `
    <div class="payment-methods">
      <label>
        <input type="radio" name="payment" value="cash"> Cash
      </label>
      <label>
        <input type="radio" name="payment" value="card"> Card
      </label>
      <label>
        <input type="radio" name="payment" value="custom"> Custom Payment
      </label>
    </div>
  `;
}

// Handle custom payment
async function processCustomPayment(orderData) {
  try {
    // Call your payment API
    const paymentResult = await CustomAPI.request('/payment/process', {
      method: 'POST',
      body: {
        amount: orderData.total,
        order_id: orderData.order_id,
        customer_email: orderData.customer_email
      }
    });
    
    if (paymentResult.success) {
      return paymentResult.transaction_id;
    } else {
      throw new Error(paymentResult.error);
    }
  } catch (error) {
    throw new Error('Payment processing failed');
  }
}
```

## Example 7: Product Recommendations

```javascript
// Get recommended products
async function getRecommendedProducts(productId) {
  try {
    const recommendations = await CustomAPI.request(`/recommendations/${productId}`);
    return recommendations;
  } catch (error) {
    return []; // Return empty array on error
  }
}

// Display recommendations
async function displayRecommendations(currentProductId) {
  const recommendations = await getRecommendedProducts(currentProductId);
  
  if (recommendations.length > 0) {
    const recommendationsHTML = `
      <section class="recommendations">
        <h2>You might also like</h2>
        <div class="products">
          ${recommendations.map(product => renderProduct(product)).join('')}
        </div>
      </section>
    `;
    
    document.querySelector('main').insertAdjacentHTML('beforeend', recommendationsHTML);
  }
}
```

## Error Handling Pattern

Always handle errors gracefully:

```javascript
async function loadCustomFeature() {
  try {
    const data = await CustomAPI.request('/endpoint');
    // Use data
    displayFeature(data);
  } catch (error) {
    // Don't break the theme
    console.warn('Custom feature unavailable:', error);
    
    // Option 1: Hide feature
    document.getElementById('custom-feature').style.display = 'none';
    
    // Option 2: Show fallback message
    document.getElementById('custom-feature').innerHTML = 
      '<p>Feature temporarily unavailable</p>';
    
    // Option 3: Use cached data
    const cached = getCachedData();
    if (cached) displayFeature(cached);
  }
}
```

## CORS Setup Examples

### Node.js/Express
```javascript
const cors = require('cors');
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
```

### PHP
```php
<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
?>
```

### Python/Flask
```python
from flask_cors import CORS
CORS(app, resources={r"/api/*": {"origins": "*"}})
```

## Testing Custom APIs

Add to `test/index.html`:

```javascript
// Mock custom API for testing
window.CustomAPI = {
  async request(endpoint) {
    if (endpoint === '/reviews') {
      return [{ id: 1, rating: 5, comment: 'Great!' }];
    }
    return {};
  }
};
```

---

For more details, see [Custom API Integration Guide](./CUSTOM_API_INTEGRATION.md)

