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
  // Single itinerary view
  itinerary: ititerary | null;
  // Multiple user itineraries
  userItineraries: ititerary[];
  // Loading and error states
  isLoading: boolean;
  error: string | null;
  // Fetch functions
  fetchItinerary: (id: string) => void;
  fetchUserItineraries: (userId: string) => Promise<void>;
  fetchPublicItineraries: () => Promise<void>;
  // Existing functions
  toggleFavorite: () => void;
  addComment: (content: string) => void;
  toggleCommentLike: (commentId: string) => void;
  toggleCommentDislike: (commentId: string) => void;
  // Cost calculation functions
  calculateTotalCost: () => number;
  calculateDayCost: (dayId: string) => number;
  getTotalActivitiesCount: () => number;
}

export const useItineraryStore = create<ItineraryState & ActivityState>((set, get) => ({
  // State
  itinerary: null,
  userItineraries: [],
  isLoading: false,
  error: null,
  upvoted: {},
  downvoted: {},

  // Fetch a single itinerary by ID
  fetchItinerary: (id) => {
    set({ isLoading: true, error: null });
    
    try {
      console.log('Fetching ID:', id);
      console.log('Available IDs:', Object.keys(mockititerarys));
      const itinerary = mockititerarys[id];
      console.log('Found itinerary:', !!itinerary);
      
      if (itinerary) {
        set({ 
          itinerary: { ...itinerary },
          isLoading: false 
        });
      } else {
        set({ 
          itinerary: null,
          isLoading: false,
          error: 'Itinerary not found' 
        });
      }
    } catch (error) {
      set({ 
        isLoading: false, 
        error: error instanceof Error ? error.message : 'Failed to fetch itinerary' 
      });
    }
  },
  // Toggle favorite status of the current itinerary
  toggleFavorite: () => {
    const { itinerary } = get();
    if (itinerary) {
      set({ itinerary: { ...itinerary, isfavorite: !itinerary.isfavorite } });
      
      // Also update in userItineraries if it exists there
      const { userItineraries } = get();
      if (userItineraries.length > 0) {
        set({
          userItineraries: userItineraries.map(item => 
            item.ititeraryId === itinerary.ititeraryId 
              ? { ...item, isfavorite: !item.isfavorite }
              : item
          )
        });
      }
    }
  },

  // Toggle upvote or downvote for an activity
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
      
      // Calculate the new total cost after removing the activity
      const newTotalCost = updatedDays.reduce(
        (sum, day) => sum + day.activitys.reduce(
          (daySum, activity) => daySum + (activity.cost || 0), 0
        ), 0
      );
      
      set({
        itinerary: {
          ...itinerary,
          ItineraryDays: updatedDays,
          totalCost: newTotalCost
        }
      });
    }
  },

  // Calculate total cost across all days
  calculateTotalCost: () => {
    const { itinerary } = get();
    if (!itinerary || !itinerary.ItineraryDays) return 0;
    
    return itinerary.ItineraryDays.reduce(
      (sum, day) => sum + day.activitys.reduce(
        (daySum, activity) => daySum + (activity.cost || 0), 0
      ), 0
    );
  },
  
  // Calculate cost for a specific day
  calculateDayCost: (dayId: string) => {
    const { itinerary } = get();
    if (!itinerary || !itinerary.ItineraryDays) return 0;
    
    const day = itinerary.ItineraryDays.find(d => d.id === dayId);
    if (!day) return 0;
    
    return day.activitys.reduce((sum, activity) => sum + (activity.cost || 0), 0);
  },
  
  // Get total activities count
  getTotalActivitiesCount: () => {
    const { itinerary } = get();
    if (!itinerary || !itinerary.ItineraryDays) return 0;
    
    return itinerary.ItineraryDays.reduce(
      (sum, day) => sum + day.activitys.length, 0
    );
  },
  // Add a comment to the itinerary
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

  // Toggle like or dislike for a comment
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

  // Toggle dislike for a comment
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
  },
  // Fetch itineraries for a specific user
  fetchUserItineraries: async (userId: string) => {
    set({ isLoading: true, error: null });
    try {
      // Mock implementation - replace with actual API call
      const userItineraries = Object.values(mockititerarys).filter(
        itinerary => itinerary.userId === userId
      );
      set({ userItineraries, isLoading: false });
    } catch (error) {
      set({ 
        isLoading: false, 
        error: error instanceof Error ? error.message : 'Failed to fetch user itineraries' 
      });
    }
  },

  // Fetch public itineraries
  fetchPublicItineraries: async () => {
    set({ isLoading: true, error: null });
    try {
      // Mock implementation - replace with actual API call
      const publicItineraries = Object.values(mockititerarys).filter(
        itinerary => itinerary.isPublic
      );
      set({ userItineraries: publicItineraries, isLoading: false });
    } catch (error) {
      set({ 
        isLoading: false, 
        error: error instanceof Error ? error.message : 'Failed to fetch public itineraries' 
      });
    }
  }
}));