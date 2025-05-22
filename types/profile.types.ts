// Types related to user profile and profile screen

export interface BudgetAlert {
  id: string;
  message: string;
  type: 'positive' | 'warning' | 'negative';
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
  EcoImpact: EcoImpact;
  budget: Budget;
  chatRooms: string[];
  itineraries: string[];
  isPremium: boolean,
  isSubscribed: boolean,
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
    ecoFriendlyPreferences: boolean;}
    notifications: {
      newMessages: boolean;
      itineraryUpdates: boolean;
      friendRequests: boolean;
      travelDeals: boolean;
      ecoImpactUpdates: boolean;};
    privacySettings: {
      profileVisibility: 'public' | 'friends' | 'private';
      locationSharing: boolean;
      dataSharingWithPartners: boolean;
    };
}

export interface Budget {
  total: number;
  spent: number;
  currency: string;
  alerts: BudgetAlert[];
}

export interface EcoImpactStat {
  label: string;
  value: string;
  icon: string;
}

export interface EcoImpact {
  ecoScore: number;
  itineraryId: string;
  stats: EcoImpactStat[];
}
