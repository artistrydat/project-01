// components/ui/CostEstimateBadge.tsx
import React from 'react';
import { View, Text } from 'react-native';
import type { CostEstimateBadgeProps } from '~/types/ui.types';


export default function CostEstimateBadge({ 
  amount, 
  variant = 'primary' 
}: CostEstimateBadgeProps) {
  return (
    <View className={`px-2 py-1 rounded-full ${
      variant === 'primary' ? 'bg-quaternary' : 'bg-secondary'
    }`}>
      <Text className={`text-xs font-medium ${
        variant === 'primary' ? 'text-quinary' : 'text-tertiary'
      }`}>
        {amount}
      </Text>
    </View>
  );
}