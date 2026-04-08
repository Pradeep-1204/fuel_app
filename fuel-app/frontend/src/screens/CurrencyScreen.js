import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { spacing, borderRadius, fontSize, fontWeight, shadows } from '../styles/theme';
import { useTheme } from '../styles/ThemeProvider';

const currencies = [
  { id: 'usd', name: 'US Dollar', symbol: '$' },
  { id: 'eur', name: 'Euro', symbol: '€' },
  { id: 'gbp', name: 'British Pound', symbol: '£' },
  { id: 'inr', name: 'Indian Rupee', symbol: '₹' },
  { id: 'jpy', name: 'Japanese Yen', symbol: '¥' },
];

const CurrencyScreen = () => {
  const { colors, isDark } = useTheme();
  const styles = React.useMemo(() => getStyles(colors), [colors]);
  const [selectedCurrency, setSelectedCurrency] = useState('usd');

  const handleSelect = (curr) => {
    setSelectedCurrency(curr.id);
    if (Platform.OS === 'web') {
      window.alert(`Currency updated to ${curr.name} (${curr.symbol})`);
    } else {
      Alert.alert('Currency Updated', `Display currency set to ${curr.name} (${curr.symbol})`);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.headerTitle}>Display Currency</Text>
        
        <View style={styles.card}>
          {currencies.map((curr, index) => (
            <React.Fragment key={curr.id}>
              <TouchableOpacity
                style={styles.option}
                onPress={() => handleSelect(curr)}
              >
                <View style={styles.optionLeft}>
                  <View style={styles.symbolBg}>
                    <Text style={styles.symbol}>{curr.symbol}</Text>
                  </View>
                  <Text style={[styles.optionText, selectedCurrency === curr.id && styles.optionTextActive]}>
                    {curr.name}
                  </Text>
                </View>
                {selectedCurrency === curr.id ? (
                  <Ionicons name="checkmark-circle" size={24} color={colors.primaryLight} />
                ) : (
                  <View style={styles.unselected} />
                )}
              </TouchableOpacity>
              {index < currencies.length - 1 && <View style={styles.divider} />}
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
  symbolBg: { width: 36, height: 36, borderRadius: 18, backgroundColor: colors.surfaceLight, alignItems: 'center', justifyContent: 'center', marginRight: spacing.md },
  symbol: { fontSize: 18, fontWeight: fontWeight.bold, color: colors.textLight },
  optionText: { fontSize: fontSize.md, fontWeight: fontWeight.medium, color: colors.textLight },
  optionTextActive: { color: colors.primaryLight, fontWeight: fontWeight.bold },
  unselected: { width: 24, height: 24, borderRadius: 12, borderWidth: 2, borderColor: colors.borderLight },
  divider: { height: 1, backgroundColor: colors.borderLight, marginLeft: 64 }
});

export default CurrencyScreen;
