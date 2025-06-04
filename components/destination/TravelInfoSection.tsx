// components/TravelInfoSection.tsx
import React from 'react';
import { View, Text } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInUp, FadeInLeft, FadeInRight, SlideInDown } from 'react-native-reanimated';
import { useTheme } from '~/contexts/ThemeContext';

interface TravelInfoSectionProps {
  bestTime: string;
  averageCost: string;
  totalCost?: number;
  duration?: number;
  activitiesCount?: number;
}

export const TravelInfoSection: React.FC<TravelInfoSectionProps> = ({
  bestTime, averageCost, totalCost, duration, activitiesCount
}) => {
  const { colors } = useTheme();

  const StatItem = ({ label, value, delay, color }: { 
    label: string; value: string | number; delay: number; color?: string;
  }) => (
    <Animated.View entering={FadeInRight.delay(delay).duration(500)} style={{
      flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
      paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.1)'
    }}>
      <Text style={{ color: colors.textSecondary, fontSize: 16, fontWeight: '500' }}>
        {label}
      </Text>
      <Text style={{ color: color ?? colors.text, fontSize: 18, fontWeight: 'bold' }}>
        {value}
      </Text>
    </Animated.View>
  );

  return (
    <Animated.View entering={FadeInUp.delay(200).duration(600)} style={{ paddingBottom: 24 }}>
      {/* Unified Header Style */}
      <LinearGradient colors={[colors.primary, colors.neon, colors.accent]}
        start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
        style={{ paddingHorizontal: 24, paddingVertical: 32 }}>
        <Animated.View entering={SlideInDown.delay(400).duration(600)}
          style={{ flexDirection: 'row', alignItems: 'center' }}>
          <View style={{
            width: 48, height: 48, borderRadius: 16,
            alignItems: 'center', justifyContent: 'center', marginRight: 16,
            backgroundColor: 'rgba(255,255,255,0.15)'
          }}>
            <MaterialIcons name="info" size={28} color="white" />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={{ color: 'white', fontSize: 24, fontWeight: 'bold', marginBottom: 4 }}>
              Travel Info
            </Text>
            <Text style={{ color: 'rgba(255,255,255,0.8)', fontSize: 16 }}>
              Essential details for your journey
            </Text>
          </View>
        </Animated.View>
      </LinearGradient>

      <View style={{ padding: 24 }}>
        <Animated.View entering={FadeInUp.delay(500).duration(700)} style={{ marginBottom: 24 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 16 }}>
            <LinearGradient colors={[colors.success, '#34D399']} style={{
              width: 40, height: 40, borderRadius: 12,
              alignItems: 'center', justifyContent: 'center', marginRight: 12
            }}>
              <MaterialIcons name="account-balance-wallet" size={22} color="black" />
            </LinearGradient>
            <Text style={{ color: colors.text, fontWeight: 'bold', fontSize: 20 }}>
              Budget Overview
            </Text>
          </View>
          
          <View style={{ borderRadius: 16, padding: 20, backgroundColor: 'rgba(16, 185, 129, 0.1)' }}>
            <StatItem label="APD" value={averageCost} delay={600} color={colors.success} />
            {totalCost !== undefined && (
              <StatItem label="Total activities cost" value={`$${totalCost}`} delay={650} color={colors.success} />
            )}
            {duration && (
              <StatItem label="Trip duration" value={`${duration} days`} delay={700} color={colors.text} />
            )}
            {activitiesCount !== undefined && (
              <StatItem label="Total activities" value={activitiesCount} delay={750} color={colors.text} />
            )}
          </View>
        </Animated.View>

        <Animated.View entering={FadeInUp.delay(600).duration(700)} style={{ marginBottom: 24 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 16 }}>
            <LinearGradient colors={[colors.warning, '#FBBF24']} style={{
              width: 40, height: 40, borderRadius: 12,
              alignItems: 'center', justifyContent: 'center', marginRight: 12
            }}>
              <MaterialIcons name="wb-sunny" size={22} color={colors.textInverse} />
            </LinearGradient>
            <Text style={{ color: colors.text, fontWeight: 'bold', fontSize: 20 }}>
              Best Time to Visit
            </Text>
          </View>
          
          <Animated.View entering={FadeInLeft.delay(750).duration(600)} style={{
            borderRadius: 16, padding: 20, backgroundColor: 'rgba(251, 191, 36, 0.1)'
          }}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <View style={{
                width: 12, height: 12, borderRadius: 6,
                backgroundColor: '#FBBF24', marginRight: 12
              }} />
              <Text style={{ 
                color: colors.textSecondary, fontSize: 16, lineHeight: 24, flex: 1
              }}>{bestTime}</Text>
            </View>
          </Animated.View>
        </Animated.View>
      </View>

      <LinearGradient colors={['transparent', 'rgba(139, 92, 246, 0.2)']} style={{ height: 4 }} />
    </Animated.View>
  );
};