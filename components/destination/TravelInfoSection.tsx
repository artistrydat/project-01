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
    <View className="px-4 py-2">
      <Text className="text-2xl font-bold mb-5">{title}</Text>
      
      <View className="bg-white rounded-xl shadow-sm p-5">
        {bestTimeToVisit && (
          <View className="flex-row items-center mb-4">
            <View className="w-10 h-10 rounded-full bg-secondary/20 items-center justify-center mr-4">
              <Ionicons name="calendar-outline" size={20} color="#64B6AC" />
            </View>
            <View>
              <Text className="text-gray-400 text-sm">Best Time to Visit:</Text>
              <Text className="text-gray-800 font-medium">{bestTimeToVisit}</Text>
            </View>
          </View>
        )}
        
        {averageCost && (
          <View className="flex-row items-center mb-4">
            <View className="w-10 h-10 rounded-full bg-secondary/20 items-center justify-center mr-4">
              <FontAwesome name="dollar" size={20} color="#64B6AC" />
            </View>
            <View>
              <Text className="text-gray-400 text-sm">Average Cost:</Text>
              <Text className="text-gray-800 font-medium">{averageCost}</Text>
            </View>
          </View>
        )}
        
        {localTips && (
          <View className="flex-row items-start">
            <View className="w-10 h-10 rounded-full bg-secondary/20 items-center justify-center mr-4 mt-1">
              <MaterialIcons name="lightbulb-outline" size={20} color="#64B6AC" />
            </View>
            <View>
              <Text className="text-gray-400 text-sm">Local Tips:</Text>
              <Text className="text-gray-800 font-medium">{localTips}</Text>
            </View>
          </View>
        )}
      </View>
    </View>
  );
};