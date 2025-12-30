/**
 * Loading Spinner Component with Liquid Glass Effect
 */

import React from 'react';
import { View, ActivityIndicator, Text, StyleSheet } from 'react-native';
import { colors } from '../../styles/colors';
import { layout } from '../../styles/layout';
import { typography } from '../../styles/typography';

export function LoadingSpinner({ message, size = 'large', color = colors.primary }) {
  return (
    <View style={styles.container}>
      <View style={styles.spinnerContainer}>
        <ActivityIndicator size={size} color={color} />
      </View>
      {message && <Text style={styles.message}>{message}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: layout.spacing.xl,
  },
  spinnerContainer: {
    width: 64,
    height: 64,
    borderRadius: layout.radius.xl,
    backgroundColor: colors.glassLight,
    borderWidth: 1,
    borderColor: colors.glassBorder,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: layout.spacing.md,
  },
  message: {
    ...typography.body,
    marginTop: layout.spacing.md,
    color: colors.textSecondary,
    textAlign: 'center',
    fontWeight: '500',
  },
});
