import React from 'react';
import { View, Text, ScrollView, SafeAreaView } from 'react-native';
import { router, Stack } from 'expo-router';
import { DestinationCard, Header } from '~/components/ui';
import { mockititerarys } from '~/types/mockdata';

export default function ExploreScreen() {
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
                  console.log('Navigating to itinerary:', destination.ititeraryId);
                  router.push(`/(protected)/destination/itinerary/${destination.ititeraryId}`);
                }}
              />
            ))}
          </View>
        </ScrollView>
      )}
    </SafeAreaView>
  );
}