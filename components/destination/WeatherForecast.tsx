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
    <View className="py-2 px-4">
      <Text className="text-2xl font-bold mb-4">Weather Forecast</Text>
      
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 8 }}
      >
        {forecasts.map((forecast) => (
          <View 
            key={forecast.id} 
            className="bg-quaternary rounded-2xl p-4 items-center mr-4 w-28 shadow-sm"
          >
            {/* Month */}
            <Text className="text-gray-800 font-bold text-sm mb-1">
              {formatMonth(forecast.date)}
            </Text>
            
            {/* Weather Icon */}
            <View className="my-3">
              {renderWeatherIcon(forecast.summary)}
            </View>
            
            {/* Weather Condition */}
            <Text className="text-gray-700 text-sm mb-2">
              {forecast.summary}
            </Text>
            
            {/* Temperature */}
            <Text className="text-gray-800 font-bold text-sm">
              {forecast.low}°/{forecast.high}°
            </Text>
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