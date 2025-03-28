import { motion } from 'framer-motion';
import { ChatUser } from '../lib/validationUserCard'; 

export const UserCard = ({ user }: { user: ChatUser }) => {
  // const formatDetailedTime = (date: Date): string => {
  //     const diffInSeconds = Math.floor((Date.now() - date.getTime()) / 1000);
      
  //     const days = Math.floor(diffInSeconds / 86400);
  //     const hours = Math.floor((diffInSeconds % 86400) / 3600);
  //     const minutes = Math.floor((diffInSeconds % 3600) / 60);
  //     const seconds = diffInSeconds % 60;
    
  //     const parts = [];
  //     if (days > 0) parts.push(`${days}d`);
  //     if (hours > 0) parts.push(`${hours}h`);
  //     if (minutes > 0) parts.push(`${minutes}m`);
  //     if (seconds > 0) parts.push(`${seconds}s`);
  //     return parts.length > 0 ? parts.join(' ') + ' ago' : 'Just now';
  // };
  // اني ممكن استخدم ديه لو عاوز اختصر الوقت وممكن استخدم الدالة الي فوق لو مش عاوز اختصره
  const formatTime = (date: Date): string => {
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    if (diffInSeconds < 10) return 'Just now';
    
    const minutes = Math.floor(diffInSeconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
  
    if (days > 0) {
      return `${days} ${days === 1 ? 'day' : 'days'} ago`;
    }
    
    if (hours > 0) {
      return `${hours} ${hours === 1 ? 'hour' : 'hours'} ago`;
    }
    
    if (minutes > 0) {
      return `${minutes} ${minutes === 1 ? 'minute' : 'minutes'} ago`;
    }
    
    return `${diffInSeconds} ${diffInSeconds === 1 ? 'second' : 'seconds'} ago`;
  };

  return (
    <div className="">
      <div className="">
        <div className="flex items-center justify-between px-1 py-1 hover:bg-bg1 hover:shadow-2xl hover:rounded-xl hover:w-[100%]  ">
            <div className="flex items-center">
                <motion.img src={user.avatar}  alt={user.name} className="w-16 h-16 rounded-full object-cover border-2 border-gold-1" whileHover={{ rotate: 5 }} transition={{ type: "spring" }}/>
                <div className="ml-4">
                    <h3 className="font-bold text-lg mb-2 text-textWhite truncate max-w-[180px]">
                             {user.name}
                    </h3>
                    <p className="text-gold-1 text-sm line-clamp-2">
                           {user.lastMessage.content}
                    </p>
                </div>
            </div>
            <div className="mt-4">
                <div className="flex flex-col items-center">
                  <span className="text-xs text-textWhite">
                    {formatTime(user.lastMessage.timestamp)}
                  </span>
                  {user.lastMessage.unreadCount && (
                    <motion.div
                      className="mt-1"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.2 }}
                    >
                      <span className="bg-gold-1 text-textWhite text-center text-xs px-2 py-1 rounded-full">
                        {user.lastMessage.unreadCount}
                      </span>
                    </motion.div>
                  )}
                </div>
           </div>
        </div>
      </div>
    </div>
  );
};

