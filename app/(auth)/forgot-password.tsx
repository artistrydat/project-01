import React, { useState } from 'react';
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
import { useAuthStore } from '~/contexts/AuthContext';
import { useTheme } from '~/contexts/ThemeContext';

export default function ForgotPasswordScreen() {
  const [email, setEmail] = useState('');
  const [isEmailSent, setIsEmailSent] = useState(false);
  
  const { colors, isDark } = useTheme();
  const { isLoading } = useAuthStore();
  
  const handleResetPassword = async () => {
    // Basic validation
    if (!email.trim()) {
      Alert.alert('Error', 'Please enter your email address');
      return;
    }
    
    try {
      // Mock reset password - simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setIsEmailSent(true);
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to send reset email. Please try again.');
    }
  };
  
  if (isEmailSent) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 24 }}>
          {/* Email sent icon - using theme colors */}
          <View style={{ 
            width: 96, 
            height: 96, 
            borderRadius: 24, 
            backgroundColor: colors.electric, // themed electric color
            alignItems: 'center', 
            justifyContent: 'center',
            shadowColor: isDark ? colors.primary : '#000',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.15,
            shadowRadius: 8,
            elevation: 8,
            marginBottom: 24
          }}>
            <MaterialIcons name="mark-email-read" size={40} color={colors.textInverse} />
          </View>
          
          {/* Success title - using typography tokens */}
          <Text style={{ 
            fontSize: 32, 
            fontWeight: '900', 
            textAlign: 'center', 
            color: colors.text, // themed text color
            marginBottom: 12
          }}>
            Check Your Email
          </Text>
          
          {/* Success message - using theme colors */}
          <Text style={{ 
            color: colors.textSecondary, // themed secondary text
            textAlign: 'center', 
            marginBottom: 40, 
            lineHeight: 24,
            fontSize: 16
          }}>
            We&rsquo;ve sent a password reset link to{'\n'}
            <Text style={{ fontWeight: '600', color: colors.electric }}>{email}</Text>
          </Text>
          
          <Button
            title="Return to Login"
            onPress={() => {
              // Navigate back to login
              setIsEmailSent(false);
              setEmail('');
            }}
            variant="outline"
            size="lg"
          />
          
          {/* Resend link - using theme colors */}
          <View style={{ marginTop: 32 }}>
            <Text style={{ textAlign: 'center', color: colors.textSecondary, fontSize: 16 }}>
              Didn&rsquo;t receive the email?{' '}
              <Text 
                style={{ color: colors.electric, fontWeight: 'bold' }}
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
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView 
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
        >
          {/* Back Button - using theme surface color */}
          <Pressable 
            style={{ padding: 16 }}
            onPress={() => router.back()}
          >
            <View style={{ 
              width: 40, 
              height: 40, 
              borderRadius: 12, 
              backgroundColor: colors.surface, // themed surface color
              alignItems: 'center', 
              justifyContent: 'center' 
            }}>
              <MaterialIcons name="arrow-back" size={24} color={colors.textSecondary} />
            </View>
          </Pressable>
          
          {/* Header with app icon - using theme colors */}
          <View style={{ alignItems: 'center', marginTop: 16 }}>
            <View style={{ 
              width: 80, 
              height: 80, 
              borderRadius: 24, 
              backgroundColor: colors.neon, // themed neon color
              alignItems: 'center', 
              justifyContent: 'center',
              shadowColor: isDark ? colors.primary : '#000',
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.15,
              shadowRadius: 8,
              elevation: 8
            }}>
              <Image 
                source={require('../../assets/icon.png')} 
                style={{ 
                  width: 48, 
                  height: 48,
                  tintColor: colors.textInverse // themed inverse text
                }}
                resizeMode="contain"
              />
            </View>
          </View>
          
          {/* Form Section */}
          <View style={{ paddingHorizontal: 24, paddingTop: 32 }}>
            {/* Page title - using theme colors */}
            <Text style={{ 
              fontSize: 32, 
              fontWeight: '900', 
              marginBottom: 8, 
              color: colors.text // themed text color
            }}>
              Forgot Password?
            </Text>
            
            {/* Description - using theme colors */}
            <Text style={{ 
              color: colors.textSecondary, // themed secondary text
              marginBottom: 40, 
              lineHeight: 24,
              fontSize: 16
            }}>
              Enter your email address and we&rsquo;ll send you a link to reset your password ✨
            </Text>
            
            {/* Email Input Field */}
            <View style={{ marginBottom: 32 }}>
              <Text style={{ 
                color: colors.text, // themed text color
                marginBottom: 12, 
                fontSize: 16, 
                fontWeight: '600' 
              }}>
                Email
              </Text>
              
              {/* Input container - using theme colors */}
              <View style={{ 
                flexDirection: 'row', 
                alignItems: 'center', 
                borderWidth: 2, 
                borderColor: colors.border, // themed border color
                borderRadius: 16, 
                paddingHorizontal: 16, 
                paddingVertical: 16, 
                backgroundColor: colors.surface // themed surface color
              }}>
                <MaterialIcons name="email" size={22} color={colors.electric} />
                <TextInput
                  style={{ 
                    flex: 1, 
                    marginLeft: 12, 
                    fontSize: 16, 
                    color: colors.text // themed text color
                  }}
                  placeholder="Enter your email"
                  placeholderTextColor={colors.textTertiary} // themed tertiary text
                  value={email}
                  onChangeText={setEmail}
                  autoCapitalize="none"
                  keyboardType="email-address"
                />
              </View>
            </View>
            
            {/* Reset Button */}
            <Button
              title="Reset Password"
              onPress={handleResetPassword}
              variant="aurora"
              size="lg"
              isLoading={isLoading}
            />
            
            {/* Login Link - using theme colors */}
            <View style={{ 
              flexDirection: 'row', 
              justifyContent: 'center', 
              marginTop: 32 
            }}>
              <Text style={{ color: colors.textSecondary, fontSize: 16 }}>
                Remember your password?{' '}
              </Text>
              <Link href="/(auth)/login" asChild>
                <Text style={{ 
                  color: colors.electric, // themed electric color
                  fontWeight: 'bold',
                  fontSize: 16
                }}>
                  Log In
                </Text>
              </Link>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
