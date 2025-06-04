import React from 'react';
import { View, Text } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../../contexts/ThemeContext';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'error' | 'cyber' | 'electric' | 'neon';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'default',
  size = 'md',
  className = '',
}) => {
  const { colors } = useTheme();

  const sizeStyles = {
    sm: { paddingHorizontal: 6, paddingVertical: 2, fontSize: 10 },
    md: { paddingHorizontal: 8, paddingVertical: 4, fontSize: 12 },
    lg: { paddingHorizontal: 12, paddingVertical: 6, fontSize: 14 },
  };

  const variantStyles = {
    default: { backgroundColor: colors.surface, color: colors.text },
    primary: { backgroundColor: colors.primary, color: colors.textInverse },
    success: { backgroundColor: colors.success, color: colors.textInverse },
    warning: { backgroundColor: colors.warning, color: colors.textInverse },
    error: { backgroundColor: colors.error, color: colors.textInverse },
    cyber: { backgroundColor: colors.cyber, color: colors.textInverse },
    electric: { backgroundColor: colors.electric, color: colors.textInverse },
    neon: { backgroundColor: colors.neon, color: colors.textInverse },
  };

  const isGradientVariant = ['cyber', 'electric', 'neon'].includes(variant);

  if (isGradientVariant) {
    const gradientColors = {
      cyber: [colors.cyber, colors.electric] as const,
      electric: [colors.electric, colors.primary] as const,
      neon: [colors.neon, colors.electric] as const,
    };

    return (
      <View className={className}>
        <LinearGradient
          colors={gradientColors[variant as keyof typeof gradientColors]}
          style={{
            borderRadius: 12,
            alignItems: 'center',
            justifyContent: 'center',
            ...sizeStyles[size],
          }}
        >
          <Text
            style={{
              fontSize: sizeStyles[size].fontSize,
              color: colors.textInverse,
              fontWeight: '600',
            }}
          >
            {children}
          </Text>
        </LinearGradient>
      </View>
    );
  }

  return (
    <View
      style={{
        borderRadius: 12,
        backgroundColor: variantStyles[variant].backgroundColor,
        alignItems: 'center',
        justifyContent: 'center',
        ...sizeStyles[size],
      }}
      className={className}
    >
      <Text
        style={{
          fontSize: sizeStyles[size].fontSize,
          color: variantStyles[variant].color,
          fontWeight: '600',
        }}
      >
        {children}
      </Text>
    </View>
  );
};