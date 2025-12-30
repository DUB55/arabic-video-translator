/**
 * Stack Navigator Configuration
 */

import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { SplashScreen } from '../screens/SplashScreen';
import { UploadScreen } from '../screens/UploadScreen';
import { ConfigureScreen } from '../screens/ConfigureScreen';
import { ProcessingScreen } from '../screens/ProcessingScreen';
import { ResultsScreen } from '../screens/ResultsScreen';
import { colors } from '../styles/colors';

const Stack = createStackNavigator();

export function StackNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="Splash"
      screenOptions={{
        headerStyle: {
          backgroundColor: colors.background,
        },
        headerTintColor: colors.text,
        headerTitleStyle: {
          fontWeight: '600',
        },
        cardStyle: {
          backgroundColor: colors.background,
        },
      }}
    >
      <Stack.Screen
        name="Splash"
        component={SplashScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Upload"
        component={UploadScreen}
        options={{ title: 'Transcribe Reel' }}
      />
      <Stack.Screen
        name="Configure"
        component={ConfigureScreen}
        options={{ title: 'Configuration' }}
      />
      <Stack.Screen
        name="Processing"
        component={ProcessingScreen}
        options={{ 
          title: 'Processing',
          headerLeft: null, // Prevent going back during processing
        }}
      />
      <Stack.Screen
        name="Results"
        component={ResultsScreen}
        options={{ 
          title: 'Results',
          headerLeft: null, // Use custom navigation in Results screen
        }}
      />
    </Stack.Navigator>
  );
}

