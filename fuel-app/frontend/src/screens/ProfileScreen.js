import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Button from '../components/Button';
import { getUser } from '../utils/storage';
import { logoutApi } from '../utils/api';
import { spacing, fontSize, fontWeight, borderRadius, shadows } from '../styles/theme';
import { useTheme } from '../styles/ThemeProvider';

const ProfileScreen = ({ navigation, onLogout }) => {
  const { colors, isDark } = useTheme();
  const styles = React.useMemo(() => getStyles(colors), [colors]);
  const [user, setUser] = useState(null);

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    const userData = await getUser();
    setUser(userData);
  };

  const handleLogout = () => {
    if (Platform.OS === 'web') {
      if (window.confirm('Are you sure you want to logout? All local data will be cleared.')) {
        logoutApi().then(() => onLogout());
      }
    } else {
      Alert.alert(
        'Logout',
        'Are you sure you want to logout? All local data will be cleared.',
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Logout',
            style: 'destructive',
            onPress: async () => {
              await logoutApi();
              onLogout();
            },
          },
        ]
      );
    }
  };

  const MenuItem = ({ icon, title, onPress, color = colors.text, hideArrow = false }) => (
    <TouchableOpacity style={styles.menuItem} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.menuItemLeft}>
        <View style={styles.menuIconWrap}>
          <Ionicons name={icon} size={22} color={color} />
        </View>
        <Text style={[styles.menuItemText, { color }]}>{title}</Text>
      </View>
      {!hideArrow && <Ionicons name="chevron-forward" size={20} color={colors.textMuted} />}
    </TouchableOpacity>
  );

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header Profile Info */}
      <View style={styles.header}>
        <LinearGradient
          colors={[colors.primary, colors.gradient2, colors.gradient3]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.avatarGradient}
        >
          <View style={styles.avatarInner}>
            <Text style={styles.avatarText}>{user?.name?.charAt(0).toUpperCase() || 'U'}</Text>
          </View>
        </LinearGradient>
        <Text style={styles.userName}>{user?.name || 'User'}</Text>
        <Text style={styles.userEmail}>{user?.email || user?.phone || 'Loading...'}</Text>
      </View>

      <View style={styles.content}>
        {/* Sections */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account</Text>
          <View style={styles.menuContainer}>
            <MenuItem
              icon="person-outline"
              title="Edit Profile"
              onPress={() => navigation.navigate('EditProfile')}
            />
            <MenuItem
              icon="notifications-outline"
              title="Notifications"
              onPress={() => navigation.navigate('Notifications')}
            />
            <View style={styles.separator} />
            <MenuItem
              icon="shield-checkmark-outline"
              title="Privacy & Security"
              onPress={() => navigation.navigate('PrivacySecurity')}
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>App Settings</Text>
          <View style={styles.menuContainer}>
            <MenuItem
              icon="color-palette-outline"
              title="Theme (Dark Mode)"
              color={colors.primaryLight}
              onPress={() => navigation.navigate('Theme')}
            />
            <MenuItem
              icon="language-outline"
              title="Language"
              onPress={() => navigation.navigate('Language')}
            />
            <View style={styles.separator} />
            <MenuItem
              icon="card-outline"
              title="Currency ($)"
              onPress={() => navigation.navigate('Currency')}
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Support</Text>
          <View style={styles.menuContainer}>
            <MenuItem
              icon="help-buoy-outline"
              title="Help & FAQ"
              onPress={() => navigation.navigate('HelpFAQ')}
            />
            <MenuItem
              icon="information-circle-outline"
              title="About"
              onPress={() => {
                  const title = 'Fuel Expenses Logger';
                  const msg = 'Version 2.0.0 Alpha\n\nPremium Dark Edition.\nTrack and manage your vehicle fuel expenses effortlessly.\n\nDeveloped as a college project.';
                  if (Platform.OS === 'web') window.alert(`${title}\n\n${msg}`);
                  else Alert.alert(title, msg);
                }
              }
            />
            <View style={styles.separator} />
            <MenuItem
              icon="star-outline"
              title="Rate App"
              color={colors.accent}
              onPress={() => {
                const msg = 'Thank you for using Fuel Expenses Logger! We hope you love the premium experience. Please consider rating us 5 stars on the app store.';
                if (Platform.OS === 'web') window.alert(msg);
                else Alert.alert('Rate Us', msg);
              }}
            />
          </View>
        </View>

        <View style={styles.logoutContainer}>
          <Button
            title="Sign Out"
            onPress={handleLogout}
            variant="danger"
            icon={<Ionicons name="log-out-outline" size={22} color={colors.textLight} />}
            style={styles.logoutButton}
          />
        </View>

        <Text style={styles.version}>v2.0.0 (Dark Edition)</Text>
      </View>
    </ScrollView>
  );
};

const getStyles = (colors) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    alignItems: 'center',
    paddingVertical: spacing.xxl,
    borderBottomWidth: 1,
    borderBottomColor: colors.glassBorder,
    backgroundColor: colors.surface,
    borderBottomLeftRadius: borderRadius.xl,
    borderBottomRightRadius: borderRadius.xl,
    ...shadows.medium,
  },
  avatarGradient: {
    width: 100,
    height: 100,
    borderRadius: 50,
    padding: 3,
    marginBottom: spacing.md,
    ...shadows.glow,
  },
  avatarInner: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 4,
    borderColor: colors.background,
  },
  avatarText: {
    fontSize: fontSize.display,
    fontWeight: fontWeight.heavy,
    color: colors.textLight,
  },
  userName: {
    fontSize: fontSize.xxl,
    fontWeight: fontWeight.bold,
    color: colors.textLight,
    letterSpacing: -0.5,
    marginBottom: 4,
  },
  userEmail: {
    fontSize: fontSize.lg,
    color: colors.textSecondary,
    fontWeight: fontWeight.medium,
  },
  content: {
    padding: spacing.lg,
  },
  section: {
    marginBottom: spacing.xl,
  },
  sectionTitle: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.bold,
    color: colors.textMuted,
    marginBottom: spacing.md,
    marginLeft: spacing.sm,
    textTransform: 'uppercase',
    letterSpacing: 1.2,
  },
  menuContainer: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.glassBorder,
    ...shadows.medium,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing.lg,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuIconWrap: {
    width: 36,
    height: 36,
    borderRadius: borderRadius.sm,
    backgroundColor: colors.surfaceLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  menuItemText: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.semibold,
    letterSpacing: 0.3,
  },
  separator: {
    height: 1,
    backgroundColor: colors.glassBorder,
    marginLeft: spacing.xxl + 24, // Align with text
  },
  logoutContainer: {
    marginTop: spacing.sm,
    marginBottom: spacing.xl,
  },
  logoutButton: {
    borderRadius: borderRadius.lg,
  },
  version: {
    textAlign: 'center',
    fontSize: fontSize.sm,
    fontWeight: fontWeight.bold,
    color: colors.textMuted,
    marginBottom: spacing.xxl,
    textTransform: 'uppercase',
    letterSpacing: 1.5,
  },
});

export default ProfileScreen;
