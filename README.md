# Suchify Theme Template - Partner Boilerplate

A complete boilerplate platform for creating store templates for Suchify. This template provides everything you need to get started building beautiful, responsive store themes.

## 📋 Table of Contents

- [Overview](#overview)
- [Quick Start](#quick-start)
- [Project Structure](#project-structure)
- [Development Guide](#development-guide)
- [API Integration](#api-integration)
- [Testing](#testing)
- [Building & Packaging](#building--packaging)
- [Submission](#submission)
- [Resources](#resources)

## 🎯 Overview

This boilerplate includes:

- ✅ Complete theme structure with all required files
- ✅ Modern, responsive CSS with CSS variables for easy customization
- ✅ Full Suchify API integration examples
- ✅ **Custom API integration support** - Add your own backend APIs
- ✅ Shopping cart functionality
- ✅ Checkout flow
- ✅ **Smart logo handling** - Uses store logo or generates initials automatically
- ✅ Favicon support for all devices
- ✅ Mock API client for local testing
- ✅ Development server setup
- ✅ Validation and build scripts
- ✅ Comprehensive documentation

## 🚀 Quick Start

### Prerequisites

- Node.js 14+ and npm
- A code editor (VS Code recommended)

### Installation

1. **Clone or download this template**
   ```bash
   # If using git
   git clone <repository-url>
   cd suchify-theme-template
   
   # Or download and extract the ZIP file
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run test
   ```
   
   This will open `test/index.html` in your browser with a mock API for testing.

4. **Start editing**
   - Edit `theme-template/index.html` for HTML structure
   - Edit `theme-template/styles/main.css` for styling
   - Edit `theme-template/scripts/main.js` for functionality
   - Edit `theme-template/manifest.json` for theme metadata

## 📁 Project Structure

```
suchify-theme-template/
├── theme-template/          # Your theme files (this is what gets submitted)
│   ├── index.html          # Main HTML file (REQUIRED)
│   ├── manifest.json       # Theme metadata (REQUIRED)
│   ├── assets/             # Images, fonts, favicons
│   │   ├── favicon.ico
│   │   ├── logo.png        # Fallback logo (optional)
│   │   └── ...             # Other assets
│   ├── styles/
│   │   └── main.css        # Main stylesheet
│   └── scripts/
│       ├── main.js         # Theme initialization (REQUIRED)
│       ├── api-client.js   # Suchify API wrapper (optional)
│       └── custom-api.js   # Custom API integration (optional)
├── test/                   # Testing utilities
│   └── index.html          # Local test file with mock API
├── docs/                    # Documentation
│   ├── CUSTOM_API_INTEGRATION.md
│   └── CUSTOM_API_EXAMPLES.md
├── scripts/                # Build and validation scripts
│   ├── validate.js         # Validates theme structure
│   ├── build.js            # Builds theme for production
│   └── package.js          # Creates ZIP package
├── package.json            # Node.js dependencies and scripts
└── README.md               # This file
```

## 🛠️ Development Guide

### Theme Architecture

Themes are **client-side HTML/CSS/JavaScript bundles** that:

1. Load once from CDN/storage
2. Fetch all data from APIs in real-time
3. Render dynamically based on store data
4. Support customization through configuration

### Required Files

Your theme **must** include:

1. **`index.html`** - Main entry point
   - Must contain a container element (e.g., `<div id="theme-container">`)
   - Must reference `scripts/main.js`

2. **`manifest.json`** - Theme metadata
   - Must include: name, version, description, category, apiVersion, requiredApis, features

3. **`scripts/main.js`** - Theme initialization
   - Must export an `initTheme` function
   - Function signature: `function initTheme({ api, container, storeSlug })`

### Customization

#### CSS Variables

The theme uses CSS variables for easy customization. Edit these in `styles/main.css`:

```css
:root {
  --primary-color: #3b82f6;      /* Primary brand color */
  --secondary-color: #1e40af;    /* Secondary color */
  --accent-color: #f59e0b;        /* Accent color */
  --text-color: #1f2937;         /* Main text color */
  --bg-color: #ffffff;           /* Background color */
  /* ... more variables */
}
```

#### Layout

Modify the HTML structure in `index.html` and update the rendering functions in `main.js`:

- `renderHeader()` - Store header with logo/initials and name
- `renderNavigation()` - Category navigation
- `renderProducts()` - Product grid
- `renderCart()` - Shopping cart UI

#### Logo Handling

The theme automatically handles logos:
- **If store has logo**: Displays the store's logo image
- **If no logo**: Generates a circular badge with store initials (e.g., "TR" for "Test Restaurant")
- **If logo fails to load**: Automatically falls back to initials

No configuration needed - it works automatically!

## 🔌 API Integration

### API Client

The Suchify platform automatically injects an API client. Access it via:

```javascript
// In initTheme function
function initTheme({ api, container, storeSlug }) {
  // api is the StoreAPIClient instance
  const store = await api.getStore();
  const products = await api.getProducts();
  // ...
}

// Or globally
const api = window.__STORE_API__;
```

### Available API Methods

#### Store Information
```javascript
const store = await api.getStore();
// Returns: { id, name, slug, description, phone, email, address, logo_url, ... }
```

#### Products
```javascript
// Get all products
const products = await api.getProducts();

// Get filtered products
const filtered = await api.getProducts({
  category: "Pizza",
  search: "margherita",
  min_price: 10,
  max_price: 50,
  in_stock: true
});
```

#### Categories
```javascript
const categories = await api.getCategories();
// Returns: [{ name, product_count }, ...]
```

#### Promotions
```javascript
const promotions = await api.getPromotions();
// Returns: [{ id, name, description, discount_type, discount_value, code, ... }, ...]
```

#### Cart Operations
```javascript
// Add to cart
const cart = await api.addToCart(productId, quantity);

// Checkout
const order = await api.checkout({
  customer_name: "John Doe",
  customer_email: "john@example.com",
  customer_phone: "+1234567890",
  delivery_method: "delivery",
  payment_method: "cash",
  cart_items: cart.items
});
```

#### Order Tracking
```javascript
const order = await api.getOrderStatus("ORD-2024-001");
```

For complete API documentation, see:
- [Partner API Quick Reference](./PARTNER_API_QUICK_REFERENCE.md)
- [Partner Theme Integration Guide](./PARTNER_THEME_INTEGRATION_GUIDE.md)

### Custom API Integration

Partners can integrate their own backend APIs for custom features like reviews, analytics, loyalty programs, etc.

**Quick Start:**

1. **Include custom API script** in `index.html`:
   ```html
   <script src="scripts/custom-api.js"></script>
   ```

2. **Configure your API** in `custom-api.js`:
   ```javascript
   const CustomAPIConfig = {
     baseUrl: 'https://your-api.com/api',
     apiKey: 'your-key' // Optional
   };
   ```

3. **Use in your theme**:
   ```javascript
   // Get reviews
   const reviews = await CustomAPI.getProductReviews(productId);
   
   // Track analytics
   CustomAPI.trackAnalytics('page_view', { page: 'storefront' });
   ```

**Features:**
- ✅ Optional - theme works without custom APIs
- ✅ Error handling - failures don't break the theme
- ✅ CORS support documentation
- ✅ Security best practices
- ✅ Ready-to-use examples

**Full Documentation:**
- [Custom API Integration Guide](./docs/CUSTOM_API_INTEGRATION.md) - Complete guide
- [Custom API Examples](./docs/CUSTOM_API_EXAMPLES.md) - Quick examples

**Common Use Cases:**
- Product reviews and ratings
- Analytics tracking
- Loyalty programs
- Live chat widgets
- Custom payment methods
- Real-time inventory
- Product recommendations

## 🧪 Testing

### Local Testing with Mock API

1. **Start the test server**
   ```bash
   npm run test
   ```

2. **Open in browser**
   - The server will automatically open `test/index.html`
   - This includes a mock API client with sample data

3. **Test functionality**
   - Browse products
   - Filter by category
   - Add items to cart
   - Test checkout flow

### Mock API Features

The test environment includes:
- Sample store data
- 6 sample products across different categories
- Mock shopping cart
- Simulated API delays
- Error handling examples

### Testing Checklist

Before submitting, test:

- [ ] Theme loads without errors
- [ ] Store data displays correctly
- [ ] Products render properly
- [ ] Category filtering works
- [ ] Add to cart functionality
- [ ] Cart updates correctly
- [ ] Checkout flow works
- [ ] Responsive design (mobile, tablet, desktop)
- [ ] Cross-browser compatibility
- [ ] No console errors

## 📦 Building & Packaging

### Validate Theme

Check that your theme meets all requirements:

```bash
npm run validate
```

This checks:
- All required files are present
- `manifest.json` is valid
- `initTheme` function exists
- HTML structure is correct

### Build Theme

Prepare theme for production:

```bash
npm run build
```

This copies theme files to the `build/` directory.

### Package Theme

Create a ZIP file for submission:

```bash
npm run package
```

This will:
1. Validate the theme
2. Build the theme
3. Create a ZIP file in `dist/` directory

The ZIP file name will be based on your theme name and version from `manifest.json`.

## 📤 Submission

### Pre-Submission Checklist

Use the [Partner Theme Submission Checklist](./PARTNER_THEME_SUBMISSION_CHECKLIST.md) to ensure your theme is ready.

### Required Information

When submitting via Partner Portal:

- **Theme Name**: Display name for marketplace
- **Description**: Detailed description of features
- **Category**: Select appropriate category
- **Version**: Semantic version (e.g., 1.0.0)
- **Tags**: Relevant tags for searchability
- **Preview Images**: Screenshots (at least 1, recommended 3-5)
- **Theme Files**: All HTML, CSS, JS, and manifest.json files

### Submission Process

1. **Prepare Files**
   - Run `npm run package` to create ZIP file
   - Create preview images (1200x800px recommended)
   - Ensure all files are included

2. **Login to Partner Portal**
   - Navigate to Themes section
   - Click "Submit Theme"

3. **Fill Submission Form**
   - Enter theme information
   - Upload preview images
   - Upload theme files (or ZIP)

4. **Submit for Review**
   - Automated validation runs immediately
   - Manual review takes 2-5 business days
   - You'll receive status updates via email

## 📚 Resources

### Documentation

**Core Documentation:**
- [Partner Theme Integration Guide](./PARTNER_THEME_INTEGRATION_GUIDE.md) - Complete integration guide
- [Partner API Quick Reference](./PARTNER_API_QUICK_REFERENCE.md) - Quick API lookup
- [Partner Theme Submission Checklist](./PARTNER_THEME_SUBMISSION_CHECKLIST.md) - Pre-submission checklist
- [Partner Theme Integration Summary](./PARTNER_THEME_INTEGRATION_SUMMARY.md) - Implementation summary

**Custom Features:**
- [Custom API Integration Guide](./docs/CUSTOM_API_INTEGRATION.md) - How to add your own backend APIs
- [Custom API Examples](./docs/CUSTOM_API_EXAMPLES.md) - Quick reference examples

**Getting Started:**
- [Getting Started Guide](./GETTING_STARTED.md) - Step-by-step beginner guide
- [Platform Overview](./PLATFORM_OVERVIEW.md) - High-level platform overview

### Support

- **Partner Support**: partners@suchify.com
- **Technical Issues**: dev-support@suchify.com
- **Marketplace Questions**: marketplace@suchify.com

### Best Practices

1. **Design**
   - Responsive first (mobile, tablet, desktop)
   - Fast loading times (< 3 seconds)
   - Accessible (semantic HTML, ARIA labels)
   - Loading states for API calls
   - Error handling with user-friendly messages

2. **Code Quality**
   - Clean, organized code
   - Comments for complex logic
   - No hardcoded data (use APIs)
   - Input sanitization (prevent XSS)
   - Browser compatibility testing

3. **Performance**
   - Optimize images
   - Minimize CSS/JS
   - Cache API responses when possible
   - Lazy load images
   - Minimize API calls

## 🎨 Customization Examples

### Change Color Scheme

Edit CSS variables in `styles/main.css`:

```css
:root {
  --primary-color: #your-color;
  --secondary-color: #your-color;
  /* ... */
}
```

### Add Custom Features

**Option 1: Using Suchify APIs Only**
1. Add new rendering functions in `main.js`
2. Call Suchify APIs as needed
3. Update `manifest.json` to list new features
4. Add corresponding CSS in `main.css`

**Option 2: With Custom Backend APIs**
1. Include `custom-api.js` in your theme
2. Configure your API endpoints
3. Call both Suchify and custom APIs
4. Handle errors gracefully (custom APIs are optional)
5. See [Custom API Integration Guide](./docs/CUSTOM_API_INTEGRATION.md) for details

### Modify Layout

1. Update HTML structure in rendering functions
2. Adjust CSS grid/flexbox layouts
3. Test responsive behavior

## 🔄 Version Updates

When updating your theme:

1. **Increment version** in `manifest.json`
   ```json
   {
     "version": "1.1.0"  // Increment from 1.0.0
   }
   ```

2. **Document changes** in description
3. **Test thoroughly** before resubmitting
4. **Submit as new version** via Partner Portal

## 🎨 Key Features

### Smart Logo System
- Automatically uses store logo if available
- Falls back to store initials in a circular badge if no logo
- Handles image loading errors gracefully

### Custom API Support
- Integrate your own backend APIs
- Add features like reviews, analytics, loyalty programs
- Optional - themes work perfectly without custom APIs
- Full error handling and fallback support

### Responsive Design
- Mobile-first approach
- Works on all screen sizes
- Touch-friendly interactions
- Optimized for performance

### Developer-Friendly
- Clear code structure
- Comprehensive documentation
- Local testing with mock APIs
- Validation and build tools

## 📝 License

This template is provided as-is for creating Suchify themes. Customize freely for your theme submissions.

## 🤝 Contributing

Found an issue or have a suggestion? Contact the Suchify development team.

## 🆘 Need Help?

- **Quick Start**: See [GETTING_STARTED.md](./GETTING_STARTED.md)
- **Custom APIs**: See [Custom API Integration Guide](./docs/CUSTOM_API_INTEGRATION.md)
- **API Reference**: See [Partner API Quick Reference](./PARTNER_API_QUICK_REFERENCE.md)
- **Support Email**: partners@suchify.com
- **Technical Support**: dev-support@suchify.com

---

**Happy Theme Building! 🚀**

For questions or support, contact partners@suchify.com

