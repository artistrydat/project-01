import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import type { WeatherForecast } from '~/types/planner.types';

export function WeatherForecastCards({ forecasts }: { forecasts: WeatherForecast[] }) {
  return (
    <ScrollView 
      horizontal 
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{ paddingHorizontal: 8 }}
    >
      {forecasts.map((forecast, index) => (
        <WeatherForecastCard key={index} {...forecast} />
      ))}
    </ScrollView>
  );
}

function WeatherForecastCard({ date, summary, icon, high, low }: WeatherForecast) {
  return (
    <View className="items-center bg-primary rounded-2xl py-3 px-2 mx-1 w-[70px] shadow-md">
      <Text className="text-tertiary font-semibold mb-1 text-[10px] tracking-widest uppercase">
        {date.length > 3 ? date.slice(0, 3) : date}
      </Text>
      <MaterialIcons 
        name={icon as any} 
        size={22} 
        color="#1E493B" 
        style={{ marginBottom: 2 }} 
      />
      <Text className="text-quaternary text-[10px] mb-1 text-center min-h-[14px]">
        {summary}
      </Text>
      <Text className="text-tertiary font-bold text-xs">
        {low}°/{high}°
      </Text>
    </View>
  );
}