import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../hooks/useAuth';
import { Loading } from '../components/Loading';
import { FeedbackBanner } from '../components/FeedbackBanner';
import { Button } from '../components/Button';
import { Colors, Typography, Spacing, Radius, Shadows } from '../constants/theme';

type Mode = 'login' | 'register';

export function LoginScreen(): JSX.Element {
  const { loading, error, handleLoginEmail, handleRegister, handleLoginGoogle, handleLoginApple, clearError } =
    useAuth();

  const [mode, setMode] = useState<Mode>('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = useCallback(async () => {
    if (mode === 'login') {
      await handleLoginEmail(email.trim(), password);
    } else {
      await handleRegister(name.trim(), email.trim(), password);
    }
  }, [mode, name, email, password, handleLoginEmail, handleRegister]);

  const toggleMode = useCallback(() => {
    clearError();
    setName('');
    setEmail('');
    setPassword('');
    setMode((p) => (p === 'login' ? 'register' : 'login'));
  }, [clearError]);

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Header Ford */}
        <View style={styles.heroSection}>
          <View style={styles.logoRow}>
            <Text style={styles.logoFord}>FORD</Text>
            <View style={styles.logoDivider} />
            <Text style={styles.logoNexus}>NEXUS</Text>
          </View>
          <Text style={styles.heroTagline}>
            {mode === 'login'
              ? 'Seu veículo em boas mãos,\nonde você estiver.'
              : 'Crie sua conta e mantenha\nseu Ford sempre revisado.'}
          </Text>
        </View>

        {/* Form Card */}
        <View style={styles.formCard}>
          <Text style={styles.formTitle}>
            {mode === 'login' ? 'Entrar na conta' : 'Criar conta'}
          </Text>

          {error && (
            <FeedbackBanner message={error} onDismiss={clearError} variant="error" />
          )}

          <View style={styles.fields}>
            {mode === 'register' && (
              <View style={styles.inputWrapper}>
                <Text style={styles.inputLabel}>Nome completo</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Seu nome"
                  placeholderTextColor={Colors.textMuted}
                  value={name}
                  onChangeText={setName}
                  autoCapitalize="words"
                  editable={!loading}
                />
              </View>
            )}

            <View style={styles.inputWrapper}>
              <Text style={styles.inputLabel}>E-mail</Text>
              <TextInput
                style={styles.input}
                placeholder="seu@email.com"
                placeholderTextColor={Colors.textMuted}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                editable={!loading}
              />
            </View>

            <View style={styles.inputWrapper}>
              <Text style={styles.inputLabel}>Senha</Text>
              <View style={styles.passwordContainer}>
                <TextInput
                  style={[styles.input, styles.passwordInput]}
                  placeholder="Mínimo 6 caracteres"
                  placeholderTextColor={Colors.textMuted}
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                  editable={!loading}
                />
                <TouchableOpacity
                  onPress={() => setShowPassword((p) => !p)}
                  style={styles.eyeButton}
                  hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                >
                  <Text style={styles.eyeIcon}>{showPassword ? '🙈' : '👁'}</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>

          <Button
            label={mode === 'login' ? 'Entrar' : 'Criar conta'}
            onPress={handleSubmit}
            loading={loading}
            disabled={loading}
            fullWidth
            size="lg"
          />

          <TouchableOpacity onPress={toggleMode} style={styles.toggleButton} disabled={loading}>
            <Text style={styles.toggleText}>
              {mode === 'login'
                ? 'Não tem conta? '
                : 'Já tem conta? '}
              <Text style={styles.toggleLink}>
                {mode === 'login' ? 'Cadastre-se' : 'Entrar'}
              </Text>
            </Text>
          </TouchableOpacity>

          {/* Divider */}
          <View style={styles.dividerRow}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerLabel}>ou continue com</Text>
            <View style={styles.dividerLine} />
          </View>

          {/* Social Buttons */}
          <View style={styles.socialButtons}>
            <TouchableOpacity
              style={styles.socialButton}
              onPress={handleLoginGoogle}
              disabled={loading}
              activeOpacity={0.8}
            >
              <Text style={styles.socialIcon}>🔵</Text>
              <Text style={styles.socialLabel}>Google</Text>
            </TouchableOpacity>

            {Platform.OS === 'ios' && (
              <TouchableOpacity
                style={[styles.socialButton, styles.appleButton]}
                onPress={handleLoginApple}
                disabled={loading}
                activeOpacity={0.8}
              >
                <Text style={styles.socialIcon}></Text>
                <Text style={[styles.socialLabel, styles.appleLabel]}>Apple</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        <Text style={styles.footer}>
          Ford Nexus · Rede de Manutenção Autorizada
        </Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
    backgroundColor: Colors.fordBlue,
  },
  scroll: {
    flexGrow: 1,
  },
  heroSection: {
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.xxxl + 16,
    paddingBottom: Spacing.xxl,
    backgroundColor: Colors.fordBlue,
  },
  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.xl,
    gap: Spacing.md,
  },
  logoFord: {
    fontSize: Typography.xxxl,
    fontWeight: Typography.extrabold,
    color: Colors.white,
    letterSpacing: 6,
  },
  logoDivider: {
    width: 2,
    height: 32,
    backgroundColor: 'rgba(255,255,255,0.4)',
    borderRadius: 1,
  },
  logoNexus: {
    fontSize: Typography.md,
    fontWeight: Typography.medium,
    color: '#A0B4CC',
    letterSpacing: 4,
  },
  heroTagline: {
    fontSize: Typography.lg,
    color: 'rgba(255,255,255,0.85)',
    lineHeight: Typography.lg * Typography.normal,
    fontWeight: Typography.medium,
  },
  formCard: {
    flex: 1,
    backgroundColor: Colors.white,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.xxl,
    paddingBottom: Spacing.xxxl,
    minHeight: 500,
  },
  formTitle: {
    fontSize: Typography.xl,
    fontWeight: Typography.bold,
    color: Colors.textPrimary,
    marginBottom: Spacing.lg,
  },
  fields: {
    gap: Spacing.md,
    marginBottom: Spacing.xl,
  },
  inputWrapper: {
    gap: Spacing.xs,
  },
  inputLabel: {
    fontSize: Typography.sm,
    fontWeight: Typography.semibold,
    color: Colors.textSecondary,
  },
  input: {
    height: 50,
    borderWidth: 1.5,
    borderColor: Colors.border,
    borderRadius: Radius.md,
    paddingHorizontal: Spacing.base,
    fontSize: Typography.base,
    color: Colors.textPrimary,
    backgroundColor: Colors.surfaceAlt,
  },
  passwordContainer: {
    position: 'relative',
  },
  passwordInput: {
    paddingRight: 52,
  },
  eyeButton: {
    position: 'absolute',
    right: Spacing.base,
    top: 0,
    bottom: 0,
    justifyContent: 'center',
  },
  eyeIcon: {
    fontSize: 18,
  },
  toggleButton: {
    alignItems: 'center',
    paddingVertical: Spacing.md,
  },
  toggleText: {
    fontSize: Typography.sm,
    color: Colors.textSecondary,
  },
  toggleLink: {
    color: Colors.fordBlueLight,
    fontWeight: Typography.semibold,
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: Spacing.base,
    gap: Spacing.sm,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: Colors.border,
  },
  dividerLabel: {
    fontSize: Typography.xs,
    color: Colors.textMuted,
  },
  socialButtons: {
    flexDirection: 'row',
    gap: Spacing.md,
    marginTop: Spacing.sm,
  },
  socialButton: {
    flex: 1,
    height: 48,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    borderRadius: Radius.md,
    borderWidth: 1.5,
    borderColor: Colors.border,
    backgroundColor: Colors.white,
    ...Shadows.sm,
  },
  appleButton: {
    backgroundColor: Colors.textPrimary,
    borderColor: Colors.textPrimary,
  },
  socialIcon: {
    fontSize: 18,
  },
  socialLabel: {
    fontSize: Typography.sm,
    fontWeight: Typography.semibold,
    color: Colors.textPrimary,
  },
  appleLabel: {
    color: Colors.white,
  },
  footer: {
    textAlign: 'center',
    fontSize: Typography.xs,
    color: 'rgba(255,255,255,0.5)',
    backgroundColor: Colors.fordBlue,
    paddingVertical: Spacing.base,
  },
});
