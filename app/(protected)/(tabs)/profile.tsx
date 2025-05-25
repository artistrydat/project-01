import React, { useEffect, useState, useRef } from 'react';
import { View, Text, ScrollView, SafeAreaView, Pressable, TouchableOpacity, TouchableWithoutFeedback } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { MaterialIcons, Entypo } from '@expo/vector-icons';
import { useAuthStore } from '~/context/AuthContext';
import { useProfileStore, useCurrentProfile } from '~/store/ProfileStore';
import { useItineraryStore } from '~/store/itinerary/ItineraryStore';
import { format } from 'date-fns';
import ProfileHeader from '~/components/profile/ProfileHeader';
import BadgesSection from '~/components/profile/BadgesSection';
import InterestsCreditsSection from '~/components/profile/InterestsCreditsSection';
import TravelJourneySection from '~/components/profile/TravelJourneySection';
import TravelPreferencesSection from '~/components/profile/TravelPreferencesSection';
import ContentTabsSection from '~/components/profile/ContentTabsSection';

export default function ProfileScreen() {
  const { user, signOut } = useAuthStore();
  const { fetchProfile, isLoading } = useProfileStore();
  const { fetchUserItineraries } = useItineraryStore();
  const profile = useCurrentProfile();
  const router = useRouter();
  const [menuVisible, setMenuVisible] = useState(false);
  
  // Use useRef to prevent multiple fetches
  const initialFetchDone = useRef(false);
  
  useEffect(() => {
    // Only run this once or when user ID changes
    if (!initialFetchDone.current && user?.id) {
      const userId = user.id;
      
      // Fetch profile data
      fetchProfile(userId);
      
      // Fetch user itineraries for budget component
      fetchUserItineraries(userId);
      
      
      initialFetchDone.current = true;
    }
  }, [user?.id]); // Only depend on user ID
  
  const handleEditProfile = () => {
    router.push('/(protected)/profile/EditProfile');
  };

  const handleShareProfile = () => {
    router.push('/(protected)/profile/ShareProfile');
  };

  const handleEditPreferences = () => {
    router.push('/(protected)/profile/OnBoarding/EditPreferences');
  };
  
  const handleEditNotifications = () => {
    setMenuVisible(false);
    router.push('/(protected)/profile/OnBoarding/EditNotification');
  };
  
  const handleEditPrivacy = () => {
    setMenuVisible(false);
    router.push('/(protected)/profile/OnBoarding/EditPrivacySet');
  };

  const handleLogout = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Logout failed', error);
    }
  };
  
  const toggleMenu = () => {
    setMenuVisible(!menuVisible);
  };

  if (!profile && isLoading) {
    return (
      <SafeAreaView className="flex-1 bg-white items-center justify-center">
        <Text className="text-tertiary">Loading profile...</Text>
      </SafeAreaView>
    );
  }

  const memberSince = profile?.memberSince 
    ? format(new Date(profile.memberSince), 'MMMM yyyy')
    : 'N/A';

  return (
    <SafeAreaView className="flex-1 bg-quinary">
      <Stack.Screen options={{ headerShown: false }} />
      
      {/* App Header */}
      <View className="px-4 py-2 border-b border-gray-200 flex-row items-center bg-white">
        <Text className="text-xl font-bold text-center flex-1 text-tertiary">profile</Text>
        <View className="flex-row">
          {/* Menu Button and Dropdown */}
          <View className="relative">
            <TouchableOpacity 
              onPress={toggleMenu} 
              className="p-2 mr-2"
              activeOpacity={0.7}
            >
              <Entypo name="dots-three-vertical" size={20} color="#1E493B" />
            </TouchableOpacity>
            
            {/* Dropdown Menu - Positioned absolutely */}
            {menuVisible && (
              <View 
                className="absolute top-10 right-0 w-36 bg-white rounded-lg shadow-md z-10"
              >
                <TouchableOpacity 
                  onPress={handleEditNotifications}
                  className="px-3 py-3 border-b border-gray-100"
                >
                  <Text className="text-tertiary">Notifications</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  onPress={handleEditPrivacy}
                  className="px-3 py-3"
                >
                  <Text className="text-tertiary">Privacy</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
          
          <Pressable onPress={handleLogout} className="p-2">
            <MaterialIcons name="logout" size={24} color="#1E493B" />
          </Pressable>
        </View>
      </View>
      
      {/* Profile Content */}
      <ScrollView 
        className="flex-1" 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 30 }}
      >
        <ProfileHeader 
          profile={profile} 
          memberSince={memberSince}
          onEditProfile={handleEditProfile}
          onShareProfile={handleShareProfile}
        />
        
        {/* Profile sections with updated prop names */}
        <BadgesSection badges={profile?.badges} />
        <InterestsCreditsSection interests={profile?.interests} credits={profile?.credits} />
        <TravelJourneySection travelHistory={profile?.travelHistory} travelGoals={profile?.travelGoals} />      
        <TravelPreferencesSection travelPreferences={profile?.travelPreferences} onEditPreferences={handleEditPreferences} />
        <ContentTabsSection itineraries={profile?.itineraries} />
      </ScrollView>
      
      {/* Overlay to close menu when clicking elsewhere */}
      {menuVisible && (
        <TouchableWithoutFeedback onPress={() => setMenuVisible(false)}>
          <View className="absolute inset-0 bg-transparent z-10" />
        </TouchableWithoutFeedback>
      )}
    </SafeAreaView>
  );
}