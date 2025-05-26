import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import type { ItineraryDay } from '~/types/planner.types';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useItineraryStore } from '~/store/itinerary/ItineraryStore';
import { router } from 'expo-router';
// Add new import for date formatting
import { format, parseISO } from 'date-fns';

interface ActivityListProps {
  days: ItineraryDay[];
  destinationId: string;
}

// Type-safe icon getter remains unchanged
const getActivityIcon = (type: string): {
  name: any;
  color: string;
  Component: typeof Ionicons | typeof MaterialIcons;
} => {
  switch (type) {
    case 'landmark':
      return { name: 'location', color: '#F97316', Component: Ionicons };
    case 'activity':
      return { name: 'walk', color: '#10B981', Component: Ionicons };
    case 'food':
      return { name: 'restaurant', color: '#EC4899', Component: MaterialIcons };
    case 'accommodation':
      return { name: 'hotel', color: '#6366F1', Component: MaterialIcons };
    default:
      return { name: 'bookmark', color: '#9CA3AF', Component: Ionicons };
  }
};

export const ActivityList = ({ days, destinationId }: ActivityListProps) => {  
  const { 
    upvoted, 
    downvoted, 
    toggleUpvote, 
    toggleDownvote, 
    DeleteActivity,
    calculateTotalCost,
    calculateDayCost,
    getTotalActivitiesCount
  } = useItineraryStore();
  
  // Helper function to format dates
  const formatDate = (dateString: string) => {
    try {
      // Try to parse the date string
      const date = parseISO(dateString);
      // Format as "Monday, Jan 15" or similar
      return format(date, 'EEEE, MMM d');
    } catch {
      // Fallback to original string if parsing fails
      return dateString;
    }
  };
  
  // Get total cost and activities count from store
  const totalTripCost = calculateTotalCost();
  const totalActivities = getTotalActivitiesCount();
  
  return (
    <View className="flex-1">
      {/* Trip Summary Header - keep this */}
      <View className="bg-white rounded-lg p-4 mb-4 shadow-md">
        <Text className="text-2xl font-bold mb-4">Trip Activities</Text>
        <View className="flex-row justify-between items-center">
          <View className="flex-row items-center">
            <Ionicons name="calendar" size={20} color="#1E493B" />
            <Text className="text-gray-700 ml-2 font-medium">
              {totalActivities} {totalActivities === 1 ? 'Activity' : 'Activities'}
            </Text>
          </View>
          <View className="flex-row items-center bg-yellow-100 px-3 py-2 rounded-lg">
            <Text className="text-gray-700 mr-1">Total Cost:</Text>
            <Text className="text-gray-800 font-bold">${totalTripCost}</Text>
          </View>
        </View>
      </View>
      
      {days.map((day) => {
        // Get day cost from the store instead of calculating locally
        const totalCost = calculateDayCost(day.id);
        
        // Count activities by type
        const activityCounts = day.activitys.reduce((counts, activity) => {
          counts[activity.type] = (counts[activity.type] || 0) + 1;
          return counts;
        }, {} as Record<string, number>);
        
        return (
          <View key={day.id} className="mb-6">
            {/* REMOVE FIRST DUPLICATE HEADER */}
            
            {/* Activities List with proper header */}
            <View className="bg-white border border-primary rounded-lg">
              {/* Keep only this Day Header */}
              <View className="bg-primary rounded-t-lg p-4">
                <View className="flex-row justify-between items-center">
                  <View className="flex-row items-center">
                    <View className="bg-yellow-100 w-8 h-8 rounded-full items-center justify-center mr-2">
                      <Text className="text-gray-800 font-bold">{day.id}</Text>
                    </View>
                    <View>
                      <Text className="text-gray-800 text-lg font-bold">{formatDate(day.date)}</Text>
                      <Text className="text-gray-600 text-xs">Day {day.id} of your journey</Text>
                    </View>
                  </View>
                  <View className="flex-row items-center">
                    <Text className="text-gray-700 mr-1">Total: </Text>
                    <Text className="text-gray-800 font-bold bg-yellow-100 px-2 py-1 rounded-lg">${totalCost}</Text>
                  </View>
                </View>
              </View>
              
              {/* Rest of the code remains unchanged */}
              <View className="pt-4 pb-2">
                <ScrollView 
                  horizontal 
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 8 }}
                >
                  {day.activitys.map((activity) => {
                    const activityIcon = getActivityIcon(activity.type);
                    
                    // Calculate upvote/downvote counts with user interactions
                    const activityUpvoteCount = activity.upvoteCount + (upvoted[activity.id] ? 1 : 0);
                    const activityDownvoteCount = activity.downvoteCount + (downvoted[activity.id] ? 1 : 0);
                    
                    return (
                      <View 
                        key={activity.id} 
                        className="mb-4 rounded-lg shadow-sm border border-gray-200 mr-4 w-64"
                        style={{ backgroundColor: '#ffffff' }}
                      >
                        {/* Activity content - improved padding */}
                        <View className="p-4">
                          {/* Top content section */}
                          <View className="flex-1">
                            {/* Activity Header */}
                            <View className="flex-row justify-between items-start">
                              <View className="flex-row items-start flex-1">
                                <View className="mr-3 mt-1">
                                  <activityIcon.Component 
                                    name={activityIcon.name as any}
                                    size={20} 
                                    color={activityIcon.color} 
                                  />
                                </View>
                                <View className="flex-1">
                                  <Text className="text-gray-800 text-lg font-bold mb-1">
                                    {activity.name}
                                  </Text>
                                  <Text className="text-gray-600 text-sm">
                                    {activity.description}
                                  </Text>
                                </View>
                              </View>
                              
                              <View className="bg-green-800 px-2 py-1 rounded-full">
                                <Text className="text-white font-bold">${activity.cost || 0}</Text>
                              </View>
                            </View>
                            
                            {/* Tags Section */}
                            {activity.tags && activity.tags.length > 0 && (
                              <View className="flex-row flex-wrap mt-2">
                                {activity.tags.map((tag, index) => (
                                  <View key={index} className="bg-gray-200 rounded-full px-2 py-1 mr-2 mb-2">
                                    <Text className="text-xs text-gray-700">#{tag}</Text>
                                  </View>
                                ))}
                              </View>
                            )}
                          </View>
                          
                          {/* Line separator */}
                          <View className="border-t border-gray-200 my-3"></View>
                          
                          {/* Activity Actions - improved spacing */}
                          <View className="flex-row items-center">
                            <TouchableOpacity className="mr-3 p-1" 
                              onPress={() => {
                                console.log(`Map button clicked for ${activity.name} (${activity.id})`);
                                router.push({
                                  pathname: "/destination/map" as any,
                                  params: {
                                    lat: activity.location.lat,
                                    lng: activity.location.lng,
                                    name: activity.name,
                                    id: activity.id,
                                    type: activity.type,
                                    description: activity.description,
                                    imageUrl: activity.imageUrl,
                                  },
                                });
                              }}
                            >
                              <Ionicons name="bookmark" size={18} color="#666" />
                            </TouchableOpacity>

                            <TouchableOpacity className="mr-3 p-1"
                              onPress={() => {
                                DeleteActivity(activity.id);
                                console.log(`Delete button clicked for ${activity.name} (${activity.id})`);
                              }}
                            >
                              <MaterialIcons name="delete" size={18} color="#666" />
                            </TouchableOpacity>

                            <TouchableOpacity className="mr-2 flex-row items-center p-1"
                              onPress={() => {
                                toggleUpvote(activity.id);
                                console.log(`Upvote button clicked for ${activity.name} (${activity.id})`);
                              }}
                            >
                              <Ionicons name="thumbs-up" size={18} color={upvoted[activity.id] ? "#3B82F6" : "#333"} />
                              <Text className="ml-1">{activityUpvoteCount}</Text>
                            </TouchableOpacity>
                            <TouchableOpacity className="flex-row items-center p-1"
                              onPress={() => {
                                toggleDownvote(activity.id);
                                console.log(`Downvote button clicked for ${activity.name} (${activity.id})`);
                              }}
                            >
                              <Ionicons name="thumbs-down" size={18} color={downvoted[activity.id] ? "#EF4444" : "#333"} />
                              <Text className="ml-1">{activityDownvoteCount}</Text>
                            </TouchableOpacity>
                            <View className="flex-grow items-end">
                              <TouchableOpacity
                                className="p-1"
                                onPress={() => {
                                  console.log(`explore button clicked for ${activity.name} (${activity.id})`)
                                  router.push({
                                    pathname: '/destination/activity/[activityId]' as any,
                                    params: { 
                                      id: destinationId,
                                      activityId: activity.id
                                    }
                                  });
                                }}
                              >
                                <MaterialIcons name="travel-explore" size={18} color="#666" />
                              </TouchableOpacity>
                            </View>
                          </View>
                        </View>
                      </View>
                    );
                  })}
                </ScrollView>
              </View>

              {/* Day Summary remains unchanged */}
              <View className="flex-row justify-between items-center py-3 px-4 border-t border-gray-200 bg-gray-50 rounded-b-lg">
                <View className="flex-row items-center">
                  <Ionicons name="time" size={18} color="#666" />
                  <Text className="text-gray-600 text-sm ml-1">
                    {day.activitys.length} {day.activitys.length === 1 ? 'activity' : 'activities'}
                  </Text>
                </View>
                <View className="flex-row items-center">
                  {/* Display count for each type of activity */}
                  {Object.keys(activityCounts).map((type) => {
                    const icon = getActivityIcon(type);
                    return (
                      <View key={type} className="flex-row items-center ml-3">
                        <icon.Component name={icon.name as any} size={18} color={icon.color} />
                        <Text className="text-gray-600 text-sm ml-1">{activityCounts[type]}</Text>
                      </View>
                    );
                  })}
                </View>
              </View>
            </View>
          </View>
        );
      })}
    </View>
  );
};