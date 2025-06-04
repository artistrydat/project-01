import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { ChatRoom, Message, ChatRoomSummary } from '~/types/chat.types';
import { mockChatRooms, mockUsers } from '~/types/chat';

interface ChatState {
  // State
  chatRooms: Record<string, ChatRoom>;
  subscribedRooms: string[];
  currentUserId: string;
  
  // Actions
  getChatRoom: (roomId: string) => ChatRoom | undefined;
  getChatRoomSummaries: () => ChatRoomSummary[];
  addMessage: (roomId: string, text: string) => void;
  likeMessage: (roomId: string, messageId: string) => void;
  dislikeMessage: (roomId: string, messageId: string) => void;
  subscribeToRoom: (roomId: string) => void;
  unsubscribeFromRoom: (roomId: string) => void;
  markRoomAsRead: (roomId: string) => void;
  updateUnreadCount: (roomId: string, count: number) => void;
}

export const useChatStore = create<ChatState>()(
  devtools(
    (set, get) => ({
      // Initial state
      chatRooms: mockChatRooms,
      subscribedRooms: ['1', '3'], // Initially subscribed to Bali and Paris
      currentUserId: 'me',

      // Get a specific chat room
      getChatRoom: (roomId: string) => {
        return get().chatRooms[roomId];
      },

      // Get chat room summaries for the community list
      getChatRoomSummaries: () => {
        const { chatRooms } = get();
        return Object.values(chatRooms).map((room): ChatRoomSummary => ({
          roomId: room.roomId,
          name: room.name,
          lastMessage: room.lastMessage,
          timestamp: room.lastMessageTime,
          avatar: room.avatar,
          unreadCount: room.unreadCount,
          isOnline: room.isOnline,
          participants: room.participants,
          location: room.location,
          category: room.category,
        }));
      },

      // Add a new message to a chat room
      addMessage: (roomId: string, text: string) => {
        const { chatRooms, currentUserId } = get();
        const room = chatRooms[roomId];
        
        if (!room) return;

        const newMessage: Message = {
          id: `m${Date.now()}`,
          user: mockUsers[currentUserId],
          text: text.trim(),
          timestamp: new Date().toLocaleTimeString([], { 
            hour: '2-digit', 
            minute: '2-digit' 
          }),
          date: 'Today',
          likes: 0,
          dislikes: 0,
          likedBy: [],
          dislikedBy: [],
        };

        set((state) => ({
          chatRooms: {
            ...state.chatRooms,
            [roomId]: {
              ...room,
              messages: [...room.messages, newMessage],
              lastMessage: text.length > 50 ? `${text.slice(0, 50)}...` : text,
              lastMessageTime: newMessage.timestamp,
            },
          },
        }));
      },

      // Like a message
      likeMessage: (roomId: string, messageId: string) => {
        const { chatRooms, currentUserId } = get();
        const room = chatRooms[roomId];
        
        if (!room) return;

        set((state) => ({
          chatRooms: {
            ...state.chatRooms,
            [roomId]: {
              ...room,
              messages: room.messages.map((message) => {
                if (message.id === messageId) {
                  const hasLiked = message.likedBy.includes(currentUserId);
                  const hasDisliked = message.dislikedBy.includes(currentUserId);
                  
                  let newLikedBy = [...message.likedBy];
                  let newDislikedBy = [...message.dislikedBy];
                  let newLikes = message.likes;
                  let newDislikes = message.dislikes;

                  if (hasLiked) {
                    // Remove like
                    newLikedBy = newLikedBy.filter(id => id !== currentUserId);
                    newLikes -= 1;
                  } else {
                    // Add like
                    newLikedBy.push(currentUserId);
                    newLikes += 1;
                    
                    // Remove dislike if it exists
                    if (hasDisliked) {
                      newDislikedBy = newDislikedBy.filter(id => id !== currentUserId);
                      newDislikes -= 1;
                    }
                  }

                  return {
                    ...message,
                    likes: newLikes,
                    dislikes: newDislikes,
                    likedBy: newLikedBy,
                    dislikedBy: newDislikedBy,
                  };
                }
                return message;
              }),
            },
          },
        }));
      },

      // Dislike a message
      dislikeMessage: (roomId: string, messageId: string) => {
        const { chatRooms, currentUserId } = get();
        const room = chatRooms[roomId];
        
        if (!room) return;

        set((state) => ({
          chatRooms: {
            ...state.chatRooms,
            [roomId]: {
              ...room,
              messages: room.messages.map((message) => {
                if (message.id === messageId) {
                  const hasLiked = message.likedBy.includes(currentUserId);
                  const hasDisliked = message.dislikedBy.includes(currentUserId);
                  
                  let newLikedBy = [...message.likedBy];
                  let newDislikedBy = [...message.dislikedBy];
                  let newLikes = message.likes;
                  let newDislikes = message.dislikes;

                  if (hasDisliked) {
                    // Remove dislike
                    newDislikedBy = newDislikedBy.filter(id => id !== currentUserId);
                    newDislikes -= 1;
                  } else {
                    // Add dislike
                    newDislikedBy.push(currentUserId);
                    newDislikes += 1;
                    
                    // Remove like if it exists
                    if (hasLiked) {
                      newLikedBy = newLikedBy.filter(id => id !== currentUserId);
                      newLikes -= 1;
                    }
                  }

                  return {
                    ...message,
                    likes: newLikes,
                    dislikes: newDislikes,
                    likedBy: newLikedBy,
                    dislikedBy: newDislikedBy,
                  };
                }
                return message;
              }),
            },
          },
        }));
      },

      // Subscribe to a chat room
      subscribeToRoom: (roomId: string) => {
        set((state) => {
          const isAlreadySubscribed = state.subscribedRooms.includes(roomId);
          if (isAlreadySubscribed) return state;

          return {
            subscribedRooms: [...state.subscribedRooms, roomId],
            chatRooms: {
              ...state.chatRooms,
              [roomId]: {
                ...state.chatRooms[roomId],
                isSubscribed: true,
              },
            },
          };
        });
      },

      // Unsubscribe from a chat room
      unsubscribeFromRoom: (roomId: string) => {
        set((state) => ({
          subscribedRooms: state.subscribedRooms.filter(id => id !== roomId),
          chatRooms: {
            ...state.chatRooms,
            [roomId]: {
              ...state.chatRooms[roomId],
              isSubscribed: false,
            },
          },
        }));
      },

      // Mark room as read (reset unread count)
      markRoomAsRead: (roomId: string) => {
        set((state) => ({
          chatRooms: {
            ...state.chatRooms,
            [roomId]: {
              ...state.chatRooms[roomId],
              unreadCount: 0,
            },
          },
        }));
      },

      // Update unread count
      updateUnreadCount: (roomId: string, count: number) => {
        set((state) => ({
          chatRooms: {
            ...state.chatRooms,
            [roomId]: {
              ...state.chatRooms[roomId],
              unreadCount: Math.max(0, count),
            },
          },
        }));
      },
    }),
    {
      name: 'chat-store',
    }
  )
);