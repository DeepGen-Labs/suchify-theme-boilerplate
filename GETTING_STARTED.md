# Getting Started with Suchify Theme Development

This quick start guide will help you create your first Suchify store theme in minutes.

## Step 1: Set Up Your Development Environment

1. **Install Node.js** (if not already installed)
   - Download from [nodejs.org](https://nodejs.org/)
   - Version 14 or higher required

2. **Install Dependencies**
   ```bash
   npm install
   ```

## Step 2: Explore the Template

The template includes a complete, working theme. Let's understand the structure:

### Key Files

- **`theme-template/index.html`** - Main HTML structure
- **`theme-template/manifest.json`** - Theme metadata (name, version, features)
- **`theme-template/styles/main.css`** - All styling
- **`theme-template/scripts/main.js`** - Theme logic and API integration

### How It Works

1. The `initTheme()` function is called automatically by Suchify
2. It receives an API client to fetch store data
3. The theme renders HTML using that data
4. Users interact with the theme (add to cart, checkout, etc.)

## Step 3: Test Locally

1. **Start the test server**
   ```bash
   npm run test
   ```

2. **Your browser will open automatically**
   - You'll see a test store with sample products
   - Try adding items to cart
   - Test the checkout flow

3. **Open Developer Tools** (F12)
   - Check the Console for any errors
   - Inspect elements to understand the structure
   - Test responsive design (mobile view)

## Step 4: Make Your First Change

Let's customize the theme:

### Change the Colors

1. Open `theme-template/styles/main.css`
2. Find the `:root` section at the top
3. Change `--primary-color` to your brand color:
   ```css
   :root {
     --primary-color: #ff6b6b;  /* Change this */
   }
   ```
4. Refresh your browser to see the change

### Change the Layout

1. Open `theme-template/scripts/main.js`
2. Find the `renderHeader()` function
3. Modify the HTML structure
4. Refresh to see changes

### Add a New Feature

1. Create a new function in `main.js`:
   ```javascript
   function renderMyFeature() {
     return '<div>My new feature</div>';
   }
   ```

2. Call it in `renderTheme()`:
   ```javascript
   container.innerHTML = `
     ${renderHeader()}
     ${renderMyFeature()}  // Add this
     ${renderProducts()}
   `;
   ```

## Step 5: Understand the API

The theme uses the Suchify Store API. Key methods:

```javascript
// Get store info
const store = await api.getStore();

// Get products
const products = await api.getProducts();

// Add to cart
const cart = await api.addToCart(productId, quantity);

// Checkout
const order = await api.checkout(orderData);
```

See [PARTNER_API_QUICK_REFERENCE.md](./PARTNER_API_QUICK_REFERENCE.md) for complete API docs.

## Step 6: Customize for Your Needs

### For Restaurants
- Focus on menu display
- Add category filtering
- Highlight popular items
- Show promotions prominently

### For Retail
- Emphasize product images
- Add product variants
- Show stock status
- Add wishlist functionality

### For Services
- Show service packages
- Add booking calendar
- Display testimonials
- Highlight pricing tiers

## Step 7: Test Thoroughly

Before submitting:

1. **Run validation**
   ```bash
   npm run validate
   ```

2. **Test all features**
   - [ ] Products display correctly
   - [ ] Categories filter works
   - [ ] Add to cart works
   - [ ] Checkout flow works
   - [ ] Responsive on mobile
   - [ ] No console errors

3. **Test in different browsers**
   - Chrome
   - Firefox
   - Safari
   - Edge

## Step 8: Package and Submit

1. **Update manifest.json**
   - Set your theme name
   - Set version to 1.0.0
   - Add description
   - List features

2. **Create preview images**
   - Take screenshots of your theme
   - Show different views (homepage, products, cart)
   - Recommended size: 1200x800px

3. **Package your theme**
   ```bash
   npm run package
   ```

4. **Submit via Partner Portal**
   - Login to Partner Portal
   - Go to Themes section
   - Click "Submit Theme"
   - Upload files and preview images

## Common Customizations

### Change Font
```css
body {
  font-family: 'Your Font', sans-serif;
}
```

### Change Product Grid Columns
```css
.products {
  grid-template-columns: repeat(3, 1fr); /* Change 3 to desired columns */
}
```

### Add Custom Styling
```css
/* Add to main.css */
.my-custom-class {
  /* Your styles */
}
```

### Modify Product Card
Edit the `renderProduct()` function in `main.js` to change how products are displayed.

## Next Steps

1. **Read the full documentation**
   - [Partner Theme Integration Guide](./PARTNER_THEME_INTEGRATION_GUIDE.md)
   - [API Quick Reference](./PARTNER_API_QUICK_REFERENCE.md)

2. **Check examples**
   - Look at the test data in `test/index.html`
   - Study the rendering functions in `main.js`

3. **Join the community**
   - Partner Discord (link in documentation)
   - Developer Forum (link in documentation)

## Troubleshooting

### Theme doesn't load
- Check browser console for errors
- Verify `initTheme` function exists
- Ensure API client is available

### API calls fail
- Check network tab in DevTools
- Verify API endpoints are correct
- Test with mock API first

### Styling issues
- Check CSS file is linked in HTML
- Verify CSS variables are defined
- Test in different browsers

### Cart not updating
- Check `updateCartDisplay()` is called
- Verify cart state is stored correctly
- Test API responses

## Need Help?

- **Documentation**: See the docs folder
- **Support Email**: partners@suchify.com
- **Technical Issues**: dev-support@suchify.com

---

**You're ready to build! Start customizing and make it your own.** 🎨

