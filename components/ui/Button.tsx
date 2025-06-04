import React, { forwardRef, useRef } from 'react';
import {
  Text,
  TouchableOpacity,
  TouchableOpacityProps,
  View,
  ActivityIndicator,
  Animated,
  DimensionValue
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../contexts/ThemeContext';

export type ButtonVariant = 'primary' | 'secondary' | 'success' | 'danger' | 'outline' | 'ghost' | 'cyber' | 'electric' | 'neon' | 'aurora' | 'cosmic';
export type ButtonSize = 'sm' | 'md' | 'lg' | 'xl';

export type ButtonProps = {
  title: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: string;
  iconPosition?: 'left' | 'right';
  isLoading?: boolean;
  isDisabled?: boolean;
  withAnimation?: boolean;
  fullWidth?: boolean;
} & TouchableOpacityProps;

export const Button = forwardRef<View, ButtonProps>(
  ({
    title,
    variant = 'primary',
    size = 'md',
    icon,
    iconPosition = 'left',
    isLoading = false,
    isDisabled = false,
    withAnimation = true,
    fullWidth = false,
    ...touchableProps
  }, ref) => {
    const scale = useRef(new Animated.Value(1)).current;
    
    // Use the theme hook with colors
    const { colors } = useTheme();

    const handlePressIn = () => {
      if (withAnimation && !isDisabled && !isLoading) {
        Animated.spring(scale, {
          toValue: 0.96,
          useNativeDriver: true,
        }).start();
      }
    };

    const handlePressOut = () => {
      if (withAnimation) {
        Animated.spring(scale, {
          toValue: 1,
          useNativeDriver: true,
        }).start();
      }
    };

    // Get button styles based on variant and size
    const getButtonStyles = () => {
      const baseStyles = {
        borderRadius: 12, // rounded-xl equivalent
        alignItems: 'center' as const,
        justifyContent: 'center' as const,
        flexDirection: 'row' as const,
      };

      // Size styles - based on common spacing tokens
      const sizeStyles = {
        sm: { paddingHorizontal: 16, paddingVertical: 8, minHeight: 36 }, // px-4 py-2
        md: { paddingHorizontal: 24, paddingVertical: 12, minHeight: 44 }, // px-6 py-3
        lg: { paddingHorizontal: 32, paddingVertical: 16, minHeight: 52 }, // px-8 py-4
        xl: { paddingHorizontal: 40, paddingVertical: 20, minHeight: 60 }, // px-10 py-5
      };

      // Variant styles using theme colors
      const variantStyles = {
        primary: { backgroundColor: colors.primary }, // bg-primary
        secondary: { backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border }, // bg-surface border-border
        success: { backgroundColor: colors.success }, // bg-success
        danger: { backgroundColor: colors.error }, // bg-error
        outline: { backgroundColor: 'transparent', borderWidth: 2, borderColor: colors.primary }, // bg-transparent border-primary
        ghost: { backgroundColor: 'transparent' }, // bg-transparent
        cyber: { backgroundColor: colors.cyber }, // bg-cyber
        electric: { backgroundColor: colors.electric }, // bg-electric
        neon: { backgroundColor: colors.neon }, // bg-neon
        aurora: { backgroundColor: colors.primary }, // bg-primary (aurora fallback)
        cosmic: { backgroundColor: colors.electric }, // bg-electric (cosmic fallback)
      };

      return {
        ...baseStyles,
        ...sizeStyles[size],
        ...variantStyles[variant],
        width: fullWidth ? '100%' as DimensionValue : undefined, // w-full
        opacity: isDisabled ? 0.5 : 1, // opacity-50
      };
    };

    // Get text styles
    const getTextStyles = () => {
      const sizeStyles = {
        sm: { fontSize: 14 }, // text-sm
        md: { fontSize: 16 }, // text-base
        lg: { fontSize: 18 }, // text-lg
        xl: { fontSize: 20 }, // text-xl
      };

      // Text colors based on variant and theme
      const variantTextColors = {
        primary: colors.textInverse, // text-white
        secondary: colors.text, // text-foreground
        success: colors.textInverse, // text-white
        danger: colors.textInverse, // text-white
        outline: colors.primary, // text-primary
        ghost: colors.primary, // text-primary
        cyber: colors.textInverse, // text-white
        electric: colors.textInverse, // text-white
        neon: colors.textInverse, // text-white
        aurora: colors.textInverse, // text-white
        cosmic: colors.textInverse, // text-white
      };

      return {
        ...sizeStyles[size],
        color: variantTextColors[variant],
        fontWeight: '600' as const, // font-semibold
      };
    };

    // Render gradient variants
    const isGradientVariant = ['cyber', 'electric', 'neon', 'aurora', 'cosmic'].includes(variant);
    
    if (isGradientVariant) {
      // Gradient colors using theme colors
      const gradientColors = {
        cyber: [colors.cyber, colors.electric] as const,
        electric: [colors.electric, colors.primary] as const,
        neon: [colors.neon, colors.electric] as const,
        aurora: [colors.primary, colors.electric, colors.neon] as const,
        cosmic: [colors.electric, colors.primary, colors.cyber] as const,
      };

      return (
        <Animated.View style={{ transform: [{ scale }] }} ref={ref}>
          <TouchableOpacity
            disabled={isDisabled || isLoading}
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
            activeOpacity={0.8}
            {...touchableProps}
          >
            <LinearGradient
              colors={gradientColors[variant as keyof typeof gradientColors]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={getButtonStyles()}
            >
              {isLoading ? (
                <ActivityIndicator color={colors.textInverse} size="small" />
              ) : (
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  {icon && iconPosition === 'left' && (
                    <Ionicons 
                      name={icon as any} 
                      size={16} 
                      color={getTextStyles().color} 
                      style={{ marginRight: 8 }} // mr-2
                    />
                  )}
                  <Text style={getTextStyles()}>{title}</Text>
                  {icon && iconPosition === 'right' && (
                    <Ionicons 
                      name={icon as any} 
                      size={16} 
                      color={getTextStyles().color} 
                      style={{ marginLeft: 8 }} // ml-2
                    />
                  )}
                </View>
              )}
            </LinearGradient>
          </TouchableOpacity>
        </Animated.View>
      );
    }

    // Regular button variants
    return (
      <Animated.View style={{ transform: [{ scale }] }} ref={ref}>
        <TouchableOpacity
          style={getButtonStyles()}
          disabled={isDisabled || isLoading}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          activeOpacity={0.8}
          {...touchableProps}
        >
          {isLoading ? (
            <ActivityIndicator 
              color={variant === 'secondary' ? colors.primary : colors.textInverse} 
              size="small" 
            />
          ) : (
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              {icon && iconPosition === 'left' && (
                <Ionicons 
                  name={icon as any} 
                  size={16} 
                  color={getTextStyles().color} 
                  style={{ marginRight: 8 }} // mr-2
                />
              )}
              <Text style={getTextStyles()}>{title}</Text>
              {icon && iconPosition === 'right' && (
                <Ionicons 
                  name={icon as any} 
                  size={16} 
                  color={getTextStyles().color} 
                  style={{ marginLeft: 8 }} // ml-2
                />
              )}
            </View>
          )}
        </TouchableOpacity>
      </Animated.View>
    );
  }
);

Button.displayName = 'Button';

// Pre-styled button variants for common use cases
export const PrimaryButton: React.FC<Omit<ButtonProps, 'variant'>> = (props) => (
  <Button variant="primary" {...props} />
);

export const SecondaryButton: React.FC<Omit<ButtonProps, 'variant'>> = (props) => (
  <Button variant="secondary" {...props} />
);

export const CyberButton: React.FC<Omit<ButtonProps, 'variant'>> = (props) => (
  <Button variant="cyber" {...props} />
);

export const ElectricButton: React.FC<Omit<ButtonProps, 'variant'>> = (props) => (
  <Button variant="electric" {...props} />
);

export const NeonButton: React.FC<Omit<ButtonProps, 'variant'>> = (props) => (
  <Button variant="neon" {...props} />
);

export const GhostButton: React.FC<Omit<ButtonProps, 'variant'>> = (props) => (
  <Button variant="ghost" {...props} />
);

export const OutlineButton: React.FC<Omit<ButtonProps, 'variant'>> = (props) => (
  <Button variant="outline" {...props} />
);
