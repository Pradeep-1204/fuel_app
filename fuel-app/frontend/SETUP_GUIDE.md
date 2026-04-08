# Quick Setup Guide

## 📱 Get Started in 5 Minutes!

### Step 1: Prerequisites
Install these if you haven't already:
- [Node.js](https://nodejs.org/) (v14 or higher)
- [Expo CLI](https://docs.expo.dev/get-started/installation/): `npm install -g expo-cli`
- [Expo Go](https://expo.dev/client) app on your phone (from App Store or Play Store)

### Step 2: Install Dependencies
Open terminal in the project folder and run:
```bash
npm install
```

### Step 3: Start the App
```bash
npm start
```
or
```bash
expo start
```

### Step 4: Run on Your Phone
1. Open **Expo Go** app on your phone
2. Scan the QR code shown in terminal/browser:
   - **iOS**: Use Camera app to scan
   - **Android**: Use Expo Go app to scan

That's it! The app should now load on your phone. 🎉

## 🚀 First Use

1. **Sign Up** - Create an account (it's stored locally, no server needed)
2. **Add Vehicle** - Add your car details
3. **Log Fuel** - Record your first fuel purchase
4. **View Reports** - Check your expenses and charts

## 💡 Tips

- Keep your phone and computer on the **same WiFi network**
- If changes don't appear, shake your phone and press "Reload"
- All data is stored locally on your phone
- Use "Export to CSV" to backup your data

## ❓ Having Issues?

### Can't scan QR code?
- Ensure WiFi is enabled on both devices
- Try running `expo start --tunnel`

### "Something went wrong" error?
```bash
rm -rf node_modules
npm install
expo start -c
```

### App crashes on start?
- Update Expo Go to latest version
- Clear Expo cache: `expo start -c`

## 📚 Need More Help?
Check the full **README.md** for detailed documentation.

---

Happy tracking! ⛽🚗
