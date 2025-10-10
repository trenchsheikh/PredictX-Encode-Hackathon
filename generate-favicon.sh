#!/bin/bash

# DarkBet Favicon Generator Script
# This script helps you generate favicon files from your darkbet.jpg logo

echo "🔮 DarkBet Favicon Generator"
echo "=============================="

# Check if darkbet.jpg exists
if [ ! -f "public/darkbet.jpg" ]; then
    echo "❌ Error: darkbet.jpg not found in public/ directory"
    echo "Please make sure your logo file is at public/darkbet.jpg"
    exit 1
fi

echo "✅ Found darkbet.jpg in public/ directory"

# Check if ImageMagick is installed
if command -v convert &> /dev/null; then
    echo "✅ ImageMagick found - generating favicon files..."
    
    # Create favicon files
    convert public/darkbet.jpg -resize 32x32 public/favicon.ico
    convert public/darkbet.jpg -resize 16x16 public/favicon-16x16.png
    convert public/darkbet.jpg -resize 32x32 public/favicon-32x32.png
    convert public/darkbet.jpg -resize 180x180 public/apple-touch-icon.png
    convert public/darkbet.jpg -resize 192x192 public/android-chrome-192x192.png
    convert public/darkbet.jpg -resize 512x512 public/android-chrome-512x512.png
    
    echo "✅ Favicon files generated successfully!"
    echo ""
    echo "Generated files:"
    echo "- favicon.ico (32x32)"
    echo "- favicon-16x16.png (16x16)"
    echo "- favicon-32x32.png (32x32)"
    echo "- apple-touch-icon.png (180x180)"
    echo "- android-chrome-192x192.png (192x192)"
    echo "- android-chrome-512x512.png (512x512)"
    
else
    echo "❌ ImageMagick not found"
    echo ""
    echo "Please install ImageMagick or use one of these alternatives:"
    echo ""
    echo "1. Online Generator:"
    echo "   - Go to https://favicon.io/favicon-generator/"
    echo "   - Upload your darkbet.jpg file"
    echo "   - Download and extract to public/ directory"
    echo ""
    echo "2. Install ImageMagick:"
    echo "   - macOS: brew install imagemagick"
    echo "   - Ubuntu: sudo apt-get install imagemagick"
    echo "   - Windows: Download from https://imagemagick.org/"
    echo ""
    echo "3. Manual Creation:"
    echo "   - Open darkbet.jpg in any image editor"
    echo "   - Create the required sizes manually"
    echo "   - Save with the correct filenames"
fi

echo ""
echo "🎯 Next Steps:"
echo "1. Start your development server: npm run dev"
echo "2. Check browser tab for DarkBet favicon"
echo "3. Clear browser cache if favicon doesn't appear"
echo "4. Test on different browsers"
