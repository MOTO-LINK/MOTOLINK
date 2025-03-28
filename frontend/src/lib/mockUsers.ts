import { useMemo } from 'react';

const names = [
  "Mostafa Hussein", "Ahmed Mohamed", "Youssef Ali", "Mahmoud Hassan",
  "Omar Ibrahim", "Khaled Samir", "Mohamed Ahmed", "Hassan Mahmoud",
  "Ali Youssef", "Ibrahim Omar", "Samir Khaled", "Fatima Zahra",
  "Aisha Mohamed", "Mariam Ahmed", "Nour Hassan", "Huda Mahmoud",
  "Layla Youssef", "Zainab Omar", "Asmaa Khaled", "Amira Samir"
];

const messages = [
  "I'm on my way to you", "Thank you", "I will send you", 
  "Keep it with you", "I am happy with this", "See you soon",
  "Let's meet tomorrow", "Did you get my message?", "Call me later",
  "Please check the document", "The meeting is at 3 PM",
  "I've completed the task", "Can we reschedule?", "Happy birthday!",
  "Congratulations!", "Please review this", "When are you available?",
  "I'll be late today", "Don't forget the meeting", "Thanks for your help"
];

const randomDate = () => {
  const now = new Date();
  const pastDate = new Date(now);
  pastDate.setDate(now.getDate() - Math.floor(Math.random() * 7));
  pastDate.setHours(Math.floor(Math.random() * 24));
  pastDate.setMinutes(Math.floor(Math.random() * 60));
  return pastDate;
};

const createMockUser = (index: number) => {
  const messageCount = Math.floor(Math.random() * 10) + 1; 
  const userMessages = Array.from({ length: messageCount }, (_, i) => ({
    id: `msg-${index}-${i}`,
    content: messages[Math.floor(Math.random() * messages.length)],
    timestamp: randomDate(),
    unreadCount: Math.random() > 0.7 ? Math.floor(Math.random() * 5) + 1 : undefined,
    senderId: `user-${index}`,
    status: ['sent', 'delivered', 'read'][Math.floor(Math.random() * 3)] as 'sent' | 'delivered' | 'read',
    type: 'text', 
  }));
  
  return {
    id: `user-${index}`,
    name: names[index % names.length],
    avatar: `https://i.pravatar.cc/150?img=${index % 50}`,
    isOnline: Math.random() > 0.5,
    lastSeen: Math.random() > 0.5 ? randomDate() : undefined,
    lastMessage: userMessages[userMessages.length - 1],
    messages: userMessages,
  };
};

export const mockUsers = Array.from({ length: 100 }, (_, i) => createMockUser(i));

export const useFormattedUsers = () => {
  return useMemo(() => mockUsers.map(user => ({
    ...user,
    isOnline: user.isOnline ?? false,
    lastSeen: user.lastSeen ?? new Date(),
    messages: user.messages.map(msg => ({
      ...msg,
      status: msg.status ?? 'delivered',
      type: msg.type ?? 'text',
      senderId: msg.senderId || user.id
    }))
  })), []);
};