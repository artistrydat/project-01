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
import type { ititerary } from '~/types/planner.types';

export default function ExploreScreen() {
  // Access theme context
  const { colors, isDark } = useTheme();
  
  // Store state - now using the new functions
  const { 
    fetchItinerary, 
    toggleFavorite, 
    fetchPublicItineraries, 
    isLoading,
    // New search and filter functions
    searchItineraries,
    searchItinerariesByCategory,
    fetchSharedDestinations,
    fetchPopularDestinations
  } = useItineraryStore();
  
  // Local state
  const [activeCategory, setActiveCategory] = useState('All');
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

  // Fetch data on mount
  useEffect(() => {
    fetchPublicItineraries();
  }, [fetchPublicItineraries]);

  // Event handlers
  const handleToggleFavorite = (id: string) => {
    fetchItinerary(id);
    toggleFavorite();
  };

  const handleDestinationPress = (id: string) => {
    fetchItinerary(id);
    router.push(`/(protected)/destination/itinerary/${id}`);
  };

  // Filter categories
  const categories = ['All', 'Popular', 'Beach', 'Mountain', 'City', 'Cultural'] as const;
  type CategoryType = typeof categories[number];

  // Memoized filtered data using new store functions
  const filteredFeaturedDestinations = useMemo(() => {
    let destinations = fetchSharedDestinations(); // Use shared destinations for featured section
    
    // Apply search filter
    if (searchQuery.trim()) {
      destinations = searchItineraries(searchQuery);
    }
    
    // Apply category filter
    if (activeCategory !== 'All') {
      const categoryMap: Record<Exclude<CategoryType, 'All'>, ititerary[]> = {
        'Popular': destinations.filter(d => d.trendingScore > 8),
        'Beach': searchItinerariesByCategory('beach'),
        'Mountain': searchItinerariesByCategory('mountain'),
        'City': searchItinerariesByCategory('city'),
        'Cultural': searchItinerariesByCategory('cultural')
      };
      destinations = categoryMap[activeCategory as Exclude<CategoryType, 'All'>] || destinations;
    }
    
    return destinations;
  }, [searchQuery, activeCategory, fetchSharedDestinations, searchItineraries, searchItinerariesByCategory]);

  const filteredPopularDestinations = useMemo(() => {
    let destinations = fetchPopularDestinations(); // Use public destinations for popular section
    
    // Apply search filter
    if (searchQuery.trim()) {
      destinations = destinations.filter(d => 
        d.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
        d.country.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    // Apply category filter
    if (activeCategory !== 'All') {
      const categoryMap: Record<Exclude<CategoryType, 'All'>, ititerary[]> = {
        'Popular': destinations.filter(d => d.trendingScore > 8),
        'Beach': destinations.filter(d => d.description.toLowerCase().includes('beach')),
        'Mountain': destinations.filter(d => d.description.toLowerCase().includes('mountain')),
        'City': destinations.filter(d => d.description.toLowerCase().includes('city')),
        'Cultural': destinations.filter(d => d.description.toLowerCase().includes('cultural'))
      };
      destinations = categoryMap[activeCategory as Exclude<CategoryType, 'All'>] || destinations;
    }
    
    return destinations;
  }, [searchQuery, activeCategory, fetchPopularDestinations]);

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
              Explore<Text style={{ color: colors.neon }}>.</Text>
            </Text>
            <Text 
              className={designTokens.typography.pageSubtitle}
              style={{ color: colors.textSecondary }}
            >
              Find your next adventure ✨
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
                  backgroundColor: colors.error, // bg-neon-coral
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
              backgroundColor: colors.surface, // designTokens.components.searchBar
              borderColor: 'transparent'
            }}
          >
            <View 
              className="w-6 h-6 rounded-full items-center justify-center mr-3"
              style={{ backgroundColor: colors.cyber }} // bg-gradient-cyber
            >
              <MaterialIcons name="search" size={16} color="white" />
            </View>
            <TextInput
              className="flex-1 text-base font-medium"
              style={{ color: colors.text }} // designTokens.colors.textPrimary
              placeholder="Discover your next adventure..."
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
        
        {/* Horizontal Category Selector */}
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          className="mt-2"
          contentContainerStyle={{ paddingLeft: 2, paddingRight: 24, paddingBottom: 10 }}
        >
          {categories.map((category) => (
            <TouchableOpacity 
              key={category}
              onPress={() => setActiveCategory(category)}
              className={designTokens.exploration.categoryButton + " mr-3"} 
              style={{
                backgroundColor: activeCategory === category 
                  ? colors.cyber // designTokens.colors.exploreElements.categoryActive
                  : colors.surface, // designTokens.colors.exploreElements.categoryInactive
                borderColor: activeCategory === category 
                  ? colors.neon 
                  : colors.border
              }}
            >
              <Text 
                className="font-bold"
                style={{
                  color: activeCategory === category 
                    ? colors.textInverse 
                    : colors.textSecondary
                }}
              >
                {category === 'All' ? '🌍 All' : 
                 category === 'Popular' ? '🔥 Popular' : 
                 category === 'Beach' ? '🏖️ Beach' : 
                 category === 'Mountain' ? '🏔️ Mountain' : 
                 category === 'City' ? '🏙️ City' : 
                 category === 'Cultural' ? '🏛️ Cultural' : category}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
      
      {/* Main Content */}
      <ScrollView 
        className="flex-1 px-6"
        showsVerticalScrollIndicator={false}
      >
        {/* Featured Destination - Large Card (using shared destinations) */}
        <View className="mt-4 mb-8">
          <Text 
            className={designTokens.typography.sectionTitle}
            style={{ color: colors.text }} 
          >
            ✨ Featured Destination
          </Text>
          
          {isLoading ? (
            <View className="space-y-5 mt-4">
              <SkeletonCard />
              <SkeletonCard />
              <SkeletonCard />
            </View>
          ) : (
            <View className="mt-4">
              {filteredFeaturedDestinations.length === 0 ? (
                <View className="py-16 items-center">
                  <View 
                    className={designTokens.colors.exploreElements.emptyStateIcon}
                    style={{ backgroundColor: colors.surface }}
                  >
                    <MaterialIcons 
                      name="search-off" 
                      size={40} 
                      color={colors.textTertiary} 
                    />
                  </View>
                  <Text 
                    className={designTokens.colors.textSecondary}
                    style={{ color: colors.textSecondary }}
                  >
                    No destinations found
                  </Text>
                  <Text 
                    className="text-center"
                    style={{ color: colors.textTertiary }}
                  >
                    Let&apos;s discover some amazing places! ✈️
                  </Text>
                </View>
              ) : (
                filteredFeaturedDestinations.map((itinerary) => (
                  <DestinationCard
                    key={itinerary.ititeraryId}
                    ititeraryId={itinerary.ititeraryId}
                    name={itinerary.name}
                    imageUrl={itinerary.imageUrl || 'https://via.placeholder.com/300'}
                    trendingScore={itinerary.trendingScore || 4.5}
                    totalCost={itinerary.totalCost || 200}
                    duration={itinerary.duration || 3}
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
        
        {/* Popular Destinations (using public destinations) */}
        <View className="mt-2 mb-8">
          <Text 
            className="text-2xl font-black mb-4"
            style={{ color: colors.text }} // designTokens.typography.sectionTitle
          >
            🔥 Popular Destinations
          </Text>
          
          {isLoading ? (
            <View className="space-y-5">
              <SkeletonCard />
              <SkeletonCard />
              <SkeletonCard />
            </View>
          ) : (
            <View>
              {filteredPopularDestinations.length === 0 ? (
                <View className="py-16 items-center">
                  <View 
                    className={designTokens.colors.exploreElements.emptyStateIcon}
                    style={{ backgroundColor: colors.surface }}
                  >
                    <MaterialIcons 
                      name="search-off" 
                      size={40} 
                      color={colors.textTertiary} 
                    />
                  </View>
                  <Text 
                    className={designTokens.colors.textSecondary}
                    style={{ color: colors.textSecondary }}
                  >
                    No destinations found
                  </Text>
                  <Text 
                    className="text-center"
                    style={{ color: colors.textTertiary }}
                  >
                    Let&apos;s discover some amazing places! ✈️
                  </Text>
                </View>
              ) : (
                filteredPopularDestinations.map((itinerary) => (
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