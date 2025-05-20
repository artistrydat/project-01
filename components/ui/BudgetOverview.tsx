import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import type { BudgetAlert } from '../../types/profile.types';

interface BudgetOverviewProps {
  total: number;
  spent: number;
  alerts: BudgetAlert[];
}

export default function BudgetOverview({
  total,
  spent,
  alerts,
}: BudgetOverviewProps) {
  const percentage = Math.min(Math.round((spent / total) * 100), 100);
  const remaining = total - spent;
  
  // Determine color based on percentage of budget used
  const getProgressColor = () => {
    if (percentage < 50) return 'bg-green-500';
    if (percentage < 75) return 'bg-amber-500';
    return 'bg-red-500';
  };

  return (
    <View className="bg-quinary rounded-xl p-4 border border-primary">
      <Text className="text-tertiary font-bold text-lg mb-2">Budget Overview</Text>
      <View className="flex-row items-center justify-between mb-3">
        <Text className="text-gray-800 font-medium">Budget</Text>
        <Text className="text-green-700 font-bold">${remaining.toFixed(2)} remaining</Text>
      </View>
      
      {/* Progress Bar */}
      <View className="h-4 bg-gray-200 rounded-full mb-2 overflow-hidden">
        <View 
          className={`h-full ${getProgressColor()}`} 
          style={{ width: `${percentage}%` }} 
        />
      </View>
      
      <View className="flex-row justify-between mb-4">
        <Text className="text-gray-500 text-xs">${spent.toFixed(2)} spent</Text>
        <Text className="text-gray-500 text-xs">${total.toFixed(2)} total</Text>
      </View>
      
      {/* Alerts */}
      {alerts.length > 0 && (
        <View>
          <Text className="font-medium mb-2">Alerts & Insights</Text>
          {alerts.map((alert) => (
            <View 
              key={alert.id} 
              className={`flex-row items-center p-2 rounded-lg mb-2 ${
                alert.type === 'positive' ? 'bg-green-50' :
                alert.type === 'warning' ? 'bg-amber-50' : 'bg-red-50'
              }`}
            >
              <MaterialIcons 
                name={
                  alert.type === 'positive' ? 'check-circle' :
                  alert.type === 'warning' ? 'warning' : 'error'
                } 
                size={18} 
                color={
                  alert.type === 'positive' ? '#10B981' :
                  alert.type === 'warning' ? '#F59E0B' : '#EF4444'
                } 
              />
              <Text 
                className={`ml-2 ${
                  alert.type === 'positive' ? 'text-green-700' :
                  alert.type === 'warning' ? 'text-amber-700' : 'text-red-700'
                }`}
              >
                {alert.message}
              </Text>
            </View>
          ))}
        </View>
      )}
      
      <Pressable 
        className="flex-row items-center justify-center mt-3 py-2 border-t border-gray-200"
      >
        <Text className="text-indigo-600 font-medium">View detailed breakdown</Text>
        <MaterialIcons name="chevron-right" size={18} color="#4F46E5" />
      </Pressable>
    </View>
  );
}
