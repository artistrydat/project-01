import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { MaterialIcons, FontAwesome5 } from '@expo/vector-icons';
import type { UserProfile, EcoImpact } from '~/types/profile.types';
import { 
  useCurrentEcoImpact, 
  useEcoImpactLoading, 
  useEcoImpactDebug 
} from '~/store/EcoImpactCal/EcoImpactCalStore';

// Extend EcoImpact type to include ecoScore
interface EcoImpactWithScore extends EcoImpact {
  ecoScore: number;
}

// We can make ecoImpact prop optional since we'll also use the store
type EcoImpactSectionProps = {
  ecoImpact?: UserProfile['EcoImpact'];
  showLoading?: boolean; // Add option to show/hide loading state
};

export default function EcoImpactSection({ ecoImpact: propEcoImpact, showLoading = true }: EcoImpactSectionProps) {
  // Get eco impact data from the store
  const calculatedEcoImpact = useCurrentEcoImpact();
  const isLoading = useEcoImpactLoading();
  const debugInfo = useEcoImpactDebug();
  
  // Track if initial data has loaded
  const [hasLoaded, setHasLoaded] = useState(false);
  
  // Set hasLoaded when data becomes available
  useEffect(() => {
    if (calculatedEcoImpact && !hasLoaded) {
      setHasLoaded(true);
    }
  }, [calculatedEcoImpact]);
  
  // Use data from props or from store, with fallback
  const ecoImpact = propEcoImpact || calculatedEcoImpact || null;
  
  // If loading and showLoading prop is true, show loading indicator
  if (isLoading && showLoading && !hasLoaded) {
    return (
      <View className="px-4 mb-6 items-center justify-center">
        <ActivityIndicator size="large" color="#4CAF50" />
        <Text className="text-tertiary mt-2">Calculating eco impact...</Text>
      </View>
    );
  }
  
  // If no data is available, don't render the component
  if (!ecoImpact) return null;
  
  // Function to determine which icon to render based on index position
  const renderIconByType = (index: number) => {
    switch (index) {
      case 0: // Carbon Footprint (first position)
        return <FontAwesome5 name="leaf" size={20} color="#191D15" />;
      case 1: // Water Usage (second position)
        return <MaterialIcons name="opacity" size={20} color="#191D15" />;
      case 2: // Waste Generated (third position)
        return <MaterialIcons name="delete" size={20} color="#191D15" />;
      default:
        return <MaterialIcons name="eco" size={20} color="#191D15" />;
    }
  };
  
  // Get the ecoScore value with fallback - calculate from itineraries if possible
  let displayedEcoScore: number;
  
  if (calculatedEcoImpact && 'ecoScore' in calculatedEcoImpact) {
    // Use calculated score from store
    displayedEcoScore = calculatedEcoImpact.ecoScore;
  } else if (debugInfo.itineraryScores.length > 0) {
    // Calculate from debug info if available
    const total = debugInfo.itineraryScores.reduce((sum, score) => sum + score, 0);
    displayedEcoScore = Math.round(total / debugInfo.itineraryScores.length);
  } else {
    // Fallback
    displayedEcoScore = 65; // Changed from 85 to a more realistic default
  }
  
  return (
    <View className="px-4 mb-6">
      <Text className="text-lg font-semibold mb-3 text-tertiary">Eco Impact</Text>
      
      {/* Show recalculating indicator if loading but we already have data */}
      {isLoading && hasLoaded && (
        <View className="absolute right-6 top-1">
          <ActivityIndicator size="small" color="#4CAF50" />
        </View>
      )}
      
      <View className="bg-secondary rounded-xl p-4">
        <View className="flex-row items-center justify-between mb-4">
          <Text className="text-lg font-bold text-tertiary">Eco Score</Text>
          <View className="bg-white rounded-full w-14 h-14 items-center justify-center border-4 border-primary">
            <Text className="font-bold text-lg text-tertiary">{displayedEcoScore}</Text>
          </View>
        </View>
        
        {/* Separator line */}
        <View className="h-px bg-gray-300 w-full mb-4" />
        
        <View className="flex-row justify-between">
          {ecoImpact.stats.map((stat, index) => (
            <View key={index} className="items-center flex-1">
              <View className="w-10 h-10 rounded-full bg-white items-center justify-center mb-2">
                {renderIconByType(index)}
              </View>
              <Text className="text-xs text-center text-gray-700">{stat.label}</Text>
              <Text className="text-xs font-bold text-center text-tertiary">{stat.value}</Text>
            </View>
          ))}
        </View>
      </View>
      
      {/* DEV ONLY: Debug info - remove in production */}
      {__DEV__ && (
        <View className="mt-2 p-2 bg-gray-100 rounded">
          <Text className="text-xs">Itinerary IDs: {debugInfo.itineraryIds.join(', ')}</Text>
          <Text className="text-xs">Scores: {debugInfo.itineraryScores.join(', ')}</Text>
          <Text className="text-xs">
            Last updated: {debugInfo.calculationTimestamp 
              ? new Date(debugInfo.calculationTimestamp).toLocaleTimeString() 
              : 'never'}
          </Text>
        </View>
      )}
    </View>
  );
}