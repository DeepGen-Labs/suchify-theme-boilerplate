/**
 * Theme Validation Script
 * 
 * Validates that the theme has all required files and structure
 */

const fs = require('fs');
const path = require('path');

const REQUIRED_FILES = [
  'theme-template/index.html',
  'theme-template/manifest.json',
  'theme-template/scripts/main.js',
  'theme-template/styles/main.css'
];

const errors = [];
const warnings = [];

console.log('🔍 Validating theme structure...\n');

// Check required files
console.log('Checking required files...');
REQUIRED_FILES.forEach(file => {
  const filePath = path.join(__dirname, '..', file);
  if (!fs.existsSync(filePath)) {
    errors.push(`Missing required file: ${file}`);
    console.log(`  ❌ ${file}`);
  } else {
    console.log(`  ✅ ${file}`);
  }
});

// Validate manifest.json
console.log('\nValidating manifest.json...');
const manifestPath = path.join(__dirname, '..', 'theme-template', 'manifest.json');
if (fs.existsSync(manifestPath)) {
  try {
    const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
    
    const requiredFields = ['name', 'version', 'description', 'category', 'apiVersion', 'requiredApis', 'features'];
    requiredFields.forEach(field => {
      if (!manifest[field]) {
        errors.push(`manifest.json missing required field: ${field}`);
        console.log(`  ❌ Missing field: ${field}`);
      } else {
        console.log(`  ✅ Field present: ${field}`);
      }
    });
    
    // Validate version format
    if (manifest.version && !/^\d+\.\d+\.\d+/.test(manifest.version)) {
      warnings.push('Version should follow semantic versioning (e.g., 1.0.0)');
      console.log(`  ⚠️  Version format: ${manifest.version}`);
    } else {
      console.log(`  ✅ Version format: ${manifest.version}`);
    }
    
    // Validate requiredApis
    if (manifest.requiredApis && Array.isArray(manifest.requiredApis)) {
      console.log(`  ✅ Required APIs: ${manifest.requiredApis.length} listed`);
    }
    
  } catch (error) {
    errors.push(`manifest.json is invalid JSON: ${error.message}`);
    console.log(`  ❌ Invalid JSON: ${error.message}`);
  }
} else {
  errors.push('manifest.json not found');
}

// Check for initTheme function in main.js
console.log('\nValidating main.js...');
const mainJsPath = path.join(__dirname, '..', 'theme-template', 'scripts', 'main.js');
if (fs.existsSync(mainJsPath)) {
  const mainJs = fs.readFileSync(mainJsPath, 'utf8');
  if (mainJs.includes('function initTheme')) {
    console.log('  ✅ initTheme function found');
  } else {
    errors.push('main.js must export an initTheme function');
    console.log('  ❌ initTheme function not found');
  }
} else {
  errors.push('main.js not found');
}

// Check HTML structure
console.log('\nValidating index.html...');
const indexHtmlPath = path.join(__dirname, '..', 'theme-template', 'index.html');
if (fs.existsSync(indexHtmlPath)) {
  const html = fs.readFileSync(indexHtmlPath, 'utf8');
  if (html.includes('theme-container')) {
    console.log('  ✅ theme-container element found');
  } else {
    warnings.push('index.html should contain an element with id="theme-container"');
    console.log('  ⚠️  theme-container element not found');
  }
  
  if (html.includes('main.js')) {
    console.log('  ✅ main.js script reference found');
  } else {
    warnings.push('index.html should reference scripts/main.js');
    console.log('  ⚠️  main.js script reference not found');
  }
}

// Summary
console.log('\n' + '='.repeat(50));
if (errors.length === 0 && warnings.length === 0) {
  console.log('✅ Validation passed! Theme is ready for submission.');
  process.exit(0);
} else {
  if (errors.length > 0) {
    console.log(`\n❌ Found ${errors.length} error(s):`);
    errors.forEach(error => console.log(`   - ${error}`));
  }
  if (warnings.length > 0) {
    console.log(`\n⚠️  Found ${warnings.length} warning(s):`);
    warnings.forEach(warning => console.log(`   - ${warning}`));
  }
  console.log('\nPlease fix the errors before submitting your theme.');
  process.exit(errors.length > 0 ? 1 : 0);
}

