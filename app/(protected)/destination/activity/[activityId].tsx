// app/(protected)/destination/activity/[activityId].tsx
import React from 'react';
import { View, Text, SafeAreaView, ScrollView, Pressable, Image, Linking } from 'react-native';
import { Stack, useLocalSearchParams, router } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { Button } from '~/components/ui';
import { useItineraryStore } from '~/store/itinerary/ItineraryStore';
import type { Activity } from '~/types/planner.types';

const ActivityTypeSection: React.FC<{ activity: Activity }> = ({ activity }) => {
  switch (activity.type) {
    case 'landmark':
      return (
        <View className="mt-4 p-4 bg-amber-50 rounded-lg border border-amber-200">
          <View className="flex-row items-center mb-2">
            <MaterialIcons name="tour" size={20} color="#F59E0B" />
            <Text className="ml-2 font-bold text-amber-800">Landmark Spotlight</Text>
          </View>
          <Text className="text-amber-700">
            This historical landmark is a must-visit location. Don&apos;t forget to check
            the visitor guidelines before your visit.
          </Text>
        </View>
      );
      
    case 'food':
      return (
        <View className="mt-4 p-4 bg-rose-50 rounded-lg border border-rose-200">
          <View className="flex-row items-center mb-2">
            <MaterialIcons name="restaurant" size={20} color="#E11D48" />
            <Text className="ml-2 font-bold text-rose-800">Dining Information</Text>
          </View>
          <Text className="text-rose-700">
            {activity.tags?.includes('vegetarian') && '🍃 Vegetarian options available\n'}
            {activity.tags?.includes('vegan') && '🌱 Vegan-friendly\n'}
            Popular local cuisine. Reservations {activity.cost > 2 ? 'recommended' : 'not required'}.
          </Text>
        </View>
      );

    case 'accommodation':
      return (
        <View className="mt-4 p-4 bg-indigo-50 rounded-lg border border-indigo-200">
          <View className="flex-row items-center mb-2">
            <MaterialIcons name="hotel" size={20} color="#4F46E5" />
            <Text className="ml-2 font-bold text-indigo-800">Stay Details</Text>
          </View>
          <Text className="text-indigo-700">
            Check-in: {activity.openingHours?.[0] || '14:00'}, Check-out: {activity.openingHours?.[1] || '11:00'}\n
            {activity.tags?.includes('wifi') && '📶 Free WiFi\n'}
            {activity.tags?.includes('breakfast') && '☕ Breakfast included'}
          </Text>
        </View>
      );

    case 'activity':
      return (
        <View className="mt-4 p-4 bg-emerald-50 rounded-lg border border-emerald-200">
          <View className="flex-row items-center mb-2">
            <MaterialIcons name="directions-run" size={20} color="#059669" />
            <Text className="ml-2 font-bold text-emerald-800">Activity Details</Text>
          </View>
          <Text className="text-emerald-700">
            Duration: {activity.tags?.includes('half-day') ? '3-4 hours' : 'Full day'}\n
            Difficulty: {activity.cost > 3 ? 'Challenging' : 'Moderate'}\n
            Equipment: {activity.tags?.includes('rentals') ? 'Available for rent' : 'Bring your own'}
          </Text>
        </View>
      );

    default:
      return null;
  }
};

const ActivityDetails = () => {
  const params = useLocalSearchParams();
  const activityId = Array.isArray(params.activityId) 
    ? params.activityId[0] 
    : params.activityId || '';

  const { activity } = useItineraryStore(state => ({
    activity: state.itinerary?.ItineraryDays
      ?.flatMap(day => day.activitys)
      .find(a => a.id === activityId)
  }));

  if (!activity) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center">
        <Text className="text-xl mb-2">Activity not found</Text>
        <Button 
          label="Go Back" 
          onPress={() => router.back()} 
          icon="arrow-back"
          variant="primary"
        />
      </SafeAreaView>
    );
  }

  const handleOpenMaps = () => {
    const url = `https://www.google.com/maps/search/?api=1&query=${activity.location.lat},${activity.location.lng}`;
    Linking.openURL(url);
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <Stack.Screen options={{ headerShown: false }} />
      
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Header Image */}
        <View className="relative h-64">
          <Image
            source={{ uri: activity.imageUrl }}
            className="w-full h-full"
            resizeMode="cover"
          />
          <Pressable
            className="absolute top-12 left-4 bg-white/90 rounded-full p-2"
            onPress={() => router.back()}
          >
            <MaterialIcons name="arrow-back" size={24} color="#1E493B" />
          </Pressable>
        </View>

        {/* Main Content */}
        <View className="px-4 pb-8 -mt-6">
          <View className="bg-white rounded-xl p-6 shadow-sm">
            <Text className="text-2xl font-bold text-gray-900 mb-2">
              {activity.name}
            </Text>
            <View className="flex-row justify-between mb-4">
              <View className="flex-row items-center">
                <MaterialIcons name="star" size={20} color="#F59E0B" />
                <Text className="ml-1 text-gray-700">
                  {activity.rating.toFixed(1)} ({activity.reviewsCount} reviews)
                </Text>
              </View>
              <View className="flex-row">
                {[...Array(4)].map((_, i) => (
                  <MaterialIcons
                    key={i}
                    name={i < activity.cost ? 'attach-money' : 'money-off'}
                    size={20}
                    color={i < activity.cost ? '#10B981' : '#9CA3AF'}
                  />
                ))}
              </View>
            </View>

            <Text className="text-gray-700 mb-6 leading-6">
              {activity.description}
            </Text>

            <ActivityTypeSection activity={activity} />

            <View className="mt-6">
              {activity.openingHours && (
                <View className="mb-6">
                  <Text className="font-medium text-gray-900 mb-2">
                    {activity.type === 'accommodation' ? 'Check-in Times' : 'Opening Hours'}
                  </Text>
                  <View className="flex-row items-center bg-gray-50 rounded-lg p-3">
                    <MaterialIcons name="access-time" size={20} color="#6B7280" />
                    <Text className="ml-2 text-gray-700">
                      {activity.openingHours.join(' - ')}
                    </Text>
                  </View>
                </View>
              )}

              <View className="mb-6">
                <Text className="font-medium text-gray-900 mb-2">Location</Text>
                <Pressable 
                  onPress={handleOpenMaps}
                  className="flex-row items-center bg-gray-50 rounded-lg p-3"
                >
                  <MaterialIcons name="location-on" size={20} color="#EF4444" />
                  <Text className="ml-2 text-gray-700">
                    Open in Maps
                  </Text>
                </Pressable>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>

      <View className="absolute bottom-6 left-0 right-0 px-4">
        <Button
          label={activity.type === 'accommodation' ? 'Book Now' : 'Add to Plan'}
          onPress={() => console.log('Action triggered')}
          icon={activity.type === 'food' ? 'restaurant' : 'add'}
          variant="primary"
          fullWidth
        />
      </View>
    </SafeAreaView>
  );
};

export default ActivityDetails;