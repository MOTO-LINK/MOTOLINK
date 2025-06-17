import * as React from 'react';
import { Box, IconButton, Menu, MenuItem, Typography } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';

interface MobileMenuProps {
  anchorElNav: HTMLElement | null;
  handleOpenNavMenu: (event: React.MouseEvent<HTMLElement>) => void;
  handleCloseNavMenu: () => void;
}

const MobileMenu: React.FC<MobileMenuProps> = ({
  anchorElNav,
  handleOpenNavMenu,
  handleCloseNavMenu,
}) => (
  <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
    <IconButton
      size="large"
      aria-label="menu"
      aria-controls="menu-appbar"
      aria-haspopup="true"
      onClick={handleOpenNavMenu}
      color="inherit"
      sx={{marginLeft:65}}
    >
      <MenuIcon />
    </IconButton>
    <Menu
      id="menu-appbar"
      anchorEl={anchorElNav}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      keepMounted
      transformOrigin={{ vertical: 'top', horizontal: 'left' }}
      open={Boolean(anchorElNav)}
      onClose={handleCloseNavMenu}
      sx={{ display: { xs: 'block', md: 'none' } }}
    >
      {['Profile', 'Account', 'Dashboard', 'Logout'].map((item) => (
        <MenuItem key={item} onClick={handleCloseNavMenu}>
          <Typography sx={{ textAlign: 'center' }}>{item}</Typography>
        </MenuItem>
      ))}
    </Menu>
  </Box>
);

export default MobileMenu; 