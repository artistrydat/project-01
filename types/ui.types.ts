// Centralized types for UI components

import type { Activity } from './planner.types';

export interface ButtonProps {
  label: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'danger';
  size?: 'small' | 'medium' | 'large';
  icon?: string;
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
}

export interface ChatInputProps {
  onSend: (message: string) => void;
}

export interface ChatRoomCardProps {
  roomId: string;
  name: string;
  lastMessage: string;
  timestamp: string;
}

export interface DestinationCardProps {
  id: string;
  name: string;
  imageUrl: string;
  trendingScore: number;
  ecoScore: number;
}

export interface EcoImpactDashboardProps {
  ecoScore: number;
  itineraryId: string;
}

export interface HeaderProps {
  title: string;
  subtitle?: string;
  onBackPress?: () => void;
}

// types/ui.types.ts
export interface TypeItemProps {
  id: string;
  name: string;
  description: string;
  icon?: string;
  type: 'landmark' | 'activity' | 'food' | 'accommodation';
  costEstimate?: string;
  onPress?: () => void;
}

export interface ItineraryDayCardProps {
  date: string;
  highlights: {
    id: string;
    name: string;
    description: string;
    type: 'landmark' | 'activity' | 'food' | 'accommodation';
    costEstimate?: string;
  }[];
  totalCost?: string;
  onLongPress?: () => void;
  isActive?: boolean;
  onHighlightPress?: (activity: any) => void;
}

export interface CostEstimateBadgeProps {
  amount: string;
  variant?: 'primary' | 'secondary';
}

export interface MoodSelectorProps {
  moods: string[];
  onSelect: (mood: string) => void;
}

export interface QuestCardProps {
  title: string;
  description: string;
  points: number;
  completed: boolean;
}

export interface ActivityCardProps {
  activity: Activity;
  onPress?: () => void;
}

export interface ListProps<T> {
  data: T[];
  renderItem: (item: T, index: number) => React.ReactElement;
  keyExtractor: (item: T, index: number) => string;
  loading?: boolean;
  onRefresh?: () => void;
  refreshing?: boolean;
  emptyText?: string;
  HeaderComponent?: React.ReactElement | null;
  FooterComponent?: React.ReactElement | null;
  ListItemSeparator?: React.ReactElement | null;
  // Allow additional FlatList props
  [key: string]: any;
}
