import React from 'react';
import { View, Text, Image, Pressable } from 'react-native';
import { Feather, Ionicons } from '@expo/vector-icons';
import type { UserProfile } from '~/types/profile.types';

type ProfileHeaderProps = {
  profile: UserProfile | null;
  memberSince: string;
  onEditProfile: () => void;
  onShareProfile: () => void;
};

export default function ProfileHeader({ 
  profile, 
  memberSince, 
  onEditProfile, 
  onShareProfile 
}: ProfileHeaderProps) {
  if (!profile) return null;
  
  return (
    <View className="bg-gray-50 rounded-b-3xl shadow-sm pt-5 pb-6 px-4 mb-3">
      {/* User Info Row */}

      <View className="flex-row items-center mb-5">
        <Image
          source={{ uri: profile.avatar }}
          className="w-24 h-24 rounded-full border-2 border-white"
        />
        
        <View className="ml-4 flex-1">
          <View className="flex-row items-center mb-1">
            <Text className="text-xl font-bold text-tertiary">{profile.name}</Text>
            {profile.isVerified && (
              <View className="ml-2 bg-blue-500 rounded-full p-1">
                <Feather name="check" size={12} color="white" />
              </View>
            )}
            {profile.isPremium && (
              <View className="ml-2 bg-secondary rounded-full p-1">
                <Ionicons name="star" size={12} color="#191D15" />
              </View>
            )}
          </View>
          
          <Text className="text-gray-600 mb-1">@{profile.username}</Text>
          
          <View className="flex-row items-center mb-1">
            <Ionicons name="location" size={14} color="#666" />
            <Text className="ml-1 text-gray-600">{profile.location}</Text>
          </View>
          
          <Text className="text-xs text-gray-500">Member since {memberSince}</Text>
        </View>
      </View>
      
      {/* Bio */}
      <Text className="text-tertiary mb-4 italic">{profile.bio || "No bio yet"}</Text>
      
      {/* Stats Row */}
      <View className="flex-row justify-around bg-white rounded-xl p-3 shadow-sm">
        <View className="items-center">
          <Text className="text-xl font-bold text-tertiary">{profile.stats?.posts || 0}</Text>
          <Text className="text-gray-600 text-xs">Trips</Text>
        </View>
        <View className="h-full w-px bg-gray-200" />
        <View className="items-center">
          <Text className="text-xl font-bold text-tertiary">{profile.stats?.followers || 0}</Text>
          <Text className="text-gray-600 text-xs">Followers</Text>
        </View>
        <View className="h-full w-px bg-gray-200" />
        <View className="items-center">
          <Text className="text-xl font-bold text-tertiary">{profile.stats?.following || 0}</Text>
          <Text className="text-gray-600 text-xs">Following</Text>
        </View>
      </View>
      
      {/* Action Buttons */}
      <View className="flex-row mt-4">
        <Pressable 
          className="flex-1 bg-tertiary py-3 rounded-full items-center mr-2"
          onPress={onEditProfile}
        >
          <Text className="font-medium text-white">Edit Profile</Text>
        </Pressable>
        <Pressable 
          className="flex-1 border border-tertiary py-3 rounded-full items-center ml-2"
          onPress={onShareProfile}
        >
          <Text className="font-medium text-tertiary">Share Profile</Text>
        </Pressable>
      </View>
    </View>
  );
}