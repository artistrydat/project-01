import { Stack } from 'expo-router';

export default function ProtectedLayout() {
  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen 
        name="destination/itinerary/[id]" 
        options={{ headerShown: false }} 
      />
      <Stack.Screen 
        name="destination/activity/[activityId]" 
        options={{ presentation: 'modal', headerShown: false }} 
      />
      <Stack.Screen 
        name="chat-room/[id]" 
        options={{ headerShown: false }} 
      />
      <Stack.Screen 
        name="profile/EditProfile" 
        options={{ presentation: 'modal', headerShown: false }} 
      />
       <Stack.Screen 
        name="profile/ShareProfile" 
        options={{ presentation: 'modal', headerShown: false }} 
      />
      <Stack.Screen 
        name="profile/OnBoarding/EditPreferences" 
        options={{ presentation: 'modal', headerShown: false }} 
      />
      <Stack.Screen 
        name="profile/OnBoarding/EditNotification" 
        options={{ presentation: 'modal', headerShown: false }} 
      />
      <Stack.Screen 
        name="profile/OnBoarding/EditPrivacySet" 
        options={{ presentation: 'modal', headerShown: false }} 
      />
    </Stack>
  );
}