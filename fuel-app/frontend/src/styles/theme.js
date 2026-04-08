// ═══════════════════════════════════════════════════════
// 🎨 DYNAMIC THEME — Fuel Expenses Logger
// ═══════════════════════════════════════════════════════

export const darkColors = {
  // Core brand palette (Premium Neon & Gold vibe)
  primary: '#00F0FF',        // Electric Cyan
  primaryDark: '#00B8CC',
  primaryLight: '#5CFCFF',
  primaryGlow: 'rgba(0, 240, 255, 0.4)',
  primarySoft: 'rgba(0, 240, 255, 0.1)',

  // Accent & secondary
  secondary: '#7000FF',      // Deep Neon Purple
  secondaryDark: '#4A00B3',
  secondaryGlow: 'rgba(112, 0, 255, 0.4)',

  accent: '#FFD700',         // Premium Gold
  accentGlow: 'rgba(255, 215, 0, 0.3)',

  // Status
  danger: '#FF2A55',
  dangerGlow: 'rgba(255, 42, 85, 0.3)',
  warning: '#FFAA00',
  success: '#00FF9D',
  info: '#00A2FF',

  // Surfaces — Oled/Premium Dark
  background: '#030305',     // Absolute Dark
  backgroundAlt: '#08080C',
  surface: '#0D0D14',        // Deep surface
  surfaceLight: '#14141E',
  surfaceElevated: '#1A1A26',

  // Text
  text: '#F4F4F5',
  textSecondary: '#A0A0B0',
  textMuted: '#606070',
  textLight: '#FFFFFF',

  // Borders
  border: 'rgba(255, 255, 255, 0.08)',
  borderLight: 'rgba(255, 255, 255, 0.03)',
  borderFocus: 'rgba(0, 240, 255, 0.50)',

  // Gradient stops
  gradient1: '#00F0FF',
  gradient2: '#7000FF',
  gradient3: '#FF007A',

  // Glass
  glass: 'rgba(13, 13, 20, 0.65)',
  glassBorder: 'rgba(255, 255, 255, 0.12)',
  glassHighlight: 'rgba(255, 255, 255, 0.05)',

  // Misc
  overlay: 'rgba(0, 0, 0, 0.80)',
  error: '#FF2A55',
};

export const lightColors = {
  // Core brand palette (Sleek minimalist & Neon vibe)
  primary: '#00D1DF',        // Deep Cyan
  primaryDark: '#00A3B3',
  primaryLight: '#33E6F2',
  primaryGlow: 'rgba(0, 209, 223, 0.25)',
  primarySoft: 'rgba(0, 209, 223, 0.1)',

  // Accent & secondary
  secondary: '#8E2DE2',      // Deep Royal Purple
  secondaryDark: '#6619A8',
  secondaryGlow: 'rgba(142, 45, 226, 0.25)',

  accent: '#FFB800',         // Vibrant Gold
  accentGlow: 'rgba(255, 184, 0, 0.2)',

  // Status
  danger: '#FF3B30',
  dangerGlow: 'rgba(255, 59, 48, 0.2)',
  warning: '#FF9500',
  success: '#34C759',
  info: '#007AFF',

  // Surfaces — Stark white / pale premium grays
  background: '#F5F5F7',     // Apple-like pale background
  backgroundAlt: '#EBEBF0',
  surface: '#FFFFFF',        // Pure white card
  surfaceLight: '#F9F9FB',
  surfaceElevated: '#FFFFFF',

  // Text
  text: '#1C1C1E',
  textSecondary: '#8E8E93',
  textMuted: '#C7C7CC',
  textLight: '#000000',

  // Borders
  border: 'rgba(0, 0, 0, 0.08)',
  borderLight: 'rgba(0, 0, 0, 0.04)',
  borderFocus: 'rgba(0, 209, 223, 0.40)',

  // Gradient stops
  gradient1: '#00D1DF',
  gradient2: '#8E2DE2',
  gradient3: '#FF2A55',

  // Glass
  glass: 'rgba(255, 255, 255, 0.85)',
  glassBorder: 'rgba(0, 0, 0, 0.05)',
  glassHighlight: 'rgba(255, 255, 255, 0.60)',

  // Misc
  overlay: 'rgba(0, 0, 0, 0.50)',
  error: '#FF3B30',
};

// Default export initially points to dark for fallback
export const colors = darkColors;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
  xxxl: 64,
};

export const borderRadius = {
  xs: 6,
  sm: 10,
  md: 14,
  lg: 20,
  xl: 28,
  full: 9999,
};

export const fontSize = {
  xs: 11,
  sm: 13,
  md: 15,
  lg: 17,
  xl: 20,
  xxl: 26,
  xxxl: 34,
  display: 42,
};

export const fontWeight = {
  regular: '400',
  medium: '500',
  semibold: '600',
  bold: '700',
  heavy: '800',
};

export const getShadows = (cols) => ({
  small: {
    shadowColor: cols.text,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.10,
    shadowRadius: 3,
    elevation: 2,
  },
  medium: {
    shadowColor: cols.text,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 4,
  },
  large: {
    shadowColor: cols.text,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  glow: {
    shadowColor: cols.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: cols === darkColors ? 0.40 : 0.20,
    shadowRadius: 16,
    elevation: 8,
  },
  glowSecondary: {
    shadowColor: cols.secondary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: cols === darkColors ? 0.35 : 0.15,
    shadowRadius: 14,
    elevation: 6,
  },
});

export const shadows = getShadows(darkColors); // Fallback

export const getCommonStyles = (cols) => ({
  container: {
    flex: 1,
    backgroundColor: cols.background,
  },
  card: {
    backgroundColor: cols.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: cols.glassBorder,
    ...getShadows(cols).medium,
  },
  glassCard: {
    backgroundColor: cols.glass,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: cols.glassBorder,
    ...getShadows(cols).medium,
  },
  input: {
    backgroundColor: cols.surfaceLight,
    borderWidth: 1,
    borderColor: cols.border,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    fontSize: fontSize.md,
    color: cols.text,
  },
  button: {
    backgroundColor: cols.primary,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
    ...getShadows(cols).glow,
  },
  buttonText: {
    color: cols.textLight,
    fontSize: fontSize.md,
    fontWeight: fontWeight.semibold,
  },
});
