# DarkBet Favicon Setup Instructions

## Current Status

✅ **Favicon Configuration**: Already set up in `app/layout.tsx`
✅ **Logo File**: `darkbet.jpg` exists in `public/` directory
❌ **Favicon Files**: Need to be generated from logo

## Required Favicon Files

You need to create these files in your `public/` directory:

```
public/
├── darkbet.jpg (✅ exists)
├── favicon.ico (❌ needs to be created)
├── favicon-16x16.png (❌ needs to be created)
├── favicon-32x32.png (❌ needs to be created)
├── apple-touch-icon.png (❌ needs to be created)
├── android-chrome-192x192.png (❌ needs to be created)
└── android-chrome-512x512.png (❌ needs to be created)
```

## Quick Setup Methods

### Method 1: Online Generator (Recommended)

1. Go to [favicon.io](https://favicon.io/favicon-generator/)
2. Upload your `darkbet.jpg` file
3. Download the generated package
4. Extract all files to your `public/` directory

### Method 2: Manual Creation

1. Open `darkbet.jpg` in any image editor
2. Create these sizes:
   - `favicon.ico` - 32x32 pixels
   - `favicon-16x16.png` - 16x16 pixels
   - `favicon-32x32.png` - 32x32 pixels
   - `apple-touch-icon.png` - 180x180 pixels
   - `android-chrome-192x192.png` - 192x192 pixels
   - `android-chrome-512x512.png` - 512x512 pixels

### Method 3: Temporary Solution

For immediate testing, create just `favicon.ico`:

1. Resize `darkbet.jpg` to 32x32 pixels
2. Save as `favicon.ico`
3. Place in `public/` directory

## Verification

After adding the favicon files:

- Check browser tab shows DarkBet icon
- Clear browser cache if needed
- Test on different browsers

## Current Configuration

Your app is already configured to use these favicon files in `app/layout.tsx`:

```typescript
icons: {
  icon: '/favicon.ico',
  shortcut: '/favicon-16x16.png',
  apple: '/apple-touch-icon.png',
},
```
