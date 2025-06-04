// (Make sure this file exists and exports the required functions)

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';
import { mockUserProfile } from '../types/profiledata';

interface User {
  id: string;
  email: string;
  name: string;
  // Add other user properties as needed
}

interface AuthState {
  user: User | null;
  isLoading: boolean;
  setUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
  logout: () => void;
  signOut: () => void;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (name: string, email: string, password: string) => Promise<void>;
}

// Mock credentials - map emails to user IDs
const mockCredentials = {
  'demo@travelco.com': { userId: 'user123', password: 'password' },
  'demo2@travelco.com': { userId: 'user456', password: 'password' },
  'demo3@travelco.com': { userId: 'user789', password: 'password' },
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isLoading: false,
      setUser: (user) => set({ user }),
      setLoading: (isLoading) => set({ isLoading }),
      logout: () => set({ user: null }),
      signOut: () => set({ user: null }),
      signIn: async (email: string, password: string) => {
        try {
          set({ isLoading: true });
          
          console.log('[Auth] Attempting login for:', email);
          
          // Simulate API delay
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          // Check credentials
          const credential = mockCredentials[email as keyof typeof mockCredentials];
          
          if (!credential || credential.password !== password) {
            throw new Error('Invalid email or password');
          }
          
          // Get user profile from mock data
          const userProfile = mockUserProfile[credential.userId];
          
          if (!userProfile) {
            throw new Error('User not found');
          }
          
          // Create user object for auth store
          const user: User = {
            id: userProfile.id,
            email: userProfile.email,
            name: userProfile.name,
          };
          
          console.log('[Auth] Login successful for user:', user.email);
          set({ user, isLoading: false });
        } catch (error) {
          console.error('[Auth] Login failed:', error);
          set({ isLoading: false });
          throw error;
        }
      },
      signUp: async (name: string, email: string, password: string) => {
        try {
          set({ isLoading: true });
          
          console.log('[Auth] Attempting signup for:', email);
          
          // Simulate API delay
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          // Check if email already exists
          if (mockCredentials[email as keyof typeof mockCredentials]) {
            throw new Error('Email already exists');
          }
          
          // For demo purposes, create a new user with a generated ID
          const newUserId = String(Date.now());
          const user: User = {
            id: newUserId,
            email: email,
            name: name,
          };
          
          // In a real app, you would send this to your backend
          console.log('[Auth] Signup successful for user:', user.email);
          set({ user, isLoading: false });
        } catch (error) {
          console.error('[Auth] Signup failed:', error);
          set({ isLoading: false });
          throw error;
        }
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

export const useAuthHydration = () => {
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    // Force hydration check
    const unsubscribe = useAuthStore.persist.onFinishHydration(() => {
      console.log('[Auth] Store hydrated');
      setIsHydrated(true);
    });

    // Also check if already hydrated
    if (useAuthStore.persist.hasHydrated()) {
      console.log('[Auth] Store was already hydrated');
      setIsHydrated(true);
    }

    return unsubscribe;
  }, []);

  console.log('[Auth] Hydration status:', isHydrated);
  return isHydrated;
};
