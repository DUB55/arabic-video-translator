/**
 * Results Screen - Liquid Glass Design
 * Step 4: Display results in tabs
 */

import React from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { TabContainer } from '../components/results/TabContainer';
import { Button } from '../components/common/Button';
import { useResults } from '../hooks/useResults';
import { colors } from '../styles/colors';
import { layout } from '../styles/layout';
import { typography } from '../styles/typography';
import { globalStyles } from '../styles/globalStyles';

export function ResultsScreen({ route, navigation }) {
  const { results } = route.params || {};
  const { copyToClipboard, shareText, saveResults, formatResultsForSave } = useResults();

  const handleCopy = async (text) => {
    const success = await copyToClipboard(text);
    if (success) {
      Alert.alert('Copied', 'Text copied to clipboard');
    } else {
      Alert.alert('Error', 'Failed to copy text');
    }
  };

  const handleShare = async () => {
    const formattedText = formatResultsForSave(results);
    const success = await shareText(formattedText);
    if (!success) {
      Alert.alert('Error', 'Failed to share results');
    }
  };

  const handleSave = async () => {
    const fileUri = await saveResults(results);
    if (fileUri) {
      Alert.alert('Saved', 'Results saved successfully');
    } else {
      Alert.alert('Error', 'Failed to save results');
    }
  };

  const handleNewVideo = () => {
    navigation.reset({
      index: 0,
      routes: [{ name: 'Upload' }],
    });
  };

  if (!results) {
    return (
      <SafeAreaView style={globalStyles.safeArea} edges={['top']}>
        <View style={styles.emptyContainer}>
          <Ionicons name="document-text-outline" size={64} color={colors.textTertiary} />
          <Text style={styles.emptyText}>No results available</Text>
          <Button
            title="Process New Video"
            onPress={handleNewVideo}
            variant="primary"
            style={styles.button}
          />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={globalStyles.safeArea} edges={['top']}>
      <View style={{ ...globalStyles.container, paddingBottom: 100 }}>
        <View style={styles.header}>
          <Text style={styles.title}>Results</Text>
          <Text style={styles.subtitle}>
            Your transcription and translation
          </Text>
        </View>

        <View style={styles.actionButtons}>
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={handleShare}
            activeOpacity={0.7}
          >
            <Ionicons name="share-outline" size={20} color={colors.primary} />
            <Text style={styles.actionButtonText}>Share</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={handleSave}
            activeOpacity={0.7}
          >
            <Ionicons name="download-outline" size={20} color={colors.primary} />
            <Text style={styles.actionButtonText}>Save</Text>
          </TouchableOpacity>
        </View>

        <View style={[styles.tabContainer, { paddingBottom: 40 }]}>
          <TabContainer results={results} onCopy={handleCopy} />
        </View>

        <View style={styles.footer}>
          <Button
            title="Process Another Video"
            onPress={handleNewVideo}
            variant="primary"
            size="large"
          />
        </View>
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
  actionButtons: {
    flexDirection: 'row',
    paddingHorizontal: layout.screenPadding.horizontal,
    marginBottom: layout.spacing.md,
    gap: layout.spacing.md,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.glassLight,
    borderRadius: layout.radius.lg,
    padding: layout.spacing.md,
    borderWidth: 1,
    borderColor: colors.glassBorder,
  },
  actionButtonText: {
    ...typography.bodySmall,
    color: colors.primary,
    marginLeft: layout.spacing.xs,
    fontWeight: '600',
  },
  tabContainer: {
    flex: 1,
    paddingHorizontal: layout.screenPadding.horizontal,
    marginBottom: layout.spacing.md,
  },
  footer: {
    paddingHorizontal: layout.screenPadding.horizontal,
    paddingBottom: layout.spacing.xl,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: layout.spacing.xxl,
  },
  emptyText: {
    ...typography.h3,
    color: colors.textSecondary,
    marginTop: layout.spacing.lg,
    marginBottom: layout.spacing.xl,
  },
  button: {
    marginTop: layout.spacing.lg,
  },
});
