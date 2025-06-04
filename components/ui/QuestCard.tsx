import React, { useState } from 'react';
import { View, Text, Pressable } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

export interface QuestCardProps {
  title: string;
  description: string;
  points: number;
  completed: boolean;
}

function QuestCard({
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
      className={`rounded-3xl p-6 border shadow-xl transition-all duration-200 active:scale-95 ${
        completed 
          ? 'bg-gradient-to-br from-green-50 to-emerald-50 border-green-200/50 shadow-green-100' 
          : 'bg-glass-white border-white/20 shadow-slate-200'
      }`}
      onPress={handleToggleComplete}
      style={{ elevation: 8 }}
    >
      <View className="flex-row items-start mb-4">
        <View
          className={`w-16 h-16 rounded-2xl items-center justify-center mr-5 transition-all duration-300 shadow-lg ${
            completed 
              ? 'bg-gradient-to-br from-green-400 to-emerald-500 scale-110' 
              : 'bg-gradient-aurora scale-100'
          }`}
        >
          <MaterialIcons
            name={completed ? 'check' : 'emoji-events'}
            size={28}
            color="white"
          />
        </View>

        <View className="flex-1">
          <Text className="text-gray-900 font-black text-xl mb-3 tracking-tight">
            {title} {completed ? '🎉' : '🏆'}
          </Text>
          <View className={`rounded-2xl p-4 ${
            completed 
              ? 'bg-gradient-to-br from-green-50/80 to-cyber-lime/10 border border-cyber-lime/30 shadow-lg' 
              : 'bg-glass-white border border-white/20 backdrop-blur-sm shadow-lg'
          }`}>
            <Text className="text-gray-800 text-base leading-relaxed font-bold">
              {description}
            </Text>
          </View>
        </View>
      </View>

      <View className="flex-row justify-between items-center mt-2">
        <View className="flex-row items-center bg-gradient-to-r from-sunset-peach/20 to-neon-coral/20 px-4 py-2 rounded-2xl border border-sunset-peach/30 backdrop-blur-sm">
          <Text className="text-2xl mr-2">⭐</Text>
          <Text className="text-neon-coral font-black text-lg">{points} points</Text>
        </View>

        <Pressable
          className={`px-6 py-3 rounded-2xl transition-all duration-200 shadow-lg ${
            completed
              ? 'bg-gradient-to-r from-green-400 to-emerald-500 shadow-green-200'
              : 'bg-gradient-cyber shadow-cyan-200'
          }`}
          onPress={handleToggleComplete}
        >
          <Text className="text-white font-bold text-base tracking-wide">
            {completed ? '✓ Complete' : 'Start Quest'}
          </Text>
        </Pressable>
      </View>
    </Pressable>
  );
}

export { QuestCard };
