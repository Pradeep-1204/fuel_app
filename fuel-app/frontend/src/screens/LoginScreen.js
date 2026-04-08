import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
  Animated,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import Input from '../components/Input';
import Button from '../components/Button';
import { authenticate } from '../utils/api';
import { spacing, fontSize, fontWeight, borderRadius } from '../styles/theme';
import { useTheme } from '../styles/ThemeProvider';

const LoginScreen = ({ onLogin }) => {
  const { colors, isDark } = useTheme();
  const styles = React.useMemo(() => getStyles(colors), [colors]);
  const [isSignUp, setIsSignUp] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Animations
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(40)).current;
  const logoScale = useRef(new Animated.Value(0.5)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        friction: 8,
        tension: 40,
        useNativeDriver: true,
      }),
      Animated.spring(logoScale, {
        toValue: 1,
        friction: 5,
        tension: 40,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handleAuth = async () => {
    setErrorMessage('');

    if (!email && !phone) {
      setErrorMessage('Please enter email or phone number');
      return;
    }

    if (isSignUp && !name) {
      setErrorMessage('Please enter your name');
      return;
    }

    if (!password) {
      setErrorMessage('Please enter password');
      return;
    }

    setLoading(true);

    try {
      const result = await authenticate(isSignUp ? 'register' : 'login', {
        id: Date.now().toString(),
        name,
        email,
        phone,
        password
      });

      if (result.success) {
        onLogin(result.user);
      } else {
        setErrorMessage(result.message || 'Authentication failed');
      }
    } catch (error) {
       setErrorMessage('An unexpected error occurred. Is the backend running?');
    } finally {
       setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <LinearGradient
        colors={[colors.background, colors.backgroundAlt, colors.surface]}
        style={styles.gradient}
      >
        {/* Decorative orbs */}
        <View style={styles.orb1} />
        <View style={styles.orb2} />
        <View style={styles.orb3} />

        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : Platform.OS === 'android' ? 'height' : undefined}
          style={styles.keyboardView}
        >
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            <Animated.View style={[
              styles.header,
              {
                opacity: fadeAnim,
                transform: [{ scale: logoScale }],
              }
            ]}>
              <View style={styles.logoContainer}>
                <LinearGradient
                  colors={[colors.primary, colors.gradient2]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.logoBg}
                >
                  <Text style={styles.logo}>⛽</Text>
                </LinearGradient>
              </View>
              <Text style={styles.title}>Fuel Logger</Text>
              <Text style={styles.subtitle}>Track your fuel expenses effortlessly</Text>
            </Animated.View>

            <Animated.View style={[
              styles.formContainer,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
              }
            ]}>
              {/* Subtle top glow line */}
              <LinearGradient
                colors={[colors.primary, colors.gradient2, colors.gradient3]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.formGlowLine}
              />

              {errorMessage ? (
                <View style={styles.errorBox}>
                  <Text style={styles.errorText}>⚠️  {errorMessage}</Text>
                </View>
              ) : null}

              {isSignUp && (
                <Input
                  label="Full Name"
                  value={name}
                  onChangeText={setName}
                  placeholder="Enter your name"
                />
              )}

              <Input
                label="Email"
                value={email}
                onChangeText={setEmail}
                placeholder="Enter your email"
                keyboardType="email-address"
                autoCapitalize="none"
              />

              {isSignUp && (
                <Input
                  label="Phone Number"
                  value={phone}
                  onChangeText={setPhone}
                  placeholder="Enter your phone number"
                  keyboardType="phone-pad"
                />
              )}

              <Input
                label="Password"
                value={password}
                onChangeText={setPassword}
                placeholder="Enter your password"
                secureTextEntry
              />

              <Button
                title={isSignUp ? 'Create Account' : 'Sign In'}
                onPress={handleAuth}
                loading={loading}
                style={styles.button}
              />

              <View style={styles.switchContainer}>
                <Text style={styles.switchText}>
                  {isSignUp ? 'Already have an account?' : "Don't have an account?"}
                </Text>
                <Button
                  title={isSignUp ? 'Sign In' : 'Create Account'}
                  onPress={() => setIsSignUp(!isSignUp)}
                  variant="ghost"
                  style={styles.switchButton}
                />
              </View>
            </Animated.View>
          </ScrollView>
        </KeyboardAvoidingView>
      </LinearGradient>
    </View>
  );
};

const getStyles = (colors) => StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  // Decorative background orbs
  orb1: {
    position: 'absolute',
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: colors.primaryGlow,
    top: -80,
    right: -80,
    opacity: 0.4,
  },
  orb2: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: colors.secondaryGlow,
    bottom: 100,
    left: -60,
    opacity: 0.3,
  },
  orb3: {
    position: 'absolute',
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: colors.accentGlow,
    top: '40%',
    right: -30,
    opacity: 0.3,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: spacing.lg,
  },
  header: {
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  logoContainer: {
    marginBottom: spacing.lg,
  },
  logoBg: {
    width: 100,
    height: 100,
    borderRadius: borderRadius.xl,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 10,
  },
  logo: {
    fontSize: 50,
  },
  title: {
    fontSize: fontSize.display,
    fontWeight: fontWeight.heavy,
    color: colors.textLight,
    marginBottom: spacing.xs,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: fontSize.md,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  formContainer: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.xl,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.glassBorder,
    overflow: 'hidden',
  },
  formGlowLine: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 3,
    borderTopLeftRadius: borderRadius.xl,
    borderTopRightRadius: borderRadius.xl,
  },
  errorBox: {
    backgroundColor: colors.dangerGlow,
    padding: spacing.md,
    borderRadius: borderRadius.sm,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.danger,
  },
  errorText: {
    color: colors.danger,
    textAlign: 'center',
    fontSize: fontSize.sm,
    fontWeight: fontWeight.medium,
  },
  button: {
    marginTop: spacing.md,
  },
  switchContainer: {
    marginTop: spacing.lg,
    alignItems: 'center',
  },
  switchText: {
    color: colors.textSecondary,
    marginBottom: spacing.xs,
    fontSize: fontSize.sm,
  },
  switchButton: {
    backgroundColor: 'transparent',
    borderWidth: 0,
  },
});

export default LoginScreen;
