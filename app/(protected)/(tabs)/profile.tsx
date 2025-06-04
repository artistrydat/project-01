import React, { useEffect, useState, useRef } from 'react';
import { View, Text, ScrollView, SafeAreaView, Pressable, TouchableOpacity, TouchableWithoutFeedback } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { MaterialIcons, Entypo } from '@expo/vector-icons';
import { useAuthStore } from '~/contexts/AuthContext';
import { useProfileStore, useCurrentProfile } from '~/store/ProfileStore';
import { useItineraryStore } from '~/store/itinerary/ItineraryStore';
import { format } from 'date-fns';
import { useTheme } from '~/contexts/ThemeContext';
import ProfileHeader from '~/components/profile/ProfileHeader';
import BadgesSection from '~/components/profile/BadgesSection';
import InterestsCreditsSection from '~/components/profile/InterestsCreditsSection';
import TravelJourneySection from '~/components/profile/TravelJourneySection';
import TravelPreferencesSection from '~/components/profile/TravelPreferencesSection';
import { default as ContentTabsSection } from '../../../components/profile/ContentTabsSection';
import { LoadingView } from '~/components/ui/LoadingView';

export default function ProfileScreen() {
  const { colors, isDark } = useTheme();
  const { user, signOut } = useAuthStore();
  const router = useRouter();
  
  // Get profile store functions and state
  const { fetchProfile, profiles, currentProfileId, isLoading } = useProfileStore();
  const profile = useCurrentProfile();
  
  // State management
  const [menuVisible, setMenuVisible] = useState(false);
  
  // FIXED: Use the actual user ID from auth without mapping
  // The AuthContext already provides the correct user ID ('user123')
  const actualUserId = user?.id || 'user123'; // Use user.id directly
  
  console.log('Profile Debug Info:');
  console.log('User email:', user?.email);
  console.log('User ID from auth:', user?.id);
  console.log('Actual User ID (no mapping):', actualUserId); // Updated log
  console.log('Profile:', profile);
  console.log('Is Loading:', isLoading);
  console.log('Current Profile ID:', currentProfileId);
  
  // Fetch profile on mount
  useEffect(() => {
    if (actualUserId) {
      fetchProfile(actualUserId);
    }
  }, [actualUserId, fetchProfile]);
  
  // Add debugging
  useEffect(() => {
    console.log('Profile Debug Info:');
    console.log('User email:', user?.email);
    console.log('User ID:', user?.id);
    console.log('Profile:', profile);
    console.log('Is Loading:', isLoading);
    console.log('Profile badges:', profile?.badges);
    console.log('Profile interests:', profile?.interests);
    console.log('Profile travel history:', profile?.travelHistory);
  }, [profile, user?.email, user?.id, isLoading]);
  
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
      signOut(); // Fixed: use signOut from useAuthStore
    } catch (error) {
      console.error('Logout failed', error);
    }
  };
  
  const toggleMenu = () => {
    setMenuVisible(!menuVisible);
  };

  // Convert string arrays to proper object arrays for components
  const convertedBadges = profile?.badges?.map((badge, index) => ({
    id: `badge-${index}`,
    name: badge,
    icon: 'trophy',
    description: `Achievement: ${badge}`,
    rarity: 'common' as const,
    earnedAt: new Date().toISOString()
  }));

  const convertedTravelHistory = profile?.travelHistory?.map((history, index) => ({
    country: history,
    visitedAt: new Date().getFullYear().toString(),
    duration: '7 days'
  }));

  const convertedTravelGoals = profile?.travelGoals?.map((goal, index) => ({
    destination: goal,
    targetYear: (new Date().getFullYear() + 1).toString(),
    priority: 'medium' as const
  }));

  // Convert travel preferences to match expected interface
  const convertedTravelPreferences = profile?.travelPreferences ? {
    travelStyles: profile.travelPreferences.travelStyles || [],
    preferredDestinations: profile.travelPreferences.preferredDestinations || [],
    preferredActivities: profile.travelPreferences.preferredActivities || [],
    budgetRange: profile.travelPreferences.budgetRange || { min: 1000, max: 5000 },
    travelCompanions: profile.travelPreferences.travelCompanions || [],
    accommodationPreferences: profile.travelPreferences.accommodationPreferences || [],
    transportationPreferences: profile.travelPreferences.transportationPreferences || [],
    dietaryRestrictions: profile.travelPreferences.dietaryRestrictions || [],
    accessibilityNeeds: profile.travelPreferences.accessibilityNeeds || [],
    languagePreferences: profile.travelPreferences.languagePreferences || [],
    ecoFriendlyPreferences: profile.travelPreferences.ecoFriendlyPreferences || false
  } : undefined;

  if (!profile && isLoading) {
    return <LoadingView message="Loading profile..." variant="default" />;
  }

  const memberSince = profile?.memberSince 
    ? format(new Date(profile.memberSince), 'MMMM yyyy')
    : 'N/A';

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <Stack.Screen options={{ headerShown: false }} />
      
      {/* Modern App Header - headerBackground + theme colors */}
      <View 
        style={{ 
          paddingHorizontal: 24, 
          paddingVertical: 16, 
          borderBottomWidth: 1,
          borderBottomColor: colors.border, // theme border color
          flexDirection: 'row',
          alignItems: 'center',
          backgroundColor: colors.background // headerBackground token equivalent
        }}
      >
        <Text 
          style={{ 
            textAlign: 'center', 
            flex: 1,
            color: colors.text, // theme text color
            fontSize: 36,
            fontWeight: '900' // pageTitle token equivalent
          }}
        >
          Profile<Text style={{ color: colors.electric }}>.</Text>
        </Text>
        <View style={{ flexDirection: 'row', gap: 12 }}>
          {/* Menu Button and Dropdown */}
          <View style={{ position: 'relative' }}>
            <TouchableOpacity 
              onPress={toggleMenu} 
              style={{
                padding: 12,
                backgroundColor: colors.neon, // theme neon color
                borderRadius: 16,
                shadowColor: colors.text,
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.1,
                shadowRadius: 8
              }}
              activeOpacity={0.7}
            >
              <Entypo name="dots-three-vertical" size={20} color={colors.textInverse} />
            </TouchableOpacity>
            
            {/* Enhanced Dropdown Menu - cardBackground token */}
            {menuVisible && (
              <View 
                style={{
                  position: 'absolute',
                  top: 56,
                  right: 0,
                  width: 176,
                  borderRadius: 24,
                  shadowColor: colors.text,
                  shadowOffset: { width: 0, height: 8 },
                  shadowOpacity: 0.15,
                  shadowRadius: 24,
                  borderWidth: 1,
                  borderColor: isDark ? 'rgba(255,255,255,0.2)' : colors.border,
                  zIndex: 20,
                  overflow: 'hidden',
                  backgroundColor: colors.cardBase // cardBackground token equivalent
                }}
              >
                <TouchableOpacity 
                  onPress={handleEditNotifications}
                  style={{
                    paddingHorizontal: 16,
                    paddingVertical: 16,
                    borderBottomWidth: 1,
                    borderBottomColor: colors.border, // theme border color
                    flexDirection: 'row',
                    alignItems: 'center'
                  }}
                >
                  <MaterialIcons name="notifications" size={18} color={colors.electric} />
                  <Text 
                    style={{ 
                      fontWeight: '600', 
                      marginLeft: 12,
                      color: colors.text // textPrimary token equivalent
                    }}
                  >
                    Notifications
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  onPress={handleEditPrivacy}
                  style={{
                    paddingHorizontal: 16,
                    paddingVertical: 16,
                    flexDirection: 'row',
                    alignItems: 'center'
                  }}
                >
                  <MaterialIcons name="privacy-tip" size={18} color={colors.success} />
                  <Text 
                    style={{ 
                      fontWeight: '600', 
                      marginLeft: 12,
                      color: colors.text // textPrimary token equivalent
                    }}
                  >
                    Privacy
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
          
          <Pressable 
            onPress={handleLogout} 
            style={{
              padding: 12,
              backgroundColor: colors.primary, // theme primary color
              borderRadius: 16,
              shadowColor: colors.text,
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.1,
              shadowRadius: 8
            }}
          >
            <MaterialIcons name="logout" size={20} color={colors.textInverse} />
          </Pressable>
        </View>
      </View>
      
      {/* Profile Content */}
      <ScrollView 
        style={{ flex: 1 }}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 30 }}
      >
        <ProfileHeader 
          profile={profile} 
          memberSince={memberSince}
          onEditProfile={handleEditProfile}
          onShareProfile={handleShareProfile}
        />
        
        {/* Profile sections with converted data */}
        <BadgesSection badges={convertedBadges} />
        <InterestsCreditsSection interests={profile?.interests} credits={profile?.credits} />
        <TravelJourneySection 
          travelHistory={convertedTravelHistory} 
          travelGoals={convertedTravelGoals} 
        />      
        <TravelPreferencesSection 
          travelPreferences={convertedTravelPreferences} 
          onEditPreferences={handleEditPreferences} 
        />
        <ContentTabsSection 
          userId={actualUserId}
        />
        
      </ScrollView>

      {/* Enhanced Overlay - theme colors for backdrop */}
      {menuVisible && (
        <TouchableWithoutFeedback onPress={() => setMenuVisible(false)}>
          <View 
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0,0,0,0.2)', // overlay backdrop
              zIndex: 10
            }}
          />
        </TouchableWithoutFeedback>
      )}
    </SafeAreaView>
  );
}