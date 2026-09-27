import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { Colors, Typography, Radius, Spacing, Shadows } from '../constants/theme';

type Props = {
  children: React.ReactNode;
  style?: object;
  onPress?: () => void;
  padding?: 'sm' | 'md' | 'lg';
};

export function Card({ children, style, onPress, padding = 'md' }: Props): JSX.Element {
  const paddingStyle = {
    sm: styles.paddingSm,
    md: styles.paddingMd,
    lg: styles.paddingLg,
  }[padding];

  if (onPress) {
    return (
      <TouchableOpacity
        style={[styles.card, paddingStyle, style]}
        onPress={onPress}
        activeOpacity={0.75}
      >
        {children}
      </TouchableOpacity>
    );
  }

  return <View style={[styles.card, paddingStyle, style]}>{children}</View>;
}

// ─── Section Header ───────────────────────────────────────────────────────────

type SectionHeaderProps = {
  title: string;
  action?: { label: string; onPress: () => void };
};

export function SectionHeader({ title, action }: SectionHeaderProps): JSX.Element {
  return (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {action && (
        <TouchableOpacity onPress={action.onPress} activeOpacity={0.7}>
          <Text style={styles.sectionAction}>{action.label}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

// ─── Info Row ─────────────────────────────────────────────────────────────────

type InfoRowProps = {
  label: string;
  value: string;
  accent?: boolean;
};

export function InfoRow({ label, value, accent = false }: InfoRowProps): JSX.Element {
  return (
    <View style={styles.infoRow}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={[styles.infoValue, accent && styles.infoValueAccent]}>{value}</Text>
    </View>
  );
}

// ─── Divider ─────────────────────────────────────────────────────────────────

export function Divider({ margin = 'base' }: { margin?: 'sm' | 'base' | 'lg' }): JSX.Element {
  const marginVal = { sm: Spacing.sm, base: Spacing.base, lg: Spacing.xl }[margin];
  return <View style={[styles.divider, { marginVertical: marginVal }]} />;
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    ...Shadows.sm,
  },
  paddingSm: { padding: Spacing.sm },
  paddingMd: { padding: Spacing.base },
  paddingLg: { padding: Spacing.xl },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.sm,
  },
  sectionTitle: {
    fontSize: Typography.base,
    fontWeight: Typography.bold,
    color: Colors.textPrimary,
  },
  sectionAction: {
    fontSize: Typography.sm,
    fontWeight: Typography.semibold,
    color: Colors.fordBlueLight,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing.xs,
  },
  infoLabel: {
    fontSize: Typography.sm,
    color: Colors.textMuted,
    flex: 1,
  },
  infoValue: {
    fontSize: Typography.sm,
    fontWeight: Typography.semibold,
    color: Colors.textPrimary,
    textAlign: 'right',
  },
  infoValueAccent: {
    color: Colors.fordBlueLight,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.borderLight,
  },
});
