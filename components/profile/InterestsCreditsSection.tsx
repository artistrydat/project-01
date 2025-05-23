import React from 'react';
import { View, Text } from 'react-native';

type InterestsCreditsSectionProps = {
  interests: string[] | undefined;
  credits: number | undefined;
};

export default function InterestsCreditsSection({ interests, credits }: InterestsCreditsSectionProps) {
  return (
    <View className="px-4 mb-6 flex-row">
      {/* Interests */}
      <View className="flex-1 bg-secondary rounded-xl p-4 mr-2">
        <Text className="text-sm font-semibold mb-2 text-tertiary">Interests</Text>
        <View className="flex-row flex-wrap">
          {interests && interests.length > 0 ? (
            interests.map((interest, index) => (
              <View key={index} className="bg-white rounded-full px-3 py-1 mr-2 mb-2">
                <Text className="text-xs">{interest}</Text>
              </View>
            ))
          ) : (
            <Text className="text-gray-500 text-xs">No interests yet</Text>
          )}
        </View>
      </View>
      
      {/* Credits */}
      <View className="flex-1 bg-secondary rounded-xl p-4 ml-2">
        <Text className="text-sm font-semibold mb-2 text-tertiary">Credits</Text>
        <View className="items-center justify-center flex-1">
          <Text className="text-3xl font-bold text-tertiary">{credits || 0}</Text>
          <Text className="text-xs text-gray-700">Available</Text>
        </View>
      </View>
    </View>
  );
}