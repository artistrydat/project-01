import React from 'react';
import { View, Text, Image, Pressable, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeIn, SlideInUp } from 'react-native-reanimated';
import { useTheme } from '~/contexts/ThemeContext';

interface DestinationCardProps {
  ititeraryId: string;
  name: string;
  imageUrl: string;
  trendingScore?: number;
  totalCost?: number;
  duration?: number;
  isPublic?: boolean;
  isFavorite?: boolean;
  onPress: () => void;
  onToggleFavorite?: () => void;
}

export const DestinationCard = ({
  ititeraryId,
  name,
  imageUrl,
  trendingScore = 4.5,
  totalCost,
  duration,
  isPublic = false,
  isFavorite = false,
  onPress,
  onToggleFavorite
}: DestinationCardProps) => {
  const { colors } = useTheme();

  return (
    <Animated.View 
      entering={FadeIn.delay(200).duration(600)}
      style={{
        width: '100%',
        marginBottom: 16
      }}
    >
      <Pressable
        onPress={onPress}
        style={{
          shadowColor: colors.text,
          shadowOffset: { width: 0, height: 8 },
          shadowOpacity: 0.15,
          shadowRadius: 20,
          elevation: 10,
          transform: [{ scale: 1 }]
        }}
      >
        <View 
          style={{
            borderRadius: 24,
            overflow: 'hidden',
            backgroundColor: colors.surface
          }}
        >
          {/* Hero Image Section */}
          <View style={{ 
            position: 'relative', 
            height: 192
          }}>
            <Image
              source={{ uri: imageUrl }}
              style={{ 
                width: '100%', 
                height: '100%' 
              }}
              resizeMode="cover"
            />
            
            {/* Gradient Overlay */}
            <LinearGradient
              colors={['transparent', 'rgba(0,0,0,0.6)'] as const}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0
              }}
            />
            
            {/* Popular Badge */}
            {isPublic && (
              <Animated.View 
                entering={SlideInUp.delay(400)}
                style={{
                  position: 'absolute',
                  top: 12,
                  left: 12
                }}
              >
                <LinearGradient
                  colors={[colors.warning, '#F7931E'] as const}
                  style={{
                    borderRadius: 9999,
                    paddingHorizontal: 12,
                    paddingVertical: 4,
                    flexDirection: 'row',
                    alignItems: 'center'
                  }}
                >
                  <MaterialIcons name="local-fire-department" size={14} color={colors.textInverse} />
                  <Text style={{
                    color: colors.textInverse,
                    fontWeight: 'bold',
                    fontSize: 12,
                    marginLeft: 4
                  }}>
                    Popular
                  </Text>
                </LinearGradient>
              </Animated.View>
            )}
            
            {/* Rating Badge */}
            <Animated.View 
              entering={SlideInUp.delay(500)}
              style={{
                position: 'absolute',
                top: 12,
                right: 12
              }}
            >
              <View 
                style={{
                  backgroundColor: 'rgba(0,0,0,0.3)',
                  borderRadius: 9999,
                  paddingHorizontal: 12,
                  paddingVertical: 4,
                  flexDirection: 'row',
                  alignItems: 'center'
                }}
              >
                <MaterialIcons name="star" size={14} color="#FFD700" />
                <Text style={{
                  color: colors.textInverse,
                  fontWeight: '600',
                  fontSize: 12,
                  marginLeft: 4
                }}>
                  {typeof trendingScore === 'number' ? trendingScore.toFixed(1) : '4.5'}
                </Text>
              </View>
            </Animated.View>
            
            {/* Favorite Heart Icon */}
            {onToggleFavorite && (
              <Animated.View 
                entering={SlideInUp.delay(350)}
                style={{
                  position: 'absolute',
                  bottom: 12,
                  left: 12
                }}
              >
                <TouchableOpacity 
                  onPress={onToggleFavorite}
                  style={{
                    backgroundColor: 'rgba(255,255,255,0.25)',
                    borderRadius: 12,
                    padding: 8,
                    shadowColor: colors.text,
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.2,
                    shadowRadius: 4,
                    elevation: 4
                  }}
                >
                  <MaterialIcons 
                    name={isFavorite ? "favorite" : "favorite-border"} 
                    size={20} 
                    color={isFavorite ? colors.error : colors.textInverse} 
                  />
                </TouchableOpacity>
              </Animated.View>
            )}
            
            {/* Price Tag */}
            {totalCost && totalCost > 0 && (
              <Animated.View 
                entering={SlideInUp.delay(600)}
                style={{
                  position: 'absolute',
                  bottom: 12,
                  right: 12
                }}
              >
                <LinearGradient
                  colors={[colors.surface, colors.backgroundSecondary] as const}
                  style={{
                    borderRadius: 9999,
                    paddingHorizontal: 12,
                    paddingVertical: 4
                  }}
                >
                  <Text 
                    style={{
                      fontWeight: 'bold',
                      fontSize: 14,
                      color: colors.primary
                    }}
                  >
                    ${typeof totalCost === 'number' ? totalCost.toString() : '0'}
                  </Text>
                </LinearGradient>
              </Animated.View>
            )}
          </View>
          
          {/* Content Section */}
          <View style={{ padding: 20 }}>
            <Text 
              style={{
                fontSize: 20,
                fontWeight: 'bold',
                marginBottom: 8,
                letterSpacing: -0.025,
                color: colors.text
              }}
              numberOfLines={2}
            >
              {typeof name === 'string' ? name : 'Destination'}
            </Text>
            
            {/* Duration & Location Info */}
            {duration && (
              <View style={{
                flexDirection: 'row',
                alignItems: 'center'
              }}>
                <MaterialIcons 
                  name="schedule" 
                  size={16} 
                  color={colors.textSecondary} 
                />
                <Text 
                  style={{
                    marginLeft: 8,
                    fontWeight: '500',
                    color: colors.textSecondary
                  }}
                >
                  {typeof duration === 'number' ? `${duration} days` : 'Duration'}
                </Text>
              </View>
            )}
            
            {/* Action Button */}
            <View style={{ marginTop: 16 }}>
              <LinearGradient
                colors={[colors.primary, colors.electric] as const}
                style={{
                  borderRadius: 16,
                  paddingVertical: 12,
                  paddingHorizontal: 16
                }}
              >
                <Text style={{
                  color: colors.textInverse,
                  fontWeight: 'bold',
                  textAlign: 'center'
                }}>
                  Explore Now
                </Text>
              </LinearGradient>
            </View>
          </View>
        </View>
      </Pressable>
    </Animated.View>
  );
};