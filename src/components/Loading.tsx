import React from 'react';
import { View, ActivityIndicator, StyleSheet, Text } from 'react-native';
import { Colors, Typography } from '../constants/theme';

type Props = {
  fullScreen?: boolean;
  label?: string;
  color?: string;
};

export function Loading({ fullScreen = false, label, color = Colors.fordBlueLight }: Props): JSX.Element {
  if (fullScreen) {
    return (
      <View style={styles.fullScreen}>
        <View style={styles.logoContainer}>
          <Text style={styles.logoText}>FORD</Text>
          <Text style={styles.nexusText}>NEXUS</Text>
        </View>
        <ActivityIndicator size="large" color={Colors.white} style={styles.spinner} />
        {label && <Text style={styles.labelWhite}>{label}</Text>}
      </View>
    );
  }

  return (
    <View style={styles.inline}>
      <ActivityIndicator size="small" color={color} />
      {label && <Text style={[styles.label, { color }]}>{label}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  fullScreen: {
    flex: 1,
    backgroundColor: Colors.fordBlue,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  logoText: {
    fontSize: Typography.display,
    fontWeight: Typography.extrabold,
    color: Colors.white,
    letterSpacing: 8,
  },
  nexusText: {
    fontSize: Typography.md,
    fontWeight: Typography.medium,
    color: '#A0B4CC',
    letterSpacing: 6,
    marginTop: 4,
  },
  spinner: {
    marginBottom: 12,
  },
  labelWhite: {
    color: Colors.white,
    fontSize: Typography.sm,
    marginTop: 8,
    opacity: 0.8,
  },
  inline: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    gap: 8,
  },
  label: {
    fontSize: Typography.sm,
    fontWeight: Typography.medium,
  },
});
