import React, { useState, useEffect } from 'react';
import { View, Text, Pressable, Image, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useItineraryStore } from '~/store/itinerary/ItineraryStore';
import { router } from 'expo-router';

type ContentTabsSectionProps = {
  userId: string;
};

export default function ContentTabsSection({ userId }: ContentTabsSectionProps) {
  const [activeTab, setActiveTab] = useState('itineraries');
  
  const { 
    fetchUserItineraries, 
    fetchUserFavoriteItineraries, 
    userItineraries, 
    favoriteItineraries,
    isLoading,
    error 
  } = useItineraryStore();
  
  // Validate userId is present before making any fetches
  const validUserId = userId || '1'; // Fallback to '1' if undefined
  
  // Log component props and state for debugging
  useEffect(() => {
    console.log(`[ContentTabsSection] Rendering with userId: ${validUserId}, activeTab: ${activeTab}`);
  }, [validUserId, activeTab]);

  // Fetch user itineraries when component mounts with valid userId
  useEffect(() => {
    console.log(`[ContentTabsSection] Fetching user itineraries for userId: ${validUserId}`);
    fetchUserItineraries(validUserId);
  }, [validUserId, fetchUserItineraries]);
  
  // Fetch favorite itineraries when switching to the favorites tab
  useEffect(() => {
    if (activeTab === 'favorited') {
      console.log(`[ContentTabsSection] Fetching favorite itineraries for userId: ${validUserId}`);
      fetchUserFavoriteItineraries(validUserId);
    }
  }, [activeTab, validUserId, fetchUserFavoriteItineraries]);

  // Navigate to itinerary details
  const navigateToItinerary = (itineraryId: string) => {
    console.log(`[ContentTabsSection] Navigating to itinerary: ${itineraryId}`);
    router.push(`/destination/itinerary/${itineraryId}`);
  };

  // Helper function to render an itinerary card
  const renderItineraryCard = (item: any, index: number) => (
    <Pressable 
      key={item.ititeraryId} 
      style={{ width: '48%', marginRight: index % 2 === 0 ? '4%' : 0, marginBottom: 15 }}
      onPress={() => navigateToItinerary(item.ititeraryId)}
      className="active:opacity-80"
    >
      <Image 
        source={{ uri: item.imageUrl || 'https://images.unsplash.com/photo-1536098561742-ca998e48cbcc' }} 
        className="w-full h-36 rounded-xl"
      />
      <View className="absolute bottom-0 left-0 right-0 bg-black/50 p-2 rounded-b-xl">
        <Text className="text-white font-medium">{item.name || `Trip ${index + 1}`}</Text>
        <Text className="text-white text-xs opacity-80">
          {item.ItineraryDays?.length || 0} days
        </Text>
      </View>
    </Pressable>
  );
  
  return (
    <View className="px-4">
      <View className="flex-row border-b border-gray-200 mb-4">
        <Pressable 
          className={`px-4 py-2 ${activeTab === 'itineraries' ? 'border-b-2 border-tertiary' : ''}`}
          onPress={() => setActiveTab('itineraries')}
        >
          <Text className={`${activeTab === 'itineraries' ? 'text-tertiary font-medium' : 'text-gray-500'}`}>
            Itineraries
          </Text>
        </Pressable>
        <Pressable 
          className={`px-4 py-2 ${activeTab === 'favorited' ? 'border-b-2 border-tertiary' : ''}`}
          onPress={() => setActiveTab('favorited')}
        >
          <Text className={`${activeTab === 'favorited' ? 'text-tertiary font-medium' : 'text-gray-500'}`}>
            Favorited
          </Text>
        </Pressable>
      </View>
      
      {isLoading ? (
        <View className="items-center py-12">
          <ActivityIndicator size="large" color="#C6E7E3" />
        </View>
      ) : activeTab === 'itineraries' ? (
        <View className="flex-row flex-wrap">
          {userItineraries && userItineraries.length > 0 ? (
            userItineraries.map((item, index) => renderItineraryCard(item, index))
          ) : (
            <View className="items-center py-6 w-full">
              <Ionicons name="map-outline" size={48} color="#C6E7E3" />
              <Text className="text-gray-500 mt-2">No itineraries yet</Text>
              <Pressable className="mt-4 bg-primary px-4 py-2 rounded-full">
                <Text className="text-tertiary font-medium">Create Trip</Text>
              </Pressable>
            </View>
          )}
        </View>
      ) : (
        <View className="flex-row flex-wrap">
          {favoriteItineraries && favoriteItineraries.length > 0 ? (
            favoriteItineraries.map((item, index) => renderItineraryCard(item, index))
          ) : (
            <View className="items-center py-6 w-full">
              <Ionicons name="heart-outline" size={48} color="#C6E7E3" />
              <Text className="text-gray-500 mt-2">No favorite itineraries yet</Text>
              <Pressable className="mt-4 bg-primary px-4 py-2 rounded-full">
                <Text className="text-tertiary font-medium">Browse Trips</Text>
              </Pressable>
            </View>
          )}
        </View>
      )}
    </View>
  );
}