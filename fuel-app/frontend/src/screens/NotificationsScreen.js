import React, { useState } from 'react';
import { View, Text, StyleSheet, Switch, ScrollView } from 'react-native';
import { spacing, borderRadius, fontSize, fontWeight, shadows } from '../styles/theme';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../styles/ThemeProvider';

const NotificationsScreen = () => {
  const { colors, isDark } = useTheme();
  const styles = React.useMemo(() => getStyles(colors), [colors]);
  const [preferences, setPreferences] = useState({
    push: true,
    email: false,
    reminders: true,
    updates: false,
  });

  const toggleSwitch = (key) => {
    setPreferences(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const SettingRow = ({ title, description, valKey, icon }) => (
    <View style={styles.settingRow}>
      <View style={styles.leftContent}>
        <View style={styles.iconWrap}>
          <Ionicons name={icon} size={22} color={colors.primaryLight} />
        </View>
        <View>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.description}>{description}</Text>
        </View>
      </View>
      <Switch
        trackColor={{ false: colors.textMuted, true: colors.primary }}
        thumbColor={colors.textLight}
        ios_backgroundColor={colors.textMuted}
        onValueChange={() => toggleSwitch(valKey)}
        value={preferences[valKey]}
      />
    </View>
  );

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.card}>
          <SettingRow title="Push Notifications" description="Receive alerts on your device" valKey="push" icon="notifications" />
          <View style={styles.divider} />
          <SettingRow title="Email Reports" description="Monthly summary of fuel expenses" valKey="email" icon="mail" />
          <View style={styles.divider} />
          <SettingRow title="Service Reminders" description="Alerts when mileage reaches thresholds" valKey="reminders" icon="car-sport" />
          <View style={styles.divider} />
          <SettingRow title="App Updates" description="News about new features" valKey="updates" icon="sparkles" />
        </View>
      </ScrollView>
    </View>
  );
};

const getStyles = (colors) => StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  scroll: { padding: spacing.lg },
  card: { backgroundColor: colors.surface, borderRadius: borderRadius.lg, padding: spacing.md, borderWidth: 1, borderColor: colors.glassBorder, ...shadows.medium },
  settingRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: spacing.md },
  leftContent: { flexDirection: 'row', alignItems: 'center', flex: 1, paddingRight: spacing.md },
  iconWrap: { width: 40, height: 40, backgroundColor: colors.surfaceLight, borderRadius: borderRadius.sm, alignItems: 'center', justifyContent: 'center', marginRight: spacing.md },
  title: { fontSize: fontSize.md, fontWeight: fontWeight.semibold, color: colors.textLight, marginBottom: 2 },
  description: { fontSize: fontSize.xs, color: colors.textSecondary },
  divider: { height: 1, backgroundColor: colors.borderLight, marginLeft: 56 }
});

export default NotificationsScreen;
