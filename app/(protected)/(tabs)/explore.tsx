import React from 'react';
import { View, Text, ScrollView, SafeAreaView } from 'react-native';
import { router, Stack } from 'expo-router';
import { DestinationCard, Header } from '~/components/ui';
import { mockititerarys } from '~/types/mockdata';

// IMPORTANT: Completely avoiding the store for now to eliminate the update loop
export default function ExploreScreen() {
  // Use the mock data directly instead of the store to avoid the update loop
  const itineraries = mockititerarys;
  const loading = false;

  return (
    <SafeAreaView className="flex-1 bg-white">
      <Stack.Screen options={{ headerShown: false }} />
      
      <Header title="Explore" subtitle="Discover your next adventure" />
      
      {loading && Object.keys(itineraries).length === 0 ? (
        <View className="flex-1 items-center justify-center">
          <Text>Loading destinations...</Text>
        </View>
      ) : (
        <ScrollView 
          className="flex-1 px-4" 
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 30 }}
        >
          <Text className="text-lg font-semibold mb-2">
            Featured Destinations
          </Text>
          
          <View className="space-y-4">
            {Object.values(itineraries).map((destination) => (
              <DestinationCard
                key={destination.ititeraryId}
                itinerary={destination}
                onPress={() => {
                  console.log('Card pressed', destination.ititeraryId);
                  router.push(`/(protected)/destination/details/${destination.ititeraryId}`);
                }}
              />
            ))}
          </View>
        </ScrollView>
      )}
    </SafeAreaView>
  );
}