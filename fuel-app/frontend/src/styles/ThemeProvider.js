import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useColorScheme } from 'react-native';
import { lightColors, darkColors, spacing, borderRadius, fontSize, fontWeight, getShadows, getCommonStyles } from './theme';

const ThemeContext = createContext();

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider = ({ children }) => {
  const systemColorScheme = useColorScheme();
  const [themeMode, setThemeMode] = useState('system'); // 'light', 'dark', 'system'
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    loadThemePreference();
  }, []);

  useEffect(() => {
    if (themeMode === 'system') {
      setIsDark(systemColorScheme === 'dark');
    } else {
      setIsDark(themeMode === 'dark');
    }
  }, [themeMode, systemColorScheme]);

  const loadThemePreference = async () => {
    try {
      const savedTheme = await AsyncStorage.getItem('@theme_mode');
      if (savedTheme) {
        setThemeMode(savedTheme);
      }
    } catch (e) {
      console.log('Error loading theme preference:', e);
    }
  };

  const changeTheme = async (mode) => {
    setThemeMode(mode);
    try {
      await AsyncStorage.setItem('@theme_mode', mode);
    } catch (e) {
      console.log('Error saving theme preference:', e);
    }
  };

  const colors = isDark ? darkColors : lightColors;
  const shadows = getShadows(colors);
  
  // Note: For commonStyles to be dynamic, we need to pass colors
  // But commonStyles might unused as a direct import if they are moved or we handle them manually.
  // We'll expose a getCommon(colors) if needed.

  const value = {
    themeMode,
    isDark,
    colors,
    shadows,
    spacing,
    borderRadius,
    fontSize,
    fontWeight,
    setTheme: changeTheme,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};
