# Assets Folder

This folder should contain the following image files for the app to work properly with Expo:

## Required Files:

1. **icon.png** (1024x1024 pixels)
   - Main app icon
   - Use a fuel pump or car icon
   - Background: Blue/Purple gradient
   - Format: PNG with transparency

2. **splash.png** (1242x2436 pixels for iOS, can be used for both)
   - App splash screen
   - Should match the app theme (blue/purple gradient)
   - Can include app name and fuel pump emoji
   - Format: PNG

3. **adaptive-icon.png** (1024x1024 pixels)
   - Android adaptive icon
   - Should have the icon centered with transparent background
   - Format: PNG with transparency

4. **favicon.png** (48x48 pixels)
   - Web favicon (if running on web)
   - Simple fuel pump icon
   - Format: PNG

## Temporary Solution:

The app will work without these images, but you'll see warnings. For now:

### Option 1: Use Expo default assets
Expo will use default placeholder images if these are missing.

### Option 2: Create simple placeholder images
You can create basic colored square images with text:
- Create 1024x1024 blue squares with "FL" text for icon files
- Create 1242x2436 blue rectangle for splash

### Option 3: Download from icon libraries
- Visit https://www.flaticon.com/ and search for "fuel" or "gas station"
- Use https://www.canva.com/ to create splash screens
- Use https://www.appicon.co/ to generate all required sizes

## Quick Setup:

If you want to run the app immediately without custom assets:
1. Delete or rename app.json's icon, splash, and adaptive-icon references
2. Or create simple colored PNG files with the dimensions above

The app functionality will work perfectly without custom assets!
