import '../global.css';
import { Stack, useRouter, useSegments } from 'expo-router';
import { useEffect } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import * as SplashScreen from 'expo-splash-screen';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useAuthStore, useAuthHydration } from '~/contexts/AuthContext';
import { useFonts } from 'expo-font';
import { ThemeProvider } from '~/contexts/ThemeContext';

SplashScreen.preventAutoHideAsync();

function RootLayoutNav() {
  const { user } = useAuthStore();
  const isHydrated = useAuthHydration();
  const segments = useSegments();
  const router = useRouter();

  // Add debug logging
  console.log('[Layout] Current state:', {
    user: user?.email || 'null',
    isHydrated,
    segments: segments.join('/'),
    userExists: !!user
  });

  useEffect(() => {
    if (!isHydrated) {
      console.log('[Layout] Not hydrated yet, waiting...');
      return;
    }

    const inAuthGroup = segments[0] === '(auth)';
    const inProtectedGroup = segments[0] === '(protected)';

    console.log('[Navigation] Navigation check:', {
      user: user?.email || 'null',
      inAuthGroup,
      inProtectedGroup,
      segments: segments.join('/')
    });

    // Add timeout to prevent immediate navigation issues
    setTimeout(() => {
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
      } else if (!user && inProtectedGroup) {
        console.log('[Navigation] User not logged in but in protected, redirecting to login');
        try {
          router.replace('/(auth)/login');
        } catch (error) {
          console.error('[Navigation] Error navigating to login:', error);
        }
      } else {
        console.log('[Navigation] No navigation needed');
      }
    }, 100);
  }, [user, segments, isHydrated, router]);

  return (
    <Stack>
      <Stack.Screen name="(auth)" options={{ headerShown: false }} />
      <Stack.Screen name="(protected)" options={{ headerShown: false }} />
    </Stack>
  );
}

export default function RootLayout() {
  const [loaded, error] = useFonts({
    // You can add custom fonts here if needed
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
        <ThemeProvider>
          <RootLayoutNav />
        </ThemeProvider>
      </GestureHandlerRootView>
    </SafeAreaProvider>
  );
}