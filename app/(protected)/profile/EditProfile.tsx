import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, TextInput, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack, router } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { LinearGradient } from 'expo-linear-gradient';
import { useProfileStore, useCurrentProfile } from '~/store/ProfileStore';
import { useTheme } from '~/contexts/ThemeContext';

export default function EditProfile() {
  const { colors } = useTheme();
  const { updateProfile, addArrayItem, removeArrayItem, isLoading } = useProfileStore();
  const profile = useCurrentProfile();
  
  // Form data for basic profile info
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    bio: '',
    avatar: ''
  });
  
  // Input fields for array items
  const [newInterest, setNewInterest] = useState('');
  const [newTravelHistory, setNewTravelHistory] = useState('');
  const [newTravelGoal, setNewTravelGoal] = useState('');
  
  useEffect(() => {
    if (profile) {
      setFormData({
        name: profile.name || '',
        username: profile.username || '',
        bio: profile.bio || '',
        avatar: profile.avatar || ''
      });
    }
  }, [profile]);

  const pickImage = async () => {
    // Request permission to access the media library
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (status !== 'granted') {
      Alert.alert(
        'Permission Required',
        'Sorry, we need camera roll permissions to change your profile picture.'
      );
      return;
    }

    // Launch the image library with the correct API
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes:  ['images', 'videos'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      // Update the form data with the selected image URI
      setFormData({
        ...formData,
        avatar: result.assets[0].uri
      });
    }
  };

  const handleSave = () => {
    if (profile && profile.id) {
      updateProfile(profile.id, formData);
      router.back();
    }
  };
  
  // Early return if profile is not loaded
  if (!profile || !profile.id) {
    return (
      <SafeAreaView style={{ 
        flex: 1, 
        backgroundColor: colors.background, // theme background
        alignItems: 'center', 
        justifyContent: 'center' 
      }}>
        <Text style={{ color: colors.text }}>Loading profile...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ 
      flex: 1, 
      backgroundColor: colors.background // backgroundGradient token equivalent
    }}>
      <Stack.Screen options={{ headerShown: false }} />
      
      {/* Modern Header */}
      <View style={{
        paddingHorizontal: 24,
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: colors.border, // borderColor token
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.surface // headerBackground token
      }}>
        <TouchableOpacity 
          style={{
            backgroundColor: colors.cyber, // primary button color
            padding: 12,
            borderRadius: 16,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.3,
            shadowRadius: 8,
            elevation: 8
          }}
          onPress={() => router.back()}
        >
          <MaterialIcons name="arrow-back" size={20} color="white" />
        </TouchableOpacity>
        <Text style={{
          fontSize: 24,
          fontWeight: 'bold',
          textAlign: 'center',
          flex: 1,
          marginLeft: 16,
          color: colors.text // textPrimary token
        }}>
          Edit Your Vibe<Text style={{ color: colors.accent }}>.</Text>
        </Text>
        <View style={{ width: 44 }} />
      </View>
      
      <ScrollView 
        style={{ flex: 1, paddingHorizontal: 24, paddingTop: 32 }} 
        showsVerticalScrollIndicator={false}
      >
        {/* Enhanced Profile Picture */}
        <View style={{ alignItems: 'center', marginBottom: 40 }}>
          <View style={{ position: 'relative' }}>
            <Image 
              source={{ uri: formData.avatar || 'https://via.placeholder.com/150' }} 
              style={{
                width: 144,
                height: 144,
                borderRadius: 24,
                borderWidth: 4,
                borderColor: colors.surface,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 8 },
                shadowOpacity: 0.3,
                shadowRadius: 16
              }}
            />
            <TouchableOpacity 
              style={{
                position: 'absolute',
                bottom: -8,
                right: -8,
                backgroundColor: colors.electric, // cyber gradient equivalent
                borderRadius: 16,
                padding: 16,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.4,
                shadowRadius: 12,
                elevation: 12
              }}
              onPress={pickImage}
            >
              <MaterialIcons name="camera-alt" size={20} color="white" />
            </TouchableOpacity>
          </View>
          <TouchableOpacity 
            style={{
              marginTop: 16,
              paddingHorizontal: 24,
              paddingVertical: 12,
              backgroundColor: colors.neon, // neon gradient equivalent
              borderRadius: 16,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.3,
              shadowRadius: 8,
              elevation: 8
            }}
            onPress={pickImage}
          >
            <Text style={{
              color: 'white',
              fontWeight: 'bold',
              fontSize: 16
            }}>✨ Update Photo</Text>
          </TouchableOpacity>
        </View>
        
        {/* Enhanced Profile Form */}
        <View style={{ gap: 32 }}>
          {/* Enhanced Name and Username Row */}
          <View style={{ flexDirection: 'row', gap: 16 }}>
            {/* Name */}
            <View style={{ flex: 1 }}>
              <Text style={{
                color: colors.textSecondary, // textSecondary token
                fontWeight: 'bold',
                marginBottom: 12,
                fontSize: 18
              }}>
                👤 Full Name
              </Text>
              <View style={{
                backgroundColor: colors.surface, // card background
                borderRadius: 24,
                borderWidth: 1,
                borderColor: colors.border,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.1,
                shadowRadius: 12,
                elevation: 8,
                overflow: 'hidden'
              }}>
                <TextInput
                  style={{
                    paddingVertical: 16,
                    paddingHorizontal: 20,
                    fontSize: 16,
                    color: colors.text,
                    fontWeight: 'bold'
                  }}
                  value={formData.name}
                  onChangeText={(text) => setFormData({...formData, name: text})}
                  placeholder="Your awesome name"
                  placeholderTextColor={colors.textTertiary}
                />
              </View>
            </View>
            
            {/* Username */}
            <View style={{ flex: 1 }}>
              <Text style={{
                color: colors.textSecondary,
                fontWeight: 'bold',
                marginBottom: 12,
                fontSize: 18
              }}>
                @ Username
              </Text>
              <View style={{
                backgroundColor: colors.surface,
                borderRadius: 24,
                borderWidth: 1,
                borderColor: colors.border,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.1,
                shadowRadius: 12,
                elevation: 8,
                overflow: 'hidden'
              }}>
                <TextInput
                  style={{
                    paddingVertical: 16,
                    paddingHorizontal: 20,
                    fontSize: 16,
                    color: colors.text,
                    fontWeight: 'bold'
                  }}
                  value={formData.username}
                  onChangeText={(text) => setFormData({...formData, username: text})}
                  placeholder="@cooluser"
                  placeholderTextColor={colors.textTertiary}
                />
              </View>
            </View>
          </View>
          
          {/* Enhanced Bio */}
          <View>
            <Text style={{
              color: colors.textSecondary,
              fontWeight: 'bold',
              marginBottom: 12,
              fontSize: 18
            }}>
              ✍️ Your Story
            </Text>
            <View style={{
              backgroundColor: colors.surface,
              borderRadius: 24,
              borderWidth: 1,
              borderColor: colors.border,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.1,
              shadowRadius: 12,
              elevation: 8,
              overflow: 'hidden'
            }}>
              <TextInput
                style={{
                  paddingVertical: 16,
                  paddingHorizontal: 20,
                  fontSize: 16,
                  color: colors.text,
                  minHeight: 100,
                  fontWeight: 'bold'
                }}
                value={formData.bio}
                onChangeText={(text) => setFormData({...formData, bio: text})}
                multiline
                numberOfLines={4}
                placeholder="Tell the world what makes you unique..."
                placeholderTextColor={colors.textTertiary}
                textAlignVertical="top"
              />
            </View>
          </View>

          {/* Enhanced Section divider */}
          <View style={{
            flexDirection: 'row',
            alignItems: 'center',
            paddingVertical: 16
          }}>
            <View style={{
              flex: 1,
              height: 2,
              backgroundColor: colors.accent, // aurora gradient equivalent
              borderRadius: 1
            }} />
            <Text style={{
              paddingHorizontal: 24,
              color: colors.text,
              fontWeight: 'bold',
              fontSize: 18
            }}>🌟 YOUR VIBE</Text>
            <View style={{
              flex: 1,
              height: 2,
              backgroundColor: colors.accent,
              borderRadius: 1
            }} />
          </View>
          
          {/* Enhanced Interests */}
          <View>
            <Text style={{
              color: colors.textSecondary,
              fontWeight: 'bold',
              marginBottom: 16,
              fontSize: 18
            }}>
              🔥 Interests & Passions
            </Text>
            <View style={{
              flexDirection: 'row',
              flexWrap: 'wrap',
              marginBottom: 16
            }}>
              {profile.interests?.map((interest, index) => (
                <View key={index} style={{
                  backgroundColor: colors.electric, // cyber gradient equivalent
                  borderRadius: 16,
                  paddingHorizontal: 16,
                  paddingVertical: 8,
                  margin: 4,
                  flexDirection: 'row',
                  alignItems: 'center',
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.3,
                  shadowRadius: 8,
                  elevation: 8
                }}>
                  <Text style={{
                    color: 'white',
                    fontWeight: 'bold',
                    marginRight: 8
                  }}>{interest}</Text>
                  <TouchableOpacity onPress={() => removeArrayItem(profile.id, 'interests', index)}>
                    <MaterialIcons name="close" size={18} color="white" />
                  </TouchableOpacity>
                </View>
              ))}
            </View>
            <View style={{
              flexDirection: 'row',
              alignItems: 'center',
              backgroundColor: colors.surface,
              borderRadius: 24,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.1,
              shadowRadius: 12,
              elevation: 8,
              overflow: 'hidden',
              borderWidth: 1,
              borderColor: colors.border
            }}>
              <TextInput
                style={{
                  paddingVertical: 16,
                  paddingHorizontal: 20,
                  fontSize: 16,
                  color: colors.text,
                  flex: 1,
                  fontWeight: 'bold'
                }}
                value={newInterest}
                onChangeText={setNewInterest}
                placeholder="Add an interest"
                placeholderTextColor={colors.textTertiary}
              />
              <TouchableOpacity 
                style={{
                  backgroundColor: colors.electric,
                  padding: 12,
                  margin: 4,
                  borderRadius: 16,
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.3,
                  shadowRadius: 8,
                  elevation: 8
                }}
                onPress={() => {
                  if (newInterest.trim()) {
                    addArrayItem(profile.id, 'interests', newInterest);
                    setNewInterest('');
                  }
                }}
              >
                <MaterialIcons name="add" size={20} color="white" />
              </TouchableOpacity>
            </View>
          </View>
          
          {/* Enhanced Travel History */}
          <View>
            <Text style={{
              color: colors.textSecondary,
              fontWeight: 'bold',
              marginBottom: 16,
              fontSize: 18
            }}>
              🗺️ Places You&rsquo;ve Conquered
            </Text>
            <View style={{
              flexDirection: 'row',
              flexWrap: 'wrap',
              marginBottom: 16
            }}>
              {profile.travelHistory?.map((place, index) => (
                <View key={index} style={{
                  backgroundColor: colors.backgroundSecondary, // aurora-teal equivalent
                  borderRadius: 16,
                  paddingHorizontal: 16,
                  paddingVertical: 8,
                  margin: 4,
                  flexDirection: 'row',
                  alignItems: 'center',
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.3,
                  shadowRadius: 8,
                  elevation: 8,
                  borderWidth: 1,
                  borderColor: colors.border
                }}>
                  <Text style={{
                    color: colors.text,
                    fontWeight: 'bold',
                    marginRight: 8
                  }}>{place}</Text>
                  <TouchableOpacity onPress={() => removeArrayItem(profile.id, 'travelHistory', index)}>
                    <MaterialIcons name="close" size={18} color={colors.text} />
                  </TouchableOpacity>
                </View>
              ))}
            </View>
            <View style={{
              flexDirection: 'row',
              alignItems: 'center',
              backgroundColor: colors.surface,
              borderRadius: 24,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.1,
              shadowRadius: 12,
              elevation: 8,
              overflow: 'hidden',
              borderWidth: 1,
              borderColor: colors.border
            }}>
              <TextInput
                style={{
                  paddingVertical: 16,
                  paddingHorizontal: 20,
                  fontSize: 16,
                  color: colors.text,
                  flex: 1,
                  fontWeight: 'bold'
                }}
                value={newTravelHistory}
                onChangeText={setNewTravelHistory}
                placeholder="Add a visited place"
                placeholderTextColor={colors.textTertiary}
              />
              <TouchableOpacity 
                style={{
                  backgroundColor: colors.cyber, // aurora-teal to digital-mint equivalent
                  padding: 12,
                  margin: 4,
                  borderRadius: 16,
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.3,
                  shadowRadius: 8,
                  elevation: 8
                }}
                onPress={() => {
                  if (newTravelHistory.trim()) {
                    addArrayItem(profile.id, 'travelHistory', newTravelHistory);
                    setNewTravelHistory('');
                  }
                }}
              >
                <MaterialIcons name="add" size={20} color="white" />
              </TouchableOpacity>
            </View>
          </View>
          
          {/* Enhanced Travel Goals */}
          <View>
            <Text style={{
              color: colors.textSecondary,
              fontWeight: 'bold',
              marginBottom: 16,
              fontSize: 18
            }}>
              🎯 Dream Destinations
            </Text>
            <View style={{
              flexDirection: 'row',
              flexWrap: 'wrap',
              marginBottom: 16
            }}>
              {profile.travelGoals?.map((goal, index) => (
                <View key={index} style={{
                  backgroundColor: colors.backgroundSecondary, // sunset-peach equivalent
                  borderRadius: 16,
                  paddingHorizontal: 16,
                  paddingVertical: 8,
                  margin: 4,
                  flexDirection: 'row',
                  alignItems: 'center',
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.3,
                  shadowRadius: 8,
                  elevation: 8,
                  borderWidth: 1,
                  borderColor: colors.border
                }}>
                  <Text style={{
                    color: colors.text,
                    fontWeight: 'bold',
                    marginRight: 8
                  }}>{goal}</Text>
                  <TouchableOpacity onPress={() => removeArrayItem(profile.id, 'travelGoals', index)}>
                    <MaterialIcons name="close" size={18} color={colors.text} />
                  </TouchableOpacity>
                </View>
              ))}
            </View>
            <View style={{
              flexDirection: 'row',
              alignItems: 'center',
              backgroundColor: colors.surface,
              borderRadius: 24,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.1,
              shadowRadius: 12,
              elevation: 8,
              overflow: 'hidden',
              borderWidth: 1,
              borderColor: colors.border
            }}>
              <TextInput
                style={{
                  paddingVertical: 16,
                  paddingHorizontal: 20,
                  fontSize: 16,
                  color: colors.text,
                  flex: 1,
                  fontWeight: 'bold'
                }}
                value={newTravelGoal}
                onChangeText={setNewTravelGoal}
                placeholder="Add a travel goal"
                placeholderTextColor={colors.textTertiary}
              />
              <TouchableOpacity 
                style={{
                  backgroundColor: colors.warning, // sunset-peach to neon-coral equivalent
                  padding: 12,
                  margin: 4,
                  borderRadius: 16,
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.3,
                  shadowRadius: 8,
                  elevation: 8
                }}
                onPress={() => {
                  if (newTravelGoal.trim()) {
                    addArrayItem(profile.id, 'travelGoals', newTravelGoal);
                    setNewTravelGoal('');
                  }
                }}
              >
                <MaterialIcons name="add" size={20} color="white" />
              </TouchableOpacity>
            </View>
          </View>
          
          {/* Enhanced Status Cards Section */}
          <View style={{ gap: 16, marginTop: 32 }}>
            {/* Premium Status - Enhanced with gradients */}
            {profile?.isPremium && (
              <View style={{
                backgroundColor: colors.electric, // cosmic gradient equivalent
                borderRadius: 24,
                padding: 24,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.4,
                shadowRadius: 12,
                elevation: 12,
                borderWidth: 1,
                borderColor: colors.accent
              }}>
                <View style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginBottom: 8
                }}>
                  <View style={{
                    backgroundColor: colors.accent, // aurora gradient equivalent
                    padding: 8,
                    borderRadius: 16,
                    marginRight: 12
                  }}>
                    <MaterialIcons name="star" size={20} color="white" />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={{
                      fontSize: 20,
                      fontWeight: 'bold',
                      color: 'white'
                    }}>Premium Traveler ⭐</Text>
                    <Text style={{
                      color: 'rgba(255, 255, 255, 0.8)',
                      fontWeight: '500'
                    }}>Unlock the world with exclusive features</Text>
                  </View>
                </View>
                <View style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.2)',
                  borderRadius: 16,
                  padding: 12,
                  marginTop: 12
                }}>
                  <Text style={{
                    color: 'rgba(255, 255, 255, 0.9)',
                    fontSize: 14,
                    fontWeight: '500'
                  }}>✨ Unlimited itineraries • 🌟 Priority support • 🎯 AI recommendations</Text>
                </View>
              </View>
            )}
            
            {/* Newsletter Status - Enhanced */}
            {profile?.isSubscribed && (
              <View style={{
                backgroundColor: colors.backgroundSecondary, // digital-mint/aurora-teal equivalent
                borderRadius: 24,
                padding: 24,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.3,
                shadowRadius: 8,
                elevation: 8,
                borderWidth: 1,
                borderColor: colors.border
              }}>
                <View style={{
                  flexDirection: 'row',
                  alignItems: 'center'
                }}>
                  <View style={{
                    backgroundColor: colors.cyber, // digital-mint to aurora-teal equivalent
                    padding: 8,
                    borderRadius: 16,
                    marginRight: 12
                  }}>
                    <MaterialIcons name="check-circle" size={20} color="white" />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={{
                      fontSize: 20,
                      fontWeight: 'bold',
                      color: colors.text
                    }}>Newsletter Insider 📮</Text>
                    <Text style={{
                      color: colors.textSecondary,
                      fontWeight: '500'
                    }}>Stay updated with travel trends & deals</Text>
                  </View>
                </View>
              </View>
            )}
          </View>
          
          {/* Enhanced Save Button */}
          <View style={{ marginVertical: 40 }}>
            <TouchableOpacity
              style={{
                borderRadius: 24,
                overflow: 'hidden',
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.4,
                shadowRadius: 12,
                elevation: 12,
                opacity: isLoading ? 0.7 : 1
              }}
              onPress={handleSave}
              disabled={isLoading}
            >
              <LinearGradient
                colors={isLoading ? [colors.textTertiary, colors.textSecondary] : [colors.neon, colors.success]}
                style={{
                  paddingVertical: 20,
                  paddingHorizontal: 32,
                  alignItems: 'center'
                }}
              >
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  {isLoading ? (
                    <>
                      <MaterialIcons name="hourglass-empty" size={24} color="white" style={{ marginRight: 12 }} />
                      <Text style={{
                        color: 'white',
                        fontWeight: 'bold',
                        fontSize: 20,
                        letterSpacing: 1,
                        marginLeft: 12
                      }}>SAVING VIBE...</Text>
                    </>
                  ) : (
                    <>
                      <MaterialIcons name="rocket-launch" size={24} color="white" style={{ marginRight: 12 }} />
                      <Text style={{
                        color: 'white',
                        fontWeight: 'bold',
                        fontSize: 20,
                        letterSpacing: 1,
                        marginLeft: 12
                      }}>SAVE YOUR VIBE ✨</Text>
                    </>
                  )}
                </View>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}