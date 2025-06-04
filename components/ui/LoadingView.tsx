import React from "react";
import { View, Text, ActivityIndicator, DimensionValue } from "react-native";
import { useTheme, designTokens } from "../../contexts/ThemeContext";

export type LoadingVariant = "default" | "minimal" | "cyber" | "glass";
export type LoadingSize = "small" | "large";

export interface LoadingViewProps {
  message?: string;
  variant?: LoadingVariant;
  size?: LoadingSize;
  fullScreen?: boolean;
}

export const LoadingView: React.FC<LoadingViewProps> = ({
  message = "Loading...",
  variant = "default",
  size = "large",
  fullScreen = true,
}) => {
  const { colors, isDark } = useTheme();

  const containerClass = fullScreen
    ? "flex-1 justify-center items-center"
    : "justify-center items-center p-6";

  const getLoadingColor = () => {
    switch (variant) {
      case "cyber":
        return colors.cyber;
      case "glass":
        return colors.electric;
      case "minimal":
        return colors.primary;
      default:
        return colors.primary;
    }
  };

  const getSpinnerSize = () => {
    return size === "large" ? "large" : "small";
  };

  if (variant === "minimal") {
    return (
      <View className={containerClass}>
        <ActivityIndicator
          size={getSpinnerSize()}
          color={getLoadingColor()}
        />
        {message && (
          <Text className={`${designTokens.typography.body} ${designTokens.colors.textSecondary} mt-3 text-center`}>
            {message}
          </Text>
        )}
      </View>
    );
  }

  if (variant === "cyber") {
    return (
      <View className={containerClass} style={{ backgroundColor: colors.background }}>
        <View className="relative">
          {/* Cyber Loading Animation */}
          <View
            className="w-16 h-16 rounded-full border-4 animate-spin"
            style={{
              borderColor: `${colors.cyber}33`,
              borderTopColor: colors.cyber,
            }}
          />
          <View
            className="absolute inset-2 w-12 h-12 rounded-full border-2 animate-spin"
            style={{
              borderColor: `${colors.electric}33`,
              borderTopColor: colors.electric,
              animationDirection: "reverse" as any,
              animationDuration: "1.5s",
            }}
          />
        </View>
        {message && (
          <Text
            className={`${designTokens.typography.bodyLarge} mt-4 text-center font-semibold`}
            style={{ color: colors.cyber }}
          >
            {message}
          </Text>
        )}
      </View>
    );
  }

  if (variant === "glass") {
    return (
      <View className={containerClass} style={{ backgroundColor: colors.background }}>
        <View
          className="bg-white/10 backdrop-blur-xl p-8 rounded-3xl border border-white/20"
          style={{ backgroundColor: isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.05)" }}
        >
          <ActivityIndicator
            size={getSpinnerSize()}
            color={getLoadingColor()}
          />
          {message && (
            <Text className={`${designTokens.typography.body} ${designTokens.colors.textPrimary} mt-3 text-center`}>
              {message}
            </Text>
          )}
        </View>
      </View>
    );
  }

  // Default variant
  return (
    <View className={containerClass} style={{ backgroundColor: colors.background }}>
      <View className="items-center">
        <ActivityIndicator
          size={getSpinnerSize()}
          color={getLoadingColor()}
        />
        {message && (
          <Text className={`${designTokens.typography.body} ${designTokens.colors.textSecondary} mt-4 text-center`}>
            {message}
          </Text>
        )}
      </View>
    </View>
  );
};

// Skeleton loader for cards and content - Fix the style types
export const SkeletonLoader: React.FC<{
  width?: DimensionValue;
  height?: DimensionValue;
  borderRadius?: number;
}> = ({ width = "100%", height = 20, borderRadius = 8 }) => {
  const { colors } = useTheme();

  return (
    <View
      className="animate-pulse"
      style={{
        width,
        height,
        borderRadius,
        backgroundColor: colors.surface,
      }}
    />
  );
};

// Card skeleton for lists
export const CardSkeleton: React.FC = () => {
  const { colors } = useTheme();

  return (
    <View
      className="p-4 rounded-2xl mb-3"
      style={{ backgroundColor: colors.surface }}
    >
      <View className="flex-row items-center mb-3">
        <SkeletonLoader width={50} height={50} borderRadius={25} />
        <View className="ml-3 flex-1">
          <SkeletonLoader width="70%" height={16} borderRadius={4} />
          <View className="mt-2">
            <SkeletonLoader width="50%" height={12} borderRadius={4} />
          </View>
        </View>
      </View>
      <SkeletonLoader width="100%" height={12} borderRadius={4} />
      <View className="mt-2">
        <SkeletonLoader width="80%" height={12} borderRadius={4} />
      </View>
    </View>
  );
};

// Full screen loader with branding
export const FullScreenLoader: React.FC<{ message?: string }> = ({
  message = "Loading your adventure...",
}) => {
  const { colors } = useTheme();

  return (
    <View
      className="flex-1 justify-center items-center"
      style={{ backgroundColor: colors.background }}
    >
      <View className="items-center">
        {/* App Logo/Icon */}
        <View
          className="w-20 h-20 rounded-3xl mb-6 justify-center items-center"
          style={{ backgroundColor: colors.primary }}
        >
          <Text className="text-3xl">✈️</Text>
        </View>

        {/* Loading Animation */}
        <ActivityIndicator size="large" color={colors.primary} />

        {/* Message */}
        <Text className={`${designTokens.typography.bodyLarge} ${designTokens.colors.textSecondary} mt-4 text-center`}>
          {message}
        </Text>
      </View>
    </View>
  );
};