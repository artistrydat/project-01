import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import type { EcoImpactDashboardProps } from '../../types/ui.types';

export default function EcoImpactDashboard({
  ecoScore,
  itineraryId,
}: EcoImpactDashboardProps) {
  // Mock stats for eco impact - in a real app this would be calculated
  const stats = [
    { label: 'Carbon footprint', value: '2.3 tons CO2', icon: 'eco' },
    { label: 'Sustainable choices', value: '68%', icon: 'thumb-up' },
    { label: 'Local businesses supported', value: '12', icon: 'store' },
  ];

  // Determine color based on eco score
  const getScoreColor = () => {
    if (ecoScore >= 80) return 'text-green-600';
    if (ecoScore >= 60) return 'text-amber-600';
    return 'text-red-600';
  };

  // Determine background color based on eco score
  const getScoreBackgroundColor = () => {
    if (ecoScore >= 80) return 'bg-green-100';
    if (ecoScore >= 60) return 'bg-amber-100';
    return 'bg-red-100';
  };

  return (
    <View className="bg-quinary rounded-xl p-4 border border-primary">
      <View className="flex-row items-center mb-4">
        <View className={`w-16 h-16 rounded-full ${getScoreBackgroundColor()} items-center justify-center mr-3`}>
          <Text className={`text-2xl font-bold ${getScoreColor()}`}>{ecoScore}</Text>
        </View>
        
        <View className="flex-1">
          <Text className="text-gray-800 font-medium">Eco-Impact Score</Text>
          <Text className="text-gray-500 text-sm">Based on your trip choices</Text>
          
          <View className="flex-row items-center mt-1">
            <MaterialIcons 
              name={ecoScore >= 80 ? 'emoji-emotions' : ecoScore >= 60 ? 'sentiment-satisfied' : 'sentiment-dissatisfied'} 
              size={18} 
              color={ecoScore >= 80 ? '#10B981' : ecoScore >= 60 ? '#F59E0B' : '#EF4444'} 
            />
            <Text className={`ml-1 text-sm ${getScoreColor()}`}>
              {ecoScore >= 80 ? 'Excellent' : ecoScore >= 60 ? 'Good' : 'Needs Improvement'}
            </Text>
          </View>
        </View>
      </View>
      
      {/* Stats */}
      <View className="bg-primary rounded-lg p-3 mb-3">
        {stats.map((stat, index) => (
          <View 
            key={index} 
            className={`flex-row items-center py-2 ${
              index < stats.length - 1 ? 'border-b border-quaternary' : ''
            }`}
          >
            <MaterialIcons name={stat.icon as any} size={20} color="#1E493B" />
            <Text className="flex-1 ml-2 text-quaternary">{stat.label}</Text>
            <Text className="font-medium text-tertiary">{stat.value}</Text>
          </View>
        ))}
      </View>
      
      {/* Tips */}
      <View className="bg-green-50 rounded-lg p-3 mb-3">
        <View className="flex-row items-center">
          <MaterialIcons name="lightbulb" size={20} color="#10B981" />
          <Text className="ml-2 text-green-800 font-medium">Travel Tip</Text>
        </View>
        <Text className="text-green-700 mt-1">
          Consider using public transportation tomorrow to reduce your carbon footprint by up to 30%.
        </Text>
      </View>
      
      <Pressable 
        className="flex-row items-center justify-center mt-1"
      >
        <Text className="text-indigo-600 font-medium">View detailed eco report</Text>
        <MaterialIcons name="chevron-right" size={18} color="#4F46E5" />
      </Pressable>
    </View>
  );
}
