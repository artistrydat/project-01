// components/HeaderSection.tsx
import { View, Text, Image, Pressable, Share, Platform } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useItineraryStore } from '~/store/itinerary/ItineraryStore';
import * as Linking from 'expo-linking';

interface HeaderSectionProps {
  name?: string;
  imageUrl?: string;
  isFavorite?: boolean;
  trendingScore?: number;
  ecoScore?: number;
  description?: string;
  onToggleFavorite?: () => void;
  onShare?: () => void;
}

export const HeaderSection = ({
  name,
  imageUrl,
  isFavorite,
  trendingScore,
  ecoScore,
  description,
  onToggleFavorite,
  onShare
}: HeaderSectionProps = {}) => {
  const { itinerary, toggleFavorite } = useItineraryStore();
  
  // Use props if provided, otherwise fallback to itinerary data
  const displayName = name || itinerary?.name;
  const displayImageUrl = imageUrl || itinerary?.imageUrl;
  const displayIsFavorite = isFavorite !== undefined ? isFavorite : itinerary?.isfavorite;
  const displayTrendingScore = trendingScore || itinerary?.trendingScore;
  const displayEcoScore = ecoScore || itinerary?.ecoScore;
  const displayDescription = description || itinerary?.description;
  
  if (!displayName || !displayImageUrl) return null;
  
  const handleShare = async () => {
    if (onShare) {
      onShare();
    } else {
      try {
        // Create a deep link URL to this destination
        // Fix for TypeScript error: Use optional chaining and provide fallback for ID
        const destinationId = itinerary?.ititeraryId || 'unknown';
        
        const url = Linking.createURL(`destination/${destinationId}`, {
          queryParams: { 
            name: displayName,
            source: 'share'
          }
        });
        
        console.log("Generated deep link:", url);
        
        // Use React Native's Share API to share the URL
        await Share.share(
          Platform.OS === 'ios' 
            ? {
                url: url,
              }
            : {
                message: `Check out ${displayName} on our travel app! ${url}`,
              }, 
          {
            dialogTitle: `Share ${displayName}`
          }
        );
      } catch (error) {
        console.error('Error sharing via deep link:', error);
      }
    }
  };

  const handleToggleFavorite = () => {
    if (onToggleFavorite) {
      onToggleFavorite();
      console.log(`Toggled favorite for ${displayName}`);
    } else {
      toggleFavorite();
      console.log(`Toggled favorite for itinerary ID: ${itinerary?.ititeraryId}`);
    }
  };

  return (
    <View className="relative h-72 mb-4">
      {/* Background Image */}
      <Image
        source={{ uri: displayImageUrl }}
        className="w-full h-full"
        resizeMode="cover"
      />
      
      {/* Back Button */}
      <Pressable 
        className="absolute top-10 left-4 bg-quinary/80 rounded-full p-2"
        onPress={() => router.back()}
      >
        <MaterialIcons name="arrow-back" size={24} color="#1E493B" />
      </Pressable>
      
      {/* Action Buttons */}
      <View className="absolute top-10 right-4 items-center">
        <Pressable 
          className={`rounded-full p-2 mb-2 ${displayIsFavorite ? 'bg-secondary' : 'bg-white/80'}`}
          onPress={handleToggleFavorite}
        >
          <MaterialIcons 
            name={displayIsFavorite ? "favorite" : "favorite-outline"} 
            size={24} 
            color={displayIsFavorite ? "#191D15" : "#333"} 
          />
        </Pressable>
        
        <Pressable 
          className="bg-white/80 rounded-full p-2"
          onPress={handleShare}
        >
          <MaterialIcons name="connect-without-contact" size={20} color="#333" />
        </Pressable>
      </View>
      
      {/* Bottom Info Overlay */}
      <View className="absolute bottom-0 left-0 right-0 bg-black/50 p-4">
        <Text className="text-white text-2xl font-bold">{displayName}</Text>
        <View className="flex-row mt-1">
          <View className="flex-row items-center mr-4">
            <MaterialIcons name="trending-up" size={16} color="#EBFA9F" />
            <Text className="ml-1 text-white text-sm">
              Trending: {displayTrendingScore}%
            </Text>
          </View>
          <View className="flex-row items-center">
            <MaterialIcons name="eco" size={16} color="#C6E7E3" />
            <Text className="ml-1 text-white text-sm">
              Eco: {displayEcoScore}%
            </Text>
          </View>
        </View>
      </View>
      
      {/* Description (below image) */}
      {displayDescription && (
        <View className="mb-6">
          <Text className="text-lg text-gray-800 leading-6">{displayDescription}</Text>
        </View>
      )}
    </View>
  );
};