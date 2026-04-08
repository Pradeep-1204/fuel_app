import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { spacing, borderRadius, fontSize, fontWeight, shadows } from '../styles/theme';
import { useTheme } from '../styles/ThemeProvider';

const languages = [
  { id: 'en', name: 'English (US)', flag: '🇺🇸' },
  { id: 'gb', name: 'English (UK)', flag: '🇬🇧' },
  { id: 'es', name: 'Español', flag: '🇪🇸' },
  { id: 'fr', name: 'Français', flag: '🇫🇷' },
  { id: 'de', name: 'Deutsch', flag: '🇩🇪' },
];

const LanguageScreen = () => {
  const { colors, isDark } = useTheme();
  const styles = React.useMemo(() => getStyles(colors), [colors]);
  const [selectedLanguage, setSelectedLanguage] = useState('en');

  const handleSelect = (lang) => {
    setSelectedLanguage(lang.id);
    if (Platform.OS === 'web') {
      window.alert(`Language updated to ${lang.name}`);
    } else {
      Alert.alert('Language Updated', `Display language set to ${lang.name}`);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.headerTitle}>Select Language</Text>
        
        <View style={styles.card}>
          {languages.map((lang, index) => (
            <React.Fragment key={lang.id}>
              <TouchableOpacity
                style={styles.option}
                onPress={() => handleSelect(lang)}
              >
                <View style={styles.optionLeft}>
                  <Text style={styles.flag}>{lang.flag}</Text>
                  <Text style={[styles.optionText, selectedLanguage === lang.id && styles.optionTextActive]}>
                    {lang.name}
                  </Text>
                </View>
                {selectedLanguage === lang.id ? (
                  <Ionicons name="checkmark-circle" size={24} color={colors.primaryLight} />
                ) : (
                  <View style={styles.unselected} />
                )}
              </TouchableOpacity>
              {index < languages.length - 1 && <View style={styles.divider} />}
            </React.Fragment>
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

const getStyles = (colors) => StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  scroll: { padding: spacing.lg },
  headerTitle: { fontSize: fontSize.sm, fontWeight: fontWeight.bold, color: colors.textMuted, textTransform: 'uppercase', marginBottom: spacing.md, marginLeft: spacing.xs },
  card: { backgroundColor: colors.surface, borderRadius: borderRadius.lg, borderWidth: 1, borderColor: colors.glassBorder, ...shadows.medium, paddingBottom: 4 },
  option: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: spacing.lg },
  optionLeft: { flexDirection: 'row', alignItems: 'center' },
  flag: { fontSize: 24, marginRight: spacing.md },
  optionText: { fontSize: fontSize.md, fontWeight: fontWeight.medium, color: colors.textLight },
  optionTextActive: { color: colors.primaryLight, fontWeight: fontWeight.bold },
  unselected: { width: 24, height: 24, borderRadius: 12, borderWidth: 2, borderColor: colors.borderLight },
  divider: { height: 1, backgroundColor: colors.borderLight, marginLeft: 64 }
});

export default LanguageScreen;
