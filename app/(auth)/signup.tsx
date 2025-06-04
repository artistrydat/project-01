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
import { Link, Stack} from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { Button } from '~/components/ui';
import { useAuthStore } from '~/contexts/AuthContext';
import { useTheme } from '~/contexts/ThemeContext';

export default function SignupScreen() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  const { signUp, isLoading } = useAuthStore();
  const { colors, isDark } = useTheme();
  
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
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <Stack.Screen options={{ headerShown: false }} />
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView 
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
        >
          {/* Header */}
          <View style={{ marginTop: 32, alignItems: 'center' }}>
            <View style={{ 
              width: 80, 
              height: 80, 
              borderRadius: 24, 
              backgroundColor: colors.cyber,
              alignItems: 'center', 
              justifyContent: 'center',
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.25,
              shadowRadius: 8,
              elevation: 8
            }}>
              <Image 
                source={require('../../assets/icon.png')} 
                style={{ width: 48, height: 48, tintColor: colors.textInverse }}
                resizeMode="contain"
              />
            </View>
            <Text style={{ 
              fontSize: 32, 
              fontWeight: '900', 
              marginTop: 16, 
              color: colors.electric 
            }}>
              TravelCo
            </Text>
            <Text style={{ 
              color: colors.textSecondary, 
              marginTop: 4, 
              fontSize: 16 
            }}>
              Join the adventure ✨
            </Text>
          </View>
          
          {/* Form */}
          <View style={{ paddingHorizontal: 24, paddingTop: 32 }}>
            <Text style={{ 
              fontSize: 32, 
              fontWeight: '900', 
              marginBottom: 8, 
              color: colors.text 
            }}>
              Create Account
            </Text>
            <Text style={{ 
              color: colors.textSecondary, 
              marginBottom: 32, 
              fontSize: 16 
            }}>
              Let&apos;s get you started on your journey 🚀
            </Text>
            
            {/* Name */}
            <View style={{ marginBottom: 24 }}>
              <Text style={{ 
                color: colors.text, 
                marginBottom: 12, 
                fontSize: 16, 
                fontWeight: '700' 
              }}>
                👤 Full Name
              </Text>
              <View style={{ 
                flexDirection: 'row', 
                alignItems: 'center', 
                backgroundColor: colors.surface,
                borderRadius: 24, 
                paddingHorizontal: 16, 
                paddingVertical: 16,
                borderWidth: 1,
                borderColor: colors.border,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 4,
                elevation: 4
              }}>
                <MaterialIcons name="person" size={22} color={colors.electric} />
                <TextInput
                  style={{ 
                    flex: 1, 
                    marginLeft: 12, 
                    fontSize: 16, 
                    color: colors.text, 
                    fontWeight: '700' 
                  }}
                  placeholder="Enter your name"
                  placeholderTextColor={colors.textTertiary}
                  value={name}
                  onChangeText={setName}
                />
              </View>
            </View>
            
            {/* Email */}
            <View style={{ marginBottom: 24 }}>
              <Text style={{ 
                color: colors.text, 
                marginBottom: 12, 
                fontSize: 16, 
                fontWeight: '700' 
              }}>
                📧 Email Address
              </Text>
              <View style={{ 
                flexDirection: 'row', 
                alignItems: 'center', 
                backgroundColor: colors.surface,
                borderRadius: 24, 
                paddingHorizontal: 16, 
                paddingVertical: 16,
                borderWidth: 1,
                borderColor: colors.border,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 4,
                elevation: 4
              }}>
                <MaterialIcons name="email" size={22} color={colors.electric} />
                <TextInput
                  style={{ 
                    flex: 1, 
                    marginLeft: 12, 
                    fontSize: 16, 
                    color: colors.text, 
                    fontWeight: '700' 
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
            
            {/* Password */}
            <View style={{ marginBottom: 24 }}>
              <Text style={{ 
                color: colors.text, 
                marginBottom: 12, 
                fontSize: 16, 
                fontWeight: '700' 
              }}>
                🔒 Password
              </Text>
              <View style={{ 
                flexDirection: 'row', 
                alignItems: 'center', 
                backgroundColor: colors.surface,
                borderRadius: 24, 
                paddingHorizontal: 16, 
                paddingVertical: 16,
                borderWidth: 1,
                borderColor: colors.border,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 4,
                elevation: 4
              }}>
                <MaterialIcons name="lock" size={22} color={colors.electric} />
                <TextInput
                  style={{ 
                    flex: 1, 
                    marginLeft: 12, 
                    fontSize: 16, 
                    color: colors.text, 
                    fontWeight: '700' 
                  }}
                  placeholder="Create a password"
                  placeholderTextColor={colors.textTertiary}
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                />
                <Pressable onPress={() => setShowPassword(!showPassword)} style={{ padding: 4 }}>
                  <MaterialIcons 
                    name={showPassword ? "visibility" : "visibility-off"} 
                    size={22} 
                    color={colors.electric} 
                  />
                </Pressable>
              </View>
            </View>
            
            {/* Confirm Password */}
            <View style={{ marginBottom: 32 }}>
              <Text style={{ 
                color: colors.text, 
                marginBottom: 12, 
                fontSize: 16, 
                fontWeight: '700' 
              }}>
                🔐 Confirm Password
              </Text>
              <View style={{ 
                flexDirection: 'row', 
                alignItems: 'center', 
                backgroundColor: colors.surface,
                borderRadius: 24, 
                paddingHorizontal: 16, 
                paddingVertical: 16,
                borderWidth: 1,
                borderColor: colors.border,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 4,
                elevation: 4
              }}>
                <MaterialIcons name="lock" size={22} color={colors.electric} />
                <TextInput
                  style={{ 
                    flex: 1, 
                    marginLeft: 12, 
                    fontSize: 16, 
                    color: colors.text, 
                    fontWeight: '700' 
                  }}
                  placeholder="Confirm your password"
                  placeholderTextColor={colors.textTertiary}
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  secureTextEntry={!showPassword}
                />
              </View>
            </View>
            
            {/* Terms and Conditions */}
            <View style={{ 
              flexDirection: 'row', 
              alignItems: 'flex-start', 
              marginBottom: 32 
            }}>
              <MaterialIcons name="check-circle" size={24} color={colors.electric} />
              <Text style={{ 
                flex: 1, 
                marginLeft: 12, 
                fontSize: 14, 
                color: colors.textSecondary, 
                lineHeight: 20 
              }}>
                By signing up, you agree to our{' '}
                <Text style={{ color: colors.electric, fontWeight: '500' }}>Terms of Service</Text> and{' '}
                <Text style={{ color: colors.electric, fontWeight: '500' }}>Privacy Policy</Text>
              </Text>
            </View>
            
            {/* Signup Button */}
            <Button
              title="Sign Up"
              onPress={handleSignup}
              variant="cyber"
              size="lg"
              isLoading={isLoading}
            />
            
            {/* Login Link */}
            <View style={{ 
              flexDirection: 'row', 
              justifyContent: 'center', 
              marginVertical: 32 
            }}>
              <Text style={{ color: colors.textSecondary }}>Already have an account? </Text>
              <Link href="/(auth)/login" asChild>
                <Pressable>
                  <Text style={{ color: colors.electric, fontWeight: '700' }}>Log In</Text>
                </Pressable>
              </Link>
            </View>
            
            {/* Social Login */}
            <View style={{ marginTop: 16 }}>
              <View style={{ 
                flexDirection: 'row', 
                alignItems: 'center', 
                marginBottom: 32 
              }}>
                <View style={{ 
                  flex: 1, 
                  height: 1, 
                  backgroundColor: colors.border 
                }} />
                <Text style={{ 
                  marginHorizontal: 24, 
                  color: colors.textTertiary, 
                  fontWeight: '500' 
                }}>
                  or sign up with
                </Text>
                <View style={{ 
                  flex: 1, 
                  height: 1, 
                  backgroundColor: colors.border 
                }} />
              </View>
              
              <View style={{ 
                flexDirection: 'row', 
                justifyContent: 'center', 
                gap: 24 
              }}>
                <TouchableOpacity 
                  style={{ 
                    width: 64, 
                    height: 64, 
                    backgroundColor: colors.surface,
                    borderRadius: 24, 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    borderWidth: 1,
                    borderColor: colors.border,
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.1,
                    shadowRadius: 4,
                    elevation: 4
                  }}
                  onPress={() => handleSocialSignup('Google')}
                >
                  <MaterialIcons name="public" size={28} color="#DB4437" />
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={{ 
                    width: 64, 
                    height: 64, 
                    backgroundColor: colors.surface,
                    borderRadius: 24, 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    borderWidth: 1,
                    borderColor: colors.border,
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.1,
                    shadowRadius: 4,
                    elevation: 4
                  }}
                  onPress={() => handleSocialSignup('Facebook')}
                >
                  <MaterialIcons name="public" size={28} color="#4267B2" />
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={{ 
                    width: 64, 
                    height: 64, 
                    backgroundColor: colors.surface,
                    borderRadius: 24, 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    borderWidth: 1,
                    borderColor: colors.border,
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.1,
                    shadowRadius: 4,
                    elevation: 4
                  }}
                  onPress={() => handleSocialSignup('Apple')}
                >
                  <MaterialIcons name="public" size={28} color={isDark ? colors.textInverse : '#000000'} />
                </TouchableOpacity>
              </View>
            </View>
          </View>
          
          {/* Skip button for demo purposes */}
          <View style={{ 
            marginTop: 'auto', 
            marginBottom: 24, 
            alignItems: 'center' 
          }}>
            <Pressable 
              onPress={() => signUp('Demo User', 'demo@travelco.com', 'password')}
              style={{ 
                paddingVertical: 12, 
                paddingHorizontal: 24, 
                borderRadius: 12, 
                backgroundColor: colors.backgroundSecondary 
              }}
            >
              <Text style={{ 
                color: colors.textSecondary, 
                fontWeight: '500' 
              }}>
                Skip for now 🚀
              </Text>
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
