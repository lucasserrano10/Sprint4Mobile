import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Colors, Typography, Radius, Spacing, Shadows } from '../constants/theme';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
type ButtonSize = 'sm' | 'md' | 'lg';

type Props = {
  label: string;
  onPress: () => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
  loading?: boolean;
  icon?: string;
  fullWidth?: boolean;
};

const VARIANT_STYLES: Record<ButtonVariant, { container: object; text: object }> = {
  primary: {
    container: { backgroundColor: Colors.fordBlue },
    text: { color: Colors.white },
  },
  secondary: {
    container: { backgroundColor: Colors.fordBlueLight },
    text: { color: Colors.white },
  },
  outline: {
    container: { backgroundColor: 'transparent', borderWidth: 1.5, borderColor: Colors.fordBlue },
    text: { color: Colors.fordBlue },
  },
  ghost: {
    container: { backgroundColor: Colors.fordBluePale },
    text: { color: Colors.fordBlue },
  },
  danger: {
    container: { backgroundColor: Colors.danger },
    text: { color: Colors.white },
  },
};

const SIZE_STYLES: Record<ButtonSize, { container: object; text: object }> = {
  sm: {
    container: { height: 36, paddingHorizontal: Spacing.md, borderRadius: Radius.md },
    text: { fontSize: Typography.sm },
  },
  md: {
    container: { height: 48, paddingHorizontal: Spacing.xl, borderRadius: Radius.lg },
    text: { fontSize: Typography.base },
  },
  lg: {
    container: { height: 56, paddingHorizontal: Spacing.xxl, borderRadius: Radius.lg },
    text: { fontSize: Typography.md },
  },
};

export function Button({ label, onPress, variant = 'primary', size = 'md', disabled = false, loading = false, icon, fullWidth = false }: Props): JSX.Element {
  const vs = VARIANT_STYLES[variant];
  const ss = SIZE_STYLES[size];

  return (
    <TouchableOpacity
      style={[
        styles.base,
        vs.container,
        ss.container,
        fullWidth && styles.fullWidth,
        (disabled || loading) && styles.disabled,
      ]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
    >
      {icon && !loading && <Text style={[styles.icon, vs.text]}>{icon}</Text>}
      {loading ? (
        <Text style={[styles.text, vs.text, ss.text]}>Aguarde...</Text>
      ) : (
        <Text style={[styles.text, vs.text, ss.text]}>{label}</Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    ...Shadows.sm,
  },
  fullWidth: {
    width: '100%',
  },
  disabled: {
    opacity: 0.5,
  },
  text: {
    fontWeight: Typography.semibold,
  },
  icon: {
    fontSize: Typography.md,
  },
});
