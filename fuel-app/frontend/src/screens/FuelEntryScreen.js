import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  TouchableOpacity,
  Keyboard,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Input from '../components/Input';
import Button from '../components/Button';
import { fetchVehicles, fetchFuelRecords, addFuelRecordApi } from '../utils/api';
import { calculateMileage } from '../utils/calculations';
import { spacing, borderRadius, fontSize, fontWeight, shadows } from '../styles/theme';
import { useTheme } from '../styles/ThemeProvider';

const FuelEntryScreen = ({ navigation, route }) => {
  const { colors, isDark } = useTheme();
  const styles = React.useMemo(() => getStyles(colors), [colors]);
  const [vehicles, setVehicles] = useState([]);
  const [selectedVehicle, setSelectedVehicle] = useState('');
  const [fuelAmount, setFuelAmount] = useState('');
  const [pricePerUnit, setPricePerUnit] = useState('');
  const [odometer, setOdometer] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadVehicles();
    if (route.params?.vehicleId) {
      setSelectedVehicle(route.params.vehicleId);
    }
  }, [route.params]);

  const loadVehicles = async () => {
    const vehiclesData = await fetchVehicles();
    setVehicles(vehiclesData);
    if (vehiclesData.length > 0 && !selectedVehicle) {
      setSelectedVehicle(vehiclesData[0].id);
    }
  };

  const handleSaveEntry = async () => {
    if (!selectedVehicle) {
      Alert.alert('Error', 'Please select a vehicle');
      return;
    }

    if (!fuelAmount || parseFloat(fuelAmount) <= 0) {
      Alert.alert('Error', 'Please enter valid fuel amount');
      return;
    }

    if (!pricePerUnit || parseFloat(pricePerUnit) <= 0) {
      Alert.alert('Error', 'Please enter valid price per unit');
      return;
    }

    if (!odometer || parseFloat(odometer) <= 0) {
      Alert.alert('Error', 'Please enter valid odometer reading');
      return;
    }

    Keyboard.dismiss();
    setLoading(true);

    const totalCost = (parseFloat(fuelAmount) * parseFloat(pricePerUnit)).toFixed(2);
    
    // Get previous records to calculate mileage
    const records = await fetchFuelRecords();
    const vehicleRecords = records
      .filter((r) => r.vehicleId === selectedVehicle)
      .sort((a, b) => a.odometer - b.odometer);
    
    let mileage = null;
    if (vehicleRecords.length > 0) {
      const lastRecord = vehicleRecords[vehicleRecords.length - 1];
      const distance = parseFloat(odometer) - lastRecord.odometer;
      if (distance > 0) {
        mileage = calculateMileage(distance, parseFloat(fuelAmount));
      }
    }

    const newEntry = {
      id: Date.now().toString(),
      vehicleId: selectedVehicle,
      fuelAmount: parseFloat(fuelAmount),
      pricePerUnit: parseFloat(pricePerUnit),
      totalCost: parseFloat(totalCost),
      odometer: parseFloat(odometer),
      date: date,
      notes: notes.trim(),
      mileage: mileage,
      createdAt: new Date().toISOString(),
    };

    const saved = await addFuelRecordApi(newEntry);

    setLoading(false);

    if (saved.success) {
      const finishSave = () => {
        setFuelAmount('');
        setPricePerUnit('');
        setOdometer('');
        setNotes('');
        navigation.goBack();
      };
      
      const message = 'Fuel entry added successfully!';
      if (Platform.OS === 'web') {
        window.alert(message);
        finishSave();
      } else {
        Alert.alert('Success', message, [
          { text: 'OK', onPress: finishSave },
        ]);
      }
    } else {
      const errorMsg = saved.message || 'Failed to save fuel entry';
      if (Platform.OS === 'web') {
        window.alert(errorMsg);
      } else {
        Alert.alert('Error', errorMsg);
      }
    }
  };

  const totalCost = fuelAmount && pricePerUnit 
    ? (parseFloat(fuelAmount) * parseFloat(pricePerUnit)).toFixed(2)
    : '0.00';

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
                colors={[colors.secondaryGlow, 'transparent']}
                style={styles.emojiBg}
              >
                <Text style={styles.emoji}>⛽</Text>
              </LinearGradient>
            </View>
            <Text style={styles.title}>Add Fuel Entry</Text>
            <Text style={styles.subtitle}>Log your refuel details</Text>
          </View>

          <View style={styles.formCard}>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Select Vehicle *</Text>
              <View style={styles.pickerWrapper}>
                <Ionicons name="car-outline" size={20} color={colors.textSecondary} style={styles.pickerIcon} />
                <View style={styles.pickerInner}>
                  <Picker
                    selectedValue={selectedVehicle}
                    onValueChange={setSelectedVehicle}
                    style={styles.picker}
                    dropdownIconColor={colors.textSecondary}
                  >
                    {vehicles.length === 0 ? (
                      <Picker.Item label="No vehicles available" value="" color={Platform.OS==='ios'?colors.textLight:colors.text} />
                    ) : (
                      vehicles.map((vehicle) => (
                        <Picker.Item
                          key={vehicle.id}
                          label={`${vehicle.name} - ${vehicle.licensePlate}`}
                          value={vehicle.id}
                          color={Platform.OS==='ios'?colors.textLight:colors.text}
                        />
                      ))
                    )}
                  </Picker>
                </View>
              </View>
            </View>

            {vehicles.length === 0 && (
              <TouchableOpacity
                style={styles.addVehiclePrompt}
                onPress={() => navigation.navigate('AddVehicle')}
              >
                <Ionicons name="add-circle-outline" size={24} color={colors.secondary} />
                <Text style={styles.addVehicleText}>Add a vehicle first</Text>
              </TouchableOpacity>
            )}

            <View style={styles.rowInputs}>
              <View style={{ flex: 1, marginRight: spacing.sm }}>
                <Input
                  label="Fuel amount *"
                  value={fuelAmount}
                  onChangeText={setFuelAmount}
                  placeholder="Liters"
                  keyboardType="decimal-pad"
                  icon={<Ionicons name="water-outline" size={18} color={colors.textSecondary} />}
                />
              </View>
              <View style={{ flex: 1, marginLeft: spacing.sm }}>
                <Input
                  label="Price/L *"
                  value={pricePerUnit}
                  onChangeText={setPricePerUnit}
                  placeholder="$"
                  keyboardType="decimal-pad"
                  icon={<Ionicons name="pricetag-outline" size={18} color={colors.textSecondary} />}
                />
              </View>
            </View>

            <LinearGradient
              colors={[colors.primary + '30', colors.gradient2 + '20']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.totalCostContainer}
            >
              <Text style={styles.totalCostLabel}>Total Estimated Cost</Text>
              <Text style={styles.totalCost}>${totalCost}</Text>
            </LinearGradient>

            <Input
              label="Odometer (km) *"
              value={odometer}
              onChangeText={setOdometer}
              placeholder="e.g., 12500"
              keyboardType="numeric"
              icon={<Ionicons name="speedometer-outline" size={20} color={colors.textSecondary} />}
            />

            <Input
              label="Date *"
              value={date}
              onChangeText={setDate}
              placeholder="YYYY-MM-DD"
              icon={<Ionicons name="calendar-outline" size={20} color={colors.textSecondary} />}
            />

            <Input
              label="Notes (Optional)"
              value={notes}
              onChangeText={setNotes}
              placeholder="Add any notes..."
              multiline
            />
          </View>

          <View style={styles.actions}>
            <Button
              title="Save Entry"
              onPress={handleSaveEntry}
              loading={loading}
              disabled={vehicles.length === 0}
              icon={<Ionicons name="save-outline" size={20} color={colors.textLight} />}
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
    borderColor: colors.secondaryGlow,
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
  inputContainer: {
    marginBottom: spacing.md,
  },
  label: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.semibold,
    color: colors.textSecondary,
    marginBottom: spacing.sm,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  pickerWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: borderRadius.md,
    overflow: 'hidden',
    height: 52, // match input height
  },
  pickerIcon: {
    paddingLeft: spacing.md,
  },
  pickerInner: {
    flex: 1,
    marginLeft: Platform.OS === 'ios' ? 0 : -spacing.sm, // adjust picker alignment
  },
  picker: {
    color: colors.text,
    height: 52,
    backgroundColor: 'transparent',
  },
  addVehiclePrompt: {
    flexDirection: 'row',
    backgroundColor: 'transparent',
    padding: spacing.md,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.lg,
    borderWidth: 1,
    borderColor: colors.secondary + '40',
    borderStyle: 'dashed',
  },
  addVehicleText: {
    color: colors.secondary,
    fontSize: fontSize.md,
    fontWeight: fontWeight.semibold,
    marginLeft: spacing.sm,
  },
  rowInputs: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  totalCostContainer: {
    padding: spacing.lg,
    borderRadius: borderRadius.md,
    marginBottom: spacing.lg,
    borderWidth: 1,
    borderColor: colors.primaryGlow,
    alignItems: 'center',
    ...shadows.glow,
  },
  totalCostLabel: {
    fontSize: fontSize.xs,
    color: colors.textLight,
    opacity: 0.8,
    marginBottom: spacing.xs,
    textTransform: 'uppercase',
    letterSpacing: 1,
    fontWeight: fontWeight.medium,
  },
  totalCost: {
    fontSize: fontSize.display,
    fontWeight: fontWeight.heavy,
    color: colors.textLight,
  },
  actions: {
    gap: spacing.md,
    marginBottom: spacing.xl,
  },
});

export default FuelEntryScreen;
