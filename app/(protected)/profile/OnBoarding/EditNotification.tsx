import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, Switch, Alert, SafeAreaView } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useProfileStore, useCurrentProfile } from '~/store/ProfileStore';
import { useTheme } from '~/contexts/ThemeContext';

const EditNotification = () => {
  const router = useRouter();
  const currentProfile = useCurrentProfile();
  const { updateNotificationSettings } = useProfileStore();
  const { colors } = useTheme();
  
  if (!currentProfile || !currentProfile.notifications) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: colors.background, alignItems: 'center', justifyContent: 'center' }}>
        <Text style={{ color: colors.text }}>Loading...</Text>
      </SafeAreaView>
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
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.backgroundSecondary }}>
      <Stack.Screen options={{ headerShown: false }} />
      
      {/* Modern Header */}
      <View style={{ 
        paddingHorizontal: 24, 
        paddingVertical: 16, 
        borderBottomWidth: 1, 
        borderBottomColor: colors.border + '80', // 50% opacity
        flexDirection: 'row', 
        alignItems: 'center', 
        backgroundColor: colors.surface 
      }}>
        <TouchableOpacity 
          style={{ 
            backgroundColor: colors.cyber, 
            padding: 12, 
            borderRadius: 16, 
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.25,
            shadowRadius: 4,
            elevation: 5
          }}
          onPress={() => router.back()}
        >
          <MaterialIcons name="arrow-back" size={20} color="white" />
        </TouchableOpacity>
        <Text style={{ 
          fontSize: 24, 
          fontWeight: '900', 
          textAlign: 'center', 
          flex: 1, 
          marginLeft: 16, 
          color: colors.text 
        }}>
          Notifications<Text style={{ color: colors.neon }}>.</Text>
        </Text>
        <View style={{ width: 44 }} />
      </View>
      
      <ScrollView 
        style={{ flex: 1, paddingHorizontal: 24, paddingTop: 32 }} 
        showsVerticalScrollIndicator={false}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 24 }}>
          <View style={{ 
            backgroundColor: colors.cyber, 
            padding: 8, 
            borderRadius: 16, 
            marginRight: 12 
          }}>
            <MaterialIcons name="notifications" size={20} color="white" />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={{ 
              fontSize: 24, 
              fontWeight: '900', 
              color: colors.text 
            }}>
              Stay in the Loop ✨
            </Text>
            <Text style={{ 
              color: colors.textSecondary, 
              fontSize: 18, 
              fontWeight: '500' 
            }}>
              Choose what updates you want
            </Text>
          </View>
        </View>
        
        <View>
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
        
        <LinearGradient
          colors={[colors.neon, colors.cyber, colors.electric]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{ 
            marginTop: 32, 
            borderRadius: 24, 
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 8 },
            shadowOpacity: 0.25,
            shadowRadius: 8,
            elevation: 8
          }}
        >
          <TouchableOpacity 
            style={{ 
              width: '100%', 
              paddingVertical: 20, 
              paddingHorizontal: 24, 
              alignItems: 'center' 
            }}
            onPress={handleSavePreferences}
          >
            <Text style={{ 
              color: 'white', 
              fontWeight: '900', 
              fontSize: 18, 
              letterSpacing: 1 
            }}>
              Save Preferences ✨
            </Text>
          </TouchableOpacity>
        </LinearGradient>
      </ScrollView>
    </SafeAreaView>
  );
};

interface NotificationItemProps {
  label: string;
  description: string;
  value: boolean;
  onToggle: () => void;
}

const NotificationItem = ({ label, description, value, onToggle }: NotificationItemProps) => {
  const { colors } = useTheme();
  
  return (
    <View style={{ 
      backgroundColor: colors.surface, 
      borderRadius: 24, 
      padding: 24, 
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 5,
      borderWidth: 1, 
      borderColor: colors.border + '33', // 20% opacity
      marginBottom: 16 
    }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
        <View style={{ flex: 1, marginRight: 16 }}>
          <Text style={{ 
            fontWeight: '900', 
            fontSize: 20, 
            color: colors.text, 
            marginBottom: 8 
          }}>
            {label}
          </Text>
          <Text style={{ 
            color: colors.textSecondary, 
            fontSize: 16, 
            fontWeight: '500', 
            lineHeight: 24 
          }}>
            {description}
          </Text>
        </View>
        <View style={{ position: 'relative' }}>
          <Switch
            value={value}
            onValueChange={onToggle}
            trackColor={{ 
              false: colors.border, 
              true: value ? colors.neon : colors.success 
            }}
            thumbColor="#ffffff"
            ios_backgroundColor={colors.border}
            style={{
              transform: [{ scaleX: 1.2 }, { scaleY: 1.2 }],
              shadowColor: value ? colors.neon : '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: value ? 0.3 : 0.1,
              shadowRadius: 4,
            }}
          />
          {value && (
            <View style={{ 
              position: 'absolute', 
              top: -4, 
              right: -4, 
              width: 12, 
              height: 12, 
              backgroundColor: colors.neon, 
              borderRadius: 6, 
              shadowColor: colors.neon,
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.5,
              shadowRadius: 4,
              elevation: 3
            }} />
          )}
        </View>
      </View>
    </View>
  );
};

export default EditNotification;