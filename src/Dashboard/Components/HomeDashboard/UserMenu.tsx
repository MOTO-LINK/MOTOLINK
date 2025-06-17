import * as React from 'react';
import { Box, Menu, MenuItem, Typography, Button, Avatar, Tooltip, IconButton, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ExitToApp } from '@mui/icons-material';
import download from "../../../assets/images/download.jpeg";

interface UserMenuProps {
  anchorElUser: HTMLElement | null;
  handleOpenUserMenu: (event: React.MouseEvent<HTMLElement>) => void;
  handleCloseUserMenu: () => void;
  handleLogoutClick: () => void;
  openLogoutDialog: boolean;
  handleLogoutConfirm: () => void;
  handleLogoutCancel: () => void;
}

const UserMenu: React.FC<UserMenuProps> = ({anchorElUser,handleOpenUserMenu,handleCloseUserMenu,handleLogoutClick,openLogoutDialog,handleLogoutConfirm, handleLogoutCancel,}) => (
  <>
    <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
      <Tooltip title="Open settings">
        <IconButton onClick={handleOpenUserMenu} sx={{p:0}}>
          <Avatar alt="Profile" src={download} />
        </IconButton>
      </Tooltip>

      <Menu id="menu-appbar" anchorEl={anchorElUser} anchorOrigin={{ vertical: "top", horizontal: "right" }}
        keepMounted transformOrigin={{ vertical: "top", horizontal: "right" }} open={Boolean(anchorElUser)} onClose={handleCloseUserMenu}>
        <Box sx={{backgroundColor: "black", width: "25rem", paddingY: 2}}>
          
            <Link to={"/PersonalDetails"}>
                <div className='px-5 py-3' onClick={handleCloseUserMenu}>
                <div className='flex items-center gap-2'>
                    <img alt="Profile" src={download} className='w-14 h-14 rounded-full mr-4' />
                    <div>
                    <p className='text-textWhite'>
                        Ahmed Mohamed
                    </p>
                    <p className='text-textWhite'>
                        Hello, Ahmed
                    </p>
                    </div>
                </div>
                </div>
            </Link>

            <Link to={"/Chats"}>
                <div onClick={handleCloseUserMenu} className='px-5 py-2'>
                    <p className='text-textWhite font-medium '>
                    Chats
                    </p>
                </div>
            </Link>

            <Link to={"/Notifications"}>
                <div onClick={handleCloseUserMenu} className='px-5 py-2'>
                    <p className='text-textWhite font-medium '>
                        Notifications
                    </p>
                </div>
            </Link>

            <Link to={"/Wallet"}>
                <div className='px-4 py-3' onClick={handleCloseUserMenu}>
                <div className="bg-bgwhite p-4 rounded-lg w-[100%]" >
                    <p className='text-text font-[ibold]'>
                    EGP 1,500.00
                    </p>
                    <p className='text-text'>
                    Account Balance
                    </p>
                </div>
                </div>
            </Link>

            <Link to={"/SupportPage"}>
                <div onClick={handleCloseUserMenu} className='px-5 py-2'>
                    <p className='text-textWhite font-medium '>
                        Support
                    </p>
                </div>
            </Link>

            <Link to={"/TrackOrder"}>
                <div onClick={handleCloseUserMenu} className='px-5 py-2'>
                    <p className='text-textWhite font-medium '>
                        Track Order
                    </p>
                </div>
            </Link>

            <div className='px-4 py-2' onClick={handleLogoutClick}>
                <Button startIcon={<ExitToApp />} fullWidth sx={{ justifyContent: "flex-start", color: "error.main" }}>
                Logout
                </Button>
            </div>
            
        </Box>
      </Menu>
    </motion.div>

    <Dialog open={openLogoutDialog}
      onClose={handleLogoutCancel}
      aria-labelledby="logout-dialog-title"
      aria-describedby="logout-dialog-description"
    >
      <DialogTitle id="logout-dialog-title">Confirm Logout</DialogTitle>
      <DialogContent>
        <DialogContentText id="logout-dialog-description">
          Are you sure you want to log out? You will need to log in again to continue using the app.
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleLogoutCancel} color="inherit">
          Cancel
        </Button>
        <Button onClick={handleLogoutConfirm} color="error" variant="contained">
          Logout
        </Button>
      </DialogActions>
    </Dialog>
  </>
);

export default UserMenu; 