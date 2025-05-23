import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, Switch, Alert } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { useProfileStore, useCurrentProfile } from '~/store/ProfileStore';

const EditPrivacySet = () => {
  const router = useRouter();
  const currentProfile = useCurrentProfile();
  const { updatePrivacySettings } = useProfileStore();
  
  if (!currentProfile || !currentProfile.privacySettings) {
    return (
      <View className="flex-1 items-center justify-center">
        <Text>Loading...</Text>
      </View>
    );
  }
  
  const handleVisibilityChange = (value: 'public' | 'friends' | 'private') => {
    if (currentProfile.id) {
      updatePrivacySettings(
        currentProfile.id, 
        { profileVisibility: value }
      );
    }
  };
  
  const handleToggle = (setting: 'locationSharing' | 'dataSharingWithPartners') => {
    if (currentProfile.id) {
      updatePrivacySettings(
        currentProfile.id, 
        { [setting]: !currentProfile.privacySettings[setting] }
      );
    }
  };
  
  const handleSaveSettings = () => {
    Alert.alert(
      "Settings Saved",
      "Your privacy settings have been successfully updated.",
      [
        { 
          text: "OK", 
          onPress: () => router.replace('/(protected)/(tabs)/profile')
        }
      ]
    );
  };

  return (
    <ScrollView className="flex-1 bg-white">
      <Stack.Screen options={{ title: "Privacy Settings" }} />
      
      <View className="p-4">
        <Text className="text-xl font-bold mb-4 text-tertiary">Privacy Settings</Text>
        <Text className="text-gray-600 mb-6">
          Control who can see your profile and how your data is used
        </Text>
        
        <View className="mb-6">
          <Text className="font-medium text-gray-900 mb-2">Profile Visibility</Text>
          <Text className="text-gray-500 text-sm mb-3">
            Choose who can see your profile information
          </Text>
          
          <View className="space-y-2">
            <RadioOption
              id="visibility-public"
              name="visibility"
              value="public"
              label="Public"
              description="Anyone can view your profile"
              checked={currentProfile.privacySettings.profileVisibility === 'public'}
              onChange={() => handleVisibilityChange('public')}
            />
            
            <RadioOption
              id="visibility-friends"
              name="visibility"
              value="friends"
              label="Friends Only"
              description="Only your connections can view your profile"
              checked={currentProfile.privacySettings.profileVisibility === 'friends'}
              onChange={() => handleVisibilityChange('friends')}
            />
            
            <RadioOption
              id="visibility-private"
              name="visibility"
              value="private"
              label="Private"
              description="Your profile is hidden from everyone"
              checked={currentProfile.privacySettings.profileVisibility === 'private'}
              onChange={() => handleVisibilityChange('private')}
            />
          </View>
        </View>
        
        <View className="space-y-4 mb-6">
          <ToggleOption
            id="location-sharing"
            label="Location Sharing"
            description="Allow friends to see your current location when traveling"
            value={currentProfile.privacySettings.locationSharing}
            onToggle={() => handleToggle('locationSharing')}
          />
          
          <ToggleOption
            id="data-sharing"
            label="Data Sharing with Partners"
            description="Allow us to share your data with trusted travel partners for personalized offers"
            value={currentProfile.privacySettings.dataSharingWithPartners}
            onToggle={() => handleToggle('dataSharingWithPartners')}
          />
        </View>
        
        <TouchableOpacity 
          className="mt-8 w-full py-2 px-4 bg-green-600 rounded-lg"
          onPress={handleSaveSettings}
        >
          <Text className="text-white font-semibold text-center">Save Settings</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

interface RadioOptionProps {
  id: string;
  name: string;
  value: string;
  label: string;
  description: string;
  checked: boolean;
  onChange: () => void;
}

const RadioOption = ({ id, name, value, label, description, checked, onChange }: RadioOptionProps) => {
  return (
    <TouchableOpacity className="flex-row mb-2" onPress={onChange}>
      <View className="w-6 h-6 rounded-full border border-gray-300 items-center justify-center mr-3 mt-1">
        {checked && <View className="w-3 h-3 rounded-full bg-green-600" />}
      </View>
      <View className="flex-1">
        <Text className="font-medium text-gray-700">{label}</Text>
        <Text className="text-gray-500">{description}</Text>
      </View>
    </TouchableOpacity>
  );
};

interface ToggleOptionProps {
  id: string;
  label: string;
  description: string;
  value: boolean;
  onToggle: () => void;
}

const ToggleOption = ({ id, label, description, value, onToggle }: ToggleOptionProps) => {
  return (
    <View className="flex-row items-start">
      <View className="flex-1">
        <Text className="font-medium text-gray-700">{label}</Text>
        <Text className="text-gray-500">{description}</Text>
      </View>
      <Switch
        value={value}
        onValueChange={onToggle}
        trackColor={{ false: '#d1d5db', true: '#10b981' }}
        thumbColor="#ffffff"
      />
    </View>
  );
};

export default EditPrivacySet;