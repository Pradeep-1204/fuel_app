import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
  RefreshControl,
  Platform,
  Animated,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { VehicleCard } from '../components/Card';
import Button from '../components/Button';
import { fetchVehicles, deleteVehicleApi } from '../utils/api';
import { spacing, fontSize, fontWeight, borderRadius, shadows } from '../styles/theme';
import { useTheme } from '../styles/ThemeProvider';

const VehiclesScreen = ({ navigation }) => {
  const { colors, isDark } = useTheme();
  const styles = React.useMemo(() => getStyles(colors), [colors]);
  const [vehicles, setVehicles] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const loadVehicles = async () => {
    const vehiclesData = await fetchVehicles();
    setVehicles(vehiclesData);
  };

  useFocusEffect(
    useCallback(() => {
      loadVehicles();
    }, [])
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await loadVehicles();
    setRefreshing(false);
  };

  const handleDeleteVehicle = (vehicleId) => {
    if (Platform.OS === 'web') {
      if (window.confirm('Are you sure you want to delete this vehicle? This action cannot be undone.')) {
        deleteVehicleApi(vehicleId).then(success => {
          if (success) {
            const updatedVehicles = vehicles.filter((v) => v.id !== vehicleId);
            setVehicles(updatedVehicles);
          } else {
            window.alert('Could not delete vehicle');
          }
        });
      }
    } else {
      Alert.alert(
        'Delete Vehicle',
        'Are you sure you want to delete this vehicle? This action cannot be undone.',
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Delete',
            style: 'destructive',
            onPress: async () => {
              const success = await deleteVehicleApi(vehicleId);
              if(success) {
                const updatedVehicles = vehicles.filter((v) => v.id !== vehicleId);
                setVehicles(updatedVehicles);
              } else {
                Alert.alert('Error', 'Could not delete vehicle');
              }
            },
          },
        ]
      );
    }
  };

  const fuelTypeEmojis = ['🚗', '🚙', '🏎️', '🚐', '🛻'];

  const VehicleItem = ({ vehicle, index }) => {
    const fadeAnim = React.useRef(new Animated.Value(0)).current;
    const translateYAnim = React.useRef(new Animated.Value(20)).current;

    React.useEffect(() => {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 400,
          delay: index * 100,
          useNativeDriver: true,
        }),
        Animated.spring(translateYAnim, {
          toValue: 0,
          friction: 8,
          tension: 40,
          delay: index * 100,
          useNativeDriver: true,
        }),
      ]).start();
    }, []);

    return (
      <Animated.View style={[styles.vehicleItem, { opacity: fadeAnim, transform: [{ translateY: translateYAnim }] }]}>
        <TouchableOpacity
          style={styles.vehicleCard}
          onPress={() => navigation.navigate('FuelEntry', { vehicleId: vehicle.id })}
          activeOpacity={0.85}
        >
          <LinearGradient
            colors={[colors.surface, colors.surfaceLight]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.vehicleCardInner}
          >
            <View style={styles.vehicleIconContainer}>
              <LinearGradient
                colors={[colors.primary + '30', colors.gradient2 + '20']}
                style={styles.vehicleIconBg}
              >
                <Text style={styles.vehicleIcon}>
                  {fuelTypeEmojis[index % fuelTypeEmojis.length]}
                </Text>
              </LinearGradient>
            </View>
            <View style={styles.vehicleInfo}>
              <Text style={styles.vehicleName}>{vehicle.name}</Text>
              <Text style={styles.vehicleModel}>{vehicle.model}</Text>
              <View style={styles.plateContainer}>
                <Text style={styles.vehiclePlate}>{vehicle.licensePlate}</Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={20} color={colors.textMuted} />
          </LinearGradient>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => handleDeleteVehicle(vehicle.id)}
        >
          <Ionicons name="trash-outline" size={18} color={colors.danger} />
        </TouchableOpacity>
      </Animated.View>
    );
  };

  const EmptyState = () => (
    <View style={styles.emptyState}>
      <View style={styles.emptyIconWrap}>
        <Ionicons name="car-sport-outline" size={64} color={colors.textMuted} />
      </View>
      <Text style={styles.emptyTitle}>No Vehicles Yet</Text>
      <Text style={styles.emptySubtitle}>Add your first vehicle to start{'\n'}tracking fuel expenses</Text>
      <Button
        title="Add Vehicle"
        onPress={() => navigation.navigate('AddVehicle')}
        style={styles.emptyButton}
      />
    </View>
  );

  return (
    <View style={styles.container}>
      {vehicles.length > 0 ? (
        <>
          <FlatList
            data={vehicles}
            renderItem={({ item, index }) => <VehicleItem vehicle={item} index={index} />}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.list}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />
            }
          />
          <View style={styles.footer}>
            <Button
              title="Add New Vehicle"
              onPress={() => navigation.navigate('AddVehicle')}
              style={styles.addButton}
              icon={<Ionicons name="add" size={20} color={colors.textLight} />}
            />
          </View>
        </>
      ) : (
        <EmptyState />
      )}
    </View>
  );
};

const getStyles = (colors) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  list: {
    padding: spacing.md,
  },
  vehicleItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  vehicleCard: {
    flex: 1,
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
    ...shadows.medium,
  },
  vehicleCardInner: {
    padding: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.glassBorder,
    borderRadius: borderRadius.lg,
  },
  vehicleIconContainer: {
    marginRight: spacing.md,
  },
  vehicleIconBg: {
    width: 56,
    height: 56,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  vehicleIcon: {
    fontSize: 28,
  },
  vehicleInfo: {
    flex: 1,
  },
  vehicleName: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.bold,
    color: colors.text,
    marginBottom: 3,
  },
  vehicleModel: {
    fontSize: fontSize.md,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  plateContainer: {
    alignSelf: 'flex-start',
    backgroundColor: colors.surfaceElevated,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: borderRadius.xs,
  },
  vehiclePlate: {
    fontSize: fontSize.xs,
    color: colors.textMuted,
    fontWeight: fontWeight.semibold,
    letterSpacing: 1,
  },
  deleteButton: {
    marginLeft: spacing.sm,
    padding: spacing.sm,
    backgroundColor: colors.dangerGlow,
    borderRadius: borderRadius.sm,
  },
  footer: {
    padding: spacing.md,
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.glassBorder,
  },
  addButton: {
    marginBottom: 0,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
  },
  emptyIconWrap: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: colors.surfaceLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.lg,
    borderWidth: 1,
    borderColor: colors.glassBorder,
  },
  emptyTitle: {
    fontSize: fontSize.xl,
    fontWeight: fontWeight.bold,
    color: colors.text,
    marginBottom: spacing.sm,
  },
  emptySubtitle: {
    fontSize: fontSize.md,
    color: colors.textMuted,
    textAlign: 'center',
    marginBottom: spacing.lg,
    lineHeight: 22,
  },
  emptyButton: {
    minWidth: 200,
  },
});

export default VehiclesScreen;
