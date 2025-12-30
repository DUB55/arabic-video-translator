/**
 * Tab Container Component - Liquid Glass Design
 * Manages tabbed results display
 */

import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { TranscriptView } from './TranscriptView';
import { TranslationView } from './TranslationView';
import { DuaView } from './DuaView';
import { colors } from '../../styles/colors';
import { layout } from '../../styles/layout';
import { typography } from '../../styles/typography';

const TABS = [
  { id: 'arabic', label: 'Arabic Transcript' },
  { id: 'dutch', label: 'Dutch Translation' },
  { id: 'duas', label: 'Dua Extraction' },
];

export function TabContainer({ results, onCopy }) {
  const [activeTab, setActiveTab] = useState(TABS[0].id);

  const renderContent = () => {
    switch (activeTab) {
      case 'arabic':
        return (
          <TranscriptView 
            text={results?.arabicTranscript} 
            onCopy={onCopy}
          />
        );
      case 'dutch':
        return (
          <TranslationView 
            text={results?.dutchTranslation} 
            onCopy={onCopy}
          />
        );
      case 'duas':
        return (
          <DuaView 
            text={results?.duaResults} 
            onCopy={onCopy}
          />
        );
      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.tabBar}>
        {TABS.map((tab) => (
          <TouchableOpacity
            key={tab.id}
            style={[
              styles.tab,
              activeTab === tab.id && styles.tabActive,
            ]}
            onPress={() => setActiveTab(tab.id)}
            activeOpacity={0.7}
          >
            <Text style={[
              styles.tabText,
              activeTab === tab.id && styles.tabTextActive,
            ]}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      <View style={styles.content}>
        {renderContent()}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: colors.glassLight,
    borderRadius: layout.radius.lg,
    padding: layout.spacing.xs,
    marginBottom: layout.spacing.md,
    borderWidth: 1,
    borderColor: colors.glassBorder,
  },
  tab: {
    flex: 1,
    paddingVertical: layout.spacing.sm,
    paddingHorizontal: layout.spacing.xs,
    borderRadius: layout.radius.md,
    alignItems: 'center',
  },
  tabActive: {
    backgroundColor: colors.primary,
  },
  tabText: {
    ...typography.caption,
    color: colors.textTertiary,
    fontWeight: '500',
  },
  tabTextActive: {
    color: colors.text,
    fontWeight: '600',
  },
  content: {
    flex: 1,
  },
});
