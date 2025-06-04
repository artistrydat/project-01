import React, { useState, useMemo } from 'react';
import { View, Text, TextInput, ScrollView, Pressable, Alert } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInUp, FadeInLeft, SlideInDown, configureReanimatedLogger, ReanimatedLogLevel } from 'react-native-reanimated';
import { useTheme } from '~/contexts/ThemeContext';
import { useItineraryStore } from '~/store/itinerary/ItineraryStore';

// Configure logger to disable strict mode
configureReanimatedLogger({
  level: ReanimatedLogLevel.warn,
  strict: false,
});

interface CommentsSectionProps {
  maxHeight?: number;
  title?: string;
}

export const CommentsSection = ({ 
  maxHeight = 300,
  title = "Reviews"
}: CommentsSectionProps) => {
  const { colors } = useTheme();
  const { 
    itinerary, 
    addComment, 
    toggleCommentLike, 
    toggleCommentDislike 
  } = useItineraryStore();
  
  const [newComment, setNewComment] = useState('');
  const [isAddingComment, setIsAddingComment] = useState(false);

  // Transform itinerary comments to match the component's expected format
  const comments = useMemo(() => {
    if (!itinerary?.Comments) return [];
    
    return itinerary.Comments.map(comment => ({
      id: comment.id,
      userId: comment.userId,
      content: comment.content,
      createdAt: comment.createdAt,
      likes: comment.likes,
      dislikes: comment.dislikes,
      isLiked: comment.isliked,
      isDisliked: comment.isdislicked
    }));
  }, [itinerary?.Comments]);

  const handleAddComment = () => {
    if (!newComment.trim()) {
      Alert.alert('Empty Comment', 'Please write something before posting.');
      return;
    }
    
    if (!itinerary) {
      Alert.alert('Error', 'No itinerary selected.');
      return;
    }

    addComment(newComment.trim());
    setNewComment('');
    setIsAddingComment(false);
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      const now = new Date();
      const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
      
      if (diffInMinutes < 1) return 'now';
      if (diffInMinutes < 60) return `${diffInMinutes}m`;
      if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h`;
      if (diffInMinutes < 10080) return `${Math.floor(diffInMinutes / 1440)}d`;
      
      return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric'
      });
    } catch {
      return 'now';
    }
  };

  const getUsername = (comment: any) => {
    return comment.username || `User ${comment.userId.slice(-3)}`;
  };

  const getUserInitials = (comment: any) => {
    const username = getUsername(comment);
    return username.split(' ').map((word: string) => word.charAt(0).toUpperCase()).join('').slice(0, 2);
  };

  const commentsCount = comments?.length || 0;

  return (
    <Animated.View 
      entering={FadeInUp.delay(200).duration(600)}
      style={{ paddingBottom: 24 }}
    >
      {/* Unified Header Style - Same as other cards */}
      <LinearGradient
        colors={[colors.primary, colors.electric, colors.accent]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{ paddingHorizontal: 24, paddingVertical: 32 }}
      >
        <Animated.View 
          entering={SlideInDown.delay(300).duration(600)}
          style={{ flexDirection: 'row', alignItems: 'center' }}
        >
          <View style={{
            width: 48,
            height: 48,
            borderRadius: 16,
            alignItems: 'center',
            justifyContent: 'center',
            marginRight: 16,
            backgroundColor: 'rgba(255,255,255,0.15)'
          }}>
            <MaterialIcons name="rate-review" size={28} color="white" />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={{ 
              color: 'white', 
              fontSize: 24, 
              fontWeight: 'bold', 
              marginBottom: 4 
            }}>
              {title}
            </Text>
            <Text style={{ color: 'rgba(255,255,255,0.8)', fontSize: 16 }}>
              {commentsCount} review{commentsCount !== 1 ? 's' : ''} from travelers
            </Text>
          </View>
        </Animated.View>
      </LinearGradient>

      {/* Content - More compact */}
      <View style={{ padding: 16 }}>
        {/* Add Comment Section - Compact */}
        <Animated.View 
          entering={FadeInUp.delay(600).duration(600)}
          style={{
            borderRadius: 12,
            padding: 12,
            marginBottom: 16,
            backgroundColor: colors.backgroundSecondary,
            borderWidth: 1,
            borderColor: colors.border
          }}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
            <LinearGradient colors={[colors.electric, colors.neon]} style={{
              width: 32, height: 32, borderRadius: 8,
              alignItems: 'center', justifyContent: 'center', marginRight: 8
            }}>
              <MaterialIcons name="edit" size={18} color={colors.textInverse} />
            </LinearGradient>
            <Text style={{ color: colors.text, fontWeight: 'bold', fontSize: 16 }}>
              Share Your Experience
            </Text>
          </View>

          {!isAddingComment ? (
            <Pressable 
              onPress={() => setIsAddingComment(true)}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                paddingVertical: 10,
                paddingHorizontal: 12,
                backgroundColor: colors.surface,
                borderRadius: 8,
                borderWidth: 1,
                borderColor: colors.border
              }}
            >
              <Text 
                style={{
                  flex: 1,
                  fontSize: 14,
                  color: colors.textSecondary
                }}
              >
                Add your review...
              </Text>
              <MaterialIcons name="keyboard-arrow-right" size={20} color={colors.textSecondary} />
            </Pressable>
          ) : (
            <View style={{ gap: 12 }}>
              <TextInput
                value={newComment}
                onChangeText={setNewComment}
                placeholder="Share your thoughts about this itinerary..."
                placeholderTextColor={colors.textTertiary}
                multiline
                numberOfLines={3}
                style={{ 
                  fontSize: 14,
                  padding: 12,
                  borderRadius: 8,
                  backgroundColor: colors.surface,
                  color: colors.text,
                  borderWidth: 1,
                  borderColor: colors.border,
                  textAlignVertical: 'top',
                  minHeight: 80
                }}
                autoFocus
              />
              <View style={{ flexDirection: 'row', gap: 8 }}>
                <Pressable 
                  onPress={handleAddComment}
                  style={{ flex: 1 }}
                >
                  <LinearGradient
                    colors={[colors.primary, colors.electric]}
                    style={{
                      borderRadius: 8,
                      paddingVertical: 10,
                      paddingHorizontal: 12,
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <MaterialIcons name="send" size={16} color="white" style={{ marginRight: 6 }} />
                    <Text style={{
                      color: 'white',
                      fontWeight: 'bold',
                      fontSize: 14
                    }}>
                      Post
                    </Text>
                  </LinearGradient>
                </Pressable>
                <Pressable 
                  onPress={() => {
                    setIsAddingComment(false);
                    setNewComment('');
                  }}
                  style={{
                    paddingHorizontal: 12,
                    paddingVertical: 10,
                    borderRadius: 8,
                    backgroundColor: colors.surface,
                    borderWidth: 1,
                    borderColor: colors.border,
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <Text style={{ 
                    color: colors.textSecondary,
                    fontWeight: '600',
                    fontSize: 14
                  }}>
                    Cancel
                  </Text>
                </Pressable>
              </View>
            </View>
          )}
        </Animated.View>

        {/* Comments List - Compact */}
        {commentsCount === 0 ? (
          <Animated.View 
            entering={FadeInUp.delay(800).duration(600)}
            style={{
              paddingVertical: 24,
              alignItems: 'center'
            }}
          >
            <View style={{
              width: 60,
              height: 60,
              borderRadius: 16,
              backgroundColor: `${colors.primary}15`,
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 12
            }}>
              <MaterialIcons name="rate-review" size={32} color={colors.primary} />
            </View>
            <Text 
              style={{
                fontSize: 18,
                fontWeight: 'bold',
                marginBottom: 6,
                color: colors.text
              }}
            >
              No Reviews Yet
            </Text>
            <Text 
              style={{
                textAlign: 'center',
                color: colors.textSecondary,
                fontSize: 14,
                lineHeight: 20,
                paddingHorizontal: 24
              }}
            >
              Be the first to share your experience!
            </Text>
          </Animated.View>
        ) : (
          <ScrollView 
            style={{ maxHeight }}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ gap: 12 }}
          >
            {comments.map((comment, index) => (
              <Animated.View
                key={comment.id}
                entering={FadeInLeft.delay(700 + index * 100).duration(600)}
              >
                <View 
                  style={{
                    borderRadius: 12,
                    padding: 16,
                    backgroundColor: colors.surface,
                    borderWidth: 1,
                    borderColor: colors.border,
                    shadowColor: colors.text,
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.05,
                    shadowRadius: 8,
                    elevation: 2
                  }}
                >
                  {/* Comment Header - Compact */}
                  <View style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    marginBottom: 10
                  }}>
                    <View style={{
                      width: 40,
                      height: 40,
                      borderRadius: 12,
                      backgroundColor: colors.primary,
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginRight: 10
                    }}>
                      <Text style={{
                        color: 'white',
                        fontWeight: 'bold',
                        fontSize: 14
                      }}>
                        {getUserInitials(comment)}
                      </Text>
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text 
                        style={{
                          fontWeight: 'bold',
                          fontSize: 14,
                          color: colors.text,
                          marginBottom: 2
                        }}
                      >
                        {getUsername(comment)}
                      </Text>
                      <Text 
                        style={{
                          fontSize: 12,
                          color: colors.textSecondary,
                          fontWeight: '500'
                        }}
                      >
                        {formatDate(comment.createdAt)}
                      </Text>
                    </View>
                  </View>

                  {/* Comment Content - Compact */}
                  <Text 
                    style={{
                      fontSize: 14,
                      lineHeight: 20,
                      marginBottom: 12,
                      color: colors.text
                    }}
                  >
                    {comment.content}
                  </Text>

                  {/* Comment Actions - Compact */}
                  <View style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: 12,
                    paddingTop: 12,
                    borderTopWidth: 1,
                    borderTopColor: colors.border
                  }}>
                    <Pressable 
                      onPress={() => toggleCommentLike(comment.id)}
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        paddingVertical: 6,
                        paddingHorizontal: 10,
                        borderRadius: 8,
                        backgroundColor: comment.isLiked ? `${colors.primary}15` : colors.backgroundSecondary
                      }}
                    >
                      <MaterialIcons 
                        name={comment.isLiked ? "thumb-up" : "thumb-up-off-alt"} 
                        size={16} 
                        color={comment.isLiked ? colors.primary : colors.textSecondary} 
                      />
                      <Text 
                        style={{
                          marginLeft: 6,
                          fontSize: 12,
                          fontWeight: 'bold',
                          color: comment.isLiked ? colors.primary : colors.textSecondary
                        }}
                      >
                        {comment.likes}
                      </Text>
                    </Pressable>

                    <Pressable 
                      onPress={() => toggleCommentDislike(comment.id)}
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        paddingVertical: 6,
                        paddingHorizontal: 10,
                        borderRadius: 8,
                        backgroundColor: comment.isDisliked ? `${colors.error}15` : colors.backgroundSecondary
                      }}
                    >
                      <MaterialIcons 
                        name={comment.isDisliked ? "thumb-down" : "thumb-down-off-alt"} 
                        size={16} 
                        color={comment.isDisliked ? colors.error : colors.textSecondary} 
                      />
                      <Text 
                        style={{
                          marginLeft: 6,
                          fontSize: 12,
                          fontWeight: 'bold',
                          color: comment.isDisliked ? colors.error : colors.textSecondary
                        }}
                      >
                        {comment.dislikes}
                      </Text>
                    </Pressable>
                  </View>
                </View>
              </Animated.View>
            ))}
          </ScrollView>
        )}
      </View>

      {/* Bottom Accent */}
      <LinearGradient
        colors={['transparent', 'rgba(139, 92, 246, 0.2)']}
        style={{ height: 4 }}
      />
    </Animated.View>
  );
};