import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInUp, FadeInLeft, FadeInRight, SlideInDown, FadeInDown } from 'react-native-reanimated';
import type { Activity } from '~/types/planner.types';

interface AccommodationActivityProps {
  activity: Activity;
}

const AccommodationActivity: React.FC<AccommodationActivityProps> = ({ activity }) => {
  // Dynamic price indicator
  const priceLevel = Array(Math.round(activity.cost)).fill('$').join('');
   return (
    <Animated.View 
      entering={FadeInUp.delay(200).duration(800)}
      className="bg-glass-white rounded-3xl overflow-hidden shadow-xl border border-white/20 backdrop-blur-xl"
    >
      {/* Top Section with Enhanced Gen Z Gradient */}
      <LinearGradient
        colors={['#b300ff', '#00d4ff']}
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
              <MaterialIcons name="hotel" size={24} color="#FFF" />
            </LinearGradient>
          </Animated.View>
          <Animated.Text 
            entering={FadeInUp.delay(700).duration(500)}
            className="text-white font-black text-xl flex-1"
          >
            🏨 Accommodation
          </Animated.Text>
          <Animated.View 
            entering={FadeInRight.delay(800).duration(500)}
            className="bg-white/30 rounded-2xl px-3 py-2 backdrop-blur-sm"
          >
            <Text className="text-white font-black text-sm">{priceLevel || '$'}/night</Text>
          </Animated.View>
        </Animated.View>
      </LinearGradient>
      
      {/* Content with Glassmorphism */}
      <LinearGradient
        colors={['rgba(179, 0, 255, 0.05)', 'rgba(0, 212, 255, 0.05)']}
        className="p-5"
      >
        <Animated.Text 
          entering={FadeInUp.delay(900).duration(600)}
          className="text-gray-800 leading-relaxed mb-4 font-medium text-base"
        >
          {activity.AiSummary}
        </Animated.Text>
        
        {/* Enhanced Amenities Section */}
        <Animated.Text 
          entering={FadeInLeft.delay(1000).duration(500)}
          className="text-electric-purple font-black mb-3 text-lg"
        >
          ✨ Amenities
        </Animated.Text>
        <Animated.View 
          entering={FadeInUp.delay(1100).duration(600)}
          className="flex-row flex-wrap mb-5"
        >
          {['WiFi', 'Pool', 'Breakfast', 'A/C'].map((amenity, index) => (
            <Animated.View
              key={index}
              entering={FadeInRight.delay(1200 + index * 100).duration(500)}
            >
              <LinearGradient
                colors={['#b300ff', '#00d4ff']}
                className="rounded-2xl px-4 py-2 mr-2 mb-2 flex-row items-center"
              >
                <MaterialIcons 
                  name={
                    amenity === 'WiFi' ? 'wifi' : 
                    amenity === 'Pool' ? 'pool' : 
                    amenity === 'Breakfast' ? 'restaurant' : 'ac-unit'
                  } 
                  size={16} 
                  color="white" 
                />
                <Text className="ml-2 text-white text-sm font-bold">{amenity}</Text>
              </LinearGradient>
            </Animated.View>
          ))}
        </Animated.View>

        {/* Action Buttons with Modern Gradients */}
        <Animated.View 
          entering={FadeInUp.delay(1600).duration(700)}
          className="flex-row justify-between"
        >
          <Animated.View entering={FadeInLeft.delay(1700).duration(500)}>
            <Pressable className="bg-white rounded-2xl px-5 py-3 flex-row items-center border border-purple-200 shadow-md flex-1 mr-2 active:scale-95">
              <MaterialIcons name="photo-library" size={20} color="#b300ff" />
              <Text className="ml-2 text-purple-600 font-bold">Gallery</Text>
            </Pressable>
          </Animated.View>
          
          <Animated.View entering={FadeInRight.delay(1800).duration(500)}>
            <Pressable className="active:scale-95">
              <LinearGradient
                colors={['#b300ff', '#00d4ff']}
                className="rounded-2xl px-5 py-3 flex-row items-center flex-1 ml-2"
              >
                <MaterialIcons name="bookmark-border" size={20} color="#FFF" />
                <Text className="ml-2 text-white font-black">Book Now</Text>
              </LinearGradient>
            </Pressable>
          </Animated.View>
        </Animated.View>
      </LinearGradient>
    </Animated.View>
  );
};

export default AccommodationActivity;