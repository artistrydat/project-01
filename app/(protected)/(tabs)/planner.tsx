import React, { useEffect, useState, useRef, useMemo } from 'react';
import { 
  View, 
  Text, 
  ScrollView, 
  SafeAreaView, 
  TouchableOpacity, 
  Animated, 
  TextInput 
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { DestinationCard } from '~/components/destination/DestinationCard';
import { useItineraryStore } from '~/store/itinerary/ItineraryStore';
import { useTheme, designTokens } from '~/contexts/ThemeContext';

export default function PlannerScreen() {
  // Access theme context
  const { colors, isDark } = useTheme();

  // Store state
  const { 
    fetchItinerary, 
    toggleFavorite,
    fetchPublicItineraries, 
    userItineraries, 
    isLoading 
  } = useItineraryStore();

  // Local state
  const [searchQuery, setSearchQuery] = useState('');
  
  // Animation for skeleton loading effect
  const shineAnim = useRef(new Animated.Value(-100)).current;

  // Shine animation for skeleton loading
  useEffect(() => {
    if (isLoading) {
      Animated.loop(
        Animated.timing(shineAnim, {
          toValue: 400,
          duration: 1500,
          useNativeDriver: true
        })
      ).start();
    } else {
      shineAnim.setValue(-100);
    }
  }, [isLoading, shineAnim]);

  // Fetch public itineraries when component mounts
  useEffect(() => {
    fetchPublicItineraries();
  }, [fetchPublicItineraries]);

  // Handle destination card press
  const handleDestinationPress = (id: string) => {
    console.log('Navigating to itinerary:', id);
    fetchItinerary(id);
    router.push(`/(protected)/destination/itinerary/${id}`);
  };

  // Handle toggle favorite
  const handleToggleFavorite = (id: string) => {
    fetchItinerary(id);
    toggleFavorite();
  };

  // Handle see all button
  const handleSeeAll = () => {
    // Navigate to a full list view or show all items
    console.log('See all plans pressed');
    // You can navigate to a dedicated screen or expand the current view
    // router.push('/(protected)/plans/all');
  };

  // Filtered itineraries based on search query
  const filteredItineraries = useMemo(() => {
    if (!searchQuery.trim()) {
      return userItineraries;
    }
    
    return userItineraries.filter(itinerary => 
      itinerary.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      itinerary.city?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      itinerary.country?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      itinerary.description?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [userItineraries, searchQuery]);

  // Skeleton loader component
  const SkeletonCard = () => (
    <View 
      className="w-full h-64 rounded-3xl mb-4 overflow-hidden"
      style={{ backgroundColor: colors.surface }}
    >
      <View className="relative w-full h-full">
        {/* Image skeleton */}
        <View 
          className="w-full h-40 rounded-t-3xl"
          style={{ backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)' }}
        />
        
        {/* Content skeleton */}
        <View className="p-4 space-y-3">
          {/* Title skeleton */}
          <View 
            className="h-4 rounded-lg"
            style={{ backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)', width: '70%' }}
          />
          
          {/* Subtitle skeleton */}
          <View 
            className="h-3 rounded-lg"
            style={{ backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)', width: '50%' }}
          />
          
          {/* Rating and price skeleton */}
          <View className="flex-row justify-between items-center">
            <View 
              className="h-3 rounded-lg"
              style={{ backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)', width: '30%' }}
            />
            <View 
              className="h-3 rounded-lg"
              style={{ backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)', width: '25%' }}
            />
          </View>
        </View>
        
        {/* Animated shine effect */}
        <Animated.View 
          className="absolute inset-0 w-20 opacity-30"
          style={{
            backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.3)',
            transform: [{translateX: shineAnim}, {skewX: '-15deg'}]
          }}
        />
      </View>
    </View>
  );

  return (
    <SafeAreaView 
      className={designTokens.colors.backgroundPrimary}
      style={{ backgroundColor: colors.background }}
    >
      <StatusBar style={isDark ? "light" : "dark"} />
      
      {/* Header */}
      <View 
        className={designTokens.colors.headerBackground + " px-6 pt-4"}
        style={{ backgroundColor: colors.background }} 
      >
        <View className="flex-row justify-between items-center">
          <View>
            <Text 
              className={designTokens.typography.pageTitle}
              style={{ color: colors.text }}
            >
              Your Plans<Text style={{ color: colors.cyber }}>.</Text>
            </Text>
            <Text 
              className={designTokens.typography.pageSubtitle}
              style={{ color: colors.textSecondary }}
            >
              Discover your next adventure ✈️
            </Text>
          </View>
          
          <View className="flex-row space-x-3">
            <TouchableOpacity 
              className={designTokens.exploration.infoTag}
              style={{ backgroundColor: colors.electric }}
            >
              <MaterialIcons name="notifications" size={24} color="white" />
              <View 
                className="absolute -top-1 -right-1 w-5 h-5 rounded-full items-center justify-center border-2"
                style={{ 
                  backgroundColor: colors.error,
                  borderColor: colors.background 
                }}
              >
                <Text 
                  className="text-xs font-black"
                  style={{ color: colors.textInverse }}
                >
                  3
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
        
        {/* Search Bar - Moved below subtitle */}
        <View className="mt-5 mb-4">
          <View 
            className="flex-row items-center rounded-2xl px-5 py-4 border-2 shadow-sm"
            style={{ 
              backgroundColor: colors.surface,
              borderColor: 'transparent'
            }}
          >
            <View 
              className="w-6 h-6 rounded-full items-center justify-center mr-3"
              style={{ backgroundColor: colors.cyber }}
            >
              <MaterialIcons name="search" size={16} color="white" />
            </View>
            <TextInput
              className="flex-1 text-base font-medium"
              style={{ color: colors.text }}
              placeholder="Search your plans..."
              placeholderTextColor={colors.textTertiary}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => setSearchQuery('')}>
                <MaterialIcons name="close" size={20} color={colors.textTertiary} />
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
      
      {/* Main Content */}
      <ScrollView 
        className="flex-1 px-6"
        showsVerticalScrollIndicator={false}
      >
        {/* Your Plans Section */}
        <View className="mt-4 mb-8">
          <View className="flex-row justify-between items-center mb-4">
            <Text 
              className={designTokens.typography.sectionTitle}
              style={{ color: colors.text }} 
            >
              🔥 Featured Destinations
            </Text>
            <TouchableOpacity 
              className="px-4 py-2 rounded-2xl"
              style={{ backgroundColor: `${colors.accent}20` }}
              onPress={handleSeeAll}
            >
              <Text 
                className="font-bold"
                style={{ color: colors.accent }}
              >
                See All
              </Text>
            </TouchableOpacity>
          </View>
          
          {isLoading ? (
            <View className="space-y-5 mt-4">
              <SkeletonCard />
              <SkeletonCard />
              <SkeletonCard />
            </View>
          ) : (
            <View className="mt-4">
              {filteredItineraries.length === 0 ? (
                <View className="py-16 items-center">
                  {searchQuery.trim() ? (
                    // Search no results state
                    <>
                      <View 
                        className="w-16 h-16 rounded-full items-center justify-center mb-4"
                        style={{ backgroundColor: colors.surface }}
                      >
                        <MaterialIcons 
                          name="search-off" 
                          size={40} 
                          color={colors.textTertiary} 
                        />
                      </View>
                      <Text 
                        className="text-lg font-bold mb-2"
                        style={{ color: colors.textSecondary }}
                      >
                        No plans found
                      </Text>
                      <Text 
                        className="text-center"
                        style={{ color: colors.textTertiary }}
                      >
                        Try a different search term
                      </Text>
                    </>
                  ) : (
                    // Empty state
                    <View 
                      className="p-8 rounded-3xl items-center"
                      style={{ backgroundColor: colors.primary }}
                    >
                      <Text className="text-6xl mb-4">🗺️</Text>
                      <Text 
                        className="text-xl font-bold mb-2 text-center"
                        style={{ color: colors.textInverse }}
                      >
                        No adventures yet!
                      </Text>
                      <Text 
                        className="text-center"
                        style={{ color: `${colors.textInverse}CC` }}
                      >
                        Start planning your next journey
                      </Text>
                    </View>
                  )}
                </View>
              ) : (
                filteredItineraries.map((itinerary) => (
                  <DestinationCard
                    key={itinerary.ititeraryId}
                    ititeraryId={itinerary.ititeraryId}
                    name={itinerary.name}
                    imageUrl={itinerary.imageUrl || 'https://via.placeholder.com/300'}
                    trendingScore={itinerary.trendingScore}
                    totalCost={itinerary.totalCost}
                    duration={itinerary.duration}                  
                    isPublic={itinerary.isPublic}
                    isFavorite={itinerary.isfavorite}
                    onPress={() => handleDestinationPress(itinerary.ititeraryId)}
                    onToggleFavorite={() => handleToggleFavorite(itinerary.ititeraryId)}
                  />
                ))
              )}
            </View>
          )}
        </View>
        
        {/* Bottom Padding */}
        <View className="h-24" />
      </ScrollView>
    </SafeAreaView>
  );
}