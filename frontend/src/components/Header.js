import * as React from 'react';
import { AppBar, Menu, MenuItem  }from '@mui/material';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import { Typography, Container } from '@mui/material';
import { Avatar, Tooltip } from '@mui/material';
import { deepOrange } from '@mui/material/colors';


const settings = ['Profile', 'Account', 'Dashboard', 'Logout'];

const Header = () => {

  const [anchorElUser, setAnchorElUser] = React.useState(null);

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };


  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const containerStyle = {
    backgroundColor: "#364475"
  };

  return (
    <AppBar position="static">
      <Container maxWidth="xl" style={containerStyle}>
        <Toolbar disableGutters>
          <Typography style={{color: "#ffff"}}
            className="font-face-light"
            variant="h5"
            noWrap
            component="a"
            href=""
            sx={{
              mr: 2,
              textAlign: 'left',
              flexGrow: 1,
              fontFamily: 'Arial',
              fontWeight: 700,
              letterSpacing: '.1rem',
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            Learning Management System
          </Typography>

          <IconButton style={{color: "#ffff"}} aria-label="notification">
            <NotificationsNoneIcon/>
            </IconButton>


          <Box sx={{ flexGrow: 0 }}>
            <Tooltip title="View Profile">
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                <Avatar sx={{ bgcolor: deepOrange[500] }}>JT</Avatar>
              </IconButton>
            </Tooltip>
            <Menu
              sx={{ mt: '45px' }}
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
              {settings.map((setting) => (
                <MenuItem key={setting} onClick={handleCloseUserMenu}>
                  <Typography textAlign="center">{setting}</Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};
export default Header;
