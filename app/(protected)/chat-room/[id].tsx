import React, { useState } from 'react';
import { View, Text, SafeAreaView, FlatList, Image, Pressable } from 'react-native';
import { Stack, useLocalSearchParams, router } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { ChatInput } from '~/components/ui';

// Mock chat room data - in a real app, this would be fetched based on ID
const mockChatRooms = {
  '1': {
    roomId: '1',
    name: 'Bali Travelers',
    participants: 124,
    location: 'Bali, Indonesia',
    messages: [
      {
        id: 'm1',
        user: {
          id: 'u1',
          name: 'Sarah Chen',
          avatar: 'https://randomuser.me/api/portraits/women/32.jpg',
        },
        text: 'Has anyone visited the rice terraces? Worth the trip?',
        timestamp: '10:45 AM',
        date: 'Today',
      },
      {
        id: 'm2',
        user: {
          id: 'u2',
          name: 'Mike Johnson',
          avatar: 'https://randomuser.me/api/portraits/men/44.jpg',
        },
        text: 'Absolutely! Tegalalang rice terraces are stunning. Go early morning to avoid crowds. The light is perfect for photos too.',
        timestamp: '10:48 AM',
        date: 'Today',
      },
      {
        id: 'm3',
        user: {
          id: 'u3',
          name: 'Emma Rodriguez',
          avatar: 'https://randomuser.me/api/portraits/women/63.jpg',
        },
        text: 'I agree with Mike. Also consider visiting Jatiluwih rice terraces if you want something less touristy. It\'s a bit farther but worth it.',
        timestamp: '10:52 AM',
        date: 'Today',
      },
      {
        id: 'm4',
        user: {
          id: 'u1',
          name: 'Sarah Chen',
          avatar: 'https://randomuser.me/api/portraits/women/32.jpg',
        },
        text: 'Thanks for the tips! Any food recommendations nearby?',
        timestamp: '10:55 AM',
        date: 'Today',
      },
      {
        id: 'm5',
        user: {
          id: 'u4',
          name: 'David Kim',
          avatar: 'https://randomuser.me/api/portraits/men/22.jpg',
        },
        text: 'There\'s a small warung (local restaurant) at the entrance of Tegalalang that serves amazing Nasi Campur. Can\'t remember the name but you can\'t miss it!',
        timestamp: '11:02 AM',
        date: 'Today',
      },
      {
        id: 'm6',
        user: {
          id: 'u2',
          name: 'Mike Johnson',
          avatar: 'https://randomuser.me/api/portraits/men/44.jpg',
        },
        text: 'Also, don\'t forget to bring cash for the entrance fee and small donations at different viewpoints.',
        timestamp: '11:10 AM',
        date: 'Today',
      },
    ],
  },
  '2': {
    roomId: '2',
    name: 'Tokyo Adventures',
    participants: 98,
    location: 'Tokyo, Japan',
    messages: [
      {
        id: 'm1',
        user: {
          id: 'u5',
          name: 'Alex Thompson',
          avatar: 'https://randomuser.me/api/portraits/men/67.jpg',
        },
        text: 'The cherry blossoms are beautiful this time of year!',
        timestamp: '3:22 PM',
        date: 'Yesterday',
      },
      {
        id: 'm2',
        user: {
          id: 'u6',
          name: 'Yuki Tanaka',
          avatar: 'https://randomuser.me/api/portraits/women/91.jpg',
        },
        text: 'Yes! Ueno Park and Shinjuku Gyoen are my favorite spots for hanami (cherry blossom viewing).',
        timestamp: '3:30 PM',
        date: 'Yesterday',
      },
    ],
  },
};

// Define the type for a message
interface Message {
  id: string;
  user: {
    id: string;
    name: string;
    avatar: string;
  };
  text: string;
  timestamp: string;
  date: string;
}

export default function ChatRoomDetails() {
  const { id } = useLocalSearchParams();
  const roomId = Array.isArray(id) ? id[0] : id;
  const [messages, setMessages] = useState(
    mockChatRooms[roomId as keyof typeof mockChatRooms]?.messages || []
  );
  
  // Get chat room data based on ID
  const chatRoom = mockChatRooms[roomId as keyof typeof mockChatRooms];
  
  // Handle missing chat room
  if (!chatRoom) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center">
        <Text className="text-xl">Chat room not found</Text>
        <Pressable 
          className="mt-4 bg-indigo-600 px-4 py-2 rounded-lg"
          onPress={() => router.back()}
        >
          <Text className="text-white font-medium">Go Back</Text>
        </Pressable>
      </SafeAreaView>
    );
  }

  const handleSendMessage = (text: string) => {
    const newMessage = {
      id: `m${messages.length + 1}`,
      user: {
        id: 'me',
        name: 'You',
        avatar: 'https://randomuser.me/api/portraits/women/68.jpg',
      },
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      date: 'Today',
    };
    
    setMessages([...messages, newMessage]);
  };

  // Render a message item
  const renderMessage = ({ item, index }: { item: Message; index: number }) => {
    const isCurrentUser = item.user.id === 'me';
    const showAvatar = index === 0 || messages[index - 1].user.id !== item.user.id;
    
    return (
      <View className={`flex-row mb-3 ${isCurrentUser ? 'justify-end' : 'justify-start'}`}>
        {!isCurrentUser && showAvatar && (
          <Image
            source={{ uri: item.user.avatar }}
            className="w-8 h-8 rounded-full mr-2 mt-1"
          />
        )}
        
        {!isCurrentUser && !showAvatar && <View className="w-8 mr-2" />}
        
        <View className="max-w-[80%]">
          {showAvatar && !isCurrentUser && (
            <Text className="text-xs text-gray-600 mb-1">{item.user.name}</Text>
          )}
          
          <View
            className={`p-3 rounded-2xl ${
              isCurrentUser ? 'bg-primary rounded-tr-none' : 'bg-secondary rounded-tl-none'
            }`}
          >
            <Text className={isCurrentUser ? 'text-quinary' : 'text-tertiary'}>
              {item.text}
            </Text>
          </View>
          
          <Text className="text-xs text-quaternary mt-1 text-right">
            {item.timestamp}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-quinary">
      <Stack.Screen options={{ headerShown: false }} />
      
      {/* Header */}
      <View className="border-b border-primary px-4 py-2 bg-quinary">
        <View className="flex-row items-center">
          <Pressable 
            className="mr-2 p-1" 
            onPress={() => router.back()}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <MaterialIcons name="arrow-back" size={24} color="#1E493B" />
          </Pressable>
          
          <View className="flex-1">
            <Text className="text-lg font-bold text-tertiary">{chatRoom.name}</Text>
            <View className="flex-row items-center">
              <MaterialIcons name="people" size={14} color="#1E493B" />
              <Text className="text-xs text-quaternary ml-1">{chatRoom.participants} travelers</Text>
              <Text className="text-xs text-quaternary mx-1">•</Text>
              <Text className="text-xs text-quaternary">{chatRoom.location}</Text>
            </View>
          </View>
          
          <Pressable className="p-2">
            <MaterialIcons name="more-vert" size={24} color="#1E493B" />
          </Pressable>
        </View>
      </View>
      
      {/* Chat Messages */}
      <FlatList
        data={messages}
        renderItem={renderMessage}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 16 }}
        inverted={false}
        showsVerticalScrollIndicator={false}
      />
      
      {/* Chat Input */}
      <View className="border-t border-primary bg-quinary">
        <ChatInput onSend={handleSendMessage} />
      </View>
    </SafeAreaView>
  );
}
