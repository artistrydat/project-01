import React from 'react';
import { View, Text, Image } from 'react-native';
import { useTheme } from '~/contexts/ThemeContext';
import { Card } from './Card';

interface ChatRoomCardProps {
  chatRoom?: {
    id: string;
    name: string;
    lastMessage?: string;
    timestamp?: string;
    avatar?: string;
    unreadCount?: number;
    isOnline?: boolean;
  };
  // Support both chatRoom object and direct props
  roomId?: string;
  name?: string;
  lastMessage?: string;
  timestamp?: string;
  avatar?: string;
  unreadCount?: number;
  isOnline?: boolean;
  onPress: (chatRoomId: string) => void;
  variant?: 'default' | 'cyber' | 'glass';
}

export const ChatRoomCard: React.FC<ChatRoomCardProps> = ({
  chatRoom,
  roomId,
  name,
  lastMessage,
  timestamp,
  avatar,
  unreadCount,
  isOnline,
  onPress,
  variant = 'default',
}) => {
  const { colors } = useTheme();

  // Use chatRoom object if provided, otherwise use individual props
  const roomData = chatRoom || {
    id: roomId || '',
    name: name || '',
    lastMessage,
    timestamp,
    avatar,
    unreadCount,
    isOnline,
  };

  return (
    <Card 
      variant={variant === 'cyber' ? 'cyber' : variant === 'glass' ? 'glass' : 'default'}
      onPress={() => onPress(roomData.id)}
      size="md"
    >
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        {/* Avatar */}
        <View style={{ position: 'relative', marginRight: 16 }}>
          <Image 
            source={{ uri: roomData.avatar || 'https://via.placeholder.com/50' }}
            style={{ 
              width: 48, 
              height: 48, 
              borderRadius: 24 
            }}
          />
          {roomData.isOnline && (
            <View 
              style={{
                position: 'absolute',
                bottom: -4,
                right: -4,
                width: 16,
                height: 16,
                borderRadius: 8,
                borderWidth: 2,
                backgroundColor: colors.cyber,
                borderColor: colors.background 
              }}
            />
          )}
        </View>

        {/* Content */}
        <View style={{ flex: 1 }}>
          <View style={{ 
            flexDirection: 'row', 
            alignItems: 'center', 
            justifyContent: 'space-between', 
            marginBottom: 4 
          }}>
            <Text style={{
              fontSize: 18,
              fontWeight: '600',
              color: colors.text
            }}>
              {roomData.name}
            </Text>
            {roomData.timestamp && (
              <Text style={{
                fontSize: 12,
                color: colors.textTertiary
              }}>
                {roomData.timestamp}
              </Text>
            )}
          </View>
          
          {roomData.lastMessage && (
            <Text 
              style={{
                fontSize: 14,
                color: colors.textSecondary
              }}
              numberOfLines={1}
            >
              {roomData.lastMessage}
            </Text>
          )}
        </View>

        {/* Unread Badge */}
        {roomData.unreadCount && roomData.unreadCount > 0 && (
          <View 
            style={{
              marginLeft: 12,
              paddingHorizontal: 8,
              paddingVertical: 4,
              borderRadius: 12,
              minWidth: 20,
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: variant === 'cyber' ? colors.cyber : colors.primary
            }}
          >
            <Text style={{
              color: colors.textInverse,
              fontSize: 12,
              fontWeight: 'bold'
            }}>
              {roomData.unreadCount > 99 ? '99+' : roomData.unreadCount.toString()}
            </Text>
          </View>
        )}
      </View>
    </Card>
  );
};
