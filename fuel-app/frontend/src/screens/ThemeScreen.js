import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { spacing, borderRadius, fontSize, fontWeight, shadows } from '../styles/theme';
import { useTheme } from '../styles/ThemeProvider';

const ThemeScreen = () => {
  const { colors, themeMode, setTheme } = useTheme();
  const styles = React.useMemo(() => getStyles(colors), [colors]);

  return (
    <View style={styles.container}>
      <Text style={styles.headerTitle}>Appearance</Text>
      
      <View style={styles.card}>
        <TouchableOpacity style={styles.option} onPress={() => setTheme('light')}>
          <View style={styles.optionLeft}>
            <View style={[styles.iconWrap, { backgroundColor: '#F3F4F6' }]}>
              <Ionicons name="sunny" size={20} color="#F59E0B" />
            </View>
            <Text style={[styles.optionText, themeMode === 'light' && styles.optionTextActive]}>Premium Light Mode</Text>
          </View>
          {themeMode === 'light' ? (
            <Ionicons name="checkmark-circle" size={24} color={colors.primary} />
          ) : (
            <View style={styles.unselected} />
          )}
        </TouchableOpacity>
        
        <View style={styles.divider} />
        
        <TouchableOpacity style={styles.option} onPress={() => setTheme('dark')}>
          <View style={styles.optionLeft}>
            <LinearGradient colors={[colors.primary, colors.gradient2]} style={styles.iconWrap}>
              <Ionicons name="moon" size={20} color="#FFF" />
            </LinearGradient>
            <Text style={[styles.optionText, themeMode === 'dark' && styles.optionTextActive]}>Premium Dark Mode</Text>
          </View>
          {themeMode === 'dark' ? (
            <Ionicons name="checkmark-circle" size={24} color={colors.primary} />
          ) : (
            <View style={styles.unselected} />
          )}
        </TouchableOpacity>

        <View style={styles.divider} />
        
        <TouchableOpacity style={styles.option} onPress={() => setTheme('system')}>
          <View style={styles.optionLeft}>
            <View style={[styles.iconWrap, { backgroundColor: colors.surfaceLight }]}>
              <Ionicons name="phone-portrait-outline" size={20} color={colors.textSecondary} />
            </View>
            <Text style={[styles.optionText, themeMode === 'system' && styles.optionTextActive]}>System Default</Text>
          </View>
          {themeMode === 'system' ? (
            <Ionicons name="checkmark-circle" size={24} color={colors.primary} />
          ) : (
            <View style={styles.unselected} />
          )}
        </TouchableOpacity>
      </View>

      <Text style={styles.footerNote}>Experience the ultra-premium neon aesthetics in both Dark and Light modes.</Text>
    </View>
  );
};

const getStyles = (colors) => StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, padding: spacing.lg },
  headerTitle: { fontSize: fontSize.sm, fontWeight: fontWeight.bold, color: colors.textMuted, textTransform: 'uppercase', marginBottom: spacing.md, marginLeft: spacing.xs, marginTop: spacing.lg },
  card: { backgroundColor: colors.surface, borderRadius: borderRadius.lg, borderWidth: 1, borderColor: colors.glassBorder, ...shadows.medium },
  option: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: spacing.lg },
  optionLeft: { flexDirection: 'row', alignItems: 'center' },
  iconWrap: { width: 32, height: 32, borderRadius: 16, alignItems: 'center', justifyContent: 'center', marginRight: spacing.md },
  optionText: { fontSize: fontSize.md, fontWeight: fontWeight.medium, color: colors.textSecondary },
  optionTextActive: { color: colors.text, fontWeight: fontWeight.bold },
  unselected: { width: 24, height: 24, borderRadius: 12, borderWidth: 2, borderColor: colors.borderLight },
  divider: { height: 1, backgroundColor: colors.borderLight, marginLeft: 64 },
  footerNote: { fontSize: fontSize.sm, color: colors.textSecondary, textAlign: 'center', marginTop: spacing.xl, lineHeight: 20 }
});

export default ThemeScreen;
