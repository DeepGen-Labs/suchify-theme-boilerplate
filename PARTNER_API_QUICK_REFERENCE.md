# Partner API Quick Reference

## Base URL

```
/api/store/{storeSlug}
```

## API Client Methods

The injected API client (`window.__STORE_API__`) provides these methods:

### Store Information

```javascript
// Get store settings
const store = await api.getStore();
// Returns: { id, name, slug, description, phone, email, address, logo_url, banner_url, theme_color, social_links, configuration }
```

### Products

```javascript
// Get all products
const products = await api.getProducts();

// Get products with filters
const filtered = await api.getProducts({
  category: "Pizza",
  search: "margherita",
  min_price: 10,
  max_price: 50,
  in_stock: true
});
// Returns: Array of { id, name, description, price, category, image_url, stock_quantity, is_available, sku, tags }
```

### Categories

```javascript
// Get all categories
const categories = await api.getCategories();
// Returns: Array of { name, product_count }
```

### Promotions

```javascript
// Get active promotions
const promotions = await api.getPromotions();
// Returns: Array of { id, name, description, discount_type, discount_value, start_date, end_date, applicable_products, min_purchase_amount, code }
```

### Cart Operations

```javascript
// Add product to cart
const cart = await api.addToCart(productId, quantity);
// Returns: { cart_id, items, subtotal, tax, total }

// Note: quantity is a number, productId is a UUID string
```

### Checkout

```javascript
// Create order
const order = await api.checkout({
  customer_name: "John Doe",
  customer_email: "john@example.com",
  customer_phone: "+1234567890",
  delivery_address: "123 Main St",
  delivery_method: "delivery", // or "pickup"
  payment_method: "cash", // or "card", "online"
  special_instructions: "Ring doorbell",
  cart_items: cart.items,
  promotion_code: "PIZZA20" // optional
});
// Returns: { order_id, order_number, status, total, estimated_delivery_time, tracking_url }
```

### Order Tracking

```javascript
// Get order status
const order = await api.getOrderStatus(orderNumber);
// Returns: { order_id, order_number, status, total, items, customer_name, estimated_delivery_time, created_at, updated_at }
```

## Response Formats

### Success Response
All successful API calls return the data directly (not wrapped in an object).

### Error Response
```javascript
{
  "error": "Error message",
  "code": "ERROR_CODE", // optional
  "details": {} // optional
}
```

## Error Handling

```javascript
try {
  const store = await api.getStore();
} catch (error) {
  console.error('API Error:', error.message);
  // Handle error (show message to user, retry, etc.)
}
```

## Common Patterns

### Loading Store Data

```javascript
async function loadStoreData(api) {
  try {
    const [store, products, categories] = await Promise.all([
      api.getStore(),
      api.getProducts(),
      api.getCategories()
    ]);
    
    return { store, products, categories };
  } catch (error) {
    console.error('Failed to load store data:', error);
    throw error;
  }
}
```

### Cart Management

```javascript
let cart = { items: [], total: 0 };

async function addToCart(productId, quantity = 1) {
  try {
    cart = await api.addToCart(productId, quantity);
    updateCartUI();
  } catch (error) {
    showError('Failed to add item to cart');
  }
}

function updateCartUI() {
  const cartCount = cart.items.reduce((sum, item) => sum + item.quantity, 0);
  document.getElementById('cart-count').textContent = cartCount;
  document.getElementById('cart-total').textContent = `$${cart.total.toFixed(2)}`;
}
```

### Checkout Flow

```javascript
async function handleCheckout(customerData) {
  try {
    const order = await api.checkout({
      ...customerData,
      cart_items: cart.items
    });
    
    // Redirect to order tracking
    window.location.href = order.tracking_url;
  } catch (error) {
    showError('Checkout failed. Please try again.');
  }
}
```

## Rate Limits

- **Public APIs**: 100 requests per minute per IP
- **Cart Operations**: 20 requests per minute per session
- **Checkout**: 5 requests per minute per session

## CORS

All APIs support CORS and can be called from any origin when accessed through the theme runtime.

## Data Types

### Product
```typescript
{
  id: string;           // UUID
  name: string;
  description: string;
  price: number;        // Decimal (e.g., 12.99)
  category: string;
  image_url: string;    // URL or null
  stock_quantity: number;
  is_available: boolean;
  sku: string;
  tags: string[];
}
```

### Store
```typescript
{
  id: string;           // UUID
  name: string;
  slug: string;
  description: string;
  phone: string | null;
  email: string | null;
  address: string | null;
  logo_url: string | null;
  banner_url: string | null;
  theme_color: string;  // Hex color
  social_links: Array<{
    platform: string;
    handle: string;
    url: string;
    enabled: boolean;
  }>;
  configuration: {
    currency: string;
    tax_rate: number;
    shipping_enabled: boolean;
    pickup_enabled: boolean;
  };
}
```

### Cart
```typescript
{
  cart_id: string;      // UUID
  items: Array<{
    product_id: string;
    product_name: string;
    quantity: number;
    unit_price: number;
    total_price: number;
    variants: object;
  }>;
  subtotal: number;
  tax: number;
  total: number;
}
```

### Order
```typescript
{
  order_id: string;     // UUID
  order_number: string; // e.g., "ORD-2024-001"
  status: string;       // pending, preparing, ready, out_for_delivery, delivered, cancelled
  total: number;
  items: Array<CartItem>;
  customer_name: string;
  estimated_delivery_time: string; // ISO 8601
  created_at: string;   // ISO 8601
  updated_at: string;   // ISO 8601
}
```

## Testing

### Mock API Client for Testing

```javascript
const mockAPI = {
  async getStore() {
    return {
      name: "Test Store",
      description: "Test Description",
      logo_url: "https://via.placeholder.com/150"
    };
  },
  async getProducts() {
    return [{
      id: "1",
      name: "Test Product",
      price: 10.99,
      category: "Test",
      image_url: "https://via.placeholder.com/300"
    }];
  },
  async getCategories() {
    return [{ name: "Test", product_count: 1 }];
  },
  async addToCart(productId, quantity) {
    return { items: [], total: 10.99 };
  },
  async checkout(orderData) {
    return { order_number: "TEST-001", tracking_url: "/track/TEST-001" };
  }
};

// Use in tests
window.__STORE_API__ = mockAPI;
```

---

**Quick Tips:**
- Always use `await` with API calls
- Wrap API calls in try-catch blocks
- Show loading states during API calls
- Cache store data when possible
- Handle errors gracefully

