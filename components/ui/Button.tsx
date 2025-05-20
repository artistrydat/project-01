import React from 'react';
import { Pressable, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import type { ButtonProps } from '../../types/ui.types';

export default function Button({
  label,
  onPress,
  variant = 'primary',
  size = 'medium',
  icon,
  disabled = false,
  loading = false,
  fullWidth = false,
}: ButtonProps) {
  // Button variant styles
  const getVariantClasses = () => {
    switch (variant) {
      case 'primary':
        return 'bg-primary border-primary';
      case 'secondary':
        return 'bg-secondary border-secondary';
      case 'outline':
        return 'bg-transparent border-quaternary';
      case 'danger':
        return 'bg-red-600 border-red-600';
      default:
        return 'bg-primary border-primary';
    }
  };

  // Button text color based on variant
  const getTextColorClass = () => {
    if (variant === 'outline') {
      return 'text-quaternary';
    }
    return 'text-quinary';
  };

  // Button size
  const getSizeClasses = () => {
    switch (size) {
      case 'small':
        return 'py-1 px-3';
      case 'medium':
        return 'py-2 px-4';
      case 'large':
        return 'py-3 px-6';
      default:
        return 'py-2 px-4';
    }
  };

  // Icon size based on button size
  const getIconSize = () => {
    switch (size) {
      case 'small':
        return 16;
      case 'medium':
        return 20;
      case 'large':
        return 24;
      default:
        return 20;
    }
  };

  return (
    <Pressable
      className={`flex-row items-center justify-center border rounded-lg ${getVariantClasses()} ${getSizeClasses()} ${
        disabled ? 'opacity-50' : 'opacity-100'
      } ${fullWidth ? 'w-full' : ''}`}
      onPress={onPress}
      disabled={disabled || loading}
      style={({ pressed }) => [
        styles.button,
        {
          transform: [{ scale: pressed && !disabled ? 0.98 : 1 }],
        },
      ]}
    >
      {loading ? (
        <ActivityIndicator 
          size="small" 
          color={variant === 'outline' ? '#4F46E5' : 'white'} 
          className="mr-2" 
        />
      ) : icon ? (
        <MaterialIcons 
          name={icon as keyof typeof MaterialIcons.glyphMap} 
          size={getIconSize()} 
          color={variant === 'outline' ? '#4F46E5' : 'white'} 
          style={{ marginRight: 8 }} 
        />
      ) : null}
      
      <Text 
        className={`font-medium text-center ${getTextColorClass()} ${
          size === 'small' ? 'text-sm' : size === 'large' ? 'text-lg' : 'text-base'
        }`}
      >
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.5,
  },
});
