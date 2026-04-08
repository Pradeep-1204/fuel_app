import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Input from '../components/Input';
import Button from '../components/Button';
import { getUser, saveUser } from '../utils/storage';
import { spacing, borderRadius, fontSize, fontWeight, shadows } from '../styles/theme';
import { useTheme } from '../styles/ThemeProvider';

const EditProfileScreen = ({ navigation }) => {
  const { colors, isDark } = useTheme();
  const styles = React.useMemo(() => getStyles(colors), [colors]);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    const user = await getUser();
    if (user) {
      setName(user.name || '');
      setEmail(user.email || '');
      setPhone(user.phone || '');
    }
  };

  const handleSave = async () => {
    setLoading(true);
    const currentUser = await getUser();
    if (currentUser) {
      const updatedUser = { ...currentUser, name, email, phone };
      await saveUser(updatedUser);
      // Simulating network request delay
      setTimeout(() => {
        setLoading(false);
        navigation.goBack();
      }, 600);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <LinearGradient
            colors={[colors.primary, colors.gradient2]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.avatarGradient}
          >
            <View style={styles.avatarInner}>
              <Text style={styles.avatarText}>{name ? name.charAt(0).toUpperCase() : 'U'}</Text>
            </View>
          </LinearGradient>
          <Text style={styles.infoText}>Change picture is coming soon</Text>
        </View>

        <View style={styles.formCard}>
          <Input
            label="Full Name"
            value={name}
            onChangeText={setName}
            icon={<Ionicons name="person-outline" size={20} color={colors.textSecondary} />}
          />
          <Input
            label="Email Address"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            icon={<Ionicons name="mail-outline" size={20} color={colors.textSecondary} />}
          />
          <Input
            label="Phone Number"
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
            icon={<Ionicons name="call-outline" size={20} color={colors.textSecondary} />}
          />
        </View>

        <Button
          title="Save Changes"
          onPress={handleSave}
          loading={loading}
          icon={<Ionicons name="checkmark-circle-outline" size={20} color={colors.textLight} />}
        />
      </ScrollView>
    </View>
  );
};

const getStyles = (colors) => StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  scrollContent: { padding: spacing.lg, paddingBottom: spacing.xxl * 2 },
  header: { alignItems: 'center', marginBottom: spacing.xl, marginTop: spacing.md },
  avatarGradient: { width: 100, height: 100, borderRadius: 50, padding: 3, marginBottom: spacing.md, ...shadows.glow },
  avatarInner: { flex: 1, backgroundColor: colors.surface, borderRadius: 50, alignItems: 'center', justifyContent: 'center' },
  avatarText: { fontSize: fontSize.display, fontWeight: fontWeight.heavy, color: colors.textLight },
  infoText: { fontSize: fontSize.sm, color: colors.textSecondary },
  formCard: { backgroundColor: colors.surface, borderRadius: borderRadius.lg, padding: spacing.lg, borderWidth: 1, borderColor: colors.glassBorder, marginBottom: spacing.xl, ...shadows.medium }
});

export default EditProfileScreen;
