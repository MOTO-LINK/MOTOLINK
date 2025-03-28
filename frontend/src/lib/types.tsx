import {COUNTRIES} from "./countries";

export type SelectMenuOption = typeof COUNTRIES[number]
export interface LastMessage {
  id: string;
  content: string;
  timestamp: Date;
  unreadCount?: number;
}

export interface Message {
  id: string;
  content: string;
  senderId: string;
  timestamp: Date;
  status: 'sent' | 'delivered' | 'read';
  type: 'text' | 'image' | 'file';
}

export interface LastMessage {
  id: string;
  content: string;
  timestamp: Date;
}

export interface User {
  id: string;
  name: string;
  avatar: string;
  isOnline: boolean;
  lastSeen?: Date;
  lastMessage: LastMessage;
  unreadCount: number;
  messages: Message[];
}

export interface Chat {
  id: string;
  participants: User[];
  messages: Message[];
  unreadCount?: number;
  
}