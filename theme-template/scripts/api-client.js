/**
 * Suchify Store API Client
 * 
 * This is an optional wrapper around the injected API client.
 * You can use this to add custom error handling, caching, or transformations.
 * 
 * In production, the API client is automatically injected as window.__STORE_API__
 * For local development, use the mock API client from test/index.html
 */

class StoreAPIClient {
  constructor(baseUrl = '') {
    this.baseUrl = baseUrl;
  }

  /**
   * Get store settings
   * @returns {Promise<Object>} Store information
   */
  async getStore() {
    try {
      const response = await fetch(`${this.baseUrl}/api/store/${this.storeSlug}/settings`);
      if (!response.ok) throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      return await response.json();
    } catch (error) {
      console.error('Error fetching store:', error);
      throw error;
    }
  }

  /**
   * Get products with optional filters
   * @param {Object} filters - Filter options
   * @returns {Promise<Array>} Array of products
   */
  async getProducts(filters = {}) {
    try {
      const params = new URLSearchParams();
      if (filters.category) params.append('category', filters.category);
      if (filters.search) params.append('search', filters.search);
      if (filters.min_price) params.append('min_price', filters.min_price);
      if (filters.max_price) params.append('max_price', filters.max_price);
      if (filters.in_stock !== undefined) params.append('in_stock', filters.in_stock);

      const queryString = params.toString();
      const url = `${this.baseUrl}/api/store/${this.storeSlug}/products${queryString ? '?' + queryString : ''}`;
      
      const response = await fetch(url);
      if (!response.ok) throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      return await response.json();
    } catch (error) {
      console.error('Error fetching products:', error);
      throw error;
    }
  }

  /**
   * Get categories
   * @returns {Promise<Array>} Array of categories
   */
  async getCategories() {
    try {
      const response = await fetch(`${this.baseUrl}/api/store/${this.storeSlug}/categories`);
      if (!response.ok) throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      return await response.json();
    } catch (error) {
      console.error('Error fetching categories:', error);
      throw error;
    }
  }

  /**
   * Get active promotions
   * @returns {Promise<Array>} Array of promotions
   */
  async getPromotions() {
    try {
      const response = await fetch(`${this.baseUrl}/api/store/${this.storeSlug}/promotions`);
      if (!response.ok) throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      return await response.json();
    } catch (error) {
      console.error('Error fetching promotions:', error);
      throw error;
    }
  }

  /**
   * Add product to cart
   * @param {string} productId - Product UUID
   * @param {number} quantity - Quantity to add
   * @param {Object} variants - Optional product variants
   * @returns {Promise<Object>} Updated cart
   */
  async addToCart(productId, quantity = 1, variants = {}) {
    try {
      const response = await fetch(`${this.baseUrl}/api/store/${this.storeSlug}/cart`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          product_id: productId,
          quantity: quantity,
          variants: variants
        })
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || `HTTP ${response.status}: ${response.statusText}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error adding to cart:', error);
      throw error;
    }
  }

  /**
   * Create order (checkout)
   * @param {Object} orderData - Order information
   * @returns {Promise<Object>} Order confirmation
   */
  async checkout(orderData) {
    try {
      const response = await fetch(`${this.baseUrl}/api/store/${this.storeSlug}/checkout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData)
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || `HTTP ${response.status}: ${response.statusText}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error during checkout:', error);
      throw error;
    }
  }

  /**
   * Get order status
   * @param {string} orderNumber - Order number (e.g., "ORD-2024-001")
   * @returns {Promise<Object>} Order status information
   */
  async getOrderStatus(orderNumber) {
    try {
      const response = await fetch(`${this.baseUrl}/api/store/${this.storeSlug}/order/${orderNumber}`);
      if (!response.ok) throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      return await response.json();
    } catch (error) {
      console.error('Error fetching order status:', error);
      throw error;
    }
  }
}

// Export for use in main.js
if (typeof module !== 'undefined' && module.exports) {
  module.exports = StoreAPIClient;
}

