import React, { useState } from 'react';
import { View, Text, ScrollView, SafeAreaView, Pressable } from 'react-native';
import { Stack } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { Header, ChatRoomCard, QuestCard, ChatInput } from '../../../components/ui';

// Mock data for chat rooms
const mockChatRooms = [
  {
    roomId: '1',
    name: 'Bali Travelers',
    lastMessage: 'Has anyone visited the rice terraces?',
    timestamp: '10:45 AM',
  },
  {
    roomId: '2',
    name: 'Tokyo Adventures',
    lastMessage: 'The cherry blossoms are beautiful this time of year!',
    timestamp: 'Yesterday',
  },
  {
    roomId: '3',
    name: 'Paris Explorers',
    lastMessage: 'I found this amazing little café near the Eiffel Tower',
    timestamp: '2 days ago',
  },
  {
    roomId: '4',
    name: 'NYC Foodies',
    lastMessage: 'Best pizza in Brooklyn is definitely at...',
    timestamp: '3 days ago',
  },
];

// Mock data for quests
const mockQuests = [
  {
    id: '1',
    title: 'Local Expert',
    description: 'Answer 5 questions in a local chat room',
    points: 50,
    completed: false,
  },
  {
    id: '2',
    title: 'Photo Expedition',
    description: 'Share 3 photos from your trip',
    points: 30,
    completed: true,
  },
  {
    id: '3',
    title: 'Cultural Connection',
    description: 'Join a local event through the app',
    points: 100,
    completed: false,
  },
];

export default function CommunityScreen() {
  const [showQuests, setShowQuests] = useState(false);

  const handleSendMessage = (message: string) => {
    console.log('Sending message:', message);
    // Here you would implement message sending functionality
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <Stack.Screen options={{ headerShown: false }} />
      
      <Header title="Community" subtitle="Connect with fellow travelers" />
      
      <View className="flex-row justify-between items-center px-4 py-2">
        <Text className="text-lg font-semibold">
          {showQuests ? 'Your Quests' : 'Nearby Chat Rooms'}
        </Text>
        <Pressable 
          className="flex-row items-center" 
          onPress={() => setShowQuests(!showQuests)}
        >
          <Text className="text-indigo-600 mr-1">
            {showQuests ? 'See Chat Rooms' : 'See Quests'}
          </Text>
          <MaterialIcons 
            name={showQuests ? 'chat' : 'emoji-events'} 
            size={20} 
            color="#4F46E5" 
          />
        </Pressable>
      </View>
      
      <ScrollView 
        className="flex-1 px-4" 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 70 }}
      >
        {showQuests ? (
          <View className="space-y-4 mt-2">
            {mockQuests.map((quest) => (
              <QuestCard
                key={quest.id}
                title={quest.title}
                description={quest.description}
                points={quest.points}
                completed={quest.completed}
              />
            ))}
          </View>
        ) : (
          <View className="space-y-4 mt-2">
            {mockChatRooms.map((room) => (
              <ChatRoomCard
                key={room.roomId}
                roomId={room.roomId}
                name={room.name}
                lastMessage={room.lastMessage}
                timestamp={room.timestamp}
              />
            ))}
          </View>
        )}
      </ScrollView>
      
      {!showQuests && (
        <View className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-200">
          <ChatInput onSend={handleSendMessage} />
        </View>
      )}
    </SafeAreaView>
  );
}
