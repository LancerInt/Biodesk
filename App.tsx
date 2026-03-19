/**
 * BioDesk – Kriya Biosys Mobile Application
 * Offline-first product portfolio + lead capture CRM
 */

import React, { useState, useEffect, useCallback } from 'react';
import { StatusBar, Platform } from 'react-native';
import {
  useFonts,
  Poppins_600SemiBold,
  Poppins_700Bold,
} from '@expo-google-fonts/poppins';
import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
} from '@expo-google-fonts/inter';
import {
  NotoSerifKR_700Bold,
} from '@expo-google-fonts/noto-serif-kr';
import * as NavigationBar from 'expo-navigation-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AppProvider } from './src/context/AppContext';
import AppNavigator from './src/navigation/AppNavigator';
import SplashScreen from './src/components/SplashScreen';

function App() {
  const [splashDone, setSplashDone] = useState(false);

  // ─── Load premium typography ──────────────────────────────
  const [fontsLoaded] = useFonts({
    Poppins_600SemiBold,
    Poppins_700Bold,
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    NotoSerifKR_700Bold,
  });

  // ─── Immersive Demo Mode ──────────────────────────────────
  useEffect(() => {
    if (Platform.OS === 'android') {
      NavigationBar.setVisibilityAsync('hidden');
      NavigationBar.setBehaviorAsync('overlay-swipe');
      NavigationBar.setBackgroundColorAsync('transparent');
    }
  }, []);

  // Unconditionally mark splash done — no fontsLoaded gate
  const handleSplashDone = useCallback(() => setSplashDone(true), []);

  // Transition to app only when BOTH are ready
  if (!fontsLoaded || !splashDone) {
    return (
      <>
        <StatusBar backgroundColor="#F8F6F0" barStyle="dark-content" />
        <SplashScreen onFinish={handleSplashDone} />
      </>
    );
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <AppProvider>
          <StatusBar backgroundColor="#1B5E20" barStyle="light-content" />
          <AppNavigator />
        </AppProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

export default App;
