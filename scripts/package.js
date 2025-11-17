/**
 * Theme Packaging Script
 * 
 * Creates a ZIP file of the theme for submission
 */

const fs = require('fs');
const path = require('path');
const archiver = require('archiver');

const manifestPath = path.join(__dirname, '..', 'theme-template', 'manifest.json');
const buildDir = path.join(__dirname, '..', 'build');
const outputDir = path.join(__dirname, '..', 'dist');

// Read manifest to get theme name and version
let themeName = 'suchify-theme';
let version = '1.0.0';

if (fs.existsSync(manifestPath)) {
  try {
    const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
    themeName = manifest.name.toLowerCase().replace(/\s+/g, '-');
    version = manifest.version || '1.0.0';
  } catch (error) {
    console.warn('Could not read manifest.json, using default name');
  }
}

const zipFileName = `${themeName}-v${version}.zip`;
const zipFilePath = path.join(outputDir, zipFileName);

// Create output directory
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// Check if build directory exists
if (!fs.existsSync(buildDir)) {
  console.error('❌ Build directory not found. Run "npm run build" first.');
  process.exit(1);
}

console.log('📦 Packaging theme...\n');

const output = fs.createWriteStream(zipFilePath);
const archive = archiver('zip', {
  zlib: { level: 9 } // Maximum compression
});

output.on('close', () => {
  const sizeInMB = (archive.pointer() / 1024 / 1024).toFixed(2);
  console.log(`✅ Theme packaged successfully!`);
  console.log(`   File: ${zipFileName}`);
  console.log(`   Size: ${sizeInMB} MB`);
  console.log(`   Location: ${zipFilePath}`);
});

archive.on('error', (err) => {
  console.error('❌ Error creating package:', err);
  process.exit(1);
});

archive.pipe(output);

// Add all files from build directory
archive.directory(buildDir, false);

archive.finalize();

