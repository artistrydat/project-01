import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView, Share, Alert, Clipboard } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack, router } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { useCurrentProfile } from '~/store/ProfileStore';
import QRCode from 'react-native-qrcode-svg';
import * as FileSystem from 'expo-file-system';
import * as MediaLibrary from 'expo-media-library';

// Define a type for the QR code ref that includes the toDataURL method
type QRCodeRef = {
  toDataURL: (callback: (dataURL: string) => void) => void;
};

export default function ShareProfile() {
  const profile = useCurrentProfile();
  const [saving, setSaving] = useState(false);
  const [qrRef, setQrRef] = useState<QRCodeRef | null>(null);
  
  // Create a shareable profile URL
  const profileUrl = profile?.id ? 
    `https://yourtravelapp.com/profile/${profile.id}` : 
    'https://yourtravelapp.com';
  
  // Handle share button
  const handleShare = async () => {
    try {
      await Share.share({
        message: `Check out my travel profile: ${profileUrl}`,
        url: profileUrl, // iOS only
        title: `${profile?.name}'s Travel Profile` // Android only
      });
    } catch (_) {
      // Using underscore to indicate we're not using the error variable
      Alert.alert('Error', 'Something went wrong while sharing');
    }
  };
  
  // Handle copy link
  const handleCopyLink = () => {
    Clipboard.setString(profileUrl);
    Alert.alert('Success', 'Profile link copied to clipboard!');
  };
  
  // Handle download QR code
  const handleDownload = async () => {
    if (!qrRef) return;
    
    try {
      setSaving(true);
      
      // Request permissions
      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission needed', 'Please allow access to save the QR code');
        setSaving(false);
        return;
      }
      
      // Get QR code as SVG - fixed typing
      qrRef.toDataURL(async (dataURL: string) => {
        const fileUri = FileSystem.documentDirectory + `${profile?.username || 'profile'}-qr.png`;
        
        // Write file
        await FileSystem.writeAsStringAsync(fileUri, dataURL, {
          encoding: FileSystem.EncodingType.Base64
        });
        
        // Save to media library
        const asset = await MediaLibrary.createAssetAsync(fileUri);
        await MediaLibrary.createAlbumAsync('Travel App', asset, false);
        
        setSaving(false);
        Alert.alert('Success', 'QR code saved to your gallery!');
      });
    } catch (_) {
      // Using underscore to indicate we're not using the error variable
      setSaving(false);
      Alert.alert('Error', 'Failed to save QR code');
    }
  };
  
  if (!profile) {
    return (
      <SafeAreaView className="flex-1 bg-white items-center justify-center">
        <Text>Loading profile...</Text>
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
        <Text className="text-xl font-semibold text-center flex-1">PROFILE QR</Text>
        <View style={{ width: 24 }} />
      </View>
      
      <ScrollView className="flex-1 px-4">
        {/* Profile Info */}
        <View className="items-center mt-6">
          <Image 
            source={{ uri: profile.avatar }} 
            className="w-20 h-20 rounded-full"
          />
          <Text className="text-xl font-bold mt-3">{profile.name}</Text>
          <Text className="text-base text-teal-500">@{profile.username}</Text>
          
          {/* Badges */}
          <View className="flex-row mt-3 space-x-2">
            {profile.isPremium && (
              <View className="bg-yellow-100 px-3 py-1 rounded-full flex-row items-center">
                <MaterialIcons name="star" size={16} color="#F59E0B" />
                <Text className="text-yellow-700 ml-1 font-medium">Premium</Text>
              </View>
            )}
            {profile.isSubscribed && (
              <View className="bg-green-100 px-3 py-1 rounded-full flex-row items-center">
                <MaterialIcons name="check-circle" size={16} color="#10B981" />
                <Text className="text-green-700 ml-1 font-medium">Subscribed</Text>
              </View>
            )}
          </View>
        </View>
        
        {/* QR Code */}
        <View className="items-center justify-center mt-8 bg-white rounded-xl p-6 mx-4 shadow-sm border border-gray-100">
          <View className="bg-white p-4 rounded-xl border-2 border-teal-100">
            <QRCode
              value={profileUrl}
              size={200}
              color="#0F766E"
              backgroundColor="white"
              logo={{uri: profile.avatar}}
              logoSize={40}
              logoBackgroundColor="white"
              logoMargin={5}
              logoBorderRadius={20}
              getRef={(ref) => setQrRef(ref as unknown as QRCodeRef)}
            />
          </View>
          <Text className="text-teal-500 mt-5 text-lg text-center">
            Scan this code to view my profile
          </Text>
          <Text className="text-gray-500 text-sm text-center mt-1">
            {profileUrl}
          </Text>
        </View>
        
        {/* Action Buttons */}
        <View className="flex-row justify-between mt-8 mb-6 px-6">
          <TouchableOpacity className="items-center" onPress={handleShare}>
            <View className="w-14 h-14 rounded-full bg-gray-100 items-center justify-center mb-2">
              <MaterialIcons name="share" size={24} color="#10B981" />
            </View>
            <Text className="text-gray-700">Share</Text>
          </TouchableOpacity>
          
          <TouchableOpacity className="items-center" onPress={handleCopyLink}>
            <View className="w-14 h-14 rounded-full bg-gray-100 items-center justify-center mb-2">
              <MaterialIcons name="link" size={24} color="#10B981" />
            </View>
            <Text className="text-gray-700">Copy link</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            className="items-center" 
            onPress={handleDownload}
            disabled={saving}
          >
            <View className="w-14 h-14 rounded-full bg-gray-100 items-center justify-center mb-2">
              <MaterialIcons 
                name={saving ? "hourglass-empty" : "file-download"} 
                size={24} 
                color="#10B981" 
              />
            </View>
            <Text className="text-gray-700">{saving ? "Saving..." : "Download"}</Text>
          </TouchableOpacity>
        </View>
        
        {/* Instructions */}
        <View className="bg-gray-50 p-5 rounded-lg mb-10 mx-2">
          <Text className="text-xl font-semibold text-gray-700 mb-3">How to use</Text>
          <Text className="text-gray-600 leading-6">
            Share your profile QR code with friends, or scan someone else&rsquo;s code to connect. 
            This makes it easy to find and follow each other on our travel platform.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}