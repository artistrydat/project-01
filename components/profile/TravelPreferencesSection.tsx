import React from 'react';
import { View, Text, Pressable } from 'react-native';
import type { UserProfile } from '~/types/profile.types';

type TravelPreferencesSectionProps = {
  travelPreferences?: UserProfile['travelPreferences']; // Make travelPreferences optional with ?
  onEditPreferences: () => void;
};

export default function TravelPreferencesSection({ 
  travelPreferences, 
  onEditPreferences 
}: TravelPreferencesSectionProps) {
  if (!travelPreferences) return (
    <View className="px-4 mb-6">
      <View className="flex-row justify-between items-center mb-3">
        <Text className="text-lg font-semibold text-tertiary">Travel Preferences</Text>
        <Pressable 
          className="bg-tertiary py-1 px-3 rounded-full"
          onPress={onEditPreferences}
        >
          <Text className="text-white text-xs">Edit</Text>
        </Pressable>
      </View>
      <Text className="text-gray-500">No preferences set yet</Text>
    </View>
  );
  
  return (
    <View className="px-4 mb-6">
      <View className="flex-row justify-between items-center mb-3">
        <Text className="text-lg font-semibold text-tertiary">Travel Preferences</Text>
        <Pressable 
          className="bg-tertiary py-1 px-3 rounded-full"
          onPress={onEditPreferences}
        >
          <Text className="text-white text-xs">Edit</Text>
        </Pressable>
      </View>
      
      <View className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
        <View className="flex-row flex-wrap mb-4">
          {travelPreferences.travelStyles?.map((style, index) => (
            <View key={index} className="bg-quaternary rounded-full px-3 py-1 mr-2 mb-2">
              <Text className="text-xs">{style}</Text>
            </View>
          ))}
          
          {travelPreferences.preferredActivities?.map((activity, index) => (
            <View key={index} className="bg-secondary rounded-full px-3 py-1 mr-2 mb-2">
              <Text className="text-xs">{activity}</Text>
            </View>
          ))}
        </View>
        
        <View className="flex-row mb-2">
          <View className="flex-1 mr-2">
            <Text className="text-xs text-gray-500 mb-1">Budget Range</Text>
            <Text className="text-sm">
              {travelPreferences.budgetRange ? 
                `$${travelPreferences.budgetRange.min} - $${travelPreferences.budgetRange.max}` : 
                "Not specified"}
            </Text>
          </View>
          
          <View className="flex-1 ml-2">
            <Text className="text-xs text-gray-500 mb-1">Eco-Friendly</Text>
            <Text className="text-sm">
              {travelPreferences.ecoFriendlyPreferences ? "Yes 🌱" : "No"}
            </Text>
          </View>
        </View>
        
        <View className="mb-2">
          <Text className="text-xs text-gray-500 mb-1">Travel With</Text>
          <View className="flex-row">
            {travelPreferences.travelCompanions?.map((companion, index) => (
              <Text key={index} className="text-sm mr-2">
                {companion}
                {index < travelPreferences.travelCompanions.length - 1 ? "," : ""}
              </Text>
            ))}
          </View>
        </View>
        
        <View className="mb-2">
          <Text className="text-xs text-gray-500 mb-1">Languages</Text>
          <View className="flex-row">
            {travelPreferences.languagePreferences?.map((lang, index) => (
              <Text key={index} className="text-sm mr-2">
                {lang}
                {index < travelPreferences.languagePreferences.length - 1 ? "," : ""}
              </Text>
            ))}
          </View>
        </View>
      </View>
    </View>
  );
}