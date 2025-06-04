import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../contexts/ThemeContext';

const { width: screenWidth } = Dimensions.get('window');

interface TravelPreferences {
  preferredDestinations?: string[];
  travelStyles?: string[];
  preferredActivities?: string[];
  budgetRange?: { min: number; max: number };
  travelCompanions?: string[];
  accommodationPreferences?: string[];
  transportationPreferences?: string[];
  dietaryRestrictions?: string[];
  accessibilityNeeds?: string[];
  languagePreferences?: string[];
  ecoFriendlyPreferences?: boolean;
}

interface TravelPreferencesSectionProps {
  travelPreferences?: TravelPreferences;
  onEditPreferences: () => void;
}

// Preference section configuration
const preferenceConfig = [
  {
    key: 'travelStyles',
    title: 'Travel Styles',
    icon: 'compass-outline' as keyof typeof Ionicons.glyphMap,
    colorKey: 'cyber',
    type: 'tags'
  },
  {
    key: 'preferredDestinations',
    title: 'Preferred Destinations',
    icon: 'location-outline' as keyof typeof Ionicons.glyphMap,
    colorKey: 'electric',
    type: 'tags'
  },
  {
    key: 'preferredActivities',
    title: 'Preferred Activities',
    icon: 'fitness-outline' as keyof typeof Ionicons.glyphMap,
    colorKey: 'accent',
    type: 'tags'
  },
  {
    key: 'travelCompanions',
    title: 'Travel Companions',
    icon: 'people-outline' as keyof typeof Ionicons.glyphMap,
    colorKey: 'neon',
    type: 'tags'
  },
  {
    key: 'accommodationPreferences',
    title: 'Accommodation',
    icon: 'bed-outline' as keyof typeof Ionicons.glyphMap,
    colorKey: 'primary',
    type: 'tags'
  },
  {
    key: 'transportationPreferences',
    title: 'Transportation',
    icon: 'car-outline' as keyof typeof Ionicons.glyphMap,
    colorKey: 'warning',
    type: 'tags'
  },
  {
    key: 'dietaryRestrictions',
    title: 'Dietary Restrictions',
    icon: 'restaurant-outline' as keyof typeof Ionicons.glyphMap,
    colorKey: 'error',
    type: 'tags'
  },
  {
    key: 'languagePreferences',
    title: 'Languages',
    icon: 'language-outline' as keyof typeof Ionicons.glyphMap,
    colorKey: 'secondary',
    type: 'tags'
  },
  {
    key: 'accessibilityNeeds',
    title: 'Accessibility Needs',
    icon: 'accessibility-outline' as keyof typeof Ionicons.glyphMap,
    colorKey: 'cyber',
    type: 'tags'
  }
];

export default function TravelPreferencesSection({ 
  travelPreferences,
  onEditPreferences
}: TravelPreferencesSectionProps) {
  const { colors } = useTheme();

  // Render tag component (smaller size)
  const renderTag = (text: string, colorKey: string, index: number) => (
    <View 
      key={index}
      style={{ 
        backgroundColor: colors[colorKey as keyof typeof colors] || colors.primary,
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
        marginRight: 6,
        marginBottom: 6,
        shadowColor: colors.text,
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.08,
        shadowRadius: 2,
        elevation: 1
      }}
    >
      <Text 
        style={{ 
          fontSize: 11,
          color: colors.textInverse,
          fontWeight: '500'
        }}
      >
        {text}
      </Text>
    </View>
  );

  // Render compact preference section
  const renderPreferenceSection = (config: typeof preferenceConfig[0], index: number) => {
    const data = travelPreferences?.[config.key as keyof TravelPreferences];
    
    if (!data || (Array.isArray(data) && data.length === 0)) {
      return null;
    }

    const cardWidth = (screenWidth - 64) / 2; // 2 cards per row with 24px padding on each side and 16px gap

    return (
      <View 
        key={config.key}
        style={{ 
          backgroundColor: colors.cardBase,
          borderColor: colors.border,
          borderWidth: 0.5,
          borderRadius: 16,
          padding: 12,
          width: cardWidth,
          marginBottom: 12,
          shadowColor: colors.text,
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.05,
          shadowRadius: 8,
          elevation: 2
        }}
      >
        <View style={{ 
          flexDirection: 'row', 
          alignItems: 'center', 
          marginBottom: 8
        }}>
          <View style={{
            backgroundColor: colors[config.colorKey as keyof typeof colors] || colors.primary,
            padding: 6,
            borderRadius: 8,
            marginRight: 8,
            flexShrink: 0 // Prevent icon from shrinking
          }}>
            <Ionicons 
              name={config.icon} 
              size={14} 
              color={colors.textInverse}
            />
          </View>
          <Text 
            style={{ 
              fontSize: 12, 
              color: colors.text,
              fontWeight: '600',
              flex: 1,
              lineHeight: 16
            }}
            numberOfLines={2} // Allow 2 lines for longer titles
          >
            {config.title}
          </Text>
        </View>
        
        <View style={{ 
          flexDirection: 'row', 
          flexWrap: 'wrap'
        }}>
          {(data as string[]).slice(0, 4).map((item: string, tagIndex: number) => 
            renderTag(item, config.colorKey, tagIndex)
          )}
          {(data as string[]).length > 4 && (
            <View style={{
              backgroundColor: colors.surface,
              paddingHorizontal: 8,
              paddingVertical: 4,
              borderRadius: 12,
              borderWidth: 1,
              borderColor: colors.border
            }}>
              <Text style={{
                fontSize: 11,
                color: colors.textSecondary,
                fontWeight: '500'
              }}>
                +{(data as string[]).length - 4}
              </Text>
            </View>
          )}
        </View>
      </View>
    );
  };

  if (!travelPreferences) {
    return (
      <View style={{ paddingHorizontal: 24, marginBottom: 24 }}>
        <Text 
          style={{ 
            fontSize: 26,
            fontWeight: '800',
            color: colors.text,
            marginBottom: 16
          }}
        >
          Travel Preferences
        </Text>
        <View 
          style={{ 
            backgroundColor: colors.surface,
            borderColor: colors.border,
            borderWidth: 1,
            borderRadius: 20,
            padding: 24,
            alignItems: 'center'
          }}
        >
          <View style={{
            backgroundColor: colors.primary,
            padding: 16,
            borderRadius: 16,
            marginBottom: 16
          }}>
            <Ionicons 
              name="settings-outline" 
              size={28} 
              color={colors.textInverse} 
            />
          </View>
          <Text 
            style={{ 
              fontSize: 16,
              color: colors.text,
              fontWeight: '600',
              marginBottom: 6,
              textAlign: 'center'
            }}
          >
            Personalize Your Journey
          </Text>
          <Text 
            style={{ 
              fontSize: 14,
              color: colors.textTertiary,
              marginBottom: 20,
              textAlign: 'center',
              lineHeight: 20
            }}
          >
            Set your travel preferences to get personalized recommendations tailored just for you.
          </Text>
          <TouchableOpacity 
            onPress={onEditPreferences}
            style={{ 
              backgroundColor: colors.primary,
              paddingVertical: 12,
              paddingHorizontal: 24,
              borderRadius: 12,
              shadowColor: colors.primary,
              shadowOffset: { width: 0, height: 3 },
              shadowOpacity: 0.25,
              shadowRadius: 6,
              elevation: 3
            }}
            activeOpacity={0.8}
          >
            <Text 
              style={{ 
                fontSize: 14,
                color: colors.textInverse,
                fontWeight: '600',
                textAlign: 'center'
              }}
            >
              Set Preferences
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={{ paddingHorizontal: 24, marginBottom: 24 }}>
      {/* Header - Compact */}
      <View style={{ 
        flexDirection: 'row', 
        alignItems: 'center', 
        justifyContent: 'space-between', 
        marginBottom: 16
      }}>
        <Text 
          style={{ 
            fontSize: 24,
            fontWeight: '800',
            color: colors.text,
            flex: 1
          }}
        >
          Travel Preferences
        </Text>
        <TouchableOpacity 
          onPress={onEditPreferences}
          style={{ 
            padding: 10,
            backgroundColor: colors.electric,
            borderRadius: 12,
            shadowColor: colors.electric,
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.2,
            shadowRadius: 4,
            elevation: 2
          }}
          activeOpacity={0.8}
        >
          <Ionicons name="pencil-outline" size={16} color={colors.textInverse} />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Grid Layout for Preference Cards */}
        <View style={{ 
          flexDirection: 'row', 
          flexWrap: 'wrap',
          justifyContent: 'space-between'
        }}>
          {preferenceConfig.map((config, index) => renderPreferenceSection(config, index))}
        </View>

        {/* Budget Range - Full Width Special Card */}
        {travelPreferences.budgetRange && (
          <View 
            style={{ 
              backgroundColor: colors.cardBase,
              borderColor: colors.border,
              borderWidth: 0.5,
              borderRadius: 16,
              padding: 16,
              marginTop: 4,
              marginBottom: 12,
              shadowColor: colors.text,
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.05,
              shadowRadius: 8,
              elevation: 2
            }}
          >
            <View style={{ 
              flexDirection: 'row', 
              alignItems: 'center', 
              marginBottom: 10
            }}>
              <View style={{
                backgroundColor: colors.success,
                padding: 6,
                borderRadius: 8,
                marginRight: 8
              }}>
                <Ionicons 
                  name="wallet-outline" 
                  size={14} 
                  color={colors.textInverse}
                />
              </View>
              <Text 
                style={{ 
                  fontSize: 14,
                  color: colors.text,
                  fontWeight: '600'
                }}
              >
                Budget Range
              </Text>
            </View>
            <View style={{
              backgroundColor: colors.surface,
              padding: 12,
              borderRadius: 12,
              borderColor: colors.border,
              borderWidth: 0.5
            }}>
              <Text 
                style={{ 
                  fontSize: 18,
                  color: colors.success,
                  fontWeight: '700',
                  textAlign: 'center'
                }}
              >
                ${travelPreferences.budgetRange.min.toLocaleString()} - ${travelPreferences.budgetRange.max.toLocaleString()}
              </Text>
            </View>
          </View>
        )}

        {/* Eco-Friendly - Full Width Special Card */}
        {travelPreferences.ecoFriendlyPreferences && (
          <View 
            style={{ 
              backgroundColor: colors.cardBase,
              borderColor: colors.success,
              borderWidth: 1,
              borderRadius: 16,
              padding: 16,
              marginBottom: 12,
              shadowColor: colors.success,
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.1,
              shadowRadius: 8,
              elevation: 2
            }}
          >
            <View style={{ 
              flexDirection: 'row', 
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <View style={{
                backgroundColor: colors.success,
                padding: 8,
                borderRadius: 10,
                marginRight: 10
              }}>
                <Ionicons 
                  name="leaf-outline" 
                  size={16} 
                  color={colors.textInverse}
                />
              </View>
              <Text 
                style={{ 
                  fontSize: 14,
                  color: colors.text,
                  fontWeight: '600'
                }}
              >
                Eco-Friendly Travel Enabled
              </Text>
              <View style={{ marginLeft: 6 }}>
                <Ionicons 
                  name="checkmark-circle" 
                  size={16} 
                  color={colors.success}
                />
              </View>
            </View>
          </View>
        )}
      </ScrollView>
    </View>
  );
}