import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, Switch, Alert, SafeAreaView } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useProfileStore, useCurrentProfile } from '~/store/ProfileStore';

// Import the theme context hook and design tokens
import { useTheme, designTokens } from '~/contexts/ThemeContext';

const EditPrivacySet = () => {
  const router = useRouter();
  const currentProfile = useCurrentProfile();
  const { updatePrivacySettings } = useProfileStore();
  
  // Use ThemeContext for theming
  const { colors, isDark, toggleTheme } = useTheme();
  

  if (!currentProfile || !currentProfile.privacySettings) {
    return (
      <SafeAreaView style={{ backgroundColor: colors.background }} className={designTokens.colors.backgroundPrimary}>
        <View className="flex-1 items-center justify-center">
          <Text style={{ color: colors.text }}>Loading...</Text>
        </View>
      </SafeAreaView>
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
    <SafeAreaView style={{ backgroundColor: colors.background }} className={designTokens.colors.backgroundPrimary}>
      <Stack.Screen options={{ headerShown: false }} />
      
      {/* Modern Header */}
      <View 
        className="px-6 py-4 border-b flex-row items-center" 
        style={{ 
          borderColor: colors.border, 
          backgroundColor: colors.surface 
        }}
      >
        <TouchableOpacity 
          className="p-3 rounded-2xl shadow-lg" 
          style={{ backgroundColor: colors.cyber }}
          onPress={() => router.back()}
        >
          <MaterialIcons name="arrow-back" size={20} color="white" />
        </TouchableOpacity>
        <Text style={{ color: colors.text }} className={`${designTokens.typography.heading3} text-center flex-1 ml-4`}>
          Privacy<Text style={{ color: colors.primary }}>.</Text>
        </Text>
        <View style={{ width: 44 }} />
      </View>
      
      <ScrollView className="flex-1 px-6 pt-8" showsVerticalScrollIndicator={false}>
        {/* Section headers */}
        <View className="flex-row items-center mb-6">
          <View 
            className="p-2 rounded-2xl mr-3"
            style={{ backgroundColor: colors.cyber }}
          >
            <MaterialIcons name="privacy-tip" size={20} color="white" />
          </View>
          <View className="flex-1">
            <Text style={{ color: colors.text }} className={designTokens.typography.heading3}>Your Privacy Matters ✨</Text>
            <Text style={{ color: colors.textSecondary }} className={`${designTokens.typography.bodyLarge} font-medium`}>Control who sees what</Text>
          </View>
        </View>
        
        {/* Profile Visibility Section */}
        <View 
          className="rounded-3xl p-6 shadow-xl border mb-6"
          style={{ 
            backgroundColor: colors.surface, 
            borderColor: colors.border 
          }}
        >
          <Text style={{ color: colors.text }} className={`${designTokens.typography.body} font-medium mb-2`}>Profile Visibility</Text>
          <Text style={{ color: colors.textSecondary }} className={`${designTokens.typography.bodySmall} mb-3`}>
            Choose who can see your profile information
          </Text>
          
          <View>
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
        
        {/* Privacy Toggles */}
        <View className="mb-6">
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
        
        {/* Theme Settings Section */}
        <View className="mb-6">
          <View className="flex-row items-center mb-4">
            <View 
              className="p-2 rounded-2xl mr-3"
              style={{ backgroundColor: colors.electric }}
            >
              <MaterialIcons name="palette" size={20} color="white" />
            </View>
            <View className="flex-1">
              <Text style={{ color: colors.text }} className={designTokens.typography.heading3}>Theme Settings 🎨</Text>
              <Text style={{ color: colors.textSecondary }} className={`${designTokens.typography.bodyLarge} font-medium`}>Personalize your experience</Text>
            </View>
          </View>
          
          {/* Dark Mode Toggle using ThemeContext */}
          <ToggleOption
            id="dark-mode"
            label="Dark Mode"
            description="Switch between light and dark theme"
            value={isDark}
            onToggle={toggleTheme}
          />
          
          {/* Primary Color Selection */}
          <View 
            className="rounded-3xl p-6 shadow-xl mb-4 border" 
            style={{ 
              backgroundColor: colors.surface, 
              borderColor: colors.border 
            }}
          >
            <Text style={{ color: colors.text }} className={`${designTokens.typography.heading3} mb-3`}>Primary Color</Text>
            <Text style={{ color: colors.textSecondary }} className={`${designTokens.typography.body} font-medium leading-relaxed mb-4`}>
              Choose your preferred accent color
            </Text>
          </View>
        </View>
        
        {/* Save Button */}
        <LinearGradient
          colors={[colors.primary, colors.cyber, colors.electric]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          className="mt-8 mb-10 rounded-3xl shadow-xl"
        >
          <TouchableOpacity 
            className="w-full py-5 px-6 items-center"
            onPress={handleSaveSettings}
          >
            <Text className={`${designTokens.typography.bodyLarge} font-black tracking-wide`} style={{ color: colors.textInverse }}>
              Save Settings ✨
            </Text>
          </TouchableOpacity>
        </LinearGradient>
      </ScrollView>
    </SafeAreaView>
  );
};

// Updated ToggleOption component with theming
interface ToggleOptionProps {
  id: string;
  label: string;
  description: string;
  value: boolean;
  onToggle: () => void;
}

const ToggleOption = ({ 
  id, label, description, value, onToggle
}: ToggleOptionProps) => {
  const { colors } = useTheme(); // Get theme colors
  
  return (
    <View 
      className="rounded-3xl p-6 shadow-xl mb-4 border" 
      style={{ 
        backgroundColor: colors.surface, 
        borderColor: colors.border 
      }}
    >
      <View className="flex-row items-center justify-between">
        <View className="flex-1 mr-4">
          <Text style={{ color: colors.text }} className={`${designTokens.typography.heading3} mb-2`}>{label}</Text>
          <Text style={{ color: colors.textSecondary }} className={`${designTokens.typography.body} font-medium leading-relaxed`}>{description}</Text>
        </View>
        <View className="relative">
          <Switch
            value={value}
            onValueChange={onToggle}
            trackColor={{ 
              false: colors.border, 
              true: colors.success 
            }}
            thumbColor={colors.textInverse}
            ios_backgroundColor={colors.border}
            style={{
              transform: [{ scaleX: 1.2 }, { scaleY: 1.2 }],
              shadowColor: value ? colors.success : colors.text,
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: value ? 0.3 : 0.1,
              shadowRadius: 4,
            }}
          />
        </View>
      </View>
    </View>
  );
};

// Updated RadioOption component with theming
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
  const { colors } = useTheme(); // Get theme colors
  
  return (
    <TouchableOpacity 
      className="flex-row p-4 rounded-2xl border-2 mb-3" 
      style={{
        backgroundColor: checked ? colors.surface : colors.cardBase,
        borderColor: checked ? colors.success : colors.border,
        shadowColor: checked ? colors.success : colors.text,
        shadowOpacity: checked ? 0.2 : 0.1,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 4,
      }}
      onPress={onChange}
    >
      <View 
        className="w-6 h-6 rounded-full border-2 items-center justify-center mr-4 mt-1" 
        style={{
          borderColor: checked ? colors.success : colors.border,
          backgroundColor: checked ? `${colors.success}20` : 'transparent'
        }}
      >
        {checked && (
          <View 
            className="w-3 h-3 rounded-full shadow-lg" 
            style={{ backgroundColor: colors.success }}
          />
        )}
      </View>
      <View className="flex-1">
        <Text 
          className={`${designTokens.typography.bodyLarge} font-black mb-1`}
          style={{ color: colors.text }}
        >
          {label}
        </Text>
        <Text 
          className={`${designTokens.typography.body} font-medium leading-relaxed`}
          style={{ color: colors.textSecondary }}
        >
          {description}
        </Text>
      </View>
      {checked && (
        <View className="items-center justify-center">
          <MaterialIcons name="check-circle" size={24} color={colors.success} />
        </View>
      )}
    </TouchableOpacity>
  );
};

export default EditPrivacySet;