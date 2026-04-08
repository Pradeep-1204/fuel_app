import React from 'react';
import { View, Platform, Animated } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { borderRadius, spacing } from '../styles/theme';

// Import screens
import LoginScreen from '../screens/LoginScreen';
import HomeScreen from '../screens/HomeScreen';
import VehiclesScreen from '../screens/VehiclesScreen';
import AddVehicleScreen from '../screens/AddVehicleScreen';
import FuelEntryScreen from '../screens/FuelEntryScreen';
import ReportsScreen from '../screens/ReportsScreen';
import ProfileScreen from '../screens/ProfileScreen';

// Settings Screens
import EditProfileScreen from '../screens/EditProfileScreen';
import NotificationsScreen from '../screens/NotificationsScreen';
import PrivacySecurityScreen from '../screens/PrivacySecurityScreen';
import ThemeScreen from '../screens/ThemeScreen';
import LanguageScreen from '../screens/LanguageScreen';
import CurrencyScreen from '../screens/CurrencyScreen';
import HelpFAQScreen from '../screens/HelpFAQScreen';
import { useTheme } from '../styles/ThemeProvider';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const TabIcon = ({ focused, iconName, color }) => {
  const { colors } = useTheme();
  const pulseAnim = React.useRef(new Animated.Value(0)).current;
  const hoverAnim = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    if (focused) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 0,
            duration: 1000,
            useNativeDriver: true,
          }),
        ])
      ).start();
    } else {
      pulseAnim.setValue(0);
    }
  }, [focused]);

  const handleMouseEnter = () => {
    Animated.timing(hoverAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: false,
    }).start();
  };

  const handleMouseLeave = () => {
    Animated.timing(hoverAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: false,
    }).start();
  };

  return (
    <View 
      onMouseEnter={Platform.OS === 'web' ? handleMouseEnter : undefined}
      onMouseLeave={Platform.OS === 'web' ? handleMouseLeave : undefined}
      style={{
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: 4,
        width: 60,
      }}
    >
      {(focused || Platform.OS === 'web') && (
        <Animated.View style={{
          position: 'absolute',
          top: -2,
          width: 22,
          height: 3,
          borderRadius: 2,
          backgroundColor: focused ? colors.primary : colors.textMuted,
          opacity: focused 
            ? pulseAnim.interpolate({ inputRange: [0.1, 1], outputRange: [0.4, 0.9] })
            : hoverAnim.interpolate({ inputRange: [0, 1], outputRange: [0, 0.5] }),
          shadowColor: colors.primary,
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.8,
          shadowRadius: 6,
          elevation: 5,
          transform: [{ scaleX: focused ? pulseAnim.interpolate({ inputRange: [0, 1], outputRange: [0.9, 1.2] }) : 1 }]
        }} />
      )}
      <Animated.View style={{
        transform: [
          { scale: focused ? 1.15 : hoverAnim.interpolate({ inputRange: [0, 1], outputRange: [1, 1.1] }) },
          { translateY: focused ? -1 : 0 }
        ],
        opacity: focused ? 1 : hoverAnim.interpolate({ inputRange: [0.1, 1], outputRange: [0.7, 1] })
      }}>
        <Ionicons name={iconName} size={24} color={focused ? colors.primary : color} />
      </Animated.View>
      {focused && (
        <Animated.View style={{
          position: 'absolute',
          bottom: -14,
          width: 4,
          height: 4,
          borderRadius: 2,
          backgroundColor: colors.primary,
          opacity: pulseAnim,
          shadowColor: colors.primary,
          shadowRadius: 4,
          shadowOpacity: 0.8
        }} />
      )}
    </View>
  );
};

const MainTabs = ({ onLogout }) => {
  const { colors, isDark } = useTheme();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Vehicles') {
            iconName = focused ? 'car-sport' : 'car-sport-outline';
          } else if (route.name === 'Reports') {
            iconName = focused ? 'stats-chart' : 'stats-chart-outline';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'person' : 'person-outline';
          }

          return <TabIcon focused={focused} iconName={iconName} color={color} />;
        },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopColor: 'transparent',
          position: 'absolute',
          bottom: Platform.OS === 'ios' ? 24 : 16,
          left: 16,
          right: 16,
          borderRadius: 24,
          paddingBottom: Platform.OS === 'ios' ? 20 : 8,
          paddingTop: 8,
          height: Platform.OS === 'ios' ? 80 : 65,
          elevation: 10,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 10 },
          shadowOpacity: 0.3,
          shadowRadius: 20,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
          marginTop: 2,
        },
        headerStyle: {
          backgroundColor: colors.surface,
          borderBottomWidth: 1,
          borderBottomColor: colors.glassBorder,
          elevation: 0,
          shadowOpacity: 0,
        },
        headerTintColor: colors.text,
        headerTitleStyle: {
          fontWeight: '700',
          fontSize: 18,
          color: colors.text,
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Vehicles" component={VehiclesScreen} />
      <Tab.Screen name="Reports" component={ReportsScreen} />
      <Tab.Screen name="Profile">
        {(props) => <ProfileScreen {...props} onLogout={onLogout} />}
      </Tab.Screen>
    </Tab.Navigator>
  );
};

const AppNavigator = ({ isLoggedIn, onLogout }) => {
  const { colors, isDark } = useTheme();

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerStyle: {
            backgroundColor: colors.surface,
            borderBottomWidth: 1,
            borderBottomColor: colors.glassBorder,
            elevation: 0,
            shadowOpacity: 0,
          },
          headerTintColor: colors.text,
          headerTitleStyle: {
            fontWeight: '700',
            fontSize: 18,
            color: colors.text,
          },
          cardStyle: {
            backgroundColor: colors.background,
          },
        }}
      >
        {!isLoggedIn ? (
          <Stack.Screen 
            name="Login" 
            component={LoginScreen}
            options={{ headerShown: false }}
          />
        ) : (
          <>
            <Stack.Screen
              name="MainTabs"
              options={{ headerShown: false }}
            >
              {(props) => <MainTabs {...props} onLogout={onLogout} />}
            </Stack.Screen>
            <Stack.Screen
              name="AddVehicle"
              component={AddVehicleScreen}
              options={{ title: 'Add Vehicle' }}
            />
            <Stack.Screen
              name="FuelEntry"
              component={FuelEntryScreen}
              options={{ title: 'Add Fuel Entry' }}
            />
            <Stack.Screen name="EditProfile" component={EditProfileScreen} options={{ title: 'Edit Profile' }} />
            <Stack.Screen name="Notifications" component={NotificationsScreen} options={{ title: 'Notifications' }} />
            <Stack.Screen name="PrivacySecurity" options={{ title: 'Privacy & Security' }}>
               {(props) => <PrivacySecurityScreen {...props} onLogout={onLogout} />}
            </Stack.Screen>
            <Stack.Screen name="Theme" component={ThemeScreen} options={{ title: 'Theme' }} />
            <Stack.Screen name="Language" component={LanguageScreen} options={{ title: 'Language' }} />
            <Stack.Screen name="Currency" component={CurrencyScreen} options={{ title: 'Currency' }} />
            <Stack.Screen name="HelpFAQ" component={HelpFAQScreen} options={{ title: 'Help & FAQ' }} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
