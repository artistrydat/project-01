import { View, Text, Image, Pressable } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import type { ititerary } from '~/types/planner.types';

interface DestinationCardProps {
  itinerary: ititerary;
  onPress?: () => void;
}

export default function DestinationCard({ itinerary, onPress }: DestinationCardProps) {

  return (
    <Pressable onPress={onPress} className="bg-white rounded-lg overflow-hidden shadow-sm mb-1">
      <Image
        source={{ uri: itinerary.imageUrl }}
        className="w-full h-48"
        resizeMode="cover" />
      <View className="p-3">
        <Text className="text-xl font-bold text-tertiary">{`${itinerary.city}, ${itinerary.country}`}</Text>
        <View className="flex-row justify-between mt-2">
          <View className="flex-row items-center">
            <MaterialIcons name="trending-up" size={18} color="#EBFA9F" />
            <Text className="ml-1 text-sm text-quaternary">
              Trending: {itinerary.trendingScore}%
            </Text>
          </View>
          <View className="flex-row items-center">
            <MaterialIcons name="eco" size={18} color="#C6E7E3" />
            <Text className="ml-1 text-sm text-quaternary">
              Eco: {itinerary.ecoScore}%
            </Text>
          </View>
        </View>
        <View className="mt-3 flex-row justify-between items-center">
          <View className="bg-primary px-2 py-1 rounded-full">
            <Text className="text-xs text-quaternary">Popular Now</Text>
          </View>
          <MaterialIcons name="bookmark-border" size={24} color="#1E493B" />
        </View>
      </View>
    </Pressable>
  );
}
