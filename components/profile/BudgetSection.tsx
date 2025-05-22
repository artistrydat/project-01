import React from 'react';
import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { UserProfile } from '~/types/profile.types';

type BudgetSectionProps = {
  budget?: UserProfile['budget']; // Make budget optional with ?
};

export default function BudgetSection({ budget }: BudgetSectionProps) {
  if (!budget) return null;
  
  return (
    <View className="px-4 mb-6">
      <Text className="text-lg font-semibold mb-3 text-tertiary">Budget</Text>
      <View className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
        <View className="flex-row justify-between items-center mb-3">
          <Text className="text-base font-medium text-tertiary">Travel Budget</Text>
          <Text className="font-bold text-tertiary">{budget.currency} {budget.total}</Text>
        </View>
        
        {/* Progress Bar */}
        <View className="h-3 bg-gray-200 rounded-full mb-2">
          <View 
            className="h-3 bg-primary rounded-full" 
            style={{ width: `${(budget.spent / budget.total) * 100}%` }} 
          />
        </View>
        
        <View className="flex-row justify-between mb-4">
          <Text className="text-xs text-gray-600">Spent: {budget.currency} {budget.spent}</Text>
          <Text className="text-xs text-gray-600">
            Remaining: {budget.currency} {budget.total - budget.spent}
          </Text>
        </View>
        
        {/* Alerts */}
        <View>
          {budget.alerts.map((alert, index) => (
            <View 
              key={index} 
              className={`rounded-lg p-2 mb-2 flex-row items-center ${
                alert.type === 'warning' ? 'bg-yellow-100' : 'bg-green-100'
              }`}
            >
              <Ionicons 
                name={alert.type === 'warning' ? 'alert-circle' : 'checkmark-circle'} 
                size={16} 
                color={alert.type === 'warning' ? '#F59E0B' : '#10B981'}
              />
              <Text className="text-xs ml-2">{alert.message}</Text>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
}