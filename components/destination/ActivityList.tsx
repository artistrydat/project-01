import React, { useState } from 'react';
import { View, Text, ScrollView, Pressable, Image, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInUp, FadeInRight, configureReanimatedLogger, ReanimatedLogLevel } from 'react-native-reanimated';
import { useTheme } from '~/contexts/ThemeContext';
import { router } from 'expo-router';
import { useItineraryStore } from '~/store/itinerary/ItineraryStore';

// Configure logger to disable strict mode
configureReanimatedLogger({
  level: ReanimatedLogLevel.warn,
  strict: false, // This disables the strict mode warnings
});

interface Activity {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  type: 'landmark' | 'activity' | 'food' | 'accommodation';
  rating: number;
  cost?: number;
  duration?: string;
  openingHours?: string[];
  tags?: string[];
}

interface ActivityDay {
  id: string;
  day: number;
  title: string;
  activities: Activity[];
  weather?: any[];
}

interface ActivityListProps {
  days: ActivityDay[];
  destinationId: string;
}

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

const WeatherWidget = ({ weather }: { weather: any }) => {
  const { colors } = useTheme();
  
  if (!weather) return null;

  const getWeatherIcon = (condition: string) => {
    const iconMap: { [key: string]: string } = {
      'sunny': 'wb-sunny',
      'clear': 'wb-sunny',
      'cloudy': 'cloud',
      'partly cloudy': 'cloud',
      'rainy': 'umbrella',
      'showers': 'umbrella',
      'stormy': 'thunderstorm'
    };
    
    return iconMap[condition.toLowerCase()] || 'wb-sunny';
  };

  return (
    <View style={{
      backgroundColor: colors.surface || '#fff',
      borderRadius: 12,
      padding: 12,
      marginBottom: 16,
      borderWidth: 1,
      borderColor: colors.border || '#ddd'
    }}>
      <View style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <MaterialIcons 
            name={getWeatherIcon(weather.summary || 'sunny') as any} 
            size={24} 
            color={colors.primary || '#000'}
          />
          <View style={{ marginLeft: 12 }}>
            <Text style={{ fontWeight: '600', color: colors.text || '#000' }}>
              {String(weather.summary || 'Unknown')}
            </Text>
            <Text style={{ color: colors.textSecondary || '#666', fontSize: 14 }}>
              <Text>{String(weather.high || 'N/A')}</Text>
              <Text>°/</Text>
              <Text>{String(weather.low || 'N/A')}</Text>
              <Text>°C</Text>
            </Text>
          </View>
        </View>
        <View style={{
          backgroundColor: colors.backgroundSecondary || '#f5f5f5',
          paddingHorizontal: 12,
          paddingVertical: 4,
          borderRadius: 9999
        }}>
          <Text style={{ color: colors.text || '#000', fontWeight: '500', fontSize: 14 }}>
            {weather.date ? new Date(weather.date).toLocaleDateString('en-US', { weekday: 'short' }) : 'N/A'}
          </Text>
        </View>
      </View>
    </View>
  );
};

export const ActivityList: React.FC<ActivityListProps> = ({ days, destinationId }) => {
  const { itinerary, toggleUpvote, toggleDownvote, DeleteActivity, upvoted, downvoted } = useItineraryStore();
  const { colors } = useTheme();
  const [selectedDay, setSelectedDay] = useState(0);

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

  const handleDelete = (activityId: string, e: any) => {
    e.stopPropagation();
    DeleteActivity(activityId);
  };

  if (!days.length) {
    return (
      <View style={{
        paddingVertical: 48,
        alignItems: 'center'
      }}>
        <MaterialIcons name="event-busy" size={48} color={colors.textSecondary || '#666'} />
        <Text 
          style={{ 
            fontSize: 18,
            fontWeight: '600',
            marginTop: 16,
            marginBottom: 8,
            color: colors.text || '#000'
          }}
        >
          No Activities Planned
        </Text>
        <Text 
          style={{ 
            textAlign: 'center',
            color: colors.textSecondary || '#666'
          }}
        >
          Activities will appear here once the itinerary is created
        </Text>
      </View>
    );
  }

  return (
    <Animated.View 
      entering={FadeInUp.delay(400).duration(600)}
      style={{ paddingBottom: 24 }}
    >
      {/* Medium-sized Header with Gradient */}
      <LinearGradient
        colors={[colors.primary || '#000', colors.electric || '#000']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{
          paddingHorizontal: 24,
          paddingVertical: 24
        }}
      >
        <Animated.View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <View 
            style={{
              width: 40,
              height: 40,
              borderRadius: 12,
              alignItems: 'center',
              justifyContent: 'center',
              marginRight: 12,
              backgroundColor: 'rgba(255,255,255,0.15)'
            }}
          >
            <MaterialIcons name="event" size={24} color={colors.textInverse || '#fff'} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={{
              color: colors.textInverse || '#fff',
              fontSize: 20,
              fontWeight: 'bold',
              marginBottom: 2
            }}>
              Daily Activities
            </Text>
            <Text style={{
              color: 'rgba(255,255,255,0.8)',
              fontSize: 14
            }}>
              <Text>{String(days.length)}</Text>
              <Text> day</Text>
              <Text>{days.length !== 1 ? 's' : ''}</Text>
              <Text> planned</Text>
            </Text>
          </View>
          <Pressable 
            style={{
              padding: 6,
              borderRadius: 9999,
              backgroundColor: 'rgba(255,255,255,0.10)'
            }}
          >
            <MaterialIcons name="calendar-today" size={18} color={colors.textInverse || '#fff'} />
          </Pressable>
        </Animated.View>
      </LinearGradient>

      {/* Content Card */}
      <View style={{ padding: 24 }}>
        {/* Day Selector */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 4 }}
          style={{
            marginBottom: 16,
            borderRadius: 16,
            overflow: 'hidden',
            backgroundColor: colors.backgroundSecondary || '#f5f5f5'
          }}
        >
          {days.map((day, index) => (
            <Pressable
              key={day.id}
              onPress={() => setSelectedDay(index)}
              style={{ marginRight: 12 }}
            >
              <LinearGradient
                colors={
                  selectedDay === index
                    ? [colors.primary || '#000', colors.electric || '#000']
                    : [colors.surface || '#fff', colors.surface || '#fff']
                }
                style={{
                  borderRadius: 16,
                  paddingHorizontal: 16,
                  paddingVertical: 12,
                  minWidth: 100,
                  alignItems: 'center',
                  borderWidth: selectedDay === index ? 0 : 1,
                  borderColor: colors.border || '#ddd'
                }}
              >
                <Text 
                  style={{ 
                    fontWeight: 'bold',
                    fontSize: 14,
                    color: selectedDay === index ? (colors.textInverse || '#fff') : (colors.text || '#000')
                  }}
                >
                  <Text>Day </Text>
                  <Text>{String(day.day)}</Text>
                </Text>
                <Text 
                  style={{ 
                    fontSize: 12,
                    marginTop: 4,
                    color: selectedDay === index ? 'rgba(255,255,255,0.8)' : (colors.textSecondary || '#666')
                  }}
                >
                  <Text>{String(day.activities.length)}</Text>
                  <Text> activities</Text>
                </Text>
              </LinearGradient>
            </Pressable>
          ))}
        </ScrollView>

        {/* Selected Day Content */}
        {days[selectedDay] && (
          <Animated.View 
            key={selectedDay}
            entering={FadeInRight.duration(400)}
            style={{ gap: 16 }}
          >
            {/* Day Title */}
            <View 
              style={{
                borderRadius: 16,
                padding: 16,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.25,
                shadowRadius: 8,
                elevation: 6,
                overflow: 'hidden',
                backgroundColor: colors.backgroundSecondary || '#f5f5f5'
              }}
            >
              <Text 
                style={{
                  fontSize: 20,
                  fontWeight: 'bold',
                  marginBottom: 4,
                  color: colors.text || '#000'
                }}
              >
                {String(days[selectedDay].title)}
              </Text>
              <Text 
                style={{
                  fontSize: 14,
                  color: colors.textSecondary || '#666'
                }}
              >
                <Text>Day </Text>
                <Text>{String(days[selectedDay].day)}</Text>
                <Text> • </Text>
                <Text>{String(days[selectedDay].activities.length)}</Text>
                <Text> activities planned</Text>
              </Text>
            </View>

            {/* Weather for the day */}
            {itinerary?.ItineraryDays?.[selectedDay]?.weather?.[0] && (
              <WeatherWidget weather={itinerary.ItineraryDays[selectedDay].weather[0]} />
            )}

            {/* Activities with Hero Image Design */}
            <View style={{ gap: 16 }}>
              {days[selectedDay].activities.map((activity, index) => (
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

                        {activity.duration && (
                          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <MaterialIcons name="access-time" size={16} color={colors.textSecondary || '#666'} />
                            <Text style={{
                              marginLeft: 4,
                              fontSize: 14,
                              color: colors.textSecondary || '#666'
                            }}>
                              {String(activity.duration)}
                            </Text>
                          </View>
                        )}
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

                      {/* Action Buttons */}
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

                        <TouchableOpacity
                          onPress={(e) => handleDelete(activity.id, e)}
                          style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            paddingHorizontal: 12,
                            paddingVertical: 8,
                            borderRadius: 16,
                            backgroundColor: `${colors.error || '#ef4444'}15`,
                            borderWidth: 1,
                            borderColor: `${colors.error || '#ef4444'}25`
                          }}
                        >
                          <MaterialIcons name="delete-outline" size={16} color={colors.error || '#ef4444'} />
                          <Text style={{
                            marginLeft: 4,
                            fontSize: 12,
                            fontWeight: '600',
                            color: colors.error || '#ef4444'
                          }}>
                            Remove
                          </Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  </TouchableOpacity>
                </Animated.View>
              ))}
            </View>
          </Animated.View>
        )}
      </View>

      {/* Bottom Accent */}
      <LinearGradient
        colors={['transparent', `${colors.electric || '#000'}33`]}
        style={{ height: 4 }}
      />
    </Animated.View>
  );
};