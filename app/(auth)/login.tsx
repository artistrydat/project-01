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
import { useAuthStore } from '~/contexts/AuthContext';
import { useTheme } from '~/contexts/ThemeContext';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  const { signIn, isLoading } = useAuthStore();
  const { colors } = useTheme();
  
  const handleLogin = async () => {
    // Basic validation
    if (!email.trim() || !password.trim()) {
      Alert.alert('Error', 'Please enter both email and password');
      return;
    }
    
    try {
      console.log('[Login] Attempting login...');
      // Use the signIn method from AuthContext
      await signIn(email, password);
      console.log('[Login] Login successful, navigation will be handled by _layout.tsx');
      // Navigation is now handled automatically in _layout.tsx
    } catch (error: any) {
      console.error('[Login] Login failed:', error);
      Alert.alert('Login Failed', error.message || 'Please check your credentials and try again.');
    }
  };
  
  const handleSocialLogin = (provider: string) => {
    // In a real app, this would implement social login with the selected provider
    Alert.alert('Social Login', `${provider} login is not implemented in this demo`);
  };
  
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView 
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
        >
          {/* Enhanced Header */}
          <View style={{ marginTop: 40, alignItems: 'center' }}>
            <View 
              style={{ 
                width: 96, 
                height: 96, 
                borderRadius: 24, 
                backgroundColor: colors.surface,
                alignItems: 'center', 
                justifyContent: 'center', 
                marginBottom: 16,
                shadowColor: colors.border,
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 8,
                elevation: 4
              }}
            >
              <Image 
                source={require('../../assets/icon.png')} 
                style={{ width: 64, height: 64 }}
                resizeMode="contain"
              />
            </View>
            <Text 
              style={{ 
                fontSize: 36, 
                fontWeight: '900', 
                marginTop: 8, 
                color: colors.primary,
                letterSpacing: -0.5
              }}
            >
              TravelCo
            </Text>
            <Text 
              style={{ 
                color: colors.textSecondary, 
                marginTop: 8, 
                fontWeight: '500', 
                fontSize: 18 
              }}
            >
              Your personal travel companion ✨
            </Text>
          </View>
          
          {/* Modern Form */}
          <View style={{ paddingHorizontal: 24, paddingTop: 48 }}>
            <Text 
              style={{ 
                fontSize: 30, 
                fontWeight: '900', 
                marginBottom: 32, 
                color: colors.text,
                letterSpacing: -0.5
              }}
            >
              Welcome Back! 👋
            </Text>
            
            {/* Enhanced Email Input */}
            <View style={{ marginBottom: 24 }}>
              <Text 
                style={{ 
                  color: colors.text, 
                  marginBottom: 12, 
                  fontSize: 16, 
                  fontWeight: '700',
                  letterSpacing: 0.5
                }}
              >
                EMAIL
              </Text>
              <View 
                style={{ 
                  flexDirection: 'row', 
                  alignItems: 'center', 
                  borderWidth: 2, 
                  borderColor: colors.border,
                  borderRadius: 16, 
                  paddingHorizontal: 16, 
                  paddingVertical: 16, 
                  backgroundColor: colors.background,
                  shadowColor: colors.border,
                  shadowOffset: { width: 0, height: 1 },
                  shadowOpacity: 0.05,
                  shadowRadius: 2,
                  elevation: 1
                }}
              >
                <MaterialIcons name="email" size={22} color={colors.primary} />
                <TextInput
                  style={{ 
                    flex: 1, 
                    marginLeft: 12, 
                    fontSize: 16, 
                    fontWeight: '500', 
                    color: colors.text
                  }}
                  placeholder="Enter your email"
                  placeholderTextColor={colors.textTertiary}
                  value={email}
                  onChangeText={setEmail}
                  autoCapitalize="none"
                  keyboardType="email-address"
                />
              </View>
            </View>
            
            {/* Enhanced Password Input */}
            <View style={{ marginBottom: 32 }}>
              <Text 
                style={{ 
                  color: colors.text, 
                  marginBottom: 12, 
                  fontSize: 16, 
                  fontWeight: '700',
                  letterSpacing: 0.5
                }}
              >
                PASSWORD
              </Text>
              <View 
                style={{ 
                  flexDirection: 'row', 
                  alignItems: 'center', 
                  borderWidth: 2, 
                  borderColor: colors.border,
                  borderRadius: 16, 
                  paddingHorizontal: 16, 
                  paddingVertical: 16, 
                  backgroundColor: colors.background,
                  shadowColor: colors.border,
                  shadowOffset: { width: 0, height: 1 },
                  shadowOpacity: 0.05,
                  shadowRadius: 2,
                  elevation: 1
                }}
              >
                <MaterialIcons name="lock" size={22} color={colors.primary} />
                <TextInput
                  style={{ 
                    flex: 1, 
                    marginLeft: 12, 
                    fontSize: 16, 
                    fontWeight: '500', 
                    color: colors.text
                  }}
                  placeholder="Enter your password"
                  placeholderTextColor={colors.textTertiary}
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                />
                <Pressable onPress={() => setShowPassword(!showPassword)}>
                  <MaterialIcons 
                    name={showPassword ? "visibility" : "visibility-off"} 
                    size={22} 
                    color={colors.textTertiary} 
                  />
                </Pressable>
              </View>
            </View>
            
            {/* Enhanced Login Button */}
            <Button
              title="Login"
              onPress={handleLogin}
              variant="cyber"
              size="lg"
              isLoading={isLoading}
            />
            
            {/* Modern Forgot Password */}
            <View style={{ alignItems: 'flex-end', marginBottom: 32, marginTop: 16 }}>
              <Link href="/(auth)/forgot-password" asChild>
                <Pressable>
                  <Text 
                    style={{ 
                      color: colors.primary, 
                      fontWeight: '700', 
                      fontSize: 16 
                    }}
                  >
                    Forgot Password? 🔐
                  </Text>
                </Pressable>
              </Link>
            </View>
            
            {/* Signup Link */}
            <View 
              style={{ 
                flexDirection: 'row', 
                justifyContent: 'center', 
                marginVertical: 24 
              }}
            >
              <Text style={{ color: colors.textSecondary }}>
                Don&apos;t have an account? 
              </Text>
              <Link href="/(auth)/signup" asChild>
                <Pressable>
                  <Text 
                    style={{ 
                      color: colors.primary, 
                      fontWeight: '500' 
                    }}
                  >
                    Sign Up
                  </Text>
                </Pressable>
              </Link>
            </View>
            
            {/* Social Login */}
            <View style={{ marginTop: 24 }}>
              <View 
                style={{ 
                  flexDirection: 'row', 
                  alignItems: 'center', 
                  marginBottom: 24 
                }}
              >
                <View 
                  style={{ 
                    flex: 1, 
                    height: 1, 
                    backgroundColor: colors.border 
                  }} 
                />
                <Text 
                  style={{ 
                    marginHorizontal: 16, 
                    color: colors.textSecondary 
                  }}
                >
                  or continue with
                </Text>
                <View 
                  style={{ 
                    flex: 1, 
                    height: 1, 
                    backgroundColor: colors.border 
                  }} 
                />
              </View>
              
              <View 
                style={{ 
                  flexDirection: 'row', 
                  justifyContent: 'center', 
                  gap: 16 
                }}
              >
                <TouchableOpacity 
                  style={{ 
                    width: 56, 
                    height: 56, 
                    borderWidth: 1, 
                    borderColor: colors.border,
                    borderRadius: 28, 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    backgroundColor: colors.background
                  }}
                  onPress={() => handleSocialLogin('Google')}
                >
                  <MaterialIcons name="public" size={24} color="#DB4437" />
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={{ 
                    width: 56, 
                    height: 56, 
                    borderWidth: 1, 
                    borderColor: colors.border,
                    borderRadius: 28, 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    backgroundColor: colors.background
                  }}
                  onPress={() => handleSocialLogin('Facebook')}
                >
                  <MaterialIcons name="public" size={24} color="#4267B2" />
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={{ 
                    width: 56, 
                    height: 56, 
                    borderWidth: 1, 
                    borderColor: colors.border,
                    borderRadius: 28, 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    backgroundColor: colors.background
                  }}
                  onPress={() => handleSocialLogin('Apple')}
                >
                  <MaterialIcons name="public" size={24} color={colors.text} />
                </TouchableOpacity>
              </View>
            </View>
            
          </View>
          
          {/* Skip button for demo purposes */}
          <View 
            style={{ 
              marginTop: 'auto', 
              marginBottom: 16, 
              alignItems: 'center' 
            }}
          >
            <Pressable 
              onPress={() => signIn('demo@travelco.com', 'password')}
              style={{ paddingVertical: 8, paddingHorizontal: 16 }}
            >
              <Text style={{ color: colors.textSecondary }}>
                Skip for now
              </Text>
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
