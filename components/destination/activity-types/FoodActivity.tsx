import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import type { Activity } from '~/types/planner.types';

interface FoodActivityProps {
  activity: Activity;
}

const FoodActivity: React.FC<FoodActivityProps> = ({ activity }) => {
  // Dynamic price indicator
  const priceLevel = Array(Math.round(activity.cost)).fill('$').join('');
  
  return (
    <View className="rounded-2xl overflow-hidden shadow-lg">
      {/* Top Section with Gradient Overlay */}
      <View className="bg-gradient-to-r from-rose-400 to-rose-600 p-4">
        <View className="flex-row items-center">
          <View className="bg-white/20 rounded-full p-2 mr-3">
            <MaterialIcons name="restaurant" size={22} color="#FFF" />
          </View>
          <Text className="text-white font-bold text-lg">Food & Dining</Text>
          <View className="ml-auto bg-white/20 rounded-xl px-2 py-1">
            <Text className="text-white font-medium text-xs">{priceLevel || '$'}</Text>
          </View>
        </View>
      </View>
      
      {/* Content */}
      <View className="bg-rose-50 p-4">
        <Text className="text-rose-900 leading-6 mb-3">{activity.AiSummary}</Text>
        
        {/* Info Pills */}
        <View className="flex-row flex-wrap mb-4">
          <View className="bg-white rounded-full px-3 py-1 mr-2 mb-2 flex-row items-center border border-rose-200">
            <MaterialIcons name="star" size={16} color="#E11D48" />
            <Text className="ml-1 text-rose-700 text-xs font-medium">
              {activity.rating.toFixed(1)} ({activity.reviewsCount})
            </Text>
          </View>
          
          <View className="bg-white rounded-full px-3 py-1 mr-2 mb-2 flex-row items-center border border-rose-200">
            <MaterialIcons name="schedule" size={16} color="#E11D48" />
            <Text className="ml-1 text-rose-700 text-xs font-medium">
              {activity.openingHours[0]}
            </Text>
          </View>
        </View>
        
        {/* Tags Section */}
        <View className="flex-row flex-wrap mb-3">
          {activity.tags.map((tag, index) => (
            <View key={index} className="bg-rose-200 rounded-full px-3 py-1 mr-2 mb-2">
              <Text className="text-rose-800 text-xs font-medium">#{tag}</Text>
            </View>
          ))}
        </View>
        
        {/* Action Buttons */}
        <View className="flex-row justify-between">
          <Pressable className="bg-white rounded-full px-4 py-2 flex-row items-center border border-rose-200">
            <MaterialIcons name="menu-book" size={18} color="#E11D48" />
            <Text className="ml-2 text-rose-600 font-medium">Menu</Text>
          </Pressable>
          
          <Pressable className="bg-rose-500 rounded-full px-4 py-2 flex-row items-center">
            <MaterialIcons name="restaurant-menu" size={18} color="#FFF" />
            <Text className="ml-2 text-white font-medium">Reserve</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
};

export default FoodActivity;