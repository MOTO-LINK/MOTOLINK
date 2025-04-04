import { useState } from "react";
import { Avatar, List, ListItem, ListItemAvatar, ListItemText, IconButton, Typography, Box, Container } from "@mui/material";
import { FaUserCog, FaWallet, FaHistory, FaTags, FaBell, FaHeadset, FaCog, FaSignOutAlt, FaCamera } from "react-icons/fa";
import { color, motion } from "framer-motion";
import { z } from "zod";
import { Link } from "react-router-dom";  
import { IoIosArrowForward } from "react-icons/io";
import tailwindConfig from "../../tailwind.config";
import ResponsiveAppBar from "../components/Navbar";

const userSchema = z.object({
  name: z.string(),
  role: z.string(),
  avatar: z.string().url(),
});

const colors=tailwindConfig.theme.extend.colors;
const menuItems = [
  { title: "Personal Details", icon: <FaUserCog />, link: "/PersonalDetails", color: colors["btn"] },
  { title: "Wallet", icon: <FaWallet />, link: "/wallet" , color: colors["btn"] },
  { title: "Recent Rides", icon: <FaHistory />, link: "/recent-rides" , color: colors["btn"] },
  { title: "Offers", icon: <FaTags />, link: "/offers" , color: colors["btn"] },
  { title: "Notifications", icon: <FaBell />, link: "/notifications" , color: colors["btn"] },
  { title: "Support", icon: <FaHeadset />, link: "/support" , color: colors["btn"] },
  { title: "Settings", icon: <FaCog />, link: "/settings" , color: colors["btn"] },
  { title: "Log out", icon: <FaSignOutAlt />, link: "/logout", color: colors["red"] },
];

export default function Profile() {
  const [user, setUser] = useState({
    name: "Mohamed Ahmed",
    role: "Rider",
    avatar: "https://randomuser.me/api/portraits/men/10.jpg",
  });

  interface ImageChangeEvent extends React.ChangeEvent<HTMLInputElement> {
    target: HTMLInputElement & { files: FileList };
  }

  const handleImageChange = (event: ImageChangeEvent): void => {
    const file = event.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setUser((prevUser) => ({ ...prevUser, avatar: imageUrl }));
    }
  };

  return (
    <>
    <ResponsiveAppBar/>
    <Container maxWidth="lg" className=" min-h-screen text-white p-12 flex flex-col items-center">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <Typography variant="h4" sx={{fontWeight:500,textAlign:"center",mb:1}}>
          Profile
        </Typography>
      </motion.div>
      
      {/* Profile Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        whileHover={{ scale: 1.05 }}
        className="relative flex flex-col items-center"
      >
        <Avatar src={user.avatar} sx={{ width: 150, height: 150, border: `4px solid ${colors.btn}` }} />
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          style={{ display: "none" }}
          id="imageUpload"
        />
        <label htmlFor="imageUpload">
          <motion.div >
            <IconButton
              component="span"
              sx={{
                position: "absolute",
                bottom: 10,
                right: 10,
                background: colors["btn"],
                color: "black",
              }}>
              <FaCamera />
            </IconButton>
          </motion.div>
        </label>
      </motion.div>
      
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
        <Typography variant="h4" sx={{color:colors.textWhite,textAlign:"center",marginTop:3}}>
          {user.name}
        </Typography>
        <Typography variant="h6" sx={{color:colors.textWhite,textAlign:"center",marginBottom:3}}>
          {user.role}
        </Typography>
      </motion.div>
      
      {/* Menu List */}
      <List className="w-full max-w-2xl">
        {menuItems.map(({ title, icon, color, link }, index) => (
          <motion.div 
            key={title} 
            initial={{ opacity: 0, x: -20 }} 
            animate={{ opacity: 1, x: 0 }} 
            transition={{ duration: 0.3, delay: index * 0.1 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link to={link} style={{ textDecoration: "none" }}>
              <ListItem component="button" className="border-b border-gray-700 hover:bg-gray-800 transition p-6 flex items-center">
                  <ListItemAvatar>
                    <Typography sx={{color:color, fontSize: 25}} >
                        {icon}
                    </Typography>
                  </ListItemAvatar>
                  <ListItemText >
                    <Typography variant="h6" className="text-white font-semibold" sx={{fontSize: 18}}>
                      {title}
                    </Typography>
                  </ListItemText>
                  <IoIosArrowForward  className="text-gray-500 text-2xl" />
              </ListItem>
            </Link>
          </motion.div>
        ))}
      </List>
    </Container>
    </>
  );
}
