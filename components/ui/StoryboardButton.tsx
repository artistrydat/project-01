import React from 'react';
import { Pressable, Text } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

interface StoryboardButtonProps {
  onPress: () => void;
}

export default function StoryboardButton({ onPress }: StoryboardButtonProps) {
  return (
    <Pressable
      className="bg-primary w-14 h-14 rounded-full items-center justify-center shadow-lg"
      onPress={onPress}
      style={({ pressed }) => ({
        transform: [{ scale: pressed ? 0.95 : 1 }],
      })}
    >
      <MaterialIcons name="auto-awesome" size={28} color="#FFFFFF" />
      
      <Pressable
        className="absolute -top-2 -right-2 bg-secondary rounded-full px-2 py-1"
        onPress={onPress}
      >
        <Text className="text-quinary text-xs font-bold">AI</Text>
      </Pressable>
    </Pressable>
  );
}
