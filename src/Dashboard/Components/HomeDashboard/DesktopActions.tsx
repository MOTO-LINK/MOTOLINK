import * as React from 'react';
import { Box, Button, MenuItem, Typography } from '@mui/material';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';

interface DesktopActionsProps {
  handleCloseUserMenu: () => void;
}

const DesktopActions: React.FC<DesktopActionsProps> = ({ handleCloseUserMenu }) => (
  <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' }, justifyContent: "flex-end", alignItems: "center" }}>
    <Box sx={{display: "flex", fontFamily: "rmedium"}}>

      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Link to={"/LoginDashboard"}>
          <Button
            variant="contained"
            sx={{
              backgroundColor: "black",
              color: "#D7B634",
              fontSize: "16px",
              padding: "12px 24px",
              borderRadius: "8px",
              textTransform: "none",
              marginRight: 5,
              display: "flex",
              gap: 1,
              "&:hover": {
                backgroundColor: "#333",
              },
            }}>
            Login
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M9 18V16H16V2H9V0H16C16.55 0 17.0208 0.195833 17.4125 0.5875C17.8042 0.979167 18 1.45 18 2V16C18 16.55 17.8042 17.0208 17.4125 17.4125C17.0208 17.8042 16.55 18 16 18H9ZM7 14L5.625 12.55L8.175 10H0V8H8.175L5.625 5.45L7 4L12 9L7 14Z" fill="#D7B634"/>
            </svg>
          </Button>
        </Link>
      </motion.div>
    </Box>
  </Box>
);

export default DesktopActions; 