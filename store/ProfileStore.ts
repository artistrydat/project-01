import { create } from 'zustand';
import { mockUserProfile } from '~/types/profiledata';
import type { UserProfile } from '~/types/profile.types';

interface ProfileState {
  // State
  profiles: Record<string, UserProfile>;
  currentProfileId: string | null;
  isLoading: boolean;
  
  // Actions
  fetchProfile: (userId: string) => void;
  updateProfile: (userId: string, profileData: Partial<UserProfile>) => void;
  setCurrentProfileId: (userId: string | null) => void;
  
  // Array Management Actions
  addArrayItem: (
    userId: string, 
    field: keyof Pick<UserProfile, 'interests' | 'friends' | 'travelHistory' | 'travelGoals'>, 
    item: string
  ) => void;
  removeArrayItem: (
    userId: string, 
    field: keyof Pick<UserProfile, 'interests' | 'friends' | 'travelHistory' | 'travelGoals'>, 
    index: number
  ) => void;
  
  // Settings Actions
  updateNotificationSettings: (userId: string, settings: Partial<UserProfile['notifications']>) => void;
  updatePrivacySettings: (userId: string, settings: Partial<UserProfile['privacySettings']>) => void;
}

export const useProfileStore = create<ProfileState>((set, get) => ({
  // Initial state
  profiles: mockUserProfile,
  currentProfileId: null,
  isLoading: false,
  
  // Actions
  fetchProfile: (userId: string) => {
    set({ isLoading: true });
    
    // Simulate API call with a timeout
    setTimeout(() => {
      // Check if profile exists in our mock data
      if (mockUserProfile[userId]) {
        set(state => ({
          profiles: {
            ...state.profiles,
            [userId]: mockUserProfile[userId]
          },
          currentProfileId: userId,
          isLoading: false
        }));
      } else {
        // Fallback to first profile if ID not found
        const firstId = Object.keys(mockUserProfile)[0];
        set(state => ({
          profiles: state.profiles,
          currentProfileId: firstId,
          isLoading: false
        }));
      }
    }, 500);
  },
  
  updateProfile: (userId: string, profileData: Partial<UserProfile>) => {
    set({ isLoading: true });
    
    setTimeout(() => {
      set(state => {
        const currentProfile = state.profiles[userId] || mockUserProfile[Object.keys(mockUserProfile)[0]];
        
        return {
          profiles: {
            ...state.profiles,
            [userId]: {
              ...currentProfile,
              ...profileData
            }
          },
          isLoading: false
        };
      });
    }, 500);
  },
  
  setCurrentProfileId: (userId: string | null) => {
    set({ currentProfileId: userId });
  },
  
  // New array management functions
  addArrayItem: (userId, field, item) => {
    if (!item.trim()) return;
    
    set(state => {
      const currentProfile = state.profiles[userId];
      if (!currentProfile) return state;
      
      const updatedArray = [...(currentProfile[field] || []), item.trim()];
      
      return {
        profiles: {
          ...state.profiles,
          [userId]: {
            ...currentProfile,
            [field]: updatedArray
          }
        }
      };
    });
  },
  
  removeArrayItem: (userId, field, index) => {
    set(state => {
      const currentProfile = state.profiles[userId];
      if (!currentProfile) return state;
      
      const currentArray = currentProfile[field] || [];
      const updatedArray = currentArray.filter((_, i) => i !== index);
      
      return {
        profiles: {
          ...state.profiles,
          [userId]: {
            ...currentProfile,
            [field]: updatedArray
          }
        }
      };
    });
  },
  
  // New settings management functions
  updateNotificationSettings: (userId, settings) => {
    set(state => {
      const currentProfile = state.profiles[userId];
      if (!currentProfile) return state;
      
      return {
        profiles: {
          ...state.profiles,
          [userId]: {
            ...currentProfile,
            notifications: {
              ...currentProfile.notifications,
              ...settings
            }
          }
        }
      };
    });
  },
  
  updatePrivacySettings: (userId, settings) => {
    set(state => {
      const currentProfile = state.profiles[userId];
      if (!currentProfile) return state;
      
      return {
        profiles: {
          ...state.profiles,
          [userId]: {
            ...currentProfile,
            privacySettings: {
              ...currentProfile.privacySettings,
              ...settings
            }
          }
        }
      };
    });
  }
}));

// Helper selector to get current profile
export const useCurrentProfile = () => {
  const { profiles, currentProfileId } = useProfileStore();
  return currentProfileId ? profiles[currentProfileId] : null;
};