/**
 * Processing Status Component - Liquid Glass Design
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { ProgressBar } from '../common/ProgressBar';
import { LoadingSpinner } from '../common/LoadingSpinner';
import { colors } from '../../styles/colors';
import { layout } from '../../styles/layout';
import { typography } from '../../styles/typography';

export function ProcessingStatus({ progress, currentStep }) {
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <LoadingSpinner message={currentStep} />
        <View style={styles.progressContainer}>
          <ProgressBar progress={progress} showPercentage={true} />
        </View>
        <Text style={styles.hint}>
          Please wait while we process your video...
        </Text>
      </View>
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
  content: {
    width: '100%',
    maxWidth: 400,
    alignItems: 'center',
  },
  progressContainer: {
    width: '100%',
    marginTop: layout.spacing.xl,
  },
  hint: {
    ...typography.bodySmall,
    color: colors.textTertiary,
    marginTop: layout.spacing.lg,
    textAlign: 'center',
  },
});
