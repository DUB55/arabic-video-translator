/**
 * Processing Screen - Liquid Glass Design
 * Step 3: Video processing with progress
 */

import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ProcessingStatus } from '../components/processing/ProcessingStatus';
import { StepIndicator } from '../components/processing/StepIndicator';
import { ErrorDisplay } from '../components/processing/ErrorDisplay';
import { Button } from '../components/common/Button';
import { useProcessing } from '../hooks/useProcessing';
import { colors } from '../styles/colors';
import { layout } from '../styles/layout';
import { typography } from '../styles/typography';
import { globalStyles } from '../styles/globalStyles';

const PROCESSING_STEPS = [
  'Upload',
  'Configure',
  'Processing',
  'Results',
];

export function ProcessingScreen({ route, navigation }) {
  const { reelUrl, duaEnabled } = route.params || {};
  const {
    processing,
    progress,
    currentStep,
    error,
    results,
    processVideo,
    cancelProcessing,
    reset,
  } = useProcessing();

  useEffect(() => {
    if (reelUrl) {
      processVideo(reelUrl, duaEnabled)
        .then((processedResults) => {
          if (processedResults) {
            navigation.replace('Results', { results: processedResults });
          }
        })
        .catch((err) => {
          console.error('Processing error:', err);
        });
    } else {
      navigation.goBack();
    }

    return () => {
      reset();
    };
  }, []);

  const handleCancel = () => {
    cancelProcessing();
    navigation.goBack();
  };

  const handleRetry = () => {
    reset();
    if (reelUrl) {
      processVideo(reelUrl, duaEnabled)
        .then((processedResults) => {
          if (processedResults) {
            navigation.replace('Results', { results: processedResults });
          }
        })
        .catch((err) => {
          console.error('Processing error:', err);
        });
    }
  };

  return (
    <SafeAreaView style={globalStyles.safeArea} edges={['top']}>
      <View style={{ ...globalStyles.container, paddingBottom: 100 }}>
        <View style={styles.header}>
          <Text style={styles.title}>Processing</Text>
          <Text style={styles.subtitle}>
            Your video is being processed
          </Text>
        </View>

        <StepIndicator steps={PROCESSING_STEPS} currentStep={2} />

        {error ? (
          <ErrorDisplay
            error={error}
            onRetry={handleRetry}
            onCancel={handleCancel}
          />
        ) : (
          <ProcessingStatus progress={progress} currentStep={currentStep} />
        )}

        {!error && processing && (
          <View style={styles.cancelContainer}>
            <Button
              title="Cancel Processing"
              onPress={handleCancel}
              variant="secondary"
              size="medium"
            />
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: layout.screenPadding.horizontal,
    paddingTop: layout.spacing.lg,
    marginBottom: layout.spacing.md,
  },
  title: {
    ...typography.h1,
    marginBottom: layout.spacing.xs,
  },
  subtitle: {
    ...typography.body,
    color: colors.textSecondary,
  },
  cancelContainer: {
    paddingHorizontal: layout.screenPadding.horizontal,
    paddingBottom: layout.spacing.xl,
  },
});
