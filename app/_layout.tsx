import '../global.css';
import { Stack, useRouter, useSegments } from 'expo-router';
import { useEffect, useState } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import * as SplashScreen from 'expo-splash-screen';
import * as Font from 'expo-font';
import { MaterialIcons } from '@expo/vector-icons';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useAuthStore, useAuthHydration } from '~/context/AuthContext';

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
  const [appIsReady, setAppIsReady] = useState(false);
  const isHydrated = useAuthHydration();

  useEffect(() => {
    async function prepare() {
      try {
        await Font.loadAsync(MaterialIcons.font);
        await new Promise(resolve => {
          const checkReady = () => isHydrated ? resolve(true) : setTimeout(checkReady, 100);
          checkReady();
        });
      } catch (e) {
        console.warn(e);
      } finally {
        setAppIsReady(true);
      }
    }

    prepare();
  }, [isHydrated]);

  useEffect(() => {
    if (appIsReady) {
      SplashScreen.hideAsync();
    }
  }, [appIsReady]);

  if (!appIsReady) {
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <RootLayoutNav />
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}