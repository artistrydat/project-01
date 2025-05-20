import React, { useState } from 'react';
import { View, Text, Pressable } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import type { QuestCardProps } from '~/types/ui.types';

export default function QuestCard({
  title,
  description,
  points,
  completed: initialCompleted,
}: QuestCardProps) {
  const [completed, setCompleted] = useState(initialCompleted);

  const handleToggleComplete = () => {
    setCompleted(!completed);
  };

  return (
    <Pressable
      className={`rounded-xl p-4 border shadow-md transition-all duration-200 ${
        completed ? 'bg-green-50 border-green-200 shadow-green-100' : 'bg-white border-gray-200 shadow-gray-100'
      }`}
      onPress={handleToggleComplete}
      style={{ elevation: 3 }}
    >
      <View className="flex-row items-center mb-2">
        <View
          className={`w-12 h-12 rounded-full items-center justify-center mr-4 transition-all duration-200 ${
            completed ? 'bg-green-500 scale-110' : 'bg-amber-400 scale-100'
          }`}
        >
          <MaterialIcons
            name={completed ? 'check' : 'emoji-events'}
            size={26}
            color="white"
          />
        </View>

        <View className="flex-1">
          <Text className="text-tertiary font-extrabold text-xl mb-1 tracking-tight">
            {title}
          </Text>
          <View className="bg-quinary/60 rounded-xl p-3 border border-primary/30">
            <Text className="text-quaternary text-base leading-snug">{description}</Text>
          </View>
        </View>
      </View>

      <View className="flex-row justify-between items-center mt-4">
        <View className="flex-row items-center">
          <MaterialIcons name="star" size={20} color="#F59E0B" />
          <Text className="ml-2 text-amber-600 font-bold text-base">{points} points</Text>
        </View>

        <Pressable
          className={`px-4 py-2 rounded-full transition-all duration-200 shadow-sm ${
            completed
              ? 'bg-gradient-to-r from-green-400 to-green-600 shadow-green-200'
              : 'bg-gradient-to-r from-indigo-500 to-indigo-700 shadow-indigo-200'
          }`}
          onPress={handleToggleComplete}
        >
          <Text className="text-white font-semibold text-base tracking-wide">
            {completed ? 'Completed' : 'Mark Complete'}
          </Text>
        </Pressable>
      </View>
    </Pressable>
  );
}
