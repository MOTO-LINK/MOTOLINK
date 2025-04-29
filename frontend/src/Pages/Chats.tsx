import React, { useState } from 'react';
import ResponsiveAppBar from '../components/Navbar';
import LayoutChats from '../components/LayoutChats';
import { UserGrid } from '../components/UserGrid';
import { useChat } from '../lib/useChat';
import { ChatUser } from '../lib/validationUserCard';
import { ChatWindow } from '../components/ChatWindow';

const Chats = () => {
  const { users, loading, error, addMessage } = useChat();
    const [selectedUser, setSelectedUser] = useState<ChatUser | null>(null);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  return (
    <>
      <div className="bg-bglight shadow-2xl w-[30rem] -ml-5 -mt-4">
        <LayoutChats/>
        <UserGrid users={users} onSelect={setSelectedUser} />
      </div>
      <div className="flex-1">
        {selectedUser ? (
          <ChatWindow
            user={selectedUser}
            messages={selectedUser.messages}
            onSend={(content) => selectedUser && addMessage(selectedUser.id, content)}
            onBack={() => setSelectedUser(null)}
          />
        ) : (
          <div>Select a user to chat</div>
        )}
      </div>
    </>
  );
};

export default Chats;