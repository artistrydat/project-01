import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useTheme, designTokens } from '../../contexts/ThemeContext';

interface TravelHistory {
  country: string;
  visitedAt: string;
  duration: string;
}

interface TravelGoal {
  destination: string;
  targetYear: string;
  priority: 'high' | 'medium' | 'low';
}

interface TravelJourneySectionProps {
  travelHistory?: TravelHistory[];
  travelGoals?: TravelGoal[];
}

export default function TravelJourneySection({ 
  travelHistory = [], 
  travelGoals = [] 
}: TravelJourneySectionProps) {
  const { colors } = useTheme();


  return (
    <View style={{ paddingHorizontal: 24, marginBottom: 24 }}>
      {/* Section title using typography token */}
      <Text 
        style={{ 
          fontSize: 24, // Match BadgesSection and InterestsCreditsSection title size
          fontWeight: '600',
          color: colors.text, 
          marginBottom: 16 // Match other sections margin
        }}
      >
        Travel Journey
      </Text>

      {/* Travel History */}
      <View style={{ marginBottom: 24 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
          <Ionicons 
            name="airplane" 
            size={20} 
            color={colors.primary} // theme primary color
            style={{ marginRight: 8 }}
          />
          <Text 
            className={`${designTokens.typography.bodyLarge} font-semibold`}
            style={{ color: colors.text }} // theme text color
          >
            Countries Visited ({travelHistory.length})
          </Text>
        </View>

        {travelHistory.length > 0 ? (
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingRight: 24 }}
          >
            {travelHistory.map((trip, index) => (
              <View 
                key={index}
                style={{ 
                  marginRight: 12,
                  borderRadius: 16,
                  overflow: 'hidden',
                  width: 130, // Reduced width
                  shadowColor: colors.background,
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.1,
                  shadowRadius: 4,
                  elevation: 2
                }}
              >
                <LinearGradient
                  colors={[colors.primary, colors.electric]} // Improved gradient colors
                  style={{ 
                    padding: 14, // Reduced padding
                    borderWidth: 1,
                    borderColor: colors.border, // theme border color
                    borderRadius: 16
                  }}
                >
                  <Text 
                    style={{ 
                      fontSize: 14, // Specific font size
                      fontWeight: 'bold',
                      color: colors.textInverse, // Changed to textInverse for better contrast
                      marginBottom: 4
                    }}
                    numberOfLines={2}
                  >
                    {trip.country}
                  </Text>
                  <Text 
                    style={{ 
                      fontSize: 12, // Specific font size
                      color: colors.textInverse, // Changed to textInverse for better contrast
                      marginBottom: 4,
                      opacity: 0.8 // Slight transparency for hierarchy
                    }}
                  >
                    {trip.visitedAt}
                  </Text>
                  <Text 
                    style={{ 
                      fontSize: 11, // Specific font size
                      color: colors.textInverse, // Changed to textInverse for better contrast
                      opacity: 0.7 // More transparency for tertiary text
                    }}
                  >
                    {trip.duration}
                  </Text>
                </LinearGradient>
              </View>
            ))}
          </ScrollView>
        ) : (
          <View 
            style={{ 
              backgroundColor: colors.surface, // theme surface color
              borderColor: colors.border, // theme border color
              borderWidth: 1,
              padding: 16,
              borderRadius: 16
            }}
          >
            <Text 
              className={designTokens.typography.body}
              style={{ color: colors.textTertiary }} // theme tertiary text for placeholder
            >
              No trips recorded yet. Start your journey! ✈️
            </Text>
          </View>
        )}
      </View>

      {/* Travel Goals */}
      <View>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
          <Ionicons 
            name="flag" 
            size={20} 
            color={colors.electric} // theme electric accent color
            style={{ marginRight: 8 }}
          />
          <Text 
            className={`${designTokens.typography.bodyLarge} font-semibold`}
            style={{ color: colors.text }} // theme text color
          >
            Dream Destinations ({travelGoals.length})
          </Text>
        </View>

        {travelGoals.length > 0 ? (
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingRight: 24 }}
          >
            {travelGoals.map((goal, index) => (
              <View 
                key={index}
                style={{ 
                  marginRight: 12,
                  borderRadius: 16,
                  overflow: 'hidden',
                  width: 160, // Appropriate width for goals
                  shadowColor: colors.background,
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.1,
                  shadowRadius: 4,
                  elevation: 2
                }}
              >
                <LinearGradient
                  colors={[colors.electric, colors.neon]} // Different gradient for goals
                  style={{ 
                    padding: 14, // Reduced padding
                    borderWidth: 1,
                    borderColor: colors.border, // theme border color
                    borderRadius: 16
                  }}
                >
                  <Text 
                    style={{ 
                      fontSize: 14, // Specific font size
                      fontWeight: 'bold',
                      color: colors.textInverse, // Changed to textInverse for better contrast
                      marginBottom: 6
                    }}
                    numberOfLines={2}
                  >
                    {goal.destination}
                  </Text>
                  <Text 
                    style={{ 
                      fontSize: 12, // Specific font size
                      color: colors.textInverse, // Changed to textInverse for better contrast
                      marginBottom: 8,
                      opacity: 0.8 // Slight transparency
                    }}
                  >
                    Target: {goal.targetYear}
                  </Text>
                  <View 
                    style={{ 
                      backgroundColor: 'rgba(255, 255, 255, 0.2)', // Semi-transparent white
                      paddingHorizontal: 10,
                      paddingVertical: 4,
                      borderRadius: 12,
                      alignSelf: 'flex-start'
                    }}
                  >
                    <Text 
                      style={{ 
                        fontSize: 10, // Specific font size
                        fontWeight: 'bold',
                        textTransform: 'uppercase',
                        color: colors.textInverse, // theme inverse text
                        letterSpacing: 0.5
                      }}
                    >
                      {goal.priority}
                    </Text>
                  </View>
                </LinearGradient>
              </View>
            ))}
          </ScrollView>
        ) : (
          <View 
            style={{ 
              backgroundColor: colors.surface, // theme surface color
              borderColor: colors.border, // theme border color
              borderWidth: 1,
              padding: 16,
              borderRadius: 16
            }}
          >
            <Text 
              className={designTokens.typography.body}
              style={{ color: colors.textTertiary }} // theme tertiary text for placeholder
            >
              No dream destinations set. Add some travel goals! 🌍
            </Text>
          </View>
        )}
      </View>
    </View>
  );
}