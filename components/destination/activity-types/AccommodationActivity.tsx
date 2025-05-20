import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import type { Activity } from '~/types/planner.types';

interface AccommodationActivityProps {
  activity: Activity;
}

const AccommodationActivity: React.FC<AccommodationActivityProps> = ({ activity }) => {
  // Dynamic price indicator
  const priceLevel = Array(Math.round(activity.cost)).fill('$').join('');
  
  return (
    <View className="rounded-2xl overflow-hidden shadow-lg">
      {/* Top Section with Gradient Overlay */}
      <View className="bg-gradient-to-r from-indigo-400 to-indigo-600 p-4">
        <View className="flex-row items-center">
          <View className="bg-white/20 rounded-full p-2 mr-3">
            <MaterialIcons name="hotel" size={22} color="#FFF" />
          </View>
          <Text className="text-white font-bold text-lg">Accommodation</Text>
          <View className="ml-auto bg-white/20 rounded-xl px-2 py-1">
            <Text className="text-white font-medium text-xs">{priceLevel || '$'}/night</Text>
          </View>
        </View>
      </View>
      
      {/* Content */}
      <View className="bg-indigo-50 p-4">
        <Text className="text-indigo-900 leading-6 mb-3">{activity.AiSummary}</Text>
        
        {/* Amenities Section */}
        <Text className="text-indigo-800 font-bold mb-2">Amenities</Text>
        <View className="flex-row flex-wrap mb-4">
          {['WiFi', 'Pool', 'Breakfast', 'A/C'].map((amenity, index) => (
            <View key={index} className="bg-white rounded-full px-3 py-1 mr-2 mb-2 flex-row items-center border border-indigo-200">
              <MaterialIcons 
                name={
                  amenity === 'WiFi' ? 'wifi' : 
                  amenity === 'Pool' ? 'pool' : 
                  amenity === 'Breakfast' ? 'restaurant' : 'ac-unit'
                } 
                size={16} 
                color="#4F46E5" 
              />
              <Text className="ml-1 text-indigo-700 text-xs font-medium">{amenity}</Text>
            </View>
          ))}
        </View>
        
        {/* Tags Section */}
        <View className="flex-row flex-wrap mb-3">
          {activity.tags.map((tag, index) => (
            <View key={index} className="bg-indigo-200 rounded-full px-3 py-1 mr-2 mb-2">
              <Text className="text-indigo-800 text-xs font-medium">#{tag}</Text>
            </View>
          ))}
        </View>
        
        {/* Action Buttons */}
        <View className="flex-row justify-between">
          <Pressable className="bg-white rounded-full px-4 py-2 flex-row items-center border border-indigo-200">
            <MaterialIcons name="photo-library" size={18} color="#4F46E5" />
            <Text className="ml-2 text-indigo-600 font-medium">Gallery</Text>
          </Pressable>
          
          <Pressable className="bg-indigo-500 rounded-full px-4 py-2 flex-row items-center">
            <MaterialIcons name="bookmark-border" size={18} color="#FFF" />
            <Text className="ml-2 text-white font-medium">Book Now</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
};

export default AccommodationActivity;