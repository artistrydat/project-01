export interface Quest {
  id: string;
  title: string;
  description: string;
  points: number;
  total: number;
  icon: string;
  category: 'social' | 'exploration' | 'cultural' | 'adventure';
  difficulty: 'easy' | 'medium' | 'hard';
  unlockLevel: number;
  // Activity tracking configuration - FIXED: aligned with ActivityEvent types
  activityType: 'message_sent' | 'question_answered' | 'photo_shared' | 'event_joined' | 'recommendation_given' | 'room_joined' | 'daily_active' | 'reaction_given';
  autoTrack: boolean;
  conditions?: {
    roomType?: string[];
    timeframe?: 'daily' | 'weekly' | 'monthly' | 'all_time';
    minMessageLength?: number;
    requiresMedia?: boolean;
  };
}

export interface UserQuestProgress {
  userId: string;
  questId: string;
  progress: number;
  completed: boolean;
  completedAt?: Date;
  lastUpdated: Date;
  activityData?: {
    messagesSent?: number;
    questionsAnswered?: number;
    eventsJoined?: number;
    recommendationsGiven?: number;
    roomsJoined?: number;
    dailyActiveStreak?: number;
    reactionsGiven?: number;
  };
}

export interface QuestProgress {
  questId: string;
  currentProgress: number;
  maxProgress: number;
  isCompleted: boolean;
  completedAt?: Date;
}

export interface UserQuestStats {
  totalPoints: number;
  completedQuests: number;
  activeQuests: number;
  level: number;
  currentStreak: number;
}

export interface ActivityEvent {
  type: 'message_sent' | 'question_answered' | 'photo_shared' | 'event_joined' | 'recommendation_given' | 'room_joined' | 'reaction_given';
  userId: string;
  roomId?: string;
  timestamp: Date;
  metadata?: {
    messageLength?: number;
    hasMedia?: boolean;
    roomType?: string;
    helpfulnessRating?: number;
  };
}

// Enhanced mock data for quests with automatic tracking - FIXED: updated activity types
export const mockQuests: Quest[] = [
  {
    id: '1',
    title: 'Social Butterfly',
    description: 'Send 20 messages in community rooms',
    points: 50,
    total: 20,
    icon: '💬',
    category: 'social',
    difficulty: 'easy',
    unlockLevel: 1,
    activityType: 'message_sent',
    autoTrack: true,
    conditions: {
      minMessageLength: 10,
      timeframe: 'all_time'
    }
  },
  {
    id: '2',
    title: 'Helpful Traveler',
    description: 'Answer 10 questions from other travelers',
    points: 75,
    total: 10,
    icon: '🤝',
    category: 'social',
    difficulty: 'medium',
    unlockLevel: 1,
    activityType: 'question_answered',
    autoTrack: true,
    conditions: {
      minMessageLength: 20,
      timeframe: 'all_time'
    }
  },
  {
    id: '3',
    title: 'Community Leader',
    description: 'Give 50 recommendations to other travelers',
    points: 150,
    total: 50,
    icon: '⭐',
    category: 'social',
    difficulty: 'hard',
    unlockLevel: 2,
    activityType: 'recommendation_given',
    autoTrack: true,
    conditions: {
      minMessageLength: 30,
      timeframe: 'all_time'
    }
  },
  {
    id: '4',
    title: 'Room Hopper',
    description: 'Join 8 different community rooms',
    points: 60,
    total: 8,
    icon: '🌍',
    category: 'exploration',
    difficulty: 'medium',
    unlockLevel: 1,
    activityType: 'room_joined',
    autoTrack: true,
    conditions: {
      timeframe: 'all_time'
    }
  },
  {
    id: '5',
    title: 'Local Culture Enthusiast',
    description: 'Join 3 local cultural events',
    points: 120,
    total: 3,
    icon: '🎭',
    category: 'cultural',
    difficulty: 'medium',
    unlockLevel: 2,
    activityType: 'event_joined',
    autoTrack: true,
    conditions: {
      roomType: ['cultural', 'events'],
      timeframe: 'all_time'
    }
  },
  {
    id: '6',
    title: 'Daily Explorer',
    description: 'Be active for 7 consecutive days',
    points: 100,
    total: 7,
    icon: '🔥',
    category: 'social',
    difficulty: 'medium',
    unlockLevel: 1,
    activityType: 'daily_active',
    autoTrack: true,
    conditions: {
      timeframe: 'daily'
    }
  },
  {
    id: '7',
    title: 'Reaction Master',
    description: 'Give 30 reactions to helpful messages',
    points: 30,
    total: 30,
    icon: '👍',
    category: 'social',
    difficulty: 'easy',
    unlockLevel: 1,
    activityType: 'reaction_given',
    autoTrack: true,
    conditions: {
      timeframe: 'all_time'
    }
  },
];