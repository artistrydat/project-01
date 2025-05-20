import { Redirect } from 'expo-router';
import { useAuthStore } from '~/context/AuthContext';

// This is a default route that will redirect based on auth status
export default function Index() {
  const { user } = useAuthStore();

  // If the user is logged in, redirect to the protected tabs
  if (user) {
    return <Redirect href="/(protected)/(tabs)/explore" />;
  }

  // Otherwise, redirect to the login screen
  return <Redirect href="/(auth)/login" />;
}
