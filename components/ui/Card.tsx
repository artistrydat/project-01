import React from 'react';
import { View, Pressable, ViewStyle, Text } from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';

interface CardProps {
  children: React.ReactNode;
  onPress?: () => void;
  variant?: 'default' | 'cyber' | 'glass';
  size?: 'sm' | 'md' | 'lg';
  gradient?: boolean;
  style?: ViewStyle;
}

export const Card: React.FC<CardProps> = ({
  children,
  onPress,
  variant = 'default',
  size = 'md',
  gradient = false,
  style,
}) => {
  const { colors } = useTheme();
  
  // Recursively wrap any text nodes in Text components
  const renderChildren = (child: React.ReactNode): React.ReactNode => {
    if (typeof child === 'string' || typeof child === 'number') {
      return <Text style={{ color: colors.text }}>{child}</Text>;
    }
    
    if (React.isValidElement(child) && child.props && typeof child.props === 'object' && 'children' in child.props) {
      return React.cloneElement(child, {
        ...(child.props as any),
        children: React.Children.map((child.props as any).children, renderChildren)
      });
    }
    
    return child;
  };

  // Get size styles
  const getSizeStyles = () => {
    switch (size) {
      case 'sm':
        return {
          padding: 12,
          borderRadius: 12,
        };
      case 'lg':
        return {
          padding: 24,
          borderRadius: 20,
        };
      default: // 'md'
        return {
          padding: 16,
          borderRadius: 16,
        };
    }
  };

  // Get variant styles
  const getVariantStyles = () => {
    switch (variant) {
      case 'cyber':
        return {
          backgroundColor: colors.surface,
          borderWidth: 2,
          borderColor: colors.cyber,
          shadowColor: colors.cyber,
          shadowOffset: { width: 0, height: 0 },
          shadowOpacity: 0.3,
          shadowRadius: 8,
          elevation: 8,
        };
      case 'glass':
        return {
          backgroundColor: `${colors.surface}CC`,
          borderWidth: 1,
          borderColor: `${colors.border}66`,
          shadowColor: colors.shadow,
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.1,
          shadowRadius: 12,
          elevation: 4,
        };
      default:
        return {
          backgroundColor: colors.surface,
          borderWidth: 1,
          borderColor: colors.border,
          shadowColor: colors.shadow,
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 8,
          elevation: 3,
        };
    }
  };

  const cardStyles = {
    ...getSizeStyles(),
    ...getVariantStyles(),
    ...style,
  };

  const processedChildren = React.Children.map(children, renderChildren);

  if (onPress) {
    return (
      <Pressable
        onPress={onPress}
        style={({ pressed }) => [
          cardStyles,
          {
            opacity: pressed ? 0.8 : 1,
            transform: pressed ? [{ scale: 0.98 }] : [{ scale: 1 }],
          },
        ]}
      >
        {processedChildren}
      </Pressable>
    );
  }

  return (
    <View style={cardStyles}>
      {processedChildren}
    </View>
  );
};