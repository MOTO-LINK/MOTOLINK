import { motion } from 'framer-motion';
import { UserCard } from './UserCard';
import { ChatUser } from '../lib/validationUserCard'; 
import { useState, useMemo } from 'react';
type UserGridProps = {
  users: {
    id: string;
    name: string;
    avatar: string;
    isOnline: boolean;
    lastMessage: {
      id: string;
      content: string;
      senderId: string;
      timestamp: Date;
      status: "sent" | "delivered" | "read";
      type?: string;
      unreadCount?: number;
    };
    messages: {
      id: string;
      content: string;
      senderId: string;
      timestamp: Date;
      status: "sent" | "delivered" | "read";
    }[];
    lastSeen?: Date;
  }[];
  onSelect: (user: {
    id: string;
    name: string;
    avatar: string;
    isOnline: boolean;
    lastMessage: {
      id: string;
      content: string;
      senderId: string;
      timestamp: Date;
      status: "sent" | "delivered" | "read";
      type?: string;
      unreadCount?: number;
    };
    messages: {
      id: string;
      content: string;
      senderId: string;
      timestamp: Date;
      status: "sent" | "delivered" | "read";
    }[];
    lastSeen?: Date;
  }) => void;
};
export const UserGrid = ({ users, onSelect }: UserGridProps) => {
  if (!users || users.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex justify-center items-center h-64"
      >
        <p className="text-textWhite">No users found</p>
      </motion.div>
    );
  }
  const [searchTerm, setSearchTerm] = useState('');

  const filteredUsers = useMemo(() => {
    return users.filter(user => 
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.lastMessage.content.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [users, searchTerm]);

  return (
    <div className="container mx-auto">
      <div className="sticky top-0 z-10 p-5 ">
        <div className="bg-textWhite rounded-[4px] px-4 py-3 border-b-[2.5px] border-b-gold-1 flex items-center">
          <svg className="w-5 h-5 text-gold-1 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input 
            type="text" 
            placeholder="Search or start New Chat"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-transparent w-full outline-none text-sm text-text "
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-1 w-[28.5rem] mt-2 m-auto gap-4 max-h-[75vh] overflow-y-auto scrollbar-none scrollbar-thumb-gold-1 scrollbar-track-transparent">
        {filteredUsers.length > 0 ? (
          filteredUsers.map((user, index) => (
            <motion.div 
              key={user.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              onClick={() => onSelect(user)} 
            >
              <UserCard user={user} />
            </motion.div>
          ))
        ): (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="col-span-full flex flex-col items-center justify-center py-10"
          >
            <svg className="w-16 h-16 text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-gray-500 text-lg">No matching users found</p>
            <p className="text-gray-400 text-sm mt-1">Try a different search term</p>
          </motion.div>
        )}
      </div>
    </div>
  );
};