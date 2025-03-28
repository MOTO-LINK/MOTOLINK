import { useEffect, useState } from 'react';
import { mockUsers } from './mockUsers';
import { ChatUser, ChatMessage } from './validationUserCard';

export const useChat = () => {
  const [users, setUsers] = useState<ChatUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        await new Promise(resolve => setTimeout(resolve, 800));
        
        const validatedUsers = mockUsers.map(user => ({
          ...user,
          isOnline: user.isOnline ?? false,
          lastSeen: user.lastSeen ?? new Date(),
          messages: user.messages.map(msg => ({
            ...msg,
            senderId: msg.senderId || user.id,
            status: msg.status || 'delivered',
            type: msg.type || 'text',
            unreadCount: msg.unreadCount ?? 0
          }))
        }));
        
        setUsers(validatedUsers);
        setError(null);
      } catch (err) {
        setError('Failed to fetch users');
        console.error('Error fetching users:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const addMessage = (userId: string, content: string) => {
    setUsers(prevUsers => 
      prevUsers.map(user => {
        if (user.id === userId) {
          const newMessage: ChatMessage = {
            id: `msg-${Date.now()}`,
            content,
            timestamp: new Date(),
            senderId: 'current-user-id',
            status: 'sent',
            type: 'text',
            unreadCount: 1
          };
          
          return {
            ...user,
            lastMessage: {
              id: newMessage.id,
              content: newMessage.content,
              timestamp: newMessage.timestamp,
              senderId: newMessage.senderId,
              status: newMessage.status,
              type: newMessage.type,
              unreadCount: newMessage.unreadCount
            },
            messages: [...user.messages, newMessage]
          };
        }
        return user;
      })
    );
  };

  return { 
    users, 
    loading, 
    error,
    addMessage,
  };
};