import React, { useState } from 'react';
import { View, Text, Pressable, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

type ContentTabsSectionProps = {
  itineraries: string[] | undefined;
};

export default function ContentTabsSection({ itineraries }: ContentTabsSectionProps) {
  const [activeTab, setActiveTab] = useState('itineraries');
  
  return (
    <View className="px-4">
      <View className="flex-row border-b border-gray-200 mb-4">
        <Pressable 
          className={`px-4 py-2 ${activeTab === 'itineraries' ? 'border-b-2 border-tertiary' : ''}`}
          onPress={() => setActiveTab('itineraries')}
        >
          <Text className={`${activeTab === 'itineraries' ? 'text-tertiary font-medium' : 'text-gray-500'}`}>
            Itineraries
          </Text>
        </Pressable>
        <Pressable 
          className={`px-4 py-2 ${activeTab === 'photos' ? 'border-b-2 border-tertiary' : ''}`}
          onPress={() => setActiveTab('photos')}
        >
          <Text className={`${activeTab === 'photos' ? 'text-tertiary font-medium' : 'text-gray-500'}`}>
            Photos
          </Text>
        </Pressable>
      </View>
      
      {activeTab === 'itineraries' ? (
        <View className="flex-row flex-wrap">
          {itineraries && itineraries.length > 0 ? (
            itineraries.map((item, index) => (
              <View key={index} style={{ width: '48%', marginRight: index % 2 === 0 ? '4%' : 0, marginBottom: 15 }}>
                <Image 
                  source={{ uri: 'https://images.unsplash.com/photo-1536098561742-ca998e48cbcc' }} 
                  className="w-full h-36 rounded-xl"
                />
                <View className="absolute bottom-0 left-0 right-0 bg-black/50 p-2 rounded-b-xl">
                  <Text className="text-white font-medium">Trip {index + 1}</Text>
                  <Text className="text-white text-xs opacity-80">5 days</Text>
                </View>
              </View>
            ))
          ) : (
            <View className="items-center py-6 w-full">
              <Ionicons name="map-outline" size={48} color="#C6E7E3" />
              <Text className="text-gray-500 mt-2">No itineraries yet</Text>
              <Pressable className="mt-4 bg-primary px-4 py-2 rounded-full">
                <Text className="text-tertiary font-medium">Create Trip</Text>
              </Pressable>
            </View>
          )}
        </View>
      ) : (
        <View className="flex-row flex-wrap">
          {[1,2,3,4,5,6].map((item, index) => (
            <View key={index} style={{ width: '32%', marginRight: index % 3 === 2 ? 0 : '2%', marginBottom: 8 }}>
              <Image 
                source={{ uri: 'https://images.unsplash.com/photo-1536098561742-ca998e48cbcc' }} 
                className="w-full h-24 rounded-md"
              />
            </View>
          ))}
        </View>
      )}
    </View>
  );
}