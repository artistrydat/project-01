import { create } from 'zustand';
import React from 'react';
import { useProfileStore } from '../ProfileStore';
import { useItineraryStore } from '../itinerary/ItineraryStore';
import type { EcoImpactStat, EcoImpact } from '~/types/profile.types';
import type { ititerary } from '~/types/planner.types';
import { mockititerarys } from '~/types/mockdata'; // Temporary, for development only

// Extend the base EcoImpact type with our calculated ecoScore
interface EcoImpactWithScore extends EcoImpact {
  ecoScore: number;
}

interface EcoImpactCalState {
  calculatedEcoImpact: EcoImpactWithScore | null;
  isLoading: boolean;
  error: string | null;
  debug: {
    itineraryScores: number[];
    itineraryIds: string[];
    calculationTimestamp: number | null;
  };
  
  // Methods
  calculateEcoImpact: (userId: string) => EcoImpactWithScore | null;
  aggregateEcoStats: (itineraries: ititerary[]) => EcoImpactStat[];
  fetchAndCalculateEcoImpact: (userId: string) => Promise<EcoImpactWithScore | null>;
  clearCache: () => void;
}

export const useEcoImpactCalStore = create<EcoImpactCalState>((set, get) => ({
  calculatedEcoImpact: null,
  isLoading: false,
  error: null,
  debug: {
    itineraryScores: [],
    itineraryIds: [],
    calculationTimestamp: null
  },
  
  clearCache: () => {
    set({
      calculatedEcoImpact: null,
      error: null,
      debug: {
        itineraryScores: [],
        itineraryIds: [],
        calculationTimestamp: null
      }
    });
  },
  
  calculateEcoImpact: (userId: string) => {
    // Get user profile from profile store
    const profiles = useProfileStore.getState().profiles;
    const userProfile = profiles[userId];
    
    if (!userProfile || !userProfile.EcoImpact) {
      console.log("No user profile or EcoImpact found");
      return null;
    }
    
    // Get itinerary IDs from the user profile
    const itineraryIds = userProfile.EcoImpact.itineraryId || [];
    
    if (itineraryIds.length === 0) {
      console.log("No itineraries found");
      // If no itineraries, return existing data with default ecoScore
      return {
        ...userProfile.EcoImpact,
        ecoScore: 50 // Default eco score if none available
      };
    }
    
    // DEBUG: Store itinerary IDs for debugging
    set(state => ({
      debug: {
        ...state.debug,
        itineraryIds
      }
    }));
    
    // Get itineraries from mockdata - TEMPORARY SOLUTION
    // In production, these would come from your API or a proper data store
    const itineraries: ititerary[] = [];
    const scores: number[] = [];
    
    itineraryIds.forEach(itId => {
      const itinerary = mockititerarys[itId];
      if (itinerary) {
        itineraries.push(itinerary);
        if (itinerary.ecoScore !== undefined) {
          scores.push(itinerary.ecoScore);
        }
      }
    });
    
    // DEBUG: Store scores for debugging
    set(state => ({
      debug: {
        ...state.debug,
        itineraryScores: scores
      }
    }));
    
    console.log("Found itineraries:", itineraries.length);
    console.log("Eco scores:", scores);
    
    // Calculate average eco score from all itineraries
    let totalEcoScore = 0;
    let validItineraries = 0;
    
    scores.forEach(score => {
      totalEcoScore += score;
      validItineraries++;
    });
    
    // Calculate average eco score, default to 50 if no valid scores
    const averageEcoScore = validItineraries > 0 
      ? Math.round(totalEcoScore / validItineraries) 
      : 50;
    
    console.log("Calculated average eco score:", averageEcoScore);
    
    // Aggregate stats from all itineraries or use the existing ones
    const aggregatedStats = get().aggregateEcoStats(itineraries);
    
    // Create calculated eco impact data
    const calculatedEcoImpact: EcoImpactWithScore = {
      ecoScore: averageEcoScore,
      itineraryId: itineraryIds,
      stats: aggregatedStats.length > 0 ? aggregatedStats : userProfile.EcoImpact.stats
    };
    
    // Update the state with timestamp for debugging
    set({ 
      calculatedEcoImpact,
      debug: {
        ...get().debug,
        calculationTimestamp: Date.now()
      }
    });
    
    return calculatedEcoImpact;
  },
  
  // Asynchronous method to fetch all required itineraries and then calculate
  fetchAndCalculateEcoImpact: async (userId: string) => {
    set({ isLoading: true, error: null });
    
    try {
      // Clear previous results to ensure fresh calculation
      get().clearCache();
      
      // Get user profile
      const userProfile = useProfileStore.getState().profiles[userId];
      
      if (!userProfile || !userProfile.EcoImpact) {
        set({ isLoading: false });
        return null;
      }
      
      // Get itinerary IDs
      const itineraryIds = userProfile.EcoImpact.itineraryId || [];
      
      if (itineraryIds.length === 0) {
        // If no itineraries, return with default score
        const result = {
          ...userProfile.EcoImpact,
          ecoScore: 50
        };
        set({ calculatedEcoImpact: result, isLoading: false });
        return result;
      }
      
      // Fetch all required itineraries
      for (const itId of itineraryIds) {
        // Wait a bit between fetches to avoid race conditions
        await new Promise(resolve => setTimeout(resolve, 100));
        await useItineraryStore.getState().fetchItinerary(itId);
      }
      
      // Now that itineraries are fetched, calculate the impact
      const result = get().calculateEcoImpact(userId);
      set({ isLoading: false });
      return result;
    } catch (err) {
      console.error("Error calculating eco impact:", err);
      set({ 
        error: err instanceof Error ? err.message : 'Failed to calculate eco impact', 
        isLoading: false 
      });
      return null;
    }
  },
  
  aggregateEcoStats: (itineraries: ititerary[]) => {
    // Define the structure for aggregated stats
    const aggregatedStats: Record<string, { total: number, count: number }> = {
      'Carbon Footprint': { total: 0, count: 0 },
      'Water Usage': { total: 0, count: 0 },
      'Waste Generated': { total: 0, count: 0 }
    };
    
    // Generate environmental stats based on itinerary ecoScores
    itineraries.forEach(itinerary => {
      if (itinerary && itinerary.ecoScore !== undefined) {
        // Higher ecoScore = lower environmental impact
        const ecoScoreFactor = itinerary.ecoScore / 100; // Normalize to 0-1
        
        // Carbon footprint (inverse relationship with ecoScore)
        const carbonFootprint = Math.round((5 - (3 * ecoScoreFactor)) * 10) / 10; 
        aggregatedStats['Carbon Footprint'].total += carbonFootprint;
        aggregatedStats['Carbon Footprint'].count++;
        
        // Water usage (inverse relationship with ecoScore)
        const waterUsage = Math.round(2000 - (800 * ecoScoreFactor));
        aggregatedStats['Water Usage'].total += waterUsage;
        aggregatedStats['Water Usage'].count++;
        
        // Waste generated (inverse relationship with ecoScore)
        const wasteGenerated = Math.round(100 - (60 * ecoScoreFactor));
        aggregatedStats['Waste Generated'].total += wasteGenerated;
        aggregatedStats['Waste Generated'].count++;
      }
    });
    
    // Convert to array format and calculate averages
    const stats: EcoImpactStat[] = Object.keys(aggregatedStats).map(label => {
      const { total, count } = aggregatedStats[label];
      return {
        label,
        value: count > 0 ? Math.round((total / count) * 10) / 10 : 0 // Round to 1 decimal place
      };
    });
    
    return stats;
  }
}));

// Enhanced hook to get calculated eco impact for current profile
export const useCurrentEcoImpact = () => {
  const currentProfileId = useProfileStore(state => state.currentProfileId);
  const { 
    calculatedEcoImpact, 
    fetchAndCalculateEcoImpact,
    isLoading,
    clearCache 
  } = useEcoImpactCalStore();
  
  // Force recalculation on mount
  React.useEffect(() => {
    if (currentProfileId) {
      clearCache();
      fetchAndCalculateEcoImpact(currentProfileId);
    }
  }, [currentProfileId]); // Only depend on profile ID to avoid unnecessary recalculations
  
  return calculatedEcoImpact;
};

// Additional hook to directly access loading state
export const useEcoImpactLoading = () => {
  return useEcoImpactCalStore(state => state.isLoading);
};

// Debug hook to expose internal calculation details
export const useEcoImpactDebug = () => {
  return useEcoImpactCalStore(state => state.debug);
};