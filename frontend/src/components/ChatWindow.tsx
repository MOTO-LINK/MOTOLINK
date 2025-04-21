import { motion, AnimatePresence } from 'framer-motion';
import { useState, useRef, useEffect } from 'react';
import { ChatUser } from '../lib/validationUserCard';
import { IoMdSend } from "react-icons/io";

type ChatMessage = {
  id: string;
  content: string;
  senderId: string;
  timestamp: Date;
  status: 'sent' | 'delivered' | 'read' | 'deleted';
  type?: 'text' ,
  unreadCount?: number;
};

interface ChatWindowProps {
  user: ChatUser;
  messages: ChatMessage[];
  contacts: ChatUser[];
  onSend: (content: string) => void;
}

export const ChatWindow = ({ user, messages, contacts, onSend, }: ChatWindowProps) => {
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = () => {
    if (newMessage.trim()) {
      onSend(newMessage);
      setNewMessage('');
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="flex flex-col w-[68.9%] m-auto absolute top-20 right-0 h-[95.6vh] border-l-2 border-bgwhite bg-bgwhite">
      <div className="bg-goldlight text-white p-3 flex items-center sticky top-0 z-10">

        <button onClick={() => window.history.back()} className="mr-2 p-1 rounded-full hover:bg-gold-1">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        
        <img src={user.avatar} alt={user.name} className="w-10 h-10 rounded-full mr-3 border-2 border-textWhite" />
        
        <div className="flex-1">
          <h2 className="font-bold text-lg">{user.name}</h2>
          <p className="text-xs">
            {user.isOnline ? 'Online' : `Last seen ${formatTime(user.lastSeen || new Date())}`}
          </p>
        </div>

      </div>

      <div className="flex-1 overflow-y-auto p-4 bg-bglight">
        <AnimatePresence>
          {messages.map((message) => (   
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
              className={`flex mb-4 ${message.senderId === 'current-user-id' ? 'justify-end' : 'justify-start'}`}>
                <div className="relative">
                  <div className={`max-w-xs md:max-w-md rounded-lg p-3 ${ message.senderId === 'current-user-id' 
                      ? 'bg-green-100 rounded-tr-none' 
                      : 'bg-bgwhite rounded-tl-none shadow'
                  }`}>
                    <p className="text-text">{message.content}</p>
                    <div className={`text-xs mt-1 flex items-center ${
                      message.senderId === 'current-user-id' ? 'justify-end' : 'justify-start'}`}>
                      <span className="text-textgray">{formatTime(message.timestamp)}</span>
                      {message.senderId === 'current-user-id' && (
                        <span className="ml-1">
                          {message.status === 'read' ? (
                            <svg className="w-3 h-3 text-blue-500" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M18 7l-8 8-4-4-1.5 1.5L9 17l9.5-9.5zM7 14l-1.5-1.5L2 16l5.5 5.5L9 19l-2-2z" />
                            </svg>
                          ) : message.status === 'delivered' ? (
                            <svg className="w-3 h-3 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M18 7l-8 8-4-4-1.5 1.5L9 17l9.5-9.5z" />
                            </svg>
                          ) : null}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
            </motion.div>
          ))}
        </AnimatePresence>
        <div ref={messagesEndRef} />
      </div>

      <div className="bg-bgwhite border-t p-3 sticky bottom-0">
        <div className="flex items-center">               
          <input
            ref={inputRef}
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Type a message..."
            className="flex-1 border rounded-full py-2 px-4 mx-2 focus:outline-none focus:border-green-500"
          />
          
          <button 
            onClick={handleSend}
            className={`rounded-full p-2 mx-1 ${
              newMessage 
                ? 'bg-green-500 text-white hover:bg-green-600' 
                : 'text-gray-400 cursor-not-allowed'
            }`}
            disabled={!newMessage}
          >
            <IoMdSend className="w-6 h-6" />
          </button>
        </div>
      </div>
    </div>
  );
};