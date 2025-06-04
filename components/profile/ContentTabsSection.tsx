import React, { useState, useEffect } from 'react';
import { View, Text, Pressable, ScrollView, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme, designTokens } from '../../contexts/ThemeContext';
import { DestinationCard } from '../destination/DestinationCard';
import { useItineraryStore } from '../../store/itinerary/ItineraryStore';

interface ContentTabsSectionProps {
  userId: string;
}

export default function ContentTabsSection({ userId }: ContentTabsSectionProps) {
  const { colors, isDark } = useTheme();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'myItineraries' | 'favorites'>('myItineraries');
  
  const {
    userItineraries,
    favoriteItineraries,
    isLoading,
    error,
    fetchUserItineraries,
    fetchUserFavoriteItineraries
  } = useItineraryStore();

  useEffect(() => {
    if (userId) {
      console.log(`[ContentTabsSection] Fetching data for user: ${userId}, tab: ${activeTab}`);
      if (activeTab === 'myItineraries') {
        fetchUserItineraries(userId);
      } else {
        fetchUserFavoriteItineraries(userId);
      }
    }
  }, [userId, activeTab, fetchUserItineraries, fetchUserFavoriteItineraries]);

  const handleTabPress = (tab: 'myItineraries' | 'favorites') => {
    setActiveTab(tab);
  };

  const handleCreateItinerary = () => {
    router.push('/(protected)/destination/itinerary/create');
  };

  const handleViewItinerary = (itineraryId: string) => {
    router.push(`/(protected)/destination/itinerary/${itineraryId}`);
  };

  const handleToggleFavorite = async (itineraryId: string) => {
    console.log(`[ContentTabsSection] Toggling favorite for itinerary: ${itineraryId}`);
    
    setTimeout(() => {
      if (activeTab === 'myItineraries') {
        fetchUserItineraries(userId);
      } else {
        fetchUserFavoriteItineraries(userId);
      }
    }, 100);
  };

  const getCurrentItineraries = () => {
    return activeTab === 'myItineraries' ? userItineraries : favoriteItineraries;
  };

  const renderContent = () => {
    if (isLoading) {
      return (
        <View style={{ paddingVertical: 40, alignItems: 'center' }}>
          {/* Enhanced loading container with gradient */}
          <View 
            style={{
              width: 80,
              height: 80,
              borderRadius: 40,
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 16,
              backgroundColor: isDark ? 'rgba(59, 130, 246, 0.1)' : 'rgba(59, 130, 246, 0.05)',
              borderWidth: 2,
              borderColor: isDark ? 'rgba(59, 130, 246, 0.2)' : 'rgba(59, 130, 246, 0.1)'
            }}
          >
            <ActivityIndicator size="large" color={colors.cyber} />
          </View>
          <Text 
            className={designTokens.typography.bodySmall}
            style={{ 
              color: colors.textSecondary,
              textAlign: 'center',
              fontWeight: '500'
            }}
          >
            Loading your adventures...
          </Text>
        </View>
      );
    }

    if (error) {
      return (
        <View 
          style={{ 
            padding: 24,
            borderRadius: 20,
            alignItems: 'center',
            backgroundColor: isDark ? 'rgba(239, 68, 68, 0.05)' : 'rgba(239, 68, 68, 0.02)',
            borderWidth: 1,
            borderColor: isDark ? 'rgba(239, 68, 68, 0.2)' : 'rgba(239, 68, 68, 0.1)'
          }}
        >
          <View 
            style={{ 
              width: 56,
              height: 56,
              borderRadius: 28,
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 16,
              backgroundColor: isDark ? 'rgba(239, 68, 68, 0.15)' : 'rgba(239, 68, 68, 0.1)'
            }}
          >
            <MaterialIcons name="error-outline" size={28} color={colors.error} />
          </View>
          
          <Text 
            className={designTokens.typography.bodyLarge}
            style={{ 
              color: colors.error,
              textAlign: 'center',
              marginBottom: 8,
              fontWeight: 'bold'
            }}
          >
            Oops! Something went wrong
          </Text>
          
          <Text 
            className={designTokens.typography.bodySmall}
            style={{ 
              color: colors.textSecondary,
              textAlign: 'center',
              marginBottom: 20,
              opacity: 0.8
            }}
          >
            {error}
          </Text>
          
          <Pressable
            onPress={() => {
              if (activeTab === 'myItineraries') {
                fetchUserItineraries(userId);
              } else {
                fetchUserFavoriteItineraries(userId);
              }
            }}
            style={{
              backgroundColor: colors.error,
              paddingHorizontal: 24,
              paddingVertical: 12,
              borderRadius: 16,
              flexDirection: 'row',
              alignItems: 'center',
              gap: 8,
              shadowColor: colors.error,
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.3,
              shadowRadius: 8,
              elevation: 6
            }}
          >
            <MaterialIcons name="refresh" size={18} color={colors.textInverse} />
            <Text 
              className={designTokens.typography.bodySmall}
              style={{ 
                color: colors.textInverse,
                fontWeight: 'bold'
              }}
            >
              Try Again
            </Text>
          </Pressable>
        </View>
      );
    }

    const currentItineraries = getCurrentItineraries();

    if (currentItineraries.length === 0) {
      const emptyConfig = {
        myItineraries: {
          icon: 'map' as const,
          title: 'Ready for Adventure?',
          message: 'Create your first itinerary and start exploring amazing destinations around the world!',
          buttonText: 'Create Itinerary',
          showButton: true,
          gradient: [
            'rgba(59, 130, 246, 0.1)', 
            'rgba(147, 51, 234, 0.1)'
          ] as const, // Fixed: Added 'as const' for proper typing
          iconColor: colors.cyber
        },
        favorites: {
          icon: 'favorite-border' as const,
          title: 'Build Your Dream List',
          message: 'Discover incredible destinations and save your favorites for future adventures.',
          buttonText: 'Explore Destinations',
          showButton: false,
          gradient: [
            'rgba(236, 72, 153, 0.1)', 
            'rgba(239, 68, 68, 0.1)'
          ] as const, // Fixed: Added 'as const' for proper typing
          iconColor: colors.electric
        }
      };

      const config = emptyConfig[activeTab];
      
      return (
        <View 
          style={{ 
            padding: 32,
            borderRadius: 20,
            alignItems: 'center',
            backgroundColor: isDark ? 'rgba(255, 255, 255, 0.02)' : 'rgba(0, 0, 0, 0.01)'
          }}
        >
          {/* Gradient background */}
          <LinearGradient
            colors={config.gradient}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              borderRadius: 20
            }}
          />
          
          <View 
            style={{ 
              width: 72,
              height: 72,
              borderRadius: 36,
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 20,
              backgroundColor: isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.03)',
              borderWidth: 2,
              borderColor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)'
            }}
          >
            <MaterialIcons name={config.icon} size={36} color={config.iconColor} />
          </View>
          
          <Text 
            className={designTokens.typography.bodyLarge}
            style={{ 
              color: colors.text,
              textAlign: 'center',
              marginBottom: 12,
              fontWeight: 'bold',
              fontSize: 18
            }}
          >
            {config.title}
          </Text>
          
          <Text 
            className={designTokens.typography.body}
            style={{ 
              color: colors.textSecondary,
              textAlign: 'center',
              marginBottom: config.showButton ? 24 : 0,
              lineHeight: 22,
              opacity: 0.9
            }}
          >
            {config.message}
          </Text>
          
          {config.showButton && (
            <Pressable
              onPress={handleCreateItinerary}
              style={{
                backgroundColor: colors.cyber,
                paddingHorizontal: 28,
                paddingVertical: 16,
                borderRadius: 20,
                flexDirection: 'row',
                alignItems: 'center',
                gap: 10,
                shadowColor: colors.cyber,
                shadowOffset: { width: 0, height: 6 },
                shadowOpacity: 0.4,
                shadowRadius: 12,
                elevation: 8
              }}
            >
              <MaterialIcons name="add" size={22} color={colors.textInverse} />
              <Text 
                className={designTokens.typography.bodySmall}
                style={{ 
                  color: colors.textInverse,
                  fontWeight: 'bold',
                  fontSize: 15
                }}
              >
                {config.buttonText}
              </Text>
            </Pressable>
          )}
        </View>
      );
    }

    return (
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={{ maxHeight: 500 }}
      >
        <View style={{ gap: 14 }}>
          {currentItineraries.map((itinerary) => (
            <DestinationCard
              key={itinerary.ititeraryId}
              ititeraryId={itinerary.ititeraryId}
              name={itinerary.city}
              imageUrl={itinerary.imageUrl}
              trendingScore={itinerary.trendingScore}
              totalCost={itinerary.totalCost}
              duration={itinerary.duration}
              isPublic={itinerary.isPublic}
              isFavorite={itinerary.isfavorite}
              onPress={() => handleViewItinerary(itinerary.ititeraryId)}
              onToggleFavorite={() => handleToggleFavorite(itinerary.ititeraryId)}
            />
          ))}
        </View>
      </ScrollView>
    );
  };

  return (
    <View style={{ paddingHorizontal: 24, marginBottom: 24 }}>
      {/* Enhanced Section Title with gradient */}
      <View style={{ marginBottom: 20 }}>
        <Text 
          style={{ 
            fontSize: 26,
            fontWeight: '700',
            color: colors.text,
            marginBottom: 4
          }}
        >
          Your Itineraries
        </Text>
        <View 
          style={{
            width: 60,
            height: 4,
            borderRadius: 2,
            backgroundColor: colors.neon,
            opacity: 0.8
          }}
        />
      </View>

      {/* Enhanced Main Content Container */}
      <View 
        className={designTokens.effects.shadowLight}
        style={{ 
          backgroundColor: colors.surface,
          borderColor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)',
          borderWidth: 1,
          borderRadius: 24,
          overflow: 'hidden',
          shadowColor: colors.text,
          shadowOffset: { width: 0, height: 8 },
          shadowOpacity: isDark ? 0.3 : 0.1,
          shadowRadius: 16,
          elevation: 8
        }}
      >
        {/* Enhanced gradient overlay */}
        <LinearGradient
          colors={[
            isDark ? 'rgba(59, 130, 246, 0.08)' : 'rgba(59, 130, 246, 0.03)',
            isDark ? 'rgba(34, 197, 94, 0.08)' : 'rgba(34, 197, 94, 0.03)',
            isDark ? 'rgba(147, 51, 234, 0.08)' : 'rgba(147, 51, 234, 0.03)'
          ]}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0
          }}
        />

        {/* Enhanced Tab Navigation */}
        <View style={{ padding: 20, position: 'relative' }}>
          <View 
            style={{
              flexDirection: 'row',
              backgroundColor: isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.03)',
              borderRadius: 16,
              padding: 8,
              marginBottom: 24,
              borderWidth: 1,
              borderColor: isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.05)'
            }}
          >
            {([
              { key: 'myItineraries', label: 'My Trips', icon: 'map', color: colors.cyber },
              { key: 'favorites', label: 'Favorites', icon: 'favorite', color: colors.electric }
            ] as const).map((tab) => (
              <Pressable
                key={tab.key}
                onPress={() => handleTabPress(tab.key)}
                style={{
                  flex: 1,
                  paddingVertical: 14,
                  paddingHorizontal: 18,
                  borderRadius: 12,
                  backgroundColor: activeTab === tab.key 
                    ? (isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(255, 255, 255, 0.9)')
                    : 'transparent',
                  shadowColor: activeTab === tab.key ? tab.color : 'transparent',
                  shadowOffset: activeTab === tab.key ? { width: 0, height: 4 } : { width: 0, height: 0 },
                  shadowOpacity: activeTab === tab.key ? 0.25 : 0,
                  shadowRadius: activeTab === tab.key ? 8 : 0,
                  elevation: activeTab === tab.key ? 4 : 0,
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 8,
                  borderWidth: activeTab === tab.key ? 1 : 0,
                  borderColor: activeTab === tab.key 
                    ? (isDark ? 'rgba(255, 255, 255, 0.15)' : 'rgba(0, 0, 0, 0.08)')
                    : 'transparent'
                }}
              >
                <MaterialIcons 
                  name={tab.icon as any} 
                  size={18} 
                  color={activeTab === tab.key ? tab.color : colors.textSecondary} 
                />
                <Text
                  className={designTokens.typography.bodySmall}
                  style={{
                    textAlign: 'center',
                    fontWeight: activeTab === tab.key ? 'bold' : '600',
                    color: activeTab === tab.key ? tab.color : colors.textSecondary,
                    fontSize: 14
                  }}
                >
                  {tab.label}
                </Text>
                {/* Active indicator */}
                {activeTab === tab.key && (
                  <View 
                    style={{
                      position: 'absolute',
                      bottom: -2,
                      left: '50%',
                      transform: [{ translateX: -10 }],
                      width: 20,
                      height: 3,
                      borderRadius: 2,
                      backgroundColor: tab.color,
                      opacity: 0.8
                    }}
                  />
                )}
              </Pressable>
            ))}
          </View>

          {/* Tab Content */}
          {renderContent()}
        </View>
      </View>
    </View>
  );
}