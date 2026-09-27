import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors, Typography, Radius, Spacing } from '../constants/theme';
import { ShopCertification } from '../types/vehicle';
import { CERTIFICATION_LABELS, CERTIFICATION_COLORS } from '../constants/app';

type StatusVariant = 'success' | 'warning' | 'danger' | 'info' | 'neutral';
type BadgeProps = {
  label: string;
  variant?: StatusVariant;
  small?: boolean;
};

const STATUS_COLORS: Record<StatusVariant, { bg: string; text: string }> = {
  success: { bg: Colors.successLight, text: Colors.success },
  warning: { bg: Colors.warningLight, text: Colors.warning },
  danger: { bg: Colors.dangerLight, text: Colors.danger },
  info: { bg: Colors.infoLight, text: Colors.info },
  neutral: { bg: Colors.surfaceAlt, text: Colors.textSecondary },
};

export function StatusBadge({ label, variant = 'neutral', small = false }: BadgeProps): JSX.Element {
  const c = STATUS_COLORS[variant];
  return (
    <View style={[styles.badge, { backgroundColor: c.bg }, small && styles.badgeSmall]}>
      <Text style={[styles.badgeText, { color: c.text }, small && styles.badgeTextSmall]}>
        {label}
      </Text>
    </View>
  );
}

// ─── Certification Badge ──────────────────────────────────────────────────────

type CertBadgeProps = {
  certification: ShopCertification;
  small?: boolean;
};

export function CertificationBadge({ certification, small = false }: CertBadgeProps): JSX.Element {
  const color = CERTIFICATION_COLORS[certification];
  const label = CERTIFICATION_LABELS[certification];

  return (
    <View style={[styles.certBadge, { backgroundColor: color }, small && styles.badgeSmall]}>
      <Text style={[styles.certBadgeText, small && styles.badgeTextSmall]}>
        {certification === 'ford_dealer' ? '★ ' : certification === 'ford_service_partner' ? '✓ ' : ''}{label}
      </Text>
    </View>
  );
}

// ─── Ford Verified Badge ──────────────────────────────────────────────────────

export function FordVerifiedBadge({ small = false }: { small?: boolean }): JSX.Element {
  return (
    <View style={[styles.fordBadge, small && styles.badgeSmall]}>
      <Text style={[styles.fordBadgeText, small && styles.badgeTextSmall]}>
        ✓ Verificado Ford
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 3,
    borderRadius: Radius.full,
    alignSelf: 'flex-start',
  },
  badgeSmall: {
    paddingHorizontal: Spacing.xs,
    paddingVertical: 2,
  },
  badgeText: {
    fontSize: Typography.xs,
    fontWeight: Typography.semibold,
  },
  badgeTextSmall: {
    fontSize: 10,
  },
  certBadge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 3,
    borderRadius: Radius.full,
    alignSelf: 'flex-start',
  },
  certBadgeText: {
    fontSize: Typography.xs,
    fontWeight: Typography.semibold,
    color: Colors.white,
  },
  fordBadge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 3,
    borderRadius: Radius.full,
    backgroundColor: Colors.fordBluePale,
    alignSelf: 'flex-start',
  },
  fordBadgeText: {
    fontSize: Typography.xs,
    fontWeight: Typography.semibold,
    color: Colors.fordBlue,
  },
});
