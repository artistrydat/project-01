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
import { Link, router } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { Button } from '~/components/ui';
import { useAuthStore } from '~/context/AuthContext';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  const { signIn, isLoading } = useAuthStore();
  
  const handleLogin = async () => {
    // Basic validation
    if (!email.trim() || !password.trim()) {
      Alert.alert('Error', 'Please enter both email and password');
      return;
    }
    
    try {
      // Use the signIn method from AuthContext
      await signIn(email, password);
      // Navigation is handled in the AuthContext after successful login
    } catch (error: any) {
      Alert.alert('Login Failed', error.message || 'Please check your credentials and try again.');
    }
  };
  
  const handleSocialLogin = (provider: string) => {
    // In a real app, this would implement social login with the selected provider
    Alert.alert('Social Login', `${provider} login is not implemented in this demo`);
  };
  
  // Debug navigation function
  const testNavigation = (path: string) => {
    console.log(`[Debug] Testing navigation to: ${path}`);
    try {
      router.replace(path);
    } catch (error) {
      console.error('[Debug] Navigation error:', error);
    }
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
          <View className="mt-10 items-center">
            <Image 
              source={require('../../assets/icon.png')} 
              className="w-20 h-20"
              resizeMode="contain"
            />
            <Text className="text-3xl font-bold mt-4 text-indigo-700">TravelCo</Text>
            <Text className="text-gray-500 mt-2">Your personal travel companion</Text>
          </View>
          
          {/* Form */}
          <View className="px-6 pt-12">
            <Text className="text-2xl font-bold mb-6">Welcome Back!</Text>
            
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
            <View className="mb-6">
              <Text className="text-gray-700 mb-2 text-sm">Password</Text>
              <View className="flex-row items-center border border-gray-300 rounded-lg px-3 py-2">
                <MaterialIcons name="lock" size={20} color="#9ca3af" />
                <TextInput
                  className="flex-1 ml-2 text-base"
                  placeholder="Enter your password"
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
            
            {/* Forgot Password */}
            <View className="items-end mb-6">
              <Link href="/(auth)/forgot-password">
                <Pressable>
                  <Text className="text-indigo-600">Forgot Password?</Text>
                </Pressable>
              </Link>
            </View>
            
            {/* Login Button */}
            <Button
              label="Login"
              onPress={handleLogin}
              variant="primary"
              size="large"
              fullWidth
              loading={isLoading}
            />
            
            {/* Signup Link */}
            <View className="flex-row justify-center my-6">
              <Text className="text-gray-600">Don&apos;t have an account? </Text>
              <Link href="/(auth)/signup">
                <Pressable>
                  <Text className="text-indigo-600 font-medium">Sign Up</Text>
                </Pressable>
              </Link>
            </View>
            
            {/* Social Login */}
            <View className="mt-6">
              <View className="flex-row items-center mb-6">
                <View className="flex-1 h-px bg-gray-300" />
                <Text className="mx-4 text-gray-500">or continue with</Text>
                <View className="flex-1 h-px bg-gray-300" />
              </View>
              
              <View className="flex-row justify-center space-x-4">
                <TouchableOpacity 
                  className="w-14 h-14 border border-gray-300 rounded-full items-center justify-center"
                  onPress={() => handleSocialLogin('Google')}
                >
                  <MaterialIcons name="public" size={24} color="#DB4437" />
                </TouchableOpacity>
                
                <TouchableOpacity 
                  className="w-14 h-14 border border-gray-300 rounded-full items-center justify-center"
                  onPress={() => handleSocialLogin('Facebook')}
                >
                  <MaterialIcons name="public" size={24} color="#4267B2" />
                </TouchableOpacity>
                
                <TouchableOpacity 
                  className="w-14 h-14 border border-gray-300 rounded-full items-center justify-center"
                  onPress={() => handleSocialLogin('Apple')}
                >
                  <MaterialIcons name="public" size={24} color="#000000" />
                </TouchableOpacity>
              </View>
            </View>
            
            {/* ===== NAVIGATION DEBUG SECTION ===== */}
            <View className="mt-8 pt-4 border-t border-gray-300">
              <Text className="text-center text-lg font-bold mb-4">Debug Navigation</Text>
              
              <View className="flex-row justify-center mb-2">
                <Button 
                  label="Test Path 1"
                  onPress={() => testNavigation('/(protected)/(tabs)/explore')}
                  variant="outline"
                  size="small"
                />
                <View className="w-2" />
                <Button 
                  label="Test Path 2"
                  onPress={() => testNavigation('/protected/tabs/explore')}
                  variant="outline"
                  size="small"
                />
              </View>
              
              <View className="flex-row justify-center">
                <Button 
                  label="Test Path 3"
                  onPress={() => testNavigation('/explore')}
                  variant="outline"
                  size="small"
                />
                <View className="w-2" />
                <Button 
                  label="Test Path 4"
                  onPress={() => testNavigation('explore')}
                  variant="outline"
                  size="small"
                />
              </View>
            </View>
            {/* ===== END DEBUG SECTION ===== */}
            
          </View>
          
          {/* Skip button for demo purposes */}
          <View className="mt-auto mb-4 items-center">
            <Pressable 
              onPress={() => signIn('demo@travelco.com', 'password')}
              className="py-2 px-4"
            >
              <Text className="text-gray-500">Skip for now</Text>
            </Pressable>
          </View>

          {/* Test Navigation Button */}
          <View className="mt-4 items-center">
            <Pressable 
              onPress={() => testNavigation('/home')}
              className="py-2 px-4 bg-blue-500 rounded"
            >
              <Text className="text-white">Test Navigation</Text>
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
