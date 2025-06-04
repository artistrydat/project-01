import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Switch } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack, router } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useProfileStore, useCurrentProfile } from '~/store/ProfileStore';
import Slider from '@react-native-community/slider';
import { useTheme } from '~/contexts/ThemeContext';

// Define types for the PreferenceChip props
interface PreferenceChipProps {
  label: string;
  selected: boolean;
  onToggle: () => void;
}

// Helper component for selection chips
const PreferenceChip: React.FC<PreferenceChipProps> = ({ label, selected, onToggle }) => {
  const { colors } = useTheme();
  
  return (
    <TouchableOpacity
      onPress={onToggle}
      style={{
        marginRight: 12,
        marginBottom: 12,
        paddingHorizontal: 20,
        paddingVertical: 12,
        borderRadius: 16,
        shadowColor: colors.text,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 4,
        backgroundColor: selected ? colors.cyber : colors.surface,
        borderWidth: selected ? 0 : 1,
        borderColor: selected ? 'transparent' : `${colors.border}33`,
      }}
    >
      <Text style={{
        fontWeight: 'bold',
        color: selected ? colors.textInverse : colors.textSecondary
      }}>{label}</Text>
    </TouchableOpacity>
  );
};

// Define the type for the preferences state matching the new interface
interface PreferencesState {
  preferredDestinations: string[];
  travelStyles: string[];
  preferredActivities: string[];
  budgetRange: { min: number; max: number };
  travelCompanions: string[];
  accommodationPreferences: string[];
  transportationPreferences: string[];
  dietaryRestrictions: string[];
  accessibilityNeeds: string[];
  languagePreferences: string[];
  ecoFriendlyPreferences: boolean;
}

export default function EditPreferences() {
  const { updateTravelPreferences, isLoading } = useProfileStore();
  const profile = useCurrentProfile();
  const { colors } = useTheme();
  
  const [preferences, setPreferences] = useState<PreferencesState>({
    preferredDestinations: [],
    travelStyles: [],
    preferredActivities: [],
    budgetRange: { min: 1000, max: 5000 },
    travelCompanions: [],
    accommodationPreferences: [],
    transportationPreferences: [],
    dietaryRestrictions: [],
    accessibilityNeeds: [],
    languagePreferences: [],
    ecoFriendlyPreferences: false,
  });
  
  useEffect(() => {
    if (profile?.travelPreferences) {
      setPreferences({
        preferredDestinations: profile.travelPreferences.preferredDestinations || [],
        travelStyles: profile.travelPreferences.travelStyles || [],
        preferredActivities: profile.travelPreferences.preferredActivities || [],
        budgetRange: profile.travelPreferences.budgetRange || { min: 1000, max: 5000 },
        travelCompanions: profile.travelPreferences.travelCompanions || [],
        accommodationPreferences: profile.travelPreferences.accommodationPreferences || [],
        transportationPreferences: profile.travelPreferences.transportationPreferences || [],
        dietaryRestrictions: profile.travelPreferences.dietaryRestrictions || [],
        accessibilityNeeds: profile.travelPreferences.accessibilityNeeds || [],
        languagePreferences: profile.travelPreferences.languagePreferences || [],
        ecoFriendlyPreferences: profile.travelPreferences.ecoFriendlyPreferences || false,
      });
    }
  }, [profile]);

  const toggleArrayPreference = (field: keyof PreferencesState, value: string) => {
    setPreferences(prev => {
      const currentArray = prev[field] as string[];
      return {
        ...prev,
        [field]: currentArray.includes(value)
          ? currentArray.filter(item => item !== value)
          : [...currentArray, value]
      };
    });
  };

  const handleSave = () => {
    if (profile) {
      updateTravelPreferences(profile.id, preferences);
      router.back();
      console.log('Travel preferences saved:', preferences);
    }
  };

  // Sample options for different preferences
  const styleOptions = ['Adventure', 'Relaxation', 'Cultural', 'Foodie', 'Business', 'Wellness'];
  const destinationOptions = ['Beach', 'Mountains', 'City', 'Countryside', 'Desert', 'Islands'];
  const activityOptions = ['Hiking', 'Museums', 'Nightlife', 'Photography', 'Shopping', 'Food Tours'];
  const companionOptions = ['Solo', 'Partner', 'Family', 'Friends', 'Group Tours', 'Business'];
  const accommodationOptions = ['Hotel', 'Hostel', 'Resort', 'Airbnb', 'Camping', 'Luxury'];
  const transportationOptions = ['Flight', 'Train', 'Car Rental', 'Bus', 'Cruise', 'Walking'];
  const dietaryOptions = ['Vegetarian', 'Vegan', 'Gluten-Free', 'Halal', 'Kosher', 'No Restrictions'];
  const accessibilityOptions = ['Wheelchair Access', 'Visual Assistance', 'Hearing Assistance', 'Mobility Aid', 'Service Animal'];
  const languageOptions = ['English', 'Spanish', 'French', 'German', 'Italian', 'Japanese', 'Mandarin'];

  if (!profile) {
    return (
      <SafeAreaView style={{ 
        flex: 1, 
        backgroundColor: colors.background,
        alignItems: 'center', 
        justifyContent: 'center' 
      }}>
        <View style={{ 
          padding: 24, 
          borderRadius: 8, 
          alignItems: 'center' 
        }}>
          <MaterialIcons name="settings" size={48} color={colors.success} />
          <Text style={{ 
            fontSize: 18, 
            fontWeight: '500', 
            marginTop: 16, 
            color: colors.textSecondary 
          }}>Loading preferences...</Text>
          <View style={{ 
            height: 8, 
            width: 160, 
            backgroundColor: colors.border, 
            borderRadius: 9999, 
            marginTop: 16, 
            overflow: 'hidden' 
          }}>
            <View style={{ 
              height: '100%', 
              backgroundColor: colors.success, 
              borderRadius: 9999, 
              width: '60%' 
            }} />
          </View>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ 
      flex: 1, 
      backgroundColor: colors.background 
    }}>
      <Stack.Screen options={{ headerShown: false }} />
      
      {/* Modern Header */}
      <View style={{
        paddingHorizontal: 24,
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: `${colors.border}80`,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.surface,
      }}>
        <TouchableOpacity 
          style={{
            backgroundColor: colors.cyber,
            padding: 12,
            borderRadius: 16,
            shadowColor: colors.text,
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.1,
            shadowRadius: 8,
            elevation: 4,
          }}
          onPress={() => router.back()}
        >
          <MaterialIcons name="arrow-back" size={20} color={colors.textInverse} />
        </TouchableOpacity>
        <Text style={{
          fontSize: 24,
          fontWeight: '900',
          textAlign: 'center',
          flex: 1,
          marginLeft: 16,
          color: colors.text
        }}>
          Your Vibe<Text style={{ color: colors.neon }}>.</Text>
        </Text>
        <View style={{ width: 44 }} />
      </View>
      
      <ScrollView 
        style={{ flex: 1, paddingHorizontal: 24, paddingTop: 32 }} 
        showsVerticalScrollIndicator={false}
      >
        {/* Travel Styles */}
        <View style={{ marginBottom: 40 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 16 }}>
            <View style={{
              backgroundColor: colors.cyber,
              padding: 8,
              borderRadius: 16,
              marginRight: 12
            }}>
              <MaterialIcons name="explore" size={20} color={colors.textInverse} />
            </View>
            <Text style={{
              fontSize: 24,
              fontWeight: '900',
              color: colors.text
            }}>Travel Style ✨</Text>
          </View>
          <Text style={{
            color: colors.textSecondary,
            marginBottom: 24,
            fontSize: 18,
            fontWeight: '500'
          }}>What kind of traveler are you?</Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
            {styleOptions.map(style => (
              <PreferenceChip
                key={style}
                label={style}
                selected={preferences.travelStyles.includes(style)}
                onToggle={() => toggleArrayPreference('travelStyles', style)}
              />
            ))}
          </View>
        </View>
        
        {/* Preferred Destinations */}
        <View style={{ marginBottom: 40 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 16 }}>
            <View style={{
              backgroundColor: colors.electric,
              padding: 8,
              borderRadius: 16,
              marginRight: 12
            }}>
              <MaterialIcons name="place" size={20} color={colors.textInverse} />
            </View>
            <Text style={{
              fontSize: 24,
              fontWeight: '900',
              color: colors.text
            }}>Destinations 🌍</Text>
          </View>
          <Text style={{
            color: colors.textSecondary,
            marginBottom: 24,
            fontSize: 18,
            fontWeight: '500'
          }}>What types of places call to you?</Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
            {destinationOptions.map(destination => (
              <PreferenceChip
                key={destination}
                label={destination}
                selected={preferences.preferredDestinations.includes(destination)}
                onToggle={() => toggleArrayPreference('preferredDestinations', destination)}
              />
            ))}
          </View>
        </View>

        {/* Preferred Activities */}
        <View style={{ marginBottom: 40 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 16 }}>
            <View style={{
              backgroundColor: colors.accent,
              padding: 8,
              borderRadius: 16,
              marginRight: 12
            }}>
              <MaterialIcons name="local-activity" size={20} color={colors.textInverse} />
            </View>
            <Text style={{
              fontSize: 24,
              fontWeight: '900',
              color: colors.text
            }}>Activities 🎯</Text>
          </View>
          <Text style={{
            color: colors.textSecondary,
            marginBottom: 24,
            fontSize: 18,
            fontWeight: '500'
          }}>What activities excite you most?</Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
            {activityOptions.map(activity => (
              <PreferenceChip
                key={activity}
                label={activity}
                selected={preferences.preferredActivities.includes(activity)}
                onToggle={() => toggleArrayPreference('preferredActivities', activity)}
              />
            ))}
          </View>
        </View>
        
        {/* Travel Companions */}
        <View style={{ marginBottom: 40 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 16 }}>
            <View style={{
              backgroundColor: colors.neon,
              padding: 8,
              borderRadius: 16,
              marginRight: 12
            }}>
              <MaterialIcons name="group" size={20} color={colors.textInverse} />
            </View>
            <Text style={{
              fontSize: 24,
              fontWeight: '900',
              color: colors.text
            }}>Travel Squad 👥</Text>
          </View>
          <Text style={{
            color: colors.textSecondary,
            marginBottom: 24,
            fontSize: 18,
            fontWeight: '500'
          }}>Who joins your adventures?</Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
            {companionOptions.map(companion => (
              <PreferenceChip
                key={companion}
                label={companion}
                selected={preferences.travelCompanions.includes(companion)}
                onToggle={() => toggleArrayPreference('travelCompanions', companion)}
              />
            ))}
          </View>
        </View>
        
        {/* Accommodation Preferences */}
        <View style={{ marginBottom: 40 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 16 }}>
            <View style={{
              backgroundColor: colors.primary,
              padding: 8,
              borderRadius: 16,
              marginRight: 12
            }}>
              <MaterialIcons name="hotel" size={20} color={colors.textInverse} />
            </View>
            <Text style={{
              fontSize: 24,
              fontWeight: '900',
              color: colors.text
            }}>Stay Style 🏨</Text>
          </View>
          <Text style={{
            color: colors.textSecondary,
            marginBottom: 24,
            fontSize: 18,
            fontWeight: '500'
          }}>Where do you love to rest?</Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
            {accommodationOptions.map(accommodation => (
              <PreferenceChip
                key={accommodation}
                label={accommodation}
                selected={preferences.accommodationPreferences.includes(accommodation)}
                onToggle={() => toggleArrayPreference('accommodationPreferences', accommodation)}
              />
            ))}
          </View>
        </View>

        {/* Transportation Preferences */}
        <View style={{ marginBottom: 40 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 16 }}>
            <View style={{
              backgroundColor: colors.warning,
              padding: 8,
              borderRadius: 16,
              marginRight: 12
            }}>
              <MaterialIcons name="directions" size={20} color={colors.textInverse} />
            </View>
            <Text style={{
              fontSize: 24,
              fontWeight: '900',
              color: colors.text
            }}>Transportation 🚗</Text>
          </View>
          <Text style={{
            color: colors.textSecondary,
            marginBottom: 24,
            fontSize: 18,
            fontWeight: '500'
          }}>How do you prefer to get around?</Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
            {transportationOptions.map(transport => (
              <PreferenceChip
                key={transport}
                label={transport}
                selected={preferences.transportationPreferences.includes(transport)}
                onToggle={() => toggleArrayPreference('transportationPreferences', transport)}
              />
            ))}
          </View>
        </View>

        {/* Dietary Restrictions */}
        <View style={{ marginBottom: 40 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 16 }}>
            <View style={{
              backgroundColor: colors.success,
              padding: 8,
              borderRadius: 16,
              marginRight: 12
            }}>
              <MaterialIcons name="restaurant" size={20} color={colors.textInverse} />
            </View>
            <Text style={{
              fontSize: 24,
              fontWeight: '900',
              color: colors.text
            }}>Dietary Needs 🍽️</Text>
          </View>
          <Text style={{
            color: colors.textSecondary,
            marginBottom: 24,
            fontSize: 18,
            fontWeight: '500'
          }}>Any dietary preferences or restrictions?</Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
            {dietaryOptions.map(dietary => (
              <PreferenceChip
                key={dietary}
                label={dietary}
                selected={preferences.dietaryRestrictions.includes(dietary)}
                onToggle={() => toggleArrayPreference('dietaryRestrictions', dietary)}
              />
            ))}
          </View>
        </View>

        {/* Accessibility Needs */}
        <View style={{ marginBottom: 40 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 16 }}>
            <View style={{
              backgroundColor: colors.secondary,
              padding: 8,
              borderRadius: 16,
              marginRight: 12
            }}>
              <MaterialIcons name="accessible" size={20} color={colors.textInverse} />
            </View>
            <Text style={{
              fontSize: 24,
              fontWeight: '900',
              color: colors.text
            }}>Accessibility ♿</Text>
          </View>
          <Text style={{
            color: colors.textSecondary,
            marginBottom: 24,
            fontSize: 18,
            fontWeight: '500'
          }}>Any accessibility requirements?</Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
            {accessibilityOptions.map(accessibility => (
              <PreferenceChip
                key={accessibility}
                label={accessibility}
                selected={preferences.accessibilityNeeds.includes(accessibility)}
                onToggle={() => toggleArrayPreference('accessibilityNeeds', accessibility)}
              />
            ))}
          </View>
        </View>

        {/* Language Preferences */}
        <View style={{ marginBottom: 40 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 16 }}>
            <View style={{
              backgroundColor: colors.error,
              padding: 8,
              borderRadius: 16,
              marginRight: 12
            }}>
              <MaterialIcons name="translate" size={20} color={colors.textInverse} />
            </View>
            <Text style={{
              fontSize: 24,
              fontWeight: '900',
              color: colors.text
            }}>Languages 🗣️</Text>
          </View>
          <Text style={{
            color: colors.textSecondary,
            marginBottom: 24,
            fontSize: 18,
            fontWeight: '500'
          }}>What languages do you speak?</Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
            {languageOptions.map(language => (
              <PreferenceChip
                key={language}
                label={language}
                selected={preferences.languagePreferences.includes(language)}
                onToggle={() => toggleArrayPreference('languagePreferences', language)}
              />
            ))}
          </View>
        </View>
        
        {/* Budget Range */}
        <View style={{ marginBottom: 40 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 16 }}>
            <View style={{
              backgroundColor: colors.warning,
              padding: 8,
              borderRadius: 16,
              marginRight: 12
            }}>
              <MaterialIcons name="attach-money" size={20} color={colors.textInverse} />
            </View>
            <Text style={{
              fontSize: 24,
              fontWeight: '900',
              color: colors.text
            }}>Budget Range 💰</Text>
          </View>
          <Text style={{
            color: colors.textSecondary,
            marginBottom: 24,
            fontSize: 18,
            fontWeight: '500'
          }}>What&rsquo;s your travel investment sweet spot?</Text>
          
          <View style={{
            backgroundColor: colors.surface,
            borderRadius: 24,
            padding: 24,
            borderWidth: 1,
            borderColor: `${colors.border}50`,
            shadowColor: colors.text,
            shadowOffset: { width: 0, height: 12 },
            shadowOpacity: 0.15,
            shadowRadius: 24,
            elevation: 8,
            marginBottom: 24
          }}>
            <Text style={{
              textAlign: 'center',
              color: colors.text,
              marginBottom: 24,
              fontSize: 24,
              fontWeight: '900'
            }}>
              ${preferences.budgetRange.min} - ${preferences.budgetRange.max}
            </Text>
            
            {/* Min budget slider */}
            <View style={{ marginBottom: 24 }}>
              <Text style={{
                color: colors.textSecondary,
                marginBottom: 12,
                fontWeight: 'bold',
                fontSize: 18
              }}>Minimum budget: ${preferences.budgetRange.min}</Text>
              <Slider
                minimumValue={500}
                maximumValue={preferences.budgetRange.max - 500}
                step={100}
                value={preferences.budgetRange.min}
                onValueChange={(value) => 
                  setPreferences(prev => ({
                    ...prev,
                    budgetRange: { ...prev.budgetRange, min: value }
                  }))
                }
                minimumTrackTintColor={colors.neon}
                maximumTrackTintColor={colors.border}
                thumbTintColor={colors.neon}
              />
            </View>
            
            {/* Max budget slider */}
            <View>
              <Text style={{
                color: colors.textSecondary,
                marginBottom: 12,
                fontWeight: 'bold',
                fontSize: 18
              }}>Maximum budget: ${preferences.budgetRange.max}</Text>
              <Slider
                minimumValue={preferences.budgetRange.min + 500}
                maximumValue={10000}
                step={100}
                value={preferences.budgetRange.max}
                onValueChange={(value) => 
                  setPreferences(prev => ({
                    ...prev,
                    budgetRange: { ...prev.budgetRange, max: value }
                  }))
                }
                minimumTrackTintColor={colors.error}
                maximumTrackTintColor={colors.border}
                thumbTintColor={colors.error}
              />
            </View>
          </View>
        </View>
        
        {/* Eco-Friendly Preferences */}
        <View style={{ marginBottom: 40 }}>
          <View style={{
            backgroundColor: colors.surface,
            borderRadius: 24,
            padding: 24,
            borderWidth: 1,
            borderColor: `${colors.border}50`,
            shadowColor: colors.text,
            shadowOffset: { width: 0, height: 12 },
            shadowOpacity: 0.15,
            shadowRadius: 24,
            elevation: 8,
          }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
              <View style={{ flex: 1 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
                  <View style={{
                    backgroundColor: colors.success,
                    padding: 8,
                    borderRadius: 16,
                    marginRight: 12
                  }}>
                    <MaterialIcons name="eco" size={20} color={colors.textInverse} />
                  </View>
                  <Text style={{
                    fontSize: 20,
                    fontWeight: '900',
                    color: colors.text
                  }}>Eco-Friendly Travel 🌱</Text>
                </View>
                <Text style={{
                  color: colors.textSecondary,
                  fontWeight: '500',
                  fontSize: 16
                }}>Prefer sustainable & green options</Text>
              </View>
              <Switch
                value={preferences.ecoFriendlyPreferences}
                onValueChange={(value) => 
                  setPreferences(prev => ({ ...prev, ecoFriendlyPreferences: value }))
                }
                trackColor={{ false: colors.border, true: colors.neon }}
                thumbColor={preferences.ecoFriendlyPreferences ? colors.textInverse : colors.textTertiary}
              />
            </View>
          </View>
        </View>
        
        {/* Save Button */}
        <TouchableOpacity
          style={{
            borderRadius: 24,
            overflow: 'hidden',
            marginBottom: 40,
            shadowColor: colors.text,
            shadowOffset: { width: 0, height: 12 },
            shadowOpacity: 0.15,
            shadowRadius: 24,
            elevation: 8,
            opacity: isLoading ? 0.7 : 1
          }}
          onPress={handleSave}
          disabled={isLoading}
        >
          <LinearGradient
            colors={isLoading ? [colors.textTertiary, colors.textSecondary] : [colors.neon, colors.success]}
            style={{
              paddingVertical: 20,
              paddingHorizontal: 32,
              alignItems: 'center'
            }}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              {isLoading ? (
                <>
                  <MaterialIcons name="hourglass-empty" size={24} color={colors.textInverse} style={{ marginRight: 12 }} />
                  <Text style={{
                    color: colors.textInverse,
                    fontWeight: '900',
                    fontSize: 20,
                    letterSpacing: 1,
                    marginLeft: 12
                  }}>SAVING...</Text>
                </>
              ) : (
                <>
                  <MaterialIcons name="check" size={24} color={colors.textInverse} style={{ marginRight: 12 }} />
                  <Text style={{
                    color: colors.textInverse,
                    fontWeight: '900',
                    fontSize: 20,
                    letterSpacing: 1,
                    marginLeft: 12
                  }}>SAVE PREFERENCES ✨</Text>
                </>
              )}
            </View>
          </LinearGradient>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}