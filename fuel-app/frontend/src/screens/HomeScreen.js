import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  Platform,
  Alert,
  Animated,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { StatCard } from '../components/Card';
import { getUser } from '../utils/storage';
import { fetchVehicles, fetchFuelRecords, deleteFuelRecordApi } from '../utils/api';
import { calculateTotalCost, formatCurrency, getLast6MonthsData } from '../utils/calculations';
import { spacing, fontSize, fontWeight, borderRadius, shadows } from '../styles/theme';
import { useTheme } from '../styles/ThemeProvider';
import PulsingDot from '../components/PulsingDot';

const HomeScreen = ({ navigation }) => {
  const { colors, isDark } = useTheme();
  const styles = React.useMemo(() => getStyles(colors), [colors]);
  const [user, setUser] = useState(null);
  const [vehicles, setVehicles] = useState([]);
  const [fuelRecords, setFuelRecords] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [stats, setStats] = useState({
    totalVehicles: 0,
    totalExpenses: 0,
    thisMonthExpenses: 0,
    totalRecords: 0,
  });

  const fadeAnim = useRef(new Animated.Value(0)).current;

  const loadData = async () => {
    const userData = await getUser();
    const vehiclesData = await fetchVehicles();
    const recordsData = await fetchFuelRecords();

    setUser(userData);
    setVehicles(vehiclesData);
    setFuelRecords(recordsData);

    const totalExpenses = recordsData.reduce(
      (sum, record) => sum + parseFloat(record.totalCost),
      0
    );

    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    const thisMonthExpenses = recordsData
      .filter((record) => {
        const date = new Date(record.date);
        return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
      })
      .reduce((sum, record) => sum + parseFloat(record.totalCost), 0);

    setStats({
      totalVehicles: vehiclesData.length,
      totalExpenses,
      thisMonthExpenses,
      totalRecords: recordsData.length,
    });
  };

  useFocusEffect(
    useCallback(() => {
      loadData();
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }).start();
    }, [])
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  const QuickAction = ({ icon, title, onPress, gradientColors }) => (
    <TouchableOpacity style={styles.quickAction} onPress={onPress} activeOpacity={0.8}>
      <LinearGradient
        colors={gradientColors}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.quickActionIcon}
      >
        <Ionicons name={icon} size={26} color={colors.textLight} />
      </LinearGradient>
      <Text style={styles.quickActionText}>{title}</Text>
    </TouchableOpacity>
  );

  const handleDeleteRecord = (id) => {
    if (Platform.OS === 'web') {
      if (window.confirm('Are you sure you want to delete this fuel record?')) {
        deleteFuelRecordApi(id).then(success => {
          if (success) loadData();
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
              if (success) loadData();
            },
          },
        ]
      );
    }
  };

  const RecentEntry = ({ record, index }) => {
  const { colors, isDark } = useTheme();
  const styles = React.useMemo(() => getStyles(colors), [colors]);
    const vehicle = vehicles.find((v) => v.id === record.vehicleId);
    const date = new Date(record.date).toLocaleDateString();

    return (
      <Animated.View style={[
        styles.recentEntry,
        { opacity: fadeAnim, transform: [{ translateY: fadeAnim.interpolate({ inputRange: [0, 1], outputRange: [20, 0] }) }] }
      ]}>
        <PulsingDot size={8} color={colors.primary} style={styles.entryDot} />
        <View style={styles.recentEntryLeft}>
          <Text style={styles.recentEntryVehicle}>
            {vehicle?.name || vehicles.find(v => (v.id || v._id) === record.vehicleId)?.name || 'Unknown Vehicle'}
          </Text>
          <Text style={styles.recentEntryDate}>{date}</Text>
        </View>
        <View style={styles.recentEntryRight}>
          <Text style={styles.recentEntryCost}>{formatCurrency(record.totalCost)}</Text>
          <View style={styles.recentEntryActions}>
             <Text style={styles.recentEntryAmount}>{record.fuelAmount}L</Text>
             <TouchableOpacity onPress={() => handleDeleteRecord(record.id)} style={styles.deleteBtn}>
               <Ionicons name="trash-outline" size={16} color={colors.danger} />
             </TouchableOpacity>
          </View>
        </View>
      </Animated.View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Background Orbs for Premium Look */}
      <LinearGradient
        colors={[colors.primaryGlow, 'transparent']}
        style={styles.bgOrb1}
      />
      <LinearGradient
        colors={[colors.secondaryGlow, 'transparent']}
        style={styles.bgOrb2}
      />

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />}
      >
        {/* Header */}
        <LinearGradient
          colors={[colors.primary, colors.gradient2, colors.gradient3]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.header}
        >
          <View style={styles.headerOverlay}>
            <View style={styles.headerContent}>
              <View>
                <Text style={styles.greeting}>Hello, {user?.name || 'User'} 👋</Text>
                <Text style={styles.headerSubtitle}>Track your fuel expenses</Text>
              </View>
              <View style={styles.headerAvatar}>
                <Text style={styles.headerAvatarText}>
                  {user?.name?.charAt(0).toUpperCase() || 'U'}
                </Text>
              </View>
            </View>
          </View>
        </LinearGradient>

        <View style={styles.content}>
          {/* Quick Stats */}
          <View style={styles.statsContainer}>
            <View style={styles.statsRow}>
              <StatCard
                title="Total Expenses"
                value={formatCurrency(stats.totalExpenses)}
                gradient
                style={styles.statCard}
                delay={100}
              />
            </View>
            <View style={styles.statsRow}>
              <StatCard
                title="Vehicles"
                value={stats.totalVehicles.toString()}
                subtitle="Registered"
                style={styles.halfCard}
                delay={200}
              />
              <StatCard
                title="This Month"
                value={formatCurrency(stats.thisMonthExpenses)}
                subtitle="Expenses"
                style={styles.halfCard}
                delay={300}
              />
            </View>
          </View>

          {/* Quick Actions */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Quick Actions</Text>
            <View style={styles.quickActions}>
              <QuickAction
                icon="add-circle"
                title="Add Entry"
                gradientColors={[colors.primary, colors.gradient2]}
                onPress={() => navigation.navigate('FuelEntry')}
              />
              <QuickAction
                icon="car-sport"
                title="Add Vehicle"
                gradientColors={[colors.secondary, colors.secondaryDark]}
                onPress={() => navigation.navigate('AddVehicle')}
              />
              <QuickAction
                icon="stats-chart"
                title="Reports"
                gradientColors={[colors.accent, '#FF9500']}
                onPress={() => navigation.navigate('Reports')}
              />
            </View>
          </View>

          {/* Recent Entries */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Recent Entries</Text>
              <TouchableOpacity onPress={() => navigation.navigate('Reports')} style={styles.seeAllBtn}>
                <Text style={styles.seeAll}>See All</Text>
                <Ionicons name="chevron-forward" size={14} color={colors.primary} />
              </TouchableOpacity>
            </View>
            {fuelRecords.length > 0 ? (
              fuelRecords
                .slice(0, 5)
                .sort((a, b) => new Date(b.date) - new Date(a.date))
                .map((record, index) => <RecentEntry key={index} record={record} index={index} />)
            ) : (
              <View style={styles.emptyState}>
                <View style={styles.emptyIconWrap}>
                  <Ionicons name="document-text-outline" size={48} color={colors.textMuted} />
                </View>
                <Text style={styles.emptyText}>No entries yet</Text>
                <Text style={styles.emptySubtext}>Add your first fuel entry to get started</Text>
              </View>
            )}
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const getStyles = (colors) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollView: {
    flex: 1,
  },
  bgOrb1: {
    position: 'absolute',
    top: -50,
    left: -100,
    width: 300,
    height: 300,
    borderRadius: 150,
    opacity: 0.6,
  },
  bgOrb2: {
    position: 'absolute',
    top: 200,
    right: -100,
    width: 250,
    height: 250,
    borderRadius: 125,
    opacity: 0.4,
  },
  header: {
    paddingTop: spacing.xl + 20,
    paddingBottom: spacing.xxl + 20,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    ...shadows.glow,
  },
  headerOverlay: {
    paddingHorizontal: spacing.lg,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  greeting: {
    fontSize: fontSize.xxl,
    fontWeight: fontWeight.heavy,
    color: colors.textLight,
    marginBottom: spacing.xs,
    letterSpacing: -0.5,
  },
  headerSubtitle: {
    fontSize: fontSize.md,
    color: 'rgba(255,255,255,0.85)',
    fontWeight: fontWeight.medium,
  },
  headerAvatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: 'rgba(255,255,255,0.25)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.5)',
  },
  headerAvatarText: {
    fontSize: fontSize.xl,
    fontWeight: fontWeight.bold,
    color: colors.textLight,
  },
  content: {
    marginTop: -spacing.xl,
    padding: spacing.md,
  },
  statsContainer: {
    marginBottom: spacing.lg,
  },
  statsRow: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  statCard: {
    flex: 1,
  },
  halfCard: {
    flex: 1,
  },
  section: {
    marginBottom: spacing.lg,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  sectionTitle: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.bold,
    color: colors.text,
    marginBottom: spacing.md,
  },
  seeAllBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  seeAll: {
    fontSize: fontSize.sm,
    color: colors.primary,
    fontWeight: fontWeight.semibold,
    marginRight: 2,
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  quickAction: {
    alignItems: 'center',
    flex: 1,
  },
  quickActionIcon: {
    width: 58,
    height: 58,
    borderRadius: borderRadius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
    ...shadows.medium,
  },
  quickActionText: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    textAlign: 'center',
    fontWeight: fontWeight.medium,
  },
  recentEntry: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginBottom: spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.glassBorder,
  },
  entryDot: {
    marginRight: spacing.sm,
  },
  recentEntryLeft: {
    flex: 1,
  },
  recentEntryVehicle: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.semibold,
    color: colors.text,
    marginBottom: 4,
  },
  recentEntryDate: {
    fontSize: fontSize.sm,
    color: colors.textMuted,
  },
  recentEntryRight: {
    alignItems: 'flex-end',
  },
  recentEntryCost: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.bold,
    color: colors.secondary,
    marginBottom: 4,
  },
  recentEntryAmount: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
  },
  recentEntryActions: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  deleteBtn: {
    marginLeft: spacing.sm,
    padding: 4,
    backgroundColor: colors.dangerGlow,
    borderRadius: borderRadius.xs,
  },
  emptyState: {
    alignItems: 'center',
    padding: spacing.xl,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.glassBorder,
  },
  emptyIconWrap: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.surfaceLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  emptyText: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.semibold,
    color: colors.text,
    marginTop: spacing.xs,
  },
  emptySubtext: {
    fontSize: fontSize.sm,
    color: colors.textMuted,
    marginTop: spacing.xs,
  },
});

export default HomeScreen;
