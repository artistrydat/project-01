// screens/itinerary/[id].tsx
import { ScrollView, SafeAreaView, View, StatusBar, Animated, Dimensions } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useItineraryStore } from '~/store/itinerary/ItineraryStore';
import { HeaderSection } from '~/components/destination/HeaderSection';
import { HighlightsSection } from '~/components/destination/HighlightsSection';
import { TravelInfoSection } from '~/components/destination/TravelInfoSection';
import { WeatherForecast } from '~/components/destination/WeatherForecast';
import { ActivityList } from '~/components/destination/ActivityList';
import { CommentsSection } from '~/components/destination/CommentsSection';
import { useEffect, useRef } from 'react';
import { LoadingView } from '~/components/ui/LoadingView';

export default function ItineraryScreen() {
  const { id } = useLocalSearchParams();
  const { itinerary, fetchItinerary, toggleFavorite, addComment, toggleCommentLike, toggleCommentDislike } = useItineraryStore();
  const scrollY = useRef(new Animated.Value(0)).current;
  const screenWidth = Dimensions.get('window').width;
  const cardWidth = screenWidth * 0.75;

  useEffect(() => {
    if (id) {
      fetchItinerary(id as string);
    }
  }, [id, fetchItinerary]);

  if (!itinerary) return <LoadingView />;

  return (
    <SafeAreaView className="flex-1 bg-quinary">
      <StatusBar barStyle="dark-content" />
      
      <Animated.ScrollView 
        className="flex-1" 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 32 }}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: true }
        )}
        scrollEventThrottle={16}
      >
        {/* Immersive header section */}
        <View className="relative mb-4">
          <HeaderSection
            name={itinerary.name}
            imageUrl={itinerary.imageUrl}
            isFavorite={itinerary.isfavorite}
            trendingScore={itinerary.trendingScore}
            ecoScore={itinerary.ecoScore}
            description={itinerary.description}
            onToggleFavorite={toggleFavorite}
            onShare={() => console.log('Share itinerary')}
          />
        </View>

        {/* Horizontal sections: Highlights, Travel Info, Weather - with improved spacing */}
        <View className="px-4 mt-2">
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingLeft: 16, paddingRight: 16 }}
            snapToInterval={cardWidth + 16} 
            decelerationRate="fast"
          >
            {/* Highlights card - increased margin between cards */}
            <View style={{ width: cardWidth }} className="mr-4 bg-white rounded-xl shadow-sm overflow-hidden">
              <HighlightsSection highlights={itinerary.Highlights} />
            </View>

            {/* Travel info card - increased margin between cards */}
            <View style={{ width: cardWidth }} className="mr-4 bg-white rounded-xl shadow-sm overflow-hidden">
              <TravelInfoSection
                bestTime={itinerary.bestTimeToVisit}
                averageCost={itinerary.averageCost}
                localTips={itinerary.localTips}
              />
            </View>

            {/* Weather forecast card - increased margin between cards */}
            <View style={{ width: cardWidth }} className="mr-4 bg-white rounded-xl shadow-sm overflow-hidden p-4">
              <WeatherForecast forecasts={itinerary.ItineraryDays?.flatMap((day) => day.weather) || []} />
            </View>
          </ScrollView>
        </View>

        {/* Content container for remaining vertical sections - reduced top margin */}
        <View className="px-4 mt-2">
          {/* Activities section with prominent display */}
          <View className="mb-6 bg-white rounded-xl shadow-sm overflow-hidden">
            <View className="px-4 py-6">
              <ActivityList days={itinerary.ItineraryDays} destinationId={itinerary.ititeraryId} />
            </View>
          </View>

          {/* Social engagement section */}
          <View className="mb-4 bg-white rounded-xl shadow-sm overflow-hidden p-4">
            <CommentsSection 
              comments={itinerary.Comments}
              onAddComment={addComment}
              onToggleLike={toggleCommentLike}
              onToggleDislike={toggleCommentDislike}
              maxHeight={300}
              title="Traveler Comments"
            />
          </View>
        </View>
      </Animated.ScrollView>
    </SafeAreaView>
  );
}