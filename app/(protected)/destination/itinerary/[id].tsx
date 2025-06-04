import { ScrollView, SafeAreaView, View, Animated, Dimensions, RefreshControl, Text, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { useItineraryStore } from '~/store/itinerary/ItineraryStore';
import { HeaderSection } from '~/components/destination/HeaderSection';
import { WeatherForecast } from '~/components/destination/WeatherForecast';
import { TravelInfoSection } from '~/components/destination/TravelInfoSection';
import { HighlightsSection } from '~/components/destination/HighlightsSection';
import { ActivityList } from '~/components/destination/ActivityList';
import { CommentsSection } from '~/components/destination/CommentsSection';
import { LoadingView } from '~/components/ui/LoadingView';
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useTheme } from '~/contexts/ThemeContext';
import { TravelTips } from '~/components/destination/TravelTips';

export default function ItineraryScreen() {
  const { id } = useLocalSearchParams();
  const {
    itinerary,
    fetchItinerary,
    toggleFavorite,
    calculateTotalCost,
    getTotalActivitiesCount
  } = useItineraryStore();
  const { colors } = useTheme();

  const scrollY = useRef(new Animated.Value(0)).current;
  const screenWidth = Dimensions.get('window').width;
  const cardWidth = screenWidth * 0.75;
  const [refreshing, setRefreshing] = useState(false);

  const memoizedFetchItinerary = useCallback(fetchItinerary, [fetchItinerary]);

  useEffect(() => {
    if (id) {
      memoizedFetchItinerary(id as string);
    }
  }, [id, memoizedFetchItinerary]);

  const onRefresh = async () => {
    setRefreshing(true);
    if (id) {
      await memoizedFetchItinerary(id as string);
    }
    setRefreshing(false);
  };

  const handleBack = useCallback(() => {
    router.back();
  }, []);

  const handleShare = useCallback(() => {
    console.log('Share itinerary');
  }, []);

  if (!itinerary) return <LoadingView />;

  const headerImageOpacity = scrollY.interpolate({
    inputRange: [0, 200],
    outputRange: [1, 0.85],
    extrapolate: 'clamp',
  });
  const transformedWeatherData = itinerary.ItineraryDays?.flatMap(day =>
    day.weather?.map(forecast => ({
      day: new Date(forecast.date).toLocaleDateString('en-US', { weekday: 'short' }),
      date: forecast.date,
      high: forecast.high,
      low: forecast.low,
      condition: forecast.summary,
      icon: forecast.icon,
      precipitation: Math.floor(Math.random() * 40)
    })) || []
  ) || [];

  const transformedActivityDays = itinerary.ItineraryDays?.map((day, index) => ({
    id: day.id,
    day: index + 1,
    title: `Day ${index + 1} - ${new Date(day.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`,
    date: day.date,
    activities: day.activitys || [],
    weather: day.weather || []
  })) || [];

  const localTipsArray = typeof itinerary.localTips === 'string'
    ? [itinerary.localTips]
    : Array.isArray(itinerary.localTips)
      ? itinerary.localTips
      : [];

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      {/* Header */}
      <View 
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingHorizontal: 24,
          paddingVertical: 16,
          borderBottomWidth: 1,
          borderBottomColor: colors.border,
          backgroundColor: colors.surface
        }}
      >
        <TouchableOpacity 
          style={{
            backgroundColor: colors.cyber,
            padding: 12,
            borderRadius: 16,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.3,
            shadowRadius: 8,
            elevation: 8
          }}
          onPress={handleBack}
        >
          <MaterialIcons name="arrow-back" size={20} color="white" />
        </TouchableOpacity>
        <Text style={{ 
          fontSize: 24, 
          fontWeight: 'bold',
          textAlign: 'center',
          flex: 1,
          marginLeft: 16,
          color: colors.text
        }}>
          Itinerary Details<Text style={{ color: colors.accent }}>.</Text>
        </Text>
        <TouchableOpacity
          style={{
            backgroundColor: colors.electric,
            padding: 12,
            borderRadius: 16,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.3,
            shadowRadius: 8,
            elevation: 8
          }}
          onPress={handleShare}
        >
          <MaterialIcons name="share" size={20} color="white" />
        </TouchableOpacity>
      </View>

      <Animated.ScrollView
        style={{ flex: 1 }}
        showsVerticalScrollIndicator={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: true }
        )}
        scrollEventThrottle={16}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.neon}
            colors={[colors.neon, colors.cyber]}
          />
        }
      >
        <Animated.View style={{ opacity: headerImageOpacity }}>
          <HeaderSection
            name={itinerary.name}
            imageUrl={itinerary.imageUrl}
            isFavorite={itinerary.isfavorite}
            trendingScore={itinerary.trendingScore}
            ecoScore={itinerary.ecoScore}
            description={itinerary.description}
            onToggleFavorite={toggleFavorite}
          />
        </Animated.View>

        {/* Cards Section */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 20 }}
          snapToInterval={cardWidth + 20}
          decelerationRate="fast"
          style={{ paddingVertical: 24 }}
        >
          {/* Highlights Card - Always show since HighlightsSection handles empty state internally */}
          <View
            style={{
              width: cardWidth,
              marginRight: 20,
              backgroundColor: colors.surface,
              borderRadius: 24,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 8 },
              shadowOpacity: 0.25,
              shadowRadius: 16,
              elevation: 8,
              overflow: 'hidden',
              borderWidth: 1,
              borderColor: colors.border,
            }}
          >
            <HighlightsSection
              onHighlightPress={(highlight) =>
                console.log('Highlight pressed:', highlight)
              }
            />
          </View>

          {/* Weather Forecast Card */}
          {transformedWeatherData.length > 0 && (
            <View
              style={{
                width: cardWidth,
                marginRight: 20,
                backgroundColor: colors.surface,
                borderRadius: 24,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 8 },
                shadowOpacity: 0.25,
                shadowRadius: 16,
                elevation: 8,
                overflow: 'hidden',
                borderWidth: 1,
                borderColor: colors.border,
              }}
            >
              <WeatherForecast
                forecasts={transformedWeatherData}
                currentTemp={transformedWeatherData[0]?.high || 25}
                currentCondition={transformedWeatherData[0]?.condition || 'sunny'}
                location={`${itinerary.city}, ${itinerary.country}`}
              />
            </View>
          )}

          {/* Travel Info Card */}
          <View
            style={{
              width: cardWidth,
              marginRight: 20,
              backgroundColor: colors.surface,
              borderRadius: 24,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 8 },
              shadowOpacity: 0.25,
              shadowRadius: 16,
              elevation: 8,
              overflow: 'hidden',
              borderWidth: 1,
              borderColor: colors.border,
            }}
          >
            <TravelInfoSection
              bestTime={itinerary.bestTimeToVisit}
              averageCost={itinerary.averageCost}
              totalCost={calculateTotalCost()}
              duration={itinerary.duration}
              activitiesCount={getTotalActivitiesCount()}
            />
          </View>

          {/* Local Tips Card */}
          <View
            style={{
              width: cardWidth,
              marginRight: 20,
              backgroundColor: colors.surface,
              borderRadius: 24,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 8 },
              shadowOpacity: 0.25,
              shadowRadius: 16,
              elevation: 8,
              overflow: 'hidden',
              borderWidth: 1,
              borderColor: colors.border,
            }}
          >
            <TravelTips localTips={localTipsArray}/>
          </View>
        </ScrollView>

        {/* Divider */}
        <View
          style={{
            height: 1,
            backgroundColor: colors.border,
            marginHorizontal: 32,
            marginVertical: 12,
            borderRadius: 2,
            opacity: 0.8,
          }}
        />

        {/* Activities Section */}
        <View style={{ paddingVertical: 16, paddingHorizontal: 24 }}>
          <View
            style={{
              backgroundColor: colors.surface,
              borderRadius: 24,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 8 },
              shadowOpacity: 0.25,
              shadowRadius: 16,
              elevation: 8,
              overflow: 'hidden',
              borderWidth: 1,
              borderColor: colors.border,
            }}
          >
            <ActivityList
              days={transformedActivityDays}
              destinationId={itinerary.ititeraryId}
            />
          </View>
        </View>

        {/* Comments Section */}
        <View style={{ paddingVertical: 16, paddingHorizontal: 24 }}>
          <View
            style={{
              backgroundColor: colors.surface,
              borderRadius: 24,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 8 },
              shadowOpacity: 0.25,
              shadowRadius: 16,
              elevation: 8,
              overflow: 'hidden',
              borderWidth: 1,
              borderColor: colors.border,
            }}
          >
            <CommentsSection
              maxHeight={320}
              title="✨ Traveler Stories"
            />
          </View>
        </View>
      </Animated.ScrollView>
    </SafeAreaView>
  );
}
