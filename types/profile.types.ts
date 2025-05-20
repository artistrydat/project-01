// Types related to user profile and profile screen

export interface BudgetAlert {
  id: string;
  message: string;
  type: 'positive' | 'warning' | 'negative';
}

export interface UserProfile {
  name: string;
  avatar: string;
  location: string;
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
