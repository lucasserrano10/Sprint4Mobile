import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform, StatusBar } from 'react-native';
import { Colors, Typography, Spacing, Shadows } from '../constants/theme';

type Props = {
  title: string;
  subtitle?: string;
  onBack?: () => void;
  rightAction?: {
    icon: string;
    label?: string;
    onPress: () => void;
  };
  variant?: 'default' | 'ford';
};

export function ScreenHeader({ title, subtitle, onBack, rightAction, variant = 'default' }: Props): JSX.Element {
  const isFord = variant === 'ford';

  return (
    <View style={[styles.container, isFord && styles.containerFord]}>
      <View style={styles.row}>
        {onBack && (
          <TouchableOpacity onPress={onBack} style={styles.backButton} activeOpacity={0.7} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
            <Text style={[styles.backIcon, isFord && styles.backIconFord]}>‹</Text>
          </TouchableOpacity>
        )}

        <View style={styles.titleContainer}>
          <Text style={[styles.title, isFord && styles.titleFord]} numberOfLines={1}>
            {title}
          </Text>
          {subtitle && (
            <Text style={[styles.subtitle, isFord && styles.subtitleFord]} numberOfLines={1}>
              {subtitle}
            </Text>
          )}
        </View>

        {rightAction ? (
          <TouchableOpacity onPress={rightAction.onPress} style={styles.rightButton} activeOpacity={0.7}>
            {rightAction.label ? (
              <Text style={[styles.rightLabel, isFord && styles.rightLabelFord]}>
                {rightAction.label}
              </Text>
            ) : (
              <Text style={[styles.rightIcon, isFord && styles.rightIconFord]}>
                {rightAction.icon}
              </Text>
            )}
          </TouchableOpacity>
        ) : (
          <View style={styles.spacer} />
        )}
      </View>
    </View>
  );
}

const STATUSBAR_HEIGHT = Platform.OS === 'android' ? StatusBar.currentHeight ?? 0 : 0;

const styles = StyleSheet.create({
  container: {
    paddingTop: STATUSBAR_HEIGHT + Spacing.sm,
    paddingBottom: Spacing.md,
    paddingHorizontal: Spacing.base,
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
    ...Shadows.sm,
  },
  containerFord: {
    backgroundColor: Colors.fordBlue,
    borderBottomColor: Colors.fordBlueMid,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    marginRight: Spacing.sm,
    padding: 4,
  },
  backIcon: {
    fontSize: 28,
    color: Colors.fordBlueLight,
    fontWeight: Typography.bold,
    lineHeight: 30,
  },
  backIconFord: {
    color: Colors.white,
  },
  titleContainer: {
    flex: 1,
  },
  title: {
    fontSize: Typography.md,
    fontWeight: Typography.bold,
    color: Colors.textPrimary,
  },
  titleFord: {
    color: Colors.white,
  },
  subtitle: {
    fontSize: Typography.xs,
    color: Colors.textMuted,
    marginTop: 1,
  },
  subtitleFord: {
    color: 'rgba(255,255,255,0.7)',
  },
  rightButton: {
    padding: 4,
  },
  rightLabel: {
    fontSize: Typography.sm,
    fontWeight: Typography.semibold,
    color: Colors.fordBlueLight,
  },
  rightLabelFord: {
    color: Colors.white,
  },
  rightIcon: {
    fontSize: Typography.lg,
  },
  rightIconFord: {
    color: Colors.white,
  },
  spacer: {
    width: 36,
  },
});
