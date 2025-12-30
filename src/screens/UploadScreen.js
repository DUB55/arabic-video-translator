/**
 * Upload Screen - Liquid Glass Design
 * Step 1: Video file selection
 */

import React from 'react';
import { View, Text, StyleSheet, ScrollView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { TextInput } from 'react-native';
import { Button } from '../components/common/Button';
import { useEffect, useState } from 'react';
import { validateInstagramUrl, validateSupportedUrl } from '../utils/validators';
import { useShareUrl } from '../hooks/useShareUrl';
import { useClipboardUrl } from '../hooks/useClipboardUrl';
import { colors } from '../styles/colors';
import { layout } from '../styles/layout';
import { typography } from '../styles/typography';
import { globalStyles } from '../styles/globalStyles';

export function UploadScreen({ navigation }) {
  const [reelUrl, setReelUrl] = useState('');
  const [error, setError] = useState(null);
  const { sharedUrl, clearSharedUrl } = useShareUrl();
  const { clipboardUrl, platform, clearClipboardUrl, readClipboardNow } = useClipboardUrl();

  const handleContinue = () => {
    const { valid, error: err } = validateInstagramUrl(reelUrl);
    if (!valid) {
      setError(err);
      return;
    }
    navigation.navigate('Configure', { reelUrl });
  };

  useEffect(() => {
    if (sharedUrl) {
      setReelUrl(sharedUrl);
      setError(null);
      clearSharedUrl();
      handleContinue();
    }
  }, [sharedUrl]);

  useEffect(() => {
    if (clipboardUrl && !reelUrl) {
      setReelUrl(clipboardUrl);
      setError(null);
      if (platform === 'instagram') {
        clearClipboardUrl();
        handleContinue();
      }
    }
  }, [clipboardUrl, platform]);

  const detected = validateSupportedUrl(reelUrl);

  return (
    <SafeAreaView style={globalStyles.safeArea} edges={['top']}>
      <ScrollView 
        style={globalStyles.container}
        contentContainerStyle={{...styles.content, paddingBottom: 100}}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.title}>Instagram Reel Transcription</Text>
          <Text style={styles.description}>
            Paste a public Instagram Reel URL to transcribe and translate
          </Text>
        </View>

        <View style={styles.inputCard}>
          <Text style={styles.inputLabel}>Reel URL</Text>
          <TextInput
            style={styles.input}
            placeholder="https://www.instagram.com/reel/XXXXX/"
            value={reelUrl}
            onChangeText={(t) => {
              setError(null);
              setReelUrl(t);
            }}
            autoCapitalize="none"
            autoCorrect={false}
          />
          {error && (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          )}
          {reelUrl ? (
            <View style={styles.banner}>
              <Text style={styles.bannerText}>
                {detected.valid ? `Detected: ${detected.platform}` : 'Unsupported URL'}
                {detected.valid && detected.platform === 'instagram' ? ' • Auto-start' : ' • Press Continue'}
              </Text>
            </View>
          ) : null}
          <Button
            title="Continue to Configuration"
            onPress={handleContinue}
            variant="primary"
            size="large"
            style={styles.continueButton}
          />
          {Platform.OS === 'web' && (
            <Button
              title="Paste from Clipboard"
              onPress={readClipboardNow}
              variant="secondary"
              size="medium"
              style={{ marginTop: layout.spacing.md }}
            />
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  content: {
    padding: layout.screenPadding.horizontal,
    paddingTop: layout.spacing.xl,
    paddingBottom: layout.spacing.xxl,
  },
  header: {
    marginBottom: layout.spacing.xl,
  },
  title: {
    ...typography.h1,
    marginBottom: layout.spacing.sm,
  },
  description: {
    ...typography.body,
    color: colors.textSecondary,
    lineHeight: 24,
  },
  continueButton: {
    marginTop: layout.spacing.xl,
  },
  inputCard: {
    marginTop: layout.spacing.xl,
    backgroundColor: colors.glassLight,
    borderRadius: layout.radius.lg,
    padding: layout.spacing.lg,
    borderWidth: 1,
    borderColor: colors.glassBorder,
  },
  inputLabel: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    marginBottom: layout.spacing.sm,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.glassBorder,
    borderRadius: layout.radius.md,
    padding: layout.spacing.md,
    color: colors.text,
    backgroundColor: colors.glass,
  },
  errorContainer: {
    marginTop: layout.spacing.md,
    padding: layout.spacing.md,
    backgroundColor: colors.error + '20',
    borderRadius: layout.radius.md,
    borderWidth: 1,
    borderColor: colors.error,
  },
  errorText: {
    ...typography.bodySmall,
    color: colors.error,
  },
  banner: {
    marginTop: layout.spacing.md,
    padding: layout.spacing.md,
    backgroundColor: colors.glassLight,
    borderRadius: layout.radius.md,
    borderWidth: 1,
    borderColor: colors.glassBorder,
  },
  bannerText: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    fontWeight: '600',
  },
});
