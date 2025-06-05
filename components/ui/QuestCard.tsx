import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '~/contexts/ThemeContext';
import { Quest, QuestProgress } from '../../types/quest';
import { useQuestStore } from '~/store/questStore';
import { useAuthStore } from '~/contexts/AuthContext';

export interface QuestCardProps {
  quest: Quest;
  questProgress: QuestProgress;
  onPress?: (questId: string) => void;
  variant?: 'default' | 'compact';
}

function QuestCard({ quest, questProgress, onPress, variant = 'default' }: QuestCardProps) {
  const { colors } = useTheme();
  const { completeQuest, updateQuestProgress } = useQuestStore();
  const authUser = useAuthStore(state => state.user);
  
  const progressPercentage = (questProgress.currentProgress / questProgress.maxProgress) * 100;

  const handleToggleComplete = () => {
    if (!authUser?.id) return;
    
    if (!questProgress.isCompleted) {
      completeQuest(authUser.id, quest.id);
    }
    onPress?.(quest.id);
  };

  const handleStartQuest = () => {
    if (!authUser?.id) return;
    
    if (questProgress.currentProgress === 0) {
      updateQuestProgress(authUser.id, quest.id, 1);
    }
    onPress?.(quest.id);
  };

  const getDifficultyColor = () => {
    switch (quest.difficulty) {
      case 'easy': return colors.success;
      case 'medium': return colors.warning;
      case 'hard': return colors.error;
      default: return colors.primary;
    }
  };

  const getActivityTypeText = () => {
    switch (quest.activityType) {
      case 'message_sent': return 'Auto-tracked from messages';
      case 'question_answered': return 'Auto-tracked from Q&A';
      case 'event_joined': return 'Auto-tracked from events';
      case 'recommendation_given': return 'Auto-tracked from recommendations';
      case 'room_joined': return 'Auto-tracked from room visits';
      case 'daily_active': return 'Auto-tracked from daily activity';
      case 'reaction_given': return 'Auto-tracked from reactions';
      default: return 'Manual tracking';
    }
  };

  if (variant === 'compact') {
    return (
      <Pressable
        style={{
          backgroundColor: colors.surface,
          borderRadius: 16,
          padding: 16,
          marginBottom: 12,
          borderWidth: 1,
          borderColor: questProgress.isCompleted ? colors.success + '33' : colors.border + '33',
          shadowColor: colors.shadow,
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
          elevation: 3,
        }}
        onPress={handleToggleComplete}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
            <Text style={{ fontSize: 24, marginRight: 12 }}>
              {questProgress.isCompleted ? '✅' : quest.icon}
            </Text>
            <View style={{ flex: 1 }}>
              <Text style={{ 
                fontSize: 16, 
                fontWeight: '700', 
                color: colors.text,
                marginBottom: 2,
              }}>
                {quest.title}
              </Text>
              <Text style={{ 
                fontSize: 12, 
                color: colors.textSecondary,
                fontWeight: '500',
              }}>
                {questProgress.currentProgress}/{questProgress.maxProgress} • {quest.points} pts
              </Text>
              {quest.autoTrack && (
                <Text style={{
                  fontSize: 10,
                  color: colors.textTertiary,
                  fontStyle: 'italic',
                }}>
                  🤖 Auto-tracked
                </Text>
              )}
            </View>
          </View>
          
          <View style={{
            width: 40,
            height: 4,
            backgroundColor: colors.border,
            borderRadius: 2,
            overflow: 'hidden',
          }}>
            <View style={{
              width: `${progressPercentage}%`,
              height: '100%',
              backgroundColor: questProgress.isCompleted ? colors.success : colors.primary,
              borderRadius: 2,
            }} />
          </View>
        </View>
      </Pressable>
    );
  }

  return (
    <Pressable
      style={{
        backgroundColor: colors.surface,
        borderRadius: 24,
        padding: 24,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: questProgress.isCompleted ? colors.success + '33' : colors.border + '33',
        shadowColor: colors.shadow,
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 5,
      }}
      onPress={handleToggleComplete}
    >
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
          <View style={{
            backgroundColor: questProgress.isCompleted ? colors.success + '20' : colors.primary + '20',
            width: 48,
            height: 48,
            borderRadius: 16,
            alignItems: 'center',
            justifyContent: 'center',
            marginRight: 12,
          }}>
            <Text style={{ fontSize: 20 }}>
              {questProgress.isCompleted ? '✅' : quest.icon}
            </Text>
          </View>
          <View style={{ flex: 1 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4 }}>
              <Text style={{ 
                fontSize: 20,
                fontWeight: '900',
                color: colors.text,
                marginRight: 8,
              }}>
                {quest.title}
              </Text>
              <View style={{
                backgroundColor: getDifficultyColor() + '20',
                paddingHorizontal: 8,
                paddingVertical: 2,
                borderRadius: 8,
              }}>
                <Text style={{
                  fontSize: 10,
                  fontWeight: '700',
                  color: getDifficultyColor(),
                  textTransform: 'uppercase',
                }}>
                  {quest.difficulty}
                </Text>
              </View>
              {quest.autoTrack && (
                <View style={{
                  backgroundColor: colors.cyber + '20',
                  paddingHorizontal: 6,
                  paddingVertical: 2,
                  borderRadius: 6,
                  marginLeft: 4,
                }}>
                  <Text style={{
                    fontSize: 8,
                    fontWeight: '700',
                    color: colors.cyber,
                    textTransform: 'uppercase',
                  }}>
                    AUTO
                  </Text>
                </View>
              )}
            </View>
            <Text style={{ 
              color: colors.textSecondary,
              fontSize: 14,
              fontWeight: '500',
              marginBottom: 4,
            }}>
              {quest.description}
            </Text>
            <Text style={{
              color: colors.textTertiary,
              fontSize: 12,
              fontStyle: 'italic',
            }}>
              {getActivityTypeText()}
            </Text>
          </View>
        </View>
        
        <LinearGradient
          colors={questProgress.isCompleted ? [colors.success, colors.success] : [colors.neon, colors.cyber]}
          style={{
            paddingHorizontal: 12,
            paddingVertical: 8,
            borderRadius: 16,
            shadowColor: questProgress.isCompleted ? colors.success : colors.neon,
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.3,
            shadowRadius: 4,
            elevation: 4,
          }}
        >
          <Text style={{ 
            color: 'white',
            fontSize: 14,
            fontWeight: '900',
            letterSpacing: 0.5,
          }}>
            {quest.points} pts
          </Text>
        </LinearGradient>
      </View>
      
      {/* Progress Section */}
      <View style={{ marginTop: 16 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
          <Text style={{ 
            color: colors.textTertiary,
            fontSize: 12,
            fontWeight: '600',
            textTransform: 'uppercase',
            letterSpacing: 1,
          }}>
            Progress
          </Text>
          <Text style={{ 
            color: colors.textSecondary,
            fontSize: 14,
            fontWeight: '700',
          }}>
            {questProgress.currentProgress}/{questProgress.maxProgress}
          </Text>
        </View>
        
        <View style={{
          height: 8,
          backgroundColor: colors.border,
          borderRadius: 8,
          overflow: 'hidden',
        }}>
          <LinearGradient
            colors={questProgress.isCompleted ? [colors.success, colors.success] : [colors.neon, colors.cyber]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={{
              height: '100%',
              width: `${progressPercentage}%`,
              borderRadius: 8,
            }}
          />
        </View>
        
        {/* Action Button - Only show for non-auto-tracked quests */}
        {!quest.autoTrack && (
          <Pressable
            style={{
              marginTop: 16,
              backgroundColor: questProgress.isCompleted ? colors.success : colors.primary,
              paddingVertical: 12,
              borderRadius: 16,
              alignItems: 'center',
              shadowColor: questProgress.isCompleted ? colors.success : colors.primary,
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.3,
              shadowRadius: 4,
              elevation: 3,
            }}
            onPress={questProgress.isCompleted ? handleToggleComplete : handleStartQuest}
          >
            <Text style={{
              color: 'white',
              fontSize: 16,
              fontWeight: '900',
              letterSpacing: 0.5,
            }}>
              {questProgress.isCompleted ? '✓ Completed' : questProgress.currentProgress > 0 ? 'Continue' : 'Start Quest'}
            </Text>
          </Pressable>
        )}
        
        {/* Auto-tracking info */}
        {quest.autoTrack && (
          <View style={{
            marginTop: 16,
            padding: 12,
            backgroundColor: colors.cyber + '10',
            borderRadius: 12,
            borderWidth: 1,
            borderColor: colors.cyber + '20',
          }}>
            <Text style={{
              color: colors.cyber,
              fontSize: 14,
              fontWeight: '600',
              textAlign: 'center',
            }}>
              🤖 This quest tracks automatically as you use the app
            </Text>
          </View>
        )}
      </View>
    </Pressable>
  );
}

export { QuestCard };
