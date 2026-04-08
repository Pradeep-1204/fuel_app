import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { borderRadius, spacing, fontSize, shadows, fontWeight } from '../styles/theme';
import { useTheme } from '../styles/ThemeProvider';

export const Card = ({ children, style, onPress, delay = 0 }) => {
  const { colors, isDark } = useTheme();
  const styles = React.useMemo(() => getStyles(colors), [colors]);
  const Component = onPress ? TouchableOpacity : View;
  
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const translateYAnim = useRef(new Animated.Value(20)).current;
  const hoverAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 400,
        delay,
        useNativeDriver: true,
      }),
      Animated.spring(translateYAnim, {
        toValue: 0,
        friction: 8,
        tension: 40,
        delay,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handleMouseEnter = () => {
    Animated.timing(hoverAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: false,
    }).start();
  };

  const handleMouseLeave = () => {
    Animated.timing(hoverAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: false,
    }).start();
  };
  
  return (
    <Animated.View 
      onMouseEnter={Platform.OS === 'web' ? handleMouseEnter : undefined}
      onMouseLeave={Platform.OS === 'web' ? handleMouseLeave : undefined}
      style={{ 
        opacity: fadeAnim, 
        transform: [
          { translateY: translateYAnim },
          { scale: hoverAnim.interpolate({ inputRange: [0, 1], outputRange: [1, 1.02] }) }
        ] 
      }}
    >
      <Component
        style={[
          styles.card, 
          style,
          Platform.OS === 'web' && { 
            borderColor: hoverAnim.interpolate({ 
              inputRange: [0, 1], 
              outputRange: [colors.glassBorder, colors.primary] 
            }) 
          }
        ]}
        onPress={onPress}
        activeOpacity={onPress ? 0.85 : 1}
      >
        {children}
      </Component>
    </Animated.View>
  );
};

export const StatCard = ({ title, value, subtitle, icon, gradient = false, delay = 0 }) => {
  const { colors, isDark } = useTheme();
  const styles = React.useMemo(() => getStyles(colors), [colors]);
  
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const translateYAnim = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        delay,
        useNativeDriver: true,
      }),
      Animated.spring(translateYAnim, {
        toValue: 0,
        friction: 7,
        tension: 50,
        delay,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const content = (
    <>
      <Text style={[styles.statTitle, gradient && { color: 'rgba(255,255,255,0.7)' }]}>
        {title}
      </Text>
      <Text style={[styles.statValue, gradient && styles.statValueGradient]}>
        {value}
      </Text>
      {subtitle && (
        <Text style={[styles.statSubtitle, gradient && { color: 'rgba(255,255,255,0.6)' }]}>
          {subtitle}
        </Text>
      )}
    </>
  );

  if (gradient) {
    return (
      <Animated.View style={[{ opacity: fadeAnim, transform: [{ translateY: translateYAnim }] }, styles.gradientCard]}>
        <LinearGradient
          colors={[colors.gradient1, colors.gradient2]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={StyleSheet.absoluteFillObject}
        />
        <View style={styles.gradientOverlay}>
          {content}
        </View>
      </Animated.View>
    );
  }

  return (
    <Animated.View style={[{ opacity: fadeAnim, transform: [{ translateY: translateYAnim }] }, styles.card]}>
      {content}
    </Animated.View>
  );
};

export const VehicleCard = ({ vehicle, onPress, onEdit, onDelete, index = 0 }) => {
  const { colors, isDark } = useTheme();
  const styles = React.useMemo(() => getStyles(colors), [colors]);
  return (
    <Card style={styles.vehicleCard} onPress={onPress} delay={index * 100}>
      <View style={styles.vehicleHeader}>
        <View style={styles.vehicleIconContainer}>
          <Text style={styles.vehicleIcon}>🚗</Text>
        </View>
        <View style={styles.vehicleInfo}>
          <Text style={styles.vehicleName}>{vehicle.name}</Text>
          <Text style={styles.vehicleModel}>{vehicle.model}</Text>
          <Text style={styles.vehiclePlate}>{vehicle.licensePlate}</Text>
        </View>
      </View>
    </Card>
  );
};

const getStyles = (colors) => StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.glassBorder,
    ...shadows.medium,
  },
  gradientCard: {
    borderRadius: borderRadius.lg,
    marginBottom: spacing.md,
    ...shadows.glow,
    overflow: 'hidden',
  },
  gradientOverlay: {
    padding: spacing.md,
  },
  statTitle: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
    fontWeight: fontWeight.medium,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  statValue: {
    fontSize: fontSize.xxxl,
    fontWeight: fontWeight.heavy,
    color: colors.text,
  },
  statValueGradient: {
    color: colors.textLight,
  },
  statSubtitle: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  vehicleCard: {
    marginHorizontal: spacing.md,
  },
  vehicleHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  vehicleIconContainer: {
    width: 56,
    height: 56,
    borderRadius: borderRadius.md,
    backgroundColor: colors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
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
    marginBottom: 2,
  },
  vehiclePlate: {
    fontSize: fontSize.sm,
    color: colors.textMuted,
    fontWeight: fontWeight.medium,
  },
});

export default Card;
