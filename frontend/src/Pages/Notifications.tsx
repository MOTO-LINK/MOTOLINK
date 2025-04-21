import { JSX, useState } from "react";
import { motion } from "framer-motion";
import { z } from "zod";
import {  Card, CardContent, IconButton, TextField, Menu, MenuItem } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import tailwindConfig from "../../tailwind.config";
import ResponsiveAppBar from "../components/Navbar";

const notificationsSchema = z.array(
  z.object({
    id: z.number(),
    title: z.string(),
    message: z.string(),
    time: z.string(),
    avatar: z.string(),
    category: z.string(),
  })
);

const initialNotifications = [
    { id: 1, title: "System Update", message: "A new update is available.", time: "10:30 AM", avatar: "https://randomuser.me/api/portraits/men/1.jpg", category: "New" },
    { id: 2, title: "Meeting Reminder", message: "Don't forget the team meeting at 3 PM.", time: "9:15 AM", avatar: "https://randomuser.me/api/portraits/women/2.jpg", category: "New" },
    { id: 3, title: "Security Alert", message: "Unusual login attempt detected.", time: "Yesterday", avatar: "https://randomuser.me/api/portraits/men/3.jpg", category: "Important" },
    { id: 4, title: "Subscription Expired", message: "Your subscription has expired.", time: "2 days ago", avatar: "https://randomuser.me/api/portraits/women/4.jpg", category: "Archived" },
    { id: 5, title: "New Friend Request", message: "John Doe sent you a friend request.", time: "5 minutes ago", avatar: "https://randomuser.me/api/portraits/men/5.jpg", category: "Frequent" },
    { id: 6, title: "Reminder", message: "Doctor appointment at 4 PM.", time: "Today", avatar: "https://randomuser.me/api/portraits/women/6.jpg", category: "Old" },
    { id: 7, title: "Discount Offer", message: "50% off on selected items.", time: "2 hours ago", avatar: "https://randomuser.me/api/portraits/men/7.jpg", category: "New" },
    { id: 8, title: "Package Delivered", message: "Your package has been delivered.", time: "Yesterday", avatar: "https://randomuser.me/api/portraits/women/8.jpg", category: "Old" },
    { id: 9, title: "Password Changed", message: "Your password was successfully changed.", time: "3 days ago", avatar: "https://randomuser.me/api/portraits/men/9.jpg", category: "Important" },
    { id: 10, title: "Event Invitation", message: "You're invited to the annual gala.", time: "Last week", avatar: "https://randomuser.me/api/portraits/women/10.jpg", category: "Archived" },
    { id: 11, title: "Weather Update", message: "Heavy rain expected tomorrow.", time: "Now", avatar: "https://randomuser.me/api/portraits/men/11.jpg", category: "Frequent" },
    { id: 12, title: "Flight Confirmation", message: "Your flight is confirmed.", time: "1 hour ago", avatar: "https://randomuser.me/api/portraits/women/12.jpg", category: "New" },
    { id: 13, title: "Maintenance Notice", message: "Scheduled maintenance on servers.", time: "3 days ago", avatar: "https://randomuser.me/api/portraits/men/13.jpg", category: "Important" },
    { id: 14, title: "Library Due Date", message: "Your book is due for return tomorrow.", time: "2 hours ago", avatar: "https://randomuser.me/api/portraits/women/14.jpg", category: "Old" },
    { id: 15, title: "New Course Available", message: "Enroll in the latest Python course.", time: "Today", avatar: "https://randomuser.me/api/portraits/men/15.jpg", category: "New" },
    { id: 16, title: "Lost Item Found", message: "A lost item matching your description was found.", time: "5 days ago", avatar: "https://randomuser.me/api/portraits/women/16.jpg", category: "Archived" },
    { id: 17, title: "Software Update", message: "Version 2.1.0 is available now.", time: "Yesterday", avatar: "https://randomuser.me/api/portraits/men/17.jpg", category: "Frequent" },
    { id: 18, title: "New Job Listing", message: "A new job matching your profile is posted.", time: "4 hours ago", avatar: "https://randomuser.me/api/portraits/women/18.jpg", category: "New" },
    { id: 19, title: "Emergency Alert", message: "Fire drill scheduled at 10 AM tomorrow.", time: "6 days ago", avatar: "https://randomuser.me/api/portraits/men/19.jpg", category: "Important" },
    { id: 20, title: "Bank Statement", message: "Your monthly statement is ready.", time: "Last week", avatar: "https://randomuser.me/api/portraits/women/20.jpg", category: "Archived" }
  ];

export default function Notifications() {
  const [notifications, setNotifications] = useState(initialNotifications);
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const handleMenuOpen = (event: React.MouseEvent<HTMLButtonElement>, id: number) => {
    setAnchorEl(event.currentTarget);
    setSelectedId(id);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedId(null);
  };

  const handleDelete = () => {
    setNotifications(notifications.filter(n => n.id !== selectedId));
    handleMenuClose();
  };

  const filteredNotifications = notifications.filter(n => 
    (filter === "All" || n.category === filter) &&
    (n.title.toLowerCase().includes(search.toLowerCase()) || n.message.toLowerCase().includes(search.toLowerCase()))
  );
  const colors=tailwindConfig.theme.extend.colors;

const highlightText = (text: string, query: string): JSX.Element | string => {
    if (!query) return text;
    const parts: string[] = text.split(new RegExp(`(${query})`, "gi"));
    return (
        <>
            {parts.map((part: string, index: number) => 
                part.toLowerCase() === query.toLowerCase() ? <span key={index} className="bg-gold-1 text-black px-1">{part}</span> : part
            )}
        </>
    );
};

  return (
    <>
    <ResponsiveAppBar/>
    <div className=" min-h-screen p-4 text-white flex flex-col items-center">
      <div className="w-full max-w-2xl">
        <div className="flex justify-between items-center mb-10 mt-5">
          <h1 className="text-2xl font-bold">Notification</h1>
        </div>

        <div className="space-y-4 ">
          {filteredNotifications.map((notification) => (
            <motion.div
              key={notification.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="bg-black p-4 rounded-xl flex items-start gap-4 hover:shadow-[0px_0px_10px_orange] transition-shadow">
                <img
                  src={notification.avatar}
                  alt="Avatar"
                  width={50}
                  height={50}
                  className="rounded-full"
                />
                <div className="flex-1">
                  <h2 className="font-semibold text-lg text-textWhite">{highlightText(notification.title, search)}</h2>
                  <p className="text-gray-400 text-sm">{highlightText(notification.message, search)}</p>
                  <span className="text-gray-500 text-xs">{notification.time}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

    </div>
    </>
  );
}
