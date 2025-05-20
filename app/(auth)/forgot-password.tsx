import React, { useState, } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  Image, 
  KeyboardAvoidingView, 
  Platform,
  ScrollView,
  Pressable,
  Alert
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Link, router } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { Button } from '~/components/ui';
import { useAuthStore } from '~/context/AuthContext';

export default function ForgotPasswordScreen() {
  const [email, setEmail] = useState('');
  const [isEmailSent, setIsEmailSent] = useState(false);
  
  const { resetPassword, isLoading } = useAuthStore();
  
  const handleResetPassword = async () => {
    // Basic validation
    if (!email.trim()) {
      Alert.alert('Error', 'Please enter your email address');
      return;
    }
    
    try {
      await resetPassword(email);
      setIsEmailSent(true);
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to send reset email. Please try again.');
    }
  };
  
  if (isEmailSent) {
    return (
      <SafeAreaView className="flex-1 bg-white">
        <View className="flex-1 justify-center items-center px-6">
          <MaterialIcons name="mark-email-read" size={80} color="#4F46E5" />
          <Text className="text-2xl font-bold mt-6 text-center">Check Your Email</Text>
          <Text className="text-gray-600 text-center mt-2 mb-8">
            We&apos;ve sent a password reset link to {email}
          </Text>
          
          <Button
            label="Return to Login"
            onPress={() => {
              // Navigate back to login
              setIsEmailSent(false);
              setEmail('');
            }}
            variant="outline"
            size="medium"
            fullWidth
          />
          
          <View className="mt-6">
            <Text className="text-center text-gray-600">
              Didn&apos;t receive the email?{' '}
              <Text 
                className="text-indigo-600 font-medium"
                onPress={handleResetPassword}
              >
                Resend
              </Text>
            </Text>
          </View>
        </View>
      </SafeAreaView>
    );
  }
  
  return (
    <SafeAreaView className="flex-1 bg-white">
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        <ScrollView 
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
        >
          {/* Back Button */}
          <Pressable 
            className="p-4" 
            onPress={() => router.back()}
          >
            <MaterialIcons name="arrow-back" size={24} color="#333" />
          </Pressable>
          
          {/* Header */}
          <View className="items-center">
            <Image 
              source={require('../../assets/icon.png')} 
              className="w-20 h-20"
              resizeMode="contain"
            />
          </View>
          
          {/* Form */}
          <View className="px-6 pt-6">
            <Text className="text-2xl font-bold mb-2">Forgot Password?</Text>
            <Text className="text-gray-600 mb-8">
              Enter your email address and we&apos;ll send you a link to reset your password.
            </Text>
            
            {/* Email */}
            <View className="mb-6">
              <Text className="text-gray-700 mb-2 text-sm">Email</Text>
              <View className="flex-row items-center border border-gray-300 rounded-lg px-3 py-2">
                <MaterialIcons name="email" size={20} color="#9ca3af" />
                <TextInput
                  className="flex-1 ml-2 text-base"
                  placeholder="Enter your email"
                  value={email}
                  onChangeText={setEmail}
                  autoCapitalize="none"
                  keyboardType="email-address"
                />
              </View>
            </View>
            
            {/* Reset Button */}
            <Button
              label="Reset Password"
              onPress={handleResetPassword}
              variant="primary"
              size="large"
              fullWidth
              loading={isLoading}
            />
            
            {/* Login Link */}
            <View className="flex-row justify-center mt-6">
              <Text className="text-gray-600">Remember your password? </Text>
              <Link href="/(auth)/login" asChild>
                <Text className="text-indigo-600 font-medium">Log In</Text>
              </Link>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
