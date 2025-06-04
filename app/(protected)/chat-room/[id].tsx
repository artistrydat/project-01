import React, { useEffect } from 'react';
import { View, Text, SafeAreaView, FlatList, Image, Pressable } from 'react-native';
import { Stack, useLocalSearchParams, router } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { ChatInput } from '~/components/ui';
import { useTheme } from '~/contexts/ThemeContext';
import { useChatStore } from '~/store/chatStore';
import { Message } from '~/types/chat.types';

export default function ChatRoomDetails() {
  const { colors } = useTheme();
  const { id } = useLocalSearchParams();
  const roomId = Array.isArray(id) ? id[0] : id;
  
  const { 
    getChatRoom, 
    addMessage, 
    likeMessage, 
    dislikeMessage, 
    subscribeToRoom, 
    unsubscribeFromRoom,
    markRoomAsRead,
    currentUserId 
  } = useChatStore();
  
  const chatRoom = getChatRoom(roomId);

  // Mark room as read when entering
  useEffect(() => {
    if (roomId) {
      markRoomAsRead(roomId);
    }
  }, [roomId, markRoomAsRead]);
  
  // Handle missing chat room
  if (!chatRoom) {
    return (
      <SafeAreaView style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.background }}>
        <Text style={{ fontSize: 20, color: colors.text }}>
          <Text>Chat room not found</Text>
        </Text>
        <Pressable 
          style={{ 
            marginTop: 16, 
            backgroundColor: colors.primary, 
            paddingHorizontal: 16, 
            paddingVertical: 8, 
            borderRadius: 8 
          }}
          onPress={() => router.back()}
        >
          <Text style={{ color: colors.textInverse, fontWeight: '500' }}>
            <Text>Go Back</Text>
          </Text>
        </Pressable>
      </SafeAreaView>
    );
  }

  const handleSendMessage = (text: string) => {
    addMessage(roomId, text);
  };

  const handleSubscribeToggle = () => {
    if (chatRoom.isSubscribed) {
      unsubscribeFromRoom(roomId);
    } else {
      subscribeToRoom(roomId);
    }
  };

  const handleLikeMessage = (messageId: string) => {
    likeMessage(roomId, messageId);
  };

  const handleDislikeMessage = (messageId: string) => {
    dislikeMessage(roomId, messageId);
  };

  // Render a message item with themed styling and like/dislike buttons
  const renderMessage = ({ item, index }: { item: Message; index: number }) => {
    const isCurrentUser = item.user.id === currentUserId;
    const showAvatar = index === 0 || chatRoom.messages[index - 1].user.id !== item.user.id;
    const hasLiked = item.likedBy.includes(currentUserId);
    const hasDisliked = item.dislikedBy.includes(currentUserId);
    
    return (
      <View style={{ 
        flexDirection: 'row', 
        marginBottom: 16, 
        justifyContent: isCurrentUser ? 'flex-end' : 'flex-start' 
      }}>
        {!isCurrentUser && showAvatar && (
          <Image
            source={{ uri: item.user.avatar }}
            style={{
              width: 40,
              height: 40,
              borderRadius: 16,
              marginRight: 12,
              marginTop: 4,
              borderWidth: 2,
              borderColor: colors.border,
            }}
          />
        )}
        
        {!isCurrentUser && !showAvatar && <View style={{ width: 40, marginRight: 12 }} />}
        
        <View style={{ maxWidth: '75%' }}>
          {showAvatar && !isCurrentUser && (
            <Text style={{ 
              fontSize: 14, 
              color: colors.textSecondary, 
              marginBottom: 8, 
              fontWeight: '600', 
              marginLeft: 4 
            }}>
              <Text>{item.user.name}</Text>
            </Text>
          )}
          
          <View
            style={{
              padding: 16,
              borderRadius: 24,
              shadowColor: colors.shadow,
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.1,
              shadowRadius: 4,
              elevation: 4,
              backgroundColor: isCurrentUser ? colors.cyber : colors.surface,
              borderTopRightRadius: isCurrentUser ? 8 : 24,
              borderTopLeftRadius: isCurrentUser ? 24 : 8,
            }}
          >
            <Text style={{
              color: isCurrentUser ? colors.textInverse : colors.text,
              fontSize: 16,
              fontWeight: '500',
              lineHeight: 22,
            }}>
              <Text>{item.text}</Text>
            </Text>
          </View>
          
          {/* Like/Dislike and Timestamp */}
          <View style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: isCurrentUser ? 'flex-end' : 'flex-start',
            marginTop: 8,
          }}>
            {!isCurrentUser && (
              <View style={{ flexDirection: 'row', alignItems: 'center', marginRight: 12 }}>
                <Pressable
                  onPress={() => handleLikeMessage(item.id)}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    padding: 4,
                    borderRadius: 12,
                    backgroundColor: hasLiked ? colors.success + '20' : 'transparent',
                  }}
                >
                  <MaterialIcons 
                    name="thumb-up" 
                    size={16} 
                    color={hasLiked ? colors.success : colors.textTertiary} 
                  />
                  {item.likes > 0 && (
                    <Text style={{
                      marginLeft: 4,
                      fontSize: 12,
                      color: hasLiked ? colors.success : colors.textTertiary,
                      fontWeight: '600',
                    }}>
                      <Text>{item.likes}</Text>
                    </Text>
                  )}
                </Pressable>
                
                <Pressable
                  onPress={() => handleDislikeMessage(item.id)}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    padding: 4,
                    marginLeft: 8,
                    borderRadius: 12,
                    backgroundColor: hasDisliked ? colors.error + '20' : 'transparent',
                  }}
                >
                  <MaterialIcons 
                    name="thumb-down" 
                    size={16} 
                    color={hasDisliked ? colors.error : colors.textTertiary} 
                  />
                  {item.dislikes > 0 && (
                    <Text style={{
                      marginLeft: 4,
                      fontSize: 12,
                      color: hasDisliked ? colors.error : colors.textTertiary,
                      fontWeight: '600',
                    }}>
                      <Text>{item.dislikes}</Text>
                    </Text>
                  )}
                </Pressable>
              </View>
            )}
            
            <Text style={{
              fontSize: 12,
              color: colors.textTertiary,
              fontWeight: '500',
            }}>
              <Text>{item.timestamp}</Text>
            </Text>
          </View>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <Stack.Screen options={{ headerShown: false }} />
      
      {/* Enhanced Header */}
      <View style={{
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
        paddingHorizontal: 20,
        paddingVertical: 16,
        backgroundColor: colors.surface,
        shadowColor: colors.shadow,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
        elevation: 4,
      }}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          {/* Back Button */}
          <Pressable 
            style={{
              marginRight: 16,
              width: 44,
              height: 44,
              backgroundColor: colors.cyber,
              borderRadius: 22,
              alignItems: 'center',
              justifyContent: 'center',
              shadowColor: colors.cyber,
              shadowOffset: { width: 0, height: 3 },
              shadowOpacity: 0.3,
              shadowRadius: 6,
              elevation: 6,
            }}
            onPress={() => router.back()}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <MaterialIcons name="arrow-back" size={22} color={colors.textInverse} />
          </Pressable>
          
          {/* Room Info */}
          <View style={{ flex: 1, marginRight: 12 }}>
            <Text style={{ 
              fontSize: 22, 
              fontWeight: '800', 
              color: colors.text,
              letterSpacing: -0.5,
            }}>
              <Text>{chatRoom.name}</Text>
            </Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 2 }}>
              <View style={{
                flexDirection: 'row',
                alignItems: 'center',
                backgroundColor: colors.cyber + '15',
                paddingHorizontal: 8,
                paddingVertical: 3,
                borderRadius: 12,
                marginRight: 8,
              }}>
                <MaterialIcons 
                  name="people" 
                  size={14} 
                  color={colors.cyber} 
                  style={{ marginRight: 4 }}
                />
                <Text style={{ 
                  fontSize: 13, 
                  color: colors.cyber, 
                  fontWeight: '700' 
                }}>
                  <Text>{chatRoom.participants}</Text>
                </Text>
              </View>
              <View style={{
                flexDirection: 'row',
                alignItems: 'center',
                backgroundColor: colors.textTertiary + '15',
                paddingHorizontal: 8,
                paddingVertical: 3,
                borderRadius: 12,
              }}>
                <MaterialIcons 
                  name="location-on" 
                  size={14} 
                  color={colors.textSecondary} 
                  style={{ marginRight: 4 }}
                />
                <Text style={{ 
                  fontSize: 13, 
                  color: colors.textSecondary, 
                  fontWeight: '600' 
                }}>
                  <Text>{chatRoom.location}</Text>
                </Text>
              </View>
            </View>
          </View>
          
          {/* Action Buttons */}
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            {/* Notification Toggle */}
            <Pressable 
              onPress={handleSubscribeToggle}
              style={{
                width: 44,
                height: 44,
                backgroundColor: chatRoom.isSubscribed ? colors.success : colors.textTertiary + '20',
                borderRadius: 22,
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: 8,
                shadowColor: chatRoom.isSubscribed ? colors.success : colors.shadow,
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: chatRoom.isSubscribed ? 0.3 : 0.1,
                shadowRadius: 4,
                elevation: 3,
              }}
            >
              <MaterialIcons 
                name={chatRoom.isSubscribed ? "notifications-active" : "notifications-off"} 
                size={20} 
                color={chatRoom.isSubscribed ? colors.textInverse : colors.textSecondary} 
              />
            </Pressable>
          </View>
        </View>
      </View>
      
      {/* Chat Messages */}
      <FlatList
        data={chatRoom.messages}
        renderItem={renderMessage}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 20, paddingBottom: 32 }}
        showsVerticalScrollIndicator={false}
        style={{ flex: 1 }}
      />
      
      {/* Chat Input */}
      <View style={{
        borderTopWidth: 1,
        borderTopColor: colors.border,
        backgroundColor: colors.surface,
        paddingHorizontal: 16,
        paddingVertical: 12,
        shadowColor: colors.shadow,
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 8,
      }}>
        <ChatInput onSend={handleSendMessage} />
      </View>
    </SafeAreaView>
  );
}
