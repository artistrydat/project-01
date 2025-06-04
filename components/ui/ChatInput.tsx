import React, { useState } from 'react';
import { View, TextInput, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../contexts/ThemeContext';

interface ChatInputProps {
  onSend: (message: string) => void;
  placeholder?: string;
  disabled?: boolean;
  variant?: 'default' | 'cyber' | 'glass';
}

export const ChatInput: React.FC<ChatInputProps> = ({
  onSend,
  placeholder = "Type a message...",
  disabled = false,
  variant = 'default',
}) => {
  const [message, setMessage] = useState('');
  const { colors } = useTheme();

  const handleSend = () => {
    if (message.trim() && !disabled) {
      onSend(message.trim());
      setMessage('');
    }
  };

  const getContainerStyles = () => {
    switch (variant) {
      case 'cyber':
        return {
          backgroundColor: colors.surface, // bg-surface with transparency
          borderWidth: 2,
          borderColor: colors.cyber, // border-cyber
          shadowColor: colors.cyber,
          shadowOffset: { width: 0, height: 0 },
          shadowOpacity: 0.3,
          shadowRadius: 8,
          elevation: 8,
        };
      case 'glass':
        return {
          backgroundColor: `${colors.surface}1A`, // glass-morphism with transparency
          borderWidth: 1,
          borderColor: `${colors.border}33`, // border with transparency
        };
      default:
        return {
          backgroundColor: colors.surface, // bg-surface
          borderWidth: 1,
          borderColor: colors.border, // border-border
        };
    }
  };

  const textColor = variant === 'glass' ? colors.text : colors.text; // text-primary
  const placeholderColor = colors.textTertiary; // text-tertiary

  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        padding: 12, // p-3
        borderRadius: 24, // rounded-full
        ...getContainerStyles(),
      }}
    >
      <TextInput
        value={message}
        onChangeText={setMessage}
        placeholder={placeholder}
        placeholderTextColor={placeholderColor}
        multiline
        style={{
          flex: 1,
          maxHeight: 100,
          fontSize: 16, // text-base
          color: textColor,
          paddingHorizontal: 16, // px-4
          paddingVertical: 8, // py-2
        }}
        editable={!disabled}
      />
      
      <Pressable
        onPress={handleSend}
        disabled={!message.trim() || disabled}
        style={{
          width: 40,
          height: 40,
          borderRadius: 20, // rounded-full
          backgroundColor: message.trim() && !disabled 
            ? variant === 'cyber' ? colors.cyber : colors.primary // bg-cyber or bg-primary
            : colors.textTertiary, // bg-tertiary when disabled
          alignItems: 'center',
          justifyContent: 'center',
          marginLeft: 8, // ml-2
        }}
      >
        <Ionicons 
          name="send" 
          size={20} 
          color={colors.textInverse} // text-inverse
        />
      </Pressable>
    </View>
  );
};
