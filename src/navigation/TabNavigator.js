/**
 * Custom Tab Navigator Implementation
 * Uses Stack Navigator with custom bottom tab bar overlay
 */

import React, { useState, useCallback } from 'react';
import { View, StyleSheet } from 'react-native';
import { StackNavigator } from './StackNavigator';
import { HistoryScreen } from '../screens/HistoryScreen';
import { BottomTabBar } from '../components/common/BottomTabBar';
import { useNavigation, useRoute } from '@react-navigation/native';

// Create a simple state manager for tabs
const TabStateContext = React.createContext();

export function TabNavigator() {
  const [activeTab, setActiveTab] = useState('Home');
  const [historyStack, setHistoryStack] = React.useState(null);

  const handleTabPress = useCallback((tabName) => {
    setActiveTab(tabName);
  }, []);

  const tabState = {
    index: activeTab === 'Home' ? 0 : 1,
    routes: [
      { key: 'Home', name: 'Home' },
      { key: 'History', name: 'History' },
    ],
  };

  const tabDescriptors = {
    Home: {
      options: {
        title: 'Home',
        tabBarLabel: 'Home',
      },
    },
    History: {
      options: {
        title: 'History',
        tabBarLabel: 'History',
      },
    },
  };

  const navigation = {
    navigate: (routeName) => {
      handleTabPress(routeName);
    },
    emit: () => ({ defaultPrevented: false }),
  };

  return (
    <View style={styles.container}>
      {activeTab === 'Home' && <StackNavigator />}
      {activeTab === 'History' && <HistoryScreen isFocused={activeTab === 'History'} />}
      <BottomTabBar
        state={tabState}
        descriptors={tabDescriptors}
        navigation={navigation}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
