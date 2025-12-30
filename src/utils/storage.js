/**
 * Local Storage Utilities
 * Uses AsyncStorage for persistent data storage
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEYS } from './constants';

/**
 * Saves selected Whisper model preference
 * @param {string} model - Model value (tiny, base, small, medium, large)
 */
export async function saveSelectedModel(model) {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.SELECTED_MODEL, model);
  } catch (error) {
    console.error('Error saving model preference:', error);
  }
}

/**
 * Loads selected Whisper model preference
 * @returns {Promise<string>} - Model value or 'small' as default
 */
export async function loadSelectedModel() {
  try {
    const model = await AsyncStorage.getItem(STORAGE_KEYS.SELECTED_MODEL);
    return model || 'small'; // Default to 'small' (recommended)
  } catch (error) {
    console.error('Error loading model preference:', error);
    return 'small';
  }
}

/**
 * Saves dua extraction enabled preference
 * @param {boolean} enabled - Whether dua extraction is enabled
 */
export async function saveDuaEnabled(enabled) {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.DUA_ENABLED, JSON.stringify(enabled));
  } catch (error) {
    console.error('Error saving dua preference:', error);
  }
}

/**
 * Loads dua extraction enabled preference
 * @returns {Promise<boolean>} - True if enabled, false otherwise (default: true)
 */
export async function loadDuaEnabled() {
  try {
    const value = await AsyncStorage.getItem(STORAGE_KEYS.DUA_ENABLED);
    return value !== null ? JSON.parse(value) : true; // Default to enabled
  } catch (error) {
    console.error('Error loading dua preference:', error);
    return true;
  }
}

/**
 * Clears all stored preferences
 */
export async function clearPreferences() {
  try {
    await AsyncStorage.multiRemove([
      STORAGE_KEYS.SELECTED_MODEL,
      STORAGE_KEYS.DUA_ENABLED,
      STORAGE_KEYS.LAST_VIDEO_URI
    ]);
  } catch (error) {
    console.error('Error clearing preferences:', error);
  }
}

/**
 * Appends a result entry to history
 * @param {Object} entry - { id, timestamp, model, transcript, translation, duas }
 */
export async function saveResultToHistory(entry) {
  try {
    const existing = await AsyncStorage.getItem(STORAGE_KEYS.RESULTS_HISTORY);
    const parsed = existing ? JSON.parse(existing) : [];
    const next = [entry, ...parsed].slice(0, 50); // keep latest 50
    await AsyncStorage.setItem(STORAGE_KEYS.RESULTS_HISTORY, JSON.stringify(next));
  } catch (error) {
    console.error('Error saving result to history:', error);
  }
}

/**
 * Loads saved result history
 * @returns {Promise<Array>}
 */
export async function loadResultsHistory() {
  try {
    const existing = await AsyncStorage.getItem(STORAGE_KEYS.RESULTS_HISTORY);
    return existing ? JSON.parse(existing) : [];
  } catch (error) {
    console.error('Error loading results history:', error);
    return [];
  }
}


