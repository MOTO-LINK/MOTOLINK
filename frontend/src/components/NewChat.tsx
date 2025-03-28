import { useState } from 'react';
import { UserGrid } from './UserGrid';
import { ChatWindow } from './ChatWindow';
import { mockUsers } from '../lib/mockUsers';
import { ChatUser, ChatMessage } from '../lib/validationUserCard';

export const NewChat = () => {
  const [selectedUser, setSelectedUser] = useState<ChatUser | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  const formattedUsers = mockUsers.map(user => ({
    ...user,
    isOnline: user.isOnline ?? false,
    lastSeen: user.lastSeen ?? new Date(),
    messages: user.messages.map(msg => ({
      ...msg,
      status: msg.status ?? 'delivered',
      type: msg.type ?? 'text',
      senderId: msg.senderId || user.id
    }))
  }));

  const handleSendMessage = (content: string) => {
    if (!selectedUser) return;

    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      content,
      timestamp: new Date(),
      senderId: 'current-user-id',
      status: 'sent',
      type: 'text',
      unreadCount: 1
    };
    
    setMessages([...messages, newMessage]);

    setTimeout(() => {
      const reply: ChatMessage = {
        id: (Date.now() + 1).toString(),
        content: 'Thanks for your message!',
        timestamp: new Date(),
        senderId: selectedUser.id,
        status: 'delivered',
        type: 'text'
      };
      setMessages(prev => [...prev, reply]);
    }, 1000);
  };

  return (
    <div className="flex h-screen">
      <div className="w-1/3 border-r bg-white">
        <UserGrid 
          users={formattedUsers}
          onSelect={(user: ChatUser) => {
            setSelectedUser(user);
            setMessages(user.messages.map(msg => ({
              ...msg,
              status: msg.status ?? 'delivered',
              type: msg.type ?? 'text',
              senderId: msg.senderId || user.id
            })));
          }} 
        />
      </div>
      
      <div className="flex-1">
        {selectedUser ? (
          <ChatWindow 
            user={selectedUser}
            messages={messages}
            onBack={() => setSelectedUser(null)}
            onSend={handleSendMessage}
          />
        ) : (
          <div className="flex items-center justify-center h-full bg-gray-50">
            <div className="text-center p-6">
              <h2 className="text-xl font-semibold mb-2">Select a chat to start messaging</h2>
              <p className="text-gray-500">Choose from your existing conversations</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};