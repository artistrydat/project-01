import '../global.css';
import { Stack, useRouter, useSegments } from 'expo-router';
import { useEffect, useState } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import * as SplashScreen from 'expo-splash-screen';
import * as Font from 'expo-font';
import { MaterialIcons } from '@expo/vector-icons';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useAuthStore, useAuthHydration } from '~/context/AuthContext';
import { useColorScheme } from 'react-native';
import { PaperProvider, MD3LightTheme, MD3DarkTheme } from 'react-native-paper';
import { useFonts } from 'expo-font';

// Create custom theme with your tailwind colors
const createTheme = (isDarkMode: boolean) => {
  return {
    ...(isDarkMode ? MD3DarkTheme : MD3LightTheme),
    colors: {
      ...(isDarkMode ? MD3DarkTheme.colors : MD3LightTheme.colors),
      primary: '#C6E7E3',
      error: '#F3722C',
      // Add other colors from your tailwind config as needed
    },
  };
};

SplashScreen.preventAutoHideAsync();

function RootLayoutNav() {
  const { user } = useAuthStore();
  const isHydrated = useAuthHydration();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (!isHydrated) return;

    const inAuthGroup = segments[0] === '(auth)';
    
    // Simplified navigation logic with console logs
    if (!user && !inAuthGroup) {
      console.log('[Navigation] User not logged in, redirecting to login');
      try {
        router.replace('/(auth)/login');
      } catch (error) {
        console.error('[Navigation] Error navigating to login:', error);
      }
    } else if (user && inAuthGroup) {
      console.log('[Navigation] User logged in, redirecting to explore');
      try {
        router.replace('/(protected)/(tabs)/explore');
      } catch (error) {
        console.error('[Navigation] Error navigating to explore:', error);
      }
    }
  }, [user, segments, isHydrated, router]);

  return (
    <Stack>
      <Stack.Screen name="(auth)" options={{ headerShown: false }} />
      <Stack.Screen name="(protected)" options={{ headerShown: false }} />
    </Stack>
  );
}

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const theme = createTheme(colorScheme === 'dark');

  const [loaded, error] = useFonts({
    // Your fonts here
  });

  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <SafeAreaProvider>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <PaperProvider theme={theme}>
          <RootLayoutNav />
        </PaperProvider>
      </GestureHandlerRootView>
    </SafeAreaProvider>
  );
}