import React, { useState, useEffect } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StatusBar } from 'expo-status-bar';
import { Platform, LogBox, View } from 'react-native';
import AppNavigator from './src/navigation/AppNavigator';
import LoginScreen from './src/screens/LoginScreen';
import { getUser } from './src/utils/storage';
import { ThemeProvider, useTheme } from './src/styles/ThemeProvider';

// Suppress annoying React Navigation web warnings
if (Platform.OS === 'web') {
  const originalWarn = console.warn;
  console.warn = (...args) => {
    if (args[0] && typeof args[0] === 'string') {
      if (args[0].includes('shadow*') || args[0].includes('pointerEvents is deprecated')) {
        return;
      }
    }
    originalWarn(...args);
  };
}
LogBox.ignoreLogs(['"shadow*" style props are deprecated', 'props.pointerEvents is deprecated']);

const AppContent = () => {
  const { colors } = useTheme();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    checkLoginStatus();
  }, []);

  const checkLoginStatus = async () => {
    const userData = await getUser();
    if (userData) {
      setUser(userData);
      setIsLoggedIn(true);
    }
    setIsLoading(false);
  };

  const handleLogin = (userData) => {
    setUser(userData);
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setUser(null);
    setIsLoggedIn(false);
  };

  if (isLoading) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.background }} />
    );
  }

  return (
    <GestureHandlerRootView style={{ flex: 1, backgroundColor: colors.background }}>
      <SafeAreaProvider>
        <StatusBar style="light" />
        {!isLoggedIn ? (
          <LoginScreen onLogin={handleLogin} />
        ) : (
          <AppNavigator isLoggedIn={isLoggedIn} onLogout={handleLogout} />
        )}
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
};

export default function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}
