import React, { useEffect } from 'react';
import { View, Text, ScrollView, SafeAreaView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import DestinationCard from '~/components/destination/DestinationCard';
import { useItineraryStore } from '~/store/itinerary/ItineraryStore';

export default function ExploreScreen() {
  // Use the itinerary store with additional functions
  const { 
    fetchItinerary, 
    toggleFavorite, 
    fetchPublicItineraries, 
    userItineraries, 
    isLoading 
  } = useItineraryStore();

  // Fetch public itineraries when component mounts
  useEffect(() => {
    fetchPublicItineraries();
  }, [fetchPublicItineraries]);

  // Handle favorite toggle
  const handleToggleFavorite = (id: string) => {
    // Update store - first fetch the itinerary
    fetchItinerary(id);
    // Then toggle its favorite status
    toggleFavorite();
  };

  // Handle destination card press
  const handleDestinationPress = (id: string) => {
    console.log('Navigating to itinerary:', id);
    // Fetch the itinerary before navigation
    fetchItinerary(id);
    // Navigate to the details screen
    router.push(`/(protected)/destination/itinerary/${id}`);
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar style="dark" />
      
      <View className="px-4 pt-2">
        <View className="flex-row justify-between items-center">
          <View>
            <Text className="text-3xl font-bold text-tertiary">Explore</Text>
            <Text className="text-gray-400 text-lg">Discover your next adventure</Text>
          </View>
          
          <View className="flex-row">
            <TouchableOpacity className="p-2">
              <Ionicons name="search" size={24} color="#2C3E50" />
            </TouchableOpacity>
            <TouchableOpacity className="p-2 ml-2">
              <Ionicons name="notifications" size={24} color="#2C3E50" />
            </TouchableOpacity>
          </View>
        </View>
        
        <Text className="text-2xl font-bold text-tertiary mt-6 mb-2">
          Featured Destinations
        </Text>
        
        {isLoading ? (
          <View className="flex-1 justify-center items-center py-10">
            <ActivityIndicator size="large" color="#2C3E50" />
            <Text className="mt-2 text-gray-500">Loading destinations...</Text>
          </View>
        ) : (
          <ScrollView 
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 100 }}
          >
            {userItineraries.length === 0 ? (
              <Text className="text-center py-10 text-gray-500">No public itineraries found</Text>
            ) : (
              userItineraries.map((itinerary) => (
                <DestinationCard
                  key={itinerary.ititeraryId}
                  id={itinerary.ititeraryId}
                  name={itinerary.city}
                  country={itinerary.country}
                  image={itinerary.imageUrl}
                  trending={itinerary.trendingScore}
                  eco={itinerary.ecoScore}
                  isFavorite={itinerary.isfavorite}
                  onToggleFavorite={() => handleToggleFavorite(itinerary.ititeraryId)}
                  onPress={() => handleDestinationPress(itinerary.ititeraryId)}
                />
              ))
            )}
          </ScrollView>
        )}
      </View>
    </SafeAreaView>
  );
}