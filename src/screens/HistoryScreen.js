/**
 * History Screen - Liquid Glass Design
 * Displays all saved transcription results
 */

import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { loadResultsHistory } from '../utils/storage';
import { colors } from '../styles/colors';
import { layout } from '../styles/layout';
import { typography } from '../styles/typography';
import { globalStyles } from '../styles/globalStyles';

export function HistoryScreen({ isFocused }) {
  const [items, setItems] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const loadHistory = React.useCallback(async () => {
    const history = await loadResultsHistory();
    setItems(history);
  }, []);

  useEffect(() => {
    loadHistory();
  }, []);

  useEffect(() => {
    if (isFocused) {
      loadHistory();
    }
  }, [isFocused, loadHistory]);

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    await loadHistory();
    setRefreshing(false);
  }, [loadHistory]);

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={styles.iconContainer}>
          <Ionicons name="document-text" size={20} color={colors.primary} />
        </View>
        <View style={styles.cardHeaderText}>
          <Text style={styles.cardTitle} numberOfLines={2}>
            {item.dutchTranslation?.slice(0, 80) || 'Transcription Result'}
          </Text>
          <Text style={styles.cardMeta}>
            {new Date(item.timestamp).toLocaleString()} • {item.model}
          </Text>
        </View>
      </View>
      
      {item.arabicTranscript && (
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Arabic Text</Text>
          <Text style={styles.arabicText} numberOfLines={3}>
            {item.arabicTranscript}
          </Text>
        </View>
      )}
      
      {item.dutchTranslation && (
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Translation</Text>
          <Text style={styles.bodyText} numberOfLines={3}>
            {item.dutchTranslation}
          </Text>
        </View>
      )}
      
      {item.duaResults && (
        <View style={styles.duaSection}>
          <Ionicons name="star" size={16} color={colors.accent} />
          <Text style={styles.duaText} numberOfLines={2}>
            {item.duaResults}
          </Text>
        </View>
      )}
    </View>
  );

  return (
    <SafeAreaView style={globalStyles.safeArea} edges={['top']}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.heading}>History</Text>
          <Text style={styles.sub}>Your saved transcriptions</Text>
        </View>
        
        <FlatList
          data={items}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={{...styles.listContent, paddingBottom: 100}}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Ionicons name="albums-outline" size={64} color={colors.textTertiary} />
              <Text style={styles.emptyText}>No history yet</Text>
              <Text style={styles.emptySubtext}>
                Process videos to see your transcriptions here
              </Text>
            </View>
          }
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={colors.primary}
            />
          }
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: layout.screenPadding.horizontal,
    paddingTop: layout.spacing.md,
    backgroundColor: colors.background,
  },
  header: {
    marginBottom: layout.spacing.lg,
    paddingTop: layout.spacing.md,
  },
  heading: {
    ...typography.h1,
    fontSize: 32,
    fontWeight: '700',
    marginBottom: layout.spacing.xs,
  },
  sub: {
    ...typography.body,
    color: colors.textSecondary,
  },
  listContent: {
    paddingBottom: 100, // Space for bottom tab bar
  },
  card: {
    backgroundColor: colors.glassLight,
    borderRadius: layout.radius.xl,
    padding: layout.spacing.lg,
    marginBottom: layout.spacing.md,
    borderWidth: 1,
    borderColor: colors.glassBorder,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
  },
  cardHeader: {
    flexDirection: 'row',
    marginBottom: layout.spacing.md,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: layout.radius.md,
    backgroundColor: colors.primary + '15',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: layout.spacing.md,
  },
  cardHeaderText: {
    flex: 1,
  },
  cardTitle: {
    ...typography.body,
    fontWeight: '600',
    color: colors.text,
    marginBottom: layout.spacing.xs,
  },
  cardMeta: {
    ...typography.caption,
    color: colors.textTertiary,
  },
  section: {
    marginTop: layout.spacing.md,
    paddingTop: layout.spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  sectionLabel: {
    ...typography.caption,
    color: colors.textSecondary,
    fontWeight: '600',
    marginBottom: layout.spacing.xs,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  arabicText: {
    ...typography.arabic,
    fontSize: 16,
    lineHeight: 24,
  },
  bodyText: {
    ...typography.body,
    color: colors.textSecondary,
    lineHeight: 22,
  },
  duaSection: {
    flexDirection: 'row',
    marginTop: layout.spacing.md,
    paddingTop: layout.spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    alignItems: 'flex-start',
  },
  duaText: {
    ...typography.bodySmall,
    color: colors.accent,
    marginLeft: layout.spacing.sm,
    flex: 1,
    fontStyle: 'italic',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: layout.spacing.xxl * 2,
    paddingHorizontal: layout.spacing.xl,
  },
  emptyText: {
    ...typography.h3,
    marginTop: layout.spacing.lg,
    marginBottom: layout.spacing.xs,
    color: colors.textSecondary,
  },
  emptySubtext: {
    ...typography.body,
    color: colors.textTertiary,
    textAlign: 'center',
  },
});
