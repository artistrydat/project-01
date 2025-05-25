import React from 'react';
import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

type TravelJourneySectionProps = {
  travelHistory: string[] | undefined;
  travelGoals: string[] | undefined;
};

export default function TravelJourneySection({ travelHistory, travelGoals }: TravelJourneySectionProps) {
  return (
    <View className="px-4 mb-6">
      <Text className="text-lg font-semibold mb-3 text-tertiary">Travel Journey</Text>
      
      <View className="flex-row mb-4">
        {/* History */}
        <View className="flex-1 bg-white rounded-xl p-3 mr-2 shadow-sm border border-primary">
          <Text className="text-sm font-semibold mb-2 text-tertiary">Been To</Text>
          <View className="flex-row flex-wrap">
            {travelHistory && travelHistory.length > 0 ? (
              travelHistory.map((place, index) => (
                <View key={index} className="bg-primary rounded-lg px-3 py-1 mr-2 mb-2 flex-row items-center">
                  <Ionicons name="checkmark-circle" size={12} color="#191D15" />
                  <Text className="text-xs ml-1">{place}</Text>
                </View>
              ))
            ) : (
              <Text className="text-gray-500 text-xs">No travel history</Text>
            )}
          </View>
        </View>
        
        {/* Goals */}
        <View className="flex-1 bg-white rounded-xl p-3 ml-2 shadow-sm border border-primary">
          <Text className="text-sm font-semibold mb-2 text-tertiary">Want To Go</Text>
          <View className="flex-row flex-wrap">
            {travelGoals && travelGoals.length > 0 ? (
              travelGoals.map((goal, index) => (
                <View key={index} className="bg-secondary rounded-lg px-3 py-1 mr-2 mb-2 flex-row items-center">
                  <Ionicons name="heart" size={12} color="#191D15" />
                  <Text className="text-xs ml-1">{goal}</Text>
                </View>
              ))
            ) : (
              <Text className="text-gray-500 text-xs">No travel goals</Text>
            )}
          </View>
        </View>
      </View>
    </View>
  );
}