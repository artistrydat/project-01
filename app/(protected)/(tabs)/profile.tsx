import React from 'react';
import { View, Text, ScrollView, SafeAreaView, Image, Pressable } from 'react-native';
import { Stack } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { Header, BudgetOverview, EcoImpactDashboard, EmergencyButton } from '../../../components/ui';
import { useAuth } from '~/context/AuthContext';
import type { BudgetAlert } from '../../../types/profile.types';

// Mock data for user
const mockUser = {
  name: 'Alex Johnson',
  avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
  location: 'Currently in Bali, Indonesia',
  badges: ['Eco Traveler', 'Culture Explorer', 'Adventure Seeker'],
};

// Define the BudgetAlert interface
// Mock data for budget
const mockBudget = {
  total: 2500,
  spent: 1450,
  currency: 'USD',
  alerts: [
    { 
      id: '1', 
      message: 'You\'re under budget for food by $120', 
      type: 'positive' 
    },
    { 
      id: '2', 
      message: 'Transportation costs are 15% over budget', 
      type: 'warning' 
    },
  ] as BudgetAlert[],
};

// Mock data for eco impact
const mockEcoImpact = {
  ecoScore: 87,
  itineraryId: 'itin-2023-bali',
  stats: [
    { label: 'Carbon footprint', value: '2.3 tons CO2', icon: 'eco' },
    { label: 'Sustainable choices', value: '68%', icon: 'thumb-up' },
    { label: 'Local businesses supported', value: '12', icon: 'store' },
  ],
};

export default function ProfileScreen() {
  const { user, signOut, isLoading } = useAuth();
  
  const handleEmergencyPress = () => {
    console.log('Emergency button pressed');
    // Here you would implement emergency contact/services functionality
  };

  const handleLogout = async () => {
    try {
      await signOut();
      // Navigation is handled within the signOut function
    } catch (error) {
      console.error('Logout failed', error);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <Stack.Screen options={{ headerShown: false }} />
      
      <Header title="Profile" subtitle="Manage your travel profile" />
      
      <ScrollView 
        className="flex-1 px-4" 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 30 }}
      >
        {/* User Profile Card */}
        <View className="bg-indigo-600 rounded-xl p-4 mb-6">
          <View className="flex-row items-center">
            <Image
              source={{ uri: user?.avatar || mockUser.avatar }}
              className="w-16 h-16 rounded-full border-2 border-white"
            />
            
            <View className="ml-3 flex-1">
              <Text className="text-white text-xl font-bold">{user?.name || mockUser.name}</Text>
              <Text className="text-indigo-200">{mockUser.location}</Text>
              
              <View className="flex-row flex-wrap mt-2">
                {mockUser.badges.map((badge, index) => (
                  <View 
                    key={index} 
                    className="bg-indigo-800/50 rounded-full px-2 py-1 mr-2 mb-1"
                  >
                    <Text className="text-white text-xs">{badge}</Text>
                  </View>
                ))}
              </View>
            </View>
          </View>
        </View>
        
        {/* Budget Section */}
        <View className="mb-6">
          <Text className="text-lg font-semibold mb-2">Budget Overview</Text>
          <BudgetOverview 
            total={mockBudget.total} 
            spent={mockBudget.spent} 
            alerts={mockBudget.alerts} 
          />
        </View>
        
        {/* Eco Impact Section */}
        <View className="mb-6">
          <Text className="text-lg font-semibold mb-2">Eco Impact</Text>
          <EcoImpactDashboard 
            ecoScore={mockEcoImpact.ecoScore} 
            itineraryId={mockEcoImpact.itineraryId} 
          />
        </View>
        
        {/* Settings Buttons */}
        <View className="space-y-3">
          <Pressable className="flex-row items-center px-4 py-3 bg-gray-100 rounded-xl">
            <MaterialIcons name="settings" size={20} color="#4F46E5" />
            <Text className="text-gray-800 ml-3">Settings</Text>
            <MaterialIcons name="chevron-right" size={20} color="#666" style={{ marginLeft: 'auto' }} />
          </Pressable>
          
          <Pressable className="flex-row items-center px-4 py-3 bg-gray-100 rounded-xl">
            <MaterialIcons name="help-outline" size={20} color="#4F46E5" />
            <Text className="text-gray-800 ml-3">Help & Support</Text>
            <MaterialIcons name="chevron-right" size={20} color="#666" style={{ marginLeft: 'auto' }} />
          </Pressable>
          
          <Pressable 
            className="flex-row items-center px-4 py-3 bg-gray-100 rounded-xl"
            onPress={handleLogout}
            disabled={isLoading}
          >
            <MaterialIcons name="logout" size={20} color="#F43F5E" />
            <Text className="text-red-500 ml-3">{isLoading ? 'Logging out...' : 'Logout'}</Text>
          </Pressable>
        </View>
      </ScrollView>
      
      <View className="absolute bottom-8 right-8">
        <EmergencyButton onPress={handleEmergencyPress} />
      </View>
    </SafeAreaView>
  );
}
