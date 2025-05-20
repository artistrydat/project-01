// components/CommentsSection.tsx
import { View, Text, TextInput, TouchableOpacity, Image, ScrollView } from 'react-native';
import { useRef, useState } from 'react';
import { useItineraryStore } from '~/store/itinerary/ItineraryStore';
import { Ionicons } from '@expo/vector-icons';
import { formatDistanceToNow } from 'date-fns';
import type { Comments } from '~/types/planner.types';


interface CommentsProps {
  comments?: Comments[];
  onAddComment?: (text: string) => void;
  onToggleLike?: (commentId: string) => void;
  onToggleDislike?: (commentId: string) => void;
  maxHeight?: number;
  title?: string;
}

export const CommentsSection = ({
  comments: propComments,
  onAddComment,
  onToggleLike,
  onToggleDislike,
  maxHeight = 80,
  title = "Comments"
}: CommentsProps = {}) => {
  const { itinerary, addComment, toggleCommentLike, toggleCommentDislike } = useItineraryStore();
  const comments = propComments || itinerary?.Comments || [];
  const inputRef = useRef<TextInput>(null);
  const [commentText, setCommentText] = useState('');

  const handleSubmitComment = () => {
    if (commentText.trim()) {
      if (onAddComment) {
        onAddComment(commentText);
      } else {
        addComment(commentText);
      }
      setCommentText('');
      inputRef.current?.clear();
    }
  };

  const handleToggleLike = (commentId: string) => {
    if (onToggleLike) {
      onToggleLike(commentId);
    } else {
      toggleCommentLike(commentId);
    }
  };

  const handleToggleDislike = (commentId: string) => {
    if (onToggleDislike) {
      onToggleDislike(commentId);
    } else {
      toggleCommentDislike(commentId);
    }
  };

  return (
    <View className="py-4">
      <Text className="text-tertiary text-xl font-bold mb-4">{title} ({comments.length})</Text>
      
      {/* Comment input */}
      <View className="flex-row items-center mb-6">
        <View className="flex-1 flex-row items-center bg-gray-100 rounded-full pr-2">
          <TextInput
            ref={inputRef}
            className="flex-1 py-3 px-4 text-gray-800"
            placeholder="Add a comment..."
            placeholderTextColor="#9CA3AF"
            value={commentText}
            onChangeText={setCommentText}
          />
        </View>
        <TouchableOpacity 
          onPress={handleSubmitComment}
          className="bg-primary w-10 h-10 rounded-full ml-2 items-center justify-center"
          disabled={!commentText.trim()}
        >
          <Ionicons name="arrow-forward" size={18} color="#0D8ABC" />
        </TouchableOpacity>
      </View>

      {/* Comments list */}
      <ScrollView className={`max-h-${maxHeight}`}>
        {comments.map((comment) => (
          <View key={comment.id} className="mb-4 rounded-lg shadow p-4 border border-primary">
            <View className="flex-row items-center mb-2">
              <Image 
                source={{ uri: `https://ui-avatars.com/api/?name=${comment.userId}&background=random` }} 
                className="w-8 h-8 rounded-full mr-2"
              />
              <View className="flex-1">
                <Text className="text-tertiary font-bold">{comment.userId}</Text>
                <Text className="text-gray-500 text-xs">
                  {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
                </Text>
              </View>
            </View>
            
            <Text className="text-tertiary text-sm mb-3">{comment.content}</Text>
            
            <View className="flex-row items-center">
              <TouchableOpacity 
                onPress={() => handleToggleLike(comment.id)}
                className="flex-row items-center mr-4"
              >
                <Ionicons 
                  name={comment.isliked ? "thumbs-up" : "thumbs-up-outline"} 
                  size={18} 
                  color={comment.isliked ? "#0D8ABC" : "#666"} 
                />
                <Text className={`ml-1 text-xs ${comment.isliked ? "text-secondary font-bold" : "text-gray-500"}`}>
                  {comment.likes}
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                onPress={() => handleToggleDislike(comment.id)}
                className="flex-row items-center"
              >
                <Ionicons 
                  name={comment.isdislicked ? "thumbs-down" : "thumbs-down-outline"} 
                  size={18} 
                  color={comment.isdislicked ? "#FF6B6B" : "#666"} 
                />
                <Text className={`ml-1 text-xs ${comment.isdislicked ? "text-red-500 font-bold" : "text-gray-500"}`}>
                  {comment.dislikes}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};