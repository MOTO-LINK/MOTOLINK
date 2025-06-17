import * as React from 'react';
import { AppBar, Box, Container, Toolbar } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import iconmain from "../../../assets/images/iconmain-removebg-preview.png";
import MobileMenu from './MobileMenu';
import DesktopActions from './DesktopActions';
import UserMenu from './UserMenu';

function ResponsiveAppBar() {
  const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(null);
  const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(null);
  const [openLogoutDialog, setOpenLogoutDialog] = React.useState(false);
  const navigate = useNavigate();

  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleLogoutClick = () => {
    setOpenLogoutDialog(true);
  };

  const handleLogoutConfirm = () => {
    setOpenLogoutDialog(false);
    handleCloseUserMenu();
    navigate("/");
  };

  const handleLogoutCancel = () => {
    setOpenLogoutDialog(false);
  };

  return (
    <AppBar position="static" className='bg-gold-1'>
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Link to="/">
                 <img src={iconmain} style={{ width: 120, height: 100 }} alt="logo" />
          </Link>
          <DesktopActions handleCloseUserMenu={handleCloseUserMenu} />

        </Toolbar>
      </Container>
    </AppBar>
  );
}

export default ResponsiveAppBar;
