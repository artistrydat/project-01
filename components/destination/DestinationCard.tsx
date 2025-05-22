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
      <Image 
        source={{ uri: image }} 
        className="w-full h-72 rounded-xl" 
        resizeMode="cover"
      />
      
      <View className="p-3 bg-white rounded-b-xl">
        <Text className="text-2xl font-bold text-tertiary">
          {name}, {country}
        </Text>
        
        <View className="flex-row justify-between mt-2">
          <View className="flex-row items-center">
            <MaterialIcons  name="trending-up" size={16} color="#FFD700" />
            <Text className="text-gray-500 ml-1">Trending: {trending}%</Text>
          </View>
          {/* Eco rating could go here */}
        </View>

        <View className="flex-row justify-between mt-3">
          <TouchableOpacity 
            className="bg-primary py-2 px-8 rounded-full"
            onPress={onPress}
          >
            <Text className="text-tertiary font-medium">More Info</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            onPress={onToggleFavorite}
            className="p-2"
          >
            <MaterialIcons 
              name={isFavorite ? "favorite" : "favorite-outline"} 
              size={24} 
              color="#2C3E50" 
            />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default DestinationCard;