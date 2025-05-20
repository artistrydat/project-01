// stores/useItineraryStore.ts
import {create} from 'zustand';
import { mockititerarys } from '~/types/mockdata';
import type { ititerary, Activity } from '~/types/planner.types';

interface ActivityState {
  upvoted: Record<string, boolean>;
  downvoted: Record<string, boolean>;
  toggleUpvote: (activityId: string) => void;
  toggleDownvote: (activityId: string) => void;
  DeleteActivity: (activityId: string) => void;
}

interface ItineraryState {
  itinerary: ititerary | null;
  fetchItinerary: (id: string) => void;
  toggleFavorite: () => void;
  addComment: (content: string) => void;
  toggleCommentLike: (commentId: string) => void;
  toggleCommentDislike: (commentId: string) => void;
}

export const useItineraryStore = create<ItineraryState & ActivityState>((set, get) => ({
  itinerary: null,
  upvoted: {},
  downvoted: {},

  fetchItinerary: (id) => {
    console.log('Fetching ID:', id);
    console.log('Available IDs:', Object.keys(mockititerarys));
    const itinerary = mockititerarys[id];
    console.log('Found itinerary:', !!itinerary);
    set({ itinerary });
  },

  toggleFavorite: () => {
    const { itinerary } = get();
    if (itinerary) {
      set({ itinerary: { ...itinerary, isfavorite: !itinerary.isfavorite } });
    }
  },

  toggleUpvote: (activityId) => {
    set((state) => ({
      upvoted: {
        ...state.upvoted,
        [activityId]: !state.upvoted[activityId]
      }
    }));
  },

  toggleDownvote: (activityId) => {
    set((state) => ({
      downvoted: {
        ...state.downvoted,
        [activityId]: !state.downvoted[activityId]
      }
    }));
  },
 
  DeleteActivity: (activityId: string) => {
    const { itinerary } = get();
    if (itinerary && itinerary.ItineraryDays) {
      // Create a new array of days with the activity filtered out of each day
      const updatedDays = itinerary.ItineraryDays.map(day => ({
        ...day,
        activitys: day.activitys.filter(
          (activity: Activity) => activity.id !== activityId
        )
      }));
      
      set({
        itinerary: {
          ...itinerary,
          ItineraryDays: updatedDays
        }
      });
    }
  },

  addComment: (content) => {
    const { itinerary } = get();
    if (itinerary) {
      const newComment = {
        id: `c${Date.now()}`,
        userId: 'currentUser',
        itineraryId: itinerary.ititeraryId,
        content,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        likes: 0,
        dislikes: 0,
        isliked: false,
        isdislicked: false
      };
      set({
        itinerary: {
          ...itinerary,
          Comments: [...itinerary.Comments, newComment]
        }
      });
    }
  },

  toggleCommentLike: (commentId: string) => {
    const { itinerary } = get();
    if (!itinerary) return;

    set({
      itinerary: {
        ...itinerary,
        Comments: itinerary.Comments.map(comment => {
          if (comment.id === commentId) {
            const wasLiked = comment.isliked;
            // If comment was disliked and user clicks like, remove dislike
            const removeDislike = comment.isdislicked;
            
            return {
              ...comment,
              isliked: !comment.isliked,
              isdislicked: removeDislike ? false : comment.isdislicked,
              likes: wasLiked ? comment.likes - 1 : comment.likes + 1,
              dislikes: removeDislike ? comment.dislikes - 1 : comment.dislikes
            };
          }
          return comment;
        })
      }
    });
  },

  toggleCommentDislike: (commentId: string) => {
    const { itinerary } = get();
    if (!itinerary) return;

    set({
      itinerary: {
        ...itinerary,
        Comments: itinerary.Comments.map(comment => {
          if (comment.id === commentId) {
            const wasDisliked = comment.isdislicked;
            // If comment was liked and user clicks dislike, remove like
            const removeLike = comment.isliked;
            
            return {
              ...comment,
              isdislicked: !comment.isdislicked,
              isliked: removeLike ? false : comment.isliked,
              dislikes: wasDisliked ? comment.dislikes - 1 : comment.dislikes + 1,
              likes: removeLike ? comment.likes - 1 : comment.likes
            };
          }
          return comment;
        })
      }
    });
  }
}));