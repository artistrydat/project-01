import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { FontAwesome5, MaterialIcons } from '@expo/vector-icons';

type BadgesSectionProps = {
  badges: string[] | undefined;
};

export default function BadgesSection({ badges }: BadgesSectionProps) {
  return (
    <View className="px-4 mb-6">
      <Text className="text-lg font-semibold mb-3 text-tertiary">Badges</Text>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingRight: 20 }}
      >
        {badges && badges.length > 0 ? (
          badges.map((badge, index) => (
            <View key={index} className="items-center mr-4 w-16">
              <View className="w-16 h-16 rounded-full bg-secondary items-center justify-center mb-1">
                {badge === 'Traveler' && <FontAwesome5 name="plane" size={24} color="#191D15" />}
                {badge === 'Foodie' && <MaterialIcons name="restaurant" size={24} color="#191D15" />}
                {badge === 'Explorer' && <FontAwesome5 name="mountain" size={24} color="#191D15" />}
              </View>
              <Text className="text-xs text-center">{badge}</Text>
            </View>
          ))
        ) : (
          <Text className="text-gray-500">No badges yet</Text>
        )}
      </ScrollView>
    </View>
  );
}