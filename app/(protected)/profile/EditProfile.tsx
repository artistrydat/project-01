import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, TextInput, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack, router } from 'expo-router';
import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useProfileStore, useCurrentProfile } from '~/store/ProfileStore';

export default function EditProfile() {
  const { updateProfile, addArrayItem, removeArrayItem, isLoading } = useProfileStore();
  const profile = useCurrentProfile();
  
  // Form data for basic profile info
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    bio: '',
    avatar: ''
  });
  
  // Input fields for array items
  const [newInterest, setNewInterest] = useState('');
  const [newTravelHistory, setNewTravelHistory] = useState('');
  const [newTravelGoal, setNewTravelGoal] = useState('');
  
  useEffect(() => {
    if (profile) {
      setFormData({
        name: profile.name || '',
        username: profile.username || '',
        bio: profile.bio || '',
        avatar: profile.avatar || ''
      });
    }
  }, [profile]);

  const pickImage = async () => {
    // Request permission to access the media library
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (status !== 'granted') {
      Alert.alert(
        'Permission Required',
        'Sorry, we need camera roll permissions to change your profile picture.'
      );
      return;
    }

    // Launch the image library with the correct API
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes:  ['images', 'videos'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      // Update the form data with the selected image URI
      setFormData({
        ...formData,
        avatar: result.assets[0].uri
      });
    }
  };

  const handleSave = () => {
    if (profile && profile.id) {
      updateProfile(profile.id, formData);
      router.back();
    }
  };
  
  // Early return if profile is not loaded
  if (!profile || !profile.id) {
    return (
      <SafeAreaView className="flex-1 bg-quinary items-center justify-center">
        <Text>Loading profile...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-quinary">
      <Stack.Screen options={{ headerShown: false }} />
      
      {/* Header */}
      <View className="px-5 py-4 border-b border-primary/50 flex-row items-center">
        <TouchableOpacity 
          className="bg-primary/20 p-2 rounded-full shadow-sm backdrop-blur-lg" 
          onPress={() => router.back()}
        >
          <MaterialIcons name="arrow-back" size={22} color="#1E493B" />
        </TouchableOpacity>
        <Text className="text-xl font-bold text-center flex-1 ml-2 text-tertiary">Edit Your Vibe ✨</Text>
        <View style={{ width: 34 }} />
      </View>
      
      <ScrollView className="flex-1 px-5 pt-6">
        {/* Profile Picture */}
        <View className="items-center mb-8">
          <View className="relative">
            <Image 
              source={{ uri: formData.avatar || 'https://via.placeholder.com/150' }} 
              className="w-32 h-32 rounded-full border-4 border-primary/80 shadow-xl"
            />
            <TouchableOpacity 
              className="absolute bottom-0 right-0 bg-quaternary rounded-full p-3 shadow-md"
              onPress={pickImage}
            >
              <MaterialIcons name="camera-alt" size={18} color="white" />
            </TouchableOpacity>
          </View>
          <TouchableOpacity 
            className="mt-3 px-5 py-2 bg-primary/30 rounded-full backdrop-blur-sm" 
            onPress={pickImage}
          >
            <Text className="text-quaternary font-semibold">Update photo</Text>
          </TouchableOpacity>
        </View>
        
        {/* Profile Form */}
        <View className="space-y-7">
          {/* Name and Username Row */}
          <View className="flex-row space-x-3">
            {/* Name */}
            <View className="flex-1">
              <Text className="text-quaternary font-semibold mb-2 flex-row items-center">
                <MaterialIcons name="person" size={16} color="#1E493B" style={{marginRight: 4}} />
                Name
              </Text>
              <TextInput
                className="border border-primary rounded-xl py-3 px-4 text-base text-tertiary bg-primary/10 shadow-sm"
                value={formData.name}
                onChangeText={(text) => setFormData({...formData, name: text})}
                placeholder="Your name"
                placeholderTextColor="#1E493B50"
              />
            </View>
            
            {/* Username */}
            <View className="flex-1">
              <Text className="text-quaternary font-semibold mb-2 flex-row items-center">
                <MaterialIcons name="alternate-email" size={16} color="#1E493B" style={{marginRight: 4}} />
                Username
              </Text>
              <TextInput
                className="border border-primary rounded-xl py-3 px-4 text-base text-tertiary bg-primary/10 shadow-sm"
                value={formData.username}
                onChangeText={(text) => setFormData({...formData, username: text})}
                placeholder="@username"
                placeholderTextColor="#1E493B50"
              />
            </View>
          </View>
          
          {/* Bio */}
          <View>
            <Text className="text-quaternary font-semibold mb-2 flex-row items-center">
              <MaterialIcons name="text-snippet" size={16} color="#1E493B" style={{marginRight: 4}} />
              Bio
            </Text>
            <TextInput
              className="border border-primary rounded-xl py-3 px-4 text-base text-tertiary min-h-[80px] bg-primary/10 shadow-sm"
              value={formData.bio}
              onChangeText={(text) => setFormData({...formData, bio: text})}
              multiline
              numberOfLines={4}
              placeholder="Tell your story..."
              placeholderTextColor="#1E493B50"
              textAlignVertical="top"
            />
          </View>

          {/* Section divider */}
          <View className="flex-row items-center py-2">
            <View className="flex-1 h-[1px] bg-primary" />
            <Text className="px-4 text-quaternary font-semibold">YOUR VIBE</Text>
            <View className="flex-1 h-[1px] bg-primary" />
          </View>
          
          {/* Interests */}
          <View>
            <Text className="text-quaternary font-semibold mb-2 flex-row items-center">
              <MaterialIcons name="local-fire-department" size={16} color="#1E493B" style={{marginRight: 4}} />
              Interests
            </Text>
            <View className="flex-row flex-wrap mb-3">
              {profile.interests?.map((interest, index) => (
                <View key={index} className="bg-primary rounded-full px-3 py-1.5 m-1 flex-row items-center shadow-sm">
                  <Text className="text-tertiary font-medium">{interest}</Text>
                  <TouchableOpacity onPress={() => removeArrayItem(profile.id, 'interests', index)} className="ml-1">
                    <MaterialIcons name="close" size={16} color="#1E493B" />
                  </TouchableOpacity>
                </View>
              ))}
            </View>
            <View className="flex-row items-center bg-primary/10 rounded-xl shadow-sm overflow-hidden border border-primary">
              <TextInput
                className="py-3 px-4 text-base text-tertiary flex-1"
                value={newInterest}
                onChangeText={setNewInterest}
                placeholder="Add an interest"
                placeholderTextColor="#1E493B50"
              />
              <TouchableOpacity 
                className="bg-quaternary p-3 m-1 rounded-lg"
                onPress={() => {
                  if (newInterest.trim()) {
                    addArrayItem(profile.id, 'interests', newInterest);
                    setNewInterest('');
                  }
                }}
              >
                <MaterialIcons name="add" size={20} color="white" />
              </TouchableOpacity>
            </View>
          </View>
          
          {/* Travel History */}
          <View>
            <Text className="text-quaternary font-semibold mb-2 flex-row items-center">
              <MaterialCommunityIcons name="map-marker-check" size={16} color="#1E493B" style={{marginRight: 4}} />
              Travel History
            </Text>
            <View className="flex-row flex-wrap mb-3">
              {profile.travelHistory?.map((place, index) => (
                <View key={index} className="bg-secondary/70 rounded-full px-3 py-1.5 m-1 flex-row items-center">
                  <Text className="text-tertiary font-medium">{place}</Text>
                  <TouchableOpacity onPress={() => removeArrayItem(profile.id, 'travelHistory', index)} className="ml-1">
                    <MaterialIcons name="close" size={16} color="#191D15" />
                  </TouchableOpacity>
                </View>
              ))}
            </View>
            <View className="flex-row items-center bg-secondary/10 rounded-xl shadow-sm overflow-hidden border border-secondary/50">
              <TextInput
                className="py-3 px-4 text-base text-tertiary flex-1"
                value={newTravelHistory}
                onChangeText={setNewTravelHistory}
                placeholder="Add a visited place"
                placeholderTextColor="#1E493B50"
              />
              <TouchableOpacity 
                className="bg-secondary p-3 m-1 rounded-lg"
                onPress={() => {
                  if (newTravelHistory.trim()) {
                    addArrayItem(profile.id, 'travelHistory', newTravelHistory);
                    setNewTravelHistory('');
                  }
                }}
              >
                <MaterialIcons name="add" size={20} color="#191D15" />
              </TouchableOpacity>
            </View>
          </View>
          
          {/* Travel Goals */}
          <View>
            <Text className="text-quaternary font-semibold mb-2 flex-row items-center">
              <MaterialCommunityIcons name="map-marker-path" size={16} color="#1E493B" style={{marginRight: 4}} />
              Travel Goals
            </Text>
            <View className="flex-row flex-wrap mb-3">
              {profile.travelGoals?.map((goal, index) => (
                <View key={index} className="bg-primary/60 rounded-full px-3 py-1.5 m-1 flex-row items-center">
                  <Text className="text-tertiary font-medium">{goal}</Text>
                  <TouchableOpacity onPress={() => removeArrayItem(profile.id, 'travelGoals', index)} className="ml-1">
                    <MaterialIcons name="close" size={16} color="#1E493B" />
                  </TouchableOpacity>
                </View>
              ))}
            </View>
            <View className="flex-row items-center bg-primary/10 rounded-xl shadow-sm overflow-hidden border border-primary/50">
              <TextInput
                className="py-3 px-4 text-base text-tertiary flex-1"
                value={newTravelGoal}
                onChangeText={setNewTravelGoal}
                placeholder="Add a travel goal"
                placeholderTextColor="#1E493B50"
              />
              <TouchableOpacity 
                className="bg-quaternary p-3 m-1 rounded-lg"
                onPress={() => {
                  if (newTravelGoal.trim()) {
                    addArrayItem(profile.id, 'travelGoals', newTravelGoal);
                    setNewTravelGoal('');
                  }
                }}
              >
                <MaterialIcons name="add" size={20} color="white" />
              </TouchableOpacity>
            </View>
          </View>
          
          {/* Premium Status - Enhanced */}
          {profile?.isPremium && (
            <View className="bg-secondary/20 p-5 rounded-xl mt-6 shadow-sm border border-secondary border-opacity-40 backdrop-blur-sm">
              <View className="flex-row items-center">
                <MaterialIcons name="star" size={24} color="#E3AF00" />
                <Text className="ml-2 text-lg font-bold text-tertiary">Premium Account</Text>
              </View>
              <Text className="text-quaternary mt-1">You have access to all premium features</Text>
            </View>
          )}
          
          {/* Newsletter Status */}
          {profile?.isSubscribed && (
            <View className="bg-primary/20 p-4 rounded-lg border border-primary border-opacity-40 backdrop-blur-sm">
              <View className="flex-row items-center">
                <MaterialIcons name="check-circle" size={24} color="#1E493B" />
                <Text className="ml-2 text-lg font-medium text-tertiary">Subscribed</Text>
              </View>
              <Text className="text-quaternary mt-1">You&rsquo;re subscribed to our newsletter</Text>
            </View>
          )}
          
          {/* Save Button */}
          <View className="my-8">
            <TouchableOpacity
              className="bg-quaternary py-4 rounded-xl items-center shadow-lg"
              onPress={handleSave}
              disabled={isLoading}
            >
              <Text className="text-quinary font-bold text-lg">
                {isLoading ? 'Saving...' : 'Save Your Vibe ✨'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}