import React from 'react';
import { View, Text, Image, Pressable } from 'react-native';
import { Feather, Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme, designTokens } from '../../contexts/ThemeContext';
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
  const { colors, isDark } = useTheme();
  
  if (!profile) return null;
  
  return (
    <View 
      className={designTokens.components.card} // bg-white dark:bg-slate-800 rounded-xl shadow-md
      style={{ 
        backgroundColor: colors.cardBase,
        borderColor: colors.border,
        borderWidth: 1,
        borderRadius: 24,
        paddingTop: 20,
        paddingBottom: 24,
        paddingHorizontal: 16,
        marginBottom: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      }}
    >
      {/* Modern gradient background overlay */}
      <LinearGradient
        colors={[
          isDark ? 'rgba(56, 189, 248, 0.05)' : 'rgba(59, 130, 246, 0.05)',
          isDark ? 'rgba(168, 85, 247, 0.05)' : 'rgba(236, 72, 153, 0.05)'
        ]}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          borderRadius: 24,
        }}
      />
      
      {/* User Info Row with enhanced styling */}
      <View style={{ 
        flexDirection: 'row', 
        alignItems: 'center', 
        marginBottom: 20,
        position: 'relative'
      }}>
        <View style={{ position: 'relative' }}>
          <Image
            source={{ uri: profile.avatar }}
            style={{
              width: 112,
              height: 112,
              borderRadius: 24,
              borderWidth: 4,
              borderColor: colors.border,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.1,
              shadowRadius: 4,
            }}
          />
          {/* Status indicator */}
          <View 
            style={{ 
              position: 'absolute',
              bottom: -4,
              right: -4,
              width: 32,
              height: 32,
              borderRadius: 16,
              borderWidth: 3,
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: colors.success,
              borderColor: colors.cardBase 
            }}
          >
            <View 
              style={{ 
                width: 12,
                height: 12,
                borderRadius: 6,
                backgroundColor: colors.cardBase 
              }}
            />
          </View>
        </View>
        
        <View style={{ marginLeft: 20, flex: 1 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
            <Text 
              className={designTokens.typography.heading2} // text-3xl font-bold
              style={{ color: colors.text, letterSpacing: -0.5 }}
            >
              {profile.name}
            </Text>
            {profile.isVerified && (
              <View 
                style={{ 
                  marginLeft: 8,
                  borderRadius: 12,
                  padding: 6,
                  backgroundColor: colors.cyber,
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 1 },
                  shadowOpacity: 0.1,
                  shadowRadius: 2,
                }}
              >
                <Feather name="check" size={14} color={colors.textInverse} />
              </View>
            )}
            {profile.isPremium && (
              <View 
                style={{ 
                  marginLeft: 8,
                  borderRadius: 12,
                  padding: 6,
                  backgroundColor: colors.electric,
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 1 },
                  shadowOpacity: 0.1,
                  shadowRadius: 2,
                }}
              >
                <Ionicons name="star" size={14} color={colors.textInverse} />
              </View>
            )}
          </View>
          
          <Text 
            className={designTokens.typography.body} // text-base
            style={{ 
              color: colors.textSecondary,
              marginBottom: 8,
              fontWeight: '500'
            }}
          >
            @{profile.username}
          </Text>
          
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
            <View 
              style={{
                width: 16,
                height: 16,
                borderRadius: 8,
                marginRight: 8,
                backgroundColor: colors.primary 
              }}
            />
            <Text 
              className={designTokens.typography.body} // text-base
              style={{ color: colors.textSecondary }}
            >
              {profile.location}
            </Text>
          </View>
          
          <Text 
            className={designTokens.typography.caption} // text-xs
            style={{ 
              color: colors.textTertiary,
              fontWeight: '500'
            }}
          >
            Member since {memberSince}
          </Text>
        </View>
      </View>
      
      {/* Enhanced Bio */}
      <View 
        style={{ 
          borderRadius: 24,
          padding: 16,
          marginBottom: 16,
          borderWidth: 1,
          backgroundColor: colors.surface,
          borderColor: colors.border,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
        }}
      >
        <Text 
          className={designTokens.typography.body} // text-base
          style={{ 
            color: colors.text,
            fontWeight: '500',
            lineHeight: 24
          }}
        >
          {profile.bio || "✨ No bio yet - add one to show your travel style!"}
        </Text>
      </View>
      
      {/* Modern Stats Row */}
      <View 
        style={{ 
          borderRadius: 24,
          padding: 16,
          marginBottom: 16,
          borderWidth: 1,
          backgroundColor: colors.surface,
          borderColor: colors.border,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.1,
          shadowRadius: 8,
        }}
      >
        <LinearGradient
          colors={[
            isDark ? 'rgba(56, 189, 248, 0.08)' : 'rgba(59, 130, 246, 0.08)',
            isDark ? 'rgba(168, 85, 247, 0.08)' : 'rgba(236, 72, 153, 0.08)'
          ]}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            borderRadius: 24,
          }}
        />
        <View style={{ flexDirection: 'row', justifyContent: 'space-around', position: 'relative' }}>
          <View style={{ alignItems: 'center' }}>
            <Text 
              className={designTokens.typography.heading2} // text-3xl font-bold
              style={{ color: colors.text, marginBottom: 4 }}
            >
              {profile.stats?.posts || 0}
            </Text>
            <Text 
              className={designTokens.typography.caption} // text-xs
              style={{ 
                color: colors.textSecondary,
                fontWeight: 'bold',
                letterSpacing: 1
              }}
            >
              TRIPS
            </Text>
          </View>
          <View 
            style={{
              height: 48,
              width: 1,
              backgroundColor: colors.border 
            }}
          />
          <View style={{ alignItems: 'center' }}>
            <Text 
              className={designTokens.typography.heading2} // text-3xl font-bold
              style={{ color: colors.text, marginBottom: 4 }}
            >
              {profile.stats?.followers || 0}
            </Text>
            <Text 
              className={designTokens.typography.caption} // text-xs
              style={{ 
                color: colors.textSecondary,
                fontWeight: 'bold',
                letterSpacing: 1
              }}
            >
              FOLLOWERS
            </Text>
          </View>
          <View 
            style={{
              height: 48,
              width: 1,
              backgroundColor: colors.border 
            }}
          />
          <View style={{ alignItems: 'center' }}>
            <Text 
              className={designTokens.typography.heading2} // text-3xl font-bold
              style={{ color: colors.text, marginBottom: 4 }}
            >
              {profile.stats?.following || 0}
            </Text>
            <Text 
              className={designTokens.typography.caption} // text-xs
              style={{ 
                color: colors.textSecondary,
                fontWeight: 'bold',
                letterSpacing: 1
              }}
            >
              FOLLOWING
            </Text>
          </View>
        </View>
      </View>
      
      {/* Modern Action Buttons */}
      <View style={{ flexDirection: 'row', gap: 12 }}>
        <Pressable 
          style={{
            flex: 1,
            borderRadius: 24,
            overflow: 'hidden',
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.1,
            shadowRadius: 8,
          }}
          onPress={onEditProfile}
        >
          <LinearGradient
            colors={[colors.primary, colors.electric]}
            style={{ paddingVertical: 16, alignItems: 'center' }}
          >
            <Text 
              className={designTokens.typography.body} // text-base
              style={{ 
                color: colors.textInverse,
                fontWeight: 'bold',
                letterSpacing: 1
              }}
            >
              EDIT PROFILE
            </Text>
          </LinearGradient>
        </Pressable>
        
        <Pressable 
          style={{
            flex: 1,
            borderRadius: 24,
            overflow: 'hidden',
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.1,
            shadowRadius: 8,
          }}
          onPress={onShareProfile}
        >
          <LinearGradient
            colors={[colors.cyber, colors.neon]}
            style={{ paddingVertical: 16, alignItems: 'center' }}
          >
            <Text 
              className={designTokens.typography.body} // text-base
              style={{ 
                color: colors.textInverse,
                fontWeight: 'bold',
                letterSpacing: 1
              }}
            >
              SHARE ✨
            </Text>
          </LinearGradient>
        </Pressable>
      </View>
    </View>
  );
}