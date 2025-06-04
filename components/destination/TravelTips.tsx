// components/TravelInfoSection.tsx
import React from 'react';
import { View, Text } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInUp, FadeInLeft, SlideInDown } from 'react-native-reanimated';
import { useTheme } from '~/contexts/ThemeContext';

interface TravelTipsProps {
  localTips: string[];
}

export const TravelTips: React.FC<TravelTipsProps> = ({ localTips }) => {
  const { colors, isDark } = useTheme();

  const TipItem = ({ tip, index }: { tip: string; index: number }) => (
    <Animated.View 
      entering={FadeInLeft.delay(800 + index * 150).duration(600)}
      style={{ 
        flexDirection: 'row', 
        alignItems: 'flex-start', 
        marginBottom: 12 
      }}
    >
      <View 
        style={{
          width: 8,
          height: 8,
          borderRadius: 4,
          backgroundColor: colors.electric, // Using theme colors for bullet
          marginTop: 8,
          marginRight: 12,
          flexShrink: 0
        }}
      />
      <Text 
        style={{ 
          color: colors.textSecondary, // Theme-driven text color
          flex: 1, 
          lineHeight: 24, 
          fontSize: 16 
        }}
      >
        {tip}
      </Text>
    </Animated.View>
  );

  return (
    <Animated.View 
     entering={FadeInUp.delay(200).duration(600)}
     style={{ paddingBottom: 24 }}
    >
      {/* Unified Header Style */}
      <LinearGradient
        colors={[colors.primary, colors.electric, colors.neon]} // Theme-driven gradient
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{ paddingHorizontal: 24, paddingVertical: 32 }}
      >
        <Animated.View 
          entering={SlideInDown.delay(400).duration(600)}
          style={{ flexDirection: 'row', alignItems: 'center' }}
        >
          <View 
            style={{
              width: 48,
              height: 48,
              borderRadius: 16,
              alignItems: 'center',
              justifyContent: 'center',
              marginRight: 16,
              backgroundColor: 'rgba(255,255,255,0.15)' // Keep glassmorphism effect
            }}
          >
            <MaterialIcons name="tips-and-updates" size={28} color="white" />
          </View>
          <View style={{ flex: 1 }}>
            <Text 
              style={{ 
                color: 'white', // Theme-driven inverse text
                fontSize: 24, 
                fontWeight: 'bold', 
                marginBottom: 4 
              }}
            >
              Travel Tips
            </Text>
            <Text 
              style={{ color: 'rgba(255,255,255,0.8)', fontSize: 16 }}
            >
              Essential local tips for your journey
            </Text>
          </View>
        </Animated.View>
      </LinearGradient>

      <View style={{ padding: 24 }}>
        {/* Local Tips Card */}
        {localTips && localTips.length > 0 && (
          <Animated.View 
            entering={FadeInUp.delay(700).duration(700)}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 16 }}>
              <LinearGradient
                colors={[colors.electric, colors.neon]} // Theme-driven gradient
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 12,
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginRight: 12
                }}
              >
                <MaterialIcons name="lightbulb" size={22} color={colors.textInverse} />
              </LinearGradient>
              <Text 
                style={{ color: colors.text, fontWeight: 'bold', fontSize: 20 }}
              >
                Local Tips
              </Text>
            </View>
            
            <View 
              style={{
                borderRadius: 16,
                padding: 20,
                backgroundColor: isDark 
                  ? 'rgba(139, 92, 246, 0.2)' // Darker background for dark mode
                  : 'rgba(139, 92, 246, 0.1)' // Light background for light mode
              }}
            >
              {localTips.map((tip, index) => (
                <TipItem key={index} tip={tip} index={index} />
              ))}
            </View>
          </Animated.View>
        )}
      </View>

      {/* Bottom Accent */}
      <LinearGradient
        colors={[
          'transparent', 
          isDark 
            ? 'rgba(139, 92, 246, 0.3)' // Stronger accent for dark mode
            : 'rgba(139, 92, 246, 0.2)' // Subtle accent for light mode
        ]}
        style={{ height: 4 }}
      />
    </Animated.View>
  );
};