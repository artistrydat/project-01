import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInUp, FadeInLeft, FadeInRight, SlideInDown, FadeInDown } from 'react-native-reanimated';
import type { Activity } from '~/types/planner.types';

interface FoodActivityProps {
  activity: Activity;
}

const FoodActivity: React.FC<FoodActivityProps> = ({ activity }) => {
  // Dynamic price indicator
  const priceLevel = Array(Math.round(activity.cost)).fill('$').join('');
  
  return (
    <Animated.View 
      entering={FadeInUp.delay(200).duration(800)}
      className="bg-glass-white rounded-3xl overflow-hidden shadow-xl border border-white/20 backdrop-blur-xl"
    >
      {/* Top Section with Enhanced Gen Z Gradient */}
      <LinearGradient
        colors={['#ff6b6b', '#ffd93d']}
        className="p-5"
      >
        <Animated.View 
          entering={SlideInDown.delay(400).duration(600)}
          className="flex-row items-center"
        >
          <Animated.View
            entering={FadeInLeft.delay(600).duration(500)}
          >
            <LinearGradient
              colors={['rgba(255, 255, 255, 0.3)', 'rgba(255, 255, 255, 0.1)']}
              className="rounded-2xl p-3 mr-4"
            >
              <MaterialIcons name="restaurant" size={24} color="#FFF" />
            </LinearGradient>
          </Animated.View>
          <Animated.Text 
            entering={FadeInUp.delay(700).duration(500)}
            className="text-white font-black text-xl flex-1"
          >
            🍽️ Food & Dining
          </Animated.Text>
          <Animated.View 
            entering={FadeInRight.delay(800).duration(500)}
            className="bg-white/30 rounded-2xl px-3 py-2 backdrop-blur-sm"
          >
            <Text className="text-white font-black text-sm">{priceLevel || '$'}</Text>
          </Animated.View>
        </Animated.View>
      </LinearGradient>
      
      {/* Content with Glassmorphism */}
      <LinearGradient
        colors={['rgba(255, 107, 107, 0.05)', 'rgba(255, 217, 61, 0.05)']}
        className="p-5"
      >
        <Animated.Text 
          entering={FadeInUp.delay(900).duration(600)}
          className="text-gray-800 leading-relaxed mb-4 font-medium text-base"
        >
          {activity.AiSummary}
        </Animated.Text>
        
        {/* Action Buttons with Modern Gradients */}
        <Animated.View 
          entering={FadeInUp.delay(1000).duration(700)}
          className="flex-row justify-between"
        >
          <Animated.View entering={FadeInLeft.delay(1100).duration(500)}>
            <Pressable className="bg-white rounded-2xl px-5 py-3 flex-row items-center border border-orange-200 shadow-md flex-1 mr-2 active:scale-95">
              <MaterialIcons name="menu-book" size={20} color="#ff6b6b" />
              <Text className="ml-2 text-orange-600 font-bold">Menu</Text>
            </Pressable>
          </Animated.View>
          
          <Animated.View entering={FadeInRight.delay(1200).duration(500)}>
            <Pressable className="active:scale-95">
              <LinearGradient
                colors={['#ff6b6b', '#ffd93d']}
                className="rounded-2xl px-5 py-3 flex-row items-center flex-1 ml-2"
              >
                <MaterialIcons name="restaurant-menu" size={20} color="#FFF" />
                <Text className="ml-2 text-white font-black">Reserve</Text>
              </LinearGradient>
            </Pressable>
          </Animated.View>
        </Animated.View>
      </LinearGradient>
    </Animated.View>
  );
};

export default FoodActivity;