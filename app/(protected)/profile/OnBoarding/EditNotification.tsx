import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, Switch, Alert } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { useProfileStore, useCurrentProfile } from '~/store/ProfileStore';

const EditNotification = () => {
  const router = useRouter();
  const currentProfile = useCurrentProfile();
  const { updateNotificationSettings } = useProfileStore();
  
  if (!currentProfile || !currentProfile.notifications) {
    return (
      <View className="flex-1 items-center justify-center">
        <Text>Loading...</Text>
      </View>
    );
  }
  
  const handleToggle = (setting: keyof typeof currentProfile.notifications) => {
    if (currentProfile.id) {
      updateNotificationSettings(
        currentProfile.id, 
        { [setting]: !currentProfile.notifications[setting] }
      );
    }
  };
  
  const handleSavePreferences = () => {
    Alert.alert(
      "Preferences Saved",
      "Your notification preferences have been successfully updated.",
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
      <Stack.Screen options={{ title: "Notification Settings" }} />
      
      <View className="p-4">
        <Text className="text-xl font-bold mb-4 text-tertiary">Notification Preferences</Text>
        <Text className="text-gray-600 mb-6">
          Choose which notifications you&rsquo;d like to receive
        </Text>
        
        <View className="space-y-4">
          <NotificationItem
            label="New Messages"
            description="Get notified when you receive new messages"
            value={currentProfile.notifications.newMessages}
            onToggle={() => handleToggle('newMessages')}
          />
          
          <NotificationItem
            label="Itinerary Updates"
            description="Receive updates about changes to your travel plans"
            value={currentProfile.notifications.itineraryUpdates}
            onToggle={() => handleToggle('itineraryUpdates')}
          />
          
          <NotificationItem
            label="Friend Requests"
            description="Get notified about new friend requests"
            value={currentProfile.notifications.friendRequests}
            onToggle={() => handleToggle('friendRequests')}
          />
          
          <NotificationItem
            label="Travel Deals"
            description="Receive personalized travel offers and deals"
            value={currentProfile.notifications.travelDeals}
            onToggle={() => handleToggle('travelDeals')}
          />
          
          <NotificationItem
            label="Eco Impact Updates"
            description="Get updates about your environmental impact"
            value={currentProfile.notifications.ecoImpactUpdates}
            onToggle={() => handleToggle('ecoImpactUpdates')}
          />
        </View>
        
        <TouchableOpacity 
          className="mt-8 w-full py-2 px-4 bg-green-600 rounded-lg"
          onPress={handleSavePreferences}
        >
          <Text className="text-white font-semibold text-center">Save Preferences</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

interface NotificationItemProps {
  label: string;
  description: string;
  value: boolean;
  onToggle: () => void;
}

const NotificationItem = ({ label, description, value, onToggle }: NotificationItemProps) => {
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

export default EditNotification;