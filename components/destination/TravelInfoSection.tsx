// components/TravelInfoSection.tsx
import { View, Text } from 'react-native';
import { Ionicons, FontAwesome, MaterialIcons } from '@expo/vector-icons';
import { useItineraryStore } from '~/store/itinerary/ItineraryStore';

interface TravelInfoSectionProps {
  bestTime?: string;
  averageCost?: string;
  localTips?: string;
  title?: string;
}

export const TravelInfoSection = ({
  bestTime: propBestTime,
  averageCost: propAverageCost,
  localTips: propLocalTips,
  title = "Travel Information"
}: TravelInfoSectionProps = {}) => {
  const { itinerary } = useItineraryStore();
  
  // Use props if provided, otherwise fallback to itinerary data
  const bestTimeToVisit = propBestTime || itinerary?.bestTimeToVisit;
  const averageCost = propAverageCost || itinerary?.averageCost;
  const localTips = propLocalTips || itinerary?.localTips;
  
  if (!bestTimeToVisit && !averageCost && !localTips) return null;

  return (
    <View className="px-5 py-4">
      <Text className="text-2xl font-bold mb-5">{title}</Text>
      
      <View className="bg-white rounded-xl p-5">
        {bestTimeToVisit && (
          <View className="flex-row items-center mb-5">
            <View className="w-12 h-12 rounded-full bg-secondary/20 items-center justify-center mr-4">
              <Ionicons name="calendar-outline" size={22} color="#64B6AC" />
            </View>
            <View>
              <Text className="text-gray-400 text-sm mb-1">Best Time to Visit:</Text>
              <Text className="text-gray-800 font-medium text-base">{bestTimeToVisit}</Text>
            </View>
          </View>
        )}
        
        {averageCost && (
          <View className="flex-row items-center mb-5">
            <View className="w-12 h-12 rounded-full bg-secondary/20 items-center justify-center mr-4">
              <FontAwesome name="dollar" size={22} color="#64B6AC" />
            </View>
            <View>
              <Text className="text-gray-400 text-sm mb-1">Average Cost:</Text>
              <Text className="text-gray-800 font-medium text-base">{averageCost}</Text>
            </View>
          </View>
        )}
        
        {localTips && (
          <View className="flex-row items-start">
            <View className="w-12 h-12 rounded-full bg-secondary/20 items-center justify-center mr-4 mt-1">
              <MaterialIcons name="lightbulb-outline" size={22} color="#64B6AC" />
            </View>
            <View>
              <Text className="text-gray-400 text-sm mb-1">Local Tips:</Text>
              <Text className="text-gray-800 font-medium text-base">{localTips}</Text>
            </View>
          </View>
        )}
      </View>
    </View>
  );
};