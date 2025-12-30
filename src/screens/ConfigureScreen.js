/**
 * Configure Screen - Liquid Glass Design
 * Step 2: Model selection and feature toggles
 */

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FeatureToggle } from '../components/configuration/FeatureToggle';
import { SettingsCard } from '../components/configuration/SettingsCard';
import { Button } from '../components/common/Button';
import { loadDuaEnabled, saveDuaEnabled } from '../utils/storage';
import { colors } from '../styles/colors';
import { layout } from '../styles/layout';
import { typography } from '../styles/typography';
import { globalStyles } from '../styles/globalStyles';

export function ConfigureScreen({ route, navigation }) {
  const { reelUrl } = route.params || {};
  const [duaEnabled, setDuaEnabled] = useState(true);

  useEffect(() => {
    const loadPreferences = async () => {
      const savedDuaEnabled = await loadDuaEnabled();
      setDuaEnabled(savedDuaEnabled);
    };
    loadPreferences();
  }, []);

  const handleDuaToggle = async (value) => {
    setDuaEnabled(value);
    await saveDuaEnabled(value);
  };

  const handleContinue = () => {
    if (reelUrl) {
      navigation.navigate('Processing', {
        reelUrl,
        duaEnabled,
      });
    }
  };

  if (!reelUrl) {
    navigation.goBack();
    return null;
  }

  return (
    <SafeAreaView style={globalStyles.safeArea} edges={['top']}>
      <ScrollView 
        style={globalStyles.container}
        contentContainerStyle={{...styles.content, paddingBottom: 100}}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.title}>Configuration</Text>
          <Text style={styles.description}>
            Choose your processing options
          </Text>
        </View>

        <SettingsCard>
          <FeatureToggle
            label="Extract Duas"
            description="Identify and extract Islamic prayers and supplications from the content"
            value={duaEnabled}
            onValueChange={handleDuaToggle}
          />
        </SettingsCard>

        <Button
          title="Start Processing"
          onPress={handleContinue}
          variant="primary"
          size="large"
          style={styles.processButton}
          disabled={false}
        />
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
  processButton: {
    marginTop: layout.spacing.lg,
  },
});
