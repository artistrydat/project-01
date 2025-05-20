import React from 'react';
import { View, Text, Image, Pressable } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import type { ActivityCardProps } from '~/types/ui.types';

export default function ActivityCard({ activity, onPress }: ActivityCardProps) {
  return (
    <View className="bg-white rounded-lg overflow-hidden shadow-md mb-4">
      <Pressable onPress={onPress}>
        <View className="relative h-48">
          <Image 
            source={{ uri: activity.imageUrl }} 
            className="w-full h-full"
            resizeMode="cover"
          />
          <Text className="absolute bottom-4 left-4 text-white text-xl font-bold bg-black/50 px-2 py-1 rounded">
            {activity.name}
          </Text>
          {activity.type === 'landmark' && (
            <View className="absolute top-4 right-4 bg-amber-500/80 rounded-full p-2">
              <MaterialIcons name="tour" size={24} color="white" />
            </View>
          )}
        </View>
        <View className="p-4">
          <Text className="text-lg font-bold mb-2">{activity.name}</Text>
          <Text className="text-base text-gray-700 mb-3">{activity.description}</Text>
          
          <View className="flex-row items-center mb-2">
            <MaterialIcons name="star" size={16} color="#F59E0B" />
            <Text className="ml-2 text-gray-700">Rating: {activity.rating} ({activity.reviewsCount} reviews)</Text>
          </View>
          
          <View className="flex-row items-center mb-2">
            <MaterialIcons name="attach-money" size={16} color="#4F46E5" />
            <Text className="ml-2 text-gray-700">Price Level: {activity.cost}</Text>
          </View>
          
          <View className="flex-row items-center mb-2">
            <MaterialIcons name="schedule" size={16} color="#4F46E5" />
            <Text className="ml-2 text-gray-700">Hours: {activity.openingHours.join(' - ')}</Text>
          </View>
          
          <View className="flex-row items-center mb-2">
            <MaterialIcons name="place" size={16} color="#4F46E5" />
            <Text className="ml-2 text-gray-700">Location: {activity.location.lat.toFixed(4)}, {activity.location.lng.toFixed(4)}</Text>
          </View>
          
          <View className="flex-row flex-wrap mt-2">
            {activity.tags.map((tag) => (
              <View key={tag} className="bg-indigo-100 px-2 py-1 rounded-full mr-2 mb-2">
                <Text className="text-xs text-indigo-700">{tag}</Text>
              </View>
            ))}
          </View>
        </View>
      </Pressable>
    </View>
  );
}
