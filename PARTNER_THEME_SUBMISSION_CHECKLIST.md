# Partner Theme Submission Checklist

Use this checklist before submitting your theme to ensure it meets all requirements.

## Pre-Submission Requirements

### ✅ Files Required

- [ ] `index.html` - Main HTML file
- [ ] `manifest.json` - Theme metadata (valid JSON)
- [ ] `scripts/main.js` - Theme initialization script
- [ ] `styles/main.css` - Main stylesheet (or equivalent)
- [ ] All referenced assets (images, fonts, etc.)

### ✅ manifest.json Validation

- [ ] `name` field present and non-empty
- [ ] `version` field follows semantic versioning (e.g., "1.0.0")
- [ ] `description` field present and descriptive
- [ ] `category` field matches available categories
- [ ] `apiVersion` field set to "1.0" or higher
- [ ] `requiredApis` array lists all APIs used
- [ ] `features` array lists theme features
- [ ] Valid JSON syntax (no syntax errors)

### ✅ Theme Functionality

- [ ] Theme initializes without errors
- [ ] Store data loads correctly (name, description, logo)
- [ ] Products display correctly
- [ ] Categories display (if used)
- [ ] Product images load
- [ ] Add to cart functionality works
- [ ] Cart updates correctly
- [ ] Checkout flow works (or shows appropriate message)
- [ ] Promotions display (if used)
- [ ] Social links work (if used)
- [ ] No console errors in browser

### ✅ Design & UX

- [ ] Responsive design (mobile, tablet, desktop)
- [ ] Loading states shown during API calls
- [ ] Error messages displayed for failed API calls
- [ ] Clear call-to-action buttons
- [ ] Cart is visible/accessible
- [ ] Navigation works (if applicable)
- [ ] Images have alt text
- [ ] Text is readable (contrast, size)
- [ ] No layout breaks on different screen sizes

### ✅ Code Quality

- [ ] Code is organized and readable
- [ ] Comments added for complex logic
- [ ] No hardcoded store data (all from APIs)
- [ ] Error handling implemented
- [ ] No external dependencies (or minimal, documented)
- [ ] No security vulnerabilities (XSS, etc.)
- [ ] Input sanitization (if user input collected)

### ✅ Browser Compatibility

- [ ] Tested on Chrome (latest)
- [ ] Tested on Firefox (latest)
- [ ] Tested on Safari (latest)
- [ ] Tested on Edge (latest)
- [ ] Tested on mobile browsers (iOS Safari, Chrome Mobile)

### ✅ Performance

- [ ] Images optimized (compressed, appropriate sizes)
- [ ] CSS minified or optimized
- [ ] JavaScript optimized
- [ ] No unnecessary API calls
- [ ] Fast initial load time (< 3 seconds)

### ✅ Preview Images

- [ ] At least 1 preview image uploaded
- [ ] Recommended: 3-5 preview images
- [ ] Images show different views (homepage, product page, cart, etc.)
- [ ] Images are clear and high quality
- [ ] Images are properly sized (recommended: 1200x800px)
- [ ] File format: PNG or JPG
- [ ] File size: < 5MB per image

### ✅ Submission Form

- [ ] Theme name entered
- [ ] Description is clear and detailed
- [ ] Category selected
- [ ] Version number entered
- [ ] Tags selected (at least 3 recommended)
- [ ] Preview images uploaded
- [ ] Theme files uploaded

## Testing Checklist

### Local Testing

- [ ] Theme loads in browser
- [ ] Mock API client works
- [ ] All features function correctly
- [ ] No console errors
- [ ] Responsive design works
- [ ] Cross-browser testing completed

### Integration Testing

- [ ] Test with real store slug (if available)
- [ ] Verify API calls work
- [ ] Test cart functionality
- [ ] Test checkout flow
- [ ] Verify error handling

## Common Issues to Avoid

### ❌ Don't Do This

- [ ] Hardcode store data (always use APIs)
- [ ] Use absolute URLs for assets (use relative paths)
- [ ] Include sensitive data in code
- [ ] Use deprecated APIs
- [ ] Ignore error handling
- [ ] Create themes that break on mobile
- [ ] Submit incomplete themes
- [ ] Use external CDNs without fallbacks
- [ ] Include large unoptimized images
- [ ] Use inline styles excessively

### ✅ Do This Instead

- [ ] Fetch all data from APIs
- [ ] Use relative paths for assets
- [ ] Handle all errors gracefully
- [ ] Test on multiple devices
- [ ] Optimize all assets
- [ ] Use semantic HTML
- [ ] Follow accessibility guidelines
- [ ] Document your code
- [ ] Test thoroughly before submission

## Submission Process

1. **Prepare Files**
   - [ ] All files organized in folder structure
   - [ ] manifest.json validated
   - [ ] All assets included

2. **Create Preview Images**
   - [ ] Screenshot of homepage
   - [ ] Screenshot of product listing
   - [ ] Screenshot of cart/checkout
   - [ ] Screenshot of mobile view

3. **Fill Submission Form**
   - [ ] Login to Partner Portal
   - [ ] Navigate to Themes section
   - [ ] Click "Submit Theme"
   - [ ] Fill all required fields
   - [ ] Upload preview images
   - [ ] Upload theme files

4. **Submit**
   - [ ] Review all information
   - [ ] Click "Submit Theme"
   - [ ] Wait for confirmation
   - [ ] Note submission ID

## Post-Submission

- [ ] Check email for submission confirmation
- [ ] Monitor theme status in Partner Portal
- [ ] Respond to review feedback (if any)
- [ ] Update theme if requested
- [ ] Celebrate when approved! 🎉

## Review Timeline

- **Automated Validation**: Immediate (within minutes)
- **Manual Review**: 2-5 business days
- **Feedback/Updates**: As needed
- **Approval**: Varies based on review

## Getting Help

If you encounter issues:

1. **Check Documentation**
   - [Partner Theme Integration Guide](./PARTNER_THEME_INTEGRATION_GUIDE.md)
   - [API Quick Reference](./PARTNER_API_QUICK_REFERENCE.md)

2. **Test Locally**
   - Use mock API client
   - Check browser console
   - Validate HTML/CSS/JS

3. **Contact Support**
   - Partner Support: partners@suchify.com
   - Technical Issues: dev-support@suchify.com

## Version Updates

When updating an existing theme:

- [ ] Increment version number in manifest.json
- [ ] Document changes in description
- [ ] Test all functionality
- [ ] Submit as new version
- [ ] Note breaking changes (if any)

---

**Remember:** Quality over speed. A well-tested, polished theme has a much higher chance of approval and success in the marketplace.

**Good luck with your submission!** 🚀

