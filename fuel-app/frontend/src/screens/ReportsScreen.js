import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Dimensions,
  Platform,
  Animated,
  ActivityIndicator,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { LineChart } from 'react-native-chart-kit';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { fetchVehicles, fetchFuelRecords, deleteFuelRecordApi } from '../utils/api';
import {
  calculateVehicleStats,
  getLast6MonthsData,
  formatCurrency,
  generateCSVData,
} from '../utils/calculations';
import { spacing, fontSize, fontWeight, borderRadius, getShadows } from '../styles/theme';
import Button from '../components/Button';
import { useTheme } from '../styles/ThemeProvider';
import PulsingDot from '../components/PulsingDot';

const screenWidth = Dimensions.get('window').width;

const ReportsScreen = () => {
  const { colors, isDark } = useTheme();
  
  const shadows = React.useMemo(() => getShadows(colors), [colors]);
  const styles = React.useMemo(() => getStyles(colors, shadows), [colors, shadows]);
  
  const [vehicles, setVehicles] = useState([]);
  const [fuelRecords, setFuelRecords] = useState([]);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [chartData, setChartData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [vehiclesData, recordsData] = await Promise.all([
        fetchVehicles(),
        fetchFuelRecords()
      ]);
      
      setVehicles(vehiclesData);
      setFuelRecords(recordsData);

      if (recordsData && recordsData.length > 0) {
        const { months, values } = getLast6MonthsData(recordsData, selectedVehicle);
        setChartData({
          labels: months,
          datasets: [{ data: values && values.length > 0 ? values : [0] }],
        });
      } else {
        setChartData(null);
      }
    } catch (error) {
      console.error('Error loading reports data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [selectedVehicle])
  );

  const handleExportCSV = async () => {
    try {
      const csvContent = generateCSVData(fuelRecords, vehicles);
      const fileName = `fuel_expenses_${new Date().toISOString().split('T')[0]}.csv`;
      const fileUri = FileSystem.documentDirectory + fileName;

      await FileSystem.writeAsStringAsync(fileUri, csvContent, {
        encoding: FileSystem.EncodingType.UTF8,
      });

      const canShare = await Sharing.isAvailableAsync();
      if (canShare) {
        await Sharing.shareAsync(fileUri);
      } else {
        if (Platform.OS === 'web') {
           window.alert(`Data exported! However, file saving is handled by your browser. CSV content: ${csvContent.substring(0, 50)}...`);
        } else {
           Alert.alert('Success', `File saved to ${fileUri}`);
        }
      }
    } catch (error) {
      console.error('Export error:', error);
      if (Platform.OS === 'web') {
        window.alert('Failed to export data');
      } else {
        Alert.alert('Error', 'Failed to export data');
      }
    }
  };

  const handleDeleteRecord = (id) => {
    if (Platform.OS === 'web') {
      if (window.confirm('Are you sure you want to delete this fuel record?')) {
        deleteFuelRecordApi(id).then(success => {
          if (success) {
            window.alert('Record deleted successfully');
            loadData();
          } else {
            window.alert('Failed to delete record');
          }
        });
      }
    } else {
      Alert.alert(
        'Delete Entry',
        'Are you sure you want to delete this fuel record?',
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Delete',
            style: 'destructive',
            onPress: async () => {
              const success = await deleteFuelRecordApi(id);
              if (success) {
                Alert.alert('Success', 'Record deleted successfully');
                loadData(); // refresh the list
              } else {
                Alert.alert('Error', 'Failed to delete record');
              }
            },
          },
        ]
      );
    }
  };

  const stats = React.useMemo(() => {
    if (selectedVehicle) {
      return calculateVehicleStats(fuelRecords, selectedVehicle);
    }
    return {
      totalExpenses: fuelRecords.reduce((sum, r) => sum + parseFloat(r.totalCost || 0), 0).toFixed(2),
      totalFuel: fuelRecords.reduce((sum, r) => sum + parseFloat(r.fuelAmount || 0), 0).toFixed(2),
      recordCount: fuelRecords.length,
    };
  }, [fuelRecords, selectedVehicle]);

  const StatBox = ({ title, value, icon, color }) => (
    <View style={styles.statBox}>
      <View style={[styles.statIconWrap, { backgroundColor: color + '20' }]}>
        <Ionicons name={icon} size={22} color={color} />
      </View>
      <Text style={styles.statBoxValue}>{value}</Text>
      <Text style={styles.statBoxTitle}>{title}</Text>
    </View>
  );

  const HistoryEntryItem = ({ record, index, vehicles }) => {
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

    const vehicle = vehicles.find((v) => v.id === record.vehicleId);

    return (
      <Animated.View style={[styles.entryCard, { opacity: fadeAnim, transform: [{ translateY: translateYAnim }] }]}>
        <LinearGradient
          colors={[colors.surfaceLight, colors.surface]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.entryCardInner}
        >
          <View style={styles.entryHeader}>
            <View style={styles.vehicleRow}>
              <PulsingDot size={10} color={colors.primary} style={styles.entryVehicleDot} />
              <Text style={styles.entryVehicle}>
                {vehicle?.name || vehicles.find(v => (v.id || v._id) === record.vehicleId)?.name || 'Unknown Vehicle'}
              </Text>
            </View>
            <View style={styles.entryRight}>
              <Text style={styles.entryCost}>{formatCurrency(record.totalCost)}</Text>
              <TouchableOpacity
                onPress={() => handleDeleteRecord(record.id)}
                style={styles.deleteButton}
              >
                <Ionicons name="close-circle" size={20} color={colors.textMuted} />
              </TouchableOpacity>
            </View>
          </View>
          
          <View style={styles.entryDetails}>
            <View style={styles.detailBadge}>
              <Ionicons name="calendar-outline" size={14} color={colors.textSecondary} />
              <Text style={styles.entryDetail}>{new Date(record.date).toLocaleDateString()}</Text>
            </View>
            <View style={styles.detailBadge}>
              <Ionicons name="water-outline" size={14} color={colors.textSecondary} />
              <Text style={styles.entryDetail}>{record.fuelAmount}L</Text>
            </View>
            <View style={styles.detailBadge}>
              <Ionicons name="speedometer-outline" size={14} color={colors.textSecondary} />
              <Text style={styles.entryDetail}>{record.odometer} km</Text>
            </View>
            {record.mileage && (
              <View style={[styles.detailBadge, styles.highlightBadge]}>
                <Ionicons name="leaf-outline" size={14} color={colors.secondary} />
                <Text style={[styles.entryDetail, { color: colors.secondary }]}>{record.mileage} km/L</Text>
              </View>
            )}
          </View>
        </LinearGradient>
      </Animated.View>
    );
  };

  if (isLoading && vehicles.length === 0) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.content}>
        {/* Header Title */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Analytics</Text>
          <Text style={styles.headerSubtitle}>Insights & records overview</Text>
        </View>

        {/* Vehicle Filter */}
        <View style={styles.filterContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterScroll}>
            <TouchableOpacity
              style={[styles.filterChip, !selectedVehicle && styles.filterChipActive]}
              onPress={() => setSelectedVehicle(null)}
            >
              <Text style={[styles.filterText, !selectedVehicle && styles.filterTextActive]}>
                All Vehicles
              </Text>
            </TouchableOpacity>
            {vehicles.map((vehicle) => (
              <TouchableOpacity
                key={vehicle.id}
                style={[
                  styles.filterChip,
                  selectedVehicle === vehicle.id && styles.filterChipActive,
                ]}
                onPress={() => setSelectedVehicle(vehicle.id)}
              >
                <Text
                  style={[
                    styles.filterText,
                    selectedVehicle === vehicle.id && styles.filterTextActive,
                  ]}
                >
                  {vehicle.name}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Global Statistics */}
        <View style={styles.statsGrid}>
          <StatBox
            title="Total Expenses"
            value={formatCurrency(stats.totalExpenses)}
            icon="wallet"
            color={colors.primaryLight}
          />
          <StatBox
            title="Total Fuel"
            value={`${stats.totalFuel} L`}
            icon="water"
            color={colors.secondary}
          />
          <StatBox
            title="Total Entries"
            value={stats.recordCount.toString()}
            icon="documents"
            color={colors.accent}
          />
        </View>

        {/* Vehicle-Specific Statistics */}
        {selectedVehicle && (
          <View style={styles.statsGrid}>
            <StatBox
              title="Avg Mileage"
              value={`${stats.averageMileage} km/L`}
              icon="speedometer"
              color={colors.info}
            />
            <StatBox
              title="Total Distance"
              value={`${stats.totalDistance} km`}
              icon="map"
              color={colors.warning}
            />
            <StatBox
              title="Avg Cost/Fill"
              value={formatCurrency(stats.avgCostPerFill)}
              icon="calculator"
              color={colors.danger}
            />
          </View>
        )}

        {/* Expense Chart */}
        {chartData && chartData.datasets[0].data.length > 0 ? (
          <View style={styles.chartContainer}>
            <Text style={styles.chartTitle}>Last 6 Months Trend</Text>
            <View style={styles.chartWrapper}>
              <LineChart
                data={chartData}
                width={screenWidth - spacing.lg * 2 - 20}
                height={220}
                chartConfig={{
                  backgroundColor: 'transparent',
                  backgroundGradientFrom: colors.surface,
                  backgroundGradientTo: colors.surface,
                  backgroundGradientFromOpacity: 0,
                  backgroundGradientToOpacity: 0,
                  decimalPlaces: 0,
                  color: (opacity = 1) => colors.primary,
                  labelColor: (opacity = 1) => colors.textSecondary,
                  style: {
                    borderRadius: borderRadius.md,
                  },
                  propsForDots: {
                    r: '5',
                    strokeWidth: '2',
                    stroke: colors.surface,
                  },
                  propsForBackgroundLines: {
                    stroke: colors.borderLight,
                  },
                }}
                bezier
                style={styles.chart}
              />
            </View>
          </View>
        ) : (
          <View style={styles.chartPlaceholder}>
            <Ionicons name="bar-chart-outline" size={48} color={colors.textMuted} />
            <Text style={styles.placeholderText}>Not enough data for chart</Text>
          </View>
        )}

        {/* Export Button */}
        <Button
          title="Export as CSV"
          onPress={handleExportCSV}
          icon={<Ionicons name="cloud-download-outline" size={20} color={colors.primary} />}
          variant="outline"
          style={styles.exportButton}
        />

        {/* Recent Entries */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>History</Text>
          {fuelRecords.length > 0 ? (
            fuelRecords
              .filter((r) => !selectedVehicle || r.vehicleId === selectedVehicle)
              .sort((a, b) => new Date(b.date) - new Date(a.date))
              .slice(0, 10)
              .map((record, index) => (
                <HistoryEntryItem key={record.id} record={record} index={index} vehicles={vehicles} />
              ))
          ) : (
            <View style={styles.emptyState}>
              <Ionicons name="file-tray-outline" size={48} color={colors.textMuted} />
              <Text style={styles.emptyText}>No history available</Text>
            </View>
          )}
        </View>
      </View>
    </ScrollView>
  );
};

const getStyles = (colors, shadows) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: spacing.lg,
    paddingTop: spacing.xl,
  },
  header: {
    marginBottom: spacing.lg,
  },
  headerTitle: {
    fontSize: fontSize.display - 8,
    fontWeight: fontWeight.heavy,
    color: colors.textLight,
    letterSpacing: -0.5,
  },
  headerSubtitle: {
    fontSize: fontSize.md,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  filterContainer: {
    marginBottom: spacing.xl,
  },
  filterScroll: {
    paddingRight: spacing.lg,
  },
  filterChip: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.full,
    backgroundColor: colors.surfaceLight,
    marginRight: spacing.sm,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  filterChipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
    ...shadows.glow,
  },
  filterText: {
    color: colors.textSecondary,
    fontSize: fontSize.sm,
    fontWeight: fontWeight.medium,
    letterSpacing: 0.5,
  },
  filterTextActive: {
    color: colors.textLight,
    fontWeight: fontWeight.bold,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.lg,
    gap: spacing.sm,
  },
  statBox: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.glassBorder,
    ...shadows.medium,
  },
  statIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  statBoxValue: {
    fontSize: fontSize.xl,
    fontWeight: fontWeight.heavy,
    color: colors.textLight,
    marginBottom: 4,
    textAlign: 'center',
  },
  statBoxTitle: {
    fontSize: fontSize.xs,
    color: colors.textMuted,
    textAlign: 'center',
    fontWeight: fontWeight.bold,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  chartContainer: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.xl,
    padding: spacing.lg,
    marginBottom: spacing.xl,
    borderWidth: 1,
    borderColor: colors.glassBorder,
    ...shadows.medium,
  },
  chartTitle: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.bold,
    color: colors.text,
    marginBottom: spacing.lg,
  },
  chartWrapper: {
    alignItems: 'center',
    marginLeft: -15, // Adjust for chart padding
  },
  chart: {
    borderRadius: borderRadius.md,
  },
  chartPlaceholder: {
    backgroundColor: colors.surfaceLight,
    borderRadius: borderRadius.xl,
    padding: spacing.xl,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xl,
    borderWidth: 1,
    borderColor: colors.glassBorder,
    height: 200,
  },
  placeholderText: {
    color: colors.textMuted,
    marginTop: spacing.md,
    fontSize: fontSize.md,
    fontWeight: fontWeight.medium,
  },
  exportButton: {
    marginBottom: spacing.xl,
  },
  section: {
    marginBottom: spacing.xxl,
  },
  sectionTitle: {
    fontSize: fontSize.xl,
    fontWeight: fontWeight.bold,
    color: colors.textLight,
    marginBottom: spacing.md,
    letterSpacing: -0.5,
  },
  entryCard: {
    marginBottom: spacing.md,
    borderRadius: borderRadius.lg,
    ...shadows.small,
  },
  entryCardInner: {
    padding: spacing.md,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.glassBorder,
  },
  entryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  vehicleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  entryVehicleDot: {
    marginRight: spacing.sm,
  },
  entryVehicle: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.bold,
    color: colors.textLight,
  },
  entryRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  entryCost: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.heavy,
    color: colors.secondary,
    marginRight: spacing.sm,
  },
  deleteButton: {
    padding: 4,
  },
  entryDetails: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  detailBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.backgroundAlt,
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: borderRadius.sm,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  highlightBadge: {
    backgroundColor: colors.secondaryGlow,
    borderColor: colors.secondary + '40',
  },
  entryDetail: {
    fontSize: fontSize.xs,
    color: colors.textSecondary,
    marginLeft: 6,
    fontWeight: fontWeight.medium,
  },
  emptyState: {
    alignItems: 'center',
    padding: spacing.xxl,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.xl,
    borderWidth: 1,
    borderColor: colors.glassBorder,
  },
  emptyText: {
    fontSize: fontSize.md,
    color: colors.textMuted,
    marginTop: spacing.md,
    fontWeight: fontWeight.medium,
  },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ReportsScreen;
