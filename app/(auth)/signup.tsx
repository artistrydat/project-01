import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  Image, 
  KeyboardAvoidingView, 
  Platform,
  ScrollView,
  Pressable,
  Alert
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Link } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { Button } from '~/components/ui';
import { useAuthStore } from '~/context/AuthContext';

export default function SignupScreen() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  const { signUp, isLoading } = useAuthStore();
  
  const handleSignup = async () => {
    // Basic validation
    if (!name.trim() || !email.trim() || !password.trim() || !confirmPassword.trim()) {
      Alert.alert('Error', 'Please fill all fields');
      return;
    }
    
    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }
    
    try {
      // Use the signUp method from AuthContext
      await signUp(name, email, password);
      // Navigation is handled within the signUp function
    } catch (error: any) {
      Alert.alert('Signup Failed', error.message || 'Please try again later.');
    }
  };
  
  const handleSocialSignup = (provider: string) => {
    // In a real app, this would implement social signup with the selected provider
    Alert.alert('Social Signup', `${provider} signup is not implemented in this demo`);
  };
  
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
          {/* Header */}
          <View className="mt-8 items-center">
            <Image 
              source={require('../../assets/icon.png')} 
              className="w-16 h-16"
              resizeMode="contain"
            />
            <Text className="text-2xl font-bold mt-2 text-indigo-700">TravelCo</Text>
          </View>
          
          {/* Form */}
          <View className="px-6 pt-6">
            <Text className="text-2xl font-bold mb-6">Create Account</Text>
            
            {/* Name */}
            <View className="mb-4">
              <Text className="text-gray-700 mb-2 text-sm">Full Name</Text>
              <View className="flex-row items-center border border-gray-300 rounded-lg px-3 py-2">
                <MaterialIcons name="person" size={20} color="#9ca3af" />
                <TextInput
                  className="flex-1 ml-2 text-base"
                  placeholder="Enter your name"
                  value={name}
                  onChangeText={setName}
                />
              </View>
            </View>
            
            {/* Email */}
            <View className="mb-4">
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
            
            {/* Password */}
            <View className="mb-4">
              <Text className="text-gray-700 mb-2 text-sm">Password</Text>
              <View className="flex-row items-center border border-gray-300 rounded-lg px-3 py-2">
                <MaterialIcons name="lock" size={20} color="#9ca3af" />
                <TextInput
                  className="flex-1 ml-2 text-base"
                  placeholder="Create a password"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                />
                <Pressable onPress={() => setShowPassword(!showPassword)}>
                  <MaterialIcons 
                    name={showPassword ? "visibility" : "visibility-off"} 
                    size={20} 
                    color="#9ca3af" 
                  />
                </Pressable>
              </View>
            </View>
            
            {/* Confirm Password */}
            <View className="mb-6">
              <Text className="text-gray-700 mb-2 text-sm">Confirm Password</Text>
              <View className="flex-row items-center border border-gray-300 rounded-lg px-3 py-2">
                <MaterialIcons name="lock" size={20} color="#9ca3af" />
                <TextInput
                  className="flex-1 ml-2 text-base"
                  placeholder="Confirm your password"
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  secureTextEntry={!showPassword}
                />
              </View>
            </View>
            
            {/* Terms and Conditions */}
            <View className="flex-row items-start mb-6">
              <MaterialIcons name="check-circle" size={24} color="#4F46E5" />
              <Text className="flex-1 ml-2 text-sm text-gray-600">
                By signing up, you agree to our{' '}
                <Text className="text-indigo-600">Terms of Service</Text> and{' '}
                <Text className="text-indigo-600">Privacy Policy</Text>
              </Text>
            </View>
            
            {/* Signup Button */}
            <Button
              label="Sign Up"
              onPress={handleSignup}
              variant="primary"
              size="large"
              fullWidth
              loading={isLoading}
            />
            
            {/* Login Link */}
            <View className="flex-row justify-center my-6">
              <Text className="text-gray-600">Already have an account? </Text>
              <Link href="/(auth)/login" asChild>
                <Pressable>
                  <Text className="text-indigo-600 font-medium">Log In</Text>
                </Pressable>
              </Link>
            </View>
            
            {/* Social Login */}
            <View className="mt-4">
              <View className="flex-row items-center mb-6">
                <View className="flex-1 h-px bg-gray-300" />
                <Text className="mx-4 text-gray-500">or sign up with</Text>
                <View className="flex-1 h-px bg-gray-300" />
              </View>
              
              <View className="flex-row justify-center space-x-4">
                <TouchableOpacity 
                  className="w-14 h-14 border border-gray-300 rounded-full items-center justify-center"
                  onPress={() => handleSocialSignup('Google')}
                >
                  <MaterialIcons name="public" size={24} color="#DB4437" />
                </TouchableOpacity>
                
                <TouchableOpacity 
                  className="w-14 h-14 border border-gray-300 rounded-full items-center justify-center"
                  onPress={() => handleSocialSignup('Facebook')}
                >
                  <MaterialIcons name="public" size={24} color="#4267B2" />
                </TouchableOpacity>
                
                <TouchableOpacity 
                  className="w-14 h-14 border border-gray-300 rounded-full items-center justify-center"
                  onPress={() => handleSocialSignup('Apple')}
                >
                  <MaterialIcons name="public" size={24} color="#000000" />
                </TouchableOpacity>
              </View>
            </View>
          </View>
          
          {/* Skip button for demo purposes */}
          <View className="mt-auto mb-4 items-center">
            <Pressable 
              onPress={() => signUp('Demo User', 'demo@travelco.com', 'password')}
              className="py-2 px-4"
            >
              <Text className="text-gray-500">Skip for now</Text>
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
