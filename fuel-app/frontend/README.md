# Fuel Expenses Logger App

A React Native mobile application for tracking and managing fuel expenses for vehicles. Built as a college-level mini project.

## Features

- ✅ User authentication (Sign up/Login)
- ✅ Vehicle management (Add, view, delete vehicles)
- ✅ Fuel expense logging
- ✅ Automatic mileage calculation
- ✅ Expense reports and analytics
- ✅ Visual charts for expense tracking
- ✅ Export data to CSV
- ✅ Clean and modern UI

## Screenshots

The app includes the following screens:
- Login/Signup Screen
- Home Dashboard with quick stats
- Vehicles Management
- Fuel Entry Form
- Reports & Analytics with charts
- Profile & Settings

## Tech Stack

- **React Native** - Cross-platform mobile framework
- **Expo** - Development platform
- **React Navigation** - Navigation library
- **AsyncStorage** - Local data storage
- **React Native Chart Kit** - Charts and graphs
- **Expo Linear Gradient** - Gradient backgrounds
- **Expo Vector Icons** - Icon library

## Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (v14 or higher)
- npm or yarn
- Expo CLI (`npm install -g expo-cli`)
- Expo Go app on your mobile device (available on iOS App Store or Google Play Store)

## Installation

1. **Extract the ZIP file** to your desired location

2. **Navigate to the project directory**:
   ```bash
   cd FuelExpensesLogger
   ```

3. **Install dependencies**:
   ```bash
   npm install
   ```
   or if you're using yarn:
   ```bash
   yarn install
   ```

## Running the App

1. **Start the Expo development server**:
   ```bash
   npm start
   ```
   or
   ```bash
   expo start
   ```

2. **Run on your device**:
   - Install the **Expo Go** app on your mobile device
   - Scan the QR code displayed in the terminal or browser with:
     - iOS: Camera app
     - Android: Expo Go app
   
3. **Run on emulator/simulator** (optional):
   - For Android: `npm run android` or press 'a' in the terminal
   - For iOS: `npm run ios` or press 'i' in the terminal (Mac only)

## Usage Guide

### First Time Setup
1. **Sign Up**: Create a new account with your email and password
2. **Add Vehicle**: Add your first vehicle with name, model, and license plate
3. **Log Fuel Entry**: Record your fuel purchases with amount, price, and odometer reading

### Main Features

#### Home Dashboard
- View total expenses across all vehicles
- See this month's expenses
- Quick actions for adding entries and vehicles
- Recent fuel entries list

#### Vehicles
- View all registered vehicles
- Add new vehicles
- Delete vehicles (with confirmation)
- Quick access to add fuel entry for specific vehicle

#### Fuel Entry
- Select vehicle from dropdown
- Enter fuel amount in liters
- Enter price per liter
- Record odometer reading
- Add optional notes
- Automatic total cost calculation
- Automatic mileage calculation (based on previous entry)

#### Reports & Analytics
- Filter by vehicle or view all
- View statistics (total expenses, fuel, entries)
- Line chart showing last 6 months expenses
- Recent entries list with details
- Export all data to CSV file

#### Profile
- View user information
- Access app settings (coming soon)
- Help and support information
- Logout option

## Data Storage

All data is stored locally on your device using AsyncStorage. No internet connection is required for basic functionality. Data persists between app sessions but will be cleared if you:
- Logout from the app
- Uninstall the app
- Clear app data from device settings

## Export Feature

The app allows you to export all fuel records to CSV format:
1. Go to Reports screen
2. Tap "Export to CSV" button
3. Choose where to save or share the file

The CSV file includes: Date, Vehicle, Fuel Amount, Price per Unit, Total Cost, Odometer, and Mileage.

## Project Structure

```
FuelExpensesLogger/
├── App.js                      # Main app entry point
├── app.json                    # Expo configuration
├── package.json                # Dependencies
├── src/
│   ├── components/            # Reusable UI components
│   │   ├── Button.js
│   │   ├── Input.js
│   │   └── Card.js
│   ├── navigation/            # Navigation setup
│   │   └── AppNavigator.js
│   ├── screens/               # App screens
│   │   ├── LoginScreen.js
│   │   ├── HomeScreen.js
│   │   ├── VehiclesScreen.js
│   │   ├── AddVehicleScreen.js
│   │   ├── FuelEntryScreen.js
│   │   ├── ReportsScreen.js
│   │   └── ProfileScreen.js
│   ├── utils/                 # Utility functions
│   │   ├── storage.js        # AsyncStorage operations
│   │   └── calculations.js   # Calculations and data processing
│   └── styles/               # Styling
│       └── theme.js          # Color and style constants
```

## Troubleshooting

### Common Issues

1. **"Module not found" error**:
   - Make sure you ran `npm install`
   - Try deleting `node_modules` folder and running `npm install` again

2. **App won't load on phone**:
   - Ensure phone and computer are on the same WiFi network
   - Check if Expo Go app is up to date
   - Try restarting the Expo server

3. **Data not persisting**:
   - Check if you're logged in
   - Make sure you're not clearing app data

4. **Charts not displaying**:
   - Ensure you have at least one fuel entry
   - Check if the date format is correct

## Future Enhancements

Potential features for future versions:
- Cloud backup and sync
- Multiple user support
- Fuel price tracking
- Reminders for fuel entries
- Dark mode
- Multiple currency support
- Multi-language support
- GPS integration for automatic distance tracking
- Fuel station API integration

## Development Notes

This is a frontend-only application built for educational purposes. It demonstrates:
- React Native fundamentals
- State management
- Navigation
- Local data persistence
- Data visualization
- Form handling
- User experience design

## License

This project is for educational purposes.

## Support

For questions or issues:
- Check the troubleshooting section
- Review the code comments
- Contact: support@fuellogger.com (example)

## Credits

Developed as a college mini project based on the Software Requirements Specification (SRS) document.

---

**Note**: This is a demo application. For production use, implement proper authentication, backend services, and data security measures.
