// Types for chat and messaging

export interface Message {
  id: string;
  user: {
    id: string;
    name: string;
    avatar: string;
  };
  text: string;
  timestamp: string;
  date: string;
}
