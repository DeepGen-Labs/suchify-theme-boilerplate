# Partner Theme Integration Guide

## Overview

This guide provides everything partners need to create custom themes for the Suchify marketplace. Themes are HTML/CSS/JavaScript bundles that integrate with our APIs to display store data dynamically.

## Table of Contents

1. [Theme Architecture](#theme-architecture)
2. [API Documentation](#api-documentation)
3. [Theme Structure](#theme-structure)
4. [Integration Steps](#integration-steps)
5. [Submission Process](#submission-process)
6. [Testing & Validation](#testing--validation)
7. [Best Practices](#best-practices)

---

## Theme Architecture

### How Themes Work

Themes are **client-side HTML/CSS/JavaScript bundles** that:
- Load once from CDN/storage
- Fetch all data from APIs in real-time
- Render dynamically based on store data
- Support customization through configuration

### Execution Flow

```
Customer visits /store/{slug}
  ↓
System loads theme bundle from CDN
  ↓
Theme initializes and calls APIs:
  - GET /api/store/{slug}/settings
  - GET /api/store/{slug}/products
  - GET /api/store/{slug}/categories
  ↓
Theme renders with API data
  ↓
User interactions trigger API calls:
  - POST /api/store/{slug}/cart
  - POST /api/store/{slug}/checkout
```

### API Client Injection

The system automatically injects an API client into your theme. Access it via:

```javascript
// The API client is available as window.__STORE_API__
const api = window.__STORE_API__;

// Or if using initTheme callback:
function initTheme({ api, container }) {
  // api is the StoreAPIClient instance
  // container is the DOM element to render into
}
```

---

## API Documentation

### Base URL

All API endpoints use the following base URL pattern:
```
/api/store/{storeSlug}
```

Where `{storeSlug}` is the unique store identifier (e.g., "my-restaurant").

### Authentication

**Public Store APIs** do not require authentication. They are accessible to anyone visiting the storefront.

### API Endpoints

#### 1. Get Store Settings

**Endpoint:** `GET /api/store/{slug}/settings`

**Description:** Retrieves public store information including name, description, contact details, and branding.

**Response:**
```json
{
  "id": "uuid",
  "name": "My Restaurant",
  "slug": "my-restaurant",
  "description": "Best Italian food in town",
  "phone": "+1234567890",
  "email": "contact@restaurant.com",
  "address": "123 Main St, City, State 12345",
  "logo_url": "https://cdn.example.com/logo.png",
  "banner_url": "https://cdn.example.com/banner.png",
  "theme_color": "#3b82f6",
  "social_links": [
    {
      "platform": "facebook",
      "handle": "myrestaurant",
      "url": "https://facebook.com/myrestaurant",
      "enabled": true
    }
  ],
  "configuration": {
    "currency": "USD",
    "tax_rate": 0.08,
    "shipping_enabled": true,
    "pickup_enabled": true
  }
}
```

**Example Usage:**
```javascript
const store = await api.getStore();
console.log(store.name); // "My Restaurant"
```

---

#### 2. Get Products

**Endpoint:** `GET /api/store/{slug}/products`

**Description:** Retrieves all active products for the store. Supports filtering and pagination.

**Query Parameters:**
- `category` (optional): Filter by category name
- `search` (optional): Search by product name
- `min_price` (optional): Minimum price filter
- `max_price` (optional): Maximum price filter
- `in_stock` (optional): Filter by stock availability (true/false)

**Response:**
```json
[
  {
    "id": "uuid",
    "name": "Margherita Pizza",
    "description": "Classic pizza with tomato and mozzarella",
    "price": 12.99,
    "category": "Pizza",
    "image_url": "https://cdn.example.com/pizza.jpg",
    "stock_quantity": 50,
    "is_available": true,
    "sku": "PIZZA-001",
    "tags": ["vegetarian", "popular"]
  }
]
```

**Example Usage:**
```javascript
// Get all products
const products = await api.getProducts();

// Get products by category
const pizzaProducts = await api.getProducts({ category: "Pizza" });

// Search products
const searchResults = await api.getProducts({ search: "pizza" });
```

---

#### 3. Get Categories

**Endpoint:** `GET /api/store/{slug}/categories`

**Description:** Retrieves all product categories.

**Response:**
```json
[
  {
    "name": "Pizza",
    "product_count": 15
  },
  {
    "name": "Pasta",
    "product_count": 10
  }
]
```

**Example Usage:**
```javascript
const categories = await api.getCategories();
categories.forEach(category => {
  console.log(category.name);
});
```

---

#### 4. Get Promotions

**Endpoint:** `GET /api/store/{slug}/promotions`

**Description:** Retrieves active promotions and discounts.

**Response:**
```json
[
  {
    "id": "uuid",
    "name": "20% Off All Pizzas",
    "description": "Get 20% off on all pizza items",
    "discount_type": "percentage",
    "discount_value": 20,
    "start_date": "2024-01-01T00:00:00Z",
    "end_date": "2024-12-31T23:59:59Z",
    "applicable_products": ["uuid1", "uuid2"],
    "min_purchase_amount": 0,
    "code": "PIZZA20"
  }
]
```

**Example Usage:**
```javascript
const promotions = await api.getPromotions();
promotions.forEach(promo => {
  console.log(promo.name);
});
```

---

#### 5. Add to Cart

**Endpoint:** `POST /api/store/{slug}/cart`

**Description:** Adds a product to the shopping cart. Returns updated cart state.

**Request Body:**
```json
{
  "product_id": "uuid",
  "quantity": 2,
  "variants": {
    "size": "large",
    "toppings": ["pepperoni", "mushrooms"]
  }
}
```

**Response:**
```json
{
  "cart_id": "uuid",
  "items": [
    {
      "product_id": "uuid",
      "product_name": "Margherita Pizza",
      "quantity": 2,
      "unit_price": 12.99,
      "total_price": 25.98,
      "variants": {}
    }
  ],
  "subtotal": 25.98,
  "tax": 2.08,
  "total": 28.06
}
```

**Example Usage:**
```javascript
const cart = await api.addToCart("product-uuid", 2);
console.log(cart.total); // 28.06
```

---

#### 6. Checkout

**Endpoint:** `POST /api/store/{slug}/checkout`

**Description:** Creates an order from the current cart.

**Request Body:**
```json
{
  "customer_name": "John Doe",
  "customer_email": "john@example.com",
  "customer_phone": "+1234567890",
  "delivery_address": "123 Main St, City, State 12345",
  "delivery_method": "delivery", // or "pickup"
  "payment_method": "cash", // or "card", "online"
  "special_instructions": "Please ring the doorbell",
  "cart_items": [
    {
      "product_id": "uuid",
      "quantity": 2,
      "unit_price": 12.99
    }
  ],
  "promotion_code": "PIZZA20" // optional
}
```

**Response:**
```json
{
  "order_id": "uuid",
  "order_number": "ORD-2024-001",
  "status": "pending",
  "total": 28.06,
  "estimated_delivery_time": "2024-01-15T14:30:00Z",
  "tracking_url": "/track/ORD-2024-001"
}
```

**Example Usage:**
```javascript
const order = await api.checkout({
  customer_name: "John Doe",
  customer_email: "john@example.com",
  customer_phone: "+1234567890",
  delivery_method: "delivery",
  payment_method: "cash",
  cart_items: cart.items
});

window.location.href = order.tracking_url;
```

---

#### 7. Get Order Status

**Endpoint:** `GET /api/store/{slug}/order/{orderNumber}`

**Description:** Retrieves order status and tracking information.

**Response:**
```json
{
  "order_id": "uuid",
  "order_number": "ORD-2024-001",
  "status": "preparing", // pending, preparing, ready, out_for_delivery, delivered, cancelled
  "total": 28.06,
  "items": [...],
  "customer_name": "John Doe",
  "estimated_delivery_time": "2024-01-15T14:30:00Z",
  "created_at": "2024-01-15T13:00:00Z",
  "updated_at": "2024-01-15T13:15:00Z"
}
```

**Example Usage:**
```javascript
const order = await api.getOrderStatus("ORD-2024-001");
console.log(order.status); // "preparing"
```

---

## Theme Structure

### Required Files

Your theme package must include the following structure:

```
theme-package/
├── index.html          # Main entry point (REQUIRED)
├── manifest.json       # Theme metadata (REQUIRED)
├── styles/
│   └── main.css       # Main stylesheet
├── scripts/
│   ├── main.js        # Theme initialization (REQUIRED)
│   └── api-client.js  # Optional: Custom API wrapper
└── assets/            # Optional: Images, fonts, etc.
    ├── images/
    └── fonts/
```

### manifest.json

**Required file** that describes your theme:

```json
{
  "name": "Restaurant Menu Pro",
  "version": "1.0.0",
  "description": "Modern menu-focused theme for restaurants",
  "category": "restaurant",
  "apiVersion": "1.0",
  "requiredApis": [
    "get_public_store_settings",
    "get_public_products",
    "get_categories",
    "create_order",
    "get_promotions"
  ],
  "features": [
    "menu_display",
    "cart",
    "checkout",
    "promotions",
    "social_links"
  ],
  "configurable": {
    "colors": true,
    "layout": true,
    "fonts": true
  },
  "restrictions": {
    "allowedDomains": [],
    "requiresAuth": false
  }
}
```

**Fields:**
- `name`: Theme display name
- `version`: Semantic version (e.g., "1.0.0")
- `description`: Brief description
- `category`: Theme category (restaurant, retail, etc.)
- `apiVersion`: Minimum API version required
- `requiredApis`: List of API endpoints your theme uses
- `features`: List of features your theme supports
- `configurable`: What can be customized
- `restrictions`: Security restrictions

### index.html

**Required file** - Main HTML structure:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Store Theme</title>
  <link rel="stylesheet" href="styles/main.css">
</head>
<body>
  <div id="theme-container">
    <!-- Your theme content will be rendered here -->
    <div id="loading">Loading...</div>
  </div>
  
  <script src="scripts/api-client.js"></script>
  <script src="scripts/main.js"></script>
</body>
</html>
```

### scripts/main.js

**Required file** - Theme initialization:

```javascript
// This function is called automatically by the theme runtime
function initTheme({ api, container, storeSlug }) {
  // api: StoreAPIClient instance
  // container: DOM element to render into
  // storeSlug: Store slug identifier
  
  const themeContainer = container || document.getElementById('theme-container');
  
  // Initialize your theme
  loadStoreData(api, themeContainer);
}

async function loadStoreData(api, container) {
  try {
    // Fetch store data
    const store = await api.getStore();
    const products = await api.getProducts();
    const categories = await api.getCategories();
    
    // Render theme
    renderTheme(store, products, categories, container);
  } catch (error) {
    console.error('Error loading store data:', error);
    container.innerHTML = '<div class="error">Failed to load store data</div>';
  }
}

function renderTheme(store, products, categories, container) {
  container.innerHTML = `
    <header>
      <h1>${store.name}</h1>
      <p>${store.description}</p>
    </header>
    <main>
      <nav>
        ${categories.map(cat => `<button>${cat.name}</button>`).join('')}
      </nav>
      <div class="products">
        ${products.map(product => `
          <div class="product">
            <img src="${product.image_url}" alt="${product.name}">
            <h3>${product.name}</h3>
            <p>$${product.price}</p>
            <button onclick="addToCart('${product.id}')">Add to Cart</button>
          </div>
        `).join('')}
      </div>
    </main>
  `;
}

// Cart functionality
let cart = [];

async function addToCart(productId) {
  const api = window.__STORE_API__;
  try {
    cart = await api.addToCart(productId, 1);
    updateCartDisplay();
  } catch (error) {
    console.error('Error adding to cart:', error);
  }
}

function updateCartDisplay() {
  // Update cart UI
  const cartCount = cart.items.reduce((sum, item) => sum + item.quantity, 0);
  document.getElementById('cart-count').textContent = cartCount;
}
```

---

## Integration Steps

### Step 1: Create Theme Structure

1. Create a folder for your theme
2. Add `index.html` with your HTML structure
3. Create `styles/` folder and add CSS files
4. Create `scripts/` folder and add JavaScript files
5. Create `manifest.json` with theme metadata

### Step 2: Integrate APIs

1. Use the injected API client (`window.__STORE_API__`)
2. Call APIs to fetch store data
3. Render data in your HTML structure
4. Handle user interactions (add to cart, checkout)

### Step 3: Test Locally

1. Create a test HTML file that mocks the API client
2. Test all functionality
3. Ensure responsive design works
4. Test on multiple browsers

### Step 4: Package Theme

1. Ensure all files are included
2. Verify `manifest.json` is correct
3. Test that relative paths work
4. Create a ZIP file (optional, for submission)

---

## Submission Process

### Via Partner Portal

1. **Login** to Partner Portal
2. Navigate to **Themes** section
3. Click **Submit Theme** button
4. Fill out the theme form:
   - Theme Name
   - Description
   - Category
   - Version
   - Tags
5. **Upload Files:**
   - Preview images (at least 1, recommended 3-5)
   - Theme files (HTML, CSS, JS, JSON)
6. **Submit** for review

### Required Information

- **Theme Name**: Display name for marketplace
- **Description**: Detailed description of features
- **Category**: Select appropriate category
- **Version**: Semantic version (e.g., 1.0.0)
- **Tags**: Relevant tags for searchability
- **Preview Images**: Screenshots of your theme (PNG/JPG, max 5MB each)
- **Theme Files**: All HTML, CSS, JS, and manifest.json files

### Review Process

1. **Automated Validation**: System checks:
   - Required files present
   - manifest.json valid
   - No security issues
   - API compatibility

2. **Manual Review**: Admin reviews:
   - Design quality
   - Functionality
   - Code quality
   - Documentation

3. **Status Updates**:
   - `pending`: Awaiting review
   - `approved`: Ready for marketplace
   - `rejected`: Needs changes (feedback provided)
   - `published`: Live on marketplace

---

## Testing & Validation

### Pre-Submission Checklist

- [ ] All required files present (index.html, manifest.json, main.js)
- [ ] manifest.json is valid JSON
- [ ] Theme initializes correctly
- [ ] All API calls work
- [ ] Responsive design tested
- [ ] Cross-browser compatibility
- [ ] No console errors
- [ ] Cart functionality works
- [ ] Checkout flow works
- [ ] Preview images uploaded

### Testing Locally

Create a test file to mock the API:

```html
<!DOCTYPE html>
<html>
<head>
  <link rel="stylesheet" href="styles/main.css">
</head>
<body>
  <div id="theme-container"></div>
  
  <script>
    // Mock API client
    window.__STORE_API__ = {
      async getStore() {
        return {
          name: "Test Restaurant",
          description: "Test Description",
          logo_url: "https://via.placeholder.com/150"
        };
      },
      async getProducts() {
        return [
          {
            id: "1",
            name: "Test Product",
            price: 10.99,
            category: "Test",
            image_url: "https://via.placeholder.com/300"
          }
        ];
      },
      async getCategories() {
        return [{ name: "Test", product_count: 1 }];
      },
      async addToCart(productId, quantity) {
        return { items: [], total: 10.99 };
      },
      async checkout(orderData) {
        return { order_number: "TEST-001" };
      }
    };
  </script>
  
  <script src="scripts/main.js"></script>
  <script>
    // Initialize theme
    if (typeof initTheme === 'function') {
      initTheme({
        api: window.__STORE_API__,
        container: document.getElementById('theme-container'),
        storeSlug: 'test-store'
      });
    }
  </script>
</body>
</html>
```

---

## Best Practices

### Design

1. **Responsive First**: Ensure theme works on mobile, tablet, and desktop
2. **Performance**: Optimize images, minimize CSS/JS
3. **Accessibility**: Use semantic HTML, proper ARIA labels
4. **Loading States**: Show loading indicators while fetching data
5. **Error Handling**: Display user-friendly error messages

### Code Quality

1. **Clean Code**: Well-organized, commented code
2. **No External Dependencies**: Avoid external libraries (unless necessary)
3. **Security**: Sanitize user inputs, prevent XSS
4. **Error Handling**: Try-catch blocks for API calls
5. **Browser Compatibility**: Test on Chrome, Firefox, Safari, Edge

### API Usage

1. **Efficient Calls**: Minimize API requests, cache when possible
2. **Error Handling**: Handle API errors gracefully
3. **Loading States**: Show loading indicators during API calls
4. **Optimistic Updates**: Update UI immediately, sync with API

### User Experience

1. **Fast Loading**: Optimize initial load time
2. **Smooth Interactions**: Use transitions and animations
3. **Clear CTAs**: Make buttons and actions obvious
4. **Feedback**: Show success/error messages
5. **Cart Visibility**: Always show cart state

---

## Example Theme Template

A complete example theme is available in the Partner Portal under **Theme Generator Agent**. You can:

1. Use the generator to create a starter theme
2. Customize the generated code
3. Download and modify locally
4. Submit your customized version

---

## Support & Resources

### Documentation
- [Theme System Design](./THEME_SYSTEM_DESIGN.md)
- [API Reference](#api-documentation)
- [Partner Portal Guide](./PARTNER_PROGRAM_REQUIREMENTS.md)

### Contact
- **Partner Support**: partners@suchify.com
- **Technical Issues**: dev-support@suchify.com
- **Marketplace Questions**: marketplace@suchify.com

### Community
- Partner Discord: [Join Link]
- Developer Forum: [Forum Link]
- GitHub Examples: [Repo Link]

---

## FAQ

**Q: Can I use external libraries like jQuery or React?**  
A: Yes, but keep bundle size small. Consider CDN links for common libraries.

**Q: How do I handle custom fonts?**  
A: Include font files in `assets/fonts/` and reference them in CSS.

**Q: Can themes access store owner data?**  
A: No, themes only have access to public store APIs.

**Q: How do I update my theme after submission?**  
A: Submit a new version with updated version number in manifest.json.

**Q: Can I charge for my theme?**  
A: Yes, set pricing in the theme submission form.

**Q: How do I test with a real store?**  
A: Create a test store in your partner account and use its slug.

---

## Version History

- **v1.0** (2024-01-15): Initial partner integration guide
- **v1.1** (2024-01-20): Added API examples and testing guide

---

**Last Updated:** January 2024  
**Maintained By:** Suchify Development Team

