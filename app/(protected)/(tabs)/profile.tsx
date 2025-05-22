import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, SafeAreaView, Pressable, TouchableOpacity, TouchableWithoutFeedback } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { MaterialIcons, Entypo } from '@expo/vector-icons';
import { useAuthStore } from '~/context/AuthContext';
import { useProfileStore, useCurrentProfile } from '~/store/ProfileStore';
import { format } from 'date-fns';
import ProfileHeader from '~/components/profile/ProfileHeader';
import BadgesSection from '~/components/profile/BadgesSection';
import InterestsCreditsSection from '~/components/profile/InterestsCreditsSection';
import TravelJourneySection from '~/components/profile/TravelJourneySection';
import EcoImpactSection from '~/components/profile/EcoImpactSection';
import BudgetSection from '~/components/profile/BudgetSection';
import TravelPreferencesSection from '~/components/profile/TravelPreferencesSection';
import ContentTabsSection from '~/components/profile/ContentTabsSection';

export default function ProfileScreen() {
  const { user, signOut } = useAuthStore();
  const { fetchProfile, isLoading } = useProfileStore();
  const profile = useCurrentProfile();
  const router = useRouter();
  const [menuVisible, setMenuVisible] = useState(false);
  
  useEffect(() => {
    // Use user ID from auth, or default to first profile
    if (user?.id) {
      fetchProfile(user.id);
    } else {
      fetchProfile('1'); // Default to first mock profile
    }
  }, [user?.id, fetchProfile]);
  
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
    console.log("Toggle menu called, current state:", !menuVisible);
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
              <Entypo name="dots-three-vertical" size={20} color="#191D15" />
            </TouchableOpacity>
            
            {/* Dropdown Menu - Positioned absolutely */}
            {menuVisible && (
              <View 
                style={{
                  position: 'absolute',
                  top: 40,
                  right: 0,
                  width: 150,
                  backgroundColor: 'white',
                  borderRadius: 8,
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.25,
                  shadowRadius: 3.84,
                  elevation: 5,
                  zIndex: 1000
                }}
              >
                <TouchableOpacity 
                  onPress={handleEditNotifications}
                  style={{
                    padding: 12,
                    borderBottomWidth: 1,
                    borderBottomColor: '#f0f0f0'
                  }}
                >
                  <Text style={{ color: '#191D15' }}>Notifications</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  onPress={handleEditPrivacy}
                  style={{ padding: 12 }}
                >
                  <Text style={{ color: '#191D15' }}>Privacy</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
          
          <Pressable onPress={handleLogout} className="p-2">
            <MaterialIcons name="logout" size={24} color="#191D15" />
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
        
        {/* Rest of profile content... */}
        <BadgesSection badges={profile?.badges} />
        <InterestsCreditsSection interests={profile?.interests} credits={profile?.credits} />
        <TravelJourneySection travelHistory={profile?.travelHistory} travelGoals={profile?.travelGoals} />
        <EcoImpactSection ecoImpact={profile?.EcoImpact} />
        <BudgetSection budget={profile?.budget} />
        <TravelPreferencesSection travelPreferences={profile?.travelPreferences} onEditPreferences={handleEditPreferences} />
        <ContentTabsSection itineraries={profile?.itineraries} />
      </ScrollView>
      
      {/* Overlay to close menu when clicking elsewhere */}
      {menuVisible && (
        <TouchableWithoutFeedback onPress={() => setMenuVisible(false)}>
          <View style={{
            position: 'absolute',
            top: 0,
            bottom: 0,
            left: 0,
            right: 0,
            backgroundColor: 'transparent',
            zIndex: 10
          }} />
        </TouchableWithoutFeedback>
      )}
    </SafeAreaView>
  );
}