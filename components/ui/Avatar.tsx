import React from 'react';
import { View, Image, Text } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../../contexts/ThemeContext';

interface AvatarProps {
  source?: { uri: string } | number;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  fallback?: string;
  variant?: 'default' | 'cyber' | 'gradient';
  className?: string;
}

export const Avatar: React.FC<AvatarProps> = ({
  source,
  size = 'md',
  fallback,
  variant = 'default',
  className = '',
}) => {
  const { colors } = useTheme();

  const sizeStyles = {
    xs: 24,
    sm: 32,
    md: 40,
    lg: 56,
    xl: 80,
  };

  const avatarSize = sizeStyles[size];

  if (variant === 'cyber' || variant === 'gradient') {
    const gradientColors = variant === 'cyber' 
      ? [colors.cyber, colors.electric] as const
      : [colors.primary, colors.electric] as const;

    return (
      <View className={className}>
        <LinearGradient
          colors={gradientColors}
          style={{
            width: avatarSize + 4,
            height: avatarSize + 4,
            borderRadius: (avatarSize + 4) / 2,
            padding: 2,
          }}
        >
          <View
            style={{
              width: avatarSize,
              height: avatarSize,
              borderRadius: avatarSize / 2,
              backgroundColor: colors.background,
              overflow: 'hidden',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {source ? (
              <Image
                source={source}
                style={{
                  width: avatarSize,
                  height: avatarSize,
                  borderRadius: avatarSize / 2,
                }}
                resizeMode="cover"
              />
            ) : (
              <Text
                style={{
                  color: colors.text,
                  fontSize: avatarSize * 0.4,
                  fontWeight: '600',
                }}
              >
                {fallback}
              </Text>
            )}
          </View>
        </LinearGradient>
      </View>
    );
  }

  return (
    <View className={className}>
      <View
        style={{
          width: avatarSize,
          height: avatarSize,
          borderRadius: avatarSize / 2,
          backgroundColor: colors.surface,
          overflow: 'hidden',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {source ? (
          <Image
            source={source}
            style={{
              width: avatarSize,
              height: avatarSize,
              borderRadius: avatarSize / 2,
            }}
            resizeMode="cover"
          />
        ) : (
          <Text
            style={{
              color: colors.textSecondary,
              fontSize: avatarSize * 0.4,
              fontWeight: '600',
            }}
          >
            {fallback}
          </Text>
        )}
      </View>
    </View>
  );
};