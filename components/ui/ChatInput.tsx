import React, { useState } from 'react';
import { View, TextInput, Pressable } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import type { ChatInputProps } from '../../types/ui.types';

export default function ChatInput({ onSend }: ChatInputProps) {
  const [message, setMessage] = useState('');

  const handleSend = () => {
    if (message.trim()) {
      onSend(message.trim());
      setMessage('');
    }
  };

  return (
    <View className="flex-row items-center px-4 py-2">
      <Pressable className="mr-2">
        <MaterialIcons name="photo-camera" size={24} color="#1E493B" />
      </Pressable>
      
      <View className="flex-1 bg-primary rounded-full px-4 py-2 flex-row items-center">
        <TextInput
          className="flex-1 text-tertiary"
          placeholder="Type a message..."
          value={message}
          onChangeText={setMessage}
          multiline
          maxLength={500}
        />
        
        <Pressable className="ml-2">
          <MaterialIcons name="mic" size={24} color="#1E493B" />
        </Pressable>
      </View>
      
      <Pressable 
        className={`ml-2 w-10 h-10 rounded-full items-center justify-center ${
          message.trim() ? 'bg-primary' : 'bg-quaternary'
        }`}
        onPress={handleSend}
        disabled={!message.trim()}
      >
        <MaterialIcons name="send" size={18} color="#FFFFFF" />
      </Pressable>
    </View>
  );
}
