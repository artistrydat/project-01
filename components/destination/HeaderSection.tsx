import React from 'react';
import { View, Text, Image, Pressable, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useItineraryStore } from '~/store/itinerary/ItineraryStore';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeIn, SlideInDown } from 'react-native-reanimated';
import { useTheme } from '~/contexts/ThemeContext';

interface HeaderSectionProps {
  name?: string;
  imageUrl?: string;
  isFavorite?: boolean;
  trendingScore?: number;
  ecoScore?: number;
  description?: string;
  onToggleFavorite?: () => void;
}

export const HeaderSection = ({
  name,
  imageUrl,
  isFavorite,
  trendingScore,
  ecoScore,
  description,
  onToggleFavorite,
}: HeaderSectionProps = {}) => {
  const { colors, isDark } = useTheme();
  const { itinerary, toggleFavorite } = useItineraryStore();

  const displayName = name || itinerary?.name;
  const displayImageUrl = imageUrl || itinerary?.imageUrl;
  const displayIsFavorite = isFavorite !== undefined ? isFavorite : itinerary?.isfavorite;
  const displayTrendingScore = trendingScore || itinerary?.trendingScore;
  const displayEcoScore = ecoScore || itinerary?.ecoScore;
  const displayDescription = description || itinerary?.description;

  if (!displayName || !displayImageUrl) return null;

  const handleToggleFavorite = () => {
    if (onToggleFavorite) return onToggleFavorite();
    toggleFavorite();
  };

  return (
    <Animated.View
      entering={FadeIn.duration(800)}
      style={{
        position: 'relative',
        marginBottom: 24, // mb-6
        overflow: 'hidden',
        height: 420
      }}
    >
      {/* Hero Image */}
      <Image
        source={{ uri: displayImageUrl }}
        style={{
          width: '100%',
          height: '100%',
          position: 'absolute',
          top: 0,
          left: 0
        }}
        resizeMode="cover"
      />
      
      {/* Add a gradient overlay for better readability */}
      <LinearGradient
        colors={['rgba(0,0,0,0.35)', 'rgba(0,0,0,0.05)', 'rgba(0,0,0,0.55)']}
        style={{ ...StyleSheet.absoluteFillObject }}
      />

      {/* Controls - Only Favorite Button */}
      <View style={{
        position: 'absolute',
        top: 48, // top-12
        right: 16,
        flexDirection: 'row', // flex-row
        alignItems: 'center', // items-center
      }}>
        <Animated.View 
          entering={SlideInDown.delay(400)} 
        >
          <BlurView 
            intensity={isDark ? 50 : 30} 
            style={{
              borderRadius: 16, // rounded-2xl
              overflow: 'hidden',
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.25,
              shadowRadius: 8,
              elevation: 6 // shadow-lg
            }}
          >
            <Pressable
              style={{
                padding: 12, // p-3
                transform: [{ scale: 1 }], // active:scale-95 base state
                backgroundColor: displayIsFavorite
                  ? 'rgba(255, 90, 95, 0.3)'
                  : 'rgba(255,255,255,0.1)'
              }}
              onPress={handleToggleFavorite}
            >
              <MaterialIcons
                name={displayIsFavorite ? 'favorite' : 'favorite-outline'}
                size={24}
                color={displayIsFavorite ? '#FF5A5F' : colors.textInverse}
              />
            </Pressable>
          </BlurView>
        </Animated.View>
      </View>

      {/* Info Section */}
      <Animated.View 
        entering={SlideInDown.delay(600)} 
        style={{
          position: 'absolute',
          bottom: 96, // bottom-24
          left: 0,
          right: 0,
          paddingHorizontal: 24 // px-6
        }}
      >
        <Text style={{
          color: colors.textInverse, // textInverse theme color
          fontSize: 36, // text-4xl
          fontWeight: 'bold', // font-black
          letterSpacing: -0.025, // tracking-tight
          marginBottom: 12, // mb-3
          textShadowColor: 'rgba(0, 0, 0, 0.3)',
          textShadowOffset: { width: 0, height: 1 },
          textShadowRadius: 3 // drop-shadow-lg
        }}>
          {displayName}
        </Text>

        <View style={{
          flexDirection: 'row', // flex-row
          gap: 16, // space-x-4 equivalent
          marginBottom: 16 // mb-4
        }}>
          {displayTrendingScore && (
            <View style={{
              backgroundColor: colors.warning, // warning theme color
              borderRadius: 9999, // rounded-full
              paddingHorizontal: 16, // px-4
              paddingVertical: 8, // py-2
              flexDirection: 'row', // flex-row
              alignItems: 'center', // items-center
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.25,
              shadowRadius: 8,
              elevation: 6 // shadow-lg
            }}>
              <MaterialIcons name="trending-up" size={16} color={colors.textInverse} />
              <Text style={{
                color: colors.textInverse, // textInverse theme color
                marginLeft: 8, // ml-2
                fontWeight: 'bold', // font-bold
                fontSize: 14 // text-sm
              }}>
                {displayTrendingScore}
              </Text>
            </View>
          )}
          {displayEcoScore && (
            <View style={{
              backgroundColor: colors.success, // success theme color
              borderRadius: 9999, // rounded-full
              paddingHorizontal: 16, // px-4
              paddingVertical: 8, // py-2
              flexDirection: 'row', // flex-row
              alignItems: 'center', // items-center
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.25,
              shadowRadius: 8,
              elevation: 6 // shadow-lg
            }}>
              <MaterialIcons name="eco" size={16} color={colors.textInverse} />
              <Text style={{
                color: colors.textInverse, // textInverse theme color
                marginLeft: 8, // ml-2
                fontWeight: 'bold', // font-bold
                fontSize: 14 // text-sm
              }}>
                {displayEcoScore}
              </Text>
            </View>
          )}
        </View>
      </Animated.View>

      {/* Description */}
      {displayDescription && (
        <Animated.View 
          entering={SlideInDown.delay(800)} 
          style={{
            position: 'absolute',
            bottom: 16, // bottom-4
            left: 16, // left-4
            right: 16 // right-4
          }}
        >
          <BlurView
            intensity={isDark ? 60 : 40}
            style={{
              borderRadius: 24, // rounded-3xl
              overflow: 'hidden',
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 12 },
              shadowOpacity: 0.25,
              shadowRadius: 20,
              elevation: 12, // shadow-xl
              borderWidth: 1,
              borderColor: 'rgba(255,255,255,0.1)' // border-white/10
            }}
          >
            <LinearGradient
              colors={
                isDark
                  ? ['rgba(30, 41, 59, 0.9)', 'rgba(51, 65, 85, 0.9)'] // slate-800/900 with transparency
                  : ['rgba(255, 255, 255, 0.95)', 'rgba(248, 250, 252, 0.95)'] // white/slate-50 with transparency
              }
              style={{ padding: 20 }} // p-5
            >
              <Text style={{
                fontSize: 16, // text-base
                fontWeight: '500', // font-medium
                lineHeight: 24, // leading-relaxed
                color: colors.text // text theme color
              }}>
                {displayDescription}
              </Text>
            </LinearGradient>
          </BlurView>
        </Animated.View>
      )}
    </Animated.View>
  );
};
