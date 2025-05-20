import React, { useState } from 'react';
import { View, Text, Pressable, Modal, FlatList } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import type { MoodSelectorProps } from '~/types/ui.types';

export default function MoodSelector({ moods, onSelect }: MoodSelectorProps) {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedMood, setSelectedMood] = useState(moods[0]);

  const handleSelect = (mood: string) => {
    setSelectedMood(mood);
    onSelect(mood);
    setIsModalVisible(false);
  };

  return (
    <View>
      <Pressable
        className="flex-row items-center justify-between bg-gray-100 px-4 py-3 rounded-xl"
        onPress={() => setIsModalVisible(true)}
      >
        <View className="flex-row items-center">
          <MaterialIcons name="mood" size={20} color="#555" />
          <Text className="ml-2 text-quaternary font-medium">I&apos;m in the mood for: </Text>
          <Text className="font-bold text-indigo-600">{selectedMood}</Text>
        </View>
        <MaterialIcons name="arrow-drop-down" size={24} color="#555" />
      </Pressable>

      <Modal
        visible={isModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setIsModalVisible(false)}
      >
        <View className="flex-1 justify-end bg-black/50">
          <View className="bg-white rounded-t-2xl p-5">
            <View className="flex-row justify-between items-center mb-4">
              <Text className="text-xl font-bold">Select Your Mood</Text>
              <Pressable onPress={() => setIsModalVisible(false)}>
                <MaterialIcons name="close" size={24} color="#333" />
              </Pressable>
            </View>

            <FlatList
              data={moods}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <Pressable
                  className={`p-3 border-b border-gray-200 flex-row justify-between items-center ${
                    item === selectedMood ? 'bg-indigo-50' : ''
                  }`}
                  onPress={() => handleSelect(item)}
                >
                  <Text className={`${item === selectedMood ? 'text-indigo-600 font-bold' : 'text-gray-700'}`}>
                    {item}
                  </Text>
                  {item === selectedMood && (
                    <MaterialIcons name="check" size={20} color="#4F46E5" />
                  )}
                </Pressable>
              )}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
}
