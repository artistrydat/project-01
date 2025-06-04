import React, { useMemo, useCallback } from 'react';
import { View, Text, ScrollView, SafeAreaView, Image, TouchableOpacity, Linking, Alert } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInUp, FadeInLeft, FadeInRight, SlideInDown } from 'react-native-reanimated';
import { useItineraryStore } from '~/store/itinerary/ItineraryStore';
import { useTheme } from '~/contexts/ThemeContext';

interface RatingVisualizerProps {
  rating: number;
}

const RatingVisualizer: React.FC<RatingVisualizerProps> = ({ rating }) => {
  const { colors } = useTheme();
  
  return (
    <Animated.View 
      entering={FadeInLeft.delay(800).duration(600)}
      style={{ flexDirection: 'row', alignItems: 'center' }}
    >
      {[1, 2, 3, 4, 5].map((star) => (
        <MaterialIcons
          key={star}
          name={star <= rating ? 'star' : 'star-border'}
          size={20}
          color={star <= rating ? colors.warning : colors.textSecondary} // colors.warning for filled stars
          style={{ marginRight: 4 }}
        />
      ))}
      <Text style={{ 
        marginLeft: 8, 
        fontWeight: '600', 
        color: colors.text // theme text color
      }}>
        {rating.toFixed(1)}
      </Text>
    </Animated.View>
  );
};

interface AiRatingVisualizerProps {
  rating: number;
}

const AiRatingVisualizer: React.FC<AiRatingVisualizerProps> = ({ rating }) => {
  const { colors } = useTheme();
  
  const gradientColors: readonly [string, string] = rating > 80 ? [colors.success, colors.neon] : // theme success/neon for high rating
                                            rating > 60 ? [colors.warning, colors.warning] : // theme warning for medium rating
                                            [colors.error, colors.error]; // theme error for low rating
                 
  return (
    <Animated.View 
      entering={FadeInRight.delay(1400).duration(600)}
      style={{ alignItems: 'center' }}
    >
      <View style={{ 
        width: 80, 
        height: 80, 
        borderRadius: 40, 
        borderWidth: 4, 
        borderColor: colors.border, // theme border color
        alignItems: 'center', 
        justifyContent: 'center', 
        marginBottom: 8 
      }}>
        <LinearGradient
          colors={gradientColors}
          style={{
            width: 64, 
            height: 64, 
            borderRadius: 32, 
            alignItems: 'center', 
            justifyContent: 'center'
          }}
        >
          <Text style={{ 
            color: colors.textInverse, // theme inverse text color
            fontWeight: 'bold', 
            fontSize: 18 
          }}>
            {rating}
          </Text>
        </LinearGradient>
      </View>
      <Text style={{ 
        fontSize: 14, 
        fontWeight: '500', 
        color: colors.textSecondary // theme secondary text color
      }}>
        AI Score
      </Text>
    </Animated.View>
  );
};

const ActivityDetails = () => {
  const params = useLocalSearchParams();
  const { colors } = useTheme();
  
  // Memoize the activityId to prevent unnecessary re-computations
  const activityId = useMemo(() => {
    return Array.isArray(params.activityId) 
      ? params.activityId[0] 
      : params.activityId || '';
  }, [params.activityId]);

  // Use separate selectors to prevent the object recreation issue
  const itinerary = useItineraryStore(state => state.itinerary);
  const toggleUpvote = useItineraryStore(state => state.toggleUpvote);
  const toggleDownvote = useItineraryStore(state => state.toggleDownvote);
  const upvoted = useItineraryStore(state => state.upvoted);
  const downvoted = useItineraryStore(state => state.downvoted);

  // Memoize the activity search to prevent recalculation
  const activity = useMemo(() => {
    if (!itinerary?.ItineraryDays || !activityId) return null;
    
    return itinerary.ItineraryDays
      .flatMap(day => day.activitys)
      .find(a => a.id === activityId) || null;
  }, [itinerary?.ItineraryDays, activityId]);

  // Type info function with theme colors
  const getTypeInfo = (type: string) => {
    switch (type) {
      case 'landmark':
        return { icon: 'location-city', color: colors.warning, label: 'Landmark', emoji: '🏛️' };
      case 'food':
        return { icon: 'restaurant', color: colors.error, label: 'Restaurant', emoji: '🍽️' };
      case 'accommodation':
        return { icon: 'hotel', color: colors.primary, label: 'Hotel', emoji: '🏨' };
      case 'activity':
        return { icon: 'directions-run', color: colors.success, label: 'Activity', emoji: '🏃' };
      default:
        return { icon: 'place', color: colors.textSecondary, label: 'Place', emoji: '📍' };
    }
  };

  const handleOpenMaps = useCallback(() => {
    if (!activity) return;
    
    const { lat, lng } = activity.location;
    const url = `https://maps.google.com/?q=${lat},${lng}`;
    
    Linking.canOpenURL(url).then(supported => {
      if (supported) {
        Linking.openURL(url);
      } else {
        Alert.alert('Error', 'Cannot open maps application');
      }
    });
  }, [activity]);

  const handleUpvote = useCallback(() => {
    if (activity) {
      toggleUpvote(activity.id);
    }
  }, [activity, toggleUpvote]);

  const handleDownvote = useCallback(() => {
    if (activity) {
      toggleDownvote(activity.id);
    }
  }, [activity, toggleDownvote]);

  const handleBack = useCallback(() => {
    router.back();
  }, []);

  if (!activity) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
        <Animated.View 
          entering={FadeInUp.delay(200).duration(600)}
          style={{ 
            flex: 1, 
            alignItems: 'center', 
            justifyContent: 'center', 
            padding: 24 
          }}
        >
          <MaterialIcons name="error-outline" size={64} color={colors.textSecondary} />
          <Text style={{ 
            fontSize: 20, 
            fontWeight: 'bold', 
            marginTop: 16, 
            marginBottom: 8, 
            color: colors.text // theme text color
          }}>
            Activity Not Found
          </Text>
          <Text style={{ 
            textAlign: 'center', 
            marginBottom: 24, 
            color: colors.textSecondary // theme secondary text color
          }}>
            The activity you&apos;re looking for doesn&apos;t exist or has been removed.
          </Text>
          <TouchableOpacity
            onPress={handleBack}
            style={{
              paddingHorizontal: 24,
              paddingVertical: 12,
              borderRadius: 9999, // rounded-full equivalent
              backgroundColor: colors.primary // theme primary color
            }}
          >
            <Text style={{ 
              color: colors.textInverse, // theme inverse text color
              fontWeight: '600' 
            }}>
              Go Back
            </Text>
          </TouchableOpacity>
        </Animated.View>
      </SafeAreaView>
    );
  }

  const typeInfo = getTypeInfo(activity.type);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      {/* Animated Header */}
      <Animated.View 
        entering={SlideInDown.delay(100).duration(600)}
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingHorizontal: 24,
          paddingVertical: 16,
          borderBottomWidth: 1,
          borderBottomColor: colors.border,
          backgroundColor: colors.surface
        }}
      >
        <TouchableOpacity 
          style={{
            backgroundColor: colors.cyber,
            padding: 12,
            borderRadius: 16,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.3,
            shadowRadius: 8,
            elevation: 8
          }}
          onPress={handleBack}
        >
          <MaterialIcons name="arrow-back" size={20} color="white" />
        </TouchableOpacity>
        <Text style={{ 
          fontSize: 24, 
          fontWeight: 'bold',
          textAlign: 'center',
          flex: 1,
          marginLeft: 16,
          color: colors.text
        }}>
          Activity Details<Text style={{ color: colors.accent }}>.</Text>
        </Text>
        <TouchableOpacity
          style={{
            backgroundColor: colors.electric,
            padding: 12,
            borderRadius: 16,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.3,
            shadowRadius: 8,
            elevation: 8
          }}
        >
          <MaterialIcons name="share" size={20} color="white" />
        </TouchableOpacity>
      </Animated.View>

      <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
        {/* Hero Image with Type Badge */}
        <Animated.View 
          entering={FadeInUp.delay(200).duration(800)}
          style={{ position: 'relative' }}
        >
          <Image
            source={{ uri: activity.imageUrl }}
            style={{ width: '100%', height: 256 }}
            resizeMode="cover"
          />
          <LinearGradient
            colors={['transparent', 'rgba(0,0,0,0.3)']}
            style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              height: 80
            }}
          />
          
          {/* Type Badge - Bottom Right Corner */}
          <Animated.View 
            entering={FadeInRight.delay(600).duration(700)}
            style={{ position: 'absolute', bottom: 16, right: 16 }}
          >
            <LinearGradient
              colors={[typeInfo.color, `${typeInfo.color}CC`]}
              style={{
                borderRadius: 16,
                paddingHorizontal: 16,
                paddingVertical: 12,
                flexDirection: 'row',
                alignItems: 'center',
                shadowColor: typeInfo.color,
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.3,
                shadowRadius: 8,
                elevation: 6,
              }}
            >
              <Text style={{ 
                color: colors.textInverse, // theme inverse text color
                fontSize: 18, 
                marginRight: 8 
              }}>
                {typeInfo.emoji}
              </Text>
              <View>
                <Text style={{ 
                  color: colors.textInverse, // theme inverse text color
                  fontWeight: 'bold', 
                  fontSize: 14 
                }}>
                  {typeInfo.label}
                </Text>
                <Text style={{ 
                  color: 'rgba(255,255,255,0.8)', 
                  fontSize: 12 
                }}>
                  {activity.type === 'food' ? 'Dining Experience' : 
                   activity.type === 'landmark' ? 'Must-See Attraction' :
                   activity.type === 'accommodation' ? 'Stay Option' : 'Experience'}
                </Text>
              </View>
            </LinearGradient>
          </Animated.View>
        </Animated.View>

        <View style={{ padding: 24 }}>
          {/* Activity Title and Basic Info */}
          <Animated.View 
            entering={FadeInUp.delay(700).duration(600)}
            style={{ marginBottom: 24 }}
          >
            <Animated.Text 
              entering={FadeInLeft.delay(750).duration(500)}
              style={{ 
                fontSize: 24, 
                fontWeight: 'bold', 
                marginBottom: 8, 
                color: colors.text // theme text color
              }}
            >
              {activity.name}
            </Animated.Text>
            <Animated.Text 
              entering={FadeInLeft.delay(800).duration(500)}
              style={{ 
                fontSize: 16, 
                lineHeight: 24, 
                marginBottom: 16, 
                color: colors.textSecondary // theme secondary text color
              }}
            >
              {activity.description}
            </Animated.Text>
            
            {/* Rating and Cost */}
            <Animated.View 
              entering={FadeInUp.delay(850).duration(500)}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: 16
              }}
            >
              <RatingVisualizer rating={activity.rating} />
              {activity.cost && (
                <Animated.View 
                  entering={FadeInRight.delay(900).duration(500)}
                  style={{ flexDirection: 'row', alignItems: 'center' }}
                >
                  <MaterialIcons name="attach-money" size={20} color={colors.success} />
                  <Text style={{ 
                    fontSize: 20, 
                    fontWeight: 'bold', 
                    color: colors.success // theme success color
                  }}>
                    ${activity.cost}
                  </Text>
                </Animated.View>
              )}
            </Animated.View>
          </Animated.View>

          {/* Opening Hours & Tags - Side by Side */}
          <Animated.View 
            entering={FadeInUp.delay(1000).duration(600)}
            style={{
              flexDirection: 'row',
              marginBottom: 24,
              gap: 12
            }}
          >
            {/* Opening Hours */}
            {activity.openingHours && activity.openingHours.length > 0 && (
              <Animated.View 
                entering={FadeInLeft.delay(1100).duration(500)}
                style={{
                  flex: 1,
                  borderRadius: 16,
                  padding: 16,
                  backgroundColor: colors.surface,
                  borderWidth: 1,
                  borderColor: colors.border
                }}
              >
                <View style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginBottom: 12
                }}>
                  <MaterialIcons name="schedule" size={20} color={colors.primary} />
                  <Text style={{ 
                    fontSize: 16, 
                    fontWeight: 'bold', 
                    marginLeft: 8, 
                    color: colors.text
                  }}>
                    Hours
                  </Text>
                </View>
                {activity.openingHours.slice(0, 3).map((hours, index) => (
                  <Text 
                    key={index}
                    style={{ 
                      fontSize: 13, 
                      marginBottom: 3, 
                      color: colors.textSecondary,
                      lineHeight: 16
                    }}
                  >
                    {hours}
                  </Text>
                ))}
                {activity.openingHours.length > 3 && (
                  <Text style={{ 
                    fontSize: 12, 
                    color: colors.primary,
                    fontWeight: '500',
                    marginTop: 4
                  }}>
                    +{activity.openingHours.length - 3} more
                  </Text>
                )}
              </Animated.View>
            )}

            {/* Tags */}
            {activity.tags && activity.tags.length > 0 && (
              <Animated.View 
                entering={FadeInRight.delay(1100).duration(500)}
                style={{
                  flex: 1,
                  borderRadius: 16,
                  padding: 16,
                  backgroundColor: colors.surface,
                  borderWidth: 1,
                  borderColor: colors.border
                }}
              >
                <View style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginBottom: 12
                }}>
                  <MaterialIcons name="local-offer" size={20} color={colors.electric} />
                  <Text style={{ 
                    fontSize: 16, 
                    fontWeight: 'bold', 
                    marginLeft: 8, 
                    color: colors.text
                  }}>
                    Tags
                  </Text>
                </View>
                <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6 }}>
                  {activity.tags.slice(0, 4).map((tag, index) => (
                    <View 
                      key={index}
                      style={{
                        paddingHorizontal: 8,
                        paddingVertical: 4,
                        borderRadius: 12,
                        backgroundColor: colors.primary + '15',
                        borderWidth: 1,
                        borderColor: colors.primary + '30'
                      }}
                    >
                      <Text style={{ 
                        fontSize: 11, 
                        color: colors.primary,
                        fontWeight: '500'
                      }}>
                        #{tag}
                      </Text>
                    </View>
                  ))}
                  {activity.tags.length > 4 && (
                    <View style={{
                      paddingHorizontal: 8,
                      paddingVertical: 4,
                      borderRadius: 12,
                      backgroundColor: colors.textSecondary + '15'
                    }}>
                      <Text style={{ 
                        fontSize: 11, 
                        color: colors.textSecondary,
                        fontWeight: '500'
                      }}>
                        +{activity.tags.length - 4}
                      </Text>
                    </View>
                  )}
                </View>
              </Animated.View>
            )}
          </Animated.View>

          {/* AI Summary */}
          {activity.AiSummary && (
            <Animated.View 
              entering={FadeInUp.delay(1600).duration(600)}
              style={{
                borderRadius: 16,
                padding: 16,
                marginBottom: 24,
                backgroundColor: colors.surface // theme surface color
              }}
            >
              <Animated.View 
                entering={FadeInLeft.delay(1650).duration(500)}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: 12
                }}
              >
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <MaterialIcons name="psychology" size={24} color={colors.electric} />
                  <Text style={{ 
                    fontSize: 18, 
                    fontWeight: 'bold', 
                    marginLeft: 12, 
                    color: colors.text // theme text color
                  }}>
                    AI Insights
                  </Text>
                </View>
                {activity.AiSummaryRating && (
                  <AiRatingVisualizer rating={activity.AiSummaryRating} />
                )}
              </Animated.View>
              <Animated.Text 
                entering={FadeInUp.delay(1700).duration(500)}
                style={{ 
                  fontSize: 16, 
                  lineHeight: 24, 
                  color: colors.textSecondary // theme secondary text color
                }}
              >
                {activity.AiSummary}
              </Animated.Text>
            </Animated.View>
          )}

          {/* Action Buttons */}
          <Animated.View 
            entering={FadeInUp.delay(1800).duration(600)}
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginBottom: 24
            }}
          >
            <Animated.View 
              entering={FadeInLeft.delay(1850).duration(500)}
              style={{ flex: 1, marginRight: 8 }}
            >
              <TouchableOpacity
                onPress={handleUpvote}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'center',
                  paddingVertical: 12,
                  borderRadius: 16,
                  backgroundColor: upvoted[activity.id] ? colors.success + '33' : colors.surface // theme colors with transparency
                }}
              >
                <MaterialIcons 
                  name="thumb-up" 
                  size={20} 
                  color={upvoted[activity.id] ? colors.success : colors.textSecondary} 
                />
                <Text 
                  style={{
                    marginLeft: 8,
                    fontWeight: '600',
                    color: upvoted[activity.id] ? colors.success : colors.textSecondary
                  }}
                >
                  Like ({activity.upvoteCount || 0})
                </Text>
              </TouchableOpacity>
            </Animated.View>

            <Animated.View 
              entering={FadeInRight.delay(1900).duration(500)}
              style={{ flex: 1, marginLeft: 8 }}
            >
              <TouchableOpacity
                onPress={handleDownvote}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'center',
                  paddingVertical: 12,
                  borderRadius: 16,
                  backgroundColor: downvoted[activity.id] ? colors.error + '33' : colors.surface // theme colors with transparency
                }}
              >
                <MaterialIcons 
                  name="thumb-down" 
                  size={20} 
                  color={downvoted[activity.id] ? colors.error : colors.textSecondary} 
                />
                <Text 
                  style={{
                    marginLeft: 8,
                    fontWeight: '600',
                    color: downvoted[activity.id] ? colors.error : colors.textSecondary
                  }}
                >
                  Dislike ({activity.downvoteCount || 0})
                </Text>
              </TouchableOpacity>
            </Animated.View>
          </Animated.View>

          {/* Location Button */}
          <Animated.View entering={FadeInUp.delay(2000).duration(600)}>
            <TouchableOpacity
              onPress={handleOpenMaps}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                paddingVertical: 16,
                borderRadius: 16,
                marginBottom: 24,
                backgroundColor: colors.primary // theme primary color
              }}
            >
              <MaterialIcons name="map" size={24} color={colors.textInverse} />
              <Text style={{ 
                color: colors.textInverse, // theme inverse text color
                fontWeight: 'bold', 
                fontSize: 18, 
                marginLeft: 8 
              }}>
                Open in Maps
              </Text>
            </TouchableOpacity>
          </Animated.View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ActivityDetails;