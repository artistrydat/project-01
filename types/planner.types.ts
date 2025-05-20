// Types for planner and itinerary
import { MaterialIcons } from '@expo/vector-icons';


export interface ititerary {
  ititeraryId: string;
  userId: string;
  name: string;
  city: string;
  country: string;
  description: string;
  imageUrl: string;
  trendingScore: number;
  ecoScore: number;
  highlights?: Highlight[];
  bestTimeToVisit: string;
  averageCost: string;
  localTips: string;
  startDate: string;
  endDate: string;
  duration: number;
  isfavorite: boolean;
  isShared: boolean;
  isPublic: boolean;
  ItineraryDays: ItineraryDay[];
  Highlights: Highlights[];
  Comments: Comments[];
}

export interface ItineraryDay {
  id: string;
  date: string;
  activitys: Activity[];
  weather: WeatherForecast[];
}

export interface Activity {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  location: {
    lat: number;
    lng: number;
  };
  rating: number;
  reviewsCount: number;
  cost: number;
  openingHours: string[];
  tags: string[];
  type: 'landmark' | 'activity' | 'food' | 'accommodation';
  isUpvoted: boolean;
  isDownvoted: boolean;
  upvoteCount: number;
  downvoteCount: number;
  AiSummary: string;
  AiSummaryRating: number;
}

export interface WeatherForecast {
  id: string;
  date: string;
  summary: string;
  icon: string;
  high: number;
  low: number;
}

export interface Highlights {
  id: string;
  name: string;
  description: string;
  icon: keyof typeof MaterialIcons.glyphMap;
}

export interface Comments {
  id: string;
  userId: string;
  itineraryId: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  likes: number;
  dislikes: number;
  isliked: boolean;
  isdislicked: boolean;
}