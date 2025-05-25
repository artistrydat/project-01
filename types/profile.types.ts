// profile.types.ts

export interface ItineraryBudget {
  itineraryId: string;
  totalBudget: number;
  actual: number;
  remaining: number;
  currency: string;
}
export interface EcoImpactStat {
  label: string;
  value: number;
}

export interface EcoImpact {
  itineraryId: string[];
  stats: EcoImpactStat[];
}

export interface UserProfile {
  id: string;
  username: string;
  name: string;
  email: string;
  phone: string;
  avatar: string;
  location: string;
  locationCoordinates: {
    latitude: number;
    longitude: number;
  };
  stats: {
    posts: number;
    followers: number;
    following: number;
  };
  credits: number;
  isVerified: boolean;
  isFollowing: boolean;
  isFollowingBack: boolean;
  isBlocked: boolean;
  isFriend: boolean;
  lastActive: string;
  memberSince: string;
  badges: string[];
  bio: string;
  interests: string[];
  friends: string[];
  travelHistory: string[];
  travelGoals: string[];
  chatRooms: string[];
  itineraries: string[];
  isPremium: boolean;
  isSubscribed: boolean;
  travelPreferences: {
    preferredDestinations: string[];
    travelStyles: string[];
    preferredActivities: string[];
    budgetRange: {
      min: number;
      max: number;
    };
    travelCompanions: string[];
    accommodationPreferences: string[];
    transportationPreferences: string[];
    dietaryRestrictions: string[];
    accessibilityNeeds: string[];
    languagePreferences: string[];
    ecoFriendlyPreferences: boolean;
  };
  notifications: {
    newMessages: boolean;
    itineraryUpdates: boolean;
    friendRequests: boolean;
    travelDeals: boolean;
    ecoImpactUpdates: boolean;
  };
  privacySettings: {
    profileVisibility: 'public' | 'friends' | 'private';
    locationSharing: boolean;
    dataSharingWithPartners: boolean;
  };
}
