import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { spacing, borderRadius, fontSize, fontWeight, shadows } from '../styles/theme';
import { useTheme } from '../styles/ThemeProvider';

const faqs = [
  { q: "How do I add a new vehicle?", a: "Go to the Vehicles tab and tap the 'Add New Vehicle' button at the bottom of the screen." },
  { q: "How is my mileage calculated?", a: "Mileage is calculated continuously based on your odometer readings between each fuel entry." },
  { q: "Can I export my data?", a: "Yes, you can export all your fuel histories into a standard CSV file directly from the Reports tab." },
  { q: "How does Dark Mode work?", a: "The entire premium app experience is built in native Dark Mode to save battery life and reduce eye strain." },
];

const HelpFAQScreen = () => {
  const { colors, isDark } = useTheme();
  const styles = React.useMemo(() => getStyles(colors), [colors]);
  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.heroBox}>
          <Ionicons name="help-buoy" size={64} color={colors.primaryLight} style={styles.heroIcon} />
          <Text style={styles.heroTitle}>How can we help?</Text>
          <Text style={styles.heroSub}>Frequently Asked Questions</Text>
        </View>

        {faqs.map((faq, index) => (
          <View key={index} style={styles.faqCard}>
            <View style={styles.questionRow}>
              <Ionicons name="chatbubble-ellipses-outline" size={20} color={colors.secondary} style={{ marginRight: spacing.sm }} />
              <Text style={styles.questionText}>{faq.q}</Text>
            </View>
            <Text style={styles.answerText}>{faq.a}</Text>
          </View>
        ))}

        <View style={styles.contactCard}>
          <Text style={styles.contactTitle}>Still need help?</Text>
          <Text style={styles.contactEmail}>support@fuellogger.app</Text>
        </View>
      </ScrollView>
    </View>
  );
};

const getStyles = (colors) => StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  scroll: { padding: spacing.lg },
  heroBox: { alignItems: 'center', marginVertical: spacing.xl },
  heroIcon: { marginBottom: spacing.md },
  heroTitle: { fontSize: fontSize.xxl, fontWeight: fontWeight.bold, color: colors.textLight, marginBottom: spacing.xs },
  heroSub: { fontSize: fontSize.md, color: colors.textSecondary },
  faqCard: { backgroundColor: colors.surface, borderRadius: borderRadius.lg, padding: spacing.lg, borderWidth: 1, borderColor: colors.glassBorder, marginBottom: spacing.md, ...shadows.small },
  questionRow: { flexDirection: 'row', alignItems: 'center', marginBottom: spacing.sm },
  questionText: { fontSize: fontSize.md, fontWeight: fontWeight.bold, color: colors.textLight, flex: 1 },
  answerText: { fontSize: fontSize.sm, color: colors.textSecondary, lineHeight: 22, marginLeft: 28 },
  contactCard: { backgroundColor: colors.surfaceLight, borderRadius: borderRadius.lg, padding: spacing.lg, alignItems: 'center', marginTop: spacing.xl, borderWidth: 1, borderColor: colors.borderLight },
  contactTitle: { fontSize: fontSize.md, color: colors.textMuted, marginBottom: spacing.xs },
  contactEmail: { fontSize: fontSize.lg, fontWeight: fontWeight.bold, color: colors.primaryLight }
});

export default HelpFAQScreen;
