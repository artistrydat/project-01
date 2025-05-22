import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import type { Activity } from '~/types/planner.types';

interface LandmarkActivityProps {
  activity: Activity;
}

const LandmarkActivity: React.FC<LandmarkActivityProps> = ({ activity }) => {
  return (
    <View className="rounded-2xl overflow-hidden shadow-lg">
      {/* Top Section with Gradient Overlay */}
      <View className="bg-gradient-to-r from-amber-400 to-amber-600 p-4">
        <View className="flex-row items-center">
          <View className="bg-white/20 rounded-full p-2 mr-3">
            <MaterialIcons name="location-city" size={22} color="#FFF" />
          </View>
          <Text className="text-white font-bold text-lg">Historical Landmark</Text>
          <View className="ml-auto bg-white/20 rounded-xl px-2 py-1">
            <Text className="text-white font-medium text-xs">{activity.AiSummaryRating} points</Text>
          </View>
        </View>
      </View>
      
      {/* Content */}
      <View className="bg-amber-50 p-4">
        <Text className="text-amber-900 leading-6 mb-3">{activity.AiSummary}</Text>
        
        
        {/* Action Buttons */}
        <View className="flex-row justify-between">
          <Pressable className="bg-white rounded-full px-4 py-2 flex-row items-center border border-amber-200">
            <MaterialIcons name="photo-camera" size={18} color="#F59E0B" />
            <Text className="ml-2 text-amber-600 font-medium">Photo Spots</Text>
          </Pressable>
          
          <Pressable className="bg-amber-500 rounded-full px-4 py-2 flex-row items-center">
            <MaterialIcons name="explore" size={18} color="#FFF" />
            <Text className="ml-2 text-white font-medium">Explore</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
};

export default LandmarkActivity;