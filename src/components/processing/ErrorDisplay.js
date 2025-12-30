/**
 * Error Display Component - Liquid Glass Design
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Button } from '../common/Button';
import { StatusIndicator } from '../common/StatusIndicator';
import { colors } from '../../styles/colors';
import { layout } from '../../styles/layout';

export function ErrorDisplay({ error, onRetry, onCancel }) {
  if (!error) return null;

  return (
    <View style={styles.container}>
      <StatusIndicator type="error" message={error} />
      
      <View style={styles.buttonContainer}>
        {onRetry && (
          <Button
            title="Retry"
            onPress={onRetry}
            variant="primary"
            style={styles.button}
          />
        )}
        {onCancel && (
          <Button
            title="Cancel"
            onPress={onCancel}
            variant="secondary"
            style={styles.button}
          />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    padding: layout.spacing.lg,
  },
  buttonContainer: {
    flexDirection: 'row',
    marginTop: layout.spacing.md,
    gap: layout.spacing.md,
  },
  button: {
    flex: 1,
  },
});
