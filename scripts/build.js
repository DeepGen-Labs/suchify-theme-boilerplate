/**
 * Theme Build Script
 * 
 * Prepares theme files for production (minification, optimization, etc.)
 * For now, this is a placeholder - you can add minification later
 */

const fs = require('fs');
const path = require('path');

console.log('🔨 Building theme...\n');

const themeDir = path.join(__dirname, '..', 'theme-template');
const buildDir = path.join(__dirname, '..', 'build');

// Create build directory
if (!fs.existsSync(buildDir)) {
  fs.mkdirSync(buildDir, { recursive: true });
}

// Copy theme files to build directory
function copyRecursive(src, dest) {
  const exists = fs.existsSync(src);
  const stats = exists && fs.statSync(src);
  const isDirectory = exists && stats.isDirectory();
  
  if (isDirectory) {
    if (!fs.existsSync(dest)) {
      fs.mkdirSync(dest, { recursive: true });
    }
    fs.readdirSync(src).forEach(childItemName => {
      copyRecursive(
        path.join(src, childItemName),
        path.join(dest, childItemName)
      );
    });
  } else {
    fs.copyFileSync(src, dest);
  }
}

console.log('Copying theme files...');
copyRecursive(themeDir, buildDir);
console.log('✅ Build complete! Theme files are in the build/ directory.');

