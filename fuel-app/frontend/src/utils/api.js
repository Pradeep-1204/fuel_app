import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

// For physical devices or web to work, use your computer's local network IP.
// Make sure this matches your computer's IP (e.g., 10.40.26.155). 
// 'localhost' works for web browser, but phones need the specific IP.
const API_URL = Platform.OS === 'web' ? 'http://localhost:5000/api' : 'http://10.40.26.155:5000/api';
const getAuthHeaders = async () => {
  const token = await AsyncStorage.getItem('@token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

export const authenticate = async (type, data) => {
  try {
    const response = await fetch(`${API_URL}/auth/${type}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    const result = await response.json();
    if (response.ok && result.success) {
      await AsyncStorage.setItem('@token', result.token);
      await AsyncStorage.setItem('@user', JSON.stringify(result.user));
      return { success: true, user: result.user };
    }
    return { success: false, message: result.message || 'Authentication failed' };
  } catch (error) {
    console.error('Auth error:', error);
    return { success: false, message: 'Network error. Make sure the backend is running.' };
  }
};

export const logoutApi = async () => {
  await AsyncStorage.removeItem('@token');
  await AsyncStorage.removeItem('@user');
};

export const fetchVehicles = async () => {
  try {
    const response = await fetch(`${API_URL}/vehicles`, { headers: await getAuthHeaders() });
    if (response.ok) {
      const data = await response.json();
      // Map MongoDB _id to id for frontend compatibility
      return data.map((v) => ({ ...v, id: v._id || v.id }));
    }
    const errorData = await response.json().catch(() => ({}));
    console.warn('Fetch vehicles failed:', errorData.message || response.statusText);
    return [];
  } catch (error) {
    console.error('Fetch vehicles network error:', error);
    return [];
  }
};

export const addVehicleApi = async (vehicle) => {
  try {
    const response = await fetch(`${API_URL}/vehicles`, {
      method: 'POST',
      headers: await getAuthHeaders(),
      body: JSON.stringify(vehicle),
    });
    const data = await response.json();
    if (response.ok) {
      return { success: true, vehicle: { ...data, id: data._id || data.id } };
    }
    return { success: false, message: data.message || 'Failed to save vehicle' };
  } catch (error) {
    console.error('Add vehicle error:', error);
    return { success: false, message: 'Network error. Make sure the backend is running.' };
  }
};

export const deleteVehicleApi = async (id) => {
  try {
    const response = await fetch(`${API_URL}/vehicles/${id}`, {
      method: 'DELETE',
      headers: await getAuthHeaders(),
    });
    return response.ok;
  } catch (error) {
    return false;
  }
};

export const fetchFuelRecords = async () => {
  try {
    const response = await fetch(`${API_URL}/fuel-records`, { headers: await getAuthHeaders() });
    if (response.ok) {
      const data = await response.json();
      // Map MongoDB _id to id and ensure vehicleId is a string ID
      return data.map((r) => ({
        ...r,
        id: r._id || r.id,
        vehicleId: r.vehicleId?._id || r.vehicleId, // Handle populated object
      }));
    }
    return [];
  } catch (error) {
    return [];
  }
};

export const addFuelRecordApi = async (record) => {
  try {
    const response = await fetch(`${API_URL}/fuel-records`, {
      method: 'POST',
      headers: await getAuthHeaders(),
      body: JSON.stringify(record),
    });
    const data = await response.json();
    if (response.ok) {
      return { success: true, record: { ...data, id: data._id || data.id } };
    }
    return { success: false, message: data.message || 'Failed to save fuel entry' };
  } catch (error) {
    console.error('Add fuel record error:', error);
    return { success: false, message: 'Network error. Make sure the backend is running.' };
  }
};

export const deleteFuelRecordApi = async (id) => {
  try {
    const response = await fetch(`${API_URL}/fuel-records/${id}`, {
      method: 'DELETE',
      headers: await getAuthHeaders(),
    });
    return response.ok;
  } catch (error) {
    return false;
  }
};

// New: Fetch fuel record stats/analytics
export const fetchFuelStats = async (vehicleId) => {
  try {
    const url = vehicleId
      ? `${API_URL}/fuel-records/stats?vehicleId=${vehicleId}`
      : `${API_URL}/fuel-records/stats`;
    const response = await fetch(url, { headers: await getAuthHeaders() });
    if (response.ok) return await response.json();
    return [];
  } catch (error) {
    return [];
  }
};

// New: Health check
export const checkHealth = async () => {
  try {
    const response = await fetch(`${API_URL}/health`);
    return response.ok;
  } catch (error) {
    return false;
  }
};
