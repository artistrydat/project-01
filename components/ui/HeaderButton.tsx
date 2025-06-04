import React from 'react';
import { Pressable, View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../../contexts/ThemeContext';

interface HeaderButtonProps {
  icon: string;
  onPress: () => void;
  variant?: 'default' | 'cyber' | 'gradient' | 'glass';
  size?: 'sm' | 'md' | 'lg';
  badge?: number;
  isActive?: boolean;
  disabled?: boolean;
}

export const HeaderButton: React.FC<HeaderButtonProps> = ({
  icon,
  onPress,
  variant = 'default',
  size = 'md',
  badge,
  isActive = false,
  disabled = false,
}) => {
  const { colors, isDark } = useTheme();

  // Size configurations
  const sizeConfig = {
    sm: { container: 32, icon: 18, badge: 16 },
    md: { container: 40, icon: 22, badge: 18 },
    lg: { container: 48, icon: 26, badge: 20 },
  };

  const config = sizeConfig[size];

  // Base container styles
  const baseContainerStyle = {
    width: config.container,
    height: config.container,
    borderRadius: config.container / 2,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    position: 'relative' as const,
  };

  // Icon color based on variant and state
  const getIconColor = () => {
    if (disabled) return colors.textTertiary;
    
    switch (variant) {
      case 'cyber':
        return isActive ? colors.cyber : colors.textSecondary;
      case 'gradient':
        return colors.textInverse;
      case 'glass':
        return colors.textInverse;
      default:
        return isActive ? colors.primary : colors.textSecondary;
    }
  };

  // Render gradient variants
  if (variant === 'gradient') {
    return (
      <Pressable onPress={onPress} disabled={disabled}>
        <LinearGradient
          colors={[colors.primary, colors.electric]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={baseContainerStyle}
        >
          <Ionicons 
            name={icon as any} 
            size={config.icon} 
            color={getIconColor()} 
          />
          {badge && badge > 0 && (
            <View
              style={{
                position: 'absolute',
                top: -2,
                right: -2,
                backgroundColor: colors.neon,
                borderRadius: config.badge / 2,
                minWidth: config.badge,
                height: config.badge,
                alignItems: 'center',
                justifyContent: 'center',
                paddingHorizontal: 4,
              }}
            >
              <Text style={{ 
                color: colors.textInverse, 
                fontSize: 10, 
                fontWeight: 'bold' 
              }}>
                {badge > 99 ? '99+' : badge}
              </Text>
            </View>
          )}
        </LinearGradient>
      </Pressable>
    );
  }

  // Cyber variant
  if (variant === 'cyber') {
    return (
      <Pressable onPress={onPress} disabled={disabled}>
        <View
          style={{
            ...baseContainerStyle,
            backgroundColor: isActive 
              ? `${colors.cyber}20` 
              : isDark ? colors.surface : colors.backgroundSecondary,
            borderWidth: isActive ? 2 : 1,
            borderColor: isActive ? colors.cyber : colors.border,
            shadowColor: isActive ? colors.cyber : 'transparent',
            shadowOffset: { width: 0, height: 0 },
            shadowOpacity: 0.3,
            shadowRadius: 8,
            elevation: isActive ? 6 : 0,
          }}
        >
          <Ionicons 
            name={icon as any} 
            size={config.icon} 
            color={getIconColor()} 
          />
          {badge && badge > 0 && (
            <View
              style={{
                position: 'absolute',
                top: -2,
                right: -2,
                backgroundColor: colors.cyber,
                borderRadius: config.badge / 2,
                minWidth: config.badge,
                height: config.badge,
                alignItems: 'center',
                justifyContent: 'center',
                paddingHorizontal: 4,
              }}
            >
              <Text style={{ 
                color: colors.textInverse, 
                fontSize: 10, 
                fontWeight: 'bold' 
              }}>
                {badge > 99 ? '99+' : badge}
              </Text>
            </View>
          )}
        </View>
      </Pressable>
    );
  }

  // Glass variant
  if (variant === 'glass') {
    return (
      <Pressable onPress={onPress} disabled={disabled}>
        <View
          style={{
            ...baseContainerStyle,
            backgroundColor: 'rgba(255, 255, 255, 0.15)',
            borderWidth: 1,
            borderColor: 'rgba(255, 255, 255, 0.2)',
            backdropFilter: 'blur(20px)',
          }}
        >
          <Ionicons 
            name={icon as any} 
            size={config.icon} 
            color={getIconColor()} 
          />
          {badge && badge > 0 && (
            <View
              style={{
                position: 'absolute',
                top: -2,
                right: -2,
                backgroundColor: colors.neon,
                borderRadius: config.badge / 2,
                minWidth: config.badge,
                height: config.badge,
                alignItems: 'center',
                justifyContent: 'center',
                paddingHorizontal: 4,
              }}
            >
              <Text style={{ 
                color: colors.textInverse, 
                fontSize: 10, 
                fontWeight: 'bold' 
              }}>
                {badge > 99 ? '99+' : badge}
              </Text>
            </View>
          )}
        </View>
      </Pressable>
    );
  }

  // Default variant
  return (
    <Pressable onPress={onPress} disabled={disabled}>
      <View
        style={{
          ...baseContainerStyle,
          backgroundColor: isActive 
            ? `${colors.primary}20` 
            : isDark ? colors.surface : colors.backgroundSecondary,
          borderWidth: isActive ? 2 : 0,
          borderColor: isActive ? colors.primary : 'transparent',
        }}
      >
        <Ionicons 
          name={icon as any} 
          size={config.icon} 
          color={getIconColor()} 
        />
        {badge && badge > 0 && (
          <View
            style={{
              position: 'absolute',
              top: -2,
              right: -2,
              backgroundColor: colors.error,
              borderRadius: config.badge / 2,
              minWidth: config.badge,
              height: config.badge,
              alignItems: 'center',
              justifyContent: 'center',
              paddingHorizontal: 4,
            }}
          >
            <Text style={{ 
              color: colors.textInverse, 
              fontSize: 10, 
              fontWeight: 'bold' 
            }}>
              {badge > 99 ? '99+' : badge}
            </Text>
          </View>
        )}
      </View>
    </Pressable>
  );
};

// Pre-styled variants
export const CyberHeaderButton: React.FC<Omit<HeaderButtonProps, 'variant'>> = (props) => (
  <HeaderButton variant="cyber" {...props} />
);

export const GradientHeaderButton: React.FC<Omit<HeaderButtonProps, 'variant'>> = (props) => (
  <HeaderButton variant="gradient" {...props} />
);

export const GlassHeaderButton: React.FC<Omit<HeaderButtonProps, 'variant'>> = (props) => (
  <HeaderButton variant="glass" {...props} />
);