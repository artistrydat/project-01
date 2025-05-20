import { 
  View, 
  Text, 
  SafeAreaView, 
  ScrollView,  
  Image, 
  Linking,
  TouchableOpacity,
} from 'react-native';
import { Stack, useLocalSearchParams, router } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useItineraryStore } from '~/store/itinerary/ItineraryStore';
import type { Activity } from '~/types/planner.types';
import {
  LandmarkActivity,
  FoodActivity,
  AccommodationActivity,
  RecreationalActivity
} from '~/components/destination/activity-types';

interface RatingVisualizerProps {
  rating: number;
}

// Custom rating visualizer component
const RatingVisualizer: React.FC<RatingVisualizerProps> = ({ rating }) => {
  return (
    <View className="flex-row items-center">
      <View className="w-28 h-3 bg-gray-200 rounded-full overflow-hidden">
        <View 
          className="h-full bg-amber-400" 
          style={{ width: `${Math.min(rating * 20, 100)}%` }} 
        />
      </View>
      <Text className="ml-3 text-amber-500 font-bold">{rating.toFixed(1)}</Text>
    </View>
  );
};

interface AiRatingVisualizerProps {
  rating: number;
}

// AI Summary Rating visualizer
const AiRatingVisualizer: React.FC<AiRatingVisualizerProps> = ({ rating }) => {
  const colors: readonly [string, string] = rating > 80 ? ['#4ADE80', '#22C55E'] : 
                                            rating > 60 ? ['#FBBF24', '#F59E0B'] :
                                            ['#F87171', '#EF4444'];
                 
  return (
    <View className="mt-5 mb-4 bg-gray-50 p-3.5 rounded-2xl border border-gray-100">
      <View className="flex-row items-center justify-between mb-1.5">
        <Text className="text-gray-700 font-semibold">AI Recommendation Score</Text>
        <Text className="font-bold text-base" style={{color: colors[1]}}>{rating}%</Text>
      </View>
      <View className="h-3.5 bg-gray-200 rounded-full overflow-hidden">
        <LinearGradient
          colors={colors}
          start={{x: 0, y: 0}}
          end={{x: 1, y: 0}}
          className="h-full rounded-full"
          style={{ width: `${rating}%` }}
        />
      </View>
    </View>
  );
};

const ActivityTypeSection: React.FC<{ activity: Activity }> = ({ activity }) => {
  switch (activity.type) {
    case 'landmark':
      return <LandmarkActivity activity={activity} />;
    case 'food':
      return <FoodActivity activity={activity} />;
    case 'accommodation':
      return <AccommodationActivity activity={activity} />;
    case 'activity':
      return <RecreationalActivity activity={activity} />;
    default:
      return null;
  }
};

const ActivityDetails = () => {
  const params = useLocalSearchParams();
  const activityId = Array.isArray(params.activityId) 
    ? params.activityId[0] 
    : params.activityId || '';

  const { activity } = useItineraryStore(state => ({
    activity: state.itinerary?.ItineraryDays
      ?.flatMap(day => day.activitys)
      .find(a => a.id === activityId)
  }));

  if (!activity) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-gray-100">
        <View className="bg-white p-8 rounded-3xl shadow-md w-5/6 items-center">
          <MaterialIcons name="search-off" size={60} color="#9CA3AF" />
          <Text className="text-2xl font-bold text-gray-800 mt-4 mb-2">Oops, Nothing Found</Text>
          <Text className="text-gray-500 text-center mb-8">We couldn&rsquo;t find the activity you&rsquo;re looking for.</Text>
          <TouchableOpacity 
            className="bg-indigo-500 py-4 px-8 rounded-full flex-row items-center"
            onPress={() => router.back()}
          >
            <MaterialIcons name="arrow-back" size={20} color="#FFF" />
            <Text className="ml-2 text-white font-medium">Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const handleOpenMaps = () => {
    const url = `https://www.google.com/maps/search/?api=1&query=${activity.location.lat},${activity.location.lng}`;
    Linking.openURL(url);
  };

  const activityTypeColors: Record<string, [string, string, string]> = {
    'landmark': ['#FEF3C7', '#F59E0B', '#92400E'],
    'food': ['#FEE2E2', '#EF4444', '#991B1B'],
    'accommodation': ['#E0E7FF', '#4F46E5', '#3730A3'],
    'activity': ['#D1FAE5', '#10B981', '#065F46']
  };
  
  const colors = activityTypeColors[activity.type] || ['#F3F4F6', '#6B7280', '#374151'];

  return (
    <SafeAreaView className="flex-1 bg-white">
      <Stack.Screen options={{ headerShown: false }} />
      
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Enhanced Header with Gradient Overlay */}
        <View className="relative h-80">
          <Image
            source={{ uri: activity.imageUrl }}
            className="w-full h-full"
            resizeMode="cover"
          />
          <LinearGradient
            colors={['rgba(0,0,0,0.1)', 'rgba(0,0,0,0.7)']}
            start={{x: 0, y: 0}}
            end={{x: 0, y: 1}}
            className="absolute inset-0"
          />
          
          {/* Header Actions */}
          <View className="absolute top-12 left-0 right-0 px-5 flex-row justify-between">
            <TouchableOpacity
              className="bg-white/95 rounded-full p-3 shadow-sm"
              onPress={() => router.back()}
            >
              <MaterialIcons name="arrow-back" size={24} color={colors[1]} />
            </TouchableOpacity>
            {/* Type Badge */}
            <View className="flex-row">
              <View 
                className="px-4 py-2 rounded-full flex-row items-center shadow-sm"
                style={{ backgroundColor: colors[0] }}
              >
                <MaterialIcons 
                  name={
                    activity.type === 'landmark' ? 'location-city' : 
                    activity.type === 'food' ? 'restaurant' :
                    activity.type === 'accommodation' ? 'hotel' : 'directions-run'
                  } 
                  size={18} 
                  color={colors[1]} 
                />
                <Text className="ml-2 font-semibold capitalize" style={{ color: colors[2] }}>
                  {activity.type}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Main Content - Curved Card Design */}
        <View className="px-5 pb-10 -mt-8">
          <View className="bg-white rounded-t-3xl p-4 pt-6 shadow-md">
            {/* Title and Rating */}
            <Text className="text-3xl font-bold text-gray-900 mb-3">
              {activity.name}
            </Text>
            
            <View className="flex-row items-center justify-between mb-5">
              <View className="flex-row items-center">
                <MaterialIcons name="star" size={22} color="#F59E0B" />
                <Text className="ml-2 text-gray-700 font-medium">
                  {activity.reviewsCount} reviews
                </Text>
              </View>
              
              <RatingVisualizer rating={activity.rating} />
            </View>

            {/* Description */}
            <Text className="text-gray-700 mb-4 leading-6 text-base">
              {activity.description}
            </Text>

            {/* Horizontal Cards Section - REDUCED VERTICAL SPACING */}
            <View className="mb-2">
              <Text className="font-semibold text-gray-900 mb-2">Activity Information</Text>
              <ScrollView 
                horizontal 
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ paddingRight: 20 }}
                className="flex-row"
              >
                {/* Tags Card - MORE COMPACT */}
                {activity.tags && activity.tags.length > 0 && (
                  <View className="mr-3 bg-gray-50 p-3 rounded-2xl border border-gray-100" style={{ width: 220 }}>
                    <View className="flex-row items-center mb-1">
                      <MaterialIcons name="local-offer" size={18} color={colors[1]} />
                      <Text className="ml-2 font-semibold text-gray-900">Tags</Text>
                    </View>
                    <View className="flex-row flex-wrap">
                      {activity.tags.map((tag, index) => (
                        <View 
                          key={index} 
                          className="mr-2 mb-1 px-3 py-1 rounded-full"
                          style={{ backgroundColor: colors[0] }}
                        >
                          <Text style={{ color: colors[2] }} className="font-medium text-sm">#{tag}</Text>
                        </View>
                      ))}
                    </View>
                  </View>
                )}

                {/* Opening Hours Card - MORE COMPACT */}
                {activity.openingHours && (
                  <View className="mr-3 bg-gray-50 p-3 rounded-2xl border border-gray-100" style={{ width: 220 }}>
                    <View className="flex-row items-center mb-1">
                      <MaterialIcons name="access-time" size={18} color={colors[1]} />
                      <Text className="ml-2 font-semibold text-gray-900">
                        {activity.type === 'accommodation' ? 'Check-in Times' : 'Opening Hours'}
                      </Text>
                    </View>
                    <View>
                      <Text className="text-gray-700 font-medium">
                        {activity.openingHours.join(' - ')}
                      </Text>
                    </View>
                  </View>
                )}

                {/* Location Card - MORE COMPACT */}
                <TouchableOpacity 
                  onPress={handleOpenMaps}
                  className="bg-gray-50 p-3 rounded-2xl border border-gray-100"
                  activeOpacity={0.7}
                  style={{ width: 220 }}
                >
                  <View className="flex-row items-center mb-1">
                    <MaterialIcons name="location-on" size={18} color="#EF4444" />
                    <Text className="ml-2 font-semibold text-gray-900">Location</Text>
                  </View>
                  <View className="flex-row items-center">
                    <Text className="text-gray-700 font-medium flex-1">
                      Tap to view on maps
                    </Text>
                    <MaterialIcons name="arrow-forward-ios" size={16} color="#9CA3AF" />
                  </View>
                </TouchableOpacity>
              </ScrollView>
            </View>

            {/* Separator - TIGHTENED WITH NEGATIVE MARGIN */}
            <View className="h-px bg-gray-100 mt-0.5" />

            {/* Enhanced Activity Type Section - INCREASED NEGATIVE MARGIN */}
            <View className="-mt-16">
              <ActivityTypeSection activity={activity} />
            {/* AI Rating Visualizer */}
            {activity.AiSummaryRating && (
              <AiRatingVisualizer rating={activity.AiSummaryRating} />
            )}
            </View>
            

          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ActivityDetails;