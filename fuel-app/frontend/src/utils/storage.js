import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEYS = {
  USER: '@user',
  VEHICLES: '@vehicles',
  FUEL_RECORDS: '@fuel_records',
};

// User Authentication
export const saveUser = async (user) => {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
    return true;
  } catch (error) {
    console.error('Error saving user:', error);
    return false;
  }
};

export const getUser = async () => {
  try {
    const user = await AsyncStorage.getItem(STORAGE_KEYS.USER);
    return user ? JSON.parse(user) : null;
  } catch (error) {
    console.error('Error getting user:', error);
    return null;
  }
};

export const removeUser = async () => {
  try {
    await AsyncStorage.removeItem(STORAGE_KEYS.USER);
    return true;
  } catch (error) {
    console.error('Error removing user:', error);
    return false;
  }
};

// Vehicle Management
export const saveVehicles = async (vehicles) => {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.VEHICLES, JSON.stringify(vehicles));
    return true;
  } catch (error) {
    console.error('Error saving vehicles:', error);
    return false;
  }
};

export const getVehicles = async () => {
  try {
    const vehicles = await AsyncStorage.getItem(STORAGE_KEYS.VEHICLES);
    return vehicles ? JSON.parse(vehicles) : [];
  } catch (error) {
    console.error('Error getting vehicles:', error);
    return [];
  }
};

// Fuel Records Management
export const saveFuelRecords = async (records) => {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.FUEL_RECORDS, JSON.stringify(records));
    return true;
  } catch (error) {
    console.error('Error saving fuel records:', error);
    return false;
  }
};

export const getFuelRecords = async () => {
  try {
    const records = await AsyncStorage.getItem(STORAGE_KEYS.FUEL_RECORDS);
    return records ? JSON.parse(records) : [];
  } catch (error) {
    console.error('Error getting fuel records:', error);
    return [];
  }
};

// Clear all data (for logout)
export const clearAllData = async () => {
  try {
    await AsyncStorage.multiRemove([
      STORAGE_KEYS.USER,
      STORAGE_KEYS.VEHICLES,
      STORAGE_KEYS.FUEL_RECORDS,
    ]);
    return true;
  } catch (error) {
    console.error('Error clearing data:', error);
    return false;
  }
};
