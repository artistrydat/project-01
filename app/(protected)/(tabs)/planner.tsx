import React, { useState } from 'react';
import { View, Text, ScrollView, SafeAreaView, TouchableOpacity } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

import DestinationCard from '~/components/destination/DestinationCard';
import { useItineraryStore } from '~/store/itinerary/ItineraryStore';
import { mockititerarys } from '~/types/mockdata';

export default function ExploreScreen() {
  // Use the itinerary store
  const { fetchItinerary, toggleFavorite, itinerary } = useItineraryStore();
  
  // Transform mock data into destination format
  const [destinations, setDestinations] = useState(() => 
    Object.entries(mockititerarys).map(([id, itinerary]) => ({
      id,
      name: itinerary.city,
      country: itinerary.country,
      image: itinerary.imageUrl,
      trending: itinerary.trendingScore,
      eco: itinerary.ecoScore,
      isFavorite: itinerary.isfavorite
    }))
  );

  // Handle favorite toggle
  const handleToggleFavorite = (id: string) => {
    // Update store - first fetch the itinerary
    fetchItinerary(id);
    // Then toggle its favorite status
    toggleFavorite();
    
    // Update local state for immediate UI feedback
    setDestinations(currentDestinations => 
      currentDestinations.map(dest => 
        dest.id === id ? { ...dest, isFavorite: !dest.isFavorite } : dest
      )
    );
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
        
        <ScrollView 
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 100 }}
        >
          {destinations.map((destination) => (
            <DestinationCard
              key={destination.id}
              id={destination.id}
              name={destination.name}
              country={destination.country}
              image={destination.image}
              trending={destination.trending}
              eco={destination.eco}
              isFavorite={destination.isFavorite}
              onToggleFavorite={() => handleToggleFavorite(destination.id)}
              onPress={() => handleDestinationPress(destination.id)}
            />
          ))}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}