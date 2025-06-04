import { Redirect } from 'expo-router';

export default function Index() {
  // This will be handled by the RootLayoutNav logic
  return <Redirect href="/(auth)/login" />;
}
