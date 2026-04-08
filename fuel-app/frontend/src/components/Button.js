import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator, View, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { borderRadius, spacing, fontSize, fontWeight, shadows } from '../styles/theme';
import { useTheme } from '../styles/ThemeProvider';

const Button = ({ 
  title, 
  onPress, 
  variant = 'primary', 
  disabled = false, 
  loading = false,
  icon,
  style,
  textStyle 
}) => {
  const { colors, isDark } = useTheme();
  const styles = React.useMemo(() => getStyles(colors), [colors]);
  const scaleAnim = React.useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.95,
      useNativeDriver: true,
      speed: 20,
      bounciness: 10,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
      speed: 20,
      bounciness: 10,
    }).start();
  };

  const getButtonStyle = () => {
    switch (variant) {
      case 'secondary':
        return styles.secondaryButton;
      case 'outline':
        return styles.outlineButton;
      case 'danger':
        return styles.dangerButton;
      case 'ghost':
        return styles.ghostButton;
      default:
        return styles.primaryButton;
    }
  };

  const getTextStyle = () => {
    switch (variant) {
      case 'outline':
        return styles.outlineText;
      case 'ghost':
        return styles.ghostText;
      default:
        return styles.primaryText;
    }
  };

  const pulseAnim = React.useRef(new Animated.Value(0.6)).current;

  React.useEffect(() => {
    if (variant === 'primary' && !disabled && !loading) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, { toValue: 1, duration: 1500, useNativeDriver: true }),
          Animated.timing(pulseAnim, { toValue: 0.6, duration: 1500, useNativeDriver: true }),
        ])
      ).start();
    }
  }, [variant, disabled, loading]);

  const content = (
    <View style={styles.contentRow}>
      {loading ? (
        <ActivityIndicator color={variant === 'outline' || variant === 'ghost' ? colors.primary : colors.textLight} />
      ) : (
        <>
          {icon && <View style={styles.iconWrap}>{icon}</View>}
          <Text style={[getTextStyle(), textStyle]}>{title}</Text>
        </>
      )}
    </View>
  );

  // Primary variant uses gradient
  if (variant === 'primary' && !disabled) {
    return (
      <Animated.View style={[
        { transform: [{ scale: scaleAnim }] }, 
        styles.buttonOuter, 
        { shadowOpacity: pulseAnim },
        style
      ]}>
        <TouchableOpacity
          onPress={onPress}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          disabled={disabled || loading}
          activeOpacity={0.8}
        >
          <LinearGradient
            colors={[colors.primary, colors.primaryDark]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={[styles.button, styles.gradientButton]}
          >
            {content}
          </LinearGradient>
        </TouchableOpacity>
      </Animated.View>
    );
  }

  return (
    <Animated.View style={[{ transform: [{ scale: scaleAnim }] }, disabled && styles.disabledButton, style]}>
      <TouchableOpacity
        style={[
          styles.button,
          getButtonStyle()
        ]}
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={disabled || loading}
        activeOpacity={0.8}
      >
        {content}
      </TouchableOpacity>
    </Animated.View>
  );
};

const getStyles = (colors) => StyleSheet.create({
  buttonOuter: {
    borderRadius: borderRadius.md,
    ...shadows.glow,
  },
  button: {
    borderRadius: borderRadius.md,
    paddingVertical: 14,
    paddingHorizontal: spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 52,
  },
  gradientButton: {
    // gradient fills will handle background
  },
  contentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconWrap: {
    marginRight: spacing.sm,
  },
  primaryButton: {
    backgroundColor: colors.primary,
    ...shadows.glow,
  },
  secondaryButton: {
    backgroundColor: colors.secondary,
    ...shadows.glowSecondary,
  },
  outlineButton: {
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: colors.primary,
  },
  dangerButton: {
    backgroundColor: colors.danger,
    shadowColor: colors.danger,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 6,
  },
  ghostButton: {
    backgroundColor: 'transparent',
  },
  disabledButton: {
    backgroundColor: colors.surfaceLight,
    opacity: 0.5,
    shadowOpacity: 0,
    elevation: 0,
  },
  primaryText: {
    color: colors.textLight,
    fontSize: fontSize.md,
    fontWeight: fontWeight.semibold,
    letterSpacing: 0.5,
  },
  outlineText: {
    color: colors.primary,
    fontSize: fontSize.md,
    fontWeight: fontWeight.semibold,
    letterSpacing: 0.5,
  },
  ghostText: {
    color: colors.primary,
    fontSize: fontSize.md,
    fontWeight: fontWeight.semibold,
  },
});

export default Button;
