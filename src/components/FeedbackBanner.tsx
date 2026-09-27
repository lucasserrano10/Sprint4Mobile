import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Colors, Typography, Radius, Spacing } from '../constants/theme';

type Props = {
  message: string;
  onDismiss?: () => void;
  variant?: 'error' | 'warning' | 'success' | 'info';
};

const VARIANT_STYLES = {
  error: { bg: Colors.dangerLight, text: Colors.danger, border: '#FECACA' },
  warning: { bg: Colors.warningLight, text: Colors.warning, border: '#FDE68A' },
  success: { bg: Colors.successLight, text: Colors.success, border: '#BBF7D0' },
  info: { bg: Colors.infoLight, text: Colors.info, border: '#BAE6FD' },
};

const VARIANT_ICONS = {
  error: '✕',
  warning: '⚠',
  success: '✓',
  info: 'ℹ',
};

export function FeedbackBanner({ message, onDismiss, variant = 'error' }: Props): JSX.Element {
  const vs = VARIANT_STYLES[variant];
  const icon = VARIANT_ICONS[variant];

  return (
    <View style={[styles.container, { backgroundColor: vs.bg, borderColor: vs.border }]}>
      <Text style={[styles.icon, { color: vs.text }]}>{icon}</Text>
      <Text style={[styles.message, { color: vs.text }]}>{message}</Text>
      {onDismiss && (
        <TouchableOpacity onPress={onDismiss} style={styles.dismiss} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
          <Text style={[styles.dismissText, { color: vs.text }]}>×</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: Spacing.base,
    marginVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: Radius.md,
    borderWidth: 1,
    gap: Spacing.sm,
  },
  icon: {
    fontSize: Typography.sm,
    fontWeight: Typography.bold,
  },
  message: {
    flex: 1,
    fontSize: Typography.sm,
    fontWeight: Typography.medium,
    lineHeight: Typography.sm * Typography.normal,
  },
  dismiss: {
    padding: 2,
  },
  dismissText: {
    fontSize: Typography.xl,
    fontWeight: Typography.bold,
    lineHeight: Typography.xl,
  },
});
