import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, SafeAreaView, TouchableOpacity } from 'react-native';
import { Stack, router } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { ChatRoomCard, QuestCard } from '~/components/ui';
import { useTheme } from '~/contexts/ThemeContext';
import { useChatStore } from '~/store/chatStore';
import { useQuestStore } from '~/store/questStore';
import { useAuthStore } from '~/contexts/AuthContext';

export default function CommunityScreen() {
  const [showQuests, setShowQuests] = useState(false);
  const { colors, isDark } = useTheme();
  const { getChatRoomSummaries, markRoomAsRead } = useChatStore();
  const { 
    quests, 
    initializeQuests,
    initializeUserProgress,
    getUserQuests,
    getUserPoints,
    getCompletedQuestsCount,
    calculateUserLevel
  } = useQuestStore();
  const authUser = useAuthStore(state => state.user);

  // Initialize quests and user progress
  useEffect(() => {
    initializeQuests();
    if (authUser?.id) {
      initializeUserProgress(authUser.id);
    }
  }, [initializeQuests, initializeUserProgress, authUser?.id]);

  const chatRoomSummaries = getChatRoomSummaries();
  const userQuests = authUser?.id ? getUserQuests(authUser.id) : [];
  const userPoints = authUser?.id ? getUserPoints(authUser.id) : 0;
  const completedQuestsCount = authUser?.id ? getCompletedQuestsCount(authUser.id) : 0;
  const userLevel = authUser?.id ? calculateUserLevel(authUser.id) : 1;

  const handleChatRoomPress = (chatRoomId: string) => {
    markRoomAsRead(chatRoomId);
    router.push(`/(protected)/chat-room/${chatRoomId}`);
  };

  const handleQuestPress = (questId: string) => {
    console.log(`[Community] Quest pressed: ${questId}`);
    // You can navigate to a detailed quest view or handle quest interaction
  };

  const renderStatsCard = () => (
    <View style={{ 
      flexDirection: 'row', 
      backgroundColor: colors.surface,
      padding: 20,
      borderRadius: 20,
      marginBottom: 24,
      borderWidth: 1,
      borderColor: colors.border + '33',
      shadowColor: colors.shadow,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 3,
    }}>
      <View style={{ 
        backgroundColor: colors.neon + '20', 
        padding: 12, 
        borderRadius: 16, 
        marginRight: 16 
      }}>
        <MaterialIcons 
          name={showQuests ? "emoji-events" : "chat"} 
          size={24} 
          color={showQuests ? colors.neon : colors.cyber} 
        />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={{ 
          fontSize: 20, 
          fontWeight: '900', 
          color: colors.text,
          marginBottom: 4,
        }}>
          {showQuests ? 'Level Up Your Journey' : 'Join the Conversation'}
        </Text>
        <Text style={{ 
          color: colors.textSecondary, 
          fontSize: 14, 
          fontWeight: '500' 
        }}>
          {showQuests 
            ? `Level ${userLevel} • ${userPoints} points • ${completedQuestsCount}/${quests.length} completed`
            : 'Connect with travelers around the world'
          }
        </Text>
      </View>
      {showQuests && (
        <View style={{ alignItems: 'center', justifyContent: 'center' }}>
          <LinearGradient
            colors={[colors.neon, colors.cyber]}
            style={{
              paddingHorizontal: 12,
              paddingVertical: 8,
              borderRadius: 12,
            }}
          >
            <Text style={{
              color: 'white',
              fontSize: 16,
              fontWeight: '900',
            }}>
              {userPoints}
            </Text>
          </LinearGradient>
          <Text style={{
            color: colors.textTertiary,
            fontSize: 12,
            fontWeight: '600',
            marginTop: 4,
          }}>
            POINTS
          </Text>
        </View>
      )}
    </View>
  );

  const renderQuestSection = () => {
    const questsWithProgress = quests.map(quest => {
      const progress = userQuests.find(uq => uq.questId === quest.id);
      return {
        quest,
        progress: progress || {
          questId: quest.id,
          currentProgress: 0,
          maxProgress: quest.total,
          isCompleted: false,
        }
      };
    });

    // Sort quests: active first, then completed
    questsWithProgress.sort((a, b) => {
      if (a.progress.isCompleted && !b.progress.isCompleted) return 1;
      if (!a.progress.isCompleted && b.progress.isCompleted) return -1;
      return 0;
    });

    return (
      <View>
        {questsWithProgress.map(({ quest, progress }) => (
          <QuestCard
            key={quest.id}
            quest={quest}
            questProgress={progress}
            onPress={handleQuestPress}
            variant="default"
          />
        ))}
        
        {questsWithProgress.length === 0 && (
          <View style={{
            backgroundColor: colors.surface,
            padding: 40,
            borderRadius: 20,
            alignItems: 'center',
            borderWidth: 1,
            borderColor: colors.border + '33',
          }}>
            <Text style={{ fontSize: 48, marginBottom: 12 }}>🏆</Text>
            <Text style={{
              fontSize: 20,
              fontWeight: '900',
              color: colors.text,
              marginBottom: 8,
              textAlign: 'center',
            }}>
              No Quests Available
            </Text>
            <Text style={{
              color: colors.textSecondary,
              fontSize: 14,
              textAlign: 'center',
            }}>
              Check back later for new adventures!
            </Text>
          </View>
        )}
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
        {renderStatsCard()}
        
        {showQuests ? (
          renderQuestSection()
        ) : (
          <View>
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
            
            {chatRoomSummaries.length === 0 && (
              <View style={{
                backgroundColor: colors.surface,
                padding: 40,
                borderRadius: 20,
                alignItems: 'center',
                borderWidth: 1,
                borderColor: colors.border + '33',
              }}>
                <Text style={{ fontSize: 48, marginBottom: 12 }}>💬</Text>
                <Text style={{
                  fontSize: 20,
                  fontWeight: '900',
                  color: colors.text,
                  marginBottom: 8,
                  textAlign: 'center',
                }}>
                  No Active Chats
                </Text>
                <Text style={{
                  color: colors.textSecondary,
                  fontSize: 14,
                  textAlign: 'center',
                }}>
                  Start a conversation with fellow travelers!
                </Text>
              </View>
            )}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
