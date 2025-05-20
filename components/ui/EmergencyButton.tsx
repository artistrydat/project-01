import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

interface EmergencyButtonProps {
  onPress: () => void;
}

export default function EmergencyButton({ onPress }: EmergencyButtonProps) {
  return (
    <Pressable
      className="bg-quaternary rounded-full p-4 items-center justify-center"
      onPress={onPress}
      style={({ pressed }) => ({
        transform: [{ scale: pressed ? 0.95 : 1 }],
      })}
    >
      <View className="absolute inset-0 rounded-full border-2 border-red-400 animate-pulse" />
      <MaterialIcons name="warning" size={28} color="#EBFA9F" />
      <Text className="text-quinary font-bold mt-2">SOS</Text>
    </Pressable>
  );
}
