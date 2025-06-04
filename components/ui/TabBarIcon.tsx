import React from 'react';
import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../../contexts/ThemeContext';

interface TabBarIconProps {
  name: string;
  focused: boolean;
  label?: string;
  variant?: 'default' | 'cyber' | 'gradient' | 'minimal';
  badge?: number;
}

export const TabBarIcon: React.FC<TabBarIconProps> = ({
  name,
  focused,
  label,
  variant = 'default',
  badge,
}) => {
  const { colors } = useTheme();

  const iconSize = 24;
  const containerSize = 32;

  // Get colors based on focus state and variant
  const getIconColor = () => {
    if (variant === 'gradient') return colors.textInverse;
    
    return focused 
      ? variant === 'cyber' ? colors.cyber : colors.primary
      : colors.textTertiary;
  };

  const getLabelColor = () => {
    return focused 
      ? variant === 'cyber' ? colors.cyber : colors.primary
      : colors.textTertiary;
  };

  // Render gradient variant
  if (variant === 'gradient' && focused) {
    return (
      <View style={{ alignItems: 'center', minWidth: 60 }}>
        <View style={{ position: 'relative' }}>
          <LinearGradient
            colors={[colors.primary, colors.electric]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={{
              width: containerSize,
              height: containerSize,
              borderRadius: containerSize / 2,
              alignItems: 'center',
              justifyContent: 'center',
              shadowColor: colors.primary,
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.3,
              shadowRadius: 8,
              elevation: 6,
            }}
          >
            <Ionicons name={name as any} size={iconSize} color={getIconColor()} />
          </LinearGradient>
          
          {/* Badge */}
          {badge && badge > 0 && (
            <View
              style={{
                position: 'absolute',
                top: -4,
                right: -4,
                backgroundColor: colors.neon,
                borderRadius: 10,
                minWidth: 20,
                height: 20,
                alignItems: 'center',
                justifyContent: 'center',
                paddingHorizontal: 4,
                borderWidth: 2,
                borderColor: colors.background,
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
        
        {label && (
          <Text
            style={{
              fontSize: 11,
              fontWeight: '600',
              color: getLabelColor(),
              marginTop: 4,
              textAlign: 'center',
            }}
          >
            {label}
          </Text>
        )}
      </View>
    );
  }

  // Cyber variant
  if (variant === 'cyber') {
    return (
      <View style={{ alignItems: 'center', minWidth: 60 }}>
        <View style={{ position: 'relative' }}>
          <View
            style={{
              width: containerSize,
              height: containerSize,
              borderRadius: containerSize / 2,
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: focused 
                ? `${colors.cyber}20` 
                : 'transparent',
              borderWidth: focused ? 2 : 0,
              borderColor: focused ? colors.cyber : 'transparent',
              shadowColor: focused ? colors.cyber : 'transparent',
              shadowOffset: { width: 0, height: 0 },
              shadowOpacity: 0.4,
              shadowRadius: 12,
              elevation: focused ? 8 : 0,
            }}
          >
            <Ionicons name={name as any} size={iconSize} color={getIconColor()} />
          </View>
          
          {/* Outer glow for focused state */}
          {focused && (
            <View
              style={{
                position: 'absolute',
                inset: -4,
                borderRadius: (containerSize + 8) / 2,
                borderWidth: 1,
                borderColor: `${colors.cyber}40`,
                opacity: 0.6,
              }}
            />
          )}
          
          {/* Badge */}
          {badge && badge > 0 && (
            <View
              style={{
                position: 'absolute',
                top: -4,
                right: -4,
                backgroundColor: colors.cyber,
                borderRadius: 10,
                minWidth: 20,
                height: 20,
                alignItems: 'center',
                justifyContent: 'center',
                paddingHorizontal: 4,
                borderWidth: 2,
                borderColor: colors.background,
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
        
        {label && (
          <Text
            style={{
              fontSize: 11,
              fontWeight: focused ? '600' : '500',
              color: getLabelColor(),
              marginTop: 4,
              textAlign: 'center',
            }}
          >
            {label}
          </Text>
        )}
      </View>
    );
  }

  // Minimal variant
  if (variant === 'minimal') {
    return (
      <View style={{ alignItems: 'center', minWidth: 60 }}>
        <View style={{ position: 'relative' }}>
          <Ionicons name={name as any} size={iconSize} color={getIconColor()} />
          
          {/* Simple dot indicator */}
          {focused && (
            <View
              style={{
                position: 'absolute',
                bottom: -6,
                left: '50%',
                marginLeft: -2,
                width: 4,
                height: 4,
                borderRadius: 2,
                backgroundColor: colors.primary,
              }}
            />
          )}
          
          {/* Badge */}
          {badge && badge > 0 && (
            <View
              style={{
                position: 'absolute',
                top: -4,
                right: -4,
                backgroundColor: colors.error,
                borderRadius: 10,
                minWidth: 20,
                height: 20,
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
        
        {label && (
          <Text
            style={{
              fontSize: 11,
              fontWeight: focused ? '600' : '400',
              color: getLabelColor(),
              marginTop: 4,
              textAlign: 'center',
            }}
          >
            {label}
          </Text>
        )}
      </View>
    );
  }

  // Default variant
  return (
    <View style={{ alignItems: 'center', minWidth: 60 }}>
      <View style={{ position: 'relative' }}>
        <View
          style={{
            width: containerSize,
            height: containerSize,
            borderRadius: containerSize / 2,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: focused 
              ? `${colors.primary}20` 
              : 'transparent',
          }}
        >
          <Ionicons name={name as any} size={iconSize} color={getIconColor()} />
        </View>
        
        {/* Badge */}
        {badge && badge > 0 && (
          <View
            style={{
              position: 'absolute',
              top: -4,
              right: -4,
              backgroundColor: colors.error,
              borderRadius: 10,
              minWidth: 20,
              height: 20,
              alignItems: 'center',
              justifyContent: 'center',
              paddingHorizontal: 4,
              borderWidth: 2,
              borderColor: colors.background,
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
      
      {label && (
        <Text
          style={{
            fontSize: 11,
            fontWeight: focused ? '600' : '400',
            color: getLabelColor(),
            marginTop: 4,
            textAlign: 'center',
          }}
        >
          {label}
        </Text>
      )}
    </View>
  );
};

// Pre-styled variants
export const CyberTabBarIcon: React.FC<Omit<TabBarIconProps, 'variant'>> = (props) => (
  <TabBarIcon variant="cyber" {...props} />
);

export const GradientTabBarIcon: React.FC<Omit<TabBarIconProps, 'variant'>> = (props) => (
  <TabBarIcon variant="gradient" {...props} />
);

export const MinimalTabBarIcon: React.FC<Omit<TabBarIconProps, 'variant'>> = (props) => (
  <TabBarIcon variant="minimal" {...props} />
);