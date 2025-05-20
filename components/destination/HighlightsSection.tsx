// components/HighlightsSection.tsx
import { View, Text } from 'react-native';

interface Highlight {
  id: string;
  name: string;
  description: string;
}

interface HighlightsSectionProps {
  highlights: Highlight[];
}

export const HighlightsSection = ({ highlights }: HighlightsSectionProps) => {
  return (
    <View className="px-4 py-2">
      <Text className="text-2xl font-bold mb-4">Highlights</Text>
      
      <View className="space-y-4">
        {highlights.map((highlight, index) => (
          <View key={highlight.id} className="flex-row items-start">
            <Text className="text-amber-400 text-lg mr-2">★</Text>
            <View className="flex-1">
              <Text className="text-lg font-semibold text-gray-800">{highlight.name}</Text>
              <Text className="text-gray-600 mt-1">{highlight.description}</Text>
            </View>
          </View>
        ))}
      </View>
    </View>
  );
};