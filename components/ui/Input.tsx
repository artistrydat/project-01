import React, { useState, useRef } from 'react';
import { View, TextInput, Text, Animated, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme, designTokens } from '../../contexts/ThemeContext';

interface InputProps {
  label?: string;
  placeholder?: string;
  value?: string;
  onChangeText?: (text: string) => void;
  variant?: 'default' | 'cyber' | 'glass';
  size?: 'sm' | 'md' | 'lg';
  isError?: boolean;
  errorText?: string;
  leftIcon?: string;
  rightIcon?: string;
  onRightIconPress?: () => void;
  isDisabled?: boolean;
  secureTextEntry?: boolean;
  multiline?: boolean;
  numberOfLines?: number;
  className?: string;
  autoFocus?: boolean;
  keyboardType?: 'default' | 'email-address' | 'numeric' | 'phone-pad';
}

export const Input: React.FC<InputProps> = ({
  label,
  placeholder,
  value,
  onChangeText,
  variant = 'default',
  size = 'md',
  isError = false,
  errorText,
  leftIcon,
  rightIcon,
  onRightIconPress,
  isDisabled = false,
  secureTextEntry = false,
  multiline = false,
  numberOfLines = 1,
  className = '',
  autoFocus = false,
  keyboardType = 'default',
}) => {
  const { colors, isDark } = useTheme();
  const [isFocused, setIsFocused] = useState(false);
  const focusAnim = useRef(new Animated.Value(0)).current;

  const handleFocus = () => {
    setIsFocused(true);
    Animated.timing(focusAnim, {
      toValue: 1,
      duration: 200,
      useNativeDriver: false,
    }).start();
  };

  const handleBlur = () => {
    setIsFocused(false);
    Animated.timing(focusAnim, {
      toValue: 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
  };

  // Size styles
  const sizeStyles = {
    sm: {
      height: 36,
      paddingHorizontal: 12,
      fontSize: 14,
      borderRadius: 8,
    },
    md: {
      height: 44,
      paddingHorizontal: 16,
      fontSize: 16,
      borderRadius: 12,
    },
    lg: {
      height: 52,
      paddingHorizontal: 20,
      fontSize: 18,
      borderRadius: 16,
    },
  };

  // Get container styles based on variant and state
  const getContainerStyles = () => {
    const baseStyles = {
      ...sizeStyles[size],
      flexDirection: 'row' as const,
      alignItems: 'center' as const,
      borderWidth: 2,
    };

    // Variant styles
    switch (variant) {
      case 'cyber':
        return {
          ...baseStyles,
          backgroundColor: isDark ? 'rgba(15, 23, 42, 0.8)' : 'rgba(255, 255, 255, 0.9)',
          borderColor: isFocused 
            ? colors.cyber 
            : isError 
            ? colors.error 
            : 'rgba(57, 255, 20, 0.3)',
          shadowColor: isFocused ? colors.cyber : 'transparent',
          shadowOffset: { width: 0, height: 0 },
          shadowOpacity: 0.3,
          shadowRadius: 10,
          elevation: isFocused ? 8 : 0,
        };

      case 'glass':
        return {
          ...baseStyles,
          backgroundColor: 'rgba(255, 255, 255, 0.1)',
          borderColor: isFocused 
            ? colors.primary 
            : isError 
            ? colors.error 
            : 'rgba(255, 255, 255, 0.2)',
          backdropFilter: 'blur(20px)',
        };

      default:
        return {
          ...baseStyles,
          backgroundColor: isDark ? colors.surface : colors.background,
          borderColor: isFocused 
            ? colors.primary 
            : isError 
            ? colors.error 
            : colors.border,
          shadowColor: isFocused ? colors.primary : 'transparent',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.1,
          shadowRadius: 8,
          elevation: isFocused ? 4 : 0,
        };
    }
  };

  const textColor = variant === 'glass' 
    ? colors.textInverse 
    : colors.text;

  const placeholderColor = variant === 'glass' 
    ? 'rgba(255, 255, 255, 0.6)' 
    : colors.textTertiary;

  return (
    <View className={className}>
      {/* Label */}
      {label && (
        <Text 
          className={`${designTokens.typography.bodySmall} ${designTokens.colors.textSecondary} mb-2`}
        >
          {label}
        </Text>
      )}

      {/* Input Container */}
      <Animated.View style={getContainerStyles()}>
        {/* Left Icon */}
        {leftIcon && (
          <Ionicons 
            name={leftIcon as any} 
            size={20} 
            color={isFocused ? colors.primary : colors.textTertiary} 
            style={{ marginRight: 12 }}
          />
        )}

        {/* Text Input */}
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={placeholderColor}
          onFocus={handleFocus}
          onBlur={handleBlur}
          editable={!isDisabled}
          secureTextEntry={secureTextEntry}
          multiline={multiline}
          numberOfLines={numberOfLines}
          autoFocus={autoFocus}
          keyboardType={keyboardType}
          style={{
            flex: 1,
            fontSize: sizeStyles[size].fontSize,
            color: textColor,
            fontWeight: '500',
            textAlignVertical: multiline ? 'top' : 'center',
            height: multiline ? sizeStyles[size].height * (numberOfLines || 1) : undefined,
          }}
        />

        {/* Right Icon */}
        {rightIcon && (
          <Pressable onPress={onRightIconPress}>
            <Ionicons 
              name={rightIcon as any} 
              size={20} 
              color={isFocused ? colors.primary : colors.textTertiary} 
              style={{ marginLeft: 12 }}
            />
          </Pressable>
        )}
      </Animated.View>

      {/* Error Text */}
      {isError && errorText && (
        <Text className={`${designTokens.typography.caption} text-red-500 mt-1`}>
          {errorText}
        </Text>
      )}

      {/* Focus Glow Effect for Cyber Variant */}
      {variant === 'cyber' && isFocused && (
        <Animated.View
          style={{
            position: 'absolute',
            top: label ? 28 : 0,
            left: 0,
            right: 0,
            height: sizeStyles[size].height,
            borderRadius: sizeStyles[size].borderRadius,
            borderWidth: 2,
            borderColor: colors.cyber,
            opacity: focusAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [0, 0.6],
            }),
            transform: [{
              scale: focusAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [1, 1.02],
              }),
            }],
          }}
          pointerEvents="none"
        />
      )}
    </View>
  );
};

// Pre-styled input variants
export const CyberInput: React.FC<Omit<InputProps, 'variant'>> = (props) => (
  <Input variant="cyber" {...props} />
);

export const GlassInput: React.FC<Omit<InputProps, 'variant'>> = (props) => (
  <Input variant="glass" {...props} />
);

// Search input with enhanced styling
export const SearchInput: React.FC<Omit<InputProps, 'leftIcon' | 'placeholder'> & {
  onSearch?: () => void;
}> = ({ onSearch, ...props }) => (
  <Input
    leftIcon="search"
    rightIcon="options"
    placeholder="Search destinations..."
    onRightIconPress={onSearch}
    variant="cyber"
    {...props}
  />
);