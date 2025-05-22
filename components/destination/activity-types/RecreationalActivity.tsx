import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import type { Activity } from '~/types/planner.types';

interface RecreationalActivityProps {
  activity: Activity;
}

const RecreationalActivity: React.FC<RecreationalActivityProps> = ({ activity }) => {
  return (
    <View className="rounded-2xl overflow-hidden shadow-lg">
      {/* Top Section with Gradient Overlay */}
      <View className="bg-gradient-to-r from-emerald-400 to-emerald-600 p-4">
        <View className="flex-row items-center">
          <View className="bg-white/20 rounded-full p-2 mr-3">
            <MaterialIcons name="directions-run" size={22} color="#FFF" />
          </View>
          <Text className="text-white font-bold text-lg">Activity & Adventure</Text>
          <View className="ml-auto bg-white/20 rounded-xl px-2 py-1">
            <Text className="text-white font-medium text-xs">{activity.AiSummaryRating}% match</Text>
          </View>
        </View>
      </View>
      
      {/* Content */}
      <View className="bg-emerald-50 p-4">
        <Text className="text-emerald-900 leading-6 mb-3">{activity.AiSummary}</Text>
        
        {/* Experience Level */}
        <View className="mb-4 bg-white rounded-xl p-3 border border-emerald-200">
          <Text className="text-emerald-800 font-bold mb-2">Experience Level</Text>
          <View className="h-2 bg-emerald-100 rounded-full overflow-hidden">
            <View 
              className="h-full bg-emerald-500" 
              style={{ width: `${Math.min((activity.AiSummaryRating || 50), 100)}%` }} 
            />
          </View>
          <View className="flex-row justify-between mt-1">
            <Text className="text-xs text-emerald-600">Beginner</Text>
            <Text className="text-xs text-emerald-600">Expert</Text>
          </View>
        </View>     
        {/* Action Buttons */}
        <View className="flex-row justify-between">
          <Pressable className="bg-white rounded-full px-4 py-2 flex-row items-center border border-emerald-200">
            <MaterialIcons name="groups" size={18} color="#059669" />
            <Text className="ml-2 text-emerald-600 font-medium">Group Size</Text>
          </Pressable>
          
          <Pressable className="bg-emerald-500 rounded-full px-4 py-2 flex-row items-center">
            <MaterialIcons name="event-available" size={18} color="#FFF" />
            <Text className="ml-2 text-white font-medium">Book Activity</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
};

export default RecreationalActivity;