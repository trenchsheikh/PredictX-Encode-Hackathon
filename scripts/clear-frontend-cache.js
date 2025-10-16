#!/usr/bin/env node

/**
 * Clear Frontend Cache Script
 *
 * This script clears any cached data in the frontend and resets the state
 * to start fresh after clearing markets.
 *
 * Usage: node scripts/clear-frontend-cache.js
 */

const fs = require('fs');
const path = require('path');

console.log('🧹 Clearing frontend cache and resetting state...');
console.log('');

// Clear Next.js cache
const nextCacheDir = path.join(__dirname, '.next');
if (fs.existsSync(nextCacheDir)) {
  console.log('🗑️  Clearing Next.js cache...');
  fs.rmSync(nextCacheDir, { recursive: true, force: true });
  console.log('   ✅ Next.js cache cleared');
} else {
  console.log('   ℹ️  No Next.js cache found');
}

// Clear node_modules cache (optional)
const nodeModulesDir = path.join(__dirname, 'node_modules');
if (fs.existsSync(nodeModulesDir)) {
  console.log('🗑️  Clearing node_modules cache...');
  fs.rmSync(nodeModulesDir, { recursive: true, force: true });
  console.log('   ✅ node_modules cleared');
  console.log('   💡 Run "npm install" to reinstall dependencies');
} else {
  console.log('   ℹ️  No node_modules found');
}

// Clear any local storage data (this would be done in browser)
console.log('🗑️  Browser cache clearing instructions:');
console.log('   1. Open browser developer tools (F12)');
console.log('   2. Go to Application/Storage tab');
console.log('   3. Clear Local Storage and Session Storage');
console.log('   4. Or use Ctrl+Shift+R for hard refresh');
console.log('');

console.log('✅ Frontend cache clearing complete!');
console.log('');
console.log('📝 Next steps:');
console.log('   1. Run "npm install" if you cleared node_modules');
console.log('   2. Run "npm run dev" to start the development server');
console.log('   3. Clear browser cache as instructed above');
console.log('   4. The app will now show no markets (fresh start)');
console.log('');

console.log('🚀 Ready for a fresh start!');
