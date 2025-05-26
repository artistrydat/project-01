import { View, Text, ScrollView } from 'react-native';
import { useItineraryStore } from '~/store/itinerary/ItineraryStore';

interface WeatherForecastProps {
  forecasts: {
    id: string;
    date: string;
    summary: string;
    high: number;
    low: number;
  }[];
}

export const WeatherForecast = ({ forecasts }: WeatherForecastProps) => {
  // Use the hook without destructuring since we don't need the values
  useItineraryStore();
  
  if (!forecasts || forecasts.length === 0) {
    return null; // Don't render if no forecast data
  }
  
  return (
    <View className="py-4">
      <Text className="text-2xl font-bold mb-5">Weather Forecast</Text>
      
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 8, paddingRight: 16 }}
        className="ml-1"
      >
        {forecasts.map((forecast) => (
          <View 
            key={forecast.id} 
            className="bg-primary rounded-2xl p-4 items-center mr-4 w-32 shadow-sm"
          >
            {/* Weather content with improved spacing */}
            <Text className="text-gray-800 font-bold text-sm mb-2">
              {formatMonth(forecast.date)}
            </Text>
            
            <View className="my-3">
              {renderWeatherIcon(forecast.summary)}
            </View>
            
            <Text className="text-gray-700 text-sm mb-3">
              {forecast.summary}
            </Text>
            
            <View className="flex-row justify-between w-full">
              <Text className="font-bold text-sm">{forecast.high}°</Text>
              <Text className="text-gray-500 text-sm">{forecast.low}°</Text>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

// Helper function to format month
const formatMonth = (dateString: string) => {
  const date = new Date(dateString);
  const month = date.toLocaleString('default', { month: 'short' }).toUpperCase();
  return month;
};

// Function to render appropriate weather icons based on summary
const renderWeatherIcon = (summary: string) => {
  const lowercaseSummary = summary.toLowerCase();
  
  if (lowercaseSummary.includes('cloud')) {
    return <Text style={{ fontSize: 24 }}>☁️</Text>;
  } else if (lowercaseSummary.includes('rain')) {
    return <Text style={{ fontSize: 24 }}>🌧️</Text>;
  } else if (lowercaseSummary.includes('clear')) {
    return <Text style={{ fontSize: 24 }}>☀️</Text>;
  } else {
    return <Text style={{ fontSize: 24 }}>⛅</Text>;
  }
};