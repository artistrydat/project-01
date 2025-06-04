import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView, Share, Alert, Clipboard } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack, router } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { useCurrentProfile } from '~/store/ProfileStore';
import QRCode from 'react-native-qrcode-svg';
import * as FileSystem from 'expo-file-system';
import * as MediaLibrary from 'expo-media-library';
import { useTheme } from '~/contexts/ThemeContext';

// Define a type for the QR code ref that includes the toDataURL method
type QRCodeRef = {
  toDataURL: (callback: (dataURL: string) => void) => void;
};

export default function ShareProfile() {
  const { colors, isDark } = useTheme();
  const profile = useCurrentProfile();
  const [saving, setSaving] = useState(false);
  const [qrRef, setQrRef] = useState<QRCodeRef | null>(null);
  
  // Create a shareable profile URL
  const profileUrl = profile?.id ? 
    `https://yourtravelapp.com/profile/${profile.id}` : 
    'https://yourtravelapp.com';
  
  // Handle share button
  const handleShare = async () => {
    try {
      const shareMessage = `Check out my travel profile: ${profileUrl}`;
      const shareTitle = profile?.name ? `${profile.name}'s Travel Profile` : 'Travel Profile';
      
      await Share.share({
        message: shareMessage,
        url: profileUrl, // iOS only
        title: shareTitle // Android only
      });
    } catch {
      // Handle error properly
      Alert.alert('Error', 'Something went wrong while sharing');
    }
  };
  
  // Handle copy link
  const handleCopyLink = () => {
    Clipboard.setString(profileUrl);
    Alert.alert('Success', 'Profile link copied to clipboard!');
  };
  
  // Handle download QR code
  const handleDownload = async () => {
    if (!qrRef) return;
    
    try {
      setSaving(true);
      
      // Request permissions
      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission needed', 'Please allow access to save the QR code');
        setSaving(false);
        return;
      }
      
      // Get QR code as SVG - fixed typing
      qrRef.toDataURL(async (dataURL: string) => {
        const fileName = `${profile?.username || 'profile'}-qr.png`;
        const fileUri = FileSystem.documentDirectory + fileName;
        
        // Write file
        await FileSystem.writeAsStringAsync(fileUri, dataURL, {
          encoding: FileSystem.EncodingType.Base64
        });
        
        // Save to media library
        const asset = await MediaLibrary.createAssetAsync(fileUri);
        await MediaLibrary.createAlbumAsync('Travel App', asset, false);
        
        setSaving(false);
        Alert.alert('Success', 'QR code saved to your gallery!');
      });
    } catch {
      // Handle error properly
      setSaving(false);
      Alert.alert('Error', 'Failed to save QR code');
    }
  };
  
  if (!profile) {
    return (
      <SafeAreaView style={{ 
        flex: 1, 
        backgroundColor: colors.background || '#fff',
        alignItems: 'center', 
        justifyContent: 'center' 
      }}>
        <Text style={{ color: colors.text || '#000' }}>Loading profile...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background || '#fff' }}>
      <Stack.Screen options={{ headerShown: false }} />
      
      {/* Modern Header */}
      <View style={{
        paddingHorizontal: 24,
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: colors.border || '#ddd',
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.surface || '#f5f5f5'
      }}>
        <TouchableOpacity 
          style={{
            backgroundColor: colors.primary || '#000',
            padding: 12,
            borderRadius: 16,
            shadowColor: colors.text || '#000',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.15,
            shadowRadius: 8,
            elevation: 4
          }}
          onPress={() => router.back()}
        >
          <MaterialIcons name="arrow-back" size={20} color={colors.textInverse || '#fff'} />
        </TouchableOpacity>
        <Text style={{
          fontSize: 24,
          fontWeight: '900',
          textAlign: 'center',
          flex: 1,
          marginLeft: 16,
          color: colors.text || '#000'
        }}>
          <Text>Share Your Vibe</Text>
          <Text style={{ color: colors.accent || '#000' }}>.</Text>
        </Text>
        <View style={{ width: 44 }} />
      </View>
      
      <ScrollView style={{ flex: 1, paddingHorizontal: 24, paddingTop: 32 }} showsVerticalScrollIndicator={false}>
        {/* Enhanced Profile Info */}
        <View style={{ alignItems: 'center', marginBottom: 32 }}>
          <View style={{ position: 'relative' }}>
            <Image 
              source={{ uri: profile.avatar }} 
              style={{
                width: 128,
                height: 128,
                borderRadius: 24,
                borderWidth: 4,
                borderColor: colors.surface || '#f5f5f5',
                shadowColor: colors.text || '#000',
                shadowOffset: { width: 0, height: 8 },
                shadowOpacity: 0.25,
                shadowRadius: 16
              }}
            />
            {/* Status indicator */}
            <View style={{
              position: 'absolute',
              bottom: -4,
              right: -4,
              width: 32,
              height: 32,
              backgroundColor: colors.success || '#10b981',
              borderRadius: 16,
              borderWidth: 3,
              borderColor: colors.surface || '#f5f5f5',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <View style={{
                width: 12,
                height: 12,
                backgroundColor: colors.surface || '#f5f5f5',
                borderRadius: 6
              }} />
            </View>
          </View>
          
          <Text style={{
            fontSize: 32,
            fontWeight: '900',
            marginTop: 24,
            color: colors.text || '#000'
          }}>
            {String(profile.name)}
          </Text>
          <Text style={{
            fontSize: 20,
            color: colors.accent || '#000',
            fontWeight: 'bold'
          }}>
            <Text>@</Text>
            <Text>{String(profile.username)}</Text>
          </Text>
          
          {/* Enhanced Badges */}
          <View style={{ flexDirection: 'row', marginTop: 20, gap: 12 }}>
            {profile.isPremium && (
              <View style={{
                backgroundColor: colors.primary || '#000',
                borderRadius: 16,
                paddingHorizontal: 16,
                paddingVertical: 8,
                flexDirection: 'row',
                alignItems: 'center',
                shadowColor: colors.text || '#000',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.15,
                shadowRadius: 8,
                elevation: 4
              }}>
                <MaterialIcons name="star" size={18} color={colors.textInverse || '#fff'} />
                <Text style={{
                  color: colors.textInverse || '#fff',
                  marginLeft: 8,
                  fontWeight: '900'
                }}>
                  Premium
                </Text>
              </View>
            )}
            {profile.isSubscribed && (
              <View style={{
                backgroundColor: colors.success || '#10b981',
                borderRadius: 16,
                paddingHorizontal: 16,
                paddingVertical: 8,
                flexDirection: 'row',
                alignItems: 'center',
                shadowColor: colors.text || '#000',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.15,
                shadowRadius: 8,
                elevation: 4
              }}>
                <MaterialIcons name="check-circle" size={18} color={colors.textInverse || '#fff'} />
                <Text style={{
                  color: colors.textInverse || '#fff',
                  marginLeft: 8,
                  fontWeight: '900'
                }}>
                  Insider
                </Text>
              </View>
            )}
          </View>
        </View>
        
        {/* Enhanced QR Code Section */}
        <View style={{
          backgroundColor: colors.surface || '#f5f5f5',
          borderRadius: 24,
          padding: 32,
          marginHorizontal: 8,
          shadowColor: colors.text || '#000',
          shadowOffset: { width: 0, height: 12 },
          shadowOpacity: 0.15,
          shadowRadius: 20,
          elevation: 12,
          borderWidth: 1,
          borderColor: colors.border || '#ddd',
          marginBottom: 32
        }}>
          <View style={{ alignItems: 'center' }}>
            <View style={{
              backgroundColor: isDark ? (colors.background || '#000') : `${colors.accent || '#000'}10`,
              padding: 24,
              borderRadius: 24,
              borderWidth: 2,
              borderColor: isDark ? (colors.border || '#333') : `${colors.accent || '#000'}20`,
              shadowColor: colors.text || '#000',
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.15,
              shadowRadius: 8,
              elevation: 4
            }}>
              <QRCode
                value={profileUrl}
                size={220}
                color={colors.text || '#000'}
                backgroundColor={colors.surface || '#f5f5f5'}
                logo={{uri: profile.avatar}}
                logoSize={50}
                logoBackgroundColor={colors.surface || '#f5f5f5'}
                logoMargin={8}
                logoBorderRadius={25}
                getRef={(ref) => setQrRef(ref as unknown as QRCodeRef)}
              />
            </View>
            
            <Text style={{
              color: colors.accent || '#000',
              marginTop: 24,
              fontSize: 20,
              textAlign: 'center',
              fontWeight: '900'
            }}>
              <Text>Scan to connect </Text>
              <Text>✨</Text>
            </Text>
            <Text style={{
              color: colors.textSecondary || '#666',
              fontSize: 14,
              textAlign: 'center',
              marginTop: 8,
              fontWeight: '500'
            }}>
              {String(profileUrl)}
            </Text>
          </View>
        </View>
        
        {/* Enhanced Action Buttons */}
        <View style={{
          flexDirection: 'row',
          justifyContent: 'space-around',
          marginBottom: 32,
          paddingHorizontal: 16
        }}>
          <TouchableOpacity 
            style={{ alignItems: 'center' }}
            onPress={handleShare}
          >
            <View style={{
              width: 64,
              height: 64,
              backgroundColor: colors.primary || '#000',
              borderRadius: 16,
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 12,
              shadowColor: colors.text || '#000',
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.15,
              shadowRadius: 8,
              elevation: 4
            }}>
              <MaterialIcons name="share" size={28} color={colors.textInverse || '#fff'} />
            </View>
            <Text style={{ color: colors.text || '#000', fontWeight: 'bold' }}>Share</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={{ alignItems: 'center' }}
            onPress={handleCopyLink}
          >
            <View style={{
              width: 64,
              height: 64,
              backgroundColor: colors.accent || '#000',
              borderRadius: 16,
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 12,
              shadowColor: colors.text || '#000',
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.15,
              shadowRadius: 8,
              elevation: 4
            }}>
              <MaterialIcons name="link" size={28} color={colors.textInverse || '#fff'} />
            </View>
            <Text style={{ color: colors.text || '#000', fontWeight: 'bold' }}>Copy Link</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={{ alignItems: 'center' }}
            onPress={handleDownload}
            disabled={saving}
          >
            <View style={{
              width: 64,
              height: 64,
              borderRadius: 16,
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 12,
              shadowColor: colors.text || '#000',
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.15,
              shadowRadius: 8,
              elevation: 4,
              backgroundColor: saving ? (colors.textTertiary || '#999') : (colors.neon || '#000')
            }}>
              <MaterialIcons 
                name={saving ? "hourglass-empty" : "file-download"} 
                size={28} 
                color={colors.textInverse || '#fff'}
              />
            </View>
            <Text style={{ color: colors.text || '#000', fontWeight: 'bold' }}>
              {saving ? 'Saving...' : 'Download'}
            </Text>
          </TouchableOpacity>
        </View>
        
        {/* Enhanced Instructions */}
        <View style={{
          backgroundColor: isDark ? (colors.surface || '#333') : `${colors.electric || '#000'}05`,
          padding: 24,
          borderRadius: 24,
          marginBottom: 40,
          marginHorizontal: 8,
          borderWidth: 1,
          borderColor: isDark ? (colors.border || '#444') : `${colors.electric || '#000'}20`,
          shadowColor: colors.text || '#000',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.15,
          shadowRadius: 8,
          elevation: 4
        }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 16 }}>
            <View style={{
              backgroundColor: colors.electric || '#000',
              padding: 8,
              borderRadius: 16,
              marginRight: 12
            }}>
              <MaterialIcons name="info" size={20} color={colors.textInverse || '#fff'} />
            </View>
            <Text style={{
              fontSize: 24,
              fontWeight: '900',
              color: colors.text || '#000'
            }}>
              <Text>How to Connect </Text>
              <Text>✨</Text>
            </Text>
          </View>
          <Text style={{
            color: colors.textSecondary || '#666',
            lineHeight: 24,
            fontWeight: '500'
          }}>
            Share your QR code with fellow travelers or scan theirs to instantly connect! 
            Building your travel network has never been easier. Let&rsquo;s explore the world together! 🌎
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}