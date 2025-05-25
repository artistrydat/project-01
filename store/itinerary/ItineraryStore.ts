// stores/useItineraryStore.ts
import {create} from 'zustand';
import { mockititerarys } from '~/types/mockdata';
import type { ititerary, Activity, ItineraryDay } from '~/types/planner.types';

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
  // All accessible itineraries (used in UI components)
  itineraries: {id: string, name: string}[];
  // Loading and error states
  isLoading: boolean;
  error: string | null;
  // Fetch functions
  fetchItinerary: (id: string) => void;
  fetchUserItineraries: (userId: string) => Promise<void>;
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
  itineraries: [], // Added this property
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
        // Calculate total cost based on all activities
        const totalCost = itinerary.ItineraryDays.reduce(
          (sum, day) => sum + day.activitys.reduce(
            (daySum, activity) => daySum + (activity.cost || 0), 0
          ), 0
        );
        
        // Update the itinerary with the calculated total cost
        set({ 
          itinerary: { ...itinerary, totalCost },
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

  // Fetch all itineraries for a user
  fetchUserItineraries: async (userId) => {
    set({ isLoading: true, error: null });
    
    try {
      // In a real app, this would be an API call
      // For now we'll simulate with the mock data
      
      // Simple delay to simulate network request
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Filter mock itineraries that belong to this user
      // In a real app, this filtering would happen on the backend
      const userItineraries = Object.values(mockititerarys).filter(
        itinerary => itinerary.userId === userId
      );
      
      // Calculate totalCost for each itinerary
      const processedItineraries = userItineraries.map(itinerary => {
        const totalCost = itinerary.ItineraryDays.reduce(
          (sum, day) => sum + day.activitys.reduce(
            (daySum, activity) => daySum + (activity.cost || 0), 0
          ), 0
        );
        
        return { ...itinerary, totalCost };
      });
      
      // Also update the itineraries list with simplified data for UI components
      const simplifiedItineraries = processedItineraries.map(itinerary => ({
        id: itinerary.ititeraryId,
        name: itinerary.name
      }));
      
      set({ 
        userItineraries: processedItineraries,
        itineraries: simplifiedItineraries,
        isLoading: false 
      });
    } catch (error) {
      set({ 
        isLoading: false, 
        error: error instanceof Error ? error.message : 'Failed to fetch user itineraries' 
      });
    }
  },

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