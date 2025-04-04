import { motion, AnimatePresence } from 'framer-motion';
import { useState, useRef, useEffect, useCallback } from 'react';
import { ChatUser } from '../lib/validationUserCard';
import { IoMdCheckmark } from "react-icons/io";
import { IoMdClose } from "react-icons/io";
import { IoMdSend } from "react-icons/io";
import { AttachmentMenu } from './AttachmentMenu';
import { CustomEmojiPicker } from './EmojiPicker';
type ChatMessage = {
  id: string;
  content: string;
  senderId: string;
  timestamp: Date;
  status: 'sent' | 'delivered' | 'read' | 'deleted';
  type?: 'text' | 'image' | 'document'; 
  unreadCount?: number;
  edited?: boolean;
  replyTo?: string;
  previewContent?: string;
  originalContent?: string; 
  editTimestamp?: Date; 
  file?: File; 
};

interface ChatWindowProps {
  user: ChatUser;
  messages: ChatMessage[];
  contacts: ChatUser[];
  onSend: (content: string, replyTo?: string, file?: File) => void;
  onEdit: (messageId: string, newContent: string) => void;
  onDelete: (messageId: string) => void;
  onForward: (messageId: string, toUserId: string) => void;
}

export const ChatWindow = ({ 
  user, 
  messages, 
  contacts, 
  onSend, 
  onEdit, 
  onDelete, 
  onForward 
}: ChatWindowProps) => {
  // States
  const [newMessage, setNewMessage] = useState('');
  const [editingMessage, setEditingMessage] = useState<ChatMessage | null>(null);
  const [replyingTo, setReplyingTo] = useState<ChatMessage | null>(null);
  const [hoveredMessage, setHoveredMessage] = useState<string | null>(null);
  const [forwardingMessage, setForwardingMessage] = useState<ChatMessage | null>(null);
  const [showContacts, setShowContacts] = useState(false);
  const [showAttachmentMenu, setShowAttachmentMenu] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const useObjectURL = (file: File | undefined) => {
    const [url, setUrl] = useState<string | null>(null);
  
    useEffect(() => {
      if (!file) return;
  
      const objectUrl = URL.createObjectURL(file);
      setUrl(objectUrl);
  
      return () => {
        URL.revokeObjectURL(objectUrl);
      };
    }, [file]);
  
    return url;
  };

  const handleAttachmentSelect = (file: File, type: 'image' | 'document') => {
    setShowAttachmentMenu(false);
    if (!file) return; 
    const message: ChatMessage = {
      id: Date.now().toString(),
      content: type === 'image' ? '[Image]' : `[Document: ${file.name}]`,
      senderId: 'current-user-id',
      timestamp: new Date(),
      status: 'sent',
      type,
      file 
    };
    
    onSend(message.content, undefined, file); 
  };

  const handleEmojiSelect = (emoji: string) => {
    setNewMessage(prev => prev + emoji);
    setShowEmojiPicker(false);
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, replyingTo]);

  const handleSend = () => {
    if (newMessage.trim()) {
      if (editingMessage) {
        onEdit(editingMessage.id, newMessage);
        setEditingMessage(null);
      } else {
        onSend(newMessage, replyingTo?.id);
        setReplyingTo(null);
      }
      setNewMessage('');
    }
  };

  const handleReply = useCallback((message: ChatMessage) => {
    const messageElement = document.getElementById(`message-${message.id}`);
    if (messageElement) {
      messageElement.animate([
        { transform: 'translateY(0)', opacity: 1 },
        { transform: 'translateY(-3px)', opacity: 0.8 },
        { transform: 'translateY(0)', opacity: 1 }
      ], {
        duration: 300,
        easing: 'ease-in-out'
      });
    }
    setReplyingTo({
      ...message,
      timestamp: new Date() 
    });
    setEditingMessage(null);
    setHoveredMessage(null);
    setForwardingMessage(null);
    requestAnimationFrame(() => {
      inputRef.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'center'
      });
      setTimeout(() => {
        inputRef.current?.focus({ preventScroll: true });
      }, 300);
    });
    const cleanup = () => {
      if (messageElement) {
        messageElement.style.removeProperty('background');
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setReplyingTo(null);
        cleanup();
      }
    };
  
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      cleanup();
    };
  }, []);

  const handleEdit = useCallback((message: ChatMessage) => {
    const messageElement = document.getElementById(`message-${message.id}`);
    if (messageElement) {
      messageElement.animate([
        { backgroundColor: 'rgba(220, 252, 231, 0.5)' },
        { backgroundColor: 'rgba(220, 252, 231, 1)' },
        { backgroundColor: 'rgba(220, 252, 231, 0.5)' }
      ], {
        duration: 800,
        iterations: 2
      });
    }
  
    setEditingMessage({
      ...message,
      originalContent: message.content, 
      editTimestamp: new Date() 
    });
    setReplyingTo(null);
    setHoveredMessage(null);
    setForwardingMessage(null);
    setNewMessage(message.content);
    setTimeout(() => {
      inputRef.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'center'
      });
      inputRef.current?.focus({
        preventScroll: true
      });
    }, 100);
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setEditingMessage(null);
        setNewMessage('');
        document.removeEventListener('keydown', handleKeyDown);
      }
    };
  
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);
  const handleSendEdit = () => {
    if (editingMessage && newMessage.trim() && newMessage !== editingMessage.originalContent) {
      onEdit(editingMessage.id, newMessage);
      if (inputRef.current) {
        inputRef.current.animate([
          { backgroundColor: 'transparent' },
          { backgroundColor: '#e5f7ed' },
          { backgroundColor: 'transparent' }
        ], { duration: 800 });
      }
      setEditingMessage(null);
      setNewMessage('');
      setTimeout(() => {
        const editedMessageElement = document.getElementById(`message-${editingMessage.id}`);
        editedMessageElement?.scrollIntoView({
          behavior: 'smooth',
          block: 'center'
        });
      }, 300);
    }
  };

  const handleDelete = (message: ChatMessage) => {
    onDelete(message.id);
    setHoveredMessage(null);
  };

  const handleForward = (message: ChatMessage) => {
    setForwardingMessage(message);
    setHoveredMessage(null);
  };

  const cancelActions = () => {
    setEditingMessage(null);
    setReplyingTo(null);
    setNewMessage('');
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
              className={`flex mb-4 ${message.senderId === 'current-user-id' ? 'justify-end' : 'justify-start'}`}
              onMouseEnter={() => setHoveredMessage(message.id)}
              onMouseLeave={() => setHoveredMessage(null)}
            >
              {message.status === 'deleted' ? (
                <div className="bg-gray-100 rounded-lg p-3 italic text-gray-500 max-w-xs md:max-w-md">
                  Message was deleted
                </div>
              ) : (
                <div className="relative">
                  <div className={`max-w-xs md:max-w-md rounded-lg p-3 ${
                    message.senderId === 'current-user-id' 
                      ? 'bg-green-100 rounded-tr-none' 
                      : 'bg-white rounded-tl-none shadow'
                  }`}>
                    {message.replyTo && (
                      <div className="bg-gray-50 border-l-4 border-gray-300 pl-2 mb-2 text-xs text-gray-600">
                        Replying to: {messages.find(m => m.id === message.replyTo)?.content || 'deleted message'}
                      </div>
                    )}
                    
                    <p className="text-text">{message.content}</p>
                    
                    <div className={`text-xs mt-1 flex items-center ${
                      message.senderId === 'current-user-id' ? 'justify-end' : 'justify-start'
                    }`}>
                      <span className="text-textgray">{formatTime(message.timestamp)}</span>
                      {message.edited && <span className="mx-1 text-gray-400">(edited)</span>}
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

                  {hoveredMessage === message.id && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className={`absolute flex space-x-1 ${
                        message.senderId === 'current-user-id' 
                          ? '-left-96 -top-16' 
                          : '-right-12 top-0'
                      }`}
                    >
                      <button
                        onClick={() => handleReply(message)}
                        className="p-1 bg-white rounded-full shadow hover:bg-gray-100"
                        title="Reply"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
                        </svg>
                      </button>

                      {message.senderId === 'current-user-id' && (
                        <>
                        {/* edit */}
                          <div className="bg-white border-t p-3 sticky bottom-0">
                            {/* editing */}
                            {editingMessage && (
                              <div className="bg-blue-50 border-r-4 border-blue-400 pr-2 mb-2 pl-3 py-1 text-sm flex justify-between items-start">
                                <div className="truncate">
                                  <div className="font-medium text-xs">Editing message</div>
                                  <div className="truncate text-xs">{editingMessage.content}</div>
                                </div>
                                <button 
                                  onClick={() => {
                                    setEditingMessage(null);
                                    setNewMessage('');
                                  }}
                                  className="text-gray-500 hover:text-gray-700 p-1"
                                >
                                  <IoMdClose className="w-4 h-4" />
                                </button>
                              </div>
                            )}

                            {/* input */}
                            <div className="flex items-center">
                              <input
                                ref={inputRef}
                                value={newMessage}
                                onChange={(e) => setNewMessage(e.target.value)}
                                onKeyPress={(e) => {
                                  if (e.key === 'Enter') {
                                    editingMessage ? handleEdit(message) : handleSendEdit();
                                  }
                                }}
                                placeholder={
                                  editingMessage 
                                    ? "Edit your message..."
                                    : replyingTo
                                      ? `Replying to ${replyingTo.senderId === 'current-user-id' ? 'yourself' : user.name}...`
                                      : "Type a message..."
                                }
                                className="flex-1 border rounded-full py-2 px-4 mx-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                              />
                              
                              <button
                                onClick={editingMessage ? handleSendEdit : handleSend}
                                disabled={!newMessage.trim() || (editingMessage !== null && newMessage === editingMessage.content)}
                                className={`p-2 rounded-full ${
                                  editingMessage
                                    ? 'bg-blue-500 hover:bg-blue-600'
                                    : 'bg-green-500 hover:bg-green-600'
                                } text-white disabled:bg-gray-300`}
                              >
                                {editingMessage ? (
                                  <IoMdCheckmark className="w-5 h-5" />
                                ) : (
                                  <IoMdSend className="w-5 h-5" />
                                )}
                              </button>
                            </div>
                          </div>
                        {/*end of edit  */}

                          <button
                            onClick={() => handleDelete(message)}
                            className="p-1 bg-white rounded-full shadow hover:bg-gray-100"
                            title="Delete"
                          >
                            <svg className="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </>
                      )}

                      <button
                        onClick={() => handleForward(message)}
                        className="p-1 bg-white rounded-full shadow hover:bg-gray-100"
                        title="Forward"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                        </svg>
                      </button>
                    </motion.div>
                  )}
                </div>
              )}
              {message.type === 'image' && message.file && (
                <div className="mt-2">
                  <img 
                     src={useObjectURL(message.file)|| undefined} 
                    alt="Sent image"
                    className="max-w-xs max-h-48 rounded-lg"
                    onLoad={() => URL.revokeObjectURL(URL.createObjectURL(message.file!))}
                  />
                </div>
              )}
              {message.type === 'document' && message.file && (
                <div className="mt-2 p-3 bg-gray-100 rounded-lg flex items-center">
                  <svg className="w-8 h-8 mr-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                  <div>
                    <p className="font-medium">{message.file.name}</p>
                    <p className="text-xs text-gray-500">
                      {(message.file.size / 1024).toFixed(1)} KB
                    </p>
                  </div>
                </div>
              )}
             
            </motion.div>
          ))}
        </AnimatePresence>
        <div ref={messagesEndRef} />
      </div>

      {/* Forward Modal */}
      {forwardingMessage && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-20">
          <div className="bg-white rounded-lg w-full max-w-md mx-4">
            <div className="p-4 border-b">
              <h3 className="font-bold text-lg">Forward to:</h3>
            </div>
            <div className="max-h-96 overflow-y-auto">
              {contacts.filter(c => c.id !== user.id).map(contact => (
                <div
                  key={contact.id}
                  onClick={() => {
                    onForward(forwardingMessage.id, contact.id);
                    setForwardingMessage(null);
                  }}
                  className="flex items-center p-3 hover:bg-gray-100 cursor-pointer"
                >
                  <img src={contact.avatar} alt={contact.name} className="w-10 h-10 rounded-full mr-3" />
                  <div>
                    <h4 className="font-medium">{contact.name}</h4>
                    <p className="text-xs text-gray-500">
                      {contact.isOnline ? 'Online' : `Last seen ${formatTime(contact.lastSeen || new Date())}`}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <div className="p-4 border-t">
              <button
                onClick={() => setForwardingMessage(null)}
                className="w-full py-2 text-red-500 font-medium"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white border-t p-3 sticky bottom-0">
        {replyingTo && (
          <div className="bg-gray-50 border-l-4 border-gray-300 pl-2 mb-2 text-xs text-gray-600 flex justify-between items-center">
            <div>
              <p>Replying to {replyingTo.senderId === 'current-user-id' ? 'yourself' : user.name}</p>
              <p className="truncate max-w-xs">{replyingTo.content}</p>
            </div>
            <button onClick={() => setReplyingTo(null)} className="text-gray-400 hover:text-gray-600">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        )}

        {editingMessage && (
          <div className="bg-blue-50 border-l-4 border-blue-300 pl-2 mb-2 text-xs text-blue-600 flex justify-between items-start">
            <div>
              <p>Editing message</p>
              <p className="truncate max-w-xs">{editingMessage.content}</p>
            </div>
            <button onClick={cancelActions} className="text-blue-400 hover:text-blue-600">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        )}
        
        <div className="flex items-center">
            <button 
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              className="mx-2 text-gray-500 hover:text-gray-700 p-1 rounded-full hover:bg-gray-100"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </button>
  
            <button 
              onClick={() => setShowAttachmentMenu(!showAttachmentMenu)}
              className="mx-2 text-gray-500 hover:text-gray-700 p-1 rounded-full hover:bg-gray-100"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
              </svg>
            </button>
                    
          <input
            ref={inputRef}
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder={
              editingMessage ? "Edit your message..." :
              replyingTo ? "Reply to message..." :
              "Type a message..."
            }
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
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </button>
        </div>
        {showAttachmentMenu && (
          <AttachmentMenu 
            onSelect={handleAttachmentSelect} 
            onClose={() => setShowAttachmentMenu(false)}
          />
        )}
        {showEmojiPicker && (
          <CustomEmojiPicker 
            onSelect={handleEmojiSelect}
            onClose={() => setShowEmojiPicker(false)}
          />
        )}
      </div>
    </div>
  );
};