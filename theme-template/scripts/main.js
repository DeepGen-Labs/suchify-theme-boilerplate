/**
 * Suchify Starter Theme - Main Script
 * 
 * This is the main initialization file for your theme.
 * The initTheme function is called automatically by the Suchify theme runtime.
 */

// Global state
let storeData = null;
let products = [];
let categories = [];
let promotions = [];
let cart = { items: [], subtotal: 0, tax: 0, total: 0 };
let currentCategory = 'all';
let api = null;

/**
 * Initialize theme - Called automatically by Suchify theme runtime
 * @param {Object} params - Initialization parameters
 * @param {Object} params.api - StoreAPIClient instance
 * @param {HTMLElement} params.container - Container element to render into
 * @param {string} params.storeSlug - Store slug identifier
 */
function initTheme({ api: apiClient, container, storeSlug }) {
  // Store API client reference
  api = apiClient || window.__STORE_API__;
  
  if (!api) {
    console.error('API client not available');
    const containerEl = container || document.getElementById('theme-container');
    if (containerEl) {
      containerEl.innerHTML = '<div class="error">API client not available. Please check your theme configuration.</div>';
    }
    return;
  }

  // Set store slug if using custom API client
  if (api.storeSlug !== undefined) {
    api.storeSlug = storeSlug;
  }

  const themeContainer = container || document.getElementById('theme-container');
  
  if (!themeContainer) {
    console.error('Theme container not found');
    return;
  }

  // Initialize theme
  loadStoreData(themeContainer);
}

/**
 * Load all store data from APIs
 */
async function loadStoreData(container) {
  try {
    // Show loading state
    showLoading(container);

    // Fetch all data in parallel
    const [store, productsData, categoriesData, promotionsData] = await Promise.all([
      api.getStore(),
      api.getProducts(),
      api.getCategories(),
      api.getPromotions().catch(() => []) // Promotions are optional
    ]);

    // Store data globally
    storeData = store;
    products = productsData;
    categories = categoriesData;
    promotions = promotionsData;

    // Update page title
    if (store.name) {
      document.title = store.name;
    }

    // Initialize custom features (if custom-api.js is included)
    if (window.CustomAPI && typeof window.CustomAPI.initializeCustomFeatures === 'function') {
      window.CustomAPI.initializeCustomFeatures();
    }

    // Render theme
    renderTheme(container);
  } catch (error) {
    console.error('Error loading store data:', error);
    showError(container, 'Failed to load store data. Please try again later.');
  }
}

/**
 * Show loading state
 */
function showLoading(container) {
  container.innerHTML = `
    <div class="loading">
      <div class="spinner"></div>
      <p>Loading store...</p>
    </div>
  `;
}

/**
 * Show error state
 */
function showError(container, message) {
  container.innerHTML = `
    <div class="error">
      <h2>Error</h2>
      <p>${escapeHtml(message)}</p>
      <button onclick="location.reload()" style="margin-top: 1rem; padding: 0.5rem 1rem; background: var(--primary-color); color: white; border: none; border-radius: 8px; cursor: pointer;">
        Retry
      </button>
    </div>
  `;
}

/**
 * Render the complete theme
 */
function renderTheme(container) {
  container.innerHTML = `
    ${renderHeader()}
    ${renderNavigation()}
    <main>
      ${renderPromotions()}
      ${renderProducts()}
    </main>
    ${renderFooter()}
    ${renderCart()}
  `;

  // Attach event listeners
  attachEventListeners();
}

/**
 * Generate initials from store name
 * @param {string} name - Store name
 * @returns {string} Initials (e.g., "SR" for "Store Restaurant")
 */
function generateInitials(name) {
  if (!name) return 'ST';
  
  // Split by spaces and get first letter of each word
  const words = name.trim().split(/\s+/);
  
  if (words.length === 1) {
    // Single word: take first 2 letters
    return name.substring(0, 2).toUpperCase();
  } else {
    // Multiple words: take first letter of first 2 words
    return (words[0].charAt(0) + words[1].charAt(0)).toUpperCase();
  }
}

/**
 * Render header with store info
 */
function renderHeader() {
  // Use store logo if available, otherwise use initials
  const storeName = storeData.name || 'Store';
  const initials = generateInitials(storeName);
  
  let logo = '';
  if (storeData.logo_url) {
    // Store has a logo URL - use it, with fallback to initials on error
    logo = `<img src="${escapeHtml(storeData.logo_url)}" alt="${escapeHtml(storeName)}" class="logo" onerror="this.style.display='none'; const initialsEl = this.nextElementSibling; if(initialsEl) initialsEl.style.display='flex';">`;
  }
  
  // Always create initials logo as fallback (hidden if image logo exists and loads successfully)
  const initialsLogo = `<div class="logo-initials" style="${storeData.logo_url ? 'display: none;' : ''}">${escapeHtml(initials)}</div>`;
  
  const socialLinks = storeData.social_links && storeData.social_links.length > 0
    ? `<div class="social-links">
        ${storeData.social_links
          .filter(link => link.enabled)
          .map(link => `<a href="${escapeHtml(link.url)}" target="_blank" rel="noopener noreferrer" class="social-link">${escapeHtml(link.platform)}</a>`)
          .join('')}
       </div>`
    : '';

  return `
    <header>
      ${logo}
      ${initialsLogo}
      <h1>${escapeHtml(storeName)}</h1>
      ${storeData.description ? `<p class="description">${escapeHtml(storeData.description)}</p>` : ''}
      ${socialLinks}
    </header>
  `;
}

/**
 * Render category navigation
 */
function renderNavigation() {
  if (!categories || categories.length === 0) {
    return '';
  }

  return `
    <nav>
      <div class="category-buttons">
        <button class="category-btn ${currentCategory === 'all' ? 'active' : ''}" data-category="all">
          All
        </button>
        ${categories.map(cat => `
          <button class="category-btn ${currentCategory === cat.name ? 'active' : ''}" data-category="${escapeHtml(cat.name)}">
            ${escapeHtml(cat.name)} (${cat.product_count || 0})
          </button>
        `).join('')}
      </div>
    </nav>
  `;
}

/**
 * Render promotions banner
 */
function renderPromotions() {
  if (!promotions || promotions.length === 0) {
    return '';
  }

  return `
    <div class="promotions">
      <h3 style="margin-bottom: 0.5rem;">Special Offers</h3>
      ${promotions.map(promo => `
        <div class="promotion-item">
          <strong>${escapeHtml(promo.name)}</strong>
          <span>${escapeHtml(promo.description || '')}</span>
          ${promo.code ? `<br><small>Use code: <strong>${escapeHtml(promo.code)}</strong></small>` : ''}
        </div>
      `).join('')}
    </div>
  `;
}

/**
 * Render products grid
 */
function renderProducts() {
  const filteredProducts = currentCategory === 'all'
    ? products
    : products.filter(p => p.category === currentCategory);

  if (filteredProducts.length === 0) {
    return `
      <div class="text-center" style="padding: 3rem;">
        <h2>No products found</h2>
        <p>${currentCategory === 'all' ? 'This store has no products yet.' : `No products in the "${currentCategory}" category.`}</p>
      </div>
    `;
  }

  return `
    <div class="products">
      ${filteredProducts.map(product => renderProduct(product)).join('')}
    </div>
  `;
}

/**
 * Render single product card
 */
function renderProduct(product) {
  // Create a data URI for placeholder image (SVG) - URL encoded
  const placeholderImage = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='200'%3E%3Crect width='300' height='200' fill='%23f9fafb'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='Arial, sans-serif' font-size='14' fill='%236b7280'%3ENo Image%3C/text%3E%3C/svg%3E";
  
  // Generate unique ID for this image to prevent infinite loops
  const imageId = `product-img-${product.id}-${Date.now()}`;
  
  // Use a simpler approach - directly use placeholder if no URL, or use proper error handling
  const image = product.image_url 
    ? `<img id="${imageId}" src="${escapeHtml(product.image_url)}" alt="${escapeHtml(product.name)}" class="product-image" loading="lazy" decoding="async" onerror="if(!this.dataset.fallbackSet){this.dataset.fallbackSet='true';this.onerror=null;this.src='${placeholderImage.replace(/'/g, "\\'")}';}">`
    : `<img src="${placeholderImage}" alt="No image available" class="product-image">`;

  const tags = product.tags && product.tags.length > 0
    ? `<div class="product-tags">
        ${product.tags.map(tag => `<span class="tag">${escapeHtml(tag)}</span>`).join('')}
       </div>`
    : '';

  const availability = product.is_available && (product.stock_quantity === null || product.stock_quantity > 0)
    ? ''
    : 'disabled';

  const price = formatPrice(product.price, storeData.configuration?.currency || 'USD');

  return `
    <div class="product">
      ${image}
      <div class="product-info">
        <h3 class="product-name">${escapeHtml(product.name)}</h3>
        ${product.description ? `<p class="product-description">${escapeHtml(product.description)}</p>` : ''}
        ${tags}
        <div class="product-price">${price}</div>
        <button 
          class="add-to-cart-btn" 
          ${availability}
          onclick="addToCart('${product.id}')"
          data-product-id="${product.id}"
        >
          ${availability ? 'Out of Stock' : 'Add to Cart'}
        </button>
      </div>
    </div>
  `;
}

/**
 * Render footer
 */
function renderFooter() {
  const contactInfo = [];
  if (storeData.phone) contactInfo.push(`Phone: ${escapeHtml(storeData.phone)}`);
  if (storeData.email) contactInfo.push(`Email: ${escapeHtml(storeData.email)}`);
  if (storeData.address) contactInfo.push(`Address: ${escapeHtml(storeData.address)}`);

  return `
    <footer>
      ${contactInfo.length > 0 ? `<p>${contactInfo.join(' | ')}</p>` : ''}
      <p style="margin-top: 1rem; color: var(--text-light); font-size: 0.9rem;">
        Powered by Suchify
      </p>
    </footer>
  `;
}

/**
 * Render cart button and panel
 */
function renderCart() {
  const cartCount = cart.items.reduce((sum, item) => sum + item.quantity, 0);
  
  return `
    <div class="cart" onclick="toggleCart()">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M9 21H5a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2h4m7 0V5a2 2 0 0 0-2-2h-2M9 7V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2m-6 4h8m-8 4h8m-8-8h8"/>
      </svg>
      ${cartCount > 0 ? `<span class="cart-count">${cartCount}</span>` : ''}
    </div>
    <div class="cart-panel" id="cart-panel">
      <div class="cart-header">
        <h2>Shopping Cart</h2>
        <button class="close-cart" onclick="toggleCart()">×</button>
      </div>
      <div class="cart-items" id="cart-items">
        ${renderCartItems()}
      </div>
      <div class="cart-footer">
        <div class="cart-total">
          <span>Total:</span>
          <span>${formatPrice(cart.total, storeData?.configuration?.currency || 'USD')}</span>
        </div>
        <button 
          class="checkout-btn" 
          ${cart.items.length === 0 ? 'disabled' : ''}
          onclick="handleCheckout()"
        >
          Checkout
        </button>
      </div>
    </div>
  `;
}

/**
 * Render cart items
 */
function renderCartItems() {
  if (cart.items.length === 0) {
    return '<div class="text-center" style="padding: 2rem; color: var(--text-light);">Your cart is empty</div>';
  }

  return cart.items.map(item => `
    <div class="cart-item">
      <div class="cart-item-info">
        <div class="cart-item-name">${escapeHtml(item.product_name)}</div>
        <div class="cart-item-price">${formatPrice(item.unit_price, storeData?.configuration?.currency || 'USD')} × ${item.quantity}</div>
      </div>
      <div class="cart-item-quantity">
        <button class="quantity-btn" onclick="updateCartQuantity('${item.product_id}', ${item.quantity - 1})">-</button>
        <span>${item.quantity}</span>
        <button class="quantity-btn" onclick="updateCartQuantity('${item.product_id}', ${item.quantity + 1})">+</button>
      </div>
    </div>
  `).join('');
}

/**
 * Attach event listeners
 */
function attachEventListeners() {
  // Category filter buttons
  const categoryButtons = document.querySelectorAll('.category-btn');
  categoryButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      currentCategory = btn.dataset.category;
      const main = document.querySelector('main');
      if (main) {
        main.innerHTML = `
          ${renderPromotions()}
          ${renderProducts()}
        `;
        attachEventListeners();
      }
    });
  });
}

/**
 * Add product to cart
 */
async function addToCart(productId) {
  if (!api) {
    console.error('API client not available');
    return;
  }

  try {
    const button = document.querySelector(`[data-product-id="${productId}"]`);
    if (button) {
      button.disabled = true;
      button.textContent = 'Adding...';
    }

    cart = await api.addToCart(productId, 1);
    updateCartDisplay();
    
    if (button) {
      button.disabled = false;
      button.textContent = 'Add to Cart';
    }
  } catch (error) {
    console.error('Error adding to cart:', error);
    alert('Failed to add item to cart. Please try again.');
    
    const button = document.querySelector(`[data-product-id="${productId}"]`);
    if (button) {
      button.disabled = false;
      button.textContent = 'Add to Cart';
    }
  }
}

/**
 * Update cart quantity
 */
async function updateCartQuantity(productId, newQuantity) {
  if (!api) {
    console.error('API client not available');
    return;
  }

  if (newQuantity <= 0) {
    // Remove from cart (you might need a removeFromCart API method)
    // For now, we'll just refresh the cart
    return;
  }

  try {
    cart = await api.addToCart(productId, newQuantity);
    updateCartDisplay();
  } catch (error) {
    console.error('Error updating cart:', error);
    alert('Failed to update cart. Please try again.');
  }
}

/**
 * Update cart display
 */
function updateCartDisplay() {
  const cartPanel = document.getElementById('cart-panel');
  const cartItems = document.getElementById('cart-items');
  
  if (cartItems) {
    cartItems.innerHTML = renderCartItems();
  }

  // Update cart button count
  const cartCountEl = document.querySelector('.cart-count');
  const cartCount = cart.items.reduce((sum, item) => sum + item.quantity, 0);
  
  if (cartCount > 0) {
    if (!cartCountEl) {
      const cartBtn = document.querySelector('.cart');
      if (cartBtn) {
        const countSpan = document.createElement('span');
        countSpan.className = 'cart-count';
        countSpan.textContent = cartCount;
        cartBtn.appendChild(countSpan);
      }
    } else {
      cartCountEl.textContent = cartCount;
    }
  } else if (cartCountEl) {
    cartCountEl.remove();
  }

  // Update total
  const totalEl = document.querySelector('.cart-total span:last-child');
  if (totalEl) {
    totalEl.textContent = formatPrice(cart.total, storeData?.configuration?.currency || 'USD');
  }

  // Update checkout button
  const checkoutBtn = document.querySelector('.checkout-btn');
  if (checkoutBtn) {
    checkoutBtn.disabled = cart.items.length === 0;
  }
}

/**
 * Toggle cart panel
 */
function toggleCart() {
  const cartPanel = document.getElementById('cart-panel');
  if (cartPanel) {
    cartPanel.classList.toggle('open');
  }
}

/**
 * Handle checkout
 */
async function handleCheckout() {
  if (!api) {
    console.error('API client not available');
    return;
  }

  if (cart.items.length === 0) {
    alert('Your cart is empty');
    return;
  }

  // Show checkout modal
  showCheckoutModal();
}

/**
 * Show checkout modal
 */
function showCheckoutModal() {
  const modal = document.createElement('div');
  modal.className = 'modal-overlay';
  modal.innerHTML = `
    <div class="modal">
      <div class="modal-header">
        <h2>Checkout</h2>
        <button class="close-cart" onclick="this.closest('.modal-overlay').remove()">×</button>
      </div>
      <div class="modal-body">
        <form id="checkout-form" onsubmit="submitCheckout(event)">
          <div class="form-group">
            <label for="customer_name">Name *</label>
            <input type="text" id="customer_name" name="customer_name" required>
          </div>
          <div class="form-group">
            <label for="customer_email">Email *</label>
            <input type="email" id="customer_email" name="customer_email" required>
          </div>
          <div class="form-group">
            <label for="customer_phone">Phone *</label>
            <input type="tel" id="customer_phone" name="customer_phone" required>
          </div>
          <div class="form-group">
            <label for="delivery_method">Delivery Method *</label>
            <select id="delivery_method" name="delivery_method" required>
              ${storeData?.configuration?.delivery_enabled ? '<option value="delivery">Delivery</option>' : ''}
              ${storeData?.configuration?.pickup_enabled ? '<option value="pickup">Pickup</option>' : ''}
            </select>
          </div>
          <div class="form-group">
            <label for="delivery_address">Delivery Address</label>
            <input type="text" id="delivery_address" name="delivery_address">
          </div>
          <div class="form-group">
            <label for="payment_method">Payment Method *</label>
            <select id="payment_method" name="payment_method" required>
              <option value="cash">Cash</option>
              <option value="card">Card</option>
              <option value="online">Online</option>
            </select>
          </div>
          <div class="form-group">
            <label for="special_instructions">Special Instructions</label>
            <textarea id="special_instructions" name="special_instructions" rows="3"></textarea>
          </div>
          <div class="form-group">
            <label for="promotion_code">Promotion Code (Optional)</label>
            <input type="text" id="promotion_code" name="promotion_code">
          </div>
          <button type="submit" class="checkout-btn">Place Order</button>
        </form>
      </div>
    </div>
  `;
  
  document.body.appendChild(modal);
}

/**
 * Submit checkout form
 */
async function submitCheckout(event) {
  event.preventDefault();
  
  if (!api) {
    console.error('API client not available');
    return;
  }

  const form = event.target;
  const formData = new FormData(form);
  const orderData = {
    customer_name: formData.get('customer_name'),
    customer_email: formData.get('customer_email'),
    customer_phone: formData.get('customer_phone'),
    delivery_address: formData.get('delivery_address') || '',
    delivery_method: formData.get('delivery_method'),
    payment_method: formData.get('payment_method'),
    special_instructions: formData.get('special_instructions') || '',
    promotion_code: formData.get('promotion_code') || '',
    cart_items: cart.items.map(item => ({
      product_id: item.product_id,
      quantity: item.quantity,
      unit_price: item.unit_price
    }))
  };

  const submitBtn = form.querySelector('button[type="submit"]');
  if (submitBtn) {
    submitBtn.disabled = true;
    submitBtn.textContent = 'Processing...';
  }

  try {
    const order = await api.checkout(orderData);
    
    // Show success message
    alert(`Order placed successfully! Order number: ${order.order_number}`);
    
    // Redirect to order tracking if available
    if (order.tracking_url) {
      window.location.href = order.tracking_url;
    } else {
      // Close modal and reset cart
      document.querySelector('.modal-overlay')?.remove();
      cart = { items: [], subtotal: 0, tax: 0, total: 0 };
      updateCartDisplay();
      toggleCart();
    }
  } catch (error) {
    console.error('Error during checkout:', error);
    alert(`Checkout failed: ${error.message || 'Please try again.'}`);
    
    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.textContent = 'Place Order';
    }
  }
}

/**
 * Format price with currency
 */
function formatPrice(price, currency = 'USD') {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency
  }).format(price);
}

/**
 * Escape HTML to prevent XSS
 */
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

/**
 * Handle image loading errors - prevents infinite loops
 */
function handleImageError(img, placeholder) {
  // Prevent infinite loop by checking if already set to placeholder
  if (img.dataset.fallbackSet === 'true') {
    return; // Already tried fallback, stop trying
  }
  
  // Mark as fallback set
  img.dataset.fallbackSet = 'true';
  
  // Remove error handler to prevent infinite loop
  img.onerror = null;
  
  // Set placeholder image
  try {
    img.src = placeholder;
  } catch (e) {
    // If setting src fails, hide the image
    img.style.display = 'none';
  }
}

// Make functions globally available for onclick handlers
window.addToCart = addToCart;
window.updateCartQuantity = updateCartQuantity;
window.toggleCart = toggleCart;
window.handleCheckout = handleCheckout;
window.submitCheckout = submitCheckout;
window.handleImageError = handleImageError;

