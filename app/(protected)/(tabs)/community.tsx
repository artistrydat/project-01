import React, { useState } from 'react';
import { View, Text, ScrollView, SafeAreaView, TouchableOpacity } from 'react-native';
import { Stack, router } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { ChatRoomCard } from '~/components/ui';
import { useTheme } from '~/contexts/ThemeContext';
import { useChatStore } from '~/store/chatStore';

// Mock data for quests
const mockQuests = [
  {
    id: '1',
    title: 'Local Expert',
    description: 'Answer 5 questions in a local chat room',
    points: 50,
    completed: false,
    progress: 2,
    total: 5,
    icon: '🎯',
  },
  {
    id: '2',
    title: 'Photo Expedition',
    description: 'Share 3 photos from your trip',
    points: 30,
    completed: true,
    progress: 3,
    total: 3,
    icon: '📸',
  },
  {
    id: '3',
    title: 'Cultural Connection',
    description: 'Join a local event through the app',
    points: 100,
    completed: false,
    progress: 0,
    total: 1,
    icon: '🌍',
  },
  {
    id: '4',
    title: 'Community Helper',
    description: 'Help 10 travelers with recommendations',
    points: 75,
    completed: false,
    progress: 6,
    total: 10,
    icon: '🤝',
  },
];

export default function CommunityScreen() {
  const [showQuests, setShowQuests] = useState(false);
  const { colors, isDark } = useTheme();
  const { getChatRoomSummaries, markRoomAsRead } = useChatStore();

  const chatRoomSummaries = getChatRoomSummaries();

  const handleChatRoomPress = (chatRoomId: string) => {
    markRoomAsRead(chatRoomId);
    router.push(`/(protected)/chat-room/${chatRoomId}`);
  };

  const renderQuestCard = (quest: typeof mockQuests[0], index: number) => {
    const progressPercentage = (quest.progress / quest.total) * 100;
    
    return (
      <View 
        key={quest.id} 
        style={{
          backgroundColor: colors.surface,
          borderRadius: 24,
          padding: 24,
          marginBottom: index < mockQuests.length - 1 ? 16 : 0,
          borderWidth: 1,
          borderColor: colors.border + '33',
          shadowColor: colors.shadow,
          shadowOffset: { width: 0, height: 8 },
          shadowOpacity: 0.1,
          shadowRadius: 8,
          elevation: 5,
        }}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
            <View style={{
              backgroundColor: quest.completed ? colors.success + '20' : colors.primary + '20',
              width: 48,
              height: 48,
              borderRadius: 16,
              alignItems: 'center',
              justifyContent: 'center',
              marginRight: 12,
            }}>
              <Text style={{ fontSize: 20 }}>
                {quest.completed ? '✅' : quest.icon}
              </Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text 
                style={{ 
                  fontSize: 20,
                  fontWeight: '900',
                  color: colors.text,
                  marginBottom: 4,
                }}
              >
                {quest.title}
              </Text>
              <Text 
                style={{ 
                  color: colors.textSecondary,
                  fontSize: 14,
                  fontWeight: '500',
                }}
              >
                {quest.description}
              </Text>
            </View>
          </View>
          
          <LinearGradient
            colors={quest.completed ? [colors.success, colors.success] : [colors.neon, colors.cyber]}
            style={{
              paddingHorizontal: 12,
              paddingVertical: 8,
              borderRadius: 16,
              shadowColor: quest.completed ? colors.success : colors.neon,
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.3,
              shadowRadius: 4,
              elevation: 4,
            }}
          >
            <Text 
              style={{ 
                color: 'white',
                fontSize: 14,
                fontWeight: '900',
                letterSpacing: 0.5,
              }}
            >
              {quest.points} pts
            </Text>
          </LinearGradient>
        </View>
        
        {/* Progress Section */}
        <View style={{ marginTop: 16 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
            <Text 
              style={{ 
                color: colors.textTertiary,
                fontSize: 12,
                fontWeight: '600',
                textTransform: 'uppercase',
                letterSpacing: 1,
              }}
            >
              Progress
            </Text>
            <Text 
              style={{ 
                color: colors.textSecondary,
                fontSize: 14,
                fontWeight: '700',
              }}
            >
              {quest.progress}/{quest.total}
            </Text>
          </View>
          
          <View 
            style={{
              height: 8,
              backgroundColor: colors.border,
              borderRadius: 8,
              overflow: 'hidden',
            }}
          >
            <LinearGradient
              colors={quest.completed ? [colors.success, colors.success] : [colors.neon, colors.cyber]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={{
                height: '100%',
                width: `${progressPercentage}%`,
                borderRadius: 8,
              }}
            />
          </View>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView 
      style={{ 
        flex: 1,
        backgroundColor: colors.backgroundSecondary 
      }}
    >
      <Stack.Screen options={{ 
        headerShown: false,
        statusBarStyle: isDark ? 'light' : 'dark',
      }} />
      
      {/* Modern Header */}
      <View 
        style={{ 
          backgroundColor: colors.surface,
          borderBottomColor: colors.border + '80',
          borderBottomWidth: 1,
          paddingHorizontal: 24,
          paddingTop: 16,
          paddingBottom: 24,
          shadowColor: colors.shadow,
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 8,
          elevation: 3,
        }}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 16 }}>
          <View style={{ flex: 1 }}>
            <Text 
              style={{ 
                fontSize: 28,
                fontWeight: '900',
                color: colors.text,
                marginBottom: 4,
              }}
            >
              Community<Text style={{ color: colors.neon }}>.</Text>
            </Text>
            <Text 
              style={{ 
                fontSize: 16,
                color: colors.textSecondary,
                fontWeight: '500',
              }}
            >
              Connect with fellow travelers ✨
            </Text>
          </View>
        </View>
      </View>
      
      {/* Enhanced Toggle Section */}
      <View 
        style={{
          backgroundColor: colors.surface,
          borderBottomColor: colors.border,
          borderBottomWidth: 1,
          paddingHorizontal: 24,
          paddingVertical: 20,
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Text style={{ fontSize: 24, marginRight: 8 }}>
            {showQuests ? '🏆' : '💬'}
          </Text>
          <Text 
            style={{ 
              fontSize: 20,
              fontWeight: '900',
              color: colors.text
            }}
          >
            {showQuests ? 'Your Quests' : 'Chat Rooms'}
          </Text>
        </View>
        
        <LinearGradient
          colors={[colors.neon, colors.cyber, colors.electric]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{ 
            borderRadius: 20,
            shadowColor: colors.neon,
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.3,
            shadowRadius: 4,
            elevation: 4,
          }}
        >
          <TouchableOpacity 
            onPress={() => setShowQuests(!showQuests)}
            style={{ 
              flexDirection: 'row',
              alignItems: 'center',
              paddingHorizontal: 16,
              paddingVertical: 12,
            }}
          >
            <Text 
              style={{ 
                color: 'white',
                marginRight: 8,
                fontWeight: '900',
                fontSize: 14,
                letterSpacing: 0.5,
              }}
            >
              {showQuests ? 'Chat Rooms' : 'Quests'}
            </Text>
            <MaterialIcons 
              name={showQuests ? 'chat' : 'emoji-events'} 
              size={20} 
              color="white"
            />
          </TouchableOpacity>
        </LinearGradient>
      </View>
      
      {/* Content Section */}
      <ScrollView 
        style={{ 
          flex: 1,
          backgroundColor: colors.backgroundSecondary,
        }}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ 
          paddingHorizontal: 24,
          paddingVertical: 24,
          paddingBottom: 40
        }}
      >
        {showQuests ? (
          <View>
            <View style={{ 
              flexDirection: 'row', 
              alignItems: 'center', 
              marginBottom: 24,
              backgroundColor: colors.surface,
              padding: 20,
              borderRadius: 20,
              borderWidth: 1,
              borderColor: colors.border + '33',
            }}>
              <View style={{ 
                backgroundColor: colors.neon + '20', 
                padding: 12, 
                borderRadius: 16, 
                marginRight: 16 
              }}>
                <MaterialIcons name="emoji-events" size={24} color={colors.neon} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ 
                  fontSize: 20, 
                  fontWeight: '900', 
                  color: colors.text,
                  marginBottom: 4,
                }}>
                  Level Up Your Journey
                </Text>
                <Text style={{ 
                  color: colors.textSecondary, 
                  fontSize: 14, 
                  fontWeight: '500' 
                }}>
                  Complete quests to earn points and unlock rewards
                </Text>
              </View>
            </View>
            
            {mockQuests.map((quest, index) => renderQuestCard(quest, index))}
          </View>
        ) : (
          <View>
            <View style={{ 
              flexDirection: 'row', 
              alignItems: 'center', 
              marginBottom: 24,
              backgroundColor: colors.surface,
              padding: 20,
              borderRadius: 20,
              borderWidth: 1,
              borderColor: colors.border + '33',
            }}>
              <View style={{ 
                backgroundColor: colors.cyber + '20', 
                padding: 12, 
                borderRadius: 16, 
                marginRight: 16 
              }}>
                <MaterialIcons name="chat" size={24} color={colors.cyber} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ 
                  fontSize: 20, 
                  fontWeight: '900', 
                  color: colors.text,
                  marginBottom: 4,
                }}>
                  Join the Conversation
                </Text>
                <Text style={{ 
                  color: colors.textSecondary, 
                  fontSize: 14, 
                  fontWeight: '500' 
                }}>
                  Connect with travelers around the world
                </Text>
              </View>
            </View>
            
            {chatRoomSummaries.map((room, index) => (
              <View key={room.roomId} style={{ marginBottom: index < chatRoomSummaries.length - 1 ? 16 : 0 }}>
                <ChatRoomCard
                  roomId={room.roomId}
                  name={room.name}
                  lastMessage={room.lastMessage}
                  timestamp={room.timestamp}
                  avatar={room.avatar}
                  unreadCount={room.unreadCount}
                  isOnline={room.isOnline}
                  onPress={handleChatRoomPress}
                  variant="default"
                />
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
