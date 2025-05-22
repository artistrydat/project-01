import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, TextInput, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack, router } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
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
  const [newFriend, setNewFriend] = useState('');
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

  const handleSave = () => {
    if (profile && profile.id) {
      updateProfile(profile.id, formData);
      router.back();
    }
  };
  
  // Early return if profile is not loaded
  if (!profile || !profile.id) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50 items-center justify-center">
        <Text>Loading profile...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <Stack.Screen options={{ headerShown: false }} />
      
      {/* Header */}
      <View className="px-4 py-5 border-b border-gray-200 flex-row items-center">
        <TouchableOpacity onPress={() => router.back()}>
          <MaterialIcons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text className="text-xl font-medium text-center flex-1">Edit profile</Text>
        <View style={{ width: 24 }} />
      </View>
      
      <ScrollView className="flex-1 px-4 pt-4">
        {/* Profile Picture */}
        <View className="items-center mb-6">
          <View className="relative">
            <Image 
              source={{ uri: formData.avatar }} 
              className="w-28 h-28 rounded-full"
            />
            <TouchableOpacity 
              className="absolute bottom-0 right-0 bg-white rounded-full p-2 border border-gray-200"
              onPress={() => console.log('Change profile picture')}
            >
              <MaterialIcons name="edit" size={20} color="#333" />
            </TouchableOpacity>
          </View>
          <Text className="text-teal-500 mt-2">Change profile picture</Text>
        </View>
        
        {/* Profile Form */}
        <View className="space-y-6">
          {/* Name */}
          <View>
            <Text className="text-gray-700 mb-1">Name</Text>
            <TextInput
              className="border-b border-gray-300 py-2 text-base text-gray-800"
              value={formData.name}
              onChangeText={(text) => setFormData({...formData, name: text})}
            />
          </View>
          
          {/* Username */}
          <View>
            <Text className="text-gray-700 mb-1">Username</Text>
            <TextInput
              className="border-b border-gray-300 py-2 text-base text-gray-800"
              value={formData.username}
              onChangeText={(text) => setFormData({...formData, username: text})}
            />
          </View>
          
          {/* Bio */}
          <View>
            <Text className="text-gray-700 mb-1">Bio</Text>
            <TextInput
              className="border-b border-gray-300 py-2 text-base text-gray-800"
              value={formData.bio}
              onChangeText={(text) => setFormData({...formData, bio: text})}
              multiline
              numberOfLines={3}
            />
          </View>
          
          {/* Interests */}
          <View>
            <Text className="text-gray-700 mb-1">Interests</Text>
            <View className="flex-row flex-wrap mb-2">
              {profile.interests?.map((interest, index) => (
                <View key={index} className="bg-teal-100 rounded-full px-3 py-1 m-1 flex-row items-center">
                  <Text className="text-teal-800">{interest}</Text>
                  <TouchableOpacity onPress={() => removeArrayItem(profile.id, 'interests', index)} className="ml-1">
                    <MaterialIcons name="close" size={16} color="#115E59" />
                  </TouchableOpacity>
                </View>
              ))}
            </View>
            <View className="flex-row items-center">
              <TextInput
                className="border-b border-gray-300 py-2 text-base text-gray-800 flex-1"
                value={newInterest}
                onChangeText={setNewInterest}
                placeholder="Add an interest"
              />
              <TouchableOpacity 
                className="ml-2 bg-teal-500 p-2 rounded-full"
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
          
          {/* Friends */}
          <View>
            <Text className="text-gray-700 mb-1">Friends</Text>
            <View className="flex-row flex-wrap mb-2">
              {profile.friends?.map((friend, index) => (
                <View key={index} className="bg-indigo-100 rounded-full px-3 py-1 m-1 flex-row items-center">
                  <Text className="text-indigo-800">{friend}</Text>
                  <TouchableOpacity onPress={() => removeArrayItem(profile.id, 'friends', index)} className="ml-1">
                    <MaterialIcons name="close" size={16} color="#4F46E5" />
                  </TouchableOpacity>
                </View>
              ))}
            </View>
            <View className="flex-row items-center">
              <TextInput
                className="border-b border-gray-300 py-2 text-base text-gray-800 flex-1"
                value={newFriend}
                onChangeText={setNewFriend}
                placeholder="Add a friend"
              />
              <TouchableOpacity 
                className="ml-2 bg-indigo-500 p-2 rounded-full"
                onPress={() => {
                  if (newFriend.trim()) {
                    addArrayItem(profile.id, 'friends', newFriend);
                    setNewFriend('');
                  }
                }}
              >
                <MaterialIcons name="add" size={20} color="white" />
              </TouchableOpacity>
            </View>
          </View>
          
          {/* Travel History */}
          <View>
            <Text className="text-gray-700 mb-1">Travel History</Text>
            <View className="flex-row flex-wrap mb-2">
              {profile.travelHistory?.map((place, index) => (
                <View key={index} className="bg-amber-100 rounded-full px-3 py-1 m-1 flex-row items-center">
                  <Text className="text-amber-800">{place}</Text>
                  <TouchableOpacity onPress={() => removeArrayItem(profile.id, 'travelHistory', index)} className="ml-1">
                    <MaterialIcons name="close" size={16} color="#92400E" />
                  </TouchableOpacity>
                </View>
              ))}
            </View>
            <View className="flex-row items-center">
              <TextInput
                className="border-b border-gray-300 py-2 text-base text-gray-800 flex-1"
                value={newTravelHistory}
                onChangeText={setNewTravelHistory}
                placeholder="Add a visited place"
              />
              <TouchableOpacity 
                className="ml-2 bg-amber-500 p-2 rounded-full"
                onPress={() => {
                  if (newTravelHistory.trim()) {
                    addArrayItem(profile.id, 'travelHistory', newTravelHistory);
                    setNewTravelHistory('');
                  }
                }}
              >
                <MaterialIcons name="add" size={20} color="white" />
              </TouchableOpacity>
            </View>
          </View>
          
          {/* Travel Goals */}
          <View>
            <Text className="text-gray-700 mb-1">Travel Goals</Text>
            <View className="flex-row flex-wrap mb-2">
              {profile.travelGoals?.map((goal, index) => (
                <View key={index} className="bg-emerald-100 rounded-full px-3 py-1 m-1 flex-row items-center">
                  <Text className="text-emerald-800">{goal}</Text>
                  <TouchableOpacity onPress={() => removeArrayItem(profile.id, 'travelGoals', index)} className="ml-1">
                    <MaterialIcons name="close" size={16} color="#047857" />
                  </TouchableOpacity>
                </View>
              ))}
            </View>
            <View className="flex-row items-center">
              <TextInput
                className="border-b border-gray-300 py-2 text-base text-gray-800 flex-1"
                value={newTravelGoal}
                onChangeText={setNewTravelGoal}
                placeholder="Add a travel goal"
              />
              <TouchableOpacity 
                className="ml-2 bg-emerald-500 p-2 rounded-full"
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
          
          {/* Premium Status - Non-editable */}
          {profile?.isPremium && (
            <View className="bg-yellow-50 p-4 rounded-lg mt-6">
              <View className="flex-row items-center">
                <MaterialIcons name="star" size={24} color="#F59E0B" />
                <Text className="ml-2 text-lg font-medium">Premium Account</Text>
              </View>
              <Text className="text-gray-600 mt-1">You have access to all premium features</Text>
            </View>
          )}
          
          {/* Newsletter Status - Non-editable */}
          {profile?.isSubscribed && (
            <View className="bg-green-50 p-4 rounded-lg">
              <View className="flex-row items-center">
                <MaterialIcons name="check-circle" size={24} color="#10B981" />
                <Text className="ml-2 text-lg font-medium">Subscribed</Text>
              </View>
              <Text className="text-gray-600 mt-1">You&rsquo;re subscribed to our newsletter</Text>
            </View>
          )}
        </View>
        
        {/* Save Button */}
        <View className="my-8">
          <TouchableOpacity
            className="bg-teal-500 py-4 rounded-full items-center"
            onPress={handleSave}
            disabled={isLoading}
          >
            <Text className="text-white font-bold text-lg">{isLoading ? 'Saving...' : 'Save Changes'}</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}