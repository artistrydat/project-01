import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../contexts/ThemeContext';

interface Badge {
  id: string;
  name: string;
  icon: string;
  description: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  earnedAt: string;
}

interface BadgesSectionProps {
  badges?: Badge[];
}

export default function BadgesSection({ badges = [] }: BadgesSectionProps) {
  const { colors, isDark } = useTheme();

  const getBadgeColors = (rarity: string): [string, string] => {
    switch (rarity) {
      case 'legendary':
        return [colors.electric, colors.cyber];
      case 'epic':
        return [colors.primary, colors.electric];
      case 'rare':
        return [colors.cyber, colors.neon];
      default:
        return [colors.secondary, colors.primary];
    }
  };

  if (badges.length === 0) {
    return (
      <View style={{ paddingHorizontal: 24, marginBottom: 24 }}>
        <Text 
          style={{ 
            fontSize: 24, // Reduced from 28 (designTokens.typography.heading3 equivalent)
            fontWeight: '600',
            color: colors.text, // Theme-aware text color
            marginBottom: 16 
          }}
        >
          Achievements
        </Text>
        <View 
          style={{ 
            padding: 24,
            borderRadius: 16,
            borderWidth: 1,
            backgroundColor: colors.surface, // Theme-aware surface background
            borderColor: colors.border // Theme-aware border color
          }}
        >
          <Text 
            style={{ 
              fontSize: 16, // designTokens.typography.body equivalent
              color: colors.textTertiary // Theme-aware tertiary text
            }}
          >
            No badges earned yet. Start traveling to unlock achievements! 🏆
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={{ paddingHorizontal: 24, marginBottom: 24 }}>
      <Text 
        style={{ 
          fontSize: 24, // Reduced from 28 (designTokens.typography.heading3 equivalent)
          fontWeight: '600',
          color: colors.text, // Theme-aware text color
          marginBottom: 16 
        }}
      >
        Achievements ({badges.length})
      </Text>
      
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        style={{ flexDirection: 'row' }}
        contentContainerStyle={{ paddingRight: 24 }}
      >
        {badges.map((badge, index) => (
          <View 
            key={badge.id}
            style={{ 
              marginRight: 16,
              borderRadius: 16,
              overflow: 'hidden',
              shadowColor: isDark ? colors.background : '#000', // Theme-aware shadow
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.15,
              shadowRadius: 8,
              elevation: 8,
              width: 100 // Reduced from 120
            }}
          >
            <LinearGradient
              colors={getBadgeColors(badge.rarity)} // Dynamic gradient based on rarity
              style={{ 
                padding: 12, // Reduced from 16
                alignItems: 'center' 
              }}
            >
              <View 
                style={{ 
                  width: 40, // Reduced from 48
                  height: 40, // Reduced from 48
                  borderRadius: 12, // Reduced from 16
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: 6, // Reduced from 8
                  backgroundColor: colors.cardBase // Theme-aware card background
                }}
              >
                <Ionicons 
                  name={badge.icon as any} 
                  size={20} // Reduced from 24
                  color={colors.primary} // Theme-aware primary color
                />
              </View>
              
              <Text 
                style={{ 
                  fontSize: 12, // Reduced from 14 (designTokens.typography.caption equivalent)
                  fontWeight: 'bold',
                  color: colors.textInverse, // Theme-aware inverse text
                  textAlign: 'center',
                  marginBottom: 3 // Reduced from 4
                }}
                numberOfLines={2}
              >
                {badge.name}
              </Text>
              
              <Text 
                style={{ 
                  fontSize: 10, // Reduced from 12 (designTokens.typography.caption equivalent)
                  textTransform: 'uppercase',
                  color: colors.textInverse, // Theme-aware inverse text
                  textAlign: 'center',
                  letterSpacing: 1.0 // Reduced from 1.2
                }}
              >
                {badge.rarity}
              </Text>
            </LinearGradient>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}