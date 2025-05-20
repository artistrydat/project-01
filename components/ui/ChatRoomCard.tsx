import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { router } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import type { ChatRoomCardProps } from '../../types/ui.types';

export default function ChatRoomCard({
  roomId,
  name,
  lastMessage,
  timestamp,
}: ChatRoomCardProps) {
  const handlePress = () => {
    router.push(`/chat-room/${roomId}`);
  };

  return (
    <Pressable
      className="flex-row items-center bg-quinary rounded-xl p-3 border border-primary"
      onPress={handlePress}
    >
      <View className="h-12 w-12 rounded-full bg-primary items-center justify-center mr-3">
        <MaterialIcons name="groups" size={24} color="#1E493B" />
      </View>
      
      <View className="flex-1">
        <View className="flex-row justify-between items-center">
          <Text className="font-bold text-tertiary">{name}</Text>
          <Text className="text-xs text-quaternary">{timestamp}</Text>
        </View>
        
        <Text 
          className="text-sm text-quaternary mt-1" 
          numberOfLines={1}
        >
          {lastMessage}
        </Text>
      </View>
      
      <View className="ml-2">
        <View className="bg-quaternary w-6 h-6 rounded-full items-center justify-center">
          <Text className="text-xs text-quinary font-bold">3</Text>
        </View>
      </View>
    </Pressable>
  );
}
