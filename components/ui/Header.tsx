import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import type { HeaderProps } from '~/types/ui.types';

export default function Header({ title, subtitle, onBackPress }: HeaderProps) {
  const router = useRouter();

  const handleBackPress = () => {
    if (onBackPress) {
      onBackPress();
    } else {
      router.back();
    }
  };

  return (
    <View className="px-4 pt-2 pb-3">
      <View className="flex-row items-center">
        {onBackPress && (
          <Pressable 
            className="mr-2 p-1" 
            onPress={handleBackPress}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <MaterialIcons name="arrow-back" size={24} color="#1E493B" />
          </Pressable>
        )}
        
        <View>
          <Text className="text-2xl font-bold text-tertiary">{title}</Text>
          {subtitle && (
            <Text className="text-quaternary">{subtitle}</Text>
          )}
        </View>
        
        <View className="flex-row ml-auto">
          <Pressable className="p-2 ml-1">
            <MaterialIcons name="search" size={24} color="#1E493B" />
          </Pressable>
          <Pressable className="p-2 ml-1">
            <MaterialIcons name="notifications-none" size={24} color="#1E493B" />
          </Pressable>
        </View>
      </View>
    </View>
  );
}
