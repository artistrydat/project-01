import React from 'react';
import { View, Text } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import type { UserProfile } from '~/types/profile.types';

type EcoImpactSectionProps = {
  ecoImpact?: UserProfile['EcoImpact']; // Make ecoImpact optional with ?
};

export default function EcoImpactSection({ ecoImpact }: EcoImpactSectionProps) {
  if (!ecoImpact) return null;
  
  return (
    <View className="px-4 mb-6">
      <Text className="text-lg font-semibold mb-3 text-tertiary">Eco Impact</Text>
      <View className="bg-quaternary rounded-xl p-4">
        <View className="flex-row items-center justify-between mb-4">
          <Text className="text-lg font-bold text-tertiary">Eco Score</Text>
          <View className="bg-white rounded-full w-14 h-14 items-center justify-center border-4 border-primary">
            <Text className="font-bold text-lg text-tertiary">{ecoImpact.ecoScore}</Text>
          </View>
        </View>
        
        <View className="flex-row justify-between">
          {ecoImpact.stats.map((stat, index) => (
            <View key={index} className="items-center flex-1">
              <View className="w-10 h-10 rounded-full bg-white items-center justify-center mb-2">
                <MaterialIcons name={stat.icon as any} size={20} color="#191D15" />
              </View>
              <Text className="text-xs text-center text-gray-700">{stat.label}</Text>
              <Text className="text-xs font-bold text-center text-tertiary">{stat.value}</Text>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
}