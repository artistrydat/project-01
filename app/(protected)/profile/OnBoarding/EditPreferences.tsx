import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Switch } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack, router } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { useProfileStore, useCurrentProfile } from '~/store/ProfileStore';
import Slider from '@react-native-community/slider';

// Define types for the PreferenceChip props
interface PreferenceChipProps {
  label: string;
  selected: boolean;
  onToggle: () => void;
}

// Helper component for selection chips
const PreferenceChip: React.FC<PreferenceChipProps> = ({ label, selected, onToggle }) => (
  <TouchableOpacity
    onPress={onToggle}
    className={`mr-2 mb-2 px-3 py-2 rounded-full ${selected ? 'bg-teal-500' : 'bg-gray-200'}`}
  >
    <Text className={`${selected ? 'text-white' : 'text-gray-700'}`}>{label}</Text>
  </TouchableOpacity>
);

// Define the type for the preferences state
interface PreferencesState {
  travelStyles: string[];
  preferredDestinations: string[];
  budgetRange: { min: number; max: number };
  travelCompanions: string[];
  accommodationPreferences: string[];
  ecoFriendlyPreferences: boolean;
}

export default function EditPreferences() {
  const { updateProfile, isLoading } = useProfileStore();
  const profile = useCurrentProfile();
  
  const [preferences, setPreferences] = useState<PreferencesState>({
    travelStyles: [],
    preferredDestinations: [],
    budgetRange: { min: 1000, max: 5000 },
    travelCompanions: [],
    accommodationPreferences: [],
    ecoFriendlyPreferences: false,
  });
  
  useEffect(() => {
    if (profile?.travelPreferences) {
      setPreferences({
        travelStyles: profile.travelPreferences.travelStyles || [],
        preferredDestinations: profile.travelPreferences.preferredDestinations || [],
        budgetRange: profile.travelPreferences.budgetRange || { min: 1000, max: 5000 },
        travelCompanions: profile.travelPreferences.travelCompanions || [],
        accommodationPreferences: profile.travelPreferences.accommodationPreferences || [],
        ecoFriendlyPreferences: profile.travelPreferences.ecoFriendlyPreferences || false,
      });
    }
  }, [profile]);

  const toggleStyle = (style: string) => {
    setPreferences(prev => ({
      ...prev,
      travelStyles: prev.travelStyles.includes(style)
        ? prev.travelStyles.filter(s => s !== style)
        : [...prev.travelStyles, style]
    }));
  };

  const toggleDestination = (destination: string) => {
    setPreferences(prev => ({
      ...prev,
      preferredDestinations: prev.preferredDestinations.includes(destination)
        ? prev.preferredDestinations.filter(d => d !== destination)
        : [...prev.preferredDestinations, destination]
    }));
  };

  const toggleCompanion = (companion: string) => {
    setPreferences(prev => ({
      ...prev,
      travelCompanions: prev.travelCompanions.includes(companion)
        ? prev.travelCompanions.filter(c => c !== companion)
        : [...prev.travelCompanions, companion]
    }));
  };

  const toggleAccommodation = (accommodation: string) => {
    setPreferences(prev => ({
      ...prev,
      accommodationPreferences: prev.accommodationPreferences.includes(accommodation)
        ? prev.accommodationPreferences.filter(a => a !== accommodation)
        : [...prev.accommodationPreferences, accommodation]
    }));
  };

  const handleSave = () => {
    if (profile) {
      updateProfile(profile.id, {
        travelPreferences: {
          ...profile.travelPreferences,
          ...preferences
        }
      });
      router.back();
      console.log('Preferences saved:', preferences);
    }
  };

  // Sample options for different preferences
  const styleOptions = ['Adventure', 'Relaxation', 'Cultural', 'Foodie', 'Trendy', 'Aesthetic'];
  const destinationOptions = ['Beach', 'Mountains', 'City', 'Countryside', 'Volunteer', 'Work'];
  const companionOptions = ['Solo', 'Partner', 'Family', 'Friends', 'Group'];
  const accommodationOptions = ['Hotel', 'Hostel', 'Resort', 'Airbnb', 'Camping'];

  if (!profile) {
    return (
      <SafeAreaView className="flex-1 bg-white items-center justify-center">
        <View className="p-6 rounded-lg items-center">
          <MaterialIcons name="settings" size={48} color="#10b981" />
          <Text className="text-lg font-medium mt-4 text-gray-700">Loading preferences...</Text>
          <View className="h-2 w-40 bg-gray-200 rounded-full mt-4 overflow-hidden">
            <View className="h-full bg-teal-500 rounded-full animate-pulse" style={{ width: '60%' }} />
          </View>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      <Stack.Screen options={{ headerShown: false }} />
      
      {/* Header */}
      <View className="px-4 py-5 border-b border-gray-200 flex-row items-center">
        <TouchableOpacity onPress={() => router.back()}>
          <MaterialIcons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text className="text-xl font-medium text-center flex-1">Travel Preferences</Text>
        <View style={{ width: 24 }} />
      </View>
      
      <ScrollView className="flex-1 px-4 pt-6">
        {/* Travel Styles */}
        <View className="mb-8">
          <Text className="text-lg font-semibold mb-3">Travel Style</Text>
          <Text className="text-gray-600 mb-4">What kind of traveler are you?</Text>
          <View className="flex-row flex-wrap">
            {styleOptions.map(style => (
              <PreferenceChip
                key={style}
                label={style}
                selected={preferences.travelStyles.includes(style)}
                onToggle={() => toggleStyle(style)}
              />
            ))}
          </View>
        </View>
        
        {/* Preferred Destinations */}
        <View className="mb-8">
          <Text className="text-lg font-semibold mb-3">Destinations</Text>
          <Text className="text-gray-600 mb-4">What types of places do you like to visit?</Text>
          <View className="flex-row flex-wrap">
            {destinationOptions.map(destination => (
              <PreferenceChip
                key={destination}
                label={destination}
                selected={preferences.preferredDestinations.includes(destination)}
                onToggle={() => toggleDestination(destination)}
              />
            ))}
          </View>
        </View>
        
        {/* Travel Companions */}
        <View className="mb-8">
          <Text className="text-lg font-semibold mb-3">Travel Companions</Text>
          <Text className="text-gray-600 mb-4">Who do you typically travel with?</Text>
          <View className="flex-row flex-wrap">
            {companionOptions.map(companion => (
              <PreferenceChip
                key={companion}
                label={companion}
                selected={preferences.travelCompanions.includes(companion)}
                onToggle={() => toggleCompanion(companion)}
              />
            ))}
          </View>
        </View>
        
        {/* Accommodation Preferences */}
        <View className="mb-8">
          <Text className="text-lg font-semibold mb-3">Accommodation</Text>
          <Text className="text-gray-600 mb-4">Where do you prefer to stay?</Text>
          <View className="flex-row flex-wrap">
            {accommodationOptions.map(accommodation => (
              <PreferenceChip
                key={accommodation}
                label={accommodation}
                selected={preferences.accommodationPreferences.includes(accommodation)}
                onToggle={() => toggleAccommodation(accommodation)}
              />
            ))}
          </View>
        </View>
        
        {/* Budget Range */}
        <View className="mb-8">
          <Text className="text-lg font-semibold mb-3">Budget Range</Text>
          <Text className="text-gray-600 mb-4">What&rsquo;s your typical travel budget?</Text>
          
          <View className="mb-6">
            <Text className="text-center text-gray-700 mb-4 text-lg font-medium">
              ${preferences.budgetRange.min} - ${preferences.budgetRange.max}
            </Text>
            
            {/* Min budget slider */}
            <View className="mb-6">
              <Text className="text-gray-600 mb-2">Minimum budget: ${preferences.budgetRange.min}</Text>
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
                minimumTrackTintColor="#10b981"
                maximumTrackTintColor="#ddd"
                thumbTintColor="#10b981"
              />
            </View>
            
            {/* Max budget slider */}
            <View>
              <Text className="text-gray-600 mb-2">Maximum budget: ${preferences.budgetRange.max}</Text>
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
                minimumTrackTintColor="#10b981"
                maximumTrackTintColor="#ddd"
                thumbTintColor="#10b981"
              />
            </View>
          </View>
        </View>
        
        {/* Eco-Friendly Preferences */}
        <View className="mb-8">
          <View className="flex-row justify-between items-center">
            <View>
              <Text className="text-lg font-semibold">Eco-Friendly Travel</Text>
              <Text className="text-gray-600 mt-1">Prefer sustainable options</Text>
            </View>
            <Switch
              value={preferences.ecoFriendlyPreferences}
              onValueChange={(value) => 
                setPreferences(prev => ({ ...prev, ecoFriendlyPreferences: value }))
              }
              trackColor={{ false: "#ddd", true: "#10b981" }}
            />
          </View>
        </View>
        
        {/* Save Button */}
        <TouchableOpacity
          className={`py-4 rounded-full items-center mb-10 ${isLoading ? 'bg-gray-400' : 'bg-teal-500'}`}
          onPress={handleSave}
          disabled={isLoading}
        >
          <View className="flex-row items-center justify-center">
            {isLoading ? (
              <Text className="text-white font-bold text-lg">Saving...</Text>
            ) : (
              <>
                <MaterialIcons name="check" size={22} color="white" style={{ marginRight: 8 }} />
                <Text className="text-white font-bold text-lg">Save Preferences</Text>
              </>
            )}
          </View>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}