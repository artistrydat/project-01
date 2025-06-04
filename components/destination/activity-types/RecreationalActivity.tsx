import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInUp, FadeInLeft, FadeInRight, SlideInDown, FadeInDown } from 'react-native-reanimated';
import type { Activity } from '~/types/planner.types';

interface RecreationalActivityProps {
  activity: Activity;
}

const RecreationalActivity: React.FC<RecreationalActivityProps> = ({ activity }) => {
  return (
    <Animated.View 
      entering={FadeInUp.delay(200).duration(800)}
      className="bg-glass-white rounded-3xl overflow-hidden shadow-xl border border-white/20 backdrop-blur-xl"
    >
      {/* Top Section with Enhanced Gen Z Gradient */}
      <LinearGradient
        colors={['#00d4ff', '#39ff14']}
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
              <MaterialIcons name="directions-run" size={24} color="#FFF" />
            </LinearGradient>
          </Animated.View>
          <Animated.Text 
            entering={FadeInUp.delay(700).duration(500)}
            className="text-white font-black text-xl flex-1"
          >
            🏃 Activity & Adventure
          </Animated.Text>
          <Animated.View 
            entering={FadeInRight.delay(800).duration(500)}
            className="bg-white/30 rounded-2xl px-3 py-2 backdrop-blur-sm"
          >
            <Text className="text-white font-black text-sm">{activity.AiSummaryRating}% match</Text>
          </Animated.View>
        </Animated.View>
      </LinearGradient>
      
      {/* Content with Glassmorphism */}
      <LinearGradient
        colors={['rgba(0, 212, 255, 0.05)', 'rgba(57, 255, 20, 0.05)']}
        className="p-5"
      >
        <Animated.Text 
          entering={FadeInUp.delay(900).duration(600)}
          className="text-gray-800 leading-relaxed mb-4 font-medium text-base"
        >
          {activity.AiSummary}
        </Animated.Text>
        
        {/* Enhanced Experience Level with Modern Design */}
        <Animated.View 
          entering={FadeInLeft.delay(1000).duration(700)}
          className="mb-5 bg-white/70 rounded-2xl p-4 backdrop-blur-sm border border-white/30 shadow-lg"
        >
          <Animated.Text 
            entering={FadeInDown.delay(1100).duration(500)}
            className="text-electric-blue font-black mb-3 text-lg"
          >
            💪 Experience Level
          </Animated.Text>
          <Animated.View 
            entering={FadeInRight.delay(1200).duration(600)}
            className="h-3 bg-gray-200 rounded-full overflow-hidden mb-2"
          >
            <Animated.View
              entering={FadeInLeft.delay(1300).duration(800)}
            >
              <LinearGradient
                colors={['#00d4ff', '#39ff14']}
                className="h-full rounded-full"
                style={{ width: `${Math.min((activity.AiSummaryRating || 50), 100)}%` }} 
              />
            </Animated.View>
          </Animated.View>
          <Animated.View 
            entering={FadeInUp.delay(1400).duration(500)}
            className="flex-row justify-between"
          >
            <Text className="text-sm font-bold text-gray-600">Beginner</Text>
            <Text className="text-sm font-bold text-gray-600">Expert</Text>
          </Animated.View>
        </Animated.View>     

        {/* Action Buttons with Modern Gradients */}
        <Animated.View 
          entering={FadeInUp.delay(1500).duration(700)}
          className="flex-row justify-between"
        >
          <Animated.View entering={FadeInLeft.delay(1600).duration(500)}>
            <Pressable className="bg-white rounded-2xl px-5 py-3 flex-row items-center border border-blue-200 shadow-md flex-1 mr-2 active:scale-95">
              <MaterialIcons name="groups" size={20} color="#00d4ff" />
              <Text className="ml-2 text-blue-600 font-bold">Group Size</Text>
            </Pressable>
          </Animated.View>
          
          <Animated.View entering={FadeInRight.delay(1700).duration(500)}>
            <Pressable className="active:scale-95">
              <LinearGradient
                colors={['#00d4ff', '#39ff14']}
                className="rounded-2xl px-5 py-3 flex-row items-center flex-1 ml-2"
              >
                <MaterialIcons name="event-available" size={20} color="#FFF" />
                <Text className="ml-2 text-white font-black">Book Activity</Text>
              </LinearGradient>
            </Pressable>
          </Animated.View>
        </Animated.View>
      </LinearGradient>
    </Animated.View>
  );
};

export default RecreationalActivity;