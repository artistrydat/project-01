// screens/itinerary/[id].tsx
import { ScrollView, Text, ActivityIndicator, SafeAreaView, View } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useItineraryStore } from '~/store/itinerary/ItineraryStore';
import { HeaderSection } from '~/components/destination/HeaderSection';
import { HighlightsSection } from '~/components/destination/HighlightsSection';
import { TravelInfoSection } from '~/components/destination/TravelInfoSection';
import { WeatherForecast } from '~/components/destination/WeatherForecast';
import { ActivityList } from '~/components/destination/ActivityList';
import { CommentsSection } from '~/components/destination/CommentsSection';
import { useEffect } from 'react';

export default function ItineraryScreen() {
  const { id } = useLocalSearchParams();
  const { itinerary, fetchItinerary, toggleFavorite, addComment, toggleCommentLike, toggleCommentDislike } = useItineraryStore();

  useEffect(() => {
    console.log('Current ID:', id);
    if (id) {
      console.log('Fetching itinerary:', id);
      fetchItinerary(id as string);
    }
  }, [id, fetchItinerary]);

  if (!itinerary) return <LoadingView />;

  return (
    <SafeAreaView className="flex-1 bg-quinary">      
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
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

        {/* Adding consistent section spacing */}
        <View className="mt-6">
          <HighlightsSection highlights={itinerary.Highlights} />
        </View>

        <View className="mt-6">
          <TravelInfoSection
            bestTime={itinerary.bestTimeToVisit}
            averageCost={itinerary.averageCost}
            localTips={itinerary.localTips}
          />
        </View>

        <View className="mt-6">
          <WeatherForecast forecasts={itinerary.ItineraryDays?.flatMap((day) => day.weather) || []} />
        </View>
        
        <View className="mt-6">
          <ActivityList days={itinerary.ItineraryDays} destinationId={itinerary.ititeraryId} />
        </View>

        <View className="mt-6 mb-8">
          <CommentsSection 
            comments={itinerary.Comments}
            onAddComment={addComment}
            onToggleLike={toggleCommentLike}
            onToggleDislike={toggleCommentDislike}
            maxHeight={300}
            title="Traveler Comments"
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const LoadingView = () => (
  <SafeAreaView className="flex-1 items-center justify-center">
    <ActivityIndicator size="large" color="#C6E7E3" />
    <Text className="text-primary mt-2">Loading itinerary...</Text>
  </SafeAreaView>
);