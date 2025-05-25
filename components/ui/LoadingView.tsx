import { SafeAreaView, ActivityIndicator, Text } from "react-native";

export const LoadingView = () => (
  <SafeAreaView className="flex-1 items-center justify-center">
    <ActivityIndicator size="large" color="#C6E7E3" />
    <Text className="text-primary mt-2">Loading itinerary...</Text>
  </SafeAreaView>
);