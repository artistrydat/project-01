// components/ui/ItineraryDayCard.tsx
import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import TypeItem from './TypeItem';
import CostEstimateBadge from './CostEstimateBadge';
import type { ItineraryDayCardProps } from '~/types/ui.types';

export default function ItineraryDayCard({
  date,
  highlights,
  totalCost,
  onLongPress,
  isActive = false,
  onHighlightPress,
}: ItineraryDayCardProps & { totalCost?: string }) {
  return (
    <Pressable
      onLongPress={onLongPress}
      className={`mb-4 rounded-xl overflow-hidden ${
        isActive ? 'bg-indigo-50 border-2 border-indigo-500' : 'bg-white border border-gray-200'
      }`}
    >
      {/* Header */}
      <View className="bg-primary px-4 py-3 flex-row justify-between items-center">
        <Text className="text-tertiary font-bold text-lg">{date}</Text>
        {totalCost && (
          <View className="flex-row items-center">
            <Text className="text-tertiary text-sm mr-2">Total:</Text>
            <CostEstimateBadge amount={totalCost} variant="secondary" />
          </View>
        )}
      </View>

      {/* Content */}
      <View className="px-4 py-3">
        {highlights.map((activity) => (
          <View key={activity.id} className="mb-3">
            <TypeItem
              id={activity.id}
              name={activity.name}
              description={activity.description}
              type={activity.type}
              costEstimate={activity.costEstimate}
              onPress={
                (activity.type === 'activity' || activity.type === 'landmark') && onHighlightPress
                  ? () => onHighlightPress(activity)
                  : undefined
              }
            />
          </View>
        ))}

        {/* Footer */}
        <View className="flex-row justify-between items-center mt-3 pt-2 border-t border-gray-100">
          <View className="flex-row items-center">
            <MaterialIcons name="schedule" size={16} color="#666" />
            <Text className="text-xs text-gray-600 ml-1">
              {highlights.length} activities
            </Text>
          </View>
          
          {/* Activity Type Counts */}
          <View className="flex-row">
            {highlights.some(a => a.type === 'landmark') && (
              <View className="flex-row items-center ml-2">
                <MaterialIcons name="location-on" size={14} color="#F59E0B" />
                <Text className="text-xs text-gray-600 ml-1">
                  {highlights.filter(a => a.type === 'landmark').length}
                </Text>
              </View>
            )}
            
            {highlights.some(a => a.type === 'activity') && (
              <View className="flex-row items-center ml-2">
                <MaterialIcons name="directions-run" size={14} color="#10B981" />
                <Text className="text-xs text-gray-600 ml-1">
                  {highlights.filter(a => a.type === 'activity').length}
                </Text>
              </View>
            )}
            
            {highlights.some(a => a.type === 'food') && (
              <View className="flex-row items-center ml-2">
                <MaterialIcons name="restaurant" size={14} color="#EF4444" />
                <Text className="text-xs text-gray-600 ml-1">
                  {highlights.filter(a => a.type === 'food').length}
                </Text>
              </View>
            )}
          </View>
        </View>
      </View>
    </Pressable>
  );
}