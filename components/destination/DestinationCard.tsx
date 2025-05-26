import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

interface DestinationProps {
  id: string;
  name: string;
  country: string;
  image: string;
  trending: number;
  eco: number;
  isFavorite: boolean;
  onToggleFavorite: () => void;
  onPress: () => void;
}

const DestinationCard = ({
  id,
  name,
  country,
  image,
  trending,
  eco,
  isFavorite,
  onToggleFavorite,
  onPress,
}: DestinationProps) => {
  return (
    <View className="w-full rounded-xl mb-6 overflow-hidden">
      <View className="relative">
        <Image 
          source={{ uri: image }} 
          className="w-full h-72 rounded-xl" 
          resizeMode="cover"
        />
        
        {/* Favorite button on top right */}
        <TouchableOpacity 
          onPress={onToggleFavorite}
          className="absolute top-2 right-2 bg-white/70 p-2 rounded-full"
        >
          <MaterialIcons 
            name={isFavorite ? "favorite" : "favorite-outline"} 
            size={24} 
            color={isFavorite ? "#FF385C" : "#2C3E50"} 
          />
        </TouchableOpacity>
      </View>
      
      <View className="p-3 bg-white rounded-b-xl">
        <Text className="text-2xl font-bold text-tertiary">
          {name}, {country}
        </Text>
        
        <View className="flex-row justify-between mt-2">
          <View className="flex-row items-center">
            <MaterialIcons name="trending-up" size={16} color="#FFD700" />
            <Text className="text-gray-500 ml-1">Trending: {trending}%</Text>
          </View>
          
          <View className="flex-row items-center">
            <MaterialIcons name="eco" size={16} color="#4CAF50" />
            <Text className="text-gray-500 ml-1">Eco-friendly: {eco}/100</Text>
          </View>
        </View>

        <Text className="text-gray-600 mt-2 mb-3" numberOfLines={2}>
          A beautiful destination with unique experiences waiting for you to explore.
        </Text>

        <TouchableOpacity 
          className="bg-primary py-2 px-8 rounded-full self-start"
          onPress={onPress}
        >
          <Text className="text-tertiary font-medium">More Info</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default DestinationCard;