export interface User {
  id: string;
  name: string;
  avatar: string;
  isOnline?: boolean;
  lastSeen?: string;
}

export interface Message {
  id: string;
  user: User;
  text: string;
  timestamp: string;
  date: string;
  likes: number;
  dislikes: number;
  likedBy: string[];
  dislikedBy: string[];
  edited?: boolean;
  editedAt?: string;
  replies?: Message[];
}

export interface ChatRoom {
  roomId: string;
  name: string;
  description?: string;
  participants: number;
  location: string;
  avatar?: string;
  isOnline?: boolean;
  category: 'travel' | 'food' | 'culture' | 'adventure' | 'accommodation';
  tags: string[];
  createdAt: string;
  lastMessage?: string;
  lastMessageTime?: string;
  unreadCount: number;
  isSubscribed: boolean;
  messages: Message[];
  moderators: string[];
  rules?: string[];
}

export interface ChatRoomSummary {
  roomId: string;
  name: string;
  lastMessage?: string;
  timestamp?: string;
  avatar?: string;
  unreadCount?: number;
  isOnline?: boolean;
  participants: number;
  location: string;
  category: ChatRoom['category'];
}