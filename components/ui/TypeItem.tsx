// components/ui/TypeItem.tsx
import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import CostEstimateBadge from './CostEstimateBadge';
import type { TypeItemProps } from '~/types/ui.types';

export default function TypeItem({
  id,
  name,
  description,
  icon,
  type,
  costEstimate,
  onPress
}: TypeItemProps & { costEstimate?: string }) {
  const iconMap = {
    landmark: 'location-on' as const,
    activity: 'directions-run' as const,
    food: 'restaurant' as const,
    accommodation: 'hotel' as const,
    default: 'star' as const
  };

  // Add specific colors and styles based on the type
  const iconColor = type === 'landmark' ? '#F59E0B' : 
                   type === 'food' ? '#EF4444' :
                   type === 'accommodation' ? '#6366F1' : '#10B981';
                   
  const bgColor = type === 'landmark' ? 'bg-amber-100' : 
                 type === 'food' ? 'bg-red-100' :
                 type === 'accommodation' ? 'bg-indigo-100' : 'bg-green-100';

  return (
    <View className="bg-quinary rounded-lg p-3 border border-primary flex-row items-start mb-2">
      {/* Icon */}
      <View className={`w-8 h-8 rounded-full items-center justify-center mr-3 ${bgColor}`}>
        <MaterialIcons
          name={iconMap[type] || iconMap.default}
          size={18}
          color={iconColor}
        />
      </View>

      {/* Content */}
      <View className="flex-1 mr-2">
        <View className="flex-row justify-between items-start mb-1">
          <Text className="text-tertiary font-bold text-lg flex-1">{name}</Text>
          {costEstimate && <CostEstimateBadge amount={costEstimate} />}
        </View>
        <Text className="text-xs text-gray-500 mb-2">{description}</Text>
        
        {/* Action Buttons Row */}
        <View className="flex-row flex-wrap mt-2">
          {/* First row of action buttons */}
          <View className="flex-row mb-1">
          
            <Pressable 
              className="mr-2 bg-gray-100 rounded-full p-1"
              onPress={() => {
                console.log(`Map button clicked for ${name} (${id})`);
              }}
              hitSlop={5}
            >
              <MaterialIcons 
                name="map" 
                size={16} 
                color="#1E493B" 
              />
            </Pressable>
            
            <Pressable 
              className="mr-2 bg-gray-100 rounded-full p-1"
              onPress={() => {
                console.log(`Delete button clicked for ${name} (${id})`);
              }}
              hitSlop={5}
            >
              <MaterialIcons 
                name="delete" 
                size={16} 
                color="#EF4444" 
              />
            </Pressable>
          </View>
          
          {/* Second row of action buttons */}
          <View className="flex-row">
            <Pressable 
              className="mr-2 bg-indigo-50 rounded-full py-1 px-2 flex-row items-center"
              onPress={() => {
                console.log(`Upvote button clicked for ${name} (${id})`);
              }}
              hitSlop={5}
            >
              <MaterialIcons 
                name="thumb-up" 
                size={14} 
                color="#4F46E5" 
              />
              <Text className="ml-1 text-xs text-indigo-700">7</Text>
            </Pressable>
            
            <Pressable 
              className="mr-2 bg-gray-50 rounded-full py-1 px-2 flex-row items-center"
              onPress={() => {
                console.log(`Downvote button clicked for ${name} (${id})`);
              }}
              hitSlop={5}
            >
              <MaterialIcons 
                name="thumb-down" 
                size={14} 
                color="#6B7280" 
              />
              <Text className="ml-1 text-xs text-gray-600">2</Text>
            </Pressable>
          </View>
        </View>
      </View>

      {/* Right-side icon for detailed view */}
      {onPress && (
        <Pressable 
          onPress={onPress} 
          className="ml-2 self-center"
          hitSlop={10}
          
        >
          <MaterialIcons 
            name="travel-explore" 
            size={20} 
            color="#666666" 
          />
        </Pressable>
      )}
    </View>
  );
}