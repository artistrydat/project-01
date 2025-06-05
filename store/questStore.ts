import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Quest, mockQuests, UserQuestProgress, ActivityEvent, QuestProgress } from '../types/quest';
import { useAuthStore } from '../contexts/AuthContext';

interface QuestState {
  quests: Quest[];
  userQuestProgress: Record<string, UserQuestProgress[]>; // userId -> progress array
  userPoints: Record<string, number>; // userId -> points
  isLoading: boolean;
  
  // Initialization
  initializeQuests: () => void;
  initializeUserProgress: (userId: string) => void;
  
  // Quest management
  getUserQuests: (userId: string) => QuestProgress[];
  getUserPoints: (userId: string) => number;
  getCompletedQuestsCount: (userId: string) => number;
  
  // Activity tracking
  trackActivity: (activity: ActivityEvent) => void;
  processActivityForQuests: (activity: ActivityEvent) => void;
  
  // Manual quest operations
  completeQuest: (userId: string, questId: string) => void;
  updateQuestProgress: (userId: string, questId: string, progress: number) => void;
  
  // Utilities
  resetUserQuests: (userId: string) => void;
  calculateUserLevel: (userId: string) => number;
}

export const useQuestStore = create<QuestState>()(
  persist(
    (set, get) => ({
      quests: mockQuests,
      userQuestProgress: {},
      userPoints: {},
      isLoading: false,

      initializeQuests: () => {
        const { quests } = get();
        if (quests.length === 0) {
          set({ quests: mockQuests });
        }
      },

      initializeUserProgress: (userId: string) => {
        const { userQuestProgress, quests } = get();
        
        if (!userQuestProgress[userId]) {
          const initialProgress: UserQuestProgress[] = quests.map(quest => ({
            userId,
            questId: quest.id,
            progress: 0,
            completed: false,
            lastUpdated: new Date(),
            activityData: {
              messagesSent: 0,
              questionsAnswered: 0,
              photosShared: 0,
              eventsJoined: 0,
              recommendationsGiven: 0,
              roomsJoined: 0,
              dailyActiveStreak: 0,
              reactionsGiven: 0,
            }
          }));

          set({
            userQuestProgress: {
              ...userQuestProgress,
              [userId]: initialProgress
            },
            userPoints: {
              ...get().userPoints,
              [userId]: 0
            }
          });
        }
      },

      getUserQuests: (userId: string): QuestProgress[] => {
        const { userQuestProgress, quests } = get();
        const userProgress = userQuestProgress[userId] || [];
        
        return quests.map(quest => {
          const progress = userProgress.find(p => p.questId === quest.id);
          return {
            questId: quest.id,
            currentProgress: progress?.progress || 0,
            maxProgress: quest.total,
            isCompleted: progress?.completed || false,
            completedAt: progress?.completedAt,
          };
        });
      },

      getUserPoints: (userId: string) => {
        return get().userPoints[userId] || 0;
      },

      getCompletedQuestsCount: (userId: string) => {
        const { userQuestProgress } = get();
        const userProgress = userQuestProgress[userId] || [];
        return userProgress.filter(p => p.completed).length;
      },

      trackActivity: (activity: ActivityEvent) => {
        const { processActivityForQuests } = get();
        console.log(`[Quest] Tracking activity: ${activity.type} for user ${activity.userId}`);
        processActivityForQuests(activity);
      },

      processActivityForQuests: (activity: ActivityEvent) => {
        const { userQuestProgress, quests, userPoints } = get();
        const { userId } = activity;
        
        // Initialize user progress if needed
        if (!userQuestProgress[userId]) {
          get().initializeUserProgress(userId);
        }

        const currentProgress = [...(userQuestProgress[userId] || [])];
        let pointsEarned = 0;

        // Process each quest that matches the activity type
        const updatedProgress = currentProgress.map(userQuest => {
          const quest = quests.find(q => q.id === userQuest.questId);
          
          if (!quest || !quest.autoTrack || userQuest.completed) {
            return userQuest;
          }

          // Check if activity matches quest requirements - FIXED: now types match
          if (quest.activityType === activity.type) {
            const meetsConditions = checkActivityConditions(activity, quest);
            
            if (meetsConditions) {
              const newProgress = Math.min(userQuest.progress + 1, quest.total);
              const isNowCompleted = newProgress >= quest.total && !userQuest.completed;
              
              if (isNowCompleted) {
                pointsEarned += quest.points;
                console.log(`[Quest] ${quest.title} completed! Earned ${quest.points} points`);
              }

              // Update activity data - FIXED: updated switch cases to match ActivityEvent types
              const updatedActivityData = { ...userQuest.activityData };
              switch (activity.type) {
                case 'message_sent':
                  updatedActivityData.messagesSent = (updatedActivityData.messagesSent || 0) + 1;
                  break;
                case 'question_answered':
                  updatedActivityData.questionsAnswered = (updatedActivityData.questionsAnswered || 0) + 1;
                  break;
                case 'event_joined':
                  updatedActivityData.eventsJoined = (updatedActivityData.eventsJoined || 0) + 1;
                  break;
                case 'recommendation_given':
                  updatedActivityData.recommendationsGiven = (updatedActivityData.recommendationsGiven || 0) + 1;
                  break;
                case 'room_joined':
                  updatedActivityData.roomsJoined = (updatedActivityData.roomsJoined || 0) + 1;
                  break;
                case 'reaction_given':
                  updatedActivityData.reactionsGiven = (updatedActivityData.reactionsGiven || 0) + 1;
                  break;
              }

              return {
                ...userQuest,
                progress: newProgress,
                completed: isNowCompleted || userQuest.completed,
                completedAt: isNowCompleted ? new Date() : userQuest.completedAt,
                lastUpdated: new Date(),
                activityData: updatedActivityData,
              };
            }
          }
          
          return userQuest;
        });

        // Update state
        set({
          userQuestProgress: {
            ...userQuestProgress,
            [userId]: updatedProgress
          },
          userPoints: {
            ...userPoints,
            [userId]: (userPoints[userId] || 0) + pointsEarned
          }
        });
      },

      completeQuest: (userId: string, questId: string) => {
        const { userQuestProgress, quests, userPoints } = get();
        const userProgress = userQuestProgress[userId] || [];
        const quest = quests.find(q => q.id === questId);
        
        if (!quest) return;

        const updatedProgress = userProgress.map(p => 
          p.questId === questId && !p.completed
            ? { 
                ...p, 
                completed: true, 
                progress: quest.total,
                completedAt: new Date(),
                lastUpdated: new Date()
              }
            : p
        );

        const wasCompleted = userProgress.find(p => p.questId === questId)?.completed;
        const pointsToAdd = wasCompleted ? 0 : quest.points;

        set({
          userQuestProgress: {
            ...userQuestProgress,
            [userId]: updatedProgress
          },
          userPoints: {
            ...userPoints,
            [userId]: (userPoints[userId] || 0) + pointsToAdd
          }
        });

        if (!wasCompleted) {
          console.log(`[Quest] Manually completed: ${quest.title}, earned ${quest.points} points`);
        }
      },

      updateQuestProgress: (userId: string, questId: string, progress: number) => {
        const { userQuestProgress, quests } = get();
        const userProgress = userQuestProgress[userId] || [];
        const quest = quests.find(q => q.id === questId);
        
        if (!quest) return;

        const updatedProgress = userProgress.map(p => 
          p.questId === questId
            ? { 
                ...p, 
                progress: Math.min(progress, quest.total),
                lastUpdated: new Date()
              }
            : p
        );

        set({
          userQuestProgress: {
            ...userQuestProgress,
            [userId]: updatedProgress
          }
        });

        // Auto-complete if progress reaches total
        const updatedQuest = updatedProgress.find(p => p.questId === questId);
        if (updatedQuest && updatedQuest.progress >= quest.total && !updatedQuest.completed) {
          get().completeQuest(userId, questId);
        }
      },

      resetUserQuests: (userId: string) => {
        const { userQuestProgress, userPoints } = get();
        const newUserQuestProgress = { ...userQuestProgress };
        const newUserPoints = { ...userPoints };
        
        delete newUserQuestProgress[userId];
        delete newUserPoints[userId];
        
        set({
          userQuestProgress: newUserQuestProgress,
          userPoints: newUserPoints
        });
      },

      calculateUserLevel: (userId: string) => {
        const points = get().getUserPoints(userId);
        return Math.floor(points / 100) + 1; // Level up every 100 points
      },
    }),
    {
      name: 'quest-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

// Helper function to check if activity meets quest conditions
function checkActivityConditions(activity: ActivityEvent, quest: Quest): boolean {
  const { conditions } = quest;
  if (!conditions) return true;

  // Check message length
  if (conditions.minMessageLength && activity.metadata?.messageLength) {
    if (activity.metadata.messageLength < conditions.minMessageLength) {
      return false;
    }
  }

  // Check if media is required
  if (conditions.requiresMedia && !activity.metadata?.hasMedia) {
    return false;
  }

  // Check room type
  if (conditions.roomType && activity.metadata?.roomType) {
    if (!conditions.roomType.includes(activity.metadata.roomType)) {
      return false;
    }
  }

  return true;
}

// Hook to easily track activities
export const useActivityTracker = () => {
  const { trackActivity } = useQuestStore();
  const authUser = useAuthStore(state => state.user);

  const trackUserActivity = (
    type: ActivityEvent['type'], 
    metadata?: ActivityEvent['metadata'],
    roomId?: string
  ) => {
    if (!authUser?.id) return;

    trackActivity({
      type,
      userId: authUser.id,
      roomId,
      timestamp: new Date(),
      metadata,
    });
  };

  return { trackUserActivity };
};