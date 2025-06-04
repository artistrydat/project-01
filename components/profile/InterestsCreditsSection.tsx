// filepath: /Users/Muhammed/Desktop/project-01/components/profile/InterestsCreditsSection.tsx
import React from 'react';
import { View, Text } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useTheme, designTokens } from '../../contexts/ThemeContext';

interface InterestsCreditsProps {
  interests?: string[];
  credits?: number;
}

export default function InterestsCreditsSection({ 
  interests = [], 
  credits = 0 
}: InterestsCreditsProps) {
  const { colors, isDark } = useTheme();

  return (
    <View style={{ paddingHorizontal: 24, marginBottom: 24 }}>
      {/* Credits Section */}
      <View 
        className={`${designTokens.effects.shadowLight}`}
        style={{ 
          backgroundColor: colors.surface, // theme surface color
          borderColor: colors.border, // theme border color
          borderWidth: 1,
          borderRadius: 16,
          padding: 16,
          marginBottom: 16
        }}
      >
        <LinearGradient
          colors={[
            isDark ? 'rgba(34, 197, 94, 0.1)' : 'rgba(34, 197, 94, 0.05)',
            isDark ? 'rgba(59, 130, 246, 0.1)' : 'rgba(59, 130, 246, 0.05)'
          ]}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            borderRadius: 16
          }}
        />
        
        <View style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          position: 'relative'
        }}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <View 
              style={{ 
                width: 48,
                height: 48,
                borderRadius: 16,
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: 12,
                backgroundColor: colors.neon // theme neon color
              }}
            >
              <Ionicons name="diamond" size={24} color={colors.textInverse} />
            </View>
            <View>
              <Text 
                className={`${designTokens.typography.bodyLarge}`}
                style={{ 
                  color: colors.text, // theme text color
                  fontWeight: 'bold'
                }}
              >
                Travel Credits
              </Text>
              <Text 
                className={designTokens.typography.bodySmall}
                style={{ color: colors.textSecondary }} // theme secondary text
              >
                Earned from completed trips
              </Text>
            </View>
          </View>
          
          <View style={{ alignItems: 'flex-end' }}>
            <Text 
              className={`${designTokens.typography.heading2}`}
              style={{ 
                color: colors.neon, // theme neon color
                fontWeight: 'bold'
              }}
            >
              {credits.toLocaleString()}
            </Text>
            <Text 
              className={designTokens.typography.caption}
              style={{ 
                color: colors.textTertiary, // theme tertiary text
                textTransform: 'uppercase',
                letterSpacing: 1
              }}
            >
              POINTS
            </Text>
          </View>
        </View>
      </View>

      {/* Interests Section */}
      <Text 
        style={{ 
          fontSize: 24, // Match BadgesSection title size
          fontWeight: '600',
          color: colors.text, // theme text color
          marginBottom: 16
        }}
      >
        Travel Interests
      </Text>
      
      {interests.length > 0 ? (
        <View style={{
          flexDirection: 'row',
          flexWrap: 'wrap',
          gap: 8
        }}>
          {interests.map((interest, index) => (
            <View 
              key={index}
              style={{ 
                paddingHorizontal: 14, // Slightly reduced padding
                paddingVertical: 8,
                borderRadius: 20,
                borderWidth: 1,
                backgroundColor: colors.primary, // Use primary color background
                borderColor: colors.primary // Match border to background
              }}
            >
              <Text 
                style={{ 
                  fontSize: 13, // Slightly larger font size
                  color: colors.textInverse, // Use inverse text for better contrast
                  fontWeight: '600' // Slightly bolder
                }}
              >
                {interest}
              </Text>
            </View>
          ))}
        </View>
      ) : (
        <View 
          style={{ 
            padding: 16,
            borderRadius: 16,
            borderWidth: 1,
            backgroundColor: colors.surface, // theme surface color
            borderColor: colors.border // theme border color
          }}
        >
          <Text 
            className={designTokens.typography.body}
            style={{ color: colors.textTertiary }} // theme tertiary text
          >
            No interests added yet. Add some to get personalized recommendations! 🌟
          </Text>
        </View>
      )}
    </View>
  );
}