import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import * as SecureStore from 'expo-secure-store';
import { router } from 'expo-router';

const secureStorage = {
  getItem: async (name: string) => {
    try {
      return await SecureStore.getItemAsync(name);
    } catch {
      return null;
    }
  },
  setItem: async (name: string, value: string) => {
    await SecureStore.setItemAsync(name, value);
  },
  removeItem: async (name: string) => {
    await SecureStore.deleteItemAsync(name);
  },
};

type User = {
  id: string;
  name: string;
  email: string;
  avatar?: string;
};

type AuthStore = {
  user: User | null;
  isLoading: boolean;
  isHydrated: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (name: string, email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updateUser: (userData: Partial<User>) => void;
  setHydrated: (hydrated: boolean) => void;
};

const MOCK_USER: User = {
  id: '1',
  name: 'Demo User',
  email: 'demo@travelco.com',
  avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
};

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      user: null,
      isLoading: false,
      isHydrated: false,
      setHydrated: (hydrated) => set({ isHydrated: hydrated }),
      // Update navigation calls to use typed routes:
      signIn: async (email, password) => {
        set({ isLoading: true });
        try {
          await new Promise(resolve => setTimeout(resolve, 1000));
          set({ user: MOCK_USER });
          console.log('[AuthContext] Router object:', router);
          console.log('[AuthContext] Navigating to: /(protected)/(tabs)/explore');
          router.replace('/(protected)/(tabs)/explore');
        } finally {
          set({ isLoading: false });
        }
      },
      signUp: async (name, email, password) => {
        set({ isLoading: true });
        try {
          await new Promise(resolve => setTimeout(resolve, 1000));
          const newUser = {
            id: 'user' + Math.floor(Math.random() * 1000),
            name,
            email,
            avatar: `https://randomuser.me/api/portraits/${
              Math.random() > 0.5 ? 'men' : 'women'
            }/${Math.floor(Math.random() * 100)}.jpg`,
          };
          set({ user: newUser });
          console.log('[AuthContext] Router object:', router);
          console.log('[AuthContext] Navigating to: /(protected)/(tabs)/explore');
          router.replace('/(protected)/(tabs)/explore');
        } finally {
          set({ isLoading: false });
        }
      },
      signOut: async () => {
        set({ isLoading: true });
        try {
          set({ user: null });
          console.log('[AuthContext] Router object:', router);
          console.log('[AuthContext] Navigating to: /(auth)/login');
          router.replace('/(auth)/login');
        } finally {
          set({ isLoading: false });
        }
      },
      resetPassword: async (email) => {
        set({ isLoading: true });
        try {
          await new Promise(resolve => setTimeout(resolve, 1000));
        } finally {
          set({ isLoading: false });
        }
      },
      updateUser: (userData) => {
        const { user } = get();
        if (user) set({ user: { ...user, ...userData } });
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => secureStorage),
      partialize: (state) => ({ user: state.user }),
      onRehydrateStorage: () => (state) => state?.setHydrated(true),
    }
  )
);

export const useAuthHydration = () => useAuthStore((state) => state.isHydrated);
export const useAuthInitialization = () => useAuthStore((state) => state.setHydrated(true));