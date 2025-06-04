import React, { createContext, useContext, useState, useEffect } from 'react';
import { useColorScheme } from 'react-native';

interface ThemeColors {
  primary: string;
  secondary: string;
  background: string;
  surface: string;
  cardBase: string;
  backgroundSecondary: string;
  text: string;
  textSecondary: string;
  textTertiary: string;
  textInverse: string;
  border: string;
  success: string;
  warning: string;
  error: string;
  cyber: string;
  electric: string;
  neon: string;
  accent: string;
  shadow: string; // Added shadow property
}

// Default colors to prevent undefined errors
const defaultColors: ThemeColors = {
  primary: '#3b82f6',
  secondary: '#64748b',
  background: '#ffffff',
  surface: '#f8fafc',
  cardBase: '#ffffff',
  backgroundSecondary: '#f1f5f9',
  text: '#1e293b',
  textSecondary: '#64748b',
  textTertiary: '#94a3b8',
  textInverse: '#ffffff',
  border: '#e2e8f0',
  success: '#10b981',
  warning: '#f59e0b',
  error: '#ef4444',
  cyber: '#0ea5e9',
  electric: '#8b5cf6',
  neon: '#22c55e',
  accent: '#0ea5e9',
  shadow: '#000000', // Added shadow color
};

const darkColors: ThemeColors = {
  primary: '#60a5fa',
  secondary: '#94a3b8',
  background: '#0f172a',
  surface: '#1e293b',
  cardBase: '#1e293b',
  backgroundSecondary: '#334155',
  text: '#f1f5f9',
  textSecondary: '#cbd5e1',
  textTertiary: '#94a3b8',
  textInverse: '#0f172a',
  border: '#334155',
  success: '#34d399',
  warning: '#fbbf24',
  error: '#f87171',
  cyber: '#38bdf8',
  electric: '#a78bfa',
  neon: '#4ade80',
  accent: '#38bdf8',
  shadow: '#000000', // Added shadow color
};

// Enhanced design tokens with exploration-specific styles
export const designTokens = {
  colors: {
    textPrimary: 'text-slate-900 dark:text-slate-100',
    textSecondary: 'text-slate-600 dark:text-slate-400',
    textTertiary: 'text-slate-500 dark:text-slate-500',
    backgroundPrimary: 'flex-1 bg-white dark:bg-slate-900',
    backgroundSecondary: 'bg-slate-50 dark:bg-slate-800',
    backgroundGradient: 'bg-gradient-to-b from-slate-50 to-white dark:from-slate-900 dark:to-slate-800',
    borderColor: 'border-slate-100 dark:border-slate-700',
    accentText: 'text-aurora-teal dark:text-cyber',
    headerBackground: 'bg-white dark:bg-slate-900',
    cardBackground: 'bg-white dark:bg-slate-800',
    questCardBackground: 'bg-primary-50 dark:bg-primary-900/20',
    skeletonBackground: 'bg-gray-200 dark:bg-slate-800',

    // Exploration-specific colors
    exploreGradients: {
      cardOverlay: 'bg-gradient-to-t from-black/70 to-transparent',
      ratingBadge: 'bg-gradient-aurora',
      featuredBadge: 'bg-gradient-cyber',
    },
    exploreElements: {
      searchBar: 'bg-slate-50 dark:bg-slate-800',
      categoryActive: 'bg-gradient-cyber border-cyber-lime shadow-lg shadow-cyber-lime/25',
      categoryInactive: 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 shadow-sm',
      segmentedControl: 'bg-slate-100 dark:bg-slate-800',
      segmentActive: 'bg-white dark:bg-slate-700 shadow-md shadow-slate-200 dark:shadow-black/20',
      emptyStateIcon: 'bg-slate-100 dark:bg-slate-800',
    },
  },
  typography: {
    heading1: 'text-4xl font-bold',
    heading2: 'text-3xl font-bold',
    heading3: 'text-2xl font-semibold',
    bodyLarge: 'text-lg',
    body: 'text-base',
    bodySmall: 'text-sm',
    caption: 'text-xs',
    pageTitle: 'text-4xl font-black text-gray-900 dark:text-white',
    pageSubtitle: 'text-slate-500 dark:text-slate-400 text-lg font-medium',
    sectionTitle: 'text-2xl font-black text-gray-900 dark:text-white',
  },
  components: {
    button: {
      primary: 'bg-gradient-aurora dark:bg-gradient-cyber px-4 py-3 rounded-2xl shadow-lg',
      buttonText: 'text-white font-bold',
    },
    card: 'bg-white dark:bg-slate-800 rounded-xl shadow-md dark:shadow-slate-900/30',
    inputContainer: 'bg-white dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700 shadow-2xl dark:shadow-slate-900/50',
    searchBar: 'bg-slate-50 dark:bg-slate-800 rounded-2xl px-5 py-4',
  },
  effects: {
    shadowLight: 'shadow-md',
    shadowHeavy: 'shadow-xl',
    skeletonShine: 'bg-gradient-to-r from-transparent via-white/10 dark:via-slate-700/20 to-transparent',
  },
  exploration: {
    featuredCard: 'rounded-3xl overflow-hidden shadow-xl shadow-slate-300 dark:shadow-black/30',
    categoryButton: 'px-6 py-3 rounded-2xl border-2 transition-all',
    infoTag: 'bg-white/25 backdrop-blur-sm rounded-2xl px-4 py-2',
    favoriteButton: 'bg-white/25 backdrop-blur-sm p-3 rounded-2xl shadow-lg',
  }
};

// Create context with default values
const ThemeContext = createContext({
  colors: defaultColors,
  isDark: false,
  toggleTheme: () => {},
});

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const systemColorScheme = useColorScheme();
  const [isDark, setIsDark] = useState(systemColorScheme === 'dark');

  useEffect(() => {
    setIsDark(systemColorScheme === 'dark');
  }, [systemColorScheme]);

  const toggleTheme = () => {
    setIsDark(!isDark);
  };

  const colors = isDark ? darkColors : defaultColors;

  return (
    <ThemeContext.Provider value={{ colors, isDark, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};