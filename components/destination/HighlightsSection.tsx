// components/HighlightsSection.tsx
import React from 'react';
import { View, Text, Image, ScrollView, Dimensions, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInUp, FadeInRight, SlideInDown } from 'react-native-reanimated';
import { useTheme } from '~/contexts/ThemeContext';
import { useItineraryStore } from '~/store/itinerary/ItineraryStore';
import { router } from 'expo-router';

interface HighlightsSectionProps {
  onHighlightPress?: (highlight: any) => void;
}

const { width: screenWidth } = Dimensions.get('window');
const CARD_WIDTH = screenWidth * 0.85;

const ActivityTypeIcon = ({ type }: { type: string }) => {
  const { colors } = useTheme();
  
  const iconMap = {
    landmark: 'location-city',
    food: 'restaurant',
    accommodation: 'hotel',
    activity: 'directions-run'
  };
  
  const colorMap = {
    landmark: colors.warning || '#f59e0b',
    food: colors.error || '#ef4444',
    accommodation: colors.primary || '#000',
    activity: colors.success || '#10b981'
  };

  return (
    <View 
      style={{
        width: 32,
        height: 32,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(255,255,255,0.9)',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 4,
        elevation: 3
      }}
    >
      <MaterialIcons 
        name={iconMap[type as keyof typeof iconMap] as any} 
        size={18} 
        color={colorMap[type as keyof typeof colorMap]} 
      />
    </View>
  );
};

export const HighlightsSection = ({ onHighlightPress }: HighlightsSectionProps) => {
  const { colors, isDark } = useTheme();
  const { getHighRatedLandmarks, toggleUpvote, toggleDownvote, upvoted, downvoted } = useItineraryStore();
  
  // Get high-rated landmarks from the store
  const highlights = getHighRatedLandmarks();

  const handleActivityPress = (activityId: string) => {
    router.push(`/(protected)/destination/activity/${activityId}`);
  };

  const handleUpvote = (activityId: string, e: any) => {
    e.stopPropagation();
    toggleUpvote(activityId);
  };

  const handleDownvote = (activityId: string, e: any) => {
    e.stopPropagation();
    toggleDownvote(activityId);
  };

  if (!highlights || highlights.length === 0) {
    return (
      <Animated.View entering={FadeInUp.delay(300).duration(800)} style={{ padding: 24 }}>
        <View style={{ 
          backgroundColor: colors.surface,
          borderColor: colors.border,
          borderRadius: 24,
          padding: 32,
          alignItems: 'center',
          borderWidth: 2,
          borderStyle: 'dashed'
        }}>
          <View style={{ 
            backgroundColor: colors.backgroundSecondary,
            width: 64, height: 64, borderRadius: 32,
            alignItems: 'center', justifyContent: 'center', marginBottom: 16
          }}>
            <MaterialIcons name="photo-library" size={32} color={colors.textSecondary} />
          </View>
          <Text style={{ color: colors.text, fontSize: 20, fontWeight: 'bold', marginBottom: 8 }}>
            No High-Rated Landmarks Yet
          </Text>
          <Text style={{ color: colors.textSecondary, textAlign: 'center', lineHeight: 24 }}>
            High-rated landmarks (4.5+ stars) will appear here once your itinerary is ready
          </Text>
        </View>
      </Animated.View>
    );
  }

  return (
    <Animated.View entering={FadeInUp.delay(200).duration(600)} style={{ paddingBottom: 24 }}>
      {/* Keep the same header */}
      <LinearGradient colors={[colors.primary, colors.electric]}
        start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
        style={{ paddingHorizontal: 24, paddingVertical: 32 }}>
        <Animated.View entering={SlideInDown.delay(300).duration(600)}
          style={{ flexDirection: 'row', alignItems: 'center' }}>
          <View style={{ 
            backgroundColor: 'rgba(255,255,255,0.15)', width: 48, height: 48,
            borderRadius: 16, alignItems: 'center', justifyContent: 'center', marginRight: 16
          }}>
            <MaterialIcons name="photo-camera" size={28} color={colors.textInverse} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={{ color: colors.textInverse, fontSize: 24, fontWeight: 'bold', marginBottom: 4 }}>
              Must-See!
            </Text>
            <Text style={{ color: 'rgba(255,255,255,0.8)', fontSize: 14 }}>
              Discover the most iconic attractions and experiences
            </Text>
          </View>
        </Animated.View>
      </LinearGradient>

      {/* Updated badges section - only showing 4.5+ stars badge */}
      <View style={{ paddingHorizontal: 24, paddingTop: 16, paddingBottom: 8 }}>
        <Animated.View entering={FadeInUp.delay(400).duration(600)}
          style={{ flexDirection: 'row', alignItems: 'center' }}>
          <View style={{ 
            backgroundColor: colors.electric,
            paddingHorizontal: 12, paddingVertical: 8, borderRadius: 20
          }}>
            <Text style={{ color: colors.textInverse, fontSize: 14, fontWeight: '600' }}>
              4.5+ stars
            </Text>
          </View>
        </Animated.View>
      </View>

      {/* Activities with Hero Image Design - same as ActivityList */}
      <View style={{ padding: 24, paddingTop: 8 }}>
        <View style={{ gap: 16 }}>
          {highlights.map((activity, index) => (
            <Animated.View
              key={activity.id}
              entering={FadeInRight.delay(index * 100).duration(500)}
            >
              <TouchableOpacity
                onPress={() => handleActivityPress(activity.id)}
                activeOpacity={0.7}
                style={{
                  borderRadius: 20,
                  overflow: 'hidden',
                  backgroundColor: colors.surface || '#fff',
                  shadowColor: colors.text || '#000',
                  shadowOffset: { width: 0, height: 8 },
                  shadowOpacity: 0.12,
                  shadowRadius: 16,
                  elevation: 8
                }}
              >
                {/* Hero Image Section */}
                <View style={{ position: 'relative', height: 200 }}>
                  <Image
                    source={{ uri: activity.imageUrl }}
                    style={{ width: '100%', height: '100%' }}
                    resizeMode="cover"
                  />
                  
                  {/* Gradient Overlay */}
                  <LinearGradient
                    colors={['transparent', 'rgba(0,0,0,0.7)']}
                    style={{
                      position: 'absolute',
                      bottom: 0,
                      left: 0,
                      right: 0,
                      height: '60%'
                    }}
                  />
                  
                  {/* Activity Type Icon */}
                  <View style={{ position: 'absolute', top: 12, left: 12 }}>
                    <ActivityTypeIcon type={activity.type} />
                  </View>
                  
                  {/* Rating Badge */}
                  <View style={{ 
                    position: 'absolute', 
                    top: 12, 
                    right: 12,
                    backgroundColor: 'rgba(255,255,255,0.25)',
                    backdropFilter: 'blur(10px)',
                    borderRadius: 16,
                    paddingHorizontal: 12,
                    paddingVertical: 6,
                    flexDirection: 'row',
                    alignItems: 'center'
                  }}>
                    <MaterialIcons name="star" size={16} color="#FFD700" />
                    <Text style={{
                      marginLeft: 4,
                      fontWeight: '600',
                      fontSize: 14,
                      color: '#fff'
                    }}>
                      {String(activity.rating)}
                    </Text>
                  </View>
                  
                  {/* Activity Title and Description in Hero */}
                  <View style={{ 
                    position: 'absolute', 
                    bottom: 16, 
                    left: 16, 
                    right: 16 
                  }}>
                    <Text 
                      style={{ 
                        color: '#fff',
                        fontSize: 20,
                        fontWeight: 'bold',
                        marginBottom: 4,
                        textShadowColor: 'rgba(0,0,0,0.5)',
                        textShadowOffset: { width: 0, height: 1 },
                        textShadowRadius: 3
                      }}
                      numberOfLines={2}
                    >
                      {String(activity.name)}
                    </Text>
                    <Text 
                      style={{ 
                        color: 'rgba(255,255,255,0.9)',
                        fontSize: 14,
                        textShadowColor: 'rgba(0,0,0,0.5)',
                        textShadowOffset: { width: 0, height: 1 },
                        textShadowRadius: 3
                      }}
                      numberOfLines={2}
                    >
                      {String(activity.description)}
                    </Text>
                  </View>
                </View>

                {/* Content Section */}
                <View style={{ padding: 16 }}>
                  {/* Activity Details Row */}
                  <View style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: 12
                  }}>
                    {activity.cost && (
                      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <MaterialIcons name="attach-money" size={16} color={colors.success || '#10b981'} />
                        <Text style={{
                          color: colors.success || '#10b981',
                          fontWeight: '600',
                          fontSize: 14
                        }}>
                          <Text>$</Text>
                          <Text>{String(activity.cost)}</Text>
                        </Text>
                      </View>
                    )}

                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                      <MaterialIcons name="access-time" size={16} color={colors.textSecondary || '#666'} />
                      <Text style={{
                        marginLeft: 4,
                        fontSize: 14,
                        color: colors.textSecondary || '#666'
                      }}>
                        Landmark
                      </Text>
                    </View>
                  </View>

                  {/* Opening Hours */}
                  {activity.openingHours && (
                    <View style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      marginBottom: 12
                    }}>
                      <MaterialIcons name="schedule" size={14} color={colors.textSecondary || '#666'} />
                      <Text style={{
                        marginLeft: 4,
                        fontSize: 12,
                        color: colors.textSecondary || '#666'
                      }}>
                        {String(activity.openingHours.join(' - '))}
                      </Text>
                    </View>
                  )}

                  {/* Tags */}
                  {activity.tags && activity.tags.length > 0 && (
                    <ScrollView 
                      horizontal 
                      showsHorizontalScrollIndicator={false}
                      style={{ marginBottom: 16 }}
                    >
                      {activity.tags.slice(0, 3).map((tag, tagIndex) => (
                        <View 
                          key={tagIndex}
                          style={{
                            paddingHorizontal: 10,
                            paddingVertical: 6,
                            borderRadius: 12,
                            marginRight: 8,
                            backgroundColor: `${colors.primary || '#000'}15`,
                            borderWidth: 1,
                            borderColor: `${colors.primary || '#000'}25`
                          }}
                        >
                          <Text style={{
                            fontSize: 12,
                            fontWeight: '500',
                            color: colors.primary || '#000'
                          }}>
                            <Text>#</Text>
                            <Text>{String(tag)}</Text>
                          </Text>
                        </View>
                      ))}
                    </ScrollView>
                  )}

                  {/* Action Buttons - removed the delete button */}
                  <View style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'flex-end',
                    gap: 8
                  }}>
                    <TouchableOpacity
                      onPress={(e) => handleUpvote(activity.id, e)}
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        paddingHorizontal: 12,
                        paddingVertical: 8,
                        borderRadius: 16,
                        backgroundColor: upvoted[activity.id] ? `${colors.success || '#10b981'}20` : (colors.backgroundSecondary || '#f5f5f5'),
                        borderWidth: 1,
                        borderColor: upvoted[activity.id] ? (colors.success || '#10b981') : 'transparent'
                      }}
                    >
                      <MaterialIcons 
                        name="thumb-up" 
                        size={16} 
                        color={upvoted[activity.id] ? (colors.success || '#10b981') : (colors.textSecondary || '#666')} 
                      />
                      <Text 
                        style={{
                          marginLeft: 4,
                          fontSize: 12,
                          fontWeight: '600',
                          color: upvoted[activity.id] ? (colors.success || '#10b981') : (colors.textSecondary || '#666')
                        }}
                      >
                        Like
                      </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      onPress={(e) => handleDownvote(activity.id, e)}
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        paddingHorizontal: 12,
                        paddingVertical: 8,
                        borderRadius: 16,
                        backgroundColor: downvoted[activity.id] ? `${colors.error || '#ef4444'}20` : (colors.backgroundSecondary || '#f5f5f5'),
                        borderWidth: 1,
                        borderColor: downvoted[activity.id] ? (colors.error || '#ef4444') : 'transparent'
                      }}
                    >
                      <MaterialIcons 
                        name="thumb-down" 
                        size={16} 
                        color={downvoted[activity.id] ? (colors.error || '#ef4444') : (colors.textSecondary || '#666')} 
                      />
                      <Text 
                        style={{
                          marginLeft: 4,
                          fontSize: 12,
                          fontWeight: '600',
                          color: downvoted[activity.id] ? (colors.error || '#ef4444') : (colors.textSecondary || '#666')
                        }}
                      >
                        Dislike
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </TouchableOpacity>
            </Animated.View>
          ))}
        </View>
      </View>

      <LinearGradient colors={['transparent', `${colors.electric}33`]} style={{ height: 4 }} />
    </Animated.View>
  );
};