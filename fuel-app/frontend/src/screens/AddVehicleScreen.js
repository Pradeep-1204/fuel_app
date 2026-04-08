import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import Input from '../components/Input';
import Button from '../components/Button';
import { fetchVehicles, addVehicleApi } from '../utils/api';
import { spacing, fontSize, fontWeight, borderRadius, shadows } from '../styles/theme';
import { useTheme } from '../styles/ThemeProvider';

const AddVehicleScreen = ({ navigation }) => {
  const { colors, isDark } = useTheme();
  const styles = React.useMemo(() => getStyles(colors), [colors]);
  const [name, setName] = useState('');
  const [model, setModel] = useState('');
  const [year, setYear] = useState('');
  const [licensePlate, setLicensePlate] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSaveVehicle = async () => {
    if (!name.trim()) {
      Alert.alert('Error', 'Please enter vehicle name');
      return;
    }

    if (!model.trim()) {
      Alert.alert('Error', 'Please enter vehicle model');
      return;
    }

    if (!licensePlate.trim()) {
      Alert.alert('Error', 'Please enter license plate');
      return;
    }

    setLoading(true);

    const newVehicle = {
      id: Date.now().toString(),
      name: name.trim(),
      model: model.trim(),
      year: year.trim(),
      licensePlate: licensePlate.trim(),
      createdAt: new Date().toISOString(),
    };

    const saved = await addVehicleApi(newVehicle);

    setLoading(false);

    if (saved.success) {
      const message = 'Vehicle added successfully!';
      if (Platform.OS === 'web') {
        window.alert(message);
        navigation.goBack();
      } else {
        Alert.alert('Success', message, [
          { text: 'OK', onPress: () => navigation.goBack() },
        ]);
      }
    } else {
      const errorMsg = saved.message || 'Failed to save vehicle';
      if (Platform.OS === 'web') {
         window.alert(errorMsg);
      } else {
         Alert.alert('Error', errorMsg);
      }
    }
  };

  return (
    <View style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : Platform.OS === 'android' ? 'height' : undefined}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.header}>
            <View style={styles.emojiOuter}>
              <LinearGradient
                colors={[colors.secondary + '40', colors.primary + '20']}
                style={styles.emojiBg}
              >
                <Text style={styles.emoji}>🚘</Text>
              </LinearGradient>
            </View>
            <Text style={styles.title}>New Vehicle</Text>
            <Text style={styles.subtitle}>Enter the details below</Text>
          </View>

          <View style={styles.formCard}>
            <Input
              label="Vehicle Name *"
              value={name}
              onChangeText={setName}
              placeholder="e.g., My Honda"
              icon={<Ionicons name="car-outline" size={20} color={colors.textSecondary} />}
            />

            <Input
              label="Model *"
              value={model}
              onChangeText={setModel}
              placeholder="e.g., Honda Civic 2020"
              icon={<Ionicons name="pricetag-outline" size={20} color={colors.textSecondary} />}
            />

            <Input
              label="Year (Optional)"
              value={year}
              onChangeText={setYear}
              placeholder="e.g., 2020"
              keyboardType="numeric"
              icon={<Ionicons name="calendar-outline" size={20} color={colors.textSecondary} />}
            />

            <Input
              label="License Plate *"
              value={licensePlate}
              onChangeText={setLicensePlate}
              placeholder="e.g., ABC-1234"
              autoCapitalize="characters"
              icon={<Ionicons name="barcode-outline" size={20} color={colors.textSecondary} />}
            />
          </View>

          <View style={styles.actions}>
            <Button
              title="Save Vehicle"
              onPress={handleSaveVehicle}
              loading={loading}
              style={styles.saveButton}
              icon={<Ionicons name="checkmark-circle-outline" size={22} color={colors.textLight} />}
            />

            <Button
              title="Cancel"
              onPress={() => navigation.goBack()}
              variant="outline"
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

const getStyles = (colors) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    flexGrow: 1,
    padding: spacing.lg,
  },
  header: {
    alignItems: 'center',
    marginBottom: spacing.xl,
    marginTop: spacing.md,
  },
  emojiOuter: {
    ...shadows.glowSecondary,
    marginBottom: spacing.md,
  },
  emojiBg: {
    width: 90,
    height: 90,
    borderRadius: 45,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  emoji: {
    fontSize: 45,
  },
  title: {
    fontSize: fontSize.xxl,
    fontWeight: fontWeight.bold,
    color: colors.textLight,
    marginBottom: spacing.xs,
  },
  subtitle: {
    fontSize: fontSize.md,
    color: colors.textSecondary,
  },
  formCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.glassBorder,
    marginBottom: spacing.xl,
    ...shadows.medium,
  },
  actions: {
    gap: spacing.md,
    marginBottom: spacing.xl,
  },
  saveButton: {
    marginBottom: 0,
  },
});

export default AddVehicleScreen;
